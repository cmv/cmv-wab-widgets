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
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/on',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/json',
    "dojox/html/entities",
    "dojo/text!./FieldValidation.html",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    "jimu/dijit/Popup",
    "./FilterPage"
  ],
  function (
    declare,
    lang,
    array,
    on,
    domConstruct,
    query,
    JSON,
    entities,
    template,
    _TemplatedMixin,
    BaseWidgetSetting,
    Table,
    Popup,
    FilterPage
  ) {
    return declare([BaseWidgetSetting, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-rule-table",
      templateString: template,
      _resourceInfo: null,
      _url: null,
      _fieldName: null,
      _fieldValidations: null,
      _layerId: null,
      _fieldsPopUp: null,

      postCreate: function () {
        this.inherited(arguments);
        this._fieldsPopUp = null;
        this._initActionsTable();

        this._setActionsTable();

      },
      getSettings: function () {
        return this._fieldValidations;
      },
      _getConfigActionOrder: function () {
        var result = [];
        if (this._fieldValidations !== undefined &&
          this._fieldValidations !== null) {
          if (this._fieldValidations.hasOwnProperty(this._fieldName)) {
            array.forEach(this._fieldValidations[this._fieldName], function (action) {
              result.push(action.actionName);
            });
            if (result === null || result.length === 0) {
              return ['Hide', 'Required', 'Disabled'];
            } else {
              return result;
            }
          }
        }
        return ['Hide', 'Required', 'Disabled'];
      },
      _getConfigAction: function (actionName) {
        var result = null;
        if (this._fieldValidations !== undefined &&
          this._fieldValidations !== null) {
          if (this._fieldValidations.hasOwnProperty(this._fieldName)) {
            array.some(this._fieldValidations[this._fieldName], function (action) {
              return action.actionName === actionName ? (result = action, true) : false;
            });
            return result;
          }
        }
        return result;
      },

      _nlsActionToConfig: function (label) {
        switch (label) {
          case this.nls.actionPage.actions.hide:
            return "Hide";
          case this.nls.actionPage.actions.disabled:
            return "Disabled";
          case this.nls.actionPage.actions.required:
            return "Required";
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
          titleLabel: this.popupTitle,
          width: 920,
          maxHeight: 600,
          autoHeight: true,
          content: this,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              var rows = this._validationTable.getRows();
              if (this._fieldValidations === undefined ||
                this._fieldValidations === null) {
                this._fieldValidations = {};
              }

              //this._fieldActions[this._fieldName] = [];
              this._fieldValidations[this._fieldName] = [];
              array.forEach(rows, function (row) {
                var rowData = this._validationTable.getRowData(row);

                var newAction = {};

                newAction.actionName = this._nlsActionToConfig(rowData.label);
                newAction.submitWhenHidden = rowData.submitWhenHidden;
                if (rowData.expression !== undefined && rowData.expression !== null &&
                  rowData.expression !== '') {
                  if (rowData.filter !== '') {
                    var filter = JSON.parse(entities.decode(rowData.filter));
                    newAction.expression = filter.expr;
                    newAction.filter = filter;
                  }
                }
                this._fieldValidations[this._fieldName].push(newAction);
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
          name: 'label',
          title: this.nls.actionPage.actionsSettingsTable.rule,
          type: 'text',
          width: '15%',
          'class': 'rule'
        }, {
          name: 'expression',
          title: this.nls.actionPage.actionsSettingsTable.expression,
          type: 'text',
          width: '55%',
          'class': 'expression'
        },
        {
          name: 'groupName',
          title: this.nls.actionPage.actionsSettingsTable.groupName,
          type: 'text',
          width: '20%',
          'class': 'expression'
        },
        {
          name: 'submitWhenHidden',
          title: 'submitWhenHidden',
          type: 'checkbox',
          hidden: true
        },
        {
          name: 'filter',
          title: 'filter',
          type: 'text',
          hidden: true
        },
        {
          name: 'actions',
          title: this.nls.actionPage.actionsSettingsTable.actions,
          type: 'actions',
          actions: ['up', 'down', 'edit'],
          width: '10%',
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
        this._validationTable = new Table(args2);
        this._validationTable.onBeforeRowEdit = lang.hitch(this, function (tr) {
          var rowData;
          rowData = this._validationTable.getRowData(tr);
          if (rowData.groupName) {
            var contentDiv, editOptionsPopup;
            contentDiv = domConstruct.create("div");
            domConstruct.create("div", {
              "innerHTML":this.nls.actionPage.editOptionsPopup.expression,
              "className": "settingsDesc"
            }, contentDiv);
            domConstruct.create("div", {
              "innerHTML": this.nls.actionPage.editOptionsPopup.editGroupHint,
              "className" : "editGroupHint"
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
                  this._editGroup(rowData.groupName);
                  editOptionsPopup.close();
                })
              }, {
                label: this.nls.actionPage.editOptionsPopup.editIndependentlyButton,
                onClick: lang.hitch(this, function () {
                  this._validationTable._onActionsEdit(tr);
                  editOptionsPopup.close();
                })
              }]
            });
          } else {
            this._validationTable._onActionsEdit(tr);
          }

        });
        this.own(on(this._validationTable, "row-edit", lang.hitch(this, function (tr) {
          var rowData;
          rowData = this._validationTable.getRowData(tr);
          if (rowData.groupName) {
            var info = {
              groupName: rowData.groupName,
              layerId: this._layerId,
              fieldName: this._fieldName,
              action: this._nlsActionToConfig(rowData.label)
            };
            this.removeFromGroup(info);
            this._validationTable.editRow(tr,
              {
                groupName: null
              });
          }

        })));
        this._validationTable.placeAt(this.validationTable);
        this._validationTable.startup();
        var nl = query("th.simple-table-field", this._validationTable.domNode);
        nl.forEach(function (node) {
          var scrubText = (node.innerText === undefined || node.innerText === "") ?
            "" : node.innerText.replace(/(\r\n|\n|\r)/gm, "");
          switch (scrubText) {
            case this.nls.actionPage.actionsSettingsTable.rule:
              node.title = this.nls.actionPage.actionsSettingsTable.ruleTip;
              break;
            case this.nls.actionPage.actionsSettingsTable.expression:
              node.title = this.nls.actionPage.actionsSettingsTable.expressionTip;
              break;

            case this.nls.actionPage.actionsSettingsTable.actions:
              node.title = this.nls.actionPage.actionsSettingsTable.actionsTip;
              break;
            case this.nls.actionPage.actionsSettingsTable.groupName:
              node.title = this.nls.actionPage.actionsSettingsTable.groupNameTip;
              break;


          }

        }, this);
        this.own(on(this._validationTable,
          'actions-edit',
          lang.hitch(this, this._onEditFieldInfoClick)));
        this.own(on(this._validationTable,
          'actions-delete',
          lang.hitch(this, this._onDeleteFieldInfoClick)));
      },

      _onDeleteFieldInfoClick: function (tr) {

        this._removeFilter(tr);

      },
      _onEditFieldInfoClick: function (tr) {

        this._showFilter(tr);

      },

      _setActionsTable: function () {
        var actions = this._getConfigActionOrder();
        array.forEach(actions, function (action) {
          var configAction = this._getConfigAction(action);
          var actionLbl = action;
          switch (action) {
            case "Hide":
              if (this.nls.actionPage.hasOwnProperty("actions")) {
                if (this.nls.actionPage.actions.hasOwnProperty("hide")) {
                  actionLbl = this.nls.actionPage.actions.hide;
                }
              }
              break;
            case "Required":
              if (this.nls.actionPage.hasOwnProperty("actions")) {
                if (this.nls.actionPage.actions.hasOwnProperty("required")) {
                  actionLbl = this.nls.actionPage.actions.required;
                }
              }
              break;
            case "Disabled":
              if (this.nls.actionPage.hasOwnProperty("actions")) {
                if (this.nls.actionPage.actions.hasOwnProperty("disabled")) {
                  actionLbl = this.nls.actionPage.actions.disabled;
                }
              }
              break;
            default:
              actionLbl = action;
              break;
          }
          var settings = {
            label: actionLbl,
            expression: null
          };
          if (configAction !== undefined && configAction !== null) {
            if (configAction.hasOwnProperty("filter")) {
              if (configAction.filter !== undefined &&
                configAction.filter !== null) {
                if (configAction.filter.smartActionGroupName) {
                  settings.groupName = configAction.filter.smartActionGroupName;
                }
                settings.filter = JSON.stringify(configAction.filter);
                settings.expression = configAction.filter.expr;
              }
            }
            if (configAction.hasOwnProperty("expression")) {
              settings.expression = configAction.expression;
            }
            if (configAction.hasOwnProperty("submitWhenHidden")) {
              settings.submitWhenHidden = configAction.submitWhenHidden;
            }
          }
          //  if (configAction.expression !== undefined &&
          //    configAction.expression !== null && configAction.expression !== '') {

          //    settings.expression = configAction.expression;
          //    settings.submitWhenHidden = configAction.submitWhenHidden;
          //    settings.filter = JSON.stringify(configAction.filter);
          //  }
          //}
          this._validationTable.addRow(settings);


        }, this);
      },
      _removeFilter: function (tr) {
        this._validationTable.editRow(tr,
          {
            'expression': '',
            'filter': null,
            'submitWhenHidden': false
          });
      },
      _showFilter: function (tr) {
        if (this._filterPage) {
          this._filterPage.destroy();
        }

        this._filterPage = new FilterPage({
          nls: this.nls,
          _resourceInfo: this._resourceInfo,
          _url: this._url,
          _layerId: this._layerId,
          _validationTable: this._validationTable
        });
        this._filterPage.popup(tr);
      },

      _editGroup: function (groupName) {
        if (this._smartActionsTable) {
          var allRows = this._smartActionsTable.getRows();
          array.some(allRows, function (row) {
            var rowData = this._smartActionsTable.getRowData(row);
            if (rowData.name === groupName) {
              this._fieldsPopUp.close();
              this.onGroupEditingStart();
              this._smartActionsTable._onActionsEdit(row);
              return true;
            }
          }, this);
        }
      },

      onGroupEditingStart: function () { },
      removeFromGroup: function (info) {
        /*jshint unused: false */
       }

    });
  });