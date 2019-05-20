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
/*globals $:false */
define([
    'dojo',
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/json',
    'dojo/on',
    'dojo/topic',
    'dojo/fx',
    'dojo/string',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dojo/query',
    'dojo/mouse',
    'dojo/number',
    'dojo/_base/kernel',
    'dojo/text!./models/ThreatTypes.json',

    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/Tooltip',

    'jimu/dijit/LoadingIndicator',
    'jimu/dijit/CoordinateControl',
    'jimu/LayerInfos/LayerInfos',
    'jimu/LayerStructure',
    'jimu/utils',
    'jimu/symbolUtils',

    'esri/Color',
    'esri/dijit/util/busyIndicator',
    'esri/graphic',
    'esri/geometry/geometryEngine',
    'esri/geometry/webMercatorUtils',
    'esri/graphicsUtils',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/symbols/PictureMarkerSymbol',
    'esri/renderers/SimpleRenderer',
    'esri/renderers/UniqueValueRenderer',
    'esri/symbols/jsonUtils',
    'esri/InfoTemplate',

    './js/ThreatAnalysisSettings',
    './js/portal-utils',
    './js/SelectFeaturesTool',

    './js/jquery.easy-autocomplete',
    'dijit/form/NumberTextBox',
    'dijit/form/RadioButton',
    'dijit/form/NumberSpinner',
    'dijit/form/Select',
    'jimu/dijit/DrawBox'
  ],
  function (
    dojo,
    declare,
    BaseWidget,
    lang,
    array,
    domClass,
    domConstruct,
    JSON,
    on,
    topic,
    coreFx,
    dojoString,
    domAttr,
    domStyle,
    query,
    dojoMouse,
    dojoNumber,
    dojoKernel,
    threats,
    dijitWidgetBase,
    dijitWidgetsInTemplate,
    dijitTooltip,
    LoadingIndicator,
    CoordinateControl,
    jimuLayerInfos,
    LayerStructure,
    jimuUtils,
    jimuSymbolUtils,
    Color,
    busyIndicator,
    Graphic,
    GeometryEngine,
    WebMercatorUtils,
    graphicsUtils,
    FeatureLayer,
    GraphicsLayer,
    PictureMarkerSymbol,
    SimpleRenderer,
    UniqueValueRenderer,
    jsonUtils,
    InfoTemplate,
    Settings,
    portalutils,
    SelectFeaturesTool
  ) {
    return declare([BaseWidget, dijitWidgetBase, dijitWidgetsInTemplate], {
      baseClass: 'jimu-widget-threatAnalysis',
      _selectedThreat: null, //holds the current value of the selected threat
      _threatData: null, //a JSON object holding all the information about threats
      _lastOpenPanel: "threatMainPage", //Flag to hold last open panel, default will be main page
      _currentOpenPanel: "threatMainPage", //Flag to hold last open panel, default will be main page
      _threatSettingsInstance: null, //Object to hold Settings instance
      _renderer: null, // renderer to be used on the threat Feature Servicem
      _layerList: null, // list of layers from webmap
      _drawBox: null, // interactive draw tools
      _currentGeometry: null, // holds the newly created geometry from interactive tool
      _pointSymbol: null, // holds the point symbol
      _polylineSymbol: null, // holds the polyline symbol
      _polygonSymbol: null, // holds the polygon symbol
      _selectedUnitType: null, // holds Feet or Meters

      postMixInProperties: function () {
        //mixin default nls with widget nls
        this.nls.common = {};
        lang.mixin(this.nls.common, window.jimuNls.common);
      },

      constructor: function (args) {
        declare.safeMixin(this, args);
      },

      postCreate: function () {
        //set up listeners
        topic.subscribe("setBusyIndicator", lang.hitch(this, function (show) {
          if (show) {
            this.busyIndicator.show();
          } else {
            this.busyIndicator.hide();
          }
        }));

        topic.subscribe("clear", lang.hitch(this, this._reset));

        //modify String's prototype so we can format a string using .format requried for IE
        if (!String.prototype.format) {
          String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
              return typeof args[number] !== 'undefined' ? args[number] : match;
            });
          };
        }

        //modify String's prototype so we can search a string using .includes requried for IE
        if (!String.prototype.includes) {
          String.prototype.includes = function () {
            'use strict';
            return String.prototype.indexOf.apply(this, arguments) !== -1;
          };
        }

        this.inherited(arguments);

        //create graphics layer for threat location and add to map
        this._initGL();

        //create a feature collection for the drawn ERG to populate
        var featureCollection = {
          "layerDefinition": {
            "geometryType": "esriGeometryPolygon",
            "objectIdField": "ObjectID",
            "fields": [{
              "name": "ObjectID",
              "alias": "ObjectID",
              "type": "esriFieldTypeOID"
            }, {
              "name": "threat_type",
              "alias": this.nls.threatType,
              "type": "esriFieldTypeString"
            }, {
              "name": "zone_type",
              "alias": this.nls.zoneTypeLabel,
              "type": "esriFieldTypeString"
            }, {
              "name": "mandatory_dist",
              "alias": this.nls.mandatoryLabel,
              "type": "esriFieldTypeDouble"
            }, {
              "name": "safe_dist",
              "alias": this.nls.safeLabel,
              "type": "esriFieldTypeDouble"
            }, {
              "name": "units",
              "alias": this.nls.unitsLabel,
              "type": "esriFieldTypeString"
            }],
            "extent": this.map.extent
          }
        };

        //create the threat feature layer
        this.ThreatArea = new FeatureLayer(featureCollection, {
          id: this.nls.threatGraphicLayer,
          outFields: ["*"]
        });

        //add the threat feature layer and the ERG extent graphics layer to the map
        this.map.addLayer(this.ThreatArea);

        var featureLayerInfo;
        //must ensure the layer is loaded before we can access it to turn on the labels if required
        if (this.ThreatArea.loaded) {
          // show or hide labels
          featureLayerInfo =
            jimuLayerInfos.getInstanceSync().getLayerInfoById(this.nls.threatGraphicLayer);
          if (featureLayerInfo) {
            featureLayerInfo.enablePopup();
          }
        } else {
          this.ThreatArea.on("load", lang.hitch(this, function () {
            // show or hide labels
            featureLayerInfo =
              jimuLayerInfos.getInstanceSync().getLayerInfoById(this.nls.threatGraphicLayer);
            if (featureLayerInfo) {
              featureLayerInfo.enablePopup();
            }
          }));
        }

        this.threatCoordinateControl = new CoordinateControl({
          parentWidget: this,
          label: this.nls.threatAnalysisCoordInputLabel,
          showFormatButton: true,
          drawButtonLabel: this.nls.threatAddPointToolTip,
          drawToolTip: this.nls.threatDrawPointToolTip,
          graphicsLayer: this._threatLocation
        });

        this.threatCoordinateControl.placeAt(this.threatAnalysisCoordContainer);

        //we need an extra class added the the coordinate format node for the Dart theme
        if (this.appConfig.theme.name === 'DartTheme') {
          domClass.add(
            this.threatCoordinateControl.domNode,
            'dartThemeClaroDijitTooltipContainerOverride'
          );
        }

        // Init default symbols
        this._initDefaultSymbols();

        //init loading indicator
        this._initLoading();

        //set up all the handlers for the different click events
        this._initListeners();

        //Create settings page
        this._createSettings();

        //Retrieve threat types
        this._threatData = JSON.parse(threats);

        //Retrieve all layers from webmap
        this._layerList = this._getAllMapLayers();

        //Init draw box
        this._initDrawBox();

        // populate the layer list
        this._populateLayerSelect();

        // Set selected index to interactive
        this.inputTypeSelect.selectedIndex = 0;
        var evt = document.createEvent("Event");
        evt.initEvent("change", false, true);
        this.inputTypeSelect.dispatchEvent(evt);

        //Init threat type drop down
        this._initThreatTypeCtrl(this._threatData);

        // Set invalid and range properties messages
        this.mandatoryDist.invalidMessage = this.nls.invalidNumberMessage;
        this.mandatoryDist.rangeMessage = this.nls.invalidRangeMessage;

        this.safeDist.invalidMessage = this.nls.invalidNumberMessage;
        this.safeDist.rangeMessage = this.nls.invalidRangeMessage;

        this.addTANameArea.invalidMessage = this.nls.invalidLayerName;
        this.addTANameArea.missingMessage = this.nls.missingLayerName;

        this._selectedUnitType = this.unitType.options[this.unitType.selectedIndex].value;
        this.threatType.value = '';
      },


      startup: function () {
        this.busyIndicator = busyIndicator.create({
          target: (this.domNode.parentNode.parentNode !== null) ?
            this.domNode.parentNode.parentNode : this.domNode.parentNode,
          backgroundOpacity: 0
        });
        this._setTheme();
        //Workaround for https://devtopia.esri.com/WebGIS/arcgis-webappbuilder/issues/14707
        var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        var isEdge = /Edge/.test(navigator.userAgent);
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isIE11 || isEdge || isSafari) {
          setTimeout(lang.hitch(this, function () {
            this._reset();
          }, 2000));
        }
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
          jimuUtils.loadStyleLink('darkOverrideCSS', this.folderUrl + "css/dartTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/dartTheme.css", 'css');
        }
        //Check if DashBoardTheme
        if (this.appConfig.theme.name === "DashboardTheme" &&
          this.appConfig.theme.styles[0] === "default") {
          //Load appropriate CSS for dashboard theme
          jimuUtils.loadStyleLink('darkDashboardOverrideCSS',
            this.folderUrl + "css/dashboardTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/dashboardTheme.css", 'css');
        }
      },

      /**
       * Handle widget being destroyed
       * Primarly needed when in WAB configuration mode
       **/
      destroy: function () {
        this.map.removeLayer(this._threatLocation);
        this.map.removeLayer(this.ThreatArea);
        if (this.drawBox) {
          this.drawBox.clear();
        }
        this.inherited(arguments);
      },

      /*
       * initiate and add graphics layer to map
       */
      _initGL: function () {
        this._ptSym = new PictureMarkerSymbol(
          this.folderUrl + 'images/CoordinateLocation.png',
          26,
          26
        );
        this._ptSym.setOffset(0, 13);
        var glrenderer = new SimpleRenderer(this._ptSym);
        this._threatLocation = new GraphicsLayer();
        this._threatLocation.spatialReference = this.map.spatialReference;
        this._threatLocation.setRenderer(glrenderer);
        this._threatLocation.name = "Threat Location";
        this.map.addLayer(this._threatLocation);
      },

      /**
       * Add options to the threat type select control
       */
      _initThreatTypeCtrl: function (data) {
        array.forEach(data, lang.hitch(this, function (item) {
          domConstruct.create("option", {
            value: item.Threat,
            innerHTML: jimuUtils.sanitizeHTML(item.Threat),
            defaultSelected: false,
            selected: false,
            unit: item.Unit
          }, this.threatType);
        }));
      },

      /**
       * Init easy auto complete jquery control
       */
      _initAutoCompleteCtrl: function (data) {
        //set up the options for the threat input selector
        var options = {
          data: data,
          placeholder: this.nls.threatPlaceholder,
          getValue: function (element) {
            return element.Threat;
          },
          list: {
            match: {
              enabled: true
            },
            sort: {
              enabled: true
            },
            onChooseEvent: lang.hitch(this, function () {
              var index = $(this.threatType).getSelectedItemIndex();
              this._selectedThreat =
                $(this.threatType).getSelectedItemData(index);

              this._setDistanceInputControls({
                mandatoryDistance: this._selectedThreat.Bldg_Dist,
                safeDistance: this._selectedThreat.Outdoor_Dist
              });

              if (this.threatCoordinateControl.coordtext.value !== '') {
                this._toggleCreateZoneButton(false);
              }
            }),
            onShowListEvent: lang.hitch(this, function () {
              this._selectedThreat = null;
              this._setDistanceInputControls({
                mandatoryDistance: 0,
                safeDistance: 0
              });
              this._toggleCreateZoneButton(true);
            })
          }
        };
        $(this.threatType).easyAutocomplete(options);
      },

      /**
       * This function used for loading indicator
       */
      _initLoading: function () {
        this.loading = new LoadingIndicator({
          hidden: true
        });
        this.loading.placeAt(this.domNode);
        this.loading.startup();
      },

      /**
       * Init events for different controls
       **/
      _initListeners: function () {
        /**
         * Threat panel
         **/
        //handle Settings button
        if (!this.config.threatAnalysis.lockSettings) {
          //handle Settings button
          this.own(on(this.threatAnalysisSettingsButton, "click", lang.hitch(this, function () {
            this._showPanel("threatSettingsPage");
          })));
        } else {
          this.threatAnalysisSettingsButton.title = this.nls.lockSettings;
          //html.addClass(this.threatAnalysisSettingsButton, 'controlGroupHidden');
        }

        //Handle click event of create threat button
        this.own(on(this.threatCreateButton, 'click', lang.hitch(this,
          this._threatCreateButtonClicked)));

        //Handle click event of clear threat button
        this.own(on(this.threatClearButton, 'click', lang.hitch(this, function () {
          this.threatType.value = '';
          this._setDistanceInputControls({
            mandatoryDistance: 0,
            safeDistance: 0
          }, "feet");
          this._setLabelText(this.mandatoryLabel, this.nls.mandatoryLabel);
          this._setLabelText(this.safeLabel, this.nls.safeLabel);
          this._selectedThreat = null;
          if (this.map.infoWindow.isShowing) {
            this.map.infoWindow.hide();
          }
          this._reset();
        })));

        //Handle the draw tool from the coordinate control dijit
        this.own(on(this.threatCoordinateControl.dt, 'DrawComplete', lang.hitch(this, function () {
          this.threatCoordinateControl.deactivateDrawTool();
          if (this.threatCoordinateControl.currentClickPointDD) {
            this._currentGeometry = this.threatCoordinateControl.currentClickPointDD;
            if (this._selectedThreat !== null) {
              this._toggleCreateZoneButton(true);
            }
          }
        })));

        //Handles when a user deletes a coordinate from the coordinate control dijit
        this.own(on(this.threatCoordinateControl, 'coordinates-deleted', lang.hitch(this, function () {
          this._reset();
        })));

        //Handles when coordinates are properly parsed
        this.own(on(this.threatCoordinateControl, 'get-coordinate-complete', lang.hitch(this, function () {
          setTimeout(lang.hitch(this, function () {
            if (this.threatCoordinateControl.currentClickPointDD) {
              this._currentGeometry = this.threatCoordinateControl.currentClickPointDD;
              if (this._selectedThreat !== null) {
                this._toggleCreateZoneButton(true);
              }
            }
          }), 1000);
        })));

        /**
         * Settings panel
         **/
        //Handle click event of settings back button
        this.own(on(this.threatSettingsPanelBackButton, "click", lang.hitch(this, function () {
          if (this._threatSettingsInstance.validInputs()) {
            this._threatSettingsInstance.onClose();
            this._showPanel(this._lastOpenPanel);
          }
        })));

        /**
         * Publish panel
         **/
        //Handle click event back button
        this.own(on(this.threatResultsPanelBackButton, "click", lang.hitch(this, function () {
          //remove any messages
          this.publishMessage.innerHTML = '';
          //clear layer name
          this.addTANameArea.setValue('');
          this.addTANameArea.reset();
          this._threatLocation.show();
          this._showPanel(this._lastOpenPanel);
        })));

        //Handle click event of publish ERG to portal button
        this.own(on(this.threatPublishButton, 'click', lang.hitch(this, function () {
          if (this.addTANameArea.isValid()) {
            this.publishMessage.innerHTML = '';
            portalutils.saveToPortal(
              this.addTANameArea.value,
              this.map,
              this.appConfig,
              this._renderer,
              this.publishMessage,
              this.nls,
              this.ThreatArea.graphics);
          } else {
            // Invalid entry
            this.publishMessage.innerHTML = jimuUtils.sanitizeHTML(this.nls.missingLayerNameMessage);
          }
        })));

        // Drawbox listeners
        this.own(on(this.drawBox, 'DrawEnd', lang.hitch(this, this._onDrawEnd)));

        // SelectFeaturesTool init and listeners
        this.selectFeaturesTool = new SelectFeaturesTool({
          drawBoxOption: {
            map: this.map,
            geoTypes: ["EXTENT", "POLYGON"],
            showClear: false
          },
          nls: this.nls
        });
        this.own(on(this.selectFeaturesTool, 'selection-complete', lang.hitch(this, function (results) {
          this._toggleCreateZoneButton(this._selectedThreat && results.geometry ?
            true : false);
          this._currentGeometry = results.geometry;
        })));
        this.selectFeaturesTool.placeAt(this.drawingSection);

        // Select listeners
        this.own(on(this.inputTypeSelect, 'change', lang.hitch(this, this._onInputTypeSelectionChanged)));
        this.own(on(this.threatType, 'change', lang.hitch(this, this._onThreatTypeSelectionChanged)));
        this.own(on(this.unitType, 'change', lang.hitch(this, this._onUnitTypeSelectionChanged)));
        this.own(on(this.layerSelect, 'change', lang.hitch(this, this._onLayerSelectionChanged)));
      },

      /**
       * Shows tooltip for threat location text area
       */
      _showThreatLocationTooltip: function () {
        this.own(on.once(this.threatCoordinateControl.coordtext, dojoMouse.enter, lang.hitch(this, function () {
          dijitTooltip.show(this.nls.manualCoordinateInputInfo, this.threatCoordinateControl.coordtext);
        })));
        this.own(on.once(this.threatCoordinateControl.coordtext, dojoMouse.leave, lang.hitch(this, function () {
          dijitTooltip.hide(this.threatCoordinateControl.coordtext);
        })));
      },

      /**
       * Show and hide divs based on selected input location type
       */
      _onInputTypeSelectionChanged: function () {
        var inputType = this.inputTypeSelect.options[this.inputTypeSelect.selectedIndex].value;
        if (inputType === "interactive") {
          coreFx.wipeIn({
            node: this.interActiveDiv
          }).play();
          this.coordInputDiv.style.display = this.existingFeatureDiv.style.display = "none";
        }
        if (inputType === "manual_location") {
          coreFx.wipeIn({
            node: this.coordInputDiv
          }).play();
          this.interActiveDiv.style.display = this.existingFeatureDiv.style.display = "none";
          this._showThreatLocationTooltip();
        }
        if (inputType === "existing_features") {
          coreFx.wipeIn({
            node: this.existingFeatureDiv
          }).play();
          this.coordInputDiv.style.display = this.interActiveDiv.style.display = "none";
        }
      },

      /**
       * Gets the selected layer from webmap
       */
      _onLayerSelectionChanged: function () {
        var selectedLayerName = this.layerSelect.options[this.layerSelect.selectedIndex].value;
        var layerInfo = array.filter(this._layerList, lang.hitch(this, function (layer) {
          return selectedLayerName === layer.name;
        }));
        this.selectFeaturesTool.setLayerInfo(layerInfo[0]);
      },

      /**
       * Handler for threat type select ctrl
       */
      _onThreatTypeSelectionChanged: function () {
        var threatType = this.threatType.options[this.threatType.selectedIndex].value;
        array.forEach(this._threatData, lang.hitch(this, function (item) {
          if (item.Threat === threatType) {
            this._selectedThreat = {
              threatType: item.Threat,
              mandatoryDistance: item.Bldg_Dist,
              safeDistance: item.Outdoor_Dist,
              unitType: item.Unit
            };
            this._setDistanceInputControls(this._selectedThreat, this._selectedUnitType);
            //Enable create zone button
            if (this._currentGeometry) {
              this._toggleCreateZoneButton(true);
            }
          }
        }));
      },

      /**
       * Display standoff distances when a threat type is selected
       */
      _onUnitTypeSelectionChanged: function () {
        this._selectedUnitType = this.unitType.options[this.unitType.selectedIndex].value;
        if (this._selectedThreat) {
          this._setDistanceInputControls(this._selectedThreat, this._selectedUnitType);
        }
      },

      /**
       * Sets the title and innerHTML for a component
       */
      _setLabelText: function (node, message) {
        array.forEach(["title", "innerHTML"], lang.hitch(this, function (attr) {
          domAttr.set(node, attr, message);
        }));
      },

      /**
       * Get panel node from panel name
       **/
      _getNodeByName: function (panelName) {
        var node;
        switch (panelName) {
          case "threatMainPage":
            node = this.threatMainPageNode;
            break;
          case "threatSettingsPage":
            node = this.threatSettingsPageNode;
            break;
          case "threatResultsPage":
            node = this.threatResultsPageNode;
            break;
        }
        return node;
      },

      _reset: function () {
        this._clearLayers();
        //enable map navigation if disabled due to a tool being in use
        this.map.enableMapNavigation();
      },

      _clearLayers: function () {
        this.ThreatArea.clear();
        //refresh Threat layer to make sure any labels are removed
        this.ThreatArea.refresh();
        this._toggleCreateZoneButton(false);
        this._threatLocation.clear();
        this.threatCoordinateControl.clear();
        this.selectFeaturesTool.reset();
        this._currentGeometry = null;
        this._selectedThreat = null;
        this.drawBox.clear();
        this.threatType.value = '';
        this._setDistanceInputControls({
          mandatoryDistance: 0,
          safeDistance: 0
        }, "feet");
      },

      /**
       * Creates settings
       **/
      _createSettings: function () {
        //Create Settings Instance
        this._threatSettingsInstance = new Settings({
          nls: this.nls,
          config: this.config,
          appConfig: this.appConfig
        }, domConstruct.create("div", {}, this.threatSettingsNode));

        //add a listener for a change in settings
        this.own(this._threatSettingsInstance.on("ThreatSettingsChanged",
          lang.hitch(this, function (updatedSettings) {

            var mandatoryFillColor =
              new Color(updatedSettings.mandatoryFillColor.color);
            var mandatoryFillTrans =
              (1 - updatedSettings.mandatoryFillColor.transparency) * 255;
            var mandatoryOutlineColor =
              new Color(updatedSettings.mandatoryOutlineColor.color);
            var mandatoryOutlineTrans =
              (1 - updatedSettings.mandatoryOutlineColor.transparency) * 255;

            var safeFillColor =
              new Color(updatedSettings.safeFillColor.color);
            var safeFillTrans =
              (1 - updatedSettings.safeFillColor.transparency) * 255;
            var safeOutlineColor =
              new Color(updatedSettings.safeOutlineColor.color);
            var safeOutlineTrans =
              (1 - updatedSettings.safeOutlineColor.transparency) * 255;

            var uvrJson = {
              "type": "uniqueValue",
              "field1": "zone_type",
              "uniqueValueInfos": [{
                "value": this.nls.mandatoryLabel,
                "symbol": {
                  "color": [mandatoryFillColor.r,
                    mandatoryFillColor.g,
                    mandatoryFillColor.b,
                    mandatoryFillTrans
                  ],
                  "outline": {
                    "color": [mandatoryOutlineColor.r,
                      mandatoryOutlineColor.g,
                      mandatoryOutlineColor.b,
                      mandatoryOutlineTrans
                    ],
                    "width": 1,
                    "type": "esriSLS",
                    "style": updatedSettings.mandatoryOutlineColor.type
                  },
                  "type": "esriSFS",
                  "style": updatedSettings.mandatoryFillColor.type
                }
              }, {
                "value": this.nls.safeLabel,
                "symbol": {
                  "color": [safeFillColor.r, safeFillColor.g, safeFillColor.b, safeFillTrans],
                  "outline": {
                    "color": [safeOutlineColor.r,
                      safeOutlineColor.g,
                      safeOutlineColor.b,
                      safeOutlineTrans
                    ],
                    "width": 1,
                    "type": "esriSLS",
                    "style": updatedSettings.safeOutlineColor.type
                  },
                  "type": "esriSFS",
                  "style": updatedSettings.safeFillColor.type
                }
              }]
            };

            // create a renderer for the threat analysis layer to override default symbology
            this._renderer = new UniqueValueRenderer(uvrJson);
            this.ThreatArea.setRenderer(this._renderer);

            //refresh the layer to apply the settings
            this.ThreatArea.refresh();
          })));
        this._threatSettingsInstance.startup();
      },

      /**
       * Displays selected panel
       **/
      _showPanel: function (currentPanel) {
        var prevNode, currentNode;
        //check if previous panel exist and hide it
        if (this._currentOpenPanel) {
          prevNode = this._getNodeByName(this._currentOpenPanel);
          domClass.add(prevNode, "Hidden");
        }
        //get current panel to be displayed and show it
        currentNode = this._getNodeByName(currentPanel);
        domClass.remove(currentNode, "Hidden");
        //set the current panel and previous panel
        this._lastOpenPanel = this._currentOpenPanel;
        this._currentOpenPanel = currentPanel;
      },

      /**
       * Handle the create ERG button being clicked
       **/
      _threatCreateButtonClicked: function () {
        if (!domClass.contains(this.threatCreateButton, 'jimu-state-disabled')) {
          this._createThreatAreas(
            this._currentGeometry, this._selectedThreat, this._selectedUnitType);
        }
      },

      /**
       * Creates the threat areas based on geometry,
       * mandatory, and safe distances
       */
      _createThreatAreas: function (geom, selectedThreat, unitType) {
        if (geom && selectedThreat) {
          var features = [];
          var unitMeasure = (unitType.toLowerCase() === "feet") ? this.nls.feetLabel : this.nls.metersLabel;

          //get the threat location
          var threatLocation = (geom.spatialReference.isWebMercator()) ?
            geom : WebMercatorUtils.geographicToWebMercator(geom);

          //set geodesic unit measurement number
          var geodesicNum = (selectedThreat.unitType.toLowerCase() === "feet") ? 9002 : 9001;
          var convertedLength = (unitType.toLowerCase() === "feet") ? selectedThreat.mandatoryDistance :
            this._convertToMeters(selectedThreat.mandatoryDistance, false);
          // draw the mandatory evacuation zone
          var mandatoryGraphic = new Graphic(GeometryEngine.buffer(threatLocation,
            selectedThreat.mandatoryDistance, geodesicNum));
          mandatoryGraphic.setAttributes({
            "zone_type": this.nls.mandatoryLabel,
            "mandatory_dist": convertedLength,
            "threat_type": selectedThreat.threatType,
            "safe_dist": 0.0,
            "units": unitMeasure
          });
          var infoTemplate = new InfoTemplate();
          infoTemplate.setTitle(this.nls._widgetLabel);
          infoTemplate.setContent(
            "<b>" + this.nls.threatType + ":</b> ${threat_type}<br />" +
            "<b>" + this.nls.mandatoryLabel + ":</b> ${mandatory_dist} " +
            unitMeasure + "<br />"
          );
          mandatoryGraphic.setInfoTemplate(infoTemplate);
          features.push(mandatoryGraphic);

          //Create the safe evacuation zone geometry
          var safeGeom = GeometryEngine.buffer(threatLocation, selectedThreat.safeDistance, geodesicNum);
          //Cut the mandatory distance zone from the safe evacuation geometry to create a donut
          var geoms = GeometryEngine.difference(safeGeom, mandatoryGraphic.geometry);

          convertedLength = (unitType.toLowerCase() === "feet") ? selectedThreat.safeDistance :
            this._convertToMeters(selectedThreat.safeDistance, false);
          // draw the safe evacutation zone
          var safeGraphic = new Graphic(geoms ? geoms : safeGeom);
          safeGraphic.setAttributes({
            "zone_type": this.nls.safeLabel,
            "mandatory_dist": 0.0,
            "safe_dist": convertedLength,
            "threat_type": selectedThreat.threatType,
            "units": unitMeasure
          });
          infoTemplate = new InfoTemplate();
          infoTemplate.setTitle(this.nls._widgetLabel);
          infoTemplate.setContent(
            "<b>" + this.nls.threatType + ":</b> ${threat_type}<br />" +
            "<b>" + this.nls.safeLabel + ":</b> ${safe_dist} " +
            unitMeasure + "<br />"
          );
          safeGraphic.setInfoTemplate(infoTemplate);
          features.push(safeGraphic);

          this.ThreatArea.applyEdits(features, null, null);
          this.map.setExtent(
            this.ThreatArea.graphics[this.ThreatArea.graphics.length - 1].geometry.getExtent().expand(2));
          this._showPanel("threatResultsPage");

          this.selectFeaturesTool.reset();
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
       * Inits the draw box for interactive input
       * and select existing feature types
       */
      _initDrawBox: function () {
        this.drawBox.setMap(this.map);
        var pinSymbol = jimuSymbolUtils.getGreyPinMarkerSymbol();
        this.drawBox.setPointSymbol(pinSymbol);
      },

      /**
       * Handler for draw box for interactive input type
       */
      _onDrawEnd: function (graphic, geotype, commontype) {
        this.drawBox.clear();
        this._currentGeometry = graphic.geometry;
        var symbol = null;
        if (geotype === "POINT") {
          symbol = this._pointSymbol;
        } else if (geotype === "POLYLINE") {
          symbol = this._polylineSymbol;
        } else {
          symbol = this._polygonSymbol;
        }
        if (geotype !== "EXTENT") {
          this._threatLocation.clear();
          this._threatLocation.add(new Graphic(graphic.geometry, symbol, null, null));
        }

        if (this._selectedThreat && this._currentGeometry) {
          this._toggleCreateZoneButton(true);
        }
      },

      /**
       * Toggle the Create Zones button
       */
      _toggleCreateZoneButton: function (isEnabled) {
        if (isEnabled) {
          dojo.removeClass(this.threatCreateButton, 'jimu-state-disabled');
        } else {
          dojo.addClass(this.threatCreateButton, 'jimu-state-disabled');
        }
      },

      /**
       * Set the value for mandatory and safe distances controls
       */
      _setDistanceInputControls: function (params, unitType) {
        if (params && params.hasOwnProperty('mandatoryDistance') && params.hasOwnProperty('safeDistance')) {

          var convertedLength = (unitType.toLowerCase() === "meters") ?
            this._convertToMeters(params.mandatoryDistance, true) : this._formatNumber(params.mandatoryDistance);
          this.mandatoryDist.set('value', dojoString.substitute("${mandatoryDistance} ${unitType}", {
            mandatoryDistance: convertedLength,
            unitType: (unitType.toLowerCase() === "meters") ? this.nls.metersLabel : this.nls.feetLabel
          }));

          convertedLength = (unitType.toLowerCase() === "meters") ?
            this._convertToMeters(params.safeDistance, true) : this._formatNumber(params.safeDistance);
          this.safeDist.set('value', dojoString.substitute("${safeDistance} ${unitType}", {
            safeDistance: convertedLength,
            unitType: (unitType.toLowerCase() === "meters") ? this.nls.metersLabel : this.nls.feetLabel
          }));
        }
      },

      /**
       * Convert feet to meters
       */
      _convertToMeters: function (length, shouldFormat) {
        if (shouldFormat) {
          return this._formatNumber(length / 3.280839895);
        }
        return length / 3.280839895;
      },

      /**
       * Format number to 2 decimal places
       */
      _formatNumber: function (length) {
        return dojoNumber.format(length, {
          places: 2,
          locale: dojoKernel.locale
        });
      },

      /**
       * Populates the drop down list of operational layers
       * from the webmap
       */
      _populateLayerSelect: function () {
        array.forEach(this._layerList, lang.hitch(this, function (layer) {
          domConstruct.create("option", {
            value: layer.name,
            innerHTML: jimuUtils.sanitizeHTML(layer.name),
            selected: false
          }, this.layerSelect);
        }));
        var layerInfo = array.filter(this._layerList, lang.hitch(this, function (layer) {
          return this.layerSelect.options[0].value === layer.name;
        }));
        this.selectFeaturesTool.setLayerInfo(layerInfo[0]);
      },

      _initDefaultSymbols: function () {
        var pointSys = {
          "style": "esriSMSCircle",
          "color": [0, 0, 128, 128],
          "name": "Circle",
          "outline": {
            "color": [0, 0, 128, 255],
            "width": 1
          },
          "type": "esriSMS",
          "size": 18
        };
        var lineSys = {
          "style": "esriSLSSolid",
          "color": [79, 129, 189, 255],
          "width": 3,
          "name": "Blue 1",
          "type": "esriSLS"
        };
        var polygonSys = {
          "style": "esriSFSSolid",
          "color": [79, 129, 189, 128],
          "type": "esriSFS",
          "outline": {
            "style": "esriSLSSolid",
            "color": [54, 93, 141, 255],
            "width": 1.5,
            "type": "esriSLS"
          }
        };
        if (!this._pointSymbol) {
          this._pointSymbol = jsonUtils.fromJson(pointSys);
        }
        if (!this._polylineSymbol) {
          this._polylineSymbol = jsonUtils.fromJson(lineSys);
        }
        if (!this._polygonSymbol) {
          this._polygonSymbol = jsonUtils.fromJson(polygonSys);
        }
      }

    });
  });