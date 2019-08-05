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
    'jimu/BaseWidget',
    'esri/dijit/Directions',
    'esri/tasks/locator',
    'esri/tasks/RouteParameters',
    'esri/request',
    'esri/graphicsUtils',
    'jimu/LayerInfos/LayerInfos',
    "./queryUtil",
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/_base/array',
    'dojo/_base/config',
    'dojo/Deferred',
    'esri/lang',
    'dojo/promise/all',
    'dojo/when',
    'jimu/portalUtils',
    'jimu/utils',
    'esri/layers/FeatureLayer',
    //"esri/tasks/FeatureSet",
    "jimu/dijit/Message",
    'jimu/dijit/LoadingIndicator',
    "./a11y/Widget",
    "./searchUtil"
  ],
  function(declare, BaseWidget, Directions, Locator, RouteParameters, esriRequest, graphicsUtils, LayerInfos, queryUtil,
    ArcGISDynamicMapServiceLayer, on, lang, html, array, dojoConfig, Deferred, esriLang,
     all, when, portalUtils, jimuUtils, FeatureLayer,/* FeatureSet,*/ Message,  LoadingIndicator, a11y, searchUtils) {

    var clazz = declare([BaseWidget], {
      name: 'Directions',
      baseClass: 'jimu-widget-directions',
      _dijitDirections:null,
      _routeTaskUrl: "//route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
      _locatorUrl: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
      _active: false,//save last active state
      _dijitDef: null,
      _trafficLayer: null,
      _isInitPresetStopsFlag: false,
      _barriersFeatureSet: {},

      _updateBarriersFlag: false,

      postCreate: function() {
        this.inherited(arguments);
        this.shelter = new LoadingIndicator({ hidden: true }); //LoadingIndicator
        this.shelter.placeAt(this.domNode);
        this.shelter.startup();
      },

      onOpen: function () {
        this._toggleDartStyleByAppConfig();
        this.widgetManager.activateWidget(this);

        this.a11y_updateFocusNodes({isFouceToFirstNode:true});
      },

      onClose: function(){
        this._hide();
      },

      onNormalize: function(){
        this._show();
      },

      onMinimize: function(){
        this._hide();
      },

      onMaximize: function(){
        this._show();
      },

      onDeActive: function(){
        this._deactivateDirections();
        this._enableWebMapPopup();
      },

      setStartStop: function(stop){
        this.getDirectionsDijit().then(lang.hitch(this, function(directionsDijit){
          directionsDijit.reset().then(lang.hitch(this, function(){
            directionsDijit.addStop(stop);
          }), lang.hitch(this, function(err){
            console.error(err);
          }));
        }), lang.hitch(this, function(err){
          console.error(err);
        }));
      },

      addStop: function(stop){
        this.getDirectionsDijit().then(lang.hitch(this, function(directionsDijit) {
          directionsDijit.addStop(stop);
        }), lang.hitch(this, function(err) {
          console.error(err);
        }));
      },

      getDirectionsDijit: function(){
        if(!this._dijitDef){
          this._dijitDef = new Deferred();
        }
        if(this._dijitDef.isFulfilled()){
          this._dijitDef = new Deferred();
        }
        if(this._dijitDirections){
          this._dijitDef.resolve(this._dijitDirections);
        }
        return this._dijitDef;
      },

      _handlePopup: function(){
        if(this.map.activeDirectionsWidget && this.map.activeDirectionsWidget.mapClickActive){
          this._disableWebMapPopup();
        }else{
          this._enableWebMapPopup();
        }
      },

      _disableWebMapPopup:function(){
        if(this.map){
          this.map.setInfoWindowOnClick(false);
        }
      },

      _enableWebMapPopup:function(){
        if(this.map){
          this.map.setInfoWindowOnClick(true);
        }
      },

      destroy: function(){
        if(this.map.activeDirectionsWidget === this._dijitDirections){
          this.map.activeDirectionsWidget = null;
        }
        if(this._trafficLayer){
          this.map.removeLayer(this._trafficLayer);
          this._trafficLayer = null;
        }
        this._handlePopup();

        this.inherited(arguments);
      },

      startup: function () {
        this.inherited(arguments);
        this.shelter.show();
        this.a11y_init();

        this.portal = portalUtils.getPortal(this.appConfig.portalUrl);

        //older config:
        //this.config = JSON.parse('{"routeTaskUrl":"https://routedev.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World","travelModesUrl":"","trafficLayerUrl":"","routeOptions":{"directionsLanguage":"en","directionsLengthUnits":"esriKilometers","impedanceAttribute":""},"geocoderOptions":{"autoComplete":true,"maxLocations":22,"minCharacters":1,"searchDelay":555,"arcgisGeocoder":false,"geocoders":[{"url":"http://sampleserver6.arcgisonline.com/arcgis/rest/services/Locators/SanDiego/GeocodeServer","placeholder":"Find address or place444"}]},"defaultLocations":["",""]}');

        //this.config = JSON.parse('{"routeTaskUrl":"https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World","travelModesUrl":"","trafficLayerUrl":"","routeOptions":{"directionsLanguage":"en-us","directionsLengthUnits":"esriKilometers","impedanceAttribute":""},"geocoderOptions":{"autoComplete":true,"maxLocations":6,"minCharacters":3,"searchDelay":350,"arcgisGeocoder":false,"geocoders":[{"url":"http://sampleserver6.arcgisonline.com/arcgis/rest/services/Locators/SanDiego/GeocodeServer","placeholder":"Find address or place"}]},"defaultLocations":["Beijing Express - 8741 Broadway, La Mesa","Shanghai Cafe - 7770 Regents Rd, San Diego"],"searchOptions":{"enableSuggestions":true,"maxSuggestions":6,"minCharacters":3,"suggestionDelay":350,"sources":[{"locator":{"url":"http://sampleserver6.arcgisonline.com/arcgis/rest/services/Locators/SanDiego/GeocodeServer","_url":{"path":"http://sampleserver6.arcgisonline.com/arcgis/rest/services/Locators/SanDiego/GeocodeServer","query":null},"normalization":true},"name":"Sample geocoder for San Diego, California, USA","singleLineFieldName":"SingleLine","outFields":["*"],"placeholder":"Find address or place","searchTemplate":"${Match_addr}"}]}}');

        //this.config = JSON.parse('{"routeTaskUrl":"https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World","travelModesUrl":"","trafficLayerUrl":"","routeOptions":{"directionsLanguage":"en-us","directionsLengthUnits":"esriKilometers","impedanceAttribute":""},"geocoderOptions":{"autoComplete":true,"maxLocations":6,"minCharacters":3,"searchDelay":350,"arcgisGeocoder":false,"geocoders":[{"url":"https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer","placeholder":"Find address or place"}]},"defaultLocations":["Beijing","Shanghai"],"searchOptions":{"enableSuggestions":true,"maxSuggestions":6,"minCharacters":3,"suggestionDelay":350,"sources":[{"locator":{"url":"https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer","_url":{"path":"https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer","query":null},"normalization":true},"name":"World Geocoder","singleLineFieldName":"SingleLine","outFields":["*"],"placeholder":"Find address or place"}]}}');
        //this.config = JSON.parse('{"routeTaskUrl":"https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World","travelModesUrl":"","trafficLayerUrl":"","routeOptions":{"directionsLanguage":"en-us","directionsLengthUnits":"esriKilometers","impedanceAttribute":""},"geocoderOptions":{"autoComplete":true,"maxLocations":6,"minCharacters":3,"searchDelay":350,"arcgisGeocoder":false,"geocoders":[{"url":"http://sampleserver6.arcgisonline.com/arcgis/rest/services/Locators/SanDiego/GeocodeServer","placeholder":"Find address or place"}]},"defaultLocations":["Beijing Express - 8741 Broadway, La Mesa","shanghai"],"searchOptions":{"enableSuggestions":true,"maxSuggestions":6,"minCharacters":3,"suggestionDelay":350,"sources":[{"locator":{"url":"http://sampleserver6.arcgisonline.com/arcgis/rest/services/Locators/SanDiego/GeocodeServer","_url":{"path":"http://sampleserver6.arcgisonline.com/arcgis/rest/services/Locators/SanDiego/GeocodeServer","query":null},"normalization":true},"name":"Sample geocoder for San Diego, California, USA","singleLineFieldName":"SingleLine","outFields":["*"],"placeholder":"Find address or place","searchTemplate":"${Match_addr}"}]}}');
        this._IS_CONFIG_BEFORE_63 = searchUtils.version.isConfigBefore63(this.config);//for old version config, without search config
        this._getLayerInfos().then(lang.hitch(this, function () {

          var printUrlDef = this._getOrgPrintServiceURL(this.appConfig.portalUrl);
          var preProcessDef = this._preProcessConfig();
          var barriersDefs = queryUtil.queryBarriers(this.config);
          var defs = [printUrlDef, preProcessDef];
          defs = defs.concat(barriersDefs);

          /////////////////////////////////
          if (queryUtil.havePresetBarrierLayers(this.config)) {
            this.layerInfosObj = LayerInfos.getInstanceSync();
            this.own(on(this.layerInfosObj, 'layerInfosFilterChanged', lang.hitch(this, function (layers) {
              if (true === this._updateBarriersFlag && queryUtil.findBarrierLayer(layers, this.config)) {
                this._queryAndUpdateBarriersFeatureSet();
              }
            })));
            // var pointLayers = this.config.barrierLayers.pointLayers,
            //   polylineLayers = this.config.barrierLayers.polylineLayers,
            //   polygonLayers = this.config.barrierLayers.polygonLayers;
            // this._bindBarrierLayerEditEvent(pointLayers);
            // this._bindBarrierLayerEditEvent(polylineLayers);
            // this._bindBarrierLayerEditEvent(polygonLayers);
          }
          /////////////////////////////////

          all(defs).then(lang.hitch(this, function (results) {
            var orgPrintServiceUrl = results[0];

            var routeParams = new RouteParameters();
            var routeOptions = this.config.routeOptions;
            if (routeOptions) {
              if (routeOptions.directionsLanguage) {
                routeParams.directionsLanguage = routeOptions.directionsLanguage;
              } else {
                routeParams.directionsLanguage = dojoConfig.locale || "en_us";
              }
              routeParams.directionsLengthUnits = routeOptions.directionsLengthUnits;
              //routeParams.directionsOutputType = routeOptions.directionsOutputType;
              if (routeOptions.impedanceAttribute) {
                routeParams.impedanceAttribute = routeOptions.impedanceAttribute;
              }
            }

            var options = {
              map: this.map,
              searchOptions: this.config.searchOptions,
              routeParams: routeParams,
              routeTaskUrl: this.config.routeTaskUrl,
              dragging: true,
              showClearButton: true,
              showSaveButton: true,
              mapClickActive: true,
              printTaskUrl: orgPrintServiceUrl
            };

            //barriers
            var pointBarriersFeatureSet = results[2];
            this._barriersFeatureSet.point = pointBarriersFeatureSet;
            var polylineBarriersFeatureSet = results[3];
            this._barriersFeatureSet.polyline = polylineBarriersFeatureSet;
            var polygonBarriersFeatureSet = results[4];
            this._barriersFeatureSet.polygon = polygonBarriersFeatureSet;

            //if there is pre-set Barriers, hide "barrierBtn" showBarriersButton
            if (queryUtil.havePresetBarrierLayers(this.config)) {
              options.showBarriersButton = false;
            }

            //set units on root for API-3.20
            if (this.config.routeOptions && this.config.routeOptions.directionsLengthUnits) {
              options.directionsLengthUnits = this.config.routeOptions.directionsLengthUnits;
            }
            if (this.config.trafficLayerUrl) {
              this._trafficLayer = new ArcGISDynamicMapServiceLayer(this.config.trafficLayerUrl);
              options.trafficLayer = this._trafficLayer;
              options.traffic = true;
            } else {
              options.traffic = false;
              options.showTrafficOption = false;
            }

            this.setDoNotFetchTravelModes(options).then(lang.hitch(this, function () {
              html.empty(this.directionController);
              var directionContainer = html.create('div', {}, this.directionController);
              //Only init Directions dijit when we can access the route task url.
              esriRequest({
                url: options.routeTaskUrl,
                content: {
                  f: 'json'
                },
                handleAs: 'json',
                callbackParamName: 'callback'
              }).then(lang.hitch(this, function () {
                this._dijitDirections = new Directions(options, directionContainer);
                //html.place(this._dijitDirections.domNode, this.directionController);
                this._dijitDirections.startup();

                this.own(on(this._dijitDirections, 'load', lang.hitch(this, this._onDirectionsActivate)));
                this.own(on(this._dijitDirections,
                  'directions-start',
                  lang.hitch(this, this._onDirectionsStart)));

                this.own(on(this._dijitDirections,
                  'directions-finish',
                  lang.hitch(this, this._onDirectionsFinish)));

                this.own(on(this._dijitDirections,
                  'directions-clear',
                  lang.hitch(this, this._onDirectionsClear)));

                this.own(on(this._dijitDirections,
                  'map-click-active',
                  lang.hitch(this, this._handlePopup)));

                this._activateDirections();
                this._storeLastActiveState();

                this.a11y_initEvents();
                //this.a11y_hackAttr();
                this.a11y_updateFocusNodes();

                if (this._dijitDef && !this._dijitDef.isFulfilled()) {
                  this._dijitDef.resolve(this._dijitDirections);
                }
              }), lang.hitch(this, function (err) {
                console.log("Can't access " + options.routeTaskUrl, err);
              })).always(lang.hitch(this, function () {
                this.shelter.hide();
              }));

            }), lang.hitch(this, function (err) {
              console.error(err);
            }));
          }))/*.always(lang.hitch(this, function() {
          this.shelter.hide();
        }))*/;

        }));
      },

      onAppConfigChanged: function(appConfig){
        this.appConfig = appConfig;
        this._toggleDartStyleByAppConfig();
      },

      _onDirectionsStart: function(){
        this._updateBarriersByConfig();
      },
      _updateBarriersByConfig: function () {
        if (queryUtil.havePresetBarrierLayers(this.config) && !this._updateBarriersFlag) {
          this._queryAndUpdateBarriersFeatureSet();

          this._updateBarriersFlag = true;
        }
      },

      _onDirectionsFinish: function(evt){
        if(evt && evt.result){
          var routeResults = evt.result.routeResults;
          if(lang.isArrayLike(routeResults) && routeResults.length > 0){
            var routes = [];
            array.forEach(routeResults, function(routeResult){
              if(routeResult.route){
                routes.push(routeResult.route);
              }
            });
            if(routes.length > 0){
              var ext = null;
              try{
                ext = graphicsUtils.graphicsExtent(routes);
                if(ext){
                  ext = ext.expand(1.3);
                }
              }catch(e){
                console.log(e);
              }
              if(ext){
                this.map.setExtent(ext);
              }
            }

            this.a11y_focusWhenFinish();
          }
        }

        this.a11y_updateFocusNodes();
      },
      _onDirectionsClear: function(/*evt*/){
        if (queryUtil.havePresetBarrierLayers(this.config) && this._updateBarriersFlag) {
          this._clearBarriersFeatureSet();

          this._updateBarriersFlag = false;
        }
        // setTimeout(lang.hitch(this, function () {
        //   this.a11y_updateFocusNodes();
        // }), 100);
      },

      _preProcessConfig:function(){
        var def = new Deferred();
        if(this._IS_CONFIG_BEFORE_63){
          //for old config
          all([this._getRouteTaskUrl(), this._getLocatorUrl()]).then(
            lang.hitch(this, function(results){
            this.config.routeTaskUrl = results[0];
            this.config.routeTaskUrl = this._replaceRouteTaskUrlWithAppProxy(this.config.routeTaskUrl);

            var locatorUrl = results[1];
            esriRequest({
              url: locatorUrl,
              hanleAs:'json',
              content:{
                f:'json'
              },
              callbackParamName:'callback'
            }).then(lang.hitch(this, function(geocodeMeta){
              this._upgradeToSearchOptions(geocodeMeta, locatorUrl);
              def.resolve();
            }), lang.hitch(this, function(err){
              console.error(err);
              def.reject();
            }));
          }), lang.hitch(this, function(err){
            console.error(err);
            def.reject();
          }));
        } else {
          //for new config
          searchUtils.setMap(this.map);
          searchUtils.setLayerInfosObj(this.layerInfosObj);
          searchUtils.setAppConfig(this.appConfig);
          when(searchUtils.getConfigInfo(this.config.searchOptions)).then(lang.hitch(this, function(config) {
            return all(this._convertConfig(config)).then(function(searchSouces) {
              return array.filter(searchSouces, function(source) {
                return source;
              });
            });
          })).then(lang.hitch(this, function(searchSouces) {
            this.config.searchOptions.sources = searchSouces;
            def.resolve();
          }));
          // searchUtils.config.config2Sources(this.config.searchOptions).then(lang.hitch(this, function(sources) {
          //   this.config.searchOptions.sources = sources;
          //   def.resolve();
          // }));
        }

        return def;
      },

      _replaceRouteTaskUrlWithAppProxy: function(routeTaskUrl){
        // Use proxies to replace the routeTaskUrl
        var ret = routeTaskUrl;
        if(!window.isBuilder && !this.appConfig.mode &&
            this.appConfig.appProxies && this.appConfig.appProxies.length > 0) {
          array.some(this.appConfig.appProxies, function(proxyItem) {
            if(routeTaskUrl === proxyItem.sourceUrl) {
              ret = proxyItem.proxyUrl;
              return true;
            }
          });
        }
        return ret;
      },

      _getRouteTaskUrl: function(){
        var def = new Deferred();
        if(this.config.routeTaskUrl){
          def.resolve(this.config.routeTaskUrl);
        }
        else{
          this.portal.loadSelfInfo().then(lang.hitch(this, function(response){
            if(response && response.helperServices && response.helperServices.route){
              def.resolve(response.helperServices.route.url);
            }
            else{
              def.resolve(this._routeTaskUrl);
            }
          }), lang.hitch(this, function(err){
            console.error(err);
            def.resolve(this._routeTaskUrl);
          }));
        }
        return def;
      },

      _getLocatorUrl: function(){
        var def = new Deferred();
        if(!this.config.geocoderOptions){
          this.config.geocoderOptions = {};
        }
        if(!(this.config.geocoderOptions.geocoders &&
         this.config.geocoderOptions.geocoders.length > 0)){
          this.config.geocoderOptions.geocoders = [{
            url: '',
            placeholder: ''
          }];
        }

        var geocodeArgs = this.config.geocoderOptions &&
         this.config.geocoderOptions.geocoders &&
          this.config.geocoderOptions.geocoders[0];
        var url = geocodeArgs && geocodeArgs.url;
        if(url){
          def.resolve(url);
        }
        else{
          this.portal.loadSelfInfo().then(lang.hitch(this, function(response){
            if(response && response.helperServices &&
             response.helperServices.geocode &&
              response.helperServices.geocode.length > 0){
              var geocode = response.helperServices.geocode[0];
              def.resolve(geocode.url);
            }
            else{
              def.resolve(this._locatorUrl);
            }
          }), lang.hitch(this, function(err){
            console.error(err);
            def.resolve(this._locatorUrl);
          }));
        }
        return def;
      },

      setDoNotFetchTravelModes: function(options) {
        var def = new Deferred();
        if (this.config.travelModesUrl) {
          options.travelModesServiceUrl = this.config.travelModesUrl;
          options.doNotFetchTravelModesFromOwningSystem = false;
          def.resolve();
        } else {
          this._getTravelModesUrlVersion().then(lang.hitch(this, function(version) {
            if (version && version >= 10.4) {
              options.doNotFetchTravelModesFromOwningSystem = false;
            } else {
              options.doNotFetchTravelModesFromOwningSystem = true;
            }
            def.resolve();
          }), lang.hitch(this, function(err){
            def.reject(err);
          }));
        }
        return def;
      },
      _getTravelModesUrlVersion: function() {
        var def = new Deferred();
        esriRequest({
          url: this.config.routeTaskUrl,
          content: {
            f: 'json'
          },
          handleAs: 'json',
          callbackParamName: 'callback'
        }).then(lang.hitch(this, function(results) {
          def.resolve(results.currentVersion);
        }), lang.hitch(this, function(err) {
          console.log("Can't access " + this.config.routeTaskUrl, err);
          def.reject(err);
        }));

        return def;
      },

      _hide: function(){
        if(this._dijitDirections){
          this._storeLastActiveState();
          this._deactivateDirections();
        }
      },

      _show: function(){
        if(this._dijitDirections){
          this._resetByLastActiveState();
        }
      },

      _storeLastActiveState: function(){
        if(this._dijitDirections){
          this._active = this._dijitDirections.mapClickActive;
        }
      },

      _resetByLastActiveState: function(){
        if(this._dijitDirections){
          if(this._active){
            this._activateDirections();
          }
          else{
            this._deactivateDirections();
          }
          this._storeLastActiveState();
        }
      },

      _activateDirections: function() {
        if (this._dijitDirections) {
          if (typeof this._dijitDirections.activate === 'function') {
            this._dijitDirections.activate();//Deprecated at v3.13
          }
          if (typeof this._dijitDirections.mapClickActive !== "undefined") {
            this._dijitDirections.set("mapClickActive", true);
          }
          this._disableWebMapPopup();
        }
      },

      _deactivateDirections: function() {
        if (this._dijitDirections) {
          if (typeof this._dijitDirections.deactivate === 'function') {
            this._dijitDirections.deactivate();//Deprecated at v3.13
          }
          if (typeof this._dijitDirections.mapClickActive !== "undefined") {
            this._dijitDirections.set("mapClickActive", false);
          }
          this._enableWebMapPopup();
        }
      },
      _onDirectionsActivate: function () {
        if (this.config.defaultLocations &&
          this.config.defaultLocations.length && this.config.defaultLocations.length > 0 &&
          false === this._isInitPresetStopsFlag) {

          this._isInitPresetStopsFlag = true;
          var wayPoints = searchUtils.config.getWayPoints(this.config, this._IS_CONFIG_BEFORE_63);

          if (wayPoints && (wayPoints[0] || wayPoints[1])) {
            this._dijitDirections.addStops(wayPoints);
          }
        }
      },

      isHasFrom: function () {
        var hasFrom = false;
        if (this._dijitDirections) {
          var stops = this._dijitDirections.stops;
          if (stops && stops.length >= 0) {
            var from = stops[0];
            if (("undefined" !== typeof from.name && "" !== from.name) ||
              ("undefined" !== typeof from.feature) ||
              ("undefined" !== typeof from.extent)) {
              hasFrom = true;
            }
          }
        }
        return hasFrom;
      },

      //which portal save routeLayer
      _getRouteItemPortalUrl: function (itemUrl) {
        if (!(itemUrl && itemUrl.indexOf)) {
          return null;
        }

        var context = "";
        var keyIndex = itemUrl.indexOf("/home");
        if (keyIndex < 0) {
          keyIndex = itemUrl.indexOf("/apps");
        }
        context = itemUrl.substring(0, keyIndex + 1);

        return context;
      },
      openRoute: function (feature) {
        this.getDirectionsDijit().then(lang.hitch(this, function (directionsDijit) {
          //portal where the produced route layers are going to be stored and accessed
          var routeItemPortalUrl = this._getRouteItemPortalUrl(feature.attributes.RouteLayerItemURL);
          directionsDijit.defaults.portalUrl = routeItemPortalUrl;//hack to set("portalUrl", routeItemPortalUrl), because of #9146

          directionsDijit.reset().then(lang.hitch(this, function () {
            var routeItemId = feature.attributes.RouteLayerItemID;
            directionsDijit.loadRoute(routeItemId).then(lang.hitch(this, function (/*res*/) {
              this._updateBarriersByConfig();
              /*console.log("OK", res);*/
            }, function (err) {
              console.log("ERR", err);
            }));
          }), lang.hitch(this, function (err) {
            console.error(err);
          }));
        }), lang.hitch(this, function (err) {
          console.error(err);
        }));
      },
      actionTo: function (geometry) {
        this.getDirectionsDijit().then(lang.hitch(this, function (directionsDijit) {
          var stops = this._getReplaceStops(directionsDijit, geometry, "last");
          directionsDijit.reset().then(lang.hitch(this, function () {
            directionsDijit.addStops(stops);
          }), lang.hitch(this, function (err) {
            console.error(err);
          }));
        }), lang.hitch(this, function (err) {
          console.error(err);
        }));
      },
      actionFrom: function (geometry) {
        this.getDirectionsDijit().then(lang.hitch(this, function (directionsDijit) {
          var stops = this._getReplaceStops(directionsDijit, geometry, "first");
          directionsDijit.reset().then(lang.hitch(this, function () {
            directionsDijit.addStops(stops);
          }), lang.hitch(this, function (err) {
            console.error(err);
          }));
        }), lang.hitch(this, function (err) {
          console.error(err);
        }));
      },
      _getReplaceStops: function (dijitDirections, geometry, place) {
        var stops = [];
        if (dijitDirections && dijitDirections.stops) {
          stops = lang.clone(dijitDirections.stops);//directionsDijit.reset() will clean stops now, so clone
          if (place === "first") {
            //replace first stop ,as "From"
            stops[0] = geometry;
          } else if (place === "last") {
            if (false === this.isHasFrom()) {
              //if without start stop, leave a blank
              stops = ["", geometry];
            } else {
              //append a "To" stop
              stops.push(geometry);
            }
          }
        }
        return stops;
      },
      _toggleDartStyleByAppConfig: function () {
        var themeName = this.appConfig.theme.name;
        if ((themeName === "DashboardTheme" &&
          (this.appConfig.theme.styles[0] === 'default' || this.appConfig.theme.styles[0] === 'style3')) ||
          themeName === "DartTheme") {
          html.addClass(this.domNode, "dart-theme");
        } else {
          html.removeClass(this.domNode, "dart-theme");
        }
      },
      _getOrgPrintServiceURL: function(portalUrl) {
        var printDef = new Deferred();
        if (this.config && this.config.serviceURL) {
          printDef.resolve(this.config.serviceURL);
          return printDef;
        }
        var def = portalUtils.getPortalSelfInfo(portalUrl);
        def.then(lang.hitch(this, function(response) {
          var printServiceUrl = response && response.helperServices &&
            response.helperServices.printTask && response.helperServices.printTask.url;
          if (printServiceUrl) {
            printDef.resolve(printServiceUrl);
          } else {
            printDef.reject('error');
          }
        }), lang.hitch(this, function(err) {
          new Message({
            message: this.nls.portalConnectionError
          });
          printDef.reject('error');
          console.error(err);
        }));

        return printDef;
      },

      //Barriers Layers
      _queryAndUpdateBarriersFeatureSet: function () {
        this._dijitDirections.routeParams.barriers = [];
        this._dijitDirections.routeParams.polylineBarriers = [];
        this._dijitDirections.routeParams.polygonBarriers = [];
        this._clearBarriersFeatureSet();

        var barriersDefs = queryUtil.queryBarriers(this.config);
        all(barriersDefs).then(lang.hitch(this, function(results){
          var pointBarriersFeatureSet = results[0];
          this._barriersFeatureSet.point = pointBarriersFeatureSet;
          var polylineBarriersFeatureSet = results[1];
          this._barriersFeatureSet.polyline = polylineBarriersFeatureSet;
          var polygonBarriersFeatureSet = results[2];
          this._barriersFeatureSet.polygon = polygonBarriersFeatureSet;
          this._updateBarriersFeatureSet();
        }));
      },
      _updateBarriersFeatureSet: function () {
        if (!this._dijitDirections || !this._barriersFeatureSet) {
          return;
        }
        // if (this._barriersFeatureSet.point) {
        //   this._dijitDirections.routeParams.barriers = this._barriersFeatureSet.point;
        // }
        // if (this._barriersFeatureSet.polyline) {
        //   this._dijitDirections.routeParams.polylineBarriers = this._barriersFeatureSet.polyline;
        // }
        // if (this._barriersFeatureSet.polygon) {
        //   this._dijitDirections.routeParams.polygonBarriers = this._barriersFeatureSet.polygon;
        // }
        // if (!!this._dijitDirections) {
        //   this._dijitDirections._getDirections();
        // }
        if(this._barriersFeatureSet.point){
          this._dijitDirections.setBarriers(this._barriersFeatureSet.point);
        }
        if(this._barriersFeatureSet.polyline){
          this._dijitDirections.setPolylineBarriers(this._barriersFeatureSet.polyline);
        }
        if(this._barriersFeatureSet.polygon){
          this._dijitDirections.setPolygonBarriers(this._barriersFeatureSet.polygon);
        }
      },
      _clearBarriersFeatureSet: function(){
        if (!this._dijitDirections) {
          return;
        }

        if (this._dijitDirections._clearBarriersGraphics) {
          this._dijitDirections._clearBarriersGraphics();
        } else {
          //this way will re-route 4 times
          if (this._barriersFeatureSet.point) {
            this._dijitDirections.setBarriers([]);
          }
          if (this._barriersFeatureSet.polyline) {
            this._dijitDirections.setPolylineBarriers([]);
          }
          if (this._barriersFeatureSet.polygon) {
            this._dijitDirections.setPolygonBarriers([]);
          }
          this._dijitDirections.reset();
        }
      },/*
      _bindBarrierLayerEditEvent: function(layers){
        var layerId = layers[0];
        var layerInfo = this.layerInfosObj.getLayerInfoById(layerId);

        if(layerInfo){
          this.own(on(layerInfo.layerObject, "edits-complete", lang.hitch(this, function(){
            if(true === this._updateBarriersFlag){
              var editWidget = this.widgetManager.getWidgetsByName('Edit')[0];
              if (editWidget && editWidget.onDeActive) {
                editWidget.onDeActive();
              }

              this._queryAndUpdateBarriersFeatureSet();
            }
          })));
        }
      }*/

      /*************************************************/
      _upgradeToSearchOptions: function (geocodeMeta, locatorUrl) {
        if (this._IS_CONFIG_BEFORE_63) {
          var placeholder = this.config.geocoderOptions.geocoders[0].placeholder;
          if(!placeholder){
            if(!this.config.routeTaskUrl){
              //user doesn't open the setting page, we use the default placeholder
              placeholder = this.nls.searchPlaceholder;
            }
          }
          //upgrade old-config.geocoderOptions to new-config.searchOptions
          this.config.searchOptions = {
            enableSuggestions: this.config.geocoderOptions.autoComplete,
            maxSuggestions: this.config.geocoderOptions.maxLocations,
            minCharacters: this.config.geocoderOptions.minCharacters,
            suggestionDelay: this.config.geocoderOptions.searchDelay,
            sources: [{
              locator: null,
              name: '',
              singleLineFieldName: '',
              outFields: ["*"],
              placeholder: placeholder //,
              //searchTemplate: "${Match_addr}"
            }]
          };
          //set sources[0].searchTemplate = "${Match_addr}", if NOT a arcgis.com-Geocoder-url
          if (this.config.geocoderOptions && this.config.geocoderOptions.geocoders &&
            this.config.geocoderOptions.geocoders[0] && this.config.geocoderOptions.geocoders[0].url) { //e.g. arcgis.com/arcgis/rest/services/World/GeocodeServer
            if (-1 === this.config.geocoderOptions.geocoders[0].url.indexOf("arcgis.com")) {
              this.config.searchOptions.sources[0].searchTemplate = "${Match_addr}";
            }
          }
          this.config.searchOptions.sources[0].locator = new Locator(locatorUrl);
          this.config.searchOptions.sources[0].name = geocodeMeta.serviceDescription || '';
          this.config.searchOptions.sources[0].singleLineFieldName =
           geocodeMeta.singleLineAddressField && geocodeMeta.singleLineAddressField.name || '';
        }
      },
      _getLayerInfos: function () {
        var def = new Deferred();
        LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function (layerInfosObj) {
            this.layerInfosObj = layerInfosObj;
            this.own(this.layerInfosObj.on(
              'layerInfosFilterChanged',
              lang.hitch(this, function(res){
                searchUtils.config.onLayerInfosFilterChanged(res, this.config);
              }
            )));

            def.resolve();
          }));

        return def;
      },
      _convertConfig: function(config) {
        var sourceDefs = array.map(config.sources, lang.hitch(this, function(source) {
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

            this.own(on(searchLayer, 'load', lang.hitch(this, function(result) {
              var flayer = result.layer;

              // identify the data source
              var sourceLayer = this.map.getLayer(source.layerId);
              var sourceLayerInfo = this.layerInfosObj.getLayerInfoById(source.layerId);
              var showInfoWindowOnSelect;
              var enableInfoWindow;
              if(sourceLayer) {
                // pure feature service layer defined in the map
                showInfoWindowOnSelect = false;
                enableInfoWindow = false;
              } else if (sourceLayerInfo){
                // feature service layer defined in the map
                showInfoWindowOnSelect = false;
                enableInfoWindow = false;
              } else {
                // data source from the outside
                showInfoWindowOnSelect = esriLang.isDefined(this.config.showInfoWindowOnSelect) ?
                  !!this.config.showInfoWindowOnSelect : true;
                enableInfoWindow = true;
              }

              var fNames = null;
              if (source.searchFields && source.searchFields.length > 0) {
                fNames = source.searchFields;
              } else {
                fNames = [];
                array.forEach(flayer.fields, function(field) {
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
                if(layerInfo) {
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

            this.own(on(searchLayer, 'error', function() {
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

    clazz.extend(a11y);//for a11y
    return clazz;
  });