///////////////////////////////////////////////////////////////////////////
// Alhoa Threat Zone Widget Settings - Robert Scheitlin
///////////////////////////////////////////////////////////////////////////
/*global define, setTimeout*/
define([
    'dojo/_base/declare',
    'jimu/BaseWidgetSetting',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/on',
    'esri/symbols/jsonUtils',
    'dojo/_base/html',
    'dojo/_base/query',
    'dijit/form/NumberSpinner',
    'jimu/dijit/SymbolPicker'
  ],
  function(
    declare,
    BaseWidgetSetting,
    _WidgetsInTemplateMixin,
    lang,
    on,
    jsonUtils,
    html,
    query
    ) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

      baseClass: 'aloha-widget-setting',
      simplemarkersymbol: null,

      postCreate: function() {
        this.own(on(this.defaultPointSymbolPicker,'change',lang.hitch(this,this._onPointSymbolChange)));
      },

      startup: function() {
        this.inherited(arguments);
        this.setConfig(this.config);
      },

      setConfig: function(config) {
        //hack the 'Learn more about this widget link'
        setTimeout(function(){
          var helpLink = query('.help-link');
          helpLink[0].href = 'http://gis.calhouncounty.org/WAB/V1.3/widgets/Aloha/help/AlohaThreatZone_Help.htm';
          html.setStyle(helpLink[0],'display','block');
        },600);
        this.config = config;
        if(config.simplemarkersymbol){
          this.defaultPointSymbolPicker.showBySymbol(jsonUtils.fromJson(config.simplemarkersymbol));
        }
        this.zoomPercent.setValue(this.config.zoompercent || 1.2);
      },

      getConfig: function() {
        this.config.simplemarkersymbol = this.simplemarkersymbol;
        this.config.zoompercent = this.zoomPercent.getValue();
        return this.config;
      },

      _onPointSymbolChange:function(newSymbol){
        this.simplemarkersymbol = newSymbol.toJson();
      }
    });
  });
