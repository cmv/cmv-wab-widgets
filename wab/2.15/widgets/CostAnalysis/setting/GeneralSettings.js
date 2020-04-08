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
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./GeneralSettings.html',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/on',
  '../utils',
  'dojo/dom-attr',
  'dojo/dom-class',
  './ReportSettings',
  'dijit/form/CheckBox'
], function (
  declare,
  BaseWidget,
  _WidgetsInTemplateMixin,
  template,
  lang,
  array,
  on,
  utils,
  domAttr,
  domClass,
  ReportSettings
) {
  return declare([BaseWidget, _WidgetsInTemplateMixin], {
    templateString: template,
    configuredReportSettings: null,
    baseClass: 'jimu-widget-cost-analysis-general-settings',

    constructor: function (options) {
      lang.mixin(this, options);
    },

    postMixInProperties: function () {
      this.nls.common = {};
      lang.mixin(this.nls.common, window.jimuNls.common);
    },

    postCreate: function () {
      this.inherited(arguments);
      this._init();
    },

    _init: function () {
      this._setConfig();
      this._attachNodeEvents();
      this.currencyInputNode.validator = lang.hitch(this, this._currencyValidator);
      this.bufferDistanceInputNode.validator = lang.hitch(this, this._bufferDistanceValidator);
      this.own(on(this.currencyInputNode, "change", lang.hitch(this, function () {
        if (this.currencyInputNode.isValid()) {
          this._onUnitChange();
        }
      })));
      //Listen for edit icon click event and open the report settings dialog
      this.own(on(this.editReportSettings, "click", lang.hitch(this, function () {
        this._createReportSettingsDialog(false);
      })));
      //Load the report panel widget first time to fetch the default data
      //This call will not show the widget instead it will only get the data
      if (!this.configuredReportSettings) {
        this._createReportSettingsDialog(true);
      }
    },

    /**
    * This function is used to set user selected config values for general setting
    * @memberOf setting/GeneralSettings
    */
    _setConfig: function () {
      this.measurementUnitInputNode.set('value', this.config.generalSettings.measurementUnit);
      this.currencyInputNode.set('value', this.config.generalSettings.currency);
      this.roundCostInputNode.set('value', this.config.generalSettings.roundCostType);
      this.projectAreaTypeInputNode.set('value', this.config.generalSettings.projectAreaType);
      this.bufferDistanceInputNode.set('value', this.config.generalSettings.bufferDistance);
      if (this.config.generalSettings.hasOwnProperty("canExportProject")) {
        this.exportCSVCheckBox.set('checked', this.config.generalSettings.canExportProject, false);
      }
      this.configuredReportSettings = this.config.generalSettings.CSVReportSettings;
    },

    /**
     * This function is used to validate currency unit and buffer distance
     * @memberOf setting/GeneralSettings
     */
    validate: function () {
      var projectAreaType;
      projectAreaType = this.projectAreaTypeInputNode.get('value');
      //condition to validate currency regex.
      if (!this.currencyInputNode.validate()) {
        return {
          "isValid": false,
          "errorMessage": this.nls.generalSettings.errorMessages.currency
        };
      }
      // condition to bufferDistance if project area buffer selected.
      if (projectAreaType === "buffer" && !this.bufferDistanceInputNode.validate()) {
        return {
          "isValid": false,
          "errorMessage": this.nls.generalSettings.errorMessages.bufferDistance
        };
      }
      return { isValid: true };
    },

    /**
     * This function is used to fetch config values set by user from general settings
     * @memberOf setting/GeneralSettings
     */
    getConfig: function () {
      return {
        "measurementUnit": this.measurementUnitInputNode.get('value'),
        "currency": this.currencyInputNode.get('value'),
        "roundCostType": this.roundCostInputNode.get('value'),
        "projectAreaType": this.projectAreaTypeInputNode.get('value'),
        "bufferDistance": this.bufferDistanceInputNode.get('value'),
        "canExportProject": this.exportCSVCheckBox.checked,
        "CSVReportSettings": this.configuredReportSettings
      };
    },

    /**
    * This function is used to bind events on change of buffer distance and project area type
    * @memberOf setting/GeneralSettings
    */
    _attachNodeEvents: function () {
      this.own(on(this.measurementUnitInputNode, "change", lang.hitch(this, function (evt) {
        domAttr.set(this.bufferDistanceUnit, "innerHTML", this.nls.units[evt].label);
        this._onUnitChange();
      })));
      this.own(on(this.projectAreaTypeInputNode, "change", lang.hitch(this, function (value) {
        if (value === "outline") {
          this.bufferDistanceInputNode.textbox.value = "5";
          this.bufferDistanceInputNode.set("disabled", true);
          domClass.add(this.projectSettingsOutputRightContainerNode, "esriCTHidden");
        }
        else {
          this.bufferDistanceInputNode.set("disabled", false);
          domClass.remove(this.projectSettingsOutputRightContainerNode, "esriCTHidden");
        }
      })));
    },

    /**
    * This function is used to update the units and currency abbreviations in report settings table
    * @memberOf setting/GeneralSettings
    */
    _onUnitChange: function () {
      var abbr, selectedUnit;
      selectedUnit = this.measurementUnitInputNode.get('value');
      if (this.configuredReportSettings) {
        array.forEach(this.configuredReportSettings.reportSettings,
          lang.hitch(this, function (reportSetting) {
            if (reportSetting.columnTitle.indexOf("Length") > -1) {
              abbr = utils.units[selectedUnit].lengthAbbr;
              reportSetting.columnTitle = "Length" + " (" + abbr + ")";
            } else if (reportSetting.columnTitle.indexOf("Area") > -1) {
              abbr = utils.units[selectedUnit].areaAbbr;
              reportSetting.columnTitle = "Area" + " (" + abbr + ")";
            }
            else if (reportSetting.columnTitle.indexOf("Cost") > -1) {
              abbr = this.currencyInputNode.get('value');
              reportSetting.columnTitle = "Cost" + " (" + abbr + ")";
            }
          }));
      }
    },

    /**
     * This function is used to validate currency
     * @memberOf setting/GeneralSettings
     */
    _currencyValidator: function (value) {
      var currencyRegex,
        regexRes;
      currencyRegex = /^([^0-9]+)$/;
      regexRes = value.match(currencyRegex);
      //to check valid currency
      if (!regexRes) {
        this.currencyInputNode.invalidMessage = this.nls.generalSettings.errorMessages.currency;
        return false;
      }
      return true;
    },

    /**
    * This function is used to validate buffer distance
    * @memberOf setting/GeneralSettings
    */
    _bufferDistanceValidator: function (value) {
      //constraints:{max:100}, regExp:'^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$', invalidMessage:'${nls.generalSettings.errorMessages.bufferDistance}'
      var bufferDistanceRegex,
        regexRes;
      if (value < 0) {
        this.bufferDistanceInputNode.invalidMessage =
          this.nls.generalSettings.errorMessages.outOfRangebufferDistance;
        return false;
      }
      //bufferDistanceRegex = /^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/;
      bufferDistanceRegex = /^([0-9]*[1-9][0-9]*([\.\,][0-9]+)*([\.\,][0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/;
      regexRes = value.match(bufferDistanceRegex);
      //to check valid currency
      if (!regexRes) {
        this.bufferDistanceInputNode.invalidMessage =
          this.nls.generalSettings.errorMessages.bufferDistance;
        return false;
      }
      return true;
    },

    /**
    * This function is used to create the report settings dialog
    * @memberOf setting/GeneralSettings
    */
    _createReportSettingsDialog: function (isLoad) {
      this._reportSettings = new ReportSettings({
        nls: this.nls,
        previousReportSettings: this.configuredReportSettings,
        isLoad: isLoad,
        config: this.config
      });
      //Fetch the updated report settings on ok button click
      on(this._reportSettings, "okButtonClicked", lang.hitch(this, function (reportSettings) {
        this.configuredReportSettings = reportSettings;
      }));

      //Fetch the default report settings when the report panel is loaded for the first time
      on(this._reportSettings, "onInitialLoad", lang.hitch(this, function (reportSettings) {
        this.configuredReportSettings = reportSettings;
      }));
      this._reportSettings.startup();
    }
  });
});