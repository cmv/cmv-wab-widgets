/**
 * Provides methods to create tooltips.
 */
define([
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/query",
    "dojo/on",
    "dojox/gfx",
    "dojo/sniff",
    "dojo/aspect",
    "dojox/uuid/generateRandomUuid",
    "dijit/Tooltip",
    "../utils/DomUtil",
    "../utils/MouseUtil",
    "esri/dijit/geoenrichment/utils/TooltipUtil",
    "dojo/domReady!"
], function (
    domConstruct,
    domStyle,
    domGeom,
    domClass,
    query,
    on,
    gfx,
    has,
    aspect,
    generateRandomUuid,
    Tooltip,
    DomUtil,
    MouseUtil,
    esriTooltipUtil
) {
    var util = {};

    var toolTipsHash = {};

    //--------------------------------------------------------------------------
    //
    //  Methods: managing tooltip for dom nodes
    //
    //--------------------------------------------------------------------------

    util.hideTooltipForNode = esriTooltipUtil.hideTooltipForNode;
    util.setTooltipToNode = esriTooltipUtil.setTooltipToNode;

    //--------------------------------------------------------------------------
    //
    //  Methods: adding tooltip that follows the mouse cursor all over the document
    //
    //--------------------------------------------------------------------------

    /**
    * Creates a tooltip that follows the mouse cursor.
    * @param map If not specified, document body will be used.
    * In params you can pass:
    * params.class
    * params.style
    * params.htmlFragment
    * params.widget
    * params.offset
    * mouseEvent to allow immediate positioning of the tooltip.
    * OR
    * toMouseCursor Boolean - sets the tooltip at the mouse cursor.
    */
    util.createTooltip = function (map, text, params) {
        // create node for the tooltip
        var options = {
            orientation: domGeom.isBodyLtr(document) ? "right" : "left",
            offset: { x: 15, y: 0 }
        };
        if (text)
            options.innerHTML = text;
        if (params)
            options = Object.assign(options, params);

        options.id = generateRandomUuid();

        if (options.toMouseCursor) {
            options.mouseEvent = MouseUtil.getCursorPosition();
            delete options.toMouseCursor;
        }

        var mouseEvent = options.mouseEvent;
        delete options.mouseEvent;

        var htmlFragment = options.htmlFragment;
        delete options.htmlFragment;

        var widget = options.widget;
        delete options.widget;

        var placement = options.orientation;
        delete options.orientation;

        var offset = options.offset;
        delete options.offset;

        var horizontalOffset = options.horizontalOffset;
        delete options.horizontalOffset;

        var tooltip = domConstruct.create("div", options, map ? map.container : document.body);
        if (htmlFragment)
            domConstruct.place(htmlFragment, tooltip);
        else if (widget)
            widget.placeAt(tooltip);

        domStyle.set(tooltip, "position", "fixed");

        var box = domGeom.getMarginBox(tooltip);

        var tooltipShowFunction = function (evt, horizontalOffset) {
            var px = evt.touches ? event.touches[0].clientX : evt.clientX;
            var py = evt.touches ? event.touches[0].clientY : evt.clientY;

            var autoPlacementH;
            var autoPlacementV;
            var offsetX = offset.x;
            var offsetY = offset.y;

            // check the recommended placement first
            if (placement === "left") {
                if ((px - box.w - offsetX) < 0)
                    autoPlacementH = "right";
            }
            else {
                if ((px + box.w + offsetX) > document.body.clientWidth)
                    autoPlacementH = "left";
            }

            if ((py + box.h + offsetY) > document.body.clientHeight)
                autoPlacementV = "above";

            var curPlacement = autoPlacementH || placement;
            domStyle.set(tooltip, {
                left: horizontalOffset ? horizontalOffset + "px" : (px + (curPlacement === "left" ? (-box.w - offsetX) : offsetX)) + "px",
                top: (py + (autoPlacementV === "above" ? (-box.h - offsetY) : offsetY)) + "px"
            });
            tooltip.style.display = "";
        }

        // if options already have an event, we can show and position the tooltip immediately
        if (mouseEvent)
            tooltipShowFunction(mouseEvent, horizontalOffset);

        var handlers = [];

        // update the tooltip as the mouse moves over the map or the document body
        handlers.push(on(map ? map : document.body, map ? "mouse-move, mousemove" : "mousemove, touchmove", function (evt) {
            tooltipShowFunction(evt, horizontalOffset);
        }));

        // hide the tooltip the cursor isn't over the map or the document body
        handlers.push(on(map ? map : document.body, map ? "mouse-out, mouseout" : "mouseout, touchend", function (evt) {
            tooltip.style.display = "none";
        }));

        var infoObject = {};
        infoObject.handlers = handlers;
        infoObject.tooltip = tooltip;

        toolTipsHash[tooltip.id] = infoObject;

        return tooltip;
    }

    util.removeTooltip = function (tooltipOrId) {

        if (!tooltipOrId)
            return;

        var id = typeof tooltipOrId === "string" ? tooltipOrId : tooltipOrId.id;
        var infoObject = toolTipsHash[id];
        delete toolTipsHash[id];

        if (infoObject) {
            infoObject.handlers.forEach(function (h) { h.remove() });
            domConstruct.destroy(infoObject.tooltip);
        }
    }

    //--------------------------------------------------------------------------
    //
    //  Methods: adding tooltip to a slider
    //
    //--------------------------------------------------------------------------

    var sliderTooltips = {};

    // gets unregistered on destroy
    // params: offsetX, offsetY
    // isRangeSlider: Boolean
    util.registerTooltipForSlider = function (slider, params, formatFunction, isRangeSlider) {

        // create node for the tooltip
        var options = {
            offsetX: 0,
            offsetY: 0,
            class: "esriMapsAnalystXTooltip"
        };
        if (params)
            options = Object.assign(options, params);

        options.id = generateRandomUuid();

        var tooltip = domConstruct.create("div", options, document.body);
        tooltip.style.display = "none";
        domStyle.set(tooltip, "position", "fixed");

        var isTooltipShown = false;

        var showTooltip = function (sliderHandle, valueFunction) {

            if (isTooltipShown)
                return;

            isTooltipShown = true;

            tooltip.style.display = "";
            tooltip.innerHTML = valueFunction();
            var b = domGeom.getMarginBox(tooltip);
            var bH = domGeom.position(sliderHandle);

            domStyle.set(tooltip, { left: (bH.x + bH.w / 2 - b.w / 2 + options.offsetX) + "px", top: (bH.y - b.h - 5 + options.offsetY) + "px" });

            var handlers = [];
            // update position on change
            handlers.push(aspect.after(slider, "onChange", function () {
                tooltip.innerHTML = valueFunction();
                bH = domGeom.position(sliderHandle);
                domStyle.set(tooltip, { left: (bH.x + bH.w / 2 - b.w / 2) + "px", top: (bH.y - b.h - 5) + "px" });
            }));

            var removeTooltip = function () {
                tooltip.style.display = "none";
                handlers.forEach(function (h) { h.remove(); });
                isTooltipShown = false;
            };

            var needWaitForMouseUp = false;

            handlers.push(on(sliderHandle, "mousedown, mouseDown, mouse-down", function () {
                needWaitForMouseUp = true;

                handlers.push(on(document, "mouseup, mouseUp, mouse-up", function () {
                    removeTooltip();
                }));
            }));

            handlers.push(on(sliderHandle, "mouseout, mouseOut, mouse-out", function () {
                if (!needWaitForMouseUp)
                    removeTooltip();
            }));
        }

        var handlers = [];

        //////// Mouse over

        handlers.push(on(slider.sliderHandle, "mouseover, mouseOver, mouse-over", function () {
            if (isRangeSlider && slider.isSliderDisabled && slider.isSliderDisabled())
                return;

            var valueFunction = function () {
                var sliderValue = isRangeSlider ? slider.get("value")[0] : slider.get("value");
                return formatFunction ? formatFunction(sliderValue) : sliderValue;
            };
            showTooltip(slider.sliderHandle, valueFunction);
        }));

        if (isRangeSlider) {
            handlers.push(on(slider.sliderHandleMax, "mouseover, mouseOver, mouse-over", function () {
                if (slider.isSliderDisabled && slider.isSliderDisabled())
                    return;

                var valueFunction = function () { return formatFunction ? formatFunction(slider.get("value")[1]) : slider.get("value")[1]; };
                showTooltip(slider.sliderHandleMax, valueFunction);
            }));
        }
        /////////////////

        handlers.push(aspect.before(slider, "destroy", function () {
            util.unregisterTooltipForSlider(slider);
        }));

        slider.tooltipId = tooltip.id;

        var infoObject = {};
        infoObject.tooltip = tooltip;
        infoObject.handlers = handlers;

        sliderTooltips[tooltip.id] = infoObject;
    }

    util.unregisterTooltipForSlider = function (slider) {
        var infoObject = sliderTooltips[slider.tooltipId];

        if (infoObject) {
            infoObject.handlers.forEach(function (h) { h.remove(); });
            domConstruct.destroy(infoObject.tooltip);
        }

        delete sliderTooltips[slider.tooltipId];
        delete slider.tooltipId;
    }

    //--------------------------------------------------------------------------
    //
    //  Methods: auto tooltip
    //
    //--------------------------------------------------------------------------

    var node = null;

    function clearTooltipNode() {
        if (!node)
            return;

        if (node.isMultilineContainer)
            util.hideTooltipForNode(node);
        else {
            clearInterval(node.__autoTooltipInLayoutCheckHandle);
            delete node.__autoTooltipInLayoutCheckHandle;
            Tooltip.hide(node);
        }
        node = null;
    }

    // @param additionalClasses Array or String. Do not specify TrimWithEllipses, which is added by default
    util.autoTooltip = function (root, additionalClasses, titleAdditionalClasses) {
        if (typeof additionalClasses === "string")
            additionalClasses = additionalClasses.split(" ").filter(function (item) { return item && !!item.trim().length; });

        additionalClasses = additionalClasses || [];
        additionalClasses.push("TrimWithEllipses");

        titleAdditionalClasses = titleAdditionalClasses || [];
        titleAdditionalClasses.push("esriMapsAnalystXInfoIcon");

        for (var i = 0; i < additionalClasses.length; i++)
            on(root, "." + additionalClasses[i] + ":mouseover, " + additionalClasses[i] + ":touchstart, ", function (e) {
                //console.log(additionalClasses[i] + " " + e.type);
                if (this === node) {
                    return;
                }
                if (this.offsetWidth < this.scrollWidth && !this.noAutoTooltip) {
                    var width = getComputedStyle(this).width;
                    width = Number(width.substr(0, width.length - 2)); // remove "px" and convert to number

                    var delta = width - Math.round(width);
                    if (delta < 0 && this.offsetWidth == this.scrollWidth - 1)
                        return;

                    clearTooltipNode();

                    node = this;

                    var message = node.autoTooltip || node.textContent || node.value;
                    // Add default tooltip text if necessary
                    if (node.title)
                        message += " (" + node.title + ")";

                    message && Tooltip.show(message, node, ["above", "below"]);
                    on.once(node, "mouseout, touchstart, touchout", function () {
                        clearTooltipNode();
                    });

                    // HACK: IE
                    node.__autoTooltipInLayoutCheckHandle = setInterval(function () {
                        if (!DomUtil.isNodeInLayout(node))
                            clearTooltipNode();
                    }, 500);
                }
            });

        if (has("touch"))
            for (var i = 0; i < titleAdditionalClasses.length; i++) {
                on(root, "." + titleAdditionalClasses[i] + ":touchstart ", function (e) {
                    if (this === node) {
                        return;
                    }

                    node = this;

                    // Only show tooltip if there is a title on the node
                    if (node.title) {
                        Tooltip.show(node.title, node, ["above", "below"]);
                        on.once(node, "touchstart, touchout", function () {
                            Tooltip.hide(node);
                            node = null;
                        });
                    }
                });
            }
    }

    util.addAutoTooltipsToTabContainer = function (tabContainer) {
        query(".tabLabel", tabContainer.domNode).forEach(function (label) {
            domClass.add(label, "TrimWithEllipses");
        });
        util.autoTooltip(tabContainer);
    };

    // Sets multiline text to the text container and shows the ellipsis and tooltip if text overflows the container size.
    //  textContainer: DomNode
    //      The text container. It should be in layout and its width should be known.
    //  text: String
    //      Text content to be added.
    //  lineCount: Number
    //      The number of lines to split text content by. Default is 2.
    //  position: Array
    //      Positioning of tooltip when multiline text is trimmed. Default is ["above", "below"].
    util.setMultilineText = function (textContainer, text, lineCount, position) {
        lineCount = lineCount || 2;
        text = text.trim();
        position = position || ["above", "below"];

        domClass.remove(textContainer, "TrimWithEllipses"); // The container should not have the TrimWithEllipses class
        textContainer.style.overflow = "hidden";
        textContainer.innerHTML = "";

        var remainingText = text,
            showTooltip = false;
        while (remainingText) {
            lineCount--;
            var lineDiv = domConstruct.create("div", null, textContainer);
            lineDiv.style.overflow = "hidden";
            lineDiv.style.whiteSpace = "nowrap";
            // try to place the remaining text parts so that it will not overflow the lineDiv.
            var lineText = remainingText;
            while (lineText) {
                lineDiv.textContent = lineText;
                if (lineDiv.offsetWidth < lineDiv.scrollWidth - 1) {
                    // Not enough space. Trim the last word in lineText
                    var result = lineText.match(/^(.*[^\s]+)\s+[^\s]+$/);
                    lineText = result && result[1] || "";
                    continue;
                }
                break;
            }
            if (!lineText || !lineCount && lineText !== remainingText) {
                // Can't place any word in the line without overflow or 
                // this is the last line and extra text is remaining.
                // Need show ellipsis and tooltip.
                lineDiv.textContent = remainingText;
                remainingText = "";
                lineDiv.style.textOverflow = "ellipsis";
                showTooltip = true;
            }
            else
                remainingText = remainingText.substr(lineText.length).trim();
        }
        if (showTooltip) {
            util.setTooltipToNode(textContainer, function () {
                clearTooltipNode(); // clear the last auto tooltip
                node = textContainer; // Set this node as autotooltip node
                node.isMultilineContainer = true;
                return text;
            }, { position: position });
        }
    }

    //--------------------------------------------------------------------------
    //
    //  Methods: error tooltips
    //
    //--------------------------------------------------------------------------

    /**
    * Shows error tooltip for a text input, disappears on click.
    */
    util.showErrorTip = function (textInput, errorMessage) {
        return _placeErrorTooltip(_createErrorTooltip(errorMessage), textInput.domNode || textInput);
    };

    /**
     * This is the new style error tip. This could replace the above function if we decide
     * to go with new style everywhere in the application.
     * 
     * isWarning: Boolean   If true, the error tip will be drawn with white background.
     */
    util.showNewStyleErrorTip = function (textInput, errorMessage, isWarning) {
        var suffix = "NewStyle" + (isWarning ? " esriMapsAnalystXWarningStyle" : "");
        return _placeErrorTooltip(_createErrorTooltip(errorMessage, suffix), textInput.domNode || textInput);
    };

    function _createErrorTooltip(errorMessage, suffix) {
        suffix = suffix || "";
        // create node for the tooltip
        var options = { class: "esriMapsAnalystXValidationTooltip" + suffix };

        var tooltip = domConstruct.create("div", options, document.body);
        // tip (old style only)
        !suffix && domConstruct.create("div", { class: "esriMapsAnalystXValidationTooltipTip" + suffix }, tooltip);
        // body
        domConstruct.create("div", { innerHTML: errorMessage, class: "esriMapsAnalystXValidationTooltipBody" + suffix }, tooltip);

        domStyle.set(tooltip, "position", "fixed");

        return tooltip;
    }

    function _placeErrorTooltip(tooltip, textInput) {
        textInput = textInput.textbox || textInput; // convert dojo TextBox to html input

        var tipBox = domGeom.getMarginBox(tooltip);
        var inputPos = domGeom.position(textInput);

        if (document.dir === "rtl")
            domStyle.set(tooltip, { left: (inputPos.x - tipBox.w) + "px", top: (inputPos.y + inputPos.h / 2 - tipBox.h / 2) + "px" })
        else
            domStyle.set(tooltip, { left: (inputPos.x + inputPos.w) + "px", top: (inputPos.y + inputPos.h / 2 - tipBox.h / 2) + "px" })

        function removeTooltip() {
            if (tooltip) {
                document.body.removeChild(tooltip);
                handlers.forEach(function (handler) { handler.remove(); });
                tooltip = handlers = null;
            }
        }

        var handlers = [
            on(document.body, "mousedown, keydown", removeTooltip),
            on(textInput, "blur", removeTooltip)
        ];

        return {
            remove: removeTooltip
        };
    }

    //--------------------------------------------------------------------------
    //
    //  Methods: show alert tooltip
    //
    //--------------------------------------------------------------------------

    // params.node      DOM node. Required.
    // params.message   Tooltip message. Required.
    // params.position  Tooltip position. Defaults to ["above", "below"].
    // params.timeout   Tooltip showing timeout. Defaults to 5000.
    // If any required parameter is missing, nothing is shown.
    util.showAlertTooltip = function (params) {
        if (params && params.node && params.message) {
            Tooltip.show(params.message, params.node, params.position || ["above", "below"]);
            setTimeout(function () { Tooltip.hide(params.node) }, params.timeout || 5000);
        }
    };

    //--------------------------------------------------------------------------
    //
    //  Methods: closable tooltip
    //
    //--------------------------------------------------------------------------

    // params.component
    // params.message
    // params.timeout
    // params.tooltipClass
    // params.position - "right" or "left". Default "left".
    // returns tooltip
    util.showClosableTooltip = function (params) {
        var info = _createClosableTooltip(params.message, params.tooltipClass, params.position);
        return _placeClosableTooltip(info, params.component, params.timeout, params.position);
    }

    util.removeClosableTooltip = function (tooltip) {
        tooltip && tooltip._removeFunc && tooltip._removeFunc();
    }

    function _createClosableTooltip(message, tooltipClass, position) {
        // create node for the tooltip
        var options = { class: "esriMapsAnalystXClosableTooltip " + (tooltipClass || "") };
        options.id = generateRandomUuid();

        var tooltip = domConstruct.create("div", options, document.body);
        var tooltipBody, closeButton;

        // tip
        function addTip() {
            var tooltipTip = domConstruct.create("div", { class: "esriMapsAnalystXClosableTooltipTip" }, tooltip);
            domClass.add(tooltipTip, position === "right" ? "esriMapsAnalystXClosableTooltipTipRight" : "esriMapsAnalystXClosableTooltipTipLeft");
        }

        // body
        function addBody() {
            tooltipBody = domConstruct.create("div", { class: "esriMapsAnalystXClosableTooltipBody" }, tooltip);

            // message label
            domConstruct.create("div", { innerHTML: message, class: "esriMapsAnalystXClosableTooltipLabel" }, tooltipBody);
            // close button
            closeButton = domConstruct.create("div", { class: "esriMapsAnalystXClosableTooltipCloseButton esriMapsAnalystXCloseWindow esriMapsAnalystXCloseWindowWhite" }, tooltipBody);
        }

        if (position !== "right") {
            addBody();
            addTip();
        }
        else {
            addTip();
            addBody();
        }

        domStyle.set(tooltip, "position", "fixed");

        return { tooltip: tooltip, body: tooltipBody, closeButton: closeButton };
    }

    function _placeClosableTooltip(tooltipInfo, component, timeout, position) {
        var tipBox = domGeom.getMarginBox(tooltipInfo.tooltip);
        var pos = domGeom.position(component);

        if ((document.dir === "rtl" && position !== "right") || (document.dir !== "rtl" && position === "right"))
            domStyle.set(tooltipInfo.tooltip, { left: (pos.x + pos.w) + "px", top: (pos.y + pos.h / 2 - tipBox.h / 2) + "px" })
        else
            domStyle.set(tooltipInfo.tooltip, { left: (pos.x - tipBox.w) + "px", top: (pos.y + pos.h / 2 - tipBox.h / 2) + "px" })

        var timeoutFunct;
        var checkInLayoutHandle;
        var clickHandler;

        var removeTooltip = function () {
            timeoutFunct && clearTimeout(timeoutFunct);
            checkInLayoutHandle && clearInterval(checkInLayoutHandle);
            clickHandler && clickHandler.remove();
            tooltipInfo.tooltip.parentNode === document.body && document.body.removeChild(tooltipInfo.tooltip);
        };

        var checkInLayoutHandle = setInterval(function () {
            if (!DomUtil.isNodeInLayout(component))
                removeTooltip();

            if (!DomUtil.isNodeVisible(component))
                DomUtil.hide(tooltipInfo.tooltip);
            else
                DomUtil.show(tooltipInfo.tooltip);
        }, 300);

        if (timeout)
            timeoutFunct = setTimeout(removeTooltip, timeout);

        clickHandler = on(tooltipInfo.closeButton, "click", function () {
            removeTooltip();
        });

        tooltipInfo.tooltip._removeFunc = removeTooltip;
        return tooltipInfo.tooltip;
    }

    /* params.above - domNode which upper corner will be at the top of bracket
     * params.below - domNode which lower corner will be at the bottom of bracket
     * params.direction - if "start", the bracket will be shown at the left of widgets 
     *   in ltr mode and at the right in rtl mode; "end" is otherwise; "start" is default
     */
    util.showClosableTooltipOnVerticalBracket = function (params) {
        var aboveNode = params.above;
        var belowNode = params.below || params.above;

        var abovePos = domGeom.position(aboveNode, true);
        var belowPos = domGeom.position(belowNode, true);

        var isLeft = (document.dir !== "rtl" ? params.direction === "start" : params.direction === "end");

        var abovePoint = {
            x: abovePos.x + abovePos.w * (isLeft ? 0 : 1),
            y: abovePos.y
        };
        var belowPoint = {
            x: belowPos.x + belowPos.w * (isLeft ? 0 : 1),
            y: belowPos.y + belowPos.h
        };

        var bracket = domConstruct.create("div", {
            class: "esriMapsAnalystFlexibleTooltip_tooltip esriMapsAnalystXNonSelectable"
        }, document.body);
        var surfaceContainer = domConstruct.create("div", {
            class: "esriMapsAnalystFlexibleTooltip_surfaceContainer"
        }, bracket);
        var styleOfBracket = {}, paramsOfBracket = {
            top: abovePoint.y - 2,
            left: abovePoint.x + (isLeft ? -3 : 3),
            height: belowPoint.y - abovePoint.y + 4,
            width: 10
        };

        for (var param in paramsOfBracket)
            styleOfBracket[param] = paramsOfBracket[param] + "px";

        domStyle.set(bracket, styleOfBracket);

        var surface = gfx.createSurface(surfaceContainer, paramsOfBracket.width, paramsOfBracket.height);
        surface.clear();
        var points = [
            { x: isLeft ? paramsOfBracket.width : 0, y: 0 },
            { x: isLeft ? 0 : paramsOfBracket.width, y: 0 },
            { x: isLeft ? 0 : paramsOfBracket.width, y: paramsOfBracket.height },
            { x: isLeft ? paramsOfBracket.width : 0, y: paramsOfBracket.height }
        ];
        var p = surface.createPolyline(points);
        p.setStroke({
            color: "#6E6E6E",
            width: 6
        });

        params.component = bracket;
        var tooltipInfo = _createClosableTooltip(params.message, params.tooltipClass, params.position);

        var cleanup = function () {
            clickHandler && clickHandler.remove();
            checkInLayoutHandle && clearInterval(checkInLayoutHandle);
            surface && surface.clear();
            domConstruct.destroy(surfaceContainer);
            domConstruct.destroy(bracket);
        }

        var checkInLayoutHandle = setInterval(function () {
            if (!DomUtil.isNodeInLayout(belowNode))
                cleanup();

            if (!DomUtil.isNodeVisible(belowNode))
                domStyle.set(bracket, "visibility", "hidden");
            else
                domStyle.set(bracket, "visibility", "visible");
        }, 300);

        params.timeout && setTimeout(cleanup, params.timeout);

        clickHandler = on(tooltipInfo.closeButton, "click", cleanup);
        tooltip = _placeClosableTooltip(tooltipInfo, params.component, params.timeout, params.position);
        var _removeFuncPrimary = tooltip._removeFunc;
        tooltip._removeFunc = function () {
            _removeFuncPrimary();
            cleanup();
        }
        return tooltip;
    }

    return util;
});
