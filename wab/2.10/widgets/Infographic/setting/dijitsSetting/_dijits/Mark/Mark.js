define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dojo/Evented',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./Mark.html',
    'dojo/on',
    'dojo/_base/html',
    './MarkLine',
    './MarkArea',
    'jimu/utils',
    "dijit/form/Select",
    "jimu/dijit/CheckBox"
  ],
  function(declare, _WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin, template,
    on, html, MarkLine, MarkArea, jimuUtils) {

    return declare([_WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin], {
      baseClass: 'infographic-setting-mark',
      templateString: template,
      nls: null,
      closed: false,
      // option
      // type
      constructor: function() {
        this.uniqueID = jimuUtils.getRandomString();
      },

      postCreate: function() {
        this.inherited(arguments);
        this._createMark(this.type, this.config);
        this._updateTitleByConfig(this.config);
      },

      getConfig: function() {
        if (this.mark) {
          return this.mark.getConfig();
        }
      },

      setConfig: function(config) {
        if (this.mark) {
          this.mark.setConfig(config);
        }
      },

      _onChange: function() {
        this.emit('change');
      },

      _createMark: function(type, cf) {
        if (type === 'line') {
          this.mark = new MarkLine({
            chartType: this.chartType,
            nls: this.nls,
            config: cf,
            folderUrl: this.folderUrl,
            defaultColor: this.defaultColor
          });
        } else if (type === 'area') {
          this.mark = new MarkArea({
            chartType: this.chartType,
            nls: this.nls,
            config: cf,
            folderUrl: this.folderUrl,
            defaultColor: this.defaultColor
          });
        }
        if (!this.mark) {
          return;
        }
        this.own(on(this.mark, 'value-change', function(value) {
          this._updateTitleByValue(value);
        }.bind(this)));
        this.own(on(this.mark, 'change', function() {
          this._onChange();
        }.bind(this)));
        this.mark.placeAt(this.content);
        if (this.closed) {
          this.closeContent();
        }
      },

      _onArrowClicked: function() {
        if (!html.hasClass(this.header, 'close')) {
          this.closeContent();
        } else {
          this._openContent();
        }
      },

      _onDeleteClicked: function() {
        if (this.mark) {
          this.mark.destroy();
          this.mark = null;
        }
        this.destroy();
        this.emit('deleted', this.uniqueID);
      },

      closeContent: function() {
        this.closed = true;
        html.addClass(this.header, 'close');
        html.removeClass(this.arrow, 'arrow-up');
        html.addClass(this.arrow, 'arrow-down');
        html.addClass(this.content, 'hide');
      },

      _openContent: function() {
        this.closed = false;
        html.removeClass(this.header, 'close');
        html.addClass(this.arrow, 'arrow-up');
        html.removeClass(this.arrow, 'arrow-down');
        html.removeClass(this.content, 'hide');
      },

      _updateTitleByConfig: function(cf) {
        var suffix = this._getSuffixFormConfig(cf);
        this._updateTitle(suffix);
      },

      _updateTitle: function(suffix) {
        var title = this.type === 'line' ? this.nls.line : this.nls.area;
        if (typeof suffix !== 'undefined') {
          title += ' ';
          title += suffix;
        }
        this.title.innerHTML = title;
        this.title.title = title;
      },

      _updateTitleByValue: function(value) {
        var suffix = '';
        if (Array.isArray(value) && value.length === 2) {
          suffix = value[0] + ' ~ ' + value[1];
        } else if (typeof value !== 'undefined') {
          suffix += value;
        }
        this._updateTitle(suffix);
      },

      _getSuffixFormConfig: function(cf) {
        if (!cf) {
          return;
        }
        var axis = this.chartType !== 'bar' ? 'yAxis' : 'xAxis';
        var value;
        if (this.type === 'line') {
          value = cf[axis];
        } else if (this.type === 'area') {
          value = this._getAreaSuffixFormConfig(cf, axis);
        }
        return value;
      },

      _getAreaSuffixFormConfig: function(cf, axis) {
        if (!cf || !cf.length) {
          return;
        }
        var v1 = cf[0][axis];
        var v2 = cf[1][axis];

        if (v1 !== undefined && v2 !== undefined) {
          return v1 + ' ~ ' + v2;
        }
      }

    });
  });