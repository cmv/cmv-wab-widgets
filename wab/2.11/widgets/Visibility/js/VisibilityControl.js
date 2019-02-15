///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
define([
  'dojo/_base/declare',
  'dojo/_base/kernel',
  'dojo/_base/event',
  'dojo/Deferred',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/on',
  'dojo/keys',
  'dojo/number',
  'dojo/string',
  'dojo/topic',
  'dojo/dom-class',
  'dojo/dom-style',
  'dojo/mouse',
  'dojo/promise/all',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/TooltipDialog',
  'dijit/popup',
  'dojo/text!../templates/VisibilityControl.html',
  'jimu/dijit/Message',
  './DrawFeedBack',
  'esri/dijit/util/busyIndicator',
  'esri/graphic',
  'esri/layers/GraphicsLayer',
  'esri/tasks/FeatureSet',
  'esri/graphicsUtils',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/Color',
  'esri/dijit/analysis/CreateViewshed',
  'esri/layers/FeatureLayer',
  'esri/geometry/Polygon',
  'esri/geometry/geometryEngine',
  'esri/SpatialReference',
  './geometryUtils',
  './CoordinateInput',
  './EditOutputCoordinate',
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
  dojoKeys,
  dojoNumber,
  dojoString,
  dojoTopic,
  dojoDomClass,
  dojoDomStyle,
  dojoMouse,
  dojoAll,
  dijitWidgetBase,
  dijitTemplatedMixin,
  dijitWidgetsInTemplate,
  DijitTooltipDialog,
  dijitPopup,
  vistemplate,
  Message,
  DrawFeedBack,
  BusyIndicator,
  Graphic,
  GraphicsLayer,
  FeatureSet,
  graphicsUtils,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleMarkerSymbol,
  Color,
  CreateViewshed,
  FeatureLayer,
  Polygon,
  geometryEngine,
  SpatialReference,
  geometryUtils,
  CoordInput,
  EditOutputCoordinate
) {
  'use strict';
  return dojoDeclare([dijitWidgetBase, dijitTemplatedMixin, dijitWidgetsInTemplate], {
    templateString: vistemplate,
    baseClass: 'jimu-widget-visibility-control',
    FOV: 180,
    LA: 180,
    map: null,

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
      /**
       * Be sure to clone the options object so that each dijit has its own copy.
       * Otherwise, unexpected things happen with the selected value.
       * See https://github.com/Esri/visibility-addin-dotnet/issues/226 for details.
       */
      this.distanceUnitDD.addOption(dojoLang.clone(options));
      this.observerHeightDD.set('value', 'meters');
      this.distanceUnitDD.set('value', 'kilometers');
      if (this.portalUrl) {
        //set all the symbols required to represent differnet graphics
        this._setUpSymbology();

        //set up observer input dijit
        this.distanceUnit = this.distanceUnitDD.get('value');
        this.observerHeightUnit = this.observerHeightDD.get('value');
        this.coordTool = new CoordInput({
          nls: this.nls,
          appConfig: this.appConfig,
          style: 'width: calc(100% - 44px)'
        }, this.observerCoords);
        this.coordTool.inputCoordinate.formatType = 'DD';
        this.coordinateFormat = new DijitTooltipDialog({
          content: new EditOutputCoordinate({
            nls: this.nls
          }),
          style: 'width: 400px'
        });

        if (this.appConfig.theme.name === 'DartTheme') {
          dojoDomClass.add(this.coordinateFormat.domNode,
            'dartThemeClaroDijitTooltipContainerOverride');
        }

        //initiate and add viewshed graphics layer
        this._initGL();

        // add extended toolbar
        this.dt = new DrawFeedBack(this.map, this.coordTool.inputCoordinate.util);

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
    },

    startup: function () {
      this.busyIndicator = BusyIndicator.create({
        target: this.domNode.parentNode.parentNode.parentNode,
        backgroundOpacity: 0
      });
      var updateValues = dojoLang.hitch(this, function (a, b, c) {
        this.LA = this.angleUnits.checked ? a / 17.777777777778 : a;
        this.FOV = Math.round(b);
        if ((c === 360) && (this.angleUnits.checked)) {
          this.tooltip.innerHTML = $("input.fov").val() + " " + this.nls.milsLabel;
        } else {
          this.tooltip.innerHTML =
            this.angleUnits.checked ? c + " " + this.nls.milsLabel : c + " " + this.nls.degreesLabel;
        }
      });
      $("input.fov").knob({
        'min': 0,
        'max': 360,
        'cursor': 360,
        'inputColor': '#ccc',
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
        this.coordTool.inputCoordinate.watch(
          'outputString', dojoLang.hitch(this, function (r, ov, nv) {
            r = ov = null;
            if (!this.coordTool.manualInput) {
              this.coordTool.set('value', nv);
            }
          })),

        this.dt.watch('startPoint', dojoLang.hitch(this, function (r, ov, nv) {
          //When using maps with different spatial ref other than 102100 & 4326
          //the incorrect coordinateEsriGeometry was getting set in coordTool
          //To overcome this always set the coordinateEsriGeometry by projecting in 4326
          geometryUtils.getProjectedGeometry(nv, new SpatialReference(4326),
            this.coordTool.inputCoordinate.util.geomService).then(dojoLang.hitch(this,
            function (projectedNV) {
              r = ov = null;
              this.coordTool.inputCoordinate.set('coordinateEsriGeometry', projectedNV);
              this.dt.addStartGraphic(nv, this._ptSym);
            }));
        })),

        dojoOn(this.coordTool, 'keyup', dojoLang.hitch(this, this.coordToolKeyWasPressed)),

        this.dt.on('draw-complete', dojoLang.hitch(this, this.feedbackDidComplete)),

        dojoOn(this.coordinateFormatButton, 'click', dojoLang.hitch(
          this, this.coordinateFormatButtonWasClicked)),

        dojoOn(this.addPointBtn, 'click', dojoLang.hitch(this, this.pointButtonWasClicked)),

        dojoOn(this.btnCreate, 'click', dojoLang.hitch(this, this.createButtonWasClicked)),

        dojoOn(this.btnClear, "click", dojoLang.hitch(this, this.onClearBtnClicked)),

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

        dojoOn(this.coordinateFormat.content.applyButton, 'click', dojoLang.hitch(
          this,
          function () {
            var fs = this.coordinateFormat.content.formats[this.coordinateFormat.content.ct];
            var cfs = fs.defaultFormat;
            var fv = this.coordinateFormat.content.frmtSelect.value;
            if (fs.useCustom) {
              cfs = fs.customFormat;
            }
            this.coordTool.inputCoordinate.set(
              'formatPrefix',
              this.coordinateFormat.content.addSignChkBox.checked
            );
            this.coordTool.inputCoordinate.set('formatString', cfs);
            this.coordTool.inputCoordinate.set('formatType', fv);
            this.setCoordLabel(fv);
            dijitPopup.close(this.coordinateFormat);
          })),

        dojoOn(this.coordinateFormat.content.cancelButton, 'click', dojoLang.hitch(
          this,
          function () {
            dijitPopup.close(this.coordinateFormat);
          }))
      );
    },

    /*
     * catch key press in start point
     */
    coordToolKeyWasPressed: function (evt) {
      this.coordTool.manualInput = true;
      if (evt.keyCode === dojoKeys.ENTER) {
        this.coordTool.inputCoordinate.getInputType().then(dojoLang.hitch(this, function (r) {
          if (r.inputType === "UNKNOWN") {
            new Message({
              message: this.nls.parseCoordinatesError
            });
          } else {
            dojoTopic.publish(
              'visibility-observer-point-input',
              this.coordTool.inputCoordinate.coordinateEsriGeometry
            );
            this.setCoordLabel(r.inputType);
            var fs = this.coordinateFormat.content.formats[r.inputType];
            this.coordTool.inputCoordinate.set('formatString', fs.defaultFormat);
            this.coordTool.inputCoordinate.set('formatType', r.inputType);
            this.dt.addStartGraphic(r.coordinateEsriGeometry, this._ptSym);
            this.enableFOVDial();
          }
        }));
      }
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
        this.tooltip.hidden = false;
      }
    },

    /*
     *
     */
    mouseMoveOverFOVInput: function () {
      if (this.FOVInput.disabled === false) {
        $(document).ready(function () {
          $(document).mousemove(function (e) {
            var cpos = {
              top: e.pageY + 10,
              left: e.pageX + 10
            };
            $('#tooltip').offset(cpos);
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
        $("input.fov").trigger('configure', {
          "max": 6400,
          "units": 'mils',
          "milsValue": 6400
        });
        $("input.fov").val(6400).trigger('change');
      } else {
        $("input.fov").trigger('configure', {
          "max": 360,
          "units": 'degrees',
          "milsValue": 6400
        });
        $("input.fov").val(360).trigger('change');
      }
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
            places: 4,
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
    setCoordLabel: function (toType) {
      this.coordInputLabel.innerHTML = dojoString.substitute(
        this.nls.observerLocation + ' (${crdType})', {
          crdType: toType
        });
    },

    /*
     *
     */
    feedbackDidComplete: function () {
      dojoDomClass.remove(this.addPointBtn, 'jimu-edit-active');
      this.dt.deactivate();
      this.map.enableMapNavigation();
      this.enableFOVDial();
    },

    /*
     *
     */
    enableFOVDial: function () {
      if (this.FOVInput.disabled) {
        this.FOVInput.disabled = false;
        $("input.fov").trigger('configure', {
          "fgColor": "#00ff66",
          "bgColor": "#f37371",
          "inputColor": "#ccc"
        });
      }
    },

    /*
     *
     */
    coordinateFormatButtonWasClicked: function () {
      this.coordinateFormat.content.set('ct', this.coordTool.inputCoordinate.formatType);
      this.coordinateFormat.content.set('prefixChecked', this.coordTool.inputCoordinate.get("formatPrefix"));
      dijitPopup.open({
        popup: this.coordinateFormat,
        around: this.coordinateFormatButton
      });
    },

    /*
     * Button click event, activate feedback tool
     */
    pointButtonWasClicked: function () {
      if (dojoDomClass.contains(this.addPointBtn, 'jimu-edit-active')) {
        //already selected so deactivate draw tool
        this.dt.deactivate();
        this.map.enableMapNavigation();
      } else {
        this.coordTool.manualInput = false;
        dojoTopic.publish('clear-points');
        this.dt._setTooltipMessage(0);
        this.map.disableMapNavigation();
        this.dt.activate('point');
        var tooltip = this.dt._tooltip;
        if (tooltip) {
          tooltip.innerHTML = this.nls.pointToolTooltip;
        }
      }
      dojoDomClass.toggle(this.addPointBtn, 'jimu-edit-active');
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
      Azimuth1 = Azimuth1 > Azimuth2 ? Azimuth1 - 360 : Azimuth1;

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
      var Azimuth1 = parseInt(this.LA - (this.FOV / 2), 10);
      if (Azimuth1 < 0) {
        Azimuth1 = Azimuth1 + 360;
      }
      var Azimuth2 = parseInt(this.LA + (this.FOV / 2), 10);
      if (Azimuth2 > 360) {
        Azimuth2 = Azimuth2 - 360;
      }
      //If observers field of view is 360 then use buffers as wedges
      //else calculate wedges based on the selected field of views angle
      if (this.FOV === 360) {
        Azimuth1 = 0;
        Azimuth2 = 360;
        this._createWedgesUsingBuffers(def, pointFeatures, radius1, radius2);
      } else {
        this._createWedgesUsingAngles(def,
          pointFeatures[0], Azimuth1, Azimuth2, radius1, radius2);
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
          geomService = this.coordTool.inputCoordinate.util.geomService;
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
        returnFeatureCollection: true,
        outputLayerName: "inputLayer"
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

      // Issue with validating form in analysis tool with the TH locale. May be a bug in the dijit/form/ValidationTextBox
      // validate function with that particular locale. Please see this issue:
      // https://devtopia.esri.com/WebGIS/arcgis-webappbuilder/issues/14713

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
      var deferred = new DojoDeferred();
      /*
       * The Analysis service will only return visible view shed
       * So, add the wedge geometry with notVisibleArea symbol
       * and on top of it add the result of service which is visible viewshed
       * */
      //Shows not visble area on map
      this.graphicsLayer.add(new Graphic(this._wedgeGeometry, this.notVisibleArea));
      //Shows visible are on map
      for (var w = 0, wl = graphics.length; w < wl; w++) {
        var feature = graphics[w];
        if (feature && feature.geometry) {
          feature.setSymbol(this.visibleArea);
          this.graphicsLayer.add(feature);
        }
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
        this.busyIndicator.hide();
      }));
    },

    /*
     * Button click event, Validate and get user inputs and initiates analysis
     */
    createButtonWasClicked: function () {
      if (this.dt.startGraphic && this.minObsRange.isValid() &&
        this.maxObsRange.isValid() && this.observerHeight.isValid() &&
        parseInt(this.FOVInput.value, 10) !== 0) {
        var newObserver = new Graphic(this.coordTool.inputCoordinate.coordinateEsriGeometry);
        var featureSet = new FeatureSet();
        featureSet.features = [newObserver];

        var params = {
          "InputObserver": featureSet,
          "MinimumRadius": this.coordTool.inputCoordinate.util.convertToMeters(
            this.minObsRange.value, this.distanceUnit),
          "MaximumRadius": this.coordTool.inputCoordinate.util.convertToMeters(
            this.maxObsRange.value, this.distanceUnit),
          "ObserverHeight": this.coordTool.inputCoordinate.util.convertToMeters(
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
      this.angleUnits.setValue(false);
      this.coordTool.clear();
      this.graphicsLayer.clear();
      this.dt.removeStartGraphic();
      //reset dialog
      this.FOVInput.disabled = true;
      $("input.fov").val(360).trigger('change');
      $("input.fov").trigger('configure', {
        "fgColor": "#ccc",
        "bgColor": "#ccc",
        "inputColor": "#ccc"
      });
      this.tooltip.hidden = true;
    }
  });
});