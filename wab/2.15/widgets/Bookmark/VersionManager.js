///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
define(['jimu/shared/BaseVersionManager'],
function(BaseVersionManager) {
  function VersionManager(){
    this.versions = [{
      version: '1.0',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '1.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '1.2',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '1.3',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '1.4',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '2.0Beta',
      upgrader: function(oldConfig) {
        return oldConfig;
      }
    }, {
      version: '2.0',
      upgrader: function(oldConfig) {
        return oldConfig;
      }
    }, {
      version: '2.0.1',
      upgrader: function(oldConfig) {
        return oldConfig;
      }
    }, {
      version: '2.1',
      upgrader: function(oldConfig) {
        return oldConfig;
      }
    }, {
      version: '2.2',
      upgrader: function (oldConfig) {
        return oldConfig;
      }
    }, {
      version: '2.3',
      upgrader: function (oldConfig) {
        return oldConfig;
      }
    }, {
      version: '2.4',
      upgrader: function (oldConfig) {
        return oldConfig;
      }
    }, {
      version: '2.5',
      upgrader: function (oldConfig) {
        var newConfig = oldConfig;

        if (newConfig) {
          newConfig.needToUpdateFlag = true;
          if ("undefined" === typeof newConfig.layout) {
            newConfig.layout = {
              cards: true,
              list: false,
              defaultMode: "cards"
            };
          }
          if ("undefined" === typeof newConfig.editable) {
            newConfig.editable = true;
          }
          if ("undefined" === typeof newConfig.syncMode) {
            if (Array.isArray(newConfig.bookmarks2D) && newConfig.bookmarks2D.length > 0) {
              newConfig.syncMode = {
                webmap: false,
                custom: true//just display custom bookmark, if oldConfig with old custom bookmark(avoid repetition)
              };
            } else {
              newConfig.syncMode = {
                webmap: true,
                custom: true
              };
            }
          }
          //utils.setDefaultConfigForUpdate(newConfig);
          //utils.completeUpdateConfig
          delete newConfig.needToUpdateFlag;//complete update
        }

        return newConfig;
      }
    }, {
      version: '2.6',
      upgrader: function (oldConfig) {
        return oldConfig;
      }
    }, {
      version: '2.7',
      upgrader: function (oldConfig) {
        var newConfig = oldConfig;
        if (newConfig) {
          newConfig.isSaveLayerVisibility = false;
        }
        return newConfig;
      }
    }];
  }

  VersionManager.prototype = new BaseVersionManager();
  VersionManager.prototype.constructor = VersionManager;
  return VersionManager;
});