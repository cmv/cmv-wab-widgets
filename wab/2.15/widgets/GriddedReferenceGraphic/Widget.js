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
/*jshint bitwise: false*/
define([
    "dojo",
    "dojo/_base/declare",
    "jimu/BaseWidget",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/kernel",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/_base/html",
    "dojo/query",
    "dojo/topic",
    "dojo/json",

    "dijit/_WidgetBase",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/popup",
    "dijit/Menu",
    "dijit/MenuItem",

    "jimu/dijit/Message",
    "jimu/dijit/LoadingIndicator",
    "jimu/LayerInfos/LayerInfos",
    "jimu/LayerStructure",
    "jimu/utils",
    "jimu/dijit/CoordinateControl",

    "esri/IdentityManager",
    "esri/arcgis/Portal",
    "esri/Color",
    "esri/dijit/util/busyIndicator",
    "esri/graphic",
    "esri/geometry/geometryEngine",
    "esri/geometry/Extent",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/webMercatorUtils",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/LabelClass",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/TextSymbol",
    "esri/toolbars/draw",
    "esri/toolbars/edit",
    "esri/renderers/SimpleRenderer",

    "./js/GridSettings",
    "./js/drawGRG",
    "./js/geometry-utils",
    "./js/geometryUtils",
    "./js/mgrs-utils",
    "./js/mgrs",
    "./js/util",
    'dijit/focus',
    'dojo/keys',
    "dojo/dom-attr",
    "dijit/form/NumberTextBox",
    "dijit/form/RadioButton",
    "dijit/form/NumberSpinner",
    "jimu/dijit/formSelect"
  ],
  function (
    dojo,
    declare,
    BaseWidget,
    array,
    lang,
    kernel,
    domStyle,
    domClass,
    domConstruct,
    on,
    html,
    query,
    topic,
    dojoJSON,
    dijitWidgetBase,
    dijitWidgetsInTemplate,
    dijitPopup,
    Menu,
    MenuItem,
    Message,
    LoadingIndicator,
    jimuLayerInfos,
    LayerStructure,
    utils,
    CoordinateControl,
    esriId,
    esriPortal,
    Color,
    busyIndicator,
    Graphic,
    GeometryEngine,
    Extent,
    Point,
    Polyline,
    WebMercatorUtils,
    FeatureLayer,
    GraphicsLayer,
    LabelClass,
    SimpleMarkerSymbol,
    SimpleFillSymbol,
    TextSymbol,
    Draw,
    Edit,
    SimpleRenderer,
    GridSettings,
    drawGRG,
    gridGeomUtils,
    geometryUtils,
    mgrsUtils,
    mgrs,
    CoordinateUtilities,
    focusUtils,
    keys,
    domAttr
  ) {
    return declare([BaseWidget, dijitWidgetBase, dijitWidgetsInTemplate], {
      baseClass: "jimu-widget-GRGDrafter",
      _lastOpenPanel: "mainPage", //Flag to hold last open panel, default will be main page
      _currentOpenPanel: "mainPage", //Flag to hold last open panel, default will be main page
      _gridSettingsInstance: null, //Object to hold Grid Settings instance
      _cellShape: "default", //Current selected grid cell shape
      _labelStartPosition: "lowerLeft", //Current selected label start position
      _cellUnits: "meters", //Current selected cell units
      _labelType: "alphaNumeric", //Current selected label type
      _labelTypeWithRefSys: "gridReferenceSystem", //Current selected label type
      _labelDirection: "horizontal", //Current selected label direction
      _gridOrigin: "center", //Current selected grid origin
      _referenceSystem: "MGRS", //Current selected reference system
      _showLabels: true, //flag to hold whether labels should be shown
      _GRGAreaFillSymbol: null, //Fill symbol used for GRG cells
      _cellTextSymbol: null, //Text symbol used for GRG labeling
      angle: 0, //angle of GRG
      featureLayerInfo: null,
      centerPoint: [], //Current center point of the GRG extent
      geodesicGrid: true, //Flag for if the GRG is to be created geodesically

      postMixInProperties: function () {
        //mixin default nls with widget nls
        this.nls.common = {};
        lang.mixin(this.nls.common, window.jimuNls.common);
      },

      constructor: function (args) {
        declare.safeMixin(this, args);
      },

      postCreate: function () {
        //modify String's prototype so we can format a string using .format
        if (!String.prototype.format) {
          String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
              return typeof args[number] !== 'undefined' ? args[number] : match;
            });
          };
        }

        //Check if AR locale
        if (window.isRTL && kernel.locale === "ar") {
          domStyle.set(this.helpBtnForArea, "transform", "rotateY(180deg)");
          domStyle.set(this.helpBtnForPt, "transform", "rotateY(180deg)");
        } else {
          domStyle.set(this.helpBtnForArea, "transform", "");
          domStyle.set(this.helpBtnForPt, "transform", "");
        }

        this.inherited(arguments);

        //set up the symbology used for the interactive polygon draw tools
        this.extentAreaFillSymbol = {
          type: 'esriSFS',
          style: 'esriSFSSolid',
          color: [155, 155, 155, 0],
          outline: {
            color: [0, 0, 255, 255],
            width: 1.25,
            type: 'esriSLS',
            style: 'esriSLSSolid'
          }
        };

        //set up the symbology used for the interactive point draw tools
        this.pointSymbol = {
          'color': [255, 0, 0, 255],
          'size': 8,
          'type': 'esriSMS',
          'style': 'esriSMSCircle',
          'outline': {
            'color': [255, 0, 0, 255],
            'width': 1,
            'type': 'esriSLS',
            'style': 'esriSLSSolid'
          }
        };

        //set up the symbology used for the interactive point draw tools
        this.pointSymbol = {
          'color': [255, 0, 0, 255],
          'size': 8,
          'type': 'esriSMS',
          'style': 'esriSMSCircle',
          'outline': {
            'color': [255, 0, 0, 255],
            'width': 1,
            'type': 'esriSLS',
            'style': 'esriSLSSolid'
          }
        };

        // Create renderer for coordinates
        var glrenderer = new SimpleRenderer(new SimpleMarkerSymbol(this.pointSymbol));

        //create graphics layer for coordinates
        this._coordinatesLayer = new GraphicsLayer();
        this._coordinatesLayer.spatialReference = this.map.spatialReference;
        this._coordinatesLayer.setRenderer(glrenderer);

        //create graphics layer for grid extent
        this._graphicsLayerGRGExtent = new GraphicsLayer({
          id: "graphicsLayerGRGExtent"
        });

        //create graphics layer for GRG from time and speed extent
        this._graphicsLayerGRGTimeExtent = new GraphicsLayer({
          id: "graphicsLayerGRGTimeExtent"
        });

        //set up symbology for polygon input
        this._extentSym = new SimpleFillSymbol(this.extentAreaFillSymbol);

        //set up symbology for point input
        this._ptSym = new SimpleMarkerSymbol(this.pointSymbol);

        //create a feature collection for the drawn GRG to populate
        var featureCollection = {
          "layerDefinition": {
            "geometryType": "esriGeometryPolygon",
            "objectIdField": "ObjectID",
            "fields": [{
              "name": "ObjectID",
              "alias": "ObjectID",
              "type": "esriFieldTypeOID"
            }, {
              "name": "grid",
              "alias": "grid",
              "type": "esriFieldTypeString"
            }],
            "drawingInfo": {
              "renderer": {
                "type": "simple",
                "symbol": this.gridSymbol
              },
              "transparency": 0,
              "labelingInfo": [{
                "labelExpression": "[grid]",
                "labelExpressionInfo": {
                  "value": "{grid}"
                },
                "format": null,
                "fieldInfos": null,
                "useCodedValues": false,
                "maxScale": 0,
                "minScale": 0,
                "where": null,
                "sizeInfo": null,
                "labelPlacement": "esriServerPolygonPlacementAlwaysHorizontal",
                "symbol": this._cellTextSymbol
              }]
            },
            "extent": {
              "xmin": -18746028.312877923,
              "ymin": -6027547.894280539,
              "xmax": 18824299.82984192,
              "ymax": 12561937.384669386,
              "spatialReference": {
                "wkid": 102100
              }
            }
          }
        };

        //create a the GRG feature layer
        this.GRGArea = new FeatureLayer(featureCollection, {
          id: "Gridded-Reference-Graphic",
          outFields: ["*"],
          showLabels: true
        });
        this.createGraphicDeleteMenu();

        //add the GRG feature layer and the GRG extent graphics layer to the map
        this.map.addLayers([this._graphicsLayerGRGTimeExtent,
          this.GRGArea, this._graphicsLayerGRGExtent, this._coordinatesLayer
        ]);

        var featureLayerInfo;
        //must ensure the layer is loaded before we can access it to turn on the labels if required
        if (this.GRGArea.loaded) {
          // show or hide labels
          featureLayerInfo =
            jimuLayerInfos.getInstanceSync().getLayerInfoById("Gridded-Reference-Graphic");
          featureLayerInfo.enablePopup();
          if (this._showLabels) {
            featureLayerInfo.showLabels();
          }
        } else {
          this.GRGArea.on("load", lang.hitch(this, function () {
            // show or hide labels
            featureLayerInfo =
              jimuLayerInfos.getInstanceSync().getLayerInfoById("Gridded-Reference-Graphic");
            featureLayerInfo.enablePopup();
            if (this._showLabels) {
              featureLayerInfo.showLabels();
            }
          }));
        }

        this.grgPointBySizeCoordTool = new CoordinateControl({
          parentWidget: this,
          label: this.nls.coordInputLabel,
          input: true,
          showCopyButton: false,
          showFormatButton: true,
          showDrawPoint: true,
          drawButtonLabel: this.nls.addPointToolTip,
          graphicsLayer: this._coordinatesLayer
        });
        this.grgPointBySizeCoordTool.placeAt(this.newGRGPointBySizeOriginCoordsContainer);
        this.grgPointBySizeCoordTool.startup();

        this.grgPointByRefSystemCoordTool = new CoordinateControl({
          parentWidget: this,
          label: this.nls.coordInputLabel,
          input: true,
          showCopyButton: false,
          showFormatButton: true,
          showDrawPoint: true,
          drawButtonLabel: this.nls.addPointToolTip,
          graphicsLayer: this._coordinatesLayer
        });
        this.grgPointByRefSystemCoordTool.placeAt(this.newGRGPointByRefSystemOriginCoordsContainer);
        this.grgPointByRefSystemCoordTool.startup();

        this.grgPointByTimeCoordTool = new CoordinateControl({
          parentWidget: this,
          label: this.nls.coordInputLabel,
          input: true,
          showCopyButton: false,
          showFormatButton: true,
          showDrawPoint: true,
          drawButtonLabel: this.nls.addPointToolTip,
          graphicsLayer: this._coordinatesLayer
        });
        this.grgPointByTimeCoordTool.placeAt(this.newGRGPointByTimeOriginCoordsContainer);
        this.grgPointByTimeCoordTool.startup();

        // add toolbar for drawing GRG Area by Extent
        this.dt_AreaBySize = new Draw(this.map);

        // add toolbar for drawing GRG MGRS
        this.dt_AreaByRefSystem = new Draw(this.map);

        // add edit toolbar that will be used for rotating grid
        this.editToolbar = new Edit(this.map, {
          uniformScaling: true,
          allowAddVertices: true,
          allowDeleteVertices: true
        });

        this._initLoading();

        //set up all the handlers for the different click events
        this._handleClickEvents();

        this._createGridSettings();

        this.util = new CoordinateUtilities({
          appConfig: this.appConfig,
          nls: this.nls
        });

        this.restrictedCharlist = "\'\"<>{}[]#$%^&;:/\\";

        if (this.config.grg.operationalLayer.name === '') {
          // Hide the checkbox and drop-down list
          domClass.add(this.publishNewLayer, 'controlGroupHidden');
          domClass.add(this.featureLayerList.domNode, 'controlGroupHidden');
          // Set the checkbox to true since user is publishing to a new layer
          this.publishNewLayer.setValue(true);
          // Show the textbox
          domClass.remove(this.addGRGNameArea.domNode, 'controlGroupHidden');
        }

        //Retrieve all layers from webmap
        this._layerList = this._getAllMapLayers();

        // populate the publish list
        this._populateSelectList(this.featureLayerList, this._layerList,
          this.config.grg.operationalLayer.name, true);
        this._supportAccessibility();
        focusUtils.focus(this.newGRGAreaButton);
      },

      startup: function () {
        this.inherited(arguments);
        this.busyIndicator = busyIndicator.create({
          target: this.domNode.parentNode.parentNode.parentNode,
          backgroundOpacity: 0
        });
        this._setTheme();
        domAttr.set(this.grgPointByTimeTimeUnits, "aria-label", this.nls.time + "" + this.nls.common.unit);
        domAttr.set(this.grgPointByTimeRateUnits, "aria-label", this.nls.rate + "" + this.nls.common.unit);
      },

      /**
       * Performs activities like resizing widget components, connect map click etc on widget open
       * @memberOf widgets/GRG/Widget
       */
      onOpen: function () {},

      /**
       * Performs activities like disconnect map handlers, close popup etc on widget close
       * @memberOf widgets/GRG/Widget
       */
      onClose: function () {
        if (this.grgPointBySizeCoordinateFormat && this.grgPointBySizeCoordinateFormat.domNode.offsetParent) {
          dijitPopup.close(this.grgPointBySizeCoordinateFormat);
        }

        if (this.grgPointByRefSystemCoordinateFormat && this.grgPointByRefSystemCoordinateFormat.domNode.offsetParent) {
          dijitPopup.close(this.grgPointByRefSystemCoordinateFormat);
        }

        if (this.grgPointByTimeCoordinateFormat && this.grgPointByTimeCoordinateFormat.domNode.offsetParent) {
          dijitPopup.close(this.grgPointByTimeCoordinateFormat);
        }
      },

      /**
       * This function used for loading indicator
       * @memberOf widgets/GRG/Widget
       */
      _initLoading: function () {
        this.loading = new LoadingIndicator({
          hidden: true
        });
        this.loading.placeAt(this.domNode);
        this.loading.startup();
      },

      /**
       * This function is called on click of new grg area button
       *  @memberOf widgets/GRG/Widget
       */
      _newGRGAreaButtonClicked: function () {
        if (domClass.contains(this.newGRGAreaButton, 'GRGNewRightButton')) {
          //in closed state - so open and change arrow to down
          html.removeClass(this.fromAreaContainer, 'controlGroupHidden');
          html.removeClass(this.newGRGAreaButton, 'GRGNewRightButton');
          html.addClass(this.newGRGAreaButton, 'GRGNewDownButton');
          //close grg by point dropdown if open
          html.addClass(this.fromPointContainer, 'controlGroupHidden');
          html.removeClass(this.newGRGPointButton, 'GRGNewDownButton');
          html.addClass(this.newGRGPointButton, 'GRGNewRightButton');
          this._supportAccessibility();
          focusUtils.focus(this.newGRGAreaButton);
        } else {
          //in open state - so close and change arrow to right
          html.addClass(this.fromAreaContainer, 'controlGroupHidden');
          html.addClass(this.newGRGAreaButton, 'GRGNewRightButton');
          html.removeClass(this.newGRGAreaButton, 'GRGNewDownButton');
        }
      },

      /**
       * This function is called on click of new grg point button
       * @memberOf widgets/GRG/Widget
       */
      _newGRGPointButtonClicked: function () {
        if (domClass.contains(this.newGRGPointButton, 'GRGNewRightButton')) {
          //in closed state - so open and change arrow to down
          html.removeClass(this.fromPointContainer, 'controlGroupHidden');
          html.removeClass(this.newGRGPointButton, 'GRGNewRightButton');
          html.addClass(this.newGRGPointButton, 'GRGNewDownButton');
          //close grg by area dropdown if open
          html.addClass(this.fromAreaContainer, 'controlGroupHidden');
          html.removeClass(this.newGRGAreaButton, 'GRGNewDownButton');
          html.addClass(this.newGRGAreaButton, 'GRGNewRightButton');
          this._updateLastFocusNode();
        } else {
          //in open state - so close and change arrow to right
          html.addClass(this.fromPointContainer, 'controlGroupHidden');
          html.addClass(this.newGRGPointButton, 'GRGNewRightButton');
          html.removeClass(this.newGRGPointButton, 'GRGNewDownButton');
          this._supportAccessibility();
        }
      },

      /**
       * This function is called on click publish panel back buuton
       */
      _publishPanelBackButtonClicked: function () {
        //remove any messages
        this.publishMessage.innerHTML = '';
        //clear layer name
        this.addGRGNameArea.setValue('');
        //Reset layer name
        this.addGRGNameArea.reset();
        this._graphicsLayerGRGExtent.show();
        this._graphicsLayerGRGTimeExtent.clear();
        this._showPanel(this._lastOpenPanel);
      },

      /**
       * This function is called on click of _grg AreaBySize Publish GRGButton
       */
      _grgAreaBySizePublishGRGButtonClicked: function () {
        var layerName = (this.publishNewLayer.checked) ? this.addGRGNameArea.value : this.featureLayerList.getValue();
        if (this._isValidGRGLayerName(layerName)) {
          this.publishMessage.innerHTML = '';
          this._initSaveToPortal(layerName);
        } else {
          // Invalid entry
          if (!domClass.contains(this.addGRGNameArea.domNode, 'controlGroupHidden')) {
            focusUtils.focus(this.addGRGNameArea.domNode);
          }
          this.addGRGNameArea.set("state", "Error");
          this.addGRGNameArea.displayMessage(this.nls.missingLayerNameMessage);
          this.publishMessage.innerHTML = this.nls.missingLayerNameMessage;
        }
      },

      /**
       * This function is called on click of settings ShowLabelsToggle
       */
      _settingsShowLabelsToggleClicked: function () {
        var featureLayerInfo =
          jimuLayerInfos.getInstanceSync().getLayerInfoById("Gridded-Reference-Graphic");
        this._showLabels = this.settingsShowLabelsToggle.checked;
        if (this.settingsShowLabelsToggle.checked) {
          featureLayerInfo.showLabels();
        } else {
          featureLayerInfo.hideLabels();
        }
      },

      /**
       * Handle click events for different controls
       * @memberOf widgets/GRG/Widget
       **/
      _handleClickEvents: function () {
        /**
         * Main menu panel buttons
         **/
        //handle new GRG Area button click
        this.own(on(this.newGRGAreaButton, "click", lang.hitch(this, this._newGRGAreaButtonClicked)));

        //code for accessibility
        this.own(on(this.newGRGAreaButton, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._newGRGAreaButtonClicked();
          }
        })));

        //handle new GRG Point button click
        this.own(on(this.newGRGPointButton, "click", lang.hitch(this, this._newGRGPointButtonClicked)));

        //code for accessibility
        this.own(on(this.newGRGPointButton, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._newGRGPointButtonClicked();
          }
        })));

        //Handle click event new GRG by size button
        this.own(on(this.newAreaGRGBySizeButton, 'click', lang.hitch(this, function () {
          this._showPanel("grgAreaBySize");
        })));

        //code for accessibility
        this.own(on(this.newAreaGRGBySizeButton, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._showPanel("grgAreaBySize");
          }
        })));

        //Handle click event new GRG by reference system button
        this.own(on(this.newAreaGRGFromRefSystemButton, 'click', lang.hitch(this, function () {
          this._showPanel("grgAreaByRefSystem");
        })));

        //code for accessibility
        this.own(on(this.newAreaGRGFromRefSystemButton, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._showPanel("grgAreaByRefSystem");
          }
        })));

        //Handle click event new GRG by size button
        this.own(on(this.newPointGRGBySizeButton, 'click', lang.hitch(this, function () {
          this._showPanel("grgPointBySize");
        })));

        //code for accessibility
        this.own(on(this.newPointGRGBySizeButton, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._showPanel("grgPointBySize");
          }
        })));

        //Handle click event new GRG by reference system button
        this.own(on(this.newPointGRGFromRefSystemButton, 'click', lang.hitch(this, function () {
          this._showPanel("grgPointByRefSystem");
        })));

        //code for accessibility
        this.own(on(this.newPointGRGFromRefSystemButton, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._showPanel("grgPointByRefSystem");
          }
        })));

        //Handle click event new GRG by time and speed button
        this.own(on(this.newPointGRGFromTimeButton, 'click', lang.hitch(this, function () {
          this._showPanel("grgPointByTime");
        })));

        //code for accessibility
        this.own(on(this.newPointGRGFromTimeButton, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._showPanel("grgPointByTime");
          }
        })));

        /**
         * GRG from Area by Size panel
         **/
        //Handle click event of back button
        this.own(on(this.grgAreaBySizePanelBackButton, 'click', lang.hitch(this, function () {
          this._resetOnBackToMainPage();
        })));

        //code for accessibility
        this.own(on(this.grgAreaBySizePanelBackButton, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._resetOnBackToMainPage();
          }
        })));

        //handle Grid Settings button
        if (!this.config.grg.lockSettings) {
          this.own(on(this.grgAreaBySizeSettingsButton, "click", lang.hitch(this, function () {
            this._updateSettingsPage(this._currentOpenPanel);
            this._showPanel("settingsPage");
          })));
          //code for accessibility
          this.own(on(this.grgAreaBySizeSettingsButton, "keydown", lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._updateSettingsPage(this._currentOpenPanel);
              this._showPanel("settingsPage");
            }
          })));
        } else {
          this.grgAreaBySizeSettingsButton.title = this.nls.lockSettings;
          html.addClass(this.grgAreaBySizeSettingsButton, 'settingsLocked');
          html.removeClass(this.grgAreaBySizeSettingsButton, 'GRGDrafterSettingsIcon');
        }

        //Handle click event of Add GRG Area by Polygon button
        this.own(on(this.grgAreaBySizeDrawPolygonIcon, 'click', lang.hitch(this,
          this._grgAreaBySizeDrawPolygonIconClicked)));

        //code for accessibility
        this.own(on(this.grgAreaBySizeDrawPolygonIcon, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._grgAreaBySizeDrawPolygonIconClicked();
            }
          })));

        //Handle click event of Add GRG Area by Extent button
        this.own(on(this.grgAreaBySizeDrawExtentIcon, 'click', lang.hitch(this,
          this._grgAreaBySizeDrawExtentIconClicked)));

        //code for accessibility
        this.own(on(this.grgAreaBySizeDrawExtentIcon, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._grgAreaBySizeDrawExtentIconClicked();
            }
          })));

        //Handle completion of GRG area drawing
        this.own(on(this.dt_AreaBySize, 'draw-complete', lang.hitch(this,
          this._dt_AreaBySizeComplete)));

        //Handle click event of create GRG Area button
        this.own(on(this.grgAreaBySizeCreateGRGButton, 'click', lang.hitch(this,
          this._grgAreaBySizeCreateGRGButtonClicked)));

        //code for accessibility
        this.own(on(this.grgAreaBySizeCreateGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._grgAreaBySizeCreateGRGButtonClicked();
            }
          })));

        //Handle click event of clear GRG Area button
        this.own(on(this.grgAreaBySizeClearGRGButton, 'click', lang.hitch(this, function () {
          this._clearLayers(true);
        })));

        //code for accessibility
        this.own(on(this.grgAreaBySizeClearGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._clearLayers(true);
            }
          })));

        //Handle click event of number of row / columns checkbox
        this.own(on(this.setNumberRowsColumns, 'click', lang.hitch(this,
          this._setNumberRowsColumnsCheckBoxChanged)));

        //code for accessibility
        this.own(on(this.setNumberRowsColumns, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._setNumberRowsColumnsCheckBoxChanged();
            }
          })));

        //Handle number of horizontal cells change
        this.own(on(this.cellHorizontal, 'blur', lang.hitch(this, function () {
          if (this.cellHorizontal.isValid()) {
            if (this._graphicsLayerGRGExtent.graphics[0]) {
              if (this.angle === 0) {
                this._calculateCellWidthAndHeight(gridGeomUtils.extentToPolygon(
                  this._graphicsLayerGRGExtent.graphics[0].geometry.getExtent()));
              } else {
                this._calculateCellWidthAndHeight(
                  this._graphicsLayerGRGExtent.graphics[0].geometry);
              }
            }
          }
        })));

        //Handle number of vertical cells change
        this.own(on(this.cellVertical, 'blur', lang.hitch(this, function () {
          if (this.cellVertical.isValid()) {
            if (this._graphicsLayerGRGExtent.graphics[0]) {
              if (this.angle === 0) {
                this._calculateCellWidthAndHeight(gridGeomUtils.extentToPolygon(
                  this._graphicsLayerGRGExtent.graphics[0].geometry.getExtent()));
              } else {
                this._calculateCellWidthAndHeight(
                  this._graphicsLayerGRGExtent.graphics[0].geometry);
              }
            }
          }
        })));

        //Handle rotation number change
        this.own(on(this.grgAreaBySizeRotation, 'keyup', lang.hitch(this, function () {
          //set time out needed to give chance for the the input validation to occur
          setTimeout(lang.hitch(this, function () {
            if (this.grgAreaBySizeRotation.isValid() &&
              !isNaN(this.grgAreaBySizeRotation.value) &&
              this._graphicsLayerGRGExtent.graphics[0]) {
              var rotateBy = this.grgAreaBySizeRotation.getValue() - this.angle;
              var geom = GeometryEngine.rotate(
                this._graphicsLayerGRGExtent.graphics[0].geometry, rotateBy * -1);
              this._graphicsLayerGRGExtent.clear();
              var graphic = new Graphic(geom, this._extentSym);
              this._graphicsLayerGRGExtent.add(graphic);
              this.angle = this.grgAreaBySizeRotation.getValue();
              this.editToolbar.deactivate();
            }
          }), 1000);
        })));

        /**
         * GRG from Area by Reference System panel
         **/
        //Handle click event of back button
        this.own(on(this.grgAreaByRefSystemPanelBackButton, 'click',
          lang.hitch(this, function () {
            this._resetOnBackToMainPage();
          })));

        //code for accessibility
        this.own(on(this.grgAreaByRefSystemPanelBackButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._resetOnBackToMainPage();
            }
          })));

        //handle Grid Settings button
        if (!this.config.grg.lockSettings) {
          this.own(on(this.grgAreaByRefSystemSettingsButton, "click",
            lang.hitch(this, function () {
              this._updateSettingsPage(this._currentOpenPanel);
              this._showPanel("settingsPage");
            })));

          //code for accessibility
          this.own(on(this.grgAreaByRefSystemSettingsButton, "keydown",
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this._updateSettingsPage(this._currentOpenPanel);
                this._showPanel("settingsPage");
              }
            })));

        } else {
          this.grgAreaByRefSystemSettingsButton.title = this.nls.lockSettings;
          html.addClass(this.grgAreaByRefSystemSettingsButton, 'settingsLocked');
          html.removeClass(this.grgAreaByRefSystemSettingsButton, 'GRGDrafterSettingsIcon');
        }

        //Handle click event of draw extent icon
        this.own(on(this.grgAreaByRefSystemDrawIcon, 'click', lang.hitch(this,
          this._grgAreaByRefSystemDrawIconClicked)));

        //code for accessibility
        this.own(on(this.grgAreaByRefSystemDrawIcon, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._grgAreaByRefSystemDrawIconClicked();
            }
          })));

        //Handle click event of create GRG button
        this.own(on(this.grgAreaByRefSystemCreateGRGButton, 'click', lang.hitch(this,
          this._grgAreaByRefSystemCreateGRGButtonClicked)));

        //code for accessibility
        this.own(on(this.grgAreaByRefSystemCreateGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._grgAreaByRefSystemCreateGRGButtonClicked();
            }
          })));

        //Handle click event of clear GRG button
        this.own(on(this.grgAreaByRefSystemClearGRGButton, 'click',
          lang.hitch(this, function () {
            this._clearLayers(true);
          })));

        //code for accessibility
        this.own(on(this.grgAreaByRefSystemClearGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._clearLayers(true);
            }
          })));

        //Handle completion of extent drawing
        this.own(on(this.dt_AreaByRefSystem, 'draw-complete', lang.hitch(this, function (evt) {
          this._dt_AreaByRefSystemComplete(evt);
          focusUtils.focus(this.grgAreaByRefSystemGridSize.domNode);
        })));

        //Handle grid size dropdown change
        this.own(on(this.grgAreaByRefSystemGridSize, 'change', lang.hitch(this, function () {
          switch (this.grgAreaByRefSystemGridSize.getValue()) {
            case 'UTM':
              this.grgAreaByRefLabelFormat.value = 'Z';
              break;
            case '100000':
              this.grgAreaByRefLabelFormat.value = 'ZS';
              break;
            default:
              this.grgAreaByRefLabelFormat.value = 'ZSXY';
              break;
          }
        })));

        /**
        * GRG from Area by Non Standard Grid panel
          NOT IMPLEMENTED YET

            //Handle click event of back button
            this.own(on(this.grgAreaByNonStandardPanelBackButton, 'click',
              //lang.hitch(this, function () {
                this._resetOnBackToMainPage();
            })));

            //handle Grid Settings button
            if(!this.config.grg.lockSettings) {
              //handle Grid Settings button
              this.own(on(this.grgAreaByNonStandardSettingsButton, "click",
                //lang.hitch(this, function () {
                  this._updateSettingsPage(this._currentOpenPanel);
                  this._showPanel("settingsPage");
              })));
            } else {
              this.grgAreaByNonStandardSettingsButton.title = this.nls.lockSettings;
              //html.addClass(this.grgAreaByNonStandardSettingsButton, 'controlGroupHidden');
            }
        **/

        /**
         * GRG from Point by Size panel
         **/
        //Handle click event of back button
        this.own(on(this.grgPointBySizePanelBackButton, 'click', lang.hitch(this, function () {
          this.onClose();
          this._resetOnBackToMainPage();
        })));

        //code for accessibility
        this.own(on(this.grgPointBySizePanelBackButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this.onClose();
              this._resetOnBackToMainPage();
            }
          })));

        //handle Grid Settings button
        if (!this.config.grg.lockSettings) {
          //handle Grid Settings button
          this.own(on(this.grgPointBySizeSettingsButton, "click", lang.hitch(this, function () {
            this._updateSettingsPage(this._currentOpenPanel);
            this._showPanel("settingsPage");
          })));

          //code for accessibility
          this.own(on(this.grgPointBySizeSettingsButton, "keydown",
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this._updateSettingsPage(this._currentOpenPanel);
                this._showPanel("settingsPage");
              }
            })));

        } else {
          this.grgPointBySizeSettingsButton.title = this.nls.lockSettings;
          html.addClass(this.grgPointBySizeSettingsButton, 'settingsLocked');
          html.removeClass(this.grgPointBySizeSettingsButton, 'GRGDrafterSettingsIcon');
        }

        //Handle click event of create GRG point button
        this.own(on(this.grgPointBySizeCreateGRGButton, 'click', lang.hitch(this,
          this._grgPointBySizeCreateGRGButtonClicked)));

        //code for accessibility
        this.own(on(this.grgPointBySizeCreateGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._grgPointBySizeCreateGRGButtonClicked();
            }
          })));

        //Handle click event of clear GRG Point button
        this.own(on(this.grgPointBySizeClearGRGButton, 'click', lang.hitch(this, function () {
          this._clearLayers(true);
        })));

        //code for accessibility
        this.own(on(this.grgPointBySizeClearGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._clearLayers(true);
            }
          })));

        //Handle click event of Add ERG draw button
        this.own(on(this.grgPointBySizeCoordTool.dt, 'DrawComplete', lang.hitch(this, function () {
          this._dt_Complete();
          focusUtils.focus(this.grgPointBySizeCellHorizontal.domNode);
        })));
        this.own(on(this.grgPointByRefSystemCoordTool.dt, 'DrawComplete', lang.hitch(this, function () {
          this._dt_Complete();
          focusUtils.focus(this.grgPointByRefSystemGridSize.domNode);
        })));
        this.own(on(this.grgPointByTimeCoordTool.dt, 'DrawComplete', lang.hitch(this, function () {
          this._dt_Complete();
          focusUtils.focus(this.grgPointByTimeTime.domNode);
        })));

        /**
         * GRG from Point by Reference System panel
         **/
        //Handle click event of back button
        this.own(on(this.grgPointByRefSystemPanelBackButton, 'click',
          lang.hitch(this, function () {
            this.onClose();
            this._resetOnBackToMainPage();
          })));

        //code for accessibility
        this.own(on(this.grgPointByRefSystemPanelBackButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this.onClose();
              this._resetOnBackToMainPage();
            }
          })));

        //handle Grid Settings button
        if (!this.config.grg.lockSettings) {
          //handle Grid Settings button
          this.own(on(this.grgPointByRefSystemSettingsButton, "click",
            lang.hitch(this, function () {
              this._updateSettingsPage(this._currentOpenPanel);
              this._showPanel("settingsPage");
            })));

          //code for accessibility
          this.own(on(this.grgPointByRefSystemSettingsButton, "keydown",
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this._updateSettingsPage(this._currentOpenPanel);
                this._showPanel("settingsPage");
              }
            })));

        } else {
          this.grgPointByRefSystemSettingsButton.title = this.nls.lockSettings;
          html.addClass(this.grgPointByRefSystemSettingsButton, 'settingsLocked');
          html.removeClass(this.grgPointByRefSystemSettingsButton, 'GRGDrafterSettingsIcon');
        }

        //Handle click event of create GRG point button
        this.own(on(this.grgPointByRefSystemCreateGRGButton, 'click', lang.hitch(this,
          this._grgPointByRefSystemCreateGRGButtonClicked)));

        //code for accessibility
        this.own(on(this.grgPointByRefSystemCreateGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._grgPointByRefSystemCreateGRGButtonClicked();
            }
          })));

        //Handle click event of clear GRG Point button
        this.own(on(this.grgPointByRefSystemClearGRGButton, 'click',
          lang.hitch(this, function () {
            this._clearLayers(true);
          })));

        //code for accessibility
        this.own(on(this.grgPointByRefSystemClearGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._clearLayers(true);
            }
          })));

        //Handle grid size dropdown change
        this.own(on(this.grgPointByRefSystemGridSize, 'change', lang.hitch(this, function () {
          switch (this.grgPointByRefSystemGridSize.getValue()) {
            case 'UTM':
              this.grgPointByRefLabelFormat.value = 'Z';
              break;
            case '100000':
              this.grgPointByRefLabelFormat.value = 'ZS';
              break;
            default:
              this.grgPointByRefLabelFormat.value = 'ZSXY';
              break;
          }
        })));

        /**
         * GRG from Point by Time and Speed panel
         **/
        //Handle click event of back button
        this.own(on(this.grgPointByTimeBackButton, 'click', lang.hitch(this, function () {
          this.onClose();
          this._resetOnBackToMainPage();
        })));

        //code for accessibility
        this.own(on(this.grgPointByTimeBackButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this.onClose();
              this._resetOnBackToMainPage();
            }
          })));

        //handle Grid Settings button
        if (!this.config.grg.lockSettings) {
          //handle Grid Settings button
          this.own(on(this.grgPointByTimeSettingsButton, "click", lang.hitch(this, function () {
            this._updateSettingsPage(this._currentOpenPanel);
            this._showPanel("settingsPage");
          })));

          //code for accessibility
          this.own(on(this.grgPointByTimeSettingsButton, "keydown",
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this._updateSettingsPage(this._currentOpenPanel);
                this._showPanel("settingsPage");
              }
            })));

        } else {
          this.grgPointByTimeSettingsButton.title = this.nls.lockSettings;
          html.addClass(this.grgPointByTimeSettingsButton, 'settingsLocked');
          html.removeClass(this.grgPointByTimeSettingsButton, 'GRGDrafterSettingsIcon');
        }

        //Handle click event of create GRG point button
        this.own(on(this.grgPointByTimeCreateGRGButton, 'click', lang.hitch(this,
          this._grgPointByTimeCreateGRGButtonClicked)));

        //code for accessibility
        this.own(on(this.grgPointByTimeCreateGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._grgPointByTimeCreateGRGButtonClicked();
            }
          })));

        //Handle click event of clear GRG Point button
        this.own(on(this.grgPointByTimeClearGRGButton, 'click', lang.hitch(this, function () {
          this._clearLayers(true);
        })));

        //code for accessibility
        this.own(on(this.grgPointByTimeClearGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._clearLayers(true);
            }
          })));

        //Handle click event of number of row / columns checkbox
        this.own(on(this.setNumberRowsColumnsTime, 'click', lang.hitch(this,
          this._setNumberRowsColumnsTimeCheckBoxChanged)));

        //code for accessibility
        this.own(on(this.setNumberRowsColumnsTime, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._setNumberRowsColumnsTimeCheckBoxChanged();
            }
          })));

        /**
         * Settings panel
         **/
        //Handle click event of Grid settings back button
        this.own(on(this.gridSettingsPanelBackButton, "click", lang.hitch(this, function () {
          this._gridSettingsInstance.onClose();
          this._showPanel(this._lastOpenPanel);
        })));

        //code for accessibility
        this.own(on(this.gridSettingsPanelBackButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._gridSettingsInstance.onClose();
              this._showPanel(this._lastOpenPanel);
            }
          })));

        /**
         * Publish panel
         **/
        //Handle click event of panel back button
        this.own(on(this.publishPanelBackButton, "click", lang.hitch(this,
          this._publishPanelBackButtonClicked)));

        //code for accessibility
        this.own(on(this.publishPanelBackButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._publishPanelBackButtonClicked();
            }
          })));

        //Handle click event of publish GRG to portal button
        this.own(on(this.grgAreaBySizePublishGRGButton, 'click', lang.hitch(this,
          this._grgAreaBySizePublishGRGButtonClicked)));

        //code for accessibility
        this.own(on(this.grgAreaBySizePublishGRGButton, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._grgAreaBySizePublishGRGButtonClicked();
            }
          })));

        //Handle click event of show labels toggle button
        this.own(on(this.settingsShowLabelsToggle, 'click', lang.hitch(this, this._settingsShowLabelsToggleClicked)));

        //code for accessibility
        this.own(on(this.settingsShowLabelsToggle, "keydown",
          lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._settingsShowLabelsToggleClicked();
            }
          })));

        /**
         * Toolbar events
         **/
        //Handle graphic moved
        this.own(on(this.editToolbar, "graphic-move-stop", lang.hitch(this, function (evt) {
          this.centerPoint = evt.graphic.geometry.getCentroid();
        })));

        //Handle graphic rotated
        this.own(on(this.editToolbar, "rotate-stop", lang.hitch(this, function (evt) {
          this.angle = this.angle + parseFloat(evt.info.angle.toFixed(1));
          this.grgAreaBySizeRotation.setValue(this.angle);
        })));

        //Handle graphic vertices changed
        this.own(on(this.editToolbar, "vertex-move-stop", lang.hitch(this, function (evt) {
          this.centerPoint = evt.graphic.geometry.getCentroid();
          this._calculateCellWidthAndHeight(gridGeomUtils.extentToPolygon(
            this._graphicsLayerGRGExtent.graphics[0].geometry.getExtent()));
        })));

        //Handle graphic scaled
        this.own(on(this.editToolbar, "scale-stop", lang.hitch(this, function (evt) {
          this.centerPoint = evt.graphic.geometry.getCentroid();
          this._calculateCellWidthAndHeight(evt.graphic.geometry);
        })));

        // Checkbox listener
        this.own(on(this.publishNewLayer, 'change', lang.hitch(this, this._onCheckboxClicked)));

        topic.subscribe("moveMap", lang.hitch(this, function () {
          setTimeout(lang.hitch(this, function () {
            this._moveMap();
          }), 1000);
        }));
      },

      /**
       * Populates the drop down list of operational layers
       * from the webmap
       */
      _populateSelectList: function (selectNode, layerList, selectedOptionName, onlyPolygon) {
        // If true, only get the polygon feature layers
        var newList = [];
        if (onlyPolygon) {
          newList = array.filter(layerList, function (layer) {
            return layer.geometryType === "esriGeometryPolygon";
          }, this);
        }
        // re-init layerList
        layerList = (newList.length > 0) ? newList : layerList;

        array.forEach(layerList, lang.hitch(this, function (layer) {
          if (layer.type === "Feature Layer" && layer.url !== null) {
            selectNode.addOption({
              value: dojoJSON.parse(layer._json).name,
              label: utils.sanitizeHTML(layer.name),
              selected: false
            });
          }
        }));

        if (selectedOptionName !== '') {
          selectNode.setValue(selectedOptionName);
        }
      },

      /**
       * This gets all the operational layers and places it in a custom data object.
       */
      _getAllMapLayers: function () {
        var layerList = [];
        var layerStructure = LayerStructure.getInstance();
        //get all layers.
        layerStructure.traversal(function (layerNode) {
          //check to see if type exist and if it's not any tiles
          if (typeof (layerNode._layerInfo.layerObject.type) !== 'undefined') {
            if ((layerNode._layerInfo.layerObject.type).indexOf("tile") === -1) {
              layerList.push(layerNode._layerInfo.layerObject);
            }
          }
        });
        return layerList;
      },

      /**
       * If checkbox is checked, clear textbox and allow user to
       * input a new layer name.
       */
      _onCheckboxClicked: function () {
        if (this.publishNewLayer.checked) {
          domClass.add(this.featureLayerList.domNode, 'controlGroupHidden');
          domClass.remove(this.addGRGNameArea.domNode, 'controlGroupHidden');
          this.addGRGNameArea.reset();
          this.addGRGNameArea.focus();
        } else {
          domClass.add(this.addGRGNameArea.domNode, 'controlGroupHidden');
          domClass.remove(this.featureLayerList.domNode, 'controlGroupHidden');
        }
        this._addLayerToMap = this.publishNewLayer.checked;
      },

      /**
       * Function checks for a valid GRG layer name
       * @param {string} layerName
       */
      _isValidGRGLayerName: function (layerName) {
        var isValid = false;
        var restrictedList = this.restrictedCharlist; // + " "; - no need to search for spaces since it's valid
        var restrictedChars = this._findRestrictedChars(layerName, restrictedList);
        if (restrictedChars && restrictedChars.length > 0) {
          isValid = false;
        } else if (!this._isLayerNameValid(layerName)) {
          isValid = false;
        } else {
          if (layerName && layerName.length > 0) {
            isValid = true;
          }
        }
        return isValid;
      },

      /**
       * Checks a string against a list of
       * invalid characters
       * @param {string} string
       * @param {list} restrictedList
       */
      _findRestrictedChars: function (string, restrictedList) {
        var foundChars = "",
          i;
        if (string && restrictedList) {
          for (i = 0; i < restrictedList.length; i++) {
            // get a restricted character
            var rc = restrictedList.charAt(i);
            // search field for it...
            if (string.indexOf(rc) !== -1) {
              if (rc === " ") {
                rc = "spaces";
              }
              if (foundChars.length === 0) {
                foundChars = rc;
              } else {
                foundChars += " " + rc;
              }
            }
          }
        }
        return foundChars;
      },

      /**
       * Checks for invalid characters in a string
       * Source: https://stackoverflow.com/questions/11100821/javascript-regex-for-validating-filenames
       * @param {string} string
       */
      _isLayerNameValid: function (fname) {
        var rg1 = /^[^\\/:\*\?"<>\|()]+$/; // forbidden characters \ / : * ? " < > |
        var rg2 = /^\./; // cannot start with dot (.)
        var rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
        return rg1.test(fname) && !rg2.test(fname) && !rg3.test(fname);
        // var regex = /^[0-9a-zA-Z ... ]+$/;
        // return string && !!regex.test(string);
      },

      /**
       * Update the settings panel depending on which other panel the
       * settings are entered from
       * @memberOf widgets/GRG/Widget
       **/
      _updateSettingsPage: function (panelName) {
        //reset the grid settings to show all
        html.removeClass(this._gridSettingsInstance.gridShapeContainer,
          'controlGroupHidden');
        html.removeClass(this._gridSettingsInstance.gridUnitsContainer,
          'controlGroupHidden');
        html.removeClass(this._gridSettingsInstance.labelStyleContainer,
          'controlGroupHidden');
        html.removeClass(this._gridSettingsInstance.labelStartPositionContainer,
          'controlGroupHidden');
        html.removeClass(this._gridSettingsInstance.labelDirectionContainer,
          'controlGroupHidden');

        //hide the grid origin and reference system settings (these are not common to all settings)
        html.addClass(this._gridSettingsInstance.gridOriginContainer,
          'controlGroupHidden');
        html.addClass(this._gridSettingsInstance.gridRefSystemContainer,
          'controlGroupHidden');
        html.addClass(this._gridSettingsInstance.labelStyleWithRefSysContainer,
          'controlGroupHidden');


        switch (panelName) {
          case "grgAreaBySize":
            break;
          case "grgAreaFromNonStandard":
            break;
          case "grgPointBySize":
            //when creating point by size the grid orign can be used so remove the hidden class
            html.removeClass(this._gridSettingsInstance.gridOriginContainer,
              'controlGroupHidden');
            break;
          case "grgAreaByRefSystem":
          case "grgPointByRefSystem":
            //hide elements that are not relevant to creating by reference system
            html.addClass(this._gridSettingsInstance.gridShapeContainer,
              'controlGroupHidden');
            html.addClass(this._gridSettingsInstance.gridUnitsContainer,
              'controlGroupHidden');
            html.addClass(this._gridSettingsInstance.labelStyleContainer,
              'controlGroupHidden');
            html.addClass(this._gridSettingsInstance.labelDirectionContainer,
              'controlGroupHidden');
            //when creating by reference system give the user a
            //choice of which one by removing the hidden class
            html.removeClass(this._gridSettingsInstance.gridRefSystemContainer,
              'controlGroupHidden');
            html.removeClass(this._gridSettingsInstance.labelStyleWithRefSysContainer,
              'controlGroupHidden');
            break;
          case "grgPointByTime":
            break;
        }
      },

      /**
       * Get panel node from panel name
       * @param {string} panel name
       * @memberOf widgets/GRG/Widget
       **/
      _getNodeByName: function (panelName) {
        var node;
        switch (panelName) {
          case "mainPage":
            node = this.mainPageNode;
            break;
          case "grgAreaBySize":
            node = this.grgAreaBySizePageNode;
            break;
          case "grgAreaByRefSystem":
            node = this.grgAreaByRefSystemPageNode;
            break;
          case "grgAreaFromNonStandard":
            node = this.grgAreaFromNonStandardPageNode;
            break;
          case "grgPointBySize":
            node = this.grgPointBySizePageNode;
            break;
          case "grgPointByRefSystem":
            node = this.grgPointByRefSystemPageNode;
            break;
          case "grgPointByTime":
            node = this.grgPointByTimePageNode;
            // must ensure grid origin is center
            this._gridSettingsInstance.gridOrigin.set('value', 'center');
            this._gridOrigin = 'center';
            break;
          case "settingsPage":
            node = this.settingsPageNode;
            break;
          case "publishPage":
            node = this.publishPageNode;
            break;
        }
        return node;
      },

      /**
       * This function resets everything on navigating back to main page
       * @memberOf widgets/GRG/Widget
       */
      _resetOnBackToMainPage: function () {
        //reset the tools
        this._showPanel("mainPage");
        this._reset();
        focusUtils.focus(this.newGRGAreaButton);
      },

      _reset: function () {
        this._clearLayers(true);

        //ensure all toolbars are deactivated
        this.dt_AreaBySize.deactivate();
        // this.dt_PointBySize.deactivate();
        // this.dt_PointByRefSystem.deactivate();
        this.dt_AreaByRefSystem.deactivate();

        //enable map navigation if disabled due to a tool being in use
        this.map.enableMapNavigation();

        //remove any active classes from the tool icons
        dojo.removeClass(this.grgAreaBySizeDrawPolygonIcon, 'jimu-polygon-active');
        dojo.removeClass(this.grgAreaBySizeDrawExtentIcon, 'jimu-extent-active');
        // dojo.removeClass(this.grgPointBySizeAddPointBtn, 'jimu-edit-active');
        // dojo.removeClass(this.grgPointByRefSystemAddPointBtn, 'jimu-edit-active');

        //reset the two dropdown menus on the main page
        html.addClass(this.fromAreaContainer, 'controlGroupHidden');
        html.addClass(this.newGRGAreaButton, 'GRGNewRightButton');
        html.removeClass(this.newGRGAreaButton, 'GRGNewDownButton');
        html.addClass(this.fromPointContainer, 'controlGroupHidden');
        html.addClass(this.newGRGPointButton, 'GRGNewRightButton');
        html.removeClass(this.newGRGPointButton, 'GRGNewDownButton');
      },

      _clearLayers: function (includeExtentLayer) {
        this.GRGArea.clear();
        //refresh GRG layer to make sure any labels are removed
        this.GRGArea.refresh();
        //ensure the edit toolbar is deactived
        this.editToolbar.deactivate();
        //clear the coordinate layers
        this.grgPointBySizeCoordTool.clear();
        this.grgPointByRefSystemCoordTool.clear();
        this.grgPointByTimeCoordTool.clear();

        //sometimes we only want to clear the GRGArea layer and not the graphic layer
        if (includeExtentLayer) {
          this._graphicsLayerGRGExtent.clear();
          // this.dt_PointBySize.removeStartGraphic(this._graphicsLayerGRGExtent);
          // this.dt_PointByRefSystem.removeStartGraphic(this._graphicsLayerGRGExtent);
          //reset the angle
          this.angle = 0;
          this.grgAreaBySizeRotation.setValue(this.angle);
          this.grgAreaBySizeRotation.set('disabled', true);
          this.grgAreaBySizeCellHeight.set('disabled', true);
          this.grgAreaBySizeCellWidth.set('disabled', true);
        }
      },

      /**
       * Creates grid settings
       * @memberOf widgets/GRG/Widget
       **/
      _createGridSettings: function () {
        //Create GridSettings Instance
        this._gridSettingsInstance = new GridSettings({
          nls: this.nls,
          config: this.config,
          appConfig: this.appConfig
        }, domConstruct.create("div", {}, this.gridSettingsNode));

        //add a listener for a change in settings
        this.own(this._gridSettingsInstance.on("gridSettingsChanged",
          lang.hitch(this, function (updatedSettings) {
            this._cellShape = updatedSettings.cellShape;
            this._labelStartPosition = updatedSettings.labelStartPosition;
            this._cellUnits = updatedSettings.cellUnits;
            this._labelType = updatedSettings.labelType;
            this._labelTypeWithRefSys = updatedSettings.labelTypeWithRefSys;
            this._labelDirection = updatedSettings.labelDirection;
            this._gridOrigin = updatedSettings.gridOrigin;
            this._referenceSystem = updatedSettings.referenceSystem;

            //disable or enable the cell height input depending on the cell shape
            //(hexagon does not need a height input)
            if (this._cellShape === "default") {
              this.grgAreaBySizeCellHeight.setValue(this.grgAreaBySizeCellWidth.value);
              this.grgPointBySizeCellHeight.set('disabled', false);
              this.grgPointBySizeCellHeight.setValue(this.grgPointBySizeCellWidth.value);
            } else {
              this.grgAreaBySizeCellHeight.set('disabled', true);
              this.grgAreaBySizeCellHeight.setValue(0);
              this.grgPointBySizeCellHeight.set('disabled', true);
              this.grgPointBySizeCellHeight.setValue(0);
            }

            if (this._labelTypeWithRefSys !== 'gridReferenceSystem') {
              html.addClass(this.grgAreaByRefSystemLabelFormat, 'controlGroupHidden');
              html.addClass(this.grgPointByRefSystemLabelFormat, 'controlGroupHidden');
            } else {
              html.removeClass(this.grgAreaByRefSystemLabelFormat, 'controlGroupHidden');
              html.removeClass(this.grgPointByRefSystemLabelFormat, 'controlGroupHidden');
            }

            //set grid colours
            var fillColor = new Color(updatedSettings.gridFillColor);
            fillColor.a = 1 - updatedSettings.gridFillTransparency;

            var outlineColor = new Color(updatedSettings.gridOutlineColor);
            outlineColor.a = 1 - updatedSettings.gridOutlineTransparency;

            this._GRGAreaFillSymbol = {
              type: 'esriSFS',
              style: 'esriSFSSolid',
              color: fillColor,
              outline: {
                color: outlineColor,
                width: 2,
                type: 'esriSLS',
                style: 'esriSLSSolid'
              }
            };

            // create a renderer for the grg layer to override default symbology
            var gridSymbol = new SimpleFillSymbol(this._GRGAreaFillSymbol);
            var gridRenderer = new SimpleRenderer(gridSymbol);
            this.GRGArea.setRenderer(gridRenderer);

            //set label properties
            var textColor = new Color(updatedSettings.fontSettings.textColor);
            var labelTrans = (1 - updatedSettings.fontSettings.labelTransparency) * 255;

            var haloSize = 0;
            if (updatedSettings.fontSettings.haloOn) {
              haloSize = parseInt(updatedSettings.fontSettings.haloSize, 10);
            }

            var haloColor = new Color(updatedSettings.fontSettings.haloColor);

            //override the text symbol with the new settings
            this._cellTextSymbol = {
              "type": "esriTS",
              "color": [
                textColor.r,
                textColor.g,
                textColor.b,
                labelTrans
              ],
              "haloSize": haloSize,
              "haloColor": [
                haloColor.r,
                haloColor.g,
                haloColor.b,
                labelTrans
              ],
              "horizontalAlignment": "center",
              "font": {
                "size": parseInt(updatedSettings.fontSettings.fontSize, 10),
                "style": updatedSettings.fontSettings.font.italic ? "italic" : "normal",
                "weight": updatedSettings.fontSettings.font.bold ? "bold" : "normal",
                "family": updatedSettings.fontSettings.font.fontFamily,
                "decoration": updatedSettings.fontSettings.font.underline ? "underline" : "none"
              }
            };

            // create a text symbol to define the style of labels
            var json = {
              "labelExpressionInfo": {
                "value": "{grid}"
              }
            };
            var labelClass = new LabelClass(json);
            labelClass.symbol = new TextSymbol(this._cellTextSymbol);
            this.GRGArea.setLabelingInfo([labelClass]);

            //refresh the layer to apply the settings
            this.GRGArea.refresh();
          })));
        this._gridSettingsInstance.startup();

        this.own(on(this._gridSettingsInstance.tab, "tabChanged", lang.hitch(this, function () {
          setTimeout(lang.hitch(this, function () {
            this._updateLastFocusNode();
          }), 200);
        })));
      },

      /**
       * Displays selected panel
       * @param {string} panel name
       * @memberOf widgets/GRG/Widget
       **/
      _showPanel: function (currentPanel) {
        var prevNode, currentNode;
        //check if previous panel exist and hide it
        if (this._currentOpenPanel) {
          prevNode = this._getNodeByName(this._currentOpenPanel);
          domClass.add(prevNode, "GRGDrafterHidden");
        }
        //get current panel to be displayed and show it
        currentNode = this._getNodeByName(currentPanel);
        domClass.remove(currentNode, "GRGDrafterHidden");
        //set the current panel and previous panel
        this._lastOpenPanel = this._currentOpenPanel;
        this._currentOpenPanel = currentPanel;
        this._supportAccessibility();
      },

      /**
       * Handle the draw polygon icon being clicked on the GRG Area by Size Panel
       * @memberOf widgets/GRG/Widget
       **/
      _grgAreaBySizeDrawPolygonIconClicked: function () {
        this._clearLayers(true);
        // deactive the other tool if active
        if (domClass.contains(this.grgAreaBySizeDrawExtentIcon, 'jimu-extent-active')) {
          //this tool is already selected so deactivate
          this.dt_AreaBySize.deactivate();
          domClass.toggle(this.grgAreaBySizeDrawExtentIcon, 'jimu-extent-active');
        }
        if (domClass.contains(this.grgAreaBySizeDrawPolygonIcon, 'jimu-polygon-active')) {
          //already selected so deactivate draw tool
          this.dt_AreaBySize.deactivate();
          this.map.enableMapNavigation();
        } else {
          this.map.disableMapNavigation();
          this.dt_AreaBySize.activate('polygon');
          //depending on what draw option is used we want different edit functionality
          this.own(on(this._graphicsLayerGRGExtent, "click", lang.hitch(this, function (evt) {
            this.editToolbar._defaultOptions.uniformScaling = true;
            this.editToolbar.activate(Edit.MOVE | Edit.EDIT_VERTICES, evt.graphic);
          })));

          //code for accessibility
          this.own(on(this._graphicsLayerGRGExtent, "keydown",
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this.editToolbar._defaultOptions.uniformScaling = true;
                this.editToolbar.activate(Edit.MOVE | Edit.EDIT_VERTICES, evt.graphic);
              }
            })));
        }
        domClass.toggle(this.grgAreaBySizeDrawPolygonIcon, 'jimu-polygon-active');
      },

      /**
       * Handle the draw extent icon being clicked on the GRG Area by Size Panel
       * @memberOf widgets/GRG/Widget
       **/
      _grgAreaBySizeDrawExtentIconClicked: function () {
        this._clearLayers(true);
        // deactive the other tool if active
        if (domClass.contains(this.grgAreaBySizeDrawPolygonIcon, 'jimu-polygon-active')) {
          //this tool is already selected so deactivate
          this.dt_AreaBySize.deactivate();
          domClass.toggle(this.grgAreaBySizeDrawPolygonIcon, 'jimu-polygon-active');
        }
        if (domClass.contains(this.grgAreaBySizeDrawExtentIcon, 'jimu-extent-active')) {
          //already selected so deactivate draw tool
          this.dt_AreaBySize.deactivate();
          this.map.enableMapNavigation();
        } else {
          this.map.disableMapNavigation();
          this.dt_AreaBySize.activate('extent');
          //depending on what draw option is used we want different edit functionality
          this.own(on(this._graphicsLayerGRGExtent, "click", lang.hitch(this, function (evt) {
            this.editToolbar._defaultOptions.uniformScaling = true;
            this.editToolbar.activate(Edit.MOVE | Edit.ROTATE | Edit.SCALE, evt.graphic);
          })));

          //code for accessibility
          this.own(on(this._graphicsLayerGRGExtent, "keydown",
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this.editToolbar._defaultOptions.uniformScaling = true;
                this.editToolbar.activate(Edit.MOVE | Edit.ROTATE | Edit.SCALE, evt.graphic);
              }
            })));
        }
        domClass.toggle(this.grgAreaBySizeDrawExtentIcon, 'jimu-extent-active');
      },

      /**
       * Handle the draw point icon being clicked on the GRG Point by Size Panel
       * @memberOf widgets/GRG/Widget
       **/
      _grgPointBySizeDrawButtonClicked: function () {
        if (domClass.contains(this.grgPointBySizeAddPointBtn, 'jimu-edit-active')) {
          this.map.enableMapNavigation();
        } else {
          this._clearLayers(true);
          this.grgPointBySizeCoordTool.manualInput = false;
          this.map.disableMapNavigation();
        }
        domClass.toggle(this.grgPointBySizeAddPointBtn, 'jimu-edit-active');
      },

      /**
       * Handle the draw extent icon being clicked on the GRG Area by Reference System
       * @memberOf widgets/GRG/Widget
       **/
      _grgAreaByRefSystemDrawIconClicked: function () {
        if (domClass.contains(this.grgAreaByRefSystemDrawIcon, 'jimu-extent-active')) {
          //already selected so deactivate draw tool
          this.dt_AreaByRefSystem.deactivate();
          this.map.enableMapNavigation();
        } else {
          this._graphicsLayerGRGExtent.clear();
          this.grgPointBySizeCoordTool.manualInput = false;
          this.map.disableMapNavigation();
          this.dt_AreaByRefSystem.activate('extent');
          this.editToolbar.deactivate();
          //depending on what draw option is used we want different edit functionality
          this.own(on(this._graphicsLayerGRGExtent, "click", lang.hitch(this, function (evt) {
            this.editToolbar._defaultOptions.uniformScaling = false;
            this.editToolbar.activate(Edit.MOVE | Edit.SCALE, evt.graphic);
          })));

          //code for accessibility
          this.own(on(this._graphicsLayerGRGExtent, "keydown",
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this.editToolbar._defaultOptions.uniformScaling = false;
                this.editToolbar.activate(Edit.MOVE | Edit.SCALE, evt.graphic);
              }
            })));
        }
        domClass.toggle(this.grgAreaByRefSystemDrawIcon, 'jimu-extent-active');
      },

      /**
       * Handle the completion of the draw tool on the GRG Area by Size
       * @memberOf widgets/GRG/Widget
       **/
      _dt_AreaBySizeComplete: function (evt) {
        var graphic;
        this.map.enableMapNavigation();
        this.dt_AreaBySize.deactivate();
        if (evt.geometry.type === 'extent') {
          evt.geometry = gridGeomUtils.extentToPolygon(evt.geometry);
          graphic = new Graphic(evt.geometry, this._extentSym);
          this.grgAreaBySizeRotation.set('disabled', false);
          domClass.toggle(this.grgAreaBySizeDrawExtentIcon, 'jimu-extent-active');
        } else {
          graphic = new Graphic(evt.geometry, this._extentSym);
          evt.geometry = gridGeomUtils.extentToPolygon(evt.geometry.getExtent());
          domClass.toggle(this.grgAreaBySizeDrawPolygonIcon, 'jimu-polygon-active');
        }
        if (this._cellShape === "default") {
          this.grgAreaBySizeCellHeight.set('disabled', false);
        }
        this.grgAreaBySizeCellWidth.set('disabled', false);
        focusUtils.focus(this.grgAreaBySizeCellWidth.domNode);
        this._graphicsLayerGRGExtent.add(graphic);
        this.centerPoint = evt.geometry.getCentroid();
        this._calculateCellWidthAndHeight(evt.geometry);
      },

      /**
       * Calulate the width and height from the drawn feature
       * @memberOf widgets/GRG/Widget
       **/
      _calculateCellWidthAndHeight: function (geometry) {
        //if the input id geographics project the geometry to WMAS
        if (geometry.spatialReference.wkid === 4326) {
          // if the geographic point can be projected the map spatial reference do so
          geometry = WebMercatorUtils.geographicToWebMercator(geometry);
        }

        //calculate the geodesic width and height of the required grid cells
        var calculatedCellWidth = ((GeometryEngine.geodesicLength(new Polyline({
          paths: [
            [
              [geometry.getPoint(0, 0).x, geometry.getPoint(0, 0).y],
              [geometry.getPoint(0, 1).x, geometry.getPoint(0, 1).y]
            ]
          ],
          spatialReference: geometry.spatialReference
        }), this._cellUnits)) / this.cellHorizontal.value);

        var calculatedCellHeight = ((GeometryEngine.geodesicLength(new Polyline({
          paths: [
            [
              [geometry.getPoint(0, 0).x, geometry.getPoint(0, 0).y],
              [geometry.getPoint(0, 3).x, geometry.getPoint(0, 3).y]
            ]
          ],
          spatialReference: geometry.spatialReference
        }), this._cellUnits)) / this.cellVertical.value);

        //convert the width and height into meters
        var cellWidthMeters = this.util.convertToMeters(calculatedCellWidth, this._cellUnits);
        var cellHeightMeters = this.util.convertToMeters(calculatedCellHeight, this._cellUnits);

        //if the width or height of a grid cell is over 20000m we need to use a planar grid
        //so recalculate the width and height using a planar measurement
        if ((cellWidthMeters < 20000) && ((cellHeightMeters < 20000 &&
            this._cellShape !== "hexagon") || this._cellShape === "hexagon")) {
          this.geodesicGrid = true;
          this.grgAreaBySizeCellWidth.setValue(calculatedCellWidth);
          if (this._cellShape === "default") {
            this.grgAreaBySizeCellHeight.setValue(calculatedCellHeight);
          } else {
            this.grgAreaBySizeCellHeight.setValue(0);
          }
        } else {
          this.geodesicGrid = false;
          this.grgAreaBySizeCellWidth.setValue(((GeometryEngine.distance(geometry.getPoint(0, 0),
            geometry.getPoint(0, 1), this._cellUnits)) / this.cellHorizontal.value));
          if (this._cellShape === "default") {
            this.grgAreaBySizeCellHeight.setValue(((GeometryEngine.distance(geometry.getPoint(0, 0),
              geometry.getPoint(0, 3), this._cellUnits)) / this.cellVertical.value));
          } else {
            this.grgAreaBySizeCellHeight.setValue(0);
          }
        }
      },

      /**
       * Handle the completion of the draw spill location
       **/
      _dt_Complete: function () {
        this.grgPointBySizeCoordTool.deactivateDrawTool();
        this.grgPointByRefSystemCoordTool.deactivateDrawTool();
        this.grgPointByTimeCoordTool.deactivateDrawTool();
        this.map.enableMapNavigation();
      },

      /**
       * Handle the completion of the draw extent tool on the GRG Area by Reference System
       * @memberOf widgets/GRG/Widget
       **/
      _dt_AreaByRefSystemComplete: function (evt) {
        // debugger;
        domClass.remove(this.grgAreaByRefSystemDrawIcon, 'jimu-extent-active');
        var graphic = new Graphic(gridGeomUtils.extentToPolygon(evt.geometry), this._extentSym);
        this._graphicsLayerGRGExtent.add(graphic);
        this.dt_AreaByRefSystem.deactivate();
        this.map.enableMapNavigation();
      },

      /**
       * Handle the format coordinate input being applied
       * Point by Size Panel
       **/
      _grgPointBySizeCoordFormatPopupApplyButtonClicked: function () {
        var fs = this.grgPointBySizeCoordinateFormat.content.formats[
          this.grgPointBySizeCoordinateFormat.content.ct];
        var cfs = fs.defaultFormat;
        var fv = this.grgPointBySizeCoordinateFormat.content.frmtSelect.get('value');
        if (fs.useCustom) {
          cfs = fs.customFormat;
        }
        this.grgPointBySizeCoordTool.inputCoordinate.set(
          'formatPrefix',
          this.grgPointBySizeCoordinateFormat.content.addSignChkBox.checked
        );
        this.grgPointBySizeCoordTool.inputCoordinate.set('formatString', cfs);
        this.grgPointBySizeCoordTool.inputCoordinate.set('formatType', fv);
        this._grgPointBySizeSetCoordLabel(fv);
        dijitPopup.close(this.grgPointBySizeCoordinateFormat);
      },

      /**
       * Handle the toggle for set number of row / columns changing
       **/
      _setNumberRowsColumnsCheckBoxChanged: function () {
        if (this.setNumberRowsColumns.checked) {
          this.grgAreaBySizeCellWidth.set('disabled', true);
          this.grgAreaBySizeCellHeight.set('disabled', true);
          this.cellHorizontal.set('disabled', false);
          this.cellVertical.set('disabled', false);
        } else {
          this.cellHorizontal.set('disabled', true);
          this.cellVertical.set('disabled', true);
        }
        this._clearLayers(true);
      },

      /**
       * Handle the toggle for set number of row / columns changing
       **/
      _setNumberRowsColumnsTimeCheckBoxChanged: function () {
        if (this.setNumberRowsColumnsTime.checked) {
          this.grgPointByTimeCellWidth.set('disabled', true);
          this.grgPointByTimeCellHeight.set('disabled', true);
          this.grgPointByTimeCellHorizontal.set('disabled', false);
          this.grgPointByTimeCellVertical.set('disabled', false);
        } else {
          this.grgPointByTimeCellHorizontal.set('disabled', true);
          this.grgPointByTimeCellVertical.set('disabled', true);
          this.grgPointByTimeCellWidth.set('disabled', false);
          this.grgPointByTimeCellHeight.set('disabled', false);
        }
        this._clearLayers(true);
      },

      /**
       * Handle create GRG button being clicked on the GRG Area by Size Panel
       **/
      _grgAreaBySizeCreateGRGButtonClicked: function () {
        //check form inputs for validity
        if (this._graphicsLayerGRGExtent.graphics[0] && this.grgAreaBySizeCellWidth.isValid() &&
          this.grgAreaBySizeCellHeight.isValid() && this.grgAreaBySizeRotation.isValid()) {
          this._clearLayers(false);

          var geom = (this.angle === 0) ?
            gridGeomUtils.extentToPolygon(
              this._graphicsLayerGRGExtent.graphics[0].geometry.getExtent()) :
            this._graphicsLayerGRGExtent.graphics[0].geometry;

          //if the input is geographics project the geometry to WMAS
          if (geom.spatialReference.wkid === 4326) {
            // if the geographic point can be projected the map spatial reference do so
            geom = WebMercatorUtils.geographicToWebMercator(geom);
          }

          var GRGAreaWidth, GRGAreaHeight;
          //work out width and height of AOI, method depends on if the grid is to be geodesic
          if (this.geodesicGrid) {
            GRGAreaWidth = GeometryEngine.geodesicLength(new Polyline({
              paths: [
                [
                  [geom.getPoint(0, 0).x, geom.getPoint(0, 0).y],
                  [geom.getPoint(0, 1).x, geom.getPoint(0, 1).y]
                ]
              ],
              spatialReference: geom.spatialReference
            }), 'meters');
            GRGAreaHeight = GeometryEngine.geodesicLength(new Polyline({
              paths: [
                [
                  [geom.getPoint(0, 0).x, geom.getPoint(0, 0).y],
                  [geom.getPoint(0, 3).x, geom.getPoint(0, 3).y]
                ]
              ],
              spatialReference: geom.spatialReference
            }), 'meters');
          } else {
            GRGAreaWidth = GeometryEngine.distance(geom.getPoint(0, 0),
              geom.getPoint(0, 1), 'meters');
            GRGAreaHeight = GeometryEngine.distance(geom.getPoint(0, 0),
              geom.getPoint(0, 3), 'meters');
          }

          var cellWidth = this.util.convertToMeters(this.grgAreaBySizeCellWidth.value, this._cellUnits);
          var cellHeight = this.util.convertToMeters(this.grgAreaBySizeCellHeight.value, this._cellUnits);

          //work out how many cells are needed horizontally & Vertically
          //to cover the whole canvas area
          var numCellsHorizontal = Math.round(GRGAreaWidth / cellWidth);

          var numCellsVertical;
          numCellsVertical = this._cellShape === "default" ?
            Math.round(GRGAreaHeight / cellHeight) :
            Math.round(GRGAreaHeight / (cellWidth) / Math.cos(30 * Math.PI / 180)) + 1;

          if (drawGRG.checkGridSize(numCellsHorizontal, numCellsVertical)) {
            var features = drawGRG.createGRG(
              numCellsHorizontal,
              numCellsVertical,
              this.centerPoint,
              cellWidth,
              cellHeight,
              this.angle,
              this._labelStartPosition,
              this._labelType,
              this._labelDirection,
              this._cellShape,
              'center',
              this.geodesicGrid,
              this.map);
            //apply the edits to the feature layer
            this.GRGArea.applyEdits(features, null, null);
            this.map.setExtent(
              this._graphicsLayerGRGExtent.graphics[0].geometry.getExtent().expand(2), false);
            this._graphicsLayerGRGExtent.clear();
            this._showPanel("publishPage");
          } else {
            new Message({
              message: this.nls.tooManyCellsErrorMessage
            });
          }
        }
      },

      /**
       * Handle create GRG button being clicked on the GRG Point by Size Panel
       **/
      _grgPointBySizeCreateGRGButtonClicked: function () {
        //check form inputs for validity
        if (this.grgPointBySizeCellWidth.isValid() && this.grgPointBySizeCellHeight.isValid() &&
          this.gridAnglePoint.isValid()) {

          //get center point of AOI
          var centerPoint = WebMercatorUtils.geographicToWebMercator(
            this.grgPointBySizeCoordTool.getMapCoordinateDD());

          var cellWidth = this.util.convertToMeters(this.grgPointBySizeCellWidth.value, this._cellUnits);
          var cellHeight = this.util.convertToMeters(this.grgPointBySizeCellHeight.value, this._cellUnits);

          // if the width or height of a grid cell is over 20000m we need to use a planar grid
          if ((cellWidth < 20000) &&
            ((cellHeight < 20000 && this._cellShape !== "hexagon") ||
              this._cellShape === "hexagon")) {
            this.geodesicGrid = true;
          } else {
            this.geodesicGrid = false;
          }

          if (drawGRG.checkGridSize(this.grgPointBySizeCellHorizontal.value,
              this.grgPointBySizeCellVertical.value)) {
            var features = drawGRG.createGRG(
              this.grgPointBySizeCellHorizontal.value,
              this.grgPointBySizeCellVertical.value,
              centerPoint,
              cellWidth,
              cellHeight,
              this.gridAnglePoint.value,
              this._labelStartPosition,
              this._labelType,
              this._labelDirection,
              this._cellShape,
              this._gridOrigin,
              this.geodesicGrid,
              this.map);
            //apply the edits to the feature layer
            this.GRGArea.applyEdits(features, null, null);
            var geomArray = [];
            for (var i = 0; i < features.length; i++) {
              geomArray.push(features[i].geometry);
            }
            var union = GeometryEngine.union(geomArray);
            this.map.setExtent(union.getExtent().expand(2), false);
            this._showPanel("publishPage");
          } else {
            new Message({
              message: this.nls.tooManyCellsErrorMessage
            });
          }
        } else {
          // Invalid entry
          new Message({
            message: this.nls.missingParametersMessage
          });
        }
      },

      /**
       * Handle create GRG button being clicked on the GRG Point by Time Panel
       **/
      _grgPointByTimeCreateGRGButtonClicked: function () {
        var buffer, geom, GRGAreaWidthHeight, cellWidthMeters, cellHeightMeters;
        //check there is a origin point set and the time and speed values are valid
        if (this.grgPointByTimeTime.isValid() && this.grgPointByTimeRate.isValid() &&
          this.grgPointByTimeRotation.isValid()) {

          // from the time and spped settings work out the radius in meters
          var timeInSeconds = this.grgPointByTimeTime.get('value') *
            this.grgPointByTimeTimeUnits.get('value');
          var rateInMetersPerSecond = (this.grgPointByTimeRate.get('value') *
              this.grgPointByTimeRateUnits.value.split(';')[0]) /
            this.grgPointByTimeRateUnits.value.split(';')[1];
          var calculatedRadiusInMeters = timeInSeconds * rateInMetersPerSecond;

          // now we have the radius in meters we can create a
          // polygon of the grg area from the origin point
          var centerPoint = WebMercatorUtils.geographicToWebMercator(
            this.grgPointByTimeCoordTool.getMapCoordinateDD());

          // if the radius to large we need to create the grid in
          // planar measurements otherwise geodesic
          if (calculatedRadiusInMeters < 200000) {
            this.geodesicGrid = true;
            buffer = GeometryEngine.geodesicBuffer(centerPoint, calculatedRadiusInMeters, 9001);
            geom = gridGeomUtils.extentToPolygon(buffer.getExtent());
            // as we have created a circle the grg area and width should
            // be uniform so we only need to calculate one of them
            GRGAreaWidthHeight = GeometryEngine.geodesicLength(new Polyline({
              paths: [
                [
                  [geom.getPoint(0, 0).x, geom.getPoint(0, 0).y],
                  [geom.getPoint(0, 1).x, geom.getPoint(0, 1).y]
                ]
              ],
              spatialReference: geom.spatialReference
            }), 'meters');
          } else {
            this.geodesicGrid = false;
            buffer = GeometryEngine.buffer(centerPoint, calculatedRadiusInMeters, 9001);
            geom = gridGeomUtils.extentToPolygon(buffer.getExtent());
            GRGAreaWidthHeight = GeometryEngine.distance(geom.getPoint(0, 0),
              geom.getPoint(0, 1), 'meters');
          }

          // add the buffer to the graphics layer
          var graphic = new Graphic(buffer, this._extentSym);
          this._graphicsLayerGRGTimeExtent.add(graphic);

          // the required cell width and height to be used depends on
          // the setting of the define rows and columns toggle
          if (this.setNumberRowsColumnsTime.checked) {
            // check validity of the number of horizontal and vertical cell values
            if (this.grgPointByTimeCellHorizontal.isValid() &&
              this.grgPointByTimeCellVertical.isValid()) {
              cellWidthMeters = GRGAreaWidthHeight / this.grgPointByTimeCellHorizontal.value;
              cellHeightMeters = GRGAreaWidthHeight / this.grgPointByTimeCellVertical.value;
            } else {
              // Invalid values
              new Message({
                message: this.nls.invalidHorizontalVerticalParametersMessage
              });
              return;
            }
          } else {
            // check validity of the cell width and height values
            if (this.grgPointByTimeCellWidth.isValid() && this.grgPointByTimeCellHeight.isValid()) {
              cellWidthMeters = this.util.convertToMeters(this.grgPointByTimeCellWidth.value, this._cellUnits);
              cellHeightMeters = this.util.convertToMeters(this.grgPointByTimeCellHeight.value, this._cellUnits);
            } else {
              // Invalid values
              new Message({
                message: this.nls.invalidWidthHeightParametersMessage
              });
              return;
            }
          }

          // work out how many cells are needed horizontally & Vertically
          // to cover the whole canvas area
          var numCellsHorizontal = Math.round(GRGAreaWidthHeight / cellWidthMeters);

          var numCellsVertical;
          numCellsVertical = this._cellShape === "default" ?
            Math.round(GRGAreaWidthHeight / cellHeightMeters) :
            Math.round(GRGAreaWidthHeight / (cellWidthMeters) /
              Math.cos(30 * Math.PI / 180)) + 1;

          // there is a possibility that the cell width and height already cover the whole
          // GRG area in this case just set the number of cells horizontal and vertical to 1
          if (numCellsHorizontal < 1) {
            numCellsHorizontal = 1;
          }
          if (numCellsVertical < 1) {
            numCellsVertical = 1;
          }

          if (drawGRG.checkGridSize(numCellsHorizontal, numCellsVertical)) {
            var features = drawGRG.createGRG(
              numCellsHorizontal,
              numCellsVertical,
              centerPoint,
              cellWidthMeters,
              cellHeightMeters,
              this.grgPointByTimeRotation.value,
              this._labelStartPosition,
              this._labelType,
              this._labelDirection,
              this._cellShape,
              this._gridOrigin,
              this.geodesicGrid,
              this.map);
            //apply the edits to the feature layer
            this.GRGArea.applyEdits(features, null, null);
            // this.dt_PointByTime.removeStartGraphic(this._graphicsLayerGRGExtent);
            var geomArray = [];
            for (var i = 0; i < features.length; i++) {
              geomArray.push(features[i].geometry);
            }
            var union = GeometryEngine.union(geomArray);
            this.map.setExtent(union.getExtent().expand(2), false);
            this._showPanel("publishPage");
          } else {
            new Message({
              message: this.nls.tooManyCellsErrorMessage
            });
          }
        } else {
          // Invalid entry
          new Message({
            message: this.nls.missingOriginParametersMessage
          });
        }
      },

      /**
       * Handle create GRG button being clicked on the GRG Point by Reference System Panel
       **/
      _grgPointByRefSystemCreateGRGButtonClicked: function () {
        var width, height, cellBLPoint, extent, MGRS;
        var geomArray = [];
        var gridOrigin = this.grgPointByRefSystemCoordTool.getMapCoordinateDD();
        this._clearLayers(false);
        if (drawGRG.checkGridSize(this.grgPointByRefCellHorizontal.getValue(),
            this.grgPointByRefCellVertical.getValue())) {
          if (this.grgPointByRefCellHorizontal.isValid() &&
            this.grgPointByRefCellVertical.isValid()) {
            switch (this.grgPointByRefSystemGridSize.getValue()) {
              case 'UTM':
                var tempLon, tempLat;
                if (gridOrigin.x < 0) {
                  tempLon = (gridOrigin.x - (gridOrigin.x % 6)) - 6;
                } else {
                  tempLon = gridOrigin.x - (gridOrigin.x % 6);
                }
                if (gridOrigin.y < 0) {
                  tempLat = (gridOrigin.y - (gridOrigin.y % 8)) - 8;
                } else {
                  tempLat = gridOrigin.y - (gridOrigin.y % 8);
                }
                break;
              case '100000':
                MGRS = mgrs.LLtoMGRS(gridOrigin.y, gridOrigin.x, 5);
                MGRS = MGRS.substring(0, MGRS.length - 10);
                MGRS = MGRS + '0000000000';
                break;
              case '10000':
                MGRS = mgrs.LLtoMGRS(gridOrigin.y, gridOrigin.x, 1);
                break;
              case '1000':
                MGRS = mgrs.LLtoMGRS(gridOrigin.y, gridOrigin.x, 2);
                break;
              case '100':
                MGRS = mgrs.LLtoMGRS(gridOrigin.y, gridOrigin.x, 3);
                break;
              case '10':
                MGRS = mgrs.LLtoMGRS(gridOrigin.y, gridOrigin.x, 4);
                break;
            }
            if (this.grgPointByRefSystemGridSize.getValue() === 'UTM') {
              cellBLPoint = new Point(tempLon, tempLat);
              width = this.grgPointByRefCellHorizontal.getValue() * 6;
              height = this.grgPointByRefCellVertical.getValue() * 8;
              extent = new Extent({
                "xmin": cellBLPoint.x,
                "ymin": cellBLPoint.y,
                "xmax": cellBLPoint.x + width,
                "ymax": cellBLPoint.y + height,
                "spatialReference": {
                  "wkid": 4326
                }
              });
            } else {
              cellBLPoint = mgrs.USNGtoPoint(MGRS);
              // if the origin point is in a polar region cellBLPoint x and y will be
              // NaN display error to user and break out of function
              if (isNaN(cellBLPoint.x) || isNaN(cellBLPoint.y)) {
                new Message({
                  message: this.nls.grgPolarOriginError
                });
                return;
              }

              width = this.util.convertToMeters(
                  this.grgPointByRefSystemGridSize.getValue(), this._cellUnits) *
                (this.grgPointByRefCellHorizontal.getValue());
              height = this.util.convertToMeters(
                  this.grgPointByRefSystemGridSize.getValue(), this._cellUnits) *
                (this.grgPointByRefCellVertical.getValue());

              var cellTLPoint = geometryUtils.getDestinationPoint(cellBLPoint, 90, width);
              cellTLPoint = geometryUtils.getDestinationPoint(cellTLPoint, 0, height);

              var offset = this.util.convertToMeters(
                this.grgPointByRefSystemGridSize.getValue(), this._cellUnits) / 5;

              //shrink the extent slightly so that we dont pick up extra cells around the edge
              cellBLPoint = geometryUtils.getDestinationPoint(cellBLPoint, 45, offset);
              cellTLPoint = geometryUtils.getDestinationPoint(cellTLPoint, 225, offset);

              extent = new Extent({
                "xmin": cellBLPoint.x,
                "ymin": cellBLPoint.y,
                "xmax": cellTLPoint.x,
                "ymax": cellTLPoint.y,
                "spatialReference": {
                  "wkid": 4326
                }
              });

            }

            if (drawGRG.checkPolarRegion(extent)) {
              new Message({
                message: this.nls.grgPolarRegionError
              });
            }

            extent = WebMercatorUtils.geographicToWebMercator(extent);

            var zones = mgrsUtils.zonesFromExtent(extent, this.map);
            var graphic, label;
            var features = [];

            switch (this.grgPointByRefSystemGridSize.getValue()) {
              case 'UTM':
                for (var i = 0; i < zones.length; i++) {
                  if (this.map.spatialReference.wkid !== 4326) {
                    graphic = new Graphic(WebMercatorUtils.geographicToWebMercator(
                      zones[i].gridPolygon.unclippedPolygon));
                  } else {
                    graphic = new Graphic(zones[i].gridPolygon.unclippedPolygon);
                  }
                  label = this.grgPointByRefLabelFormat.value;
                  label = label.replace(/Z/, zones[i].gridPolygon.text);
                  graphic.setAttributes({
                    'grid': label
                  });
                  features.push(graphic);
                  geomArray.push(graphic.geometry);
                }
                break;
              default:
                var polysToLoop = mgrsUtils.processZonePolygons(zones, this.map, extent);
                var currentValue = 10000;
                while (currentValue >= this.grgPointByRefSystemGridSize.getValue()) {
                  var polys = [];
                  for (i = 0; i < polysToLoop.length; i++) {
                    polys = polys.concat(mgrsUtils.handleGridSquares(
                      polysToLoop[i], this.map, currentValue, extent));
                  }
                  polysToLoop = [];
                  polysToLoop = polys;
                  currentValue = currentValue / 10;
                }
                for (i = 0; i < polysToLoop.length; i++) {

                  if (this.map.spatialReference.wkid !== 4326) {
                    graphic = new Graphic(polysToLoop[i].clippedPolyToUTMZone);
                  } else {
                    graphic = new Graphic(WebMercatorUtils.webMercatorToGeographic(
                      polysToLoop[i].clippedPolyToUTMZone));
                  }
                  if (this._labelTypeWithRefSys === 'gridReferenceSystem') {
                    label = this.grgPointByRefLabelFormat.value;
                    label = label.replace(/Y/, polysToLoop[i].y);
                    label = label.replace(/X/, polysToLoop[i].x);
                    label = label.replace(/S/, polysToLoop[i].GZD);
                    label = label.replace(/Z/, polysToLoop[i].utmZone +
                      polysToLoop[i].latitudeZone);
                    graphic.setAttributes({
                      'grid': label
                    });
                    features.push(graphic);
                  }
                  geomArray.push(graphic.geometry);
                }
                break;
            }
            // change map scale to extent of grg
            if (geomArray.length > 0) {
              var union = GeometryEngine.union(geomArray);
              this.map.setExtent(union.getExtent().expand(2), false);
            }

            if (this._labelTypeWithRefSys !== 'gridReferenceSystem') {
              features = drawGRG.labelReferenceGrid(geomArray, this._labelTypeWithRefSys,
                this._labelStartPosition, this.grgPointByRefSystemGridSize.getValue());
            }

            //apply the edits to the feature layer
            this.GRGArea.applyEdits(features, null, null);

            //we want to keep the point but not show it on the publish page, so just hide the layer
            this._graphicsLayerGRGExtent.hide();
            this._showPanel("publishPage");
          }
        } else {
          new Message({
            message: this.nls.tooManyCellsErrorMessage
          });
        }
      },

      /**
       * Handle create GRG button being clicked on the GRG Area by Reference System Panel
       **/
      _grgAreaByRefSystemCreateGRGButtonClicked: function () {
        var graphic, label;
        //check form inputs for validity
        if (this._graphicsLayerGRGExtent.graphics[0]) {
          var numCellsHorizontal =
            parseInt(this._graphicsLayerGRGExtent.graphics[0].geometry.getExtent().getWidth(), 10) /
            this.grgAreaByRefSystemGridSize.getValue();
          var numCellsVertical =
            parseInt(this._graphicsLayerGRGExtent.graphics[0].geometry.getExtent().getHeight(), 10) /
            this.grgAreaByRefSystemGridSize.getValue();
          if (drawGRG.checkGridSize(numCellsHorizontal, numCellsVertical) ||
            this.grgAreaByRefSystemGridSize.getValue() === 'UTM') {
            if (this.map.spatialReference.wkid !== 4326) {
              if (drawGRG.checkPolarRegion(WebMercatorUtils.webMercatorToGeographic(
                  this._graphicsLayerGRGExtent.graphics[0].geometry))) {
                new Message({
                  message: this.nls.grgPolarRegionError
                });
              }
            } else {
              if (drawGRG.checkPolarRegion(this._graphicsLayerGRGExtent.graphics[0].geometry)) {
                new Message({
                  message: this.nls.grgPolarRegionError
                });
              }
            }
            var geomArray = [];
            this._clearLayers(false);
            // determine which UTM grid zones and bands fall within the extent
            var zones = mgrsUtils.zonesFromExtent(
              this._graphicsLayerGRGExtent.graphics[0].geometry.getExtent(), this.map);
            var features = [];

            switch (this.grgAreaByRefSystemGridSize.getValue()) {
              case 'UTM':
                for (i = 0; i < zones.length; i++) {
                  if (this.grgAreaByRefSystemClipToggle.checked) {
                    if (this.map.spatialReference.wkid !== 4326) {
                      graphic = new Graphic(zones[i].gridPolygon.clippedPolygon);
                    } else {
                      graphic = new Graphic(WebMercatorUtils.webMercatorToGeographic(
                        zones[i].gridPolygon.clippedPolygon));
                    }
                  } else {
                    if (this.map.spatialReference.wkid !== 4326) {
                      graphic = new Graphic(WebMercatorUtils.geographicToWebMercator(
                        zones[i].gridPolygon.unclippedPolygon));
                    } else {
                      graphic = new Graphic(zones[i].gridPolygon.unclippedPolygon);
                    }
                  }
                  geomArray.push(graphic.geometry);
                  label = this.grgAreaByRefLabelFormat.value;
                  label = label.replace(/Z/, zones[i].gridPolygon.text);
                  graphic.setAttributes({
                    'grid': label
                  });
                  features.push(graphic);
                }
                break;
              default:
                var polysToLoop = mgrsUtils.processZonePolygons(zones, this.map,
                  this._graphicsLayerGRGExtent.graphics[0].geometry.getExtent());
                var currentValue = 10000;
                while (currentValue >= this.grgAreaByRefSystemGridSize.getValue()) {
                  var polys = [];
                  for (i = 0; i < polysToLoop.length; i++) {
                    polys = polys.concat(mgrsUtils.handleGridSquares(polysToLoop[i], this.map,
                      currentValue, this._graphicsLayerGRGExtent.graphics[0].geometry.getExtent()));
                  }
                  polysToLoop = [];
                  polysToLoop = polys;
                  currentValue = currentValue / 10;
                }

                for (var i = 0; i < polysToLoop.length; i++) {
                  if (this.grgAreaByRefSystemClipToggle.checked) {
                    if (this.map.spatialReference.wkid !== 4326) {
                      graphic = new Graphic(polysToLoop[i].clippedPolygon);
                    } else {
                      graphic = new Graphic(WebMercatorUtils.webMercatorToGeographic(
                        polysToLoop[i].clippedPolygon));
                    }
                    geomArray.push(graphic.geometry);
                  } else {
                    if (this.map.spatialReference.wkid !== 4326) {
                      graphic = new Graphic(polysToLoop[i].clippedPolyToUTMZone);
                    } else {
                      graphic = new Graphic(WebMercatorUtils.webMercatorToGeographic(
                        polysToLoop[i].clippedPolyToUTMZone));
                    }
                    geomArray.push(graphic.geometry);
                  }
                  if (this._labelTypeWithRefSys === 'gridReferenceSystem') {
                    label = this.grgAreaByRefLabelFormat.value;
                    label = label.replace(/Y/, polysToLoop[i].y);
                    label = label.replace(/X/, polysToLoop[i].x);
                    label = label.replace(/S/, polysToLoop[i].GZD);
                    label = label.replace(/Z/, polysToLoop[i].utmZone +
                      polysToLoop[i].latitudeZone);
                    graphic.setAttributes({
                      'grid': label
                    });
                    features.push(graphic);
                  }

                }
                break;
            }
            // change map scale to extent of grg
            if (geomArray.length > 0) {
              var union = GeometryEngine.union(geomArray);
              this.map.setExtent(union.getExtent().expand(2), false);
            }

            if (this._labelTypeWithRefSys !== 'gridReferenceSystem') {
              features = drawGRG.labelReferenceGrid(geomArray, this._labelTypeWithRefSys,
                this._labelStartPosition, this.grgAreaByRefSystemGridSize.getValue());
            }
            //apply the edits to the feature layer
            this.GRGArea.applyEdits(features, null, null);
            //we want to keep the extent but not show it on the publish page, so just hide the layer
            this._graphicsLayerGRGExtent.hide();
            this._showPanel("publishPage");
          } else {
            new Message({
              message: this.nls.tooManyCellsErrorMessage
            });
          }
        }
      },

      /**
       * Create right click context delete option on graphics
       **/
      createGraphicDeleteMenu: function () {
        // Creates right-click context menu for GRAPHICS
        var selected;
        var ctxMenuForGraphics = new Menu({});

        ctxMenuForGraphics.addChild(new MenuItem({
          label: this.nls.deleteBtn,
          onClick: lang.hitch(this, function () {
            this.GRGArea.remove(selected);
            //refresh each of the feature/graphic layers to enusre labels are removed
            this.GRGArea.refresh();
          })
        }));

        ctxMenuForGraphics.startup();

        this.own(this.GRGArea.on("mouse-over", function (evt) {
          selected = evt.graphic;
          ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
        }));

        this.own(this.GRGArea.on("mouse-out", function (evt) {
          ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
        }));
      },


      /**
       * Handle different theme styles
       **/
      //source:
      //https://stackoverflow.com/questions/9979415/dynamically-load-and-unload-stylesheets
      _removeStyleFile: function (filename, filetype) {
        //determine element type to create nodelist from
        var targetelement = null;
        if (filetype === "js") {
          targetelement = "script";
        } else if (filetype === "css") {
          targetelement = "link";
        } else {
          targetelement = "none";
        }
        //determine corresponding attribute to test for
        var targetattr = null;
        if (filetype === "js") {
          targetattr = "src";
        } else if (filetype === "css") {
          targetattr = "href";
        } else {
          targetattr = "none";
        }
        var allsuspects = document.getElementsByTagName(targetelement);
        //search backwards within nodelist for matching elements to remove
        for (var i = allsuspects.length; i >= 0; i--) {
          if (allsuspects[i] &&
            allsuspects[i].getAttribute(targetattr) !== null &&
            allsuspects[i].getAttribute(targetattr).indexOf(filename) !== -1) {
            //remove element by calling parentNode.removeChild()
            allsuspects[i].parentNode.removeChild(allsuspects[i]);
          }
        }
      },

      _setTheme: function () {
        //Check if DartTheme
        if (this.appConfig.theme.name === "DartTheme") {
          //Load appropriate CSS for dart theme
          utils.loadStyleLink('darkOverrideCSS', this.folderUrl + "css/dartTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/dartTheme.css", 'css');
        }
        //Check if DashBoardTheme
        if (this.appConfig.theme.name === "DashboardTheme" &&
          this.appConfig.theme.styles[0] === "default") {
          //Load appropriate CSS for dashboard theme
          utils.loadStyleLink('darkDashboardOverrideCSS', this.folderUrl +
            "css/dashboardTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/dashboardTheme.css", 'css');
        }
      },

      /**
       * Handle widget being destroyed
       * Primarly needed when in WAB configuration mode
       **/
      destroy: function () {
        this.inherited(arguments);
        this.map.removeLayer(this._graphicsLayerGRGExtent);
        this.map.removeLayer(this.GRGArea);
      },

      /**
       * Handle publish GRG to portal
       **/
      _initSaveToPortal: function (layerName) {
        esriId.registerOAuthInfos();
        var featureServiceName = layerName;
        esriId.getCredential(this.appConfig.portalUrl +
          "/sharing", {
            oAuthPopupConfirmation: false
          }).then(lang.hitch(this, function () {
          //sign in
          var portal = new esriPortal.Portal(this.appConfig.portalUrl);
          portal.signIn().then(lang.hitch(this, function (portalUser) {
            //Get the token
            var token = portalUser.credential.token;
            var orgId = portalUser.orgId;
            var userName = portalUser.username;
            //check the user is not just a publisher
            if (portalUser.role === "org_user") {
              this.publishMessage.innerHTML = this.nls.createService.format(this.nls.userRole);
              this._updateLastFocusNode();
              return;
            }
            var checkServiceNameUrl = this.appConfig.portalUrl +
              "sharing/rest/portals/" + orgId + "/isServiceNameAvailable";
            var createServiceUrl = this.appConfig.portalUrl +
              "sharing/content/users/" + userName + "/createService";
            drawGRG.isNameAvailable(checkServiceNameUrl, token,
              featureServiceName).then(lang.hitch(this, function (response0) {
              if (response0.available) {
                //set the widget to busy
                this.busyIndicator.show();
                //create the service
                drawGRG.createFeatureService(createServiceUrl, token,
                  drawGRG.getFeatureServiceParams(featureServiceName,
                    this.map)).then(lang.hitch(this, function (response1) {
                  if (response1.success) {
                    var addToDefinitionUrl = response1.serviceurl.replace(
                      new RegExp('rest', 'g'), "rest/admin") + "/addToDefinition";
                    drawGRG.addDefinitionToService(addToDefinitionUrl, token,
                      drawGRG.getLayerParams(featureServiceName, this.map,
                        this._cellTextSymbol, this._GRGAreaFillSymbol)).then(lang.hitch(this,
                      function (response2) {
                        if (response2.success) {
                          //Push features to new layer
                          var newFeatureLayer =
                            new FeatureLayer(response1.serviceurl + "/0?token=" + token, {
                              id: featureServiceName,
                              outFields: ["*"]
                            });
                          newFeatureLayer._wabProperties = {
                            itemLayerInfo: {
                              portalUrl: this.appConfig.portalUrl,
                              itemId: response1.itemId
                            }
                          };
                          // Add layer to map
                          this.map.addLayer(newFeatureLayer);

                          // must ensure the layer is loaded before we can
                          // access it to turn on the labels if required
                          var featureLayerInfo;
                          if (newFeatureLayer.loaded) {
                            // show or hide labels
                            featureLayerInfo =
                              jimuLayerInfos.getInstanceSync().getLayerInfoById(featureServiceName);
                            featureLayerInfo.enablePopup();
                            if (this._showLabels) {
                              featureLayerInfo.showLabels();
                            }
                          } else {
                            newFeatureLayer.on("load", lang.hitch(this, function () {
                              // show or hide labels
                              featureLayerInfo =
                                jimuLayerInfos.getInstanceSync().getLayerInfoById(featureServiceName);
                              featureLayerInfo.enablePopup();
                              if (this._showLabels) {
                                featureLayerInfo.showLabels();
                              }
                            }));
                          }
                          var newGraphics = [];
                          array.forEach(this.GRGArea.graphics, function (g) {
                            newGraphics.push(new Graphic(g.geometry, null, {
                              grid: g.attributes.grid
                            }));
                          }, this);
                          newFeatureLayer.applyEdits(newGraphics, null, null).then(lang.hitch(this,
                            function () {
                              this._reset();
                            })).otherwise(lang.hitch(this, function () {
                            this._reset();
                          }));
                          this.busyIndicator.hide();
                          var newURL = '<br /><a role="link" tabindex="0" aria-label="' +
                            this.nls.successfullyPublished + '" href="' + this.appConfig.portalUrl +
                            "home/item.html?id=" + response1.itemId + '" target="_blank">';
                          this.publishMessage.innerHTML =
                            this.nls.successfullyPublished.format(newURL) + '</a>';
                          this._updateLastFocusNode();
                        }
                      }), lang.hitch(this, function (err2) {
                      this.busyIndicator.hide();
                      this.publishMessage.innerHTML =
                        this.nls.addToDefinition.format(err2.message);
                      this._updateLastFocusNode();
                    }));
                  } else {
                    this.busyIndicator.hide();
                    this.publishMessage.innerHTML =
                      this.nls.unableToCreate.format(featureServiceName);
                    this._updateLastFocusNode();
                  }
                }), lang.hitch(this, function (err1) {
                  this.busyIndicator.hide();
                  this.publishMessage.innerHTML = this.nls.createService.format(err1.message);
                  this._updateLastFocusNode();
                }));
              } else {
                // Existing layer. Get layer and populate.
                portal.queryItems({
                  q: "name:" + layerName + " AND owner:" + userName
                }).then(lang.hitch(this, function (items) {
                  if (items.results.length > 0) {
                    var selectedLayers = array.map(items.results, function (item) {
                      if (item.name === layerName) {
                        return item;
                      }
                    }, this);
                    //Push features to new layer
                    var newFeatureLayer =
                      new FeatureLayer(selectedLayers[0].url + "/0?token=" + token, {
                        id: layerName,
                        outFields: ["*"]
                      });
                    newFeatureLayer._wabProperties = {
                      itemLayerInfo: {
                        portalUrl: this.appConfig.portalUrl,
                        itemId: selectedLayers[0].id
                      }
                    };

                    var newGraphics = [];
                    array.forEach(this.GRGArea.graphics, function (g) {
                      newGraphics.push(new Graphic(g.geometry, null, {
                        grid: g.attributes.grid
                      }));
                    }, this);
                    newFeatureLayer.applyEdits(newGraphics, null, null).then(
                      lang.hitch(this, function () {
                        this._reset();
                      })).otherwise(lang.hitch(this, function () {
                      this._reset();
                    }));

                    //Refesh feature layer
                    topic.publish("moveMap", false);

                    var newURL = '<br /><a role="link" tabindex="0" aria-label="' +
                      this.nls.successfullyPublished + '" href="' + this.appConfig.portalUrl +
                      "home/item.html?id=" + selectedLayers[0].id + '" target="_blank">';
                    this.publishMessage.innerHTML =
                      this.nls.successfullyPublished.format(newURL) + '</a>';
                    this._updateLastFocusNode();
                  }
                }), lang.hitch(this, function () {
                  this.busyIndicator.hide();
                  this.publishMessage.innerHTML =
                    this.nls.publishingFailedLayerExists.format(featureServiceName);
                  this._updateLastFocusNode();
                }));
              }
            }), lang.hitch(this, function (err0) {
              this.busyIndicator.hide();
              this.publishMessage.innerHTML = this.nls.checkService.format(err0.message);
              this._updateLastFocusNode();
            }));
          }), lang.hitch(this, function (err) {
            if (err.message === "ERROR: Error in opening workspace") {
              this.publishMessage.innerHTML = this.nls.publishWorskpaceError;
              this._updateLastFocusNode();
            } else {
              this.publishMessage.innerHTML = err.message;
              this._updateLastFocusNode();
            }
          }));
        }));
        esriId.destroyCredentials();
      },

      /**
       * This function is used to make widget accessible
       */
      _supportAccessibility: function () {
        if (this._currentOpenPanel === "mainPage") {
          utils.initFirstFocusNode(this.domNode, this.newGRGAreaButton);
          utils.initLastFocusNode(this.domNode, this.newGRGPointButton);
          return;
        }

        if (this._currentOpenPanel === "grgAreaBySize") {
          this._setFirstAndLastFocusNode(this.grgAreaBySizePanelBackButton,
            this.grgAreaBySizeClearGRGButton);
          return;
        }

        if (this._currentOpenPanel === "grgAreaByRefSystem") {
          this._setFirstAndLastFocusNode(this.grgAreaByRefSystemPanelBackButton,
            this.grgAreaByRefSystemClearGRGButton);
          return;
        }

        if (this._currentOpenPanel === "grgPointBySize") {
          this._setFirstAndLastFocusNode(this.grgPointBySizePanelBackButton,
            this.grgPointBySizeClearGRGButton);
          return;
        }

        if (this._currentOpenPanel === "grgPointByRefSystem") {
          this._setFirstAndLastFocusNode(this.grgPointByRefSystemPanelBackButton,
            this.grgPointByRefSystemClearGRGButton);
          return;
        }

        if (this._currentOpenPanel === "grgPointByTime") {
          this._setFirstAndLastFocusNode(this.grgPointByTimeBackButton,
            this.grgPointByTimeClearGRGButton);
          return;
        }

        if (this._currentOpenPanel === "publishPage") {
          this._setFirstAndLastFocusNode(this.publishPanelBackButton,
            this.grgAreaBySizePublishGRGButton);
          return;
        }

        if (this._currentOpenPanel === "settingsPage") {
          utils.initFirstFocusNode(this.domNode, this.gridSettingsPanelBackButton);
          if (this._checkGridSettingTabSelected()) {
            this._updateLastFocusNode();
          } else {
            this._updateLastFocusNode();
          }
          return;
        }

      },

      /**
       * This function is used to update last focus node in main page
       */
      _updateLastFocusNode: function () {
        if (this._currentOpenPanel === "publishPage") {
          utils.initLastFocusNode(this.domNode, this.grgAreaBySizePublishGRGButton);
          var linkText = query("a", this.publishMessage)[0];
          if (this.publishMessage.innerHTML !== "" && linkText) {
            utils.initLastFocusNode(this.domNode, this.publishMessage);
            focusUtils.focus(linkText);
          }
          return;
        }
        if (this._currentOpenPanel === "settingsPage") {
          if (this._checkGridSettingTabSelected()) {
            if (this._lastOpenPanel === "grgPointByRefSystem" ||
              this._lastOpenPanel === "grgAreaByRefSystem") {
              focusUtils.focus(this._gridSettingsInstance.referenceSystem.domNode);
            } else {
              focusUtils.focus(this._gridSettingsInstance.cellShape.domNode);
            }
            utils.initLastFocusNode(this.domNode,
              this._gridSettingsInstance.gridFillColorPicker.spinner.domNode);
          } else {
            focusUtils.focus(this._gridSettingsInstance.labelStartPosition.domNode);
            utils.initLastFocusNode(this.domNode,
              this._gridSettingsInstance.fontSetting.showHalo.domNode);
          }
          return;
        }
        if (this._currentOpenPanel === "mainPage") {
          utils.initLastFocusNode(this.domNode, this.newPointGRGFromTimeButton);
        }
      },

      /**
       * This function is used to check grid selected tab is selected
       */
      _checkGridSettingTabSelected: function () {
        var displayStyle;
        displayStyle = domStyle.get(this._gridSettingsInstance.gridTab, "display");
        if (displayStyle === "none") {
          return false;
        } else {
          return true;
        }
      },

      /**
       * Moves the map ever so slightly to force a refresh of rendering features
       */
      _moveMap: function () {
        var spatialRef = this.map.spatialReference;
        var startExtent = new Extent();
        startExtent.xmin = this.map.extent.xmin + 0.0001;
        startExtent.ymin = this.map.extent.ymin;
        startExtent.xmax = this.map.extent.xmax;
        startExtent.ymax = this.map.extent.ymax;
        startExtent.spatialReference = spatialRef;

        this.map.setExtent(startExtent);
      },

      /**
       * This function is used to set first and last focus node
       */
      _setFirstAndLastFocusNode: function (firstNode, lastNode) {
        utils.initFirstFocusNode(this.domNode, firstNode);
        focusUtils.focus(firstNode);
        utils.initLastFocusNode(this.domNode, lastNode);
      }
    });
  });