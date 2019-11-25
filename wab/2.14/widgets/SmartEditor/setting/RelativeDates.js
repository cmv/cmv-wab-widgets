define(
    ["dojo/_base/declare",
        "dojo/Evented",
        "dojo/_base/lang",
        'dojo/on',
        "dojo/text!./RelativeDates.html",
        'dijit/_WidgetsInTemplateMixin',
        'jimu/BaseWidgetSetting',
        "jimu/dijit/Popup",
        'dojo/dom-class',
        'dojo/keys',
        'jimu/utils',
        'dojo/query',
        'dijit/focus',
        '../presetUtils',
        "dijit/form/DateTextBox",
        "dijit/form/TimeTextBox",
        "dijit/form/NumberTextBox",
        "jimu/dijit/RadioBtn"
    ],
    function (
        declare,
        Evented,
        lang,
        on,
        template,
        _WidgetsInTemplateMixin,
        BaseWidgetSetting,
        Popup,
        domClass,
        keys,
        jimuUtils,
        query,
        focusUtils,
        presetUtils

    ) {
        return declare([BaseWidgetSetting, Evented, _WidgetsInTemplateMixin], {
            baseClass: "jimu-widget-smartEditor-setting-relativeDates",
            templateString: template,
            selectValuePopup: null, // to store selectValuePopup popup instance
            postCreate: function () {
                this._eventListener();
                this._createSelectValuePopUp();
                this._support508ForSelectValuePopUp();
                on(window, "resize", lang.hitch(this, function () {
                    setTimeout(lang.hitch(this, function () {
                        this._setFieldPopupDimensions();
                    }), 1000);
                }));
            },

            /**
            * event handlers
            * @memberOf widgets/SmartEditor/RalativeDates
            **/
            _eventListener: function () {
                this.fixedRadioButton.onStateChange = lang.hitch(this, function () {
                    this.dateTypeChanged();
                });
                this.currentRadioButton.onStateChange = lang.hitch(this, function () {
                    this.dateTypeChanged();
                });
                this.PastRadioButton.onStateChange = lang.hitch(this, function () {
                    this.dateTypeChanged();
                });
                this.futureRadioButton.onStateChange = lang.hitch(this, function () {
                    this.dateTypeChanged();
                });
            },

            dateTypeChanged: function () {
                domClass.add(this.fixedDateContent, "esriCTHidden");
                domClass.add(this.currentDateContent, "esriCTHidden");
                domClass.add(this.pastOrFutureDateContent, "esriCTHidden");
                domClass.remove(this.valueLabel, "esriCTHidden");

                if (this.fixedRadioButton.checked) {
                    domClass.remove(this.fixedDateContent, "esriCTHidden");
                    this.hintForDateType.innerHTML = this.nls.relativeDates.hintForFixedDateType;
                } else if (this.currentRadioButton.checked) {
                    domClass.add(this.valueLabel, "esriCTHidden");
                    domClass.remove(this.currentDateContent, "esriCTHidden");
                    this.hintForDateType.innerHTML = this.nls.relativeDates.hintForCurrentDateType;
                } else if (this.PastRadioButton.checked) {
                    domClass.remove(this.pastOrFutureDateContent, "esriCTHidden");
                    this.hintForDateType.innerHTML = this.nls.relativeDates.hintForPastDateType;
                } else if (this.futureRadioButton.checked) {
                    domClass.remove(this.pastOrFutureDateContent, "esriCTHidden");
                    this.hintForDateType.innerHTML = this.nls.relativeDates.hintForFutureDateType;
                }
            },

            /**
            * Create and Show popup
            * @memberOf widgets/SmartEditor/RalativeDates
            **/
            _createSelectValuePopUp: function () {
                this.selectValuePopup = new Popup({
                    "titleLabel": this.nls.relativeDates.popupTitle,
                    "width": 500,
                    "maxHeight": 400,
                    "class": this.baseClass,
                    "content": this,
                    "buttons": [{
                        label: this.nls.ok,
                        onClick: lang.hitch(this, function () {
                            var value = this._getValues();
                            if (value) {
                                this.emit("updatePresetValue", value);
                                this.selectValuePopup.close();
                            }
                        })
                    }, {
                        label: this.nls.cancel,
                        classNames: ['jimu-btn-vacation'],
                        onClick: lang.hitch(this, function () {
                            this.selectValuePopup.close();
                        })
                    }]
                });
                if (this.relativeDates) {
                    this._setValue();
                }
                this._setFieldPopupDimensions();
            },

            /**
            * Set popup fields dimensions
            */
            _setFieldPopupDimensions: function () {
                if (this.selectValuePopup) {
                    //If app is running in mobile mode, change the field selector popup dimensions
                    if (window.appInfo.isRunInMobile && window.innerWidth < 600) {
                        this.selectValuePopup.set("width", window.innerWidth - 100);

                    } else {
                        //Reset the field selector popup dimensions to default
                        this.selectValuePopup.set("width", 500);
                    }
                }
            },

            /**
             * This function is used to validate dijits related to fixed date
             */
            _validateFixedDate: function () {
                if (!this.dateTextBox.isValid()) {
                    this.dateTextBox.focus();
                    return false;
                }
                if (!this.timeTextBox.isValid()) {
                    this.timeTextBox.focus();
                    return false;
                }
                return true;
            },

            /**
             * This function is used to validate dijits related to past or future date
             */
            _validatePastOrFutureDate: function () {
                if (!this.yearsTextBox.isValid()) {
                    this.yearsTextBox.focus();
                    return false;
                }
                if (!this.monthsTextBox.isValid()) {
                    this.monthsTextBox.focus();
                    return false;
                }
                if (!this.daysTextBox.isValid()) {
                    this.daysTextBox.focus();
                    return false;
                }
                if (!this.hoursTextBox.isValid()) {
                    this.hoursTextBox.focus();
                    return false;
                }
                if (!this.minutesTextBox.isValid()) {
                    this.minutesTextBox.focus();
                    return false;
                }
                if (!this.secondsTextBox.isValid()) {
                    this.secondsTextBox.focus();
                    return false;
                }
                return true;
            },

            /**
             * This function is used to get selected date type and values
             */
            _getValues: function () {
                var isValid = true;
                var relativeDatesData = {
                    "value": {}
                };
                if (this.fixedRadioButton.checked) {
                    isValid = this._validateFixedDate();
                    if (isValid) {
                        relativeDatesData.dateType = "fixed";
                        relativeDatesData.dateTime =
                            presetUtils.getDateFieldValue({ "type": "esriFieldTypeDate" },
                                [this.dateTextBox, this.timeTextBox]);
                    }
                } else if (this.currentRadioButton.checked) {
                    relativeDatesData.dateType = "current";
                } else if (this.PastRadioButton.checked) {
                    isValid = this._validatePastOrFutureDate();
                    if (isValid) {
                        relativeDatesData = this._getValuesOfPastOrFutureDijits();
                        relativeDatesData.dateType = "past";
                    }
                } else if (this.futureRadioButton.checked) {
                    isValid = this._validatePastOrFutureDate();
                    if (isValid) {
                        relativeDatesData = this._getValuesOfPastOrFutureDijits();
                        relativeDatesData.dateType = "future";
                    }
                }
                if (isValid) {
                    return relativeDatesData;
                }
                return isValid;
            },

            /**
             * This function is used to make select value popup accessible
             */
            _support508ForSelectValuePopUp: function () {
                var popUpCancelButton = query(".jimu-btn-vacation", this.selectValuePopup.domNode)[0]
                jimuUtils.initFirstFocusNode(this.selectValuePopup.domNode, this.selectValuePopup.closeBtnNode);
                focusUtils.focus(this.selectValuePopup.closeBtnNode);
                jimuUtils.initLastFocusNode(this.selectValuePopup.domNode, popUpCancelButton);
            },

            /**
             * This function is used to set value of dijit
             */
            _setValue: function () {
                var prevValue;
                if (this.relativeDates.dateType === "fixed") {
                    this.fixedRadioButton.domNode.click();
                    prevValue = new Date(parseInt(this.relativeDates.dateTime, 10));
                    this.dateTextBox.set("value", prevValue);
                    this.timeTextBox.set("value", prevValue);
                }
                if (this.relativeDates.dateType === "current") {
                    this.currentRadioButton.domNode.click();
                }
                if (this.relativeDates.dateType === "past") {
                    this.PastRadioButton.domNode.click();
                    this._setValuesOfPastOrFutureDijits();
                }
                if (this.relativeDates.dateType === "future") {
                    this.futureRadioButton.domNode.click();
                    this._setValuesOfPastOrFutureDijits();
                }
            },

            /**
             * This function is used to set values of dijit related to past or future date
             */
            _setValuesOfPastOrFutureDijits: function () {
                this.yearsTextBox.set("value", this.relativeDates.year);
                this.monthsTextBox.set("value", this.relativeDates.month);
                this.daysTextBox.set("value", this.relativeDates.day);
                this.hoursTextBox.set("value", this.relativeDates.hour);
                this.minutesTextBox.set("value", this.relativeDates.minute);
                this.secondsTextBox.set("value", this.relativeDates.second);
            },

            _getValuesOfPastOrFutureDijits: function () {
                var relativeDatesData = {};
                relativeDatesData.year = this.yearsTextBox.value;
                relativeDatesData.month = this.monthsTextBox.value;
                relativeDatesData.day = this.daysTextBox.value;
                relativeDatesData.hour = this.hoursTextBox.value;
                relativeDatesData.minute = this.minutesTextBox.value;
                relativeDatesData.second = this.secondsTextBox.value;
                return relativeDatesData;
            }
        });
    });