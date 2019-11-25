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
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/_base/Color',
    'dojo/on',
    './BaseDijitSetting',
    'dojo/text!./GaugeDijitSetting.html',
    "./_dijits/FontSetting",
    "./_dijits/DataFormatSetting",
    './_dijits/NumberIndicator/MultipleIndicators',
    './_dijits/ValueProvider/RangeProvider',
    './_dijits/ValueProvider/ValueProvider',
    './_dijits/TogglePocket',
    'jimu/dijit/TabContainer3',
    'jimu/dijit/ColorPickerPopup',
    'jimu/utils',
    'jimu/dijit/Message',
    '../utils',
    'dijit/TitlePane'
  ],
  function(declare, _WidgetsInTemplateMixin, lang, html, Color, on, BaseDijitSetting,
    template, FontSetting, DataFormatSetting, MultipleIndicators, RangeProvider, ValueProvider,
    TogglePocket, TabContainer3, ColorPickerPopup, jimuUtils, Message, utils) {
    var clazz = declare([BaseDijitSetting, _WidgetsInTemplateMixin], {
      templateString: template,
      baseClass: 'infographic-gauge-dijit-setting',
      type: 'gauge',

      //config:
      //  shape:"",//horizontal,vertical,curved
      //  statistics:[
      //  {
      //    type: 'value' | 'range',
      //    config:{}
      //  }]
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
        this._ignoreEvent();
        this.shape = this.config && this.config.shape;
        this._init();
        this._careEvent();
      },

      setDataSource: function(dataSource) {
        this.dataSource = dataSource;
      },

      setLayerDefinition: function(definition) {
        if (definition) {
          definition = utils.preProcessDefinition(definition);
          this.definition = definition;
        }
        if (this.mainValue) {
          this.mainValue.setLayerDefinition(this.definition);
        }
      },

      setLayerObject: function(layerObject) {
        if (layerObject) {
          this.layerObject = layerObject;
        }
      },

      reset: function() {
        this.dataSource = null;
        this.definition = null;
        this.rangeDefinition1 = null;
        this.rangeDefinition2 = null;
        this.config = null;
        if (this.mainValue) {
          this.mainValue.reset();
        }
        if (this.range1) {
          this.range1.reset();
        }
        if (this.range2) {
          this.range2.reset();
        }
      },

      _getStatistics: function() {
        if (!this.mainValue || !this.range1 || !this.range2) {
          return;
        }
        var value = this.mainValue.getConfig();
        var range1 = this.range1.getConfig();
        var range2 = this.range2.getConfig();

        return [{
          type: 'value',
          config: value
        }, {
          type: 'range',
          name: 'range1',
          config: range1
        }, {
          type: 'range',
          name: 'range2',
          config: range2
        }];

      },

      _ignoreEvent: function() {
        this._ignoreEvents = true;
      },

      _careEvent: function() {
        setTimeout(function() {
          this._ignoreEvents = false;
        }.bind(this), 200);
      },

      getConfig: function(check) {
        if (!this.isValid(check)) {
          this.config = {};
          return false;
        }
        var config = {
          shape: this.shape
        };

        var statistics = this._getStatistics();
        config.statistics = statistics;

        var indicators = this.indicators.getConfig();
        config.indicators = indicators;

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
        var format = {
          digitSeparator: html.hasClass(this.separatorSwitch, 'toggle-on')
        };
        dataLabels.dataFormat = format;
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

      _setStatistics: function(statitics) {
        if (!statitics || !statitics.length) {
          return;
        }
        statitics.forEach(function(stat) {
          if (stat.type === 'value') {
            if (this.mainValue) {
              this.mainValue.setConfig(stat.config);
            }
          } else if (stat.name === 'range1') {
            if (this.range1) {
              this.range1.setConfig(stat.config);
            }
          } else if (stat.name === 'range2') {
            if (this.range2) {
              this.range2.setConfig(stat.config);
            }
          }
        }.bind(this));
      },

      setConfig: function(config) {
        this._ignoreEvent();
        this.config = config;
        if (!this.config) {
          return;
        }
        var statistics = config.statistics;
        this._setStatistics(statistics);
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
          var digitSeparator = dataLabels.dataFormat && dataLabels.dataFormat.digitSeparator;
          this._handleToggleBtn(this.separatorSwitch, !!digitSeparator);
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
        this._careEvent();
      },

      _onSettingsChange: function() {
        if (!this._ignoreEvents && this.domNode) {
          this.getConfig();
          this.updateDijit();
        }
      },

      _setRangeFeaturesToDijit: function(features, type) {
        if (this.dijit) {
          this.dijit.setRangeFeatures(features, type);
          this.dijit.startRendering();
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
        if (this.indicators) {
          this.indicators.destroy();
          this.indicators = null;
        }
        this.inherited(arguments);
      },

      isValid: function(check) {
        //indicators
        var indicators = this.indicators.getConfig(check);
        if (!indicators && check) {
          this.tab.selectTab(this.nls.indicators);
          new Message({
            message: this.nls.setCorrectyIndicatorTip
          });
          return false;
        }

        if (!this.mainValue.isValid() || !this.range1.isValid() ||
          !this.range2.isValid()) {
          return false;
        }

        if (!this.fontSetting.isValid() || !this.dataFormatSetting.isValid()) {
          return false;
        }

        return true;
      },

      //---------------tools-----------------
      _init: function() {
        this._initTabs();
        this._initValueProvider();
        this._initDisplay();
        this._initIndicators();
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

      _initValueProvider: function() {
        this.mainValue = new ValueProvider({
          nls: this.nls,
          titleText: this.nls.displayValue
        });
        this.mainValue.placeAt(this.valueContainer);

        this.own(on(this.mainValue, 'change', lang.hitch(this, function(config) {
          this._handleDePlacesForMainValue(config);
          this._onSettingsChange();
        })));
        this.range1 = new RangeProvider({
          nls: this.nls,
          appConfig: this.appConfig,
          titleText: this.nls.min
        });
        this.range1.placeAt(this.minContainer);

        this.own(on(this.range1, 'change', lang.hitch(this, function() {
          this._onSettingsChange();
        })));
        this.own(on(this.range1, 'ds-change', lang.hitch(this, function(frameWorkDsId) {
          this._onRangeDataSourceChanged(frameWorkDsId, 'range1');
        })));

        this.range2 = new RangeProvider({
          nls: this.nls,
          appConfig: this.appConfig,
          titleText: this.nls.max
        });
        this.range2.placeAt(this.maxContainer);

        this.own(on(this.range2, 'change', lang.hitch(this, function() {
          this._onSettingsChange();
        })));
        this.own(on(this.range2, 'ds-change', lang.hitch(this, function(frameWorkDsId) {
          this._onRangeDataSourceChanged(frameWorkDsId, 'range2');
        })));
      },

      _onRangeDataSourceChanged: function(id, type) {
        if (!this.igUtils) {
          return;
        }
        this.updateFetchState(type, 'loading');
        this.igUtils.getFeaturesForFrameDS(id).then(function(featureSet) {
          this.updateFetchState(type, 'loaded');
          var features = featureSet.features;
          this._setRangeFeaturesToDijit(features, type);
        }.bind(this), function(error) {
          this.updateFetchState(type, 'error');
          this._setRangeFeaturesToDijit(null, type);
          console.error(error);
        }.bind(this));
      },

      updateFetchState: function(rangeType, type) {
        if (rangeType === 'range1' && this.range1) {
          this.range1.updateFetchState(type);
        }
        if (rangeType === 'range2' && this.range2) {
          this.range2.updateFetchState(type);
        }
      },

      _handleDePlacesForMainValue: function(config) {
        var statConfig = config && config.value;
        if (!statConfig) {
          return;
        }

        var dataFormatSetting = this.dataFormatSetting.getConfig();
        var decimalPlaces = dataFormatSetting.decimalPlaces;
        //if calc feature counts, the number of decimal places is preferably 0
        if (statConfig.type === 'count') {
          if (typeof decimalPlaces !== 'number' || decimalPlaces === 2) {
            dataFormatSetting.decimalPlaces = 0;
          }
          //if calc feature stat value, the number of decimal places is preferably 2
        } else if (typeof decimalPlaces !== 'number' || decimalPlaces === 0) {
          dataFormatSetting.decimalPlaces = 2;
        }
        this.dataFormatSetting.setConfig(dataFormatSetting);
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

      _initEvent: function() {
        this.own(on(this.dataRangeSwitch, 'click', lang.hitch(this, function() {
          this._handleToggleBtn(this.dataRangeSwitch, !html.hasClass(this.dataRangeSwitch, 'toggle-on'));
        })));
        this.own(on(this.targetValueSwitch, 'click', lang.hitch(this, function() {
          this._handleToggleBtn(this.targetValueSwitch, !html.hasClass(this.targetValueSwitch, 'toggle-on'));
        })));
        this.own(on(this.separatorSwitch, 'click', lang.hitch(this, function() {
          this._handleToggleBtn(this.separatorSwitch, !html.hasClass(this.separatorSwitch, 'toggle-on'));
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