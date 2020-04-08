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
// jscs:disable validateIndentation
define([
  'dojo/_base/declare',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidgetSetting',
  'jimu/dijit/SimpleTable',
  'jimu/LayerInfos/LayerInfos',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/query',
  'dijit/registry',
  'dojo/_base/array',
  "./EditFields",
  "./EditDescription",
  "./SmartActionGroup",
  "../utils",
  'dijit/Editor',
  'dojo/dom-style',
  'dojo/dom-attr',
  'dojo/dom-class',
  'dojo/sniff',
  'jimu/utils',
  'dojo/_base/html',
  "jimu/dijit/_GeocodeServiceChooserContent",
  "jimu/dijit/Popup",
  "esri/request",
  "esri/lang",
  'jimu/dijit/Message',
  "jimu/dijit/LoadingShelter",
  'jimu/dijit/LoadingIndicator',
  'jimu/dijit/TabContainer3',
  'dojo/dom-construct',
  'dojo/promise/all',
  'dojo/Deferred',
  'jimu/portalUtils',
  './Intersection',
  './Coordinates',
  './Address',
  './Preset',
  '../presetBuilderBackwardCompatibility',
  'jimu/dijit/LayerChooserFromMap',
  'dijit/_editor/plugins/LinkDialog',
  'dijit/_editor/plugins/ViewSource',
  'dijit/_editor/plugins/FontChoice',
  'dojox/editor/plugins/Preview',
  'dijit/_editor/plugins/TextColor',
  'dojox/editor/plugins/ToolbarLineBreak',
  'dojox/editor/plugins/FindReplace',
  'dojox/editor/plugins/PasteFromWord',
  'dojox/editor/plugins/InsertAnchor',
  'dojox/editor/plugins/Blockquote',
  'dojox/editor/plugins/UploadImage',
  'jimu/dijit/EditorChooseImage',
  'jimu/dijit/EditorTextColor',
  'jimu/dijit/EditorBackgroundColor',
  'dijit/form/CheckBox',
  'jimu/dijit/RadioBtn'
],
  function (
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    Table,
    LayerInfos,
    lang,
    on,
    query,
    registry,
    array,
    EditFields,
    EditDescription,
    SmartActionGroup,
    editUtils,
    Editor,
    domStyle,
    domAttr,
    domClass,
    has,
    utils,
    html,
    _GeocodeServiceChooserContent,
    Popup,
    esriRequest,
    esriLang,
    Message,
    LoadingShelter,
    LoadingIndicator,
    TabContainer3,
    domConstruct,
    all,
    Deferred,
    portalUtils,
    Intersection,
    Coordinates,
    Address,
    Preset,
    presetBuilderBackwardCompatibility,
    LayerChooserFromMap
  ) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-smartEditor-setting',
      _jimuLayerInfos: null,
      _layersTable: null,
      _configInfos: null,
      _editFields: null,
      _currentTableIds: [],
      _currentConfigInfoInTable: null,
      _configuredGeocoderSettings: {},
      _configuredPresetInfos: {},
      _totalLayers: [],

      postMixInProperties: function () {
        //mixin default nls with widget nls
        this.nls.units = {};
        //mixin the units form jimu nls
        lang.mixin(this.nls.units, window.jimuNls.units);
      },

      postCreate: function () {
        this.nls = lang.mixin(this.nls, window.jimuNls.common);
        this.nls = lang.mixin(this.nls, window.jimuNls.timeUnit);
        this._configuredGeocoderSettings = {};
        this._configuredPresetInfos = {};
        this._currentTableIds = [];
        this._totalLayers = [];
        //init tabs for different configuration sections
        this._initTabs();
        //create layerchooser from map
        this._createLayerChooserFromMap();
      },

      _processConfig: function () {
        var configInfos;
        if (!this.config.editor.hasOwnProperty("presetInfos") &&
          this.config.editor.layerInfos) {
          configInfos = this.config.editor.layerInfos;
          array.forEach(configInfos, lang.hitch(this, function (configInfo) {
            configInfo.fieldValues = {};
            array.forEach(configInfo.fieldInfos, lang.hitch(this, function (fieldInfo) {
              var actionObj;
              //Check for "canPresetValue" key and handle it for backward compatibility
              if (fieldInfo.hasOwnProperty("canPresetValue") && fieldInfo.canPresetValue) {
                actionObj = [{
                  "actionName": "Intersection",
                  "enabled": false
                }, {
                  "actionName": "Address",
                  "enabled": false
                }, {
                  "actionName": "Coordinates",
                  "enabled": false
                }, {
                  "actionName": "Preset",
                  "enabled": true
                }];
                configInfo.fieldValues[fieldInfo.fieldName] = lang.clone(actionObj);
                this._configuredPresetInfos[fieldInfo.fieldName] = [];
              }
            }));
          }));
          //Update presetInfos object
          this.config.editor.presetInfos = this._configuredPresetInfos;
        }
        //Backward compatibility for the apps configured before 2.14 WAB
        //Update the preset based on fields to Preset Builder Groups
        presetBuilderBackwardCompatibility.createPresetGroups(this.config, this._jimuLayerInfos);
      },

      startup: function () {
        this.inherited(arguments);
        LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function (operLayerInfos) {
            this._jimuLayerInfos = operLayerInfos;
            //Process config for backward compatibility of preset
            this._processConfig();
            this._init();
            this.setConfig();
            this._initEditor();
          }));
      },

      destroy: function () {
        this._jimuLayerInfos = null;
        delete this._jimuLayerInfos;
        this._layersTable = null;
        delete this._layersTable;
        this._configInfos = null;
        delete this._configInfos;
        this._editFields = null;
        delete this._editFields;
        this._editDescriptions = null;
        delete this._editDescriptions;
        this.inherited(arguments);
      },

      _init: function () {
        this._initSettings();
        this._initLayersTable();
        //handle click event of add new smart action group button
        this.own(on(this.addNewSmartAction, "click", lang.hitch(this, function () {
          this._configureGroupSmartAction();
        })));
        //init smart actions group
        this._initsmartActionsTable();
        //init attribute actions group
        this._initAllAttributeActions();
      },

      /**
      * This function the initializes jimu tab for setting and layout
      **/
      _initTabs: function () {
        var layerSettingTab, generalSettingTab, smartActionsTab, attributeActionsTab, tabs;
        layerSettingTab = {
          title: this.nls.layersPage.layerSettings,
          content: this.layerSettingTabNode
        };
        smartActionsTab = {
          title: this.nls.layersPage.smartActionsTabTitle,
          content: this.smartActionsTabNode
        };

        attributeActionsTab = {
          title: this.nls.layersPage.attributeActionsTabTitle,
          content: this.attributeActionsTabNode
        };
        generalSettingTab = {
          title: this.nls.layersPage.generalSettings,
          content: this.generalSettingTabNode
        };
        tabs = [layerSettingTab, smartActionsTab, attributeActionsTab, generalSettingTab];
        this.tab = new TabContainer3({
          "tabs": tabs
        });
        // Handle tabChanged event and set the scroll position to top
        this.own(on(this.tab, "tabChanged", lang.hitch(this, function () {
          this.tab.containerNode.scrollTop = 0;
        })));
        this.tab.placeAt(this.tabDiv);
        //Handle geocoder settings button click evet
        this.own(on(this.geocoderSettings, "click", lang.hitch(this, function () {
          this._openServiceChooser(true);
        })));
      },

      _initLayersTable: function () {
        var fields = [{
          name: 'edit',
          title: this.nls.layersPage.layerSettingsTable.edit,
          type: 'checkbox',
          'class': 'editable'
        }, {
          name: 'label',
          title: this.nls.layersPage.layerSettingsTable.label,
          type: 'text',
          'class': 'layer'
        }, {
          name: 'allowUpdateOnly',
          title: this.nls.layersPage.layerSettingsTable.allowUpdateOnly,
          type: 'checkbox',
          'class': 'update'
        }, {
          name: 'allowDelete',
          title: this.nls.layersPage.layerSettingsTable.allowDelete,
          type: 'checkbox',
          'class': 'update'
        },
        {
          name: 'disableGeometryUpdate',
          title: this.nls.layersPage.layerSettingsTable.update,
          type: 'checkbox',
          'class': 'disable'
        },
        {
          name: 'specialType',
          type: "extension",
          title: this.nls.layersPage.layerSettingsTable.description,
          create: lang.hitch(this, this._createSpecialType),
          setValue: lang.hitch(this, this._setValue4SpecialType),
          getValue: lang.hitch(this, this._getValueOfSpecialType),
          'class': 'description'
        },
        {
          name: 'actions',
          title: this.nls.actions,
          type: 'actions',
          'class': 'actions',
          actions: ['edit']//'up','down',
        },
        {
          name: 'allowUpdateOnlyHidden',
          type: 'checkbox',
          hidden: true
        },
        {
          name: 'allowDeleteHidden',
          type: 'checkbox',
          hidden: true
        },
        {
          name: 'disableGeometryUpdateHidden',
          type: 'checkbox',
          hidden: true
        }];
        var args = {
          fields: fields,
          selectable: false
        };
        this._layersTable = new Table(args);
        this._layersTable.placeAt(this.tableLayerInfos);
        this._layersTable.startup();

        this._addBreadCrumb(this.nls.layersPage.allLayers, true);
        var nl = query("th.simple-table-field", this._layersTable.domNode);
        nl.forEach(function (node) {
          var scrubText = (node.innerText === undefined || node.innerText === "") ?
            "" : node.innerText.replace(/(\r\n|\n|\r)/gm, "");
          switch (scrubText) {
            case this.nls.layersPage.layerSettingsTable.edit:
              node.title = this.nls.layersPage.layerSettingsTable.editTip;
              node.alt = this.nls.layersPage.layerSettingsTable.editTip;
              break;
            case this.nls.layersPage.layerSettingsTable.label:
              node.title = this.nls.layersPage.layerSettingsTable.labelTip;
              node.alt = this.nls.layersPage.layerSettingsTable.labelTip;
              break;
            case this.nls.layersPage.layerSettingsTable.allowUpdateOnly:
              node.title = this.nls.layersPage.layerSettingsTable.allowUpdateOnlyTip;
              node.alt = this.nls.layersPage.layerSettingsTable.allowUpdateOnlyTip;
              break;
            case this.nls.layersPage.layerSettingsTable.allowDelete:
              node.title = this.nls.layersPage.layerSettingsTable.allowDeleteTip;
              node.alt = this.nls.layersPage.layerSettingsTable.allowDeleteTip;
              break;
            case this.nls.layersPage.layerSettingsTable.update:
              node.title = this.nls.layersPage.layerSettingsTable.updateTip;
              node.alt = this.nls.layersPage.layerSettingsTable.updateTip;
              break;
            case this.nls.layersPage.layerSettingsTable.description:
              node.title = this.nls.layersPage.layerSettingsTable.descriptionTip;
              node.alt = this.nls.layersPage.layerSettingsTable.descriptionTip;
              break;
            case this.nls.actions:
              node.title = this.nls.layersPage.layerSettingsTable.actionsTip;
              node.alt = this.nls.layersPage.layerSettingsTable.actionsTip;
              break;

          }

        }, this);

        this.own(on(this._layersTable,
          'actions-edit',
          lang.hitch(this, this._onEditFieldInfoClick)));
      },
      _createSpecialType: function (td) {
        var img = html.create('a', { 'class': 'attDescrip' }, td);
        this.own(on(img, 'click', lang.hitch(this, function () {
          this._onDescriptionClick(td.parentNode);
        })));
      },

      _setValue4SpecialType: function () {
        //var select = query('select', td)[0];
        //select.value = value;
      },

      _getValueOfSpecialType: function () {
        //var select = query('select', td)[0];
        //return select.value;
      },
      _initSettings: function () {
        //this.showDeleteButton.set('checked', this.config.editor.showDeleteButton);
        this.useFilterEditor.set('checked', this.config.editor.useFilterEditor);
        if (this.config.editor.hasOwnProperty("displayShapeSelector")) {
          this.displayShapeSelector.set('checked', this.config.editor.displayShapeSelector);
        }
        else {
          this.displayShapeSelector.set('checked', false);
        }

        if (this.config.editor.hasOwnProperty("createNewFeaturesFromExisting")) {
          this.createNewFeaturesFromExisting.set('checked', this.config.editor.createNewFeaturesFromExisting);
        }
        else {
          this.createNewFeaturesFromExisting.set('checked', false);
        }

        if (this.config.editor.hasOwnProperty("overrideDefaultsByCopiedFeature")) {
          this.overrideDefaultsByCopiedFeature.set('checked', this.config.editor.overrideDefaultsByCopiedFeature);
        }
        else {
          this.overrideDefaultsByCopiedFeature.set('checked', false);
        }

        this.own(on(this.createNewFeaturesFromExisting, 'click', lang.hitch(this, function () {
          //if createNewFeaturesFromExisting is unchecked then uncheck overrideDefaultsByCopiedFeature
          if (!this.createNewFeaturesFromExisting.get('checked')) {
            this.overrideDefaultsByCopiedFeature.set('checked', false);
          }
        })));

        this.own(on(this.overrideDefaultsByCopiedFeature, 'click', lang.hitch(this, function () {
          //if overrideDefaultsByCopiedFeature is checked then check createNewFeaturesFromExisting
          if (this.overrideDefaultsByCopiedFeature.get('checked')) {
            this.createNewFeaturesFromExisting.set('checked', true);
          }
        })));

        if (this.config.editor.hasOwnProperty("displayPresetTop")) {
          this.displayPresetTop.set('checked', this.config.editor.displayPresetTop);
        }
        else {
          this.displayPresetTop.set('checked', false);
        }
        this.displayPromptOnSave.set('checked', this.config.editor.displayPromptOnSave);
        this.displayPromptOnDelete.set('checked', this.config.editor.displayPromptOnDelete);
        this.removeOnSave.set('checked', this.config.editor.removeOnSave);
        if (this.config.editor.hasOwnProperty("listenToGF")) {
          this.listenToGF.set('checked', this.config.editor.listenToGF);
        }
        else {
          this.listenToGF.set('checked', false);
        }
        if (this.config.editor.hasOwnProperty("keepTemplateSelected")) {
          this.keepTemplateSelected.set('checked', this.config.editor.keepTemplateSelected);
        }
        else {
          this.keepTemplateSelected.set('checked', false);
        }
        if (this.config.editor.hasOwnProperty("editGeometryDefault")) {
          this.editGeometryDefault.set('checked', this.config.editor.editGeometryDefault);
        }
        else {
          this.editGeometryDefault.set('checked', false);
        }
        if (this.config.editor.hasOwnProperty("autoSaveEdits")) {
          this.autoSaveEdits.set('checked', this.config.editor.autoSaveEdits);
          //if(this.autoSaveEdits.get('checked')) {
          //  this.removeOnSave.set('checked', true);
          //}
        }
        else {
          this.autoSaveEdits.set('checked', false);
        }

        if (this.config.editor.hasOwnProperty("enableAttributeUpdates")) {
          this.enableAttributeUpdates.set('checked', this.config.editor.enableAttributeUpdates);
        }
        else {
          this.enableAttributeUpdates.set('checked', false);
        }

        this.own(on(this.autoSaveEdits, 'click', lang.hitch(this, function () {
          if (this.autoSaveEdits.get('checked')) {
            this.removeOnSave.set('checked', true);
          } else {
            this.removeOnSave.set('checked', false);
          }
        })));

        //this.clearSelectionOnClose.set('checked', false);

        if (this.config.editor.hasOwnProperty("enableAutomaticAttributeUpdates")) {
          this.enableAutomaticAttributeUpdates.set('checked', this.config.editor.enableAutomaticAttributeUpdates);
        }
        else {
          this.enableAutomaticAttributeUpdates.set('checked', false);
        }

        this.own(on(this.enableAttributeUpdates, 'click', lang.hitch(this, function () {
          //if enableAttributeUpdates is unchecked then uncheck automatic updates
          if (!this.enableAttributeUpdates.get('checked')) {
            this.enableAutomaticAttributeUpdates.set('checked', false);
          }
        })));

        this.own(on(this.enableAutomaticAttributeUpdates, 'click', lang.hitch(this, function () {
          //if automatic updates is checked then check enableAttributeUpdates
          if (this.enableAutomaticAttributeUpdates.get('checked')) {
            this.enableAttributeUpdates.set('checked', true);
          }
        })));

        if (this.config.editor.hasOwnProperty("enableLockingMapNavigation")) {
          this.enableLockingMapNavigation.set('checked', this.config.editor.enableLockingMapNavigation);
        }
        else {
          this.enableLockingMapNavigation.set('checked', false);
        }

        if (this.config.editor.hasOwnProperty("enableMovingSelectedFeatureToGPS")) {
          this.enableMovingSelectedFeatureToGPS.set('checked', this.config.editor.enableMovingSelectedFeatureToGPS);
        }
        else {
          this.enableMovingSelectedFeatureToGPS.set('checked', false);
        }

        if (this.config.editor.hasOwnProperty("enableMovingSelectedFeatureToXY")) {
          this.enableMovingSelectedFeatureToXY.set('checked', this.config.editor.enableMovingSelectedFeatureToXY);
        }
        else {
          this.enableMovingSelectedFeatureToXY.set('checked', false);
        }

        if (this.config.editor.hasOwnProperty("showActionButtonsAbove")) {
          this.positionOfSaveButtonBelow.set('checked', !this.config.editor.showActionButtonsAbove);
        }
        else {
          this.positionOfSaveButtonBelow.set('checked', true);
        }

        if (this.config.editor.hasOwnProperty("showActionButtonsAbove")) {
          this.positionOfSaveButtonAbove.set('checked', this.config.editor.showActionButtonsAbove);
        }
        else {
          this.positionOfSaveButtonAbove.set('checked', false);
        }

        if (this.config.editor.hasOwnProperty("canSwitchToMultilineInput")) {
          this.switchToMultilineInput.set('checked', this.config.editor.canSwitchToMultilineInput);
        }
        else {
          this.switchToMultilineInput.set('checked', false);
        }
      },

      setConfig: function () {
        //create and show loading indicator on load
        var loading = new LoadingIndicator({ hidden: false }).placeAt(this.tableInfosLoading);
        //fetch orgs first geocoder
        this._fetchDefaultGeocoder().then(lang.hitch(this, function (defaultGeocoder) {
          //Get table infos so that all the tables layer objects are loaded
          //This will help in getting the capablities and other layer infos
          this._getTableInfos().then(lang.hitch(this, function () {
            this._configInfos = editUtils.getConfigInfos(this._jimuLayerInfos,
              this.config.editor.layerInfos, false, false);
            var prevConfiguredLayerIds = {};
            //Get previously configured layer ids and thier editable state
            if (this.config.editor.layerInfos &&
              this.config.editor.layerInfos.length > 0) {
              array.forEach(this.config.editor.layerInfos, function (configInfo) {
                //for backward compatibility as we were not storing _editFlag in prev versions
                if (!configInfo.hasOwnProperty('_editFlag')) {
                  configInfo._editFlag = true;
                }
                prevConfiguredLayerIds[configInfo.featureLayer.id] = configInfo._editFlag;
              });
              array.forEach(this._configInfos, function (configInfo) {
                //if the current layer id is available in previously configured layer
                //then set the edit flag using prev value, if not found then set to false
                if (prevConfiguredLayerIds.hasOwnProperty(configInfo.featureLayer.id)) {
                  configInfo._editFlag = prevConfiguredLayerIds[configInfo.featureLayer.id];
                } else {
                  configInfo._editFlag = false;
                }
              });
            }

            //In order to work with smart action group
            //thier must be an fieldValidation object available
            array.forEach(this._configInfos, function (configInfo) {
              if (!configInfo.fieldValidations) {
                configInfo.fieldValidations = {};
              }
            });

            //set previously configured geocoder settings
            if (this.config.geocoderSettings) {
              this._configuredGeocoderSettings = lang.clone(this.config.geocoderSettings);
            } else {
              //if no geocoder settings available use first geocoder from orgs geocoders list
              this._configuredGeocoderSettings = defaultGeocoder;
            }
            //set previously configured preset infos
            if (this.config.editor.presetInfos) {
              this._configuredPresetInfos = lang.clone(this.config.editor.presetInfos);
            } else {
              this._configuredPresetInfos = {};
            }
            //set current config as all layers config on load
            this._currentConfigInfoInTable = this._configInfos;
            this._setLayersTable(this._configInfos, false);
            //if have previously set default tolerance settings then use those values
            if (this.config.editor.defaultToleranceSettings) {
              this.globalTolerance.set("value", this.config.editor.defaultToleranceSettings.value);
              this.globalToleranceUnit.set("value", this.config.editor.defaultToleranceSettings.unit);
            } else {
              this.globalTolerance.set("value", 0);
              this.globalToleranceUnit.set("value", 'meters');
            }
            //if have previously set default pixels tolerance then use it
            if (this.config.editor.hasOwnProperty("defaultPixelsTolerance")) {
              this.globalPixelsTolerance.set("value", this.config.editor.defaultPixelsTolerance);
            }
            //Set previous value for textbox
            if (this.config.editor.maxLimitToMultilineTextBox ||
              this.config.editor.maxLimitToMultilineTextBox === 0) {
              this.maxCharacter.set("value", this.config.editor.maxLimitToMultilineTextBox);
            } else {
              this.maxCharacter.set("value", 35);
            }
            setTimeout(lang.hitch(this, function () {
              this.resize();
              //destroy loading indicator
              loading.destroy();
            }), 200);
          }));
        }));
      },

      _fetchOrgsHelperServiecs: function () {
        var def = new Deferred();
        //check whether portal url is available then try to fetch helper services
        if (this.appConfig.portalUrl && lang.trim(this.appConfig.portalUrl) !== "") {
          //get portal info to fetch geometry service Url
          portalUtils.getPortalSelfInfo(this.appConfig.portalUrl).then(lang.hitch(
            this,
            function (portalInfo) {
              // get helper-services from portal object
              var helperServices = portalInfo && portalInfo.helperServices;
              var geocodeURL = "";
              //use first geocode service from the org
              if (helperServices && helperServices.geocode && helperServices.geocode.length > 0 &&
                helperServices.geocode[0].url) {
                geocodeURL = helperServices.geocode[0].url;
              }
              def.resolve(geocodeURL);
            }), lang.hitch(this, function () {
              def.resolve("");
            }));
        } else {
          def.resolve("");
        }
        return def.promise;
      },

      _fetchDefaultGeocoder: function () {
        var def = new Deferred();
        this._fetchOrgsHelperServiecs().then(lang.hitch(this, function (geocodeURL) {
          var defaultGeocoderSettings = {};
          esriRequest({
            url: geocodeURL,
            content: {
              f: 'json'
            },
            handleAs: 'json',
            callbackParamName: 'callback'
          }).then(lang.hitch(this, function (response) {
            if (response && response.candidateFields) {
              defaultGeocoderSettings.url = geocodeURL;
              defaultGeocoderSettings.fields = lang.clone(response.candidateFields);
            }
            def.resolve(defaultGeocoderSettings);
          }), lang.hitch(this, function () {
            def.resolve(defaultGeocoderSettings);
          }));
        }));
        return def.promise;
      },

      _getTableInfos: function () {
        var defs = [];
        var tableInfoArray = this._jimuLayerInfos.getTableInfoArray();
        array.forEach(tableInfoArray, function (jimuTableInfo) {
          defs.push(jimuTableInfo.getLayerObject());
        }, this);
        return all(defs);
      },

      /*
      _hasMOrZValue: function (layerInfo) {
        if (layerInfo &&
          (layerInfo.hasZ ||
            (layerInfo.hasM && !layerInfo.allowUpdateWithoutMValues))) {
          return true;
        }
        return false;
      },
      */

      _setLayersTable: function (configuredLayerInfos, isRelatedInfo) {
        var nl = null, isAtLeastOneTable = false;
        if (isRelatedInfo) {
          //if showing layers list for related layers/table
          //update object ref in this._configInfos so the editField settings will be stored properly
          if (this._currentTableIds && this._currentTableIds.length > 0) {
            var currentConfig;
            currentConfig = this._configInfos;
            array.forEach(this._currentTableIds, function (layerId, index) {
              array.some(currentConfig, function (info) {
                if (info.featureLayer.id === layerId) {
                  currentConfig = info;
                  return true;
                }
              });
              //if current table is not of all-layers and the index is not last then consider the next relations
              if (this._currentTableIds.length > 1 && index + 1 < this._currentTableIds.length) {
                currentConfig = currentConfig.relationshipInfos;
              }
            }, this);
            //set the relation infos for the appropriate layer/table
            currentConfig.relationshipInfos = configuredLayerInfos;
          }
        }
        //set current config which will be used to store the configuration settings regarding layers
        this._currentConfigInfoInTable = configuredLayerInfos;
        //loop through each layer info and add row in the table
        array.forEach(configuredLayerInfos, function (configInfo) {
          var tdEdit;
          //var hasMOrZ;
          //hasMOrZ = this._hasMOrZValue(configInfo.layerInfo.layerObject);
          var addRowResult = this._layersTable.addRow({
            label: configInfo.layerInfo.title,
            edit: configInfo._editFlag ? true : false,
            allowUpdateOnly: configInfo.allowUpdateOnly,
            allowUpdateOnlyHidden: configInfo.allowUpdateOnly === null ?
              false : configInfo.allowUpdateOnly,
            allowDelete: configInfo.allowDelete,
            allowDeleteHidden: configInfo.allowDelete === null ?
              false : configInfo.allowDelete,
            //if showing related info disable geometry editing
            disableGeometryUpdate: isRelatedInfo ? true : configInfo.disableGeometryUpdate,
            //disableGeometryUpdate: (isRelatedInfo || hasMOrZ) ? true : configInfo.disableGeometryUpdate,
            disableGeometryUpdateHidden: configInfo.disableGeometryUpdate === null ?
              false : configInfo.disableGeometryUpdate
          });
          //Check if at least one related item is table and accordingly update the flag
          if (configInfo.layerInfo.isTable) {
            isAtLeastOneTable = true;
          }
          //Add ref to configInfo in each row
          addRowResult.tr._configInfo = configInfo;
          //add layer id to uniquely identify the row
          addRowResult.tr._layerId = configInfo.layerInfo.layerObject.id;
          if (configInfo.featureLayer.layerAllowsDelete === false) {
            nl = query(".allowDelete", addRowResult.tr);
            nl.forEach(function (node) {

              var widget = registry.getEnclosingWidget(node.childNodes[0]);

              widget.setStatus(false);
            });
          }
          if (configInfo.featureLayer.layerAllowsCreate === false) {
            nl = query(".allowUpdateOnly", addRowResult.tr);
            nl.forEach(function (node) {

              var widget = registry.getEnclosingWidget(node.childNodes[0]);

              widget.setStatus(false);
            });
          }
          //fetch update only check boxes
          nl = query(".allowUpdateOnly", addRowResult.tr);
          nl.forEach(function (node) {
            var widget = registry.getEnclosingWidget(node.childNodes[0]);
            if (configInfo.featureLayer.layerAllowsUpdate === false) {
              widget.setStatus(false);
            }
            //if related item is accessed and it is layer, then disable and check the checkbox
            if (isRelatedInfo && !configInfo.layerInfo.isTable) {
              widget.setValue(true);
              widget.setStatus(false);
            }
          });

          //fetch disable geometry check boxes
          nl = query(".disableGeometryUpdate", addRowResult.tr);
          nl.forEach(function (node) {
            var widget = registry.getEnclosingWidget(node.childNodes[0]);
            if (configInfo.featureLayer.layerAllowGeometryUpdates === false) {
              widget.setStatus(false);
            }
            //if (isRelatedInfo || hasMOrZ) {
            if (isRelatedInfo) {
              widget.setValue(true);
              widget.setStatus(false);
            }
          });

          //if layer don't allow updating & creating of features
          //disable editable & geometryUpdate checkbox
          if (configInfo.featureLayer.layerAllowsUpdate === false &&
            configInfo.featureLayer.layerAllowsCreate === false) {
            nl = query(".edit, .disableGeometryUpdate", addRowResult.tr);
            nl.forEach(function (node) {
              var widget = registry.getEnclosingWidget(node.childNodes[0]);
              widget.setValue(false);
              widget.setStatus(false);
            });
          }
          //Geometry update is disabled for related tables then disable the parent checkbox also
          var thCbx = this._layersTable._getThCheckBox("disableGeometryUpdate");
          if (thCbx) {
            if (isRelatedInfo) {
              thCbx.setValue(false);
              thCbx.setStatus(false);
            } else {
              thCbx.setStatus(true);
            }
          }
          //Show warning icon if related item is layer
          if (isRelatedInfo && !configInfo.layerInfo.isTable) {
            var checkBoxRow = query(".edit, .editable", addRowResult.tr)[0];
            var warningIcon = domConstruct.create("div", {
              "class": "warningIcon",
              "style": "display:none",
              "title": this.nls.layersPage.layerSettingsTable.allowUpdateOnly
            });
            domConstruct.place(warningIcon, checkBoxRow, "first");
            var widget = registry.getEnclosingWidget(checkBoxRow.childNodes[1]);
            //control the visibility of warning icon based on checkbox
            this.own(on(widget, "change", lang.hitch(this, function (checked) {
              if (checked) {
                domStyle.set(warningIcon, "display", "block");
              } else {
                domStyle.set(warningIcon, "display", "none");
              }
            })));
            if (configInfo._editFlag === true) {
              domStyle.set(warningIcon, "display", "block");
            }
          }
          var relationshipInfo;
          //if relation info is not configured then create default relation info
          //else use the configured one
          if (!configInfo.relationshipInfos || configInfo.relationshipInfos.length === 0) {
            //get relation info
            relationshipInfo = this._getRelatedTableInfo(configInfo.layerInfo.layerObject);
            configInfo.relationshipInfos = relationshipInfo;
            //also by default set edit flag to false for related layers/table
            array.forEach(configInfo.relationshipInfos, function (configInfo) {
              configInfo._editFlag = false;
            });
          } else {
            relationshipInfo = configInfo.relationshipInfos;
          }

          //if has valid relations show table icon in the last col
          if (relationshipInfo.length > 0) {
            //if related layer/table dont have layer info call getConfigInfos method to add layer infos
            if (!relationshipInfo[0].layerInfo) {
              //updates the relation infos
              relationshipInfo = editUtils.getConfigInfos(this._jimuLayerInfos,
                relationshipInfo, false, true, true);
              //if edit flag not found in related layers/table add & set it to false
              array.forEach(configInfo.relationshipInfos, function (configInfo) {
                if (!configInfo.hasOwnProperty("_editFlag")) {
                  configInfo._editFlag = false;
                }
              });
            }
            //Now add the icon in last col to access the related layer/tables
            this._addTableFieldActionIcon(addRowResult.tr, relationshipInfo);
          }
          // set tooltip for edit icon
          tdEdit = query('.jimu-icon-edit', addRowResult.tr)[0];
          tdEdit.title = this.nls.layersPage.layerSettingsTable.fieldsTip;
          //check if all the related items are layer, if yes then disable
          //the "Allow Updates" header checkbox
          var allowUpdatesHeaderChkBox = this._layersTable._getThCheckBox("allowUpdateOnly");
          if (allowUpdatesHeaderChkBox) {
            //If all the related items are of type layer then disable "Allow Updates" checkbox
            if (isRelatedInfo && !isAtLeastOneTable) {
              allowUpdatesHeaderChkBox.setValue(false);
              allowUpdatesHeaderChkBox.setStatus(false);
            } else {
              allowUpdatesHeaderChkBox.setStatus(true);
            }
          }
        }, this);
      },

      _onDescriptionClick: function (tr) {
        var rowData = this._layersTable.getRowData(tr);
        if (rowData && rowData.edit) {
          this._editDescriptions = new EditDescription({
            nls: this.nls,
            _configInfo: tr._configInfo,
            _layerName: rowData.label
          });
          this._editDescriptions.popupEditDescription();
        }
      },
      _onEditFieldInfoClick: function (tr) {
        var rowData = this._layersTable.getRowData(tr);
        if (rowData && rowData.edit) {
          this._editFields = new EditFields({
            nls: this.nls,
            _configInfo: tr._configInfo,
            _layerName: rowData.label,
            _geocoderSettings: this._configuredGeocoderSettings,
            _configuredPresetInfos: this._configuredPresetInfos,
            layerInfos: this._jimuLayerInfos,
            isRelatedLayer: this._currentTableIds.length >= 1 ? true : false,
            map: this.map,
            _smartActionsTable: this._smartActionsTable,
            _attributeActionsTable: {
              "Intersection": this._intersectionActionGroupTable,
              "Address": this._addressActionGroupTable,
              "Coordinates": this._coordinatesActionGroupTable,
              "Preset": this._presetActionGroupTable
            },
            _tab: this.tab
          });
          this._editFields.popupEditPage();
          this.own(on(this._editFields, "SetGeocoder", lang.hitch(this, this._openServiceChooser)));
          this.own(on(this._editFields, "RemoveFromGroup", lang.hitch(this, function (info) {
            //remove entries for fields form respective groups
            if (info) {
              //remove all entries from smart action group
              array.forEach(info.smartActionGroupInfo, function (saInfo) {
                this._removeFromGroup(saInfo);
              }, this);
              //remove all entries from attribute action group
              array.forEach(info.attributeActionGroupInfo, function (aaInfo) {
                this._removeFromAttributeActionGroup(aaInfo);
              }, this);
            }
          })));
        }
        else {
          new Message({
            message: this.nls.layersPage.editFieldError
          });
        }
      },

      _getText: function () {
        var editorText;
        editorText = this._editorObj.focusNode.innerHTML;
        return editorText;
      },
      _initEditor: function () {

        if (!this._editorObj) {
          this._initEditorPluginsCSS();
          this._editorObj = new Editor({
            plugins: [
              'bold', 'italic', 'underline',
              utils.getEditorTextColor("smartEditor"), utils.getEditorBackgroundColor("smartEditor"),
              '|', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
              '|', 'insertOrderedList', 'insertUnorderedList', 'indent', 'outdent'
            ],
            extraPlugins: [
              '|', 'createLink', 'unlink', 'pastefromword', '|', 'undo', 'redo',
              '|', 'viewSource','toolbarlinebreak',//'chooseImage', 'uploadImage',
              {
                name: "dijit._editor.plugins.FontChoice",
                command: "fontName",
                custom: "Arial;Comic Sans MS;Courier New;Garamond;Tahoma;Times New Roman;Verdana".split(";")
              }, 'fontSize', 'formatBlock'
            ],
            style: "font-family:Verdana;"
          }, this.editorDescription);
          domStyle.set(this._editorObj.domNode, {
            "width": '100%',
            "height": '100%'
          });

          if (this.config.editor.editDescription === undefined || this.config.editor.editDescription === null) {
            this._editorObj.set("value", this.nls.layersPage.title);
          }
          else {
            this._editorObj.set("value", this.config.editor.editDescription);
          }
          this._editorObj.startup();
          if (has('ie') !== 8) {
            this._editorObj.resize({
              w: '100%',
              h: '100%'
            });
          } else {
            var box = html.getMarginBox(this.editorDescription);
            this._editorObj.resize({
              w: box.w,
              h: box.h
            });
          }
        }
      },
      /**
      * this function loads the editor tool plugins CSS
      **/
      _initEditorPluginsCSS: function () {
        var head, tcCssHref, tcCss, epCssHref, epCss, pfCssHref, pfCss;
        head = document.getElementsByTagName('head')[0];
        tcCssHref = window.apiUrl + "dojox/editor/plugins/resources/css/TextColor.css";
        tcCss = query('link[href="' + tcCssHref + '"]', head)[0];
        if (!tcCss) {
          utils.loadStyleLink("editor_plugins_resources_TextColor", tcCssHref);
        }
        epCssHref = window.apiUrl + "dojox/editor/plugins/resources/editorPlugins.css";
        epCss = query('link[href="' + epCssHref + '"]', head)[0];
        if (!epCss) {
          utils.loadStyleLink("editor_plugins_resources_editorPlugins", epCssHref);
        }
        pfCssHref = window.apiUrl + "dojox/editor/plugins/resources/css/PasteFromWord.css";
        pfCss = query('link[href="' + pfCssHref + '"]', head)[0];
        if (!pfCss) {
          utils.loadStyleLink("editor_plugins_resources_PasteFromWord", pfCssHref);
        }
      },

      _resetSettingsConfig: function () {
        this.config.editor.displayPromptOnSave =
          this.displayPromptOnSave.checked === undefined ?
            false : this.displayPromptOnSave.checked;
        this.config.editor.displayPromptOnDelete =
          this.displayPromptOnDelete.checked === undefined ?
            false : this.displayPromptOnDelete.checked;
        this.config.editor.removeOnSave =
          this.removeOnSave.checked === undefined ?
            false : this.removeOnSave.checked;
        this.config.editor.canSwitchToMultilineInput =
          this.switchToMultilineInput.checked === undefined ?
            false : this.switchToMultilineInput.checked;

        this.config.editor.useFilterEditor =
          this.useFilterEditor.checked === undefined ?
            false : this.useFilterEditor.checked;

        this.config.editor.displayShapeSelector =
          this.displayShapeSelector.checked === undefined ?
            false : this.displayShapeSelector.checked;

        this.config.editor.createNewFeaturesFromExisting =
          this.createNewFeaturesFromExisting.checked === undefined ?
            false : this.createNewFeaturesFromExisting.checked;

        this.config.editor.overrideDefaultsByCopiedFeature =
            this.overrideDefaultsByCopiedFeature.checked === undefined ?
              false : this.overrideDefaultsByCopiedFeature.checked;

        this.config.editor.displayPresetTop =
          this.displayPresetTop.checked === undefined ?
            false : this.displayPresetTop.checked;
        this.config.editor.listenToGF =
          this.listenToGF.checked === undefined ?
            false : this.listenToGF.checked;

        this.config.editor.keepTemplateSelected =
          this.keepTemplateSelected.checked === undefined ?
            false : this.keepTemplateSelected.checked;

        this.config.editor.editGeometryDefault =
          this.editGeometryDefault.checked === undefined ?
            false : this.editGeometryDefault.checked;

        this.config.editor.autoSaveEdits =
          this.autoSaveEdits.checked === undefined ?
            false : this.autoSaveEdits.checked;

        this.config.editor.enableAttributeUpdates =
          this.enableAttributeUpdates.checked === undefined ?
            false : this.enableAttributeUpdates.checked;

        this.config.editor.enableAutomaticAttributeUpdates =
          this.enableAutomaticAttributeUpdates.checked === undefined ?
            false : this.enableAutomaticAttributeUpdates.checked;

        this.config.editor.enableLockingMapNavigation =
          this.enableLockingMapNavigation.checked === undefined ?
            false : this.enableLockingMapNavigation.checked;

        this.config.editor.enableMovingSelectedFeatureToGPS =
          this.enableMovingSelectedFeatureToGPS.checked === undefined ?
            false : this.enableMovingSelectedFeatureToGPS.checked;

        this.config.editor.enableMovingSelectedFeatureToXY =
          this.enableMovingSelectedFeatureToXY.checked === undefined ?
            false : this.enableMovingSelectedFeatureToXY.checked;


        this.config.editor.showActionButtonsAbove =
          this.positionOfSaveButtonAbove.checked ?
            true : false;
      },

      _getConfigForCurrentDisplayedLayers: function () {
        if (!this._currentConfigInfoInTable) {
          return;
        }
        var layersTableData = this._layersTable.getData();
        array.forEach(this._currentConfigInfoInTable, function (configInfo, index) {
          configInfo._editFlag = layersTableData[index].edit;
          configInfo.allowUpdateOnly = (layersTableData[index].allowUpdateOnly === null ?
            layersTableData[index].allowUpdateOnlyHidden : layersTableData[index].allowUpdateOnly);
          configInfo.allowDelete = (layersTableData[index].allowDelete === null ?
            layersTableData[index].allowDeleteHidden : layersTableData[index].allowDelete);
          configInfo.disableGeometryUpdate =
            (layersTableData[index].disableGeometryUpdate === null ?
              layersTableData[index].disableGeometryUpdateHidden :
              layersTableData[index].disableGeometryUpdate);
        }, this);
      },

      _getCurrentConfigInfo: function (configInfos) {
        var checkedLayerInfos = [];
        array.forEach(configInfos, function (configInfo) {
          if (configInfo.hasOwnProperty("featureLayer")) {
            if (configInfo.featureLayer.hasOwnProperty("layerAllowsCreate")) {
              delete configInfo.featureLayer.layerAllowsCreate;
            }
            if (configInfo.featureLayer.hasOwnProperty("layerAllowsUpdate")) {
              delete configInfo.featureLayer.layerAllowsUpdate;
            }
            if (configInfo.featureLayer.hasOwnProperty("layerAllowsDelete")) {
              delete configInfo.featureLayer.layerAllowsDelete;
            }
            if (configInfo.featureLayer.hasOwnProperty("layerAllowGeometryUpdates")) {
              delete configInfo.featureLayer.layerAllowGeometryUpdates;
            }
          }
          configInfo.fieldInfos = this._resetFieldInfos(configInfo.fieldInfos);
          if (configInfo.hasOwnProperty("fieldValidations")) {
            for (var k in configInfo.fieldValidations) {
              if (configInfo.fieldValidations.hasOwnProperty(k)) {
                array.forEach(configInfo.fieldValidations[k], function (fieldValidation) {
                  if (fieldValidation.hasOwnProperty("expression")) {
                    delete fieldValidation.expression;
                  }
                });

              }
            }
          }
          if (configInfo.layerInfo) {
            delete configInfo.layerInfo;
          }
          //now push all the layers regardless of editable or not
          checkedLayerInfos.push(configInfo);
          //If has valid relationshipInfos then get config info for related items as well
          if (configInfo.relationshipInfos && configInfo.relationshipInfos.length > 0) {
            configInfo.relationshipInfos =
              this._getCurrentConfigInfo(configInfo.relationshipInfos);
          }
        }, this);
        return checkedLayerInfos;
      },

      getConfig: function () {
        //validate defalut tolerance settings
        if (!this.globalTolerance.isValid()) {
          new Message({
            message: this.nls.layersPage.toleranceErrorMsg
          });
          return false;
        }
        //validate defalut pixels tolerance settings
        if (!this.globalPixelsTolerance.isValid()) {
          new Message({
            message: this.nls.layersPage.pixelsToleranecErrorMsg
          });
          return false;
        }
        //validate max character limit
        if(!this.maxCharacter.isValid() || isNaN(this.maxCharacter.get("value"))){
          new Message({
            message: this.nls.layersPage.invalidMaxCharacterErrorMsg
          });
          return false;
        }
        this._resetSettingsConfig();
        //Store editDescription text
        this.config.editor.editDescription = this._getText();
        //Store defalut tolerance settings
        this.config.editor.defaultToleranceSettings = {
          "value": this.globalTolerance.getValue(),
          "unit": this.globalToleranceUnit.getValue()
        };
        //Store default pixels tolerance value
        this.config.editor.defaultPixelsTolerance = this.globalPixelsTolerance.get("value");
        //Store the max limit for switching between text box to textarea
        this.config.editor.maxLimitToMultilineTextBox = this.maxCharacter.getValue();
        //first get the settings from current displayed layer/tables
        this._getConfigForCurrentDisplayedLayers();
        // get layerInfos config
        var checkedLayerInfos = this._getCurrentConfigInfo(this._configInfos);
        if (checkedLayerInfos.length === 0) {
          new Message({
            message: this.nls.layersPage.noConfigedLayersError
          });
          return false;
        } else {
          this.config.editor.layerInfos = checkedLayerInfos;
        }
        //store geocoder settings
        if (this._configuredGeocoderSettings && this._configuredGeocoderSettings.hasOwnProperty("url")) {
          this.config.geocoderSettings = lang.clone(this._configuredGeocoderSettings);
        } else {
          this.config.geocoderSettings = null;
        }
        //store prest infos in config
        //TODO: remove _configuredPresetInfos completely
        // if (this._configuredPresetInfos) {
        //   this.config.editor.presetInfos = lang.clone(this._configuredPresetInfos);
        // } else {
           this.config.editor.presetInfos = {};
        // }
        //store smartActions Group
        this.config.smartActionGroups = this._getSmartActionGroupConfig();
        return this.config;
      },

      _resetFieldInfos: function (fieldInfos) {
        return array.map(fieldInfos, function (fieldInfo) {
          var fldInfo = {};
          fldInfo.fieldName = fieldInfo.fieldName === undefined ? '' : fieldInfo.fieldName;
          fldInfo.isEditable = fieldInfo.isEditable === undefined ? true : fieldInfo.isEditable;
          fldInfo.visible = fieldInfo.visible === undefined ? true : fieldInfo.visible;
          return fldInfo;
        });
      },

      /**
       * Function to get layer/table info of the related items
       * @memberOf setting/Settings
       **/
      _getRelatedTableInfo: function (layer) {
        var tableInfos = [], baseURL, relationships, relationShipsWithoutDestination;
        if (layer) {
          //get base url of the layer/table
          baseURL = layer.url.substr(0, layer.url.lastIndexOf('/') + 1);
          //get relationships of the layer
          relationships = lang.clone(layer.relationships);
          //consider only those relationships where the role is not esriRelRoleDestination
          relationShipsWithoutDestination = array.filter(relationships,
            function (relationInfo) {
              return relationInfo.role !== "esriRelRoleDestination";
            });
          //get layer Or table info of the related items
          array.forEach(relationShipsWithoutDestination, lang.hitch(this, function (table) {
            var foundInTables = false;
            //first check in tables if not found in tables search in layers
            array.forEach(this.map.webMapResponse.itemInfo.itemData.tables,
              lang.hitch(this, function (tableData) {
                var jimuTableInfo, fieldValidations, fieldValues;
                //once the url matches get its layer/table info using _jimuLayerInfos
                if (tableData && tableData.url &&
                  tableData.url.replace(/.*?:\/\//g, "") ===
                  (baseURL + table.relatedTableId).replace(/.*?:\/\//g, "")) {
                  jimuTableInfo = this._jimuLayerInfos.getLayerOrTableInfoById(tableData.id);
                  if (jimuTableInfo) {
                    jimuTableInfo = editUtils.getConfigInfo(jimuTableInfo, {});
                    jimuTableInfo.relationshipId = table.id;
                    fieldValidations = this._getSmartActionsForRelation(jimuTableInfo.featureLayer.id);
                    if (!fieldValidations) {
                      fieldValidations = {};
                    }
                    jimuTableInfo.fieldValidations = fieldValidations;
                    fieldValues = this._getAttributeActionsForRelation(jimuTableInfo.featureLayer.id);
                    if (!fieldValues) {
                      fieldValues = {};
                    }
                    jimuTableInfo.fieldValues = fieldValues;
                    tableInfos.push(jimuTableInfo);
                    foundInTables = true;
                  }
                }
              }));
            if (!foundInTables) {
              array.forEach(this.map.webMapResponse.itemInfo.itemData.operationalLayers,
                lang.hitch(this, function (layerData) {
                  var jimuLayerInfo, fieldValidations, fieldValues;
                  //once the url matches get its layer/table info using _jimuLayerInfos
                  if (layerData && layerData.url &&
                    layerData.url.replace(/.*?:\/\//g, "") ===
                    (baseURL + table.relatedTableId).replace(/.*?:\/\//g, "")) {
                    jimuLayerInfo = this._jimuLayerInfos.getLayerOrTableInfoById(layerData.id);
                    if (jimuLayerInfo) {
                      jimuLayerInfo = editUtils.getConfigInfo(jimuLayerInfo, {});
                      jimuLayerInfo.relationshipId = table.id;
                      fieldValidations =
                        this._getSmartActionsForRelation(jimuLayerInfo.featureLayer.id);
                      if (!fieldValidations) {
                        fieldValidations = {};
                      }
                      jimuLayerInfo.fieldValidations = fieldValidations;
                      fieldValues = this._getAttributeActionsForRelation(jimuLayerInfo.featureLayer.id);
                      if (!fieldValues) {
                        fieldValues = {};
                      }
                      jimuLayerInfo.fieldValues = fieldValues;
                      tableInfos.push(jimuLayerInfo);
                    }
                  }
                }));
            }
          }));
        }
        return tableInfos;
      },

      /**
       * Function to add table field icon in actions column
       * @memberOf setting/Settings
       **/
      _addTableFieldActionIcon: function (tableRow, relationshipInfo) {
        var tableFieldRowtd, tdEdit, actionFieldColumn;
        tableFieldRowtd = query('.action-item-parent', tableRow)[0];
        tdEdit = query('.jimu-icon-edit', tableRow)[0];
        if (query(".action-item-parent", tableRow)[0]) {
          domStyle.set(query(".action-item-parent", tableRow)[0], "width", "60px");
        }
        actionFieldColumn = query('.actions-td.simple-table-cell', tableRow);
        tableRow.tableFieldDiv = domConstruct.create("div", {
          'class': "action-item jimu-float-leading row-edit-div jimu-icon table-field-icon",
          title: this.nls.layersPage.layerSettingsTable.relationTip
        }, tableFieldRowtd);
        domConstruct.place(tableRow.tableFieldDiv, tdEdit, "after");
        this.own(on(tableRow.tableFieldDiv, 'click',
          lang.hitch(this, function () {
            //get row data for the current showing layer(Parent)
            var selectedRowData = this._layersTable.getRowData(tableRow);
            //first save the settings for current displayed layer/tables(Parent)
            this._getConfigForCurrentDisplayedLayers();
            //add bread crumb for current selected layer/table title
            this._addBreadCrumb(selectedRowData.label);
            //push current table/layers(Parent) id so that it can be used for bread crumbs
            this._currentTableIds.push(tableRow._layerId);
            //clear currently showing layers table
            //so that related layer/tables of the selected parent layer can be shown
            this._layersTable.clear();
            //update both smart actions and attribute actions according to groups
            this._updateValidationsAccordingToGroups(relationshipInfo);
            //show related layers & tables of the selected parent layer
            this._setLayersTable(relationshipInfo, true);
          })));
      },

      _updateValidationsAccordingToGroups: function (relationshipInfo) {
        var currentConfig, currentRelationshipInfos;
        //get the config info of the selected breadcrumb and
        //get the currentConfig of the layer/table to which we are navigating
        if (this._currentTableIds && this._currentTableIds.length > 0) {
          currentConfig = this._configInfos;
          //Loop through all configured layers and
          //traverse to the selected layer / table by using traversal lineage & returns layerInfo
          array.some(this._currentTableIds, function (layerId, layerIndex) {
            array.some(currentConfig, function (info) {
              if (info.featureLayer.id === layerId) {
                currentConfig = info;
                return true;
              }
            });
            //if current table is not of all-layers and the index is not last then consider the next relations
            if (this._currentTableIds.length > 1 && layerIndex + 1 < this._currentTableIds.length) {
              currentConfig = currentConfig.relationshipInfos;
            }
          }, this);
        }
        //get the relationshipInfos of currentConfig which will be the info of navigating layer
        //update the validations and fieldValues from currentRelationshipInfos object
        if (currentConfig && currentConfig.relationshipInfos) {
          currentRelationshipInfos = currentConfig.relationshipInfos;
          if (currentRelationshipInfos.length === relationshipInfo.length) {
            array.forEach(relationshipInfo, function (relatedInfo) {
              array.some(currentRelationshipInfos, function (rInfo) {
                if (rInfo.featureLayer.id === relatedInfo.featureLayer.id) {
                  //update field validations (Smart Actions)
                  relatedInfo.fieldValidations = rInfo.fieldValidations;
                  //update field values (Attribute Actions)
                  relatedInfo.fieldValues = rInfo.fieldValues;
                  return true;
                }
              });
            }, this);
          }
        }
      },

      _addBreadCrumb: function (newTitle, isFirstLink) {
        var arrowIcon, selectedLayerTitle, contentWrapper, activeLinks;
        contentWrapper = domConstruct.create("div", {}, this.breadCrumbContainer);
        on(contentWrapper, "click", lang.hitch(this, function (evt) {
          this._onBreadCrumbSectionClick(contentWrapper, evt);
        }));
        //query all the title div and remove the active class
        activeLinks = query(".breadCrumbTitle", this.domNode);
        if (activeLinks && activeLinks.length > 0) {
          domClass.add(activeLinks[activeLinks.length - 1], "breadCrumbTitleActive");
        }
        //Check for the first link and accordingly add active class
        if (!isFirstLink) {
          arrowIcon = domConstruct.create("div", {
            "class": "nextArrowIcon"
          }, contentWrapper);
          domAttr.set(contentWrapper, "breadIndex", this._currentTableIds.length);
        } else {
          domAttr.set(contentWrapper, "breadIndex", -1);
        }
        //add selected layer/table name
        selectedLayerTitle = domConstruct.create("div", {
          "class": "breadCrumbTitle",
          "innerHTML": newTitle
        }, contentWrapper);
      },

      _onBreadCrumbSectionClick: function (contentWrapper, evt) {
        var index, breadCrumbLength, i, titleNode;
        titleNode = query(".breadCrumbTitle", contentWrapper)[0];
        //return if selected breadCrumb is not active
        if (!domClass.contains(titleNode, "breadCrumbTitleActive")) {
          return;
        }
        //take out the index of selected section and remove all right side bread crumb parts
        index = parseInt(domAttr.get(evt.currentTarget, "breadIndex"), 10);
        breadCrumbLength = query("div[breadIndex]").length;
        //remove active class
        domClass.remove(titleNode, "breadCrumbTitleActive");
        for (i = index + 1; i <= breadCrumbLength; i++) {
          domConstruct.destroy(query("div[breadIndex=" + i + "]")[0]);
        }
        //get the config info of the selected breadcrumb and display its table
        if (this._currentTableIds && this._currentTableIds.length > 0) {
          var currentConfig;
          currentConfig = this._configInfos;
          array.some(this._currentTableIds, function (layerId, layerIndex) {
            if (index + 1 === layerIndex) {
              return true;
            }
            array.some(currentConfig, function (info) {
              if (info.featureLayer.id === layerId) {
                currentConfig = info;
                return true;
              }
            });
            //if current table is not of all-layers and the index is not last then consider the next relations
            if (this._currentTableIds.length > 1 && layerIndex + 1 < this._currentTableIds.length) {
              currentConfig = currentConfig.relationshipInfos;
            }

          }, this);
          //first save the settings for current displayed layer/tables(Parent)
          this._getConfigForCurrentDisplayedLayers();
          //push current table/layers(Parent) id so that it can be used for bread crumbs
          this._currentTableIds.splice(index + 1, this._currentTableIds.length);
          //clear currently showing layers table
          //so that related layer/tables of the selected parent layer can be shown
          this._layersTable.clear();
          //show related layers & tables of the selected parent layer
          //Index -1 means 'show all layers' hence pass ieRelatedInfo (2nd parameter) as false
          this._setLayersTable(currentConfig, index === -1 ? false : true);
        }
      },

      _openServiceChooser: function (isGeocoderBtnClicked) {
        var contentDiv, prevConfiguredURL = "";
        //get prev configured url
        if (this._configuredGeocoderSettings && this._configuredGeocoderSettings.url) {
          prevConfiguredURL = this._configuredGeocoderSettings.url;
        }
        //create jimu geocoder services chooser instance
        this.serviceChooserContent = new _GeocodeServiceChooserContent({
          url: prevConfiguredURL
        });
        //create loading indicator for geocoder popup
        this.geocoderPopupShelter = new LoadingShelter({
          hidden: true
        });
        //create geocoder popup contents
        contentDiv = domConstruct.create("div");
        //add notes - update fields used form prev geocoder manually
        domConstruct.create("div", {
          "innerHTML": this.nls.geocoderPage.hintMsg,
          "style": { "font-size": "14px", "padding-bottom": "5px" }
        }, contentDiv);
        //add services chooser as a content
        contentDiv.appendChild(this.serviceChooserContent.domNode);
        //create a pop to choose url for geocoder
        this.geocoderPopup = new Popup({
          titleLabel: this.nls.geocoderPage.setGeocoderURL,
          autoHeight: true,
          content: contentDiv,
          container: window.jimuConfig.layoutId,
          width: 640
        });
        this.geocoderPopupShelter.placeAt(this.geocoderPopup.domNode);
        html.setStyle(this.serviceChooserContent.domNode, 'width', '580px');
        html.addClass(
          this.serviceChooserContent.domNode,
          'override-geocode-service-chooser-content'
        );
        //Handle events of geocoder service chooser
        this.serviceChooserContent.own(
          on(this.serviceChooserContent, 'validate-click', lang.hitch(this, function () {
            html.removeClass(
              this.serviceChooserContent.domNode,
              'override-geocode-service-chooser-content'
            );
          }))
        );
        this.serviceChooserContent.own(
          on(this.serviceChooserContent, 'ok', lang.hitch(this, function (evt) {
            this._onSelectLocatorUrlOk(evt, isGeocoderBtnClicked);
          })));
        this.serviceChooserContent.own(
          on(this.serviceChooserContent, 'cancel', lang.hitch(this, '_onSelectLocatorUrlCancel'))
        );
      },

      _onSelectLocatorUrlOk: function (evt, isGeocoderBtnClicked) {
        if (!(evt && evt[0] && evt[0].url && this.domNode)) {
          return;
        }
        this.geocoderPopupShelter.show();
        esriRequest({
          url: evt[0].url,
          content: {
            f: 'json'
          },
          handleAs: 'json',
          callbackParamName: 'callback'
        }).then(lang.hitch(this, function (response) {
          this.geocoderPopupShelter.hide();
          if (response && response.candidateFields) {
            this._configuredGeocoderSettings.url = evt[0].url;
            this._configuredGeocoderSettings.fields = lang.clone(response.candidateFields);
            //remove localized names as it is increasing the config and we are not using it
            array.forEach(this._configuredGeocoderSettings.fields, function (field) {
              delete field.localizedNames;
            });
            if (this.geocoderPopup) {
              this.geocoderPopup.close();
              this.geocoderPopup = null;
            }
            if (!isGeocoderBtnClicked) {
              this._editFields.geocoderConfigured();
            }
          } else {
            new Message({
              'message': this.nls.locatorWarning
            });
          }
        }), lang.hitch(this, function () {
          this.geocoderPopupShelter.hide();
          new Message({
            'message': esriLang.substitute({
              'URL': this._getRequestUrl(evt[0].url)
            }, lang.clone(this.nls.invalidUrlTip))
          });
        }));
      },

      _onSelectLocatorUrlCancel: function () {
        if (this.geocoderPopup) {
          this.geocoderPopup.close();
          this.geocoderPopup = null;
        }
      },

      _initsmartActionsTable: function () {
        var fields = [{
          name: 'name',
          title: this.nls.smartActionsPage.smartActionsTable.name,
          type: 'text',
          width: '25%'
        }, {
          name: 'expression',
          title: this.nls.smartActionsPage.smartActionsTable.expression,
          type: 'text',
          width: '50%'
        }, {
          name: 'definedOn',
          title: this.nls.smartActionsPage.smartActionsTable.definedFor,
          type: 'empty',
          width: '15%'
        }, {
          name: 'actions',
          title: this.nls.actions,
          type: 'actions',
          'class': 'actions',
          width: '10%',
          actions: ['edit', 'delete']//'up','down',
        }];
        var args = {
          fields: fields,
          selectable: false
        };
        this._smartActionsTable = new Table(args);
        this.own(on(this._smartActionsTable, 'actions-edit',
          lang.hitch(this, this._configureGroupSmartAction)));
        this._smartActionsTable.onBeforeRowDelete = lang.hitch(this, this._onDeleteSmartActionsClick);
        this._smartActionsTable.placeAt(this.smartActionsTableNode);
        this._smartActionsTable.startup();
        //if have prev smartActionGroups populate table using it
        if (this.config.smartActionGroups) {
          this._populateSmartActionGroups();
        }
      },

      _getSmartActionGroupConfig: function () {
        var rows, smartActionGroups = {};
        if (this._smartActionsTable) {
          rows = this._smartActionsTable.getRows();
          if (rows && rows.length > 0) {
            array.forEach(rows, function (row) {
              if (row._configInfo) {
                smartActionGroups[row._configInfo.name] = row._configInfo;
              }
            });
          }
        }
        return smartActionGroups;
      },

      _populateSmartActionGroups: function () {
        for (var groupName in this.config.smartActionGroups) {
          var groupInfo = this.config.smartActionGroups[groupName];
          this._addSmartActionGroupRow(groupInfo);
        }
      },

      _onDeleteSmartActionsClick: function (tr) {
        var fieldsPopup = new Popup({
          titleLabel: this.nls.smartActionsPage.deleteGroupPopupTitle,
          width: 450,
          maxHeight: 445,
          autoHeight: true,
          content: this.nls.smartActionsPage.deleteGroupPopupMsg,
          'class': this.baseClass,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              this._configureGroupSmartAction(tr, true);
              fieldsPopup.close();
              this._smartActionsTable.deleteRow(tr);
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              fieldsPopup.close();
            })
          }]
        });
      },

      _removeFromGroup: function (info) {
        if (this.config.smartActionGroups) {
          if (this.config.smartActionGroups[info.groupName]) {
            var groupInfo = this.config.smartActionGroups[info.groupName];
            if (groupInfo.appliedOn[info.layerId]) {
              groupInfo.appliedOn[info.layerId][info.fieldName][info.action] = false;
              //update the smart actions table to reflect the changes
              this._updateSmartActionTablesDefiendForCol(info.groupName);
            }
          }
        }
        //Remove the selected layers action for the selected field from each possible relations
        //If the any action was included in group and user edited it independently,
        //then remove the group name from all the possible layers and
        //keep the filter expresssion of group as if it was addded independenlty
        this._removeGroupNameFromLayerFields(info);
      },

      _updateSmartActionTablesDefiendForCol: function (groupName) {
        if (this._smartActionsTable) {
          var allRows = this._smartActionsTable.getRows();
          var groupInfo = this.config.smartActionGroups[groupName];
          array.some(allRows, function (row) {
            var rowData = this._smartActionsTable.getRowData(row);
            if (rowData.name === groupName) {
              var priorityDetails = this._checkPriorityStatus(groupInfo);
              this._addDefinedFor(priorityDetails, row);
              return true;
            }
          }, this);
        }
      },

      _removeGroupNameFromLayerFields: function (info) {
        var fieldValidations, fieldValidationsArray = [], layerId;
        layerId = info.layerId;
        //get all possible instances for field validation of this layer id
        fieldValidationsArray =
          this._getLayersFieldValidations(fieldValidationsArray, this._configInfos, layerId);
        if (fieldValidationsArray) {
          for (var i = 0; i < fieldValidationsArray.length; i++) {
            fieldValidations = fieldValidationsArray[i];
            if (fieldValidations) {
              for (var field in fieldValidations) {
                if (fieldValidations && fieldValidations[field] && field === info.fieldName) {
                  array.some(fieldValidations[field], function (existingValidation) {
                    if (existingValidation && info.action === existingValidation.actionName &&
                      existingValidation.filter &&
                      existingValidation.filter.hasOwnProperty('smartActionGroupName') &&
                      existingValidation.filter.smartActionGroupName === info.groupName) {
                      //in case of edit Independently info has the specific action to be removed,
                      //then only remove the group name and keep the filter settings as it is
                      delete existingValidation.filter.smartActionGroupName;
                      return true;
                    }
                  }, this);
                }
              }
            }
          }
        }
      },

      _getLayersFieldValidations: function (fieldValidations, configInfos, layerId) {
        array.forEach(configInfos, function (layer) {
          if (layer.featureLayer && layer.featureLayer.id === layerId) {
            if (layer.fieldValidations) {
              if (!fieldValidations) {
                fieldValidations = [];
              }
              fieldValidations.push(layer.fieldValidations);
            }
          }
          if (layer.relationshipInfos) {
            fieldValidations = this._getLayersFieldValidations(fieldValidations, layer.relationshipInfos, layerId);
          }
        }, this);
        return fieldValidations;
      },

      _configureGroupSmartAction: function (tr, isDelete) {
        var params = {
          nls: this.nls,
          map: this.map,
          filterInfo: { "filter": '' },
          layerForExpression: "",
          name: '',
          prevName: null,
          submitWhenHidden: false,
          appliedOn: null,
          existingGroupNames: [],
          _configInfos: this._configInfos,
          _jimuLayerInfos: this._jimuLayerInfos,
          editUtils: editUtils
        };

        if (this.config.smartActionGroups) {
          params.existingGroupNames = Object.keys(this.config.smartActionGroups);
        }
        //pass existingGroupConfigs so that it will be used to override group
        params.existingGroups = this._getSmartActionGroupConfig();
        if (tr) {
          params.appliedOn = tr._configInfo.appliedOn;
          params.submitWhenHidden = tr._configInfo.submitWhenHidden;
          params.name = tr._configInfo.name;
          params.prevName = lang.clone(tr._configInfo.name);
          params.filterInfo = tr._configInfo.filterInfo;
          params.layerForExpression = tr._configInfo.layerForExpression;
        }
        var objSmartActionGroup = new SmartActionGroup(params);
        this.own(on(objSmartActionGroup, "groupInfoUpdated", lang.hitch(this, function (groupInfo) {
          if (!tr) {
            this._addSmartActionGroupRow(groupInfo);
          } else {
            tr._configInfo = groupInfo;
            this._smartActionsTable.editRow(tr, {
              name: groupInfo.name,
              expression: groupInfo.filterInfo.expression
            });
          }
          //store smartActions Group
          this.config.smartActionGroups = this._getSmartActionGroupConfig();
          this._updateSmartActionTablesDefiendForColForAllRows();
        })));
        if (isDelete) {
          //on deleteing group, delete the group settings from config
          //so that user can create groups with same deleted groupName again
          if (this.config.smartActionGroups.hasOwnProperty(objSmartActionGroup.name)) {
            delete this.config.smartActionGroups[objSmartActionGroup.name];
          }
          objSmartActionGroup.deleteGroup();
        } else {
          objSmartActionGroup.showDialog();
        }
      },

      _addSmartActionGroupRow: function (groupInfo) {
        var addRowResult = this._smartActionsTable.addRow({
          name: groupInfo.name,
          expression: groupInfo.filterInfo.expression
        });
        if (addRowResult.success) {
          addRowResult.tr._configInfo = groupInfo;
          var priorityDetails = this._checkPriorityStatus(groupInfo);
          this._addDefinedFor(priorityDetails, addRowResult.tr);
        }
      },

      /**
       * Updates Defined for col to show actions for all the rows
       */
      _updateSmartActionTablesDefiendForColForAllRows: function () {
        if (this._smartActionsTable) {
          var allRows = this._smartActionsTable.getRows();
          array.forEach(allRows, function (row) {
            var priorityDetails = this._checkPriorityStatus(row._configInfo);
            this._addDefinedFor(priorityDetails, row);
            return true;
          }, this);
        }
      },

      _addDefinedFor: function (priorityDetails, row) {
        var priorityTd, priorityIconMainDiv, initialIcon, priority, className;
        priorityTd = query('.simple-table-cell', row)[2];
        if (priorityTd) {
          domConstruct.empty(priorityTd);
        }
        priorityIconMainDiv = domConstruct.create("div", {
          "class": "esriCTPriorityIconMainDiv"
        }, priorityTd);
        initialIcon = true;
        for (priority in priorityDetails) {
          if (initialIcon) {
            initialIcon = false;
            className = "esriCTPriorityIcons esriCT" + priority + " esriCTDefinedFor";
          } else {
            className = "esriCTPriorityIcons esriCT" + priority;
          }
          if (!priorityDetails[priority]) {
            className += " esriCTVisibility";
          }
          domConstruct.create("div", {
            "class": className,
            "title": this.nls.actionPage.actions[priority.toLowerCase()]
          }, priorityIconMainDiv);
        }
      },

      _checkPriorityStatus: function (groupInfo) {
        var hide, required, disabled;
        for (var layer in groupInfo.appliedOn) {
          for (var field in groupInfo.appliedOn[layer]) {
            if (!hide) {
              hide = groupInfo.appliedOn[layer][field].Hide;
            }
            if (!required) {
              required = groupInfo.appliedOn[layer][field].Required;
            }
            if (!disabled) {
              disabled = groupInfo.appliedOn[layer][field].Disabled;
            }
            if (hide && required && disabled) {
              break;
            }
          }
          if (hide && required && disabled) {
            break;
          }
        }
        return {
          "Hide": hide,
          "Required": required,
          "Disabled": disabled
        };
      },

      _getFieldValidationsFromGroup: function (groupInfo, layerId, existingFieldValidations) {
        var fieldValidations = {};
        for (var field in groupInfo.appliedOn[layerId]) {
          var newAction, actionsArray;
          if (existingFieldValidations && existingFieldValidations[field]) {
            actionsArray = existingFieldValidations[field];
          } else {
            actionsArray = null;
          }
          if (groupInfo.appliedOn[layerId][field].Hide ||
            groupInfo.appliedOn[layerId][field].Required ||
            groupInfo.appliedOn[layerId][field].Disabled) {
            if (!actionsArray) {
              actionsArray = [{
                'actionName': "Hide"
              }, {
                'actionName': "Required"
              }, {
                'actionName': "Disabled"
              }];
            }
            fieldValidations[field] = actionsArray;
          }
          newAction = {
            'submitWhenHidden': false,
            'filter': lang.clone(groupInfo.filterInfo.filter),
            'expression': groupInfo.filterInfo.filter.expr
          };
          newAction.filter.smartActionGroupName = groupInfo.name;
          if (groupInfo.appliedOn[layerId][field].Hide) {
            actionsArray[0] = lang.mixin(actionsArray[0], newAction);
            actionsArray[0].submitWhenHidden = groupInfo.submitWhenHidden;
          }
          if (groupInfo.appliedOn[layerId][field].Required) {
            actionsArray[1] = lang.mixin(actionsArray[1], newAction);
          }
          if (groupInfo.appliedOn[layerId][field].Disabled) {
            actionsArray[2] = lang.mixin(actionsArray[2], newAction);
          }
        }
        return fieldValidations;
      },

      _getSmartActionsForRelation: function (relatedLayerId) {
        var fieldValidations;
        if (this.config.smartActionGroups) {
          for (var groupName in this.config.smartActionGroups) {
            if (this.config.smartActionGroups[groupName].appliedOn.hasOwnProperty(relatedLayerId)) {
              fieldValidations =
                this._getFieldValidationsFromGroup(this.config.smartActionGroups[groupName], relatedLayerId, fieldValidations);

            }
          }
        }
        return fieldValidations;
      },
      //Attribute group code starts

      _getFieldValuesFromGroup: function (groupInfo, layerId, existingFieldValidations) {
        var fieldValidations = {};
        for (var field in groupInfo.appliedOn[layerId]) {
          var actionsArray;
          if (existingFieldValidations && existingFieldValidations[field]) {
            actionsArray = existingFieldValidations[field];
          } else {
            actionsArray = null;
          }
          if (groupInfo.appliedOn[layerId].indexOf(field) > -1) {
            if (!actionsArray) {
              actionsArray = [{
                "actionName": "Intersection",
                "enabled": false,
                "fields": []
              },
              {
                "actionName": "Address",
                "enabled": false
              },
              {
                "actionName": "Coordinates",
                "enabled": false,
                "coordinatesSystem": "MapSpatialReference",
                "field": "x"
              },
              {
                "actionName": "Preset",
                "enabled": true,
                "attributeActionGroupName": groupInfo.name
              }];
            }
            fieldValidations[field] = actionsArray;
          }
        }
        return fieldValidations;
      },

      _getAttributeActionsForRelation: function (relatedLayerId) {
        var fieldValues;
        if (this.config.attributeActionGroups && this.config.attributeActionGroups.Preset) {
          for (var groupName in this.config.attributeActionGroups.Preset) {
            if (this.config.attributeActionGroups.Preset[groupName].appliedOn.hasOwnProperty(relatedLayerId)) {
              fieldValues =
                this._getFieldValuesFromGroup(this.config.attributeActionGroups.Preset[groupName],
                  relatedLayerId, fieldValues);
            }
          }
        }
        return fieldValues;
      },

      _createLayerChooserFromMap: function () {
        var layerChooserFromMapArgs, layerInfosArray, defList = [];
        layerChooserFromMapArgs = this._createLayerChooserMapArgs();
        this._layerChooserFromMap = new LayerChooserFromMap(layerChooserFromMapArgs);
        this._layerChooserFromMap.startup();
        layerInfosArray = this._layerChooserFromMap.layerInfosObj.getLayerInfoArray();
        var tableInfosArray = this._layerChooserFromMap.layerInfosObj.getTableInfoArray();
        if (tableInfosArray && tableInfosArray.length > 0) {

          layerInfosArray = layerInfosArray.concat(tableInfosArray);
        }
        //Create total layers array
        this._getAllFilteredLayers(layerInfosArray, defList);
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
        var types, featureLayerFilter;
        types = ['point', 'polyline', 'polygon'];
        featureLayerFilter = LayerChooserFromMap.createFeaturelayerFilter(types, false, true);
        return featureLayerFilter;
      },

      _isLayerEditable: function (currentLayer) {
        var editCapabilites, isEditable = false;
        if (currentLayer && currentLayer.layerObject) {
          editCapabilites = currentLayer.layerObject.getEditCapabilities();
          if (editCapabilites.canCreate || editCapabilites.canUpdate || editCapabilites.canDelete ||
            editCapabilites.canUpdateGeometry) {
            isEditable = true;
          }
        }
        return isEditable;
      },

      _getAllFilteredLayers: function (layerInfosArray, defList) {
        array.forEach(layerInfosArray, lang.hitch(this, function (currentLayer) {
          var layerDef;
          if (!currentLayer.isLeaf()) {
            this._getAllFilteredLayers(currentLayer.newSubLayers, defList);
          } else {
            layerDef = new Deferred();
            this._layerChooserFromMap.filter(currentLayer).then(
              lang.hitch(this, function (isValid) {
                //if the layer is valid and is editable then only show in apply table
                if (isValid && this._isLayerEditable(currentLayer)) {
                  this._totalLayers.push(currentLayer);
                }
                layerDef.resolve();
              }));
            defList.push(layerDef);
          }
        }));
      },

      _onDeleteAttributeActionsClick: function (tr, actionName) {
        var fieldsPopup = new Popup({
          titleLabel: this.nls.attributeActionsPage.deleteGroupPopupTitle,
          width: 450,
          maxHeight: 445,
          autoHeight: true,
          content: this.nls.attributeActionsPage.deleteGroupPopupMsg,
          'class': this.baseClass,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              if (actionName === "Intersection") {
                this._configureIntersectionActionGroup(tr, true);
                this._intersectionActionGroupTable.deleteRow(tr);
              } else if (actionName === "Address") {
                this._configureAddressActionGroup(tr, true);
                this._addressActionGroupTable.deleteRow(tr);
              } else if (actionName === "Coordinates") {
                this._configureCoordinatesActionGroup(tr, true);
                this._coordinatesActionGroupTable.deleteRow(tr);
              } else if (actionName === "Preset") {
                this._configurePresetActionGroup(tr, true);
                this._presetActionGroupTable.deleteRow(tr);
              }
              fieldsPopup.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              fieldsPopup.close();
            })
          }]
        });
      },

      /**
       * This function is used to create Attribute Actions table
       */
      _initAttributeActionsTable: function (tableContainerNode) {
        var attributeActionsTable, fields;
        fields = [{
          name: 'name',
          title: this.nls.attributeActionsPage.name,
          type: 'text'
        }, {
          name: 'dataType',
          title: this.nls.attributeActionsPage.type,
          type: 'text'
        },
        {
          name: 'actions',
          title: this.nls.actions,
          type: 'actions',
          'class': 'actions',
          actions: ['edit', 'delete']
        }];
        var args = {
          fields: fields,
          selectable: false
        };
        attributeActionsTable = new Table(args);
        attributeActionsTable.placeAt(tableContainerNode);
        attributeActionsTable.startup();
        return attributeActionsTable;
      },

      _getAllLayersFieldValues: function (fieldValues, configInfos, layerId) {
        array.forEach(configInfos, function (layer) {
          if (layer.featureLayer && layer.featureLayer.id === layerId) {
            if (layer.fieldValues) {
              if (!fieldValues) {
                fieldValues = [];
              }
            } else {
              layer.fieldValues = {};
            }
            fieldValues.push(layer.fieldValues);
          }
          if (layer.relationshipInfos) {
            fieldValues =
              this._getAllLayersFieldValues(fieldValues, layer.relationshipInfos, layerId);
          }
        }, this);
        return fieldValues;
      },

      _removeAttributeGroupNameFromLayerFields: function (info) {
        var layersFieldValues, allFieldValues = [], layerId;
        layerId = info.layerId;
        allFieldValues = this._getAllLayersFieldValues(allFieldValues, this._configInfos, layerId);
        if (allFieldValues && allFieldValues.length > 0) {
          for (var j = 0; j < allFieldValues.length; j++) {
            layersFieldValues = allFieldValues[j];
            if (layersFieldValues) {
              for (var field in layersFieldValues) {
                if (layersFieldValues && layersFieldValues[field] && field === info.fieldName) {
                  var fieldValues = layersFieldValues[field];
                  for (var i = 0; i < fieldValues.length; i++) {
                    if (fieldValues[i].actionName === info.action &&
                      fieldValues[i].hasOwnProperty('attributeActionGroupName') &&
                      fieldValues[i].attributeActionGroupName === info.groupName) {
                      delete fieldValues[i].attributeActionGroupName;
                    }
                  }
                }
              }
            }
          }
        }
      },

      _removeFromAttributeActionGroup: function (info) {
        if (this.config.attributeActionGroups) {
          if (this.config.attributeActionGroups[info.action]) {
            var allGroupsForAction = this.config.attributeActionGroups[info.action];
            var groupInfo = allGroupsForAction[info.groupName];
            if (groupInfo.appliedOn[info.layerId] &&
              groupInfo.appliedOn[info.layerId].indexOf(info.fieldName) > -1) {
              var fieldindex = groupInfo.appliedOn[info.layerId].indexOf(info.fieldName);
              groupInfo.appliedOn[info.layerId].splice(fieldindex, 1);
            }
          }
        }
         //Remove the selected layers action for the selected field from each possible relations
        //If the any action was included in group and user edited it independently,
        //then remove the group name from all the possible layers
        this._removeAttributeGroupNameFromLayerFields(info);
      },

      /**
       * This function will create table instances for Group of
       * Intersection, Address, Coordinates and Preset action
       */
      _initAllAttributeActions: function () {
        //Create table for intersection action group
        this._intersectionActionGroupTable =
          this._initAttributeActionsTable(this.intersectionActionsTableNode);
        this.own(on(this._intersectionActionGroupTable, 'actions-edit',
          lang.hitch(this, this._configureIntersectionActionGroup)));
        this._intersectionActionGroupTable.onBeforeRowDelete = lang.hitch(this,
          function (tr) {
            this._onDeleteAttributeActionsClick(tr, "Intersection");
          });

        //Create table for address action group
        this._addressActionGroupTable =
          this._initAttributeActionsTable(this.addressActionsTableNode);
        this.own(on(this._addressActionGroupTable, 'actions-edit',
          lang.hitch(this, this._configureAddressActionGroup)));
        this._addressActionGroupTable.onBeforeRowDelete = lang.hitch(this,
          function (tr) {
            this._onDeleteAttributeActionsClick(tr, "Address");
          });

        //Create table for coordinates action group
        this._coordinatesActionGroupTable =
          this._initAttributeActionsTable(this.coordinatesActionsTableNode);
        this.own(on(this._coordinatesActionGroupTable, 'actions-edit',
          lang.hitch(this, this._configureCoordinatesActionGroup)));
        this._coordinatesActionGroupTable.onBeforeRowDelete = lang.hitch(this,
          function (tr) {
            this._onDeleteAttributeActionsClick(tr, "Coordinates");
          });

        //Create table for preset action group
        this._presetActionGroupTable =
          this._initAttributeActionsTable(this.presetActionsTableNode);
        this.own(on(this._presetActionGroupTable, 'actions-edit',
          lang.hitch(this, this._configurePresetActionGroup)));
        this._presetActionGroupTable.onBeforeRowDelete = lang.hitch(this,
          function (tr) {
            this._onDeleteAttributeActionsClick(tr, "Preset");
          });

        //if have prev smartActionGroups populate table using it
        if (this.config.attributeActionGroups) {
          this._populateAttributeActionGroups();
        }
      },

      _addAttributeActionGroupRow: function (groupInfo, actionName) {
        var table, name, dataType, addRowResult;
        name = groupInfo.name;
        dataType = groupInfo.dataType;
        if (actionName === "Intersection") {
          table = this._intersectionActionGroupTable;
          dataType = this.nls.dataType[groupInfo.dataType];
        } else if (actionName === "Address") {
          table = this._addressActionGroupTable;
        } else if (actionName === "Coordinates") {
          table = this._coordinatesActionGroupTable;
        } else if (actionName === "Preset") {
          table = this._presetActionGroupTable;
          dataType = this.nls.dataType[groupInfo.dataType];
        }
        if (table) {
          addRowResult = table.addRow({
            name: name,
            dataType: dataType
          });
          if (addRowResult.success) {
            addRowResult.tr._configInfo = groupInfo;
          }
        }
      },

      _populateAttributeActionGroups: function () {
        for (var actionName in this.config.attributeActionGroups) {
          var attributeAction = this.config.attributeActionGroups[actionName];
          for (var groupName in attributeAction) {
            var groupInfo = attributeAction[groupName];
            this._addAttributeActionGroupRow(groupInfo, actionName);
          }
        }
      },

      _getAttributeActionGroupConfig: function () {
        var attributeActionGroups = {
          "Intersection":
            this._getAttributeGroupsForAction(this._intersectionActionGroupTable),
          "Address":
            this._getAttributeGroupsForAction(this._addressActionGroupTable),
          "Coordinates":
            this._getAttributeGroupsForAction(this._coordinatesActionGroupTable),
          "Preset":
            this._getAttributeGroupsForAction(this._presetActionGroupTable)
        };
        return attributeActionGroups;
      },

      _getAttributeGroupsForAction: function (table) {
        var rows, attributeGroupsForAction = {};
        if (table) {
          rows = table.getRows();
          if (rows && rows.length > 0) {
            array.forEach(rows, function (row) {
              if (row._configInfo) {
                attributeGroupsForAction[row._configInfo.name] = row._configInfo;
              }
            });
          }
        }
        return attributeGroupsForAction;
      },

      /**
       * This function is used to listen click event of addNew  intersection AttributeActionButton.
       */
      _configureIntersectionActionGroup: function (tr, isDelete) {
        var params;
        params = {
          nls: this.nls,
          map: this.map,
          isGroup: true,
          isDelete: isDelete,
          layerInfos: this._jimuLayerInfos,
          existingGroupNames: [],
          appliedOn: null,
          _configInfos: this._configInfos,
          _fieldType: "esriFieldTypeString",
          _fieldValues: {
            "Intersection": {
              "fields": []
            }
          },
          editUtils: editUtils
        };
        if (this.config.attributeActionGroups && this.config.attributeActionGroups.Intersection) {
          params.existingGroupNames = Object.keys(this.config.attributeActionGroups.Intersection);
        }
        //pass existingGroupConfigs so that it will be used to override group
        params.existingGroups = this._getAttributeActionGroupConfig().Intersection;
        if (tr) {
          params.appliedOn = tr._configInfo.appliedOn;
          params.name = tr._configInfo.name;
          params._fieldType = tr._configInfo.dataType;
          params.prevName = lang.clone(tr._configInfo.name);
          params._fieldValues.Intersection = tr._configInfo.attributeInfo;
        }
        var intersectionObj = new Intersection(params);
        this.own(on(intersectionObj, "groupInfoUpdated", lang.hitch(this, function (groupInfo) {
          if (!tr) {
            this._addAttributeActionGroupRow(groupInfo, "Intersection");
          } else {
            tr._configInfo = groupInfo;
            this._intersectionActionGroupTable.editRow(tr, {
              name: groupInfo.name,
              dataType: this.nls.dataType[groupInfo.dataType]
            });
          }
          //store intersection attributeActions Group
          this.config.attributeActionGroups = this._getAttributeActionGroupConfig();
        })));
        if (isDelete) {
          //on deleteing group, delete the group settings from config
          //so that user can create groups with same deleted groupName again
          if (this.config.attributeActionGroups.Intersection.hasOwnProperty(tr._configInfo.name)) {
            delete this.config.attributeActionGroups.Intersection[tr._configInfo.name];
          }
          //delete Group settings from all applied layers field
          intersectionObj.deleteGroup();
        }
      },
      _onIntersectionBtnClick: function () {
        this._configureIntersectionActionGroup();
      },

      _configureAddressActionGroup: function (tr, isDelete) {
        var params;
        params = {
          nls: this.nls,
          map: this.map,
          isGroup: true,
          isDelete: isDelete,
          _totalLayers: this._totalLayers,
          layerInfos: this._jimuLayerInfos,
          existingGroupNames: [],
          _configInfos: this._configInfos,
          appliedOn: null,
          _geocoderSettings: this._configuredGeocoderSettings,
          _fieldValues: {
            "Address": {
              "field": "",
              "enabled": true
            }
          },
          editUtils: editUtils
        };
        if (this.config.attributeActionGroups && this.config.attributeActionGroups.Address) {
          params.existingGroupNames = Object.keys(this.config.attributeActionGroups.Address);
        }
        //pass existingGroupConfigs so that it will be used to override group
        params.existingGroups = this._getAttributeActionGroupConfig().Address;
        if (tr) {
          params.appliedOn = tr._configInfo.appliedOn;
          params.name = tr._configInfo.name;
          params.prevName = lang.clone(tr._configInfo.name);
          params._fieldValues.Address = tr._configInfo.attributeInfo;
        }
        var addressObj = new Address(params);
        this.own(on(addressObj, "groupInfoUpdated", lang.hitch(this, function (groupInfo) {
          if (!tr) {
            this._addAttributeActionGroupRow(groupInfo, "Address");
          } else {
            tr._configInfo = groupInfo;
            this._addressActionGroupTable.editRow(tr, {
              name: groupInfo.name,
              dataType: groupInfo.dataType
            });
          }
          //store intersection attributeActions Group
          this.config.attributeActionGroups = this._getAttributeActionGroupConfig();
        })));
        if (isDelete) {
          //on deleteing group, delete the group settings from config
          //so that user can create groups with same deleted groupName again
          if (this.config.attributeActionGroups.Address.hasOwnProperty(tr._configInfo.name)) {
            delete this.config.attributeActionGroups.Address[tr._configInfo.name];
          }
          //delete Group settings from all applied layers field
          addressObj.deleteGroup();
          return;
        }
      },

      /**
       * This function is used to listen click event of addNew  address AttributeActionButton.
       */
      _onAddressBtnClick: function () {
        //If Geocoder is not already specified, then on click of “Add New”,
        //user will be directed to “Set Geocoder URL” popup window
        //else allow user to configure attribute action group for address
        if (!this._configuredGeocoderSettings) {
          this._openServiceChooser();
        } else {
          this._configureAddressActionGroup();
        }
      },

      _configureCoordinatesActionGroup: function (tr, isDelete) {
        var params;
        params = {
          nls: this.nls,
          map: this.map,
          isGroup: true,
          isDelete: isDelete,
          _totalLayers: this._totalLayers,
          layerInfos: this._jimuLayerInfos,
          existingGroupNames: [],
          _configInfos: this._configInfos,
          appliedOn: null,
          coordinatesSavedDataTypes: this._filterAttributeDropDownOptions(tr),
          _geocoderSettings: this._configuredGeocoderSettings,
          _fieldValues: {
            "Coordinates": {
              "coordinatesSystem": "MapSpatialReference",
              "field": "x",
              "enabled": true
            }
          },
          editUtils: editUtils
        };
        if (this.config.attributeActionGroups && this.config.attributeActionGroups.Coordinates) {
          params.existingGroupNames = Object.keys(this.config.attributeActionGroups.Coordinates);
        }
        //pass existingGroupConfigs so that it will be used to override group
        params.existingGroups = this._getAttributeActionGroupConfig().Coordinates;
        if (tr) {
          params.appliedOn = tr._configInfo.appliedOn;
          params.name = tr._configInfo.name;
          params.prevName = lang.clone(tr._configInfo.name);
          params._fieldValues.Coordinates = tr._configInfo.attributeInfo;
        }
        var coordinatesObj = new Coordinates(params);
        this.own(on(coordinatesObj, "groupInfoUpdated", lang.hitch(this, function (groupInfo) {
          if (!tr) {
            this._addAttributeActionGroupRow(groupInfo, "Coordinates");
          } else {
            tr._configInfo = groupInfo;
            this._coordinatesActionGroupTable.editRow(tr, {
              name: groupInfo.name,
              dataType: groupInfo.dataType
            });
          }
          //store intersection attributeActions Group
          this.config.attributeActionGroups = this._getAttributeActionGroupConfig();
        })));
        if (isDelete) {
          //on deleteing group, delete the group settings from config
          //so that user can create groups with same deleted groupName again
          if (this.config.attributeActionGroups.Coordinates.hasOwnProperty(tr._configInfo.name)) {
            delete this.config.attributeActionGroups.Coordinates[tr._configInfo.name];
          }
          //Delete Group settings from all applied layers field
          coordinatesObj.deleteGroup();
          return;
        }
      },

      /**
       * This function is used to listen click event of addNew  preset AttributeActionButton.
       */
      _onCoordinateBtnClick: function () {
        var rows = this._coordinatesActionGroupTable.getRows();
        if (rows && rows.length < 6) {
          this._configureCoordinatesActionGroup();
        } else {
          new Message({
            message: this.nls.coordinatesPage.allGroupsCreatedMsg
          });
        }
      },

      _configurePresetActionGroup: function (tr, isDelete) {
        var params;
        params = {
          nls: this.nls,
          map: this.map,
          isDelete: isDelete,
          _totalLayers: this._totalLayers,
          layerInfos: this._jimuLayerInfos,
          _configuredPresetInfos: this._configuredPresetInfos,
          existingGroupNames: [],
          _configInfos: this._configInfos,
          appliedOn: null,
          dataType: "esriFieldTypeString",
          editUtils: editUtils
        };
        if (this.config.attributeActionGroups && this.config.attributeActionGroups.Preset) {
          params.existingGroupNames = Object.keys(this.config.attributeActionGroups.Preset);
        }
        //pass existingGroupConfigs so that it will be used to override group
        params.existingGroups = this._getAttributeActionGroupConfig().Preset;
        if (tr) {
          params.appliedOn = tr._configInfo.appliedOn;
          params.name = tr._configInfo.name;
          params.dataType = tr._configInfo.dataType;
          params.showOnlyDomainFields = tr._configInfo.showOnlyDomainFields;
          params.hideInPresetDisplay = tr._configInfo.hideInPresetDisplay;
          params.prevName = lang.clone(tr._configInfo.name);
          params.presetValue = tr._configInfo.presetValue;
        }
        var presetObj = new Preset(params);
        this.own(on(presetObj, "groupInfoUpdated", lang.hitch(this, function (groupInfo) {
          if (!tr) {
            this._addAttributeActionGroupRow(groupInfo, "Preset");
          } else {
            tr._configInfo = groupInfo;
            this._presetActionGroupTable.editRow(tr, {
              name: groupInfo.name,
              dataType: this.nls.dataType[groupInfo.dataType]
            });
          }
          //store intersection attributeActions Group
          this.config.attributeActionGroups = this._getAttributeActionGroupConfig();
        })));
        if (isDelete) {
          //on deleteing group, delete the group settings from config
          //so that user can create groups with same deleted groupName again
          if (this.config.attributeActionGroups.Preset.hasOwnProperty(tr._configInfo.name)) {
            delete this.config.attributeActionGroups.Preset[tr._configInfo.name];
          }
          //Delete Group settings from all applied layers field
          presetObj.deleteGroup();
          return;
        }
      },

      /**
       * This function is used to listen click event of addNew  preset AttributeActionButton.
       */
      _onPresetBtnClick: function () {
        this._configurePresetActionGroup();
      },

      /**
       * This function filters coordinates drop down options based on used types
       */
      _filterAttributeDropDownOptions: function (currentRow) {
        var rows, configuredDataType,
          coordinatesOption = {};
        coordinatesOption.MapSpatialReference = ["X", "Y", "X Y"];
        coordinatesOption.LatLong = ["Latitude", "Longitude", "Latitude Longitude"];
        //get all rows added in coordinates group table
        rows = this._coordinatesActionGroupTable.getRows();
        if (rows && rows.length > 0) {
          array.forEach(rows, lang.hitch(this, function (tr) {
            var index;
            //Skip type allready used
            //in case of editing row consider the current rows type as valid
            //when adding new row skip all the type used in other rows
            if (!currentRow || (currentRow._configInfo.dataType !== tr._configInfo.dataType)) {
              configuredDataType = tr._configInfo.dataType;
              if (coordinatesOption.MapSpatialReference.indexOf(configuredDataType) > -1) {
                index = coordinatesOption.MapSpatialReference.indexOf(configuredDataType);
                coordinatesOption.MapSpatialReference.splice(index, 1);
              } else if (coordinatesOption.LatLong.indexOf(configuredDataType) > -1) {
                index = coordinatesOption.LatLong.indexOf(configuredDataType);
                coordinatesOption.LatLong.splice(index, 1);
              }
            }
          }));
        }
        return coordinatesOption;
      }
    });
  });