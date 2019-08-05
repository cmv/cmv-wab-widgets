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
    'dojo/on',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/Evented',
    'dojo/text!./UpdownArrow.html'
  ],
  function(declare, html, on, _WidgetBase, _TemplatedMixin, Evented, template) {
    return declare([_WidgetBase, Evented, _TemplatedMixin], {
      baseClass: 'jimu-widget-chart-setting-updown-arrow',
      templateString: template,
      state: true,
      //public methods:
      //setState
      //getState

      postCreate: function() {
        this.inherited(arguments);
        this.own(on(this.domNode, 'click', this._onDomClicked.bind(this)));
      },

      setState: function(state) {
        this.state = state;
        if (state) {
          this._selectAscBtn();
        } else {
          this._selectDescBtn();
        }
      },

      getState: function() {
        return this.state;
      },

      _onDomClicked: function(e) {
        e.stopPropagation();
        var target = e.target;
        if (html.hasClass(target, 'asc')) {
          this.state = true;
          this._selectAscBtn();
        } else if (html.hasClass(target, 'desc')) {
          this.state = false;
          this._selectDescBtn();
        }

        this._onChange();
      },

      _onChange: function() {
        this.emit('change');
      },

      _selectAscBtn: function() {
        html.addClass(this.upper, 'selected');
        html.removeClass(this.down, 'selected');
      },

      _selectDescBtn: function() {
        html.removeClass(this.upper, 'selected');
        html.addClass(this.down, 'selected');
      }

    });
  });