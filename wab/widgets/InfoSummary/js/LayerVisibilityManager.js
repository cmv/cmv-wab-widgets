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
  'dojo/_base/array',
  'jimu/LayerInfos/LayerInfos'
], function (declare, lang, array, LayerInfos) {
  var layerVisibilityManager = declare(null, {
    _layerList: {},
    _map: null,
    _initalLayerVisibility: {},
    _opLayers: null,
    _parent: null,

    constructor: function (options) {
      this._map = options.map;
      this._layerList = options.configLayerList;
      this._parent = options.parent;
      this.setOpLayers(this._map);
      this.storeInitalVisibility();
      this.setInitalVisibility();
    },

    setOpLayers: function (map) {
      if (map.itemId) {
        LayerInfos.getInstance(map, map.itemInfo)
          .then(lang.hitch(this, function (operLayerInfos) {
            this._opLayers = operLayerInfos;
          }));
      }
    },

    setInitalVisibility: function () {
      for (var k in this._layerList) {
        var l = this._layerList[k];
        if (l.type === 'ClusterLayer') {
          if (l.layerObject.setVisibility) {
            l.layerObject.setVisibility(true);
          }
          l.layerObject.visible = true;

          if (l.layerObject._parentLayer) {
            if (l.layerObject._parentLayer.setVisibility) {
              l.layerObject._parentLayer.setVisibility(false);
            }
            if (l.layerObject._parentLayer.hasOwnProperty('visibility')) {
              l.layerObject._parentLayer.visibility = false;
            }
          }
        }

        var _Pl;
        if (l.layerObject.layerInfos) {
          _Pl = l.layerObject;
        } else if (l.li && typeof (l.li.parentLayerID) !== 'undefined') {
          _Pl = this._map.getLayer(l.li.parentLayerID);
        }

        if (_Pl && _Pl.visibleLayers) {
          var visLayers = lang.clone(_Pl.visibleLayers);
          if (_Pl.layerInfos) {
            if (_Pl.layerInfos.length > 0) {
              if (l.li) {
                if (typeof (l.li.subLayerId) !== 'undefined' && visLayers.indexOf(l.li.subLayerId) === -1) {
                  if (l.type !== "ClusterLayer") {
                    visLayers.push(l.li.subLayerId);
                  }
                } else if (visLayers.indexOf(l.li.subLayerId) > -1 && l.type === "ClusterLayer") {
                  visLayers.splice(visLayers.indexOf(l.li.subLayerId), 1);
                }
              }
            }
            if (visLayers) {
              _Pl.setVisibleLayers(visLayers);
            }
            if (_Pl.setVisibility) {
              _Pl.setVisibility(true);
            }

            if (_Pl.hasOwnProperty('visible')) {
              _Pl.visible = true;
            }
          }
        }
      }
    },

    storeInitalVisibility: function () {
      //capture the inital visible state of all layers
      // visibility will be turned off when the widget opens and we want to set them back
      // to the inital state when the widget is closed
      this._initalLayerVisibility = {};
      array.forEach(this._opLayers._operLayers, lang.hitch(this, function (layer) {
        if (layer.layerType === "ArcGISFeatureLayer" ||
        layer.layerType === "ArcGISMapServiceLayer" ||
        typeof (layer.layerType) === 'undefined') {
          if (layer.layerObject && this.shouldCheck(layer)) {
            this._initalLayerVisibility[layer.id] = {
              type: layer.layerType,
              layerObject: layer.layerObject,
              visible: layer.layerObject.visible,
              visibleSubLayers: lang.clone(layer.layerObject.visibleLayers)
            };
          } else if (layer.featureCollection) {
            for (var i = 0; i < layer.featureCollection.layers.length; i++) {
              var lyr = layer.featureCollection.layers[i];
              if (this.shouldCheck(lyr)) {
                this._initalLayerVisibility[lyr.id] = {
                  type: lyr.layerType,
                  layerObject: lyr.layerObject,
                  visible: typeof (lyr.layerObject.visible) !== 'undefined' ? lyr.layerObject.visible : lyr.visibility,
                  pl: layer
                };
              }
            }
          } else if (layer.layers) {
            this._initalLayerVisibility[layer.id] = {
              type: layer.layerType,
              layerObject: layer.layerObject,
              visible: layer.layerObject.visible,
              visibleSubLayers: lang.clone(layer.layerObject.visibleLayers)
            };
          }
        }
      }));
    },

    shouldCheck: function (l) {
      //this.layerList is a list configured layers similar in structure to the initalLayerVisibility
      // {key: <LayerID>, values: { type: <LayerTypeString>, layerObject: <LayerInstance>, visible: <bool>}}
      return this._layerList ? !(l.id in this._layerList) : true;
    },

    setLayerVisibility: function (lyrs, auto) {
      //if auto is true all layers will be marked as visible false
      //if auto is false all layers will set to the inital visibility captured onOpen
      // expectes the layers object to be {key: <LayerID>, values: { type: <LayerTypeString>, layerObject: <LayerInstance>, visible: <bool>}}
      var alreadyChecked = [];
      if (lyrs) {
        for (var key in lyrs) {
          var l = lyrs[key];

          if (alreadyChecked.indexOf(l.id) === -1) {
            if (l.visibleSubLayers) {
              l.layerObject.setVisibleLayers(l.visibleSubLayers);
            } else if (typeof (l.pl) === 'undefined') {
              l.layerObject.setVisibility(auto ? false : l.visible);
            } else {
              var visLayers = lang.clone(l.layerObject.visibleLayers);
              if (l.layerObject.layerInfos) {
                if (l.layerObject.layerInfos.length > 0) {

                  for (var k in lyrs) {
                    var kk = lyrs[k];
                    if (kk.li) {
                      if (kk.li.subLayerId && visLayers.indexOf(kk.li.subLayerId) === -1) {
                        visLayers.push(kk.li.subLayerId);
                      }
                    }
                  }
                }
                if (!auto) {
                  if (visLayers) {
                    l.layerObject.setVisibleLayers(visLayers);
                  }
                  if (l.layerObject.setVisibility) {
                    l.layerObject.setVisibility(true);
                  }
                } else {
                  //TODO this should only happen once for a mapservice layer
                  //need to update alreadyChecked in a way that would prevent it
                  var initalLayer = this._initalLayerVisibility[l.layerObject.id];
                  if (initalLayer.visibleSubLayers) {
                    l.layerObject.setVisibleLayers(initalLayer.visibleSubLayers);
                    if (l.layerObject.setVisibility) {
                      l.layerObject.setVisibility(true);
                    }
                  }
                }
              } else {
                if (l.layerObject.setVisibility) {
                  l.layerObject.setVisibility(auto ? false : l.visible);
                }
                if (l.pl.hasOwnProperty('visibility')) {
                  l.pl.visibility = auto ? false : l.visible;
                }
              }
            }
          }
        }
      }
    },

    resetLayerVisibility: function () {
      //return layers to the inital visible state
      this.setLayerVisibility(this._initalLayerVisibility, false);
      this._initalLayerVisibility = {};
      var clusterLayers = {};
      for (var key in this._layerList) {
        if (this._layerList[key].type === "ClusterLayer") {
          clusterLayers[key] = this._layerList[key];
          if (this._layerList[key].pl) {
            if (this._layerList[key].pl.setVisibility) {
              this._layerList[key].pl.setVisibility(true);
            }
            if (this._layerList[key].pl.hasOwnProperty('visibility')) {
              this._layerList[key].pl.visibility = true;
            }
          }
        }
      }
      if (Object.keys(clusterLayers).length > 0) {
        this.setLayerVisibility(clusterLayers, true);
      }

      this._layerList = {};
    }
  });

  return layerVisibilityManager;
});
