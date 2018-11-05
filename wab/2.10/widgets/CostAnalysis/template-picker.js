///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'dojo/Evented',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./template-picker.html',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/Deferred',
  'dojo/dom-class',
  'dojo/dom-construct',
  'esri/dijit/editing/Editor',
  'esri/tasks/GeometryService',
  'dojo/_base/html',
  'jimu/dijit/Popup',
  'jimu/dijit/Message',
  'dojo/keys',
  'esri/geometry/geometryEngine',
  './scenario-selection',
  "esri/SpatialReference",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  "esri/graphic",
  "esri/layers/FeatureLayer",
  "esri/toolbars/draw",
  "./copy-features"
], function (
  declare,
  BaseWidget,
  Evented,
  _WidgetsInTemplateMixin,
  template,
  array,
  lang,
  on,
  Deferred,
  domClass,
  domConstruct,
  Editor,
  GeometryService,
  html,
  Popup,
  Message,
  keys,
  geometryEngine,
  ScenarioSelection,
  SpatialReference,
  Polyline,
  Polygon,
  Query,
  QueryTask,
  Graphic,
  FeatureLayer,
  Draw,
  CopyFeatures
) {
  return declare([BaseWidget, Evented, _WidgetsInTemplateMixin], {
    templateString: template,

    baseClass: 'jimu-widget-cost-template-picker',

    _projectOverview: null,
    _templatePicker: null,
    _editor: null,
    _scenarioSelectionObj: null,
    _selectScenarioPopup: null,
    _isFeatureIntersected: null,
    _configuredTemplateObj: [],
    _configuredGeographyCostEquation: {},
    _onBeforeEditCompleteResult: {},
    _templateInfoCalculated: false, //flag to know if template Info is already calculated or not
    _addFeaturesEventInfo: [], //array to store add features event info
    _windowResizeTimer: null,
    selectedTemplateInfo: {},
    _splitAssetsArr: [],
    _currentAssetSplitGeometry: null,
    _nonEditableLayers: [],
    _splitAssetInfo: [],
    _allIntersectedRegions: [],
    _selectedTemplate: null,
    _featuresToBeCopied: [],
    _layerEvents: [], //Array to store layer event listeners
    _copyFeaturesObj: null,
    _layersForEditor: [],

    postCreate: function () {
      this.inherited(arguments);
      this._projectOverview = null;
      this._templatePicker = null;
      this._editor = null;
      this._scenarioSelectionObj = null;
      this._selectScenarioPopup = null;
      this._isFeatureIntersected = null;
      this._configuredTemplateObj = [];
      this._configuredGeographyCostEquation = {};
      this.selectedTemplateInfo = {};
      this._onBeforeEditCompleteResult = {};
      this._addFeaturesEventInfo = [];
      this._splitAssetsArr = [];
      this._currentAssetSplitGeometry = null;
      this._nonEditableLayers = [];
      this._splitAssetInfo = [];
      this._windowResizeTimer = null;
      this._allIntersectedRegions = [];
      this._selectedTemplate = null;
      this._featuresToBeCopied = [];
      this._layerEvents = [];
      this._copyFeaturesObj = null;
      this._layersForEditor = [];
    },

    startup: function () {
      this.inherited(arguments);
      this._getLayersForSelection();
      on(window, "resize", lang.hitch(this, this.onWindowResize));
      this.own(on(this.sketchButton, "click", lang.hitch(this, function () {
        // if disable, activate sketch button
        if (!(domClass.contains(this.sketchButton, "esriCTSketchEnable"))) {
          this._activateSketchButton();
          this._deActivateSelectButton();
        }
        this._toggleToolState();
      })));
      this.own(on(this.selectButton, "click", lang.hitch(this, function () {
        // if disable, activate select button
        if (!(domClass.contains(this.selectButton, "esriCTSelectEnable"))) {
          this._activateSelectButton();
          this._deActivateSketchButton();
        }
        this._toggleToolState();
      })));
    },

    destroy: function () {
      this._deactivateAllTools();
      this.removeLayerEvents();
      this._configuredGeographyCostEquation = {};
      if (this._editor) {
        this._editor.destroy();
        this._editor = null;
      }
      if (this._copyFeaturesObj) {
        this._copyFeaturesObj.destroy();
        this._copyFeaturesObj = null;
      }
      this.inherited(arguments);
    },

    loadCostingInfo: function (layerId, templateInfo) {
      var geographyGlobalID, templateName, regionName;
      geographyGlobalID = templateInfo.GEOGRAPHYGUID;
      templateName = templateInfo.TEMPLATENAME;
      regionName = templateInfo.GEOGRAPHY;
      if (!this._configuredGeographyCostEquation.hasOwnProperty(geographyGlobalID)) {
        this._configuredGeographyCostEquation[geographyGlobalID] = {};
        this._configuredGeographyCostEquation[geographyGlobalID][layerId] = {};
        this._configuredGeographyCostEquation[geographyGlobalID][layerId][templateName] =
          templateInfo;
      } else if (!this._configuredGeographyCostEquation[geographyGlobalID].
        hasOwnProperty(layerId)) {
        this._configuredGeographyCostEquation[geographyGlobalID][layerId] = {};
        this._configuredGeographyCostEquation[geographyGlobalID][layerId][templateName] =
          templateInfo;
      } else if (!this._configuredGeographyCostEquation[geographyGlobalID][layerId].
        hasOwnProperty(templateName)) {
        this._configuredGeographyCostEquation[geographyGlobalID][layerId][templateName] =
          templateInfo;
      } else if (this._configuredGeographyCostEquation[geographyGlobalID] &&
        this._configuredGeographyCostEquation[geographyGlobalID][layerId] &&
        this._configuredGeographyCostEquation[geographyGlobalID][layerId][templateName]) {
        this._configuredGeographyCostEquation[geographyGlobalID][layerId]
        [templateName].COSTEQUATION = templateInfo.COSTEQUATION;
      }
    },

    /**
    * Window resize handler
    * @memberOf widgets/CostAnalysis/template-picker
    **/
    onWindowResize: function () {
      if (this._windowResizeTimer) {
        clearTimeout(this._windowResizeTimer);
      }
      this._windowResizeTimer = setTimeout(lang.hitch(this, this.resize),
        500);
    },

    /**
     * Get configured layers available for selection in template picker
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _getLayersForSelection: function () {
      var customizedLayer, configuredLayerSettings, layersForEditor = [];
      this._layersForEditor = null;
      this._getConfiguredTemplates();
      array.forEach(this.config.layerSettings, lang.hitch(this, function (currentLayer) {
        var projectIdField;
        if (currentLayer.editable || currentLayer.selectable) {
          customizedLayer = this.map.getLayer(currentLayer.id);
          //if layer is still available in map then only proceed
          if (customizedLayer) {
            configuredLayerSettings = this._getLayerSettingsById(currentLayer.id);
            //Check if project field is configured to store project GUID
            if (configuredLayerSettings.selectedField) {
              projectIdField = configuredLayerSettings.selectedField;
            }
            customizedLayer = this._filterLayerTemplates(customizedLayer, projectIdField);
            if (customizedLayer) {
              layersForEditor.push({
                featureLayer: customizedLayer,
                disableAttributeUpdate: !currentLayer.editable,
                disableGeometryUpdate: !currentLayer.editable,
                editable: currentLayer.editable
              });
            }
            //Push all non-editable layers in an array
            if (!currentLayer.editable) {
              this._nonEditableLayers.push(currentLayer.id);
            }
          }
        }
      }));
      //init editor after some timeOut to overcome the issue of template picker not rendering
      setTimeout(lang.hitch(this, function () {
        this._layersForEditor = layersForEditor;
        if (!this._editor) {
          this.initEditingToolbar();
        }
      }), 500);

    },

    /**
     * Get configured layers settings from layer id
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _getLayerSettingsById: function (layerId) {
      var layerSettings = {};
      array.some(this.config.layerSettings, lang.hitch(this, function (currentLayer) {
        if (currentLayer.id === layerId) {
          layerSettings = currentLayer;
          return true;
        }
      }));
      return layerSettings;
    },

    /**
     * Filter layers template based on configuration
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _filterLayerTemplates: function (layer, projectIdField) {
      var layerInstance, layerId;
      //Loop through configured templates
      for (layerId in this.config.costingInfoSettings) {
        if (this.config.costingInfoSettings[layerId].length > 0) {
          layerInstance = this.layerInfosObj.getLayerInfoById(layerId);
          //Fetch actual templates of layers based on configuration
          if (layerInstance && layerInstance.layerObject &&
            layerInstance.layerObject.url === layer.url) {
            if (layer.templates.length > 0) {
              layer.templates =
                this._setConfiguredTemplates(layer.templates, layerId, projectIdField);
            }
            else {
              layer.types = this._setConfiguredTemplates(layer.types, layerId, projectIdField);
            }
          }
        }
      }
      return layer;
    },

    /**
     * set configured templates to layer object
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _setConfiguredTemplates: function (layerTemplatesArray, layerId, projectIdField) {
      var itemArrayLen, configuredTemplates, index, templateName;
      configuredTemplates = [];
      itemArrayLen = layerTemplatesArray.length;
      for (var item = itemArrayLen - 1; item >= 0; item--) {
        templateName = layerTemplatesArray[item].templates ?
          layerTemplatesArray[item].templates[0].name : layerTemplatesArray[item].name;
        index = this._configuredTemplateObj[layerId].indexOf(templateName);
        if (index !== -1) {
          //Add project id to respective template
          //This will automatically be stored in features if added through template picker
          if (projectIdField) {
            //if templates in an item use first else the item is template
            if ('templates' in layerTemplatesArray[item]) {
              layerTemplatesArray[item].templates[0].prototype.attributes[projectIdField] =
                this.projectInfo.projectId;
            }
            else {
              layerTemplatesArray[item].prototype.attributes[projectIdField] =
                this.projectInfo.projectId;
            }
          }
          configuredTemplates.push(layerTemplatesArray[item]);
        }
      }
      return configuredTemplates;
    },

    /**
     * create array of all configured templates from config
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _getConfiguredTemplates: function () {
      var layerId;
      for (layerId in this.config.costingInfoSettings) {
        this._getConfiguredTemplateNameArray(layerId);
      }
    },

    /**
     * push configured templates names from config
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _getConfiguredTemplateNameArray: function (layerId) {
      array.forEach(this.config.costingInfoSettings[layerId],
        lang.hitch(this, function (currentTemplate) {
          if (this._configuredTemplateObj[layerId]) {
            this._configuredTemplateObj[layerId].push(currentTemplate.featureTemplate);
          }
          else {
            this._configuredTemplateObj[layerId] = [];
            this._configuredTemplateObj[layerId].push(currentTemplate.featureTemplate);
          }
        }));
    },

    /**
     * This function is used to filter layer for selection according to current selected features
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _getFilteredLayerAccToSelectedTemplate: function () {
      var layerArr;
      layerArr = [];
      array.forEach(this._editor._settings.layers, lang.hitch(this, function (layer) {
        if (this._selectedTemplate.featureLayer.geometryType === layer.geometryType) {
          if (this._nonEditableLayers.indexOf(layer.id) > -1) {
            layerArr.push(layer);
          }
        }
      }));
      return layerArr;
    },

    /**
     * Create editor toolbar widget, this widget will create template picker and editor toolbar
     * @memberOf widgets/CostAnalysis/template-picker
     */
    initEditingToolbar: function () {
      var settings, params, layersForTemplatePicker, layersForEditor;
      if (this._layersForEditor === null) {
        return;
      }
      layersForEditor = this._layersForEditor ? this._layersForEditor : [];
      settings = {
        map: this.map,
        geometryService: new GeometryService(this.config.helperServices.geometry.url),
        layerInfos: layersForEditor,
        toolbarVisible: false,
        showAttributesOnClick: true,
        toolbarOptions: {
          reshapeVisible: false,
          cutVisible: false,
          mergeVisible: false
        },
        createOptions: {
          polylineDrawTools: [
            Editor.CREATE_TOOL_POLYLINE,
            Editor.CREATE_TOOL_FREEHAND_POLYLINE
          ],
          polygonDrawTools: [
            Editor.CREATE_TOOL_POLYGON,
            Editor.CREATE_TOOL_RECTANGLE,
            Editor.CREATE_TOOL_CIRCLE,
            Editor.CREATE_TOOL_FREEHAND_POLYGON
          ]
        },
        showTooltip: false
      };
      params = { settings: settings };
      this._editor = new Editor(params, domConstruct.create("div", {},
        this.editorToolbarNode
      ));
      this._editor.startup();
      this.bindLayerEvents();
      //Hide the tooltip for template
      this._editor.templatePicker.showTooltip = true;
      layersForTemplatePicker = array.filter(this._editor.templatePicker.featureLayers,
        lang.hitch(this, function (currentLayer) {
          //Filter all non editable layers from template picker
          return this._nonEditableLayers.indexOf(currentLayer.id) === -1;
        }));
      this._editor.templatePicker.featureLayers = layersForTemplatePicker;
      if (this.templatePickerNode) {
        this._editor.templatePicker.placeAt(this.templatePickerNode);
      }
      this.own(on(this._editor.templatePicker, 'selection-change', lang.hitch(this, function () {
        var selectedTemplate;
        selectedTemplate = this._editor.templatePicker.getSelected();
        if (selectedTemplate) {
          this._selectedTemplate = selectedTemplate;
        }
        // When user clicks on template picker to select template, and at that moment
        // if custom select tool icon is enabled than activate that custom tool
        if (!domClass.contains(this.selectButton, "esriCTSelectDisable")) {
          this._activateCustomSelectTool();
        }
      })));
      this.own(on(this._editor.editToolbar, 'deactivate', lang.hitch(this, function () {
        this.emit("editEnd");
      })));
      this.own(on(this._editor.editToolbar, 'activate', lang.hitch(this, function () {
        this.emit("editStart");
      })));
      //create custom tool to select features for copy
      if (!this.customToolbar) {
        this._createCustomSelectTool();
      }
      setTimeout(lang.hitch(this, this.resize, 100));
    },

    /**
     * This function is used to display a popup which displays region name and
     * provides option to choose scenario.
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _displayCopyAssetsPopup: function () {
      this._copyFeaturesDialog = new Message({
        message: this.nls.scenarioSelection.copyFeatureMsg,
        type: "question",
        maxWidth: 375,
        buttons: [{
          "label": this.nls.common.yes, "onClick": lang.hitch(this, function () {
            this._copyFeaturesDialog.close();
            this._copyFeaturesObj.cancelBtnClicked();
            if (this._selectedTemplate) {
              this._copyFeature();
            }
          })
        }, {
          "label": this.nls.common.no, "onClick": lang.hitch(this, function () {
            this._copyFeaturesDialog.close();
          })
        }]
      });
    },

    /**
     * Listen for ok button click of copy asset dialog
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _copyFeature: function () {
      var newGraphic;
      if (this._selectedTemplate) {
        newGraphic = new Graphic(this._featuresToBeCopied.shift());
        this._selectedTemplate.featureLayer.applyEdits([newGraphic]);
      }
    },

    /**
     * Listen for cancel button click of copy asset dialog
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _onCancelBtnClicked: function () {
    },

    /**
     * Adds overridden apply edits method for each layer so that we can split the geometry if needed
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _addCustomApplyEdits: function () {
      // Bind layer events for each layer
      if (this._editor && this._editor.settings && this._editor.settings.layers) {
        array.forEach(this._editor.settings.layers,
          lang.hitch(this, function (layer) {
            // Save the default method for later use
            layer.myApplyEdits = layer.applyEdits;
            var _this = this;
            // override with dummy function and simulate async execution
            layer.applyEdits = function (adds, updates, deletes) {
              //Override for add functionality so that we can check for regions and scenarios
              if (!adds || adds.length === 0) {
                layer.myApplyEdits(adds, updates, deletes);
              } else {
                if (_this._selectedTemplate) {
                  _this._orgFeature = adds[0];
                  _this._checkAssetIntersection();
                }
              }
              //simulate async execution
              var deferred = new Deferred();
              setTimeout(function () {
                deferred.resolve(true);
              }, 100);
              return deferred;
            };
          }));
      }
    },

    /**
     * Removes overridden apply edits method and layer events of each layer
     * @memberOf widgets/CostAnalysis/template-picker
     */
    removeLayerEvents: function () {
      //remove custom apply edits method
      if (this._editor && this._editor.settings && this._editor.settings.layers) {
        array.forEach(this._editor.settings.layers,
          lang.hitch(this, function (layer) {
            if (layer.myApplyEdits) {
              layer.applyEdits = layer.myApplyEdits;
              delete layer.myApplyEdits;
            }
          }));
      }
      //Removes the event listeners of each layers
      if (this._layerEvents && this._layerEvents.length > 0) {
        array.forEach(this._layerEvents, lang.hitch(this, function (layerEvent) {
          layerEvent[0].remove();
        }));
        this._layerEvents = [];
      }
      //clears highlight graphic layer and hide copy-features dialog
      if (this._copyFeaturesObj) {
        this._copyFeaturesObj.cancelBtnClicked();
      }
    },

    /**
    * Bind layer events
    * @memberOf widgets/CostAnalysis/template-picker
    */
    bindLayerEvents: function () {
      //before binding events and custom apply-edits remove if prev listeners exist
      this.removeLayerEvents();
      //overrides apply edit method for each layer
      this._addCustomApplyEdits();
      // Bind layer events for each layer
      if (this._editor && this._editor.settings && this._editor.settings.layers &&
        this._editor.settings.layers.length > 0) {
        array.forEach(this._editor.settings.layers,
          lang.hitch(this, function (layer) {
            var beforeApplyEdits, editsComplete, selectionComplete, selectionClear;
            beforeApplyEdits = this.own(on(layer, 'before-apply-edits', lang.hitch(this, this.onBeforeEditComplete)));
            editsComplete = this.own(on(layer, 'edits-complete', lang.hitch(this, this.onEditCompletes)));
            this._layerEvents.push(beforeApplyEdits);
            this._layerEvents.push(editsComplete);
            //Attach 'selection-complete' and 'selection-clear' for non-editable layers
            if (this._nonEditableLayers.indexOf(layer.id) > -1) {
              selectionComplete = this.own(on(layer, "selection-complete", lang.hitch(this, function (evt) {
                if (evt.features.length && this._editor && this._editor.drawingToolbar &&
                  this._editor.drawingToolbar._tools) {
                  domClass.add(this._editor.drawingToolbar._tools.DELETE.domNode, "esriCTHidden");
                }
              })));
              selectionClear = this.own(on(layer, "selection-clear", lang.hitch(this, function () {
                if (this._editor && this._editor.drawingToolbar &&
                  this._editor.drawingToolbar._tools) {
                  domClass.remove(this._editor.drawingToolbar._tools.DELETE.domNode,
                    "esriCTHidden");
                }
              })));
              this._layerEvents.push(selectionComplete);
              this._layerEvents.push(selectionClear);
            }
          }));
      }
    },

    /**
     * Listen for before apply edits event
     * @memberOf widgets/CostAnalysis/template-picker
     */
    onBeforeEditComplete: function (results) {
      //Do not perform edits operation if attributeInspector is active
      if (this._editor.attributeInspector.focused && (results.deletes &&
        results.deletes.length === 0 || results.updates &&
        results.updates.length > 0)) {
        return;
      }
      this.loadingIndicator.show();
      this._onBeforeEditCompleteResult[results.target.id] = results;
    },

    /**
     * Listen for apply edits event
     * @memberOf widgets/CostAnalysis/template-picker
     */
    onEditCompletes: function (results) {
      //Do not perform edits operation if attributeInspector is active
      if (this._editor.attributeInspector.focused && (results.deletes &&
        results.deletes.length === 0 || results.updates &&
        results.updates.length > 0)) {
        return;
      }
      results = this._getSucceededFeatures(results, results.target.id);
      this.loadingIndicator.hide();
      if (results.deletes && results.deletes.length > 0) {
        this.deleteFeatures(results.deletes, results.target);
      }
      if (results.adds && results.adds.length > 0) {
        this.addFeatures(results.adds, results.target);
      }
      if (results.updates && results.updates.length > 0) {
        this.editFeatures(results.updates);
      }
    },

    /**
     * Filter features in particular layer based on their success
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _getSucceededFeatures: function (results, layerId) {
      array.forEach(results.adds, lang.hitch(this, function (feature, index) {
        if (!feature.success) {
          this._onBeforeEditCompleteResult[layerId].adds.splice(index, 1);
          this._splitAssetInfo.splice(index, 1);
        }
      }));
      array.forEach(results.updates, lang.hitch(this, function (feature, index) {
        if (!feature.success) {
          this._onBeforeEditCompleteResult[layerId].updates.splice(index, 1);
          this._splitAssetInfo.splice(index, 1);
        }
      }));
      array.forEach(results.deletes, lang.hitch(this, function (feature, index) {
        if (!feature.success) {
          this._onBeforeEditCompleteResult[layerId].deletes.splice(index, 1);
          this._splitAssetInfo.splice(index, 1);
        }
      }));
      return this._onBeforeEditCompleteResult[layerId];
    },

    /**
     * Add features when a new features are added
     * @memberOf widgets/CostAnalysis/template-picker
     */
    addFeatures: function (addedFeatures, layer) {
      //add templateInfo and templateName in each geometry
      array.forEach(this._splitAssetInfo, lang.hitch(this, function (assetInfo, index) {
        delete assetInfo.ASSETGEOMETRY;
        addedFeatures[index].templateInfo = assetInfo;
        addedFeatures[index].templateName = assetInfo.TEMPLATENAME;
      }));
      this.emit("assetAdded", addedFeatures, layer, this._splitAssetInfo);
      this._orgFeature = null;
      if (this._featuresToBeCopied.length > 0) {
        this._copyFeature();
      }
    },

    /**
     * Edit features when features are edited
     * @memberOf widgets/CostAnalysis/template-picker
     */
    editFeatures: function (updatedFeatures) {
      this.emit("assetUpdated", updatedFeatures);
    },

    /**
     * Delete features when a new features are deleted
     * @memberOf widgets/CostAnalysis/template-picker
     */
    deleteFeatures: function (deleteFeatures, layer) {
      this.emit("assetDeleted", deleteFeatures, layer);
    },

    /**
     * This function is used to convert polygon into polyline
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _polygonToPolyline: function (polygon) {
      var cutterPolylineArr, polyline, q, pathArr, p;
      cutterPolylineArr = [];
      // Set spatial reference of the polygon
      //polyline = new Polyline(new SpatialReference(polygon.spatialReference));
      polyline = new Polyline(new SpatialReference(polygon.spatialReference));
      for (p = 0; p < polygon.rings.length; p++) {
        pathArr = [];
        for (q = 0; q < polygon.rings[p].length; q++) {
          pathArr.push(polygon.rings[p][q]);
        }
        polyline.addPath(pathArr);
      }
      cutterPolylineArr.push(polyline);
      return cutterPolylineArr;
    },

    /**
     * This function is used to split the asset geometry
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _getSplitFeatureGeometries: function (asset, regionArr) {
      var regionUnionGeometryArr, unionGeometryCutter, cutterGeom, splitGeomArr,
        mainSplitGeometryArr, isAssetPolylineGeometry;

      regionUnionGeometryArr = [];
      mainSplitGeometryArr = [];

      if (regionArr.length > 0) {
        if (asset.geometry.type === "polyline") {
          isAssetPolylineGeometry = true;
        } else if (asset.geometry.type === "polygon") {
          isAssetPolylineGeometry = false;
        }

        array.forEach(regionArr, lang.hitch(this, function (region) {
          regionUnionGeometryArr.push(region.geometry);
        }));

        unionGeometryCutter = geometryEngine.union(regionUnionGeometryArr);
        unionGeometryCutter = this._polygonToPolyline(unionGeometryCutter)[0];
        cutterGeom = asset.geometry;
        splitGeomArr = geometryEngine.cut(cutterGeom, unionGeometryCutter);

        if (splitGeomArr.length > 1) {
          mainSplitGeometryArr.push({
            "geometry": splitGeomArr[0],
            "isIntersectedGeometry": false
          });
          if (!isAssetPolylineGeometry) {
            array.forEach(splitGeomArr, lang.hitch(this, function (splitGeom, index) {
              if (index > 0) {
                array.forEach(splitGeom.rings, lang.hitch(this, function (ring) {
                  var polygon;
                  polygon = new Polygon(new SpatialReference(asset.geometry.spatialReference));
                  polygon.addRing(ring);
                  mainSplitGeometryArr.push({
                    "geometry": polygon,
                    "isIntersectedGeometry": true
                  });
                }));
              }
            }));
          } else {
            array.forEach(splitGeomArr, lang.hitch(this, function (splitGeom, index) {
              if (index > 0) {
                array.forEach(splitGeom.paths, lang.hitch(this, function (path) {
                  var polyline;
                  polyline = new Polyline(new SpatialReference(asset.geometry.spatialReference));
                  polyline.addPath(path);
                  mainSplitGeometryArr.push({
                    "geometry": polyline,
                    "isIntersectedGeometry": true
                  });
                }));
              }
            }));
          }
        } else {
          mainSplitGeometryArr.push({
            "geometry": asset.geometry,
            "isIntersectedGeometry": true
          });
        }
      } else {
        mainSplitGeometryArr.push({
          "geometry": asset.geometry,
          "isIntersectedGeometry": false
        });
      }

      return mainSplitGeometryArr;
    },

    /**
     * This function is used to check if assets are intersected to the geography layer
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _checkAssetIntersection: function () {
      this._intersectedCostingGraphicArr = [];
      this._allIntersectedRegions = [];
      this._splitAssetInfo = [];
      this.selectedTemplateInfo = {};
      this._getIntersectedCostingGraphicArr(this._orgFeature).then(
        lang.hitch(this, function (intersected) {
          var simplifiedGeometry;
          simplifiedGeometry = geometryEngine.simplify(this._orgFeature.geometry);
          if (simplifiedGeometry) {
            this._orgFeature.geometry = simplifiedGeometry;
            this._allIntersectedRegions = lang.clone(intersected);
            this._intersectedCostingGraphicArr = intersected;
            if (this.config.projectSettings.costingGeometryLayer) {
              if (this._orgFeature.geometry.type === "point") {
                this._splitAssetsArr.push({
                  "geometry": this._orgFeature.geometry,
                  "isIntersectedGeometry": intersected.length > 0
                });
              } else {
                this._splitAssetsArr =
                  this._getSplitFeatureGeometries(this._orgFeature,
                    this._intersectedCostingGraphicArr);
              }
            } else {
              this._splitAssetsArr.push({
                "geometry": this._orgFeature.geometry,
                "isIntersectedGeometry": intersected.length > 0
              });
            }
            //process splitting for overlapping geometries
            this._processOverlappingGeometries();
          }
        }));
    },

    /**
     * This function queries and get the intersected costing geometries
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _getIntersectedCostingGraphicArr: function (asset) {
      var def, query, queryTask, costingGeometryLayer;
      def = new Deferred();
      //query only if costing geography layer is configured else resolve the deferred
      if (this.config.projectSettings.costingGeometryLayer) {
        query = new Query();
        costingGeometryLayer =
          this.map.getLayer(this.config.projectSettings.costingGeometryLayer);
        queryTask = new QueryTask(costingGeometryLayer.url);
        if (costingGeometryLayer.getDefinitionExpression()) {
          query.where = costingGeometryLayer.getDefinitionExpression();
        }
        query.outSpatialReference = asset.geometry.spatialReference;
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.geometry = asset.geometry;
        queryTask.execute(query, lang.hitch(this, function (result) {
          var intersectedCostingGraphicArr = [];
          if (result && result.features.length > 0) {
            intersectedCostingGraphicArr = result.features;
          }
          def.resolve(intersectedCostingGraphicArr);
        }), lang.hitch(this, function () {
          def.resolve([]);
        }));
        return def.promise;
      } else {
        setTimeout(lang.hitch(this, function () {
          def.resolve([]);
        }), 0);
        return def.promise;
      }
    },

    /**
     * This function process the splitting of intersected assets for overlapping geometries
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _processOverlappingGeometries: function () {
      var newSplitAssetsArr = [], unProcessed = [],
        newProcessedSplitArray = [], newUnProcessedSplitArray = [];
      if (this._splitAssetsArr.length > 0) {
        //loop through all the split assets and if it is intersecting then only process
        //else directly consider the asset as is
        array.forEach(this._splitAssetsArr, lang.hitch(this, function (splitAsset) {
          var splitResult;
          if (splitAsset.isIntersectedGeometry) {
            splitResult = this._splitForOverlappingGeometries(splitAsset);
            //add processed and unprocessed split geometries according to regions
            if (splitResult.processed.length > 0) {
              newSplitAssetsArr =
                newSplitAssetsArr.concat(splitResult.processed);
            }
            if (splitResult.unProcessed.length > 0) {
              unProcessed = unProcessed.concat(splitResult.unProcessed);
            }
          } else {
            newSplitAssetsArr.push(splitAsset);
          }
        }));
        //once the split for overlapping geometries is done reassign _splitAssetsArr
        this._splitAssetsArr = [];
        this._splitAssetsArr = newSplitAssetsArr;
      }
      //Split unprocessed geometries for split according to regions
      array.forEach(unProcessed, lang.hitch(this, function (splitAsset) {
        var splitResult;
        splitResult = this._splitForOverlappingGeometries(splitAsset, true);
        if (splitResult.processed.length > 0) {
          newProcessedSplitArray =
            newProcessedSplitArray.concat(splitResult.processed);
        }
        if (splitResult.unProcessed.length > 0) {
          newUnProcessedSplitArray = newUnProcessedSplitArray.concat(splitResult.unProcessed);
        }
      }));
      this._splitAssetsArr = this._splitAssetsArr.concat(newProcessedSplitArray);
      this._deleteDuplicateSplits();
      //once _splitAssetsArr is updated display popup for assets (region/scenario)
      this._displayPopupForAssets();
    },

    /**
     * Function to delete split geometry which is duplicated
     */
    _deleteDuplicateSplits: function () {
      //Remove duplicate geometry split asset from the array
      var deleteIndex = [];
      array.forEach(this._splitAssetsArr, lang.hitch(this, function (splitAsset, index) {
        if (deleteIndex.indexOf(index) < 0) {
          for (var i = index + 1; i < this._splitAssetsArr.length; i++) {
            if (geometryEngine.equals(splitAsset.geometry, this._splitAssetsArr[i].geometry)) {
              deleteIndex.push(i);
            }
          }
        }
      }));
      if (deleteIndex.length > 0) {
        deleteIndex.sort(function (a, b) {
          return a - b;
        });
        array.forEach(deleteIndex, lang.hitch(this, function (deleteAt, index) {
          deleteAt = deleteAt - index;
          this._splitAssetsArr.splice(deleteAt, 1);
        }));
      }
    },

    /**
     * This function invalidates the line with only one pat and have same start and end point.
     */
    isLineValid: function (geometry) {
      if (geometry.paths && geometry.paths.length === 1 &&
        geometry.paths[0].length === 2 &&
        geometry.paths[0][0][0] === geometry.paths[0][1][0] &&
        geometry.paths[0][0][1] === geometry.paths[0][1][1]) {
        return false;
      }
      return true;
    },

    /**
     * This function splits the intersected assets for overlapping geometries
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _splitForOverlappingGeometries: function (splitAsset, isUnprocessed) {
      var splitAssetArray = [], unProcessed = [], intersectingGeometries = [], isContained = false;
      //get all intersecting costing geometries to each asset
      array.forEach(this._allIntersectedRegions, lang.hitch(this, function (costingGraphic) {
        if (geometryEngine.intersects(splitAsset.geometry, costingGraphic.geometry)) {
          intersectingGeometries.push(costingGraphic);
        }
      }));
      //check if any of the intersecting geometries contains the asset completely
      array.forEach(intersectingGeometries, lang.hitch(this, function (costingGraphic) {
        if (geometryEngine.contains(costingGraphic.geometry, splitAsset.geometry)) {
          isContained = true;
        }
      }));
      //if asset is contained in any of the geometries
      //means it is intersecting the area/ costing geometry which is not overlapping/ touching
      if (!isContained) {
        //As asset intersects multiple geometries, split it by looping each intersecting geometry
        //Start with complete split asset geometry received and
        //once asset is split update the cutterGeom with the remaining part of asset geometry
        var cutterGeom = splitAsset.geometry;
        var regionsLength = intersectingGeometries.length;
        array.forEach(intersectingGeometries, lang.hitch(this, function (costingGraphic, index) {
          var unionGeometryCutter = this._polygonToPolyline(costingGraphic.geometry)[0];
          var splitGeomArr = geometryEngine.cut(cutterGeom, unionGeometryCutter);
          //if split has multiple entries consider '0' element as remaining part and
          //'1' as intersecting part and add it in splitsArray
          if (splitGeomArr.length > 1) { //if split is succeed and got multiple parts
            cutterGeom = splitGeomArr[0];
            for (var i = 1; i < splitGeomArr.length; i++) {
              if (i === 1 && this.isLineValid(splitGeomArr[i])) {
                splitAssetArray.push({
                  "geometry": splitGeomArr[i],
                  "isIntersectedGeometry": true
                });
              } else {
                unProcessed.push({
                  "geometry": splitGeomArr[i],
                  "isIntersectedGeometry": true
                });
              }
            }
          } else if (splitGeomArr.length > 0) { //if completely with in
            if (this.isLineValid(splitGeomArr[0])) {
              splitAssetArray.push({
                "geometry": splitGeomArr[0],
                "isIntersectedGeometry": true
              });
            }
          } else { // if not cut
            if (isUnprocessed) { //if it is unprocessed add directly as splited
              if (this.isLineValid(cutterGeom)) {
                splitAssetArray.push({
                  "geometry": cutterGeom,
                  "isIntersectedGeometry": true
                });
              }
            } else if (index === regionsLength - 1) {
              unProcessed.push({
                "geometry": cutterGeom,
                "isIntersectedGeometry": true
              });
            }
          }
        }));
      } else {
        splitAssetArray.push(splitAsset);
      }
      return { "processed": splitAssetArray, "unProcessed": unProcessed };
    },

    /**
     * This function is used to display the popup for each assets
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _displayPopupForAssets: function () {
      var splitAsset, isFeatureIntersected, costingGeometryLayer;
      costingGeometryLayer = this.map.getLayer(this.config.projectSettings.costingGeometryLayer);
      if (this._splitAssetsArr.length > 0) {
        splitAsset = this._splitAssetsArr.pop(0);
        this._currentAssetSplitGeometry = splitAsset.geometry;
        this._intersectedCostingGraphicArr = [];
        isFeatureIntersected = false;
        if (splitAsset.isIntersectedGeometry) {
          array.forEach(this._allIntersectedRegions,
            lang.hitch(this, function (costingGraphic) {
              if (geometryEngine.contains(costingGraphic.geometry, splitAsset.geometry)) {
                this._intersectedCostingGraphicArr.push(costingGraphic);
                isFeatureIntersected = true;
              }
            }));
        }
        if (this._intersectedCostingGraphicArr.length > 1) {
          var firstIntersectedRegion;
          firstIntersectedRegion = this._intersectedCostingGraphicArr[0];
          this._intersectedCostingGraphicArr = [];
          this._intersectedCostingGraphicArr.push(firstIntersectedRegion);
        }
        if (isFeatureIntersected) {
          this._isFeatureIntersected = isFeatureIntersected;
          this._displayPopupForRegion();
        } else {
          this._initializeScenarioSelection(this.nls.scenarioSelection.noneText,
            isFeatureIntersected, null);
        }
      } else {
        if (this._splitAssetInfo.length > 0) {
          this._createAndAddFeatures(this._splitAssetInfo);
        }
      }
    },

    _createAndAddFeatures: function (features) {
      var attributes, graphics = [];
      if (this._selectedTemplate) {
        //add attributes of the selected template
        attributes = lang.clone(this._selectedTemplate.template.prototype.attributes);
        //create graphics for each geometry
        array.forEach(features, lang.hitch(this, function (feature) {
          graphics.push(new Graphic(feature.ASSETGEOMETRY, null, lang.clone(attributes)));
        }));
        this._selectedTemplate.featureLayer.myApplyEdits(graphics, null, null);
      }
    },

    /**
     * This function is used to display the popup for each region
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _displayPopupForRegion: function () {
      var regionName, geographyGlobalID, intersectedCostingGraphic, costingGeometryLayer;
      costingGeometryLayer = this.map.getLayer(this.config.projectSettings.costingGeometryLayer);
      if (this._intersectedCostingGraphicArr.length > 0) {
        intersectedCostingGraphic = this._intersectedCostingGraphicArr.pop(0);
        regionName =
          intersectedCostingGraphic.attributes[this.config.projectSettings.geographyField];
        geographyGlobalID =
          intersectedCostingGraphic.attributes[costingGeometryLayer.globalIdField];
        this._initializeScenarioSelection(regionName,
          this._isFeatureIntersected, geographyGlobalID);
      } else {
        this._displayPopupForAssets();
      }
    },

    /**
     * This function is used to set the scenario to the region on click of OK button
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _destroyScenarioSelection: function () {
      if (this._scenarioSelectionObj) {
        this._scenarioSelectionObj.destroy();
      }
      if (this._selectScenarioPopup) {
        this._selectScenarioPopup.destroy();
      }
    },

    /**
     * This function is used to initialize scenario selection popup
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _initializeScenarioSelection: function (regionName, isFeatureIntersected, geographyGlobalID) {
      var selectedTemplateConfigArr, scenarioArr, blankGeographyScenarioArr,
        defaultCostEquation, selectedTemplateLayerID, templateName;
      selectedTemplateLayerID = this._selectedTemplate.featureLayer.id;
      templateName = this._selectedTemplate.template.name;
      this._destroyScenarioSelection();
      scenarioArr = [];
      blankGeographyScenarioArr = [];
      selectedTemplateConfigArr = this.config.costingInfoSettings[selectedTemplateLayerID];
      array.forEach(selectedTemplateConfigArr,
        lang.hitch(this, function (selectedTemplateConfig) {
          if (selectedTemplateConfig.geography === regionName &&
            selectedTemplateConfig.featureTemplate === templateName) {
            if (selectedTemplateConfig.scenario === "" ||
              selectedTemplateConfig.scenario === null ||
              selectedTemplateConfig.scenario === undefined) {
              selectedTemplateConfig = lang.clone(selectedTemplateConfig);
              selectedTemplateConfig.scenario = this.nls.scenarioSelection.noneText;
              scenarioArr.push(selectedTemplateConfig);
            } else {
              scenarioArr.push(selectedTemplateConfig);
            }
          } else if (selectedTemplateConfig.featureTemplate === templateName) {
            if (selectedTemplateConfig.geography === "" ||
              selectedTemplateConfig.geography === null ||
              selectedTemplateConfig.geography === undefined) {
              if (selectedTemplateConfig.scenario === "" ||
                selectedTemplateConfig.scenario === null ||
                selectedTemplateConfig.scenario === undefined) {
                defaultCostEquation = selectedTemplateConfig.costEquation;
                selectedTemplateConfig = lang.clone(selectedTemplateConfig);
                selectedTemplateConfig.scenario = this.nls.scenarioSelection.noneText;
                selectedTemplateConfig.geography = this.nls.scenarioSelection.noneText;
                blankGeographyScenarioArr.push(selectedTemplateConfig);
              } else {
                blankGeographyScenarioArr.push(selectedTemplateConfig);
              }
            }
          }
        }));
      if (scenarioArr.length === 1) {
        if (this._configuredGeographyCostEquation[geographyGlobalID] &&
          this._configuredGeographyCostEquation[geographyGlobalID]
          [this._selectedTemplate.featureLayer.id] &&
          this._configuredGeographyCostEquation[geographyGlobalID]
          [this._selectedTemplate.featureLayer.id][templateName]) {
          this.selectedTemplateInfo =
            this._configuredGeographyCostEquation[geographyGlobalID]
            [this._selectedTemplate.featureLayer.id][templateName];
          this.selectedTemplateInfo.ASSETGEOMETRY = this._currentAssetSplitGeometry;
          this._splitAssetInfo.push(lang.clone(this.selectedTemplateInfo));
          this._displayPopupForRegion();
        } else {
          this.selectedTemplateInfo = {};
          this.selectedTemplateInfo.TEMPLATENAME = templateName;
          this.selectedTemplateInfo.COSTEQUATION = scenarioArr[0].costEquation;
          this.selectedTemplateInfo.GEOGRAPHY = regionName;
          this.selectedTemplateInfo.SCENARIO = scenarioArr[0].scenario;
          this.selectedTemplateInfo.GEOGRAPHYGUID = geographyGlobalID;
          this.selectedTemplateInfo.ASSETGEOMETRY = this._currentAssetSplitGeometry;
          if (!this._configuredGeographyCostEquation.
            hasOwnProperty(this.selectedTemplateInfo.GEOGRAPHYGUID)) {
            this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID] = {};
          }
          if (!this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID].
            hasOwnProperty(this._selectedTemplate.featureLayer.id)) {
            this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID]
            [this._selectedTemplate.featureLayer.id] = {};
          }
          this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID]
          [this._selectedTemplate.featureLayer.id][this.selectedTemplateInfo.TEMPLATENAME] =
            this.selectedTemplateInfo;
          this._splitAssetInfo.push(lang.clone(this.selectedTemplateInfo));
          this._displayPopupForRegion();
        }
      } else if (blankGeographyScenarioArr.length === 1 &&
        scenarioArr.length === 0 && (!isFeatureIntersected)) {
        if (this._configuredGeographyCostEquation[geographyGlobalID] &&
          this._configuredGeographyCostEquation[geographyGlobalID]
          [this._selectedTemplate.featureLayer.id] &&
          this._configuredGeographyCostEquation[geographyGlobalID]
          [this._selectedTemplate.featureLayer.id][templateName]) {
          this.selectedTemplateInfo =
            this._configuredGeographyCostEquation[geographyGlobalID]
            [this._selectedTemplate.featureLayer.id][templateName];
          this.selectedTemplateInfo.ASSETGEOMETRY = this._currentAssetSplitGeometry;
          this._splitAssetInfo.push(lang.clone(this.selectedTemplateInfo));
          this._displayPopupForRegion();
        } else {
          this.selectedTemplateInfo = {};
          this.selectedTemplateInfo.TEMPLATENAME = templateName;
          this.selectedTemplateInfo.COSTEQUATION = blankGeographyScenarioArr[0].costEquation;
          this.selectedTemplateInfo.GEOGRAPHY = regionName;
          this.selectedTemplateInfo.SCENARIO = this.nls.scenarioSelection.noneText;
          this.selectedTemplateInfo.GEOGRAPHYGUID = geographyGlobalID;
          this.selectedTemplateInfo.ASSETGEOMETRY = this._currentAssetSplitGeometry;
          if (!this._configuredGeographyCostEquation.
            hasOwnProperty(this.selectedTemplateInfo.GEOGRAPHYGUID)) {
            this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID] = {};
          }
          if (!this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID].
            hasOwnProperty(this._selectedTemplate.featureLayer.id)) {
            this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID]
            [this._selectedTemplate.featureLayer.id] = {};
          }
          this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID]
          [this._selectedTemplate.featureLayer.id][this.selectedTemplateInfo.TEMPLATENAME] =
            this.selectedTemplateInfo;
          this._splitAssetInfo.push(lang.clone(this.selectedTemplateInfo));
          this._displayPopupForRegion();
        }
      } else if (blankGeographyScenarioArr.length > 1 &&
        scenarioArr.length === 0 && (!isFeatureIntersected)) {
        if (this._configuredGeographyCostEquation[geographyGlobalID] &&
          this._configuredGeographyCostEquation[geographyGlobalID]
          [this._selectedTemplate.featureLayer.id] &&
          this._configuredGeographyCostEquation[geographyGlobalID]
          [this._selectedTemplate.featureLayer.id][templateName]) {
          this.selectedTemplateInfo =
            this._configuredGeographyCostEquation[geographyGlobalID]
            [this._selectedTemplate.featureLayer.id][templateName];
          this.selectedTemplateInfo.ASSETGEOMETRY = this._currentAssetSplitGeometry;
          this._splitAssetInfo.push(lang.clone(this.selectedTemplateInfo));
          this._displayPopupForRegion();
        } else {
          this._scenarioSelectionObj = new ScenarioSelection({
            regionName: regionName,
            scenarioOptions: blankGeographyScenarioArr,
            nls: this.nls,
            templateName: templateName,
            geographyGlobalID: geographyGlobalID,
            costingGeometryLayer: this.config.projectSettings.costingGeometryLayer
          });
          this._displaySelectScenarioPopup(regionName);
        }
      } else if (scenarioArr.length === 0) {
        if (this._configuredGeographyCostEquation[geographyGlobalID] &&
          this._configuredGeographyCostEquation[geographyGlobalID]
          [this._selectedTemplate.featureLayer.id] &&
          this._configuredGeographyCostEquation[geographyGlobalID]
          [this._selectedTemplate.featureLayer.id][templateName]) {
          this.selectedTemplateInfo =
            this._configuredGeographyCostEquation[geographyGlobalID]
            [this._selectedTemplate.featureLayer.id][templateName];
          this.selectedTemplateInfo.ASSETGEOMETRY = this._currentAssetSplitGeometry;
          this._splitAssetInfo.push(lang.clone(this.selectedTemplateInfo));
          this._displayPopupForRegion();
        } else {
          this.selectedTemplateInfo = {};
          this.selectedTemplateInfo.TEMPLATENAME = templateName;
          this.selectedTemplateInfo.COSTEQUATION = defaultCostEquation;
          this.selectedTemplateInfo.GEOGRAPHY = regionName;
          this.selectedTemplateInfo.SCENARIO = this.nls.scenarioSelection.noneText;
          this.selectedTemplateInfo.GEOGRAPHYGUID = geographyGlobalID;
          this.selectedTemplateInfo.ASSETGEOMETRY = this._currentAssetSplitGeometry;
          if (!this._configuredGeographyCostEquation.
            hasOwnProperty(this.selectedTemplateInfo.GEOGRAPHYGUID)) {
            this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID] = {};
          }
          if (!this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID].
            hasOwnProperty(this._selectedTemplate.featureLayer.id)) {
            this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID]
            [this._selectedTemplate.featureLayer.id] = {};
          }
          this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID]
          [this._selectedTemplate.featureLayer.id][this.selectedTemplateInfo.TEMPLATENAME] =
            this.selectedTemplateInfo;
          this._splitAssetInfo.push(lang.clone(this.selectedTemplateInfo));
          this._displayPopupForRegion();
        }
      } else if (scenarioArr.length > 1) {
        if (this._configuredGeographyCostEquation[geographyGlobalID] &&
          this._configuredGeographyCostEquation[geographyGlobalID]
          [this._selectedTemplate.featureLayer.id] &&
          this._configuredGeographyCostEquation[geographyGlobalID]
          [this._selectedTemplate.featureLayer.id][templateName]) {
          this.selectedTemplateInfo =
            this._configuredGeographyCostEquation[geographyGlobalID]
            [this._selectedTemplate.featureLayer.id][templateName];
          this.selectedTemplateInfo.ASSETGEOMETRY = this._currentAssetSplitGeometry;
          this._splitAssetInfo.push(lang.clone(this.selectedTemplateInfo));
          this._displayPopupForRegion();
        } else {
          this._scenarioSelectionObj = new ScenarioSelection({
            regionName: regionName,
            scenarioOptions: scenarioArr,
            nls: this.nls,
            templateName: templateName,
            geographyGlobalID: geographyGlobalID,
            costingGeometryLayer: this.config.projectSettings.costingGeometryLayer
          });
          this._displaySelectScenarioPopup(regionName);
        }
      }
    },

    /**
     * This function is used to display a popup which displays region name and
     * provides option to choose scenario.
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _displaySelectScenarioPopup: function () {
      this._selectScenarioPopup = new Popup({
        titleLabel: this.nls.scenarioSelection.popupTitle,
        autoHeight: true,
        content: this._scenarioSelectionObj,
        width: 400,
        buttons: [{
          label: this.nls.common.ok,
          key: keys.ENTER,
          onClick: lang.hitch(this, '_onScenarioSelectionOk')
        }, {
          label: this.nls.common.cancel,
          key: keys.ESCAPE,
          onClick: lang.hitch(this, '_onScenarioSelectionCancel')
        }]
      });
      this._scenarioSelectionObj.startup();
    },

    /**
     * This function is used to set the scenario to the region on click of OK button
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _onScenarioSelectionOk: function () {
      var getSelectedOptionAttr;
      this.selectedTemplateInfo = {};
      getSelectedOptionAttr =
        this._scenarioSelectionObj.scenarioDropDown._getSelectedOptionsAttr();
      this.selectedTemplateInfo.TEMPLATENAME = getSelectedOptionAttr.item.featureTemplate;
      this.selectedTemplateInfo.COSTEQUATION = getSelectedOptionAttr.item.costEquation;
      this.selectedTemplateInfo.GEOGRAPHY =
        this._scenarioSelectionObj.regionNameTextBox.getValue();
      this.selectedTemplateInfo.SCENARIO = getSelectedOptionAttr.label;
      this.selectedTemplateInfo.GEOGRAPHYGUID = getSelectedOptionAttr.item.geographyGlobalID;
      this.selectedTemplateInfo.ASSETGEOMETRY = this._currentAssetSplitGeometry;
      if (!this._configuredGeographyCostEquation.
        hasOwnProperty(this.selectedTemplateInfo.GEOGRAPHYGUID)) {
        this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID] = {};
      }
      if (!this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID].
        hasOwnProperty(this._selectedTemplate.featureLayer.id)) {
        this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID]
        [this._selectedTemplate.featureLayer.id] = {};
      }
      this._configuredGeographyCostEquation[this.selectedTemplateInfo.GEOGRAPHYGUID]
      [this._selectedTemplate.featureLayer.id][this.selectedTemplateInfo.TEMPLATENAME] =
        this.selectedTemplateInfo;
      this._selectScenarioPopup.close();
      this._splitAssetInfo.push(lang.clone(this.selectedTemplateInfo));
      this._displayPopupForRegion();
    },

    /**
     * This function is used to close the scenario selection popup on click of cancel button
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _onScenarioSelectionCancel: function () {
      this._selectScenarioPopup.close();
    },

    /**
     * Resize editor toolbar and template picker
     * @memberOf widgets/CostAnalysis/template-picker
     */
    resize: function () {
      var widgetBox, width;
      if (this.domNode) {
        widgetBox = html.getMarginBox(this.domNode);
        width = widgetBox.w;
        //resize only when width is greater than 0
        if (width > 0) {
          if (this._editor) {
            if (this._editor.templatePicker) {
              this._editor.templatePicker.update(true);
            }
          }
        }
      }
    },

    /**
    * Get all the selected features
    * @memberOf widgets/CostAnalysis/template-picker
    */
    _getSelectedFeatures: function (layers) {
      var selectedFeatures = [];
      array.forEach(layers, lang.hitch(this, function (layer) {
        var currentLayersSelectedFeatures = layer.getSelectedFeatures();
        //Check if layer has selected features
        if (currentLayersSelectedFeatures && currentLayersSelectedFeatures.length > 0) {
          //Loop through all the features and append in array
          array.forEach(currentLayersSelectedFeatures, lang.hitch(this, function (feature) {
            selectedFeatures.push(feature);
          }));
        }
      }));
      return selectedFeatures;
    },

    /**
     * Create draw tool to select features for copy
     */
    _createCustomSelectTool: function () {
      this.customToolbar = new Draw(this.map, {
        tooltipOffset: 10,
        drawTime: 90
      });
      this._toolBarActive = false;
      this.own(on(this.customToolbar, 'draw-complete', lang.hitch(this, function (evt) {
        var query = new Query();
        query.geometry = evt.geometry;
        var layerArray = this._getFilteredLayerAccToSelectedTemplate();
        this._editor._selectionHelper.selectFeatures(
          layerArray,
          query,
          FeatureLayer.SELECTION_NEW,
          lang.hitch(this, function () {
            var selectedFeatures = this._getSelectedFeatures(layerArray);
            if (selectedFeatures.length > 0) {
              //deactivate custom select tool
              this.customToolbar.deactivate();
              this._toolBarActive = false;
              //if copy features instance not found create it
              if (!this._copyFeaturesObj) {
                this._createCopyFeaturesInstance();
              }
              //Pass selected features to selectFeaturesToCopy method,
              //and allow user to choose among selctd features
              this._copyFeaturesObj.selectFeaturesToCopy(selectedFeatures);
            } else {
              this.appUtils.showMessage(this.nls.copyFeatures.noFeaturesSelectedMessage);
            }
          }));
      })));
    },

    /**
     * Creates instacne of copy-features dijit which allows user to choose
     * among selected features.
     */
    _createCopyFeaturesInstance: function () {
      this._copyFeaturesObj = new CopyFeatures({
        nls: this.nls,
        layerInfosObj: this.layerInfosObj,
        mainNode: this.selectFeaturesNode,
        appUtils: this.appUtils,
        map: this.map,
        widgetId: this.widgetId
      }, domConstruct.create("div", {}, this.selectFeaturesNode));
      //handel create-single-feature event and display copy asset msg
      this.own(on(this._copyFeaturesObj, "createSingleFeature",
        lang.hitch(this, function (allSelectedFeatures) {
          var singleFeature = this._createSingleGeometry(allSelectedFeatures);
          if (singleFeature) {
            this._featuresToBeCopied = [singleFeature];
            this._displayCopyAssetsPopup();
          }
        })));
      //handel create-multiple-features event and display copy asset msg
      this.own(on(this._copyFeaturesObj, "createMultipleFeatures",
        lang.hitch(this, function (allSelectedGeometries) {
          if (allSelectedGeometries && allSelectedGeometries.length > 0) {
            this._featuresToBeCopied = allSelectedGeometries;
            this._displayCopyAssetsPopup();
          }
        })));
      //handel create-multiple-features event and display copy asset msg
      this.own(on(this._copyFeaturesObj, "cancelBtnClicked", lang.hitch(this, function () {
        this._activateCustomSelectTool();
      })));
      this._copyFeaturesObj.startup();
    },

    /**
     * This function merge all the geometries and create only one single geometry.
     */
    _createSingleGeometry: function (allSelectedFeatures) {
      var singleFeature, geometryType;
      geometryType = allSelectedFeatures[0]._layer.geometryType;
      if (geometryType === "esriGeometryPolyline") {
        singleFeature = this._createSinglePolyline(allSelectedFeatures);
      } else if (geometryType === "esriGeometryPolygon") {
        singleFeature = this._createSinglePolygon(allSelectedFeatures);
      }
      return singleFeature;
    },

    /**
     * Creates only one sigle polyline form muitple features
     */
    _createSinglePolyline: function (allSelectedFeatures) {
      var polyline;
      polyline = new Polyline(
        new SpatialReference(allSelectedFeatures[0].geometry.spatialReference));
      array.forEach(allSelectedFeatures, lang.hitch(this, function (feature) {
        if (feature.geometry && feature.geometry.paths) {
          array.forEach(feature.geometry.paths, function (path) {
            polyline.addPath(path);
          });
        }

      }));
      return polyline;
    },

    /**
     * Creates only one sigle polygon form muitple features
     */
    _createSinglePolygon: function (allSelectedFeatures) {
      var polygon;
      polygon = new Polygon(
        new SpatialReference(allSelectedFeatures[0].geometry.spatialReference));
      array.forEach(allSelectedFeatures, lang.hitch(this, function (feature) {
        if (feature.geometry && feature.geometry.rings) {
          array.forEach(feature.geometry.rings, function (ring) {
            polygon.addRing(ring);
          });
        }
      }));
      return polygon;
    },

    /**
     * This function manages the state of buttons(select/sketch) &
     * activates the draw tool based on active mode
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _toggleToolState: function () {
      // If select tool is active else sketch tool is active
      if (!domClass.contains(this.selectButton, "esriCTSelectDisable")) {
        if (!this._toolBarActive) {
          this._toolBarActive = true;
          this._activateCustomSelectTool();
        } else {
          this._toolBarActive = false;
          this._activateTemplatePickerTool();
        }
      } else {
        this._toolBarActive = false;
        this._activateTemplatePickerTool();
      }
    },

    /**
     * This function is used to activate custom select tool
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _activateCustomSelectTool: function () {
      var selectedTemplate;
      selectedTemplate = this._editor.templatePicker.getSelected();
      this._editor._drawToolbar.deactivate();
      if (selectedTemplate) {
        this.customToolbar.activate(Draw.EXTENT);
      } else {
        this.customToolbar.deactivate();
      }
    },

    /**
     * This function is used to activate draw tool of selected feature template
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _activateTemplatePickerTool: function () {
      var selectedTemplate;
      selectedTemplate = this._editor.templatePicker.getSelected();
      this.customToolbar.deactivate();
      if (selectedTemplate) {
        this._editor._activateDrawToolbar(this._selectedTemplate);
      }
    },

    /**
     * This function is used to activate sketch button
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _activateSketchButton: function () {
      domClass.add(this.sketchButton, "esriCTSketchEnable");
      domClass.remove(this.sketchButton, "esriCTSketchDisable");
    },

    /**
     * This function is used to de-activate sketch button
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _deActivateSketchButton: function () {
      domClass.add(this.sketchButton, "esriCTSketchDisable");
      domClass.remove(this.sketchButton, "esriCTSketchEnable");
    },

    /**
     * This function is used to activate select button
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _activateSelectButton: function () {
      domClass.add(this.selectButton, "esriCTSelectEnable");
      domClass.remove(this.selectButton, "esriCTSelectDisable");
    },

    /**
     * This function is used to de-activate select button
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _deActivateSelectButton: function () {
      domClass.add(this.selectButton, "esriCTSelectDisable");
      domClass.remove(this.selectButton, "esriCTSelectEnable");
    },

    /**
     * This function is used to deactivate all the tools(select & sketch)
     * @memberOf widgets/CostAnalysis/template-picker
     */
    _deactivateAllTools: function () {
      this.customToolbar.deactivate();
      this._editor._drawToolbar.deactivate();
    }
  });
});