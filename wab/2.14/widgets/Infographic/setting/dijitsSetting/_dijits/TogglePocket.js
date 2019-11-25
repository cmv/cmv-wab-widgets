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
    "dojo/_base/lang",
    'dojo/on',
    'dojo/_base/html',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin'
  ],
  function(declare, lang, on, html, Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-toggle-pocket',
      templateString: '<div>' +
        '<div class="toggle-header">' +
        '<div data-dojo-attach-point="label" class="title"></div>' +
        '<div data-dojo-attach-point="toggle" class="toggle"></div>' +
        '</div><div class="horizontal-line"></div>' +
        '<div data-dojo-attach-point="pocket" class="pocket"></div></div>',
      //config
      // titleLabel
      // state
      // visibility
      // content //domNode

      state: false,
      visibility: true,

      //events:
      //change

      postCreate: function() {
        this.inherited(arguments);
        this._initUI();
        this._initEvent();
        html.addClass(this.domNode, this.baseClass);
      },

      setState: function(state) {
        this.state = !!state;
        this._switchState(this.state);
      },

      getState: function() {
        return !!this.state;
      },

      visible: function(){
        return this.visibility;
      },

      hide:function(){
        this.visibility = false;
        html.setStyle(this.domNode, 'display', 'none');
      },

      show:function(){
        this.visibility = true;
        html.setStyle(this.domNode, 'display', 'flex');
      },

      _initEvent: function() {
        this.own(on(this.toggle, 'click', lang.hitch(this, function() {
          this.state = !this.state;
          this._switchState(this.state);
          this.emit('change', this.state);
        })));
      },

      _initUI: function() {
        if (this.titleLabel) {
          this.label.innerHTML = this.titleLabel;
        }
        if (this.content) {
          html.place(this.content, this.pocket);
        }
        this._switchState(this.state);
        this._switchVisible(this.visibility);
      },

      _switchState: function(state) {
        if (state) {
          this._openPocket();
        } else {
          this._closePocket();
        }
      },

      _switchVisible: function(visibility) {
        if (visibility) {
          this.show();
        } else {
          this.hide();
        }
      },

      _openPocket: function() {
        html.removeClass(this.toggle, 'toggle-off');
        html.addClass(this.toggle, 'toggle-on');
        html.setStyle(this.pocket, 'display', '');
      },

      _closePocket: function() {
        html.removeClass(this.toggle, 'toggle-on');
        html.addClass(this.toggle, 'toggle-off');
        html.setStyle(this.pocket, 'display', 'none');
      }
    });
  });