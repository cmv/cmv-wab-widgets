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
    'dojo/number',
    'dojo/dom-construct',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/registry',
    'jimu/BaseWidgetSetting',
    './symbologySettings',
    'jimu/LayerStructure',
    'jimu/utils',
    'dojo/on',
    'jimu/dijit/TabContainer3',
    'dojo/text!../models/ThreatTypes.json',
    'jimu/dijit/SimpleTable',
    './newThreatType'
  ],
  function (
    declare,
    array,
    lang,
    query,
    dojoNumber,
    domConstruct,
    _WidgetsInTemplateMixin,
    registry,
    BaseWidgetSetting,
    symbologySettings,
    LayerStructure,
    jimuUtils,
    on,
    TabContainer3,
    threats,
    Table,
    ThreatType
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
        //modify String's prototype so we can format a string using .format
        if (!String.prototype.format) {
          String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
              return typeof args[number] !== 'undefined' ? args[number] : match;
            });
          };
        }

        this.inherited(arguments);
        //Retrieve threat types
        this._threatData = JSON.parse(threats);
        this._handleClickEvents();
        this._populateLayerSelect(this._getAllMapLayers(), this.opLayerList);
      },

      startup: function () {
        this.inherited(arguments);
        if (!this.config.threatAnalysis) {
          this.config.threatAnalysis = {};
        }
        this._initTabs();
        this._initThreatTypeTable();
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
        this.setConfig(this.config);
      },

      setConfig: function (config) {
        var threatData, unitType;
        this.config = config;

        //populate configured values in threat types table
        if (this.config.hasOwnProperty("threatTypes")) {
          threatData = this.config.threatTypes;
        } else {
          //populate default values in threat types table
          threatData = this._threatData;
        }
        this._ThreatTypeTable.clear();
        for (var i = 0; i < threatData.length; i++) {
          var threatInfos = threatData[i];
          this._populateThreatTableRow(threatInfos);
          if (!unitType) {
            unitType = threatInfos.Unit;
          }
        }
        this.unitMeasureLabel.innerHTML = this.nls.unitMeasureLabel.format(unitType === "meters" ? this.nls.meters :
          this.nls.feet);
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

        this.config.threatTypes = this._getConfiguredThreats();

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
       * Return NLS label representation of threat type
       */
      _getThreatTypeNls: function (threatTypeName) {
        var self = this;

        var threatTypeLabels = {
          "Pipe Bomb": "pipeBombLabel",
          "Suicide Bomb": "suicideBombLabel",
          "Briefcase": "briefcaseLabel",
          "Car": "carLabel",
          "SUV/VAN": "suvVanLabel",
          "Small Delivery Truck": "smallDeliveryTruckLabel",
          "Container/Water Truck": "containerWaterTruckLabel",
          "Semi-Trailer": "semiTrailerLabel"
        };

        var getThreatTypeLabel = function (threatName) {
          if (threatTypeLabels[threatName] !== undefined) {
            return self.nls[threatTypeLabels[threatName]];
          }
          return threatName;
        };

        return getThreatTypeLabel(threatTypeName);
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
      },

      _initTabs: function () {
        var threatTypeTab, symbologyTab, MiscTab, tabs;
        threatTypeTab = {
          title: this.nls.threatTypeLabel,
          content: this.threatTypeTab
        };
        symbologyTab = {
          title: this.nls.symbologyLabel,
          content: this.symbologyTab
        };
        MiscTab = {
          title: this.nls.generalLabel,
          content: this.MiscTab
        };
        tabs = [threatTypeTab, symbologyTab, MiscTab];
        this.tab = new TabContainer3({
          "tabs": tabs,
          "class": "esriCTFullHeight"
        });
        // Handle tabChanged event and set the scroll position to top
        this.own(on(this.tab, "tabChanged", lang.hitch(this, function () {
          this.tab.containerNode.scrollTop = 0;
        })));
        this.tab.placeAt(this.tabDiv);
      },

      _initThreatTypeTable: function () {
        var fields = [{
            name: 'threatType',
            title: this.nls.threatTypeColLabel,
            type: 'text',
            width: "30%"
          },
          {
            name: 'mandatoryDistance',
            title: this.nls.mandatoryDistance,
            type: 'text',
            width: "30%"
          },
          {
            name: 'safeDistance',
            title: this.nls.safeDistance,
            type: 'text',
            width: "30%"
          },
          {
            name: 'actions',
            title: this.nls.actions,
            type: 'actions',
            'class': 'actions',
            actions: ['edit', 'delete', 'up', 'down'],
            width: "10%"
          }
        ];
        var args = {
          fields: fields,
          selectable: false
        };
        this._ThreatTypeTable = new Table(args);
        this._ThreatTypeTable.placeAt(this.threatTypesTableNode);
        this._ThreatTypeTable.startup();
        this.own(on(this._ThreatTypeTable,
          'actions-edit',
          lang.hitch(this, this._onEditThreatInfoClick)));
      },

      /**
       * Handle click events for different controls
       **/
      _handleClickEvents: function () {
        this.own(on(this.addThreatTypeButton, "click", lang.hitch(this, function () {
          this._createNewThreatTypePopup(true);
        })));

        this.own(on(this.unitType, "change", lang.hitch(this, function () {
          this._convertValues(this.unitType.value === "meters");
        })));
      },

      /**
       * This function is used to create new threat popup
       */
      _createNewThreatTypePopup: function (isAddThreat, table, tr, rowData) {
        this.newThreatTypeObj = new ThreatType({
          threatTypeTable: table,
          currentRow: tr,
          currentRowData: rowData,
          isAddThreat: isAddThreat,
          nls: this.nls,
          selectedUnitType: this.unitType.value,
          existingThreatNames: this._getExistingThreatTypes()
        });
        this.newThreatTypeObj.startup();
        on(this.newThreatTypeObj, "addNewThreat", lang.hitch(this, function (newThreatInfo) {
          this._populateThreatTableRow(newThreatInfo);
        }));
      },

      /**
       * Convert values to Meters or Feet
       * @param {bool} toMeters
       */
      _convertValues: function (toMeters) {
        this.unitMeasureLabel.innerHTML = this.nls.unitMeasureLabel.format((toMeters) ? this.nls.meters :
          this.nls.feet);

        function convertValue(dist, isMeters) {
          var retVal = (isMeters) ? dojoNumber.parse(dist) * 0.3048 : dojoNumber.parse(dist) * 3.28084;
          return dojoNumber.format(retVal, {
            places: 2
          });
        }

        var trs = this._ThreatTypeTable.getRows();
        //get selected items from table
        array.forEach(trs, lang.hitch(this, function (tr) {
          var rowData = {};
          if (tr.threatType) {
            tr.mandatoryDistance = rowData.mandatoryDistance = convertValue(tr.mandatoryDistance, toMeters);
            tr.safeDistance = rowData.safeDistance = convertValue(tr.safeDistance, toMeters);
            tr.unit = this.unitType.value;
            this._ThreatTypeTable.editRow(tr, rowData);
          }
        }));
      },

      /**
       * Populates selected rows in threatTypes table
       */
      _populateThreatTableRow: function (threatInfos) {
        var result, tr;
        var row = {
          threatType: this._getThreatTypeNls(threatInfos.Threat),
          mandatoryDistance: dojoNumber.format(threatInfos.Bldg_Dist, {
            places: 2
          }),
          safeDistance: dojoNumber.format(threatInfos.Outdoor_Dist, {
            places: 2
          }),
          unit: threatInfos.Unit
        };
        result = this._ThreatTypeTable.addRow(row);
        if (result.success && result.tr) {
          tr = result.tr;
          tr.threatType = threatInfos.Threat;
          tr.mandatoryDistance = dojoNumber.format(threatInfos.Bldg_Dist, {
            places: 2
          });
          tr.safeDistance = dojoNumber.format(threatInfos.Outdoor_Dist, {
            places: 2
          });
          tr.unit = threatInfos.Unit;
          //this._addThreatTypeTitle(tr, tr.threatType);
        }
      },

      /**
       * This function get Configured Threats
       */
      _getConfiguredThreats: function () {
        var selectedthreatTypeArr = [],
          trs;
        trs = this._ThreatTypeTable.getRows();
        //get selected items from table
        array.forEach(trs, lang.hitch(this, function (tr) {
          var threatItem = {};
          if (tr.threatType) {
            threatItem.Threat = tr.threatType;
            threatItem.Bldg_Dist = dojoNumber.parse(tr.mandatoryDistance, {
              places: 2
            });
            threatItem.Outdoor_Dist = dojoNumber.parse(tr.safeDistance, {
              places: 2
            });
            threatItem.Unit = tr.unit;
            selectedthreatTypeArr.push(threatItem);
          }
        }));
        return selectedthreatTypeArr;
      },

      /**
       * This function is to set threatType in the table row
       */
      _addThreatTypeTitle: function (row, threatType) {
        var td, normalTextDiv;
        // Set threat type label
        td = query('.simple-table-cell', row)[0];
        if (td) {
          normalTextDiv = query('div', td)[0];
          normalTextDiv.innerHTML = threatType;
          normalTextDiv.title = threatType;
        }
      },

      _onEditThreatInfoClick: function (tr) {
        var rowData = this._ThreatTypeTable.getRowData(tr);
        if (rowData) {
          this._createNewThreatTypePopup(false, this._ThreatTypeTable, tr, rowData);
        }
      },

      /**
       * This function is to get existing threat types
       */
      _getExistingThreatTypes: function () {
        var rows, threatTypes = [];
        if (this._ThreatTypeTable) {
          rows = this._ThreatTypeTable.getRows();
          if (rows && rows.length > 0) {
            array.forEach(rows, function (row) {
              if (row.threatType) {
                threatTypes.push(row.threatType);
              }
            });
          }
        }
        return threatTypes;
      }
    });
  });