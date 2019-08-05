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
    'dojo/on',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/text!./_SeriesStyleItem.html',
    '../ChartColorSetting',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    "dijit/form/HorizontalSlider",
    'dijit/form/RadioButton'
  ],
  function(declare, on, lang, html, templateString, ChartColorSetting, Evented,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, HorizontalSlider) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-series-style-item',
      templateString: templateString,
      textVisible: true,
      opacityVisible: false,
      colorSingleMode: true,
      //public methods
      //getConfig
      //setConfig
      // setTextDisplay
      // setOpacityDisplay
      // setColorMode

      //event
      //change return {color:[],opacity:number}

      //option:
      //  textVisible:boolean,
      //  opacityVisible:boolean,
      //  colorSingleMode:boolean,

      //config
      //{
      //   name: '',
      //   label: '',
      //   style: {
      //     color: '',
      //     opacity: 1
      //   }
      // }

      postCreate: function() {
        this.inherited(arguments);
        this._ignoreEvent();
        this._initDom();
        this._setOptions();
        this._careEvent();
      },

      setConfig: function(config) {
        if (!config) {
          return;
        }

        if (!config.name) {
          console.error('Invalid config');
          return;
        }
        this._ignoreEvent();
        var label = config.label || config.name;
        this.textDiv.innerHTML = label;
        this.textDiv.title = label;
        this.fieldName = config.name;
        var style = config.style;
        if (!style) {
          this._careEvent();
          return;
        }
        this._setColor(style.color);
        if (typeof style.opacity !== 'undefined') {
          this._setOpacity(style.opacity);
        }
        this._careEvent();
      },

      getConfig: function() {
        var config = {
          style: {}
        };
        config.name = this.fieldName;
        config.label = this.textDiv.innerHTML;
        config.style.opacity = this._getOpacity();
        config.style.color = this._getColor();
        return config;
      },

      _initDom: function() {
        this.colorPicker = new ChartColorSetting();
        this.own(on(this.colorPicker, 'change', lang.hitch(this, function() {
          this._onChange();
        })));
        this.colorPicker.placeAt(this.colorDiv);

        this.opacitySlider = new HorizontalSlider({
          name: "slider",
          value: 0,
          minimum: 0,
          maximum: 10,
          discreteValues: 10,
          intermediateChanges: false,
          showButtons: false,
          style: "width: 71%;margin: auto -3px auto 5px;"
        });
        this.own(on(this.opacitySlider, 'change', lang.hitch(this, function() {
          this._onChange();
        })));
        this.opacitySlider.placeAt(this.opacityDiv);
      },

      _onChange: function() {
        if (this.ignoreChangeEvents) {
          return;
        }
        var config = this.getConfig();
        this.emit('change', config);
      },

      _ignoreEvent: function() {
        this.ignoreChangeEvents = true;
      },

      _careEvent: function() {
        this.ignoreChangeEvents = false;
      },

      _setOptions: function() {
        this.setTextDisplay(this.textVisible);
        this.setOpacityDisplay(this.opacityVisible);
        this.setColorMode(this.colorSingleMode);
      },

      setTextDisplay: function(textVisible) {
        this.textVisible = textVisible;
        if (this.textVisible) {
          this._showText();
        } else {
          this._hideText();
        }
      },

      setOpacityDisplay: function(opacityVisible) {
        this.opacityVisible = opacityVisible;
        if (this.opacityVisible) {
          this._showOpacity();
        } else {
          this._hideOpacity();
        }
      },

      setColorMode: function(colorSingleMode) {
        this.colorSingleMode = colorSingleMode;
        if (this.colorSingleMode) {
          this.colorPicker.setMode(true);
        } else {
          this.colorPicker.setMode(false);
        }
      },

      //Tool methods
      _getOpacity: function() {
        if (!this.opacityVisible) {
          return;
        }
        var opacity = this.opacitySlider.get('value');
        opacity = parseInt(opacity, 10);
        if (opacity) {
          return opacity;
        } else {
          return 0;
        }
      },

      _getColor: function() {
        return this.colorPicker.getColors();
      },

      _showText: function() {
        html.addClass(this.rightPanel, 'flex-lr-balance');
        html.removeClass(this.rightPanel, 'flex-fill');
        html.setStyle(this.textContainer, 'display', '');
      },

      _hideText: function() {
        html.removeClass(this.rightPanel, 'flex-lr-balance');
        html.addClass(this.rightPanel, 'flex-fill');
        html.setStyle(this.textContainer, 'display', 'none');
      },

      _setOpacity: function(opacity) {
        opacity = parseInt(opacity, 10);
        if (!opacity || opacity < this.min) {
          opacity = this.min;
        }
        if (opacity > this.max) {
          opacity = this.max;
        }
        this.opacitySlider.set('value', opacity);
      },

      _setColor: function(color) {
        this.colorPicker.setColorsAutomatically(color);
      },

      _showOpacity: function() {
        html.setStyle(this.opacityDiv, 'display', 'flex');
      },

      _hideOpacity: function() {
        html.setStyle(this.opacityDiv, 'display', 'none');
      }
    });
  });