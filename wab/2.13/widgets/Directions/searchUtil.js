///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
  'dojo/_base/array',
  'dojo/Deferred',
  'dojo/when',
  'dojo/promise/all',
  'jimu/portalUtils',
  'esri/lang',
  'esri/request',
  'jimu/utils',
  'esri/dijit/PopupTemplate',
  //"esri/geometry/Point",
  //"esri/SpatialReference",
  "esri/graphic",
  "esri/geometry/Extent"
], function (lang, array, Deferred, when, all, portalUtils, esriLang, esriRequest,
  jimuUtils, PopupTemplate,/* Point, SpatialReference,*/ Graphic, Extent) {
    var mo = {
      map: null,
      layerInfosObj: null,
      appConfig: null,
      _esriLocatorRegExp: /geocode(.){0,3}\.arcgis.com\/arcgis\/rest\/services\/World\/GeocodeServer/g
    };

    mo.setMap = function (map) {
      this.map = map;
    };

    mo.setLayerInfosObj = function (lobj) {
      this.layerInfosObj = lobj;
    };

    mo.setAppConfig = function (apc) {
      this.appConfig = apc;
    };

    mo.getConfigInfo = function (config) {
      if (config && config.sources && config.sources.length > 0) {
        var searchInfo = null;
        if (this.searchLayer(this.map) && config.upgradeFromGeocoder) {
          // back compatibility for config which come from geocoders
          searchInfo = this.map.itemInfo.itemData.applicationProperties.viewing.search;
          var defs = array.map(searchInfo.layers, lang.hitch(this, function (hintText, _layer) {
            _layer.hintText = hintText;
            return this._getQueryTypeGeocoder(_layer);
          }, searchInfo.hintText));
          return all(defs).then(lang.hitch(this, function (results) {
            config.sources = [].concat(results).concat(config.sources);
            return config;
          }));
        } else {
          return config;
        }
      } else {
        return when(this._getSoucesFromPortalAndWebmap())
          .then(lang.hitch(this, function (sources) {
            return {
              "allPlaceholder": "",
              "showInfoWindowOnSelect": true,
              "sources": sources
            };
          }));
      }
    };

    mo._getSoucesFromPortalAndWebmap = function () {
      var defs = [];
      var searchInfo = null;
      if (this.searchLayer(this.map)) {
        searchInfo = this.map.itemInfo.itemData.applicationProperties.viewing.search;
        array.forEach(searchInfo.layers, lang.hitch(this, function (hintText, _layer) {
          _layer.hintText = hintText;
          defs.push(this._getQueryTypeGeocoder(_layer));
        }, searchInfo.hintText));
      } // else do nothing

      return portalUtils.getPortalSelfInfo(this.appConfig.portalUrl)
        .then(lang.hitch(this, function (response) {
          var geocoders = response.helperServices && response.helperServices.geocode;

          if (geocoders && geocoders.length > 0) {
            for (var i = 0, len = geocoders.length; i < len; i++) {
              var geocoder = geocoders[i];
              if (geocoder) {
                defs.push(this._processSingleLine(geocoder));
              }
            }
          }

          return all(defs).then(lang.hitch(this, function (results) {
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
                  placeholder: "Find address or place" || geocode.placeholder ||
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

    mo._getQueryTypeGeocoder = function (item) {
      var layer = this.map.getLayer(item.id);
      var url = null;
      var _layerInfo = null;
      var _layerId = null;

      if (esriLang.isDefined(item.subLayer)) {
        _layerId = item.id + "_" + item.subLayer;
      } else {
        _layerId = item.id;
      }

      var isInMap = this.layerInfosObj.traversal(function (layerInfo) {
        if (layerInfo.id === _layerId) {
          _layerInfo = layerInfo;
          return true;
        }

        return false;
      });

      if (layer && isInMap && _layerInfo) {
        if (esriLang.isDefined(item.subLayer)) {
          url = _layerInfo.url || (layer.url + "/" + item.subLayer);
        } else {
          url = _layerInfo.url || layer.url;
        }

        return {
          name: _layerInfo.title,
          layerId: _layerId,
          url: url,
          placeholder: item.hintText,
          searchFields: [item.field.name],
          displayField: item.field.name,
          exactMatch: item.field.exactMatch || false,
          maxResults: 6,
          searchInCurrentMapExtent: false,
          type: "query"
        };
      } else {
        return null;
      }
    };

    mo._isEsriLocator = function (url) {
      this._esriLocatorRegExp.lastIndex = 0;
      return this._esriLocatorRegExp.test(url);
    };

    mo._processSingleLine = function (geocode) {
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
        }).then(lang.hitch(this, function (response) {
          if (response.singleLineAddressField && response.singleLineAddressField.name) {
            geocode.singleLineFieldName = response.singleLineAddressField.name;
            def.resolve(geocode);
          } else {
            console.warn(geocode.url + "has no singleLineFieldName");
            def.resolve(null);
          }
        }), lang.hitch(this, function (err) {
          console.error(err);
          def.resolve(null);
        }));

        return def.promise;
      }
    };

    mo._getGeocodeName = function (geocodeUrl) {
      if (typeof geocodeUrl !== "string") {
        return "geocoder";
      }
      var strs = geocodeUrl.split('/');
      return strs[strs.length - 2] || "geocoder";
    };

    mo.getGeocoderName = function (url) {
      return this._getGeocodeName(url);
    };

    mo.hasAppSearchInfo = function (map) {
      return map.itemInfo && map.itemInfo.itemData &&
        map.itemInfo.itemData.applicationProperties &&
        map.itemInfo.itemData.applicationProperties.viewing &&
        map.itemInfo.itemData.applicationProperties.viewing.search;
    };

    mo.searchLayer = function (map) {
      if (!this.hasAppSearchInfo(map)) {
        return false;
      }
      var search = map.itemInfo.itemData.applicationProperties.viewing.search;
      if (!search.enabled) {
        return false;
      }
      if (search.layers.length === 0) {
        return false;
      }

      return true;
    };

    mo.getSingleLineAddressName = function (url) {
      var def = new Deferred();
      esriRequest({
        url: url,
        content: {
          f: 'json'
        },
        handleAs: 'json',
        callbackParamName: 'callback'
      }).then(lang.hitch(this, function (response) {
        if (response &&
          response.singleLineAddressField &&
          response.singleLineAddressField.name) {

          def.resolve(response.singleLineAddressField.name);
        } else {
          def.resolve(null);//unsupport geocoding service < 10.1
        }
      }), lang.hitch(this, function (err) {
        console.error(err);
        def.reject();
      }));

      return def;
    };

    mo.version = {
      isConfigBefore63: function (config) {
        // 1.old: (config.geocoderOptions)
        // 2.upgrading: (config.geocoderOptions && config.searchOptions)
        // 3.new: (!config.geocoderOptions && config.searchOptions)
        var res = false;
        if (config) {
          if (config.geocoderOptions/* && !config.searchOptions*/) {
            res = true;
          }
        }

        return res;
      },
      upgradeConfig: function (config) {
        if (config.geocoderOptions) {
          delete config.geocoderOptions;
        }
      },
      getVersionState: function (/*config*/) {

      }
    };

    mo.config = {
      onLayerInfosFilterChanged: function (changedLayerInfos, config) {
        array.some(changedLayerInfos, lang.hitch(this, function (info) {
          if (config.searchOptions &&
            config.searchOptions.sources && config.searchOptions.sources.length > 0) {
            array.forEach(config.searchOptions.sources, function (s) {
              if (s._featureLayerId === info.id) {
                s.featureLayer.setDefinitionExpression(info.getFilter());//sync
              }
            });
          }
        }));
      },
      getInfoTemplate: function (fLayer, source, layerInfosObj) {
        var def = new Deferred();
        var layerInfo = layerInfosObj.getLayerInfoById(source.layerId);
        var template;
        //var template = layerInfo && layerInfo.getInfoTemplate();
        //var validTemplate = layerInfo && template;
        if (layerInfo) {
          def = layerInfo.loadInfoTemplate();
        } else { // (added by user in setting) or (only configured fieldInfo)
          /*
          template = new InfoTemplate();
          template.setTitle('&nbsp;');
          template.setContent(
            lang.hitch(this, '_formatContent', source.name, fLayer, source.displayField)
          );
          def.resolve(template);
          */
          var fieldNames = [];
          array.filter(fLayer.fields, function (field) {
            if (field.name.toLowerCase() !== "shape") {
              fieldNames.push(field.name);
            }
          });
          //var displayValue = graphic.attributes[source.displayField];
          var title = source.name + ": {" + source.displayField + "}";
          var popupInfo = jimuUtils.getDefaultPopupInfo(fLayer, title, fieldNames);
          if (popupInfo) {
            template = new PopupTemplate(popupInfo);
          }
          def.resolve(template);
        }
        return def;
      },
      getWayPoints: function (config, isOldConfig) {
        if (isOldConfig) {
          return config.defaultLocations;
        }

        var arr = [];
        for (var i = 0, len = config.defaultLocations.length; i < len; i++) {
          var geo, obj = config.defaultLocations[i];

          if ("object" === typeof obj && obj.feature && obj.name) {
            mo.config._toPointGeometry(obj);

            var attributes = {};
            attributes = obj.feature.attributes;
            if (obj.name) {
              attributes.Name = obj.name; //for DW display
            }

            geo = new Graphic(obj.feature, null, attributes); //new config
            arr.push(geo);
          } else if ("string" === typeof obj) {
            arr.push(obj);
          } else {
            arr.push("");
          }
        }

        return arr;
      },
      //mothod from Direction._toPointGeometry
      _toPointGeometry: function (searchRes) {
        var g = searchRes.feature.geometry;
        if (g) {
          if (g.getCentroid) {
            //returned feature is a Circle or Polygon
            searchRes.feature.geometry = g.getCentroid();
          } else if (g.getExtent) {
            //returned feature is a Multipoint, or Polyline, or (!!!) a Point
            var ext = g.getExtent();
            if (ext) {
              //Point also has undocumented getExtent method which always returns null.
              // Instead of loading all the routines like Circle, Polyline, Polygon, Multipoint for the
              // instanceof detection, we just check here for a non empty extent returned, and
              // if it's null we just assume it's a Point we are dealing with and thus doing no
              // modifications.
              searchRes.feature.geometry = ext.getCenter();
            }
          } else if (!g.x && !g.y) {
            var cache = g.cache._extent;
            //var ext = new Extent(JSON.stringify(g.cache._extent))
            if ("undefined" !== typeof cache.xmin && "undefined" !== typeof cache.ymin &&
              "undefined" !== typeof cache.xmax && "undefined" !== typeof cache.ymax &&
              "undefined" !== typeof cache.spatialReference) {
              var extent = new Extent(cache.xmin, cache.ymin, cache.xmax, cache.ymax, cache.spatialReference);
              searchRes.feature.geometry = extent.getCenter();
            }
          }
        }
        return searchRes;
      }
    };

    return mo;
  });
