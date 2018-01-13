///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2017 Esri. All Rights Reserved.
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
    'dijit/_WidgetsInTemplateMixin',
    'dijit/popup',
    'dijit/TooltipDialog',
    'jimu/BaseWidget',
    'jimu/dijit/GridLayout',
    'jimu/DataSourceManager',
    'jimu/LayerInfos/LayerInfos',
    'jimu/utils',
    './DijitFactory',
    './dijits/utils',
    './_ChartSetting'
  ],
  function(declare, lang, array, html, on, _WidgetsInTemplateMixin, dojoPopup, TooltipDialog, BaseWidget, GridLayout,
    DataSourceManager, LayerInfos, jimuUtils, DijitFactory, utils, ChartSetting) {

    return declare([BaseWidget, _WidgetsInTemplateMixin], {
      name: 'Infographic',
      baseClass: 'jimu-widget-infographic',
      dijits: null,
      clientFeaturesHandle: null,
      layerInfosObj: null,

      postCreate: function() {
        this.inherited(arguments);
        this.dijits = [];
        this.layerInfosObj = LayerInfos.getInstanceSync();
        DijitFactory.setNls(this.nls);
        DijitFactory.setMap(this.map);
        DijitFactory.setInSettingPage(false);
        DijitFactory.setAppConfig(this.appConfig);
        DijitFactory.setContext({
          folderUrl: this.folderUrl
        });

        this.on('click', lang.hitch(this, function(){
          if(this.chartSettingDialog){
            dojoPopup.close(this.chartSettingDialog);
          }
        }));

        this._features = [];
      },

      startup: function() {
        this.inherited(arguments);
        this._createUI();
        this._createChartSettingBtn();
      },

      onOpen: function(){
        if (!this.config.dataSource) {
          return;
        }
        //this.config.dataSource: {dataSourceType,frameWorkDsId,name,useSelection}
        if (this.config.dataSource.dataSourceType === "DATA_SOURCE_FEATURE_LAYER_FROM_MAP") {
          var layerInfo = this.layerInfosObj.getLayerInfoById(this.config.dataSource.layerId);

          if (layerInfo) {
            layerInfo.getLayerObject().then(lang.hitch(this, function(layerObject) {
              if (layerObject) {
                this.clientFeaturesHandle = utils.listenClientFeaturesFromMap(
                  this.map,
                  layerObject,
                  this.config.dataSource.useSelection,
                  this.config.dataSource.filterByExtent,
                  lang.hitch(this, this._onClientFeaturesUpdate)
                );
              }
            }));
          }
        } else if (this.config.dataSource.dataSourceType === "DATA_SOURCE_FROM_FRAMEWORK") {
          var data = DataSourceManager.getInstance().getData(this.config.dataSource.frameWorkDsId);
          if (data) {
            this._onDataUpdate(data);
          }
        }
      },

      onClose: function(){
        this._releaseHanlde();
        if(this.chartSettingDialog && this.chartSettingDialog.isShow){
          dojoPopup.close(this.chartSettingDialog);
          this.chartSettingDialog.isShow = false;
        }
      },

      destroy: function() {
        this._releaseHanlde();
        if(this.chartSettingDialog){
          this.chartSettingDialog.destroy();
          this.chartSettingDialog = null;
        }
        this.inherited(arguments);
      },

      _releaseHanlde: function() {
        if (this.clientFeaturesHandle) {
          this.clientFeaturesHandle.remove();
        }
        this.clientFeaturesHandle = null;
      },

      _createUI: function() {
        if(!this.config.layout){
          return;
        }
        array.forEach(this.dijits, lang.hitch(this, function(dijit) {
          dijit.destroy();
        }));

        this.dijits = [];

        var components = array.map(this.config.dijits, function(d) {
          var dijit = DijitFactory.createDijit(d);
          dijit.setDataSource(this.config.dataSource);
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

        this.layout.on('initialised', lang.hitch(this, function(){
          array.forEach(this.dijits, lang.hitch(this, function(dijit) {
            dijit.startup();
          }));
        }));
      },

      _createChartSettingBtn: function(){
        if(!this.config.dijits){
          return;
        }

        if(!array.some(this.config.dijits, function(d){
          return d.visible && d.type === 'chart';
        }, this)){
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

      _onChartSettingClick: function(evt){
        if(this.chartSettingDialog.isShow){
          dojoPopup.close(this.chartSettingDialog);
          this.chartSettingDialog.isShow = false;
        }else{
          dojoPopup.open({
            popup: this.chartSettingDialog,
            around: this.chartSettingNode
          });
          this.chartSettingDialog.isShow = true;
        }
        evt.stopPropagation();
      },

      _createChartSettingContent: function(){
        var chartJson = array.filter(this.config.dijits, function(d){
          return d.type === 'chart';
        })[0]; //we don't care more than one chart.
        if(!chartJson){
          console.error('Unknow error');
          return '<div></div>';
        }

        if(!chartJson.config){
          return '<div></div>';
        }

        var chartSetting = new ChartSetting({
          chartJson: chartJson,
          chartDijit: array.filter(this.dijits, function(d){
            return d.jsonId === chartJson.id;
          })[0],
          nls: this.nls
        });
        return chartSetting.domNode;
      },

      onDataSourceDataUpdate: function(dsId, data) {
        if (!this.config.dataSource || dsId !== this.config.dataSource.frameWorkDsId) {
          return;
        }

        data.features = utils.filterFeaturesByDataSourceSetting(data.features, this.config.dataSource, this.map);

        this._onDataUpdate(data);
      },

      _onClientFeaturesUpdate: function(features) {
        this._onDataUpdate({
          features: features
        });
      },

      _onDataUpdate: function(data) {
        var oldAttrs = array.map(this._features, function(f) {
          return f.attributes;
        });
        var newAttrs = array.map(data.features, function(f) {
          return f.attributes;
        });
        if(jimuUtils.isEqual(oldAttrs, newAttrs)){
          return;
        }
        this._features = data.features;
        array.forEach(this.dijits, lang.hitch(this, function(dijit) {
          dijit.onDataSourceDataUpdate(data);
        }));
      },

      resize: function() {
        this.inherited(arguments);
        if(this.layout){
          this.layout.resize();
        }
      }
    });
  });