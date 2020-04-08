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
    './CustomColorItem',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/on',
    'dojo/_base/html',
    'dojo/_base/lang',
    '../../../utils'
  ],
  function(declare, CustomColorItem, Evented,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, on, html, lang, utils) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-custom-color-list',
      templateString: '<div>' +
        '<div class="costom-color-list-header">' +
        '<div title="${nls.category}">${nls.category}</div>' +
        '<div title="${nls.labelAxis}">${nls.labelAxis}</div>' +
        '<div title="${nls.color}">${nls.color}</div>' +
        '</div>' +
        '<div class="costom-color-list" data-dojo-attach-point="colorList"></div>' +
        '<div class="costom-color-list" data-dojo-attach-point="otherList"></div>' +
        '</div>',

      // public methods
      // setConfig -- Change events will not be triggered
      // setColors -- Trigger change event once
      // getConfig -- Return following configuration structure
      // setNumberType -- The ID data type of each item is set to number type
      // getListIds -- Return all config.cagegories's id
      // addNewColorItem
      // clear

      // config:
      //  categories:[{id,text,label,color}],
      //  others:[{id,text,label,color}]
      constructor: function(options) {
        this.inherited(arguments);

        this._colorItems = [];
        this._otherItems = [];

        if (options.nls) {
          this.nls = options.nls;
        }

        this.others = [{
          text: this.nls.nullText,
          label: this.nls.nullText,
          id: 'null',
          color: '#808080'
        }, {
          text: this.nls.others,
          label: this.nls.others,
          id: 'others',
          color: '#808080'
        }];
      },

      setConfig: function(config) {
        if (!config || !Array.isArray(config.categories)) {
          return;
        }

        this.clear();
        var categories = config.categories;
        categories = this._removeDuplicateCategories(categories);
        var others = config.others;
        if (!config.others || !config.others.length) {
          others = lang.clone(this.others);
        }

        this._setCategories(categories);
        this._setOthers(others);
      },

      setColors: function(colors) {
        this._colors = colors;
        if (!this._colorItems.length) {
          return;
        }
        this._ignoreEvent();
        this._colorItems.forEach(function(colorItem) {
          var color = utils.getNextColor(this._colors, this._lastColor);
          this._lastColor = color;
          colorItem.setColor(color);
        }.bind(this));
        this._careEvent();
        this._onChange();
      },

      setNumberType: function(numberType) {
        this.numberType = numberType;
        if (!this._colorItems.length) {
          return;
        }
        this._colorItems.forEach(function(colorItem) {
          colorItem.setNumberType(numberType);
        }.bind(this));
      },

      _setCategories: function(categories) {
        categories.forEach(function(cc) {
          this.addNewColorItem(cc);
        }.bind(this));
      },

      _setOthers: function(others) {
        if (!others || !others.length) {
          return;
        }
        others.forEach(function(oc) {
          this._addOtherColorItem(oc, oc.id === 'others');
        }.bind(this));
      },

      clear: function() {
        html.empty(this.colorList);
        html.empty(this.otherList);
        this._colorItems = [];
        this._otherItems = [];
      },

      _addOtherColorItem: function(oc, hideLabel) {
        var colorItem = new CustomColorItem({
          nls: this.nls,
          deletable: false,
          labelVisible: !hideLabel,
          numberType: false
        });
        colorItem.placeAt(this.otherList);
        colorItem.setConfig(oc);

        this._otherItems.push(colorItem);
        this._bindEvent(colorItem);
      },

      getListIds: function() {
        return this._colorItems.map(function(colorItem) {
          if (this.numberType) {
            return Number(colorItem.itemId);
          }
          return colorItem.itemId;
        }.bind(this));
      },

      addNewColorItem: function(cc, highlight) {
        var colorItem = new CustomColorItem({
          nls: this.nls,
          numberType: this.numberType
        });
        colorItem.placeAt(this.colorList);
        colorItem.setConfig(cc);
        if (highlight) {
          colorItem.highLight();
        }
        this._colorItems.push(colorItem);
        this._bindEvent(colorItem);
        this._onChange();
      },

      _bindEvent: function(dijit) {
        this.own(on(dijit, 'change', function() {
          this._onChange();
        }.bind(this)));

        this.own(on(dijit, 'delete', function(itemId) {
          this._colorItems = this._colorItems.filter(function(colorItem) {
            return colorItem.itemId !== itemId;
          }.bind(this));

          this._onChange();
          this.emit('delete', itemId);
        }.bind(this)));
      },

      getConfig: function() {
        if (!this._colorItems.length && !this._otherItems.length) {
          return false;
        }

        var categories = this._colorItems.map(function(colorItem) {
          return colorItem.getConfig();
        });

        categories = categories.filter(function(sc) {
          return !!sc;
        });

        var others = this._otherItems.map(function(otherItem) {
          return otherItem.getConfig();
        });

        others = others.filter(function(sc) {
          return !!sc;
        });

        return {
          categories: categories,
          others: others
        };
      },

      _removeDuplicateCategories: function(categories) {
        if (!categories || categories.length < 2) {
          return categories;
        }
        var ret = {};
        return categories.filter(function(e) {
          var id = e.id;
          if (!ret[id]) {
            ret[id] = 1;
            return true;
          }
          return false;
        });
      },

      _ignoreEvent: function() {
        this.ignoreChangeEvents = true;
      },

      _careEvent: function() {
        this.ignoreChangeEvents = false;
      },

      _onChange: function() {
        if (this.ignoreChangeEvents) {
          return;
        }
        var config = this.getConfig();
        if (config) {
          this.emit('change', config);
        }
      }

    });
  });