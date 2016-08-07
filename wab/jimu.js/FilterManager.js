///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
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
    'dojo/topic',
    './LayerInfos/LayerInfos'
  ],
  function(declare, lang, topic,
    LayerInfos) {
    var instance = null;

    var clazz = declare(null, {
      /**
       * {
       *   layerId: {
       *     definitionExpression: //layer's definitionExpression
       *     filterExprs: {
       *       widgetId: exp
       *     }
       *   }
       * }
       * @type {[type]}
       */
      _filters: null,
      layerInfos: null,

      constructor: function() {
        this._filters = {};

        if (window.isBuilder) {
          topic.subscribe('app/mapLoaded', lang.hitch(this, this._onMapLoaded));
          topic.subscribe('app/mapChanged', lang.hitch(this, this._onMapChanged));
        } else {
          topic.subscribe('mapLoaded', lang.hitch(this, this._onMapLoaded));
          topic.subscribe('mapChanged', lang.hitch(this, this._onMapChanged));
        }

        topic.subscribe('widgetDestroyed', lang.hitch(this, this._onWidgetDestroyed));
      },

      getWidgetFilter: function(layerId, widgetId) {
        var prop = layerId + '.filterExprs.' + widgetId;
        return lang.getObject(prop, false, this._filters);
      },

      applyWidgetFilter: function(layerId, widgetId, expression) {
        var prop = layerId + '.filterExprs.' + widgetId;
        lang.setObject(prop, expression, this._filters);

        var layerInfo = this.layerInfos.getLayerInfoById(layerId);
        var filterExp = this._getFilterExp(layerId);
        if (filterExp !== null) {
          layerInfo.setFilter(filterExp);
        }
      },

      _onMapLoaded: function() {
        this.layerInfos = LayerInfos.getInstanceSync();

        this._traversalFilter();
      },

      _onMapChanged: function() {
        this.layerInfos = LayerInfos.getInstanceSync();

        this._traversalFilter();
      },

      _onWidgetDestroyed: function(w) {
        for (var layerId in this._filters) {
          if (this._filters[layerId]) {
            var filterExprs = this._filters[layerId];
            if (filterExprs) {
              for (var widgetId in filterExprs) {
                if (widgetId === w.id) {
                  delete filterExprs[widgetId];
                }
              }
            }
          }
        }
      },

      _traversalFilter: function() {
        this.layerInfos.traversal(lang.hitch(this, function(layerInfo) {
          if (!this._filters[layerInfo.id]) {
            this._filters[layerInfo.id] = {
              definitionExpression: layerInfo.getFilter(),
              filterExprs: {
                // widgetId: filterExpr
              }
            };
          }
        }));
      },

      _getFilterExp: function(layerId) {
        if (!this._filters[layerId]) {
          return null;
        }

        var parts = [];
        var dexp = this._filters[layerId].definitionExpression;
        var filterExprs = this._filters[layerId].filterExprs;
        if (dexp) {
          parts.push(dexp);
        }

        for (var p in filterExprs) {
          var expr = filterExprs[p];
          if (expr) {
            parts.push('(' + expr + ')');
          }
        }

        return parts.join(' AND ');
      }
    });

    clazz.getInstance = function() {
      if (instance === null) {
        instance = new clazz();
        window._filterManager = instance;
      } else {
        return instance;
      }
    };

    return clazz;
  });