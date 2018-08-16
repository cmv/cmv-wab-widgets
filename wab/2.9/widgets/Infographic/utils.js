define([
  'dojo/on',
  'jimu/utils',
  'jimu/DataSourceManager',
  'jimu/statisticsUtils',
  'dojo/_base/lang',
  'dojo/_base/Color',
  'dojo/_base/array',
  'dojo/Deferred',
  'esri/layers/FeatureLayer'
], function(on, jimuUtils, DataSourceManager, statisticsUtils, lang, Color, array, Deferred, FeatureLayer) {
  var mo = {
    getClientFeaturesFromMap: function(map, featureLayer, useSelection, filterByExtent) {
      return jimuUtils.getClientFeaturesFromMap(map, featureLayer, useSelection, filterByExtent);
    },

    //callback: function(features){}
    listenClientFeaturesFromMap: function(map, featureLayer, useSelection, filterByExtent, callback) {
      var handles = [];
      if (useSelection) {
        handles.push(on(featureLayer, 'selection-complete', lang.hitch(this, function() {
          callback(this.getClientFeaturesFromMap(map, featureLayer, useSelection, filterByExtent));
        })));
        handles.push(on(featureLayer, 'selection-clear', lang.hitch(this, function() {
          callback(this.getClientFeaturesFromMap(map, featureLayer, useSelection, filterByExtent));
        })));
      }

      if (filterByExtent) {
        handles.push(on(map, 'extent-change', lang.hitch(this, function() {
          if (featureLayer.graphics.length > 0) {
            callback(this.getClientFeaturesFromMap(map, featureLayer, useSelection, filterByExtent));
          }
        })));
      }

      handles.push(on(featureLayer, 'update-end', lang.hitch(this, function() {
        callback(this.getClientFeaturesFromMap(map, featureLayer, useSelection, filterByExtent));
      })));

      callback(this.getClientFeaturesFromMap(map, featureLayer, useSelection, filterByExtent));

      var returnHandle = {
        remove: function() {
          if (handles) {
            array.forEach(handles, lang.hitch(this, function(handle) {
              handle.remove();
            }));
          }
          handles = null;
        }
      };
      return returnHandle;
    },

    getVaildIndicator: function(value, indicators, max) {
      var vaildIndicators = [];
      indicators.map(lang.hitch(this, function(indicator) {
        var vaildIndicator = this._handleOperator(indicator, value, max);
        if (vaildIndicator) {
          vaildIndicators.push(vaildIndicator);
        }
      }));
      if (vaildIndicators.length > 0) {
        return vaildIndicators[vaildIndicators.length - 1];
      }
    },

    /**
     *
     * @param  {[type]} config
     *   {
          type: "",//"Features"" Or "FeatureStatistics"
          fieldName: null,
          statisticsType:
        }
     * @param  {[type]} ds     [description]
     * @return {[type]}        [description]
     */
    getSingleValueFromFeatures: function(config, ds, features) {
      if (!features || !features.length) {
        return null;
      }
      var dsManager = DataSourceManager.getInstance();
      var count = 0;

      if (config.type === 'Features') {
        if (ds.dataSourceType === 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
          return features.length;
        } else {
          if (dsManager.getDataSourceConfig(ds.frameWorkDsId).type === 'Features') {
            return features.length;
          } else {
            count = 0;
            array.forEach(features, function(f) {
              var v = f.attributes.STAT_COUNT;
              if (typeof v === 'undefined') {
                v = f.attributes.stat_count;
              }
              count += v;
            });
            return count;
          }
        }
      } else {
        if (ds.dataSourceType === 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
          return this._getStatsFromFeatures(features, config.fieldName, config.statisticsType);
        } else {
          if (dsManager.getDataSourceConfig(ds.frameWorkDsId).type === 'Features') {
            return this._getStatsFromFeatures(features, config.fieldName, config.statisticsType);
          } else {
            var val = 0,
              sum = 0;
            count = 0;
            var mosaicFieldName = jimuUtils.upperCaseString(config.fieldName + '_' + config.statisticsType);
            array.forEach(features, function(f) {
              var v = f.attributes[mosaicFieldName];
              if (typeof v === 'undefined') {
                mosaicFieldName = jimuUtils.lowerCaseString(config.fieldName + '_' + config.statisticsType);
                v = f.attributes[mosaicFieldName];
              }
              switch (config.statisticsType) {
                case 'sum':
                  val += v;
                  break;
                case 'min':
                  val = Math.min(val, v);
                  break;
                case 'max':
                  val = Math.max(val, v);
                  break;
                case 'avg':
                  var sumCountValue = this._getSumCountValue(config.fieldName, f.attributes);
                  sum += sumCountValue.sum;
                  count += sumCountValue.count;
                  break;
                case 'stddev':
                  break;
              }
            }.bind(this));

            if (config.statisticsType === 'avg') {
              val = count === 0 ? 0 : sum / count;
            }
            return val;
          }
        }
      }
    },

    _getSumCountValue: function(fieldName, attributes) {
      var sum, count;
      var mosaicSumFieldName = jimuUtils.upperCaseString(fieldName + '_SUM');
      sum = attributes[mosaicSumFieldName];
      if (typeof sum === 'undefined') {
        mosaicSumFieldName = jimuUtils.lowerCaseString(fieldName + '_SUM');
        sum = attributes[mosaicSumFieldName];
      }
      var mosaicCountFieldName = 'STAT_COUNT';
      count = attributes[mosaicCountFieldName];
      if (typeof count === 'undefined') {
        mosaicCountFieldName = jimuUtils.lowerCaseString('STAT_COUNT');
        count = attributes[mosaicCountFieldName];
      }
      sum = sum || 0;
      count = count || 0;
      return {
        sum: sum,
        count: count
      };
    },

    filterFeaturesByDataSourceSetting: function(features, ds, map) {
      if (features.length === 0) {
        return [];
      }
      if (ds.useSelection) {
        var layer = features[0].getLayer();
        if (layer) {
          var layerSelectedFeatures = layer.getSelectedFeatures();
          if (layerSelectedFeatures.length > 0) {
            features = array.filter(features, function(f) {
              return layerSelectedFeatures.indexOf(f) > -1;
            });
          }
        }
      }

      if (ds.filterByExtent) {
        features = jimuUtils.filterFeaturesByExtent(map.extent, features);
      }

      return features;
    },

    _getStatsFromFeatures: function(features, fieldName, statisticsType) {
      return statisticsUtils.getStatisticsResultFromClientSync({
        featureSet: {
          features: features
        },
        fieldName: fieldName,
        statisticTypes: [statisticsType]
      })[statisticsType + 'Field'];
    },

    _handleOperator: function(indicator, value, max) {
      var vaildIndicator;

      function handleColor(indicator) {
        vaildIndicator = {};
        if (indicator.valueColor) {
          vaildIndicator.valueColor = indicator.valueColor;
        }
        if (indicator.gaugeColor) {
          vaildIndicator.gaugeColor = indicator.gaugeColor;
        }
        if (indicator.iconInfo) {
          vaildIndicator.iconInfo = indicator.iconInfo;
        }
      }
      var limitValue = indicator.value.map(lang.hitch(this, function(val) {
        return !!indicator.isRatio ? max * (val / 100) : val;
      }));
      if (indicator.operator === 'greater' && value > limitValue[0]) {
        handleColor(indicator);
      } else if (indicator.operator === 'smaller' && value < limitValue[0]) {
        handleColor(indicator);
      } else if (indicator.operator === 'between' && value > limitValue[0] &&
        value < limitValue[1]) {
        handleColor(indicator);
      } else if (indicator.operator === 'equal' && value === limitValue[0]) {
        handleColor(indicator);
      } else if (indicator.operator === 'notEqual' && value !== limitValue[0]) {
        handleColor(indicator);
      }
      return vaildIndicator;
    },

    isInteger: function(number) {
      return typeof number === 'number' && number % 1 === 0;
    },

    //code:
    // 0, Effective data source
    // 1, Empty data source
    // 2, Unable to get valid data from map/ external data source through a given data source
    // 3, Invalid data source
    // 4, The data source lacks the configured fields
    checkDataSourceIsVaild: function(dataSource, mainDijitJson, map, appConfig) {
      var result = {
        code: 0,
        fields: []
      };
      var fields = null;
      if (!dataSource) {
        result.code = 1;
      } else if (dataSource.dataSourceType === 'DATA_SOURCE_FROM_FRAMEWORK') {
        if (appConfig && appConfig.dataSource && appConfig.dataSource.dataSources) {
          var dataSources = appConfig.dataSource.dataSources;
          var ds = dataSources[dataSource.frameWorkDsId];
          if (!ds) {
            result.code = 1;
          } else {
            fields = ds.dataSchema && ds.dataSchema.fields;
            result = this._isDataSourceContainNeededFields(fields, mainDijitJson, result);
          }
        } else {
          result.code = 1;
        }

      } else if (dataSource.dataSourceType === 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
        var layerId = dataSource.layerId;
        if (layerId && map) {
          var layer = map.getLayer(layerId);
          if (!layer) {
            result.code = 1;
          } else {
            fields = layer.fields;
            result = this._isDataSourceContainNeededFields(fields, mainDijitJson, result);
          }
        } else {
          result.code = 1;
        }
      }
      return result;
    },

    _isDataSourceContainNeededFields: function(fields, mainDijitJson, result) {

      if (!fields || !fields.length) {
        result.code = 1;
        return result;
      }
      var fieldNames = this._getFieldNamesByFields(fields);
      var neededFields = this._getNeededFieldsByMainDijitJson(mainDijitJson);
      if (!neededFields || !neededFields.length) {
        result.code = 0;
        return result;
      }
      neededFields.forEach(function(nf) {
        if (fieldNames.indexOf(nf) < 0) {
          result.fields.push(nf);
        }
      });
      if (result.fields.length) {
        result.code = 2;
      }
      return result;
    },

    _getNeededFieldsByMainDijitJson: function(mainDijitJson) {
      if (!mainDijitJson) {
        return;
      }
      var type = mainDijitJson.type;
      var config = mainDijitJson.config;
      return this._getNeededFieldsByDijitConfig(type, config);
    },

    _getNeededFieldsByDijitConfig: function(type, config) {
      var fields = null;
      if (!config) {
        return;
      }
      if (type === 'chart') {
        fields = [];
        if (config.labelField) {
          fields.push(config.labelField);
        }
        if (config.categoryField) {
          fields.push(config.categoryField);
        }
        if (config.valueFields && config.valueFields.length) {
          fields = fields.concat(config.valueFields);
        }
      } else if (type === 'gauge' || type === 'number') {
        fields = [];
        var statistic = config.statistic;
        if (statistic) {
          var fieldName = statistic.fieldName;
          if (fieldName) {
            fields.push(fieldName);
          }
        }

      }
      if (fields && fields.length) {
        return fields;
      }
    },

    _getFieldNamesByFields: function(fields) {
      if (fields && fields.length) {
        return fields.map(function(fieldInfo) {
          return this._getFieldNameByFieldInfo(fieldInfo);
        }.bind(this));
      }
    },

    _getFieldNameByFieldInfo: function(fieldInfo) {
      return fieldInfo && fieldInfo.name;
    },

    isBaseAxisChart: function(type) {
      return type === 'column' || type === 'bar' || type === 'line';
    },

    isEqual: function(v1, v2) {
      if (typeof v1 !== typeof v2) {
        return false;
      }
      if (typeof v1 !== 'object') {
        return v1 === v2;
      } else {
        return jimuUtils.isEqual(v1, v2);
      }
    },

    separationChartProperties: function(config) {
      var type = config.type;
      var mode = config.mode;

      var dataProperties = ['mode', 'type'];

      var displayProperties = ["backgroundColor", "seriesStyle", "legend", "highLightColor"];

      if (mode === 'feature') {
        dataProperties = dataProperties.concat(["labelField", "valueFields"]);
      } else if (mode === 'category') {
        dataProperties = dataProperties.concat(["categoryField", "dateConfig",
          "valueFields", "operation", "nullValue"
        ]);

      } else if (mode === 'count') {
        dataProperties = dataProperties.concat(["categoryField", "dateConfig"]);
      } else if (mode === 'field') {
        dataProperties = dataProperties.concat(["valueFields", "operation", "nullValue"]);
      }
      dataProperties = dataProperties.concat(["sortOrder", "maxLabels"]);

      if (type === 'pie') {
        displayProperties = displayProperties.concat(["dataLabel", "innerRadius"]);
      } else {
        displayProperties = displayProperties.concat([
          "xAxis",
          "yAxis",
          "stack",
          "area",
          "marks"
        ]);
      }
      return {
        dataProperties: dataProperties,
        displayProperties: displayProperties
      };
    },

    classifyChartConfig: function(config) {
      if (!config) {
        return;
      }
      var properties = this.separationChartProperties(config);
      var dataProperties = properties.dataProperties;
      var displayProperties = properties.displayProperties;

      var data = {},
        display = {};

      dataProperties.forEach(lang.hitch(this, function(chartProperty) {
        data[chartProperty] = config[chartProperty];
      }));

      displayProperties.forEach(lang.hitch(this, function(displayProperty) {
        display[displayProperty] = config[displayProperty];
      }));

      return {
        data: data,
        display: display
      };
    },

    getCleanChartConfig: function(config) {
      var cleanConfig = {
        mode: config.mode,
        type: config.type
      };

      var properties = this.separationChartProperties(config);
      var dataProperties = properties && properties.dataProperties;
      var displayProperties = properties && properties.displayProperties;

      if (dataProperties && dataProperties.length) {
        dataProperties.forEach(lang.hitch(this, function(property) {
          cleanConfig[property] = config[property];
        }));
      }

      if (displayProperties && displayProperties.length) {
        displayProperties.forEach(lang.hitch(this, function(property) {
          cleanConfig[property] = config[property];
        }));
      }

      if (!cleanConfig.mode) {
        return null;
      }

      if (cleanConfig.mode !== 'count' && (!cleanConfig.valueFields || !cleanConfig.valueFields.length)) {
        return null;
      }

      if (cleanConfig.type === 'pie' && cleanConfig.maxLabels === '') {
        return null;
      }
      return lang.clone(cleanConfig);
    },

    _cloneAndFormatDS: function(DS) {
      var cloneDS = lang.clone(DS);
      var formatDS = {};
      if (cloneDS.name) {
        formatDS.name = cloneDS.name;
      }
      if (cloneDS.dataSourceType) {
        formatDS.dataSourceType = cloneDS.dataSourceType;
      }
      if (cloneDS.layerId) {
        formatDS.layerId = cloneDS.layerId;
      }
      if (cloneDS.frameWorkDsId) {
        formatDS.frameWorkDsId = cloneDS.frameWorkDsId;
      }
      cloneDS = null;
      return formatDS;
    },

    isDSEqual: function(DS1, DS2) {
      if (!DS1 || !DS2) {
        return;
      }
      var formatedDS1 = this._cloneAndFormatDS(DS1);
      var formatedDS2 = this._cloneAndFormatDS(DS2);
      return this.isEqual(formatedDS1, formatedDS2);
    },

    separationGradientColors: function(originColors, count) {
      var colors = [];

      if (originColors.length === 2) {
        //gradient colors
        colors = this._createGradientColors(originColors[0],
          originColors[originColors.length - 1],
          count);
      }

      return colors;
    },

    _createGradientColors: function(firstColor, lastColor, count) {
      var colors = [];
      var c1 = new Color(firstColor);
      var c2 = new Color(lastColor);
      var deltaR = (c2.r - c1.r) / count;
      var deltaG = (c2.g - c1.g) / count;
      var deltaB = (c2.b - c1.b) / count;
      var c = new Color();
      var r = 0;
      var g = 0;
      var b = 0;
      for (var i = 0; i < count; i++) {
        r = parseInt(c1.r + deltaR * i, 10);
        g = parseInt(c1.g + deltaG * i, 10);
        b = parseInt(c1.b + deltaB * i, 10);
        c.setColor([r, g, b]);
        colors.push(c.toHex());
      }
      return colors;
    },

    //mock a layer definition object
    mockLayerDefinitionForSTD: function(dataSchema) {
      var mockDefinition = {
        type: 'Table',
        fields: [] //{name,type,alias}
      };
      mockDefinition.fields = dataSchema.fields;
      var countField = "STAT_COUNT"; //For HANA, count --> STAT_COUNT
      mockDefinition.fields.push({
        name: countField,
        type: 'esriFieldTypeInteger',
        alias: countField
      });

      return mockDefinition;
    },

    getLoadedLayer: function(featureLayerOrUrlOrLayerDefinition) {
      var def = new Deferred();
      var featureLayer = null;
      if (typeof featureLayerOrUrlOrLayerDefinition === 'string') {
        //url
        featureLayer = new FeatureLayer(featureLayerOrUrlOrLayerDefinition);
      } else {
        if (featureLayerOrUrlOrLayerDefinition.declaredClass === "esri.layers.FeatureLayer") {
          //FeatureLayer
          featureLayer = featureLayerOrUrlOrLayerDefinition;
        } else {
          //layerDefinition
          featureLayer = new FeatureLayer({
            layerDefinition: lang.clone(featureLayerOrUrlOrLayerDefinition),
            featureSet: null
          });
        }
      }

      if (featureLayer.loaded) {
        def.resolve(featureLayer);
      } else {
        featureLayer.on('load', function() {
          def.resolve(featureLayer);
        });
      }

      return def;
    },

    parseDataSourceId: function(id) {
      var segs = id.split('~');
      var ret = {};
      if (segs.length < 2) {
        console.error('Bad data source id:', id);
        return ret;
      }

      switch (segs[0]) {
        case 'map': //map~<layerId>~<filterId>
          //layer id may contain "~"
          var lastPos = id.lastIndexOf('~');
          ret = {
            from: 'map',
            layerId: id.substring(4, lastPos)
          };
          return ret;
        case 'widget': //widget~<widgetId>~<dataSourceId>
          ret = {
            from: 'widget',
            widgetId: segs[1]
          };
          return ret;
        case 'external': //external~<id>
          ret = {
            from: 'external'
          };
          return ret;
        default:
          console.error('Bad data source id:', id);
      }
    },

    getDsTypeInfoMeta: function(frameWorkDsId, appConfig) {
      var result = {
        dsTypeInfo: null,
        dsMeta: null
      };
      result.dsTypeInfo = this.parseDataSourceId(frameWorkDsId);
      var dataSources = appConfig.dataSource && appConfig.dataSource.dataSources;
      if (dataSources) {
        result.dsMeta = dataSources[frameWorkDsId];
      }
      return result;
    },

    getValueFromFeatures: function(statistic, dataSource, features) {

      if (!statistic || !dataSource || !features) {
        return false;
      }
      var value = this.getSingleValueFromFeatures(statistic, dataSource, features);
      value = this._getVaildValue(value);
      if (typeof value !== 'number') {
        return false;
      }
      return value;
    },

    _getVaildValue: function(value) {
      if (!value && value !== 0) {
        return;
      }
      return Number(value);
    },

    cleanFeatures: function(features) {
      if (!features || !features.length) {
        return;
      }
      return features.map(function(f) {
        return {
          attributes: f.attributes
        };
      });
    },

    getFieldAliasByFieldInfo: function(fieldInfo, popupInfo) {
      var alias = '';
      if (!fieldInfo) {
        return alias;
      }
      var name = fieldInfo.name;
      alias = fieldInfo.alias || name;
      if (popupInfo) {
        alias = this.getAliasFromPopupInfo(name, popupInfo);
      }
      return alias;
    },

    getAliasFromPopupInfo: function(fieldName, popupInfo) {
      var alias = fieldName;
      if (!popupInfo) {
        return alias;
      }
      var fieldInfos = popupInfo.fieldInfos;
      if (fieldInfos && fieldInfos.length > 0) {
        fieldInfos.forEach(function(item) {
          if (item.fieldName === fieldName) {
            alias = item.label;
          }
        });
      }
      return alias;
    }

  };
  return mo;
});