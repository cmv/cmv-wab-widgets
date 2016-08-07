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
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/Deferred',
  'jimu/dijit/LayerChooserFromMap',
  'jimu/dijit/FeaturelayerChooserFromMap'
],
function(declare, lang, Deferred, LayerChooserFromMap, FeaturelayerChooserFromMap) {

  return declare([FeaturelayerChooserFromMap], {

    //public methods:
    //getSelectedItems return [{name, url, layerInfo}]

    postMixInProperties:function(){
      this.inherited(arguments);
      this.filter = lang.hitch(
        this,
        LayerChooserFromMap.andCombineFilters([this.filter, lang.hitch(this, this._customFilter)])
      );
    },

    _customFilter: function(layerInfo){
      var def = new Deferred();
      layerInfo.getLayerObject().then(lang.hitch(this, function(layer) {
        if (layer.declaredClass === 'esri.layers.FeatureLayer') {
          def.resolve(true);
        } else if (layer.declaredClass === 'esri.layers.ArcGISDynamicMapServiceLayer') {
          //https://developers.arcgis.com/javascript/3/jsapi/arcgisdynamicmapservicelayer-amd.html#layerdefinitions
          def.resolve(layer.version >= 10);
        } else {
          def.resolve(false);
        }
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.resolve(false);
      }));
      return def;
    },

    _customFilter2: function(layerInfo){
      var def = new Deferred();
      if(layerInfo.parentLayerInfo){
        var ancestorLayerInfo = this._getAncestorLayerInfo(layerInfo);
        ancestorLayerInfo.getLayerObject().then(lang.hitch(this, function(ancestorLayer){
          def.resolve(ancestorLayer.declaredClass === 'esri.layers.ArcGISDynamicMapServiceLayer');
        }), lang.hitch(this, function(err){
          console.error(err);
          def.resolve(false);
        }));
      }else{
        if(layerInfo.declaredClass === 'esri.layers.FeatureLayer'){
          def.resolve(true);
        }else if(layerInfo.declaredClass === 'esri.layers.ArcGISDynamicMapServiceLayer'){
          layerInfo.getLayerObject().then(lang.hitch(this, function(layer){
            //https://developers.arcgis.com/javascript/3/jsapi/arcgisdynamicmapservicelayer-amd.html#layerdefinitions
            def.resolve(layer.version >= 10);
          }), lang.hitch(this, function(err){
            console.error(err);
            def.resolve(false);
          }));
          def.resolve(true);
        }else{
          def.resolve(false);
        }
      }

      return def;
    },

    _getAncestorLayerInfo: function(layerInfo){
      while(layerInfo.parentLayerInfo){
        layerInfo = layerInfo.parentLayerInfo;
      }
      return layerInfo;
    }

  });
});