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
    'dojo/_base/html',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/Color',
    'dojo/query',
    'jimu/dijit/TabContainer3',

    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    'jimu/LayerStructure',
    'jimu/utils',

    'dijit/form/NumberSpinner',
    'dijit/registry',
    'jimu/dijit/Message',
    'dijit/_WidgetsInTemplateMixin',
    './js/ColorPickerEditor',
    'dijit/ColorPalette'

  ],
  function (
    dojoDeclare,
    dojoHTML,
    dojoLang,
    dojoArray,
    dojoColor,
    dojoQuery,
    TabContainer,
    jimuBaseWidgetSetting,
    jimuTable,
    LayerStructure,
    jimuUtils,
    dijitNumberSpinner,
    dijitRegistry,
    dijitMessage,
    dijitWidgetsInTemplateMixin,
    ColorPickerEditor
  ) {

    return dojoDeclare([jimuBaseWidgetSetting, dijitWidgetsInTemplateMixin], {
      baseClass: 'distance-and-direction-setting',

      postCreate: function () {
        this.inherited(arguments);
        this._populateLayerSelect(this._getAllMapLayers("esriGeometryPolyline"), this.opLineLayerList);
        this._populateLayerSelect(this._getAllMapLayers("esriGeometryPolygon"), this.opPolygonLayerList);
      },

      startup: function () {
        this.tab = new TabContainer({
          tabs: [{
            title: this.nls.ddFeedbackStyleTabLabel,
            content: this.ddFeedbackStyleTab
          }, {
            title: this.nls.miscellaneousTabLabel,
            content: this.miscellaneousTab
          }],
          selected: this.nls.gridTabLabel
        });
        this.tab.placeAt(this.tabsContainer);
        this.tab.startup();
        this.inherited(arguments);
        var feedbackTableFields = [{
          name: 'showTab',
          title: this.nls.showTabLabel,
          width: '16%',
          type: 'checkbox',
          onChange: dojoLang.hitch(this, this._checkBoxChange),
          'class': 'show'
        }, {
          name: 'index',
          title: 'index',
          type: 'text',
          hidden: true
        }, {
          name: 'feedbackShape',
          title: this.nls.feedbackShapeLabel,
          width: '28%',
          type: 'text'
        }, {
          name: 'lineColor',
          title: this.nls.lineColorLabel,
          create: dojoLang.hitch(this, this._createColorPicker),
          setValue: dojoLang.hitch(this, this._setColorPicker),
          getValue: dojoLang.hitch(this, this._getColorPicker),
          width: '28%',
          type: 'extension'
        }, {
          name: 'lineWidth',
          title: this.nls.lineWidthLabel,
          create: dojoLang.hitch(this, this._createNumberSpinner),
          setValue: dojoLang.hitch(this, this._setNumberSpinnerValue),
          getValue: dojoLang.hitch(this, this._getNumberSpinnerValue),
          type: 'extension',
          width: '28%'
        }];

        var feedbackArgs = {
          fields: feedbackTableFields,
          selectable: true,
          autoHeight: false
        };

        this.displayFeedbackTable = new jimuTable(feedbackArgs);
        this.displayFeedbackTable.placeAt(this.feedbackTable);
        dojoHTML.setStyle(this.displayFeedbackTable.domNode, {
          'height': '100%'
        });

        var labelTableFields = [{
          name: 'index',
          title: 'index',
          type: 'text',
          hidden: true
        }, {
          name: 'feedbackLabel',
          title: this.nls.feedbackLabel,
          width: '44%',
          type: 'text'
        }, {
          name: 'textColor',
          title: this.nls.textColorLabel,
          create: dojoLang.hitch(this, this._createColorPicker),
          setValue: dojoLang.hitch(this, this._setColorPicker),
          getValue: dojoLang.hitch(this, this._getColorPicker),
          width: '28%',
          type: 'extension'
        }, {
          name: 'textSize',
          title: this.nls.textSizeLabel,
          create: dojoLang.hitch(this, this._createTextNumberSpinner),
          setValue: dojoLang.hitch(this, this._setNumberSpinnerValue),
          getValue: dojoLang.hitch(this, this._getNumberSpinnerValue),
          type: 'extension',
          width: '28%'
        }];

        var labelArgs = {
          fields: labelTableFields,
          selectable: true,
          autoHeight: false
        };

        this.displayLabelTable = new jimuTable(labelArgs);
        this.displayLabelTable.placeAt(this.labelTable);
        dojoHTML.setStyle(this.displayLabelTable.domNode, {
          'height': '100%'
        });
        this.setConfig(this.config);
      },

      _createColorPicker: function (td) {
        var colorPicker = new ColorPickerEditor({
          nls: this.nls
        });
        colorPicker.placeAt(td);
        colorPicker.startup();
      },

      _getColorPicker: function (td) {
        return dijitRegistry.byId(td.childNodes[0].id).getValues();
      },

      _setColorPicker: function (td, color) {
        dijitRegistry.byId(td.childNodes[0].id).setValues({
          color: new dojoColor(color)
        });
      },

      _createNumberSpinner: function (td) {
        var numberSpinner = new dijitNumberSpinner({
          value: 2,
          smallDelta: 1,
          constraints: {
            min: 1,
            max: 10,
            places: 0
          },
          style: "width:100px"
        });
        numberSpinner.placeAt(td);
      },

      _createTextNumberSpinner: function (td) {
        var numberSpinner = new dijitNumberSpinner({
          value: 12,
          smallDelta: 1,
          constraints: {
            min: 1,
            max: 36,
            places: 0
          },
          style: "width:100px"
        });
        numberSpinner.placeAt(td);
      },

      _getNumberSpinnerValue: function (td) {
        return dojoQuery('.dijitInputInner', td)[0].value;
      },

      _setNumberSpinnerValue: function (td, value) {
        dojoQuery('.dijitInputInner', td)[0].value = value;
      },

      setConfig: function (config) {

        var feedbacks = [{
            shape: this.nls.lineLabel
          },
          {
            shape: this.nls.circleLabel
          },
          {
            shape: this.nls.ellipseLabel
          },
          {
            shape: this.nls.ringsLabel
          }
        ];

        var configSettings = [{
          showTab: config.feedback.lineSymbol.showTab,
          color: config.feedback.lineSymbol.color,
          width: config.feedback.lineSymbol.width
        }, {
          showTab: config.feedback.circleSymbol.showTab,
          color: config.feedback.circleSymbol.outline.color,
          width: config.feedback.circleSymbol.outline.width
        }, {
          showTab: config.feedback.ellipseSymbol.showTab,
          color: config.feedback.ellipseSymbol.outline.color,
          width: config.feedback.ellipseSymbol.outline.width
        }, {
          showTab: config.feedback.rangeRingSymbol.showTab,
          color: config.feedback.rangeRingSymbol.color,
          width: config.feedback.rangeRingSymbol.width
        }, {
          color: config.feedback.labelSymbol.color,
          width: config.feedback.labelSymbol.font.size
        }];

        this._setFeedbackTable(feedbacks, configSettings);
        if (this.config.hasOwnProperty("operationalLineLayer") && this.config.operationalLineLayer.name !== "") {
          this._setSelectedOption(this.opLineLayerList, this.config.operationalLineLayer.name);
        } else {
          this.opLineLayerList.value = '';
        }

        if (this.config.hasOwnProperty("operationalPolygonLayer") && this.config.operationalPolygonLayer.name !== "") {
          this._setSelectedOption(this.opPolygonLayerList, this.config.operationalPolygonLayer.name);
        } else {
          this.opPolygonLayerList.value = '';
        }

        this.displayLabelTable.clear();

        this.displayLabelTable.addRow({
          feedbackLabel: this.nls.feedbackLabel,
          index: "0",
          textColor: configSettings[4].color,
          textSize: configSettings[4].width
        });

      },

      /**
       * Sets the selected option
       * in the drop-down list
       * @param {string} layerName
       */
      _setSelectedOption: function (selectNode, layerName) {
        for (var i = 0; i < selectNode.options.length; i++) {
          if (selectNode.options[i].value === layerName) {
            selectNode.selectedIndex = i;
            break;
          }
        }
      },

      /*
       **
       */
      _setFeedbackTable: function (feedbacks, configSettings) {
        this.displayFeedbackTable.clear();
        for (var i = 0; i < feedbacks.length; i++) {
          var rowData = {
            feedbackShape: feedbacks[i].shape,
            index: "" + i,
            showTab: configSettings[i].showTab,
            lineColor: configSettings[i].color,
            lineWidth: configSettings[i].width
          };
          this.displayFeedbackTable.addRow(rowData);
        }
      },

      getConfig: function () {

        var feedbackData = this.displayFeedbackTable.getData();
        var labelData = this.displayLabelTable.getData();

        var allTabsFalse = 0;

        dojoArray.forEach(feedbackData, function (tData) {
          if (tData.showTab) {
            allTabsFalse = allTabsFalse + 1;
          }
        });


        if (allTabsFalse !== 0) {
          this.config.feedback = {
            lineSymbol: {
              showTab: feedbackData[0].showTab,
              type: 'esriSLS',
              style: 'esriSLSSolid',
              color: feedbackData[0].lineColor,
              width: feedbackData[0].lineWidth
            },
            circleSymbol: {
              showTab: feedbackData[1].showTab,
              type: 'esriSFS',
              style: 'esriSFSNull',
              color: [255, 0, 0, 0],
              outline: {
                color: feedbackData[1].lineColor,
                width: feedbackData[1].lineWidth,
                type: 'esriSLS',
                style: 'esriSLSSolid'
              }
            },
            ellipseSymbol: {
              showTab: feedbackData[2].showTab,
              type: 'esriSFS',
              style: 'esriSFSNull',
              color: [255, 0, 0, 0],
              outline: {
                color: feedbackData[2].lineColor,
                width: feedbackData[2].lineWidth,
                type: 'esriSLS',
                style: 'esriSLSSolid'
              }
            },
            rangeRingSymbol: {
              showTab: feedbackData[3].showTab,
              type: 'esriSLS',
              style: 'esriSLSSolid',
              color: feedbackData[3].lineColor,
              width: feedbackData[3].lineWidth
            },
            labelSymbol: {
              'type': 'esriTS',
              'color': labelData[0].textColor,
              'verticalAlignment': 'middle',
              'horizontalAlignment': 'center',
              'xoffset': 0,
              'yoffset': 0,
              'kerning': true,
              'font': {
                'family': 'arial',
                'size': labelData[0].textSize,
                'style': 'normal',
                'weight': 'normal',
                'decoration': 'none'
              }
            }
          };
          this.config.operationalLineLayer = {
            name: this.opLineLayerList.value
          };
          this.config.operationalPolygonLayer = {
            name: this.opPolygonLayerList.value
          };
          return this.config;
        } else {
          new dijitMessage({
            message: this.nls.tabErrorMessage
          });
          return false;
        }
      },

      /**
       * This gets all the operational layers and places it in a custom data object.
       */
      _getAllMapLayers: function (geometryType) {
        var layerList = [];
        var layerStructure = LayerStructure.getInstance();
        //get all layers.
        layerStructure.traversal(function (layerNode) {
          //check to see if type exist and if it's not any tiles
          if (typeof (layerNode._layerInfo.layerObject.type) !== 'undefined') {
            if ((layerNode._layerInfo.layerObject.type).indexOf("tile") === -1) {
              if (layerNode._layerInfo.layerObject.geometryType === geometryType) {
                layerList.push(layerNode._layerInfo.layerObject);
              }
            }
          }
        });
        return layerList;
      },

      /**
       * Populates the drop down list of operational layers
       * from the webmap
       */
      _populateLayerSelect: function (layerList, selectNode) {
        //Add a blank option
        var blankOpt = document.createElement('option');
        blankOpt.value = "";
        blankOpt.innerHTML = "";
        blankOpt.selected = true;
        selectNode.appendChild(blankOpt);
        dojoArray.forEach(layerList, dojoLang.hitch(this, function (layer) {
          var opt = document.createElement('option');
          opt.value = layer.name;
          opt.id = layer.id;
          opt.innerHTML = jimuUtils.sanitizeHTML(layer.name);
          opt.selected = false;
          selectNode.appendChild(opt);
        }));
      }
    });
  });