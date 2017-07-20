///////////////////////////////////////////////////////////////////////////
// Copyright (c) 2016 Esri. All Rights Reserved.
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
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/dom-attr',
  'dojo/dom-class',
  'dojo/dom-style',
  'dojo/string',
  'dojo/topic',
  'dojo/keys',
  'dojo/dom',
  'dojo/dom-construct',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/registry',
  'dijit/Tooltip',
  'dijit/TooltipDialog',
  'dijit/popup',
  'dojo/text!./CoordinateControl.html',
  'esri/geometry/webMercatorUtils',
  'esri/graphic',
  'esri/geometry/Point',
  'esri/SpatialReference',
  './util',
  'jimu/dijit/Message',
  './EditOutputCoordinate',
  './dialogConfirm',
  './ConfirmNotation',
  'dijit/form/TextBox',
  'dijit/form/Textarea',
  'dijit/form/Select',
  'dijit/InlineEditBox'
], function (
  dojoDeclare,
  dojoArray,
  dojoLang,
  dojoOn,
  dojoDomAttr,
  dojoDomClass,
  dojoDomStyle,
  dojoString,
  dojoTopic,
  dojoKeys,
  dojoDom,
  dojoDomConstruct,
  dijitWidgetBase,
  dijitTemplatedMixin,
  dijitWidgetsInTemplate,
  dijitRegistry,
  dijitTooltip,
  DijitTooltipDialog,
  dijitPopup,
  coordCntrl,
  esriWMUtils,
  EsriGraphic,
  EsriPoint,
  EsriSpatialReference,
  Util,
  JimuMessage,
  CoordFormat,
  DialogConfirm,
  ConfirmNotation
) {
  'use strict';
  return dojoDeclare([dijitWidgetBase, dijitTemplatedMixin, dijitWidgetsInTemplate], {
    templateString: coordCntrl,
    baseClass: 'jimu-widget-cc',
    input: true,
    inputFromText: false,
    hasCustomLabel: false,
    widgetInfo: null,
    /**** type: 'dd', Available Types: DD, DDM, DMS, GARS, GEOREF, MGRS, USNG, UTM, UTM (H)****/

    /**
     *
     **/
    constructor: function (args) {
      dojoDeclare.safeMixin(this, args);
      this.uid = args.id || dijitRegistry.getUniqueId('cc');
    },

    /**
     *
     **/
    parentStateDidChange: function (info) {
      if (info.state === 'opened' || info.state === 'active') {
        this.mapclickhandler.resume();
      } else {
        this.mapclickhandler.pause();
      }
      this.widgetInfo = {
        widgetState: info.state,
        themeName: info.themeName,
        isActive: info.isActive
      };
    },

    /**
     *
     **/
    postCreate: function () {

      // set initial value of coordinate type dropdown
      //this.typeSelect.set('value', this.type);

      this._frmtdlg = new DijitTooltipDialog({
        id: this.uid + '_formatCoordinateTooltip',
        content: new CoordFormat({ nls: this.nls }),
        style: 'width: 400px',
        onClose: dojoLang.hitch(this, this.popupDidClose)
      });

      if (this.parentWidget.appConfig.theme.name === 'DartTheme') {
        dojoDomClass.add(this._frmtdlg.domNode, 'dartThemeClaroDijitTooltipContainerOverride');
      }

      if (this.defaultFormat) {
        this._frmtdlg.content.formats[this.type].defaultFormat = this.defaultFormat;
      }
      this.setConfig();

      this.initUI();

      // set an initial coord
      if (this.currentClickPoint) {
        this.updateDisplay();
      }
    },

    /**
     *
     **/
    setConfig: function () {
      this.util = new Util({
        appConfig: this.parentWidget.appConfig
      });

      this.geomsrvc = this.util.geomService;

      this.zoomScale = this.parentWidget.config.coordinateconversion.zoomScale || 50000;

    },

    /**
     *
     **/
    initUI: function () {
      // hide any actions we don't want to see on the input coords
      if (this.input) {
        this.setHidden(this.expandButton, true);
        this.setHidden(this.removeControlBtn, true);
        this.setHidden(this.coordNameContainer, false);
        this.setHidden(this.addNewCoordinateNotationBtn, true);

        dojoDomClass.add(this.cpbtn, 'inputCopyBtn');
        dojoDomAttr.set(this.cpbtn, 'title', this.nls.copyAll);

        // add a default graphic during input widget initialization
        var cPt = this.parentWidget.map.extent.getCenter();
        this.parentWidget.coordGLayer.add(new EsriGraphic(cPt));
        this.currentClickPoint = this.getDDPoint(cPt);
        this.formatButton.title = this.nls.formatInput;
      } else {
        dojoDomClass.remove(this.domNode, "coordinateContainer");
        dojoDomClass.add(this.domNode, "outputCoordinateContainer");
        dojoDomClass.add(this.cpbtn, 'outputCopyBtn');
        this.setHidden(this.addNewCoordinateNotationBtn, true);
        this.setHidden(this.zoomButton, true);
        this.coordtext.readOnly = true;
      }
      this.setUIListeners();
    },

    /**
     *
     **/
    setUIListeners: function () {
      // setup event notification and handlers
      dojoTopic.subscribe(
        'CRDWIDGETSTATEDIDCHANGE',
        dojoLang.hitch(this, this.parentStateDidChange)
      );

      dojoTopic.subscribe(
        'INPUTPOINTDIDCHANGE',
        dojoLang.hitch(this, this.mapWasClicked)
      );

      dojoTopic.subscribe(
        'INPUTERROR',
        dojoLang.hitch(this, this.inputError)
      );

      // listen for dijit events
      this.own(dojoOn(
        this.expandButton,
        'click',
        dojoLang.hitch(this, this.expandButtonWasClicked)
      ));

      this.own(dojoOn(
        this.addNewCoordinateNotationBtn,
        'click',
        dojoLang.hitch(this, this.newCoordnateBtnWasClicked)
        ));

      this.own(dojoOn(
        this.zoomButton,
        'click',
        dojoLang.hitch(this, this.zoomButtonWasClicked)
      ));

      this.own(
        this.coordName.on(
          'blur',
          dojoLang.hitch(this, this.coordNameDidChange))
      );

      this.cpbtn.addEventListener(
        'click',
        dojoLang.hitch(this, this.cpBtnWasClicked)
      );

      this.subVal1CpBtn.addEventListener(
        'click',
        dojoLang.hitch(this, this.cpSubBtnWasClicked)
      );

      this.subVal2CpBtn.addEventListener(
        'click',
        dojoLang.hitch(this, this.cpSubBtnWasClicked)
      );

      this.subVal3CpBtn.addEventListener(
        'click',
        dojoLang.hitch(this, this.cpSubBtnWasClicked)
      );

      this.subVal3CpBtn.addEventListener(
        'click',
        dojoLang.hitch(this, this.cpSubBtnWasClicked)
      );

      this.mapclickhandler = dojoOn.pausable(
        this.parentWidget.map,
        'click',
        dojoLang.hitch(this, this.mapWasClicked)
      );

      this.own(dojoOn(
        this.formatButton,
        'click',
        dojoLang.hitch(this, this.formatButtonWasClicked)
      ));

      this.own(dojoOn(this._frmtdlg.content.applyButton, 'click',
        dojoLang.hitch(this, function () {
          this.updateDisplay();
          if (!this.hasCustomLabel &&
            !this._frmtdlg.content.formats[this._frmtdlg.content.ct].useCustom) {
            this.coordName.set('value', this._frmtdlg.content.ct);
          }
          dijitPopup.close(this._frmtdlg);
        }))
      );

      this.own(dojoOn(this._frmtdlg.content.cancelButton, 'click',
        dojoLang.hitch(this, function () {
          dijitPopup.close(this._frmtdlg);
        }))
      );

      this.own(dojoOn(
        this.coordtext,
        'keyup',
        dojoLang.hitch(this, this.coordTextInputKeyWasPressed)
      ));

      this.own(this.geomsrvc.on('error', dojoLang.hitch(
        this,
        this.geomSrvcDidFail)
      ));
    },

    /**
     *
     **/
    popupDidClose: function () {
      var isCanceled =
        this._frmtdlg.content.isCanceled;
      if (isCanceled) {
        return;
      }
      var fv =
        this._frmtdlg.content.frmtSelect.options[this._frmtdlg.content.frmtSelect.selectedIndex].value;
      if (this.type !== fv) {
        this.type = fv;
        this.updateDisplay();
      }
    },

    /**
     *
     **/
    coordNameDidChange: function () {
      this.hasCustomLabel = true;
    },

    /**
     *
     **/
    cpSubBtnWasClicked: function (evt) {
      var c = evt.currentTarget.id.split('~')[0];
      var s;

      this[c].select();
      try {
        s = document.execCommand('copy');
      } catch (err) {
        s = false;
      }

      var t = s ? this.nls.copySuccessful : this.nls.copyFailed;

      this.showToolTip(evt.currentTarget.id, t);
    },

    /**
     *
     **/
    cpBtnWasClicked: function (evt) {
      evt.preventDefault();

      var s, t, tv, fw, w;
      if (this.input) {
        fw = dijitRegistry.toArray().filter(function (w) {
          return w.baseClass === 'jimu-widget-cc' && !w.input;
        });
        fw.reverse();

        w = fw.map(function (w) {
          return w.coordtext.value;
        }).join('\r\n');

        tv = this.coordtext.value;
        w = tv + '\r\n' + w;

        this.coordtext.value = w;
        this.coordtext.select();

        try {
          s = document.execCommand('copy');
        } catch (caerr) {
          s = false;
        }
        this.coordtext.value = tv;
      } else {
        this.coordtext.select();
        try {
          s = document.execCommand('copy');
        } catch (cerr) {
          s = false;
        }
      }

      t = s ? this.nls.copySuccessful : this.nls.copyFailed;
      this.showToolTip(this.cpbtn.id, t);
    },

    /**
     *
     **/
    cpCoordPart: function () {
    },

    /**
     *
     **/
    showToolTip: function (onId, withText) {

      var n = dojoDom.byId(onId);
      dijitTooltip.show(withText, n);
      /*dijitTooltip.defaultPosition = 'below';
      dojoOn.once(n, dojoMouse.leave, function () {
          dijitTooltip.hide(n);
      })*/
      setTimeout(function () {
        dijitTooltip.hide(n);
      }, 1000);
    },

    /**
     *
     **/
    geomSrvcDidComplete: function (r) {
      if (r[0].length <= 0) {
        new JimuMessage({ message: this.nls.parseCoordinatesError });
        dojoTopic.publish('INPUTERROR');
        return;
      }

      var newpt = new EsriPoint(r[0][0], r[0][1], new EsriSpatialReference({ wkid: 4326 }));
      this.currentClickPoint = newpt;

      if (this.input) {
        //this.zoomButtonWasClicked();
        this.parentWidget.map.centerAt(this.currentClickPoint);
        dojoTopic.publish('INPUTPOINTDIDCHANGE', {
          mapPoint: this.currentClickPoint,
          inputFromText: true
        });
      }
    },

    /**
     *
     **/
    geomSrvcDidFail: function () {
      new JimuMessage({ message: this.nls.parseCoordinatesError });
      dojoTopic.publish('INPUTERROR');
    },

    /**
     *
     *
    coordTextInputLostFocus: function (evt) {
    },*/

    /**
     * Handles enter key press event
     **/
    coordTextInputKeyWasPressed: function (evt) {
      if (evt.keyCode === dojoKeys.ENTER) {
        var sanitizedInput = this.util.getCleanInput(evt.currentTarget.value);
        this.util.getCoordinateType(sanitizedInput).then(dojoLang.hitch(this, function (itm) {

          if (itm) {
            if (itm.length === 1) {
              var withStr = this.processCoordTextInput(sanitizedInput, itm[0], false);
              this.util.getXYNotation(withStr, itm[0].conversionType).then(
                dojoLang.hitch(this, function (r) {
                if (r[0].length > 0) {
                  this.geomSrvcDidComplete(r);
                } else {
                  this.geomSrvcDidFail();
                }
              }));
            } else {
              var dialog = new DialogConfirm({
                title: this.nls.comfirmInputNotation,
                content: new ConfirmNotation(itm),
                style: "width: 400px",
                hasSkipCheckBox: false
              });
              dialog.show().then(dojoLang.hitch(this, function () {
                var singleMatch = dojoArray.filter(itm, function (singleItm) {
                  return singleItm.name === dialog.content.comboOptions.get('value');
                });
                var withStr = this.processCoordTextInput(sanitizedInput, singleMatch[0], false);
                this.util.getXYNotation(withStr, singleMatch[0].conversionType).then(
                 dojoLang.hitch(this, function (r) {
                  if (r[0].length > 0) {
                    this.geomSrvcDidComplete(r);
                  } else {
                    this.geomSrvcDidFail();
                  }
                }));
              }, function () {
                //THROW ERROR
              }));
            }
          } else {
            new JimuMessage({ message: this.nls.parseCoordinatesError });
            dojoTopic.publish('INPUTERROR');
          }
        }));
        dojoDomAttr.set(this.coordtext, 'value', sanitizedInput);
      }
    },

    /**
     *
     **/
    processCoordTextInput: function (withStr, asType, testingMode) {
      var match = asType.pattern.exec(withStr);

      var northSouthPrefix, northSouthSuffix,
          eastWestPrefix, eastWestSuffix,
          latDeg, longDeg, latMin,
          longMin, latSec, longSec;

      var prefixSuffixError = false;
      var conversionType = asType.name;

      switch (asType.name) {
        case 'DD':
          northSouthPrefix = match[2];
          northSouthSuffix = match[7];
          eastWestPrefix = match[10];
          eastWestSuffix = match[16];
          latDeg = match[3].replace(/[,:]/, '.');
          longDeg = match[11].replace(/[,:]/, '.');
          conversionType = 'DD';
          break;
        case 'DDrev':
          northSouthPrefix = match[11];
          northSouthSuffix = match[16];
          eastWestPrefix = match[2];
          eastWestSuffix = match[8];
          latDeg = match[12].replace(/[,:]/, '.');
          longDeg = match[3].replace(/[,:]/, '.');
          conversionType = 'DD';
          break;
        case 'DDM':
          northSouthPrefix = match[2];
          northSouthSuffix = match[7];
          eastWestPrefix = match[10];
          eastWestSuffix = match[15];
          latDeg = match[3];
          latMin = match[4].replace(/[,:]/, '.');
          longDeg = match[11];
          longMin = match[12].replace(/[,:]/, '.');
          conversionType = 'DDM';
          break;
        case 'DDMrev':
          northSouthPrefix = match[10];
          northSouthSuffix = match[15];
          eastWestPrefix = match[2];
          eastWestSuffix = match[7];
          latDeg = match[11];
          latMin = match[12].replace(/[,:]/, '.');
          longDeg = match[3];
          longMin = match[4].replace(/[,:]/, '.');
          conversionType = 'DDM';
          break;
        case 'DMS':
          northSouthPrefix = match[2];
          northSouthSuffix = match[8];
          eastWestPrefix = match[11];
          eastWestSuffix = match[17];
          latDeg = match[3];
          latMin = match[4];
          latSec = match[5].replace(/[,:]/, '.');
          longDeg = match[12];
          longMin = match[13];
          longSec = match[14].replace(/[,:]/, '.');
          conversionType = 'DMS';
          break;
        case 'DMSrev':
          northSouthPrefix = match[11];
          northSouthSuffix = match[17];
          eastWestPrefix = match[2];
          eastWestSuffix = match[8];
          latDeg = match[12];
          latMin = match[13];
          latSec = match[14].replace(/[,:]/, '.');
          longDeg = match[3];
          longMin = match[4];
          longSec = match[5].replace(/[,:]/, '.');
          conversionType = 'DMS';
          break;
      }

      //check for north/south prefix/suffix
      if (northSouthPrefix && northSouthSuffix) {
        prefixSuffixError = true;
        if (new RegExp(/[Ss-]/).test(northSouthPrefix)) {
          northSouthPrefix = '-';
        } else {
          northSouthPrefix = '+';
        }
      } else {
        if (northSouthPrefix && new RegExp(/[Ss-]/).test(northSouthPrefix)) {
          northSouthPrefix = '-';
        } else {
          if (northSouthSuffix && new RegExp(/[Ss-]/).test(northSouthSuffix)) {
            northSouthPrefix = '-';
          } else {
            northSouthPrefix = '+';
          }
        }
      }

      //check for east/west prefix/suffix
      if (eastWestPrefix && eastWestSuffix) {
        prefixSuffixError = true;
        if (new RegExp(/[Ww-]/).test(eastWestPrefix)) {
          eastWestPrefix = '-';
        } else {
          eastWestPrefix = '+';
        }
      } else {
        if (eastWestPrefix && new RegExp(/[Ww-]/).test(eastWestPrefix)) {
          eastWestPrefix = '-';
        } else {
          if (eastWestSuffix && new RegExp(/[Ww-]/).test(eastWestSuffix)) {
            eastWestPrefix = '-';
          } else {
            eastWestPrefix = '+';
          }
        }
      }

      //give user warning if lat or long is determined as having a prefix and suffix
      if (prefixSuffixError) {
        if (!testingMode) {
          new JimuMessage({ message: this.nls.latLongWarningMessage });
        }
      }

      switch (conversionType) {
        case 'DD':
          withStr = northSouthPrefix + latDeg + ',' + eastWestPrefix + longDeg;
          break;
        case 'DDM':
          withStr = northSouthPrefix + latDeg +
            ' ' + latMin + ',' + eastWestPrefix +
            longDeg + ' ' + longMin;
          break;
        case 'DMS':
          withStr = northSouthPrefix + latDeg + ' ' +
            latMin + ' ' + latSec + ',' + eastWestPrefix +
            longDeg + ' ' + longMin + ' ' + longSec;
          break;
        default:
          withStr = withStr;
          break;
      }

      return withStr;
    },

    /**
     *
     **/
    zoomButtonWasClicked: function () {
      if (this.input) {
        if (this.parentWidget.map.getZoom() < this.zoomScale) {
          this.parentWidget.map.centerAt(this.currentClickPoint).then(
            dojoLang.hitch(this, function () {
              this.parentWidget.map.setScale(this.zoomScale);
            })
          );
        } else {
          this.parentWidget.map.centerAt(this.currentClickPoint);
        }
      }
    },

    /**
     *
     **/
    typeSelectDidChange: function () {
      //this.type = this.typeSelect.get('value');
      if (this.currentClickPoint) {
        this.updateDisplay();
      }
    },

    /**
     *
     **/
    newCoordnateBtnWasClicked: function (evt) {
      var withType = {};
      withType.notation = this.type;
      withType.defaultFormat = this.defaultFormat;
      this.showToolTip(evt.currentTarget.id, this.nls.notationAddedMessage);
      dojoTopic.publish('ADDNEWNOTATION', withType);
    },

    /**
     *
     **/
    setHidden: function (cntrl, shouldDestroy) {
      dojoDomStyle.set(cntrl, 'display', 'none');
      if (shouldDestroy) {
        dojoDomConstruct.destroy(cntrl.parentNode);
      }
    },

    /**
     *
     **/
    setVisible: function (cntrl) {
      dojoDomStyle.set(cntrl, 'display', 'inline-flex');
    },

    /**
     *
     **/
    remove: function () {
      dojoTopic.publish('REMOVECONTROL', this);
    },

    /**
     *
     **/
    mapWasClicked: function (evt) {
      var isGood = false;
      if ((this.widgetInfo.widgetState === 'active' ||
        this.widgetInfo.widgetState === 'opened') &&
        this.widgetInfo.isActive &&
        this.widgetInfo.themeName === 'DashboardTheme') {
        isGood = true;
      }
      if (this.widgetInfo.widgetState === 'opened' &&
        this.widgetInfo.themeName !== 'DashboardTheme') {
        isGood = true;
      }
      if (this.widgetInfo.isActive &&
        this.widgetInfo.themeName === 'DashboardTheme') {
        isGood = true;
      }
      if (!isGood) {
        return;
      }
      this.currentClickPoint = this.getDDPoint(evt.mapPoint);
      if (evt.inputFromText) {
        this.inputFromText = true;
      } else {
        this.inputFromText = false;
      }
      this.updateDisplay();
    },

    /**
     *
     **/
    getDDPoint: function (fromPoint) {
      if (fromPoint.spatialReference.wkid === 102100) {
        return esriWMUtils.webMercatorToGeographic(fromPoint);
      }
      return fromPoint;
    },

    /**
     *
     **/
    expandButtonWasClicked: function () {
      dojoDomClass.toggle(this.coordcontrols, 'expanded');
      if (dojoDomClass.contains(this.coordcontrols, 'expanded')) {
        dojoDomClass.remove(this.expandButton, "expandBtn");
        dojoDomClass.add(this.expandButton, "collapseBtn");
      } else {
        dojoDomClass.remove(this.expandButton, "collapseBtn");
        dojoDomClass.add(this.expandButton, "expandBtn");
      }
      // if this.coordcontrols is expanded then disable all it's children
      this.setSubCoordUI(dojoDomClass.contains(this.coordcontrols, 'expanded'));
    },

    /**
     *
     **/
    formatButtonWasClicked: function () {
      this._frmtdlg.content.set('ct', this.type);

      dijitPopup.open({
        popup: this._frmtdlg,
        around: this.formatButton
      });

    },

    /**
     *
     **/
    setSubCoordUI: function (expanded) {

      if (expanded) {
        var cntrHeight = '165px';
        switch (this.type) {
          case 'DD':
          case 'DMS':
          case 'DDM':
            this.sub1label.innerHTML = 'Lat';
            this.sub2label.innerHTML = 'Lon';
            this.setHidden(this.sub3, false);
            this.setHidden(this.sub4, false);
            cntrHeight = '90px';
            break;
          case 'GARS':
            this.sub1label.innerHTML = 'Lon';
            this.sub2label.innerHTML = 'Lat';
            this.sub3label.innerHTML = 'Quadrant';
            this.sub4label.innerHTML = 'Key';
            this.setVisible(this.sub3);
            this.setVisible(this.sub4);
            break;
          case 'GEOREF':
            this.sub1label.innerHTML = '15° Quad';
            this.sub2label.innerHTML = '1° Quad';
            this.sub3label.innerHTML = 'Easting';
            this.setVisible(this.sub3);
            this.sub4label.innerHTML = 'Northing';
            this.setVisible(this.sub4);
            break;
          case 'USNG':
          case 'MGRS':
            this.sub1label.innerHTML = 'GZD';
            this.sub2label.innerHTML = 'Grid Sq';
            this.sub3label.innerHTML = 'Easting';
            this.sub4label.innerHTML = 'Northing';
            this.setVisible(this.sub3);
            this.setVisible(this.sub4);
            break;
          case 'UTM':
            this.sub1label.innerHTML = 'Zone';
            this.sub2label.innerHTML = 'Band';
            this.sub3label.innerHTML = 'Easting';
            this.sub4label.innerHTML = 'Northing';
            this.setVisible(this.sub3);
            this.setVisible(this.sub4);
            break;
          case 'UTM (H)':
            this.sub1label.innerHTML = 'Zone';
            this.sub2label.innerHTML = 'Hemisphere';
            this.sub3label.innerHTML = 'Easting';
            this.sub4label.innerHTML = 'Northing';
            this.setVisible(this.sub3);
            this.setVisible(this.sub4);
            break;
        }
        dojoDomStyle.set(this.coordcontrols, 'height', cntrHeight);
        dojoDomStyle.set(this.coordcontrols, 'width', '300px');
      } else {
        dojoDomStyle.set(this.coordcontrols, 'height', '0px');
      }
    },

    /**
     *
     **/
    setCoordUI: function (withValue) {
      var formattedStr;
      if (withValue) {
        var cntrlid = this.uid.split('_')[1];

        // make sure we haven't been removed
        if (!this['cc_' + cntrlid + 'sub1val']) {
          return;
        }

        if (this.input && this.inputFromText) {
          return;
        } else {
          var format;
          var f = this._frmtdlg.content.formats[this.type];
          var as = this._frmtdlg.content.addSignChkBox.checked;
          var r;

          if (f.useCustom) {
            format = f.customFormat;
          } else {
            format = f.defaultFormat;
          }

          switch (this.type) {
            case 'DD':

              r = this.util.getFormattedDDStr(withValue, format, as);

              this['cc_' + cntrlid + 'sub1val'].value =
               dojoString.substitute('${xcrd}', {
                xcrd: r.latdeg
              });

              this['cc_' + cntrlid + 'sub2val'].value =
               dojoString.substitute('${ycrd}', {
                ycrd: r.londeg
              });

              formattedStr = r.formatResult;
              break;
            case 'DDM':

              r = this.util.getFormattedDDMStr(withValue, format, as);

              this['cc_' + cntrlid + 'sub1val'].value =
               dojoString.substitute('${latd} ${latm}', {
                latd: r.latdeg,
                latm: r.latmin
              });

              this['cc_' + cntrlid + 'sub2val'].value =
               dojoString.substitute('${lond} ${lonm}', {
                lond: r.londeg,
                lonm: r.lonmin
              });

              formattedStr = r.formatResult;
              break;
            case 'DMS':

              r = this.util.getFormattedDMSStr(withValue, format, as);

              this['cc_' + cntrlid + 'sub1val'].value =
               dojoString.substitute('${latd} ${latm} ${lats}', {
                latd: r.latdeg,
                latm: r.latmin,
                lats: r.latsec
              });

              this['cc_' + cntrlid + 'sub2val'].value =
               dojoString.substitute('${lond} ${lonm} ${lons}', {
                lond: r.londeg,
                lonm: r.lonmin,
                lons: r.lonsec
              });

              formattedStr = r.formatResult;
              break;
            case 'USNG':

              r = this.util.getFormattedUSNGStr(withValue, format, as);

              this['cc_' + cntrlid + 'sub1val'].value = r.gzd;
              this['cc_' + cntrlid + 'sub2val'].value = r.grdsq;
              this['cc_' + cntrlid + 'sub3val'].value = r.easting;
              this['cc_' + cntrlid + 'sub4val'].value = r.northing;

              formattedStr = r.formatResult;

              break;
            case 'MGRS':
              r = this.util.getFormattedMGRSStr(withValue, format, as);

              this['cc_' + cntrlid + 'sub1val'].value = r.gzd;
              this['cc_' + cntrlid + 'sub2val'].value = r.grdsq;
              this['cc_' + cntrlid + 'sub3val'].value = r.easting;
              this['cc_' + cntrlid + 'sub4val'].value = r.northing;

              formattedStr = r.formatResult;
              break;
            case 'GARS':
              r = this.util.getFormattedGARSStr(withValue, format, as);

              this['cc_' + cntrlid + 'sub1val'].value = r.lon;
              this['cc_' + cntrlid + 'sub2val'].value = r.lat;
              this['cc_' + cntrlid + 'sub3val'].value = r.quadrant;
              this['cc_' + cntrlid + 'sub4val'].value = r.key;

              formattedStr = r.formatResult;
              break;
            case 'GEOREF':
              r = this.util.getFormattedGEOREFStr(withValue, format, as);

              this['cc_' + cntrlid + 'sub1val'].value = r.lon + r.lat;
              this['cc_' + cntrlid + 'sub2val'].value = r.quadrant15lon + r.quadrant15lat;
              this['cc_' + cntrlid + 'sub3val'].value = r.quadrant1lon;
              this['cc_' + cntrlid + 'sub4val'].value = r.quadrant1lat;

              formattedStr = r.formatResult;
              break;
            case 'UTM':
              r = this.util.getFormattedUTMStr(withValue, format, as);

              if(r.bandLetter.match(/^[AaBbYyZz]/)){
                //do not calculate values if out side of the UTM range (i.e. polar regions)
                this['cc_' + cntrlid + 'sub1val'].value = '';
                this['cc_' + cntrlid + 'sub2val'].value = '';
                this['cc_' + cntrlid + 'sub3val'].value = '';
                this['cc_' + cntrlid + 'sub4val'].value = '';
                r.formatResult = '';
              } else {
                this['cc_' + cntrlid + 'sub1val'].value = r.zone;
                this['cc_' + cntrlid + 'sub2val'].value = r.bandLetter;
                this['cc_' + cntrlid + 'sub3val'].value = r.easting;
                this['cc_' + cntrlid + 'sub4val'].value = r.westing;
              }

              //r.bandLetter.match(/^[AaBbYyZz]/)?this.coordName.set('value','UPS'):this.coordName.set('value','UTM');
              formattedStr = r.formatResult;
              break;
            case 'UTM (H)':
              r = this.util.getFormattedUTMHStr(withValue, format, as);

              if(r.hemisphere.match(/^[AaBbYyZz]/)){
                //do not calculate values if out side of the UTM range (i.e. polar regions)
                this['cc_' + cntrlid + 'sub1val'].value = '';
                this['cc_' + cntrlid + 'sub2val'].value = '';
                this['cc_' + cntrlid + 'sub3val'].value = '';
                this['cc_' + cntrlid + 'sub4val'].value = '';
                r.formatResult = '';
              } else {
                this['cc_' + cntrlid + 'sub1val'].value = r.zone;
                this['cc_' + cntrlid + 'sub2val'].value = r.hemisphere;
                this['cc_' + cntrlid + 'sub3val'].value = r.easting;
                this['cc_' + cntrlid + 'sub4val'].value = r.westing;
              }

              //r.hemisphere.match(/^[AaBbYyZz]/) ?
              //  this.coordName.set('value','UPS') :
              //  this.coordName.set('value','UTM (H)');
              formattedStr = r.formatResult;
              break;
          }
        }
      } else {
        formattedStr = '';

      }
      this.setSubCoordUI(dojoDomClass.contains(this.coordcontrols, 'expanded'));
      if (this.coordtext) {
        dojoDomAttr.set(this.coordtext, 'value', formattedStr);
      }
    },

    /**
     *
     **/
    getFormattedCoordinates: function () {
      this.util.getCoordValues(this.currentClickPoint, this.type, 4).then(
        dojoLang.hitch(this, function (r) {
          this.setCoordUI(r);
        }),
        dojoLang.hitch(this, function (err) {
          console.log(err);
        })
      );
    },

    /**
     *
     **/
    updateDisplay: function () {
      this.getFormattedCoordinates(this.currentClickPoint);
      if (this.input) {
        this.parentWidget.coordGLayer.clear();
        this.parentWidget.coordGLayer.add(new EsriGraphic(this.currentClickPoint));
      }
    },

    /**
     *
     **/
    inputError: function () {
      this.setCoordUI();
    }
  });
});