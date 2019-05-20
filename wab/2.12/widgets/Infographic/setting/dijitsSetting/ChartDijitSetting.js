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
  'dojo/on',
  'dojo/query',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/declare',
  'dojo/Evented',
  './BaseDijitSetting',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./ChartDijitSetting.html',
  'jimu/dijit/TabContainer3',
  'jimu/utils',
  './_dijits/ChartSort',
  './_dijits/TogglePocket',
  './_dijits/VisibleSliderBar',
  './_dijits/SeriesStyle/SeriesStyle',
  './_dijits/Mark/Marks',
  './_dijits/ChartColorSetting',
  './_dijits/DataFields',
  './_dijits/Toggle',
  '../utils',
  'dijit/form/ValidationTextBox',
  'dijit/form/Select',
  'dijit/form/RadioButton',
  'dijit/form/NumberSpinner',
  'dijit/form/TextBox'
], function(on, query, lang, html, declare, Evented, BaseDijitSetting, _WidgetsInTemplateMixin,
  templateString, TabContainer3, jimuUtils, ChartSort, TogglePocket,
  VisibleSliderBar, SeriesStyle, Marks, ChartColorSetting, DataFields, Toggle, utils) {
  var clazz = declare([BaseDijitSetting, _WidgetsInTemplateMixin, Evented], {
    templateString: templateString,
    type: 'chart',
    baseClass: 'infographic-chart-dijit-setting',
    colors: ['#68D2E0', '#087E92', '#47BCF5', '#FBE66A', '#F29157', '#C8501D', '#2DB7C6', '#C4EEF6'],
    //dataSourceType: '', //CLIENT_FEATURES, FRAMEWORK_FEATURES, FRAMEWORK_STATISTICS
    //this...
    config: null,
    _defColor: null, //{textColor, bgColor}
    _modes: null,
    _clusterFields: null,
    _valueFields: null,

    // options:
    // nls
    // definition
    // layerObject
    // dataSource
    // config
    // features
    // keyProperties {type, stack, area, innerRadius}

    // public methods:
    // setLayerDefinition, setLayerObject, setFeatures
    // setConfig
    // setDataSource
    // reset
    // clearMarks
    // isValid (check config)
    // getConfig
    // onChange
    // updateDijit (try to render chart dijit)

    //config:
    // data:
    //   mode:feature|category|count|field
    //   type:column|bar|line|pie
    //   clusterField: fieldInfo.name (The field used as the horizontal axis)
    //   valueFields:[fieldInfo.name] (The field used as the vertical axis)
    //   dateConfig:
    //      minPeriod: year|month|day|hour|minute|second|automatic(Automatically select the appropriate time unit according to the time interval)
    //      isNeedFilled:boolean(Whether to display time nodes without data)
    //   operation:sum|average|min|max
    //   nullValue:boolean (Whether null is counted as zero when calculating the average value)
    //   sortOrder:
    //     isLabelAxis: boolean (Whether to sort by the value of the horizontal axis)
    //     isAsx: boolean (It's ascending order)
    //     field:fieldInfo.name (Sort by the value of which field, only valid when isLabelAxis is false)
    //   maxLabels:number (How many columns(pieces) are displayed)
    // display
    //   backgroundColor: string for color(#fffff...)
    //   seriesStyle: object, (Style of each series, refer to _dijits/SeriesStyle)
    //   xAxis/yaxis:(Set the style of the horizontal and vertical axes)
    //     show:boolean
    //     format:{type:int | float}
    //     textStyle{color, fontSize}
    //     nameTextStyle{color, fontSize}
    //   legend:
    //     show:boolean (Whether to display the legend)
    //     testStyle:{color, fontSize}
    //   dataLabel:(only valid for pie)
    //     show:boolean
    //     testStyle:{color, fontSize}
    //   innerRadius:(Inside radius, only valid for pie)
    //   stack:boolean (Whether to stack two series of columns together, only valid for column,bar)
    //   area:boolean (Whether to draw the area below the line, only valid for line)
    //   marks:object(Add some markers(line, area) to the chart with the axis, only valid for column,bar,line refer to _dijits/Mark)

    postMixInProperties: function() {
      lang.mixin(this.nls, window.jimuNls.statisticsChart);
    },

    /* Init default option */
    constructor: function(option) {
      this.inherited(arguments);
      if (option.nls) {
        this.nls = option.nls;
      }
      this.config = option.config;
      this._initChartKeyProperty(this.config);
      var theme = option.appConfig && option.appConfig.theme;
      this._defColor = utils.getDefaultColorOfTheme(theme); //{textColor, bgColor}
    },

    setLayerDefinition: function(definition) {
      definition = utils.preProcessDefinition(definition);
      this.definition = definition;
      if (this.seriesStyleDijit) {
        this.seriesStyleDijit.setLayerDefinition(definition);
      }
    },

    setLayerObject: function(layerObject) {
      this.layerObject = layerObject;
    },

    setConfig: function(config) {
      if (config) {
        this.config = config;
        this._initChartKeyProperty(config);
      }
    },

    //features for calculate custom color
    setFeatures: function(features) {
      if (this.seriesStyleDijit) {
        this.seriesStyleDijit.setFeatures(features);
      }
    },

    _initDijitInTemplate: function() {
      this.valueFields = new DataFields();
      this.valueFields.placeAt(this.valueFieldsDiv);
      this.own(on(this.valueFields, 'change', this._onValueFieldsChanged.bind(this)));

      this.bgColor = new ChartColorSetting();
      this.bgColor.placeAt(this.bgColorDiv, 'last');
      this.own(on(this.bgColor, 'change', this.onChange.bind(this)));

      this.legendTextColor = new ChartColorSetting();
      this.legendTextColor.placeAt(this.legendTextColorDiv, 'last');
      this.own(on(this.legendTextColor, 'change', this.onChange.bind(this)));

      this.horTitleColor = new ChartColorSetting();
      this.horTitleColor.placeAt(this.horTitleColorDiv, 'last');
      this.own(on(this.horTitleColor, 'change', this.onChange.bind(this)));

      this.horTextColor = new ChartColorSetting();
      this.horTextColor.placeAt(this.horTextColorDiv, 'last');
      this.own(on(this.horTextColor, 'change', this.onChange.bind(this)));

      this.hAxisKeepIntScale = new Toggle();
      this.hAxisKeepIntScale.placeAt(this.hAxisKeepIntScaleRow, 'last');
      this.own(on(this.hAxisKeepIntScale, 'change', this.onChange.bind(this)));

      this.verTitleColor = new ChartColorSetting();
      this.verTitleColor.placeAt(this.verTitleColorDiv, 'last');
      this.own(on(this.verTitleColor, 'change', this.onChange.bind(this)));

      this.verTextColor = new ChartColorSetting();
      this.verTextColor.placeAt(this.verTextColorDiv, 'last');
      this.own(on(this.verTextColor, 'change', this.onChange.bind(this)));

      this.vAxisKeepIntScale = new Toggle();
      this.vAxisKeepIntScale.placeAt(this.vAxisKeepIntScaleRow, 'last');
      this.own(on(this.vAxisKeepIntScale, 'change', this.onChange.bind(this)));

      this.dataLabelTextColor = new ChartColorSetting();
      this.dataLabelTextColor.placeAt(this.dataLabelTextColorDiv, 'last');
      this.own(on(this.dataLabelTextColor, 'change', this.onChange.bind(this)));
    },

    _initChartKeyProperty: function(config) {
      if (!config) {
        return;
      }
      var data = config.data;
      var display = config.display;
      if (!data) {
        this.keyProperties = {};
        console.error('Invalid configuration file or template');
        return;
      }
      this.keyProperties = {
        type: data.type
      };
      if (!display) {
        return;
      }
      this.keyProperties.stack = display.stack;
      this.keyProperties.area = display.area;
      this.keyProperties.innerRadius = display.innerRadius;
    },

    postCreate: function() {
      this.inherited(arguments);
      this._initDijitInTemplate();
      this._ignoreEvent();
      this._createInitNodeByType(this.config);
      this._careEvent();
    },

    setDataSource: function(dataSource) {
      this.inherited(arguments);
      if (!this.definition || !this.config) {
        console.warn('No layer definition or config, set data source error.');
        return;
      }
      this._setDataSourceToDijits(dataSource);
      this.dataSource = dataSource;
      this._initNodesByDataSource(dataSource);
      var mode = this.config.data && this.config.data.mode;
      if (!mode) {
        mode = this._modes && this._modes[0];
      }
      if (!mode) {
        console.error('Invalid mode');
        return;
      }
      this._onModeChanged(mode, true);
      this._ignoreEvent();
      this._setConfig(this.config);
      this._careEvent();
    },

    _setDataSourceToDijits: function(dataSource) {
      if (this.seriesStyleDijit) {
        this.seriesStyleDijit.setDataSource(dataSource);
      }
    },

    _onChartModeChanged: function(mode) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._onModeChanged(mode);
      this.onChange();
    },

    _onModeChanged: function(mode, hasConfig) {
      this.reset();
      var clusterField = hasConfig ? this.config.data.clusterField : this.clusterFieldSelect.get('value');

      this._updateElementDisplayByChartMode(mode);
      //mode select
      this._chartModeTriggerForModeSelect(mode);
      //date option container
      this._chartModeTriggerForDateOption(clusterField);
      //sort
      this._chartModeTriggerForSort(mode);
      //legend
      this._chartModeTriggerForLegend(mode);
      //value fields
      this._chartModeTriggerForValueFields(mode);
      //series style
      this._chartModeTriggerForSeriesStyle(mode, hasConfig);

      this._emitSettingChange(mode, clusterField);
    },

    _emitSettingChange: function(mode, clusterField) {
      clusterField = clusterField || this.clusterFieldSelect.get('value');
      mode = mode || this.chartModeSelect.get('value');
      var isDataType = this._isClusterDateType(clusterField);
      this.emit('chartSettingChanged', {
        mode: mode,
        isDataType: isDataType
      });
    },

    //triggers
    _chartModeTriggerForModeSelect: function(mode) {
      utils.updateOptions(this.chartModeSelect, null, mode);
      this._updateSelectTitleByValue(this.chartModeSelect, mode);
    },

    _chartModeTriggerForSort: function(mode) {
      this.chartSortDijit.setMode(mode);
      var fields = this._getSortFields(mode, true);
      this.chartSortDijit.setFields(fields);
    },

    _chartModeTriggerForLegend: function(mode) {
      var seriesStyle = this.config.display && this.config.display.seriesStyle;
      var seriesStyleType = seriesStyle && seriesStyle.type;
      this._updateLegendDisplay(mode, seriesStyleType);
    },

    _chartModeTriggerForValueFields: function(mode) {
      var isSingleMode = this._shouldValueFieldAsSingleMode(mode);
      if (isSingleMode) {
        this.valueFields.setSingleMode();
      } else {
        this.valueFields.setMultipleMode();
      }
    },

    _chartModeTriggerForSeriesStyle: function(mode, hasConfig) {
      var data = this.config && this.config.data;
      var clusterField = hasConfig ? (data && data.clusterField) : this.clusterFieldSelect.get('value');
      var valueFields = hasConfig ? data && data.valueFields : this.valueFields.getSelectedFieldNames();
      this.seriesStyleDijit.render(mode, clusterField, valueFields);
    },

    _chartModeTriggerForDateOption: function(clusterField) {
      clusterField = clusterField || this.clusterFieldSelect.get('value');
      this._updateDateOptionContainerDisplay(clusterField);
    },

    reset: function() {
      //reset label(category) field select
      var clusterField = this._clusterFields && this._clusterFields[0] && this._clusterFields[0].name;
      utils.updateOptions(this.clusterFieldSelect, null, clusterField);
      this._updateDateOptionContainerDisplay();
      //clear value fields selected field
      this.valueFields.uncheckAllFields();
      //reset chart sort
      this.chartSortDijit.reset();
      //clear max categories
      this.maxLabels.set('value', '');
      if (this.keyProperties.type === 'pie') {
        this.maxLabels.set('value', 100);
      }
      //reset marks
      this.clearMarks();
    },

    _setConfig: function(config) {
      if (!config) {
        return;
      }
      var data = config.data;
      var display = config.display;
      //data properties
      var clusterField, valueFields, operation, dateConfig,
        sortOrder, maxLabels, nullValue;
      if (data) {
        clusterField = data.clusterField;
        valueFields = data.valueFields;
        operation = data.operation;
        dateConfig = data.dateConfig;
        sortOrder = data.sortOrder;
        maxLabels = data.maxLabels;
        nullValue = data.nullValue;
      }
      this.clusterFieldSelect.set('value', clusterField);
      this.valueFields.selectFields(valueFields);
      this.operationSelect.set('value', operation);
      if (dateConfig) {
        //Minimum period
        this.periodSelect.set('value', dateConfig.minPeriod);
        //Periods without records
        this.showRadioBtn.setChecked(dateConfig.isNeedFilled);
        this.hideRadioBtn.setChecked(!dateConfig.isNeedFilled);
      }
      if (sortOrder) {
        this.chartSortDijit.setConfig(sortOrder);
      }
      if (typeof maxLabels !== 'undefined') {
        this.maxLabels.set('value', maxLabels);
      } else {
        this.maxLabels.set('value', '');
      }
      if (typeof nullValue !== 'undefined') {
        this.zeroRadioBtn.setChecked(nullValue);
        this.ignoreRadioBtn.setChecked(!nullValue);
      }
      //display properties
      var backgroundColor, seriesStyle, innerRadius, legend,
        xAxis, yAxis, dataLabel, marks;

      if (display) {
        backgroundColor = display.backgroundColor;
        seriesStyle = display.seriesStyle;
        innerRadius = display.innerRadius;
        legend = display.legend;
        xAxis = display.xAxis;
        yAxis = display.yAxis;
        dataLabel = display.dataLabel;
        marks = display.marks;
      }

      if (seriesStyle) {
        this.seriesStyleDijit.setConfig(seriesStyle);
      }
      if (typeof innerRadius !== 'undefined') {
        this.hollowSizeControl.setValue(innerRadius);
      }
      if (backgroundColor) {
        this.bgColor.setSingleColor(backgroundColor);
      }

      //legend, xAxis, yAxis, dataLabel
      var show, title, nameTextStyle, titleColor, textStyle, labelColor,
        labelSize, format, formatType;

      show = legend && legend.show;
      textStyle = legend && legend.textStyle;
      labelColor = textStyle && textStyle.color;
      labelSize = textStyle && textStyle.fontSize;

      this.legendTogglePocket.setState(!!show);
      if (labelColor) {
        this.legendTextColor.setSingleColor(labelColor);
      }
      if (labelSize) {
        this.legendTextSizeControl.setValue(labelSize);
      }

      show = yAxis && yAxis.show;
      show = typeof show === 'undefined' ? true : show;
      this.verTogglePocket.setState(!!show);

      title = yAxis && yAxis.name;
      textStyle = yAxis && yAxis.textStyle;
      nameTextStyle = yAxis && yAxis.nameTextStyle;
      format = yAxis && yAxis.format;

      titleColor = nameTextStyle && nameTextStyle.color;
      labelColor = textStyle && textStyle.color;
      labelSize = textStyle && textStyle.fontSize;
      formatType = format && format.type;

      if (title) {
        this.verTitle.set('value', title);
      }
      if (titleColor) {
        this.verTitleColor.setSingleColor(titleColor);
      }
      if (labelColor) {
        this.verTextColor.setSingleColor(labelColor);
      }
      if (labelSize) {
        this.verticalAxisTextSizeControl.setValue(labelSize);
      }
      if (formatType === 'int') {
        this.vAxisKeepIntScale.setState(true);
      }

      show = xAxis && xAxis.show;
      show = typeof show === 'undefined' ? true : show;
      this.horTogglePocket.setState(!!show);

      title = xAxis && xAxis.name;
      textStyle = xAxis && xAxis.textStyle;
      nameTextStyle = xAxis && xAxis.nameTextStyle;
      format = xAxis && xAxis.format;

      titleColor = nameTextStyle && nameTextStyle.color;
      labelColor = textStyle && textStyle.color;
      labelSize = textStyle && textStyle.fontSize;
      formatType = format && format.type;

      if (title) {
        this.horTitle.set('value', title);
      }
      if (titleColor) {
        this.horTitleColor.setSingleColor(titleColor);
      }
      if (labelColor) {
        this.horTextColor.setSingleColor(labelColor);
      }
      if (labelSize) {
        this.horizontalAxisTextSizeControl.setValue(labelSize);
      }
      if (formatType === 'int') {
        this.hAxisKeepIntScale.setState(true);
      }

      show = dataLabel && dataLabel.show;
      textStyle = dataLabel && dataLabel.textStyle;
      labelColor = textStyle && textStyle.color;
      labelSize = textStyle && textStyle.fontSize;

      this.dataLabelTogglePocket.setState(!!show);
      if (labelColor) {
        this.dataLabelTextColor.setSingleColor(labelColor);
      }
      if (labelSize) {
        this.dataLabelSizeControl.setValue(labelSize);
      }
      if (marks) {
        this.marks.setConfig(marks);
      }
    },

    clearMarks: function() {
      if (this.marks) {
        this.marks.setConfig({});
      }
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
      var type = this.keyProperties.type;
      var enumValues = {
        type: type,
        stack: this.keyProperties.stack,
        area: this.keyProperties.area,
        innerRadius: this.keyProperties.innerRadius
      };
      // data tab
      var mode = this.chartModeSelect.get('value');
      enumValues.mode = mode;
      var clusterField;
      if (mode === 'feature' || mode === 'category' || mode === 'count') {
        clusterField = this.clusterFieldSelect.get('value');
        enumValues.clusterField = clusterField;
      }
      //Date config
      if (this._isClusterDateType(clusterField)) {
        var dateConfig = {};
        dateConfig.minPeriod = this.periodSelect.get('value');
        dateConfig.isNeedFilled = this.showRadioBtn.checked;
        enumValues.dateConfig = dateConfig;
      }

      enumValues.nullValue = this.zeroRadioBtn.checked;
      enumValues.operation = this.operationSelect.get('value');
      enumValues.valueFields = this.valueFields.getSelectedFieldNames();
      enumValues.sortOrder = this.chartSortDijit.getConfig();
      enumValues.maxLabels = this.maxLabels.get('value') || undefined;
      //display tab
      enumValues.backgroundColor = this.bgColor.getSingleColor();
      //legend
      var legend = {
        textStyle: {}
      };
      legend.show = this.legendTogglePocket.getState();
      legend.textStyle.color = this.legendTextColor.getSingleColor();
      legend.textStyle.fontSize = this.legendTextSizeControl.getValue();
      enumValues.legend = legend;
      //xAxis
      var xAxis = {
        textStyle: {}
      };
      xAxis.show = this.horTogglePocket.getState();
      var xName = this.horTitle.get('value');
      if (xName) {
        xAxis.name = xName;
        xAxis.nameTextStyle = {};
        xAxis.nameTextStyle.color = this.horTitleColor.getSingleColor();
      }
      xAxis.textStyle.color = this.horTextColor.getSingleColor();
      xAxis.textStyle.fontSize = this.horizontalAxisTextSizeControl.getValue();

      var xFormat = null;
      //format type
      if (type === 'bar') {
        var isXIntType = this.hAxisKeepIntScale.getState();
        xFormat = {
          type: isXIntType ? 'int' : 'float'
        };
      }
      xAxis.format = xFormat;
      enumValues.xAxis = xAxis;

      //yAxis
      var yAxis = {
        textStyle: {}
      };
      yAxis.show = this.verTogglePocket.getState();
      var yName = this.verTitle.get('value');
      if (yName) {
        yAxis.name = yName;
        yAxis.nameTextStyle = {};
        yAxis.nameTextStyle.color = this.verTitleColor.getSingleColor();
      }
      yAxis.textStyle.color = this.verTextColor.getSingleColor();
      yAxis.textStyle.fontSize = this.verticalAxisTextSizeControl.getValue();

      var yFormat = null;
      //format type
      if (type === 'column' || type === 'line') {
        var isYIntType = this.vAxisKeepIntScale.getState();
        yFormat = {
          type: isYIntType ? 'int' : 'float'
        };
      }
      yAxis.format = yFormat;
      enumValues.yAxis = yAxis;

      //data labels
      var dataLabel = {
        textStyle: {}
      };
      dataLabel.show = this.dataLabelTogglePocket.getState();
      dataLabel.textStyle.color = this.dataLabelTextColor.getSingleColor();
      dataLabel.textStyle.fontSize = this.dataLabelSizeControl.getValue();
      enumValues.dataLabel = dataLabel;
      //inner radius
      enumValues.innerRadius = this.hollowSizeControl.getValue();

      if (this.marks) {
        var marks = this.marks.getConfig();
        if (marks === false) {
          return false;
        }
        enumValues.marks = marks;
      }
      //series style
      if (this.seriesStyleDijit) {
        var seriesStyle = this.seriesStyleDijit.getConfig();
        enumValues.seriesStyle = seriesStyle;
      }

      var chartConfig = utils.getChartConfig(enumValues);
      if (!chartConfig) {
        this.dijit.clearChart();
        return;
      }
      this.config = chartConfig;
      return chartConfig;
    },

    onChange: function() {
      if (this.ignoreChangeEvents) {
        return;
      }
      this.getConfig();
      this.updateDijit();
    },

    updateDijit: function() {
      var isEqual = jimuUtils.isEqual(this.cacheConfig, this.config);
      if (!isEqual) {
        this.dijit.setConfig(this.config);
        this.dijit.startRendering();
      }
      this.cacheConfig = null;
      this.cacheConfig = lang.clone(this.config);
    },

    _createInitNodeByType: function(config) {
      var data = config.data;
      if (!data) {
        return;
      }
      var type = data.type;
      var tabs = [{
        title: this.nls.data,
        content: this.dataSection
      }, {
        title: this.nls.display,
        content: this.displaySection
      }];

      if (type !== 'pie') {
        tabs.push({
          title: this.nls.marks,
          content: this.marksSection
        });
      }

      if (type === 'bar') {
        this._hideAxisKeepIntScale(true);
      } else {
        this._hideAxisKeepIntScale(false);
      }

      this.tabContainer = new TabContainer3({
        average: true,
        tabs: tabs
      });

      if (type !== 'pie') {
        this.marks = new Marks({
          chartType: type,
          nls: this.nls,
          folderUrl: this.folderUrl,
          defaultColor: this._defColor.textColor
        });
        this.marks.placeAt(this.marksSection);
        this.own(on(this.marks, 'change', lang.hitch(this, this.onChange)));
        this.valueFields.setMultipleMode();
      } else {
        this.valueFields.setSingleMode();
      }

      //background color
      this.bgColor.setSingleColor(this._defColor.bgColor);
      //series style
      this.seriesStyleDijit = new SeriesStyle({
        nls: this.nls,
        map: this.map,
        chartInfo: {
          type: this.keyProperties.type,
          area: this.keyProperties.area
        }
      });
      this.seriesStyleDijit.placeAt(this.chartColorContainer);
      this.seriesStyleDijit.startup();
      this.own(on(this.seriesStyleDijit, 'change', lang.hitch(this, this.onChange)));
      //hollow size, inner radius
      this.hollowSizeControl = new VisibleSliderBar({
        min: 0,
        max: 60,
        step: 1,
        value: this.keyProperties.innerRadius || 0
      });
      this.own(on(this.hollowSizeControl, 'change', lang.hitch(this, this.onChange)));
      this.hollowSizeControl.placeAt(this.hollowSize);

      //legend
      this.legendTogglePocket = new TogglePocket({
        titleLabel: this.nls.legend,
        content: this.legendTogglePocketContent,
        className: 'section-item column-type bar-type line-type pie-type'
      });
      this.legendTogglePocket.setState(false);
      this.own(on(this.legendTogglePocket, 'change', lang.hitch(this, this.onChange)));
      this.legendTogglePocket.placeAt(this.displaySection);

      this.legendTextColor.setSingleColor(this._defColor.textColor);

      this.legendTextSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: 12
      });
      this.own(on(this.legendTextSizeControl, 'change', lang.hitch(this, this.onChange)));
      this.legendTextSizeControl.placeAt(this.legendTextSize);

      //vertical axis for column, bar and line
      this.verTogglePocket = new TogglePocket({
        titleLabel: this.nls.verticalAxis,
        content: this.verTogglePocketContent,
        className: 'section-item column-type bar-type line-type'
      });
      this.verTogglePocket.setState(false);
      this.own(on(this.verTogglePocket, 'change', lang.hitch(this, this.onChange)));
      this.verTogglePocket.placeAt(this.displaySection);

      this.verTextColor.setSingleColor(this._defColor.textColor);
      this.verTitleColor.setSingleColor(this._defColor.textColor);

      this.verticalAxisTextSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: 12
      });
      this.own(on(this.verticalAxisTextSizeControl, 'change', lang.hitch(this, this.onChange)));
      this.verticalAxisTextSizeControl.placeAt(this.verTextSize);
      //axis scale type
      this.vAxisKeepIntScale.setState(false);

      //xAxis
      this.horTogglePocket = new TogglePocket({
        titleLabel: this.nls.horizontalAxis,
        content: this.horTogglePocketContent,
        className: 'section-item column-type bar-type line-type'
      });
      this.horTogglePocket.setState(false);
      this.own(on(this.horTogglePocket, 'change', lang.hitch(this, this.onChange)));
      this.horTogglePocket.placeAt(this.displaySection);

      this.horTextColor.setSingleColor(this._defColor.textColor);
      this.horTitleColor.setSingleColor(this._defColor.textColor);

      this.horizontalAxisTextSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: 12
      });
      this.own(on(this.horizontalAxisTextSizeControl, 'change',
        lang.hitch(this, this.onChange)));

      this.horizontalAxisTextSizeControl.placeAt(this.horTextSize);
      this.hAxisKeepIntScale.setState(false);

      //data Label
      this.dataLabelTogglePocket = new TogglePocket({
        titleLabel: this.nls.dataLabels,
        content: this.dataLabelTogglePocketContent,
        className: 'section-item pie-type'
      });
      this.dataLabelTogglePocket.setState(false);
      this.own(on(this.dataLabelTogglePocket, 'change', lang.hitch(this, this.onChange)));
      this.dataLabelTogglePocket.placeAt(this.displaySection);

      this.dataLabelTextColor.setSingleColor(this._defColor.textColor);

      this.dataLabelSizeControl = new VisibleSliderBar({
        min: 6,
        max: 40,
        step: 1,
        value: 12
      });
      this.own(on(this.dataLabelSizeControl, 'change', lang.hitch(this, this.onChange)));
      this.dataLabelSizeControl.placeAt(this.dataLabelTextSize);

      // init chart sort
      this.chartSortDijit = new ChartSort({
        nls: this.nls
      });
      this.own(on(this.chartSortDijit, 'change', lang.hitch(this, this.onChange)));
      this.chartSortDijit.placeAt(this.chartSort);

      this.tabContainer.placeAt(this.domNode);
      //max categories
      if (type === 'pie') {

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
      this._updateElementDisplayByChartType(type);
    },

    _ignoreEvent: function() {
      this.ignoreChangeEvents = true;
    },

    _careEvent: function() {
      setTimeout(function() {
        this.ignoreChangeEvents = false;
      }.bind(this), 200);
    },

    _updateSelectTitleByValue: function(select, value) {
      var option = select.getOptions(value);
      if (option && typeof option.label !== 'undefined') {
        select.set('title', option.label);
      }
    },

    _updateLegendDisplay: function(mode, seriesStyleType) {
      mode = mode || this.chartModeSelect.get('value');
      var show = this._shouldLegendDisplay(mode, seriesStyleType);
      var type = this.keyProperties.type;
      if (show) {
        this._showLegend(type);
      } else {
        this._hideLegend();
      }
    },

    // tool methods for dom and definition
    _getValueFields: function() {
      return this.valueFields.getSelectedFieldNames();
    },

    _getSortFields: function(mode, fromConfig) {
      var definition = this.definition;
      if (!definition || !mode) {
        return;
      }
      var valueFields;
      if (fromConfig) {
        valueFields = this.config.data && this.config.data.valueFields;
      } else {
        valueFields = this._getValueFields();
      }
      if (mode !== 'feature' && (!valueFields || !valueFields[0])) {
        return;
      }
      var fields = [];
      if (mode === 'feature') {
        fields = lang.clone(definition.fields);
        fields = utils.getNotGeometryFields(fields);
      } else if (valueFields) {
        fields = utils.getFieldInfosByFieldName(valueFields, definition);
      }
      var fieldOption = fields.map(function(field) {
        return {
          value: field.name,
          label: field.alias || field.name
        };
      });
      return fieldOption;
    },

    _initNodesByDataSource: function(dataSource) {
      this._initInfoByDataSource(dataSource);
      //init nodes by data source
      this._fillModeSelect(this._modes);
      this._fillClusterFieldSelect(this._clusterFields);
      this._fillValueFieldLists(this._valueFields);
    },

    _initInfoByDataSource: function(dataSource) {
      if (!dataSource) {
        return;
      }
      this._modes = this._getSupportedModes(dataSource, this.definition);
      var fields = this._getSupportFields(this.definition);
      this._clusterFields = fields[0];
      this._valueFields = fields[1];
    },

    _getSupportedModes: function(dataSource, definition) {
      if (!definition || !dataSource) {
        return;
      }
      var isFSDS = false;
      var modes = ["feature", "category", "count", "field"];
      var frameWorkDsId = dataSource.frameWorkDsId;
      if (frameWorkDsId) {
        var dataSources = this.appConfig.dataSource && this.appConfig.dataSource.dataSources;
        var dsMeta = dataSources[frameWorkDsId];
        if (dsMeta.type === 'FeatureStatistics') {
          isFSDS = true;
          var dataSchema = lang.clone(dsMeta.dataSchema);
          var groupByFields = dataSchema.groupByFields || [];
          if (groupByFields.length > 0) {
            //available modes: category, count
            if (utils.hasNumberFields(definition)) {
              modes = ["category", "count"];
            } else {
              modes = ["count"];
            }
          } else {
            modes = ["field"];
          }
        }
      }
      if (!isFSDS && !utils.hasNumberFields(definition)) {
        modes = ['count'];
      }
      return modes;
    },

    _fillModeSelect: function(modes) {
      if (!modes) {
        return;
      }
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

    _getSupportFields: function(definition) {
      if (!definition) {
        return;
      }
      var fields = lang.clone(definition.fields);
      if (!fields || !fields.length) {
        return;
      }
      //update have been checked to uncheck
      //fix a bug of all field auto checked when select ds from featureStatistics
      fields.forEach(function(item) {
        if (item.checked) {
          item.checked = false;
        }
      });
      var gbFields = definition.groupByFields;
      //clusterFields
      var clusterFields = utils.getClusterFields(fields, gbFields);

      //valueFields
      var valueFields = utils.getValueFields(fields, gbFields, clusterFields);
      return [clusterFields, valueFields];
    },

    _fillClusterFieldSelect: function(clusterFields) {
      var fieldOptions = clusterFields.map(function(field) {
        return {
          label: field.alias || field.name,
          value: field.name
        };
      });
      utils.updateOptions(this.clusterFieldSelect, fieldOptions);
    },

    _fillValueFieldLists: function(valueFields) {
      this.valueFields.setFields(valueFields);
    },

    // -------------- change event ------------
    _onClusterFieldChanged: function(clusterField) {
      if (this.ignoreChangeEvents) {
        return;
      }
      this._updateDateOptionContainerDisplay(clusterField);
      var mode = this.chartModeSelect.get('value');
      var valueFields = this.valueFields.getSelectedFieldNames();
      this.seriesStyleDijit.render(mode, clusterField, valueFields);
      this.onChange();
      this._emitSettingChange(mode, clusterField);
    },

    _onValueFieldsChanged: function() {
      if (this.ignoreChangeEvents) {
        return;
      }

      var mode = this.chartModeSelect.get('value');
      var clusterField = this.clusterFieldSelect.get('value');
      var valueFields = this.valueFields.getSelectedFieldNames();
      this.seriesStyleDijit.render(mode, clusterField, valueFields);

      var fields = this._getSortFields(mode);
      this.chartSortDijit.setFields(fields);

      this.onChange();
    },

    _shouldShowDateOption: function(clusterField) {
      var mode = this.chartModeSelect.get('value');
      clusterField = clusterField || this.clusterFieldSelect.get('value');

      var definition = this.definition;
      var isDateField = utils.isDateField(clusterField, definition);
      return (mode === 'category' || mode === 'count') && isDateField;
    },

    //---------- Tool methods for dom -----------
    _showDateOptionContainer: function(type) {
      if (type !== 'pie') {
        this._showPeriodsRecordsDiv();
      }
      this._showPeridoDiv();
    },

    _hideDateOptionContainer: function() {
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
        html.removeClass(this.hAxisKeepIntScaleRow, 'hide');
      } else {
        html.addClass(this.hAxisKeepIntScaleRow, 'hide');
        html.removeClass(this.vAxisKeepIntScaleRow, 'hide');
      }
    },

    _showSectionItem: function(itemDom) {
      html.removeClass(itemDom, 'hide');
    },

    _hideSectionItem: function(itemDom) {
      html.addClass(itemDom, 'hide');
    },

    //---------- pure Tool methods -----------
    _shouldValueFieldAsSingleMode: function(mode) {
      var type = this.keyProperties.type;
      return (mode === 'feature' || mode === 'category') && type === 'pie';
    },

    _shouldLegendDisplay: function(mode, seriesStyleType) {
      var type = this.keyProperties.type;
      var legendDisplay;
      if (type === 'pie') {
        legendDisplay = true;
      } else {
        legendDisplay = true;
        if (mode === 'count' || mode === 'field') {
          legendDisplay = false;
        } else {
          legendDisplay = seriesStyleType !== 'layerSymbol';
        }
      }
      return legendDisplay;
    },

    _tryGetLayerIdFromDataSource: function(dataSource) {
      if (!dataSource) {
        return;
      }
      var layerId = dataSource.layerId;
      var frameWorkDsId = dataSource.frameWorkDsId;
      if (!layerId && frameWorkDsId) {
        var dsTypeInfo = utils.parseDataSourceId(frameWorkDsId);
        if (dsTypeInfo && dsTypeInfo.layerId !== 'undefined') {
          layerId = dsTypeInfo.layerId;
        }
      }
      return layerId;
    },

    _updateDateOptionContainerDisplay: function(clusterField) {
      var show = this._shouldShowDateOption(clusterField);
      var type = this.keyProperties.type;
      if (show) {
        this._showDateOptionContainer(type);
      } else {
        this._hideDateOptionContainer();
      }
    },

    _isClusterDateType: function(clusterField) {
      return this._shouldShowDateOption(clusterField);
    },

    _updateElementDisplayByChartMode: function(mode) {
      var className = mode + '-mode';
      var dataSectionItems = query('.section-item', this.dataSection);

      dataSectionItems.forEach(lang.hitch(this, function(sectionItem) {
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

      displayItems.forEach(lang.hitch(this, function(sectionItem) {
        if (html.hasClass(sectionItem, chartTypeClassName)) {
          this._showSectionItem(sectionItem);
        } else {
          this._hideSectionItem(sectionItem);
        }
      }));
    },

    _showChartNoData: function(tempConfig) {
      setTimeout(function() {
        if (tempConfig) {
          this.dijit.setConfig(tempConfig);
        }
        this.dijit.clearChart();
      }.bind(this), 200);
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