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
    'dojo/Evented',
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./DashTypeSelect.html',
    'dijit/form/Select'
  ],
  function(Evented, declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      templateString: template,
      baseClass: 'mark-dash-type',

      getValue: function() {
        return this.dashSelect.get('value');
      },

      setValue: function(value) {
        this.ignoreEvent = true;
        this.dashSelect.set('value', value);
        setTimeout(function() {
          this.ignoreEvent = false;
        }.bind(this), 200);
      },

      _onDashTypeChanged: function() {
        if (this.ignoreEvent) {
          return;
        }
        var value = this.getValue();
        this.emit('change', value);
      }

    });

  });