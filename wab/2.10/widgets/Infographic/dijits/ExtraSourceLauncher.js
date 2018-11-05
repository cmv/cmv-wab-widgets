///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2017 Esri. All Rights Reserved.
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

define([
  'dojo/_base/declare',
  'dojo/Evented',
  'dijit/_WidgetBase',
  'jimu/DataSourceManager',
  '../utils',
  './clientStatistic'
], function(declare, Evented, _WidgetBase, DataSourceManager, utils, clientStatistic) {

  return declare([_WidgetBase, Evented], {
    // -- option --
    // appConfig
    // dataSource
    // statistic
    // returnFeatures

    // -- public methods --

    // start
    // awake
    // sleep
    // setAppConfigDSFeatures

    // -- events --

    // data-update

    constructor: function(options) {
      this.dataSourceManager = DataSourceManager.getInstance();
      this.appConfig = options.appConfig;
      this.frameWorkDsId = options.dataSource.frameWorkDsId;
      this.returnFeatures = options.returnFeatures;
      this.formatResult = options.formatResult;
      this.statistic = options.statistic;
      // this.handles
      this.exdsBeginUpdateHandle = null;

      this._isStatisticDataSource();
    },

    start: function() {
      this.awake();
    },

    awake: function() {
      this.sleeping = false;
      this._getFeaturesForFirst();
    },

    sleep: function() {
      this.sleeping = true;
    },

    destroy: function() {
      this._removeHandles();
      this.inherited(arguments);
    },

    //For extral ds and widget's output features, this method will be called when ds is changed
    setAppConfigDSFeatures: function(features) {
      if (this.sleeping) {
        return;
      }
      this._onDataUpdate(features);
    },

    _getFeaturesForFirst: function() {
      //first init data
      var data = this.dataSourceManager.getData(this.dataSource.frameWorkDsId);
      this._onDataUpdate(data && data.features);
      //Continuous access to features: @setAppConfigDSFeatures
    },

    // ------------------------- Processing the acquired features -------------------------------
    _onDataUpdate: function(features) {
      var value;
      if (this.returnFeatures) {
        if (features) {
          value = {
            features: features,
            hasStatisticsed: !!this._isStatDataSource
          };
        }
      } else {
        if (this._isStatDataSource) {
          value = clientStatistic.statisticExtraStatSource(this.statistic, features);
        } else {
          value = clientStatistic.getStatisticResultFromFeatures(features, this.statistic);
        }
        if (this.formatResult) {
          value = utils.formatterRangeNumber(value);
        }
      }
      this.emit('data-update', value);
    },

    // -------------------------------- Tool methods -------------------------------------------
    _isStatisticDataSource: function() {
      var dataSources = this.appConfig.dataSource && this.appConfig.dataSource.dataSources;
      var dsMeta = dataSources && dataSources[this.frameWorkDsId];
      this._isStatDataSource = !!(dsMeta && dsMeta.type === 'FeatureStatistics');
    },

    _resetExdsBeginUpdateHandle: function() {
      if (this.exdsBeginUpdateHandle && this.exdsBeginUpdateHandle.remove) {
        this.exdsBeginUpdateHandle.remove();
        this.exdsBeginUpdateHandle = null;
      }
    },

    _removeHandles: function() {
      this._resetExdsBeginUpdateHandle();
    }

  });
});