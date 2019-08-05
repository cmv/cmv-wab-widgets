/**
 Useful utility methods for work with DOM objects.
 */
define(
[
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/on",

    "../../utils/ObjectUtil",
    "esri/dijit/geoenrichment/utils/DomUtil"
],
function (
    domConstruct,
    domGeom,
    domStyle,
    domClass,
    on,

    ObjectUtil,
    DomUtilBase) {

    var util = Object.assign({}, DomUtilBase);

    // Selects DOM elements by adding the "selected" tag to their class.
    // @return elements
    util.select = function (elements) {
        return util.addTag(elements, "selected");
    }

    // Unselects DOM elements by removing the "selected" tag from their class.
    // @return elements
    util.unselect = function (elements) {
        return util.removeTag(elements, "selected");
    }

    // Make the given block DOM elements to float to the start of line.
    // @return elements
    util.floatStart = function (elements) {
        return util.addTag(elements, "esriMapsAnalystXFloatStart");
    },

    // Make the given block DOM elements to float to the end of line.
    // @return elements
     util.floatEnd = function (elements) {
         return util.addTag(elements, "esriMapsAnalystXFloatEnd");
     }

    // Add a spacer of 0.5 em width to the parent element.
    // The optional "doFloat" parameter is either "floatStart" or "floatEnd".
    // It it is missing, the spacer will not be floated.
    // @return The created spacer.
    util.addSpacer = function (parent, doFloat) {
        var spacer = domConstruct.create("div", { "class": "esriMapsAnalystXSpacer", innerHTML: "&nbsp;" }, parent);
        if (doFloat) util[doFloat](spacer);
        return spacer;
    }

    // Updates the value of the input (widget or HTML input) property with the parsed
    // numeric value rounded to the given number of decimal places.
    // if the result of parsing is NaN, the input's value remains unchanged.
    util.getAndUpdateNumber = function (input, places) {
        if (!input)
            return NaN;

        var isWidget = input.get && input.set; // use getters/setters if specified
        if (places === undefined) places = 0;

        // Parse number and round to the given number of places
        var value = ObjectUtil.parseNumber(isWidget ? input.get("value") : input.value, places);

        if (!isNaN(value)) {
            if (isWidget)
                input.set("value", ObjectUtil.formatNumber(value, places))
            else
                input.value = ObjectUtil.formatNumber(value, places);
        }

        return value;
    }

    // Updates the input's value property with its trimmed string value.
    util.getAndUpdateString = function (input) {
        if (!input)
            return null;

        // Use getters/setters if specified
        if (input.get && input.set) {
            var value = input.get("value").trim();
            input.set("value", value);
            return value;
        }
        else {
            var value = input.value.trim();
            input.value = value;
            return value;
        }
    }

    util.getScreenScaleFactor = function () {
        var options = { style: "width: 72pt; height: 72pt" };
        return util.getTextBox("", options).w / 96;
    }

    util.positionAtCenter = function (child, parent) {
        if (!child || !parent)
            return;

        var cb = domGeom.position(child);
        var pb = domGeom.position(parent);

        if (!cb.w || !cb.h || !pb.w || !pb.h)
            return;

        domStyle.set(child, {
            left: (pb.w - cb.w) / 2 + "px",
            top: (pb.h - cb.h) / 2 + "px"
        });
    }

    // Overlay

    // params.overlayClass              String. Optional.
    // params.removeOnClick             Boolean.
    // params.viewPortContainer         Dom node. Optional.
    // params.placeInNode               Boolean. The node have "relative" or "absolute" positioning.
    //
    // returns a signal with remove() method.
    util.showAroundOverlay = function (node, params) {
        params = params || {};
        util.removeAroundOverlay(node);

        var map = {
            w: "width",
            h: "height",
            l: "left",
            t: "top",
            r: "right",
            b: "bottom"
        };

        function createOverlay(s) {
            var overlay = domConstruct.create("div", { "class": params.overlayClass || "esriMapsAnalystXNodeAroundOverlay" }, params.placeInNode ? node : document.body);
            var style = {
                position: "absolute"
            };
            for (var id in map)
                if (s[id] !== undefined)
                    style[map[id]] = Math.round(s[id]) + "px";

            domStyle.set(overlay, style);
            return overlay;
        }

        var pos = domGeom.position(node);

        // we need to clip the position by view port

        if (params.viewPortContainer) {
            var vp = domGeom.position(params.viewPortContainer);
            var oldX = pos.x, oldY = pos.y;
            pos.x = Math.max(pos.x, vp.x);
            pos.w -= pos.x - oldX;
            pos.y = Math.max(pos.y, vp.y);
            pos.h -= pos.y - oldY;
            pos.w = Math.min(pos.w, (vp.x + vp.w) - pos.x);
            pos.h = Math.min(pos.h, (vp.y + vp.h) - pos.y);
        }

        // build overlays

        var boxes;

        if (params.placeInNode) {
            boxes = [
                { l: 0, t: -pos.y, w: pos.w, h: pos.y }, // top
                { l: pos.w, t: -pos.y, w: document.body.clientWidth - (pos.x + pos.w), h: document.body.clientHeight }, // right
                { l: 0, t: pos.h, w: pos.w, h: document.body.clientHeight - (pos.y + pos.h) }, // bottom
                { l: -pos.x, t: -pos.y, w: pos.x, h: document.body.clientHeight } // left
            ]
        }
        else
            boxes = [
                { l: pos.x, t: 0, w: pos.w, h: pos.y }, // top
                { w: document.body.clientWidth - (pos.x + pos.w), r: 0, t: 0, b: 0 }, // right
                { l: pos.x, h: document.body.clientHeight - (pos.y + pos.h), w: pos.w, b: 0 }, // bottom
                { l: 0, t: 0, w: pos.x, b: 0 } // left
            ];

        node.__aroundOverlays = boxes.map(createOverlay);

        var removeFunction = function () {
            util.removeAroundOverlay(node);
        };

        // remove on click

        if (params.removeOnClick)
            node.__aroundOverlaysRemoveHandle = on.once(document.body, "click", removeFunction);

        // resize

        node.__aroundOverlaysResizeHandle = on(window, "resize", function () {
            util.showAroundOverlay(node, params);
        });

        // position tracking

        var positionMemo;

        function checkPositionChanged() {
            if (!positionMemo) {
                positionMemo = domGeom.position(node);
                return;
            } else {
                var pos = domGeom.position(node);
                if (pos.x != positionMemo.x || pos.y != positionMemo.y || pos.w != positionMemo.w || pos.h != positionMemo.h)
                    util.showAroundOverlay(node, params)
            }
        }

        node.__aroundOverlaysSetIntervalHandle = setInterval(checkPositionChanged, 50);

        return { remove: removeFunction };
    };

    util.removeAroundOverlay = function (node) {
        node.__aroundOverlays && node.__aroundOverlays.forEach(function (overlay) { domConstruct.destroy(overlay); });
        delete node.__aroundOverlays;
        node.__aroundOverlaysRemoveHandle && node.__aroundOverlaysRemoveHandle.remove();
        delete node.__aroundOverlaysRemoveHandle;
        node.__aroundOverlaysResizeHandle && node.__aroundOverlaysResizeHandle.remove();
        delete node.__aroundOverlaysResizeHandle;
        clearInterval(node.__aroundOverlaysSetIntervalHandle);
        delete node.__aroundOverlaysSetIntervalHandle;
    };

    util.getDocumentStyleDeclaration = function (name) {

        function processStyleSheet(ss) {
            var classes;
            try {
                classes = ss.rules || ss.cssRules;
            } catch (e) {
                classes = null;
            }
            if (classes)
                for (var j = 0; j < classes.length; j++) {
                    var c = classes[j];
                    if (c.styleSheet) {
                        var style = processStyleSheet(c.styleSheet);
                        if (style)
                            return style;
                    }
                    else if (c.selectorText == name)
                        return c.style;
                }
        };

        for (var i = 0; i < document.styleSheets.length; i++) {
            var style = processStyleSheet(document.styleSheets[i]);
            if (style)
                return style;
        }

        return null;
    };

    util.getNodeFontFamily = function (node) {
        var fontFamily = domStyle.get(node, "fontFamily") || domStyle.getComputedStyle(node)["font-family"];
        if (!fontFamily)
            return fontFamily;
        return fontFamily.replace(/'|"/g, "").split(",")[0];
    };

    util.getNodeFontSize = function (node) {
        return domStyle.toPixelValue(node, domStyle.get(node, "fontSize"));
    };

    // returns signal (to stop, call signal.remove())
    util.listenToNodeAdded = function (node, callback, interval) {
        if (util.isNodeInLayout(node)) {
            callback();
            return;
        }

        node.__listenToNodeAddedHandle && node.__listenToNodeAddedHandle.remove();

        var handle = setInterval(function () {
            if (util.isNodeInLayout(node)) {
                node.__listenToNodeAddedHandle && node.__listenToNodeAddedHandle.remove();
                callback();
            }
        }, interval || 100);

        node.__listenToNodeAddedHandle = {
            remove: function () {
                clearInterval(handle);
                delete node.__listenToNodeAddedHandle;
            }
        };

        return node.__listenToNodeAddedHandle;
    };

    // checks if a node is in layout but is hidden
    util.isNodeVisible = function (node) {
        return util.isChildOf(node, document.body, function (node) {
            return !domClass.contains(node, "dijitHidden") && domStyle.get(node, "visibility") != "hidden";
        });
    };

    // Enables/disables hyperlink for dom node.
    util.enableHyperlink = function (domNode, enable) {
        if (enable)
            domClass.replace(domNode, "esriMapsAnalystXLink", "esriMapsAnalystXLinkDisabled");
        else
            domClass.replace(domNode, "esriMapsAnalystXLinkDisabled", "esriMapsAnalystXLink");
    };

    return util;
});