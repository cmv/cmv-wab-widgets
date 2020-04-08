define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./defaultThreatTypes.html',
  'dojo/_base/lang',
  "jimu/dijit/Popup",
  'dojo/text!../models/ThreatTypes.json',
  'dojo/dom-construct',
  'dojo/_base/array',
  "dojo/dom-attr",
  'dojo/on',
  "dojo/query",
  'dojo/dom-class',
  "dojo/Evented",
  'dijit/form/ValidationTextBox',
  'jimu/dijit/formSelect'
], function (
  declare,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin,
  template,
  lang,
  Popup,
  threats,
  domConstruct,
  array,
  domAttr,
  on,
  query,
  domClass,
  Evented
) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString: template,
    baseClass: 'jimu-widget-threatAnalysis-defaultThreatTypePopup',
    constructor: function (options) {
      if (options) {
        lang.mixin(this, options);
      }
    },

    postCreate: function () {
      //Retrieve threat types
      this._threatData = JSON.parse(threats);
      this._createPopUpContent();
      this._createPopUp();
    },

    _createPopUpContent: function () {
      array.forEach(this._threatData, lang.hitch(this, function (threatInfo) {
        var threatTypesContainer = domConstruct.create('div', {
          "class": "esriCTDefaultThreats",
          "innerHTML": this._getThreatTypeNls(threatInfo.Threat)
        }, this.defaultThreatTypeList);
        domAttr.set(threatTypesContainer, {
          threatType: threatInfo.Threat,
          mandatoryDistance: threatInfo.Bldg_Dist,
          safeDistance: threatInfo.Outdoor_Dist,
          unit: threatInfo.Unit
        });
        this.own(on(threatTypesContainer, "click", lang.hitch(this, function (evt) {
          this._addSelectedThreatClass(evt.currentTarget);

        })));
      }));
    },

    /**
     * Create and Show popup
     **/
    _createPopUp: function () {
      this.defaultThreatTypePopup = new Popup({
        "titleLabel": this.nls.defaultThreatTypePopUpLabel,
        "width": 500,
        "maxHeight": 250,
        "autoHeight": true,
        "class": this.baseClass,
        "content": this,
        "buttons": [{
          label: this.nls.ok,
          id: "okButton",
          onClick: lang.hitch(this, function () {
            var selectedThreat = query(".selectedThreat", this.defaultThreatTypePopup.domNode);
            this.emit("selectedDefaultThreat", this._getSelectedThreatType(selectedThreat));
            this.defaultThreatTypePopup.close();
          })
        }, {
          label: this.nls.cancel,
          id: "cancelButton",
          classNames: ['jimu-btn-vacation'],
          onClick: lang.hitch(this, function () {
            this.defaultThreatTypePopup.close();
          })
        }]
      });
    },

    /**
     * This function is used to add selected class to selected threat container
     */
    _addSelectedThreatClass: function (selectedThreatNode) {
      var defultThreatNodes = query(".esriCTDefaultThreats", this.defaultThreatTypePopup.domNode);
      array.forEach(defultThreatNodes, lang.hitch(this, function (node) {
        if (domClass.contains(node, "selectedThreat")) {
          domClass.remove(node, "selectedThreat");
        }
      }));
      domClass.add(selectedThreatNode, "selectedThreat");
    },

    /**
     * Return NLS label representation of threat type
     */
    _getThreatTypeNls: function (threatTypeName) {
      var self = this;

      var threatTypeLabels = {
        "Pipe Bomb": "pipeBombLabel",
        "Suicide Bomb": "suicideBombLabel",
        "Briefcase": "briefcaseLabel",
        "Car": "carLabel",
        "SUV/VAN": "suvVanLabel",
        "Small Delivery Truck": "smallDeliveryTruckLabel",
        "Container/Water Truck": "containerWaterTruckLabel",
        "Semi-Trailer": "semiTrailerLabel"
      };

      var getThreatTypeLabel = function (threatName) {
        if (threatTypeLabels[threatName] !== undefined) {
          return self.nls[threatTypeLabels[threatName]];
        }
        return threatName;
      };

      return getThreatTypeLabel(threatTypeName);
    },

    /**
     * This function is used to get threat info of selected threat
     */
    _getSelectedThreatType: function (selectedThreatNode) {
      var threatInfo = {
        "Threat": domAttr.get(selectedThreatNode[0], "threatType"),
        "Bldg_Dist": domAttr.get(selectedThreatNode[0], "mandatoryDistance"),
        "Outdoor_Dist": domAttr.get(selectedThreatNode[0], "safeDistance"),
        "Unit": domAttr.get(selectedThreatNode[0], "unit"),
        "displayedValue": domAttr.get(selectedThreatNode[0], "innerHTML")
      };
      return threatInfo;
    }
  });
});