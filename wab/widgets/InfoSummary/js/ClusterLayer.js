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

define([
   'dojo/_base/declare',
   'dojo/_base/array',
   'dojo/_base/event',
   'dojo/_base/lang',
   'dojo/_base/html',
   'dojo/_base/Color',
   'dojo/DeferredList',
   'esri/layers/GraphicsLayer',
   'esri/graphic',
   'esri/geometry/Extent',
   'esri/geometry/Point',
   'esri/symbols/PictureMarkerSymbol',
   'esri/symbols/SimpleMarkerSymbol',
   'esri/symbols/SimpleLineSymbol',
   'esri/renderers/SimpleRenderer',
   'esri/request',
   'esri/tasks/query',
   'esri/tasks/QueryTask',
   'esri/symbols/jsonUtils'
], function (declare,
  array,
  dojoEvent,
  lang,
  html,
  Color,
  DeferredList,
  GraphicsLayer,
  Graphic,
  Extent,
  Point,
  PictureMarkerSymbol,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleRenderer,
  esriRequest,
  Query,
  QueryTask,
  jsonUtils) {
  var clusterLayer = declare('ClusterLayer', [GraphicsLayer], {

    constructor: function (options) {
      //Defaults
      this.clusterGraphics = null;
      this.cancelRequest = false;
      this.clusterSize = 120;
      this._singles = [];
      this._showSingles = true;
      this.initalLoad = true;
      this.updateFeatures = [];

      //Options
      this._parentLayer = options.parentLayer;
      this.name = options.name;
      this._map = options.map;
      this.color = Color.fromString(options.color || '#ff0000');
      this.symbolData = options.lyrInfo.symbolData;
      this.itemId = options.lyrInfo.itemId;
      this.refresh = options.lyrInfo.refresh;
      this.node = options.node;
      this._features = options.features;
      this.id = options.id;
      this.infoTemplate = options.infoTemplate;
      this.url = options.lyrInfo.url;
      this._testRenderer = options.lyrInfo.renderer;
      if (options.originOperLayer) {
        this._getInfoTemplate(options.originOperLayer);
      }

      this._setupSymbols();
      this._setFieldNames();
      this._initFeatures();
    },

    _initFeatures: function () {
      if (typeof (this._features) === 'undefined') {
        if (typeof (this.url) !== 'undefined') {
          this.loadData(this.url);
        } else {
          this.loaded = "error";
        }
      }
      else {
        this.loaded = true;
      }

      if (this.loaded !== "error") {
        this.extentChangeSignal = this._map.on('extent-change', lang.hitch(this, this.handleMapExtentChange));
        this.clickSignal = this.on('click', lang.hitch(this, this.handleClick));
      }
    },

    //this is a duplicate of what's in settings...as the infoTemplate passed from settings was not being honored
    // for MapServer sublayers...works fine without this for hosted layers
    _getInfoTemplate: function (originOpLayer) {
      var infoTemplate;
      if (originOpLayer) {
        if (originOpLayer.parentLayerInfo) {
          if (originOpLayer.parentLayerInfo.controlPopupInfo) {
            var infoTemplates = originOpLayer.parentLayerInfo.controlPopupInfo.infoTemplates;
            if (infoTemplates) {
              if (this.url) {
                var subLayerId = this.url.split("/").pop();
                if (subLayerId) {
                  if (infoTemplates.indexOf) {
                    if (infoTemplates.indexOf(subLayerId) > -1) {
                      this.infoTemplate = infoTemplates[subLayerId].infoTemplate;
                    }
                  } else if (infoTemplates.hasOwnProperty(subLayerId)) {
                    this.infoTemplate = infoTemplates[subLayerId].infoTemplate;
                  }
                }
              }
            }
          }
        }
      }
      return infoTemplate;
    },

    _setFieldNames: function () {
      this._fieldNames = [];
      //this will limit the fields to those fequired for the popup
      if (this.infoTemplate) {
        if (typeof (this.infoTemplate.info) !== 'undefined') {
          var fieldInfos = this.infoTemplate.info.fieldInfos;
          for (var i = 0; i < fieldInfos.length; i++) {
            if (fieldInfos[i].visible) {
              this._fieldNames.push(fieldInfos[i].fieldName);
            }
          }
        }
      }
      if (this._fieldNames.length < 1) {
        //get all fields
        this._fieldNames = ["*"];
      }
    },

    clearSingles: function (singles) {
      // Summary:  Remove graphics that represent individual data points.
      var s = singles || this._singles;
      array.forEach(s, function (g) {
        this.remove(g);
      }, this);
      this._singles.length = 0;
    },

    _getSingleGraphic: function (p) {
      var g = new Graphic(
        new Point(p.geometry.x, p.geometry.y, this._map.spatialReference),
        null,
        p.attributes
      );
      g.setSymbol(this._singleSym);
      return g;
    },

    _addSingles: function (singles) {
      array.forEach(singles, function (p) {
        var g = this._getSingleGraphic(p);
        this._singles.push(g);
        if (this._showSingles) {
          this.add(g);
        }
      }, this);
      this._map.infoWindow.setFeatures(this._singles);
    },

    initalCount: function (url) {
      var q = new Query();
      q.returnGeometry = false;
      q.geometry = this._map.extent;
      var qt = new QueryTask(url);
      qt.executeForIds(q).then(lang.hitch(this, function (results) {
        if (this.node) {
          this.node.innerHTML = results ? results.length.toLocaleString() : 0;
          html.setStyle(this.node.parentNode.childNodes[1], "right", this.node.clientWidth + "px");
          var h = 70 - this.node.parentNode.childNodes[1].childNodes[0].clientHeight;
          if (h > 2) {
            html.setStyle(this.node.parentNode.childNodes[1], "top", h / 2 + "px");
          } else {
            html.setStyle(this.node.parentNode.childNodes[1], "top", 2 + "px");
          }
        }
      }));
    },

    loadData: function (url) {
      if (url.length > 0) {
        this.initalCount(url);
        var q = new Query();
        q.where = "1=1";
        q.returnGeometry = false;
        this.queryPending = true;
        var qt = new QueryTask(url);
        qt.executeForIds(q).then(lang.hitch(this, function (results) {
          var max = 1000;
          if (results) {
            this.queryIDs = results;
            var queries = [];
            var i, j;
            for (i = 0, j = this.queryIDs.length; i < j; i += max) {
              var ids = this.queryIDs.slice(i, i + max);
              queries.push(esriRequest({
                "url": url + "/query",
                "content": {
                  "f": "json",
                  "outFields": this._fieldNames.join(),
                  "objectids": ids.join(),
                  "returnGeometry": "true",
                  "outSR": this._map.spatialReference.wkid
                }
              }));
            }

            this._features = [];
            if (!this.cancelRequest) {
              var queryList = new DeferredList(queries);
              queryList.then(lang.hitch(this, function (queryResults) {
                this.queryPending = false;
                if (!this.cancelRequest) {

                  if (queryResults) {
                    var sr = this._map.spatialReference;
                    var fs = [];
                    for (var i = 0; i < queryResults.length; i++) {
                      for (var ii = 0; ii < queryResults[i][1].features.length; ii++) {
                        var item = queryResults[i][1].features[ii];
                        if (typeof (item.geometry) !== 'undefined') {
                          var geom = new Point(item.geometry.x, item.geometry.y, sr);
                          var gra = new Graphic(geom);
                          gra.setAttributes(item.attributes);
                          if (this.infoTemplate) {
                            gra.setInfoTemplate(this.infoTemplate);
                          }
                          fs.push(gra);
                        }
                      }
                    }

                    //TODO...figure out a better test here JSON.stringify does not like itwhen you have too many features
                    //it fell over with 150,000 for sure have not really tested it out too far
                    var shouldUpdate = true;
                    if (fs < 10000) {
                      shouldUpdate = JSON.stringify(this._features) !== JSON.stringify(fs);
                    }
                    if (shouldUpdate) {
                      this._features = fs;
                      this.clusterFeatures();
                    }

                    this.loaded = true;
                  }
                } else {
                  console.log("Cancelled ClusterLayer 2");
                }
              }));
            } else {
              console.log("Cancelled ClusterLayer 1");
            }
          }
        }));
      }
    },

    //click
    handleClick: function (event) {
      var singles = [];

      if (event.graphic) {
        var g = event.graphic;
        if (g.attributes) {
          var attr = g.attributes;
          if (attr.Data && attr.Data.length > 1) {
            this.clearSingles(this._singles);
            singles = attr.Data;
            event.stopPropagation();
            this._addSingles(singles);
            this._map.infoWindow.setFeatures(attr.Data);
          } else {
            this._map.infoWindow.setFeatures([g]);
          }
        }
      }

      this._map.infoWindow.show(event.mapPoint);
      dojoEvent.stop(event);
    },

    //re-cluster on extent change
    handleMapExtentChange: function (event) {
      if (event.levelChange) {
        this.clusterFeatures();
      } else if (event.delta) {
        var delta = event.delta;
        var dx = Math.abs(delta.x);
        var dy = Math.abs(delta.y);
        if (dx > 50 || dy > 50) {
          this.clusterFeatures();
        }
      }
    },

    refreshFeatures: function (responseLayer) {
      if (this.itemId) {
        var responseFeatureSetFeatures = responseLayer.featureSet.features;
        var shouldUpdate = true;
        if (responseFeatureSetFeatures.length < 10000) {
          shouldUpdate = JSON.stringify(this.updateFeatures) !== JSON.stringify(responseFeatureSetFeatures);
        }

        if (shouldUpdate) {
          //if valid response then clear and load
          this._features = [];
          this._parentLayer.clear();
          var sr = this._parentLayer.spatialReference;
          var r;
          if (this._parentLayer.renderer) {
            r = this._parentLayer.renderer;
          } else if (this._testRenderer) {
            r = this._testRenderer;
          }
          for (var ii = 0; ii < responseFeatureSetFeatures.length; ii++) {
            var item = responseFeatureSetFeatures[ii];
            if (item.geometry) {
              this._features.push({
                attributes: item.attributes,
                geometry: new Point(item.geometry.x, item.geometry.y, sr)
              });

              var gra = new Graphic(this.getGraphicOptions(item, sr, r));
              gra.setAttributes(item.attributes);
              if (this._infoTemplate) {
                gra.setInfoTemplate(this._infoTemplate);
              }
              gra.setSymbol(r.getSymbol(gra));
              this._parentLayer.add(gra);

            } else {
              console.log("Null geometry skipped");
            }
          }
          this.clusterFeatures();
        }
        this.updateFeatures = responseFeatureSetFeatures;
      } else if (this.url) {
        this.loadData(this.url);
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

    flashFeatures: function () {
      this.flashGraphics(this.graphics);
    },

    flashSingle: function (graphic) {
      if (typeof (graphic.symbol) === 'undefined') {
        var cls2 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color(0, 0, 0, 0), 0);
        var symColor = this.color.toRgb();
        graphic.setSymbol(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 9,
          cls2, new Color([symColor[0], symColor[1], symColor[2], 0.5])));
      }
      this.flashGraphics([graphic]);
    },

    flashGraphics: function (graphics) {
      var cls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, this.color, 7);
      var cls2 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, this.color, 3);

      var cls4 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color(0, 0, 0, 0), 0);
      var x = 0;

      clearInterval(this.s);

      this.s = setInterval(lang.hitch(this, function () {
        for (var i = 0; i < graphics.length; i++) {
          var g = graphics[i];
          var s;
          if (x % 2) {
            s = g.symbol;
            if (s) {
              if (typeof (s.setOutline) === 'function') {
                s.setOutline(cls);
              }
              g.setSymbol(s);
            }
          } else {
            s = g.symbol;
            if (s) {
              if (typeof (s.setOutline) === 'function') {
                s.setOutline(cls2);
              }
              g.setSymbol(s);
            }
          }
        }
        this.redraw();
        x = x + 1;
        if (x === 5) {
          clearInterval(this.s);
          for (var j = 0; j < graphics.length; j++) {
            var gra = graphics[j];
            var sym = gra.symbol;
            if (typeof (sym) !== 'undefined') {
              if (typeof (sym.setOutline) === 'function') {
                sym.setOutline(cls4);
              }
              gra.setSymbol(sym);
            }
          }
          this.redraw();
          //TODO handle in a better way
          this.clusterFeatures();
        }
      }), 600);
    },

    setColor: function (color) {
      this.color = color;
    },

    cancelPendingRequests: function () {
      console.log("Cancel Query...");
      if (this.queryPending) {
        this.cancelRequest = true;
      }
      this.removeEventListeners();
    },

    removeEventListeners: function () {
      if (this.extentChangeSignal) {
        this.extentChangeSignal.remove();
        this.extentChangeSignal = null;
      }
      if (this.clickSignal) {
        this.clickSignal.remove();
        this.clickSignal = null;
      }
    },

    // cluster features
    clusterFeatures: function () {
      this.clear();
      if (this._map.infoWindow.isShowing) {
        this._map.infoWindow.hide();
      }
      var features = this._features;
      var total = 0;
      if (typeof (features) !== 'undefined') {
        if (features.length > 0) {
          var clusterSize = this.clusterSize;
          this.clusterGraphics = [];
          var sr = this._map.spatialReference;
          var mapExt = this._map.extent;
          var o = new Point(mapExt.xmin, mapExt.ymax, sr);

          var rows = Math.ceil(this._map.height / clusterSize);
          var cols = Math.ceil(this._map.width / clusterSize);
          var distX = mapExt.getWidth() / this._map.width * clusterSize;
          var distY = mapExt.getHeight() / this._map.height * clusterSize;

          for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
              var x1 = o.x + (distX * c);
              var y2 = o.y - (distY * r);
              var x2 = x1 + distX;
              var y1 = y2 - distY;

              var ext = new Extent(x1, y1, x2, y2, sr);

              var cGraphics = [];
              for (var i in features) {
                var feature = features[i];
                if (ext.contains(feature.geometry)) {
                  total += 1;
                  cGraphics.push(feature);
                }
              }
              if (cGraphics.length > 0) {
                var cPt = this.getClusterCenter(cGraphics);
                this.clusterGraphics.push({
                  center: cPt,
                  graphics: cGraphics
                });
              }
            }
          }

          //add cluster to map
          for (var g in this.clusterGraphics) {
            var clusterGraphic = this.clusterGraphics[g];
            var count = clusterGraphic.graphics.length;
            var data = clusterGraphic.graphics;
            var label = count.toString();
            var size = label.length * 19;
            var size2 = size;

            this._setSymbols(size + 5, size2 + 1);

            var attr = {
              Count: count,
              Data: data
            };
            if (count > 1) {
              if (typeof (this.symbolData) !== 'undefined') {
                if (this.symbolData.symbolType !== 'CustomSymbol') {
                  this.add(new Graphic(clusterGraphic.center, this.csym, attr));
                  this.add(new Graphic(clusterGraphic.center, this.csym3, attr));
                } else {
                  this.add(new Graphic(clusterGraphic.center, this.csym, attr));
                  this.add(new Graphic(clusterGraphic.center, this.psym, attr));
                }
              } else {
                this.add(new Graphic(clusterGraphic.center, this.csym, attr));
                this.add(new Graphic(clusterGraphic.center, this.psym, attr));
              }
            } else {
              //TODO look to see if this could be consolidated further
              var pt = clusterGraphic.graphics[0].geometry;
              var ggg;
              if (this.renderer) {
                if (this.renderer.hasOwnProperty("getSymbol") && this.symbolData.symbolType === "LayerSymbol") {
                  ggg = new Graphic(pt, null, attr.Data[0].attributes);
                  var symmmm = this.renderer.getSymbol(ggg);
                  ggg.setInfoTemplate(this.infoTemplate);
                  ggg.setSymbol(symmmm);
                  this.add(ggg);
                } else if (this.renderer.hasOwnProperty("symbol") && this.symbolData.symbolType === "LayerSymbol") {
                  ggg = new Graphic(pt, null, attr.Data[0].attributes);
                  ggg.setInfoTemplate(this.infoTemplate);
                  ggg.setSymbol(jsonUtils.fromJson(this.renderer.symbol));
                  this.add(ggg);
                } else if (this.symbolData.symbolType === "EsriSymbol") {
                  this.add(new Graphic(pt, jsonUtils.fromJson(this.symbolData.symbol), attr));
                } else if (this.symbolData.symbolType !== "LayerSymbol") {
                  this.add(new Graphic(pt, this.psym, attr));
                } else {
                  if (this.renderer.symbol) {
                    ggg = new Graphic(pt, this.renderer.symbol, attr);
                    ggg.setInfoTemplate(this.infoTemplate);
                    this.add(ggg);
                  } else {
                    ggg = new Graphic(pt, this.psym, attr);
                    ggg.setInfoTemplate(this.infoTemplate);
                    this.add(ggg);
                  }
                }
              }
            }
          }
        }
        this._updateNode(total);
      }
    },

    _updateNode: function (total) {
      if (this.node) {
        this.node.innerHTML = total.toLocaleString();
        var w;

        if (this.node.clientWidth && this.node.clientWidth > 0) {
          w = this.node.clientWidth;
        } else {
          w = total.toLocaleString().length * 10;
        }
        html.setStyle(this.node.parentNode.childNodes[1], "right", w + "px");

        var h;
        if (this.node.parentNode.childNodes[1].childNodes[0].clientHeight === 0) {
          this.initalLoad = true;
          h = 60;
        } else {
          h = 70 - this.node.parentNode.childNodes[1].childNodes[0].clientHeight;
          this.initalLoad = false;
        }

        if (h > 2) {
          html.setStyle(this.node.parentNode.childNodes[1], "top", h / 2 + "px");
        } else {
          html.setStyle(this.node.parentNode.childNodes[1], "top", 2 + "px");
        }
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

    _setSymbols: function (size, size2) {
      var symColor = this.color.toRgb();
      var fsp;
      var style;
      var lineWidth;
      if (typeof (this.symbolData) !== 'undefined') {
        var c;
        //need to make a marker from the fill properties
        if (this.backgroundClusterSymbol === "custom") {
          c = symColor;
        } else {
          fsp = jsonUtils.fromJson(this.backgroundClusterSymbol);

          if (fsp.outline.color.a === 0 || fsp.outline.width === 0) {
            style = SimpleLineSymbol.STYLE_NULL;
            lineWidth = 0;
          } else {
            style = SimpleLineSymbol.STYLE_SOLID;
            lineWidth = fsp.outline.width;
          }
        }

        if (fsp) {
          var cls = SimpleLineSymbol(style, fsp.outline.color, lineWidth);
          c = fsp.color.toRgb();
          this.csym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,
            size, cls, new Color([c[0], c[1], c[2], 0.75]));
        } else {
          this.csym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,
            size, null, new Color([c[0], c[1], c[2], 0.75]));
        }

        var path = this.symbolData.s;
        if (path.indexOf("${appPath}") > -1) {
          path = this.symbolData.s.replace("${appPath}", window.location.origin + window.location.pathname);
        } else if (this.symbolData.s) {
          path = this.symbolData.s;
        } else {
          path = this.icon.imageData;
        }
        if (path && this.symbolData.iconType === "CustomIcon") {
          this.psym = new PictureMarkerSymbol(path, size - 6, size - 6);
        } else if (path && this.symbolData.iconType === "LayerIcon") {
          this.psym = jsonUtils.fromJson(this.symbolData.symbol);
        } else {
          var ssssssss = SimpleLineSymbol(this.icon.outline.style,
            this.icon.outline.color, this.icon.outline.width);
          this.psym = new SimpleMarkerSymbol(this.icon.style, this.icon.size,
            ssssssss, this.icon.color);
        }

        //options for cluster with 1
        this.csym2 = lang.clone(this.psym);
        this.csym3 = lang.clone(this.csym2);
        if (typeof (this.csym2.xoffset) !== 'undefined') {
          this.csym3.xoffset = 0;
        }
        if (typeof (this.csym2.yoffset) !== 'undefined') {
          this.csym3.yoffset = 0;
        }
      } else {
        //options for cluster with more than 1
        var cls1 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL,
          new Color(0, 0, 0, 0), 0);
        this.csym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, size,
          cls1, new Color([symColor[0], symColor[1], symColor[2], 0.5]));
        this.psym = new PictureMarkerSymbol(this.icon.url, size - 10, size - 10);

        //options for cluster with 1
        this.psym2 = new PictureMarkerSymbol(this.icon.url, size2 - 7, size2 - 7);
        var cls2 = new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color(0, 0, 0, 0), 0);
        this.csym2 = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, size2,
          cls2, new Color([symColor[0], symColor[1], symColor[2], 0.5]));
      }
    },

    _setupSymbols: function () {
      if (typeof (this.symbolData) !== 'undefined') {
        this.backgroundClusterSymbol = this.symbolData.clusterSymbol;
        this.icon = this.symbolData.icon;

        if (this.symbolData.symbolType === "LayerSymbol") {
          if (this._parentLayer.renderer) {
            this.renderer = this._parentLayer.renderer;
          } else if (this.symbolData.renderer) {
            //this.renderer = this.symbolData.renderer;
            this.renderer = this._testRenderer;
          }
        } else {
          this.renderer = new SimpleRenderer(jsonUtils.fromJson(this.symbolData.symbol));
        }

        //Default single symbol if none are found through the layers renderer fo some reason
        //TODO may pull this out completely if we go the renderer route
        var symColor = this.color.toRgb();
        var cls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color(0, 0, 0, 0), 0);
        this._singleSym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 9, cls,
          new Color([symColor[0], symColor[1], symColor[2], 0.5]));
      }
    },

    getClusterCenter: function (graphics) {
      var xSum = 0;
      var ySum = 0;
      var count = graphics.length;
      array.forEach(graphics, function (graphic) {
        xSum += graphic.geometry.x;
        ySum += graphic.geometry.y;
      }, this);
      var cPt = new Point(xSum / count, ySum / count, graphics[0].geometry.spatialReference);
      return cPt;
    },

    _clear: function () {
      this.clear();
      this._features = [];
    }
  });

  return clusterLayer;
});
