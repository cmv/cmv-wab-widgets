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
define(['dojo/_base/declare', 'dojo/_base/array', 'jimu/BaseWidget'],
function(declare, array, BaseWidget) {
  return declare([BaseWidget], {

    baseClass: 'jimu-widget-widgetb',

    startup: function(){
      this.inherited(arguments);
      this.fetchDataByName('WidgetA');
    },

    onReceiveData: function(name, widgetId, data, historyData) {
      //filter out messages
      if(name !== 'WidgetA'){
        return;
      }

      var msg = '<div style="margin:10px;">' +
        '<b>Receive data from</b>:' + name +
        '<br><b>widgetId:</b>' + widgetId +
        '<br><b>data:</b>' + data.message;

      //handle history data
      if(historyData === true){
        //want to fetch history data.
        msg += '<br><b>historyData:</b>' + historyData + '. Fetch again.</div>';
        this.messageNode.innerHTML = this.messageNode.innerHTML + msg;
        this.fetchDataByName('WidgetA');
      }else{
        msg += '<br><b>historyData:</b><br>' +
          array.map(historyData, function(data, i){
            return i + ':' + data.message;
          }).join('<br>') + '</div>';
        this.messageNode.innerHTML = this.messageNode.innerHTML + msg;
      }
    }
  });
});