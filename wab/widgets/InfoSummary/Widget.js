///////////////////////////////////////////////////////////////////////////
// Copyright 2015 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
/*jshint loopfunc: true */
define(['jimu/BaseWidget',
'jimu/LayerInfos/LayerInfos',
'jimu/utils',
'dojo/dom',
'dojo/dom-class',
'dojo/dom-construct',
'dojo/on',
'dojo/dom-style',
'dojo/_base/declare',
'dojo/_base/lang',
'dojo/_base/html',
'dojo/_base/Color',
'dojo/promise/all',
'dojo/_base/array',
'dojo/query',
"dojox/gfx/fx",
'dojox/gfx',
'dojo/_base/xhr',
'dijit/_WidgetsInTemplateMixin',
'esri/graphic',
'esri/geometry/Point',
'esri/symbols/SimpleMarkerSymbol',
'esri/symbols/SimpleLineSymbol',
'esri/symbols/SimpleFillSymbol',
'esri/Color',
'esri/tasks/query',
'esri/tasks/QueryTask',
"esri/tasks/FeatureSet",
"esri/arcgis/utils",
'esri/symbols/jsonUtils',
"esri/renderers/SimpleRenderer",
"esri/renderers/jsonUtils",
'./js/ClusterLayer',
'./js/ThemeColorManager',
'./js/LayerVisibilityManager',
'esri/layers/LayerDrawingOptions'
],
function (BaseWidget,
  LayerInfos,
  utils,
  dom,
  domClass,
  domConstruct,
  on,
  domStyle,
  declare,
  lang,
  html,
  dojoColor,
  all,
  array,
  query,
  fx,
  gfx,
  xhr,
  _WidgetsInTemplateMixin,
  Graphic,
  Point,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  Color,
  Query,
  QueryTask,
  FeatureSet,
  arcgisUtils,
  jsonUtils,
  SimpleRenderer,
  jsonUtil,
  ClusterLayer,
  ThemeColorManager,
  LayerVisibilityManager,
  LayerDrawingOptions
  ) {
  return declare([BaseWidget, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-InfoSummary',

    name: "InfoSummary",
    opLayers: null,
    opLayerInfos: null,
    layerList: {},
    UNIQUE_APPEND_VAL_CL: "_CL",
    widgetChange: false,
    layerVisibilityManager: null,
    refreshInterval: 0,
    refreshIntervalValue: 0,
    configLayerInfos: [],
    queryLookupList: [],
    legendNodes: [],
    currentQueryList: [],
    symbols: [],

    postCreate: function () {
      this.inherited(arguments);
      this.configLayerInfos = this.config.layerInfos;
      this.queryLookupList = [];
      this.layerList = {};
      this.initialLoad = true;
      //populates this.opLayers from this.map and creates the panel
      this._initWidget();
    },

    startup: function () {
      this.inherited(arguments);
      this.mapExtentChangedHandler = this.map.on("extent-change", lang.hitch(this, this._mapExtentChange));
      this._mapExtentChange();
    },

    onOpen: function () {
      this.widgetChange = false;

      this._updatePanelHeader();

      if (this.appConfig.theme.styles && this.appConfig.theme.styles[0]) {
        this._updateStyleColor(this.appConfig.theme.styles[0]);
      }

      if (typeof (this.mapExtentChangedHandler) === 'undefined') {
        this.mapExtentChangedHandler = this.map.on("extent-change", lang.hitch(this, this._mapExtentChange));
        this._mapExtentChange();
      }

      ////helps turn on/off layers when the widget is opened and closed
      this.layerVisibilityManager = new LayerVisibilityManager({
        map: this.map,
        configLayerList: this.layerList,
        parent: this
      });

      //if refresh is enabled set refereshInterval on any widget source layers with refresh set to true
      //and call setInterval to refresh the static graphics
      if (this.config.refreshEnabled) {
        this.enableRefresh();
      }

      this.map.infoWindow.highlight = true;

      //update the renderer for the layer in the layer list if a new one has been defined
      for (var key in this.layerList) {
        var layerListLayer = this.layerList[key];
        var li = layerListLayer.li;
        var lo = layerListLayer.layerObject;
        if (li && li.orgRenderer) {
          if (lo.setRenderer) {
            lo.setRenderer(li.newRenderer);
          } else if (lo.setLayerDrawingOptions) {
            var optionsArray = [];
            var drawingOptions = new LayerDrawingOptions();
            drawingOptions.renderer = li.newRenderer;
            optionsArray[li.subLayerId] = drawingOptions;
            lo.setLayerDrawingOptions(optionsArray);
          } else {
            console.log("Error setting the new renderer...will use the default rendering of the layer");
          }
          lo.refresh();
        }

        if (lo) {
          if (typeof (lo.visible) !== 'undefined') {
            if (!lo.visible) {
              if (domClass.contains("recIcon_" + key, "active")) {
                domClass.remove("recIcon_" + key, "active");
              }
            } else {
              if (!domClass.contains("recIcon_" + key, "active")) {
                domClass.add("recIcon_" + key, "active");
              }
            }
          }
        }
      }
    },

    enableRefresh: function () {
      //set refreshItereval on all widget source layers that support it
      var layerListLayer = null;
      var checkedTime = false;
      for (var key in this.layerList) {
        layerListLayer = this.layerList[key];
        if (layerListLayer.type !== "ClusterLayer") {
          if (!checkedTime && layerListLayer.li) {
            if (layerListLayer.li.itemId) {
              arcgisUtils.getItem(layerListLayer.li.itemId).then(lang.hitch(this, this._updateItem));
              checkedTime = true;
            }
          }

          layerListLayer = layerListLayer.layerObject;
        } else {
          var id;
          if (layerListLayer.li) {
            id = layerListLayer.li.id;
          } else if (layerListLayer.id) {
            id = layerListLayer.id;
          }

          for (var i = 0; i < this.opLayers.length; i++) {
            var l = this.opLayers[i];
            if (l.layerObject) {
              layerListLayer = l.layerObject;
              break;
            }
          }
        }
        if (layerListLayer) {
          layerListLayer.refreshInterval = this.config.refreshInterval;
        }
      }

      var tempVal = this.config.refreshInterval * 60000;
      if (this.refreshInterval === 0 && this.refreshIntervalValue === 0) {
        //set the refresh interval based on the configs interval value
        this.refreshIntervalValue = tempVal;
        this.refreshInterval = setInterval(lang.hitch(this, this.refreshLayers), (this.refreshIntervalValue));
      } else if (this.refreshIntervalValue !== 0 && (this.refreshIntervalValue !== tempVal)) {
        //clear and update the refresh interval if the configs refresh interval has changed
        this.refreshIntervalValue = tempVal;
        clearInterval(this.refreshInterval);
        this.refreshInterval = 0;
        this.refreshInterval = setInterval(lang.hitch(this, this.refreshLayers), (this.refreshIntervalValue));
      }
    },

    _updatePanelTime: function (modifiedTime) {
      var dFormat = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      this.lastUpdated.innerHTML = "<div></div>";
      this.lastUpdated.innerHTML = new Date(modifiedTime).toLocaleDateString(navigator.language, dFormat);
    },

    refreshLayers: function () {
      for (var key in this.layerList) {
        var lyr = this.layerList[key];
        var id;
        if (lyr.li && lyr.li.itemId) {
          id = lyr.li.itemId;
        } else if (lyr.layerObject.itemId) {
          id = lyr.layerObject.itemId;
        }

        if (id) {
          if (this.currentQueryList.indexOf(id) === -1) {
            this.currentQueryList.push(id);
            arcgisUtils.getItem(id).then(lang.hitch(this, this._updateItem));
          }
        }
      }
    },

    _updateItem: function (response) {
      var update = true;
      if (this.lastModifiedTime) {
        update = this.lastModifiedTime < response.item.modified;
      }
      if (update) {
        this._updatePanelTime(response.item.modified);
        console.log(response);
        var featureCollection = response.itemData;
        for (var i = 0; i < featureCollection.layers.length; i++) {
          this._updateLayerItem(featureCollection.layers[i], response.item.modified);
        }
      }
      this.currentQueryList.splice(this.currentQueryList.indexOf(response.item.id), 1);
      this.lastModifiedTime = response.item.modified;
    },

    _updateLayerItem: function (responseLayer) {
      var layerListLayer;
      var parentLayer;
      for (var k in this.layerList) {
        if (this.layerList[k].pl && this.layerList[k].pl.layerDefinition) {
          if (this.layerList[k].pl.layerDefinition.name === responseLayer.layerDefinition.name) {
            layerListLayer = this.layerList[k];
            parentLayer = layerListLayer.pl;
            break;
          }
        } else if (this.layerList[k].layerObject._parentLayer) {
          if (this.layerList[k].layerObject._parentLayer.name === responseLayer.layerDefinition.name) {
            this.layerList[k].layerObject.refreshFeatures(responseLayer);
            if (this.layerList[k].layerObject) {
              this._loadList(this.layerList[k], true);
            }
            //break;
          }
        }
      }

      if (responseLayer && parentLayer) {
        var responseFeatureSetFeatures = responseLayer.featureSet.features;
        var mapFeatureSetFeatures = parentLayer.featureSet.features;

        //var transform;
        //if (responseLayer.featureSet.transform) {
        //  transform = responseLayer.featureSet.transform;
        //  //var fs = new FeatureSet(JSON.stringify(responseLayer.featureSet.features));
        //}

        var shouldUpdate = true;
        //TODO Figure out a better test for larger responses
        if (responseFeatureSetFeatures.length < 10000) {
          shouldUpdate = JSON.stringify(mapFeatureSetFeatures) !== JSON.stringify(responseFeatureSetFeatures);
        }

        if (shouldUpdate) {
          parentLayer.layerObject.clear();
          var sr = layerListLayer.layerObject.spatialReference;
          for (var j = 0; j < responseFeatureSetFeatures.length; j++) {
            var item = responseFeatureSetFeatures[j];
            if (item.geometry) {
              //check li for renderer also
              var go = this.getGraphicOptions(item, sr, layerListLayer.layerObject.renderer);
              var gra = new Graphic(go);
              gra.setSymbol(go.symbol);
              gra.setAttributes(item.attributes);
              if (this._infoTemplate) {
                gra.setInfoTemplate(this._infoTemplate);
              }
              parentLayer.layerObject.add(gra);
            } else {
              console.log("Null geometry skipped");
            }
          }
          layerListLayer.layerObject.refresh();
          parentLayer.layerObject.refresh();
          parentLayer.featureSet.features = responseFeatureSetFeatures;
          this.countFeatures(layerListLayer.layerObject, layerListLayer.node);
          if (layerListLayer.layerObject) {
            this._loadList(layerListLayer, true);
          }
        }
      }
    },

    getGraphicOptions: function (item, sr, renderer) {
      var graphicOptions;
      if (typeof (item.geometry.rings) !== 'undefined') {
        graphicOptions = {
          geometry: {
            rings: item.geometry.rings,
            "spatialReference": { "wkid": sr.wkid }
          }
        };
      } else if (typeof (item.geometry.paths) !== 'undefined') {
        graphicOptions = {
          geometry: {
            paths: item.geometry.paths,
            "spatialReference": { "wkid": sr.wkid }
          }
        };
      } else {
        graphicOptions = {
          geometry: new Point(item.geometry.x, item.geometry.y, item.geometry.spatialReference),
          symbol: renderer.symbol
        };
      }
      return graphicOptions;
    },

    _initWidget: function () {
      if (this.map.itemId) {
        LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function (operLayerInfos) {
            if (parseFloat(this.appConfig.wabVersion) >= 2.1) {
              this.supportsFilter = true;
            } else {
              this.supportsFilter = false;
            }
            this.opLayers = operLayerInfos._operLayers;
            this.opLayerInfos = operLayerInfos._layerInfos;
            this._createPanelUI(this.configLayerInfos, operLayerInfos);
            if (this.supportsFilter) {
              this._addFilterChanged(operLayerInfos);
            }
          }));
      }
    },

    _addFilterChanged: function(layerInfos){
      layerInfos.on('filterChanged', lang.hitch(this, function (changedLayerInfoArray) {
        array.forEach(changedLayerInfoArray, lang.hitch(this, function (layerInfo) {
          var id = layerInfo.id;
          var clId = layerInfo.id + this.UNIQUE_APPEND_VAL_CL;
          if (this.layerList.hasOwnProperty(id)) {
            this.layerList[id].filter = layerInfo.getFilter();
          } else if (this.layerList.hasOwnProperty(clId)) {
            this.layerList[clId].filter = layerInfo.getFilter();
          }
        }));
      }));
    },

    _updatePanelHeader: function () {
      this.pageLabel.innerHTML = utils.stripHTML(this.label);
      domStyle.set(this.pageLabel, "display", "block");
      var panelTitle;
      var w = this.map.width;
      if (this.config.displayPanelIcon && w > 750) {
        if (this.pageHeader) {
          html.removeClass(this.pageHeader, "pageHeaderNoIcon");
          html.removeClass(this.pageHeader, "pageHeaderNoIconRefresh");
          html.addClass(this.pageHeader, "pageHeader");
        }

        if (this.pageBody) {
          html.removeClass(this.pageBody, "pageBodyNoIcon");
          html.removeClass(this.pageBody, "pageBodyNoIconRefresh");
          html.addClass(this.pageBody, "pageBody");
        }

        if (this.pageTitle) {
          html.addClass(this.pageTitle, "pageTitleWidth");
        }

        panelTitle = this.config.mainPanelText;
        if (typeof (panelTitle) === 'undefined') {
          panelTitle = "";
        }
        this.pageTitle.innerHTML = panelTitle;
        this.panelMainIcon.innerHTML = this.config.mainPanelIcon;
      } else if (!this.config.displayPanelIcon && !this.config.refreshEnabled) {
        if (this.pageHeader) {
          html.removeClass(this.pageHeader, "pageHeader");
          html.removeClass(this.pageHeader, "pageHeaderNoIconRefresh");
          html.addClass(this.pageHeader, "pageHeaderNoIcon");
        }

        if (this.pageBody) {
          html.removeClass(this.pageBody, "pageBody");
          html.removeClass(this.pageBody, "pageBodyNoIconRefresh");
          html.addClass(this.pageBody, "pageBodyNoIcon");
        }
        this.pageTitle.innerHTML = "<div></div>";
        this.panelMainIcon.innerHTML = "<div></div>";
      } else if (!this.config.displayPanelIcon && this.config.refreshEnabled) {
        if (this.pageHeader) {
          html.removeClass(this.pageHeader, "pageHeader");
          html.removeClass(this.pageHeader, "pageHeaderNoIcon");
          html.addClass(this.pageHeader, "pageHeaderNoIconRefresh");
        }

        if (this.pageBody) {
          html.removeClass(this.pageBody, "pageBody");
          html.removeClass(this.pageBody, "pageBodyNoIcon");
          html.addClass(this.pageBody, "pageBodyNoIconRefresh");
        }

        if (this.pageTitle) {
          html.removeClass(this.pageTitle, "pageTitleWidth");
        }
        this.pageTitle.innerHTML = "<div></div>";
        this.panelMainIcon.innerHTML = "<div></div>";
      } else if (this.config.displayPanelIcon && w <= 750 && this.config.refreshEnabled) {
        if (this.pageHeader) {
          html.removeClass(this.pageHeader, "pageHeaderNoIcon");
          html.removeClass(this.pageHeader, "pageHeaderNoIconRefresh");
          html.removeClass(this.pageHeader, "pageHeader");
          html.addClass(this.pageHeader, "pageHeaderRefresh");
        }

        if (this.pageBody) {
          html.removeClass(this.pageBody, "pageBodyNoIcon");
          html.removeClass(this.pageBody, "pageBodyNoIconRefresh");
          html.removeClass(this.pageBody, "pageBody");
          html.addClass(this.pageBody, "pageBodyRefresh");
        }

        if (this.pageTitle) {
          html.addClass(this.pageTitle, "pageTitleWidth");
        }

        panelTitle = this.config.mainPanelText;
        if (typeof (panelTitle) === 'undefined') {
          panelTitle = "";
        }
        this.pageTitle.innerHTML = panelTitle;
      }
    },

    _createPanelUI: function (configLayerInfos, jimuLayerInfos) {
      this.numClusterLayers = 0;

      this._updatePanelHeader();

      this._updateUI(null);
      this._clearChildNodes(this.pageMain);
      this.updateEnd = [];
      for (var i = 0; i < configLayerInfos.length; i++) {
        var lyrInfo = configLayerInfos[i];
        if (lyrInfo.symbolData.clusterType === 'ThemeCluster') {
          this.updateThemeClusterSymbol(lyrInfo, i);
        }
        var jimuLayerInfo = jimuLayerInfos.getLayerInfoById(lyrInfo.id);
        this._createLayerListItem(lyrInfo, jimuLayerInfo);
      }
      domConstruct.create("div", {
        'class': "expandArrow"
      }, this.pageMain);

      for (var k in this.layerList) {
        var lyr = this.layerList[k];
        if (lyr.type !== "ClusterLayer") {
          this.updateEnd.push(this.own(on(lyr.layerObject, "update-end", lang.hitch(this, this.onUpdateEnd))));
        }
      }

      this.addMapLayers();

      this.legendNodes.push({
        node: this.pageHeader,
        styleProp: "background-color"
      });

      this.themeColorManager = new ThemeColorManager({
        updateNodes: this.legendNodes,
        layerList: this.layerList,
        theme: this.appConfig.theme,
        stylename: this.styleName
      });
    },

    updateThemeClusterSymbol: function(lyrInfo, i){
      var sd = lyrInfo.symbolData;
      if (this.appConfig.theme.styles && this.appConfig.theme.styles[0]) {
        if (typeof (this._styleColor) === 'undefined') {
          this._updateStyleColor(this.appConfig.theme.styles[0]);
        }
      }
      if (this._styleColor) {
        var _rgb = dojoColor.fromHex(this._styleColor);
        var x = i + 1;
        var xx = x > 0 ? x * 30 : 30;
        var evenOdd = x % 2 === 0;
        var r = _rgb.r;
        var g = _rgb.g;
        var b = _rgb.b;

        var rr = r - xx;
        if (evenOdd) {
          if (rr > 255) {
            rr = rr - 255;
          }
          else if (rr < 0) {
            rr = rr + 255;
          }
        }

        var bb = b - xx;
        if (x % 3 === 0) {
          if (evenOdd) {
            if (bb > 255) {
              bb = bb - 255;
            }
            else if (bb < 0) {
              bb = bb + 255;
            }
          }
        }

        var gg = g - xx;
        if (x % 5 === 0) {
          if (evenOdd) {
            if (gg > 255) {
              gg = gg - 255;
            }
            else if (gg < 0) {
              gg = gg + 255;
            }
          }
        }
        sd.clusterType = 'CustomCluster';
        sd.clusterSymbol = {
          color: [rr, gg, bb, 1],
          outline: {
            color: [0, 0, 0, 0],
            width: 0,
            type: "esriSLS",
            style: "esriSLSNull"
          },
          type: "esriSFS",
          style: "esriSFSSolid"
        };
      }
    },

    _createLayerListItem: function (lyrInfo, jimuLayerInfo) {
      var layerTypes = ["ArcGISFeatureLayer", "KML", "ArcGISStreamLayer", "CSV", "GeoRSS"];
      for (var ii = 0; ii < this.opLayers.length; ii++) {
        var layer = this.opLayers[ii];
        if (layer.id === lyrInfo.id || layer.id === lyrInfo.parentLayerID) {
          if (layer.layerType === "ArcGISMapServiceLayer") {
            var l = this._getSubLayerByURL(lyrInfo.id);
            if (typeof (l) !== 'undefined') {
              this.updateLayerList(l, lyrInfo, "Feature Layer", jimuLayerInfo);
              break;
            }
          } else if (layerTypes.indexOf(layer.layerType) > -1 ||
            typeof (layer.layerType) === 'undefined') {
            if (layer.layerObject && layer.id === lyrInfo.id) {
              this.updateLayerList(layer, lyrInfo, "Feature Layer", jimuLayerInfo);
              break;
            } else if (layer.featureCollection) {
              for (var iii = 0; iii < layer.featureCollection.layers.length; iii++) {
                var lyr = layer.featureCollection.layers[iii];
                if (lyr.id === lyrInfo.id || layer.id === lyrInfo.id) {
                  this.updateLayerList(lyr, lyrInfo, "Feature Collection", jimuLayerInfo);
                  break;
                }
              }
            } else if (layer.layerObject && layer.id === lyrInfo.parentLayerID) {
              var featureLayers;
              var lType;
              if (layer.type === "GeoRSS") {
                lType = "GeoRSS";
                featureLayers = layer.layerObject.getFeatureLayers();
              } else if (layer.type === "KML") {
                lType = "KML";
                featureLayers = layer.layerObject.getLayers();
              }
              if (featureLayers) {
                for (var k = 0; k < featureLayers.length; k++) {
                  var subLayer = featureLayers[k];
                  if (subLayer.id === lyrInfo.id) {
                    this.updateLayerList(subLayer, lyrInfo, lType, jimuLayerInfo);
                    break;
                  }
                }
              }
            }
          }
        }
      }
    },

    removeOldClusterLayers: function (lInfos) {
      //check if the widget was previously configured
      // with a layer that it no longer consumes...if so remove it
      var deleteLayers = [];
      layer_list_loop:
      for (var l in this.layerList) {
        var f = false;
        layer_info_loop:
        for (var i = 0; i < lInfos.length; i++) {
          var lo = lInfos[i];
          var potentialNewClusterID = lo.id + this.UNIQUE_APPEND_VAL_CL;
          if (potentialNewClusterID === l) {
            deleteLayers.push(l);
            f = true;
            break layer_info_loop;
          }
        }
        if (f) {
          if (this.map.graphicsLayerIds.indexOf(l) > -1) {
            this.map.removeLayer(this.layerList[l].layerObject);
          }
        }
      }
      if (deleteLayers.length > 0) {
        for (var dl in deleteLayers) {
          if (this.layerList.hasOwnProperty(deleteLayers[dl])) {
            this.layerList[deleteLayers[dl]].layerObject.destroy();
            delete this.layerList[deleteLayers[dl]];
          }
        }
      }
    },

    addMapLayers: function () {
      //var reorderLayers = [];
      var ids = Object.keys(this.layerList).reverse();
      for (var i = 0; i < ids.length; i++) {
        var l = this.layerList[ids[i]];
        if (l.type && l.type === "ClusterLayer") {
          this.map.addLayer(l.layerObject);
          //temp = l.layerObject._parentLayer;
          //temp.setVisibility(true);
          //this.own(on(temp, "update-end", lang.hitch(this, this.onUpdateEnd)));
        }
        //reorderLayers.push(l.layerObject);
      }
      //if (reorderLayers.length > 0) {
      //  array.forEach(reorderLayers, lang.hitch(this, function (lyr) {
      //    this.map.reorderLayer(lyr, ids.indexOf(lyr.id));
      //  }));
      //}
      //reorderLayers = null;
    },

    _getSubLayerByURL: function (id) {
      var n = null;
      for (var i = 0; i < this.opLayerInfos.length; i++) {
        var OpLyr = this.opLayerInfos[i];
        if (OpLyr.newSubLayers.length > 0) {
          n = this._recurseOpLayers(OpLyr.newSubLayers, id);
          if (n) {
            break;
          }
        }
      }
      return n;
    },

    _recurseOpLayers: function (pNode, id) {
      for (var i = 0; i < pNode.length; i++) {
        var Node = pNode[i];
        if (Node.newSubLayers.length > 0) {
          this._recurseOpLayers(Node.newSubLayers, id);
        } else {
          if (Node.id === id) {
            return Node;
          }
        }
      }
    },

    updateLayerList: function (lyr, lyrInfo, lyrType, jimuLayerInfo) {
      var l = null;
      var ll = null;
      var id = null;
      var _id = null;
      var _lo = lyrInfo.layerObject ? lyrInfo.layerObject : lyr;
      var originOperLayer = _lo && _lo.originOperLayer ? _lo.originOperLayer : lyr;
      var infoTemplate = this._getInfoTemplate(originOperLayer);
      if (lyr.layerType === "ArcGISFeatureLayer") {
        if (lyrInfo.symbolData.clusteringEnabled) {
          l = this._getClusterLayer(lyrInfo, lyr, jimuLayerInfo, lyrType);
          this.layerList[l.id] = {
            type: "ClusterLayer",
            layerObject: l,
            visible: true,
            id: l.id,
            li: lyrInfo,
            filter: this.supportsFilter && jimuLayerInfo ? jimuLayerInfo.getFilter() : "1=1",
            infoTemplate: infoTemplate
          };
          this.own(on(l, "update-end", lang.hitch(this, function() {
            this._loadList(this.layerList[l.id], true);
          })));
          this.numClusterLayers += 1;
        } else {
          if (lyr.parentLayerInfo) {
            if (lyr.parentLayerInfo.layerObject) {
              ll = lyr.parentLayerInfo.layerObject;
              id = lyrInfo.id;
            }
          }
          l = lyr.layerObject;
          _id = id ? id : lyrInfo.id;
          this.layerList[_id] = {
            type: ll ? lyrType : l.type,
            layerObject: ll ? ll : l,
            visible: true,
            pl: lyr,
            li: lyrInfo,
            filter: this.supportsFilter && jimuLayerInfo ? jimuLayerInfo.getFilter() : "1=1",
            infoTemplate: infoTemplate
          };
          this.updateRenderer(_id);
        }
      } else if (lyr.layerType === "ArcGISStreamLayer") {
        l = lyr.layerObject;
        this.layerList[l.id] = {
          type: "StreamLayer",
          layerObject: l,
          visible: true,
          id: l.id,
          filter: this.supportsFilter && jimuLayerInfo ? jimuLayerInfo.getFilter() : "1=1",
          infoTemplate: infoTemplate
        };
      } else {
        //These are the ones that are not marked as ArcGISFeatureLayer
        if (lyrInfo.symbolData.clusteringEnabled) {
          l = this._getClusterLayer(lyrInfo, lyr, jimuLayerInfo, lyrType);
          this.layerList[l.id] = {
            type: "ClusterLayer",
            layerObject: l,
            visible: true,
            id: l.id,
            li: lyrInfo,
            filter: this.supportsFilter && jimuLayerInfo ? jimuLayerInfo.getFilter() : "1=1",
            infoTemplate: infoTemplate
          };
          this.own(on(l, "update-end", lang.hitch(this, function() {
            this._loadList(this.layerList[l.id], true);
          })));
          this.numClusterLayers += 1;
        } else {
          if (lyr.parentLayerInfo) {
            if (lyr.parentLayerInfo.layerObject) {
              ll = lyr.parentLayerInfo.layerObject;
              if (ll.visibleLayers) {
                id = lyr.id;
              } else {
                id = ll.id;
              }
            }
          }
          l = lyr.layerObject;
          _id = id ? id : lyr.id;
          this.layerList[_id] = {
            type: ll ? lyrType : l ? l.type : lyrType,
            layerObject: ll ? ll : l ? l : lyr,
            visible: true,
            pl: lyr,
            li: lyrInfo,
            filter: this.supportsFilter && jimuLayerInfo ? jimuLayerInfo.getFilter() : "1=1",
            infoTemplate: infoTemplate
          };
          this.updateRenderer(_id);
        }
      }

      this._addPanelItem(ll ? ll : l ? l : lyr, lyrInfo);
    },

    updateRenderer: function (id) {
      var l = this.layerList[id];
      if (l.li.symbolData.symbolType !== 'LayerSymbol') {
        if (typeof (l.li.orgRenderer) === 'undefined') {
          if (l.layerObject.renderer) {
            l.li.orgRenderer = l.layerObject.renderer;
          } else {
            l.li.orgRenderer = l.li.renderer;
          }
        }
        var renderer = new SimpleRenderer(jsonUtils.fromJson(l.li.symbolData.symbol));
        l.li.newRenderer = renderer;
        if (l.layerObject.setRenderer) {
          l.layerObject.setRenderer(renderer);
        } else if (l.layerObject.setLayerDrawingOptions) {
          var optionsArray = [];
          var drawingOptions = new LayerDrawingOptions();
          drawingOptions.renderer = renderer;
          optionsArray[l.li.subLayerId] = drawingOptions;
          l.layerObject.setLayerDrawingOptions(optionsArray);
        } else {
          console.log("Error setting the new renderer...will use the default rendering of the layer");
        }
        l.layerObject.refresh();
      }
    },

    _addPanelItem: function (layer, lyrInfo) {
      if (layer.setVisibility) {
        layer.setVisibility(true);
      }

      var id = layer.visibleLayers ? lyrInfo.id : layer.id;
      var lyrType = this.layerList[id].type;

      var rec = domConstruct.create("div", {
        'class': "rec solidBorder",
        id: 'rec_' + id
      }, this.pageMain);

      domConstruct.create("div", {
        'class': "expand expandDown",
        id: "exp_" + id
      }, rec);

      var recIcon = domConstruct.create("div", {
        'class': "recIcon active",
        id: "recIcon_" + id
      }, rec);

      recIcon.innerHTML = lyrInfo.panelImageData;
      domStyle.set(recIcon.firstChild, "border-radius", "41px");

      var recLabel;
      var recNum;
      if(this.config.countEnabled){
        recLabel = domConstruct.create("div", {
          'class': "recLabel",
          innerHTML: "<p>" + lyrInfo.label + "</p>"
        }, rec);
        html.setStyle(recLabel, "top", "20px");
        recNum = domConstruct.create("div", {
          'class': "recNum",
          id: "recNum_" + id,
          innerHTML: ""
        }, rec);
      } else {
        recLabel = domConstruct.create("div", {
          'class': "recLabelNoCount",
          innerHTML: "<p>" + lyrInfo.label + "</p>"
        }, rec);
      }

      if (lyrType === "ClusterLayer") {
        layer.node = recNum;
        this._addLegend(id, this.layerList[id]);
        layer._updateNode(layer.nodeCount);
        //layer._initFeatures();
      } else if (lyrType === "StreamLayer") {
        this.layerList[id].node = recNum;
        this.countFeatures(layer, recNum);
        this._addLegend(id, this.layerList[id]);
      }
      else {
        this.layerList[id].node = recNum;
        this._addLegend(id, this.layerList[id]);
      }

      on(recIcon, "click", lang.hitch(this, this._toggleLayer, this.layerList[id]));
      on(rec, "click", lang.hitch(this, this._toggleLegend, this.layerList[id]));

      if (this.layerList[id].pl) {
        if (!this.layerList[id].pl.featureSet) {
          this.countFeatures(this.layerList[id].layerObject, recNum);
        }
      }
    },

    _addLegend: function (id, layerListLayer) {
      layerListLayer.legendNode = domConstruct.create("div", {
        "class": "legendLayer legendOff",
        "id": "legend_" + id
      }, this.pageMain);
    },

    _loadList: function (lyr, updateCount) {
      var queries = [];
      var updateNodes = [];
      var id = lyr.layerObject.id in this.layerList ? lyr.layerObject.id : lyr.li.id;
      if (updateCount) {
        this._addSearching(id);
      }
      var popupFields = [];
      if (lyr.layerObject && lyr.layerObject.infoTemplate) {
        var fieldInfos = lyr.layerObject.infoTemplate.info.fieldInfos;
        if (typeof (fieldInfos) !== 'undefined') {
          for (var i = 0; i < fieldInfos.length; i++) {
            if (popupFields.length < 4) {
              if (fieldInfos[i].visible) {
                popupFields.push(fieldInfos[i].fieldName);
              }
            }
          }
        }
      }

      var displayOptions;
      if (lyr.li.symbolData) {
        displayOptions = lyr.li.symbolData.featureDisplayOptions;
        if (displayOptions) {
          if (displayOptions.fields) {
            for (var k = 0; k < displayOptions.fields.length; k++) {
              if (popupFields.indexOf(displayOptions.fields[k].name) === -1) {
                popupFields.push(displayOptions.fields[k].name);
              }
            }
          }
        }
      }

      if (popupFields.length === 0) {
        popupFields = ['*'];
      }

      if (popupFields[0] !== '*') {
        if (lyr.layerObject && lyr.layerObject.objectIdField) {
          if (popupFields.indexOf(lyr.layerObject.objectIdField) === -1) {
            popupFields.push(lyr.layerObject.objectIdField);
          }
        }
      }

      if (lyr.type === "ClusterLayer") {
        if (lyr.layerObject.node) {
          //domClass.add(lyr.layerObject.node.id, 'searching');
        }
        var features = [];
        if (lyr.layerObject.clusterGraphics) {
          var clusterGraphics = lyr.layerObject.clusterGraphics;
          for (var z = 0; z < clusterGraphics.length; z++) {
            var clusterGraphic = clusterGraphics[z];
            if (clusterGraphic.graphics && clusterGraphic.graphics.length > 0) {
              for (var f = 0; f < clusterGraphic.graphics.length; f++) {
                features.push(clusterGraphic.graphics[f]);
              }
            }
          }
          setTimeout(lang.hitch(this, function () {
            this._updateList(features, lyr.legendNode, lyr.layerObject.node, popupFields, updateCount, lyr);
          }), 8);
        } else {
          this._removeSearching(id, true);
        }
      }

      var countLayerTypes = ["StreamLayer", "GeoRSS", "KML", "Feature Layer"];
      if (lyr.type !== 'ClusterLayer') {
        if (lyr.pl && lyr.pl.featureSet) {
          this.getFeatures(lyr, popupFields, updateCount);
          return;
        }
        else if (countLayerTypes.indexOf(lyr.type) > -1 || lyr.pl.type === "CSV") {
          this.getFeatures(lyr, popupFields, updateCount);
          return;
        }
      }

      if (lyr.li) {
        if (lyr.li.url && lyr.type !== "ClusterLayer" && typeof (lyr.queryFeatures) === 'undefined') {
          var url = lyr.li.url;
          if (url.indexOf("MapServer") > -1 || url.indexOf("FeatureServer") > -1) {
            if (this.promises) {
              this.promises.cancel('redundant', false);
              this.promises = undefined;
            }
            var q = new Query();
            q.where = lyr.filter ? lyr.filter : "1=1";
            q.geometry = this.map.extent;
            q.returnGeometry = true;
            q.outFields = popupFields;
            var qt = new QueryTask(url);
            queries.push(qt.execute(q));
            updateNodes.push({
              node: lyr.node,
              legendNode: lyr.legendNode,
              fields: popupFields,
              updateCount: updateCount,
              li: lyr.li
            });
          }
        }
      }
      if (queries.length > 0) {
        var promises = all(queries);
        this.promises = promises.then(lang.hitch(this, function (results) {
          this.promises = undefined;
          if (results) {
            for (var i = 0; i < results.length; i++) {
              if (results[i]) {
                var un = updateNodes[i];
                this._updateList(results[i].features, un.legendNode, un.node, un.fields, un.updateCount, un.li);
              }
            }
          }
        }));
      }
    },

    _addSearching: function (id) {
      if (domClass.contains("exp_" + id, "expandDown")) {
        domClass.remove("exp_" + id, "expandDown");
        domClass.add("exp_" + id, "expandSearching");
      }
      if (domClass.contains("exp_" + id, "expandUp")) {
        domClass.remove("exp_" + id, "expandUp");
        domClass.add("exp_" + id, "expandSearching");
      }
    },

    _removeSearching: function (id, legendOpen) {
      if (domClass.contains("exp_" + id, "expandSearching")) {
        domClass.remove("exp_" + id, "expandSearching");
        domClass.add("exp_" + id, legendOpen ? "expandUp" : "expandDown");
      }
    },

    _getClusterLayer: function (lyrInfo, layer, jimuLayerInfo, lyrType) {
      var lyr = layer.layerObject ? layer.layerObject : layer;
      var infoTemplate = lyrInfo.infoTemplate;
      var originOperLayer = lyr && lyr.originOperLayer ? lyr.originOperLayer : layer.parentLayerInfo;
      var clusterLayer = null;
      var n;
      var potentialNewID = lyrInfo.id + this.UNIQUE_APPEND_VAL_CL;

      if (this.map.graphicsLayerIds.indexOf(potentialNewID) > -1) {
        clusterLayer = this.map.getLayer(potentialNewID);

        var reloadData = false;
        var refreshData = false;

        //update the symbol if it has changed
        if (JSON.stringify(clusterLayer.symbolData) !== JSON.stringify(lyrInfo.symbolData)) {
          clusterLayer.symbolData = lyrInfo.symbolData;
          clusterLayer.countColor = lyrInfo.symbolData._highLightColor;
          refreshData = true;
        }

        //update the icon if it has changed
        n = domConstruct.toDom(lyrInfo.panelImageData);
        if (JSON.stringify(clusterLayer.icon) !== JSON.stringify(n.src)) {
          clusterLayer.icon = n.src;
          refreshData = true;
        }
        domConstruct.destroy(n.id);

        clusterLayer.displayFeatureCount = lyrInfo.symbolData.displayFeatureCount;

        if (clusterLayer.refresh !== lyrInfo.refresh) {
          clusterLayer.refresh = lyrInfo.refresh;
          reloadData = true;
        }

        if (refreshData) {
          clusterLayer._setupSymbols();
        }

        clusterLayer.countEnabled = this.config.countEnabled;

        if (reloadData) {
          clusterLayer.refreshFeatures(clusterLayer.url);
        } else if (refreshData) {
          clusterLayer.clusterFeatures();
        }
      } else {
        clusterLayer = new ClusterLayer({
          name: lyrInfo.label + this.UNIQUE_APPEND_VAL_CL,
          id: potentialNewID,
          map: this.map,
          node: dom.byId("recNum_" + potentialNewID),
          infoTemplate: typeof (lyr.infoTemplate) !== 'undefined' ? lyr.infoTemplate : infoTemplate,
          refreshInterval: this.config.refreshInterval,
          refreshEnabled: this.config.refreshEnabled,
          parentLayer: lyr,
          lyrInfo: lyrInfo,
          lyrType: lyrType,
          _styleColor: this._styleColor,
          originOperLayer: originOperLayer,
          countEnabled: this.config.countEnabled,
          filter: this.supportsFilter && jimuLayerInfo ? jimuLayerInfo.getFilter() : "1=1"
        });
      }
      return clusterLayer;
    },

    _createImageDataDiv: function (sym, w, h, parent) {
      var a;
      var symbol = sym;
      if (symbol) {
        //TODO are these switched??
        var height = w;
        var width = h;
        if (symbol.height && symbol.width) {
          var ar;
          if (symbol.height > symbol.width) {
            ar = symbol.width / symbol.height;
            width = w * ar;
          } else if (symbol.width === symbol.height || symbol.width > symbol.height) {
            width = w;
            ar = symbol.width / symbol.height;
            height = (ar > 0) ? h * ar : h;
          }
        }
        if (typeof (symbol.setWidth) !== 'undefined') {
          if (typeof (symbol.setHeight) !== 'undefined') {
            symbol.setWidth(width);
            symbol.setHeight(height);
          } else {
            symbol.setWidth(2);
          }
        } else if (typeof (symbol.size) !== 'undefined') {
          if (symbol.size > 20) {
            symbol.setSize(20);
          }
        }
        a = domConstruct.create("div", { 'class': "imageDataGFX" }, parent);
        var mySurface = gfx.createSurface(a, w, h);
        var descriptors = jsonUtils.getShapeDescriptors(symbol);
        var shape = mySurface.createShape(descriptors.defaultShape)
                      .setFill(descriptors.fill)
                      .setStroke(descriptors.stroke);
        shape.applyTransform({ dx: w / 2, dy: h / 2 });
      }
      return a;
    },

    _updateUI: function (styleName) {
      this.styleName = styleName;
      if (Object.keys(this.layerList).length > 0) {
        this.themeColorManager = new ThemeColorManager({
          updateNodes: this.legendNodes,
          layerList: this.layerList,
          theme: this.appConfig.theme,
          stylename: styleName
        });
      }
    },

    _toggleLayer: function (obj, e) {
      e.stopPropagation();
      this.map.infoWindow.hide();

      var id = obj.id ? obj.id : obj.layerObject.id;
      var lyr = this.layerList[id];

      if (!lyr) {
        lyr = this.layerList[id];
      }
      if (!lyr) {
        if (obj.pl) {
          id = obj.pl.id;
        }
        lyr = this.layerList[id];
      }

      if (lyr) {
        var hasSubLayerId = false;
        if (lyr.li) {
          if (lyr.li.hasOwnProperty("subLayerId")) {
            hasSubLayerId = typeof (lyr.li.subLayerId) !== 'undefined';
          }
        }
        var visLayers;
        var l;
        if (domClass.contains("recIcon_" + id, "active")) {
          domClass.remove("recIcon_" + id, "active");
          if (hasSubLayerId && lyr.type !== 'ClusterLayer') {
            visLayers = lyr.layerObject.visibleLayers;
            var lyrIndex = visLayers.indexOf(lyr.li.subLayerId);
            if (lyrIndex > -1) {
              visLayers.splice(lyrIndex, 1);
            }
            lyr.layerObject.setVisibleLayers(visLayers);
            lyr.layerObject.setVisibility(true);
          } else if (lyr) {
            lyr.layerObject.setVisibility(false);
            this.layerList[id].visible = false;
            if (typeof (lyr.pl) !== 'undefined') {
              lyr.pl.visibility = false;
              if (this.map.graphicsLayerIds.indexOf(id) > -1) {
                l = this.map.getLayer(id);
                l.setVisibility(false);
              }
            }
          }
        } else {
          domClass.add("recIcon_" + id, "active");
          if (hasSubLayerId && lyr.type !== 'ClusterLayer') {
            visLayers = lyr.layerObject.visibleLayers;
            visLayers.push(lyr.li.subLayerId);
            lyr.layerObject.setVisibleLayers(visLayers);
            lyr.layerObject.setVisibility(true);
          } else if (lyr) {
            lyr.layerObject.setVisibility(true);
            if (lyr.type === 'ClusterLayer') {
              lyr.layerObject.flashFeatures();
            }
            this.layerList[id].visible = true;
            if (typeof (lyr.pl) !== 'undefined') {
              lyr.pl.visibility = true;
              if (this.map.graphicsLayerIds.indexOf(id) > -1) {
                l = this.map.getLayer(id);
                l.setVisibility(true);
              }
            }
          }
        }
      }
      return false;
    },

    _toggleLegend: function (obj, evt) {
      if (evt.currentTarget.className !== 'thumb2' && evt.currentTarget.className !== 'recIcon') {
        var id = obj.layerObject.id in this.layerList ? obj.layerObject.id : obj.li.id;
        if (domClass.contains("legend_" + id, "legendOff")) {
          domClass.remove("legend_" + id, "legendOff");
          domClass.add("legend_" + id, "legendOn");
          if (domClass.contains("exp_" + id, "expandDown")) {
            domClass.remove("exp_" + id, "expandDown");
            domClass.add("exp_" + id, "expandSearching");
          }
          this.layerList[id].legendOpen = true;
          if (typeof (this.layerList[id].li.layerListExtentChanged) === 'undefined') {
            this.layerList[id].li.layerListExtentChanged = true;
          }
          if (this.layerList[id].li.layerListExtentChanged) {
            this._loadList(obj, false);
          } else {
            this._removeSearching(id, true);
          }
        } else {
          if (domClass.contains("legend_" + id, "legendOn")) {
            this.layerList[id].legendOpen = false;
            domClass.remove("legend_" + id, "legendOn");
            domClass.add("legend_" + id, "legendOff");
            if (domClass.contains("exp_" + id, "expandUp")) {
              domClass.remove("exp_" + id, "expandUp");
              domClass.add("exp_" + id, "expandDown");
            }
          }
        }
      }
      evt.stopPropagation();
    },

    _toggleGroup: function (obj, e) {
      var id = e.currentTarget.id.slice(0, -2);

      var toggle = true;
      if (e.target.parentNode) {
        if (e.target.parentNode.id !== "") {
          if (domClass.contains(e.target.parentNode.id, "featureItem")) {
            toggle = false;
          }
        }
        if (e.target.id !== "") {
          if (domClass.contains(e.target.id, "featureItem")) {
            toggle = false;
          }
        }
      }

      if (toggle) {
        var lId = obj.layerObject.id in this.layerList ? obj.layerObject.id : obj.li.id;
        var node = document.getElementById(e.currentTarget.id);
        if (domClass.contains(id, "groupOff")) {
          if (this.layerList[lId].openGroups && this.layerList[lId].openGroups.length > 0) {
            if (this.layerList[lId].openGroups.indexOf(id) === -1) {
              this.layerList[lId].openGroups.push(id);
            }
          } else {
            this.layerList[lId].openGroups = [id];
          }
          domClass.remove(id, "groupOff");
          domClass.add(id, "groupOn");
          this.layerList[lId].groupOpen = true;

          if (node.childNodes[0].childNodes[2].className.indexOf("groupItemImage") > -1) {
            html.removeClass(node.childNodes[0].childNodes[2], "groupItemImageDown");
            html.addClass(node.childNodes[0].childNodes[2], "groupItemImageUp");
          }
        } else {
          if (domClass.contains(id, "groupOn")) {
            domClass.remove(id, "groupOn");
            domClass.add(id, "groupOff");

            if (this.layerList[lId].openGroups && this.layerList[lId].openGroups.length > 0) {
              var idx = this.layerList[lId].openGroups.indexOf(id);
              if (idx > -1) {
                this.layerList[lId].openGroups.splice(idx, 1);
              }
              if(this.layerList[lId].openGroups.length === 0){
                this.layerList[lId].groupOpen = false;
              }
            } else {
              this.layerList[lId].groupOpen = false;
            }
            if (node.childNodes[0].childNodes[2].className.indexOf("groupItemImage") > -1) {
              html.removeClass(node.childNodes[0].childNodes[2], "groupItemImageUp");
              html.addClass(e.currentTarget.childNodes[0].childNodes[2], "groupItemImageDown");
            }
          }
        }
      }
    },

    /*jshint unused:false*/
    onAppConfigChanged: function (appConfig, reason, changedData) {
      switch (reason) {
        case 'themeChange':
        case 'layoutChange':
          this.destroy();
          break;
        case 'styleChange':
          this._updateUI(changedData);
          this._updateStyleColor(changedData);
          break;
        case 'widgetChange':
          this.widgetChange = true;
          if (changedData && changedData.config.layerInfos) {
            this.removeOldClusterLayers(changedData.config.layerInfos);
          }
          break;
        case 'mapChange':
          this._clearMap();
      }
    },

    _updateStyleColor: function(changedData){
      var tName = this.appConfig.theme.name;
      var sName = changedData;
      var url = "./themes/" + tName + "/manifest.json";
      xhr.get({
        url: url,
        handleAs: "json",
        sync: this.initialLoad,
        load: lang.hitch(this, function (data) {
          this.initialLoad = false;
          var styles = data.styles;
          style_loop:
          for (var i = 0; i < styles.length; i++) {
            var bc;
            array.forEach(document.styleSheets, function (ss) {
              var rules = ss.rules ? ss.rules : ss.cssRules;
              if (rules) {
                array.forEach(rules, function (r) {
                  if (r.selectorText === ".jimu-main-background") {
                    bc = r.style.getPropertyValue('background-color');
                  }
                });
              }
            });
            this._styleColor = Color.fromRgb(bc).toHex();
            for (var k in this.layerList) {
              var l = this.layerList[k];
              if (l.type === "ClusterLayer") {
                l.layerObject.setStyleColor(this._styleColor);
              }
            }
          }
        })
      });
    },

    _clearMap: function () {
      if (this.layerList) {
        for (var k in this.layerList) {
          var l = this.layerList[k];
          if (l.type === "ClusterLayer") {
            l.layerObject._clear();
            this.map.removeLayer(l.layerObject);
          }
        }
        this.layerList = {};
      }
    },

    setPosition: function (position, containerNode) {
      //TODO still need to investigate how to fully fit into the Box, Dart, and Launchpad themes
      //This would still allow the widget to function somewhat but not fully be a part of the theme
      // may be better to just not support these themes until we work out the details
      var pos;
      var style;
      if (this.appConfig.theme.name === "BoxTheme") {
        this.inherited(arguments);
        pos = {
          right: "0px",
          bottom: "0px",
          top: "0px",
          height: "auto",
          'z-index': "auto"
        };
        this.position = pos;
        style = utils.getPositionStyle(this.position);
        style.position = 'absolute';
        containerNode = this.map.id;
        html.place(this.domNode, containerNode);
        html.setStyle(this.domNode, style);

        domStyle.set(this.pageContent, "bottom", "60px");
      } else if (this.appConfig.theme.name === "DartTheme") {
        this.inherited(arguments);
        pos = {
          right: "0px",
          bottom: "80px",
          top: "0px",
          height: "auto",
          'z-index': "auto"
        };
        this.position = pos;
        style = utils.getPositionStyle(this.position);
        style.position = 'absolute';
        containerNode = this.map.id;
        html.place(this.domNode, containerNode);
        html.setStyle(this.domNode, style);
      } else if (this.appConfig.theme.name === "LaunchpadTheme") {
        this.inherited(arguments);
        pos = {
          right: "0px",
          bottom: "130px",
          top: "70px",
          height: "auto",
          'z-index': "auto"
        };
        this.position = pos;
        style = utils.getPositionStyle(this.position);
        style.position = 'absolute';
        containerNode = this.map.id;
        html.place(this.domNode, containerNode);
        html.setStyle(this.domNode, style);
      } else {
        if (window.innerWidth <= 470) {
          pos = {
            right: "0px",
            bottom: "0px",
            height: "none",
            'z-index': "auto",
            relativeTo: "browser"
          };
          this.position = pos;
          style = utils.getPositionStyle(this.position);
          style.position = 'absolute';
          html.place(this.domNode, window.jimuConfig.layoutId);

          var m = dom.byId('map');
          m.style.bottom = window.innerHeight / 2 + "px";
        } else {
          pos = {
            right: "0px",
            bottom: "0px",
            height: "none",
            'z-index': "auto"
          };
          this.position = pos;
          style = utils.getPositionStyle(this.position);
          style.position = 'absolute';
          html.place(this.domNode, this.map.id);
        }
        html.setStyle(this.domNode, style);
      }
    },

    _close: function () {
      this.widgetManager.closeWidget(this.id);
    },

    onClose: function () {
      this.inherited(arguments);

      if (this.queryList) {
        this.queryList.cancel();
        this.queryLookupList = [];
      }

      if (this.layerVisibilityManager) {
        this.layerVisibilityManager.resetLayerVisibility();
        this.layerVisibilityManager = null;
      }

      for (var key in this.layerList) {
        var layerListLayer = this.layerList[key];
        if (layerListLayer.li && layerListLayer.li.orgRenderer) {

          if (layerListLayer.layerObject.setRenderer) {
            layerListLayer.layerObject.setRenderer(layerListLayer.li.orgRenderer);
          } else if (layerListLayer.layerObject.setLayerDrawingOptions) {
            layerListLayer.layerObject.setLayerDrawingOptions([]);
          } else {
            console.log("Error re-setting the renderer");
          }

          layerListLayer.layerObject.refresh();
        }
      }

      if (this.refreshInterval !== 0) {
        this.refreshIntervalValue = 0;
        clearInterval(this.refreshInterval);
        this.refreshInterval = 0;
      }

      this.mapExtentChangedHandler.remove();
      this.mapExtentChangedHandler = undefined;

      this._resetMapDiv();
    },

    _resetMapDiv: function () {
      var m = dom.byId('map');
      m.style.bottom = "0px";
    },

    _clearChildNodes: function (parentNode) {
      while (parentNode.hasChildNodes()) {
        parentNode.removeChild(parentNode.lastChild);
      }
    },

    onUpdateEnd: function (results) {
      var lid = this.layerList.hasOwnProperty(results.target.id) ? results.target.id :  results.target.id + "_CL";
      var lyr = this.layerList[lid];
      if (lyr) {
        if (lyr.updateList) {
          this._loadList(lyr, lyr.updateList);
        } else {
          if (this.config.countEnabled) {
            this.countFeatures(lyr.layerObject, lyr.node);
            //add call to extent change to trigger getting item list
            //instead of just updating header count.
            //this._mapExtentChange();
          }
          this._loadList(lyr, true);
        }
      }
    },

    _mapExtentChange: function () {
      var queries = [];
      var updateNodes = [];
      for (var key in this.layerList) {
        var lyr = this.layerList[key];
        if (!lyr.legendOpen || (lyr.groupEnabled && !lyr.groupOpen)) {
          this._clearList(lyr);
          if (lyr.li) {
            lyr.li.layerListExtentChanged = true;
          }
          if (this.config.countEnabled) {
            if (lyr.li) {
              if (lyr.li.url && lyr.type !== "ClusterLayer" && typeof (lyr.layerObject.queryCount) === 'undefined') {
                var url = lyr.li.url;
                if (url.indexOf("MapServer") > -1 || url.indexOf("FeatureServer") > -1) {
                  if (this.promises) {
                    this.promises.cancel('redundant', false);
                    this.promises = undefined;
                  }
                  var q = new Query();
                  q.where = lyr.filter ? lyr.filter : "1=1";
                  q.geometry = this.map.extent;
                  q.returnGeometry = false;

                  var qt = new QueryTask(url);
                  queries.push(qt.executeForIds(q));
                  updateNodes.push(lyr.node);
                  //domClass.add(lyr.node.id, "searching");
                }
              }
            }
            if (lyr.type === "ClusterLayer" && lyr.layerObject.initalLoad) {
              lyr.layerObject._updateNode(lyr.layerObject.node.innerHTML);
            }

            var countLayerTypes = ["StreamLayer", "GeoRSS", "KML"];
            if (lyr.type !== 'ClusterLayer') {
              if (typeof (lyr.layerObject) === 'undefined') {
                console.log("layer object not known");
              } else if (lyr.pl && lyr.pl.featureSet) {
                this.countFeatures(lyr.layerObject, lyr.node);
              }
              else if (countLayerTypes.indexOf(lyr.type) > -1 || lyr.pl.type === "CSV") {
                this.countFeatures(lyr.layerObject, lyr.node);
              } else if (lyr.layerObject._autoSnapshot) {
                this.countFeatures(lyr.layerObject, lyr.node);
              }
            }
          }
        } else {
          lyr.updateList = true;
          if (lyr.layerObject._autoSnapshot) {
            this._loadList(lyr, lyr.updateList);
          } else {
            this._loadList(lyr, lyr.updateList);
          }
        }
      }
      if (queries.length > 0) {
        var promises = all(queries);
        this.promises = promises.then(function (results) {
          this.promises = undefined;
          if (results) {
            for (var i = 0; i < results.length; i++) {
              if (results[i]) {
                if (domClass.contains(updateNodes[i].id, 'searching')) {
                  domClass.remove(updateNodes[i].id, 'searching');
                }
                updateNodes[i].innerHTML = results[i].length.toLocaleString();
              } else {
                updateNodes[i].innerHTML = 0;
              }
            }
          }
        });
      }
    },

    getFeatures: function (lyrInfo, fields, updateCount) {
      var lyr = lyrInfo.layerObject;
      var legendNode = lyrInfo.legendNode;
      var node = lyrInfo.node;

      var queries = [];
      var q = new Query();
      q.geometry = this.map.extent;
      q.outFields = fields;
      q.returnGeometry = true;
      if (lyr.queryFeatures) {
        queries.push(lyr.queryFeatures(q));
      } else {
        var url = lyrInfo.li.url;
        if (url.indexOf("MapServer") > -1 || url.indexOf("FeatureServer") > -1) {
          var qt = new QueryTask(url);
          q.where = lyrInfo.filter ? lyrInfo.filter : "1=1";
          queries.push(qt.execute(q));
        }
      }
      if (queries.length > 0) {
        if (this.featurePromises) {
          this.featurePromises.cancel('redundant', false);
          this.featurePromises = undefined;
        }
        var featurePromises = all(queries);
        featurePromises.then(lang.hitch(this, function (results) {
          if (results[0].features) {
            setTimeout(lang.hitch(this, function () {
              this._updateList(results[0].features, legendNode, node, fields, updateCount, lyrInfo);
            }), 8);
          }
        }));
      }
    },

    _getInfoTemplate: function (originOpLayer) {
      var l;
      if (originOpLayer.parentLayerInfo) {
        l = originOpLayer.parentLayerInfo;
      } else {
        l = originOpLayer;
      }
      if (l.controlPopupInfo) {
        var infoTemplates = l.controlPopupInfo.infoTemplates;
        if (infoTemplates) {
          var url;
          if (l.layerObject && l.layerObject.url) {
            url = l.layerObject.url;
            var subLayerId = url.split("/").pop();
            if (subLayerId) {
              if (infoTemplates.indexOf) {
                if (infoTemplates.indexOf(subLayerId) > -1) {
                  return infoTemplates[subLayerId].infoTemplate;
                }
              } else if (infoTemplates.hasOwnProperty(subLayerId)) {
                return infoTemplates[subLayerId].infoTemplate;
              }
            }
          }
        }
      }
    },

    _clearList: function (lyrInfo) {
      if (lyrInfo.legendNode) {
        lyrInfo.legendNode.innerHTML = '';
      }
    },

    _updateList: function (features, legendNode, node, fields, updateCount, lyrInfo) {
      if (lyrInfo.type === 'ClusterLayer') {
        if (lyrInfo.layerObject.node) {
          if (domClass.contains(lyrInfo.layerObject.node.id, 'searching')) {
            domClass.remove(lyrInfo.layerObject.node.id, 'searching');
          }
        }
      }
      var infoTemplate;
      if (typeof (lyrInfo.li.subLayerId) !== 'undefined') {
        var infoTemplates = lyrInfo.layerObject.infoTemplates;
        if (infoTemplates && infoTemplates.hasOwnProperty(lyrInfo.li.subLayerId)) {
          infoTemplate = infoTemplates[lyrInfo.li.subLayerId].infoTemplate;
        }
      }
      var displayOptions = lyrInfo.li.symbolData.featureDisplayOptions;
      legendNode.innerHTML = '';
      if (updateCount && node && this.config.countEnabled) {
        node.innerHTML = features.length.toLocaleString();
      }

      if (features.length > 0) {
        var renderer;
        if (features[0]._graphicsLayer) {
          renderer = features[0]._graphicsLayer.renderer;
        } else if (lyrInfo.type === "ClusterLayer") {
          renderer = lyrInfo.layerObject.renderer;
        } else if (lyrInfo.li.renderer) {
          renderer = jsonUtil.fromJson(lyrInfo.li.renderer);
        }

        var groupNodes = [];
        var finalGroupNodes = [];
        var finalDomNodes = [];

        for (var i = 0; i < features.length; i++) {
          var groupAdded = false;
          var feature = features[i];
          if (typeof (feature.infoTemplate) === 'undefined' && infoTemplate) {
            feature.infoTemplate = infoTemplate;
          }
          var id;
          var oidName;
          if (feature._layer && feature._layer.objectIdField) {
            id = feature.attributes[feature._layer.objectIdField];
            oidName = feature._layer.objectIdField;
          } else if (lyrInfo.li && lyrInfo.li.oidFieldName) {
            id = feature.attributes[lyrInfo.li.oidFieldName.name];
            oidName = lyrInfo.li.oidFieldName.name;
          } else if (lyrInfo.layerObject && lyrInfo.layerObject.objectIdField) {
            id = feature.attributes[lyrInfo.layerObject.objectIdField];
            oidName = lyrInfo.layerObject.objectIdField;
          } else {
            id = legendNode.id + i;
          }
          var flds;
          var isNames = false;
          if (fields[0] === '*') {
            flds = feature.attributes;
          } else {
            flds = fields;
            isNames = true;
          }
          var displayString = this.getDisplayString(feature, lyrInfo, flds, displayOptions, oidName, isNames);
          var groupField;
          var groupNode;
          var groupContainer;
          if (displayOptions.groupEnabled) {
            groupField = displayOptions.groupField;
            var gId = 'group_' + lyrInfo.li.id + "_" + groupField.name + "_" + feature.attributes[groupField.name];
            var addGroup = true;
            var n;
            if (groupNodes.length > 0) {
              array.forEach(groupNodes, function (gNode) {
                if (gId === gNode.id && feature.attributes[groupField.name] === gNode.value) {
                  addGroup = false;
                  n = gNode.node;
                  groupContainer = gNode.parent;
                  return;
                }
              });
            }
            if (addGroup) {
              groupAdded = true;
              groupContainer = domConstruct.create('div', {
                'class': 'groupItem',
                id: gId + "_c"
              });
              var groupTitle = domConstruct.create('div', {
                'class': 'groupItemTitle',
                id: gId + "_t"
              }, groupContainer);
              //var test = '<div class="groupItem" id="{0}_c" ><div class="groupItem" id="{0}_t"></div></div>'.format(gId);
              //TODO handle this in a better way
              //this._createImageDataDiv(lang.clone(renderer.getSymbol(feature)), 30, 30, groupTitle);
              var label = "";
              var title = groupField.name + ": ";
              if (groupField.label !== "") {
                label = groupField.label + ": ";
                title = label;
              }
              if (label === ": ") {
                label = "";
                title = "";
              }
              domConstruct.create('div', {
                'class': 'groupField',
                innerHTML: label + feature.attributes[groupField.name],
                title: title + feature.attributes[groupField.name]
              }, groupTitle);

              var inGrpList = false;
              if (lyrInfo.openGroups && lyrInfo.openGroups.length > 0) {
                inGrpList = lyrInfo.openGroups.indexOf(gId) > -1;
              }

              var groupCountNode = domConstruct.create('div', {
                'class': 'groupCountLabel'
              }, groupTitle);

              var imageContainer = domConstruct.create('div', { 'class': 'expandImageContainer' }, groupTitle);

              var cNames = 'groupItemImage';
              cNames += inGrpList ? ' groupItemImageUp' : ' groupItemImageDown';
              domConstruct.create('div', {
                'class': cNames
              }, imageContainer);

              cNames = 'groupItem';
              if (lyrInfo.groupOpen && inGrpList) {
                cNames += ' groupOn';
              } else if (lyrInfo.groupOpen && !inGrpList) {
                cNames += ' groupOff';
              } else {
                cNames += ' groupOff';
              }
              groupNode = domConstruct.create('div', {
                'class': cNames,
                id: gId
              }, groupContainer);

              groupNodes.push({
                id: 'group_' + lyrInfo.li.id + "_" + groupField.name + "_" + feature.attributes[groupField.name],
                node: groupNode,
                parent: groupContainer,
                value: feature.attributes[groupField.name]
              });

              finalGroupNodes.push({
                value: feature.attributes[groupField.name],
                node: groupContainer,
                countNode: groupCountNode,
                count: 1
              });

              on(groupContainer, "click", lang.hitch(this, this._toggleGroup, lyrInfo));
            } else {
              var result = finalGroupNodes.filter(function (o) {
                if (o.node.id === (n.id + "_c")) {
                  return o;
                }
              });

              result[0].count += 1;
              groupNode = n;
            }
          }

          var featureItem = domConstruct.create('div', {
            'class': 'featureItem',
            id: 'feature_' + lyrInfo.li.id + "_" + id
          });

          //if (lyrInfo.infoTemplate) {
          //  feature.infoTemplate = lyrInfo.infoTemplate;
          //} else if (lyrInfo.li.infoTemplate) {
          //  feature.infoTemplate = lyrInfo.li.infoTemplate;
          //}
          on(featureItem, "click", lang.hitch(this, this._panToFeature, feature));
          if (renderer && renderer.getSymbol) {
            //TODO explore this pattern more with HTML and innerHTML
            //var s = renderer.getSymbol(feature);
            //if (this.symbols) {
            //  var hasSym = array.forEach(this.symbols, function (symbol, s) {
            //    if (symbol === s) {
            //      return symbol;
            //    }
            //  });
            //  if (typeof(hasSym) === 'undefined') {
            //    this.symbols.push({
            //      symbol: s,
            //      div: this._createImageDataDiv(s, 30, 30, featureItem)
            //    });
            //  } else {
            //    var a = domConstruct.create("div", { 'class': "imageDataGFX" }, featureItem);
            //    a.appendChild(hasSym.div.firstChild);
            //  }
            //}

            this._createImageDataDiv(lang.clone(renderer.getSymbol(feature)), 30, 30, featureItem);
          }
          if (displayString.indexOf(" - ") > -1) {
            displayString = displayString.slice(0, -3);
          }
          domConstruct.create('div', {
            style: "padding: 7px 5px 5px 45px; text-align: left;",
            innerHTML: displayString,
            title: displayString
          }, featureItem);

          finalDomNodes.push({
            node: featureItem,
            updateNode: groupNode ? groupNode : legendNode
          });
        }

        if (finalGroupNodes.length > 0) {
          //sort and place at legendNode
          var nodes = finalGroupNodes.sort(function (a, b) {
            if (typeof (a.value) === 'undefined') {
              return b.value;
            } else if (typeof (b.value) === 'undefined') {
              return a.value;
            }
            if (isNaN(a.value)) {
              return a.value.localeCompare(b.value);
            } else {
              return parseFloat(a.value) - parseFloat(b.value);
            }
          });
          var cE = this.config.countEnabled;
          array.forEach(nodes, function (n) {
            if (cE) {
              n.countNode.innerHTML = n.count.toLocaleString();
            }
            legendNode.appendChild(n.node);
          });
        }

        if (finalDomNodes.length > 0) {
          array.forEach(finalDomNodes, function (fdn) {
            domConstruct.place(fdn.node, fdn.updateNode);
          });

        }
      }

      lyrInfo.li.layerListExtentChanged = false;

      var s_id = lyrInfo.layerObject.id in this.layerList ? lyrInfo.layerObject.id : lyrInfo.li.id;
      this._removeSearching(s_id, lyrInfo.legendOpen);
    },

    getDisplayString: function (feature, lyrInfo, fields, displayOptions, oidName, isNames) {
      var includeField;
      var dateField;
      var displayString = "";
      var append;
      var featureValue;
      var fieldName;
      for (var a in fields) {
        fieldName = isNames ? fields[a] : a;
        dateField = this._checkDateField(lyrInfo, fieldName);
        includeField = true;
        if (displayOptions.fields && displayOptions.fields.length > 0) {
          includeField = this._checkDisplayField(displayOptions.fields, fieldName);
        }
        append = includeField.label !== "" ? ": " : " ";
        featureValue = feature.attributes[fieldName];
        if (dateField) {
          featureValue = this.formatDateValue(featureValue, fieldName, lyrInfo);
        }
        if (includeField && displayOptions.fields && displayOptions.fields.length > 0) {
          displayString += includeField.label + append + featureValue + " - ";
        } else if (includeField) {
          if (oidName && fieldName !== oidName) {
            displayString += fieldName + append + featureValue;
            break;
          } else if (typeof (oidName) === 'undefined') {
            displayString += fieldName + append + featureValue;
            break;
          }
        }
      }
      return displayString;
    },

    formatDateValue: function (v, fieldName, lyrInfo) {
      var options;
      var infoTemplate;
      if (lyrInfo.layerObject && lyrInfo.layerObject.infoTemplate) {
        infoTemplate = lyrInfo.layerObject.infoTemplate;
      } else if (lyrInfo.li && lyrInfo.li.infoTemplate) {
        infoTemplate = lyrInfo.li.infoTemplate;
      }
      if (infoTemplate) {
        var fieldsMap = infoTemplate._fieldsMap;
        if (fieldsMap) {
          for (var k in fieldsMap) {
            if (fieldsMap[k].fieldName === fieldName) {
              options = this._getDateFormat(fieldsMap[k].format.dateFormat);
            }
          }
        }
      }
      if (typeof (options) === 'undefined') {
        //December 21,1997
        options = {
          month: 'long',
          day: '2-digit',
          year: 'numeric'
        };
      }
      return new Date(v).toLocaleDateString(navigator.language, options);
    },

    _checkDateField: function(lyrInfo, fieldName){
      var fields = lyrInfo.li.fields;
      if (fields) {
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          if (field.name === fieldName) {
            if (field.type === 'esriFieldTypeDate') {
              return true;
            } else {
              return false;
            }
          }
        }
        return false;
      }
    },

    _getDateFormat: function (dFormat) {
      //default is Month Day Year
      var options;
      switch (dFormat) {
        case "shortDate":
          //12/21/1997
          options = {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          };
          break;
        case "shortDateLE":
          //21/12/1997
          options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          };
          break;
        case "longMonthDayYear":
          //December 21,1997
          options = {
            month: 'long',
            day: '2-digit',
            year: 'numeric'
          };
          break;
        case "dayShortMonthYear":
          //21 Dec 1997
          options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          };
          break;
        case "longDate":
          //Sunday, December 21, 1997
          options = {
            weekday: 'long',
            month: 'long',
            day: '2-digit',
            year: 'numeric'
          };
          break;
        case "shortDateLongTime":
          //12/21/1997 6:00:00 PM
          options = {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          };
          break;
        case "shortDateLELongTime":
          //21/12/1997 6:00:00 PM
          options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          };
          break;
        case "shortDateShortTime":
          //12/21/1997 6:00 PM
          options = {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          };
          break;
        case "shortDateLEShortTime":
          //21/12/1997 6:00 PM
          options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          };
          break;
        case "shortDateShortTime24":
          //12/21/1997 18:00
          options = {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
          };
          break;
        case "shortDateLEShortTime24":
          //21/12/1997 18:00
          options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
          };
          break;
        case "longMonthYear":
          //December 1997
          options = {
            month: 'long',
            year: 'numeric'
          };
          break;
        case "shortMonthYear":
          //Dec 1997
          options = {
            month: 'short',
            year: 'numeric'
          };
          break;
        case "year":
          //1997
          options = {
            year: 'numeric'
          };
          break;
      }
      return options;
    },

    _checkDisplayField: function(displayFields, featureField){
      var includeField = true;
      if (displayFields) {
        for (var j = 0; j < displayFields.length; j++) {
          if (displayFields[j].name === featureField) {
            return displayFields[j];
          } else {
            includeField = false;
          }
        }
      }
      return includeField;
    },

    _flashFeature: function (feature) {
      var symbol;
      if (feature.geometry) {
        var color = Color.fromHex(this._styleColor);
        var color2 = lang.clone(color);
        color2.a = 0.4;
        switch (feature.geometry.type) {
          case 'point':
            symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              color, 1),
              color2);
            break;
          case 'polyline':
            symbol = new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              color,
              3
            );
            break;
          case 'polygon':
            symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_DIAGONAL_CROSS,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              color, 2), color2
            );
            break;
        }
      }

      var g = new Graphic(feature.geometry, symbol);
      this.map.graphics.add(g);
      var dShape = g.getDojoShape();
      if (dShape) {
        fx.animateStroke({
          shape: dShape,
          duration: 900,
          color: {
            start: dShape.strokeStyle.color,
            end: dShape.strokeStyle.color
          },
          width: {
            start: 25,
            end: 0
          }
        }).play();
        setTimeout(this._clearFeature, 1075, g);
      }
    },

    _clearFeature: function (f) {
      var gl = f.getLayer();
      gl.remove(f);
    },

    _panToFeature: function (feature) {
      if (feature.geometry) {
        var geom = feature.geometry;
        if (geom.type === 'polyline') {
          var path = geom.paths[Math.ceil(geom.paths.length / 2) - 1];
          var g = path[Math.ceil((path.length - 1) / 2)];
          geom = new Point(g[0], g[1], geom.spatialReference);
        }
        if (geom.type !== 'point') {
          geom = geom.getExtent().getCenter();
        }
        //this.map.centerAt(geom);
        this._flashFeature(feature);
        this.map.infoWindow.setFeatures([feature]);
        this.map.infoWindow.select(0);
        this.map.infoWindow.show(geom);
      }
    },

    countFeatures: function (lyr, node) {
      //Query the features based on map extent for supported layer types
      var q = new Query();
      q.geometry = this.map.extent;
      if (lyr.queryCount && this.config.countEnabled) {
        lyr.queryCount(q, lang.hitch(this, function (r) {
          if (node) {
            node.innerHTML = r.toLocaleString();
          }
        }));
      }
    }
  });
});