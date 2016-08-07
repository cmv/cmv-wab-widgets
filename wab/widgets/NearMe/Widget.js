define([
  "dojo/_base/declare",
  "jimu/BaseWidget",
  "dojo/on",
  "dojo/dom-construct",
  "dojo/dom-class",
  "dojo/query",
  "dojo/_base/lang",
  "dojo/_base/array",
  "./utils",
  "./search",
  "./item-list",
  "jimu/portalUtils",
  "esri/layers/GraphicsLayer",
  "esri/graphic",
  "esri/tasks/GeometryService",
  "esri/tasks/BufferParameters",
  "dijit/form/HorizontalSlider",
  "dojo/dom-attr",
  "dojo/string",
  "dojo/dom-geometry",
  "dojo/dom-style",
  "esri/symbols/jsonUtils",
  "esri/SpatialReference",
  "esri/tasks/locator",
  "esri/geometry/webMercatorUtils",
  "esri/InfoTemplate",
  "jimu/dijit/Message",
  "jimu/dijit/LoadingIndicator",
  "dijit/registry"
], function (
  declare,
  BaseWidget,
  on,
  domConstruct,
  domClass,
  query,
  lang,
  array,
  appUtils,
  SearchInstance,
  ItemList,
  portalUtils,
  GraphicsLayer,
  Graphic,
  GeometryService,
  BufferParameters,
  HorizontalSlider,
  domAttr,
  string,
  domGeom,
  domStyle,
  symbolJsonUtils,
  SpatialReference,
  Locator,
  webMercatorUtils,
  InfoTemplate,
  Message,
  LoadingIndicator,
  registry
) {
  // to create a widget, derive it from BaseWidget.
  return declare([BaseWidget], {
    baseClass: 'jimu-widget-nearme', // Set the widget base class name.
    _highlightGraphicsLayer: null, // Layer to add highlight symbols
    _loading: null, // Loading indicator object
    _windowResizeTimer: null, // Timer to control widget component resize on window resize
    _sliderChangeTimer: null, // Timer to control buffer creation on slider change
    _mapTooltip: null, // MapTooltip Container
    _searchContainerNodeElement: null, // Search container
    _locatorInstance: null, // Locator instance to reverse geocode the address
    _searchedLocation: null, // Contain searched location
    _slider: null, // Horizontal slider instance
    _bufferParams: null, // To store Buffer parameters
    _mapClickHandler: null, // Map click handler
    _mapMoveHandler: null, // Map move handler
    _itemListObject: null, // Item-list widget instance
    _isValidConfig: null, //Flag to check whether config has valid data for the widget
    appUtils: null,
    _hasMulitpleSourcesInSearch: true, //Set this flag if their are multiple sources in search
    startup: function () {
      domClass.add(this.domNode.parentElement, "esriCTNearMeContentPanel");
      //check whether portal url is available
      if (this.appConfig.portalUrl && lang.trim(this.appConfig.portalUrl) !== "") {
        //get portal info to fetch geometry service Url
        portalUtils.getPortalSelfInfo(this.appConfig.portalUrl).then(lang.hitch(
          this,
          function (portalInfo) {
            // get helper-services from portal object
            this.config.helperServices = portalInfo && portalInfo.helperServices;
            if (this.config.helperServices && this.config.helperServices.geometry) {
              // validate if layers are configured then only load the widget
              this._isValidConfig = this._validateConfig();
              if (this._isValidConfig) {
                //initialize utils widget
                this.appUtils = new appUtils({ map: this.map });
                //update config for current webmap properties
                this._updateConfig();
                //Show main node
                domClass.remove(this.widgetMainNode, "esriCTHidden");
                //Hide Error node
                domClass.add(this.widgetErrorNode, "esriCTHidden");
                //load the widget
                this._initWidgetComponents();
                //connect map click handler if not connected
                if (!this._mapClickHandler) {
                  this._connectMapEventHandler();
                }
                this._onWindowResize();
              } else {
                //Hide main node
                domClass.add(this.widgetMainNode, "esriCTHidden");
                //Show Error node
                domClass.remove(this.widgetErrorNode, "esriCTHidden");
              }
            } else {
              //display error message if geometry service is not found
              this._displayWidgetError(this.nls.geometryServicesNotFound);
            }
          }), lang.hitch(this, function () {
            //display error message if any error occured while fetching portal info for geometry service
            this._displayWidgetError(this.nls.geometryServicesNotFound);
          }));
      } else {
        //display error message if portal url is not available
        this._displayWidgetError(this.nls.geometryServicesNotFound);
      }
    },

    /**
    * Display error message in error node
    * @memberOf widgets/NearMe/Widget
    */
    _displayWidgetError: function (msg) {
      if (this.widgetErrorNode) {
        domAttr.set(this.widgetErrorNode, "innerHTML", msg);
      }
      this._showMessage(msg);
    },

    /**
    * Resize the widget components and connect map click on widget open
    * @memberOf widgets/NearMe/Widget
    */
    onOpen: function () {
      if (this._isValidConfig) {
        this._onWindowResize();
        this._connectMapEventHandler();
      }
    },

    /**
    * Resize the widget components on widget resize
    * @memberOf widgets/NearMe/Widget
    */
    resize: function () {
      this._onWindowResize();
    },

    /**
    * This function clears results when widget is destroyed
    * @memberOf widgets/NearMe/Widget
    */
    destroy: function () {
      //destroy widget data
      this._destroyWidgetData();
      this.inherited(arguments);
    },

    /**
    * disconnect map click on widget close
    * @memberOf widgets/NearMe/Widget.js
    */
    onClose: function () {
      if (this._isValidConfig) {
        this._disconnectMapEventHandler();
      }
    },

    /**
    * This function destroys itemList widget and clears the search result
    * @memberOf widgets/NearMe/Widget
    */
    _destroyWidgetData: function () {
      if (this._itemListObject) {
        this._itemListObject.removeGraphicsLayer();
        this._itemListObject.showAllLayers();
        this._itemListObject.destroy();
        this._itemListObject = null;
      }
      //clear buffer graphics layer from map
      if (this._bufferGraphicLayer) {
        this._bufferGraphicLayer.clear();
      }
      this._clearResults();
    },

    /**
    * This function validates the configured data
    * @memberOf widgets/NearMe/Widget
    */
    _validateConfig: function () {
      if (!(this.config.searchLayers && this.config.searchLayers.length)) {
        this._displayWidgetError(this.nls.invalidSearchLayerMsg);
        return false;
      }
      return true;
    },

    /**
    * This function updates the layer-details for the configured layers from selected webmap
    * @memberOf widgets/NearMe/Widget
    **/
    _updateConfig: function () {
      var i;
      for (i = 0; i < this.config.searchLayers.length; i++) {
        lang.mixin(this.config.searchLayers[i], this.appUtils.getLayerDetailsFromMap(
          this.config.searchLayers[i].baseURL, this.config.searchLayers[i]
          .layerId, this.config.searchLayers[i].id));
      }
    },

    /**
    * Create and show alert message.
    * @param {string} msg
    * @memberOf widgets/NearMe/Widget
    **/
    _showMessage: function (msg) {
      var alertMessage = new Message({
        message: msg
      });
      alertMessage.message = msg;
    },

    /**
    * Initialize all widget components
    * @memberOf widgets/NearMe/Widget
    */
    _initWidgetComponents: function () {
      //create graphic layer to add buffer
      this._bufferGraphicLayer = new GraphicsLayer();
      this.map.addLayer(this._bufferGraphicLayer);
      //create graphic layer to add search location graphic
      this._highlightGraphicsLayer = new GraphicsLayer();
      this.map.addLayer(this._highlightGraphicsLayer);
      //Create search widget
      this._createSearchInstance();
      //initialize reverse geocoder
      this._initReverseGeocoder();
      //initialize buffer distance slider
      this._createSlider();
      //initialize loading indicator
      this._initLoading();
      //initialize layer list widget
      this._initLayerList();
      // show bufferslider widget if configured layers
      // are not polygon type and intersect polygon flag is disabled
      this._setBufferSliderVisiblity();
      //create tool-tip to be shown on map move
      this._mapTooltip = domConstruct.create("div", {
        "class": "tooltip",
        "innerHTML": this.nls.selectLocationToolTip
      }, this.map.container);
      domStyle.set(this._mapTooltip, "position", "fixed");
      domStyle.set(this._mapTooltip, "display", "none");
      //reset the widget's components on window resize and on widget open
      this.own(on(window, 'resize', lang.hitch(this, this._onWindowResize)));
    },

    /**
    * This function initialize the search widget
    * @memberOf widgets/NearMe/Widget
    */
    _createSearchInstance: function () {
      var searchInstance, searchOptions;
      // get webmap response
      this.config.response = this.map.webMapResponse;
      //set search options
      searchOptions = {
        addLayersFromMap: false,
        autoNavigate: false,
        autoComplete: true,
        minCharacters: 0,
        maxLocations: 5,
        searchDelay: 100,
        enableHighlight: false
      };
      // create an instance of search widget
      searchInstance = new SearchInstance({
        searchOptions: searchOptions,
        domNode: this.search,
        config: this.config,
        nls: this.nls,
        map: this.map
      });
      //handle search widget events
      searchInstance.on("select-result", lang.hitch(this, function (evt) {
        evt.isFeatureFromMapClick = false;
        //now init the workflow
        this._initWorkflow(evt);
      }));
      searchInstance.on("clear-search", lang.hitch(this, this._clearResults));
      searchInstance.on("search-results", lang.hitch(this, this._clearResults));
      searchInstance.on("search-loaded", lang.hitch(this, function () {
        setTimeout(lang.hitch(this, function () {
          //get search container node to resize the search control
          this._searchContainerNodeElement = query(
                    ".jimu-widget-nearme .arcgisSearch .searchGroup .searchInput"
                )[0];
          //set _hasMulitpleSourcesInSearch to false if multiple sources are not present
          if (searchInstance.search.sources.length < 2) {
            this._hasMulitpleSourcesInSearch = false;
          }
          this._onWindowResize();
        }), 1000);
      }));
      // once widget is created call its startup method
      searchInstance.startup();
    },

    /**
    * This function initialize the Locator widget for reverse geocoding
    * @memberOf widgets/NearMe/Widget
    */
    _initReverseGeocoder: function () {
      //By default if no geocoding service available in org then ArcGis online GeocodeServer will be used for reverse geocoding.
      var geocodeURL =
        "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";
      if (this.config.helperServices && this.config.helperServices.geocode &&
        this.config.helperServices.geocode[0] && this.config.helperServices
        .geocode[0].url) {
        geocodeURL = this.config.helperServices.geocode[0].url;
      }
      //create the locator instance to reverse geocode the address
      this._locatorInstance = new Locator(geocodeURL);
      this._locatorInstance.on("location-to-address-complete", lang.hitch(
        this, this._onLocationToAddressComplete));
    },

    /**
    * Callback handler called once location is reverse geocoded
    * @memberOf widgets/NearMe/Widget
    */
    _onLocationToAddressComplete: function (result) {
      var screenPoint, infoTemplate;
      //check if address available
      if (result.address && result.address.address) {
        //create info-template
        infoTemplate = new InfoTemplate();
        infoTemplate.setContent("${Match_addr}");
        infoTemplate.setTitle(this.nls.searchLocationTitle);
        //clears previous features of the infowindow
        this.map.infoWindow.clearFeatures();
        //set title and content to infowindow
        this.map.infoWindow.setTitle(this.nls.searchLocationTitle);
        this.map.infoWindow.setContent(result.address.address.Match_addr);
        //show infowindow on selected location
        screenPoint = this.map.toScreen(this._searchedLocation.geometry);
        this.map.infoWindow.show(screenPoint, this.map.getInfoWindowAnchor(
          screenPoint));
        this.map.infoWindow.isShowing = true;
      }
    },

    /**
    * This function initialize the search widget
    * @memberOf widgets/NearMe/Widget
    */
    _initWorkflow: function (evt) {
      var selectedFeature;
      //clear previous results
      this._clearResults();
      //get selected feature
      selectedFeature = this._getSelectedFeatureFromResult(evt);
      this._searchedLocation = selectedFeature;
      //if feature is form map click show the reverse geocoded address
      if (evt.isFeatureFromMapClick && this._searchedLocation && this._searchedLocation
          .geometry) {
        this._locatorInstance.locationToAddress(webMercatorUtils
            .webMercatorToGeographic(this._searchedLocation.geometry), 100);
      }
      /** search code goes here **/
      //If selected feature is point only then init workflow to search
      //else only show the selected polygon or polyline on map and show info-window, and set extent of map to selected geometry
      if (selectedFeature && selectedFeature.geometry &&
        selectedFeature.geometry.type === "point") {
        //show error message if no popup's are configured for any layers
        if (this._itemListObject.hasValidLayers()) {
          //show selected location on map
          this._highlightSelectedLocation(selectedFeature);
          // create buffer based on specified geometry
          this._createBuffer(selectedFeature.geometry);
        }
        else {
          this._showMessage(this.nls.allPopupsDisabledMsg);
        }
      } else {
        this.map.setExtent(selectedFeature.geometry.getExtent().expand(
          1.5));
      }
    },

    /**
    * This function will clear results
    * @memberOf widgets/NearMe/Widget
    **/
    _clearResults: function () {
      if (this._highlightGraphicsLayer) {
        this._highlightGraphicsLayer.clear();
      }
      this._searchedLocation = null;
      if (this._itemListObject) {
        this._itemListObject.clearResultPanel();
      }
      this.map.infoWindow.hide();
    },

    /**
    * This function will connects the map event
    * @memberOf widgets/NearMe/Widget
    **/
    _connectMapEventHandler: function () {
      this._disableWebMapPopup();
      //handle map click
      this._mapClickHandler = this.map.on("click", lang.hitch(this,
        this._onMapClick));
      //handle mouse move on map to show tooltip only on non-touch devices
      if ("ontouchstart" in document.documentElement) {
        domStyle.set(this._mapTooltip, "display", "none");
      } else {
        this._mapMoveHandler = this.map.on("mouse-move", lang.hitch(
          this, this._onMapMouseMove));
        this.map.on("mouse-out", lang.hitch(this, function () {
          domStyle.set(this._mapTooltip, "display", "none");
        }));
      }
    },

    /**
    * On map click init the workflow, and reverse geocode the address
    * to show in infowindow at the selected location.
    * @memberOf widgets/NearMe/Widget
    **/
    _onMapClick: function (evt) {
      this.map.infoWindow.hide();
      this._initWorkflow({
        "feature": new Graphic(evt.mapPoint),
        "isFeatureFromMapClick": true
      });
    },

    /**
    * On map mouse move update the toolTip position
    * to show in infowindow at the selected location.
    * @memberOf widgets/NearMe/Widget
    **/
    _onMapMouseMove: function (evt) {
      // update the tooltip as the mouse moves over the map
      var px, py;
      if (evt.clientX || evt.pageY) {
        px = evt.clientX;
        py = evt.clientY;
      } else {
        px = evt.clientX + document.body.scrollLeft -
          document.body.clientLeft;
        py = evt.clientY + document.body.scrollTop - document
          .body.clientTop;
      }
      domStyle.set(this._mapTooltip, "display", "none");
      domStyle.set(this._mapTooltip, {
        left: (px + 15) + "px",
        top: (py) + "px"
      });
      domStyle.set(this._mapTooltip, "display", "");
    },

    /**
    * This function will disconnects the map events
    * @memberOf widgets/NearMe/Widget
    **/
    _disconnectMapEventHandler: function () {
      this._enableWebMapPopup();
      if (this._mapClickHandler) {
        this._mapClickHandler.remove();
      }
      if (this._mapMoveHandler) {
        this._mapMoveHandler.remove();
        this._mapTooltip.style.display = "none";
      }
    },

    /**
    * This function will enable the web map popup.
    * @memberOf widgets/NearMe/Widget
    **/
    _enableWebMapPopup: function () {
      if (this.map) {
        this.map.setInfoWindowOnClick(true);
      }
    },

    /**
    * This function will disable the web map popup.
    * @memberOf widgets/NearMe/Widget
    **/
    _disableWebMapPopup: function () {
      if (this.map) {
        this.map.setInfoWindowOnClick(false);
      }
    },

    /**
    * This function create horizontal slider and set minimum maximum value of slider
    * @memberOf widgets/NearMe/Widget
    **/
    _createSlider: function () {
      // initialize and set the parameter of slider
      this._slider = new HorizontalSlider({
        name: "slider",
        minimum: 0,
        maximum: this.config.maxBufferDistance,
        value: this.config.defaultBufferDistance,
        intermediateChanges: true,
        "class": "esriCTHorizantalSlider"
      }, this.horizantalSliderContainer);
      this._bufferParams = {
        BufferDistance: this._slider.value.toString(),
        BufferUnit: this.config.bufferDistanceUnit.label
      };
      // set slider content
      domAttr.set(this.silderText, "innerHTML", string.substitute(
        this.nls.bufferSliderText, this._bufferParams));
      // on change event of slider
      this._slider.on("change", lang.hitch(this, this._sliderChange));
      // set maximum and minimum value of horizontal slider
      this.sliderMinValue.innerHTML = this._slider.minimum.toString();
      this.sliderMaxValue.innerHTML = this._slider.maximum.toString();
    },

    /**
    * Call back for slider change event
    * @memberOf widgets/NearMe/Widget
    **/
    _sliderChange: function (value) {
      this._bufferParams.BufferDistance = Math.round(value);
      domAttr.set(this.silderText, "innerHTML", string.substitute(
        this.nls.bufferSliderText, this._bufferParams));
      if (this._sliderChangeTimer) {
        clearTimeout(this._sliderChangeTimer);
      }
      // if geometry exists
      if (this._searchedLocation) {
        this._loading.show();
        this._sliderChangeTimer = setTimeout(lang.hitch(this, this._createBuffer), 700);
      }
    },

    /**
    * Create buffer based on specified geometry
    * @memberOf widgets/NearMe/Widget
    **/
    _createBuffer: function () {
      var params, geometryService, screenPoint;
      geometryService = new GeometryService(this.config.helperServices.geometry.url);
      if (this._bufferParams.BufferDistance > 0) {
        //set the buffer parameters
        params = new BufferParameters();
        params.distances = [this._bufferParams.BufferDistance];
        params.unit = GeometryService[this.config.bufferDistanceUnit.bufferUnit];
        params.bufferSpatialReference = new SpatialReference({
          "wkid": this.map.spatialReference.wkid
        });
        params.outSpatialReference = this.map.spatialReference;
        params.geometries = [this._searchedLocation.geometry];
        geometryService.buffer(params, lang.hitch(this, function (
          geometries) {
          this._showBuffer(geometries);
          this.map.setExtent(geometries[0].getExtent().expand(1.5)).then(lang.hitch(this,
          function () {
            if (this.map.infoWindow && this.map.infoWindow.isShowing) {
              screenPoint = this.map.toScreen(this._searchedLocation.geometry);
              this.map.infoWindow.show(screenPoint, this.map.getInfoWindowAnchor(
            screenPoint));
            }
          }));

          this._itemListObject.displayLayerList(this._searchedLocation,
            geometries[0]);
        }), lang.hitch(this, function () {
          this._showMessage(this.nls.unableToCreateBuffer);
          this._loading.hide();
        }));
      } else {
        this._showMessage(this.nls.bufferSliderValueString);
        //clear result panel if buffer distance is set to '0'
        this._itemListObject.clearResultPanel();
        this._loading.hide();
      }
    },

    //show buffer on map if buffer visibility is set to true in config
    _showBuffer: function (bufferedGeometries) {
      if (this.config.bufferInfo && this.config.bufferInfo.isVisible) {
        this._bufferGraphicLayer.clear();
        if (this.config && this.config.symbols && this.config.symbols.bufferSymbol) {
          var symbol = symbolJsonUtils.fromJson(this.config.symbols.bufferSymbol);
          array.forEach(bufferedGeometries, lang.hitch(this, function (geometry) {
            var graphic = new Graphic(geometry, symbol);
            this._bufferGraphicLayer.add(graphic);
          }));
        }
      }
    },
    /**
    * Set the selected feature from results
    * @memberOf widgets/NearMe/Widget
    **/
    _getSelectedFeatureFromResult: function (evt) {
      var selectedFeature;
      if (evt) {
        if (evt.feature) {
          selectedFeature = evt.feature;
        } else if (evt.result && evt.result.feature) {
          selectedFeature = evt.result.feature;
        }
      }
      return selectedFeature;
    },

    /**
    * Function to highlight features on map
    * @memberOf widgets/NearMe/Widget
    **/
    _highlightSelectedLocation: function (selectedFeature) {
      var symbol;
      if (selectedFeature) {
        this._highlightGraphicsLayer.clear();
        // set the graphic symbol for selected point and highlight on map
        symbol = symbolJsonUtils.fromJson(this.config.symbols.graphicLocationSymbol);
        this._highlightGraphicsLayer.add(new Graphic(selectedFeature.geometry,
          symbol));
      }
    },

    /**
    * Window resize handler
    * @memberOf widgets/NearMe/Widget
    **/
    _onWindowResize: function () {
      if (this._windowResizeTimer) {
        clearTimeout(this._windowResizeTimer);
      }
      this._windowResizeTimer = setTimeout(lang.hitch(this, this._resetComponents),
        500);
    },

    /**
    * Resets the components of the widgets according to updated size
    * @memberOf widgets/NearMe/Widget
    **/
    _resetComponents: function () {
      var containerGeom, calculatedWidth, searchGroup;
      //get search group to override max width overridden by some themes
      searchGroup = query(
          ".jimu-widget-nearme .arcgisSearch .searchGroup"
        )[0];
      if (!this._searchContainerNodeElement) {
        this._searchContainerNodeElement = query(
          ".jimu-widget-nearme .arcgisSearch .searchGroup .searchInput"
        )[0];
      }
      //reset the width of search control to fit in available panel width
      if (this.widgetMainNode && this._searchContainerNodeElement) {
        containerGeom = domGeom.position(this.widgetMainNode);
        if (containerGeom && containerGeom.w) {
          calculatedWidth = (containerGeom.w - 144);
          //if search is not having multiple sources it will not display arrow
          if (!this._hasMulitpleSourcesInSearch) {
            calculatedWidth += 32;
          }
          if (calculatedWidth > 0) {
            //As some of the themes have overridden width of search widget and have applied important priority to it,
            //we need to use style.setProperty method instead of dojo domStyle.
            this._searchContainerNodeElement.style.setProperty('width',
                calculatedWidth + "px", 'important');
            if (searchGroup) {
              searchGroup.style.setProperty('max-width', "100%", 'important');
            }
          }
        }
      }
    },

    /**
    * Initialize item-list widget to display summary of results
    * @memberOf widgets/NearMe/Widget
    **/
    _initLayerList: function () {
      this._itemListObject = new ItemList({
        map: this.map,
        config: this.config,
        nls: this.nls,
        loading: this._loading,
        parentDivId: this.id,
        folderUrl: this.folderUrl,
        outerContainer: this.layerListOuterDiv
      });

      if (this.id && registry.byId(this.id) && registry.byId(this.id).resize) {
        registry.byId(this.id).resize();
      }
    },

    /**
    * This function used for loading indicator
    * @memberOf widgets/NearMe/Widget
    */
    _initLoading: function () {
      this._loading = new LoadingIndicator({
        hidden: true
      });
      this._loading.placeAt(this.domNode);
      this._loading.startup();
    },

    /**
    * This function checks if all configured layers are
    * not polygon and intersectSearchedLocation flag
    * is disabled then it shows horizontal slider widget
    * @memberOf widgets/NearMe/Widget
    */
    _setBufferSliderVisiblity: function () {
      var hideHorizontalSliderFlag = true, itemListMainContainer, horzontalSliderNode;
      // if layers are configured in configuration
      if (this.config.searchLayers && this.config.searchLayers.length > 0) {
        // looping through the configured layers
        array.some(this.config.searchLayers, lang.hitch(this, function (layer) {
          // if geometryType is other than esriGeometryPolygon
          // sets flag to false
          if (layer.geometryType !== "esriGeometryPolygon") {
            hideHorizontalSliderFlag = false;
            return false;
          }
        }));
        // if horizontal slider && intersectSearchedLocation flag is true
        // then resize item list container else show horizontal slider widget
        if (this.config.intersectSearchedLocation && hideHorizontalSliderFlag) {
          itemListMainContainer = query(".esriCTItemListMainContainer", this.domNode);
          if (itemListMainContainer) {
            domClass.add(itemListMainContainer[0], "esriCTItemListOverrideMainContainer");
          }
        } else {
          horzontalSliderNode = query(".esriCTSliderDiv", this.widgetMainNode);
          domClass.remove(horzontalSliderNode[0], "esriCTHidden");
        }
      }
    }
  });
});