///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
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
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Button',
    'jimu/BaseWidget',
    'jimu/dijit/Message',
    'jimu/utils',
    'jimu/LayerInfos/LayerInfos',
    'jimu/portalUtils',
    'dojo/_base/Color',
    'dojo/_base/html',
    'dojo/dom',
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/dom-geometry',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/xhr',
    'dojo/query',
    'dojo/json',
    'dojo/has',
    'dojo/Deferred',
    'dojo/DeferredList',
    'esri/geometry/Extent',
    'esri/geometry/geometryEngine',
    'esri/geometry/Polygon',
    'esri/geometry/Point',
    'esri/geometry/Multipoint',
    'esri/geometry/Polyline',
    'esri/geometry/webMercatorUtils',
    'esri/geometry/jsonUtils',
    'esri/graphic',
    "esri/graphicsUtils",
    'esri/Color',
    'esri/layers/GraphicsLayer',
    'esri/layers/FeatureLayer',
    'esri/symbols/Font',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/TextSymbol',
    'esri/tasks/locator',
    'esri/tasks/BufferParameters',
    'esri/tasks/GeometryService',
    'esri/toolbars/draw',
    'esri/domUtils',
    'esri/dijit/AttributeInspector',
    'esri/dijit/Popup',
    'jimu/dijit/Popup',
    'esri/tasks/query',
    './js/SummaryInfo',
    './js/GroupedCountInfo',
    './js/WeatherInfo',
    './js/ClosestInfo',
    './js/ProximityInfo',
    './js/SnapShot',
    './js/SnapshotName',
    'dojo/keys',
    'dojo/domReady!'
  ],
  function(declare, _WidgetsInTemplateMixin, Button, BaseWidget, Message, utils, LayerInfos, portalUtils,
    Color, html, dom, on, domStyle, domClass, domConstruct, domGeom, lang, array, xhr,
    query,
    JSON,
    has,
    Deferred,
    DeferredList,
    Extent,
    geometryEngine,
    Polygon,
    Point,
    Multipoint,
    Polyline,
    webMercatorUtils,
    geometryJsonUtils,
    Graphic,
    graphicsUtils,
    esriColor,
    GraphicsLayer,
    FeatureLayer,
    Font,
    SimpleLineSymbol,
    SimpleFillSymbol,
    SimpleMarkerSymbol,
    TextSymbol,
    Locator,
    BufferParameters,
    GeometryService,
    Draw,
    domUtils,
    AttributeInspector,
    Popup,
    jimuPopup,
    Query,
    SummaryInfo,
    GroupedCountInfo,
    WeatherInfo,
    ClosestInfo,
    ProximityInfo,
    Snapshot,
    SnapshotName,
    keys
  ) {

    //TODO do we need to check level 1 vs level 2 for routing?

    return declare([BaseWidget, _WidgetsInTemplateMixin], {
      //templateString: template,
      /*jshint scripturl:true*/

      baseClass: 'jimu-widget-SAT',
      name: 'IncidentAnalysis',

      opLayers: null,
      curTab: 0,
      lyrBuffer: null,
      lyrIncidents: null,
      lyrClosest: null,
      lyrProximity: null,
      lyrSummary: null,
      lyrEdit: null,
      toolbar: null,
      tool: -1,
      symPoint: null,
      symLine: null,
      symPoly: null,
      symBuffer: null,
      symRoute: null,
      incidents: [],
      buffers: [],
      gsvc: null,
      locator: null,
      stops: [],
      initalLayerVisibility: {},
      startX: 0,
      mouseDown: false,
      btnNodes: [],
      panelNodes: [],
      tabNodes: [],
      currentSumLayer: null,
      currentGrpLayer: null,
      mapBottom: null,
      mapResize: null,
      geomExtent: undefined,
      selectedGraphic: false,
      honorTemplate: false,

      Incident_Local_Storage_Key: "SAT_Incident",
      SLIDER_MAX_VALUE: 10000,

      postCreate: function() {
        this.inherited(arguments);
        this.nls = lang.mixin(this.nls, window.jimuNls.units);
        this.widgetActive = true;
        window.localStorage.setItem(this.Incident_Local_Storage_Key, null);
      },

      startup: function() {
        this.inherited(arguments);
        this.btnNodes = [];
        this.panelNodes = [];
        this.tabNodes = [];
        this.editTemplate = this.config.editTemplate;
        this.saveEnabled = this.config.saveEnabled;
        this.summaryDisplayEnabled = this.config.summaryDisplayEnabled;
        if (typeof (this.config.snapshotEnabled) !== 'undefined') {
          this.snapshotEnabled = this.config.snapshotEnabled;
        } else {
          this.snapshotEnabled = false;
        }
        this.isSafari = has("safari");
        this._getStyleColor();
        this._createUI();
        this._loadUI();
        this._initLayers();
        this._verifyRouting();
        this._getAttributeTable();

        this.SLIDER_MAX_VALUE = this.config.bufferRange.maximum;

        // set operational layers
        this.opLayers = this.map.itemInfo.itemData.operationalLayers;

        this._mapLoaded();
      },

      onOpen: function() {
        this.inherited(arguments);
        this.widgetActive = true;
        if (this.map.infoWindow.isShowing) {
          this.map.infoWindow.hide();
        }
        this.setPosition();
        this.windowResize = on(window, "resize", lang.hitch(this, this._resize));
        if (this.mapResize === null) {
          this.mapResize = this.map.on("resize", lang.hitch(this, this._mapResize));
        }
        this._mapResize();
        this._storeInitalVisibility();
        this._checkHideContainer();
        this._initEditInfo();
        this._clickTab(0);
        this._updateCounts(true);
        this._restoreIncidents();
      },

      _checkHideContainer: function () {
        this.hideContainer = false;
        var infoWin = this.map.infoWindow;
        if (infoWin.popupInfoView && infoWin.popupInfoView.container) {
          this.hideContainer = true;
          this.own(on(infoWin, "show", lang.hitch(this, this._handlePopup)));
        }
      },

      onClose: function () {
        this._storeIncidents();
        this._toggleTabLayersOld();
        this._resetInfoWindow();
        if (this.mapResize) {
          this.mapResize.remove();
          this.mapResize = null;
        }
        this.windowResize.remove();
        this.windowResize = null;
        this._clear();
        this.widgetActive = false;
        if (this.saveEnabled) {
          this.scSignal.remove();
          this.sfSignal.remove();
        }
        this._mapResize();
        this._resetInitalVisibility();
        this.inherited(arguments);
      },

      onDeActive: function() {
        this._clickIncidentsButton(-1);
      },

      destroy: function() {
        this._clear();
        this._toggleTabLayersOld();
        if (this.lyrBuffer) {
          this.map.removeLayer(this.lyrBuffer);
        }
        if (this.lyrIncidents) {
          this.map.removeLayer(this.lyrIncidents);
        }
        if (this.lyrClosest) {
          this.map.removeLayer(this.lyrClosest);
        }
        if (this.lyrProximity) {
          this.map.removeLayer(this.lyrProximity);
        }
        if (this.lyrSummary) {
          this.map.removeLayer(this.lyrSummary);
        }
        if (this.lyrGroupedSummary) {
          this.map.removeLayer(this.lyrGroupedSummary);
        }
        this.inherited(arguments);
      },

      // on app config changed
      onAppConfigChanged: function(appConfig, reason) {
        switch (reason) {
          case 'themeChange':
          case 'layoutChange':
            // this.destroy();
            //break;
          case 'styleChange':
            this._updateUI(appConfig);
            break;
          case 'widgetPoolChange':
            this._verifyRouting();
            break;
          case 'mapChange':
            window.localStorage.setItem(this.Incident_Local_Storage_Key, null);
            break;
          case 'attributeChange':
            this._updateUI(appConfig);
            break;
        }
      },

      _handlePopup: function() {
        this._clearMobileSetAsIncidentStyle();
        var mp = dom.byId("main-page");
        var c;
        var r;
        var r2;
        if (this.map.infoWindow.popupInfoView) {
          c = this.map.infoWindow.popupInfoView.container;
          r = '.mainSection { overflow-y: auto; height: ' + (mp.clientHeight - 60).toString() + 'px; }';
          r2 = '.atiAttributes {overflow: auto; height: ' + (mp.clientHeight - 130).toString() + 'px; }';
        } else {
          c = query('div.atiAttributes', this.map.infoWindow.domNode)[0];
          r = '.mainSection { overflow-y: none; }';
          r2 = '.atiAttributes {overflow: none; }';
        }

        if (mp.clientHeight && c) {
          var style = document.createElement('style');
          style.type = 'text/css';
          style.id = "_tempMainSectionOverride";
          c.appendChild(style);
          style.sheet.insertRule(r, 0);
          style.sheet.insertRule(r2, 1);
        }
      },

      // update UI
      _updateUI: function (appConfig) {
        this._getStyleColor(appConfig);
      },

      _updateFontColor: function (appConfig) {
        if (typeof (appConfig) === 'undefined') {
          appConfig = this.appConfig;
        }
        var title = domConstruct.create("div", {
          id: 'tempTitle',
          innerHTML: appConfig.title
        });
        var font = title.getElementsByTagName("font");
        if (font && font.length > 0) {
          this.config.fontColor = /^#[0-9A-F]{6}$/i.test(font[0].color) ? font[0].color : "#ffffff";
        } else {
          this.config.fontColor = "#ffffff";
        }
        domConstruct.destroy("tempTitle");
        var pbElements = document.querySelectorAll(".panelBottom ");
        for (var i = 0; i < pbElements.length; i++) {
          pbElements[i].style.color = this.config.fontColor;
        }
      },

      _updateButtonBackgrounds: function (blackTheme, lightTheme) {
        array.forEach(this.imgContainer.children, function (btn) {
          if (domClass.contains(btn.children[0], blackTheme ? "btn32img" : "btn32imgBlack")) {
            domClass.remove(btn.children[0], blackTheme ? "btn32img" : "btn32imgBlack");
          }
          domClass.add(btn.children[0], blackTheme ? "btn32imgBlack" : "btn32img");
          if (domClass.contains(btn.children[0], lightTheme ? 'darkThemeBackground' : 'lightThemeBackground')) {
            domClass.remove(btn.children[0], lightTheme ? 'darkThemeBackground' : 'lightThemeBackground');
          }
          domClass.add(btn.children[0], lightTheme ? 'lightThemeBackground' : 'darkThemeBackground');
        });
        array.forEach(this.saveOptions.children, function (btn) {
          if (domClass.contains(btn.children[0], blackTheme ? "btn32img" : "btn32imgBlack")) {
            domClass.remove(btn.children[0], blackTheme ? "btn32img" : "btn32imgBlack");
          }
          domClass.add(btn.children[0], blackTheme ? "btn32imgBlack" : "btn32img");
          if (domClass.contains(btn.children[0], lightTheme ? 'darkThemeBackground' : 'lightThemeBackground')) {
            domClass.remove(btn.children[0], lightTheme ? 'darkThemeBackground' : 'lightThemeBackground');
          }
          domClass.add(btn.children[0], lightTheme ? 'lightThemeBackground' : 'darkThemeBackground');
        });
      },

      _getStyleColor: function (appConfig) {
        this._updateFontColor(appConfig);
        setTimeout(lang.hitch(this, function () {
          var bc = window.getComputedStyle(this.footerNode, null).getPropertyValue('background-color');
          this.config.activeMapGraphicColor = bc;
          var _rgb = Color.fromRgb(bc);
          //https://en.wikipedia.org/wiki/Luma_%28video%29
          var Y = 0.2126 * _rgb.r + 0.7152 * _rgb.g + 0.0722 * _rgb.b;
          this.lightTheme = Y < 210 ? false : true;
          this.config.color = _rgb.toHex();
          //TODO consider if we should do a similar...is close to black test
          this.isBlackTheme = this.config.color === "#000000" ? true : false;
          this._updateButtonBackgrounds(this.isBlackTheme, this.lightTheme);
          this.updateActiveNodes(this.lightTheme, true);
          this.updateActiveNodes(this.lightTheme, false);
          if (this.isBlackTheme) {
            domClass.remove(this.tabNodes[this.curTab], "active");
            domClass.add(this.tabNodes[this.curTab], "activeBlack");
            this.config.activeColor = 'rgb(53, 53, 53)';
          } else {
            domClass.remove(this.tabNodes[this.curTab], "activeBlack");
            domClass.add(this.tabNodes[this.curTab], "active");
            this.config.activeColor = 'rgba(39, 39, 39, 0.3)';
          }
          this._setupSymbols();
          if (this.dataValue) {
            this._drawIncident(this.dataValue);
            this.dataValue = undefined;
          }
          this._bufferIncident();
        }), 300);
      },

      updateActiveNodes: function (lightTheme, borderNodes) {
        var nodeClasses;
        var l, d;
        if (borderNodes) {
          nodeClasses = ['.SATcolLocate', '.SATcol', '.SATcolRec', '.SATcol2', '.SATcolSmall'];
          l = 'lightThemeBorder';
          d = 'darkThemeBorder';
        } else {
          nodeClasses = ['.btn32img', '.innerBL', '.innerBR', '.SA_panelClose', '.SA_panelRight', '.SA_panelLeft'];
          l = 'lightThemeBackground';
          d = 'darkThemeBackground';
        }
        array.forEach(nodeClasses, function (c) {
          var nodes = query(c);
          for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            domClass.remove(n, lightTheme ? d : l);
            domClass.add(n, lightTheme ? l : d);
          }
        });
      },

      /*jshint unused:false */
      setPosition: function (position, containerNode) {
        if (this.widgetActive) {
          var pos;
          var style;
          var controllerWidget;
          var m = dom.byId('map');
          if (this.appConfig.theme.name === "TabTheme") {
            controllerWidget = this.widgetManager.getControllerWidgets()[0];
            var w;
            if (controllerWidget.domNode.clientWidth) {
              w = controllerWidget.domNode.clientWidth.toString() + 'px';
            } else {
              w = '54px';
            }
            pos = {
              left: w,
              right: "0",
              bottom: "24px",
              height: "155px",
              relativeTo: "browser"
            };
            this.position = pos;
            style = utils.getPositionStyle(this.position);
            style.position = 'absolute';
            html.place(this.domNode, window.jimuConfig.layoutId);
            html.setStyle(this.domNode, style);
            if (this.started) {
              this.resize();
            }
            m.style.bottom = "155px";
            this.map.resize(true);

            if (this.appConfig.theme.name === "TabTheme") {
              this.widgetManager.minimizeWidget(controllerWidget.id);
            }
          } else {
            pos = {
              left: "0",
              right: "0",
              bottom: "0",
              height: "155px",
              relativeTo: "browser"
            };
            this.position = pos;
            style = utils.getPositionStyle(this.position);
            style.position = 'absolute';
            html.place(this.domNode, window.jimuConfig.layoutId);
            html.setStyle(this.domNode, style);
            if (this.started) {
              this.resize();
            }
            m.style.bottom = "155px";
            this.map.resize(true);
          }
        }
      },

      disableWebMapPopup: function() {
        if (this.map) {
          this.map.setInfoWindowOnClick(false);
        }
      },

      enableWebMapPopup: function() {
        if (this.map) {
          this.map.setInfoWindowOnClick(true);
        }
      },

      _setEventLocation: function (hideContainer) {
        var feature = this.map.infoWindow.getSelectedFeature();
        var pData;
        if (hideContainer && hideContainer.type === 'add') {
          pData = {
            "eventType": "IncidentLocationAdd",
            "dataValue": feature
          };
          this.incidents = [];
          this.buffers = [];
          this.lyrIncidents.clear();
          this.lyrBuffer.clear();
        } else {
          var add = true;
          var removeGraphic;
          for (var i = 0; i < this.lyrIncidents.graphics.length; i++) {
            var g = this.lyrIncidents.graphics[i];
            if (g.geometry.type === feature.geometry.type) {
              var test = !geometryEngine.equals(g.geometry, feature.geometry);
              //TODO if we set some of the attributes it could help with knowing if we should add remove for
              //coincident features or nearly coincident features...but not sure what the attributes would do to the save workflow yet
              if (g.attributes && feature.attributes && !test) {
                test = test && (JSON.stringify(g.attributes) === JSON.stringify(feature.attributes));
              }
              add = add && test;
              if (!test) {
                removeGraphic = g;
              }
            }
          }
          pData = {
            "eventType": add ? "IncidentLocationAdd" : "IncidentLocationRemove",
            "dataValue": feature,
            "removeGraphic": removeGraphic
          };
        }
        this.onReceiveData("", "", pData);
        if (this.map.infoWindow.isShowing) {
          this.map.infoWindow.hide();
        }

        if (hideContainer) {
          var infoWin = this.map.infoWindow;
          var qNode;
          if (infoWin.popupNavigationBar) {
            qNode = query(".esriMobileNavigationBar", infoWin.popupNavigationBar.domNode);
            if (qNode.length > 0) {
              html.setStyle(qNode[0], "display", "none");
            }
          }
          if (infoWin.popupInfoView) {
            qNode = query(".esriMobileInfoView", infoWin.popupInfoView.domNode);
            if (qNode.length > 0) {
              html.setStyle(qNode[0], "display", "none");
            }
          }
        }
      },

      //TODO something along these lines would be required to support selection on a GraphicsLayer
      //_selectSketch: function (obj) {
      //  this.mapClick = this.map.on('click', lang.hitch(this, function () {
      //    if (this.x > 0) {
      //      console.log('map click');
      //      if (this.selectedGraphic && this.selectedGraphic.setSymbol && this.orgSymbol) {
      //        this.selectedGraphic.setSymbol(this.orgSymbol);
      //        this.selectedGraphic = undefined;
      //      }
      //      this.mapClick.remove();
      //      this.mapClick = undefined;
      //      this.x = 0;
      //    } else {
      //      this.x += 1;
      //    }
      //  }));
      //  console.log('layer click');
      //  var g = obj.graphic;
      //  this.orgSymbol = g.symbol;
      //  g.setSymbol(this.symSelection);
      //  this.selectedGraphic = g;
      //  this.x = 0;
      //},

      //create a map based on the input web map id
      _initLayers: function() {

        this.gsvc = new GeometryService(this.config.geometryService.url);

        this.locator = new Locator(this.config.geocodeService.url);
        this.own(on(this.locator, "location-to-address-complete",
          lang.hitch(this, this._showIncidentAddress)));
        this.own(on(this.locator, "error", lang.hitch(this, this._onAddressError)));

        this.lyrBuffer = new GraphicsLayer();
        this.map.addLayer(this.lyrBuffer);

        this.lyrIncidents = new GraphicsLayer();
        this.map.addLayer(this.lyrIncidents);
        //TODO for us to be able to use the Add/Remove feature action on this we
        // need to support selection and would need an infoTemplate so we could get the popup to see the FeatureAction
        //Will leave this in here for now to see how we approach the issue regarding setting attributes for saved features
        //this.own(on(this.lyrIncidents, "click", lang.hitch(this, this._selectSketch)));

        this.lyrClosest = new GraphicsLayer();
        this.lyrClosest.setVisibility(false);
        this.map.addLayer(this.lyrClosest);

        this.lyrProximity = new GraphicsLayer();
        this.lyrProximity.setVisibility(false);
        this.map.addLayer(this.lyrProximity);

        if (this.summaryDisplayEnabled) {
          this.lyrSummary = new GraphicsLayer();
          this.lyrSummary.setVisibility(false);
          this.map.addLayer(this.lyrSummary);

          this.lyrGroupedSummary = new GraphicsLayer();
          this.lyrGroupedSummary.setVisibility(false);
          this.map.addLayer(this.lyrGroupedSummary);
        }
      },

      // map loaded
      _mapLoaded: function() {
        // option to move base map ref layers below graphics
        query('[data-reference]').style("z-index", 0);
        if (this.map.itemId) {
          LayerInfos.getInstance(this.map, this.map.itemInfo)
            .then(lang.hitch(this, function(operLayerInfos) {
              this.opLayers = operLayerInfos;
              this._processOperationalLayers();

              if (this.saveEnabled) {
                var iWin = this.map.infoWindow;

                //Backwards compatability
                if (this.config.saveEnabled && typeof (this.config.savePolys) === 'undefined' &&
                  typeof (this.config.saveLines) === 'undefined' && typeof (this.config.savePoints) === 'undefined') {
                  this.config.savePolys = true;
                  this.config.polyEditLayer = this.config.editLayer;
                  this.polyTemplate = this.config.editTemplate;
                  this.honorTemplate = true;
                }

                if (this.config.savePoints) {
                  this._initEditLayer(this.config.pointEditLayer, 'point');
                }
                if (this.config.saveLines) {
                  this._initEditLayer(this.config.lineEditLayer, 'line');
                }
                if (this.config.savePolys) {
                  this._initEditLayer(this.config.polyEditLayer, 'poly');
                }

                this.scSignal = on(iWin, "selection-change", lang.hitch(this, this._selectionChanged));
                this.sfSignal = on(iWin, "set-features", lang.hitch(this, this._setPopupFeature));

                var aDom = query(".esriPopupWrapper", iWin.domNode);
                if (aDom.length > 0) {
                  if (typeof(aDom[0].clientHeight) !== 'undefined' && typeof(aDom[0].clientWidth) !== 'undefined') {
                    this.defaultPopupSize = {
                      "width": aDom[0].clientWidth
                    };
                  }
                }

                iWin.highlight = true;
              }
            }));
        }

        var bml = this.map.itemInfo.itemData.baseMap.baseMapLayers[0];
        if (bml.layerType !== "ArcGISTiledMapServiceLayer" || !bml.resourceInfo.singleFusedMapCache) {
          this.config.defaultZoomLevel = 0.5;
        }

        this._clickTab(0);
      },

      _initEditLayer: function (id, type) {
        var currentEditLayer;
        if (type === 'point') {
          this.pointEditLayer = this.opLayers.getLayerInfoById(id).layerObject;
          this.isPointEditable = this._isEditable(this.pointEditLayer);
          currentEditLayer = this.pointEditLayer;
          if (currentEditLayer.templates && currentEditLayer.templates.length > 0) {
            this.pointTemplate = currentEditLayer.templates[0];
          } else if (currentEditLayer.types && currentEditLayer.types.length > 0) {
            this.pointTemplate = currentEditLayer.types[0].templates[0];
          }
          if (this.pointTemplate) {
            this.pointEditLayerPrototype = this.pointTemplate.prototype;
          }
        } else if (type === 'line') {
          this.lineEditLayer = this.opLayers.getLayerInfoById(id).layerObject;
          this.isLineEditable = this._isEditable(this.lineEditLayer);
          currentEditLayer = this.lineEditLayer;
          if (currentEditLayer.templates && currentEditLayer.templates.length > 0) {
            this.lineTemplate = currentEditLayer.templates[0];
          } else if (currentEditLayer.types && currentEditLayer.types.length > 0) {
            this.lineTemplate = currentEditLayer.types[0].templates[0];
          }
          if (this.lineTemplate) {
            this.lineEditLayerPrototype = this.lineTemplate.prototype;
          }
        } else if (type === 'poly') {
          this.polyEditLayer = this.opLayers.getLayerInfoById(id).layerObject;
          this.isPolyEditable = this._isEditable(this.polyEditLayer);
          currentEditLayer = this.polyEditLayer;
          if (!this.honorTemplate) {
            if (currentEditLayer.templates && currentEditLayer.templates.length > 0) {
              this.polyTemplate = currentEditLayer.templates[0];
            } else if (currentEditLayer.types && currentEditLayer.types.length > 0) {
              this.polyTemplate = currentEditLayer.types[0].templates[0];
            }
          }
          if (this.polyTemplate) {
            this.polyEditLayerPrototype = this.polyTemplate.prototype;
          }
        }
        if (currentEditLayer) {
          this.own(on(currentEditLayer, "click", lang.hitch(this, function (results) {
            if (results.graphic) {
              var g = results.graphic;
              switch (g.geometry.type) {
                case 'point':
                  this.pointUpdateFeature = g;
                  break;
                case 'polyline':
                  this.lineUpdateFeature = g;
                  break;
                case 'polygon':
                  this.polyUpdateFeature = g;
                  break;
              }
              //this._updatePopup(g);//??
            }
          })));
        }
      },

      _isEditable: function (layer) {
        var cb = false;
        if (layer.isEditable() && layer.getEditCapabilities) {
          cb = layer.getEditCapabilities();
        }
        return cb && (cb.canUpdate && cb.canCreate);
      },

      _initEditInfo: function () {
        if (this.saveEnabled) {
          var resize = false;
          if (this.polyEditLayer && this.isPolyEditable) {
            resize = true;
            if (this.polyEditLayer.infoTemplate) {
              this.defaultPolyContent = this.polyEditLayer.infoTemplate.content;
            } else {
              this.defaultPolyContent = undefined;
            }
            this.polyEditLayer.infoTemplate.setContent(lang.hitch(this, this._setEditLayerPopup));
          }

          if (this.lineEditLayer && this.isLineEditable) {
            resize = true;
            if (this.lineEditLayer.infoTemplate) {
              this.defaultLineContent = this.lineEditLayer.infoTemplate.content;
            } else {
              this.defaultLineContent = undefined;
            }
            this.lineEditLayer.infoTemplate.setContent(lang.hitch(this, this._setEditLayerPopup));
          }

          if (this.pointEditLayer && this.isPointEditable) {
            resize = true;
            if (this.pointEditLayer.infoTemplate) {
              this.defaultPointContent = this.pointEditLayer.infoTemplate.content;
            } else {
              this.defaultPointContent = undefined;
            }
            this.pointEditLayer.infoTemplate.setContent(lang.hitch(this, this._setEditLayerPopup));
          }

          if (resize) {
            this.map.infoWindow.resize(350, 340);
          }
        }
      },

      _setPopupFeature: function () {
        if (this.map.infoWindow.count > 0) {
          var f = this.map.infoWindow.getSelectedFeature();
          switch (f.geometry.type) {
            case 'point':
              this.pointUpdateFeature = f;
              break;
            case 'polyline':
              this.lineUpdateFeature = f;
              break;
            case 'poly':
              this.polyUpdateFeature = f;
              break;
          }
        }
      },

      _selectionChanged: function () {
        if (this.map.infoWindow.count > 0) {
          var f = this.map.infoWindow.getSelectedFeature();
          switch (f.geometry.type) {
            case 'point':
              this.pointUpdateFeature = f;
              break;
            case 'polyline':
              this.lineUpdateFeature = f;
              break;
            case 'poly':
              this.polyUpdateFeature = f;
              break;
          }
          if (f) {
            //this._updatePopup(f);//??
          }
        }
      },

      _setEditLayerPopup: function (f) {
        var lyrEdit;
        if (f.geometry.type === "polygon") {
          lyrEdit = this.polyEditLayer;
        }
        if (f.geometry.type === "polyline") {
          lyrEdit = this.lineEditLayer;
        }
        if (f.geometry.type === "point") {
          lyrEdit = this.pointEditLayer;
        }
        var fInfos = [];
        var popupFields = this._getPopupFields(lyrEdit);
        for (var i = 0; i < popupFields.length; i++) {
          var fld = popupFields[i];
          if (fld.isEditable && fld.isEditableOnLayer) {
            fInfos.push({
              'fieldName': fld.fieldName,
              'isEditable': fld.isEditable
            });
          }
        }

        var layerInfos = [{
          'featureLayer': lyrEdit,
          'showAttachments': false,
          'isEditable': true,
          'fieldInfos': fInfos
        }];

        this.attInspector = new AttributeInspector({
          layerInfos: layerInfos
        }, domConstruct.create("div"));

        var saveButton = new Button({
          label: this.nls.update_btn
        }, domConstruct.create("div"));
        domConstruct.place(saveButton.domNode, this.attInspector.deleteBtn.domNode.parentNode);

        //TODO explore this more to see if we can avoid some of the hacks
        //https://developers.arcgis.com/javascript/3/jssamples/ed_attribute_inspector.html
        //var saveButton = new Button({
        //  label: this.nls.update_btn,
        //  "class": 'saveButton'
        //}, domConstruct.create("div"));

        //domConstruct.place(saveButton.domNode, this.attInspector.deleteBtn.domNode, "after");

        this.own(on(saveButton, "click", lang.hitch(this, function () {
          lyrEdit.applyEdits(null, [f], null, lang.hitch(this, function () {
            this.map.infoWindow.hide();
          }), function (error) {
            var msg = "Error";
            if (typeof (error.details) !== 'undefined') {
              msg = error.details;
            }
            if (typeof (error.message) !== 'undefined') {
              msg = error.message;
            }
            new Message({
              message: msg
            });
          });
        })));

        this.own(on(this.attInspector, "attribute-change", lang.hitch(this, function (evt) {
          switch (evt.feature.geometry.type) {
            case 'point':
              this.pointUpdateFeature = evt.feature;
              this.pointUpdateFeature.attributes[evt.fieldName] = evt.fieldValue;
              break;
            case 'polyline':
              this.lineUpdateFeature = evt.feature;
              this.lineUpdateFeature.attributes[evt.fieldName] = evt.fieldValue;
              break;
            case 'polygon':
              this.polyUpdateFeature = evt.feature;
              this.polyUpdateFeature.attributes[evt.fieldName] = evt.fieldValue;
              break;
          }
        })));

        this.own(on(this.attInspector, "next", lang.hitch(this, function (evt) {
          switch (evt.feature.geometry.type) {
            case 'point':
              this.pointUpdateFeature = evt.feature;
              break;
            case 'polyline':
              this.pointUpdateFeature = evt.feature;
              break;
            case 'poly':
              this.pointUpdateFeature = evt.feature;
              break;
          }
        })));

        this.own(on(this.attInspector, "delete", lang.hitch(this, function (evt) {
          //Test if the feature being deleted matches the incident or incident buffer
          // if so flag the incident to be cleared
          var removeIncident = false;
          if (this.incidents.length > 0) {
            for (var ii = 0; ii < this.incidents.length; ii++) {
              var incident = this.incidents[ii];
              if (geometryEngine.equals(evt.feature.geometry, incident.geometry)) {
                removeIncident = true;
              }
            }

            if (!removeIncident && this.lyrBuffer.graphics.length > 0) {
              for (var iii = 0; iii < length; iii++) {
                var buffer = this.lyrBuffer.graphics[iii];
                if (geometryEngine.equals(evt.feature.geometry, buffer.geometry)) {
                  removeIncident = true;
                }
              }
            }
          }

          lyrEdit.applyEdits(null, null, [evt.feature], function () {
          }, function (error) {
            var msg = "Error";
            if (typeof (error.details) !== 'undefined') {
              msg = error.details;
            }
            if (typeof (error.message) !== 'undefined') {
              msg = error.message;
            }
            new Message({
              message: msg
            });
          });

          if (this.pointEditLayer) {
            this.pointUpdateFeature = this.pointEditLayerPrototype;
          }
          if (this.lineEditLayer) {
            this.lineUpdateFeature = this.lineEditLayerPrototype;
          }
          if (this.polyEditLayer) {
            this.polyUpdateFeature = this.polyEditLayerPrototype;
          }

          if (removeIncident) {
            this._clear();
          }

          this.map.infoWindow.hide();
        })));

        switch (f.geometry.type) {
          case "point":
            this.pointUpdateFeature = f;
            break;
          case "polyline":
            this.lineUpdateFeature = f;
            break;
          case "polygon":
            this.polyUpdateFeature = f;
            break;
        }
        this.attInspector.showFeature(f);
        return this.attInspector.domNode;
      },

      _getPopupFields: function (layer) {
        var fldInfos;
        if (layer.infoTemplate) {
          fldInfos = layer.infoTemplate.info.fieldInfos;
        } else if (this.tab.tabLayers[0].url.indexOf("MapServer") > -1) {
          var lID = this.tab.tabLayers[0].url.split("MapServer/")[1];
          var mapLayers = this.parent.map.itemInfo.itemData.operationalLayers;
          fldInfos = null;
          for (var ii = 0; ii < mapLayers.length; ii++) {
            var lyr = mapLayers[ii];
            if (lyr.layerObject.infoTemplates) {
              var infoTemplate = lyr.layerObject.infoTemplates[lID];
              if (infoTemplate) {
                fldInfos = infoTemplate.infoTemplate.info.fieldInfos;
                break;
              }
            }
          }
        } else {
          fldInfos = layer.fields;
        }
        if (!fldInfos) {
          fldInfos = layer.fields;
        }
        return fldInfos;
      },

      _updatePopup: function (newGeoms, point, scnPnt) {
        var defArray = [];
        for (var i = 0; i < newGeoms.length; i++) {
          var ng = newGeoms[i];
          var q = new Query();
          q.objectIds = [ng.oid];
          defArray.push(ng.layer.selectFeatures(q, FeatureLayer.SELECTION_NEW));
        }
        var defList = new DeferredList(defArray);
        defList.then(lang.hitch(this, function (defResults) {
          var features = [];
          for (var r = 0; r < defResults.length; r++) {
            var featureSet = defResults[r];
            if (featureSet[0]) {
              var f = featureSet[1][0];
              features.push(f);
              switch (f.geometry.type) {
                case 'point':
                  this.pointUpdateFeature = f;
                  break;
                case 'polyline':
                  this.lineUpdateFeature = f;
                  break;
                case 'poly':
                  this.polyUpdateFeature = f;
                  break;
              }
              if (!this.attInspector) {
                this._setEditLayerPopup(f);
              }
              if (this.attInspector) {
                this.attInspector.showFeature(f);
              }
            }
          }
          //this.map.infoWindow.show(point, scnPnt);
        }));
      },

      // process operational layers
      _processOperationalLayers: function() {
        // tab layers
        for (var i = 0; i < this.config.tabs.length; i++) {
          var t = this.config.tabs[i];
          if (t.layers && t.layers !== "") {
            this.hasLayerTitle = typeof (t.layerTitle) !== 'undefined';
            t.tabLayers = this._getTabLayers(t.layers);
          }
        }
      },

      _createUI: function () {
        //TODO...stripping should be done on the config side
        var lbl = utils.stripHTML(this.config.bufferLabel ? this.config.bufferLabel : '');
        this.buffer_lbl.innerHTML = lbl;

        var units = this.config.distanceUnits;
        this.buffer_lbl_unit.innerHTML = this.nls[units];

        var bufferMin = this.config.bufferRange.minimum;
        var bufferMax = this.config.bufferRange.maximum;

        this.spinnerValue.set("data-dojo-props",
          "constrains: {min: " + bufferMin + ", max: " + bufferMax + "}, intermediateChanges: true, places:0");

        this.spinnerValue.set("value", bufferMin);

        var liL;
        if(typeof (this.config.locateIncidentLabel) !== 'undefined'){
          liL = this.config.locateIncidentLabel;
        } else {
          liL = this.nls.locate_incident;
        }
        this.locateIncident.innerHTML = liL;

        //TODO this should also be stripped on the config side
        var iL = typeof (this.config.incidentLabel) !== 'undefined' ? this.config.incidentLabel : this.nls.incident;
        var defTab = {
          type: "incidents",
          label: iL,
          color: this.config.color
        };
        this.config.tabs.splice(0, 0, defTab);
        var iTab = this.SA_tabPanel0;
        this.panelNodes.push(iTab);

        //tabs
        var pContainer = this.panelContainer;
        var pTabs = this.tabsNode;
        var wTabs = 0;
        for (var i = 0; i < this.config.tabs.length; i++) {
          var obj = this.config.tabs[i];
          var label = obj.label;
          if (obj.type === "weather") {
            label = this.nls.weather;
          }
          if (!label || label === "") {
            //layerTitle is only set for configs after the title/id switch
            label = obj.layerTitle ? obj.layerTitle : obj.layers;
          }
          var tab = domConstruct.create("div", {
            'data-dojo-attach-point': "SA_tab" + i,
            innerHTML: utils.stripHTML(label ? label : '')
          }, pTabs);
          this.tabNodes.push(tab);
          domClass.add(tab, "SATTab");
          wTabs += domGeom.position(tab).w;
          on(tab, "click", lang.hitch(this, this._clickTab, i));
          if (i > 0) {
            var panel = domConstruct.create("div", {
              'data-dojo-attach-point': "SA_tabPanel" + i,
              innerHTML: ''
            }, pContainer);
            this.panelNodes.push(panel);
            domClass.add(panel, "SAT_tabPanel");

            if (obj.type === "summary") {
              obj.summaryInfo = new SummaryInfo(obj, panel, this);
              this.own(on(obj.summaryInfo, "summary-complete", lang.hitch(this, this.restore)));
            }
            if (obj.type === "groupedSummary") {
              obj.groupedSummaryInfo = new GroupedCountInfo(obj, panel, this);
              this.own(on(obj.groupedSummaryInfo, "summary-complete", lang.hitch(this, this.restore)));
            }
            if (obj.type === "weather") {
              obj.weatherInfo = new WeatherInfo(obj, panel, this);
            }
            if (obj.type === "closest") {
              obj.closestInfo = new ClosestInfo(obj, panel, this);
            }
            if (obj.type === "proximity") {
              obj.proximityInfo = new ProximityInfo(obj, panel, this);
            }
          }
        }
        wTabs += 10;
        domStyle.set(pTabs, "width", wTabs + "px");
        if (wTabs > domGeom.position(this.footerNode).w) {
          var fc = this.footerContentNode;
          domStyle.set(fc, 'right', "58" + "px");
          domStyle.set(this.panelRight, 'display', 'block');
        }
        on(pTabs, "scroll", lang.hitch(this, this._onPanelScroll));
      },

      restore: function (e) {
        if (e.tab === this.curTab) {
          this._clickTab(e.tab);
        }
      },

      validateSavePrivileges: function () {
        var def = new Deferred();
        def.resolve(true);

        //https://devtopia.esri.com/john4818/arcgis-webappbuilder/issues/408
        //var portal = portalUtils.getPortal(this.appConfig.portalUrl);
        //portal.getUser().then(lang.hitch(this, function (user) {
        //  def.resolve(user.privileges.indexOf('features:user:edit') > -1 ? true : false);
        //}), lang.hitch(this, function (err) {
        //  console.log(err);
        //  def.resolve(false);
        //}));
        return def;
      },

      validateSnapshotPrivileges: function () {
        var def = new Deferred();
        var portal = portalUtils.getPortal(this.appConfig.portalUrl);
        portal.getUser().then(lang.hitch(this, function (user) {
          var p = 'portal:publisher:publishFeatures';
          var c = 'portal:user:createItem';
          def.resolve((user.privileges.indexOf(p) > -1 && user.privileges.indexOf(c) > -1) ? true : false);
        }), lang.hitch(this, function (err) {
          console.log(err);
          def.resolve(false);
        }));
        return def;
      },

      // load UI
      _loadUI: function () {
        var btnTitles = {
          0: this.nls.drawPoint,
          1: this.nls.drawLine,
          2: this.nls.drawPolygon
        };
        this.btnNodes = [this.SA_btn0, this.SA_btn1, this.SA_btn2];

        var cnt = 3;

        var downloadAllButonSpan = domConstruct.create("span", {
          "class": "btn32 displayT"
        }, this.saveOptions);

        this.downloadAllButon = domConstruct.create("div", {
          "class": 'downloadAll',
          "title": this.nls.downloadAll
        }, downloadAllButonSpan);
        this.own(on(this.downloadAllButon, "click", lang.hitch(this, this._downloadAll)));

        if (this.saveEnabled) {
          this.saveButtonSpan = domConstruct.create("span", {
            "class": "btn32 displayT"
          }, this.saveOptions);
          this.validateSavePrivileges().then(lang.hitch(this, function (enable) {
            this.saveButton = domConstruct.create("div", {
              "class": enable ? 'save' : 'save btnDisabled',
              "title": enable ? this.nls.saveIncident : this.nls.user_credentials
            }, this.saveButtonSpan);
            if (enable) {
              this.own(on(this.saveButton, "click", lang.hitch(this, this._saveIncident)));
            }
          }), function (err) {
            console.log(err);
          });
        }

        if (this.snapshotEnabled) {
          this.createSnapshotButtonSpan = domConstruct.create("span", {
            "class": "btn32 displayT"
          }, this.saveOptions);
          this.validateSnapshotPrivileges().then(lang.hitch(this, function (enable) {
            this.createSnapshotButton = domConstruct.create("div", {
              "class": enable ? 'snapshot' : 'snapshot btnDisabled',
              "title": enable ? this.nls.createSnapshot : this.nls.user_credentials
            }, this.createSnapshotButtonSpan);
            if (enable) {
              this.own(on(this.createSnapshotButton, "click", lang.hitch(this, this._createSnapshot)));
            }
          }), function (err) {
            console.log(err);
          });
        }

        for (var i = 0; i < cnt; i++) {
          var btn = this.btnNodes[i];
          html.setAttr(btn, 'src', this.folderUrl + 'images/btn' + i + '.png');
          html.setAttr(btn, 'title', btnTitles[i]);
          this.own(on(btn, "click", lang.hitch(this, this._clickIncidentsButton, i)));
        }

        this.toolbar = new Draw(this.map, {
          tooltipOffset: 20,
          drawTime: 90
        });
        this.toolbar.on("draw-end", lang.hitch(this, this._drawIncident));

        this.own(on(this.spinnerValue, "change", lang.hitch(this, this._sliderTextChange)));

        this.own(on(this.spinnerValue, "blur", lang.hitch(this, function (event) {
          this._updateSpinnerValue(true);
        })));

        this.own(on(this.spinnerValue, "keyup", lang.hitch(this, function (event) {
          if (event.keyCode === keys.ENTER) {
            this._updateSpinnerValue(true);
          } else {
            this._updateSpinnerValue(false);
          }
        })));
      },

      _locateBuffer: function(obj) {
        if (obj !== null) {
          var bufferExtent;
          if (obj.type === "extent") {
            bufferExtent = obj;
          } else {
            bufferExtent = obj.getExtent();
          }

          if (bufferExtent !== null) {
            bufferExtent = bufferExtent.expand(1.5);

            // move it up to avoid overlapping the widget
            var thisWidgetHeight = 80;
            var percent_to_moveUp = thisWidgetHeight / this.map.height;
            var eHeight = bufferExtent.getHeight();
            bufferExtent.update(bufferExtent.xmin, bufferExtent.ymin -
              eHeight * percent_to_moveUp, bufferExtent.xmax, bufferExtent.ymax -
              eHeight * percent_to_moveUp, this.map.spatialReference);

            this.map.setExtent(bufferExtent, true);
          }
        }
      },

      _clickIncidentsButton: function (num) {
        var btn;
        var cnt = 3;
        if (num < cnt) {
          for (var i = 0; i < cnt; i++) {
            btn = this.btnNodes[i];
            domClass.remove(btn, "btnOn");
          }
          if (num > -1 && num !== this.tool) {
            btn = this.btnNodes[num];
            if (num < cnt) {
              domClass.add(btn, "btnOn");
            }
            this.tool = num;
          } else {
            this.tool = -1;
          }
          switch (this.tool) {
            case -1:
              this.toolbar.deactivate();
              this.enableWebMapPopup();
              break;
            case 0:
              this._clear();
              this.toolbar.activate(Draw.POINT);
              this.disableWebMapPopup();
              break;
            case 1:
              this._clear();
              this.toolbar.activate(Draw.POLYLINE);
              this.disableWebMapPopup();
              break;
            case 2:
              this._clear();
              this.toolbar.activate(Draw.POLYGON);
              this.disableWebMapPopup();
              break;
          }
        } else {
          this._clear();
        }
      },

      _saveIncident: function () {
        this.map.infoWindow.hide();
        this._updateProcessing(this.saveButton, true, 'save');
        var edits = [];

        //Backwards compatability
        if (this.config.saveEnabled && typeof (this.config.savePolys) === 'undefined' &&
          typeof (this.config.saveLines) === 'undefined' && typeof (this.config.savePoints) === 'undefined') {
          this.config.savePolys = true;
        }

        //POLYS
        if (this.config.savePolys) {
          var polyGraphics = this._getIncidentGraphics('polygon', this.polyEditLayerPrototype);
          if (polyGraphics.length > 0) {
            edits.push({
              layer: this.polyEditLayer,
              graphics: polyGraphics
            });
          }
        }

        //LINES
        if (this.config.saveLines) {
          var lineGraphics = this._getIncidentGraphics('polyline', this.lineEditLayerPrototype);
          if (lineGraphics.length > 0) {
            edits.push({
              layer: this.lineEditLayer,
              graphics: lineGraphics
            });
          }
        }

        //POINTS
        if (this.config.savePoints) {
          var pointGraphics = this._getIncidentGraphics('point', this.pointEditLayerPrototype);
          if (pointGraphics.length > 0) {
            edits.push({
              layer: this.pointEditLayer,
              graphics: pointGraphics
            });
          }
        }
        if (edits.length > 0) {
          this._applyEdits(edits);
        } else {
          this._updateProcessing(this.saveButton, false, 'save');
        }
        this._clickIncidentsButton(-1);
      },

      _getIncidentGraphics: function (type, prototype) {
        var graphics = [];
        var tempProto = JSON.parse(JSON.stringify(prototype));
        if (type === 'polygon') {
          for (var i = 0; i < this.lyrBuffer.graphics.length; i++) {
            var graphic = this.lyrBuffer.graphics[i];
            var g = new Graphic();
            g.geometry = graphic.geometry;
            g.setAttributes(tempProto.attributes);
            graphics.push(g);
          }
        }

        for (var ii = 0; ii < this.incidents.length; ii++) {
          var incident = this.incidents[ii];
          if (incident.geometry.type === type) {
            var _g = new Graphic();
            _g.geometry = incident.geometry;
            _g.setAttributes(tempProto.attributes);
            graphics.push(_g);
          }
        }
        return graphics;
      },

      _applyEdits: function (edits) {
        var def = new Deferred();
        var defArray = [];
        var newGeoms = [];
        for (var i = 0; i < edits.length; i++) {
          var edit = edits[i];
          if (!edit.layer.visible) {
            edit.layer.setVisibility(true);
          }
          var updates = [];
          if (edit.graphics.length > 1 && edit.graphics[0].geometry.type === 'polygon') {
            //This does not work with points...the service would need to support multipoint
            var baseGraphic = edit.graphics[0];
            var geoms = edit.graphics.map(function (o) {
              return o.geometry;
            });
            var union = geometryEngine.union(geoms);
            if (union) {
              baseGraphic.geometry = union;
              updates.push(baseGraphic);
            }
          }
          defArray.push(edit.layer.applyEdits(updates.length > 0 ? updates : edit.graphics, null, null));
        }

        var defList = new DeferredList(defArray);
        defList.then(lang.hitch(this, function (defResults) {
          var success = false;
          for (var r = 0; r < defResults.length; r++) {
            var featureSet = defResults[r][1][0];
            if (featureSet.success) {
              success = true;
              if (featureSet.hasOwnProperty('objectId')) {
                //TODO make sure this works with multi-incident
                newGeoms.push({
                  oid: featureSet.objectId,
                  layer: edits[r].layer
                });
              }
            }
          }

          if (!this.map.infoWindow.isShowing) {
            //TODO how should the popup be handled...for now will just show the
            //first one in the list
            var g = this.incidents[0].geometry;
            var pnt;
            switch (g.type) {
              case 'point':
                pnt = g;
                break;
              case 'polyline':
                var xy = g.paths[0][parseInt(g.paths[0].length / 2, 10)];
                pnt = new Point(xy[0], xy[1], g.spatialReference);
                break;
              case 'polygon':
                pnt = g.getCentroid();
                break;

            }
            var scrPnt = this.map.toScreen(pnt);

            if (newGeoms.length > 0) {
              //Save outside of layers scale range does not appear to work without this
              this._updatePopup(newGeoms, pnt, scrPnt);
            }

            this._updateProcessing(this.saveButton, false, 'save');

            this.map.emit("click", {
              bubbles: true,
              cancelable: true,
              screenPoint: scrPnt,
              mapPoint: pnt
            });
          }
          def.resolve(success);
        }), lang.hitch(this, function (err) {
          console.error(err);
          this._updateProcessing(this.saveButton, false, 'save');
          new Message({
            message: err
          });
          def.reject(err);
        }));
        return def;
      },

      _clear: function() {
        this.map.graphics.clear();
        this.lyrIncidents.clear();
        this.lyrBuffer.clear();
        this.lyrProximity.clear();
        this.lyrClosest.clear();
        this.geomExtent = undefined;
        if (this.summaryDisplayEnabled && this.lyrSummary) {
          this.lyrSummary.clear();
        }
        if (this.summaryDisplayEnabled && this.lyrGroupedSummary) {
          this.lyrGroupedSummary.clear();
        }

        domClass.remove(this.saveOptions, "displayT");
        domClass.add(this.saveOptions, 'display-off');

        domClass.remove(this.clearIncident, "display-on");
        domClass.add(this.clearIncident, 'display-off');

        this.incidents = [];
        this.buffers = [];
        if (this.div_reversed_address) {
          this.div_reversed_address.innerHTML = "";
        }
        if (this.div_reverse_geocoding) {
          html.setStyle(this.div_reverse_geocoding, 'visibility', 'hidden');
        }

        this._updateCounts(true);
        this._clearGraphics();

        if (this.pointEditLayer) {
          this.pointUpdateFeature = this.pointEditLayerPrototype;
        }
        if (this.lineEditLayer) {
          this.lineUpdateFeature = this.lineEditLayerPrototype;
        }
        if (this.polyEditLayer) {
          this.polyUpdateFeature = this.polyEditLayerPrototype;
        }
        this._clearMobileSetAsIncidentStyle();
      },

      _clearMobileSetAsIncidentStyle: function () {
        domConstruct.destroy(dom.byId("_tempMainSectionOverride"));
      },

      _sliderTextChange: function() {
        this._bufferIncident();
      },

      _updateSpinnerValue: function (set) {
        var num = this.spinnerValue.displayedValue;
        if (isNaN(num)) {
          //this.spinnerValue.set("value", this.horizontalSlider.value);
        }
        if (typeof(num) === 'string') {
          num = parseInt(num, 10);
        }
        if (num < this.config.bufferRange.minimum) {
          this.spinnerValue.set("value", this.config.bufferRange.minimum);
        } else if (num > this.SLIDER_MAX_VALUE) {
          this.spinnerValue.set("value", this.SLIDER_MAX_VALUE);
        }
        if (set) {
          //if (num < 0 ||
          //  this.spinnerValue.displayedValue > this.SLIDER_MAX_VALUE) {
          //  //this.spinnerValue.set("value", this.horizontalSlider.value);
          //} else {
          //  //this.horizontalSlider.set("value", this.spinnerValue.displayedValue);
          //}
          this._bufferIncident();
        }
      },

      // click tab
      _clickTab: function (num) {
        if (this._validateFeatureCount(num)) {
          this._toggleTabs(num);
          this._toggleTabLayers(num);
          this.curTab = num;
          this._clickIncidentsButton(-1);
        }
      },

      _validateFeatureCount: function (num) {
        var hasFeatures = true;
        var tab = this.config.tabs[num];
        switch (tab.type) {
          case "incidents":
            break;
          case "summary":
            hasFeatures = tab.summaryInfo.featureCount > 0;
            break;
          case "groupedSummary":
            hasFeatures = tab.groupedSummaryInfo.featureCount > 0;
            break;
          case "weather":
            hasFeatures = this.incidents.length > 0;
            break;
          case "closest":
            hasFeatures = tab.closestInfo.featureCount > 0;
            break;
          case "proximity":
            hasFeatures = tab.proximityInfo.featureCount > 0;
            break;
        }
        return hasFeatures;
      },

      // toggle tabs
      _toggleTabs: function(num) {
        for (var i = 0; i < this.config.tabs.length; i++) {
          if (i === num) {
            var active = this.isBlackTheme ? "activeBlack" : "active";
            domClass.add(this.tabNodes[i], active);
            domStyle.set(this.panelNodes[i], "display", "block");
          } else {
            domClass.remove(this.tabNodes[i], "active");
            domClass.remove(this.tabNodes[i], "activeBlack");
            domStyle.set(this.panelNodes[i], "display", "none");
          }
        }
        this._scrollToTab(num);
      },

      // toggale tab layers
      _toggleTabLayers: function(num) {
        // old tab
        this._toggleTabLayersOld();
        // new tab
        this._toggleTabLayersNew(num);
      },

      // toggle tab layers old
      _toggleTabLayersOld: function() {
        var oldTab = this.config.tabs[this.curTab];
        if (!oldTab) {
          return;
        }
        this.lyrClosest.setVisibility(false);
        this.lyrProximity.setVisibility(false);
        if (this.lyrSummary) {
          this.lyrSummary.setVisibility(false);
        }
        if (this.lyrGroupedSummary) {
          this.lyrGroupedSummary.setVisibility(false);
        }
        if (oldTab.tabLayers) {
          array.forEach(oldTab.tabLayers, function(layer) {
            if(typeof(layer.visible) !== 'undefined') {
              layer.setVisibility(false);
            }
          });
        }
      },

      // toggle tab layers new
      _toggleTabLayersNew: function(num) {
        var tab = this.config.tabs[num];
        switch (tab.type) {
          case "incidents":
            break;
          case "summary":
            var bToggle = false;
            if (this.lyrSummary) {
              if (this.currentSumLayer !== num) {
                bToggle = true;
              }
              this.lyrSummary.clear();
            }
            if (tab.tabLayers) {
              if (tab.tabLayers.length > 1) {
                if (this.lyrSummary) {
                  this.lyrSummary.infoTemplate = tab.tabLayers[1].infoTemplate;
                  array.forEach(tab.tabLayers[1].graphics, lang.hitch(this, function (graphic) {
                    this.lyrSummary.add(graphic);
                  }));
                  this.lyrSummary.setVisibility(true);
                }
                if (bToggle) {
                  this.currentSumLayer = num;
                  this._toggleTabLayersNew(num);
                }
              }
            }
            if (this.incidents.length > 0 && tab.updateFlag === true) {
              var gl = this.summaryDisplayEnabled ? this.lyrSummary : null;
              tab.summaryInfo.updateForIncident(this.incidents, this.buffers, gl, num);
              tab.updateFlag = false;
              this.currentSumLayer = num;
            }
            break;
          case "groupedSummary":
            var cToggle;
            if (this.lyrGroupedSummary) {
              if (this.currentSumLayer !== num) {
                cToggle = true;
              }
              this.lyrGroupedSummary.clear();
            }
            if (tab.tabLayers) {
              if (tab.tabLayers.length > 1) {
                if (this.lyrGroupedSummary) {
                  this.lyrGroupedSummary.infoTemplate = tab.tabLayers[1].infoTemplate;
                  array.forEach(tab.tabLayers[1].graphics, lang.hitch(this, function (graphic) {
                    this.lyrGroupedSummary.add(graphic);
                  }));
                  this.lyrGroupedSummary.setVisibility(true);
                }
                if (cToggle) {
                  this.currentSumLayer = num;
                  this._toggleTabLayersNew(num);
                }
              }
            }
            if (this.incidents.length > 0 && tab.updateFlag === true) {
              var l = this.summaryDisplayEnabled ? this.lyrGroupedSummary : null;
              tab.groupedSummaryInfo.updateForIncident(this.incidents, this.buffers, l, num);
              tab.updateFlag = false;
              this.currentGrpLayer = num;
            }
            break;
          case "weather":
            if (tab.tabLayers) {
              array.forEach(tab.tabLayers, function(layer) {
                layer.setVisibility(true);
              });
            }
            if (this.incidents.length > 0 && tab.updateFlag === true) {
              //TODO could use this if we want to use the center of the combined extents and it exists
              //Will leave as is now...like closest and prox will just be based on the first incident in the array
              //var ext = this.geomExtent ? [this.geomExtent] : this.incidents;
              var ext = this.incidents;
              tab.weatherInfo.updateForIncident(ext);
              tab.updateFlag = false;
            }
            break;
          case "closest":
            if (tab.tabLayers) {
              array.forEach(tab.tabLayers, function(layer) {
                if(typeof(layer.visible) !== 'undefined') {
                  layer.setVisibility(true);
                }
              });
            }
            this.lyrClosest.setVisibility(true);
            if (this.incidents.length > 0) {
              if (tab.closestInfo && tab.closestInfo.container) {
                tab.closestInfo.container.innerHTML = "";
                domClass.add(tab.closestInfo.container, "loading");
              }
              if (tab.updateFlag === false) {
                this.lyrClosest.clear();
              }
              tab.closestInfo.updateForIncident(this.incidents,
                this.config.maxDistance, this.lyrClosest);
              tab.updateFlag = false;
            }
            break;
          case "proximity":
            if (tab.tabLayers) {
              array.forEach(tab.tabLayers, function(layer) {
                if(typeof(layer.visible) !== 'undefined') {
                  layer.setVisibility(true);
                }
              });
            }
            this.lyrProximity.setVisibility(true);
            if (this.incidents.length > 0) {
              if (tab.proximityInfo && tab.proximityInfo.container) {
                tab.proximityInfo.container.innerHTML = "";
                domClass.add(tab.proximityInfo.container, "loading");
              }
              if (tab.updateFlag === false) {
                this.lyrProximity.clear();
              }
              tab.proximityInfo.updateForIncident(this.incidents, this.buffers, this.lyrProximity);
              tab.updateFlag = false;
            }
            break;
        }
        tab.updateFlag = false;
      },

      // draw incidents
      _drawIncident: function (inc, v, skipZoom) {
        var evt = Array.isArray(inc) ? inc : [inc];
        var editEnabled = false;
        for (var i = 0; i < evt.length; i++) {
          var e = evt[i];
          var type = e.geometry.type;
          if (this.symPoint === null) {
            this._getStyleColor();
          }
          var sym = this.symPoint;
          if (type === "polyline") {
            sym = this.symLine;
            editEnabled = this.isLineEditable;
          }
          if (type === "polygon") {
            sym = this.symPoly;
            editEnabled = this.isPolyEditable;
          }
          if (type === "point") {
            this._getIncidentAddress(e.geometry);
            editEnabled = this.isPointEditable;
          }
          var g = new Graphic(e.geometry, sym, e.attributes, e.infoTemplate);
          this.incidents.push(g);
          this.lyrIncidents.add(g);
        }

        //TODO should be added to support no features in incident area
        //if (this.downloadAllButon) {
        //  domClass.add(this.downloadAllButon, 'btnDisabled');
        //}
        //if (this.createSnapshotButton) {
        //  domClass.add(this.createSnapshotButton, 'btnDisabled');
        //}

        this.div_reversed_address.innerHTML = "";
        html.setStyle(this.div_reverse_geocoding, 'visibility', 'hidden');
        this.toolbar.deactivate();
        this._clickIncidentsButton(-1);
        if (this.saveEnabled) {
          domClass.remove(this.saveButton, "display-off");
          if (editEnabled && domClass.contains(this.saveButton, 'btnDisabled')) {
            domClass.remove(this.saveButton, "btnDisabled");
          }
          domClass.add(this.saveButton, editEnabled ? "displayT" : "displayT btnDisabled");
        }

        domClass.remove(this.saveOptions, "display-off");
        domClass.add(this.saveOptions, 'displayT');

        domClass.remove(this.clearIncident, "display-off");
        domClass.add(this.clearIncident, 'display-on');

        this._bufferIncident(v, skipZoom);
      },

      // get incident address
      _getIncidentAddress: function(pt) {
        this.map.graphics.clear();
        this.locator.locationToAddress(webMercatorUtils.webMercatorToGeographic(pt), 100);
      },

      // show incident address
      _showIncidentAddress: function(evt) {
        if (evt.address.address) {
          var address = evt.address.address.Address;
          var location = webMercatorUtils.geographicToWebMercator(evt.address.location);
          var fnt = new Font();
          fnt.family = "Arial";
          fnt.size = "18px";
          var symText = new TextSymbol(address, fnt, new esriColor("#000000"));
          symText.setOffset(20, -4);
          symText.horizontalAlignment = "left";
          this.map.graphics.add(new Graphic(location, symText, {}));

          var str_complete_address = address + "</br>" + evt.address.address.City +
            ", " + evt.address.address.Region + " " + evt.address.address.Postal;

          this.div_reversed_address.innerHTML = str_complete_address;
          html.setStyle(this.div_reverse_geocoding, 'visibility', 'visible');
        }
      },

      _onAddressError: function() {
        this.div_reversed_address.innerHTML = this.nls.reverse_geocoded_error;
        html.setStyle(this.div_reverse_geocoding, 'visibility', 'visible');
      },

      // buffer incident
      _bufferIncident: function (v, skipZoom) {
        if (this.incidents.length === 0) {
          return;
        }

        for (var i = 0; i < this.config.tabs.length; i++) {
          var t = this.config.tabs[i];
          t.updateFlag = true;
        }

        this.buffers = [];
        this.lyrBuffer.clear();
        var editEnabled = false;
        for (var ii = 0; ii < this.incidents.length; ii++) {
          var gra = this.incidents[ii];
          //var dist1 = this.horizontalSlider.value;
          var dist1 = this.spinnerValue.get("value");
          var unit1 = this.config.distanceUnits;
          var unitCode = this.config.distanceSettings[unit1];
          if (dist1 > 0) {
            var wkid = gra.geometry.spatialReference.wkid;
            var g;
            if ((wkid === 4326 || wkid === 3857 || wkid === 102100) && !this.isSafari) {
              g = geometryEngine.geodesicBuffer(gra.geometry, dist1, unitCode);
              this.buffers.push(g);
            } else {
              g = geometryEngine.buffer(gra.geometry, dist1, unitCode);
              this.buffers.push(g);
            }
          } else {
            v = false;
            var type = gra.geometry.type;
            if (type === "polyline" && !editEnabled) {
              editEnabled = this.isLineEditable;
            }
            if (type === "polygon" && !editEnabled) {
              editEnabled = this.isPolyEditable;
            }
            if (type === "point" && !editEnabled) {
              editEnabled = this.isPointEditable;
            }
          }
        }

        if (this.buffers.length > 0) {
          if (this.saveEnabled) {
            domClass.remove(this.saveButton, "display-off");
            if (domClass.contains(this.saveButton, "btnDisabled") && this.isPolyEditable) {
              domClass.remove(this.saveButton, "btnDisabled");
            }
            domClass.add(this.saveButton, "displayT");
          }
          this._handleBuffers(this.symPoly, v);
        } else {
          if (this.saveEnabled) {
            if (editEnabled) {
              if (domClass.contains(this.saveButton, "btnDisabled")) {
                domClass.remove(this.saveButton, "btnDisabled");
              }
            } else {
              domClass.add(this.saveButton, "btnDisabled");
            }
          }
          this.zoomToIncidents(skipZoom);
        }
      },

      _handleBuffers: function (sym, v) {
        this.bufferLookUp = [];
        for (var i = 0; i < this.buffers.length; i++) {
          var g = this.buffers[i];
          var buffer = new Graphic(g, sym);
          this.lyrBuffer.add(buffer);
          this.bufferLookUp[i] = buffer;
        }
        if (!v) {
          this._locateBuffer(geometryEngine.union(this.buffers));
        }
        this._performAnalysis();
      },

      _performAnalysis: function () {
        this._updateCounts(false);
        this._toggleTabLayersNew(this.curTab);
      },

      _updateCounts: function (clear) {
        for (var i = 0; i < this.config.tabs.length; i++) {
          if (clear && i > 0) {
            if (this.panelNodes[i]) {
              this.panelNodes[i].innerHTML = '';
            }
          }
          var t = this.config.tabs[i];
          var n = this.tabNodes[i];
          var ao = null;
          var displayCount = false;
          if (t.advStat && t.advStat.stats) {
            if (typeof (t.advStat.stats.tabCount) !== 'undefined') {
              displayCount = t.advStat.stats.tabCount;
            } else if (t.advStat.stats.count) {
              displayCount = true;
            }
          }

          if (t.type === 'proximity') {
            ao = t.proximityInfo;
          } else if (t.type === 'closest') {
            ao = t.closestInfo;
          } else if (t.type === 'summary') {
            ao = t.summaryInfo;
          } else if (t.type === 'groupedSummary') {
            ao = t.groupedSummaryInfo;
          } else if (t.type === 'weather') {
            ao = t.weatherInfo;
          }
          if (ao) {
            if (clear) {
              if (typeof(ao.incidentCount) !== 'undefined') {
                ao.incidentCount = 0;
              }
              ao.updateTabCount(0, n, displayCount);
            } else {
              ao.queryTabCount(this.incidents, this.buffers, n, displayCount);
            }
          }
        }
      },

      // VERIFY ROUTING
      _verifyRouting: function() {
        if (this.config.enableRouting) {
          this.config.enableRouting = false;
          var widgets = this.appConfig.getConfigElementsByName("Directions");
          array.forEach(widgets, lang.hitch(this, function (w) {
            if (w.name === "Directions") {
              this.dirConfig = w;
              this.config.enableRouting = true;
            }
          }));
        }
      },

      _getAttributeTable: function () {
        var widgets = this.appConfig.getConfigElementsByName("AttributeTable");
        array.forEach(widgets, lang.hitch(this, function (w) {
          if (w.name === "AttributeTable") {
            this.attributeTable = w;
          }
        }));
      },

      zoomToIncidents: function (skipZoom) {
        //TODO make sure this is correct for calls to this from analysis types
        //may want to do the old logic here if loc !== undefined
        //will also call this to create the extent when adding multiple line or point incidents
        var zoomExtent;
        //var geomExtent;
        var incidents;
        var performAnalysis = false;
        if (this.incidents.length > 0) {
          var tempBuffer;
          if (this.buffers.length > 1) {
            tempBuffer = geometryEngine.union(this.buffers);
          } else if (this.buffers.length === 1) {
            tempBuffer = this.buffers[0];
          }
          incidents = this.incidents;
          var bufferGraphic;
          if (tempBuffer) {
            performAnalysis = true;
            bufferGraphic = new Graphic(tempBuffer, tempBuffer.spatialReference);
            incidents.push(bufferGraphic);
          }
          this.geomExtent = graphicsUtils.graphicsExtent(this.incidents);
          if (bufferGraphic && bufferGraphic.destroy) {
            bufferGraphic.destroy();
          }
        }
        if (typeof (skipZoom) === 'undefined') {
          if (this.geomExtent) {
            this.map.setExtent(this.geomExtent.expand(1.5));
          } else {
            var loc;
            if (incidents) {
              if (incidents[0].geometry && incidents[0].geometry.type === 'point') {
                loc = incidents[0].geometry;
              } else {
                loc = incidents[0].geometry.getCentroid();
              }
              this.map.centerAndZoom(loc, this.config.defaultZoomLevel);
            }
          }
        }
        if (!performAnalysis) {
          for (var i = 0; i < this.incidents.length; i++) {
            var inc = this.incidents[i];
            if (inc.geometry.type === 'polygon') {
              performAnalysis = true;
              break;
            }
          }
          this._performAnalysis();
        }
        if (performAnalysis) {
          this._performAnalysis();
        }
      },

      // ZOOM TO LOCATION
      zoomToLocation: function (loc) {
        //TODO make sure this is correct for calls to this from analysis types
        //may want to do the old logic here if loc !== undefined
        //will also call this to create the extent when adding multiple line or point incidents
        var zoomExtent;
        if (this.config.defaultZoomLevel === 0.5) {
          var geomExtent;
          if (this.buffers.length > 0) {
            geomExtent = geometryEngine.union(this.buffers)._extent;
          } else if (this.incidents.length > 0) {
            var points = [];
            var lines = [];
            var polys = [];
            for (var i = 0; i < this.incidents.length; i++) {
              var incident = this.incidents[i];
              switch (incident.geometry.type) {
                case 'point':
                  points.push(incident.geometry._extent);
                  break;
                case 'polyline':
                  lines.push(incident.geometry);
                  break;
                case 'polygon':
                  polys.push(incident.geometry);
                  break;
              }
            }

            var extents = [];
            if (points.length > 0) {
              extents.push(geometryEngine.union(points)._extent);
            }
            if (lines.length > 0) {
              extents.push(geometryEngine.union(lines)._extent);
            }
            if (polys.length > 0) {
              extents.push(geometryEngine.union(polys)._extent);
            }

            if (extents.length > 1) {
              geomExtent = geometryEngine.union(extents)._extent;
            } else if (extents.length === 1) {
              if (points.length > 1 || lines.length > 0 || polys.length > 0) {
                geomExtent = extents[0];
              }
            }
          }
          if(geomExtent){
            zoomExtent = geomExtent.expand(0.5);
          }
        }
        if (typeof (loc) === 'undefined') {
          loc = zoomExtent.getCentroid();
        }
        if (zoomExtent) {
          this.map.setExtent(zoomExtent);
        }
        this.map.centerAt(loc);
      },

      // ROUTE TO INCIDENT
      routeToIncident: function (loc) {
        //TODO need to discuss this further with the team
        var geom = this.incidents[0].geometry;
        var pt = geom;
        if (geom.type !== "point") {
          pt = null;
        }
        this.stops = [pt, loc];
        this.widgetManager.triggerWidgetOpen(this.dirConfig.id).then(lang.hitch(this, function (w) {
          if (w && w.state !== "closed") {
            var d = w._dijitDirections;
            if (d) {
              this._addStops(d);
            } else {
              w.getDirectionsDijit().then(lang.hitch(this, function (d) {
                this._addStops(d);
              }));
            }
          }
        }));
      },

      _addStops: function (d) {
        d.clearDirections();
        d.removeStops();
        d.reset();
        d.addStops(this.stops);
      },

      // get tab layers
      _getTabLayers: function(names) {
        var lyrs = [];
        array.forEach(this.opLayers._layerInfos, lang.hitch(this, function(layer) {
          if(layer.newSubLayers.length > 0) {
            this._recurseOpLayers(layer.newSubLayers, lyrs, names);
          } else {
            //if the tab contains the layerTitle prop will check based on the id
            // if not will need to check based on the title for BC
            var id = this.hasLayerTitle ? layer.id : layer.title;
            if (Array.isArray(names) ? names.indexOf(id) > -1 : names === id) {
              lyrs.push(layer.layerObject);
              if (typeof (layer.layerObject.visible) !== 'undefined') {
                if (!layer.layerObject.visible) {
                  layer.layerObject.setVisibility(true);
                  layer.layerObject.setVisibility(false);
                }
              }
            }
          }
        }));
        return lyrs;
      },

      _recurseOpLayers: function(pNode, pLyrs, pNames) {
        var nodeGrp = pNode;
        array.forEach(nodeGrp, lang.hitch(this, function(Node) {
          if(Node.newSubLayers.length > 0) {
            this._recurseOpLayers(Node.newSubLayers, pLyrs, pNames);
          } else {
            //if the tab contains the layerTitle prop will check based on the id
            // if not will need to check based on the title for BC
            var id = this.hasLayerTitle ? Node.id : Node.title;
            if (Array.isArray(pNames) ? pNames.indexOf(id) > -1 : pNames === id) {
              pLyrs.push(Node.layerObject);
            }
          }
        }));
      },

      // setup symbols
      _setupSymbols: function() {
        var symColor = Color.fromString(this.config.color);
        var rgb = symColor.toRgb();
        rgb.push(0.2);
        var blackColor = Color.fromString("#000000");
        var darkColor = Color.blendColors(symColor, blackColor, 0.2);
        var rgb2 = darkColor.toRgb();
        var cls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([255, 255, 255, 0.25]), 1);

        this.symPoint = new SimpleMarkerSymbol(
          SimpleMarkerSymbol.STYLE_CIRCLE, 20, cls, new Color([rgb2[0], rgb2[1], rgb2[2], 0.7]));
        this.symLine = new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID, new Color([rgb2[0], rgb2[1], rgb2[2], 0.7]), 3);
        this.symPoly = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID, this.symLine, new Color([rgb2[0], rgb2[1], rgb2[2], 0.3]));
        this.symBuffer = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID, cls, new Color(rgb));

        this.symSelection = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([0, 255, 255]), 2), new Color([0, 0, 0, 0]));
      },

      onReceiveData: function(name, widgetId, data) {
        if (data !== null && data.eventType) {
          if (data.eventType === "IncidentLocationAdd") {
            if (data.dataValue && data.dataValue !== null) {
              this._clickTab(0);
              if (this.symPoint === null) {
                this.dataValue = data.dataValue;
              } else {
                this._drawIncident(data.dataValue);
              }
            }
          } else if (data.eventType === "IncidentLocationRemove") {
            var i = this.incidents.indexOf(data.removeGraphic);
            this.incidents.splice(i, 1);
            this.lyrIncidents.remove(data.removeGraphic);
            if (this.bufferLookUp && this.bufferLookUp.length > 0) {
              this.lyrBuffer.remove(this.bufferLookUp[i]);
              this.bufferLookUp.splice(i, 1);
            }
            if (this.buffers && this.buffers.length > 0) {
              this.buffers.splice(i, 1);
            }
            if (this.incidents && this.incidents.length > 0) {
              var tab = this.config.tabs[this.curTab];
              tab.updateFlag = true;
              this._performAnalysis();
            } else {
              this._clear();
            }
          } else if (data.eventType === "WebMapChanged") {
            this._storeIncidents();
          }
        }
      },

      _storeIncidents: function() {
        if (this.incidents.length > 0) {
          var geoms = [];
          for (var i = 0; i < this.incidents.length; i++) {
            var incident = this.incidents[i];
            geoms.push(JSON.stringify(incident.geometry.toJson()));
          }
          var obj_to_store = {
            "location": JSON.stringify(geoms),
            "hasBuffer": this.lyrBuffer.graphics.length > 0,
            "buffer_dist": this.spinnerValue.get("value"), //this.horizontalSlider.value,
            "unit": this.config.distanceUnits,
            "curTab": this.curTab,
            "extent": JSON.stringify(this.map.extent.toJson())
          };
          var s_obj = JSON.stringify(obj_to_store);

          window.localStorage.setItem(this.Incident_Local_Storage_Key, s_obj);
          console.log("Incident saved to storage");
        }
      },

      _restoreIncidents: function() {
        var stored_incident = window.localStorage.getItem(this.Incident_Local_Storage_Key);
        if (stored_incident !== null && stored_incident !== "null") {
          window.localStorage.setItem(this.Incident_Local_Storage_Key, null);
          var obj = JSON.parse(stored_incident, true);
          var buffer_dist = obj.buffer_dist;
          var incident_geoms = JSON.parse(obj.location);
          this.curTab = obj.curTab;
          var objects = [];
          for (var ii = 0; ii < incident_geoms.length; ii++) {
            objects.push({
              geometry: geometryJsonUtils.fromJson(JSON.parse(incident_geoms[ii]))
            });
          }
          this.spinnerValue.set("value", buffer_dist);
          for (var i = 0; i < this.config.tabs.length; i++) {
            var t = this.config.tabs[i];
            t.restore = true;
          }
          this._drawIncident(objects, true, true);
          this._clickTab(0, true);
          this._toggleTabs(obj.curTab);
          this._toggleTabLayers(obj.curTab);
          this.curTab = obj.curTab;
          this._clickIncidentsButton(-1);
          this._updateW();
          var ext = geometryJsonUtils.fromJson(JSON.parse(obj.extent));
          if (!geometryEngine.equals(ext, this.map.extent)) {
            this.map.setExtent(ext, false);
          }
        } else {
          domClass.remove(this.saveOptions, "displayT");
          domClass.add(this.saveOptions, 'display-off');

          domClass.remove(this.clearIncident, "display-on");
          domClass.add(this.clearIncident, 'display-off');
        }
      },

      _updateW: function () {
        var wTabs = 0;
        for (var i = 0; i < this.tabNodes.length; i++) {
          var tab = this.tabNodes[i];
          wTabs += domGeom.position(tab).w;
        }
        wTabs += 10;
        domStyle.set(this.tabsNode, "width", wTabs + "px");
        if (wTabs > domGeom.position(this.footerNode).w) {
          domStyle.set(this.footerContentNode, 'right', "58" + "px");
          domStyle.set(this.panelRight, 'display', 'block');
        }
      },

      _mapResize: function () {
        var aHeight;
        if (this.attributeTable) {
          var a = dom.byId(this.attributeTable.id);
          if (a) {
            aHeight = parseInt(a.style.height.toString().replace('px', ''), 10);
          }
        }

        var m = dom.byId('map');
        var mapBottom = parseInt(m.style.bottom.toString().replace('px', ''), 10);

        if (this.state === 'opened' || this.state === 'active') {
          var _h = parseInt(this.position.height.toString().replace('px', ''), 10);
          var _bottomPosition = parseInt(this.position.bottom.toString().replace('px', ''), 10);
          var height = _h + _bottomPosition;
          var refresh = false;
          if (height > aHeight) {
            if (this.mapBottom !== height || this.mapBottom !== mapBottom) {
              refresh = true;
              this.mapBottom = height;
            }
          } else if (aHeight > height) {
            if (this.mapBottom !== aHeight || this.mapBottom !== mapBottom) {
              refresh = true;
              this.mapBottom = aHeight;
            }
          }
          if (refresh) {
            m.style.bottom = this.mapBottom.toString() + 'px';
            this.map.resize(false);
            this.map.reposition();
          }
        } else {
          if (typeof (aHeight) !== 'undefined') {
            m.style.bottom = aHeight.toString() + 'px';
            this.map.resize(true);
            this.map.reposition();
          } else {
            m.style.bottom = '0px';
            this.map.resize(true);
            this.map.reposition();
          }
        }
      },

      _resize: function (e) {
        try {
          this._onPanelScroll(this.curTab);
          if (this.hideContainer) {
            this._handlePopup();
          }
          this._clearMobileSetAsIncidentStyle();
          this._resetInfoWindow();
          this._initEditInfo();
          this._checkHideContainer();
        } catch (err) {
          console.log(err);
        }
      },

      _onPanelScroll: function (num) {
        var n, nn, ss, c, cRect;
        var rect = this.footerContentNode.getBoundingClientRect();
        for (var i = 0; i < this.tabsNode.children.length; i++) {
          c = this.tabsNode.children[i];
          cRect = c.getBoundingClientRect();
          if (cRect.left >= 0) {
            n = i;
            ss = cRect.left;
            break;
          }
        }

        for (var j = 0; j < this.tabsNode.children.length; j++) {
          c = this.tabsNode.children[j];
          cRect = c.getBoundingClientRect();
          if (cRect.right > rect.right) {
            nn = j;
            break;
          }
        }

        var fc = this.footerContentNode;

        var showRight = nn <= this.tabsNode.children.length;
        domStyle.set(fc, 'right', showRight ? "58px" : "24px");
        domStyle.set(this.panelRight, 'display', showRight ? "block" : "none");

        var up = 34;
        if (this.appConfig.theme.name === "TabTheme") {
          up += 54;
        }
        var showLeft = n >= 1 || ss > up;
        domStyle.set(fc, 'left', showLeft ? "34px" : "0px");
        domStyle.set(this.panelLeft, 'display', showLeft ? "block" : "none");
        domStyle.set(this.panelLeft, 'width', showLeft ? "34px" : "0px");
      },

      // _scroll to tab
      _scrollToTab: function(num) {
        var boxW = domGeom.position(this.footerContentNode).w;
        var tabsW = domGeom.position(this.tabsNode).w;
        if (tabsW > boxW) {
          var box = domGeom.getMarginBox(this.tabNodes[num]);
          var dist = box.l - (boxW - box.w) / 2;
          this.footerContentNode.scrollLeft = dist;
        }
        this._onPanelScroll(num);
      },

      _navLeft: function (e) {
        //this._scroll(this.config.tabs[this.curTab], false, true);
      },

      _navRight: function (e) {
        //this._scroll(this.config.tabs[this.curTab], true, true);
      },

      _navTabsLeft: function (e) {
        this._navTabs(false);
      },

      _navTabsRight: function (e) {
        this._navTabs(true);
      },

      _navTabs: function (right) {
        var rect = this.footerContentNode.getBoundingClientRect();
        for (var i = 0; i < this.tabsNode.children.length; i++) {
          var c = this.tabsNode.children[i];
          var cRect = c.getBoundingClientRect();
          if (right) {
            if (cRect.right > rect.right) {
              this._scrollToTab(i);
              return;
            }
          } else {
            if (cRect.right > 0) {
              this._scrollToTab(i);
              return;
            }
          }
        }
      },

      _storeInitalVisibility: function () {
        array.forEach(this.config.tabs, lang.hitch(this, function (tab) {
          array.forEach(tab.tabLayers, lang.hitch(this, function (layer) {
            if (typeof (layer.visible) !== 'undefined') {
              if (!(layer.id in this.initalLayerVisibility)) {
                this.initalLayerVisibility[layer.id] = layer.visible;
              }
              layer.setVisibility(false);
            }
          }));
        }));
      },

      _resetInitalVisibility: function () {
        array.forEach(this.config.tabs, lang.hitch(this, function (tab) {
          array.forEach(tab.tabLayers, lang.hitch(this, function (layer) {
            if (typeof (layer.visible) !== 'undefined') {
              if (layer.id in this.initalLayerVisibility) {
                layer.setVisibility(this.initalLayerVisibility[layer.id]);
                if (layer.hasOwnProperty('visible')) {
                  layer.visible = this.initalLayerVisibility[layer.id];
                }
                if (layer.redraw) {
                  layer.redraw();
                } else {
                  if (layer.refresh) {
                    layer.refresh();
                  }
                }
              }
            }
          }));
        }));
        this.initalLayerVisibility = [];
      },

      _clearGraphics: function () {
        array.forEach(this.config.tabs, lang.hitch(this, function (tab) {
          if (tab.type === "summary") {
            if (tab.tabLayers) {
              if (tab.tabLayers.length > 1) {
                for (var i = 1; i < tab.tabLayers.length; i++) {
                  tab.tabLayers.pop();
                }
              }
            }
          }
        }));
      },

      _resetInfoWindow: function(){
        if (this.defaultPointContent) {
          this.pointEditLayer.infoTemplate.setContent(this.defaultPointContent);
        }
        if (this.defaultLineContent) {
          this.lineEditLayer.infoTemplate.setContent(this.defaultLineContent);
        }
        if (this.defaultPolyContent) {
          this.polyEditLayer.infoTemplate.setContent(this.defaultPolyContent);
        }
        if (this.defaultPopupSize) {
          this.map.infoWindow.resize(this.defaultPopupSize.width, "auto");
        }
        if (this.map.infoWindow.isShowing) {
          this.map.infoWindow.hide();
        }
      },

      // close
      _close: function () {
        this.widgetManager.closeWidget(this.id);
      },

      _downloadAll: function () {
        //allow for downloading CSVs that include calculated values that have been appended to what we would currently export from a single tab.
        //The download should include CSVs for all tabs and come down as a zip file.
        //The headers for calculated values that will be appended should be based on the label displayed for that value in the panel.
        var classList = this.downloadAllButon.classList;
        var valid = true;
        for (var i = 0; i < classList.length; i++) {
          var c = classList[i];
          if (c === 'btnDisabled') {
            valid = false;
            break;
          }
        }
        if (valid) {
          this._updateProcessing(this.downloadAllButon, true, 'downloadAll');
          if (this._verifyIncident(false)) {
            var analysisObjects = this._getAnalysisObjects();
            var s = new Snapshot(this);
            s.createDownloadZip(analysisObjects, this.incidents, this.buffers).then(lang.hitch(this, function (r) {
              this._updateProcessing(this.downloadAllButon, false, 'downloadAll');
            }), function (err) {
              this._updateProcessing(this.downloadAllButon, false, 'downloadAll');
              new Message({
                message: err.message
              });
            });
          }
        }
      },

      _updateProcessing: function(domNode, isProcessing, standardClass) {
        domClass.remove(domNode, isProcessing ? standardClass : 'snapshotProcessing');
        domClass.add(domNode, isProcessing ? 'snapshotProcessing' : standardClass);
      },

      _getAnalysisObjects: function () {
        var supportedTypes = ['proximity', 'closest', 'summary', 'groupedSummary'];
        var analysisObjects = [];
        array.forEach(this.config.tabs, function (layer) {
          if (supportedTypes.indexOf(layer.type) > -1) {
            var ao;
            switch (layer.type) {
              case 'proximity':
                ao = layer.proximityInfo;
                break;
              case 'closest':
                ao = layer.closestInfo;
                break;
              case 'summary':
                ao = layer.summaryInfo;
                break;
              case 'groupedSummary':
                ao = layer.groupedSummaryInfo;
                break;
            }
            var title = typeof (layer.layerTitle) !== 'undefined' ? layer.layerTitle : layer.layers;
            analysisObjects.push({
              layerObject: layer.tabLayers[0],
              label: layer.label !== "" ? layer.label : title,
              analysisObject: ao,
              type: layer.type
            });
          }
        });
        return analysisObjects;
      },

      //TODO this should really not be necessary..really the download all should not be visible
      // unless a valid incident with a feature count over 0 is avalible
      _verifyIncident: function (isSnapshot) {
        if (this.buffers.length === 0) {
          var hasPoly = false;
          for (var i = 0; i < this.incidents.length; i++) {
            if (this.incidents[i].geometry.type === "polygon") {
              hasPoly = true;
              break;
            }
          }

          if (!hasPoly) {
            new Message({
              message: isSnapshot ? this.nls.notPolySnapShot : this.nls.notValidDownload
            });
          }
          return hasPoly;
        } else {
          return true;
        }
      },

      getSnapshotName: function () {
        var def = new Deferred();
        var sourceDijit = new SnapshotName({
          nls: this.nls
        });

        var popup = new jimuPopup({
          width: 300,
          autoHeight: true,
          content: sourceDijit,
          titleLabel: this.nls.snapshot_name
        });

        this.own(on(sourceDijit, 'ok', lang.hitch(this, function (name) {
          sourceDijit.destroy();
          sourceDijit = null;
          popup.close();
          def.resolve(name);
        })));

        this.own(on(sourceDijit, 'cancel', lang.hitch(this, function () {
          sourceDijit.destroy();
          sourceDijit = null;
          popup.close();
          def.resolve('cancel');
        })));

        return def;
      },

      _createSnapshot: function () {
        //TODO test if contains btnDisabled
        //btnDisabled should be removed as soon as one Analysis layer has at least one feature
        //TODO the _verifyIncident function and nls message should be removed as soon as this is worked through
        var classList = this.createSnapshotButton.classList;
        var valid = true;
        for (var i = 0; i < classList.length; i++) {
          var c = classList[i];
          if (c === 'btnDisabled') {
            valid = false;
            break;
          }
        }
        if (valid) {
          if (this._verifyIncident(true)) {
            this.getSnapshotName().then(lang.hitch(this, function (results) {
              if (results && results !== 'cancel') {
                this._updateProcessing(this.createSnapshotButton, true, 'snapshot');
                var inc_buff = [];
                //add a layer for the incidents
                inc_buff.push({
                  graphics: this.incidents,
                  label: this.incidents.length > 1 ? this.nls.incidents : this.nls.incident
                });
                //add a layer for the buffers
                if (this.buffers.length > 0) {
                  inc_buff.push({
                    graphics: this.lyrBuffer.graphics,
                    label: this.buffers.length > 1 ? this.nls.buffers : this.nls.buffer
                  });
                }
                var layers = inc_buff.concat(this._getAnalysisObjects());
                //TODO only one instance of this should be necessary
                //will decide where to create it when I know if snapshot or download all
                // will in some cases be not be avalible
                var s = new Snapshot(this);
                s.createSnapShot({
                  layers: layers,
                  incidents: this.incidents,
                  buffers: this.buffers,
                  time: Date.now(),
                  name: results
                }).then(lang.hitch(this, function (r) {
                  this._updateProcessing(this.createSnapshotButton, false, 'snapshot');
                }), lang.hitch(this, function (err) {
                  this._updateProcessing(this.createSnapshotButton, false, 'snapshot');
                  new Message({
                    message: err.message
                  });
                }));
              } else {
                this._updateProcessing(this.createSnapshotButton, false, 'snapshot');
              }
            }));
          }
        }
      }
    });
  });