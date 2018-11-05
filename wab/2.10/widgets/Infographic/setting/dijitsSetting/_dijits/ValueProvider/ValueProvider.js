///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
    'dojo/Evented',
    'dojo/on',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./ValueProvider.html',
    './FieldStatistics',
    'dijit/form/RadioButton',
    "dijit/form/Select",
    'dijit/form/NumberTextBox'
  ],
  function(declare, Evented, on, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    template, FieldStatistics) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infograpgic-value-provider',
      templateString: template,
      type: 'stat',
      // config
      //   type: 'stat',
      //   value: stat config

      postCreate: function() {
        this.inherited(arguments);
        this._setTitle();
        this._initUI();
      },

      reset: function() {
        if (this.statistics) {
          this.statistics.reset();
        }
      },

      setConfig: function(config) {
        var value = config.value;
        if (this.statistics) {
          this.statistics.setConfig(value);
        }
      },

      getConfig: function() {
        if (!this.isValid()) {
          return false;
        }

        var type = this.type;

        var value = this.statistics.getConfig();

        return {
          type: type,
          value: value
        };
      },

      isValid: function() {
        if (this.statistics) {
          return this.statistics.isValid();
        }
      },

      _onChange: function() {
        var config = this.getConfig();
        if (config) {
          this.emit('change', config);
        }
      },

      _setTitle: function() {
        var title = typeof this.titleText !== 'undefined' ? this.titleText : '$Value';
        this.title.innerHTML = title;
      },

      _initUI: function() {
        this.statistics = new FieldStatistics({
          nls: this.nls
        });
        this.statistics.placeAt(this.statContainer);
        this.own(on(this.statistics, 'change', function() {
          this._onChange();
        }.bind(this)));
      },

      setLayerDefinition: function(definition) {
        if (definition) {
          this.definition = definition;
        }
        if (this.statistics) {
          this.reset();
          this.statistics.setLayerDefinition(this.definition);
        }

      }

    });
  });