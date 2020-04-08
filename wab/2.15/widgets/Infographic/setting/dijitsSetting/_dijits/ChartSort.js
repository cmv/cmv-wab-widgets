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
    'dojo/query',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/text!./ChartSort.html',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    '../../utils',
    'dijit/form/RadioButton',
    'dijit/form/Select'
  ],
  function(declare, query, lang, html, templateString, Evented,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, utils) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-chart-sort',
      templateString: templateString,
      mode: '',
      //options
      //  mode
      //  fieldOption:null

      //config
      //  isLabelAxis:boolean
      //  isAsc:boolean
      //  field:''

      setMode: function(mode) {
        this._ignoreEvent();
        this.mode = mode;
        this._updateNodesByMode(mode);
        this._careEvent();
      },

      setFields: function(fieldOption) {
        this._ignoreEvent();
        var field = this.sortField.get('value');
        this._clearSortFields();
        utils.updateOptions(this.sortField, fieldOption);
        utils.updateOptions(this.sortField, null, field);
        this._careEvent();

      },

      reset: function() {
        this._ignoreEvent();
        this._clearSortFields();
        this._setDefaultRadio();
        this._resetPartItemDisplay();
        this._resetTdItemDisplay();
        this._careEvent();
      },

      _onChange: function() {
        if (this.ignoreChangeEvents) {
          return;
        }
        this.emit('change');
      },

      getConfig: function() {
        var isAsc = this._isAsc();
        var field;
        if (this.mode === 'feature' || this.mode === 'category') {
          field = this.sortField.get('value');
        }
        var isLabelAxis;
        if (this.mode !== 'feature') {
          isLabelAxis = this.xAxisRadio.get('value');
        }
        var config = {
          isAsc: isAsc
        };
        if (field) {
          config.field = field;
        }
        if (typeof isLabelAxis !== 'undefined') {
          config.isLabelAxis = isLabelAxis;
        }
        return config;
      },

      setConfig: function(config) {
        this._ignoreEvent();

        if (typeof config.isLabelAxis !== 'undefined') {
          if (config.isLabelAxis) {
            this.xAxisRadio.setChecked(true);
          } else {
            this.yAxisRadio.setChecked(true);
          }

          this._axisRadioTriger(config.isLabelAxis);
        }
        this._selectSortBtn(config.isAsc);

        if (config.field) {
          utils.updateOptions(this.sortField, null, config.field);
        }
        this._careEvent();
      },

      /* tool methods */
      _showSortFieldTr: function() {
        html.removeClass(this.fieldSortPart, 'hide');
        html.removeClass(this.sortFieldDiv, 'hide');
      },

      _hideRadioPanel: function() {
        html.addClass(this.radioDiv, 'hide');
      },

      _showRadioPanel: function() {
        html.removeClass(this.radioDiv, 'hide');
      },

      _isAsc: function() {
        var sortBtn = null;
        if (this.mode === 'feature') {
          sortBtn = query('.asc.sort-icon', this.zSortBtn);
        } else {
          var isXRadio = this.xAxisRadio.checked;
          if (isXRadio) {
            sortBtn = query('.asc.sort-icon', this.xSortBtn);
          } else {
            sortBtn = query('.asc.sort-icon', this.ySortBtn);
          }
        }
        if (!sortBtn || !sortBtn[0]) {
          return;
        }
        return html.hasClass(sortBtn[0], 'selected');
      },

      _selectSortBtn: function(isAsc) {
        var ascNodes = query('.asc.sort-icon', this.domNode);
        var descNodes = query('.desc.sort-icon', this.domNode);
        if (isAsc) {
          ascNodes.addClass('selected');
          descNodes.removeClass('selected');
        } else {
          ascNodes.removeClass('selected');
          descNodes.addClass('selected');
        }
      },

      _updateNodesByMode: function(mode) {
        if (!mode) {
          return;
        }
        mode = mode === 'feature' ? mode : 'other';
        this._updatePartItemDisplayByMode(mode);
        this._updateTdItemDisplayByMode(mode);
      },

      _updateTdItemDisplayByMode: function(mode) {
        var className = mode + '-mode-sort';
        var tdItems = query('.axis-tr .td-item', this.domNode);

        tdItems.forEach(lang.hitch(this, function(tdItem) {
          if (html.hasClass(tdItem, className)) {
            html.removeClass(tdItem, 'hide');
          } else {
            html.addClass(tdItem, 'hide');
          }
        }));
      },

      _updatePartItemDisplayByMode: function(mode) {
        var className = mode + '-mode-sort';
        var partItems = query('.part-item', this.domNode);

        partItems.forEach(lang.hitch(this, function(partItem) {
          if (html.hasClass(partItem, className)) {
            html.removeClass(partItem, 'hide');
          } else {
            html.addClass(partItem, 'hide');
          }
        }));
      },

      _resetTdItemDisplay: function() {
        var tdItems = query('.axis-tr .td-item', this.domNode);
        tdItems.forEach(lang.hitch(this, function(tdItem) {
          html.removeClass(tdItem, 'hide');
        }));
      },

      _resetPartItemDisplay: function() {
        var tdItems = query('.part-item', this.domNode);
        tdItems.forEach(lang.hitch(this, function(tdItem) {
          html.removeClass(tdItem, 'hide');
        }));
      },

      _setDefaultRadio: function() {
        this.xAxisRadio.set('value', true);
      },

      _clearSortFields: function() {
        this.sortField.removeOption(this.sortField.getOptions());
        this.sortField.set('value');
      },

      _ignoreEvent: function() {
        this.ignoreChangeEvents = true;
      },

      _careEvent: function() {
        setTimeout(function() {
          this.ignoreChangeEvents = false;
        }.bind(this), 200);
      },

      _showSort: function(type) {
        html.addClass(this.xAxisSortDiv, 'hide');
        html.addClass(this.yAxisSortDiv, 'hide');
        html.addClass(this.zAxisSortDiv, 'hide');
        if (type === 'x') {
          html.removeClass(this.xAxisSortDiv, 'hide');
        } else if (type === 'y') {
          html.removeClass(this.yAxisSortDiv, 'hide');
        } else if (type === 'z') {
          html.removeClass(this.zAxisSortDiv, 'hide');
        }
      },

      _axisRadioTriger: function(check) {
        if (check) {
          this._showSort('x');
        } else {
          this._showSort('y');
          if (this.mode === 'category') {
            this._showSortFieldTr();
          }
        }
      },

      /* changed*/
      _onXaxisRadioChanged: function(check) {
        if (this.ignoreChangeEvents) {
          return;
        }
        this._axisRadioTriger(check);
        this._onChange();
      },

      _onSortBtnClicked: function(e) {
        e.stopPropagation();
        var target = e.target;
        if (html.hasClass(target, 'asc')) {
          this._selectSortBtn(true);
        } else if (html.hasClass(target, 'desc')) {
          this._selectSortBtn(false);
        }
        if (this.ignoreChangeEvents) {
          return;
        }
        this._onChange();
      },

      _onSortFieldsChanged: function() {
        if (this.ignoreChangeEvents) {
          return;
        }
        this._onChange();
      }
    });
  });