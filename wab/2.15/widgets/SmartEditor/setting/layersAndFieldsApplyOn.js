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
  ['dojo/_base/declare',
    'dojo/Evented',
    'dojo/_base/lang',
    'dojo/_base/array',
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
    'dojo/dom-style',
    'dijit/form/ValidationTextBox',
    'dojo/text!./layerAndFieldsApplyOn.html',
    'dijit/form/CheckBox'
  ],
  function (
    declare,
    Evented,
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
    domStyle,
    TextBox,
    template,
    dojoCheckBox
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-layersAndFieldsApplyOn",
      templateString: template,
      checkBoxNodes: null, // to store all fields checkbox domnode
      layerCheckBoxNodes: null, // to store all layer checkbox domnode
      showDomainFieldIndicator: false, //show * to indicate domain field
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
        this._addSearchControl();
        this._addLayerAndFields(true);
      },

      _addSearchControl: function () {
        //Create Textbox to enter GroupName
        var searchTextBox = new TextBox({
          "trim": true,
          "placeHolder": this.nls.actionPage.searchPlaceHolder,
          "intermediateChanges":true
        }, domConstruct.create("div", {}, this.searchNode));
        domStyle.set(searchTextBox.domNode, "width", "350px");
        this.own(on(searchTextBox, "change", lang.hitch(this, this._searchTextUpdated)));

        //create node to show switch and label to epand all layers
        var expandAllNode = domConstruct.create("div", {
          "class": "esriCTExpandAllNode"
        }, this.searchNode);
        //use dojo checkbox to create switch
        this._expandAllCheckBox = new dojoCheckBox({
          "class": "switch-toggle",
          checked: false
        }, domConstruct.create("div", {}, expandAllNode));
        //create label to show text "Expand All Layers"
        domConstruct.create("label", {
          "innerHTML": this.nls.actionPage.expandAllLabel
        }, expandAllNode);
        //on change of switch expand all layers if switch is turned to on
        this.own(on(this._expandAllCheckBox, "change", lang.hitch(this, function (isChecked) {
          var allLayerIcons;
          //expand or collapse all layers based on checked state
          if (isChecked) {
            //get all layer icons which are not expanded
            allLayerIcons =
              query(".esriCTToggleLayerIcon.esriCTToggleLayerCollapsed.esriCTToggleLayerExpanded",
                this.layerAndFieldsMainDiv);
            //perform click action on each of the icons, which will result in expanding the layer
            if (allLayerIcons && allLayerIcons.length > 0) {
              array.forEach(allLayerIcons, function (layerToggleIcon) {
                layerToggleIcon.click();
              });
            }
          } else {
            //get all layer icons which are expanded
            allLayerIcons =
              query(".esriCTToggleLayerIcon.esriCTToggleLayerCollapsed",
                this.layerAndFieldsMainDiv);
            //perform click action on icons, which will result in collapsing the layer
            if (allLayerIcons && allLayerIcons.length > 0) {
              array.forEach(allLayerIcons, function (layerToggleIcon) {
                //collapse only those layers which are expanded
                if (!domClass.contains(layerToggleIcon, "esriCTToggleLayerExpanded")) {
                  layerToggleIcon.click();
                }
              });
            }
          }
        })));
      },

      _searchTextUpdated: function (value) {
        var searchValue, allFields, fieldsMatchingSearchText, layerDetails;
        searchValue = value.toLowerCase();
        //if search value is not empty then show only fields matching search text
        //else show all fields
        if (searchValue !== "") {
          allFields = query("[searchstring]", this.layerAndFieldsMainDiv);
          fieldsMatchingSearchText =
            query("div[searchstring^=" + "'" + searchValue + "']", this.layerAndFieldsMainDiv);
          //hide all fields
          allFields.style("display", "none");
          //remove not filtered by search class and add filtered by search class
          allFields.removeClass("esriCTNotFilteredBySearch");
          allFields.addClass("esriCTFilteredBySearch");
          //show all matching fields
          fieldsMatchingSearchText.style("display", "");
          //set not filterd class to matching feilds
          fieldsMatchingSearchText.replaceClass(
            "esriCTNotFilteredBySearch", "esriCTFilteredBySearch");
          //based on if any field available in the layer show/hide the layer name div
          layerDetails = this.layerDetails;
          for (var layerId in layerDetails) {
            var mainLayerNode, fieldsForLayer, hideMainLayerNode, i;
            if (Object.keys(layerDetails[layerId]).length > 0) {
              mainLayerNode = query("[layermaindivid = '" + layerId + "']",
                this.layerAndFieldsMainDiv);
              fieldsForLayer =
                query("[layerid='" + layerId + "']", this.layerAndFieldsMainDiv);
              hideMainLayerNode = true;
              for (i = 0; i < fieldsForLayer.length; i++) {
                if (domClass.contains(fieldsForLayer[i], "esriCTNotFilteredBySearch")) {
                  hideMainLayerNode = false;
                  break;
                }
              }
              if (hideMainLayerNode) {
                mainLayerNode.style("display", "none");
              } else {
                mainLayerNode.style("display", "");
              }
            }
          }
        } else {
          query("[layermaindivid]", this.layerAndFieldsMainDiv).style("display", "");
          query("[searchstring]", this.layerAndFieldsMainDiv).style("display", "");
          query("[searchstring]", this.layerAndFieldsMainDiv).removeClass("esriCTFilteredBySearch");
          query("[searchstring]", this.layerAndFieldsMainDiv).addClass("esriCTNotFilteredBySearch");
        }
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
            domAttr.set(layerMainDiv, "layermaindivid", layerId);
            this._createLayerName(layerMainDiv, layerId);
            layersFieldValues = this._getLayersFieldValues(layerId);
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
                  var matchedFieldValues;
                  array.some(layersFieldValues[field], function (fieldValues) {
                    if (fieldValues.actionName === this.actionName &&
                      fieldValues.enabled &&
                      (!fieldValues.hasOwnProperty('attributeActionGroupName') ||
                        (fieldValues.hasOwnProperty('attributeActionGroupName') &&
                          fieldValues.attributeActionGroupName !==
                          this.prevName))) {
                      matchedFieldValues = fieldValues;
                      hasExistingFieldValues = true;
                      return true;
                    }
                  }, this);
                  //When Action is preset it should have attributeActionGroupName
                  //since preset can be done at group level only
                  //to override backward configurations we need to ignore presets without groupname
                  if (this.actionName === "Preset" && hasExistingFieldValues &&
                    matchedFieldValues &&
                    (!matchedFieldValues.hasOwnProperty('attributeActionGroupName') ||
                    matchedFieldValues.attributeActionGroupName === "")) {
                    hasExistingFieldValues = false;
                  }
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
            this.emit("layerFieldsUpdated", true);
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
            //if layer is getting collapsed then uncheck the expand all switch
            if (domClass.contains(evt.currentTarget, "esriCTToggleLayerExpanded")) {
              this._expandAllCheckBox.set('checked', false, false);
            }
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
        //show domain list icon for domain fields only and when showDomainFieldIndicator is true
        if (this.showDomainFieldIndicator) {
          var domainList = domConstruct.create('div', {
            "class": "esriCTDomainlistDiv esriCTVisibilityHidden",
            "innerHTML": "*",
            "title": this.nls.actionPage.domainListTitle
          }, layerFieldDiv);
          if (field.domain && field.domain.codedValues) {
            domClass.remove(domainList, "esriCTVisibilityHidden");
            //show hint msg only when atleast one doamin field is present
            domClass.remove(this.domainFieldHintMsg, "esriCTHidden");
          }
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
        domAttr.set(layerFieldDiv, "searchstring", fieldInfo.label.toLowerCase());
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
        this.emit("layerFieldsUpdated", false);
      },

       /**
       * This function is used only to get checked fields of layer
       */
      getOnlyCheckedFields: function () {
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
        return appliedOn;
      },

      /**
       * This function is used get checked fields of layer and apply settings in layer
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