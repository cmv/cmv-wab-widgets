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
  'dojo/sniff',
  'dojo/query',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidgetSetting',
  'jimu/dijit/_QueryableLayerSourcePopup',
  'jimu/utils',
  'jimu/filterUtils',
  '../utils',
  './SingleQuerySetting',
  'jimu/dijit/CheckBox',
  'jimu/dijit/TabContainer'
],
function(on, sniff, query, declare, lang, html, array, _WidgetsInTemplateMixin, BaseWidgetSetting,
  _QueryableLayerSourcePopup, jimuUtils, FilterUtils, queryUtils, SingleSetting) {

  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-query-setting',
    singleSetting: null,
    noQueryNls: '',

    postMixInProperties: function(){
      this.inherited(arguments);
      if(this.config){
        this.config = queryUtils.getConfigWithValidDataSource(this.config);
        this._updateConfig();
      }
      this.noQueryNls = this.nls.noTasksTip;
      var a = '"${newQuery}""';
      if(this.noQueryNls.indexOf(a) < 0){
        a = '"${newQuery}"';
      }
      this.noQueryNls = this.noQueryNls.replace(a, "<span>" + this.nls.newQuery + "</span>");
    },

    _updateConfig: function() {
      if (this.config && this.config.queries && this.config.queries.length > 0) {
        array.forEach(this.config.queries, lang.hitch(this, function(singleConfig) {
          this._rebuildFilter(singleConfig.url, singleConfig.filter);
        }));
      }
    },

    _rebuildFilter: function(url, filter) {
      try {
        if (filter) {
          delete filter.expr;
          var filterUtils = new FilterUtils();
          filterUtils.isHosted = jimuUtils.isHostedService(url);
          filterUtils.getExprByFilterObj(filter);
        }
      } catch (e) {
        console.log(e);
      }
    },

    postCreate:function(){
      this.inherited(arguments);
      this.noQueryTip.innerHTML = this.noQueryNls;
      this.cbxHideLayersAfterWidgetClosed.setLabel(this.nls.hideLayersTip);
      if(this.config){
        this.setConfig(this.config);
      }
      if(sniff('mac')){
        html.addClass(this.domNode, 'mac');
      }else{
        html.addClass(this.domNode, 'not-mac');
      }
    },

    _onBtnAddItemClicked: function(){
      if(this.singleSetting){
        var singleConfig = this.singleSetting.getConfig();
        if(singleConfig){
          this.singleSetting.destroy();
          this.singleSetting = null;
        }else{
          return;
        }
      }

      var args = {
        titleLabel: this.nls.setDataSource,

        dijitArgs: {
          multiple: false,
          createMapResponse: this.map.webMapResponse,
          portalUrl: this.appConfig.portalUrl,
          style: {
            height: '100%'
          }
        }
      };

      var sourcePopup = new _QueryableLayerSourcePopup(args);
      this.own(on(sourcePopup, 'ok', lang.hitch(this, function(item){
        //{name, url, definition}
        var layerSourceType = sourcePopup.getSelectedRadioType();
        sourcePopup.close();
        sourcePopup = null;

        if(this.singleSetting){
          this.singleSetting.destroy();
          this.singleSetting = null;
        }

        var target = this._createTarget();
        this._createSingleSetting(target, null);

        var queryName = item.name || "";

        // var expr = null;
        // if (layerSourceType === 'map') {
        //   if (item.layerInfo) {
        //     var layerObject = item.layerInfo.layerObject;
        //     if (layerObject && typeof layerObject.getDefinitionExpression === 'function') {
        //       expr = layerObject.getDefinitionExpression();
        //     }
        //   }
        // }
        //we don't save current layer's definition expression, we just read it at runtime
        this.singleSetting.setNewLayerDefinition(item, layerSourceType, queryName);
      })));

      this.own(on(sourcePopup, 'cancel', lang.hitch(this, function(){
        sourcePopup.close();
        sourcePopup = null;
      })));

      sourcePopup.startup();
    },

    _createSingleSetting: function(target){
      query('.item', this.listContent).removeClass('selected');
      if(this.singleSetting){
        this.singleSetting.destroy();
      }
      this.singleSetting = null;
      this.singleSetting = new SingleSetting({
        map: this.map,
        nls: this.nls,
        target: target,
        _layerDefinition: target._layerDefinition,
        appConfig: this.appConfig,
        folderUrl: this.folderUrl
      });
      this.singleSetting.placeAt(this.singleSettingContent);
      this.own(on(this.singleSetting, 'loading', lang.hitch(this, function(){
        this.shelter.show();
      })));
      this.own(on(this.singleSetting, 'unloading', lang.hitch(this, function(){
        this.shelter.hide();
      })));
      this.own(on(this.singleSetting, 'before-destroy', lang.hitch(this, function(){
        html.addClass(this.separator, 'not-visible');
      })));
      html.addClass(target, 'selected');
      if(target.singleConfig){
        this.singleSetting.setConfig(target.singleConfig);
      }
      html.removeClass(this.separator, 'not-visible');
      html.addClass(this.noQueryTip, 'not-visible');
    },

    _createTarget: function(name){
      name = name || "";
      var target = html.create("div", {
        "class": "item",
        "innerHTML": '<div class="label jimu-ellipsis" title="' + name + '">' + name + '</div>' +
                     '<div class="actions jimu-float-trailing">' +
                        '<div class="delete action jimu-float-trailing"></div>' +
                        '<div class="down action jimu-float-trailing"></div>' +
                        '<div class="up action jimu-float-trailing"></div>' +
                     '</div>'
      }, this.listContent);
      return target;
    },

    _onListContentClicked: function(event){
      var target = event.target || event.srcElement;
      var itemDom = jimuUtils.getAncestorDom(target, function(dom){
        return html.hasClass(dom, 'item');
      }, 3);
      if(!itemDom){
        return;
      }
      if(html.hasClass(target, 'action')){
        if(html.hasClass(target, 'up')){
          if(itemDom.previousElementSibling){
            html.place(itemDom, itemDom.previousElementSibling, 'before');
          }
        }else if(html.hasClass(target, 'down')){
          if(itemDom.nextElementSibling){
            html.place(itemDom, itemDom.nextElementSibling, 'after');
          }
        }else if(html.hasClass(target, 'delete')){
          if(this.singleSetting && this.singleSetting.target === itemDom){
            this.singleSetting.destroy();
            this.singleSetting = null;
          }
          html.destroy(itemDom);
          var itemDoms = query('.item', this.listContent);
          if(itemDoms.length > 0){
            this._createSingleSetting(itemDoms[0]);
          }
          this._updateNoQueryTip();
        }
        return;
      }

      if (this.singleSetting) {
        if (this.singleSetting.target !== itemDom) {
          var singleConfig = this.singleSetting.getConfig();
          if (singleConfig) {
            this.singleSetting.destroy();
            this.singleSetting = null;
            this._createSingleSetting(itemDom);
          }
        }
      } else {
        this._createSingleSetting(itemDom);
      }
    },

    _updateNoQueryTip: function(){
      var itemDoms = query('.item', this.listContent);
      if (itemDoms.length > 0) {
        html.addClass(this.noQueryTip, 'not-visible');
      } else {
        html.removeClass(this.noQueryTip, 'not-visible');
      }
    },

    setConfig: function(config){
      this.cbxHideLayersAfterWidgetClosed.setValue(config.hideLayersAfterWidgetClosed);
      var firstTarget = null;
      array.forEach(config.queries, lang.hitch(this, function(singleConfig, index){
        var target = this._createTarget(singleConfig.name);
        target.singleConfig = singleConfig;
        if(index === 0){
          firstTarget = target;
        }
      }));
      if(firstTarget){
        this._createSingleSetting(firstTarget);
      }
      this._updateNoQueryTip();
    },

    getConfig: function(){
      if(this.singleSetting){
        var singleConfig = this.singleSetting.getConfig();
        if(!singleConfig){
          return false;
        }
      }
      var targets = query('.item', this.listContent);
      var config = {
        hideLayersAfterWidgetClosed: this.cbxHideLayersAfterWidgetClosed.getValue(),
        queries: []
      };
      config.queries = array.map(targets, lang.hitch(this, function(target){
        return target.singleConfig;
      }));
      return config;
    },

    destroy: function(){
      if(this.singleSetting){
        this.singleSetting.destroy();
      }
      this.singleSetting = null;
      this.inherited(arguments);
    }

  });
});