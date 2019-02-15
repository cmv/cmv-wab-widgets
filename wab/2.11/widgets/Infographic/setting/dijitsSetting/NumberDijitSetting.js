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
    'dojo/text!./NumberDijitSetting.html',
    './BaseDijitSetting',
    'dijit/_TemplatedMixin',
    './_dijits/NumberIndicator/MultipleIndicators',
    './_dijits/ValueProvider/ValueProvider',
    "./_dijits/BackgroundSetting",
    "./_dijits/FontSetting",
    "./_dijits/DataFormatSetting",
    'dojo/_base/lang',
    'dojo/on',
    'jimu/dijit/TabContainer3',
    'jimu/dijit/Message',
    '../utils',
    'dijit/TitlePane'
  ],
  function(declare, _WidgetsInTemplateMixin, template, BaseDijitSetting, _TemplatedMixin,
    MultipleIndicators, ValueProvider, BackgroundSetting, FontSetting, DataFormatSetting,
    lang, on, TabContainer3, Message, utils) {
    var clazz = declare([BaseDijitSetting, _WidgetsInTemplateMixin, _TemplatedMixin], {
      templateString: template,
      baseClass: 'infographic-number-dijit-setting',
      type: 'number',

      //config:
      //  indicators:[],
      //  statistic:{},
      //  background:{},
      //  font:{},
      //  dataFormat:{},

      postMixInProperties: function() {
        lang.mixin(this.nls, window.jimuNls.common);
      },

      postCreate: function() {
        this.inherited(arguments);
        this._ignoreEvent();
        this._init();
        this._careEvent();
      },

      getConfig: function(check) {
        if (!this.config) {
          this.config = {};
        }

        if (this.isValid(check)) {
          this.config.indicators = this.indicators.getConfig();
          //display
          if (this.backgroundSetting) {
            this.config.background = this.backgroundSetting.getConfig();
          }
          if (this.fontSetting) {
            this.config.font = this.fontSetting.getConfig();
          }
          if (this.dataFormatSetting) {
            this.config.dataFormat = this.dataFormatSetting.getConfig();
          }
          if (this.valueProvider) {
            var statistic = this.valueProvider.getConfig();
            var statistics = [{
              type: 'value',
              config: statistic
            }];
            this.config.statistics = statistics;
          }

          return this.config;
        } else {
          return false; //error
        }
      },

      setLayerDefinition: function(definition) {
        if (definition) {
          definition = utils.preProcessDefinition(definition);
          this.definition = definition;
        }
        if (this.valueProvider) {
          this.valueProvider.setLayerDefinition(this.definition);
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
        this.config = null;
        if (this.valueProvider) {
          this.valueProvider.reset();
        }
      },

      setConfig: function(config) {
        this._ignoreEvent();
        this.config = config;
        if (!this.config) {
          return;
        }
        this.indicators.setConfig(this.config);
        var statistics = this.config.statistics;
        if (statistics && statistics.length) {
          this.valueProvider.setConfig(statistics[0].config);
        }

        //display
        if (this.config.background) {
          this.backgroundSetting.setConfig(this.config.background);
        }

        if (this.config.font) {
          this.fontSetting.setConfig(this.config.font);
        }

        if (this.config.dataFormat) {
          this.dataFormatSetting.setConfig(this.config.dataFormat);
        }
        this._careEvent();
      },

      updateDijit: function() {
        if (!this.dijit) {
          return;
        }
        this.dijit.setConfig(this.config);
        this.dijit.startRendering();
      },

      _onSettingsChange: function() {
        if (!this._ignoreEvents && this.domNode) {
          this.getConfig();
          this.updateDijit();
        }
      },

      setDataSource: function(dataSource) {
        this.inherited(arguments);
        this.dataSource = dataSource;
      },

      destroy: function() {
        if (this.indicators) {
          this.indicators.destroy();
          this.indicators = null;
        }
        if (this.valueProvider) {
          this.valueProvider.destroy();
          this.valueProvider = null;
        }
        this.inherited(arguments);
      },

      isValid: function(check) {
        var indicators = this.indicators.getConfig(check);
        if (!indicators && check) {
          this.tab.selectTab(this.nls.indicators);
          new Message({
            message: this.nls.setCorrectyIndicatorTip
          });
          return false;
        }
        return this.backgroundSetting.isValid() && this.fontSetting.isValid() &&
          this.dataFormatSetting.isValid() && this.valueProvider.isValid();
      },

      //------------ init-----------------
      _init: function() {
        this._initTabs();
        this._initIndicators();
        this._initValueProvider();
        this._initDisplay();
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

      _initDisplay: function() {
        //2. background
        this.backgroundSetting = new BackgroundSetting({
          nls: this.nls
        });
        this.backgroundSetting.placeAt(this.backgroundSettingNode);
        this.backgroundSetting.startup();
        this.own(on(this.backgroundSetting, 'change', lang.hitch(this, function( /*config*/ ) {
          this._onSettingsChange();
        })));
        //3. font
        this.fontSetting = new FontSetting({
          nls: this.nls
        });
        this.fontSetting.placeAt(this.fontSettingNode);
        this.fontSetting.startup();
        this.own(on(this.fontSetting, 'change', lang.hitch(this, function( /*config*/ ) {
          this._onSettingsChange();
        })));
        //4. dataFormatSettingNode
        this.dataFormatSetting = new DataFormatSetting({
          nls: this.nls
        });
        this.dataFormatSetting.placeAt(this.dataFormatSettingNode);
        this.dataFormatSetting.startup();
        this.own(on(this.dataFormatSetting, 'change', lang.hitch(this, function( /*config*/ ) {
          this._onSettingsChange();
        })));
      },

      _initValueProvider: function() {
        this.valueProvider = new ValueProvider({
          nls: this.nls,
          titleText: this.nls.displayValue
        });
        this.valueProvider.placeAt(this.dataTab);
        this.valueProvider.startup();
        this.own(on(this.valueProvider, 'change', lang.hitch(this, function(snConfig) {
          this._handleDePlacesForMainValue(snConfig);
          this._onSettingsChange();
        })));
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

      _initIndicators: function() {
        this.indicators = new MultipleIndicators({
          nls: this.nls,
          type: 'number',
          folderUrl: this.folderUrl
        });
        this.indicators.placeAt(this.indicatorsDiv);
        this.indicators.startup();
        this.own(on(this.indicators, 'change', lang.hitch(this, function( /*config*/ ) {
          this._onSettingsChange();
        })));
      },

      _ignoreEvent: function() {
        this._ignoreEvents = true;
      },

      _careEvent: function() {
        setTimeout(function() {
          this._ignoreEvents = false;
        }.bind(this), 200);
      }

    });
    return clazz;
  });