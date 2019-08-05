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
define(["dojo/_base/array",
  "dojo/_base/declare",
  "dojo/dom-class",
  "dojo/on",
  "jimu/BaseWidgetSetting",
  "dijit/_WidgetsInTemplateMixin",

  "esri/dijit/geoenrichment/SelectableTree",

  "../esriAnalystX/widgets/SelectableTreeGrid/SelectableTreeGrid",

  "../utils/GEUtil",
  "../utils/ReportUtil",
  "../utils/ValidationUtil",

  "jimu/dijit/formSelect",

  "jimu/dijit/TabContainer",

  "dijit/form/CheckBox",
  "dijit/layout/ContentPane"
],
  function (array, declare, domClass, on, BaseWidgetSetting, _WidgetsInTemplateMixin, SelectableTree, SelectableTreeGrid, GEUtil, ReportUtil, ValidationUtil, Select, TabContainer) {

    // ID's of reports in Infographics/Reports Tree
    var ESRI_REPORTS_TREE_ID = 0;
    var MY_REPORTS_TREE_ID = 1;
    var SHARED_REPORTS_TREE_ID = 2;

    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

      baseClass: "jimu-widget-business-analyst-setting",

      selectedCountryID: "",

      postCreate: function () {

        this.inherited(arguments);

        this.tab = new TabContainer({
          tabs: [{
            title: this.nls.infographics,
            content: this.infographicsContentPane
          }, {
            title: this.nls.reports,
            content: this.reportsContentPane
          }, {
            title: this.nls.rings,
            content: this.ringsContentPane
          }, {
            title: this.nls.driveTime,
            content: this.driveTimeContentPane
          }, {
            title: this.nls.walkTime,
            content: this.walkTimeContentPane
          }],
          selected: this.nls.infographics
        });
        this.tab.placeAt(this.reportInfographicTabContainer);
        this.tab.startup();
      },

      postMixInProperties:function(){
        this.jimuNls = window.jimuNls;
      },

      startup: function () {
        if (this._started) {
          return;
        }
        this.inherited(arguments);

        this.setConfig(this.config);
      },

      setConfig: function (config) {
        var self = this

        // Create Country Drop Down
        GEUtil.getAvailableCountries().then(function (response) {
          var countries = [];
          array.forEach(response.countries, function (country) {
            countries.push({ label: country.name, value: country.id, selected: country.id == self.config.defaultCountryID ? "selected" : "" });
          });

          self.countryDropDownInfographics = new Select({
            options: countries
          }).placeAt(self.countryDropDownContainerInfographics);

          self.countryDropDownInfographics.startup();

          self.selectedCountryID = self.countryDropDownInfographics.get("value");

          on(self.countryDropDownInfographics, "change", function () {
            self._countryChangeInfographics();
          });

          self.countryDropDownReports = new Select({
            options: countries
          }).placeAt(self.countryDropDownContainerReports);

          self.countryDropDownReports.startup();

          self.selectedCountryID = self.countryDropDownReports.get("value");

          on(self.countryDropDownReports, "change", function () {
            self._countryChangeReports();
          });

          self._loadConfigForCountry(self.selectedCountryID);

        });

        this._loadRingDTWTConfig();
      },

      getConfig: function () {

        // Validate Ring DT WT values
        if (!this._validateRingDTWT())
          return false;

        this._setConfigForCountry(this.selectedCountryID);

        this._setRingDTWTConfig();

        this.config.defaultCountryID = this.selectedCountryID;

        return this.config;
      },

      _countryChangeInfographics: function () {
        if (this.countryDropDownReports.get("value") != this.countryDropDownInfographics.get("value")) {
          this.countryDropDownReports.set("value", this.countryDropDownInfographics.get("value"));
          this._countryChange();
        }
      },

      _countryChangeReports: function () {
        if (this.countryDropDownInfographics.get("value") != this.countryDropDownReports.get("value")) {
          this.countryDropDownInfographics.set("value", this.countryDropDownReports.get("value"));
          this._countryChange();
        }
      },

      _countryChange: function () {
        this._setConfigForCountry(this.selectedCountryID);

        this.selectedCountryID = this.countryDropDownInfographics.get("value");

        this._loadConfigForCountry(this.selectedCountryID);
      },

      // Sets the configuration (Infographics/Reports) for the passed in country based on the currently selected Infographics/Reports
      _setConfigForCountry: function (countryID) {
        var localCountryConfig = null;

        array.forEach(this.config.countryConfig, function (countryConfig) {
          if (countryConfig.countryID == countryID) {
            localCountryConfig = countryConfig;
          }
        });

        // Set default country config if not configured
        if (!localCountryConfig) {
          localCountryConfig = {
            "countryID": countryID,
            "allowEsriReports": true,
            "allowEsriInfographics": true,
            "allowMyReports": true,
            "allowMyInfographics": true,
            "allowSharedReports": true,
            "allowSharedInfographics": true,
            "disabledReports": [],
            "disabledInfographics": []
          }
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        // INFOGRAPHICS CONFIG
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        // Allow Infographic groups if there is at least 1 selected in (if they are empty, we still allow too)
        localCountryConfig.allowEsriInfographics = this.infographicsTreeGrid.tree.data[ESRI_REPORTS_TREE_ID].leafCount > 0 ? this.infographicsTreeGrid.tree.data[ESRI_REPORTS_TREE_ID].selectCount != 0 : true;
        localCountryConfig.allowMyInfographics = this.infographicsTreeGrid.tree.data[MY_REPORTS_TREE_ID].leafCount > 0 ? this.infographicsTreeGrid.tree.data[MY_REPORTS_TREE_ID].selectCount != 0 : true;
        localCountryConfig.allowSharedInfographics = this.infographicsTreeGrid.tree.data[SHARED_REPORTS_TREE_ID].leafCount > 0 ? this.infographicsTreeGrid.tree.data[SHARED_REPORTS_TREE_ID].selectCount != 0 : true;

        // Loop through all infographics and set config appropriately
        var infographics = this.infographicsTreeGrid.tree.data[ESRI_REPORTS_TREE_ID].children.concat(this.infographicsTreeGrid.tree.data[MY_REPORTS_TREE_ID].children).concat(this.infographicsTreeGrid.tree.data[SHARED_REPORTS_TREE_ID].children);
        localCountryConfig.disabledInfographics = this._getDisabledReports(infographics);

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        // REPORTS CONFIG
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        // Allow Report groups if there is at least 1 selected in (if they are empty, we still allow too)
        localCountryConfig.allowEsriReports = this.reportsTreeGrid.tree.data[ESRI_REPORTS_TREE_ID].leafCount > 0 ? this.reportsTreeGrid.tree.data[ESRI_REPORTS_TREE_ID].selectCount != 0 : true;
        localCountryConfig.allowMyReports = this.reportsTreeGrid.tree.data[MY_REPORTS_TREE_ID].leafCount > 0 ? this.reportsTreeGrid.tree.data[MY_REPORTS_TREE_ID].selectCount != 0 : true;
        localCountryConfig.allowSharedReports = this.reportsTreeGrid.tree.data[SHARED_REPORTS_TREE_ID].leafCount > 0 ? this.reportsTreeGrid.tree.data[SHARED_REPORTS_TREE_ID].selectCount != 0 : true;

        // Loop through all infographics and set config appropriately
        var reports = this.reportsTreeGrid.tree.data[ESRI_REPORTS_TREE_ID].children.concat(this.reportsTreeGrid.tree.data[MY_REPORTS_TREE_ID].children).concat(this.reportsTreeGrid.tree.data[SHARED_REPORTS_TREE_ID].children);
        localCountryConfig.disabledReports = this._getDisabledReports(reports);

        // Save back to config
        var configIndex = -1;
        array.forEach(this.config.countryConfig, function (countryConfig, index) {
          if (countryConfig.countryID == countryID) {
            configIndex = index;
          }
        });

        // Replace existing country config
        if (configIndex != -1)
          this.config.countryConfig[configIndex] = localCountryConfig;
        // Add new country config
        else
          this.config.countryConfig.push(localCountryConfig);
      },

      // Loads the config settings for the specified country to the Settings page
      _loadConfigForCountry: function (countryID) {
        var self = this;

        // Set Infographics Tree
        ReportUtil.getAvailableInfographicReports(countryID).then(function (reports) {

          array.forEach(reports, function (reportParent) {
            array.forEach(reportParent.children, function (report) {
              report.selected = true;
            });
          });

          if (!self.infographicsTreeGrid) {
            self.infographicsTreeGrid = new SelectableTreeGrid({
              tree: new SelectableTree(reports),
              showHeader: false
            }, self.infographicTreeGridContainer);
          }

          // Set disabled reports if they are already configured
          var configIndex = -1;
          array.forEach(self.config.countryConfig, function (countryConfig, index) {
            if (countryConfig.countryID == countryID) {
              configIndex = index;
            }
          });

          if (configIndex != -1) {
            array.forEach(self.config.countryConfig[configIndex].disabledInfographics, function (disabledId) {
              array.forEach(reports, function (reportNode) {
                array.forEach(reportNode.children, function (child) {
                  if (disabledId == child.value) {
                    child.selected = false;
                  }
                });
              });
            });
          }

          self.infographicsTreeGrid.tree.clear();
          self.infographicsTreeGrid.tree.addNodes(reports);

        });

        // Set Reports Tree
        ReportUtil.getAvailableClassicReports(countryID).then(function (reports) {
          array.forEach(reports, function (reportParent) {
            array.forEach(reportParent.children, function (report) {
              report.selected = true;
            });
          });

          if (!self.reportsTreeGrid) {
            self.reportsTreeGrid = new SelectableTreeGrid({
              tree: new SelectableTree(reports),
              showHeader: false
            }, self.reportTreeGridContainer);
          }

          // Set disabled reports if they are already configured
          var configIndex = -1;
          array.forEach(self.config.countryConfig, function (countryConfig, index) {
            if (countryConfig.countryID == countryID) {
              configIndex = index;
            }
          });

          if (configIndex != -1) {
            array.forEach(self.config.countryConfig[configIndex].disabledReports, function (disabledId) {
              array.forEach(reports, function (reportNode) {
                array.forEach(reportNode.children, function (child) {
                  if (disabledId == self._getClassicReportId(child)) {
                    child.selected = false;
                  }
                });
              });
            });
          }

          self.reportsTreeGrid.tree.clear();
          self.reportsTreeGrid.tree.addNodes(reports);

        });
      },

      _getClassicReportId: function (report) {
        if (report.value && report.value.itemid)
          return report.value.itemid;
        else
          return report.value;
      },

      // Returns an array of unselected (disabled) reports/infographics
      _getDisabledReports: function (reports) {
        var disabledIDs = [];

        array.forEach(reports, function (report) {
          if (!report.selected)
            // Handle Custom Classic Reports
            if (report.value && report.value.itemid)
              disabledIDs.push(report.value.itemid)
            else
              disabledIDs.push(report.value)
        });

        return disabledIDs;
      },

      _setRingDTWTConfig: function () {
        this.config.ringDefaults = this._getRadii(this.ringsBufferRadii1, this.ringsBufferRadii2, this.ringsBufferRadii3);
        this.config.driveTimeDefaults = this._getRadii(this.driveTimeBufferRadii1, this.driveTimeBufferRadii2, this.driveTimeBufferRadii3);
        this.config.walkTimeDefaults = this._getRadii(this.walkTimeBufferRadii1, this.walkTimeBufferRadii2, this.walkTimeBufferRadii3);
        this.config.ringUnitDefault = this.ringsBufferUnits.get("value");
        this.config.driveTimeUnitDefault = this.driveTimeBufferUnits.get("value");
        this.config.walkTimeUnitDefault = this.walkTimeBufferUnits.get("value");
        this.config.ringDisabled = this.disabledRingsOption.checked;
        this.config.driveTimeDisabled = this.disabledDriveTimeOption.checked;
        this.config.walkTimeDisabled = this.disabledWalkTimeOption.checked;

        this.config.infographicsDisabled = this.disabledInfographicsOption.checked;
        this.config.reportsDisabled = this.disabledReportsOption.checked;
      },

      _loadRingDTWTConfig: function () {
        this._setRadii(this.ringsBufferRadii1, this.ringsBufferRadii2, this.ringsBufferRadii3, this.config.ringDefaults);
        this.ringsBufferUnits.set("value", this.config.ringUnitDefault);
        this.disabledRingsOption.setChecked(this.config.ringDisabled);

        this._setRadii(this.driveTimeBufferRadii1, this.driveTimeBufferRadii2, this.driveTimeBufferRadii3, this.config.driveTimeDefaults);
        this.driveTimeBufferUnits.set("value", this.config.driveTimeUnitDefault);
        this.disabledDriveTimeOption.setChecked(this.config.driveTimeDisabled);

        this._setRadii(this.walkTimeBufferRadii1, this.walkTimeBufferRadii2, this.walkTimeBufferRadii3, this.config.walkTimeDefaults);
        this.walkTimeBufferUnits.set("value", this.config.walkTimeUnitDefault);
        this.disabledWalkTimeOption.setChecked(this.config.walkTimeDisabled);

        this.disabledInfographicsOption.setChecked(this.config.infographicsDisabled);
        this.disabledReportsOption.setChecked(this.config.reportsDisabled);
      },

      _getRadii: function (textBox1, textBox2, textBox3) {
        var value1 = textBox1.get("value"),
          value2 = textBox2.get("value"),
          value3 = textBox3.get("value"),
          returnRadii = [];

        if (value1 != "")
          returnRadii.push(value1);

        if (value2 != "")
          returnRadii.push(value2);

        if (value3 != "")
          returnRadii.push(value3);

        return returnRadii;
      },

      _setRadii: function (textBox1, textBox2, textBox3, radii) {
        if (radii.length > 0)
          textBox1.set("value", radii[0]);
        else
          textBox1.set("value", "");

        if (radii.length > 1)
          textBox2.set("value", radii[1]);
        else
          textBox2.set("value", "");

        if (radii.length > 2)
          textBox3.set("value", radii[2]);
        else
          textBox3.set("value", "");
      },

      _validateRingDTWT: function () {
        // Validate Invalid Values
        var valid = true,
          returnValid = true,
          tabChanged = false;

        returnValid = valid = ValidationUtil.validateInvalidValues(this.ringsBufferRadii1, this.ringsBufferRadii2, this.ringsBufferRadii3, this.ringValidationErrorMessage, this.nls.thisEntryIsNotValid);

        if (!valid) {
          this.tab.selectTab(this.nls.rings);
          tabChanged = true;
        }

        valid = ValidationUtil.validateInvalidValues(this.driveTimeBufferRadii1, this.driveTimeBufferRadii2, this.driveTimeBufferRadii3, this.driveTimeValidationErrorMessage, this.nls.thisEntryIsNotValid)
        returnValid = returnValid && valid;

        if (!valid && !tabChanged) {
          this.tab.selectTab(this.nls.driveTime);
          tabChanged = true;
        }

        valid = ValidationUtil.validateInvalidValues(this.walkTimeBufferRadii1, this.walkTimeBufferRadii2, this.walkTimeBufferRadii3, this.walkTimeValidationErrorMessage, this.nls.thisEntryIsNotValid)
        returnValid = returnValid && valid;

        if (!valid && !tabChanged) {
          this.tab.selectTab(this.nls.walkTime);
          tabChanged = true;
        }

        if (!returnValid)
          return returnValid;

        // If all inputs are valid, validate Min/Max values
        tabChange = false;
        returnValid = valid = ValidationUtil.validateMinMaxValues(this.ringsBufferRadii1, this.ringsBufferRadii2, this.ringsBufferRadii3, ValidationUtil.MIN_RINGS_VALUE, ValidationUtil.MAX_RINGS_VALUE, this.ringValidationErrorMessage, this.nls.invalidValueRing)

        if (!valid) {
          this.tab.selectTab(this.nls.rings);
          tabChanged = true;
        }

        valid = ValidationUtil.validateMinMaxValues(this.driveTimeBufferRadii1, this.driveTimeBufferRadii2, this.driveTimeBufferRadii3, ValidationUtil.MIN_DTWT_VALUE, ValidationUtil.MAX_DTWT_VALUE, this.driveTimeValidationErrorMessage, this.nls.invalidValueDTWT)
        returnValid = returnValid && valid;

        if (!valid && !tabChanged) {
          this.tab.selectTab(this.nls.driveTime);
          tabChanged = true;
        }

        valid = ValidationUtil.validateMinMaxValues(this.walkTimeBufferRadii1, this.walkTimeBufferRadii2, this.walkTimeBufferRadii3, ValidationUtil.MIN_DTWT_VALUE, ValidationUtil.MAX_DTWT_VALUE, this.walkTimeValidationErrorMessage, this.nls.invalidValueDTWT)
        returnValid = returnValid && valid;

        if (!valid && !tabChanged) {
          this.tab.selectTab(this.nls.walkTime);
          tabChanged = true;
        }

        return returnValid;
      }
    });

    return dfd;

  });
