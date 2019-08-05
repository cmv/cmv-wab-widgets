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
  "dojo/dom-class",
  "dojo/on",
  "dojo/when",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetBase",

  "esri/dijit/Search",
  "esri/dijit/geoenrichment/_WizardPage",
  "esri/geometry/webMercatorUtils",
  "esri/graphic",
  "esri/symbols/PictureMarkerSymbol",

  "dojo/text!./SelectPointPolygonPage.html",

  "./utils/GeocodeUtil"
],
  function (declare, domClass, on, when, _TemplatedMixin, _WidgetBase, Search, _WizardPage, webMercatorUtils, Graphic, PictureMarkerSymbol, template, GeocodeUtil) {
    return declare([_WidgetBase, _TemplatedMixin, _WizardPage], {

      templateString: template,

      postCreate: function () {
        this.inherited(arguments);
        var self = this;

        this.search = new Search({
          map: this.map,
        }).placeAt(this.searchContainer);

        // Add country to the output, so we can determine what country the location is in
        this.search.activeSource.outFields.push("country");

        this.own(on(this.search, "select-result", function () {
          self._loadSearchResult();
        }));

        this.own(on(this.activatePinButton, "click", function () {
          self._onActivatePinButtonClick();
        }));
      },

      startup: function () {

        if (this._started) {
          return;
        }

        // Need to add overflow:visible to this element so the search box suggestion drop down will display
        // past the widget box
        domClass.add(this.layoutGrid.domNode, "business-analyst-search-suggestions-overflow");
      },

      _loadSearchResult: function () {
        this.wizard.selectedPoint.geometry = this.search.selectedResult.feature.geometry;
        this.wizard.selectedPoint.locationName = this.search.selectedResult.name;

        var longLat = webMercatorUtils.xyToLngLat(this.search.selectedResult.feature.geometry.x, this.search.selectedResult.feature.geometry.y);
        this.wizard.selectedPoint.long = longLat[0].toFixed(5);
        this.wizard.selectedPoint.lat = longLat[1].toFixed(5);

        this.wizard.setSelectedCountry(this.search.selectedResult.feature.attributes.country);

        this.onNext();
      },

      _onActivatePinButtonClick: function () {
        if (this._executeHandler)
          this._deactivate();
        else
          this._setActive();
      },

      _setActive: function () {
        if (this._executeHandler)
          return;

        domClass.add(this.activatePinButton, "esriBusinessAnalystPinPressedButton");

        this.map.setMapCursor("default");
        this.map.disablePan();

        this._executeHandler = on(this.map, "click", this._addPoint.bind(this));
      },

      _deactivate: function () {
        if (!this._executeHandler)
          return;

        domClass.remove(this.activatePinButton, "esriBusinessAnalystPinPressedButton");

        this.map.enablePan();
        this._executeHandler.remove();
        this._executeHandler = null;
      },

      _addPoint: function (evt) {
        if (!this._executeHandler)
          return;

        this._deactivate();

        var longLat = webMercatorUtils.xyToLngLat(evt.mapPoint.x, evt.mapPoint.y);
        var self = this;

        when(GeocodeUtil.reverseGeocode({ x: longLat[0], y: longLat[1] }), function (result) {
          // Add point to map and geocode location
          // TODO: Pull symbol from config
          var symbol = new PictureMarkerSymbol("https://js.arcgis.com/3.28/esri/dijit/Search/images/search-pointer.png", 36, 36);
          self.wizard.selectedPoint.pointGraphic = new Graphic(evt.mapPoint, symbol);
          self.map.graphics.add(self.wizard.selectedPoint.pointGraphic);
          self.map.centerAndZoom(evt.mapPoint, 12);

          self.wizard.selectedPoint.geometry = evt.mapPoint;
          self.wizard.selectedPoint.locationName = result && result.address && result.address.LongLabel ? result.address.LongLabel : ""; // Use geocoded address

          self.wizard.setSelectedCountry(result.address.CountryCode); // Set country to be used for loading Reports/Infographics

          self.wizard.selectedPoint.long = longLat[0].toFixed(5);
          self.wizard.selectedPoint.lat = longLat[1].toFixed(5);
          self.onNext();
        });
      }

    });
  });
