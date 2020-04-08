/**
Allows to monitor the mouse cursor and check if it's over a component.
*/
define(
[
    "dojo/dom-geometry",

    "esri/dijit/geoenrichment/utils/MouseUtil"
],
function (
    domGeom,

    MouseUtil
    ) {

    // Unit testing

    var isPositionLocked; // for unit testing

    MouseUtil.unitTesting_setCursorOverNode = function (node) {
        var p = domGeom.position(node);
        var midX = p.x + p.w / 2;
        var midY = p.y + p.h / 2;
        MouseUtil.unitTesting_setCursorPosition(midX, midY);
    };

    MouseUtil.unitTesting_setCursorPosition = function (x, y) {
        MouseUtil._latestEvent = {
            clientX: x,
            pageX: x,
            clientY: y,
            pageY: y
        };
    };

    MouseUtil.unitTesting_lockPosition = function (value) {
        isPositionLocked = value;
    };

    MouseUtil.unitTesting_shiftMousePosition = function (dx, dy) {
        MouseUtil.unitTesting_setCursorPosition(MouseUtil._latestEvent.clientX + (dx || 0), MouseUtil._latestEvent.clientY + (dy || 0));
    };

    // overrride
    MouseUtil._setLatestEvent = function (event) {
        if (isPositionLocked) return;
        MouseUtil._latestEvent = event;
    };

    return MouseUtil;
});