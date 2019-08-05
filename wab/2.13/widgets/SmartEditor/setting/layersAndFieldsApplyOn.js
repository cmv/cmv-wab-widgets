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
define(
  ["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/dom-construct',
    'dojo/on',
    'jimu/BaseWidgetSetting',
    'dijit/_TemplatedMixin',
    'jimu/dijit/CheckBox',
    'jimu/utils',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/query',
    'dojo/string',
    'dojo/text!./layerAndFieldsApplyOn.html'
  ],
  function (
    declare,
    lang,
    array,
    domConstruct,
    on,
    BaseWidgetSetting,
    _TemplatedMixin,
    CheckBox,
    jimuUtils,
    domAttr,
    domClass,
    query,
    String,
    template
  ) {
    return declare([BaseWidgetSetting, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-layersAndFieldsApplyOn",
      templateString: template,
      checkBoxNodes: null, // to store all fields checkbox domnode
      layerCheckBoxNodes: null, // to store all layer checkbox domnode
      defalutFieldInfos: [
        {
          "actionName": "Intersection",
          "enabled": false,
          "fields": []
        },
        {
          "actionName": "Address",
          "enabled": false
        },
        {
          "actionName": "Coordinates",
          "enabled": false,
          "coordinatesSystem": "MapSpatialReference",
          "field": "x"
        },
        {
          "actionName": "Preset",
          "enabled": false
        }
      ],
      nlsActionName: {
        "Intersection": "Intersection1",
        "Address": "Address1",
        "Coordinates": "Coordinates1",
        "Preset": "Preset1"
      },
      postCreate: function () {
        this.inherited(arguments);
        this.nlsActionName = {
          "Intersection": this.nls.actionPage.copyAction.intersection,
          "Address": this.nls.actionPage.copyAction.address,
          "Coordinates": this.nls.actionPage.copyAction.coordinates,
          "Preset": this.nls.actionPage.copyAction.preset
        };
        this.layerCheckBoxNodes = {};
        this.checkBoxNodes = {};
        this._prevAppliedOnLayers = [];
        if (this.appliedOn) {
          this._prevAppliedOnLayers = lang.clone(Object.keys(this.appliedOn));
        }
        this._addLayerAndFields();
      },

      _mergeFieldValuesForPreset: function (layerId) {
        var mergedFieldValues = {}, allFieldValues = [];
        //get feild values from all relations
        allFieldValues =
          this._getAllLayersFieldValues(allFieldValues, this._configInfos, layerId);
        for (var i = 0; i < allFieldValues.length; i++) {
          var singleFieldValue = allFieldValues[i];
          for (var field in singleFieldValue) {
            //if field values for this field are not availeble use it
            //else if availeble then loop through each action and merge the values
            //only if new values have action enabled and it is not of same group
            if (!mergedFieldValues.hasOwnProperty(field)) {
              mergedFieldValues[field] = singleFieldValue[field];
            } else {
              //for (var fieldValues in singleFieldValue[field]) {
              for (var j = 0; j < singleFieldValue[field].length; j++) {
                var fieldValues = singleFieldValue[field][j];
                if (fieldValues.actionName === this.actionName &&
                  fieldValues.enabled &&
                  (!this.prevName || !fieldValues.hasOwnProperty('attributeActionGroupName') ||
                    (fieldValues.hasOwnProperty('attributeActionGroupName') &&
                      fieldValues.attributeActionGroupName !==
                      this.prevName))) {
                  for (var k = 0; k < mergedFieldValues[field].length; k++) {
                    var mergedValues = mergedFieldValues[field][k];
                    if (mergedValues.actionName === this.actionName) {
                      mergedFieldValues[field][k] = fieldValues;
                    }
                  }
                }
              }
            }
          }
        }
        return mergedFieldValues;
      },

      /**
       * This function is used to pass appropriate params to functions to create layer and fields to apply on
       */
      _addLayerAndFields: function () {
        var layerDetails, layerToExpand = [], layersFieldValues;
        layerDetails = this.layerDetails;
        for (var layerId in layerDetails) {
          if (Object.keys(layerDetails[layerId]).length > 0) {
            var layerMainDiv = domConstruct.create('div', {
              "class": "esriCTLayerMainDiv"
            }, this.layerAndFieldsMainDiv);
            this._createLayerName(layerMainDiv, layerId);
            //in case of preset get merged field vlaues for the layer
            //consider all instance of the layer in relations
            if (this.actionName === "Preset") {
              layersFieldValues = this._mergeFieldValuesForPreset(layerId);
            } else {
              layersFieldValues = this._getLayersFieldValues(layerId);
            }
            //if layer has checked fields then add it to layerToExpand array
            if (this.appliedOn && this.appliedOn.hasOwnProperty(layerId) &&
              this.appliedOn[layerId].length > 0) {
              layerToExpand.push(layerId);
            }
            for (var field in layerDetails[layerId]) {
              //Show only those fields form the layer which are editable
              if (layerDetails[layerId][field].editable) {
                var hasExistingFieldValues = false;
                var layerFieldDiv = domConstruct.create('div', {
                  "class": "esriCTFieldsDiv  esriCTHidden"
                }, this.layerAndFieldsMainDiv);
                domAttr.set(layerFieldDiv, "layerid", layerId);
                if (layersFieldValues &&
                  layersFieldValues.hasOwnProperty(field)) {
                  array.some(layersFieldValues[field], function (fieldValues) {
                    if (fieldValues.actionName === this.actionName &&
                      fieldValues.enabled &&
                      (!fieldValues.hasOwnProperty('attributeActionGroupName') ||
                        (fieldValues.hasOwnProperty('attributeActionGroupName') &&
                          fieldValues.attributeActionGroupName !==
                          this.prevName))) {
                      hasExistingFieldValues = true;
                      return true;
                    }
                  }, this);
                }
                this._createFieldName(layerDetails[layerId][field], layerId,
                  layerFieldDiv, hasExistingFieldValues);
              }
            }
          }
        }

        if (layerToExpand.length > 0) {
          setTimeout(lang.hitch(this, function () {
            this._applyPrevSettings();
            array.forEach(layerToExpand, lang.hitch(this, function (rootLayerId) {
              var rootLayerNode = query('[rootnodelayerid="' + rootLayerId + '"]');
              if (rootLayerNode && rootLayerNode.length > 0 &&
                domClass.contains(rootLayerNode[0], "esriCTToggleLayerExpanded")) {
                //toggle expand/collapse icon
                query('[rootnodelayerid="' + rootLayerId + '"]').toggleClass("esriCTToggleLayerExpanded");
                //toggle each field in the layer
                query('[layerid="' + rootLayerId + '"]').toggleClass("esriCTHidden");
              }
            }));
          }), 100);
        }
      },

      /**
       * This function is used to create Layers to apply on
       */
      _createLayerName: function (layerMainDiv, layerId) {
        var layerName, layerIconDiv, checkBoxWrapper, checkBox, rootLayerId, checkBoxNode;
        this.layerCheckBoxNodes[layerId] = [];
        this.checkBoxNodes[layerId] = [];
        //if layer/table exist then add it
        if (this.layerInfos.getLayerOrTableInfoById(layerId)) {
          //get layer name
          layerName = this.layerInfos.getLayerOrTableInfoById(layerId).layerObject.name;
          //create icon to toggle layers visibility
          layerIconDiv = domConstruct.create('div', {
            "class": "esriCTToggleLayerIcon esriCTToggleLayerCollapsed esriCTToggleLayerExpanded"
          }, layerMainDiv);
          domAttr.set(layerIconDiv, "rootnodelayerid", layerId);
          //handle click of layer togglr icon
          this.own(on(layerIconDiv, "click", lang.hitch(this, function (evt) {
            domClass.toggle(evt.currentTarget, "esriCTToggleLayerExpanded");
            rootLayerId = domAttr.get(evt.currentTarget, "rootnodelayerid");
            query('[layerid="' + rootLayerId + '"]').toggleClass("esriCTHidden");
          })));
          //create checkbox to check all fields of the layer
          checkBoxWrapper = domConstruct.create('div', {
            "class": "esriCTLayercheckBox"
          }, layerMainDiv);
          //As per ticket #224
          //Removed checkbox at layer level and only shown layer name
          //Code is dependent on layer checkbox,
          //so we are just not adding layer checkbox in domNode but creating in memory
          checkBoxNode = domConstruct.create('div', {
            "innerHTML": layerName
          }, checkBoxWrapper);
          checkBox = new CheckBox({
            label: layerName,
            checked: false
          });
          //add the checkbox in layerCheckBoxNodes array
          this.layerCheckBoxNodes[layerId].push(checkBox);
          domAttr.set(checkBox.domNode, "LayerCheckBoxId", layerId);
          on(checkBox.domNode, 'click', lang.hitch(this, this._parentNodeStateChanged));
        }
      },

      _getLayersFieldValues: function (layerId) {
        var fieldValues;
        array.some(this._configInfos, function (layer) {
          if (layer.featureLayer && layer.featureLayer.id === layerId) {
            //if no field values found for the layer add it so that we can add group
            if (layer.fieldValues) {
              fieldValues = layer.fieldValues;
            } else {
              layer.fieldValues = {};
            }
            return true;
          }
        }, this);
        return fieldValues;
      },

      _getAllLayersFieldValues: function (fieldValues, configInfos, layerId) {
        array.forEach(configInfos, function (layer) {
          if (layer.featureLayer && layer.featureLayer.id === layerId) {
            if (layer.fieldValues) {
              if (!fieldValues) {
                fieldValues = [];
              }
            } else {
              layer.fieldValues = {};
            }
            fieldValues.push(layer.fieldValues);
          }
          if (layer.relationshipInfos) {
            fieldValues =
              this._getAllLayersFieldValues(fieldValues, layer.relationshipInfos, layerId);
          }
        }, this);
        return fieldValues;
      },

      /**
       * This function is used to create Layer fields to apply on
       */
      _createFieldName: function (field, layerId, layerFieldDiv, hasExistingFieldValues) {
        var checkBox, fieldInfo;
        fieldInfo = jimuUtils.getDefaultPortalFieldInfo(field);
        var existingValueMsg = String.substitute(
          this.nls.attributeActionsPage.alreadyAppliedActionMsg, {
            action: this.nlsActionName[this.actionName]
          });
        var existingInfoWarning = domConstruct.create('div', {
          "class": "esriCTExistingExpressionDiv esriCTVisibilityHidden",
          "title": existingValueMsg
        }, layerFieldDiv);
        if (hasExistingFieldValues) {
          domClass.remove(existingInfoWarning, "esriCTVisibilityHidden");
        }
        var checkBoxNode = domConstruct.create('div', {
          "class": "esriCTFieldsCheckBox"
        }, layerFieldDiv);
        checkBox = new CheckBox({
          label: fieldInfo.label,
          value: fieldInfo.fieldName,
          checked: false
        }, checkBoxNode);
        this.checkBoxNodes[layerId].push(checkBox);
        domAttr.set(checkBox.domNode, "fieldsCheckBoxId", layerId);
        on(checkBox.domNode, 'click', lang.hitch(this, this._childNodeStateChanged));
      },

      /**
       * Callback handler for parents checkbox change event.
       * This will change the state of related child's based on parents state.
       */
      _parentNodeStateChanged: function (evt) {
        var layerId, parentCheckbox, childCheckboxes, parentState;
        layerId = domAttr.get(evt.currentTarget, "LayerCheckBoxId");
        parentCheckbox = this.layerCheckBoxNodes[layerId];
        childCheckboxes = this.checkBoxNodes[layerId];
        parentState = parentCheckbox[0].getValue();
        array.forEach(childCheckboxes, lang.hitch(this, function (checkBox) {
          if (parentState) {
            checkBox.setValue(true);
          } else {
            checkBox.setValue(false);
          }
        }));
      },

      /**
       * Callback handler for child checkbox change event.
       * This will change the state of related parent based on states of all child's.
       */
      _childNodeStateChanged: function (evt) {
        var layerId, parentCheckbox, childCheckboxes, enableParent;
        layerId = domAttr.get(evt.currentTarget, "fieldsCheckBoxId");
        parentCheckbox = this.layerCheckBoxNodes[layerId];
        childCheckboxes = this.checkBoxNodes[layerId];
        enableParent = true;
        array.some(childCheckboxes, lang.hitch(this, function (checkBox) {
          if (!checkBox.getValue()) {
            enableParent = false;
            return true;
          }
        }));
        parentCheckbox[0].setValue(enableParent);
      },

      /**
       * This function is used get checked fields of layer
       */
      getCheckedFields: function (groupInfo) {
        var appliedOn = {};
        for (var layerId in this.checkBoxNodes) {
          appliedOn[layerId] = [];
          for (var field in this.checkBoxNodes[layerId]) {
            if ((this.checkBoxNodes[layerId][field].checked)) {
              var fieldCheckBox = this.checkBoxNodes[layerId][field];
              appliedOn[layerId].push(fieldCheckBox.get("value"));
            }
          }
        }
        this._applySettingsInLayer(groupInfo, appliedOn);
        return appliedOn;
      },
      _removeSettingsFromOtherGroups: function (currentGroupName, layerId, field) {
        var groupsAppliedOn;
        //apply settings on other groups if existing settings is valid
        if (this.existingGroups) {
          //loop through all the groups and remove settings for selected layerId, field
          for (var groupName in this.existingGroups) {
            //skip the current group on which the settings are being applied
            if (groupName !== currentGroupName && groupName !== this.prevName) {
              groupsAppliedOn = this.existingGroups[groupName].appliedOn;
              //remove the settings for the fields action form the other group
              if (groupsAppliedOn && groupsAppliedOn.hasOwnProperty(layerId) &&
                groupsAppliedOn[layerId].indexOf(field) > -1) {
                var fieldindex = groupsAppliedOn[layerId].indexOf(field);
                groupsAppliedOn[layerId].splice(fieldindex, 1);
              }
            }
          }
        }
      },

      _removePrevSettingsFromLayerFields: function (layerId) {
        var layersFieldValues, allFieldValues = [];
        allFieldValues = this._getAllLayersFieldValues(allFieldValues, this._configInfos, layerId);
        if (allFieldValues && allFieldValues.length > 0) {
          for (var j = 0; j < allFieldValues.length; j++) {
            layersFieldValues = allFieldValues[j];
            if (layersFieldValues) {
              for (var field in layersFieldValues) {
                var fieldValues = layersFieldValues[field];
                for (var i = 0; i < fieldValues.length; i++) {
                  if (fieldValues[i].actionName === this.actionName &&
                    fieldValues[i].hasOwnProperty('attributeActionGroupName') &&
                    fieldValues[i].attributeActionGroupName === this.prevName) {
                    fieldValues[i].enabled = false;
                    delete fieldValues[i].attributeActionGroupName;
                    if (this.actionName === "Intersection") {
                      fieldValues[i].fields = [];
                      fieldValues[i].ignoreLayerRanking = false;
                    } else if (this.actionName === "Address") {
                      delete fieldValues[i].field;
                    } else if (this.actionName === "Coordinates") {
                      fieldValues[i].coordinatesSystem = "MapSpatialReference";
                      fieldValues[i].field = "x";
                    }
                  }
                }
              }
            }
          }
        }
      },


      _applysettingsToField: function (layerId, allFields, groupInfo) {
        //get all possible instances for field values of this layer id
        var layersFieldValues, allFieldValues = [];
        allFieldValues = this._getAllLayersFieldValues(allFieldValues, this._configInfos, layerId);
        if (allFieldValues && allFieldValues.length > 0) {
          for (var i = 0; i < allFieldValues.length; i++) {
            layersFieldValues = allFieldValues[i];
            //first clear prev applied fields of this layer
            if (this.appliedOn && this.appliedOn.hasOwnProperty(layerId)) {
              var checkedFields = this.appliedOn[layerId];
              if (checkedFields && checkedFields.length > 0) {
                array.forEach(checkedFields, function (field) {
                  if (allFields.indexOf(field) === -1 &&
                    layersFieldValues.hasOwnProperty(field)) {
                    var fieldValues;
                    fieldValues = layersFieldValues[field];
                    for (var i = 0; i < fieldValues.length; i++) {
                      if (fieldValues[i].actionName === this.actionName) {
                        fieldValues[i].enabled = false;
                        delete fieldValues[i].attributeActionGroupName;
                        if (this.actionName === "Intersection") {
                          fieldValues[i].fields = [];
                          fieldValues[i].ignoreLayerRanking = false;
                        } else if (this.actionName === "Address") {
                          delete fieldValues[i].field;
                        } else if (this.actionName === "Coordinates") {
                          fieldValues[i].coordinatesSystem = "MapSpatialReference";
                          fieldValues[i].field = "x";
                        }
                      }
                    }
                  }
                }, this);
              }
            }
          }
          //now apply settings in all fields
          array.forEach(allFields, function (field) {
            for (var j = 0; j < allFieldValues.length; j++) {
              var fieldValues;
              layersFieldValues = allFieldValues[j];
              //if fieldValues are present for this layer updat it
              //else add field with all defalut field validation
              if (!layersFieldValues.hasOwnProperty(field)) {
                layersFieldValues[field] = lang.clone(this.defalutFieldInfos);
              }
              fieldValues = layersFieldValues[field];
              for (var i = 0; i < fieldValues.length; i++) {
                if (fieldValues[i].actionName === this.actionName) {
                  //in case of prest thier would be no info
                  //only enalbe the action and copy group name in it
                  if (groupInfo.attributeInfo) {
                    fieldValues[i] = lang.mixin(fieldValues[i], groupInfo.attributeInfo);
                  }
                  fieldValues[i].enabled = true;
                  fieldValues[i].attributeActionGroupName = groupInfo.name;
                  //In case of Preset add preset value info in _configuredPresetInfos
                  if (this.actionName === "Preset" && this._configuredPresetInfos) {
                    this._configuredPresetInfos[field] = groupInfo.presetValue;
                  }
                  //once applied any action form this group
                  //remove this attribute action for this field from all other groups
                  this._removeSettingsFromOtherGroups(groupInfo.name, layerId, field);
                }
              }
            }
          }, this);
        }
      },

      _applySettingsInLayer: function (groupInfo, appliedOn) {
        for (var layerId in appliedOn) {
          var prevIndex;
          if (this._prevAppliedOnLayers &&
            this._prevAppliedOnLayers.indexOf(layerId) > -1) {
            prevIndex = this._prevAppliedOnLayers.indexOf(layerId);
            this._prevAppliedOnLayers.splice(prevIndex, 1);
          }
          this._applysettingsToField(layerId, appliedOn[layerId], groupInfo);
        }
        //If any layer was prev configured, and now thier is no action on that layer
        //remove all prev configuration of this group with layer
        this.deleteGroup();
      },


      deleteGroup: function () {
        if (this._prevAppliedOnLayers) {
          array.forEach(this._prevAppliedOnLayers, function (prevLayerId) {
            this._removePrevSettingsFromLayerFields(prevLayerId);
          }, this);
        }
      },

      /**
       * This function is used to check whether current field is checked or not previously
       */
      _applyPrevSettings: function () {
        if (this.appliedOn) {
          for (var layerId in this.appliedOn) {
            if (this.appliedOn.hasOwnProperty(layerId)) {
              var checkedFields = this.appliedOn[layerId];
              if (checkedFields && checkedFields.length > 0) {
                var parentCheckbox = this.layerCheckBoxNodes[layerId];
                var enableParent = true;
                array.forEach(this.checkBoxNodes[layerId],
                  lang.hitch(this, function (checkBox) {
                    if (checkedFields.indexOf(checkBox.value) > -1) {
                      checkBox.setValue(true);
                    } else if (!checkBox.getValue()) {
                      enableParent = false;
                    }
                  }));
                if (enableParent && parentCheckbox && parentCheckbox[0]) {
                  parentCheckbox[0].setValue(enableParent);
                }
              }
            }
          }
        }
      }
    });
  });