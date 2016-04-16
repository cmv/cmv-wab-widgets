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
'dojo/promise/all',
'dojo/_base/array',
'dojo/query',
'dijit/_WidgetsInTemplateMixin',
'esri/graphic',
'esri/geometry/Point',
//'esri/dijit/Legend',
'esri/tasks/query',
'esri/tasks/QueryTask',
"esri/tasks/FeatureSet",
"esri/arcgis/utils",
'esri/symbols/jsonUtils',
"esri/renderers/SimpleRenderer",
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
  all,
  array,
  query,
  _WidgetsInTemplateMixin,
  Graphic,
  Point,
  //Legend,
  Query,
  QueryTask,
  FeatureSet,
  arcgisUtils,
  jsonUtils,
  SimpleRenderer,
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

    postCreate: function () {
      this.inherited(arguments);
      this.configLayerInfos = this.config.layerInfos;
      this.queryLookupList = [];
      this.layerList = {};
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

      if (typeof(this.mapExtentChangedHandler) === 'undefined') {
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
        if (layerListLayer.li && layerListLayer.li.orgRenderer) {

          if (layerListLayer.layerObject.setRenderer) {
            layerListLayer.layerObject.setRenderer(layerListLayer.li.newRenderer);
          } else if (layerListLayer.layerObject.setLayerDrawingOptions) {
            var optionsArray = [];
            var drawingOptions = new LayerDrawingOptions();
            drawingOptions.renderer = layerListLayer.li.newRenderer;
            optionsArray[layerListLayer.li.subLayerId] = drawingOptions;
            layerListLayer.layerObject.setLayerDrawingOptions(optionsArray);
          } else {
            console.log("Error setting the new renderer...will use the default rendering of the layer");
          }

          layerListLayer.layerObject.refresh();
        }

        if (layerListLayer.layerObject) {
          if (typeof (layerListLayer.layerObject.visible) !== 'undefined') {
            if (!layerListLayer.layerObject.visible) {
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
      this.pageTitle.innerHTML = "<div></div>";
      var updateValue = "";
      if (this.config.mainPanelText !== "") {
        updateValue = this.config.mainPanelText + " ";
      }

      this.pageTitle.innerHTML = updateValue + new Date(modifiedTime).toLocaleDateString(navigator.language, dFormat);
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
      this._updatePanelTime(response.item.modified);
      var featureCollection = response.itemData;
      for (var i = 0; i < featureCollection.layers.length; i++) {
        this._updateLayerItem(featureCollection.layers[i]);
      }
      this.currentQueryList.splice(this.currentQueryList.indexOf(response.item.id), 1);
    },

    _updateLayerItem: function (responseLayer) {
      var layerListLayer;
      var parentLayer;
      for (var k in this.layerList) {
        if (this.layerList[k].pl) {
          if (this.layerList[k].pl.layerDefinition.name === responseLayer.layerDefinition.name) {
            layerListLayer = this.layerList[k];
            parentLayer = layerListLayer.pl;
            break;
          }
        } else if (this.layerList[k].layerObject._parentLayer) {
          if (this.layerList[k].layerObject._parentLayer.name === responseLayer.layerDefinition.name) {
            this.layerList[k].layerObject.refreshFeatures(responseLayer);
            break;
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
            this.opLayers = operLayerInfos._operLayers;
            this.opLayerInfos = operLayerInfos._layerInfos;
            this._createPanelUI(this.configLayerInfos);
          }));
      }
    },

    _updatePanelHeader: function () {
      this.pageLabel.innerHTML = utils.sanitizeHTML(this.label);
      if (this.config.displayPanelIcon) {
        if (this.pageHeader) {
          html.removeClass(this.pageHeader, "pageHeaderNoIcon");
          html.addClass(this.pageHeader, "pageHeader");
        }

        if (this.pageBody) {
          html.removeClass(this.pageBody, "pageBodyNoIcon");
          html.addClass(this.pageBody, "pageBody");
        }

        var panelTitle = this.config.mainPanelText;
        if (typeof (panelTitle) === 'undefined') {
          panelTitle = "";
        }
        this.pageTitle.innerHTML = panelTitle;
        this.panelMainIcon.innerHTML = this.config.mainPanelIcon;
        domStyle.set(this.pageLabel, "display", "block");
      } else {
        if (this.pageHeader) {
          html.removeClass(this.pageHeader, "pageHeader");
          html.addClass(this.pageHeader, "pageHeaderNoIcon");
        }

        if (this.pageBody) {
          html.removeClass(this.pageBody, "pageBody");
          html.addClass(this.pageBody, "pageBodyNoIcon");
        }
        domStyle.set(this.pageLabel, "display", "none");
      }
    },

    _createPanelUI: function (layerInfos) {
      this.numClusterLayers = 0;

      this._updatePanelHeader();

      this._updateUI(null);
      this._clearChildNodes(this.pageMain);
      this.updateEnd = [];
      for (var i = 0; i < layerInfos.length; i++) {
        var lyrInfo = layerInfos[i];
        this._createLayerListItem(lyrInfo);
      }

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

    _createLayerListItem: function (lyrInfo) {
      for (var ii = 0; ii < this.opLayers.length; ii++) {
        var layer = this.opLayers[ii];
        if (layer.id === lyrInfo.id || layer.id === lyrInfo.parentLayerID) {
          if (layer.layerType === "ArcGISMapServiceLayer") {
            var l = this._getSubLayerByURL(lyrInfo.id);
            if (typeof (l) !== 'undefined') {
              this.getLayer(l, lyrInfo, "Feature Layer");
              break;
            }
          } else if (layer.layerType === "ArcGISFeatureLayer" ||
          layer.layerType === "ArcGISStreamLayer" ||
          typeof (layer.layerType) === 'undefined') {
            if (layer.layerObject && layer.id === lyrInfo.id) {
              this.getLayer(layer, lyrInfo, "Feature Layer");
              break;
            } else if (layer.featureCollection) {
              for (var iii = 0; iii < layer.featureCollection.layers.length; iii++) {
                var lyr = layer.featureCollection.layers[iii];
                if (lyr.id === lyrInfo.id || layer.id === lyrInfo.id) {
                  this.getLayer(lyr, lyrInfo, "Feature Collection");
                  break;
                }
              }
            }
          }
        }
      }
    },

    removeMapLayer: function (id) {
      //check if the widget was previously configured
      // with a layer that it no longer consumes...if so remove it
      var potentialNewClusterID = id + this.UNIQUE_APPEND_VAL_CL;
      if (this.map.graphicsLayerIds.indexOf(potentialNewClusterID) > -1) {
        this.map.removeLayer(this.map.getLayer(potentialNewClusterID));
      }
    },

    addMapLayers: function () {
      //var reorderLayers = [];
      var ids = Object.keys(this.layerList).reverse();
      for (var i = 0; i < ids.length; i++) {
        var l = this.layerList[ids[i]];
        if (l.type && l.type === "ClusterLayer") {
          this.map.addLayer(l.layerObject);
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

    getLayer: function (lyr, lyrInfo, lyrType) {
      var l = null;
      var ll = null;
      var id = null;
      var _id = null;
      if (lyr.layerType === "ArcGISFeatureLayer") {
        if (lyrInfo.symbolData.clusteringEnabled) {
          l = this._getClusterLayer(lyrInfo, lyr.layerObject, lyrType, lyrInfo.infoTemplate, lyr.originOperLayer);
          this.layerList[l.id] = {
            type: "ClusterLayer",
            layerObject: l,
            visible: true,
            id: l.id
          };
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
            li: lyrInfo
          };
          this.updateRenderer(_id);
        }
      } else if (lyr.layerType === "ArcGISStreamLayer") {
        l = lyr.layerObject;
        this.layerList[l.id] = {
          type: "StreamLayer",
          layerObject: l,
          visible: true,
          id: l.id
        };
      } else {
        //These are the ones that are not marked as ArcGISFeatureLayer
        if (lyrInfo.symbolData.clusteringEnabled) {
          l = this._getClusterLayer(lyrInfo, lyr.layerObject, lyrType, lyrInfo.infoTemplate, lyr.originOperLayer);
          this.layerList[l.id] = {
            type: "ClusterLayer",
            layerObject: l,
            visible: true,
            id: l.id,
            li: lyrInfo
          };
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
            type: ll ? lyrType : l.type,
            layerObject: ll ? ll : l,
            visible: true,
            pl: lyr,
            li: lyrInfo
          };
          this.updateRenderer(_id);
        }
      }

      if (ll) {
        this._addPanelItem(ll, lyrInfo);
      } else if (l) {
        this._addPanelItem(l, lyrInfo);
      }
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

      var id = layer.id;
      if (layer.visibleLayers) {
        id = lyrInfo.id;
      }

      var rec = domConstruct.create("div", {
        'class': "rec"
      }, this.pageMain);
      var classNames = "recIcon";
      classNames += " active";

      var path = lyrInfo.symbolData.icon.url;
      if (path && path.indexOf("${appPath}") > -1) {
        path = lyrInfo.symbolData.icon.url.replace("${appPath}", window.location.origin + window.location.pathname);
      } else if (path && path.indexOf("data:image") > -1) {
        path = path;
      } else if (lyrInfo.symbolData.icon.imageData && lyrInfo.symbolData.icon.imageData.indexOf("data:image")) {
        path = lyrInfo.symbolData.icon.imageData;
      } else if (lyrInfo.symbolData.s.indexOf("data:image") > -1 && lyrInfo.symbolData.s.indexOf("<svg") === -1) {
        path = lyrInfo.symbolData.s;
      } else if (lyrInfo.symbolData.s.indexOf("${appPath}") > -1) {
        path = lyrInfo.symbolData.s.replace("${appPath}", window.location.origin + window.location.pathname);
      } else {
        path = undefined;
      }

      var recIcon = domConstruct.create("div", {
        'class': classNames,
        id: "recIcon_" + id
      }, rec);

      if (path) {
        html.setStyle(recIcon, "background-image", "url(" + path + ")");
        html.setStyle(recIcon, "background-repeat", "no-repeat");
        html.setStyle(recIcon, "background-position", "center");
        html.setStyle(recIcon, "background-size", "contain");
      } else {
        recIcon.innerHTML = lyrInfo.panelImageData;
      }

      var recLabel = domConstruct.create("div", {
        'class': "recLabel",
        innerHTML: "<p>" + lyrInfo.label + "</p>"
      }, rec);
      html.setStyle(recLabel, "top", "40px");

      var recNum = domConstruct.create("div", {
        'class': "recNum",
        id: "recNum_" + id,
        innerHTML: ""
      }, rec);

      var lyrType = this.layerList[id].type;

      if (lyrType === "ClusterLayer") {
        layer.node = recNum;
        this._addClusterLegend(layer, lyrInfo.imageData, lyrInfo);
        layer.clusterFeatures();
      } else if (lyrType === "StreamLayer") {
        this.layerList[id].node = recNum;
        this.countFeatures(layer, recNum);
        //this._addLegend(layer, lyrInfo);
      }
      else {
        this.layerList[id].node = recNum;
        //this._addLegend(layer, lyrInfo);
      }

      on(recIcon, "click", lang.hitch(this, this._toggleLayer, this.layerList[id]));
      //on(rec, "click", lang.hitch(this, this._toggleLegend, this.layerList[id]));

      if (this.layerList[id].pl) {
        if (!this.layerList[id].pl.featureSet) {
          this.countFeatures(this.layerList[id].layerObject, recNum);
        }
      }
    },

    _addClusterLegend: function (layer, img) {
      var legendDiv = domConstruct.create("div", {
        'class': "legendLayer legendOff",
        id: "legend_" + layer.id
      }, this.pageMain);

      var symbolDiv2 = domConstruct.create("div", {
        'class': "clusterSymbol2",
        id: "legend_symbol2_" + layer.id
      }, legendDiv);

      var symbolDiv = domConstruct.create("div", {
        'class': "clusterSymbol recImg",
        id: "legend_symbol_" + layer.id,
        innerHTML: img
      }, symbolDiv2);

      this.legendNodes.push({ node: symbolDiv, styleProp: "background-color" });
    },

    //_addLegend: function (layer, lyrInfo) {
    //  var component = registry.byId("legend_" + layer.id);
    //  if (component) {
    //    component.destroyRecursive();
    //    domConstruct.destroy(component);
    //  }

    //  var legendDiv = domConstruct.create("div", {
    //    "class": "legendLayer legendOff",
    //    "id": "legend_" + layer.id
    //  }, this.pageMain);

    //  var legend = new Legend({
    //    "autoUpdate": false,
    //    "respectCurrentMapScale": true,
    //    "layerInfos": [{
    //      "defaultSymbol": false,
    //      "layer": layer
    //    }],
    //    "map": this.map
    //  }, legendDiv);

    //  legend.startup();

    //  this._loadLayerSymbol(layer, legendDiv);
    //},

    _getClusterLayer: function (lyrInfo, lyr, lyrType, infoTemplate, originOperLayer) {
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
          refreshData = true;
        }

        //update the icon if it has changed
        n = domConstruct.toDom(lyrInfo.panelImageData);
        if (JSON.stringify(clusterLayer.icon) !== JSON.stringify(n.src)) {
          clusterLayer.icon = n.src;
          refreshData = true;
        }
        domConstruct.destroy(n.id);

        if (clusterLayer.refresh !== lyrInfo.refresh) {
          clusterLayer.refresh = lyrInfo.refresh;
          reloadData = true;
        }

        if (refreshData) {
          clusterLayer._setupSymbols();
        }

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
          features: lyrType === "Feature Collection" ? this._getSourceFeatures(lyr) : undefined,
          infoTemplate: typeof (lyr.infoTemplate) !== 'undefined' ? lyr.infoTemplate : infoTemplate,
          refreshInterval: this.config.refreshInterval,
          refreshEnabled: this.config.refreshEnabled,
          parentLayer: lyr,
          lyrInfo: lyrInfo,
          originOperLayer: originOperLayer
        });
      }
      return clusterLayer;
    },

    _getSourceFeatures: function (lyr) {
      var features = [];
      for (var i = 0; i < lyr.graphics.length; i++) {
        var g = lyr.graphics[i];
        if (g.geometry) {
          if (g.geometry.x) {
            features.push({
              geometry: new Point(g.geometry.x, g.geometry.y, g.geometry.spatialReference),
              attributes: g.attributes
            });
          } else {
            features.push(g);
          }
        }
      }
      return features;
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

    _toggleLayer: function (obj) {
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
    },

    _toggleLegend: function (obj, evt) {
      if (evt.currentTarget.className !== 'thumb2' && evt.currentTarget.className !== 'recIcon') {
        var id = obj.layerObject.id;
        if (domClass.contains("legend_" + id, "legendOff")) {
          domClass.remove("legend_" + id, "legendOff");
          domClass.add("legend_" + id, "legendOn");
        } else {
          if (domClass.contains("legend_" + id, "legendOn")) {
            domClass.remove("legend_" + id, "legendOn");
            domClass.add("legend_" + id, "legendOff");
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
          break;
        case 'widgetChange':
          this.widgetChange = true;
          break;
        case 'mapChange':
          this._clearMap();
      }
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
      var lyr = this.layerList[results.target.id];
      if (lyr) {
        this.countFeatures(lyr.layerObject, lyr.node);
      }
    },

    _mapExtentChange: function () {
      var queries = [];
      var updateNodes = [];
      for (var key in this.layerList) {
        var lyr = this.layerList[key];
        if (lyr.li) {
          if (lyr.li.url && lyr.type !== "ClusterLayer" && typeof(lyr.queryCount) === 'undefined') {
            var url = lyr.li.url;
            if (url.indexOf("MapServer") > -1 || url.indexOf("FeatureServer") > -1) {
              if (this.promises) {
                this.promises.cancel('redundant', false);
                this.promises = undefined;
              }
              var q = new Query();
              q.geometry = this.map.extent;
              q.returnGeometry = false;

              var qt = new QueryTask(url);
              queries.push(qt.executeForIds(q));
              updateNodes.push(lyr.node);
            }
          }
        }
        if (lyr.type === "ClusterLayer" && lyr.layerObject.initalLoad) {
          lyr.layerObject._updateNode(lyr.layerObject.node.innerHTML);
        }

        if (lyr.type !== 'ClusterLayer') {
          if (typeof (lyr.layerObject) === 'undefined') {
            console.log("layer object not known");
          } else if (lyr.pl && lyr.pl.featureSet) {
            this.countFeatures(lyr.layerObject, lyr.node);
          }
          else if(lyr.type === "StreamLayer"){
            this.countFeatures(lyr.layerObject, lyr.node);
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
                var lenSame = updateNodes[i].innerHTML.length === results[i].length.length;
                updateNodes[i].innerHTML = results[i].length.toLocaleString();
                if (!lenSame) {
                  var fc = updateNodes[i].parentNode.childNodes[1];
                  var w;
                  if (updateNodes[i].clientWidth < 30) {
                    w = results[i].length.length * 15;
                  } else {
                    w = updateNodes[i].clientWidth;
                  }
                  html.setStyle(fc, "right", w + "px");
                  var h = 70 - fc.childNodes[0].clientHeight;
                  if (h > 2 && h < 70) {
                    html.setStyle(fc, "top", h / 2 + "px");
                  } else {
                    html.setStyle(fc, "top", 2 + "px");
                  }
                }
              } else {
                updateNodes[i].innerHTML = 0;
              }
            }
          }
        });
      }
    },

    countFeatures: function (lyr, node) {
      //Query the features based on map extent for supported layer types
      var q = new Query();
      q.geometry = this.map.extent;
      if (lyr.queryCount) {
        lyr.queryCount(q, lang.hitch(this, function (r) {
          if (node) {
            node.innerHTML = r.toLocaleString();
            var fc = node.parentNode.childNodes[1];
            var w;
            if (node.clientWidth < 30) {
              w = r.length * 10;
            } else {
              w = node.clientWidth;
            }
            html.setStyle(fc, "right", w + "px");
            var h = 70 - fc.childNodes[0].clientHeight;
            if (h > 2 && h < 70) {
              html.setStyle(fc, "top", h / 2 + "px");
            } else {
              html.setStyle(fc, "top", 2 + "px");
            }
          }
        }));
      }
    }
  });
});
