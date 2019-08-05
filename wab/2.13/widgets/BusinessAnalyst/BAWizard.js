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
  "dojo/_base/array",
  "dojo/_base/declare",
  "dojo/on",
  "dojo/when",

  "esri/dijit/geoenrichment/_Wizard",
  "esri/geometry/webMercatorUtils",

  "./CreateBuffersPage",
  "./NoPermissionsPage",
  "./RunReportsPage",
  "./SelectPointPolygonPage",

  "./utils/GEUtil",
  "./utils/GeocodeUtil"
],
  function (array, declare, on, when, Wizard, webMercatorUtils, CreateBuffersPage, NoPermissionsPage, RunReportsPage, SelectPointPolygonPage, GEUtil, GeocodeUtil) {

    var SELECT_POINT_POLYGON = "SELECT_POINT_POLYGON",
      CREATE_BUFFERS = "CREATE_BUFFERS",
      RUN_REPORTS = "RUN_REPORTS",
      NO_PERMISSIONS = "NO_PERMISSIONS";

    return declare([Wizard], {

      // selectedPoint:
      //   areadesc2: areadesc2 passed into classic report reportFields parameter
      //   geometry: Geometry of selected point
      //   pointGraphic: Graphic of point
      //   locationName: Name of the location, passed to classic reports and Infographics
      //   long: longitude of point location
      //   lat: latitude of point location
      //   tradeAreas: []
      //     {
      //       name - passed to infographics ReportPlayer
      //       shortName - passed to infographics ReportPlayer
      //       graphic - actual graphic that is on the map, passed to ReportPlayer, and createReport
      //       AREA_DESC - AREA_DESC that gets passed into classic reports
      //       AREA_DESC - AREA_DESC2 that gets passed into classic reports
      //     }
      //
      // selectedPolygon:
      //   geometry: Geometry of selected area
      //   locationName: Name of the location, passed to classic reports and Infographics
      //
      // selectedCountryID: ID of the selected country (point or polygon), used for loading country's Infographics/Reports
      // availableCountries: [] of available countries from Geonrichment/countries request
      selectedPoint: {
        tradeAreas: []
      },

      selectedPolygon: {
      },

      selectedCountryID: "",
      availableCountries: [],

      name: "BusinessAnalystWizard",
      baseClass: "jimu-widget-business-analyst-wizard",

      postCreate: function () {

        this.inherited(arguments);
        var self = this;

        when(GEUtil.hasGEPrivilege(), function (hasPrivilege) {

          // If user does not have GE permission, display no permissions page
          if (!hasPrivilege) {
            self.pages[NO_PERMISSIONS] = new NoPermissionsPage({
              nls: self.nls
            });
            self.pages[NO_PERMISSIONS].startup();

            self.loadPage(NO_PERMISSIONS);
          }
          else {

            self.pages[SELECT_POINT_POLYGON] = new SelectPointPolygonPage({
              map: self.map,
              nls: self.nls,
              wizard: self,
              config: self.config,
              onNext: function () { self._loadCreateBuffersPage(); }
            });
            self.pages[CREATE_BUFFERS] = new CreateBuffersPage({
              map: self.map,
              nls: self.nls,
              wizard: self,
              config: self.config,
              onBack: function () { self._loadSelectPointPolygonPage(); },
              onNext: function () { self._loadRunReportsPage(); }
            });
            self.pages[CREATE_BUFFERS].startup();

            self.pages[RUN_REPORTS] = new RunReportsPage({
              map: self.map,
              nls: self.nls,
              wizard: self,
              config: self.config,
              onBack: function () {
                if (self.selectedPoint.geometry) {
                  self._loadCreateBuffersPage();
                }
                else
                  self._loadSelectPointPolygonPage();
              }

            });


            self.loadPage(SELECT_POINT_POLYGON);

            // Listen to selection info window opening/closing, features being set, or feature selection changed
            self.own(on(self.map.infoWindow, "Show", function () {
              self._featureSelected();
            }));

            self.own(on(self.map.infoWindow, "Hide", function () {
              self._featureUnselected();
            }));

            self.own(on(self.map.infoWindow, "set-features", function () {
              self._featureSelected();
            }));

            self.own(on(self.map.infoWindow, "selection-change", function () {
              self._featureSelected();
            }));

            self.selectedCountryID = self.config.defaultCountryID;

            when(GEUtil.getAvailableCountries(), function (response) {
              self.availableCountries = response.countries;

              self.setSelectedCountry(self.selectedCountryID);
            });

            if (self.map.infoWindow && self.map.infoWindow.features && self.map.infoWindow.features.length > 0)
            self._featureSelected();
          }
        });

      },

      startup: function () {
        if (this._started) {
          return;
        }
      },

      // Clears the selected point trade Areas for the widget, and removes any trade area buffer graphics from the map
      clearSelectedPointBuffers: function () {
        var self = this;

        // Clear any trade area graphics from the map
        array.forEach(this.selectedPoint.tradeAreas, function (tradeArea) {
          if (tradeArea && tradeArea.graphic)
            self.map.graphics.remove(tradeArea.graphic);
        });

        this.selectedPoint.tradeAreas = [];
      },

      // Clears the selected polygon for the widget
      clearSelectedPoint: function () {
        this.clearSelectedPointBuffers();

        this.map.graphics.remove(this.selectedPoint.pointGraphic);

        // Reset selected point
        this.selectedPoint = {
          tradeAreas: []
        };
      },

      clearSelectedPolygon: function () {

        this.selectedPolygon = {};
      },

      // Call to set the selected country for the point or polygon, this will pre-load the Infographics/Report templates
      // for the selected country
      setSelectedCountry: function (countryCode) {
        var self = this;
        if (countryCode.length == 3) {
          array.forEach(this.availableCountries, function (country) {
            if (country.abbr3 == countryCode)
              self.selectedCountryID = country.id;
          });
        }
        else if (countryCode.length == 2)
          this.selectedCountryID = countryCode;
        else {
          // TODO: Error handling
        }

        this.pages[RUN_REPORTS].loadReportsInfographicsForCountry(this.selectedCountryID);
      },

      _loadSelectPointPolygonPage: function () {
        this.clearSelectedPoint();
        this.loadPage(SELECT_POINT_POLYGON);
      },

      _loadCreateBuffersPage: function () {
        this.loadPage(CREATE_BUFFERS);
        this.pages[CREATE_BUFFERS].refresh();
      },

      _loadRunReportsPage: function () {
        this.loadPage(RUN_REPORTS);
        this.pages[RUN_REPORTS].refresh();
      },

      // Refreshes the current page, sometimes the current page changed due to features being selected/unselected while the widget is closed
      // Called from Widget.js
      refreshPage: function () {
        this.currentPage && this.currentPage.refresh && this.currentPage.refresh();
      },

      _featureSelected: function () {
        // Clear any currently selected Point/Polygon
        this.clearSelectedPoint();
        this.clearSelectedPolygon();

        var self = this;

        var feature = this.map.infoWindow.selectedIndex > -1 && this.map.infoWindow.features && this.map.infoWindow.features[this.map.infoWindow.selectedIndex];

        if (!feature)
          return;

        // If this is a selected point, load Create Buffers Page
        if (feature.geometry.type == "point") {

          this.selectedPoint.geometry = feature.geometry;
          this.selectedPoint.locationName = this._getFeatureName(feature);

          var longLat = webMercatorUtils.xyToLngLat(feature.geometry.x, feature.geometry.y);
          this.selectedPoint.long = longLat[0].toFixed(5);
          this.selectedPoint.lat = longLat[1].toFixed(5);

          when(GeocodeUtil.reverseGeocode({ x: longLat[0], y: longLat[1] }), function (result) {
            self.setSelectedCountry(result.address.CountryCode); // Set country to be used for loading Reports/Infographics

            self._loadCreateBuffersPage();
          });
        }
        else if (feature.geometry.type == "polygon") {
          this.selectedPolygon.geometry = feature.geometry;
          this.selectedPolygon.locationName = this._getFeatureName(feature);
          this.selectedPolygon.feature = feature;

          var centroid = feature.geometry.getCentroid();
          var longLat = webMercatorUtils.xyToLngLat(centroid.x, centroid.y);

          // Reverse Geocode the centroid to get which country the polygon is in
          when(GeocodeUtil.reverseGeocode({ x: longLat[0], y: longLat[1] }), function (result) {
            self.setSelectedCountry(result.address.CountryCode); // Set country to be used for loading Reports/Infographics

            // If this is a selected polygon, load Run Reports Page
            self._loadRunReportsPage();
          });
        }
        else {
          self._loadSelectPointPolygonPage();
        }
      },

      _featureUnselected: function () {
        // Clear selected Point/Polygon
        this.clearSelectedPoint();
        this.clearSelectedPolygon();

        // Clear a possible search result
        this.pages["SELECT_POINT_POLYGON"].search.clear()

        // Load the Select Point Polygon page
        this._loadSelectPointPolygonPage();
      },

      _getFeatureName: function (feature) {
        if (feature.getTitle()) {
          return feature.getTitle();
        }
        else if (feature._layer.displayField && feature.attributes[feature._layer.displayField]) {
          return feature.attributes[feature._layer.displayField];
        }
        else {
          return "";
        }
      }

    });
  });
