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
  './settingComponents',
  './SettingObject'
], function (
  array,
  declare,
  lang,
  settingComponents,
  SettingObject
) {
  return declare(SettingObject, {
    _contents: [],

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingContainer#
     * @constructor
     */
    constructor: function (name, classes, gapClass, a, b, c) {
      /*jshint unused:false*/
      // Adjust to varible argument list:
      //   Simple container: (classes, gapClass, contents)
      //   Bordered container: (classes, gapClass, groupLabel, groupClasses, contents)
      // Done this way because contents could be an array constructed in the calling parameter list, which would put
      // any arguments after it far out of sight.
      var groupLabel, groupClasses, contents;

      if (Array.isArray(a)) {
        contents = a;
        this._contents = contents;
        this._mainDiv = settingComponents.container(classes || '', gapClass, this._getContentDivs(this._contents));
      } else {
        groupLabel = a;
        groupClasses = b;
        contents = c;
        this._contents = contents;
        this._mainDiv = settingComponents.fieldsetContainer(groupLabel, groupClasses, classes || '', gapClass,
          this._getContentDivs(this._contents));
      }
    },

    setConfig: function (config) {
      array.forEach(this._contents, lang.hitch(this, function (item) {
        item.setConfig(this._config || config);
      }));
    },

    getConfig: function (config) {
      if (this._name) {  // Only named items have configuration
        this._config = {};
      }
      array.forEach(this._contents, lang.hitch(this, function (item) {
        item.getConfig(this._config || config);
      }));
    },

    _getContentDivs: function (contents) {
      return array.map(contents, function (contentItem) {
        return contentItem.div ? contentItem.div() : contentItem;
      });
    }

    //================================================================================================================//
  });
});
