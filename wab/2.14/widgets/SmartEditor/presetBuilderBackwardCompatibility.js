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
  "dojo/_base/lang",
  "dojo/_base/array",
  'jimu/utils',
  './presetUtils'
],
  function (
    lang,
    array,
    utils,
    presetUtils
  ) {

    var mo = {};

    mo.createPresetGroups = function (config, jimuLayerInfos) {
    /* Preset Builder Backward compatibility code */
    //Backward compatibility for the apps configured before 2.14 WAB
    //Update the preset based on fields to Preset Builder Groups
      mo.config = config;
      mo._jimuLayerInfos = jimuLayerInfos;
    //Add attribute action groups key and preset key if not exist in current config
    if (config.editor.presetInfos &&
      Object.keys(config.editor.presetInfos).length > 0) {
      if (!config.attributeActionGroups) {
        config.attributeActionGroups = {
          "Intersection": {},
          "Address": {},
          "Coordinates": {},
          "Preset": {}
        };
      } else if (config.attributeActionGroups &&
        !config.attributeActionGroups.hasOwnProperty("Preset")) {
        config.attributeActionGroups.Preset = {};
      }
      //if preset groups are already created then return from the function
      if (config.attributeActionGroups && config.attributeActionGroups.Preset &&
        Object.keys(config.attributeActionGroups.Preset).length > 0) {
        return;
      }
      // process each field in preset info and create preset group for it
      for (var fieldName in config.editor.presetInfos) {
        //In widget mode use configInfos object and in builder mode use layerInfos object
        var layerInfos = config.editor.configInfos || config.editor.layerInfos;
        mo._addPresetGroupForField(layerInfos, fieldName);
      }
    }

  };

  mo._getDomainListForPresetGroup = function (groupInfo, fieldInfo, fieldName) {
    var domainList = [];
    //TODO: Check if we can merge domains of multiple fields with same name
    array.forEach(fieldInfo.domain.codedValues, lang.hitch(this,
      function (codedDomain) {
        //if Code found in doamin
        var newDomainObj = {
          "showInList": true,
          "value": codedDomain.code,
          "label": codedDomain.name,
          "isDefault": false
        };
        groupInfo.showOnlyDomainFields = true;
        var codeValue = mo.config.editor.presetInfos[fieldName][0];
        if (groupInfo.dataType === "esriFieldTypeInteger") {
          codeValue = Number(codeValue);
        }
        if (mo.config.editor.presetInfos[fieldName].length > 0) {
          if (codedDomain.code === codeValue) {
            newDomainObj.isDefault = true;
          }
        } else {
          if (domainList.length === 0) {
            newDomainObj.isDefault = true;
          }
        }
        domainList.push(newDomainObj);
      }));
    return domainList;
  };

  mo._addPresetGroupForField = function (layerInfos, fieldName) {
    var createdPresetGroupForField;
    array.some(layerInfos, lang.hitch(this, function (layerInfo) {
      if (createdPresetGroupForField) {
        return true;
      }
      if (layerInfo.fieldValues && layerInfo.fieldValues[fieldName]) {
        var fieldValues = layerInfo.fieldValues[fieldName];
        for (var i = 0; i < fieldValues.length; i++) {
          if (fieldValues[i].actionName === "Preset" && fieldValues[i].enabled) {
            fieldValues[i].attributeActionGroupName = fieldName;
            var layerTableInfo =
              mo._jimuLayerInfos.getLayerOrTableInfoById(layerInfo.featureLayer.id);
            if (layerTableInfo && layerTableInfo.layerObject && layerTableInfo.layerObject.fields) {
              var fieldInfo = presetUtils.getFieldInfoByFieldName(
                layerTableInfo.layerObject.fields, fieldName);
              var portalFieldInfos = utils.getDefaultPortalFieldInfo(fieldInfo);
              var uniqueGroupName = portalFieldInfos.label + " (" + fieldName + ")";
              var groupInfo = {};
              //Now with preset group, one group name can be used only once,
              //To follow this, when creating groups from bacward preset conifgs
              //we are creating unique group name as 'FieldAlias (FieldName)'
              groupInfo.name = uniqueGroupName;
              var numberTypes = ["esriFieldTypeInteger", "esriFieldTypeSmallInteger",
                "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"];
              if (numberTypes.indexOf(fieldInfo.type) > 0) {
                groupInfo.dataType = "esriFieldTypeInteger";
              } else {
                groupInfo.dataType = fieldInfo.type;
              }
              groupInfo.showOnlyDomainFields = false;
              groupInfo.hideInPresetDisplay = false;
              groupInfo.appliedOn =
                mo._getPresetFieldsForAppliedOn(fieldInfo, groupInfo);

              //If preset value is configured use that presetValue for group
              //For domians create domain list
              //For dates if dateValue is configured set it to Fixed else use Current
              //For use the value directly
              if (fieldInfo.domain && fieldInfo.domain.type !== "range") {
                groupInfo.presetValue =
                  mo._getDomainListForPresetGroup(groupInfo, fieldInfo, fieldName);
              } else if (fieldInfo.type === "esriFieldTypeDate") {
                var dateFieldValue, timeObj, dateObj;
                //if date is configured set prev value and choose dateType to Fixed
                //else use Current dateType
                if (mo.config.editor.presetInfos[fieldName].length > 0) {
                  //get date value
                  if (!isNaN(mo.config.editor.presetInfos[fieldName][0]) &&
                    mo.config.editor.presetInfos[fieldName][0] !== "") {
                    dateObj = new Date(mo.config.editor.presetInfos[fieldName][0]);
                  }
                  //get time value if configured
                  if (mo.config.editor.presetInfos[fieldName][1] &&
                    !isNaN(mo.config.editor.presetInfos[fieldName][1])) {
                    timeObj = new Date(mo.config.editor.presetInfos[fieldName][1]);
                  }
                  //if both date and time is configured use it to create fixed date
                  //else just use dateValue
                  if (dateObj && timeObj) {
                    dateFieldValue = new Date(
                      dateObj.getFullYear(),
                      dateObj.getMonth(),
                      dateObj.getDate(),
                      timeObj.getHours(),
                      timeObj.getMinutes(),
                      timeObj.getSeconds(),
                      timeObj.getMilliseconds()
                    );
                  } else {
                    dateFieldValue = dateObj;
                  }
                  if (dateFieldValue) {
                    groupInfo.presetValue = {
                      "dateType": "fixed",
                      "dateTime": dateFieldValue.getTime()
                    };
                  } else {
                    groupInfo.presetValue = {
                      "dateType": "fixed",
                      "dateTime": ""
                    };
                  }
                } else {
                  groupInfo.presetValue = {
                    "dateType": "fixed",
                    "dateTime": ""
                  };
                }
              } else {
                //if preset value is configured use that presetValue for group
                if (mo.config.editor.presetInfos[fieldName].length > 0) {
                  groupInfo.presetValue = mo.config.editor.presetInfos[fieldName][0];
                } else {
                  //TODO: check if need to store differnt values in differnet fieldtype in case of empty values
                  groupInfo.presetValue = null;
                }
              }

              mo.config.attributeActionGroups.Preset[groupInfo.name] = groupInfo;
              createdPresetGroupForField = true;
              //break for each fieldvalues loop
              break;
            }
          }
        }
      }
      //if preset group for slected field is not yet created look into related layers
      if (!createdPresetGroupForField &&
        layerInfo.relationshipInfos && layerInfo.relationshipInfos.length > 0) {
        createdPresetGroupForField =
          mo._addPresetGroupForField(layerInfo.relationshipInfos, fieldName);
      }
    }));
    return createdPresetGroupForField;
  };

  mo._isPresetEnabledForLayer = function (layerInfo, fieldInfo, appliedOn, groupInfo) {
    if (layerInfo.fieldValues[fieldInfo.name]) {
      var fieldValues = layerInfo.fieldValues[fieldInfo.name];
      for (var i = 0; i < fieldValues.length; i++) {
        if (fieldValues[i].actionName === "Preset" && fieldValues[i].enabled) {
          var jimuLayerInfo = mo._jimuLayerInfos.getLayerOrTableInfoById(layerInfo.featureLayer.id);
          var layerFields = jimuLayerInfo.layerObject.fields;
          var currentFieldInfo = presetUtils.getFieldInfoByFieldName(layerFields, fieldInfo.name);
          if (currentFieldInfo.type === fieldInfo.type) {
            //store group name in the attributeActionGroupName
            fieldValues[i].attributeActionGroupName = groupInfo.name;
            //add current field in applied on array for current layer
            if (!appliedOn.hasOwnProperty(layerInfo.featureLayer.id)) {
              appliedOn[layerInfo.featureLayer.id] = [fieldInfo.name];
            } else {
              appliedOn[layerInfo.featureLayer.id].push(fieldInfo.name);
            }
          }
        }
      }
    }
    return appliedOn;
  };

  mo._getPresetFieldsForAppliedOn = function (fieldInfo, groupInfo) {
    var layerInfos, appliedOn = {};
    //In widget mode use configInfos object and in builder mode use layerInfos object
    layerInfos = mo.config.editor.configInfos || mo.config.editor.layerInfos;
    array.forEach(layerInfos, lang.hitch(this, function (layerInfo) {
      if (layerInfo.fieldValues && layerInfo.fieldValues[fieldInfo.name]) {
        appliedOn =
          mo._isPresetEnabledForLayer(layerInfo, fieldInfo, appliedOn, groupInfo);
      }
      if (layerInfo.relationshipInfos && layerInfo.relationshipInfos.length > 0) {
        array.forEach(layerInfo.relationshipInfos,
          lang.hitch(this, function (relatedLayerInfo) {
            if (relatedLayerInfo.fieldValues && relatedLayerInfo.fieldValues[fieldInfo.name]) {
              appliedOn =
                mo._isPresetEnabledForLayer(
                  relatedLayerInfo, fieldInfo, appliedOn, groupInfo);
            }
          }));
      }
    }));
    return appliedOn;
  };

    return mo;
  });