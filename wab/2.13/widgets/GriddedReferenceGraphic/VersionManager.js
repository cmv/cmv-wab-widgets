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
define(['jimu/shared/BaseVersionManager'],
  function (BaseVersionManager) {
    function updateConfig(oldConfig) {
      var newConfig = oldConfig;
      if (newConfig.hasOwnProperty("operationalLayer") === false) {
        newConfig.grg.operationalLayer = {
          name: ""
        };
      }
      return newConfig;
    }

    function VersionManager() {
      this.versions = [{
        version: '2.6',
        upgrader: function (oldConfig) {
          return updateConfig(oldConfig);
        }
      }, {
        version: '2.7',
        upgrader: function (oldConfig) {
          return updateConfig(oldConfig);
        }
      }, {
        version: '2.8',
        upgrader: function (oldConfig) {
          return updateConfig(oldConfig);
        }
      }, {
        version: '2.9',
        upgrader: function (oldConfig) {
          return updateConfig(oldConfig);
        }
      }, {
        version: '2.10',
        upgrader: function (oldConfig) {
          return updateConfig(oldConfig);
        }
      }, {
        version: '2.11',
        upgrader: function (oldConfig) {
          return updateConfig(oldConfig);
        }
      }, {
        version: '2.12',
        upgrader: function (oldConfig) {
          return updateConfig(oldConfig);
        }
      }, {
        version: '2.13',
        upgrader: function (oldConfig) {
          return updateConfig(oldConfig);
        }
      }];
    }
    VersionManager.prototype = new BaseVersionManager();
    VersionManager.prototype.constructor = VersionManager;
    return VersionManager;
  });