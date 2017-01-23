
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
  'dojo/_base/declare',
  'dojo/_base/array',
  'dojo/Deferred',
  'jimu/BaseFeatureAction',
  'jimu/WidgetManager'
], function(declare, array, Deferred, BaseFeatureAction, WidgetManager){
  var clazz = declare(BaseFeatureAction, {
    map: null,
    iconClass: 'icon-edit',

    isFeatureSupported: function(featureSet, layer){
      /*jshint unused: false*/
      if(!layer) {
        return false;
      }
      var layerHasBeenConfiged = false;
      var editConfig = this.appConfig.getConfigElementById(this.widgetId).config;
      if(!editConfig.editor.layerInfos) {
        layerHasBeenConfiged = false;
      } else if(editConfig.editor.layerInfos.length === 0) {
        layerHasBeenConfiged = true;
      } else {
        array.forEach(editConfig.editor.layerInfos, function(layerInfoParam) {
          if(layer.id === layerInfoParam.featureLayer.id) {
            layerHasBeenConfiged = true;
          }
        });
      }

      if(layerHasBeenConfiged &&
         layer.isEditable &&
         layer.isEditable()) {
        return true;
      } else {
        return false;
      }
    },

    onExecute: function(featureSet, layer){
      //jshint unused:false
      var def = new Deferred();
      WidgetManager.getInstance().triggerWidgetOpen(this.widgetId)
      .then(function(editWidget) {
        editWidget.beginEditingByFeatures(featureSet.features, layer);
      });
      return def.promise;
    }
  });
  return clazz;
});
