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
  'esri/geometry/Extent'
], function (lang, array, Extent) {

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
      if (attributes.hasOwnProperty(prop) &&
        (attributes[prop] !== origAttributes[prop] ||
        (prop === featureLayer.objectIdField ||
        prop === featureLayer.globalIdField))) {
        updatedAttrs[prop] = attributes[prop];
      }
    }
    return updatedAttrs;
  };

  mo.getFieldInfosFromWebmap = function (layerObject, jimuLayerInfos) {
    // summary:
    //   get fieldInfos from web map.
    // description:
    //   return null if fieldInfos has not been configured.
    var fieldInfos = null;
    var jimuLayerInfo = jimuLayerInfos.getLayerInfoByTopLayerId(layerObject.id);
    if (jimuLayerInfo) {
      var popupInfo = jimuLayerInfo.getPopupInfo();
      if (popupInfo && popupInfo.fieldInfos) {
        fieldInfos = lang.clone(popupInfo.fieldInfos);
      }
    }
    array.forEach(fieldInfos, function (fieldInfo) {
      var layerFields = array.filter(layerObject.fields, function (field) {
        if (field.name === fieldInfo.fieldName){
          return true;
        }
      });
      if (layerFields && layerFields.length > 0) {
        fieldInfo.nullable = layerFields[0].nullable;

      }
    });
    return fieldInfos;
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

  return mo;
});