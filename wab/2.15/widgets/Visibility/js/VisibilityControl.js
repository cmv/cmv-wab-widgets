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

/*global define*/
/*globals $:false */
/*jshint bitwise: false*/
define([
  'dojo/_base/declare',
  'dojo/_base/kernel',
  'dojo/_base/event',
  'dojo/Deferred',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/on',
  'dojo/number',
  'dojo/string',
  'dojo/dom-style',
  'dojo/mouse',
  'dojo/promise/all',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!../templates/VisibilityControl.html',
  'jimu/dijit/Message',
  'esri/dijit/util/busyIndicator',
  'esri/graphic',
  'esri/layers/GraphicsLayer',
  'esri/tasks/FeatureSet',
  'esri/graphicsUtils',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/renderers/SimpleRenderer',
  'esri/Color',
  'esri/dijit/analysis/CreateViewshed',
  'esri/layers/FeatureLayer',
  'esri/geometry/Polygon',
  'esri/geometry/geometryEngine',
  './geometryUtils',
  'jimu/dijit/CoordinateControl',
  './util',
  'jimu/utils',
  'dojo/keys',
  'dijit/focus',
  './portal-publish',
  'dojo/dom-class',
  "dojo/dom-construct",
  'esri/renderers/UniqueValueRenderer',
  'jimu/LayerStructure',
  'dijit/form/NumberTextBox',
  'jimu/dijit/CheckBox',
  './jquery.knob.min'
], function (
  dojoDeclare,
  dojoKernel,
  dojoEvent,
  DojoDeferred,
  dojoLang,
  dojoArray,
  dojoOn,
  dojoNumber,
  dojoString,
  dojoDomStyle,
  dojoMouse,
  dojoAll,
  dijitWidgetBase,
  dijitTemplatedMixin,
  dijitWidgetsInTemplate,
  vistemplate,
  Message,
  BusyIndicator,
  Graphic,
  GraphicsLayer,
  FeatureSet,
  graphicsUtils,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleMarkerSymbol,
  SimpleRenderer,
  Color,
  CreateViewshed,
  FeatureLayer,
  Polygon,
  geometryEngine,
  geometryUtils,
  CoordinateControl,
  CoordinateUtils,
  utils,
  keys,
  focusUtils,
  PortalPublish,
  domClass,
  domConstruct,
  UniqueValueRenderer,
  LayerStructure
) {
'use strict';
return dojoDeclare([dijitWidgetBase, dijitTemplatedMixin, dijitWidgetsInTemplate], {
    templateString: vistemplate,
    baseClass: 'jimu-widget-visibility-control',
    FOV: 180,
    LA: 180,
    map: null,
    _currentOpenPanel: "mainPage", //Flag to hold last open panel, default will be main page,
    portalPublishObj: null,
    _renderer: null, // renderer to be used on the new Feature Service
    Azimuth1: null,
    Azimuth2: null,
    graphics: null,
    _layerList: null,

    constructor: function (args) {
      dojoDeclare.safeMixin(this, args);
      this.nls = args.nls;
    },

    postCreate: function () {
      //Add options for distance dropdowns
      var options = [],
        option, dropDownOptions;
      dropDownOptions = ['meters', 'kilometers', 'miles',
        'feet', 'yards', 'nauticalMiles'
      ];
      dojoArray.forEach(dropDownOptions, dojoLang.hitch(this, function (type) {
        option = {
          value: type,
          label: window.jimuNls.units[type]
        };
        options.push(option);
      }));
      this.observerHeightDD.addOption(options);

      this.utils = new CoordinateUtils({
        appConfig: this.appConfig,
        nls: this.nls
      });

      /**
       * Be sure to clone the options object so that each dijit has its own copy.
       * Otherwise, unexpected things happen with the selected value.
       * See https://github.com/Esri/visibility-addin-dotnet/issues/226 for details.
       */
      this.distanceUnitDD.addOption(dojoLang.clone(options));
      //set values in units as per configuration
      this.observerHeightDD.set('value', this.config.defaultObserverHeightUnit);
      this.distanceUnitDD.set('value', this.config.defaultObservableDistanceUnit);
      this.angleUnits.setValue(this.config.defaultAngleUnits);
      if (this.portalUrl) {
        //set all the symbols required to represent differnet graphics
        this._setUpSymbology();
        this._createRenderer();

        //Retrieve all layers from webmap
        this._layerList = this._getAllMapLayers();

        // Create graphics layer
        var glrenderer = new SimpleRenderer(this._ptSym);
        //create graphics layer for spill location and add to map
        this._observerLocation = new GraphicsLayer({
          id: "observerLocation"
        });
        this._observerLocation.spatialReference = this.map.spatialReference;
        this._observerLocation.setRenderer(glrenderer);
        this.map.addLayer(this._observerLocation);

        //set up observer input dijit
        this.distanceUnit = this.distanceUnitDD.get('value');
        this.observerHeightUnit = this.observerHeightDD.get('value');

        //set up coordinate input dijit for observer Location
        this.inputControl = new CoordinateControl({
          parentWidget: this.parentWidget,
          label: this.nls.observerLocation,
          input: true,
          showCopyButton: false,
          showFormatButton: true,
          showDrawPoint: true,
          drawButtonLabel: this.nls.addPointToolTip,
          graphicsLayer: this._observerLocation
        });
        this.inputControl.placeAt(this.observerCoordsContainer);
        this.inputControl.startup();

        //initiate and add viewshed graphics layer
        this._initGL();

        //initiate synchronisation events
        this._syncEvents();

        //Set nls messages for invalid and range messages
        this.minObsRange.invalidMessage = this.nls.invalidMessage;
        this.minObsRange.rangeMessage = this.nls.minimumRangeMessage;
        this.maxObsRange.invalidMessage = this.nls.invalidMessage;
        this.maxObsRange.rangeMessage = this.nls.maximumRangeMessage;

      } else {
        this._showPortalURLError(this.nls.portalURLError);
      }
      this.resetInputColor();
      this._suppoprtAccessibility();
    },

    startup: function () {
      this.busyIndicator = BusyIndicator.create({
        target: this.domNode.parentNode.parentNode.parentNode,
        backgroundOpacity: 0
      });

      //set unique id by appending current widget id to the input node
      //this will restrict access of the input node to current widgets input only
      //when using multiple instance of the visibility widget
      this.FOVInput.id = "fovinput" + this.parentWidget.id;

      var updateValues = dojoLang.hitch(this, function (a, b, c) {
        this.LA = this.angleUnits.checked ? a / 17.777777777778 : a;
        this.FOV = Math.round(b);
        if ((c === 360) && (this.angleUnits.checked)) {
          this.tooltip.innerHTML = $("#" + this.FOVInput.id).val() + " " + this.nls.milsLabel;
        } else {
          this.tooltip.innerHTML =
            this.angleUnits.checked ? c + " " + this.nls.milsLabel : c + " " + this.nls.degreesLabel;
        }
      });
      $("#" + this.FOVInput.id).knob({
        'min': 0,
        'max': 360,
        'cursor': 360,
        'width': 160,
        'height': 160,
        'draw': function () {
          updateValues(this.v, this.o.cursor, this.cv);
          if (window.isRTL) {
            //Source: https://github.com/aterrien/jQuery-Knob/issues/314#issuecomment-300143679
            //style rtl
            this.i.css({
              'margin-right': '-' + ((this.w * 3 / 4 + 2) >> 0) + 'px',
              'margin-left': 'auto'
            });
          }
        }
      });
    },

    destroy: function () {
      this.map.removeLayer(this._observerLocation);
      this.map.removeLayer(this.graphicsLayer);
    },

    /*
     * Show error in widget control and hide other controls
     */
    _showPortalURLError: function (message) {
      dojoDomStyle.set(this.controls, 'display', 'none');
      dojoDomStyle.set(this.buttonContainer, 'display', 'none');
      this.errorText.innerHTML = message;
      dojoDomStyle.set(this.errorText, 'display', '');
    },

    /**
     * Creates symbols to represent different graphics(input/output) on map
     */
    _setUpSymbology: function () {
      //set up symbology for input
      this._ptSym = new SimpleMarkerSymbol(this.pointSymbol);
      //set up symbology for output
      this.visibleArea = new SimpleFillSymbol();
      this.visibleArea.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0]), 1));
      this.visibleArea.setColor(new Color([0, 255, 0, 0.5]));
      this.notVisibleArea = new SimpleFillSymbol();
      this.notVisibleArea.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0]), 1));
      this.notVisibleArea.setColor(new Color([255, 0, 0, 0.5]));
      this.fullWedge = new SimpleFillSymbol();
      this.fullWedge.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([0, 0, 0, 1]), 1));
      this.fullWedge.setColor(new Color([0, 0, 0, 0]));
      this.wedge = new SimpleFillSymbol();
      this.wedge.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 1]), 1));
      this.wedge.setColor(new Color([0, 0, 0, 0]));
    },


    /*
     * initiate and add viewshed graphics layer to map
     */
    _initGL: function () {
      this.graphicsLayer = new GraphicsLayer();
      this.graphicsLayer.name = "Viewshed Layer";
      this.map.addLayer(this.graphicsLayer);
    },

    /*
     * initiate synchronisation events
     */
    _syncEvents: function () {
      this.own(
        dojoOn(this.btnCreate, 'click', dojoLang.hitch(this, this.createButtonWasClicked)),

        //code for accessibility
        dojoOn(this.btnCreate, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this.createButtonWasClicked();
          }
        })),

        dojoOn(this.btnClear, "click", dojoLang.hitch(this, function () {
          domClass.add(this.saveToLayerIcon, "esriCTHidden");
          this.onClearBtnClicked();
          this._suppoprtAccessibility();
        })),

        //code for accessibility
        dojoOn(this.btnClear, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            domClass.add(this.saveToLayerIcon, "esriCTHidden");
            this.onClearBtnClicked();
            this._suppoprtAccessibility();
          }
        })),

        dojoOn(this.minObsRange, 'keyup', dojoLang.hitch(this, this.minObsRangeKeyWasPressed)),

        dojoOn(this.FOVInput, 'mousemove', dojoLang.hitch(this, this.mouseMoveOverFOVInput)),

        dojoOn(this.FOVInput, dojoMouse.leave, dojoLang.hitch(
          this, this.mouseMoveOutFOVInput)),

        dojoOn(this.FOVGroup, dojoMouse.leave, dojoLang.hitch(
          this,
          function () {
            this.tooltip.hidden = true;
          })),

        dojoOn(this.FOVGroup, dojoMouse.enter, dojoLang.hitch(
          this, this.mouseMoveOverFOVGroup)),

        dojoOn(this.FOVInput, dojoMouse.enter, dojoLang.hitch(this, function () {
          this.tooltip.hidden = true;
        })),

        dojoOn(this.FOVInput, "keypress", dojoLang.hitch(this, function (evt) {
          if (isNaN(evt.key) && evt.charCode !== 13) {
            dojoEvent.stop(evt);
          }
        })),

        this.angleUnits.on('change', dojoLang.hitch(this, this.angleUnitsDidChange)),

        this.observerHeightDD.on('change', dojoLang.hitch(this, this.distanceUnitDDDidChange)),

        this.distanceUnitDD.on('change', dojoLang.hitch(this, this.distanceUnitDDDidChange)),

        dojoOn(this.inputControl.dt, 'DrawComplete', dojoLang.hitch(this, function () {
          this.feedbackDidComplete();
          focusUtils.focus(this.inputControl.coordtext);
        })),

        dojoOn(this.inputControl, 'get-coordinate-complete', dojoLang.hitch(
          this, this.feedbackDidComplete)));


      dojoOn(this.saveToLayerIcon, "click", dojoLang.hitch(this, function () {
        if (!domClass.contains(this.saveToLayerIcon, "esriCTHidden")) {
          this._showPanel("publishPage");
        }
      }));

      dojoOn(this.saveToLayerIcon, "keydown", dojoLang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          if (!domClass.contains(this.saveToLayerIcon, "esriCTHidden")) {
            this._showPanel("publishPage");
          }
        }
      }));
    },

    /*
     * catch key press in min obs range, if valid, set max obs range min value accordingly
     */
    minObsRangeKeyWasPressed: function () {
      if (this.minObsRange.isValid()) {
        this.maxObsRange.constraints.min = Number(this.minObsRange.displayedValue) + 0.001;
        this.maxObsRange.set('value', Number(this.minObsRange.displayedValue) + 1);
      }
    },

    /*
     *
     */
    mouseMoveOverFOVGroup: function () {
      if (this.FOVInput.disabled === false) {
        //sometime initially the tooltip stays at the bottom only to fix this
        //on mouse over also call this function so that it will calculate the x, y for tooltip
        //and then make the tooltip visible
        this.mouseMoveOverFOVInput();
        this.tooltip.hidden = false;
      }
    },

    /*
     *
     */
    mouseMoveOverFOVInput: function () {
      var _currentTooltip = this.tooltip;
      if (this.FOVInput.disabled === false) {
        $(document).ready(function () {
          $(document).mousemove(function (e) {
            dojoDomStyle.set(_currentTooltip, {
              left: (e.pageX + 10) + "px",
              top: (e.pageY + 10) + "px"
            });
          });
        });
      }
    },

    /*
     *
     */
    mouseMoveOutFOVInput: function () {
      this.tooltip.hidden = false;
      this.FOVInput.blur();
    },

    /*
     *
     */
    angleUnitsDidChange: function () {
      if (this.angleUnits.checked) {
        $("#" + this.FOVInput.id).trigger('configure', {
          "max": 6400,
          "units": 'mils',
          "milsValue": 6400
        });
        $("#" + this.FOVInput.id).val(6400).trigger('change');
      } else {
        $("#" + this.FOVInput.id).trigger('configure', {
          "max": 360,
          "units": 'degrees',
          "milsValue": 6400
        });
        $("#" + this.FOVInput.id).val(360).trigger('change');
      }
      this.resetInputColor();
    },

    /*
     *
     */
    distanceUnitDDDidChange: function () {
      var msg = "",
        constraints = {};
      this.distanceUnit = this.distanceUnitDD.get('value');
      this.observerHeightUnit = this.observerHeightDD.get('value');
      if (this.distanceUnit) {
        switch (this.distanceUnit) {
          case "miles":
            constraints.max = 31;
            break;
          case "nauticalMiles":
            constraints.max = 26.9383;
            break;
          case "kilometers":
            constraints.max = 50;
            break;
          case "yards":
            constraints.max = 54680;
            break;
          case "feet":
            constraints.max = 164041;
            break;
          case "meters":
            constraints.max = 50000;
            break;
        }
        //construct invalid message based on selected unit and max value
        msg = dojoString.substitute(this.nls.maximumRangeMessage, {
          units: window.jimuNls.units[this.distanceUnit],
          limit: dojoNumber.format(constraints.max, {
            places: 2,
            locale: dojoKernel.locale
          })
        });
        constraints.min = Number(this.minObsRange.displayedValue) + 0.001;
        //set the constraints and range message to the control
        this.maxObsRange.set("constraints", constraints);
        this.maxObsRange.set("rangeMessage", msg);
      }
    },

    /*
     *
     */
    feedbackDidComplete: function () {
      this.inputControl.deactivateDrawTool();
      this.map.enableMapNavigation();
      this.enableFOVDial();
    },

    /*
     *
     */
    enableFOVDial: function () {
      if (this.FOVInput.disabled) {
        this.FOVInput.disabled = false;
        $("#" + this.FOVInput.id).trigger('configure', {
          "fgColor": "#00ff66",
          "bgColor": "#f37371",
          "inputColor": "#ccc"
        });
      }
      this.resetInputColor();
    },

    /**
     * When observers field of view is 360 then using buffers wedges can be created.
     * Based on minimum distance wedge wil have donut polygon or complete circle.
     */
    _createWedgesUsingBuffers: function (def, features, minimumDistance, maximumDistance) {
      var innnerBufferedGeometries, bufferedGeometries;
      var geometries = graphicsUtils.getGeometries(features);
      //Create outer buffer using maximum distance
      bufferedGeometries =
        geometryEngine.geodesicBuffer(geometries, [maximumDistance], "meters", true);
      //If minmum distance is valid then only create inner buffer using minimum distance
      if (minimumDistance > 0) {
        //Create outer buffer using maximum distance
        innnerBufferedGeometries = geometryEngine.geodesicBuffer(geometries, [minimumDistance], "meters", true);
        //As minimum distance exists take the difference of outer & inner buffer as final buffer
        bufferedGeometries = geometryEngine.difference(bufferedGeometries[0], innnerBufferedGeometries[0]);
      } else {
        bufferedGeometries = bufferedGeometries[0];
      }
      def.resolve([bufferedGeometries, bufferedGeometries]);
    },

    /**
     * Creates wedges based on the selected field of views angle.
     * This uses the geometryUtils functions which help in getting destination Point, arcs etc.
     */
    _createWedgesUsingAngles: function (def, pointFeature, Azimuth1, Azimuth2, radius1, radius2) {
      var pointGeom, outerArcPointsArray, wedgePointsArray, fullWedgePointsArray,
        innerPoint1, innerArcPointsArray, wedgeGeometry, fullWedgeGeometry;
      //get point geometry
      pointGeom = pointFeature.geometry;

      wedgePointsArray = [];
      fullWedgePointsArray = [];

      // set the start angle always less than the end angle
      this.Azimuth1 = Azimuth1 > Azimuth2 ? Azimuth1 - 360 : Azimuth1;

      //logic to show outer arc
      outerArcPointsArray = geometryUtils.getPointsForArc(Azimuth1, Azimuth2, pointGeom, radius2);

      //create full wedge, this will be same in case of inner radius and without inner radius
      fullWedgePointsArray.push([pointGeom.x, pointGeom.y]);
      dojoArray.forEach(outerArcPointsArray, function (arcPoint) {
        fullWedgePointsArray.push([arcPoint.x, arcPoint.y]);
      });
      fullWedgePointsArray.push([pointGeom.x, pointGeom.y]);

      //Create wedge in case of inner radius and non inner radius
      if (radius1 > 0) {
        //Using pointGeometry, startAngle and minimum distance(radius1)
        //get the start point of inner arc
        innerPoint1 = geometryUtils.getDestinationPoint(pointGeom, Azimuth1, radius1);

        //Logic to show inner arc
        innerArcPointsArray =
          geometryUtils.getPointsForArc(Azimuth1, Azimuth2, pointGeom, radius1);

        //Create wedge points array in case of inner radius
        //First - push the innerArcs first point
        wedgePointsArray.push([innerPoint1.x, innerPoint1.y]);
        //Second - push all the points in outer arc
        dojoArray.forEach(outerArcPointsArray, function (arcPoint) {
          wedgePointsArray.push([arcPoint.x, arcPoint.y]);
        });
        //now reverse the inner arcs point array
        innerArcPointsArray.reverse();
        //Third - Push all the points in inner arc which are reversed
        dojoArray.forEach(innerArcPointsArray, function (arcPoint) {
          wedgePointsArray.push([arcPoint.x, arcPoint.y]);
        });
        //Fourth - Finaly add the innerArcs first point to complete the ring
        wedgePointsArray.push([innerPoint1.x, innerPoint1.y]);
      } else {
        wedgePointsArray = fullWedgePointsArray;
      }
      //Create wedge geometries using points arary and set the spatial reference
      wedgeGeometry = new Polygon(wedgePointsArray);
      wedgeGeometry.setSpatialReference(pointGeom.spatialReference);

      fullWedgeGeometry = new Polygon(fullWedgePointsArray);
      fullWedgeGeometry.setSpatialReference(pointGeom.spatialReference);
      def.resolve([wedgeGeometry, fullWedgeGeometry]);
    },

    /**
     * Create Wedges based on users input and observer filed view angles
     */
    _createWedges: function (pointFeatures, radius1, radius2) {
      var def = new DojoDeferred();
      //Calculate StartAngle(Azimuth1) & EndAngle(Azimuth2)
      this.Azimuth1 = parseInt(this.LA - (this.FOV / 2), 10);
      if (this.Azimuth1 < 0) {
        this.Azimuth1 = this.Azimuth1 + 360;
      }
      this.Azimuth2 = parseInt(this.LA + (this.FOV / 2), 10);
      if (this.Azimuth2 > 360) {
        this.Azimuth2 = this.Azimuth2 - 360;
      }
      //If observers field of view is 360 then use buffers as wedges
      //else calculate wedges based on the selected field of views angle
      if (this.FOV === 360) {
        this.Azimuth1 = 0;
        this.Azimuth2 = 360;
        this._createWedgesUsingBuffers(def, pointFeatures, radius1, radius2);
      } else {
        this._createWedgesUsingAngles(def,
          pointFeatures[0], this.Azimuth1, this.Azimuth2, radius1, radius2);
      }
      return def.promise;
    },

    /**
     * CreateViewShed class need featureLayer as input,
     * so create featureLayer using featureCollection.
     */
    _getFeatureCollectionLayer: function (features) {
      var featureCollection;
      //Add object ids in all features
      dojoArray.forEach(features, dojoLang.hitch(this, function (feature, index) {
        feature.attributes = {};
        feature.attributes.ObjectID = index;
      }));
      //set feature collection properties
      featureCollection = {
        "layerDefinition": null,
        "featureSet": {
          "features": features,
          "geometryType": "esriGeometryPoint"
        }
      };
      //Set feature collection layerDefinition
      featureCollection.layerDefinition = {
        "name": "InputLayer",
        "geometryType": "esriGeometryPoint",
        "objectIdField": "ObjectID",
        "fields": [{
          "name": "ObjectID",
          "alias": "ObjectID",
          "type": "esriFieldTypeOID"
        }]
      };
      //create a feature layer using the feature collection object
      return new FeatureLayer(featureCollection);
    },

    /**
     * Initiates the analysis process by computing the wedges at client side
     * and then projecting them in map spatial ref.
     */
    _initAnalysisProcess: function (params) {
      this._createWedges(params.InputObserver.features, params.MinimumRadius,
        params.MaximumRadius).then(dojoLang.hitch(this, function (wedges) {
        var fullWedgeProjectionDef, wedgeProjectionDef, defList = [],
          geomService;
        if (wedges && wedges.length === 2) {
          //get the geometry service instance
          geomService = this.appConfig.geometryService;
          //Project the wedges into map spatial ref,
          //since the viewshed will be returned in mapSpatialRef
          wedgeProjectionDef = geometryUtils.getProjectedGeometry(
            wedges[0], this.map.spatialReference, geomService).then(
            dojoLang.hitch(this, function (projectedWedge) {
              this._wedgeGeometry = projectedWedge;

            })
          );
          defList.push(wedgeProjectionDef);
          fullWedgeProjectionDef = geometryUtils.getProjectedGeometry(
            wedges[1], this.map.spatialReference, geomService).then(
            dojoLang.hitch(this, function (projectedFullWedge) {
              this._fullWedgeGeometry = projectedFullWedge;
            })
          );
          defList.push(fullWedgeProjectionDef);
          //once both the wedges are projected create viewshed and process it for dispalying
          dojoAll(defList).then(dojoLang.hitch(this, function () {
            this._createViewShed(params);
          }));
        }
      }));
    },

    /**
     * Creates the instance of CreateViewshed and set the params and initiaes viewShed analysis
     */
    _createViewShed: function (params) {
      var analysisTool, analysisParams;
      //construct the parms required for creating view shed
      analysisParams = {
        portalUrl: this.portalUrl,
        inputLayer: this._getFeatureCollectionLayer(params.InputObserver.features),
        maxDistanceUnits: "Meters",
        maximumDistance: params.MaximumRadius,
        observerHeightUnits: "Meters",
        observerHeight: params.ObserverHeight,
        showSelectAnalysisLayer: false,
        targetHeightUnits: "Meters",
        map: this.map,
        showChooseExtent: false,
        returnFeatureCollection: true
      };
      //create instance of CreateViewshed class
      analysisTool = new CreateViewshed(analysisParams);
      analysisTool.startup();
      //once the job result is recevied process the returned viewShed for displaying
      analysisTool.on("job-result", dojoLang.hitch(this, this._onViewShedCreated));
      //as job failed in between is not getting captured in 'job-fail' event
      //added this callback to overcome the issue
      analysisTool.on("job-status", dojoLang.hitch(this, function (result) {
        if (result.jobStatus === "esriJobFailed") {
          this._showJobError(result);
        }
      }));
      analysisTool.on("job-fail", dojoLang.hitch(this, this._showJobError));

      //once params are set validate the form and then initiate the analysis to create viewshed
      if (analysisTool._form.validate()) {
        this.busyIndicator.show();
        analysisTool._handleSaveBtnClick();
      } else {
        new Message({
          message: this.nls.validationError
        });
      }
    },

    /*
     * Show error in message and hide loading indicators
     */
    _showJobError: function (error) {
      new Message({
        message: error.message
      });
      this.busyIndicator.hide();
    },

    /**
     * Once result of create view shed is received,
     * Process the viewshed so that instead of showing the complete viewshed of maximum buffer,
     * user can see the viewshed of only desired area.
     */
    _onViewShedCreated: function (result) {
      var viewShedFeatures = [];
      dojoArray.forEach(result.value.featureSet.features, dojoLang.hitch(this, function (graphics) {
        var poly, viewshed, feature;
        poly = new Polygon(graphics.geometry);
        poly.setSpatialReference(this.map.spatialReference);

        viewshed = geometryEngine.difference(this._wedgeGeometry, poly);
        //if difference is available then only take difference onmore time so that we get the viewshed
        if (viewshed) {
          viewshed = geometryEngine.difference(this._wedgeGeometry, viewshed);
        }

        feature = new Graphic(viewshed, this.visibleArea);

        viewShedFeatures.push(feature);
      }));
      this._showGraphicsOnMap(viewShedFeatures);
    },

    /*
     * Draw wedge graphics
     */
    _drawWedge: function (graphics, symbol) {
      var deferred = new DojoDeferred();
      for (var w = 0, wl = graphics.length; w < wl; w++) {
        var feature = graphics[w];
        if (feature && feature.geometry) {
          feature.setSymbol(symbol);
          this.graphicsLayer.add(feature);
        }
      }
      deferred.resolve("success");
      return deferred.promise;
    },

    /*
     * Draws visible and notVisible viewsShed Area
     */
    _drawViewshed: function (graphics) {
      var visibleAreaGeometry, nonVisibleAreaGeometry, visibleAreaGraphics, nonVisibleAreaGraphics;
      var deferred = new DojoDeferred();
      this.graphics = [];
      /*
       * The Analysis service will only return visible view shed
       * So, add the wedge geometry with notVisibleArea symbol
       * and on top of it add the result of service which is visible viewshed
       * */
      //Shows not visble area on map
      nonVisibleAreaGraphics = new Graphic(this._wedgeGeometry, this.notVisibleArea);
      nonVisibleAreaGraphics.setAttributes({
        "type": 0
      });
      this.graphicsLayer.add(nonVisibleAreaGraphics);
      //Shows visible are on map
      for (var w = 0, wl = graphics.length; w < wl; w++) {
        var feature = graphics[w];
        if (feature && feature.geometry) {
          visibleAreaGeometry = feature.geometry;
          feature.setSymbol(this.visibleArea);
          feature.setAttributes({
            "type": 1
          });
          visibleAreaGraphics = feature;
          this.graphicsLayer.add(feature);
        }
      }
      if (visibleAreaGeometry) {
        this.graphics.push(visibleAreaGraphics);
        nonVisibleAreaGeometry = geometryEngine.difference(this._wedgeGeometry, visibleAreaGeometry);
        nonVisibleAreaGraphics = new Graphic(nonVisibleAreaGeometry, this.notVisibleArea);
        nonVisibleAreaGraphics.setAttributes({
          "type": 0
        });
        this.graphics.push(nonVisibleAreaGraphics);
      } else {
        this.graphics.push(nonVisibleAreaGraphics);
      }
      deferred.resolve("success");
      return deferred.promise;
    },

    /**
     * Draws all graphics (wedge, fullWedge, viewShed)
     */
    _showGraphicsOnMap: function (viewShedFeatures) {
      this._drawWedge([new Graphic(this._fullWedgeGeometry)], this.fullWedge);
      this._drawWedge([new Graphic(this._wedgeGeometry)], this.wedge);
      this._drawViewshed(viewShedFeatures).then(dojoLang.hitch(this, function () {
        this.map.setExtent(graphicsUtils.graphicsExtent(this.graphicsLayer.graphics), true);
        domClass.remove(this.saveToLayerIcon, "esriCTHidden");
        this.busyIndicator.hide();
        this._createPortalPublishUI();
        this._suppoprtAccessibility();
      }));
    },

    /*
     * Button click event, Validate and get user inputs and initiates analysis
     */
    createButtonWasClicked: function () {
      if (this.minObsRange.isValid() &&
        this.maxObsRange.isValid() && this.observerHeight.isValid() &&
        parseInt(this.FOVInput.value, 10) !== 0) {
        var newObserver = new Graphic(this.inputControl.getMapCoordinateDD());
        var featureSet = new FeatureSet();
        featureSet.features = [newObserver];

        var params = {
          "InputObserver": featureSet,
          "MinimumRadius": this.utils.convertToMeters(
            this.minObsRange.value, this.distanceUnit),
          "MaximumRadius": this.utils.convertToMeters(
            this.maxObsRange.value, this.distanceUnit),
          "ObserverHeight": this.utils.convertToMeters(
            this.observerHeight.value, this.observerHeightUnit)
        };
        this._initAnalysisProcess(params);
      } else {
        new Message({
          message: this.nls.validationError
        });
      }
    },

    /*
     * Button click event, Clear all graphics and reset on clear button clicked
     */
    onClearBtnClicked: function () {
      //Check if we have a rendered template
      if (!this.angleUnits) {
        return;
      }
      //reset to configured values
      this.angleUnits.setValue(this.config.defaultAngleUnits);
      this.observerHeightDD.set("value", this.config.defaultObserverHeightUnit);
      this.distanceUnitDD.set("value", this.config.defaultObservableDistanceUnit);
      this.graphicsLayer.clear();
      this.inputControl.clear();
      //reset dialog
      this.FOVInput.disabled = true;
      this.angleUnitsDidChange();
      $("#" + this.FOVInput.id).trigger('configure', {
        "fgColor": "#ccc",
        "bgColor": "#ccc",
        "inputColor": "#ccc"
      });
      this.tooltip.hidden = true;
      this.resetInputColor();
    },

    resetInputColor: function () {
      setTimeout(dojoLang.hitch(this, function () {
        dojoDomStyle.set(this.FOVInput, "color", "gray");
      }), 100);
    },

    /**
     * This function is used to make widget accessible by setting first and last focus node
     */
    _suppoprtAccessibility: function () {
      if (this._currentOpenPanel === "mainPage") {
        if (domClass.contains(this.saveToLayerIcon, "esriCTHidden")) {
          utils.initFirstFocusNode(this.parentWidget.domNode, this.inputControl.coordtext);
          focusUtils.focus(this.inputControl.coordtext);
        } else {
          utils.initFirstFocusNode(this.parentWidget.domNode, this.saveToLayerIcon);
          focusUtils.focus(this.saveToLayerIcon);
        }
        utils.initLastFocusNode(this.parentWidget.domNode, this.btnClear);
      }

      if (this._currentOpenPanel === "publishPage") {
        this.portalPublishObj._setFirstLastFocusNodes();
      }
    },

    _createPortalPublishUI: function () {
      this.portalPublishObj = new PortalPublish({
        config: this.config,
        appConfig: this.appConfig,
        graphicsLayer: this.graphicsLayer,
        graphics: this.graphics,
        _renderer: this._renderer,
        map: this.map,
        nls: this.nls,
        parentNode: this.parentWidget.domNode,
        observerHeight: this.observerHeight.value,
        minObsRange: this.minObsRange.value,
        maxObsRange: this.maxObsRange.value,
        distanceUnitDD: this.distanceUnitDD.getOptions(this.distanceUnitDD.value).label,
        observerHeightDD: this.observerHeightDD.getOptions(this.observerHeightDD.value).label,
        angleUnits: this.nls.degreesLabel,
        centerPoint: this.inputControl.coordtext.value,
        fovStartAngle: this.Azimuth1,
        fovEndAngle: this.Azimuth2,
        _layerList: this._layerList
      });
      domConstruct.empty(this.portalPublishContainer);
      this.portalPublishObj.placeAt(this.portalPublishContainer);
      this.portalPublishObj.startup();
      this.own(dojoOn(this.portalPublishObj, "displayMainPageOnBack", dojoLang.hitch(this, function () {
        this._showPanel("mainPage");
      })));
      this._showPanel("publishPage");
    },


    /**
     * Displays selected panel
     **/
    _showPanel: function (currentPanel) {
      var prevNode, currentNode;
      //check if previous panel exist and hide it
      if (this._currentOpenPanel) {
        prevNode = this._getNodeByName(this._currentOpenPanel);
        domClass.add(prevNode, "esriCTHidden");
      }
      //get current panel to be displayed and show it
      currentNode = this._getNodeByName(currentPanel);
      domClass.remove(currentNode, "esriCTHidden");
      //set the current panel and previous panel
      this._lastOpenPanel = this._currentOpenPanel;
      this._currentOpenPanel = currentPanel;
      this._suppoprtAccessibility();
    },

    /**
     * Get panel node from panel name
     **/
    _getNodeByName: function (panelName) {
      var node;
      switch (panelName) {
        case "mainPage":
          node = this.visibiltyWidget;
          break;
        case "publishPage":
          node = this.portalPublishContainer;
          break;
      }
      return node;
    },

    _createRenderer: function () {
      var uvrJson = {
        "type": "uniqueValue",
        "field1": "RegionType",
        "uniqueValueInfos": [{
          "value": 1,
          "symbol": {
            "color": [0, 255, 0, 128],
            "outline": {
              "color": [0, 0, 0, 0],
              "width": 0.75,
              "type": "esriSLS",
              "style": "esriSFSSolid"
            },
            "type": "esriSFS",
            "style": "esriSFSSolid"
          }
        }, {
          "value": 0,
          "symbol": {
            "color": [255, 0, 0, 128],
            "outline": {
              "color": [0, 0, 0, 0],
              "width": 1,
              "type": "esriSLS",
              "style": "esriSFSSolid"
            },
            "type": "esriSFS",
            "style": "esriSFSSolid"
          }
        }]
      };
      this._renderer = new UniqueValueRenderer(uvrJson);
      this._renderer.removeValue("others");
    },

    /**
     * This gets all the operational layers and places it in a custom data object.
     */
    _getAllMapLayers: function () {
      var layerList = [];
      var layerStructure = LayerStructure.getInstance();
      //get all layers.
      layerStructure.traversal(function (layerNode) {
        //check to see if type exist and if it's not any tiles
        if (typeof (layerNode._layerInfo.layerObject.type) !== 'undefined') {
          if ((layerNode._layerInfo.layerObject.type).indexOf("tile") === -1) {
            if (layerNode._layerInfo.layerObject.geometryType === "esriGeometryPolygon") {
              layerList.push(layerNode._layerInfo.layerObject);
            }
          }
        }
      });
      return layerList;
    }
  });
});