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
    "dojo/query",
    "dojo/dom-style",
    "dijit/registry",
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/on',
    'dojo/dom-construct',
    "dojo/text!./CopyAttributes.html",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    "jimu/dijit/Popup",
    'esri/lang',
    "./Intersection",
    "./Coordinates",
    "./Address"
  ],
  function (
    declare,
    Evented,
    query,
    domStyle,
    registry,
    lang,
    array,
    on,
    domConstruct,
    template,
    _TemplatedMixin,
    BaseWidgetSetting,
    Table,
    Popup,
    esriLang,
    Intersection,
    Coordinate,
    Address
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-rule-table",
      templateString: template,
      _resourceInfo: null,
      _url: null,
      _fieldName: null,
      _fieldValues: null,
      _configuredFieldValues: null,
      _layerId: null,
      _validGeocoderFields: [],
      _fieldsPopUp: null,
      _removeGroupInfo: null,
      _cbxForActionsWithGroupName: [],
      //Constants to store thedictionary of valid field mappings for Coordinates and Intersection/Address
      ValidFieldsForCoordinates: ["esriFieldTypeSmallInteger", "esriFieldTypeInteger",
        "esriFieldTypeSingle", "esriFieldTypeDouble", "esriFieldTypeString"],
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

      postCreate: function () {
        this.inherited(arguments);
        this._fieldsPopUp = null;
        this._configuredFieldValues = [];
        this._removeGroupInfo = null;
        this._initActionsTable();
        this._setActionsTable();

      },
      getSettings: function () {
        return this._fieldValues;
      },

      _getConfigActionOrder: function () {
        var result = [], defaultResult = [];
        if (this.isRelatedLayer) {
          defaultResult = ["Preset"];
        }
        else {
          // Add Intersection by default as atleast same layer with same field type can be configured
          defaultResult = ['Intersection'];
          // Based on source filed's type get the valid fields from selected geocoder settings
          this._validGeocoderFields = this._getValidGeocoderFields();
          // If any field can be used from geocoder then only show the Address option in list
          if (this._validGeocoderFields.length) {
            defaultResult.push('Address');
          }
          // Based on source filed's type check if coordinates can be shon in the list or not
          if (this.ValidFieldsForCoordinates.indexOf(this._fieldType) > -1) {
            defaultResult.push('Coordinates');
          }
          //Preset will be availabel by default
          defaultResult.push('Preset');
        }
        //If already configured, then get the action from previously configured actions
        if (this._fieldValues !== undefined &&
          this._fieldValues !== null) {
          if (this._fieldValues.hasOwnProperty(this._fieldName)) {
            array.forEach(this._fieldValues[this._fieldName], function (action) {
              //To filter out previously configured wrong action check if action is now valid
              //For e.g. if coordinates was configured on date field now it will not be shown
              if (defaultResult.indexOf(action.actionName) > -1) {
                result.push(action.actionName);
              }
            });
            if (result === null || result.length === 0) {
              return defaultResult;
            } else {
              return result;
            }
          }
        }
        return defaultResult;
      },

      _getValidGeocoderFields: function () {
        var validFieldTypes = [], currentFieldGeocoderFields = [];
        validFieldTypes = this.ValidFieldsByType[this._fieldType];
        if (this._geocoderSettings && this._geocoderSettings.hasOwnProperty('url')) {
          currentFieldGeocoderFields = array.filter(this._geocoderSettings.fields,
            function (field) {
              if (validFieldTypes.indexOf(field.type) > -1) {
                return true;
              } else {
                return false;
              }
            });
        }
        return currentFieldGeocoderFields;
      },

      _getConfigAction: function (actionName) {
        var result = null;
        if (this._fieldValues !== undefined &&
          this._fieldValues !== null) {
          if (this._fieldValues.hasOwnProperty(this._fieldName)) {
            array.some(this._fieldValues[this._fieldName], function (action) {
              return action.actionName === actionName ? (result = action, true) : false;
            });
            return result;
          }
        }
        return result;
      },

      _nlsActionToConfig: function (label) {
        switch (label) {
          case this.nls.actionPage.copyAction.intersection:
            return "Intersection";
          case this.nls.actionPage.copyAction.address:
            return "Address";
          case this.nls.actionPage.copyAction.coordinates:
            return "Coordinates";
          case this.nls.actionPage.copyAction.preset:
            return "Preset";
          default:
            return label;
        }
      },
      popupActionsPage: function () {
        if (this._fieldsPopUp) {
          this._fieldsPopUp.close();
          this._fieldsPopUp = null;
        }
        this._fieldsPopUp = new Popup({
          titleLabel: esriLang.substitute(
            { fieldname: this._fieldName },
            this.nls.actionPage.title),
          width: 920,
          maxHeight: 600,
          autoHeight: true,
          content: this,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              var rows = this._copyAttrTable.getRows();
              if (this._fieldValues === undefined ||
                this._fieldValues === null) {
                this._fieldValues = {};
              }
              this._fieldValues[this._fieldName] = [];
              array.forEach(rows, function (row) {
                var removeGroupInfo;
                var rowData = this._copyAttrTable.getRowData(row);
                var newAction = {};
                newAction.actionName = this._nlsActionToConfig(rowData.actionName);
                //get the configured values
                if (this._configuredFieldValues[newAction.actionName]) {
                  lang.mixin(newAction, this._configuredFieldValues[newAction.actionName]);
                } else {
                  lang.mixin(newAction, { "enabled": false });
                }
                //get the action enabled value from the row's enabled checkbox
                lang.mixin(newAction, { "enabled": rowData.enabled });
                //in case of preset, add the field name in _configuredPresetInfos if not found
                if (newAction.actionName === "Preset" && this._configuredPresetInfos &&
                  !this._configuredPresetInfos.hasOwnProperty(this._fieldName)) {
                  this._configuredPresetInfos[this._fieldName] = [""];
                }
                //when unchecked any action from layer and if it has group name
                //remove it from group
                if (!newAction.enabled && rowData.attributeActionGroupName) {
                    removeGroupInfo = {
                      groupName: rowData.attributeActionGroupName,
                      layerId: this._layerId,
                      fieldName: this._fieldName,
                      action: newAction.actionName
                    };
                  this.removeFromGroup(removeGroupInfo);
                  delete newAction.attributeActionGroupName;
                  }
                this._fieldValues[this._fieldName].push(newAction);
              }, this);
              this._fieldsPopUp.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              this._fieldsPopUp.close();
            })
          }],
          onClose: lang.hitch(this, function () {
          })
        });
      },

      _initActionsTable: function () {
        var fields2 = [{
          name: 'enabled',
          title: this.nls.actionPage.copyAction.enableText,
          type: 'checkbox',
          width: '15%'
        }, {
          name: 'actionName',
          title: this.nls.actionPage.copyAction.actionText,
          type: 'text'
        }, {
          name: 'attributeActionGroupName',
          title: this.nls.actionPage.actionsSettingsTable.groupName,
          type: 'text'
        }, {
          name: 'actions',
          title: this.nls.actionPage.copyAction.criteriaText,
          type: 'actions',
          actions: ['up', 'down', 'edit'],
          'class': 'actions'
        }];
        var args2 = {
          fields: fields2,
          selectable: false,
          style: {
            'height': '300px',
            'maxHeight': '300px'
          }
        };
        this._copyAttrTable = new Table(args2);
        this._copyAttrTable.placeAt(this.copyAttributeTable);
        this._copyAttrTable.startup();
        this.own(on(this._copyAttrTable, 'actions-edit',
          lang.hitch(this, this._onActionEdit)));
      },

      _onActionEdit: function (tr) {
        var rowData;
        this._removeGroupInfo = null;
        rowData = this._copyAttrTable.getRowData(tr);
        if (rowData.attributeActionGroupName) {
          var contentDiv, editOptionsPopup;
          contentDiv = domConstruct.create("div");
          domConstruct.create("div", {
            "innerHTML": this.nls.actionPage.editOptionsPopup.editAttributeGroup,
            "className": "settingsDesc"
          }, contentDiv);
          domConstruct.create("div", {
            "innerHTML": this.nls.actionPage.editOptionsPopup.editAttributeGroupHint,
            "className": "editGroupHint"
          }, contentDiv);

          editOptionsPopup = new Popup({
            titleLabel: this.nls.actionPage.editOptionsPopup.popupTitle,
            width: 500,
            maxHeight: 445,
            autoHeight: true,
            content: contentDiv,
            'class': this.baseClass,
            buttons: [{
              label: this.nls.actionPage.editOptionsPopup.editGroupButton,
              onClick: lang.hitch(this, function () {
                this._editGroup(rowData);
                editOptionsPopup.close();
              })
            }, {
              label: this.nls.actionPage.editOptionsPopup.editIndependentlyButton,
              //disable edit independently button in case of preset group
              disable: rowData.actionName === "Preset" ? true : false,
              onClick: lang.hitch(this, function () {
                if (rowData.attributeActionGroupName) {
                  this._removeGroupInfo = {
                    groupName: rowData.attributeActionGroupName,
                    layerId: this._layerId,
                    fieldName: this._fieldName,
                    action: this._nlsActionToConfig(rowData.actionName)
                  };
                }
                this._onEditFieldInfoClick(tr);
                editOptionsPopup.close();
              })
            }]
          });
        } else {
          this._onEditFieldInfoClick(tr);
        }
      },

      _onEditFieldInfoClick: function (tr) {
        var clickedAction;
        clickedAction = this._copyAttrTable.getRowData(tr).actionName;
        switch (clickedAction) {
          case this.nls.actionPage.copyAction.intersection:
            this._createIntersectionPanel(tr);
            break;
          case this.nls.actionPage.copyAction.address:
            //check if geocoder is configured or not
            if (this._geocoderSettings && this._geocoderSettings.hasOwnProperty('url')) {
              this._createAddressPanel(tr);
            } else {
              this.emit("SetGeocoder");
            }
            break;
          case this.nls.actionPage.copyAction.coordinates:
            this._createCoordinatesPanel(tr);
            break;
        }
      },

      _removeFromGroup: function (tr) {
        if (this._removeGroupInfo) {
          this.removeFromGroup(this._removeGroupInfo);
          this._copyAttrTable.editRow(tr,
            {
              attributeActionGroupName: null
            });
        }
      },

      _createIntersectionPanel: function (tr) {
        this._intersectionDijit = Intersection({
          nls: this.nls,
          _fieldValues: this._configuredFieldValues,
          layerInfos: this.layerInfos,
          map: this.map,
          _fieldType: this._fieldType,
          isGroup: false,
          ValidFieldsByType: this.ValidFieldsByType
        });
        this.own(on(this._intersectionDijit, "attributeActionUpdated",
          lang.hitch(this, function () {
            this._removeFromGroup(tr);
          })));
      },

      _createCoordinatesPanel: function (tr) {
        this._coordinatesDijit = Coordinate({
          nls: this.nls,
          isGroup: false,
          _fieldType: this._fieldType,
          _fieldValues: this._configuredFieldValues
        });
        this.own(on(this._coordinatesDijit, "attributeActionUpdated",
          lang.hitch(this, function () {
            this._removeFromGroup(tr);
          })));
      },

      _createAddressPanel: function (tr) {
        this._addressDijit = Address({
          nls: this.nls,
          _fieldValues: this._configuredFieldValues,
          _geocoderSettings: this._geocoderSettings,
          _validGeocoderFields: this._validGeocoderFields,
          isGroup: false
        });
        this.own(on(this._addressDijit, "attributeActionUpdated",
          lang.hitch(this, function () {
            this._removeFromGroup(tr);
          })));
      },

      _setActionsTable: function () {
        var actions = this._getConfigActionOrder();
        this._cbxForActionsWithGroupName = [];
        array.forEach(actions, function (action) {
          var configAction = this._getConfigAction(action);
          var actionLbl = action;
          switch (action) {
            case "Intersection":
              if (this.nls.actionPage.hasOwnProperty("copyAction")) {
                if (this.nls.actionPage.copyAction.hasOwnProperty("intersection")) {
                  actionLbl = this.nls.actionPage.copyAction.intersection;
                }
              }
              break;
            case "Address":
              if (this.nls.actionPage.hasOwnProperty("copyAction")) {
                if (this.nls.actionPage.copyAction.hasOwnProperty("address")) {
                  actionLbl = this.nls.actionPage.copyAction.address;
                }
              }
              break;
            case "Coordinates":
              if (this.nls.actionPage.hasOwnProperty("copyAction")) {
                if (this.nls.actionPage.copyAction.hasOwnProperty("coordinates")) {
                  actionLbl = this.nls.actionPage.copyAction.coordinates;
                }
              }
              break;
            case "Preset":
              if (this.nls.actionPage.hasOwnProperty("copyAction")) {
                if (this.nls.actionPage.copyAction.hasOwnProperty("preset")) {
                  actionLbl = this.nls.actionPage.copyAction.preset;
                }
              }
              break;
            default:
              actionLbl = action;
              break;
          }
          var settings = {
            actionName: actionLbl
          };
          //set configured field Values if available
          //else set defaults to false
          if (configAction !== undefined && configAction !== null) {
            this._configuredFieldValues[action] = configAction;
          } else {
            this._configuredFieldValues[action] = { "enabled": false };
            //when action is intersection by defalut set fields to empty
            if (action === "Intersection") {
              this._configuredFieldValues[action].fields = [];
            }
            //when action is coordinates set default option as mapspatial ref and x
            if (action === "Coordinates") {
              this._configuredFieldValues[action].coordinatesSystem = "MapSpatialReference";
              this._configuredFieldValues[action].field = "x";
            }
          }
          //sets the enabled option the table row
          settings.enabled = this._configuredFieldValues[action].enabled;
          //Show attribute action group name if this action is applied from group
          if (this._configuredFieldValues[action].hasOwnProperty('attributeActionGroupName')) {
            settings.attributeActionGroupName =
              this._configuredFieldValues[action].attributeActionGroupName;
          }

          //for cancelling usage of different types of feilds in same preset group
          //we need to diasble those feilds preset cation which dont have attribute actionGroupName
          //if action is 'Preset' hide the edit icon from the preset row
          if (settings.enabled && action === "Preset") {
            if (!this._configuredFieldValues[action].hasOwnProperty('attributeActionGroupName')) {
              settings.enabled = false;
            }
          }

          //add new row for the action
          var newRow = this._copyAttrTable.addRow(settings);

          //get instance of enable checkbox
          var dom = query('.jimu-checkbox', newRow.tr)[0];
          var cbx = registry.byNode(dom);

          //if action is 'Preset' hide the edit icon from the preset row
          if (action === "Preset") {
            //in case of preset action without groupname
            //disable the checkbox to enable preset action and hide edit icon
            if (!this._configuredFieldValues[action].hasOwnProperty('attributeActionGroupName')) {
              cbx.set("disabled", true);
              var editIcon = query(".jimu-icon-edit", newRow.tr);
              if (editIcon && editIcon.length > 0) {
                domStyle.set(editIcon[0], "display", "none");
              }
            }
          }
          //if action has group name, show warning note when ation is unchecked
          if (this._configuredFieldValues[action].hasOwnProperty('attributeActionGroupName')) {
            this._cbxForActionsWithGroupName.push(cbx);
            this.own(on(cbx, "change", lang.hitch(this, function () {
              var hideWarningNote = true;
              //if any one checkbox with group name is unchecked show warning note
              //else hide it
              array.some(this._cbxForActionsWithGroupName, function (eachCbx) {
                if (!eachCbx.getValue()) {
                  hideWarningNote = false;
                  domStyle.set(this.warningNote, "display", "block");
                  return;
                }
              }, this);
              if (hideWarningNote) {
                domStyle.set(this.warningNote, "display", "none");
              }
            })));
          }
        }, this);
      },

      geocoderConfigured: function () {
        if (this._geocoderSettings && this._geocoderSettings.hasOwnProperty('url')) {
          this._createAddressPanel();
        }
      },

      _editGroup: function (rowData) {
        var groupName, action;
        groupName = rowData.attributeActionGroupName;
        action = this._nlsActionToConfig(rowData.actionName);
        if (this._copyAttrTable) {
          var allRows = this._attributeActionsTable[action].getRows();
          array.some(allRows, function (row) {
            var rowData = this._attributeActionsTable[action].getRowData(row);
            if (rowData.name === groupName) {
              this._fieldsPopUp.close();
              this.onGroupEditingStart(this.nls.layersPage.attributeActionsTabTitle);
              this._attributeActionsTable[action]._onActionsEdit(row);
              return true;
            }
          }, this);
        }
      },

      onGroupEditingStart: function (tabTitle) {
        this.emit("onGroupEditingStart", tabTitle);
      },
      removeFromGroup: function (info) {
        this.emit("removeFromGroup", info);
      }

    });
  });