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
  'jimu/BaseWidgetSetting',
  "dijit/_WidgetsInTemplateMixin",
  "dojo/_base/lang",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/on",
  "dojo/text!./SymbolChooserPopup.html",
  "jimu/dijit/SymbolChooser",
  "jimu/dijit/Popup",
  'dijit/focus',
  "dojo/domReady!"
], function (
  declare,
  BaseWidgetSetting,
  _WidgetsInTemplateMixin,
  lang,
  domClass,
  domConstruct,
  on,
  SymbolChooserTemplate,
  SymbolChooser,
  Popup,
  focusUtil
) {
  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    templateString: SymbolChooserTemplate,
    baseClass: 'jimu-widget-districtlookup-setting',

    postCreate: function () {
      //attach 'click' event
      this.own(on(this.okButton, 'click', lang.hitch(this, this._onOKButtonClicked)));
      //initialize symbol chooser widget
      this._initSymbolChooser();
      //initialize popup dialog
      this._createSymbolChooserPopup();
    },

    /**
    * Initialize symbol chooser
    * @memberOf widgets/DistrictLookup/setting/SymbolChooserPopup
    **/
    _initSymbolChooser: function () {
      this.symbolChooser = new SymbolChooser(this.symbolParams,
          domConstruct.create("div", {}, this.symbolData));
      this.symbolChooser.startup();
    },

    /**
    * create and display popup for symbol chooser
    * @memberOf widgets/DistrictLookup/setting/SymbolChooserPopup
    **/
    _createSymbolChooserPopup: function () {
      this.popup = new Popup({
        titleLabel: this.symbolChooserTitle,
        width: 420,
        height: 400,
        content: this.domNode
      });
    },

    /**
    * handle click event for disabled buttons
    * @memberOf widgets/DistrictLookup/setting/SymbolChooserPopup
    **/
    _onOKButtonClicked: function () {
      //check if ok button is enabled
      if (!domClass.contains(this.okButton, "jimu-state-disabled")) {
        if (!this._validatePointSymbolSize()) { // point
          focusUtil.focus(this.symbolChooser.pointSize.focusNode);
          return;
        }
        if (!this._validatePointOutlineWidth()) { // point
          focusUtil.focus(this.symbolChooser.pointOutlineWidth.focusNode);
          return;
        }
        if (!this._validateLineWidth()) { // line
          focusUtil.focus(this.symbolChooser.lineWidth.focusNode);
          return;
        }
        if (!this._validatePolygonOutlineWidth()) { // polygon outline width
          focusUtil.focus(this.symbolChooser.fillOutlineWidth.focusNode);
          return;
        }
        this.onOkClick();
      }
    },

    onOkClick: function (evt) {
      return evt;
    },

    /**
     * This function is used to validate symbol size
     */
    _validatePointSymbolSize: function () {
      if (this.symbolChooser && this.symbolChooser.hasOwnProperty("pointSize")) {
        return this.symbolChooser.pointSize.isValid();
      }
      return true;
    },

    /**
     * This function is used to validate polygon outline width
     */
    _validatePolygonOutlineWidth: function () {
      if (this.symbolChooser && this.symbolChooser.hasOwnProperty("fillOutlineWidth")) {
        return this.symbolChooser.fillOutlineWidth.isValid();
      }
      return true;
    },

    /**
     * This function is used to validate outline width
     */
    _validatePointOutlineWidth: function () {
      if (this.symbolChooser && this.symbolChooser.hasOwnProperty("pointOutlineWidth")) {
        return this.symbolChooser.pointOutlineWidth.isValid();
      }
      return true;
    },

    /**
     * This function is used to validate width in case of line symbol
     */
    _validateLineWidth: function () {
      if (this.symbolChooser && this.symbolChooser.hasOwnProperty("lineWidth")) {
        if (!(this.symbolChooser.lineWidth.isValid())) { // not valid
          return false;
        } else { // valid
          var lineWidthValue = this.symbolChooser.lineWidth.getValue();
          // when value is blank is it considered as invalid
          if (lineWidthValue === '' ||
            lineWidthValue === null ||
            lineWidthValue === undefined ||
            isNaN(lineWidthValue)) {
            this.symbolChooser.lineWidth.setValue("0");
            return false;
          }
          return true;
        }
      }
      return true;
    }
  });
});