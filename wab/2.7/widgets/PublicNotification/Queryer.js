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
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/Deferred',
  'dojo/dom-style',
  'esri/geometry/geometryEngineAsync',
  'esri/graphic',
  'esri/layers/GraphicsLayer',
  'esri/tasks/BufferParameters',
  'esri/tasks/GeometryService',
  'esri/tasks/query',
  'esri/tasks/QueryTask'
  ], function (
    array,
    declare,
    lang,
    Deferred,
    domStyle,
    geometryEngineAsync,
    Graphic,
    GraphicsLayer,
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
      constructor: function (map, geometryServiceURL) {
        this.map = map;

        // Layer to draw buffer
        this._bufferLayer = new GraphicsLayer();
        this.map.addLayer(this._bufferLayer);

        // Buffering tool
        this._geometryService = new GeometryService(geometryServiceURL);
      },

      createBufferFromGeometries: function (geometriesArray, bufferDistanceMeters) {
        var done, distanceMeters, bufferParams;

        done = new Deferred();
        if (!Array.isArray(geometriesArray)) {
          done.reject('No geometries to buffer');
          return done;
        }

        // Union the geometries; we union before buffering in case distanceMeters is <0 because buffer() sometimes
        // has problems with that
        distanceMeters = bufferDistanceMeters;
        geometryEngineAsync.union(geometriesArray).then(lang.hitch(this, function (unionedGeometries) {
          if (unionedGeometries) {
            if (distanceMeters > 0 || unionedGeometries.type === 'polygon') {
              if (distanceMeters === 0) {
                distanceMeters = -0.1;  // inset polygons a bit to allow for boundary mismatches
              }

              // Buffer the geometries
              bufferParams = new BufferParameters();
              bufferParams.bufferSpatialReference = this.map.spatialReference;
              bufferParams.distances = [distanceMeters];
              bufferParams.geodesic = true;
              bufferParams.geometries = [unionedGeometries];
              bufferParams.outSpatialReference = this.map.spatialReference;
              bufferParams.unit = GeometryService.UNIT_METER;

              this._geometryService.buffer(bufferParams, function (bufferedGeometries) {
                if (Array.isArray(bufferedGeometries) && bufferedGeometries.length > 0) {
                  done.resolve(bufferedGeometries[0]);
                } else {
                  done.reject('Buffering failed');
                }
              });

            } else {
              done.resolve(unionedGeometries);
            }
          } else {
            done.reject('Unioning failed');
          }
        }), function (error) {
          done.reject(error);
        });

        return done;
      },

      findIntersectingFeatures: function (intersectGeometry, featureLayerURL, outfields) {
        var qTask, query, findResultsDef = new Deferred(), findResults = {};

        // Prep the query
        qTask = new QueryTask(featureLayerURL);
        query = new Query();  // defaults to "esriSpatialRelIntersects"
        query.geometry = intersectGeometry;
        query.returnGeometry = true;
        query.outFields = outfields;

        // Execute query task for selecting intersecting/contains features
        qTask.execute(query, lang.hitch(this, function (featureSet) {
          if (featureSet && Array.isArray(featureSet.features) && featureSet.features.length > 0) {
            geometryEngineAsync.union(this._getFeatureGeometries(featureSet.features))
              .then(lang.hitch(this, function (unionedGeometries) {
                var bufferParams;

                if (Array.isArray(unionedGeometries.rings) && unionedGeometries.rings.length > 0) {
                  // Inset polygon geometries so that future use as selectors won't bring
                  // in superfluous areas
                  bufferParams = new BufferParameters();
                  bufferParams.bufferSpatialReference = this.map.spatialReference;
                  bufferParams.distances = [-0.1];
                  bufferParams.geodesic = true;
                  bufferParams.geometries = [unionedGeometries];
                  bufferParams.outSpatialReference = this.map.spatialReference;
                  bufferParams.unit = GeometryService.UNIT_METER;

                  this._geometryService.buffer(bufferParams, function (bufferedGeometries) {
                    if (Array.isArray(bufferedGeometries) && bufferedGeometries.length > 0) {
                      findResults.intersectGeometry = intersectGeometry;
                      findResults.features = featureSet.features;
                      findResults.highlight = bufferedGeometries[0];
                      findResultsDef.resolve(findResults);
                    } else {
                      findResultsDef.reject('Buffering union failed');
                    }
                  });
                } else {
                  // Return point and line geometries as-is
                  findResults.intersectGeometry = intersectGeometry;
                  findResults.features = featureSet.features;
                  findResults.highlight = unionedGeometries;
                  findResultsDef.resolve(findResults);
                }
              }
            ));
          } else {
            // No features; return only the intersect geometry
            findResults.intersectGeometry = intersectGeometry;
            findResults.features = [];
            findResults.highlight = null;
            findResultsDef.resolve(findResults);
          }
        }));

        return findResultsDef;
      },

      find: function (intersectGeometry, featureLayerURL, outfields, tag) {
        var findResultsDef = new Deferred();

        // Query for features in buffer
        this.findIntersectingFeatures(intersectGeometry, featureLayerURL, outfields)
          .then(lang.hitch(this, function (findResults) {
            console.log(findResults.features.length + ' ' + tag + ' features found');
            findResultsDef.resolve(findResults);
          }), function (error) {
            findResultsDef.reject(error);
          });

        return findResultsDef;
      },

      /**
      * add graphics on the map
      * @param {object} symbol contains details of the symbol to be added
      * @param {object} geometry of the graphic
      */
      createAndAddGraphic: function (symbol, geometry) {
        var graphic;
        if (geometry.type === 'polygon') {
          graphic = new Graphic(geometry, symbol, null, null);
        } else {
          graphic = new Graphic(geometry, symbol.outline, null, null);
        }
        this._bufferLayer.add(graphic);
      },

      clearBufferGraphics: function () {
        this._bufferLayer.clear();
      },

      /**
      * Draw polygon around the feature
      * @param {object} feature around which polygon gets drawn
      * @param {boolean} share is either true or false
      * @memberOf widgets/locator/locator
      */
      highlightFeatures: function (symbol, features, determinateProgress) {
        var chunkSize, iChunk = 0, iFeatureStart = 0, numChunks, deferred = new Deferred();

        if (features.length > 0) {
          if (features.length < 3000) {
            this._highlightFeatures(symbol, features);
            deferred.resolve(true);

          } else {
            chunkSize = Math.max(100, Math.round(features.length / 100));

            // Start a determinate progress bar
            //determinateProgress.update({ maximum: 100, progress: 0});
            determinateProgress.set({value: 0});
            domStyle.set(determinateProgress.domNode, 'display', 'block');

            numChunks = Math.ceil(features.length / chunkSize);
            setTimeout(lang.hitch(this, function () {
              this._highlightFeaturesContinuation(symbol, features, determinateProgress, chunkSize, numChunks,
                iChunk, iFeatureStart).then(function () {
                deferred.resolve(true);

                // Done with determinate progress bar
                determinateProgress.set({value: 100});
                domStyle.set(determinateProgress.domNode, 'display', 'none');
              });
            }), 50);
          }
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

          setTimeout(lang.hitch(this, function () {
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
          this.createAndAddGraphic(symbol, feature.geometry);
        }, this);
        deferred.resolve(true);

        return deferred;
      },

      _getFeatureGeometries: function (features) {
        return array.map(features, lang.hitch(this, function (feature) {
          return feature.geometry;
        }));
      }

    });
  }
);
