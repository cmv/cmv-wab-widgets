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
    'dojo/_base/array',
    "dojo/_base/lang",
    'dojo/_base/Color',
    'dojo/on',
    "dojo/query",
    "dojo/_base/html",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!../templates/ColorPickerEditor.html',
    "dijit/form/HorizontalSlider",
    'jimu/dijit/ColorPickerPopup',
    "dijit/form/NumberSpinner"
  ],
  function (declare, array, lang, Color, on, query, html,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
    HorizontalSlider, ColorPicker) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      _defaultColor: '#485566',
      templateString: template,
      nls: null,

      postCreate: function () {
        this.colorPicker = new ColorPicker({
          color: this._defaultColor,
          tabindex: "0",
          "aria-label": this.nls.colorPicker
        }, this.colorPicker);
        this.colorPicker.startup();

        this.slider = new HorizontalSlider({
          name: "slider",
          value: 100,
          minimum: 0,
          maximum: 100,
          discreteValues: 101,
          intermediateChanges: true,
          showButtons: false,
          style: "display: inline-block;",
          "aria-label": this.nls.transparency
        }, this.sliderBar);
        this.slider.startup();

        var options = [],
          option;
        var lineStyles = [
          "esriSLSDash",
          "esriSLSDashDot",
          "esriSLSDashDotDot",
          "esriSLSDot",
          "esriSLSLongDash",
          "esriSLSLongDashDot",
          "esriSLSNull",
          "esriSLSShortDash",
          "esriSLSShortDashDot",
          "esriSLSShortDashDotDot",
          "esriSLSShortDot",
          "esriSLSSolid"
        ];
        var fillStyles = [
          "esriSFSBackwardDiagonal",
          "esriSFSCross",
          "esriSFSDiagonalCross",
          "esriSFSForwardDiagonal",
          "esriSFSHorizontal",
          "esriSFSNull",
          "esriSFSSolid",
          "esriSFSVertical"
        ];
        if (this.type === 'line') {
          array.forEach(lineStyles, lang.hitch(this, function (style) {
            option = {
              value: style,
              label: this.nls.lineStyles[style]
            };
            options.push(option);
          }));
        } else {
          array.forEach(fillStyles, lang.hitch(this, function (style) {
            option = {
              value: style,
              label: this.nls.fillStyles[style]
            };
            options.push(option);
          }));
        }
        this.dropdown.addOption(options);

        this.inherited(arguments);
      },

      startup: function () {
        this.own(on(this.slider, 'change', lang.hitch(this, function (val) {
          if (false === this._isSameVal()) {
            this.spinner.setValue(val);
          }
        })));

        this.own(on(this.spinner, 'change', lang.hitch(this, function (val) {
          if (val <= this.slider.maximum) {
            this.slider.setValue(val);
          }
        })));

        this._stylePolyfill();
        this.inherited(arguments);
      },

      _isSameVal: function () {
        return this.slider.getValue() === this.spinner.getValue();
      },

      getValues: function () {
        var rgb = null,
          a = null;
        var bgColor = this.colorPicker.getColor();
        if (bgColor && bgColor.toHex) {
          rgb = bgColor.toHex();
        }
        a = this.spinner.getValue() / 100;

        return {
          color: rgb,
          transparency: a
        };
      },

      setValues: function (obj) {
        if (typeof obj === "object" || typeof obj === "string") {
          this.colorPicker.setColor(new Color(obj.color));

          if (typeof obj.transparency === "undefined") {
            obj.transparency = 0;
          } else {
            obj.transparency = obj.transparency * 100;
          }
          this.slider.setValue(obj.transparency);
          this.spinner.setValue(obj.transparency);
        }
      },
      _stylePolyfill: function () {
        var leftBumper = query('.dijitSliderLeftBumper', this.domNode)[0];
        if (leftBumper && leftBumper.parentNode) {
          html.setStyle(leftBumper.parentNode, 'background-color', "#24b5cc");
        }
      },

      validateSpinner: function () {
        var isValid = true;
        if (!this.spinner.isValid()) {
          this._shake(this.spinner.domNode, 16);
          this.spinner.focus();
          isValid = false;
        }
        return isValid;
      },

      //Source: https://stackoverflow.com/questions/36962903/javascript-shake-html-element
      _shake: function (element, magnitude) {
        //A counter to count the number of shakes
        var counter = 1;
        //The total number of shakes (there will be 1 shake per frame)
        var numberOfShakes = 15;
        //Capture the element's position and angle so you can
        //restore them after the shaking has finished
        var startX = 0,
          startY = 0;
        // Divide the magnitude into 10 units so that you can
        // reduce the amount of shake by 10 percent each frame
        var magnitudeUnit = magnitude / numberOfShakes;
        //The `randomInt` helper function
        var randomInt = function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        //Add the element to the `shakingElements` array if it
        //isn't already there
        if (!this._shakingElements) {
          this._shakingElements = [];
        }
        if (this._shakingElements.indexOf(element) === -1) {
          //console.log("added")
          this._shakingElements.push(element);
          //Add an `updateShake` method to the element.
          //The `updateShake` method will be called each frame
          //in the game loop. The shake effect type can be either
          //up and down (x/y shaking) or angular (rotational shaking).
          var self = this;
          _upAndDownShake();
        }

        function _upAndDownShake() {
          //Shake the element while the `counter` is less than
          //the `numberOfShakes`
          if (counter < numberOfShakes) {
            //Reset the element's position at the start of each shake
            element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';
            //Reduce the magnitude
            magnitude -= magnitudeUnit;
            //Randomly change the element's position
            var randomX = randomInt(-magnitude, magnitude);
            var randomY = randomInt(-magnitude, magnitude);
            element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';
            //Add 1 to the counter
            counter += 1;
            requestAnimationFrame(_upAndDownShake);
          }
          //When the shaking is finished, restore the element to its original
          //position and remove it from the `shakingElements` array
          if (counter >= numberOfShakes) {
            element.style.transform = 'translate(' + startX + ', ' + startY + ')';
            self._shakingElements.splice(self._shakingElements.indexOf(element), 1);
          }
        }
      }
    });
  });