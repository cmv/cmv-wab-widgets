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
      },

      //----pre processing data source----
      //return popupInfo, layerObject, featureLayerForFrameWork
      preprocessingDataSource: function(dataSource) {
        var result = this._tryGetLayerIdDataSchema(dataSource);
        var layerId = result.layerId;
        var dataSchema = result.dataSchema;
        var def1 = this._tryGetLayerObject(layerId);
        var def2 = this._tryGetLayerForFrameWork(dataSchema);
        var def3 = this.getLayerDefinitionByDataSource(dataSource);
        var def4 = this.getFeaturesByDataSource(dataSource);
        return all([def1, def2, def3, def4]).then(function(res) {
          var ret = res[0];
          var layerObject = ret && ret.layerObject;
          var popupInfo = ret && ret.popupInfo;
          var featureLayerForFrameWork = res[1];
          var definition = res[2];
          var features = res[3];
          return {
            layerObject: layerObject,
            popupInfo: popupInfo,
            featureLayerForFrameWork: featureLayerForFrameWork,
            definition: definition,
            features: features
          };
        });
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
        var layerInfo = this.layerInfosObj.getLayerInfoById(layerId);
        if (!layerInfo) {
          layerInfo = this.layerInfosObj.getTableInfoById(layerId);
        }
        if (!layerInfo) {
          console.error('Invaild data source');
          deferred.resolve();
          return deferred;
        }
        var popupInfo = layerInfo.getPopupInfo();
        return layerInfo.getLayerObject().then(function(layerObject) {
          return {
            layerObject: layerObject,
            popupInfo: popupInfo
          };
        }.bind(this));

      },

      _tryGetLayerForFrameWork: function(dataSchema) {
        var deferred = new Deferred();
        if (!dataSchema) {
          deferred.resolve();
          return deferred;
        }
        var inputParams = dataSchema;
        if (this.dsType === 'FRAMEWORK_STATISTICS') {
          inputParams = utils.mockLayerDefinitionForSTD(dataSchema);
        }
        return utils.getLoadedLayer(inputParams).then(function(featureLayerForFrameWork) {
          return featureLayerForFrameWork;
        }.bind(this));
      },

      getLayerDefinitionByDataSource: function(dataSource) {
        var deferred = new Deferred();
        if (!dataSource) {
          deferred.reject('Invaild data source');
          return deferred;
        }
        if (dataSource.layerId) {
          var layerInfo = this.layerInfosObj.getLayerInfoById(dataSource.layerId);
          var popupInfo = layerInfo.getPopupInfo();
          if (layerInfo) {
            this._getServiceDefinitionByLayerInfo(layerInfo).then(function(definition) {
              this._addAliasForLayerDefinition(definition, popupInfo);
              deferred.resolve(definition);
            }.bind(this));
          }
        } else if (dataSource.frameWorkDsId) {
          var definition = null;
          var frameWorkDsId = dataSource.frameWorkDsId;
          var dataSources = this.appConfig.dataSource && this.appConfig.dataSource.dataSources;
          var dsMeta = dataSources[frameWorkDsId];
          //dataSource, dsTypeInfo, dsMeta
          if (dsMeta.type === 'Features') {
            definition = lang.clone(dsMeta.dataSchema);
            this._addAliasForLayerDefinition(definition);
            deferred.resolve(definition);
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

            this._addAliasForLayerDefinition(definition);
            deferred.resolve(definition);
          }
        }
        return deferred;
      },

      _getServiceDefinitionByLayerInfo: function(layerInfo) {
        return layerInfo.getServiceDefinition().then(lang.hitch(this, function(definition) {
          if (definition) {
            return definition;
          } else {
            return layerInfo.getLayerObject().then(lang.hitch(this, function(layerObject) {
              if (layerObject) {
                return jimuUtils.getFeatureLayerDefinition(layerObject);
              } else {
                return null;
              }
            }));
          }
        }));
      },

      _addAliasForLayerDefinition: function(definition, popupInfo) {
        if (definition && definition.fields && definition.fields.length > 0) {
          definition.fields.forEach(lang.hitch(this, function(fieldInfo) {
            var alias = utils.getFieldAliasByFieldInfo(fieldInfo, popupInfo);
            if (alias) {
              fieldInfo.alias = alias;
            }
          }));
        }
      },

      getFeaturesByDataSource: function(dataSource) {
        return this._getFeaturesByDataSource(dataSource).then(function(featureSet) {
          var features = featureSet && featureSet.features;
          if (!features) {
            features = [];
          }
          if (features && features.length > 1000) {
            features = features.slice(0, 1000);
          }
          return features;
        }.bind(this), function(error) {
          return error;
        }.bind(this));
      },

      _getFeaturesByDataSource: function(dataSource) {
        var deferred = new Deferred();

        //this.config.dataSource: {dataSourceType,frameWorkDsId,name,useSelection}
        if (dataSource.dataSourceType === "DATA_SOURCE_FEATURE_LAYER_FROM_MAP") {
          var layerInfo = this.layerInfosObj.getLayerInfoById(dataSource.layerId);
          if (!layerInfo) {
            deferred.reject('Can not get layerInfo by the layer id of this data source.');
            return deferred;
          }
          var url = layerInfo.getUrl();
          var filter = layerInfo.getFilter();
          if (!url) {
            deferred.reject('Invaild layer url of data source.');
            return deferred;
          }
          var queryParams = new EsriQuery();
          queryParams.outSpatialReference = this.map.spatialReference;
          queryParams.where = filter || "1=1";
          queryParams.outFields = ['*'];
          queryParams.returnGeometry = false;
          var queryTask = new QueryTask(url);
          return queryTask.execute(queryParams);

        } else if (dataSource.dataSourceType === "DATA_SOURCE_FROM_FRAMEWORK") {

          var dataSourceConfig = this.dataSourceManager.getDataSourceConfig(dataSource.frameWorkDsId);

          if (!dataSourceConfig) {
            deferred.reject('Can not get vaild data source config by the frameWorkDsId of this data source.');
            return deferred;
          }
          //remove filter by extent
          dataSourceConfig.filterByExtent = false;
          return this.dataSourceManager.doQuery(dataSourceConfig);
        }
      }

    });
  });