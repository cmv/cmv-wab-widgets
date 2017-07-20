///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
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
    'dojo/_base/array',
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
    '../dijits/utils',
    'libs/storejs/store',
    'jimu/dijit/CheckBox',
    'dijit/form/ValidationTextBox'
  ],
  function(on, query, declare, array, BaseWidgetSetting, _WidgetsInTemplateMixin, html, lang, FeatureLayer,
    templatePopup, DijitFactory, DijitSettingFactory, GridLayout, DataSource, _DataSourcePopup, ViewStack, Message,
    Popup, jimuUtils, DataSourceManager, LayerInfos, utils, store, CheckBox) {

    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-infographic-setting',
      dijits: null,
      dijitSettings: null,
      _dataSource: null,
      dataSourceManager: null,
      layerInfosObj: null,

      _initLayout: null,
      _initVisiblity: {},

      postMixInProperties: function() {
        this.inherited(arguments);
        lang.mixin(this.nls, window.jimuNls.common);
        this.dataSourceManager = DataSourceManager.getInstance();
        this.layerInfosObj = LayerInfos.getInstanceSync();
      },

      postCreate: function() {
        this.inherited(arguments);
        this._initUI();
        this._initEvents();
        if (this.config) {
          this._initLayout = this.config.layout;
          if (this.config.dijits) {
            this.config.dijits.forEach(lang.hitch(this, function(d) {
              this._initVisiblity[d.id] = d.visible;
            }));
          }
          this.setConfig(this.config);
        }
        DijitSettingFactory.setNls(this.nls);
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

      startup: function() {
        this.inherited(arguments);
        if (this.config.dijits) { //means configured
          this._initConfigUI();
        } else {
          this._chooseTemplate();
        }
      },

      _initUI: function() {
        this.settingsViewStack = new ViewStack({
          viewType: 'dom',
          views: []
        }, this.settingContent);
        this.settingsViewStack.addView(this.settingTip);
      },

      _initEvents: function() {
        //init preview eyes event
        this.own(on(this.previewEyes, 'click', lang.hitch(this, function(event) {
          var target = event.target || event.srcElement;
          var vaildDom = null;
          if (html.hasClass(target, 'preview-eye')) {
            vaildDom = target;
          } else if (html.hasClass(target.parentElement, 'preview-eye')) {
            vaildDom = target.parentElement;
          } else {
            return;
          }
          this._selectedEye(vaildDom);
        })));
      },

      _selectedEye: function(target) {
        var id = target.id;
        var eyeIconDiv = query('div', target)[0];
        if (html.hasClass(eyeIconDiv, 'eye-selected')) {
          if (this._getSelectedEyesCount() > 1) {
            html.removeClass(eyeIconDiv, 'eye-selected');
            html.removeClass(target, 'preview-eye-selected');
            this._switchDijitView(id, false);
          }
        } else {
          html.addClass(eyeIconDiv, 'eye-selected');
          html.addClass(target, 'preview-eye-selected');
          this._switchDijitView(id, true);
        }
      },
      //Gets the number of dijit to display
      _getSelectedEyesCount: function() {
        return query('.eye-selected', this.previewEyes).length;
      },

      onDataSourceDataUpdate: function(data) {
        array.forEach(this.dijits, lang.hitch(this, function(dijit) {
          dijit.onDataSourceDataUpdate(data);
        }));
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
          //clear preview eyes
          html.empty(this.previewEyes);
          this.config = this._createConfigFromTemplate(template);
          this._initConfigUI();

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

      _initConfigUI: function() {
        this._createDijits();
        this._createSettings();
        this._switchSettingsView(0);
        this._setDataSource(this.config.dataSource);
      },

      _setDataSource: function(dataSource) {
        if (!dataSource) {
          this.dataSourceUseSelection.setStatus(false);
          this.dataSourceFilterByExtent.setStatus(false);
          return;
        }

        if (!this._dataSource) {
          this._dataSource = dataSource;
        }

        // this.onDataSourceDataUpdate({
        //   features: []
        // });

        this.urlTextBox.set('value', dataSource.name);

        if (dataSource.dataSourceType === 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
          this.dataSourceUseSelection.setStatus(true);
          this.dataSourceFilterByExtent.setStatus(true);

          if (typeof dataSource.useSelection === 'undefined') {
            this.dataSourceUseSelection.setValue(true);
          }

          if (dataSource.filterByExtent) {
            this.dataSourceFilterByExtent.setValue(true);
          }

          if (dataSource.useSelection) {
            this.dataSourceUseSelection.setValue(true);
          }

          //we don't care feature layers in map service for now
          var layer = this.map.getLayer(dataSource.layerId);
          if (layer && layer.currentMode === FeatureLayer.MODE_ONDEMAND) {
            this.dataSourceFilterByExtent.setValue(true);
            this.dataSourceFilterByExtent.setStatus(false);
          }
        } else {
          this.dataSourceUseSelection.setStatus(true);
          this.dataSourceFilterByExtent.setStatus(true);

          var dsConfig = this.appConfig.dataSource.dataSources[dataSource.frameWorkDsId];
          if (dsConfig && dsConfig.filterByExtent) {
            this.dataSourceFilterByExtent.setValue(true);
          } else {
            this.dataSourceFilterByExtent.setValue(false);
          }

          this.dataSourceUseSelection.setValue(false);

          this.dataSourceUseSelection.setStatus(false);
          this.dataSourceFilterByExtent.setStatus(false);
        }

        array.forEach(this.dijitSettings, lang.hitch(this, function(dijitSetting) {
          dijitSetting.setDataSource(dataSource);
        }));

        array.forEach(this.dijits, lang.hitch(this, function(dijit) {
          dijit.setDataSource(dataSource);
        }));

        //For preview purpose, we only fetch data once.
        if (dataSource.dataSourceType === "DATA_SOURCE_FEATURE_LAYER_FROM_MAP") {
          var layerInfo = this.layerInfosObj.getLayerInfoById(dataSource.layerId);
          if (layerInfo) {
            layerInfo.getLayerObject().then(lang.hitch(this, function(layerObject) {
              if (layerObject) {
                var features = utils.getClientFeaturesFromMap(
                  this.map,
                  layerObject,
                  dataSource.useSelection,
                  dataSource.filterByExtent
                );
                this.onDataSourceDataUpdate({
                  features: features
                });
              }
            }));
          }
        } else if (dataSource.dataSourceType === "DATA_SOURCE_FROM_FRAMEWORK") {
          var data = this.dataSourceManager.getData(dataSource.frameWorkDsId);
          if (data) {
            var features = utils.filterFeaturesByDataSourceSetting(data.features, dataSource, this.map);
            this.onDataSourceDataUpdate({
              features: features
            });
          }
        }
      },

      _createDijits: function() {
        if (this.dijits && this.dijits.length > 0) {
          array.forEach(this.dijits, lang.hitch(this, function(dijit) {
            dijit.destroy();
          }));
          this.dijits = [];
        } else {
          this.dijits = [];
        }
        if (this.layout) {
          this.layout.destroy();
          this.layout = null;
        }

        var dijitsForLayout = array.map(this.config.dijits, function(d, index) {
          var dijit = DijitFactory.createDijit(d);
          this._connectEyeAndDijit(d, index);
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

        this.layout.on('initialised', lang.hitch(this, function(){
          array.forEach(this.dijits, lang.hitch(this, function(dijit) {
            dijit.startup();
          }));
        }));
      },

      _connectEyeAndDijit: function(dijit, index) {
        if (!dijit.type || !dijit.id) {
          return;
        }
        var typeClass = "";

        if (dijit.type === 'text') {
          typeClass = 'textEye';
        } else if (dijit.type === 'image') {
          typeClass = 'imageEye';
        } else if (dijit.type === 'number') {
          typeClass = 'numberEye';
        } else if (dijit.type === 'gauge') {
          typeClass = 'gaugeEye';
        } else if (dijit.type === 'chart') {
          typeClass = 'chartEye';
        }
        var domStr;
        if (index === 0) {
          domStr = '<div class="preview-eye ' + typeClass + '"><div></div></div>';
        } else {
          domStr = '<div class="preview-eye marginleft10 ' + typeClass + '"><div></div></div>';
        }
        var vaildDom = html.toDom(domStr);

        html.place(vaildDom, this.previewEyes);
        vaildDom.id = dijit.id;
        if (dijit.visible) {
          this._selectedEye(vaildDom);
        }
      },

      //Toggle the display and hide of a dijit
      _switchDijitView: function(id, isDisplay) {
        if (this.layout) {
          this.layout.setVisible(id, isDisplay);
        }
        array.forEach(this.config.dijits, function(d) {
          if (d.id === id) {
            d.visible = isDisplay;
          }
        }, this);
      },

      //Toggle the display and hide of a dijit's setting
      _switchSettingsView: function(label) {
        this.settingsViewStack.switchView(label);
      },

      _createSettings: function() {
        if (this.dijitSettings && this.dijitSettings.length > 0) {
          array.forEach(this.dijitSettings, lang.hitch(this, function(dijitSetting) {
            this.settingsViewStack.removeView(dijitSetting);
            dijitSetting.destroy();
          }));
        }
        this.dijitSettings = null;
        this.dijitSettings = array.map(this.config.dijits, lang.hitch(this, function(d) {
          var dijitSetting = DijitSettingFactory.createDijitSetting(d);
          dijitSetting.label = d.id;
          this.settingsViewStack.addView(dijitSetting);
          return dijitSetting;
        }));
      },

      _createConfigFromTemplate: function(template) {
        var config = this._fixDijitId(template);

        this._initLayout = template.layout;
        template.dijits.forEach(lang.hitch(this, function(d) {
          this._initVisiblity[d.id] = d.visible;
        }));

        this._setDefaultColor(config);

        if (this.config.dataSource) {
          config.dataSource = this.config.dataSource;
        }
        return config;
      },

      _fixDijitId: function(config) {
        var idPrefix = this._getWid();
        this._visitContent(config.layout.definition, function(componentState) {
          componentState.id = idPrefix + '-' + componentState.id;
        });

        array.forEach(config.dijits, function(dijitJson) {
          dijitJson.id = idPrefix + '-' + dijitJson.id;
        }, this);

        config.wid = idPrefix;

        return config;
      },

      _onResetLayoutClicked: function() {
        this.config.layout = this._initLayout;
        array.forEach(this.config.dijits, function(d) {
          d.visible = this._initVisiblity[d.id];
        }, this);
        html.empty(this.previewEyes);
        this._initConfigUI();

        //choose data source
        if (!jimuUtils.isEqual(this.config.dataSource, this._dataSource)) {
          this._setDataSource(this._dataSource);
        }
      },

      _getWid: function() {
        //wid is like widget id, which is ued to identify widget.
        //we can't use widget id because the new added widget does not have id.
        return jimuUtils.getRandomString();
      },

      /**
       * set all dijits default background and font color to fit the theme
       */
      _setDefaultColor: function(config) {
        var bgColor, color,
          gaugeColor = '#12DDF9',
          gaugeTextColor = '#12DDF9',
          gaugeLabelColor = '#fff',
          gaugeBgColor = '#1E5F6F';

        if (this.appConfig.theme.name === 'DashboardTheme' &&
          (this.appConfig.theme.styles[0] === 'default' || this.appConfig.theme.styles[0] === 'style3')) {
          bgColor = '#222222';
          color = '#fff';
        } else if (this.appConfig.theme.name === 'DartTheme') {
          bgColor = '#4c4c4c';
          color = '#fff';
        } else {
          return;
        }

        this._setDefaultBackgroundColor(config, bgColor);
        this._setDefaultTextColor(config, color);
        this._setGaugeColor(config, gaugeColor, gaugeTextColor, gaugeLabelColor, gaugeBgColor);
      },
      _setGaugeColor: function(config, gaugeColor, gaugeTextColor, gaugeLabelColor, gaugeBgColor) {
        array.forEach(config.dijits, function(dijitJson) {
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
        }, this);
      },
      _setDefaultBackgroundColor: function(config, bgColor) {
        array.forEach(config.dijits, function(dijitJson) {
          var dijitConfig = dijitJson.config;
          if (!dijitConfig) {
            return;
          }
          switch (dijitJson.type) {
            case 'text':
            case 'image':
            case 'number': {
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
            }
            case 'chart': {
              if (!dijitConfig.backgroundColor) {
                dijitConfig.backgroundColor = bgColor;
              }
              break;
            }
            case 'gauge': {
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
          }
        }, this);
      },
      _setDefaultTextColor: function(config, color) {
        array.forEach(config.dijits, function(dijitJson) {
          var dijitConfig = dijitJson.config;
          if (!dijitConfig) {
            return;
          }
          switch (dijitJson.type) {
            case 'text':
            case 'number': {
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
            }
            case 'chart': {
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
            }
            case 'gauge': {
              break;
            }
          }
        }, this);
      },

      _visitContent: function(content, cb) {
        array.forEach(content, function(item) {
          if (item.type === 'component') {
            cb(item.componentState);
          } else {
            if (item.content) {
              this._visitContent(item.content, cb);
            }
          }
        }, this);
      },

      setConfig: function(config) {
        this.config = config;
      },

      getConfig: function() {
        if (!this._dataSource && this._hasDijitRequireDataSource()) {
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
        array.forEach(this.config.dijits, function(d) {
          var dijitSetting = DijitSettingFactory.getDijitSetting(d);
          d.config = dijitSetting.getConfig();
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

      _hasDijitRequireDataSource: function() {
        return array.filter(this.config.dijits, function(d) {
          return ['chart', 'gauge', 'number'].indexOf(d.type) > -1;
        }).length > 0;
      },

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
          this.urlTextBox.set('value', this._dataSource.name);
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
      }
    });
  });