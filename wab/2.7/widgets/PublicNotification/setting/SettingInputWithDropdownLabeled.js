/*
 | Copyright 2017 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
//====================================================================================================================//
define([
  'dojo/_base/declare',
  './SettingDropdown',
  './SettingInputLabeled',
  './SettingObject'
], function (
  declare,
  SettingDropdown,
  SettingInputLabeled,
  SettingObject
) {
  return declare(SettingObject, {
    _inputControl: null,
    _inputModifier: null,

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingInputWithDropdownLabeled#
     * @constructor
     */
    constructor: function (name, constrainToNumbers, widthClass, leftColWidthClass, rightColWidthClass,
      label, placeholder, hint, prefixDiv, dropdownClass, dropdownElemClass, dropdownOptions) {
      /*jshint unused:false*/
      this._inputModifier = new SettingDropdown(null, dropdownClass, dropdownElemClass, dropdownOptions);
      this._inputControl =
        new SettingInputLabeled(null, constrainToNumbers, widthClass, leftColWidthClass, rightColWidthClass,
        label, placeholder, hint, prefixDiv, this._inputModifier);
      this._mainDiv = this._inputControl.div();
    },

    setValue: function (value) {
      if (this._inputControl) {
        this._inputControl.setValue(value);
      }
    },

    setModifier: function (value) {
      if (this._inputModifier) {
        this._inputModifier.setValue(value);
      }
    },

    getValue: function () {
      if (this._inputControl) {
        return this._inputControl.getValue();
      }
      return null;
    },

    getModifier: function () {
      if (this._inputModifier) {
        return this._inputModifier.getValue();
      }
      return null;
    },

    setConfig: function () {
      if (this._inputControl && this._config) {
        this.setValue(this._config);
      }
    },

    getConfig: function () {
      if (this._inputControl) {
        this._config = this.getValue();
      }
    }

    //================================================================================================================//
  });
});
