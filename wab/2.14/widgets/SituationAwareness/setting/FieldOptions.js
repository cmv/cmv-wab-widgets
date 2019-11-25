///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
  'dijit/form/ValidationTextBox',
  'dojo/_base/lang',
  'dojo/dom-class',
  'dojo/on',
  'jimu/BaseWidget',
  'dojo/text!./FieldOptions.html',
  'dojo/Evented',
  'jimu/dijit/CheckBox'],
function (declare,
  _WidgetsInTemplateMixin,
  ValidationTextBox,
  lang,
  domClass,
  on,
  BaseWidget,
  template,
  Evented,
  CheckBox) {
  return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
    templateString: template,
    baseClass: 'jimu-widget-SAT-setting',
    _modify: false,
    row: undefined,

    constructor: function (args) {
      this.row = args.tr;
    },

    postCreate: function () {
      this.inherited(arguments);
      this.startup();
    },

    startup: function () {
      this.own(on(this.btnCancel, 'click', lang.hitch(this, function () {
        this.emit('cancel');
      })));

      this.own(on(this.btnOk, 'click', lang.hitch(this, function () {
        if (!domClass.contains(this.btnOk, 'jimu-state-disabled')) {
          this.emit('ok', {
            modify: this._modify,
            round: this.rdo_round.get('checked'),
            truncate: this.rdo_truncate.get('checked'),
            roundPlaces: this.roundPlaces.textBox.value,
            truncatePlaces: this.truncatePlaces.textBox.value
          });
        }
      })));

      //set the inital state of the popup controls
      this._initPopup();
    },

    _initPopup: function () {
      //init radio buttons
      this._initRadio();

      //init validation boxes
      var roundPlaces = typeof(this.row.roundPlaces) !== 'undefined' ? this.row.roundPlaces : 2;
      this._initValidationTextBox(this.roundPlaces, roundPlaces);

      var truncatePlaces = typeof(this.row.truncatePlaces) !== 'undefined' ? this.row.truncatePlaces : 2;
      this._initValidationTextBox(this.truncatePlaces, truncatePlaces);

      //init checkbox
      var modifyEnabled = typeof(this.row.modify) !== 'undefined' ? this.row.modify : false;
      this._initCheckBox(modifyEnabled);
      this.chkModifyChanged(modifyEnabled);
    },

    _initValidationTextBox: function (node, v) {
      var validateBox = new ValidationTextBox({
        style: {
          width: "60px",
          height: "30px"
        }
      });
      validateBox.invalidMessage = this.nls.validatePlaces;
      validateBox.placeAt(node);
      validateBox.startup();
      validateBox.validator = lang.hitch(this, this._validatePlaces);
      validateBox.set('value', v);
      node.textBox = validateBox;
    },

    _validatePlaces: function (v) {
      var isValid = /^\d+$/.test(v);
      if (isValid) {
        this._enableOk();
      } else {
        this._disableOk();
      }
      return isValid;
    },

    _initRadio: function () {
      this.own(on(this.rdo_round, 'change', lang.hitch(this, this.rdoChanged)));
      this.own(on(this.rdo_truncate, 'change', lang.hitch(this, this.rdoChanged)));

      this.rdo_round.set('checked', typeof(this.row.round) !== 'undefined' ? this.row.round : true);
      this.rdo_truncate.set('checked', typeof(this.row.truncate) !== 'undefined' ? this.row.truncate : false);
    },

    _initCheckBox: function (v) {
      this.chkModify = new CheckBox({
        label: this.nls.modifyValues
      });
      this.chkModify.placeAt(this.chkModifyDIV);

      this.own(on(this.chkModify, 'change', lang.hitch(this, this.chkModifyChanged)));

      this.chkModify.setValue(v);
    },

    chkModifyChanged: function (v) {
      this._modify = v;

      this._toggleEnabled(this.rdo_round, v);
      this._toggleEnabled(this.rdo_truncate, v);

      if (v) {
        this.rdoChanged();
      } else {
        this._toggleNodes(v, v);
      }
    },

    rdoChanged: function () {
      this._toggleNodes(this.rdo_round.get('checked'), this.rdo_truncate.get('checked'));
    },

    _toggleNodes: function (enableRound, enableTruncate) {
      this._toggleEnabled(this.roundPlaces.textBox, enableRound);
      this._toggleEnabled(this.roundSignificantFigures, enableRound);
      this._toggleEnabled(this.roundLabel, enableRound);

      this._toggleEnabled(this.truncatePlaces.textBox, enableTruncate);
      this._toggleEnabled(this.truncateSignificantFigures, enableTruncate);
      this._toggleEnabled(this.truncateLabel, enableTruncate);
    },

    _toggleEnabled: function (node, v) {
      if (node.setDisabled) {
        node.setDisabled(!v);
      }
      node.disabled = !v;
      if (node.set) {
        node.set('disabled', !v);
      }

      var removeClass = v ? 'content-disabled' : 'content-enabled';
      if (domClass.contains(node, removeClass)) {
        domClass.remove(node, removeClass);
      }
      domClass.add(node, v ? 'content-enabled' : 'content-disabled');
    },

    _disableOk: function () {
      if (!domClass.contains(this.btnOk, 'jimu-state-disabled')) {
        domClass.add(this.btnOk, 'jimu-state-disabled');
      }
    },

    _enableOk: function () {
      if (domClass.contains(this.btnOk, 'jimu-state-disabled')) {
        domClass.remove(this.btnOk, 'jimu-state-disabled');
      }
    }
  });
});
