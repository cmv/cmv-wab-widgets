define([
    'dojo/_base/declare',
    "dojo/_base/lang",
    'dojo/on',
    'dojo/_base/html',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin'
  ],
  function(declare, lang, on, html, Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-toggle-button',
      templateString: '<div><div data-dojo-attach-point="toggleBtn" class="toggle toggle-off"></div></div>',
      //config
      // state

      state: false,

      //events:
      //change

      postCreate: function() {
        this.inherited(arguments);
        this.own(on(this.toggleBtn, 'click', lang.hitch(this, function() {
          this.setState(!this.state);
          this.emit('change', this.state);
        })));
      },

      setState: function(state) {
        this.state = state;
        if (this.state) {
          this._open();
        } else {
          this._close();
        }
      },

      getState: function() {
        return !!this.state;
      },

      _open: function() {
        html.removeClass(this.toggleBtn, 'toggle-off');
        html.addClass(this.toggleBtn, 'toggle-on');
      },

      _close: function() {
        html.removeClass(this.toggleBtn, 'toggle-on');
        html.addClass(this.toggleBtn, 'toggle-off');
      }

    });
  });