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
    './_SeriesStyleItem',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin'
  ],
  function(declare, on, lang, SeriesStyleItem, Evented,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-series-styles',
      templateString: '<div><div class="field-style-list"' +
        'data-dojo-attach-point="fieldStyleList"></div></div>',

      //public methods
      //updateConfig
      //setConfig
      //getConfig
      //setOpacityDisplay

      //event
      //change

      //config
      //[{
      //   name: '',
      //   style: {
      //     color: '',
      //     opacity: 1
      //   }
      // }]

      constructor: function() {
        this.inherited(arguments);
        this.cacheDijits = [];
      },

      _clear: function() {
        if (!this.cacheDijits || !Array.isArray(this.cacheDijits)) {
          return;
        }
        this.cacheDijits.forEach(function(item) {
          item.dijit.destroy();
        });
        this.cacheDijits = [];
      },

      _removeDuplicateConfig: function(configs) {
        if (!configs || configs.length < 2) {
          return configs;
        }
        var ret = {};
        return configs.filter(function(config) {
          var name = config.name;
          if (!ret[name]) {
            ret[name] = 1;
            return true;
          }
          return false;
        });
      },

      _classificationConfig: function(config) {
        config = this._removeDuplicateConfig(config);
        var classified = {
          destroyedDijits: [],
          updatedConfig: [],
          newAddedConfig: []
        };
        var keepDijitFields = [];

        var cacheFieldNames = this.cacheDijits.map(function(item) {
          return item.name;
        });

        config.forEach(function(cf) {
          if (cacheFieldNames.indexOf(cf.name) < 0) {
            classified.newAddedConfig.push(cf);
          } else {
            keepDijitFields.push(cf.name);
            classified.updatedConfig.push(cf);
          }
        });

        classified.destroyedDijits = this.cacheDijits.filter(function(item) {
          return keepDijitFields.indexOf(item.name) < 0;
        });

        return classified;
      },

      updateConfig: function(config) {
        var classifiedConfig = this._classificationConfig(config);

        var newAddedConfig = classifiedConfig.newAddedConfig;
        newAddedConfig.forEach(function(ncf) {
          this._addNewItem(ncf);
        }.bind(this));

        var updatedConfig = classifiedConfig.updatedConfig;
        updatedConfig.forEach(function(ucf) {
          this._updateItem(ucf);
        }.bind(this));

        var destroyedDijits = classifiedConfig.destroyedDijits;
        destroyedDijits.forEach(function(ddt) {
          this._destroyItem(ddt);
        }.bind(this));
        this._setOpacityDisplay();
      },

      setConfig: function(config) {
        if (!config || !Array.isArray(config)) {
          return;
        }
        this._clear();
        config.forEach(function(cf) {
          this._addNewItem(cf);
        }.bind(this));
        this._setOpacityDisplay();
      },

      _destroyItem: function(ddt) {
        this.cacheDijits = this.cacheDijits.filter(function(item) {
          return item.name !== ddt.name;
        });
        if (ddt.dijit && typeof ddt.dijit.destroy !== 'undefined') {
          ddt.dijit.destroy();
        }
      },

      _updateItem: function(ucf) {
        this.cacheDijits.forEach(function(item) {
          if (item.name === ucf.name) {
            item.dijit.setConfig(ucf);
          }
        });
      },

      _addNewItem: function(cf) {
        var chartFieldColorItem = null;
        chartFieldColorItem = new SeriesStyleItem({
          textVisible: true,
          colorSingleMode: true,
          opacityVisible: false
        });
        chartFieldColorItem.setConfig(cf);
        chartFieldColorItem.placeAt(this.fieldStyleList, 'last');
        this.own(on(chartFieldColorItem, 'change', lang.hitch(this, function() {
          this._onChange();
        })));

        var cacheDijit = {
          name: cf.name,
          dijit: chartFieldColorItem
        };
        this.cacheDijits.push(cacheDijit);
      },

      _onChange: function() {
        var config = this.getConfig();
        this.emit('change', config);
      },

      setOpacityDisplay: function(showOpacity) {
        this.showOpacity = showOpacity;
        this._setOpacityDisplay();
      },

      _setOpacityDisplay: function() {
        this.cacheDijits.forEach(function(colorItem) {
          colorItem.dijit.setOpacityDisplay(this.showOpacity);
        }.bind(this));
      },

      getConfig: function() {
        if (!this.cacheDijits || this.cacheDijits.length <= 0) {
          return [];
        }
        return this.cacheDijits.map(function(item) {
          return item.dijit.getConfig();
        });
      }

    });
  });