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
  'dojo/on',
  'dojo/query',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/Deferred',
  'dojo/_base/declare',
  './BaseDijitSetting',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./ChartDijitSetting.html',
  'jimu/DataSourceManager',
  'jimu/LayerInfos/LayerInfos',
  'jimu/dijit/TabContainer3',
  'jimu/utils',
  './_dijits/ChartSort',
  './_dijits/TogglePocket',
  './_dijits/VisibleSliderBar',
  'dijit/form/NumberSpinner',
  './_dijits/SeriesStyle',
  './_dijits/ChartColorSetting',
  'jimu/dijit/_DataFields',
  'dijit/form/Select'
], function(on, query, lang, html, array, Deferred, declare, BaseDijitSetting, _WidgetsInTemplateMixin,
  template, DataSourceManager, LayerInfos, TabContainer3, jimuUtils, ChartSort, TogglePocket,
  VisibleSliderBar, NumberSpinner, SeriesStyle) {
  var clazz = declare([BaseDijitSetting, _WidgetsInTemplateMixin], {
    templateString: template,
    type: 'chart',
    baseClass: 'infographic-chart-dijit-setting',
    colors: ['#68D2E0', '#087E92', '#47BCF5', '#FBE66A', '#F29157', '#C8501D', '#2DB7C6', '#C4EEF6'],
    oidFieldType: 'esriFieldTypeOID',
    _stringFieldType: 'esriFieldTypeString',
    _numberFieldTypes: ['esriFieldTypeSmallInteger',
      'esriFieldTypeInteger',
      'esriFieldTypeSingle',
      'esriFieldTypeDouble'
    ],
    _dateFieldType: 'esriFieldTypeDate',
    ignoreChangeEvents: false,
    layerInfosObj: null,
    dataSourceManager: null,
    //dataSourceType: '', //CLIENT_FEATURES, FRAMEWORK_FEATURES, FRAMEWORK_STATISTICS
    tabContainer: null,
    //_INIT_ default value

    /* Init dom and default option */
    constructor: function(option) {
      this.appConfig = option.appConfig;
      this.config = option.config;

      this.ORIGIN_VALUE = (function() {
        var privateVariable = {};
        return {
          get: function(name) {
            return privateVariable[name];
          },
          set: function(keyValue) {
            var key = Object.keys(keyValue)[0];
            privateVariable[key] = keyValue[key];
          }
        };
      })();
      this._saveOriginValue(this.config);

      this.inherited(arguments);
      this.PRE_MODLE = {
        config: {},
        computed: {}
      };
      this.modle = this._getModleTemplate();
      this.layerInfosObj = LayerInfos.getInstanceSync();
      this.dataSourceManager = DataSourceManager.getInstance();
    },

    _saveOriginValue: function(config) {
      if (typeof config.type !== 'undefined') {
        this.ORIGIN_VALUE.set({
          type: config.type
        });
      }
      if (typeof config.innerRadius !== 'undefined') {
        this.ORIGIN_VALUE.set({
          innerRadius: config.innerRadius
        });
      }
      if (typeof config.area !== 'undefined') {
        this.ORIGIN_VALUE.set({
          area: config.area
        });
      }
      if (typeof config.stack !== 'undefined') {
        this.ORIGIN_VALUE.set({
          stack: config.stack
        });
      }
    },

    _getModleTemplate: function() {

      var TEMPLATE_CONFIG = this._getInitConfigByTemplateConfig();
      //KEEP
      var MODLE_TEMPLATE = {
        dataSource: null,
        config: TEMPLATE_CONFIG,
        computed: {
          //rely on layer definition by data source
          modes: ["feature", "category", "count", "field"],
          //fields by definition
          categoryFieldOptions: [],
          splitedField: {
            show: false,
            splitedFieldOptions: []
          },

          labelFieldsOptions: [],
          valueFields: [],

          sortOrder: null,
          definition: null,
          showDateOption: false,
          showUseLayerSymbology: false,
          //calcute by config
          valueFieldsAsMultipleMode: true,

          seriesStyleComputed: null,
          legendDisplay: true
        }
      };
      return lang.clone(MODLE_TEMPLATE);
    },

    _getInitSortOrderConfig: function(config) {
      var sortOrderConfig = null;
      if (!config && !config.mode) {
        return sortOrderConfig;
      }
      var field;
      var fieldOption = this._getSortFields(this.modle);
      if (fieldOption && fieldOption[0]) {
        field = fieldOption[0].value;
      }
      var mode = config.mode;
      if (mode === 'feature') {
        if (field) {
          sortOrderConfig = {
            field: field,
            isAsc: true
          };
        }
      } else {
        sortOrderConfig = {
          isLabelAxis: true,
          isAsc: true
        };
      }
      return sortOrderConfig;
    },

    postCreate: function() {
      this.inherited(arguments);
      this._initDom();
    },

    _getDefaultColorByDiffTheme: function() {
      var colors = {
        bgColor: '#fff',
        textColor: '#000'
      };
      if (!this.appConfig) {
        return colors;
      }
      if (this.appConfig.theme.name === 'DashboardTheme' &&
        (this.appConfig.theme.styles[0] === 'default' || this.appConfig.theme.styles[0] === 'style3')) {
        colors.bgColor = '#222222';
        colors.textColor = '#fff';
      } else if (this.appConfig.theme.name === 'DartTheme') {
        colors.bgColor = '#4c4c4c';
        colors.textColor = '#fff';
      }
      return colors;
    },

    /* Program entry, start rendering when there is a data source */
    setDataSource: function(dataSource) {
      this.inherited(arguments);
      //If the data source does not change, do not do the operation
      if (this._isDSEqual(this.modle.dataSource, dataSource)) {
        return;
      }
      //If you have a data source, now set up a new data source,
      //Reset UI based on initial template data
      if (this.modle.dataSource) {
        this._clear();
      } else {
        //Setting new data source for the first time, complete config and assigned to this.modle
        var fillConfig = this._updateConfigForTemplateConfig(this.config);
        var config = lang.mixin(this.modle.config, fillConfig || {});
        this.modle.config = config;
      }
      this.modle.dataSource = dataSource;
      this._updateModleWithDataSource(this.modle);
    },

    //Updating modle.definition(layerDefinition) based on data source
    _updateModleWithDataSource: function(modle) {
      var dataSource = modle.dataSource;
      if (!dataSource) {
        return;
      }
      this._getLayerDefinitionByDataSource(modle).then(function(definition) {
        modle.computed.definition = definition;
        this._moveValueFieldToFirst = true;
        //render UI by new data source and config
        this.render(modle);
        this._moveValueFieldToFirst = false;
      }.bind(this));
    },

    render: function(modle) {
      this.ignoreChangeEvents = true;
      this._updateModleComputed(modle);
      this._dynamicUpdateInitConfig(modle);
      this._render(modle);

      setTimeout(lang.hitch(this, function() {
        this.ignoreChangeEvents = false;
        this.onChange();
      }.bind(this)), 200);
    },

    _dynamicUpdateInitConfig: function(modle) {
      //update modle.config.seriesStyle
      this._updateModleSeriesStyle(modle);
      this._initSortOrderWhenItsNull(modle);
    },

    _initSortOrderWhenItsNull: function(modle) {
      var config = modle.config;
      if (config && !config.sortOrder) {
        config.sortOrder = this._getInitSortOrderConfig(config);
      }
    },

    getConfig: function() {
      var config = this.modle.config;
      if (!config) {
        return null;
      }
      if (!this.modle.computed.definition) {
        return null;
      }
      if (!config.mode) {
        return null;
      }
      if (config.mode !== 'count' && config.valueFields.length === 0) {
        return null;
      }
      if (!this.maxLabels.isValid()) {
        return null;
      }
      if (config.type === 'pie' && config.maxLabels === '') {
        return null;
      }
      return lang.clone(config);
    },

    destroy: function() {
      if (this.tabContainer) {
        this.tabContainer.destroy();
        this.tabContainer = null;
      }

      if (this.hollowSizeControl) {
        this.hollowSizeControl.destroy();
        this.hollowSizeControl = null;
      }

      if (this.legendTextSizeControl) {
        this.legendTextSizeControl.destroy();
        this.legendTextSizeControl = null;
      }

      if (this.verticalAxisTextSizeControl) {
        this.verticalAxisTextSizeControl.destroy();
        this.verticalAxisTextSizeControl = null;
      }

      if (this.horizontalAxisTextSizeControl) {
        this.horizontalAxisTextSizeControl.destroy();
        this.horizontalAxisTextSizeControl = null;
      }

      if (this.dataLabelSizeControl) {
        this.dataLabelSizeControl.destroy();
        this.dataLabelSizeControl = null;
      }

      if (this.legendTogglePocket) {
        this.legendTogglePocket.destroy();
        this.legendTogglePocket = null;
      }

      if (this.horTogglePocket) {
        this.horTogglePocket.destroy();
        this.horTogglePocket = null;
      }

      if (this.verTogglePocket) {
        this.verTogglePocket.destroy();
        this.verTogglePocket = null;
      }

      if (this.dataLabelTogglePocket) {
        this.dataLabelTogglePocket.destroy();
        this.dataLabelTogglePocket = null;
      }

      if (this.chartSortDijit) {
        this.chartSortDijit.destroy();
        this.chartSortDijit = null;
      }

      if (this.maxLabels) {
        this.maxLabels.destroy();
        this.maxLabels = null;
      }

      this.inherited(arguments);
    },

    onChange: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      var config = this.getConfig();
      if (config) {
        this.dijit.setConfig(config);
      }
    },

    _reset: function() {
      var config = this.modle.config;
      this.ignoreChangeEvents = true;
      //INIT by chart type and mode
      this._updateElementDisplayByChartType(config.type);
      this._updateElementDisplayByChartMode(this.modle);
      //INIT COLORS
      //0.series style
      if (config.seriesStyle) {
        this.seriesStyleDijit.setConfig(config.seriesStyle);
      }
      //1.background color
      if (config.backgroundColor) {
        this.bgColor.setColorsAutomatically([config.backgroundColor]);
      }
      //2.legend text color
      if (config.legendTextColor) {
        this.legendTextColor.setColorsAutomatically([config.legendTextColor]);
      }
      //3.horizontal axis text color
      if (config.horizontalAxisTextColor) {
        this.horTextColor.setColorsAutomatically([config.horizontalAxisTextColor]);
      }
      //4.vertical axis text color
      if (config.verticalAxisTextColor) {
        this.verTextColor.setColorsAutomatically([config.verticalAxisTextColor]);
      }
      //5.data label text color
      if (config.dataLabelColor) {
        this.dataLabelTextColor.setColorsAutomatically([config.dataLabelColor]);
      }

      //_INIT_ config.operation
      if (!config.operation) {
        config.operation = this.operationSelect.get('value');
      }
      //_INIT_ maxLabels
      if (config.type === 'pie') {
        config.maxLabels = 100;
      }
      setTimeout(lang.hitch(this, function() {
        this.ignoreChangeEvents = false;
      }), 200);
    },

    _clear: function() {
      this.modle = this._getModleTemplate();
      this._reset();
      this._showChartNoData();
    },

    //Get the initial modle of seriesStyle dijit
    _getSeriesStyleInitModle: function(modle) {
      var config = this._updateModleSeriesStyle(modle);
      var computed = this._calcuteSeriesStyleComputed(modle);
      return {
        config: config,
        computed: computed
      };
    },

    //update modle.config.seriesStyle by computed.showUseLayerSymbology
    //and new config.valueFields and config.mode
    _updateModleSeriesStyle: function(modle) {
      var config = modle.config;
      var mode = config.mode;
      var type = config.type;
      var area = config.area;
      var valueFields = config.valueFields;
      var computed = modle.computed;
      var definition = computed.definition;
      var seriesStyle = lang.clone(config.seriesStyle);
      var hasOpacity = false;
      if (type === 'line' && area) {
        hasOpacity = true;
      }

      var showUseLayerSymbology = computed.showUseLayerSymbology;

      if (!showUseLayerSymbology) {
        delete seriesStyle.useLayerSymbology;
      } else {
        if (!seriesStyle.useLayerSymbology) {
          seriesStyle.useLayerSymbology = false;
        }
      }
      var styles = seriesStyle.styles || [];
      var existingFields = [],
        obsoleteFields = [],
        notAddedFields = [];

      existingFields = styles.map(function(item) {
        return item.name;
      });

      obsoleteFields = existingFields.filter(function(item) {
        return valueFields.indexOf(item) < 0;
      });

      notAddedFields = valueFields.filter(function(vf) {
        return existingFields.indexOf(vf) < 0;
      });
      var colorAsArray = false;
      if (type === 'column' || type === 'bar' || type === 'line') {
        if (type === 'line' && mode === 'field') {
          if (existingFields[0] === 'line~field') {
            obsoleteFields = [];
            notAddedFields = [];
          } else {
            obsoleteFields = existingFields;
            notAddedFields = ['line~field'];
          }
        } else {
          if (mode === 'count') {
            if (existingFields[0] === 'count~count') {
              obsoleteFields = [];
              notAddedFields = [];
            } else {
              obsoleteFields = existingFields;
              notAddedFields = ['count~count'];
            }
          }
        }
      } else if (type === 'pie') {
        if (mode !== 'field') {
          if (existingFields[0] === 'pie~not-field') {
            obsoleteFields = [];
            notAddedFields = [];
          } else {
            colorAsArray = true;
            obsoleteFields = existingFields;
            notAddedFields = ['pie~not-field'];
          }
        }
      }
      styles = styles.filter(function(item) {
        return obsoleteFields.indexOf(item.name) < 0;
      });
      var index = styles.length;
      var newStyles = notAddedFields.map(function(item, i) {
        return this._createSeriesStyle(item, hasOpacity, index + i, colorAsArray);
      }.bind(this));
      styles = styles.concat(newStyles);
      seriesStyle.styles = null;
      seriesStyle.styles = styles;
      styles.forEach(function(style) {
        if (valueFields.indexOf(style.name) > -1) {
          style.label = this._getFieldAlias(style.name, definition);
        } else {
          style.label = style.name;
        }
      }.bind(this));
      config.seriesStyle = seriesStyle;
      return lang.clone(seriesStyle);
    },

    _createSeriesStyle: function(valueField, showOpacity, index, colorAsArray) {
      var style = {
        name: valueField,
        style: {
          color: this._getRandomColor(index)
        }
      };
      if (showOpacity) {
        style.style.opacity = 6;
      }
      if (colorAsArray) {
        // style.style.color = ['#5d9cd3', '#eb7b3a', '#a5a5a5', '#febf29', '#4673c2', '#72ad4c'];
        style.style.color = ['#68D2E0', '#087E92', '#47BCF5', '#FBE66A', '#F29157', '#C8501D'];
      }
      return style;
    },

    _calcuteSeriesStyleComputed: function(modle) {
      var config = modle.config;
      var mode = config.mode;
      var type = config.type;
      var area = config.area;
      var valueFields = config.valueFields;
      var modleComputed = modle.computed;
      var showUseLayerSymbology = modleComputed.showUseLayerSymbology;

      var computed = {};

      var singleColor = false;
      var fieldColors = false;
      var showOpacity = false;
      var colorSingleMode = true;

      if (showUseLayerSymbology) {
        computed.radioPanel = {
          singleColor: false
        };
      } else {
        computed.radioPanel = false;
      }

      if (type === 'line' || type === 'column' || type === 'bar') {
        if (area) {
          showOpacity = true;
        }
        if (type === 'line' && mode === 'field') {
          singleColor = true;
          fieldColors = false;
        } else {
          if (mode === 'feature' || mode === 'category' || mode === 'field') {
            if (valueFields.length <= 1) {
              singleColor = true;
            } else {
              fieldColors = true;
            }
          } else if (mode === 'count') {
            singleColor = true;
          }
        }

      } else if (type === 'pie') {
        if (mode === 'field') {
          colorSingleMode = true;
          if (valueFields.length <= 1) {
            singleColor = true;
          } else {
            fieldColors = true;
          }
        } else {
          colorSingleMode = false;
          singleColor = true;
        }
      }

      computed.colorSingleMode = colorSingleMode;
      computed.showOpacity = showOpacity;
      if (computed.radioPanel) {
        computed.radioPanel.singleColor = singleColor;
        computed.radioPanel.fieldColors = fieldColors;
      } else {
        computed.singleColor = singleColor;
        computed.fieldColors = fieldColors;
      }

      return computed;
    },

    _getRandomColor: function(i) {
      var length = this.colors.length;
      i = i % length;
      return this.colors[i];
    },

    _updateUIByMode: function() {
      this.ignoreChangeEvents = true;
      this.chartModeSelect.set('value', this.modle.config.mode);
      this._updateElementDisplayByChartMode(this.modle);
      this._updateElementDisplayByChartType(this.modle.config.type);
      setTimeout(lang.hitch(this, function() {
        this.ignoreChangeEvents = false;
      }), 200);
    },

    _renderByModuleComputed: function(modle) {
      var computed = modle.computed;
      var preComputed = this.PRE_MODLE.computed;
      if (this._isEqual(computed, preComputed)) {
        return;
      }
      if (!computed) {
        return;
      }
      //1.categoryFieldOptions
      if (!this._isEqual(computed.categoryFieldOptions, preComputed.categoryFieldOptions)) {
        if (computed.categoryFieldOptions) {
          this._updateOptions(this.categoryFieldSelect, computed.categoryFieldOptions);
        }
      }
      //2.labelFieldsOptions
      if (!this._isEqual(computed.labelFieldsOptions, preComputed.labelFieldsOptions)) {
        if (computed.labelFieldsOptions) {
          this._updateOptions(this.labelFieldSelect, computed.labelFieldsOptions);
        }
      }
      //3.valueFields
      if (!this._isEqual(computed.valueFields, preComputed.valueFields)) {
        if (computed.valueFields) {
          this.valueFields.setFields(computed.valueFields);
        }
      }
      //4.splitField
      if (!this._isEqual(computed.splitedField, preComputed.splitedField)) {
        var splitedField = computed.splitedField;
        if (splitedField.show) {
          this._showSplitedContainer();
          if (splitedField.splitedFieldOptions.length > 0) {
            this._updateOptions(this.splitFieldSelect, lang.clone(splitedField.splitedFieldOptions));
          }
        } else {
          this._hideSplitedContainer();
        }
      }
      //5.modes
      if (!this._isEqual(computed.modes, preComputed.modes)) {
        if (computed.modes && computed.modes.length > 0) {
          this._initChartMode(computed.modes);
        } else {
          this._initChartMode(["feature", "category", "count", "field"]);
        }
      }

      //6.showDateOption
      if (!this._isEqual(computed.showDateOption, preComputed.showDateOption)) {
        if (computed.showDateOption) {
          this._showDataOption(this.modle.config.type);
          //_INIT_ dateConfig
          if (!modle.config.dateConfig) {
            var dateConfig = {
              isNeedFilled: true,
              minPeriod: 'automatic'
            };
            if (this.modle.config.type === 'pie') {
              dateConfig.isNeedFilled = false;
            }
            modle.config.dateConfig = dateConfig;
          }
        } else {
          this._hideDataOption();
          modle.config.dateConfig = null;
        }
      }

      //8.sort fields
      if (!this._isEqual(computed.sortComputed, preComputed.sortComputed)) {
        if (computed.sortComputed) {
          this.chartSortDijit.updateComputeds(computed.sortComputed);
        }
      }

      //9.valueFieldsAsMultipleMode
      if (!this._isEqual(computed.valueFieldsAsMultipleMode, preComputed.valueFieldsAsMultipleMode)) {
        if (computed.valueFieldsAsMultipleMode) {
          this.valueFields.setMultipleMode();
        } else {
          this.valueFields.setSingleMode();
        }
      }
      // 10.series style option seriesStyleComputed
      if (!this._isEqual(computed.seriesStyleComputed, preComputed.seriesStyleComputed)) {
        this.seriesStyleDijit.updateComputed(computed.seriesStyleComputed);
      }

      //11.legend display
      if (!this._isEqual(computed.legendDisplay, preComputed.legendDisplay)) {
        if (computed.legendDisplay) {
          this._showLegend();
        } else {
          this._hideLegend();
        }
      }
    },

    _renderByModuleConfig: function(modle) {
      var config = modle.config;
      var preConfig = this.PRE_MODLE.config;
      if (!config) {
        return;
      }
      //1.mode
      if (!this._isEqual(config.mode, preConfig.mode)) {
        if (config.mode) {
          this.chartModeSelect.set('value', config.mode);
          this._updateElementDisplayByChartMode(modle);
        }
      }
      //2.labelField
      if (!this._isEqual(config.labelField, preConfig.labelField) && config.labelField) {
        this.labelFieldSelect.set('value', config.labelField);
      }
      //3.categoryField
      if (!this._isEqual(config.categoryField, preConfig.categoryField) && config.categoryField) {
        this.categoryFieldSelect.set('value', config.categoryField);
      }
      //4.valueFields
      if (!this._isEqual(config.valueFields, preConfig.valueFields) && config.valueFields) {
        this.valueFields.selectFields(config.valueFields, !this._moveValueFieldToFirst);
      }
      // splitedField
      if (!this._isEqual(config.splitField, preConfig.splitField)) {
        this.splitFieldSelect.set('value', config.splitField);
      }
      //5.operation
      if (!this._isEqual(config.operation, preConfig.operation)) {
        if (config.operation) {
          this.operationSelect.set('value', config.operation);
        } else {
          this.operationSelect.set('value', 'sum');
        }
      }

      //6.date config
      if (!this._isEqual(config.dateConfig, preConfig.dateConfig)) {
        if (config.dateConfig) {
          var dateConfig = config.dateConfig;
          //Minimum period
          this.periodSelect.set('value', dateConfig.minPeriod);
          //Periods without records
          this.showRadioBtn.setChecked(dateConfig.isNeedFilled);
          this.hideRadioBtn.setChecked(!dateConfig.isNeedFilled);
        } else {
          this.periodSelect.set('value', 'automatic');
          this.showRadioBtn.setChecked(true);
          this.hideRadioBtn.setChecked(false);
        }
      }

      //7. sort order
      if (!this._isEqual(config.sortOrder, preConfig.sortOrder) && config.sortOrder) {
        this.chartSortDijit.setConfig(config.sortOrder);
      }
      //8.max categories(labels)
      if (!this._isEqual(config.maxLabels, preConfig.maxLabels)) {
        if (typeof config.maxLabels !== 'undefined') {
          this.maxLabels.set('value', config.maxLabels);
        } else {
          this.maxLabels.set('value', '');
        }
      }

      //9.null value
      if (!this._isEqual(config.nullValue, preConfig.nullValue)) {
        if (typeof config.nullValue !== 'undefined') {
          this.zeroRadioBtn.setChecked(config.nullValue);
          this.ignoreRadioBtn.setChecked(!config.nullValue);
        } else {
          this.zeroRadioBtn.setChecked(true);
          this.ignoreRadioBtn.setChecked(false);
        }
      }

      //10 series style
      if (!this._isEqual(config.seriesStyle, preConfig.seriesStyle)) {
        this.seriesStyleDijit.setConfig(config.seriesStyle);
      }

      if (!this._isEqual(config.innerRadius, preConfig.innerRadius)) {
        if (typeof config.innerRadius !== 'undefined') {
          this.hollowSizeControl.setValue(config.innerRadius);
        }
      }

      //11.display section, except use layer's symbol
      if (!this._isEqual(config.backgroundColor, preConfig.backgroundColor)) {
        this.bgColor.setSingleColor(config.backgroundColor);
      }

      if (!this._isEqual(config.legendTextColor, preConfig.legendTextColor)) {
        this.legendTextColor.setSingleColor(config.legendTextColor);
      }

      if (!this._isEqual(config.horizontalAxisTextColor, preConfig.horizontalAxisTextColor)) {
        this.horTextColor.setSingleColor(config.horizontalAxisTextColor);
      }
      if (!this._isEqual(config.verticalAxisTextColor, preConfig.verticalAxisTextColor)) {
        this.verTextColor.setSingleColor(config.verticalAxisTextColor);
      }
      if (!this._isEqual(config.dataLabelColor, preConfig.dataLabelColor)) {
        this.dataLabelTextColor.setSingleColor(config.dataLabelColor);
      }
      if (!this._isEqual(config.showLegend, preConfig.showLegend)) {
        this.legendTogglePocket.setState(!!config.showLegend);
      }
      if (!this._isEqual(config.showHorizontalAxis, preConfig.showHorizontalAxis)) {
        this.horTogglePocket.setState(!!config.showHorizontalAxis);
      }
      if (!this._isEqual(config.showVerticalAxis, preConfig.showVerticalAxis)) {
        this.verTogglePocket.setState(!!config.showVerticalAxis);
      }
      if (!this._isEqual(config.showDataLabel, preConfig.showDataLabel)) {
        this.dataLabelTogglePocket.setState(!!config.showDataLabel);
      }
    },

    _render: function(modle) {
      this._renderByModuleComputed(modle);
      this._renderByModuleConfig(modle);
    },

    _updateModleComputed: function(modle) {
      this._updateModleComputedWithDefinition(modle);
      this._updateModleComputedOnlyByConfig(modle);
    },

    _updateModleComputedWithDefinition: function(modle) {
      if (!modle.computed.definition) {
        return;
      }
      var preDataSource = this.PRE_MODLE.dataSource;
      var dataSource = this.modle.dataSource;
      if (!this._isDSEqual(dataSource, preDataSource)) {
        //fields
        this._updateSelectFieldOptions(modle);
        //modes
        this._updateModesByDefinition(modle);
      }
      //splited field
      this._updateSplitedFieldOptions(modle);
      //sort fields
      this._updateSortFields(modle);
      //showUseLayerSymbology
      modle.computed.showUseLayerSymbology = this._shouldShowUseLayerSymbolDisplay(modle);
      //showDateOption
      modle.computed.showDateOption = this._shouldShowDateOption(modle);
    },

    _getCleanFieldOption: function(fieldOptions) {
      var cleanFieldOptions = [];
      fieldOptions.forEach(function(fo) {
        cleanFieldOptions.push({
          label: fo.label,
          value: fo.value
        });
      });
      return cleanFieldOptions;
    },

    _updateSplitedFieldOptions: function(modle) {
      var computed = modle.computed;
      var config = this.modle.config;
      var categoryField = config.categoryField;
      var valueFields = config.valueFields;
      var categoryFieldOptions = this.categoryFieldSelect.getOptions();
      categoryFieldOptions = this._getCleanFieldOption(categoryFieldOptions);

      if ((!categoryFieldOptions || categoryFieldOptions.length === 0) &&
        (computed.categoryFieldOptions && computed.categoryFieldOptions.length > 0)) {
        categoryFieldOptions = this._getCleanFieldOption(computed.categoryFieldOptions);
      }

      var splitedFieldOptions = categoryFieldOptions.filter(function(cfo) {
        return cfo.value !== categoryField && cfo.value !== valueFields[0];
      });
      splitedFieldOptions.unshift({
        label: '-',
        value: ''
      });
      var values = splitedFieldOptions.map(function(item) {
        return item.value;
      });
      if (values.indexOf(config.splitField) < 0) {
        config.splitField = '';
      }
      computed.splitedField.splitedFieldOptions = splitedFieldOptions;
    },

    _updateSelectFieldOptions: function(modle) {
      var definition = modle.computed.definition;
      var computed = modle.computed;
      var config = this.modle.config;
      var fieldInfos = lang.clone(definition.fields);
      //update have been checked  to uncheck
      //fix a bug of all field auto checked when select ds from featureStatistics
      fieldInfos.forEach(function(item) {
        item.checked = false;
      });
      //categoryFieldOptions
      var categoryFieldTypes = [this._stringFieldType, this._dateFieldType];
      categoryFieldTypes = categoryFieldTypes.concat(lang.clone(this._numberFieldTypes));
      var availableCategoryFieldInfos = array.filter(fieldInfos, lang.hitch(this, function(fieldInfo) {
        return categoryFieldTypes.indexOf(fieldInfo.type) >= 0;
      }));

      computed.categoryFieldOptions = array.map(availableCategoryFieldInfos, lang.hitch(this, function(fieldInfo) {
        return {
          label: fieldInfo.alias || fieldInfo.name,
          value: fieldInfo.name
        };
      }));
      if (definition.groupByFields && definition.groupByFields[0]) {
        computed.categoryFieldOptions = computed.categoryFieldOptions.filter(function(item) {
          return item.value === definition.groupByFields[0];
        });
      }
      //_INIT_ categoryField
      if (!config.categoryField && computed.categoryFieldOptions.length) {
        config.categoryField = computed.categoryFieldOptions[0].value;
      }
      // labelFieldsOptions
      var a = this._stringFieldType;
      var b = this.oidFieldType;
      var c = this._dateFieldType;
      var featureLabelFieldTypes = [a, b, c].concat(lang.clone(this._numberFieldTypes));

      var availableLabelFieldInfos = array.filter(fieldInfos, lang.hitch(this, function(fieldInfo) {
        return featureLabelFieldTypes.indexOf(fieldInfo.type) >= 0;
      }));
      computed.labelFieldsOptions = array.map(availableLabelFieldInfos, lang.hitch(this, function(fieldInfo) {
        return {
          label: fieldInfo.alias || fieldInfo.name,
          value: fieldInfo.name
        };
      }));
      //_INIT_ labelField
      if (!config.labelField && computed.labelFieldsOptions.length) {
        config.labelField = computed.labelFieldsOptions[0].value;
      }
      //valueFields
      computed.valueFields = array.filter(fieldInfos, lang.hitch(this, function(fieldInfo) {
        return this._numberFieldTypes.indexOf(fieldInfo.type) >= 0;
      }));
      if (definition.groupByFields && definition.groupByFields[0]) {
        var categoryFieldNames = computed.categoryFieldOptions.map(function(item) {
          return item.value;
        });
        computed.valueFields = computed.valueFields.filter(function(item) {
          return categoryFieldNames.indexOf(item.name) < 0;
        });
      }
    },

    _updateModleComputedOnlyByConfig: function(modle) {
      var config = modle.config;
      var mode = config.mode;
      var type = config.type;
      //0. series style
      var seriesStyleComputed = this._calcuteSeriesStyleComputed(modle);
      modle.computed.seriesStyleComputed = seriesStyleComputed;

      //Set valueFields as multipleMode or not
      var valueFieldsAsMultipleMode = true;
      if (mode === 'feature' || mode === 'category') {
        if (config && config.type === 'pie') {
          valueFieldsAsMultipleMode = false;
        }
      }
      if (!valueFieldsAsMultipleMode) {
        if (config.valueFields.length > 1) {
          config.valueFields = config.valueFields.slice(0, 1);
        }
      }
      modle.computed.valueFieldsAsMultipleMode = valueFieldsAsMultipleMode;

      //legendDisplay
      var legendDisplay;
      if (type === 'pie') {
        legendDisplay = true;
      } else {
        legendDisplay = true;
        if (mode === 'count' || mode === 'field') {
          legendDisplay = false;
        } else {
          if (config.seriesStyle) {
            legendDisplay = !config.seriesStyle.useLayerSymbology;
          }
        }

      }
      //splited field
      var showSplitedField = false;
      //Hide split function on 5.4
      // if (!igUtils.isBaseAxisChart(type)) {
      //   showSplitedField = false;
      // } else {
      //   if (config.mode === 'category') {
      //     if (config.valueFields.length === 1) {
      //       showSplitedField = true;
      //     }
      //   } else if (config.mode === 'count') {
      //     showSplitedField = true;
      //   }
      // }

      // if (!showSplitedField) {
      //   modle.config.splitField = '';
      // }
      modle.computed.splitedField.show = showSplitedField;
      modle.computed.legendDisplay = legendDisplay;
    },

    _getInitConfigByTemplateConfig: function() {

      var templateConfig = {};
      //type
      var type = this.ORIGIN_VALUE.get('type');
      if (type) {
        templateConfig.type = type;
      }
      //innerRadius
      var innerRadius = this.ORIGIN_VALUE.get('innerRadius');
      if (typeof innerRadius !== 'undefined') {
        templateConfig.innerRadius = innerRadius;
      }
      //area
      var area = this.ORIGIN_VALUE.get('area');
      if (typeof area !== 'undefined') {
        templateConfig.area = area;
      }
      //stack
      var stack = this.ORIGIN_VALUE.get('stack');
      if (typeof stack !== 'undefined') {
        templateConfig.stack = stack;
      }

      if (typeof templateConfig.mode === 'undefined') {
        templateConfig.mode = 'feature';
      }

      if (typeof templateConfig.labelField === 'undefined') {
        templateConfig.labelField = '';
      }

      if (typeof templateConfig.categoryField === 'undefined') {
        templateConfig.categoryField = '';
      }

      if (typeof templateConfig.valueFields === 'undefined') {
        templateConfig.valueFields = [];
      }

      if (typeof templateConfig.splitField === 'undefined') {
        templateConfig.splitField = '';
      }

      if (typeof templateConfig.dateConfig === 'undefined') {
        templateConfig.dateConfig = null;
      }

      if (typeof templateConfig.operation === 'undefined') {
        templateConfig.operation = ''; //sum, average, min, max
      }

      if (typeof templateConfig.nullValue === 'undefined') {
        templateConfig.nullValue = true;
      }

      if (typeof templateConfig.useLayerSymbology === 'undefined') {
        templateConfig.useLayerSymbology = false;
      }

      if (!templateConfig.sortOrder) {
        templateConfig.sortOrder = this._getInitSortOrderConfig(templateConfig);
      }

      return this._updateConfigForTemplateConfig(templateConfig);
    },

    _updateConfigForTemplateConfig: function(templateConfig) {
      var colors = this._getDefaultColorByDiffTheme();
      var textColor = colors.textColor;
      var bgColor = colors.bgColor;

      if (!templateConfig.backgroundColor) {
        templateConfig.backgroundColor = bgColor;
      }

      if (typeof templateConfig.showLegend === 'undefined') {
        templateConfig.showLegend = false;
      }

      if (!templateConfig.legendTextColor) {
        templateConfig.legendTextColor = textColor;
      }

      if (!templateConfig.legendTextSize) {
        templateConfig.legendTextSize = 12;
      }
      if (typeof templateConfig.showDataLabel === 'undefined') {
        templateConfig.showDataLabel = false;
      }

      if (!templateConfig.dataLabelColor) {
        templateConfig.dataLabelColor = textColor;
      }

      if (!templateConfig.dataLabelSize) {
        templateConfig.dataLabelSize = 12;
      }

      if (typeof templateConfig.showHorizontalAxis === 'undefined') {
        templateConfig.showHorizontalAxis = true;
      }

      if (!templateConfig.horizontalAxisTextColor) {
        templateConfig.horizontalAxisTextColor = textColor;
      }

      if (!templateConfig.horizontalAxisTextSize) {
        templateConfig.horizontalAxisTextSize = 12;
      }

      if (typeof templateConfig.showVerticalAxis === 'undefined') {
        templateConfig.showVerticalAxis = true;
      }

      if (!templateConfig.verticalAxisTextColor) {
        templateConfig.verticalAxisTextColor = textColor;
      }

      if (!templateConfig.verticalAxisTextSize) {
        templateConfig.verticalAxisTextSize = 12;
      }

      if (typeof templateConfig.seriesStyle === 'undefined') {
        templateConfig.seriesStyle = {
          styles: []
        };
      }
      return lang.clone(templateConfig);
    },

    _updateSortFields: function(modle) {

      var config = modle.config;
      var mode = config.mode;

      var fieldOption = this._getSortFields(modle);
      var sortComputed = {};
      sortComputed.mode = mode;
      sortComputed.fieldOption = fieldOption;
      modle.computed.sortComputed = sortComputed;
      return fieldOption;
    },

    _getSortFields: function(modle) {
      if (!modle) {
        return;
      }
      var definition = modle.computed.definition;
      var config = modle.config;
      var mode = config.mode;
      if (!definition || !config) {
        return;
      }
      if (mode !== 'feature' && (!config.valueFields || !config.valueFields[0])) {
        return;
      }
      var fields = [];
      if (mode === 'feature') {
        fields = lang.clone(definition.fields);
      } else if (config.valueFields) {
        fields = this._getFieldInfosByFieldName(config.valueFields, modle.computed.definition);
      }
      var fieldOption = fields.map(function(field) {
        return {
          value: field.name,
          label: field.alias || field.name
        };
      });
      return fieldOption;
    },

    _getFieldInfosByFieldName: function(fieldNames, definition) {
      return fieldNames.map(function(fieldName) {
        var field = this._getFieldInfo(fieldName, definition);
        return lang.clone(field);
      }.bind(this));
    },

    _getFieldAlias: function(fieldName, definition) {
      var field = this._getFieldInfo(fieldName, definition);
      return field.alias || field.name;
    },

    _updateModesByDefinition: function(modle) {
      var handleModesForFeatureStatistics = false;
      var modes = ["feature", "category", "count", "field"];
      var definition = modle.computed.definition;
      var dataSource = modle.dataSource;
      if (dataSource.frameWorkDsId) {
        var frameWorkDsId = dataSource.frameWorkDsId;
        var dataSources = this.appConfig.dataSource && this.appConfig.dataSource.dataSources;
        var dsMeta = dataSources[frameWorkDsId];
        if (dsMeta.type === 'FeatureStatistics') {
          handleModesForFeatureStatistics = true;
          var dataSchema = lang.clone(dsMeta.dataSchema);
          var groupByFields = dataSchema.groupByFields || [];
          if (groupByFields.length > 0) {
            //available modes: category, count
            if (this._hasNumberFields(definition)) {
              modes = ["category", "count"];
            } else {
              modes = ["count"];
            }
          } else {
            modes = ["field"];
          }
        }
      }
      if (!handleModesForFeatureStatistics && !this._hasNumberFields(definition)) {
        modes = ['count'];
      }
      modle.computed.modes = modes;
      //For statistics ds or no number field definition
      var mode = modle.config.mode;
      if (modes.indexOf(mode) === -1) {
        modle.config.mode = modes[0];
        this._updateUIByMode();
      }
    },

    _hasNumberFields: function(definition) {
      var result = false;
      var fieldInfos = definition.fields;
      if (fieldInfos && fieldInfos.length > 0) {
        result = array.some(fieldInfos, lang.hitch(this, function(fieldInfo) {
          return this._numberFieldTypes.indexOf(fieldInfo.type) >= 0;
        }));
      }
      return result;
    },

    _isDateField: function(fieldName, definition) {
      var fieldInfo = this._getFieldInfo(fieldName, definition);
      if (fieldInfo) {
        return fieldInfo.type === 'esriFieldTypeDate';
      }
      return false;
    },

    _getFieldInfo: function(field, definition) {
      var fieldInfo = null;
      var fieldInfos = definition.fields;
      for (var i = 0; i < fieldInfos.length; i++) {
        if (fieldInfos[i].name === field) {
          fieldInfo = fieldInfos[i];
        }
      }
      return fieldInfo;
    },

    _shouldShowDateOption: function(modle) {
      var definition = modle.computed.definition;
      var categoryField = modle.config.categoryField;
      var isDateField = this._isDateField(categoryField, definition);
      var chartMode = modle.config.mode;
      return (chartMode === 'category' || chartMode === 'count') && isDateField;
    },

    _getLayerDefinitionByDataSource: function(modle) {
      var dataSource = modle.dataSource;
      var deferred = new Deferred();
      if (dataSource.layerId) {
        var layerInfo = this.layerInfosObj.getLayerInfoById(dataSource.layerId);
        if (layerInfo) {
          this._getServiceDefinitionByLayerInfo(layerInfo).then(function(definition) {
            this._addAliasForLayerDefinition(definition);
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

    _shouldShowUseLayerSymbolDisplay: function(modle) {
      var definition = modle.computed.definition;
      var show = false;
      var type = modle.config.type;
      var mode = modle.config.mode;
      if (type === 'line' || mode === 'field') {
        return show;
      }
      var layerId;
      var featureLayer = null;
      var dataSource = null;
      //get layerId
      if (modle.dataSource) {
        dataSource = modle.dataSource;
        if (dataSource.layerId) {
          layerId = dataSource.layerId;
        } else if (dataSource.frameWorkDsId) {
          var frameWorkDsId = dataSource.frameWorkDsId;
          var dsTypeInfo = this.dataSourceManager.parseDataSourceId(frameWorkDsId);
          if (dsTypeInfo && dsTypeInfo.layerId !== 'undefined') {
            layerId = dsTypeInfo.layerId;
          }
        }
      }
      //feature layer
      if (layerId) {
        featureLayer = this._getFeatureLayer(layerId);
      }

      if (!layerId) {
        return show;
      }

      if (mode === 'feature') {
        show = true;
      } else if (mode === 'category' || mode === 'count') {
        var categoryField = modle.config.categoryField;
        if (!featureLayer) {
          return show;
        }
        if (featureLayer.renderer) {
          var renderer = featureLayer.renderer;
          if (renderer.declaredClass === 'esri.renderer.ClassBreaksRenderer' ||
            renderer.declaredClass === 'esri.renderer.UniqueValueRenderer') {
            if (renderer.attributeField === categoryField && !this._isDateField(categoryField, definition)) {
              show = true;
            }
          }
        }
      }
      return show;
    },

    _getFeatureLayer: function(layerId) {
      var featureLayer = null;
      if (this.map && typeof layerId !== 'undefined') {
        featureLayer = this.map.getLayer(layerId);
      }
      return featureLayer;
    },

    _showDataOption: function(type) {
      if (type !== 'pie') {
        this._showPeriodsRecordsDiv();
      }
      this._showPeridoDiv();
    },

    _hideDataOption: function() {
      this._hidePeridoDiv();
      this._hidePeriodsRecordsDiv();
    },

    _showPeridoDiv: function() {
      html.setStyle(this.periodDiv, 'display', '');
    },

    _hidePeridoDiv: function() {
      html.setStyle(this.periodDiv, 'display', 'none');
    },

    _showPeriodsRecordsDiv: function() {
      html.setStyle(this.periodsRecordsDiv, 'display', '');
    },

    _hidePeriodsRecordsDiv: function() {
      html.setStyle(this.periodsRecordsDiv, 'display', 'none');
    },

    _hideLegend: function() {
      if (this.legendTogglePocket) {
        this.legendTogglePocket.hide();
      }
    },

    _showLegend: function() {
      if (this.legendTogglePocket) {
        this.legendTogglePocket.show();
      }
    },

    _initChartMode: function(modes) {
      //remove all mode
      this.chartModeSelect.removeOption(this.chartModeSelect.getOptions());
      modes.forEach(function(mode) {
        if (mode === 'feature') {
          this.chartModeSelect.addOption({
            value: 'feature',
            label: this.nls.featureOption
          });
        } else if (mode === 'category') {
          this.chartModeSelect.addOption({
            value: 'category',
            label: this.nls.categoryOption
          });
        } else if (mode === 'count') {
          this.chartModeSelect.addOption({
            value: 'count',
            label: this.nls.countOption
          });
        } else if (mode === 'field') {
          this.chartModeSelect.addOption({
            value: 'field',
            label: this.nls.fieldOption
          });
        }
      }.bind(this));
    },

    _initDom: function() {
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

      //series style
      this.seriesStyleDijit = new SeriesStyle({
        nls: this.nls,
        modle: this._getSeriesStyleInitModle(this.modle) //
      });
      this.seriesStyleDijit.placeAt(this.chartColorContainer);
      this.seriesStyleDijit.startup();
      this.own(on(this.seriesStyleDijit, 'change', lang.hitch(this, this._onSeriesStyleDijitChanged)));
      //chart mode
      this._initChartMode(["feature", "category", "count", "field"]);
      //hollow size
      this.hollowSizeControl = new VisibleSliderBar({
        min: 0,
        max: 60,
        step: 1,
        value: this.config.innerRadius || 0
      });
      this.own(on(this.hollowSizeControl, 'change', lang.hitch(this, this._onHollowSizeControlChanged)));
      this.hollowSizeControl.placeAt(this.hollowSize);

      //legend text size
      this.legendTextSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: this.config.legendTextSize || 12
      });
      this.own(on(this.legendTextSizeControl, 'change', lang.hitch(this, this._onLegendTextSizeChanged)));
      this.legendTextSizeControl.placeAt(this.legendTextSize);

      //Vertical axis text size
      this.verticalAxisTextSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: this.config.verticalAxisTextSize || 12
      });
      this.own(on(this.verticalAxisTextSizeControl, 'change', lang.hitch(this, this._onVerticalAxisTextSizeChanged)));
      this.verticalAxisTextSizeControl.placeAt(this.verTextSize);

      //Horizontal axis text size
      this.horizontalAxisTextSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: this.config.horizontalAxisTextSize || 12
      });
      this.own(on(this.horizontalAxisTextSizeControl, 'change',
        lang.hitch(this, this._onHorizontalAxisTextSizeChanged)));

      this.horizontalAxisTextSizeControl.placeAt(this.horTextSize);

      //data Label text size
      this.dataLabelSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: this.config.dataLabelSize || 12
      });
      this.own(on(this.dataLabelSizeControl, 'change', lang.hitch(this, this._onDataLabelSizeChanged)));
      this.dataLabelSizeControl.placeAt(this.dataLabelTextSize);

      //legend for column, bar, line and pie
      this.legendTogglePocket = new TogglePocket({
        titleLabel: this.nls.legend,
        content: this.legendTogglePocketContent,
        className: 'section-item column-type bar-type line-type pie-type'
      });
      this.own(on(this.legendTogglePocket, 'change', lang.hitch(this, this._onLegendTogglePocketChanged)));
      this.legendTogglePocket.placeAt(this.displaySection);

      //horizontal axis for column, bar and line
      this.horTogglePocket = new TogglePocket({
        titleLabel: this.nls.horizontalAxis,
        content: this.horTogglePocketContent,
        className: 'section-item column-type bar-type line-type'
      });
      this.own(on(this.horTogglePocket, 'change', lang.hitch(this, this._onHorTogglePocketChanged)));
      this.horTogglePocket.placeAt(this.displaySection);

      //vertical axis for column, bar and line
      this.verTogglePocket = new TogglePocket({
        titleLabel: this.nls.verticalAxis,
        content: this.verTogglePocketContent,
        className: 'section-item column-type bar-type line-type'
      });
      this.own(on(this.verTogglePocket, 'change', lang.hitch(this, this._onVerTogglePocketChanged)));
      this.verTogglePocket.placeAt(this.displaySection);

      //data labels for pie
      this.dataLabelTogglePocket = new TogglePocket({
        titleLabel: this.nls.dataLabels,
        content: this.dataLabelTogglePocketContent,
        className: 'section-item pie-type'
      });
      this.own(on(this.dataLabelTogglePocket, 'change', lang.hitch(this, this._onDataLabelsTogglePocketChanged)));
      this.dataLabelTogglePocket.placeAt(this.displaySection);

      // init chart sort
      this.chartSortDijit = new ChartSort({
        nls: this.nls
      });
      this.own(on(this.chartSortDijit, 'change', lang.hitch(this, this._onChartSortDijitChanged)));
      this.chartSortDijit.placeAt(this.chartSort);

      this.tabContainer.placeAt(this.domNode);
      //max categories
      this.maxLabels = new NumberSpinner({
        intermediateChanges: true
      });
      if (this.modle.config.type === 'pie') {
        this.maxLabels.constraints = {
          min: 1,
          max: 100
        };
        this.maxLabels.set('value', 100);
        this.maxLabels.required = true;
      } else {
        this.maxLabels.constraints = {
          min: 1,
          max: 3000
        };
        this.maxLabels.required = false;
      }
      this.own(on(this.maxLabels, 'change', function() {
        this._onMaxLabelsChanged();
      }.bind(this)));
      this.maxLabels.placeAt(this.maxLabelsDiv);
      this._reset();
    },

    _addAliasForLayerDefinition: function(definition) {
      if (definition && definition.fields && definition.fields.length > 0) {
        array.forEach(definition.fields, lang.hitch(this, function(fieldInfo) {
          if (fieldInfo.name && !fieldInfo.alias) {
            fieldInfo.alias = fieldInfo.name;
          }
        }));
      }
    },

    _updateElementDisplayByChartMode: function(modle) {
      var mode = modle.config.mode;
      var className = mode + '-mode';
      var dataSectionItems = query('.section-item', this.dataSection);

      array.forEach(dataSectionItems, lang.hitch(this, function(sectionItem) {
        if (html.hasClass(sectionItem, className)) {
          this._showSectionItem(sectionItem);
        } else {
          this._hideSectionItem(sectionItem);
        }
      }));
    },

    _updateElementDisplayByChartType: function(type) {
      //update visibility
      var chartTypeClassName = type + "-type";
      var displayItems = query('.section-item', this.displaySection);

      array.forEach(displayItems, lang.hitch(this, function(sectionItem) {
        if (html.hasClass(sectionItem, chartTypeClassName)) {
          this._showSectionItem(sectionItem);
        } else {
          this._hideSectionItem(sectionItem);
        }
      }));
    },

    _showSectionItem: function(itemDom) {
      html.removeClass(itemDom, 'hide');
    },

    _hideSectionItem: function(itemDom) {
      html.addClass(itemDom, 'hide');
    },

    _showSplitedContainer: function() {
      html.removeClass(this.splitFieldContainer, 'hide');
    },

    _hideSplitedContainer: function() {
      html.addClass(this.splitFieldContainer, 'hide');
    },

    _showChartNoData: function() {
      setTimeout(function() {
        this.dijit.showNoData();
      }.bind(this), 200);
    },

    _isEqual: function(v1, v2) {
      if (typeof v1 !== typeof v2) {
        return false;
      }
      if (typeof v1 !== 'object') {
        return v1 === v2;
      } else {
        return jimuUtils.isEqual(v1, v2);
      }
    },

    _isDSEqual: function(DS1, DS2) {
      if (!DS1 || !DS2) {
        return;
      }
      var formatedDS1 = this._cloneAndFormatDS(DS1);
      var formatedDS2 = this._cloneAndFormatDS(DS2);
      return this._isEqual(formatedDS1, formatedDS2);
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
      return formatDS;
    },

    _updateOptions: function(select, options, value) {
      if (options) {
        select.removeOption(select.getOptions());
        select.addOption(options);
      } else {
        options = [];
      }
      if (!value && options.length > 0) {
        value = options[0].value;
      }
      if (value) {
        select.set('value', value);
      }
    },

    /**************** change ****************/
    /* Data section*/
    _onChartModeChanged: function(mode) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.mode = mode;
      this.render(this.modle);
    },

    _onLabelFieldChanged: function(labelField) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.labelField = labelField;
      this.render(this.modle);
    },

    _onCategoryFieldChanged: function(categoryField) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.categoryField = categoryField;
      this.render(this.modle);
    },

    _onMinPeriodChanged: function(minPeriod) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.dateConfig.minPeriod = minPeriod;
      this.render(this.modle);
    },

    _onPeriodsWithOutRecords: function(show) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.dateConfig.isNeedFilled = show;
      this.render(this.modle);
    },

    _onOperationSelectChanged: function(operation) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.operation = operation;
      this.render(this.modle);
    },

    _onNullValueAsZeroChange: function(nullValue) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.nullValue = nullValue;
      this.render(this.modle);
    },

    _onValueFieldsChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      var valueFields = this.valueFields.getSelectedFieldNames();
      this.modle.config.valueFields = valueFields;
      this.render(this.modle);
    },

    _onSplitFieldsChanged: function(splitField) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.splitField = splitField;
      this.render(this.modle);
    },

    _onChartSortDijitChanged: function(sortOrder) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.sortOrder = sortOrder;
      this.render(this.modle);
    },

    _onMaxLabelsChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      var maxLabels = this.maxLabels.get('value');
      this.modle.config.maxLabels = maxLabels;
      this.render(this.modle);
    },

    /* Display section*/
    //background color
    _onBgColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.backgroundColor = this.bgColor.getSingleColor();
      this.render(this.modle);
    },

    //legend
    _onLegendTogglePocketChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.showLegend = this.legendTogglePocket.getState();
      this.render(this.modle);
    },

    _onLegendTextColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.legendTextColor = this.legendTextColor.getSingleColor();
      this.render(this.modle);
    },

    //horizontal axis
    _onHorTogglePocketChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.showHorizontalAxis = this.horTogglePocket.getState();
      this.render(this.modle);
    },

    _onHorColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.horizontalAxisTextColor = this.horTextColor.getSingleColor();
      this.render(this.modle);
    },

    //vertical axis
    _onVerTogglePocketChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.showVerticalAxis = this.verTogglePocket.getState();
      this.render(this.modle);
    },

    _onVerColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.verticalAxisTextColor = this.verTextColor.getSingleColor();
      this.render(this.modle);
    },

    //data labels
    _onDataLabelsTogglePocketChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.showDataLabel = this.dataLabelTogglePocket.getState();
      this.render(this.modle);
    },

    _onDataLabelColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.dataLabelColor = this.dataLabelTextColor.getSingleColor();
      this.render(this.modle);
    },

    _onHollowSizeControlChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.innerRadius = value;
      this.render(this.modle);
    },

    _onLegendTextSizeChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.legendTextSize = value;
      this.render(this.modle);
    },

    _onVerticalAxisTextSizeChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.verticalAxisTextSize = value;
      this.render(this.modle);
    },

    _onHorizontalAxisTextSizeChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.horizontalAxisTextSize = value;
      this.render(this.modle);
    },

    _onDataLabelSizeChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.dataLabelSize = value;
      this.render(this.modle);
    },

    _onSeriesStyleDijitChanged: function(seriesStyle) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.PRE_MODLE = lang.clone(this.modle);
      this.modle.config.seriesStyle = seriesStyle;
      this.render(this.modle);
    }

  });

  return clazz;
});