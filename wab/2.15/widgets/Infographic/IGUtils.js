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
    'dojo/Deferred',
    'dojo/_base/lang',
    'dojo/promise/all',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'jimu/LayerInfos/LayerInfos',
    'jimu/DataSourceManager',
    'jimu/utils',
    './utils'
  ],
  function(declare, Deferred, lang, all, EsriQuery, QueryTask, LayerInfos, DataSourceManager, jimuUtils, utils) {
    return declare([], {
      constructor: function(options) {
        this.appConfig = options.appConfig;
        this.map = options.map;
        this.layerInfosObj = LayerInfos.getInstanceSync();
        this.dataSourceManager = DataSourceManager.getInstance();
        this.cacheData = {};
      },

      destroy: function() {
        this.appConfig = null;
        this.map = null;
        this.layerInfosObj = null;
        this.dataSourceManager = null;
        this.cacheData = null;
      },

      //----pre processing data source----
      //return popupInfo, layerObject, featureLayerForFrameWork
      preprocessingDataSource: function(dataSource) {
        var deferred = new Deferred();
        if (!dataSource) {
          deferred.resolve();
          return deferred;
        }
        var result = this._tryGetLayerIdDataSchema(dataSource);
        var layerId = result.layerId;
        var dataSchema = result.dataSchema;
        var def1 = this._tryGetLayerObject(layerId);
        var def2 = this._tryGetLayerForFrameWork(dataSchema, dataSource);
        all([def1, def2]).then(function(res) {
          var ret = res[0];
          var layerObject = ret && ret.layerObject;
          var popupInfo = ret && ret.popupInfo;
          var featureLayerForFrameWork = res[1];
          deferred.resolve({
            layerObject: layerObject,
            popupInfo: popupInfo,
            featureLayerForFrameWork: featureLayerForFrameWork
          });
        }, function(error) {
          deferred.reject(error);
        });
        return deferred;
      },

      getFeaturesForSetting: function(dataSource) {
        var deferred = new Deferred();
        if (!dataSource) {
          deferred.resolve();
          return deferred;
        }
        this.getFeaturesByDataSource(dataSource).then(function(features) {
          features = this._cutFeaturesForSetting(features);
          deferred.resolve(features);
        }.bind(this), function(error) {
          deferred.reject(error);
        });
        return deferred;
      },

      preprocessingDataSourceForSetting: function(dataSource) {
        var deferred = new Deferred();
        if (!dataSource) {
          deferred.resolve();
          return deferred;
        }
        var result = this._tryGetLayerIdDataSchema(dataSource);
        var layerId = result.layerId;
        var dataSchema = result.dataSchema;
        var def1 = this._tryGetLayerObject(layerId);
        var def2 = this._tryGetLayerForFrameWork(dataSchema, dataSource);
        var def3 = this.getLayerDefinitionByDataSource(dataSource, layerId);
        all([def1, def2, def3]).then(function(res) {
          var ret = res[0];
          var layerObject = ret && ret.layerObject;
          var popupInfo = ret && ret.popupInfo;
          var featureLayerForFrameWork = res[1];
          var definition = res[2];
          deferred.resolve({
            layerObject: layerObject,
            popupInfo: popupInfo,
            featureLayerForFrameWork: featureLayerForFrameWork,
            definition: definition
          });
        }.bind(this), function(error) {
          deferred.reject(error);
        });
        return deferred;
      },

      preprocessingDataSourceForRange: function(dataSource) {
        var deferred = new Deferred();
        if (!dataSource) {
          deferred.resolve();
          return deferred;
        }
        var result = this._tryGetLayerIdDataSchema(dataSource);
        var layerId = result.layerId;
        var def1 = this.getLayerDefinitionByDataSource(dataSource, layerId);
        var def2 = this.getFeaturesByDataSource(dataSource);
        all([def1, def2]).then(function(res) {
          var definition = res[0];
          var features = res[1];
          features = this._cutFeaturesForSetting(features);

          deferred.resolve({
            definition: definition,
            features: features
          });
        }.bind(this), function(error) {
          deferred.reject(error);
        });
        return deferred;
      },

      _tryGetLayerIdDataSchema: function(dataSource) {
        var result = {
          layerId: '',
          dataSchema: null
        };
        if (dataSource.layerId) {
          this.dsType = 'CLIENT_FEATURES';
          result.layerId = dataSource.layerId;
        } else if (dataSource.frameWorkDsId) {
          var dsInfo = utils.getDsTypeInfoMeta(dataSource.frameWorkDsId, this.appConfig);
          var dsMeta = dsInfo && dsInfo.dsMeta;
          if (!dsMeta) {
            return result;
          }
          if (dsMeta.type === 'Features') {
            this.dsType = 'FRAMEWORK_FEATURES';
          } else if (dsMeta.type === 'FeatureStatistics') {
            this.dsType = 'FRAMEWORK_STATISTICS';
          }
          result.dataSchema = dsMeta.dataSchema;
          var dsTypeInfo = utils.parseDataSourceId(dsMeta.id);
          result.layerId = dsTypeInfo && dsTypeInfo.layerId;
        }
        return result;
      },

      _tryGetLayerObject: function(layerId) {
        var deferred = new Deferred();
        if (!layerId) {
          deferred.resolve();
          return deferred;
        }
        var layerInfo = this._tryGetLayerInfo(layerId);
        if (!layerInfo) {
          console.error('Invalid data source');
          deferred.resolve();
          return deferred;
        }
        var popupInfo = layerInfo.getPopupInfo();
        layerInfo.getLayerObject().then(function(layerObject) {
          deferred.resolve({
            layerObject: layerObject,
            popupInfo: popupInfo
          });
        }.bind(this), function(error) {
          deferred.reject(error);
        });
        return deferred;

      },

      _tryGetLayerForFrameWork: function(dataSchema, dataSource) {
        var deferred = new Deferred();
        if (!dataSchema) {
          deferred.resolve();
          return deferred;
        }
        var inputParams = dataSchema;
        var dsType = this._getDataSourceType(dataSource);
        if (dsType === 'FRAMEWORK_STATISTICS') {
          inputParams = utils.mockLayerDefinitionForSTD(dataSchema);
        }
        utils.getLoadedLayer(inputParams).then(function(featureLayerForFrameWork) {
          deferred.resolve(featureLayerForFrameWork);
        }.bind(this), function(error) {
          deferred.reject(error);
        });
        return deferred;
      },

      _tryGetLayerInfo: function(layerId) {
        var layerInfo = this.layerInfosObj.getLayerInfoById(layerId);
        if (!layerInfo) {
          layerInfo = this.layerInfosObj.getTableInfoById(layerId);
        }
        return layerInfo;
      },

      getLayerDefinitionByDataSource: function(dataSource, layerId) {
        var deferred = new Deferred();
        if (!dataSource) {
          console.error('Invalid data source');
          deferred.resolve();
          return deferred;
        }
        var layerInfo, popupInfo;
        if (dataSource.layerId) {
          layerInfo = this._tryGetLayerInfo(dataSource.layerId);
          if (!layerInfo) {
            deferred.reject('Invalid data source');
            return deferred;
          }
          popupInfo = layerInfo.getPopupInfo();
          this._getServiceDefinitionByLayerInfo(layerInfo).then(function(definition) {
            utils.addAliasForLayerDefinition(definition, popupInfo);
            deferred.resolve(definition);
          }.bind(this), function(error) {
            deferred.reject(error);
          });
          return deferred;
        } else if (dataSource.frameWorkDsId) {
          if (layerId) {
            layerInfo = this._tryGetLayerInfo(layerId);
            if (layerInfo) {
              popupInfo = layerInfo.getPopupInfo();
            }
          }
          var definition = null;
          var frameWorkDsId = dataSource.frameWorkDsId;
          var dataSources = this.appConfig.dataSource && this.appConfig.dataSource.dataSources;
          var dsMeta = dataSources[frameWorkDsId];
          //dataSource, dsTypeInfo, dsMeta
          if (dsMeta.type === 'Features') {
            definition = lang.clone(dsMeta.dataSchema);
            utils.addAliasForLayerDefinition(definition, popupInfo);
            deferred.resolve(definition);
            return deferred;
          } else if (dsMeta.type === 'FeatureStatistics') {
            definition = {
              type: 'Table',
              fields: []
            };
            var dataSchema = lang.clone(dsMeta.dataSchema);
            definition.fields = dataSchema.fields;

            if (dataSchema.groupByFields && dataSchema.groupByFields[0]) {
              definition.groupByFields = lang.clone(dataSchema.groupByFields);
            }

            utils.addAliasForLayerDefinition(definition, popupInfo);
            deferred.resolve(definition);
            return deferred;
          }
        }
      },

      _getDataSourceType: function(dataSource) {
        if (!dataSource) {
          return;
        }
        if (dataSource.layerId) {
          return 'CLIENT_FEATURES';
        } else if (dataSource.frameWorkDsId) {
          var dsInfo = utils.getDsTypeInfoMeta(dataSource.frameWorkDsId, this.appConfig);
          var dsMeta = dsInfo && dsInfo.dsMeta;
          if (!dsMeta) {
            return;
          }
          if (dsMeta.type === 'Features') {
            return 'FRAMEWORK_FEATURES';
          } else if (dsMeta.type === 'FeatureStatistics') {
            return 'FRAMEWORK_STATISTICS';
          }
        }
      },

      _getServiceDefinitionByLayerInfo: function(layerInfo) {
        var deferred = new Deferred();
        layerInfo.getServiceDefinition().then(lang.hitch(this, function(definition) {
          if (definition) {
            deferred.resolve(definition);
          } else {
            layerInfo.getLayerObject().then(function(layerObject) {
              if (layerObject) {
                var layerDefinition = jimuUtils.getFeatureLayerDefinition(layerObject);
                deferred.resolve(layerDefinition);
              } else {
                deferred.resolve(null);
              }
            }, function(error) {
              deferred.reject(error);
            });
          }
        }));
        return deferred;
      },

      getFeaturesByDataSource: function(dataSource) {
        var deferred = new Deferred();
        var features = null;
        if (dataSource.dataSourceType === "DATA_SOURCE_FEATURE_LAYER_FROM_MAP") {
          var layerId = dataSource.layerId;
          if (!layerId) {
            deferred.resolve();
            return deferred;
          }
          this._getFeaturesForMapDS(layerId).then(function(featureSet) {
            features = featureSet.features;
            deferred.resolve(features);
          }, function(error) {
            deferred.reject(error);
          });
          return deferred;
        } else {
          var frameWorkDsId = dataSource.frameWorkDsId;
          if (!frameWorkDsId) {
            deferred.resolve();
            return deferred;
          }
          this.getFeaturesForFrameDS(frameWorkDsId).then(function(featureSet) {
            features = featureSet.features;
            deferred.resolve(features);
          }, function(error) {
            deferred.reject(error);
          });
          return deferred;
        }
      },

      _cutFeaturesForSetting: function(features) {
        if (features && features.length > 1000) {
          features = features.slice(0, 1000);
        }
        return features;
      },

      _getFeaturesForMapDS: function(layerId) {
        var deferred = new Deferred();
        var layerInfo = this._tryGetLayerInfo(layerId);
        if (!layerInfo) {
          deferred.reject('Can not get layerInfo by the layer id of this data source.');
          return deferred;
        }
        var url = layerInfo.getUrl();
        var filter = layerInfo.getFilter();
        if (!url) {
          console.warn('Invalid layer url of data source, use client features.');
          layerInfo.getLayerObject().then(function(layerObject) {
            deferred.resolve({
              features: layerObject.graphics
            });
          });
          return deferred;
        }
        var queryParams = new EsriQuery();
        queryParams.outSpatialReference = this.map.spatialReference;
        queryParams.where = filter || "1=1";
        queryParams.outFields = ['*'];
        queryParams.returnGeometry = false;
        var queryTask = new QueryTask(url);
        return queryTask.execute(queryParams);
      },

      getFeaturesForFrameDS: function(frameWorkDsId) {
        var deferred = new Deferred();
        if (this.cacheData[frameWorkDsId]) {
          deferred.resolve(this.cacheData[frameWorkDsId]);
          return deferred;
        }
        var dsTypeInfo = utils.parseDataSourceId(frameWorkDsId);
        if (dsTypeInfo.from === 'widget') {
          //If other widget output data is used, no preview function is provided in setting.
          deferred.resolve({});
          return deferred;
        }
        var dataSourceConfig = this.dataSourceManager.getDataSourceConfig(frameWorkDsId);
        dataSourceConfig = lang.clone(dataSourceConfig);
        if (!dataSourceConfig) {
          deferred.reject('Can not get vaild data source config by the frameWorkDsId of this data source.');
          return deferred;
        }
        //remove filter by extent
        dataSourceConfig.filterByExtent = false;
        this.dataSourceManager.doQuery(dataSourceConfig).then(function(featureSet) {
          this.cacheData[frameWorkDsId] = featureSet;
          deferred.resolve(featureSet);
        }.bind(this), function(error) {
          deferred.reject(error);
        });
        return deferred;
      }
    });
  });