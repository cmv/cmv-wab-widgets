define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dojo/dom-construct",
  "dojo/query",
  "dojo/_base/array",
  "dojo/_base/lang",
  "dijit/layout/ContentPane",
  "dojo/dom-attr",
  "dojo/dom-style",
  "dojo/dom-class",
  "dojo/on",
  "dojo/Deferred",
  "dojo/Evented",
  "dojo/promise/all",
  "jimu/dijit/Message",
  "jimu/dijit/TabContainer",
  "dojo/text!./item-list.html",
  "esri/Color",
  "esri/dijit/Directions",
  "esri/dijit/PopupTemplate",
  "esri/graphic",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",
  "esri/SpatialReference",
  "esri/geometry/geometryEngine",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/tasks/query",
  "esri/tasks/RelationshipQuery",
  "esri/units",
  "dojo/_base/fx",
  "dojo/number",
  "jimu/LayerInfos/LayerInfos",
  "jimu/FilterManager",
  "esri/geometry/webMercatorUtils",
  "dijit/registry",
  "esri/renderers/jsonUtils"
], function (
  declare,
  _WidgetBase,
  domConstruct,
  query,
  array,
  lang,
  ContentPane,
  domAttr,
  domStyle,
  domClass,
  on,
  Deferred,
  Evented,
  All,
  Message,
  TabContainer,
  itemListTemplate,
  Color,
  Directions,
  PopupTemplate,
  Graphic,
  Point,
  Polyline,
  Polygon,
  SpatialReference,
  GeometryEngine,
  FeatureLayer,
  GraphicsLayer,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleMarkerSymbol,
  Query,
  RelationshipQuery,
  units,
  fx,
  number,
  LayerInfos,
  FilterManager,
  webMercatorUtils,
  registry,
  rendererJsonUtils
) {
  // to create a widget, derive it from BaseWidget.
  return declare([_WidgetBase, Evented], {
    _itemListTemplate: itemListTemplate,
    _serviceArea: null, //object to store the search buffer area geometry
    _operationalLayers: null, //object to store configured search layers
    _selectedPoint: null, //object to store searched location
    _panels: {}, //object to store the panels
    _currentPanel: null, //object to store currently opened panel
    map: null, //to store map instance
    config: null, //to store widget configuration
    folderUrl: null, //to store widget path
    loading: null, //to store loading indicator instance
    nls: null, //to store nls strings
    parentDiv: null, //to store widget parent container
    outerContainer: null, //div to contain domNode of the widget
    _featureListContent: null, //div to store feature list panel
    _featureInfoPanel: null, //div to contain feature's popup content
    _directionInfoPanel: null, //div to contain direction widget
    _tabContainer: null, //tab container dijit
    _isNoFeature: null, //flag to identify if no feature found for all the layers
    _isSlide: true, //flag to check if animation is in progress
    _loadAttachmentTimer: null, //timer to load the attachments when info panel gets opened
    _failedLayers: [], //array to store the title of the layers, which is failed to fetch the features
    _routeCalculated: false, //flag to check whether direction data is calculated or not
    _selectedLayer: null, //to store selected layer
    _selectedItem: null, //to store selected layer div
    _selectedFeature: null, //to store selected feature
    _selectedFeatureItem: null, //to store selected feature div
    _featureGraphicsLayer: null, //to store graphic layer instance to highlight selected feature on map
    _directionsWidget: null, //to store direction widget instance
    _layerCount: null, //to store total layer count to show content Panel accordingly
    _tables: [],//to contains related tables for map layers
    _searchedFeatures: {},//to hold all the searched features, will be used for creating list

    postCreate: function () {
      this._tables = []; //to contains related tables for map layers
      this._panels = {}; //object to store the panels
      this._failedLayers = [];//array to store the title of the layers, which is failed to fetch the features
      this._operationalLayers = null; //object to store configured search layers
      this._searchedFeatures = {}; //to hold all the searched features, will be used for creating list
      this.domNode = domConstruct.create("div", {
        "class": "esriCTItemListMainContainer"
      }, this.outerContainer);
      //get filter manager instance
      this.filterManager = FilterManager.getInstance();
      //get updated filters on the layer
      this._getUpdatedLayerFilters();
      //create panels to display data
      this._createPanels();
      //create feature layers
      this._loadFeatureLayers();
      //create graphics layer to add graphic to highlight selected feature
      this._featureGraphicsLayer = new GraphicsLayer();
      this.map.addLayer(this._featureGraphicsLayer);
    },

    /**
    * create panels to display results
    * @memberOf widgets/NearMe/item-list
    **/
    _createPanels: function () {
      var templateDiv;
      //create container for layer list
      this._panels.layerListPanel = domConstruct.create("div", {
        "class": "esriCTLayerList"
      }, this.domNode);
      //create container for feature list
      this._panels.featureListPanel = domConstruct.create("div", {
        "class": "esriCTFeatureList"
      }, this.domNode);
      templateDiv = domConstruct.toDom(this._itemListTemplate).childNodes[0];
      domClass.add(templateDiv, "esriCTPanelHeader");
      this._panels.featureListPanel.appendChild(templateDiv);
      this._featureListContent = domConstruct.create("div", {
        "class": "esriCTFeatureListContent"
      }, null);
      //set configured text color for feature list
      domStyle.set(this._featureListContent, "color", this.config.fontColor);
      this._panels.featureListPanel.appendChild(this._featureListContent);
      //attach click event on left to navigate to previous panel
      this._attachEventOnBackButton(this._panels.featureListPanel);
      this._panels.infoPanel = domConstruct.create("div", {
        "class": "esriCTDirectionInfoPanel"
      }, this.domNode);
      templateDiv = domConstruct.toDom(this._itemListTemplate).childNodes[0];
      domClass.add(templateDiv, "esriCTPanelHeader");
      this._panels.infoPanel.appendChild(templateDiv);
      this._attachEventOnBackButton(this._panels.infoPanel);
      //create container to display feature popup info
      this._featureInfoPanel = new ContentPane({}, null);
      this._featureInfoPanel.startup();
      //check if routing is enabled in webmap
      if (this.map.webMapResponse.itemInfo.itemData.applicationProperties &&
        this.map.webMapResponse.itemInfo.itemData.applicationProperties
          .viewing.routing.enabled) {
        //create tab container to display directions from searched location to selected feature
        this._directionInfoPanel = new ContentPane({}, null);
        this._directionInfoPanel.startup();
        //create tab container to display selected feature popup info and directions
        this._tabContainer = new TabContainer({
          tabs: [{
            title: this.nls.informationTabTitle,
            content: this._featureInfoPanel
          }, {
            title: this.nls.directionTabTitle,
            content: this._directionInfoPanel
          }]
        }, domConstruct.create("div", {
          "class": "esriCTTabContainer"
        }, this._panels.infoPanel));
        this._tabContainer.startup();
        this.own(this._tabContainer.on("tabChanged", lang.hitch(this, function (selectedTab) {
          this.emit("tab-change", selectedTab);
          if (selectedTab === this.nls.directionTabTitle && !this._routeCalculated) {
            //get directions
            this._initializeDirectionWidget();
          }
          if (this.parentDivId && registry.byId(this.parentDivId) &&
            registry.byId(this.parentDivId).resize) {
            registry.byId(this.parentDivId).resize();
          }
        })));
      } else {
        //if routing is not enabled on webmap then, panel to display feature info will be created
        this._panels.infoPanel.appendChild(this._featureInfoPanel.domNode);
        domClass.add(this._featureInfoPanel.domNode, "esriCTFeatureInfo");
        var jimuTabNode =
          query(".esriCTItemListMainContainer .esriCTDirectionInfoPanel .esriCTPanelHeader");
        if (jimuTabNode) {
          domClass.add(jimuTabNode[0], "esriCTBorderBottom");
        }
      }
      if (this.parentDivId && registry.byId(this.parentDivId) &&
        registry.byId(this.parentDivId).resize) {
        registry.byId(this.parentDivId).resize();
      }
    },

    /**
    * attach 'click' event on back button to navigate to previous panel
    * @param{object} panel
    * @memberOf widgets/NearMe/item-list
    **/
    _attachEventOnBackButton: function (panel) {
      var divItemTitle, divBackButton;
      divItemTitle = query(".esriCTItemlList", panel)[0];
      divBackButton = query(".esriCTBackButton", panel)[0];
      if (divItemTitle && divBackButton) {
        this.own(on(divItemTitle, "click", lang.hitch(this, function (event) {
          event.stopPropagation();
          if (domStyle.get(divBackButton, "display") !== "none") {
            if (this._isSlide) {
              this._isSlide = false;
              this._selectedItem = null;
              this._clearGrahics();
              //clear directions if navigate to feature list
              this._clearDirections();
              //check if back button is clicked to navigate to feature list panel or layer list panel
              if (!this._isFeatureList) {
                this.loading.hide();
                this._clearContent(this._featureListContent);
                if (this.config.selectedSearchLayerOnly) {
                  //show all layers
                  this.showAllLayers();
                }
                this._selectedLayer = null;
                this._isFeatureList = false;
                this._showPanel("layerListPanel", true);
              } else {
                this._isFeatureList = false;
                this._showPanel("featureListPanel", true);
              }
            }
          }
        })));
      }
    },

    /**
    * load configured layers as feature layers
    * @memberOf widgets/NearMe/item-list
    **/
    _loadFeatureLayers: function () {
      var featureLayer, i;
      this._operationalLayers = [];
      this._tables = this.map.webMapResponse.itemInfo.itemData.tables;
      for (i = 0; i < this.config.searchLayers.length; i++) {
        //filter layers which has popup info
        if (this.config.searchLayers[i].popupInfo) {
          //initialize feature layer with the popup template configured in webmap
          featureLayer = new FeatureLayer(this.config.searchLayers[i].url, {
            infoTemplate: new PopupTemplate(this.config.searchLayers[i].popupInfo)
          });
          //check whether id is available
          if (this.config.searchLayers[i].id) {
            featureLayer.id = this.config.searchLayers[i].id;
          }
          featureLayer.title = this.config.searchLayers[i].title;
          //set definition expression configured in webmap
          if (this.config.searchLayers[i].definitionExpression) {
            featureLayer.setDefinitionExpression(this.config.searchLayers[i].definitionExpression);
          }
          //set renderer configured in webmap
          if (this.config.searchLayers[i].renderer) {
            featureLayer.setRenderer(rendererJsonUtils.fromJson(
              this.config.searchLayers[i].renderer));
          }
          featureLayer.index = i;
          featureLayer.layerIndex = this._operationalLayers.length;
          featureLayer.isMapServer = this.config.searchLayers[i].isMapServer;
          //set attachment visibility in layer as configured in webmap
          featureLayer.showAttachments = this.config.searchLayers[i].popupInfo.showAttachments;
          this._operationalLayers.push(featureLayer);
          this._onLayerLoad(featureLayer);
        }
      }
    },

    /**
    * Check whether layer is loaded if not then wait until it gets loaded
    * @param{object} layer object
    * @memberOf widgets/NearMe/item-list
    **/
    _onLayerLoad: function (featureLayer) {
      //get related table information
      if (featureLayer.loaded) {
        featureLayer.tableInfos = this._getRelatedTableInfo(featureLayer.index);
      } else {
        this.own(featureLayer.on("load", lang.hitch(this, function () {
          featureLayer.tableInfos = this._getRelatedTableInfo(featureLayer.index);
        })));
      }
    },

    /**
    * Get related table info
    * @param{int} layer index in array
    * @memberOf widgets/NearMe/item-list
    **/
    _getRelatedTableInfo: function (layerIndex) {
      var layer, tableInfos = [];
      layer = this._operationalLayers[layerIndex];
      if (layer) {
        array.forEach(layer.relationships, lang.hitch(this, function (table) {
          array.forEach(this._tables, lang.hitch(this, function (tableData,
            index) {
            if (tableData.url.replace(/.*?:\/\//g, "") === (this.config.searchLayers[index].baseURL + table.relatedTableId).replace(/.*?:\/\//g, "")) {
              if (tableData.popupInfo) {
                //if popup is enabled for related table
                if (!tableData.relationshipIds) {
                  tableData.relationshipIds = {};
                }
                tableData.relationshipIds[layer.id] = table.id;
                tableInfos.push(index);
              }
            }
          }));
        }));
      }
      return tableInfos;
    },

    /**
    * Returns true if their are layers to be searched.
    * layers may be configured but not having popup enabled
    * will be not be considered for search
    * @memberOf widgets/NearMe/item-list
    **/
    hasValidLayers: function () {
      if (this._operationalLayers && this._operationalLayers.length > 0) {
        return true;
      }
      return false;
    },

    /**
    * clear content of the div
    * @param{object} div
    * @memberOf widgets/NearMe/item-list
    **/
    _clearContent: function (resultPanel) {
      if (resultPanel) {
        domConstruct.empty(resultPanel);
      }
    },

    /**
    * create layer list with the feature count for selected buffer area
    * @param{object} searchedLocation
    * @param{object} serviceArea
    * @memberOf widgets/NearMe/item-list
    **/
    displayLayerList: function (searchedLocation, serviceArea) {
      var featureDeferArr = [];
      this.loading.hide();
      this._layerCount = 0;
      this._isNoFeature = true;
      this._isSlide = true;
      this.clearResultPanel();
      //get updated filters on the layer
      this._getUpdatedLayerFilters();
      this._searchedFeatures = {};
      if (this.config.selectedSearchLayerOnly) {
        //show all layers
        this.showAllLayers();
      }
      this._setSeachedLocation(searchedLocation);
      this._setServiceArea(serviceArea);
      //clear failed layer list
      this._failedLayers = [];
      //check whether only one layer is available
      this._filterConfiguredLayer(featureDeferArr);
      All(featureDeferArr).then(lang.hitch(this, function () {
        this._onFeatureCountComplete();
      }));
    },

    /**
      * Using jimu LayerInfos returns the updated the layer filters on each search layer
      * @memberOf widgets/NearMe/item-list
      */
    _getUpdatedLayerFilters: function () {
      LayerInfos.getInstance(this.map, this.map.webMapResponse.itemInfo).then(
        lang.hitch(this, function (layerInfosObj) {
          array.forEach(this.config.searchLayers, lang.hitch(this,
            function (currentLayer) {
              var mapLayer = layerInfosObj.getLayerInfoById(
                currentLayer.id);
              if (mapLayer) {
                currentLayer.definitionExpression = mapLayer.getFilter();
              }
            }));
        }));
    },

    /**
    * function checks wheather count of layer configured is more than 1 and creates layer list or displays features accordingly
    * @param{array} featureDeferArr
    * @memberOf widgets/NearMe/item-list
    **/
    _filterConfiguredLayer: function (featureDeferArr) {
      //check whether only one layer is available
      if (this._operationalLayers.length > 1) {
        this._currentPanel = this._panels.layerListPanel;
        domStyle.set(this._currentPanel, 'display', 'block');
        domStyle.set(this._currentPanel, 'left', '0px');
        //create layers list
        for (var i = 0; i < this._operationalLayers.length; i++) {
          //query to display feature count
          this._resetFilter(this._operationalLayers[i].layerIndex);
          this._createItemTemplate(this._operationalLayers[i], featureDeferArr);
        }
      } else {
        //display feature list Panel
        this._layerCount = 1;
        this._resetFilter(this._operationalLayers[0].layerIndex);
        this._onSingleLayerFound(featureDeferArr, this._operationalLayers[0]);
      }
    },

    /**
    * display feature list panel if single layer is configured
    * @param{array} featureDeferArr
    * @param{object} opLayer
    * @memberOf widgets/NearMe/item-list
    **/
    _onSingleLayerFound: function (featureDeferArr, opLayer) {
      var divBackButton, defer;
      if (featureDeferArr) {
        defer = new Deferred();
        featureDeferArr.push(defer);
      }
      divBackButton = query(".esriCTBackButton", this._panels.featureListPanel)[0];
      if (divBackButton) {
        domStyle.set(divBackButton, 'display', 'none');
      }
      this._currentPanel = this._panels.featureListPanel;
      domStyle.set(this._currentPanel, 'display', 'block');
      domStyle.set(this._currentPanel, 'left', '0px');
      if (opLayer) {
        this._displayFeatureList(opLayer, defer);
      }
    },

    /**
    * function displays feature Info Panel if only 1 feature found
    * @param{object} feature
    * @memberOf widgets/NearMe/item-list
    **/
    _onSingleFeatureFound: function (feature) {
      var featureId, infoPanelBackBtn;
      featureId = feature.attributes[this._selectedLayer.objectIdField];
      this._displayFilteredFeatures(featureId);
      this._showFeatureDetails(null, feature);
      //hide featureListPanel and Back Button on infoPanel
      infoPanelBackBtn = query(".esriCTBackButton", this._panels.infoPanel)[0];
      if (infoPanelBackBtn) {
        domStyle.set(infoPanelBackBtn, 'display', 'block');
        if (this._layerCount === 1) {
          domStyle.set(infoPanelBackBtn, "display", "none");
          domStyle.set(this._panels.featureListPanel, "display", "none");
        }
      }
    },

    /**
    * create template for layer list
    * @param{object} operationalLayer
    * @param{array} featureDeferArr
    * @memberOf widgets/NearMe/item-list
    **/
    _createItemTemplate: function (operationalLayer, featureDeferArr) {
      var templateDiv;
      templateDiv = domConstruct.toDom(this._itemListTemplate).childNodes[0];
      domClass.add(templateDiv, "esriCTDisabled");
      //set configured text color for template
      domStyle.set(templateDiv, "color", this.config.fontColor);
      this._currentPanel.appendChild(templateDiv);
      //set layer title as a name field in template
      this._setItemName(templateDiv, operationalLayer.title);
      //query to display feature count
      this._queryForCountOnly(templateDiv, operationalLayer, featureDeferArr);
      //attach click event on left arrow
      this._attachClickEvent(templateDiv, operationalLayer, true);
    },

    /**
    * set itemName field in template
    * @param{object} template div
    * @param{string} value to be displayed
    * @memberOf widgets/NearMe/item-list
    **/
    _setItemName: function (templateDiv, value) {
      var divItemName = query(".esriCTItemName", templateDiv)[0];
      if (divItemName) {
        domAttr.set(divItemName, "innerHTML", value);
        domAttr.set(divItemName, "title", value);
      }
    },

    /**
    * attach click event on layer template div
    * @param{object} templateDiv
    * @param{string} item
    * @memberOf widgets/NearMe/item-list
    **/
    _attachClickEvent: function (templateDiv, item) {
      this.own(on(templateDiv, "click", lang.hitch(this, function (event) {
        if (!domClass.contains(templateDiv, "esriCTDisabled") && this._isSlide) {
          var featureListPanelBackBtn;
          event.stopPropagation();
          this._isSlide = false;
          this._selectedItem = templateDiv;
          featureListPanelBackBtn = query(".esriCTBackButton", this._panels.featureListPanel)[0];
          if (featureListPanelBackBtn) {
            domStyle.set(featureListPanelBackBtn, "display", "block");
          }
          this._displayFeatureList(item, null);
        }
      })));
    },

    /**
    * display feature list
    * @param{object} item
    * @param{object} defer
    * @memberOf widgets/NearMe/item-list
    **/
    _displayFeatureList: function (item, defer) {
      this._clearContent(this._featureListContent);
      this._selectedLayer = item;
      //check if routing is enabled in webmap
      if (this.map.webMapResponse.itemInfo.itemData.applicationProperties &&
        this.map.webMapResponse.itemInfo.itemData.applicationProperties
          .viewing.routing.enabled) {
        var jimuTab, tabNode, jimuTabNode;
        jimuTab = query(".jimu-tab", this._panels.infoPanel);
        tabNode = query(".jimu-tab .control", this._panels.infoPanel);
        jimuTabNode = query(
          ".esriCTItemListMainContainer .esriCTDirectionInfoPanel .esriCTPanelHeader"
        );
        // layer geometry type is polygon && Only return polygons that intersect
        // the search location flag is enabled
        if (tabNode && tabNode[0] && jimuTab && jimuTab[0] && jimuTabNode &&
          jimuTabNode[0]) {
          if (item.geometryType === "esriGeometryPolygon" &&
            this.config.intersectSearchedLocation) {
            domClass.add(jimuTab[0], "esriCTOverrideHeight");
            domClass.add(tabNode[0], "esriCTHidden");
            domClass.add(jimuTabNode[0], "esriCTBorderBottom");
          } else {
            domClass.remove(jimuTab[0], "esriCTOverrideHeight");
            domClass.remove(tabNode[0], "esriCTHidden");
            domClass.remove(jimuTabNode[0], "esriCTBorderBottom");
          }
        }
      }
      this._setItemName(this._panels.featureListPanel, this._selectedLayer.title);
      this._queryForFeatureList(defer);
    },

    /**
    * create query parameters
    * @memberOf widgets/NearMe/item-list
    **/
    _getQueryParams: function () {
      var queryParams = new Query();
      queryParams.geometry = this._serviceArea || this.map.extent;
      queryParams.spatialRelationship = "esriSpatialRelIntersects";
      queryParams.outFields = ["*"];
      return queryParams;
    },

    /**
    * query layer to get number of features present in current buffer area
    * @param{object} template div
    * @param{object} opLayer
    * @param{array} featureDeferArr
    * @memberOf widgets/NearMe/item-list
    **/
    _queryForCountOnly: function (templateDiv, opLayer, featureDeferArr) {
      var defer, queryParams;
      queryParams = this._getQueryParams();
      // if intersectSearchedLocation option is set to true in widget configuration and layer is polygon layer then, query for feature
      // which are intersecting searched location instead of buffer area
      if (this.config.intersectSearchedLocation && opLayer.geometryType === "esriGeometryPolygon") {
        queryParams.geometry = this._selectedPoint.geometry;
      }
      defer = new Deferred();
      opLayer.queryFeatures(queryParams, lang.hitch(this, function (featureSet) {
        if (featureSet.features.length > 0) {
          this._selectedLayer = opLayer;
          this._layerCount++;
          this._searchedFeatures[opLayer.id] = featureSet.features;
          this._setItemCount(templateDiv, featureSet.features.length, true);
          this._showFilteredFeaturesOnLoad(featureSet.features, opLayer.id);
        } else {
          domStyle.set(templateDiv, 'display', 'none');
          if (this.config.selectedSearchLayerOnly) {
            this._showHideOperationalLayer(opLayer.url, opLayer.id, false);
          }
        }
        defer.resolve();
      }), lang.hitch(this, function () {
        if (templateDiv) {
          domStyle.set(templateDiv, 'display', 'none');
          this._showHideOperationalLayer(opLayer.url, opLayer.id, false);
        }
        this._failedLayers.push(opLayer.title);
        defer.resolve();
      }));
      featureDeferArr.push(defer);
    },

    /**
    * Returns feature layer details form stored operationalLayer array
    * @param{string} id
    * @memberOf widgets/NearMe/item-list
    **/
    _getFeatureLayerDetailsFormArray: function (id) {
      var i, layerCount;
      if (this._operationalLayers && this._operationalLayers.length > 0) {
        layerCount = this._operationalLayers.length;
        for (i = 0; i < layerCount; i++) {
          if (this._operationalLayers[i].id === id) {
            return this._operationalLayers[i];
          }
        }
      }
      return null;
    },

    /**
    * Shows only selected features on map if selectedSearchLayerOnly flag is set
    * @param{array} features
    * @param{string} layerID
    * @memberOf widgets/NearMe/item-list
    **/
    _showFilteredFeaturesOnLoad: function (features, layerID) {
      var i, featureIds = '', maxFeatureLength, filter, opLayer;
      opLayer = this._getFeatureLayerDetailsFormArray(layerID);
      if (this.config.selectedSearchLayerOnly) {
        //sort features according to distance.
        if (features.length > 1) {
          features = this._getSortedFeatureList(features);
        }
        maxFeatureLength = this._getMaxResultCountValue(features.length, opLayer.maxRecordCount);
        //Directly display feature Info Pane if only 1 feature found
        if (maxFeatureLength) {
          for (i = 0; i < maxFeatureLength; i++) {
            if (featureIds) {
              featureIds += ',';
            }
            featureIds += features[i].attributes[this._selectedLayer.objectIdField];
          }
          filter = this._selectedLayer.objectIdField + ' in (' + featureIds + ')';
          //set filter on map layer
          this._setFilterOnMapLayer(filter, opLayer.id, opLayer.url, opLayer.isMapServer);
        }
      }
    },

    /**
    * check if any of layer has feature in currently selected buffer area
    * @memberOf widgets/NearMe/item-list
    **/
    _onFeatureCountComplete: function () {
      //display message if no feature for current buffer area
      if (this._isNoFeature) {
        this.clearResultPanel();
        domStyle.set(this._panels.layerListPanel, 'display', 'block');
        domStyle.set(this._panels.layerListPanel, 'left', '0px');
        domConstruct.create("div", {
          "class": "esriCTNoFeatureFound",
          "innerHTML": this.nls.noFeatureFoundText
        }, this._panels.layerListPanel);
      } else if (this._layerCount === 1 && this._operationalLayers.length !== 1) {
        //display features List Panel directly if configured layer count is more than 1 and features are only available in single layer
        domStyle.set(this._panels.layerListPanel, 'display', 'none');
        this._onSingleLayerFound(null, this._selectedLayer);
      }
      if (this._failedLayers.length) {
        var unableToFetchResultsMsg = this.nls.unableToFetchResults +
          "\n</t><ul><li>" + this._failedLayers.join("\n </li><li>") +
          "</li></ul>";
        this._showMessage(unableToFetchResultsMsg);
      }
      this.loading.hide();
      if (this.parentDivId && registry.byId(this.parentDivId) &&
        registry.byId(this.parentDivId).resize) {
        registry.byId(this.parentDivId).resize();
      }
    },

    /**
    * query feature layer to get features present in the current buffer area
    * @memberOf widgets/NearMe/item-list
    **/
    _queryForFeatureList: function (defer) {
      var queryParams;
      this.loading.show();
      //If features for selected layer are available then use them else query for those features
      if (this._searchedFeatures[this._selectedLayer.id]) {
        this._hideAllLayers();
        if (this._searchedFeatures[this._selectedLayer.id].length > 0) {
          this._creatFeatureList(this._searchedFeatures[this._selectedLayer.id]);
        }
        this.loading.hide();
        if (defer) {
          defer.resolve();
        }
      } else {
        queryParams = this._getQueryParams();
        // if intersectSearchedLocation option is 'ON' and layer is polygon layer then,
        // query for features which are intersecting searched location instead of buffer area
        if (this.config.intersectSearchedLocation && this._selectedLayer &&
          this._selectedLayer.geometryType === "esriGeometryPolygon") {
          queryParams.geometry = this._selectedPoint.geometry;
        }
        this._selectedLayer.queryFeatures(queryParams, lang.hitch(this,
          function (featureSet) {
            this._hideAllLayers();
            //check if any feature is found
            if (featureSet.features.length > 0) {
              this._showFilteredFeaturesOnLoad(featureSet.features, this._selectedLayer.id);
              //creates feature list
              this._creatFeatureList(featureSet.features);
            }
            this.loading.hide();
            if (defer) {
              defer.resolve();
            }
          }), lang.hitch(this, function () {
            this.loading.hide();
            //add layer to the failed layer list if it fails to fetch the results
            this._failedLayers.push(this._selectedLayer.title);
            if (defer) {
              defer.resolve();
            }
          }));
      }
    },
    /**
    *reset filters on all map layers
    **/
    resetAllFilters: function () {
      for (var i = 0; i < this._operationalLayers.length; i++) {
        this._resetFilter(this._operationalLayers[i].layerIndex);
      }
    },

    /**
    * set count field layer/feature template div
    * @param{object} templateDiv
    * @param{int} value
    * @param{boolean} isFeatureCount
    * @param{boolean} isError
    * @memberOf widgets/NearMe/item-list
    **/
    _setItemCount: function (templateDiv, value, isFeatureCount) {
      var divFeatureCount = query(".esriCTItemCount", templateDiv)[0];
      if (divFeatureCount) {
        domClass.remove(divFeatureCount, "esriCTLoadingIcon");
        //check whether feature count or distance from selected location has to be displayed in count field
        if (isFeatureCount) {
          value = this._getMaxResultCountValue(value, this._selectedLayer.maxRecordCount);
          //show feature count in selected buffer
          domAttr.set(divFeatureCount, "innerHTML", "(" + number.format(value) + ")");
          if (value) {
            this._isNoFeature = false;
            //do not enable node if respective layer has no feature
            domClass.remove(templateDiv, "esriCTDisabled");
          }
        } else {
          //show distance from selected location to the feature
          domAttr.set(divFeatureCount, "innerHTML", (number.format(value.toFixed(2)) + " " +
            this.nls.units[this.config.bufferDistanceUnit.value].acronym));
        }
      }
    },

    /**
    * set max result count value to display for features retrieved
    * @param{int} featureCount
    * @param{int} layerMaxRecordCount
    * @memberOf widgets/NearMe/item-list
    **/
    _getMaxResultCountValue: function (featureCount, layerMaxRecordCount) {
      var maxResultCount;
      //check if configured maximum result count exists and is not greater than layer's maxRecordCount
      if (this.config.maxResultCount && this.config.maxResultCount <= layerMaxRecordCount) {
        // check if retrieved feature count is less than configured maxResultCount and if true then set the maxResultCount as featureCount
        if (featureCount < this.config.maxResultCount) {
          maxResultCount = featureCount;
        }
        //else set configured maxResultCount as maxResultCount
        else {
          maxResultCount = this.config.maxResultCount;
        }
      }
      else {
        // check if retrieved feature count is less than layer's maxRecordCount and if true then set the maxResultCount as featureCount
        if (featureCount < layerMaxRecordCount) {
          maxResultCount = featureCount;
        }
        //else set configured maxResultCount as layer's maxRecordCount
        else {
          maxResultCount = layerMaxRecordCount;
        }
      }
      return maxResultCount;
    },

    /**
    * create feature list UI
    * @param{object} features
    * @memberOf widgets/NearMe/item-list
    **/
    _creatFeatureList: function (features) {
      var i, featureDiv, featureIds = '', divFeatureCount, maxFeatureLength;
      //as features are found set off the flag
      this._isNoFeature = false;
      //sort features according to distance.
      if (features.length > 1) {
        features = this._getSortedFeatureList(features);
      }
      maxFeatureLength = this._getMaxResultCountValue(features.length,
        this._selectedLayer.maxRecordCount);
      //Directly display feature Info Pane if only 1 feature found
      if (maxFeatureLength === 1) {
        this._onSingleFeatureFound(features[0]);
      }
      else {
        //create template for each feature
        for (i = 0; i < maxFeatureLength; i++) {
          if (featureIds) {
            featureIds += ',';
          }
          featureIds += features[i].attributes[this._selectedLayer.objectIdField];
          featureDiv = domConstruct.toDom(this._itemListTemplate).childNodes[0];
          domClass.add(featureDiv, "esriCTFeatureListItem");
          this._featureListContent.appendChild(featureDiv);
          this._setItemName(featureDiv, features[i].getTitle());
          // if geometry type is polygon & Only return polygons that intersect the search location
          // flag is enabled then hide distance to location text else show
          if (features[i].geometry.type === "polygon" && this.config.intersectSearchedLocation) {
            divFeatureCount = query(".esriCTItemCount", featureDiv)[0];
            // if distance to location domNode created and then hide loading icon
            if (divFeatureCount) {
              domClass.remove(divFeatureCount, "esriCTLoadingIcon");
            }
          } else {
            this._setItemCount(featureDiv, features[i].distanceToLocation, false);
          }
          this._attachEventOnFeatureDiv(featureDiv, features[i]);
        }
        if (this.parentDivId && registry.byId(this.parentDivId) &&
          registry.byId(this.parentDivId).resize) {
          registry.byId(this.parentDivId).resize();
        }
        this._displayFilteredFeatures(featureIds);
        this._showPanel("featureListPanel");
        this.loading.hide();
      }
    },

    /**
    * Display searched features only if 'selectedSearchlayerOnly' is set to true
    * @param{string} featureIds: object ids for searched features
    * @memberOf widgets/NearMe/item-list
    **/
    _displayFilteredFeatures: function (featureIds) {
      if (this.config.selectedSearchLayerOnly) {
        var filter;
        //display selected layer only
        this._showHideOperationalLayer(this._selectedLayer.url, this._selectedLayer
          .id, true);
        filter = this._selectedLayer.objectIdField + ' in (' + featureIds + ')';
        //set filter on query layer
        this._selectedLayer.setDefinitionExpression(filter);
      }
    },

    /**
    * apply filter on map layer
    * @param{object} filter to be applied on map layer
    * @param{string} id:layer id on map
    * @param{string} layerURL
    * @memberOf widgets/NearMe/item-list
    **/
    _setFilterOnMapLayer: function (filter, id, layerURL, isMapServer) {
      var seletedMapLayer, layerDef = [], layerId, layerIdOnMap;
      //check whether id is available
      if (id) {
        if (!isMapServer) {
          seletedMapLayer = this.map.getLayer(id);
          if (seletedMapLayer) {
            this.filterManager.applyWidgetFilter(id, this.id, filter);
          }
        } else {
          //fetch id of map server layer
          layerIdOnMap = id.substring(0, id.lastIndexOf('_'));
          seletedMapLayer = this.map.getLayer(layerIdOnMap);
          if (seletedMapLayer) {
            layerDef = [];
            layerId = layerURL[layerURL.length - 1];
            layerDef[layerId] = filter;
            //set layer definition for map service layer
            this.filterManager.applyWidgetFilter(layerIdOnMap, this.id, filter);
          }
        }
      }
    },

    /**
    * reset applied filter on layers and display webmap configured filter only
    * @param{object} featureLayer
    * @param{int} index
    * @memberOf widgets/NearMe/item-list
    **/
    _resetFilter: function (layerIndex) {
      var layerIdOnMap, widgetFilter;
      if (this._operationalLayers[layerIndex].isMapServer) {
        layerIdOnMap = this._operationalLayers[layerIndex].id.substring(0,
          this._operationalLayers[layerIndex].id.lastIndexOf('_'));
      } else {
        layerIdOnMap = this._operationalLayers[layerIndex].id;
      }
      widgetFilter = this.filterManager.getWidgetFilter(layerIdOnMap, this.id);
      if (widgetFilter) {
        //reset widget filter on map layer by applying empty filter
        this._setFilterOnMapLayer("", this._operationalLayers[layerIndex].id,
          this._operationalLayers[layerIndex].url,
          this._operationalLayers[layerIndex].isMapServer);
        //once widget filter gets cleared, get updated filter on layer using layerInfos
        LayerInfos.getInstance(this.map, this.map.webMapResponse.itemInfo).then(
          lang.hitch(this, function (layerInfosObj) {
            var filter, mapLayer;
            mapLayer = layerInfosObj.getLayerInfoById(layerIdOnMap);
            if (mapLayer) {
              filter = mapLayer.getFilter();
              //if (filter) {
              this.config.searchLayers[layerIndex].definitionExpression = filter;
              //set updated definition expression on the layer instances used by widget
              this._operationalLayers[layerIndex].setDefinitionExpression(filter);
              //}
            }
          }));
      } else {
        //set updated definition expression on the layer instances used by widget
        this._operationalLayers[layerIndex].setDefinitionExpression(
          this.config.searchLayers[layerIndex].definitionExpression);
      }
    },

    /**
    * sort feature list according to the distance from the selected location
    * @param{object} features
    * @memberOf widgets/NearMe/item-list
    **/
    _getSortedFeatureList: function (features) {
      var i, getGeodesicDistances;
      getGeodesicDistances = this._canGetGeodesicDistance();
      for (i = 0; i < features.length; i++) {
        if (getGeodesicDistances) {
          features[i].distanceToLocation = this._getGeodesicDistances(features[i].geometry);
        } else {
          features[i].distanceToLocation = GeometryEngine.distance(this._selectedPoint.geometry,
            features[i].geometry, this.config.bufferDistanceUnit.distanceUnit);
        }
      }
      features.sort(function (featureA, featureB) {
        return featureA.distanceToLocation - featureB.distanceToLocation;
      });
      return features;
    },

    /**
    * This function returns if geodesic calculation is done or not
    * @memberOf widgets/NearMe/item-list
    **/
    _canGetGeodesicDistance: function () {
      var outSR;
      outSR = new SpatialReference(4326);
      if (this.config.isGeodesic &&
        webMercatorUtils.canProject(this._selectedPoint.geometry, outSR)) {
        return true;
      }
      return false;
    },

    /**
    * sort feature list according to the distance from the selected location
    * @param{object} features
    * @memberOf widgets/NearMe/item-list
    **/
    _getGeodesicDistances: function (featureGeometry) {
      var polyline, distance, outSR, nearestResult;
      //if selected geometry is not point then get the nearest cooordinate of trhe geometry
      if (featureGeometry.type !== "point") {
        nearestResult = GeometryEngine.nearestCoordinate(
          featureGeometry, this._selectedPoint.geometry);
        if (!nearestResult.isEmpty) {
          featureGeometry = nearestResult.coordinate;
        } else {
          return 0;
        }
      }
      polyline = new Polyline([
        [this._selectedPoint.geometry.x, this._selectedPoint.geometry.y],
        [featureGeometry.x, featureGeometry.y]]);
      polyline.setSpatialReference(this._selectedPoint.geometry.spatialReference);
      outSR = new SpatialReference(4326);
      if (webMercatorUtils.canProject(featureGeometry, outSR)) {
        polyline = webMercatorUtils.project(polyline, outSR);
        distance = GeometryEngine.geodesicLength(polyline,
          this.config.bufferDistanceUnit.distanceUnit);
        if (isNaN(distance)) {
          distance = 0;
        }
      }
      return distance;
    },

    /**
    * attach 'click' event on right arrow to display next panel
    * @param{object} featureDiv
    * @param{object} selectedFeature
    * @memberOf widgets/NearMe/item-list
    **/
    _attachEventOnFeatureDiv: function (featureDiv, selectedFeature) {
      this.own(on(featureDiv, "click", lang.hitch(this, function () {
        this._isFeatureList = true;
        var infoPanelBackBtn = query(".esriCTBackButton", this._panels.infoPanel)[0];
        if (infoPanelBackBtn) {
          domStyle.set(infoPanelBackBtn, 'display', 'block');
        }
        this._showFeatureDetails(featureDiv, selectedFeature);
      })));
    },

    /**
    * displays selected feature info in infoPanel
    * @param{object} featureDiv
    * @param{object} selectedFeature
    * @memberOf widgets/NearMe/item-list
    **/
    _showFeatureDetails: function (featureDiv, selectedFeature) {
      //display layer title as header text
      this._setItemName(this._panels.infoPanel, this._selectedLayer.title);
      this._showPanel("infoPanel");
      //open information tab
      if (this._tabContainer) {
        this._tabContainer.selectTab(this.nls.informationTabTitle);
      }
      this._selectedFeatureItem = featureDiv;
      this._selectedFeature = selectedFeature;
      this._clearDirections();
      this._highlightFeatureOnMap();
      //display popup info for selected feature
      this._displayFeatureInfo(selectedFeature);
      if (this.parentDivId && registry.byId(this.parentDivId) &&
        registry.byId(this.parentDivId).resize) {
        registry.byId(this.parentDivId).resize();
      }
    },

    /**
    * set popup info content in information container
    * @param{object} selectedFeature
    * @memberOf widgets/NearMe/item-list
    **/
    _displayFeatureInfo: function (selectedFeature) {
      var selectedFeaturePoint, selectedPoint, polyline, polylineJson;
      if (this._loadAttachmentTimer) {
        clearTimeout(this._loadAttachmentTimer);
      }
      if (this._featureInfoPanel) {
        this._featureInfoPanel.set("content", "");
        this._showPopupInfo(selectedFeature);
        this._checkAttachments();
      }
      //check if 'zoomTofeature' is set to true in config
      if (this.config.zoomToFeature) {
        //zoom to the selected feature
        if (selectedFeature.geometry.type === "point") {
          selectedFeaturePoint = selectedFeature.geometry;
          selectedPoint = this._selectedPoint.geometry;
          polylineJson = {
            "paths": [[[selectedFeaturePoint.x, selectedFeaturePoint.y],
              [selectedPoint.x, selectedPoint.y]]],
            "spatialReference": this.map.spatialReference
          };
          polyline = new Polyline(polylineJson);
          this.map.setExtent(polyline.getExtent().expand(1.5));
        } else {
          this.map.setExtent(selectedFeature.geometry.getExtent().expand(1.5));
        }
      }
      this._getRelatedRecords(selectedFeature);
    },

    /**
    * Get related record from the selected layers's respective tables
    * @memberOf widgets/NearMe/item-list
    **/
    _getRelatedRecords: function (selectedFeature) {
      array.forEach(this._selectedLayer.tableInfos, lang.hitch(this, function (tableIndex) {
        var featureId = selectedFeature.attributes[this._selectedLayer.objectIdField];
        this._queryRelatedRecords(this._tables[tableIndex], featureId);
      }));
    },

    /**
    * Query for related records
    * @memberOf widgets/NearMe/item-list
    **/
    _queryRelatedRecords: function (tableInfo, featureId) {
      if (this._selectedLayer && tableInfo) {
        var queryParams = new RelationshipQuery();
        queryParams.objectIds = [parseInt(featureId, 10)];
        queryParams.outFields = ["*"];
        queryParams.relationshipId = tableInfo.relationshipIds[this._selectedLayer.id];
        //apply filter for related records if configured in webmap
        if (tableInfo.layerDefinition && tableInfo.layerDefinition.definitionExpression) {
          queryParams.definitionExpression = tableInfo.layerDefinition.definitionExpression;
        }
        this._selectedLayer.queryRelatedFeatures(queryParams, lang.hitch(this, function (results) {
          var fset, features;
          fset = results[featureId];
          features = fset ? fset.features : [];
          array.forEach(features, lang.hitch(this, function (feature) {
            //set webmap configured popup info for related feature
            feature.setInfoTemplate(new PopupTemplate(tableInfo.popupInfo));
            this._showPopupInfo(feature);
          }));
          if (this.parentDivId && registry.byId(this.parentDivId) &&
            registry.byId(this.parentDivId).resize) {
            registry.byId(this.parentDivId).resize();
          }
        }));
      }
    },

    /**
    * Show related popup info in information panel
    * @memberOf widgets/NearMe/item-list
    **/
    _showPopupInfo: function (feature) {
      if (this._featureInfoPanel && feature) {
        var contentPane = new ContentPane({ "class": "esriCTPopupInfo" });
        contentPane.set("content", feature.getContent());
        this._featureInfoPanel.addChild(contentPane);
      }
    },

    /**
    * check whether attachments are available in layer and enabled in webmap
    * @memberOf widgets/NearMe/item-list
    **/
    _checkAttachments: function () {
      if (this._selectedLayer.hasAttachments && this._selectedLayer.showAttachments) {
        this.loading.show();
        var attachmentsDiv = query(".attachmentsSection", this._featureInfoPanel.domNode)[0];
        domConstruct.empty(attachmentsDiv);
        domClass.remove(attachmentsDiv, "hidden");
        this._loadAttachmentTimer = setTimeout(lang.hitch(this, function () {
          this._showAttachments(this._selectedFeature, attachmentsDiv, this._selectedLayer);
        }), 500);
      }
    },

    /**
    * query layer to get attachments
    * @param{object} graphic
    * @param{object} attachmentContainer
    * @param{object} layer
    * @memberOf widgets/NearMe/item-list
    **/
    _showAttachments: function (graphic, attachmentContainer, layer) {
      var objectID, fieldContent, imageDiv, imageContent, imagePath, i, imgLoaderDefer = [], defer;
      objectID = graphic.attributes[layer.objectIdField];
      domConstruct.empty(attachmentContainer);
      layer.queryAttachmentInfos(objectID, lang.hitch(this, function (infos) {
        //check if attachments found
        if (infos && infos.length > 0) {
          //Create attachment header text
          domConstruct.create("div", {
            "innerHTML": this.nls.attachmentHeader,
            "class": "esriCTAttachmentHeader"
          }, attachmentContainer);
          fieldContent = domConstruct.create("div", {
            "class": "esriCTThumbnailContainer"
          }, attachmentContainer);
          // display all attached images in thumbnails
          for (i = 0; i < infos.length; i++) {
            defer = new Deferred();
            //set default image path if attachment has no image URL
            imagePath = this.folderUrl + "images/no-attachment.png";
            if (infos[i].contentType.indexOf("image") > -1) {
              imagePath = infos[i].url;
            }
            imageContent = domConstruct.create("span", {
              "class": "esriCTAttachmentHolder col"
            }, fieldContent);
            domClass.add(imageContent, "esriCTImageLoader");
            imageDiv = domConstruct.create("img", {
              "alt": infos[i].url,
              "class": "esriCTAttachmentImg esriCTAutoHeight",
              "src": imagePath
            }, imageContent);
            this._attachEventOnImage(imageDiv, defer);
            imgLoaderDefer.push(defer);
          }
        }
        All(imgLoaderDefer).then(lang.hitch(this, this._onAllAttachmentLoad));
        if (this.parentDivId && registry.byId(this.parentDivId) &&
          registry.byId(this.parentDivId).resize) {
          registry.byId(this.parentDivId).resize();
        }
      }));
    },

    /**
    * attach event on attachment image
    * @param{object} imageDiv
    * @param{object} defer
    * @memberOf widgets/NearMe/item-list
    **/
    _attachEventOnImage: function (imageDiv, defer) {      // Hide loader Image after image loaded
      this.own(on(imageDiv, "load", lang.hitch(this, function (evt) {
        this._onImageLoad(evt);
        defer.resolve();
      })));
      // Show image in new tab on click of the image thumbnail
      this.own(on(imageDiv, "click", lang.hitch(this, this._displayImageAttachments)));
      //hide loader if image fails to load
      this.own(on(imageDiv, "error", lang.hitch(this, function (evt) {
        this._onError(evt);
        defer.resolve();
      })));
    },

    /**
    * This function is used to show attachments in new window when user clicks on the attachment thumbnail
    * @param{object} evt
    * @memberOf widgets/NearMe/item-list
    **/
    _displayImageAttachments: function (evt) {
      window.open(evt.target.alt);
    },

    /**
    * This function is used to notify that image is loaded
    * Hide the image loader once the image is loaded, and set the image dimensions so that complete image will be shown in thumbnail.
    * @param{object} evt
    * @memberOf widgets/NearMe/item-list
    **/
    _onImageLoad: function (evt) {
      domClass.remove(evt.target.parentNode, "esriCTImageLoader");
      this._setImageDimensions(evt.target);
    },

    /**
    * This function is used to set the images dimensions so that the complete image will be shown in thumbnail
    * @param{object} imgModule
    * @memberOf widgets/NearMe/item-list
    **/
    _setImageDimensions: function (imgModule) {
      var aspectRatio, newWidth, newHeight, imgHeight, imgContainer = imgModule.parentElement;
      if (imgModule && imgModule.offsetHeight > 0) {
        //set original dimensions of image as it max dimensions.
        domAttr.set(imgModule, "originalHeight", imgModule.offsetHeight);
        domStyle.set(imgModule, "maxHeight", imgModule.offsetHeight + 'px');
        domStyle.set(imgModule, "maxWidth", imgModule.offsetWidth + 'px');

        imgHeight = parseFloat(domAttr.get(imgModule, "originalHeight"));
        if (imgContainer.offsetHeight < imgModule.offsetHeight || imgHeight >
          imgContainer.offsetHeight) {
          //change dimensions of image if it is larger/smaller than its parent container.
          //calculate aspect ratio of image.
          aspectRatio = imgModule.offsetWidth / imgModule.offsetHeight;
          //calculate new dimensions according to aspect ratio of image.
          newHeight = imgContainer.offsetHeight - 2;
          newWidth = Math.floor(newHeight * aspectRatio);
          domClass.remove(imgModule, "esriCTAutoHeight");
          //set new dimensions to image.
          domStyle.set(imgModule, "width", newWidth + 'px');
          domStyle.set(imgModule, "height", newHeight + 'px');
        }
      }
    },

    /**
    * hide image loader if image gets failed to load
    * @memberOf widgets/NearMe/item-list
    **/
    _onError: function (evt) {
      domClass.remove(evt.target.parentNode, "esriCTImageLoader");
    },

    /**
    * hide image loader when all attachment gets loaded
    * @memberOf widgets/NearMe/item-list
    **/
    _onAllAttachmentLoad: function () {
      this.loading.hide();
    },

    /**
    * set searched location
    * @memberOf widgets/NearMe/item-list
    **/
    _setSeachedLocation: function (location) {
      this._selectedPoint = location;
    },

    /**
    * set service area
    * @memberOf widgets/NearMe/item-list
    **/
    _setServiceArea: function (serviceArea) {
      this._serviceArea = serviceArea;
    },

    /**
    * clear results panels
    * @memberOf widgets/NearMe/item-list
    **/
    clearResultPanel: function () {
      this._isFeatureList = false;
      this._clearContent(this._panels.layerListPanel);
      domStyle.set(this._panels.layerListPanel, "display", "none");
      domStyle.set(this._panels.featureListPanel, "display", "none");
      domStyle.set(this._panels.infoPanel, "display", "none");
      this._clearContent(this._featureListContent);
      this._clearDirections();
      this._clearGrahics();
    },

    /**
    * remove graphics layer from map
    * @memberOf widgets/NearMe/item-list
    **/
    removeGraphicsLayer: function () {
      if (this._featureGraphicsLayer) {
        this.map.removeLayer(this._featureGraphicsLayer);
        this._featureGraphicsLayer = null;
      }
    },

    /**
    * clear graphics from map
    * @memberOf widgets/NearMe/item-list
    **/
    _clearGrahics: function () {
      if (this._featureGraphicsLayer) {
        this._featureGraphicsLayer.clear();
      }
    },
    /**
    * Show selected panel
    * @param{string} name
    * @param{boolean} isLeft
    * @memberOf widgets/NearMe/item-list
    **/

    _showPanel: function (name, isLeft) {
      domStyle.set(this._panels[name], {
        display: 'block',
        left: '-100%'
      });
      if (isLeft) {
        this._slide(this._panels[name], -100, 0);
        this._slide(this._currentPanel, 0, 100);
      } else {
        this._slide(this._currentPanel, 0, -100);
        this._slide(this._panels[name], 100, 0);
      }
      this._currentPanelName = name;
      this._currentPanel = this._panels[name];
      if (this.parentDivId && registry.byId(this.parentDivId) &&
        registry.byId(this.parentDivId).resize) {
        registry.byId(this.parentDivId).resize();
      }
    },

    /**
    * animate panels
    * @param{object} dom
    * @param{int} startLeft
    * @param{int} endLeft
    * @memberOf widgets/NearMe/item-list
    **/
    _slide: function (dom, startLeft, endLeft) {
      domStyle.set(dom, 'display', 'block');
      domStyle.set(dom, 'left', startLeft + "%");
      fx.animateProperty({
        node: dom,
        properties: {
          left: {
            start: startLeft,
            end: endLeft,
            units: '%'
          }
        },
        duration: 300,
        onEnd: lang.hitch(this, function () {
          domStyle.set(dom, 'left', endLeft);
          if (endLeft === 0) {
            domStyle.set(dom, 'display', 'block');
          } else {
            domStyle.set(dom, 'display', 'none');
          }
          this._isSlide = true;
        })
      }).play();
    },

    /**
    * create and show alert message.
    * @param {string} msg
    * @memberOf widgets/NearMe/item-list
    **/
    _showMessage: function (msg) {
      var alertMessage = new Message({
        message: msg
      });
      alertMessage.message = msg;
    },

    /**
    * initialize direction dijit
    * @memberOf widgets/NearMe/item-list
    **/
    _initializeDirectionWidget: function () {
      var directionParams;
      //create direction widget instance if not created
      if (!this._directionsWidget) {
        if (registry.byId("directionDijit")) {
          registry.byId("directionDijit").destroy();
        }
        //configure direction parameters
        directionParams = {
          id: "directionDijit",
          map: this.map,
          directionsLengthUnits: units[this.config.directionLengthUnit.routeUnit],
          showTrafficOption: false,
          dragging: false,
          routeTaskUrl: this.config.routeService,
          routeSymbol: new SimpleLineSymbol(this.config.symbols.routeSymbol)
        };
        this._directionsWidget = new Directions(directionParams, domConstruct.create(
          "div", {}, null));
        this._directionsWidget.startup();
        //on completing directions resize widget panel and zoom to the generated route
        this.own(this._directionsWidget.on("directions-finish", lang.hitch(this, function () {
          this._directionsWidget.zoomToFullRoute();
          if (this.parentDivId && registry.byId(this.parentDivId) &&
            registry.byId(this.parentDivId).resize) {
            registry.byId(this.parentDivId).resize();
          }
          this.loading.hide();
        })));
        //place direction node into direction tab container
        this._directionInfoPanel.set('content', this._directionsWidget.domNode);
      }
      this._routeSelectedLocations();
    },

    /**
    * clear direction results from the map and direction container
    * @memberOf widgets/NearMe/item-list
    **/
    _clearDirections: function () {
      this._routeCalculated = false;
      if (this._directionsWidget) {
        this._directionsWidget.clearDirections();
      }
    },

    /**
    * generate route between searched location to selected feature
    * @memberOf widgets/NearMe/item-list
    **/
    _routeSelectedLocations: function () {
      var selectedLocations = [];
      //clear previous directions
      this._clearDirections();
      if (this._selectedPoint && this._selectedFeature) {
        //display loading indicator until direction gets calculated
        this.loading.show();
        selectedLocations.push(this._selectedPoint);
        //if selected feature geometry is point directly use point
        //else if geometry is polygon get its centroid
        //else if geometry is polyline get its first point
        if (this._selectedFeature.geometry.type === "point") {
          selectedLocations.push(this._selectedFeature);
        } else if (this._selectedFeature.geometry.type === "polygon") {
          selectedLocations.push(this._selectedFeature.geometry.getCentroid());
        } else {
          selectedLocations.push(this._selectedFeature.geometry.getPoint(0, 0));
        }
        // Calling update stops function for showing points on map and calculating direction.
        this._directionsWidget.updateStops(selectedLocations).then(lang.hitch(this, function () {
          this._directionsWidget.getDirections();
          //update _routeCalculated flag to 'true' if route gets calculated.
          this._routeCalculated = true;
        }), lang.hitch(this, function () {
          this.loading.hide();
          //display alert message if direction widget fails to generate route
          this._showMessage(this.nls.failedToGenerateRouteMsg);
        }));
      }
    },

    /**
    * highlight selected feature on map
    * @memberOf widgets/NearMe/item-list
    **/
    _highlightFeatureOnMap: function () {
      var graphics;
      this._clearGrahics();
      graphics = this._getHighLightSymbol(this._selectedFeature, this._selectedLayer);
      this._featureGraphicsLayer.add(graphics);
    },

    /**
    * Get symbol used for highlighting feature
    * @param{object} selected feature which needs to be highlighted
    * @param{object} details of selected layer
    */
    _getHighLightSymbol: function (graphic, layer) {
      // If feature geometry is of type point, add a cross-hair symbol
      // If feature geometry is of type polyline, highlight the line
      // If feature geometry is of type polygon, highlight the boundary of the polygon
      switch (graphic.geometry.type) {
        case "point":
          return this._getPointSymbol(graphic, layer);
        case "polyline":
          return this._getPolyLineSymbol(graphic, layer);
        case "polygon":
          return this._getPolygonSymbol(graphic);
      }
    },

    /**
    * This function is used to get symbol for point geometry
    * @param{object} selected feature which needs to be highlighted
    * @param{object} details of selected layer
    * @memberOf widgets/NearMe/item-list
    */
    _getPointSymbol: function (graphic, layer) {
      var symbol, isSymbolFound, graphics, point, graphicInfoValue,
        layerInfoValue, i;
      isSymbolFound = false;
      symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE,
        null, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([0, 255, 255, 1]), 3));
      symbol.setColor(null);
      symbol.size = 30; //set default Symbol size which will be used in case symbol not found.
      //check if layer is valid and have valid renderer object then only check for other symbol properties
      if (layer && layer.renderer) {
        if (layer.renderer.symbol) {
          isSymbolFound = true;
          symbol = this._updatePointSymbolProperties(symbol, layer.renderer
            .symbol);
        } else if (layer.renderer.infos && (layer.renderer.infos.length >
          0)) {
          for (i = 0; i < layer.renderer.infos.length; i++) {
            if (layer.typeIdField) {
              graphicInfoValue = graphic.attributes[layer.typeIdField];
            } else if (layer.renderer.attributeField) {
              graphicInfoValue = graphic.attributes[layer.renderer.attributeField];
            }
            layerInfoValue = layer.renderer.infos[i].value;
            // To get properties of symbol when infos contains other than class break renderer.
            if (graphicInfoValue !== undefined && graphicInfoValue !==
              null && graphicInfoValue !== "" && layerInfoValue !==
              undefined && layerInfoValue !== null && layerInfoValue !==
              "") {
              if (graphicInfoValue.toString() === layerInfoValue.toString()) {
                isSymbolFound = true;
                symbol = this._updatePointSymbolProperties(symbol,
                  layer.renderer.infos[i].symbol);
              }
            }
          }
          if (!isSymbolFound) {
            if (layer.renderer.defaultSymbol) {
              isSymbolFound = true;
              symbol = this._updatePointSymbolProperties(symbol,
                layer.renderer.defaultSymbol);
            }
          }
        }
      }
      point = new Point(graphic.geometry.x, graphic.geometry.y, new SpatialReference({
        wkid: graphic.geometry.spatialReference.wkid
      }));
      graphics = new Graphic(point, symbol, graphic.attributes);
      return graphics;
    },

    /**
    * This function is used to get different data of symbol from infos properties of renderer object.
    * @param{object} symbol that needs to be assigned to selected/activated feature
    * @param{object} renderer layer Symbol
    * @memberOf widgets/NearMe/item-list
    */
    _updatePointSymbolProperties: function (symbol, layerSymbol) {
      var height, width, size;
      if (layerSymbol.hasOwnProperty("height") && layerSymbol.hasOwnProperty(
        "width")) {
        height = layerSymbol.height;
        width = layerSymbol.width;
        // To display cross hair properly around feature its size needs to be calculated
        size = (height > width) ? height : width;
        size = size + 10;
        symbol.size = size;
      }
      if (layerSymbol.hasOwnProperty("size")) {
        if (!size || size < layerSymbol.size) {
          symbol.size = layerSymbol.size + 10;
        }
      }
      if (layerSymbol.hasOwnProperty("xoffset")) {
        symbol.xoffset = layerSymbol.xoffset;
      }
      if (layerSymbol.hasOwnProperty("yoffset")) {
        symbol.yoffset = layerSymbol.yoffset;
      }
      return symbol;
    },

    /**
    * This function is used to get symbol for polyline geometry
    * @param{object} selected feature which needs to be highlighted
    * @param{object} details of selected layer
    * @memberOf widgets/NearMe/item-list
    */
    _getPolyLineSymbol: function (graphic, layer) {
      var symbol, graphics, polyline, symbolWidth, graphicInfoValue,
        layerInfoValue, i;
      symbolWidth = 5; // default line width
      //check if layer is valid and have valid renderer object then only check for other  symbol properties
      if (layer && layer.renderer) {
        if (layer.renderer.symbol && layer.renderer.symbol.hasOwnProperty(
          "width")) {
          symbolWidth = layer.renderer.symbol.width;
        } else if ((layer.renderer.infos) && (layer.renderer.infos.length > 0)) {
          for (i = 0; i < layer.renderer.infos.length; i++) {
            if (layer.typeIdField) {
              graphicInfoValue = graphic.attributes[layer.typeIdField];
            } else if (layer.renderer.attributeField) {
              graphicInfoValue = graphic.attributes[layer.renderer.attributeField];
            }
            layerInfoValue = layer.renderer.infos[i].value;
            // To get properties of symbol when infos contains other than class break renderer.
            if (graphicInfoValue !== undefined && graphicInfoValue !== null &&
              graphicInfoValue !== "" && layerInfoValue !== undefined &&
              layerInfoValue !== null && layerInfoValue !== "") {
              if (graphicInfoValue.toString() === layerInfoValue.toString() &&
                layer.renderer.infos[i].symbol.hasOwnProperty("width")) {
                symbolWidth = layer.renderer.infos[i].symbol.width;
              }
            }
          }
        } else if (layer.renderer.defaultSymbol && layer.renderer.defaultSymbol
          .hasOwnProperty("width")) {
          symbolWidth = layer.renderer.defaultSymbol.width;
        }
      }
      symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([
        0, 255, 255, 1
      ]), symbolWidth);
      polyline = new Polyline(new SpatialReference({
        wkid: graphic.geometry.spatialReference.wkid
      }));
      if (graphic.geometry.paths && graphic.geometry.paths.length > 0) {
        polyline.addPath(graphic.geometry.paths[0]);
      }
      graphics = new Graphic(polyline, symbol, graphic.attributes);
      return graphics;
    },

    /**
    * This function is used to get symbol for polygon geometry
    * @param{object} selected feature which needs to be highlighted
    * @memberOf widgets/NearMe/item-list
    */
    _getPolygonSymbol: function (graphic) {
      var symbol, graphics, polygon;
      symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 255, 1]), 4),
        new Color([0, 0, 0, 0]));
      polygon = new Polygon(new SpatialReference({
        wkid: graphic.geometry.spatialReference.wkid
      }));
      if (graphic.geometry.rings) {
        polygon.rings = lang.clone(graphic.geometry.rings);
      }
      graphics = new Graphic(polygon, symbol, graphic.attributes);
      return graphics;
    },

    /**
    * Hide all layers from map
    * @memberOf widgets/NearMe/item-list
    **/
    _hideAllLayers: function () {
      if (this.config.selectedSearchLayerOnly) {
        var i;
        for (i = 0; i < this.config.searchLayers.length; i++) {
          this._showHideOperationalLayer(this.config.searchLayers[i].url, this.config
            .searchLayers[i].id, false);
        }
      }
    },

    /**
    * Show all layers on map
    * @memberOf widgets/NearMe/item-list
    **/
    showAllLayers: function () {
      var i, showLayer;
      for (i = 0; i < this.config.searchLayers.length; i++) {
        showLayer = true;
        if (this.config.selectedSearchLayerOnly &&
          this._searchedFeatures[this.config.searchLayers[i].id] &&
          this._searchedFeatures[this.config.searchLayers[i].id].length < 1) {
          showLayer = false;
        }
        if (showLayer) {
          this._showHideOperationalLayer(this.config.searchLayers[i].url, this.config
            .searchLayers[i].id, true);
        }
      }
    },

    /**
    * Show/hide selected layer on map
    * @params{string} layerUrl
    * @params{string} id
    * @params{boolean} visibility
    * @memberOf widgets/NearMe/item-list
    **/
    _showHideOperationalLayer: function (layerUrl, id, visibility) {
      var layer, lastChar, mapLayerUrl, layerUrlIndex, visibleLayers, visibleLayerIndex;
      layerUrlIndex = layerUrl.split('/');
      layerUrlIndex = layerUrlIndex[layerUrlIndex.length - 1];
      for (layer in this.map._layers) {
        if (this.map._layers.hasOwnProperty(layer)) {
          //check if layer is visible on map
          if (id && this.map._layers[layer].url === layerUrl && this.map._layers[layer].id === id) {
            //show or hide selected layer on map
            this.map._layers[layer].setVisibility(visibility);
          } else if (this.map._layers[layer].visibleLayers) {
            //fetch id of map server layer to match with map layer
            if (id && this.map._layers[layer].id === id.substring(0, id.lastIndexOf('_'))) {
              //check for map server layer
              lastChar = this.map._layers[layer].url[this.map._layers[layer].url.length - 1];
              //create url for map server layer
              if (lastChar === "/") {
                mapLayerUrl = this.map._layers[layer].url + layerUrlIndex;
              } else {
                mapLayerUrl = this.map._layers[layer].url + "/" + layerUrlIndex;
              }
              //match layer urls
              if (mapLayerUrl === layerUrl) {
                //check whether layer is available in mp server's visible layer array
                visibleLayers = this.map._layers[layer].visibleLayers;
                visibleLayerIndex = array.indexOf(visibleLayers, parseInt(layerUrlIndex, 10));
                if (visibility) {
                  //show layer on map if it is not visible
                  if (visibleLayerIndex === -1) {
                    visibleLayers.push(parseInt(layerUrlIndex, 10));
                  }
                } else {
                  //hide layer on map if it is visible
                  if (visibleLayerIndex !== -1) {
                    visibleLayers.splice(visibleLayerIndex, 1);
                  }
                }
                this.map._layers[layer].setVisibleLayers(visibleLayers);
              }
            }
          }
        }
      }
    }
  });
});