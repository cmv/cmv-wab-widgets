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
    "dojo/_base/array",
    'dojo/dom-construct',
    'dojo/on',
    'dojo/mouse',
    "dojo/text!./Preset.html",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    "jimu/dijit/Popup",
    "jimu/dijit/CheckBox",
    "dijit/form/Select",
    'dijit/form/ValidationTextBox',
    './ChooseFromLayer',
    './RelativeDates',
    './RelativeDomains',
    'dojo/dom-class',
    'dijit/form/NumberTextBox',
    "./layersAndFieldsApplyOn",
    '../presetUtils',
    'jimu/utils'
  ],
  function (
    declare,
    Evented,
    lang,
    array,
    domConstruct,
    on,
    mouse,
    template,
    _TemplatedMixin,
    BaseWidgetSetting,
    Popup,
    CheckBox,
    Select,
    TextBox,
    ChooseFromLayer,
    RelativeDates,
    RelativeDomains,
    domClass,
    NumberTextBox,
    layersAndFieldsApplyOn,
    presetUtils,
    jimuUtils
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-presetPopup",
      templateString: template,
      groupNameTextBox: null, // to store group name text box instance
      dataTypeDropdown: null, // to store data type dropdown instance
      hasDomainField: null,
      presetValueDijitNode: null,
      presetValueTimeNode: null,
      _selectedRelativeDate: null, // to store the relative date info
      _selectedRelativeDomains: null, //to store the domain info
      ValidFieldsByTypeToApplyOn: {
        "esriFieldTypeInteger": ["esriFieldTypeSmallInteger",
          "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeGUID": ["esriFieldTypeGUID"],
        "esriFieldTypeDate": ["esriFieldTypeDate"],
        "esriFieldTypeString": ["esriFieldTypeString"]
      },

      postCreate: function () {
        this.inherited(arguments);
        this._isDomainField();
        this._initControls();
        //Dont show dialog when deleteing group
        if (!this.isDelete) {
          this.showDialog();
        }
      },

      /**
       * This functions is used to Create dijit controls for preset popup
       */
      _initControls: function () {
        //Create Textbox to enter GroupName
        this.groupNameTextBox = new TextBox({
          required: true,
          trim: true,
          "style": {
            "width": "100%"
          }
        });
        this.groupNameTextBox.placeAt(this.groupNameDiv);
        //validate groupname for not empty and unique
        this.groupNameTextBox.validator = lang.hitch(this, function (value) {
          if (!value) {
            this.groupNameTextBox.set("invalidMessage",
              this.nls.smartActionsPage.requiredGroupNameMsg);
            return false;
          }
          if (value !== this.prevName &&
            this.editUtils.isDuplicateGroupName(value, this.existingGroupNames)) {
            this.groupNameTextBox.set("invalidMessage",
              this.nls.smartActionsPage.uniqueGroupNameMsg);
            return false;
          }
          return true;
        });
        this.groupNameTextBox.startup();
        if (this.name) {
          this.groupNameTextBox.set('value', this.name);
        }

        //Create DropDown for Data Type Selection
        this.dataTypeDropdown = new Select({
          options: this._addDataTypeOptions(),
          "style": {
            "width": "100%"
          }
        });
        this.own(on(this.dataTypeDropdown, "change", lang.hitch(this, function (selectedDataType) {
          var presetValue;
           //In case of date without domain show fixed as default datetype
           if (!this.showOnlyDomainFieldsCB.getValue() && selectedDataType === "esriFieldTypeDate") {
              this._selectedRelativeDate = presetValue = { "dateType": "fixed" };
           }
          this._createValueDijit(selectedDataType, presetValue);
          //clear previous domain list as data type is changed
          this._domainTableData = [];
        })));
        this.dataTypeDropdown.placeAt(this.dataTypeDropdownDiv);
        this.dataTypeDropdown.startup();
        //Show Checkbox to show only domain fields
        this.showOnlyDomainFieldsCB = new CheckBox({
          'label': this.nls.presetPage.showOnlyDomainFields
        }, domConstruct.create("div", {}, this.showOnlyDomainFieldsNode));
        if (this.showOnlyDomainFields) {
          this.showOnlyDomainFieldsCB.setValue(true);
        }

        this.own(on(this.showOnlyDomainFieldsCB, "change", lang.hitch(this, function (checked) {
          var presetValue, selectedDataType = this.dataTypeDropdown.get('value');
          //In case of date without domain show current as default datetype
          if (!checked && selectedDataType === "esriFieldTypeDate") {
            this._selectedRelativeDate = presetValue = { "dateType": "fixed" };
          }
          this._createValueDijit(selectedDataType, presetValue);
          //Create layers and fields to apply on table
          this._createLayersAndFields(selectedDataType, checked);
        })));
        if (this.dataType) {
          this.dataTypeDropdown.set('value', this.dataType, false);
          //in case of date fields set the value as selected relative date
          if (this.showOnlyDomainFields) {
            this._selectedRelativeDomains = this._domainTableData = this.presetValue;
          } else if (this.dataType === "esriFieldTypeDate") {
            this._selectedRelativeDate = this.presetValue;
          }
          this._createValueDijit(this.dataType, this.presetValue);
        }

        //Show Checkbox to hide in preset value at runtime
        this.hideInPresetDisplayCB = new CheckBox({
          'label': this.nls.presetPage.hideInPresetDisplay
        }, domConstruct.create("div", {}, this.hideInPresetDisplayNode));
        if (this.hideInPresetDisplay) {
          this.hideInPresetDisplayCB.setValue(true);
        }
      },

      _createValueDijit: function (fieldType, presetValue) {
        var node;
        node = this.createDijitOnDataTypeChange(fieldType);
        if (node) {
          //set it as a value dijit
          this.presetValueDijitNode = node;
          //handle mouse over event of value node to update tooltip in case of relative dates
          this.own(on(this.presetValueDijitNode.domNode, mouse.enter, lang.hitch(this, function () {
            if (this._selectedRelativeDate &&
              this.dataTypeDropdown.get("value") === "esriFieldTypeDate") {
              var dateVal = presetUtils.getDateFromRelativeInfo(this._selectedRelativeDate, true);
              if (dateVal === "") {
                dateVal = this.nls.relativeDates.noDateDefinedTooltip;
              }
              this.presetValueDijitNode.set("title", dateVal);
            } else {
              this.presetValueDijitNode.set("title", this.presetValueDijitNode.get("value"));
            }
          })));
          this.presetValueDijitNode.placeAt(this.presetValueDiv);
          this.presetValueDijitNode.startup();
          //if has prev set preset value show it in dijit
          if (presetValue) {
            if (this.showOnlyDomainFields) {
              this.presetValueDijitNode.set("value", this._getDefaultDomain(presetValue));
            }
            //In case of date preset value show the selected relative date type
            else if (fieldType === "esriFieldTypeDate" && presetValue.dateType) {
              //If dateType is fixed, show the selected date
              //Id no date is selected, show EMPTY date
              if (presetValue.dateType === "fixed") {
                if (presetValue.dateTime) {
                  this.presetValueDijitNode.set("value",
                    presetUtils.getDateFromRelativeInfo(presetValue, true));
                } else {
                  this.presetValueDijitNode.set("value", "");
                }
              } else {
                //For the other date options, show the key in textbox
                this.presetValueDijitNode.set("value",
                  this.nls.relativeDates[presetValue.dateType]);
              }
            } else {
              this.presetValueDijitNode.set('value', presetValue);
            }
          }
          //Create layers and fields to apply on table
          this._createLayersAndFields(fieldType, this.showOnlyDomainFieldsCB.checked);
        }
      },

      /**
       * This function is used to add options to data type dropdown
       */
      _addDataTypeOptions: function () {
        var options = [{
          "label": this.nls.dataType.esriFieldTypeString,
          "value": "esriFieldTypeString"
        }, {
          "label": this.nls.dataType.esriFieldTypeInteger,
          "value": "esriFieldTypeInteger"
        }, {
          "label": this.nls.dataType.esriFieldTypeDate,
          "value": "esriFieldTypeDate"
        }, {
          "label": this.nls.dataType.esriFieldTypeGUID,
          "value": "esriFieldTypeGUID"
        }];
        return options;
      },

      /**
       * This function is used to find whether any layer has domain field or not
       */
      _isDomainField: function () {
        array.forEach(this._totalLayers, lang.hitch(this, function (layer) {
          array.some(layer.layerObject.fields, lang.hitch(this, function (currentField) {
            if ((currentField.domain && currentField.domain.type === "codedValue")) {
              this.hasDomainField = true;
              return true;
            }
          }));
        }));
      },

      /**
      * This function is used to filter layerFields based on field type
      * esriFieldTypeOID and esriFieldTypeGlobalID will be not valid fields
      */
      _createLayerFieldsFilter: function (fieldType, isDomain) {
        var validFieldSet = [], layerDetails = {};
        array.forEach(this._totalLayers, lang.hitch(this, function (layer) {
          //if layer is not table
          //or if it is table then it should have some realtions then only consider it
          if (!layer.isTable || (layer.isTable && layer.layerObject.relationships.length > 0)) {
            array.forEach(layer.layerObject.fields, lang.hitch(this, function (field) {
              if (this.ValidFieldsByTypeToApplyOn[fieldType]) {
                validFieldSet = this.ValidFieldsByTypeToApplyOn[fieldType];
                if (validFieldSet.indexOf(field.type) > -1 && field.editable) {
                  if (isDomain && (!field.domain ||
                    (field.domain && field.domain.type === "range"))) {
                    return;
                  }
                  if (!layerDetails[layer.id]) {
                    layerDetails[layer.id] = {};
                  }
                  layerDetails[layer.id][field.name] = field;
                }
              }
            }));
          }
        }));
        return layerDetails;
      },

      /**
      * This function is used to create layersAndFieldsApplyOn instance
      * which will create UI for later and fields to apply on
      */
      _createLayersAndFields: function (dataType, isDomain) {
        this._layerAndFieldsApplyOnObj = new layersAndFieldsApplyOn({
          map: this.map,
          layerInfos: this.layerInfos,
          _configInfos: this._configInfos,
          actionName: "Preset",
          nls: this.nls,
          prevName: this.prevName,
          existingGroups: this.existingGroups,
          _configuredPresetInfos: this._configuredPresetInfos,
          layerDetails: this._createLayerFieldsFilter(dataType, isDomain),
          appliedOn: this.appliedOn
        });
        domConstruct.empty(this.tableParentContainer);
        this._layerAndFieldsApplyOnObj.placeAt(this.tableParentContainer);
        this._layerAndFieldsApplyOnObj.startup();
        domClass.add(this._layerAndFieldsApplyOnObj.layerAndFieldsMainDiv, "esriCTOverrideForPreset");

        on(this._layerAndFieldsApplyOnObj, "layerFieldsUpdated",
          lang.hitch(this, function () {
            this._fieldsToAppliedUpdated = true;
            this.tableDomains = this._consolidateLayerDomains();
            this._domainTableData = this._createDomainData();
          }));

      },

      deleteGroup: function () {
        this._layerAndFieldsApplyOnObj.deleteGroup();
      },


      /**
       * This function is used to Creat PresetPopUp
       */
      showDialog: function () {
        this.presetPopup = new Popup({
          "titleLabel": this.nls.fieldsPage.fieldsSettingsTable.canPresetValue,
          "width": 950,
          "maxHeight": 600,
          "autoHeight": false,
          "class": this.baseClass,
          "content": this,
          "buttons": [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              var validatePresetValue = true, groupInfo;
              groupInfo = {};
              //validate if groupname is valid
              if (!this.groupNameTextBox.isValid()) {
                this.groupNameTextBox.focus();
                return;
              }
              //store name and dataType in group info
              groupInfo.name =  jimuUtils.stripHTML(this.groupNameTextBox.get("value"));
              groupInfo.dataType = this.dataTypeDropdown.get("value");

              //In case GUID fields skip validation when value is empty
              if (groupInfo.dataType === "esriFieldTypeGUID" &&
                this.presetValueDijitNode.get("value") === "") {
                validatePresetValue = false;
              }

              //validate preset value
              if (validatePresetValue && !this.presetValueDijitNode.isValid()) {
                this.presetValueDijitNode.focus();
                return;
              }
              //store checkbox states in group info
              groupInfo.showOnlyDomainFields = this.showOnlyDomainFieldsCB.getValue();
              groupInfo.hideInPresetDisplay = this.hideInPresetDisplayCB.getValue();

              //check if domain checkbox is checked and accordingly fill the preset object
              //else if store realtive dates info
              //else store the value directly
              if (this.showOnlyDomainFieldsCB.checked && this._domainTableData) {
                groupInfo.presetValue = lang.clone(this._domainTableData);
              } else if (groupInfo.dataType === "esriFieldTypeDate") {
                groupInfo.presetValue = lang.clone(this._selectedRelativeDate);
              } else if (this.presetValueDijitNode) {
                groupInfo.presetValue = this.presetValueDijitNode.get("value");
              }

              //store applied on fields object
              groupInfo.appliedOn = this._layerAndFieldsApplyOnObj.getCheckedFields(groupInfo);
              this.emit("groupInfoUpdated", groupInfo);
              this.presetPopup.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              this.presetPopup.close();
            })
          }]
        });
      },

      /**
       * This function is used to Create dijit controls based on data type selection
       */
      createDijitOnDataTypeChange: function (dataTypeDropdownValue) {
        var node;
        domConstruct.empty(this.presetValueDiv);
        this.presetValueTimeNode = null;
        this.presetValueDijitNode = null;
        if (this.showOnlyDomainFieldsCB.getValue() ||
          dataTypeDropdownValue === "esriFieldTypeDate") {
          node = new TextBox({
            required: false,
            disabled: true,
            trim: true,
            "style": {
              "width": "100%"
            }
          });
        } else {
          switch (dataTypeDropdownValue) {
            case "esriFieldTypeSmallInteger":
            case "esriFieldTypeInteger":
            case "esriFieldTypeSingle":
            case "esriFieldTypeDouble":
              node = new NumberTextBox({
                "style": "width:100%"
              });
              break;
            case "esriFieldTypeGUID":
              node = new TextBox({
                "style": "width:100%"
              });
              node.validator = lang.hitch(this, presetUtils.isGuid);
              break;
            default:
              node = new TextBox({
                required: false,
                trim: true,
                "style": {
                  "width": "100%"
                }
              });
              break;
          }
        }
        return node;
      },

      /**
       * This function is used to handle onClick event of Select value button
       */
      _onSelectPresetValueButtonClick: function () {
        var selectedDataType = this.dataTypeDropdown.get("value");
        if (this.showOnlyDomainFieldsCB.checked) {
          this._relativeDomainsObj = new RelativeDomains({
            nls: this.nls,
            layerInfos: this.layerInfos,
            domainTableData: this._domainTableData,
            dataType: this.dataTypeDropdown.get("value"),
            _selectedRelativeDomains: this._selectedRelativeDomains
          });
          this.own(on(this._relativeDomainsObj, "updatePresetValue", lang.hitch(this,
            function (value) {
              this._selectedRelativeDomains = this._domainTableData = value.domainData;
              this.presetValueDijitNode.set("value", value.defaultValue);

            })));
        } else if (selectedDataType === "esriFieldTypeDate") {
          this._relativeDatesObj = new RelativeDates({
            nls: this.nls,
            relativeDates: this._selectedRelativeDate
          });
          this.own(on(this._relativeDatesObj, "updatePresetValue", lang.hitch(this,
            function (value) {
              this._selectedRelativeDate = value;
              if (this._selectedRelativeDate.dateType === "fixed") {
                if (this._selectedRelativeDate.dateTime) {
                  this.presetValueDijitNode.set('value',
                  presetUtils.getDateFromRelativeInfo(this._selectedRelativeDate, true));
                } else {
                  this.presetValueDijitNode.set('value', "");
                }
              } else {
                this.presetValueDijitNode.set("value", this.nls.relativeDates[value.dateType]);
              }
            })));
        } else {
          this.ChooseFromLayerObj = new ChooseFromLayer({
            map: this.map,
            nls: this.nls,
            allLayers: this._totalLayers,
            dataType: this.dataTypeDropdown.get("value")
          });
          on(this.ChooseFromLayerObj, "updatePresetValue", lang.hitch(this, function (value) {
            this.presetValueDijitNode.set("value", value);
          }));
        }
      },

      _getDefaultDomain: function (domainData) {
        var selectedDomainLabel = "";
        array.some(domainData, lang.hitch(this, function (configuredDomain) {
          if (configuredDomain.isDefault) {
            selectedDomainLabel = configuredDomain.label;
            return true;
          }
        }));
        return selectedDomainLabel;
      },

      /**
      * Create the consolidated domain data from selected fields
      **/
      _consolidateLayerDomains: function () {
        var domainObj = [], fieldObj, selectedDomain, layerInstance, consolidatedDomains = {};
        selectedDomain = this._layerAndFieldsApplyOnObj.getOnlyCheckedFields();
        for (var layerId in selectedDomain) {
          layerInstance = this.layerInfos.getLayerInfoById(layerId);
          array.forEach(selectedDomain[layerId], lang.hitch(this,
            function (fieldName) {
              fieldObj = layerInstance.layerObject.getField(fieldName);
              if (fieldObj && fieldObj.domain && fieldObj.domain.codedValues) {
                array.forEach(fieldObj.domain.codedValues, lang.hitch(this,
                  function (codedDomain) {
                    if (consolidatedDomains.hasOwnProperty(codedDomain.code)) {
                      if (consolidatedDomains[codedDomain.code].indexOf(codedDomain.name) < 0) {
                        consolidatedDomains[codedDomain.code].push(codedDomain.name);
                      }
                    } else {
                      consolidatedDomains[codedDomain.code] = [];
                      consolidatedDomains[codedDomain.code].push(codedDomain.name);
                    }

                  }));
              }
            }));
        }
        for (var code in consolidatedDomains) {
          domainObj.push({
            "value": code,
            "displayedLabel": consolidatedDomains[code].join(" | ")
          });
        }
        return domainObj;
      },

      /**
      * Create the domain data which will be used to fill the table
      **/
      _createDomainData: function () {
        var domainDataObj = [];
        //Loop through all the configured domains and add them to the table
        //This will keep the index and state intact
        array.forEach(this._selectedRelativeDomains, lang.hitch(this, function (prevDomain) {
          var tableDataCode;
          for (var i = this.tableDomains.length - 1; i >= 0; i--) {
            tableDataCode = this.tableDomains[i].value;
            if (this.dataTypeDropdown.get("value") !== "esriFieldTypeString") {
              tableDataCode = Number(tableDataCode);
            }
            if (prevDomain.value === tableDataCode) {
              domainDataObj.push({
                showInList: prevDomain.showInList,
                value: this.tableDomains[i].value,
                label: this.tableDomains[i].displayedLabel,
                isDefault: prevDomain.isDefault
              });
              //If the match is found in the newly configured domains
              //Remove it as it is already added in the domain table
              this.tableDomains.splice(i, 1);
              break;
            }
          }
        }));
        //Loop through all the remaining configured domains and add them to the table
        array.forEach(this.tableDomains, lang.hitch(this, function (domainObj, index) {
          var newDomainObj = {
            showInList: true,
            value: "" + domainObj.value + "",
            label: domainObj.displayedLabel,
            isDefault: false
          };
          domainDataObj.push(newDomainObj);
        }));
        return domainDataObj;
      }
    });
  });