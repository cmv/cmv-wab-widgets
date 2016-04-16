///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
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
  "dojo/_base/declare",
  "jimu/BaseWidgetSetting",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/_base/lang",
  "dojo/dom-construct",
  "dojo/query",
  "dojo/on",
  "./SymbolChooserPopup",
  "jimu/dijit/ColorPicker",
  "dojo/_base/Color",
  "jimu/utils",
  "esri/symbols/jsonUtils",
  "jimu/dijit/Message",
  "jimu/dijit/LoadingIndicator",
  "jimu/dijit/Popup",
  "./NetworkServiceChooser",
  "./layerChooserPopup",
  "../utils",
  "jimu/portalUtils",
  "jimu/dijit/GpSource",
  "esri/request",
  'jimu/symbolUtils',
  "jimu/dijit/TabContainer3",
  "dojo/dom-class",
  "dojo/domReady!"
], function (
  declare,
  BaseWidgetSetting,
  _WidgetsInTemplateMixin,
  lang,
  domConstruct,
  query,
  on,
  SymbolChooserPopup,
  ColorPicker,
  Color,
  utils,
  jsonUtils,
  Message,
  LoadingIndicator,
  Popup,
  NetworkServiceChooser,
  LayerChooserPopup,
  appUtils,
  portalUtils,
  GpSource,
  esriRequest,
  symbolUtils,
  TabContainer3,
  domClass
) {
  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-nearme-setting',
    _unitsDetails: {}, // To store unit format
    _searchLayers: [], // Selected search layers
    _loading: null, //loading indicator instance
    _appUtils: null, // Utils widget instance
    _symbolParams: {}, //to store symbol info

    startup: function () {
      this.inherited(arguments);
    },

    postCreate: function () {
      //initialize tabs
      this._initTabs();
      //create object to store standard unit format for buffer distance unit, direction length unit and distance unit
      this._unitsDetails = {
        "miles": {
          "bufferUnit": "UNIT_STATUTE_MILE",
          "routeUnit": "MILES",
          "distanceUnit": "miles",
          "label": this.nls.units.miles.displayText,
          "acronym": this.nls.units.miles.acronym,
          "value": "miles"
        },
        "kilometers": {
          "bufferUnit": "UNIT_KILOMETER",
          "routeUnit": "KILOMETERS",
          "distanceUnit": "kilometers",
          "label": this.nls.units.kilometers.displayText,
          "acronym": this.nls.units.kilometers.acronym,
          "value": "kilometers"
        },
        "meters": {
          "bufferUnit": "UNIT_METER",
          "routeUnit": "METER",
          "distanceUnit": "meters",
          "label": this.nls.units.meters.displayText,
          "acronym": this.nls.units.meters.acronym,
          "value": "meters"
        },
        "feet": {
          "bufferUnit": "UNIT_FOOT",
          "routeUnit": "FEET",
          "distanceUnit": "feet",
          "label": this.nls.units.feet.displayText,
          "acronym": this.nls.units.feet.acronym,
          "value": "feet"
        }
      };
      //set invalid message attribute for default buffer distance input node
      this.defaultBufferDistanceNode.set("invalidMessage", this.nls.errorStrings.bufferErrorString);
      //set invalid message attribute for maximum buffer distance input node
      this.maxBufferDistanceNode.set("invalidMessage", this.nls.errorStrings.bufferErrorString);
      //initialize utils widget
      this._appUtils = new appUtils({ map: this.map });
      //attach 'click' event on add layer button to display popup to select search layers
      this.own(on(this.addLayerButton, 'click', lang.hitch(this, this._showLayerChooserPopup)));

      //Check if routing is not enabled in webmap, then only hide route settings
      if (this.map.webMapResponse.itemInfo.itemData && this.map.webMapResponse
        .itemInfo.itemData.applicationProperties && this.map.webMapResponse
        .itemInfo.itemData.applicationProperties.viewing && this.map.webMapResponse
        .itemInfo.itemData.applicationProperties.viewing.routing &&
        this.map.webMapResponse.itemInfo.itemData.applicationProperties
        .viewing.routing.enabled) {
        domClass.remove(this.routeSettingsNode, "esriCTHidden");
      } else {
        domClass.remove(this.routingDisabledMsg, "esriCTHidden");
      }

      //set previous/default symbol values
      this._createSymbolPicker(this.routeSymbolNode, "routeSymbol",
         "esriGeometryPolyline", this.nls.routeSetting.selectRouteSymbol);
      this._createSymbolPicker(this.pointSymbolNode, "graphicLocationSymbol",
         "esriGeometryPoint", this.nls.searchSetting.selectGraphicLocationSymbol);
      // attach 'click' event on 'set' button to set the route URL and travel mode service URL
      this.own(on(this.onSetBtnClickNode, 'click', lang.hitch(this, this._showRouteChooser)));
      this.own(on(this.travelModeSetBtnNode, 'click', lang.hitch(this,
        this._showGPServiceChooser)));
      //create color picker
      this._createColorPicker();
      //display configuration setting options in UI panel
      this.setConfig();
    },

    /**
    * This function the initializes jimu tab for setting and layout
    * @memberOf widgets/DistrictLookup/setting/Setting
    **/
    _initTabs: function () {
      var layerSettingTab, routeSettingTab, tabs;
      layerSettingTab = {
        title: this.nls.searchSetting.searchSettingTabTitle,
        content: this.searchTabNode
      };
      routeSettingTab = {
        title: this.nls.routeSetting.routeSettingTabTitle,
        content: this.directionTabNode
      };
      tabs = [layerSettingTab, routeSettingTab];
      this.tab = new TabContainer3({
        tabs: tabs
      });
      this.tab.placeAt(this.tabDiv);
    },
    /**
    * This function gets and create config data in config file.
    * @return {object} Object of config
    * @memberOf widgets/NearMe/setting/setting
    **/
    getConfig: function () {
      //validate configured values
      if (!(this._searchLayers && this._searchLayers.length)) {
        this._errorMessage(this.nls.errorStrings.selectLayerErrorString);
        return false;
      }
      // maximum slider value should not be less than equal to 0
      if (Number(this.maxBufferDistanceNode.value) <= 0) {
        this._errorMessage(this.nls.errorStrings.maximumBufferValueGreaterThanZero);
        return false;
      }
      // maximum slider value should not be empty or non negative number
      if (lang.trim(this.maxBufferDistanceNode.displayedValue) === "") {
        this._errorMessage(this.nls.errorStrings.invalidMaximumValue);
        return false;
      } else if (!this.maxBufferDistanceNode.value) {
        this._errorMessage(this.nls.errorStrings.bufferErrorString);
        return false;
      }
      // Buffer slider default value should not be greater than maximum value
      if (Number(this.defaultBufferDistanceNode.value) > Number(this.maxBufferDistanceNode.value)) {
        this._errorMessage(this.nls.errorStrings.defaultValueLessThanMax);
        return false;
      }
      // default slider value should not be less than 0
      if (Number(this.defaultBufferDistanceNode.value) <= 0) {
        this._errorMessage(this.nls.errorStrings.defaultBufferValueGreaterThanZero);
        return false;
      }
      // default slider value for non negative number
      if (lang.trim(this.defaultBufferDistanceNode.displayedValue) ===
        "") {
        this._errorMessage(this.nls.errorStrings.invalidDefaultValue);
        return false;
      } else if (!this.defaultBufferDistanceNode.value) {
        this._errorMessage(this.nls.errorStrings.bufferErrorString);
        return false;
      }
      //set config with current configured options
      this.config = {
        "fontColor": this._fontColorPicker.color.toHex(),
        "searchLayers": this._searchLayers,
        "defaultBufferDistance": Math.round(this.defaultBufferDistanceNode.value),
        "maxBufferDistance": Math.round(this.maxBufferDistanceNode.value),
        "bufferDistanceUnit": this._unitsDetails[this.selectBufferUnitNode.value],
        "routeService": this.routeServiceURLNode.value,
        "travelModeService": this.travelModeServiceURLNode.value,
        "directionLengthUnit": this._unitsDetails[this.directionLengthUnitNode.value],
        "symbols": this._symbolParams
      };
      return this.config;
    },

    /**
    * This function set and update the config data in config file.
    * @return {object} Object of config
    * @memberOf widgets/NearMe/setting/setting
    **/
    setConfig: function () {
      var helperServices = portalUtils.getPortal(this.appConfig.portalUrl)
        .helperServices;
      if (this.config) {
        //set configured color selected in color picker node
        if (this.config.fontColor) {
          this._fontColorPicker.setColor(new Color(this.config.fontColor));
        }
        if (this.config.searchLayers) {
          //set search layers in config UI
          this._setSearchLayersInfo(this.config.searchLayers);
        }
        if (this.config.defaultBufferDistance) {
          //set default buffer distance value
          this.defaultBufferDistanceNode.set("value", this.config.defaultBufferDistance);
        }
        if (this.config.maxBufferDistance) {
          //set maximum distance value
          this.maxBufferDistanceNode.set("value", this.config.maxBufferDistance);
        }
        if (this.config.bufferDistanceUnit) {
          //set buffer distance unit
          this.selectBufferUnitNode.set("value", this.config.bufferDistanceUnit.value);
        }
        if (this.config.directionLengthUnit) {
          //set direction length unit
          this.directionLengthUnitNode.set("value", this.config.directionLengthUnit.value);
        }
        //set the route service url if previously configured
        //else if set it to organizations routing service
        //else set it to AGOL world routing service
        if (this.config.routeService) {
          this.routeServiceURLNode.set("value", this.config.routeService);
        } else if (helperServices && helperServices.route &&
          helperServices.route.url) {
          this.routeServiceURLNode.set("value", helperServices.route.url);
        } else {
          this.routeServiceURLNode.set("value", window.location.protocol +
            "//route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
          );
        }
        //set the travel mode service url if previously configured
        //else if set it to organizations routing utility service
        //else set it to empty as this is optional URL
        if (this.config.travelModeService) {
          this.travelModeServiceURLNode.set("value", this.config.travelModeService);
        } else if (helperServices && helperServices.routingUtilities &&
          helperServices.routingUtilities.url) {
          this.travelModeServiceURLNode.set("value", helperServices.routingUtilities.url);
        } else {
          this.travelModeServiceURLNode.set("value", "");
        }
      }
    },

    /**
    * This function creates symbols in config UI
    * @param {object} symbolNode: contains a symbol chooser node
    * @param {string} symbolType: contains symbol type
    * @param {string} geometryType: contains symbol geometry type
    * @param {string} symbolChooserTitle: contains a symbol chooser popup title
    * @memberOf widgets/NearMe/setting/setting
    **/
    _createSymbolPicker: function (symbolNode, symbolType, geometryType, symbolChooserTitle) {
      var objSymbol, symbolChooserNode, params;
      //if symbol geometry exist
      if (geometryType) {
        objSymbol = {};
        objSymbol.type = utils.getSymbolTypeByGeometryType(geometryType);
        // if symbols parameter available in input parameters then take symbol details
        if (this.config && this.config.symbols) {
          // check whether symbolType info is available in config
          if (this.config.symbols.hasOwnProperty(symbolType)) {
            // fetch selected symbol from config
            objSymbol.symbol = jsonUtils.fromJson(this.config.symbols[symbolType]);
          }
        }
        symbolChooserNode = this._createPreviewContainer(symbolNode);
        //create params to initialize 'symbolchooserPopup' widget
        params = {
          symbolChooserTitle: symbolChooserTitle,
          symbolParams: objSymbol,
          symbolType: symbolType
        };
        //display configured symbol in symbol chooser node
        this._showSelectedSymbol(symbolChooserNode, objSymbol.symbol, symbolType);
        //attach 'click' event on node to display symbol chooser popup
        this.own(on(symbolChooserNode, 'click', lang.hitch(this, function () {
          //set recently selected symbol in symbol chooser popup
          objSymbol.symbol = jsonUtils.fromJson(this._symbolParams[symbolType]);
          this._initSymbolChooserPopup(params, symbolChooserNode);
        })));
      }
    },

    /**
    * Create preview container to display selected symbol
    * @param {object} symbolNode: contains node to display selected graphic symbol
    * @memberOf widgets/NearMe/setting/Setting
    **/
    _createPreviewContainer: function (symbolNode) {
      var tablePreviwText, trPreviewText, tdPreviewText, tdSymbolNode,
        divPreviewText, symbolChooserNode;
      tablePreviwText = domConstruct.create("table", {
        "cellspacing": "0",
        "cellpadding": "0"
      }, symbolNode);
      trPreviewText = domConstruct.create("tr", { "style": "height:30px" }, tablePreviwText);
      tdPreviewText = domConstruct.create("td", {}, trPreviewText);
      divPreviewText = domConstruct.create("div", {
        "innerHTML": this.nls.symbolPickerPreviewText,
        "class": "esriCTSymbolPreviewText"
      }, tdPreviewText);
      tdSymbolNode = domConstruct.create("td", {}, trPreviewText);
      //create content div for symbol chooser node
      symbolChooserNode = domConstruct.create("div", {
        "class": "esriCTSymbolChooserNode"
      }, tdSymbolNode);
      return symbolChooserNode;
    },

    /**
    * Initialize symbol chooser popup widget
    * @param {object} params: contains params to initialize widget
    * @param {object} symbolChooserNode: contains node to display selected graphic symbol
    * @memberOf widgets/NearMe/setting/Setting
    **/
    _initSymbolChooserPopup: function (params, symbolChooserNode) {
      var symbolChooserObj = new SymbolChooserPopup(params);
      //handler for poopup 'OK' button 'click' event
      symbolChooserObj.onOkClick = lang.hitch(this, function () {
        //get selected symbol
        var symbolJson = symbolChooserObj.symbolChooser.getSymbol();
        this._showSelectedSymbol(symbolChooserNode, symbolJson, params.symbolType);
        symbolChooserObj.popup.close();
      });
    },

    /**
    * show selected graphic symbol in symbol chooser node
    * @param {object} symbolChooserNode: contains a symbol chooser node
    * @param {object} symbolJson: contains a json structure for symbol
    * @param {string} symbolType: contains symbol type
    * @member of widgets/NearMe/setting/setting
    **/
    _showSelectedSymbol: function (symbolChooserNode, symbolJson, symbolType) {
      domConstruct.empty(symbolChooserNode);
      if (symbolJson) {
        var symbolNode = symbolUtils.createSymbolNode(symbolJson);
        // if symbol node is not created
        if (!symbolNode) {
          symbolNode = domConstruct.create('div');
        }
        domConstruct.place(symbolNode, symbolChooserNode);
        //store selected symbol in 'symbolParams' object
        this._symbolParams[symbolType] = symbolJson.toJson();
      }
    },

    /**
    * This function creates color picker instance to select font color
    * @memberOf widgets/NearMe/setting/setting
    **/
    _createColorPicker: function () {
      this._fontColorPicker = new ColorPicker(null, domConstruct.create("div", {},
        this.colorPickerNode));
    },

    /**
    * This function create error alert.
    * @param {string} err
    * @memberOf widgets/NearMe/setting/setting
    **/
    _errorMessage: function (err) {
      var errorMessage = new Message({
        message: err
      });
      errorMessage.message = err;
    },

    /**
    * This function used for loading indicator
    * @memberOf widgets/NearMe/setting/setting
    */
    _initLoading: function () {
      var popupContainer;
      this._loading = new LoadingIndicator({
        hidden: true
      });
      popupContainer = query(".widget-setting-popup")[0];
      this._loading.placeAt(popupContainer);
      this._loading.startup();
    },

    /**
    * Creates and show popup to choose travel mode service URL.
    * @memberOf widgets/NearMe/setting/Setting
    */
    _showGPServiceChooser: function () {
      var args = {
        portalUrl: this.appConfig.portalUrl
      },
        gpSource = new GpSource(args),
        popup = new Popup({
          titleLabel: this.nls.routeSetting.travelModeServiceUrl,
          width: 830,
          height: 560,
          content: gpSource
        });

      this.own(on(gpSource, 'ok', lang.hitch(this, function (tasks) {
        if (tasks.length === 0) {
          this._errorMessage(this.nls.routeSetting.invalidTravelmodeServiceUrl);
          return;
        }
        this._validateGPServiceURL(tasks[0].url, popup);
      })));
      this.own(on(gpSource, 'cancel', lang.hitch(this, function () {
        popup.close();
      })));
    },

    /**
    * This function used for querying TravelModes form the configured service url
    * @memberOf widgets/NearMe/settings/Setting
    */
    _validateGPServiceURL: function (gpServiceURL, popup) {
      var args, travelmodeServiceUrl;
      travelmodeServiceUrl = gpServiceURL + "/execute";
      args = {
        url: travelmodeServiceUrl,
        content: {
          f: "json"
        },
        handleAs: "json",
        callbackParamName: "callback"
      };
      esriRequest(args).then(lang.hitch(this, function (response) {
        var i = 0, isValid = false;
        // if response returned from the queried request
        if (response.hasOwnProperty("results")) {
          if (response.results.length > 0) {
            for (i = 0; i < response.results.length; i++) {
              if (response.results[i].hasOwnProperty("paramName")) {
                if (response.results[i].paramName === "supportedTravelModes") {
                  isValid = true;
                  break;
                }
              }
            }
          }
        }
        //if URL is valid travel mode service URL then set in the textBox else show error
        if (isValid) {
          this.travelModeServiceURLNode.set("value", gpServiceURL);
          popup.close();
        } else {
          this._errorMessage(this.nls.routeSetting.invalidTravelmodeServiceUrl);
        }
      }), lang.hitch(this, function () {
        this._errorMessage(this.nls.routeSetting.invalidTravelmodeServiceUrl);
      }));
    },

    /**
    * Set the routing URL.
    * @memberOf widgets/NearMe/setting/setting
    */
    _showRouteChooser: function () {
      var param, networkServiceChooserObj, popup;
      //create parameter object for network analysis chooser
      param = {
        "portalUrl": this.appConfig.portalUrl,
        "nls": this.nls,
        "folderUrl": this.folderUrl
      };
      //initialize network analysis chooser widget
      networkServiceChooserObj = new NetworkServiceChooser(param);
      popup = new Popup({
        titleLabel: this.nls.routeSetting.routeServiceUrl,
        width: 830,
        height: 600,
        content: networkServiceChooserObj
      });
      //display selected route URL in config setting panel on click of 'OK' button
      networkServiceChooserObj.onOkClick = lang.hitch(this, function () {
        //check whether route URL is selected or not
        if (networkServiceChooserObj.selectRouteURL) {
          this.routeServiceURLNode.set('value', networkServiceChooserObj.selectRouteURL);
          popup.close();
        }
      });
      //hide network analysis chooser popup on click of 'cancel' button
      networkServiceChooserObj.onCancelClick = lang.hitch(this, function () {
        popup.close();
      });
    },

    /**
    * show layer selector popup.
    * @memberOf widgets/NearMe/setting/setting
    */
    _showLayerChooserPopup: function () {
      var layerChooserPopup, param;
      param = {
        map: this.map,
        nls: this.nls
      };
      // initialize layer chooser popup widget
      layerChooserPopup = new LayerChooserPopup(param);
      layerChooserPopup.startup();
      //close layer chooser popup on cancel button click
      layerChooserPopup.onCancelClick = lang.hitch(this, function () {
        layerChooserPopup.popup.close();
      });
      //hide layer chooser popup and display selected layers in config UI panel
      layerChooserPopup.onOkClick = lang.hitch(this, function () {
        this._setSearchLayersInfo(layerChooserPopup.searchLayers);
        layerChooserPopup.popup.close();
      });
    },

    /**
    * fetch updated layer data from the webmap
    * @memberOf widgets/NearMe/setting/setting
    */
    _setSearchLayersInfo: function (searchLayers) {
      for (var i = 0; i < searchLayers.length; i++) {
        lang.mixin(searchLayers[i], this._appUtils.getLayerDetailsFromMap(
            searchLayers[i].baseURL, searchLayers[i].layerId));
      }
      this._setSearchLayers(searchLayers);
    },

    /**
    * display selected layers in setting UI
    * @memberOf widgets/NearMe/setting/setting
    */
    _setSearchLayers: function (searchLayers) {
      var i, divLayerList, imgPath, divGeometryIcon;
      this._searchLayers = searchLayers;
      domConstruct.empty(this.layerListNode);
      for (i = 0; i < searchLayers.length; i++) {
        //set geometry icon for layer
        if (searchLayers[i].geometryType === "esriGeometryPoint") {
          imgPath = "point_layer.png";
        } else if (searchLayers[i].geometryType === "esriGeometryPolygon") {
          imgPath = "polygon_layer.png";
        } else if (searchLayers[i].geometryType === "esriGeometryLine") {
          imgPath = "line_layer.png";
        }
        divLayerList = domConstruct.create("div", {
          "class": "esriCTLayerList"
        }, this.layerListNode);
        if (imgPath) {
          divGeometryIcon = domConstruct.create("div", {
            "class": "esriCTGeometryTypeIcon",
            "style": {
              "backgroundImage": "url(" + this.folderUrl + "images/" + imgPath + ")"
            }
          }, divLayerList);
        }
        //create div to display layer title
        domConstruct.create("div", {
          "class": "esriCTLayerListItem",
          "innerHTML": searchLayers[i].title,
          "title": searchLayers[i].title
        }, divLayerList);
      }
    }
  });
});