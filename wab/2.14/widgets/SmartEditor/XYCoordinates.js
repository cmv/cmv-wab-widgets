///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define(
    ["dojo/_base/declare",
        "dojo/Evented",
        "dojo/_base/lang",
        'dojo/on',
        "dojo/text!./XYCoordinates.html",
        'dijit/_WidgetsInTemplateMixin',
        'jimu/BaseWidgetSetting',
        "jimu/dijit/Popup",
        "dojo/dom-attr"
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
        domAttr
    ) {
        return declare([BaseWidgetSetting, Evented, _WidgetsInTemplateMixin], {
            baseClass: "jimu-widget-smartEditor-XYCoordinates",
            templateString: template,
            fieldsPopup: null, // to store Coordinates popup instance
            postCreate: function () {
                this._createPopUp();
                //bind events
                this._eventListener();
            },

            /**
            * event handlers
            * @memberOf widgets/SmartEditor/XYCoordinates
            **/
            _eventListener: function () {
                this.own(on(this.coordinatesDropDown, "change",
                    lang.hitch(this, this._onChangeDropDown)));
                this.own(on(this.xAttributeTextBox, "change",
                    lang.hitch(this, this._onTextBoxValueChanged)));
                this.own(on(this.yAttributeTextBox, "change",
                    lang.hitch(this, this._onTextBoxValueChanged)));
            },

            /**
            * Call on coordinatesDropDown option change
            * @memberOf widgets/SmartEditor/XYCoordinates
            **/
            _onChangeDropDown: function () {
                //Check for coordinatesDropDown value to show text boxes labels accordingly
                if (this.coordinatesDropDown.value === "Map Spatial Reference") {
                    domAttr.set(this.xAttributeTextBoxLabel, "innerHTML",
                        this.nls.xAttributeTextBoxLabel);
                    domAttr.set(this.yAttributeTextBoxLabel, "innerHTML",
                        this.nls.yAttributeTextBoxLabel);
                    this.xAttributeTextBox.set("value", "");
                    this.yAttributeTextBox.set("value", "");
                    domAttr.set(this.xAttributeTextBox, "aria-label", this.nls.xAttributeTextBoxLabel);
                    domAttr.set(this.yAttributeTextBox, "aria-label", this.nls.yAttributeTextBoxLabel);
                }
                else {
                    domAttr.set(this.xAttributeTextBoxLabel, "innerHTML",
                        this.nls.latitudeTextBoxLabel);
                    domAttr.set(this.yAttributeTextBoxLabel, "innerHTML",
                        this.nls.longitudeTextBoxLabel);
                    this.xAttributeTextBox.set("value", "");
                    this.yAttributeTextBox.set("value", "");
                    domAttr.set(this.xAttributeTextBox, "aria-label", this.nls.latitudeTextBoxLabel);
                    domAttr.set(this.yAttributeTextBox, "aria-label", this.nls.longitudeTextBoxLabel);
                }
            },

            /**
            * Create and Show popup
            * @memberOf widgets/SmartEditor/XYCoordinates
            **/
            _createPopUp: function () {
                this.fieldsPopup = new Popup({
                    "titleLabel": this.nls.coordinatePopupTitle,
                    "width": 400,
                    "maxHeight": 300,
                    "autoHeight": true,
                    "class": this.baseClass,
                    "content": this,
                    "buttons": [{
                        label: this.nls.ok,
                        id: "okButton",
                        onClick: lang.hitch(this, function () {
                            this._getData();
                            this.xAttributeTextBox.set("value", "");
                            this.yAttributeTextBox.set("value", "");
                            this.fieldsPopup.close();
                        })
                    }, {
                        label: this.nls.cancel,
                        id: "cancelButton",
                        classNames: ['jimu-btn-vacation'],
                        onClick: lang.hitch(this, function () {
                            this.xAttributeTextBox.set("value", "");
                            this.yAttributeTextBox.set("value", "");
                            this.fieldsPopup.close();
                        })
                    }]
                });
                //Disable the ok button as soon as the popup is shown
                this.fieldsPopup.disableButton(0);
                //also set tab index to -1
                domAttr.set(this.fieldsPopup.disabledButtons[0], "tabindex", "-1");
            },

            /**
            * To get value of text boxes before clearing it.
            * @memberOf widgets/SmartEditor/XYCoordinates
            **/
            _getData: function () {
                this.emit("gotoSelectedLocation",
                    {
                        coordinateSystem: this.coordinatesDropDown.getValue(),
                        firstPoint: this.xAttributeTextBox.getValue(),
                        secondPoint: this.yAttributeTextBox.getValue()
                    });

            },

            /**
            * Call on textBoxes values changed
            * @memberOf widgets/SmartEditor/XYCoordinates
            **/
            _onTextBoxValueChanged: function () {
                //if entered text boxes values are valid then
                //enable popup Ok button otherwise keep disable
                if (!isNaN(this.xAttributeTextBox.value) && !isNaN(this.yAttributeTextBox.value)) {
                    this.fieldsPopup.enableButton(0);
                    domAttr.set(this.fieldsPopup.enabledButtons[0], "tabindex", "0");
                } else {
                    this.fieldsPopup.disableButton(0);
                    domAttr.set(this.fieldsPopup.disabledButtons[0], "tabindex", "-1");
                }
            }
        });
    });



