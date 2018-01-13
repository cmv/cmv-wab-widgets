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
  'dojo/_base/lang',
  'dojo/dom-class',
  './settingComponents',
  './SettingCheckbox',
  './SettingContainer',
  './SettingObject',
  './SettingOptionsTable',
  './SettingStaticText'
], function (
  array,
  declare,
  lang,
  domClass,
  settingComponents,
  SettingCheckbox,
  SettingContainer,
  SettingObject,
  SettingOptionsTable,
  SettingStaticText
) {
  return declare(SettingObject, {
    _inputControl: null,
    _detailsDiv: null,
    _detailsTitle: null,
    _detailsCheckbox: null,
    _iCurrentDetails: -1,
    _menuItems: [],

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingAddresseesBlock#
     * @constructor
     */
    constructor: function (name, nls, widthClass) {
      /*jshint unused:false*/
      var valueItems = [];

      this._inputControl = new SettingOptionsTable(null, 'half-width', '', nls.propertyLabels.name, null,
          nls.hints.selectionListOfOptionsToDisplay, lang.hitch(this, this._onRowSelected));

      this._detailsTitle = new SettingStaticText();
      this._detailsCheckbox =
        new SettingCheckbox(null, nls.propertyLabels.useRelatedRecords, '', lang.hitch(this, this._checkboxChanged));
      this._detailsDiv = settingComponents.container('half-width optionsTableHeaderHeight', 'majorTrailingVertGap', [
        this._detailsTitle.div(),
        this._detailsCheckbox.div()
      ]);

      this._mainDiv = new SettingContainer(null, 'flexbox ' + (widthClass || ''), 'majorTrailingHorizGap',
        nls.groupingLabels.addressSources, 'full-width', [
          this._inputControl,
          this._detailsDiv
        ]).div();
    },

    setConfig: function () {
      var formatFlags, formats;

      // Extract the sources menu from the source descriptions
      formatFlags = [this._config[0]];
      formats = this._config.slice(1);
      this._menuItems = array.map(formats, function (sourceFormat) {
        return sourceFormat.name;
      });

      if (this._menuItems.length > 0) {
        this._menuItems = [].concat(formatFlags, this._menuItems);
      } else {
        this._menuItems = [formatFlags];
      }

      // And set the menu
      this._inputControl.setValue(this._menuItems);

      // Pick the first item for the details
      this._setDetails(0);
    },

    getConfig: function () {
      var origConfigItems = this._config.slice(1), updatedConfig;

      // Rearrange the configuration based on the current state of the menu
      this._menuItems = this._inputControl.getValue();
      updatedConfig = [this._menuItems[0]];

      array.forEach(this._menuItems.slice(1), function (menuItem) {
        array.some(origConfigItems, function (configItem) {
          if (menuItem === configItem.name) {
            updatedConfig.push(configItem);
          }
        });
      });

      this._config = updatedConfig;
    },

    /*----------------------------------------------------------------------------------------------------------------*/

    _setDetails: function (itemNum) {
      var numMenuItems = this._config.length - 1;  // subtract 1 for flags in first array position

      if (0 <= itemNum && itemNum < numMenuItems) {
        // Show & set the details
        domClass.remove(this._detailsDiv, 'hidden');
        this._detailsTitle.setValue(this._config[itemNum + 1].name);
        this._detailsCheckbox.setValue(this._config[itemNum + 1].useRelatedRecords);
        this._iCurrentDetails = itemNum;

      } else {
        // No table item; hide details
        domClass.add(this._detailsDiv, 'hidden');
        this._iCurrentDetails = -1;
      }
    },

    _onRowSelected: function (evt) {
      var selectedItemTitle = evt.innerText.trim();  // event title comes with trailing CRLF
      array.some(this._menuItems, lang.hitch(this, function (menuItem, itemNum) {
        if (menuItem === selectedItemTitle) {
          this._setDetails(itemNum - 1);  // subtract 1 for flags in first array position
          return true;
        }
        return false;
      }));
    },

    _checkboxChanged: function (newValue) {
      if (this._iCurrentDetails >= 0) {
        this._config[this._iCurrentDetails + 1].useRelatedRecords = newValue;
      }
    }

    //================================================================================================================//
  });
});
