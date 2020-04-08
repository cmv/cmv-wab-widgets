///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define([
  'dojo/_base/declare',
  'dojo/text!./drawTool.html',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/_base/lang',
  'dojo/Evented',
  'dojo/on',
  'dojo/dom-construct',
  'dojo/query',
  'dojo/dom-class',
  'dojo/_base/array',
  'jimu/BaseWidget',
  'jimu/dijit/DrawBox',
  'jimu/dijit/FeatureSetChooserForMultipleLayers',
  'jimu/SelectionManager',
  'esri/geometry/geometryEngine',
  'dojo/_base/html',
  'dojo/_base/array',
  './SelectableLayerItem',
  'jimu/dijit/Message',
  'dijit/focus',
  "dojo/dom-style",
  'dojo/keys',
  "dojo/_base/event",
  'jimu/utils',
  'dojo/dom-attr'
], function (
  declare,
  template,
  _WidgetsInTemplateMixin,
  lang,
  Evented,
  on,
  domConstruct,
  query,
  domClass,
  arrayUtils,
  BaseWidget,
  DrawBox,
  FeatureSetChooserForMultipleLayers,
  SelectionManager,
  GeometryEngine,
  html,
  array,
  SelectableLayerItem,
  Message,
  focusUtil,
  domStyle,
  keys,
  Event,
  jimuUtils,
  domAttr
) {
  return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
    // Set base class for custom draw tool widget
    baseClass: 'jimu-widget-screening-drawTool',
    // Set base template to templateString parameter
    templateString: template,
    _drawTool: null, // To store the instance of DrawBox (Draw Tool)
    _filteredLayerArray: [], // to store layer needed to pass to select tool
    selectTool: null, // To store the instance of FeatureSetChooserForMultipleLayers (Select Tool)
    layerItems: null, // To store all the selectable layer item
    currentSelectedDrawTool: null,
    _selectToolFocusElement: null,

    constructor: function (options) {
      this._drawTool = null;
      this._filteredLayerArray = [];
      this.selectTool = null;
      this.layerItems = null;
      this.currentSelectedDrawTool = null;
      this._selectToolFocusElement = null;
      lang.mixin(this, options);
    },

    postCreate: function () {
      this.layerItems = [];
      this._createFeatureLayerArr();
      this._initializeDrawBoxTools();
      if ((this.config.drawToolSelectableLayers &&
        this.config.drawToolSelectableLayers.length > 0) ||
        (!this.config.drawToolSelectableLayers)) {
        this._initializeSelectTool();
        this._setFeatureLayersForSelectTool();
        //for displaying list of layers
        this._initLayers();
      } else {
        this._hideLayerChooserListOfSelectTool();
      }
      this.own(on(this.layerSectionIcon, 'click', lang.hitch(this, function (evt) {
        Event.stop(evt);
        this._showOrHideLayerDetailsContainer();
      })));
      this.own(on(this.impactSummaryLayerTitle, 'click',
        lang.hitch(this, this._showOrHideLayerDetailsContainer)));
      this.own(on(this.layerSectionIcon, 'keydown',
        lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            Event.stop(evt);
            this._showOrHideLayerDetailsContainer();
          }
          if (evt.keyCode === keys.ESCAPE) {
            if (!this.isSingleTabSelected) {
              Event.stop(evt);
              this.emit("focusLastSelectedTab");
            }
          }
        }))
      );
      this.own(on(this.impactSummaryLayerTitle, 'keydown',
        lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            Event.stop(evt);
            this._showOrHideLayerDetailsContainer();
          }
        }))
      );
      this.own(on(this.selectAllLayers, 'click', lang.hitch(this, function (evt) {
        Event.stop(evt);
        this._selectAllLayers();
      })));
      this.own(on(this.selectAllLayers, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this._selectAllLayers();
        }
        if (evt.keyCode === keys.ESCAPE) {
          if (!this.isSingleTabSelected) {
            Event.stop(evt);
            this.emit("focusLastSelectedTab");
          }
        }
      })));
      this.own(on(this.singleLayerSelectionWarning, 'click', lang.hitch(this, function (evt) {
        Event.stop(evt);
        this._showMessage(this.nls.drawToolWidget.layerSelectionWarningTooltip);
      })));
      this.own(on(this.singleLayerSelectionWarning, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this._showMessage(this.nls.drawToolWidget.layerSelectionWarningTooltip);
        }
        if (evt.keyCode === keys.ESCAPE) {
          if (!this.isSingleTabSelected) {
            Event.stop(evt);
            this.emit("focusLastSelectedTab");
          }
        }
      })));
    },

    /**
     * This function to is used to initialize the layers that could be considered in selection list
     * @memberOf drawTool/drawTool
     */
    _initLayers: function () {
      html.empty(this.layerItemsNode);
      array.forEach(this._filteredLayerArray, lang.hitch(this, function (layerObject) {
        // hide from the layer list if layerobject is undefined or there is no objectIdField
        if (layerObject && layerObject.objectIdField && layerObject.geometryType) {
          var layerInfo, selectableLayerItemObj;
          array.forEach(this.layerInfoArray, lang.hitch(this, function (layerInfoDetail) {
            if (layerInfoDetail.id === layerObject.id) {
              layerInfo = layerInfoDetail;
            }
          }));
          selectableLayerItemObj = new SelectableLayerItem({
            layerInfo: layerInfo,
            checked: true,
            layerVisible: true,
            map: this.map,
            nls: this.nls,
            isSingleTabSelected: this.isSingleTabSelected
          });
          this.own(on(selectableLayerItemObj, 'stateChange', lang.hitch(this, function () {
            this.emit("clearExistingSelection");
            this.selectTool.setFeatureLayers(this._getSelectableLayers());
            this._updateSelectAllState();
          })));
          this.own(on(selectableLayerItemObj, 'focusLastSelectedTab', lang.hitch(this, function () {
            this.emit("focusLastSelectedTab");
          })));
          selectableLayerItemObj.init(layerObject);
          html.place(selectableLayerItemObj.domNode, this.layerItemsNode);
          selectableLayerItemObj.startup();
          this.layerItems.push(selectableLayerItemObj);
        }
      }));
    },

    /**
     * This function to is used to get all the selectable layers
     * @memberOf drawTool/drawTool
     */
    _getSelectableLayers: function () {
      var layers = [];
      array.forEach(this.layerItems, function (layerItem) {
        if (layerItem.isLayerVisible() && layerItem.isChecked()) {
          layers.push(layerItem.featureLayer);
        }
      }, this);
      return layers;
    },

    /**
     * This function is used to show/hide the layer list
     * @memberOf Screening/drawTool/drawTool
     */
    _showOrHideLayerDetailsContainer: function () {
      if (domClass.contains(this.layerSectionIcon, "esriCTLayerPanelCollapseIcon")) {
        domClass.add(this.entireLayerParentContainer, "esriCTHidden");
        domClass.replace(this.layerSectionIcon, "esriCTLayerPanelExpandIcon", "esriCTLayerPanelCollapseIcon");
        domAttr.set(this.layerSectionIcon, 'aria-expanded', "false");
      } else {
        domClass.remove(this.entireLayerParentContainer, "esriCTHidden");
        domClass.replace(this.layerSectionIcon, "esriCTLayerPanelCollapseIcon", "esriCTLayerPanelExpandIcon");
        domAttr.set(this.layerSectionIcon, 'aria-expanded', "true");
      }
    },

    /**
     * This function to is used to select all the layers
     * @memberOf drawTool/drawTool
     */
    _selectAllLayers: function () {
      var isSelectAll;
      html.toggleClass(this.selectAllLayers, 'checked');
      isSelectAll = domClass.contains(this.selectAllLayers, "checked");
      if (isSelectAll) {
        domAttr.set(this.selectAllLayers, 'aria-checked', "true");
      } else {
        domAttr.set(this.selectAllLayers, 'aria-checked', "false");
      }
      array.forEach(this.layerItems, function (layerItem) {
        if (isSelectAll) {
          if (!domClass.contains(layerItem.selectableCheckBox, "checked")) {
            layerItem.selectableCheckBox.click();
            domAttr.set(layerItem.selectableCheckBox, 'aria-checked', "true");
          }
        } else {
          if (domClass.contains(layerItem.selectableCheckBox, "checked")) {
            layerItem.selectableCheckBox.click();
            domAttr.set(layerItem.selectableCheckBox, 'aria-checked', "false");
          }
        }
      });
    },

    /**
     * This function to is used to update the state of select all checkbox
     * @memberOf drawTool/drawTool
     */
    _updateSelectAllState: function () {
      var isSelectAll, hasAnyUnchecked, hasAllUnchecked;
      hasAllUnchecked = true;
      isSelectAll = domClass.contains(this.selectAllLayers, "checked");
      array.forEach(this.layerItems, function (layerItem) {
        if (!domClass.contains(layerItem.selectableCheckBox, "checked")) { // un-check
          hasAnyUnchecked = true;
        } else {
          hasAllUnchecked = false;
        }
      });
      if (hasAnyUnchecked) {
        domClass.remove(this.selectAllLayers, 'checked');
        domAttr.set(this.selectAllLayers, 'aria-checked', "false");
      } else {
        if (!isSelectAll) {
          domClass.add(this.selectAllLayers, 'checked');
          domAttr.set(this.selectAllLayers, 'aria-checked', "true");
        }
      }
      if (hasAllUnchecked) {
        domClass.remove(this.singleLayerSelectionWarning, 'esriCTHidden');
        this.singleLayerSelectionWarning.focus();
      } else {
        domClass.add(this.singleLayerSelectionWarning, 'esriCTHidden');
      }
    },

    /**
     * This function to is used to create array of valid feature needed to pass to select tool
     * @memberOf drawTool/drawTool
     */
    _createFeatureLayerArr: function () {
      if (this.config.drawToolSelectableLayers) {
        array.forEach(this.config.drawToolSelectableLayers, lang.hitch(this, function (layerId) {
          var layerObjectDetails = this.layerInfosObj.getLayerInfoById(layerId).layerObject;
          if (layerObjectDetails !== '' && layerObjectDetails !== null && layerObjectDetails !== undefined) {
            this._filteredLayerArray.push(layerObjectDetails);
          }
        }));
      } else {
        var layerId;
        for (layerId in this.filteredLayerObj) {
          if (this.filteredLayerObj.hasOwnProperty(layerId)) {
            this._filteredLayerArray.push(this.filteredLayerObj[layerId]);
          }
        }
      }
    },

    /**
     * This function is used to hide all the draw tools.
     * @memberOf drawTool/drawTool
     */
    _hideAllTheDrawTools: function () {
      if (this._drawTool) {
        query(".draw-item", this._drawTool.domNode).addClass("esriCTHidden");
      }
    },

    /**
     * This function to initialize jimu dijit Draw Box
     * @memberOf drawTool/drawTool
     */
    _initializeDrawBoxTools: function () {
      var geometry, geoTypesArr, hasDisplayToolProperty;
      geoTypesArr = [];
      hasDisplayToolProperty = false;
      if (this.config.hasOwnProperty("showPointTool") && this.config.showPointTool) {
        geoTypesArr.push("POINT");
      }
      if (this.config.hasOwnProperty("showPolylineTool") && this.config.showPolylineTool) {
        geoTypesArr.push("POLYLINE");
      }
      if (this.config.hasOwnProperty("showExtentTool") && this.config.showExtentTool) {
        geoTypesArr.push("EXTENT");
      }
      if (this.config.hasOwnProperty("showPolygonTool") && this.config.showPolygonTool) {
        geoTypesArr.push("POLYGON");
      }
      if (this.config.hasOwnProperty("showCircleTool") && this.config.showCircleTool) {
        geoTypesArr.push("CIRCLE");
      }
      // tracks that configuration has introduced new feature to select draw tool
      if ((this.config.hasOwnProperty("showPointTool")) ||
        (this.config.hasOwnProperty("showPolylineTool")) ||
        (this.config.hasOwnProperty("showExtentTool")) ||
        (this.config.hasOwnProperty("showPolygonTool")) ||
        (this.config.hasOwnProperty("showCircleTool"))) {
        hasDisplayToolProperty = true;
      }
      // backward compatibility for "POINT", "POLYLINE", "EXTENT", "POLYGON", "CIRCLE"
      if ((!this.config.hasOwnProperty("showPointTool")) &&
        (!this.config.hasOwnProperty("showPolylineTool")) &&
        (!this.config.hasOwnProperty("showExtentTool")) &&
        (!this.config.hasOwnProperty("showPolygonTool")) &&
        (!this.config.hasOwnProperty("showCircleTool"))) {
        // for backward compatibility when draw tools can't be configured
        geoTypesArr.push("POINT", "POLYLINE", "EXTENT", "POLYGON");
      }
      // Initialize draw box
      this._drawTool = new DrawBox({
        geoTypes: geoTypesArr,
        map: this.map,
        pointSymbol: this.pointSymbol,
        polylineSymbol: this.polylineSymbol,
        polygonSymbol: this.polygonSymbol
      }, this.drawToolIconsParentDiv);
      this._drawTool.startup();
      this._attachKeydownEventToTheNodes();
      this._addAriaLabelToDrawTools();
      // If no geoTypes are passed to this widget, it displays all the tools.
      // Consider, a case when no tool is selected in the configuration, draw tool display
      // all the tools. To solve this, just hide this widget.
      if (hasDisplayToolProperty && geoTypesArr.length === 0) {
        this._hideAllTheDrawTools();
      }
      // On draw tool activated, deactivate select tool if selected
      this.own(on(this._drawTool, "draw-activate", lang.hitch(this, function (tool) {
        this.currentSelectedDrawTool = tool;
        this._hideLayerChooserListOfSelectTool();
        if (this.selectTool && this.selectTool.isActive()) {
          this._drawTool.drawToolBar.activate(tool);
        }
        if (tool === "extent") {
          this.map.disablePan();
        }
        this.map.setInfoWindowOnClick(false);
      })));
      // On draw complete by the draw tool
      this.own(on(this._drawTool, "draw-end", lang.hitch(this, function (graphics) {
        this.clearAllSelections(true);
        this._drawTool.drawLayer.clear();
        this.map.enablePan();
        // Simplify geometry if it is of type 'polygon'
        if (graphics.geometry.type === "polygon") {
          geometry = GeometryEngine.simplify(graphics.geometry);
        } else {
          geometry = graphics.geometry;
        }
        // Check that is geometry is available to create AOI buffer
        if (geometry) {
          this.emit("onDrawComplete", [graphics]);
        } else {
          this._drawTool.drawLayer.clear();
        }
        this.map.setInfoWindowOnClick(true);
        this._activateLastSelectedTool();
      })));
    },

    /**
     * This function to initialize jimu dijit feature set chooser from multiple layers
     * @memberOf drawTool/drawTool
     */
    _initializeSelectTool: function () {
      var clearButton, selectButton;
      // Initialize select tool
      this.selectTool = new FeatureSetChooserForMultipleLayers({
        map: this.map,
        updateSelection: true,
        fullyWithin: false
      }, this.selectToolDiv);
      clearButton = query(".btn-clear", this.selectTool.domNode)[0];
      // Hide clear button of the dijit
      domClass.add(clearButton, "esriCTHidden");
      domAttr.set(clearButton, 'tab-index', "-1");
      this._selectToolFocusElement = this.selectTool.domNode.children[0];
      domAttr.set(this._selectToolFocusElement, 'role', "button");
      domAttr.set(this._selectToolFocusElement, 'aria-label', this.nls.drawToolWidget.selectToolLabel);
      selectButton = query(".btn-select", this.selectTool.domNode)[0];
      // On select is activated, deactivate any draw tool if selected
      this.own(on(selectButton, "click", lang.hitch(this, function (evt) {
        Event.stop(evt);
        this._activateOrDeactivateSelectTool();
      })));
      this.own(on(this.selectToolParent, "keydown", lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ESCAPE) {
          if (!this.isSingleTabSelected) {
            Event.stop(evt);
            this.emit("focusLastSelectedTab");
          }
        }
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          selectButton.click();
        }
      })));
      // On selection complete
      this.own(on(this.selectTool, 'unloading', lang.hitch(this, function () {
        var graphics;
        this.currentSelectedDrawTool = "selectTool";
        this._deactivateSelectTool();
        graphics = this._getSelectedFeature();
        this.emit("onSelectionComplete", graphics);
        this._activateLastSelectedTool();
      })));
      //place select tool inline with draw tools
      domConstruct.place(this.selectToolParent, query(".draw-items", this.domNode)[0], "last");
    },

    /**
     * This function to deactivate tools if active
     * @memberOf drawTool/drawTool
     */
    deactivateTools: function () {
      // Deactivate draw tool, if active
      if (this._drawTool && this._drawTool.isActive()) {
        this._drawTool.deactivate();
      }
      // Deactivate select tool, if active
      if (this.selectTool && this.selectTool.isActive()) {
        this._deactivateSelectTool();
      }
      this.map.enablePan();
    },

    /**
     * This function to set feature layers for select tool
     * @memberOf drawTool/drawTool
     */
    _setFeatureLayersForSelectTool: function () {
      this.selectTool.setFeatureLayers(this._filteredLayerArray);
    },

    /**
     * This function to fetch selected features from the layers on
     * selection complete by select tool
     * @memberOf drawTool/drawTool
     */
    _getSelectedFeature: function () {
      var selectionLayerResponse;
      selectionLayerResponse = [];
      arrayUtils.forEach(this._filteredLayerArray, lang.hitch(this, function (layer) {
        selectionLayerResponse = selectionLayerResponse.concat(layer.getSelectedFeatures());
      }));
      return selectionLayerResponse;
    },

    /**
     * This function to deselect all features from all layers for select tool
     * @memberOf drawTool/drawTool
     */
    clearAllSelections: function (clearSelection) {
      var selectionMgr;
      selectionMgr = SelectionManager.getInstance();
      arrayUtils.forEach(this._filteredLayerArray, lang.hitch(this, function (layerObject) {
        if (clearSelection) {
          selectionMgr.clearSelection(layerObject);
        }
      }));
    },

    /**
     * This function is used to display error/warning/info message.
     * @memberOf drawTool/drawTool
     */
    _showMessage: function (msg) {
      var alertMessage = new Message({
        message: msg
      });
      alertMessage.message = msg;
    },

    /**
     * This function is used to show the layer chooser and seperator line
     * when select tool is activated
     */
    _displayLayerChooserListOfSelectTool: function () {
      domClass.remove(this.seperatorAfterSelect, "esriCTHidden");
      domClass.remove(this.parentDivOfChooseSymbol, "esriCTHidden");
    },

    /**
     * This function is used to hide the layer chooser and seperator line
     * when select tool is de-activated
     */
    _hideLayerChooserListOfSelectTool: function () {
      domClass.add(this.seperatorAfterSelect, "esriCTHidden");
      domClass.add(this.parentDivOfChooseSymbol, "esriCTHidden");
    },

    /**
     * This function is used to de-activate the select tool
     */
    _deactivateSelectTool: function () {
      if (this.selectTool) {
        this.selectTool.deactivate();
      }
      this._hideLayerChooserListOfSelectTool();
    },

    /**
     * This function is used to set focus to first draw tool
     */
    focusFirstNodeOfSelectedTab: function () {
      var isFocusSetOnTool;
      isFocusSetOnTool = false;
      array.forEach(this._drawTool.domNode.children[0].children, lang.hitch(this, function (drawTool) {
        var displayValue = domStyle.get(drawTool, "display");
        if (displayValue === "block") {
          if (!isFocusSetOnTool) {
            isFocusSetOnTool = true;
            this._focusOutCurrentNode();
            focusUtil.focus(drawTool);
          }
        }
      }));
    },

    /**
     * This function is used to set first focus node
     */
    setFirstFocusNode: function (domNodeObj) {
      var isFirstFocusNodeSet;
      isFirstFocusNodeSet = false;
      array.forEach(this._drawTool.domNode.children[0].children, lang.hitch(this, function (drawTool) {
        var displayValue = domStyle.get(drawTool, "display");
        if (displayValue === "block") {
          if (!isFirstFocusNodeSet) {
            isFirstFocusNodeSet = true;
            jimuUtils.initFirstFocusNode(domNodeObj, drawTool);
          }
        }
      }));
    },

    /**
     * This function is used to attach key down event to draw tools
     */
    _attachKeydownEventToTheNodes: function () {
      array.forEach(this._drawTool.domNode.children[0].children, lang.hitch(this, function (drawTool) {
        var displayValue = domStyle.get(drawTool, "display");
        if (displayValue === "block") {
          this.own(on(drawTool, 'keydown', lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ESCAPE) {
              if (!this.isSingleTabSelected) {
                Event.stop(evt);
                this.emit("focusLastSelectedTab");
              }
            }
          })));
        }
      }));
    },

    /**
     * This function is used to add aria labels to all the draw tools
     */
    _addAriaLabelToDrawTools: function () {
      array.forEach(this._drawTool.domNode.children[0].children, lang.hitch(this, function (drawTool) {
        var displayValue = domStyle.get(drawTool, "display");
        if (displayValue === "block") {
          var drawToolTitle = domAttr.get(drawTool, 'title');
          domAttr.set(drawTool, 'aria-label', drawToolTitle);
          domClass.add(drawTool, 'esriCTDrawItem');
        }
      }));
    },

    /**
     * This function is used to focus out the current node
     */
    _focusOutCurrentNode: function () {
      if (focusUtil.curNode) {
        focusUtil.curNode.blur();
      }
    },

    /**
     * This function is used to activate/de-activate select tool
     */
    _activateOrDeactivateSelectTool: function () {
      if (this._drawTool.isActive()) {
        this._drawTool.deactivate();
      }
      if (this.selectTool && this.selectTool.isActive()) {
        this._displayLayerChooserListOfSelectTool();
        this.map.disablePan();
      } else {
        this._deactivateSelectTool();
      }
    },

    /**
     * This function is used to set focus on select tool
     */
    setFocusOnSelectTool: function () {
      if (this.selectTool !== '' && this.selectTool !== null && this.selectTool !== undefined) {
        this._focusOutCurrentNode();
        focusUtil.focus(this._selectToolFocusElement);
        this.currentSelectedDrawTool = null;
      }
    },

    /**
     * This function is used to activate last selected draw tool
     */
    _activateLastSelectedTool: function () {
      switch (this.currentSelectedDrawTool) {
        case "point":
          this._focusOutCurrentNode();
          focusUtil.focus(this._drawTool.pointIcon);
          this.currentSelectedDrawTool = null;
          break;
        case "polyline":
          this._focusOutCurrentNode();
          focusUtil.focus(this._drawTool.polylineIcon);
          this.currentSelectedDrawTool = null;
          break;
        case "extent":
          this._focusOutCurrentNode();
          focusUtil.focus(this._drawTool.extentIcon);
          this.currentSelectedDrawTool = null;
          break;
        case "circle":
          this._focusOutCurrentNode();
          focusUtil.focus(this._drawTool.circleIcon);
          this.currentSelectedDrawTool = null;
          break;
        case "polygon":
          this._focusOutCurrentNode();
          focusUtil.focus(this._drawTool.polygonIcon);
          this.currentSelectedDrawTool = null;
          break;
        case "selectTool":
          this._focusOutCurrentNode();
          focusUtil.focus(this._selectToolFocusElement);
          break;
      }
    }
  });
});