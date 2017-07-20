///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
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
  'jimu/dijit/StatisticsChart',
  'jimu/DataSourceManager',
  'jimu/LayerInfos/LayerInfos'
], function(lang, html, array, declare, BaseDijit, StatisticsChart, DataSourceManager, LayerInfos){

  var clazz = declare([BaseDijit], {
    templateString: '<div><div data-dojo-attach-point="noDataDiv" class="no-data-tip">${nls.noData}</div></div>',
    type: 'chart',
    baseClass: 'infographic-chart-dijit',
    layerInfosObj: null,
    dataSourceManager: null,
    featuresCountForPreview: 50,

    dataSource: null,//{dataSourceType,filterByExtent,layerId,name,useSelection}
    config: null,
    map: null,

    dataSourceType: '',//CLIENT_FEATURES, FRAMEWORK_FEATURES, FRAMEWORK_STATISTICS
    featureLayer: null,//for CLIENT_FEATURES

    constructor: function(options){
      this.config = options.config;
      this.layerInfosObj = LayerInfos.getInstanceSync();
      this.dataSourceManager = DataSourceManager.getInstance();
    },

    postCreate: function(){
      this.inherited(arguments);
      this.domNode.style.width = '100%';
      this.domNode.style.height = '100%';

      var args = {
        _legendNls: this.nls.legend,
        theme: this._getChartTheme(),
        map: null,
        isBigPreview: false,
        showSettingIcon: false,
        showZoomIcon: false,
        zoomToFeaturesWhenClick: false
      };
      if(!this.inSettingPage){
        args.map = this.map;
      }
      this.chart = new StatisticsChart(args);
      this.chart.placeAt(this.domNode);
      this._updateBackgroundColor();
    },

    _getChartTheme: function(){
      if(this.isDarkTheme()){
        return "dark";
      }else{
        return "light";
      }
    },

    clearChart: function(){
      //don't call _clear in this method
      this._showNodata();
    },

    startup: function(){
      this.inherited(arguments);
      setTimeout(lang.hitch(this, function(){
        this.chart.resizeByParent();
        if(this.inSettingPage){
          this._tryUpdateStatisticsChart();
        }else{
          if(this.dataSource){
            this.setDataSource(this.dataSource);
          }
        }
      }), 200);
    },

    destroy: function(){
      if(this.chart){
        this.chart.destroy();
      }
      this.chart = null;
      this.inherited(arguments);
    },

    resize: function(){
      if(this.chart){
        this.chart.resizeByParent();
      }
    },

    setDataSource: function(dataSource){
      this.dataSourceType = '';

      //clear CLIENT_FEATURES
      this.featureLayer = null;

      this.inherited(arguments);

      if(!dataSource){
        return;
      }

      if(dataSource.layerId){
        this._setDataSourceForLayerId(dataSource);
      }else if(dataSource.frameWorkDsId){
        var frameWorkDsId = dataSource.frameWorkDsId;
        //{from: 'map', layerId}
        //{from: 'widget', widgetId}
        //{from: 'external'}
        var dsInfo = this._getDsTypeInfoAndDsMeta(frameWorkDsId);
        var dsTypeInfo = dsInfo.dsTypeInfo;
        var dsMeta = dsInfo.dsMeta;
        if(dsTypeInfo && dsMeta){
          if (dsMeta.type === 'Features') {
            this._setDataSourceForFrameworkFeatures(dataSource, dsTypeInfo, dsMeta);
          } else if (dsMeta.type === 'FeatureStatistics') {
            this._setDataSourceForFeatureStatistics(dataSource, dsTypeInfo, dsMeta);
          }
        }
      }
    },

    _getDsTypeInfoAndDsMeta: function(frameWorkDsId){
      var result = {
        dsTypeInfo: null,
        dsMeta: null
      };
      result.dsTypeInfo = this.dataSourceManager.parseDataSourceId(frameWorkDsId);
      var dataSources = this.appConfig.dataSource && this.appConfig.dataSource.dataSources;
      if(dataSources){
        result.dsMeta = dataSources[frameWorkDsId];
      }
      return result;
    },

    _updateBackgroundColor: function(){
      if(this.config && this.config.backgroundColor){
        this.setBackgroundColor(this.config.backgroundColor);
      }
    },

    setBackgroundColor: function(bg){
      this.domNode.style.backgroundColor = bg;
    },

    //chart dijit related config, not widget config
    setConfig: function(config){
      this.config = config;
      this._updateBackgroundColor();
      this._tryUpdateStatisticsChart();
    },

    onDataSourceDataUpdate: function(data){
      this.inherited(arguments);

      if(this.dataSourceType === 'CLIENT_FEATURES'){
        this._onDataUpdateForClientFeatures(data);
      }else if(this.dataSourceType === 'FRAMEWORK_STATISTICS'){
        this._onDataUpdateForFrameworkStatistics(data);
      }else if(this.dataSourceType === 'FRAMEWORK_FEATURES'){
        this._onDataUpdateForFrameworkFeatures(data);
      }
    },

    _tryUpdateStatisticsChart: function(){
      this._hideNodata();
      var chartConfig = this._getChartConfigFromConfig();
      if(!chartConfig){
        this._showNodata();
        return;
      }

      if(!this.domNode.parentNode){
        this._showNodata();
        return;
      }

      if(this.data){
        if(!this.data.features){
          this.data.features = [];
        }
        if(this.data.features.length > 0){
          if(this.dataSourceType === 'CLIENT_FEATURES'){
            this._tryUpdateStatisticsChartForClientFeatures(chartConfig);
          }else if(this.dataSourceType === 'FRAMEWORK_FEATURES'){
            this._tryUpdateStatisticsChartForFrameworkFeatures(chartConfig);
          }else if(this.dataSourceType === 'FRAMEWORK_STATISTICS'){
            this._tryUpdateStatisticsChartForFrameworkStatistics(chartConfig);
          }
        }else{
          this._showMockData(chartConfig);
        }
      }else{
        this._showNodata();
      }
    },

    _getNodataTextColor: function(){
      var color = '';
      if(this.config){
        if(this.config.type === 'pie'){
          color = this.config.dataLabelColor;
        }else{
          color = this.config.horizontalAxisTextColor || this.config.verticalAxisTextColor;
        }
      }
      if(!color){
        color = '#666';
      }
      return color;
    },

    _getChartConfigFromConfig: function(){
      var chartConfig = null;
      if(this.config && this.config.mode && this.config.type){
        chartConfig = lang.clone(this.config);
        var type = chartConfig.type;
        var displayProperties = ["backgroundColor", "colors", "showLegend", "legendTextColor"];
        if(type === 'pie'){
          displayProperties = displayProperties.concat(["showDataLabel", "dataLabelColor"]);
        }else{
          displayProperties = displayProperties.concat([
            "showHorizontalAxis",
            "horizontalAxisTextColor",
            "showVerticalAxis",
            "verticalAxisTextColor"
          ]);
        }

        var chartDisplay = {};

        chartConfig.types = [{
          type: type,
          display: chartDisplay
        }];

        array.forEach(displayProperties, lang.hitch(this, function(displayProperty){
          chartDisplay[displayProperty] = chartConfig[displayProperty];
          delete chartConfig[displayProperty];
        }));
      }
      return chartConfig;
    },

    _hasFeatures: function(){
      return this.data && this.data.features && this.data.features.length >= 0;
    },

    _showNodata: function(){
      html.addClass(this.domNode, 'no-data');
      this.chart.clear();
    },

    _hideNodata: function(){
      html.removeClass(this.domNode, 'no-data');
    },

    _showMockData: function(chartConfig){
      chartConfig = lang.clone(chartConfig);
      var fieldNames = [];
      if(chartConfig.labelField){
        fieldNames.push(chartConfig.labelField);
      }
      if(chartConfig.categoryField){
        fieldNames.push(chartConfig.categoryField);
      }
      if(chartConfig.valueFields){
        fieldNames = fieldNames.concat(chartConfig.valueFields);
      }
      var mockDefinition = {
        fields: []
      };
      var mockFeature = {
        attributes: {}
      };
      mockDefinition.fields = array.map(fieldNames, lang.hitch(this, function(fieldName){
        mockFeature.attributes[fieldName] = 0;
        return {
          name: fieldName,
          type: 'esriFieldTypeInteger',
          alias: fieldName
        };
      }));

      this.chart.resizeByParent();
      this.chart.createClientCharts(mockDefinition, [mockFeature], chartConfig);
    },

    //--------------------------------------CLIENT_FEATURES-------------------------------------------

    _setDataSourceForLayerId: function(dataSource){
      this.dataSourceType = 'CLIENT_FEATURES';
      var layerInfo = this.layerInfosObj.getLayerInfoById(dataSource.layerId);

      if(!layerInfo){
        return;
      }

      layerInfo.getLayerObject().then(lang.hitch(this, function(layerObject){
        this.featureLayer = layerObject;
        this._tryUpdateStatisticsChart();
      }));
    },

    _onDataUpdateForClientFeatures: function(){
      this._tryUpdateStatisticsChart();
    },

    _tryUpdateStatisticsChartForClientFeatures: function(chartConfig){
      if (!this.featureLayer) {
        this._showNodata();
        return;
      }

      var features = this.data.features;
      if(features && this.inSettingPage){
        features = features.slice(0, this.featuresCountForPreview);
      }

      this.chart.resizeByParent();
      this.chart.createClientCharts(this.featureLayer, features, chartConfig);
    },

    //--------------------------------------FRAMEWORK_FEATURES----------------------------------------------

    _setDataSourceForFrameworkFeatures: function(){
      this.dataSourceType = 'FRAMEWORK_FEATURES';
      this._tryUpdateStatisticsChart();
    },

    _onDataUpdateForFrameworkFeatures: function(){
      this._tryUpdateStatisticsChart();
    },

    _tryUpdateStatisticsChartForFrameworkFeatures: function(chartConfig){
      var dsInfo = this._getDsTypeInfoAndDsMeta(this.dataSource.frameWorkDsId);
      var dsMeta = dsInfo.dsMeta;
      if(!dsMeta){
        this._showNodata();
        return;
      }

      var features = this.data.features;
      if(features && this.inSettingPage){
        features = features.slice(0, this.featuresCountForPreview);
      }

      this.chart.resizeByParent();
      this.chart.createClientCharts(dsMeta.dataSchema, features, chartConfig);
    },

    //--------------------------------------FRAMEWORK_STATISTICS----------------------------------------------

    _setDataSourceForFeatureStatistics: function(){
      this.dataSourceType = 'FRAMEWORK_STATISTICS';
      this._tryUpdateStatisticsChart();
    },

    _onDataUpdateForFrameworkStatistics: function(){
      this._tryUpdateStatisticsChart();
    },

    _tryUpdateStatisticsChartForFrameworkStatistics: function(chartConfig){
      var dsInfo = this._getDsTypeInfoAndDsMeta(this.dataSource.frameWorkDsId);
      var dsMeta = dsInfo.dsMeta;
      if(!dsMeta){
        this._showNodata();
        return;
      }

      this.chart.resizeByParent();
      this.chart.createServerStatisticsCharts(dsMeta.dataSchema, this.data.features, chartConfig);
    }

  });

  return clazz;
});