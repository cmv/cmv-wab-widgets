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
  'dojo/on',
  'dojo/query',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/_base/declare',
  './BaseDijitSetting',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./ChartDijitSetting.html',
  'jimu/utils',
  'jimu/DataSourceManager',
  'jimu/LayerInfos/LayerInfos',
  'jimu/dijit/TabContainer3',
  './_dijits/TogglePocket',
  './_dijits/ChartColorSetting',
  'jimu/utils',
  'jimu/dijit/_DataFields',
  'dijit/form/Select'
], function(on, query, lang, html, array, declare, BaseDijitSetting, _WidgetsInTemplateMixin, template, jimuUtils,
  DataSourceManager, LayerInfos, TabContainer3, TogglePocket){

  var clazz = declare([BaseDijitSetting, _WidgetsInTemplateMixin], {
    templateString: template,
    type: 'chart',
    baseClass: 'infographic-chart-dijit-setting',

    layerDefinition: null,
    _webMapLayerId: null,//the layerId in web map, maybe null
    highLightColor: '#ff0000',
    oidFieldType: 'esriFieldTypeOID',
    _stringFieldType: 'esriFieldTypeString',
    _numberFieldTypes: ['esriFieldTypeSmallInteger',
                        'esriFieldTypeInteger',
                        'esriFieldTypeSingle',
                        'esriFieldTypeDouble'],
    _dateFieldType: 'esriFieldTypeDate',
    ignoreChangeEvents: false,
    layerInfosObj: null,
    dataSourceManager: null,
    dataSourceType: '',//CLIENT_FEATURES, FRAMEWORK_FEATURES, FRAMEWORK_STATISTICS
    allAvailableValueFields: null,//maybe null
    tabContainer: null,

    postCreate: function(){
      this.inherited(arguments);
      this.layerInfosObj = LayerInfos.getInstanceSync();
      this.dataSourceManager = DataSourceManager.getInstance();
      this._setDefaultValueForConfig();
      this._initSelf();
    },

    _initSelf: function(){
      this.tabContainer = new TabContainer3({
        average: true,
        tabs: [{
          title: this.nls.data,
          content: this.dataSection
        }, {
          title: this.nls.display,
          content: this.displaySection
        }]
      });

      //legend for column, bar, line and pie
      this.legendTogglePocket = new TogglePocket({
        title: this.nls.legend,
        content: this.legendTogglePocketContent,
        className: 'section-item column-type bar-type line-type pie-type'
      });
      this.own(on(this.legendTogglePocket, 'change', lang.hitch(this, this._onLegendTogglePocketChanged)));
      this.legendTogglePocket.placeAt(this.displaySection);


      //horizontal axis for column, bar and line
      this.horTogglePocket = new TogglePocket({
        title: this.nls.horizontalAxis,
        content: this.horTogglePocketContent,
        className: 'section-item column-type bar-type line-type'
      });
      this.own(on(this.horTogglePocket, 'change', lang.hitch(this, this._onHorTogglePocketChanged)));
      this.horTogglePocket.placeAt(this.displaySection);

      //vertical axis for column, bar and line
      this.verTogglePocket = new TogglePocket({
        title: this.nls.verticalAxis,
        content: this.verTogglePocketContent,
        className: 'section-item column-type bar-type line-type'
      });
      this.own(on(this.verTogglePocket, 'change', lang.hitch(this, this._onVerTogglePocketChanged)));
      this.verTogglePocket.placeAt(this.displaySection);

      //data labels for pie
      this.dataLabelTogglePocket = new TogglePocket({
        title: this.nls.dataLabels,
        content: this.dataLabelTogglePocketContent,
        className: 'section-item pie-type'
      });
      this.own(on(this.dataLabelTogglePocket, 'change', lang.hitch(this, this._onDataLabelsTogglePocketChanged)));
      this.dataLabelTogglePocket.placeAt(this.displaySection);

      this.tabContainer.placeAt(this.domNode);

      this.ignoreChangeEvents = true;
      this._clear();
      this.ignoreChangeEvents = false;
      this._onChartModeChnaged();
      this._updateDijitBackgroundColor();
    },

    _setDefaultValueForConfig: function(){
      if(!this.config){
        return;
      }
      if(!this.config.backgroundColor){
        this.config.backgroundColor = '#ffffff';
      }
      if(!this.config.legendTextColor){
        this.config.legendTextColor = '#000000';
      }
      if(this.config.type === 'pie'){
        if(!this.config.dataLabelColor){
          this.config.dataLabelColor = '#000000';
        }
      }else{
        if(!this.config.horizontalAxisTextColor){
          this.config.horizontalAxisTextColor = '#000000';
        }
        if(!this.config.verticalAxisTextColor){
          this.config.verticalAxisTextColor = '#000000';
        }
      }
    },

    //-----------------------------------data------------------------------
    //dataSource: {layerId or frameWorkDsId}
    setDataSource: function(dataSource){
      this.inherited(arguments);
      this.dataSourceType = '';
      this.categoryFieldSelect.set('disabled', false);
      if(dataSource.layerId){
        this._setDataSourceForLayerId(dataSource);
      }else if(dataSource.frameWorkDsId){
        var frameWorkDsId = dataSource.frameWorkDsId;
        //{from: 'map', layerId}
        //{from: 'widget', widgetId}
        //{from: 'external'}
        var dsTypeInfo = this.dataSourceManager.parseDataSourceId(frameWorkDsId);
        if(dsTypeInfo){
          var dataSources = this.appConfig.dataSource && this.appConfig.dataSource.dataSources;
          var dsMeta = dataSources[frameWorkDsId];
          //dataSource, dsTypeInfo, dsMeta
          if (dsMeta.type === 'Features') {
            this._setDataSourceForFrameworkFeatures(dsMeta);
          } else if (dsMeta.type === 'FeatureStatistics') {
            this._setDataSourceForFeatureStatistics(dsMeta);
          }
        }
      }
    },

    //dataSource: {layerId}
    _setDataSourceForLayerId: function(dataSource){
      this.dataSourceType = 'CLIENT_FEATURES';
      var layerInfo = this.layerInfosObj.getLayerInfoById(dataSource.layerId);
      if (layerInfo) {
        var def = this._getServiceDefinitionByLayerInfo(layerInfo);
        def.then(lang.hitch(this, function(definition) {
          this.ignoreChangeEvents = true;

          if (this.config.mode) {
            this._resetByConfig(definition);
          } else {
            this._resetByNewLayerDefinition(definition);
          }

          setTimeout(lang.hitch(this, function() {
            this.ignoreChangeEvents = false;
          }), 200);
        }), lang.hitch(this, function(err){
          console.error(err);
        }));
      }
    },

    _getServiceDefinitionByLayerInfo: function(layerInfo){
      return layerInfo.getServiceDefinition().then(lang.hitch(this, function(definition){
        if(definition){
          return definition;
        }else{
          return layerInfo.getLayerObject().then(lang.hitch(this, function(layerObject){
            if(layerObject){
              return jimuUtils.getFeatureLayerDefinition(layerObject);
            }else{
              return null;
            }
          }));
        }
      }));
    },

    //dataSource: {frameWorkDsId}
    _setDataSourceForFrameworkFeatures: function(dsMeta){
      this.dataSourceType = 'FRAMEWORK_FEATURES';
      var definition = lang.clone(dsMeta.dataSchema);
      this.ignoreChangeEvents = true;

      if (this.config.mode) {
        this._resetByConfig(definition);
      } else {
        this._resetByNewLayerDefinition(definition);
      }

      setTimeout(lang.hitch(this, function() {
        this.ignoreChangeEvents = false;
      }), 200);
    },

    //dataSource: {frameWorkDsId}
    _setDataSourceForFeatureStatistics: function(dsMeta){
      this.dataSourceType = 'FRAMEWORK_STATISTICS';
      //mock layerDefinition
      var definition = {
        type: 'Table',
        fields: []
      };

      var dataSchema = lang.clone(dsMeta.dataSchema);

      var groupByFields = dataSchema.groupByFields || [];

      this.allAvailableValueFields = array.filter(dataSchema.fields, lang.hitch(this, function(fieldInfo){
        return groupByFields.indexOf(fieldInfo.name) < 0;
      }));

      definition.fields = dataSchema.fields;

      this.ignoreChangeEvents = true;

      if (this.config.mode) {
        this._resetByConfig(definition);
      } else {
        this._resetByNewLayerDefinition(definition);
      }

      this.chartModeSelect.removeOption('feature');

      if(groupByFields.length > 0){
        //available modes: category, count
        this.chartModeSelect.removeOption('field');
        if(!this.config.mode){
          var categoryField = groupByFields[0];
          this.categoryFieldSelect.set('value', categoryField);
          this.categoryFieldSelect.set('disabled', true);
        }
      }else{
        //available modes: field
        this.chartModeSelect.removeOption('count');
        this.chartModeSelect.removeOption('category');
      }

      setTimeout(lang.hitch(this, function() {
        this.ignoreChangeEvents = false;
      }), 200);
    },

    /*
    feature {mode,sortOrder,labelField,valueFields}
    category {mode,sortOrder,categoryField,valueFields,operation}
    count {mode,sortOrder,categoryField}
    field {mode,sortOrder,valueFields,operation}
    column bar line{
      backgroundColor,
      colors,
      showLegend,
      legendTextColor,
      showHorizontalAxis,
      horizontalAxisTextColor,
      showVerticalAxis,
      verticalAxisTextColor
    }
    pie {
      backgroundColor,
      colors,
      showLegend,
      legendTextColor,
      showDataLabel,
      dataLabelColor
    }
    */
    getConfig: function(){
      //this.config maybe comes from template or last saved config
      if(!this.config){
        return;
      }

      var chartConfig = {
        mode: '',
        type: ''
      };

      if(!this.layerDefinition){
        return null;
      }

      var mode = this.chartModeSelect.get('value');
      if(!mode){
        return null;
      }

      chartConfig.mode = mode;

      var valueFields = this.valueFields.getSelectedFieldNames();

      if(mode === 'feature'){
        var featureConfig = {
          labelField: '',
          valueFields: [],
          sortOrder: 'asc'
        };

        if(valueFields.length === 0){
          return null;
        }

        featureConfig.labelField = this.labelFieldSelect.get('value');

        featureConfig.valueFields = valueFields;

        lang.mixin(chartConfig, featureConfig);
      }else if(mode === 'category'){
        var categoryConfig = {
          categoryField: '',
          operation: '',
          valueFields: [],
          sortOrder: 'asc'
        };

        if(valueFields.length === 0){
          return null;
        }

        categoryConfig.categoryField = this.categoryFieldSelect.get('value');

        categoryConfig.operation = this.operationSelect.get('value');

        categoryConfig.valueFields = valueFields;

        lang.mixin(chartConfig, categoryConfig);
      }else if(mode === 'count'){
        var countConfig = {
          categoryField: '',
          sortOrder: 'asc'
        };

        countConfig.categoryField = this.categoryFieldSelect.get('value');

        lang.mixin(chartConfig, countConfig);
      }else if(mode === 'field'){
        var fieldConfig = {
          operation: '',
          valueFields: []
        };

        if(valueFields.length === 0){
          return null;
        }

        fieldConfig.operation = this.operationSelect.get('value');

        fieldConfig.valueFields = valueFields;

        lang.mixin(chartConfig, fieldConfig);
      }

      chartConfig.type = this.config.type;
      chartConfig.backgroundColor = this.bgColor.getSingleColor();
      chartConfig.colors = this.chartColor.getColors();
      chartConfig.showLegend = this.legendTogglePocket.getState();
      chartConfig.legendTextColor = this.legendTextColor.getSingleColor();

      if(chartConfig.type === 'pie'){
        chartConfig.showDataLabel = this.dataLabelTogglePocket.getState();
        chartConfig.dataLabelColor = this.dataLabelTextColor.getSingleColor();
      }else{
        chartConfig.showHorizontalAxis = this.horTogglePocket.getState();
        chartConfig.horizontalAxisTextColor = this.horTextColor.getSingleColor();
        chartConfig.showVerticalAxis = this.verTogglePocket.getState();
        chartConfig.verticalAxisTextColor = this.verTextColor.getSingleColor();
      }

      return chartConfig;
    },

    _resetByConfig: function(definition){
      if(!definition){
        return;
      }

      this._resetByNewLayerDefinition(definition);
      this.chartModeSelect.set('value', this.config.mode);

      if(this.config.labelField){
        this.labelFieldSelect.set('value', this.config.labelField);
      }

      if(this.config.categoryField){
        this.categoryFieldSelect.set('value', this.config.categoryField);
      }

      if(this.config.valueFields){
        this.valueFields.selectFields(this.config.valueFields);
      }

      if(this.config.operation){
        this.operationSelect.set('value', this.config.operation);
      }
    },

    _resetByNewLayerDefinition: function(definition){
      if(!definition){
        return;
      }

      this._addAliasForLayerInfo(definition);
      this._clear();

      //general
      this.layerDefinition = definition;

      //details
      //reset categoryFieldSelect, labelFieldSelect, valueFields
      this._resetFieldsDijitsByLayerInfo(this.layerDefinition);
    },

    _clear: function(){
      //reset general

      this.layerDefinition = null;

      this.allAvailableValueFields = null;

      this.dijit.clearChart();

      this.chartModeSelect.removeOption(this.chartModeSelect.getOptions());

      //reset details
      this.categoryFieldSelect.set('disabled', false);

      this.labelFieldSelect.removeOption(this.labelFieldSelect.getOptions());

      this.categoryFieldSelect.removeOption(this.categoryFieldSelect.getOptions());

      this.operationSelect.set('value', 'sum');

      this.valueFields.clear();
      this._checkPieValueFields();

      //display section
      this._updateChartTypes();

      this.bgColor.setSingleColor(this.config.backgroundColor);
      this.chartColor.setColorsAutomatically(this.config.colors);
      this.legendTextColor.setSingleColor(this.config.legendTextColor);
      this.horTextColor.setSingleColor(this.config.horizontalAxisTextColor);
      this.verTextColor.setSingleColor(this.config.verticalAxisTextColor);
      this.dataLabelTextColor.setSingleColor(this.config.dataLabelColor);

      this.legendTogglePocket.setState(!!this.config.showLegend);
      this.horTogglePocket.setState(!!this.config.showHorizontalAxis);
      this.verTogglePocket.setState(!!this.config.showVerticalAxis);
      this.dataLabelTogglePocket.setState(!!this.config.showDataLabel);
    },

    _resetFieldsDijitsByLayerInfo: function(layerDefinition){
      //reset chartModeSelect
      this.chartModeSelect.removeOption(this.chartModeSelect.getOptions());

      if(this._hasNumberFields(layerDefinition)){
        this.chartModeSelect.addOption({
          value: 'feature',
          label: this.nls.featureOption
        });
        this.chartModeSelect.addOption({
          value: 'category',
          label: this.nls.categoryOption
        });
        this.chartModeSelect.addOption({
          value: 'count',
          label: this.nls.countOption
        });
        this.chartModeSelect.addOption({
          value: 'field',
          label: this.nls.fieldOption
        });
        var firstOption = this.chartModeSelect.getOptions()[0];
        this.chartModeSelect.set('value', firstOption.value);
      }else{
        this.chartModeSelect.addOption({
          value: 'count',
          label: this.nls.countOption
        });
        this.chartModeSelect.set('value', 'count');
      }

      var displayField = layerDefinition.displayField;
      var fieldInfos = lang.clone(layerDefinition.fields);

      //categoryFieldSelect
      var categoryFieldTypes = [this._stringFieldType, this._dateFieldType];
      categoryFieldTypes = categoryFieldTypes.concat(lang.clone(this._numberFieldTypes));

      var availableCategoryFieldInfos = array.filter(fieldInfos, lang.hitch(this, function(fieldInfo){
        return categoryFieldTypes.indexOf(fieldInfo.type) >= 0;
      }));

      this.categoryFieldSelect.removeOption(this.categoryFieldSelect.getOptions());

      var selectedCategoryFieldValue = '';

      array.forEach(availableCategoryFieldInfos, lang.hitch(this, function(fieldInfo){
        var option = {
          value: fieldInfo.name,
          label: fieldInfo.alias
        };

        this.categoryFieldSelect.addOption(option);

        if(fieldInfo.name === displayField){
          selectedCategoryFieldValue = displayField;
        }
      }));

      this.categoryFieldSelect.set('value', selectedCategoryFieldValue);

      //labelFieldSelect
      var a = this._stringFieldType;
      var b = this.oidFieldType;
      var c = this._dateFieldType;
      var featureLabelFieldTypes = [a, b, c].concat(lang.clone(this._numberFieldTypes));

      var availableLabelFieldInfos = array.filter(fieldInfos, lang.hitch(this, function(fieldInfo){
        return featureLabelFieldTypes.indexOf(fieldInfo.type) >= 0;
      }));

      this.labelFieldSelect.removeOption(this.labelFieldSelect.getOptions());

      var selectedAxisLabelValue = '';

      array.forEach(availableLabelFieldInfos, lang.hitch(this, function(fieldInfo){
        var option = {
          value: fieldInfo.name,
          label: fieldInfo.name || fieldInfo.alias
        };

        if(displayField){
          if(fieldInfo.name === displayField){
            selectedAxisLabelValue = fieldInfo.name;
          }
        }else{
          if(fieldInfo.type === this.oidFieldType){
            selectedAxisLabelValue = fieldInfo.name;
          }
        }

        this.labelFieldSelect.addOption(option);
      }));

      this.labelFieldSelect.set('value', selectedAxisLabelValue);

      //valueFields
      var numberFieldInfos = array.filter(fieldInfos, lang.hitch(this, function(fieldInfo){
        return this._numberFieldTypes.indexOf(fieldInfo.type) >= 0;
      }));
      this.valueFields.setFields(numberFieldInfos);
    },

    _addAliasForLayerInfo: function(layerInfo){
      if(layerInfo && layerInfo.fields && layerInfo.fields.length > 0){
        array.forEach(layerInfo.fields, lang.hitch(this, function(fieldInfo){
          if(fieldInfo.name && !fieldInfo.alias){
            fieldInfo.alias = fieldInfo.name;
          }
        }));
      }
    },

    _hasNumberFields: function(layerDefinition){
      var result = false;
      var fieldInfos = layerDefinition.fields;
      if(fieldInfos && fieldInfos.length > 0){
        result = array.some(fieldInfos, lang.hitch(this, function(fieldInfo){
          return this._numberFieldTypes.indexOf(fieldInfo.type) >= 0;
        }));
      }
      return result;
    },

    _checkPieValueFields: function(){
      var chartMode = this.chartModeSelect.get('value');
      if(chartMode === 'feature' || chartMode === 'category'){
        if(this.config && this.config.type === 'pie'){
          this.valueFields.setSingleMode();
          return;
        }
      }
      this.valueFields.setMultipleMode();
    },

    _onChartModeChnaged: function(){
      this._checkPieValueFields();

      var chartMode = this.chartModeSelect.get('value') || '';

      var className = chartMode + '-mode';
      var dataSectionItems = query('.section-item', this.dataSection);

      array.forEach(dataSectionItems, lang.hitch(this, function(sectionItem){
        if(html.hasClass(sectionItem, className)){
          this._showSectionItem(sectionItem);
        }else{
          this._hideSectionItem(sectionItem);
        }
      }));

      this._updateChartTypes();

      this._onChartConfigDijitsChanged();
    },

    //data section
    _onLabelFieldChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    _onCategoryFieldChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    _onOperationSelectChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    _onValueFieldsChanged: function(){
      this._updateChartTypes();
      this._onChartConfigDijitsChanged();
    },

    //display section
    _onBgColorChanged: function(){
      this._updateDijitBackgroundColor();
      this._onChartConfigDijitsChanged();
    },

    _updateDijitBackgroundColor: function(){
      var bg = this.bgColor.getSingleColor();
      this.dijit.setBackgroundColor(bg);
    },

    _onChartColorChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    //legend
    _onLegendTogglePocketChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    _onLegendTextColorChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    //horizontal axis
    _onHorTogglePocketChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    _onHorColorChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    //vertical axis
    _onVerTogglePocketChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    _onVerColorChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    //data labels
    _onDataLabelsTogglePocketChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    _onDataLabelColorChanged: function(){
      this._onChartConfigDijitsChanged();
    },

    //dijit changed
    _onChartConfigDijitsChanged: function(){
      if(this.ignoreChangeEvents){
        return;
      }

      var config = this.getConfig();

      if(config){
        this._tryUpdatePreview();
      }
    },

    _updateChartTypes: function(){
      var fields = this.valueFields.getSelectedFieldNames();
      var valueFieldsCount = fields.length;
      var chartMode = this.chartModeSelect.get('value');
      var chartType = this.config.type;

      //update visibility
      var chartTypeClassName = chartType + "-type";

      var displayItems = query('.section-item', this.displaySection);

      array.forEach(displayItems, lang.hitch(this, function(sectionItem){
        if(html.hasClass(sectionItem, chartTypeClassName)){
          this._showSectionItem(sectionItem);
        }else{
          this._hideSectionItem(sectionItem);
        }
      }));

      //update colors
      if(chartType === 'pie'){
        //pie always show multiple colors
        this.chartColor.setMode(false);
      }else{
        if(chartMode === 'feature' || chartMode === 'category'){
          if(valueFieldsCount === 1){
            //if one field selected, should show single color section
            this.chartColor.setMode(true);
          }else{
            //if none or more than two fields selected, should show multiple color section
            this.chartColor.setMode(false);
          }
        }else{
          //chart only supports single color for count and field mode
          this.chartColor.setMode(true);
        }
      }
    },

    _showSectionItem: function(itemDom){
      html.removeClass(itemDom, 'hide');
    },

    _hideSectionItem: function(itemDom){
      html.addClass(itemDom, 'hide');
    },

    _tryUpdatePreview: function(){
      var config = this.getConfig();
      this.dijit.setConfig(config);
    },

    //-1 means rejected or canceled
    //0 means def is null
    //1 means pending
    //2 means resolved
    _getDefStatus: function(def) {
      if (def) {
        if (def.isFulfilled()) {
          if (def.isResolved()) {
            return 2;
          } else {
            return -1;
          }
        } else {
          return 1;
        }
      } else {
        return 0;
      }
    }

  });

  return clazz;
});