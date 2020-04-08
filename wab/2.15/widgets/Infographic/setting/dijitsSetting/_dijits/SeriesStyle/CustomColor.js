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
    'dojo/text!./CustomColor.html',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    '../ChartColorSetting',
    'jimu/dijit/ColorPickerPopup',
    './CustomColorList',
    '../../../utils',
    'dojo/on',
    'dojo/_base/Color',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/store/Memory',
    './CustomCombox',
    'jimu/dijit/LoadingIndicator'
  ],
  function(declare, templateString, Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    ChartColorSetting, ColorPickerPopup,
    CustomColorList, utils, on, Color, lang, html, Memory, CustomCombox) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-custom-color',
      templateString: templateString,
      _explicitNum: 5,
      // categories structure:
      // id: string|number,
      // text: string,
      // label: string,
      // color: string

      // select input structure:
      // id: string|number,
      // name: string

      constructor: function() {
        this.inherited(arguments);
      },

      postCreate: function() {
        this.inherited(arguments);
        this._ignoreEvent();
        this._initDom();
        this._initEvents();
        this._updateColorArray();
        this._careEvent();
      },

      setConfig: function(config) {
        if (!config || !Array.isArray(config.categories)) {
          return;
        }
        this._ignoreEvent();
        this._spliteOriginData(config.categories);
        this._renderSelectInput();
        this.customColorList.setConfig(config);
        this._careEvent();
      },

      getConfig: function() {
        if (this.customColorList) {
          return this.customColorList.getConfig();
        } else {
          return false;
        }
      },

      _onChange: function() {
        if (this.ignoreChangeEvents) {
          return;
        }
        var config = this.getConfig();
        if (config) {
          this.emit('change', config);
        }
      },

      _onDoAddClick: function() {
        var name = this.selectInput.get('value');

        var id = this._getComboxStoreIdByName(this.selectInput, name);
        if (!id && id !== 0) {
          id = name;
        } else {
          if (this.numberType) {
            id = Number(id);
          }
        }
        if (!id && id !== 0) {
          return;
        }
        this.selectInput.state = "Normal";
        var ids = this._getIds(this._explicitsData);
        if (ids.indexOf(id) > -1) {
          this.selectInput.focused = true;
          this.selectInput.state = "Error";
          this.selectInput.displayMessage(this.nls.categoryExists);
          return;
        }
        var color = this.singleColorPicker.getColor();

        this._transferData(id, true, color);
        this._renderSelectInput();

        this._showAddCategoryDisptch();
        var newColorItem = {
          id: id,
          text: name,
          label: name,
          color: color
        };
        this.customColorList.addNewColorItem(newColorItem, true);
      },

      _onCancelClick: function(event) {
        event.stopPropagation();
        this._showAddCategoryDisptch();
      },

      _initDom: function() {
        //CUSTOM COMBOX
        this.selectInput = new CustomCombox({
          placeHolder: this.nls.comboxHint,
          style: {
            width: '150px'
          }
        });
        this.selectInput.placeAt(this.addActionDiv, 'first');
        this.selectInput.disableInput();
        //vaild display message
        this.selectInput.invalidMessage = this.nls.categoryExists;

        this.colorsPicker = new ChartColorSetting();
        this.colorsPicker.placeAt(this.colorsPickerDiv);
        this.colorsPicker.setMode(false);

        this.customColorList = new CustomColorList({
          nls: this.nls
        });
        this.customColorList.placeAt(this.content);

        this.singleColorPicker = new ColorPickerPopup({
          appearance: {
            showTransparent: false,
            showColorPalette: true,
            showCoustom: true,
            showCoustomRecord: true
          }
        });
        this.singleColorPicker.placeAt(this.colorDiv);
        this.singleColorPicker.startup();
      },

      _initEvents: function() {
        this.own(on(this.customColorList, 'change', lang.hitch(this, function() {
          this._onChange();
        })));
        this.own(on(this.colorsPicker, 'change', lang.hitch(this, function() {
          this._updateColorArray(true);
        })));
        this.own(on(this.customColorList, 'delete', lang.hitch(this, function(id) {
          this._transferData(id, false);
          this._renderSelectInput();
        })));
      },

      _updateSeelectInputState: function() {
        if (!this.selectInput) {
          return;
        }
        if (this.isCodedValueType) {
          this.selectInput.disableInput();
          this.selectInput.set('placeHolder', this.nls.comboxDisableInputHint);
          this.selectInput.setTitle(this.nls.comboxDisableInputHint);
        } else {
          this.selectInput.enableInput();
          this.selectInput.set('placeHolder', this.nls.comboxHint);
          this.selectInput.setTitle(this.nls.comboxHint);
        }

        if (!this._implicitsData || !this._implicitsData.length) {
          if (this.isCodedValueType) {
            this.selectInput.set('placeHolder', this.nls.comboxDisableInputEmptySelectHint);
            this.selectInput.setTitle(this.nls.comboxDisableInputEmptySelectHint);
          } else {
            this.selectInput.set('placeHolder', this.nls.comboxDisableSelectHint);
            this.selectInput.setTitle(this.nls.comboxDisableSelectHint);
          }
        }
      },

      setOriginalData: function(data, isCodedValueType, numberType) {
        this.isCodedValueType = isCodedValueType;
        this.numberType = numberType;
        this.customColorList.setNumberType(numberType);
        this._originalData = [];
        this._explicitsData = [];
        this._implicitsData = [];
        this._originalData = data;
      },

      renderDefault: function() {
        if (!this._originalData || !this._originalData.length) {
          return;
        }
        this._spliteOriginData();
        this._renderSelectInput();
        this.customColorList.setConfig({
          categories: this._explicitsData
        });

      },

      _spliteOriginData: function(explicitsData) {
        var arrs = this._originalData;
        var num = this._explicitNum;
        var color;
        if (!explicitsData) {
          if (arrs && arrs.length) {
            this._explicitsData = arrs.slice(0, num).map(function(e) {
              color = utils.getNextColor(this._colors, color);
              return this._generateExplicitData(e.value, e.label, color);
            }.bind(this));
            this._implicitsData = arrs.slice(num, arrs.length).map(function(e) {
              return this._generateImplicitData(e.value, e.label);
            }.bind(this));
          }
          this._updateSeelectInputState();
          return;
        }

        this._explicitsData = explicitsData;
        var _existIds = this._getIds(explicitsData);
        if (arrs && arrs.length) {
          this._implicitsData = arrs.filter(function(e) {
            return _existIds.indexOf(e.value) < 0;
          }).map(function(e) {
            return this._generateImplicitData(e.value, e.label);
          }.bind(this));
        }
        this._updateSeelectInputState();
      },

      _getIds: function(data) {
        return data.map(function(e) {
          return e.id;
        });
      },

      _transferData: function(id, isExplicit, color) {
        var newExplicit, newImplicit;
        var label = this._getLabel(id);
        if (!label) {
          if (isExplicit) {
            newExplicit = this._generateExplicitData(id, id, color);
            this._explicitsData.push(newExplicit);
          } else {
            this._explicitsData = this._explicitsData.filter(function(e) {
              return e.id !== id;
            });
          }
        } else {
          if (isExplicit) {
            newExplicit = this._generateExplicitData(id, label, color);
            this._explicitsData.push(newExplicit);
            this._implicitsData = this._implicitsData.filter(function(e) {
              return e.id !== id;
            });
          } else {
            newImplicit = this._generateImplicitData(id, label);
            this._implicitsData.push(newImplicit);
            this._explicitsData = this._explicitsData.filter(function(e) {
              return e.id !== id;
            });
          }
        }
        this._updateSeelectInputState();
      },

      _generateImplicitData: function(id, label) {
        return {
          id: id,
          name: label
        };
      },

      _generateExplicitData: function(id, label, color) {
        return {
          id: id,
          text: label,
          label: label,
          color: color
        };
      },

      _getLabel: function(id) {
        var data = this._originalData.filter(function(e) {
          return e.value === id;
        })[0];
        return data && data.label;
      },

      _renderSelectInput: function() {
        var stateStore = new Memory({
          data: this._implicitsData
        });
        this.selectInput.store = stateStore;
        this.selectInput.setValue('');
      },

      _onAddCategoryClick: function(event) {
        event.stopPropagation();
        var colors = this.colorsPicker.getColors();
        this._lastColor = utils.getNextColor(colors, this._lastColor);
        this.singleColorPicker.setColor(new Color(this._lastColor));
        this._showAddCategoryAction();
      },

      _showAddCategoryDisptch: function() {
        html.removeClass(this.dispatchAdd, 'hide');
        html.addClass(this.actionAdd, 'hide');
        this.selectInput.setValue('');
      },

      _showAddCategoryAction: function() {
        html.addClass(this.dispatchAdd, 'hide');
        html.removeClass(this.actionAdd, 'hide');
      },

      _ignoreEvent: function() {
        this.ignoreChangeEvents = true;
      },

      _careEvent: function() {
        setTimeout(function() {
          this.ignoreChangeEvents = false;
        }.bind(this), 100);
      },

      _getComboxStoreIdByName: function(combox, name) {
        var id;
        if (combox && combox.store && combox.store.data && combox.store.data.length) {
          var data = combox.store.data;
          var matchDataItem = data.filter(function(item) {
            return item.name === name;
          })[0];
          if (matchDataItem && typeof matchDataItem.id !== 'undefined') {
            id = matchDataItem.id;
          }
        }
        return id;
      },

      _updateColorArray: function(updateList) {
        var colors = this.colorsPicker.getColors();
        if (colors.length === 2) {
          colors = utils.separationGradientColors(colors, 6);
        }
        this._colors = colors;
        if (updateList && this.customColorList) {
          this.customColorList.setColors(colors);
        }
      }

    });
  });