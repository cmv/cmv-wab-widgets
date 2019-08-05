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
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    'jimu/dijit/TabContainer3',
    'dojo',
    'dojo/query',
    'dojo/_base/html',
    'dojo/dom-style',
    'dojo/_base/array',
    'dojo/on',
    'dojo/_base/lang',
    'dijit/form/Select',
    'dijit/registry',
    'dijit/Editor',
    'jimu/utils',
    'dojo/dom-construct',
    'jimu/dijit/SymbolChooser',
    'jimu/dijit/Popup',
    'jimu/LayerInfos/LayerInfos',
    'esri/toolbars/draw',
    './SymChooser',
    '../utils',
    'dijit/_editor/plugins/LinkDialog',
    'dijit/_editor/plugins/ViewSource',
    'dijit/_editor/plugins/FontChoice',
    'dojox/editor/plugins/Preview',
    'dijit/_editor/plugins/TextColor',
    'dojox/editor/plugins/ToolbarLineBreak',
    'dojox/editor/plugins/FindReplace',
    'dojox/editor/plugins/PasteFromWord',
    'dojox/editor/plugins/InsertAnchor',
    'dojox/editor/plugins/Blockquote',
    'dojox/editor/plugins/UploadImage'
],
  function (
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    SimpleTable,
    TabContainer,
    dojo,
    query,
    html,
    domStyle,
    array,
    on,
    lang,
    Select,
    registry,
    Editor,
    utils,
    domConstruct,
    SymbolChooser,
    Popup,
    LayerInfos,
    Draw,
    SymChooser,
    editUtils) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'solutions-widget-batcheditor-setting',
      layersTable: null,
      commonFieldsTable: null,
      layerSelects: null,
      currentLayer: null,
      selectionSymbols: {},
      currentPage: 1,
      controlsAddedToWidgetFrame: false,
      toolOption: {
        Shape: {
          value: 0
        },
        FeatureSpatial: {
          value: 1
        },
        FeatureQuery: {
          value: 2
        },
        Query: {
          value: 3
        }
      },
      drawTools: ['POINT','EXTENT','POLYGON','FREEHAND_POLYGON'],
      tabContainer: null,
      popup: null,
      _jimuLayerInfos: null,
      _editorObj: null,
      startup: function () {
        this.inherited(arguments);
        LayerInfos.getInstance(this.map, this.map.itemInfo)
        .then(lang.hitch(this, function (operLayerInfos) {
          this._jimuLayerInfos = operLayerInfos;
        }));
        this.tabContainer = new TabContainer({
          tabs: [{
            title: this.nls.tabs.selection,
            content: this.firstPageDiv
          }, {
            title: this.nls.tabs.layers,
            content: ''
          }, {
            title: this.nls.tabs.fields,
            content: ''
          }],
          isNested: true
        }, this.controlNode);
        this.tabContainer.startup();

        this.own(on(this.tabContainer, 'tabChanged', lang.hitch(this, function (tab) {
          var oldPage = this.currentPage;
          if (tab === this.nls.tabs.selection) {
            if (oldPage > 1) {
              while (oldPage > 1) {
                this.btnBackClick();
                oldPage--;
              }
            }
          } else if (tab === this.nls.tabs.layers) {
            if (oldPage < 2) {
              while (oldPage < 2) {
                this.btnNextClick();
                oldPage++;
              }
            } else {
              while (oldPage > 2) {
                this.btnBackClick();
                oldPage--;
              }
            }
          } else {
            if (oldPage < 3) {
              while (oldPage < 3) {
                this.btnNextClick();
                oldPage++;
              }
            }
          }
        })));

        if (this.config === null) {
          this.config = {};

        }
        if (this.config === undefined) {
          this.config = {};

        }
        if (this.config === '') {
          this.config = {};

        }
        this.setConfig(this.config);

        try {

          var btnBar = (this.domNode.parentNode.parentNode.parentNode.parentNode.lastChild);
          this.btnErrorMsg = domConstruct.toDom("<div class='batcheditor-settings-error hide'></div>");
          domConstruct.place(this.btnErrorMsg, btnBar, "first");
          html.addClass(this.pageOneControls, 'hide');
          html.addClass(this.pageTwoControls, 'hide');
          html.addClass(this.pageThreeControls, 'hide');
          html.addClass(this.settingsFirstPageSaveError, 'hide');
          html.addClass(this.settingsSecondPageSaveError, 'hide');
          html.addClass(this.settingsThirdPageSaveError, 'hide');
          this.controlsAddedToWidgetFrame = true;

          this.own(on(this.selectByShape, "change", lang.hitch(this, function(e) {
            this.checkHeaderSyntax();
            this.showDrawTools(true);
          })));
          this.own(on(this.selectByFeature, "change", lang.hitch(this, function(e) {
            this.checkHeaderSyntax();
            this.showDrawTools(false);
          })));
          this.own(on(this.selectByFeatureQuery, "change", lang.hitch(this, function(e) {
            this.checkHeaderSyntax();
            this.showDrawTools(false);
          })));

          this.own(on(this.drawPoint, "click", lang.hitch(this, function(e) {this._onItemClick(e);})));
          this.own(on(this.drawLine, "click", lang.hitch(this, function(e) {this._onItemClick(e);})));
          this.own(on(this.drawPolyline, "click", lang.hitch(this, function(e) {this._onItemClick(e);})));
          this.own(on(this.drawFreehandPolyline, "click", lang.hitch(this, function(e) {this._onItemClick(e);})));
          this.own(on(this.drawExtent, "click", lang.hitch(this, function(e) {this._onItemClick(e);})));
          this.own(on(this.drawPolygon, "click", lang.hitch(this, function(e) {this._onItemClick(e);})));
          this.own(on(this.drawFreehandPolygon, "click", lang.hitch(this, function(e) {this._onItemClick(e);})));

          if(this.config.hasOwnProperty("drawTools")) {
            this.drawTools = this.config.drawTools;
          }
          this.drawTools.map(lang.hitch(this, function(dt) {
            this.checkDrawToolsState(dt);
          }));

          this._createHeaderEditor();

        } catch (err) {
          console.log(err.message);
        }
      },

      _createHeaderEditor: function() {
        this._editorObj = new Editor({
          height: "100px",
          plugins: [
            'bold', 'italic', 'underline', 'foreColor',
            '|', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
            '|', 'insertOrderedList', 'insertUnorderedList', 'indent', 'outdent'
          ],
          extraPlugins: [
            '|', 'createLink', 'unlink', 'pastefromword', '|', 'undo', 'redo',
            '|', 'toolbarlinebreak',//'chooseImage', 'uploadImage',
            {
              name: "dijit._editor.plugins.FontChoice",
              command: "fontName",
              custom: "Arial;Comic Sans MS;Courier New;Garamond;Tahoma;Times New Roman;Verdana".split(";")
            }, 'fontSize', 'formatBlock'
          ],
          style: "font-family:Verdana;"
        }, this.editorDescription);
        this._editorObj.startup();
        if(this.config.hasOwnProperty("headerText")) {
          this._editorObj.set("value", this.config.headerText);
        } else {
          var textVal = this.nls.widgetIntroSelectByArea;
          if(this.selectByShape.get('checked')) {
            textVal = this.nls.widgetIntroSelectByArea;
          }
          if(this.selectByFeature.get('checked')) {
            textVal = this.nls.widgetIntroSelectByFeature;
          }
          if(this.selectByFeatureQuery.get('checked')) {
            textVal = this.nls.widgetIntroSelectByFeatureQuery;
          }
          this._editorObj.set("value", textVal);
        }
      },

      checkHeaderSyntax: function() {
        var headerValue = this._editorObj.get("value");
        if(this.config.hasOwnProperty("headerText")) {
          headerValue = this.config.headerText;
          this._editorObj.set("value",headerValue);
        }
        if(this.selectByShape.get('checked')) {
          if(headerValue !== this.nls.widgetIntroSelectByArea) {
            if(this.config.hasOwnProperty("headerText") && this.config.selectByShape) {
              this._editorObj.set("value",this.config.headerText);
            } else {
              this._editorObj.set("value",this.nls.widgetIntroSelectByArea);
            }
          }
        }
        if(this.selectByFeature.get('checked')) {
          if(headerValue !== this.nls.widgetIntroSelectByFeature) {
            if(this.config.hasOwnProperty("headerText") && this.config.selectByFeature) {
              this._editorObj.set("value",this.config.headerText);
            } else {
              this._editorObj.set("value",this.nls.widgetIntroSelectByFeature);
            }
          }
        }
        if(this.selectByFeatureQuery.get('checked')) {
          if(headerValue !== this.nls.widgetIntroSelectByFeatureQuery) {
            if(this.config.hasOwnProperty("headerText") && this.config.selectByFeatureQuery) {
              this._editorObj.set("value",this.config.headerText);
            } else {
              this._editorObj.set("value",this.nls.widgetIntroSelectByFeatureQuery);
            }
          }
        }
      },

      btnNextClick: function () {
        if (this.currentPage === 1) {
          this.page1ToPage2();
        } else if (this.currentPage === 2) {
          this.page2ToPage3();
        }
      },
      btnBackClick: function () {
        if (this.currentPage === 2) {
          this.page2ToPage1();
        } else if (this.currentPage === 3) {
          this.page3ToPage2();
        }
      },
      getSelectedTool: function () {
        if (this.selectByShape.checked) {
          return this.toolOption.Shape;
        } else if (this.selectByFeature.checked) {
          return this.toolOption.FeatureSpatial;
        } else if (this.selectByFeatureQuery.checked) {
          return this.toolOption.FeatureQuery;
        }
        //else if (this.selectByQuery.checked) {
        //    return this.toolOption.Query;
        //}
      },
      showDrawTools: function(show) {
        if(show) {
          if(this.selectByShape.get('checked')) {
            domStyle.set(this.drawToolSelection, 'display', '');
            if(this.config.hasOwnProperty("drawTools")) {
              if(this.config.drawTools.length > 0) {
                this.drawTools = this.config.drawTools;
              } else {
                this.drawTools= ['POINT','EXTENT','POLYGON','FREEHAND_POLYGON'];
              }
            }
            this.drawTools.map(lang.hitch(this, function(dt) {
              this.checkDrawToolsState(dt);
            }));
          } else {
            domStyle.set(this.drawToolSelection, 'display', 'none');
          }
        } else {
          if(!this.selectByShape.get('checked')) {
            domStyle.set(this.drawToolSelection, 'display', 'none');
            this.drawTools= [];
            var items = query('.draw-item', this.domNode);
            items.map(lang.hitch(this, function(i) {
              if (html.hasClass(i, 'selected')) {
                html.removeClass(i, 'selected');
              }
            }));
          }
        }
      },
      checkDrawToolsState: function(dt) {
        switch(dt) {
          case "POINT": on.emit(this.drawPoint, "click", {bubbles: true,cancelable: true}); break;
          case "LINE": on.emit(this.drawLine, "click", {bubbles: true,cancelable: true}); break;
          case "POLYLINE": on.emit(this.drawPolyline, "click", {bubbles: true,cancelable: true}); break;
          case "FREEHAND_POLYLINE": on.emit(this.drawFreehandPolyline, "click", {bubbles: true,cancelable: true}); break;
          case "EXTENT": on.emit(this.drawExtent, "click", {bubbles: true,cancelable: true}); break;
          case "POLYGON": on.emit(this.drawPolygon, "click", {bubbles: true,cancelable: true}); break;
          case "FREEHAND_POLYGON": on.emit(this.drawFreehandPolygon, "click", {bubbles: true,cancelable: true}); break;
          default: break;
        }
      },
      _onItemClick : function(event) {
        var target = event.target || event.srcElement;
        var items = query('.draw-item', this.domNode);
        if (html.hasClass(target, 'selected')) {
          if(this.drawTools.length > 1) {
            html.removeClass(target, 'selected');
            var newToolList = this.drawTools.filter(lang.hitch(this, function(dt) {
              return dt !== target.getAttribute('data-geotype');
            }));
            this.drawTools = newToolList;
          }
        }
        else {
          //items.removeClass('selected');
          html.addClass(target, 'selected');
          var geotype = target.getAttribute('data-geotype');
          if(this.drawTools.indexOf(geotype) < 0) {
            this.drawTools.push(geotype);
          }
        }

      },
      page1ToPage2: function () {

        if (this.selectByShape.checked === false &&
          this.selectByFeature.checked === false &&
          this.selectByFeatureQuery.checked === false) {
          if (this.controlsAddedToWidgetFrame) {
            this.btnErrorMsg.innerHTML = this.config.nls.page1.toolNotSelected;
            html.removeClass(this.btnErrorMsg, 'hide');

          } else {
            domStyle.set(this.settingsFirstPageError, 'display', '');
          }
        } else {
          if(this.selectByShape.checked) {
            if(this.drawTools.length > 0) {
              this.savePageToConfig("1");
              this.showPage2();
            } else {
              this.btnErrorMsg.innerHTML = this.config.nls.page1.noDrawToolSelected;
              html.removeClass(this.btnErrorMsg, 'hide');
            }
          } else {
            this.savePageToConfig("1");
            this.showPage2();
          }
        }

      },
      page2ToPage1: function () {
        this.savePageToConfig("2");
        this.showPage1();
      },
      page2ToPage3: function () {
        this.createFieldsTable();
        var result = array.some(this.layersTable.getRows(), function (row) {
          var rowData = this.layersTable.getRowData(row);
          return rowData.update;
        }, this);
        if (!result) {
          if (this.controlsAddedToWidgetFrame) {
            this.btnErrorMsg.innerHTML = this.nls.page2.noLayersSelected;
            html.removeClass(this.btnErrorMsg, 'hide');
            this.tabContainer.selectTab(this.nls.tabs.layers);
          } else {
            domStyle.set(this.settingsSecondPageError, 'display', '');
          }
        } else {
          this.savePageToConfig("2");
          this.showPage3();
        }

      },
      page3ToPage2: function () {
        this.savePageToConfig("3");
        this.showPage2();
      },
      savePageToConfig: function (page) {
        if (page === "1") {
          if (this.selectByShape.checked === true) {
            this.config.selectByShape = this.selectByShape.checked;
            this.config.drawTools = this.drawTools;
          } else {
            this.config.selectByShape = false;
            this.config.drawTools = [];
          }

          if (this.selectByFeature.checked === true) {
            this.config.selectByFeature = this.selectByFeature.checked;

          } else {
            this.config.selectByFeature = false;
          }

          if (this.selectByFeatureQuery.checked === true) {
            this.config.selectByFeatureQuery = this.selectByFeatureQuery.checked;
          } else {
            this.config.selectByFeatureQuery = false;
          }

          //if (this.selectByQuery.checked === true) {
          //    this.config.selectByQuery = this.selectByQuery.checked;
          //} else {
          //    this.config.selectByQuery = false;
          //}
        } else if (page === "2") {

          var selectVal;

          if (this.layersTable !== null) {
            this.config.toggleLayersOnOpen = this.toggleLayers.checked;

            this.config.updateLayers = [];
            this.config.selectByLayer = {};
            array.forEach(this.layersTable.getRows(), function (row) {

              var rowData = this.layersTable.getRowData(row);
              var symbol = null;
              var defaultSym = new SymbolChooser();
              if (this.selectionSymbols[rowData.id] === undefined) {
                if (rowData.geometryType === "esriGeometryPolygon") {
                  defaultSym.showByType('fill');
                } else if (rowData.geometryType === "esriGeometryPoint" ||
                  rowData.geometryType === "esriGeometryMultipoint") {
                  defaultSym.showByType('marker');
                } else if (rowData.geometryType === "esriGeometryPolyline") {
                  defaultSym.showByType('line');

                }
                this.selectionSymbols[rowData.id] = defaultSym.getSymbol().toJson();
              }
              symbol = this.selectionSymbols[rowData.id];

              if (rowData.update === true) {

                if (this.selectByFeatureQuery.checked === true) {
                  selectVal = query('input[name="queryFldSelect"]', row).shift().value;
                  if (selectVal !== "NOTSET1") {
                    rowData.queryField = selectVal;
                    this.layersTable.editRow(row, {
                      'queryField': rowData.queryField
                    });
                  } else {
                    rowData.queryField = null;
                  }
                }
                this.config.updateLayers.push({
                  "id": rowData.id,
                  "name": rowData.label,
                  "queryField": rowData.queryField,
                  "selectionSymbol": symbol
                });
              }
              if (this.selectByFeature.checked === true || this.selectByFeatureQuery.checked === true) {
                if (this.selectByFeatureQuery.checked === true) {
                  selectVal = query('input[name="queryFldSelect"]', row).shift().value.toString();
                  if (selectVal !== "NOTSET1") {
                    rowData.queryField = selectVal;
                    this.layersTable.editRow(row, {
                      'queryField': rowData.queryField
                    });
                  } else {
                    rowData.queryField = null;
                  }
                }
                if (rowData.selectByLayer === true) {
                  this.config.selectByLayer = {
                    "id": rowData.id,
                    "name": rowData.label,
                    "queryField": rowData.queryField,
                    "selectionSymbol": symbol
                  };
                }
              }

            }, this);
          }
        } else if (page === "3") {
          if (this.commonFieldsTable !== null) {
            this.config.commonFields = [];
            array.forEach(this.commonFieldsTable.getRows(), function (row) {
              var rowData = this.commonFieldsTable.getRowData(row);
              if (rowData.isEditable === true) {
                this.config.commonFields.push({
                  "alias": rowData.label,
                  "name": rowData.fieldName
                });
              }
            }, this);
          }
        }
      },
      showPage1: function () {
        this.selectByShape.set('checked', this.config.selectByShape);
        this.selectByFeature.set('checked', this.config.selectByFeature);
        this.selectByFeatureQuery.set('checked', this.config.selectByFeatureQuery);

        //this.selectByQuery.set('checked', this.config.selectByQuery);

        if (typeof (this.config.selectByShape) === 'undefined' &&
          typeof (this.config.selectByFeature) === 'undefined' &&
          typeof (this.config.selectByFeatureQuery) === 'undefined') {
          this.selectByShape.set('checked', true);
        }

        domStyle.set(this.firstPageDiv, 'display', '');
        domStyle.set(this.secondPageDiv, 'display', 'none');

        if(this.selectByShape.get('checked')) {
          domStyle.set(this.drawToolSelection, 'display', '');
        } else {
          domStyle.set(this.drawToolSelection, 'display', 'none');
          this.drawTools = ['POINT','EXTENT','POLYGON','FREEHAND_POLYGON'];
        }

        domStyle.set(this.settingsFirstPageError, 'display', 'none');
        this.hideOkError();
        if (this.controlsAddedToWidgetFrame) {

          //html.addClass(this.btnBack, "hide");
          //html.removeClass(this.btnNext, "hide");
          this.currentPage = 1;
        }
      },
      showPage2: function () {
        if (this.config.toggleLayersOnOpen !== null) {
          this.toggleLayers.setChecked(this.config.toggleLayersOnOpen);
        }

        var selectedTool = this.getSelectedTool();
        var selectByLayerVisible,
            queryFieldVisible;
        var showOnlyEditable;
        if (selectedTool === this.toolOption.Shape) {
          selectByLayerVisible = false;
          queryFieldVisible = false;
          showOnlyEditable = true;
        } else if (selectedTool === this.toolOption.FeatureSpatial) {
          selectByLayerVisible = true;
          queryFieldVisible = false;
          showOnlyEditable = false;
        } else if (selectedTool === this.toolOption.FeatureQuery) {
          selectByLayerVisible = true;
          queryFieldVisible = true;
          showOnlyEditable = false;
        } else if (selectedTool === this.toolOption.Query) {
          selectByLayerVisible = false;
          queryFieldVisible = true;
          showOnlyEditable = false;
        }
        this.createLayerTable(selectByLayerVisible, queryFieldVisible);
        this.layersTable.clear();
        this.loadLayerTable(showOnlyEditable, queryFieldVisible);

        domStyle.set(this.firstPageDiv, 'display', 'none');
        domStyle.set(this.secondPageDiv, 'display', '');
        domStyle.set(this.thirdPageDiv, 'display', 'none');

        domStyle.set(this.settingsSecondPageError, 'display', 'none');
        if (this.controlsAddedToWidgetFrame) {

          //html.removeClass(this.btnBack, "hide");
          //html.removeClass(this.btnNext, "hide");
          this.currentPage = 2;
        }
        this.hideOkError();

      },
      showPage3: function () {
        this.loadFieldsTable();
        domStyle.set(this.firstPageDiv, 'display', 'none');
        domStyle.set(this.secondPageDiv, 'display', 'none');
        domStyle.set(this.thirdPageDiv, 'display', '');
        if (this.controlsAddedToWidgetFrame) {

          //html.addClass(this.btnNext, "hide");
          //html.removeClass(this.btnBack, "hide");
          this.currentPage = 3;
        }
        this.hideOkError();
      },
      hideOkError: function () {
        if (this.controlsAddedToWidgetFrame) {

          html.addClass(this.btnErrorMsg, 'hide');
        } else {
          domStyle.set(this.settingsFirstPageSaveError, 'display', 'none');
          domStyle.set(this.settingsSecondPageSaveError, 'display', 'none');
          domStyle.set(this.settingsThirdPageSaveError, 'display', 'none');
        }
      },
      showOKError: function () {
        if (this.controlsAddedToWidgetFrame) {
          this.btnErrorMsg.innerHTML = this.nls.errorOnOk;
          html.removeClass(this.btnErrorMsg, 'hide');
        } else {
          var display = domStyle.get(this.firstPageDiv, 'display');
          if (display !== 'none') {
            domStyle.set(this.settingsFirstPageSaveError, 'display', '');
            return;
          }
          display = domStyle.get(this.secondPageDiv, 'display');
          if (display !== 'none') {
            domStyle.set(this.settingsSecondPageSaveError, 'display', '');
            return;
          }
          display = domStyle.get(this.thirdPageDiv, 'display');
          if (display !== 'none') {
            domStyle.set(this.settingsThirdPageSaveError, 'display', '');
            return;
          }
        }
      },
      setConfig: function (config) {
        this.config = config;
        this.showPage1();
        //this.addQueryFields();

      },
      getConfig: function () {
        this.savePageToConfig("1");

        if (this.selectByShape.checked === false &&
          this.selectByFeature.checked === false &&
          this.selectByFeatureQuery.checked === false) {
          this.showOKError();
          return false;
        }

        this.savePageToConfig("2");

        if (this.config.updateLayers) {
          if (this.config.updateLayers.length === 0) {
            this.showOKError();
            return false;
          }
        } else {
          this.showOKError();
          return false;
        }

        if (this.selectByFeature.checked === true || this.selectByFeatureQuery.checked === true) {
          if (this.config.selectByLayer) {

            if (this.config.selectByLayer.id === null) {
              this.showOKError();
              return false;
            } else if (this.config.selectByLayer.id === undefined) {
              this.showOKError();
              return false;
            } else if (this.config.selectByLayer.id === "") {
              this.showOKError();
              return false;
            }
          } else {
            this.showOKError();
            return false;
          }
        }
        if (this.selectByFeatureQuery.checked === true) {
          var err = array.some(this.config.updateLayers, function (layer) {
            if (layer.queryField === null) {
              this.showOKError();
              return true;
            } else if (layer.queryField === undefined) {
              this.showOKError();
              return true;
            } else if (layer.queryField === "") {
              this.showOKError();
              return true;
            }
          }, this);
          if (err) {
            return false;
          }
          if (this.config.selectByLayer.queryField === null) {
            this.showOKError();
            return false;
          } else if (this.config.selectByLayer.queryField === undefined) {
            this.showOKError();
            return false;
          } else if (this.config.selectByLayer.queryField === "") {
            this.showOKError();
            return false;
          }
        }

        this.savePageToConfig("3");
        if (this.config) {
          if (this.config.commonFields.length === 0) {
            this.showOKError();
            return false;
          }
        } else {
          this.showOKError();
          return false;
        }

        this.config["headerText"] = utils.sanitizeHTML(this._editorObj.get("value"));

        return this.config;
      },
      _getDefaultFieldInfos: function (layerId) {
        return editUtils.getFieldInfosFromWebmap(layerId, this._jimuLayerInfos);
      },
      addQueryFields: function () {
        this.layerSelects = [];

        array.forEach(this.layersTable.getRows(), function (row) {
          var queryFldCell = query('.queryFieldDropdown.empty-text-td', row).shift();

          var rowData = this.layersTable.getRowData(row);
          var layer = this.map.getLayer(rowData.id);
          var fields = this.getVisibleFields(this._getDefaultFieldInfos(layer.id));
          //var fields = this.getVisibleFields(layer.infoTemplate.info.fieldInfos);

          var s = new Select({
            name: 'queryFldSelect',
            options: fields
          });

          s.placeAt(queryFldCell);

          this.layerSelects.push(s);
          if (rowData.queryField) {
            if (rowData.queryField !== "") {
              array.some(fields, function (field) {
                if (field.value === rowData.queryField) {
                  s.set('value', rowData.queryField);
                  return true;
                }
              });
            }
          }

        }, this);
      },
      getEditableFields: function (fields) {
        return dojo.filter(fields, function (field) {
          if (field.isEditable === true && field.type) {
            if (field.type !== "esriFieldTypeGlobalID" &&
                field.type !== "esriFieldTypeRaster" &&
                field.type !== "esriFieldTypeGeometry" &&
                field.type !== "esriFieldTypeOID" &&
                field.type !== "esriFieldTypeBlob" &&
                field.type !== "esriFieldTypeXML") {
              return true;
            }
            else {
              return false;
            }
          }
          else {
            return false;//field.isEditable;
          }
        });

      },
      getVisibleFields: function (fields) {
        //var result = [{ label: 'Do Not Query', value: 'Do Not Query' }];
        var result = [{
          label: '',
          value: 'NOTSET1'
        }];
        array.forEach(fields, function (field) {
          if (field.visible === true) {
            var opt = {
              label: field.label,
              value: field.fieldName
            };
            result.push(opt);
          }
        });
        return result;

      },
      arrayObjectIndexOf: function (myArray, searchTerm, property) {
        for (var i = 0,
            len = myArray.length; i < len; i++) {
          if (myArray[i][property] === searchTerm) {
            return i;
          }
        }
        return -1;
      },
      intersect_array: function (array1, array2) {
        // Return array of array1 items not found in array2
        var array1Uniques = array.filter(array1, function (item) {
          if (this.arrayObjectIndexOf(array2, item.fieldName, "fieldName") >= 0) {
            return true;
          } else {
            return false;
          }

        }, this);
        return array1Uniques;
      },
      loadFieldsTable: function () {
        this.commonFieldsTable.clear();
        var commonFields = null;
        var firstLay = true;
        array.forEach(this.layersTable.getRows(), function (row) {
          var rowData = this.layersTable.getRowData(row);
          if (rowData.update === true) {

            var layer = this.map.getLayer(rowData.id);
            //var fields = this.getEditableFields(layer.infoTemplate.info.fieldInfos);
            var fields = this.getEditableFields(this._getDefaultFieldInfos(layer.id));
            if (firstLay === true) {
              commonFields = fields;
              firstLay = false;
            } else {
              commonFields = this.intersect_array(commonFields, fields);
            }
          }
        }, this);
        if (commonFields === null) {
          domStyle.set(this.tableCommonFieldsError, 'display', '');
          domStyle.set(this.tableCommonFieldDesc, 'display', 'none');
          domStyle.set(this.tableCommonFieldHeader, 'display', 'none');
          domStyle.set(this.tableCommonFields, 'display', 'none');
          this.tableCommonFieldsError.innerHTML = this.nls.page3.noCommonFields;
        } else if (commonFields.length === 0) {
          domStyle.set(this.tableCommonFieldsError, 'display', '');
          domStyle.set(this.tableCommonFieldDesc, 'display', 'none');
          domStyle.set(this.tableCommonFieldHeader, 'display', 'none');
          domStyle.set(this.tableCommonFields, 'display', 'none');
          this.tableCommonFieldsError.innerHTML = this.nls.page3.noCommonFields;
        } else {
          domStyle.set(this.tableCommonFieldsError, 'display', 'none');
          domStyle.set(this.tableCommonFieldDesc, 'display', '');
          domStyle.set(this.tableCommonFieldHeader, 'display', '');
          domStyle.set(this.tableCommonFields, 'display', '');

          var selectedFields = array.map(this.config.commonFields, function (commonField) {
            return commonField.name;
          });
          var isEditable = false;
          array.forEach(commonFields, function (field) {
            if (selectedFields.indexOf(field.fieldName) > -1) {
              isEditable = true;
            } else {
              isEditable = false;
            }
            this.commonFieldsTable.addRow({
              fieldName: field.fieldName,
              label: field.label,
              isEditable: isEditable
            });

          }, this);

        }
      },
      createFieldsTable: function () {
        if (this.commonFieldsTable !== null) {
          return;
        }
        var commonFields = [{
          name: 'isEditable',
          title: this.nls.page3.fieldTable.colEdit,
          type: 'checkbox',
          width: 125,
          'class': 'editable'
        }, {
          name: 'fieldName',
          title: this.nls.page3.fieldTable.colName,
          type: 'text'
        }, {
          name: 'label',
          title: this.nls.page3.fieldTable.colAlias,
          type: 'text',
          editable: false
        }, {
          name: 'actions',
          title: this.nls.page3.fieldTable.colAction,
          type: 'actions',
          actions: ['up', 'down'],
          'class': 'editable'
        }];
        var commonFieldArgs = {
          fields: commonFields,
          selectable: false
        };
        this.commonFieldsTable = new SimpleTable(commonFieldArgs);
        this.commonFieldsTable.placeAt(this.tableCommonFields);
        this.commonFieldsTable.startup();
      },

      loadLayerTable: function (showOnlyEditable, queryFieldVisible) {

        var label = '';
        var tableValid = false;
        var update = false;

        var queryField;
        var selectByLayer;
        array.forEach(this.map.itemInfo.itemData.operationalLayers, function (layer) {
          if (layer.layerObject !== null && layer.layerObject !== undefined) {
            if (layer.layerObject.type === 'Feature Layer' && layer.url) {
              if ((showOnlyEditable && layer.layerObject.isEditable() === false)) {
              } else {

                label = layer.title;
                update = false;
                selectByLayer = false;
                queryField = null;
                var filteredArr = dojo.filter(this.config.updateLayers, function (layerInfo) {
                  return layerInfo.name === label;
                });
                if (filteredArr.length > 0) {
                  if (filteredArr[0].selectionSymbol) {
                    this.selectionSymbols[layer.layerObject.id] = filteredArr[0].selectionSymbol;
                  }
                  update = true;
                  queryField = filteredArr[0].queryField;
                }

                if (this.config.selectByLayer) {
                  if (this.config.selectByLayer.name === label) {
                    selectByLayer = true;
                    if (this.config.selectByLayer.hasOwnProperty("queryField")) {
                      queryField = this.config.selectByLayer.queryField;
                    }
                    if (this.config.selectByLayer.hasOwnProperty("selectionSymbol")) {
                      this.selectionSymbols[layer.layerObject.id] = this.config.selectByLayer.selectionSymbol;
                    }
                  }
                }
                var row = this.layersTable.addRow({
                  label: label,
                  update: update,
                  id: layer.layerObject.id,
                  selectByLayer: selectByLayer,
                  geometryType: layer.layerObject.geometryType,
                  queryField: queryField

                });
                tableValid = true;
                if (layer.layerObject.isEditable() === false) {
                  var cbxDom = query('.jimu-checkbox', row.tr)[0];
                  var cbxDijit = registry.byNode(cbxDom);
                  cbxDijit.setStatus(false);
                }
              }
            }
          }
        }, this);

        if (!tableValid) {
          domStyle.set(this.tableLayerInfosError, 'display', '');
        } else {
          domStyle.set(this.tableLayerInfosError, 'display', 'none');
          if (queryFieldVisible === true) {
            this.addQueryFields();
          }
        }
      },
      createLayerTable: function (selectByLayerVisible, queryFieldVisible) {
        var editFeaturesTableFields = [{
          name: 'update',
          title: this.nls.page2.layerTable.colUpdate,
          type: 'checkbox',
          width: 125,
          'class': 'editable'
        }, {
          name: 'label',
          title: this.nls.page2.layerTable.colLabel,
          type: 'text'
        }, {
          name: 'selectByLayer',
          title: this.nls.page2.layerTable.colSelectByLayer,
          type: 'radio',
          hidden: !selectByLayerVisible
        }, {
          name: 'queryFieldDropdown',
          title: this.nls.page2.layerTable.colSelectByField,
          type: 'empty',
          hidden: !queryFieldVisible
        }, {
          name: 'actions',
          title: this.nls.page2.layerTable.colhighlightSymbol,
          type: 'actions',
          width: 200,
          'class': 'symbolselector',
          actions: ['edit']
        }, {
          name: 'id',
          type: 'text',
          hidden: true
        }, {
          name: 'queryField',
          type: 'text',
          hidden: true
        }, {
          name: 'geometryType',
          type: 'text',
          hidden: true
        }];
        var args = {
          fields: editFeaturesTableFields,
          selectable: false
        };
        domConstruct.empty(this.tableLayerInfos);
        this.layersTable = new SimpleTable(args);
        this.layersTable.placeAt(this.tableLayerInfos);
        this.layersTable.startup();
        this.own(on(this.layersTable, 'actions-edit', lang.hitch(this, this.showSymbolSelector)));

      },
      showSymbolSelector: function (tr) {
        var tds = query('.action-item-parent', tr);
        if (tds && tds.length) {
          var data = this.layersTable.getRowData(tr);

          this.currentLayer = data.id;
          var args = {};
          args.data = data;
          args.selectionSymbols = this.selectionSymbols;
          args.nls = this.nls;
          var sourceDijit = new SymChooser(args);

          var popup = new Popup({
            width: 425,
            height: 475,
            content: sourceDijit,
            titleLabel: this.nls.symbolPopup,
            onClose: lang.hitch(this, function () {
              sourceDijit.destroy();
            }),
            buttons: [{
              label: this.nls.ok,
              onClick: lang.hitch(this, function () {
                this.selectionSymbols[this.currentLayer] = (sourceDijit.okPress()).getSymbol().toJson();
                popup.close();
              })
            }, {
              label: this.nls.cancel,
              classNames: ['jimu-btn-vacation'],
              onClick: lang.hitch(this, function () {
                popup.close();
              })
            }]
          });

        }
      }
    });
  });