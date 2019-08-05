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
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/dom-attr',
    "dojox/html/entities",
    'dojo/on',
    'dojo/query',
    'dojo/Deferred',
    "dojo/text!./SmartActionGroup.html",
    'dijit/_TemplatedMixin',
    'jimu/dijit/LayerChooserFromMap',
    'jimu/dijit/LayerChooserFromMapWithDropbox',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    'jimu/dijit/Popup',
    'dijit/form/ValidationTextBox',
    'jimu/dijit/CheckBox',
    'jimu/dijit/Message',
    "./FilterPage"
  ],
  function (
    declare,
    Evented,
    lang,
    array,
    domConstruct,
    domClass,
    domStyle,
    domAttr,
    entities,
    on,
    query,
    Deferred,
    template,
    _TemplatedMixin,
    LayerChooserFromMap,
    LayerChooserFromMapWithDropbox,
    BaseWidgetSetting,
    Table,
    Popup,
    TextBox,
    CheckBox,
    Message,
    FilterPage
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-smartActionGroup",
      templateString: template,
      _totalLayers: [],
      _prevAppliedOn: [],
      filterInfo: { filter: "" },


      postCreate: function () {
        this.inherited(arguments);
        this._totalLayers = [];
        this._prevAppliedOnLayers = [];
        if (this.appliedOn) {
          this._prevAppliedOnLayers = lang.clone(Object.keys(this.appliedOn));
        }
        this._initComponents();
      },

      _initComponents: function () {
        //Create Textbox to enter GroupName
        this.groupNameTextBox = new TextBox({
          required: true,
          trim: true,
          "class": "esriCTGroupNameTextBox"
        }, domConstruct.create("div", {}, this.groupNameTextBoxNode));
        //validate groupname for not empty and unique
        this.groupNameTextBox.validator = lang.hitch(this, function (value) {
          if (!value) {
            this.groupNameTextBox.set("invalidMessage",
              this.nls.smartActionsPage.requiredGroupNameMsg);
            return false;
          }
          if (value !== this.prevName &&
            this.existingGroupNames.indexOf(value) > -1) {
            this.groupNameTextBox.set("invalidMessage",
              this.nls.smartActionsPage.uniqueGroupNameMsg);
            return false;
          }
          return true;
        });

        if (this.name) {
          this.groupNameTextBox.set('value', this.name);
        }
        //Init Layer Selector to allow selecting layer for creating expression
        this._initLayerSelector();
        //Cerate Textbox to show expression configured
        this.expressionTextBox = new TextBox({
          disabled: true,
          required: true,
          "class": "esriCTTextBoxNode",
          promptMessage: this.nls.smartActionsPage.invalidExpression
        }, domConstruct.create("div", {}, this.expressionTextBoxNode));
        if (this.filterInfo && this.filterInfo.expression) {
          this.expressionTextBox.set('value', this.filterInfo.expression);
        }
        //On click of edit icon show filter page to configure filtter settings
        this.own(on(this.editExpressionIconNode, "click", lang.hitch(this, this._showFilter)));
        //Show Checkbox to submit data when filed is hidden
        this._submitHidden = new CheckBox({
          'label': this.nls.smartActionsPage.submitAttributeText
        }, domConstruct.create("div", {}, this.submitWhenHiddenNode));
        if (this.submitWhenHidden) {
          this._submitHidden.setValue(this.submitWhenHidden);
        }
        this._createTable(this.appliedOn);
      },

      _addLayersDropDown: function () {
        var layerChooserFromMapArgs, layerSelector, layerChooserFromMap,
          selectedLayerInfo, selectedLayer;
        //create layerChooser args
        layerChooserFromMapArgs = this._createLayerChooserMapArgs();
        layerChooserFromMap = new LayerChooserFromMap(layerChooserFromMapArgs);
        layerChooserFromMap.startup();

        layerSelector =
          new LayerChooserFromMapWithDropbox({ layerChooser: layerChooserFromMap });
        layerSelector.placeAt(this.layerSelectorDiv);
        layerSelector.startup();

        this._layerSelector = layerSelector;
        //by default show first layer
        selectedLayer = this._totalLayers[0];
        //if prev selected layer availble set it
        if (this.layerForExpression) {
          selectedLayerInfo = this._jimuLayerInfos.getLayerOrTableInfoById(this.layerForExpression);
          if (selectedLayerInfo) {
            selectedLayer = selectedLayerInfo.layerObject;
          }
        }
        //setSelectedLayer in layerSelector
        this._layerSelector.setSelectedLayer(selectedLayer);
        this.own(on(this._layerSelector, "selection-change", lang.hitch(this, function () {
          //if expression is set show warning msg and clear expression
          if (this.expressionTextBox.get("value")) {
            new Message({
              message: this.nls.smartActionsPage.warningMsgOnLayerChange
            });
            var filterInfo = {
              expression: "",
              filter: null,
              submitWhenHidden: false
            };
            this.onFilterInfoChanged(filterInfo);
          }
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

      _createFiltersForLayerSelector: function () {
        var types, featureLayerFilter;
        types = ['point', 'polyline', 'polygon'];
        featureLayerFilter = LayerChooserFromMap.createFeaturelayerFilter(types, false, true);
        return featureLayerFilter;
      },

      _initLayerSelector: function () {
        var layerChooserFromMapArgs, layerInfosArray;
        //create layerChooser and get its layerInfo so that all the filter required will be applied
        layerChooserFromMapArgs = this._createLayerChooserMapArgs();
        this._layerChooserFromMap = new LayerChooserFromMap(layerChooserFromMapArgs);
        this._layerChooserFromMap.startup();
        layerInfosArray = this._layerChooserFromMap.layerInfosObj.getLayerInfoArray();
        var tableInfosArray = this._layerChooserFromMap.layerInfosObj.getTableInfoArray();
        if (tableInfosArray && tableInfosArray.length > 0) {

          layerInfosArray = layerInfosArray.concat(tableInfosArray);
        }
        var defList = [];
        //Create total layers array
        this._getAllFilteredLayers(layerInfosArray, defList);
      },

      _isLayerEditable: function (currentLayer) {
        var editCapabilites, isEditable = false;
        if (currentLayer && currentLayer.layerObject) {
          editCapabilites = currentLayer.layerObject.getEditCapabilities();
          if (editCapabilites.canCreate || editCapabilites.canUpdate || editCapabilites.canDelete ||
            editCapabilites.canUpdateGeometry) {
            isEditable = true;
          }
        }
        return isEditable;
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
                //if the layer is valid and is editable then only show in apply table
                if (isValid && this._isLayerEditable(currentLayer)) {
                  this._totalLayers.push(currentLayer);
                }
                layerDef.resolve();
              }));
            defList.push(layerDef);
          }
        }));
      },

      /**
       * Validate if configured group settings are valid or not
       */
      _validateGroup: function () {
        var selectedLayer;
        //Validate for valid groupName
        if (!this.groupNameTextBox.isValid()) {
          this.groupNameTextBox.focus();
          return false;
        }
        //Validate for valid layer in the layer for expression
        if (this._layerSelector) {
          selectedLayer = this._layerSelector.getSelectedItem();
          if (!selectedLayer || !selectedLayer.layerInfo || !selectedLayer.layerInfo.layerObject) {
            return false;
          }
        } else {
          return false;
        }
        //Validate for valid expression configured
        if (!this.expressionTextBox.isValid()) {
          this.expressionTextBox.set('disabled', false);
          this.expressionTextBox.focus();
          this.expressionTextBox.set('disabled', true);
          return false;
        }
        return true;
      },

      showDialog: function () {
        this._addLayersDropDown();
        var fieldsPopup = new Popup({
          titleLabel: "Configure Smart Action",
          width: 900,
          maxHeight: 500,
          autoHeight: false,
          content: this,
          'class': this.baseClass,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              var groupInfo = {};
              var selectedLayer = this._layerSelector.getSelectedItem().layerInfo.layerObject;
              if (this._validateGroup()) {
                groupInfo.name = this.groupNameTextBox.get('value');
                groupInfo.submitWhenHidden = this._submitHidden.checked;
                groupInfo.layerForExpression = selectedLayer.id;
                groupInfo.filterInfo = this.filterInfo;
                groupInfo.appliedOn = this.appliedOn;
                //first apply the configured settings(expr & priority of actions) on each field
                this._applySettingsInLayer(groupInfo);
                //Remove Priority and Existing Expression info from appliedOn before emiting
                for (var layerId in groupInfo.appliedOn) {
                  var allFields = groupInfo.appliedOn[layerId];
                  for (var field in allFields) {
                    if (allFields[field].hasOwnProperty('Priority')) {
                      delete allFields[field].Priority;
                    }
                    if (allFields[field].hasOwnProperty('ExistingExpressions')) {
                      delete allFields[field].ExistingExpressions;
                    }
                  }
                }
                this.emit("groupInfoUpdated", groupInfo);
                fieldsPopup.close();
              }
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
        //on popup open set the focus to group name textbox
        this.groupNameTextBox.focus();
        this._setMaxWidth();
      },
      _getTableData: function () {
        var fields = [], layerInfo;
        array.forEach(this._layerTable.getRows(), lang.hitch(this, function (currentRow) {
          if (currentRow.layerSelector) {
            layerInfo = {};
            layerInfo.layerId = currentRow.layerSelector.getSelectedItem().layerInfo.id;
            layerInfo.field = currentRow.layerFields.getValue();
            fields.push(layerInfo);
          }
        }));
        return fields;
      },

      _showFilter: function (tr) {
        //Validate for valid groupName
        if (!this.groupNameTextBox.isValid()) {
          this.groupNameTextBox.focus();
          return false;
        }
        if (this._filterPage) {
          this._filterPage.destroy();
        }
        var selectedLayer = this._layerSelector.getSelectedItem().layerInfo.layerObject;
        this._filterPage = new FilterPage({
          nls: this.nls,
          _resourceInfo: this._resourceInfo,
          _url: selectedLayer.url,
          _layerId: selectedLayer.id,
          _filterInfo: this.filterInfo,
          _groupName: this.groupNameTextBox.get('value')
        });
        //on filter info configured
        this.own(on(this._filterPage, "filterInfo", lang.hitch(this, function (filterInfo) {
          this.onFilterInfoChanged(filterInfo);
        })));
        this._filterPage.popup(tr);
      },

      onFilterInfoChanged: function (filterInfo) {
        this.filterInfo = lang.clone(filterInfo);
        this.filterInfo.filter = JSON.parse(entities.decode(this.filterInfo.filter));// jshint ignore:line
        this.expressionTextBox.set("value", filterInfo.expression);
        this._destroyTable();
        this._createTable(this.appliedOn);
      },

      /**Apply on table */
      _destroyTable: function () {
        domConstruct.empty(this.tableParentContainer);
      },


      _createHeaderObj: function (header, tr, index) {
        var headerIconDiv;
        var th = domConstruct.create('th');
        var headerTitleDiv = domConstruct.create('div', {
          innerHTML: header.title,
          title: header.title
        });
        var titleDivClasses = "esriCTTableHeaderTitle ";

        if (header.hasOwnProperty("headerIcon")) {
          headerIconDiv = domConstruct.create('div', {
            title: header.title
          });
        }

        if (index > 0) {
          domClass.add(th, "esriCTTableTH");
          domClass.add(headerTitleDiv, titleDivClasses);
          if (header.hasOwnProperty("headerIcon")) {
            domClass.add(headerIconDiv, "esriCTTableHeaderIcon " + header.headerIcon);
          }
        }
        var priorityColumnParentContainer = domConstruct.create('div', {
          "class": "esriCTPriorityColumnParentContainer"
        });
        var priorityColumnTitleParentDiv = domConstruct.create('div', {
          "class": "esriCTPriorityColumnParentDiv"
        });
        priorityColumnTitleParentDiv.appendChild(headerTitleDiv);

        if (header.hasOwnProperty("headerIcon")) {
          priorityColumnTitleParentDiv.appendChild(headerIconDiv);
        }

        var priorityNumberDiv = domConstruct.create('div', {
          "class": "esriCTPriorityNumberDiv"
        });
        if (index === 4) {
          domConstruct.create('div', {
            "class": "esriCTPriorityOneDiv",
            "innerHTML": this.nls.smartActionsPage.priorityOneText
          }, priorityNumberDiv);
          domConstruct.create('div', {
            "class": "esriCTPriorityTwoDiv",
            "innerHTML": this.nls.smartActionsPage.priorityTwoText
          }, priorityNumberDiv);
          domConstruct.create('div', {
            "class": "esriCTPriorityThreeDiv",
            "innerHTML": this.nls.smartActionsPage.priorityThreeText
          }, priorityNumberDiv);
        }
        priorityColumnParentContainer.appendChild(priorityColumnTitleParentDiv);
        priorityColumnParentContainer.appendChild(priorityNumberDiv);
        th.appendChild(priorityColumnParentContainer);
        domStyle.set(th, "width", header.width);
        tr.appendChild(th);
      },

      _createHeaders: function (table) {
        var tr, headerDetails;
        headerDetails = [
          {
            "title": "",
            "icon": "",
            "width": "41%"
          },
          {
            "title": this.nls.actionPage.actions.hide,
            "width": "13%",
            "headerIcon": "esriCTHide"
          },
          {
            "title": this.nls.actionPage.actions.required,
            "width": "13%",
            "headerIcon": "esriCTRequired"
          },
          {
            "title": this.nls.actionPage.actions.disabled,
            "width": "13%",
            "headerIcon": "esriCTDisabled"
          },
          {
            "title": this.nls.smartActionsPage.priorityColumnText,
            "icon": "",
            "width": "20%"
          }
        ];
        tr = domConstruct.create('tr');
        domClass.add(tr, "esriCTTableRow");
        array.forEach(headerDetails, lang.hitch(this, function (header, index) {
          this._createHeaderObj(header, tr, index);
        }));
        table.appendChild(tr);
      },

      _setMaxWidth: function () {
        var headerNodes = query(".esriCTTableHeaderTitle");
        array.forEach(headerNodes, lang.hitch(this, function (headerNode) {
          var nodeWidth = domStyle.getComputedStyle(headerNode).width;
          domStyle.set(headerNode, "max-width", nodeWidth);
        }));
      },


      _createPriorityIcons: function (fieldRow, layerFieldDetails) {
        var priorityArr = layerFieldDetails.Priority;
        var priorityTd = domConstruct.create("td", {}, fieldRow);
        var priorityIconMainDiv = domConstruct.create("div", {
          "class": "esriCTPriorityIconMainDiv"
        }, priorityTd);
        array.forEach(priorityArr, lang.hitch(this, function (priority) {
          domConstruct.create("div", {
            "class": "esriCTPriorityIcons esriCT" + priority,
            "title": this.nls.actionPage.actions[priority.toLowerCase()]
          }, priorityIconMainDiv);
        }));
        var priorityEditIcon = domConstruct.create("div", {
          "class": "jimu-icon jimu-icon-edit esriCTPriorityEditIcon",
          "title": this.nls.smartActionsPage.priorityPopupTitle
        }, priorityIconMainDiv);
        this.own(on(priorityEditIcon, "click", lang.hitch(this, function (evt) {
          this._createPriorityTable(evt.currentTarget.parentNode);
          this._createPriorityPopup(evt.currentTarget.parentNode, layerFieldDetails);
        })));
      },

      _createPriorityTable: function (selectedNode) {
        var fields2, args2;
        fields2 = [{
          name: 'priorityName',
          title: this.nls.smartActionsPage.priorityPopupColumnTitle,
          type: 'empty',
          width: '80%'
        }, {
          name: 'actions',
          title: this.nls.intersectionPage.actionsText,
          type: 'actions',
          width: '20%',
          actions: ['up', 'down'],
          'class': 'actions'
        }];
        args2 = {
          fields: fields2,
          selectable: false
        };
        this._priorityTable = new Table(args2);
        this._priorityTable.startup();
        this._populatePriorityTable(selectedNode);
      },

      _getExistingPriority: function (selectedNode) {
        var priorityArrClasses = {
          "esriCTHide": "Hide",
          "esriCTRequired": "Required",
          "esriCTDisabled": "Disabled"
        };
        var priorityArr = [];
        array.forEach(selectedNode.childNodes, lang.hitch(this, function (node, index) {
          if (index < 3) {
            for (var priority in priorityArrClasses) {
              if (domClass.contains(node, priority)) {
                priorityArr.push(priorityArrClasses[priority]);
              }
            }
          }
        }));
        return priorityArr;
      },

      _populatePriorityTable: function (selectedNode) {
        var priorityArr = this._getExistingPriority(selectedNode);
        array.forEach(priorityArr, lang.hitch(this, function (priority) {
          var headerTitleDiv = domConstruct.create('div', {
            innerHTML: this.nls.actionPage.actions[priority.toLowerCase()],
            title: this.nls.actionPage.actions[priority.toLowerCase()]
          });
          domClass.add(headerTitleDiv, "esriCTTablePriorityTitle");
          domAttr.set(headerTitleDiv, "priority", priority);
          var headerIconDiv = domConstruct.create('div', {
            title: this.nls.actionPage.actions[priority.toLowerCase()]
          });
          domClass.add(headerIconDiv, "esriCTPriorityPopupIcon esriCT" + priority);
          var tr = this._priorityTable.addRow({}).tr;
          var td = query('.simple-table-cell', tr)[0];
          td.appendChild(headerIconDiv);
          td.appendChild(headerTitleDiv);
        }));
      },

      _fetchPriority: function () {
        var rows = this._priorityTable.getRows();
        var priorityArr = [];
        array.forEach(rows, lang.hitch(this, function (row) {
          priorityArr.push(domAttr.get(row.childNodes[0].childNodes[1], "priority"));
        }));
        return priorityArr;

      },

      _changePriority: function (priorityArr, selectedNode) {
        array.forEach(priorityArr, lang.hitch(this, function (prioritySelected, priorityIndex) {
          array.forEach(selectedNode.childNodes, lang.hitch(this, function (node, index) {
            if (priorityIndex === index) {
              var priorityArr = ["Hide", "Required", "Disabled"];
              array.forEach(priorityArr, lang.hitch(this, function (priority) {
                domClass.remove(node, "esriCT" + priority);
              }));
              domClass.add(node, "esriCT" + prioritySelected);
              domAttr.set(node, "title",
                this.nls.actionPage.actions[prioritySelected.toLowerCase()]);
            }
          }));
        }));
      },

      _createPriorityPopup: function (selectedNode, layerFieldDetails) {
        var fieldsPopup = new Popup({
          titleLabel: this.nls.smartActionsPage.priorityPopupTitle,
          width: 450,
          maxHeight: 445,
          autoHeight: true,
          content: this._priorityTable,
          'class': this.baseClass,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              var priorityArr = this._fetchPriority();
              this._changePriority(priorityArr, selectedNode);
              layerFieldDetails.Priority = priorityArr;
              fieldsPopup.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              fieldsPopup.close();
            })
          }],
          onClose: lang.hitch(this, function () { })
        });
      },

      _createLayerName: function (layerRow, layerId) {
        var layerName = layerId;
        var layerNameTd = domConstruct.create('td');
        var layerNameMainDiv = domConstruct.create('div', {}, layerNameTd);
        if (this._jimuLayerInfos.getLayerInfoById(layerId)) {
          layerName = this._jimuLayerInfos.getLayerInfoById(layerId).layerObject.name;
        } else if (this._jimuLayerInfos.getTableInfoById(layerId)) {
          layerName = this._jimuLayerInfos.getTableInfoById(layerId).layerObject.name;
        }
        var layerIconDiv = domConstruct.create('div', {
          "class": "esriCTToggleLayerIcon esriCTToggleLayerCollapsed esriCTToggleLayerExpanded",
          "style": {
            "margin-top": "5px"
          }
        }, layerNameMainDiv);

        domConstruct.create('div', {
          "class": "esriCTLayerTitle",
          "innerHTML": layerName
        }, layerNameMainDiv);

        domAttr.set(layerIconDiv, "rootnodelayerid", layerId);

        this.own(on(layerIconDiv, "click", lang.hitch(this, function (evt) {
          domClass.toggle(evt.currentTarget, "esriCTToggleLayerExpanded");
          var rootLayerId = domAttr.get(evt.currentTarget, "rootnodelayerid");
          query('[layerid="' + rootLayerId + '"]').toggleClass("esriCTHidden");
        })));

        layerRow.appendChild(layerNameTd);
      },

      _createFieldNameTd: function (fieldRow, fieldLabel) {
        var fieldTD = domConstruct.create('td', {
          "innerHTML": fieldLabel,
          "class": "esriCTLayerFields"
        });
        fieldRow.appendChild(fieldTD);
      },

      _addRows: function (table, details) {
        var layerDetails = details.layerDetails;
        var fieldLabels = details.fieldLabels;
        var layerToExpand = [];
        for (var layerId in layerDetails) {
          var layerDetail = layerDetails[layerId];

          var layerRow = domConstruct.create('tr',
            {
              "class": "esriCTLayerNameRow"
            });
          // layer name
          this._createLayerName(layerRow, layerId);
          table.appendChild(layerRow);

          for (var field in layerDetail) {
            var fieldRow = domConstruct.create('tr',
              {
                "class": "esriCTLayerFieldRow esriCTHidden"
              });
            domAttr.set(fieldRow, "layerid", layerId);
            domAttr.set(fieldRow, "field", field);
            // field name td
            this._createFieldNameTd(fieldRow, fieldLabels[layerId][field]);
            var checkboxInfo = {
              layerid: layerId,
              field: field
            };
            checkboxInfo.action = "Hide";
            var haveExistingExpressions = "";
            if (layerDetail[field].ExistingExpressions.hasOwnProperty("Hide")) {
              haveExistingExpressions = layerDetail[field].ExistingExpressions.Hide;
            }
            // hide td
            this._createCheckBox(fieldRow, checkboxInfo,
              layerDetail[field].Hide, haveExistingExpressions);
            checkboxInfo.action = "Required";
            haveExistingExpressions = "";
            if (layerDetail[field].ExistingExpressions.hasOwnProperty("Required")) {
              haveExistingExpressions = layerDetail[field].ExistingExpressions.Required;
            }
            // required td
            this._createCheckBox(fieldRow, checkboxInfo,
              layerDetail[field].Required, haveExistingExpressions);
            checkboxInfo.action = "Disabled";
            haveExistingExpressions = "";
            if (layerDetail[field].ExistingExpressions.hasOwnProperty("Disabled")) {
              haveExistingExpressions = layerDetail[field].ExistingExpressions.Disabled;
            }
            // disabled td
            this._createCheckBox(fieldRow, checkboxInfo,
              layerDetail[field].Disabled, haveExistingExpressions);
            //set layers to be expanded if any of the action is enabled
            if (layerToExpand.indexOf(layerId) === -1 && (layerDetail[field].Hide ||
              layerDetail[field].Required || layerDetail[field].Disabled)) {
              layerToExpand.push(layerId);
            }
            // priority icon td
            this._createPriorityIcons(fieldRow, layerDetail[field]);
            table.appendChild(fieldRow);
          }
        }
        if (layerToExpand.length > 0) {
          setTimeout(lang.hitch(this, function () {
            array.forEach(layerToExpand, function (rootLayerId) {
              //toggle expand/collapse icon
              query('[rootnodelayerid="' + rootLayerId + '"]').toggleClass("esriCTToggleLayerExpanded");
              //toggle each field in the layer
              query('[layerid="' + rootLayerId + '"]').toggleClass("esriCTHidden");
            });
          }), 100);
        }
      },

      _createCheckBox: function (fieldRow, checkBoxInfo, checked, haveExistingExpressions) {
        var checkBoxTD = domConstruct.create('td');
        domClass.add(checkBoxTD, "esriCTCheckBoxTD");
        var checkBoxParentDiv = domConstruct.create('div');
        //when group is applied on some action and it is overridden by other group/at layer
        //in such case uncheck the checkbox
        if (checked && haveExistingExpressions) {
          checked = false;
        }

        //checkbox
        var checkBoxMainDiv = domConstruct.create('div');
        domClass.add(checkBoxMainDiv, "esriCTCheckBoxMainDiv");
        var checkBoxDiv = domConstruct.create('div');
        var checkBox = new CheckBox({
          checked: checked
        }, checkBoxDiv);
        //set attribute to identify for which action the checkbox is
        domAttr.set(checkBoxDiv, "action", checkBoxInfo.action);
        //create local refrence to object of currentLayerDetails for the current field
        //this will be used to store the checkbox state on change
        var layerId = checkBoxInfo.layerid;
        var field = checkBoxInfo.field;
        var appliedOn = this.appliedOn[layerId][field];
        //On change capture the checkbox state in appliedOn object
        this.own(on(checkBox, "change", function (checked) {
          var action = domAttr.get(this.domNode, "action");
          appliedOn[action] = checked;
        }));
        checkBoxMainDiv.appendChild(checkBoxDiv);
        checkBoxParentDiv.appendChild(checkBoxMainDiv);
        //exclamation
        if (haveExistingExpressions) {
          var existingExpressionDiv = domConstruct.create('div', {
            "title": haveExistingExpressions
          });
          domClass.add(existingExpressionDiv, "esriCTExistingExpressionDiv");
          checkBoxParentDiv.appendChild(existingExpressionDiv);
        }

        checkBoxTD.appendChild(checkBoxParentDiv);
        fieldRow.appendChild(checkBoxTD);
      },

      _createTable: function (appliedOn) {
        var table = domConstruct.create('table');
        domClass.add(table, "esriCTTableMainNode");
        this._createHeaders(table);
        this.tableParentContainer.appendChild(table);
        var details = this._createLayerDetails(lang.clone(appliedOn));
        if (details && details.layerDetails && details.fieldLabels) {
          this.appliedOn = details.layerDetails;
          this._addRows(table, details);
        }
      },

      _validateIfLayerHaveUsedFields: function (allLayerFields, usedFieldsArray) {
        var usedFieldsLength;
        if (usedFieldsArray) {
          usedFieldsLength = usedFieldsArray.length;
          array.forEach(allLayerFields, function (field) {
            array.forEach(usedFieldsArray, function (usedField) {
              if ((field.name === usedField.fieldObj.name) &&
                (field.type === usedField.fieldObj.type)) {
                usedFieldsLength--;
              }
            });
          }, this);
        }
        return usedFieldsLength === 0 ? true : false;
      },

      _mergeActions: function (oldAction, newActions) {
        for (var i = 0; i < oldAction.length; i++) {
          for (var j = 0; j < newActions.length; j++) {
            if (newActions[j].filter &&
              newActions[j].actionName === oldAction[i].actionName) {
              oldAction[i] = lang.clone(newActions[j]);
              break;
            }
          }
        }
        return oldAction;
      },

      _mergeFieldValidations: function (fieldValidations) {
        var mergedFieldValidation = {};
        array.forEach(fieldValidations, function (fieldValidation) {
          for (var field in fieldValidation) {
            if (mergedFieldValidation.hasOwnProperty(field)) {
              mergedFieldValidation[field] =
                this._mergeActions(mergedFieldValidation[field], fieldValidation[field]);
            } else {
              mergedFieldValidation[field] = lang.clone(fieldValidation[field]);
            }
          }
        }, this);
        return mergedFieldValidation;
      },

      _getLayersFieldValidations: function (fieldValidations, configInfos, layerId) {
        array.forEach(configInfos, function (layer) {
          if (layer.featureLayer && layer.featureLayer.id === layerId) {
            if (layer.fieldValidations) {
              if (!fieldValidations) {
                fieldValidations = [];
              }
              fieldValidations.push(layer.fieldValidations);
            }
          }
          if (layer.relationshipInfos) {
            fieldValidations =
              this._getLayersFieldValidations(fieldValidations, layer.relationshipInfos, layerId);
          }
        }, this);
        return fieldValidations;
      },

      _getPartsInExpression: function (allParts, partsArray) {
        if (partsArray) {
          array.forEach(partsArray, lang.hitch(this, function (info) {
            if (info.parts) {
              this._getPartsInExpression(allParts, info.parts);
            } else {
              allParts.push(info);
            }
          }));
        }
        return allParts;
      },

      _createLayerDetails: function (prevSettings) {
        var parts, layerDetails, fieldLabels;
        layerDetails = null;
        if (this.filterInfo && this.filterInfo.filter) {
          // fetch all parts involved in expression, in case set and normally added expression
          parts = this._getPartsInExpression([], this.filterInfo.filter.parts);
        }
        layerDetails = {};
        fieldLabels = {};
        array.forEach(this._totalLayers, function (layer) {
          //Consider only when layer is not table
          //or if it is table then it should have some realtions then only consider it
          if (!layer.isTable || (layer.isTable && layer.layerObject.relationships.length > 0)) {
            var jimuLayerInfo, configuredLayerInfo, fieldValidationsArray = [], addLayer = false;
            configuredLayerInfo = {};
            //get the layer/table info for the layer
            jimuLayerInfo = this._jimuLayerInfos.getLayerOrTableInfoById(layer.id);
            //get all the fields to be shown
            configuredLayerInfo.allFields = jimuLayerInfo.layerObject.fields;
            //get the configInfo so that the field info will be available in required format
            if (jimuLayerInfo) {
              jimuLayerInfo = this.editUtils.getConfigInfo(jimuLayerInfo, {});
              configuredLayerInfo.fieldInfos = jimuLayerInfo.fieldInfos;
            }
            //check if the layer have all the fields used in expression
            addLayer = this._validateIfLayerHaveUsedFields(
              configuredLayerInfo.allFields, parts);
            //if all fields in the expression are available or
            //if expression is not configured then only show the layer
            if (configuredLayerInfo && configuredLayerInfo.fieldInfos &&
              (addLayer || !parts)) {
              //fetch allready applied expression to the layer's fields
              //this will get array of all field validations for the same layer at different relations
              fieldValidationsArray =
                this._getLayersFieldValidations(fieldValidationsArray, this._configInfos, layer.id);
              //merge all the field validations
              configuredLayerInfo.fieldValidations =
                this._mergeFieldValidations(fieldValidationsArray);
              layerDetails[layer.id] = {};
              fieldLabels[layer.id] = {};
              array.forEach(configuredLayerInfo.fieldInfos, function (field) {
                var prioritiesInfo;
                //filter following field types to be shown in table
                if (field.type !== "esriFieldTypeGeometry" &&
                  field.type !== "esriFieldTypeOID" &&
                  field.type !== "esriFieldTypeBlob" &&
                  field.type !== "esriFieldTypeGlobalID" &&
                  field.type !== "esriFieldTypeRaster" &&
                  field.type !== "esriFieldTypeXML") {
                  //set field lables to be shown in table
                  fieldLabels[layer.id][field.name] = field.label;
                  if (prevSettings && prevSettings[layer.id] && prevSettings[layer.id][field.name]) {
                    layerDetails[layer.id][field.name] = prevSettings[layer.id][field.name];
                  } else {
                    layerDetails[layer.id][field.name] = {
                      "Hide": false,
                      "Required": false,
                      "Disabled": false
                    };
                  }
                  //Set priority of actions from layer if available else set default priority
                  if (configuredLayerInfo.fieldValidations &&
                    configuredLayerInfo.fieldValidations[field.name]) {
                    prioritiesInfo =
                      this._getPriorites(configuredLayerInfo.fieldValidations[field.name]);
                    layerDetails[layer.id][field.name].Priority = prioritiesInfo.Priority;
                    layerDetails[layer.id][field.name].ExistingExpressions =
                      prioritiesInfo.ExistingExpressions;
                  } else {
                    layerDetails[layer.id][field.name].Priority = ["Hide", "Required", "Disabled"];
                    layerDetails[layer.id][field.name].ExistingExpressions = [];
                  }
                }
              }, this);
            }
          }
        }, this);
        return {
          "layerDetails": layerDetails,
          "fieldLabels": fieldLabels
        };
      },

      _getPriorites: function (actions) {
        var priorites = [], haveExistingExpressions = {};
        array.forEach(actions, function (action) {
          priorites.push(action.actionName);
          if (action.filter && action.filter.displaySQL) {
            if (!action.filter.hasOwnProperty('smartActionGroupName') || !this.prevName ||
              (action.filter.hasOwnProperty('smartActionGroupName') &&
                this.prevName && this.prevName !== action.filter.smartActionGroupName)) {
              haveExistingExpressions[action.actionName] = action.filter.displaySQL;
            }
          }
        }, this);
        return {
          "Priority": priorites,
          "ExistingExpressions": haveExistingExpressions
        };
      },

      _getVaidationForAction: function (allActions, actionName) {
        var layersValidation = null;
        array.some(allActions, function (action) {
          if (action.actionName === actionName && action.filter && action.filter.displaySQL) {
            layersValidation = action;
            return true;
          }
        });
        return layersValidation;
      },

      _applysettingsToField: function (layerId, groupInfo) {
        var allFields, fieldValidationsArray;
        fieldValidationsArray = [];
        //get all possible instances for field validation of this layer id
        fieldValidationsArray =
          this._getLayersFieldValidations(fieldValidationsArray, this._configInfos, layerId);
        //get the applied on settings of the checkboxs for this layer
        allFields = groupInfo.appliedOn[layerId];
        //set the group info in all possible layers
        for (var i = 0; i < fieldValidationsArray.length; i++) {
          var fieldValidations = fieldValidationsArray[i];
          if (fieldValidations) {
            for (var field in allFields) {
              var layerDetail = allFields[field]; //get the details set in the apply on table
              var validations = []; //create new validations array for each field
              var updatedActions = false;
              //loop through the priorities of actions, applied in group
              for (var j = 0; j < layerDetail.Priority.length; j++) {
                var action = layerDetail.Priority[j];
                var newValidation = {};
                newValidation.actionName = action;
                newValidation.submitWhenHidden = false;
                //Use gropus filter if action is enalbed
                //else use from layer
                if (layerDetail[action]) {
                  updatedActions = true;
                  if (action === "Hide") {
                    newValidation.submitWhenHidden = groupInfo.submitWhenHidden;
                  }
                  newValidation.expression = groupInfo.filterInfo.expression;
                  //store the cloned obj to avoid override of group name when editing independently
                  newValidation.filter = lang.clone(groupInfo.filterInfo).filter;
                  newValidation.filter.smartActionGroupName = groupInfo.name;
                  //remove settings for this field's action in other groups
                  this._removeSettingsFromOtherGroups(groupInfo.name, layerId, field, action);
                } else if (fieldValidations && fieldValidations[field]) {
                  var existingValidation =
                    this._getVaidationForAction(fieldValidations[field], action);
                  //If previously action was checked in this group and now it is unchecked
                  //then dont store the filter info.
                  //So that expression will be removed which was applied from group.
                  //else if it was not part of this group previously keep existing expression as is
                  if (existingValidation && existingValidation.filter && !layerDetail[action] &&
                    existingValidation.filter.hasOwnProperty('smartActionGroupName') &&
                    existingValidation.filter.smartActionGroupName === this.prevName) {
                    updatedActions = true;
                  } else if (existingValidation) {
                    newValidation.expression = existingValidation.filter.expr;
                    newValidation.filter = existingValidation.filter;
                  }
                }
                validations.push(newValidation);
              }
              //if updated the actions then only set the new validation for the field in main obj
              if (updatedActions) {
                if (!fieldValidations) {
                  fieldValidations = {};
                }
                fieldValidations[field] = validations;
              }
            }
          }
        }
      },

      _removePrevSettingsFromLayerFields: function (layerId) {
        var fieldValidations, fieldValidationsArray = [];
        //get all possible instances for field validation of this layer id
        fieldValidationsArray =
          this._getLayersFieldValidations(fieldValidationsArray, this._configInfos, layerId);
        if (fieldValidationsArray) {
          for (var i = 0; i < fieldValidationsArray.length; i++) {
            fieldValidations = fieldValidationsArray[i];
            if (fieldValidations) {
              for (var field in fieldValidations) {
                if (fieldValidations && fieldValidations[field]) {
                  array.forEach(fieldValidations[field], function (existingValidation) {
                    if (existingValidation && existingValidation.filter &&
                      existingValidation.filter.hasOwnProperty('smartActionGroupName') &&
                      existingValidation.filter.smartActionGroupName === this.prevName) {
                      existingValidation.submitWhenHidden = false;
                      if (existingValidation.hasOwnProperty('expression')) {
                        delete existingValidation.expression;
                      }
                      delete existingValidation.filter;
                    }
                  }, this);
                }
              }
            }
          }
        }
      },

      /**
       * Removes the settings for the fields action form the other groups
       * @param {String} currentGroupName - Which will be skipped to remove settings
       * @param {*} layerId - layer id on which the settings are applied
       * @param {*} field - field for which the action is applied on
       * @param {*} action - Hide/Required/Disable action for the selected field
       */
      _removeSettingsFromOtherGroups: function (currentGroupName, layerId, field, action) {
        var groupsAppliedOn;
        //apply settings on other groups if existing settings is valid
        if (this.existingGroups) {
          //lop through all the groups and remove settings for selected layerId, field & action
          for (var groupName in this.existingGroups) {
            //skip the current group on which the settings are being applied
            if (groupName !== currentGroupName && groupName !== this.prevName) {
              groupsAppliedOn = this.existingGroups[groupName].appliedOn;
              //remove the settings for the fields action form the other group
              if (groupsAppliedOn && groupsAppliedOn.hasOwnProperty(layerId) &&
                groupsAppliedOn[layerId].hasOwnProperty(field) &&
                groupsAppliedOn[layerId][field].hasOwnProperty(action)) {
                groupsAppliedOn[layerId][field][action] = false;
              }
            }
          }
        }
      },

      _applySettingsInLayer: function (groupInfo) {
        for (var layerId in groupInfo.appliedOn) {
          var prevIndex;
          if (this._prevAppliedOnLayers &&
            this._prevAppliedOnLayers.indexOf(layerId) > -1) {
            prevIndex = this._prevAppliedOnLayers.indexOf(layerId);
            this._prevAppliedOnLayers.splice(prevIndex, 1);
          }
          this._applysettingsToField(layerId, groupInfo);
        }
        //If any layer was prev configured, and now thier is no action on that layer
        //remove all prev configuration of this group with layer
        this.deleteGroup();
      },

      deleteGroup: function () {
        if (this._prevAppliedOnLayers) {
          array.forEach(this._prevAppliedOnLayers, function (prevLayerId) {
            this._removePrevSettingsFromLayerFields(prevLayerId);
          }, this);
        }
      }
    });
  });