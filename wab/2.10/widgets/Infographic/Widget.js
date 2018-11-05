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
    'jimu/DataSourceManager',
    './dijits/SourceLauncher',
    './dijits/ExtraSourceLauncher',
    './_ChartSetting',
    './IGUtils',
    './utils'
  ],
  function(declare, lang, array, html, on, Deferred, _WidgetsInTemplateMixin, dojoPopup,
    TooltipDialog, BaseWidget, GridLayout, LayerInfos, jimuUtils, DijitFactory,
    DataSourceManager, SourceLauncher, ExtraSourceLauncher, ChartSetting, IGUtils, utils) {

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

      postMixInProperties: function() {
        this.inherited(arguments);
        this.layerInfosObj = LayerInfos.getInstanceSync();
        this._loadingTypes = {};
      },

      postCreate: function() {
        this.inherited(arguments);

        this._initGolbalInfo();

        this._listenDSManagerUpdateEvent();
        //init dijit factory to create all dijit by template
        this._initDijitFactory();
        //hide runtime setting popup when click widget
        this._initSettingIconEvent();
      },

      startup: function() {
        this.inherited(arguments);
        //render ui by config
        this._renderByConfig(this.config);
        //init main dijit after dijits are created
        this.mainDijit = this._getMainDijit();
        //create run time setting icon
        this._createRuntimeSettingIocn(this.config);
        //check data source
        this._checkDataSource(this.config);
        //if main dijit is visible and data source is valid,
        //continue processing data sources for more information.
        if (this.mainDijitVisible && this._avalidDataSource) {
          this._processdsdef = this._preprocessingDataSource();
        }
      },

      _listenDSManagerUpdateEvent: function() {
        this.exdsBeginUpdateHandle = on(this.dataSourceManager, 'begin-update',
          lang.hitch(this, function(dsid) {
            this._handleLoadingStatusForExds(dsid, true);
          }));
      },

      _checkDataSource: function(config) {
        var dataSource = config && config.dataSource;
        var res = this._checkDataSourceCode(dataSource);
        this._avalidDataSource = res.code === 0;
        if (!this._avalidDataSource && this.mainDijit) {
          this.mainDijit.showNodata(res.message);
        }
      },

      onOpen: function() {
        //Only once the data source is initialized in startup
        //the contents of `onOpen` will be executed after init def
        if (this._processdsdef) { //first open
          this._processDataSource();
        } else { //not first open
          this._onOpenTriger();
        }
      },

      _onOpenTriger: function() {
        if (!this.mainDijitVisible || !this._avalidDataSource) {
          return;
        }

        //ensure this.domNode is wide and high
        this._isDOMInitialized().then(function() {
          clearInterval(this.domReadyInterval);
          this._initSourceLaunchers();
          this.resize();
        }.bind(this));
      },

      //called by source launcher, returns the calculated data to render widget
      _onMainValueUpdate: function(value) {
        if (!this.mainDijit) {
          return;
        }
        var type = 'MAIN';
        if (!this._shouldUpdateValue(value, type)) {
          return;
        }
        if (this.mainDijit.type === 'gauge') {
          value = this._spellGaugeValueObj();
          if (!this._isGaugeValueObjValid(value)) {
            return;
          }
        }
        this.mainDijit.onDataSourceDataUpdate(value);
        this.mainDijit.startRendering();
      },

      _onRangeValueUpdate: function(value, isFirst) {
        var prefix = isFirst ? 'RANGE1' : 'RANGE2';
        if (!this._shouldUpdateValue(value, prefix)) {
          return;
        }

        value = this._spellGaugeValueObj();

        if (!this._isGaugeValueObjValid(value)) {
          return;
        }
        this.mainDijit.onDataSourceDataUpdate(value);
        this.mainDijit.startRendering();
      },

      _processDataSource: function() {
        this.showLoading('process-ds');
        this._processdsdef.then(function() {
          this.hideLoading('process-ds');
          this._processdsdef = null;
          this._setDataSource();
          this._setLayerInfoToMainDijit();
          this._onOpenTriger();
        }.bind(this), function(error) {
          this.hideLoading('process-ds');
          this._processdsdef = null;
          console.error(error);
        }.bind(this));
      },

      _setDataSource: function() {
        var dataSource = this.config && this.config.dataSource;
        if (!dataSource) {
          return;
        }
        if (!this.dijits || !this.dijits.length) {
          return;
        }
        this.dijits.forEach(function(dijit) {
          dijit.setDataSource(dataSource);
        });
      },

      _initSourceLaunchers: function() {
        if (!this.config.dataSource) {
          return;
        }
        var dijitJson = this.mainDijitJson || this._getMainDijitJson();
        // If it is the first to open, create sourceLauncher, otherwise, wake up it
        if (!this.sourceLauncher) {
          this._initSourceLauncher();
          this.sourceLauncher.start();
        } else {
          this.sourceLauncher.awake();
        }
        //For gauge, we need create more extra stat source launcher for statistical range
        if (dijitJson.type === 'gauge') {
          this._initRangeSourceLauncher(dijitJson);
        }
      },

      resize: function() {
        this.inherited(arguments);
        if (this.layout) {
          this.layout.resize();
        }
        if (this.mainDijit && this.mainDijit.resize) {
          this.mainDijit.resize();
        }
      },

      onClose: function() {
        if (this.sourceLauncher) {
          this.sourceLauncher.sleep();
        }
        if (this.rangeSourceLauncher1) {
          this.rangeSourceLauncher1.sleep();
        }
        if (this.rangeSourceLauncher2) {
          this.rangeSourceLauncher2.sleep();
        }
        if (this.runtimeSettingDialog && this.runtimeSettingDialog.isShow) {
          dojoPopup.close(this.runtimeSettingDialog);
          this.runtimeSettingDialog.isShow = false;
        }
      },

      //Called when extral ds/widget output ds is changed
      onDataSourceDataUpdate: function(dsId, data) {
        this._handleLoadingStatusForExds(dsId, false);
        var ds = this.config.dataSource;
        var ds1 = this.rangeDataSource1;
        var ds2 = this.rangeDataSource2;
        if (ds && dsId === ds.frameWorkDsId) {
          if (this.sourceLauncher) {
            this.sourceLauncher.setAppConfigDSFeatures(data.features);
          }
        }
        if (ds1 && dsId === ds1.frameWorkDsId) {
          if (this.rangeSourceLauncher1) {
            this.rangeSourceLauncher1.setAppConfigDSFeatures(data.features);
          }
        }
        if (ds2 && dsId === ds2.frameWorkDsId) {
          if (this.rangeSourceLauncher2) {
            this.rangeSourceLauncher2.setAppConfigDSFeatures(data.features);
          }
        }
      },

      _handleLoadingStatusForExds: function(dsid, show) {
        var ds = this.config.dataSource;
        var ds1 = this.rangeDataSource1;
        var ds2 = this.rangeDataSource2;
        var mdsid = ds && ds.frameWorkDsId;
        var ds1id = ds1 && ds1.frameWorkDsId;
        var ds2id = ds2 && ds2.frameWorkDsId;
        if (dsid === mdsid || dsid === ds1id || dsid === ds2id) {
          if (show) {
            this.showLoading(dsid);
          } else {
            this.hideLoading(dsid);
          }

        }
      },

      destroy: function() {
        if (this.sourceLauncher) {
          this.sourceLauncher.destroy();
        }
        if (this.rangeSourceLauncher1) {
          this.rangeSourceLauncher1.destroy();
        }
        if (this.rangeSourceLauncher2) {
          this.rangeSourceLauncher2.destroy();
        }
        if (this.runtimeSettingDialog) {
          this.runtimeSettingDialog.destroy();
          this.runtimeSettingDialog = null;
        }
        if (this.exdsBeginUpdateHandle && this.exdsBeginUpdateHandle.remove) {
          this.exdsBeginUpdateHandle.remove();
          this.exdsBeginUpdateHandle = null;
        }
        this._loadingTypes = {};
        this.inherited(arguments);
      },

      // -------- init ------
      _initGolbalInfo: function() {
        this.dataSourceManager = DataSourceManager.getInstance();
        this._features = [];
        this.layerObject = null;
        this.popupInfo = null;
        this.featureLayerForFrameWork = null;

        this.mainDijitJson = this._getMainDijitJson();
        if (!this.mainDijitJson) {
          return;
        }
        this._initRangeValue(this.mainDijitJson);
        this._ininRangeDataSource(this.mainDijitJson);
        this.mainDijitVisible = this.mainDijitJson && this.mainDijitJson.visible;
        this.dijits = [];
        //igUtils used to process map data: definition, layer object, popup info ...
        this.igUtils = new IGUtils({
          appConfig: this.appConfig,
          map: this.map
        });
      },

      _initDijitFactory: function() {
        DijitFactory.setNls(this.nls);
        DijitFactory.setMap(this.map);
        DijitFactory.setInSettingPage(false);
        DijitFactory.setAppConfig(this.appConfig);
        DijitFactory.setContext({
          folderUrl: this.folderUrl
        });
      },

      _initSettingIconEvent: function() {
        this.on('click', lang.hitch(this, function() {
          if (this.runtimeSettingDialog) {
            dojoPopup.close(this.runtimeSettingDialog);
          }
        }));
      },

      _renderByConfig: function(config) {
        if (!config || !config.layout || !config.dijits) {
          return;
        }
        this._clearDijits();
        this._createLayoutWithDijits(config);
      },

      _initRangeSourceLauncher: function(dijitJson) {
        var rangeStatistic = this._initRangeData(dijitJson);
        var rst1 = rangeStatistic.rst1;
        var rst2 = rangeStatistic.rst2;
        if (!this.rangeSourceLauncher1) {
          if (rst1 && this.rangeDataSource1) {
            this._initRangeLauncher(rst1, this.rangeDataSource1, true);
            this.rangeSourceLauncher1.start();
          }
        } else {
          this.rangeSourceLauncher1.awake();
        }
        if (!this.rangeSourceLauncher2) {
          if (rst2 && this.rangeDataSource2) {
            this._initRangeLauncher(rst2, this.rangeDataSource2, false);
            this.rangeSourceLauncher2.start();
          }
        } else {
          this.rangeSourceLauncher2.awake();
        }
      },

      //------------- tools ----------------------

      showLoading: function(id) {
        this._loadingTypes[id] = true;
        this._showLoading();
      },

      hideLoading: function(id) {
        this._loadingTypes[id] = false;
        var shouldHide = this._shouldHideLoading();
        if (shouldHide) {
          this._hideLoading();
        }
      },

      _shouldHideLoading: function() {
        if (!this._loadingTypes) {
          return;
        }
        var ids = Object.keys(this._loadingTypes);
        var values = ids.map(function(id) {
          return this._loadingTypes[id];
        }.bind(this));
        return values.every(function(value) {
          return !value;
        });
      },

      _showLoading: function() {
        if (html.hasClass(this.shelter, 'hide')) {
          html.removeClass(this.shelter, 'hide');
        }
      },

      _hideLoading: function() {
        if (!html.hasClass(this.shelter, 'hide')) {
          html.addClass(this.shelter, 'hide');
        }
      },

      _HandlingOutliers: function(value) {
        if (!this.mainDijit) {
          return;
        }
        if (!utils.isValidValue(value)) {
          this.mainDijit.showNodata();
          return true;
        }
      },

      _spellGaugeValueObj: function() {
        return {
          value: this.MAIN_VALUE,
          ranges: [this.RANGE1_VALUE, this.RANGE2_VALUE]
        };
      },

      _isGaugeValueObjValid: function(value) {
        var valueObj = value;
        var ranges = valueObj && valueObj.ranges;
        if (!valueObj || !ranges) {
          return false;
        }
        var mainValue = valueObj.value;
        var range1Value = ranges[0];
        var range2Value = ranges[1];

        var vaild = utils.isValidValue(mainValue) &&
          utils.isValidValue(range1Value) &&
          utils.isValidValue(range2Value);

        if (!vaild) {
          this.mainDijit.showNodata();
        }
        return vaild;
      },

      _checkDataSourceCode: function(dataSource) {
        var mainDijitJson = this.mainDijitJson;
        if (!mainDijitJson) {
          return {};
        }
        var main, r1, r2;
        main = utils.checkDataSourceIsVaild(dataSource, mainDijitJson, this.map, this.appConfig, 'value');

        if (mainDijitJson.type === 'gauge') {
          if (this.rangeDataSource1) {
            r1 = utils.checkDataSourceIsVaild(this.rangeDataSource1, mainDijitJson, this.map, this.appConfig, 'range1');
          }
          if (this.rangeDataSource2) {
            r2 = utils.checkDataSourceIsVaild(this.rangeDataSource2, mainDijitJson, this.map, this.appConfig, 'range2');
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
      },

      _clearDijits: function() {
        if (this.dijits && this.dijits.length) {
          this.dijits.forEach(lang.hitch(this, function(dijit) {
            dijit.destroy();
          }));
        }
        this.dijits = [];
      },

      _createLayoutWithDijits: function(config) {
        var dijitJsons = config.dijits;
        if (!dijitJsons || !dijitJsons.length) {
          return;
        }
        var components = dijitJsons.map(function(d) {
          var dijit = DijitFactory.createDijit(d);
          this.dijits.push(dijit);
          return {
            id: d.id,
            dijit: dijit
          };
        }, this);

        this.layout = new GridLayout({
          components: components,
          layoutDefinition: config.layout.definition,
          container: this.domNode,
          editable: false
        });

        this.layout.on('initialised', lang.hitch(this, function() {
          array.forEach(this.dijits, lang.hitch(this, function(dijit) {
            dijit.startup();
          }));
        }));
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

      _initRangeValue: function(dijitJson) {
        if (!dijitJson || dijitJson.type !== 'gauge') {
          return;
        }
        var fixedValue = utils.getRangeFixedValue(dijitJson);
        this.RANGE1_VALUE = fixedValue.range1;
        this.RANGE2_VALUE = fixedValue.range2;
      },

      _ininRangeDataSource: function(dijitJson) {
        var rds = utils.getRangeDataSource(dijitJson);
        this.rangeDataSource1 = rds.range1;
        this.rangeDataSource2 = rds.range2;
      },

      _setLayerInfoToMainDijit: function() {
        if (!this.mainDijit) {
          return;
        }
        this.mainDijit.setLayerInfo(this.layerObject, this.featureLayerForFrameWork,
          this.popupInfo);
      },

      _createRuntimeSettingIocn: function(config) {
        if (!this.mainDijitVisible) {
          return;
        }
        if (!config.dijits || !config.dijits.length) {
          return;
        }

        if (!config.dijits.some(function(d) {
            return d.visible && d.type === 'chart';
          }, this)) {
          return;
        }

        this.runtimeSettingIcon = html.create('div', {
          'class': 'chart-setting'
        }, this.domNode);

        this.own(on(this.runtimeSettingIcon, 'click', lang.hitch(this, this._onRuntimeSettingIconClicked)));

        this.runtimeSettingDialog = new TooltipDialog({
          content: this._createChartSettingContent(config)
        });

        this.runtimeSettingDialog.isShow = false;
      },

      _onRuntimeSettingIconClicked: function(evt) {
        if (this.runtimeSettingDialog.isShow) {
          dojoPopup.close(this.runtimeSettingDialog);
          this.runtimeSettingDialog.isShow = false;
        } else {
          dojoPopup.open({
            popup: this.runtimeSettingDialog,
            around: this.runtimeSettingIcon
          });
          this.runtimeSettingDialog.isShow = true;
        }
        evt.stopPropagation();
      },

      _createChartSettingContent: function(config) {
        var chartJson = config.dijits.filter(function(d) {
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
          chartDijit: this.dijits.filter(function(d) {
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
        var ds = this.config.dataSource;
        if (!ds) {
          return;
        }
        var dijitJson = this._getMainDijitJson();
        if (!dijitJson || !dijitJson.config) {
          return;
        }
        //rds means range data source, rst means range statistic
        var mainStatistic = null;
        if (dijitJson.type === 'chart') {
          mainStatistic = utils.getStatisticForChart(dijitJson.config);
        } else {
          var statistic = utils.getStatisticForGauge(dijitJson.config);
          mainStatistic = statistic.value;
        }

        if (ds.dataSourceType === 'DATA_SOURCE_FROM_FRAMEWORK') {
          this.sourceLauncher = new ExtraSourceLauncher({
            appConfig: this.appConfig,
            dataSource: ds,
            statistic: mainStatistic,
            returnFeatures: dijitJson.type === 'chart',
            formatResult: false
          });
        } else {
          this.sourceLauncher = new SourceLauncher({
            layerObject: this.layerObject,
            map: this.map,
            appConfig: this.appConfig,
            useSelection: ds.useSelection,
            filterByExtent: ds.filterByExtent,
            dataSource: ds,
            config: dijitJson.config,
            statistic: mainStatistic,
            returnFeatures: dijitJson.type === 'chart'
          });
        }

        this._listenSourceLauncherEvent();
      },

      _initRangeData: function(dijitJson) {
        if (dijitJson.type !== 'gauge') {
          return;
        }
        if (!dijitJson || !dijitJson.config) {
          return;
        }
        //rds means range data source, rst means range statistic
        var rst1, rst2;

        var statistic = utils.getStatisticForGauge(dijitJson.config);
        rst1 = statistic.range1;
        rst2 = statistic.range2;
        return {
          rst1: rst1,
          rst2: rst2
        };
      },

      _initRangeLauncher: function(rst, rds, isFirst) {
        if (isFirst) {
          if (rst) {
            this.rangeSourceLauncher1 = new ExtraSourceLauncher({
              appConfig: this.appConfig,
              dataSource: rds,
              statistic: rst,
              returnFeatures: false,
              formatResult: true
            });
            this._listenRangeLauncherEvent(this.rangeSourceLauncher1, true);
          }
        } else {
          if (rst) {
            this.rangeSourceLauncher2 = new ExtraSourceLauncher({
              appConfig: this.appConfig,
              dataSource: rds,
              statistic: rst,
              returnFeatures: false,
              formatResult: true
            });
            this._listenRangeLauncherEvent(this.rangeSourceLauncher2, false);
          }
        }

      },

      _listenSourceLauncherEvent: function() {
        this.own(on(this.sourceLauncher, 'data-update', lang.hitch(this, function(value) {
          this._onMainValueUpdate(value);

        })));
        this.own(on(this.sourceLauncher, 'loading', lang.hitch(this, function(id) {
          this.showLoading(id);
        })));
        this.own(on(this.sourceLauncher, 'unloading', lang.hitch(this, function(id) {
          this.hideLoading(id);
        })));
        this.own(on(this.sourceLauncher, 'failed', lang.hitch(this, function() {
          this._HandlingOutliers();
        })));

        this.own(on(this.sourceLauncher, 'start', lang.hitch(this, function() {
          this._onMainSourceLauncherStart();
        })));
        this.own(on(this.sourceLauncher, 'done', lang.hitch(this, function() {
          this._onMainSourceLauncherDone();
        })));
      },

      _onMainSourceLauncherStart: function() {
        if (this.mainDijit && typeof this.mainDijit.onUpdateDataStart === 'function') {
          this.mainDijit.onUpdateDataStart();
        }
      },

      _onMainSourceLauncherDone: function() {
        if (this.mainDijit && typeof this.mainDijit.onUpdateDataDone === 'function') {
          this.mainDijit.onUpdateDataDone();
        }
      },

      _listenRangeLauncherEvent: function(rangeLauncher, isFirstRange) {
        if (!rangeLauncher) {
          return;
        }
        this.own(on(rangeLauncher, 'data-update', lang.hitch(this, function(value) {
          this._onRangeValueUpdate(value, isFirstRange);
        })));
      },

      _isDifferentValues: function(value, type) {
        var different = true;
        var oldValue = this[type + '_VALUE'];

        if (value && typeof value.hasStatisticsed !== 'undefined') {
          var newAttrs = null,
            oldAttrs = null;
          if (value.features) {
            newAttrs = value.features.map(function(f) {
              return f.attributes;
            });
          }
          if (oldValue && oldValue.features) {
            oldAttrs = oldValue.features.map(function(f) {
              return f.attributes;
            });
          }
          if (jimuUtils.isEqual(oldAttrs, newAttrs)) {
            different = false;
          }
        } else {
          different = value !== oldValue;
        }
        if (different) {
          this[type + '_VALUE'] = value;
        }
        return different;
      },

      _shouldUpdateValue: function(value, type) {
        var isDifferent = this._isDifferentValues(value, type);
        var isOutliers = this._HandlingOutliers(value);
        return isDifferent && !isOutliers;
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