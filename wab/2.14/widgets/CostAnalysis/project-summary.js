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
  'dojo/text!./project-summary.html',
  'dojo/_base/lang',
  'dojo/dom-attr',
  'dojo/on',
  'jimu/dijit/SimpleTable',
  'jimu/dijit/LoadingIndicator',
  'dojo/query',
  'dojo/dom-class',
  'dijit/form/ValidationTextBox',
  'dojo/dom-construct',
  'jimu/dijit/formSelect',
  'dijit/registry',
  'dojo/_base/array',
  'dojo/store/Memory',
  'dojo/_base/html',
  'dijit/focus',
  'esri/graphic',
  'dojo/keys',
  "dojo/_base/event",
  'jimu/utils',
  'dijit/focus'
], function (
  declare,
  BaseWidget,
  Evented,
  _WidgetsInTemplateMixin,
  template,
  lang,
  domAttr,
  on,
  SimpleTable,
  LoadingIndicator,
  query,
  domClass,
  ValidationTextBox,
  domConstruct,
  Select,
  registry,
  array,
  Memory,
  html,
  focusUtil,
  Graphic,
  keys,
  Event,
  jimuUtils,
  focusUtils
) {
  return declare([BaseWidget, Evented, _WidgetsInTemplateMixin], {
    templateString: template,
    baseClass: 'jimu-widget-cost-analysis-project-summary',
    _costFieldStore: null,
    totalCost: 0,
    projectInfo: null,
    previouslyAddedEscalations: [],
    loadingProject: false,

    postCreate: function () {
      this.inherited(arguments);
      this.totalCost = 0;
      this.previouslyAddedEscalations = [];
      this._handleClickEvents();
      this._initLoadingIndicator();
    },

    /**
     * This function used for initializing the loading indicator
     * @memberOf widgets/CostAnalysis/project-summary
     * */
    _initLoadingIndicator: function () {
      this._loadingIndicator = new LoadingIndicator({
        hidden: true
      });
      this._loadingIndicator.placeAt(this.domNode.parentNode.parentNode.parentNode);
      this._loadingIndicator.startup();
    },

    /**
     * This function is used handle all click events of project summary
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _handleClickEvents: function () {
      this.own(on(this.btnAddNode, 'click', lang.hitch(this, function () {
        if (!domClass.contains(this.btnAddNode, "esriCTAddStatisticsIconDisable")) {
          this._addCostEscalationBtnClicked();
          this._handleActionButtonVisibility();
        }
      })));
      this.own(on(this.btnAddNode, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          if (!domClass.contains(this.btnAddNode, "esriCTAddStatisticsIconDisable")) {
            this._addCostEscalationBtnClicked();
            this._handleActionButtonVisibility();
          }
        }
      })));
      this.own(on(this.btnCrossNode, 'click', lang.hitch(this, function () {
        if (!domClass.contains(this.btnCrossNode, "esriCTDeleteStatisticsIconDisable")) {
          this._deleteLayerRow();
        }
      })));
      this.own(on(this.btnCrossNode, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          if (!domClass.contains(this.btnCrossNode, "esriCTDeleteStatisticsIconDisable")) {
            this._deleteLayerRow();
          }
        }
      })));
      //Handle Up/Down button click events
      this.own(on(this.btnUpNode, 'click', lang.hitch(this, this._upArrowClicked)));
      this.own(on(this.btnUpNode, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this._upArrowClicked();
        }
      })));
      this.own(on(this.btnDownNode, 'click', lang.hitch(this, this._downArrowClicked)));
      this.own(on(this.btnDownNode, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this._downArrowClicked();
        }
      })));
      //Handle OK button click event
      this.own(on(this.okButton, "click", lang.hitch(this, function () {
        this._okButtonClicked();
      })));
      this.own(on(this.okButton, "keydown", lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this._okButtonClicked();
        }
      })));
      //Handle Cancel button click event
      this.own(on(this.cancelButton, "click", lang.hitch(this, function () {
        this._cancelButtonClicked();
      })));
      this.own(on(this.cancelButton, "keydown", lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this._cancelButtonClicked();
        }
      })));
    },

    /**
     * This function is called on ok button click
     */
    _okButtonClicked: function () {
      var hasValidData, tableRows;
      hasValidData = true;
      // costEscalationArr = this._getCostEscalationArray();
      tableRows = this._costEscalationTable.getRows();
      //validate if all entires in the table are valid if not show error
      array.forEach(tableRows, lang.hitch(this, function (editableLayerRow) {
        if (!editableLayerRow.costLabelTextBox.isValid()) {
          hasValidData = false;
          focusUtil.focus(editableLayerRow.costLabelTextBox);
        }
        if (!editableLayerRow.costValueLabelTextBox.isValid()) {
          hasValidData = false;
          focusUtil.focus(editableLayerRow.costValueLabelTextBox);
        }
      }));
      if (hasValidData) {
        this.calculateGrossCost(this.totalCost, true);
        this.emit("onOkButtonClicked");
      } else {
        this.appUtils.showMessage(this.nls.costEscalation.invalidEntry);
      }
    },

    /**
     * This function is called on cancel button clicked
     */
    _cancelButtonClicked: function () {
      this.emit("onCancelButtonClicked");
      this._loadingIndicator.show();
      //clear all edited escalation entries
      this._costEscalationTable.clear();
      //use previously stored entries and create table
      array.forEach(this.tableData, lang.hitch(this, function (data) {
        this._addCostEscalationLayerRow(data);
      }));
      this._updateGrossCost();
      this._loadingIndicator.hide();
    },

    /**
     * This function is used move up when particular row is selected
     * with the help of checkbox(i.e checked)
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _upArrowClicked: function () {
      if (!domClass.contains(this.btnUpNode, "esriCTStatisticsUpIconDisable")) {
        var tr, trs;
        trs = this._costEscalationTable.getRows();
        var tableRowsData = this._costEscalationTable.getData();
        array.forEach(tableRowsData, lang.hitch(this, function (tableRowData, index) {
          if (tableRowData.editable) {
            tr = trs[index];
          }
        }));
        if (!this._costEscalationTable.onBeforeRowUp(tr)) {
          return;
        }
        var index = array.indexOf(trs, tr);
        if (index > 0) {
          var newIndex = index - 1;
          var trRef = trs[newIndex];
          if (trRef) {
            html.place(tr, trRef, 'before');
            this._costEscalationTable.updateUI();
            this._costEscalationTable.emit('row-up', tr);
            this._updateGrossCost();
          }
        }
      }
    },

    /**
     * This function is used move down when particular row is selected
     * with the help of checkbox(i.e checked)
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _downArrowClicked: function () {
      if (!domClass.contains(this.btnDownNode, "esriCTStatisticsDownIconDisable")) {
        var tr, trs;
        trs = this._costEscalationTable.getRows();
        var tableRowsData = this._costEscalationTable.getData();
        array.forEach(tableRowsData, lang.hitch(this, function (tableRowData, index) {
          if (tableRowData.editable) {
            tr = trs[index];
          }
        }));
        if (!this._costEscalationTable.onBeforeRowDown(tr)) {
          return;
        }
        var index = array.indexOf(trs, tr);
        if (index < trs.length - 1) {
          var newIndex = index + 1;
          var trRef = trs[newIndex];
          if (trRef) {
            html.place(tr, trRef, 'after');
            this._costEscalationTable.updateUI();
            this._costEscalationTable.emit('row-down', tr);
            this._updateGrossCost();
          }
        }
      }
    },

    startup: function () {
      this.inherited(arguments);
      this._init();
    },

    /**
    * This function is used to rest the escalation table and gross cost
    * @memberOf widgets/CostAnalysis/project-summary
    */
    reset: function (projectInfo) {
      this.projectInfo = projectInfo;
      //clear all the previous escalation entries
      this._costEscalationTable.clear();
      this.totalCost = 0;
      this.previouslyAddedEscalations = [];
      this.tableData = [];
    },

    /**
    * This function is used to initialize the process of project summary tab
    * @memberOf widgets/CostAnalysis/project-summary
    */
    _init: function () {
      this._createCostEscalationFieldTable();
      this._createCostTypeFieldStore();
    },

    /**
    * This function is used to store the current table data
    * @memberOf widgets/CostAnalysis/project-summary
    */
    cloneTableData: function () {
      this.tableData = [];
      var tableData = [], tableRow = {};
      if (this._costEscalationTable && this._costEscalationTable.getRows().length) {
        array.forEach(this._costEscalationTable.getRows(), lang.hitch(this, function (row) {
          tableRow = {};
          if (row.costLabelTextBox) {
            tableRow.label = row.costLabelTextBox.getValue();
          }
          if (row.costTypeLabelDropdown) {
            tableRow.type = row.costTypeLabelDropdown.getValue();
          }
          if (row.costValueLabelTextBox) {
            tableRow.costValue = row.costValueLabelTextBox.getValue();
          }
          tableData.push(tableRow);
        }));
        this.tableData = lang.clone(tableData);
      }
      this._handleActionButtonVisibility();
    },

    /**
     * Load rows for each additional cost in table
     * @memberOf widgets/CostAnalysis/project-summary
     */
    loadAdditionalCost: function (features) {
      var tableRow = {};
      if (features.length > 0) {
        //Sort additional cost features by costIndex attribute
        features.sort(lang.hitch(this, this._sortFeatureArray));
        array.forEach(features, lang.hitch(this, function (feature) {
          tableRow = {};
          tableRow.label = feature.attributes[this.config.projectMultiplierFields.DESCRIPTION];
          tableRow.type = feature.attributes[this.config.projectMultiplierFields.TYPE];
          tableRow.costValue = feature.attributes[this.config.projectMultiplierFields.VALUE];
          //check if valid type (+/*/-/%)
          if (tableRow.type === "+" || tableRow.type === "*" || tableRow.type === "_" ||
            tableRow.type === "%") {
            if (this.additionalCostTable && this.loadingProject) {
              this._storeAsPreviouslyAdded(
                feature.attributes[this.additionalCostTable.objectIdField]);
            }
            this._addCostEscalationLayerRow(tableRow);
          }
        }));
      } else {
        // for minimum configuration
        array.forEach(this.config.projectCostSettings, lang.hitch(this, function (projectCostSettings) {
          tableRow = {};
          tableRow.label = projectCostSettings.label;
          tableRow.type = projectCostSettings.type;
          tableRow.costValue = projectCostSettings.value;
          //check if valid type (+/*/-/%)
          if (tableRow.type === "+" || tableRow.type === "*" || tableRow.type === "_" ||
            tableRow.type === "%") {
            this._addCostEscalationLayerRow(tableRow);
          }
        }));
      }
    },

    /**
     * Sorts features according to cost index attribute
     */
    _sortFeatureArray: function (a, b) {
      var constIndexField = this.config.projectMultiplierFields.COSTINDEX;
      return a.attributes[constIndexField] - b.attributes[constIndexField];
    },

    /**
    * This function is used to create table for adding new cost escalation field
    * @memberOf widgets/CostAnalysis/project-summary
    */
    _createCostEscalationFieldTable: function () {
      var args, fields;
      fields = [{
        name: 'editable',
        title: this.nls.common.label,
        type: 'checkbox',
        editable: false,
        width: '40%'
      }, {
        name: 'field',
        title: this.nls.common.type,
        type: 'empty',
        editable: false,
        width: '30%'
      }, {
        name: 'field',
        title: this.nls.costEscalation.valueHeader,
        type: 'empty',
        editable: true,
        width: '40%'
      }];
      args = {
        fields: fields,
        selectable: false,
        autoHeight: true
      };
      this._costEscalationTable = new SimpleTable(args);
      this._costEscalationTable.placeAt(this.costEscalationTableNode);
      this._costEscalationTable.startup();
    },

    /**
     * This function is used to handle the checked/change event of parent and row checkbox
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _handleCheckBoxClick: function (row) {
      var editableHeaderCheckbox, editableRowCheckbox;
      editableHeaderCheckbox = query(".simple-table-title .jimu-checkbox", this.domNode)[0];
      editableRowCheckbox = query(".jimu-checkbox", row)[0];

      on(registry.byNode(editableHeaderCheckbox), "change", lang.hitch(this, function () {
        this._handleActionButtonVisibility();
      }));
      on(registry.byNode(editableRowCheckbox), "change", lang.hitch(this, function () {
        this._handleActionButtonVisibility();
      }));
    },

    /**
     * This function is used to handle the state of add, delete, up and down buttons
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _handleActionButtonVisibility: function () {
      var tableRows, isValidRow = true, editableRowCount = 0, editableHeaderCheckbox, editableHeaderCheckboxNode;
      tableRows = this._costEscalationTable.getRows();
      editableHeaderCheckbox = query(".simple-table-title .jimu-checkbox", this.domNode)[0];
      editableHeaderCheckboxNode = registry.byNode(editableHeaderCheckbox);
      array.forEach(tableRows, lang.hitch(this, function (row) {
        var editableRowCheckbox;
        //Check if label has value
        if (lang.trim(row.costLabelTextBox.value) === "") {
          isValidRow = false;
        }
        //Check if row value is number and not empty
        if (isNaN(row.costValueLabelTextBox.value) ||
          lang.trim(row.costValueLabelTextBox.value + "") === "" ||
          row.costValueLabelTextBox.value === "0" || row.costValueLabelTextBox.value === 0) {
          isValidRow = false;
        }
        //Fetch checkbox in each row and check wether it is selected or not
        editableRowCheckbox = query(".jimu-checkbox", row)[0];
        if (registry.byNode(editableRowCheckbox).checked) {
          editableRowCount++;
        }
      }));
      //Enable delete button if at least one row is selected
      if (editableRowCount === 0) {
        domClass.replace(this.btnCrossNode, "esriCTDeleteStatisticsIconDisable",
          "esriCTDeleteStatisticsIcon");
        domAttr.set(this.btnCrossNode, "tabindex", "-1");
      } else {
        domClass.replace(this.btnCrossNode, "esriCTDeleteStatisticsIcon",
          "esriCTDeleteStatisticsIconDisable");
        domAttr.set(this.btnCrossNode, "tabindex", "0");
      }
      //If table has valid rows, enable add button
      if (isValidRow || tableRows.length === 0) {
        domClass.replace(this.btnAddNode, "esriCTAddStatisticsIcon",
          "esriCTAddStatisticsIconDisable");
        domAttr.set(this.btnAddNode, "tabindex", "0");
      } else {
        domClass.replace(this.btnAddNode, "esriCTAddStatisticsIconDisable",
          "esriCTAddStatisticsIcon");
        domAttr.set(this.btnAddNode, "tabindex", "-1");
      }
      //Enable up and down buttons when only one valid rows or is selected
      if (isValidRow && (editableRowCount === 1) && (tableRows.length > 1)) {
        domClass.replace(this.btnUpNode, "esriCTStatisticsUpIcon", "esriCTStatisticsUpIconDisable");
        domClass.replace(this.btnDownNode, "esriCTStatisticsDownIcon",
          "esriCTStatisticsDownIconDisable");
        domAttr.set(this.btnUpNode, "tabindex", "0");
        domAttr.set(this.btnDownNode, "tabindex", "0");
      } else {
        domClass.replace(this.btnUpNode, "esriCTStatisticsUpIconDisable", "esriCTStatisticsUpIcon");
        domClass.replace(this.btnDownNode, "esriCTStatisticsDownIconDisable",
          "esriCTStatisticsDownIcon");
        domAttr.set(this.btnUpNode, "tabindex", "-1");
        domAttr.set(this.btnDownNode, "tabindex", "-1");
      }
      //If all the rows are deleted then uncheck and disable the header checkbox
      if (tableRows.length === 0) {
        editableHeaderCheckboxNode.set('status', false);
        domClass.add(editableHeaderCheckboxNode.domNode, "jimu-state-disabled");
        domAttr.set(editableHeaderCheckboxNode.domNode, "tabindex", "-1");
        focusUtils.focus(this.btnAddNode);
        jimuUtils.initFirstFocusNode(this.widgetDomNode, this.btnAddNode);
      } else {
        editableHeaderCheckboxNode.set('status', true);
        domClass.remove(editableHeaderCheckboxNode.domNode, "jimu-state-disabled");
        domAttr.set(editableHeaderCheckboxNode.domNode, "tabindex", "0");
        jimuUtils.initFirstFocusNode(this.widgetDomNode, editableHeaderCheckboxNode.domNode);
      }
    },

    /**
   * This function is used to add a row on click of add cost field button
   * @memberOf widgets/CostAnalysis/project-summary
   */
    _addCostEscalationBtnClicked: function () {
      this._addCostEscalationLayerRow();
      // set focus to added row
      if(this.widgetDomNode) {
        var tableRows = this._costEscalationTable.getRows();
        if (tableRows.length >= 0) {
          var lastRow = tableRows[tableRows.length - 1];
          var checkBoxOfLastRow = query(".jimu-checkbox", lastRow)[0];
          focusUtils.focus(checkBoxOfLastRow);
          if (this.textBoxKeyDownEvent) {
            this.textBoxKeyDownEvent[0].remove();
          }
          //Listen for keydown event on cost value text box
          //If it is valid then focus on the add cost button
          this.textBoxKeyDownEvent = this.own(on(lastRow.costValueLabelTextBox, "keydown",
            lang.hitch(this, function (evt) {
              setTimeout(lang.hitch(this, function () {
                if (evt.keyCode === keys.TAB && evt.shiftKey) {
                  return;
                }
                if (lastRow.costValueLabelTextBox.isValid() &&
                  evt.keyCode === keys.TAB) {
                  if (!domClass.contains(this.btnAddNode, "esriCTAddStatisticsIconDisable")) {
                    focusUtils.focus(this.btnAddNode);
                  }
                }
              }), 100);
            })));
        }
      }
    },

    /**
     * This function is used to add a row on selection of editable layer in layer settings tab
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _addCostEscalationLayerRow: function (data) {
      var editableLayerRow, fieldsColumn;
      editableLayerRow = this._costEscalationTable.addRow({});
      fieldsColumn = query('.simple-table-cell', editableLayerRow.tr);
      this._handleCheckBoxClick(editableLayerRow.tr);
      if (fieldsColumn) {
        editableLayerRow = editableLayerRow.tr;
        this._addCostLabelTextBox(fieldsColumn[0], editableLayerRow, data);
        this._addCostTypeLabelDropdown(fieldsColumn[1], editableLayerRow, data);
        this._addCostValueLabelTextBox(fieldsColumn[2], editableLayerRow, data);
      }
    },

    /**
     * This function is used to add textbox in table
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _addCostLabelTextBox: function (fieldsColumn, editableLayerRow, data) {
      var textBoxContainer;
      textBoxContainer = domConstruct.create("div", {
        "class": "esriCTTextBoxContainer"
      }, fieldsColumn);
      editableLayerRow.costLabelTextBox = new ValidationTextBox({
        "class": "esriCTCostLabelTextbox esriCTAddLayerTableNode",
        "aria-label": this.nls.common.label
      }, textBoxContainer);
      editableLayerRow.costLabelTextBox.startup();
      if (data && data.label) {
        editableLayerRow.costLabelTextBox.set("value", data.label);
      }
      editableLayerRow.costLabelTextBox.validator =
        lang.hitch(this, this._validateCostEscalationLabelFields);
      this.own(on(editableLayerRow.costLabelTextBox, "change", lang.hitch(this, function () {
        this._handleActionButtonVisibility();
      })));
    },

    /**
     * This function is used validate label
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _validateCostEscalationLabelFields: function (value) {
      if (lang.trim(value) === "") {
        return false;
      }
      return true;
    },

    /**
     * This function is used to add  dropdown of type in table
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _addCostTypeLabelDropdown: function (fieldsColumn, editableLayerRow, data) {
      var dropDownContainer, item;
      dropDownContainer = domConstruct.create("div", {
        "class": "esriCTCostTypeDropDownContainer esriCTAddLayerTableNode"
      }, fieldsColumn);
      editableLayerRow.costTypeLabelDropdown = new Select({
        name: "layerSelect",
        store: this._costFieldStore,
        labelAttr: "name",
        "class": "esriCTCostTypeDropdown",
        "aria-label": this.nls.common.type
      }, dropDownContainer);
      if (data && data.type) {
        item = editableLayerRow.costTypeLabelDropdown.store.get(data.type);
        editableLayerRow.costTypeLabelDropdown.setValue(item.value);
      }

      this.own(on(editableLayerRow.costTypeLabelDropdown, "change",
        lang.hitch(this, this._updateGrossCost)));
      editableLayerRow.costTypeLabelDropdown.startup();
    },

    /**
     * This function is used to add textbox in table for value
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _addCostValueLabelTextBox: function (fieldsColumn, editableLayerRow, data) {
      var textBoxContainer;
      textBoxContainer = domConstruct.create("div", {
        "class": "esriCTTextBoxContainer esriCTAddLayerTableNode"
      }, fieldsColumn);
      editableLayerRow.costValueLabelTextBox = new ValidationTextBox({
        "class": "esriCTCostLabelTextbox",
        "trim": true,
        "aria-label": this.nls.costEscalation.valueHeader
      }, textBoxContainer);
      editableLayerRow.costValueLabelTextBox.startup();
      if (data && data.costValue) {
        editableLayerRow.costValueLabelTextBox.set("value", data.costValue);
      }
      editableLayerRow.costValueLabelTextBox.validator =
        lang.hitch(this, this._validateCostEscalationValueFields);
      this.own(on(editableLayerRow.costValueLabelTextBox, "change",
        lang.hitch(this, function () {
          this._updateGrossCost();
          this._handleActionButtonVisibility();
        })));
    },

    /**
     * This function is used validate value
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _validateCostEscalationValueFields: function (value) {
      value = Number(value);
      if (value === "" || isNaN(value) || value === "0" || value === 0) {
        return false;
      }
      return true;
    },

    /**
     * This function is used to update values
     *  @memberOf widgets/CostAnalysis/project-summary
     */
    _getCostEscalationArray: function () {
      var tableRows, costEscalationFieldObj, costEscalationArr;
      tableRows = this._costEscalationTable.getRows();
      costEscalationArr = [];
      array.forEach(tableRows, lang.hitch(this, function (tableRow) {
        costEscalationArr.push(
          costEscalationFieldObj = {
            "label": tableRow.costLabelTextBox.getValue(),
            "type": tableRow.costTypeLabelDropdown.getValue(),
            "value": tableRow.costValueLabelTextBox.getValue()
          });
      }));
      return costEscalationArr;
    },

    /**
     * This function is used to add configuration values in table
     *  @memberOf widgets/CostAnalysis/project-summary
     */
    addConfiguredAdditionalCostArray: function () {
      var costEscalationArr, featuresArray, additionalCostArray;
      costEscalationArr = [];
      featuresArray = [];
      additionalCostArray = [];

      var grossCost = this.totalCost;
      array.forEach(this.config.projectCostSettings, lang.hitch(this, function (configredProjectCost) {
        costEscalationArr.push({
          "label": configredProjectCost.label,
          "type": configredProjectCost.type,
          "value": configredProjectCost.value
        });
      }));
      array.forEach(costEscalationArr, lang.hitch(this, function (costInfo, index) {
        var attributes = {},
          value;
        value = parseFloat(costInfo.value);
        if (this.projectInfo && this.projectInfo.projectId &&
          this.config.projectMultiplierFields) {
          //create attributes
          attributes[this.config.projectMultiplierFields.DESCRIPTION] = costInfo.label;
          attributes[this.config.projectMultiplierFields.TYPE] = costInfo.type;
          attributes[this.config.projectMultiplierFields.VALUE] = value;
          attributes[this.config.projectMultiplierFields.COSTINDEX] = index + 1;
          attributes[this.config.projectMultiplierFields.PROJECTGUID] =
            this.projectInfo.projectId;
          featuresArray.push(new Graphic(null, null, attributes));
        }
        grossCost = this._calculateGrossAdditionalCost(costInfo.type, value, grossCost);
        additionalCostArray.push({
          "label": costInfo.label,
          "type": costInfo.type,
          "value": value
        });
      }));
      this.loadAdditionalCost(featuresArray);
      // while creating the project, gross is updated twice to the project layer.
      // for updating gross cost, applyEdits needs to be executed which is called from the function(calculateGrossCost)
      // calculateGrossCost gets called from work-bench and this function(addConfiguredAdditionalCostArray)
      // so twice the apply edits gets executed, one have default gross cost and other
      // having updated gross cost(from configuration)
      // hence, sometimes actual gross cost gets overridden by default gross cost.
      // so, to aviod this we have provided this delay, so that default gross cost gets overridden by
      // calculated gross cost
      setTimeout(lang.hitch(this, function () {
        this.calculateGrossCost(this.totalCost, true);
      }), 500);
    },

    /**
     * This function is used to delete layer row
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _deleteLayerRow: function () {
      var tableRows = this._costEscalationTable.getRows();
      var tableRowsData = this._costEscalationTable.getData();
      var checkBoxNode;
      array.forEach(tableRowsData, lang.hitch(this, function (tableRowData, index) {
        if (tableRowData.editable) {
          this._costEscalationTable.deleteRow(tableRows[index]);
          this._updateGrossCost();
        }
      }));
      if (this._costEscalationTable.getRows().length === 0) {
        checkBoxNode = query("th .checkbox", this.costEscalationTableNode)[0];
        if (domClass.contains(checkBoxNode, "checked")) {
          domClass.remove(checkBoxNode, "checked");
        }
      }
      this._handleActionButtonVisibility();
    },

    /**
     * This function is used to store cost type
     * @memberOf widgets/CostAnalysis/project-summary
     */
    _createCostTypeFieldStore: function () {
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
      this._costFieldStore = new Memory({ idProperty: "value", data: costTypeFieldArr });
    },

    /**
     * This function is used to calculate gross cost and return additional cost info
     * @memberOf setting/project-summary
     */
    _calculateGrossAdditionalCost: function (costType, costValue, grossCost) {
      switch (costType) {
        case '+':
          grossCost += costValue;
          break;
        case '_':
          grossCost -= costValue;
          break;
        case '*':
          grossCost *= costValue;
          break;
        case '%':
          grossCost += (grossCost * costValue) / 100;
          break;
      }
      return grossCost;
    },

    /**
     * This function is used to update gross cost and return additional cost info
     * @memberOf setting/StatisticsSettings
     */
    _updateGrossCost: function () {
      var totalRoundedCost, roundedGrossCost, totalCostAriaLabel, grossCostAriaLabel;
      if (this.loadingProject) {
        return;
      }
      var costEscalationArr = this._getCostEscalationArray();
      var grossCost = this.totalCost;
      var featuresArray = [], additionalCostArray = [];
      array.forEach(costEscalationArr, lang.hitch(this, function (costInfo, index) {
        var value = parseFloat(costInfo.value);
        var attributes = {};
        if (value) {
          if (this.projectInfo && this.projectInfo.projectId &&
            this.config.projectMultiplierFields) {
            //create attributes
            attributes[this.config.projectMultiplierFields.DESCRIPTION] = costInfo.label;
            attributes[this.config.projectMultiplierFields.TYPE] = costInfo.type;
            attributes[this.config.projectMultiplierFields.VALUE] = value;
            attributes[this.config.projectMultiplierFields.COSTINDEX] = index + 1;
            attributes[this.config.projectMultiplierFields.PROJECTGUID] =
              this.projectInfo.projectId;
            featuresArray.push(new Graphic(null, null, attributes));
          }
          grossCost = this._calculateGrossAdditionalCost(costInfo.type, value, grossCost);
          additionalCostArray.push(
            {
              "label": costInfo.label,
              "type": costInfo.type,
              "value": value
            }
          );
        }
      }));

      totalRoundedCost = this.appUtils.roundProjectCostValue(
        this.config.generalSettings.roundCostType, this.totalCost);
      totalRoundedCost = this.config.generalSettings.currency + " " + totalRoundedCost;
      //Set project total cost
      domAttr.set(this.totalCostDiv, "innerHTML", totalRoundedCost);

      roundedGrossCost = this.appUtils.roundProjectCostValue(
        this.config.generalSettings.roundCostType, grossCost);
      roundedGrossCost = this.config.generalSettings.currency + " " + roundedGrossCost;
      //Calculate and set project gross cost
      domAttr.set(this.grossCostDiv, "innerHTML", roundedGrossCost);

      //Add customize aria-label to project overview table row
      totalCostAriaLabel = this.totalCostLabel.innerHTML.replace("*",
        this.nls.projectOverview.roundingLabel);
      grossCostAriaLabel = this.grossCostLabel.innerHTML.replace("*",
        this.nls.projectOverview.roundingLabel);
      domAttr.set(this.totalCostLabel, "aria-label", totalCostAriaLabel.replace("*", ""));
      domAttr.set(this.grossCostLabel, "aria-label", grossCostAriaLabel.replace("*", ""));
      return {
        grossCost: grossCost, features: featuresArray,
        additionalCostInfo: additionalCostArray
      };
    },

    /**
     * This function is used to calculate gross cost
     * @memberOf setting/StatisticsSettings
     */
    calculateGrossCost: function (totalCost, updateTable) {
      var grossCostDetails;
      this.totalCost = totalCost;
      if (this.loadingProject) {
        return;
      }
      grossCostDetails = this._updateGrossCost();
      this.emit("grossCostUpdated",
        this.totalCost, grossCostDetails.grossCost, grossCostDetails.additionalCostInfo);
      if (updateTable) {
        this._updateCostEscalationTable(grossCostDetails.features);
      }
    },

    /**
     * This function is used save updated cost escalation's in escalation table
     * @memberOf setting/StatisticsSettings
     */
    _updateCostEscalationTable: function (features) {
      if (this.additionalCostTable &&
        (features.length > 0 || this.previouslyAddedEscalations.length > 0)) {
        this._loadingIndicator.show();
        this.additionalCostTable.applyEdits(features, null, this.previouslyAddedEscalations,
          lang.hitch(this, function (adds) {
            var isFailed = false;
            this.previouslyAddedEscalations = [];
            //Loop through all successfully added features
            if (adds && adds.length > 0) {
              array.forEach(adds, lang.hitch(this, function (result) {
                if (result.success) {
                  this._storeAsPreviouslyAdded(result.objectId);
                } else {
                  isFailed = true;
                }
              }));
              if (isFailed) {
                this.appUtils.showMessage(this.nls.costEscalation.errorInSavingCostEscalation);
              }
            }
            this._loadingIndicator.hide();
          }), lang.hitch(this, function () {
            this._loadingIndicator.hide();
            this.appUtils.showMessage(this.nls.costEscalation.errorInSavingCostEscalation);
          }));
      }
    },

    /**
     * This function is used keep track previously added graphics
     * @memberOf setting/StatisticsSettings
     */
    _storeAsPreviouslyAdded: function (objectId) {
      var graphics, attributes = {};
      attributes[this.additionalCostTable.objectIdField] = objectId;
      graphics = new Graphic(null, null, attributes);
      this.previouslyAddedEscalations.push(graphics);
    },

    /**
     * This function is used to set first and last focus node in add additional cost panel
     */
    setFirstAndLastNode: function () {
      var editableHeaderCheckbox, editableHeaderCheckboxNode, tableRows;
      tableRows = this._costEscalationTable.getRows();
      if(tableRows.length) {
        editableHeaderCheckbox = query(".simple-table-title .jimu-checkbox", this.domNode)[0];
        editableHeaderCheckboxNode = registry.byNode(editableHeaderCheckbox);
        jimuUtils.initFirstFocusNode(this.widgetDomNode, editableHeaderCheckboxNode.domNode);
        focusUtil.focus(editableHeaderCheckboxNode.domNode);
      }
      else {
        focusUtils.focus(this.btnAddNode);
        jimuUtils.initFirstFocusNode(this.widgetDomNode, this.btnAddNode);
      }
      jimuUtils.initLastFocusNode(this.widgetDomNode, this.cancelButton);
      this._addAriaLabelToTdChkBoxes();
    },

    /**
     * This function is used to add aria-labels to checkboxes
     */
    _addAriaLabelToTdChkBoxes: function () {
      var checkBoxNodes = query("td .checkbox", this.costEscalationTableNode);
      if (checkBoxNodes && checkBoxNodes.length > 0) {
        array.forEach(checkBoxNodes, lang.hitch(this, function (checkBoxNode) {
          domAttr.set(checkBoxNode, "aria-label", this.nls.common.label);
        }));
      }
    }
  });
});