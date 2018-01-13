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
  'dojo/_base/lang',
  'dojo/on',
  './settingComponents',
  './SettingObject'
], function (
  declare,
  lang,
  on,
  settingComponents,
  SettingObject
) {
  return declare(SettingObject, {
    _inputControl: null,
    _inputControlDiv: null,
    _inputControlOnChange: null,
    _disableNextOnChange: false,

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingDropdownLabeled#
     * @constructor
     */
    constructor: function (name, widthClass, leftColWidthClass, rightColWidthClass,
      label, hint, options, onChange) {
      /*jshint unused:false*/
      var valueItems = [], subcomponent;

      // Assemble value column
      subcomponent = settingComponents.dropdownCtl(null, 'full-width', options);
      valueItems.push(subcomponent.div);
      this._inputControl = subcomponent.ctl;
      this._inputControlDiv = subcomponent.div;
      this._inputControlOnChange = onChange;
      this.own(on(this._inputControl, 'change', lang.hitch(this, this._onChange)));

      if (hint) {
        valueItems.push(settingComponents.text('hint', hint));
      }

      // Assemble label/value pair
      this._mainDiv = settingComponents.container('flexbox ' + (widthClass || ''), 'minorTrailingHorizGap', [
        settingComponents.container('inline-block ' + (leftColWidthClass ? leftColWidthClass : ''), '', [
          settingComponents.text('static-text', label)
        ]),
        settingComponents.container('inline-block ' + (rightColWidthClass ? rightColWidthClass : ''),
          'minorTrailingVertGap', valueItems)
      ]);
    },

    setValue: function (value) {
      if (this._inputControl) {
        this._inputControl.set('value', value);
      }
    },

    getValue: function () {
      if (this._inputControl) {
        return this._inputControl.get('value');
      }
      return null;
    },

    setConfig: function () {
      if (this._inputControl && this._config && this._config !== this.getValue()) {
        this._disableNextOnChange = true;
        this.setValue(this._config);
      }
    },

    getConfig: function () {
      if (this._inputControl) {
        this._config = this.getValue();
      }
    },

    setOptions: function (options) {
      if (this._inputControl) {
        this._inputControl.destroy();
      }
      this._inputControl =
       settingComponents.dropdown(this._inputControlDiv, 'full-width', options, this._inputControlOnChange);
    },

    _onChange: function (evt) {
      if (!this._disableNextOnChange) {
        this._inputControlOnChange(evt);
      } else {
        this._disableNextOnChange = false;
      }
    }

    //================================================================================================================//
  });
});
