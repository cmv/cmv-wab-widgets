///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
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

define(['dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/_base/array',
    'dojo/_base/config',
    'dojo/_base/fx',
    'dojo/on',
    'dojo/sniff',
    'dojo/Deferred',
    'dojo/when',
    'dojo/promise/all',
    'dojo/date/locale',
    'dojo/i18n',
    'jimu/LayerInfos/LayerInfos',
    'jimu/BaseWidget',
    'esri/lang',
    'esri/request',
    'esri/TimeExtent',
    'esri/dijit/TimeSlider'
  ],
  function(declare, lang, html, array, dojoConfig, baseFx,
    on, has, Deferred, when, all, dateLocale, i18n,
    LayerInfos, BaseWidget, esriLang, esriRequest, TimeExtent, TimeSlider) {
    // box of speed-menu
    var menuBox = {
      w: 105,
      h: 123
    };

    var localeDic = {
      'ar': {
        datePattern: "dd MMMM, yyyy", // e.g. for German: "d. MMMM yyyy"
        yearPattern: "yyyy",
        hourTimePattern: "h a", // e.g. for German: "H"
        minuteTimePattern: "h:mm a", // e.g. for German: "H:mm"
        secondTimePattern: "h:mm:ss a", // e.g. for German: "H:mm:ss"
        millisecondTimePattern: "h:mm:ss:SSS a" // e.g. for German: "H:mm:ss:SSS"
      },
      'cs': {
        datePattern: "MMMM d, yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "h:mm",
        secondTimePattern: "H:mm:ss",
        millisecondTimePattern: "H:mm:ss:SSS"
      },
      'da': {
        datePattern: "d. MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "H:mm",
        secondTimePattern: "H:mm:ss",
        millisecondTimePattern: "H:mm:ss:SSS"
      },
      'de': {
        datePattern: "d. MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "H:mm",
        secondTimePattern: "H:mm:ss",
        millisecondTimePattern: "H:mm:ss:SSS"
      },
      'el': {
        datePattern: "d MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "h",
        minuteTimePattern: "hh:mm",
        secondTimePattern: "hh:mm:ss",
        millisecondTimePattern: "hh:mm:ss:SSS"
      },
      'es': {
        datePattern: "d\' de \'MMMM\' de \'yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "H:mm",
        secondTimePattern: "H:mm:ss",
        millisecondTimePattern: "H:mm:ss:SSS"
      },
      'et': {
        datePattern: "d. MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "H:mm",
        secondTimePattern: "H:mm:ss",
        millisecondTimePattern: "H:mm:ss:SSS"
      },
      'fi': {
        datePattern: "d. MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "t",
        minuteTimePattern: "t:mm a",
        secondTimePattern: "t:mm:ss",
        millisecondTimePattern: "h:mm:ss:SSS"
      },
      'fr': {
        datePattern: "d MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "HH",
        minuteTimePattern: "HH:mm",
        secondTimePattern: "HH:mm:ss",
        millisecondTimePattern: "HH:mm:ss:SSS"
      },
      'he': {
        datePattern: "d, MMMM ,yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "h a",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "h:mm:ss a",
        millisecondTimePattern: "h:mm:ss:SSS a"
      },
      'it': {
        datePattern: "d MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "H.mm",
        secondTimePattern: "H.mm.ss",
        millisecondTimePattern: "H.mm.ss.SSS"
      },
      'ja': {
        datePattern: "yyyy'年'M'月'd'日'",
        yearPattern: "yyyy'年'",
        hourTimePattern: "h a",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "h:mm:ss a",
        millisecondTimePattern: "h:mm:ss:SSS a"
      },
      'ko': {
        datePattern: "yyyy년 M월 d일",
        yearPattern: "yyyy년",
        hourTimePattern: "a h시",
        minuteTimePattern: "a h:mm",
        secondTimePattern: "a h:mm:ss",
        millisecondTimePattern: "a h:mm:ss:SSS"
      },
      'lt': {
        datePattern: "yyyy MMMM dd",
        yearPattern: "yyyy",
        hourTimePattern: "H a",
        minuteTimePattern: "HH:mm",
        secondTimePattern: "HH:mm:ss",
        millisecondTimePattern: "HH:mm:ss:SSS"
      },
      'lv': {
        datePattern: "dd.MM.yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H a",
        minuteTimePattern: "HH:mm",
        secondTimePattern: "HH:mm:ss",
        millisecondTimePattern: "HH:mm:ss:SSS"
      },
      'nb': {
        datePattern: "d. MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "H.mm",
        secondTimePattern: "H.mm.ss",
        millisecondTimePattern: "H.mm.ss.SSS"
      },
      'nl': {
        datePattern: "d. MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "H:mm",
        secondTimePattern: "H:mm:ss",
        millisecondTimePattern: "H:mm:ss:SSS"
      },
      'pl': {
        datePattern: "dd-mm-yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "hh",
        minuteTimePattern: "hh:mm",
        secondTimePattern: "hh:mm:ss",
        millisecondTimePattern: "hh:mm:ss:SSS"
      },
      'pt-br': {
        datePattern: "d\' de \'MMMM\' de \'yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "H:mm:ss",
        millisecondTimePattern: "H:mm:ss:SSS"
      },
      'pt-pt': {
        datePattern: "d\' de \'MMMM\' de \'yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "H:mm",
        secondTimePattern: "H:mm:ss",
        millisecondTimePattern: "H:mm:ss:SSS"
      },
      'ro': {
        datePattern: "d. MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "H:mm",
        secondTimePattern: "H:mm:ss",
        millisecondTimePattern: "H:mm:ss:SSS"
      },
      'ru': {
        datePattern: "MMMM d, yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H",
        minuteTimePattern: "h:mm",
        secondTimePattern: "h:mm:ss",
        millisecondTimePattern: "h:mm:ss:SSS"
      },
      'sv': {
        datePattern: "MMMM d, yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "h a",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "h:mm:ss a",
        millisecondTimePattern: "h:mm:ss:SSS a"
      },
      'th': {
        datePattern: "d MMMM,yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "H a",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "h:mm:ss a",
        millisecondTimePattern: "h:mm:ss:SSS a"
      },
      'tr': {
        datePattern: "d MMMM yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "h a",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "h:mm:ss a",
        millisecondTimePattern: "h:mm:ss:SSS a"
      },
      'vi': {
        datePattern: "d MMMM, yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "h a",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "h:mm:ss a",
        millisecondTimePattern: "h:mm:ss:SSS a"
      },
      'zh-cn': {
        datePattern: "yyyy'年'M'月'd'日'",
        yearPattern: "yyyy'年'",
        hourTimePattern: "H",
        minuteTimePattern: "H:mm",
        secondTimePattern: "H:mm:ss",
        millisecondTimePattern: "H:mm:ss:SSS"
      },
      'zh-hk': {
        datePattern: "年月日",
        yearPattern: "yyyy",
        hourTimePattern: "h a",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "h:mm:ss a",
        millisecondTimePattern: "h:mm:ss:SSS a"
      },
      'zh-tw': {
        datePattern: "年月日",
        yearPattern: "yyyy",
        hourTimePattern: "h a",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "h:mm:ss a",
        millisecondTimePattern: "h:mm:ss:SSS a"
      },
      'en': {
        datePattern: "MMMM d, yyyy",
        yearPattern: "yyyy",
        hourTimePattern: "h a",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "h:mm:ss a",
        millisecondTimePattern: "h:mm:ss:SSS a"
      }
    };

    var clazz = declare([BaseWidget], {
      baseClass: 'jimu-widget-timeslider',
      clasName: 'esri.widgets.TimeSlider',
      _showed: false,
      // _enabled: true,
      _timeHandles: null,
      layerInfosObj: null,

      _layerInfosDef: null,
      _timeSliderPropsDef: null,

      postCreate: function() {
        this.inherited(arguments);
        this._timeHandles = [];

        this._initLayerInfosObj().then(lang.hitch(this, function() {
            this.processTimeDisableLayer();
          }));
      },

      startup: function() {
        this.inherited(arguments);
        this.own(on(this.map, 'resize', lang.hitch(this, this._onMapResize)));
      },

      _initLayerInfosObj: function() {
        if (!this._layerInfosDef){
          this._layerInfosDef = new Deferred();
          this.own(this._layerInfosDef);

          LayerInfos.getInstance(this.map, this.map.itemInfo)
            .then(lang.hitch(this, function(layerInfosObj) {
              if (!this.domNode) {
                return;
              }

              this.layerInfosObj = layerInfosObj;
              // should check whether is timeInfo layer.
              this.own(on(
                layerInfosObj,
                'layerInfosIsShowInMapChanged',
                lang.hitch(this, this._onLayerInfosIsShowInMapChanged)));
              this.own(layerInfosObj.on(
                'layerInfosChanged',
                lang.hitch(this, this._onLayerInfosChanged)));

              this._layerInfosDef.resolve(this.layerInfosObj);
            }));
        }

        return this._layerInfosDef;
      },

      _isTimeTemporalLayer: function(layer, mustVisible) {
        var _hasValidTime = layer && layer.timeInfo && layer.useMapTime;
        var _layerInfo = this.layerInfosObj.getLayerInfoById(layer.id);
        var timeAnimation = _layerInfo && _layerInfo.originOperLayer &&
          (_layerInfo.originOperLayer.timeAnimation !== false);
        var condition = _hasValidTime && timeAnimation && (mustVisible ? layer.visible : true);

        if (condition) {
          var layerType = layer.declaredClass;
          if (layerType === "esri.layers.KMLLayer") {
            var internalLayers = layer.getLayers();
            var some = array.some(internalLayers, function(kLayer) {
              if (kLayer.timeInfo && kLayer.timeInfo.timeExtent) {
                return true;
              }
              return false;
            });
            if (some) {
              return true;
            }
          } else if (layer.timeInfo && layer.timeInfo.timeExtent) {
            return true;
          }
        }

        return false;
      },

      _hasLiveData: function(layer) {
        // doesn't need to consider KMLLayers
        return layer && layer.useMapTime && layer.timeInfo && layer.timeInfo.hasLiveData;
      },

      _processTimeUpdate: function(layer) {
        var _layerInfo = null;
        var timeAnimation = true;
        _layerInfo = this.layerInfosObj.getLayerInfoById(layer.id);
        timeAnimation = _layerInfo && _layerInfo.originOperLayer &&
          (_layerInfo.originOperLayer.timeAnimation !== false);
        if (!timeAnimation && 'setUseMapTime' in layer) {
          layer.setUseMapTime(false);
        }
      },

      processTimeDisableLayer: function() {
        var i = 0,
          len, layer, layerId;
        for (i = 0, len = this.map.layerIds.length; i < len; i++) {
          layerId = this.map.layerIds[i];
          layer = this.map.getLayer(layerId);

          this._processTimeUpdate(layer);
        }

        for (i = 0, len = this.map.graphicsLayerIds.length; i < len; i++) {
          layerId = this.map.graphicsLayerIds[i];
          layer = this.map.getLayer(layerId);

          this._processTimeUpdate(layer);
        }
      },

      hasVisibleTemporalLayer: function() {
        var i = 0,
          len, layer, layerId;
        for (i = 0, len = this.map.layerIds.length; i < len; i++) {
          layerId = this.map.layerIds[i];
          layer = this.map.getLayer(layerId);

          if (this._isTimeTemporalLayer(layer, true)) {
            return true;
          }
        }

        for (i = 0, len = this.map.graphicsLayerIds.length; i < len; i++) {
          layerId = this.map.graphicsLayerIds[i];
          layer = this.map.getLayer(layerId);

          if (this._isTimeTemporalLayer(layer, true)) {
            return true;
          }
        }

        return false;
      },

      needUpdateFullTime: function() {
        var i = 0,
          len, layer, layerId;
        for (i = 0, len = this.map.layerIds.length; i < len; i++) {
          layerId = this.map.layerIds[i];
          layer = this.map.getLayer(layerId);

          if (this._hasLiveData(layer)) {
            return true;
          }
        }

        for (i = 0, len = this.map.graphicsLayerIds.length; i < len; i++) {
          layerId = this.map.graphicsLayerIds[i];
          layer = this.map.getLayer(layerId);

          if (this._hasLiveData(layer)) {
            return true;
          }
        }

        return false;
      },

      _onLayerInfosIsShowInMapChanged: function(changedLayerInfos) {
        var timeTemporalLayerChanged = array.some(
          changedLayerInfos,
          lang.hitch(this, function(layerInfo) {
            var _layer = null;
            while (!_layer) {
              _layer = this.map.getLayer(layerInfo.id);
              layerInfo = layerInfo.parentLayerInfo;
            }

            return this._isTimeTemporalLayer(_layer);
          }));

        if (timeTemporalLayerChanged) {
          this._onTimeTemportalLayerChanged();
        }
      },

      _onLayerInfosChanged: function(layerInfo, changedType, layerInfoSelf) {
        /* jshint unused:true */
        if (changedType === 'added') {
          var _layer = this.map.getLayer(layerInfoSelf.id);
          var visibleTimeTemporalLayerChanged = this._isTimeTemporalLayer(_layer, true);

          if (visibleTimeTemporalLayerChanged) {
            this._onTimeTemportalLayerChanged();
          }
        } else if (changedType === 'removed') {
          this._onTimeTemportalLayerChanged();
        }
      },

      _onTimeTemportalLayerChanged: function() {
        if (this.state !== 'closed') {
          if (this.hasVisibleTemporalLayer()) {
            if (this.timeSlider) {
              this.updateLayerLabel();
            } else {
              this.showTimeSlider();
            }
          } else {
            if (this.timeSlider) {
              this.closeTimeSlider();
            }
          }
        }
      },

      onOpen: function() {
        this._initLayerInfosObj().then(lang.hitch(this, function() {
          if (!this.hasVisibleTemporalLayer()) {
            html.setStyle(this.noTimeContentNode, 'display', 'block');
            html.setStyle(this.timeContentNode, 'display', 'none');
            this._showed = true;
          } else {
            if (!this._showed) {
              this.showTimeSlider();
            }
          }
        }));
      },

      onClose: function() {
        this._initLayerInfosObj().then(lang.hitch(this, function() {
          if (!this.hasVisibleTemporalLayer()) {
            html.setStyle(this.noTimeContentNode, 'display', 'none');
            this._showed = false;
          } else {
            if (this._showed) {
              this.closeTimeSlider();
            }
          }
        }));
      },

      _isRunInMobile: function() {
        return window.appInfo.isRunInMobile;
      },

      showTimeSlider: function() {
        html.setStyle(this.noTimeContentNode, 'display', 'none');
        this.createTimeSlider().then(lang.hitch(this, function() {
          html.setStyle(this.timeContentNode, 'display', 'block');
          html.addClass(this.domNode, 'show-time-slider');

          this._adaptResponsive();

          if (has('ie') && has('ie') < 9) {
            this._showed = true;
          } else {
            baseFx.animateProperty({
              node: this.timeContentNode,
              properties: {
                opacity: {
                  start: 0,
                  end: 1
                }
              },
              onEnd: lang.hitch(this, function() {
                this._showed = true;
                this._setMenuPosition();
              }),
              duration: 500
            }).play();
          }
        }));
      },

      closeTimeSlider: function() {
        html.setStyle(this.domNode, 'display', 'block');
        if (has('ie') && has('ie') < 9) {
          this._onCloseTimeSliderEnd();
        } else {
          baseFx.animateProperty({
            node: this.timeContentNode,
            properties: {
              opacity: {
                start: 1,
                end: 0
              }
            },
            onEnd: lang.hitch(this, this._onCloseTimeSliderEnd),
            duration: 500
          }).play();
        }
      },

      _onCloseTimeSliderEnd: function() {
        if (this._destroyed) {
          return;
        }
        this.removeTimeSlider();
        this._showed = false;

        html.setStyle(this.timeContentNode, 'display', 'none');
        html.removeClass(this.domNode, 'show-time-slider');

        if (this.state !== 'closed') {
          html.setStyle(this.noTimeContentNode, 'display', 'block');
        }

        if (this.state === 'closed') {
          html.removeClass(this.domNode, 'mobile-time-slider');
          html.removeClass(this.timeContentNode, 'mobile');
        }
      },

      getTimeSliderProps: function(map) {
        if (!this._timeSliderPropsDef) {

          this._timeSliderPropsDef = new Deferred();
          this.own(this._timeSliderPropsDef);
          var itemInfo = map && map.itemInfo;

          var timeSliderProps = lang.getObject('itemData.widgets.timeSlider.properties',
            false, itemInfo);

          if (itemInfo && timeSliderProps) {
            var tsProps = lang.clone(timeSliderProps);

            if (this.needUpdateFullTime()) {
              this._getUpdatedFullTime().then(lang.hitch(this, function(fullTimeExtent) {
                var start = fullTimeExtent.startTime.getTime();
                var end = fullTimeExtent.endTime.getTime();

                if (tsProps.startTime > end || tsProps.endTime < start) {
                  tsProps.startTime = start;
                  tsProps.endTime = end;
                } else {
                  if (tsProps.startTime < start) {
                    tsProps.startTime = start;
                  }
                  if (tsProps.endTime > end) {
                    tsProps.endTime = end;
                  }
                }

                this._timeSliderPropsDef.resolve(tsProps);
              }));
            } else {
              this._timeSliderPropsDef.resolve(tsProps);
            }
          } else {
            this._timeSliderPropsDef.resolve(null);
          }
        }

        return this._timeSliderPropsDef;
      },

      _getUpdatedFullTime: function() {
        var i = 0,
          len, layer, layerId;
        var defs = [];
        for (i = 0, len = this.map.layerIds.length; i < len; i++) {
          layerId = this.map.layerIds[i];
          layer = this.map.getLayer(layerId);

          defs.push(this._getUpdatedTime(layer));
        }

        for (i = 0, len = this.map.graphicsLayerIds.length; i < len; i++) {
          layerId = this.map.graphicsLayerIds[i];
          layer = this.map.getLayer(layerId);

          defs.push(this._getUpdatedTime(layer));
        }

        return all(defs).then(lang.hitch(this, function(timeExtents) {
          return this._getFullTimeExtent(timeExtents);
        }));
      },

      _getFullTimeExtent: function(timeExtents) {
        var fullTimeExtent = null;
        array.forEach(timeExtents, lang.hitch(this, function(te) {
          if (!te) {
            return;
          }

          if (!fullTimeExtent) {
            fullTimeExtent = new TimeExtent(new Date(te.startTime.getTime()),
              new Date(te.endTime.getTime()));
          } else {
            if (fullTimeExtent.startTime > te.startTime) {
              fullTimeExtent.startTime = new Date(te.startTime.getTime());
            }
            if (fullTimeExtent.endTime < te.endTime) {
              fullTimeExtent.endTime = new Date(te.endTime.getTime());
            }
          }
        }));

        return fullTimeExtent;
      },

      _getUpdatedTime: function(layer) {
        if (layer && layer.url && this._hasLiveData(layer)) {
          var timeExtent = null;
          return esriRequest({
            url: layer.url,
            callbackParamName: 'callback',
            content: {
              f: 'json',
              returnUpdates: true
            }
          }).then(lang.hitch(this, function(result) {
            if (result.timeExtent && result.timeExtent.length === 2) {
              timeExtent = new TimeExtent();
              timeExtent.startTime = new Date(result.timeExtent[0]);
              timeExtent.endTime = new Date(result.timeExtent[1]);
            }
          })).always(lang.hitch(this, function() {
            return when(timeExtent || lang.getObject('timeInfo.timeExtent', false, layer) || null);
          }));
        } else {
          return when(lang.getObject('timeInfo.timeExtent', false, layer) || null);
        }
      },

      createTimeSlider: function() {
        return this.getTimeSliderProps(this.map).then(lang.hitch(this, function(props) {
          if (!props) {
            return;
          }
          if (this.timeSlider) {
            return this.timeSlider;
          }
          this.timeSlider = new TimeSlider({}, this.sliderNode);
          this.map.setTimeSlider(this.timeSlider);
          var fromTime = new Date(props.startTime);
          var endTime = new Date(props.endTime);

          var timeExtent = new TimeExtent(fromTime, endTime);
          this.timeSlider.setThumbCount(props.thumbCount);
          if (props.numberOfStops) {
            this.timeSlider.createTimeStopsByCount(timeExtent, (props.numberOfStops + 1));
          } else {
            this.timeSlider.createTimeStopsByTimeInterval(
              timeExtent,
              props.timeStopInterval.interval,
              props.timeStopInterval.units
            );
          }
          this.timeSlider.setThumbMovingRate(props.thumbMovingRate);

          if (this.timeSlider.timeStops.length > 25) {
            this.timeSlider.setTickCount(0);
          }
          if (this.timeSlider.thumbCount === 2) {
            this.timeSlider.setThumbIndexes([0, 1]);
          }

          this.timeSlider.setLoop(true);
          this.timeSlider.startup();
          html.addClass(this.timeSlider.domNode, 'jimu-float-leading');

          this.updateLayerLabel();
          this.updateTimeExtentLabel();

          this._timeHandles.push(on(
            this.timeSlider,
            'time-extent-change',
            lang.hitch(this, this.updateTimeExtentLabel)
          ));

          return this.timeSlider;
        }));
      },

      _onSelectSpeedItem: function(evt) {
        if (evt.target) {
          var rate = html.getAttr(evt.target, 'speed');
          this.getTimeSliderProps(this.map).then(lang.hitch(this, function(props) {
            if (props && rate) {
              rate = parseFloat(rate);
              this.timeSlider.setThumbMovingRate(props.thumbMovingRate / rate);
              this.speedLabelNode.innerHTML = evt.target.innerHTML;
            }
            html.setStyle(this.speedMenu, 'display', 'none');
          }));
        }
      },

      _setMenuPosition: function() {
        var sPosition = html.position(this.speedLabelNode);
        if (sPosition.y - menuBox.h - 2 < 0) {
          html.setStyle(this.speedMenu, {
            top: '27px',
            bottom: 'auto'
          });
        }

        var layoutBox = html.getMarginBox(window.jimuConfig.layoutId);
        if (window.isRTL) {
          if (sPosition.x - menuBox.w < 0) {
            html.setStyle(this.speedMenu, {
              left: 0
            });
          }
        } else {
          if (sPosition.x + menuBox.w > layoutBox.w) {
            html.setStyle(this.speedMenu, {
              right: 0
            });
          }
        }
      },

      _onSpeedLabelClick: function() {
        this._onMouseEnterSpeedContainer();
      },

      _onMouseEnterSpeedContainer: function() {
        html.setStyle(this.speedMenu, 'display', 'block');
      },

      _onMouseLeaveSpeedContainer: function() {
        html.setStyle(this.speedMenu, 'display', 'none');
      },

      // updateTimeSlider: function() {
      //   if (this.timeSlider) {
      //     var isPlaying = this.timeSlider.playing;
      //     this.removeTimeSlider();
      //     this.createTimeSlider().then(lang.hitch(this, function() {
      //       if (isPlaying) {
      //         this.timeSlider.play();
      //       }
      //     }));
      //   }
      // },

      removeTimeSlider: function() {
        array.forEach(this._timeHandles, function(handle) {
          if (handle && handle.remove) {
            handle.remove();
          }
        });
        if (this.timeSlider && !this.timeSlider._destroyed) {
          this.timeSlider.destroy();
          this.timeSlider = null;
        }

        if (this.map) {
          this.map.setTimeExtent(null);
        }
        this.speedLabelNode.innerHTML = '1X';
        this.sliderNode = html.create('div', {}, this.speedContainerNode, 'before');
      },

      updateLayerLabel: function() {
        if (this.config.showLabels) {
          html.setStyle(this.layerLabelsNode, 'display', 'block');
          var label = this.nls.layers;
          var names = this._getVisibleTemporalLayerNames();
          label = label + names.join(',');
          this.layerLabelsNode.innerHTML = label;
          html.setAttr(this.layerLabelsNode, 'title', label);
        } else {
          html.setStyle(this.layerLabelsNode, 'display', 'none');
        }
      },

      _getVisibleTemporalLayerNames: function() {
        var i = 0,
          len, layer, layerId;
        var ids = [];
        for (i = 0, len = this.map.layerIds.length; i < len; i++) {
          layerId = this.map.layerIds[i];
          layer = this.map.getLayer(layerId);

          if (this._isTimeTemporalLayer(layer, true)) {
            ids.push(layer.id);
          }
        }

        for (i = 0, len = this.map.graphicsLayerIds.length; i < len; i++) {
          layerId = this.map.graphicsLayerIds[i];
          layer = this.map.getLayer(layerId);

          if (this._isTimeTemporalLayer(layer, true)) {
            ids.push(layer.id);
          }
        }

        var names = array.map(ids, lang.hitch(this, function(id) {
          var info = this.layerInfosObj.getLayerInfoById(id);
          return info.title || "";
        }));

        return names;
      },

      updateTimeExtentLabel: function(timeExtent) {
        var label = this.nls.timeExtent;
        var start = null;
        var end = null;

        if (!timeExtent) {
          if (this.timeSlider.thumbCount === 2) {
            start = this.timeSlider.timeStops[0];
            end = this.timeSlider.timeStops[1];
          } else {
            start = this.timeSlider.timeStops[0];
          }
        } else {
          start = timeExtent.startTime;
          if (timeExtent.endTime.getTime() - timeExtent.startTime.getTime() > 0) {
            end = timeExtent.endTime;
          }
        }

        var datePattern = null;
        var timePattern = null;
        var formatLength = null;
        var showEndDate = false;
        var time = localeDic[dojoConfig.locale] || localeDic.en;
        if (end && start.getFullYear() === end.getFullYear()) {
          if (start.getMonth() === end.getMonth()) {
            if (start.getDate() === end.getDate()) {
              if (start.getHours() === end.getHours()) {
                if (start.getMinutes() === end.getMinutes()) {
                  if (start.getSeconds() === end.getSeconds()) {
                    // same second
                    timePattern = time.millisecondTimePattern;
                    formatLength = "long";
                  } else { // same minute
                    timePattern = time.secondTimePattern;
                    formatLength = "long";
                  }
                } else { // same hour
                  timePattern = time.minuteTimePattern;
                  formatLength = "long";
                }
              } else { // same day
                timePattern = time.minuteTimePattern; //hourTimePattern;
                formatLength = "long";
              }
            } else { // same month
              if (end.getDate() - start.getDate() < 2) {
                // less than 2 days
                timePattern = time.minuteTimePattern; //hourTimePattern;
                showEndDate = true;
                formatLength = "long";
              } else {
                showEndDate = true;
                formatLength = "long";
              }
            }
          } else { // same year
            showEndDate = true;
            formatLength = "long";
          }
        } else if (end && end.getFullYear() - start.getFullYear() > 10) {
          datePattern = time.yearPattern;
          showEndDate = true;
        } else {
          showEndDate = true;
          formatLength = "long";
        }

        var startTime = dateLocale.format(start, {
          datePattern: datePattern,
          formatLength: formatLength,
          selector: "date"
        });
        if (timePattern) {
          var startTime2 = dateLocale.format(start, {
            timePattern: timePattern,
            selector: "time"
          });
          var startTime3 = i18n.getLocalization("dojo.cldr", "gregorian")["dateTimeFormat-medium"]
            .replace(/\{1\}/g, startTime).replace(/\{0\}/g, startTime2);
          startTime = startTime3;
        }
        var endTime = "";
        if (end) {
          if (showEndDate) {
            endTime = dateLocale.format(end, {
              datePattern: datePattern,
              formatLength: formatLength,
              selector: "date"
            });
          }
          if (timePattern) {
            var endTime2 = dateLocale.format(end, {
              timePattern: timePattern,
              selector: "time"
            });
            if (showEndDate && timePattern) {
              var endTime3 = i18n.getLocalization("dojo.cldr", "gregorian")["dateTimeFormat-medium"]
                .replace(/\{1\}/g, endTime).replace(/\{0\}/g, endTime2);
              endTime = endTime3;
            } else {
              endTime = endTime2;
            }
          }
        }

        if (end) {
          label = esriLang.substitute({
            FROMTIME: startTime,
            ENDTIME: endTime
          }, label);
        } else {
          label = startTime + "";
        }

        this.timeExtentLabelNode.innerHTML = label;
        html.setAttr(this.timeExtentLabelNode, 'title', label);
      },

      _adaptResponsive: function() {
        // if (!this.timeSlider) {
        //   return;
        // }
        setTimeout(lang.hitch(this, function() {
          var _w = null;
          if (window.appInfo.isRunInMobile) {
            html.addClass(this.timeContentNode, 'mobile');
            html.addClass(this.domNode, 'mobile-time-slider');
          } else {
            html.removeClass(this.timeContentNode, 'mobile');
            html.removeClass(this.domNode, 'mobile-time-slider');
          }
          if (this.timeSlider) {
            var sliderContentBox = html.getContentBox(this.sliderContent);
            var speedBox = html.getMarginBox(this.speedContainerNode);

            _w = sliderContentBox.w - speedBox.w;
            html.setStyle(this.timeSlider.domNode, 'width', _w + 'px');
          }

        }), 10);

      },

      _onMapResize: function() {
        if (this.state === 'closed') {
          return;
        }

        this._adaptResponsive();
      },

      destroy: function() {
        if (this.map) {
          this.map.setTimeExtent(null);
        }
        this.inherited(arguments);
      }
    });
    return clazz;
  });