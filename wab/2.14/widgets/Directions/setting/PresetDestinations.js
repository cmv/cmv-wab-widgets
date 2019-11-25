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
  'dojo/_base/declare',
  "dojo/_base/lang",
  'dojo/on',
  'dojo/_base/html',
  'dojo/query',
  //'dojo/keys',
  'esri/lang',
  'dojo/Deferred',
  //'./ColorPickerEditor',
  'esri/tasks/locator',
  'jimu/utils',
  "../searchUtil",
  'jimu/LayerInfos/LayerInfos',
  'dojo/when',
  'dojo/promise/all',
  'dojo/_base/array',
  'esri/layers/FeatureLayer',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./PresetDestinations.html',
  'esri/dijit/Search',
  'jimu/dijit/RadioBtn'
],
  function (declare, lang, on, html, query, /*keys,*/esriLang, Deferred,
    Locator, jimuUtils, searchUtils, LayerInfos, when, all, array, FeatureLayer,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Search) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      templateString: template,
      _defaultLocations: null,
      _startSearchResults: null,
      _endSearchResults: null,
      _isSearchResultsShown: false,

      _ERROR_CLASS: "have-error",

      constructor: function (options) {
        if (!options) {
          return;
        }

        this._defaultLocations = [];//options.defaultLocations;
        this._defaultLocations = this._parseDefaultLocations(options.defaultLocations);

        this.nls = options.nls;
      },

      postCreate: function () {
        this.inherited(arguments);
      },
      startup: function () {
        this._getLayerInfos().then(lang.hitch(this, function () {

          this.startSearch = new Search({
            enableSuggestions: false,
            enableButtonMode: false,
            theme: 'arcgisSearch'
          });
          this.startSearch.placeAt(this.startSearchDom);
          this.own(on(this.startSearch, 'search-results', lang.hitch(this, '_onStartSearchResults')));
          this.own(on(this.startSearchResultsNode, 'li:click', lang.hitch(this, '_onSelectStartSearchResult')));
          this.own(on(this.startSearch.inputNode, "focus", lang.hitch(this, '_onCleanStartError')));
          this.own(on(this.startSearch.inputNode, "blur", lang.hitch(this, function () {
            if (false === this._isSearchResultsShown && this.startSearch && this.startSearch.search) {
              this.startSearch.search();
            }
          })));
          //this.own(on(this.startSearch, "select-result", lang.hitch(this, '_onStartSearchSelect')));

          this.endSearch = new Search({
            enableSuggestions: false,
            enableButtonMode: false,
            theme: 'arcgisSearch'
          });
          this.endSearch.placeAt(this.endSearchDom);
          this.own(on(this.endSearch, 'search-results', lang.hitch(this, '_onEndSearchResults')));
          this.own(on(this.endSearchResultsNode, 'li:click', lang.hitch(this, '_onSelectEndSearchResult')));
          this.own(on(this.endSearch.inputNode, "focus", lang.hitch(this, '_onCleanEndError')));
          this.own(on(this.endSearch.inputNode, "blur", lang.hitch(this, function () {
            if (false === this._isSearchResultsShown && this.endSearch && this.endSearch.search) {
              this.endSearch.search();
            }
          })));
          //this.own(on(this.endSearch, "select-result", lang.hitch(this, '_onEndSearchSelect')));


          this.own(
            on(window.document, 'click', lang.hitch(this, function (e) {
              if (!html.isDescendant(e.target, this.searchResultsNode)) {
                this._hideResultMenu();
              }
            }))
          );

          //set values
          if (this._defaultLocations && this._defaultLocations.length && this._defaultLocations.length > 0) {
            for (var i = 0, len = this._defaultLocations.length; i < len; i++) {
              if (0 === i) {
                this._setSearchValue(this.startSearch, this._defaultLocations[i]);
              } else if (1 === i) {
                this._setSearchValue(this.endSearch, this._defaultLocations[i]);
              }
            }
          }

        }));
        this.inherited(arguments);
      },

      _setSearchValue: function (searchDijit, value) {
        if ("string" === typeof value) {
          searchDijit.set('value', value);//old config
        } else if (value.name) {
          //new config
          searchDijit.set("selectedResult", value);
          searchDijit.set('value', value.name);
        }
        //searchDijit.search(value);
      },

      getValue: function () {
        var locations = [];

        var startValue = this._getSearchRest(this.startSearch, this._defaultLocations[0]);
        locations.push(startValue);

        var endValue = this._getSearchRest(this.endSearch, this._defaultLocations[1]);
        locations.push(endValue);

        return locations;
      },

      _getSearchRest: function (searchDijit, lastConfig) {
        var res = searchDijit.selectedResult;
        if (res) {
          //1.select a suggestion
          if (res.feature) { //clean references
            if (res.feature._layer) {
              res.feature._layer = "";
            }
            if (res.feature._sourceLayer) {
              res.feature._sourceLayer = "";
            }
          }
        } else {
          //2.no select
          if (!searchDijit.value) {
            return "";
          } else {
            var isChanged = false;
            if ("string" === typeof lastConfig) {
              isChanged = (lastConfig !== searchDijit.value); //old config
            } else if (lastConfig.name) {
              isChanged = (lastConfig.name !== searchDijit.value); //new config
            }

            if (isChanged) {
              res = searchDijit.value;//use new value
            } else {
              res = lastConfig;//keep config
            }
          }
        }

        return res;
      },
      _parseDefaultLocations: function (defaultLocations) {
        var res = [];
        for (var i = 0, len = defaultLocations.length; i < len; i++) {
          res.push(defaultLocations[i]);
        }

        return res;
      },

      setValue: function (defaultLocations) {
        if (defaultLocations && defaultLocations.length > 0) {
          this._defaultLocations = [];
          this._defaultLocations = this._parseDefaultLocations(defaultLocations);
        }
      },
      validate: function () {
        var isSearchLoading = false;
        query(".searchLoading", this.domNode).forEach(lang.hitch(this, function () {
          isSearchLoading = true;
          return;
        }));

        if (false === isSearchLoading &&
          !html.hasClass(this.startSearch, this._ERROR_CLASS) &&
          !html.hasClass(this.endSearch, this._ERROR_CLASS)) {
          return true;
        } else {
          return false;
        }
      },

      //source.singleLineFieldName is necessary, or can't get results
      //(online can't get results without singleLineFieldName)
      setSources: function (sources) {
        if (sources && sources.sources && sources.sources.length) {
          this.shelter.show();
          //new config
          when(searchUtils.getConfigInfo(sources)).then(lang.hitch(this, function (config) {
            return all(this._convertConfig(config)).then(function (searchSouces) {
              return array.filter(searchSouces, function (source) {
                return source;
              });
            });
          })).then(lang.hitch(this, function (searchSouces) {
            this.startSearch.set("sources", searchSouces);
            this.endSearch.set("sources", searchSouces);

            this.shelter.hide();
          }));
        } else if (source && source.url && source.singleLineFieldName) {
          //old config
          var source = {
            locator: new Locator(source.url || ""),
            outFields: ["*"],
            singleLineFieldName: source.singleLineFieldName
          };
          this.startSearch.set("sources", [source]);
          this.endSearch.set("sources", [source]);
        } else {
          this.startSearch.set("sources", []);
          this.endSearch.set("sources", []);
        }
      },

      _onCleanError: function (searchDijit) {
        html.removeClass(searchDijit, this._ERROR_CLASS);
      },
      _onCleanStartError: function () {
        this._onCleanError(this.startSearch);
      },
      _onCleanEndError: function () {
        this._onCleanError(this.endSearch);
      },

      _onStartSearchResults: function (evt) {
        this._onSearchResults(evt, {
          searchDijit: this.startSearch,
          searchResultsNode: this.startSearchResultsNode,
          searchError: this.startSearchError,
          results: "start"
        });
      },
      _onEndSearchResults: function (evt) {
        this._onSearchResults(evt, {
          searchDijit: this.endSearch,
          searchResultsNode: this.endSearchResultsNode,
          searchError: this.endSearchError,
          results: "end"
        });
      },
      _onSearchResults: function (evt, option) {
        var sources = option.searchDijit.get('sources');
        var activeSourceIndex = option.searchDijit.get('activeSourceIndex');
        var value = option.searchDijit.get('value');
        var htmlContent = "";
        var results = evt.results;
        var _activeSourceNumber = null;

        //allow blank value
        if ("" === value) {
          return;
        }

        if (results && evt.numResults > 0) {
          if ("start" === option.results) {
            this._startSearchResults = results;
          } else if ("end" === option.results) {
            this._endSearchResults = results;
          }
          //htmlContent += '<div class="show-all-results jimu-ellipsis" title="' +
          //  this.nls.showAll + '">' +
          // this.nls.showAllResults + '<strong >' + value + '</strong></div>';
          htmlContent += '<div class="searchMenu searchResultsMenu" role="menu">';
          for (var i in results) {
            if (results[i] && results[i].length) {
              var name = sources[parseInt(i, 10)].name;
              if (sources.length > 1 && activeSourceIndex === 'all') {
                htmlContent += '<div title="' + name + '" class="menuHeader">' + name + '</div>';
              }
              htmlContent += "<ul>";
              var partialMatch = value;
              var r = new RegExp("(" + partialMatch + ")", "gi");
              var maxResults = sources[i].maxResults || 5;

              for (var j = 0, len = results[i].length; j < len && j < maxResults; j++) {
                var text = esriLang.isDefined(results[i][j].name) ?
                  results[i][j].name : this.nls.untitled;
                htmlContent += '<li title="' + text + '" data-index="' + j +
                  '" data-source-index="' + i + '" role="menuitem" tabindex="0">' +
                  text.toString().replace(r, "<strong >$1</strong>") + '</li>';
              }
              htmlContent += '</url>';

              if (evt.numResults === 1) {
                _activeSourceNumber = i;
              }
            }
          }
          htmlContent += "</div>";
          option.searchResultsNode.innerHTML = htmlContent;

          this._showResultMenu(option.searchDijit, option.searchResultsNode);
          this._resetSelectorPosition(option.searchDijit, '.searchResultsMenu');
        } else {
          html.addClass(option.searchDijit, this._ERROR_CLASS);
          this._resetSelectorPosition(option.searchDijit, '.noResultsMenu');
        }
      },

      // _onStartSearchSelect: function(evt){
      //   var sourceIndex = evt;
      // },
      // //
      // _onEndSearchSelect: function(evt){
      //   var sourceIndex = evt;
      // },
      _onSelectStartSearchResult: function (evt) {
        this._onSelectSearchResult(evt, this.startSearch, this._startSearchResults);
      },
      _onSelectEndSearchResult: function (evt) {
        this._onSelectSearchResult(evt, this.endSearch, this._endSearchResults);
      },

      _onSelectSearchResult: function (evt, searchDijit, _results) {
        var target = evt.target;
        while (!(html.hasAttr(target, 'data-source-index') && html.getAttr(target, 'data-index'))) {
          target = target.parentNode;
        }
        var result = null;
        var dataSourceIndex = html.getAttr(target, 'data-source-index');
        var dataIndex = parseInt(html.getAttr(target, 'data-index'), 10);
        // var sources = this.searchDijit.get('sources');
        if (dataSourceIndex !== 'all') {
          dataSourceIndex = parseInt(dataSourceIndex, 10);
        }
        if (_results && _results[dataSourceIndex] &&
          _results[dataSourceIndex][dataIndex]) {
          result = _results[dataSourceIndex][dataIndex];
          searchDijit.select(result);

          if (result.name) {
            searchDijit.set("value", result.name);

            //var sources = searchDijit.sources[dataSourceIndex];
          }
        }
      },

      _showResultMenu: function (searchDijit, searchResultsNode) {
        html.setStyle(searchResultsNode, 'display', 'block');
        //query('.show-all-results', searchResultsNode).style('display', 'none');
        query('.searchMenu', searchResultsNode).style('display', 'block');
        this._isSearchResultsShown = true;

        var groupNode = query('.searchInputGroup', searchDijit.domNode)[0];
        if (groupNode) {
          var groupBox = html.getMarginBox(groupNode);
          var style = {
            width: groupBox.w + 'px'
          };
          query('.searchMenu', searchResultsNode).style(style);
        }
      },
      _resetSelectorPosition: function (searchDijit, cls) {
        var layoutBox = html.getMarginBox(this.domNode.offsetParent);
        query(cls, this.domNode).forEach(lang.hitch(this, function (menu) {
          var menuPosition = html.position(menu);
          var dijitPosition = html.position(searchDijit.domNode);

          var fixH = (cls === ".noResultsMenu" ? 0 : dijitPosition.h);
          var turnUp = menuPosition.y + menuPosition.h > layoutBox.h;
          if (turnUp) {
            html.setStyle(
              menu,
              'top',
              -(menuPosition.h + fixH) - 4 + 'px'
            );
          }
        }));
      },
      _hideResultMenu: function () {
        query('.searchMenu', this.domNode).style('display', 'none');
        this._isSearchResultsShown = false;
      },
      /*************************************************/
      _getLayerInfos: function () {
        var def = new Deferred();
        LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function (layerInfosObj) {
            this.layerInfosObj = layerInfosObj;
            this.own(this.layerInfosObj.on(
              'layerInfosFilterChanged',
              lang.hitch(this, function (res) {
                searchUtils.config.onLayerInfosFilterChanged(res, this.config);
              }
              )));

            def.resolve();
          }));

        return def;
      },
      _convertConfig: function (config) {
        var sourceDefs = array.map(config.sources, lang.hitch(this, function (source) {
          var def = new Deferred();
          if (source && source.url && source.type === 'locator') {
            var _source = {
              locator: new Locator(source.url || ""),
              outFields: ["*"],
              singleLineFieldName: source.singleLineFieldName || "",
              name: jimuUtils.stripHTML(source.name || ""),
              placeholder: jimuUtils.stripHTML(source.placeholder || ""),
              countryCode: source.countryCode || "",
              maxSuggestions: source.maxSuggestions,
              //maxResults: source.maxResults || 6,
              //zoomScale: source.zoomScale || 50000,
              useMapExtent: !!source.searchInCurrentMapExtent
              //_zoomScaleOfConfigSource: source.zoomScale
            };

            if (source.enableLocalSearch) {
              _source.localSearchOptions = {
                minScale: source.localSearchMinScale,
                distance: source.localSearchDistance
              };
            }

            if (source.zoomScale) {
              _source.autoNavigate = false;
            }

            def.resolve(_source);
          } else if (source && source.url && source.type === 'query') {
            var searchLayer = new FeatureLayer(source.url || null, {
              outFields: ["*"]
            });

            this.own(on(searchLayer, 'load', lang.hitch(this, function (result) {
              var flayer = result.layer;

              // identify the data source
              var sourceLayer = this.map.getLayer(source.layerId);
              var sourceLayerInfo = this.layerInfosObj.getLayerInfoById(source.layerId);
              var showInfoWindowOnSelect;
              var enableInfoWindow;
              if (sourceLayer) {
                // pure feature service layer defined in the map
                showInfoWindowOnSelect = false;
                enableInfoWindow = false;
              } else if (sourceLayerInfo) {
                // feature service layer defined in the map
                showInfoWindowOnSelect = false;
                enableInfoWindow = false;
              } else {
                // data source from the outside
                // showInfoWindowOnSelect = esriLang.isDefined(_showInfoWindowOnSelect) ?
                //   !!_showInfoWindowOnSelect : true;
                showInfoWindowOnSelect = false;//this item have deleted in setting page, for ver 7.2
                enableInfoWindow = true;
              }

              var fNames = null;
              if (source.searchFields && source.searchFields.length > 0) {
                fNames = source.searchFields;
              } else {
                fNames = [];
                array.forEach(flayer.fields, function (field) {
                  if (field.type !== "esriFieldTypeOID" && field.name !== flayer.objectIdField &&
                    field.type !== "esriFieldTypeGeometry") {
                    fNames.push(field.name);
                  }
                });
              }

              var convertedSource = {
                featureLayer: flayer,
                outFields: ["*"],
                searchFields: fNames,
                autoNavigate: false,
                displayField: source.displayField || "",
                exactMatch: !!source.exactMatch,
                name: jimuUtils.stripHTML(source.name || ""),
                placeholder: jimuUtils.stripHTML(source.placeholder || ""),
                maxSuggestions: source.maxSuggestions || 6,
                //maxResults: source.maxResults || 6,
                //zoomScale: source.zoomScale || 50000,
                //infoTemplate: lang.clone(template),
                useMapExtent: !!source.searchInCurrentMapExtent,
                showInfoWindowOnSelect: showInfoWindowOnSelect,
                enableInfoWindow: enableInfoWindow,
                _featureLayerId: source.layerId
                //_zoomScaleOfConfigSource: source.zoomScale
              };
              /*
              if (!template) {
                delete convertedSource.infoTemplate;
              }
              */
              if (convertedSource._featureLayerId) {
                var layerInfo = this.layerInfosObj
                  .getLayerInfoById(convertedSource._featureLayerId);
                if (layerInfo) {
                  flayer.setDefinitionExpression(layerInfo.getFilter());
                }
              }

              //var template = this._getInfoTemplate(flayer, source, source.displayField);
              searchUtils.config.getInfoTemplate(flayer, source, this.layerInfosObj).then(
                lang.hitch(this, function (infoTemplate) {
                  convertedSource.infoTemplate = lang.clone(infoTemplate);
                  def.resolve(convertedSource);
                }), lang.hitch(this, function () {
                  def.resolve(convertedSource);
                }));
            })));

            this.own(on(searchLayer, 'error', function () {
              def.resolve(null);
            }));
          } else {
            def.resolve(null);
          }
          return def;
        }));

        return sourceDefs;
      }
    });
  });