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

define(['dojo/_base/declare',
  'dojo/Deferred',
  'dojo/_base/lang',
  'dojo/_base/array',
  'jimu/LayerInfos/LayerInfos',
  'dijit/form/Select',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'dijit/_TemplatedMixin',
  '../BaseEditor'
], function(declare, Deferred, lang, array, LayerInfos, Select, Query, QueryTask, _TemplatedMixin, BaseEditor){
  var clazz = declare([BaseEditor, _TemplatedMixin], {
    templateString: '<div>' +
      '<div class="recordset-editor" data-dojo-attach-point="tableChooseNode"></div>' +
    '</div>',
    editorName: 'SelectRecordSetFromTable',

    postCreate: function(){
      this.inherited(arguments);

      var layerInfos = LayerInfos.getInstanceSync();
      var tableInfos = layerInfos.getTableInfoArray();
      var options = [{
        label: this.nls.chooseATable,
        value: '',
        selected: true
      }];
      array.forEach(tableInfos, function(tableInfo) {
        options.push({
          label: tableInfo.title || tableInfo.name,
          value: tableInfo
        });
      });
      this.selectDijit = new Select({
        name: 'tableSelctor',
        'class': 'table-select',
        options: options
      });
      this.selectDijit.placeAt(this.tableChooseNode).startup();
    },

    getGPValue: function(){
      var def = new Deferred();
      var tableInfo = this.selectDijit.get('value');

      if(tableInfo) {
        tableInfo.getLayerObject().then(lang.hitch(this, function(layerObject) {
          if(!layerObject) {
            def.resolve(null);
            return;
          }
          if (layerObject.featureCollectionData){
            def.resolve(layerObject.featureCollectionData);
          } else if (layerObject.url) {
            var queryTask = new QueryTask(layerObject.url);
            var query = new Query();
            query.where = '1=1';
            query.outFields = ['*'];
            queryTask.execute(query, function(featureSet) {
              def.resolve(featureSet);
            }, function(error) {
              def.reject(error);
            });
          } else {
            def.resolve(null);
          }
        }));
      } else {
        def.resolve(null);
      }
      return def;
    }
  });

  return clazz;
});
