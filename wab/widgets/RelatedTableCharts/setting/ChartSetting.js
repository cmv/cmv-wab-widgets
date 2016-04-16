///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
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
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/Evented',
    'dojo/text!./ChartSetting.html',
    'jimu/dijit/TabContainer3',
    './ChartThemeSelector',
    './FieldSelector',
    'jimu/dijit/ColorPicker',
    'dojo/dom-class',
    'dojo/query',
    'dojo/_base/Color',
    'dojo/_base/array',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'dojo/dom-style',
    'jimu/dijit/Message',
    '../ChartLayout',
    'dijit/popup',
    'dojox/charting/themes/GreySkies',
    'jimu/dijit/SimpleTable',
    'dijit/form/Textarea'
  ],
  function (_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, domAttr,
    domConstruct, declare, lang, on, Evented, template, TabContainer3,
    ChartThemeSelector, FieldSelector, ColorPicker, domClass,
    dojoQuery, Color, array, Query, QueryTask, domStyle, Message, ChartLayout,
    popup, GreySkiesTheme, SimpleTable) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

      baseClass: 'jimu-widget-RelatedTableCharts-setting',
      templateString: template,

      _widgets: [],
      _stringFieldType: 'esriFieldTypeString',
      _oidFieldType: 'esriFieldTypeOID',
      _numberFieldTypes: ['esriFieldTypeSmallInteger',
        'esriFieldTypeInteger',
        'esriFieldTypeSingle',
        'esriFieldTypeDouble'
      ],
      tr: null,
      layerDetails: null,
      config: {},
      _chartColorType: {
        singleColor: "SingleColor",
        byThemeColor: "ColorByTheme",
        byFieldValue: "ColorByFieldValue"
      },
      selectedNode: null, //to store selected node from the table
      fieldColorPicker: null, //to store the instance of color picker
      defaultColor: "#000000", //to set default color in color picker
      constructor: function () {
        //reinitialize array
        this._widgets = [];
      },
      startup: function () {
        this.inherited(arguments);
      },

      postCreate: function () {
        this._createColorByFieldTable();
        this._initSelf();
      },

      destroy: function () {
        this.tr = null;
        delete this.tr;
        // destroy all widgets
        array.forEach(this._widgets, function (w) {
          w.destroy();
        });
        this._widgets = [];
        this.inherited(arguments);
      },

      /**
      * this function returns the new configured settings for ElectionResult widget
      * @param {boolean} showError
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      getConfig: function (showError) {
        var config = {
          sectionTitle: '',
          chartTitle: '',
          description: '',
          chartType: '',
          dataSeriesField: '',
          labelField: '',
          chartColor: {},
          labelXAxis: '',
          labelYAxis: ''
        };
        // validate if section title is not empty
        if (showError && this.sectionTitleTextBox.get('value') === "") {
          this._errorMessage(this.nls.errMsgSectionTitle);
          return false;
        } else {
          config.sectionTitle = this.sectionTitleTextBox.get('value');
        }
        config.chartTitle = this.chartTitleTextBox.get('value');
        config.description = this.chartDescriptionTextBoxArea.get(
          'value');
        config.chartType = this._getChartType();
        config.dataSeriesField = this.dataSeriesFieldDropdown.get(
          'value');
        config.labelField = this.labelSeriesFieldDropdown.get('value');

        // validate if color by field value is not empty
        if (showError && this.rdoColorByFieldValue.checked && this.ColorByFieldValueDropdown
          .value === "esriCTEmptyOption") {
          this._errorMessage(this.nls.errMsgFieldByValue);
          return false;
        } else {
          config.chartColor = lang.clone(this._getChartColorConfig());
        }

        config.labelXAxis = this.xAxisTextBox.get('value');
        config.labelYAxis = this.yAxisTextBox.get('value');

        return config;
      },

      /**
      * this function sets setting UI of different field values
      * @param {string} config contains the previously set configuration
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      setConfig: function (config) {
        // this.textNode.value = config.configText;
        if (config) {
          //set section title in textbox if configured else set the polygon layer name as section title
          if (config.sectionTitle && config.sectionTitle !== '') {
            this.sectionTitleTextBox.set('value', config.sectionTitle);
          } else {
            this.sectionTitleTextBox.set("value", this.layerDetails.polygonLayerInfo
              .title);
          }

          //set chart title in textbox
          if (config.chartTitle) {
            this.chartTitleTextBox.set('value', config.chartTitle);
          }

          //set description
          if (config.description) {
            this.chartDescriptionTextBoxArea.set('value', config.description);
          }

          //set chart type if availeble else set defult chart type to bar chart
          if (config.chartType) {
            this._setChartType(config.chartType);
          } else {
            this._setChartType("BarChart");
          }

          //set dataseriesfield in dropdown
          if (config.dataSeriesField) {
            this.dataSeriesFieldDropdown.set('value', config.dataSeriesField);
          }

          //set labelfield in dropdown
          if (config.labelField) {
            this.labelSeriesFieldDropdown.set('value', config.labelField);
          }

          //set chart type and color
          if (config.chartColor) {
            this._setChartColorType(config.chartColor);
          }

          //set x-axis label of the chart
          if (config.labelXAxis) {
            this.xAxisTextBox.set('value', config.labelXAxis);
          }
          //set y-axis label of the chart
          if (config.labelYAxis) {
            this.yAxisTextBox.set('value', config.labelYAxis);
          }

        } else {
          //by deafult set layer title in section title textbox
          this.sectionTitleTextBox.set("value", this.layerDetails.polygonLayerInfo
            .title);
        }
      },

      /**create table to display color picker and configured field value
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _createColorByFieldTable: function () {
        //create fields object for table
        var tableFields = [{
          name: this.nls.fieldColorColor,
          title: this.nls.fieldColorColor,
          "class": "label",
          type: "empty",
          width: "50px"
        }, {
          name: this.nls.fieldColorLabel,
          title: this.nls.fieldColorLabel,
          "class": "label",
          type: "empty"
        }];

        //initialize table to display configure field's distinct values with color picker
        this.colorByFieldTable = new SimpleTable({
          fields: tableFields
        }, this.colorByFieldTablePanel);
        this.colorByFieldTable.startup();
      },
      /**
      * This function create error alert.
      * @param {string} err contains error message
      * @memberOf widgets/RelatedTableCharts/settings/ChartSetting
      **/
      _errorMessage: function (err) {
        var errorMessage = new Message({
          message: err
        });
        errorMessage.message = err;
      },

      /**
      * This function returns selected chart type
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _getChartType: function () {
        var chartType;
        //if radio button of bar chart is checked
        //else if pie chart is selected then return selected chart
        if (this.rdoBarChart.get('checked')) {
          chartType = "BarChart";
        } else if (this.rdoPieChart.get('checked')) {
          chartType = "PieChart";
        }
        return chartType;
      },

      /**
      * This function returns set the selected chart type
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _setChartType: function (chartType) {
        if (chartType === "BarChart") {
          this.rdoBarChart.set('checked', true);
          this.rdoPieChart.set('checked', false);
        } else if (chartType === "PieChart") {
          this.rdoPieChart.set('checked', true);
          this.rdoBarChart.set('checked', false);
        }
      },

      /**
      * This function initializes the chartSetting widget components
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _initSelf: function () {
        this._initTabs();
        //set default value for single color picker
        this.colorPicker.setColor(new Color(this.defaultColor));
        //init field selectors for selecting fields to be shown in labels/title/description etc.
        this._initFieldSelectors();

        //Create options to be shown in data field (numeric fields from related table will be shown)
        this._createRelatedLayerFieldOptions(this.dataSeriesFieldDropdown,
          false, this._numberFieldTypes);
        //Create options to be shown in label field (all fields from related table will be shown, with select option)
        this._createRelatedLayerFieldOptions(this.labelSeriesFieldDropdown,
          true, null);
        //create color picker to set the color of table node
        this._createFieldColorPicker();
        //create chart theme selector
        this._createThemeSelector(this.themeSelectorDiv);
        // check radio buttons on selecting controls
        on(this.colorPicker, "click", lang.hitch(this, function () {
          this.rdoSingleColor.set("checked", true);
        }));
        on(this.themeSelectorDiv, "click", lang.hitch(this, function () {
          this.rdoColorByTheme.set("checked", true);
        }));
        on(this.ColorByFieldValueDropdown, "click", lang.hitch(this, function () {
          this.rdoColorByFieldValue.set("checked", true);
        }));
        //show color by field option only if layer support distinct query
        if (this.layerDetails.polygonLayerInfo.supportsDistinct) {
          domClass.remove(this.colorByFieldContainer, "esriCTHidden");
          //create options for dropdown ColorByFields
          this._createColorByFieldSelector();
        }
      },

      /**
      * Creates a color picker popup
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _createFieldColorPicker: function () {
        //initialize color picker
        this.fieldColorPicker = new ColorPicker();
        this.fieldColorPicker.startup();
        //on closing color picker dialog deselect selected rows
        on(this.fieldColorPicker.tooltipDialog, "close", lang.hitch(this, function () {
          var trs;
          if (domClass.contains(this.selectedNode.parentElement.parentElement,
                "jimu-state-active")) {
            trs = dojoQuery('.jimu-state-active', this.colorByFieldTableContainer);
            if (trs.length > 0) {
              trs.removeClass('jimu-state-active');
            }
          }
        }));
        on(this.fieldColorPicker, "change", lang.hitch(this, function () {
          var tableRows, selectedColor = this.fieldColorPicker.color.toHex();
          //get all selected rows from table
          tableRows = dojoQuery('.jimu-state-active .fieldColorPicker',
            this.colorByFieldTableContainer);
          //check whether any row is selected
          if (tableRows.length > 0) {
            //check if selected node's row is selected
            if (domClass.contains(this.selectedNode.parentElement.parentElement,
                "jimu-state-active")) {
              array.forEach(tableRows, lang.hitch(this, function (node) {
                //set the color to the selected row's div
                domStyle.set(node, "backgroundColor", selectedColor);
                domAttr.set(node.parentElement.parentElement,
                  "field_Color", selectedColor);
              }));
            } else {
              //if no row is selected then set the color to the selected div
              domStyle.set(this.selectedNode, "backgroundColor",
                selectedColor);
              domAttr.set(this.selectedNode.parentElement.parentElement,
                "field_Color", selectedColor);
            }
          } else {
            //if no row is selected then set the color to the selected div
            domStyle.set(this.selectedNode, "backgroundColor",
              selectedColor);
            domAttr.set(this.selectedNode.parentElement.parentElement,
              "field_Color", selectedColor);
          }
        }));
      },

      /**
      * This function sets selected colors to the field color div
      * {string} config chart color by field value is saved in the configuration file
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _setChartColorType: function (config) {
        // if chart color value available and also chart color type is given
        if (config && config.colorType) {
          this.rdoSingleColor.set('checked', false);
          // if chart color type is SingleColor
          if (config.colorType === this._chartColorType.singleColor) {
            this.rdoSingleColor.set('checked', true);
            this.colorPicker.setColor(new Color(config.colorInfo));
          } else if (config.colorType === this._chartColorType.byThemeColor) {
            // if chart color type is ColorByTheme
            this.rdoColorByTheme.set('checked', true);
            //If color by type is theme then set the selected theme in theme selector widget
            if (this.config.chartColor && this.config.chartColor.colorType ===
              this._chartColorType.byThemeColor && this.chartThemeSelector
            ) {
              setTimeout(lang.hitch(this, function () {
                this.chartThemeSelector.selectTheme(config.colorInfo);
              }), 500);
            }
          } else if (config.colorType === this._chartColorType.byFieldValue) {
            // if chart color type is ColorByFieldValue
            this.rdoColorByFieldValue.set('checked', true);
            this.ColorByFieldValueDropdown.set("value", config.colorInfo
              .layerField);
            domClass.remove(this.colorByFieldTableContainer,
              "esriCTHidden");
          }
        }
      },

      /**
      * This function the initializes jimu tab for setting and layout
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _initTabs: function () {
        var tabSettings, tabPreview, tabs;
        //create object to display chart setting in tab container
        tabSettings = {
          title: this.nls.settingTabTitle,
          content: this.settingsTabNode
        };
        //create object to display chart preview in tab container
        tabPreview = {
          title: this.nls.layoutTabTitle,
          content: this.layoutTabNode
        };

        tabs = [tabSettings, tabPreview];
        this.tab = new TabContainer3({
          tabs: tabs
        });
        this.tab.placeAt(this.tabDiv);
        this.own(on(this.tab, 'tabChanged', lang.hitch(this, function (
          title) {
          //show updated charts with updated configuration
          if (title === tabPreview.title) {
            this._updatePreview();
          }
        })));
      },

      /**
      * This function the updates the chart layout(preview)
      * according to the newly set settings different parameters
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _updatePreview: function () {
        var chartDetails, chartLayoutObj;
        domConstruct.empty(this.layoutDiv);
        chartDetails = { "chartConfig": this.getConfig(), "isPreview": true };
        //check if valid chart settings then only update preview
        if (chartDetails.chartConfig) {
          //if any label is not selected then set the value to empty string
          if (chartDetails.chartConfig.labelField === "esriCTEmptyOption") {
            chartDetails.chartConfig.labelField = " ";
          }
          //get static data for preview
          chartDetails.chartData = this._createStaticDataForLayout(
            chartDetails.chartConfig.chartType,
            chartDetails.chartConfig.labelField,
            chartDetails.chartConfig.dataSeriesField
          );
          chartLayoutObj = new ChartLayout({
            config: chartDetails
          });
          chartLayoutObj.placeAt(domConstruct.create("div", {}, this.layoutDiv));
          chartLayoutObj.startup();
        }
      },

      /**
      * This function creates static data for the layout(preview) chart
      * @param {string} : chartType (BarChart, PieChart)
      * @param {string} : labelField
      * @param {string} : dataSeriesField
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _createStaticDataForLayout: function (chartType, labelField, dataSeriesField) {
        var chartData = { chartSeries: [], chartLabels: [], selectedTheme: GreySkiesTheme };
        switch (chartType) {
          case "BarChart":
            chartData.chartSeries = [
              { "y": 65 },
              { "y": 35 },
              { "y": 40 },
              { "y": 55 },
              { "y": 50 }
            ];
            chartData.chartLabels = [
              { "value": 1, "y": 65, "text": "" },
              { "value": 2, "y": 35, "text": "" },
              { "value": 3, "y": 40, "text": "" },
              { "value": 4, "y": 55, "text": "" },
              { "value": 5, "y": 50, "text": "" }
            ];
            chartData.fill = "#7989a0";
            break;
          case "PieChart":
            chartData.chartSeries = [
              { "y": 65, "text": "{" + dataSeriesField + " %}" },
              { "y": 35, "text": "{" + labelField + "}" }
            ];
            chartData.chartLabels = [{ "value": 1, "y": 65 }, { "value": 2, "y": 35}];
            break;
        }
        return chartData;
      },


      /**
      * This function the updates the chart layout preview
      * according to the newly set settings different parameters
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _initFieldSelectors: function () {
        //create titleFieldSelector
        this._createFieldSelector(this.titleFieldSelectorDiv, this.chartTitleTextBox,
          this.layerDetails.polygonLayerInfo.fields);

        //create descriptionFieldSelector
        this._createFieldSelector(this.descriptionFieldSelectorDiv,
          this.chartDescriptionTextBoxArea, this.layerDetails.polygonLayerInfo
          .fields);

        //create x-axis label field selector
        this._createFieldSelector(this.xAxisFieldSelectorDiv, this
          .xAxisTextBox, this.layerDetails.polygonLayerInfo.fields
        );

        //create y-axis label field selector
        this._createFieldSelector(this.yAxisFieldSelectorDiv,
          this.yAxisTextBox, this.layerDetails.polygonLayerInfo
          .fields);

      },

      /**
      * This function the creates FieldSelector for respective fields
      * {string} container FieldSelector container Node
      * {string} textNode FieldSelector text content Node
      * {array} fieldsArray array of field selector values
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _createFieldSelector: function (container, textNode, fieldsArray) {
        var fieldSelector = new FieldSelector({
          "fields": fieldsArray,
          "showOnlyNumericFields": false,
          "hideOnSelect": true
        }, domConstruct.create("div", {}, container));
        fieldSelector.onSelect = lang.hitch(this, function (sectedField) {
          var newLabel = domAttr.get(textNode, "value");
          newLabel = newLabel + "{" + sectedField.name + "}";
          if (textNode.set) {
            textNode.set("value", newLabel);
          } else {
            domAttr.set(textNode, "value", newLabel);
          }
        });
        //add to the widgets array
        this._widgets.push(fieldSelector);
        return fieldSelector;
      },

      /**
      * This function the creates ThemeSelector
      * {string} container node where theme selector created
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _createThemeSelector: function (container) {
        if (!this.chartThemeSelector) {
          this.chartThemeSelector = new ChartThemeSelector({},
            domConstruct.create("div", {}, container));
          //add to the widgets array
          this._widgets.push(this.chartThemeSelector);
        }
        return this.chartThemeSelector;
      },

      /* Events */
      _onSectionTitleChanged: function () {
        this.emit('sectionTitleChanged', this.sectionTitleTextBox.get(
          'value'));
      },

      showMainLoadingIndicator: function () {
        this.emit("showLoadingIndicator");
      },

      hideMainLoadingIndicator: function () {
        this.emit("hideLoadingIndicator");
      },

      _onChartTypeChanged: function () {
        if (this.rdoPieChart.get('checked')) {
          domClass.add(this.xAxisArea, "esriCTHidden");
          domClass.add(this.yAxisArea, "esriCTHidden");
        } else {
          domClass.remove(this.xAxisArea, "esriCTHidden");
          domClass.remove(this.yAxisArea, "esriCTHidden");
        }
      },

      /* Color by field value code*/

      /**
      * This function the creates Related Layer Field Options
      * {string} dropDown node where Field drop down created
      * {boolean} addFirstValueAsSelect flag value which decides default option
      * {array} showFieldsArray array of integer data types
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _createRelatedLayerFieldOptions: function (dropDown,
        addFirstValueAsSelect, showFieldsArray) {
        var option = {},
          fieldsArray, addField, i;
        fieldsArray = this.layerDetails.relatedLayerInfo.fields;
        if (fieldsArray && fieldsArray.length > 0) {
          if (addFirstValueAsSelect) {
            dropDown.addOption({
              value: "esriCTEmptyOption",
              label: this.nls.defaultFieldSelectLabel,
              selected: true
            });
          }
          for (i = 0; i < fieldsArray.length; i++) {
            addField = true;
            if (showFieldsArray && showFieldsArray.indexOf(fieldsArray[
                i].type) <
              0) {
              addField = false;
            }
            if (addField) {
              option = {
                value: fieldsArray[i].name,
                label: fieldsArray[i].name,
                selected: false
              };
              // by default show first field as selected
              if (i === 0 && !addFirstValueAsSelect) {
                option.selected = true;
              }
              dropDown.addOption(option);
            }
          }
        }
      },

      /**
      * This function populates options in layer Field Drop Down
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _createColorByFieldSelector: function () {
        domConstruct.empty(this.ColorByFieldValueDropdown);
        this._createRelatedLayerFieldOptions(this.ColorByFieldValueDropdown,
          true);
        // binding on change event on drop down value change
        on(this.ColorByFieldValueDropdown, "change", lang.hitch(this,
          function (selectedField) {
            this.showMainLoadingIndicator();
            // if default select is selected then remove all the rows from the color picker table
            if (selectedField === "esriCTEmptyOption") {
              this._removeTableRows();
              domClass.add(this.colorByFieldTableContainer,
                "esriCTHidden");
              this.hideMainLoadingIndicator();
            } else {
              this._getDistintValueForLayerField(selectedField);
            }
          }));
      },

      /**
      * This function creates field color table for setting
      * different colors for fields
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _getDistintValueForLayerField: function (selectedField) {
        var queryTaskValue, queryField;
        this._selectedUniqueValues = [];
        queryTaskValue = new QueryTask(this.layerDetails.relatedLayerInfo.url);
        queryField = new Query();
        queryField.where = "1=1";
        queryField.returnDistinctValues = true;
        queryField.returnGeometry = false;
        queryField.outFields = [selectedField];
        queryTaskValue.execute(queryField, lang.hitch(this, function (
          response) {
          var selectedFieldDetails;
          //push selected attributes's value of all the features into an array
          array.forEach(response.features, lang.hitch(this, function (feature) {
            this._selectedUniqueValues.push(feature.attributes[selectedField]);
          }));
          if (this._selectedUniqueValues.length > 0 && response.fields && response.fields
                .length > 0 && response.fields[0].type) {
            // get the fieldTypeof selected fields
            selectedFieldDetails = lang.clone(response.fields[0]);
            // Sort data in ascending order based on the dataType
            if (this._selectedUniqueValues.length > 1) {
              this._sortUniqueValueData(selectedFieldDetails.type);
            }
            //create table rows for distinct value of the layer field
            this._createTableRows(selectedFieldDetails);
          } else {
            this._errorMessage(this.nls.errMsgFieldValuesNotFound);
            this.hideMainLoadingIndicator();
          }
        }), lang.hitch(this, function () {
          this._errorMessage(this.nls.errMsgFieldValuesNotFound);
          this.hideMainLoadingIndicator();
        }));
      },

      /**
      * This function removes all the rows from the table
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _removeTableRows: function () {
        var rows, i;
        // loop for creating rows for fields available in the layer
        rows = this.colorByFieldTable.getRows();
        if (rows && rows.length > 0) {
          // loop for deleting all the rows if already exist for different field value
          for (i = 0; i < rows.length; i++) {
            this.colorByFieldTable.deleteRow(rows[i]);
          }
        }
      },

      /**
      * This function creates field color table for setting
      * different colors for fields
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _createTableRows: function (selectedFieldDetails) {
        var tr, tds;
        this._removeTableRows();
        domClass.remove(this.colorByFieldTableContainer, "esriCTHidden");
        // if unique values array for the field is available
        array.forEach(this._selectedUniqueValues, lang.hitch(this, function (selectedValue) {
          var result, displayValue;
          result = this.colorByFieldTable.addRow({});
          displayValue = selectedValue;
          // if row is created successfully and tr is exist
          if (result.success && result.tr) {
            //Update display lable based on data type and domain
            if (selectedFieldDetails.type === "esriFieldTypeDate") {
              displayValue = this._getLocaleFormatedDate(selectedValue);
            }
            tr = result.tr;
            //query for all columns of created row
            tds = dojoQuery('.simple-table-cell', tr);
            // creates color picker for the field value row
            this._createColorPicker(tr, selectedValue, tds[0]);

            // creates label for the field value row
            this._createLabelFields(displayValue, tds[1]);
          }
          if (tr) {
            on(tr, "click", lang.hitch(this, function (e) {
              this._toggleRowSelection(e.currentTarget);
            }));
          }
        }));
        this.hideMainLoadingIndicator();
      },

      /**
      * This function select and de select the color by field values from table rows
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _toggleRowSelection: function (tr) {
        if (!domClass.contains(tr, "jimu-state-active")) {
          domClass.add(tr, 'jimu-state-active');
        } else {
          domClass.remove(tr, 'jimu-state-active');
        }
      },

      /**
      * This function create field label DOM for every fields in table row
      * {string} value distinct value of layer Field
      * {object} td column field
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _createLabelFields: function (value, td) {
        var fields;
        fields = domConstruct.create("label", {
          "innerHTML": value,
          "title": value
        }, td);
      },

      /**
      * This function create field color div for every fields in table row
      * sets the default color or previously saved color from this.config
      * {object} tr instance of created row and
      * {string} value distinct value of layer Field
      * {object} td instance of created column
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _createColorPicker: function (tr, value, td) {
        var fieldColorNode, color;
        fieldColorNode = domConstruct.create("div", { "class": "fieldColorPicker" }, td);
        //check whether current value is configured with color
        if (this.config && this.config.chartColor && this.config.chartColor.colorInfo &&
          this.config.chartColor.colorInfo.layerFieldValues && this.config.chartColor
          .colorInfo.layerFieldValues[value]) {
          color = this.config.chartColor.colorInfo.layerFieldValues[value];
        } else {
          color = this.defaultColor;
        }
        domStyle.set(fieldColorNode, "backgroundColor", color);
        domAttr.set(tr, "fieldVal", value);
        domAttr.set(tr, "field_Color", color);
        on(fieldColorNode, "click", lang.hitch(this, function (event) {
          event.stopPropagation();
          event.preventDefault();
          this.selectedNode = event.currentTarget;
          //set selected node's current color in color picker
          var nodeColor = domAttr.get(this.selectedNode.parentElement.parentElement, "field_Color");
          this.fieldColorPicker.setColor(new Color(nodeColor));
          //set the color of the picker
          this.fieldColorPicker.picker.setColor(new Color(nodeColor).toHex(), true);
          //display color picker popup
          popup.open({
            popup: this.fieldColorPicker.tooltipDialog,
            around: event.currentTarget
          });
        }));
      },

      /**
      * This function gets color of field values
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _getColorByFieldValue: function () {
        var i, getColorOfFieldsDistinctValue = {}, distinctValueArr = {}, trs;
        //get all the rows from color by Field table list
        trs = this.colorByFieldTable.getRows();
        //iterates through all the rows and get value name and configured color for value,
        //and push into distinctValueArr array
        for (i = 0; i < trs.length; i++) {
          distinctValueArr[domAttr.get(trs[i], "fieldVal")] = domAttr.get(trs[i], "field_Color");
        }
        getColorOfFieldsDistinctValue.layerFieldValues = distinctValueArr;
        getColorOfFieldsDistinctValue.layerField = this.ColorByFieldValueDropdown.value;
        return getColorOfFieldsDistinctValue;
      },

      /**
      * This function returns selected chart color type and its color information
      * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
      **/
      _getChartColorConfig: function () {
        var chartColor = {};
        //if single color is selected
        if (this.rdoSingleColor.checked) {
          chartColor.colorType = this._chartColorType.singleColor;
          chartColor.colorInfo = this.colorPicker.getColor().toHex();
        } else if (this.rdoColorByTheme.checked) {
          //if color by theme is selected
          chartColor.colorType = this._chartColorType.byThemeColor;
          chartColor.colorInfo = this.chartThemeSelector.selectedTheme;
        } else if (this.rdoColorByFieldValue.checked) {
          //if color by Fields distinct value
          chartColor.colorType = this._chartColorType.byFieldValue;
          chartColor.colorInfo = this._getColorByFieldValue();
        }
        return chartColor;
      },

      /**
      * This function sort the list for chart color by field value
      * {string} data type of selected field value
      * @memberOf widgets/RelatedTableCharts/setting/settings
      **/
      _sortUniqueValueData: function (dataType) {
        if (dataType === "esriFieldTypeString") {
          // if data is of string type
          this._selectedUniqueValues.sort();
        } else {
          // if data is of numeric type
          this._selectedUniqueValues.sort(lang.hitch(this, function (a,
              b) {
            return a - b;
          }));
        }
      },

      /**
      * This function return a locale date value
      * {number} UTC date format value
      * @memberOf widgets/RelatedTableCharts/setting/settings
      **/
      _getLocaleFormatedDate: function (dateFieldValue) {
        var dateValue = new Date(dateFieldValue);
        return dateValue.toLocaleDateString();
      }
      /*Code for color by field value ends here*/
    });
  });