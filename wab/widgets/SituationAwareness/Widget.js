define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Button',
    'jimu/BaseWidget',
    'jimu/dijit/Message',
    'jimu/utils',
    'jimu/LayerInfos/LayerInfos',
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
    'dijit/form/HorizontalSlider',
    'dijit/form/HorizontalRuleLabels',
    'esri/geometry/Extent',
    'esri/geometry/geometryEngine',
    'esri/geometry/Polygon',
    'esri/geometry/Point',
    'esri/geometry/Multipoint',
    'esri/geometry/Polyline',
    'esri/geometry/webMercatorUtils',
    'esri/geometry/jsonUtils',
    'esri/graphic',
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
    'esri/tasks/query',
    './js/SummaryInfo',
    './js/GroupedCountInfo',
    './js/WeatherInfo',
    './js/ClosestInfo',
    './js/ProximityInfo',
    'dojo/keys',
    'dojo/domReady!'
  ],
  function(declare, _WidgetsInTemplateMixin, Button, BaseWidget, Message, utils, LayerInfos,
    Color, html, dom, on, domStyle, domClass, domConstruct, domGeom, lang, array, xhr,
    query,
    JSON,
    HorizontalSlider,
    HorizontalRuleLabels,
    Extent,
    geometryEngine,
    Polygon,
    Point,
    Multipoint,
    Polyline,
    webMercatorUtils,
    geometryJsonUtils,
    Graphic,
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
    Query,
    SummaryInfo,
    GroupedCountInfo,
    WeatherInfo,
    ClosestInfo,
    ProximityInfo,
    keys
  ) {

    //To create a widget, you need to derive from BaseWidget.
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
      incident: null,
      buffer: null,
      gsvc: null,
      locator: null,
      stops: [],
      initalLayerVisibility: {},
      updateFeature: null,
      startX: 0,
      mouseDown: false,
      btnNodes: [],
      panelNodes: [],
      tabNodes: [],
      currentSumLayer: null,
      currentGrpLayer: null,

      Incident_Local_Storage_Key: "SAT_Incident",
      SLIDER_MAX_VALUE: 10000,

      postCreate: function() {
        this.inherited(arguments);
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
        this._getStyleColor();
        this._createUI();
        this._loadUI();
        this._initLayers();
        this._verifyRouting();

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
        this._storeInitalVisibility();
        this._initEditInfo();
        this._addActionLink();
        this._clickTab(0);
        this._restoreIncidents();
      },

      onClose: function () {
        this._storeIncidents();
        this._toggleTabLayersOld();
        this._resetInfoWindow();
        this._removeActionLink();
        this.windowResize.remove();
        this.windowResize = null;
        this._clear();
        this.widgetActive = false;
        if (this.saveEnabled) {
          this.scSignal.remove();
          this.sfSignal.remove();
        }
        this._resetMapDiv();
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

      /* jshint unused: true */
      // on app config changed
      onAppConfigChanged: function(appConfig, reason, changedData) {
        switch (reason) {
          case 'themeChange':
          case 'layoutChange':
            // this.destroy();
            break;
          case 'styleChange':
            this._updateUI(changedData);
            break;
          case 'widgetPoolChange':
            this._verifyRouting();
            break;
          case 'mapChange':
            window.localStorage.setItem(this.Incident_Local_Storage_Key, null);
        }
      },

      _addActionLink: function () {
        var actionLabel = this.nls.actionLabel;
        var actionLink;
        var domNode;
        this.hideContainer = false;
        var infoWin = this.map.infoWindow;
        var aDom = query(".actionList", infoWin.domNode);
        if (aDom.length > 0) {
          domNode = aDom[0];
        } else if (infoWin.popupInfoView && infoWin.popupInfoView.container) {
          domNode = infoWin.popupInfoView.container;
          this.hideContainer = true;
        }
        if (domNode) {
          var aLinks = query("#SA_actionLink", domNode);
          if (aLinks.length > 0) {
            actionLink = aLinks[0];
          } else {
            actionLink = domConstruct.create("a", {
              "class": "action",
              "id": "SA_actionLink",
              "innerHTML": actionLabel,
              "href": "javascript: void(0);"
            }, domNode);
          }
          if (this.hideContainer) {
            domClass.add('SA_actionLink', 'action2');
            this.own(on(infoWin, "show", lang.hitch(this, this._handlePopup)));
          }
          this.own(on(actionLink, "click", lang.hitch(this, this._setEventLocation, this.hideContainer)));
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

      // remove action link
      _removeActionLink: function () {
        if (dom.byId("SA_actionLink")) {
          domConstruct.destroy(dom.byId("SA_actionLink"));
        }
      },

      // update UI
      _updateUI: function(styleName) {
        this._getStyleColor(styleName);
      },

      // get style color
      /*jshint loopfunc:true */
      _getStyleColor: function(styleName) {
        var t = this.appConfig.theme.name;
        var s = this.appConfig.theme.styles[0];
        var lastStyle = this.appConfig.theme.styles[this.appConfig.theme.styles.length - 1];
        if (styleName) {
          s = styleName;
        }
        var url = "./themes/" + t + "/manifest.json";
        xhr.get({
          url: url,
          handleAs: "json",
          load: lang.hitch(this, function(data) {
            var styles = data.styles;
            for (var i = 0; i < styles.length; i++) {
              var st = styles[i];
              if (st.name === s) {
                if (s !== lastStyle) {
                  domStyle.set(this.footerNode, "background-color", st.styleColor);
                  this.config.color = st.styleColor;
                } else {
                  var bc;
                  array.forEach(document.styleSheets, function (ss) {
                    var rules = ss.rules ? ss.rules : ss.cssRules;
                    if (rules) {
                      array.forEach(rules, function (r) {
                        if (r.selectorText === ".jimu-main-background") {
                          bc = r.style.getPropertyValue('background-color');
                        }
                      });
                    }
                  });
                  this.config.color = Color.fromRgb(bc).toHex();
                }
                this.isBlackTheme = st.name === "black" ? true : false;
                if (this.isBlackTheme) {
                  domClass.remove(this.tabNodes[this.curTab], "active");
                  domClass.add(this.tabNodes[this.curTab], "activeBlack");
                } else {
                  domClass.remove(this.tabNodes[this.curTab], "activeBlack");
                  domClass.add(this.tabNodes[this.curTab], "active");
                }
                this._setupSymbols();
                this._bufferIncident();
              }
            }
          })
        });
      },

      /*jshint unused:false */
      setPosition: function (position, containerNode) {
        if (this.widgetActive) {
          var pos;
          var style;
          var m;
          var controllerWidget;
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
              height: "150px",
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
            m = dom.byId('map');
            m.style.bottom = "150px";
            this.map.resize(true);

            if (this.appConfig.theme.name === "TabTheme") {
              this.widgetManager.minimizeWidget(controllerWidget.id);
            }
          } else {
            pos = {
              left: "0",
              right: "0",
              bottom: "0",
              height: "150px",
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
            m = dom.byId('map');
            m.style.bottom = "150px";
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
        this.lyrIncidents.clear();
        this.lyrBuffer.clear();
        var feature = this.map.infoWindow.getSelectedFeature();
        var pData = {
          "eventType": "IncidentLocation",
          "dataValue": feature
        };
        this.onReceiveData("", "", pData);
        if(this.map.infoWindow.isShowing){
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
        }

        //TODO is this the right test?
        if (this.summaryDisplayEnabled) {
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
                this.lyrEdit = this.opLayers.getLayerInfoById(this.config.editLayer).layerObject;
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

                this.own(on(this.lyrEdit, "click", lang.hitch(this, function (results) {
                  if (results.graphic) {
                    this.updateFeature = results.graphic;
                    this._updatePopup(this.updateFeature);
                  }
                })));
                this.editLayerPrototype = this.editTemplate.prototype;
              }
            }));
        }
        this._clickTab(0);
      },

      _initEditInfo: function () {
        if (this.saveEnabled && this.lyrEdit) {
          this.map.infoWindow.resize(350, 340);
          if (this.lyrEdit.infoTemplate) {
            this.defaultContent = this.lyrEdit.infoTemplate.content;
          } else {
            this.defaultContent = undefined;
          }
          this.lyrEdit.infoTemplate.setContent(lang.hitch(this, this._setEditLayerPopup));
        }
      },

      _setPopupFeature: function () {
        this.updateFeature = this.map.infoWindow.getSelectedFeature();
      },

      _selectionChanged: function () {
        this.updateFeature = this.map.infoWindow.getSelectedFeature();
        if (this.updateFeature) {
          this._updatePopup(this.updateFeature);
        }
      },

      _setEditLayerPopup: function (f) {
        var fInfos = [];
        var popupFields = this._getPopupFields(this.lyrEdit);
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
          'featureLayer': this.lyrEdit,
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

        this.own(on(saveButton, "click", lang.hitch(this, function () {
          this.lyrEdit.applyEdits(null, [this.updateFeature], null, lang.hitch(this, function () {
            new Message({
              message: this.nls.updateComplete
            });
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
          this.updateFeature = evt.feature;
          this.updateFeature.attributes[evt.fieldName] = evt.fieldValue;
        })));

        this.own(on(this.attInspector, "next", lang.hitch(this, function (evt) {
          this.updateFeature = evt.feature;
        })));

        this.own(on(this.attInspector, "delete", lang.hitch(this, function (evt) {
          //Test if the feature being deleted matches the incident or incident buffer
          // if so flag the incident to be cleared
          var removeIncident = false;
          if (this.incident) {
            if (geometryEngine.equals(evt.feature.geometry, this.incident.geometry)) {
              removeIncident = true;
            }
            if (!removeIncident && this.lyrBuffer.graphics.length > 0) {
              if (geometryEngine.equals(evt.feature.geometry, this.lyrBuffer.graphics[0].geometry)) {
                removeIncident = true;
              }
            }
          }

          this.lyrEdit.applyEdits(null, null, [evt.feature], lang.hitch(this, function () {
            new Message({
              message: this.nls.deleteComplete
            });
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
          this.updateFeature = this.editLayerPrototype;

          if (removeIncident) {
            this._clear();
          }

          this.map.infoWindow.hide();
        })));
        this.updateFeature = f;
        this.attInspector.showFeature(this.updateFeature);
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

      _updatePopup: function (uf) {
        if (typeof(uf) !== 'undefined') {
          var q = new Query();
          if (uf.hasOwnProperty('attributes')) {
            q.objectIds = [uf.attributes[uf.getLayer().objectIdField]];
          } else {
            q.objectIds = [uf];
          }
          this.lyrEdit.selectFeatures(q, FeatureLayer.SELECTION_NEW, lang.hitch(this, function (results) {
            if (results.length > 0) {
              this.updateFeature = results[0];
              if (!this.attInspector) {
                this._setEditLayerPopup(this.updateFeature);
              }
              if (this.attInspector) {
                this.attInspector.showFeature(this.updateFeature);
              }
            }
          }));
        }
      },

      // process operational layers
      _processOperationalLayers: function() {
        // tab layers
        for (var i = 0; i < this.config.tabs.length; i++) {
          var t = this.config.tabs[i];
          if (t.layers && t.layers !== "") {
            t.tabLayers = this._getTabLayers(t.layers);
          }
        }
      },

      _createUI: function() {
        var units = this.config.distanceUnits;
        var lbl = utils.sanitizeHTML(this.config.bufferLabel ? this.config.bufferLabel : '');
        lbl += " (" + this.nls[units] + ")";

        this.buffer_lbl.innerHTML = lbl;

        var sliderNode = this.horizontalSliderDiv;
        var rulesNode = document.createElement('div');
        sliderNode.appendChild(rulesNode);
        var rulesNodeLabels = document.createElement('div');
        sliderNode.appendChild(rulesNodeLabels);

        var sliderLabels = new HorizontalRuleLabels({
          container: "bottomDecoration",
          minimum: this.config.bufferRange.minimum,
          maximum: this.config.bufferRange.maximum,
          labels: [this.config.bufferRange.minimum, this.config.bufferRange.maximum],
          style: "height:2em;font-size:75%;color:#fff"
        }, rulesNodeLabels);

        var discreteVals = Math.abs(Math.round(this.config.bufferRange.maximum -
          this.config.bufferRange.minimum)) + 1;

        var startVal = this.config.bufferRange.minimum;
        if (startVal > this.config.bufferRange.maximum) {
          startVal = this.config.bufferRange.minimum;
        }

        this.horizontalSlider = new HorizontalSlider({
          value: startVal,
          minimum: this.config.bufferRange.minimum,
          maximum: this.config.bufferRange.maximum,
          discreteValues: discreteVals,
          intermediateChanges: false,
          showButtons: false,
          style: "width:180px;"
        }, sliderNode);

        this.own(on(this.horizontalSlider, "change", lang.hitch(this, this._sliderChange)));

        this.horizontalSlider.startup();
        sliderLabels.startup();

        this.sliderValue.set("value", startVal);

        var defTab = {
          type: "incidents",
          label: this.nls.incident,
          color: this.config.color
        };
        this.config.tabs.splice(0, 0, defTab);
        var iTab = this.SA_tabPanel0;
        this.panelNodes.push(iTab);
        //on(iTab, "scroll", lang.hitch(this, this._onScroll));
        //this._initClickDrag(iTab);

        //tabs
        var pContainer = this.panelContainer;
        var pTabs = this.tabsNode;
        var wTabs = 0;
        //this._initClickDrag(pTabs);
        for (var i = 0; i < this.config.tabs.length; i++) {
          var obj = this.config.tabs[i];
          var label = obj.label;
          if (obj.type === "weather") {
            label = this.nls.weather;
          }
          if (!label || label === "") {
            label = obj.layers;
          }
          var tab = domConstruct.create("div", {
            'data-dojo-attach-point': "SA_tab" + i,
            innerHTML: utils.sanitizeHTML(label ? label : '')
          }, pTabs);
          this.tabNodes.push(tab);
          domClass.add(tab, "SATTab");
          wTabs += domGeom.position(tab).w;
          on(tab, "click", lang.hitch(this, this._clickTab, i));
          if (i > 0) {
            var panel = domConstruct.create("div", {
              'data-dojo-attach-point': "SA_tabPanel" + i,
              innerHTML: this.nls.defaultTabMsg
            }, pContainer);
            this.panelNodes.push(panel);
            domClass.add(panel, "SAT_tabPanel");

            // summary
            if (obj.type === "summary") {
              obj.summaryInfo = new SummaryInfo(obj, panel, this);
              this.own(on(obj.summaryInfo, "summary-complete", lang.hitch(this, this.restore)));
            }

            // grouped summary
            if (obj.type === "groupedSummary") {
              obj.groupedSummaryInfo = new GroupedCountInfo(obj, panel, this);
              this.own(on(obj.groupedSummaryInfo, "summary-complete", lang.hitch(this, this.restore)));
            }

            // weather
            if (obj.type === "weather") {
              obj.weatherInfo = new WeatherInfo(obj, panel, this);
            }

            // closest
            if (obj.type === "closest") {
              obj.closestInfo = new ClosestInfo(obj, panel, this);
            }

            // proximity
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
          on(pTabs, "scroll", lang.hitch(this, this._onPanelScroll));
        }
      },

      restore: function (e) {
        if (e.tab === this.curTab) {
          this._clickTab(e.tab);
        }
      },

      // load UI
      _loadUI: function () {
        var btnTitles = {
          0: this.nls.drawPoint,
          1: this.nls.drawLine,
          2: this.nls.drawPolygon,
          3: this.nls.clearIncident,
          4: this.nls.saveIncident
        };

        this.btnNodes = [this.SA_btn0, this.SA_btn1, this.SA_btn2, this.SA_btn3];

        var cnt = 4;
        if (this.saveEnabled) {
          domClass.remove(this.incidentsLocate, 'SATcol');
          domClass.add(this.incidentsLocate, 'SATcolSave');
          cnt = 5;
          this.saveSpan = domConstruct.create("span", {
            "class": "btn32SaveDisabled"
          }, this.imgContainer);
          this.btnNodes.push(domConstruct.create("img", {
            'data-dojo-attach-point': "SA_btn4"
          }, this.saveSpan));
        }

        for (var i = 0; i < cnt; i++) {
          var btn = this.btnNodes[i];
          if (this.saveEnabled) {
            domClass.remove(btn.parentNode, 'btn32');
            if (i < 4) {
              domClass.add(btn.parentNode, 'btn32Save');
            }
          }
          html.setAttr(btn, 'src', this.folderUrl + 'images/btn' + i + '.png');
          html.setAttr(btn, 'title', btnTitles[i]);
          this.own(on(btn, "click", lang.hitch(this, this._clickIncidentsButton, i)));
        }

        this.toolbar = new Draw(this.map, {
          tooltipOffset: 20,
          drawTime: 90
        });
        this.toolbar.on("draw-end", lang.hitch(this, this._drawIncident));

        this.own(on(this.horizontalSlider, "change", lang.hitch(this, this._sliderChange)));

        this.own(on(this.sliderValue, "keyup", lang.hitch(this, function(event) {
          if (event.keyCode === keys.ENTER) {
            this._updateSliderValue();
          } else {
            var num = this.sliderValue.get("value");
            if(isNaN(num)) {
              this.sliderValue.set("value", this.horizontalSlider.value);
            } else {
              if (num < this.config.bufferRange.minimum) {
                this.sliderValue.set("value", this.config.bufferRange.minimum);
              }
              if (num > this.SLIDER_MAX_VALUE) {
                this.sliderValue.set("value", this.SLIDER_MAX_VALUE);
              }
            }
          }
        })));
      },

      _locateBuffer: function(obj) {
        if (obj !== null) {
          var bufferExtent;
          if (obj.type === "extent") {
            bufferExtent = obj;
          } else {
            bufferExtent = obj.geometry.getExtent();
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
        var cnt = this.saveEnabled ? 5 : 4;
        if (num < cnt) {
          for (var i = 0; i < cnt; i++) {
            btn = this.btnNodes[i];
            domClass.remove(btn, "btnOn");
          }
          if (num > -1 && num !== this.tool) {
            btn = this.btnNodes[num];
            if (num < cnt - 1) {
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
            case 4:
              if (this.incident) {
                this._saveIncident();
              }
              break;
          }
        } else {
          this._clear();
        }
      },

      _saveIncident: function () {
        var newGraphics = [];

        if (this.lyrBuffer.graphics.length < 1 && this.incident.geometry.type !== "polygon") {
          new Message({
            message: this.nls.notPolySave
          });
        }

        for (var i = 0; i < this.lyrBuffer.graphics.length; i++) {
          var graphic = this.lyrBuffer.graphics[i];
          var g = new Graphic();
          g.geometry = graphic.geometry;
          var tempProto = JSON.parse(JSON.stringify(this.editTemplate.prototype));
          g.setAttributes(tempProto.attributes);
          newGraphics.push(g);
        }
        if (newGraphics.length > 0) {
          this.lyrEdit.applyEdits(newGraphics, null, null, lang.hitch(this, function (results) {
            if(results.length > 0){
              if (results[0].success) {
                if (results[0].hasOwnProperty('objectId')) {
                  this._updatePopup(results[0].objectId);
                }
                new Message({
                  message: this.nls.editComplete
                });
                if (!this.map.infoWindow.isShowing) {
                  if (this.lyrBuffer.graphics.length > 0) {
                    var mpPt = this.lyrBuffer.graphics[0].geometry.getCentroid();
                    var scrPt = this.map.toScreen(mpPt);
                    this.map.emit("click", {
                      bubbles: true,
                      cancelable: true,
                      screenPoint: scrPt,
                      mapPoint: mpPt
                    });
                  }
                }
              }
            }
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
        }
        this._clickIncidentsButton(-1);
      },

      _clear: function() {
        this.map.graphics.clear();
        this.lyrIncidents.clear();
        this.lyrBuffer.clear();
        this.lyrProximity.clear();
        this.lyrClosest.clear();
        if (this.summaryDisplayEnabled && this.lyrSummary) {
          this.lyrSummary.clear();
        }
        if (this.summaryDisplayEnabled && this.lyrGroupedSummary) {
          this.lyrGroupedSummary.clear();
        }
        if (this.saveEnabled) {
          domClass.remove(this.saveSpan, "btn32Save");
          domClass.add(this.saveSpan, "btn32SaveDisabled");
        }
        this.incident = null;
        this.buffer = null;
        if (this.div_reversed_address) {
          this.div_reversed_address.innerHTML = "";
        }
        if (this.div_reverse_geocoding) {
          html.setStyle(this.div_reverse_geocoding, 'visibility', 'hidden');
        }
        for (var i = 1; i < this.config.tabs.length; i++) {
          if (this.panelNodes[i]) {
            this.panelNodes[i].innerHTML = this.nls.defaultTabMsg;
          }
        }
        this._clearGraphics();

        if (this.lyrEdit) {
          this.updateFeature = this.editLayerPrototype;
        }
        this._clearMobileSetAsIncidentStyle();
      },

      _clearMobileSetAsIncidentStyle: function () {
        domConstruct.destroy(dom.byId("_tempMainSectionOverride"));
      },

      _sliderChange: function() {
        this.sliderValue.set("value", this.horizontalSlider.value);
        this._bufferIncident();
      },

      _sliderTextChange: function() {
        if (this.sliderValue.value < 0 || this.sliderValue.value > this.SLIDER_MAX_VALUE) {
          // new Message({
          //   message: this.nls.sliderTextOutOfRange
          // });
          this.sliderValue.set("value", this.horizontalSlider.value);
        } else {
          this.horizontalSlider.set("value", this.sliderValue.value);
        }
      },

      _updateSliderValue: function() {
        if (this.sliderValue.displayedValue < 0 ||
          this.sliderValue.displayedValue > this.SLIDER_MAX_VALUE) {
          // new Message({
          //   message: this.nls.sliderTextOutOfRange
          // });
          this.sliderValue.set("value", this.horizontalSlider.value);
        } else {
          this.horizontalSlider.set("value", this.sliderValue.displayedValue);
        }
      },

      // click tab
      _clickTab: function(num) {
        this._toggleTabs(num);
        this._toggleTabLayers(num);
        this.curTab = num;
        this._clickIncidentsButton(-1);
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
                this.lyrSummary.infoTemplate = tab.tabLayers[1].infoTemplate;
                array.forEach(tab.tabLayers[1].graphics, lang.hitch(this, function (graphic) {
                  this.lyrSummary.add(graphic);
                }));
                this.lyrSummary.setVisibility(true);
                if (bToggle) {
                  this.currentSumLayer = num;
                  this._toggleTabLayersNew(num);
                }
              }
            }
            if (this.incident && tab.updateFlag === true) {
              var gl = this.summaryDisplayEnabled ? this.lyrSummary : null;
              if (this.buffer) {
                tab.summaryInfo.updateForIncident(this.incident, this.buffer, gl, num);
              }
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
                this.lyrGroupedSummary.infoTemplate = tab.tabLayers[1].infoTemplate;
                array.forEach(tab.tabLayers[1].graphics, lang.hitch(this, function (graphic) {
                  this.lyrGroupedSummary.add(graphic);
                }));
                this.lyrGroupedSummary.setVisibility(true);
                if (cToggle) {
                  this.currentSumLayer = num;
                  this._toggleTabLayersNew(num);
                }
              }
            }
            if (this.incident && tab.updateFlag === true) {
              var l = this.summaryDisplayEnabled ? this.lyrGroupedSummary : null;
              if (this.buffer) {
                tab.groupedSummaryInfo.updateForIncident(this.incident, this.buffer, l, num);
              }
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
            if (this.incident && tab.updateFlag === true) {
              tab.weatherInfo.updateForIncident(this.incident);
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
            if (this.incident) {
              if (tab.updateFlag === false) {
                this.lyrClosest.clear();
              }
              tab.closestInfo.updateForIncident(this.incident,
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
            if (this.incident && this.buffer) {
              if (tab.updateFlag === false) {
                this.lyrProximity.clear();
              }
              tab.proximityInfo.updateForIncident(this.incident, this.buffer, this.lyrProximity);
              tab.updateFlag = false;
            } else if (this.incident && tab.updateFlag === true && !this.buffer) {
              tab.proximityInfo.container.innerHTML = this.nls.defaultTabMsg;
            }
            break;
        }
        tab.updateFlag = false;
      },

      // draw incidents
      _drawIncident: function(evt, v) {
        //this.lyrIncidents.clear();
        var type = evt.geometry.type;
        var sym = this.symPoint;
        if (type === "polyline") {
          sym = this.symLine;
        }
        if (type === "polygon") {
          sym = this.symPoly;
        }
        this.incident = new Graphic(evt.geometry, sym);
        this.lyrIncidents.add(this.incident);
        this.toolbar.deactivate();
        this._clickIncidentsButton(-1);
        if (this.saveEnabled) {
          domClass.remove(this.saveSpan, "btn32SaveDisabled");
          domClass.add(this.saveSpan, "btn32Save");
        }
        this._bufferIncident(v);
        if (type === "point") {
          this._getIncidentAddress(evt.geometry);
        }
        this.div_reversed_address.innerHTML = "";
        html.setStyle(this.div_reverse_geocoding, 'visibility', 'hidden');
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
          var symText = new TextSymbol(address, fnt, "#000000");
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
      _bufferIncident: function(v) {
        if (this.incident === null) {
          return;
        }

        for (var i = 0; i < this.config.tabs.length; i++) {
          var t = this.config.tabs[i];
          t.updateFlag = true;
        }

        var gra = this.incident;
        this.buffer = null;
        this.lyrBuffer.clear();
        var dist1 = this.horizontalSlider.value;
        var unit1 = this.config.distanceUnits;
        var unitCode = this.config.distanceSettings[unit1];

        if (dist1 > 0) {

          var wkid = gra.geometry.spatialReference.wkid;
          var bufferGeom;
          if (wkid === 4326 || wkid === 3587 || wkid === 102100) {
            bufferGeom = geometryEngine.geodesicBuffer(gra.geometry, dist1, unitCode);
          } else {
            bufferGeom = geometryEngine.buffer(gra.geometry, dist1, unitCode);
          }
          if (!v) {
            this._locateBuffer(bufferGeom.getExtent());
          }
          this.buffer = new Graphic(bufferGeom, this.symBuffer);
          this.lyrBuffer.add(this.buffer);
          this._performAnalysis();

        } else {

          if (gra.geometry.type === "polygon") {
            if (!v) {
              this._locateBuffer(gra.geometry.getExtent());
            }
            this.buffer = new Graphic(gra.geometry, this.symPoly);
            this.lyrBuffer.add(this.buffer);
            this._performAnalysis();
          }
        }

      },

      _performAnalysis: function() {
        this._toggleTabLayersNew(this.curTab);
      },

      // VERIFY ROUTING
      _verifyRouting: function() {
        if (this.config.enableRouting) {
          this.config.enableRouting = false;
          var dirWidgetFound = this.findWidget(this.appConfig.widgetPool.widgets);

          //check widgets on screen also
          if (!dirWidgetFound) {
            this.findWidget(this.appConfig.widgetOnScreen.widgets);
          }
        }
      },

      findWidget: function (widgets) {
        var dirWidgetFound = false;
        array.forEach(widgets, lang.hitch(this, function (w) {
          if (w.name === "Directions") {
            this.dirConfig = w;
            this.config.enableRouting = true;
            dirWidgetFound = true;
          }
        }));
        return dirWidgetFound;
      },

      // ZOOM TO LOCATION
      zoomToLocation: function(loc) {
        this.map.centerAndZoom(loc, this.config.defaultZoomLevel);
      },

      // ROUTE TO INCIDENT
      routeToIncident: function(loc) {
        var geom = this.incident.geometry;
        var pt = geom;
        if (geom.type !== "point") {
          pt = null;
        }
        this.stops = [pt, loc];
        // TODO: send data to directions widget
        var id = this.dirConfig.id;
        var name = this.appConfig.theme.name;

        if (this.dirConfig.isOnScreen) {
          this._showDirections(this.dirConfig);
        } else {
          var controllerWidget = this.widgetManager.getControllerWidgets()[0];
          switch (name) {
            case "BoxTheme":
            case "DartTheme":
              controllerWidget.setOpenedIds([id]);
              break;
            case "FoldableTheme":
            case "JewelryBoxTheme":
              var node = controllerWidget._getIconNodeById(id);
              if (node) {
                controllerWidget._onIconClick(node);
              }
              break;
            case "TabTheme":
              controllerWidget._hideOffPanelWidgets();
              var tabs = controllerWidget.tabs;
              var idx = 0;
              for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].flag !== "more") {
                  if (tabs[i].config.id === id) {
                    idx = i;
                    break;
                  }
                } else {
                  idx = i;
                  var groups = tabs[i].config.groups;
                  for (var j = 0; j < groups.length; j++) {
                    if (groups[j].id === id) {
                      controllerWidget._addGroupToMoreTab(groups[j]);
                    }
                  }
                }
              }
              controllerWidget.selectTab(idx);
              setTimeout(lang.hitch(controllerWidget, controllerWidget._resizeToMax), 500);
              break;
            case "LaunchpadTheme":
              controllerWidget.setOpenedIds([id]);
              break;
            default:
              this.openWidgetById(id);
              break;
          }
        }
        setTimeout(lang.hitch(this, this._addStops), 2000);
      },

      _showDirections: function (iconConfig) {
        this.widgetManager.triggerWidgetOpen(iconConfig.id);
      },

      _addStops: function() {
        var w = this.widgetManager.getWidgetById(this.dirConfig.id);
        if (w && w.state !== "closed") {
          var d = w._dijitDirections;
          if (d) {
            d.clearDirections();
            d.removeStops();
            d.reset();
            d.addStops(this.stops);
          }
        }
      },

      // get tab layers
      _getTabLayers: function(names) {
        var lyrs = [];
        array.forEach(this.opLayers._layerInfos, lang.hitch(this, function(layer) {
          if(layer.newSubLayers.length > 0) {
            this._recurseOpLayers(layer.newSubLayers, lyrs, names);
          } else {
            if (names.indexOf(layer.title) > -1) {
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
            if (pNames.indexOf(Node.title) > -1) {
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
      },

      onReceiveData: function(name, widgetId, data) {
        if (data !== null && data.eventType) {
          if (data.eventType === "IncidentLocation") {
            if (data.dataValue && data.dataValue !== null) {
              this._clickTab(0);
              var feature = data.dataValue;
              // if shapefile, use as incident directly
              if (feature.attributes[this.shapeFlagFieldName]) {
                this.incident = feature;
                this._bufferIncident();
              } else {
                this._drawIncident(feature);
              }
            }
          } else if (data.eventType === "WebMapChanged") {
            this._storeIncidents();
          }
        }
      },

      _storeIncidents: function() {
        if (this.incident !== null) {
          var obj_to_store = {
            "location": JSON.stringify(this.incident.geometry.toJson()),
            "hasBuffer": this.lyrBuffer.graphics.length > 0,
            "buffer_dist": this.horizontalSlider.value,
            "unit": this.config.distanceUnits,
            "curTab": this.curTab,
            "extent": JSON.stringify(this.map.extent.toJson())
          };
          var s_obj = JSON.stringify(obj_to_store);

          window.localStorage.setItem(this.Incident_Local_Storage_Key, s_obj);
          console.log("Inclident saved to storage");
        }
      },

      _restoreIncidents: function() {
        var stored_incident = window.localStorage.getItem(this.Incident_Local_Storage_Key);
        if (stored_incident !== null && stored_incident !== "null") {
          window.localStorage.setItem(this.Incident_Local_Storage_Key, null);
          var obj = JSON.parse(stored_incident, true);
          var buffer_dist = obj.buffer_dist;
          var incident_geog = JSON.parse(obj.location);
          var objP = {
            geometry: geometryJsonUtils.fromJson(incident_geog)
          };
          this.sliderValue.set("value", buffer_dist);
          this.horizontalSlider.set("value", buffer_dist);
          for (var i = 0; i < this.config.tabs.length; i++) {
            var t = this.config.tabs[i];
            t.restore = true;
          }
          this._drawIncident(objP, true);
          this._clickTab(obj.curTab, true);
          var ext = geometryJsonUtils.fromJson(JSON.parse(obj.extent));
          this.map.setExtent(ext, true);
        }
      },

      _resize: function (e) {
        try {
          this._onPanelScroll(this.curTab);
          if (this.hideContainer) {
            this._handlePopup();
          }
          this._clearMobileSetAsIncidentStyle();
          this._removeActionLink();
          this._resetInfoWindow();
          this._initEditInfo();
          this._addActionLink();
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
              this.initalLayerVisibility[layer.id] = layer.visible;
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
        if (this.defaultContent) {
          this.lyrEdit.infoTemplate.setContent(this.defaultContent);
        }

        if (this.defaultPopupSize) {
          this.map.infoWindow.resize(this.defaultPopupSize.width, "auto");
        }

        var aDom = query(".actionList", this.map.infoWindow.domNode);
        if (aDom.length > 0) {
          if (aDom[0].innerHTML.indexOf(this.nls.actionLabel) > 0) {
            domConstruct.destroy("SA_actionLink");
          }
        }

        if (this.map.infoWindow.isShowing) {
          this.map.infoWindow.hide();
        }
      },

      _resetMapDiv: function () {
        var m = dom.byId('map');
        m.style.bottom = "0px";
        this.map.resize(true);
      },

      // close
      _close: function () {
        this.widgetManager.closeWidget(this.id);
      }
    });
  });