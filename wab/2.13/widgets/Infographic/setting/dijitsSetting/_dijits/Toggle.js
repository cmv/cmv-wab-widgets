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
    'dijit/_TemplatedMixin'
  ],
  function(declare, lang, on, html, Evented, _WidgetBase, _TemplatedMixin) {

    return declare([_WidgetBase, _TemplatedMixin, Evented], {
      baseClass: 'infographic-toggle-button',
      templateString: '<div><div data-dojo-attach-point="toggleBtn" class="toggle toggle-off"></div></div>',
      //config
      // state

      state: false,

      //events:
      //change

      postCreate: function() {
        this.inherited(arguments);
        this.own(on(this.toggleBtn, 'click', lang.hitch(this, function() {
          this.setState(!this.state);
          this.emit('change', this.state);
        })));
      },

      setState: function(state) {
        this.state = state;
        if (this.state) {
          this._open();
        } else {
          this._close();
        }
      },

      getState: function() {
        return !!this.state;
      },

      _open: function() {
        html.removeClass(this.toggleBtn, 'toggle-off');
        html.addClass(this.toggleBtn, 'toggle-on');
      },

      _close: function() {
        html.removeClass(this.toggleBtn, 'toggle-on');
        html.addClass(this.toggleBtn, 'toggle-off');
      }

    });
  });