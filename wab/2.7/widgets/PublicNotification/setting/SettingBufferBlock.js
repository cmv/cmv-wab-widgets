/*global jimuNls */
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
  './settingComponents',
  './SettingInputWithDropdownLabeled',
  './SettingObject',
  './SettingOptionsTable',
  './SettingStaticText'
], function (
  declare,
  lang,
  settingComponents,
  SettingInputWithDropdownLabeled,
  SettingObject,
  SettingOptionsTable,
  SettingStaticText
) {
  return declare(SettingObject, {
    _inputControlDistance: null,
    _inputControlTable: null,
    _defaultConfig: {
      'bufferDistance': 100,
      'bufferUnits': 'FEET',
      'bufferUnitsMenu': ['10100', 'FEET', 'YARDS', 'METERS', 'KILOMETERS', 'MILES']
    },

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingBufferBlock#
     * @constructor
     */
    constructor: function (name,
      nls, widthClass, leftColWidthClass, rightColWidthClass, defaultConfig, label, placeholder, hint) {
      /*jshint unused:false*/
      var valueItems = [];
      this._defaultConfig = defaultConfig;

      this._inputControlDistance = new SettingInputWithDropdownLabeled(null, true,
        'full-width', leftColWidthClass, rightColWidthClass,
        label, placeholder, hint, null, '', '', this._createLargeDistanceUnitsDropdownItemsList());
      valueItems.push(this._inputControlDistance.div());

      this._inputControlTable = new SettingOptionsTable('bufferUnitsMenu', 'details-value', '',
        nls.propertyLabels.units, null, nls.hints.selectionListOfOptionsToDisplay);

      valueItems.push(settingComponents.container('full-width flexbox', 'minorTrailingHorizGap', [
        new SettingStaticText(null, 'details-label static-text', nls.propertyLabels.bufferUnits).div(),
        this._inputControlTable.div()
      ]));

      // Assemble label/value pair
      this._mainDiv = settingComponents.container(widthClass || '', 'majorTrailingVertGap', valueItems);
    },

    setValue: function (value) {
      if (this._inputControl) {
        this._inputControl.set('value', value);
      }
    },

    setConfig: function () {
      lang.mixin({}, this._defaultConfig, this._config);
      if (this._inputControlDistance && this._inputControlTable) {
        this._inputControlDistance.setValue(this._config.bufferDistance);
        this._inputControlDistance.setModifier(this._config.bufferUnits);

        this._inputControlTable.setConfig(this._config);
      }
    },

    getConfig: function () {
      if (this._inputControlDistance && this._inputControlTable) {
        this._config.bufferDistance = this._inputControlDistance.getValue();
        this._config.bufferUnits = this._inputControlDistance.getModifier();

        this._inputControlTable.getConfig(this._config);
      }
    },

    _createLargeDistanceUnitsDropdownItemsList: function () {
      var dropdownItems = [
        {label: jimuNls.units.feet, value: 'FEET'},
        {label: jimuNls.units.yards, value: 'YARDS'},
        {label: jimuNls.units.meters, value: 'METERS'},
        {label: jimuNls.units.kilometers, value: 'KILOMETERS'},
        {label: jimuNls.units.miles, value: 'MILES'}
      ];
      return dropdownItems;
    }

    //================================================================================================================//
  });
});
