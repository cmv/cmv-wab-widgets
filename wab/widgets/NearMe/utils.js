define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dojo/_base/array",
  "dojo/_base/lang"
], function (
  declare,
  _WidgetBase,
  array,
  lang
) {
  return declare([_WidgetBase], {
    map: null,
    postCreate: function () {
    },
    /**
    * This function gets selected layer details from map
    * @memberOf widgets/NearMe/utils
    **/
    getLayerDetailsFromMap: function (baseURL, relatedLayerId) {
      var selectedLayer = {};
      if (this.map && this.map.webMapResponse && this.map.webMapResponse
        .itemInfo && this.map.webMapResponse
        .itemInfo.itemData && this.map.webMapResponse.itemInfo.itemData
        .operationalLayers) {
        array.forEach(this.map.webMapResponse.itemInfo.itemData.operationalLayers,
          lang.hitch(this,
            function (layer) {
              if (layer.layerObject) {
                if (layer.layerType === "ArcGISMapServiceLayer" ||
                  layer.layerType === "ArcGISTiledMapServiceLayer") {
                  if (baseURL.substring(0, baseURL.length - 1) === layer.url) {
                    array.forEach(layer.resourceInfo.layers, lang.hitch(
                      this,
                      function (subLayer) {
                        //set layer title
                        if (subLayer.id === parseInt(relatedLayerId, 10)) {
                          selectedLayer.title = subLayer.name;
                          return;
                        }
                      }));
                    array.forEach(layer.layers, lang.hitch(this, function (subLayer) {
                      if (subLayer.id === parseInt(relatedLayerId, 10)) {
                        //set layer title
                        if (subLayer.name) {
                          selectedLayer.title = subLayer.name;
                        }
                        //set popup info
                        selectedLayer.popupInfo = subLayer.popupInfo;
                        if (subLayer.layerDefinition) {
                          //set layer's definitionExpression
                          if (subLayer.layerDefinition.definitionExpression) {
                            selectedLayer.definitionExpression = subLayer.layerDefinition
                                    .definitionExpression;
                          }
                          //set layer's renderer from webmap
                          if (subLayer.layerDefinition.drawingInfo && subLayer.layerDefinition
                                .drawingInfo.renderer) {
                            selectedLayer.renderer = subLayer.layerDefinition.drawingInfo
                                    .renderer;
                          }
                        }
                        return;
                      }
                    }));
                  }
                } else {
                  if (layer.url.replace(/.*?:\/\//g, "") === (
                      baseURL + relatedLayerId).replace(
                      /.*?:\/\//g, "")) {
                    //set layer title
                    selectedLayer.title = layer.title;
                    //set popup info
                    selectedLayer.popupInfo = layer.popupInfo;
                    if (layer.layerDefinition) {
                      //set layer's definitionExpression
                      if (layer.layerDefinition.definitionExpression) {
                        selectedLayer.definitionExpression = layer.layerDefinition
                                .definitionExpression;
                      }
                      //set layer's renderer from webmap
                      if (layer.layerDefinition.drawingInfo && layer.layerDefinition
                            .drawingInfo.renderer) {
                        selectedLayer.renderer = layer.layerDefinition.drawingInfo
                                .renderer;
                      }
                    }
                    return;
                  }
                }
              }
            }));
      }
      return selectedLayer;
    }

  });
});
