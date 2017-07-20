define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/Evented',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/_base/query',
    'jimu/dijit/Popup',
    'jimu/utils',
    'dojo/json',
    'dojo/text!./templates.json'
  ],
  function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, on,
    lang, html, query, Popup, jimuUtils, JSON, _templates) {

    var templateChooser = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'jimu-widget-infographic-setting-template-popup',
      templateString: '' +
        '<div>' +
        '<div class="chooser-container" data-dojo-attach-point="chooserDiv"></div>' +
        '<div class="footer">' +
        '<div class="jimu-btn jimu-float-trailing jimu-btn-vacation cancel"' +
        'data-dojo-attach-point="btnCancel">${nls.cancel}</div>' +
        '<div class="jimu-btn jimu-float-trailing ok jimu-trailing-margin1 jimu-state-disabled"' +
        ' data-dojo-attach-point="btnOk">${nls.ok}</div>' +
        '</div>' +
        '</div>',

      postMixInProperties: function() {},

      postCreate: function() {
        this.inherited(arguments);

        _templates = jimuUtils.replacePlaceHolder(_templates, this.nls.stringsInTemplate);

        this._initTemplates();
        this.own(on(this.btnOk, 'click', lang.hitch(this, function() {
          if (this.getSelectedItem()) {
            this.emit('ok', this.getSelectedItem());
          }
        })));
        this.own(on(this.btnCancel, 'click', lang.hitch(this, function() {
          this.emit('cancel');
        })));
      },

      _initTemplates: function() {
        var templates = JSON.parse(_templates);
        templates.forEach(lang.hitch(this, function(item) {
          var tempDiv = html.create('div', {
            'class': 'tempDiv'
          }, this.chooserDiv);
          var imgDiv = html.create('div', {
            'class': 'imgDiv ' + item.name
          }, tempDiv);
          html.create('div', {
            'class': 'labelDiv',
            innerHTML: item.label
          }, tempDiv);
          html.create('div', {
            'class': 'select-icon'
          }, imgDiv);
          imgDiv.config = item.config;
          this.own(on(imgDiv, 'click', lang.hitch(this, function() {
            if (html.hasClass(imgDiv, 'selected')) {
              html.removeClass(imgDiv, 'selected');
            } else {
              query('.tempDiv .imgDiv.selected').removeClass('selected');
              html.addClass(imgDiv, 'selected');
            }
            var selectedTemplate = this.getSelectedItem();
            if (selectedTemplate) {
              html.removeClass(this.btnOk, 'jimu-state-disabled');
            } else {
              html.addClass(this.btnOk, 'jimu-state-disabled');
            }
          })));
        }));
      },

      getSelectedItem: function() {
        var selected = query('.tempDiv .imgDiv.selected')[0];
        if (selected) {
          return selected.config;
        }
      }
    });

    return declare([Popup, Evented], {
      width: 940,
      height: 560,
      titleLabel: '',

      dijitArgs: null, //refer to the parameters of dijit templateChooser

      postCreate: function() {
        this.inherited(arguments);
        html.addClass(this.domNode, 'jimu-widget-card-setting-template-popup');
        this.dijitArgs = {
          nls: this.nls
        };
        this.tc = new templateChooser(this.dijitArgs);
        this.tc.placeAt(this.contentContainerNode);
        this.tc.startup();

        this.own(on(this.tc, 'ok', lang.hitch(this, function(template) {
          this.emit('ok', template);
        })));

        this.own(on(this.tc, 'cancel', lang.hitch(this, function() {
          try {
            this.emit('cancel');
          } catch (e) {
            console.error(e);
          }
        })));
      }
    });
  });