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
  './settingComponents',
  './SettingObject'
], function (
  declare,
  settingComponents,
  SettingObject
) {
  return declare(SettingObject, {
    _inputControl: null,

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingInputLabeled#
     * @constructor
     */
    constructor: function (name, constrainToNumbers, widthClass, leftColWidthClass, rightColWidthClass,
      label, placeholder, hint, prefixDiv, suffixDiv) {
      /*jshint unused:false*/
      var valueItems = [], valueLineItems = [], subcomponent;

      // Assemble value column
      if (prefixDiv || suffixDiv) {
        // Prefix
        if (prefixDiv) {
          if (typeof prefixDiv === 'string') {
            valueLineItems.push(settingComponents.text('static-text', prefixDiv));
          } else {
            valueLineItems.push(prefixDiv.div());
          }
        }

        // Input area
        subcomponent = constrainToNumbers ?
          settingComponents.numberInputCtl('variable-width inline-block', placeholder) :
          settingComponents.textInputCtl('variable-width inline-block', placeholder);
        valueLineItems.push(subcomponent.div);
        this._inputControl = subcomponent.ctl;

        // Suffix
        if (suffixDiv) {
          if (typeof suffixDiv === 'string') {
            valueLineItems.push(settingComponents.text('static-text', suffixDiv));
          } else {
            valueLineItems.push(suffixDiv.div());
          }
        }
        valueItems.push(settingComponents.container('full-width flexbox', 'minorTrailingHorizGap', valueLineItems));

      } else {
        // Input area only
        subcomponent = constrainToNumbers ?
          settingComponents.numberInputCtl('full-width inline-block', placeholder) :
          settingComponents.textInputCtl('full-width inline-block', placeholder);
        valueItems.push(subcomponent.div);
        this._inputControl = subcomponent.ctl;
      }

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
