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
    'dojo/on',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/text!./SeriesStyle.html',
    './_SeriesStyleItem',
    './_SeriesStyles',
    './CustomColor',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/utils',
    '../../../utils',
    'dijit/form/RadioButton'
  ],
  function(declare, on, lang, html, templateString, SeriesStyleItem, SeriesStyles, CustomColor, Evented,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, jimuUtils, utils) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-series-style',
      templateString: templateString,
      colors: ['#68D2E0', '#087E92', '#47BCF5', '#FBE66A', '#F29157', '#C8501D', '#2DB7C6', '#C4EEF6'],
      _customIconIsOpen: true,
      chartInfo: {},
      // public methods
      //   setFeatures, setLayerDefinition, setDataSource
      //   setConfig
      //   getConfig
      //   reset
      //   render(when chartDijitSetting's mode, clusterField, value fields is changed, rendering oneself)

      //options
      // map
      // chartInfo: {type,area}
      // definition
      // features
      // dataSource
      // other (for custom color)

      // render options for dom nodes display:
      //  symbolAbility:boolean
      //  customAbility:boolean
      //  oneLine: boolean
      //  colorSingleMode: boolean
      //  showOpacity: boolean
      //  numberType: boolean,

      //config
      // type: 'layerSymbol',// series, custom,
      // styles: [{
      //   name: '',
      //   style: {
      //     color: '',
      //     opacity: 0
      //   }
      // }],
      // customColor:{}

      //event
      //change
      postCreate: function() {
        this.inherited(arguments);
        this._initBrowserClass();
        this._initSelf();
        this._initEvent();
      },

      getConfig: function() {
        var config = {};
        var type;
        if (this.useLayerSymbolRadio.checked) {
          type = 'layerSymbol';
        } else if (this.seriesRadio.checked) {
          type = 'series';
        } else if (this.customColorRadio.checked) {
          type = 'custom';
        }
        config.type = type;

        if (this._option.oneLine) {
          if (this._option.symbolAbility || this._option.customAbility) {
            config.styles = [this.radioOneColor.getConfig()];
          } else {
            config.styles = [this.topOneColor.getConfig()];
          }
        } else {
          config.styles = this.fieldColorsDijit.getConfig();
        }
        if (type === 'custom') {
          config.customColor = this.customColorDijit.getConfig();
        }
        return config;
      },

      setConfig: function(config) {
        if (!config || !config.type) {
          return;
        }
        this._ignoreEvent();
        var type = config.type;
        this.useLayerSymbolRadio.setChecked(type === 'layerSymbol');
        this.seriesRadio.setChecked(type === 'series');
        this.customColorRadio.setChecked(type === 'custom');

        var styles = config.styles;
        if (!styles || styles.length <= 0) {
          this._careEvent();
          return;
        }
        if (styles.length === 1) {
          this.topOneColor.setConfig(styles[0]);
          this.radioOneColor.setConfig(styles[0]);
        } else if (styles.length >= 1) {
          this.fieldColorsDijit.updateConfig(styles);
        }
        var customColor = config.customColor;
        if (!customColor || !customColor.categories || !customColor.categories.length) {
          this._careEvent();
          return;
        }
        this.customColorDijit.setConfig(customColor);
        this._careEvent();
      },

      //features for calculate custom color
      setFeatures: function(features) {
        this.features = features;
      },

      setLayerDefinition: function(definition) {
        this.definition = definition;
      },

      setDataSource: function(dataSource) {
        this.dataSource = dataSource;
      },

      render: function(mode, clusterField, valueFields) {
        if (!mode) {
          return;
        }
        if (!clusterField && mode !== 'field') {
          return;
        }
        valueFields = valueFields || [];
        this._ignoreEvent();
        this.reset();
        var option = this._calcuteOption(mode, clusterField, valueFields);
        if (!option) {
          return;
        }
        this._updateNodeByOption(option);

        if (option.customAbility) {
          var ret = utils.getCustomColorSelects(clusterField, this.definition, this.features);
          if(!ret){
            return;
          }
          this.customColorDijit.setOriginalData(ret.selects, ret.isCodedValue, ret.numberType);
          this.customColorDijit.renderDefault();
        }

        var config = this._getDefaultConfig(mode, clusterField, valueFields, option);
        this.setConfig(config);
        this._careEvent();
      },

      reset: function() {
        this._ignoreEvent();
        this.seriesRadio.setChecked();
        this._hideSymbolRadio();
        this._hideCustomRadio();
        this._hideRadioPanel();
        this._hideOpacityPanel();
        this._hideAdditionalElements();
        this._careEvent();
      },

      _hideAdditionalElements: function() {
        this._hideHeaderColor();
        this._hideSeriesColor();
        this._hideCustomToggleIcon();
        this._hideCustomColors();
        this._hideFieldColors();
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

      _updateNodeByOption: function(option) {
        if (!option) {
          return;
        }
        var symbolAbility = option.symbolAbility;
        var customAbility = option.customAbility;
        var oneLine = option.oneLine;
        var colorSingleMode = option.colorSingleMode;
        var showOpacity = option.showOpacity;

        //show radio panel or not
        var nsrp = !symbolAbility && !customAbility;
        if (!nsrp) {
          this._showRadioPanel();
          html.addClass(this.fieldColors, 'indentation');
          if (oneLine) {
            this._showSeriesColor();
          } else {
            this._showFieldColors();
          }
        } else {
          html.removeClass(this.fieldColors, 'indentation');
          if (oneLine) {
            this._showHeaderColor();
          } else {
            this._showFieldColors();
          }
        }

        if (symbolAbility) {
          this._showSymbolRadio();
        }
        if (customAbility) {
          this._showCustomRadio();
        }
        if (colorSingleMode) {
          this._useColorSingleMode();
        } else {
          this._useColorMultipleMode();
        }
        if (showOpacity) {
          this._showOpacityPanel();
        }
      },

      _initSelf: function() {
        //top one color
        this.topOneColor = new SeriesStyleItem({
          textVisible: false,
          opacityVisible: false,
          colorSingleMode: true
        });
        this.topOneColor.placeAt(this.headerColorDiv);
        //radio one color
        this.radioOneColor = new SeriesStyleItem({
          textVisible: false,
          opacityVisible: false,
          colorSingleMode: true
        });
        this.radioOneColor.placeAt(this.radioColorDiv);

        this.fieldColorsDijit = new SeriesStyles({
          nls: this.nls
        });
        this.fieldColorsDijit.placeAt(this.fieldColors);
        /*custom color dijit*/
        this.customColorDijit = new CustomColor({
          nls: this.nls
        });
        this.customColorDijit.placeAt(this.customColors);
      },

      _initEvent: function() {
        this.own(on(this.topOneColor, 'change', lang.hitch(this, function() {
          this._onChange();
        })));

        this.own(on(this.radioOneColor, 'change', lang.hitch(this, function() {
          this._onChange();
        })));

        this.own(on(this.fieldColorsDijit, 'change', lang.hitch(this, function() {
          this._onChange();
        })));

        this.own(on(this.customColorDijit, 'change', lang.hitch(this, function() {
          this._onChange();
        })));
      },

      _initBrowserClass: function() {
        if (jimuUtils.has('ie') === 11) {
          html.addClass(this.domNode, 'ig-setting-ie11');
        } else {
          html.removeClass(this.domNode, 'ig-setting-ie11');
        }
        if (jimuUtils.has('ff')) {
          html.addClass(this.domNode, 'ig-setting-ff');
        } else {
          html.removeClass(this.domNode, 'ig-setting-ff');
        }
      },

      _ignoreEvent: function() {
        this.ignoreChangeEvents = true;
      },

      _careEvent: function() {
        setTimeout(function() {
          this.ignoreChangeEvents = false;
        }.bind(this), 200);
      },

      _updateSeriesRadioString: function(type) {
        if (type === 'pie') {
          this.seriesRadioLabel.innerHTML = this.nls.randomColor;
          this.seriesRadioLabel.title = this.nls.randomColor;
        } else {
          this.seriesRadioLabel.innerHTML = this.nls.setColor;
          this.seriesRadioLabel.title = this.nls.setColor;
        }
      },
      //show or hide color div
      _showHeaderColor: function() {
        html.removeClass(this.headerColorDiv, 'hide');
      },

      _hideHeaderColor: function() {
        html.addClass(this.headerColorDiv, 'hide');
      },

      _showSeriesColor: function() {
        html.removeClass(this.radioColorDiv, 'hide');
      },

      _hideSeriesColor: function() {
        html.addClass(this.radioColorDiv, 'hide');
      },
      //show or hide custom icon
      _showCustomToggleIcon: function() {
        html.removeClass(this.toggleIconDiv, 'hide');
      },

      _hideCustomToggleIcon: function() {
        html.addClass(this.toggleIconDiv, 'hide');
      },
      //show or hide radio button div
      _showSymbolRadio: function() {
        html.removeClass(this.symbolRadioPanel, 'hide');
      },

      _hideSymbolRadio: function() {
        html.addClass(this.symbolRadioPanel, 'hide');
      },

      _showCustomRadio: function() {
        html.removeClass(this.customRadioPanel, 'hide');
      },

      _hideCustomRadio: function() {
        html.addClass(this.customRadioPanel, 'hide');
        this._hideCustomColors();
      },
      // show or hide a panel
      _showCustomColors: function() {
        html.removeClass(this.customColors, 'hide');
      },

      _hideCustomColors: function() {
        html.addClass(this.customColors, 'hide');
      },

      _showFieldColors: function() {
        html.removeClass(this.fieldColors, 'hide');
      },

      _hideFieldColors: function() {
        html.addClass(this.fieldColors, 'hide');
      },

      _showRadioPanel: function() {
        html.removeClass(this.radioPanel, 'hide');
      },

      _hideRadioPanel: function() {
        html.addClass(this.radioPanel, 'hide');
        this._hideCustomColors();
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

      _openCustomColorPanel: function() {
        html.removeClass(this.toggleIcon, 'closed');
        this._showCustomColors();
      },

      _closeCustomColorPanel: function() {
        html.addClass(this.toggleIcon, 'closed');
        this._hideCustomColors();
      },
      //end

      _useColorSingleMode: function() {
        this.topOneColor.setColorMode(true);
        this.radioOneColor.setColorMode(true);
      },

      _useColorMultipleMode: function() {
        this.topOneColor.setColorMode(false);
        this.radioOneColor.setColorMode(false);
      },

      //changes
      _onRadioChanged: function() {
        var series = this.seriesRadio.checked;
        var customColor = this.customColorRadio.checked;
        this._hideAdditionalElements();
        var op = this._option || {};
        var nsrp = !op.symbolAbility && !op.customAbility;
        if (series) {
          if (nsrp) {
            if (op.oneLine) {
              this._showHeaderColor();
            } else {
              this._showFieldColors();
            }
          } else {
            if (op.oneLine) {
              this._showSeriesColor();
            } else {
              this._showFieldColors();
            }
          }
        }
        if (customColor) {
          this._showCustomColors();
          this._showCustomToggleIcon();
        }
        this._onChange();
      },

      _onCustomToggleButtonClicked: function(e) {
        e.stopPropagation();
        this._customIconIsOpen = !this._customIconIsOpen;
        if (this._customIconIsOpen) {
          this._openCustomColorPanel();
        } else {
          this._closeCustomColorPanel();
        }
      },

      //self driver
      _calcuteOption: function(mode, clusterField, valueFields) {
        var type = this.chartInfo.type;
        var area = this.chartInfo.area;
        var definition = this.definition;
        var dataSource = this.dataSource;
        if (!type || !definition) {
          return;
        }
        var symbolAbility = this._haveUseLayerSymbolAbility(mode, clusterField, definition, dataSource);
        var customAbility = type === 'pie' && (mode === 'category' || mode === 'count') &&
          !utils.isDateField(clusterField, definition);
        var showOpacity = !!area;
        var oneLine = (mode === 'field' && type === 'line') || mode === 'count' || valueFields.length <= 1;
        var colorSingleMode = !(type === 'pie' && mode !== 'field');
        var isNumberType = clusterField ? utils.isNumberType(clusterField, definition, true) : false;
        var option = {
          symbolAbility: symbolAbility,
          oneLine: oneLine,
          colorSingleMode: colorSingleMode,
          showOpacity: showOpacity,
          customAbility: customAbility,
          numberType: !!isNumberType
        };
        this._option = option;
        return option;
      },

      _haveUseLayerSymbolAbility: function(mode, clusterField, definition, dataSource) {
        var type = this.chartInfo.type;
        if (!type || !definition) {
          return;
        }
        var have = false;
        if (type === 'line' || mode === 'field') {
          return have;
        }
        var layerId = utils.getLayerIdByDataSource(dataSource);
        var featureLayer = null;
        //feature layer
        if (layerId) {
          featureLayer = utils.getLayerFromMap(layerId, this.map);
        }

        if (!layerId) {
          return have;
        }

        if (mode === 'feature') {
          have = true;
        } else if (mode === 'category' || mode === 'count') {
          if (!featureLayer) {
            return have;
          }
          if (featureLayer.renderer) {
            var renderer = featureLayer.renderer;
            if (renderer.declaredClass === 'esri.renderer.ClassBreaksRenderer' ||
              renderer.declaredClass === 'esri.renderer.UniqueValueRenderer') {
              if (renderer.attributeField === clusterField && !utils.isDateField(clusterField, definition)) {
                have = true;
              }
            }
          }
        }
        return have;
      },

      _getDefaultConfig: function(mode, clusterField, valueFields, option) {
        var type = this.chartInfo.type;
        var definition = this.definition;

        var colorSingleMode = option.colorSingleMode;
        var showOpacity = option.showOpacity;

        if (!clusterField || (mode !== 'count' && !valueFields)) {
          return {
            type: 'series',
            styles: []
          };
        }
        var keys = null;
        //special keys
        if (type === 'column' || type === 'bar' || type === 'line') {
          if (mode === 'field') {
            if (type === 'line') {
              keys = ['line~field'];
            }
          } else if (mode === 'count') {
            keys = ['count~count'];
          }
        } else if (type === 'pie') {
          if (mode !== 'field') {
            keys = ['pie~not-field'];
          }
        }
        keys = keys || valueFields;
        var styles = keys.map(function(key) {
          return this._createSeriesStyle(key, showOpacity, !colorSingleMode);
        }.bind(this));

        styles.forEach(function(style) {
          if (valueFields && valueFields.indexOf(style.name) > -1) {
            style.label = utils.getFieldAlias(style.name, definition);
          } else {
            style.label = style.name;
          }
        }.bind(this));

        var seriesStyle = {
          type: 'series',
          styles: styles
        };
        return seriesStyle;
      },

      _createSeriesStyle: function(key, showOpacity, colorAsArray) {
        var color = utils.getNextColor(this.colors, this._lastSeriesColor);
        this._lastSeriesColor = color;
        var style = {
          name: key,
          style: {
            color: color
          }
        };
        if (showOpacity) {
          style.style.opacity = 6;
        }
        if (colorAsArray) {
          style.style.color = ['#68D2E0', '#087E92', '#47BCF5', '#FBE66A', '#F29157', '#C8501D'];
        }
        return style;
      }

    });
  });