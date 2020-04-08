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
  "dojo/Evented",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  'dijit/_WidgetsInTemplateMixin',
  "dojo/text!./projectSetting.html",
  "dojo/_base/lang",
  "dojo/on",
  "dojo/_base/array",
  "jimu/dijit/Message"
], function (
  declare,
  Evented,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin,
  projectSetting,
  lang,
  on,
  array,
  Message
) {
  return declare([_WidgetBase, Evented, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: projectSetting,
    baseClass: 'jimu-widget-NetworkTrace-setting',
    projectPolygonLayerOptions: [],
    projectPointLayerOptions: [],
    outputParametersOptions: [],

    startup: function () {
      this.inherited(arguments);
    },

    postCreate: function () {
      this._defaultSelectOption = {
        "value": "",
        "label": this.nls.projectSetting.selectLabel
      };
      this.outputParametersOptions = [lang.clone(this._defaultSelectOption)];
      this.projectPolygonLayerOptions = [lang.clone(this._defaultSelectOption)];
      this.projectPointLayerOptions = [lang.clone(this._defaultSelectOption)];
      this.layers = this.map.itemInfo.itemData.operationalLayers;
      if (this.layers.length > 0) {
        this._getLayerOptions(this.layers);
      }
      this.populateLayerOptions();
      this.populateOutParams();
      this.own(on(this.polygonLayerHelp, "click", lang.hitch(this, function () {
        this._showMessage(this.nls.projectSetting.polygonLayerHelp);
      })));
      this.own(on(this.outputParameterHelp, "click", lang.hitch(this, function () {
        this._showMessage(this.nls.projectSetting.outputParameterHelp);
      })));
      this.own(on(this.pointLayerHelp, "click", lang.hitch(this, function () {
        this._showMessage(this.nls.projectSetting.pointLayerHelp);
      })));
      this.setProjectSettings(this.config);
    },

    /**
     * Enables/Diables all the project settings dropdown
     * when hasPolygonOutputGeometry parameter in gpService
     * @param {boolean} hasPolygonOutputGeometry
     */
    enableDisableProjectSettings: function (hasPolygonOutputGeometry) {
      //when disabling dropdowns clear the values
      if (!hasPolygonOutputGeometry) {
        this.projetPolygonLayerSelect.set("value", "");
        this.projectPointLayerSelect.set("value", "");
        this.outputParameters.set("value", "");
      }
      this.projetPolygonLayerSelect.set("disabled", !hasPolygonOutputGeometry);
      this.projectPointLayerSelect.set("disabled", !hasPolygonOutputGeometry);
      this.outputParameters.set("disabled", !hasPolygonOutputGeometry);
    },

    /**
     * Returns the configured project settings
     */
    getProjectSettings: function () {
      var polygonLayerId = "",
        pointLayerId = "",
        outputParamName = "";
      if (this.projetPolygonLayerSelect) {
        polygonLayerId = this._getSelectedOptionValue(this.projetPolygonLayerSelect);
      }
      if (this.projectPointLayerSelect) {
        pointLayerId = this._getSelectedOptionValue(this.projectPointLayerSelect);
      }
      if (this.outputParameters) {
        outputParamName = this._getSelectedOptionValue(this.outputParameters);
      }
      return {
        "polygonLayerId": polygonLayerId,
        "pointLayerId": pointLayerId,
        "outputParamName": outputParamName
      };
    },

    /**
     * Sets configured values in the contorls
     */
    setProjectSettings: function (config) {
      if (config) {
        if (this.projetPolygonLayerSelect && config.polygonLayerId) {
          this.projetPolygonLayerSelect.set("value", config.polygonLayerId);
        }
        if (this.projectPointLayerSelect && config.pointLayerId) {
          this.projectPointLayerSelect.set("value", config.pointLayerId);
        }
        if (this.outputParameters && config.outputParamName) {
          this.outputParameters.set("value", config.outputParamName);
        }
      }
    },

    /**
     * Retruns selcted value of the dropdown
     */
    _getSelectedOptionValue: function (select) {
      var selectedValue = "";
      if (select && select.options && select.options.length > 1) {
        array.some(select.options, function (option) {
          if (option.selected) {
            selectedValue = option.value;
            return true;
          }
        });
      }
      return selectedValue;
    },

    /**
     * To show help message
     */
    _showMessage: function (msg) {
      var alertMessage = new Message({
        message: msg
      });
      alertMessage.message = msg;
    },

    /**
     * This function is to filter valid layers for dropdown
     */
    _getLayerOptions: function (layers) {
      var capabilities;
      array.forEach(layers, lang.hitch(this, function (layer) {
        if (layer && layer.layerObject &&
          layer.layerObject.capabilities) {
          capabilities = layer.layerObject.capabilities;
          if ((capabilities && capabilities.indexOf &&
              capabilities.indexOf("Create") > -1 &&
              capabilities.indexOf("Delete") &&
              capabilities.indexOf("Update") > -1) &&
            layer.layerObject.geometryType === "esriGeometryPolygon") {
            if (this._isValidProjectPolygonLayer(layer)) {
              // create options for project layer
              this.projectPolygonLayerOptions.push({
                "value": layer.id,
                "label": layer.title
              });
            }
          }
          if ((capabilities && capabilities.indexOf &&
              capabilities.indexOf("Create") > -1 &&
              capabilities.indexOf("Delete") &&
              capabilities.indexOf("Update") > -1) &&
            layer.layerObject.geometryType === "esriGeometryPoint") {
            if (this._isValidProjectPointLayer(layer)) {
              // create options for project layer
              this.projectPointLayerOptions.push({
                "value": layer.id,
                "label": layer.title
              });
            }
          }
        }
      }));
    },

    /**
     * Add options to point and polygon layer dropDowns
     */
    populateLayerOptions: function () {
      if (this.projectPolygonLayerOptions.length > 0) {
        this.projetPolygonLayerSelect.set("options", this.projectPolygonLayerOptions);
        this.projetPolygonLayerSelect.set("value",
          this.projetPolygonLayerSelect.options[0]);
      }
      if (this.projectPointLayerOptions.length > 0) {
        this.projectPointLayerSelect.set("options", this.projectPointLayerOptions);
        this.projectPointLayerSelect.set("value",
          this.projectPointLayerSelect.options[0]);
      }
    },

    /**
     * Filter polygon layer based on fieldname,fieldtype
     */
    _isValidProjectPolygonLayer: function (layer) {
      var layerFields, layerField, layerFieldName, layerFieldsArray, fieldType;
      layerFields = layer.layerObject.fields;
      layerFieldsArray = [];
      for (layerField in layerFields) {
        fieldType = layerFields[layerField].type;
        layerFieldName = layerFields[layerField].name.toLowerCase();
        //check for Name (String type field) GlobalID (GlobalID type field)
        if ((layerFieldName === "name" && fieldType === "esriFieldTypeString") ||
          fieldType === "esriFieldTypeGlobalID") {
          layerFieldsArray.push(layerFieldName);
        }
      }
      //check for Layer must have 2 fields with exact name and data type
      if (layerFieldsArray.length >= 2) {
        return true;
      }
      return false;
    },

    /**
     * Filters for point layer based on fieldname,fieldtype
     */
    _isValidProjectPointLayer: function (layer) {
      var layerFields, layerField, layerFieldName, layerFieldsArray, fieldType;
      layerFields = layer.layerObject.fields;
      layerFieldsArray = [];
      for (layerField in layerFields) {
        fieldType = layerFields[layerField].type;
        layerFieldName = layerFields[layerField].name.toLowerCase();
        //check for inputtype (String type field) & ProjectID (GUID type field)
        if ((layerFieldName === "inputtype" && fieldType === "esriFieldTypeString") ||
          (layerFieldName === "projectid" && fieldType === "esriFieldTypeGUID")) {
          layerFieldsArray.push(layerFieldName);
        }
      }
      //check for Layer must have 2 fields with exact name and data type
      if (layerFieldsArray.length === 2) {
        return true;
      }
      return false;
    },

    /**
     * Populates out params available in configured gpService
     */
    populateOutParams: function () {
      var outputParametersOptions = [lang.clone(this._defaultSelectOption)];
      array.forEach(this.outputParametersArray, lang.hitch(this, function (param) {
        if (param.defaultValue.geometryType === "esriGeometryPolygon" &&
          param.direction === "esriGPParameterDirectionOutput") {
          outputParametersOptions.push({
            "label": param.displayName,
            "value": param.name
          });
        }
      }));
      this.outputParameters.set("options", outputParametersOptions);
      this.outputParameters.set("value", this.outputParameters.options[0]);
    },

    projectSettingsChanged: function () {
      this.emit("settingsChanged", this.getProjectSettings());
    }
  });
});