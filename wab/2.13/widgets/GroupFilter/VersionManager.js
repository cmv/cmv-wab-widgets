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
      version: '2.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.2',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.webmapAppendMode = false;
        newConfig.slAppendChoice = 'OR';
        newConfig.zoomMode = true;
        for (var i = 0; i < newConfig.groups.length; i++) {
          newConfig.groups[i].appendSameLayer = false;
          newConfig.groups[i].appendSameLayerConjunc = 'OR';
          for (var z = 0; z < newConfig.groups[i].layers.length; z++) {
            newConfig.groups[i].layers[z].useZoom = false;
          }
        }
        return newConfig;
      }
    },{
      version: '2.5',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.persistOnClose = true;
        return newConfig;
      }
    }];
  }

  VersionManager.prototype = new BaseVersionManager();
  VersionManager.prototype.constructor = VersionManager;
  return VersionManager;
});