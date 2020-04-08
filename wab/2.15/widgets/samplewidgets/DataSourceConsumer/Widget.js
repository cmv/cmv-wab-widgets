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
define(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/DataSourceManager'],
function(declare, BaseWidget, DataSourceManager) {
  return declare([BaseWidget], {

    baseClass: 'jimu-widget-dsc',

    startup: function() {
      var data = DataSourceManager.getInstance().getData(this.config.dataSourceId);
      if(data){
        this._updateUI(data);
      }
    },

    onDataSourceDataUpdate: function(dsId, data){
      if(dsId !== this.config.dataSourceId){
        return;
      }

      this._updateUI(data);
    },

    _updateUI: function(data){
      this.countNode.innerText = data.features? data.features.length: 0;
      this.sumNode.innerText = data.features? data.features.reduce((function(acc, val){
        return acc + val.attributes[this.config.summaryField];
      }).bind(this), 0): 0;
    }
  });
});