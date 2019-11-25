define([
    "dojo/_base/declare",
    "dojo/aspect",
    "dojo/Evented",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/on",
    "dojo/query",
    "dijit/Tooltip",

    "dijit/_WidgetBase",
    "../../dijit/_TemplatedMixin",
    "dgrid/OnDemandGrid",
    "dgrid/tree",

    "esri/dijit/geoenrichment/utils/KeyboardUtil",
    "esri/dijit/geoenrichment/TriStateItem",

    "../../dijit/utils/DgridUtil",
    "../../dijit/utils/DomUtil",
    "../../dijit/utils/MouseUtil",
    "../../dijit/tooltips/TooltipUtil",
    "dojo/text!./templates/SelectableTreeGrid.html",
    "xstyle/css!./css/SelectableTreeGrid.css"
], function (
    declare,
    aspect,
    Evented,
    domClass,
    domConstruct,
    domStyle,
    on,
    dojoQuery,
    Tooltip,

    _WidgetBase,
    _TemplatedMixin,
    OnDemandGrid,
    tree,

    KeyboardUtil,
    TriStateItem,

    DgridUtil,
    DomUtil,
    MouseUtil,
    TooltipUtil,
    template
) {

    // Additional node properties
    //node.selectable - if false, the node's checkbox will be hidden
    //node.indepSelection - if true, the node's checkbox can be selected independently (not connected to the tree)
    //node.visible - if false, the node's row will not be shown
    //node.enabled - if false, the checkbox will be disabled

    // Shift + Click selection support

    var INDENT = 16;

    var _RowSelectionMixin = declare(null, {

        _selectedRowInfos: null,
        _lastSelectedRowInfo: null,
        _outsideHandler: null,
        _isSelectionFrozen: false,
        keepSelectionOnOutsideClick: false,

        _previouslySelectedRowsByNode: null,

        constructor: function () {
            this._previouslySelectedRowsByNode = new WeakMap();
        },

        // override
        buildRendering: function _build() {
            this._selectedRowInfos = {};
            this.inherited(_build, arguments);
        },

        // override
        postCreate: function _create() {
            this.inherited(_create, arguments);
            domClass.add(this.domNode, "esriMapsAnalystXNonSelectable");
        },

        _reselectSingleNode: function (node) {
            this.selectSingleRow(this._previouslySelectedRowsByNode.get(node), node);
        },

        selectSingleRow: function (row, node) {
            this.unselectAllRows();
            this._selectRow(row, node);
        },

        _selectRow: function (row, node) {
            domClass.add(row, this.selectedRowClass);
            domClass.add(row, "row-level-" + this._getNodeLevel(node));

            var nodeId = this.tree.getIdentity(node);
            var info = {
                row: row,
                node: node,
                nodeId: nodeId,
                index: node.parent && node.parent.children.indexOf(node)
            };
            this._selectedRowInfos[nodeId] = info;
            this._lastSelectedRowInfo = info;

            this._previouslySelectedRowsByNode.set(node, row);

            var self = this;
            this._outsideHandler = this._outsideHandler || on(document.body, "click", function () {
                if (!MouseUtil.isMouseOver(self.domNode) && !self._isSelectionFrozen && !self.keepSelectionOnOutsideClick) // Don't unselect rows if in "frozen" state
                    self.unselectAllRows();
            })
        },

        // Unselect a single row
        _unselectRow: function (row, node) {
            delete this._selectedRowInfos[this.tree.getIdentity(node)];
            domClass.remove(row, this.selectedRowClass);
        },

        unselectAllRows: function () {
            for (var id in this._selectedRowInfos)
                domClass.remove(this._selectedRowInfos[id].row, this.selectedRowClass);
            this._selectedRowInfos = {};
            this._lastSelectedRowInfo = null;

            this._outsideHandler && this._outsideHandler.remove();
            this._outsideHandler = null;
        },

        getSelectedRowNodes: function () {
            return this._getSelectedNodesRows().nodes;
        },

        selectRowNodes: function (nodes) {
            var self = this;
            nodes && nodes.forEach(function (node) {
                var row = self.grid.row(node);
                row && row.element && self._selectRow(row.element, node);
            });
        },

        freezeRowSelection: function () {
            this._isSelectionFrozen = true;
        },

        unfreezeRowSelection: function () {
            this._isSelectionFrozen = false;
        },

        _getSelectedNodesRows: function () {
            var nodes = [];
            var rows = [];
            var infos = [];
            for (var id in this._selectedRowInfos)
                infos.push(this._selectedRowInfos[id]);

            // sort by the order in the tree
            infos.sort(function (i1, i2) { return i1.index - i2.index; }); // assending
            infos.forEach(function (info) {
                nodes.push(info.node);
                rows.push(info.row);
            });

            return {
                nodes: nodes,
                rows: rows
            };
        },

        _emitSelectedRowsEvent: function () {
            var info = this._getSelectedNodesRows();
            if (info.nodes.length)
                this.onRowsSelected(info.nodes, info.rows);
        }
    });

    return declare([_WidgetBase, _TemplatedMixin, Evented, _RowSelectionMixin], {
        templateString: template,

        tree: null,                             // SelectableTree. Should be passed in options.
        grid: null,                             // Widget. Created internally.
        gridClass: "",                          // String. Grid class.

        // flags to control grid
        highlightSelected: true,                // Boolean. If true, rows will be highlighted if their nodes are selected.
        firstColumns: null,                     // [] of columns to be added additionally before the checkbox column.
        additionalColumns: null,                // [] of columns to be added additionally after the checkbox column, if you specify a column with a field "label" it will be mixed in to the default label column.
        showRootCheckbox: true,                 // Boolean. If true, the root checkbox will be shown.
        showCheckboxColumn: true,               // Boolean. If true, the checkbox column will be shown.
        showHeader: true,                       // Boolean. If true, the grid header will be shown.
        labelColumnField: "label",              // String.
        gridParams: null,                       // Object. Optional Parameters to pass into the creation of the OnDemandGrid

        keepContentUnderScroll: undefined,      // Boolean. if true the content will keep its width regardless of the presence of the scroll bar. Default is undefined - no action.

        hideInvisibleExpandoIcons: false,       // Boolean. If true, invisible expando icons will be hidden.
        expandOnNodeClick: false,               // Boolean. If true, a click on node containing child nodes will toggle expand/collapse mode.
        // Otherwise, a click on node label will toggle node selection.

        checkLimit: 0,                          // Number | Function(tree, numSelected) => Number (number of nodes that can be checked totally for this grid).
        checkLimitMessage: null,                // String. If specified, a tooltip will be shown over a checkbox.
        checkLimitMessageTimeout: 5000,         // Number. Timeout of the limit tooltip in ms.
        handleMultipleCheck: false,             // Boolean | Function(node): Boolean If true, shift+click will toggle all sibling nodes with checkboxes from the previously clicked node.

        // row selection
        enableRowSelection: false,              // Boolean. If true, the grid will support selection of row elements (as in a list). This has nothing to do with checkbox selection.
        enableMultipleRowSelection: false,      // Boolean. If true, the grid will support selection of multiple row elements (as in a list). This has nothing to do with checkbox selection.
        allowSelectionFromManyParents: false,   // Boolean. If true, the grid will support selection of row elements that are owned by different parents. False by default.
        selectedRowFilter: null,                // Function(node) => Boolean should return true if the node can be selected.
        selectedRowClass: "row-selected",       // String.
        enableHeaderLabelToggleClick: true,     // Boolean. If true and showRootCheckbox is true, clicking on the header label will toggle the selection.

        defaultExpand: null,                    // Object. Default expand state.

        fitParentSize: false,                   // If true, the grid will occupy all available space of the outher div.

        renderAllRows: false,                   // Boolean. If true, all rows will be rendered upon refresh. Otherwise, rows will be rendered on demand.                
        rowPostProcessor: null,                 // Function(row, node).

        // private properties

        _rootCheckbox: null,
        _checkboxes: null,
        _lastCheckedNode: null,

        // This method can be overriden to show the number of selected leaf nodes on bottom
        updateSelectionCountDiv: function (div, count) { },

        // This method should be overriden if label is requested in another way
        getLabel: function (node, isTreeRoot) {
            return node.label;
        },

        // override
        postCreate: function _create() {
            this.inherited(_create, arguments);
            this._createGrid();
        },

        // Needed in order to correctly size the grid after it's displayed.
        resize: function () {
            this.grid.resize();

            this._updateCheckboxState(this._rootCheckbox);
            for (var id in this._checkboxes)
                this._updateCheckboxState(this._checkboxes[id]);

            this._emitSelectionChanged();
        },

        setWidth: function (value) {
            this.grid && this.grid.domNode && domStyle.set(this.grid.domNode, "width", value + "px");
        },

        setHeight: function (value) {
            this.grid && this.grid.domNode && domStyle.set(this.grid.domNode, "height", value + "px");
        },

        row: function (data) {
            return this.grid.row(data);
        },

        cell: function (data) {
            return this.grid.cell(data);
        },

        _labelColumn: null,

        _createGrid: function () {
            var self = this;

            this._checkboxes = {};

            // Create label column either as simple column or tree column.
            var labelColumn = {
                label: this.getLabel(this.tree.root, true),
                sortable: false,
                field: this.labelColumnField,
                renderCell: this._renderLabel.bind(this),
                renderHeaderCell: this._renderLabelHeader.bind(this, this.tree.root)
            };

            var customLabelColumn;
            if (this.additionalColumns && this.additionalColumns.length) {
                customLabelColumn = this.additionalColumns.filter(function (c) {
                    return c.field === self.labelColumnField;
                })[0];

                if (customLabelColumn) {
                    // pass some properties
                    for (var id in labelColumn) {
                        if (customLabelColumn[id] === undefined)
                            customLabelColumn[id] = labelColumn[id];
                    }
                    labelColumn = customLabelColumn; // preserve the passed instance
                }
            }

            labelColumn.indentWidth = labelColumn.indentWidth || INDENT;
            labelColumn = this._prepareTreeColumn(labelColumn);
            this._labelColumn = labelColumn;

            var columns = [];

            if (this.firstColumns)
                columns = columns.concat(this.firstColumns);

            if (this.showCheckboxColumn)
                columns.push({
                    label: "",
                    field: "checkbox",
                    sortable: false,
                    renderCell: this._renderCheckboxForColumn.bind(this),
                    renderHeaderCell: this._renderCheckboxForColumn.bind(this, this.tree.root)
                });

            if (!customLabelColumn)
                columns.push(labelColumn);

            if (this.additionalColumns)
                columns = columns.concat(this.additionalColumns);

            var gridClasses = ["esriMapsAnalystXSelectableTreeGrid"];
            this.gridClass && gridClasses.push(this.gridClass);
            this.fitParentSize && gridClasses.push("fitParentSize");

            // Mixin any passed in grid parameters:
            var params = Object.assign({
                class: gridClasses.join(" "),
                keepScrollPosition: true,
                store: this.tree,
                columns: columns
            }, this.gridParams);

            // Create grid
            this.grid = this._createGridObject(params, this.gridContainer);
            this.own(this.grid);

            this.grid._expanded = this.defaultExpand || this.grid._expanded || {};

            DgridUtil.oddEvenFix(this.grid);

            this.own(on(this.tree, "updated", this._onStoreUpdated.bind(this)));

            this._addKeepScrollHandlers();

            this._addGridHandlers();

            // render settings

            if (this.renderAllRows) {
                this.grid.minRowsPerPage = 1E4;
                this.grid.maxRowsPerPage = 1E4 + 250;
            }

            this.grid.startup();

            TooltipUtil.autoTooltip(this.domNode);

            if (!this.showHeader)
                domClass.add(this.domNode, "esriMapsAnalystXGridNoHeader");

            // listen to expand toggle

            var colSelector = ".dgrid-content .dgrid-column-labelColumn";
            on(this.grid.domNode, ".dgrid-expando-icon:click," + colSelector + ":dblclick," + colSelector + ":keydown", function (event) {
                var row = self.grid.row(event);
                row && self.onExpandChangedUser(row.data);
            });
        },

        _createGridObject: function (params, container) {
            return new OnDemandGrid(params, container);
        },

        onRowInserted: function (row, node) {
            // can be overriden
        },

        _addGridHandlers: function () {

            var self = this;
            this.own(aspect.after(this.grid, "insertRow", function (row) {
                var node = row && self.grid._rowIdToObject[row.id];

                if (row) {
                    handleRowVisibility(row, node);
                    handleRowSelection(row, node);
                }
                if (node) {
                    self._updateRowHighlighting(node, row);
                    self.onRowInserted(row, node);
                }

                self.rowPostProcessor && self.rowPostProcessor(row, node);

                return row;
            }));

            function handleRowVisibility(row, node) {
                if (node && self.hideInvisibleExpandoIcons) {
                    if (!node.children || !node.children.length) {
                        var expandoIcon = dojoQuery(".dgrid-expando-icon", row)[0];
                        if (expandoIcon)
                            expandoIcon.style.width = "0";
                    }
                }
                DomUtil[node && node.visible === false ? "hide" : "show"](row);
            }

            function handleRowSelection(row, node) {
                if (!self.enableRowSelection || !node.parent || (self.selectedRowFilter && !self.selectedRowFilter(node)))
                    return;

                domClass.add(row, "esriMapsAnalystXClickable");

                on(row, "click", function (event) {
                    setTimeout(function () {

                        if (self._isSelectionFrozen)
                            return;

                        if (event.shiftKey && self.enableMultipleRowSelection) {
                            // check  the last selected row and this row have the same parent
                            if (self._lastSelectedRowInfo && self._lastSelectedRowInfo.row.parentNode && self._lastSelectedRowInfo.node.parent === node.parent) {
                                var previousRowIndex = DomUtil.getChildIndex(self._lastSelectedRowInfo.row.parentNode, self._lastSelectedRowInfo.row);
                                var currentRowIndex = DomUtil.getChildIndex(row.parentNode, row);

                                // Determine the starting and ending rows in the grid, we want to always move down in the list (e.g. so we can nextSibling)
                                var startRow = previousRowIndex <= currentRowIndex ? self._lastSelectedRowInfo.row : row;
                                var endRow = previousRowIndex <= currentRowIndex ? row : self._lastSelectedRowInfo.row;

                                var nextRow = startRow;

                                // Handle case when start/end rows are the same
                                if (startRow.id !== endRow.id) {
                                    do {
                                        var nd = self.grid.row(nextRow).data;

                                        self._selectRow(nextRow, nd);

                                        if (nextRow.id === endRow.id)
                                            break;

                                        nextRow = nextRow.nextSibling;

                                    } while (nextRow);
                                }
                            }
                            else
                                self.selectSingleRow(row, node);

                            DomUtil.stealFocus(); // Hack Fix for IE
                        }
                        else if (KeyboardUtil.isCtrl(event) && self.enableMultipleRowSelection) {
                            // check the last selected row and this row have the same parent
                            if (self._lastSelectedRowInfo && self._lastSelectedRowInfo.row.parentNode && self._lastSelectedRowInfo.node.parent === node.parent || self.allowSelectionFromManyParents) {
                                if (self._selectedRowInfos[node.id])
                                    self._unselectRow(row, node);
                                else
                                    self._selectRow(row, node)
                            }
                            else
                                self.selectSingleRow(row, node);
                        }
                        else
                            self.selectSingleRow(row, node);

                        self._emitSelectedRowsEvent();
                    });
                });
            }
        },

        _addKeepScrollHandlers: function () {
            var self = this;

            if (!this.fitParentSize && this.keepContentUnderScroll === undefined) return;

            function updateContentWidth(result) {
                if (!self.grid.contentNode) return result;

                if (self.fitParentSize) {
                    // In the float grid mode, the whole width of grid can be greater than the scroller node.
                    // We need to identify the case when scrollers are not shown and correct the header node
                    // right offset and the content node width if necessary.
                    var scrollInfo = DomUtil.hasScrollbars(self.grid.bodyNode);
                    self.grid.headerNode.style[self.isLeftToRight() ? "right" : "left"] = !scrollInfo.w ? "0px" : "";
                    self._lastContentWidth = self.grid.contentNode.style.width || self._lastContentWidth || "";
                    self.grid.contentNode.style.width = !scrollInfo.h ? "" : self._lastContentWidth;
                }
                else if (self.keepContentUnderScroll)
                    // In the fixed-width grid, the last columns have a fixed size and when scroller appears, last columns move left, but 
                    // their headers stay unchanged. As a result the column separator lines become broken.
                    // So, we should do the opposite action: always set the content width attribute on resize or refresh.
                    self.grid.contentNode.style.width = self.grid.headerNode.firstChild.offsetWidth + "px";
                else if (self.keepContentUnderScroll === false)
                    // Dgrid sets contentNode width on resize if it differs from header width.
                    // In our case, the scroller doesn't go on header and the header width is greater than content node width.
                    // An alternative to the previous solution is to remove the width style here.
                    self.grid.contentNode.style.width = "";
                return result;
            };

            aspect.before(this.grid, "refresh", function () {
                self.hideCheckLimitMessage();
                self._lastCheckedNode = null;
            })
            aspect.after(this.grid, "resize", updateContentWidth);
            aspect.after(this.grid, "refresh", updateContentWidth);
        },

        _getNodeLevel: function (node) {
            var level = -1;
            var p = node && node.parent;
            while (p) {
                level++;
                p = p.parent;
            }
            return level;
        },

        _prepareTreeColumn: function (labelColumn) {
            return this._wrapTreeColumn(tree(labelColumn));
        },

        _wrapTreeColumn: function (treeColumn) {
            return treeColumn;
        },

        _onStoreUpdated: function () {
            this._checkboxes = {};
            this._refreshGrid();

            if (this._rootCheckbox)
                this._updateCheckboxState(this._rootCheckbox);

            this._emitSelectionChanged();
        },

        _emitSelectionChanged: function (toggledTreeNode) {
            var count = this.tree.root.selectCount;
            this.updateSelectionCountDiv(this.selectionCounter, count);
            this.emit("SelectionChanged", { selected: count, toggledTreeNode: toggledTreeNode });
        },

        refresh: function () {
            //console.log("SelectableTreeGrid.refresh();");
            this._refreshGrid();
            this.refreshCheckboxes();
        },

        _isRefreshSuspended: false,

        setRefreshSuspended: function (value) {
            this._isRefreshSuspended = value;
        },

        _refreshGrid: function () {
            if (this._isRefreshSuspended)
                return;

            var scrollPosition = this.grid.getScrollPosition();
            this.grid.refresh();
            this.grid.scrollTo(scrollPosition);

            // Mark selected rows again as they were unselected in grid.refresh()
            for (var id in this._selectedRowInfos) {
                if (this.grid.row(this._selectedRowInfos[id].node).element)
                    this._selectRow(this.grid.row(this._selectedRowInfos[id].node).element, this._selectedRowInfos[id].node);
            }
        },

        //----------------------------------------
        // Scroll
        //----------------------------------------

        getScrollPosition: function () {
            return this.grid && this.grid.getScrollPosition();
        },

        setScrollPosition: function (value) {
            return this.grid && this.grid.scrollTo(value);
        },

        //----------------------------------------
        // Render checkboxes
        //----------------------------------------

        _renderCheckbox: function (node) {
            if (!node.leafCount && node !== this.tree.root) // root checkbox has to be created in any case, because rendering of the header is rare
                return document.createTextNode(""); // No checkbox if nothing to select

            if (!this.showCheckboxColumn || (node.selectable === false && node.indepSelection === undefined))
                return document.createTextNode(""); // No checkbox if can't be selected

            var checkbox = new TriStateItem(null, { class: "esriStyleInTable" });
            checkbox.autoToggle = false;
            checkbox.node = node;
            this._updateCheckboxState(checkbox, node);

            if (node.enabled === false)
                checkbox.set("disabled", true);

            // create back references from nodes to checkboxes
            if (node === this.tree.root) {
                this._rootCheckbox = checkbox;
                DomUtil[this.showRootCheckbox ? "show" : "hide"](checkbox.domNode);
            }
            else
                this._checkboxes[this.tree.getIdentity(node)] = checkbox;

            checkbox.onClick = this._onCheckboxClick.bind(this, node, checkbox);

            return checkbox;
        },

        _renderCheckboxForColumn: function (node) {
            var checkbox = this._renderCheckbox(node);
            return checkbox && checkbox.domNode; // just don't return the domNode if root checkbox should not be shown
        },

        refreshCheckboxes: function () {
            // Update all checkboxes
            this._rootCheckbox && this._updateCheckboxState(this._rootCheckbox);
            for (var id in this._checkboxes)
                this._updateCheckboxState(this._checkboxes[id]);
        },

        clearLastCheckInfo: function () {
            this._lastCheckedNode = null;
        },

        _onCheckboxClick: function (node, checkbox, event) {
            event.stopPropagation(); // not to confuse checkbox selection with row selection

            this.hideCheckLimitMessage();

            var canCheckMultiple = this.handleMultipleCheck && (typeof this.handleMultipleCheck !== "function" || this.handleMultipleCheck(node));

            if (canCheckMultiple && event.shiftKey && this._tryToggleMultipleNodes(this._lastCheckedNode, node, checkbox || event)) {
                this._lastCheckedNode = node;
                return;
            }

            this._lastCheckedNode = canCheckMultiple ? node : null;
            this._toggleNodeSelection(node, checkbox || event);
            this.refreshCheckboxes();
        },

        _tryToggleMultipleNodes: function (lastNode, node, checkboxOrEvent) {
            // Can toggle multiple nodes if all of them belong to the same parent
            if (!lastNode || lastNode === node || lastNode.parent !== node.parent)
                return false;

            var siblings = node.parent.children,
                startIndex = siblings.indexOf(lastNode),
                endIndex = siblings.indexOf(node),
                step = startIndex < endIndex ? 1 : -1;

            // Collect nodes to be unchecked and checked in two different arrays.
            var nodesToUncheck = [],
                nodesToCheck = [];

            for (var i = startIndex + step; ; i += step) {
                var child = siblings[i],
                    needSelect = child.indepSelection === undefined ? !child.selected : !child.indepSelection;
                (needSelect ? nodesToCheck : nodesToUncheck).push(child);
                if (i === endIndex)
                    break;
            }

            // We at first uncheck nodes and then check nodes to not exceed check limit.
            nodesToUncheck.forEach(function (child) {
                this._toggleNodeSelection(child, checkboxOrEvent);
            }, this);

            nodesToCheck.every(function (child) {
                return this._toggleNodeSelection(child, checkboxOrEvent);
            }, this);

            this.refreshCheckboxes();
            return true;
        },

        _toggleNodeSelection: function (node, checkboxOrEvent) {
            var newValue = node.indepSelection === undefined ? !node.selected : !node.indepSelection;

            if (newValue && this.checkLimit) {
                // check if the selection can happen
                var numSelected = this.getSelectedNodes().length,
                    selectionLimit = typeof this.checkLimit === "function" ? this.checkLimit(this.tree, numSelected) : this.checkLimit;

                if (numSelected >= selectionLimit) {
                    if (node.indepSelection === undefined && node.children && this.tree.getSelectionState(node) !== false)
                        newValue = false; // just toggle the value for a root or branch node
                    else {
                        this.showCheckLimitMessage(checkboxOrEvent);
                        return false;
                    }
                }
            }

            var isToggled = true;
            if (node.indepSelection === undefined) {
                // selectionLimit will prevent from selecting too many nodes
                isToggled = this.tree.changeSelect(node, newValue, selectionLimit);
                !isToggled && this.showCheckLimitMessage(checkboxOrEvent);
            }
            else
                node.indepSelection = newValue;

            this._emitSelectionChanged(node);
            return isToggled;
        },

        _checkLimitHandler: null,

        showCheckLimitMessage: function (checkboxOrEvent) {
            if (this.checkLimitMessage) {
                var node = checkboxOrEvent && (checkboxOrEvent.domNode || checkboxOrEvent.target);
                if (node) {
                    Tooltip.show(this.checkLimitMessage, node, ["above", "below"]);
                    var removeTooltip = function () {
                        node && Tooltip.hide(node);
                        node = null;
                    };
                    setTimeout(removeTooltip, this.checkLimitMessageTimeout);
                    this._checkLimitHandler = removeTooltip;
                    this.onCheckLimitReached(removeTooltip);
                }
            }
        },

        hideCheckLimitMessage: function () {
            this._checkLimitHandler && this._checkLimitHandler();
            this._checkLimitHandler = null;
        },

        onCheckLimitReached: function (removeHandler) { },

        _updateCheckboxState: function (checkbox) {
            if (!checkbox)
                return;

            var selection = this._getNodeSelection(checkbox.node);
            checkbox.set("checked", selection);

            this._updateRowHighlighting(checkbox.node, null, selection);
        },

        _getNodeSelection: function (node) {
            return node.indepSelection !== undefined ? node.indepSelection : this.tree.getSelectionState(node);
        },

        _updateRowHighlighting: function (node, rowElement, selection) {
            if (!this.highlightSelected || !node)
                return;

            selection = selection !== undefined ? selection : this._getNodeSelection(node);

            rowElement = rowElement || (this.grid && this.row(node).element);
            if (rowElement) {
                if (selection === true && (node.indepSelection !== undefined || node.selectable !== false)/* && this.showCheckboxColumn*/)
                    domClass.add(rowElement, "selected");
                else
                    domClass.remove(rowElement, "selected");
            }
        },

        //----------------------------------------
        // Render labels
        //----------------------------------------

        _renderLabel: function (node, value, td) {
            var label = this._renderLabelNode(node);
            this._provideLabelClickAction(label, td, node);
            return label;
        },

        _provideLabelClickAction: function (label, td, node) {
            var clickNode = label;
            var clickAction = this.expandOnNodeClick && node.children ?
                node.children.length && (clickNode = td, function () {
                    this.toggleExpand(node);
                    this.onExpandChangedUser(node);
                }.bind(this)) :
                node.enabled !== false && this.showCheckboxColumn ? this._onCheckboxClick.bind(this, node, null) : null;

            if (clickAction) {
                domClass.add(clickNode, "esriMapsAnalystXClickable");
                on(clickNode, "click", function (event) {
                    event.stopPropagation();
                    clickAction(event);
                });
            }
        },

        _renderLabelNode: function (node) {
            return domConstruct.create("div", {
                class: "esriMapsAnalystXSelectableTreeLabel TrimWithEllipses",
                innerHTML: this.getLabel(node)
            });
        },

        _renderLabelHeader: function (node) {
            var label = domConstruct.create("div", {
                class: "esriMapsAnalystXSelectableTreeLabel TrimWithEllipses",
                innerHTML: this.getLabel(node) || this._labelColumn && this._labelColumn.label || ""
            });

            if (this.enableHeaderLabelToggleClick && this.showRootCheckbox) {
                domClass.add(label, "esriMapsAnalystXClickable");
                on(label, "click", this._onCheckboxClick.bind(this, node, null));
            }
            return label;
        },

        //----------------------------------------
        // events
        //----------------------------------------

        onRowsSelected: function (nodes, rows) { }, // user change only

        //----------------------------------------
        // checkbox selection
        //----------------------------------------

        isNodeSelected: function (node) {
            return node && (node.selected || node.indepSelection);
        },

        // considers indepSelection.
        getSelectedNodes: function () {
            var normalNodes = this.tree.getSelectedNodes(false);
            var indepNodes = this._getIndepSelectedNodes();
            return normalNodes.concat(indepNodes);
        },

        _getIndepSelectedNodes: function () {
            var indepNodes = [];

            function checkNodes(node) {
                if (!node)
                    return;
                if (node.indepSelection)
                    indepNodes.push(node);
                node.children && node.children.forEach(checkNodes);
            }

            checkNodes(this.tree.root);

            return indepNodes;
        },

        // Note: getSelectedState() and setSelectedState() methods rely on ids.
        getSelectedState: function () {
            if (!this.tree)
                return null;

            var state = {
                normalSelection: {},
                indepSelection: {}
            };
            var normalNodes = this.tree.getSelectedNodes(false);
            normalNodes && normalNodes.forEach(function (node) {
                state.normalSelection[node.id] = true;
            });

            var indepNodes = this._getIndepSelectedNodes();
            indepNodes && indepNodes.forEach(function (node) {
                state.indepSelection[node.id] = true;
            });

            return state;
        },

        setSelectedState: function (state) {
            if (!this.tree)
                return;

            this.tree.changeSelect(this.tree.root, false); // unselect all first

            if (state) {
                for (var id in state.normalSelection) {
                    var node = this.tree.get(id);
                    node && this.tree.changeSelect(node, true);
                }

                for (var id in state.indepSelection) {
                    node = this.tree.get(id);
                    if (node) node.indepSelection = true;
                }
            }

            this.refreshCheckboxes();
        },

        // doRefresh - Default true.
        setNodeSelected: function (node, value, doRefresh) {
            if (!node)
                return;

            if (node.indepSelection !== undefined)
                node.indepSelection = value
            else
                this.tree.changeSelect(node, value);

            if (doRefresh !== false)
                this.refreshCheckboxes();
        },

        //----------------------------------------
        // expanded state
        //----------------------------------------

        isExpanded: function (nodeOrId) {
            var id = typeof nodeOrId === "string" ? nodeOrId : nodeOrId[this.tree.idProperty];
            return this.grid._expanded && this.grid._expanded[id];
        },

        // updateGrid - default true, otherwise you will have to call refresh() method to apply the changes.
        setExpanded: function (nodeOrId, value, updateGrid) {
            var id = typeof nodeOrId == "string" ? nodeOrId : nodeOrId[this.tree.idProperty];
            if (id === undefined)
                return;

            if (updateGrid !== false) {
                var row = this.grid.row(id);
                row && row.element && this.grid.expand(id, value);
            }
            else
                this.grid._expanded[id] = value;
        },

        toggleExpand: function (nodeOrId) {
            this.setExpanded(nodeOrId, !this.isExpanded(nodeOrId));
        },

        getExpandedState: function () {
            return Object.assign({}, this.grid._expanded);
        },

        setExpandedState: function (state) {
            this.grid._expanded = state || {};
        },

        onExpandChangedUser: function (node) { },

        destroy: function () {
            this.unselectAllRows();
            this.inherited(arguments);
        }
    });
});
