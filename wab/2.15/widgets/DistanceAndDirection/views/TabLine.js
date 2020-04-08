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
/*global define*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/kernel',
  'dojo/on',
  'dojo/topic',
  'dojo/has',
  'dojo/touch',
  'dojo/dom-class',
  'dojo/string',
  'dojo/mouse',
  'dojo/number',
  'dojo/keys',
  'dojo/dom-attr',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/TooltipDialog',
  'dijit/popup',
  'jimu/dijit/Message',
  'jimu/LayerInfos/LayerInfos',
  'jimu/utils',
  'esri/layers/GraphicsLayer',
  'esri/layers/FeatureLayer',
  'esri/layers/LabelClass',
  'esri/tasks/FeatureSet',
  'esri/geometry/geometryEngine',
  'esri/geometry/Polyline',
  'esri/geometry/Circle',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/TextSymbol',
  'esri/graphic',
  '../models/LineFeedback',
  '../models/ShapeModel',
  '../views/CoordinateInput',
  '../views/EditOutputCoordinate',
  '../models/DirectionalLineSymbol',
  'dojo/text!../templates/TabLine.html',
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
  dojoDomClass,
  dojoString,
  dojoMouse,
  dojoNumber,
  dojoKeys,
  dojoDomAttr,
  dijitWidgetBase,
  dijitTemplatedMixin,
  dijitWidgetsInTemplate,
  DijitTooltipDialog,
  DijitPopup,
  Message,
  jimuLayerInfos,
  jimuUtils,
  EsriGraphicsLayer,
  EsriFeatureLayer,
  EsriLabelClass,
  EsriFeatureSet,
  EsriGeometryEngine,
  EsriPolyline,
  EsriCircle,
  EsriSimpleMarkerSymbol,
  EsriTextSymbol,
  EsriGraphic,
  DrawFeedBack,
  ShapeModel,
  CoordInput,
  EditOutputCoordinate,
  DirectionalLineSymbol,
  templateStr,
  focusUtil,
  Event,
  dojoAspect
) {
  'use strict';
  return dojoDeclare([dijitWidgetBase, dijitTemplatedMixin, dijitWidgetsInTemplate], {
    templateString: templateStr,
    baseClass: 'jimu-widget-TabLine',
    _restrictFocusOnAddStartPointBtn: false,
    _restrictFocusOnEndStartPointBtn: false,
    _startPointInputKeyPressed: false,
    _endPointInputKeyPressed: false,

    constructor: function (args) {
      dojoDeclare.safeMixin(this, args);
    },

    postCreate: function () {
      this._restrictFocusOnAddStartPointBtn = false;
      this._restrictFocusOnEndStartPointBtn = false;
      this._startPointInputKeyPressed = false;
      this._endPointInputKeyPressed = false;
      this.currentLengthUnit = this.lengthUnitDD.get('value');

      this.currentAngleUnit = this.angleUnitDD.get('value');

      //Create the directional line symbol with basic polyline params
      var basicOptions = {
        directionSymbol: "arrow1",
        directionPixelBuffer: 100000,
        showStartSymbol: true,
        showEndSymbol: true
      };
      basicOptions = dojoLang.mixin(basicOptions, this.lineSymbol);
      this._lineSym = new DirectionalLineSymbol(basicOptions);

      this._ptSym = new EsriSimpleMarkerSymbol(this.pointSymbol);

      this._labelSym = new EsriTextSymbol(this.labelSymbol);

      this._tsGL = new EsriGraphicsLayer();
      this.map.addLayer(this._tsGL);

      this.map.addLayer(this.getLayer());

      //must ensure the layer is loaded before we can access it to turn on the labels
      if (this._gl.loaded) {
        var featureLayerInfo =
          jimuLayerInfos.getInstanceSync().getLayerInfoById('Distance & Direction - Line Graphics');
        featureLayerInfo.showLabels();
        featureLayerInfo.enablePopup();
      } else {
        this._gl.on("load", dojoLang.hitch(this, function () {
          var featureLayerInfo =
            jimuLayerInfos.getInstanceSync().getLayerInfoById('Distance & Direction - Line Graphics');
          featureLayerInfo.showLabels();
          featureLayerInfo.enablePopup();
        }));
      }

      this.coordToolStart = new CoordInput({
        appConfig: this.appConfig,
        nls: this.nls,
        'aria-label': this.nls.startPointLabel
      }, this.startPointCoordsLine);

      this.coordToolStart.inputCoordinate.formatType = 'DD';

      this.coordToolEnd = new CoordInput({
        appConfig: this.appConfig,
        nls: this.nls,
        'aria-label': this.nls.endPointLabel
      }, this.endPointCoordsLine);

      this.coordToolEnd.inputCoordinate.formatTyp = 'DD';

      this.coordinateFormatStart = new DijitTooltipDialog({
        content: new EditOutputCoordinate({
          nls: this.nls
        }),
        style: 'width: 400px'
      });

      dojoAspect.after(this.coordinateFormatStart, "onClose", dojoLang.hitch(this, function () {
        focusUtil.focus(this.coordinateFormatButtonStart);
        if (this._restrictFocusOnAddStartPointBtn) {
          var startPointValue = this.coordToolStart.getValue();
          if (startPointValue === '' || startPointValue === null || startPointValue === undefined) {
            this._restrictFocusOnAddStartPointBtn = false;
          }
        }
      }));

      if (this.appConfig.theme.name === 'DartTheme') {
        dojoDomClass.add(this.coordinateFormatStart.domNode, 'dartThemeClaroDijitTooltipContainerOverride');
      }

      this.coordinateFormatEnd = new DijitTooltipDialog({
        content: new EditOutputCoordinate({
          nls: this.nls
        }),
        style: 'width: 400px'
      });

      dojoAspect.after(this.coordinateFormatEnd, "onClose", dojoLang.hitch(this, function () {
        focusUtil.focus(this.coordinateFormatButtonEnd);
        if (this._restrictFocusOnEndStartPointBtn) {
          var endPointValue = this.coordToolEnd.getValue();
          if (endPointValue === '' || endPointValue === null || endPointValue === undefined) {
            this._restrictFocusOnEndStartPointBtn = false;
          }
        }
      }));

      if (this.appConfig.theme.name === 'DartTheme') {
        dojoDomClass.add(this.coordinateFormatEnd.domNode, 'dartThemeClaroDijitTooltipContainerOverride');
      }

      // add start and endpoint toolbars
      this.dtStart = new DrawFeedBack({
        appConfig: this.appConfig,
        map: this.map,
        coordTool: this.coordToolStart.inputCoordinate.util,
        nls: this.nls
      });
      this.dtEnd = new DrawFeedBack({
        appConfig: this.appConfig,
        map: this.map,
        coordTool: this.coordToolStart.inputCoordinate.util,
        nls: this.nls
      });

      this.dtStart.setLineSymbol(this._lineSym);

      this.lineTypeDDDidChange();
      this.syncEvents();

      this.lengthInput.invalidMessage = this.nls.numericInvalidMessage;
      this.lengthInput.rangeMessage = this.nls.lineLengthErrorMessage;

      this.angleInput.invalidMessage = this.nls.numericInvalidMessage;
      this.angleInput.rangeMessage = this.nls.orientationErrorMessage;
    },

    /*
     * upgrade graphicslayer so we can use the label params
     */
    getLayer: function () {
      if (!this._gl) {
        var layerDefinition = {
          'geometryType': 'esriGeometryPolyline',
          'objectIdField': 'ObjectID',
          'fields': [{
            "name": "ObjectID",
            "alias": "ObjectID",
            "type": "esriFieldTypeOID"
          }, {
            'name': 'GeoLength',
            'type': 'esriFieldTypeString',
            'alias': 'Length'
          }, {
            'name': 'LineAngle',
            'type': 'esriFieldTypeString',
            'alias': 'Angle'
          }]
        };

        var lblexp = {
          'labelExpressionInfo': {
            'value': this.nls.lengthLabel + ': {GeoLength}'
          }
        };
        var lblClassLength = new EsriLabelClass(lblexp);
        lblClassLength.labelPlacement = 'above-along';
        lblClassLength.where = "GeoLength > 0";
        lblClassLength.symbol = this._labelSym.setOffset(0, 10);

        lblexp = {
          'labelExpressionInfo': {
            'value': this.nls.angleLabel + ': {LineAngle}'
          }
        };
        var lblClassAngle = new EsriLabelClass(lblexp);
        lblClassAngle.labelPlacement = 'below-along';
        lblClassAngle.where = "LineAngle > 0";
        lblClassAngle.symbol = dojoLang.clone(this._labelSym).setOffset(0, -10);

        var featureCollection = {
          layerDefinition: layerDefinition,
          featureSet: new EsriFeatureSet()
        };

        this._gl = new EsriFeatureLayer(featureCollection, {
          id: 'Distance & Direction - Line Graphics',
          outFields: ["*"],
          showLabels: true
        });
        this.own(dojoOn(this._gl, "visibility-change", dojoLang.hitch(this, function (o) {
          this._tsGL.setVisibility(o.visible);
        })));
        //this._gl.setLabelingInfo([lblClassLength, lblClassAngle]);

        return this._gl;
      }
    },

    /*
     * Start up event listeners
     */
    syncEvents: function () {

      dojoTopic.subscribe('TAB_SWITCHED', dojoLang.hitch(this, this.tabSwitched));
      dojoTopic.subscribe("DD-WIDGET-CLOSED", dojoLang.hitch(this, this._closeDijit));
      dojoTopic.subscribe(DrawFeedBack.drawnLineLengthDidChange, dojoLang.hitch(this, this.lineLengthDidChange));
      dojoTopic.subscribe(DrawFeedBack.drawnLineAngleDidChange, dojoLang.hitch(this, this.lineAngleDidChange));

      this.dtStart.watch('startPoint', dojoLang.hitch(this, function (r, ov, nv) {
        this.dtStart.addStartGraphic(nv, this._ptSym);
      }));

      this.dtStart.watch('startPointDD', dojoLang.hitch(this, function (r, ov, nv) {
        this.coordToolStart.inputCoordinate.set('coordinateEsriGeometry', nv);
        this.coordToolStart.inputCoordinate.set('inputType', this.coordToolStart.inputCoordinate.formatType);
      }));

      this.dtStart.watch('endPointDD', dojoLang.hitch(this, function (r, ov, nv) {
        this.coordToolEnd.inputCoordinate.set('coordinateEsriGeometry', nv);
        this.coordToolEnd.inputCoordinate.set('inputType', this.coordToolEnd.inputCoordinate.formatType);
      }));

      this.dtStart.on('draw-complete', dojoLang.hitch(this, this.feedbackDidCompleteStart));

      this.coordToolStart.inputCoordinate.watch('outputString', dojoLang.hitch(this, function (r, ov, nv) {
        if (!this.coordToolStart.manualInput) {
          this.currentLine = null;
          this.coordToolStart.set('value', nv);
          if (this._restrictFocusOnAddStartPointBtn) {
            this._restrictFocusOnAddStartPointBtn = false;
          } else if (this._startPointInputKeyPressed) {
            this._startPointInputKeyPressed = false;
          } else {
            focusUtil.focus(this.addPointBtnStart);
          }
        }
      }));

      this.coordToolStart.on('keydown', dojoLang.hitch(this, this.coordToolStartKeyWasPressed));

      this.dtEnd.watch('startPoint', dojoLang.hitch(this, function (r, ov, nv) {
        this.dtEnd.addStartGraphic(nv, this._ptSym);
      }));
      this.dtEnd.watch('endPoint', dojoLang.hitch(this, function (r, ov, nv) {
        this.dtEnd.addStartGraphic(nv, this._ptSym);
      }));

      this.dtEnd.watch('startPointDD', dojoLang.hitch(this, function (r, ov, nv) {
        this.coordToolEnd.inputCoordinate.set('coordinateEsriGeometry', nv);
        this.coordToolEnd.inputCoordinate.set('inputType', this.coordToolEnd.inputCoordinate.formatType);
      }));

      this.dtEnd.watch('endPointDD', dojoLang.hitch(this, function (r, ov, nv) {
        this.coordToolEnd.inputCoordinate.set('coordinateEsriGeometry', nv);
        this.coordToolEnd.inputCoordinate.set('inputType', this.coordToolEnd.inputCoordinate.formatType);
      }));

      this.dtEnd.on('draw-complete', dojoLang.hitch(this, this.feedbackDidCompleteEnd));

      this.coordToolEnd.inputCoordinate.watch('outputString', dojoLang.hitch(this, function (r, ov, nv) {
        if (!this.coordToolEnd.manualInput) {
          this.coordToolEnd.set('value', nv);
          //Added this code to update the graphic with proper endpoint attr
          //As we are projecting points the async request will take time
          //and the feedbackdidcomplete event will be fired before settig the end point
          if (this.currentLine && this.currentLine.graphic &&
            this.currentLine.graphic.attributes &&
            this.currentLine.graphic.attributes.EndPoint === "") {
            this.currentLine.graphic.attributes.EndPoint = this.coordToolEnd.getValue();
          }
          if (this._restrictFocusOnEndStartPointBtn) {
            this._restrictFocusOnEndStartPointBtn = false;
          } else if (this._endPointInputKeyPressed) {
            this._endPointInputKeyPressed = false;
          } else {
            focusUtil.focus(this.addPointBtnEnd);
          }
        }
      }));

      this.coordToolEnd.on('keydown', dojoLang.hitch(this, this.coordToolEndKeyWasPressed));

      this.lengthUnitDD.on('change', dojoLang.hitch(this, this.lengthUnitDDDidChange));

      this.angleUnitDD.on('change', dojoLang.hitch(this, this.angleUnitDDDidChange));

      this.lineTypeDD.on('change', dojoLang.hitch(this, this.lineTypeDDDidChange));

      this.own(
        dojoOn(this.coordinateFormatButtonStart, 'click',
          dojoLang.hitch(this, this.coordinateFormatButtonStartClicked)),
        dojoOn(this.coordinateFormatButtonStart, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.coordinateFormatButtonStartClicked();
          }
        })),

        dojoOn(this.coordinateFormatStart.content.applyButton, 'click', dojoLang.hitch(this, function () {
          this._restrictFocusOnAddStartPointBtn = true;
          var fs = this.coordinateFormatStart.content.formats[this.coordinateFormatStart.content.ct];
          var cfs = fs.defaultFormat;
          var fv = this.coordinateFormatStart.content.frmtSelect.get('value');
          if (fs.useCustom) {
            cfs = fs.customFormat;
          }
          this.coordToolStart.inputCoordinate.set(
            'formatPrefix',
            this.coordinateFormatStart.content.addSignChkBox.checked
          );
          this.coordToolStart.inputCoordinate.set('formatString', cfs);
          this.coordToolStart.inputCoordinate.set('formatType', fv);
          this.setCoordLabelStart(fv);
          DijitPopup.close(this.coordinateFormatStart);
          focusUtil.focus(this.coordinateFormatButtonStart);
        })),
        dojoOn(this.coordinateFormatStart.content.applyButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this._restrictFocusOnAddStartPointBtn = true;
            var fs = this.coordinateFormatStart.content.formats[this.coordinateFormatStart.content.ct];
            var cfs = fs.defaultFormat;
            var fv = this.coordinateFormatStart.content.frmtSelect.get('value');
            if (fs.useCustom) {
              cfs = fs.customFormat;
            }
            this.coordToolStart.inputCoordinate.set(
              'formatPrefix',
              this.coordinateFormatStart.content.addSignChkBox.checked
            );
            this.coordToolStart.inputCoordinate.set('formatString', cfs);
            this.coordToolStart.inputCoordinate.set('formatType', fv);
            this.setCoordLabelStart(fv);
            DijitPopup.close(this.coordinateFormatStart);
            focusUtil.focus(this.coordinateFormatButtonStart);
          }
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatStart);
            focusUtil.focus(this.coordinateFormatButtonStart);
          }
        })),

        dojoOn(this.coordinateFormatStart.content.cancelButton, 'click', dojoLang.hitch(this, function () {
          DijitPopup.close(this.coordinateFormatStart);
        })),
        dojoOn(this.coordinateFormatStart.content.cancelButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatStart);
            focusUtil.focus(this.coordinateFormatButtonStart);
          }
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatStart);
            focusUtil.focus(this.coordinateFormatButtonStart);
          }
        })),

        dojoOn(this.coordinateFormatButtonEnd, 'click', dojoLang.hitch(this, this.coordinateFormatButtonEndClicked)),
        dojoOn(this.coordinateFormatButtonEnd, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.coordinateFormatButtonEndClicked();
          }
        })),

        dojoOn(this.coordinateFormatEnd.content.applyButton, 'click', dojoLang.hitch(this, function () {
          this._restrictFocusOnEndStartPointBtn = true;
          var fs = this.coordinateFormatEnd.content.formats[this.coordinateFormatEnd.content.ct];
          var cfs = fs.defaultFormat;
          var fv = this.coordinateFormatEnd.content.frmtSelect.get('value');
          if (fs.useCustom) {
            cfs = fs.customFormat;
          }
          this.coordToolEnd.inputCoordinate.set(
            'formatPrefix',
            this.coordinateFormatEnd.content.addSignChkBox.checked
          );
          this.coordToolEnd.inputCoordinate.set('formatString', cfs);
          this.coordToolEnd.inputCoordinate.set('formatType', fv);
          this.setCoordLabelEnd(fv);
          DijitPopup.close(this.coordinateFormatEnd);
          focusUtil.focus(this.coordinateFormatButtonEnd);
        })),
        dojoOn(this.coordinateFormatEnd.content.applyButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this._restrictFocusOnEndStartPointBtn = true;
            var fs = this.coordinateFormatEnd.content.formats[this.coordinateFormatEnd.content.ct];
            var cfs = fs.defaultFormat;
            var fv = this.coordinateFormatEnd.content.frmtSelect.get('value');
            if (fs.useCustom) {
              cfs = fs.customFormat;
            }
            this.coordToolEnd.inputCoordinate.set(
              'formatPrefix',
              this.coordinateFormatEnd.content.addSignChkBox.checked
            );
            this.coordToolEnd.inputCoordinate.set('formatString', cfs);
            this.coordToolEnd.inputCoordinate.set('formatType', fv);
            this.setCoordLabelEnd(fv);
            DijitPopup.close(this.coordinateFormatEnd);
            focusUtil.focus(this.coordinateFormatButtonEnd);
          }
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatEnd);
            focusUtil.focus(this.coordinateFormatButtonEnd);
          }
        })),

        dojoOn(this.coordinateFormatEnd.content.cancelButton, 'click', dojoLang.hitch(this, function () {
          DijitPopup.close(this.coordinateFormatEnd);
        })),
        dojoOn(this.coordinateFormatEnd.content.cancelButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatEnd);
            focusUtil.focus(this.coordinateFormatButtonEnd);
          }
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatEnd);
            focusUtil.focus(this.coordinateFormatButtonEnd);
          }
        })),

        dojoOn(this.addPointBtnStart, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.addStartPointButtonClicked();
          }
        })),

        dojoOn(this.addPointBtnEnd, 'click', dojoLang.hitch(this, this.addEndPointButtonClicked)),
        dojoOn(this.addPointBtnEnd, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.addEndPointButtonClicked();
          }
        })),

        dojoOn(this.interactiveLine, 'change', dojoLang.hitch(this, this.interactiveCheckBoxChanged)),

        dojoOn(this.interactiveLine, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER) {
            if (this.interactiveLine.checked) {
              this.interactiveLine.checked = false;
            } else {
              this.interactiveLine.checked = true;
            }
            this.interactiveCheckBoxChanged();
          }
        })),

        dojoOn(this.okButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.okButtonClicked();
          }
        })),

        dojoOn(this.clearGraphicsButton, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ENTER || evt.keyCode === dojoKeys.SPACE) {
            Event.stop(evt);
            this.clearGraphics();
          }
        })),

        dojoOn(this.coordinateFormatStart.content.frmtSelect, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatStart);
            focusUtil.focus(this.coordinateFormatButtonStart);
          }
        })),

        dojoOn(this.coordinateFormatStart.content.frmtVal, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatStart);
            focusUtil.focus(this.coordinateFormatButtonStart);
          }
        })),

        dojoOn(this.coordinateFormatStart.content.addSignChkBox, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatStart);
            focusUtil.focus(this.coordinateFormatButtonStart);
          }
          if (evt.keyCode === dojoKeys.ENTER) {
            Event.stop(evt);
            if (this.coordinateFormatStart.content.addSignChkBox.checked) {
              this.coordinateFormatStart.content.addSignChkBox.checked = false;
            } else {
              this.coordinateFormatStart.content.addSignChkBox.checked = true;
            }
          }
        })),

        dojoOn(this.coordinateFormatEnd.content.frmtSelect, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatEnd);
            focusUtil.focus(this.coordinateFormatButtonEnd);
          }
        })),

        dojoOn(this.coordinateFormatEnd.content.frmtVal, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatEnd);
            focusUtil.focus(this.coordinateFormatButtonEnd);
          }
        })),

        dojoOn(this.coordinateFormatEnd.content.addSignChkBox, 'keydown', dojoLang.hitch(this, function (evt) {
          if (evt.keyCode === dojoKeys.ESCAPE) {
            Event.stop(evt);
            DijitPopup.close(this.coordinateFormatEnd);
            focusUtil.focus(this.coordinateFormatButtonEnd);
          }
          if (evt.keyCode === dojoKeys.ENTER) {
            Event.stop(evt);
            if (this.coordinateFormatEnd.content.addSignChkBox.checked) {
              this.coordinateFormatEnd.content.addSignChkBox.checked = false;
            } else {
              this.coordinateFormatEnd.content.addSignChkBox.checked = true;
            }
          }
        })),

        dojoOn(this.lengthInputDiv, dojoMouse.leave, dojoLang.hitch(this, this.checkValidInputs)),

        dojoOn(this.angleInputDiv, dojoMouse.leave, dojoLang.hitch(this, this.checkValidInputs))
      );

      if (dojoHas("esri-touch")) {
        this.own(dojoOn(this.addPointBtnStart, dojoTouch.press, dojoLang.hitch(this, this.addStartPointButtonClicked)));
      } else {
        this.own(dojoOn(this.addPointBtnStart, 'click', dojoLang.hitch(this, this.addStartPointButtonClicked)));
      }
    },

    /*
     * length value change
     */
    lineLengthDidChange: function (r) {
      var frmtdLength = dojoNumber.format(r, {
        places: 2,
        locale: dojoKernel.locale
      });
      this.lengthInput.set('value', frmtdLength);
    },

    /*
     * angle value change
     */
    lineAngleDidChange: function (r) {
      var formatAngle = dojoNumber.format(r, {
        places: 2,
        locale: dojoKernel.locale
      });
      this.angleInput.set('value', formatAngle);
    },

    /*
     * checkbox changed
     */
    interactiveCheckBoxChanged: function () {
      this.tabSwitched();
      this.coordToolEnd.set('disabled', this.interactiveLine.checked);
      if (this.interactiveLine.checked) {
        dojoDomClass.add(this.addPointBtnEndDiv, 'controlGroupHidden');
        this.addPointBtnStart.title = this.nls.drawLineLabel;
        this.addPointBtnEnd.hidden = true;
      } else {
        this.coordToolEnd.clear();
        this.addPointBtnStart.title = this.nls.addPointLabel;
        dojoDomClass.remove(this.addPointBtnEndDiv, 'controlGroupHidden');
        this.addPointBtnEnd.hidden = false;
      }
      this.checkValidInputs();
    },

    /*
     * update the UI to reflect current state
     */
    lineTypeDDDidChange: function () {
      if (this.lineTypeDD.get('value') === 'Points') {
        this.addPointBtnStart.title = this.nls.addPointLabel;
        this.coordToolEnd.set('disabled', false);
        this.angleInput.set('disabled', true);
        this.lengthInput.set('disabled', true);
        this.interactiveLine.disabled = false;
        dojoDomClass.remove(this.addPointBtnEndDiv, 'controlGroupHidden');
        dojoDomClass.remove(this.interactiveLabel, 'disabledLabel');
        this.addPointBtnEnd.hidden = false;
      } else {
        this.addPointBtnStart.title = this.nls.addPointLabel;
        this.interactiveLine.disabled = true;
        if (this.interactiveLine.checked) {
          this.interactiveLine.checked = false;
        }
        this.coordToolEnd.set('value', '');
        this.coordToolEnd.set('disabled', true);
        this.angleInput.set('disabled', false);
        this.lengthInput.set('disabled', false);
        dojoDomClass.add(this.addPointBtnEndDiv, 'controlGroupHidden');
        dojoDomClass.add(this.interactiveLabel, 'disabledLabel');
        this.addPointBtnEnd.hidden = true;
      }
      this.checkValidInputs();
    },

    /*
     *
     */
    coordinateFormatButtonStartClicked: function () {
      this.coordinateFormatStart.content.set('ct', this.coordToolStart.inputCoordinate.formatType);
      DijitPopup.open({
        popup: this.coordinateFormatStart,
        around: this.coordinateFormatButtonStart
      });
      focusUtil.focus(this.coordinateFormatStart.content.frmtSelect.focusNode);
    },

    /*
     * If parent widget is closed, close this dijit
     */
    _closeDijit: function () {
      if (this.coordinateFormatStart && this.coordinateFormatStart.domNode.offsetParent) {
        DijitPopup.close(this.coordinateFormatStart);
      }
      if (this.coordinateFormatEnd && this.coordinateFormatEnd.domNode.offsetParent) {
        DijitPopup.close(this.coordinateFormatEnd);
      }
    },

    /*
     *
     */
    coordinateFormatButtonEndClicked: function () {
      this.coordinateFormatEnd.content.set('ct', this.coordToolEnd.inputCoordinate.formatType);
      DijitPopup.open({
        popup: this.coordinateFormatEnd,
        around: this.coordinateFormatButtonEnd
      });
      focusUtil.focus(this.coordinateFormatEnd.content.frmtSelect.focusNode);
    },

    /*
     * catch key press in start point
     */
    coordToolStartKeyWasPressed: function (evt) {
      this.dtStart.removeStartGraphic();
      if (evt.keyCode === dojoKeys.ENTER) {
        this._restrictFocusOnAddStartPointBtn = true;
        this._startPointInputKeyPressed = true;
        this.currentLine = null;
        this.coordToolStart.inputCoordinate.getInputType().then(dojoLang.hitch(this, function (r) {
          if (r.inputType === "UNKNOWN") {
            var alertMessage = new Message({
              message: this.nls.invalidCoordinateTypeMessage
            });
            this.coordToolStart.inputCoordinate.coordinateEsriGeometry = null;
            this.checkValidInputs();
          } else {
            this.dtStart.getProjectedGeometry(r.coordinateEsriGeometry, this.map.spatialReference).then(
              dojoLang.hitch(this, dojoLang.hitch(this, function (projectedGeometry) {
                this.dtStart.onLineStartManualInputHandler(projectedGeometry);
                this.setCoordLabelStart(r.inputType);
                var fs = this.coordinateFormatStart.content.formats[r.inputType];
                this.coordToolStart.inputCoordinate.set('formatString', fs.defaultFormat);
                this.coordToolStart.inputCoordinate.set('formatType', r.inputType);
                this.dtStart.addStartGraphic(projectedGeometry, this._ptSym);
                this.checkValidInputs();
              })));
          }
        }));
      }
    },

    /*
     * catch key press in end point
     */
    coordToolEndKeyWasPressed: function (evt) {
      this.dtEnd.removeStartGraphic();
      if (evt.keyCode === dojoKeys.ENTER) {
        this._restrictFocusOnEndStartPointBtn = true;
        this._endPointInputKeyPressed = true;
        this.currentLine = null;
        this.coordToolEnd.inputCoordinate.getInputType().then(dojoLang.hitch(this, function (r) {
          if (r.inputType === "UNKNOWN") {
            var alertMessage = new Message({
              message: this.nls.invalidCoordinateTypeMessage
            });
            this.coordToolEnd.inputCoordinate.coordinateEsriGeometry = null;
            this.checkValidInputs();
          } else {
            this.dtEnd.getProjectedGeometry(r.coordinateEsriGeometry, this.map.spatialReference).then(
              dojoLang.hitch(this, dojoLang.hitch(this, function (projectedGeometry) {
                this.dtEnd.onLineStartManualInputHandler(projectedGeometry);
                this.setCoordLabelEnd(r.inputType);
                var fs = this.coordinateFormatEnd.content.formats[r.inputType];
                this.coordToolEnd.inputCoordinate.set('formatString', fs.defaultFormat);
                this.coordToolEnd.inputCoordinate.set('formatType', r.inputType);
                this.dtEnd.addStartGraphic(projectedGeometry, this._ptSym);
                this.checkValidInputs();
              })));
          }
        }));
      }
    },

    /*
     *
     */
    setCoordLabelStart: function (toType) {
      var lineStartPointLabelValue = jimuUtils.sanitizeHTML(dojoString.substitute(
        this.nls.startPointLabel + ' (${crdType})', {
          crdType: toType
        }
      ));
      this.lineStartPointLabel.innerHTML = lineStartPointLabelValue;
      dojoDomAttr.set(this.coordToolStart.textbox, 'aria-label', lineStartPointLabelValue);
    },

    /*
     *
     */
    setCoordLabelEnd: function (toType) {
      var lineEndPointLabelValue = jimuUtils.sanitizeHTML(dojoString.substitute(
        this.nls.endPointLabel + ' (${crdType})', {
          crdType: toType
        }
      ));
      this.lineEndPointLabel.innerHTML = lineEndPointLabelValue;
      dojoDomAttr.set(this.coordToolEnd.textbox, 'aria-label', lineEndPointLabelValue);
    },

    /*
     * Activate the ok button if all the requried inputs are valid
     */
    checkValidInputs: function () {
      dojoDomClass.add(this.okButton, 'jimu-state-disabled');
      dojoDomAttr.set(this.okButton, "tabindex", -1);
      if (this.lineTypeDD.get('value') === 'DistAndBearing') {
        if (this.coordToolStart.inputCoordinate.coordinateEsriGeometry !== null &&
          this.lengthInput.isValid() && this.angleInput.isValid()) {
          dojoDomClass.remove(this.okButton, 'jimu-state-disabled');
          dojoDomAttr.set(this.okButton, "tabindex", 0);
        }
      } else {
        if (this.coordToolStart.inputCoordinate.coordinateEsriGeometry !== null &&
          this.coordToolEnd.inputCoordinate.coordinateEsriGeometry !== null) {
          dojoDomClass.remove(this.okButton, 'jimu-state-disabled');
          dojoDomAttr.set(this.okButton, "tabindex", 0);
        }
      }
      this.okButton.innerHTML = (this.interactiveLine.checked) ? this.nls.publishDDBtn : this.nls.common.ok;
    },

    /*
     * Add start button click event, activate feedback tool
     */
    addStartPointButtonClicked: function () {
      if (dojoDomClass.contains(this.addPointBtnStart, 'drawPointBtn-active')) {
        //already selected so deactivate draw tool
        this.dtStart.deactivate();
        this._setMapNavigation(true);
      } else {
        this.tabSwitched();
        this.coordToolStart.manualInput = false;
        this.coordToolEnd.manualInput = false;
        this._setMapNavigation(false);
        if (this.lineTypeDD.get('value') === 'Points' && this.interactiveLine.checked) {
          this.dtStart.activate('polyline');
        } else {
          this.dtStart.activate('point');
        }
      }
      dojoDomClass.toggle(this.addPointBtnStart, 'drawPointBtn-active');
    },

    /*
     * Button click event, activate feedback tool
     */
    addEndPointButtonClicked: function () {
      if (dojoDomClass.contains(this.addPointBtnEnd, 'drawPointBtn-active')) {
        //already selected so deactivate draw tool
        this.dtEnd.deactivate();
        this._setMapNavigation(true);
      } else {
        this.tabSwitched();
        this.coordToolStart.manualInput = false;
        this.coordToolEnd.manualInput = false;
        this._setMapNavigation(false);
        this.dtEnd.activate('point');
      }
      dojoDomClass.toggle(this.addPointBtnEnd, 'drawPointBtn-active');
    },

    /*
     *
     */
    lengthUnitDDDidChange: function () {
      this.currentLengthUnit = this.lengthUnitDD.get('value');
      this.dtStart.set('lengthUnit', this.currentLengthUnit);
    },

    /*
     *
     */
    angleUnitDDDidChange: function () {
      this.currentAngleUnit = this.angleUnitDD.get('value');
      this.dtStart.set('angleUnit', this.currentAngleUnit);
      if (this.currentAngleUnit === "degrees") {
        this.angleInput.constraints.max = 360;
        this.angleInput.rangeMessage = this.nls.degreesRangeMessage;

      } else {
        this.angleInput.constraints.max = 6400;
        this.angleInput.rangeMessage = this.nls.millsRangeMessage;
      }
    },

    /*
     *
     */
    feedbackDidCompleteStart: function (results) {
      if (results.geometry.type === 'polyline') {
        if (this.interactiveLine.checked) {
          results = results.geometry.result;
        }
        if (this.lengthInput.get('value') !== undefined || this.angleInput.get('value') !== undefined) {
          this.currentLine = new ShapeModel(results);
          var geom = null;
          geom = new EsriPolyline({
            paths: this.map.spatialReference.wkid === 4326 ?
              this.currentLine.geographicGeometry.paths : this.currentLine.geometry.paths,
            spatialReference: this.map.spatialReference
          });

          if (this.map.spatialReference.wkid === 4326 || this.map.spatialReference.wkid === 102100) {
            geom = EsriGeometryEngine.geodesicDensify(geom, 10000);
          }
          this.currentLine.graphic = new EsriGraphic(
            geom,
            this._lineSym, {
              'GeoLength': this.lengthInput.get('displayedValue').toString() + " " +
                this.lengthUnitDD.get('displayedValue'),
              'LineAngle': this.angleInput.get('displayedValue').toString() + " " +
                this.angleUnitDD.get('displayedValue'),
              Distance: parseFloat(this.lengthInput.get("value")),
              Unit: this.currentLengthUnit,
              Angle: parseFloat(this.angleInput.get("value")),
              StartPoint: this.coordToolStart.getValue(),
              EndPoint: this.coordToolEnd.getValue(),
              AngleUnit: this.angleUnitDD.get("value")
            }
          );

          var extCenter = results.geometry.getExtent().getCenter();
          //Check for RTL behavior
          var midPt = EsriGeometryEngine.nearestCoordinate(results.geometry, extCenter);
          var labelProps = {
            lengthLabel: this.nls.lengthLabel,
            spacerLabel: " ",
            lengthInputValue: this.lengthInput.get('displayedValue').toString(),
            abbrevLengthLabel: this._getLengthAbbrevation(this.lengthUnitDD.get('value')),
            angleLabel: this.nls.angleLabel,
            angleValue: this.angleInput.get('displayedValue').toString(),
            abbrevAngleLabel: this._getDegreeAbbreviation(this.angleUnitDD.get('value'))
          };
          var lineText = dojoString.substitute((!window.isRTL) ?
            "${lengthLabel}${spacerLabel}${lengthInputValue}${spacerLabel}${abbrevLengthLabel}" :
            "${spacerLabel}${lengthInputValue}${spacerLabel}${abbrevLengthLabel}${spacerLabel}${lengthLabel}",
            labelProps);
          this._tsGL.add(new EsriGraphic(midPt.coordinate,
            dojoLang.clone(this._labelSym).setOffset(0, 30).setText(lineText)));

          lineText = dojoString.substitute((!window.isRTL) ?
            "${angleLabel}${spacerLabel}${angleValue}${spacerLabel}${abbrevAngleLabel}" :
            "${spacerLabel}${angleValue}${spacerLabel}${abbrevAngleLabel}${spacerLabel}${angleLabel}", labelProps);
          this._tsGL.add(new EsriGraphic(midPt.coordinate,
            dojoLang.clone(this._labelSym).setText(lineText)));
          this._gl.add(this.currentLine.graphic);
          this._gl.refresh();
          this.dtStart.removeStartGraphic();
          this.dtEnd.removeStartGraphic();
          //as geom is created based on map spatial ref we can get it's extent directly
          var ext = geom.getExtent().expand(3);
          this.map.setExtent(ext);
          if (this.interactiveLine.checked) {
            dojoDomClass.toggle(this.addPointBtnStart, 'drawPointBtn-active');
          }
        }
      } else {
        dojoDomClass.toggle(this.addPointBtnStart, 'drawPointBtn-active');
      }
      this.checkValidInputs();
      this._setMapNavigation(true);
      this.dtStart.deactivate();
    },

    /*
     *
     */
    feedbackDidCompleteEnd: function (results) {
      this.checkValidInputs();
      this._setMapNavigation(true);
      this.dtEnd.deactivate();
      dojoDomClass.toggle(this.addPointBtnEnd, 'drawPointBtn-active');
      if (this.lineTypeDD.get('value') === 'Points' && !this.interactiveLine.checked &&
        this.coordToolStart.inputCoordinate.coordinateEsriGeometry &&
        this.coordToolEnd.inputCoordinate.coordinateEsriGeometry) {
        this.createManualGraphic();
      }
    },

    /*
     *
     */
    createManualGraphic: function (navigateToPublishPage) {
      var lineLengthMeters;
      var stPt = this.coordToolStart.inputCoordinate.coordinateEsriGeometry;
      var endPt = this.coordToolEnd.inputCoordinate.coordinateEsriGeometry;

      var newGeographicLine =
        new EsriPolyline(this.coordToolStart.inputCoordinate.coordinateEsriGeometry.spatialReference);
      newGeographicLine.addPath([stPt, endPt]);
      //get geodesic length of the line
      lineLengthMeters = EsriGeometryEngine.geodesicLength(newGeographicLine, 9001);
      //get new line in map SR
      this.dtStart.getProjectedGeometry(newGeographicLine, this.map.spatialReference).then(
        dojoLang.hitch(this, function (newLine) {
          this.lengthInput.set('value', this.dtStart.coordTool.convertMetersToUnits(lineLengthMeters,
            this.lengthUnitDD.get('value')));
          this.angleInput.set('value', this.dtStart.getAngle(stPt, endPt));

          this.map.setExtent(newLine.getExtent().expand(3));

          this.feedbackDidCompleteStart({
            geometry: newLine,
            geographicGeometry: newGeographicLine
          });

          this.dtStart.clearPoints();
          this.dtEnd.clearPoints();
          if (navigateToPublishPage) {
            this.emit('show-publish', this._gl);
          }
        }));
    },

    /*
     *
     */
    okButtonClicked: function (evt) {
      if (!dojoDomClass.contains(this.okButton, "jimu-state-disabled")) {
        this._restrictFocusOnAddStartPointBtn = true;
        this._restrictFocusOnEndStartPointBtn = true;
        //if interactive line is created or current line exist we dont have to recreate it
        //just navigate to publish screen
        if (this.currentLine) {
          this.emit('show-publish', this._gl);
          return;
        }

        if (this.lineTypeDD.get('value') === 'Points') {
          this.createManualGraphic(true);
        } else {

          var stPt = this.coordToolStart.inputCoordinate.coordinateEsriGeometry;

          var l = this.coordToolStart.inputCoordinate.util.convertToMeters(this.lengthInput.get('value'),
            this.lengthUnitDD.get('value'));

          var tempcircle = new EsriCircle(stPt, {
            geodesic: true,
            radius: l,
            numberOfPoints: 64000
          });

          var currentAngle = this.angleInput.get('value');
          currentAngle = (this.currentAngleUnit === 'degrees') ? parseInt(10 * currentAngle * 17.777777778, 10) :
            parseInt(10 * currentAngle, 10);
          var fpc = tempcircle.getPoint(0, currentAngle);

          var newLine = new EsriPolyline();
          newLine.addPath([stPt, fpc]);

          this.dtStart.getProjectedGeometry(newLine, this.map.spatialReference).then(
            dojoLang.hitch(this, function (newLineInMapSr) {
              this.feedbackDidCompleteStart({
                geometry: newLineInMapSr,
                geographicGeometry: newLine
              });
              this.emit('show-publish', this._gl);
            }));
          this.coordToolEnd.inputCoordinate.set('coordinateEsriGeometry', fpc);
        }
      }
    },

    /*
     *
     */
    clearGraphics: function () {
      if (this._gl) {
        this._gl.clear();
        this._tsGL.clear();
        this.dtStart.removeStartGraphic();
        this.dtEnd.removeStartGraphic();
        this.coordToolStart.clear();
        this.coordToolEnd.clear();
        this.tabSwitched();
      }
      this.currentLine = null;
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
     * Make sure any active tools are deselected to prevent multiple actions being performed
     */
    tabSwitched: function () {
      this.dtStart.deactivate();
      this.dtEnd.deactivate();
      this._setMapNavigation(true);
      if (this.addPointBtnStart) {
        dojoDomClass.remove(this.addPointBtnStart, 'drawPointBtn-active');
      }
      if (this.addPointBtnEnd) {
        dojoDomClass.remove(this.addPointBtnEnd, 'drawPointBtn-active');
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
      jimuUtils.initFirstFocusNode(this.domNodeObj, this.lineTypeDD.focusNode);
    },

    /**
     * This function is used to set focus on first node of selected tab
     */
    focusFirstNodeOfSelectedTab: function () {
      focusUtil.focus(this.lineTypeDD.focusNode);
    },

    /**
     * This function is used to set the last focus node
     */
    setLastFocusNode: function () {
      jimuUtils.initLastFocusNode(this.domNodeObj, this.clearGraphicsButton);
    }
  });
});