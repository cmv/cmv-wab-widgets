/*
 Mixin to SelectableTreeGrid
*/
define([
    "dojo/_base/declare",
    "dojo/dom-geometry",

    "../../../dijit/utils/MouseUtil",
], function (
    declare,
    domGeom,

    MouseUtil
) {
    var INTERVAL = 10,
        ACTIVE_FRACTION = 0.125, // fraction of active grid height
        STRENGTH = 0.625;

    return declare(null, {

        _scrollDirection: null, // "up" | "down"
        _scrollDnDHandler: null,
        _scrollStep: 10,

        // override
        _onMouseMove: function () {
            this._tryScrolling();
            this.inherited(arguments);
        },

        // override
        _onDndEnd: function (children) {
            this._cleanUpScrolling();
            this.inherited(arguments);
        },

        _tryScrolling: function () {
            var areaPos = domGeom.position(this.grid.bodyNode),
                mousePos = MouseUtil.getCursorPosition();

            var self = this;
            if (mousePos.clientX <= areaPos.x || mousePos.clientX >= areaPos.x + areaPos.w)
                this._scrollDirection = null;
            else {
                var activeArea = areaPos.h * ACTIVE_FRACTION,
                    canScroll = function (gap) {
                        return (self._scrollStep = gap >= activeArea ? 0 : Math.ceil(Math.pow(activeArea - gap, STRENGTH) + 1));
                    };

                this._scrollDirection = canScroll(mousePos.clientY - areaPos.y) ? "up" :
                    canScroll(areaPos.y + areaPos.h - mousePos.clientY) ? "down" : null;
            }

            if (!this._scrollDirection)
                this._cleanUpScrolling();
            else if (!this._scrollDnDHandler)
                this._scrollDnDHandler = setTimeout(function () {
                    self._scrollDnDHandler = null;
                    if (self._scrollDirection) {
                        var scrollPos = self.getScrollPosition();
                        scrollPos.y += self._scrollDirection === "up" ? -self._scrollStep : self._scrollStep;
                        self.setScrollPosition(scrollPos);
                    }
                }, INTERVAL);
        },

        _cleanUpScrolling: function () {
            this._scrollDnDHandler && clearInterval(this._scrollDnDHandler);
            this._scrollDnDHandler = null;
        }
    });
});