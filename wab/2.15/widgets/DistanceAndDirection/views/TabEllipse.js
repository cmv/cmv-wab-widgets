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
/* jshint -W098 */
/* jshint -W117 */
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
  'dojo/number',
  'dojo/mouse',
  'dojo/keys',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/TooltipDialog',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/popup',
  'jimu/dijit/Message',
  'jimu/LayerInfos/LayerInfos',
  'jimu/utils',
  'esri/layers/GraphicsLayer',
  'esri/layers/FeatureLayer',
  'esri/layers/LabelClass',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/TextSymbol',
  'esri/graphic',
  'esri/tasks/FeatureSet',
  '../models/EllipseFeedback',
  '../views/CoordinateInput',
  '../views/EditOutputCoordinate',
  'dojo/text!../templates/TabEllipse.html',
  'dijit/focus',
  'dojo/_base/event',
  'dojo/aspect',
  'dijit/form/NumberTextBox',
  'jimu/dijit/formSelect',
  'jimu/dijit/CheckBox'
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
  dojoNumber,
  dojoMouse,
  dojoKeys,
  dijitWidgetBase,
  dijitTemplatedMixin,
  DijitTooltipDialog,
  dijitWidgetsInTemplate,
  DijitPopup,
  Message,
  jimuLayerInfos,
  jimuUtils,
  EsriGraphicsLayer,
  EsriFeatureLayer,
  EsriLabelClass,
  EsriSimpleMarkerSymbol,
  EsriSimpleFillSymbol,
  EsriTextSymbol,
  EsriGraphic,
  EsriFeatureSet,
  DrawFeedBack,
  CoordInput,
  EditOutputCoordinate,
  templateStr,
  focusUtil,
  Event,
  dojoAspect
) {
  'use strict';
  return dojoDeclare([dijitWidgetBase, dijitTemplatedMixin, dijitWidgetsInTemplate], {
    templateString: templateStr,
    baseClass: 'jimu-widget-TabEllipse',

    centerPointGraphic: null,
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
      this._restrictFocusOnAddCenterPointBtn = false;
      this._centerPointInputKeyPressed = false;
      this.currentAngleUnit = this.angleUnitDD.get('value');
      this.currentLengthUnit = this.lengthUnitDD.get('value');

      this._labelSym = new EsriTextSymbol(this.labelSymbol);
      this._ptSym = new EsriSimpleMarkerSymbol(this.pointSymbol);
      this._ellipseSym = new EsriSimpleFillSymbol(this.ellipseSymbol);

      this._textGL = new EsriGraphicsLayer();
      this.map.addLayer(this._textGL);

      this.map.addLayer(this.getLayer());

      //must ensure the layer is loaded before we can access it to turn on the labels
      if (this._gl.loaded) {
        var featureLayerInfo =
          jimuLayerInfos.getInstanceSync().getLayerInfoById('Distance & Direction - Ellipse Graphics');
        featureLayerInfo.showLabels();
        featureLayerInfo.enablePopup();
      } else {
        this._gl.on("load", dojoLang.hitch(this, function () {
          var featureLayerInfo =
            jimuLayerInfos.getInstanceSync().getLayerInfoById('Distance & Direction - Ellipse Graphics');
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
      this.dt.setLineSymbol(this._ellipseSym);
      this.dt.set('lengthUnit', 'kilometers');
      this.dt.set('angle', 0);
      this.dt.set('ellipseType', 'semi');

      this.syncEvents();

      this.checkValidInputs();

      this.majorAxisInput.invalidMessage = this.nls.numericInvalidMessage;
      this.majorAxisInput.rangeMessage = this.nls.axisErrorMessage;

      this.minorAxisInput.invalidMessage = this.nls.numericInvalidMessage;
      this.minorAxisInput.rangeMessage = this.nls.axisErrorMessage;

      this.angleInput.invalidMessage = this.nls.numericInvalidMessage;
      this.angleInput.rangeMessage = this.nls.orientationErrorMessage;
    },

    /*
     * upgrade graphicslayer so we can use the label params
     */
    getLayer: function () {
      if (!this._gl) {
        var layerDefinition = {
          'extent': {
            'xmin': 0,
            'ymin': 0,
            'xmax': 0,
            'ymax': 0,
            'spatialReference': {
              'wkid': 102100,
              'latestWkid': 102100
            }
          },
          'geometryType': 'esriGeometryPolygon',
          'objectIdField': 'ObjectID',
          'fields': [{
            "name": "ObjectID",
            "alias": "ObjectID",
            "type": "esriFieldTypeOID"
          }, {
            'name': 'MAJOR',
            'type': 'esriFieldTypeText',
            'alias': 'Major Axis'
          }, {
            'name': 'MINOR',
            'type': 'esriFieldTypeText',
            'alias': 'Minor Axis'
          }, {
            'name': 'ORIENTATION_ANGLE',
            'type': 'esriFieldTypeText',
            'alias': 'Orientation Angle'
          }]
        };

        var labelInfos = [];

        // Create label class for major length
        var lblexp = {
          'labelExpressionInfo': {
            'value': this.nls.ellipseMajorAxis + ' {MAJOR}'
          }
        };
        var lblClass = new EsriLabelClass(lblexp);
        lblClass.labelPlacement = 'above-along';
        lblClass.symbol = dojoLang.clone(this._labelSym).setOffset(0, 20);
        labelInfos.push(lblClass);

        // Create label class for minor length
        lblexp = {
          'labelExpressionInfo': {
            'value': this.nls.ellipseMinorAxis + ' {MINOR}'
          }
        };
        lblClass = new EsriLabelClass(lblexp);
        lblClass.labelPlacement = 'center-along';
        lblClass.symbol = this._labelSym;
        labelInfos.push(lblClass);

        // Create label for orientation angle
        lblexp = {
          'labelExpressionInfo': {
            'value': this.nls.angleLabel + ': {ORIENTATION_ANGLE}'
          }
        };
        lblClass = new EsriLabelClass(lblexp);
        lblClass.labelPlacement = 'below-along';
        lblClass.symbol = dojoLang.clone(this._labelSym).setOffset(0, -20);
        labelInfos.push(lblClass);

        var fs = new EsriFeatureSet();

        var featureCollection = {
          layerDefinition: layerDefinition,
          featureSet: fs
        };

        this._gl = new EsriFeatureLayer(featureCollection, {
          id: 'Distance & Direction - Ellipse Graphics',
          showLabels: true
        });
        this.own(dojoOn(this._gl, "visibility-change", dojoLang.hitch(this, function (o) {
          this._textGL.setVisibility(o.visible);
        })));

        //this._gl.setLabelingInfo(labelInfos);

        return this._gl;
      }
    },

    /*
     * Start up event listeners
     */
    syncEvents: function () {
      //commented out as we want the graphics to remain when the widget is closed
      /*dojoTopic.subscribe('DD_WIDGET_OPEN',dojoLang.hitch(this, this.setGraphicsShown));
      dojoTopic.subscribe('DD_WIDGET_CLOSE',dojoLang.hitch(this, this.setGraphicsHidden));*/
      dojoTopic.subscribe('TAB_SWITCHED', dojoLang.hitch(this, this.tabSwitched));
      dojoTopic.subscribe("DD-WIDGET-CLOSED", dojoLang.hitch(this, this._closeDijit));
      dojoTopic.subscribe(DrawFeedBack.DD_ELLIPSE_MINOR_LENGTH_CHANGE,
        dojoLang.hitch(this, this.minorLengthDidChange));
      dojoTopic.subscribe(DrawFeedBack.DD_ELLIPSE_MAJOR_LENGTH_CHANGE,
        dojoLang.hitch(this, this.majorLengthDidChange));
      dojoTopic.subscribe(DrawFeedBack.DD_ELLIPSE_ANGLE_CHANGE,
        dojoLang.hitch(this, this.angleDidChange));

      this.dt.watch('startPoint', dojoLang.hitch(this, function (r, ov, nv) {
        this.dt.addStartGraphic(nv, this._ptSym);
      }));
      this.dt.watch('startPointDD', dojoLang.hitch(this, function (r, ov, nv) {
        this.coordTool.inputCoordinate.set('coordinateEsriGeometry', nv);
      }));

      this.coordTool.inputCoordinate.watch('outputString', dojoLang.hitch(this, function (r, ov, nv) {
        if (!this.coordTool.manualInput) {
          this.coordTool.set('value', nv);
          this.currentEllipse = null;
          if (this._restrictFocusOnAddCenterPointBtn) {
            this._restrictFocusOnAddCenterPointBtn = false;
          } else if (this._centerPointInputKeyPressed) {
            this._centerPointInputKeyPressed = false;
          } else {
            focusUtil.focus(this.addPointBtn);
          }
        }
      }));

      this.own(
        this.dt.on('draw-complete', dojoLang.hitch(this, this.feedbackDidComplete)),

        this.ellipseType.on('change', dojoLang.hitch(this, this.ellipseTypeDDDidChange)),

        this.angleUnitDD.on('change', dojoLang.hitch(this, this.angleUnitDDDidChange)),

        this.lengthUnitDD.on('change', dojoLang.hitch(this, this.lengthUnitDDDidChange)),

        dojoOn(this.coordinateFormatButton, 'click', dojoLang.hitch(this, this.coordinateFormatButtonWasClicked)),
        dojoOn(this.coordinateFormatButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.coordinateFormatButtonWasClicked();
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
          this.coordTool.inputCoordinate.set(
            'formatPrefix',
            this.coordinateFormat.content.addSignChkBox.checked
          );
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
            this.coordTool.inputCoordinate.set(
              'formatPrefix',
              this.coordinateFormat.content.addSignChkBox.checked
            );
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

        dojoOn(this.addPointBtn, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.pointButtonWasClicked();
          }
        })),

        dojoOn(this.interactiveEllipse, 'change', dojoLang.hitch(this, this.interactiveCheckBoxChanged)),

        dojoOn(this.interactiveEllipse, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER) {
            if (this.interactiveEllipse.checked) {
              this.interactiveEllipse.checked = false;
            } else {
              this.interactiveEllipse.checked = true;
            }
            this.interactiveCheckBoxChanged();
          }
        })),

        dojoOn(this.coordTool, 'keydown', dojoLang.hitch(this, this.coordToolKeyWasPressed)),

        dojoOn(this.majorAxisInput, 'change', dojoLang.hitch(this, function () {
          this.currentEllipse = null;
        })),

        dojoOn(this.minorAxisInput, 'change', dojoLang.hitch(this, function () {
          this.currentEllipse = null;
        })),

        dojoOn(this.angleInput, 'change', dojoLang.hitch(this, this.angleDidChange)),

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

        dojoOn(this.clearGraphicsButton, 'click', dojoLang.hitch(this, this.clearGraphics)),
        dojoOn(this.clearGraphicsButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.clearGraphics();
          }
        })),

        dojoOn(this.majorAxisInputDiv, dojoMouse.leave, dojoLang.hitch(this, this.checkValidInputs)),

        dojoOn(this.minorAxisInputDiv, dojoMouse.leave, dojoLang.hitch(this, this.checkValidInputs)),

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

        dojoOn(this.angleInputDiv, dojoMouse.leave, dojoLang.hitch(this, this.checkValidInputs)),

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

    okButtonClicked: function () {
      if (!dojoDomClass.contains(this.okButton, "jimu-state-disabled")) {
        this._restrictFocusOnAddCenterPointBtn = true;
        //if ellipse is allready drawn dont create the new one only navigate user to publish screen
        if (this.currentEllipse) {
          this.emit('show-publish', this._gl);
          return;
        }
        if (dojoDomAttr.get(this.ellipseType, 'value') === "full") {
          dojoTopic.publish('create-manual-ellipse',
            this.majorAxisInput.get('value') / 2,
            this.minorAxisInput.get('value') / 2,
            this.angleInput.get('value'),
            this.coordTool.inputCoordinate.coordinateEsriGeometry);
        } else {
          dojoTopic.publish('create-manual-ellipse',
            this.majorAxisInput.get('value'),
            this.minorAxisInput.get('value'),
            this.angleInput.get('value'),
            this.coordTool.inputCoordinate.coordinateEsriGeometry);
        }
        this.emit('show-publish', this._gl);
      }
    },

    /*
     * update the gui with the major axis length
     */
    majorLengthDidChange: function (number) {
      if (dojoDomAttr.get(this.ellipseType, 'value') === "full") {
        number *= 2;
      }
      var formatAxis = dojoNumber.format(number, {
        places: 2,
        locale: dojoKernel.locale
      });
      this.majorAxisInput.set('value', number);
      this.majorAxisInput.set('displayedValue', formatAxis);
      // this.majorAxisInput.setValue(formatAxis);
    },

    /*
     * update the gui with the min axis length
     */
    minorLengthDidChange: function (number) {
      if (dojoDomAttr.get(this.ellipseType, 'value') === "full") {
        number *= 2;
      }
      var formatAxis = dojoNumber.format(number, {
        places: 2,
        locale: dojoKernel.locale
      });
      this.minorAxisInput.set('value', number);
      this.minorAxisInput.set('displayedValue', formatAxis);
      // this.minorAxisInput.setValue(formatAxis);
    },

    /*
     * update the gui with angle
     */
    angleDidChange: function (number) {
      var formatAngle = dojoNumber.format(number, {
        places: 2,
        locale: dojoKernel.locale
      });
      this.angleInput.set('value', number);
      this.angleInput.set('displayedValue', formatAngle);
      // this.angleInput.setValue(formatAngle);
      this.dt.set('angle', number);
      this.currentEllipse = null;
    },

    /*
     * checkbox changed
     */
    interactiveCheckBoxChanged: function () {
      this.tabSwitched();
      if (this.interactiveEllipse.checked) {
        this.majorAxisInput.set('disabled', true);
        this.minorAxisInput.set('disabled', true);
        this.angleInput.set('disabled', true);
      } else {
        this.majorAxisInput.set('disabled', false);
        this.minorAxisInput.set('disabled', false);
        this.angleInput.set('disabled', false);
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
        this.currentEllipse = null;
        this.coordTool.inputCoordinate.getInputType().then(dojoLang.hitch(this, function (r) {
          if (r.inputType === "UNKNOWN") {
            var alertMessage = new Message({
              message: this.nls.invalidCoordinateTypeMessage
            });
            this.coordTool.inputCoordinate.coordinateEsriGeometry = null;
            this.checkValidInputs();
          } else {
            this.dt.getProjectedGeometry(r.coordinateEsriGeometry, this.map.spatialReference).then(
              dojoLang.hitch(this, dojoLang.hitch(this, function (projectedGeometry) {
                dojoTopic.publish(
                  'manual-ellipse-center-point-input',
                  projectedGeometry
                );
                this.setCoordLabel(r.inputType);
                var fs = this.coordinateFormat.content.formats[r.inputType];
                this.coordTool.inputCoordinate.set('formatString', fs.defaultFormat);
                this.coordTool.inputCoordinate.set('formatType', r.inputType);
                this.dt.addStartGraphic(projectedGeometry, this._ptSym);
              })));
            this.checkValidInputs();
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
        if (this.interactiveEllipse.checked) {
          this.dt.activate('polyline');
        } else {
          this.dt.activate('point');
        }
      }
      dojoDomClass.toggle(this.addPointBtn, 'drawPointBtn-active');
    },

    /*
     *
     */
    lengthUnitDDDidChange: function () {
      this.currentLengthUnit = this.lengthUnitDD.get('value');
      this.dt.set('lengthUnit', this.currentLengthUnit);
      this.currentEllipse = null;
    },

    /*
     *
     */
    ellipseTypeDDDidChange: function () {
      var majorAxisLbl, minorAxisLabel;
      majorAxisLbl = dojoDomAttr.get(this.ellipseType, 'value') === "full" ?
        this.nls.majorDiameterLabel : this.nls.majorRadiusLabel;
      minorAxisLabel = dojoDomAttr.get(this.ellipseType, 'value') === "full" ?
        this.nls.minorDiameterLabel : this.nls.minorRadiusLabel;
      this.majorAxisLabel.textContent = (dojoDomAttr.get(this.ellipseType, 'value') === "full") ?
        this.nls.majorDiameterLabel : this.nls.majorRadiusLabel;
      this.minorAxisLabel.textContent = (dojoDomAttr.get(this.ellipseType, 'value') === "full") ?
        this.nls.minorDiameterLabel : this.nls.minorRadiusLabel;
      dojoDomAttr.set(this.majorAxisInput, "aria-label", majorAxisLbl);
      dojoDomAttr.set(this.minorAxisInput, "aria-label", minorAxisLabel);
    },

    /*
     *
     */
    angleUnitDDDidChange: function () {
      this.currentAngleUnit = this.angleUnitDD.get('value');
      this.dt.set('angleUnit', this.currentAngleUnit);

      if (this.currentAngleUnit === "degrees") {
        this.angleInput.constraints.max = 360;
        this.angleInput.rangeMessage = this.nls.degreesRangeMessage;
      } else {
        this.angleInput.constraints.max = 6400;
        this.angleInput.rangeMessage = this.nls.millsRangeMessage;
      }
      this.currentEllipse = null;
    },

    /*
     *
     */
    feedbackDidComplete: function (results) {
      if (results.geometry.type === 'polygon') {
        this.currentEllipse = new EsriGraphic(results.geometry.geometry, this._ellipseSym);

        var type = this.majorAxisLabel.textContent.split(" ")[1];

        var majorAxisValue, minorAxisValue;
        //calculae majorAxisValue and minorAxisValue to store in attributes
        majorAxisValue = (this.ellipseType.get("value") === "semi") ?
          parseFloat(this.majorAxisInput.value) * 2 : parseFloat(this.majorAxisInput.value);
        minorAxisValue = (this.ellipseType.get("value") === "semi") ?
          parseFloat(this.minorAxisInput.value) * 2 : parseFloat(this.minorAxisInput.value);

        this.currentEllipse.setAttributes({
          'MINOR': type + ": " + this.minorAxisInput.get('displayedValue') + " " +
            this.lengthUnitDD.get('displayedValue'),
          'MAJOR': type + ": " + this.majorAxisInput.get('displayedValue') + " " +
            dijit.byId('lengthUnitDD').get('displayedValue'),
          'ORIENTATION_ANGLE': this.angleInput.get('displayedValue') + " " +
            this.angleUnitDD.get('displayedValue'),
          CenterPoint: this.coordTool.get("value"),
          MajorAxis: majorAxisValue,
          MinorAxis: minorAxisValue,
          Unit: this.currentLengthUnit,
          Orientation: parseFloat(this.angleInput.get("value")),
          OrientationUnit: this.currentAngleUnit
        });

        this._gl.add(this.currentEllipse);

        var polyCenter = results.geometry.geometry.getCentroid();

        //Check for RTL behavior
        var ellipseText = (!window.isRTL) ? this.minorAxisLabel.textContent + " " +
          this.minorAxisInput.get('displayedValue') + " " +
          this._getLengthAbbrevation(this.lengthUnitDD.get('value')) :
          this.minorAxisInput.get('displayedValue') + " " +
          this._getLengthAbbrevation(this.lengthUnitDD.get('value')) + " " +
          this.nls.minorRadiusLabel;
        this._textGL.add(new EsriGraphic(polyCenter,
          dojoLang.clone(this._labelSym).setOffset(0, 20).setText(ellipseText)));

        ellipseText = (!window.isRTL) ?
          this.majorAxisLabel.textContent + " " +
          this.majorAxisInput.get('displayedValue') + " " +
          this._getLengthAbbrevation(dijit.byId('lengthUnitDD').get('value')) :
          this.majorAxisInput.get('displayedValue') + " " +
          this._getLengthAbbrevation(dijit.byId('lengthUnitDD').get('value')) + " " + this.nls.majorRadiusLabel;

        this._textGL.add(new EsriGraphic(polyCenter,
          dojoLang.clone(this._labelSym).setText(ellipseText)));

        ellipseText = (!window.isRTL) ? this.nls.angleLabel + " " + this.angleInput.get('displayedValue') + " " +
          this._getDegreeAbbreviation(this.angleUnitDD.get('value')) :
          this.angleInput.get('displayedValue') + " " +
          this._getDegreeAbbreviation(this.angleUnitDD.get('value')) + " " + this.nls.angleLabel;
        this._textGL.add(new EsriGraphic(polyCenter,
          dojoLang.clone(this._labelSym).setOffset(0, -20).setText(ellipseText)));

        this._gl.refresh();
        //set maps extent to the new ellipse geometry
        this.map.setExtent(this.currentEllipse.geometry.getExtent().expand(3));
      }
      //check validinput so that it will activate/deactivate ok button if required
      this.checkValidInputs();
      this._setMapNavigation(true);
      this.dt.deactivate();
      //this.dt.removeStartGraphic();
      dojoDomClass.remove(this.addPointBtn, 'drawPointBtn-active');
      if (this._restrictFocusOnAddCenterPointBtn) {
        this._restrictFocusOnAddCenterPointBtn = false;
      } else {
        focusUtil.focus(this.addPointBtn);
      }
    },

    /*
     *
     */
    clearGraphics: function () {
      if (this._gl) {
        this._gl.clear();
        this.coordTool.clear();
        this._textGL.clear();
      }
      this.tabSwitched();
      dojoDomClass.remove(this.addPointBtn, 'drawPointBtn-active');
      this.currentEllipse = null;
      this.checkValidInputs();
      //refresh each of the feature/graphic layers to enusre labels are removed
      for (var j = 0; j < this.map.graphicsLayerIds.length; j++) {
        this.map.getLayer(this.map.graphicsLayerIds[j]).refresh();
      }
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
     * Creates a temporary center point on the map
     */
    createCenterPointGraphic: function () {
      if (this.centerPointGraphic !== null) {
        this._gl.remove(this.centerPointGraphic);
      }
      var centerPoint = this.coordTool.inputCoordinate.coordinateEsriGeometry;
      if (centerPoint) {
        this.centerPointGraphic = new EsriGraphic(
          centerPoint, new EsriSimpleMarkerSymbol()
        );
        this._gl.add(this.centerPointGraphic);
      }
    },

    /*
     * Removes the center point graphic
     */
    removeCenterPointGraphic: function () {
      if (this.centerPointGraphic) {
        this._gl.remove(this.centerPointGraphic);
      }
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
     * Activate the ok button if all the requried inputs are valid
     */
    checkValidInputs: function () {
      dojoDomClass.add(this.okButton, 'jimu-state-disabled');
      dojoDomAttr.set(this.okButton, "tabindex", -1);
      if (this.coordTool.inputCoordinate.coordinateEsriGeometry !== null &&
        this.majorAxisInput.isValid() && this.minorAxisInput.isValid() && this.angleInput.isValid()) {
        dojoDomClass.remove(this.okButton, 'jimu-state-disabled');
        dojoDomAttr.set(this.okButton, "tabindex", 0);
      }
      this.okButton.innerHTML = (this.interactiveEllipse.checked) ? this.nls.publishDDBtn : this.nls.common.ok;
    },

    /*
     * Make sure any active tools are deselected to prevent multiple actions being performed
     */
    tabSwitched: function () {
      this.dt.deactivate();
      this.dt.cleanup();
      this.dt.disconnectOnMouseMoveHandler();
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

    /**
     * This function is used to set first focus node
     */
    setFirstFocusNode: function () {
      jimuUtils.initFirstFocusNode(this.domNodeObj, this.ellipseType.domNode);
    },

    /**
     * This function is used to set focus on first node of selected tab
     */
    focusFirstNodeOfSelectedTab: function () {
      focusUtil.focus(this.ellipseType.focusNode);
    },

    /**
     * This function is used to set the last focus node
     */
    setLastFocusNode: function () {
      jimuUtils.initLastFocusNode(this.domNodeObj, this.clearGraphicsButton);
    }
  });
});