///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 Esri. All Rights Reserved.
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
  'dojo/_base/html',
  'dojo/topic',
  'dojo/on',
  'dojo/query',
  './FeatureActionManager',
  './utils',
  './dijit/PopupMenu'
  ], function(declare, lang, html, topic, on, query, FeatureActionManager, jimuUtils, PopupMenu) {
    var instance = null;
    var clazz = declare(null, {
      mapManager: null,
      // popupUnion = {
      //   mobile: is mobile popup of map,
      //   bigScreen: is popup of map
      // };
      popupUnion: null,

      constructor: function(options) {
        lang.mixin(this, options);

        this.popupMenu = PopupMenu.getInstance();
        this.isInited = false;

        this.featureActionManager = FeatureActionManager.getInstance();
        topic.subscribe("mapLoaded", lang.hitch(this, this.onMapLoadedOrChanged));
        topic.subscribe("mapChanged", lang.hitch(this, this.onMapLoadedOrChanged));
        topic.subscribe("appConfigChanged", lang.hitch(this, this._onAppConfigChanged));
        topic.subscribe("widgetsActionsRegistered", lang.hitch(this, this._onWidgetsActionsRegistered));
      },

      init: function() {
        this.popupUnion = this.mapManager.getMapInfoWindow();
        if(!this.popupUnion.bigScreen || !this.popupUnion.mobile ||
          !this.popupUnion.bigScreen.domNode || !this.popupUnion.mobile.domNode){
          return;
        }
        if(!this.isInited){
          this._createPopupMenuButton();
          this._bindSelectionChangeEvent();
          this.isInited = true;
        }
      },

      _createPopupMenuButton: function(){
        this.popupMenuButtonDesktop = html.create('span', {
          'class': 'popup-menu-button'
        }, query(".actionList", this.popupUnion.bigScreen.domNode)[0]);

        var mobileActionListNode = query(".esriMobilePopupInfoView .esriMobileInfoViewItem").parent()[0];
        var mobileViewItem = html.create('div', {
            'class': 'esriMobileInfoViewItem'
          }, mobileActionListNode);
        this.popupMenuButtonMobile = html.create('span', {
          'class': 'popup-menu-button'
        }, mobileViewItem);

        on(this.popupMenuButtonMobile, 'click', lang.hitch(this, this._onPopupMenuButtonClick));
        on(this.popupMenuButtonDesktop, 'click', lang.hitch(this, this._onPopupMenuButtonClick));
      },

      _onPopupMenuButtonClick: function(evt){
        var position = html.position(evt.target);
        this.popupMenu.show(position);
      },

      _bindSelectionChangeEvent: function(){
        on(this.popupUnion.bigScreen, "selection-change", lang.hitch(this, this._onSelectionChange));
        on(this.popupUnion.mobile, "selection-change", lang.hitch(this, this._onSelectionChange));
      },

      _onSelectionChange: function(evt){
        this.selectedFeature = evt.target.getSelectedFeature();
        if(!this.selectedFeature){
          html.addClass(this.popupMenuButtonDesktop, 'disabled');
          html.addClass(this.popupMenuButtonMobile, 'disabled');
          return;
        }
        this._initPopupMenu();
      },

      _initPopupMenu: function(){
        this.featureActionManager.getSupportedActions(this.selectedFeature).then(lang.hitch(this, function(actions){
          var popupActions = actions.filter(lang.hitch(this, function(action){
            return ['ZoomTo', 'ShowPopup', 'Flash'].indexOf(action.name) < 0 ;
          }));

          if(popupActions.length === 0){
            html.addClass(this.popupMenuButtonDesktop, 'disabled');
            html.addClass(this.popupMenuButtonMobile, 'disabled');
          }else{
            html.removeClass(this.popupMenuButtonDesktop, 'disabled');
            html.removeClass(this.popupMenuButtonMobile, 'disabled');
          }
          var menuActions = popupActions.map(lang.hitch(this, function(action){
            action.data = jimuUtils.toFeatureSet(this.selectedFeature);
            return action;
          }));
          this.popupMenu.setActions(menuActions);
        }));
      },

      /******************************
       * Events
       ******************************/
      onMapLoadedOrChanged: function() {
        this.isInited = false;
        this.init();
      },

      _onAppConfigChanged: function() {
        if(this.popupUnion) {
          if(this.popupUnion.bigScreen && this.popupUnion.bigScreen.hide) {
            this.popupUnion.bigScreen.hide();
            this.popupMenu.hide();
          }
          if(this.popupUnion.mobile && this.popupUnion.mobile.hide) {
            this.popupUnion.mobile.hide();
            this.popupMenu.hide();
          }
        }
      },

      _onWidgetsActionsRegistered: function(){
        //to init actions
        this.init();
      }

    });

    clazz.getInstance = function(mapManager) {
      if (instance === null) {
        instance = new clazz({
          mapManager: mapManager
        });
      }
      return instance;
    };

    return clazz;
  });
