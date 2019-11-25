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
    'dojo/query',
    'dojo/dom-construct',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/registry',
    'jimu/BaseWidgetSetting',
    './symbologySettings',
    'jimu/LayerStructure',
    'jimu/utils'
  ],
  function (
    declare,
    array,
    lang,
    query,
    domConstruct,
    _WidgetsInTemplateMixin,
    registry,
    BaseWidgetSetting,
    symbologySettings,
    LayerStructure,
    jimuUtils
  ) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-threatAnalysis-setting',
      _SettingsInstance: null, //Object to hold Settings instance
      _currentSettings: null, //Object to hold the current settings
      _shakingElements: [], //List of DOM elements that have invalid values

      postMixInProperties: function () {
        this.nls = lang.mixin(this.nls, window.jimuNls.common, window.jimuNls.units);
      },

      postCreate: function () {
        this.inherited(arguments);
        this._populateLayerSelect(this._getAllMapLayers(), this.opLayerList);
      },

      startup: function () {
        this.inherited(arguments);
        if (!this.config.threatAnalysis) {
          this.config.threatAnalysis = {};
        }
        this._createSettings();
        if (this.config.threatAnalysis.operationalLayer.name !== "") {
          this._setSelectedOption(this.opLayerList, this.config.threatAnalysis.operationalLayer.name);
        } else {
          this.opLayerList.value = '';
        }

        if (this.config.threatAnalysis.unit !== "") {
          this._setSelectedOption(this.unitType, this.config.threatAnalysis.unit);
        } else {
          this.unitType.value = '';
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
          this.config.threatAnalysis.symbology[key] = this._currentSettings[key];
        }
        this.config.threatAnalysis.operationalLayer.name = this.opLayerList.value;
        this.config.threatAnalysis.unit = this.unitType.value;

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

      _checkValidValues: function () {
        var nl = query(".dijitSpinner.dijitNumberTextBox.dijitValidationTextBox", this._SettingsInstance.domNode);
        return array.every(nl, function (node) {
          var n = registry.byNode(node);
          if (n) {
            if (n.value >= n.constraints.min && n.value <= n.constraints.max) {
              return true;
            }
            lang.hitch(this, this._shake(node, 16));
            return false;
          }
        }, this);
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
        array.forEach(layerList, lang.hitch(this, function (layer) {
          var opt = document.createElement('option');
          opt.value = layer.name;
          opt.innerHTML = jimuUtils.sanitizeHTML(layer.name);
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
      },

      //Source: https://stackoverflow.com/questions/36962903/javascript-shake-html-element
      _shake: function (element, magnitude) {

        //A counter to count the number of shakes
        var counter = 1;

        //The total number of shakes (there will be 1 shake per frame)
        var numberOfShakes = 15;

        //Capture the element's position and angle so you can
        //restore them after the shaking has finished
        var startX = 0,
          startY = 0;

        // Divide the magnitude into 10 units so that you can
        // reduce the amount of shake by 10 percent each frame
        var magnitudeUnit = magnitude / numberOfShakes;

        //The `randomInt` helper function
        var randomInt = function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        //Add the element to the `shakingElements` array if it
        //isn't already there
        if (this._shakingElements.indexOf(element) === -1) {
          //console.log("added")
          this._shakingElements.push(element);

          //Add an `updateShake` method to the element.
          //The `updateShake` method will be called each frame
          //in the game loop. The shake effect type can be either
          //up and down (x/y shaking) or angular (rotational shaking).
          var self = this;
          _upAndDownShake();
        }

        function _upAndDownShake() {
          //Shake the element while the `counter` is less than
          //the `numberOfShakes`
          if (counter < numberOfShakes) {
            //Reset the element's position at the start of each shake
            element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';
            //Reduce the magnitude
            magnitude -= magnitudeUnit;
            //Randomly change the element's position
            var randomX = randomInt(-magnitude, magnitude);
            var randomY = randomInt(-magnitude, magnitude);
            element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';
            //Add 1 to the counter
            counter += 1;
            requestAnimationFrame(_upAndDownShake);
          }
          //When the shaking is finished, restore the element to its original
          //position and remove it from the `shakingElements` array
          if (counter >= numberOfShakes) {
            element.style.transform = 'translate(' + startX + ', ' + startY + ')';
            self._shakingElements.splice(self._shakingElements.indexOf(element), 1);
          }
        }
      }
    });
  });