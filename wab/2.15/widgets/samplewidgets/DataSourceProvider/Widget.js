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
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'jimu/BaseWidget',
  'esri/tasks/query',
  'esri/tasks/QueryTask'],
function(declare, lang, html, array, on, BaseWidget, Query, QueryTask) {
  return declare([BaseWidget], {

    baseClass: 'jimu-widget-dsp',

    cityService: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0',

    startup: function() {
      this._createFilterNodes(this.config.filters);
    },

    _createFilterNodes: function(filters){
      array.forEach(filters, function(f){
        this._createFilterNode(f);
      }, this);
    },

    _createFilterNode: function(filter){
      var node = html.create('div', {
        'class': 'filter',
        style: {
          cursor: 'pointer'
        },
        innerHTML: 'City name start with:' + filter
      }, this.filterListNode);

      this.own(on(node, 'click', lang.hitch(this, this._onFilterClick, filter)));
    },

    _onFilterClick: function(filter, evt){
      var queryTask = new QueryTask(this.cityService);
      var query = new Query();
      query.where = "upper(CITY_NAME) like upper('" + filter + "%')";
      query.returnGeometry = true;
      query.outFields = ["*"];
      queryTask.execute(query, lang.hitch(this, this._onFilterReturn, filter));

      html.setStyle(evt.target, {
        backgroundColor: 'yellow'
      });
    },

    _onFilterReturn: function(filter, featureSet){
      this.updateDataSourceData('filter-' + filter, {
        features: featureSet.features
      });
    }

  });
});