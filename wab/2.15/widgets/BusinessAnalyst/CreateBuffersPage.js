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
define([
  "dojo/_base/declare",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetBase",
  "dijit/_WidgetsInTemplateMixin",

  "esri/dijit/geoenrichment/_WizardPage",

  "esri/geometry/Polygon",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Color",
  "esri/graphic",

  "./utils/GEUtil",
  "./utils/TravelModeUtil",
  "./utils/ValidationUtil",
  "./utils/SiteUtil",

  "dojo/text!./CreateBuffersPage.html",

  "jimu/dijit/TabContainer3",

  "dijit/form/TextBox"
],
function (declare, _TemplatedMixin, _WidgetBase, _WidgetsInTemplateMixin, _WizardPage, Polygon, SimpleFillSymbol, SimpleLineSymbol, Color, Graphic, GEUtil, TravelModeUtil, ValidationUtil, SiteUtil, template, TabContainer) {
  
  return declare([_WidgetBase, _TemplatedMixin, _WizardPage, _WidgetsInTemplateMixin], {

    templateString: template,

    postCreate: function () {
      this.inherited(arguments);

      this.tab = new TabContainer({
        tabs: [{
          title: this.nls.rings,
          content: this.ringsContentPane
        }, {
          title: this.nls.driveTime,
          content: this.driveTimeContentPane
        }, {
          title: this.nls.walkTime,
          content: this.walkTimeContentPane
        }],
        selected: this.nls.rings
      });
      this.tab.placeAt(this.ringDtWtTabContainer);
      this.tab.startup();

      this._setConfigDefaults();
    },

    startup: function () {
      this.inherited(arguments);
    },

    refresh: function () {
      this._showHideTabs();
    },

    _setConfigDefaults: function () {
      // Set Default Radii based on configured options
      this._setRadii(this.config.ringDefaults, this.ringsBufferRadii1, this.ringsBufferRadii2, this.ringsBufferRadii3);
      this.ringsBufferUnits.set("value", this.config.ringUnitDefault);

      this._setRadii(this.config.driveTimeDefaults, this.driveTimeBufferRadii1, this.driveTimeBufferRadii2, this.driveTimeBufferRadii3);
      this.driveTimeBufferUnits.set("value", this.config.driveTimeUnitDefault);

      this._setRadii(this.config.walkTimeDefaults, this.walkTimeBufferRadii1, this.walkTimeBufferRadii2, this.walkTimeBufferRadii3);
      this.walkTimeBufferUnits.set("value", this.config.walkTimeUnitDefault);
    },

    _showHideTabs: function () {

      // Show Hide tabs based on configured Buffer options
      if (this.config.ringDisabled)
        this.tab.removeTab(this.nls.rings);

      if (this.config.driveTimeDisabled)
        this.tab.removeTab(this.nls.driveTime);

      if (this.config.walkTimeDisabled)
        this.tab.removeTab(this.nls.walkTime);

      if (this.tab.getSelectedTitle() === this.nls.rings && this.config.ringDisabled)
        this.tab.selectTab(this.nls.driveTime);

      if (this.tab.getSelectedTitle() === this.nls.driveTime && this.config.driveTimeDisabled)
        this.tab.selectTab(this.nls.walkTime);

      if (this.tab.getSelectedTitle() === this.nls.walkTime && this.config.walkTimeDisabled)
        this.tab.selectTab(this.nls.driveTime);
    },

    applyBuffer: function () {

      // Validate Inputs
      if (!this._validateInput())
        return;

      this.shelter.show();

      var self = this;
      var colors = [[16, 59, 143, 1], [0, 204, 51, 1], [204, 51, 0, 1]];
      var index = 0;
      var studyAreasOptions = {};
      var areaType = "";
      var travelModeLookup = "";
      var bufferUnitsDisplayName = "";
      var simplificationTolerance = 10;

      var factor, tolerance;

      // Rings
      if (this.tab.getSelectedTitle() === this.nls.rings) {
        studyAreasOptions.areaType = "RingBuffer";
        studyAreasOptions.bufferUnits = this.ringsBufferUnits.get("value");
        bufferUnitsDisplayName = this.ringsBufferUnits._getDisplayedValueAttr();
        studyAreasOptions.bufferRadii = this._getRadii(this.ringsBufferRadii1, this.ringsBufferRadii2, this.ringsBufferRadii3);
        areaType = this.nls.ring;
      }
      // Drive Time
      else if (this.tab.getSelectedTitle() === this.nls.driveTime) {
        studyAreasOptions.areaType = "NetworkServiceArea";
        studyAreasOptions.bufferUnits = this.driveTimeBufferUnits.get("value");
        bufferUnitsDisplayName = this.driveTimeBufferUnits._getDisplayedValueAttr();
        studyAreasOptions.bufferRadii = this._getRadii(this.driveTimeBufferRadii1, this.driveTimeBufferRadii2, this.driveTimeBufferRadii3);
        areaType = this.nls.driveTime;
        travelModeLookup = "Driving ";
        travelModeLookup += studyAreasOptions.bufferUnits === "Minutes" ? "Time" : "Distance";

        tolerance = studyAreasOptions.bufferRadii ? SiteUtil.getMaxRadiusInKilometers(studyAreasOptions, false) : 0;

        // Calculate tolerance increasing factor for big sites.
        // It will be a value in the range 1..3 for walk times and in the range 1..5 for drive times.
        factor = tolerance && Math.max(1, Math.log(tolerance / 8) * Math.LOG2E);
        simplificationTolerance = tolerance * Math.min(factor, 5);
      }
      // Walk Time
      else {
        studyAreasOptions.areaType = "NetworkServiceArea";
        studyAreasOptions.bufferUnits = this.walkTimeBufferUnits.get("value");
        bufferUnitsDisplayName = this.walkTimeBufferUnits._getDisplayedValueAttr();
        studyAreasOptions.bufferRadii = this._getRadii(this.walkTimeBufferRadii1, this.walkTimeBufferRadii2, this.walkTimeBufferRadii3);
        areaType = this.nls.walkTime;
        travelModeLookup = "Walking ";
        travelModeLookup += studyAreasOptions.bufferUnits === "Minutes" ? "Time" : "Distance";

        tolerance = studyAreasOptions.bufferRadii ? SiteUtil.getMaxRadiusInKilometers(studyAreasOptions, true) : 0;

        // Calculate tolerance increasing factor for big sites.
        // It will be a value in the range 1..3 for walk times and in the range 1..5 for drive times.
        factor = tolerance && Math.max(1, Math.log(tolerance / 8) * Math.LOG2E);
        simplificationTolerance = tolerance * Math.min(factor, 3);
      }

      var graphicsToAdd = [];

      TravelModeUtil.getTravelMode(travelModeLookup, simplificationTolerance).then(function (travelMode) {

        // Set Travel Mode is returned, only returned for DT's/WT's, rings it will be empty
        if (travelMode)
          studyAreasOptions.travelMode = travelMode;

        GEUtil.createRingOrDriveTimes({
          geometry: self.wizard.selectedPoint.geometry,
          studyAreasOptions: studyAreasOptions,
          sourceCountry: self.wizard.selectedCountryID
        }).then(function (result) {
          // Remove any existing Selected Point
          self.wizard.clearSelectedPointBuffers();

          self.wizard.selectedPoint.areadesc2 = areaType + self.nls.colon + " " + studyAreasOptions.bufferRadii.join(", ") + " " + self.nls["headerDescription_" + bufferUnitsDisplayName] + " " + self.nls.radii;

          var features = result.results[0].value.FeatureSet[0].features.reverse();
          var bufferRadiiReversed = studyAreasOptions.bufferRadii.reverse();

          // Add RGB rings to map cc3300, 00cc33, 103b8f
          for (var id in features) {
            var feature = features[id];
            var polygon = new Polygon({ rings: feature.geometry.rings, spatialReference: { wkid: 102100 } });

            // No fill for Rings
            if (self.tab.getSelectedTitle() == self.nls.rings) {
              var simpleFillSymbol = new SimpleFillSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                  new Color(colors[index]), 2),
                new Color([255, 0, 15, 0]));
            }
            // Fill For DT's/WT's
            else {
              var fillColor = new Color(colors[index]);
              fillColor.a = 0.5;

              var simpleFillSymbol = new SimpleFillSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                  new Color(colors[index]), 2),
                fillColor);
            }

            var graphic = new Graphic(polygon, simpleFillSymbol)

            var tradeArea = {};
            tradeArea.graphic = graphic;
            tradeArea.name = self.wizard.selectedPoint.locationName + " - " + bufferRadiiReversed[index] + " " + bufferUnitsDisplayName;
            tradeArea.shortName = bufferRadiiReversed[index] + " " + bufferUnitsDisplayName;
            tradeArea.AREA_DESC = bufferRadiiReversed[index] + " " + bufferUnitsDisplayName;
            tradeArea.AREA_DESC2 = areaType + self.nls.colon + " " + bufferRadiiReversed[index] + " " + self.nls["headerDescription_" + bufferUnitsDisplayName] + " " + self.nls.radius_lowercase;

            self.wizard.selectedPoint.tradeAreas.push(tradeArea);

            self.map.graphics.add(graphic);

            graphicsToAdd.push(graphic);

            index++;
          }

          self.wizard.selectedPoint.tradeAreas = self.wizard.selectedPoint.tradeAreas.reverse();

          // Set map to largest trade area extent
          self.map.setExtent(self.wizard.selectedPoint.tradeAreas[self.wizard.selectedPoint.tradeAreas.length - 1].graphic._extent);

          self.shelter.hide();

          self.onNext();
        }, function (error) {
          alert("Error: " + error);
          self.shelter.hide();
          /* handle error here */
        });
      });

    },

    backOnClick: function () {
      this.onBack();
    },

    _getRadii: function (textBox1, textBox2, textBox3) {
      var value1 = textBox1.get("value"),
        value2 = textBox2.get("value"),
        value3 = textBox3.get("value"),
        returnRadii = [];

      if (value1 !== "")
        returnRadii.push(value1);

      if (value2 !== "")
        returnRadii.push(value2);

      if (value3 !== "")
        returnRadii.push(value3);

      return returnRadii;
    },

    _setRadii: function (radii, textBox1, textBox2, textBox3) {
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

    _validateInput: function () {
      // Validate Invalid Values
      var valid = true;

      // Rings
      if (this.tab.getSelectedTitle() === this.nls.rings) {
        valid = ValidationUtil.validateInvalidValues(this.ringsBufferRadii1, this.ringsBufferRadii2, this.ringsBufferRadii3, this.ringValidationErrorMessage, this.nls.thisEntryIsNotValid);

        if (!valid)
          return false;
      }
      // Drive Time
      else if (this.tab.getSelectedTitle() === this.nls.driveTime) {
        valid = ValidationUtil.validateInvalidValues(this.driveTimeBufferRadii1, this.driveTimeBufferRadii2, this.driveTimeBufferRadii3, this.driveTimeValidationErrorMessage, this.nls.thisEntryIsNotValid)

        if (!valid)
          return false;
      }
      // Walk Time
      else {
        valid = ValidationUtil.validateInvalidValues(this.walkTimeBufferRadii1, this.walkTimeBufferRadii2, this.walkTimeBufferRadii3, this.walkTimeValidationErrorMessage, this.nls.thisEntryIsNotValid)

        if (!valid)
          return false;
      }


      // If all inputs are valid, validate Min/Max values
      // Rings
      if (this.tab.getSelectedTitle() === this.nls.rings) {
        valid = ValidationUtil.validateMinMaxValues(this.ringsBufferRadii1, this.ringsBufferRadii2, this.ringsBufferRadii3, ValidationUtil.MIN_RINGS_VALUE, ValidationUtil.MAX_RINGS_VALUE, this.ringValidationErrorMessage, this.nls.invalidValueRing)

        if (!valid)
          return false;
      }
      // Drive Time
      else if (this.tab.getSelectedTitle() === this.nls.driveTime) {
        valid = ValidationUtil.validateMinMaxValues(this.driveTimeBufferRadii1, this.driveTimeBufferRadii2, this.driveTimeBufferRadii3, ValidationUtil.MIN_DTWT_VALUE, ValidationUtil.MAX_DTWT_VALUE, this.driveTimeValidationErrorMessage, this.nls.invalidValueDTWT)

        if (!valid)
          return false;
      }
      else {
        valid = ValidationUtil.validateMinMaxValues(this.walkTimeBufferRadii1, this.walkTimeBufferRadii2, this.walkTimeBufferRadii3, ValidationUtil.MIN_DTWT_VALUE, ValidationUtil.MAX_DTWT_VALUE, this.walkTimeValidationErrorMessage, this.nls.invalidValueDTWT)

        if (!valid)
          return false
      }

      // If we made it here, values are valid.
      return true;
    }

  });
});
