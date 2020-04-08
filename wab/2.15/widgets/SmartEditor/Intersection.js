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
define(
  ["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "jimu/BaseWidgetSetting",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/geometry/Extent",
    "esri/geometry/geometryEngine",
    "esri/SpatialReference",
    "esri/geometry/webMercatorUtils",
    "dojo/_base/array"
  ],
  function (
    declare,
    lang,
    Deferred,
    BaseWidgetSetting,
    Query,
    QueryTask,
    Extent,
    geometryEngine,
    SpatialReference,
    webMercatorUtils,
    array
  ) {
    return declare([BaseWidgetSetting], {
      baseClass: "jimu-widget-smartEditor-widgets-intersection",
      layerFieldsObj: {},
      queriedLayers: [],
      layersInvolvedInIgnoreLayerRanking: [],
      maxToleranceForlayer: {},
      maxToleranceForlayerInPx: {},
      completeFeatures: {},

      postCreate: function () {
        this.startup();
        this.layerFieldsObj = {};
        this.queriedLayers = [];
        this.maxToleranceForlayer = {};
        this.maxToleranceForlayerInPx = {};
        this.layersInvolvedInIgnoreLayerRanking = [];
        this.completeFeatures = [];
      },

      startup: function () {
      },

      _canGetGeodesicBuffers: function (geometry) {
        var outSR;
        outSR = new SpatialReference(4326);
        if (geometry &&
          webMercatorUtils.canProject(geometry, outSR)) {
          return true;
        }
        return false;
      },

      _getbufferedGeometry: function (featureGeometry, bufferDistance) {
        var bufferedGeometries;
        if (this._canGetGeodesicBuffers(featureGeometry)) {
          bufferedGeometries =
            geometryEngine.geodesicBuffer([featureGeometry],
              [bufferDistance], "meters", true);
        } else {
          bufferedGeometries =
            geometryEngine.buffer([featureGeometry],
              [bufferDistance], "meters", true);
        }
        if (bufferedGeometries && bufferedGeometries.length > 0) {
          return bufferedGeometries[0];
        } else {
          return null;
        }
      },

      getToleranceValueInMeters: function (toleranceSettings) {
        var value, unit, valueInMeters;
        valueInMeters = 0;
        if (toleranceSettings) {
          if (toleranceSettings.useDefault) {
            value = this.defaultToleranceSettings.value;
            unit = this.defaultToleranceSettings.unit;
          } else {
            value = toleranceSettings.value;
            unit = toleranceSettings.unit;
          }
          valueInMeters = this.convertToMeters(value, unit);
        }
        return valueInMeters;
      },

      setMaxToleranceForLayer: function (layerId, toleranceSettings) {
        var valueInMeters, valueInPixels;
        valueInMeters = this.getToleranceValueInMeters(toleranceSettings);
        if (toleranceSettings && toleranceSettings.unit === "px" &&
          !toleranceSettings.useDefault) {
          valueInPixels = toleranceSettings.value;
          if (!this.maxToleranceForlayerInPx.hasOwnProperty(layerId) ||
            this.maxToleranceForlayerInPx[layerId] < valueInPixels) {
            this.maxToleranceForlayerInPx[layerId] = valueInPixels;
          }
        } else {
          //Use value only
          //if value is greater than zero and
          //maxTolerance for this layer is not availabel OR
          //the new value in meters is greater than prev max value
          if (valueInMeters > 0 &&
            (!this.maxToleranceForlayer.hasOwnProperty(layerId) ||
              this.maxToleranceForlayer[layerId] < valueInMeters)) {
            this.maxToleranceForlayer[layerId] = valueInMeters;
          } else if (valueInMeters === 0) {
            valueInPixels = this.defaultPixelsTolerance;
            if (!this.maxToleranceForlayerInPx.hasOwnProperty(layerId) ||
              this.maxToleranceForlayerInPx[layerId] < valueInPixels) {
              this.maxToleranceForlayerInPx[layerId] = valueInPixels;
            }
          }
        }
      },

      convertToMeters: function (length, inputUnit) {
        var convertedLength = length;
        switch (inputUnit) {
          case "meters":
            convertedLength = length;
            break;
          case "feet":
            convertedLength = length * 0.3048;
            break;
          case "kilometers":
            convertedLength = length * 1000;
            break;
          case "miles":
            convertedLength = length * 1609.34;
            break;
        }
        return convertedLength;
      },

      getDistinctLayers: function (selectedLayerInfo, featureGeometry) {
        var completeDef, allDef, distinctLayers;
        allDef = new Deferred();
        completeDef = new Deferred();
        distinctLayers = {};
        this.layerFieldsObj = {};
        this.queriedLayers = [];
        this.ignoreLayerRanking = false;
        this.drawnGeometry = featureGeometry;
        //Loop through all the field values
        if (selectedLayerInfo.fieldValues) {
          for (var fieldName in selectedLayerInfo.fieldValues) {
            distinctLayers[fieldName] = [];
            for (var i = 0; i < selectedLayerInfo.fieldValues[fieldName].length; i++) {
              var copyAction = selectedLayerInfo.fieldValues[fieldName][i];
              if (copyAction.actionName === "Intersection" && copyAction.enabled) {
                if (copyAction.ignoreLayerRanking) {
                  this.ignoreLayerRanking = true;
                }
                for (var j = 0; j < copyAction.fields.length; j++) {
                  var field = copyAction.fields[j];
                  if (distinctLayers[fieldName].indexOf(field.layerId) === -1) {
                    distinctLayers[fieldName].push(field.layerId);
                  }
                  if (this.layersInvolvedInIgnoreLayerRanking.indexOf(field.layerId) === -1 &&
                    copyAction.ignoreLayerRanking) {
                    this.layersInvolvedInIgnoreLayerRanking.push(field.layerId);
                  }
                  this.setMaxToleranceForLayer(field.layerId, field.toleranceSettings);
                }
              }
            }
          }
          this._getIntersectionsForEachField(distinctLayers, featureGeometry, completeDef);
        } else {
          completeDef.resolve({});
        }

        //Deferred object listening for entire process completion
        completeDef.then(lang.hitch(this, function () {
          var result = {};
          //Process the resulted features based on configured settings for each individual field
          //and find closest or use the priority to get he field value
          if (selectedLayerInfo.fieldValues) {
            for (var fieldName in selectedLayerInfo.fieldValues) {
              result[fieldName] = {};
              for (var i = 0; i < selectedLayerInfo.fieldValues[fieldName].length; i++) {
                var copyAction = selectedLayerInfo.fieldValues[fieldName][i];
                //nly process intersection action and when it is enabled
                if (copyAction.actionName === "Intersection" && copyAction.enabled) {
                  //if ignore layer ranking is no find closest feature
                  //else get according to priority
                  if (copyAction.ignoreLayerRanking) {
                    result[fieldName] = this._getClosestFeature(copyAction.fields);
                  } else {
                    for (var j = 0; j < copyAction.fields.length; j++) {
                      var featureAttributes, field, layerId, attr;
                      field = copyAction.fields[j];
                      layerId = field.layerId;
                      if (!result[fieldName].hasOwnProperty(layerId)) {
                        featureAttributes =
                          this._getProcessedFeature(layerId, field.toleranceSettings);
                        if (featureAttributes) {
                          //store only those field from which the value needs to be copied
                          attr = {};
                          attr[field.field] = featureAttributes[field.field];
                          result[fieldName][layerId] = attr;
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          allDef.resolve(result);
        }));
        return allDef.promise;
      },

      _getIntersectingFeatures: function (layerId, toleranceSettings) {
        var i, intersectingFeatures, bufferedGeometry, toleranceValueInMeters, allFeatures;
        intersectingFeatures = [];
        toleranceValueInMeters = 0;
        if (this.completeFeatures.hasOwnProperty(layerId)) {
          allFeatures = this.completeFeatures[layerId];
          if (toleranceSettings && toleranceSettings.unit !=="px") {
            toleranceValueInMeters = this.getToleranceValueInMeters(toleranceSettings);
          }
          //We are querying 1 layer only 1 time
          //although it may be used multiple time in intersection
          //and while querying we are only querying with maximum tolerance settings
          //So, now when finding features we must consider only those features
          //which are intersecting the tolerance settings for this insctance of the layers config
          if (allFeatures.length > 0) {
            //If tolerance value, Draw buffer using current tolerance settings for this layer
            //else use the geometry as it is and in case of point use 20px tolerance
            if (toleranceValueInMeters) {
              bufferedGeometry =
                this._getbufferedGeometry(this.drawnGeometry, toleranceValueInMeters);
            } else {
              //if no max tolerance means no geometry will be returned for this layer
              //so in such case consider all the features as intersectng to geometry
              //else set buffered geometry and check intersection
              if ((!this.maxToleranceForlayer.hasOwnProperty(layerId) ||
                !this.maxToleranceForlayer[layerId]) &&
                (!this.maxToleranceForlayerInPx.hasOwnProperty(layerId) ||
                !this.maxToleranceForlayerInPx[layerId])) {
                intersectingFeatures = allFeatures;
              } else {
                if (this.drawnGeometry.type === "point") {
                  if (this.maxToleranceForlayerInPx.hasOwnProperty(layerId)) {
                      bufferedGeometry = this.pointToExtent(this.map, this.drawnGeometry,
                        this.maxToleranceForlayerInPx[layerId]);
                    } else {
                      bufferedGeometry = this.pointToExtent(this.map, this.drawnGeometry,
                        this.defaultPixelsTolerance);
                    }

                } else {
                  bufferedGeometry = this.drawnGeometry;
                }
              }
            }
            //loop through all the features for this layer and only consider those are
            //intersecting the current bufferedGeometry
            if (bufferedGeometry) {
              for (i = 0; i < allFeatures.length; i++) {
                var feature = allFeatures[i];
                if (feature.geometry &&
                  geometryEngine.intersects(bufferedGeometry, feature.geometry)) {
                  intersectingFeatures.push(feature);
                }
              }
            }
          }
        }
        return intersectingFeatures;
      },

      _getClosestFeature: function (fields) {
        var returnValue, featureAttributes, layerObject, layerId, j, i,
          allIntersectingFeatures = [], attr;
        returnValue = {};
        //get all features from all layers which are intersecting
        //the drawn geometry OR tolerance settings
        for (j = 0; j < fields.length; j++) {
          var intersectingFeatures = [];
          layerId = fields[j].layerId;
          //get intersecting features accroding to current tolerance settings
          intersectingFeatures = this._getIntersectingFeatures(
            layerId, fields[j].toleranceSettings);
          //Get the distance between drawn geometry and all intersecting features
          //this will be used to sort the features
          //to get the closest among all layers features
          for (i = 0; i < intersectingFeatures.length; i++) {
            //add distance to location in feature
            if (this.drawnGeometry && intersectingFeatures[i].geometry) {
              intersectingFeatures[i].distanceToLocation =
                geometryEngine.distance(this.drawnGeometry,
                  intersectingFeatures[i].geometry, "meters");
            }
            //add layerId in feature
            intersectingFeatures[i].layerId = layerId;
            //add field from which the value needs to be copied
            if (intersectingFeatures[i].fields) {
              intersectingFeatures[i].fields.push(fields[j].field);
            } else {
              intersectingFeatures[i].fields = [fields[j].field];
            }
          }
          allIntersectingFeatures = allIntersectingFeatures.concat(intersectingFeatures);
        }
        //If intersecting features found then sort them and create attributes according
        //to the closest feature and add esriCTUseLayerName(layer name) of the closet feature
        if (allIntersectingFeatures.length > 0) {
          //apply sorting by calculated distance on the all the features of all layers
          allIntersectingFeatures.sort(function (a, b) {
            if (a.distanceToLocation < b.distanceToLocation) {
              return -1;
            }
            if (a.distanceToLocation > b.distanceToLocation) {
              return 1;
            }
            return 0;
          });
          //get the attributes of first closest feature
          featureAttributes = allIntersectingFeatures[0].attributes;
          //get the result layer object to get its name
          layerObject =
            this._jimuLayerInfos.getLayerOrTableInfoById(
              allIntersectingFeatures[0].layerId).layerObject;
          //add esriCTUseLayerName attribute so that it could be used if configured
          featureAttributes.esriCTUseLayerName = layerObject.name;
          //store only those field from which the value needs to be copied
          attr = {};
          array.forEach(allIntersectingFeatures[0].fields, function (fName) {
            attr[fName] = featureAttributes[fName];
          });
          //store return value by the closest feauter attributes and its layer id
          returnValue[allIntersectingFeatures[0].layerId] = attr;
        }
        return returnValue;
      },

      _getProcessedFeature: function (layerId, toleranceSettings) {
        var layerObject, featureAttributes, intersectingFeatures;
        intersectingFeatures = [];
        //get intersecting features accroding to current tolerance settings
        intersectingFeatures = this._getIntersectingFeatures(
          layerId, toleranceSettings);
        if (intersectingFeatures.length > 0) {
          featureAttributes = intersectingFeatures[0].attributes;
          //get the result layer object to get its name
          layerObject = this._jimuLayerInfos.getLayerOrTableInfoById(layerId).layerObject;
          //add esriCTUseLayerName attribute so that it could be used if configured
          featureAttributes.esriCTUseLayerName = layerObject.name;
        }
        return featureAttributes;
      },

      _getIntersectionsForEachField: function (distinctLayers, featureGeometry, completeDef) {
        var allFieldForSelectedLayer, layerWithToleranceValue;
        allFieldForSelectedLayer = Object.keys(distinctLayers);
        layerWithToleranceValue = 0;
        //get length of layers which have any tolrenace settings applied
        if (this.maxToleranceForlayer) {
          layerWithToleranceValue = Object.keys(this.maxToleranceForlayer).length;
        }
        //Fire intersection request for all the valid layers in field values
        if (allFieldForSelectedLayer.length > 0) {
          var fieldName = allFieldForSelectedLayer[0];
          var promise;
          //if none of the field have ignoreLayerRanking enabled  or
          //if thier is tolernace defiend for any layer, then get the featueres by async request
          //else use sync request so that it will help in reducing the server request
          //if the result is found
          if (this.ignoreLayerRanking || layerWithToleranceValue > 0) {
            promise = this._asyncIntersectionRequests(distinctLayers[fieldName], featureGeometry);
          } else {
            promise = this._syncIntersectionRequests(distinctLayers[fieldName], featureGeometry);
          }
          promise.then(lang.hitch(this, function () {
            if (this.ignoreLayerRanking || layerWithToleranceValue > 0) {
              if (distinctLayers[fieldName] && distinctLayers[fieldName].length === 0) {
                delete distinctLayers[fieldName];
              }
            } else {
              delete distinctLayers[fieldName];
            }
            this._getIntersectionsForEachField(distinctLayers, featureGeometry, completeDef);
          }));
        } else {
          completeDef.resolve();
        }
      },

      _filterQueriedLayers: function (distinctLayers) {
        var layerId;
        //Filter already queried layers
        //This will reduce the server load and improve the response time
        for (layerId in this.layerFieldsObj) {
          var index = distinctLayers.indexOf(layerId);
          if (index > -1) {
            distinctLayers.splice(index, 1);
          }
        }
        return distinctLayers;
      },

      _asyncIntersectionRequests: function (distinctLayers, geometry, fieldDef) {
        if (!fieldDef) {
          fieldDef = new Deferred();
        }
        distinctLayers = this._filterQueriedLayers(distinctLayers);
        if (distinctLayers.length > 0) {
          var promise = this._getIntersectedFeatures(distinctLayers[0], geometry);
          promise.then(lang.hitch(this, function (result) {
            distinctLayers.splice(0, 1);
            if (distinctLayers.length > 0) {
              this._asyncIntersectionRequests(distinctLayers, geometry, fieldDef);
              this._intersectionResult(result);
            } else {
              this._intersectionResult(result, fieldDef);
            }
          }));
        } else {
          fieldDef.resolve();
        }
        return fieldDef.promise;
      },

      _syncIntersectionRequests: function (distinctLayers, geometry, fieldDef) {
        if (!fieldDef) {
          fieldDef = new Deferred();
        }
        distinctLayers = this._filterQueriedLayers(distinctLayers);
        if (distinctLayers.length > 0) {
          var promise = this._getIntersectedFeatures(distinctLayers[0], geometry);
          promise.then(lang.hitch(this, function (result) {
            if (result.features.length > 0) {
              this._intersectionResult(result, fieldDef);
            } else {
              distinctLayers.splice(0, 1);
              if (distinctLayers.length > 0) {
                this._syncIntersectionRequests(distinctLayers, geometry, fieldDef);
              } else {
                this._intersectionResult(result, fieldDef);
              }
            }
          }));
        } else {
          fieldDef.resolve();
        }
        return fieldDef.promise;
      },

      _intersectionResult: function (result, fieldDef) {
        //Store the data for further use
        if (result.layerId) {
          this.layerFieldsObj[result.layerId] = {};
          if (result.features && result.features.length > 0) {
            //store intersected features attributes
            this.layerFieldsObj[result.layerId] = result.featuresAttributes;
          }
        }
        if (fieldDef) {
          fieldDef.resolve();
        }
      },

      //ref: https://blogs.esri.com/esri/arcgis/2010/02/08/find-graphics-under-a-mouse-click-with-the-arcgis-api-for-javascript/
      pointToExtent: function (map, point, toleranceInPixel) {
        if (toleranceInPixel === 0) {
          return point;
        }
        //calculate map coords represented per pixel
        var pixelWidth = map.extent.getWidth() / map.width;
        //calculate map coords for tolerance in pixel
        var toleraceInMapCoords = toleranceInPixel * pixelWidth;
        //calculate & return computed extent
        return new Extent(point.x - toleraceInMapCoords,
          point.y - toleraceInMapCoords,
          point.x + toleraceInMapCoords,
          point.y + toleraceInMapCoords,
          map.spatialReference);
      },

      _getAppropriateGeometryForQuery: function (layerId, featureGeometry) {
        var returGeometry;
        //if tolreance value is defiend for this layer use it otherwise
        //use the geometry as it is for geometries other than point
        //and for point check if it has maxPixels tolerance then use it
        //else calculate the point to extent of 20px tolerance
        if (this.maxToleranceForlayer.hasOwnProperty(layerId)) {
          returGeometry =
            this._getbufferedGeometry(featureGeometry, this.maxToleranceForlayer[layerId]);
        } else {
          returGeometry = featureGeometry;
          if (featureGeometry.type === "point") {
            if (this.maxToleranceForlayerInPx.hasOwnProperty(layerId)) {
              returGeometry = this.pointToExtent(this.map, featureGeometry,
                this.maxToleranceForlayerInPx[layerId]);
            } else {
              returGeometry = this.pointToExtent(this.map, featureGeometry,
                this.defaultPixelsTolerance);
            }
          }
        }
        return returGeometry;
      },

      _getIntersectedFeatures: function (layerId, featureGeometry) {
        var layerDef, query, queryTask, attributes, layerObject, objectIdField, layerExpression;
        layerDef = new Deferred();
        //get layers instance from map, if its not available consider it returns 0 features
        if (this._jimuLayerInfos.getLayerOrTableInfoById(layerId)) {
          layerObject = this._jimuLayerInfos.getLayerOrTableInfoById(layerId).layerObject;
        }
        else {
          layerDef.resolve({
            "layerId": layerId,
            "features": [],
            "featuresAttributes": {}
          });
          return layerDef.promise;
        }
        objectIdField = layerObject.objectIdField;
        query = new Query();
        queryTask = new QueryTask(layerObject.url);
        query.geometry = this._getAppropriateGeometryForQuery(layerId, featureGeometry);
        query.outFields = ["*"];
        //fetch the filters applied on the layer and use it
        layerExpression = layerObject.getDefinitionExpression();
        if (layerExpression) {
          query.where = layerExpression;
        }
        //Get geometries only for those layers which are involved in ignoreLayerRanking
        //Or layers which have tolerance settings
        if (this.layersInvolvedInIgnoreLayerRanking.indexOf(layerId) > -1 ||
          this.maxToleranceForlayer.hasOwnProperty(layerId)||
          this.maxToleranceForlayerInPx.hasOwnProperty(layerId)) {
          query.returnGeometry = true;
          query.outSpatialReference = new SpatialReference(
            featureGeometry.spatialReference.toJson()
          );
        } else {
          query.returnGeometry = false;
        }
        queryTask.execute(query, lang.hitch(this, function (result) {
          if (result && result.features && result.features.length > 0) {
            //sort the feature and take the feature with latest OID
            result.features.sort(function (firstFeature, secondFeature) {
              var firstFeatureOID, secondFeatureOID;
              firstFeatureOID = parseInt(firstFeature.attributes[objectIdField], 10);
              secondFeatureOID = parseInt(secondFeature.attributes[objectIdField], 10);
              if (firstFeatureOID < secondFeatureOID) {
                return 1;
              }
              return 0;
            });
            attributes = result.features[0].attributes;
          } else {
            result = {
              "features": []
            };
            attributes = {};
          }
          this.completeFeatures[layerId] = result.features;
          layerDef.resolve({
            "layerId": layerId,
            "features": result.features,
            "featuresAttributes": attributes
          });
        }), lang.hitch(this, function () {
          this.completeFeatures[layerId] = [];
          layerDef.resolve({
            "layerId": layerId,
            "features": [],
            "featuresAttributes": {}
          });
        }));
        return layerDef.promise;
      }
    });
  });