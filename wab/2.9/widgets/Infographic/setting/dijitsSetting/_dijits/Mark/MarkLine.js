define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dojo/Evented',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./MarkLine.html',
    'dojo/on',
    'dojo/_base/html',
    'dojo/_base/lang',
    '../VisibleSliderBar',
    './DashTypeSelect',
    'dijit/form/TextBox',
    'dijit/form/NumberTextBox'
  ],
  function(declare, _WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin, template,
    on, html, lang, VisibleSliderBar) {

    return declare([_WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin], {
      baseClass: 'infographic-setting-mark-line',
      templateString: template,
      nls: null,
      _defaultLineColor: '#68D2E0',
      _defaultLineWidth: 1,
      // config
      // name:'',
      // x/yAxis:number
      // label:{
      //   color:'',
      //   position:'start'//'middle','end'
      // },
      // lineStyle:{
      //   color:'',
      //   width:number,
      //   type:'solid','dashed','dotted'
      // },

      postCreate: function() {
        this.inherited(arguments);
        this.ignoreEvent = true;
        this._initDom();
        setTimeout(function() {
          this.ignoreEvent = false;
        }.bind(this), 200);
        this.setConfig(this.config);

      },

      _initDom: function() {
        this.lineWidthSlider = new VisibleSliderBar({
          min: 1,
          max: 10,
          step: 1,
          value: 1
        });
        this.own(on(this.lineWidthSlider, 'change', lang.hitch(this, this._onChange)));
        this.lineWidthSlider.placeAt(this.lineWidthSliderDiv);
        this._cleanUI();
      },

      isValid: function() {
        return this.valueInput.isValid();
      },

      _cleanUI: function() {
        this.valueInput.set('value', '');
        this.labelInput.set('value', '');
        this.labelColor.setSingleColor(this.defaultColor);
        this._selectPosition('end');
        this.lineColor.setSingleColor(this._defaultLineColor);
        this.lineWidthSlider.setValue(this._defaultLineWidth);
        this.dashType.setValue('solid');
      },

      setConfig: function(config) {
        if (!config) {
          return;
        }
        this.ignoreEvent = true;
        this._cleanUI();
        var value = this.chartType === 'bar' ? config.xAxis : config.yAxis;
        var label = config.name;
        var labelColor = config.label && config.label.color;
        var position = config.label && config.label.position;
        var lineColor = config.lineStyle && config.lineStyle.color;
        var lineWidth = config.lineStyle && config.lineStyle.width;
        var dashType = config.lineStyle && config.lineStyle.type;

        if (typeof value !== 'undefined') {
          this.valueInput.set('value', value);
        }
        if (typeof label !== 'undefined') {
          this.labelInput.set('value', label);
        }
        if (typeof labelColor !== 'undefined') {
          this.labelColor.setSingleColor(labelColor);
        }
        if (typeof position !== 'undefined') {
          this._selectPosition(position);
        }
        if (typeof lineColor !== 'undefined') {
          this.lineColor.setSingleColor(lineColor);
        }
        if (typeof lineWidth !== 'undefined') {
          this.lineWidthSlider.setValue(lineWidth);
        }
        if (typeof dashType !== 'undefined') {
          this.dashType.setValue(dashType);
        }
        setTimeout(function() {
          this.ignoreEvent = false;
        }.bind(this), 200);
      },

      _showInputError: function() {
        var error = this.valueInput.getErrorMessage();
        this.valueInput.displayMessage(error);
      },

      getConfig: function() {
        if (!this.isValid()) {
          this._showInputError();
          return false;
        }
        var config = {};
        var value = this.valueInput.get('value');
        value = Number(value);
        var label = this.labelInput.get('value');
        var labelColor = this.labelColor.getSingleColor();
        var position = this._getPosition();
        var lineColor = this.lineColor.getSingleColor();
        var lineWidth = this.lineWidthSlider.getValue();
        var dashType = this.dashType.getValue();
        //config.x/yAxis
        if (this.chartType === 'bar') {
          config.xAxis = value;
        } else {
          config.yAxis = value;
        }

        config.name = label;
        // config.label
        var labelOption = {
          show: !!label
        };
        labelOption.position = position;
        labelOption.color = labelColor;
        config.label = labelOption;
        // config.lineStyle
        var lineStyle = {
          color: lineColor,
          width: lineWidth,
          type: dashType
        };
        config.lineStyle = lineStyle;
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

      _onValueChanged: function(value) {
        if (this.ignoreEvent) {
          return;
        }
        if (!this.isValid()) {
          return;
        }
        this.emit('value-change', value);
        this._onChange();
      },

      _selectPosition: function(position) {
        html.removeClass(this.posStart, 'selected');
        html.removeClass(this.posMiddle, 'selected');
        html.removeClass(this.posEnd, 'selected');
        if (position === 'start') {
          html.addClass(this.posStart, 'selected');
        } else if (position === 'middle') {
          html.addClass(this.posMiddle, 'selected');
        } else if (position === 'end') {
          html.addClass(this.posEnd, 'selected');
        }
        this._onChange();
      },

      _getPosition: function() {
        if (html.hasClass(this.posStart, 'selected')) {
          return 'start';
        } else if (html.hasClass(this.posMiddle, 'selected')) {
          return 'middle';
        } else if (html.hasClass(this.posEnd, 'selected')) {
          return 'end';
        }
      },

      _onPosStartClicked: function(e) {
        e.stopPropagation();
        this._selectPosition('start');
      },

      _onPosMiddleClicked: function(e) {
        e.stopPropagation();
        this._selectPosition('middle');
      },

      _onPosEndClicked: function(e) {
        e.stopPropagation();
        this._selectPosition('end');
      }

    });
  });