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
define([
  "dojo/_base/declare",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./summarySettingSelector.html",
  "dijit/TooltipDialog",
  "dijit/popup",
  "dojo/_base/lang",
  "dojo/_base/html",
  "dojo/on",
  "dojo/dom-construct",
  "dijit/form/Select"
], function (
  declare,
  _WidgetsInTemplateMixin,
  _WidgetBase,
  _TemplatedMixin,
  SummarySettingSelectorTemplate,
  TooltipDialog,
  dojoPopup,
  lang,
  html,
  on,
  domConstruct,
  Select
) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-NetworkTrace-setting',

    templateString: SummarySettingSelectorTemplate,

    //flag to mantain the dialog open state
    _isTooltipDialogOpened: false,

    startup: function () {
      this.inherited(arguments);
    },

    postCreate: function () {
      this._createTooltipDialog(this.domNode);
      this._hideTooltipDialog();
    },

    destroy: function () {
      if (this.tooltipDialog) {
        dojoPopup.close(this.tooltipDialog);
        this.tooltipDialog.destroy();
      }
      this.inherited(arguments);
    },

    /**
     * Function to show the dialog
     * @memberOf widgets/isolation-trace/settings/summarySettingSelector.js
     **/
    _showTooltipDialog: function () {
      dojoPopup.open({
        parent: this.getParent(),
        popup: this.tooltipDialog,
        around: this.domNode
      });
      this._isTooltipDialogOpened = true;
    },

    /**
     * Function to hide the dialog
     * @memberOf widgets/isolation-trace/settings/summarySettingSelector.js
     **/
    _hideTooltipDialog: function () {
      dojoPopup.close(this.tooltipDialog);
      this._isTooltipDialogOpened = false;
    },

    /**
     * Function create's dialog to show field's list
     * @memberOf widgets/isolation-trace/settings/summarySettingSelector.js
     **/
    _createTooltipDialog: function () {
      var popupContent = this._createSummarySettingOptions();
      this.tooltipDialog = new TooltipDialog({
        content: popupContent,
        baseClass: "jimu-widget-NetworkTrace-setting"
      });
      //handle dom click and show tooltip dialog
      this.own(on(this.domNode, 'click', lang.hitch(this, function (
        event) {
        //stop event from propagation
        event.stopPropagation();
        event.preventDefault();
        //based on the dialog state show/hide the tooltip dialog
        if (this._isTooltipDialogOpened) {
          this._hideTooltipDialog();
        } else {
          this._showTooltipDialog();
        }
      })));
    },

    /**
     * Function creates summary settings to show in dialog
     * and binds events to each field, to notify on select
     * @memberOf widgets/isolation-trace/settings/summarySettingSelector.js
     **/
    _createSummarySettingOptions: function () {
      var summarySettingSelector;
      summarySettingSelector = domConstruct.create("div", {
        "class": "esriCTSummarySettingSelector"
      });
      domConstruct.create("div", {
        "innerHTML": "<b>Add Summary Items</b>",
        "class": "esriCTOutputHeaderLabel"
      }, summarySettingSelector);
      var options = [];
      for (var i = 0; i < this.inputOutputParamArray.length; i++) {
        var inputOption = {
          "label": this.inputOutputParamArray[i].name,
          "value": this.inputOutputParamArray[i].name,
          "defaultValue": this.inputOutputParamArray[i].defaultValue,
          "selected": i === 0 ? true : false
        };
        options.push(inputOption);
      }
      var table = domConstruct.create("table", {
        "class": "esriCTPopupTable"
      }, summarySettingSelector);
      /*Output*/
      var rowOutput = domConstruct.create("tr", {}, table);
      domConstruct.create('td', {
        innerHTML: this.nls.summaryTab.inputOutput
      }, rowOutput);
      var outputCol = domConstruct.create('td', {}, rowOutput);
      var divOutput = domConstruct.create("div", {
        "class": "esriCTDropDownContainer"
      }, outputCol);
      this.outputSelect = new Select({
        options: options,
        "class": "esriCTSummaryExpressionSelect"
      });
      this.outputSelect.placeAt(divOutput);
      /*Operator*/
      var rowOperator = domConstruct.create("tr", {}, table);
      domConstruct.create('td', {
        innerHTML: this.nls.summaryTab.operator
      }, rowOperator);
      var operatorCol = domConstruct.create('td', {}, rowOperator);
      var divOperator = domConstruct.create("div", {
        "class": "esriCTDropDownContainer"
      }, operatorCol);
      this.operatorSelect = new Select({
        options: [],
        "class": "esriCTSummaryExpressionSelect"
      });
      this.operatorSelect.placeAt(divOperator);
      this.own(on(this.operatorSelect, "change", lang.hitch(this, function() {
        //disable field select if count operator is selected
        if(this.operatorSelect.get("value") === this.nls.summaryTab.outputOperatorCountOption){
          this.fieldSelect.set("disabled",true);
        } else{
          this.fieldSelect.set("disabled",false);
        }
      })));
      /*Field*/
      var rowField = domConstruct.create("tr", {}, table);
      domConstruct.create('td', {
        innerHTML: this.nls.summaryTab.field
      }, rowField);
      var fieldCol = domConstruct.create('td', {}, rowField);
      var divField = domConstruct.create("div", {
        "class": "esriCTDropDownContainer"
      }, fieldCol);
      this.fieldSelect = new Select({
        options: [],
        "class": "esriCTSummaryExpressionSelect"
      });
      this.fieldSelect.placeAt(divField);
      /*Buttons*/
      var rowButtons = domConstruct.create("tr", {}, table);
      var buttonsCol = domConstruct.create('td', {
        "colspan": "2"
      }, rowButtons);
      var buttonsDiv = domConstruct.create('div', {
        "class": "esriCTButtonContainer"
      }, buttonsCol);
      var addButton = domConstruct.create('div', {
        "class": "jimu-btn jimu-float-leading esriCTAddButtonMargin",
        "innerHTML": this.nls.summaryTab.expressionAddButtonText
      }, buttonsDiv);
      var cancelButton = domConstruct.create('div', {
        "class": "jimu-btn jimu-float-trailing",
        "innerHTML": this.nls.common.cancel
      }, buttonsDiv);
      /*Events*/
      this.own(on(cancelButton, 'click', lang.hitch(this, this._hideTooltipDialog)));
      //hide tooltip dialog clicked anywhere in the body
      this.own(on(document.body, 'click', lang.hitch(this, function (event) {
        var target = event.target || event.srcElement;
        if (!this.isPartOfPopup(target, summarySettingSelector)) {
          this._hideTooltipDialog();
        }
      })));
      this.own(on(addButton, 'click', lang.hitch(this, this._addExpression)));
      this.outputSelect.startup();
      this.own(this.outputSelect.on('change', lang.hitch(this, this._onOutputDropDownChange)));
      this._onOutputDropDownChange(this.outputSelect.getValue());
      return summarySettingSelector;
    },

    _onOutputDropDownChange: function (value) {
      var fselect = this.fieldSelect;
      var oSelect = this.operatorSelect;
      var selectedValue = value;
      var options = this.inputOutputParamArray;
      var newOperatorOptions = [];
      for (var j = 0; j < options.length; j++) {
        if (options[j].name === selectedValue) {
          var fieldOptionArray, fieldOptionArr = [];
          if (options[j].defaultValue && options[j].defaultValue.fields) {
            fieldOptionArray = options[j].defaultValue.fields;
          }
          if (fieldOptionArray && fieldOptionArray.length > 0) {
            for (var k = 0; k < fieldOptionArray.length; k++) {
              if (fieldOptionArray[k].type === "esriFieldTypeDouble" ||
                fieldOptionArray[k].type === "esriFieldTypeSmallInteger" ||
                fieldOptionArray[k].type === "esriFieldTypeInteger") {
                var fieldOption = domConstruct.create("option", {});
                fieldOption.innerHTML = fieldOptionArray[k].name;
                fieldOption.value = fieldOptionArray[k].name;
                fieldOption.title = fieldOptionArray[k].name;
                fieldOptionArr.push(fieldOption);
              }
            }
          }
          if (fieldOptionArr.length > 0) {
            if (options[j].type === "Input") {
              newOperatorOptions = this._getOperatorOptions(true, false, false, false);
            } else {
              newOperatorOptions = this._getOperatorOptions(false, false, true, false);
            }
          } else {
            fieldOptionArr = [{
              "label": "",
              "value": "",
              "selected": true
            }];
            newOperatorOptions = this._getOperatorOptions(true, false, false, false);
          }
          //set feild options
          fselect.set("options", fieldOptionArr);
          //disable field selector as first option in all cases is count
          fselect.set("disabled", true);
          //set operator options
          oSelect.set("options", newOperatorOptions);
          fselect.startup();
          oSelect.startup();
          break;
        }
      }
    },

    _addExpression: function () {
      this._editorObj.focus();
      var formula = "";
      if (this.outputSelect.get('value') !== "") {
        if (formula !== "") {
          formula = formula + ':' + this.outputSelect.get('value');
        } else {
          formula = this.outputSelect.get('value');
        }
      }
      // Use feild value only when it is not empty and it is enabled
      if (this.fieldSelect.get('value') !== "" && !this.fieldSelect.get("disabled")) {
        if (formula !== "") {
          formula = formula + ':' + this.fieldSelect.get('value');
        } else {
          formula = this.fieldSelect.get('value');
        }
      }
      if (this.operatorSelect.get('value') !== "") {
        if (formula !== "") {
          formula = formula + ':' + this.operatorSelect.get('value');
        } else {
          formula = this.operatorSelect.get('value');
        }
      }
      this._editorObj.execCommand("inserthtml", "{" + formula + "}");
    },

    _getOperatorOptions: function (inputOperator, outputOperator, fieldOperator, displayOutputSkipCountOption) {
      var operatorParameterArray = [];
      if (inputOperator) {
        operatorParameterArray.push({
          "label": this.nls.summaryTab.inputOperatorCountOption,
          "value": this.nls.summaryTab.inputOperatorCountOption,
          "selected": true
        });
      } else if (outputOperator) {
        operatorParameterArray.push({
          "label": this.nls.summaryTab.outputOperatorCountOption,
          "value": this.nls.summaryTab.outputOperatorCountOption,
          "selected": true
        });
        if (displayOutputSkipCountOption) {
          operatorParameterArray.push({
            "label": this.nls.summaryTab.outputOperatorSkipCountOption,
            "value": this.nls.summaryTab.outputOperatorSkipCountOption,
            "selected": false
          });
        }
      } else if (fieldOperator) {
        //by default add count option for operator in
        operatorParameterArray.push({
          "label": this.nls.summaryTab.outputOperatorCountOption,
          "value": this.nls.summaryTab.outputOperatorCountOption,
          "selected": true
        });
        operatorParameterArray.push({
          "label": this.nls.summaryTab.fieldOperatorSumOption,
          "value": this.nls.summaryTab.fieldOperatorSumOption,
          "selected": true
        });
        operatorParameterArray.push({
          "label": this.nls.summaryTab.fieldOperatorMinOption,
          "value": this.nls.summaryTab.fieldOperatorMinOption,
          "selected": false
        });
        operatorParameterArray.push({
          "label": this.nls.summaryTab.fieldOperatorMaxOption,
          "value": this.nls.summaryTab.fieldOperatorMaxOption,
          "selected": false
        });
        operatorParameterArray.push({
          "label": this.nls.summaryTab.fieldOperatorMeanOption,
          "value": this.nls.summaryTab.fieldOperatorMeanOption,
          "selected": false
        });
      }
      return operatorParameterArray;
    },

    isPartOfPopup: function (target, domNode) {
      var isInternal = target === domNode || html.isDescendant(target, domNode);
      return isInternal;
    }
  });
});