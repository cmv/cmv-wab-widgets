define([
    'dojo/_base/declare',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/text!./SeriesStyle.html',
    './_SeriesStyleItem',
    './_SeriesStyles',
    'jimu/utils',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/RadioButton'
  ],
  function(declare, on, lang, html, templateString, SeriesStyleItem, SeriesStyles, jimuUtils, Evented,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-series-style',
      templateString: templateString,
      //option
      //nls

      // public methods
      // updateComputed
      // setConfig
      // getConfig

      // modle.computed: {
      //   singleColor: false,
      //   colorMode: 'single',
      //   showOpacity: false,
      //   fieldColors: false,
      //   radioPanel: {
      //     singleColor: false,
      //     fieldColors: false
      //   },
      // },

      //modle.config
      // useLayerSymbology: boolean,
      // styles: [{
      //   name: '',
      //   style: {
      //     color: '',
      //     opacity: 0
      //   }
      // }]

      //event
      //change

      constructor: function() {
        this.inherited(arguments);
        this.PRE_MODLE = {
          computed: {},
          config: {}
        };
      },

      postCreate: function() {
        this.inherited(arguments);
        this._initDom();
        this._initEvent();
        this._render();
      },

      updateComputed: function(computed) {
        if (!computed) {
          return;
        }
        this.PRE_MODLE = lang.clone(this.modle);
        this.modle.computed = lang.clone(computed);
        this._render();
      },

      setConfig: function(config) {
        this.modle.config = lang.clone(config);
        this._render();
      },

      getConfig: function() {
        return lang.clone(this.modle.config);
      },

      _render: function() {
        if (!this.modle) {
          return;
        }
        this.ignoreChangeEvents = true;
        this._renderByComputed(this.modle);
        this._renderByConfig(this.modle);
        this.ignoreChangeEvents = false;
        this._onChange();
      },

      _onChange: function() {
        if (this.ignoreChangeEvents) {
          return;
        }
        var config = this.getConfig();
        if (config) {
          this.emit('change', config);
        }
      },

      _renderByComputed: function(modle) {
        var preComputed = this.PRE_MODLE.computed;
        var computed = modle.computed;
        if (this._isEqual(preComputed, computed)) {
          return;
        }
        //show radio panel
        if (!this._isEqual(computed.radioPanel, preComputed.radioPanel)) {
          if (computed.radioPanel) {
            this._showRadioPanel();
          } else {
            this._hideRadioPanel();
          }
        }
        //show opacity
        // if (!this._isEqual(computed.showOpacity, preComputed.showOpacity)) {
        if (computed.showOpacity) {
          this._showOpacityPanel();
        } else {
          this._hideOpacityPanel();
        }
        // }

        //color as single mode
        if (!this._isEqual(computed.colorSingleMode, preComputed.colorSingleMode)) {
          if (computed.colorSingleMode) {
            this._useColorSingleMode();
          } else {
            this._useColorMultipleMode();
          }
        }
        //don't has radio panel
        if (!this._isEqual(computed.radioPanel, preComputed.radioPanel) &&
          computed.radioPanel) {
          //singleColor
          this._hideSingleColor(false);
          //field colors
          html.addClass(this.fieldColors, 'indentation');

          var radioPanel = computed.radioPanel;

          if (radioPanel.singleColor) {
            this._showSingleColor(true);
          } else {
            this._hideSingleColor(true);
          }
          //TODO field colors
        } else {
          //singleColor
          this._hideSingleColor(true);
          html.removeClass(this.fieldColors, 'indentation');

          if (!this._isEqual(computed.singleColor, preComputed.singleColor)) {
            if (computed.singleColor) {
              this._showSingleColor(false);
            } else {
              this._hideSingleColor(false);
            }
            if (computed.fieldColors) {
              this._showFieldColors();
            } else {
              this._hideFieldColors();
            }
          }
        }
      },

      _renderByConfig: function(modle) {
        var config = modle.config;
        var computed = modle.computed;
        var tryShowRadioFieldColors = false;

        if (computed.radioPanel) {
          this._hideFieldColors();
          if (computed.radioPanel.fieldColors) {
            tryShowRadioFieldColors = true;
          }
        }

        var preConfig = this.PRE_MODLE.config;
        if (this._isEqual(config, preConfig)) {
          return;
        }
        //use layer symbol
        if (!config.useLayerSymbology) {
          if (tryShowRadioFieldColors) {
            this._showFieldColors();
          } else {
            this._showSingleColor(true);
          }
        } else {
          this._hideFieldColors();
          this._hideSingleColor(true);
        }
        if (!this._isEqual(config.useLayerSymbology, preConfig.useLayerSymbology)) {
          if (config.useLayerSymbology) {
            this.useLayerSymbolRadio.setChecked(true);
            this.setColorRadio.setChecked(false);
          } else {
            this.useLayerSymbolRadio.setChecked(false);
            this.setColorRadio.setChecked(true);
          }
        }
        //styles
        if (!this._isEqual(config.styles, preConfig.styles)) {
          var styles = config.styles;
          if (!styles || styles.length <= 0) {
            return;
          }
          if (styles.length === 1) {
            if (computed.radioPanel) {
              this.topOneColor.setConfig(styles[0]);
              this.radioOneColor.setConfig(styles[0]);
            } else {
              this.topOneColor.setConfig(styles[0]);
              this.radioOneColor.setConfig(styles[0]);
            }
          } else if (styles.length >= 1) {
            this.fieldColorsDijit.updateConfig(styles);
          }
        }
      },

      _initDom: function() {
        //top one color
        this.topOneColor = new SeriesStyleItem({
          option: {
            showText: false,
            opacity: {
              min: 0,
              max: 10,
              step: 1
            }
          }
        });
        this.topOneColor.placeAt(this.singleColorDiv);
        //top one color
        this.radioOneColor = new SeriesStyleItem({
          option: {
            showText: false,
            opacity: {
              min: 0,
              max: 10,
              step: 1
            }
          }
        });
        this.radioOneColor.placeAt(this.radioSingleColorDiv);

        this.fieldColorsDijit = new SeriesStyles({
          nls: this.nls
        });
        this.fieldColorsDijit.placeAt(this.fieldColors);

        this._hideRadioPanel();
        this._hideOpacityPanel();
        this._hideSingleColor(true);
        this._hideSingleColor(false);
        this._hideFieldColors();
        //TODO
      },

      _initEvent: function() {
        this.own(on(this.topOneColor, 'change', lang.hitch(this, function(colorConfig) {
          this._onTopOneColorChange(colorConfig);
        })));

        this.own(on(this.radioOneColor, 'change', lang.hitch(this, function(colorConfig) {
          this._onRadioOneColorChange(colorConfig);
        })));

        this.own(on(this.fieldColorsDijit, 'change', lang.hitch(this, function(colorConfig) {
          this._onFieldColorsDijitChange(colorConfig);
        })));
      },

      _showSingleColor: function(inRadioPanel) {
        if (inRadioPanel) {
          html.removeClass(this.radioSingleColorDiv, 'hide');
        } else {
          html.removeClass(this.singleColorDiv, 'hide');
        }

      },

      _hideSingleColor: function(inRadioPanel) {
        if (inRadioPanel) {
          html.addClass(this.radioSingleColorDiv, 'hide');
        } else {
          html.addClass(this.singleColorDiv, 'hide');
        }
      },

      _showFieldColors: function() {
        html.removeClass(this.fieldColors, 'hide');
      },

      _hideFieldColors: function() {
        html.addClass(this.fieldColors, 'hide');
      },

      _useColorSingleMode: function() {
        this.topOneColor.setColorMode(true);
        this.radioOneColor.setColorMode(true);
      },

      _useColorMultipleMode: function() {
        this.topOneColor.setColorMode(false);
        this.radioOneColor.setColorMode(false);
      },

      _showRadioPanel: function() {
        html.removeClass(this.radioPanel, 'hide');
      },

      _hideRadioPanel: function() {
        html.addClass(this.radioPanel, 'hide');
      },

      _showOpacityPanel: function() {
        this.topOneColor.setOpacityDisplay(true);
        this.radioOneColor.setOpacityDisplay(true);
        this.fieldColorsDijit.setOpacityDisplay(true);
      },

      _hideOpacityPanel: function() {
        this.topOneColor.setOpacityDisplay(false);
        this.radioOneColor.setOpacityDisplay(false);
        this.fieldColorsDijit.setOpacityDisplay(false);
      },

      _isEqual: function(v1, v2) {
        if (typeof v1 !== typeof v2) {
          return false;
        }
        if (typeof v1 !== 'object') {
          return v1 === v2;
        } else {
          return jimuUtils.isEqual(v1, v2);
        }
      },

      _onTopOneColorChange: function(colorConfig) {
        if (this.ignoreChangeEvents) {
          return;
        }
        this.PRE_MODLE = lang.clone(this.modle);
        this.modle.config.styles[0] = colorConfig;
        this._onChange();
      },

      _onRadioOneColorChange: function(colorConfig) {
        if (this.ignoreChangeEvents) {
          return;
        }
        this.PRE_MODLE = lang.clone(this.modle);
        this.modle.config.styles[0] = colorConfig;
        this._onChange();
      },

      _onFieldColorsDijitChange: function(colorConfigArray) {
        if (this.ignoreChangeEvents) {
          return;
        }
        this.PRE_MODLE = lang.clone(this.modle);
        this.modle.config.styles = colorConfigArray;
        this._onChange();
      },

      _onUseLayerSymbolChange: function(check) {
        if (this.ignoreChangeEvents) {
          return;
        }
        this.PRE_MODLE = lang.clone(this.modle);
        this.modle.config.useLayerSymbology = check;
        this._onChange();
      }

    });
  });