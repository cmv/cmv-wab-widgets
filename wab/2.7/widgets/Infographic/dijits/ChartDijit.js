///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2017 Esri. All Rights Reserved.
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
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/_base/declare',
  './BaseDijit',
  'moment/moment',
  'jimu/dijit/_chartDijitOption',
  'jimu/dijit/Chart',
  'jimu/DataSourceManager',
  'jimu/LayerInfos/LayerInfos'
], function(lang, html, array, declare, BaseDijit, moment, ChartDijitOption, Chart, DataSourceManager, LayerInfos) {
  window.makeTwix(moment);
  var clazz = declare([BaseDijit], {
    templateString: '<div><div data-dojo-attach-point="noDataDiv" class="no-data-tip">${nls.noData}</div>' +
      '<div class="chart-dom" data-dojo-attach-point="chartDomNode"></div>< /div>',
    type: 'chart',
    baseClass: 'infographic-chart-dijit',
    layerInfosObj: null,
    dataSourceManager: null,
    featuresCountForPreview: 50,
    highLightColor: '#00ffff',
    dataSource: null, //{dataSourceType,filterByExtent,layerId,name,useSelection}
    config: null,
    map: null,

    maxTimeIntervals: 10000,
    maxLabels: 10000,
    dataSourceType: '', //CLIENT_FEATURES, FRAMEWORK_FEATURES, FRAMEWORK_STATISTICS
    featureLayer: null, //for CLIENT_FEATURES

    constructor: function(options) {
      this.config = options.config;
      this.layerInfosObj = LayerInfos.getInstanceSync();
      this.dataSourceManager = DataSourceManager.getInstance();
    },

    postCreate: function() {
      this.inherited(arguments);
      this.DEFAULT_CONFIG = {
        type: this.config.type || 'column',
        theme: this._getChartTheme(),
        labels: [],
        series: [{
          data: []
        }]
      };
      this.domNode.style.width = '100%';
      this.domNode.style.height = '100%';
      this.chartDomNode.style.width = '100%';
      this.chartDomNode.style.height = '100%';
      //init chartDijitOption
      var args = {
        map: null
      };
      if (!this.inSettingPage) {
        args.map = this.map;
      }
      this.chartDijitOption = new ChartDijitOption(args);
      //init jimu chart
      this._initChart();

      this._updateBackgroundColor();
    },

    _getChartTheme: function() {
      if (this.isDarkTheme()) {
        return "dark";
      } else {
        return "light";
      }
    },

    clearChart: function() {
      //don't call _clear in this method
      this._showNodata();
    },

    startup: function() {
      this.inherited(arguments);
      setTimeout(lang.hitch(this, function() {
        this.chart.resize();
        if (this.inSettingPage) {
          this._tryUpdateStatisticsChart();
        } else {
          if (this.dataSource) {
            this.setDataSource(this.dataSource);
          }
        }
      }), 200);
    },

    destroy: function() {
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = null;
      this.inherited(arguments);
    },

    resize: function() {
      if (this.chart) {
        this.chart.resize();
      }
    },

    setDataSource: function(dataSource) {
      this.dataSourceType = '';

      //clear CLIENT_FEATURES
      this.featureLayer = null;

      this.inherited(arguments);

      if (!dataSource) {
        return;
      }

      if (dataSource.layerId) {
        this._setDataSourceForLayerId(dataSource);
      } else if (dataSource.frameWorkDsId) {
        var frameWorkDsId = dataSource.frameWorkDsId;
        //{from: 'map', layerId}
        //{from: 'widget', widgetId}
        //{from: 'external'}
        var dsInfo = this._getDsTypeInfoAndDsMeta(frameWorkDsId);
        var dsTypeInfo = dsInfo.dsTypeInfo;
        var dsMeta = dsInfo.dsMeta;
        if (dsTypeInfo && dsMeta) {
          if (dsMeta.type === 'Features') {
            this._setDataSourceForFrameworkFeatures(dataSource, dsTypeInfo, dsMeta);
          } else if (dsMeta.type === 'FeatureStatistics') {
            this._setDataSourceForFeatureStatistics(dataSource, dsTypeInfo, dsMeta);
          }
        }
      }
    },

    _getDsTypeInfoAndDsMeta: function(frameWorkDsId) {
      var result = {
        dsTypeInfo: null,
        dsMeta: null
      };
      result.dsTypeInfo = this.dataSourceManager.parseDataSourceId(frameWorkDsId);
      var dataSources = this.appConfig.dataSource && this.appConfig.dataSource.dataSources;
      if (dataSources) {
        result.dsMeta = dataSources[frameWorkDsId];
      }
      return result;
    },

    _updateBackgroundColor: function() {
      if (this.config && this.config.backgroundColor) {
        this.setBackgroundColor(this.config.backgroundColor);
      }
    },

    setBackgroundColor: function(bg) {
      this.domNode.style.backgroundColor = bg;
    },

    //chart dijit related config, not widget config
    setConfig: function(config) {
      this.config = config;
      this._updateBackgroundColor();
      this._tryUpdateStatisticsChart();
    },

    onDataSourceDataUpdate: function(data) {
      this.inherited(arguments);

      if (this.dataSourceType === 'CLIENT_FEATURES') {
        this._onDataUpdateForClientFeatures(data);
      } else if (this.dataSourceType === 'FRAMEWORK_STATISTICS') {
        this._onDataUpdateForFrameworkStatistics(data);
      } else if (this.dataSourceType === 'FRAMEWORK_FEATURES') {
        this._onDataUpdateForFrameworkFeatures(data);
      }
    },

    _renderChartForServer: function(options) {
      this.chartDijitOption.mockFeatureLayerAndChartConfigValueFieldsForServer(options)
        .then(function(optionsWithLayer) {
          var chartOptions = this.chartDijitOption.getChartOptionForServer(optionsWithLayer, this.chart);
          if (!this._checkIsTooManyLabels(chartOptions)) {
            this.chart.updateConfig(chartOptions);
          }
        }.bind(this));
    },

    _renderChart: function(options) {
      var featureLayerOrUrlOrLayerDefinition = options.featureLayerOrUrlOrLayerDefinition;
      this.chartDijitOption.getLoadedLayer(featureLayerOrUrlOrLayerDefinition).then(function(featureLayer) {
        var chartDijitOptions = {
          featureLayer: featureLayer,
          features: options.features,
          chartConfig: options.config,
          popupFieldInfosObj: options.popupFieldInfosObj,
          featureLayerForChartSymbologyChart: options.featureLayerForChartSymbologyChart
        };
        var chartOptions = this.chartDijitOption.getChartOption(chartDijitOptions, this.chart);
        if (!this._checkIsTooManyLabels(chartOptions)) {
          this.chart.updateConfig(chartOptions);
        }
      }.bind(this));
    },

    _initChart: function() {
      this.chart = new Chart({
        chartDom: this.chartDomNode,
        config: this.DEFAULT_CONFIG
      });
      this.chart.placeAt(this.chartDomNode);
      setTimeout(lang.hitch(this, function() {
        this.chart.resize();
      }), 300);
    },

    _tryUpdateStatisticsChart: function() {
      this._hideNodata();
      var chartConfig = this._getChartConfigFromConfig();
      if (!chartConfig) {
        this._showNodata();
        return;
      }

      if (!this.domNode.parentNode) {
        this._showNodata();
        return;
      }

      if (this.data) {
        if (!this.data.features) {
          this.data.features = [];
        }
        if (this.dataSourceType === 'CLIENT_FEATURES') {
          this._tryUpdateStatisticsChartForClientFeatures(chartConfig);
        } else if (this.dataSourceType === 'FRAMEWORK_FEATURES') {
          this._tryUpdateStatisticsChartForFrameworkFeatures(chartConfig);
        } else if (this.dataSourceType === 'FRAMEWORK_STATISTICS') {
          this._tryUpdateStatisticsChartForFrameworkStatistics(chartConfig);
        }
      } else {
        this._showNodata();
      }
    },

    _getNodataTextColor: function() {
      var color = '';
      if (this.config) {
        if (this.config.type === 'pie') {
          color = this.config.dataLabelColor;
        } else {
          color = this.config.horizontalAxisTextColor || this.config.verticalAxisTextColor;
        }
      }
      if (!color) {
        color = '#666';
      }
      return color;
    },

    _getChartConfigFromConfig: function() {
      var chartConfig = null,
        config = null;
      if (this.config && this.config.mode && this.config.type) {
        config = lang.clone(this.config);
        config.highLightColor = this.highLightColor;
        var type = config.type;
        var mode = config.mode;

        chartConfig = {
          mode: config.mode,
          type: config.type
        };

        var baseChartProperties = [];

        if (mode === 'feature') {
          baseChartProperties = baseChartProperties.concat(["labelField", "valueFields", "sortOrder", "maxLabels"]);
        } else if (mode === 'category') {
          baseChartProperties = baseChartProperties.concat(["categoryField", "dateConfig", "valueFields", "sortOrder",
            "operation", "maxLabels", "nullValue", "splitField"
          ]);
        } else if (mode === 'count') {
          baseChartProperties = baseChartProperties.concat(["categoryField", "dateConfig", "sortOrder",
            "maxLabels", "splitField"
          ]);
        } else if (mode === 'field') {
          baseChartProperties = baseChartProperties.concat(["valueFields", "operation",
            "sortOrder", "maxLabels", "nullValue"
          ]);
        }

        var baseDisplayProperties = ["backgroundColor", "seriesStyle", "showLegend",
          "legendTextColor", "legendTextSize", "stack", "area", "highLightColor"
        ];

        if (type === 'pie') {
          baseDisplayProperties = baseDisplayProperties.concat(["showDataLabel", "dataLabelColor",
            "dataLabelSize", "innerRadius"
          ]);
        } else {
          baseDisplayProperties = baseDisplayProperties.concat([
            "showHorizontalAxis",
            "horizontalAxisTextColor",
            "horizontalAxisTextSize",
            "showVerticalAxis",
            "verticalAxisTextColor",
            "verticalAxisTextSize"
          ]);
        }

        array.forEach(baseChartProperties, lang.hitch(this, function(chartProperty) {
          chartConfig[chartProperty] = config[chartProperty];
        }));

        array.forEach(baseDisplayProperties, lang.hitch(this, function(displayProperty) {
          chartConfig[displayProperty] = config[displayProperty];
        }));
      }
      this._specialSortOrder(chartConfig);
      return chartConfig;
    },

    _specialSortOrder: function(chartConfig) {
      if (!chartConfig) {
        return;
      }
      var mode = chartConfig.mode;
      var sortOrder = chartConfig.sortOrder;
      if (mode === 'feature' && sortOrder && sortOrder.field === chartConfig.labelField) {
        sortOrder.isLabelAxis = true;
      }
    },

    _hasFeatures: function() {
      return this.data && this.data.features && this.data.features.length >= 0;
    },

    showNoData: function() {
      this._showNodata();
    },

    _showNodata: function(type) { //type:timeInterval,maxLabels
      html.addClass(this.domNode, 'no-data');
      if (type === 'timeInterval') {
        this.noDataDiv.innerHTML = this.nls.parsingperiodTip;
      } else if (type === 'maxLabels') {
        this.noDataDiv.innerHTML = this.nls.manyCategoryTip;
      }
      this.chart.clear();
    },

    _hideNodata: function() {
      html.removeClass(this.domNode, 'no-data');
    },

    _showMockData: function(chartConfig) {
      chartConfig = lang.clone(chartConfig);
      var fieldNames = [];
      if (chartConfig.labelField) {
        fieldNames.push(chartConfig.labelField);
      }
      if (chartConfig.categoryField) {
        fieldNames.push(chartConfig.categoryField);
      }
      if (chartConfig.valueFields) {
        fieldNames = fieldNames.concat(chartConfig.valueFields);
      }
      var mockDefinition = {
        fields: []
      };
      var mockFeature = {
        attributes: {}
      };
      mockDefinition.fields = array.map(fieldNames, lang.hitch(this, function(fieldName) {
        mockFeature.attributes[fieldName] = 0;
        return {
          name: fieldName,
          type: 'esriFieldTypeInteger',
          alias: fieldName
        };
      }));

      this.chart.resize();
      if (this._checkIsTooManyTimeInterval([mockFeature], chartConfig)) {
        return this._showNodata('timeInterval');
      }

      var options = {
        featureLayerOrUrlOrLayerDefinition: mockDefinition,
        features: [mockFeature],
        config: chartConfig,
        popupFieldInfosObj: this.popupFieldInfosObj
      };
      this._renderChart(options);
    },

    //--------------------------------------CLIENT_FEATURES-------------------------------------------

    _setDataSourceForLayerId: function(dataSource) {
      this.dataSourceType = 'CLIENT_FEATURES';
      var layerInfo = this.layerInfosObj.getLayerInfoById(dataSource.layerId);

      if (!layerInfo) {
        return;
      }

      layerInfo.getLayerObject().then(lang.hitch(this, function(layerObject) {
        this.popupFieldInfosObj = layerInfo.getPopupInfo();
        this.featureLayer = layerObject;
        this._tryUpdateStatisticsChart();
      }));
    },

    _onDataUpdateForClientFeatures: function() {
      this._tryUpdateStatisticsChart();
    },

    _tryUpdateStatisticsChartForClientFeatures: function(chartConfig) {

      if (!this.featureLayer) {
        this._showNodata();
        return;
      }

      var features = this.data.features;
      if (features && this.inSettingPage) {
        features = features.slice(0, this.featuresCountForPreview);
      }

      this.chart.resize();
      if (this._checkIsTooManyTimeInterval(features, chartConfig)) {
        return this._showNodata('timeInterval');
      }
      var featureLayerForChartSymbologyChart = this._getFeatureLayerForSymbolRenderChart();

      var options = {
        featureLayerOrUrlOrLayerDefinition: this.featureLayer,
        features: features,
        config: chartConfig,
        popupFieldInfosObj: this.popupFieldInfosObj,
        featureLayerForChartSymbologyChart: featureLayerForChartSymbologyChart
      };
      this._renderChart(options);
    },

    //--------------------------------------FRAMEWORK_FEATURES----------------------------------------------

    _setDataSourceForFrameworkFeatures: function() {
      this.dataSourceType = 'FRAMEWORK_FEATURES';
      this._tryUpdateStatisticsChart();
    },

    _onDataUpdateForFrameworkFeatures: function() {
      this._tryUpdateStatisticsChart();
    },

    _getFeatureLayerForSymbolRenderChart: function(layerId) {
      var featureLayerForChartSymbologyChart = null;
      if (this.map && typeof layerId !== 'undefined') {
        featureLayerForChartSymbologyChart = this.map.getLayer(layerId);
      } else if (this.featureLayer) {
        featureLayerForChartSymbologyChart = this.featureLayer;
      }
      return featureLayerForChartSymbologyChart;
    },

    _tryUpdateStatisticsChartForFrameworkFeatures: function(chartConfig) {
      var dsInfo = this._getDsTypeInfoAndDsMeta(this.dataSource.frameWorkDsId);
      var dsMeta = dsInfo.dsMeta;
      if (!dsMeta) {
        this._showNodata();
        return;
      }

      var features = this.data.features;
      if (features && this.inSettingPage) {
        features = features.slice(0, this.featuresCountForPreview);
      }

      this.chart.resize();
      if (this._checkIsTooManyTimeInterval(features, chartConfig)) {
        return this._showNodata('timeInterval');
      }
      var featureLayerForChartSymbologyChart = null;
      if (chartConfig.seriesStyle && chartConfig.seriesStyle.useLayerSymbology !== 'undefined') {
        var dsTypeInfo = this.dataSourceManager.parseDataSourceId(dsMeta.id);
        if (typeof dsTypeInfo.layerId !== 'undefined') {
          var layerId = dsTypeInfo.layerId;
          featureLayerForChartSymbologyChart = this._getFeatureLayerForSymbolRenderChart(layerId);
        }
      }

      var options = {
        featureLayerOrUrlOrLayerDefinition: dsMeta.dataSchema,
        features: features,
        config: chartConfig,
        popupFieldInfosObj: this.popupFieldInfosObj,
        featureLayerForChartSymbologyChart: featureLayerForChartSymbologyChart
      };
      this._renderChart(options);
    },

    //--------------------------------------FRAMEWORK_STATISTICS----------------------------------------------

    _setDataSourceForFeatureStatistics: function() {
      this.dataSourceType = 'FRAMEWORK_STATISTICS';
      this._tryUpdateStatisticsChart();
    },

    _onDataUpdateForFrameworkStatistics: function() {
      this._tryUpdateStatisticsChart();
    },

    _tryUpdateStatisticsChartForFrameworkStatistics: function(chartConfig) {
      var dsInfo = this._getDsTypeInfoAndDsMeta(this.dataSource.frameWorkDsId);
      var dsMeta = dsInfo.dsMeta;
      if (!dsMeta) {
        this._showNodata();
        return;
      }

      this.chart.resize();
      if (this._checkIsTooManyTimeInterval(this.data.features, chartConfig)) {
        return this._showNodata('timeInterval');
      }

      var options = {
        dataSchema: dsMeta.dataSchema,
        statisticsFeatures: this.data.features,
        config: chartConfig
      };
      this._renderChartForServer(options);
    },

    _checkIsTooManyLabels: function(chartOptions) {
      var labels = chartOptions.labels;
      if (labels && labels.length > this.maxLabels) {
        this._showNodata('maxLabels');
        return true;
      }
      return false;
    },

    _checkIsTooManyTimeInterval: function(features, chartConfig) {
      var dateConfig = chartConfig.dateConfig;
      if (!dateConfig || dateConfig.minPeriod === 'automatic') {
        return false;
      }
      var fieldName = chartConfig.categoryField;

      var times = features.map(lang.hitch(this, function(feature) {
        var attributes = feature.attributes;
        return attributes[fieldName];
      }));
      times = times.filter(function(e) {
        return !!e;
      });

      var minTime = Math.min.apply(Math, times);
      var maxTime = Math.max.apply(Math, times);

      var start = moment(minTime).subtract(1, 'seconds').local();
      var end = moment(maxTime).add(1, 'seconds').local();
      var numbers = Math.round(end.diff(start, dateConfig.minPeriod, true));
      return numbers >= this.maxTimeIntervals;
    }

  });

  return clazz;
});