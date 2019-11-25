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
    'dojo/dom-class',
    "dojo/text!./Address.html",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    "jimu/dijit/Popup",
    'jimu/dijit/Message',
    'dijit/form/ValidationTextBox',
    "dijit/form/Select",
    "./layersAndFieldsApplyOn",
    'dojo/on'
  ],
  function (
    declare,
    Evented,
    lang,
    array,
    domConstruct,
    domClass,
    template,
    _TemplatedMixin,
    BaseWidgetSetting,
    Popup,
    Message,
    TextBox,
    Select,
    layersAndFieldsApplyOn,
    on
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-address",
      templateString: template,
      _validGeocoderFields: [],
      ValidFieldsByTypeToApplyOn: {
        "esriFieldTypeOID": ["esriFieldTypeSmallInteger", "esriFieldTypeInteger",
          "esriFieldTypeSingle", "esriFieldTypeDouble", "esriFieldTypeString"
        ],
        "esriFieldTypeSmallInteger": ["esriFieldTypeSmallInteger", "esriFieldTypeString",
          "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeInteger": ["esriFieldTypeSmallInteger", "esriFieldTypeString",
          "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeDouble": ["esriFieldTypeSmallInteger", "esriFieldTypeString",
          "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeSingle": ["esriFieldTypeSmallInteger", "esriFieldTypeString",
          "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeGUID": ["esriFieldTypeGUID", "esriFieldTypeString"],
        "esriFieldTypeDate": ["esriFieldTypeDate"],
        "esriFieldTypeString": ["esriFieldTypeString"]
      },
      postCreate: function () {
        this.inherited(arguments);
        this._validGeocoderFields = this._getValidGeocoderFields();
        this._initControls();
        //Dont show dialog when deleteing group
        if (!this.isDelete) {
          this.showDialog();
        }
        this._createLayersAndFields();
      },

      _initControls: function () {
        var options, selectedField, prevFieldFound;
        //Create Textbox to enter GroupName
        this.groupNameTextBox = new TextBox({
          style: { width: "99%" },
          required: true,
          trim: true
        }, domConstruct.create("div", {}, this.groupNameTextBoxNode));
        //validate groupname for not empty and unique
        this.groupNameTextBox.validator = lang.hitch(this, function (value) {
          if (!value) {
            this.groupNameTextBox.set("invalidMessage",
              this.nls.smartActionsPage.requiredGroupNameMsg);
            return false;
          }
          if (value !== this.prevName &&
            this.editUtils.isDuplicateGroupName(value, this.existingGroupNames)) {
            this.groupNameTextBox.set("invalidMessage",
              this.nls.smartActionsPage.uniqueGroupNameMsg);
            return false;
          }
          return true;
        });
        if (this.name) {
          this.groupNameTextBox.set('value', this.name);
        }
        //Create field selector
        options = this._getFieldsOptionsObj(this._validGeocoderFields);
        this.fieldSelector = new Select({
          style: { width: "99%" },
          options: options
        }, domConstruct.create("div", {}, this.selectNode));
        //get prev selected field and show it as selected
        if (this._fieldValues && this._fieldValues.Address) {
          if (this._fieldValues.Address.hasOwnProperty("field")) {
            selectedField = this._fieldValues.Address.field;
          }
        }
        if (selectedField) {
          prevFieldFound = false;
          array.some(options, lang.hitch(this, function (option) {
            //Filter fields based on type
            if (option.value === selectedField) {
              prevFieldFound = true;
              return true;
            }
          }));
          //show error message when previously configured field not found in geocoder settings
          if (prevFieldFound) {
            this.fieldSelector.set("value", selectedField, false);
          } else {
            new Message({
              message: this.nls.addressPage.prevConfigruedFieldChangedMsg
            });
          }
        }
        //on change of field updated layers and felds to apply on
        this.own(on(this.fieldSelector, "change", lang.hitch(this, function () {
          this._createLayersAndFields();
        })));
      },

      showDialog: function () {
        var isEnabled = false, autoHeight = false, maxHeight = 500, width = 675;
        if (!this.isGroup) {
          domClass.add(this.groupInfoNode1, "esriCTHidden");
          domClass.add(this.groupInfoNode2, "esriCTHidden");
          domClass.remove(this.addressDijitMainWrapper, "esriCTAddressWidth");
          domClass.add(this.addressDijitMainWrapper, "esriCTFullWidth");
          width = 600;
          maxHeight = 300;
          autoHeight = true;
        }
        //get if the action is enabled or not
        isEnabled = false; //by default keep enabled as false
        if (this._fieldValues && this._fieldValues.Address) {
          if (this._fieldValues.Address.hasOwnProperty("enabled")) {
            isEnabled = this._fieldValues.Address.enabled;
          }
        }
        var fieldsPopup = new Popup({
          titleLabel: this.nls.addressPage.popupTitle,
          width: width,
          maxHeight: maxHeight,
          autoHeight: autoHeight,
          content: this,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              var data = {}, groupInfo = {};
              data.enabled = isEnabled;
              data.field = this.fieldSelector.get("value");
              if (this.isGroup) {
                //validate is groupname is valid
                if (!this.groupNameTextBox.isValid()) {
                  this.groupNameTextBox.focus();
                  return;
                }
              } else {
                delete this._fieldValues.Address.attributeActionGroupName;
              }
              if (!this._fieldValues.Address) {
                this._fieldValues.Address = {
                  "actionName": "Address"
                };
              }
              lang.mixin(this._fieldValues.Address, data);
              if (this.isGroup) {
                groupInfo.name = this.groupNameTextBox.get("value");
                groupInfo.dataType = data.field;
                groupInfo.attributeInfo = data;
                groupInfo.appliedOn = this._layerAndFieldsApplyOnObj.getCheckedFields(groupInfo);
                this.emit("groupInfoUpdated", groupInfo);
              } else {
                this.emit("attributeActionUpdated");
              }
              fieldsPopup.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              fieldsPopup.close();
            })
          }],
          onClose: lang.hitch(this, function () {
          })
        });
      },

      /**
      * This function is used to
      * filter the valid fields from all fields
      * @param {array} fieldArray: array of fields
      * @memberOf setting/LayerSettings
      */
      _getFieldsOptionsObj: function (fieldArray) {
        var fieldOptions = [];
        array.forEach(fieldArray, lang.hitch(this, function (field) {
          //Filter fields based on type
          if (field.type !== "esriFieldTypeGeometry" &&
            field.type !== "esriFieldTypeBlob" &&
            field.type !== "esriFieldTypeRaster" &&
            field.type !== "esriFieldTypeXML") {
            fieldOptions.push(
              {
                "label": field.alias || field.name,
                "value": field.name,
                "fieldType": field.type
              });
          }
        }));
        return fieldOptions;
      },

      /**
      * This function is used to filter layerFields based on selected gp service field type
      */
      _createLayerFieldsFilter: function () {
        var validFieldSet, layerDetails = {};
        //get selected addres field type
        var selectedFieldType = this.fieldSelector.getOptions(this.fieldSelector.value).fieldType;
        //check if valid field set for this type is available
        if (selectedFieldType && this.ValidFieldsByTypeToApplyOn[selectedFieldType]) {
          validFieldSet = this.ValidFieldsByTypeToApplyOn[selectedFieldType];
          //consider only those fields which are valid for selected field type
          array.forEach(this._totalLayers, lang.hitch(this, function (layer) {
            if (!layer.isTable) {
              array.forEach(layer.layerObject.fields, lang.hitch(this, function (field) {
                if (validFieldSet.indexOf(field.type) > -1 && field.editable) {
                  if (!layerDetails[layer.id]) {
                    layerDetails[layer.id] = {};
                  }
                  layerDetails[layer.id][field.name] = field;
                }
              }));
            }
          }));
        }
        return layerDetails;
      },

      /**
      * This function is used to create layersAndFieldsApplyOn instance
      * which will create UI for later and fields to apply on
      */
      _createLayersAndFields: function () {
        this._layerAndFieldsApplyOnObj = new layersAndFieldsApplyOn({
          map: this.map,
          layerInfos: this.layerInfos,
          _configInfos: this._configInfos,
          actionName: "Address",
          nls: this.nls,
          prevName: this.prevName,
          existingGroups: this.existingGroups,
          layerDetails: this._createLayerFieldsFilter(),
          appliedOn: this.appliedOn
        });
        domConstruct.empty(this.tableParentContainer);
        this._layerAndFieldsApplyOnObj.placeAt(this.tableParentContainer);
        this._layerAndFieldsApplyOnObj.startup();
      },

      deleteGroup: function () {
        this._layerAndFieldsApplyOnObj.deleteGroup();
      },

      _getValidGeocoderFields: function () {
        var currentFieldGeocoderFields = [];
        if (this._geocoderSettings && this._geocoderSettings.hasOwnProperty('url')) {
          array.forEach(this._geocoderSettings.fields, lang.hitch(this, function (field) {
            currentFieldGeocoderFields.push(field);
          }));
        }
        return currentFieldGeocoderFields;
      }
    });
  });