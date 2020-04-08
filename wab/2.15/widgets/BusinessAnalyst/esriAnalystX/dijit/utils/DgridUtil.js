define([
    "dojo/aspect",
    "dojo/dom-class",
    "dojo/query",

    "../../utils/ArrayUtil"
], function (
    aspect,
    domClass,
    query,

    ArrayUtil
) {
    "use strict";

    var EXPANDO_STYLES = ["ui-icon-triangle-1-e", "ui-icon-triangle-1-se"],
        ODD_EVEN = ["dgrid-row-even", "dgrid-row-odd"];

    function updateOddEven(grid, rowNode, isOdd) {
        if (isOdd === undefined) {
            var node = grid._rowIdToObject[rowNode.id];
            if (node) {
                var store = grid.store;
                isOdd = store && store.isOdd && store.isOdd(node);
            }
        }

        if (isOdd === 0 || isOdd === 1)
            domClass.replace(rowNode, ODD_EVEN[isOdd], ODD_EVEN[1 - isOdd]);
    }

    function updateExpand(grid, row, expanded) {
        var store = grid.store;
        if (store && store.updateExpand) {
            var cache = store.updateExpand(row.data, expanded, true, grid.getSortingFunction());
            for (var id in cache) {
                var row = grid.row(store.get(id));
                if (row.element)
                    updateOddEven(grid, row.element, cache[id]);
            }
        }
    }

    var util = {
        // Creates an object providing dgrid-style expando icon.
        //  domNode: DomNode
        //      Dom node to be styled with expando icon.
        // Returns a new object with the following properties:
        //  expando: DomNode
        //  update: function (expand)
        createExpando: function (domNode) {
            domClass.add(domNode, "dgrid-expando-icon ui-icon ui-icon-triangle-1-e esriMapsAnalystXClickable");
            return {
                expando: domNode,
                update: function (expand) {
                    var expandIndex = expand ? 1 : 0;
                    domClass.replace(domNode, EXPANDO_STYLES[expandIndex], EXPANDO_STYLES[1 - expandIndex]);
                }
            }
        },

        // Fixes odd/even styling for a grid. It requires the SelectableTree as a dgrid store.
        oddEvenFix: function (grid) {
            if (!grid.expand)
                return;

            // Add getSortingFunction method creating a sorting function by grid 'sort' value.
            grid.getSortingFunction = function () {
                var sort = this.get("sort");
                return !sort || !sort.length ? null : ArrayUtil.getSorting(sort);
            };

            aspect.after(grid, "insertRow", function (row) {
                updateOddEven(grid, row);
                return row;
            });

            aspect.before(grid, "refresh", function () {
                var store = grid.store;
                store && store.updateExpandedNodes && store.updateExpandedNodes(grid._expanded, grid.getSortingFunction());
            });

            // Fix odd/even when a tree node is expanded/collapsed
            aspect.around(grid, "expand", function (callback) {
                return function (target, expand) {
                    var row = target.element ? target : grid.row(target);

                    // Identify what we should do: expand or collapse
                    if (expand === undefined)
                        expand = !grid._expanded[row.id];

                    // In the case of expand, we should update the store and rows before the original expand
                    if (expand === true)
                        updateExpand(grid, row, true);

                    var result = callback.apply(this, arguments);

                    // In the case of collapse, we should update the store and rows after the original collapse
                    if (expand === false)
                        updateExpand(grid, row, false);

                    return result;
                }
            });

            // Ignore adjustRowIndices method if the store supports the expand interface:
            // updateExpandedNodes, updateExpand, and isOdd
            // SelectableTree supports this interface
            aspect.around(grid, "adjustRowIndices", function (callback) {
                return function () {
                    var store = grid.store;
                    if (!store || !store.updateExpandedNodes || !store.updateExpand || !store.isOdd)
                        callback.apply(this, arguments);
                }
            });
        },

        makeContentNeverGoUnderScroll: function (grid) {

            function fixGrid() {
                var headerTableNode = grid.headerNode.firstChild;
                var contentNode = grid.contentNode;

                if (contentNode && headerTableNode) {
                    if (headerTableNode.offsetWidth === contentNode.offsetWidth) return;

                    // reset first
                    contentNode.style.width = "";
                    headerTableNode.style.width = "";

                    headerTableNode.style.width = contentNode.offsetWidth + "px";
                }
            };

            aspect.after(grid, "resize", fixGrid);
            aspect.after(grid, "refresh", fixGrid);
            aspect.after(grid, "expand", function (promise) {
                setTimeout(fixGrid, 100); // consider animation
                setTimeout(fixGrid, 300); // consider animation
                return promise;
            });
        }
    };

    // This fix places the sort arrow in-line within the header div.
    //  grid: Object
    //      Dgrig grid.
    //  sortAttrs: String | Array
    //      String list of attributes to place the in-line sort arrow for.
    //  targetClass: String
    //      Optional class of target container to place the sort arrow into.
    util.inlineSortArrow = function (grid, sortAttrs, targetClass) {
        sortAttrs = ArrayUtil.arrayToObject(ArrayUtil.listToArray(sortAttrs));

        aspect.after(grid, "updateSortArrow", function (sort, updateSort) {
            var prop = sort[0] && sort[0].attribute;
            if (!prop || !sortAttrs[prop])
                return;

            var target = grid._sortNode || grid._findSortArrowParent(prop),
                arrowNode = target && query(".dgrid-sort-arrow", target)[0],
                desc = sort[0].descending;
            
            if (arrowNode) {
                arrowNode.remove(); // Remove from previous location
                domClass.remove(target, "dgrid-sort-down dgrid-sort-up");
                var targetNode = targetClass ? query(targetClass, target)[0] : target.lastChild.append ? target.lastChild : target;
                if (!targetNode.append)
                    targetNode = target;
                domClass.add(targetNode, desc ? "dgrid-sort-down" : "dgrid-sort-up");
                targetNode.append(arrowNode);
            }
        }, true);
    }

    return util;
});