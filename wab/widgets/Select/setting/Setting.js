///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 Esri. All Rights Reserved.
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
  "dojo/_base/declare",
  "dojo/_base/lang",
  'dojo/_base/Color',
  "dojo/on",
  "dijit/_WidgetsInTemplateMixin",
  "jimu/BaseWidgetSetting",
  "jimu/dijit/CheckBox",
  "jimu/dijit/ColorPickerButton"
], function(declare, lang, Color, on, _WidgetsInTemplateMixin, BaseWidgetSetting, CheckBox) {
  var PARTIAL_WITHIN = 'partial', WHOLLY_WITHIN = 'wholly';
  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-select-setting',

    selectionColor: '',
    selectionMode: '',
    allowExport: false,

    postCreate: function() {
      this.inherited(arguments);

      this.allowExportCheckBox = new CheckBox({
        label: this.nls.allowExport,
        checked: this.config && this.config.allowExport,
        onChange: lang.hitch(this, this._onAllowExportChange)
      }, this.exportCheckBoxDiv);

      if(this.config) {
        this._init();
      }

      this.own(on(this.colorPicker, 'change', lang.hitch(this,
          this._onColorChange)));
    },

    _onColorChange: function(color) {
      this.selectionColor = color.toHex();
    },

    _onSelectPartialMode: function() {
      this.selectionMode = PARTIAL_WITHIN;
    },

    _onSelectWhollyMode: function() {
      this.selectionMode = WHOLLY_WITHIN;
    },

    _onAllowExportChange: function(checked) {
      this.allowExport = checked;
    },

    _init: function() {
      this.selectionColor = this.config.selectionColor;
      if(this.config.selectionColor) {
        this.colorPicker.setColor(new Color(this.selectionColor));
      }

      this.selectionMode = this.config.selectionMode;
      if(this.config.selectionMode === PARTIAL_WITHIN) {
        this.partialMode.checked = true;
        this._onSelectPartialMode();
      }else if(this.config.selectionMode === WHOLLY_WITHIN) {
        this.whollyMode.checked = true;
        this._onSelectWhollyMode();
      }

      this.allowExport = this.config.allowExport;
      this.allowExportCheckBox.setValue(this.allowExport);
    },

    setConfig: function(config) {
      this.config = config;
      this._init();
    },

    getConfig: function() {
      return {
        selectionColor: this.selectionColor,
        selectionMode: this.selectionMode,
        allowExport: this.allowExport
      };
    }
  });
});