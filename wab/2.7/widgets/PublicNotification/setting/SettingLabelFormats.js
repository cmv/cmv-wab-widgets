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
  'dojo/_base/array',
  'dojo/_base/declare',
  './SettingContainer',
  './SettingObject',
  './SettingOptionsTable'
], function (
  array,
  declare,
  SettingContainer,
  SettingObject,
  SettingOptionsTable
) {
  return declare(SettingObject, {
    _inputControl: null,

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingLabelFormats#
     * @constructor
     */
    constructor: function (name, nls, widthClass) {
      /*jshint unused:false*/
      this._inputControl = new SettingOptionsTable(null, 'half-width', '', nls.propertyLabels.description, null,
          nls.hints.selectionListOfOptionsToDisplay);

      this._mainDiv = new SettingContainer(null, 'flexbox ' + (widthClass || ''), 'majorTrailingHorizGap',
        nls.groupingLabels.labelFormats, 'full-width', [this._inputControl]).div();
    },

    setConfig: function () {
      var formatFlags, formats, menuItems;

      // Extract the label menu from the format descriptions
      formatFlags = [this._config[0]];
      formats = this._config.slice(1);
      menuItems = array.map(formats, function (labelFormat) {
        return labelFormat.name;
      });

      if (menuItems.length > 0) {
        menuItems = [].concat(formatFlags, menuItems);
      } else {
        menuItems = [formatFlags];
      }

      // And set the menu
      this._inputControl.setValue(menuItems);
    },

    getConfig: function () {
      var menuItems, origConfigItems = this._config.slice(1), updatedConfig;

      // Rearrange the configuration based on the current state of the menu
      menuItems = this._inputControl.getValue();
      updatedConfig = [menuItems[0]];

      array.forEach(menuItems.slice(1), function (menuItem) {
        array.some(origConfigItems, function (configItem) {
          if (menuItem === configItem.name) {
            updatedConfig.push(configItem);
          }
        });
      });

      this._config = updatedConfig;
    }

    //================================================================================================================//
  });
});
