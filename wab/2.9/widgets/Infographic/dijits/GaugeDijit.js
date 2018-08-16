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
  '../utils'
], function(declare, lang, html, BaseDijit, jimuUtils, Chart, utils) {
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
      this.visible = options.visible;
    },

    postCreate: function() {
      this.inherited(arguments);

      this._features = [];
      this.setConfig(this.config);
      this._updateBackGroundColor();
    },

    setLayerInfo: function() {},

    setVisible: function(visible) {
      this.visible = visible;
    },

    onDataSourceDataUpdate: function(value) {
      if (this.inSettingPage) {
        if (value && typeof value.features !== 'undefined') {
          this._features = utils.cleanFeatures(value.features);
        }
      } else if (typeof value === 'number') {
        this._value = value;
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

      this._calculateGaugeValue();

      if (typeof this.gaugeValue !== 'number') {
        this.showNodata();
        return;
      }

      var option = this._createChartOption();
      this.chart.updateConfig(option);
    },

    //setp 1, calculate gauge value
    _calculateGaugeValue: function() {
      var value;
      if (this.inSettingPage) {
        var statistic = this.config && this.config.statistic;
        var dataSource = this.dataSource;
        var features = this._features;
        value = utils.getValueFromFeatures(statistic, dataSource, features);
      } else {
        value = this._value;
      }
      if (typeof value !== 'undefined' && value !== false) {
        this.gaugeValue = value;
      }
    },

    //setp 2, create gauge option
    _createChartOption: function() {
      var config = this.config;
      var option = {
        series: [{
          data: [this.gaugeValue]
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
      var min = config.min || 0;
      var max = config.max || 1000;
      option.max = max;
      option.min = min;
      return option;
    },

    _createGaugeOption: function() {
      var value = this.gaugeValue;
      var config = this.config;
      var gaugeOption = {};

      //assignee valueStyle
      var valueStyle = this._getValueStyle();
      if (valueStyle) {
        gaugeOption.valueStyle = valueStyle;
      }

      this._setGaugeDisplay(gaugeOption);

      //indicator color
      var indicatorInfo = this._getIndicatorInfo(config, value);

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
    _getIndicatorInfo: function(config, value) {
      var targetValue = false,
        columnColor = false,
        valueColor = false;
      //1.target values
      var values = this._getIndicatorValues(config);
      if (jimuUtils.isNotEmptyObject(values, true)) {
        targetValue = values;
      }
      //2.value color column color
      var indicators = config.indicators;
      if (indicators) {
        var vaildIndicator = utils.getVaildIndicator(value, indicators, config.max);
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

    _getIndicatorValues: function(config) {
      var values = [];
      if (config.indicators) {
        var indicators = config.indicators;
        indicators.forEach(function(item) {
          if (item.value) {
            item.value.forEach(lang.hitch(this, function(val) {
              values.push(!!item.isRatio ? config.max * (val / 100) : val);
            }));
          }
        });
        values.sort(function(value1, value2) {
          return value1 - value2;
        });
        values = jimuUtils.uniqueArray(values);
      }
      return values;
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
        basicRequire = this.domNode &&
          this._features;
      } else {
        basicRequire = this.domNode && typeof this._value === 'number';
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
      var config = this.config;
      var value = this.gaugeValue;
      var max = config.max || 1000;

      if (!valueDisplay) {
        return;
      }
      //prefix and suffix -> formatter
      return lang.hitch(this, function(valueDisplay, val) {
        var value, valueText, unit = '',
          decimalPlaces;
        var dataFormat = valueDisplay.dataFormat;
        if (!dataFormat) {
          return val;
        }
        decimalPlaces = dataFormat.decimalPlaces;
        if (decimalPlaces || decimalPlaces === 0) {
          decimalPlaces = Number(decimalPlaces);
        }
        //ratio
        value = valueDisplay.isRatio ? jimuUtils.convertNumberToPercentage(val / max, decimalPlaces) : val;

        //dataFormat
        //
        //unit
        if (!valueDisplay.isRatio) {
          if (dataFormat.unit === 'percentage') {
            value = jimuUtils.convertNumberToPercentage(val, decimalPlaces);
          } else if (dataFormat.unit === 'thousand') {
            unit = this.nls.thousandAbbreviation;
            value = value / 1000;
          } else if (dataFormat.unit === 'million') {
            unit = this.nls.millionAbbreviation;
            value = value / 1.0e+6;
          } else if (dataFormat.unit === 'billion') {
            unit = this.nls.billionAbbreviation;
            value = value / 1.0e+9;
          }
        }

        //decimalPlaces
        if (!valueDisplay.isRatio && dataFormat.unit !== 'percentage' && typeof decimalPlaces === 'number') {
          value = value.toFixed(decimalPlaces);
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
      var value = this.gaugeValue;
      var config = this.config;
      var indicatorInfo = this._getIndicatorInfo(config, value);
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