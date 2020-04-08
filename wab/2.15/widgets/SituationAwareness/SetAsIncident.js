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
  'jimu/BaseFeatureAction',
  'jimu/WidgetManager',
  'dojo/Deferred',
  'esri/tasks/query',
  'dojo/_base/lang',
  'dojo/dom-class'
], function (declare, BaseFeatureAction, WidgetManager, Deferred, Query, lang, domClass) {
  var clazz = declare(BaseFeatureAction, {
    map: null,
    iconFormat: 'png',

    isFeatureSupported: function (featureSet) {
      if (featureSet.features.length !== 1 || !featureSet.features[0].geometry) {
        return false;
      }
      return true;
    },

    onExecute: function (featureSet) {
      return WidgetManager.getInstance().triggerWidgetOpen(this.widgetId)
        .then(lang.hitch(this, function (widget) {
          var f = featureSet.features[0];
          domClass.add(widget.panelContainer, "loading");
          this._getFeatureGeometry(f, widget).then(lang.hitch(this, function (g) {
            f.geometry = g;
            //Added timeout so that map resize should not impact the setExtent
            setTimeout(function() {
              widget._setEventLocation({
                feature: f,
                type: 'add'
              });
            }, 500);
          }));
        }));
    },

    _getFeatureGeometry: function (feature, widget) {
      var def = new Deferred();
      if (feature && feature.getSourceLayer) {
        var layer = feature.getSourceLayer();
        if (layer.queryFeatures && layer.objectIdField &&
          layer.getMaxAllowableOffset && layer.getMaxAllowableOffset() > 0 &&
          feature.attributes.hasOwnProperty(layer.objectIdField)) {
          domClass.add(widget.panelContainer, "loading");

          var query = new Query();
          query.returnGeometry = true;
          query.maxAllowableOffset = 0;
          query.objectIds = [feature.attributes[layer.objectIdField]];
          query.outSpatialReference = this.map.spatialReference;
          layer.queryFeatures(query).then(function (r) {
            if (r && r.features && r.features[0] && r.features[0].geometry) {
              def.resolve(r.features[0].geometry);
            } else {
              def.resolve(feature.geometry);
            }
          }, function (err) {
            console.log(err);
            def.resolve(feature.geometry);
          });
        } else {
          def.resolve(feature.geometry);
        }
      } else {
        def.resolve(feature.geometry);
      }
      return def;
    }
  });
  return clazz;
});