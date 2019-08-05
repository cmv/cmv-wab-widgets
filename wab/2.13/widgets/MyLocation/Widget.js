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
    "esri/dijit/LocateButton",
    'dojo/_base/html',
    'dojo/on',
    'dojo/_base/lang',
    'jimu/utils',
    "./Compass",
    "./a11y/Widget",
    'jimu/dijit/Message',
    'dojo/touch'
  ],
  function(declare, BaseWidget, LocateButton, html, on, lang, jimuUtils, Compass, a11y) {
    var clazz = declare([BaseWidget], {

      name: 'MyLocation',
      baseClass: 'jimu-widget-mylocation',

      moveTopOnActive: false,

      startup: function() {
        this.inherited(arguments);
        this.a11y_updateLabel(this.nls._widgetLabel);
        this.placehoder = html.create('div', {
          'class': 'place-holder',
          title: this.label
        }, this.domNode);

        this.isNeedHttpsButNot = jimuUtils.isNeedHttpsButNot();

        if (true === this.isNeedHttpsButNot) {
          console.log('LocateButton::navigator.geolocation requires a secure origin.');
          html.addClass(this.placehoder, "nohttps");
          html.setAttr(this.placehoder, 'title', this.nls.httpNotSupportError);
        } else if (window.navigator.geolocation) {
          this.own(on(this.placehoder, 'click', lang.hitch(this, this.onLocationClick)));
          this.own(on(this.map, 'zoom-end', lang.hitch(this, this._scaleChangeHandler)));

          this.a11y_initEvents();
        } else {
          html.setAttr(this.placehoder, 'title', this.nls.browserError);
        }
      },

      onLocationClick: function(evt) {
        if(evt && evt.stopPropagation){
          evt.stopPropagation();
        }

        if (html.hasClass(this.domNode, "onCenter") ||
          html.hasClass(this.domNode, "locating")) {
          html.removeClass(this.domNode, "onCenter");
          html.removeClass(this.placehoder, "tracking");
          this._destroyGeoLocate();
          // this._destroyDirectionHandler();
          // this._destroyAccCircle();
          this._tryToCleanCompass();
        } else {
          this._createGeoLocate();
          this.geoLocate.locate();
          html.addClass(this.placehoder, "locating");
        }
      },

      //use current scale in Tracking
      _scaleChangeHandler: function() {
        var scale = this.map.getScale();
        if (scale && this.geoLocate && this.geoLocate.useTracking) {
          this.geoLocate.scale = scale;
        }
      },

      //there is no "locate-error" event in 2d-api
      onLocateOrError: function (evt) {
        if (evt.error) {
          this.onLocateError(evt);
        } else {
          this.onLocate(evt);
        }
      },

      onLocate: function (parameters) {
        html.removeClass(this.placehoder, "locating");
        if (this.geoLocate.useTracking) {
          html.addClass(this.placehoder, "tracking");
        }

        if (parameters.error) {
          this.onLocateError(parameters);
        } else {
          html.addClass(this.domNode, "onCenter");
          this.neverLocate = false;

          this._tryToShowCompass(parameters);
        }
      },

      //compass
      _tryToShowCompass: function (parameters) {
        if (true !== this.config.locateButton.highlightLocation ||
          true !== this.config.locateButton.useTracking) {
          return;//1 or all false
        }
        if (true !== this.config.useCompass && true !== this.config.useAccCircle) {
          return;//all false
        }

        this.compass = Compass.getInstance({ folderUrl: this.folderUrl, map: this.map, config: this.config });
        this.compass.show(parameters, this.geoLocate);
      },
      _tryToCleanCompass: function () {
        if (this.compass && this.compass.clean) {
          this.compass.clean();
        }
      },
      _tryToDestroyCompass: function () {
        if (this.compass && this.compass.destroy) {
          this.compass.destroy();
        }
      },

      onLocateError: function(evt) {
        console.error(evt.error);
        this._tryToCleanCompass();
        html.removeClass(this.placehoder, "locating");
        html.removeClass(this.domNode, "onCenter");
        html.removeClass(this.placehoder, "tracking");
      },

      _createGeoLocate: function() {
        var json = this.config.locateButton;
        json.map = this.map;
        if (typeof(this.config.locateButton.useTracking) === "undefined") {
          json.useTracking = true;
        }
        json.centerAt = true;
        json.setScale = true;

        var geoOptions = {
          maximumAge: 0,
          timeout: 15000,
          enableHighAccuracy: true
        };
        if (json.geolocationOptions) {
          json.geolocationOptions = lang.mixin(geoOptions, json.geolocationOptions);
        }

        //hack for issue,#11199
        if (jimuUtils.has('ie') === 11) {
          json.geolocationOptions.maximumAge = 300;
          json.geolocationOptions.enableHighAccuracy = false;
        }

        this.geoLocate = new LocateButton(json);
        this.geoLocate.startup();
        //only 3d-api have error event
        this.geoLocate.own(on(this.geoLocate, "locate", lang.hitch(this, this.onLocateOrError)));
      },

      _destroyGeoLocate: function() {
        if (this.geoLocate) {
          this.geoLocate.clear();
          this.geoLocate.destroy();
        }

        this.geoLocate = null;
      },
      destroy: function () {
        this._tryToCleanCompass();
        this._tryToDestroyCompass();
        // this._destroyDirectionHandler();
        //this._destroyAccCircle();
        this._destroyGeoLocate();
        this.inherited(arguments);
      }
    });
    clazz.inPanel = false;
    clazz.hasUIFile = false;

    clazz.extend(a11y);//for a11y
    return clazz;
  });