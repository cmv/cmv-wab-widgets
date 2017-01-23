define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/dom-style',
  'dojo/on',
  'dijit/_TemplatedMixin',
  'dojo/text!./ResultImageLayerRenderer.html',
  '../BaseResultRenderer'
], function(declare, lang, array, domStyle, on, _TemplatedMixin, template, BaseResultRenderer){
  return declare([BaseResultRenderer, _TemplatedMixin], {
    baseClass: 'jimu-gp-resultrenderer-base jimu-gp-renderer-draw-feature',
    templateString: template,

    postCreate: function(){
      this.inherited(arguments);
      if(this.layer){
        this._displayText();
        this._addResultLayer(this.param, this.layer);
      }
    },

    destroy: function(){
      if(this.layer){
        this.map.removeLayer(this.layer);
        this.layer = null;
      }
      this.inherited(arguments);
    },

    _displayText: function(){
      domStyle.set(this.clearNode, 'display', '');

      this.own(on(this.clearNode, 'click', lang.hitch(this, function(){
        if(this.layer){
          if(this.map.infoWindow.isShowing){
            this.map.infoWindow.hide();
          }
          //remove layer so it will not displayed in Layer List or Legend widget
          this.map.removeLayer(this.layer);
          this.layer = null;
        }
        domStyle.set(this.clearNode, 'display', 'none');
      })));
    },

    _addResultLayer: function(param, layer){
      var layerIds = this.map.layerIds;
      var paramAlreadyInMap, layerIndex = -1;

      array.some(this.config.outputParams, function(param){
        if(param.dataType === 'GPFeatureRecordSetLayer' ||
            param.dataType === 'GPRasterDataLayer'){
          var layerId = this.widgetUID + param.name;
          layerIndex = layerIds.indexOf(layerId);
          if(layerIndex >= 0){
            paramAlreadyInMap = param;
            return true;
          }
        }
      }, this);

      if(paramAlreadyInMap){
        var paramIndex = this.config.outputParams.indexOf(param);
        var targetIndex = this.config.outputParams.indexOf(paramAlreadyInMap);

        if(paramIndex > targetIndex){//this layer is behind the target layer
          this.map.addLayer(layer, layerIndex);
        }else{
          this.map.addLayer(layer);
        }
      }else{
        this.map.addLayer(layer);
      }
    }
  });
});
