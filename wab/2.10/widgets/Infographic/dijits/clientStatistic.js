define([
  'jimu/DataSourceManager',
  'jimu/statisticsUtils',
  '../utils'
], function(DataSourceManager, statisticsUtils, utils) {
  var mo = {

    //only used for server statistic for one StatisticDefinition
    getSingleValueForServerStatFeature: function(features) {
      var attributes = features && features[0] && features[0].attributes;
      if (!attributes) {
        return null;
      }
      var key = Object.keys(attributes)[0];
      var value = attributes[key];
      return Number(value);
    },

    //only used for one feature returned by extra no-group statistic ds
    getResultForExtraStatFeature: function(features, config) {
      var field = config.field;
      var type = config.type;
      var searchName, value;
      if (type === 'count') {
        searchName = 'STAT_COUNT';
      } else {
        searchName = utils.upperCaseString(field + '_' + type);
      }
      //Only one feature for Number server stat
      var attributes = features && features[0] && features[0].attributes;
      if (!attributes) {
        return null;
      }
      value = attributes[searchName];
      if (typeof value === 'undefined') {
        searchName = utils.lowerCaseString(searchName);
        value = attributes[searchName];
      }
      return Number(value);
    },
    //config
    // type: count, max, min, sum, avg
    // field: field name
    statistic: function(config, ds, features, appConfig /*optional*/ ) {
      if (!config || !ds || !features) {
        return null;
      }
      var val;
      if (ds.dataSourceType === 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
        val = this.getStatisticResultFromFeatures(features, config);
      } else {
        if (this._getExtalDataSourceType(ds, appConfig) === 'Features') {
          val = this.getStatisticResultFromFeatures(features, config);
        } else {
          val = this.statisticExtraStatSource(config, features);
        }
      }
      return val;
    },

    formatterRangeNumber: function(value) {
      if (!value && value !== 0) {
        return false;
      }

      if (typeof value !== 'number') {
        value = Number(value);
      }

      if (this.isFolatNumber(value)) {
        value = value.toFixed(2);
        value = Number(value);
      }
      return value;
    },

    isFolatNumber: function(number) {
      if (typeof number !== 'number') {
        return false;
      }
      return /^\d+(\.\d+)$/.test(number);
    },

    statisticExtraStatSource: function(config, features) {
      var val;
      if(!features){
        return;
      }
      if (features.length === 0) {
        val = undefined;
      } else if (features.length === 1) {
        val = this._getValueFromFeatureOfExtraStatFeatures(features[0], config);
      } else if (features.length > 1) {
        var ret = {
          count: 0,
          sum: 0
        };
        var v, s, c, ss = 0,
          cs = 0;
        features.forEach(function(f) {
          v = this._getValueFromFeatureOfExtraStatFeatures(f, config);
          switch (config.type) {
            case 'count':
              ret.count += v;
              break;
            case 'sum':
              ret.sum += v;
              break;
            case 'min':
              if (typeof ret.min === 'undefined') {
                ret.min = v;
              } else {
                ret.min = Math.min(ret.min, v);
              }
              break;
            case 'max':
              if (typeof ret.max === 'undefined') {
                ret.max = v;
              } else {
                ret.max = Math.max(ret.max, v);
              }
              break;
            case 'avg':
              c = this._getValueFromFeatureOfExtraStatFeatures(f, {
                type: 'count'
              });
              s = this._getValueFromFeatureOfExtraStatFeatures(f, {
                field: config.field,
                type: 'sum'
              });
              ss += s;
              cs += c;
              break;
            case 'stddev':
              break;
          }
        }.bind(this));

        if (config.type === 'avg') {
          if (cs === 0) {
            ret.avg = 0;
          } else {
            ret.avg = ss / cs;
          }
        }
        val = ret[config.type];
      }

      return val;
    },

    _getValueFromFeatureOfExtraStatFeatures: function(feature, config) {
      if (!feature || !feature.attributes) {
        return config.type === 'count' ? 0 : undefined;
      }
      var mosaicFieldName;
      if (config.type === 'count') {
        mosaicFieldName = 'STAT_COUNT';
      } else {
        mosaicFieldName = utils.upperCaseString(config.field + '_' + config.type);
      }
      var attributes = feature.attributes;
      var v = attributes[mosaicFieldName];
      if (typeof v === 'undefined') {
        mosaicFieldName = utils.lowerCaseString(mosaicFieldName);
        v = attributes[mosaicFieldName];
      }
      return v;
    },

    _getCountValueFromFeatureOfExtraStatFeatures: function(feature) {
      if (!feature || !feature.attributes) {
        return;
      }
      var attributes = feature.attributes;
      var count;
      var mosaicName = 'STAT_COUNT';
      count = attributes[mosaicName];
      if (typeof count === 'undefined') {
        mosaicName = utils.lowerCaseString(mosaicName);
        count = attributes[mosaicName];
      }
      count = count || 0;
      return count;
    },

    getStatisticResultFromFeatures: function(features, config) {
      if(!features){
        return;
      }
      if (config.type === 'count') {
        return features.length;
      }
      var fieldName = config.field;
      var statisticsType = config.type;
      return statisticsUtils.getStatisticsResultFromClientSync({
        featureSet: {
          features: features
        },
        fieldName: fieldName,
        statisticTypes: [statisticsType]
      })[statisticsType + 'Field'];
    },

    _getExtalDataSourceType: function(ds, appConfig /* optional*/ ) {
      var dsInfo = this._getExtalDataSourceInfo(ds, appConfig /* optional*/ );
      return dsInfo.type;

    },

    _getExtalDataSourceInfo: function(ds, appConfig) {
      if (!ds) {
        return;
      }
      appConfig = appConfig || this.appConfig;
      var frameWorkDsId = ds.frameWorkDsId;
      if (typeof frameWorkDsId === 'undefined') {
        return;
      }
      var dsInfo = {};
      var dataSources = appConfig && appConfig.dataSource && appConfig.dataSource.dataSources;
      if (dataSources) {
        dsInfo = dataSources[frameWorkDsId];
      } else {
        var dsManager = DataSourceManager.getInstance();
        dsInfo = dsManager.getDataSourceConfig(ds.frameWorkDsId);
      }
      return dsInfo;
    }
  };
  return mo;
});