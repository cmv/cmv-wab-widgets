define([
    'dojo/_base/declare',
    'dojo/query',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/text!./ChartSort.html',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/RadioButton'
  ],
  function(declare, query, on, lang, html, templateString, Evented,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-chart-sort',
      templateString: templateString,
      //config
      //isLabelAxis:boolean
      //isAsc:boolean
      //field:''

      //params
      //fields:[],

      // public method
      // switchMode
      // resetUI
      // getConfig
      // clear

      //events:
      //change

      postCreate: function() {
        this.inherited(arguments);
        html.addClass(this.domNode, this.baseClass);
        this._initDom();
        this.own(on(this.otherSortField, 'change', lang.hitch(this, this._onUpdate)));
        this.own(on(this.featureSortField, 'change', lang.hitch(this, this._onUpdate)));
        this._hasLoaded = true;
        this.resetUI(this.config);
      },
      _initDom: function() {
        html.place(this.sortBtn, this.xAxisSortDiv);
      },
      _hideSortField: function() {
        html.setStyle(this.sortFieldDiv, 'display', 'none');
      },
      _showSortField: function() {
        html.setStyle(this.sortFieldDiv, 'display', '');
      },
      clear: function() {
        this._allowShowSortField = true;
        this._hideSortField();
        this.xAxisRadio.setChecked(true);
        this._selectAscBtn();
        this._updateOptions(this.featureSortField, []);
        this._updateOptions(this.otherSortField, []);
      },
      switchMode: function(mode, type) {

        this._mode = mode;
        html.setStyle(this.featureSortContainer, 'display', 'flex');
        html.setStyle(this.otherSortContainer, 'display', 'flex');
        if (mode === 'feature') {
          html.place(this.sortBtn, this.zAxisSortDiv);
          html.setStyle(this.otherSortContainer, 'display', 'none');
        } else {
          if (this.xAxisRadio.checked) {
            html.place(this.sortBtn, this.xAxisSortDiv);
          } else {
            html.place(this.sortBtn, this.yAxisSortDiv);
          }
          html.setStyle(this.featureSortContainer, 'display', 'none');
          this._handleSortFieldOfOtherMode(mode, type);
        }
      },

      _handleSortFieldOfOtherMode: function(mode, type) {
        if (type === 'pie' || mode === 'count' || mode === 'field') {
          this._allowShowSortField = false;
          this._hideSortField();
        } else if (mode === 'category') {
          this._allowShowSortField = true;
          if (this.yAxisRadio.checked) {
            this._showSortField();
          }
        }
      },
      resetUI: function(config) {
        if (!config) {
          return;
        }
        //isAsc
        if (config.isAsc) {
          this._selectAscBtn();
        } else {
          this._selectDescBtn();
        }
        if (typeof config.isLabelAxis !== 'undefined') {
          //isLabelAxis
          this.xAxisRadio.setChecked(config.isLabelAxis);
          this.yAxisRadio.setChecked(!config.isLabelAxis);
          if (config.field) {
            this.otherSortField.set('value', config.field);
          }
        } else {
          if (config.field) {
            this.featureSortField.set('value', config.field);
          }
        }
      },
      getSelectedField: function(mode) {
        if (mode === 'feature') {
          return this.featureSortField.get('value');
        } else {
          return this.otherSortField.get('value');
        }
      },
      getConfig: function() {
        var config = {};
        if (this._mode === 'feature') {
          config.field = this.featureSortField.get('value');
        } else {
          //xais
          config.isLabelAxis = this.xAxisRadio.checked;
          if (!this.xAxisRadio.checked) {
            if (this._allowShowSortField) {
              config.field = this.otherSortField.get('value');
            }
          }
        }
        config.isAsc = this._getSelectedSort();
        return config;
      },
      _onUpdate: function() {
        if (this._hasLoaded) {
          this.emit('change');
        }
      },
      setFields: function(fieldOptions, selectedField) { //[[alias]]
        if (!Array.isArray(fieldOptions)) {
          console.log('Chart sort waring: Not vaild fieldOptions');
          return;
        }
        this._updateOptions(this.otherSortField, fieldOptions, selectedField);
        this._updateOptions(this.featureSortField, fieldOptions, selectedField);
        return true;
      },
      _onSortAxisChange: function(isLabelAxis) {
        if (isLabelAxis) {
          this._hideSortField();
          html.place(this.sortBtn, this.xAxisSortDiv);
        } else {
          if (this._allowShowSortField) {
            this._showSortField();
          }
          html.place(this.sortBtn, this.yAxisSortDiv);
        }
        this._onUpdate();
      },
      _onAxisSortDivClick: function(e) {
        e.stopPropagation();
        var target = e.target;
        if (html.hasClass(target, 'asc')) {
          this._selectAscBtn();
        } else if (html.hasClass(target, 'desc')) {
          this._selectDescBtn();
        }
        this._onUpdate();
      },
      _selectAscBtn: function() {
        var ascNode = query('.asc', this.sortBtn)[0];
        var descNode = query('.desc', this.sortBtn)[0];
        html.removeClass(descNode, 'selected');
        html.addClass(ascNode, 'selected');
      },
      _selectDescBtn: function() {
        var ascNode = query('.asc', this.sortBtn)[0];
        var descNode = query('.desc', this.sortBtn)[0];
        html.addClass(descNode, 'selected');
        html.removeClass(ascNode, 'selected');
      },
      _getSelectedSort: function() {
        var ascNode = query('.asc', this.sortBtn)[0];
        return html.hasClass(ascNode, 'selected');
      },
      _updateOptions: function(select, options, value) {
        if (options) {
          select.removeOption(select.getOptions());
          select.addOption(options);
        } else {
          options = [];
        }
        if (!value && options.length > 0) {
          value = options[0].value;
        }
        if (value) {
          select.set('value', value);
        }
      }
    });
  });