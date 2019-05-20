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
    "dojo/text!./ChooseFromLayer.html",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    "jimu/dijit/Popup",
    "dijit/form/Select",
    'jimu/dijit/LayerChooserFromMap',
    'jimu/dijit/LayerChooserFromMapWithDropbox',
    "dojo/Evented"
  ],
  function (
    declare,
    lang,
    array,
    on,
    template,
    _TemplatedMixin,
    BaseWidgetSetting,
    Popup,
    Select,
    LayerChooserFromMap,
    LayerChooserFromMapWithDropbox,
    Evented
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-chooseFromLayer",
      templateString: template,
      layerSelector: null,
      fieldSelect: null,
      domainFieldsDropdown: null,
      domainFieldValuesDropdown: null,
      ChooseFromLayerPopup: null,
      postCreate: function () {
        this.inherited(arguments);
        //Create dropdown for fields selection
        this.domainFieldsDropdown = new Select({
          "style": {
            "width": "100%"
          }
        });
        this.domainFieldsDropdown.placeAt(this.domainFieldsDropDownDiv);
        this.domainFieldsDropdown.startup();
        //Create dropdown for values of selected fields
        this.domainFieldValuesDropdown = new Select({
          "style": {
            "width": "100%"
          }
        });
        this.domainFieldValuesDropdown.placeAt(this.domainFieldValuesDropDownDiv);
        this.domainFieldValuesDropdown.startup();
        this._createPopUp();
      },

      /**
       * this function is used to create layerSelectors in popup
       */
      _addLayerSelectors: function () {
        var layerChooserFromMapArgs, layerChooserFromMap;
        //create layerChooser args
        layerChooserFromMapArgs = this._createLayerChooserMapArgs();
        layerChooserFromMap = new LayerChooserFromMap(layerChooserFromMapArgs);
        layerChooserFromMap.startup();

        this.layerSelector =
          new LayerChooserFromMapWithDropbox({
            layerChooser: layerChooserFromMap
          });
        this.layerSelector.placeAt(this.layerSelectorDiv);
        this.layerSelector.startup();
        if (this.layerSelector.layerChooser.getAllItems().length > 0) {
          this.layerSelector.setSelectedLayer(this.layerSelector.setSelectedLayer(this.layerSelector.layerChooser.getAllItems()[0].layerInfo.layerObject));
        }
        this._addLayerFieldsOptions();
        this._addLayerFieldsValueDropdown();

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
        var types, featureLayerFilter, imageServiceLayerFilter, filters, combinedFilter,
          domainFieldfilter;
        types = ['point', 'polyline', 'polygon'];
        featureLayerFilter = LayerChooserFromMap.createFeaturelayerFilter(types, false, false);
        imageServiceLayerFilter = LayerChooserFromMap.createImageServiceLayerFilter(true);
        filters = [featureLayerFilter, imageServiceLayerFilter];
        combinedFilter = LayerChooserFromMap.orCombineFilters(filters);
        //Filter layers based on fieldType of the source field
        domainFieldfilter = this._createDomainFieldFilter();
        //combine both the filters
        return LayerChooserFromMap.andCombineFilters([combinedFilter, domainFieldfilter]);
      },

      /**
       * this function is used filter layers based on domain fields
       */
      _createDomainFieldFilter: function () {
        return function (layerInfo) {
          var defLayerObject = layerInfo.getLayerObject();
          var hasValidField = false;
          defLayerObject.then(function (layerObject) {
            array.some(layerObject.fields, function (field) {
              if (field.domain && field.domain.type === "codedValue") {
                this._domainFields = field;
                hasValidField = true;
                return true;
              }
            });
          });
          return hasValidField;
        };
      },

      /**
       * This function is used to set options of domainFieldsDropdown
       */
      _addLayerFieldsOptions: function () {
        this.domainFieldsDropdown.set("options", this._createFieldsDropDownOpt());
        this.domainFieldsDropdown.set("value", this.domainFieldsDropdown.options[0]);
        //Event handler for domainFieldsDropdown
        this.own(on(this.domainFieldsDropdown, "change", lang.hitch(this, function () {
          this._addLayerFieldsValueDropdown();
        })));
      },

      /**
       * This function is used to set options of domainFieldValuesDropdown
       */
      _addLayerFieldsValueDropdown: function () {
        this.domainFieldValuesDropdown.set("options", this._createFieldValueDropDownOpt());
        this.domainFieldValuesDropdown.set("value", this.domainFieldValuesDropdown.options[0]);
        //Event handler for domainFieldValuesDropdown
        this.own(on(this.domainFieldValuesDropdown, "change", lang.hitch(this, function () {

        })));
      },

      /**
       * This function used to create options of domainFieldsDropdown
       */
      _createFieldsDropDownOpt: function () {
        var selectedLayer, validFieldSet, options;
        options = [];
        validFieldSet = [];
        if (this.layerSelector.getSelectedItem()) {
          selectedLayer = this.layerSelector.getSelectedItem().layerInfo.layerObject;
          array.forEach(selectedLayer.fields, lang.hitch(this, function (currentField) {
            //Filter fields based on type
            if (currentField.domain && currentField.domain.type === "codedValue") {
              options.push({
                "label": currentField.alias || currentField.name,
                "value": currentField.name
              });
            }
          }));
        }
        return options;
      },

      /**
       * This function used to create options of domainFieldsDropdown
       */
      _createFieldValueDropDownOpt: function () {
        var selectedField, codedvalue, selectedLayer, selectedFieldCodeValues, options = [];
        if (this.layerSelector.getSelectedItem()) {
          selectedField = this.domainFieldsDropdown.getValue();
          selectedLayer = this.layerSelector.getSelectedItem().layerInfo.layerObject;
          if (selectedLayer.getDomain(selectedField).type === "codedValue") {
            selectedFieldCodeValues = selectedLayer.getDomain(selectedField).codedValues;
            for (codedvalue in selectedFieldCodeValues) {
              options.push({
                "label": selectedFieldCodeValues[codedvalue].name,
                "value": selectedFieldCodeValues[codedvalue].code
              });
            }
          }
        }
        return options;
      },

      /**
       * Creat ChooseFromLayerPopup
       */
      _createPopUp: function () {
        this._addLayerSelectors();
        this.ChooseFromLayerPopup = new Popup({
          "titleLabel": this.nls.chooseFromLayer.selectValueLabel,
          "width": 500,
          "maxHeight": 300,
          "autoHeight": true,
          "class": this.baseClass,
          "content": this,
          "buttons": [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              this._getDomainFieldValue();
              this.ChooseFromLayerPopup.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {

              this.ChooseFromLayerPopup.close();
            })
          }]
        });
        //Event handler for layerSelector
        this.own(on(this.layerSelector, "selection-change", lang.hitch(this, function () {
          this._addLayerFieldsOptions();
        })));
      },

      /**
       * This function is used to emit event to update
       * preset value of preset value  textbox in preset popup
       */
      _getDomainFieldValue: function () {
        this.emit("updatePresetValue", this.domainFieldValuesDropdown.value);
      }
    });
  });