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
  './BaseDijit',
  'dojo/dom-style',
  'dojo/_base/html',
  'jimu/utils',
  '../utils',
  './clientStatistic',
  './styleUtils'
], function(declare, BaseDijit, domStyle, html, jimuUtils,
  utils, clientStatistic, styleUtils) {
  var clazz = declare([BaseDijit], {
    templateString: '<div style="height:100%;width:100%;"><div data-dojo-attach-point="noDataDiv"' +
      'class="no-data-tip">${nls.noData}</div>' +
      '<a data-dojo-attach-point="numberContent" class="number-content no-trim" target="_blank">' +
      '<div data-dojo-attach-point="leftIcon" class="icon"></div>' +
      '<div data-dojo-attach-point="number" class="number">' +
      '<div data-dojo-attach-point="prefix" class="prefix"></div>' +
      '<div class="value-content" data-dojo-attach-point="valueContent"></div>' +
      '<div data-dojo-attach-point="suffix" class="suffix"></div></div>' +
      '<div data-dojo-attach-point="rightIcon" class="icon"></div>' +
      '</a></div>',
    baseClass: 'infographic-number-dijit',
    type: 'number',
    config: null,

    //public method
    // setConfig();
    // setValue();

    // config:
    // value
    //  indicators:[{iconInfo:{
    //    color:'',
    //    icon:'',
    //    placement:'left'
    //  }}]

    constructor: function(options) {
      this.visible = options.visible;
    },

    postCreate: function() {
      this.inherited(arguments);
      this._features = null;
      this._value = null;
      this._upgradeConfig(this.config);
      this.setConfig(this.config);
      this._updateBackGroundColor();
    },

    _upgradeConfig: function(config) {
      var dataFormat = config && config.dataFormat;
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
      this._value = null;
      this.numberValue = null;
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

    setDataSource: function(dataSource) {
      this.inherited(arguments);
      this.dataSource = dataSource;
    },

    setConfig: function(config) {
      if (config) {
        this.config = config;
      }
    },

    startRendering: function() {
      if (!this._shouldRenderNumber()) {
        return;
      }

      this._updateBackGroundColor();

      this._calculateNumberValue();

      if (typeof this.numberValue !== 'number') {
        this.showNodata();
        return;
      }
      this._renderNumber(this.numberValue);
    },

    //setp 1, calculate gauge value
    _calculateNumberValue: function() {
      var value;
      if (this.inSettingPage) {
        var statistic = utils.getStatisticForNumber(this.config);
        var dataSource = this.dataSource;
        var features = this._features;
        value = clientStatistic.statistic(statistic, dataSource, features);
      } else {
        value = this._value;
      }
      if (typeof value !== 'undefined' && value !== false) {
        this.numberValue = value;
      }
    },

    _renderNumber: function(value) {
      this._cleanNumberContent();
      //init value
      this.valueContent.innerHTML = jimuUtils.localizeNumber(value);

      this._setValueDisplay();
    },

    _setValueDisplay: function() {
      var config = this.config;
      if (!config) {
        return;
      }
      //1.set background
      this._setBackground(config);
      //2.set font
      this._setFont(config);
      //3. set dataFormat
      this._setDataFormat(config);
      //4. set indicator style
      this._setIndicatorStyle();
    },

    //------------tools----------------
    _shouldRenderNumber: function() {
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

    _getIndicatorColor: function() {
      var color = false;
      var icon = false;
      var indicators = this.config.indicators;
      if (indicators) {
        var vaildIndicator = utils.getVaildIndicator(this.numberValue, indicators);
        if (vaildIndicator && vaildIndicator.valueColor) {
          color = vaildIndicator.valueColor;
        }
        if (vaildIndicator && jimuUtils.isNotEmptyObject(vaildIndicator.iconInfo)) {
          icon = vaildIndicator.iconInfo;
        }
      }
      return {
        color: color,
        icon: icon
      };
    },

    _cleanNumberContent: function() {
      html.removeClass(this.leftIcon);
      html.addClass(this.leftIcon, ['icon']);
      html.removeClass(this.rightIcon);
      html.addClass(this.rightIcon, ['icon']);
      if (this.replaceIcon) {
        html.destroy(this.replaceIcon);
        this.replaceIcon = null;
      }
      html.empty(this.valueContent);
      html.empty(this.prefix);
      html.empty(this.suffix);
      this._setValueColor('');
    },

    _updateBackGroundColor: function() {
      var config = this.config;
      var bgColor = config && config.background && config.background.backgroundColor;
      if (bgColor) {
        html.setStyle(this.domNode, 'backgroundColor', bgColor);
      }
    },

    _setBackground: function(config) {
      var background = config && config.background;
      if (!background) {
        return;
      }

      //1.background color
      if (background.backgroundColor) {
        html.setStyle(this.domNode, 'backgroundColor', background.backgroundColor);
      }
      //2.alignment
      var alignment = background.alignment;
      if (alignment) {
        html.removeClass(this.domNode);
        html.addClass(this.domNode, 'infographic-number-dijit');
        if (alignment.horizontal) {
          html.addClass(this.domNode, 'horizontal-' + alignment.horizontal);
        }
        if (alignment.vertical) {
          html.addClass(this.domNode, 'vertical-' + alignment.vertical);
        }
      }
      //3.link
      if (background.link) {
        html.setAttr(this.numberContent, "href", background.link);
      } else {
        html.removeAttr(this.numberContent, "href");
      }
    },

    _setFont: function(config) {
      if (!config || !config.font) {
        return;
      }
      var style = {};
      styleUtils.font.setStyle(config.font, style);
      html.setStyle(this.number, style);
    },

    _setDataFormat: function(config) {
      var value, unit = '',
        decimalPlaces, digitSeparator;
      value = this.numberValue;
      var dataFormat = config.dataFormat;
      if (!dataFormat) {
        return;
      }

      decimalPlaces = dataFormat.decimalPlaces;
      digitSeparator = dataFormat.digitSeparator;
      if (decimalPlaces) {
        decimalPlaces = Number(decimalPlaces);
      }

      //1.Unit and decimal places
      if (dataFormat.unit === 'percentage') {
        value = jimuUtils.convertNumberToPercentage(value, decimalPlaces, digitSeparator);
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
      //decimalPlaces
      if (dataFormat.unit !== 'percentage') {
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

      this.valueContent.innerHTML = value;
      //2. prefix and suffix
      if (dataFormat.prefix) {
        this.prefix.innerHTML = dataFormat.prefix;
      }
      if (dataFormat.suffix) {
        this.suffix.innerHTML = dataFormat.suffix;
      }
    },

    _setIndicatorStyle: function() {
      var indicatorInfo = this._getIndicatorColor();
      //set value color
      if (indicatorInfo.color) {
        this._setValueColor(indicatorInfo.color);
      }
      //5. set icon
      if (indicatorInfo.icon) {
        this._setIndicatorIcon(indicatorInfo.icon);
      }
    },

    _setValueColor: function(color) {
      domStyle.set(this.number, "color", color);
    },

    _setIndicatorIcon: function(iconInfo) {
      if (!iconInfo) {
        return;
      }
      if (iconInfo.placement === 'left' || iconInfo.placement === 'right') {
        this._setLeftRightIcon(iconInfo);
      } else if (iconInfo.placement === 'replace') {
        this._setReplaceIcon(iconInfo);
      }
    },

    _setReplaceIcon: function(iconInfo) {
      var iconDom = html.create('div', {
        'class': 'indicator-icon ' + iconInfo.icon
      });
      html.empty(this.valueContent);
      html.place(iconDom, this.valueContent);
      domStyle.set(iconDom, 'color', iconInfo.color);
      domStyle.set(iconDom, 'display', 'inline-flex');
    },

    _setLeftRightIcon: function(iconInfo) {
      var iconDom;
      if (iconInfo.placement === 'left') {
        iconDom = this.leftIcon;
      } else if (iconInfo.placement === 'right') {
        iconDom = this.rightIcon;
      }

      html.addClass(iconDom, 'indicator-icon ' + iconInfo.icon);
      domStyle.set(iconDom, 'color', iconInfo.color);
    },

    showNodata: function(message) {
      this._cleanNumberContent();
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