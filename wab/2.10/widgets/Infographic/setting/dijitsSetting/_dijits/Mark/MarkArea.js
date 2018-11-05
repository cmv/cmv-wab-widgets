define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dojo/Evented',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./MarkArea.html',
    'dijit/form/HorizontalSlider',
    'dojo/on',
    'dojo/_base/html',
    'dojo/_base/lang',
    '../../../utils',
    'dijit/form/Select',
    'jimu/dijit/CheckBox',
    'dijit/form/TextBox',
    'dijit/form/NumberTextBox'
  ],
  function(declare, _WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin, template,
    HorizontalSlider, on, html, lang, utils) {

    return declare([_WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin], {
      baseClass: 'infographic-setting-mark-area',
      templateString: template,
      _defaultAreaColor: '#68D2E0',
      _defaultOpacity: 0.4,
      // config
      // [{
      //   name: '',
      //   label: {
      //   color:'',
      //     position: 'in/out','left/'top / bottom / right '
      //   },
      //   itemStyle: {
      //     color: '',
      //     opacity: '0-1'
      //   },
      //   x/yAxis: number
      // }, {
      //   x/yAxis: number
      // }]

      postCreate: function() {
        this.inherited(arguments);
        this.ignoreEvent = true;
        this._initDom();
        setTimeout(function() {
          this.ignoreEvent = false;
        }.bind(this), 200);
        this.setConfig(this.config);
      },

      isValid: function() {
        return this.valInput1.isValid() && this.valInput2.isValid();
      },

      _showInputError: function() {
        var error1 = this.valInput1.getErrorMessage();
        this.valInput1.displayMessage(error1);
        var error2 = this.valInput2.getErrorMessage();
        this.valInput2.displayMessage(error2);
      },

      getConfig: function() {
        if (!this.isValid()) {
          this._showInputError();
          return false;
        }
        var config = [{}, {}];
        var value = this._getValue();
        var label = this.labelInput.get('value');
        var labelColor = this.labelColor.getSingleColor();
        var pos = this.posSelect.get('value');
        var loc = this._getSelectedLoaction();
        var areaColor = this.areaColor.getSingleColor();
        var areaOpacity = this.opacitySlider.get('value');
        areaOpacity = areaOpacity.toFixed(1);
        areaOpacity = 1 - areaOpacity;
        var axis = this.chartType === 'bar' ? 'xAxis' : "yAxis";

        config[1][axis] = value[1];
        config[0][axis] = value[0];
        config[0].name = label;
        // config.label
        var labelOption = {
          show: !!label
        };
        labelOption.position = this._splicingPosition(loc, pos);
        labelOption.color = labelColor;
        config[0].label = labelOption;
        // config.lineStyle
        var itemStyle = {
          color: areaColor,
          opacity: areaOpacity
        };
        config[0].itemStyle = itemStyle;
        return config;
      },

      _onChange: function() {
        if (this.ignoreEvent) {
          return;
        }
        if (!this.isValid()) {
          this._showInputError();
          return false;
        }
        this.emit('change');
      },

      _onValueChanged: function() {
        if (this.ignoreEvent) {
          return;
        }
        var value = this._getValue();
        if (value) {
          this.emit('value-change', value);
          this._onChange();
        }
      },

      _firstUpperCase: function(str) {
        if (typeof str !== 'string') {
          return str;
        }
        return str.replace(/^\S/, function(s) {
          return s.toUpperCase();
        });
      },

      _splicingPosition: function(loc, pos) {
        var position;
        if (loc === 'inside') {
          pos = this._firstUpperCase(pos);
          position = loc + pos;
        } else {
          position = pos;
        }
        return position;
      },

      _getValue: function() {
        if (!this.isValid()) {
          return;
        }
        var v1 = this.valInput1.get('value');
        v1 = Number(v1);
        var v2 = this.valInput2.get('value');
        v2 = Number(v2);
        var value = [v1, v2];
        value.sort(function(a, b) {
          return a - b;
        });
        return value;
      },

      setConfig: function(config) {
        if (!config || !config.length) {
          return;
        }
        this.ignoreEvent = true;
        this._cleanUI();
        var cf1 = config[0];
        var cf2 = config[1];
        if (!cf1 || !cf2) {
          return;
        }
        var axis = this.chartType === 'bar' ? 'xAxis' : "yAxis";
        var v1 = cf1[axis];
        var v2 = cf2[axis];
        var label = cf1.name;
        var labelColor = cf1.label && cf1.label.color;

        var position = cf1.label && cf1.label.position;
        var posObj = this._splitPositionAttr(position);
        var pos = posObj.pos;
        var loc = posObj.loc;

        var areaColor = cf1.itemStyle && cf1.itemStyle.color;
        var areaOpacity = cf1.itemStyle && cf1.itemStyle.opacity;
        areaOpacity = 1 - areaOpacity;
        if (typeof v1 !== 'undefined') {
          this.valInput1.set('value', v1);
        }
        if (typeof v2 !== 'undefined') {
          this.valInput2.set('value', v2);
        }
        if (typeof label !== 'undefined') {
          this.labelInput.set('value', label);
        }
        if (typeof labelColor !== 'undefined') {
          this.labelColor.setSingleColor(labelColor);
        }
        if (typeof pos !== 'undefined') {
          utils.updateOptions(this.posSelect, null, pos);
        }
        if (typeof loc !== 'undefined') {
          this._selectLocation(loc);
        }
        if (typeof areaColor !== 'undefined') {
          this.areaColor.setSingleColor(areaColor);
        }
        if (typeof areaOpacity !== 'undefined') {
          this.opacitySlider.set('value', areaOpacity);
        }
        setTimeout(function() {
          this.ignoreEvent = false;
        }.bind(this), 200);
      },

      _splitPositionAttr: function(position) {
        if (!position) {
          return {};
        }
        var pos, loc;
        if (position.indexOf('inside') > -1) {
          loc = 'inside';
          pos = position.replace('inside', '');
          pos = pos.toLowerCase();
        } else {
          loc = 'outside';
          pos = position;
        }
        return {
          pos: pos,
          loc: loc
        };
      },

      _initDom: function() {
        this.opacitySlider = new HorizontalSlider({
          name: "slider",
          value: 0,
          minimum: 0,
          maximum: 1,
          discreteValues: 10,
          intermediateChanges: false,
          showButtons: false,
          style: "margin: auto 0;"
        });
        this.own(on(this.opacitySlider, 'change', lang.hitch(this, this._onChange)));
        this.opacitySlider.placeAt(this.opacityDiv);
        this._cleanUI();
      },

      _cleanUI: function() {
        this.valInput1.set('value', '');
        this.valInput2.set('value', '');
        this.labelInput.set('value', '');
        this.labelColor.setSingleColor(this.defaultColor);
        utils.updateOptions(this.posSelect, null, 'top');
        this._selectLocation('inside');
        this.areaColor.setSingleColor(this._defaultAreaColor);
        this.opacitySlider.set('value', this._defaultOpacity);
      },

      _unselectlocBtns: function() {
        html.removeClass(this.insideBtn, 'selected');
        html.removeClass(this.outsideBtn, 'selected');
      },

      _getSelectedLoaction: function() {
        if (html.hasClass(this.insideBtn, 'selected')) {
          return 'inside';
        } else {
          return 'outside';
        }
      },

      _selectLocation: function(loc) {
        this._unselectlocBtns();
        //loc: inside outside
        if (loc === 'inside') {
          html.addClass(this.insideBtn, 'selected');
        } else if (loc === 'outside') {
          html.addClass(this.outsideBtn, 'selected');
        }
        this._onChange();
      },

      _oninsideClicked: function(e) {
        e.stopPropagation();
        this._selectLocation('inside');
      },

      _onoutsideClicked: function(e) {
        e.stopPropagation();
        this._selectLocation('outside');
      }

    });
  });