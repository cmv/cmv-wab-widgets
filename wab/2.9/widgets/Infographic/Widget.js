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
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/on',
    'dojo/Deferred',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/popup',
    'dijit/TooltipDialog',
    'jimu/BaseWidget',
    'jimu/dijit/GridLayout',
    'jimu/LayerInfos/LayerInfos',
    'jimu/utils',
    './DijitFactory',
    './dijits/SourceLauncher',
    './_ChartSetting',
    './IGUtils',
    './utils'
  ],
  function(declare, lang, array, html, on, Deferred, _WidgetsInTemplateMixin, dojoPopup,
    TooltipDialog, BaseWidget, GridLayout, LayerInfos, jimuUtils, DijitFactory,
    SourceLauncher, ChartSetting, IGUtils, utils) {

    return declare([BaseWidget, _WidgetsInTemplateMixin], {
      name: 'Infographic',
      baseClass: 'jimu-widget-infographic',
      dijits: null,
      clientFeaturesHandle: null,
      layerInfosObj: null,
      dataSource: null,
      mainDijit: null,
      mainDijitJson: null,
      mainDijitVisible: false,

      postCreate: function() {
        this.inherited(arguments);
        this.dijits = [];
        this.layerInfosObj = LayerInfos.getInstanceSync();
        this._initDijitFactory();

        this.igUtils = new IGUtils({
          appConfig: this.appConfig,
          map: this.map
        });

        this.on('click', lang.hitch(this, function() {
          if (this.chartSettingDialog) {
            dojoPopup.close(this.chartSettingDialog);
          }
        }));

        this._features = [];

        this.layerObject = null;
        this.popupInfo = null;
        this.featureLayerForFrameWork = null;

        this.mainDijitJson = this._getMainDijitJson();
        this.mainDijitVisible = this.mainDijitJson && this.mainDijitJson.visible;
      },

      startup: function() {
        this.inherited(arguments);

        this._createUI();
        this._createChartSettingBtn();
        this._setDataSource();
        if (this.mainDijitVisible && this.dsAvailable) {
          this._proDataSourceDef = this._preprocessingDataSource();
        }
      },

      _setDataSource: function() {
        var dataSource = this.config && this.config.dataSource;

        var res = this._checkDataSource(dataSource);
        this.dsAvailable = !res.code;

        if (!this.dsAvailable && this.mainDijit) {
          this.mainDijit.showNodata(res.message);
        }

        if (!this.dsAvailable || !this.dijits || !this.dijits.length) {
          return;
        }
        this.dijits.forEach(function(dijit) {
          dijit.setDataSource(dataSource);
        });
      },

      onOpen: function() {
        //Only once the data source is initialized in startup
        //the contents of `onOpen` will be executed after init def
        if (this._proDataSourceDef) {
          this._showLoading();
          this._proDataSourceDef.then(function() {
            this._hideLoading();
            this._proDataSourceDef = null;

            this._initMainDijit();
            this._onOpenTriger();
          }.bind(this), function(error) {
            this._hideLoading();
            this._proDataSourceDef = null;
            console.error(error);
          }.bind(this));
        } else {
          this._onOpenTriger();
        }
      },

      resize: function() {
        this.inherited(arguments);
        if (this.layout) {
          this.layout.resize();
        }
        if(this.mainDijit && this.mainDijit.resize){
          this.mainDijit.resize();
        }
      },

      onClose: function() {
        if (this.sourceLauncher) {
          this.sourceLauncher.sleep();
        }
        if (this.chartSettingDialog && this.chartSettingDialog.isShow) {
          dojoPopup.close(this.chartSettingDialog);
          this.chartSettingDialog.isShow = false;
        }
      },

      //Called when extral ds/widget output ds is changed
      onDataSourceDataUpdate: function(dsId, data) {
        if (!this.config.dataSource || dsId !== this.config.dataSource.frameWorkDsId) {
          return;
        }
        if (this.sourceLauncher) {
          this.sourceLauncher.setAppConfigDSFeatures(data.features);
        }
      },

      destroy: function() {
        if (this.sourceLauncher) {
          this.sourceLauncher.destroy();
        }
        if (this.chartSettingDialog) {
          this.chartSettingDialog.destroy();
          this.chartSettingDialog = null;
        }
        this.inherited(arguments);
      },

      _createUI: function() {
        if (!this.config.layout) {
          return;
        }
        array.forEach(this.dijits, lang.hitch(this, function(dijit) {
          dijit.destroy();
        }));

        this.dijits = [];
        var components = array.map(this.config.dijits, function(d) {
          var dijit = DijitFactory.createDijit(d);
          this.dijits.push(dijit);
          return {
            id: d.id,
            dijit: dijit
          };
        }, this);

        this.layout = new GridLayout({
          components: components,
          layoutDefinition: this.config.layout.definition,
          container: this.domNode,
          editable: false
        });

        this.layout.on('initialised', lang.hitch(this, function() {
          array.forEach(this.dijits, lang.hitch(this, function(dijit) {
            dijit.startup();
          }));
        }));
        this.mainDijit = this._getMainDijit();
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

      _onOpenTriger: function() {
        if (!this.mainDijitVisible || !this.dsAvailable) {
          return;
        }
        this._isDOMInitialized().then(function() {
          clearInterval(this.domReadyInterval);
          if (!this.config.dataSource) {
            return;
          }
          if (!this.sourceLauncher) {
            this._initSourceLauncher();
            this.sourceLauncher.start();
          } else {
            this.sourceLauncher.awake();
          }
          this.resize();
        }.bind(this));
      },

      _onClientFeaturesUpdate: function(value) {
        if (!this._shouldUpdateData(value)) {
          return;
        }
        this._oldValue = value;
        this._onDataUpdate(value);
      },

      _onDataUpdate: function(data) {
        if (!this.mainDijit) {
          return;
        }
        this.mainDijit.onDataSourceDataUpdate(data);
        this.mainDijit.startRendering();
      },

      _HandlingOutliers: function(value) {
        if (value === null || typeof value === 'undefined' && this.mainDijit) {
          this.mainDijit.showNodata();
          return true;
        }
      },

      //------------- tools ----------------------
      _showLoading: function() {
        html.removeClass(this.shelter, 'hide');
      },

      _hideLoading: function() {
        html.addClass(this.shelter, 'hide');
      },

      _getMainDijit: function() {
        if (!this.dijits || !this.dijits.length) {
          return;
        }
        var dijit = null;
        var validTypes = ['number', 'gauge', 'chart'];
        dijit = this.dijits.filter(function(dijit) {
          return validTypes.indexOf(dijit.type) > -1;
        })[0]; //Now wo only support one data-needed dijit in a widget

        return dijit;
      },

      _getMainDijitJson: function() {
        if (!this.config || !this.config.dijits || !this.config.dijits.length) {
          return;
        }
        var dijit = null;
        var validTypes = ['number', 'gauge', 'chart'];
        dijit = this.config.dijits.filter(function(dijit) {
          return validTypes.indexOf(dijit.type) > -1;
        })[0]; //Now wo only support one data-needed dijit in a widget

        return dijit;
      },

      _initMainDijit: function() {
        if (!this.mainDijit) {
          return;
        }
        this.mainDijit.setLayerInfo(this.layerObject, this.featureLayerForFrameWork,
          this.popupInfo);
      },

      _createChartSettingBtn: function() {
        if (!this.mainDijitVisible) {
          return;
        }
        if (!this.config.dijits) {
          return;
        }

        if (!array.some(this.config.dijits, function(d) {
            return d.visible && d.type === 'chart';
          }, this)) {
          return;
        }

        this.chartSettingNode = html.create('div', {
          'class': 'chart-setting'
        }, this.domNode);

        this.own(on(this.chartSettingNode, 'click', lang.hitch(this, this._onChartSettingClick)));

        this.chartSettingDialog = new TooltipDialog({
          content: this._createChartSettingContent()
        });

        this.chartSettingDialog.isShow = false;
      },

      _onChartSettingClick: function(evt) {
        if (this.chartSettingDialog.isShow) {
          dojoPopup.close(this.chartSettingDialog);
          this.chartSettingDialog.isShow = false;
        } else {
          dojoPopup.open({
            popup: this.chartSettingDialog,
            around: this.chartSettingNode
          });
          this.chartSettingDialog.isShow = true;
        }
        evt.stopPropagation();
      },

      _createChartSettingContent: function() {
        var chartJson = array.filter(this.config.dijits, function(d) {
          return d.type === 'chart';
        })[0]; //we don't care more than one chart.
        if (!chartJson) {
          console.error('Unknow error');
          return '<div></div>';
        }

        if (!chartJson.config) {
          return '<div></div>';
        }

        var chartSetting = new ChartSetting({
          chartJson: chartJson,
          chartDijit: array.filter(this.dijits, function(d) {
            return d.jsonId === chartJson.id;
          })[0],
          nls: this.nls
        });
        return chartSetting.domNode;
      },

      //Check whether DOM has been initialized, return a deferred
      _isDOMInitialized: function() {
        var deferred = new Deferred();
        setTimeout(function() {
          this.domReadyInterval = setInterval(function() {
            var dijitDomNode = this.mainDijit && this.mainDijit.domNode;
            if (dijitDomNode) {
              var box = html.getMarginBox(dijitDomNode);
              if (box.w && box.h) {
                deferred.resolve();
              }
            }
          }.bind(this), 200);
        }.bind(this), 200);

        return deferred;
      },

      _initSourceLauncher: function() {
        if (!this.config.dataSource) {
          return;
        }
        var dijit = this._getMainDijitJson();
        if (!dijit) {
          return;
        }
        this.sourceLauncher = new SourceLauncher({
          layerObject: this.layerObject,
          map: this.map,
          appConfig: this.appConfig,
          useSelection: this.config.dataSource.useSelection,
          filterByExtent: this.config.dataSource.filterByExtent,
          dataSource: this.config.dataSource,
          dijit: dijit
        });
        this._listenSourceLauncherEvent();
      },

      _listenSourceLauncherEvent: function() {
        this.own(on(this.sourceLauncher, 'data-update', lang.hitch(this, function(value) {
          this._onClientFeaturesUpdate(value);

        })));
        this.own(on(this.sourceLauncher, 'fetching', lang.hitch(this, function() {
          this._showLoading();
        })));
        this.own(on(this.sourceLauncher, 'success', lang.hitch(this, function() {
          this._hideLoading();
        })));
        this.own(on(this.sourceLauncher, 'faild', lang.hitch(this, function(error) {
          console.error(error.message || error);
          this._HandlingOutliers();
          this._hideLoading();
        })));
      },

      _shouldUpdateData: function(value) {
        var isOutliers = this._HandlingOutliers(value);
        if (isOutliers) {
          return false;
        }
        var shouldUpdate = true;
        if (typeof value === 'number') {
          if (value === this._oldValue) {
            shouldUpdate = false;
          }
        } else {
          if (value && value.features && this._oldValue && this._oldValue.features) {
            var oldAttrs = array.map(this._oldValue.features, function(f) {
              return f.attributes;
            });
            var newAttrs = array.map(value.features, function(f) {
              return f.attributes;
            });
            if (jimuUtils.isEqual(oldAttrs, newAttrs)) {
              shouldUpdate = false;
            }
          }
        }
        return shouldUpdate;
      },

      //init DijitFactory
      _initDijitFactory: function() {
        DijitFactory.setNls(this.nls);
        DijitFactory.setMap(this.map);
        DijitFactory.setInSettingPage(false);
        DijitFactory.setAppConfig(this.appConfig);
        DijitFactory.setContext({
          folderUrl: this.folderUrl
        });
      },

      //get value for this.popupInfo, this.layerObject, this.featureLayerForFrameWork
      _preprocessingDataSource: function() {
        var dataSource = this.config && this.config.dataSource;
        var deferred = new Deferred();
        if (!dataSource) {
          deferred.reject('Empty data source');
          return deferred;
        }
        return this.igUtils.preprocessingDataSource(dataSource).then(function(res) {
          this.layerObject = res && res.layerObject;
          this.popupInfo = res && res.popupInfo;
          this.featureLayerForFrameWork = res && res.featureLayerForFrameWork;
          return;
        }.bind(this));
      }

    });
  });