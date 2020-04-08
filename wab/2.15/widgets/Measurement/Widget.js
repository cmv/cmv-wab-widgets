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
    'dojo/aspect',
    'dojo/on',
    'dojo/keys',
    'dojo/Deferred',
    'dojo/_base/html',
    'jimu/LayerInfos/LayerInfos',
    'esri/layers/GraphicsLayer',
    'esri/layers/FeatureLayer',
    'esri/graphic',
    // 'esri/symbols/TextSymbol',
    // 'esri/symbols/Font',
    // 'dojo/_base/Color',
    'jimu/dijit/LoadingIndicator',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidget',
    'jimu/portalUtils',
    'jimu/dijit/Message',
    'esri/units',
    'esri/dijit/Measurement',
    'jimu/utils',
    "esri/symbols/jsonUtils"
  ],
  function(
    declare,
    lang,
    aspect,
    on,
    keys,
    Deferred,
    html, LayerInfos, GraphicsLayer, FeatureLayer, Graphic,
    // TextSymbol, Font, Color,
    LoadingIndicator,
    _WidgetsInTemplateMixin,
    BaseWidget,
    PortalUtils,
    Message,
    esriUnits,
    Measurement,
    jimuUtils,
    jsonUtils) {
    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {

      name: 'Measurement',
      baseClass: 'jimu-widget-Measurement',
      measurement: null,
      _pcDef: null,

      toolName: null, //includes: location, distance, area
      currentFeatureLayer: null, //layer which saves drawing graphics
      linePicGraphicsLayer: null, //layer which save pic graphics for line
      linePicGraphics: [],  //save pic graphics for line
      isClose: false, //set true when closing the widget

      _objectIdName: 'OBJECTID',
      _objectIdType: 'esriFieldTypeOID',

      postMixInProperties: function(){
        this.inherited(arguments);
        this.jimuNls = window.jimuNls;
      },

      startup: function() {
        if (this.measurement || this._pcDef) {
          return;
        }
        this.inherited(arguments);

        this._isPCS = this.map.cs !== "Web Mercator" &&
          (this.map.spatialReference && this.map.spatialReference.wkid !== 4326);

        this._clearAbledLabel = this.clearGraphicsBtn.innerHTML;
        this._clearDisabledLabel = this._clearAbledLabel + ' ' + window.jimuNls.common.disabled;

        var json = this.config.measurement;
        json.map = this.map;
        if (json.lineSymbol) {
          json.lineSymbol = jsonUtils.fromJson(json.lineSymbol);
        }
        if (json.pointSymbol) {
          json.pointSymbol = jsonUtils.fromJson(json.pointSymbol);
        }

        //add snap tips
        this._addSnappingTips();

        this._processConfig(json).then(lang.hitch(this, function(measurementJson) {
          this.measurement = new Measurement(measurementJson, this.measurementDiv);
          this.own(aspect.after(this.measurement, 'setTool', lang.hitch(this, function() {
            if (this.measurement.activeTool) {
              this.disableWebMapPopup();
            } else {
              this.enableWebMapPopup();
            }
          })));
          this.own(on(this.measurement, 'tool-change', lang.hitch(this, this._toolChange)));
          this.own(on(this.measurement, 'measure-start', lang.hitch(this, this._onMeasureStart)));
          this.own(on(this.measurement, 'measure-end', lang.hitch(this, this._onMeasureEnd)));
          this.measurement.startup();

          this._initGraphicsLayers();

          this._hideToolsByConfig();
          this._initFirstFocusNode();
        }), lang.hitch(this, function(err) {
          new Message({
            message: err.message || err
          });
        }));
      },

      _addSnappingTips: function(){
        if(this.map.snappingManager){
          var dom = document.createElement('div');
          dom.className = "snapingLabel";
          dom.innerHTML = this.jimuNls.snapping.pressStr + "<b>" +
                          this.jimuNls.snapping.ctrlStr + "</b> " +
                          this.jimuNls.snapping.snapStr;
          this.domNode.parentNode.appendChild(dom);
        }
      },

      _initGraphicsLayers: function(){
        if(!this.config.isOperationalLayer){
          this.currentFeatureLayer = new GraphicsLayer();
          this.map.addLayer(this.currentFeatureLayer);
          this._setCurrentFeatureLayerVisible();
        }
        //use a graphicLayer to save graphics for line node pic
        this.linePicGraphicsLayer = new GraphicsLayer();
        this.map.addLayer(this.linePicGraphicsLayer);
      },

      _clearAllGraphics: function(){
        if(this.currentFeatureLayer){
          this.currentFeatureLayer.clear();
          if(this.linePicGraphicsLayer){
            this.linePicGraphicsLayer.clear();
            this.linePicGraphics = [];
          }
          html.addClass(this.clearGraphicsBtn, 'jimu-state-disabled');
          html.attr(this.clearGraphicsBtn, "aria-label", this._clearDisabledLabel);
        }
      },

      //clear current graphics from map (for measurement dijit api)
      _clearMapGraphics: function(toolName){
        var graphicsLayer = this.map.graphics;
        if(toolName === 'distance'){
          var mapGraphics = graphicsLayer.graphics;
          this.linePicGraphics = [];
          for(var key = 0; key < mapGraphics.length; key ++){ //need to keep the pic markers
            var gra = mapGraphics[key];
            var gType = (gra.symbol && gra.symbol.type) ? gra.symbol.type : null;
            if(gType === 'picturemarkersymbol'){
              var newGra = new Graphic(gra.geometry, gra.symbol, null, null);
              this.linePicGraphics.push(newGra);
            }
          }
        }
        graphicsLayer.clear();
      },

      _onMeasureStart: function(){
        if(this._isPCS){
          this._isMeasureEnd = false;
        }
        this._clearAllGraphics();
        html.addClass(this.clearGraphicsBtn, 'jimu-state-disabled');
        html.attr(this.clearGraphicsBtn, "aria-label", this._clearDisabledLabel);
      },

      _onMeasureEnd:function(measureInfo){
        if(this._isPCS && measureInfo.toolName !== 'location'){
          if(this._isMeasureEnd){
            return; //block multiple renders, #16294
          }else{
            this._isMeasureEnd = true;
          }
        }
        //use graphicLayer
        if(measureInfo.toolName === 'location' && this._isPCS){
          html.removeClass(this.clearGraphicsBtn, 'jimu-state-disabled');
          html.attr(this.clearGraphicsBtn, "aria-label", this._clearAbledLabel);
          return;
        }
        this._clearMapGraphics(measureInfo.toolName);

        var graphic, symbol, value = '';
        if(measureInfo.toolName === 'location'){
          this._clearAllGraphics(); //location won't enter measure-start event
          value = measureInfo.values[0] + ',' + measureInfo.values[1] + measureInfo.unitName;
          symbol = this.measurement._pointSymbol;
        }else if(measureInfo.toolName === 'distance'){
          symbol = this.measurement._lineSymbol;
          value = Math.round(measureInfo.values) + measureInfo.unitName;
          for(var key = 0; key < this.linePicGraphics.length; key ++){
            this.linePicGraphicsLayer.add(this.linePicGraphics[key]);
          }
        }else{ //area
          symbol = this.measurement._fillSymbol;
          value = Math.round(measureInfo.values) + measureInfo.unitName;
        }
        graphic = new Graphic(measureInfo.geometry, symbol, {'OBJECTID': 1}, null);

        //add label
        // var a = Font.STYLE_ITALIC, b = Font.VARIANT_NORMAL, c = Font.WEIGHT_BOLD;
        // var symbolFont = new Font("16px", a, b, c, "Courier");
        // var fontColor = new Color([0, 0, 0, 1]);
        // var textSymbol = new TextSymbol(value, symbolFont, fontColor);
        // var labelGraphic = new Graphic(measureInfo.geometry, textSymbol.setOffset(0, 20 ));

        this.currentFeatureLayer.add(graphic);
        html.removeClass(this.clearGraphicsBtn, 'jimu-state-disabled');
        html.attr(this.clearGraphicsBtn, "aria-label", this._clearAbledLabel);
      },

      _toolChange: function(toolInfo){
        this.toolName = toolInfo.toolName;
        if(!this.isClose){
          html.addClass(this.clearGraphicsBtn, 'jimu-state-disabled');
          html.attr(this.clearGraphicsBtn, "aria-label", this._clearDisabledLabel);
          this._clearAllGraphics();
        }
        this.isClose = false;
        if(this.config.isOperationalLayer){
          if(this.toolName){ //checked
            this._checkOperateLayers(this.toolName);
          }
        }else{
        }
      },

      _checkOperateLayers: function(type){
        if(this.currentFeatureLayer){
          this.map.removeLayer(this.currentFeatureLayer);
          this.currentFeatureLayer = null;
        }
        var layerDefinition = {
          "name": this.nls._widgetLabel,
          "geometryType": "",
          "fields": [{
            "name": this._objectIdName,
            "type": this._objectIdType,
            "alias": this._objectIdName
          }]
        };
        // var layerDefinition = lang.clone(definition);
        if(type === 'location'){
          layerDefinition.geometryType = "esriGeometryPoint";
        }else if(type === 'distance' && !this._polylineLayer){
          layerDefinition.geometryType = "esriGeometryPolyline";
        }else if(type === 'area' && !this._polygonLayer){
          layerDefinition.geometryType = "esriGeometryPolygon";
        }

        var layer = this._getFeatureLayer(layerDefinition);
        this.currentFeatureLayer = layer;
        this.linePicGraphicsLayer.setVisibility(true);
        this._setCurrentFeatureLayerVisible();

        this._addLayerFromLayerInfos(layer);
      },

      _getFeatureLayer: function(labelDefinition){
        return new FeatureLayer({
          layerDefinition: labelDefinition,
          featureSet: null
        });
      },

      _setCurrentFeatureLayerVisible: function(){
        this.own(on(this.currentFeatureLayer, 'visibility-change', lang.hitch(this, function(){
          if(this.linePicGraphicsLayer){
            this.linePicGraphicsLayer.setVisibility(this.currentFeatureLayer.visible);
          }
        })));
      },

      _addLayerFromLayerInfos: function(layer){
        var loading = new LoadingIndicator();
        loading.placeAt(this.domNode);
        LayerInfos.getInstance(this.map, this.map.itemInfo)
        .then(lang.hitch(this, function(layerInfos){
          if(!this.domNode){
            return;
          }
          loading.destroy();
          var layername = layer.name;
          layerInfos.addFeatureCollection([layer], this.label + "_" + layername);
        }), lang.hitch(this, function(err){
          loading.destroy();
          console.error("Can not get LayerInfos instance", err);
        }));
      },

      _processConfig: function(configJson) {
        this._pcDef = new Deferred();
        if (configJson.defaultLengthUnit && configJson.defaultAreaUnit) {
          this._pcDef.resolve(configJson);
        } else {
          PortalUtils.getUnits(this.appConfig.portalUrl).then(lang.hitch(this, function(units) {
            configJson.defaultAreaUnit = units === 'english' ?
              esriUnits.SQUARE_MILES : esriUnits.SQUARE_KILOMETERS;
            configJson.defaultLengthUnit = units === 'english' ?
              esriUnits.MILES : esriUnits.KILOMETERS;
            this._pcDef.resolve(configJson);
          }), lang.hitch(this, function(err) {
            console.error(err);
            configJson.defaultAreaUnit = esriUnits.SQUARE_MILES;
            configJson.defaultLengthUnit = esriUnits.MILES;
            this._pcDef.resolve(configJson);
          }));
        }

        return this._pcDef.promise;
      },

      _hideToolsByConfig: function() {
        if (false === this.config.showArea) {
          this.measurement.hideTool("area");
        }
        if (false === this.config.showDistance) {
          this.measurement.hideTool("distance");
        }
        if (false === this.config.showLocation) {
          this.measurement.hideTool("location");
        }
      },

      _initFirstFocusNode: function(){
        var firstTool = null;
        if (this.config.showArea) {
          firstTool = this.measurement._areaButton;
        }else if (this.config.showDistance) {
          firstTool = this.measurement._distanceButton;
        }else if (this.config.showLocation) {
          firstTool = this.measurement._locationButton;
        }
        jimuUtils.initFirstFocusNode(this.domNode, firstTool.focusNode);
      },

      disableWebMapPopup: function() {
        this.map.setInfoWindowOnClick(false);
      },

      enableWebMapPopup: function() {
        this.map.setInfoWindowOnClick(true);
      },

      onDeActive: function() {
        if(this.toolName === 'location' && this._isPCS){
          var graphicLayer = this.map.graphics;
          var mapGraphics = graphicLayer.graphics; //popup rect my in this array.
          for(var key = 0; key < mapGraphics.length; key ++){ //find the pic markers
            var gra = mapGraphics[key];
            var gType = (gra.symbol && gra.symbol.type) ? gra.symbol.type : null;
            if(gType === 'picturemarkersymbol' && this.measurement._pointSymbol === gra.symbol){
              var newGra = new Graphic(gra.geometry, gra.symbol, {'OBJECTID': 1}, null);
              this.currentFeatureLayer.add(newGra);
              graphicLayer.remove(gra);
              break;
            }
          }
        }
        this.onClose();
      },

      onOpen: function(){
      },

      onClose: function() {
        if (this.measurement && this.measurement.activeTool) {
          // this.measurement.clearResult();
          this.isClose = true;
          this.measurement.setTool(this.measurement.activeTool, false);
        }
        this.keepGraphics();
      },

      keepGraphics: function(){
        if(this.config.isOperationalLayer){
          if(this.currentFeatureLayer && this.currentFeatureLayer.graphics.length === 0){
            this.map.removeLayer(this.currentFeatureLayer);
            this.currentFeatureLayer = null;
          }
        }
      },

      clearGraphics: function(){
        this.measurement.clearResult();
        if(this.currentFeatureLayer){
          this.currentFeatureLayer.clear();
          if(this.linePicGraphicsLayer){
            this.linePicGraphicsLayer.clear();
          }
        }
        html.addClass(this.clearGraphicsBtn, 'jimu-state-disabled');
        html.attr(this.clearGraphicsBtn, "aria-label", this._clearDisabledLabel);
      },

      clearGraphicsKeydown: function(evt){
        if((evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) &&
          !html.hasClass(this.clearGraphicsBtn, 'jimu-state-disabled')){
          this.clearGraphics();
        }
      },

      destroy: function() {
        if (this.measurement) {
          this.measurement.destroy();
          //destory layers
          if(this.currentFeatureLayer){
            this.currentFeatureLayer.clear();
            this.map.removeLayer(this.currentFeatureLayer);
            this.currentFeatureLayer = null;
          }
          if(this.linePicGraphicsLayer){
            this.linePicGraphicsLayer.clear();
            this.map.removeLayer(this.linePicGraphicsLayer);
            this.linePicGraphicsLayer = null;
          }
        }
        this.inherited(arguments);
      }
    });
    return clazz;
  });