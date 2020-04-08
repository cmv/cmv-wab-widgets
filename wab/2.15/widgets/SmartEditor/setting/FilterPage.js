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
// jscs:disable validateIndentation
define(
  ["dojo/_base/declare",
    "dojo/Evented",
    "dojo/_base/lang",
    'dojo/json',
    "dojo/text!./FilterPage.html",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    "jimu/dijit/Popup",
    'jimu/dijit/Filter',
    'esri/lang',
    "dijit/form/CheckBox",
    'dojo/dom-construct'
  ],
  function (
    declare,
    Evented,
    lang,
    JSON,
    template,
    _TemplatedMixin,
    BaseWidgetSetting,
    Popup,
    Filter,
    esriLang,
    CheckBox,
    domConstruct
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-filter-page",
      templateString: template,
      _filter: null,
      _url: null,
      _layerId: null,
      _layerDefinition: null,
      _validationTable: null,

      postCreate: function () {
        this.inherited(arguments);
        this._init();
      },
      _init: function () {
        this._origNLS = window.jimuNls.filterBuilder.matchMsg;

        window.jimuNls.filterBuilder.matchMsg = this.nls.filterPage.filterBuilder;

      },
      destroy: function () {
        window.jimuNls.filterBuilder.matchMsg = this._origNLS;
        if (this._filter) {
          this._filter.destroyRecursive();
          this._filter = null;
          delete this._filter;
        }
        if (this._submitHidden) {
          this._submitHidden.destroyRecursive();
          this._submitHidden = null;
          delete this._submitHidden;
        }
      },
      popup: function (tr) {
        var rowData;
        if (tr && this._validationTable) {
          rowData = this._validationTable.getRowData(tr);
        }
        //If setting is for'Hide' action show/hide the checkbox submitWhenHidden
        if (rowData && rowData.label === this.nls.actionPage.actions.hide) {
          this.submitWhenHidden.style.display = "block";
          this._submitHidden = new CheckBox({
            id: "submitHidden",
            checked: rowData.submitWhenHidden === undefined ? false : rowData.submitWhenHidden,
            value: this.nls.filterPage.submitHidden
          }, null);
          this.submitWhenHidden.appendChild(this._submitHidden.domNode);
          var labelDiv = lang.replace("<label class='submithide' for='submitWhenHidden'>{replace}</label></br></br>",
            {
              replace: this.nls.filterPage.submitHidden
            });
          domConstruct.place(labelDiv, this._submitHidden.domNode, "after");

        } else {
          this.submitWhenHidden.style.display = "none";

        }
        this._filter = new Filter({
          style: "width:100%;margin-top:22px;",
          noFilterTip: this.nls.filterPage.noFilterTip
        });
        this._filter.placeAt(this.filterControl);
        var title;
        if (rowData) {
          title = rowData.label;
        } else {
          title = this._groupName;
        }
        var filterPopup = new Popup({

          titleLabel: esriLang.substitute(
            {
              action: title
            },
            this.nls.filterPage.title),
          width: 850,
          height: 485,
          content: this,
          rowData: rowData,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              var partsObj = this._filter.toJson();
              var submitWhenHidden = false;
              if (this._submitHidden && this._submitHidden.checked) {
                submitWhenHidden = this._submitHidden.checked;
              }
              if (partsObj && partsObj.expr) {
                if (partsObj.expr === '1=1') {
                  if (this._validationTable) {
                    this._validationTable.editRow(tr,
                      {
                        'expression': '',
                        'filter': null,
                        'submitWhenHidden': submitWhenHidden
                      });
                  } else {
                    this._filterInfo = {
                      'expression': '',
                      'filter': null,
                      'submitWhenHidden': submitWhenHidden
                    };
                    this.emit("filterInfo", this._filterInfo);
                  }
                } else {
                  if (this._validationTable) {
                    this._validationTable.editRow(tr,
                      {
                        'expression': partsObj.displaySQL,
                        'filter': JSON.stringify(partsObj),
                        'submitWhenHidden': submitWhenHidden
                      });
                  } else {

                    this._filterInfo = {
                      'expression': partsObj.displaySQL,
                      'filter': JSON.stringify(partsObj),
                      'submitWhenHidden': submitWhenHidden
                    };
                    this.emit("filterInfo", this._filterInfo);
                  }
                }
                filterPopup.close();
              }
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn jimu-btn-vacation'],
            onClick: function () {
              filterPopup.close();

            }
          }]
        });

        var filterInfo;
        if (rowData) {
          filterInfo = rowData;
        } else if (this._filterInfo) {
          filterInfo = this._filterInfo;
        }

        if (filterInfo) {
          if (filterInfo.filter === undefined ||
            filterInfo.filter === null ||
            filterInfo.filter === '') {
            this._filter.build({
              url: this._url,
              partsObj: null,
              layerDefinition: this._layerDefinition,
              featureLayerId: this._layerId
            });
          }
          else {
            if (filterInfo.filter.parts) {
              this._filter.build({
                url: this._url,
                partsObj: filterInfo.filter,
                layerDefinition: this._layerDefinition,
                featureLayerId: this._layerId
              });
            } else {
              this._filter.build({
                url: this._url,
                partsObj: JSON.parse(filterInfo.filter),
                layerDefinition: this._layerDefinition,
                featureLayerId: this._layerId
              });
            }

          }
        }
      }

    });
  });