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
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/kernel',
  'dojo/on',
  'dojo/topic',
  'dojo/has',
  'dojo/touch',
  'dojo/dom-attr',
  'dojo/dom-class',
  'dojo/string',
  'dojo/mouse',
  'dojo/number',
  'dojo/keys',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/TooltipDialog',
  'dijit/popup',
  'jimu/dijit/Message',
  'jimu/LayerInfos/LayerInfos',
  'esri/layers/FeatureLayer',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/TextSymbol',
  'esri/graphic',
  'esri/geometry/Polyline',
  'esri/geometry/Polygon',
  'esri/geometry/Point',
  'esri/geometry/Circle',
  'esri/tasks/FeatureSet',
  'esri/layers/LabelClass',
  '../models/CircleFeedback',
  '../views/CoordinateInput',
  '../views/EditOutputCoordinate',
  'dojo/text!../templates/TabCircle.html',
  'jimu/utils',
  'dijit/focus',
  'dojo/_base/event',
  'dojo/aspect',
  'dijit/form/NumberTextBox',
  'jimu/dijit/formSelect',
  'jimu/dijit/CheckBox',
  'dijit/TitlePane'
], function (
  dojoDeclare,
  dojoLang,
  dojoKernel,
  dojoOn,
  dojoTopic,
  dojoHas,
  dojoTouch,
  dojoDomAttr,
  dojoDomClass,
  dojoString,
  dojoMouse,
  dojoNumber,
  dojoKeys,
  dijitWidgetBase,
  dijitTemplatedMixin,
  dijitWidgetsInTemplate,
  DijitTooltipDialog,
  DijitPopup,
  Message,
  jimuLayerInfos,
  EsriFeatureLayer,
  EsriSimpleFillSymbol,
  EsriSimpleMarkerSymbol,
  EsriTextSymbol,
  EsriGraphic,
  EsriPolyline,
  EsriPolygon,
  EsriPoint,
  EsriCircle,
  EsriFeatureSet,
  EsriLabelClass,
  DrawFeedBack,
  CoordInput,
  EditOutputCoordinate,
  templateStr,
  jimuUtils,
  focusUtil,
  Event,
  dojoAspect
) {
  'use strict';
  return dojoDeclare([dijitWidgetBase, dijitTemplatedMixin, dijitWidgetsInTemplate], {
    templateString: templateStr,
    baseClass: 'jimu-widget-TabCircle',

    _restrictFocusOnAddCenterPointBtn: false,
    _centerPointInputKeyPressed: false,

    /*
     * class constructor
     */
    constructor: function (args) {
      dojoDeclare.safeMixin(this, args);
    },

    /*
     * dijit post create
     */
    postCreate: function () {

      this.useCalculatedDistance = false;
      this._restrictFocusOnAddCenterPointBtn = false;
      this._centerPointInputKeyPressed = false;

      this.currentLengthUnit = this.lengthUnitDD.get('value');

      this._circleSym = new EsriSimpleFillSymbol(this.circleSymbol);

      this._ptSym = new EsriSimpleMarkerSymbol(this.pointSymbol);

      this._labelSym = new EsriTextSymbol(this.labelSymbol);

      this.map.addLayer(this.getLayer());

      //must ensure the layer is loaded before we can access it to turn on the labels
      if (this._gl.loaded) {
        var featureLayerInfo =
          jimuLayerInfos.getInstanceSync().getLayerInfoById('Distance & Direction - Circle Graphics');
        featureLayerInfo.showLabels();
        featureLayerInfo.enablePopup();
      } else {
        this._gl.on("load", dojoLang.hitch(this, function () {
          var featureLayerInfo =
            jimuLayerInfos.getInstanceSync().getLayerInfoById('Distance & Direction - Circle Graphics');
          featureLayerInfo.showLabels();
          featureLayerInfo.enablePopup();
        }));
      }

      this.coordTool = new CoordInput({
        appConfig: this.appConfig,
        nls: this.nls,
        'aria-label': this.nls.centerPointLabel
      }, this.startPointCoords);

      this.coordTool.inputCoordinate.formatType = 'DD';

      this.coordinateFormat = new DijitTooltipDialog({
        content: new EditOutputCoordinate({
          nls: this.nls
        }),
        style: 'width: 400px'
      });

      dojoAspect.after(this.coordinateFormat, "onClose", dojoLang.hitch(this, function () {
        focusUtil.focus(this.coordinateFormatButton);
        if (this._restrictFocusOnAddCenterPointBtn) {
          var centerPointValue = this.coordTool.getValue();
          if (centerPointValue === '' || centerPointValue === null || centerPointValue === undefined) {
            this._restrictFocusOnAddCenterPointBtn = false;
          }
        }
      }));

      if (this.appConfig.theme.name === 'DartTheme') {
        dojoDomClass.add(this.coordinateFormat.domNode, 'dartThemeClaroDijitTooltipContainerOverride');
      }

      // add extended toolbar
      this.dt = new DrawFeedBack({
        appConfig: this.appConfig,
        map: this.map,
        coordTool: this.coordTool.inputCoordinate.util,
        nls: this.nls
      });

      this.dt.setFillSymbol(this._circleSym);

      this.syncEvents();

      this.checkValidInputs();

      this.radiusInput.invalidMessage = this.nls.numericInvalidMessage;
      this.radiusInput.rangeMessage = this.nls.rangeErrorMessage;

      this.timeInput.invalidMessage = this.nls.numericInvalidMessage;
      this.timeInput.rangeMessage = this.nls.invalidTimeMessage;

      this.distanceInput.invalidMessage = this.nls.numericInvalidMessage;
      this.distanceInput.rangeMessage = this.nls.invalidDistanceMessage;

      this.distCalcControl.set("title", this.nls.distanceCalculatorLabel);
    },

    /*
     * upgrade graphicslayer so we can use the label params
     */
    getLayer: function () {
      if (!this._gl) {
        var layerDefinition = {
          'id': 'circleLayer',
          'geometryType': 'esriGeometryPolygon',
          'objectIdField': 'ObjectID',
          'fields': [{
            "name": "ObjectID",
            "alias": "ObjectID",
            "type": "esriFieldTypeOID"
          }, {
            'name': 'Label',
            'type': 'esriFieldTypeString',
            'alias': 'Label'
          }]
        };

        var lblexp = {
          'labelExpressionInfo': {
            'value': '{Label}'
          }
        };
        var lblClass = new EsriLabelClass(lblexp);
        lblClass.symbol = this._labelSym;

        var featureCollection = {
          layerDefinition: layerDefinition,
          featureSet: new EsriFeatureSet()
        };

        this._gl = new EsriFeatureLayer(featureCollection, {
          id: 'Distance & Direction - Circle Graphics',
          showLabels: true,
          outFields: ["*"]
        });

        this._gl.setLabelingInfo([lblClass]);

        return this._gl;
      }
    },

    /*
     * Start up event listeners
     */
    syncEvents: function () {

      dojoTopic.subscribe('TAB_SWITCHED', dojoLang.hitch(this, this.tabSwitched));
      dojoTopic.subscribe("DD-WIDGET-CLOSED", dojoLang.hitch(this, this._closeDijit));

      this.distCalcControl.watch('open', dojoLang.hitch(this, this.distCalcDidExpand));

      this.dt.watch('length', dojoLang.hitch(this, function (n, ov, nv) {
        n = ov = null;
        this.circleLengthDidChange(nv);
      }));

      this.dt.watch('startPoint', dojoLang.hitch(this, function (r, ov, nv) {
        r = ov = null;
        this.dt.addStartGraphic(nv, this._ptSym);
      }));

      this.dt.watch('startPointDD', dojoLang.hitch(this, function (r, ov, nv) {
        r = ov = null;
        this.coordTool.inputCoordinate.set('coordinateEsriGeometry', nv);
        this.coordTool.inputCoordinate.set('inputType', this.coordTool.inputCoordinate.formatType);
      }));

      this.dt.watch('endPoint', dojoLang.hitch(this, function (r, ov, nv) {
        r = ov = null;
        this.coordTool.inputCoordinate.set('coordinateEsriGeometry', nv);
      }));

      this.coordTool.inputCoordinate.watch('outputString', dojoLang.hitch(this, function (r, ov, nv) {
        r = ov = null;
        if (!this.coordTool.manualInput) {
          this.coordTool.set('value', nv);
          this.currentCircle = null;
          if (this._restrictFocusOnAddCenterPointBtn) {
            this._restrictFocusOnAddCenterPointBtn = false;
          } else if (this._centerPointInputKeyPressed) {
            this._centerPointInputKeyPressed = false;
          } else {
            focusUtil.focus(this.addPointBtn);
          }
        }
      }));
      this.dt.on('draw-complete', dojoLang.hitch(this, this.feedbackDidComplete));

      this.own(
        dojoOn(this.coordTool, 'keydown', dojoLang.hitch(this, this.coordToolKeyWasPressed)),
        this.lengthUnitDD.on('change', dojoLang.hitch(this, this.lengthUnitDDDidChange)),
        this.creationType.on('change', dojoLang.hitch(this, this.creationTypeDidChange)),
        this.distanceUnitDD.on('change', dojoLang.hitch(this, this.distanceInputDidChange)),
        this.timeUnitDD.on('change', dojoLang.hitch(this, this.timeInputDidChange)),
        dojoOn(this.radiusInput, 'change', dojoLang.hitch(this, function () {
          this.currentCircle = null;
        })),

        dojoOn(this.coordinateFormatButton, 'click', dojoLang.hitch(this, this.coordinateFormatButtonWasClicked)),
        dojoOn(this.coordinateFormatButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.coordinateFormatButtonWasClicked();
          }
        })),

        dojoOn(this.addPointBtn, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.pointButtonWasClicked();
          }
        })),

        dojoOn(this.timeInput, 'change', dojoLang.hitch(this, this.timeInputDidChange)),
        dojoOn(this.distanceInput, 'change', dojoLang.hitch(this, this.distanceInputDidChange)),
        dojoOn(this.distanceInput, 'keyup', dojoLang.hitch(this, this.distanceInputKeyWasPressed)),

        dojoOn(this.clearGraphicsButton, 'click', dojoLang.hitch(this, this.clearGraphics)),
        dojoOn(this.clearGraphicsButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.clearGraphics();
          }
        })),

        dojoOn(this.interactiveCircle, 'change', dojoLang.hitch(this, this.interactiveCheckBoxChanged)),

        dojoOn(this.interactiveCircle, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER) {
            if (this.interactiveCircle.checked) {
              this.interactiveCircle.checked = false;
            } else {
              this.interactiveCircle.checked = true;
            }
            this.interactiveCheckBoxChanged();
          }
        })),

        dojoOn(this.coordinateFormat.content.applyButton, 'click', dojoLang.hitch(this, function () {
          this._restrictFocusOnAddCenterPointBtn = true;
          var fs = this.coordinateFormat.content.formats[this.coordinateFormat.content.ct];
          var cfs = fs.defaultFormat;
          var fv = this.coordinateFormat.content.frmtSelect.get('value');
          if (fs.useCustom) {
            cfs = fs.customFormat;
          }
          this.coordTool.inputCoordinate.set('formatPrefix', this.coordinateFormat.content.addSignChkBox.checked);
          this.coordTool.inputCoordinate.set('formatString', cfs);
          this.coordTool.inputCoordinate.set('formatType', fv);
          this.setCoordLabel(fv);

          DijitPopup.close(this.coordinateFormat);
          focusUtil.focus(this.coordinateFormatButton);
        })),
        dojoOn(this.coordinateFormat.content.applyButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this._restrictFocusOnAddCenterPointBtn = true;
            var fs = this.coordinateFormat.content.formats[this.coordinateFormat.content.ct];
            var cfs = fs.defaultFormat;
            var fv = this.coordinateFormat.content.frmtSelect.get('value');
            if (fs.useCustom) {

              cfs = fs.customFormat;
            }
            this.coordTool.inputCoordinate.set('formatPrefix', this.coordinateFormat.content.addSignChkBox.checked);
            this.coordTool.inputCoordinate.set('formatString', cfs);
            this.coordTool.inputCoordinate.set('formatType', fv);
            this.setCoordLabel(fv);

            DijitPopup.close(this.coordinateFormat);
            focusUtil.focus(this.coordinateFormatButton);
          }
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormat);
            focusUtil.focus(this.coordinateFormatButton);
          }
        })),

        dojoOn(this.coordinateFormat.content.cancelButton, 'click', dojoLang.hitch(this, function () {
          DijitPopup.close(this.coordinateFormat);
        })),
        dojoOn(this.coordinateFormat.content.cancelButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormat);
            focusUtil.focus(this.coordinateFormatButton);
          }
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormat);
            focusUtil.focus(this.coordinateFormatButton);
          }
        })),

        dojoOn(this.coordinateFormat.content.frmtSelect, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormat);
            focusUtil.focus(this.coordinateFormatButton);
          }
        })),

        dojoOn(this.coordinateFormat.content.frmtVal, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormat);
            focusUtil.focus(this.coordinateFormatButton);
          }
        })),

        dojoOn(this.coordinateFormat.content.addSignChkBox, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormat);
            focusUtil.focus(this.coordinateFormatButton);
          }
          if (evt.keyCode === dojoKeys.ENTER) {
            Event.stop(evt);
            if (this.coordinateFormat.content.addSignChkBox.checked) {
              this.coordinateFormat.content.addSignChkBox.checked = false;
            } else {
              this.coordinateFormat.content.addSignChkBox.checked = true;
            }
          }
        })),

        dojoOn(this.radiusInputDiv, dojoMouse.leave, dojoLang.hitch(this, this.checkValidInputs)),

        dojoOn(this.okButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.okButtonClicked();
          }
        }))
      );

      if (dojoHas("esri-touch")) {
        this.own(dojoOn(this.addPointBtn, dojoTouch.press, dojoLang.hitch(this, this.pointButtonWasClicked)));
      } else {
        this.own(dojoOn(this.addPointBtn, 'click', dojoLang.hitch(this, this.pointButtonWasClicked)));
      }
    },

    /*
     *
     */
    circleLengthDidChange: function (l) {
      var fl = dojoNumber.format(l, {
        places: 2,
        locale: dojoKernel.locale
      });
      this.radiusInput.set("displayedValue", fl);
      this.radiusInput.set('value', l);
    },

    /*
     * checkbox changed
     */
    interactiveCheckBoxChanged: function () {
      this.tabSwitched();
      if (this.interactiveCircle.checked) {
        this.radiusInput.set('disabled', true);
        this.distCalcControl.set('open', false);
        this.distCalcControl.set('open', false);
        this.distCalcControl.set('toggleable', false);
      } else {
        this.radiusInput.set('disabled', false);
        this.distCalcControl.set('disabled', false);
        this.distCalcControl.set('toggleable', true);
      }
      this.checkValidInputs();
    },

    /*
     * catch key press in start point
     */
    coordToolKeyWasPressed: function (evt) {
      this.dt.removeStartGraphic();
      if (evt.keyCode === dojoKeys.ENTER) {
        this._restrictFocusOnAddCenterPointBtn = true;
        this._centerPointInputKeyPressed = true;
        this.coordTool.inputCoordinate.getInputType().then(dojoLang.hitch(this, function (r) {
          if (r.inputType === "UNKNOWN") {
            new Message({
              message: this.nls.invalidCoordinateTypeMessage
            });
            this.coordTool.inputCoordinate.coordinateEsriGeometry = null;
            this.checkValidInputs();
          } else {
            this.dt.getProjectedGeometry(r.coordinateEsriGeometry, this.map.spatialReference).then(
              dojoLang.hitch(this, dojoLang.hitch(this, function (projectedGeometry) {
                dojoTopic.publish(
                  'manual-circle-center-point-input',
                  projectedGeometry
                );
                this.setCoordLabel(r.inputType);
                var fs = this.coordinateFormat.content.formats[r.inputType];
                this.coordTool.inputCoordinate.set('formatString', fs.defaultFormat);
                this.coordTool.inputCoordinate.set('formatType', r.inputType);
                this.dt.addStartGraphic(projectedGeometry, this._ptSym);
                this.checkValidInputs();
              })));
          }
        }));
      }
    },

    /*
     *
     */
    coordinateFormatButtonWasClicked: function () {
      this.coordinateFormat.content.set('ct', this.coordTool.inputCoordinate.formatType);
      DijitPopup.open({
        popup: this.coordinateFormat,
        around: this.coordinateFormatButton
      });
      focusUtil.focus(this.coordinateFormat.content.frmtSelect.focusNode);
    },

    /*
     * If parent widget is closed, close this dijit
     */
    _closeDijit: function () {
      if (this.coordinateFormat && this.coordinateFormat.domNode.offsetParent) {
        DijitPopup.close(this.coordinateFormat);
      }
    },

    /*
     *
     */
    distCalcDidExpand: function () {
      this.dt.deactivate();
      this.dt.cleanup();
      this.dt.disconnectOnMouseMoveHandler();

      this.coordTool.inputCoordinate.isManual = true;

      if (this.distCalcControl.get('open')) {
        this.radiusInput.set('disabled', true);
      } else {
        this.radiusInput.set('disabled', false);
        this.timeInput.set('value', 1);
        this.distanceInput.set('value', 1);
      }
    },

    /*
     *
     */
    timeInputDidChange: function () {
      this.currentTimeInSeconds = this.timeInput.get('value') * this.timeUnitDD.get('value');
      this.getCalculatedDistance();
      this.currentCircle = null;
    },

    distanceInputKeyWasPressed: function (evt) {
      this.distanceInputDidChange();
      if (evt.keyCode === dojoKeys.ENTER) {
        if (this.coordTool.inputCoordinate.outputString && this.coordTool.inputCoordinate.inputString !== '') {
          this.removeManualGraphic();
          this.setGraphic(true);
          this.dt._onDoubleClickHandler();
        } else {
          new Message({
            message: this.nls.noCenterPointSetMessage
          });
        }
      }
    },

    okButtonClicked: function () {
      if (!dojoDomClass.contains(this.okButton, "jimu-state-disabled")) {
        this._restrictFocusOnAddCenterPointBtn = true;
        this.removeManualGraphic();
        //if circel is already drawn then only navigate to publish screen
        if (this.currentCircle) {
          this.emit('show-publish', this._gl);
          return;
        }
        this.setGraphic(true);
        this.emit('show-publish', this._gl);
      }
    },

    distanceInputDidChange: function () {
      var currentRateInMetersPerSecond = (
        this.distanceInput.get('value') *
        this.distanceUnitDD.value.split(';')[0]
      ) / this.distanceUnitDD.value.split(';')[1];

      this.currentDistanceInMeters = currentRateInMetersPerSecond;
      this.getCalculatedDistance();
      this.currentCircle = null;
    },

    /*
     *
     */
    getCalculatedDistance: function () {
      if ((this.currentTimeInSeconds && this.currentTimeInSeconds > 0) &&
        (this.currentDistanceInMeters && this.currentDistanceInMeters > 0)) {
        this.calculatedRadiusInMeters = this.currentTimeInSeconds * this.currentDistanceInMeters;
        this.useCalculatedDistance = true;
        var fr = 0;
        switch (this.currentLengthUnit) {
          case 'feet':
            fr = this.calculatedRadiusInMeters * 3.2808399;
            break;
          case 'meters':
            fr = this.calculatedRadiusInMeters;
            break;
          case 'yards':
            fr = this.calculatedRadiusInMeters * 1.0936133;
            break;
          case 'kilometers':
            fr = this.calculatedRadiusInMeters * 0.001;
            break;
          case 'miles':
            fr = this.calculatedRadiusInMeters * 0.000621371192;
            break;
          case 'nautical-miles':
            fr = this.calculatedRadiusInMeters * 0.000539957;
            break;
        }
        fr = this.creationType.get('value') === 'Diameter' ? fr * 2 : fr;
        fr = dojoNumber.format(fr, {
          places: '4'
        });

        this.radiusInput.set('value', fr);
        //this.setGraphic();
      } else {
        this.calculatedRadiusInMeters = null;
        this.useCalculatedDistance = true;
      }
    },

    /*
     * Button click event, activate feedback tool
     */
    pointButtonWasClicked: function () {
      if (dojoDomClass.contains(this.addPointBtn, 'drawPointBtn-active')) {
        //already selected so deactivate draw tool
        this.dt.deactivate();
        this._setMapNavigation(true);
      } else {
        this.coordTool.manualInput = false;
        dojoTopic.publish('clear-points');
        this._setMapNavigation(false);
        this.dt.set('isDiameter', this.creationType.get('value') === 'Diameter');
        if (this.distCalcControl.get('open')) {
          this.dt.activate('point');
        } else {
          if (!this.interactiveCircle.checked) {
            this.dt.activate('point');
          } else {
            this.dt.activate('polyline');
          }
        }
      }
      dojoDomClass.toggle(this.addPointBtn, 'drawPointBtn-active');
    },

    /*
     *
     */
    lengthUnitDDDidChange: function () {
      this.currentLengthUnit = this.lengthUnitDD.get('value');
      //var currentCreateCircleFrom = this.creationType.get('value');
      this.dt.set('lengthUnit', this.currentLengthUnit);
      if (this.distCalcControl.get('open')) {
        this.distanceInputDidChange();
      }
      this.currentCircle = null;
    },

    /*
     *
     */
    creationTypeDidChange: function () {
      var currentCreateCircleFrom =
        (this.creationType.get('value') === "Diameter") ?
        this.nls.diameterLabel : this.nls.radiusLabel;
      this.radiusDiameterLabel.innerHTML = jimuUtils.sanitizeHTML(currentCreateCircleFrom);
      dojoDomAttr.set(this.radiusInput, 'aria-label', currentCreateCircleFrom);
      dojoDomAttr.set(this.lengthUnitDD, 'aria-label', currentCreateCircleFrom);
      this.currentCircle = null;
    },

    /*
     *
     */
    feedbackDidComplete: function (results) {
      if (!results.geometry.center) {
        dojoDomClass.toggle(this.addPointBtn, 'drawPointBtn-active');
        this._setMapNavigation(true);
        this.dt.deactivate();
        this.checkValidInputs();
        return;
      }
      var center = results.geometry.center;
      var edge = new EsriPoint(results.geometry.rings[0][0][0],
        results.geometry.rings[0][0][1],
        results.geometry.center.spatialReference);
      var geom = new EsriPolyline(results.geometry.center.spatialReference);
      geom.addPath([center, edge]);
      this.setGraphic(false, geom);
      focusUtil.focus(this.addPointBtn);
    },

    /*
     *
     */
    setCoordLabel: function (toType) {
      var centerPointLabelValue = jimuUtils.sanitizeHTML(dojoString.substitute(
        this.nls.centerPointLabel + ' (${crdType})', {
          crdType: toType
        }
      ));
      this.coordInputLabel.innerHTML = centerPointLabelValue;
      dojoDomAttr.set(this.coordTool.textbox, 'aria-label', centerPointLabelValue);
    },

    /*
     *
     */
    removeManualGraphic: function () {
      if (this.tempGraphic !== null) {
        this._gl.remove(this.tempGraphic);
      }
      this.dt.removeStartGraphic();
    },

    /*
     *
     */
    setGraphic: function (isManual, lineGeom) {
      if (!isManual) {
        dojoDomClass.toggle(this.addPointBtn, 'drawPointBtn-active');
      }

      var results = {};
      this._setMapNavigation(true);
      this.dt.deactivate();
      this.dt.removeStartGraphic();

      results.calculatedDistance = (this.creationType.get('value') === 'Diameter') ?
        this.radiusInput.get('value') / 2 : this.radiusInput.get('value');

      results.calculatedDistance =
        this.coordTool.inputCoordinate.util.convertToMeters(results.calculatedDistance,
          this.lengthUnitDD.get('value'));
      results.geometry = this.coordTool.inputCoordinate.coordinateEsriGeometry;
      results.lineGeometry = lineGeom;

      var newCurrentCircle = new EsriCircle({
        center: results.geometry,
        radius: results.calculatedDistance,
        geodesic: true,
        numberOfPoints: 360
      });
      var newPolygon = new EsriPolygon(results.geometry.spatialReference);
      newPolygon.addRing(newCurrentCircle.rings[0]);
      //get circel geometry in map spatial ref
      this.dt.getProjectedGeometry(newPolygon,
        this.map.spatialReference).then(dojoLang.hitch(this, function (projectedGeom) {
        var radiusFieldValue;
        //calculate radius value to store in attributes
        radiusFieldValue = (this.creationType.get("value") === "Diameter") ?
          parseFloat(this.radiusInput.get('value')) / 2 : parseFloat(this.radiusInput.get('value'));

        var cGraphic = new EsriGraphic(
          projectedGeom,
          this._circleSym, {
            'Label': (!window.isRTL) ? this.creationType.get('displayedValue') + " " +
              this.radiusInput.get('displayedValue') + " " +
              this._getLengthAbbrevation(this.lengthUnitDD.get('value')) : this._getLengthAbbrevation(
                this.lengthUnitDD.get('value')) + " " + this.radiusInput.get('displayedValue') + " " +
              this.creationType.get('displayedValue'),
            CenterPoint: this.coordTool.get("value"),
            RadiusDistance: radiusFieldValue,
            RadiusUnit: this.currentLengthUnit
          });
        this.checkValidInputs();
        //set maps extent to the new circle
        this.map.setExtent(projectedGeom.getExtent().expand(3));
        this.currentCircle = cGraphic;
        this._gl.add(cGraphic);
        this._gl.refresh();
        this.dt.set('startPoint', null);
      }));
    },

    /*
     * Remove graphics and reset values
     */
    clearGraphics: function () {
      if (this._gl) {
        // graphic layers
        this._gl.clear();
        this._gl.refresh();

        // ui controls
        this.clearUI(false);
      }
      this.tabSwitched();
      this.checkValidInputs();
      this.currentCircle = null;
      //refresh each of the feature/graphic layers to enusre labels are removed
      for (var j = 0; j < this.map.graphicsLayerIds.length; j++) {
        this.map.getLayer(this.map.graphicsLayerIds[j]).refresh();
      }
    },

    /*
     * reset ui controls
     */
    clearUI: function (keepCoords) {
      if (!keepCoords) {
        this.coordTool.clear();
      }
      this.dt.set('startPoint', null);
      this.useCalculatedDistance = false;
      dojoDomClass.remove(this.addPointBtn, 'drawPointBtn-active');
      dojoDomAttr.set(this.startPointCoords, 'value', '');
      this.radiusInput.set('value', 1000);
      this.timeInput.set('value', 1);
      this.distanceInput.set('value', 1);
    },

    /*
     *
     */
    setGraphicsHidden: function () {
      if (this._gl) {
        this._gl.hide();
      }
    },

    /*
     *
     */
    setGraphicsShown: function () {
      if (this._gl) {
        this._gl.show();
      }
    },

    /*
     * Activate the ok button if all the requried inputs are valid
     */
    checkValidInputs: function () {
      dojoDomClass.add(this.okButton, 'jimu-state-disabled');
      dojoDomAttr.set(this.okButton, "tabindex", -1);
      if (this.coordTool.inputCoordinate.coordinateEsriGeometry !== null && this.radiusInput.isValid()) {
        dojoDomClass.remove(this.okButton, 'jimu-state-disabled');
        dojoDomAttr.set(this.okButton, "tabindex", 0);
      }
      this.okButton.innerHTML = (this.interactiveCircle.checked) ? this.nls.publishDDBtn : this.nls.common.ok;
    },

    /*
     * Make sure any active tools are deselected to prevent multiple actions being performed
     */
    tabSwitched: function () {
      this.dt.deactivate();
      this.dt.cleanup();
      this.dt.disconnectOnMouseMoveHandler();
      this.dt.set('startPoint', null);
      this._setMapNavigation(true);
      this.dt.removeStartGraphic();
      if (this.addPointBtn) {
        dojoDomClass.remove(this.addPointBtn, 'drawPointBtn-active');
      }
      DijitPopup.close(this.coordinateFormat);
    },

    /**
     * Enables/Disables the map navigation
     * @param {bool} isEnabled
     */
    _setMapNavigation: function (isEnabled) {
      if (isEnabled) {
        this.map.enableMapNavigation();
      } else {
        this.map.disableMapNavigation();
        this.map.enableScrollWheelZoom();
      }
    },

    _getLengthAbbrevation: function (value) {
      var retVal = null;
      if (value) {
        switch (value) {
          case "feet":
            retVal = this.nls.abbrevFeetLabel;
            break;
          case "kilometers":
            retVal = this.nls.abbrevKmLabel;
            break;
          case "miles":
            retVal = this.nls.abbrevMilesLabel;
            break;
          case "meters":
            retVal = this.nls.abbrevMetersLabel;
            break;
          case "nautical-miles":
            retVal = this.nls.abbrevNauticalMilesLabel;
            break;
          case "yards":
            retVal = this.nls.abbrevYardsLabel;
            break;
          default:
            retVal = value;
        }
      }
      return retVal;
    },

    _getDegreeAbbreviation: function (value) {
      var retVal = null;
      if (value) {
        switch (value) {
          case "degrees":
            retVal = this.nls.abbrevDegreesLabel;
            break;
          case "mils":
            retVal = this.nls.abbrevMilsLabel;
            break;
          default:
            retVal = value;
        }
      }
      return retVal;
    },

    _getTimeAbbreviation: function (value) {
      var retVal = null;
      if (value) {
        switch (value) {
          case "3600":
            retVal = this.nls.abbrevHoursLabel;
            break;
          case "60":
            retVal = this.nls.abbrevMinutesLabel;
            break;
          case "1":
            retVal = this.nls.abbrevSecondsLabel;
            break;
          default:
            retVal = value;
        }
      }
      return retVal;
    },

    _getRateAbbreviation: function (value) {
      var retVal = null;
      if (value) {
        switch (value) {
          case "0.3048;1":
            retVal = this.nls.abbrevFeetSecondsLabel;
            break;
          case "0.3048;3600":
            retVal = this.nls.abbrevFeetHourLabel;
            break;
          case "1000;1":
            retVal = this.nls.abbrevKmSecondLabel;
            break;
          case "1000;3600":
            retVal = this.nls.abbrevKmHourLabel;
            break;
          case "1;1":
            retVal = this.nls.abbrevMetersSecondLabel;
            break;
          case "1;3600":
            retVal = this.nls.abbrevMetersHourLabel;
            break;
          case "1609.344;1":
            retVal = this.nls.abbrevMilesSecondLabel;
            break;
          case "1609.344;3600":
            retVal = this.nls.abbrevMilesHourLabel;
            break;
          case "1852;1":
            retVal = this.nls.abbrevNauticalMilesSecondLabel;
            break;
          case "1852;3600":
            retVal = this.nls.abbrevNauticalMilesHourLabel;
            break;
          default:
            retVal = value;
        }
      }
      return retVal;
    },

    /**
     * This function is used to set first focus node
     */
    setFirstFocusNode: function () {
      jimuUtils.initFirstFocusNode(this.domNodeObj, this.creationType.domNode);
    },

    /**
     * This function is used to set focus on first node of selected tab
     */
    focusFirstNodeOfSelectedTab: function () {
      focusUtil.focus(this.creationType.focusNode);
    },

    /**
     * This function is used to set the last focus node
     */
    setLastFocusNode: function () {
      jimuUtils.initLastFocusNode(this.domNodeObj, this.clearGraphicsButton);
    }
  });
});