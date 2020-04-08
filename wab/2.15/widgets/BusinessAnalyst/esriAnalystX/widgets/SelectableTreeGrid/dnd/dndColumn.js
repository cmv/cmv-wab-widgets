/**

DEPRECATED!

Allows mixing in DnD functionality for a tree.
*/
define([
    "dojo/aspect",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/on",

    "../../../dijit/utils/MouseUtil",
    "../../../dijit/tooltips/TooltipUtil"
], function (
    aspect,
    domClass,
    domConstruct,
    domGeom,
    on,

    MouseUtil,
    TooltipUtil
) {

    var grid;
    var column;

    function _testGridObject(object) {
        return object && object.isDraggable;
    }

    var _currentDnDTarget; // store object
    var _highlightedRow;
    var _dropPosition;

    var _isDragging = false;

    function _startDnd(object /*store object*/) {
        _isDragging = true;
        _currentDnDTarget = null;
        var tooltip = TooltipUtil.createTooltip(null, null, { htmlFragment: _renderDnDBox(object) });

        var mouseUpMove = on(grid.domNode, "mousemove, touchmove, dojotouchmove", function (event) {
            MouseUtil.fixTouchEvent(event);
            var rowOver = grid.row(event);

            if (rowOver && rowOver.data)
                _tryHighlightElement(rowOver.data, object);
        });

        var mouseUpHandler = on(document.body, "mouseup, touchend", function () {
            _endDnd(object);
            cleanUp();
        });

        var keyUpHandler = on(document.body, "keyup", function (event) {
            if (event.keyCode == 27) // ESC
                cleanUp();
        });

        var cleanUp = function () {
            TooltipUtil.removeTooltip(tooltip);
            mouseUpMove.remove();
            mouseUpHandler.remove();
            keyUpHandler.remove();
            _tryHighlightElement(null, null);
            _currentDnDTarget = null;
            _isDragging = false;
        }
    }

    function _renderDnDBox(object) {
        if (column.dndBoxRenderer)
            return column.dndBoxRenderer(object);

        var box = domConstruct.create("div", { innerHTML: object.label || "DnD Box in action!", "class": "esriMapsAnalystXSelectableTreeDnDBoxRoot" });
        box.style.cursor = "move";
        return box;
    }

    function _tryHighlightElement(objectOver, objectDragged) {
        if (_highlightedRow) {
            domClass.remove(_highlightedRow, "esriMapsAnalystXSelectableTreeDnDRowHighlightedAllowedBefore");
            domClass.remove(_highlightedRow, "esriMapsAnalystXSelectableTreeDnDRowHighlightedAllowedAfter");
            domClass.remove(_highlightedRow, "esriMapsAnalystXSelectableTreeDnDRowHighlightedForbiddenBefore");
            domClass.remove(_highlightedRow, "esriMapsAnalystXSelectableTreeDnDRowHighlightedForbiddenAfter");
            _highlightedRow = null;
            _dropPosition = null;
        }

        if (!objectOver)
            return;

        var row = grid.row(objectOver);

        if (row && row.element) {
            _highlightedRow = row.element;
            // cases
            var isDraggable = _testGridObject(objectOver);

            var allowed;

            // define the drop position
            var p = domGeom.position(_highlightedRow);

            var middleY = p.y + p.h / 2;
            var position = middleY > MouseUtil.getCursorPosition().clientY ? "before" : "after";
            _dropPosition = position;

            if (!objectOver.isHost)
                allowed = position == "after" && !_getNextChild(objectOver);// && (!_getNextHost(objectOver) || _testGridObject(_getNextHost(objectOver)));
            else {
                if (!isDraggable) // for not movable items
                {
                    if (position == "before")
                        allowed = _testGridObject(_getPrevHost(objectOver))
                    else
                        allowed = !_isHostExpanded(objectOver) && _testGridObject(_getNextHost(objectOver));
                }
                else {
                    allowed = position == "before" || !_isHostExpanded(objectOver);
                }
            }

            if (allowed && position === "before")
                domClass.add(_highlightedRow, "esriMapsAnalystXSelectableTreeDnDRowHighlightedAllowedBefore");
            else if (allowed && position === "after")
                domClass.add(_highlightedRow, "esriMapsAnalystXSelectableTreeDnDRowHighlightedAllowedAfter");
            else if (!allowed && position === "before")
                domClass.add(_highlightedRow, "esriMapsAnalystXSelectableTreeDnDRowHighlightedForbiddenBefore");
            else if (!allowed && position === "after")
                domClass.add(_highlightedRow, "esriMapsAnalystXSelectableTreeDnDRowHighlightedForbiddenAfter");

            _currentDnDTarget = !allowed ? null : objectOver.isHost ? objectOver : objectOver.hostElement;
        }
    }

    function _getNextHost(object) {
        return object.isHost ? grid.store.data[object.index + 1] : grid.store.data[object.hostElement.index + 1];
    }

    function _getNextChild(object) {
        return !object.isHost && object.hostElement.children[object.index + 1];
    }

    function _getPrevHost(object) {
        return grid.store.data[object.index - 1];
    }

    function _isHostExpanded(object) {
        return grid._expanded && grid._expanded[object.id];
    }

    function _endDnd(object) {
        if (!_currentDnDTarget || _currentDnDTarget == object)
            return;

        if (_dropPosition === "before" && _getPrevHost(_currentDnDTarget) == object)
            return;
        else if (_dropPosition === "after" && _getNextHost(_currentDnDTarget) == object)
            return;

        // we can't modify the store here, but rather let the client listen to an event.
        column.onDnDHappened && column.onDnDHappened({ objectDropped: object, objectOver: _currentDnDTarget, position: _dropPosition });
    }

    function dndColumn(gridColumn) {
        column = gridColumn;

        aspect.after(column, "init", function () {
            grid = column.grid;

            var handlers = [];

            var cleanUp = function () {
                handlers.forEach(function (h) { h.remove(); });
            };

            aspect.after(grid, "destroy", cleanUp);

            handlers.push(on(grid.domNode, "mousedown, touchstart, dojotouchover", function (event) {
                if (_isDragging)
                    return;

                var row = grid.row(event);
                if (row && row.data && _testGridObject(row.data))
                    _startDnd(row.data);
            }));
        });

        return column;
    }

    // provides dnd indices
    // marks hosts elements as isHost = true
    // makes host elements draggable (isDraggable = true), unless specified otherwise
    // assigns hostElement for each child
    dndColumn.prepareTreeData = function (items) {
        var hostIndex = 0;
        var childIndex = 0;

        items.forEach(function (host) {
            host.index = hostIndex++;
            host.isHost = true;
            host.isDraggable = host.isDraggable === undefined ? true : host.isDraggable;
            host.children && host.children.forEach(function (child) {
                child.index = childIndex++;
                child.hostElement = host;
            });
        });
    };

    return dndColumn;
});
