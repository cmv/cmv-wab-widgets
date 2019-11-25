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
    "dojo/text!./Coordinates.html",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    "jimu/dijit/Popup",
    "dijit/form/Select",
    'dijit/form/ValidationTextBox',
    "./layersAndFieldsApplyOn",
    'dojo/dom-class'
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
    layersAndFieldsApplyOn,
    domClass
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-coordinates",
      templateString: template,
      groupNameTextBox: null,
      postCreate: function () {
        this.inherited(arguments);
        this.groupNameTextBox = null;
        this.fieldSelector = null;
        this._initControls();
        this._createLayersAndFields();
        //Dont show dialog when deleteing group
        if (!this.isDelete) {
          this.showDialog();
        }
      },

      showDialog: function () {
        var width, isEnabled, coordinatesSystem, field, coordinateSystemSelector,
          fieldsPopup, maxHeight, autoHeight;
        isEnabled = false;
        width = 675;
        maxHeight = 500;
        autoHeight = false;
        //Check for saved values and fetch them
        if (this._fieldValues && this._fieldValues.Coordinates) {
          if (this._fieldValues.Coordinates.hasOwnProperty("enabled")) {
            isEnabled = this._fieldValues.Coordinates.enabled;
            coordinatesSystem = this._fieldValues.Coordinates.coordinatesSystem;
            field = this._fieldValues.Coordinates.field;
          }
        }
        //Create coordinates systems drop down
        coordinateSystemSelector = new Select({
          style: { width: "99%" },
          options: this._createCoordinatesOptions()
        }, domConstruct.create("div", {}, this.selectCoordinateNode));
        //Listen for change event
        this.own(on(coordinateSystemSelector, "change", lang.hitch(this, function (value) {
          this.fieldSelector.set('options', this._getFieldsOptionsObj(value));
          //Select the first option based on selected coordinates system
          if (this.fieldSelector.options.length > 0) {
            this.fieldSelector.set('value', this.fieldSelector.options[0].value);
          }
        })));
        //Check for saved value
        if (coordinatesSystem) {
          coordinateSystemSelector.set('value', coordinatesSystem, false);
        }
        //create options according to coordinates system
        this.fieldSelector = new Select({
          style: { width: "99%" },
          options: this._getFieldsOptionsObj(coordinateSystemSelector.getValue())
        }, domConstruct.create("div", {}, this.selectAttributeNode));
        //Check for saved value
        if (field) {
          this.fieldSelector.set('value', field);
        }
        this.own(on(this.fieldSelector, "change", lang.hitch(this, function () {
          this._createLayersAndFields();
        })));
        if (!this.isGroup) {
          domClass.add(this.groupInfoNode1, "esriCTHidden");
          domClass.add(this.groupInfoNode2, "esriCTHidden");
          domClass.remove(this.coordianteDijitMainWrapper, "esriCTCoordinateWidth");
          domClass.add(this.coordianteDijitMainWrapper, "esriCTFullWidth");
          autoHeight = true;
          width = 420;
        }
        fieldsPopup = new Popup({
          titleLabel: this.nls.coordinatesPage.popupTitle,
          width: width,
          maxHeight: maxHeight,
          autoHeight: autoHeight,
          content: this,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              var data = {}, groupInfo = {};
              data.enabled = isEnabled;
              data.coordinatesSystem = coordinateSystemSelector.get("value");
              data.field = this.fieldSelector.get("value");
              if (this.isGroup) {
                //validate is groupname is valid
                if (!this.groupNameTextBox.isValid()) {
                  this.groupNameTextBox.focus();
                  return;
                }
              } else {
                delete this._fieldValues.Coordinates.attributeActionGroupName;
              }
              if (!this._fieldValues.Coordinates) {
                this._fieldValues.Coordinates = {
                  "actionName": "Coordinates"
                };
              }
              lang.mixin(this._fieldValues.Coordinates, data);
              if (this.isGroup) {
                groupInfo.name = this.groupNameTextBox.get("value");
                groupInfo.dataType = this.fieldSelector._getSelectedOptionsAttr().label;
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

      _initControls: function () {
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
      },

      /**
      * This function is used to
      * fetch all coordinates system values
      * @memberOf setting/Coordinates
      */
      _createCoordinatesOptions: function () {
        var options = [];
        //In case of group filter options allready used
        if (this.isGroup) {
          if (this.coordinatesSavedDataTypes.MapSpatialReference.length > 0) {
            options.push(
              {
                "label": this.nls.coordinatesPage.mapSpatialReference,
                "value": "MapSpatialReference"
              });
          }
          if (this.coordinatesSavedDataTypes.LatLong.length > 0) {
            options.push(
              {
                "label": this.nls.coordinatesPage.latlong,
                "value": "LatLong"
              });
          }
        }
        else {
          options.push(
            {
              "label": this.nls.coordinatesPage.mapSpatialReference,
              "value": "MapSpatialReference"
            }, {
              "label": this.nls.coordinatesPage.latlong,
              "value": "LatLong"
            });
        }
        return options;
      },

      /**
      * This function is used to
      * filter the valid fields from all fields
      * @param {array} fieldArray: array of fields
      * @memberOf setting/Coordinates
      */
      _getFieldsOptionsObj: function (coordinatesSystem) {
        var fieldOptions = [], fieldArray = [];
        if (coordinatesSystem === "LatLong") {
          fieldArray = [{ "name": "y", "alias": "Latitude" }, { "name": "x", "alias": "Longitude" },
          { "name": "xy", "alias": "Latitude Longitude" }];
        } else {
          fieldArray = [{ "name": "x", "alias": "X" }, { "name": "y", "alias": "Y" },
          { "name": "xy", "alias": "X Y" }];
        }
        array.forEach(fieldArray, lang.hitch(this, function (field) {
          //In case of group add filed option only when it is not used
          if (this.isGroup) {
            if (this.coordinatesSavedDataTypes.MapSpatialReference.indexOf(field.alias) !== -1 ||
              this.coordinatesSavedDataTypes.LatLong.indexOf(field.alias) !== -1) {
              fieldOptions.push(
                {
                  "label": field.alias || field.name,
                  "value": field.name
                });
            }
          } else {
            //In case of showing coordinates at layer field,
            //add xy only in case of string type of field
            if (field.name !== "xy" ||
              (field.name === "xy" && this._fieldType === "esriFieldTypeString")) {
            fieldOptions.push(
              {
                "label": field.alias || field.name,
                "value": field.name
              });
            }
          }
        }));
        return fieldOptions;
      },

      /**
      * This function is used to filter layerFields based on field type
      * String and Numbers will be valid fields
      */
      _createLayerFieldsFilter: function () {
        var layerDetails = {};
        if (this.fieldSelector && this.fieldSelector.value === "xy") {
          array.forEach(this._totalLayers, lang.hitch(this, function (layer) {
            if (!layer.isTable) {
              layerDetails[layer.id] = {};
              array.forEach(layer.layerObject.fields, lang.hitch(this, function (field) {
                if ((field.type === "esriFieldTypeString")) {
                  if (!layerDetails[layer.id]) {
                    layerDetails[layer.id] = {};
                  }
                  layerDetails[layer.id][field.name] = field;
                }

              }));
            }
          }));
        }
        else {
          array.forEach(this._totalLayers, lang.hitch(this, function (layer) {
            if (!layer.isTable) {
              array.forEach(layer.layerObject.fields, lang.hitch(this, function (field) {
                if ((field.type === "esriFieldTypeString") ||
                  (field.type === "esriFieldTypeSmallInteger") ||
                  (field.type === "esriFieldTypeInteger") ||
                  (field.type === "esriFieldTypeSingle") ||
                  (field.type === "esriFieldTypeDouble") && field.editable) {
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
          actionName: "Coordinates",
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
      }
    });
  });