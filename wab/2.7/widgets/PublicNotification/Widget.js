/* jshint unused:true */
/*
 | Copyright 2017 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define([
  'dojo/_base/declare',
  'dojo/_base/array',
  'dojo/_base/Color',
  'dojo/_base/lang',
  'dojo/dom',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/dom-geometry',
  'dojo/dom-style',
  'dojo/Evented',
  'dojo/keys',
  'dojo/on',
  'dojo/string',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/ProgressBar',
  'esri/geometry/geometryEngineAsync',
  'esri/graphic',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/tasks/BufferParameters',
  'esri/tasks/GeometryService',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'esri/tasks/RelationshipQuery',
  'jimu/dijit/DrawBox',
  'jimu/dijit/SearchDistance',
  'jimu/BaseWidget',
  'jimu/LayerInfos/LayerInfos',
  './Download_Avery',
  './Download_CSV',
  './labelFormatUtils',
  './Queryer',
  './SearchLayers',
  'dojo/domReady!'
  ], function (
    declare,
    array,
    Color,
    lang,
    dom,
    domClass,
    domConstruct,
    domGeom,
    domStyle,
    Evented,
    keys,
    on,
    string,
    _WidgetsInTemplateMixin,
    ProgressBar,
    geometryEngineAsync,
    Graphic,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    BufferParameters,
    GeometryService,
    Query,
    QueryTask,
    RelationshipQuery,
    DrawBox,
    SearchDistance,
    BaseWidget,
    LayerInfos,
    Download_Avery,
    Download_CSV,
    labelFormatUtils,
    Queryer,
    SearchLayers
  ) {
    return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'jimu-widget-public-notification',

      _origin: undefined,
      _bufferDistanceMeters: 0,
      _drawBoxOption: {},
      _formatCodeHandlers: {
        'AVERY': './Download_Avery',
        'CSV': './Download_CSV'
      },
      _formatCodeHandlerInstances: {
        'AVERY': null,
        'CSV': null
      },

      _bufferGeometry: null,
      _foundAddressees: [],


      _outlineFillColor: new Color([0, 255, 255, 0]),
      _fillHiliteColor: new Color([0, 255, 255, 0.1]),
      _lineHiliteColor: new Color("aqua"),
      _addresseeSources: [],

      //========== jimu/BaseWidget overrides ==========

      postMixInProperties: function () {
        //mixin default nls with widget nls
        this.nls.common = {};
        lang.mixin(this.nls.common, window.jimuNls.common);
      },

      postCreate: function () {
        this.inherited(arguments);

        // Polyfill isNaN for IE11
        // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
        Number.isNaN = Number.isNaN || function (value) {
          return value !== value;
        };

        this._checkDownloadBtnEnable();
      },

      startup: function () {
        this.inherited(arguments);

        this._init();
      },

      //========== jimu/BaseWidget implementations ==========

      onOpen: function () {
        // summary:
        //    this function will be called when widget is opened everytime.
        // description:
        //    state has been changed to "opened" when call this method.
        //    this function will be called in two cases:
        //      1. after widget's startup
        //      2. if widget is closed, use re-open the widget
        if (this._searchComponent) {
          this._searchComponent.setFocus();
        }
      },

      onClose: function () {
        // summary:
        //    this function will be called when widget is closed.
        // description:
        //    state has been changed to "closed" when call this method.
        if (this._queryer) {
          this._queryer.clearBufferGraphics();
        }
        if (this._drawBox) {
          this._drawBox.clear();
        }
      },

      destroy: function () {
        if (this._drawBox) {
          this._drawBox.destroyRecursive();
          this._drawBox = null;
        }

        this.inherited(arguments);
      },

      //========== Custom content ==========

      _init: function () {
        var flags, drawTools, labelFormats, drawToolsChildren, updatedDrawToolsChildren = [];

        // Handy symbols for showing selections and buffers
        this._redSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.65]), 2),
          new Color([255, 0, 0, 0.35]));
        this._greenSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0, 0.65]), 2),
          new Color([0, 255, 0, 0.35]));
        this._blueSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255, 0.65]), 2),
          new Color([0, 0, 255, 0.35]));
        this._graySymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([127, 127, 127, 0.65]), 2),
          new Color([0, 0, 255, 0.35]));

        // Search and addressee layers
        LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function (layerInfosObj) {
            var searchOptions = lang.clone(this.config.searchSourceSettings.search);

            // Search for features by name
            searchOptions.map = this.map;
            this._searchComponent = new SearchLayers(searchOptions,
              this.appConfig.portalUrl, layerInfosObj, domConstruct.create('div', null, this.searchNode));

            this._searchComponent.searchDijit().then(lang.hitch(this, function (searchDijit) {
              this._searchDijit = searchDijit;
              this.own(on(searchDijit, 'search-results', lang.hitch(this, this._onSearchResults)));
              this.own(on(searchDijit, 'clear-search', lang.hitch(this, this._onClearSearch)));
            }));

            // Filter out any addressee layers not selected to be visible
            flags = this.config.addresseeSourceSettings.sources[0];
            this._addresseeSources =
              array.filter(this.config.addresseeSourceSettings.sources.slice(1), function (source, i) {
                return flags[i] === '1';
              });

            // Amend the addressee source descriptions by using the layer popups as the label definitions
            array.forEach(this._addresseeSources, function (addresseeSource, i) {
              array.some(layerInfosObj._operLayers, function(operLayer) {
                if (addresseeSource.name === operLayer.title &&
                  operLayer.popupInfo && operLayer.popupInfo.description) {
                  addresseeSource.labelSpec =
                    labelFormatUtils.convertPopupToLabelSpec(operLayer.popupInfo.description);
                  addresseeSource.url = operLayer.url;
                  if (addresseeSource.useRelatedRecords) {
                    addresseeSource.labelSpec.relationships = this._createRelationshipQueries(operLayer);
                  }

                  this.addresseeSelect.addOption({
                    value: i,
                    label: addresseeSource.name
                  });
                  return true;
                }
                return false;
              }, this);
            }, this);
          })
        );

        if (this.addresseeSelect.options.length > 0) {
          domStyle.set('activeWidgetSection', 'display', '');
          this.own(this.addresseeSelect.on('change', lang.hitch(this, this._updateAddresseesFromBufferGeometry)));
        } else {
          domStyle.set('nothingConfiguredSection', 'display', 'block');
          return;
        }

        // Select by drawing tools
        flags = this.config.searchSourceSettings.drawing.tools[0];
        drawTools = array.filter(this.config.searchSourceSettings.drawing.tools.slice(1), function (tool, i) {
          return flags[i] === '1';
        });

        if (drawTools.length > 0) {
          // Search for features by map drawing
          this._drawBoxOption.map = this.map;
          this._drawBoxOption.geoTypes = drawTools;
          this._drawBoxOption.showClear = true;
          this._drawBoxOption.keepOneGraphic = true;
          this._drawBox = new DrawBox(this._drawBoxOption);

          // Reorder options to match configuration
          drawToolsChildren = this._drawBox.domNode.childNodes[1].children;
          array.forEach(drawTools, function (toolName) {
            array.some(drawToolsChildren, function (toolDom) {
              // We have a match if the DOM item has a matching geotype
              if (toolDom.attributes["data-geotype"].nodeValue === toolName) {
                updatedDrawToolsChildren.push(toolDom);
                return true;
              }
              return false;
            });
          });
          updatedDrawToolsChildren.push(drawToolsChildren[drawToolsChildren.length - 1]);  // add the clear button
          this._replaceChildren(this._drawBox.domNode.childNodes[1], updatedDrawToolsChildren);
          this._drawBox.placeAt(this.drawBoxDiv);

          this.own(this._drawBox.on('icon-selected', lang.hitch(this, this._onDrawIconSelected)));
          this.own(this._drawBox.on('draw-end', lang.hitch(this, this._onDrawEnd)));
          this.own(this._drawBox.on('clear', lang.hitch(this, this._onDrawClear)));
          this.own(this._drawBox.on('user-clear', lang.hitch(this, this._onDrawClear)));
        }

        // Buffered query tool
        this._queryer = new Queryer(this.map, this.config.searchSourceSettings.geometryServiceURL);

        // Size of buffer around searched or drawn features
        this._createSearchDistanceDisplay();

        // "Format" option
        flags = this.config.notificationSettings.labelFormats[0];
        labelFormats = array.filter(this.config.notificationSettings.labelFormats.slice(1),
          lang.hitch(this, function (format, i) {
            var keep = flags[i] === '1';
            if (keep) {
              this.formatSelect.addOption({
                value: i,
                label: '<span' + (format.hint ? ' title="' + format.hint + '"' : '') + '>' + format.name +  '</span>'
              });
            }
            return keep;
          }));

        // Text for download button
        this.downloadBtn.innerHTML = window.jimuNls.layerInfosMenu.itemDownload;

        this.resize();
      },

      _createSearchDistanceDisplay: function (searchDistanceSource) {
        var isEnabled = false, bufferInfo, flags,  bufferUnits, currentOptions, filteredUnitsOptions = [];

        // Replace the search distance display because it doesn't handle changes to its menu
        if (this._searchDistance) {
          isEnabled = this._searchDistance.isEnabled();
          this._searchDistance.destroy();
          this._searchDistance = null;
        }
        domConstruct.empty(this.searchDistanceDiv);

        // Use the config to filter and order the units list
        this._searchDistanceSource = searchDistanceSource;
        if (typeof this._searchDistanceSource === 'undefined') {
          bufferInfo = this.config.searchSourceSettings.drawing.buffer;
        } else {
          bufferInfo = this.config.searchSourceSettings.search.sources[this._searchDistanceSource].buffer;
        }

        flags = bufferInfo.bufferUnitsMenu[0];
        bufferUnits =
          array.filter(bufferInfo.bufferUnitsMenu.slice(1), function (units, i) {
            return flags[i] === '1';
          });

        // Create the distance display and replace its menu to match the menu configured for the layer/geocoder
        this._searchDistance = new SearchDistance({
          distance: bufferInfo.bufferDistance,
          unit: bufferInfo.bufferUnits
        });

        currentOptions = this._searchDistance.unitSelect.options;
        array.forEach(bufferUnits, function (units) {
          array.some(currentOptions, function (option) {
            if (option.value === units) {
              filteredUnitsOptions.push(option);
              return true;
            }
            return false;
          }, this);
        }, this);

        if (filteredUnitsOptions.length > 0) {
          this._searchDistance.unitSelect.options = filteredUnitsOptions;
        }

        this._searchDistance.placeAt(this.searchDistanceDiv);
        if (isEnabled) {
          this._searchDistance.enable();  // default is disabled but editable; this makes it enabled
        } else {
          this._searchDistance.disable();  // default is disabled but editable; this makes it disabled and uneditable
        }

        // Update the displayed buffer
        this._updateDisplayedBuffer(this._searchDistance.getData());

        // Event handlers
        this.own(this._searchDistance.numberTextBox.on('keyup', lang.hitch(this, this._onBufferDistanceKeyup)));
        this.own(on(this._searchDistance, 'change', lang.hitch(this, this._onSearchDistanceChanged)));
      },

      _updateDisplayedBuffer: function (data) {
        this._bufferDistanceMeters = 0;
        if (data && data.isEnabled && data.meters >= 0) {
          this._bufferDistanceMeters = data.meters;
        }

        if (this._origin !== undefined) {
          this._doBufferSearch();
        }
      },

      _replaceChildren: function (node, newChildren) {
        while (node.firstChild) {
          node.removeChild(node.firstChild);
        }
        array.forEach(newChildren, function (newChild) {
          node.appendChild(newChild);
        });
      },

      _createRelationshipQueries: function (operLayer) {
        var hasRelationships = false, relationships = {}, relationshipFieldPattern = /\{relationships\/\d+\//gm,
          relationshipIdPattern = /\d+/, matches;

        matches = operLayer.popupInfo.description.match(relationshipFieldPattern);
        if (matches) {
          hasRelationships = true;
          array.forEach(matches, function (match) {
            var relatedQuery, id = match.match(relationshipIdPattern)[0];
            if (!relationships.hasOwnProperty(id)) {
              relatedQuery = new RelationshipQuery();
              relatedQuery.outFields = ['*'];
              relatedQuery.relationshipId = id;
              relatedQuery.returnGeometry = false;
              relationships[id] = {
                operLayer: operLayer,
                relatedQuery: relatedQuery
              };
            }
          });
        }

        return hasRelationships? relationships : null;
      },

      _enableSourceInputs: function (enable) {
        var scrim = dom.byId('sourceInputsSectionScrim');
        if (enable) {
          domClass.add(scrim, 'hidden');
        } else {
          var sourceInputsSectionBox = domGeom.getMarginBox(dom.byId('sourceInputsSection'));
          domGeom.setMarginBox(scrim, sourceInputsSectionBox);
          domClass.remove(scrim, 'hidden');
        }
      },

      _doBufferSearch: function () {
        this._onStartBuffer();

        this._queryer.createBufferFromGeometries([this._origin], this._bufferDistanceMeters)
          .then(lang.hitch(this, function (bufferedGeomUnion) {
            // We have a single polygon representing the buffer of the union of the input geometries
            this._bufferGeometry = bufferedGeomUnion;

            // Update the set of addressees based on the new buffer
            this._updateAddresseesFromBufferGeometry();

          }), lang.hitch(this, function (error) {
            this._onEndBuffer();
            console.log(error);
          }));
      },

      _updateAddresseesFromBufferGeometry: function () {
        this._onStartBuffer();

        if (this._bufferGeometry) {
          // Start an indeterminate progress bar
          this.indeterminateProgress.set({value: Number.POSITIVE_INFINITY});
          domStyle.set(this.indeterminateProgress.domNode, 'display', 'block');

          // Highlight the buffered source
          this._queryer.createAndAddGraphic(this._greenSymbol, this._bufferGeometry);

          // Use the selectors to find the addressees
          this._queryer.find(this._bufferGeometry,
           this._addresseeSources[this.addresseeSelect.value].url, ['*'], 'addressee')
           .then(lang.hitch(this, function (findResults) {
             if (findResults.features && Array.isArray(findResults.features) && findResults.features.length > 0) {
               this._foundAddressees = findResults.features;

               // Done with indeterminate progress bar
               domStyle.set(this.indeterminateProgress.domNode, 'display', 'none');

               // Highlight the addressees
               this._queryer.highlightFeatures(this._blueSymbol, this._foundAddressees, this.determinateProgress);
             }
             this._onEndBuffer();
           }), lang.hitch(this, function (error) {
             this._onEndBuffer();
             console.log(error);
           }));
        } else {
          this._onEndBuffer();
        }
      },

      /**
       * Creates a graphic that can be used for highlighting.
       * @param {object} item Graphic to be used to create highlight graphic
       */
      _createHighlightGraphic: function(item) {
        var itemLayer, highlightGraphic, outlineSquareSize = 30;

        if (item.geometry.type === "polyline") {
          // Create a line symbol using the configured line highlight color
          highlightGraphic = new Graphic(item.geometry,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              this._lineHiliteColor, 3),
            item.attributes, item.infoTemplate);

        } else {
          if (item.geometry.type === "point") {
            // JSAPI does not want NaN coordinates
            if (!item.geometry.x || !item.geometry.y || isNaN(item.geometry.x) || isNaN(item.geometry.y)) {
              return highlightGraphic;
            }

            // Try to get the item's layer's symbol
            itemLayer = item.getLayer();
            if (itemLayer) {
              highlightGraphic = item.getLayer()._getSymbol(item);
              if (highlightGraphic && !isNaN(highlightGraphic.width) && !isNaN(highlightGraphic.height)) {
                outlineSquareSize = 1 + Math.max(highlightGraphic.width, highlightGraphic.height);
              }
            }

            // Create an outline square using the configured line highlight color
            highlightGraphic = new Graphic(item.geometry,
              new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_SQUARE,
                outlineSquareSize,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                  this._lineHiliteColor, 2),
                this._outlineFillColor
                ),
              item.attributes, item.infoTemplate);

          } else if (item.geometry.type) {
            // Create a polygon symbol using the configured line & fill highlight colors
            highlightGraphic = new Graphic(item.geometry,
              new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                  this._lineHiliteColor, 3), this._fillHiliteColor),
              item.attributes, item.infoTemplate);
          }
        }

        return highlightGraphic;
      },

      _onBufferDistanceKeyup: function (event) {
        // If the enter key was used, accept it as the conclusion of the distance
        // update rather than waiting for the loss of focus
        if (event.keyCode === keys.ENTER) {
          this._updateDisplayedBuffer(this._searchDistance.getData());
        }
      },

      _onSearchDistanceChanged: function (data) {
        // Update the current config for this source
        var bufferInfo;

        if (typeof this._searchDistanceSource === 'undefined') {
          bufferInfo = this.config.searchSourceSettings.drawing.buffer;
        } else {
          bufferInfo = this.config.searchSourceSettings.search.sources[this._searchDistanceSource].buffer;
        }
        bufferInfo.bufferDistance = data.distance;
        bufferInfo.bufferUnits = data.unit;

        // Update the displayed buffer
        this._updateDisplayedBuffer(data);
      },

      _onSearchResults: function (evt) {
        var results = evt.results, searchSourceIndex = evt.activeSourceIndex;

        this._clearAll();
        if (evt.numResults > 0 && results) {
          // Use the first result from any source
          labelFormatUtils.objEach(results, function (result, iResult) {
            var highlightGraphic;
            if (result && result.length > 0) {
              // Use the first result in this source
              this._origin = result[0].feature.geometry;
              highlightGraphic = this._createHighlightGraphic(result[0].feature);
              if (highlightGraphic) {
                this.map.graphics.add(highlightGraphic);
              }

              // Match the buffer display to the feature layer
              this._createSearchDistanceDisplay(searchSourceIndex === 'all' ? iResult : searchSourceIndex);

              // Buffer the item
              this._doBufferSearch();
            }
          }, this);
        }
      },

      _onClearSearch: function () {
        this._clearAll();
      },

      _onDrawIconSelected: function () {
        this._clearAll();
        this._createSearchDistanceDisplay();
      },

      _onDrawEnd: function (graphic) {
        this._origin = graphic.geometry;
        this._doBufferSearch();
      },

      _onDrawClear: function () {
        this._clearAll();
      },

      _onStartBuffer: function () {
        this._enableSourceInputs(false);
        this._clearBufferGraphics();

        // Start an indeterminate progress bar
        this.indeterminateProgress.set({value: Number.POSITIVE_INFINITY});
        domStyle.set(this.indeterminateProgress.domNode, 'display', 'block');
      },

      _onEndBuffer: function () {
        this._enableSourceInputs(true);

        // Done with indeterminate progress bar
        domStyle.set(this.indeterminateProgress.domNode, 'display', 'none');

        this._checkDownloadBtnEnable();
      },

      _clearAll: function () {
        this._origin = undefined;
        this._foundAddressees = [];
        this.map.graphics.clear();
        this._queryer.clearBufferGraphics();
        if (this._drawBox && this._drawBox.drawLayer) {
          this._drawBox.drawLayer.clear();
        }
        this._checkDownloadBtnEnable();
      },

      _clearBufferGraphics: function () {
        this._foundAddressees = [];
        this.map.graphics.clear();
        this._queryer.clearBufferGraphics();
        this._checkDownloadBtnEnable();
      },

      _checkDownloadBtnEnable: function () {
        this._updateNumAddresseesFoundDisplay(this._foundAddressees.length);
        if (this._foundAddressees.length > 0) {
          domClass.remove(this.downloadBtn, 'hidden');
        } else {
          domClass.add(this.downloadBtn, 'hidden');
        }
      },

      _updateNumAddresseesFoundDisplay: function (count) {
        var countEcho = dom.byId('numAddresseesFound');
        if (countEcho && count > 0) {
          countEcho.innerHTML = string.substitute(this.nls.numAddresseesFound, {count: count});
        } else if (countEcho) {
          countEcho.innerHTML = '';
        }
      },

      _onDownloadBtnClicked: function (){
        var labelFormat, labelPageOptions;
        labelPageOptions = lang.clone(this.config.notificationSettings.labelPageOptions);

        // Label configuration
        labelFormat = this.config.notificationSettings.labelFormats[this.formatSelect.value + 1];
        switch (labelFormat.labelSpec.type) {
        case 'AVERY':
          this._formatCodeHandlerInstances[labelFormat.labelSpec.type] = new Download_Avery();
          labelPageOptions.guidance.printSuggestion = this.nls.tooltips.printSuggestion;
          break;
        case 'CSV':
          this._formatCodeHandlerInstances[labelFormat.labelSpec.type] = new Download_CSV();
          break;
        }

        this._doSave(this._formatCodeHandlerInstances[labelFormat.labelSpec.type],
          labelFormat.labelSpec, labelPageOptions);
      },

      _doSave: function (downloadHandler, labelSpec, labelPageOptions) {
        var labelRules, deferred, filename;

        if (!downloadHandler ||  this._foundAddressees.length === 0) {
          return;
        }

        labelRules = this._addresseeSources[this.addresseeSelect.value].labelSpec;
        filename = this._addresseeSources[this.addresseeSelect.value].name;
        deferred = labelFormatUtils.createLabelsFromFeatures(this._foundAddressees, labelRules);

        // If we've any valid labels, save them using the supplied downloader
        deferred.then(lang.hitch(this, function (content) {
          if (content.length > 0) {
            // Start a determinate progress bar
            this.determinateProgress.set({value: 0});
            domStyle.set(this.determinateProgress.domNode, 'display', 'block');

            // Use a timeout so that the UI gets time to paint the progress bar
            setTimeout(lang.hitch(this, function () {
              downloadHandler.save(content, filename,
                labelSpec, labelPageOptions, this.domNode, this.determinateProgress).then(
                  lang.hitch(this, function (ok) {
                    console.log('PDF document(s) ' + (ok? '' : 'not ') + 'created');

                    // Done with determinate progress bar
                    this.determinateProgress.set({value: 100});
                    domStyle.set(this.determinateProgress.domNode, 'display', 'none');
                  })
                );
            }), 10);
          }
        }));
      }

    });
  }
);
