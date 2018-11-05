define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dojo/Evented',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./Marks.html',
    './Mark',
    'dojo/on',
    'dojo/_base/lang',
    "dijit/form/Select",
    "jimu/dijit/CheckBox"
  ],
  function(declare, _WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin, template,
    Mark, on, lang) {

    return declare([_WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin], {
      baseClass: 'infographic-setting-marks',
      templateString: template,
      nls: null,
      // config
      // markLine
      // markArea
      constructor: function() {
        this.inherited(arguments);
        this.marklines = [];
        this.markareas = [];
      },

      postCreate: function() {
        this.inherited(arguments);
        this.setConfig(this.config);
      },

      clearMarks: function() {
        this.marklines.forEach(function(item) {
          item.dijit.destroy();
        });
        this.markareas.forEach(function(item) {
          item.dijit.destroy();
        });
        this.marklines = [];
        this.markareas = [];
      },

      getConfig: function() {
        var markLine = this._getMarkLineConfig();
        var markArea = this._getMarkAreaConfig();
        var config = {};
        if (markLine) {
          config.markLine = markLine;
        }
        if (markArea) {
          config.markArea = markArea;
        }
        return config;
      },

      _getMarkLineConfig: function() {
        if (!this.marklines.length) {
          return;
        }
        var data = this.marklines.map(function(ml) {
          return ml.dijit.getConfig();
        });
        data = data.filter(function(item) {
          return item !== false;
        });
        if (!data.length) {
          return;
        }
        return {
          silent: true,
          symbol: ['', ''],
          data: data
        };
      },

      _getMarkAreaConfig: function() {
        if (!this.markareas.length) {
          return;
        }
        var data = this.markareas.map(function(ml) {
          return ml.dijit.getConfig();
        });
        data = data.filter(function(item) {
          return item !== false;
        });
        if (!data.length) {
          return;
        }

        return {
          silent: true,
          data: data
        };
      },

      setConfig: function(config) {
        if (!config) {
          return;
        }
        this.clearMarks();
        var markLine = config.markLine;
        var markArea = config.markArea;
        this._setMarkLineConfig(markLine);
        this._setMarkAreaConfig(markArea);
      },

      _setMarkLineConfig: function(markLine) {
        if (!markLine || !markLine.data || !markLine.data.length) {
          return;
        }
        markLine.data.forEach(function(item) {
          this._createMarkLine(item, true);
        }.bind(this));
      },

      _setMarkAreaConfig: function(markArea) {
        if (!markArea || !markArea.data || !markArea.data.length) {
          return;
        }
        markArea.data.forEach(function(item) {
          this._createMarkArea(item, true);
        }.bind(this));
      },

      _createMarkLine: function(config, closed) {
        var mark = this._createMark('line', config, closed);
        var uniqueID = mark.uniqueID;
        this.marklines.push({
          uniqueID: uniqueID,
          dijit: mark
        });
        this.own(on(mark, 'deleted', function(uniqueID) {
          this._onMarkDeleted('line', uniqueID);
        }.bind(this)));
      },

      _createMarkArea: function(config, closed) {
        var mark = this._createMark('area', config, closed);
        var uniqueID = mark.uniqueID;
        this.markareas.push({
          uniqueID: uniqueID,
          dijit: mark
        });
        this.own(on(mark, 'deleted', function(uniqueID) {
          this._onMarkDeleted('area', uniqueID);
        }.bind(this)));
      },

      _onAddMarkLineClicked: function(e) {
        e.stopPropagation();
        this._collapeAllMark();
        this._createMarkLine();
      },

      _onAddMarkAreaClicked: function(e) {
        e.stopPropagation();
        this._collapeAllMark();
        this._createMarkArea();
      },

      _createMark: function(type, config, closed) {
        var mark = new Mark({
          closed: closed,
          chartType: this.chartType,
          type: type,
          config: config,
          nls: this.nls,
          folderUrl: this.folderUrl,
          defaultColor: this.defaultColor
        });
        this.own(on(mark, 'change', lang.hitch(this, this._onChange)));
        //TODO DELETE
        mark.placeAt(this.marksContainer);
        return mark;
      },

      _collapeAllMark: function() {
        this.marklines.forEach(function(item) {
          if (!item.dijit.closed) {
            item.dijit.closeContent();
          }
        });
        this.markareas.forEach(function(item) {
          if (!item.dijit.closed) {
            item.dijit.closeContent();
          }
        });
      },

      _onMarkDeleted: function(type, uniqueID) {
        if (type === 'line') {
          this._deleteMarkLine(uniqueID);
        } else if (type === 'area') {
          this._deleteMarkarea(uniqueID);
        }
        this._onChange();
      },

      _deleteMarkLine: function(uniqueID) {
        this.marklines = this.marklines.filter(function(ml) {
          return ml.uniqueID !== uniqueID;
        });
      },

      _deleteMarkarea: function(uniqueID) {
        this.markareas = this.markareas.filter(function(ma) {
          return ma.uniqueID !== uniqueID;
        });
      },

      _onChange: function() {
        var config = this.getConfig();
        if (config) {
          this.emit('change', config);
        }
      }

    });
  });