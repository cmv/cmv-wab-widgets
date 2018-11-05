define([
  'dojo/_base/declare',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/query',
  'dojo/on',
  'dojo/Deferred',
  './utils',
  "./MultSelector/MultSelector",
  'jimu/BaseWidget',
  'jimu/LayerInfos/LayerInfos',
  'dijit/_WidgetsInTemplateMixin',
  'esri/dijit/LayerSwipe',
  'dijit/form/Select'
],
  function (declare, array, lang, html, query, on, Deferred, utils, MultSelector,
    BaseWidget, LayerInfos, _WidgetsInTemplateMixin, LayerSwipe, Select) {
    return declare([BaseWidget, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-swipe',

      swipeDijit: null,
      layerInfosObj: null,

      _loadDef: null,
      _obtainedLabelLayers: [],//label layer independent with main-label-layer
      _LAST_SELECTED: null,//the status for re-open

      getSwipeModeByConfig: function () {
        this._SWIPE_MODE = "";
        if (this.config.layerMode && this.config.layerMode === "mult") {
          this._SWIPE_MODE = "mult";

          html.addClass(this.singleLayersContainer, "hide");
          html.removeClass(this.multLayersContainer, "hide");
        } else {
          this._SWIPE_MODE = "single";

          html.removeClass(this.singleLayersContainer, "hide");
          html.addClass(this.multLayersContainer, "hide");
        }

        return this._SWIPE_MODE;
      },
      createSelector: function () {
        if (this._SWIPE_MODE === "mult") {
          //"mult"
          this.multLayersSelector = new MultSelector({
            nls: this.nls
          }, this.multSelectorContainer);
          this.multLayersSelector.startup();
          this.own(on(this.multLayersSelector, 'change', lang.hitch(this, this.onSwipeLayersChange)));
        } else {
          //"single"
          this.singleSelector = new Select({
            style: "width:100%"
          }, this.singleSelectorContainer);

          this.own(on(this.singleSelector, 'Change', lang.hitch(this, this.onSwipeLayersChange)));

          this.own(on(this.singleSelector, 'Click', lang.hitch(this, this.onSwipeLayersClick)));
          this.own(on(
            this.singleSelector.dropDown.domNode,
            'mouseenter',
            lang.hitch(this, this.onDropMouseEnter)
          ));
          this.own(on(
            this.singleSelector.dropDown.domNode,
            'mouseleave',
            lang.hitch(this, this.onDropMouseLeave)
          ));

          this.own(on(this.swipeLayersMenu, 'mouseleave', lang.hitch(this, this.onMenuMouseLeave)));
        }
      },
      setDefaultOptions: function (layerInfos, isKeepSelection) {
        var data = [];
        if (!this.config.layerState) {
          //1 for old config:
          data = array.map(layerInfos, lang.hitch(this, function (info) {
            var mapInfo = {
              label: info.title,
              value: info.id
            };
            return mapInfo;//use all layers in layerInfo
          }));
        } else {
          //2 for new config:
          //2.1 layers in config or map
          if (utils.isTherePreconfiguredLayer(this.config/*, this._currentLayerId*/)) {
            var layerOptions = this.config.layerState;
            for (var key in layerOptions) {
              if (layerOptions.hasOwnProperty(key)) {
                var layer = layerOptions[key];
                if (true === layer.selected) {//selected in config
                  var layerInfo = this.layerInfosObj.getLayerInfoById(key);
                  if (layerInfo) {
                    if (layerInfo.isShowInMap()) {
                      var title = layerInfo.title;
                      data.push({ value: key, label: title });//add option
                    } else {
                      //invisible ignore
                    }
                  } else {
                    //be removed, ignore
                  }
                }
              }
            }
          }
          //2.2 new added layers(such as GP)
          for (var i = 0, len = layerInfos.length; i < len; i++) {
            var info = layerInfos[i];

            if (utils._isNewAddedLayer(info, this.layerInfosObj) && info.isShowInMap()) {
              var layerTitle = info.title;
              data.push({ value: info.id, label: layerTitle });//add option
            }
          }
        }

        //set selected
        var lastSelectorValue;
        for (var ii = 0, leni = data.length; ii < leni; ii++) {
          var d = data[ii];

          if (this._LAST_SELECTED && this._LAST_SELECTED.mode === this.config.layerMode) {
            //use recorde
            for (var j = 0, lenJ = this._LAST_SELECTED.selected.length; j < lenJ; j++) {
              var old = this._LAST_SELECTED.selected[j];

              if (d.value === old) {
                d.selected = true;
                lastSelectorValue = d.value;
              }
            }
          } else {
            //all new
            if (this._isDefaultSelectedOption(d)) {
              d.selected = true;
              lastSelectorValue = d.value;
            }
          }
        }


        if (isKeepSelection) {
          //keep single selector value
          if (this._SWIPE_MODE !== "mult") {
            lastSelectorValue = this.singleSelector.get('value');
          }
        }

        //set options
        if (this._SWIPE_MODE === "mult") {
          this.multLayersSelector.initOptions(data, isKeepSelection);
        } else {
          this.singleSelector.set('options', data);
        }

        this.disableSelectors();//for esc events

        var selections = this.getSelection();
        //set selector vale, for no selected
        if (this._SWIPE_MODE === "mult") {
          if (selections && selections.length && selections.length === 0) {
            var multOptions = this.multLayersSelector.getOptions();
            if (/*!utils.isTherePreconfiguredLayer(this.config) &&*/
              multOptions && "undefined" !== multOptions.length &&
              multOptions.length > 0 && multOptions[0].value) {
              //auto select the 1st new added layer, when no preconfig layer
              this.multLayersSelector.setValue(multOptions[0].value);
            }
          }

        } else {
          if (lastSelectorValue) {
            this.singleSelector.set('value', lastSelectorValue);
          }/* else if (!utils.isTherePreconfiguredLayer(this.config) &&
            this.singleSelector.options && "undefined" !== this.singleSelector.options.length &&
            this.singleSelector.options.length > 0 && this.singleSelector.options[0].value) {
            //auto select the 1st new added layer, when no preconfig layer
            this.singleSelector.set('value', this.singleSelector.options[0].value);
          } */
          else if ((selections && selections.length && selections.length === 1) &&
            this.singleSelector.options && "undefined" !== this.singleSelector.options.length &&
            this.singleSelector.options.length > 0 && this.singleSelector.options[0].value) {
            this.singleSelector.set('value', this.singleSelector.options[0].value);
          } else {
            this.singleSelector.set('value', null);
          }
          // if (this.singleSelector.options && "undefined" !== this.singleSelector.options.length &&
          //   this.singleSelector.options.length == 0) {
          //   //single
          //   this.singleSelector.set('options', [{ value: "", label: "" }]);//set a empty list to select
          //   this.singleSelector.reset();
          // }
        }

        //init cache
        this._LAST_SELECTED = {
          mode: this._SWIPE_MODE,
          selected: this.getSelection()
        };

        this.enableSelectors();//for esc events

        this.toggleSelectorPopup();
      },

      _isSwipeBaseMap: function () {
        var selection = this.getSelection();
        if (selection && selection.length) {
          for (var i = 0, len = selection.length; i < len; i++) {
            var selectedLayer = selection[i];
            var lastLayerInfo = this.layerInfosObj.getLayerInfoById(selectedLayer);
            if (lastLayerInfo && lastLayerInfo.isShowInMap()) {
              return false;//selected layer is showing
            }
          }

          return true;
        } else {
          return true;//no selected
        }

        // if (false === utils.isTherePreconfiguredLayer(this.config) && !layerId) {
        //   return true;
        // }

        // if (this._SWIPE_MODE === "mult") {
        //   var defaultLayers = this.config.defaultLayers;
        //   var options = this.multLayersSelector.getOptions();
        //   for (var i = 0, len = options.length; i < len; i++) {
        //     var option = options[i];

        //     for (var j = 0, lenJ = defaultLayers.length; j < lenJ; j++) {
        //       var layer = defaultLayers[j];

        //       if (layer === option.value) {
        //         return false;
        //       }
        //     }
        //     return false;
        //   }

        //   return true;
        // } else {
        //   //single
        //   var optionsi = this.singleSelector.getOptions();
        //   for (var ii = 0, leni = optionsi.length; ii < leni; ii++) {
        //     var optioni = optionsi[ii];
        //     if (this.config.layer === optioni.value) {
        //       return false;
        //     }
        //   }

        //   return true;
        // }
      },

      _isDefaultSelectedOption: function (item) {
        var targetarray = [];

        if (this._SWIPE_MODE === "mult") {
          targetarray = this.config.defaultLayers;
        } else {
          targetarray.push(this.config.layer);
        }

        for (var i = 0, len = targetarray.length; i < len; i++) {
          var one = targetarray[i];
          if (one === item.value) {
            return true;
          }
        }
        return false;
      },

      toggleSelectorPopup: function () {
        //show / hide selector by layer number
        utils.showSelectorPopup(this.domNode);

        var options = this.getOptions();
        if (!options) {
          return;
        }

        if (this._SWIPE_MODE === "mult") {
          if (options.length === 0) { //hide popup when no options
            utils.hideSelectorPopup(this.domNode);
          }
        } else {
          if (options.length === 0 || options.length === 1) { //hide popup when no options & 1 optioon
            utils.hideSelectorPopup(this.domNode);
          }
        }
      },

      disableSelectors: function () {
        if (this._SWIPE_MODE === "mult") {
          this.multLayersSelector.disable();
        } else {
          this.singleSelector.set('disabled', true);//set disabled=true to escape events
        }
      },
      enableSelectors: function () {
        if (this._SWIPE_MODE === "mult") {
          this.multLayersSelector.enable();
        } else {
          this.singleSelector.set('disabled', false);
        }
      },
      getSelection: function () {
        var selection = [];
        if (this._SWIPE_MODE === "mult") {
          selection = this.multLayersSelector.getConfig();
        } else {
          selection.push(this.singleSelector.get("value"));
        }

        return selection;
      },
      isSelected: function (layer, options) {
        if (!options) {
          options = this.getSelection();
        }

        for (var i = 0, len = options.length; i < len; i++) {
          var selected = options[i];

          if (layer === selected) {
            return true;
          }
        }

        return false;
      },
      getOptions: function () {
        var options = [];
        if (this._SWIPE_MODE === "mult") {
          options = this.multLayersSelector.getOptions();
        } else {
          options = this.singleSelector.getOptions();
        }

        return options;
      },
      setSelection: function () {

      },
      onSelectorChange: function () {

      },
      _removeSingleSelectorOption: function (layer) {
        this.singleSelector.removeOption(layer);

        var options = this.singleSelector.getOptions();
        if (options.length === 0) {
          this.singleSelector.set("options", [{ value: "", label: "" }]);
          this.singleSelector.reset();
        }
      },
      ////////////////////////////////////////////////////////



      postCreate: function () {
        this.inherited(arguments);

        if (!this.config.style) {
          this.config.style = 'vertical';
        }
        if (!this.config.defaultLayers) {
          this.config.defaultLayers = [];
        }

        utils.cleanHandlerPosition();

        this.getSwipeModeByConfig();
        this.createSelector();

        this.own(on(this.map, 'layer-add', lang.hitch(this, this._onMainMapBasemapChange)));
      },

      _enableSwipe: function () {
        if (this._obtainedLabelLayers &&
          this._obtainedLabelLayers.length && this._obtainedLabelLayers.length > 0) {
          this._obtainedLabelLayers = [];
          //TODO
          // //single
          // var layerId = this.singleSelector.get('value');
          // var isBasemap = !(!!layerId);
          // //mult
          // var layerParams = this._getLayerParams(layerId, isBasemap);
          // this.swipeDijit.set('layers', layerParams);
        }

        this.swipeDijit.enable();
      },
      _disableSwipe: function () {
        if (this.swipeDijit && this.swipeDijit.disable) {
          this.swipeDijit.disable();

          array.forEach(this._obtainedLabelLayers, lang.hitch(this, function (labelLayer) {
            labelLayer.restoreLabelControl();
          }));
        }
      },

      onOpen: function () {
        if (true === this._isTestSizeFlag) {
          return;//skip first on-open(1st open called from jimu)
        }

        //re-create
        this._loadLayerInfos().then(lang.hitch(this, function () {
          var layerInfos = utils.getVisibleLayerInfos(this.layerInfosObj);

          this.setDefaultOptions(layerInfos);

          this.createSwipeDijit(/*selected*/);
        }));
      },

      onClose: function () {
        if (true === this._isTestSizeFlag) {
          return;//skip first on-open(1st open from jimu)
        }

        this._LAST_SELECTED = {
          mode: this._SWIPE_MODE,
          selected: this.getSelection()
        };

        if (this._loadDef.isResolved()) {
          this._disableSwipe();
        } else if (!this._loadDef.isFulfilled()) {
          this._loadDef.cancel();
        }
      },



      createSwipeDijit: function () {
        this.destroySwipeDijit();

        var layerParams = [];

        var selectedLayers = this.getSelection();
        if (0 === selectedLayers.length) {
          layerParams = this._getLayerParams(null);//no selection
        } else {
          if (this._SWIPE_MODE === "mult") {
            for (var i = 0, len = selectedLayers.length; i < len; i++) {
              var layer = selectedLayers[i];
              layerParams = layerParams.concat(this._getLayerParams(layer));
            }
          } else {
            var selectedLayer = selectedLayers[0];
            layerParams = this._getLayerParams(selectedLayer);
          }
        }

        var options = {
          type: this.config.style || 'vertical',
          map: this.map,
          layers: layerParams
        };

        if (utils.isCacheHandlerPosition()) {
          utils.setHandlerPosition(options, this.config, this.map);
        } else {
          var middlePosition = utils.getScreenMiddle(this.map);
          options.top = middlePosition.top;
          options.left = middlePosition.left;
          //hack for spyglass mode: can't center it when set top/left
          if (this.config.style === "scope") {
            options.top -= 130;
            options.left -= 130;
          }
        }

        this.swipeDijit = new LayerSwipe(options, this.layerSwipe);
        this.swipeDijit.startup();

        this._setHandleColor();

        this._enableSwipe();

        html.place(this.swipeDijit.domNode, this.map.root, 'before');

        this._autoHideInfoWindow(layerParams);

        this.swipeDijit.on('swipe', lang.hitch(this, function (evt) {
          var swipeLayers = array.map(evt.layers, function (l) {
            return l.layer;
          });
          //console.log("left==>" +this.swipeDijit.left+"__clip==>"+this.swipeDijit.clip)
          //console.log("left==>" + evt.layers[0].left + "__right==>" + evt.layers[0].right)
          //this._CLIP_RIGHT = evt.layers[0].right;
          //API #629
          if (evt && evt.layers[0]) {
            var layer = utils.getLayerNode(evt.layers[0].layer);
            if (layer && layer.style && this.map.navigationMode === "css-transforms") {
              evt.layers[0].right = evt.layers[0].right - evt.layers[0].left;
              evt.layers[0].left = 0;
              evt.layers[0].bottom = evt.layers[0].bottom - evt.layers[0].top;
              evt.layers[0].top = 0;
            }
          }
          utils.saveHandlerPosition(evt.layers[0]);
          // var inSwipeLayers = utils.shouldHideInfoWindow(swipeLayers, this);
          // if (inSwipeLayers) {
          //   this.map.infoWindow.hide();
          // }
          this._autoHideInfoWindow(swipeLayers);
        }));

        utils.hackToRefreshSwipe(this);//force refresh ui
      },

      _getLayerParams: function (layerId) {
        var layerParams = [];

        var isBasemap = this._isSwipeBaseMap();
        if (isBasemap) {
          //1.can't swipe any layer, so swipe basemaps
          var basemaps = this.layerInfosObj.getBasemapLayers();
          array.forEach(basemaps, lang.hitch(this, function (basemap) {
            layerParams.push(this.map.getLayer(basemap.id));
          }));
        } else {
          //2. not basemap
          var info = this.layerInfosObj.getLayerInfoById(layerId);
          if (info && info.traversal) {
            //2.1 swipe layer that in layerInfos
            info.traversal(lang.hitch(this, function (_info) {
              var layer = this.map.getLayer(_info.id);
              if (layer) {
                layerParams.push(layer);
                this._obtainLabelControl(_info, layerParams);
              }
            }));
          } else {
            //2.2 for change map: should be empty, so should swipe basemaps
            var basemaps2 = this.layerInfosObj.getBasemapLayers();
            array.forEach(basemaps2, lang.hitch(this, function (basemap) {
              layerParams.push(this.map.getLayer(basemap.id));
            }));
          }
        }
        return layerParams;
      },

      destroySwipeDijit: function () {
        if (this.swipeDijit && this.swipeDijit.destroy) {
          try {
            this.swipeDijit.destroy();
          } catch (e) {
            console.log(e);
          }

          this.swipeDijit = null;

          this._restoreAllLabelControl();

          this.layerSwipe = html.create('div', {}, this.swipeLayersMenu, 'after');
        }
      },


      ///////////////////////////////////////////////////////
      onSwipeLayersChange: function () {
        if (!this.swipeDijit) {
          return;
        }

        if (this._SWIPE_MODE === "mult") {
          this.createSwipeDijit();
        } else {
          this.createSwipeDijit(/*layerId, isBasemap*/);

          utils.zoomToCurrentLayer(this);
        }

        this.toggleSelectorPopup();

        this.initSwipeLayersUi();
      },

      //layer visible / invisible
      onLayerInfosIsShowInMapChanged: function (/*evt*/) {
        if (!this.swipeDijit || !this.swipeDijit.enabled) {
          return;
        }

        var selectedOptions = this.getSelection();
        if (this._SWIPE_MODE !== "mult") {
          if (selectedOptions && selectedOptions[0] && "" !== selectedOptions[0]) {
            var selectedLayer = selectedOptions[0];

            var lastLayerInfo = this.layerInfosObj.getLayerInfoById(selectedLayer);
            if (lastLayerInfo && !lastLayerInfo.isShowInMap()) {
              this._removeSingleSelectorOption(selectedLayer);
            }
          }

          selectedOptions = this.getSelection();//update selection
        }

        var infos = utils.getVisibleLayerInfos(this.layerInfosObj, selectedOptions);
        this.setDefaultOptions(infos, true);//keep selection= true

        //this._setOptionsOfSwipeLayers(infos);
        //var currentLayers = this.swipeDijit.layers;
        //var basemaps = this.layerInfosObj.getBasemapLayers();
        // var swipeBasemap = array.every(basemaps, function (bm) {
        //   return array.some(currentLayers, function (cl) {
        //     return cl.id === bm.id;
        //   });
        // });
        // if (swipeBasemap && infos && infos[0] && infos[0].id) {
        //   this.singleSelector.set('value', infos[0].id);
        //   // there have a bug in Select dijit,so call this method manually
        //   this.onSwipeLayersChange();
        // }

        //delete option in singleSelector

      },
      _onMainMapBasemapChange: function (evt) {
        if (!(evt.layer && evt.layer._basemapGalleryLayerType)) {
          return;
        }

        var options = this.getOptions();
        if (options && options.length > 0) {
          return;
        } else if (this._loadDef.isResolved()) {
          var layerInfos = utils.getVisibleLayerInfos(this.layerInfosObj);
          this.setDefaultOptions(layerInfos);
          this.createSwipeDijit();
        }
      },
      //layer added / removed
      onLayerInfosChanged: function (layerInfo, changedType, layerInfoSelf) {
        /*jshint unused: false*/
        if (!this.swipeDijit || !this.swipeDijit.enabled) {
          return;
        }
        /*
        var _currentId = this.singleSelector.get('value');
        var newLayerId = null;

        this._currentLayerId = layerInfoSelf && layerInfoSelf.id === _currentId ?
          null : // _currentLayerId be removed
          (_currentId || this._currentLayerId);

        var infos = utils.getVisibleLayerInfos(this.layerInfosObj, this._currentLayerId);
        this._setOptionsOfSwipeLayers(infos || layerInfo);
        if (changedType === 'removed') {
          if (_currentId === layerInfoSelf.id) { // remove currentLayer
            if (this._currentLayerId || (infos[0] && infos[0].id)) {
              newLayerId = this._currentLayerId || infos[0].id;
            } else { // only the basemap
              this.createSwipeDijit(null, true);
            }
          } // remove others do nothing
        } else if (changedType === 'added') {
          newLayerId = this.swipeDijit.layers[0].id;
        }
        this.singleSelector.set('value', newLayerId);*/

        //getSelection
        var selectedOptions = this.getSelection();
        var infos = utils.getVisibleLayerInfos(this.layerInfosObj/*, this._currentLayerId*/);

        var isSelected = false;
        if (selectedOptions && selectedOptions[0]) {
          isSelected = true;
        }

        if (changedType === 'added') {
          var addLayer = layerInfoSelf.id;
          this._LAST_SELECTED.selected = [];//cache this layer
          this._LAST_SELECTED.selected.push(addLayer);

          this.setDefaultOptions(infos, true); //keep selection= true

          if (false === isSelected) {
            if (this._SWIPE_MODE !== "mult") {
              this.singleSelector.set("value", addLayer);
            } else {
              this.multLayersSelector.setValue(addLayer);
            }
          }
        } else if (changedType === 'removed') {
          var deleteLayer = layerInfoSelf.id;
          var isSelectedDeleteLayer = this.isSelected(deleteLayer);

          var newInfos = utils.getVisibleLayerInfos(this.layerInfosObj);
          if (isSelectedDeleteLayer) {
            this._LAST_SELECTED = null; //clean cache, use setting config

            if (this._SWIPE_MODE !== "mult") {
              //single
              this._removeSingleSelectorOption(deleteLayer);
              this.setDefaultOptions(newInfos);
              this.createSwipeDijit();
            } else {
              //"mult"
              this.setDefaultOptions(newInfos);
            }
          } else {
            if (this._SWIPE_MODE !== "mult") {
              this._removeSingleSelectorOption(deleteLayer);//single
            } else {
              this.setDefaultOptions(newInfos);//"mult"
            }
          }
        }
      },

      destroy: function () {
        this.destroySwipeDijit();
        this.inherited(arguments);
      },


      /////////////////////////////////////////////////////
      //layers
      _loadLayerInfos: function () {
        var def = new Deferred();
        this._loadDef = def;
        if (!this._loadDef.isResolved()) {
          LayerInfos.getInstance(this.map, this.map.itemInfo)
            .then(lang.hitch(this, function (layerInfosObj) {
              if (!def.isCanceled()) {
                this.layerInfosObj = layerInfosObj;
                this.own(on(layerInfosObj,
                  'layerInfosChanged',
                  lang.hitch(this, this.onLayerInfosChanged)));
                this.own(on(
                  layerInfosObj,
                  'layerInfosIsShowInMapChanged',
                  lang.hitch(this, this.onLayerInfosIsShowInMapChanged)));

                if (this.config.style === 'scope') {
                  this.hintNode.innerHTML = this.nls.spyglassText;
                } else {
                  this.hintNode.innerHTML = this.nls.swipeText;
                }
                html.addClass(this.swipeIcon, 'swipe-icon-loaded');

                def.resolve();
              }
            }));
        } else {
          def.resolve();
        }

        return def;
      },
      _autoHideInfoWindow: function (layers) {
        var hideInfoWindow = utils.shouldHideInfoWindow(layers, this);
        if (hideInfoWindow) {
          this.map.infoWindow.hide();
        }
      },

      //swipe label layer
      _obtainLabelControl: function (info, layerParams) {
        var labelLayer = info.obtainLabelControl();
        if (labelLayer) {
          layerParams.push(labelLayer);

          this._obtainedLabelLayers.push(info);
        }
      },
      _restoreAllLabelControl: function () {
        array.forEach(this._obtainedLabelLayers, lang.hitch(this, function (labelLayer) {
          labelLayer.restoreLabelControl();
        }));
        this._obtainedLabelLayers = [];
      },

      //handle color
      _setHandleColor: function () {
        if (!this.swipeDijit || this.config.style === "scope") {
          return;
        }

        var moveable = this.swipeDijit.moveable.node;
        var container = query(".handleContainer", this.esriTimeSlider)[0];
        var handle = query(".handle", container)[0];

        if (moveable) {
          html.setStyle(moveable, "backgroundColor", utils.processColor(this.config.handleColor).toHex());
        }
        if (container) {
          html.setStyle(container, "backgroundColor", utils.processColor(this.config.handleColor).toHex());
        }
        if (handle) {
          html.setStyle(handle, "backgroundColor", utils.processColor(this.config.handleColor).toHex());
        }
      },
      //ui
      initSwipeLayersUi: function () {
        // change the width of swipe menu to wrapping Select dijit
        var dom;
        if (this._SWIPE_MODE === "mult") {
          dom = query(".dojoxCheckedMultiSelect>table", this.multLayersSelector.domNode)[0];
        } else {
          dom = this.singleSelector.domNode;
        }

        var selectBox = html.getMarginBox(dom);
        // padding of swipeLayersMenu is 14, max-width of domNode is 350
        if (selectBox.w + 14 * 2 > 350) {
          html.setStyle(this.domNode, 'maxWidth', (selectBox.w + 28) + 'px');
        } else {
          html.setStyle(this.domNode, 'maxWidth', '');
        }
      },
      onDropMouseEnter: function () {
        this._mouseOnDropDown = true;
      },
      onDropMouseLeave: function () {
        this._mouseOnDropDown = false;
        this.singleSelector.dropDown.onCancel();
      },
      onMenuMouseLeave: function () {
        setTimeout(lang.hitch(this, function () {
          if (!this._mouseOnDropDown) {
            this.singleSelector.dropDown.onCancel();
          }
        }), 10);
      },
      onSwipeLayersClick: function () {
        if (!this.singleSelector.disabled) {
          var box = html.getMarginBox(this.singleSelector.dropDown.domNode);
          //console.log(box);
          // padding of swipeLayersMenu is 14, max-width of domNode is 350
          if (box.w + 14 * 2 > 350) {
            html.setStyle(this.domNode, 'maxWidth', (box.w + 28) + 'px');
          }
        }
      }
    });
  });