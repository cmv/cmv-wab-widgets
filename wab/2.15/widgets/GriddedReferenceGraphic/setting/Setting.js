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
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/on',
    '../js/ColorPickerEditor',
    '../js/FontSetting',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/LayerStructure',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/TabContainer',
    'jimu/dijit/LoadingShelter',
    'jimu/dijit/CheckBox'
  ],
  function (declare, array, lang, on, ColorPickerEditor, FontSetting, _WidgetsInTemplateMixin, LayerStructure,
    BaseWidgetSetting, TabContainer, LoadingShelter) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-grg-setting',
      _defaultCellOutlineColor: "#1a299c",
      _defaultCellFillColor: "#ffffff",

      postMixInProperties: function () {
        this.nls = lang.mixin(this.nls, window.jimuNls.common);
      },
      postCreate: function () {
        //LoadingShelter
        this.shelter = new LoadingShelter({
          hidden: true
        });
        this.shelter.placeAt(this.domNode);
        this.shelter.startup();

        this.tab = new TabContainer({
          tabs: [{
            title: this.nls.gridTabLabel,
            content: this.gridTab
          }, {
            title: this.nls.labelTabLabel,
            content: this.labelTab
          }, {
            title: this.nls.referenceSystemTabLabel,
            content: this.referenceSystemTab
          }],
          selected: this.nls.gridTabLabel
        });
        this.tab.placeAt(this.tabsContainer);
        this.tab.startup();
        this.inherited(arguments);

        //Handle change event of draw extent icon
        this.own(on(this.cellShapeDropDown, 'change', lang.hitch(this, function () {
          if (this.cellShapeDropDown.get('value') === 'hexagon') {
            this.labelDirectionDropDown.set('disabled', true);
            this.labelDirectionDropDown.setValue('horizontal');
          } else {
            this.labelDirectionDropDown.set('disabled', false);
          }
        })));

        this._populateLayerSelect(this._getAllMapLayers(), this.opLayerList);
      },

      initGridTab: function () {
        this.cellOutlineColorPicker = new ColorPickerEditor({
          nls: this.nls
        }, this.cellOutlineColorPickerEditor);
        this.cellOutlineColorPicker.startup();

        this.cellFillColorPicker = new ColorPickerEditor({
          nls: this.nls
        }, this.cellFillColorPickerEditor);
        this.cellFillColorPicker.startup();
      },

      initLabelTab: function () {
        this.fontSetting = new FontSetting({
          config: this.config.grg.font,
          nls: this.nls
        }, this.fontSettingNode);
        this.fontSetting.startup();
      },

      initReferenceSystemTab: function () {

      },

      startup: function () {
        this.inherited(arguments);
        this.shelter.show();
        if (!this.config.grg) {
          this.config.grg = {};
        }
        this.initGridTab();
        this.initLabelTab();
        this.initReferenceSystemTab();
        this.setConfig(this.config);

        if (this.config.grg.operationalLayer.name !== "") {
          this._setSelectedOption(this.opLayerList, this.config.grg.operationalLayer.name);
        } else {
          this.opLayerList.setValue("");
        }
      },

      setConfig: function (config) {

        this.config = config;

        this.cellOutlineColorPicker.setValues({
          "color": config.grg.cellOutline.color,
          "transparency": config.grg.cellOutline.transparency
        });

        this.cellFillColorPicker.setValues({
          "color": config.grg.cellFill.color,
          "transparency": config.grg.cellFill.transparency
        });

        this.cellShapeDropDown.setValue(this.config.grg.cellShape);

        this.cellUnitsDropDown.setValue(this.config.grg.cellUnits);

        this.gridOriginDropDown.setValue(this.config.grg.gridOrigin);

        this.fontSetting.config = this.config.grg.font;

        this.labelTypeDropDown.setValue(this.config.grg.labelType);

        this.labelDirectionDropDown.setValue(this.config.grg.labelDirection);

        this.labelOriginDropDown.setValue(this.config.grg.labelOrigin);

        this.referenceSystemDropDown.setValue(this.config.grg.referenceSystem);

        this.lockSettings.set("checked", this.config.grg.lockSettings);

        this.opLayerList.setValue(this.config.grg.operationalLayer.name);

        this.shelter.hide();
      },

      getConfig: function () {

        var cellOutlineColor = this.cellOutlineColorPicker.getValues();
        if (cellOutlineColor) {
          this.config.grg.cellOutline.color = cellOutlineColor.color;
          this.config.grg.cellOutline.transparency = cellOutlineColor.transparency;
        }

        var cellFillColor = this.cellFillColorPicker.getValues();
        if (cellFillColor) {
          this.config.grg.cellFill.color = cellFillColor.color;
          this.config.grg.cellFill.transparency = cellFillColor.transparency;
        }

        this.config.grg.cellShape = this.cellShapeDropDown.getValue();

        this.config.grg.cellUnits = this.cellUnitsDropDown.getValue();

        this.config.grg.gridOrigin = this.gridOriginDropDown.getValue();

        this.config.grg.font = this.fontSetting.config;

        this.config.grg.labelType = this.labelTypeDropDown.getValue();

        this.config.grg.labelDirection = this.labelDirectionDropDown.getValue();

        this.config.grg.labelOrigin = this.labelOriginDropDown.getValue();

        this.config.grg.referenceSystem = this.referenceSystemDropDown.getValue();

        this.config.grg.lockSettings = this.lockSettings.checked;

        this.config.grg.operationalLayer.name = this.opLayerList.getValue();

        return this.config;
      },

      destroy: function () {
        this.inherited(arguments);
      },

      /**
       * This gets all the operational layers and places it in a custom data object.
       */
      _getAllMapLayers: function () {
        var layerList = [];
        var layerStructure = LayerStructure.getInstance();
        //get all layers.
        layerStructure.traversal(function (layerNode) {
          //check to see if type exist and if it's not any tiles
          if (typeof (layerNode._layerInfo.layerObject.type) !== 'undefined') {
            if ((layerNode._layerInfo.layerObject.type).indexOf("tile") === -1) {
              if (layerNode._layerInfo.layerObject.geometryType === "esriGeometryPolygon") {
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
        // Add empty option
        selectNode.addOption({
          value: "",
          label: "-",
          selected: true
        });
        // Add layers
        array.forEach(layerList, lang.hitch(this, function (layer) {
          if (layer.type === "Feature Layer" && layer.url !== null) {
            selectNode.addOption({
              value: layer.name,
              label: layer.name,
              selected: false
            });
          }
        }));
      },

      /**
       * Sets the selected option in the drop-down list
       * @param {*} selectNode
       * @param {*} layerName
       */
      _setSelectedOption: function (selectNode, layerName) {
        selectNode.attr('value', layerName);
      }

    });
  });