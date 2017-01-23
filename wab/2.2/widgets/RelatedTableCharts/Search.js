define([
  "dojo/_base/declare",
  "dojo/Evented",
  "dojo/dom-class",
  "dojo/_base/lang",
  "dojo/_base/array",
  "esri/dijit/Search",
  "esri/tasks/locator",
  "esri/lang",
  "esri/layers/FeatureLayer",
  "esri/dijit/PopupTemplate",
  "jimu/utils"
], function (
  declare,
  Evented,
  domClass,
  lang,
  array,
  Search,
  Locator,
  esriLang,
  FeatureLayer,
  PopupTemplate,
  jimuUtils
) {
  return declare([Evented], {
    domNode: null,
    config: null,
    map: null,
    searchOptions: null,
    _urlParams: {},
    constructor: function (options) {
      lang.mixin(this, options);
    },

    startup: function () {
      this._init();
    },

    /* ----------------- */
    /* Private Functions */
    /* ----------------- */
    /**
    * This function will create search widget instance, and add the options according to business need.
    **/
    _init: function () {
      var options, defaultSources, searchLayers;
      options = {
        map: this.map,
        addLayersFromMap: false,
        autoNavigate: false,
        autoComplete: true,
        minCharacters: 0,
        maxLocations: 5,
        searchDelay: 100
      };
      lang.mixin(options, this.searchOptions);

      //get url parameters
      this._urlParams = this._getUrlParams();
      defaultSources = this._getGeocoders();
      searchLayers = this._getSearchLayers();
      if (searchLayers.length > 0) {
        defaultSources = defaultSources.concat(searchLayers);
      }
      this.search = new Search(options, this.domNode);
      this.search.set("sources", defaultSources);

      this.search.on("load", lang.hitch(this, this._load));
      this.search.on("select-result", lang.hitch(this, this._selectResult));
      this.search.on("clear-search", lang.hitch(this, this._clear));
      this.search.on("search-results", lang.hitch(this, this._results));
      this.search.on("suggest-results", lang.hitch(this, this._results));
      this.search.startup();
      domClass.add(this.domNode, "searchControl");
    },

    /**
    * get URL parameters
    **/
    _getUrlParams: function () {
      var urlObject = jimuUtils.urlToObject(document.location.href);
      urlObject.query = urlObject.query || {};
      return urlObject.query;
    },

    /**
    * set search string if available in url parameters
    **/
    _setSearchString: function () {
      if (this._urlParams.find) {
        this.search.set('value', this._urlParams.find);
        // search for URL's find parameter after sometime to avoid the suggestion list
        setTimeout(lang.hitch(this, function () {
          this.search.search();
        }), 1000);
      }
    },

    /**
    * This function will get all the geocoder's from organization info.
    **/
    _getGeocoders: function () {
      var geocoders, defaultSources;
      defaultSources = [];
      if (this.config.helperServices && this.config.helperServices.geocode !==
        null) {
        geocoders = lang.clone(this.config.helperServices.geocode);
        // each geocoder
        if (geocoders.length === 0) {
          return defaultSources;
        }
        array.forEach(geocoders, lang.hitch(this, function (geocoder) {
          if (geocoder.url) {
            if (geocoder.url.indexOf(
                ".arcgis.com/arcgis/rest/services/World/GeocodeServer"
              ) > -1) {
              geocoder.hasEsri = true;
              geocoder.locator = new Locator(geocoder.url);
              geocoder.placefinding = true;
              geocoder.singleLineFieldName = "SingleLine";
              geocoder.name = geocoder.name ||
                "Esri World Geocoder";
              //set place holder with geocoder name if it is not configured
              geocoder.placeholder = geocoder.placeholder || geocoder.name;
              if (this.config.searchExtent) {
                geocoder.searchExtent = this.map.extent;
                geocoder.localSearchOptions = {
                  minScale: 300000,
                  distance: 50000
                };
              }
              geocoder.suggest = true;
              defaultSources.push(geocoder);
            } else if (esriLang.isDefined(geocoder.singleLineFieldName)) {
              //Add geocoders with a singleLineFieldName defined
              geocoder.locator = new Locator(geocoder.url);
              geocoder.suggest = true;
              defaultSources.push(geocoder);
            }
          }
        }));
      }
      return defaultSources;
    },

    /**
    * This function will get all the layers from map for which search is enabled.
    **/
    _getSearchLayers: function () {
      var defaultSources, searchOptions;
      defaultSources = [];
      //Add search layers defined on the web map item
      if (this.config.response.itemInfo.itemData && this.config.response
        .itemInfo.itemData.applicationProperties && this.config.response
        .itemInfo.itemData.applicationProperties.viewing && this.config
        .response.itemInfo.itemData.applicationProperties.viewing.search &&
        this.config.response.itemInfo.itemData.applicationProperties.viewing
        .search.enabled) {
        searchOptions = this.config.response.itemInfo.itemData.applicationProperties
          .viewing.search;
        array.forEach(searchOptions.layers, lang.hitch(this, function (
          searchLayer) {
          var operationalLayers, layer, source, url, name,
            popupInfo, subLayerInfo, definitionExpression;
          //we do this so we can get the title specified in the item
          operationalLayers = this.config.response.itemInfo.itemData
            .operationalLayers;
          layer = null;
          array.some(operationalLayers, function (opLayer) {
            if (opLayer.id === searchLayer.id) {
              layer = opLayer;
              return true;
            }
          });
          if (layer && layer.hasOwnProperty("url")) {
            if (layer.layerObject) {
              source = {};
              url = layer.url;
              name = layer.title || layer.name;
              if (esriLang.isDefined(searchLayer.subLayer)) {
                url = url + "/" + searchLayer.subLayer;
                array.some(layer.layerObject.layerInfos,
                  function (info) {
                    if (info.id === searchLayer.subLayer) {
                      name += " - " + layer.layerObject.layerInfos[
                        searchLayer.subLayer].name;
                      return true;
                    }
                  });
                subLayerInfo = this._getSubLayerInfo(layer,
                  searchLayer.subLayer);
                popupInfo = subLayerInfo && subLayerInfo.popupInfo;
                definitionExpression = subLayerInfo &&
                  subLayerInfo.definitionExpression;
              } else {
                popupInfo = layer.popupInfo;
                definitionExpression = layer.layerDefinition &&
                  layer.layerDefinition.definitionExpression;
              }
              if (popupInfo) {
                source.infoTemplate = new PopupTemplate(
                  popupInfo);
              }
              source.featureLayer = new FeatureLayer(url);
              //set definition expression
              if (definitionExpression) {
                source.featureLayer.setDefinitionExpression(
                  definitionExpression);
              }
              source.name = name;
              source.exactMatch = searchLayer.field.exactMatch;
              source.displayField = searchLayer.field.name;
              source.searchFields = [searchLayer.field.name];
              source.placeholder = searchOptions.hintText;
              source.outFields = ["*"];
              defaultSources.push(source);
            }
          }
        }));
      }
      return defaultSources;
    },

    /**
    * This function will get return layer-info like popupInfo,definitionExpression in case of sublayers.
    **/
    _getSubLayerInfo: function (opLayer, layerId) {
      var subLayerInfo = {};
      array.some(opLayer.layers, lang.hitch(this, function (subLayer) {
        if (subLayer.id === parseInt(layerId, 10)) {
          subLayerInfo.popupInfo = subLayer.popupInfo;
          //set layer's definitionExpression
          if (subLayer.layerDefinition && subLayer.layerDefinition
            .definitionExpression) {
            subLayerInfo.definitionExpression = subLayer.layerDefinition
              .definitionExpression;
          }
        }
      }));
      return subLayerInfo;
    },

    /* ----------------------- */
    /* Event handler functions */
    /* ----------------------- */
    _load: function (evt) {
      this.emit("search-loaded", evt);
      //set default search string if available in url parameters
      this._setSearchString();
    },

    _results: function (evt) {
      this.emit("search-results", evt);
    },

    _clear: function (evt) {
      this.emit("clear-search", evt);
    },

    _selectResult: function (evt) {
      //code to focus out the textbox (issue with android tab)
      this.search.blur();
      this.emit("select-result", evt);
    }

  });
});