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
  'dojo/_base/array',
  'dojo/promise/all',
  'dojo/Deferred',
  'esri/layers/FeatureLayer',
  'esri/layers/GeoRSSLayer',
  'jimu/LayerInfos/LayerInfos'
], function(array, all, Deferred, FeatureLayer, GeoRSSLayer, LayerInfos) {
  var mo = {};

  mo.getLayerObjects = function(theMap){
    var retDef = new Deferred();

    LayerInfos.getInstance(theMap, theMap.itemInfo).then(function(
          layerInfosObject){
      var layerInfos = [];
      layerInfosObject.traversal(function(layerInfo){
        layerInfos.push(layerInfo);
      });

      var defs = array.map(layerInfos, function(layerInfo){
        // if layerInfo.getLayerType() is "GeoRSSLayer", assgin name to layerObject if it is undefined
        return layerInfo.getLayerType().then(function(type){
          if(type === 'GeoRSSLayer') {
            if(!layerInfo.isLeaf()) {
              array.forEach(layerInfo.getSubLayers(), function(subLayerInfo) {
                if(!subLayerInfo.layerObject.name) {
                  subLayerInfo.layerObject.name = subLayerInfo.title;
                }
              });
            }
          }
          return layerInfo.getLayerObject();
        });
      });
      return all(defs).then(function(layerObjects){
        var resultArray = [];
        array.forEach(layerObjects, function(layerObject, i){
          if((layerObject instanceof FeatureLayer &&
            layerObject.declaredClass !== 'esri.layers.StreamLayer') ||
              layerObject instanceof GeoRSSLayer) {
            layerObject.id = layerObject.id || layerInfos[i].id;
            resultArray.push(layerObject);
          }
        });
        retDef.resolve(resultArray);
      });
    }, function() {
      retDef.resolve([]);
    });

    return retDef;
  };

  return mo;
});
