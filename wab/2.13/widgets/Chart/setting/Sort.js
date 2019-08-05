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
    'dojo/_base/html',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/Evented',
    'dojo/text!./Sort.html',
    './UpdownArrow',
    './utils',
    'dijit/form/RadioButton',
    'dijit/form/Select'
  ],
  function(declare, html, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented,
    template, UpdownArrow, utils) {
    return declare([_WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-chart-setting-sort',
      templateString: template,

      //config
      //isLabelAxis boolean
      //isAsc boolean
      //field string

      postCreate: function() {
        this.inherited(arguments);
        this._initSelf();
      },

      getConfig: function() {
        var isAsc;
        var isLabelAxis = this.labelRadio.checked;
        if (isLabelAxis) {
          isAsc = this.labelSortDir.getState();
        } else {
          isAsc = this.valueSortDir.getState();
        }
        var config = {
          isLabelAxis: isLabelAxis,
          isAsc: isAsc
        };
        var showValueActions = !html.hasClass(this.valueActionDiv, 'hide');
        var showField = !html.hasClass(this.sortFieldDiv, 'hide');
        if (showValueActions && showField) {
          config.field = this.sortField.get('value');
        }
        return config;
      },

      setConfig: function(config) {
        if (!config) {
          return;
        }
        var isLabelAxis = config.isLabelAxis;
        var isAsc = config.isAsc;
        this.labelRadio.setChecked(isLabelAxis);
        this.valueRadio.setChecked(!isLabelAxis);
        this.labelSortDir.setState(isAsc);
        this.valueSortDir.setState(isAsc);
        if (config.field) {
          this.sortField.set('value', config.field);
        }
      },

      setFieldOptions: function(fieldOption) {
        if (!fieldOption) {
          this._clearSortFields();
          this._hideFieldSelect();
          return;
        }
        this._showFieldSelect();
        var field = this.sortField.get('value');
        this._clearSortFields();
        utils.updateOptions(this.sortField, fieldOption, field);
      },

      reset: function(clearField) {
        this.labelRadio.setChecked(true);
        this._showLabelActionsDiv();
        this.labelSortDir.setState(true);
        this.valueSortDir.setState(true);
        this._hideFieldSelect();
        if (clearField) {
          this._clearSortFields();
        }
      },

      _initSelf: function() {
        this.labelSortDir = new UpdownArrow();
        this.labelSortDir.placeAt(this.labelSortArrowDiv);

        this.valueSortDir = new UpdownArrow();
        this.valueSortDir.placeAt(this.valueSortArrowDiv);
      },

      _onLabelRadioChanged: function(check) {
        if (check) {
          this._showLabelActionsDiv();
        } else {
          this._showValueActionsDiv();
        }
      },

      _clearSortFields: function() {
        this.sortField.removeOption(this.sortField.getOptions());
        this.sortField.set('value');
      },

      _showFieldSelect: function() {
        html.removeClass(this.sortFieldDiv, 'hide');
      },

      _hideFieldSelect: function() {
        html.addClass(this.sortFieldDiv, 'hide');
      },

      _showLabelActionsDiv: function() {
        html.removeClass(this.labelActionDiv, 'hide');
        html.addClass(this.valueActionDiv, 'hide');
      },

      _showValueActionsDiv: function() {
        html.addClass(this.labelActionDiv, 'hide');
        html.removeClass(this.valueActionDiv, 'hide');
      }

    });
  });