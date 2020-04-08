define(
    ["dojo/_base/declare",
        "dojo/Evented",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/text!./RelativeDomains.html",
        'dijit/_WidgetsInTemplateMixin',
        'dojo/_base/array',
        'jimu/BaseWidgetSetting',
        'jimu/dijit/Popup',
        'jimu/dijit/SimpleTable',
        'jimu/dijit/Message',
        'jimu/utils',
        'dojo/query',
        'dijit/focus',
        'dojo/string',
        'dojo/dom-attr',
        "dijit/form/DateTextBox",
        "dijit/form/TimeTextBox",
        "dijit/form/NumberTextBox"
    ],
    function (
        declare,
        Evented,
        lang,
        on,
        template,
        _WidgetsInTemplateMixin,
        array,
        BaseWidgetSetting,
        Popup,
        Table,
        Message,
        jimuUtils,
        query,
        focusUtils,
        string,
        domAttr
    ) {
        return declare([BaseWidgetSetting, Evented, _WidgetsInTemplateMixin], {
            baseClass: "jimu-widget-smartEditor-setting-relativeDomains",
            templateString: template,
            domainObj: [],
            selectDomainValuePopup: null, // to store selectValuePopup popup instance
            validNumericData: ["esriFieldTypeSmallInteger", "esriFieldTypeInteger",
                "esriFieldTypeSingle", "esriFieldTypeDouble"],

            postCreate: function () {
                this.domainObj = [];
                this.selectDomainValuePopup = null;
                this._createDomainTable();
                this._createSelectValuePopUp();
                if (this.selectedDomainFields && this.selectedDomainFields.length > 0) {
                    var hintMsg = string.substitute(
                        this.nls.relativeDomains.selectedDomainFieldsHint,
                        { domainFields: this.selectedDomainFields.join(", ") });
                    domAttr.set(this.domainFieldsHint, "innerHTML", hintMsg);
                }
            },

            postMixInProperties: function () {
                this.nls = lang.mixin(this.nls, window.jimuNls.common);
            },

            /**
            * Create the table based on the selected fields
            * @memberOf widgets/SmartEditor/RelativeDomains
            **/
            _createDomainTable: function () {
                var fields2, args2;
                fields2 = [{
                    name: 'selectDomain',
                    title: "",
                    type: 'checkbox',
                    'width': '10%'
                }, {
                    name: 'domainValue',
                    title: this.nls.relativeDomains.valueText,
                    type: 'text',
                    'width': '15%'
                }, {
                    name: "label",
                    title: this.nls.label,
                    type: 'text',
                    'width': '55%'
                }, {
                    name: "defaultDomain",
                    title: this.nls.relativeDomains.defaultText,
                    type: 'radio',
                    'width': '10%'
                }, {
                    name: 'actions',
                    title: this.nls.action,
                    type: 'actions',
                    width: '10%%',
                    actions: ['up', 'down'],
                    'class': 'actions'
                }];
                args2 = {
                    fields: fields2,
                    selectable: false
                };
                this._domainTable = new Table(args2);
                this._domainTable.startup();
                this._domainTable.placeAt(this.tableParentContainer);
                //Populate the table based on the configured data
                this._setValues();
            },

            /**
            * Create and Show popup
            * @memberOf widgets/SmartEditor/RelativeDomains
            **/
            _createSelectValuePopUp: function () {
                this.selectDomainValuePopup = new Popup({
                    "titleLabel": this.nls.chooseFromLayer.selectValueLabel,
                    "width": 800,
                    "height": 500,
                    "autoHeight": true,
                    "class": this.baseClass,
                    "content": this,
                    "buttons": [{
                        label: this.nls.ok,
                        onClick: lang.hitch(this, function () {
                            //Get the table values
                            var configuredDomain = this._getValue();
                            if (configuredDomain) {
                                this.emit("updatePresetValue", configuredDomain);
                                this.selectDomainValuePopup.close();
                            }
                        })
                    }, {
                        label: this.nls.cancel,
                        classNames: ['jimu-btn-vacation'],
                        onClick: lang.hitch(this, function () {
                            this.selectDomainValuePopup.close();
                        })
                    }]
                });
            },

            /**
             * This function is used to get selected date type and values
             */
            _getValue: function () {
                var defaultValue = "", domainData = [],
                    tableData = this._domainTable.getData();
                //Check if at least one default value is selected
                if (!this._isValidConfiguration(tableData)) {
                    new Message({
                        message: this.nls.relativeDomains.selectDefaultDomainMsg
                    });
                } else {
                    array.forEach(tableData, lang.hitch(this, function (row) {
                        var rowData = {};
                        rowData.showInList = row.selectDomain;
                        if (this.dataType !== "esriFieldTypeString") {
                            rowData.value = Number(row.domainValue);
                        } else {
                            rowData.value = row.domainValue;
                        }
                        rowData.label = row.label;
                        rowData.isDefault = row.defaultDomain;
                        if (rowData.isDefault) {
                            defaultValue = row.label;
                        }
                        domainData.push(rowData);
                    }));
                    return { "domainData": domainData, "defaultValue": defaultValue };
                }
            },

            /**
             * This function is used to set values of the dijit
             */
            _setValues: function () {
                //Loop through all the remaining configured domains and add them to the table
                array.forEach(this.domainTableData, lang.hitch(this, function (domainObj) {
                    var tableRow, radioButtonInstance, radioButtonState;
                    tableRow = this._domainTable.addRow({
                        selectDomain: domainObj.showInList,
                        domainValue: "" + domainObj.value + "",
                        label: domainObj.label,
                        defaultDomain: domainObj.isDefault
                    });
                    radioButtonInstance = tableRow.tr.cells[3].childNodes[0];
                    radioButtonState = radioButtonInstance.checked;
                    this.own(on(radioButtonInstance, "click", lang.hitch(this, function () {
                        if (radioButtonState) {
                            radioButtonInstance.checked = false;
                            radioButtonState = false;
                        } else {
                            radioButtonInstance.checked = true;
                            radioButtonState = true;
                        }
                    })));
                }));
            },

            /**
             * This function is used to validate the domain data
             */
            _isValidConfiguration: function (tableData) {
                var atLeastOneCheckBoxChecked = false, isDefaultCheckBoxChecked = false,
                    hasDefaultDomain = false;
                array.some(tableData, lang.hitch(this, function (row) {
                    //Check if default selected value has unchecked checkbox
                    //This makes it a invalid configuration
                    if (row.defaultDomain) {
                        hasDefaultDomain = true;
                        if (row.selectDomain) {
                            isDefaultCheckBoxChecked = true;
                        }
                    }
                    if (row.selectDomain) {
                        atLeastOneCheckBoxChecked = true;
                    }
                }));
                //If default domain is selected, check if checkbox for
                //same domain is checked
                if (hasDefaultDomain) {
                    return hasDefaultDomain && isDefaultCheckBoxChecked;
                } else if (atLeastOneCheckBoxChecked) {
                    //If default domain is not selected, check if at least
                    //one checkbox is selected
                    return atLeastOneCheckBoxChecked;
                } else {
                    //If both cases are not full field, then it is invalid
                    //configuration
                    return false;
                }
            },

            /**
             * This function is used to make select value popup accessible
             */
            _support508ForSelectValuePopUp: function () {
                var popUpCancelButton = query(".jimu-btn-vacation",
                    this.selectDomainValuePopup.domNode)[0];
                jimuUtils.initFirstFocusNode(this.selectDomainValuePopup.domNode,
                    this.selectDomainValuePopup.closeBtnNode);
                focusUtils.focus(this.selectDomainValuePopup.closeBtnNode);
                jimuUtils.initLastFocusNode(this.selectDomainValuePopup.domNode, popUpCancelButton);
            }
        });
    });