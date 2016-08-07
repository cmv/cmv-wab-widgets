///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
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
  'dojo/mouse',
  'dojo/query',
  'dojo/Evented',
  'dojo/_base/html',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/promise/all',
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/popup',
  'dijit/TooltipDialog',
  'jimu/utils',
  'jimu/dijit/DrawBox',
  'jimu/dijit/_FeatureSetChooserCore'
],
function(on, sniff, mouse, query, Evented, html, lang, array, all, declare, _WidgetBase, _TemplatedMixin,
  _WidgetsInTemplateMixin, dojoPopup, TooltipDialog, jimuUtils, DrawBox, _FeatureSetChooserCore) {

  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    baseClass: 'jimu-multiple-layers-featureset-chooser',
    templateString: '<div class="jimu-not-selectable">' +
                      '<div class="draw-item extent-icon" data-dojo-attach-point="extentIcon">' +
                        '<div class="select-icon"></div><div class="select-text"></div>' +
                      '</div>' +
                      '<div class="btn-clear" data-dojo-attach-point="btnClear">' +
                        '<div class="clear-icon"></div><div class="clear-text"></div>' +
                      '</div>' +
                    '</div>',
    drawBox: null,
    _instances: null,//[{featureLayer,featureSetChooserCore}]
    _tooltipDialogTimeoutId1: -1,
    _tooltipDialogClientX1: -1,
    _tooltipDialogTimeoutId2: -1,
    _tooltipDialogClientX2: -1,
    _tooltipTimeout: 1000,

    //constructor options:
    map: null,
    updateSelection: false,
    fullyWithin: false,

    //public methods:
    //enable
    //disable
    //deactivate
    //clear
    //setFeatureLayers
    //addFeatureLayer
    //removeFeatureLayer

    //events:
    //user-clear
    //loading
    //unloading

    postMixInProperties:function(){
      this.inherited(arguments);
      this.nls = window.jimuNls.featureSetChooser;
    },

    postCreate:function(){
      this.inherited(arguments);

      this._instances = [];

      var selectTextDom = query('.select-text', this.domNode)[0];
      selectTextDom.innerHTML = window.jimuNls.featureSetChooser.select;

      var clearTextDom = query('.clear-text', this.domNode)[0];
      clearTextDom.innerHTML = window.jimuNls.common.clear;

      this._initTooltipDialogs();

      this._initDrawBox();
    },

    _initTooltipDialogs: function(){
      //tooltipDialog1
      var k = sniff('mac') ? "⌘" : 'Ctrl';
      var selectTipText = '<div class="title">' + this.nls.selectByRectangle + '</div>' +
      '<div class="item">- ' + this.nls.newSelectionTip + ' (' + this.nls.dragMouse + ')</div>' +
      '<div class="item">- ' + this.nls.addSelectionTip + ' (Shift+' + this.nls.dragBox + ')</div>' +
      '<div class="item">- ' + this.nls.removeSelectionTip + ' (' + k + '+' + this.nls.dragBox + ')</div>';
      //'<div class="item">' + this.nls.selectFromCurrentSelectionTip + ' (Ctrl+Shift+' + this.nls.dragBox + ')</div>';
      var tooltipDialogContent1 = html.create("div", {
        'innerHTML': selectTipText,
        'class': 'dialog-content'
      });

      this.tooltipDialog1 = new TooltipDialog({
        content: tooltipDialogContent1
      });
      html.addClass(this.tooltipDialog1.domNode, 'jimu-multiple-layers-featureset-chooser-tooltipdialog');
      this.own(on(this.extentIcon, 'mousemove', lang.hitch(this, function(evt){
        this._tooltipDialogClientX1 = evt.clientX;
      })));
      this.own(on(this.extentIcon, mouse.enter, lang.hitch(this, function() {
        clearTimeout(this._tooltipDialogTimeoutId1);
        this._tooltipDialogTimeoutId1 = -1;
        this._tooltipDialogTimeoutId1 = setTimeout(lang.hitch(this, function() {
          if (this.tooltipDialog1) {
            dojoPopup.open({
              parent: this.getParent(),
              popup: this.tooltipDialog1,
              around: this.extentIcon,
              position: ["below"]
            });
            if(this._tooltipDialogClientX1 >= 0){
              this.tooltipDialog1.domNode.parentNode.style.left = this._tooltipDialogClientX1 + "px";
            }
          }
        }), this._tooltipTimeout);
      })));
      this.own(on(this.extentIcon, mouse.leave, lang.hitch(this, function(){
        clearTimeout(this._tooltipDialogTimeoutId1);
        this._tooltipDialogTimeoutId1 = -1;
        this._hideTooltipDialog(this.tooltipDialog1);
      })));


      //tooltipDialog2
      var clearTipText = this.nls.unselectAllSelectionTip;
      var tooltipDialogContent2 = html.create("div", {
        'innerHTML': clearTipText,
        'class': 'dialog-content'
      });
      this.tooltipDialog2 = new TooltipDialog({
        content: tooltipDialogContent2
      });
      html.addClass(this.tooltipDialog2.domNode, 'jimu-multiple-layers-featureset-chooser-tooltipdialog');
      this.own(on(this.btnClear, 'mousemove', lang.hitch(this, function(evt){
        this._tooltipDialogClientX2 = evt.clientX;
      })));
      this.own(on(this.btnClear, mouse.enter, lang.hitch(this, function() {
        clearTimeout(this._tooltipDialogTimeoutId2);
        this._tooltipDialogTimeoutId2 = -1;
        this._tooltipDialogTimeoutId2 = setTimeout(lang.hitch(this, function() {
          if (this.tooltipDialog2) {
            dojoPopup.open({
              parent: this.getParent(),
              popup: this.tooltipDialog2,
              around: this.btnClear,
              position: ["below"]
            });
            if(this._tooltipDialogClientX2 >= 0){
              this.tooltipDialog2.domNode.parentNode.style.left = this._tooltipDialogClientX2 + "px";
            }
          }
        }), this._tooltipTimeout);
      })));
      this.own(on(this.btnClear, mouse.leave, lang.hitch(this, function(){
        clearTimeout(this._tooltipDialogTimeoutId2);
        this._tooltipDialogTimeoutId2 = -1;
        this._hideTooltipDialog(this.tooltipDialog2);
      })));
    },

    _initDrawBox: function(){
      this.drawBox = new DrawBox({
        map: this.map,
        showClear: true,
        keepOneGraphic: true,
        deactivateAfterDrawing: false,
        geoTypes: ['EXTENT']//['POLYGON']
      });
      //this.drawBox.placeAt(this.domNode);
      this.own(on(this.drawBox, 'user-clear', lang.hitch(this, this._onDrawBoxUserClear)));
      this.own(on(this.drawBox, 'draw-end', lang.hitch(this, this._onDrawEnd)));

      this.own(on(this.drawBox, 'draw-activate', lang.hitch(this, function(){
        this.map.infoWindow.hide();
        html.addClass(this.extentIcon, 'selected');
      })));

      this.own(on(this.drawBox, 'draw-deactivate', lang.hitch(this, function(){
        html.removeClass(this.extentIcon, 'selected');
      })));

      this.own(on(this.extentIcon, 'click', lang.hitch(this, function(){
        //this.drawBox.extentIcon.click();
        jimuUtils.simulateClickEvent(this.drawBox.extentIcon);
      })));

      this.own(on(this.btnClear, 'click', lang.hitch(this, function(){
        //this.drawBox.btnClear.click();
        jimuUtils.simulateClickEvent(this.drawBox.btnClear);
      })));
    },

    disable: function(){
      this.drawBox.disable();
      html.addClass(this.domNode, 'disabled');
    },

    enable: function(){
      this.drawBox.enable();
      html.removeClass(this.domNode, 'disabled');
    },

    deactivate: function(){
      this.drawBox.deactivate();
    },

    setFeatureLayers: function(featureLayers){
      //remove instances
      var needToRemovedInstances = array.filter(this._instances, lang.hitch(this, function(instance){
        return featureLayers.indexOf(instance.featureLayer) < 0;
      }));
      array.forEach(needToRemovedInstances, lang.hitch(this, function(instance){
        this._removeInstance(instance);
      }));

      //add new instances
      var existLayers = array.map(this._instances, lang.hitch(this, function(instance){
        return instance.featureLayer;
      }));
      array.forEach(featureLayers, lang.hitch(this, function(featureLayer){
        if(existLayers.indexOf(featureLayer) < 0){
          this.addFeatureLayer(featureLayer);
        }
      }));
    },

    addFeatureLayer: function(featureLayer){
      if(featureLayer.declaredClass !== "esri.layers.FeatureLayer"){
        return;
      }

      var instance = this._findInstanceByLayer(featureLayer);
      if(!instance){
        var featureSetChooserCore = new _FeatureSetChooserCore({
          map: this.map,
          featureLayer: featureLayer,
          drawBox: this.drawBox,
          updateSelection: this.updateSelection,
          fullyWithin: this.fullyWithin
        });
        this._instances.push(featureSetChooserCore);
      }
    },

    removeFeatureLayer: function(featureLayer){
      if(featureLayer.declaredClass !== "esri.layers.FeatureLayer"){
        return;
      }
      var instance = this._findInstanceByLayer(featureLayer);
      if(instance){
        this._removeInstance(instance);
      }
    },

    _removeInstance: function(instance){
      if(instance){
        var index = this._instances.indexOf(instance);
        if(index >= 0){
          instance.destroy();
          this._instances.splice(index, 1);
        }
      }
    },

    _findInstanceByLayer: function(featureLayer){
      var featureSetChooserCore = null;
      array.some(this._instances, lang.hitch(this, function(item){
        if(item.featureLayer === featureLayer){
          featureSetChooserCore = item;
          return true;
        }else{
          return false;
        }
      }));
      return featureSetChooserCore;
    },

    clear: function(shouldClearSelection){
      array.forEach(this._instances, lang.hitch(this, function(featureSetChooserCore){
        featureSetChooserCore.clear(shouldClearSelection);
      }));
    },

    destroy: function(){
      this._hideTooltipDialog(this.tooltipDialog1);
      this._hideTooltipDialog(this.tooltipDialog2);
      array.forEach(this._instances, lang.hitch(this, function(featureSetChooserCore){
        featureSetChooserCore.destroy();
      }));
      this._instances = [];
      if(this.drawBox){
        this.drawBox.destroy();
      }
      this.drawBox = null;
      this.inherited(arguments);
    },

    _hideTooltipDialog: function(tooltipDialog){
      if(tooltipDialog){
        dojoPopup.close(tooltipDialog);
      }
    },

    _onDrawBoxUserClear: function(){
      this.clear(true);
      this.emit("user-clear");
    },

    _onDrawEnd: function(){
      this.drawBox.clear();
      if (this._instances.length > 0) {
        setTimeout(lang.hitch(this, function() {
          if (this._instances.length > 0) {
            this.emit('loading');
            this.disable();
            var defs = array.map(this._instances, lang.hitch(this, function(instance) {
              return instance.getFeatures();
            }));
            all(defs).always(lang.hitch(this, function() {
              this.enable();
              jimuUtils.simulateClickEvent(this.drawBox.extentIcon);
              this.emit('unloading');
            }));
          }
        }), 50);
      }
    }

  });
});