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
/*global define */
define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/query",
  'dijit/registry',
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/on",
  './SymbolChooserPopup',
  'jimu/symbolUtils',
  "esri/symbols/jsonUtils",
  "jimu/dijit/Popup",
  'dojo/sniff',
  "dojo/_base/html",
  'jimu/dijit/SimpleTable',
  "dojo/text!./inputOutputSettings.html",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/form/ValidationTextBox",
  "jimu/utils",
  'dijit/Editor',
  "esri/dijit/VisibleScaleRangeSlider",
  "./FieldSelector",
  "jimu/dijit/Message",
  "dijit/form/Select",
  "dojo/dom-attr",
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
  'dojox/editor/plugins/UploadImage',
  'jimu/dijit/EditorChooseImage',
  'jimu/dijit/EditorTextColor',
  'jimu/dijit/EditorBackgroundColor'
], function (
  declare,
  lang,
  array,
  query,
  registry,
  domConstruct,
  domStyle,
  on,
  SymbolChooserPopup,
  symbolUtils,
  jsonUtils,
  Popup,
  has,
  html,
  Table,
  inputOutputSettings,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin,
  ValidationTextBox,
  utils,
  Editor,
  VisibleScaleRangeSlider,
  FieldSelector,
  Message,
  Select,
  domAttr
) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: inputOutputSettings,
    baseClass: 'jimu-widget-NetworkTrace-setting',
    _loadedPluginCSS: false,
    _hasSkipLocationsInput: false,

    startup: function () {
      this.inherited(arguments);
    },

    postCreate: function () {
      this._loadedPluginCSS = false;
      this._hasSkipLocationsInput = false;
      this._createInputTable();
      this._createOutputTable();
    },

    onProjectSettingsChanged: function (projectSettings) {
      array.forEach(this._outputTable.getRows(), lang.hitch(this, function (currentRow) {
        var disable = true;
        //if valid project settings then only enable all layerSelectors
        if (projectSettings && projectSettings.polygonLayerId &&
          projectSettings.pointLayerId &&
          projectSettings.outputParamName) {
          //disable only result param layer selector
          //and enable all other selectors
          disable = false;
          if (currentRow.config.paramName === projectSettings.outputParamName) {
            disable = true;
          }
        }
        if (currentRow) {
          currentRow.layerSelector.set("disabled", disable);
        }
      }));

    },

    _createInputTable: function () {
      var fields2, args2;
      fields2 = [{
        name: 'displayName',
        title: this.nls.common.name,
        type: 'text',
        width: '15%'
      }, {
        name: 'type',
        title: this.nls.inputOutputTab.typeText,
        type: 'empty',
        width: '25%'
      }, {
        name: 'toolTip',
        title: this.nls.inputOutputTab.inputTooltip,
        editable: true,
        type: 'text',
        width: '40%'
      }, {
        name: 'symbol',
        title: this.nls.inputOutputTab.symbol,
        type: 'empty',
        width: '10%'
      }];
      args2 = {
        fields: fields2,
        selectable: false
      };
      this._inputTable = new Table(args2);
      this._inputTable.placeAt(this.inputTableNode);
      this._inputTable.startup();
      this.setInputSettings();
    },

    getInputSettings: function () {
      var inputs, selectedInputTypeOption;
      inputs = [];
      array.forEach(this._inputTable.getRows(), lang.hitch(this, function (currentRow) {
        var inputInfo = {},
          rowData;
        if (currentRow) {
          rowData = this._inputTable.getRowData(currentRow);
          selectedInputTypeOption = this._getInputType(currentRow.inputTypeDropdownObj);
          inputInfo = {
            "paramName": currentRow.config.paramName,
            "displayName": currentRow.config.displayName,
            "toolTip": rowData.toolTip,
            "type": selectedInputTypeOption,
            "symbol": currentRow.symbol
          };
          inputs.push(inputInfo);
        }
      }));
      return inputs;
    },

    setInputSettings: function () {
      this._inputTable.clear();
      if (this.inputConfig && this.inputConfig.length > 0) {
        array.forEach(this.inputConfig, lang.hitch(this, function (inputTypeInfo) {
          var fieldsColumn, row;
          row = this._inputTable.addRow(inputTypeInfo);
          row.tr.config = inputTypeInfo;
          //set the has skip locaion flag once skip location inpit is found
          if (inputTypeInfo.type && this.inputDataTypes.skip_locations === inputTypeInfo.type) {
            this._hasSkipLocationsInput = true;
          }
          fieldsColumn = query('.simple-table-cell', row.tr);
          if (fieldsColumn) {
            this._addInputTypesDropDown(fieldsColumn[1], row.tr, inputTypeInfo);
            this._addSymbolPicker(fieldsColumn[3], row.tr, inputTypeInfo);
          }
        }));
      }
    },

    _createOutputTable: function () {
      var fields2, args2;
      fields2 = [{
          name: 'visibility',
          title: this.nls.inputOutputTab.visibilityText,
          type: 'checkbox',
          width: '10%'
        }, {
          name: 'displayName',
          title: this.nls.inputOutputTab.outputParametersText,
          type: 'text',
          width: '20%'
        }, {
          name: 'saveToLayer',
          title: "",
          type: 'empty',
          width: '26%'
        },
        {
          name: 'skipable',
          title: this.nls.inputOutputTab.skipText,
          type: 'checkbox',
          width: '12%'
        }, {
          name: 'exportToCSV',
          title: this.nls.inputOutputTab.exportToCsvText,
          type: 'checkbox',
          width: '12%'
        },
        {
          name: 'symbol',
          title: this.nls.inputOutputTab.symbol,
          type: 'empty',
          width: '10%'
        },
        {
          name: 'settings',
          title: this.nls.inputOutputTab.settitngstext,
          type: 'empty',
          width: '10%'
        }
      ];
      args2 = {
        fields: fields2,
        selectable: false
      };
      this._outputTable = new Table(args2);
      this._outputTable.placeAt(this.outputTableNode);
      this._outputTable.startup();
      this._addSaveToLayerMainDiv();
      this._addHelpIconToHeader();
      this.setOutputSettings();
      //on load enable/disable layer selectors based on projectsettings
      this.onProjectSettingsChanged(this.projectSettings);
    },

    /**
     * This function is used to add save to layer main div
     */
    _addSaveToLayerMainDiv: function () {
      var tableColumns, saveToLayerTableHeaderNode;
      tableColumns = query(".simple-table-thead tr", this.domNode)[1];
      if (tableColumns) {
        saveToLayerTableHeaderNode = tableColumns.children[2];
        if (saveToLayerTableHeaderNode) {
          var saveToLayerMainDiv = domConstruct.create('div', {
            'class': 'esriCTSaveToLayerMainDiv'
          }, saveToLayerTableHeaderNode);
          domConstruct.create('div', {
            'class': 'esriCTSaveToLayerLabelDiv',
            'innerHTML': this.nls.inputOutputTab.saveToLayerText,
            'title': this.nls.inputOutputTab.saveToLayerText
          }, saveToLayerMainDiv);
        }
      }
    },

    _getSaveToLayerInfo: function (layerSelector) {
      var info = {
        "saveToLayerId": "",
        "guidField": "",
        "parameterNameField": ""
      };
      var selectedInfo;
      if (layerSelector && layerSelector.get("value")) {
        selectedInfo = layerSelector._getSelectedOptionsAttr();
        info.saveToLayerId = selectedInfo.layerId;
        info.guidField = selectedInfo.guidField;
        info.parameterNameField = selectedInfo.parameterNameField;
      }
      return info;
    },

    getOutputSettings: function () {
      var outputs = [];
      array.forEach(this._outputTable.getRows(), lang.hitch(this, function (currentRow) {
        var outputInfo = {},
          rowData, saveToLayerInfo;
        if (currentRow) {
          rowData = this._outputTable.getRowData(currentRow);
          //get save to layer & field options
          saveToLayerInfo = this._getSaveToLayerInfo(currentRow.layerSelector);
          outputInfo = {
            "visibility": rowData.visibility,
            "paramName": currentRow.config.paramName,
            "type": "Result",
            "panelText": currentRow.config.panelText,
            "toolTip": currentRow.config.toolTip,
            "displayName": rowData.displayName,
            "displayText": currentRow.config.displayText,
            "MinScale": currentRow.config.MinScale,
            "MaxScale": currentRow.config.MaxScale,
            "exportToCSV": rowData.exportToCSV,
            "saveToLayer": saveToLayerInfo.saveToLayerId,
            "guidField": saveToLayerInfo.guidField,
            "parameternameField": saveToLayerInfo.parameterNameField,
            "symbol": currentRow.symbol
          };
          outputInfo.bypassDetails = {
            "skipable": rowData.skipable
          };
          outputs.push(outputInfo);
        }
      }));
      return outputs;
    },

    setOutputSettings: function () {
      if (this.outputConfig && this.outputConfig.length > 0) {
        array.forEach(this.outputConfig, lang.hitch(this, function (outputInfo) {
          var fieldsColumn, row, skipableCol;
          row = this._outputTable.addRow(outputInfo);
          fieldsColumn = query('.simple-table-cell', row.tr);
          row.tr.config = outputInfo;
          //disable skipable checkbox for output with geometryType other than point
          //or if the skipLocation input is not availbel in service
          if (outputInfo.data.defaultValue.geometryType !== "esriGeometryPoint" ||
            !this._hasSkipLocationsInput) {
            skipableCol = query(".skipable", row.tr);
            array.forEach(skipableCol, function (node) {
              var widget = registry.getEnclosingWidget(node.childNodes[0]);
              widget.setValue(false);
              widget.setStatus(false);
            });
          }
          if (fieldsColumn) {
            this._addSaveToLayerDropDown(fieldsColumn[2], row.tr);
            //add symbol picker in col
            this._addSymbolPicker(fieldsColumn[5], row.tr, outputInfo);
            //add settings icon in cal
            this._addSettingsIcon(fieldsColumn[6], row.tr);
          }
        }));
      }
    },

    _validateLayerCapabilities: function (layerobj) {
      var layerCapabilities;
      if (layerobj && layerobj.getEditCapabilities) {
        layerCapabilities = layerobj.getEditCapabilities();
        if (layerCapabilities.canCreate && layerCapabilities.canUpdate &&
          layerCapabilities.canDelete) {
          return true;
        }
      }
      return false;
    },

    _validateLayerFields: function (fields) {
      /**
       * Required Fields:
       * projectid (Guid type field)
       * parametername (String type field)
       */
      var hasParameterField, hasGUIDField, validFields;
      validFields = {
        "projectidField": null,
        "parameterNameField": null
      };
      hasParameterField = false;
      hasGUIDField = false;
      //loop through all fields and return if both the fields are found or not
      array.some(fields, function (field) {
        //check if GUID field is preset
        if (field.type === "esriFieldTypeGUID" && field.editable &&
          field.name.toLowerCase() === "projectid") {
          validFields.projectidField = field.name;
          hasGUIDField = true;
        }
        //Check if String field for parameter name is present
        if (field.type === "esriFieldTypeString" && field.editable &&
          field.name.toLowerCase() === "parametername") {
          validFields.parameterNameField = field.name;
          hasParameterField = true;
        }
        if (hasParameterField && hasGUIDField) {
          return true;
        }
      });
      if (!hasParameterField || !hasGUIDField) {
        validFields = null;
      }
      return validFields;
    },

    _createSaveToLayerOptions: function (geometryType) {
      var n, operationalLayers, saveToLayerOptions = [];
      //add deafult select option
      saveToLayerOptions.push({
        "value": "",
        "label": this.nls.projectSetting.selectLabel
      });
      // save to Layer type Dropdown
      if (this.map && this.map.itemInfo && this.map.itemInfo.itemData &&
        this.map.itemInfo.itemData.operationalLayers) {
        operationalLayers = this.map.itemInfo.itemData.operationalLayers;
        // loop's populates Dropdown values
        for (n = 0; n < operationalLayers.length; n++) {
          var option;
          // if layer type is feature Layer then
          if (operationalLayers[n] && operationalLayers[n].layerObject &&
            operationalLayers[n].layerType && operationalLayers[n].layerType ===
            "ArcGISFeatureLayer" &&
            operationalLayers[n].layerObject.fields &&
            geometryType === operationalLayers[n].layerObject.geometryType &&
            this._validateLayerCapabilities(operationalLayers[n].layerObject)) {
            var validFields = this._validateLayerFields(operationalLayers[n].layerObject.fields);
            if (validFields) {
              option = {
                "value": operationalLayers[n].id,
                "layerId": operationalLayers[n].id,
                "guidField": validFields.projectidField,
                "parameterNameField": validFields.parameterNameField,
                "label": operationalLayers[n].title
              };
              saveToLayerOptions.push(option);
            }

          }
        }
      }
      return saveToLayerOptions;
    },

    _addSaveToLayerDropDown: function (column, tr) {
      var selectParent, layerOptions, layerSelector;
      selectParent = domConstruct.create("div", {
        "class": "esriCTDropDownContainer"
      }, column);
      //get options based on geometry type
      layerOptions = this._createSaveToLayerOptions(tr.config.data.defaultValue.geometryType);
      //create layer selector using options
      layerSelector = new Select({
        options: layerOptions,
        "class": "esriCTLayerFieldSelector"
      });
      //place layer selector in table
      layerSelector.placeAt(selectParent);
      layerSelector.startup();
      tr.layerSelector = layerSelector;
      //if has prev selected value show it in selector
      if (tr.config && tr.config.saveToLayer) {
        layerSelector.set("value", tr.config.saveToLayer);
      }
    },

    _addSettingsIcon: function (fieldsColumn, tr) {
      var tolreanceParent, toleranceSettingIcon;
      tolreanceParent = domConstruct.create("div", {}, fieldsColumn);
      toleranceSettingIcon = domConstruct.create("div", {
        "class": "esriCTToleranceSettingsIcon",
        "title": this.nls.inputOutputTab.settitngstext
      }, domConstruct.create("div", {}, tolreanceParent));
      this.own(on(toleranceSettingIcon, "click", lang.hitch(this, function () {
        this._createOutputPanel(tr);
      })));
    },

    /**
     * This function loads the editor tool plugins CSS
     **/
    _initEditorPluginsCSS: function () {
      var head, tcCssHref, tcCss, epCssHref, epCss, pfCssHref, pfCss;
      head = document.getElementsByTagName('head')[0];
      tcCssHref = window.apiUrl + "dojox/editor/plugins/resources/css/TextColor.css";
      tcCss = query('link[href="' + tcCssHref + '"]', head)[0];
      if (!tcCss) {
        utils.loadStyleLink("editor_plugins_resources_TextColor", tcCssHref);
      }
      epCssHref = window.apiUrl + "dojox/editor/plugins/resources/editorPlugins.css";
      epCss = query('link[href="' + epCssHref + '"]', head)[0];
      if (!epCss) {
        utils.loadStyleLink("editor_plugins_resources_editorPlugins", epCssHref);
      }
      pfCssHref = window.apiUrl + "dojox/editor/plugins/resources/css/PasteFromWord.css";
      pfCss = query('link[href="' + pfCssHref + '"]', head)[0];
      if (!pfCss) {
        utils.loadStyleLink("editor_plugins_resources_PasteFromWord", pfCssHref);
      }
    },


    _initEditor: function () {
      //load plugin css only once
      if (!this._loadedPluginCSS) {
        this._loadedPluginCSS = true;
        this._initEditorPluginsCSS();
      }
      this._editorObj = new Editor({
        plugins: [
          'bold', 'italic', 'underline',
          utils.getEditorTextColor("networkTrace"),
          utils.getEditorBackgroundColor("networkTrace"),
          '|', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
          '|', 'insertOrderedList', 'insertUnorderedList', 'indent', 'outdent'
        ],
        extraPlugins: [
          '|', 'createLink', 'unlink', 'pastefromword', '|', 'undo', 'redo',
          '|', 'toolbarlinebreak',
          {
            name: "dijit._editor.plugins.FontChoice",
            command: "fontName",
            custom: "Arial;Comic Sans MS;Courier New;Garamond;Tahoma;Times New Roman;Verdana".
            split(";")
          }, 'fontSize', 'formatBlock'
        ],
        style: "font-family:Verdana;"
      }, this.editorDescription);
      domStyle.set(this._editorObj.domNode, {
        "width": '100%',
        "height": '100%'
      });
      this._editorObj.startup();
      if (has('ie') !== 8) {
        this._editorObj.resize({
          w: '100%',
          h: '100%'
        });
      } else {
        var box = html.getMarginBox(this.editorDescription);
        this._editorObj.resize({
          w: box.w,
          h: box.h
        });
      }
    },


    _createSlider: function (node, config, saveToLayerInfo) {
      var layer;
      if (saveToLayerInfo && saveToLayerInfo.saveToLayerId &&
        config.MinScale === 0 && config.MaxScale === 0) {
        layer = this.map.getLayer(saveToLayerInfo.saveToLayerId);
        this._visibleScaleRangeSlider = new VisibleScaleRangeSlider({
          map: this.map,
          layer: layer
        }, domConstruct.create("div", {}, node));
      } else {
        this._visibleScaleRangeSlider = new VisibleScaleRangeSlider({
          map: this.map
        }, domConstruct.create("div", {}, node));
        this._visibleScaleRangeSlider.set("minScale", config.MinScale);
        this._visibleScaleRangeSlider.set("maxScale", config.MaxScale);
      }
      this._visibleScaleRangeSlider.startup();
    },

    /**
     * This function the creates FieldSelector for respective fields
     * @param {string} container FieldSelector container Node
     * @param {string} textNode FieldSelector text content Node
     * @param {array} fieldsArray array of field selector values
     * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
     **/
    _createFieldSelector: function (container, textNode, fieldsArray) {
      var fieldSelector = new FieldSelector({
        "fields": fieldsArray,
        "showOnlyNumericFields": false,
        "skipObjectIdField": true,
        "hideOnSelect": true
      }, domConstruct.create("div", {}, container));
      fieldSelector.onSelect = lang.hitch(this, function (sectedField) {
        var newLabel;
        newLabel = textNode.get("value") + "{" + sectedField.name + "}";
        if (textNode.set) {
          textNode.set("value", newLabel);
        }
      });
    },



    /**
     * This function creates left title pane menu and binds the respective click events.
     * @memberOf widgets/isolation-trace/settings/outputSetting
     */
    _createOutputPanel: function (tr) {
      var parentContainer, title = "";

      title = tr.config.displayName;
      parentContainer = domConstruct.create("div");

      var parameterDiv = domConstruct.create("div", {
        "class": "ParameterDiv esriCTtaskDataContainer",
        style: {
          "max-height": "395px"
        }
      }, parentContainer);

      var sectionDiv = domConstruct.create("div", {
        "class": "section common-property"
      }, parameterDiv);

      //Label
      var labelParent = domConstruct.create("div", {
        "class": "field esriCTOutputOutageField",
        title: this.nls.inputOutputTab.inputLabel
      }, sectionDiv);

      domConstruct.create("label", {
        innerHTML: this.nls.inputOutputTab.inputLabel,
        title: this.nls.inputOutputTab.inputLabel
      }, labelParent);

      this.labelTextbox = new ValidationTextBox({
        required: true,
        "class": "common-input esriCTLabelClass"
      }, domConstruct.create("div", {}, labelParent));

      this.labelTextbox.set("value", tr.config.panelText);
      domConstruct.create("div", {
        "class": "esriCTHintField",
        "innerHTML": this.nls.hintText.labelTextHint
      }, labelParent);

      //Tooltip
      var tooltipParent = domConstruct.create("div", {
        "class": "field esriCTOutputOutageField",
        title: this.nls.inputOutputTab.inputTooltip
      }, sectionDiv);

      domConstruct.create("label", {
        innerHTML: this.nls.inputOutputTab.inputTooltip,
        title: this.nls.inputOutputTab.inputTooltip
      }, tooltipParent);

      this.tooltipTextbox = new ValidationTextBox({
        "class": "common-input esriCTTooltipDataClass"
      }, domConstruct.create("div", {}, tooltipParent));
      this.tooltipTextbox.set("value", tr.config.toolTip);

      //Display Text
      var displayParent = domConstruct.create("div", {
        "class": "field esriCTOutputOutageField",
        title: this.nls.inputOutputTab.outputDisplay
      }, sectionDiv);

      domConstruct.create("label", {
        innerHTML: this.nls.inputOutputTab.outputDisplay,
        title: this.nls.inputOutputTab.outputDisplay
      }, displayParent);

      var descriptionParent = domConstruct.create("div", {
        "class": "edit-description-box"
      }, displayParent);

      var addFieldConatiner = domConstruct.create("div", {
        "class": "esriCTAddFieldContainer",
        "title": this.nls.inputOutputTab.addFieldTitle
      }, descriptionParent);

      this.editorDescription = domConstruct.create("div", {}, descriptionParent);

      domConstruct.create("div", {
        "class": "esriCTHintField",
        "innerHTML": this.nls.hintText.displayTextHint
      }, displayParent);


      this._initEditor();

      var fieldsArray = tr.config.data.defaultValue.fields;

      this._createFieldSelector(addFieldConatiner, this._editorObj, fieldsArray);

      this._editorObj.set("value", tr.config.displayText);

      var scaleParent = domConstruct.create("div", {
        "class": "field esriCTOutputOutageField",
        title: this.nls.inputOutputTab.setScale
      }, sectionDiv);

      domConstruct.create("label", {
        innerHTML: this.nls.inputOutputTab.setScale,
        title: this.nls.inputOutputTab.setScale
      }, scaleParent);

      var saveToLayerInfo = this._getSaveToLayerInfo(tr.layerSelector);
      var horizantalSliderContainer = new domConstruct.create("div", {
        "class": "esriCTSliderContainer"
      }, scaleParent);
      this._createSlider(horizantalSliderContainer, tr.config, saveToLayerInfo);

      var fieldsPopup = new Popup({
        titleLabel: title,
        width: 875,
        maxHeight: 800,
        autoHeight: true,
        content: parentContainer,
        'class': this.baseClass,
        buttons: [{
          label: this.nls.common.ok,
          onClick: lang.hitch(this, function () {
            //validate if label is valid
            if (!this.labelTextbox.isValid()) {
              this.labelTextbox.focus();
              return;
            }
            tr.config.panelText = this.labelTextbox.get("value");
            tr.config.toolTip = this.tooltipTextbox.get("value");
            tr.config.displayText = this._editorObj.get("value");
            tr.config.MinScale = this._visibleScaleRangeSlider.minScale;
            tr.config.MaxScale = this._visibleScaleRangeSlider.maxScale;
            this._destroyEditorWidget();
            fieldsPopup.close();
          })
        }, {
          label: this.nls.common.cancel,
          classNames: ['jimu-btn-vacation'],
          onClick: lang.hitch(this, function () {
            this._destroyEditorWidget();
            fieldsPopup.close();
          })
        }],
        onClose: lang.hitch(this, function () {
          this._destroyEditorWidget();
        })
      });
    },


    /**
     * This method creates fall back symbol for Symbol preview.
     */
    _getFallbackSymbol: function (geometryType) {
      var jsonObj;
      if (!geometryType) {
        geometryType = "esriGeometryPoint";
      }
      switch (geometryType) {
        case "esriGeometryPoint":
          jsonObj = {
            "color": [0, 0, 128, 128],
            "outline": {
              "color": [0, 0, 128, 255],
              "width": 0.75,
              "type": "esriSLS",
              "style": "esriSLSSolid"
            },
            "size": 18,
            "type": "esriSMS",
            "style": "esriSMSCircle"
          };
          break;
        case "esriGeometryPolygon":
          jsonObj = {
            "color": [155, 187, 89, 129],
            "outline": {
              "color": [115, 140, 61, 255],
              "width": 1.5,
              "type": "esriSLS",
              "style": "esriSLSSolid"
            },
            "type": "esriSFS",
            "style": "esriSFSSolid"
          };
          break;
        case "esriGeometryPolyline":
          jsonObj = {
            "color": [155, 187, 89, 255],
            "type": "esriSLS",
            "style": "esriSLSSolid",
            "width": 2.25
          };
          break;
      }
      return jsonObj;
    },

    /**
     * This function is used to create table for adding new symbology
     */
    _addSymbolPicker: function (col, tr, currentRowValues) {
      //create params to initialize 'symbolchooserPopup' widget
      var objSymbol = {},
        geometryType;
      var symbolChooserTitle = "";
      if (currentRowValues && currentRowValues.data && currentRowValues.data.defaultValue &&
        currentRowValues.data.defaultValue.geometryType) {
        geometryType = currentRowValues.data.defaultValue.geometryType;
      } else {
        geometryType = "esriGeometryPoint";
      }

      if (currentRowValues.displayName) {
        symbolChooserTitle = currentRowValues.displayName;
      }
      //add default symbol in config
      var symbolType = "graphicLocationSymbol";
      if (tr.symbol) {
        objSymbol.symbol = jsonUtils.fromJson(tr.symbol);
      } else if (currentRowValues && currentRowValues.symbol) {
        objSymbol.symbol = jsonUtils.fromJson(currentRowValues.symbol);
      } else {
        // fetch selected symbol from config
        objSymbol.symbol = jsonUtils.fromJson(this._getFallbackSymbol(geometryType));
      }
      var params = {
        symbolChooserTitle: symbolChooserTitle,
        symbolParams: objSymbol,
        nls: this.nls,
        symbolType: symbolType
      };
      //create content div for symbol chooser node
      var symbolChooserNode = domConstruct.create("div", {
        "style": "height: 27px; overflow: hidden;"
      }, col);
      //display configured symbol in symbol chooser node
      this._showSelectedSymbol(symbolChooserNode, objSymbol.symbol, tr, geometryType);
      //attach 'click' event on node to display symbol chooser popup
      this.own(on(symbolChooserNode, 'click', lang.hitch(this, function () {
        //set recently selected symbol in symbol chooser popup
        params.symbolParams.symbol = jsonUtils.fromJson(tr.symbol);
        this._initSymbolChooserPopup(params, symbolChooserNode, tr, geometryType);
      })));
    },

    /**
     * Initialize symbol chooser popup widget
     * @param {object} params: contains params to initialize widget
     * @param {object} symbolChooserNode: contains node to display selected graphic symbol
     **/
    _initSymbolChooserPopup: function (params, symbolChooserNode, tr, geometryType) {
      var symbolChooserObj = new SymbolChooserPopup(params);
      //handler for poopup 'OK' button 'click' event
      symbolChooserObj.onOkClick = lang.hitch(this, function () {
        //get selected symbol
        var symbolJson = symbolChooserObj.symbolChooser.getSymbol();
        this._showSelectedSymbol(symbolChooserNode, symbolJson, tr, geometryType);
        symbolChooserObj.popup.close();
      });
    },
    /**
     * show selected graphic symbol in symbol chooser node
     * @param {object} symbolChooserNode: contains a symbol chooser node
     * @param {object} symbolJson: contains a json structure for symbol
     * @param {object} tr: table row in which symbol is created
     **/
    _showSelectedSymbol: function (symbolChooserNode, symbolJson, tr, geometryType) {
      domConstruct.empty(symbolChooserNode);
      var orgHeight, orgWidth, orgSize;
      if (symbolJson) {
        if (symbolJson.height > 26) {
          orgHeight = lang.clone(symbolJson.height);
          symbolJson.height = 26;
        }
        if (symbolJson.width > 26) {
          orgWidth = lang.clone(symbolJson.width);
          symbolJson.width = 26;
        }
        if (symbolJson.size > 20) {
          orgSize = lang.clone(symbolJson.size);
          symbolJson.size = 20;
        }
        var symbolNode = symbolUtils.createSymbolNode(symbolJson);
        // if symbol node is not created
        if (!symbolNode) {
          symbolNode = domConstruct.create('div');
        }
        domConstruct.place(symbolNode, symbolChooserNode);
        if (orgHeight) {
          symbolJson.height = orgHeight;
        }
        if (orgWidth) {
          symbolJson.width = orgWidth;
        }
        if (orgSize) {
          symbolJson.size = orgSize;
        }
        switch (geometryType) {
          case "esriGeometryPoint":
            domStyle.set(symbolChooserNode, "margin", "0 24px");
            break;
          case "esriGeometryPolygon":
            break;
          case "esriGeometryPolyline":
            domStyle.set(symbolNode, "width", "27px");
            domStyle.set(symbolNode, "overflow", "hidden");
            domStyle.set(symbolNode, "margin", "0 24px");
            break;
        }
        //store selected symbol in tr object
        tr.symbol = symbolJson.toJson();
      }
    },

    /**
     * This function is show help dialog popup
     */
    _addHelpIconToHeader: function () {
      var tableColumns, saveToLayerHelpNode, saveToLayerHelp, exportToCSVNode, checkBoxWidget;
      tableColumns = query(".simple-table-thead tr", this.domNode)[1];
      //If table exist, find nodes for adding help icons
      if (tableColumns) {
        saveToLayerHelpNode = tableColumns.children[2];
        saveToLayerHelpNode = saveToLayerHelpNode.childNodes[0];
        if (tableColumns.children[4]) {
          exportToCSVNode = tableColumns.children[4];
        }
      }
      // fetch the node of export to csv
      if (exportToCSVNode && exportToCSVNode.childNodes && exportToCSVNode.childNodes[0] &&
        exportToCSVNode.childNodes[0].hasAttribute("id")) {
        // fetch the checkbox of export to csv
        checkBoxWidget = registry.byId(exportToCSVNode.childNodes[0].id);
        if (checkBoxWidget) {
          // set the label if checkbox is available
          checkBoxWidget.setLabel(this.nls.inputOutputTab.exportToCsvDisplayText);
          // need to re-set the title, as setlabel function sets both the title & label
          if (checkBoxWidget.domNode && checkBoxWidget.domNode.children && checkBoxWidget.domNode.children[1]) {
            domAttr.set(checkBoxWidget.domNode.children[1], "title", this.nls.inputOutputTab.exportToCsvText);
          }
        }
      }
      //Create nodes for help icon
      saveToLayerHelp = domConstruct.create("div", {
        "class": "esriCTSaveTolayerHelpIcon"
      }, saveToLayerHelpNode);
      //Bind events
      on(saveToLayerHelp, "click", lang.hitch(this, function () {
        new Message({
          message: this.nls.inputOutputTab.saveToLayerHelp
        });
      }));
    },

    /**
     * This function is used to destroy editor widget on close/ok/cancel click of popup.
     * If not destroyed, if throws an console error in the firefox and popup does not open
     * on second click of gear icon.
     */
    _destroyEditorWidget: function () {
      if (this._editorObj) {
        this._editorObj.destroy();
        this._editorObj = null;
      }
    },

    /**
     * This function is used to add input Types select and its option in each
     * row ofinput setting table
     */
    _addInputTypesDropDown: function (column, tr, inputTypeInfo) {
      var selectParent, inputFlagTypeOptions, inputTypeDropdownObj;
      selectParent = domConstruct.create("div", {
        "class": "esriCTDropDownContainer"
      }, column);
      // Words "Flag", "Barrier" & "Skip" are not fetched from nls, since this implementation was
      // done after string freeze of AGOL7.1 and new keys cannot be added after that in NLS. Hence, it will
      // be fetched from nls in AGOL7.2 milestone.
      inputFlagTypeOptions = [{
          label: "Flag",
          value: this.inputDataTypes.flags
        },
        {
          label: "Barrier",
          value: this.inputDataTypes.barriers
        },
        {
          label: "Skip",
          value: this.inputDataTypes.skip_locations
        }
      ];
      inputTypeDropdownObj = new Select({
        options: inputFlagTypeOptions,
        "class": "esriCTLayerFieldSelector"
      });
      inputTypeDropdownObj.placeAt(selectParent);
      inputTypeDropdownObj.startup();
      if (inputTypeInfo.paramName.toLowerCase() === Object.keys(this.inputDataTypes)[0].toLowerCase()) {
        inputTypeDropdownObj.set("value", this.inputDataTypes.flags);
      }
      if (inputTypeInfo.paramName.toLowerCase() === Object.keys(this.inputDataTypes)[1].toLowerCase()) {
        inputTypeDropdownObj.set("value", this.inputDataTypes.barriers);
      }
      if (inputTypeInfo.paramName.toLowerCase() === Object.keys(this.inputDataTypes)[2].toLowerCase()) {
        inputTypeDropdownObj.set("value", this.inputDataTypes.skip_locations);
      }
      tr.inputTypeDropdownObj = inputTypeDropdownObj;
      //if has prev selected value show it in selector
      if (tr.config && tr.config.type) {
        inputTypeDropdownObj.set("value", tr.config.type);
      }
    },

    /**
     * This function is used to get value of selected input type
     */
    _getInputType: function (inputTypeDropdownObj) {
      var selectedInputFlagType;
      if (inputTypeDropdownObj !== '' && inputTypeDropdownObj !== null && inputTypeDropdownObj !== undefined) {
        selectedInputFlagType = inputTypeDropdownObj.get("value");
      }
      return selectedInputFlagType;
    }
  });
});