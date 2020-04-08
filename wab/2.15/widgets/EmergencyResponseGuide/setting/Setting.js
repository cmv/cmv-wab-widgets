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
    'dojo/dom-construct',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/utils',
    'jimu/BaseWidgetSetting',
    'jimu/LayerStructure',
    './symbologySettings',
    'dijit/form/Select'
  ],
  function (
    declare, array, lang, domConstruct, _WidgetsInTemplateMixin,
    utils, BaseWidgetSetting, LayerStructure, symbologySettings) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-ERG-setting',
      _SettingsInstance: null, //Object to hold Settings instance
      _currentSettings: null, //Object to hold the current settings

      postMixInProperties: function () {
        this.nls = lang.mixin(this.nls, window.jimuNls.common, window.jimuNls.units);
      },

      postCreate: function () {
        this.inherited(arguments);
        this._populateLayerSelect(this._getAllMapLayers(), this.opLayerList);
      },

      startup: function () {
        this.inherited(arguments);
        if (!this.config.erg) {
          this.config.erg = {};
        }
        this._createSettings();
        if (this.config.erg.operationalLayer.name !== "") {
          this._setSelectedOption(this.opLayerList, this.config.erg.operationalLayer.name);
        } else {
          this.opLayerList.value = '';
        }
      },

      setConfig: function (config) {
        this.config = config;
      },

      getConfig: function () {
        if (!this._SettingsInstance.validInputs()) {
          return false;
        }

        this._SettingsInstance.onSettingsChanged();
        for (var key in this._currentSettings) {
          this.config.erg.symbology[key] = this._currentSettings[key];
        }

        this.config.erg.operationalLayer.name = this.opLayerList.value;

        return this.config;
      },

      destroy: function () {
        this.inherited(arguments);
      },

      /**
       * Creates settings
       **/
      _createSettings: function () {
        //Create Settings Instance
        this._SettingsInstance = new symbologySettings({
          nls: this.nls,
          config: this.config,
          appConfig: this.appConfig
        }, domConstruct.create("div", {}, this.SettingsNode));

        //add a listener for a change in settings
        this.own(this._SettingsInstance.on("settingsChanged",
          lang.hitch(this, function (updatedSettings) {
            this._currentSettings = updatedSettings;
          })
        ));
        this._SettingsInstance.startup();
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
        //Add a blank option
        var blankOpt = document.createElement('option');
        blankOpt.value = "";
        blankOpt.innerHTML = "";
        blankOpt.selected = true;
        selectNode.appendChild(blankOpt);
        //Add layers
        array.forEach(layerList, lang.hitch(this, function (layer) {
          var opt = document.createElement('option');
          opt.value = layer.name;
          opt.innerHTML = utils.sanitizeHTML(layer.name);
          opt.selected = false;
          selectNode.appendChild(opt);
        }));
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
      }
    });
  });