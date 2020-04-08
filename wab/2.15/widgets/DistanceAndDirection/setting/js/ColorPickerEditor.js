///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    "dojo/_base/declare",
    "dojo/_base/Color",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!../templates/ColorPickerEditor.html",
    "jimu/dijit/ColorPickerPopup",
    "dijit/form/NumberSpinner"
  ],
  function (
    declare,
    Color,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    template,
    ColorPicker
  ) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      _defaultColor: "#485566",
      templateString: template,
      nls: null,

      postCreate: function () {
        this.colorPicker = new ColorPicker({
          color: this._defaultColor,
          width: this._defaultWidth
        }, this.colorPicker);
        this.colorPicker.startup();
        this.inherited(arguments);
      },

      startup: function () {
        this.inherited(arguments);
      },

      _isSameVal: function () {
        return this.slider.getValue() === this.spinner.getValue();
      },

      getValues: function () {
        var rgb = null;
        var bgColor = this.colorPicker.getColor();
        if (bgColor) {
          rgb = bgColor;
        }
        return rgb;
      },

      setValues: function (obj) {
        if (typeof obj === "object" || typeof obj === "string") {
          var objColor = this._rgbToHex(obj.color);
          this.colorPicker.setColor(new Color(objColor));
        }
      },

      //Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
      _hexToRgb: function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      },

      //Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
      _componentToHex: function (c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      },

      //Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
      _rgbToHex: function (c) {
        return "#" + this._componentToHex(c.r) + this._componentToHex(c.g) + this._componentToHex(c.b);
      }

    });
  });