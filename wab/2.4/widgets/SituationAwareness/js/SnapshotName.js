///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define(['dojo/_base/declare',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/dom-class',
  'dojo/on',
  'dojo/query',
  'jimu/BaseWidget',
  'dojo/text!./SnapshotName.html',
  'dojo/Evented',
  'dijit/form/ValidationTextBox'],
function (declare,
  _WidgetsInTemplateMixin,
  lang,
  html,
  domClass,
  on,
  query,
  BaseWidget,
  template,
  Evented) {
  return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
    templateString: template,
    baseClass: 'jimu-widget-SAT-snapshot-name',

    constructor: function () {

    },

    postMixInProperties: function () {
      this.inherited(arguments);
      this.nls.common = window.jimuNls.common;
    },

    postCreate: function () {
      this.inherited(arguments);
      this.nameSpan.innerHTML = this.nls.common.name + ":";

      this.startup();
    },

    startup: function () {
      this.snapshotName.invalidMessage = this.nls.invalid_snapshot_name;
      this.snapshotName.validator = this.checkString;

      this.btnCancel.innerText = this.nls.common.cancel;
      this.own(on(this.btnCancel, 'click', lang.hitch(this, function () {
        this.emit('cancel');
      })));

      this.btnOk.innerText = this.nls.common.ok;
      this.own(on(this.btnOk, 'click', lang.hitch(this, function () {
        if (!domClass.contains(this.btnOk, 'jimu-state-disabled')) {
          this.emit('ok', this.snapshotName.value.trim());
        }
      })));
    },

    checkString: function (val) {
      var v = val.trim();
      //less than 50 characters and has alphanumeric characters can contain spaces and underscores
      var valid = (v.length < 50) && /^[\w ]+$/.test(v) ? true : false;
      var s = query('.snapshot-name-footer')[0];
      if (s) {
        if (!valid) {
          html.addClass(s.children[0], 'jimu-state-disabled');
        } else {
          html.removeClass(s.children[0], 'jimu-state-disabled');
        }
      }
      return valid;
    },

    destroy: function () {

    }
  });
});
