define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./newThreatType.html',
  'dojo/_base/lang',
  'jimu/dijit/Popup',
  'dojo/Evented',
  'dojo/number',
  './defaultThreatTypes',
  'dojo/on',
  'dojo/_base/array',
  'dijit/form/ValidationTextBox',
  'dijit/form/TextBox'
], function (
  declare,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin,
  template,
  lang,
  Popup,
  Evented,
  dojoNumber,
  DefaultThreatType,
  on,
  array
) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString: template,
    baseClass: 'jimu-widget-threatAnalysis-newThreatTypePopup',
    prevThreatType: null,
    selectedThreatType: null,

    constructor: function () {},

    postCreate: function () {
      if (this.threatTypeTable && this.currentRowData.threatType) {
        this.prevThreatType = this.currentRow.threatType;
        this.threatTypeTextBox.set("value", this.currentRowData.threatType);
        this.mandatoryEvacuationDistance.set("value", this.currentRowData.mandatoryDistance);
        this.safeEvacuationDistance.set("value", this.currentRowData.safeDistance);
      }
      this.unitType.set("value", (this.selectedUnitType.toLowerCase() === "feet") ? this.nls.feet : this.nls.meters);
      this._threatTypeTextBoxValidator();
      this._createPopUp();
      this._handleClickEvents();
    },

    /**
     * Handle click events for different controls
     **/
    _handleClickEvents: function () {

      this.own(on(this.defaultThreatTypeIcon, "click", lang.hitch(this, function () {
        this.defaultThreatTypeObj = new DefaultThreatType({
          nls: this.nls,
          unitType: this.selectedUnitType
        });
        this.own(on(this.defaultThreatTypeObj, "selectedDefaultThreat", lang.hitch(this, function (defaultThreatInfo) {
          var distVal;
          this.threatTypeTextBox.set("value", defaultThreatInfo.displayedValue /*defaultThreatInfo.Threat*/ );
          distVal = (defaultThreatInfo.Unit.toLowerCase() === this.selectedUnitType.toLowerCase()) ?
            defaultThreatInfo.Bldg_Dist : defaultThreatInfo.Bldg_Dist * 0.3048;
          this.mandatoryEvacuationDistance.set("value", dojoNumber.format(distVal, {
            places: 2
          }));
          distVal = (defaultThreatInfo.Unit.toLowerCase() === this.selectedUnitType.toLowerCase()) ?
            defaultThreatInfo.Outdoor_Dist : defaultThreatInfo.Outdoor_Dist * 0.3048;
          this.safeEvacuationDistance.set("value", dojoNumber.format(distVal, {
            places: 2
          }));
          this.selectedThreatType = defaultThreatInfo.Threat;
          // this.unitType.set("value", this.unitType.value);
        })));
      })));
    },

    /**
     * Create and Show popup
     **/
    _createPopUp: function () {
      this.newThreatTypePopup = new Popup({
        "titleLabel": this.isAddThreat ? this.nls.newThreatTypePopupLabel : this.nls.editThreatLabel,
        "width": 600,
        "maxHeight": 300,
        "autoHeight": true,
        "class": this.baseClass,
        "content": this,
        "buttons": [{
          label: this.nls.ok,
          onClick: lang.hitch(this, function () {

            //validate
            if (!this.threatTypeTextBox.isValid()) {
              this.threatTypeTextBox.focus();
              return;
            }
            if (!this.mandatoryEvacuationDistance.isValid()) {
              this.mandatoryEvacuationDistance.focus();
              return;
            }
            if (!this.safeEvacuationDistance.isValid()) {
              this.safeEvacuationDistance.focus();
              return;
            }
            if (this.currentRow && this.threatTypeTable) {
              var rowData = {
                threatType: this.threatTypeTextBox.value,
                mandatoryDistance: dojoNumber.format(this.mandatoryEvacuationDistance.get("value"), {
                  places: 2
                }),
                safeDistance: dojoNumber.format(this.safeEvacuationDistance.get("value"), {
                  places: 2
                }),
                unit: this.unitType.value
              };
              this.currentRow.threatType = this.selectedThreatType; //this.threatTypeTextBox.value;
              this.currentRow.mandatoryDistance = dojoNumber.format(this.mandatoryEvacuationDistance.get("value"), {
                places: 2
              });
              this.currentRow.safeDistance = dojoNumber.format(this.safeEvacuationDistance.get("value"), {
                places: 2
              });
              this.currentRow.unit = this.selectedUnitType;
              this.threatTypeTable.editRow(this.currentRow, rowData);
            } else {
              this.emit("addNewThreat", {
                Threat: this.threatTypeTextBox.value,
                Bldg_Dist: this.mandatoryEvacuationDistance.get("value"),
                Outdoor_Dist: this.safeEvacuationDistance.get("value"),
                Unit: this.unitType.value
              });
            }
            this.newThreatTypePopup.close();
          })
        }, {
          label: this.nls.cancel,
          classNames: ['jimu-btn-vacation'],
          onClick: lang.hitch(this, function () {
            this.newThreatTypePopup.close();
          })
        }]
      });
    },

    /**
     * Check for duplicate threat type
     **/
    _isDuplicateThreatTypeName: function (threatName, existingThreats) {
      var isDuplicateName = false;
      array.some(existingThreats, lang.hitch(this, function (currentGroupName) {
        //If same threat type is found then
        //break the loop and send the flag value
        if (threatName.toLowerCase() === currentGroupName.toLowerCase()) {
          isDuplicateName = true;
          return true;
        }
      }));
      return isDuplicateName;
    },

    /**
     * Create validator for threat type textbox
     **/
    _threatTypeTextBoxValidator: function () {
      //validate for empty threat type
      this.threatTypeTextBox.validator = lang.hitch(this, function (value) {
        if (!value) {
          this.threatTypeTextBox.set("invalidMessage",
            this.nls.requiredThreatTypeMsg);
          return false;
        }
        //validate for unique threat type
        if (value !== this.prevThreatType && this._isDuplicateThreatTypeName(value, this.existingThreatNames)) {
          this.threatTypeTextBox.set("invalidMessage",
            this.nls.uniqueThreatTypeMsg);
          return false;
        }
        return true;
      });
    }
  });
});