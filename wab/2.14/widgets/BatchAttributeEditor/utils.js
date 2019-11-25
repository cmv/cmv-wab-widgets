///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
  'dojo/_base/lang',
  'dojo/_base/array',
  'jimu/utils'
], function (lang, array, jimuUtils) {

  var mo = {};

  mo.getFieldInfosFromWebmap = function(layerId, jimuLayerInfos) {
    // summary:
    //   get fieldInfos from web map.
    // description:
    //   return null if fieldInfos has not been configured.
    var fieldInfos = null;
    var jimuLayerInfo = jimuLayerInfos.getLayerInfoByTopLayerId(layerId);
    if(jimuLayerInfo) {
      var popupInfo = jimuLayerInfo.getPopupInfo();
      if (popupInfo && popupInfo.fieldInfos) {
        fieldInfos = lang.clone(popupInfo.fieldInfos);
        if (jimuLayerInfo.layerObject) {
          array.forEach(fieldInfos, function (fieldInfo) {
            array.some(jimuLayerInfo.layerObject.fields, function (field) {
              if (fieldInfo.fieldName === field.name) {
                fieldInfo.type = field.type;
                return true;
              }
            });
          });
        }
      } else {
        fieldInfos = [];
        if (jimuLayerInfo && jimuLayerInfo.layerObject) {
          array.forEach(jimuLayerInfo.layerObject.fields, function (field) {
            var fieldInfo = jimuUtils.getDefaultPortalFieldInfo(field);
            fieldInfo.type = field.type;
            fieldInfo.visible = true;
            fieldInfo.isEditable = true;

            fieldInfos.push(fieldInfo);
          });
        }
      }
    }

    if(fieldInfos) {
      array.forEach(fieldInfos, function(fieldInfo) {
        if(fieldInfo.format &&
          fieldInfo.format.dateFormat &&
          fieldInfo.format.dateFormat.toLowerCase() &&
          fieldInfo.format.dateFormat.toLowerCase().indexOf('time') >= 0
          ) {
          fieldInfo.format.time = true;
        }
      });
    }

    return fieldInfos;
  };

  return mo;
});
