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
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  './BaseDijit',
  'jimu/utils',
  'jimu/dijit/Chart',
  '../utils',
  './clientStatistic'
], function(declare, lang, html, BaseDijit, jimuUtils, Chart, utils, clientStatistic) {
  var clazz = declare([BaseDijit], {
    // templateString: '<div style="height:100%;">' +
    //   '<div data-dojo-attach-point="gauge"></div></div>',
    templateString: '<div style="width:100%;height:100%;"><div data-dojo-attach-point="noDataDiv"' +
      'class="no-data-tip">${nls.noData}</div>' +
      '<div class="gauge-dom" data-dojo-attach-point="gaugeDomNode"></div></div>',
    type: 'gauge',
    baseClass: 'infographic-gauge-dijit',
    config: null,
    defValueStyle: {
      "state": true,
      "isRatio": false,
      "font": {
        "font": {
          "fontFamily": "Arial",
          "bold": false,
          "italic": false,
          "underline": false
        },
        "textColor": "#59bad8"
      },
      "dataFormat": {
        "unit": "none",
        "decimalPlaces": '',
        "prefix": "",
        "suffix": ""
      }
    },

    constructor: function(options) {
      this.inherited(arguments);
      this.visible = options.visible;
    },

    postCreate: function() {
      this.inherited(arguments);
      this._features = null;
      this._upgradeConfig(this.config);
      this.setConfig(this.config);
      this._updateBackGroundColor();
    },

    _upgradeConfig: function(config) {
      var currentValue = config && config.display && config.display.currentValue;
      var dataFormat = currentValue && currentValue.dataFormat;
      if (!dataFormat) {
        return;
      }
      if (typeof dataFormat.digitSeparator === 'undefined') {
        dataFormat.digitSeparator = true;
      }
    },

    setLayerInfo: function() {},

    setVisible: function(visible) {
      this.visible = visible;
    },

    resetData: function() {
      this.dataSource = null;
      this._features = null;
      this._r1fs = null;
      this._r2fs = null;
      this._valueObj = null;
      this.gaugeValue = null;
    },

    onDataSourceDataUpdate: function(value, r1fs, r2fs) {
      if (this.inSettingPage) {
        if (value && typeof value.features !== 'undefined') {
          this._features = utils.cleanFeatures(value.features);
        }
        this.setRangeFeatures(r1fs, 'range1');
        this.setRangeFeatures(r2fs, 'range2');
      } else {
        this._valueObj = value;
      }
    },

    setRangeFeatures: function(features, type) {
      if (type === 'range1') {
        this._r1fs = utils.cleanFeatures(features);
      } else if (type === 'range2') {
        this._r2fs = utils.cleanFeatures(features);
      }
    },

    resize: function() {
      if (!this.chart) {
        return;
      }
      this.chart.resize();
    },

    setDataSource: function(dataSource) {
      this.inherited(arguments);
      this.dataSource = dataSource;
    },

    setConfig: function(config) {
      if (!config) {
        return;
      }
      this.config = config;
    },

    startRendering: function() {
      if (!this._shouldRenderGauge()) {
        return;
      }
      if (!this.chart) {
        this._createJimuChart();
      }

      this._updateBackGroundColor();

      var code = this._calculateGaugeValue();
      if (code === 0) {
        this.showNodata();
        return;
      }
      if (code === -1) {
        this.showNodata(this.nls.invalidRangeTip);
        return;
      }
      var option = this._createChartOption();
      this.chart.updateConfig(option);
    },

    _splitStatistic: function(statistics) {
      if (!statistics || !statistics.length) {
        return;
      }
      var config = {};
      statistics.forEach(function(st) {
        if (st.type === 'value') {
          config.value = st.config.value;
        } else if (st.type === 'range') {
          var name = st.name;
          if (st.config.type === 'stat') {
            config[name] = st.config.value.statistic;
          } else if (st.config.type === 'fixed') {
            config[name] = {
              value: st.config.value
            };
          }
        }
      });
      return config;
    },

    _getValueObjForSetting: function() {
      //handle statistic {type:sum..., filed: pop...}
      var statistics = this.config && this.config.statistics;
      if (!statistics || !statistics.length) {
        return;
      }
      var splitedStatistics = this._splitStatistic(statistics);
      var valueStatistic = splitedStatistics.value;
      var range1Statistic = splitedStatistics.range1;
      var range2Statistic = splitedStatistics.range2;
      //handle data source
      var dataSource = this.dataSource;
      var rangeSources = utils.mockDataSourceForGaugeRange(statistics);
      var value = clientStatistic.statistic(valueStatistic, dataSource, this._features);

      var range1;
      if (typeof range1Statistic.value !== 'undefined') {
        range1 = range1Statistic.value;
      } else {
        range1 = clientStatistic.statistic(range1Statistic, rangeSources[0], this._r1fs);
        range1 = clientStatistic.formatterRangeNumber(range1);
      }

      var range2;
      if (typeof range2Statistic.value !== 'undefined') {
        range2 = range2Statistic.value;
      } else {
        range2 = clientStatistic.statistic(range2Statistic, rangeSources[1], this._r2fs);
        range2 = clientStatistic.formatterRangeNumber(range2);
      }
      var values = {
        value: value,
        ranges: [range1, range2]
      };
      return values;
    },

    //setp 1, calculate gauge value
    // retrun
    // 0 -> Invalid value object
    // -1 -> Invalid range
    // 1 -> Valid data
    _calculateGaugeValue: function() {
      var valueObj;
      if (this.inSettingPage) {
        valueObj = this._getValueObjForSetting();
      } else {
        valueObj = this._valueObj;
      }
      if (!utils.isValidValue(valueObj)) {
        return 0;
      }
      var value = valueObj.value;
      if (!utils.isValidValue(value)) {
        return 0;
      } else {
        var isEffectiveRange = this._isEffectiveRange(valueObj);
        if (!isEffectiveRange) {
          return -1;
        }
      }
      this.gaugeValue = valueObj;
      return 1;
    },

    //setp 2, create gauge option
    _createChartOption: function() {
      var splitValueObj = this._splitValueObj(this.gaugeValue);
      var min = splitValueObj.min;
      var max = splitValueObj.max;
      var value = splitValueObj.value;
      value = this._parseRealValueDecimal(value);
      var config = this.config;

      var option = {
        series: [{
          data: [value]
        }]
      };
      var shape = config.shape;
      var type = 'gauge';
      option.shape = shape;
      option.type = type;
      option.theme = this.isDarkTheme() ? 'dark' : 'light';
      //get gauge option
      var gaugeOption = this._createGaugeOption();
      option.gaugeOption = gaugeOption;
      //min max
      option.max = max;
      option.min = min;
      return option;
    },

    _parseRealValueDecimal: function(value) {
      var valueDisplay = this._getVaildValueDisplay();
      var decimalPlaces = this._getVaildDecimalPlaces(valueDisplay);
      if (decimalPlaces) {
        value = value.toFixed(decimalPlaces);
        value = Number(value);
      }
      return value;
    },

    _createGaugeOption: function() {
      var splitValueObj = this._splitValueObj(this.gaugeValue);
      var value = splitValueObj.value;

      var config = this.config;
      var gaugeOption = {};

      //assignee valueStyle
      var valueStyle = this._getValueStyle();
      if (valueStyle) {
        gaugeOption.valueStyle = valueStyle;
      }

      this._setGaugeDisplay(gaugeOption);

      //indicator color
      var indicatorInfo = this._getIndicatorInfo(config, value, splitValueObj);

      if (indicatorInfo.targetValue) {
        var showTargetValue = this._isShowTargetValue();
        gaugeOption.targetValue = showTargetValue ? indicatorInfo.targetValue : [];
      }
      if (indicatorInfo.columnColor) {
        gaugeOption.columnColor = indicatorInfo.columnColor;
      }
      return gaugeOption;
    },

    //----------------tools---------------------
    _getIndicatorInfo: function(config, value, splitValueObj) {
      var targetValue = false,
        columnColor = false,
        valueColor = false;
      //1.target values
      var values = this._getIndicatorValues(config, splitValueObj);
      if (jimuUtils.isNotEmptyObject(values, true)) {
        targetValue = values;
      }
      //2.value color column color
      var indicators = config.indicators;
      if (indicators) {
        var vaildIndicator = utils.getVaildIndicator(value, indicators, splitValueObj.max);
        if (vaildIndicator && vaildIndicator.gaugeColor) {
          columnColor = vaildIndicator.gaugeColor;
        }
        if (vaildIndicator && vaildIndicator.valueColor) {
          valueColor = vaildIndicator.valueColor;
        }
      }
      return {
        targetValue: targetValue,
        columnColor: columnColor,
        valueColor: valueColor
      };
    },

    _getIndicatorValues: function(config, splitValueObj) {
      var values = [];
      if (config.indicators) {
        var indicators = config.indicators;
        indicators.forEach(function(item) {
          if (item.value) {
            item.value.forEach(lang.hitch(this, function(val) {
              values.push(!!item.isRatio ? splitValueObj.max * (val / 100) : val);
            }));
          }
        });
        values.sort(function(a, b) {
          return a - b;
        });
        values = jimuUtils.uniqueArray(values);
      }
      return values;
    },

    _splitValueObj: function(valueObj) {
      var value, min, max;
      value = valueObj.value;
      var ranges = valueObj.ranges;
      ranges.sort(function(a, b) {
        return a - b;
      });
      min = ranges[0];
      max = ranges[1];

      return {
        min: min,
        max: max,
        value: value
      };
    },

    _isEffectiveRange: function(valueObj) {
      var splitValueObj = this._splitValueObj(valueObj);
      var min = splitValueObj.min;
      var max = splitValueObj.max;
      if (typeof min === 'undefined' || typeof max === 'undefined') {
        return false;
      }
      if (max === min) {
        return false;
      }
      return true;
    },

    _isRangeNeedFeatures: function(config, name) {
      var needFeatures = false;
      var statistics = config.statistics;
      if (!statistics || !statistics.length) {
        return needFeatures;
      }
      statistics.some(function(stat) {
        if (stat.type === 'range' && stat.name === name && stat.config.type === 'stat') {
          needFeatures = true;
          return true;
        }
      });
      return needFeatures;
    },

    _shouldRenderGauge: function() {
      if (!this.visible) {
        return;
      }
      if (!this.config) {
        return;
      }
      var basicRequire;
      if (this.inSettingPage) {
        var r1NeedFeatures = this._isRangeNeedFeatures(this.config, 'range1');
        var r2NeedFeatures = this._isRangeNeedFeatures(this.config, 'range2');
        var r1Valid = r1NeedFeatures ? this._r1fs : true;
        var r2Valid = r2NeedFeatures ? this._r2fs : true;
        basicRequire = this.domNode && this._features && r1Valid && r2Valid;
      } else {
        var valueObj = this._valueObj;
        var ranges = valueObj && valueObj.ranges;
        basicRequire = this.domNode && valueObj && ranges &&
          typeof valueObj.value === 'number' &&
          typeof ranges[0] === 'number' &&
          typeof ranges[1] === 'number';
      }
      if (!!basicRequire) {
        this.hideNodata();
      } else {
        this.showNodata();
      }
      return !!basicRequire;
    },

    _updateBackGroundColor: function() {
      var config = this.config;
      var bgColor = config && config.display && config.display.backgroundColor;
      if (bgColor) {
        html.setStyle(this.domNode, 'backgroundColor', bgColor);
      }
    },

    _createJimuChart: function() {
      var defOption = this._getDefaultChartOption();
      this.chart = new Chart({
        chartDom: this.gaugeDomNode,
        config: defOption
      });
      this.chart.placeAt(this.gaugeDomNode);
      this.chart.resize();
    },

    _generateValueFormatter: function(valueDisplay) {
      var splitValueObj = this._splitValueObj(this.gaugeValue);
      var max = splitValueObj.max;
      var min = splitValueObj.min;
      var value = splitValueObj.value;

      if (!valueDisplay) {
        return;
      }
      //prefix and suffix -> formatter
      return lang.hitch(this, function(valueDisplay, val) {
        var value, valueText, unit = '',
          decimalPlaces, digitSeparator;
        var dataFormat = valueDisplay.dataFormat;
        if (!dataFormat) {
          return val;
        }
        decimalPlaces = dataFormat.decimalPlaces;
        digitSeparator = dataFormat.digitSeparator;
        if (decimalPlaces || decimalPlaces === 0) {
          decimalPlaces = Number(decimalPlaces);
        }
        //ratio
        if (valueDisplay.isRatio) {
          if (val <= min) {
            value = jimuUtils.convertNumberToPercentage(0, decimalPlaces, digitSeparator);
          } else {
            var base = max - min;
            var v = val - min;
            value = jimuUtils.convertNumberToPercentage(v / base, decimalPlaces, digitSeparator);
          }
        } else { //unit
          if (dataFormat.unit === 'percentage') {
            value = jimuUtils.convertNumberToPercentage(val, decimalPlaces, digitSeparator);
          } else if (dataFormat.unit === 'thousand') {
            unit = this.nls.thousandAbbreviation;
            value = val / 1000;
          } else if (dataFormat.unit === 'million') {
            unit = this.nls.millionAbbreviation;
            value = val / 1.0e+6;
          } else if (dataFormat.unit === 'billion') {
            unit = this.nls.billionAbbreviation;
            value = val / 1.0e+9;
          } else {
            value = val;
          }
        }

        //dataFormat
        //decimalPlaces
        if (!valueDisplay.isRatio && dataFormat.unit !== 'percentage') {
          var fieldInfo = {
            format: {
              places: decimalPlaces,
              digitSeparator: digitSeparator
            }
          };
          value = jimuUtils.localizeNumberByFieldInfo(value, fieldInfo);
        }

        if (unit) {
          value += unit;
        }

        //prefix and suffix
        valueText = value;
        if (dataFormat.prefix) {
          valueText = dataFormat.prefix + ' ' + valueText;
        }
        if (dataFormat.suffix) {
          valueText += ' ' + dataFormat.suffix;
        }

        return valueText;
      }, valueDisplay, value);
    },

    _getVaildDecimalPlaces: function(valueDisplay) {
      if (!valueDisplay) {
        return;
      }
      var decimalPlaces;
      var dataFormat = valueDisplay.dataFormat;
      decimalPlaces = dataFormat && dataFormat.decimalPlaces;
      if (decimalPlaces || decimalPlaces === 0) {
        decimalPlaces = Number(decimalPlaces);
      }

      if (typeof decimalPlaces === 'number') {
        return decimalPlaces;
      }
    },

    _getVaildValueDisplay: function() {
      var config = this.config;
      var display = config && config.display;
      if (!display) {
        return;
      }
      var valueDisplay;
      if (display.currentValue && display.currentValue.state) {
        valueDisplay = display.currentValue;
      } else {
        valueDisplay = lang.clone(this.defValueStyle);
      }
      return valueDisplay;
    },

    _generateTextStyle: function(valueDisplay) {
      var splitValueObj = this._splitValueObj(this.gaugeValue);
      var value = splitValueObj.value;
      var config = this.config;
      var indicatorInfo = this._getIndicatorInfo(config, value, splitValueObj);
      var font = valueDisplay && valueDisplay.font;
      if (!font) {
        return;
      }
      var textStyle = {};

      if (typeof font.fontSize !== 'undefined') {
        textStyle.fontSize = Number(font.fontSize);
      }

      textStyle.color = indicatorInfo.valueColor || font.textColor;

      var fontInfo = font.font;
      if (!fontInfo) {
        return textStyle;
      }

      textStyle.fontWeight = fontInfo.bold ? 'bold' : 'normal';

      if (fontInfo.fontFamily) {
        textStyle.fontFamily = fontInfo.fontFamily;
      }

      textStyle.fontStyle = fontInfo.italic ? 'italic' : 'normal';

      return textStyle;
    },

    _isShowTargetValue: function() {
      var dataLabels = this.config && this.config.display &&
        this.config.display.dataLabels;
      if (!dataLabels) {
        return;
      }
      return !!dataLabels.targetValue;
    },

    _setGaugeDisplay: function(gaugeOption) {
      var config = this.config;
      var display = config.display;
      if (!display) {
        return;
      }
      //gauge color
      if (display.gaugeColor) {
        gaugeOption.columnColor = display.gaugeColor;
      }
      if (display.bgColor) {
        gaugeOption.bgColor = display.bgColor;
      }
      //3.data labels
      if (display.dataLabels && display.dataLabels.state) {
        var dataLabels = display.dataLabels;
        //show data range or not
        gaugeOption.showDataRangeLabel = !!dataLabels.dataRange;
        //show target value or not
        gaugeOption.showTargetValueLabel = !!dataLabels.targetValue;
        //label color
        gaugeOption.labelColor = dataLabels.textColor || '';
      }
    },

    _getValueStyle: function() {
      var valueDisplay = this._getVaildValueDisplay();
      if (!valueDisplay) {
        return;
      }

      var valueStyle = {};
      //set decimalPlaces to valueStyle
      var decimalPlaces = this._getVaildDecimalPlaces(valueDisplay);
      if (typeof decimalPlaces === 'number') {
        valueStyle.decimalPlaces = decimalPlaces;
      }
      //set value formatter to valueStyle
      valueStyle.formatter = this._generateValueFormatter(valueDisplay);
      //set value textStyle to valueStyle
      var textStyle = this._generateTextStyle(valueDisplay);
      if (textStyle) {
        valueStyle.textStyle = textStyle;
      }
      return valueStyle;
    },

    _getDefaultChartOption: function() {
      var option = {
        type: 'gauge',
        confine: true,
        shape: 'curved', //horizontal,vertical,curved
        min: 0,
        max: 100,
        series: [{
          data: [0]
        }]
      };
      if (this.config && this.config.shape) {
        option.shape = this.config.shape;
      }
      option.theme = this.isDarkTheme() ? 'dark' : 'light';

      return option;
    },

    showNodata: function(message) {
      if (this.chart) {
        this.chart.clear();
      }
      html.addClass(this.domNode, 'no-data');
      if (message) {
        this.noDataDiv.innerHTML = message;
      }
    },

    hideNodata: function() {
      html.removeClass(this.domNode, 'no-data');
    }

  });
  return clazz;
});