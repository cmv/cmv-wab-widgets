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
  'dojo/_base/lang',
  'dojo/Deferred',
  'dojo/when',
  'dojo/promise/all',
  'jimu/portalUtils',
  'esri/request'
], function (lang, Deferred, when, all, portalUtils, esriRequest) {

  var mo = {
    map: null,
    layerInfosObj: null,
    appConfig: null,
    _esriLocatorRegExp: /geocode(.){0,3}\.arcgis.com\/arcgis\/rest\/services\/World\/GeocodeServer/g
  };

  mo.setMap = function(map) {
    this.map = map;
  };

  mo.setAppConfig = function(apc) {
    this.appConfig = apc;
  };

  mo.setDefaultXYFields = function (xyFields) {
    this.defaultXYFields = xyFields;
  };

  mo.getConfigInfo = function(config) {
    if (config && config.sources && config.sources.length > 0) {
      return config;
    } else {
      return when(this._getSoucesFromPortalAndWebmap())
        .then(lang.hitch(this, function(sources) {
          return {
            "allPlaceholder": "",
            "showInfoWindowOnSelect": true,
            "sources": sources
          };
        }));
    }
  };

  mo._getSoucesFromPortalAndWebmap = function() {
    var defs = [];
    return portalUtils.getPortalSelfInfo(this.appConfig.portalUrl)
      .then(lang.hitch(this, function(response) {
        var geocoders = response.helperServices && response.helperServices.geocode;

        if (geocoders && geocoders.length > 0) {
          for (var i = 0, len = geocoders.length; i < len; i++) {
            var geocoder = geocoders[i];
            if (geocoder) {
              defs.push(this._processSingleLine(geocoder));
            }
          }
        }

        return all(defs).then(lang.hitch(this, function(results) {
          var validSources = [];
          for (var i = 0; i < results.length; i++) {
            var geocode = results[i];
            if (!geocode) {
              continue;
            } else if (geocode && geocode.type === 'query') {
              validSources.push(geocode);
            } else {
              var json = {
                name: geocode.name || this._getGeocodeName(geocode.url),
                url: geocode.url,
                singleLineFieldName: geocode.singleLineFieldName,
                placeholder: geocode.placeholder ||
                  geocode.name || this._getGeocodeName(geocode.url),
                maxResults: 6,
                searchInCurrentMapExtent: false,
                type: "locator"
              };
              json.enableLocalSearch = this._isEsriLocator(json.url);
              json.localSearchMinScale = 300000;
              json.localSearchDistance = 50000;

              validSources.push(json);
            }
          }

          return validSources;
        }));
      }));
  };

  mo._isEsriLocator = function(url) {
    this._esriLocatorRegExp.lastIndex = 0;
    return this._esriLocatorRegExp.test(url);
  };

  mo._processSingleLine = function(geocode) {
    // this._esriLocatorRegExp.lastIndex = 0;
    if (geocode.singleLineFieldName) {
      return geocode;
    } else if (this._isEsriLocator(geocode.url)) {
      geocode.singleLineFieldName = 'SingleLine';
      return geocode;
    } else {
      var def = new Deferred();
      esriRequest({
        url: geocode.url,
        content: {
          f: "json"
        },
        handleAs: "json",
        callbackParamName: "callback"
      }).then(lang.hitch(this, function(response) {
        if (response.singleLineAddressField && response.singleLineAddressField.name) {
          geocode.singleLineFieldName = response.singleLineAddressField.name;
          def.resolve(geocode);
        } else {
          console.warn(geocode.url + "has no singleLineFieldName");
          def.resolve(null);
        }
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.resolve(null);
      }));

      return def.promise;
    }
  };

  mo._getGeocodeName = function(geocodeUrl) {
    if (typeof geocodeUrl !== "string") {
      return "geocoder";
    }
    var strs = geocodeUrl.split('/');
    return strs[strs.length - 2] || "geocoder";
  };

  mo.getGeocoderName = function(url) {
    return this._getGeocodeName(url);
  };

  mo.hasAppSearchInfo = function (map) {
    return map.itemInfo && map.itemInfo.itemData &&
      map.itemInfo.itemData.applicationProperties &&
      map.itemInfo.itemData.applicationProperties.viewing &&
      map.itemInfo.itemData.applicationProperties.viewing.search;
  };

  return mo;
});