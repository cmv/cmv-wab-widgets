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
  ['dojo/_base/declare',
    'dojo/Evented',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/on',
    'dojo/keys',
    'dojo/string',
    'dojo/dom-attr',
    'dojo/mouse',
    './presetUtils',
    './RelativeDates',
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    'dijit/form/FilteringSelect',
    'dojo/store/Memory',
    'dijit/form/ValidationTextBox',
    'dijit/form/NumberTextBox',
    'esri/urlUtils',
    'jimu/dijit/Message',
    'jimu/utils'
  ],
  function (
    declare,
    Evented,
    lang,
    array,
    domConstruct,
    domClass,
    on,
    keys,
    string,
    domAttr,
    mouse,
    presetUtils,
    RelativeDates,
    _TemplatedMixin,
    BaseWidgetSetting,
    FilteringSelect,
    Memory,
    TextBox,
    NumberTextBox,
    urlUtils,
    Message,
    utils
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-preset",
      tooltipContents: {},
      hasAtLeastOneGroupInDisplay: false,
      enableUsePresetValueCheckBox: false,

      postCreate: function () {
        this.inherited(arguments);
        this.hasAtLeastOneGroupInDisplay = false;
        this.enableUsePresetValueCheckBox = false;
        this.tooltipContents = {};
        this.presetContainer = domConstruct.create("div", {
          "class": "esriCTPresetContent"
        }, this.parentNode);
        this._createPresetContents();
      },

      /**
       * Method to fetch url params
       */
      _fetchUrlParameters: function () {
        var url, urlObject, urlParams;
        url = document.location.href;
        urlObject = urlUtils.urlToObject(url);
        if (urlObject.query) {
          urlParams = urlObject.query;
        }
        return urlParams;
      },

      /* New Preset Section Starts */
      _createPresetContents: function () {
        var presetGroup, urlParams;
        //before creating preset group contents fetch url params
        urlParams = this._fetchUrlParameters();
        for (presetGroup in this._configuredPresetInfos) {
          var row, groupInfo;
          groupInfo = this._isGroupNameFound(urlParams, presetGroup);
          //Use preset value passed from url params if available
          if (urlParams && groupInfo.isConfiguredGroupName) {
            //Check if group name present in url params matches with the configured group
            //This will be a case-insensitive search
            //If group name matches override the preset group value with the
            //url value
            row = this._createPresetContentDOM(this._configuredPresetInfos[presetGroup],
              urlParams[groupInfo.urlParamKey]);
          } else {
            row = this._createPresetContentDOM(this._configuredPresetInfos[presetGroup]);
          }
          //Check if preset group needs to be displayed or not
          if (this._configuredPresetInfos[presetGroup].hideInPresetDisplay) {
            domClass.add(row, "esriCTHidden");
          } else {
            this.hasAtLeastOneGroupInDisplay = true;
          }
          //Create the content and tooltip dialog for each preset group
          this._createTooltipContent(this._configuredPresetInfos[presetGroup]);
        }
      },

      _isGroupNameFound: function (urlParams, presetGroup) {
        var isConfiguredGroupName = false, urlParamKey;
        if (urlParams) {
          array.forEach(Object.keys(urlParams), lang.hitch(this, function (currentKey) {
            //Match the group names with configured preset groups
            //compare this after converting strings to lower case
            if (currentKey.toLowerCase() === presetGroup.toLowerCase()) {
              isConfiguredGroupName = true;
              urlParamKey = currentKey;
              return true;
            }
          }));
        }
        return {
          isConfiguredGroupName : isConfiguredGroupName,
          urlParamKey : urlParamKey
        };
      },

      _createPresetContentDOM: function (presetGroup, uriValue) {
        //Create label and dijit dom inside the tabel row
        var row = domConstruct.create("tr");
        var tableData = domConstruct.create("td");
        //create info icon to show message on click
        var infoIcon = domConstruct.create("div", {
          "class": "esriCTGroupInfoIcon",
          "aria-label": string.substitute(this.nls.groupInfoLabel, { groupName: presetGroup.name }),
          "tabindex": "0",
          "role": "button"
        }, tableData);
        var label = domConstruct.create("span", {
          innerHTML: presetGroup.name,
          "class": "ee-atiLabel"
        }, tableData);
        //Assign groupName attribute to label and info icon
        domAttr.set(label, "groupName", presetGroup.name);
        domAttr.set(infoIcon, "groupName", presetGroup.name);
        //On click show associated fields message in MessageBox
        this.own(on(infoIcon, "click", lang.hitch(this, function (evt) {
          var groupName = domAttr.get(evt.currentTarget, "groupName");
          Message({
            message: this.tooltipContents[groupName].innerHTML
          });
        })));
        //On keydown event show associated fields message in MessageBox
        this.own(on(infoIcon, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            var groupName = domAttr.get(evt.currentTarget, "groupName");
            Message({
              message: this.tooltipContents[groupName].innerHTML
            });
          }
        })));
        domConstruct.place(tableData, row);
        var fieldNode = domConstruct.create("td", { "class": "preset-value-editable" }, row);
        //If the field is configured for domain then create filteringSelect
        if (presetGroup.showOnlyDomainFields) {
          var formSelect = this._createDomainContentNode(presetGroup, fieldNode);
          //if value is passed from url then use it
          if (uriValue !== undefined) {
            formSelect.set("value", uriValue);
          }
        } else {
          //else create dijit based on the data type
          switch (presetGroup.dataType) {
            case "esriFieldTypeInteger":
              //if value is passed from url then use it
              if (uriValue !== undefined && !isNaN(uriValue)) {
                presetGroup.presetValue = uriValue;
              }
              this._createNumberTypeDOM(presetGroup, fieldNode);
              break;
            case "esriFieldTypeDate":
              //if value is passed from url then use it
              //in case of date field only fixed date can be passed from URL
              //If the passed value is not a number then pass empty value
              if (uriValue !== undefined) {
                presetGroup.presetValue = {
                  "dateType": "fixed",
                  "dateTime":  isNaN(uriValue) ? null : Number(uriValue)
                };
              }
              this._createDateTypeDOM(presetGroup, fieldNode);
              break;
            case "esriFieldTypeString":
              //if value is passed from url then use it
              if (uriValue !== undefined) {
                presetGroup.presetValue = uriValue;
              }
              this._createStringTypeDOM(presetGroup, fieldNode);
              break;
            case "esriFieldTypeGUID":
              //if value is passed from url then use it
              if (uriValue !== undefined) {
                presetGroup.presetValue = uriValue;
              }
              this._createGUIDTypeDOM(presetGroup, fieldNode);
              break;
          }
        }
        this.parentNode.appendChild(row);
        return row;
      },

      _createTooltipContent: function (presetGroup) {
        var layerID, contentDiv, tooltipHeaderMsg, headerNode, noFieldsMsg, hasAnyFieldsAssociated = false;
        var groupInfoDiv = domConstruct.create("div");
        contentDiv = domConstruct.create("div", {
          "class":"presetMessageContentDiv",
          style: {
            "max-height": "200px",
            "overflow": "auto"
         },
          tabindex: "0"
        }, groupInfoDiv);
        tooltipHeaderMsg = string.substitute(this.nls.presetGroupFieldsLabel,
          { groupName: "<b>" + presetGroup.name + "</b>" });
        noFieldsMsg = string.substitute(this.nls.presetGroupNoFieldsLabel,
          { groupName: "<b>" + presetGroup.name + "</b>" });
        //Add the header message after substituting the preset group name
        headerNode = domConstruct.create("div", {
          "innerHTML": tooltipHeaderMsg
        }, contentDiv);
        var list = domConstruct.create("ul", {
          "style": "margin: 0px; padding: 0 20px;"
        }, contentDiv);

        //Loop trough all the applied on fields and create the list of
        //all fields which with layer name
        //Use configured popup label for each field
        for (layerID in presetGroup.appliedOn) {
          if (presetGroup.appliedOn[layerID].length > 0) {
            hasAnyFieldsAssociated = true;
            var layerInstance = this._jimuLayerInfos.getLayerOrTableInfoById(layerID);
            if (layerInstance && layerInstance.title && layerInstance.layerObject &&
              layerInstance.layerObject.fields) {
              domConstruct.create("li", {
                "innerHTML": layerInstance.title + ": "
              }, list);
              var ullist = domConstruct.create("ul", {
                "style": "margin: 0px;"
              }, list);

              array.forEach(layerInstance.layerObject.fields,
                lang.hitch(this, function (fieldInfo) {
                  var portalFieldInfos = utils.getDefaultPortalFieldInfo(fieldInfo);
                  //If the preset group applied on array contains the field name
                  //Then add the field label and layer name in the div
                  if (presetGroup.appliedOn[layerID].indexOf(portalFieldInfos.fieldName) >= 0) {
                    domConstruct.create("li", {
                      "innerHTML": portalFieldInfos.label || portalFieldInfos.fieldName
                    }, ullist);
                  }
                }));
            }
          }
        }
        if (!hasAnyFieldsAssociated) {
          domAttr.set(headerNode, "innerHTML", noFieldsMsg);
        }
        this.tooltipContents[presetGroup.name] = groupInfoDiv;
      },

      _enableUsePresetValueCB: function (presetValue) {
        if (presetValue !== null && presetValue !== "" && presetValue !== undefined) {
          this.enableUsePresetValueCheckBox = true;
        }
      },

      _createNumberTypeDOM: function (presetGroup, fieldNode) {
        var numberTextBox = new NumberTextBox({
          "class": "ee-inputField",
          name: presetGroup.name,
          value: presetGroup.presetValue,
          "aria-label": presetGroup.name
        }, domConstruct.create("div", {}, fieldNode));
        this.own(on(numberTextBox, "change", lang.hitch(this, function(newValue){
          presetGroup.presetValue = newValue;
          this.emit("presetValueChanged");
        })));
        this._enableUsePresetValueCB(presetGroup.presetValue);
      },

      _createDateTypeDOM: function (presetGroup, fieldNode) {
        var datePresetBox, editIcon, editIconLabel;
        datePresetBox = new TextBox({
          "class": "ee-inputField",
          name: presetGroup.name,
          "disabled": true,
          "aria-label": presetGroup.name,
          "style": "width: calc(100% - 30px)",
          value: this.nls.relativeDates[presetGroup.presetValue.dateType]
        }, domConstruct.create("div", {}, fieldNode));
        //Add the actual fixed date if exist
        //else add the EMPTY string
        if (presetGroup.presetValue.dateType === "fixed") {
          if (presetGroup.presetValue.dateTime) {
            datePresetBox.set('value',
              presetUtils.getDateFromRelativeInfo(presetGroup.presetValue, true));
          } else {
            datePresetBox.set('value', "");
          }
        }
        //To maintain the grayed out effect and still focus the node
        domAttr.set(datePresetBox.focusNode, "disabled", false);
        domAttr.set(datePresetBox.focusNode, "readonly", true);
        domAttr.set(datePresetBox.focusNode, "tabindex", 0);
        //store date options in element itself to set date info in case of group filter overrides
        datePresetBox.esriCTisDateGroup = true;
        datePresetBox.esriCTPresetGroup = presetGroup;
        editIconLabel = string.substitute(this.nls.editGroupInfoIcon, {
          groupName: presetGroup.name
        });
        //Create edit icon
        editIcon = domConstruct.create("div", {
          "class": "jimu-icon jimu-icon-edit",
          "tabindex":"0",
          "role":"button",
          "aria-label":editIconLabel
        }, domConstruct.create("div", { "class": "editRelativeDateIcon" }, fieldNode));
        //Listen for edit icon button click event
        this.own(on(editIcon, "click", lang.hitch(this, function () {
          var relativeDatesObj = new RelativeDates({
            nls: this.nls,
            relativeDates: presetGroup.presetValue
          });
          this.own(on(relativeDatesObj, "updatePresetValue", lang.hitch(this,
            function (value) {
              //Update the config with current values
              //this will keep the state of user selection
              presetGroup.presetValue = value;
              //Add the actual fixed date if exist
              //OR show the empty text box
              if (presetGroup.presetValue.dateType === "fixed") {
                if (presetGroup.presetValue.dateTime) {
                  datePresetBox.set('value',
                    presetUtils.getDateFromRelativeInfo(presetGroup.presetValue, true));
                } else {
                  datePresetBox.set('value', "");
                }
              } else {
                //Else add the user selected date type text
                datePresetBox.set("value", this.nls.relativeDates[value.dateType]);
              }
              this.emit("presetValueChanged");
            })));
        })));
        this.own(on(editIcon, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            var relativeDatesObj = new RelativeDates({
              nls: this.nls,
              relativeDates: presetGroup.presetValue
            });
            this.own(on(relativeDatesObj, "updatePresetValue", lang.hitch(this,
              function (value) {
                //Update the config with current values
                //this will keep the state of user selection
                presetGroup.presetValue = value;
                //Add the actual fixed date if exist
                //OR show the empty text box
                if (presetGroup.presetValue.dateType === "fixed") {
                  if (presetGroup.presetValue.dateTime) {
                    datePresetBox.set('value',
                      presetUtils.getDateFromRelativeInfo(presetGroup.presetValue, true));
                  } else {
                    datePresetBox.set('value', "");
                  }
                } else {
                //Else add the user selected date type text
                  datePresetBox.set("value", this.nls.relativeDates[value.dateType]);
                }
                this.emit("presetValueChanged");
              })));
          }
        })));
        this.own(on(datePresetBox.domNode, mouse.enter, lang.hitch(this, function () {
          var dateVal = presetUtils.getDateFromRelativeInfo(presetGroup.presetValue, true);
          if (dateVal === "") {
            dateVal = this.nls.relativeDates.noDateDefinedTooltip;
          }
          datePresetBox.set("title", dateVal);
        })));
        this._enableUsePresetValueCB(presetGroup.presetValue);
      },

      _createStringTypeDOM: function (presetGroup, fieldNode) {
        var stringTextBox = new TextBox({
          "class": "ee-inputField",
          name: presetGroup.name,
          "aria-label": presetGroup.name,
          value: presetGroup.presetValue
        }, domConstruct.create("div", {}, fieldNode));
        this.own(on(stringTextBox, "change", lang.hitch(this, function (newValue) {
          presetGroup.presetValue = newValue;
          this.emit("presetValueChanged");
        })));
        this._enableUsePresetValueCB(presetGroup.presetValue);
      },

      _createGUIDTypeDOM: function (presetGroup, fieldNode) {
        var guidTextBox = new TextBox({
          "class": "ee-inputField",
          "aria-label": presetGroup.name,
          name: presetGroup.name,
          value: presetGroup.presetValue
        }, domConstruct.create("div", {}, fieldNode));
        this.own(on(guidTextBox, "change", lang.hitch(this, function (newValue) {
          presetGroup.presetValue = newValue;
          this.emit("presetValueChanged");
        })));
        this._enableUsePresetValueCB(presetGroup.presetValue);
      },

      _createDomainContentNode: function (presetGroup, fieldNode) {
        var domainData, formSelect;
        domainData = this._populateDomains(presetGroup);
        formSelect = new FilteringSelect({
          "class": "ee-inputField",
          name: presetGroup.name,
          "aria-label":presetGroup.name,
          style: { width: "99%" },
          required : false, //This will not validate the filtering select for empty value
          store: new Memory({ data: domainData.options })
        }, domConstruct.create("div", {}, fieldNode));
        formSelect.esriCTDomainList = true;
        this.own(on(formSelect, "change", lang.hitch(this, function () {
          presetGroup.selectedDomainValue = formSelect.get("value");
          this.emit("presetValueChanged");
        })));
        formSelect.set('value', domainData.defaultValue);
        this._enableUsePresetValueCB(presetGroup.presetValue);
        return formSelect;
      },

      _populateDomains: function (presetGroup) {
        var options = [], defaultValue, domainValues;
        domainValues = presetGroup.presetValue;
        array.forEach(domainValues, lang.hitch(this, function (domainData) {
          if (domainData.showInList) {
            options.push({
              "name": domainData.label,
              "id": domainData.value
            });
            //If the values needs to be a default value
            //set it to the filtering select
            if (domainData.isDefault) {
              defaultValue = domainData.value;
              presetGroup.selectedDomainValue = domainData.value;
            }
          }
        }));
        return {
          options: options,
          defaultValue: defaultValue
        };
      }
      /* End Of Preset Section */
    });
  });