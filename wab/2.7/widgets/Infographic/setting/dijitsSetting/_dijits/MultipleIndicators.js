define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dojo/Evented',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./SingleIndicator.html',
    'dojo/_base/Color',
    'dojo/on',
    'dojo/mouse',
    'dojo/query',
    'dojo/_base/html',
    'dojo/_base/lang',
    'jimu/utils',
    'jimu/dijit/ColorPickerPopup',
    './IconChooserPopup',
    'dojo/dom-style',
    "dijit/form/Select",
    "jimu/dijit/CheckBox"
  ],
  function(declare, _WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin, template, Color,
    on, mouse, query, html, lang, jimuUtils, ColorPickerPopup, IconChooserPopup, domStyle) {
    var enterEvent = mouse.enter,
      leaveEvent = mouse.leave;
    var SingleIndicator = declare([_WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin], {
      baseClass: 'infographic-setting-single-indicator',
      templateString: template,
      _valueEnable: true,
      _gaugeEnable: true,
      _iconEnable: true,
      nls: null,
      type: '', //gauge,number
      //config:
      //  operator: //is greater than
      //  value:[],
      //  isRatio:boolean,
      //  valueColor:'#fff',
      //  gaugeColor:'#fff',
      //  iconInfo:{
      //    color:'',
      //    icon:'',
      //    placement:'',//left,replace,right
      //  }

      postCreate: function() {
        this.inherited(arguments);
        this._initUI();
        this.own(on(this.indicatorOption, 'click', lang.hitch(this, this._onIndicatorComponentClick)));
        this.setConfig(this.config);
        this._hasLoaded = true;
      },
      constructor: function(option) {
        this.cacheColor = {};
        this.config = option.config;
        this.type = option.type;
        this.folderUrl = option.folderUrl;
      },
      switchTopLineDisplay: function(isShow) {
        if (isShow) {
          html.setStyle(this.indicatorTopLine, 'display', 'block');
        } else {
          html.setStyle(this.indicatorTopLine, 'display', 'none');
        }
      },
      _onUpdate: function() {
        if (this._hasLoaded) {
          this.emit('change');
        }
      },
      _initUI: function() {
        //init event of operator changed
        this.own(on(this.operator, 'change', lang.hitch(this, this._onCompareChange)));
        //init diff display of gauge and number indicator
        if (this.type === 'gauge') {
          domStyle.set(this.ratioBtnDiv, 'display', 'block');
          domStyle.set(this.gaugeColorSetting, 'display', 'flex');
          domStyle.set(this.indicatorIconSetting, 'display', 'none');
        } else if (this.type === 'number') {
          domStyle.set(this.ratioBtnDiv, 'display', 'none');
          domStyle.set(this.gaugeColorSetting, 'display', 'none');
          domStyle.set(this.indicatorIconSetting, 'display', 'flex');
        }
        //1.value color
        this.valueColorPicker = new ColorPickerPopup({
          appearance: {
            showTransparent: false,
            showColorPalette: true,
            showCoustom: true,
            showCoustomRecord: true
          }
        });
        this.valueColorPicker.placeAt(this.valueColorSettingBtn);
        this.valueColorPicker.startup();
        this.valueColorPicker.setColor(new Color('#808080'));
        this.own(on(this.valueColorPicker, 'change', lang.hitch(this, function() {
          this._onUpdate();
        })));
        if (this.type === 'gauge') {
          //2.gauge color
          this.gaugeColorPicker = new ColorPickerPopup({
            appearance: {
              showTransparent: false,
              showColorPalette: true,
              showCoustom: true,
              showCoustomRecord: true
            }

          });
          this.gaugeColorPicker.placeAt(this.gaugeColorSettingBtn);
          this.gaugeColorPicker.startup();
          this.gaugeColorPicker.setColor(new Color('#808080'));
          this.own(on(this.gaugeColorPicker, 'change', lang.hitch(this, function() {
            this._onUpdate();
          })));
        } else if (this.type === 'number') { //3.icon-chooser
          this.iconChooser = new IconChooserPopup({
            nls: this.nls,
            folderUrl: this.folderUrl
          });
          this.iconChooser.placeAt(this.indicatorIconSettingBtn);
          this.iconChooser.startup();
          this.own(on(this.iconChooser, 'change', lang.hitch(this, function() {
            this._onUpdate();
          })));
        }
      },
      setConfig: function(config) {
        this.config = config;
        if (!this.config) {
          return;
        }
        //1. set operator
        this.operator.set('value', this.config.operator);
        //2. set ratio button
        if (this.config.isRatio) {
          this.ratioBtn.check();
        } else {
          this.ratioBtn.uncheck();
        }
        //3. set value color
        if (this.config.valueColor) {
          this.valueColorPicker.setColor(new Color(this.config.valueColor));
        } else {
          this._updateOptionDisplay(this.valueState);
        }
        //4. set gauge color
        if (this.type === 'gauge') {
          if (this.config.gaugeColor) {
            this.gaugeColorPicker.setColor(new Color(this.config.gaugeColor));
          } else {
            this._updateOptionDisplay(this.gaugeState);
          }
        }
        //5. set icon chooser
        if (this.type === 'number') {
          if (this.config.iconInfo) {
            this.iconChooser.setConfig(this.config.iconInfo);
          } else {
            this._updateOptionDisplay(this.iconState);
          }
        }
        //6. set value
        var value = this.config.value;
        if (jimuUtils.isNotEmptyObject(value, true)) {
          setTimeout(lang.hitch(this, function() {
            if (this.config.operator !== 'between') {
              this.compareValue.setValue(value[0]);
            } else {
              this.compareValue1.setValue(value[0]);
              this.compareValue2.setValue(value[1]);
            }
          }), 200);
        }
      },
      getConfig: function() {
        var config = {};
        var value = this._getValue();
        if (!jimuUtils.isNotEmptyObject(value, true)) {
          return config;
        }
        //1. get value
        config.value = value;
        //2. get operator
        var operator = this.operator.getValue();
        config.operator = operator;
        //3. get is ratio
        if (this.type === 'gauge') {
          var isRatio = this.ratioBtn.checked;
          config.isRatio = isRatio;
        }
        //4. get value color
        if (this.valueColorPicker && this._valueEnable) {
          var valueColor = this.valueColorPicker.getColor();
          if (valueColor) {
            config.valueColor = valueColor.toHex();
          }
        }
        //5. get gauge color
        if (this.gaugeColorPicker && this._gaugeEnable) {
          var gaugeColor = this.gaugeColorPicker.getColor();
          if (gaugeColor) {
            config.gaugeColor = gaugeColor.toHex();
          }
        }
        //6. get icon chooser config
        if (this.type === 'number') {
          if (this.iconChooser && this._iconEnable) {
            var iconInfo = this.iconChooser.getConfig();
            config.iconInfo = iconInfo;
          }
        }
        return config;
      },
      _onCompareChange: function(comparison) {
        this.compareValue.setValue("");
        this.compareValue1.setValue("");
        this.compareValue2.setValue("");
        if (comparison === 'between') {
          domStyle.set(this.oneValueDiv, 'display', 'none');
          domStyle.set(this.twoValueDiv, 'display', '');
        } else {
          domStyle.set(this.oneValueDiv, 'display', '');
          domStyle.set(this.twoValueDiv, 'display', 'none');
        }
      },
      _getValue: function() {
        var value = [];
        var operator = this.operator.getValue();
        if (operator !== 'between') {
          var compareValue = this.compareValue.getValue();
          if (this.compareValue.isValid() && compareValue !== '') {
            value.push(Number(compareValue));
          }
        } else {
          var compareValue1 = this.compareValue1.getValue();
          var compareValue2 = this.compareValue2.getValue();
          if (this.compareValue1.isValid() && compareValue1 !== '' &&
            this.compareValue2.isValid() && compareValue2 !== '') {
            value.push(Number(compareValue1), Number(compareValue2));
          }
        }
        return value;
      },
      _removeIndicator: function() {
        this.emit('remove');
        this._onUpdate();
      },
      _updateOptionDisplay: function(target) {
        if (!html.hasClass(target, 'activated') && !html.hasClass(target, 'deactivated')) {
          return;
        }
        var textDom, colorPocker, iconChooser, colorSign;
        if (html.hasClass(target, 'value-state')) {
          this._valueEnable = !this._valueEnable;
          textDom = query('.color-tip', this.valueColorSetting)[0];
          colorSign = 'value';
          colorPocker = this.valueColorPicker;
          iconChooser = null;
        } else if (html.hasClass(target, 'gauge-state')) {
          this._gaugeEnable = !this._gaugeEnable;
          textDom = query('.color-tip', this.gaugeColorSetting)[0];
          colorSign = 'gauge';
          colorPocker = this.gaugeColorPicker;
          iconChooser = null;
        } else if (html.hasClass(target, 'icon-state')) {
          this._iconEnable = !this._iconEnable;
          textDom = query('.color-tip', this.indicatorIconSetting)[0];
          colorSign = 'icon';
          colorPocker = null;
          iconChooser = this.iconChooser;
        }

        if (html.hasClass(textDom, 'disable')) {
          html.removeClass(textDom, 'disable');
          //reset color from cache color
          if (colorPocker) {
            if (this.cacheColor[colorSign]) {
              colorPocker.setColor(new Color(this.cacheColor[colorSign]));
            }
          }
          if (iconChooser) {
            if (this.cacheColor[colorSign]) {
              iconChooser.setIconColor(this.cacheColor[colorSign]);
            }
          }
          html.addClass(target, 'activated');
          html.removeClass(target, 'deactivated');
          this._onUpdate();
        } else {
          html.addClass(textDom, 'disable');
          //cache color
          if (colorPocker) {
            this.cacheColor[colorSign] = colorPocker.getColor().toHex();
            colorPocker.setColor(new Color('#BCBCBC'));
          }
          if (iconChooser) {
            if (iconChooser.getIconColor()) {
              this.cacheColor[colorSign] = iconChooser.getIconColor();
            }
            iconChooser.setIconColor('#BCBCBC');
          }
          html.removeClass(target, 'activated');
          html.addClass(target, 'deactivated');
          this._onUpdate();
        }
      },
      _onIndicatorComponentClick: function(event) {
        // event.stopPropagation();
        var target = event.target || event.srcElement;
        this._updateOptionDisplay(target);
      },
      destroy: function() {
        if (this.valueColorPicker) {
          this.valueColorPicker.destroy();
          this.valueColorPicker = null;
        }
        if (this.valueColorPicker) {
          this.gaugeColorPicker.destroy();
          this.gaugeColorPicker = null;
        }
        if (this.iconChooser) {
          this.iconChooser.destroy();
          this.iconChooser = null;
        }
        this.inherited(arguments);
      }
    });
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      baseClass: 'infographic-setting-multiple-indicators',
      templateString: '<div>' +
        '<div class="indicator-add-div" data-dojo-attach-point="addIndicator">' +
        '<div class="icon-add-indicator add-icon-deactive" data-dojo-attach-point="addIndicatorIcon"' +
        '></div><span data-dojo-attach-point="addIndicatorTip" class="text-left-center marginleft10">' +
        '${nls.addIndicatorTip}</span></div>' +
        '<div class="indicatorDiv" data-dojo-attach-point="indicatorDiv"></div>' +
        '</div>',
      nls: null,
      //config:
      // type:"",//gauge,number
      // indicators:[indicator.config]
      postCreate: function() {
        this.inherited(arguments);
        //preload imgs
        var imgs = ['setting/css/images/close.svg',
          'setting/css/images/close-mouseover.svg',
          'setting/css/images/indicator-on.svg',
          'setting/css/images/indicator-off.svg',
          'setting/css/images/add-icon-active.svg',
          'setting/css/images/add-icon-deactive.svg',
          'setting/css/images/arrow-drop-down.svg'
        ];
        jimuUtils.preloadImg(imgs, this.folderUrl);
        this._initEvent();
        this.setConfig(this.config);
      },
      _initEvent: function() {
        this.own(on(this.addIndicator, ['click', enterEvent, leaveEvent], lang.hitch(this, function(event) {
          var type = event.type;
          if (type === 'click') {
            this._createIndicator();
          } else if (type === 'mouseover') {
            html.addClass(this.addIndicatorIcon, 'add-icon-active');
            html.removeClass(this.addIndicatorIcon, 'add-icon-deactive');
            html.addClass(this.addIndicatorTip, 'add-indicator-tip-active');
            html.removeClass(this.addIndicatorTip, 'add-indicator-tip-deactive');
          } else if (type === 'mouseout') {
            html.removeClass(this.addIndicatorIcon, 'add-icon-active');
            html.addClass(this.addIndicatorIcon, 'add-icon-deactive');
            html.removeClass(this.addIndicatorTip, 'add-indicator-tip-active');
            html.addClass(this.addIndicatorTip, 'add-indicator-tip-deactive');
          }
        })));
      },
      constructor: function() {
        this.indecators = [];
      },
      setConfig: function(config) {
        this.config = config;
        if (!this.config) {
          return;
        }
        this._setIndicators();
      },
      getConfig: function() {
        var indicators = [];
        this.indecators.forEach(lang.hitch(this, function(indecator) {
          if (indecator) {
            var config = indecator.dijit.getConfig();
            if (jimuUtils.isNotEmptyObject(config)) {
              indicators.push(config);
            }
          }
        }));
        return indicators;
      },
      _setIndicators: function() {
        var indicators = this.config.indicators;
        if (indicators) {
          indicators.forEach(lang.hitch(this, function(indicatorConfig) {
            this._createIndicator(indicatorConfig);
          }));
        }
      },
      _onUpdate: function() {
        this.emit('change');
      },
      _updateIndicatorTopLineDisplay: function() {
        this.indecators.forEach(lang.hitch(this, function(indicator, index) {
          if (index === 0) {
            if (indicator && indicator.dijit) {
              indicator.dijit.switchTopLineDisplay(false);
            }
          }
        }));
      },
      _createIndicator: function(indicatorConfig) {
        var config = {
          type: this.type,
          nls: this.nls,
          folderUrl: this.folderUrl
        };

        if (indicatorConfig) {
          config.config = indicatorConfig;
        }
        var indicator = new SingleIndicator(config);
        indicator.placeAt(this.indicatorDiv);
        indicator.startup();
        var id = jimuUtils.getRandomString();
        this.own(on(indicator, 'remove', lang.hitch(this, function() {
          this.indecators = this.indecators.filter(function(e) {
            return e.id !== id;
          });
          indicator.destroy();
          indicator = null;
          this._updateIndicatorTopLineDisplay();
        })));
        this.own(on(indicator, 'change', lang.hitch(this, function() {
          this._onUpdate();
        })));
        this.indecators.push({
          id: id,
          dijit: indicator
        });
        this._updateIndicatorTopLineDisplay();
      },
      destroy: function() {
        if (this.indecators) {
          this.indecators.forEach(lang.hitch(this, function(indicator) {
            if (indicator && indicator.dijit) {
              indicator.dijit.destroy();
              indicator = null;
            }
          }));
        }
        this.inherited(arguments);
      }
    });
  });