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
    'dojo/_base/html',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./RangeProvider.html',
    './StatRange',
    'dijit/form/RadioButton',
    "dijit/form/Select",
    'dijit/form/NumberTextBox'
  ],
  function(declare, Evented, on, html, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    template, StatRange) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infograpgic-range-provider',
      templateString: template,

      // config
      //   type: 'fixed' | 'stat'
      //   value: number | stat config

      postCreate: function() {
        this.inherited(arguments);
        this._setTitle();
        this._initUI();
      },

      reset: function() {
        this._onFixedValueBtnClick();
        this._showFixedValueContainer();
        this.fixedValue.reset();
        if (this.statRange) {
          this.statRange.reset();
        }
      },

      setConfig: function(config) {
        var type = config.type;
        var value = config.value;
        if (type === 'fixed') {
          this._onFixedValueBtnClick();
          this._showFixedValueContainer();
          this.fixedValue.set('value', value);
          if (this.statRange) {
            this.statRange.setConfig({});
          }
        } else {
          this._onStatBtnClick();
          this._showStatContainer();
          if (this.statRange) {
            this.statRange.setConfig(value);
          }
        }
      },

      getConfig: function() {
        if (!this.isValid()) {
          return false;
        }

        var type = this._getType();
        var value;
        if (type === 'fixed') {
          value = this.fixedValue.get('value');
        } else {
          value = this.statRange.getConfig();
        }

        return {
          type: type,
          value: value
        };
      },

      isValid: function() {
        var type = this._getType();
        if (type === 'fixed') {
          return this.fixedValue.isValid();
        } else {
          return this.statRange.isValid();
        }
      },

      setLayerDefinition: function(definition) {
        if (!definition) {
          return;
        }
        if (this.statRange) {
          this.statRange.setLayerDefinition(definition);
        }
      },

      _setTitle: function() {
        var title = typeof this.titleText !== 'undefined' ? this.titleText : '$Value';
        this.title.innerHTML = title;
      },

      _initUI: function() {
        this.statRange = new StatRange({
          nls: this.nls,
          appConfig: this.appConfig
        });
        this.statRange.placeAt(this.statContainer);
        this.own(on(this.statRange, 'change', function() {
          this._onChange();
        }.bind(this)));
        this.own(on(this.statRange, 'ds-change', function(frameWorkDsId) {
          this._onDataSourceChanged(frameWorkDsId);
        }.bind(this)));
      },

      _onDataSourceChanged: function(id) {
        this.emit('ds-change', id);
      },

      _onChange: function() {
        if (this.isValid()) {
          this.emit('change');
        }
      },

      _getType: function() {
        if (html.hasClass(this.fixedBtn, 'selected')) {
          return 'fixed';
        }
        return 'stat';
      },

      _onValueTypeChanged: function(evt) {
        evt.stopPropagation();
        var target = evt.target;
        var type = target.dataset.name;
        if (type !== 'fixed' && type !== 'stat') {
          return;
        }
        if (type === 'fixed') {
          this._onFixedValueBtnClick();
          this._showFixedValueContainer();
        } else {
          this._onStatBtnClick();
          this._showStatContainer();
        }
        setTimeout(function() {
          this._onChange();
        }.bind(this), 200);
      },

      _onValueInputChanged: function() {
        this._onChange();
      },

      _onFixedValueBtnClick: function() {
        html.removeClass(this.statBtn, 'selected');
        html.addClass(this.fixedBtn, 'selected');
      },

      _onStatBtnClick: function() {
        html.removeClass(this.fixedBtn, 'selected');
        html.addClass(this.statBtn, 'selected');
      },

      _showFixedValueContainer: function() {
        html.removeClass(this.valueContainer, 'hide');
        html.addClass(this.statContainer, 'hide');
      },

      _showStatContainer: function() {
        html.addClass(this.valueContainer, 'hide');
        html.removeClass(this.statContainer, 'hide');
      }
    });
  });