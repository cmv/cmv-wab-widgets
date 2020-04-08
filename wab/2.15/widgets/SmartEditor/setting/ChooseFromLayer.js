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
  ['dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/on',
    'dojo/text!./ChooseFromLayer.html',
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/Popup',
    'dijit/form/Select',
    'jimu/dijit/LayerChooserFromMap',
    'jimu/dijit/LayerChooserFromMapWithDropbox',
    'jimu/dijit/_filter/ValueProviderFactory',
    'dojo/Evented'
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
    ValueProviderFactory,
    Evented
  ) {
    return declare([BaseWidgetSetting, Evented, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-chooseFromLayer",
      templateString: template,
      layerSelector: null,
      fieldsDropdown: null,
      chooseFromLayerPopup: null,
      valueProviderFactory: null,
      valueProvider: null,

      postCreate: function () {
        this.inherited(arguments);
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
        var types, featureLayerFilter, imageServiceLayerFilter, filters, combinedFilter;
        types = ['point', 'polyline', 'polygon'];
        featureLayerFilter = LayerChooserFromMap.createFeaturelayerFilter(types, false, false);
        imageServiceLayerFilter = LayerChooserFromMap.createImageServiceLayerFilter(true);
        filters = [featureLayerFilter, imageServiceLayerFilter];
        combinedFilter = LayerChooserFromMap.orCombineFilters(filters);
        return combinedFilter;
      },

      /**
       * This function is used to set options of fieldsDropdown
       */
      _addLayerFieldsOptions: function () {
        //reset prev objects of FieldSelector, valueProviderFactory and valueProvider
        if (this.fieldsDropdown) {
          this.fieldsDropdown.destroy();
        }
        if (this.valueProviderFactory) {
          this.valueProviderFactory = null;
        }
        if (this.valueProvider) {
          this.valueProvider.destroy();
        }
        //Create dropdown for fields selection
        this.fieldsDropdown = new Select({
          "style": {
            "width": "100%"
          }
        });
        this.fieldsDropdown.placeAt(this.fieldsDropdownDiv);
        this.fieldsDropdown.startup();
        this.fieldsDropdown.set("options", this._createFieldsDropDownOpt());
        if (this.fieldsDropdown.options && this.fieldsDropdown.options.length > 0) {
          this.fieldsDropdown.set("value", this.fieldsDropdown.options[0]);
        }
        //Event handler for fieldsDropdown
        this.own(on(this.fieldsDropdown, "change", lang.hitch(this, function () {
          this._createValueProvider();
        })));
      },

      /**
       * This function used to create options of fieldsDropdown
       */
      _createFieldsDropDownOpt: function () {
        var selectedLayer, validFieldSet, options;
        options = [];
        validFieldSet = [];
        if (this.layerSelector.getSelectedItem()) {
          selectedLayer = this.layerSelector.getSelectedItem().layerInfo.layerObject;
          array.forEach(selectedLayer.fields, lang.hitch(this, function (currentField) {
            //Filter fields based on type
            if (this.dataType === "esriFieldTypeString" ||
              (this.dataType === "esriFieldTypeGUID" &&
                (currentField.type === this.dataType ||
                  currentField.type === "esriFieldTypeGlobalID")) ||
              (this.dataType === "esriFieldTypeInteger" &&
                (currentField.type === "esriFieldTypeSmallInteger" || currentField.type === "esriFieldTypeInteger" ||
                  currentField.type === "esriFieldTypeDouble" || currentField.type === "esriFieldTypeSingle" ||
                  currentField.type === "esriFieldTypeOID"))) {
              options.push({
                "label": currentField.alias || currentField.name,
                "value": currentField.name
              });
            }
          }));
        }
        return options;
      },

      _createValueProvider: function () {
        var item;
        if (this.layerSelector) {
          item = this.layerSelector.getSelectedItem();
        }
        //return if not valid layer
        if(!item || !item.layerInfo || !item.layerInfo.layerObject){
          return;
        }
        //get selected layer
        var layerInfo = item.layerInfo;
        var selectedLayer = layerInfo.layerObject;

        //reset prev objects of valueProviderFactory and valueProvider
        if (this.valueProviderFactory) {
          this.valueProviderFactory = null;
        }
        if(this.valueProvider){
          this.valueProvider.destroy();
        }
        //create value provider factory instance
        this.valueProviderFactory = new ValueProviderFactory({
          url: selectedLayer.url,
          layerDefinition: selectedLayer,
          featureLayerId: layerInfo.id
        });
        //get selected field and its info
        var selectedFieldInfo, selectedField;
        selectedField = this.fieldsDropdown.getValue();
        //get field info of the selected field
        array.some(selectedLayer.fields, lang.hitch(this, function (currentField) {
          if (currentField.name === selectedField) {
            selectedFieldInfo = currentField;
            return true;
          }
        }));
        //return if not valid field/feildInfo
        if (!selectedField || !selectedFieldInfo) {
          return;
        }
        //set short type and operator for parts object
        var shortType, operator;
        switch (selectedFieldInfo.type) {
          case "esriFieldTypeString":
            shortType = "string";
            operator = "stringOperatorIs";
            break;
          case "esriFieldTypeDate":
            shortType = "date";
            operator = "dateOperatorIs";
            break;
          default:
            shortType = "number";
            operator = "numberOperatorIs";
            break;
        }

        //create fieldinfo for parts object
        var fieldInfo = {
          name: selectedField,
          label: selectedField,
          dateFormat: '',
          shortType: shortType,
          type: selectedFieldInfo.type
        };

        var partObj = {
          fieldObj: fieldInfo,
          operator: operator,
          interactiveObj:'',
          caseSensitive: false,
          valueObj: {
            type: "unique"
          }
        };
        //get value provider and show in UI
        this.valueProvider = this.valueProviderFactory.getValueProvider(partObj, false);
        if (this.valueProvider) {
          this.valueProvider.placeAt(this.valueProviderContainer);
          this.valueProvider.setValueObject(partObj.valueObj);
        }
      },

      /**
       * Creat chooseFromLayerPopup
       */
      _createPopUp: function () {
        this._addLayerSelectors();
        this.chooseFromLayerPopup = new Popup({
          "titleLabel": this.nls.chooseFromLayer.selectValueLabel,
          "width": 500,
          "maxHeight": 300,
          "autoHeight": true,
          "class": this.baseClass,
          "content": this,
          "buttons": [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              this._getSelectedFieldValue();
              this.chooseFromLayerPopup.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              this.chooseFromLayerPopup.close();
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
      _getSelectedFieldValue: function () {
        var selectedValue;
        //get the value form value provider
        if (this.valueProvider && this.valueProvider.checkedNameDiv) {
          selectedValue = this.valueProvider.checkedNameDiv.innerHTML;
          //if the value is empty show selected value as empty
          if (selectedValue && selectedValue === "- empty -") {
            selectedValue = "";
          }
          //emit the selected value
          this.emit("updatePresetValue", selectedValue);
        }
      }
    });
  });