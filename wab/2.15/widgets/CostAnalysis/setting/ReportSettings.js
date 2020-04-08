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
  'jimu/dijit/Popup',
  'jimu/dijit/SimpleTable',
  'dijit/_WidgetBase',
  'dojo/Evented',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./ReportSettings.html',
  '../utils',
  'dojo/_base/array',
  'dojo/_base/lang',
  'jimu/dijit/Message',
  'dijit/form/TextBox'
], function (
  declare,
  Popup,
  SimpleTable,
  BaseWidget,
  Evented,
  TemplatedMixin,
  _WidgetsInTemplateMixin,
  template,
  utils,
  array,
  lang,
  Message,
  TextBox
) {
  return declare([BaseWidget, TemplatedMixin,  Evented, _WidgetsInTemplateMixin], {
    templateString: template,
    popup: null,
    _reportSettingsTable: null,
    //Default titles to be populates in table
    _tableTitleFields: {
      "Layer": "layerName",
      "Feature Template": "TEMPLATENAME",
      "Geography": "GEOGRAPHY",
      "Scenario": "SCENARIO",
      "Count": "count",
      "Length": "Length",
      "Area": "Area",
      "Equation": "COSTEQUATION",
      "Cost": "cost"
    },

    baseClass: 'jimu-widget-cost-analysis-report-settings',

    constructor: function (options) {
      lang.mixin(this, options);
    },

    startup: function () {
      this._init();
    },

    postCreate: function () {
      this.popup = null;
      this.inherited(arguments);
    },

    /**
   * Initializing the widget
   * @memberOf CostAnalysis/setting/ReportSettings
   */
    _init: function () {
      if (this.isLoad) {
        this._addAbbreviationForTitle();
        this._createDataForInitialLoad();
        this.emit("onInitialLoad", this.previousReportSettings);
      } else {
        //If the report settings are not configured
        //Populate the default settings
        if (!this.previousReportSettings) {
          this._addAbbreviationForTitle();
          this._createDataForInitialLoad();
        }
        this._createReportSettingsTable();
        this._createReportSettingsPopup();
      }
    },

    /**
   * Add abbreviation units to respective title fields in table
   * @memberOf CostAnalysis/setting/ReportSettings
   */
    _addAbbreviationForTitle: function () {
      var abbr;
      for (var title in this._tableTitleFields) {
        if (title === "Length") {
          abbr = utils.units[this.config.generalSettings.measurementUnit].lengthAbbr;
          this._tableTitleFields[title + " (" + abbr + ")"] = this._tableTitleFields[title];
          delete this._tableTitleFields[title];
        } else if (title === "Area") {
          abbr = utils.units[this.config.generalSettings.measurementUnit].areaAbbr;
          this._tableTitleFields[title + " (" + abbr + ")"] = this._tableTitleFields[title];
          delete this._tableTitleFields[title];
        }
        else if (title === "Cost") {
          abbr = this.config.generalSettings.currency;
          this._tableTitleFields[title + " (" + abbr + ")"] = this._tableTitleFields[title];
          delete this._tableTitleFields[title];
        }
      }
    },

    /**
   * Create manage scenario popup dialog
   * @memberOf CostAnalysis/setting/ReportSettings
   */
    _createReportSettingsTable: function () {
      //initializing popup with default configuration
      this.popup = new Popup({
        titleLabel: this.nls.generalSettings.reportSettings.reportSettingsPopupTitle,
        content: this.domNode,
        width: 800,
        height: 500,
        autoHeight: true,
        "class": this.baseClass,
        buttons: [{
          label: this.nls.common.ok,
          onClick: lang.hitch(this, function() {
            this.onOkButtonClicked();
          })
        }, {
          label: this.nls.common.cancel
        }]
      });
    },

    /**
     * Emit the event
     * @memberOf CostAnalysis/setting/ReportSettings
     */
    onOkButtonClicked: function () {
      var data = this._getReportSettings();
      var duplicateValue, columnLabelsArr = [];
      array.forEach(data.reportSettings, function (dataItem) {
        if (dataItem.columnLabel !== "") {
          columnLabelsArr.push(dataItem.columnLabel);
        }
      });
      duplicateValue = columnLabelsArr.filter(lang.hitch(this, function(e, i, a) { return a.indexOf(e) !== i; })); // jshint ignore : line
      if (duplicateValue.length > 0) {
        new Message({
          message: this.nls.generalSettings.reportSettings.duplicateMsg + ":" + duplicateValue[0]
        });
        return;
      } else {
        this.emit("okButtonClicked", data);
        this.popup.close();
      }
    },

    /**
     * This function is used to create table for add Layer section
     * @memberOf CostAnalysis/setting/ReportSettings
     */
    _createReportSettingsPopup: function () {
      var args, fields = [{
        name: 'showColumn',
        title: this.nls.generalSettings.reportSettings.checkboxLabel,
        type: 'checkbox',
        editable: false,
        width: '15%'
      }, {
        name: 'columnTitle',
        title: this.nls.generalSettings.reportSettings.layerTitle,
        type: 'text',
        editable: false,
        width: '35%'
      }, {
        name: 'columnLabel',
        title: this.nls.generalSettings.reportSettings.columnLabel,
        width: '35%',
        type: 'empty'
      }, {
        name: 'actions',
        title: this.nls.common.actions,
        width: '15%',
        type: 'actions',
        actions: ['up', 'down']
      }];
      args = {
        fields: fields,
        selectable: false
      };
      this._reportSettingsTable = new SimpleTable(args);
      this._reportSettingsTable.placeAt(this.reportSettingsTableNode);
      this._reportSettingsTable.startup();
      //Populate report name if present
      if (this.previousReportSettings.hasOwnProperty("reportName")) {
        this.reportNameNode.set('value', this.previousReportSettings.reportName);
      }
      // Populate the table with existing settings
      this._populateReportSettings();
    },

    /**
   * This function is used to create default data
   * @memberOf CostAnalysis/setting/ReportSettings
   */
    _createDataForInitialLoad: function () {
      this.previousReportSettings = {};
      this.previousReportSettings.reportSettings = [];
      for (var title in this._tableTitleFields) {
        this.previousReportSettings.reportSettings.push({
          isVisible: true,
          columnTitle: title,
          columnLabel: "",
          fieldToMap: this._tableTitleFields[title]
        });
      }
      this.previousReportSettings.reportName = "";
    },

    /**
     * Populate the previous settings
     * @memberOf CostAnalysis/setting/ReportSettings
     */
    _populateReportSettings: function () {
      array.forEach(this.previousReportSettings.reportSettings,
        lang.hitch(this, function (rowSetting) {
          // condition to check if layer is editable and has assets in it
          this._addNewRow(rowSetting);
        }));
    },

    /**
     * Add new report setting row in table
     * @memberOf CostAnalysis/setting/ReportSettings
     */
    _addNewRow: function (rowSetting) {
      this._createRow(rowSetting);
    },

    /**
     * Create new row
     * @memberOf CostAnalysis/setting/ReportSettings
     */
    _createRow: function (rowSetting) {
      var row;
      row = this._reportSettingsTable.addRow({
        showColumn: rowSetting.isVisible,
        columnTitle: rowSetting.columnTitle
      });
      row.tr.labelTextBox = new TextBox();
      row.tr.labelTextBox.set("value", rowSetting.columnLabel);
      row.tr.labelTextBox.placeAt(row.tr.cells[2]);
    },

    /**
     * get updated report settings
     * @memberOf CostAnalysis/setting/ReportSettings
     */
    _getReportSettings: function () {
      var configuredData = {}, tableRows, tableData;
      tableData = this._reportSettingsTable.getData();
      tableRows = this._reportSettingsTable.getRows();
      configuredData.reportSettings = [];
      array.forEach(tableData, lang.hitch(this, function (row, index) {
        var rowObj = {};
        rowObj.isVisible = row.showColumn;
        rowObj.columnTitle = row.columnTitle;
        rowObj.columnLabel = tableRows[index].labelTextBox.get('value');
        rowObj.fieldToMap = this._getFieldTitleAbbr(row.columnTitle);
        configuredData.reportSettings.push(rowObj);
      }));
      //Add report name
      configuredData.reportName = this.reportNameNode.get('value');
      //return the latest report settings object
      return configuredData;
    },

    /**
     * @memberOf CostAnalysis/setting/ReportSettings
     */
    _getFieldTitleAbbr: function (columnTitle) {
      if (columnTitle.indexOf("Length") > -1) {
        return "Length";
      } else if (columnTitle.indexOf("Area") > -1) {
        return "Area";
      } else if (columnTitle.indexOf("Cost") > -1) {
        return "cost";
      } else {
        return this._tableTitleFields[columnTitle];
      }
    }
  });
});