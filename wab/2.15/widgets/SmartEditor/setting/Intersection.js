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
    "dijit/form/Select",
    "dojo/_base/array",
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'dojo/promise/all',
    'dojo/Deferred',
    "dojo/text!./Intersection.html",
    'dijit/_TemplatedMixin',
    'jimu/dijit/LayerChooserFromMap',
    'jimu/dijit/LayerChooserFromMapWithDropbox',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    'jimu/dijit/Message',
    "jimu/dijit/Popup",
    "jimu/dijit/CheckBox",
    'dijit/popup',
    'dijit/TooltipDialog',
    'dijit/form/ValidationTextBox',
    'dijit/form/NumberTextBox',
    'dijit/form/DropDownButton',
    'dojo/dom-class',
    "./layersAndFieldsApplyOn"
  ],
  function (
    declare,
    Evented,
    lang,
    Select,
    array,
    domAttr,
    domConstruct,
    on,
    query,
    all,
    Deferred,
    template,
    _TemplatedMixin,
    LayerChooserFromMap,
    LayerChooserFromMapWithDropbox,
    BaseWidgetSetting,
    Table,
    Message,
    Popup,
    CheckBox,
    popup,
    TooltipDialog,
    TextBox,
    NumberTextBox,
    DropDownButton,
    domClass,
    layersAndFieldsApplyOn
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-intersection",
      templateString: template,
      popup: null,
      totalLayers: [],
      _layersForApplyOn: [],
      isGroup: false,
      ValidFieldsByType: {
        "esriFieldTypeOID": ["esriFieldTypeSmallInteger", "esriFieldTypeInteger",
          "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeSmallInteger": ["esriFieldTypeOID", "esriFieldTypeSmallInteger",
          "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeInteger": ["esriFieldTypeOID", "esriFieldTypeSmallInteger",
          "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeDouble": ["esriFieldTypeOID", "esriFieldTypeSmallInteger",
          "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeSingle": ["esriFieldTypeOID", "esriFieldTypeSmallInteger",
          "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
        ],
        "esriFieldTypeGUID": ["esriFieldTypeGUID", "esriFieldTypeGlobalID"],
        "esriFieldTypeDate": ["esriFieldTypeDate"],
        "esriFieldTypeString": ["esriFieldTypeSmallInteger", "esriFieldTypeInteger",
          "esriFieldTypeSingle", "esriFieldTypeDouble", "esriFieldTypeString", "esriFieldTypeGUID",
          "esriFieldTypeDate", "esriFieldTypeOID", "esriFieldTypeGlobalID"
        ]
      },
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
        this.totalLayers = [];
        this._layersForApplyOn = [];
        //create toleance settings dialog content
        this._createToleranceSettingsDialogContent();
        //create intersection content
        this._createDialogContent();
        //show the popup dialog
        if (!this.isDelete) {
          this.showDialog();
        }
        this._initLayerSelector();
        this._createLayersAndFields();
        //Listen for all layer event
        this.own(on(this.addLayer, "click", lang.hitch(this, function () {
          if (this.totalLayers.length > 0) {
            var row = this._layerTable.addRow({}).tr;
            this._addLayersDropDown(row);
            this._addFieldsDropDown(row);
            this._addToleranceSettings(row);
          } else {
            new Message({
              message: this.nls.intersectionPage.noLayersMessage
            });
          }
        })));
      },

      _createDialogContent: function () {
        this.isEnabled = false;
        if (this._fieldValues && this._fieldValues.Intersection) {
          if (this._fieldValues.Intersection.hasOwnProperty("enabled")) {
            this.isEnabled = this._fieldValues.Intersection.enabled;
          }
        }
        //Initialize group info controls
        this._initControls();
        //Initialize table contents
        this._initTable();
      },

      _initControls: function () {
        //Create Textbox to enter GroupName
        this.groupNameTextBox = new TextBox({
          style: { width: "100%" },
          required: true,
          trim: true
        }, domConstruct.create("div", {}, this.groupNameTextBoxNode));
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
        if (this.name) {
          this.groupNameTextBox.set('value', this.name);
        }
        this.dataTypeDropdown = new Select({
          options: this._addDataTypeOptions(),
          style: { width: "100%" }
        });
        this.dataTypeDropdown.placeAt(this.dataTypeDropDownNode);
        this.dataTypeDropdown.startup();
        this.own(on(this.dataTypeDropdown, "change", lang.hitch(this, function (value) {
          var allRows;
          if (this.isGroup) {
            //Set current selected fiedl type
            this._fieldType = value;
            //Empty total layers array as it need to fillied agin based on changed fieldType
            this.totalLayers = [];
            this._layersForApplyOn = [];
            //Delete all Rows in layer Table
            allRows = this._layerTable.getRows();
            array.forEach(allRows, lang.hitch(this, function (tr) {
              this._layerTable.deleteRow(tr);
            }));
            //reInit layer selector based on selected fieldType
            this._initLayerSelector();
            this._createLayersAndFields();
          }
        })));
        if (this._fieldType) {
          this.dataTypeDropdown.set('value', this._fieldType, false);
        }
        //Show Checkbox to submit data when filed is hidden
        this.ignoreLayerRanking = new CheckBox({
          'label': this.nls.intersectionPage.ignoreLayerRankingCheckboxLabel
        }, domConstruct.create("div", {}, this.ignoreLayerRankingNode));
      },

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

      _initTable: function () {
        var fields2, args2;
        fields2 = [{
          name: 'layerName',
          title: this.nls.intersectionPage.layerText,
          type: 'empty',
          width: '30%'
        }, {
          name: 'fieldName',
          title: this.nls.intersectionPage.fieldText,
          type: 'empty',
          width: '30%'
        },
        {
          name: 'toleranceSettings',
          title: this.nls.intersectionPage.toleranceSettingText,
          type: 'empty',
          width: '25%'
        },
        {
          name: 'actions',
          title: this.nls.intersectionPage.actionsText,
          type: 'actions',
          width: '15%',
          actions: ['up', 'down', 'delete'],
          'class': 'actions'
        }];
        args2 = {
          fields: fields2,
          selectable: false
        };
        this._layerTable = new Table(args2);
        this._layerTable.placeAt(this.layerTableNode);
        this._layerTable.startup();
        this.own(on(this._layerTable,
          'actions-edit',
          lang.hitch(this, this._onEditFieldInfoClick)));
        this.own(on(this._layerTable,
          'actions-delete',
          lang.hitch(this, this._onDeleteFieldInfoClick)));
        this._populateTableData();
      },
      _populateTableData: function () {
        if (this._fieldValues.Intersection.ignoreLayerRanking) {
          this.ignoreLayerRanking.setValue(true);
        }
        array.forEach(this._fieldValues.Intersection.fields, lang.hitch(this, function (field) {
          var row;
          //Check if prev configured layer available in map then only add that row
          if (field.layerId &&
            this.layerInfos.getLayerInfoById(field.layerId)) {
            row = this._layerTable.addRow({}).tr;
            this._addLayersDropDown(row, field);
            this._addFieldsDropDown(row, field);
            this._addToleranceSettings(row, field);
          }
        }));
      },

      _createToleranceSettingsDialogContent: function () {
        var popupFieldContentDiv, unitOptions, dropDownParent, toleranceUnitTextDiv, toleranceValueTextDiv;
        popupFieldContentDiv = domConstruct.create("div", {
          "class": "esriCTpopupFieldContent"
        });

        this._useDefaultToleranceCheckbox = new CheckBox({
          'label': this.nls.intersectionPage.useDefaultToleranceText
        }, domConstruct.create("div", {
          "class": "esriCTPopupLabels"
        }, popupFieldContentDiv));

        toleranceValueTextDiv = domConstruct.create("div", {
          "class": "esriCTPopupLabels esriCTMargin",
          "innerHTML": this.nls.intersectionPage.toleranceValueText
        }, popupFieldContentDiv);

        this._toleranceValueTextbox = new NumberTextBox({
          style: { width: "100%" },
          constraints: { min: 0 },
          required: true
        }, domConstruct.create("div", {
          "class": "esriCTPopupLabels"
        }, popupFieldContentDiv));

        toleranceUnitTextDiv = domConstruct.create("div", {
          "class": "esriCTPopupLabels esriCTMargin",
          "innerHTML": this.nls.intersectionPage.toleranceUnitText
        }, popupFieldContentDiv);

        unitOptions = [{
          label: this.nls.units.miles, value: "miles"
        }, {
          label: this.nls.units.kilometers, value: "kilometers"
        }, {
          label: this.nls.units.meters, value: "meters"
        }, {
          label: this.nls.units.feet, value: "feet"
        }];

        dropDownParent = domConstruct.create("div", {}, popupFieldContentDiv);
        this._toleranceUnitDropdown = new Select({
          style: { width: "200px" },
          options: unitOptions
        });
        this._toleranceUnitDropdown.placeAt(dropDownParent);
        this._toleranceUnitDropdown.startup();

        this.toleranceSettingIconDialog = new TooltipDialog({
          "class": this.baseClass,
          content: popupFieldContentDiv
        });
        //once dialog is closed process the newly configred values and store in respective row
        this.own(on(this.toleranceSettingIconDialog, "close", lang.hitch(this, function () {
          var newValue, newToleranceData;
          //get the data configured in the recent open dialog
          newToleranceData = {
            useDefault: this._useDefaultToleranceCheckbox.getValue(),
            value: this._toleranceValueTextbox.get('value'),
            unit: this._toleranceUnitDropdown.getValue()
          };
          //in case of use default value show defalut value label
          //else set the lable to configured value and unit
          if (newToleranceData.useDefault) {
            newValue = this._useDefaultToleranceCheckbox.label;
          } else {
            if (this._toleranceValueTextbox.isValid()) {
              if (newToleranceData.unit === "px") {
                newValue = newToleranceData.value + " " + this.nls.intersectionPage.pixelsUnitText;
              } else {
                newValue = newToleranceData.value + " " + this.nls.units[newToleranceData.unit];
              }
            }
          }
          //if usedfalut is true or the tolerancevalue is valid then only use the newly configured settings
          if (newToleranceData.useDefault || this._toleranceValueTextbox.isValid()) {
            //set all configured values in the row's object
            //if tolerance textbox value is valid then only store it else set it to 0
            if (this._toleranceValueTextbox.isValid()) {
              this._selectedRowForToleranceSettings.toleranceSettings.value = newToleranceData.value;
            } else {
              this._selectedRowForToleranceSettings.toleranceSettings.value = 0;
            }
            this._selectedRowForToleranceSettings.toleranceSettings.unit = newToleranceData.unit;
            this._selectedRowForToleranceSettings.toleranceSettings.useDefault = newToleranceData.useDefault;
            //display the newly configured value in row
            domAttr.set(this._selectedRowForToleranceSettings.toleranceTextContainer, "innerHTML", newValue);
            domAttr.set(this._selectedRowForToleranceSettings.toleranceTextContainer, "title", newValue);
          }
        })));
      },

      _addToleranceSettings: function (tableRow, prevSettings) {
        var fieldsColumn, toleranceTextValue, tolreanceParent, toleranceSettingIcon;
        //Create the default tolerance settings for backward compatibility
        //if available use the prev configured values
        if (!prevSettings || !prevSettings.toleranceSettings) {
          tableRow.toleranceSettings = {
            useDefault: false,
            value: 0,
            unit: "meters"
          };
        } else {
          tableRow.toleranceSettings = prevSettings.toleranceSettings;
        }
        //create the tolerance value to be shown in the row
        if (tableRow.toleranceSettings.useDefault) {
          toleranceTextValue = this._useDefaultToleranceCheckbox.label;
        } else {
          if (tableRow.toleranceSettings.unit === "px") {
            toleranceTextValue = tableRow.toleranceSettings.value + " " +
              this.nls.intersectionPage.pixelsUnitText;
          } else {
            toleranceTextValue = tableRow.toleranceSettings.value + " " +
              this.nls.units[tableRow.toleranceSettings.unit];
          }
        }
        //get the 3rd col to show tolerance settings and create the UI
        fieldsColumn = query('.simple-table-cell', tableRow)[2];
        tolreanceParent = domConstruct.create("div", {
          "class": "esriCTToleranceParentDiv"
        }, fieldsColumn);
        tableRow.toleranceTextContainer = domConstruct.create("div", {
          "class": "esriCTToleranceValueText esriCTEllipsis",
          "innerHTML": toleranceTextValue,
          "title": toleranceTextValue
        }, tolreanceParent);
        toleranceSettingIcon = new DropDownButton({
          iconClass: "esriCTToleranceSettingsIcon",
          dropDown: this.toleranceSettingIconDialog,
          "title": this.nls.intersectionPage.toleranceSettingText
        }, domConstruct.create("div", {}, tolreanceParent));
        //on opening the tolerence setting show the rows tolerance setting in the dialog
        //and also maintain the selectedRow so that on close we can store new settings in it
        this.own(on(toleranceSettingIcon, "click", lang.hitch(this, function () {
          this._selectedRowForToleranceSettings = tableRow;
          this._updateUnitsOption();
          this._toleranceValueTextbox.set("value", tableRow.toleranceSettings.value);
          this._useDefaultToleranceCheckbox.setValue(tableRow.toleranceSettings.useDefault);
          this._toleranceUnitDropdown.set("value", tableRow.toleranceSettings.unit);
        })));
      },

      _updateUnitsOption: function () {
        var optionFound = false, geometryType =
          this._selectedRowForToleranceSettings.layerSelector.getSelectedItem().layerInfo.layerObject.geometryType;
        if (geometryType === "esriGeometryPoint") {
          array.some(this._toleranceUnitDropdown.options, lang.hitch(this,
            function (option) {
              if (option.value === "px") {
                optionFound = true;
                return true;
              }
            }));
          //If "px" option is not found, then add it
          if (!optionFound) {
            this._toleranceUnitDropdown.addOption({
              label: this.nls.intersectionPage.pixelsUnitText, value: "px"
            });
          }
        } else {
          this._toleranceUnitDropdown.removeOption("px");
        }
      },

      _addLayersDropDown: function (tr, fieldData) {
        var td, layerChooserFromMapArgs, layerSelector, layerChooserFromMap;
        if (tr.layerSelector) {
          tr.layerSelector.destroy();
        }
        //create layerChooser args
        layerChooserFromMapArgs = this._createLayerChooserMapArgs();
        layerChooserFromMap = new LayerChooserFromMap(layerChooserFromMapArgs);
        layerChooserFromMap.startup();

        td = query('.simple-table-cell', tr)[0];

        layerSelector =
          new LayerChooserFromMapWithDropbox({ layerChooser: layerChooserFromMap });
        layerSelector.placeAt(td);
        layerSelector.startup();

        tr.layerSelector = layerSelector;
        layerSelector.setSelectedLayer(this.totalLayers[0]);
        if (fieldData) {
          //setSelectedLayer in rows layerSelector
          layerSelector.setSelectedLayer(
            this.layerInfos.getLayerInfoById(fieldData.layerId).layerObject);
        }
        this.own(on(layerSelector, 'selection-change',
          lang.hitch(this, function () {
            var unitLabelNode, unitLabel, unitValue;
            tr.layerFields.set("options", this._addLayerFieldOptions(tr));
            tr.layerFields.set("value", tr.layerFields.options[0], false);
            unitLabelNode = query(".esriCTToleranceValueText", tr)[0];
            unitValue = 0;
            unitLabel = this.nls.units["meters"];
            tr.toleranceSettings = {
              value: 0,
              unit: "meters"
            };
            domAttr.set(unitLabelNode, "innerHTML", unitValue + " " + unitLabel);
          })));
      },

      _createLayerChooserMapArgs: function () {
        var layerChooserFromMapArgs;
        layerChooserFromMapArgs = {
          multiple: false,
          createMapResponse: this.map.webMapResponse,
          filter: this._createFiltersForLayerSelector()
        };
        return layerChooserFromMapArgs;
      },

      _createIntersectionLayerfilter: function (validFieldSet) {
        return function (layerInfo) {
          var defLayerObject = layerInfo.getLayerObject();
          var hasValidField = false;
          defLayerObject.then(function (layerObject) {
            if (layerObject && layerObject.fields) {
              array.some(layerObject.fields, function (field) {
                if (validFieldSet.indexOf(field.type) > -1) {
                  hasValidField = true;
                  return true;
                }
              });
            }
          });
          return hasValidField;
        };
      },

      _createFiltersForLayerSelector: function () {
        var types, featureLayerFilter, imageServiceLayerFilter, filters, combinedFilter,
          intersectionLayerfilter, validFieldSet;

        types = ['point', 'polyline', 'polygon'];
        featureLayerFilter = LayerChooserFromMap.createFeaturelayerFilter(types, false, false);
        imageServiceLayerFilter = LayerChooserFromMap.createImageServiceLayerFilter(true);
        filters = [featureLayerFilter, imageServiceLayerFilter];
        combinedFilter = LayerChooserFromMap.orCombineFilters(filters);

        //Filter layers based on fieldType of the source field
        validFieldSet = this.ValidFieldsByType[this._fieldType];
        intersectionLayerfilter = this._createIntersectionLayerfilter(validFieldSet);

        //combine both the filters
        return LayerChooserFromMap.andCombineFilters([combinedFilter, intersectionLayerfilter]);
      },

      _initLayerSelector: function () {
        var defList, layerChooserFromMapArgs, layerInfosArray;
        defList = [];
        //create layerChooser and get its layerInfo so that all the filter required will be applied
        layerChooserFromMapArgs = this._createLayerChooserMapArgs();
        this._layerChooserFromMap = new LayerChooserFromMap(layerChooserFromMapArgs);
        this._layerChooserFromMap.startup();
        layerInfosArray = this._layerChooserFromMap.layerInfosObj.getLayerInfoArray();
        //Create total layers array
        this._getAllFilteredLayers(layerInfosArray, defList);
        return defList;
      },

      _getAllFilteredLayers: function (layerInfosArray, defList) {
        array.forEach(layerInfosArray, lang.hitch(this, function (currentLayer) {
          var layerDef;
          if (!currentLayer.isLeaf()) {
            this._getAllFilteredLayers(currentLayer.newSubLayers, defList);
          }
          else {
            layerDef = new Deferred();
            this._layerChooserFromMap.filter(currentLayer).then(
              lang.hitch(this, function (isValid) {
                if (isValid) {
                  this.totalLayers.push(currentLayer);
                  //consider only editable layers for apply on
                  if (this._isLayerEditable(currentLayer)) {
                    this._layersForApplyOn.push(currentLayer);
                  }
                }
                layerDef.resolve();
              }));
            defList.push(layerDef);
          }
        }));
      },

      _isLayerEditable: function (currentLayer) {
        var editCapabilites, isEditable = false;
        //check if we can get edit capabilites of the layer or not
        if (currentLayer && currentLayer.layerObject &&
          currentLayer.layerObject.getEditCapabilities) {
          editCapabilites = currentLayer.layerObject.getEditCapabilities();
          if (editCapabilites.canCreate || editCapabilites.canUpdate || editCapabilites.canDelete ||
            editCapabilites.canUpdateGeometry) {
            isEditable = true;
          }
        }
        return isEditable;
      },

      _addFieldsDropDown: function (tableRow, fieldData) {
        var fieldsColumn, dropDownContainer;
        fieldsColumn = query('.simple-table-cell', tableRow)[1];
        if (fieldsColumn) {
          dropDownContainer = domConstruct.create("div", {
            "class": "esriCTDropDownContainer"
          }, fieldsColumn);
          tableRow.layerFields = new Select({
            options: this._addLayerFieldOptions(tableRow),
            "class": "esriCTSettingsFieldDropdown"
          });
          tableRow.layerFields.placeAt(dropDownContainer);
          tableRow.layerFields.startup();
          if (fieldData) {
            tableRow.layerFields.set("value", fieldData.field, false);
          }
        }
      },
      _addLayerNameOptions: function () {
        var layers, options = [];
        layers = this.layerInfos.getLayerInfoArray();
        array.forEach(layers, lang.hitch(this, function (currentLayer) {
          if (currentLayer.layerObject.capabilities.indexOf("Query") > -1) {
            options.push({
              "label": currentLayer.layerObject.name,
              "value": currentLayer.layerObject.id
            });
          }
        }));
        return options;
      },
      _addLayerFieldOptions: function (row) {
        var selectedLayer, options = [], validFieldSet = [];
        if (!row.layerSelector.getSelectedItem()) {
          return options;
        }
        //if selected field type is string then only add the use layer name option
        if (this._fieldType === "esriFieldTypeString") {
          options.push({
            "label": this.nls.intersectionPage.useLayerName,
            "value": "esriCTUseLayerName"
          });
        }
        //get valid field for current field type
        validFieldSet = this.ValidFieldsByType[this._fieldType];
        selectedLayer = row.layerSelector.getSelectedItem().layerInfo.layerObject;
        array.forEach(selectedLayer.fields, lang.hitch(this, function (currentField) {
          //Filter fields based on type
          if (currentField.type !== "esriFieldTypeGeometry" &&
            currentField.type !== "esriFieldTypeBlob" &&
            currentField.type !== "esriFieldTypeRaster" &&
            currentField.type !== "esriFieldTypeXML" &&
            validFieldSet.indexOf(currentField.type) > -1) {
            options.push({
              "label": currentField.alias || currentField.name,
              "value": currentField.name
            });
          }
        }));
        return options;
      },
      showDialog: function () {
        var maxHeight = 600, autoHeight = false;
        if (!this.isGroup) {
          domClass.add(this.groupInfoNode1, "esriCTHidden");
          domClass.add(this.groupInfoNode2, "esriCTHidden");
          domClass.add(this.layerTableNode, "esriCTIntersectionTableMaxHeight");
          autoHeight = true;
          maxHeight = 400;
        }
        var fieldsPopup = new Popup({
          titleLabel: this.nls.actionPage.copyAction.intersection,
          width: 950,
          maxHeight: maxHeight,
          autoHeight: autoHeight,
          content: this,
          'class': this.baseClass,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              var data = {}, groupInfo = {};
              data.enabled = this.isEnabled;
              data.ignoreLayerRanking = this.ignoreLayerRanking.checked;
              data.fields = this._getTableData();
              if (this.isGroup) {
                //validate is groupname is valid
                if (!this.groupNameTextBox.isValid()) {
                  this.groupNameTextBox.focus();
                  return;
                }
              } else {
                delete this._fieldValues.Intersection.attributeActionGroupName;
              }
              if (!this._fieldValues.Intersection) {
                this._fieldValues.Intersection = {
                  "actionName": "Intersection"
                };
              }
              lang.mixin(this._fieldValues.Intersection, data);
              if (this.isGroup) {
                groupInfo.name = this.groupNameTextBox.get("value");
                groupInfo.dataType = this.dataTypeDropdown.get("value");
                groupInfo.attributeInfo = data;
                groupInfo.appliedOn = this._layerAndFieldsApplyOnObj.getCheckedFields(groupInfo);
                this.emit("groupInfoUpdated", groupInfo);
              } else {
                this.emit("attributeActionUpdated");
              }
              fieldsPopup.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              fieldsPopup.close();
            })
          }],
          onClose: lang.hitch(this, function () {
          })
        });
      },
      _getTableData: function () {
        var fields = [], layerInfo;
        array.forEach(this._layerTable.getRows(), lang.hitch(this, function (currentRow) {
          if (currentRow.layerSelector) {
            layerInfo = {};
            layerInfo.layerId = currentRow.layerSelector.getSelectedItem().layerInfo.id;
            layerInfo.field = currentRow.layerFields.getValue();
            layerInfo.toleranceSettings = lang.clone(currentRow.toleranceSettings);
            fields.push(layerInfo);
          }
        }));
        return fields;
      },

      /**
      * This function is used to filter layerFields based on Data type selected
      */
      _createLayerFieldsFilter: function (fieldType) {
        var validFieldSet = [], layerDetails = {};
        array.forEach(this._layersForApplyOn, lang.hitch(this, function (layer) {
          if (!layer.isTable) {
            array.forEach(layer.layerObject.fields, lang.hitch(this, function (field) {
              if (this.ValidFieldsByTypeToApplyOn[fieldType]) {
                validFieldSet = this.ValidFieldsByTypeToApplyOn[fieldType];
                if (validFieldSet.indexOf(field.type) > -1 && field.editable) {
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
      * which will create UI for layer and fields to apply on
      */
      _createLayersAndFields: function () {
        this._layerAndFieldsApplyOnObj = new layersAndFieldsApplyOn({
          map: this.map,
          layerInfos: this.layerInfos,
          _configInfos: this._configInfos,
          actionName: "Intersection",
          nls: this.nls,
          prevName: this.prevName,
          existingGroups: this.existingGroups,
          layerDetails: this._createLayerFieldsFilter(this.dataTypeDropdown.get("value")),
          appliedOn: this.appliedOn
        });
        domConstruct.empty(this.tableParentContainer);
        this._layerAndFieldsApplyOnObj.placeAt(this.tableParentContainer);
        this._layerAndFieldsApplyOnObj.startup();
      },

      deleteGroup: function () {
        this._layerAndFieldsApplyOnObj.deleteGroup();
      }
    });
  });