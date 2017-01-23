define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/dom-style',
  'dojo/dom-attr',
  'dojo/on',
  'dijit/_TemplatedMixin',
  'esri/layers/GraphicsLayer',
  'esri/layers/FeatureLayer',
  'esri/graphicsUtils',
  'esri/renderers/SimpleRenderer',
  'esri/renderers/jsonUtils',
  'esri/InfoTemplate',
  'jimu/exportUtils',
  'jimu/dijit/ExportChooser',
  'dojo/text!./FeatureSetRenderer.html',
  '../BaseResultRenderer',
  '../LayerOrderUtil',
  './defaultSymbol'
], function(declare, lang, array, html, domStyle, domAttr, on, _TemplatedMixin, GraphicsLayer,
  FeatureLayer, graphicsUtils, SimpleRenderer, rendererUtils, InfoTemplate,
  exportUtils, ExportChooser, template, BaseResultRenderer, LayerOrderUtil, defaultSymbol){
  return declare([BaseResultRenderer, _TemplatedMixin], {
    baseClass: 'jimu-gp-resultrenderer-base jimu-gp-renderer-draw-feature',
    templateString: template,

    postCreate: function(){
      this.inherited(arguments);
      if(this.value.features && this.value.features.length > 0){
        this._displayText();
        this._drawResultFeature(this.param, this.value);
      }else{
        domStyle.set(this.clearNode, 'display', 'none');
        domStyle.set(this.exportNode, 'display', 'none');
        this.labelContent.innerHTML = this.nls.emptyResult;
      }
    },

    destroy: function(){
      if(this.resultLayer){
        this.map.removeLayer(this.resultLayer);
      }
      this.inherited(arguments);
    },

    _displayText: function(){
      domStyle.set(this.clearNode, 'display', '');
      domAttr.set(this.clearNode, 'title', this.nls.clear);

      this.own(on(this.clearNode, 'click', lang.hitch(this, function(){
        if(this.resultLayer){
          if(this.map.infoWindow.isShowing){
            this.map.infoWindow.hide();
          }
          this.resultLayer.clear();
          //remove layer so it will not displayed in Layer List or Legend widget
          this.map.removeLayer(this.resultLayer);
        }
        domStyle.set(this.exportNode, 'display', 'none');
        domStyle.set(this.clearNode, 'display', 'none');
        this.labelContent.innerHTML = this.nls.cleared;
      })));

      if(this.config.showExportButton){
        domStyle.set(this.exportNode, 'display', '');
        domAttr.set(this.exportNode, 'title', this.nls.exportOutput);

        var ds = exportUtils.createDataSource({
          type: exportUtils.TYPE_FEATURESET,
          data: this.value,
          filename: this.param.name
        });
        this.exportChooser = new ExportChooser({
          dataSource: ds
        });
        this.exportChooser.hide();
        html.place(this.exportChooser.domNode, this.domNode);

        this.own(on(this.exportNode, 'click', lang.hitch(this, function(event){
          event.preventDefault();
          event.stopPropagation();
          this.exportChooser.show(event.clientX, event.clientY);
        })));
      }
    },

    _drawResultFeature: function(param, featureset){
      var infoTemplate;
      if(!param.popup){
        param.popup = {
          enablePopup: true,
          title: '',
          fields: []
        };
      }
      if(param.popup.enablePopup){
        //Use param.popup.title or a non-exist field name as the title of popup window.
        infoTemplate = new InfoTemplate(param.popup.title || '${Non-Exist-Field}',
            this._generatePopupContent(featureset));
      }
      if(this.config.shareResults && !this.config.useDynamicSchema){
        if(!param.defaultValue || !param.defaultValue.geometryType){
          throw Error('Output parameter default value does not provide enough information' +
            ' to draw feature layer.');
        }
        param.defaultValue.name = param.name;
        var featureCollection = {
          layerDefinition: param.defaultValue,
          featureSet: null
        };
        this.resultLayer =  new FeatureLayer(featureCollection, {
          id: this.widgetUID + param.name,
          infoTemplate: infoTemplate
        });
      }else{
        this.resultLayer =  new GraphicsLayer({
          id: this.widgetUID + param.name,
          infoTemplate: infoTemplate
        });
      }
      array.forEach(featureset.features, function(feature){
        this.resultLayer.add(feature);
      }, this);
      this.resultLayer.title = param.label || param.name;
      this._addResultLayer(param.name);

      var renderer = param.renderer;
      if(this.config.useDynamicSchema || !renderer){
        if(featureset.geometryType === 'esriGeometryPoint' ||
            featureset.geometryType === 'esriGeometryMultipoint'){
          renderer = new SimpleRenderer(defaultSymbol.pointSymbol);
        }else if(featureset.geometryType === 'esriGeometryPolyline'){
          renderer = new SimpleRenderer(defaultSymbol.lineSymbol);
        }else if(featureset.geometryType === 'esriGeometryPolygon'){
          renderer = new SimpleRenderer(defaultSymbol.polygonSymbol);
        }
      }else{
        renderer = rendererUtils.fromJson(renderer);
      }
      this.resultLayer.setRenderer(renderer);

      try{
        var extent = graphicsUtils.graphicsExtent(featureset.features);
        if(extent){
          this.resultLayer.fullExtent = extent.expand(1.4);
          this.map.setExtent(this.resultLayer.fullExtent);
        }
      }
      catch(e){
        console.error(e);
      }
    },

    _addResultLayer: function(paramName){
      var layerOrderUtil = new LayerOrderUtil(this.config, this.map);
      try{
        layerOrderUtil.calculateLayerIndex(paramName, this.widgetUID).then(
            lang.hitch(this, function(layerIndex){
          if(layerIndex !== -1){
            this.map.addLayer(this.resultLayer, layerIndex);
          }else{
            this.map.addLayer(this.resultLayer);
          }
        }));
      }catch(err){
        console.error(err.message);
        console.warn('Draw result feature set on the top of map');
        this.map.addLayer(this.resultLayer);
      }
    },

    _generatePopupContent: function(featureset){
      var str = '<div class="geoprocessing-popup">' +
          '<table class="geoprocessing-popup-table" ' +
          'cellpadding="0" cellspacing="0">' + '<tbody>';
      var rowStr = '';
      var fields;

      if(!this.config.useDynamicSchema &&
          this.param.popup.fields &&
          this.param.popup.fields.length > 0){
        fields = this.param.popup.fields;
      }else{
        fields = featureset.fields;
      }

      array.forEach(fields, function(field){
        var row = '<tr valign="top">' +
            '<td class="attr-name">' + field.alias + '</td>' +
            '<td class="attr-value">${' + field.name + '}</td>' +
            '</tr>';
        rowStr += row;
      });
      return str + rowStr + '</tbody></table></div>';
    }
  });
});
