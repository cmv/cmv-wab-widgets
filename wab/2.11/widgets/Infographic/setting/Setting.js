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
    'dojo/Deferred',
    'dojo/_base/declare',
    'jimu/BaseWidgetSetting',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/html',
    'dojo/_base/lang',
    'dojo/promise/all',
    'esri/layers/FeatureLayer',
    './templatePopup',
    '../DijitFactory',
    './DijitSettingFactory',
    'jimu/dijit/GridLayout',
    'jimu/dijit/DataSource',
    'jimu/dijit/_DataSourcePopup',
    'jimu/dijit/ViewStack',
    'jimu/dijit/Message',
    'jimu/dijit/Popup',
    'jimu/utils',
    'jimu/DataSourceManager',
    'jimu/LayerInfos/LayerInfos',
    '../utils',
    'libs/storejs/store',
    'jimu/dijit/CheckBox',
    '../IGUtils',
    'dojo/text!./templates.json',
    'dijit/form/ValidationTextBox'
  ],
  function(on, query, Deferred, declare, BaseWidgetSetting, _WidgetsInTemplateMixin, html, lang, all,
    FeatureLayer, templatePopup, DijitFactory, DijitSettingFactory, GridLayout, DataSource,
    DataSourcePopup, ViewStack, Message, Popup, jimuUtils, DataSourceManager, LayerInfos,
    utils, store, CheckBox, IGUtils, templates) {

    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-infographic-setting',
      dijits: null,
      dijitSettings: null,
      _dataSource: null,
      dataSourceManager: null,
      layerInfosObj: null,

      _initVisiblity: {},
      mainDijitJson: null,

      postMixInProperties: function() {
        this.inherited(arguments);
        lang.mixin(this.nls, window.jimuNls.common);
        lang.mixin(this.nls, window.jimuNls.timeUnit);
        this.dataSourceManager = DataSourceManager.getInstance();
        this.layerInfosObj = LayerInfos.getInstanceSync();
      },

      postCreate: function() {
        this.inherited(arguments);
        this._initGolbalInfo();
        //init setting out frame ui: data source related
        this._initOuterFrameUI();
        //init dijit preview icon event to control the visual of dijits
        this._initEvents();
        //init dijit factory to create all dijit by template
        this._initDijitFactory();
      },

      startup: function() {
        this.inherited(arguments);
        var dataSource = this.config && this.config.dataSource;
        if (dataSource) {
          //init some info related to config
          this._initInfoWithConfig();
          var isValid = this._isDataSourceValid(dataSource);
          this._createDijitsSettings();
          if (isValid) {
            this._setDataSource(dataSource, this.config);
          }
        } else {
          this._chooseTemplate().then(function(template) {
            //get clean config by template json
            this.config = this._getCleanConfigByTemplate(template);
            this._initInfoWithConfig();
            this._createDijitsSettings(true);
            //choose data source and then set data source
            this._chooseDataSource().then(function(dataSource) {
              this._setDataSource(dataSource);
            }.bind(this), function() {});
          }.bind(this), function() {});
        }
      },

      getConfig: function() {
        if (!this._dataSource && this._hasNecessaryDijit()) {
          new Message({
            message: this.nls.dataSourceNotSet
          });
          return false;
        }

        if (this._dataSource) {
          this.config.dataSource = this._dataSource;
          this.config.dataSource.useSelection = this.dataSourceUseSelection.getValue();
          this.config.dataSource.filterByExtent = this.dataSourceFilterByExtent.get('value');
        }

        var isValid = true;

        this.config.dijits.forEach(function(d) {
          var dijitSetting = DijitSettingFactory.getDijitSetting(d);
          d.config = dijitSetting.getConfig(true);
          if (!d.config) {
            isValid = false;
          }
        }, this);

        if (!isValid) {
          return false;
        }
        this.config.layout.definition = this.layout.getLayoutDefinition();
        return this.config;
      },

      setConfig: function(config) {
        this.config = config;
      },

      //--------- set data source ----------
      _setDataSource: function(dataSource) {
        this._enableDataSourceOption();
        this._dataSource = dataSource;
        this.shelter.show();
        this._preprocessingDataSource(dataSource).then(function() {
          this.shelter.hide();
          this._afterProcessDataSource(dataSource);
        }.bind(this), function(error) {
          this.mainDijit.showNodata();
          this.shelter.hide();
          console.error(error.message || error);
        }.bind(this));
      },

      _afterProcessDataSource: function(dataSource) {
        this._serverStatisticType = this._isServerStatisticType(dataSource);
        this._updateOuterFrameUI(dataSource);
        this._setDataSourceForMainDijit(dataSource);
      },

      _setConfigToMainDijitSetting: function() {
        var mainDijitConfig = this._getMainDijitConfig();
        var dijitType = this._getMainDijitType();
        if (dijitType === 'gauge' || dijitType === 'number') {
          this.mainDijitSetting.setConfig(mainDijitConfig);
        }
      },

      _setDataSourceForMainDijit: function(dataSource) {
        if (!this.mainDijit || !this.mainDijitSetting) {
          return;
        }

        //set ds layer info to main dijit and setting

        this.mainDijit.setDataSource(dataSource); //data source
        this._initMainDijitSettingLayerInfo(); // layer definition, layer object ...
        this._setConfigToMainDijitSetting(); //config
        //set features, for preview purpose, we only fetch data once.
        this._setFeaturesToDijitSetting(this.features, this.range1Features, this.range2Features);

        this.mainDijitSetting.setDataSource(dataSource);

        this.mainDijit.startRendering(); //Try rendering for the first time.
      },

      _setFeaturesToDijitSetting: function(features, range1Features, range2Features) {
        if (!this.mainDijit || !this.mainDijitSetting) {
          return;
        }

        if (typeof this.mainDijitSetting.setFeatures === 'function') {
          this.mainDijitSetting.setFeatures(features);
        }

        this.mainDijit.onDataSourceDataUpdate({
          features: features
        }, range1Features, range2Features);
      },

      _isDataSourceValid: function(dataSource) {
        var res = this._checkDataSource(dataSource);
        //show error message
        if (res.code !== 0) {
          this._showMessage(res.message);
        }
        //update frame ui for ds
        if (res.code === 1) { //bad data source
          this._disableDataSourceOption();
        }
        //reset config
        if (res.code === 2) {
          var template = this._getTemplateJson();
          this.config = this._getCleanConfigByTemplate(template);
          //init some info related to config
          this._initInfoWithConfig();
        }
        return res.code !== 1;
      },

      _onBtnDataSourceClicked: function() {
        this._chooseDataSource().then(function(dataSource) {
          var template = this._getTemplateJson();
          this.config = this._getCleanConfigByTemplate(template);
          //init some info related to config
          this._initInfoWithConfig();
          this._createDijitsSettings();
          this._setDataSource(dataSource);
        }.bind(this), function() {});
      },

      _chooseDataSource: function() {
        var deferred = new Deferred();
        var args = {
          dijitArgs: {
            types: DataSource.createInfographicTypes({
              createMapResponse: this.map.webMapResponse,
              appConfig: this.appConfig
            }),
            style: {
              height: '100%'
            }
          }
        };
        var dataSourcePopup = new DataSourcePopup(args);
        this.own(on(dataSourcePopup, 'ok', lang.hitch(this, function(item) {
          var dataSource = {
            dataSourceType: item.dataSourceType,
            name: item.name
          };
          if (item.dataSourceType === 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
            dataSource.layerId = item.layerInfo.id;
          } else if (item.dataSourceType === 'DATA_SOURCE_FROM_FRAMEWORK') {
            dataSource.frameWorkDsId = item.dsId;
          }
          dataSourcePopup.close();
          dataSourcePopup = null;
          deferred.resolve(dataSource);

        })));
        this.own(on(dataSourcePopup, 'cancel', lang.hitch(this, function() {
          dataSourcePopup.close();
          dataSourcePopup = null;
          deferred.reject('cancelled');
        })));
        dataSourcePopup.startup();
        return deferred;
      },

      _updateOuterFrameUI: function(dataSource) {
        this.urlTextBox.set('value', dataSource.name);
        this._updateFilterByExtentState(dataSource);
        this._updateUseSelectionState(dataSource);
      },

      //get value for this.popupInfo, this.layerObject, this.featureLayerForFrameWork
      _preprocessingDataSource: function(dataSource) {
        var deferred = new Deferred();
        var mainDijitJson = this._getMainDijitJson();
        var statistics = mainDijitJson && mainDijitJson.config.statistics;
        var rangeSources = utils.mockDataSourceForGaugeRange(statistics, this._defalutStatSourceID);

        var def1 = this.igUtils.preprocessingDataSourceForSetting(dataSource);
        var def2 = this.igUtils.preprocessingDataSourceForRange(rangeSources[0]);
        var def3 = this.igUtils.preprocessingDataSourceForRange(rangeSources[1]);
        all([def1, def2, def3]).then(function(res) {
          var ret = res[0];
          if (ret) {
            this.layerObject = ret.layerObject;
            this.popupInfo = ret.popupInfo;
            this.featureLayerForFrameWork = ret.featureLayerForFrameWork;
            this.definition = ret.definition;
            this.features = ret.features;
          }
          var ret1 = res[1];
          if (ret1) {
            this.rangeDefinition1 = ret1.definition;
            this.range1Features = ret1.features;
          }
          var ret2 = res[2];
          if (ret2) {
            this.rangeDefinition2 = ret2.definition;
            this.range2Features = ret2.features;
          }
          deferred.resolve();
        }.bind(this), function(error) {
          deferred.reject(error);
        });
        return deferred;
      },

      _initMainDijitSettingLayerInfo: function() {
        if (this.mainDijit) {
          this.mainDijit.setLayerInfo(this.layerObject, this.featureLayerForFrameWork,
            this.popupInfo);
        }
        if (this.mainDijitSetting) {
          this.mainDijitSetting.setLayerDefinition(this.definition,
            this.rangeDefinition1, this.rangeDefinition2);
          this.mainDijitSetting.setLayerObject(this.layerObject);
        }
      },

      //--------------- init --------------------
      _initOuterFrameUI: function() {
        this.settingsViewStack = new ViewStack({
          viewType: 'dom',
          views: []
        }, this.settingContent);
        this.settingsViewStack.addView(this.settingTip);
        //set chekbox label
        this.dataSourceUseSelection.setLabel(this.nls.useDataSourceSelection);
      },

      _initEvents: function() {
        //init preview visualControllers event
        this.own(on(this.visualContainer, 'click', lang.hitch(this, function(event) {
          var target = event.target || event.srcElement;
          var icon = null;
          if (html.hasClass(target, 'visual-controller')) {
            icon = target;
          } else if (html.hasClass(target.parentElement, 'visual-controller')) {
            icon = target.parentElement;
          } else {
            return;
          }
          this._toggleDijitVisualByIconNode(icon);
        })));

        this.own(on(this.dataSourceFilterByExtent, 'click', lang.hitch(this, function(e) {
          if (this._serverStatisticType) {
            if (!e.target.checked) {
              return;
            }
            e.preventDefault();
            this._checkFilterByExtent();
          }
        })));
      },

      _checkFilterByExtent: function() {
        var pop = new Popup({
          autoHeight: true,
          content: '<div style="font-size:16px;line-height:1.5;padding-bottom:10px;">' + this.nls.fbeTip + '</div>',
          width: 480,
          buttons: [{
            label: this.nls.openFbeTip,
            onClick: lang.hitch(this, function() {
              this.dataSourceFilterByExtent.set('value', true);
              pop.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function() {
              this.dataSourceFilterByExtent.set('value', false);
              pop.close();
            })
          }]
        });
      },

      _setTempNameToConfig: function() {
        var config = this.config;
        if (!config || typeof config.name !== 'undefined') {
          return;
        }
        var mainDijitJson = this._getMainDijitJson();
        var templateName = utils.getTemplateNameByMainDijitJson(mainDijitJson);
        if (templateName) {
          config.name = templateName;
        }
      },

      _initInfoWithConfig: function() {
        if (!this.config || !this.config.dijits || !this.config.dijits.length) {
          return;
        }
        //cache initial layout and its display state for restore function
        this._initLayout = this.config.layout;
        this._initVisiblity = {};
        this.config.dijits.forEach(lang.hitch(this, function(d) {
          this._initVisiblity[d.id] = d.visible;
        }));
        var mainDijitJson = this._getMainDijitJson();
        //building range source ID into standard data source format for IG
        this._ininRangeDataSource(mainDijitJson);
        //set template name to config(if there is no template name in it)
        this._setTempNameToConfig();
      },

      _initGolbalInfo: function() {
        templates = jimuUtils.replacePlaceHolder(templates, this.nls.stringsInTemplate);
        //template json used to reset setting when changing data sources.
        this._templatesJson = window.JSON.parse(templates);
        //default stat ds id used to init range data source for gauge dijit
        this._defalutStatSourceID = this._getDefaultStatSourceID(this.appConfig);
        //igUtils used to process map data: definition, layer object, popup info ...
        this.igUtils = new IGUtils({
          appConfig: this.appConfig,
          map: this.map
        });
      },

      _getDefaultStatSourceID: function(appConfig) {
        if (!appConfig) {
          return;
        }
        var acds = appConfig.dataSource.dataSources;
        var sourceIDs = Object.keys(acds);
        if (!sourceIDs || !sourceIDs.length) {
          return;
        }
        var defaultStatSourceID;
        sourceIDs.some(function(sourceID) {
          var source = acds[sourceID];
          if (source && source.type === 'FeatureStatistics') {
            defaultStatSourceID = sourceID;
            return true;
          }
        }.bind(this));
        return defaultStatSourceID;
      },

      //---------- template related -----------
      _renderByTemplate: function(template) {
        //handle template config
        this.config = this._createConfigFromTemplate(template);
        //set template name to config, e.g. Stacked bar
        this.config.name = template.name;
        //Init UI by config
        this._createDijitsSettings(true);
      },

      _getCleanConfigByTemplate: function(template) {
        var config = this._createConfigFromTemplate(template);
        //set template name to config, e.g. Stacked bar
        config.name = template.name;
        return config;
      },

      _onChooseTemplateClick: function() {
        if (store.get('widgets_Infographic_notShowTemplateWarning') &&
          store.get('widgets_Infographic_notShowTemplateWarning') === true) {
          this._chooseTemplate().then(function(template) {
            this._renderByTemplate(template);
            this._setDataSource(this._dataSource);
          }.bind(this), function() {});
        } else {
          var content = html.create('div', {
            innerHTML: '<div>' + this.nls.changeTemplateWarning + '</div>'
          });
          var checkBox = new CheckBox({
            label: this.nls.donNotShowAgain,
            style: {
              marginTop: '90px'
            }
          });
          html.place(checkBox.domNode, content);

          this.own(on(checkBox, 'change', function(check) {
            if (check) {
              store.set('widgets_Infographic_notShowTemplateWarning', true);
            }
          }));
          var pop = new Popup({
            content: content,
            width: 380,
            height: 300,
            buttons: [{
              label: this.nls.ok,
              onClick: lang.hitch(this, function() {
                pop.close();
                this._chooseTemplate().then(function(template) {
                  this._renderByTemplate(template);
                  this._setDataSource(this._dataSource);
                }.bind(this), function() {});
              })
            }, {
              label: this.nls.cancel,
              onClick: lang.hitch(this, function() {
                pop.close();
              })
            }]
          });
        }
      },

      _chooseTemplate: function() {
        var deferred = new Deferred();
        var templatepopup = new templatePopup({
          titleLabel: this.nls.chooseTemplatePopupTitle,
          nls: this.nls
        });
        templatepopup.startup();
        this.own(on(templatepopup, 'ok', lang.hitch(this, function(template) {
          templatepopup.close();
          templatepopup = null;
          deferred.resolve(template);
        })));

        this.own(on(templatepopup, 'cancel', lang.hitch(this, function() {
          templatepopup.close();
          templatepopup = null;
          deferred.reject('cancelled');
        })));
        return deferred;
      },

      //---- restore layout ----
      _resetToInitControllersState: function() {
        if (!this._initVisiblity) {
          return;
        }

        var initVisiblity = lang.clone(this._initVisiblity);
        var ids = Object.keys(initVisiblity);
        var visualControllers = query('.visual-controller', this.visualContainer);

        if (ids && ids.length) {
          ids.forEach(function(id) {
            var visible = initVisiblity[id];
            this._switchControllerStateByDijitId(visualControllers, id, visible);
          }.bind(this));
        }
        visualControllers = null;
        initVisiblity = null;
      },

      _onResetLayoutClicked: function() {
        this._resetToInitControllersState();
        if (this.layout) {
          this.layout.restoreLayout();
        }
        this._switchSettingsView(0);
      },

      //----Create dijits and settings and related components-----
      _createDijitsSettings: function(first) {
        this._createDijitVisualState();
        this._createDijits();
        this._createSettings(first);
        this._switchSettingsView(0);
      },

      _createDijitVisualState: function() {
        this._emptyDijitVisualContainer();
        var dijits = this.config && this.config.dijits;
        if (!dijits || !dijits.length) {
          return;
        }
        dijits.forEach(function(d, index) {
          this._createVisualControllerForDijit(d, index);
        }.bind(this));
      },

      _createDijits: function() {
        //Empty dijits before
        if (this.dijits && this.dijits.length > 0) {
          this.dijits.forEach(lang.hitch(this, function(dijit) {
            dijit.destroy();
          }));
        }

        this.dijits = [];
        //Clear the layout before
        if (this.layout) {
          this.layout.destroy();
          this.layout = null;
        }

        var dijitsForLayout = this.config.dijits.map(function(d) {
          var dijit = DijitFactory.createDijit(d);
          this.dijits.push(dijit);
          return {
            id: d.id,
            visible: d.visible,
            dijit: dijit
          };
        }, this);

        this.layout = new GridLayout({
          components: dijitsForLayout,
          layoutDefinition: this.config.layout.definition,
          container: this.cardContent,
          editable: true
        });

        this.layout.on('mask-click', lang.hitch(this, function(id) {
          this._switchSettingsView(id);
        }));

        this.layout.on('initialised', lang.hitch(this, function() {
          this.dijits.forEach(lang.hitch(this, function(dijit) {
            dijit.startup();
          }));
        }));
        this.mainDijit = this._getMainDijit();
        this._cacheLayout();
      },

      _createSettings: function(first) {
        if (this.dijitSettings && this.dijitSettings.length) {
          this.dijitSettings.forEach(lang.hitch(this, function(dijitSetting) {
            this.settingsViewStack.removeView(dijitSetting);
            dijitSetting.destroy();
          }));
        }

        this.dijitSettings = null;
        this.dijitSettings = this.config.dijits.map(lang.hitch(this, function(d) {
          var dijitSetting = DijitSettingFactory.createDijitSetting(d, this.config.name, first);
          if (d.type === 'chart') {
            //bind chartSettingChanged event for chart dijit setting
            this.own(on(dijitSetting, 'chartSettingChanged', function(chartConfig) {
              this._updateExtentStateForMapLayer(this._dataSource, chartConfig);
              var _serverStatisticType = this._isServerStatisticType(this._dataSource, chartConfig);
              if (_serverStatisticType && !this._serverStatisticType &&
                this.dataSourceFilterByExtent.get('value')) {
                this.dataSourceFilterByExtent.set('value', false);
              }
              this._serverStatisticType = _serverStatisticType;
            }.bind(this)));
          } else if (d.type === 'gauge') {
            dijitSetting.igUtils = this.igUtils;
          }
          dijitSetting.label = d.id;
          this.settingsViewStack.addView(dijitSetting);
          return dijitSetting;
        }));

        this.mainDijitSetting = this._getMainDijitSetting();
      },

      _createVisualControllerForDijit: function(dijit, index) {
        if (!dijit.type || !dijit.id) {
          return;
        }
        var typeClass = "";

        if (dijit.type === 'text') {
          typeClass = 'text-controller';
        } else if (dijit.type === 'image') {
          typeClass = 'image-controller';
        } else if (dijit.type === 'number') {
          typeClass = 'number-controller';
        } else if (dijit.type === 'gauge') {
          typeClass = 'gauge-controller';
        } else if (dijit.type === 'chart') {
          typeClass = 'chart-controller';
        }

        var domStr;
        if (index === 0) {
          domStr = '<div class="visual-controller ' + typeClass + '"><div></div></div>';
        } else {
          domStr = '<div class="visual-controller marginleft10 ' + typeClass + '"><div></div></div>';
        }

        var icon = html.toDom(domStr);

        html.place(icon, this.visualContainer);
        icon.id = dijit.id;

        this.own(on(icon, ['mouseenter', 'mouseleave'], lang.hitch(this, function(event) {
          var target = event.target || event.srcElement;
          if (!target || typeof target.id === 'undefined') {
            return;
          }
          var id = target.id;
          var show = event.type === 'mouseenter' ? true : false;
          this._toggleDijitHighState(id, show);
        })));

        if (dijit.visible) {
          this._toggleDijitVisualByIconNode(icon);
        }
      },

      //---- set all dijits default color to fit the theme ----
      _setDefaultColorToConfig: function(config) {
        var dijits = config.dijits;
        if (!dijits || !dijits.length) {
          return;
        }

        dijits.forEach(function(dijitJson) {
          this._setDefaultColorToDijitJson(dijitJson);
        }.bind(this));
      },

      _setDefaultColorToDijitJson: function(dijitJson) {
        if (!dijitJson) {
          return;
        }
        var colorObj = this._getDefaultColor();
        if (!colorObj) {
          return;
        }
        var bgColor = colorObj.bgColor;
        var textColor = colorObj.textColor;

        this._setDefaultbgColor(dijitJson, bgColor);
        this._setDefaultTextColor(dijitJson, textColor);
        this._setGaugeColor(dijitJson);
      },

      _getDefaultColor: function() {
        var bgColor, textColor;

        if (this.appConfig.theme.name === 'DashboardTheme' &&
          (this.appConfig.theme.styles[0] === 'default' || this.appConfig.theme.styles[0] === 'style3')) {
          bgColor = '#222222';
          textColor = '#fff';
        } else if (this.appConfig.theme.name === 'DartTheme') {
          bgColor = '#4c4c4c';
          textColor = '#fff';
        } else {
          return;
        }
        return {
          bgColor: bgColor,
          textColor: textColor
        };
      },

      _setGaugeColor: function(dijitJson) {
        var gaugeColor = '#12DDF9',
          gaugeTextColor = '#12DDF9',
          gaugeLabelColor = '#fff',
          gaugeBgColor = '#1E5F6F';
        var dijitConfig = dijitJson.config;
        if (!dijitConfig || dijitJson.type !== 'gauge') {
          return;
        }
        //gauge color
        if (dijitConfig.display) {
          if (!dijitConfig.display.gaugeColor) {
            dijitConfig.display.gaugeColor = gaugeColor;
          }
        } else {
          dijitConfig.display = {
            gaugeColor: gaugeColor,
            dataLabels: {
              textColor: gaugeTextColor
            }
          };
        }
        //data label text color
        if (dijitConfig.display.dataLabels) {
          if (!dijitConfig.display.dataLabels.textColor) {
            dijitConfig.display.dataLabels.textColor = gaugeLabelColor;
          } else {
            dijitConfig.display.dataLabels = {
              textColor: gaugeLabelColor
            };
          }
        }
        //current value text color
        if (dijitConfig.display.currentValue) {
          if (dijitConfig.display.currentValue.font) {
            if (!dijitConfig.display.currentValue.font.textColor) {
              dijitConfig.display.currentValue.font.textColor = gaugeTextColor;
            }
          } else {
            dijitConfig.display.currentValue.font = {
              textColor: gaugeTextColor
            };
          }
        }
        //gauge bg color
        dijitConfig.display.bgColor = gaugeBgColor;
      },

      _setDefaultbgColor: function(dijitJson, bgColor) {
        var dijitConfig = dijitJson.config;
        if (!dijitConfig) {
          return;
        }
        switch (dijitJson.type) {
          case 'text':
          case 'image':
          case 'number':
            if (dijitConfig.background) {
              if (!dijitConfig.background.backgroundColor) {
                dijitConfig.background.backgroundColor = bgColor;
              }
            } else {
              dijitConfig.background = {
                backgroundColor: bgColor
              };
            }
            break;
          case 'chart':
            if (!dijitConfig.backgroundColor) {
              dijitConfig.backgroundColor = bgColor;
            }
            break;
          case 'gauge':
            if (dijitConfig.display) {
              if (!dijitConfig.display.backgroundColor) {
                dijitConfig.display.backgroundColor = bgColor;
              }
            } else {
              dijitConfig.display = {
                backgroundColor: bgColor
              };
            }
            break;
        }
      },

      _setDefaultTextColor: function(dijitJson, color) {
        var dijitConfig = dijitJson.config;
        if (!dijitConfig) {
          return;
        }
        switch (dijitJson.type) {
          case 'text':
          case 'number':
            if (dijitConfig.font) {
              if (!dijitConfig.font.textColor) {
                dijitConfig.font.textColor = color;
              }
            } else {
              dijitConfig.font = {
                textColor: color
              };
            }
            break;
          case 'chart':
            if (!dijitConfig.legendTextColor) {
              dijitConfig.legendTextColor = color;
            }
            if (dijitConfig.type === 'pie') {
              if (!dijitConfig.dataLabelColor) {
                dijitConfig.dataLabelColor = color;
              }
            } else {
              if (!dijitConfig.horizontalAxisTextColor) {
                dijitConfig.horizontalAxisTextColor = color;
              }
              if (!dijitConfig.verticalAxisTextColor) {
                dijitConfig.verticalAxisTextColor = color;
              }
            }
            break;
          case 'gauge':
            break;
        }
      },

      //-------------- tools -----------------

      _emptyDijitVisualContainer: function() {
        if (this.visualContainer) {
          html.empty(this.visualContainer);
        }
      },

      _getMainDijit: function() {
        if (!this.dijits || !this.dijits.length) {
          return;
        }
        var dijit = null;
        var validTypes = ['number', 'gauge', 'chart'];
        this.dijits.some(function(d) {
          if (validTypes.indexOf(d.type) > -1) {
            dijit = d;
            return true;
          }
          return false;
        });

        return dijit;
      },

      _getMainDijitType: function() {
        var mainDijit = this._getMainDijit();
        return mainDijit && mainDijit.type;
      },

      //main dijit json, config of dijit that requires data,
      //include chart gauge and number dijit
      _getMainDijitJson: function() {
        if (!this.config || !this.config.dijits || !this.config.dijits.length) {
          return null;
        }
        var dijit = null;
        var validTypes = ['number', 'gauge', 'chart'];
        //Now we only support one data-needed dijit in a widget
        this.config.dijits.some(function(d) {
          if (validTypes.indexOf(d.type) > -1) {
            dijit = d;
            return true;
          }
          return false;
        });

        return dijit;
      },

      _getMainDijitSetting: function() {
        if (!this.dijitSettings || !this.dijitSettings.length) {
          return;
        }
        var dijitSetting = null;
        var validTypes = ['number', 'gauge', 'chart'];
        this.dijitSettings.some(function(d) {
          if (validTypes.indexOf(d.type) > -1) {
            dijitSetting = d;
            return true;
          }
          return false;
        });

        return dijitSetting;
      },

      _getMainDijitConfig: function() {
        var mainDijitJson = this._getMainDijitJson();
        return mainDijitJson && mainDijitJson.config;
      },

      _ininRangeDataSource: function(dijitJson) {
        var rds = utils.getRangeDataSource(dijitJson);
        this._rangeDataSource1 = rds.range1;
        this._rangeDataSource2 = rds.range2;
      },

      _toggleDijitVisualByIconNode: function(target) {
        if (!target || typeof target.id === 'undefined') {
          return;
        }
        var id = target.id;
        var visualControllerDiv = query('div', target)[0];
        if (html.hasClass(visualControllerDiv, 'controller-selected')) {
          if (this._getSelectedControllersCount() > 1) {
            html.removeClass(visualControllerDiv, 'controller-selected');
            html.removeClass(target, 'visual-controller-selected');
            this._switchDijitView(id, false);
          }
        } else {
          html.addClass(visualControllerDiv, 'controller-selected');
          html.addClass(target, 'visual-controller-selected');
          this._switchDijitView(id, true);
        }
      },

      _switchControllerStateByDijitId: function(visualControllers, id, select) {
        if (!id) {
          return;
        }
        if (visualControllers && visualControllers.length) {
          visualControllers.some(function(visualController) {
            var domId = html.getAttr(visualController, 'id');
            if (domId === id) {
              var visualControllerDiv = query('div', visualController)[0];
              if (select) {
                html.addClass(visualControllerDiv, 'controller-selected');
                html.addClass(visualController, 'visual-controller-selected');
                this._setVisibleToConfigDijit(id, true);
              } else {
                html.removeClass(visualControllerDiv, 'controller-selected');
                html.removeClass(visualController, 'visual-controller-selected');
                this._setVisibleToConfigDijit(id, false);
              }
              return true;
            }
            return false;
          }.bind(this));
        }
      },

      _setVisibleToConfigDijit: function(id, visible) {
        this.config.dijits.some(function(d) {
          if (d.id === id) {
            d.visible = visible;
            return true;
          }
          return false;
        });
      },

      //Toggle the high-light state
      _toggleDijitHighState: function(id, show) {
        if (!this.layout) {
          return;
        }
        if (show) {
          this.layout.highlightItem(id);
        } else {
          this.layout.unhighlightItem(id);
        }
      },

      _isLayerOnDemandMode: function(dataSource) {
        if (!dataSource || typeof dataSource.layerId === 'undefined') {
          return;
        }
        var layer = this.map.getLayer(dataSource.layerId);
        return layer && layer.currentMode === FeatureLayer.MODE_ONDEMAND;
      },

      _updateExtentStateForMapLayer: function(dataSource, chartConfig) {
        var isOndemandMode = this._isLayerOnDemandMode(dataSource);
        if (!isOndemandMode) {
          return;
        }
        var dsSupportsServerStatByExtent = this._isDataSourceSupportServerStatByExtent(dataSource);
        var dijitSupportServerStat = this._isDijitSupportServerStat(chartConfig);
        if (dsSupportsServerStatByExtent && dijitSupportServerStat) {
          this.dataSourceFilterByExtent.set('disabled', false);
          this.dataSourceFilterByExtent.set('value', !!dataSource.filterByExtent);
        } else {
          this.dataSourceFilterByExtent.set('disabled', false);
          this.dataSourceFilterByExtent.set('value', true);
          this.dataSourceFilterByExtent.set('disabled', true);
        }
      },

      _isServerStatisticType: function(dataSource, chartConfig) {
        if (!dataSource || dataSource.dataSourceType !== 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
          return false;
        }
        var dsSupportsServerStatByExtent = this._isDataSourceSupportServerStatByExtent(dataSource);
        var dijitSupportServerStat = this._isDijitSupportServerStat(chartConfig);
        return dsSupportsServerStatByExtent && dijitSupportServerStat;
      },

      _isDataSourceSupportServerStatByExtent: function(dataSource) {
        if (!dataSource || typeof dataSource.layerId === 'undefined') {
          return false;
        }
        var layerObject = null;
        if (!this.layerObject) {
          var layerInfo = this.layerInfosObj.getLayerInfoById(dataSource.layerId);
          layerObject = layerInfo && layerInfo.layerObject;
        } else {
          layerObject = this.layerObject;
        }

        if (!layerObject) {
          return false;
        }

        //layer version >= 10.1 sp1(10.11)
        var versionThanSP1 = layerObject.version && Number(layerObject.version) >= 10.11;

        var hasSupportStatCapability = false;
        if (layerObject.advancedQueryCapabilities) {
          hasSupportStatCapability = !!layerObject.advancedQueryCapabilities.supportsStatistics;
        } else {
          hasSupportStatCapability = !!layerObject.supportsStatistics;
        }
        return versionThanSP1 && hasSupportStatCapability;
      },

      _isDijitSupportServerStat: function(chartConfig) {
        //gauge and number template, return true
        if (!chartConfig) {
          return true;
        }
        return chartConfig.mode === 'feature' ? false : !chartConfig.dateConfig;
      },

      _updateFilterByExtentState: function(dataSource, chartConfig) {
        if (dataSource.dataSourceType === 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
          chartConfig = this._getVaildChartConfig(chartConfig);
          this._updateExtentStateForMapLayer(dataSource, chartConfig);
        } else {
          this.dataSourceFilterByExtent.set('disabled', false);

          var dsConfig = this.appConfig.dataSource.dataSources[dataSource.frameWorkDsId];
          if (dsConfig && dsConfig.filterByExtent) {
            this.dataSourceFilterByExtent.set('value', true);
          } else {
            this.dataSourceFilterByExtent.set('value', false);
          }
          this.dataSourceFilterByExtent.set('disabled', true);
        }
        if (dataSource.filterByExtent) {
          this.dataSourceFilterByExtent.set('value', true);
        }
      },

      _getVaildChartConfig: function(chartConfig) {
        var mainDijitJson = this._getMainDijitJson();
        if (!chartConfig && mainDijitJson && mainDijitJson.type === 'chart') {
          var config = mainDijitJson.config;
          if (config) {
            chartConfig = lang.clone(config);
          }
          if (!chartConfig.mode) {
            chartConfig.mode = 'feature';
          }
        }
        return chartConfig;
      },

      _updateUseSelectionState: function(dataSource) {
        if (dataSource.dataSourceType === 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
          this.dataSourceUseSelection.setStatus(true);

          if (typeof dataSource.useSelection === 'undefined') {
            this.dataSourceUseSelection.setValue(true);
          }

          if (dataSource.useSelection) {
            this.dataSourceUseSelection.setValue(true);
          }
        } else {
          this.dataSourceUseSelection.setStatus(true);
          this.dataSourceUseSelection.setValue(false);
          this.dataSourceUseSelection.setStatus(false);
        }
      },

      //get the number of dijit to display
      _getSelectedControllersCount: function() {
        return query('.controller-selected', this.visualContainer).length;
      },

      _checkDataSource: function(dataSource) {
        var mainDijitJson = this._getMainDijitJson();
        var main, r1, r2;
        main = utils.checkDataSourceIsVaild(dataSource, mainDijitJson, this.map, this.appConfig, 'value');

        if (mainDijitJson && mainDijitJson.type === 'gauge') {
          if (this._rangeDataSource1) {
            r1 = utils.checkDataSourceIsVaild(this._rangeDataSource1, mainDijitJson,
              this.map, this.appConfig, 'range1');
          }
          if (this._rangeDataSource2) {
            r2 = utils.checkDataSourceIsVaild(this._rangeDataSource2, mainDijitJson,
              this.map, this.appConfig, 'range2');
          }
        }
        var results = [main, r1, r2];
        var message = '';
        var code = utils.getCheckDataSourceResultCode(results);
        results.forEach(function(res) {
          message += this._getDSErrorString(res);
        }.bind(this));
        return {
          code: code,
          message: message
        };
      },

      _resetMainDijitByTemplate: function() {
        var mainDijitConfig = this._getMainDijitConfigFormTemplates();
        if (!mainDijitConfig) {
          return;
        }
        var mainDijitJson = this._getMainDijitJson();
        var mainDijit = this._getMainDijit();
        var mainDijitSetting = this._getMainDijitSetting();

        if (mainDijitJson) {
          mainDijitJson.config = lang.clone(mainDijitConfig);
        }

        this._setDefaultColorToDijitJson(mainDijitJson);

        if (mainDijit) {
          mainDijit.resetData();
          mainDijit.setConfig(mainDijitJson.config);
        }
        if (mainDijitSetting) {
          if (typeof mainDijitSetting.reset === 'function') {
            mainDijitSetting.reset();
          }
          mainDijitSetting.setConfig(mainDijitJson.config);
          //clear marks for chart dijit
          if (typeof mainDijitSetting.clearMarks === 'function') {
            mainDijitSetting.clearMarks();
          }
        }
      },

      _disableDataSourceOption: function() {
        this.dataSourceUseSelection.setStatus(false);
        this.dataSourceFilterByExtent.set('disabled', true);
        this.urlTextBox.reset();
      },

      _enableDataSourceOption: function() {
        this.dataSourceUseSelection.setStatus(true);
        this.dataSourceFilterByExtent.set('disabled', false);
        this.urlTextBox.reset();
      },

      //Toggle the display and hide of a dijit
      _switchDijitView: function(id, isDisplay) {
        if (this.layout) {
          this.layout.setVisible(id, isDisplay);
        }
        this._setDijitVisible(id, isDisplay);
        this._setVisibleToConfigDijit(id, isDisplay);
      },

      _setDijitVisible: function(jsonId, display) {
        var dijit = this._getDijitByJsonId(jsonId);
        if (dijit && typeof dijit.setVisible === 'function') {
          dijit.setVisible(display);
          if (typeof dijit.startRendering === 'function' && display) {
            dijit.startRendering();
          }
        }
      },

      _getDijitByJsonId: function(jsonId) {
        if (!jsonId) {
          return;
        }
        if (!this.dijits || !this.dijits.length) {
          return;
        }
        return this.dijits.filter(function(d) {
          return d.jsonId === jsonId;
        })[0];
      },

      //Toggle the show and hide of a dijit's setting
      _switchSettingsView: function(label) {
        if (this.settingsViewStack) {
          this.settingsViewStack.switchView(label);
        }
      },

      _initDijitFactory: function() {
        DijitSettingFactory.setNls(this.nls);
        DijitSettingFactory.setMap(this.map);
        DijitSettingFactory.setAppConfig(this.appConfig);
        DijitSettingFactory.setContext({
          folderUrl: this.folderUrl
        });
        DijitFactory.setNls(this.nls);
        DijitFactory.setMap(this.map);
        DijitFactory.setInSettingPage(true);
        DijitFactory.setAppConfig(this.appConfig);
        DijitFactory.setContext({
          folderUrl: this.folderUrl
        });
      },

      _fixDijitId: function(config) {
        var idPrefix = this._getWid();
        this._visitContent(config.layout.definition, function(componentState) {
          componentState.id = idPrefix + '-' + componentState.id;
        });

        config.dijits.forEach(function(dijitJson) {
          dijitJson.id = idPrefix + '-' + dijitJson.id;
        }, this);

        config.wid = idPrefix;

        return config;
      },

      _cacheLayout: function() {
        if (this.config) {
          if (this.config.dijits && this.config.dijits.length) {
            this.config.dijits.forEach(lang.hitch(this, function(d) {
              this._initVisiblity[d.id] = d.visible;
            }));
          }
        }
      },

      _visitContent: function(content, cb) {
        content.forEach(function(item) {
          if (item.type === 'component') {
            cb(item.componentState);
          } else {
            if (item.content) {
              this._visitContent(item.content, cb);
            }
          }
        }, this);
      },

      _getWid: function() {
        //wid is like widget id, which is ued to identify widget.
        //we can't use widget id because the new added widget does not have id.
        return jimuUtils.getRandomString();
      },

      _hasNecessaryDijit: function() {
        return this.config.dijits.filter(function(d) {
          return ['chart', 'gauge', 'number'].indexOf(d.type) > -1;
        }).length > 0;
      },

      _createConfigFromTemplate: function(template) {
        var config = this._fixDijitId(template);

        this._setDefaultColorToConfig(config);

        if (this.config.dataSource) {
          config.dataSource = this.config.dataSource;
        }
        return config;
      },

      _getTemplateJson: function() {
        var templateName = this.config && this.config.name;
        if (!this._templatesJson || !templateName) {
          return null;
        }

        var template = this._templatesJson.filter(function(item) {
          return item.name === templateName;
        }.bind(this))[0];
        return template && template.config;
      },

      _getMainDijitConfigFormTemplates: function() {
        var templateName = this.config && this.config.name;
        if (!this._templatesJson || !templateName) {
          return null;
        }

        var vaildTemplate = this._templatesJson.filter(function(item) {
          return item.name === templateName;
        }.bind(this))[0];

        if (!vaildTemplate) {
          return null;
        }
        var validTypes = ['number', 'gauge', 'chart'];

        var config = null;
        if (vaildTemplate.config && vaildTemplate.config.dijits &&
          vaildTemplate.config.dijits.length) {
          var dijit = vaildTemplate.config.dijits.filter(function(dijit) {
            return validTypes.indexOf(dijit.type) > -1;
          })[0];
          config = dijit && dijit.config;
        }
        if (config) {
          return lang.clone(config);
        } else {
          return null;
        }
      },

      _showMessage: function(message) {
        new Message({
          message: message
        });
      },

      _getDSErrorString: function(reslut) {
        var errorString = '';
        if (!reslut) {
          return errorString;
        }
        if (reslut.code === 1 || reslut.code === 3) {
          if (reslut.label === this._lastDataSourceLabel) {
            errorString = "";
          } else {
            errorString = this.nls.dataSource + ' ' + reslut.label + ' ' + this.nls.dsErrorTipSuf;
            this._lastDataSourceLabel = reslut.label;
          }
        }
        if (reslut.code === 2) {
          errorString = this.nls.fieldString + ' ' + reslut.fields.join(',') + ' ' + this.nls.dsErrorTipSuf;
        }
        return errorString;
      }

    });
  });