///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/on',
    'dojo/Evented',
    'dojo/_base/html',
    'dojo/_base/lang',
    'jimu/symbolUtils',
    'jimu/dijit/DrawBox',
    'esri/graphic',
    'esri/layers/FeatureLayer',
    'esri/tasks/query',
    'esri/symbols/jsonUtils',
    'esri/layers/GraphicsLayer',
    'esri/geometry/Circle',
    'esri/renderers/SimpleRenderer',
    'esri/geometry/geometryEngine'
  ],
  function (declare, array, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, on, Evented, html, lang,
    jimuSymbolUtils, DrawBox, Graphic, FeatureLayer, Query, symbolJsonUtils, GraphicsLayer, Circle, SimpleRenderer,
    geometryEngine) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'jimu-select-features-tool',
      templateString: '<div><div data-dojo-attach-point="drawBoxDiv"></div></div>',
      map: null,
      bufferLayer: null,
      drawBoxOption: null,
      nls: null,
      currentLayerInfo: null,

      postCreate: function () {
        this.inherited(arguments);

        this.map = this.drawBoxOption.map;
        this.bufferLayer = new GraphicsLayer();
        var bufferSymbol = this._getPolygonSymbol();
        var renderer = new SimpleRenderer(bufferSymbol);
        this.bufferLayer.setRenderer(renderer);
        this.map.addLayer(this.bufferLayer);

        // init DrawBox
        this.drawBoxOption.showClear = this.drawBoxOption.showClear;
        this.drawBoxOption.keepOneGraphic = true;
        this.drawBox = new DrawBox(this.drawBoxOption);
        this.drawBox.setPolygonSymbol(bufferSymbol);
        var pinSymbol = jimuSymbolUtils.getGreyPinMarkerSymbol();
        this.drawBox.setPointSymbol(pinSymbol);
        this.drawBox.setLineSymbol(symbolJsonUtils.fromJson({
          "color": [54, 93, 141, 255],
          "width": 1.5,
          "type": "esriSLS",
          "style": "esriSLSSolid"
        }));
        this.drawBox.placeAt(this.drawBoxDiv);
        this.own(on(this.drawBox, 'user-clear', lang.hitch(this, this._onDrawBoxClear)));
        this.own(on(this.drawBox, 'draw-end', lang.hitch(this, this._onDrawEnd)));
        if (this.drawBox.btnClear) {
          html.removeClass(this.drawBox.btnClear, 'jimu-float-trailing');
        } else {
          html.addClass(this.drawBox.btnClear, 'jimu-float-leading');
        }
      },

      reset: function () {
        this.drawBox.reset();
        this.clearAllGraphics();
      },

      clearAllGraphics: function () {
        this.drawBox.clear();
        this._clearBufferLayer();
      },

      hideTempLayers: function () {
        if (this.bufferLayer) {
          this.bufferLayer.hide();
        }
        if (this.drawBox) {
          this.drawBox.hideLayer();
        }
      },

      showTempLayers: function () {
        if (this.bufferLayer) {
          this.bufferLayer.show();
        }
        if (this.drawBox) {
          this.drawBox.showLayer();
        }
      },

      deactivate: function () {
        if (this.drawBox) {
          this.drawBox.deactivate();
        }
      },

      execute: function () {
        var featureLayer,
          unionFeatures,
          isFeatureCollection = false;
        if (this.currentLayerInfo) {
          if (this.currentLayerInfo.url !== null) {
            featureLayer = new FeatureLayer(this.currentLayerInfo.url, {
              outFields: ["*"]
            });
          } else {
            featureLayer = this.currentLayerInfo;
            isFeatureCollection = true;
          }

          var queryGeom = this._getGeometryFromDrawBox();
          if (queryGeom.geoType === "POINT") {
            var circle = new Circle({
              center: queryGeom,
              geodesic: true,
              radius: 25,
              radiusUnit: "esriFeet"
            });
            queryGeom = circle.getExtent();
          }

          var query = new Query();
          if (isFeatureCollection) {
            array.forEach(featureLayer.graphics, function (graphic) {
              if (geometryEngine.intersects(graphic.geometry, queryGeom)) {
                var sym = null;
                switch (graphic.geometry.type) {
                  case "point":
                    sym = this._getPointSymbol();
                    break;
                  case "polyline":
                    sym = this._getPolylineSymbol();
                    break;
                  case "polygon":
                    sym = this._getPolygonSymbol();
                    break;
                  default:
                    sym = null;
                }
                this.bufferLayer.add(new Graphic(graphic.geometry, sym));
              }
            }, this);
            this.drawBox.clear();

            unionFeatures = geometryEngine.union(array.map(this.bufferLayer.graphics, function (graphic) {
              return graphic.geometry;
            }));
            this.emit("selection-complete", {
              geometry: unionFeatures
            });
          } else {
            query.geometry = queryGeom;
            featureLayer.queryFeatures(query, lang.hitch(this, function (result) {
              array.forEach(result.features, function (feature) {
                var sym = null;
                switch (feature.geometry.type) {
                  case "point":
                    sym = this._getPointSymbol();
                    break;
                  case "polyline":
                    sym = this._getPolylineSymbol();
                    break;
                  case "polygon":
                    sym = this._getPolygonSymbol();
                    break;
                  default:
                    sym = null;
                }
                this.bufferLayer.add(new Graphic(feature.geometry, sym));
              }, this);
              this.drawBox.clear();

              unionFeatures = geometryEngine.union(array.map(result.features, function (feature) {
                return feature.geometry;
              }));
              this.emit("selection-complete", {
                geometry: unionFeatures
              });
            }));
          }
        }
      },

      setLayerInfo: function (layerInfo) {
        this.currentLayerInfo = layerInfo;
      },

      _getPointSymbol: function () {
        return symbolJsonUtils.fromJson({
          "color": [36, 181, 204, 175],
          "size": 16,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "style": "esriSLSSolid",
            "color": [36, 181, 204, 255],
            "width": 2,
            "type": "esriSLS"
          }
        });
      },

      _getPolylineSymbol: function () {
        return symbolJsonUtils.fromJson({
          "style": "esriSFSSolid",
          "width": 5,
          "color": [36, 181, 204, 175],
          "type": "esriSLS"
        });
      },

      _getPolygonSymbol: function () {
        return symbolJsonUtils.fromJson({
          "style": "esriSFSSolid",
          "color": [36, 181, 204, 175],
          "type": "esriSFS",
          "outline": {
            "style": "esriSLSSolid",
            "color": [36, 181, 204, 255],
            "width": 2,
            "type": "esriSLS"
          }
        });
      },

      _getGeometryFromDrawBox: function () {
        var geometry = null;
        var graphic = this.drawBox.getFirstGraphic();
        if (graphic) {
          geometry = graphic.geometry;
        }
        return geometry;
      },

      _getGeometryFromBufferLayer: function () {
        var geometry = null;
        if (this.bufferLayer.graphics.length > 0) {
          geometry = this.bufferLayer.graphics[0].geometry;
        }
        return geometry;
      },

      _onDrawBoxClear: function () {
        this._clearBufferLayer();
      },

      _onDrawEnd: function () {
        this._updateBuffer();
      },

      _clearBufferLayer: function () {
        if (this.bufferLayer) {
          this.bufferLayer.clear();
        }
      },

      _updateBuffer: function () {
        this._clearBufferLayer();
        this.execute();
      },

      destroy: function () {
        if (this.bufferLayer) {
          this.map.removeLayer(this.bufferLayer);
        }
        this.bufferLayer = null;
        this.inherited(arguments);
      }

    });
  });