///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
  'dojo/_base/declare',
  './BaseDijit',
  'dojo/text!./ChartDijit.html',
  'moment/moment',
  'jimu/dijit/_chartDijitOption',
  'jimu/dijit/Chart',
  'jimu/DataSourceManager',
  'jimu/LayerInfos/LayerInfos',
  '../utils'
], function(lang, html, declare, BaseDijit, template, moment, ChartDijitOption,
  Chart, DataSourceManager, LayerInfos, utils) {
  window.makeTwix(moment);
  var clazz = declare([BaseDijit], {
    templateString: template,
    type: 'chart',
    baseClass: 'infographic-chart-dijit',
    layerInfosObj: null,
    dataSourceManager: null,
    featuresCountForPreview: 50,
    dataSource: null, //{dsType,filterByExtent,layerId,name,useSelection}
    config: null,
    map: null,

    maxTimeIntervals: 10000,
    maxLabels: 10000,
    dsType: '', //CLIENT_FEATURES, FRAMEWORK_FEATURES, FRAMEWORK_STATISTICS

    constructor: function(options) {
      this.visible = options.visible;
      this.config = this._classifyChartConfig(options.config);
      this.layerInfosObj = LayerInfos.getInstanceSync();
      this.dataSourceManager = DataSourceManager.getInstance();

      this.featureLayerForFrameWork = null;
      this.layerObject = null;
      this.popupInfo = null;
    },

    postCreate: function() {
      this.inherited(arguments);
      this._init();
    },

    setLayerInfo: function(layerObject, featureLayerForFrameWork, popupInfo) {
      this.layerObject = layerObject;
      this.popupInfo = popupInfo;
      this.featureLayerForFrameWork = featureLayerForFrameWork;
      this._initChartDijitOption();
    },

    getDataURL: function() {
      if (!this.chart) {
        return;
      }
      return this.chart.getDataURL();
    },

    resize: function() {
      if (!this.chart) {
        return;
      }
      this.chart.resize();
    },

    setVisible: function(visible) {
      this.visible = visible;
    },

    destroy: function() {
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = null;
      this.inherited(arguments);
    },

    clearChart: function() {
      if (this.chart) {
        this.chart.clear();
      }
      this.showNodata();
    },

    setBackgroundColor: function(bg) {
      this.domNode.style.backgroundColor = bg;
    },

    _setyAxisName: function() {
      this.config = this._classifyChartConfig(this.config);
      var displayConfig = this.config && this.config.display;
      var yAxis = displayConfig && displayConfig.yAxis;
      if (!yAxis || !yAxis.show || typeof yAxis.name === 'undefined') {
        this._hideyAxisName();
        return;
      }
      this._showyAxisName();
      var name = yAxis.name;
      this._setyAxisNameText(name);
      var nameTextStyle = yAxis.nameTextStyle;
      if (!nameTextStyle || !nameTextStyle.color) {
        return;
      }
      this._setyAxisNameColor(nameTextStyle.color);
    },

    _setyAxisNameText: function(text) {
      this.yAxisName.innerHTML = text;
    },

    _setyAxisNameColor: function(color) {
      html.setStyle(this.yAxisName, 'color', color);
    },

    _hideyAxisName: function() {
      html.setStyle(this.yAxisName, 'display', 'none');
    },

    _showyAxisName: function() {
      html.setStyle(this.yAxisName, 'display', 'flex');
    },

    resetData: function() {
      this.dataSource = null;
      this.dsType = '';
      this.data = null;
      this._hasStatisticsed = undefined;
      this.layerObject = null;
      this.popupInfo = null;
      this.featureLayerForFrameWork = null;
      this.chartDijitOption.init(null, null, null, this.map);
    },

    //this.dataSource
    setDataSource: function(dataSource) {
      this.inherited(arguments);
      this.dataSource = dataSource;
      this._calcDataSourceType(this.dataSource);
    },

    onUpdateDataStart: function() {
      this._showOverlay();
    },

    onUpdateDataDone: function() {
      this._hideOverlay();
    },

    _calcDataSourceType: function(dataSource) {
      if (dataSource.layerId) {
        this.dsType = 'CLIENT_FEATURES';
      } else if (dataSource.frameWorkDsId) {
        var dsInfo = utils.getDsTypeInfoMeta(dataSource.frameWorkDsId, this.appConfig);
        var dsMeta = dsInfo && dsInfo.dsMeta;
        if (!dsMeta) {
          return;
        }
        if (dsMeta.type === 'Features') {
          this.dsType = 'FRAMEWORK_FEATURES';
        } else if (dsMeta.type === 'FeatureStatistics') {
          this.dsType = 'FRAMEWORK_STATISTICS';
        }
      }
    },

    //chart dijit related config, not widget config
    //this.config
    setConfig: function(config) {
      this.config = this._classifyChartConfig(config);
    },

    //this.data
    onDataSourceDataUpdate: function(data) {
      if (data && typeof data.features !== 'undefined') {
        if (this.inSettingPage && data.features.length > this.featuresCountForPreview) {
          data.features = data.features.slice(0, this.featuresCountForPreview);
        }
        this.data = data;
        this._hasStatisticsed = !!data.hasStatisticsed;
      }
    },

    //create echarts option and render it
    startRendering: function() {
      if (!this._shouldRenderChart()) {
        return;
      }
      if (!this.chart) {
        this._createJimuChart();
      }
      this._updateBackgroundColor();
      this._setyAxisName();
      this._splitConfig();

      this._createChartSeriesOption();

      if (!this.seriesOption) {
        this.showNodata();
        return;
      }

      if (this._checkIsTooManyLabels(this.seriesOption)) {
        return;
      }

      this._createChartOption();

      this.chart.updateConfig(this.chartOption);
      this.chart.resize();
    },

    //step 2, create echarts option
    _createChartOption: function() {
      var isSameFeatures = this._isSameFeatures();
      var isSameOption = utils.isEqual(this.dataOption, this._oldDataOption) &&
        utils.isEqual(this.displayOption, this._oldDisplayOption);
      if (isSameFeatures && isSameOption) {
        return;
      }
      this.chartOption = null;
      if (!this.seriesOption) {
        return;
      }
      this.chartOption = this.chartDijitOption.updateChartOptionDisplay(lang.clone(this.seriesOption),
        this.displayOption, this.dataOption);
      this._oldDisplayOption = null;
      this._oldDisplayOption = lang.clone(this.displayOption);
    },

    //step 1, create echart option.series and labels
    _createChartSeriesOption: function() {
      var isSameFeatures = this._isSameFeatures();
      var isSameDataOption = utils.isEqual(this.dataOption, this._oldDataOption);
      if (isSameFeatures && isSameDataOption) {
        return;
      }

      this._oldDataOption = null;
      this._oldDataOption = lang.clone(this.dataOption);

      var dataOption = this.dataOption;
      dataOption.features = this.features;

      var csuData = this.chartDijitOption.getClientStatisticsData(dataOption);
      this.seriesOption = null;
      if (!csuData) {
        return;
      }
      this.chartDijitOption.bindChartEvent(this.chart, dataOption, csuData);
      this.seriesOption = this.chartDijitOption.getChartOptionSeries(this.dataOption, csuData);
    },

    //-------------------Tools methods------------------

    //Split the required configuration items, reduce the repeated computation
    _splitConfig: function() {
      if (!this.config) {
        return;
      }
      this.config = this._classifyChartConfig(this.config);
      var dataConfig = this.config.data;
      var displayConfig = this.config.display;

      this.features = this._cleanFeatures(this.data.features);

      var filterByExtent = this.dataSource.filterByExtent;
      var useSelection = this.dataSource.useSelection;
      var hasStatisticsed = this._isStatisticsed();

      var dataOption = {
        filterByExtent: filterByExtent,
        useSelection: useSelection,
        hasStatisticsed: hasStatisticsed
      };

      this.dataOption = null;
      this.dataOption = lang.mixin(dataOption, dataConfig);

      this.displayOption = null;
      this.displayOption = displayConfig;
    },

    _cleanFeatures: function(features) {
      if (!features || !features.length) {
        return;
      }
      return features.map(function(f) {
        return {
          attributes: f.attributes
        };
      });
    },

    _isSameFeatures: function() {
      var features = this.features;
      if (!features) {
        return true;
      }
      var featureAttrs = features.map(function(f) {
        return f.attributes;
      });
      if (utils.isEqual(featureAttrs, this._oldFeatureAttrs)) {
        return true;
      }
      this._oldFeatureAttrs = featureAttrs;
    },

    _isStatisticsed: function() {
      if (this.inSettingPage) {
        return this.dsType === 'FRAMEWORK_STATISTICS';
      }
      return !!this._hasStatisticsed;
    },

    _shouldRenderChart: function() {
      if (!this.visible) {
        return;
      }
      if (!this.config) {
        return;
      }
      var basicRequire = this.domNode &&
        this.data && this.data.features && this._hasVaildConfig(this.config.data);
      var specificRequire;
      if (this.dsType === 'CLIENT_FEATURES') {
        specificRequire = !!this.layerObject;
      } else if (this.dsType === 'FRAMEWORK_FEATURES' || this.dsType === 'FRAMEWORK_STATISTICS') {
        specificRequire = !!this.featureLayerForFrameWork;
      }
      if (basicRequire && specificRequire) {
        var features = this.data.features;
        if (this._checkIsTooManyTimeInterval(features)) {
          var message = this.nls.parsingperiodTip;
          this.showNodata(message);
          return false;
        }
      } else {
        this.showNodata();
        return false;
      }
      this.hideNodata();
      return true;
    },

    _hasVaildConfig: function(config) {
      if (!config || !config.mode) {
        return false;
      }
      var valueFields = config.valueFields;
      if (config.mode === 'feature') {
        return config.labelField && valueFields && valueFields.length;
      } else if (config.mode === 'category') {
        return config.categoryField && config.operation && valueFields && valueFields.length;
      } else if (config.mode === 'count') {
        return config.categoryField;
      } else if (config.mode === 'field') {
        return config.operation && valueFields && valueFields.length;
      }
    },

    _getNodataTextColor: function() {
      var color = '#666';
      var displayConfig = this.config && this.config.display;
      var dataConfig = this.config && this.config.data;
      if (!displayConfig || !dataConfig) {
        return color;
      }

      if (dataConfig.type === 'pie') {
        color = displayConfig.dataLabelColor;
      } else {
        color = displayConfig.horizontalAxisTextColor || displayConfig.verticalAxisTextColor;
      }
      if (!color) {
        color = '#666';
      }
      return color;
    },

    _classifyChartConfig: function(config) {
      if (!config) {
        return;
      }
      if (config && !config.data) {
        config = utils.classifyChartConfig(config);
      }
      this._specialChartConfig(config);
      return config;
    },

    _specialChartConfig: function(config) {
      var dataConfig = config && config.data;
      if (dataConfig) {
        var mode = dataConfig.mode;
        var sortOrder = dataConfig.sortOrder;
        if (mode === 'feature' && sortOrder && sortOrder.field === dataConfig.labelField) {
          sortOrder.isLabelAxis = true;
        }

        if (typeof dataConfig.labelField !== 'undefined' && mode === 'feature') {
          dataConfig.clusterField = dataConfig.labelField;
        } else if (typeof dataConfig.categoryField !== 'undefined' &&
          (mode === 'category' || mode === 'count')) {
          dataConfig.clusterField = dataConfig.categoryField;
        }
      }
      var displayConfig = config && config.display;
      if (displayConfig) {
        if (dataConfig) {
          displayConfig.mode = dataConfig.mode;
        }
        if (!displayConfig.theme) {
          displayConfig.theme = this._getChartTheme();
        }
      }

    },

    _showOverlay: function() {
      html.removeClass(this.overlap, 'hide');
    },

    _hideOverlay: function() {
      html.addClass(this.overlap, 'hide');
    },

    showNodata: function(message) { //type:timeInterval,maxLabels
      html.addClass(this.domNode, 'no-data');
      this._setNoDataColor();
      if (message) {
        this.noDataDiv.innerHTML = message;
      }
    },

    _setNoDataColor: function() {
      var textColor = this._getNodataTextColor();
      if (this.noDataDiv && this.noDataDiv.style) {
        this.noDataDiv.style.color = textColor;
      }
    },

    _initChartDijitOption: function() {
      if (!this.chartDijitOption) {
        return;
      }
      var featureLayer = null;
      if (this.dsType === 'CLIENT_FEATURES') {
        featureLayer = this.layerObject;
      } else {
        featureLayer = this.featureLayerForFrameWork;
      }
      var symbolLayer = this.layerObject;
      this.chartDijitOption.init(featureLayer, symbolLayer, this.popupInfo, this.map, this.layerObject);
    },

    _checkIsTooManyLabels: function(chartOptions) {
      var labels = chartOptions.labels;
      if (labels && labels.length > this.maxLabels) {
        var message = this.nls.manyCategoryTip;
        this.showNodata(message);
        return true;
      }
      return false;
    },

    _checkIsTooManyTimeInterval: function(features) {
      var dataConfig = this.config && this.config.data;
      var dateConfig = dataConfig && dataConfig.dateConfig;
      if (!dateConfig || dateConfig.minPeriod === 'automatic') {
        return false;
      }
      var fieldName = dateConfig.categoryField;

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
    },

    _createChartDijitOption: function() {
      var args = {
        map: null
      };
      if (!this.inSettingPage) {
        args.map = this.map;
      }
      this.chartDijitOption = new ChartDijitOption(args);
    },

    _init: function() {
      this._createChartDijitOption();
      this._updateBackgroundColor();
    },

    _createJimuChart: function() {
      var dataConfig = this.config && this.config.data;
      var type = dataConfig && dataConfig.type;
      this.DEFAULT_CONFIG = {
        type: type || 'column',
        theme: this._getChartTheme(),
        labels: [],
        series: [{
          data: []
        }]
      };

      this.chart = new Chart({
        chartDom: this.chartDomNode,
        config: this.DEFAULT_CONFIG
      });

      this.chart.placeAt(this.chartDomNode);
      this.chart.resize();
    },

    _getChartTheme: function() {
      if (this.isDarkTheme()) {
        return "dark";
      } else {
        return "light";
      }
    },

    _updateBackgroundColor: function() {
      this.config = this._classifyChartConfig(this.config);
      var displayConfig = this.config && this.config.display;
      if (displayConfig && displayConfig.backgroundColor) {
        this.setBackgroundColor(displayConfig.backgroundColor);
      }
    },

    hideNodata: function() {
      html.removeClass(this.domNode, 'no-data');
    }

  });

  return clazz;
});