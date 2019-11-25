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

define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'jimu/LayerInfos/LayerInfos',
  "dijit/form/Select",
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./BarrierLayers.html'
],
  function (declare, lang, LayerInfos, Select,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      templateString: template,

      constructor: function (options) {
        if (!options) {
          return;
        }
        this.nls = options.nls;
      },

      postCreate: function () {
        this.inherited(arguments);
      },
      startup: function () {
        this.layerInfosObj = LayerInfos.getInstanceSync();
        var pointLayers = [], polylineLayers = [], polygonLayers = [];
        this.layerInfosObj.traversal(lang.hitch(this, function (layerInfo) {
          if (layerInfo.layerObject.geometryType === "esriGeometryPoint" && this._isLayerInMap(layerInfo)) {
            pointLayers.push(layerInfo);
          }
          if (layerInfo.layerObject.geometryType === "esriGeometryPolyline" && this._isLayerInMap(layerInfo)) {
            polylineLayers.push(layerInfo);
          }
          if (layerInfo.layerObject.geometryType === "esriGeometryPolygon" && this._isLayerInMap(layerInfo)) {
            polygonLayers.push(layerInfo);
          }
        }));

        this.pointLayers = new Select({
          name: "pointLayers",
          options: this._getOptionsByLayers(pointLayers, this.nls.noPointBarrier)
        }).placeAt(this.pointLayersNode);
        this.pointLayers.startup();

        this.polylineLayers = new Select({
          name: "polylineLayers",
          options: this._getOptionsByLayers(polylineLayers, this.nls.noLineBarrier)
        }).placeAt(this.polylineLayersNode);
        this.polylineLayers.startup();

        this.polygonLayers = new Select({
          name: "polygonLayers",
          options: this._getOptionsByLayers(polygonLayers, this.nls.noPolygonBarrier)
        }).placeAt(this.polygonLayersNode);
        this.polygonLayers.startup();

        this.inherited(arguments);
      },
      destroy: function(){
        if (this.pointLayers && this.pointLayers.destroy) {
          this.pointLayers.closeDropDown();
          this.pointLayers.destroy();
        }
        if (this.polylineLayers && this.polylineLayers.destroy) {
          this.polylineLayers.closeDropDown();
          this.polylineLayers.destroy();
        }
        if (this.polygonLayers && this.polygonLayers.destroy) {
          this.polygonLayers.closeDropDown();
          this.polygonLayers.destroy();
        }
      },

      _getOptionsByLayers: function (layerInfos, emptyString) {
        var options = [];
        options.push({ "label": (emptyString || ""), "value": "", selected: "true" });
        for (var i = 0, len = layerInfos.length; i < len; i++) {
          var layerInfo = layerInfos[i];

          var label = layerInfo.title || layerInfo.id;
          var value = layerInfo.layerObject.id;//layerInfo.layerObject.url;

          options.push({ "label": label, "value": value });
        }
        //TODO "choose" option, when choose one add an option
        return options;
      },

      validate: function () {
        return true;//TODO no rules now
      },
      getValue: function () {
        var barrierLayers = {
          pointLayers: [],
          polylineLayers: [],
          polygonLayers: []
        };

        barrierLayers.pointLayers.push(this.pointLayers.getValue());
        barrierLayers.polylineLayers.push(this.polylineLayers.getValue());
        barrierLayers.polygonLayers.push(this.polygonLayers.getValue());

        return barrierLayers;
      },
      setValue: function (barrierLayers) {
        this._selectItem(this.pointLayers, barrierLayers.pointLayers || []);
        this._selectItem(this.polylineLayers, barrierLayers.polylineLayers || []);
        this._selectItem(this.polygonLayers, barrierLayers.polygonLayers || []);
      },
      _selectItem: function (selector, value) {
        var options = selector.getOptions();
        for (var i = 0, len = options.length; i < len; i++) {
          var option = options[i];
          if (option.value === value[0]) {
            selector.setValue(value[0]);//set value if it's in Webmap
          }
        }
      },
      _isLayerInMap: function (layerInfo) {
        var mapLayers = this.layerInfosObj.getLayerInfoArrayOfWebmap();
        var rootLayer = layerInfo.getRootLayerInfo();

        for (var i = 0, len = mapLayers.length; i < len; i++) {
          var l = mapLayers[i];
          if (l.id === layerInfo.id) {
            return true;
          }
          if (rootLayer && rootLayer.id === l.id) {
            return true;//for mapNote layers
          }
        }

        return false;//is a runtime added layer
      }
    });
  });