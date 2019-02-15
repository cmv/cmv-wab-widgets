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
  'dojo/on',
  'dojo/query',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/_base/declare',
  'dojo/Evented',
  './BaseDijitSetting',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./ChartDijitSetting.html',
  'jimu/dijit/TabContainer3',
  './_dijits/ChartDijitSettingUtils',
  './_dijits/ChartSort',
  './_dijits/TogglePocket',
  './_dijits/VisibleSliderBar',
  './_dijits/SeriesStyle/SeriesStyle',
  './_dijits/Mark/Marks',
  '../utils',
  './_dijits/ChartColorSetting',
  './_dijits/DataFields',
  'dijit/form/Select',
  'dijit/form/NumberSpinner',
  './_dijits/Toggle'
], function(on, query, lang, html, array, declare, Evented, BaseDijitSetting, _WidgetsInTemplateMixin,
  templateString, TabContainer3, ChartDijitSettingUtils, ChartSort, TogglePocket,
  VisibleSliderBar, SeriesStyle, Marks, utils) {
  var clazz = declare([BaseDijitSetting, _WidgetsInTemplateMixin, Evented], {
    templateString: templateString,
    type: 'chart',
    baseClass: 'infographic-chart-dijit-setting',
    colors: ['#68D2E0', '#087E92', '#47BCF5', '#FBE66A', '#F29157', '#C8501D', '#2DB7C6', '#C4EEF6'],
    ignoreChangeEvents: false,
    //dataSourceType: '', //CLIENT_FEATURES, FRAMEWORK_FEATURES, FRAMEWORK_STATISTICS
    tabContainer: null,

    postMixInProperties: function() {
      lang.mixin(this.nls, window.jimuNls.statisticsChart);
    },

    /* Init default option */
    constructor: function(option) {
      this.inherited(arguments);

      if (option.nls) {
        this.nls = option.nls;
      }

      this.appConfig = option.appConfig;

      //Init chart dijit setting utils
      this.cdsUtils = new ChartDijitSettingUtils({
        map: option.map,
        appConfig: this.appConfig,
        colors: this.colors,
        nls: this.nls
      });

      this.config = option.config;

      var colors = this.cdsUtils.getDefaultColorOfTheme();
      this._defaultTextColor = colors.textColor;
      this._defaultbgColor = colors.bgColor;
    },

    postCreate: function() {
      this.inherited(arguments);
      //Ignore all change event when init dom
      this.ignoreChangeEvents = true;
      this._initDom();
    },

    setLayerDefinition: function(definition) {
      if (definition) {
        definition = utils.preProcessDefinition(definition);
        this.definition = definition;
        if (this.cdsUtils) {
          this.cdsUtils.setLayerDefinition(definition);
        }
      }
    },

    setLayerObject: function(layerObject) {
      if (layerObject) {
        this.layerObject = layerObject;
        if (this.cdsUtils) {
          this.cdsUtils.setLayerObject(layerObject);
        }
      }
    },

    setConfig: function(config) {
      if (config) {
        this.config = config;
      }
    },

    clearMarks: function() {
      if (this.marks) {
        this.marks.setConfig({});
      }
    },

    //features for calculate custom color
    setFeatures: function(features) {
      if (this.cdsUtils && features) {
        this.cdsUtils.setFeatures(features);
      }
    },

    _initChartKeyProperty: function() {
      if (!this.config) {
        return;
      }

      this.keyProperties = {
        type: this.config.type,
        stack: this.config.stack,
        area: this.config.area,
        innerRadius: this.config.innerRadius
      };
    },

    /* `Program entry`, start rendering when there is a data source */
    setDataSource: function(dataSource) {
      this.inherited(arguments);
      if (!this.definition || !this.config) {
        return;
      }

      if (this.cdsUtils) {
        this.cdsUtils.setDataSource(dataSource);
      }

      this.dataSource = dataSource;
      this._initChartKeyProperty();
      this._initializationByDataSource();

      this._renderFirst();
    },

    _renderFirst: function() {
      var mode = this.config.mode;
      if (!mode) {
        mode = this._modes && this._modes[0];
      }

      if (!mode) {
        console.error('No effective mdoe.');
        return;
      }

      utils.updateOptions(this.chartModeSelect, null, mode, true);

      this._initConfigFirst(mode);
      this._initModle();
      this.emit('chartSettingChanged', this.modle.config);
      this._updateElementDisplayByChartMode(mode);

      //put the selected field to the top for value fields list
      this._moveValueFieldToFirst = true;
      this.render(this.modle, true);
      this._moveValueFieldToFirst = false;
    },

    _onChartModeChanged: function(mode) {
      this._updateSelectTitleByValue(this.chartModeSelect, mode);
      if (this.ignoreChangeEvents) {
        return;
      }
      this._chartModeTrigger(mode);
      this.render(this.modle);
      if (this.marks) {
        this.marks.setConfig({});
      }
      this.emit('chartSettingChanged', this.modle.config);
    },

    _updateSelectTitleByValue: function(select, value) {
      var option = select.getOptions(value);
      if (option && typeof option.label !== 'undefined') {
        select.set('title', option.label);
      }
    },

    _chartModeTrigger: function(mode) {
      this._updateElementDisplayByChartMode(mode);
      this._initConfig(mode);
      this._initModle();
    },

    _initConfigFirst: function(mode) {
      if (!this.config || !this.config.mode) {
        this._initConfig(mode);
      }
    },

    _initConfig: function(mode) {
      var field = this._getDefaultFieldName();
      this.config = this.cdsUtils.getInitConfig(mode, this.keyProperties, field);
    },

    render: function(modle, isFirst) {
      this.ignoreChangeEvents = true;

      //Update the computing properties of Modle
      this.cdsUtils.updateModleComputed(modle);
      //Dynamically update the config of Modle
      this.cdsUtils.dynamicUpdateConfig(modle, isFirst);
      this._render(modle);
      setTimeout(lang.hitch(this, function() {
        this.ignoreChangeEvents = false;
        if (!this.domNode) {
          return;
        }
        this.onChange();
      }.bind(this)), 200);
    },

    isValid: function() {
      if (!this.definition) {
        return false;
      }
      return this.maxLabels.isValid() && this.hollowSizeControl.isValid() &&
        this.legendTextSizeControl.isValid() && this.verticalAxisTextSizeControl.isValid() &&
        this.horizontalAxisTextSizeControl.isValid() && this.dataLabelSizeControl.isValid();
    },

    getConfig: function(check) {

      if (!this.isValid(check)) {
        return false;
      }

      var modleConfig = this.modle.config;
      if (this.marks) {
        var marks = this.marks.getConfig();
        if (marks === false) {
          return false;
        }
        modleConfig.marks = marks;
      }

      var cleanConfig = utils.getCleanChartConfig(modleConfig);
      if (!cleanConfig) {
        this.dijit.clearChart();
        return;
      }
      return cleanConfig;
    },

    onChange: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      var config = this.getConfig();
      if (config) {
        this.dijit.setConfig(config);
        this.dijit.startRendering();
      }
    },

    _render: function(modle) {
      this._renderByModleComputed(modle);
      this._renderByModleConfig(modle);
    },

    _renderByModleComputed: function(modle) {
      var computed = modle.computed;
      var preComputed = this.PRE_MODLE.computed;
      if (utils.isEqual(computed, preComputed)) {
        return;
      }
      if (!computed) {
        return;
      }

      //showDateOption
      if (!utils.isEqual(computed.showDateOption, preComputed.showDateOption)) {
        if (computed.showDateOption) {
          this._showDataOption(this.modle.config.type);
        } else {
          this._hideDataOption();
          modle.config.dateConfig = null;
        }
      }

      //sort fields
      if (!utils.isEqual(computed.sortComputed, preComputed.sortComputed)) {
        if (computed.sortComputed) {
          this.chartSortDijit.updateComputeds(computed.sortComputed);
        }
      }

      //valueFieldsAsMultipleMode
      if (!utils.isEqual(computed.valueFieldsAsMultipleMode, preComputed.valueFieldsAsMultipleMode)) {
        if (computed.valueFieldsAsMultipleMode) {
          this.valueFields.setMultipleMode();
        } else {
          this.valueFields.setSingleMode();
        }
      }
      //series style option seriesStyleComputed
      if (!utils.isEqual(computed.seriesStyleComputed, preComputed.seriesStyleComputed)) {
        this.seriesStyleDijit.updateComputed(computed.seriesStyleComputed);
      }

      //legend display
      if (!utils.isEqual(computed.legendDisplay, preComputed.legendDisplay)) {
        if (computed.legendDisplay) {
          this._showLegend();
        } else {
          this._hideLegend();
        }
      }
    },

    _renderByModleConfig: function(modle) {
      var config = modle.config;
      var preConfig = this.PRE_MODLE.config;
      if (!config) {
        return;
      }
      //2.labelField
      if (!utils.isEqual(config.labelField, preConfig.labelField) && config.labelField) {
        this.labelFieldSelect.set('value', config.labelField);
      }
      //3.categoryField
      if (!utils.isEqual(config.categoryField, preConfig.categoryField) && config.categoryField) {
        this.categoryFieldSelect.set('value', config.categoryField);
      }
      //4.valueFields
      if (!utils.isEqual(config.valueFields, preConfig.valueFields) && config.valueFields) {
        this.valueFields.uncheckAllFields();
        this.valueFields.selectFields(config.valueFields, !this._moveValueFieldToFirst);
      }
      //5.operation
      if (!utils.isEqual(config.operation, preConfig.operation)) {
        this.operationSelect.set('value', config.operation);
      }

      //6.date config
      if (!utils.isEqual(config.dateConfig, preConfig.dateConfig)) {
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
      if (!utils.isEqual(config.sortOrder, preConfig.sortOrder) && config.sortOrder) {
        this.chartSortDijit.setConfig(config.sortOrder);
      }
      //8.max categories(labels)
      if (!utils.isEqual(config.maxLabels, preConfig.maxLabels)) {
        if (typeof config.maxLabels !== 'undefined') {
          this.maxLabels.set('value', config.maxLabels);
        } else {
          this.maxLabels.set('value', '');
        }
      }

      //9.null value
      if (!utils.isEqual(config.nullValue, preConfig.nullValue)) {
        if (typeof config.nullValue !== 'undefined') {
          this.zeroRadioBtn.setChecked(config.nullValue);
          this.ignoreRadioBtn.setChecked(!config.nullValue);
        } else {
          this.zeroRadioBtn.setChecked(true);
          this.ignoreRadioBtn.setChecked(false);
        }
      }

      //series style
      if (!utils.isEqual(config.seriesStyle, preConfig.seriesStyle)) {
        this.seriesStyleDijit.setConfig(config.seriesStyle);
      }

      if (!utils.isEqual(config.innerRadius, preConfig.innerRadius)) {
        if (typeof config.innerRadius !== 'undefined') {
          this.hollowSizeControl.setValue(config.innerRadius);
        }
      }
    },

    _initModle: function() {
      this._initPreModle();
      this.modle = null;
      this.modle = this.cdsUtils.getInitializationModle(this.config);
    },

    _initDom: function() {
      var tabs = [{
        title: this.nls.data,
        content: this.dataSection
      }, {
        title: this.nls.display,
        content: this.displaySection
      }];

      if (this.config.type !== 'pie') {
        tabs.push({
          title: this.nls.marks,
          content: this.marksSection
        });
      }

      if (this.config.type === 'bar') {
        this._hideAxisKeepIntScale(true);
      } else {
        this._hideAxisKeepIntScale(false);
      }

      this.tabContainer = new TabContainer3({
        average: true,
        tabs: tabs
      });
      if (this.config.type !== 'pie') {
        this.marks = new Marks({
          chartType: this.config.type,
          nls: this.nls,
          folderUrl: this.folderUrl,
          defaultColor: this._defaultTextColor,
          config: this.config.marks
        });
        this.marks.placeAt(this.marksSection);
        this.own(on(this.marks, 'change', lang.hitch(this, this._onMarksChanged)));
      }

      //background color
      var bgColor = this.config.backgroundColor || this._defaultbgColor;
      this.bgColor.setSingleColor(bgColor);
      //series style
      this.seriesStyleDijit = new SeriesStyle({
        nls: this.nls
      });
      this.seriesStyleDijit.placeAt(this.chartColorContainer);
      this.seriesStyleDijit.startup();
      this.own(on(this.seriesStyleDijit, 'change', lang.hitch(this, this._onSeriesStyleDijitChanged)));
      this.own(on(this.seriesStyleDijit, 'update-colors', lang.hitch(this, function(colors) {
        this.cdsUtils.setCustomColor(colors);
        this._onCustomColorsChanged();
      })));
      //hollow size, inner radius
      this.hollowSizeControl = new VisibleSliderBar({
        min: 0,
        max: 60,
        step: 1,
        value: this.config.innerRadius || 0
      });
      this.own(on(this.hollowSizeControl, 'change', lang.hitch(this, this._onHollowSizeControlChanged)));
      this.hollowSizeControl.placeAt(this.hollowSize);

      //legend
      var legend = this.config.legend;
      var legendColor = legend && legend.textStyle && legend.textStyle.color;
      var legendTextSize = legend && legend.textStyle && legend.textStyle.fontSize;
      var showLegend = legend && legend.show;

      this.legendTogglePocket = new TogglePocket({
        titleLabel: this.nls.legend,
        content: this.legendTogglePocketContent,
        className: 'section-item column-type bar-type line-type pie-type'
      });
      this.legendTogglePocket.setState(!!showLegend);
      this.own(on(this.legendTogglePocket, 'change', lang.hitch(this, this._onLegendTogglePocketChanged)));
      this.legendTogglePocket.placeAt(this.displaySection);

      this.legendTextColor.setSingleColor(legendColor || this._defaultTextColor);

      this.legendTextSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: legendTextSize || 12
      });
      this.own(on(this.legendTextSizeControl, 'change', lang.hitch(this, this._onLegendTextSizeChanged)));
      this.legendTextSizeControl.placeAt(this.legendTextSize);

      //yAxis
      var yAxis = this.config.yAxis;
      var yAxisColor = yAxis && yAxis.textStyle && yAxis.textStyle.color;
      var yFormatType = yAxis && yAxis.format && yAxis.format.type;
      var yAxisTextSize = yAxis && yAxis.textStyle && yAxis.textStyle.fontSize;
      var yAxisTitle = yAxis && yAxis.name;
      var yAxisTitleColor = yAxis && yAxis.nameTextStyle && yAxis.nameTextStyle.color;
      var showyAxis = yAxis && yAxis.show;
      showyAxis = typeof showyAxis === 'undefined' ? true : showyAxis;

      //vertical axis for column, bar and line
      this.verTogglePocket = new TogglePocket({
        titleLabel: this.nls.verticalAxis,
        content: this.verTogglePocketContent,
        className: 'section-item column-type bar-type line-type'
      });
      this.verTogglePocket.setState(!!showyAxis);
      this.own(on(this.verTogglePocket, 'change', lang.hitch(this, this._onVerTogglePocketChanged)));
      this.verTogglePocket.placeAt(this.displaySection);

      this.verTextColor.setSingleColor(yAxisColor || this._defaultTextColor);
      this.verTitleColor.setSingleColor(yAxisTitleColor || this._defaultTextColor);

      if (yAxisTitle || yAxisTitle === 0) {
        this.verTitle.set('value', yAxisTitle);
      }

      this.verticalAxisTextSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: yAxisTextSize || 12
      });
      this.own(on(this.verticalAxisTextSizeControl, 'change', lang.hitch(this, this._onVerticalAxisTextSizeChanged)));
      this.verticalAxisTextSizeControl.placeAt(this.verTextSize);
      //restore axis scale type
      if (yFormatType === 'int') {
        this.vAxisKeepIntScale.setState(true);
      }
      //xAxis
      var xAxis = this.config.xAxis;
      var xAxisColor = xAxis && xAxis.textStyle && xAxis.textStyle.color;
      var xFormatType = xAxis && xAxis.format && xAxis.format.type;
      var xAxisTextSize = xAxis && xAxis.textStyle && xAxis.textStyle.fontSize;
      var xAxisTitle = xAxis && xAxis.name;
      var xAxisTitleColor = xAxis && xAxis.nameTextStyle && xAxis.nameTextStyle.color;
      var showxAxis = xAxis && xAxis.show;
      showxAxis = typeof showxAxis === 'undefined' ? true : showxAxis;
      this.horTogglePocket = new TogglePocket({
        titleLabel: this.nls.horizontalAxis,
        content: this.horTogglePocketContent,
        className: 'section-item column-type bar-type line-type'
      });
      this.horTogglePocket.setState(!!showxAxis);
      this.own(on(this.horTogglePocket, 'change', lang.hitch(this, this._onHorTogglePocketChanged)));
      this.horTogglePocket.placeAt(this.displaySection);

      this.horTextColor.setSingleColor(xAxisColor || this._defaultTextColor);
      this.horTitleColor.setSingleColor(xAxisTitleColor || this._defaultTextColor);

      if (xAxisTitle || xAxisTitle === 0) {
        this.horTitle.set('value', xAxisTitle);
      }

      this.horizontalAxisTextSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: xAxisTextSize || 12
      });
      this.own(on(this.horizontalAxisTextSizeControl, 'change',
        lang.hitch(this, this._onHorizontalAxisTextSizeChanged)));

      this.horizontalAxisTextSizeControl.placeAt(this.horTextSize);
      //restore axis scale type
      if (xFormatType === 'int') {
        this.hAxisKeepIntScale.setState(true);
      }

      //data Label
      var dataLabel = this.config.dataLabel;
      var dataLabelColor = dataLabel && dataLabel.textStyle && dataLabel.textStyle.color;
      var dataLabelTextSize = dataLabel && dataLabel.textStyle && dataLabel.textStyle.fontSize;
      var showDataLabel = dataLabel && dataLabel.show;

      this.dataLabelTogglePocket = new TogglePocket({
        titleLabel: this.nls.dataLabels,
        content: this.dataLabelTogglePocketContent,
        className: 'section-item pie-type'
      });
      this.dataLabelTogglePocket.setState(!!showDataLabel);
      this.own(on(this.dataLabelTogglePocket, 'change', lang.hitch(this, this._onDataLabelsTogglePocketChanged)));
      this.dataLabelTogglePocket.placeAt(this.displaySection);

      this.dataLabelTextColor.setSingleColor(dataLabelColor || this._defaultTextColor);

      this.dataLabelSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: dataLabelTextSize || 12
      });
      this.own(on(this.dataLabelSizeControl, 'change', lang.hitch(this, this._onDataLabelSizeChanged)));
      this.dataLabelSizeControl.placeAt(this.dataLabelTextSize);

      // init chart sort
      this.chartSortDijit = new ChartSort({
        nls: this.nls
      });
      this.own(on(this.chartSortDijit, 'change', lang.hitch(this, this._onChartSortDijitChanged)));
      this.chartSortDijit.placeAt(this.chartSort);

      this.tabContainer.placeAt(this.domNode);
      //max categories
      if (this.config.type === 'pie') {

        this.maxLabels.constraints = {
          min: 1,
          max: 100
        };
        // this.maxLabels.set('value', 100);
        this.maxLabels.required = true;

      } else {
        this.maxLabels.constraints = {
          min: 1,
          max: 3000
        };
        this.maxLabels.required = false;
      }
      this._updateElementDisplayByChartType(this.config.type);
    },

    // -------------- change event ------------
    //-- Data section --
    _onLabelFieldChanged: function(labelField) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.labelField = labelField;
      this.render(this.modle);
    },

    _onCategoryFieldChanged: function(categoryField) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.categoryField = categoryField;
      this.render(this.modle);
      this.emit('chartSettingChanged', this.modle.config);
    },

    _onMinPeriodChanged: function(minPeriod) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.dateConfig.minPeriod = minPeriod;
      this.render(this.modle);
    },

    _onPeriodsWithOutRecords: function(show) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.dateConfig.isNeedFilled = show;
      this.render(this.modle);
    },

    _onOperationSelectChanged: function(operation) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.operation = operation;
      this.render(this.modle);
    },

    _onNullValueAsZeroChange: function(nullValue) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.nullValue = nullValue;
      this.render(this.modle);
    },

    _onValueFieldsChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      var valueFields = this.valueFields.getSelectedFieldNames();
      this.modle.config.valueFields = valueFields;
      this.render(this.modle);
    },

    _onChartSortDijitChanged: function(sortOrder) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.sortOrder = sortOrder;
      this.render(this.modle);
    },

    _onMaxLabelsChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      var maxLabels = this.maxLabels.get('value');
      this.modle.config.maxLabels = maxLabels;
      this.render(this.modle);
    },

    // -- Display section --/
    //background color
    _onBgColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.backgroundColor = this.bgColor.getSingleColor();
      this.render(this.modle);
    },

    //legend
    _onLegendTogglePocketChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.legend.show = this.legendTogglePocket.getState();
      this.render(this.modle);
    },

    _onLegendTextColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.legend.textStyle.color = this.legendTextColor.getSingleColor();
      this.render(this.modle);
    },

    _onLegendTextSizeChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.legend.textStyle.fontSize = value;
      this.render(this.modle);
    },

    //horizontal axis
    _onHorTogglePocketChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.xAxis.show = this.horTogglePocket.getState();
      this.render(this.modle);
    },

    _onHorTitleChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      var title = this.horTitle.get('value');
      if (title === '') {
        title = undefined;
      }
      this.modle.config.xAxis.name = title;
      this.render(this.modle);
    },

    _onHorTitleColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.xAxis.nameTextStyle.color = this.horTitleColor.getSingleColor();
      this.render(this.modle);
    },

    _onHorColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.xAxis.textStyle.color = this.horTextColor.getSingleColor();
      this.render(this.modle);
    },

    _onHorizontalAxisTextSizeChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.xAxis.textStyle.fontSize = value;
      this.render(this.modle);
    },

    onHAxisKeepIntScaleChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      var type = value ? 'int' : 'float';
      this.modle.config.xAxis.format = {
        type: type
      };
      this.render(this.modle);
    },

    //vertical axis
    _onVerTogglePocketChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.yAxis.show = this.verTogglePocket.getState();
      this.render(this.modle);
    },

    _onVerTitleChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      var title = this.verTitle.get('value');
      if (title === '') {
        title = undefined;
      }
      this.modle.config.yAxis.name = title;
      this.render(this.modle);
    },

    _onVerTitleColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.yAxis.nameTextStyle.color = this.verTitleColor.getSingleColor();
      this.render(this.modle);
    },

    _onVerColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.yAxis.textStyle.color = this.verTextColor.getSingleColor();
      this.render(this.modle);
    },

    _onVerticalAxisTextSizeChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.yAxis.textStyle.fontSize = value;
      this.render(this.modle);
    },

    onVAxisKeepIntScaleChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      var type = value ? 'int' : 'float';
      this.modle.config.yAxis.format = {
        type: type
      };
      this.render(this.modle);
    },

    //data labels
    _onDataLabelsTogglePocketChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.dataLabel.show = this.dataLabelTogglePocket.getState();
      this.render(this.modle);
    },

    _onDataLabelColorChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.dataLabel.textStyle.color = this.dataLabelTextColor.getSingleColor();
      this.render(this.modle);
    },

    _onDataLabelSizeChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.dataLabel.textStyle.fontSize = value;
      this.render(this.modle);
    },

    //inner radius
    _onHollowSizeControlChanged: function(value) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.innerRadius = value;
      this.render(this.modle);
    },

    _onSeriesStyleDijitChanged: function(seriesStyle) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.seriesStyle = seriesStyle;
      this.render(this.modle);
    },

    _onCustomColorsChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      var seriesStyle = this.modle.config.seriesStyle;
      if (seriesStyle && seriesStyle.customColor) {
        var customColor = seriesStyle.customColor;
        var categories = customColor.categories;
        if (categories && categories.length) {
          categories.forEach(function(cc) {
            if (cc) {
              cc.color = this.cdsUtils.getRandomCustomColor();
            }
          }.bind(this));
          this.render(this.modle);
        }
      }
    },

    _onMarksChanged: function(config) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onChangeAfterHook();
      this.modle.config.marks = config;
      this.render(this.modle);
    },

    //---------- Tool methods -----------
    _initPreModle: function() {
      this.PRE_MODLE = null;
      this.PRE_MODLE = {
        computed: {},
        config: {}
      };
      this.cdsUtils.setPreModle(this.PRE_MODLE);
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

    _hideAxisKeepIntScale: function(isVertical) {
      if (isVertical) {
        html.addClass(this.vAxisKeepIntScaleRow, 'hide');
      } else {
        html.addClass(this.hAxisKeepIntScaleRow, 'hide');
      }
    },

    _initChartModeSelect: function() {
      var modes = this._modes;
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

    _updateElementDisplayByChartMode: function(mode) {
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

    _showChartNoData: function(tempConfig) {
      setTimeout(function() {
        if (tempConfig) {
          this.dijit.setConfig(tempConfig);
        }
        this.dijit.clearChart();
      }.bind(this), 200);
    },

    _onChangeAfterHook: function() {
      this.PRE_MODLE = lang.clone(this.modle);
      this.cdsUtils.setPreModle(this.PRE_MODLE);
    },

    _initializationByDataSource: function() {
      this._initChartModes(this.dataSource);
      this._initFieldOptions();
    },

    _initChartModes: function(dataSource) {
      var definition = this.definition;
      if (!definition) {
        return;
      }
      var handleModesForFeatureStatistics = false;
      var modes = ["feature", "category", "count", "field"];
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
            if (this.cdsUtils.hasNumberFields(definition)) {
              modes = ["category", "count"];
            } else {
              modes = ["count"];
            }
          } else {
            modes = ["field"];
          }
        }
      }
      if (!handleModesForFeatureStatistics && !this.cdsUtils.hasNumberFields(definition)) {
        modes = ['count'];
      }
      this._modes = modes;
      this._initChartModeSelect();
    },

    _initFieldOptions: function() {
      var definition = this.definition;
      if (!definition) {
        return;
      }
      var fieldInfos = lang.clone(definition.fields);
      if (!fieldInfos || !fieldInfos.length) {
        return;
      }
      //update have been checked  to uncheck
      //fix a bug of all field auto checked when select ds from featureStatistics
      fieldInfos.forEach(function(item) {
        item.checked = false;
      });
      var groupByField = definition.groupByFields && definition.groupByFields[0];
      //clusterFieldOptions
      this._clusterFieldOptions = this.cdsUtils.getClusterFieldOptions(fieldInfos, groupByField);
      //valueFields
      this._valueFieldOptions = this.cdsUtils.getValueFieldOptions(fieldInfos, groupByField,
        this._clusterFieldOptions);

      utils.updateOptions(this.categoryFieldSelect, this._clusterFieldOptions);
      utils.updateOptions(this.labelFieldSelect, this._clusterFieldOptions);
      this.valueFields.setFields(this._valueFieldOptions);
    },

    _getDefaultFieldName: function() {
      var fieldName;
      if (this._clusterFieldOptions && this._clusterFieldOptions[0]) {
        fieldName = this._clusterFieldOptions[0].value;
      }
      return fieldName;
    }

  });

  return clazz;
});