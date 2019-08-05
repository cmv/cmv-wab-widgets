///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'jimu/dijit/SimpleTable',
  'jimu/BaseWidget',
  'dojo/Evented',
  'dojo/_base/lang',
  'dojo/dom-class',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./AttributeSettings.html',
  'dojo/on',
  'dojo/query',
  'dijit/form/Select',
  'dojo/_base/array'
], function (
  declare,
  SimpleTable,
  BaseWidget,
  Evented,
  lang,
  domClass,
  _WidgetsInTemplateMixin,
  template,
  on,
  query,
  Select,
  array
) {
  return declare([BaseWidget, Evented, _WidgetsInTemplateMixin], {
    templateString: template,
    attributeSettingPopup: null,
    baseClass: 'jimu-widget-cost-analysis-attribute-settings',
    _layerSettingsTable: null,
    _projectLayer: "",
    _entireFieldsArr: [],
    _selectedFieldsArr: [],
    _entireFieldObj: [],
    _projectFieldTypes: [],
    validFieldTypes : [
      'esriFieldTypeInteger',
      'esriFieldTypeSingle',
      'esriFieldTypeSmallInteger',
      'esriFieldTypeDouble',
      'esriFieldTypeString',
      'esriFieldTypeDate',
      'esriFieldTypeGUID'
    ],

    constructor: function (options) {
      lang.mixin(this, options);
    },

    postMixInProperties: function () {
      this.nls.common = {};
      lang.mixin(this.nls.common, window.jimuNls.common);
    },

    postCreate: function () {
      //Reset all the required variables
      this._entireFieldsArr = [];
      this._selectedFieldsArr = [];
      this._entireFieldObj = [];
      this._projectFieldTypes = [];
      this.attributeSettingPopup = null;
      this._layerSettingsTable = null;
      this._projectLayer = this.config.projectSettings.projectLayer || this.projectLayer || "";
      this._projectLayerAttributeStore = "";
      this.inherited(arguments);
      this._init();
    },

    /**
     * Initializing the widget
     * @memberOf setting/AttributeSettings
     */
    _init: function () {
      this._clearData();
      this._fetchProjectLayerFieldTypes();
      this._addValidFields();
      this._createAttributeSettingsFieldsTable();
      this._attachEventsToElement();
      this._displayPreviousConfiguredFields();
    },

    /**
     * This function is used to clear the array of entire field & selected field
     * @memberOf setting/AttributeSettings
     */
    _clearData: function () {
      this._entireFieldsArr = [];
      this._selectedFieldsArr = [];
      this._projectFieldTypes = [];
    },

    /**
     * This function is used list down all the valid field types from project layer
     * @memberOf setting/AttributeSettings
     */
    _fetchProjectLayerFieldTypes: function () {
      var projectLayerFields;
      projectLayerFields = this.map.getLayer(this._projectLayer).fields;
      array.forEach(projectLayerFields, lang.hitch(this, function (currentField) {
        if (this.validFieldTypes.indexOf(currentField.type) > -1 &&
          this._projectFieldTypes.indexOf(currentField.type) === -1) {
          this._projectFieldTypes.push(currentField.type);
        }
      }));
    },

    /**
     * This function is used to display the previously configured field
     * @memberOf setting/AttributeSettings
     */
    _displayPreviousConfiguredFields: function () {
      if (this.selectedFields && this.selectedFields.length > 0) {
        array.forEach(this.selectedFields, lang.hitch(this, function (rowData) {
          this._configuredField = rowData;
          this.attributeSettingsAddFields.click();
        }));
        this._configuredField = null;
      }
    },

    /**
     * This function is used to filter the valid fields from all fields
     * @memberOf setting/AttributeSettings
     */
    _addValidFields: function () {
      array.forEach(this.featureLayer.fields, lang.hitch(this, function (field) {
        this._entireFieldObj[field.name] = field;
        if (this.validFieldTypes.indexOf(field.type) > -1 &&
          this._projectFieldTypes.indexOf(field.type) > -1 &&
          field.editable) {
          this._entireFieldsArr.push(field.name);
          this._entireFieldObj[field.name] = lang.clone(field);
          if (this.selectedFields &&
            this.selectedFields[field.name]) {
            this._entireFieldObj[field.name].label =
              this.selectedFields[field.name].label;
          }
        }
      }));
      if (this._entireFieldsArr.length === 0) {
        this._disableAddFieldButton();
      }
    },

    /**
     * This function is used to disable the add new field button
     * @memberOf setting/AttributeSettings
     */
    _disableAddFieldButton: function () {
      if (this._selectedFieldsArr.length === this._entireFieldsArr.length) {
        domClass.add(this.attributeSettingsAddFields, "esriCTDisabled");
      }
    },

    /**
     * This function is used to add a new row
     * @memberOf setting/AttributeSettings
     */
    _addFieldsRow: function (distinctFieldArr) {
      var fieldRow, fieldDropDownCell, projectDropDownCell, labelCell, rowCell;
      fieldRow = this._attributeSettingsTable.addRow({});
      if (fieldRow.success && fieldRow.tr) {
        fieldRow = fieldRow.tr;
        rowCell = query('.simple-table-cell', fieldRow);
        fieldDropDownCell = rowCell[0];
        projectDropDownCell = rowCell[1];
        labelCell = rowCell[1];
        this._addFieldDropdown(distinctFieldArr, fieldDropDownCell, fieldRow);
        this._addProjectFieldDropdown(projectDropDownCell, fieldRow);
      }
    },

    /**
     * This function is used to delete a row
     * @memberOf setting/AttributeSettings
     */
    _deleteFieldRow: function (deletedRow) {
      var deletedOption, index;
      domClass.remove(this.attributeSettingsAddFields, "esriCTDisabled");
      deletedOption = deletedRow.fieldDropdownInstance.value;
      index = this._selectedFieldsArr.indexOf(deletedOption);
      if (index > -1) {
        this._selectedFieldsArr.splice(index, 1);
      }
      this._addSelectedFieldInOtherDropdown(deletedRow.fieldDropdownInstance.value, null);
    },

    /**
     * This function is used to add a field chooser dropdown in a new row
     * @memberOf setting/AttributeSettings
     */
    _addFieldDropdown: function (distinctFieldArr, fieldDropdownCell, fieldRow) {
      var fieldDropdown, distinctFieldOptions;
      distinctFieldOptions = this._getDistinctFieldsOptionsObj(distinctFieldArr);
      fieldDropdown = new Select({
        "class": "esriCTFieldChooserDropdown",
        options: distinctFieldOptions
      });
      fieldDropdown.placeAt(fieldDropdownCell);
      fieldDropdown.startup();
      if (this._configuredField) {
        fieldDropdown.set("value", this._configuredField.layerField, false);
      }
      fieldRow.fieldDropdownInstance = fieldDropdown;
      this.own(on(fieldDropdown, "change", lang.hitch(this, function (evt) {
        var lastSelectedFieldOption;
        lastSelectedFieldOption = this._selectedFieldsArr[fieldRow.rowIndex];
        this._selectedFieldsArr[fieldRow.rowIndex] = evt;
        this._addSelectedFieldInOtherDropdown(lastSelectedFieldOption, evt);
        this._removeSelectedFieldFromOtherDropdown(evt);
        fieldRow.projectFieldDropdownInstance.set('options',
          this._getProjectLayerFields(fieldRow));
        fieldRow.projectFieldDropdownInstance.set('value',
          fieldRow.projectFieldDropdownInstance.options[0]);
      })));
      this._selectedFieldsArr.push(fieldDropdown.value);
      this._removeSelectedFieldFromOtherDropdown(fieldDropdown.value);
      this._disableAddFieldButton();
    },

    /**
     * This function is used to add a field chooser dropdown in a new row
     * @memberOf setting/AttributeSettings
     */
    _addProjectFieldDropdown: function (projectDropdownCell, fieldRow) {
      var fieldDropdown, options;
      options = this._getProjectLayerFields(fieldRow);
      fieldDropdown = new Select({
        "class": "esriCTFieldChooserDropdown",
        options: options
      });
      fieldDropdown.placeAt(projectDropdownCell);
      fieldDropdown.startup();
      if (this._configuredField) {
        fieldDropdown.set("value", this._configuredField.projectField, false);
      }
      fieldRow.projectFieldDropdownInstance = fieldDropdown;
      this.own(on(fieldDropdown, "change", lang.hitch(this, function () {})));
    },

    /**
     * This function is used to fetch all the valid project layer fields
     * @memberOf setting/AttributeSettings
     */
    _getProjectLayerFields: function (fieldRow) {
      var attributeFieldArr = [],
        projectLayerAttributeFields, layerField, fieldDataType;
      layerField = fieldRow.fieldDropdownInstance.getValue();
      fieldDataType = this._getFieldType(layerField);
      if (this._projectLayer && this._projectLayer !== "") {
        projectLayerAttributeFields = this.map.getLayer(this._projectLayer).fields;
        attributeFieldArr = [];
        array.forEach(projectLayerAttributeFields, lang.hitch(this, function (attributeField) {
          if (fieldDataType === attributeField.type) {
            attributeFieldArr.push({
              "label": attributeField.alias || attributeField.name,
              "value": attributeField.name
            });
          } else if (fieldDataType === "esriFieldTypeString" &&
            attributeField.type === "esriFieldTypeGlobalID") {
            //Incase of string field, add the GLOBAL ID field to dropdown
            //This will allow user's to add project id into any string field
            attributeFieldArr.push({
              "label": attributeField.alias || attributeField.name,
              "value": attributeField.name
            });
          } else if (fieldDataType === "esriFieldTypeGUID" &&
            (attributeField.type === "esriFieldTypeGlobalID" ||
              attributeField.type === "esriFieldTypeGUID")) {
            //Incase of layer's guid field, project layer dropdown will show
            //guid and global id field
            attributeFieldArr.push({
              "label": attributeField.alias || attributeField.name,
              "value": attributeField.name
            });
          }
        }));
      }
      return attributeFieldArr;
    },

    /**
     * This function is used to fetch the fields geometry type
     * @memberOf setting/AttributeSettings
     */
    _getFieldType: function (layerField) {
      return this.featureLayer.getField(layerField).type;
    },

    /**
     * This function is used to create the options for adding in field dropdown
     * @memberOf setting/AttributeSettings
     */
    _getDistinctFieldsOptionsObj: function (distinctFieldArr) {
      var distinctFieldOptions = [];
      array.forEach(distinctFieldArr, lang.hitch(this, function (field) {
        distinctFieldOptions.push({
          "label": this._entireFieldObj[field].alias || this._entireFieldObj[field].name,
          "value": field
        });
      }));
      return distinctFieldOptions;
    },

    /**
     * This function is used to remove the newly selected option from other dropdown
     * @memberOf setting/AttributeSettings
     */
    _removeSelectedFieldFromOtherDropdown: function (selectedFieldOption) {
      var tableRows;
      tableRows = this._attributeSettingsTable.getRows();
      array.forEach(tableRows, lang.hitch(this, function (tableRow) {
        if (selectedFieldOption !== tableRow.fieldDropdownInstance.value) {
          tableRow.fieldDropdownInstance.removeOption(selectedFieldOption);
        }
      }));
    },

    /**
     * This function is used to add the previously selected option in other dropdown
     * @memberOf setting/AttributeSettings
     */
    _addSelectedFieldInOtherDropdown: function (lastSelectedFieldOption, selectedFieldOption) {
      var tableRows;
      tableRows = this._attributeSettingsTable.getRows();
      array.forEach(tableRows, lang.hitch(this, function (tableRow) {
        if (selectedFieldOption !== tableRow.fieldDropdownInstance.value) {
          tableRow.fieldDropdownInstance.addOption({
            "label": this._entireFieldObj[lastSelectedFieldOption].alias ||
              this._entireFieldObj[lastSelectedFieldOption].name,
            "value": lastSelectedFieldOption
          });
        }
      }));
    },

    /**
     * This function is used to create a configured field object that is passed to widget
     * @memberOf setting/AttributeSettings
     */
    okButtonClicked: function () {
      var tableRows, configuredFieldObj;
      configuredFieldObj = [];
      tableRows = this._attributeSettingsTable.getRows();
      if (tableRows.length === 0) {
        this.selectedFields = null;
      } else {
        array.forEach(tableRows, lang.hitch(this, function (tableRow) {
          var rowObject = {
            layerField: tableRow.fieldDropdownInstance.value,
            projectField: tableRow.projectFieldDropdownInstance.value
          };
          configuredFieldObj.push(rowObject);
        }));
        this.selectedFields = configuredFieldObj;
      }
      return this.selectedFields;
    },

    /**
     * This function is used to get the difference between 2 arrays
     * @memberOf setting/AttributeSettings
     */
    _getDistinctFields: function (entireFieldArr, selectedFieldsArr) {
      var distinctFieldArr;
      distinctFieldArr = entireFieldArr.filter(function (x) {
        return selectedFieldsArr.indexOf(x) < 0;
      });
      return distinctFieldArr;
    },

    /**
     * This function is used to attach different types of event to html elements
     * @memberOf setting/AttributeSettings
     */
    _attachEventsToElement: function () {
      this.own(on(this.attributeSettingsAddFields, 'click', lang.hitch(this, function () {
        var distinctFieldArr;
        if (!(domClass.contains(this.attributeSettingsAddFields, "esriCTDisabled"))) {
          distinctFieldArr =
            this._getDistinctFields(this._entireFieldsArr, this._selectedFieldsArr);
          this._addFieldsRow(distinctFieldArr);
        }
      })));
      this.own(on(this._attributeSettingsTable, 'row-delete', lang.hitch(this, function (deletedRow) {
        this._deleteFieldRow(deletedRow);
      })));
    },

    /**
     * Emit the event
     * @memberOf setting/AttributeSettings
     */
    onOkButtonClicked: function () {
      this.parentNode.attributeSettingPopup = this.attributeSettingPopup;
      this.attributeSettingPopup.hide();
    },

    /**
     * Emit the event
     * @memberOf setting/AttributeSettings
     */
    onCancelButtonClicked: function () {
      this.attributeSettingPopup.hide();
    },

    /**
     * This function is used to create attribute settings table
     * @memberOf setting/AttributeSettings
     */
    _createAttributeSettingsFieldsTable: function () {
      var args, fields = [{
        name: 'layerAttributes',
        title: this.nls.layerSettings.layerAttributesHeaderTitle,
        type: 'empty',
        editable: false,
        width: '40%'
      }, {
        name: 'projectLayerAttributes',
        title: this.nls.layerSettings.projectLayerAttributesHeaderTitle,
        type: 'empty',
        editable: false,
        width: '40%'
      }, {
        name: 'Delete',
        title: this.nls.layerSettings.delete,
        type: 'actions',
        actions: ['delete'],
        width: '20%'
      }];
      args = {
        fields: fields,
        selectable: true
      };
      this._attributeSettingsTable = new SimpleTable(args);
      this._attributeSettingsTable.placeAt(this.attributeSettingsTableNode);
      this._attributeSettingsTable.startup();
    }
  });
});