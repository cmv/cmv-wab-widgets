define([
    "dojo/_base/declare",
    "./FilteringSelect",

    "esri/dijit/geoenrichment/SelectableTree",
    "../../widgets/SelectableTreeGrid/SelectableTreeGrid",

    "xstyle/css!./css/FilteringSelect.css"
], function (
    declare,
    FilteringSelect,

    SelectableTree,
    SelectableTreeGrid
) {
    function treeDataToItems(treeData, widget) {
        var items = [];
        treeData.forEach(function (parentNode) {
            parentNode.children.forEach(function (child) {
                var item = {};
                item[widget.idProperty] = child[widget.idProperty];
                item[widget.labelProperty] = child[widget.labelProperty];
                item.__item = child;
                items.push(item);
            });
        });
        return items;
    };

    function filterTreeDataByItems(treeData, items, widget) {
        var idsHash = {};
        items.forEach(function (item) {
            idsHash[item[widget.idProperty]] = item;
        });

        var filteredData = [];

        treeData.forEach(function (parentNode) {
            var fc = parentNode.children.filter(function (child) {
                return idsHash[child[widget.idProperty]];
            });
            if (fc.length) {
                var parentCopy = {};
                parentCopy[widget.idProperty] = parentNode[widget.idProperty];
                parentCopy[widget.labelProperty] = parentNode[widget.labelProperty];
                parentCopy.children = fc.map(function (c) {
                    var childCopy = {};
                    childCopy[widget.idProperty] = c[widget.idProperty];
                    childCopy[widget.labelProperty] = c[widget.labelProperty];
                    return childCopy;
                });
                filteredData.push(parentCopy);
            }
        });

        return { treeData: filteredData, idsHash: idsHash };
    };

    var MySelectableTreeGrid = declare(SelectableTreeGrid, {
        // flags
        showRootCheckbox: false,
        showCheckboxColumn: false,
        enableRowSelection: true,
        expandOnNodeClick: true,

        baseTree: null,

        hostWidget: null,
        defaultExpand: null,

        _firstTimeExpand: true,

        // override
        getLabel: function (node, isTreeRoot) {
            return node[this.labelProperty];
        },

        // override
        onRowsSelected: function (treeNodes, rows) {
            var treeNode = treeNodes && treeNodes[0];
            var row = rows && rows[0];
            if (treeNode && !treeNode.children) {
                row.setAttribute("item", treeNode[this.idProperty]);
                this.onChange(row);
            }
        },

        createOptions: function (results, options, labelFunc) {
            var r = filterTreeDataByItems(this.baseTree.data, results, this);
            this.items = r.idsHash;
            this.tree.clear();

            if (this._firstTimeExpand) {
                this._firstTimeExpand = false;

                var expandedObj;
                if (!this.defaultExpand) {
                    expandedObj = {};
                    var self = this;
                    r.treeData.forEach(function (parentNode) {
                        expandedObj[parentNode[self.idProperty]] = true;
                    });
                }
                else
                    expandedObj = Object.assign({}, this.defaultExpand);

                this.grid._expanded = expandedObj;
            }

            this.tree.addNodes(r.treeData);
            this.refresh();
        },

        getHighlightedOption: function () {
        },

        highlightFirstOption: function () {
        },

        highlightLastOption: function () {
        },

        clearResultList: function () {
            this.tree.clear();
        },

        onChange: function (listItem) { }
    });

    var FilteringSelectTree = declare(FilteringSelect, {

        dropDownClass: MySelectableTreeGrid,

        tree: null,

        autoComplete: false,

        defaultExpand: null,

        // override
        postCreate: function () {
            this.inherited(arguments);
            if (this.tree)
                this.setItems(this._getStoreItemsFromTree());
        },

        _setTreeAttr: function (value) {
            this.tree = value;
            this._isCreated && this.setItems(this._getStoreItemsFromTree());
            if (this.dropDown)
                this.dropDown.baseTree = this.tree;
        },

        _getStoreItemsFromTree: function () {
            return treeDataToItems(this.tree.data, this);
        },

        // override
        _startSearch: function (/*String*/ key) {
            // summary:
            //		Starts a search for elements matching key (key=="" means to return all items),
            //		and calls _openResultList() when the search completes, to display the results.
            if (!this.dropDown) {
                var popupId = this.id + "_popup";
                this.dropDown = new this.dropDownClass({
                    gridClass: "esriMapsAnalystXSelectableTreeGrid esriMapsAnalystXFilteringSelect_treeGrid",
                    onChange: function() {
                        //RT: is _selectOption defined? Used a wrapper function to avoid breaking if not.
                        return this._selectOption.apply(this,arguments);
                    }.bind(this),
                    id: popupId,
                    dir: this.dir,
                    textDir: this.textDir,
                    tree: new SelectableTree([], { idProperty: this.idProperty }),
                    idProperty: this.idProperty,
                    labelProperty: this.labelProperty,
                    baseTree: this.tree,
                    hostWidget: this,
                    defaultExpand: this.defaultExpand
                });
            }

            this.inherited(arguments);
        },

        _openResultList: function () {
            this.inherited(arguments);
            this.dropDown && this.dropDown.refresh();
        },

        // override
        getSelectedItem: function () {
            var result = this.inherited(arguments);
            return result && result.__item;
        }
    });

    FilteringSelectTree.NONE_ID = FilteringSelect.NONE_ID;

    return FilteringSelectTree;
});