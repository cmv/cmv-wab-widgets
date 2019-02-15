///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/_base/lang',
    'dojo/query',
    'dojo/on',
    'dojo/keys',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/utils',
    'jimu/BaseWidget',
    'jimu/filterUtils',
    'jimu/dijit/FilterParameters',
    'jimu/LayerInfos/LayerInfos',
    'jimu/FilterManager',
    // 'esri/tasks/query',
    // 'esri/tasks/QueryTask',
    'esri/symbols/jsonUtils',
    'jimu/symbolUtils',
    'jimu/dijit/LayerChooserFromMapWithDropbox',
    'jimu/dijit/Filter',
    './CustomFeaturelayerChooserFromMap',
    'jimu/dijit/ToggleButton',
    'dojo/NodeList',
    'dojo/NodeList-dom'
  ],
  function(declare, array, html, lang, query, on, keys, _WidgetsInTemplateMixin,
    jimuUtils, BaseWidget, FilterUtils, FilterParameters, LayerInfos, FilterManager,
    // Query, QueryTask,
    esriSymbolJsonUtils, jimuSymUtils, LayerChooserFromMapWithDropbox, Filter,
    CustomFeaturelayerChooserFromMap, ToggleButton) {

    return declare([BaseWidget, _WidgetsInTemplateMixin], {
      name: 'Filter',
      baseClass: 'jimu-widget-filter',
      //style="display:${hasValue}"

      _itemTemplate: '<li class="filter-item" data-index="${index}">' +
        '<div class="header" >' +
          '<span class="arrow jimu-float-leading jimu-trailing-margin05" title="${toggleTip}" ></span>' +
          '<span class="icon">' +
            '<img src="${icon}" />' +
          '</span>' +
          '<span class="icon symbolIcon" style="display:none;">' +
          '</span>' +
          '<span class="item-title">${title}</span>' +
          '<span class="toggle-filter jimu-trailing-margin1" tabindex="0"></span>' +
          //needs nls: toggleFilterTip: "Turn current filter on or off",
          // '<span class="toggle-filter jimu-trailing-margin1" tabindex="0" title="${toggleFilterTip}"></span>' +
        '</div>' +
        '<div class="body">' +
          '<div class="parameters"></div>' +
        '</div>' +
      '</li>',
      _store: null,

      postMixInProperties:function(){
        this.jimuNls = window.jimuNls;
      },

      postCreate: function(){
        this.inherited(arguments);
        this._store = {};
        this.layerInfosObj = LayerInfos.getInstanceSync();
        this.filterUtils = new FilterUtils();
        this.filterManager = FilterManager.getInstance();

        if(this.config.allowCustom){
          html.setStyle(this.showCustomButtonNode, 'display', 'block');
        }

        var existAskForValue = false;

        var filters = this.config.filters;

        //set filters's order by layer
        if(this.config.groupByLayer){
          var newFilters = {};
          array.forEach(filters, function(filterObj) {
            if(!newFilters[filterObj.layerId]){
              newFilters[filterObj.layerId] = [];
            }
            newFilters[filterObj.layerId].push(filterObj);
          }, this);

          for(var key in newFilters){
            // for(var key = 0; key < newFilters.length; key ++){
            var layer = this.layerInfosObj.getLayerInfoById(key);
            // var layerName = this.layerInfosObj._getLayerTitle(layer); //don't use private function
            var layerNameNode = document.createElement('div');
            html.addClass(layerNameNode, "filter-layer-name");
            layerNameNode.innerText = layer.title;
            html.place(layerNameNode, this.filterList);

            var isCheckLastNode = (key === newFilters.length - 1) ? true: false;
            existAskForValue = this._initFilters(newFilters[key], existAskForValue, isCheckLastNode);
          }
        }else{
          existAskForValue = this._initFilters(filters, existAskForValue, true);
        }

        if(!existAskForValue){
          html.addClass(this.domNode, 'not-exist-ask-for-value');
        }
      },

      startup: function() {
        this.inherited(arguments);
        this.resize();
      },

      _initFilters: function(filters, existAskForValue, isCheckLastNode){
        var filterIndex = 0;
        var filtersLength = filters.length;
        array.forEach(filters, function(filterObj, idx) {
          var isAskForValue = this.filterUtils.isAskForValues(filterObj.filter);

          if(isAskForValue){
            existAskForValue = true;
          }

          // filterObj.icon = (filterObj.symbol && filterObj.symbol.url) ? filterObj.symbol.url : filterObj.icon;
          var parse = {
            icon: filterObj.icon ? jimuUtils.processUrlInWidgetConfig(filterObj.icon, this.folderUrl) :
              this.folderUrl + '/css/images/default_task_icon.png',
            index: idx,
            title: filterObj.name,
            toggleTip: this.nls.toggleTip,
            hasValue: isAskForValue ?
              (window.appInfo.isRunInMobile ? 'block !important' : '') : 'none',
            isAskForValue: isAskForValue,
            apply: lang.getObject('jimuNls.common.apply', false, window) || 'Apply'
          };

          if (!this._store[filterObj.layerId]) {
            this._store[filterObj.layerId] = {
              mapFilterControls: {}
              // filter_item_idx
            }; // filter_item_idx, mapFilterControls
          }

          var template = lang.replace(this._itemTemplate, parse, /\$\{([^\}]+)\}/ig);
          var node = html.toDom(template);
          html.place(node, this.filterList);

          if(filterObj.symbol){ //svg
            var icons = query('.icon', node);
            html.setStyle(icons[0], 'display', 'none');
            html.setStyle(icons[1], 'display', 'inline-block');

            var jsonSymbol = esriSymbolJsonUtils.fromJson(filterObj.symbol);
            var size = 16;
            var isImgSym = filterObj.symbol.url || filterObj.symbol.imageData;
            if(isImgSym){//from image chooser
              jsonSymbol.setWidth(size);
              jsonSymbol.setHeight(size);
            }else{
              jsonSymbol.setSize(size);//.setOffset(0, 10);//not work
            }

            var symbolNode;
            if(isImgSym){
              symbolNode = jimuSymUtils.createSymbolNode(jsonSymbol);
            }else{
              symbolNode = jimuSymUtils.createSymbolNode(jsonSymbol, {width:size + 1, height: size + 1});
            }
            html.place(symbolNode, icons[1]);
          }

          var toggleFilterNode = query('.toggle-filter', node)[0];
          var toggleButton = new ToggleButton({}, toggleFilterNode);
          toggleButton.startup();
          node.toggleButton = toggleButton;

          var headers = query('.header', node);
          this.own(headers.on('click', lang.hitch(this, 'toggleFilter', node, filterObj, parse)));
          this.own(headers.on('keydown', lang.hitch(this, function(evt){
            var target = event.target || event.srcElement;
            if(!html.hasClass(target, 'arrow') && !html.hasClass(target, 'error') && (evt.keyCode === keys.ENTER)){
              this.toggleFilter(node, filterObj, parse);
            }
          })));

          var arrows = query('.arrow', node);
          if(isAskForValue){
            html.addClass(node, 'has-ask-for-value');
            html.setAttr(arrows[0], 'tabindex',0);
            if(idx === 0){
              jimuUtils.initFirstFocusNode(this.domNode, arrows[0]);
            }
          }else{
            html.addClass(node, 'not-has-ask-for-value');
            if(idx === 0){
              jimuUtils.initFirstFocusNode(this.domNode, toggleFilterNode);
            }
          }
          if(isCheckLastNode && filterIndex === filtersLength - 1){
            html.setAttr(node, 'data-isLastNode', 'yes');
          }
          if (parse.hasValue !== 'none') {
            // add parameters
            this.own(arrows.on('click', lang.hitch(this, 'configFilter', node, filterObj)));
            this.own(arrows.on('keydown', lang.hitch(this, function(evt){
              if(evt.keyCode === keys.ENTER){
                this.configFilter(node, filterObj);
              }
            })));

            html.addClass(node, 'requesting');
            this.configFilter(node, filterObj, null, lang.hitch(this, function(buildDef, isError){
              if(isError){
                this._setFilterNodeError(node, filterObj.layerId);
                return;
              }
              if(filterObj.collapse){
                html.removeClass(node, 'config-parameters');
              }

              if(filterObj.autoApplyWhenWidgetOpen){
                this.toggleFilter(node, filterObj, parse);
              }

              if(html.getAttr(node, 'data-isLastNode') === 'yes'){
                buildDef.then(lang.hitch(this, function(valueproviders) {
                  var lastNode = valueproviders[valueproviders.length - 1].domNode;
                  jimuUtils.initLastFocusNode(this.domNode, lastNode);
                }));
              }
            }));
          }else{
            if(filterObj.autoApplyWhenWidgetOpen){
              this.toggleFilter(node, filterObj, parse);
            }
            if(html.getAttr(node, 'data-isLastNode') === 'yes'){
              jimuUtils.initLastFocusNode(this.domNode, toggleFilterNode);
            }
          }

          filterIndex ++;
        }, this);
        return existAskForValue;
      },

      _setFilterNodeError: function(node, layerId){
        //remove arrow-icon, disable toggle-btn, add warnning-icon
        var errorTitle = this.jimuNls.map.layerLoadedError.replace('${layers}', layerId);
        html.setAttr(node, 'aria-disabled', 'true');
        html.removeClass(node, 'config-parameters');
        html.removeClass(node, 'has-ask-for-value');
        html.addClass(node, 'not-has-ask-for-value');

        //change arrow to error
        var arrow = query('.arrow', node)[0];
        html.removeClass(arrow, 'arrow');
        html.addClass(arrow, 'error');
        html.setAttr(arrow, 'title', errorTitle);
        html.setStyle(arrow, 'display', 'block');
      },

      _getPriorityOfMapFilter: function(layerId) {
        var mapFilterControls = lang.getObject(layerId + '.mapFilterControls', false, this._store);
        var count = 0;
        for (var p in mapFilterControls) {
          var control = mapFilterControls[p];
          if (control.priority > count) {
            count = control.priority;
          }
        }

        return count;
      },

      _getMapFilterControl: function(layerId) {
        var mapFilterControls = lang.getObject(layerId + '.mapFilterControls', false, this._store);
        var count = 0;
        var enable = true;
        for (var p in mapFilterControls) {
          var control = mapFilterControls[p];
          if (control.priority > count) {
            enable = !!control.enable;
          }
        }

        return enable;
      },

      _setItemFilter: function(layerId, idx, expr, enableMapFilter) {
        if(!this._store[layerId]){
          return true;
        }
        this._store[layerId]['filter_item_' + idx] = expr;

        var priority = this._getPriorityOfMapFilter(layerId);
        lang.setObject(layerId + '.mapFilterControls.filter_item_' + idx , {
          enable: enableMapFilter,
          priority: priority + 1
        }, this._store);
      },

      _removeItemFilter: function(layerId, idx) {
        if(!this._store[layerId]){
          return true;
        }
        delete this._store[layerId]['filter_item_' + idx];
        delete this._store[layerId].mapFilterControls['filter_item_' + idx];
      },

      //combine all the filter task
      _getExpr: function(layerId) {
        if (!this._store[layerId]) {
          return null;
        }

        var parts = [];
        var exprs = this._store[layerId];

        for (var p in exprs) {
          var expr = exprs[p];
          if (expr && p !== 'mapFilterControls') {
            parts.push('(' + expr + ')');
          }
        }

        // return parts.join(' AND ');
        return parts.join(' ' + this.config.taskOper + ' '); //by filters's operator
      },

      toggleFilter: function(node, filterObj, parse) {
        if(html.getAttr(node, 'aria-disabled') === 'true'){
          html.removeClass(node, 'applied');
          node.toggleButton.uncheck();
          return;
        }
        if (html.hasClass(node, 'config-parameters') &&
          !(node.filterParams && node.filterParams.getFilterExpr())) {
          return;
        }
        if (parse.isAskForValue && !(node.filterParams && node.filterParams.getFilterExpr())) {
          this.configFilter(node, filterObj);
          return;
        }
        // if(node.toggleButton.isDoing){
        //   return;
        // }

        var isError = false;
        var layerId = filterObj.layerId;
        var idx = html.getAttr(node, 'data-index');

        var applied = html.hasClass(node, 'applied');
        if (applied) {
          html.removeClass(node, 'applied');
          node.toggleButton.uncheck();
        } else {
          html.addClass(node, 'applied');
          node.toggleButton.check();
        }

        if (!applied) {
          var expr = this._getFilterExpr(node, filterObj);
          isError = this._setItemFilter(layerId, idx, expr, filterObj.enableMapFilter);
        } else {
          isError = this._removeItemFilter(layerId, idx);
        }
        if(isError){
          this._setFilterNodeError(node, layerId);
          html.removeClass(node, 'applied');
          node.toggleButton.uncheck();
          return;
        }
        var layerFilterExpr = this._getExpr(layerId);
        var enableMapFilter = this._getMapFilterControl(layerId);
        this.filterManager.applyWidgetFilter(layerId, this.id, layerFilterExpr, enableMapFilter, null, this.config.zoomto);

        this._afterFilterApplied(filterObj.layerId);
      },

      configFilter: function(node, filterObj, evt, cb) {
        if(!html.hasClass(node, 'has-ask-for-value')){//prevent error data
          return;
        }
        if (!node.filterParams) {
          var layerInfo = this.layerInfosObj.getLayerInfoById(filterObj.layerId);
          if(layerInfo){
            layerInfo.getLayerObject().then(lang.hitch(this, function(layerObject){
              html.addClass(node, 'config-parameters');
              html.removeClass(node, 'requesting');
              var pamDiv = query('.parameters', node)[0];
              node.handles = [];
              node.filterParams = new FilterParameters();
              var partsObj = lang.clone(filterObj.filter);

              var layerId = null;
              if(filterObj.enableMapFilter){
                //if enableMapFilter is true, pass layerId to filterParams,
                //so filterParams can get the layer expr defined in webmap
                layerId = filterObj.layerId;
              }

              var buildDef = node.filterParams.build(filterObj.url, layerObject, partsObj, layerId);

              this.own(on(node.filterParams, 'change', lang.hitch(this, function(expr) {
                if (expr) {
                  node.expr = expr;
                } else {
                  delete node.expr;
                }

                if(node.toggleButton.checked){
                  this.applyFilterValues(node, filterObj);
                }

              })));

              node.expr = node.filterParams.getFilterExpr();
              node.filterParams.placeAt(pamDiv);
              this._changeItemTitleWidth(node, 60);
              if(cb){
                cb(buildDef);
              }
            }));
          }else if(cb){//handle the error layer data
            cb(null, true);
          }
        } else {
          //to do... to confirm how to enter this condition.
          if (!html.hasClass(node, 'config-parameters')) {
            html.addClass(node, 'config-parameters');
            this._changeItemTitleWidth(node, 60);
          } else {
            html.removeClass(node, 'config-parameters');
            this._changeItemTitleWidth(node, window.appInfo.isRunInMobile ? 60 : 45);
          }
          if(cb){
            cb();
          }
        }

        if (evt && evt.target) {
          evt.stopPropagation();
        }
      },

      applyFilterValues: function(node, filterObj, evt) {
        var expr = this._getFilterExpr(node, filterObj);
        if (expr) {
          node.expr = expr;
          // getFilterExpr
          var layerId = filterObj.layerId;
          var idx = html.getAttr(node, 'data-index');
          html.addClass(node, 'applied');
          this._setItemFilter(layerId, idx, node.expr, filterObj.enableMapFilter);
          var layerFilterExpr = this._getExpr(layerId);
          var enableMapFilter = this._getMapFilterControl(layerId);
          this.filterManager.applyWidgetFilter(layerId, this.id, layerFilterExpr, enableMapFilter, null, this.config.zoomto);

          this._afterFilterApplied(filterObj.layerId);
        }

        if(evt){
          evt.stopPropagation();
        }
      },

      _getFilterExpr: function(node, filterObj){
        if(node.filterParams){
          return node.filterParams.getFilterExpr();
        }

        if(this.filterUtils.hasVirtualDate(filterObj.filter)){
          this.filterUtils.isHosted = jimuUtils.isHostedService(filterObj.url);
          return this.filterUtils.getExprByFilterObj(filterObj.filter);
        }else{
          return filterObj.filter.expr;
        }

      },

      _afterFilterApplied: function(layerId){
        if(!this.config.zoomto){
          return;
        }
        var layerInfo = this.layerInfosObj.getLayerInfoById(layerId);
        if(!layerInfo){
          return;
        }
        layerInfo.zoomTo();
      },

      _isValidExtent: function(extent){
        return !(isNaN(extent.xmax) || isNaN(extent.xmax) ||
          isNaN(extent.xmax) || isNaN(extent.xmax));
      },

      resize: function() {
        this.inherited(arguments);
        // this._changeItemTitleWidth(this.domNode, window.appInfo.isRunInMobile ? 60 : 45);
        this._changeItemTitleWidth(this.domNode, window.appInfo.isRunInMobile ? 60 : 70);
        if(this.customFilter){
          this.customFilter.resize();
        }
      },

      _changeItemTitleWidth: function(node, tolerace) {
        tolerace += 30;
        var itemHeader = query('.header', node)[0];
        if (itemHeader) {
          var contentBox = html.getContentBox(itemHeader);
          var maxWidth = contentBox.w - tolerace;// width of header minus others width
          if (maxWidth > 0) {
            query('.header .item-title', node).style({
              'maxWidth': maxWidth + 'px'
            });
          }
        }
      },

      _onShowCustomClick: function(){
        html.setStyle(this.customFilterContainerNode, 'display', 'block');
        html.setStyle(this.filterListContainerNode, 'display', 'none');

        if(!this.layerChooserSelect){
          var layerChooser = new CustomFeaturelayerChooserFromMap({
            showLayerFromFeatureSet: false,
            showTable: false,
            onlyShowVisible: false,
            createMapResponse: this.map.webMapResponse
          });
          this.layerChooserSelect = new LayerChooserFromMapWithDropbox({
            layerChooser: layerChooser
          });
          this.layerChooserSelect.placeAt(this.layerSelectNode);

          this.own(on(this.layerChooserSelect, 'selection-change', lang.hitch(this, this._onLayerChanged)));

          this.layerChooserSelect.showLayerChooser();
        }
      },

      _onLayerChanged: function(){
        var item = this.layerChooserSelect.getSelectedItem();
        if(!item){
          return;
        }
        //nameTextBox
        var layerInfo = item.layerInfo;
        var layer = layerInfo.layerObject;
        //filter
        // var layerDefinition = this._getLayerDefinitionForFilterDijit(layer);

        if(!this.customFilter){
          this.customFilter = new Filter({
            enableAskForValues: false,
            featureLayerId: layer.id,
            runtime: true
          });
          this.customFilter.placeAt(this.customFilterNode);
          this.own(on(this.customFilter, 'change', lang.hitch(this, this._onCustomFilterChange)));
        }

        this.customFilter.build({
          url: layer.url,
          featureLayerId: layer.id, // featureLayerId is necessary
          // layerDefinition: layerDefinition
          layerDefinition: layer
        });

        this.selectedLayer = layer;
      },

      _getLayerDefinitionForFilterDijit: function(layer){
        var layerDefinition = null;

        if(layer.declaredClass === 'esri.layers.FeatureLayer'){
          layerDefinition = jimuUtils.getFeatureLayerDefinition(layer);
        }

        if (!layerDefinition) {
          layerDefinition = {
            currentVersion: layer.currentVersion,
            fields: lang.clone(layer.fields)
          };
        }

        return layerDefinition;
      },

      _onBackToListClick: function(){
        html.setStyle(this.customFilterContainerNode, 'display', 'none');
        html.setStyle(this.filterListContainerNode, 'display', 'block');
      },

      _onCustomFilterToggle: function(isChecked){
        if(!this.customFilter){
          return;
        }
        if(!isChecked){
          this.filterManager.applyWidgetFilter(this.selectedLayer.id, this.id + '-custom-filter', '1=1', true, null, this.config.zoomto);
          this._afterFilterApplied(this.selectedLayer.id);
        }else{
          this._applyCustomFilter();
        }
      },

      _onCustomFilterChange: function(){
        this._applyCustomFilter();
      },

      _applyCustomFilter: function(){
        var filterJson = this.customFilter.toJson();
        if(!filterJson || !this.customFilterToggleButton.checked || filterJson.parts.length === 0){
          return;
        }
        this.filterManager.applyWidgetFilter(this.selectedLayer.id, this.id + '-custom-filter', filterJson.expr, true, null, this.config.zoomto);
        this._afterFilterApplied(this.selectedLayer.id);
      },

      destroy: function(){
        query('.filter-item', this.filterList).forEach(function(node) {
          delete node.filterParams;
          delete node.expr;
        });
        if (this._store) {
          for (var p in this._store) {
            if (p) {
              this.filterManager.applyWidgetFilter(p, this.id, "", null, null, this.config.zoomto);
            }
          }
        }
        this.inherited(arguments);
      }
    });
  });