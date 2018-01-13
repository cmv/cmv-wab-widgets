/*
 | Copyright 2017 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
//====================================================================================================================//
define([
  'dojo/_base/array',
  'dojo/_base/Color',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/Deferred',
  'dojo/dom-style',
  'esri/geometry/geometryEngineAsync',
  'esri/geometry/Polygon',
  'esri/graphic',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/tasks/BufferParameters',
  'esri/tasks/GeometryService',
  'esri/tasks/query',
  'esri/tasks/QueryTask'
  ], function(
    array,
    Color,
    declare,
    lang,
    Deferred,
    domStyle,
    geometryEngineAsync,
    Polygon,
    Graphic,
    SimpleFillSymbol,
    SimpleLineSymbol,
    BufferParameters,
    GeometryService,
    Query,
    QueryTask
  ) {
    return declare([], {

      /**
       * Constructor for class.
       * @memberOf buffer#
       * @constructor
       */
      constructor: function(config, map, bufferLayer, geometryService) {
        this.config = config;
        this.map = map;
        this.bufferLayer = bufferLayer;
        this.geometryService = geometryService;

        this.rootFeaturesSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.65]), 2),
          new Color([255, 0, 0, 0.35]));
        this.foundFeaturesSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.65]), 2),
          new Color([0, 255, 0, 0.35]));
        this.bufferFeaturesSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255, 0.65]), 2),
          new Color([0, 0, 255, 0.35]));
        this.intermediateFeaturesSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([127, 127, 127, 0.65]), 2),
          new Color([0, 0, 255, 0.35]));
      },

      /**
       * Creates the buffer.
       * @memberOf buffer#
       */
      doBuffer: function(rootGeometry, bufferDistanceMeters, indeterminateProgress, determinateProgress) {
        var bufferParams, qTask, query, foundFeaturesDef = new Deferred(), awaitBufferingDef = new Deferred();

        this.clearBufferGraphics();

        // Modify the rootGeometry if there's a buffer
        if (bufferDistanceMeters !== 0) {
          bufferParams = new BufferParameters();
          bufferParams.bufferSpatialReference = this.map.spatialReference;
          bufferParams.distances = [bufferDistanceMeters];
          bufferParams.geodesic = true;
          bufferParams.geometries = rootGeometry;
          bufferParams.outSpatialReference = this.map.spatialReference;
          bufferParams.unit = GeometryService.UNIT_METER;

          this.geometryService.buffer(bufferParams, lang.hitch(this, function (bufferedRootGeometry) {
            // Highlight the buffer
            array.forEach(bufferedRootGeometry, function (geometry) {
              this._createAndAddGraphic(this.rootFeaturesSymbol, geometry, this.bufferLayer);
            }, this);

            awaitBufferingDef.resolve(bufferedRootGeometry);
          }));
        } else {
          awaitBufferingDef.resolve(rootGeometry);
        }

        // Get the features intersecting the [possibly buffered] rootGeometry
        awaitBufferingDef.then(lang.hitch(this, function (rootGeometry) {
          var doHighlightFeaturesDef = new Deferred(), maxNumFeaturesToHighlight = 5000;

          // Prep the query
          qTask = new QueryTask(this.config.selector.url);
          query = new Query();  // defaults to "esriSpatialRelIntersects"
          query.geometry = rootGeometry[0];
          query.returnGeometry = true;
          query.outFields = this.config.selector.useAsAddresseeLayer ? ['*'] : [];

          // Start an indeterminate progress bar
          indeterminateProgress.set({value: Number.POSITIVE_INFINITY});
          domStyle.set(indeterminateProgress.domNode, 'display', 'block');

          // Execute query tasks for selecting intersecting/contains features
          // First query gets just the count and extent--we'll use it to decide whether we should highlight
          // individual features or just their extent
          // Second query gets the features
          qTask.executeForExtent(query, lang.hitch(this, function (results) {
            console.log(results.count + ' selector features found');
            doHighlightFeaturesDef.resolve(results.count > maxNumFeaturesToHighlight ?
              geometryEngineAsync.intersect(Polygon.fromExtent(results.extent), query.geometry) : null);
          }));

          qTask.execute(query, lang.hitch(this, function (featureSet) {
            // Done with indeterminate progress bar
            domStyle.set(indeterminateProgress.domNode, 'display', 'none');

            doHighlightFeaturesDef.then(lang.hitch(this, function (highlightPolygonDef) {
              if (highlightPolygonDef) {
                // Highlight only the extent
                highlightPolygonDef.then(lang.hitch(this, function (highlightPolygon) {
                  this._createAndAddGraphic(this.foundFeaturesSymbol, highlightPolygon, this.bufferLayer);
                  foundFeaturesDef.resolve(featureSet);
                }));
              } else{
                // Highlight the features intersecting the root geometries
                this._highlightFeatureSet(this.foundFeaturesSymbol, featureSet, determinateProgress).then(function () {
                  foundFeaturesDef.resolve(featureSet);
                });
              }
            }));
          }));
        }));

        return foundFeaturesDef;
      },

      clearBufferGraphics: function () {
        this.bufferLayer.clear();
      },

      _getFeatureGeometries: function (features) {
        return array.map(features, lang.hitch(this, function (feature) {
          return feature.geometry;
        }));
      },

      /**
      * Draw polygon around the feature
      * @param {object} feature around which polygon gets drawn
      * @param {boolean} share is either true or false
      * @memberOf widgets/locator/locator
      */
      _highlightFeatureSet: function (symbol, featureSet, determinateProgress) {
        var chunkSize, iChunk = 0, iFeatureStart = 0, numChunks, deferred = new Deferred();

        if (featureSet.features.length > 0) {
          chunkSize = Math.max(100, Math.round(featureSet.features.length / 100));

          // Start a determinate progress bar
          //determinateProgress.update({ maximum: 100, progress: 0});
          determinateProgress.set({value: 0});
          domStyle.set(determinateProgress.domNode, 'display', 'block');

          numChunks = Math.ceil(featureSet.features.length / chunkSize);
          setTimeout(lang.hitch(this, function() {
            this._highlightFeaturesContinuation(symbol, featureSet.features, determinateProgress, chunkSize, numChunks,
              iChunk, iFeatureStart).then(function () {
              deferred.resolve(true);

              // Done with determinate progress bar
              determinateProgress.set({value: 100});
              domStyle.set(determinateProgress.domNode, 'display', 'none');
            });
          }), 50);
        } else {
          deferred.resolve(true);
        }

        return deferred;
      },

      _highlightFeaturesContinuation: function (symbol, features, determinateProgress, chunkSize, numChunks,
        iChunk, iFeatureStart) {
        var iFeatureEnd, deferred = new Deferred();

        if (iFeatureStart >= features.length) {
          deferred.resolve(true);
          return deferred;
        }

        iFeatureEnd = Math.min(iFeatureStart + chunkSize, features.length);
        this._highlightFeatures(symbol, features.slice(iFeatureStart, iFeatureEnd)).then(lang.hitch(this, function () {
          ++iChunk;
          determinateProgress.set({value: 100 * iChunk / numChunks});

          setTimeout(lang.hitch(this, function() {
            this._highlightFeaturesContinuation(symbol, features, determinateProgress, chunkSize, numChunks,
              iChunk, iFeatureEnd).then(function () {
              deferred.resolve(true);
            });
          }), 10);
        }));

        return deferred;
      },

      _highlightFeatures: function (symbol, features) {
        var deferred = new Deferred();

        array.forEach(features, function (feature) {
          this._createAndAddGraphic(symbol, feature.geometry, this.bufferLayer);
        }, this);
        deferred.resolve(true);

        return deferred;
      },

      /**
      * add graphics on the map
      * @param {object} symbol contains details of the symbol to be added
      * @param {object} geometry of the graphic
      * @param {string} layer to which we add the graphic
      */
      _createAndAddGraphic: function (symbol, geometry, layer) {
        var graphic = new Graphic(geometry, symbol, null, null);
        layer.add(graphic);
      }

    });
  }
);
