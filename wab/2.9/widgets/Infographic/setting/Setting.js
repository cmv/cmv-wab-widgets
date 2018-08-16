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
    'dojo/_base/declare',
    'jimu/BaseWidgetSetting',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/html',
    'dojo/_base/lang',
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
  function(on, query, declare, BaseWidgetSetting, _WidgetsInTemplateMixin, html, lang,
    FeatureLayer, templatePopup, DijitFactory, DijitSettingFactory, GridLayout, DataSource,
    _DataSourcePopup, ViewStack, Message, Popup, jimuUtils, DataSourceManager, LayerInfos,
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

        this.templatesJson = window.JSON.parse(templates);

        this.igUtils = new IGUtils({
          appConfig: this.appConfig,
          map: this.map
        });

        this._initDijitFactory();
        this._initUI();
        this._initEvents();

        if (this.config) {
          this._initLayout = this.config.layout;
          if (this.config.dijits && this.config.dijits.length) {
            this.config.dijits.forEach(lang.hitch(this, function(d) {
              this._initVisiblity[d.id] = d.visible;
            }));
          }
          this._setTempNameToConfig();
          this.setConfig(this.config);
        }
      },

      setConfig: function(config) {
        this.config = config;
      },

      _setTempNameToConfig: function() {
        var config = this.config;
        if (!config || typeof config.name !== 'undefined') {
          return;
        }
        var templateName = this._getTemplateNameByConfig(config);
        if (templateName) {
          config.name = templateName;
        }
      },

      startup: function() {
        this.inherited(arguments);
        //if has dijits, create dijit ,settings and setData source
        if (this.config && this.config.dijits && this.config.dijits.length) { //means configured
          this._createDijitsSettings();
          var dataSource = this.config && this.config.dataSource;
          this._checkAndSetDataSource(dataSource);
        } else {
          //if don not has config, choose a template
          this._chooseTemplate();
        }
      },

      _checkAndSetDataSource: function(dataSource) {
        var res = this._checkDataSource(dataSource);
        if (res.code === 0) {
          this._setDataSource(dataSource, true);
        } else {
          if (res.code === 2) {
            this._resetMainDijit();
            this._setDataSource(dataSource, true);
          }
          this._showMessage(res.message);
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
          this.config.dataSource.filterByExtent = this.dataSourceFilterByExtent.getValue();
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

      _initUI: function() {
        this.settingsViewStack = new ViewStack({
          viewType: 'dom',
          views: []
        }, this.settingContent);
        this.settingsViewStack.addView(this.settingTip);
        //set chekbox label
        this.dataSourceUseSelection.setLabel(this.nls.useDataSourceSelection);
        this.dataSourceFilterByExtent.setLabel(this.nls.dataSourceFilterByExtent);
      },

      _initEvents: function() {
        //init preview visualControllers event
        this.own(on(this.visualContainer, 'click', lang.hitch(this, function(event) {
          var target = event.target || event.srcElement;
          var vaildDom = null;
          if (html.hasClass(target, 'visual-controller')) {
            vaildDom = target;
          } else if (html.hasClass(target.parentElement, 'visual-controller')) {
            vaildDom = target.parentElement;
          } else {
            return;
          }
          this._switchingControllerStateByDomNode(vaildDom);
        })));
      },

      //------------ template related ------------
      _onChooseTemplateClick: function() {
        if (store.get('widgets_Infographic_notShowTemplateWarning') &&
          store.get('widgets_Infographic_notShowTemplateWarning') === true) {
          this._chooseTemplate();
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
                this._chooseTemplate();
                pop.close();
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
        var templatepopup = new templatePopup({
          titleLabel: this.nls.chooseTemplatePopupTitle,
          nls: this.nls
        });
        templatepopup.startup();

        this.own(on(templatepopup, 'ok', lang.hitch(this, function(template) {
          templatepopup.close();
          templatepopup = null;
          //handle template config
          this.config = this._createConfigFromTemplate(template);
          //set template name to config, e.g. Stacked bar
          this.config.name = template.name;
          //Init UI by config
          this._createDijitsSettings();

          //choose data source
          if (!this._dataSource) {
            this._onBtnDataSourceClicked();
          } else {
            this._setDataSource(this._dataSource);
          }
        })));

        this.own(on(templatepopup, 'cancel', lang.hitch(this, function() {
          templatepopup.close();
          templatepopup = null;
        })));
      },

      //----- Data source related processing -----
      _onBtnDataSourceClicked: function() {
        var args = {
          // titleLabel: this.nls.setDataSource,
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

        var dataSourcePopup = new _DataSourcePopup(args);
        this.own(on(dataSourcePopup, 'ok', lang.hitch(this, function(item) {
          this._dataSource = {
            dataSourceType: item.dataSourceType,
            name: item.name
          };
          if (item.dataSourceType === 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
            this._dataSource.layerId = item.layerInfo.id;
          } else if (item.dataSourceType === 'DATA_SOURCE_FROM_FRAMEWORK') {
            this._dataSource.frameWorkDsId = item.dsId;
          }

          //When the data source changes, reset the main dijit
          this._resetMainDijit();

          this._setDataSource(this._dataSource);

          dataSourcePopup.close();
          dataSourcePopup = null;
        })));
        this.own(on(dataSourcePopup, 'cancel', lang.hitch(this, function() {
          dataSourcePopup.close();
          dataSourcePopup = null;
        })));

        dataSourcePopup.startup();
      },

      _setDataSource: function(dataSource, hasChecked) {
        var isVaild = this._checkDSUpdateUI(dataSource, hasChecked);
        if (!isVaild) {
          return;
        }

        if (!this._dataSource) {
          this._dataSource = dataSource;
        }
        this.shelter.show();
        this._preprocessingDataSource(dataSource).then(lang.hitch(this, function() {
          this.shelter.hide();
          this._updateDataSourceDisplay(dataSource);
          this._setDataSourceForMainDijit(dataSource);
        }, lang.hitch(this, function(error) {
          this.shelter.hide();
          console.error(error.message || error);
        })));
      },

      _setDataSourceForMainDijit: function(dataSource) {
        if (!this.mainDijit || !this.mainDijitSetting) {
          return;
        }
        this.mainDijit.setDataSource(dataSource);
        this._initMainDijitSettingLayerInfo();

        //set features to mainDijit and mainDijitSetting
        ////For preview purpose, we only fetch data once.
        this._setFeaturesToDijitSetting({
          features: this.features
        });

        this.mainDijitSetting.setDataSource(dataSource);

        this.mainDijit.startRendering();
      },

      _setFeaturesToDijitSetting: function(data) {
        if (!this.mainDijit || !this.mainDijitSetting) {
          return;
        }

        if (typeof this.mainDijitSetting.setFeatures === 'function') {
          this.mainDijitSetting.setFeatures(data.features);
        }

        this.mainDijit.onDataSourceDataUpdate(data);
      },

      _updateDataSourceDisplay: function(dataSource) {
        this.urlTextBox.set('value', dataSource.name);
        this._updateFilterByExtentState(dataSource);
        this._updateUseSelectionState(dataSource);
      },

      //get value for this.popupInfo, this.layerObject, this.featureLayerForFrameWork
      _preprocessingDataSource: function(dataSource) {
        return this.igUtils.preprocessingDataSource(dataSource).then(function(res) {
          this.layerObject = res && res.layerObject;
          this.popupInfo = res && res.popupInfo;
          this.featureLayerForFrameWork = res && res.featureLayerForFrameWork;
          this.definition = res && res.definition;
          this.features = res && res.features;
          return;
        }.bind(this));
      },

      _initMainDijitSettingLayerInfo: function() {
        if (this.mainDijit) {
          this.mainDijit.setLayerInfo(this.layerObject, this.featureLayerForFrameWork,
            this.popupInfo);
        }
        if (this.mainDijitSetting) {
          this.mainDijitSetting.setLayerDefinition(this.definition);
        }
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
      _createDijitsSettings: function() {
        this._createDijitVisualState();
        this._createDijits();
        this._createSettings();
        this._switchSettingsView(0);
      },

      _emptyDijitVisualContainer: function() {
        if (this.visualContainer) {
          html.empty(this.visualContainer);
        }
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
        this.mainDijitJson = this._getMainDijitJson();
        this._cacheLayout();
      },

      _createSettings: function() {
        if (this.dijitSettings && this.dijitSettings.length) {
          this.dijitSettings.forEach(lang.hitch(this, function(dijitSetting) {
            this.settingsViewStack.removeView(dijitSetting);
            dijitSetting.destroy();
          }));
        }

        this.dijitSettings = null;
        this.dijitSettings = this.config.dijits.map(lang.hitch(this, function(d) {
          var dijitSetting = DijitSettingFactory.createDijitSetting(d, this.config.name);
          if (d.type === 'chart') {
            //bind chartSettingChanged event for chart dijit setting
            this.own(on(dijitSetting, 'chartSettingChanged', function(chartConfig) {
              this._updateExtentStateForMapLayer(this._dataSource, chartConfig);
            }.bind(this)));
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

        var vaildDom = html.toDom(domStr);

        html.place(vaildDom, this.visualContainer);
        vaildDom.id = dijit.id;

        if (dijit.visible) {
          this._switchingControllerStateByDomNode(vaildDom);
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

      _switchingControllerStateByDomNode: function(target) {
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
          this.dataSourceFilterByExtent.setStatus(true);
          this.dataSourceFilterByExtent.setValue(!!dataSource.filterByExtent);
        } else {
          this.dataSourceFilterByExtent.setStatus(true);
          this.dataSourceFilterByExtent.setValue(true);
          this.dataSourceFilterByExtent.setStatus(false);
        }
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
          this.dataSourceFilterByExtent.setStatus(true);

          var dsConfig = this.appConfig.dataSource.dataSources[dataSource.frameWorkDsId];
          if (dsConfig && dsConfig.filterByExtent) {
            this.dataSourceFilterByExtent.setValue(true);
          } else {
            this.dataSourceFilterByExtent.setValue(false);
          }
          this.dataSourceFilterByExtent.setStatus(false);
        }
        if (dataSource.filterByExtent) {
          this.dataSourceFilterByExtent.setValue(true);
        }
      },

      _getVaildChartConfig: function(chartConfig) {
        var mainDijitJson = this.mainDijitJson || this._getMainDijitJson();
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

      //Gets the number of dijit to display
      _getSelectedControllersCount: function() {
        return query('.controller-selected', this.visualContainer).length;
      },

      _checkDSUpdateUI: function(dataSource, hasChecked) {
        if (hasChecked) {
          this._enableDataSourceOption();
          return true;
        } else {
          var res = this._checkDataSource(dataSource);
          if (res.code === 1) {
            this._disableDataSourceOption();
            return false;
          } else {
            this._enableDataSourceOption();
            return true;
          }
        }
      },

      _checkDataSource: function(dataSource) {
        var mainDijitJson = this.mainDijitJson;
        var dsCheckRes = utils.checkDataSourceIsVaild(dataSource, mainDijitJson, this.map, this.appConfig);
        var message = this._getDSErrorString(dsCheckRes, dataSource);
        return {
          code: dsCheckRes.code,
          message: message
        };
      },

      _resetMainDijit: function() {
        var mainDijitConfig = this._getTempConfigByTempName();
        if (!mainDijitConfig) {
          return;
        }
        var mainDijitJson = this.mainDijitJson;
        var mainDijit = this._getMainDijit();
        var mainDijitSetting = this._getMainDijitSetting();

        if (mainDijitJson) {
          mainDijitJson.config = lang.clone(mainDijitConfig);
        }

        this._setDefaultColorToDijitJson(mainDijitJson);

        if (mainDijit) {
          mainDijit.setConfig(mainDijitJson.config);
        }
        if (mainDijitSetting) {
          mainDijitSetting.setConfig(mainDijitJson.config);
          if (typeof mainDijitSetting.clearMarks === 'function') {
            mainDijitSetting.clearMarks();
          }
        }
      },

      _disableDataSourceOption: function() {
        this.dataSourceUseSelection.setStatus(false);
        this.dataSourceFilterByExtent.setStatus(false);
        this.urlTextBox.reset();
      },

      _enableDataSourceOption: function() {
        this.dataSourceUseSelection.setStatus(true);
        this.dataSourceFilterByExtent.setStatus(true);
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

      _getTempConfigByTempName: function() {
        var templateName = this.config && this.config.name;
        if (!this.templatesJson || !templateName) {
          return null;
        }

        var vaildTemplate = this.templatesJson.filter(function(item) {
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

      _getDSErrorString: function(dsCheckRes, dataSource) {
        var errorString = '';
        var dsName = dataSource && dataSource.name;
        if (dsCheckRes.code === 1) {
          errorString = this.nls.dataSource + ' ' + dsName + ' ' + this.nls.dsErrorTipSuf;
        }
        if (dsCheckRes.code === 2) {
          errorString = this.nls.fieldString + ' ' + dsCheckRes.fields.join(',') + ' ' + this.nls.dsErrorTipSuf;
        }
        return errorString;
      },

      _getTemplateNameByConfig: function(config) {
        var mainDijitJson = this._getMainDijitJson(config);
        if (!mainDijitJson) {
          return;
        }
        var templateName;
        if (mainDijitJson.type === 'gauge') {
          templateName = this._getTempNameForGaugeType(mainDijitJson);
        } else if (mainDijitJson.type === 'chart') {
          templateName = this._getTempNameForChartType(mainDijitJson);
        } else if (mainDijitJson.type === 'number') {
          templateName = 'number';
        }
        return templateName;
      },

      _getTempNameForGaugeType: function(dijitJson) {
        var templateName;
        var gaugeConfig = dijitJson.config;
        var shape = gaugeConfig.shape;
        if (!shape) {
          return;
        }
        if (shape === 'curved') {
          templateName = 'gauge';
        } else if (shape === 'vertical') {
          templateName = 'vertical_gauge';
        } else if (shape === 'horizontal') {
          templateName = 'horizontal_gauge';
        }
        return templateName;
      },

      _getTempNameForChartType: function(dijitJson) {
        var chartConfig = dijitJson.config;
        var type = chartConfig.type;
        if (!type) {
          return;
        }
        var templateName;

        var stack = chartConfig.stack;
        var area = chartConfig.area;
        var innerRadius = chartConfig.innerRadius;

        if (type === 'pie') {
          templateName = innerRadius ? 'donut' : 'pie';
        } else if (type === 'bar' || type === 'column') {
          templateName = type;
          if (stack === 'normal') {
            templateName = 'stacked_' + templateName;
          } else if (stack === 'percent') {
            templateName = 'percentage_stacked_' + templateName;
          }
        } else if (type === 'line') {
          if (!area) {
            templateName = 'line';
          } else {
            templateName = 'area';
            if (stack === 'normal') {
              templateName = 'stacked_' + templateName;
            } else if (stack === 'percent') {
              templateName = 'percentage_stacked_' + templateName;
            }
          }
        }
        return templateName;
      }

    });
  });