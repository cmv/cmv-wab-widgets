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
  'dijit/Destroyable'
], function (
  declare,
  Destroyable
) {
  return declare(Destroyable, {
    '-chains-': {  // how to call subclasses relative to superclass
      setConfig: 'after',  // after superclass
      getConfig: 'before'  // before superclass
    },
    _name: null,
    _config: null,
    _mainDiv: null,

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingObject#
     * @constructor
     */
    constructor: function (name) {
      this._name = name;
    },

    div: function () {
      return this._mainDiv;
    },

    setConfig: function (config) {
      if (this._name) {  // Only named items have configuration
        this._config = config[this._name];
      }
    },

    getConfig: function (config) {
      if (this._name) {  // Only named items have configuration
        config[this._name] = this._config;
      }
    }

    //================================================================================================================//
  });
});
