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
    "dojo/_base/lang",
    'dojo/_base/html',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./FieldStatistics.html',
    '../../../utils',
    "dijit/form/RadioButton",
    "dijit/form/Select"
  ],
  function(declare, lang, html, Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    template, utils) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-field-statistics',
      templateString: template,

      //config
      //  type: 'count' | 'sum' | 'avg' | 'max' | 'min'
      //  field: ''

      getConfig: function() {
        if (!this.isValid()) {
          return false;
        }
        var type = this.operationSelect.get('value');
        var field;
        if (type !== 'count') {
          field = this.fieldSelect.get('value');
        }
        var config = {
          type: type
        };
        if (field) {
          config.field = field;
        }
        return config;
      },

      isValid: function() {
        var type = this.operationSelect.get('value');
        var field = this.fieldSelect.get('value');
        if (type !== 'count') {
          return !!field;
        } else {
          return true;
        }
      },

      setConfig: function(config) {
        if (!config || !config.type) {
          return;
        }
        this._ignoreEvent = true;
        var type = config.type;
        var field = config.field;

        if (type) {
          utils.updateOptions(this.operationSelect, null, type);
        }

        if (field) {
          utils.updateOptions(this.fieldSelect, null, field);
        }
        setTimeout(function() {
          this._ignoreEvent = false;
        }.bind(this), 200);
      },

      setLayerDefinition: function(definition) {
        if (definition) {
          this.definition = definition;
          this._fillFieldsSelect(definition);
        }
      },

      reset: function() {
        this.operationSelect.set('value', 'count');
        this.fieldSelect.removeOption(this.fieldSelect.getOptions());
      },

      _onChange: function() {
        if (this._ignoreEvent) {
          return;
        }
        if (this.isValid()) {
          this.emit('change');
        }
      },

      _fillFieldsSelect: function(definition) {
        var fields = this._getFields(definition);
        if (!fields) {
          return;
        }
        var fieldOptions = utils.getFieldSelectOptions(fields);
        this.fieldSelect.removeOption(this.fieldSelect.getOptions());
        this.fieldSelect.set('value');
        this.fieldSelect.addOption(fieldOptions);
      },

      _getFields: function(definition) {
        if (!definition) {
          return;
        }
        var fieldInfos = lang.clone(definition.fields);
        if (!fieldInfos || !fieldInfos.length) {
          return;
        }
        var groupByField = definition.groupByFields && definition.groupByFields[0];
        var fields = fieldInfos.filter(function(f) {
          return f.name !== groupByField;
        });
        return utils.getNumberFields(fields);
      },

      _onOperationChanged: function(operation) {
        if (operation === 'count') {
          this._hideFieldContainer();
        } else {
          this._showFieldContainer();
        }
        this._onChange();
      },

      _onFieldSelectChanged: function() {
        this._onChange();
      },

      _showFieldContainer: function() {
        html.removeClass(this.fieldContaiber, 'hide');
      },

      _hideFieldContainer: function() {
        html.addClass(this.fieldContaiber, 'hide');
      }

    });
  });