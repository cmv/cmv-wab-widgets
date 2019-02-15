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
  'dojo/_base/lang',
  'dojo/Evented',
  'dojo/on',
  'dojo/Deferred',
  'dijit/_WidgetBase',
  'jimu/utils',
  '../utils',
  'jimu/LayerInfos/LayerInfos',
  'esri/geometry/geometryEngine',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'esri/tasks/StatisticDefinition',
  'esri/layers/FeatureLayer',
  './clientStatistic'
], function(declare, lang, Evented, on, Deferred, _WidgetBase, jimuUtils, utils, LayerInfos,
  geometryEngine, Query, QueryTask, StatisticDefinition, FeatureLayer, clientStatistic) {

  return declare([_WidgetBase, Evented], {
    oidFieldType: 'esriFieldTypeOID',
    // -- option --

    // map,
    // useSelection,
    // filterByExtent
    // dataSource

    // layerObject
    // config

    // -- public methods --

    // start
    // awake
    // sleep

    // -- events --

    // data-update
    // loading
    // unloading
    // failed

    constructor: function(options) {
      this.uniqueID = jimuUtils.getRandomString();
      this.map = options.map;

      this.useSelection = options.useSelection;
      this.filterByExtent = options.filterByExtent;

      this.returnFeatures = options.returnFeatures;
      this.statistic = options.statistic;

      this.dataSource = options.dataSource;
      this.config = options.config;

      this.isDateType = !!this.config.dateConfig;

      this.layerInfosObj = LayerInfos.getInstanceSync();

      this.layerObject = options.layerObject;

      this._layerUrl = null;

      this._queryParameter = null;
      this._oldQueryParameter = null;
      // this.handles
      this.exchetChangeHandle = null;
      this.selectionHandle = null;
      this.refreshIntervalHandle = null;
      this.updateEndHandle = null;
      this.filterChangedHandle = null;
      this.timeIntervalHandle = null;

      this._loadingTypes = {};
    },

    start: function() {
      var fetchId = 'sl-get-lyobj'; //source launcher get layer object
      this.showLoading(fetchId);
      this._tryGetLayerObject(fetchId).then(function() {
        this.hideLoading(fetchId);
        this.awake();
        this._listenEventsContinuousAccessFeatures();
      }.bind(this), function(error) {
        console.error(error.message || error);
        this.hideLoading(fetchId);
        this._onFailed();
      }.bind(this));
    },

    awake: function() {
      this.sleeping = false;
      this._getFeaturesForFirst();
    },

    sleep: function() {
      this.sleeping = true;
    },

    destroy: function() {
      this._loadingTypes = {};
      this._removeHandles();
      this.inherited(arguments);
    },
    // -- Try to get features (selected features or client featrues or server stat features) --
    _getFeaturesForFirst: function() {
      this._trigerCallback();
    },

    _listenEventsContinuousAccessFeatures: function() {
      if (!this.layerObject || !this.layerInfo) {
        return;
      }
      var accessClientFeatures = this._shouldAccessClientFeatures();

      //selection event
      if (this.useSelection) {
        this._resetSelectionHandle();
        this.selectionHandle = on(this.layerObject, 'selection-complete,selection-clear',
          lang.hitch(this, function() {
            this._trigerCallback();
          }));
      }

      //filter change event, only for server stat
      //for client features, this event will be handled by update-end event
      if (!accessClientFeatures) {
        this._resetFilterChangedHandle();
        this.filterChangedHandle = on(this.layerInfo, 'filterChanged', lang.hitch(this, function(action) {
          if (action && action.zoomAfterFilter && this.filterByExtent) {
            return;
          }
          this._trigerCallback();
        }));
      }
      if (accessClientFeatures) { //Only listen layer update-end event for client features
        this._resetUpdateEndHandle();
        this.updateEndHandle = on(this.layerObject, 'update-end', lang.hitch(this, function() {
          this._trigerCallback();
        }));
      }
      // listen map filter by extent event
      if (this.filterByExtent && this.map) {
        this._resetExtentChangeHandle();
        this.exchetChangeHandle = on(this.map, 'extent-change', lang.hitch(this, function() {
          this.emit('start');
          this._trigerCallback(true);
        }));
      }

      //only set refresh interval for server statistics
      if (!accessClientFeatures) {
        //set refresh interval
        this._setTimeListener();
        //listen layer refresh-interval-change event
        this._resetRefreshIntervalHandle();
        this.refreshIntervalHandle = on(this.layerObject, 'refresh-interval-change',
          lang.hitch(this, this._setTimeListener));
      }
    },

    _setTimeListener: function() {
      var refreshInterval = this._getLayerRefreshInterval();
      if (!refreshInterval) {
        //if layer is static, clear interval
        this._resetTimeIntervalHandle();
        return;
      }
      //If the refresh interval is set in the layer, periodical request server-side statistics
      this._resetTimeIntervalHandle();
      this.timeIntervalHandle = setInterval(lang.hitch(this, function() {
        this._trigerCallback();
      }), refreshInterval * 1000 * 60);
    },

    _trigerCallback: function(isExtentChange) {
      var code = this.computingTheWayToGetFeatures();
      //If entent-change event triggered this method to get features on the client side,
      //We only continue to execute the method for the layer who is not on-demand mode,
      //For on-demand mode layer, this method will be triggered at update-end event later
      if (isExtentChange && code === 2 && this._isLayerOnDemandMode()) {
        return;
      }
      this.emit('start');
      switch (code) {
        case 0:
          break;
        case 1:
          this._getFeaturesFromSelection(this.map, this.layerObject, this.filterByExtent,
            lang.hitch(this, this._onDataUpdate));
          break;
        case 2:
          this._getClientFeaturesFromMap(this.map, this.layerObject, this.filterByExtent,
            lang.hitch(this, this._onDataUpdate));
          break;
        case 3:
          this._getStatisticsFeaturesForServer(lang.hitch(this, this._onDataUpdate));
          break;
        default:
          break;
      }
    },

    //0 -- invaild
    //1 -- client selected features
    //2 -- client features
    //3 -- server statistics features
    computingTheWayToGetFeatures: function() {
      var code = 0;
      if (this.sleeping || !this.layerObject) {
        return code;
      }
      if (!this._isMapLayer()) {
        code = 0;
      } else {
        if (this._shouldAccessFeaturesBySelection()) {
          code = 1;
        } else if (this._shouldAccessClientFeatures()) {
          code = 2;
        } else {
          code = 3;
        }
      }
      return code;
    },

    _getClientFeaturesFromMap: function(map, featureLayer, filterByExtent, callback) {
      var features = featureLayer.graphics;

      if (filterByExtent) {
        features = this._filterFeaturesByExtent(map.extent, features);
      }

      features = this._sortClientFeaturesByObjID(features, featureLayer);
      callback(features);
    },

    _getFeaturesFromSelection: function(map, featureLayer, filterByExtent, callback) {
      var features = [];
      var isSelectedFeatures = false;

      features = featureLayer.getSelectedFeatures();
      isSelectedFeatures = true;
      if (filterByExtent) {
        features = this._filterFeaturesByExtent(map.extent, features);
      }
      features.isSelectedFeatures = isSelectedFeatures;
      features = this._sortClientFeaturesByObjID(features, featureLayer);
      callback(features);
    },

    _getStatisticsFeaturesForServer: function(callback) {
      this._updateLayerInfoFilter();
      this._tryGenerateQueryParameter();
      if (!this._shouldLaunchQuery()) {
        return;
      }
      var fetchId = 'sl-sev-st'; //source launcher server statistic
      this.showLoading(fetchId);
      this.queryDeferred = this._doQuery();
      this.queryDeferred.then(lang.hitch(this, function(featureSet) {
        this.queryDeferred = null;
        this.hideLoading(fetchId);
        var features = featureSet.features || [];
        features = this._calculateAverageWithNullValueAsZero(features, this.config);
        callback(features, true);
      }), lang.hitch(this, function(error) {
        this.queryDeferred = null;
        console.error(error.message || error);
        this.hideLoading(fetchId);
        this._onFailed(fetchId);
      }));
    },

    _updateLayerInfoFilter: function() {
      if (!this.dataSource || typeof this.dataSource.layerId === 'undefined') {
        return;
      }
      var layerInfo = this.layerInfosObj.getLayerInfoById(this.dataSource.layerId);
      if (layerInfo) {
        this._layerFilter = layerInfo.getFilter();
      }
    },

    _onFailed: function() {
      this.emit('failed');
    },

    hideLoading: function(id) {
      this._loadingTypes[id] = false;
      var shouldHide = this._shouldHideLoading();
      if (shouldHide) {
        this._hideLoading();
      }
    },

    showLoading: function(id) {
      this._loadingTypes[id] = true;
      this._showLoading();
    },

    _showLoading: function() {
      this.emit('loading', this.uniqueID);
    },

    _hideLoading: function() {
      this.emit('unloading', this.uniqueID);
    },

    _shouldHideLoading: function() {
      if (!this._loadingTypes) {
        return;
      }
      var ids = Object.keys(this._loadingTypes);
      var values = ids.map(function(id) {
        return this._loadingTypes[id];
      }.bind(this));
      return values.every(function(value) {
        return !value;
      });
    },

    // ------------------------- Processing the acquired features -------------------------------
    _onDataUpdate: function(features, hasStatisticsed) {
      var value = this._getValueByFeatures(features, hasStatisticsed);
      this.emit('data-update', value);
      setTimeout(function() {
        this.emit('done');
      }.bind(this), 500);
    },

    _getValueByFeatures: function(features, hasStatisticsed) {
      if (!features || !features.length) {
        return null;
      }
      var value = null;
      //For number and gauge, return a number
      if (!this.returnFeatures) {
        value = this._getValueForNumber(features);
      } else {
        //For chart, return features(has statisticsed or not)
        if (features) {
          value = {
            features: features,
            hasStatisticsed: !!hasStatisticsed
          };
        }
      }
      return value;
    },

    _getValueForNumber: function(features) {
      var value;
      if (this._isNeededCalculateForClient()) {
        value = clientStatistic.statistic(this.statistic, this.dataSource, features);
      } else {
        value = clientStatistic.getSingleValueForServerStatFeature(features);
      }
      return value;
    },

    // -------------------------------- Tool methods -------------------------------------------

    _isMapLayer: function() {
      return this.dataSource.dataSourceType === "DATA_SOURCE_FEATURE_LAYER_FROM_MAP";
    },

    _isLayerOnDemandMode: function() {
      return this.layerObject &&
        this.layerObject.currentMode === FeatureLayer.MODE_ONDEMAND;
    },

    _shouldAccessFeaturesBySelection: function() {
      return this.useSelection && this.layerObject && this.layerObject.getSelectedFeatures().length;
    },

    _shouldAccessClientFeatures: function() {
      var a = this.config && this.config.mode === 'feature'; //chart feature mode
      var b = this.isDateType; //Date type category
      var c = this._isSupportServerStatByExtent(); //Not support server statistics by extent
      return a || b || !c;
    },

    _isSupportServerStatByExtent: function() {
      //layer version >= 10.1 sp1(10.11)
      var versionThanSP1 = this.layerObject && this.layerObject.version && Number(this.layerObject.version) >= 10.11;
      var supportsStatistics = this._isLayerSupportStatistics(); //support statistics
      return versionThanSP1 && supportsStatistics;
    },

    _isLayerSupportStatistics: function() {
      if (!this.layerObject || !this.layerObject.url) {
        return;
      }
      var isSupport = false;
      if (this.layerObject.advancedQueryCapabilities) {
        isSupport = !!this.layerObject.advancedQueryCapabilities.supportsStatistics;
      } else {
        isSupport = !!this.layerObject.supportsStatistics;
      }
      return isSupport;
    },

    _getLayerRefreshInterval: function() {
      if (!this.layerObject || !this.layerObject.refreshInterval) {
        return;
      }
      return this.layerObject.refreshInterval;
    },

    _sortClientFeaturesByObjID: function(features, featureLayer) {
      if (features.length > 0) {
        var objectIdField = jimuUtils.getObjectIdField(featureLayer);

        if (objectIdField) {
          var firstFeature = features[0];
          if (firstFeature && firstFeature.attributes && firstFeature.attributes.hasOwnProperty(objectIdField)) {
            features.sort(function(a, b) {
              if (!a.attributes) {
                a.attributes = {};
              }
              if (!b.attributes) {
                b.attributes = {};
              }
              var objectId1 = a.attributes[objectIdField];
              var objectId2 = b.attributes[objectIdField];
              if (objectId1 < objectId2) {
                return -1;
              } else if (objectId1 > objectId2) {
                return 1;
              } else {
                return 0;
              }
            });
          }
        }
      }
      return features;
    },

    _filterFeaturesByExtent: function(extent, features) {
      var extents = extent.normalize();

      features = features.filter(lang.hitch(this, function(feature) {
        try {
          if (feature.geometry) {
            var isPoint = feature.geometry.type === 'point' || feature.geometry === 'multipoint';

            return extents.some(lang.hitch(this, function(extent) {
              if (isPoint) {
                return extent.contains(feature.geometry);
              } else {
                return geometryEngine.intersects(extent, feature.geometry);
              }
            }));
          }
        } catch (e) {
          console.error(e);
        }
        return false;
      }));

      return features;
    },

    //The server-side statistics do not support the null value as 0 to calculate the average,
    //so we do this by (server statistics sum) / (server statistics count)
    _calculateAverageWithNullValueAsZero: function(features, config) {
      if (!this._shouldCalcAvgForNullValue(config)) {
        return features;
      }
      if (!features || !features.length) {
        return features;
      }
      var valueFields = config.valueFields;

      if (!valueFields || !valueFields.length) {
        return features;
      }
      var valueFieldsSum = valueFields.map(function(vf) {
        return vf + '_sum';
      });
      features.forEach(function(feature) {
        var attributes = feature.attributes;
        if (!attributes) {
          return;
        }
        //get count
        var count = attributes.STAT_COUNT;
        if (typeof count === 'undefined') {
          count = attributes.stat_count;
          delete attributes.stat_count;
        } else {
          delete attributes.STAT_COUNT;
        }
        var sumValue, avgValue, vf;

        valueFieldsSum.forEach(function(vfs) {
          vf = vfs.replace(/_SUM$/gi, '');
          var upperVfs = utils.upperCaseString(vfs);
          var lowerVfs = utils.lowerCaseString(vfs);
          var upperVfa = utils.upperCaseString(vf + "_AVG");
          // var lowerVfa = utils.lowerCaseString(upperVfa);
          //get sum
          sumValue = attributes[upperVfs];
          if (typeof sumValue === 'undefined') {
            sumValue = attributes[lowerVfs];
            delete attributes[lowerVfs];
          } else {
            delete attributes[upperVfs];
          }

          //calculate avg
          if ((!sumValue && typeof sumValue !== 'number') || !count) {
            attributes[upperVfa] = null;
            return;
          }

          avgValue = sumValue / count;

          attributes[upperVfa] = avgValue;

        });
      });

      return features;
    },

    _shouldCalcAvgForNullValue: function(config) {
      var mode = config && config.mode;
      return mode && (mode === 'category' || mode === 'field') && config.nullValue &&
        config.operation === 'average';
    },

    _shouldLaunchQuery: function() {
      var shouldLaunch = true;
      var queryNotFinish = Boolean(this.queryDeferred && (!this.queryDeferred.isResolved() &&
        !this.queryDeferred.isRejected()));
      var isSameQueryParameter = jimuUtils.isEqual(this._queryParameter, this._oldQueryParameter);
      if (queryNotFinish && isSameQueryParameter) {
        shouldLaunch = false;
      }
      this._oldQueryParameter = lang.clone(this._queryParameter);
      return shouldLaunch;
    },

    _getOutStatistics: function(statistic) {
      var fields = statistic.fields;
      var type = statistic.type;
      var nullZero = statistic.nullValue;

      var statisticType = type;
      if (nullZero && type === 'avg') {
        statisticType = 'sum';
      }
      var outStatistics = null;
      //outStatistics
      if (fields && fields.length) {
        outStatistics = fields.map(function(field) {
          var upperStatName = utils.upperCaseString(field + '_' + statisticType);
          var statisticDefinition = new StatisticDefinition();
          statisticDefinition.statisticType = statisticType;
          statisticDefinition.onStatisticField = field;
          statisticDefinition.outStatisticFieldName = upperStatName;
          return statisticDefinition;
        }.bind(this));
        if (nullZero && type === 'avg') {
          var sumCountDefinition = new StatisticDefinition();
          sumCountDefinition.statisticType = 'count';
          sumCountDefinition.onStatisticField = this._getStatisticsFieldForCountType(this.layerObject);
          sumCountDefinition.outStatisticFieldName = 'STAT_COUNT';
          outStatistics.push(sumCountDefinition);
        }
      } else {
        var countStatisticDefinition = new StatisticDefinition();
        countStatisticDefinition.statisticType = 'count';
        countStatisticDefinition.onStatisticField = this._getStatisticsFieldForCountType(this.layerObject);
        countStatisticDefinition.outStatisticFieldName = 'STAT_COUNT';
        outStatistics = [countStatisticDefinition];
      }
      return outStatistics;
    },

    _tryGenerateQueryParameter: function() {
      this._queryParameter = {};
      if (this._layerUrl) {
        this._queryParameter.url = this._layerUrl;
      }
      if (this._layerFilter) {
        this._queryParameter.where = this._layerFilter;
      }

      var statType, field, outName;
      if (!this.returnFeatures) {
        if (this.statistic) {
          statType = this.statistic.type;
          field = this.statistic.field;
          outName = utils.upperCaseString(field + '_' + statType);

          if (this.statistic.type === 'count') {
            field = this._getStatisticsFieldForCountType(this.layerObject);
            outName = 'STAT_COUNT';
          }

          var statisticDefinition = new StatisticDefinition();
          statisticDefinition.statisticType = statType;
          statisticDefinition.onStatisticField = field;
          statisticDefinition.outStatisticFieldName = outName;
          this._queryParameter.outStatistics = [statisticDefinition];
        }
      } else {
        if (this.statistic) {
          this._queryParameter.outStatistics = this._getOutStatistics(this.statistic);
          if (this.statistic.groupByFields) {
            this._queryParameter.groupByFieldsForStatistics = this.statistic.groupByFields;
          }
        }
      }
    },

    _getStatisticsFieldForCountType: function(layerObject) {
      var objectIdField = null;
      if (layerObject) {
        var fields = layerObject.fields;
        var fieldInfo = fields && fields.filter(function(e) {
          return e.type === this.oidFieldType;
        }.bind(this))[0];
        objectIdField = fieldInfo && fieldInfo.name;
      }
      return objectIdField || '*';
    },

    _doQuery: function() {
      var deferred = new Deferred();

      if (!this._queryParameter) {
        deferred.reject('Empty query parameter.');
        return deferred;
      }
      if (!this._queryParameter.url) {
        deferred.reject('Empty layer url.');
        return deferred;
      }
      var queryTask = new QueryTask(this._queryParameter.url);
      var query = new Query();
      query.where = this._queryParameter.where || '1=1';
      query.returnGeometry = false;
      if (this.dataSource.filterByExtent && this.map) {
        query.geometry = this.map.extent;
      }

      if (this._queryParameter.groupByFieldsForStatistics) {
        query.groupByFieldsForStatistics = this._queryParameter.groupByFieldsForStatistics;
      }

      if (!this._hasVaildOutStatistics(this._queryParameter.outStatistics)) {
        deferred.reject('Invaild outStatistics of query params.');
        return deferred;
      } else {
        query.outStatistics = this._queryParameter.outStatistics;
      }

      if (this._queryParameter.orderByFields) {
        query.orderByFields = this._queryParameter.orderByFields;
      }
      return queryTask.execute(query);
    },

    _hasVaildOutStatistics: function(outStatistics) {
      if (!outStatistics || !outStatistics.length) {
        return false;
      }
      return outStatistics.every(function(os) {
        return this._isTrueOrZero(os.onStatisticField) &&
          this._isTrueOrZero(os.outStatisticFieldName) &&
          !!os.statisticType;
      }.bind(this));

    },

    _isTrueOrZero: function(value) {
      return !!value || value === 0;
    },

    _tryGetLayerObject: function() {
      var deferred = new Deferred();
      var isLayerFromMap = this.dataSource.dataSourceType === "DATA_SOURCE_FEATURE_LAYER_FROM_MAP";
      if (!isLayerFromMap) {
        deferred.resolve();
        return deferred;
      }

      var layerInfo = this.layerInfosObj.getLayerInfoById(this.dataSource.layerId);

      if (layerInfo) {
        this.layerInfo = layerInfo;
        if (this.layerObject) {
          this._layerUrl = this.layerObject.url;
          deferred.resolve();
          return deferred;
        }
        return layerInfo.getLayerObject().then(lang.hitch(this, function(layerObject) {
          this.layerObject = layerObject;
          this._layerUrl = this.layerObject.url;
          return;
        }));
      } else {
        deferred.reject('invaild data source');
        return deferred;
      }
    },

    _isNeededCalculateForClient: function() {
      var hasSelectedFeatures = this.layerObject && this.useSelection &&
        this.layerObject.getSelectedFeatures().length > 0;
      var supportsStatistics = this._isSupportServerStatByExtent();
      return hasSelectedFeatures || !supportsStatistics;
    },

    _resetExtentChangeHandle: function() {
      if (this.exchetChangeHandle && this.exchetChangeHandle.remove) {
        this.exchetChangeHandle.remove();
        this.exchetChangeHandle = null;
      }
    },

    _resetUpdateEndHandle: function() {
      if (this.updateEndHandle && this.updateEndHandle.remove) {
        this.updateEndHandle.remove();
        this.updateEndHandle = null;
      }
    },

    _resetFilterChangedHandle: function() {
      if (this.filterChangedHandle && this.filterChangedHandle.remove) {
        this.filterChangedHandle.remove();
        this.filterChangedHandle = null;
      }

    },

    _resetSelectionHandle: function() {
      if (this.selectionHandle && this.selectionHandle.remove) {
        this.selectionHandle.remove();
        this.selectionHandle = null;
      }
    },

    _resetRefreshIntervalHandle: function() {
      if (this.refreshIntervalHandle && this.refreshIntervalHandle.remove) {
        this.refreshIntervalHandle.remove();
        this.refreshIntervalHandle = null;
      }
    },

    _resetTimeIntervalHandle: function() {
      if (this.timeIntervalHandle) {
        clearInterval(this.timeIntervalHandle);
        this.timeIntervalHandle = null;
      }
    },

    _removeHandles: function() {
      this._resetExtentChangeHandle();
      this._resetUpdateEndHandle();
      this._resetFilterChangedHandle();
      this._resetSelectionHandle();
      this._resetRefreshIntervalHandle();
      this._resetTimeIntervalHandle();
      this._resetSelectionHandle();
    }

  });
});
