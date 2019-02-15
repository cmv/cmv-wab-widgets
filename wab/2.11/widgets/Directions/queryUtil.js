define([
  'dojo/Deferred',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'jimu/LayerInfos/LayerInfos',
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",
  "esri/graphic",
  "esri/tasks/FeatureSet"
],
  function (Deferred, EsriQuery, QueryTask, LayerInfos, Point, Polyline, Polygon, Graphic, FeatureSet) {
    var mo = {};

    mo.queryBarriers = function (config) {
      var defs = [];
      if (!mo.havePresetBarrierLayers(config)) {
        return defs;
      }

      var pointLayers = config.barrierLayers.pointLayers,
        polylineLayers = config.barrierLayers.polylineLayers,
        polygonLayers = config.barrierLayers.polygonLayers;

      this.layerInfosObj = LayerInfos.getInstanceSync();

      mo.getQueryDef(pointLayers, mo.isBarrierLayerInWebmap(pointLayers, this.layerInfosObj),
        this.layerInfosObj, "point", defs);
      mo.getQueryDef(polylineLayers, mo.isBarrierLayerInWebmap(polylineLayers, this.layerInfosObj),
        this.layerInfosObj, "polyline", defs);
      mo.getQueryDef(polygonLayers, mo.isBarrierLayerInWebmap(polygonLayers, this.layerInfosObj),
        this.layerInfosObj, "polygon", defs);

      return defs;
    };

    mo.isBarrierLayerInWebmap = function (layer, layerInfosObj) {
      var inWebmap = false;
      var id = layer[0];//only one
      layerInfosObj.traversal(function (layerInfo) {
        if (layerInfo.layerObject.id === id) {
          inWebmap = true;
        }
      });

      return inWebmap;
    };

    mo.getQueryDef = function (layers, isInWebmap, layerInfosObj, mode, defs) {
      var layerId = layers[0];//only one
      //layerInfo.layerObject.toJson().featureSet.features
      if (layerId && isInWebmap) {
        var layerInfo = layerInfosObj.getLayerInfoById(layerId);
        var layerObject = layerInfo.layerObject;
        var layerUrl = layerObject.url;

        if (layerUrl) {
          //common featurelayers
          var filter;
          if (layerInfo.getFilter) {
            filter = layerInfo.getFilter();
          }
          defs.push(mo.query(layerUrl, filter));
        } else if (!layerUrl && ("undefined" !== layerObject.toJson &&
          layerObject.toJson().featureSet && layerObject.toJson().featureSet.features)) {
          //for mapNodes layers
          var featureSet = layerInfo.layerObject.toJson().featureSet;
          var rawFeatures = featureSet.features;
          var newFeatureSet = new FeatureSet();

          if (mode === "point") {
            newFeatureSet.features = mo._getFeatures(rawFeatures, Point);
          } else if (mode === "polyline") {
            newFeatureSet.features = mo._getFeatures(rawFeatures, Polyline);
          } else if (mode === "polygon") {
            newFeatureSet.features = mo._getFeatures(rawFeatures, Polygon);
          }
          defs.push(new Deferred().resolve(newFeatureSet));
        } else {
          defs.push(new Deferred().resolve(null));
        }

      } else {
        defs.push(new Deferred().resolve(null));
      }
    };

    mo._getFeatures = function (rawFeatures, graphicType){
      var features = [];
      for (var i = 0, len = rawFeatures.length; i < len; i++) {
        var feature = new Graphic(new graphicType(rawFeatures[i].geometry), null, {BarrierType: 0});//API#3260: BarrierType=0
        features.push(feature);
      }

      return features;
    };

    mo.query = function (url, filter) {
      var queryTask = new QueryTask(url);
      var queryParams = new EsriQuery();

      var defaultFilter = "1=1";
      if (filter) {
        defaultFilter = filter;
      }
      queryParams.where = defaultFilter;

      queryParams.returnGeometry = true;
      queryParams.outFields = ["*"];
      return queryTask.execute(queryParams);
    };

    mo.havePresetBarrierLayers = function(config){
      if (!config || !config.barrierLayers) {
        return false;
      } else {
        if ((config.barrierLayers.pointLayers && "" === config.barrierLayers.pointLayers[0]) &&
          (config.barrierLayers.polylineLayers && "" === config.barrierLayers.polylineLayers[0]) &&
          (config.barrierLayers.polygonLayers && "" === config.barrierLayers.polygonLayers[0])) {
          return false;
        }

        return true;
      }
    };

    return mo;
  });
