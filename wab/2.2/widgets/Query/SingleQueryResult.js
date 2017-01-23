///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
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
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/Evented',
    'dojo/text!./SingleQueryResult.html',
    'dojo/_base/lang',
    'dojo/_base/query',
    'dojo/_base/html',
    'dojo/_base/array',
    'dojo/Deferred',
    'esri/lang',
    'esri/tasks/QueryTask',
    'esri/tasks/FeatureSet',
    'esri/symbols/jsonUtils',
    'esri/dijit/PopupTemplate',
    'esri/dijit/PopupRenderer',
    'esri/tasks/RelationshipQuery',
    'jimu/utils',
    'jimu/symbolUtils',
    'jimu/dijit/Message',
    'jimu/dijit/PopupMenu',
    'jimu/BaseFeatureAction',
    'jimu/LayerInfos/LayerInfos',
    'jimu/FeatureActionManager',
    './SingleQueryLoader',
    './RelatedRecordsResult',
    'jimu/dijit/LoadingShelter'
  ],
  function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, template, lang, query,
    html, array, Deferred, esriLang, QueryTask, FeatureSet, symbolJsonUtils, PopupTemplate, PopupRenderer,
    RelationshipQuery, jimuUtils, jimuSymbolUtils, Message, PopupMenu, BaseFeatureAction, LayerInfos,
    FeatureActionManager, SingleQueryLoader, RelatedRecordsResult) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

      baseClass: 'single-query-result',
      templateString: template,
      singleQueryLoader: null,
      featureLayer: null,//used for execute queryRelatedFeatures
      relatedRecordsResult: null,
      popupMenu: null,

      //options:
      map: null,
      nls: null,
      currentAttrs: null,
      queryWidget: null,

      //public methods:
      //getCurrentAttrs
      //zoomToLayer
      //executeQueryForFirstTime

      //we can get where,geometry and resultLayer from singleQueryLoader
      getCurrentAttrs: function(){
        if(this.singleQueryLoader){
          return this.singleQueryLoader.getCurrentAttrs();
        }
        return null;
      },

      postCreate:function(){
        this.inherited(arguments);
        //init SingleQueryLoader
        this.singleQueryLoader = new SingleQueryLoader(this.map, this.currentAttrs);
        this.popupMenu = PopupMenu.getInstance();
        this.featureActionManager = FeatureActionManager.getInstance();
        this.btnFeatureAction.title = window.jimuNls.featureActions.featureActions;
      },

      destroy: function(){
        this.queryWidget = null;
        var currentAttrs = this.getCurrentAttrs();
        if(currentAttrs){
          if(currentAttrs.query){
            if(currentAttrs.query.resultLayer){
              if(currentAttrs.query.resultLayer.getMap()){
                this.map.removeLayer(currentAttrs.query.resultLayer);
              }
            }
            currentAttrs.query.resultLayer = null;
          }
        }
        this.inherited(arguments);
      },

      _isValidNumber: function(v){
        return typeof v === "number" && !isNaN(v);
      },

      zoomToLayer: function(){
        var currentAttrs = this.getCurrentAttrs();
        var resultLayer = currentAttrs.query.resultLayer;
        if(resultLayer && !this._isTable(currentAttrs.layerInfo)){
          //we should validate geometries to calculate extent
          var graphics = array.filter(resultLayer.graphics, lang.hitch(this, function(g){
            var geo = g.geometry;
            if(geo){
              //x and y maybe "NaN"
              if(geo.type === 'point'){
                return this._isValidNumber(geo.x) && this._isValidNumber(geo.y);
              }else if(geo.type === 'multipoint'){
                if(geo.points && geo.points.length > 0){
                  return array.every(geo.points, lang.hitch(this, function(xyArray){
                    if(xyArray){
                      return this._isValidNumber(xyArray[0]) && this._isValidNumber(xyArray[1]);
                    }else{
                      return false;
                    }
                  }));
                }else{
                  return false;
                }
              }else{
                return true;
              }
            }else{
              return false;
            }
          }));
          if(graphics.length > 0){
            var ext = jimuUtils.graphicsExtent(graphics, 1.4);
            if(ext){
              this.map.setExtent(ext);
            }
          }
        }
      },

      //start to query
      executeQueryForFirstTime: function(){
        var def = new Deferred();

        //reset result page
        this._clearResultPage();
        this._hideResultsNumberDiv();

        var currentAttrs = this.getCurrentAttrs();

        var resultLayer = currentAttrs.query.resultLayer;

        var callback = lang.hitch(this, function(features) {
          if (!this.domNode) {
            return;
          }
          this.shelter.hide();
          var allCount = currentAttrs.query.allCount;
          this._updateNumSpan(allCount);
          if (allCount > 0) {
            this._addResultItems(features, resultLayer);
            this._addResultLayerToMap(resultLayer);
          }
          def.resolve(allCount);
        });

        var errorCallback = lang.hitch(this, function(err) {
          console.error(err);
          if (!this.domNode) {
            return;
          }
          this.shelter.hide();
          if (resultLayer) {
            this.map.removeLayer(resultLayer);
          }
          resultLayer = null;
          this._showQueryErrorMsg();
          def.reject(err);
        });

        this.shelter.show();

        if(currentAttrs.queryType !== 3){
          this._showResultsNumberDiv();
        }

        //execute Query for first time
        this.singleQueryLoader.executeQueryForFirstTime().then(callback, errorCallback);

        return def;
      },

      getResultLayer: function(){
        var currentAttrs = this.getCurrentAttrs();
        var resultLayer = lang.getObject("query.resultLayer", false, currentAttrs);
        return resultLayer;
      },

      showResultLayer: function(){
        var resultLayer = this.getResultLayer();
        if(resultLayer){
          resultLayer.show();
        }
      },

      hideResultLayer: function(){
        var resultLayer = this.getResultLayer();
        if(resultLayer){
          resultLayer.hide();
        }
      },

      getRelatedLayer: function(){
        var relatedLayer = null;
        if(this.relatedRecordsResult){
          relatedLayer = this.relatedRecordsResult.getLayer();
        }
        return relatedLayer;
      },

      showLayer: function(){
        this.showResultLayer();
        if(this.relatedRecordsResult){
          this.relatedRecordsResult.showLayer();
        }
      },

      hideLayer: function(){
        this.hideResultLayer();
        if(this.relatedRecordsResult){
          this.relatedRecordsResult.hideLayer();
        }
      },

      _addResultLayerToMap: function(resultLayer){
        if(this.map.graphicsLayerIds.indexOf(resultLayer.id) < 0){
          this.map.addLayer(resultLayer);
        }
      },

      _showResultsNumberDiv: function(){
        html.setStyle(this.resultsNumberDiv, 'display', 'block');
      },

      _hideResultsNumberDiv: function(){
        html.setStyle(this.resultsNumberDiv, 'display', 'none');
      },

      _updateNumSpan: function(allCount){
        this.numSpan.innerHTML = jimuUtils.localizeNumber(allCount);
      },

      _isTable: function(layerDefinition){
        return layerDefinition.type === "Table";
      },

      _onResultsScroll:function(){
        if(!jimuUtils.isScrollToBottom(this.resultsContainer)){
          return;
        }

        var currentAttrs = this.getCurrentAttrs();

        var nextIndex = currentAttrs.query.nextIndex;
        var allCount = currentAttrs.query.allCount;

        if(nextIndex >= allCount){
          return;
        }

        var resultLayer = currentAttrs.query.resultLayer;

        var callback = lang.hitch(this, function(features) {
          if (!this.domNode) {
            return;
          }
          this.shelter.hide();
          this._addResultItems(features, resultLayer);
        });

        var errorCallback = lang.hitch(this, function(err) {
          console.error(err);
          if (!this.domNode) {
            return;
          }
          this._showQueryErrorMsg();
          this.shelter.hide();
        });

        this.shelter.show();

        this.singleQueryLoader.executeQueryWhenScrollToBottom().then(callback, errorCallback);
      },

      _clearResultPage: function(){
        this._hideInfoWindow();
        this._unSelectResultTr();
        html.empty(this.resultsTbody);
        this._updateNumSpan(0);
      },

      _unSelectResultTr: function(){
        if(this.resultTr){
          html.removeClass(this.resultTr, 'jimu-state-active');
        }
        this.resultTr = null;
      },

      _selectResultTr: function(tr){
        this._unSelectResultTr();
        this.resultTr = tr;
        if(this.resultTr){
          html.addClass(this.resultTr, 'jimu-state-active');
        }
      },

      _addResultItems: function(features, resultLayer){
        //var featuresCount = features.length;
        var currentAttrs = this.getCurrentAttrs();
        var sym = null;
        var url = currentAttrs.config.url;
        var objectIdField = currentAttrs.config.objectIdField;

        if(currentAttrs.config.resultsSymbol){
          //if the layer is a table, resultsSymbol will be null
          sym = symbolJsonUtils.fromJson(currentAttrs.config.resultsSymbol);
        }

        var relationships = this._getCurrentRelationships();
        var popupInfo = currentAttrs.config.popupInfo;
        var popupInfoWithoutMediaInfos = lang.clone(popupInfo);
        popupInfoWithoutMediaInfos.mediaInfos = [];
        var popupTemplate2 = new PopupTemplate(popupInfoWithoutMediaInfos);
        // if(popupInfo.showAttachments){
        //   queryUtils.overridePopupTemplateMethodGetAttachments(popupTemplate2, url, objectIdField);
        // }

        var shouldCreateSymbolNode = true;

        var renderer = resultLayer.renderer;
        if(!renderer){
          shouldCreateSymbolNode = false;
        }

        array.forEach(features, lang.hitch(this, function(feature, i){
          var trClass = '';
          if(i % 2 === 0){
            trClass = 'even';
          }else{
            trClass = 'odd';
          }

          if(feature.geometry){
            if(sym){
              feature.setSymbol(sym);
            }
          }

          resultLayer.add(feature);

          var options = {
            resultLayer: resultLayer,
            feature: feature,
            trClass: trClass,
            popupTemplate2: popupTemplate2,
            relationships: relationships,
            objectIdField: objectIdField,
            url: url,
            relationshipPopupTemplates: currentAttrs.relationshipPopupTemplates,
            shouldCreateSymbolNode: shouldCreateSymbolNode
          };

          this._createQueryResultItem(options);
        }));

        this.zoomToLayer();
      },

      _createQueryResultItem:function(options){
        var resultLayer = options.resultLayer;
        var feature = options.feature;
        var trClass = options.trClass;
        var popupTemplate2 = options.popupTemplate2;
        var relationships = options.relationships;
        var objectIdField = options.objectIdField;
        var url = options.url;
        var relationshipPopupTemplates = options.relationshipPopupTemplates;
        var shouldCreateSymbolNode = options.shouldCreateSymbolNode;

        var attributes = feature && feature.attributes;
        if(!attributes){
          return;
        }

        var objectId = feature.attributes[objectIdField];

        //create PopupRenderer
        var strItem = '<tr class="jimu-table-row jimu-table-row-separator query-result-item" ' +
        ' cellpadding="0" cellspacing="0"><td>' +
          '<table class="query-result-item-table">' +
            '<tbody>' +
              '<tr>' +
                '<td class="symbol-td"></td><td class="popup-td"></td>' +
                '</tr>' +
            '</tbody>' +
          '</table>' +
        '</td></tr>';
        var trItem = html.toDom(strItem);
        html.addClass(trItem, trClass);
        html.place(trItem, this.resultsTbody);
        trItem.feature = feature;

        var symbolTd = query('.symbol-td', trItem)[0];
        if(shouldCreateSymbolNode){
          try{
            var renderer = resultLayer.renderer;
            if(renderer){
              var symbol = renderer.getSymbol(feature);
              if(symbol){
                var symbolNode = jimuSymbolUtils.createSymbolNode(symbol, {
                  width: 32,
                  height: 32
                });
                if(symbolNode){
                  html.place(symbolNode, symbolTd);
                }
              }
            }
          }catch(e){
            console.error(e);
          }
        }else{
          html.destroy(symbolTd);
        }

        var popupTd = query('.popup-td', trItem)[0];
        var popupRenderer = new PopupRenderer({
          template: popupTemplate2,
          graphic: feature,
          chartTheme: popupTemplate2.chartTheme
        });
        html.place(popupRenderer.domNode, popupTd);
        popupRenderer.startup();

        //create TitlePane for relationships
        if(relationships && relationships.length > 0){
          //var lastIndex = relationships.length - 1;
          array.forEach(relationships, lang.hitch(this, function(relationship){
            //{id,name,relatedTableId}
            //var layerName = this._getLayerNameByRelationshipId(relationship.id);
            var relationshipLayerInfo = this._getRelationshipLayerInfo(relationship.relatedTableId);
            var layerName = relationshipLayerInfo.name;
            var relationshipPopupTemplate = relationshipPopupTemplates[relationship.relatedTableId];

            var btn = html.create("div", {
              "class": "related-table-btn",
              "innerHTML": layerName//this.nls.attributesFromRelationship + ': ' + layerName
            }, popupTd);
            btn.queryStatus = "unload";
            btn.url = url;
            btn.layerName = layerName;
            btn.objectId = objectId;
            btn.relationship = relationship;
            btn.relationshipLayerInfo = relationshipLayerInfo;
            btn.relationshipPopupTemplate = relationshipPopupTemplate;
          }));
        }
      },

      _onBtnRelatedBackClicked: function(){
        this._showFeaturesResultDiv();
      },

      _showFeaturesResultDiv: function(){
        if(this.relatedRecordsResult){
          this.relatedRecordsResult.destroy();
        }
        this.relatedRecordsResult = null;
        html.removeClass(this.featuresResultDiv, 'not-visible');
        html.addClass(this.relatedRecordsResultDiv, 'not-visible');
        this.emit("hide-related-records");
      },

      _showRelatedRecordsDiv: function(){
        html.addClass(this.featuresResultDiv, 'not-visible');
        html.removeClass(this.relatedRecordsResultDiv, 'not-visible');
        this.emit("show-related-records");
      },

      _onRelatedTableButtonClicked: function(target){
        if(this.relatedRecordsResult){
          this.relatedRecordsResult.destroy();
        }
        this.relatedRecordsResult = null;
        var url = target.url;
        var layerName = target.layerName;
        var objectId = target.objectId;
        var relationship = target.relationship;
        var relationshipLayerInfo = target.relationshipLayerInfo;
        var relationshipPopupTemplate = target.relationshipPopupTemplate;
        this.relatedRecordsResult = new RelatedRecordsResult({
          map: this.map,
          layerDefinition: relationshipLayerInfo,
          nls: this.nls
        });
        this.relatedRecordsResult.placeAt(this.relatedRecordsResultDiv, 'first');
        // this.own(on(this.relatedRecordsResult, 'back', lang.hitch(this, function(){
        //   this._showFeaturesResultDiv();
        // })));
        this._showRelatedRecordsDiv();
        var callback = lang.hitch(this, function(){
          var featureSet = new FeatureSet();
          featureSet.fields = lang.clone(relationshipLayerInfo.fields);
          featureSet.features = target.relatedFeatures;
          featureSet.geometryType = relationshipLayerInfo.geometryType;
          featureSet.fieldAliases = {};
          array.forEach(featureSet.fields, lang.hitch(this, function(fieldInfo){
            var fieldName = fieldInfo.name;
            var fieldAlias = fieldInfo.alias || fieldName;
            featureSet.fieldAliases[fieldName] = fieldAlias;
          }));
          this.relatedRecordsResult.setResult(relationshipPopupTemplate, featureSet);

          this.relatedTitleDiv.innerHTML = layerName;
        });
        //execute executeRelationshipQuery when firstly click target
        if (target.queryStatus === "unload") {
          target.queryStatus = "loading";
          this.shelter.show();
          var queryTask = new QueryTask(url);
          var relationshipQuery = new RelationshipQuery();
          relationshipQuery.objectIds = [objectId];
          relationshipQuery.relationshipId = relationship.id;
          relationshipQuery.outFields = ['*'];
          relationshipQuery.returnGeometry = true;
          relationshipQuery.outSpatialReference = this.map.spatialReference;
          queryTask.executeRelationshipQuery(relationshipQuery).then(lang.hitch(this, function(response) {
            if(!this.domNode){
              return;
            }
            this.shelter.hide();
            //{objectId:{features,geometryType,spatialReference,transform}}
            var result = response && response[objectId];
            var features = result && result.features;
            features = features || [];
            target.relatedFeatures = features;
            target.queryStatus = "loaded";
            callback();
          }), lang.hitch(this, function(err) {
            if(!this.domNode){
              return;
            }
            this.shelter.hide();
            console.error(err);
            target.queryStatus = "unload";
            callback();
          }));
        }else if(target.queryStatus === "loaded"){
          callback();
        }
      },

      _getCurrentRelationships: function(){
        var currentAttrs = this.getCurrentAttrs();
        return currentAttrs.queryTr.layerInfo.relationships || [];
      },

      //{id,name,relatedTableId}
      //relationshipId is the id attribute
      _getRelationshipInfo: function(relationshipId){
        var relationships = this._getCurrentRelationships();
        for(var i = 0; i < relationships.length; i++){
          if(relationships[i].id === relationshipId){
            return relationships[i];
          }
        }
        return null;
      },

      _getRelationshipLayerInfo: function(relatedTableId){
        var currentAttrs = this.getCurrentAttrs();
        var layerInfo = currentAttrs.relationshipLayerInfos[relatedTableId];
        return layerInfo;
      },

      _tryLocaleNumber: function(value){
        var result = value;
        if(esriLang.isDefined(value) && isFinite(value)){
          try{
            //if pass "abc" into localizeNumber, it will return null
            var a = jimuUtils.localizeNumber(value);
            if(typeof a === "string"){
              result = a;
            }
          }catch(e){
            console.error(e);
          }
        }
        //make sure the retun value is string
        result += "";
        return result;
      },

      _showQueryErrorMsg: function(/* optional */ msg){
        new Message({message: msg || this.nls.queryError});
      },

      _onResultsTableClicked: function(event){
        var target = event.target || event.srcElement;
        if(!html.isDescendant(target, this.resultsTable)){
          return;
        }

        if(html.hasClass(target, 'related-table-btn')){
          this._onRelatedTableButtonClicked(target);
          return;
        }

        var tr = jimuUtils.getAncestorDom(target, lang.hitch(this, function(dom){
          return html.hasClass(dom, 'query-result-item');
        }), this.resultsTbody);
        if(!tr){
          return;
        }

        this._selectResultTr(tr);

        html.addClass(tr, 'jimu-state-active');
        var feature = tr.feature;
        var geometry = feature.geometry;
        if(geometry){
          //var infoContent = tr.infoTemplateContent;
          var geoType = geometry.type;
          var centerPoint, extent;
          var def = null;

          if(geoType === 'point' || geoType === 'multipoint'){
            var singlePointFlow = lang.hitch(this, function(){
              def = new Deferred();
              var maxLevel = this.map.getNumLevels();
              var currentLevel = this.map.getLevel();
              var level2 = Math.floor(maxLevel * 2 / 3);
              var zoomLevel = Math.max(currentLevel, level2);
              if(this.map.getMaxZoom() >= 0){
                //use tiled layer as base map
                this.map.setLevel(zoomLevel).then(lang.hitch(this, function(){
                  this.map.centerAt(centerPoint).then(lang.hitch(this, function(){
                    def.resolve();
                  }));
                }));
              }else{
                //use dynamic layer
                this.map.centerAt(centerPoint).then(lang.hitch(this, function() {
                  def.resolve();
                }));
              }
            });

            if(geoType === 'point'){
              centerPoint = geometry;
              singlePointFlow();
            }else if(geoType === 'multipoint'){
              if(geometry.points.length === 1){
                centerPoint = geometry.getPoint(0);
                singlePointFlow();
              }else if(geometry.points.length > 1){
                extent = geometry.getExtent();
                if(extent){
                  extent = extent.expand(1.4);
                  centerPoint = geometry.getPoint(0);
                  def = this.map.setExtent(extent);
                }
              }
            }
          }else if(geoType === 'polyline'){
            extent = geometry.getExtent();
            extent = extent.expand(1.4);
            centerPoint = extent.getCenter();
            def = this.map.setExtent(extent);
          }else if(geoType === 'polygon'){
            extent = geometry.getExtent();
            extent = extent.expand(1.4);
            centerPoint = extent.getCenter();
            def = this.map.setExtent(extent);
          }else if(geoType === 'extent'){
            extent = geometry;
            extent = extent.expand(1.4);
            centerPoint = extent.getCenter();
            def = this.map.setExtent(extent);
          }

          if(def){
            def.then(lang.hitch(this, function(){
              if(typeof this.map.infoWindow.setFeatures === 'function'){
                this.map.infoWindow.setFeatures([feature]);
              }
              if(typeof this.map.infoWindow.reposition === 'function'){
                this.map.infoWindow.reposition();
              }
              this.map.infoWindow.show(centerPoint);
            }));
          }
        }
      },

      _hideInfoWindow:function(){
        if(this.map && this.map.infoWindow){
          this.map.infoWindow.hide();
          if(typeof this.map.infoWindow.setFeatures === 'function'){
            this.map.infoWindow.setFeatures([]);
          }
        }
      },

      /* ----------------------------operations-------------------------------- */

      _getFeatureSet: function(){
        var layer = this.currentAttrs.query.resultLayer;
        var featureSet = new FeatureSet();
        featureSet.fields = lang.clone(layer.fields);
        featureSet.features = [].concat(layer.graphics);
        featureSet.geometryType = layer.geometryType;
        featureSet.fieldAliases = {};
        array.forEach(featureSet.fields, lang.hitch(this, function(fieldInfo){
          var fieldName = fieldInfo.name;
          var fieldAlias = fieldInfo.alias || fieldName;
          featureSet.fieldAliases[fieldName] = fieldAlias;
        }));
        return featureSet;
      },

      _onBtnMenuClicked: function(evt){
        var position = html.position(evt.target || evt.srcElement);
        var featureSet = this._getFeatureSet();
        var currentAttrs = this.getCurrentAttrs();
        var layer = currentAttrs.query.resultLayer;
        this.featureActionManager.getSupportedActions(featureSet, layer).then(lang.hitch(this, function(actions){
          array.forEach(actions, lang.hitch(this, function(action){
            action.data = featureSet;
          }));

          if(!currentAttrs.config.enableExport){
            var exportActionNames = ['ExportToCSV', 'ExportToFeatureCollection', 'ExportToGeoJSON'];
            actions = array.filter(actions, lang.hitch(this, function(action){
              return exportActionNames.indexOf(action.name) < 0;
            }));
          }

          actions = array.filter(actions, lang.hitch(this, function(action){
            return action.name !== 'CreateLayer';
          }));

          var removeAction = new BaseFeatureAction({
            name: "RemoveQueryResult",
            iconClass: 'icon-close',
            label: this.nls.removeThisResult,
            iconFormat: 'svg',
            map: this.map,
            onExecute: lang.hitch(this, this._removeResult)
          });
          removeAction.name = "RemoveQueryResult";
          removeAction.data = featureSet;
          actions.push(removeAction);

          this.popupMenu.setActions(actions);
          this.popupMenu.show(position);
        }));
      },

      _removeResult: function(){
        this.queryWidget.removeSingleQueryResult(this);
        this._hideInfoWindow();
      },

      _getAvailableWidget: function(widgetName){
        var appConfig = this.queryWidget.appConfig;
        var attributeTableWidget = appConfig.getConfigElementsByName(widgetName)[0];
        if (attributeTableWidget && attributeTableWidget.visible) {
          return attributeTableWidget;
        }
        return null;
      },

      _openAttributeTable: function(){
        var attributeTableWidget = this._getAvailableWidget("AttributeTable");

        if(!attributeTableWidget){
          return;
        }

        var layerInfosObj = LayerInfos.getInstanceSync();
        var layerId = this.currentAttrs.query.resultLayer.id;
        var layerInfo = layerInfosObj.getLayerInfoById(layerId);
        var widgetManager = this.queryWidget.widgetManager;
        widgetManager.triggerWidgetOpen(attributeTableWidget.id).then(lang.hitch(this, function() {
          this.queryWidget.publishData({
            'target': 'AttributeTable',
            'layer': layerInfo
          });
        }));
      }

    });
  });