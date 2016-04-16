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
  "dojo/dom-class",
  "dojo/query",
  "dojo/on",
  "./SymbolChooserPopup",
  "jimu/utils",
  "esri/symbols/jsonUtils",
  "jimu/dijit/Message",
  "jimu/dijit/LoadingIndicator",
  "jimu/dijit/Popup",
  "./NetworkServiceChooser",
  "./LayerChooser",
  "jimu/dijit/GpSource",
  "esri/request",
  "jimu/portalUtils",
  "dojo/dom-style",
  "dojo/_base/array",
  "jimu/dijit/TabContainer3",
  'jimu/symbolUtils',
  "dojo/domReady!"
], function (
  declare,
  BaseWidgetSetting,
  _WidgetsInTemplateMixin,
  lang,
  domConstruct,
  domClass,
  query,
  on,
  SymbolChooserPopup,
  utils,
  jsonUtils,
  Message,
  LoadingIndicator,
  Popup,
  NetworkServiceChooser,
  LayerChooser,
  GpSource,
  esriRequest,
  portalUtils,
  domStyle,
  array,
  TabContainer3,
  symbolUtils
) {
  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-districtlookup-setting',
    UnitsDetails: {},
    _symbolParams: {},
    startup: function () {
      this.inherited(arguments);
    },

    postCreate: function () {
      //initialize tabs
      this._initTabs();
      //set Unit details
      this.UnitsDetails = {
        "MILES": {
          "value": "MILES",
          "label": this.nls.units.miles
        },
        "KILOMETERS": {
          "value": "KILOMETERS",
          "label": this.nls.units.kilometers
        }
      };
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
      this._createSymbolPicker(this.precinctSymbolNode, "precinctSymbol",
         "esriGeometryPolygon", this.nls.layerSetting.selectPrecinctSymbolLabel);
      this._createSymbolPicker(this.routeSymbolNode, "routeSymbol",
         "esriGeometryPolyline", this.nls.routeSetting.selectRouteSymbol);
      this._createSymbolPicker(this.pointSymbolNode, "graphicLocationSymbol",
         "esriGeometryPoint", this.nls.layerSetting.selectGraphicLocationSymbol);
      //handle events
      this.own(on(this.setPrecinctLayerBtnNode, 'click', lang.hitch(
        this,
        this._showLayerChooser)));
      this.own(on(this.onSetBtnClickNode, 'click', lang.hitch(this,
        this._showRouteChooser)));
      this.own(on(this.travelModeSetBtnNode, 'click', lang.hitch(this,
        this._showGPServiceChooser)));
      //set previous/default config
      this.setConfig();
    },

    /**
    * This function the initializes jimu tab for setting and layout
    * @memberOf widgets/DistrictLookup/setting/Setting
    **/
    _initTabs: function () {
      var layerSettingTab, tabs, routeSettingTab;
      layerSettingTab = {
        title: this.nls.layerSetting.layerSettingTabTitle,
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
    * @memberOf widgets/DistrictLookup/setting/Setting
    **/
    getConfig: function () {
      if (!this.precinctLayerInfo) {
        this._errorMessage(this.nls.layerSelector.errorInSelectingPolygonLayer);
        return false;
      }
      if (!this.pollingPlaceLayerInfo) {
        this._errorMessage(this.nls.layerSelector.errorInSelectingRelatedLayer);
        return false;
      }
      this.config = {
        "precinctLayerInfo": this.precinctLayerInfo,
        "pollingPlaceLayerInfo": this.pollingPlaceLayerInfo,
        "routeService": this.routeServiceURLNode.value,
        "travelModeService": this.travelModeServiceURLNode.value,
        "directionLengthUnit": this.UnitsDetails[this.directionLengthUnitNode
          .value],
        "symbols": this._symbolParams
      };
      return this.config;
    },

    /**
    * This function set and update the config data in config file.
    * @return {object} Object of config
    * @memberOf widgets/DistrictLookup/setting/Setting
    **/
    setConfig: function () {
      var helperServices = portalUtils.getPortal(this.appConfig.portalUrl)
        .helperServices;
      if (this.config) {
        if (this.config.precinctLayerInfo && this.config.pollingPlaceLayerInfo) {
          //Update the layerDetails from the current webmap
          this._updateConfig();
          //show the layer details in config popup
          this._setLayerInfos(this.config.precinctLayerInfo, this.config
            .pollingPlaceLayerInfo);
        }
        //set default/previous direction length unit
        if (this.config.directionLengthUnit) {
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
        //else if set it to organizations routing service
        //else set it to empty as it is optional
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
    * This function updates the layer-details of the configured layers from current webmap properties
    * properties such as layerName, layerDefinations, popupInfo get updated.
    * @memberOf widgets/DistrictLookup/setting/Setting
    **/
    _updateConfig: function () {
      //update layer-details for polygon(precinct) layer
      lang.mixin(this.config.precinctLayerInfo,
        this._getLayerDetailsFromMap(this.config.precinctLayerInfo.baseURL,
          this.config.precinctLayerInfo.layerId));
      //update layer-details for related point(polling place) layer
      lang.mixin(this.config.pollingPlaceLayerInfo,
        this._getLayerDetailsFromMap(this.config.pollingPlaceLayerInfo
          .baseURL, this.config.pollingPlaceLayerInfo.layerId));
    },

    /**
    * This function creates symbols in config UI
    * @param {object} symbolNode: contains a symbol chooser node
    * @param {string} symbolType: contains symbol type
    * @param {string} geometryType: contains symbol geometry type
    * @param {string} symbolChooserTitle: contains a symbol chooser popup title
    * @memberOf widgets/DistrictLookup/setting/Setting
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
    * @memberOf widgets/DistrictLookup/setting/Setting
    **/
    _createPreviewContainer: function (symbolNode) {
      var tablePreviwText, trPreviewText, tdPreviewText, tdSymbolNode,
        divPreviewText, symbolChooserNode;
      tablePreviwText = domConstruct.create("table", { "cellspacing": "0",
      "cellpadding":"0"}, symbolNode);
      trPreviewText = domConstruct.create("tr", {"style":"height:30px"}, tablePreviwText);
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
    * @memberOf widgets/DistrictLookup/setting/Setting
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
    * @member of widgets/DistrictLookup/setting/setting
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
    * This function used for loading indicator
    * @memberOf widgets/DistrictLookup/setting/Setting
    */
    _initLoading: function () {
      var popupContainer;
      this.loading = new LoadingIndicator({
        hidden: true
      });
      popupContainer = query(".widget-setting-popup")[0];
      this.loading.placeAt(popupContainer);
      this.loading.startup();
    },

    /**
    * This function create error alert.
    * @param {string} err
    * @memberOf widgets/DistrictLookup/setting/Setting
    **/
    _errorMessage: function (err) {
      var errorMessage = new Message({
        message: err
      });
      errorMessage.message = err;
    },

    /**
    * Creates and show popup to choose travel mode service URL.
    * @memberOf widgets/DistrictLookup/setting/Setting
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
    * @memberOf widgets/DistrictLookup/settings/Setting
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
    * Creates and show popup to choose route URL.
    * @memberOf widgets/DistrictLookup/setting/Setting
    */
    _showRouteChooser: function () {
      var param, networkServiceChooserObj, popup;
      param = {
        "portalUrl": this.appConfig.portalUrl,
        "nls": this.nls,
        "folderUrl": this.folderUrl
      };
      networkServiceChooserObj = new NetworkServiceChooser(param);
      popup = new Popup({
        titleLabel: this.nls.routeSetting.routeServiceUrl,
        width: 830,
        height: 600,
        content: networkServiceChooserObj
      });

      networkServiceChooserObj.onOkClick = lang.hitch(this, function () {
        //check whether route URL is selected or not
        if (networkServiceChooserObj.selectRouteURL) {
          this.routeServiceURLNode.set('value', networkServiceChooserObj.selectRouteURL);
          popup.close();
        }
      });
      networkServiceChooserObj.onCancelClick = lang.hitch(this,
        function () {
          popup.close();
        });
    },

    /**
    * Creates and show popup to choose layers.
    * @memberOf widgets/DistrictLookup/setting/Setting
    */
    _showLayerChooser: function () {
      var param, layerChooser, popup;
      param = {
        "portalUrl": this.appConfig.portalUrl,
        "nls": this.nls,
        "folderUrl": this.folderUrl,
        "map": this.map
      };
      layerChooser = new LayerChooser(param);
      popup = new Popup({
        titleLabel: this.nls.layerSetting.selectLayersLabel,
        width: 830,
        height: 250,
        content: layerChooser
      });
      layerChooser.onCancleClick = lang.hitch(this, function () {
        popup.close();
      });

      layerChooser.onOkClick = lang.hitch(this, function (
        selectedLayerDetails) {
        //set selected layers in display
        this._setLayerInfos(selectedLayerDetails.polygonLayerInfo,
          selectedLayerDetails.relatedLayerInfo);
        popup.close();
      });
    },

    /**
    * Set the configured layer on configuration popup.
    * @memberOf widgets/DistrictLookup/setting/Setting
    */
    _setLayerInfos: function (precinctLayerInfo, pollingPlaceLayerInfo) {
      var i, imgPath, searchLayers = [];
      this.precinctLayerInfo = precinctLayerInfo;
      this.pollingPlaceLayerInfo = pollingPlaceLayerInfo;
      //Show selected layers in UI
      searchLayers.push(precinctLayerInfo);
      searchLayers.push(pollingPlaceLayerInfo);
      domConstruct.empty(this.layerListNode);
      for (i = 0; i < searchLayers.length; i++) {
        if (searchLayers[i].geometryType) {
          if (searchLayers[i].geometryType === "esriGeometryPoint") {
            imgPath = "point_layer.png";
          } else if (searchLayers[i].geometryType ===
            "esriGeometryPolygon") {
            imgPath = "polygon_layer.png";
          } else if (searchLayers[i].geometryType ===
            "esriGeometryLine") {
            imgPath = "line_layer.png";
          }
          var divLayerList = domConstruct.create("div", {
            "class": "esriCTLayerList"
          }, this.layerListNode);
          if (imgPath) {
            var divGeometryIcon = domConstruct.create("div", {
              "class": "esriCTGeometryTypeIcon"
            }, divLayerList);
            domStyle.set(divGeometryIcon, "backgroundImage", "url(" +
              this.folderUrl + "images/" + imgPath + ")");
          }
          domConstruct.create("div", {
            "class": "esriCTLayerListItem",
            "innerHTML": searchLayers[i].title,
            "title": searchLayers[i].title
          }, divLayerList);
        }
      }
    },


    /**
    * This function gets selected layer details from map
    * @return {object} Object of config
    * @memberOf widgets/DistrictLookup/setting/Setting
    **/
    _getLayerDetailsFromMap: function (baseURL, relatedLayerId) {
      var selectedLayer = {};
      //check if valid webmap details
      if (this.map && this.map.webMapResponse && this.map.webMapResponse
        .itemInfo && this.map.webMapResponse.itemInfo.itemData &&
        this.map.webMapResponse.itemInfo.itemData.operationalLayers) {
        //iterate through all operational layers of the webmap and get the required properties
        array.forEach(this.map.webMapResponse.itemInfo.itemData.operationalLayers,
          lang.hitch(this, function (layer) {
            if (layer.layerObject) {
              if (layer.layerType === "ArcGISMapServiceLayer" ||
                layer.layerType === "ArcGISTiledMapServiceLayer") {
                if (baseURL.substring(0, baseURL.length - 1) ===
                  layer.url) {
                  array.forEach(layer.resourceInfo.layers, lang.hitch(
                    this,
                    function (subLayer) {
                      if (subLayer.id === parseInt(
                          relatedLayerId, 10)) {
                        selectedLayer.title = subLayer.name;
                        return;
                      }
                    }));
                  array.forEach(layer.layers, lang.hitch(this,
                    function (subLayer) {
                      if (subLayer.id === parseInt(
                          relatedLayerId, 10)) {
                        if (subLayer.name) {
                          selectedLayer.title = subLayer.name;
                        }
                        selectedLayer.popupInfo = subLayer.popupInfo;
                        //set layer's definitionExpression
                        if (subLayer.layerDefinition &&
                          subLayer.layerDefinition.definitionExpression
                        ) {
                          selectedLayer.definitionExpression =
                            subLayer.layerDefinition.definitionExpression;
                        }
                        return;
                      }
                    }));
                }
              } else {
                //check if layer url matches
                if (layer.url.replace(/.*?:\/\//g, "") === (
                    baseURL + relatedLayerId).replace(/.*?:\/\//g,
                    "")) {
                  selectedLayer.title = layer.title;
                  selectedLayer.popupInfo = layer.popupInfo;
                  //set layer's definitionExpression
                  if (layer.layerDefinition && layer.layerDefinition
                    .definitionExpression) {
                    selectedLayer.definitionExpression = layer.layerDefinition
                      .definitionExpression;
                  }
                  return;
                }
              }
            }
          }));
      }
      return selectedLayer;
    }
  });
});