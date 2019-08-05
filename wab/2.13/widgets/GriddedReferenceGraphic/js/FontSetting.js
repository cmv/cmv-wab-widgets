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
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/on",
  "dojo/_base/html",
  "dojo/_base/array",
  "dojo/dom-attr",
  "dojo/Evented",
  "dojo/query",
  "dojo/keys",
  "dojo/aspect",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!../templates/FontSetting.html",
  "jimu/dijit/ColorPickerPopup",
  "dijit/form/HorizontalSlider",
  "./TransparencyEditor",
  "dojo/store/Memory",
  "jimu/dijit/formSelect",
  "jimu/dijit/CheckBox",
  "jimu/dijit/ImageChooser",
  "dijit/form/ComboBox"
],
  function (declare, lang, on, html, array, domAttr,
    Evented, query, keys, aspect, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
    ColorPickerPopup, HorizontalSlider, TransparencyEditor, Memory) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      templateString: template,
      nls: null,
      _FONTS: null,
      _MIN_TEXT_SIZE: 12,
      _MAX_TEXT_SIZE: 48,
      _INTERVAL_TEXT_SIZE: 2,

      _DEFAULT_CONFIG: null,

      postCreate: function () {
        this.inherited(arguments);
        this._FONTS =
          "Arial;Comic Sans MS;Courier New;Garamond;Tahoma;Times New Roman;Verdana".split(";");
        this._DEFAULT_CONFIG = {
          font: {
            fontFamily: this._FONTS[0],//first one
            bold: false,
            italic: false,
            underline: false
          },
          fontSize: "24",
          textColor: "#282828",
          haloSize: 1,
          haloColor: "#FFFFFF",
          haloOn: true,
          labelTransparency: 1
        };
        this.config = lang.mixin(lang.clone(this._DEFAULT_CONFIG), this.config);

        //font
        array.forEach(this._FONTS, lang.hitch(this, function (font) {
          this.fontSelect.addOption({ value: font, label: font });
        }));
        //text size
        var textSizeStore = new Memory({});
        for (var i = this._MIN_TEXT_SIZE, max = this._MAX_TEXT_SIZE;
          i <= max; i += this._INTERVAL_TEXT_SIZE) {
          textSizeStore.put({ id: i, name: i });
        }
        this.textSizeSelect.store = textSizeStore;
        domAttr.set(this.textSizeSelect.domNode, "aria-label", this.nls.textSize);
        domAttr.set(this.textSizeSelect.domNode, "role", "combobox");
        domAttr.set(this.textSizeSelect.domNode, "aria-expanded", "false");
        aspect.after(this.textSizeSelect, "loadAndOpenDropDown", lang.hitch(this, function () {
          domAttr.set(this.textSizeSelect.domNode, "aria-expanded", "true");
        }));
        aspect.after(this.textSizeSelect, "closeDropDown", lang.hitch(this, function () {
          domAttr.set(this.textSizeSelect.domNode, "aria-expanded", "false");
        }));
        this.textSizeSelect.validator = lang.hitch(this, function () {
          var s = this.textSizeSelect.getValue();
          if (s !== null && s !== "") {
            return !isNaN(s);
          }
          return false;
        });
        this.textSizeSlider = new HorizontalSlider({
          name: "slider",
          value: 0,
          minimum: this._MIN_TEXT_SIZE,
          maximum: this._MAX_TEXT_SIZE,
          discreteValues: this.textSizeSelect.store.data.length + 1,
          intermediateChanges: true,
          showButtons: false,
          style: "display: inline-block;",
          "aria-label": this.nls.textSize
        }, this.sliderBar);
        this.textSizeSlider.startup();
        //.textColor
        var colorPickerText = "";
        if (this.nls.gridSettings) {
          colorPickerText = this.nls.gridSettings.colorPicker;
        }
        this.textColorPicker = new ColorPickerPopup({
          role:"button",
          tabindex:"0",
          "aria-label":this.nls.textColor + " " + colorPickerText,
          appearance: {
            showTransparent: false,
            showColorPalette: true,
            showCoustom: true,
            showCoustomRecord: true
          },
          recordUID: this.recordUID
        });
        this.textColorPicker.placeAt(this.textColorBtn);
        this.textColorPicker.startup();

        //transparency
        this.labelTransparency = new TransparencyEditor({ariaLabel:this.nls.transparency}, this.transparencySlider);
        this.labelTransparency.startup();

        //halo
        //halo size
        var haloSizeSelectOptions = [], haloSizeSelectOption;
        for (i = 1, max = 10; i <= max; i += 1) {
          haloSizeSelectOption = {
            value: i.toString(),
            label: i.toString()
          };
          haloSizeSelectOptions.push(haloSizeSelectOption);
        }
        this.haloSizeSelect.addOption(haloSizeSelectOptions);
        this.haloSizeSelect.validator = lang.hitch(this, function () {
          var s = this.haloSizeSelect.get("value");
          if (s !== null && s !== "") {
            return !isNaN(s);
          }
          return false;
        });

        //halo color picker
        this.haloColorPicker = new ColorPickerPopup({
          role:"button",
          tabindex:"0",
          "aria-label":this.nls.halo + " " + colorPickerText,
          appearance: {
            showTransparent: false,
            showColorPalette: true,
            showCoustom: true,
            showCoustomRecord: true
          }
        });
        this.haloColorPicker.placeAt(this.haloColorBtn);
        this.haloColorPicker.startup();

        //font
        this.own(on(this.fontSelect, "change", lang.hitch(this, function (value) {
          if(this.config.font.fontFamily === value){
            return;
          }
          this.onSettingChange({
            font: {
              fontFamily: value,
              bold: this.config.font.bold,
              italic: this.config.font.italic,
              underline: this.config.font.underline
            }
          });
        })));
        this._initAppearance();
        this.own(on(this.bold, "click", lang.hitch(this, function () {
          this._clickHandlerOfBoldItalicUnderline (this.bold, "bold");
        })));
        this.own(on(this.italic, "click", lang.hitch(this, function () {
          this._clickHandlerOfBoldItalicUnderline (this.italic, "italic");
        })));
        this.own(on(this.underline, "click", lang.hitch(this, function () {
          this._clickHandlerOfBoldItalicUnderline (this.underline, "underline");
        })));

        this.own(on(this.bold, "keydown", lang.hitch(this, function (evt) {
          if(evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._clickHandlerOfBoldItalicUnderline (this.bold, "bold");
          }
        })));
        this.own(on(this.italic, "keydown", lang.hitch(this, function (evt) {
          if(evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._clickHandlerOfBoldItalicUnderline (this.italic, "italic");
          }
        })));
        this.own(on(this.underline, "keydown", lang.hitch(this, function (evt) {
          if(evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._clickHandlerOfBoldItalicUnderline (this.underline, "underline");
          }
        })));
        //text size
        this.own(on(this.textSizeSelect, "change", lang.hitch(this, function (value) {
          if(this.config.fontSize === value || false === this.textSizeSelect.isValid()){
            return;
          }
          this.setTextSize(value);
          this.onSettingChange({
            fontSize: value
          });
        })));
        this.own(on(this.textSizeSlider, "change", lang.hitch(this, function (value) {
          if(this.config.fontSize === value){
            return;
          }
          this.setTextSize(Math.round(value));
          this.onSettingChange({
            fontSize: value
          });
        })));
        //.textColor
        this.own(on(this.textColorPicker, "change", lang.hitch(this, function (color) {
          if(this.config.textColor === color){
            return;
          }
          this.onSettingChange({
            textColor: color.toHex()
          });
        })));
        //transparency slider
        this.own(this.labelTransparency.watch("transparency", lang.hitch(this, function () {
          this.onSettingChange({
            labelTransparency: this.labelTransparency.getValues().transparency
          });
        })));
        //halo size
        this.own(on(this.haloSizeSelect, "change", lang.hitch(this, function (value) {
          if(this.config.haloSize === value || false === this.haloSizeSelect.isValid()){
            return;
          }
          this.onSettingChange({
            haloSize: value
          });
        })));
        //.haloColor
        this.own(on(this.haloColorPicker, "change", lang.hitch(this, function (color) {
          if(this.config.haloColor === color){
            return;
          }
          this.onSettingChange({
            haloColor: color.toHex()
          });
        })));
        //halo toggle switch
        this.own(on(this.showHalo, "change", lang.hitch(this, function () {
          this.onSettingChange({
            haloOn: this.showHalo.checked
          });
        })));

        // Code for Accessibility: keydown for color picker
        var colorPickerDOMNodes = query('.jimu-color-pickerPopup', this.domNode);
        array.forEach(colorPickerDOMNodes, lang.hitch(this, function (node) {
          this.own(on(node, 'keydown', lang.hitch(this, function (event) {
            if (event.keyCode === keys.ENTER || event.keyCode === keys.SPACE) {
              event.currentTarget.click();
            }
          })));
        }));
      },
      startup: function () {
        this.inherited(arguments);
        this.setConfig(this.config);
        this.refresh();
        //add titles
        // var labels = html.query(".setting-items .label", this.domNode);
        // array.forEach(labels, lang.hitch(this, function (label) {
        //   html.setAttr(label, "title", html.getAttr(label, "innerHTML"));
        // }));
      },

      onSettingChange: function (configObj) {
        this.config = lang.mixin(this.config, configObj);
        this.onChange(this.config);
      },
      onChange: function (config) {
        this.emit("change", config);
      },
      refresh: function () {
        this.onSettingChange({});
      },
      isValid: function () {
        if (false === this.textSizeSelect.isValid()) {
          return false;
        }

        return true;
      },
      getConfig: function () {
        if (this.isValid()) {
          return this.config;
        } else {
          return false;
        }
      },

      setConfig: function (configObj) {
        if ("undefined" === configObj) {
          return;
        }

        if ("undefined" !== typeof configObj.font) {
          this.config.font = configObj.font;
          if (this.config.font.fontFamily) {
            this.fontSelect.set("value", this.config.font.fontFamily);
          }
          this.fontBtnClickd(this.config.font);
        }
        if ("undefined" !== typeof configObj.fontSize) {
          this.config.fontSize = configObj.fontSize;
          this.setTextSize(this.config.fontSize);
        }
        if ("undefined" === typeof configObj.textColor || "" === configObj.textColor) {
          configObj.textColor = this._DEFAULT_CONFIG.textColor;//"#000001";
        }
        this.config.textColor = configObj.textColor;

        if ("undefined" === typeof configObj.labelTransparency ||
          "" === configObj.labelTransparency) {
          configObj.labelTransparency = this._DEFAULT_CONFIG.labelTransparency;//"1";
        }
        this.config.labelTransparency = configObj.labelTransparency;
        this.labelTransparency.setValues({"transparency": this.config.labelTransparency});

        if ("undefined" === typeof configObj.haloSize || "" === configObj.haloSize) {
          configObj.haloSize = this._DEFAULT_CONFIG.haloSize;//"1";

        }
        this.config.haloSize = configObj.haloSize;
        this.haloSizeSelect.set("value", configObj.haloSize);

        if ("undefined" === typeof configObj.haloColor || "" === configObj.haloColor) {
          configObj.haloColor = this._DEFAULT_CONFIG.haloColor;//"#FFFFFF";
        }
        this.config.haloColor = configObj.haloColor;

        html.setStyle(this.textColorPicker.domNode, "backgroundColor", this.config.textColor);
        this.textColorPicker.picker.refreshRecords();
        this.textColorPicker.picker.setColor(this.config.textColor, false, true);

        html.setStyle(this.haloColorPicker.domNode, "backgroundColor", this.config.haloColor);
        this.haloColorPicker.picker.refreshRecords();
        this.haloColorPicker.picker.setColor(this.config.haloColor, false, true);

        if ("undefined" === typeof configObj.haloOn || "" === configObj.haloOn) {
          configObj.haloOn = this._DEFAULT_CONFIG.haloOn;//"#FFFFFF";
        }
        this.showHalo.set("checked",this.config.haloOn);
      },

      // click handle o bold italic and underline
      _clickHandlerOfBoldItalicUnderline: function (refDom, refDomText) {
        var fontObj, isClick, Obj;
        isClick = !html.hasClass(refDom, "selected");
        fontObj = {
          fontFamily: this.config.font.fontFamily,
          bold: this.config.font.bold,
          italic: this.config.font.italic,
          underline: this.config.font.underline
        };
        if (refDomText === "bold") {
          fontObj.bold = isClick;
        }
        else if (refDomText === "italic") {
          fontObj.italic = isClick;
        } else {
          fontObj.underline = isClick;
        }
        Obj = {};
        Obj[refDomText] = isClick;
        this.fontBtnClickd(Obj);
        this.onSettingChange({
          font: fontObj
        });
      },

      setTextSize: function (size) {
        if (size !== this.textSizeSelect.getValue()) {
          this.textSizeSelect.set("value", size);
        }

        if (size !== this.textSizeSlider.getValue()) {
          if (size > this._MAX_TEXT_SIZE) {
            size = this._MAX_TEXT_SIZE;
          } else if (size < this._MIN_TEXT_SIZE) {
            size = this._MIN_TEXT_SIZE;
          }
          this.textSizeSlider.set("value", size);
        }
      },

      fontBtnClickd: function (fontConfig) {
        if (true === fontConfig.bold) {
          html.addClass(this.bold, "selected");
          domAttr.set(this.bold, "aria-pressed", "true");
        } else if (false === fontConfig.bold) {
          html.removeClass(this.bold, "selected");
          domAttr.set(this.bold, "aria-pressed", "false");
        }

        if (true === fontConfig.italic) {
          html.addClass(this.italic, "selected");
          domAttr.set(this.italic, "aria-pressed", "true");
        } else if (false === fontConfig.italic) {
          html.removeClass(this.italic, "selected");
          domAttr.set(this.italic, "aria-pressed", "false");
        }

        if (true === fontConfig.underline) {
          html.addClass(this.underline, "selected");
          domAttr.set(this.underline, "aria-pressed", "true");
        } else if (false === fontConfig.underline) {
          html.removeClass(this.underline, "selected");
          domAttr.set(this.underline, "aria-pressed", "false");
        }
      },

      _initAppearance: function () {
        if (this.appearance) {
          if (false === this.appearance.bold) {
            html.addClass(this.bold, "hide");
          }
          if (false === this.appearance.italic) {
            html.addClass(this.italic, "hide");
          }
          if (false === this.appearance.underline) {
            html.addClass(this.underline, "hide");
          }
        }
      }
    });
  });