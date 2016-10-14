/*
Copyright ©2014 Esri. All rights reserved.

TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
Unpublished material - all rights reserved under the
Copyright Laws of the United States and applicable international
laws, treaties, and conventions.

For additional information, contact:
Attn: Contracts and Legal Department
Environmental Systems Research Institute, Inc.
380 New York Street
Redlands, California, 92373
USA

email: contracts@esri.com
*/

define([
  'dojo/_base/lang',
  'dojo/_base/array',
  'esri/geometry/Extent',
  'jimu/utils'
], function (lang, array, Extent, jimuUtils) {

  var mo = {};

  mo.checkIfFieldAliasAlreadyExists = function (origText, alias) {
    var strArray = origText.split(",");
    return strArray.indexOf(alias) >= 0;
  };

  mo.pointToExtent = function (map, point, toleranceInPixel) {
    var pixelWidth = map.extent.getWidth() / map.width;
    var toleranceInMapCoords = toleranceInPixel * pixelWidth;
    return new Extent(point.x - toleranceInMapCoords,
                      point.y - toleranceInMapCoords,
                      point.x + toleranceInMapCoords,
                      point.y + toleranceInMapCoords,
                      map.spatialReference);
  };

  mo.filterOnlyUpdatedAttributes = function (attributes, origAttributes, featureLayer) {

    var updatedAttrs = {};
    for (var prop in attributes) {
      if (attributes.hasOwnProperty(prop)) {
        if (prop === featureLayer.objectIdField ||
            prop === featureLayer.globalIdField) {
          updatedAttrs[prop] = attributes[prop];
        }
        else if (attributes[prop] === null && origAttributes[prop] === "") {
          //do nothing
        }
        else if (attributes[prop] !== origAttributes[prop]) {
          updatedAttrs[prop] = attributes[prop];
        }
      }
    }
    return updatedAttrs;
  };
  //Methods to get the Field Info from the map, layer and configuration
  mo.mergeFieldInfosWithConfiguration = function (layerInfo, configurationLayerInfo) {
    var fieldInfos = [];
    var defaultEditableFieldInfos = this.getDefaultEditableFieldInfos(layerInfo, true);

    if (configurationLayerInfo && configurationLayerInfo.fieldInfos) {

      array.forEach(configurationLayerInfo.fieldInfos, function (configuredFieldInfo) {
        array.some(defaultEditableFieldInfos, function (defaultEditableFieldInfo) {
          if (configuredFieldInfo.fieldName === defaultEditableFieldInfo.fieldName) {
            fieldInfos.push(this.mergeLastToFirst(defaultEditableFieldInfo, configuredFieldInfo));
            return true;
          }
        }, this);
      }, this);

      array.forEach(defaultEditableFieldInfos, function (defaultEditableFieldInfo) {
        var foundInfos = array.filter(fieldInfos, function (fieldInfo) {
          return (fieldInfo.fieldName === defaultEditableFieldInfo.fieldName);
        }, this);
        if (foundInfos.length === 0) {
          fieldInfos.push(defaultEditableFieldInfo);
        }
      }, this);

    } else {
      fieldInfos = defaultEditableFieldInfos;
    }
    return fieldInfos;
  };
  mo.getDefaultEditableFieldInfos = function (layerInfo, editableOnly) {
    var filteredFieldInfos = [];
    var fieldInfos =
     this.getFieldInfosFromWebmap(layerInfo);
    if (fieldInfos === undefined || fieldInfos === null) {
      fieldInfos = this.getFieldInfosLayer(layerInfo);
    }
    array.forEach(fieldInfos, function (fieldInfo) {
      fieldInfo.isEditable = fieldInfo.editable;
      fieldInfo.fieldName = fieldInfo.name;
      fieldInfo.canPresetValue = false;

      if (fieldInfo.editable === true && editableOnly === true) {
        filteredFieldInfos.push(lang.clone(fieldInfo));
      }
      else if (editableOnly === false) {
        filteredFieldInfos.push(lang.clone(fieldInfo));
      }
    });
    return filteredFieldInfos;
  };
  mo.getFieldInfosFromWebmap = function (layerInfo) {
    // summary:
    //   get fieldInfos from web map.
    // description:
    //   return null if fieldInfos has not been configured.
    var fieldInfos = null;

    var popupInfo = layerInfo.getPopupInfo();
    if (popupInfo && popupInfo.fieldInfos) {
      fieldInfos = [];
      array.forEach(popupInfo.fieldInfos, function (fieldInfo) {
        array.some(layerInfo.layerObject.fields, function (field) {
          if (field.name === fieldInfo.fieldName) {
            var mergedFieldInfo = this.mergeFirstToLast(fieldInfo, field);
            if (mergedFieldInfo.format &&
                 mergedFieldInfo.format.dateFormat &&
                 mergedFieldInfo.format.dateFormat.toLowerCase() &&
                 mergedFieldInfo.format.dateFormat.toLowerCase().indexOf('time') >= 0) {
              mergedFieldInfo.format.time = true;
            }
            fieldInfos.push(mergedFieldInfo);
            return true;
          }
        }, this);

      }, this);
    }

    return fieldInfos;
  };
  mo.getFieldInfosLayer = function (layerInfo) {
    // summary:
    //   get fieldInfos from web map.
    // description:
    //   return null if fieldInfos has not been configured.
    var fieldInfos = [];
    if (layerInfo && layerInfo.layerObject) {
      array.forEach(layerInfo.layerObject.fields, function (field) {
        var fieldInfo = jimuUtils.getDefaultPortalFieldInfo(field);
        fieldInfo = this.mergeFirstToLast(fieldInfo, field);
        //for (var k in field) {
        //  if (field.hasOwnProperty(k) === true) {
        //    if (fieldInfo.hasOwnProperty(k) === false) {
        //      fieldInfo[k] = field[k];
        //    }
        //  }
        //}
        if (fieldInfo.format &&
            fieldInfo.format.dateFormat &&
            fieldInfo.format.dateFormat.toLowerCase() &&
            fieldInfo.format.dateFormat.toLowerCase().indexOf('time') >= 0) {
          fieldInfo.format.time = true;
        }
        fieldInfo.visible = true;
        fieldInfos.push(fieldInfo);
      }, this);
    }

    return fieldInfos;
  };
  //Methods to get the Layer info from the map, service and configuration
  mo.getConfigInfos = function (jimuLayerInfos, configurationLayerInfos, editableOnly, configuredOnly) {
    // summary:
    //   get all editable layers from map.
    // description:
    //   layerInfo will honor configuration if that layer has configured.
    var configInfos = [];
    array.forEach(jimuLayerInfos.getLayerInfoArrayOfWebmap(), function (layerInfo) {
      var addLayer = false;
      if (layerInfo.layerObject.type === "Feature Layer" && layerInfo.layerObject.url) {
        if (layerInfo.layerObject.isEditable && layerInfo.layerObject.isEditable() && editableOnly) {
          addLayer = true;
        }
        else if (editableOnly && editableOnly === false) {
          addLayer = true;
        }
      }
      if (addLayer === true) {
        var mergedConfigInfo = this.getConfigInfo(layerInfo, configurationLayerInfos);
        mergedConfigInfo.layerInfo = layerInfo;
        if (mergedConfigInfo.featureLayer.layerAllowsDelete === true &&
           mergedConfigInfo.featureLayer.layerAllowsCreate === false &&
           mergedConfigInfo.featureLayer.layerAllowsUpdate === false) {
          console.warn(mergedConfigInfo.layerInfo.title + " delete only not supported");
        } else {
          if (configuredOnly && configuredOnly === true) {
            var layerPartOfConfig = array.some(configurationLayerInfos, function (configurationLayerInfo) {
              return configurationLayerInfo.featureLayer.id === mergedConfigInfo.featureLayer.id;
            });
            if (layerPartOfConfig === true) {
              configInfos.push(mergedConfigInfo);
            }
          }
          else {
            configInfos.push(mergedConfigInfo);
          }

        }
      }
    }, this);
    return configInfos;
  };
  mo.getConfigInfo = function (layerInfo, configurationLayerInfos) {
    var configInfo = null;
    var defConfigInfo = this.createDefaultConfigInfo(layerInfo);
    var found = array.some(configurationLayerInfos, function (configurationLayerInfo) {
      if (configurationLayerInfo.featureLayer && configurationLayerInfo.featureLayer.id === layerInfo.layerObject.id) {
        configInfo = lang.clone(configurationLayerInfo);
        configInfo.fieldInfos = this.mergeFieldInfosWithConfiguration(layerInfo, configInfo);
        configInfo = this.mergeDefaultWithConfig(configInfo, defConfigInfo);
        // set _editFlag to true
        configInfo._editFlag = true;
        return true;
      }
      return false;
    }, this);
    if (found === false) {
      configInfo = defConfigInfo;
    }
    return configInfo;
  };
  mo.mergeDefaultWithConfig = function (layerInfo, defLayerInfo) {

    layerInfo.featureLayer = defLayerInfo.featureLayer;

    if (layerInfo.allowDelete === true && layerInfo.featureLayer.layerAllowsDelete === false) {
      layerInfo.allowDelete = false;
    }
    if (layerInfo.disableGeometryUpdate === false && layerInfo.featureLayer.layerAllowGeometryUpdates === false) {
      layerInfo.disableGeometryUpdate = true;
    }
    if (layerInfo.featureLayer.layerAllowsCreate === false && layerInfo.featureLayer.layerAllowsUpdate === true) {
      layerInfo.allowUpdateOnly = true;
    }
    return layerInfo;
  };
  mo.createDefaultConfigInfo = function (layerInfo) {
    var allowsCreate = false;
    var allowsUpdate = false;
    var allowsDelete = false;
    var allowGeometryUpdates = false;
    try {
      var capabilities = layerInfo.layerObject.getEditCapabilities();
      if (capabilities.canCreate) {
        allowsCreate = true;
      }
      if (capabilities.canUpdate) {
        allowsUpdate = true;
        allowGeometryUpdates = true;
      }
      if (capabilities.canDelete) {
        allowsDelete = true;
      }
    }
    catch (err) {
      if (layerInfo.layerObject.hasOwnProperty('capabilities')) {
        if (String(layerInfo.layerObject.capabilities).indexOf('Update') === -1 &&
          String(layerInfo.layerObject.capabilities).indexOf('Delete') === -1 &&
          String(layerInfo.layerObject.capabilities).indexOf('Create') === -1 &&
          String(layerInfo.layerObject.capabilities).indexOf('Editing') !== -1) {
          allowsUpdate = true;
          allowsDelete = true;
          allowsCreate = true;
        }
        else {
          if (String(layerInfo.layerObject.capabilities).indexOf('Update') !== -1) {
            allowsUpdate = true;
            allowGeometryUpdates = true;
          }
          if (String(layerInfo.layerObject.capabilities).indexOf('Delete') !== -1) {
            allowsDelete = true;
          }
          if (String(layerInfo.layerObject.capabilities).indexOf('Create') !== -1) {
            allowsCreate = true;
          }
        }
      }
    }
    if (layerInfo.layerObject.hasOwnProperty('allowGeometryUpdates')) {
      allowGeometryUpdates = layerInfo.layerObject.allowGeometryUpdates;
    }
    var configInfo = {
      'featureLayer': {
        'id': layerInfo.layerObject.id,
        'layerAllowsCreate': allowsCreate,
        'layerAllowsUpdate': allowsUpdate,
        'layerAllowsDelete': allowsDelete,
        'layerAllowGeometryUpdates': allowGeometryUpdates
      },
      'disableGeometryUpdate': !allowGeometryUpdates,
      'allowUpdateOnly': !allowsCreate,
      'allowDelete': false,
      'fieldInfos': this.mergeFieldInfosWithConfiguration(layerInfo, null),
      '_editFlag': false
    };
    return configInfo;
  };
  //object functions
  mo.mergeLastToFirst = function () {
    var obj = {},
        i = 0,
        il = arguments.length,
        key;
    for (; i < il; i++) {
      for (key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          obj[key] = arguments[i][key];
        }
      }
    }
    return obj;
  };
  mo.mergeFirstToLast = function () {
    var obj = {},
        i = arguments.length - 1,
        il = 0,
        key;
    for (; i >= il; i--) {
      for (key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          obj[key] = arguments[i][key];
        }
      }
    }
    return obj;
  };
  mo.isObjectEmpty = function (obj) {
    if (obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }
      return true;
    }
    return true; //return true if obj is null
  };
  mo.addDateTimeFormat = function (fieldInfo) {
    if (fieldInfo && fieldInfo.format && fieldInfo.format !==
       null) {
      if (fieldInfo.format.dateFormat && fieldInfo.format.dateFormat !==
       null) {
        if (fieldInfo.format.dateFormat.toString().toUpperCase().indexOf("TIME") >= 0) {
          fieldInfo.format.time = true;
        }
        //if (fieldInfo.format.dateFormat ===
        //  "shortDateShortTime" ||
        //  fieldInfo.format.dateFormat ===
        //  "shortDateLongTime" ||
        //  fieldInfo.format.dateFormat ===
        //  "shortDateShortTime24" ||
        //  fieldInfo.format.dateFormat ===
        //  "shortDateLEShortTime" ||
        //  fieldInfo.format.dateFormat ===
        //  "shortDateLEShortTime24" ||
        //  fieldInfo.format.dateFormat ===
        //  "shortDateLELongTime" ||
        //  fieldInfo.format.dateFormat ===
        //  "shortDateLELongTime24") {
        //  fieldInfo.format.time = true;
        //}
      }
    }
  };
  return mo;
});