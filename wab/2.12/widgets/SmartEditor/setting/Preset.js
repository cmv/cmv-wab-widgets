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
    "dojo/Evented",
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/dom-construct',
    'dojo/on',
    "dojo/text!./Preset.html",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    "jimu/dijit/Popup",
    "dijit/form/Select",
    'dijit/form/ValidationTextBox',
    './ChooseFromLayer',
    'dojo/dom-class',
    'dijit/form/DateTextBox',
    'dijit/form/NumberTextBox',
    'dijit/form/TimeTextBox',
    "./layersAndFieldsApplyOn",
    '../presetUtils'
  ],
  function (
    declare,
    Evented,
    lang,
    array,
    domConstruct,
    on,
    template,
    _TemplatedMixin,
    BaseWidgetSetting,
    Popup,
    Select,
    TextBox,
    ChooseFromLayer,
    domClass,
    DateTextBox,
    NumberTextBox,
    TimeTextBox,
    layersAndFieldsApplyOn,
    presetUtils
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-presetPopup",
      templateString: template,
      groupNameTextBox: null, // to store group name text box instance
      dataTypeDropdown: null, // to store data type dropdown instance,
      hasDomainField: null,
      presetValueDijitNode: null,
      presetValueTimeNode: null,
      ValidFieldsByTypeToApplyOn: {
        "esriFieldTypeInteger": ["esriFieldTypeSmallInteger",
          "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeGUID": ["esriFieldTypeGUID"],
        "esriFieldTypeDate": ["esriFieldTypeDate"],
        "esriFieldTypeString": ["esriFieldTypeString"]
      },

      postCreate: function () {
        this.inherited(arguments);
        this._isDomainField();
        this._initControls();
        //Dont show dialog when deleteing group
        if (!this.isDelete) {
          this.showDialog();
        }
      },

      /**
       * This functions is used to Create dijit controls for preset popup
       */
      _initControls: function () {
        //Create Textbox to enter GroupName
        this.groupNameTextBox = new TextBox({
          required: true,
          trim: true,
          "style": {
            "width": "100%"
          }
        });
        this.groupNameTextBox.placeAt(this.groupNameDiv);
        //validate groupname for not empty and unique
        this.groupNameTextBox.validator = lang.hitch(this, function (value) {
          if (!value) {
            this.groupNameTextBox.set("invalidMessage",
              this.nls.smartActionsPage.requiredGroupNameMsg);
            return false;
          }
          if (value !== this.prevName &&
            this.existingGroupNames.indexOf(value) > -1) {
            this.groupNameTextBox.set("invalidMessage",
              this.nls.smartActionsPage.uniqueGroupNameMsg);
            return false;
          }
          return true;
        });
        this.groupNameTextBox.startup();
        if (this.name) {
          this.groupNameTextBox.set('value', this.name);
        }

        //Create DropDown for Data Type Selection
        this.dataTypeDropdown = new Select({
          options: this._addDataTypeOptions(),
          "style": {
            "width": "100%"
          }
        });
        this.own(on(this.dataTypeDropdown, "change", lang.hitch(this, this._createValueDijit)));
        this.dataTypeDropdown.placeAt(this.dataTypeDropdownDiv);
        this.dataTypeDropdown.startup();
        if (this.dataType) {
          this.dataTypeDropdown.set('value', this.dataType, false);
          this._createValueDijit(this.dataType, this.presetValue);
        }
      },

      _createValueDijit: function (fieldType, presetValue) {
        var nodesArray, value = null;
        nodesArray = this.createDijitOnDataTypeChange(fieldType);
        if (nodesArray && nodesArray.length > 0) {
          //set first node in array as value dijit
          this.presetValueDijitNode = nodesArray[0];
          this.presetValueDijitNode.placeAt(this.presetValueDiv);
          this.presetValueDijitNode.startup();
          //If case of date and time node array will contain 2 dijits
          //so consider second dijit for time
          if (nodesArray.length > 1) {
            this.presetValueDijitNode = nodesArray[0];
            this.presetValueTimeNode = nodesArray[1];
            this.presetValueTimeNode.placeAt(this.presetValueTimeNodeDiv);
            this.presetValueTimeNode.startup();
            //get the values stored and show date and time
            if (presetValue && presetValue.length > 1) {
              value = presetValue[0];
            }
            //if has value create its date obj
            value = (value === "" || value === null) ? null : new Date(value);
            this.presetValueDijitNode.set('value', value);
            this.presetValueTimeNode.set('value', value);
          } else {
            //if has prev set preset value show it in dijit
            if (presetValue && presetValue.length > 0) {
              this.presetValueDijitNode.set('value', presetValue[0]);
            }
          }
          //once value dijit is create based on fieldType show/hide select value button
          this.displaySelectValueButton(fieldType);
          //Create layers and fields to aply on table
          this._createLayersAndFields(fieldType);
        }
      },

      /**
       * This function is used to add options to data type dropdown
       */
      _addDataTypeOptions: function () {
        var options = [{
          "label": this.nls.dataType.esriFieldTypeString,
          "value": "esriFieldTypeString"
        }, {
          "label": this.nls.dataType.esriFieldTypeInteger,
          "value": "esriFieldTypeInteger"
        }, {
          "label": this.nls.dataType.esriFieldTypeDate,
          "value": "esriFieldTypeDate"
        }, {
          "label": this.nls.dataType.esriFieldTypeGUID,
          "value": "esriFieldTypeGUID"
        }];
        return options;
      },

      /**
       * This function is used to find whether any layer has domain field or not
       */
      _isDomainField: function () {
        array.forEach(this._totalLayers, lang.hitch(this, function (layer) {
          array.some(layer.layerObject.fields, lang.hitch(this, function (currentField) {
            if ((currentField.domain && currentField.domain.type === "codedValue")) {
              this.hasDomainField = true;
              return true;
            }
          }));
        }));
      },

      /**
       * This function is used to display select value based on selected fields type
       */
      displaySelectValueButton: function (fieldType) {
        //show select value button only when any layer ha domain values and
        //selected fieldType is Number/String, dont show select value for GUID and Date
        if (this.hasDomainField) {
          if ((fieldType === "esriFieldTypeString") ||
            (fieldType === "esriFieldTypeInteger")) {
            domClass.remove(this.selectPresetValueBtn, "esriCTHidden");
          } else {
            domClass.add(this.selectPresetValueBtn, "esriCTHidden");
          }
        }
      },

      /**
      * This function is used to filter layerFields based on field type
      * esriFieldTypeOID and esriFieldTypeGlobalID will be not valid fields
      */
      _createLayerFieldsFilter: function (fieldType) {
        var validFieldSet = [], layerDetails = {};
        array.forEach(this._totalLayers, lang.hitch(this, function (layer) {
          //if layer is not table
          //or if it is table then it should have some realtions then only consider it
          if (!layer.isTable || (layer.isTable && layer.layerObject.relationships.length > 0)) {
            array.forEach(layer.layerObject.fields, lang.hitch(this, function (field) {
              if (this.ValidFieldsByTypeToApplyOn[fieldType]) {
                validFieldSet = this.ValidFieldsByTypeToApplyOn[fieldType];
                if (validFieldSet.indexOf(field.type) > -1 && field.editable) {
                  if (!layerDetails[layer.id]) {
                    layerDetails[layer.id] = {};
                  }
                  layerDetails[layer.id][field.name] = field;
                }
              }
            }));
          }
        }));
        return layerDetails;
      },

      /**
      * This function is used to create layersAndFieldsApplyOn instance
      * which will create UI for later and fields to apply on
      */
      _createLayersAndFields: function (dataType) {
        this._layerAndFieldsApplyOnObj = new layersAndFieldsApplyOn({
          map: this.map,
          layerInfos: this.layerInfos,
          _configInfos: this._configInfos,
          actionName: "Preset",
          nls: this.nls,
          prevName: this.prevName,
          existingGroups: this.existingGroups,
          _configuredPresetInfos: this._configuredPresetInfos,
          layerDetails: this._createLayerFieldsFilter(dataType),
          appliedOn: this.appliedOn
        });
        domConstruct.empty(this.tableParentContainer);
        this._layerAndFieldsApplyOnObj.placeAt(this.tableParentContainer);
        this._layerAndFieldsApplyOnObj.startup();
      },

      deleteGroup: function () {
        this._layerAndFieldsApplyOnObj.deleteGroup();
      },


      /**
       * This function is used to Creat PresetPopUp
       */
      showDialog: function () {
        this.presetPopup = new Popup({
          "titleLabel": this.nls.fieldsPage.fieldsSettingsTable.canPresetValue,
          "width": 750,
          "maxHeight": 500,
          "autoHeight": false,
          "class": this.baseClass,
          "content": this,
          "buttons": [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              var selectedValue, groupInfo;
              groupInfo = {
                presetValue: []
              };
              //validate is groupname is valid
              if (!this.groupNameTextBox.isValid()) {
                this.groupNameTextBox.focus();
                return;
              }
               //validate preset value
              if (!this.presetValueDijitNode.isValid()) {
                this.presetValueDijitNode.focus();
                return;
              }
              //validate time value if its date type
              if (this.presetValueTimeNode && !this.presetValueTimeNode.isValid()) {
                this.presetValueTimeNode.focus();
                return;
              }
              groupInfo.name = this.groupNameTextBox.get("value");
              groupInfo.dataType = this.dataTypeDropdown.get("value");
              //push preset values in array, as thier could be multiple values in case of dateTime
              if (this.presetValueTimeNode) {
                //get selected date and time value using utils method and
                selectedValue = presetUtils.getDateFieldValue({ "type": "esriFieldTypeDate" },
                  [this.presetValueDijitNode, this.presetValueTimeNode]);
                groupInfo.presetValue.push(selectedValue);
                groupInfo.presetValue.push(selectedValue);
              } else {
                //in case of other data types store the value directly
                if (this.presetValueDijitNode) {
                  groupInfo.presetValue.push(this.presetValueDijitNode.get("value"));
                }
              }
              groupInfo.appliedOn = this._layerAndFieldsApplyOnObj.getCheckedFields(groupInfo);
              this.emit("groupInfoUpdated", groupInfo);
              this.presetPopup.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              this.presetPopup.close();
            })
          }]
        });
      },

      /**
       * This function is used to Create dijit controls based on data type selection
       */
      createDijitOnDataTypeChange: function (dataTypeDropdownValue) {
        var node, timeNode, nodes = [];
        domConstruct.empty(this.presetValueDiv);
        domConstruct.empty(this.presetValueTimeNodeDiv);
        this.presetValueTimeNode = null;
        this.presetValueDijitNode = null;
        switch (dataTypeDropdownValue) {
          case "esriFieldTypeDate":
            node = new DateTextBox({
              "style": {
                "width": "100%"
              }
            });
            nodes.push(node);
            timeNode = new TimeTextBox({
              "style": { "width": "100%" }
            });
            nodes.push(timeNode);
            break;
          case "esriFieldTypeSmallInteger":
          case "esriFieldTypeInteger":
          case "esriFieldTypeSingle":
          case "esriFieldTypeDouble":
            node = new NumberTextBox({
              "style": "width:100%"
            });
            nodes.push(node);
            break;
          case "esriFieldTypeGUID":
            node = new TextBox({
              "style": "width:100%"
            });
            node.validator = lang.hitch(this, presetUtils.isGuid);
            nodes.push(node);
            break;
          default:
            node = new TextBox({
              required: false,
              trim: true,
              "style": {
                "width": "100%"
              }
            });
            nodes.push(node);
            break;
        }
        return nodes;
      },

      /**
       * This function is used to handle onClick event of Select value button
       */
      _onSelectPresetValueButtonClick: function () {
        this.ChooseFromLayerObj = new ChooseFromLayer({
          map: this.map,
          nls: this.nls,
          allLayers: this._totalLayers
        });
        on(this.ChooseFromLayerObj, "updatePresetValue", lang.hitch(this, function (value) {
          this.presetValueDijitNode.set("value", value);
        }));
      }
    });
  });