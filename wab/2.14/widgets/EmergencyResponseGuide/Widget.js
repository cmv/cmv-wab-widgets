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
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/_base/kernel',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dojo/json',
    'dojo/on',
    'dojo/text!./guide/materials.json',
    'dojo/keys',
    'dojo/query',
    'dojo/topic',

    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/focus',

    'jimu/dijit/Message',
    'jimu/dijit/LoadingIndicator',
    'jimu/LayerInfos/LayerInfos',
    'jimu/LayerStructure',
    'jimu/utils',
    'jimu/dijit/CoordinateControl',

    'esri/IdentityManager',
    'esri/arcgis/Portal',
    'esri/Color',
    'esri/dijit/util/busyIndicator',
    'esri/graphic',
    'esri/geometry/geometryEngine',
    'esri/geometry/Extent',
    'esri/geometry/Point',
    'esri/geometry/Polygon',
    'esri/geometry/Circle',
    'esri/geometry/webMercatorUtils',
    'esri/graphicsUtils',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/SpatialReference',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/renderers/UniqueValueRenderer',
    'esri/renderers/SimpleRenderer',
    'esri/request',

    './js/Settings',
    './js/portal-utils',
    './js/WeatherInfo',
    'jimu/dijit/CheckBox',
    './js/jquery.easy-autocomplete',

    'dijit/form/NumberTextBox',
    'dijit/form/RadioButton',
    'dijit/form/NumberSpinner',
    'jimu/dijit/formSelect'
  ],
  function (
    dojo,
    declare,
    BaseWidget,
    array,
    lang,
    kernel,
    domClass,
    domStyle,
    domAttr,
    domConstruct,
    JSON,
    on,
    materials,
    keys,
    query,
    topic,
    dijitWidgetBase,
    dijitWidgetsInTemplate,
    focusUtils,
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
    Polygon,
    Circle,
    WebMercatorUtils,
    graphicsUtils,
    FeatureLayer,
    GraphicsLayer,
    SpatialReference,
    SimpleMarkerSymbol,
    UniqueValueRenderer,
    SimpleRenderer,
    esriRequest,
    Settings,
    portalutils,
    WeatherInfo,
    Checkbox
  ) {
    return declare([BaseWidget, dijitWidgetBase, dijitWidgetsInTemplate], {
      baseClass: 'jimu-widget-ERG',

      _selectedMaterial: null, //holds the current value of the selected material
      _materialsData: null, //a JSON object holding all the information about materials
      _weatherInfo: null,
      _windSpeed: 0, //
      _lastOpenPanel: "ergMainPage", //Flag to hold last open panel, default will be main page
      _currentOpenPanel: "ergMainPage", //Flag to hold last open panel, default will be main page
      _useWeather: false, //Flag to hold if weather is to be used
      _weatherURL: '', //Weather URL for Yahoo
      _weatherSource: 'Yahoo', //options Yahoo or DarkSky
      _SettingsInstance: null, //Object to hold Settings instance
      _spillLocationSym: null, //Object to hold spill Location Symbol
      _IIZoneSym: null, //Object to hold II Zone Symbol
      _PAZoneSym: null, //Object to hold PA Zone Symbol
      _downwindZoneSym: null, //Object to hold Downwind Zone Symbol
      _fireZoneSym: null, //Object to hold FIRE Zone Symbol
      _bleveZoneSym: null, //Object to hold BLEVE Zone Symbol
      _renderer: null, // renderer to be used on the ERG Feature Service
      _addLayerToMap: true, // flag to add layer to map

      postMixInProperties: function () {
        //mixin default nls with widget nls
        this.nls.common = {};
        lang.mixin(this.nls.common, window.jimuNls.common);
      },

      constructor: function (args) {
        declare.safeMixin(this, args);
      },

      postCreate: function () {
        //modify String's prototype so we can format a string using .format requried for IE
        if (!String.prototype.format) {
          String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
              return typeof args[number] !== 'undefined' ? args[number] : match;
            });
          };
        }

        //Check if AR locale
        if (kernel.locale === "ar") {
          domStyle.set(this.helpBtn, "transform", "rotateY(180deg)");
        } else {
          domStyle.set(this.helpBtn, "transform", "");
        }

        //modify String's prototype so we can search a string using .includes requried for IE
        if (!String.prototype.includes) {
          String.prototype.includes = function () {
            'use strict';
            return String.prototype.indexOf.apply(this, arguments) !== -1;
          };
        }

        // determine if weather URL can be reached
        if (this._weatherURL) {
          var requestURL;
          if (this._weatherSource === 'Yahoo') {
            requestURL = this._weatherURL +
              "q=select wind,item.condition from weather.forecast" +
              " where woeid = 56570399&format=json";
          } else {
            requestURL = this._weatherURL + "&q=45,45&callbackNode=LocalPerspective";
          }
          var weatherDeferred = esriRequest({
            url: requestURL,
            callbackParamName: "callback"
          }, {
            useProxy: false
          });
          weatherDeferred.then(lang.hitch(this, function () {
            this._useWeather = true;
            dojo.removeClass(this.weatherContainer, 'ERGHidden');
            this._weatherInfo = new WeatherInfo(this.weather, this._weatherURL, this);
            //set up blank weather info
            this._weatherInfo._resetWeatherInfo(this._weatherSource, this.nls.weatherIntialText);
          }), lang.hitch(this, function () {
            this._useWeather = false;
            dojo.addClass(this.weatherContainer, 'ERGHidden');
          }));
        }

        this.inherited(arguments);

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

        //set up symbology for point input
        this._ptSym = new SimpleMarkerSymbol(this.pointSymbol);
        // Create graphics layer
        var glrenderer = new SimpleRenderer(this._ptSym);
        //create graphics layer for spill location and add to map
        this._spillLocation = new GraphicsLayer({
          id: "spillLocation"
        });
        this._spillLocation.spatialReference = this.map.spatialReference;
        this._spillLocation.setRenderer(glrenderer);

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
              "name": "type",
              "alias": "type",
              "type": "esriFieldTypeString"
            }],
            "extent": this.map.extent
          }
        };

        //create a the ERG feature layer
        this.ERGArea = new FeatureLayer(featureCollection, {
          id: "ERG-Graphic",
          outFields: ["*"]
        });

        //add the ERG feature layer and the ERG extent graphics layer to the map
        this.map.addLayers([this.ERGArea, this._spillLocation]);

        var featureLayerInfo;
        //must ensure the layer is loaded before we can access it to turn on the labels if required
        if (this.ERGArea.loaded) {
          // show or hide labels
          featureLayerInfo =
            jimuLayerInfos.getInstanceSync().getLayerInfoById("ERG-Graphic");
          featureLayerInfo.enablePopup();
        } else {
          this.ERGArea.on("load", lang.hitch(this, function () {
            // show or hide labels
            featureLayerInfo =
              jimuLayerInfos.getInstanceSync().getLayerInfoById("ERG-Graphic");
            featureLayerInfo.enablePopup();
          }));
        }

        //set up coordinate input dijit for ERG Spill Location
        this.inputControl = new CoordinateControl({
          parentWidget: this,
          label: this.nls.coordInputLabelStart,
          input: true,
          showCopyButton: false,
          showFormatButton: true,
          showDrawPoint: true,
          drawButtonLabel: this.nls.addPointToolTip,
          graphicsLayer: this._spillLocation
        });
        this.inputControl.placeAt(this.inputcoordcontainer);
        this.inputControl.startup();

        this._initLoading();

        //Publish new layer checkbox
        this.publishNewLayer = new Checkbox({
          "checked": false,
          "label": this.nls.publishToNewLayer
        }, domConstruct.create("div", {}, this.checkBoxParentContainer));


        //set up all the handlers for the different click events
        this._handleClickEvents();

        this._createSettings();

        //Retrieve all layers from webmap
        this._layerList = this._getAllMapLayers();

        // populate the publish list
        this._populateSelectList(this.featureLayerList, this._layerList,
          this.config.erg.operationalLayer.name, false, true);

        if (this.config.erg.operationalLayer.name === '') {
          // Hide the checkbox and drop-down list
          domClass.add(this.featureLayerList.domNode, 'controlGroupHidden');
          // Set the checkbox to true since user is publishing to a new layer
          this.publishNewLayer.setValue(true);
          // Show the textbox
          domClass.remove(this.addERGNameArea.domNode, 'controlGroupHidden');
        }
        // Code for accessibility: Function call to support widget accessible
        this._setFirstLastFocusableNodes();
      },

      startup: function () {
        this.inherited(arguments);
        this.busyIndicator = busyIndicator.create({
          target: this.domNode.parentNode.parentNode.parentNode,
          backgroundOpacity: 0
        });
        this._setTheme();

        //load in the materials json file
        this._materialsData = JSON.parse(materials);

        //set up the options for the material input selector
        var options = {
          data: this._materialsData,
          placeholder: this.nls.materialPlaceholder,
          getValue: function (element) {
            return element.IDNum === 0 ? element.Material : element.IDNum + " | " + element.Material;
          },
          template: {
            type: "custom",
            method: lang.hitch(this, function (value, item) {
              return "<a href='" + this.folderUrl + "guide/" + item.GuideNum +
                ".pdf' target='_blank'><img height='18px' src='" +
                this.folderUrl + "images/pdf.png' /></a>  " + value;
            })
          },
          list: {
            match: {
              enabled: true
            },
            onChooseEvent: lang.hitch(this, function () {
              var messagePopup;
              var index = $(this.materialType).getSelectedItemIndex();
              this._selectedMaterial =
                $(this.materialType).getSelectedItemData(index);
              if (this._selectedMaterial.TABLE2) {
                messagePopup = new Message({
                  message: this.nls.table2Message + this._selectedMaterial.TIH.replace(/\,/g, "\n")
                });
              }
              if (this._selectedMaterial.TABLE3 && this.spillSize.getValue() === 'LG') {
                messagePopup = new Message({
                  message: this.nls.table3Message
                });
                this.windSpeed.set('disabled', false);
                this.transportContainer.set('disabled', false);
                domAttr.set(this.windSpeed, 'tabindex', 0);
                domAttr.set(this.transportContainer, 'tabindex', 0);
                dojo.removeClass(this.table3Container, 'ERGHidden');
                this._resetTransportContainerOptions();
              } else {
                this.windSpeed.set('disabled', true);
                this.transportContainer.set('disabled', true);
                domAttr.set(this.windSpeed, 'tabindex', -1);
                domAttr.set(this.transportContainer, 'tabindex', -1);
              }
              if (this._selectedMaterial.BLEVE) {
                messagePopup = new Message({
                  message: this.nls.bleveMessage
                });
                this.useBleve.set('disabled', false);
                this.tankCapacity.set('disabled', false);
                dojo.removeClass(this.bleveContainer, 'ERGHidden');
                domAttr.set(this.useBleve, 'tabindex', 0);
                domAttr.set(this.tankCapacity, 'tabindex', 0);
              } else {
                this.useBleve.set('disabled', true);
                this.tankCapacity.set('disabled', true);
                domAttr.set(this.useBleve, 'tabindex', -1);
                domAttr.set(this.tankCapacity, 'tabindex', -1);
              }
              if (this._selectedMaterial.Material.includes('Substances')) {
                this.spillSize.setValue('SM');
                this.spillSize.set('disabled', true);
                domAttr.set(this.spillSize, 'tabindex', -1);
              }
              if (this.inputControl.getMapCoordinateDD()) {
                dojo.removeClass(this.CreateERGButton, 'jimu-state-disabled');
                domAttr.set(this.CreateERGButton, 'tabindex', 0);
              }
              focusUtils.focus(this.materialType);
              // Code for accessibility : to hide material list on ENTER of OK to set focus
              if (messagePopup) {
                on(query(".jimu-btn", messagePopup.domNode)[0], 'keydown',
                  lang.hitch(this, function (evt) {
                    if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                      query(".easy-autocomplete-container>ul")[0].style.display = "none";
                    }
                  }));
                // Code for accessibility:Hide material list on ESCAPE of popup to set focus
                on(messagePopup.domNode, 'keydown', lang.hitch(this, function (evt) {
                  if (evt.keyCode === keys.ESCAPE) {
                    setTimeout(lang.hitch(this, function () {
                      query(".easy-autocomplete-container>ul")[0].style.display = "none";
                      focusUtils.focus(this.materialType);
                    }), 100);
                  }
                }));
              }
            })
          }
        };
        $(this.materialType).easyAutocomplete(options);
      },

      /**
       * The transport conatiner dropdown list changes depending on material
       */
      _resetTransportContainerOptions: function () {
        //first of all reomve all options
        for (var i = this.transportContainer.options.length - 1; i >= 0; i--) {
          this.transportContainer.removeOption(i);
        }
        // rail and semi are common to all materials
        var dropDownOptions = ["rail", "semi"];
        // add other container options depending on material id
        switch (this._selectedMaterial.IDNum) {
          case 1005:
            dropDownOptions.push("ag", "msm");
            break;
          case 1017:
          case 1050:
          case 2186:
          case 1079:
            dropDownOptions.push("mton", "ston");
            break;
          case 1040:
          case 1052:
            dropDownOptions.push("ston");
            break;
        }

        var options = [],
          singleOption;
        //Add options for selected dropdown
        array.forEach(dropDownOptions, lang.hitch(this, function (type) {
          singleOption = {
            value: type.toUpperCase(),
            label: this.nls[type]
          };
          options.push(singleOption);
        }));
        this.transportContainer.addOption(options);
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
       * Handle click events for different controls
       **/
      _handleClickEvents: function () {
        /**
         * ERG panel
         **/
        //handle Settings button
        if (!this.config.erg.lockSettings) {
          //handle Settings button
          this.own(on(this.ERGSettingsButton, "click", lang.hitch(this, function () {
            this._showPanel("settingsPage");
          })));

          //handle Settings button accessibility
          this.own(on(this.ERGSettingsButton, "keydown", lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._showPanel("settingsPage");
              this._setFirstLastFocusableNodes();
            }
          })));

        } else {
          this.ERGSettingsButton.title = this.nls.lockSettings;
          //html.addClass(this.ERGSettingsButton, 'controlGroupHidden');
        }

        //Handle click event of create ERG button
        this.own(on(this.CreateERGButton, 'click', lang.hitch(this,
          this._CreateERGButtonClicked)));

        //Handle click event of create ERG button accessibility
        this.own(on(this.CreateERGButton, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._CreateERGButtonClicked();
            this._setFirstLastFocusableNodes();
          }
        })));

        //Handle click event of clear ERG button
        this.own(on(this.ClearERGButton, 'click', lang.hitch(this, function () {
          this.materialType.value = '';
          this.windSpeed.set('disabled', true);
          this.transportContainer.set('disabled', true);
          dojo.addClass(this.table3Container, 'ERGHidden');
          this.useBleve.set('disabled', true);
          this.useBleve.set('checked', false);
          dojo.addClass(this.bleveContainer, 'ERGHidden');
          this.fire.set('checked', false);
          this.tankCapacity.set('disabled', true);
          this._selectedMaterial = null;
          this._clearLayers(true);
        })));

        //Handle click event of clear ERG button for accessibility
        this.own(on(this.ClearERGButton, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this.materialType.value = '';
            this.windSpeed.set('disabled', true);
            this.transportContainer.set('disabled', true);
            domAttr.set(this.windSpeed, 'tabindex', -1);
            domAttr.set(this.transportContainer, 'tabindex', -1);
            dojo.addClass(this.table3Container, 'ERGHidden');
            this.useBleve.set('disabled', true);
            domAttr.set(this.useBleve, 'tabindex', -1);
            this.useBleve.set('checked', false);
            dojo.addClass(this.bleveContainer, 'ERGHidden');
            this.fire.set('checked', false);
            this.tankCapacity.set('disabled', true);
            domAttr.set(this.tankCapacity, 'tabindex', -1);
            this._selectedMaterial = null;
            this._clearLayers(true);
          }
        })));

        //Handle click event of Add ERG draw button
        this.own(on(this.inputControl.dt, 'DrawComplete', lang.hitch(this, this._dt_Complete)));

        //Handle spill size dropdown change
        this.own(on(this.spillSize, 'change', lang.hitch(this, function () {
          if (this._selectedMaterial) {
            if (this._selectedMaterial.TABLE3 && this.spillSize.getValue() === 'LG') {
              new Message({
                message: this.nls.table3Message
              });
              this.windSpeed.set('disabled', false);
              this.transportContainer.set('disabled', false);
              domAttr.set(this.windSpeed, 'tabindex', 0);
              domAttr.set(this.transportContainer, 'tabindex', 0);
              dojo.removeClass(this.table3Container, 'ERGHidden');
              this._resetTransportContainerOptions();
            } else {
              this.windSpeed.set('disabled', true);
              this.transportContainer.set('disabled', true);
              domAttr.set(this.windSpeed, 'tabindex', -1);
              domAttr.set(this.transportContainer, 'tabindex', -1);
              dojo.addClass(this.table3Container, 'ERGHidden');
            }
          }
        })));

        /**
         * Settings panel
         **/
        //Handle click event of settings back button
        this.own(on(this.SettingsPanelBackButton, "click", lang.hitch(this, function () {
          if (this._SettingsInstance.validInputs()) {
            this._SettingsInstance.onClose();
            this._showPanel(this._lastOpenPanel);
          }
        })));

        //Handle click event of settings back button accessibility
        this.own(on(this.SettingsPanelBackButton, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            if (this._SettingsInstance.validInputs()) {
              this._SettingsInstance.onClose();
              this._showPanel(this._lastOpenPanel);
              this._setFirstLastFocusableNodes();
            }
          }
        })));

        /**
         * Publish panel
         **/
        //Handle click event back button
        this.own(on(this.resultsPanelBackButton, "click", lang.hitch(this, function () {
          //remove any messages
          this.publishMessage.innerHTML = '';
          //clear layer name
          this.addERGNameArea.setValue('');
          this._spillLocation.show();
          this._showPanel(this._lastOpenPanel);
        })));

        //Handle click event back button accessibility
        this.own(on(this.resultsPanelBackButton, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            //remove any messages
            this.publishMessage.innerHTML = '';
            //clear layer name
            this.addERGNameArea.setValue('');
            this._spillLocation.show();
            this._showPanel(this._lastOpenPanel);
            this._setFirstLastFocusableNodes();
          }
        })));

        //Handle click event of publish ERG to portal button
        this.own(on(this.ERGAreaBySizePublishERGButton, 'click', lang.hitch(this, function () {
          if (this.publishNewLayer.checked && !this.addERGNameArea.isValid()) {
            // Invalid entry
            this.publishMessage.innerHTML = this.nls.missingLayerNameMessage;
            return;
          }
          var layerName = (this.publishNewLayer.checked) ? this.addERGNameArea.value :
            this.featureLayerList.get("value");
          // Reset to emtpy message
          this.publishMessage.innerHTML = '';
          // Init save to portal
          this._initSaveToPortal(layerName);
        })));

        //Handle click event of publish ERG to portal button accessibility
        this.own(on(this.ERGAreaBySizePublishERGButton, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            if (this.publishNewLayer.checked && !this.addERGNameArea.isValid()) {
              // Invalid entry
              this.publishMessage.innerHTML = this.nls.missingLayerNameMessage;
              this._setFirstLastFocusableNodes();
              return;
            }
            var layerName = (this.publishNewLayer.checked) ? this.addERGNameArea.value :
              this.featureLayerList.get("value");
            // Reset to emtpy message
            this.publishMessage.innerHTML = '';
            // Init save to portal
            this._initSaveToPortal(layerName);
          }
        })));
        // Checkbox listener
        this.own(on(this.publishNewLayer, 'change', lang.hitch(this, this._onCheckboxClicked)));
        // Checkbox listener
        this.own(on(this.publishNewLayer, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._onCheckboxClicked();
          }
          var layerName = (this.publishNewLayer.checked) ? this.addERGNameArea.value :
            this.featureLayerList.options[this.featureLayerList.selectedIndex].value;
          // Reset to emtpy message
          this.publishMessage.innerHTML = '';
          // Init save to portal
          this._initSaveToPortal(layerName);
        })));

        // Checkbox listener
        this.own(on(this.publishNewLayer, 'click', lang.hitch(this, this._onCheckboxClicked)));

        topic.subscribe("moveMap", lang.hitch(this, function () {
          this._moveMap();
        }));
      },

      /**
       * Get panel node from panel name
       **/
      _getNodeByName: function (panelName) {
        var node;
        switch (panelName) {
          case "ergMainPage":
            node = this.ergMainPageNode;
            break;
          case "settingsPage":
            node = this.settingsPageNode;
            break;
          case "resultsPage":
            node = this.resultsPageNode;
            break;
        }
        return node;
      },

      _reset: function () {
        this._clearLayers(true);

        //enable map navigation if disabled due to a tool being in use
        this.map.enableMapNavigation();
      },

      /**
       * If checkbox is checked, clear textbox and allow user to
       * input a new layer name.
       */
      _onCheckboxClicked: function () {
        if (this.publishNewLayer.checked) {
          domClass.add(this.featureLayerList.domNode, 'controlGroupHidden');
          domClass.remove(this.addERGNameArea.domNode, 'controlGroupHidden');
          this.addERGNameArea.reset();
          this.addERGNameArea.focus();
        } else {
          domClass.add(this.addERGNameArea.domNode, 'controlGroupHidden');
          domClass.remove(this.featureLayerList.domNode, 'controlGroupHidden');
        }
        this._addLayerToMap = this.publishNewLayer.checked;
      },

      _clearLayers: function (includeExtentLayer) {
        this.ERGArea.clear();
        //refresh ERG layer to make sure any labels are removed
        this.ERGArea.refresh();
        //sometimes we only want to clear the ERG overlay and not the spill location
        if (includeExtentLayer) {
          dojo.addClass(this.CreateERGButton, 'jimu-state-disabled');
          domAttr.set(this.CreateERGButton, 'tabindex', -1);
          this.inputControl.clear();
          if (this._useWeather) {
            this._weatherInfo._resetWeatherInfo(this._weatherSource, this.nls.weatherIntialText);
          }
        }
      },

      /**
       * Creates settings
       **/
      _createSettings: function () {
        //Create Settings Instance
        this._SettingsInstance = new Settings({
          nls: this.nls,
          config: this.config,
          appConfig: this.appConfig,
          refDomNode: this.domNode
        }, domConstruct.create("div", {}, this.SettingsNode));

        //add a listener for a change in settings
        this.own(this._SettingsInstance.on("settingsChanged",
          lang.hitch(this, function (updatedSettings) {

            var spillLocationFillColor =
              new Color(updatedSettings.spillLocationFillColor.color);
            var spillLocationFillTrans =
              (1 - updatedSettings.spillLocationFillColor.transparency) * 255;
            var spillLocationOutlineColor =
              new Color(updatedSettings.spillLocationOutlineColor.color);
            var spillLocationOutlineTrans =
              (1 - updatedSettings.spillLocationOutlineColor.transparency) * 255;

            var IIZoneFillColor =
              new Color(updatedSettings.IIZoneFillColor.color);
            var IIZoneFillTrans =
              (1 - updatedSettings.IIZoneFillColor.transparency) * 255;
            var IIZoneOutlineColor =
              new Color(updatedSettings.IIZoneOutlineColor.color);
            var IIZoneOutlineTrans =
              (1 - updatedSettings.IIZoneOutlineColor.transparency) * 255;

            var PAZoneFillColor =
              new Color(updatedSettings.PAZoneFillColor.color);
            var PAZoneFillTrans =
              (1 - updatedSettings.PAZoneFillColor.transparency) * 255;
            var PAZoneOutlineColor =
              new Color(updatedSettings.PAZoneOutlineColor.color);
            var PAZoneOutlineTrans =
              (1 - updatedSettings.PAZoneOutlineColor.transparency) * 255;

            var downwindZoneFillColor =
              new Color(updatedSettings.downwindZoneFillColor.color);
            var downwindZoneFillTrans =
              (1 - updatedSettings.downwindZoneFillColor.transparency) * 255;
            var downwindZoneOutlineColor =
              new Color(updatedSettings.downwindZoneOutlineColor.color);
            var downwindZoneOutlineTrans =
              (1 - updatedSettings.downwindZoneOutlineColor.transparency) * 255;

            var fireZoneFillColor =
              new Color(updatedSettings.fireZoneFillColor.color);
            var fireZoneFillTrans =
              (1 - updatedSettings.fireZoneFillColor.transparency) * 255;
            var fireZoneOutlineColor =
              new Color(updatedSettings.fireZoneOutlineColor.color);
            var fireZoneOutlineTrans =
              (1 - updatedSettings.fireZoneOutlineColor.transparency) * 255;

            var bleveZoneFillColor =
              new Color(updatedSettings.bleveZoneFillColor.color);
            var bleveZoneFillTrans =
              (1 - updatedSettings.bleveZoneFillColor.transparency) * 255;
            var bleveZoneOutlineColor =
              new Color(updatedSettings.bleveZoneOutlineColor.color);
            var bleveZoneOutlineTrans =
              (1 - updatedSettings.bleveZoneOutlineColor.transparency) * 255;

            var uvrJson = {
              "type": "uniqueValue",
              "field1": "type",
              "uniqueValueInfos": [{
                "value": this.nls.spillLocationLabel,
                "symbol": {
                  "color": [spillLocationFillColor.r,
                    spillLocationFillColor.g,
                    spillLocationFillColor.b,
                    spillLocationFillTrans
                  ],
                  "outline": {
                    "color": [spillLocationOutlineColor.r,
                      spillLocationOutlineColor.g,
                      spillLocationOutlineColor.b,
                      spillLocationOutlineTrans
                    ],
                    "width": 1,
                    "type": "esriSLS",
                    "style": updatedSettings.spillLocationOutlineColor.type
                  },
                  "type": "esriSFS",
                  "style": updatedSettings.spillLocationFillColor.type
                }
              }, {
                "value": this.nls.IISettingsLabel,
                "symbol": {
                  "color": [IIZoneFillColor.r, IIZoneFillColor.g, IIZoneFillColor.b, IIZoneFillTrans],
                  "outline": {
                    "color": [IIZoneOutlineColor.r,
                      IIZoneOutlineColor.g,
                      IIZoneOutlineColor.b,
                      IIZoneOutlineTrans
                    ],
                    "width": 1,
                    "type": "esriSLS",
                    "style": updatedSettings.IIZoneOutlineColor.type
                  },
                  "type": "esriSFS",
                  "style": updatedSettings.IIZoneFillColor.type
                }
              }, {
                "value": this.nls.PASettingsLabel,
                "symbol": {
                  "color": [PAZoneFillColor.r, PAZoneFillColor.g, PAZoneFillColor.b, PAZoneFillTrans],
                  "outline": {
                    "color": [PAZoneOutlineColor.r,
                      PAZoneOutlineColor.g,
                      PAZoneOutlineColor.b,
                      PAZoneOutlineTrans
                    ],
                    "width": 1,
                    "type": "esriSLS",
                    "style": updatedSettings.PAZoneOutlineColor.type
                  },
                  "type": "esriSFS",
                  "style": updatedSettings.PAZoneFillColor.type
                }
              }, {
                "value": this.nls.downwindSettingsLabel,
                "symbol": {
                  "color": [downwindZoneFillColor.r,
                    downwindZoneFillColor.g,
                    downwindZoneFillColor.b,
                    downwindZoneFillTrans
                  ],
                  "outline": {
                    "color": [downwindZoneOutlineColor.r,
                      downwindZoneOutlineColor.g,
                      downwindZoneOutlineColor.b,
                      downwindZoneOutlineTrans
                    ],
                    "width": 1,
                    "type": "esriSLS",
                    "style": updatedSettings.downwindZoneOutlineColor.type
                  },
                  "type": "esriSFS",
                  "style": updatedSettings.downwindZoneFillColor.type
                }
              }, {
                "value": this.nls.fireSettingsLabel,
                "symbol": {
                  "color": [fireZoneFillColor.r,
                    fireZoneFillColor.g,
                    fireZoneFillColor.b,
                    fireZoneFillTrans
                  ],
                  "outline": {
                    "color": [fireZoneOutlineColor.r,
                      fireZoneOutlineColor.g,
                      fireZoneOutlineColor.b,
                      fireZoneOutlineTrans
                    ],
                    "width": 1,
                    "type": "esriSLS",
                    "style": updatedSettings.fireZoneOutlineColor.type
                  },
                  "type": "esriSFS",
                  "style": updatedSettings.fireZoneFillColor.type
                }
              }, {
                "value": this.nls.bleveSettingsLabel,
                "symbol": {
                  "color": [bleveZoneFillColor.r,
                    bleveZoneFillColor.g,
                    bleveZoneFillColor.b,
                    bleveZoneFillTrans
                  ],
                  "outline": {
                    "color": [bleveZoneOutlineColor.r,
                      bleveZoneOutlineColor.g,
                      bleveZoneOutlineColor.b,
                      bleveZoneOutlineTrans
                    ],
                    "width": 1,
                    "type": "esriSLS",
                    "style": updatedSettings.bleveZoneOutlineColor.type
                  },
                  "type": "esriSFS",
                  "style": updatedSettings.bleveZoneFillColor.type
                }
              }]
            };

            // create a renderer for the ERG layer to override default symbology
            this._renderer = new UniqueValueRenderer(uvrJson);
            this._renderer.removeValue("others");
            this.ERGArea.setRenderer(this._renderer);

            //refresh the layer to apply the settings
            this.ERGArea.refresh();
          })));
        this._SettingsInstance.startup();
      },

      /**
       * Displays selected panel
       **/
      _showPanel: function (currentPanel) {
        var prevNode, currentNode;
        //check if previous panel exist and hide it
        if (this._currentOpenPanel) {
          prevNode = this._getNodeByName(this._currentOpenPanel);
          domClass.add(prevNode, "ERGHidden");
        }
        //get current panel to be displayed and show it
        currentNode = this._getNodeByName(currentPanel);
        domClass.remove(currentNode, "ERGHidden");
        //set the current panel and previous panel
        this._lastOpenPanel = this._currentOpenPanel;
        this._currentOpenPanel = currentPanel;
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
              if (layerNode._layerInfo.layerObject.geometryType === "esriGeometryPolygon") {
                layerList.push(layerNode._layerInfo.layerObject);
              }
            }
          }
        });
        return layerList;
      },

      /**
       * Populates the drop down list of operational layers
       * from the webmap
       */
      _populateSelectList: function (selectNode, layerList, selectedOptionName,
        doSetFeaturesTool, onlyPolygon) {
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
          selectNode.addOption({
            value: layer.name,
            label: utils.sanitizeHTML(layer.name),
            selected: false
          });
        }));

        if (selectedOptionName !== '') {
          selectNode.setValue(selectedOptionName);
        }

        if (doSetFeaturesTool) {
          var layerInfo = array.filter(layerList, lang.hitch(this, function (layer) {
            return selectNode.options[0].value === layer.name;
          }));
          this.selectFeaturesTool.setLayerInfo(layerInfo[0]);
        }
      },

      /**
       * Handle the completion of the draw spill location
       **/
      _dt_Complete: function () {
        // domClass.remove(this.ERGAddPointBtn, 'jimu-edit-active');
        this.inputControl.deactivateDrawTool();
        this.map.enableMapNavigation();
        focusUtils.focus(this.inputControl.drawPointButton);
        if (this._selectedMaterial) {
          dojo.removeClass(this.CreateERGButton, 'jimu-state-disabled');
          domAttr.set(this.CreateERGButton, 'tabindex', 0);
        }
      },

      /**
       * Handle the create ERG button being clicked
       **/
      _CreateERGButtonClicked: function () {
        if (this._selectedMaterial && this.inputControl.getMapCoordinateDD()) {
          var IIAttributeValue, PAAttributeValue, bleveAttributeValue, IIDistance, PADistance;
          var features = [];
          var spatialReference = new SpatialReference({
            wkid: 102100
          });

          //get the spill location
          var spillLocation = WebMercatorUtils.geographicToWebMercator(
            this.inputControl.getMapCoordinateDD());

          // clear any existing ERG overlays
          this._clearLayers(true);

          //check if you need to refer to table 3
          if (this._selectedMaterial.hasOwnProperty("TABLE3") &&
            this._selectedMaterial.TABLE3.toLowerCase() === "yes") {
            //Add size check
            if (this.spillSize.getValue() === 'SM') {
              IIAttributeValue = this.spillSize.getValue() + "_ISO";
              PAAttributeValue = this.spillSize.getValue() + "_" + this.spillTime.getValue();
            } else {
              IIAttributeValue = this.transportContainer.getValue() + "_ISO";
              PAAttributeValue = this.transportContainer.getValue() +
                this.spillTime.getValue() + this.windSpeed.getValue();
            }
          } else {
            IIAttributeValue = this.spillSize.getValue() + "_ISO";
            PAAttributeValue = this.spillSize.getValue() + "_" + this.spillTime.getValue();
          }


          //set the IA and PA distances
          IIDistance = (this._selectedMaterial.hasOwnProperty(IIAttributeValue)) ?
            this._selectedMaterial[IIAttributeValue] : 800;
          PADistance = (this._selectedMaterial.hasOwnProperty(PAAttributeValue)) ?
            this._selectedMaterial[PAAttributeValue] : 1600;

          // determine the initial isolation zone
          var IIZone = new Circle({
            center: spillLocation,
            radius: IIDistance,
            geodesic: true,
            numberOfPoints: 360
          });

          // show BLEVE zone
          if (this.useBleve.checked && this._selectedMaterial.BLEVE) {
            bleveAttributeValue = this.tankCapacity.getValue();
            var bleveZone = GeometryEngine.geodesicBuffer(spillLocation,
              this._selectedMaterial[bleveAttributeValue], 'meters');
            var bleveZoneGraphic = new Graphic(bleveZone);
            bleveZoneGraphic.setAttributes({
              "type": this.nls.bleveSettingsLabel
            });
            features.push(bleveZoneGraphic);
          }

          // show Fire evaction zone
          if (this.fire.checked) {
            var fireZone = GeometryEngine.geodesicBuffer(spillLocation,
              this._selectedMaterial.FIRE_ISO, 'meters');
            var fireZoneGraphic = new Graphic(fireZone);
            fireZoneGraphic.setAttributes({
              "type": this.nls.fireSettingsLabel
            });
            features.push(fireZoneGraphic);
          }

          if (this._selectedMaterial.IDNum === 0 ||
            this._selectedMaterial.BLEVE) {
            // Materials with the word Substances in their title or BLEVE
            // values do not have any PA distances
            // warn the user to this then zoom to the II Zone
            new Message({
              message: this.nls.noPAZoneMessage
            });
          } else {
            // create a circle from the spill location that we can use to calculate
            // the center point that will be used for the Protective Action (PA) Zone
            var PACircle = new Circle({
              center: spillLocation,
              radius: PADistance / 2,
              geodesic: true,
              numberOfPoints: 360
            });

            // Get the center point for the PA Zone (first point of the circle due north)
            var PACenter = PACircle.getPoint(0, 0);

            // Create another circle from this center point, the extent of which will be the PA Zone
            var PAZone = new Circle({
              center: PACenter,
              radius: PADistance / 2,
              geodesic: true
            });

            // get the two bottom corners of the PA Zone - these will be swapped out below
            var PAZoneExtent = PAZone.getExtent();
            var PAPoint1 = new Point(PAZoneExtent.xmin, PAZoneExtent.ymin, spatialReference);
            var PAPoint2 = new Point(PAZoneExtent.xmax, PAZoneExtent.ymin, spatialReference);

            // Compute the "protective action arc" -
            // the arc at the limit of the protective action zone
            var paBuffer = GeometryEngine.geodesicBuffer(spillLocation, PADistance, 'meters');
            var protectiveActionArc = GeometryEngine.intersect(
              paBuffer, Polygon.fromExtent(PAZoneExtent));

            // get the 2 coordinates where the initial isolation zone intersects with
            // the protective action distance
            var iiPoint1 = IIZone.getPoint(0, 270);
            var iiPoint2 = IIZone.getPoint(0, 90);

            // Swap out the two bottom corners to create the fan
            array.forEach(protectiveActionArc.rings[0], lang.hitch(this, function (point, i) {
              if (point[0] === PAPoint1.x && point[1] === PAPoint1.y) {
                protectiveActionArc.setPoint(0, i, iiPoint1);
              } else if (point[0] === PAPoint2.x && point[1] === PAPoint2.y) {
                protectiveActionArc.setPoint(0, i, iiPoint2);
              }
            }));

            var protectiveActionArea = GeometryEngine.difference(protectiveActionArc, IIZone);
            // all geometry so far is orientated north so rotate what we need to the wind direction
            protectiveActionArea = GeometryEngine.rotate(protectiveActionArea,
              this.windDirection.getValue() * -1, spillLocation);
            var PAZoneArea = GeometryEngine.rotate(Polygon.fromExtent(PAZoneExtent),
              this.windDirection.getValue() * -1, spillLocation);

            var PAAGraphic = new Graphic(protectiveActionArea);
            PAAGraphic.setAttributes({
              "type": this.nls.downwindSettingsLabel
            });
            var PAZoneGraphic = new Graphic(PAZoneArea);
            PAZoneGraphic.setAttributes({
              "type": this.nls.PASettingsLabel
            });

            features.push(PAZoneGraphic, PAAGraphic);
          }

          // draw the II Zone
          var IIGraphic = new Graphic(IIZone);
          IIGraphic.setAttributes({
            "type": this.nls.IISettingsLabel
          });
          features.push(IIGraphic);

          // draw a small polygon to show spill location
          var spillLocationPoly = GeometryEngine.geodesicBuffer(spillLocation, 10, 'meters');
          var spillLocationGraphic = new Graphic(spillLocationPoly);
          spillLocationGraphic.setAttributes({
            "type": this.nls.spillLocationLabel
          });
          features.push(spillLocationGraphic);

          this.ERGArea.applyEdits(features, null, null);
          this.map.setExtent(graphicsUtils.graphicsExtent(this.ERGArea.graphics).expand(2), false);
          this._showPanel("resultsPage");
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
          utils.loadStyleLink('darkOverrideCSS', this.folderUrl + "css/dartTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/dartTheme.css", 'css');
        }
        //Check if DashBoardTheme
        if (this.appConfig.theme.name === "DashboardTheme" &&
          this.appConfig.theme.styles[0] === "default") {
          //Load appropriate CSS for dashboard theme
          utils.loadStyleLink('darkDashboardOverrideCSS',
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
        this.inherited(arguments);
        this.map.removeLayer(this._spillLocation);
        this.map.removeLayer(this.ERGArea);
      },

      /**
       * Handle publish ERG to portal
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
              this._setFirstLastFocusableNodes();
              return;
            }
            var checkServiceNameUrl = this.appConfig.portalUrl +
              "sharing/rest/portals/" + orgId + "/isServiceNameAvailable";
            var createServiceUrl = this.appConfig.portalUrl +
              "sharing/content/users/" + userName + "/createService";
            portalutils.isNameAvailable(checkServiceNameUrl, token,
              featureServiceName).then(lang.hitch(this, function (response0) {
              if (response0.available) {
                //set the widget to busy
                this.busyIndicator.show();
                //create the service
                portalutils.createFeatureService(createServiceUrl, token,
                  portalutils.getFeatureServiceParams(featureServiceName,
                    this.map)).then(lang.hitch(this, function (response1) {
                  if (response1.success) {
                    var addToDefinitionUrl = response1.serviceurl.replace(
                      new RegExp('rest', 'g'), "rest/admin") + "/addToDefinition";
                    portalutils.addDefinitionToService(addToDefinitionUrl, token,
                      portalutils.getLayerParams(featureServiceName, this.map,
                        this._renderer)).then(lang.hitch(this,
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

                          // must ensure the layer is loaded before we can access
                          // it to turn on the labels if required
                          var featureLayerInfo;
                          if (newFeatureLayer.loaded) {
                            featureLayerInfo =
                              jimuLayerInfos.getInstanceSync().getLayerInfoById(featureServiceName);
                            featureLayerInfo.enablePopup();
                          } else {
                            newFeatureLayer.on("load", lang.hitch(this, function () {
                              featureLayerInfo =
                                jimuLayerInfos.getInstanceSync().getLayerInfoById(featureServiceName);
                              featureLayerInfo.enablePopup();
                            }));
                          }

                          var newGraphics = [];
                          array.forEach(this.ERGArea.graphics, function (g) {
                            newGraphics.push(new Graphic(g.geometry, null, {
                              type: g.attributes.type
                            }));
                          }, this);
                          newFeatureLayer.applyEdits(newGraphics, null, null).then(
                            lang.hitch(this, function () {
                              this._reset();
                            })).otherwise(lang.hitch(this, function () {
                            this._reset();
                          }));
                          this.busyIndicator.hide();
                          var newURL = '<br /><a role="link" tabindex=0 aria-label="' +
                            this.nls.successfullyPublished + '" href="' +
                            this.appConfig.portalUrl + "home/item.html?id=" +
                            response1.itemId + '" target="_blank">';
                          this.publishMessage.innerHTML =
                            this.nls.successfullyPublished.format(newURL) + '</a>';
                          this._setFirstLastFocusableNodes();
                        }
                      }), lang.hitch(this, function (err2) {
                      this.busyIndicator.hide();
                      this.publishMessage.innerHTML =
                        this.nls.addToDefinition.format(err2.message);
                      this._setFirstLastFocusableNodes();
                    }));
                  } else {
                    this.busyIndicator.hide();
                    this.publishMessage.innerHTML =
                      this.nls.unableToCreate.format(featureServiceName);
                    this._setFirstLastFocusableNodes();
                  }
                }), lang.hitch(this, function (err1) {
                  this.busyIndicator.hide();
                  this.publishMessage.innerHTML =
                    this.nls.createService.format(err1.message);
                  this._setFirstLastFocusableNodes();
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
                    array.forEach(this.ERGArea.graphics, function (g) {
                      newGraphics.push(new Graphic(g.geometry, null, {
                        type: g.attributes.type
                      }));
                    }, this);
                    newFeatureLayer.applyEdits(newGraphics, null, null).then(
                      lang.hitch(this, function () {
                        this._reset();
                      })).otherwise(lang.hitch(this, function () {
                      this._reset();
                    }));
                    //Refesh the feature layer
                    topic.publish("moveMap", false);
                    var newURL = '<br /><a href="' + this.appConfig.portalUrl +
                      "home/item.html?id=" + selectedLayers[0].id + '" target="_blank">';
                    this.publishMessage.innerHTML =
                      this.nls.successfullyPublished.format(newURL) + '</a>';
                  }
                }), lang.hitch(this, function () {
                  this.publishMessage.innerHTML = this.nls.addToDefinition.format(layerName);
                }));
                this._setFirstLastFocusableNodes();
              }
            }), lang.hitch(this, function (err0) {
              this.busyIndicator.hide();
              this.publishMessage.innerHTML = this.nls.checkService.format(err0.message);
              this._setFirstLastFocusableNodes();
            }));
          }), lang.hitch(this, function (err) {
            this.publishMessage.innerHTML = err.message;
            this._setFirstLastFocusableNodes();
          }));
        }));
        esriId.destroyCredentials();
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

      //Function to set and update first and last focus nodes
      _setFirstLastFocusableNodes: function () {
        // if create zones button is clicked
        if (this._currentOpenPanel === "resultsPage") {
          utils.initFirstFocusNode(this.domNode, this.resultsPanelBackButton);
          utils.initLastFocusNode(this.domNode, this.ERGAreaBySizePublishERGButton);
          var linkText = query("a", this.publishMessage)[0];
          if (this.publishMessage.innerHTML !== "" && linkText) {
            utils.initLastFocusNode(this.domNode, this.publishMessage);
            focusUtils.focus(linkText);
          } else if (this.publishMessage.innerHTML === "") {
            focusUtils.focus(this.resultsPanelBackButton);
          }

        }
        // if setting button is clicked
        if (this._currentOpenPanel === "settingsPage") {
          utils.initFirstFocusNode(this.domNode, this.SettingsPanelBackButton);
          focusUtils.focus(this.SettingsPanelBackButton);
          this._SettingsInstance._setLastFocusNode();
        }
        // Code for accessibility: to init first focus node and last focus node
        if (this._currentOpenPanel === "ergMainPage") {
          utils.initFirstFocusNode(this.domNode, this.ERGSettingsButton);
          focusUtils.focus(this.ERGSettingsButton);
          utils.initLastFocusNode(this.domNode, this.ClearERGButton);
        }
      }
    });
  });