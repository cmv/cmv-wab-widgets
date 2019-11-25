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
  'jimu/BaseWidget',
  'dojo/Evented',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./ProjectCost.html',
  'dojo/_base/lang',
  'dojo/on',
  'jimu/dijit/SimpleTable',
  'dojo/query',
  'dijit/form/ValidationTextBox',
  'dojo/dom-construct',
  'dijit/form/Select',
  'dojo/_base/array',
  'dojo/store/Memory'
], function (
  declare,
  BaseWidget,
  Evented,
  _WidgetsInTemplateMixin,
  template,
  lang,
  on,
  SimpleTable,
  query,
  ValidationTextBox,
  domConstruct,
  Select,
  array,
  Memory
) {
  return declare([BaseWidget, Evented, _WidgetsInTemplateMixin], {
    templateString: template,
    baseClass: 'jimu-widget-cost-analysis-project-cost-settings',
    _costFieldStore: null,

    postCreate: function () {
      this.inherited(arguments);
      this._handleClickEvents();
    },

    /**
     * This function is used to set the config
     * @memberOf setting/ProjectCost
     */
    _setConfig: function () {
      if (this.config &&
        this.config.projectCostSettings &&
        this.config.projectCostSettings.length > 0) {
        array.forEach(this.config.projectCostSettings,
          lang.hitch(this, function (projectCostEntry) {
            this._addProjectCostLayerRow(projectCostEntry);
          }));
      }
    },

    startup: function () {
      this.inherited(arguments);
      this._createProjectCostFieldTable();
      this._createProjectCostTypeFieldStore();
      this._setConfig();
    },

    /**
     * This function is used to get the config
     * @memberOf setting/ProjectCost
     */
    getConfig: function () {
      var tableRows, configuredProjectCostArr;
      tableRows = this._projectCostTable.getRows();
      configuredProjectCostArr = [];
      array.some(tableRows, lang.hitch(this, function (tableRow) {
        configuredProjectCostArr.push({
          "label": tableRow.projectCostLabelTextBox.getValue(),
          "type": tableRow.projectCostTypeDropdown.getValue(),
          "value": tableRow.projectCostValueTextBox.getValue()
        });
      }));
      return configuredProjectCostArr;
    },
    /**
     * This function is used to validateProjectCostData
     * @memberOf setting/ProjectCost
     */
    validateProjectCostData: function () {
      var tableRows, projectCostEntry;
      tableRows = this._projectCostTable.getRows();
      for (var tableRow in tableRows) {
        projectCostEntry = tableRows[tableRow];
        if (!(projectCostEntry.projectCostLabelTextBox.isValid())) {
          this._setErrorMessage(projectCostEntry.projectCostLabelTextBox,
            this.nls.projectCostSettings.invalidProjectCostMessage);
          return {
            isValid: false
          };
        }
        if (!(projectCostEntry.projectCostValueTextBox.isValid())) {
          this._setErrorMessage(projectCostEntry.projectCostValueTextBox,
            this.nls.projectCostSettings.invalidProjectCostMessage);
          return {
            isValid: false
          };
        }

      }
      return {
        isValid: true
      };
    },

    /**
     * This function is used to show error message on invalid entry
     * @memberOf setting/ProjectCost
     */
    _setErrorMessage: function (projectCostDomNode, message) {
      projectCostDomNode.set("state", "Error");
      projectCostDomNode.set("invalidMessage", message);
      projectCostDomNode.focus();
      projectCostDomNode.isValid();
    },

    /**
     * This function is used handle all click events of project cost
     * @memberOf setting/ProjectCost
     */
    _handleClickEvents: function () {
      this.own(on(this.btnAddProjectCostNode, 'click', lang.hitch(this, function () {
        this._addProjectCostBtnClicked();
      })));
      this.own(on(this.btnCrossNode, 'click', lang.hitch(this, function () {
        this._deleteLayerRow();
      })));
    },

    /**
     * This function is used to create table for adding new cost escalation field
     * @memberOf setting/ProjectCost
     */
    _createProjectCostFieldTable: function () {
      var args, fields;
      fields = [{
          name: 'editable',
          title: this.nls.common.label,
          type: 'empty',
          editable: false,
          width: '35%'
        },
        {
          name: 'field',
          title: this.nls.common.type,
          type: 'empty',
          editable: false,
          width: '20%'
        }, {
          name: 'field',
          title: this.nls.projectCostSettings.additionalCostValueColumnHeader,
          type: 'empty',
          editable: true,
          width: '35%'
        }, {
          name: 'actions',
          title: this.nls.common.actions,
          width: '10%',
          type: 'actions',
          actions: ['up', 'down', 'delete']
        }
      ];
      args = {
        fields: fields,
        selectable: false,
        autoHeight: true
      };
      this._projectCostTable = new SimpleTable(args);
      this._projectCostTable.placeAt(this.projectCostTableNode);
      this._projectCostTable.startup();
    },

    /**
     * This function is used to add a row on click of add cost field button
     * @memberOf setting/ProjectCost
     */
    _addProjectCostBtnClicked: function () {
      this._addProjectCostLayerRow();
    },

    /**
     * This function is used to add a row on selection of editable layer in layer settings tab
     * @memberOf setting/ProjectCost
     */
    _addProjectCostLayerRow: function (data) {
      var editableLayerRow, fieldsColumn;
      editableLayerRow = this._projectCostTable.addRow({});
      fieldsColumn = query('.simple-table-cell', editableLayerRow.tr);
      if (fieldsColumn) {
        editableLayerRow = editableLayerRow.tr;
        this._addProjectCostLabelTextBox(fieldsColumn[0], editableLayerRow, data);
        this._addProjectCostTypeDropdown(fieldsColumn[1], editableLayerRow, data);
        this._addProjectCostValueTextBox(fieldsColumn[2], editableLayerRow, data);
      }
    },

    /**
     * This function is used to add textbox in table
     * @memberOf setting/ProjectCost
     */
    _addProjectCostLabelTextBox: function (fieldsColumn, editableLayerRow, data) {
      var textBoxContainer;
      textBoxContainer = domConstruct.create("div", {
        "class": "esriCTTextBoxContainer"
      }, fieldsColumn);
      editableLayerRow.projectCostLabelTextBox = new ValidationTextBox({
        "class": "esriCTProjectCostLabelTextbox esriCTAddProjectCostTableNode",
        "invalidMessage": "Invalid Entry for project cost"
      }, textBoxContainer);
      editableLayerRow.projectCostLabelTextBox.startup();
      if (data && data.label) {
        editableLayerRow.projectCostLabelTextBox.set("value", data.label);
      }
      editableLayerRow.projectCostLabelTextBox.validator =
        lang.hitch(this, this._validateProjectCostLabelFields);
    },

    /**
     * This function is used validate label
     * @memberOf setting/ProjectCost
     */
    _validateProjectCostLabelFields: function (value) {
      if (lang.trim(value) === "") {
        return false;
      }
      return true;
    },

    /**
     * This function is used to add  dropdown of type in table
     * @memberOf setting/ProjectCost
     */
    _addProjectCostTypeDropdown: function (fieldsColumn, editableLayerRow, data) {
      var dropDownContainer;
      dropDownContainer = domConstruct.create("div", {
        "class": "esriCTProjectCostTypeDropDownContainer esriCTAddProjectCostTableNode"
      }, fieldsColumn);
      editableLayerRow.projectCostTypeDropdown = new Select({
        name: "layerSelect",
        store: this._projectCostFieldStore,
        labelAttr: "name",
        "class": "esriCTProjectCostTypeDropdown"
      }, dropDownContainer);
      if (data && data.type) {
        editableLayerRow.projectCostTypeDropdown.set("value", data.type);
      }

      editableLayerRow.projectCostTypeDropdown.startup();
    },

    /**
     * This function is used to add textbox in table for value
     * @memberOf setting/ProjectCost
     */
    _addProjectCostValueTextBox: function (fieldsColumn, editableLayerRow, data) {
      var textBoxContainer;
      textBoxContainer = domConstruct.create("div", {
        "class": "esriCTProjectCostTextBoxContainer esriCTAddProjectCostTableNode"
      }, fieldsColumn);
      editableLayerRow.projectCostValueTextBox = new ValidationTextBox({
        "class": "esriCTProjectCostLabelTextbox",
        "trim": true,
        "invalidMessage": "Invalid Entry for project cost"
      }, textBoxContainer);
      editableLayerRow.projectCostValueTextBox.startup();
      if (data && data.value) {
        editableLayerRow.projectCostValueTextBox.set("value", data.value);
      }

      editableLayerRow.projectCostValueTextBox.validator =
        lang.hitch(this, this._validateProjectCostValueFields);
    },

    /**
     * This function is used validate value
     * @memberOf setting/ProjectCost
     */
    _validateProjectCostValueFields: function (value) {
      value = Number(value);
      if (value === "" || isNaN(value) || value === "0" || value === 0) {
        return false;
      }
      return true;
    },

    /**
     * This function is used to delete layer row
     * @memberOf setting/ProjectCost
     */
    _deleteLayerRow: function () {
      var tableRows = this._projectCostTable.getRows();
      var tableRowsData = this._projectCostTable.getData();
      array.forEach(tableRowsData, lang.hitch(this, function (tableRowData, index) {
        if (tableRowData.editable) {
          this._projectCostTable.deleteRow(tableRows[index]);
        }
      }));
    },

    /**
     * This function is used to store cost type
     * @memberOf setting/ProjectCost
     */
    _createProjectCostTypeFieldStore: function () {
      var costTypeFieldArr;
      costTypeFieldArr = [];
      costTypeFieldArr.push({
        name: '+',
        value: '+'
      });
      costTypeFieldArr.push({
        name: '*',
        value: '*'
      });
      costTypeFieldArr.push({
        name: '-',
        value: '_'
      });
      costTypeFieldArr.push({
        name: '%',
        value: '%'
      });
      this._projectCostFieldStore = new Memory({
        idProperty: "value",
        data: costTypeFieldArr
      });
    }
  });
});