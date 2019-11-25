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
], function(lang, array, jimuUtils) {

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
      if(popupInfo && popupInfo.fieldInfos) {
        fieldInfos = lang.clone(popupInfo.fieldInfos);
      }
    }

    if(fieldInfos) {
      array.forEach(fieldInfos, function(fieldInfo) {
        if(fieldInfo.format && fieldInfo.format.dateFormat) {
          if(fieldInfo.format.dateFormat.toLowerCase &&
            fieldInfo.format.dateFormat.toLowerCase().indexOf('time') < 0) {
            fieldInfo.format.time = false;
          } else {
            // invalid dateFormat will be replaced by default format "shortDateLongTime".
            fieldInfo.format.time = true;
          }
        }
      });
    }

    return fieldInfos;
  };

  mo.getEditCapabilities = function(layerObject, layerInfoParam, optionsOfGetEditCapabilitysOfJSAPI) {
    var editCapabilities = {};
    var layerObjectEditCapabilities = layerObject.getEditCapabilities(optionsOfGetEditCapabilitysOfJSAPI);

    editCapabilities.canCreate          = layerObjectEditCapabilities.canCreate;
    editCapabilities.canDelete          = layerObjectEditCapabilities.canDelete;
    //editCapabilities.canUpdateAttribute = layerObjectEditCapabilities.canUpate;
    editCapabilities.canUpdateGeometry  = layerObject.allowGeometryUpdates;

    if(layerInfoParam) {
      editCapabilities.canCreate = layerInfoParam.allowCreate && editCapabilities.canCreate;
      editCapabilities.canDelete = layerInfoParam.allowDelete && editCapabilities.canDelete;
      //editCapabilities.canUpdateAttribute = layerInfoParam.allowUpdateAttribute && editCapabilities.canUpate;
      editCapabilities.canUpdateGeometry  =
        !layerInfoParam.disableGeometryUpdate && editCapabilities.canUpdateGeometry;
    }

    return editCapabilities;
  };

  mo.getLocaleDateTime = function(dateString) {
    var dateObj = new Date(dateString);
    return jimuUtils.localizeDate(dateObj, {
      fullYear: true,
      //selector: 'date',
      formatLength: 'medium'
    });
  };

  mo.getAttrByFieldKey = function(feature, fieldKey) {
    return _ignoreCaseToGetOrUpdateAttrByFieldKey(feature, fieldKey);
  };

  mo.setAttrByFieldKey = function(feature, fieldKey, fieldValue) {
    return _ignoreCaseToGetOrUpdateAttrByFieldKey(feature, fieldKey, fieldValue);
  };

  mo.ignoreCaseToGetFieldKey = function(layerObject, fieldKey) {
    var result = null;
    var fieldObject = _ignoreCaseToGetFieldObject(layerObject, fieldKey);
    if(fieldObject) {
      result = fieldObject.name;
    }
    return result;
  };

  mo.ignoreCaseToGetFieldObject = function(layerObject, fieldKey) {
    return _ignoreCaseToGetFieldObject(layerObject, fieldKey);
  };

  function _ignoreCaseToGetFieldObject(layerObject, fieldKey) {
    var result = null;
    /*
    for (child in feature.attributes) {
      if(feature.attributes.hasOwnProperty(child) &&
         (typeof feature.attributes[child] !== 'function')) {
        if(child.toLowerCase() === fieldKey.toLowerCase()) {
          result = child;
          break;
        }
      }
    }
    */
    if(layerObject && layerObject.fields) {
      array.some(layerObject.fields, function(field) {
        if(field.name.toLowerCase() === fieldKey.toLowerCase()) {
          result = field;
          return true;
        }
      });
    }
    return result;
  }

  function _ignoreCaseToGetOrUpdateAttrByFieldKey(feature, fieldKey, fieldValue) {
    var result = null;
    if(feature && feature.attributes) {
      for (var child in feature.attributes) {
        if(feature.attributes.hasOwnProperty(child) &&
           (typeof feature.attributes[child] !== 'function')) {
          if(child.toLowerCase() === fieldKey.toLowerCase()) {
            if(fieldValue) {
              // set attr
              feature.attributes[child] = fieldValue;
              result = fieldValue;
              break;
            } else {
              // get attr
              result = feature.attributes[child];
              break;
            }
          }
        }
      }
    }
    return result;
  }

  return mo;
});
