define(
  [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/query",
    "dojo/json",
    "dojo/dom-class",
    "dojo/text!./FormatFieldsSettings.html",
    "dojo/i18n!../nls/strings",

    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "esri/domUtils"
  ], function (
    declare, lang, query, JSON, domClass, template, strings,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    domUtils
  ) {
    var FormatFields = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      templateString: template,
      widgetsInTemplate: true,

      _supportsTime: {
        shortDate: true,
        shortDateLE: true
      },

      constructor: function (options) {
        declare.safeMixin(this, options);
        this._i18n = strings;
      },

      show: function () {
        this.loadSettings();
        this.startup();
      },

      _getFormatter: function () {
        var fieldObj = this.fieldValue;
        var type = fieldObj.type;
        var format;
        // Hide time format options until sure we should show it
        query(".formatTime").addClass("settingsHidden");
        query(".esriObliqueViewerFieldFormat, .legendTitle, .format").forEach(function (element) {
          domUtils.hide(element);
        });
        var formatStr = fieldObj.format;
        if (formatStr) {
          format = JSON.parse(formatStr);
        } else {
          return;
        }
        if (format && (type in this.obliqueViewer.esriDataType.decimal ||
          type in this.obliqueViewer.esriDataType.integer)) {
          if (type in this.obliqueViewer.esriDataType.decimal) {
            this._formatNumberSelect.set("value", format.places, false);
          }
          this._formatNumberCheck.set("value", format.digitSeparator, false);
          if (type in this.obliqueViewer.esriDataType.decimal) {
            query(".esriObliqueViewerFieldFormat, .legendTitle, .formatNumber").forEach(function (element) {
              var node = domUtils.getNode(element);
              if (node) {
                node.style.display = "table";
              }
            });
          } else {
            query(".esriObliqueViewerFieldFormat, .legendTitle, .formatInteger").forEach(function (element) {
              domUtils.show(element);
            });
          }
        } else if (format && type in this.obliqueViewer.esriDataType.date) {
          query(".formatTime").removeClass("settingsHidden");
          query(".esriObliqueViewerFieldFormat, .legendTitle, .esriObliqueViewerFormatDate").
            forEach(function (element) {
              domUtils.show(element);
            });
          if (format.dateFormat.indexOf("LETime") > -1 ||
            format.dateFormat.indexOf("LEShortTime") > -1 ||
            format.dateFormat.indexOf("LELongTime") > -1) {
            this._formatDateSelect.set("value", "shortDateLE", false);
            this._formatTimeCheck.set("checked", true);
            this._formatTimeSelect.set("value", format.dateFormat.split("shortDateLE")[1], false);
            this._enableUpdateTime(true);
          } else if (format.dateFormat.indexOf("Time") > -1) {
            this._formatDateSelect.set("value", "shortDate", false);
            this._formatTimeCheck.set("checked", true);
            this._formatTimeSelect.set("value", format.dateFormat.split("shortDate")[1], false);
            this._enableUpdateTime(true);
          } else {
            this._formatDateSelect.set("value", format.dateFormat, false);
            this._enableUpdateTime((format.dateFormat in this._supportsTime));
          }
        } else {
          query(".esriObliqueViewerFieldFormat, .legendTitle").forEach(function (element) {
            domUtils.hide(element);
          });
        }
      },

      _setFormatter: function (attribute, val) {
        var item = this.fieldValue,
          format = JSON.parse(item.format);
        query(".formatTime").addClass("settingsHidden");
        if (attribute === "dateFormat") {
          var dateFormat = val || this._formatDateSelect.get("value"),
            supportsTime = dateFormat in this._supportsTime,
            showTime = supportsTime && this._formatTimeCheck.get("checked"),
            timeFormat = showTime ? this._formatTimeSelect.get("value") : "";

          query(".formatTime").removeClass("settingsHidden");
          this._enableUpdateTime(supportsTime);
          format[attribute] = (dateFormat + timeFormat);
        } else if (attribute === "places") {
          format[attribute] = parseInt(val, 10);
        } else {
          format[attribute] = val;
        }
        this.fieldValue.format = JSON.stringify(format);
        this.obliqueViewer.updateFieldFormat();
      },

      _enableUpdateTime: function (enable) {
        this._formatTimeCheck.set("disabled", !enable);
        domClass[(!enable ? "add" : "remove")](this._formatTimeSelect.domNode, "settingsHidden");
        domClass[!enable ? "add" : "remove"](this.timeCheckboxLbl, "disabled");
        if (!enable) {
          this._formatTimeCheck.set("checked", false);
        }
      },

      _setFormatHandles: function () {
        this._formatDateSelect.on("change", lang.hitch(this, "_setFormatter", "dateFormat"));
        this._formatTimeSelect.on("change", lang.hitch(this, "_setFormatter", "dateFormat", null));
        this._formatNumberSelect.on("change", lang.hitch(this, "_setFormatter", "places"));
        this._formatNumberCheck.on("change", lang.hitch(this, "_setFormatter", "digitSeparator"));
        this._formatTimeCheck.on("change", lang.hitch(this, function () {
          var checked = this._formatTimeCheck.get("checked");
          domClass[(!checked ? "add" : "remove")](this._formatTimeSelect.domNode, "settingsHidden");
          this._setFormatter("dateFormat");
        }));
      },

      loadSettings: function () {
        if (!this.obliqueViewer.selectedField) {
          domClass.add(this._formatFieldsContainer, "settingsHidden");
          return;
        }
        domClass.remove(this._formatFieldsContainer, "settingsHidden");
        this.fieldValue = this.obliqueViewer.selectedField;
        this._setFormatHandles();
        this._getFormatter();
      },

      _saveSettings: function () {
        // var props = {
        //   field: lang.clone(this.fieldValue)
        // };
        // this.ObliqueViewer.updateFilterFeatureFormat(props);
      },

      _handleOKButtonClick: function () {
        this._saveSettings();
        this.dialog.hide();
      },

      hide: function () {
        this.dialog.hide();
        // this.ObliqueViewer.refresh();
      }
    });

    return FormatFields;
  });
