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
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/_base/Color',
    'dojo/on',
    './BaseDijitSetting',
    'dojo/text!./GaugeDijitSetting.html',
    './_dijits/SingleNumberStatistics',
    "./_dijits/FontSetting",
    "./_dijits/DataFormatSetting",
    './_dijits/NumberIndicator/MultipleIndicators',
    './_dijits/TogglePocket',
    'jimu/dijit/TabContainer3',
    'jimu/dijit/ColorPickerPopup',
    'jimu/utils',
    'jimu/dijit/Message',
    'dijit/TitlePane'
  ],
  function(declare, _WidgetsInTemplateMixin, lang, html, Color, on, BaseDijitSetting,
    template, SingleNumberStatistics, FontSetting, DataFormatSetting, MultipleIndicators,
    TogglePocket, TabContainer3, ColorPickerPopup, jimuUtils, Message) {
    var clazz = declare([BaseDijitSetting, _WidgetsInTemplateMixin], {
      templateString: template,
      baseClass: 'infographic-gauge-dijit-setting',
      type: 'gauge',

      //config:
      //  shape:"",//horizontal,vertical,curved
      //  max:number
      //  min:number,
      //  indicators:[],
      //  display:
      //    backgroundColor
      //    gaugeColor
      //    bgColor
      //    dataRange
      //    targetValue
      //    currentValue

      postMixInProperties: function() {
        lang.mixin(this.nls, window.jimuNls.common);
      },

      postCreate: function() {
        this.inherited(arguments);
        this.shape = this.config && this.config.shape;
        this._init();
        this.setConfig(this.config);
        this._hasLoaded = true;
      },

      setDataSource: function(dataSource) {
        this.dataSource = dataSource;
        if (this.singleNumberStatistics) {
          this.singleNumberStatistics.setDataSource(dataSource);
        }
      },

      setLayerDefinition: function(definition) {
        if (definition) {
          this.definition = definition;
        }
      },

      getConfig: function(check) {
        if (!this.isValid(check)) {
          return false;
        }
        var config = {
          shape: this.shape
        };

        var max = this.dataRangeMax.getValue();
        var min = this.dataRangeMin.getValue();
        config.min = Number(min);
        config.max = Number(max);

        var indicators = this.indicators.getConfig();
        config.indicators = indicators;

        //single number statistic
        config.statistic = this.singleNumberStatistics.getConfig();

        //display
        var display = {};
        //1.background color
        if (this.backgroundColorPicker) {
          display.backgroundColor = this.backgroundColorPicker.getColor().toHex();
        }
        //2.gauge color
        if (this.frontColorPicker) {
          display.gaugeColor = this.frontColorPicker.getColor().toHex();
        }

        //3.gauge bg color
        if (this.backColorPicker) {
          display.bgColor = this.backColorPicker.getColor().toHex();
        }

        //4.data range,target value, color and show
        var dataLabels = {};
        dataLabels.state = this.dataLabelsTogglePocket.getState();
        if (this.dataLabelsColorPicker) {
          dataLabels.textColor = this.dataLabelsColorPicker.getColor().toHex();
        }

        dataLabels.dataRange = html.hasClass(this.dataRangeSwitch, 'toggle-on');
        dataLabels.targetValue = html.hasClass(this.targetValueSwitch, 'toggle-on');

        display.dataLabels = dataLabels;

        //5.current value
        var currentValue = {};

        currentValue.state = this.currentValueTogglePocket.getState();

        //01.display value in
        currentValue.isRatio = !!this.ratioBtn.checked;

        //02.font
        if (this.fontSetting) {
          currentValue.font = this.fontSetting.getConfig();
        }

        //03. data format
        if (this.dataFormatSetting) {
          currentValue.dataFormat = this.dataFormatSetting.getConfig();
        }
        display.currentValue = currentValue;

        config.display = display;
        this.config = config;
        return this.config;
      },

      setConfig: function(config) {
        this.config = config;
        if (!this.config) {
          return;
        }
        //single number statistics
        this.singleNumberStatistics.setConfig(this.config.statistic);
        //max min
        this.dataRangeMin.setValue(this.config.min);
        this.dataRangeMax.setValue(this.config.max);
        // indicator
        this.indicators.setConfig(this.config);
        //display
        var display = this.config.display;
        if (!display) {
          return;
        }
        //1.background color
        if (display.backgroundColor) {
          this.backgroundColorPicker.setColor(new Color(display.backgroundColor));
        }
        //2.gauge color
        if (display.gaugeColor) {
          this.frontColorPicker.setColor(new Color(display.gaugeColor));
        }
        //3.gauge bg color
        if (display.bgColor) {
          this.backColorPicker.setColor(new Color(display.bgColor));
        }
        //4.data labels
        var dataLabels = display.dataLabels;
        if (dataLabels) {
          if (dataLabels.textColor) {
            this.dataLabelsColorPicker.setColor(new Color(dataLabels.textColor));
          }
          this._handleToggleBtn(this.dataRangeSwitch, !!dataLabels.dataRange);
          this._handleToggleBtn(this.targetValueSwitch, !!dataLabels.targetValue);
          this.dataLabelsTogglePocket.setState(dataLabels.state);
        }
        //5.current value
        var currentValue = display.currentValue;
        if (currentValue) {
          var isRatio = currentValue.isRatio;

          this.ratioBtn.setChecked(isRatio);
          this.trueValueBtn.setChecked(!isRatio);

          if (currentValue.dataFormat) {
            this.dataFormatSetting.setConfig(currentValue.dataFormat);
          }
          if (currentValue.font) {
            this.fontSetting.setConfig(currentValue.font);
          }
          this.currentValueTogglePocket.setState(currentValue.state);
        }
      },

      _onSettingsChange: function() {
        if (this._hasLoaded && this.domNode) {
          this.getConfig();
          this.updateDijit();

        }
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

      destroy: function() {
        if (this.singleNumberStatistics) {
          this.singleNumberStatistics.destroy();
          this.singleNumberStatistics = null;
        }
        if (this.indicators) {
          this.indicators.destroy();
          this.indicators = null;
        }
        this.inherited(arguments);
      },

      isValid: function(check) {
        //max min
        var max = this.dataRangeMax.getValue();
        var min = this.dataRangeMin.getValue();
        var statistic = this.singleNumberStatistics.getConfig();

        if (!statistic || min === '' || max === '') {
          return false;
        }
        //indicators
        var indicators = this.indicators.getConfig(check);
        if (!indicators && check) {
          this.tab.selectTab(this.nls.indicators);
          new Message({
            message: this.nls.setCorrectyIndicatorTip
          });
          return false;
        }

        if (!this.fontSetting.isValid() || !this.dataFormatSetting.isValid() ||
          !this.dataRangeMin.isValid() || !this.dataRangeMax.isValid() ||
          !this.singleNumberStatistics.isValid()) {
          return false;
        }

        return true;
      },

      //---------------tools-----------------
      _init: function() {
        this._initTabs();
        this._initDisplay();
        this._initIndicators();
        this._initSingNumberStatistics();
        this._initEvent();
      },

      _initTabs: function() {
        //init tab3
        var tabData = {
          title: this.nls.data,
          content: this.dataTab
        };

        var tabDisplay = {
          title: this.nls.display,
          content: this.display
        };

        var tabIndicator = {
          title: this.nls.indicators,
          content: this.indicatorsDiv
        };

        var tabs = [tabData, tabDisplay, tabIndicator];

        this.tab = new TabContainer3({
          average: true,
          tabs: tabs
        }, this.tabNode);
      },

      _initToggle: function() {
        //data range
        this.dataLabelsTogglePocket = new TogglePocket({
          titleLabel: this.nls.dataLabels,
          content: this.dataLabelsSettingNode
        });
        this.dataLabelsTogglePocket.placeAt(this.dataLabelsToggle);
        this.dataLabelsTogglePocket.startup();
        this.dataLabelsTogglePocket.setState(true);
        this.own(on(this.dataLabelsTogglePocket, 'change', lang.hitch(this, function() {
          this._onSettingsChange();
        })));
        //current value
        this.currentValueTogglePocket = new TogglePocket({
          titleLabel: this.nls.currentValue,
          content: this.currentValueSettingNode
        });
        this.currentValueTogglePocket.placeAt(this.currentValueToggle);
        this.currentValueTogglePocket.startup();
        this.currentValueTogglePocket.setState(true);
        this.own(on(this.currentValueTogglePocket, 'change', lang.hitch(this, function() {
          this._onSettingsChange();
        })));
      },

      _initDisplay: function() {
        //1.init toggle-pocket
        this._initToggle();
        //2.background color
        this.backgroundColorPicker = this._createColorPicker(this.backgroundColorPickerDiv, '#FFFFFF');
        this.own(on(this.backgroundColorPicker, 'change', lang.hitch(this, function() {
          this.backgroundColorPicker.hideTooltipDialog();
          this._onSettingsChange();
        })));
        //3.gauge front color
        this.frontColorPicker = this._createColorPicker(this.frontColorPickerDiv, '#49B4CB');
        this.own(on(this.frontColorPicker, 'change', lang.hitch(this, function() {
          this.frontColorPicker.hideTooltipDialog();
          this._onSettingsChange();
        })));
        //4.gauge bg color
        var gbgColor = this.config && this.config.display && this.config.display.bgColor;
        gbgColor = gbgColor || '#E5E5E5';
        this.backColorPicker = this._createColorPicker(this.backColorPickerDiv, gbgColor);
        this.own(on(this.backColorPicker, 'change', lang.hitch(this, function() {
          this.backColorPicker.hideTooltipDialog();
          this._onSettingsChange();
        })));
        //5.data labels color
        this.dataLabelsColorPicker = this._createColorPicker(this.dataLabelsColorPickerNode, '#000001');
        this.own(on(this.dataLabelsColorPicker, 'change', lang.hitch(this, function() {
          this._onSettingsChange();
        })));
        //6. current value data format setting
        this.dataFormatSetting = new DataFormatSetting({
          nls: this.nls
        });
        this.dataFormatSetting.placeAt(this.dataFormatSettingNode);
        this.dataFormatSetting.startup();
        this.own(on(this.dataFormatSetting, 'change', lang.hitch(this, function( /*config*/ ) {
          this._onSettingsChange();
        })));
        //7. current value font setting
        this.fontSetting = new FontSetting({
          appearance: {
            underline: false
          },
          nls: this.nls
        });
        this.fontSetting.placeAt(this.fontSettingNode);
        this.fontSetting.startup();
        this.own(on(this.fontSetting, 'change', lang.hitch(this, function( /*config*/ ) {
          this._onSettingsChange();
        })));
      },

      _createColorPicker: function(domNode, color) {
        var colorPicker = new ColorPickerPopup({
          appearance: {
            showTransparent: false,
            showColorPalette: true,
            showCoustom: true,
            showCoustomRecord: true
          }
        });
        colorPicker.placeAt(domNode);
        colorPicker.startup();
        colorPicker.setColor(new Color(color));
        return colorPicker;
      },

      _initIndicators: function() {
        this.indicators = new MultipleIndicators({
          type: 'gauge',
          nls: this.nls,
          folderUrl: this.folderUrl
        });
        this.indicators.placeAt(this.indicatorsDiv);
        this.indicators.startup();
        this.own(on(this.indicators, 'change', lang.hitch(this, function() {
          this._onSettingsChange();
        })));
      },

      _initSingNumberStatistics: function() {
        this.singleNumberStatistics = new SingleNumberStatistics({
          config: this.config.statistic,
          dataSource: this.dataSource,
          nls: this.nls
        });
        this.singleNumberStatistics.placeAt(this.singleNumberStatisticsDiv);
        this.singleNumberStatistics.startup();
        this.own(on(this.singleNumberStatistics, 'change', lang.hitch(this, function(snConfig) {
          this._handleDePlacesForSNStat(snConfig);
          this._onSettingsChange();
        })));
      },

      _handleDePlacesForSNStat: function(snConfig) {
        var dataFormatSetting = this.dataFormatSetting.getConfig();
        var decimalPlaces = dataFormatSetting.decimalPlaces;
        //if calc feature counts, the number of decimal places is preferably 0
        if (snConfig && snConfig.type === 'Features') {
          if (typeof decimalPlaces !== 'number' || decimalPlaces === 2) {
            dataFormatSetting.decimalPlaces = 0;
          }
          //if calc feature stat value, the number of decimal places is preferably 2
        } else if (snConfig && snConfig.type === 'FeatureStatistics') {
          if (typeof decimalPlaces !== 'number' || decimalPlaces === 0) {
            dataFormatSetting.decimalPlaces = 2;
          }
        }
        this.dataFormatSetting.setConfig(dataFormatSetting);
      },

      _initEvent: function() {
        this.own(on(this.dataRangeSwitch, 'click', lang.hitch(this, function() {
          this._handleToggleBtn(this.dataRangeSwitch, !html.hasClass(this.dataRangeSwitch, 'toggle-on'));
        })));
        this.own(on(this.targetValueSwitch, 'click', lang.hitch(this, function() {
          this._handleToggleBtn(this.targetValueSwitch, !html.hasClass(this.targetValueSwitch, 'toggle-on'));
        })));
      },

      _handleToggleBtn: function(dom, state) {
        if (state) {
          html.removeClass(dom, 'toggle-off');
          html.addClass(dom, 'toggle-on');
        } else {
          html.removeClass(dom, 'toggle-on');
          html.addClass(dom, 'toggle-off');
        }
        this._onSettingsChange();
      },

      //-----------on changed event---------

      _onDisplayInChange: function(value) {
        if (value === 'ratio') {
          this.dataFormatSetting.setConfig({
            unit: 'percentage'
          });
          this.dataFormatSetting.disableItem('unit');
        } else {
          this.dataFormatSetting.setConfig({
            unit: 'none'
          });
          this.dataFormatSetting.enableItem('unit');
        }
        this._onSettingsChange();
      },

      _onDiaplayInRatio: function(value) {
        if (value) {
          this._onDisplayInChange('ratio');
        }
      },

      _onDisplayInTrueValue: function(value) {
        if (value) {
          this._onDisplayInChange('trueValue');
        }
      }

    });
    return clazz;
  });