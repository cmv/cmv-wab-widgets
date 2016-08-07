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
  'dojo/_base/declare',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidgetSetting',
  "dojo/_base/array",
  "dojo/dom-class",
  "dojo/html",
  "dojo/_base/lang",
  "dojo/on",
  'dijit/form/CheckBox',
  "dijit/form/Select",
  "dojox/form/CheckedMultiSelect",
  "dijit/form/NumberTextBox"
],
        function(
                declare,
                _WidgetsInTemplateMixin,
                BaseWidgetSetting,
                array,
                domClass,
                html,
                lang) {

          return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
            //these two properties is defined in the BaseWidget
            baseClass: 'jimu-widget-ObliqueViewer-setting',
            _layerFieldMap: {},
            _hasSupportedLayer: false,
            startup: function() {
              this.inherited(arguments);
              if (!this.config.ObliqueViewer) {
                this.config.ObliqueViewer = {};
              }
              this._populateLayers();
              if (this._hasSupportedLayer) {
                this._populateFields();
              }
              if (this.rasterInfoFieldsSelect) {
                this.own(this.rasterInfoFieldsSelect.on("click", lang.hitch(this, this._multiSelectClick)));
              }
              this.setConfig(this.config);
            },
            _multiSelectClick: function() {
              var values = this.rasterInfoFieldsSelect.get("value");
              if (values.length > 3) {
                this.rasterInfoFieldsSelect.set("value", values.slice(0, 3));
              }
            },

            _checkForImageServiceLayers: function() {

            },

            _populateLayers: function() {
              var operLayers = this.map.itemInfo.itemData.operationalLayers,
                      match = 0;

              array.forEach(operLayers, function(layer) {
                if (layer) {
                  if (layer.layerObject && this._isImageServiceLayer(layer.layerObject)) {
                    match++;
                    this.mapLayerSelect.addOption({
                      value: layer.title,
                      label: layer.title
                    });

                    this._layerFieldMap[layer.title] = [];
                    this._layerFieldMap[layer.title] = layer.layerObject.fields;
                  }
                }
              }, this);

              this.mapLayerSelect.on("change", lang.hitch(this, this._populateFields));

              if (match === 0) {
                domClass.add(this.searchesSection, "settingsHidden");
                html.set(this.errorSection, this.nls.errorSectionMeasage);
                this._hasSupportedLayer = false;
              } else {
                domClass.remove(this.searchesSection, "settingsHidden");
                html.set(this.errorSection, "");
                this._hasSupportedLayer = true;
              }
            },
            _isImageServiceLayer: function(layer) {
              return layer.declaredClass === "esri.layers.ArcGISImageServiceLayer" ||
                layer.declaredClass === "esri.layers.ArcGISImageServiceVectorLayer";
            },
            _populateFields: function() {
              var config = this.config.ObliqueViewer;
              var rasterInfoFields = (config.rasterInfoFields && config.rasterInfoFields.length) ?
                config.rasterInfoFields : this._getDefaultFields(),
                elevationField = config.elevationField ? config.elevationField.toLowerCase() : "elevation",
                azimuthField = config.azimuthField ? config.azimuthField.toLowerCase() : "azimuth";

              this._clearFields(this.elevationFieldSelect);
              this._clearFields(this.azimuthFieldSelect);
              this._clearFields(this.rasterInfoFieldsSelect);
              this._addFields(this.elevationFieldSelect, elevationField);
              this._addFields(this.azimuthFieldSelect, azimuthField);
              this._addFields(this.rasterInfoFieldsSelect);
              this.rasterInfoFieldsSelect.set("value", rasterInfoFields);
            },
            _clearFields: function(obj) {
              var options = obj.getOptions();

              array.forEach(options, function(option) {
                obj.removeOption(option);
              }, this);
            },
            _addFields: function(obj, searchTerm) {
              var fields = this._layerFieldMap[this.mapLayerSelect.get("value")],
                      selectedField;

              array.forEach(fields, function(field) {
                if (searchTerm) {
                  if ((field.name.toLowerCase()).indexOf(searchTerm) > -1) {
                    selectedField = field.name;
                  }
                }
                if (field.type !== "esriFieldTypeGeometry") {
                  obj.addOption({
                    value: field.name,
                    label: field.alias || field.name
                  });
                }
              }, this);
              if (searchTerm) {
                obj.set("value", selectedField);
              }
            },
            _getDefaultFields: function() {
              var i,
                      allFields = this._layerFieldMap[this.mapLayerSelect.get("value")],
                      defaultFields = [];

              if (!allFields || !allFields.length) {
                domClass.add(this.searchesSection, "settingsHidden");
                html.set(this.errorSection, this.nls.errorSectionMeasage);
                return console.log("No fields found.");
              }

              for (i = 0; i < 3; i++) {
                defaultFields.push(allFields[i].alias);
              }

              return defaultFields;
            },
            setConfig: function(config) {
              this.config = config;
              this.thumbnailCheckbox.set("checked", this.config.ObliqueViewer.showThumbnail);
              this.autoSyncCheckbox.set("checked", this.config.ObliqueViewer.autoSync);
              if (this.config.ObliqueViewer.layerTitle) {
                this.mapLayerSelect.set("value", this.config.ObliqueViewer.layerTitle);
              }
              if (this.config.ObliqueViewer.elevationField) {
                this.elevationFieldSelect.set("value", this.config.ObliqueViewer.elevationField);
              }
              if (this.config.ObliqueViewer.azimuthField) {
                this.azimuthFieldSelect.set("value", this.config.ObliqueViewer.azimuthField);
              }
              if (this.config.ObliqueViewer.rasterInfoFields.length > 0) {
                this.rasterInfoFieldsSelect.set("value", this.config.ObliqueViewer.rasterInfoFields);
              } else {
                this.rasterInfoFieldsSelect.set("value", this._getDefaultFields());
              }
            },
            getConfig: function() {
              this.config.ObliqueViewer.autoSync = this.autoSyncCheckbox.checked;
              this.config.ObliqueViewer.showThumbnail = this.thumbnailCheckbox.checked;
              this.config.ObliqueViewer.layerTitle = this.mapLayerSelect.get("value");
              this.config.ObliqueViewer.elevationField = this.elevationFieldSelect.get("value");
              this.config.ObliqueViewer.azimuthField = this.azimuthFieldSelect.get("value");
              this.config.ObliqueViewer.rasterInfoFields = this.rasterInfoFieldsSelect.get("value");
              return this.config;
            }

          });
        });