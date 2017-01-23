///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
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
    'dojo',
    'dijit',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/query',
    'dojo/i18n!esri/nls/jsapi',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/on',
    'dojo/json',
    'dojo/topic',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidget',
    'jimu/LayerInfos/LayerInfos',
    'jimu/dijit/Message',
    "esri/dijit/editing/TemplatePicker",
    "esri/dijit/AttributeInspector",
    "esri/toolbars/draw",
    "esri/toolbars/edit",
    "esri/tasks/query",
    "esri/graphic",
    "esri/layers/FeatureLayer",
    "dojo/promise/all",
    "dojo/Deferred",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/geometry/jsonUtils",
    "dijit/registry",
    "./utils",
    "./smartAttributes",
    "./attributeInspectorTools",
    "dijit/form/CheckBox",
    'dijit/form/DateTextBox',
    'dijit/form/NumberSpinner',
    'dijit/form/NumberTextBox',
    'dijit/form/FilteringSelect',
    'dijit/form/TextBox',
    'dijit/form/ValidationTextBox',
    'dijit/form/TimeTextBox',
    "dijit/Editor",
    "dijit/form/SimpleTextarea",
    'dojo/store/Memory',
    'dojo/date/stamp',
    "jimu/dijit/Popup",
    "./AttachmentUploader",
    "esri/lang",
    "dojox/html/entities",
    'jimu/utils',
    'jimu/portalUrlUtils',
    './SEFilterEditor',
    './PrivilegeUtil',
    'jimu/dijit/LoadingShelter'
],
  function (
    dojo,
    dijit,
    declare,
    lang,
    array,
    html,
    query,
    esriBundle,
    domConstruct,
    domClass,
    on,
    JSON,
    topic,
    _WidgetsInTemplateMixin,
    BaseWidget,
    LayerInfos,
    Message,
    TemplatePicker,
    AttributeInspector,
    Draw,
    Edit,
    Query,
    Graphic,
    FeatureLayer,
    all,
    Deferred,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    Color,
    geometryJsonUtil,
    registry,
    editUtils,
    smartAttributes,
    attributeInspectorTools,
    CheckBox,
    DateTextBox,
    NumberSpinner,
    NumberTextBox,
    FilteringSelect,
    TextBox,
    ValidationTextBox,
    TimeTextBox,
    Editor,
    SimpleTextarea,
    Memory,
    dojoStamp,
    Popup,
    AttachmentUploader,
    esriLang,
    entities,
    utils,
    portalUrlUtils,
    SEFilterEditor,
    PrivilegeUtil) {
    return declare([BaseWidget, _WidgetsInTemplateMixin], {
      name: 'SmartEditor',
      baseClass: 'jimu-widget-smartEditor',
      _defaultStartStr: "",
      _defaultAddPointStr: "",
      _jimuLayerInfos: null,
      _mapClick: null,

      settings: null,
      templatePicker: null,
      attrInspector: null,
      editToolbar: null,
      _isDirty: false,
      updateFeatures: [],
      currentFeature: null,
      currentLayerInfo: null,
      _attrInspIsCurrentlyDisplayed: false,
      _ignoreEditGeometryToggle: false,
      _editingEnabled: false,
      _usePresetValues: false,
      _creationDisabledOnAll: false,
      _editGeomSwitch: null,
      _userHasPrivilege: false,
      postCreate: function () {
        this.inherited(arguments);
      },
      startup: function () {
        this.inherited(arguments);
        topic.subscribe("smartEditor/validate", lang.hitch(this, this._validateEventHandler));
        this._progressDiv = domConstruct.create("div", { "class": "processing-indicator-panel" });
        var parentDom = this.getParent().domNode.parentNode;
        parentDom.insertBefore(this._progressDiv, parentDom.firstChild);

        this.widgetActiveIndicator = domConstruct.create("div", { "class": "widgetActive widgetIndicator" });
        parentDom.insertBefore(this.widgetActiveIndicator, parentDom.firstChild);

        if (this.config.editor.editDescription === undefined || this.config.editor.editDescription === null) {
          this.config.editor.editDescription = '';
          this.templateTitle.innerHTML = this.config.editor.editDescription;
        }
        else {
          this.templateTitle.innerHTML = entities.decode(this.config.editor.editDescription);
        }
        this._orignls = esriBundle.widgets.attachmentEditor.NLS_attachments;
        //this.nls = lang.mixin(this.nls, window.jimuNls.common);
        //this.loading = new LoadingShelter({
        //  hidden: true
        //});
        //this.loading.placeAt(this.domNode);

        this.editToolbar = new Edit(this.map);
        this.drawToolbar = new Draw(this.map);
        // edit events
        this.own(on(this.editToolbar,
          "graphic-move-stop, rotate-stop, scale-stop, vertex-move-stop, vertex-click",
          lang.hitch(this, function () {
            this.geometryChanged = true;
            this._enableAttrInspectorSaveButton(this._validateAttributes());
            //this._enableAttrInspectorSaveButton(true);
            this._isDirty = true;
          })));

        // draw event
        this.own(on(this.drawToolbar, "draw-end", lang.hitch(this, function (evt) {
          this.drawToolbar.deactivate();
          this._isDirty = true; //?
          this._addGraphicToLocalLayer(evt);
        })));


        this.privilegeUtil = PrivilegeUtil.getInstance();
        //<div class="processing-indicator-panel"></div>
        this.nls = lang.mixin(this.nls, window.jimuNls.common);
        this._setTheme();
        this.shelter.show();
        LayerInfos.getInstance(this.map, this.map.itemInfo)
       .then(lang.hitch(this, function (operLayerInfos) {

         var timeoutValue;
         if (this.appConfig.theme.name === "BoxTheme") {
           timeoutValue = 1050;

         } else {
           timeoutValue = 1;
         }
         setTimeout(lang.hitch(this, function () {

           this.privilegeUtil.loadPrivileges(this._getPortalUrl()).then(lang.hitch(this, function (status) {
             var valid = true;
             this._user = null;
             if (!status) {
               valid = this._initControl(operLayerInfos);
             } else {
               var userInfo = this.privilegeUtil.getUser();
               if (userInfo) {
                 this._user = userInfo.username;
               }

               if (this.privilegeUtil.userRole.canEditFeatures() === true) {
                 valid = this._initControl(operLayerInfos);

               }
               else if (this.privilegeUtil.userRole.canEditFeaturesFullControl === true) {
                 valid = this._initControl(operLayerInfos);

               }
               else {
                 this._noPrivilegeHandler(window.jimuNls.noEditPrivileges);//this.nls.noEditPrivileges);
               }
             }
             if (valid === false) {
               this._noPrivilegeHandler(window.jimuNls.invalidConfiguration);//this.nls.invalidConfiguration);
             }

             this.shelter.hide();

           }), lang.hitch(this, function () {

             this._noPrivilegeHandler(window.jimuNls.noEditPrivileges);//this.nls.noEditPrivileges);
           }));
           this.shelter.hide();
           this._workBeforeCreate();
         }), timeoutValue);
       }));

      },
      _noPrivilegeHandler: function (message) {
        this.templateTitle.innerHTML = message;
        if (this.templatePicker) {
          dojo.style(this.templatePicker.domNode, "display", "none");
          if (this._mapClick) {

            this._mapClick.remove();
            this._mapClick = null;
          }
        }
        this.map.setInfoWindowOnClick(true);
        this.shelter.hide();
      },
      _getPortalUrl: function (url) {
        if (url) {
          return portalUrlUtils.getStandardPortalUrl(url);
        } else {
          return portalUrlUtils.getStandardPortalUrl(this.appConfig.portalUrl);
        }
      },
      onReceiveData: function (name, widgetId, data, historyData) {
        if (this.config.editor) {
          historyData = historyData;
          widgetId = widgetId;
          if (this.config.editor.hasOwnProperty("listenToGF")) {
            if (this.config.editor.listenToGF !== true) {
              return;
            }
          } else {
            return;
          }
          if (name !== 'GroupFilter') {
            return;
          }

          if (data.message.hasOwnProperty("fields") &&
            data.message.hasOwnProperty("values")) {
            array.forEach(data.message.fields, function (field) {
              this._setPresetValueValue(field, data.message.values[0]);
            }, this);
          }
        }
      },
      /*jshint unused:true */
      _setTheme: function () {
        //if (this.appConfig.theme.name === "BoxTheme" ||
        //    this.appConfig.theme.name === "DartTheme" ||
        //    this.appConfig.theme.name === "LaunchpadTheme") {
        var styleLink;
        if (this.appConfig.theme.name === "DartTheme") {
          utils.loadStyleLink('dartOverrideCSS', this.folderUrl + "/css/dartTheme.css", null);
        }
        else {
          styleLink = document.getElementById("dartOverrideCSS");
          if (styleLink) {
            styleLink.disabled = true;
          }
        }
        if (this.appConfig.theme.name === "LaunchpadTheme") {
          utils.loadStyleLink('launchpadOverrideCSS', this.folderUrl + "/css/launchpadTheme.css", null);
        }
        else {
          styleLink = document.getElementById("launchpadOverrideCSS");
          if (styleLink) {
            styleLink.disabled = true;
          }
        }
      },
      _mapClickHandler: function (create) {
        if (create === true && this._attrInspIsCurrentlyDisplayed === false) {
          this.map.setInfoWindowOnClick(false);
          if (this._mapClick === undefined || this._mapClick === null) {
            this._mapClick = on(this.map, "click", lang.hitch(this, this._onMapClick));
          }
          this._activateTemplateToolbar();
        }
        else if (create === true && this._attrInspIsCurrentlyDisplayed === true) {
          if (this._mapClick) {
            this._mapClick.remove();
            this._mapClick = null;
          }
          this.map.setInfoWindowOnClick(true);
          //this._validateAttributes();
        }
        else {
          if (this._mapClick) {

            this._mapClick.remove();
            this._mapClick = null;
          }
          this.map.setInfoWindowOnClick(true);
          if (this.drawToolbar) {
            //this._lastDrawnShape = lang.clone(this.drawToolbar._points);
            this.drawToolbar.deactivate();
          }
        }
      },
      destroy: function () {
        this.inherited(arguments);

        if (this.attrInspector) {
          this.attrInspector.destroy();
        }
        this.attrInspector = null;

        if (this.templatePicker) {
          this.templatePicker.destroy();
        }
        this.templatePicker = null;
      },
      onActive: function () {
        if (this._userHasPrivilege === true) {
          if (domClass.contains(this.widgetActiveIndicator, "widgetNotActive")) {
            domClass.remove(this.widgetActiveIndicator, "widgetNotActive");
          }
          domClass.add(this.widgetActiveIndicator, "widgetActive");
          if (this.map) {
            this._mapClickHandler(true);
          }
        }
      },
      onDeActive: function () {
        if (domClass.contains(this.widgetActiveIndicator, "widgetActive")) {
          domClass.remove(this.widgetActiveIndicator, "widgetActive");
        }
        domClass.add(this.widgetActiveIndicator, "widgetNotActive");
        if (this.map) {
          this._mapClickHandler(false);
        }
      },
      onOpen: function () {
        if (this._userHasPrivilege === true) {
          //this.fetchDataByName('GroupFilter');
          this._workBeforeCreate();
          this.widgetManager.activateWidget(this);
        }
        if (this.templatePicker) {
          this.templatePicker.update();
        }
      },
      _initControl: function (operLayerInfos) {
        this._userHasPrivilege = true;
        this._jimuLayerInfos = operLayerInfos;
        var onlyConfiged = false;
        if (this.config.editor && this.config.editor.layerInfos) {
          onlyConfiged = this.config.editor.layerInfos.length > 0;
        }
        this.config.editor.configInfos = editUtils.getConfigInfos(this._jimuLayerInfos,
          this.config.editor.layerInfos, true, onlyConfiged);
        if (onlyConfiged === false) {
          array.forEach(this.config.editor.configInfos, function (configInfo) {
            configInfo._editFlag = true;
          });
        }
        if (this.config.editor.configInfos === undefined || this.config.editor.configInfos === null) {
          return false;
        }
        else if (this.config.editor.configInfos.length === 0) {
          return false;
        }
        this._processConfig();

        array.forEach(this.config.editor.configInfos, function (configInfo) {
          configInfo.featureLayer.name = configInfo.layerInfo.title;
        }, this);

        this._createEditor();
        this.fetchDataByName('GroupFilter');
        this.widgetManager.activateWidget(this);
        return true;
      },
      _addFilterEditor: function (layers) {
        if (this.config.editor.useFilterEditor === true && this.templatePicker) {
          if (this._filterEditor) {
            this._filterEditor.setTemplatePicker(this.templatePicker, layers);
          }
          else {
            this._filterEditorNode = domConstruct.create("div", {});
            this.templatePickerDiv.insertBefore(this._filterEditorNode,
              this.templatePicker.domNode);
            this._filterEditor = new SEFilterEditor({
              _templatePicker: this.templatePicker,
              _layers: layers,
              map: this.map,
              nls: this.nls
            }, this._filterEditorNode);
          }
        }
      },
      _activateEditToolbar: function (feature) {
        var layer = feature.getLayer();
        switch (layer.geometryType) {
          case "esriGeometryPoint":
            this.editToolbar.activate(Edit.MOVE, feature);
            break;
          case "esriGeometryPolyline":
          case "esriGeometryPolygon":
            /*jslint bitwise: true*/
            this.editToolbar.activate(Edit.EDIT_VERTICES |
                                 Edit.MOVE |
                                 Edit.ROTATE |
                                 Edit.SCALE, feature);
            /*jslint bitwise: false*/
            break;
        }
      },

      // this function also create a new attribute inspector for the local layer
      _addGraphicToLocalLayer: function (evt) {
        if (this.templatePicker === undefined ||
          this.templatePicker === null) { return; }
        if (!this.templatePicker.getSelected()) { return; }
        var selectedTemp = this.templatePicker.getSelected();
        var newTempLayerInfos;
        var localLayerInfo = null;

        if (this.attrInspector) {
          this.attrInspector.destroy();
          this.attrInspector = null;
        }

        if (this._attachmentUploader && this._attachmentUploader !== null) {
          this._attachmentUploader.clear();
        }

        this._removeLocalLayers();
        // preparation for a new attributeInspector for the local layer
        this.cacheLayer = this._cloneLayer(this.templatePicker.getSelected().featureLayer);
        this.cacheLayer.setSelectionSymbol(this._getSelectionSymbol(this.cacheLayer.geometryType, true));

        localLayerInfo = this._getLayerInfoForLocalLayer(this.cacheLayer);
        newTempLayerInfos = [localLayerInfo];//this._converConfiguredLayerInfos([localLayerInfo]);

        this._createAttributeInspector([localLayerInfo]);

        var newAttributes = lang.clone(selectedTemp.template.prototype.attributes);
        if (this._usePresetValues) {
          this._modifyAttributesWithPresetValues(newAttributes, newTempLayerInfos[0]);
        }

        var newGraphic = new Graphic(evt.geometry, null, newAttributes);

        // store original attrs for later use
        newGraphic.preEditAttrs = JSON.parse(JSON.stringify(newGraphic.attributes));
        this.cacheLayer.applyEdits([newGraphic], null, null, lang.hitch(this, function (e) {
          this._isDirty = true;
          var query = new Query();
          query.objectIds = [e[0].objectId];
          this.cacheLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW);

          this.currentFeature = this.updateFeatures[0] = newGraphic;
          this.geometryChanged = false;
          if (this._attributeInspectorTools) {
            this._attributeInspectorTools.triggerFormValidation();
          }
          this._attachLayerHandler();
          this.currentLayerInfo = this._getLayerInfoByID(this.currentFeature._layer.id);
          this.currentLayerInfo.isCache = true;
          this._toggleDeleteButton(false);
          //this._toggleEditGeoSwitch(false);

          //this._createSmartAttributes();
          //
          this._enableAttrInspectorSaveButton(this._validateAttributes());
        }));

        this._showTemplate(false, false);
      },

      // cancel editing of the current feature
      _cancelEditingFeature: function (showTemplatePicker) {
        if (!this.currentFeature) { return; }

        if (showTemplatePicker) {

          this._showTemplate(true, false);
        } else { // show attr inspector

          // restore attributes & geometry
          if (this.currentFeature.preEditAttrs) {
            this.currentFeature.attributes = this.currentFeature.preEditAttrs;
          }
          if (this.currentFeature.origGeom) {
            this.currentFeature.geometry = geometryJsonUtil.fromJson(this.currentFeature.origGeom);
          }
          this.currentFeature.getLayer().refresh();
          this.attrInspector.refresh();

          //reset
          this._resetEditingVariables();

        }
      },

      _addDateFormat: function (fieldInfo) {
        if (fieldInfo && fieldInfo.format && fieldInfo.format !==
           null) {
          if (fieldInfo.format.dateFormat && fieldInfo.format.dateFormat !==
           null) {
            if (fieldInfo.format.dateFormat.toString().toUpperCase().indexOf("TIME") >= 0) {
              fieldInfo.format.time = true;
            }
            //if (fieldInfo.format.dateFormat ===
            //  "shortDateShortTime" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateLongTime" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateShortTime24" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateLEShortTime" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateLEShortTime24" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateLELongTime" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateLELongTime24") {
            //  fieldInfo.format.time = true;
            //}
          }
        }
      },

      _processLayerFields: function (fields) {
        //Function required to add the Range details to a range domain so the layer can be cloned

        array.forEach(fields, function (field) {
          if (field.domain !== undefined && field.domain !== null) {
            if (field.domain.type !== undefined && field.domain.type !== null) {
              if (field.domain.type === 'range') {
                if (field.domain.hasOwnProperty('range') === false) {
                  field.domain.range = [field.domain.minValue, field.domain.maxValue];
                }
              }
            }

          }
        });

        return fields;
      },
      _iterateCollection: function (collection) {
        return function (f) {
          for (var i = 0; collection[i]; i++) {
            f(collection[i], i);
          }
        };
      },
      _cloneLayer: function (layer) {
        var cloneFeaturelayer;
        var fieldsproc = this._processLayerFields(layer.fields);
        var featureCollection = {
          layerDefinition: {
            "id": 0,
            "name": layer.name + this.nls.editorCache,
            "type": "Feature Layer",
            "displayField": layer.displayField,
            "description": "",
            "copyrightText": "",
            "relationships": [],
            "geometryType": layer.geometryType,
            "minScale": 0,
            "maxScale": 0,
            "extent": layer.fullExtent,
            "drawingInfo": {
              "renderer": layer.renderer,
              "transparency": 0,
              "labelingInfo": null
            },
            "hasAttachments": layer.hasAttachments,
            "htmlPopupType": "esriServerHTMLPopupTypeAsHTMLText",
            "objectIdField": layer.objectIdField,
            "globalIdField": layer.globalIdField,
            "typeIdField": layer.typeIdField,
            "fields": fieldsproc,
            "types": layer.types,
            "templates": layer.templates,
            "capabilities": "Create,Delete,Query,Update,Uploads,Editing",
            "editFieldsInfo": layer.editFieldsInfo === undefined ? null : layer.editFieldsInfo
          }
        };
        var outFields = layer.fields.map(function (f) {
          return f.name;
        });
        // only keep one local layer
        //var existingLayer = this.map.getLayer(layer.id + "_lfl");
        //if (existingLayer) {
        //  this.map.removeLayer(existingLayer);
        //}

        cloneFeaturelayer = new FeatureLayer(featureCollection, {
          id: layer.id + "_lfl",
          outFields: outFields
        });
        cloneFeaturelayer.visible = true;
        cloneFeaturelayer.renderer = layer.renderer;
        cloneFeaturelayer.originalLayerId = layer.id;
        cloneFeaturelayer._wabProperties = { isTemporaryLayer: true };
        this.map.addLayer(cloneFeaturelayer);
        return cloneFeaturelayer;
      },
      _endsWith: function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
      },
      _validateEventHandler: function () {
        this._enableAttrInspectorSaveButton(this._validateAttributes());
      },
      _validateAttributes: function () {
        var rowsWithGDBRequiredFieldErrors = this._validateRequiredFields();
        var rowsWithSmartErrors = [];
        var formValid = true;
        if (this._smartAttributes !== undefined) {
          if (this._smartAttributes !== null) {
            rowsWithSmartErrors = this._smartAttributes.toggleFields();
          }
        }
        if (this._attributeInspectorTools !== undefined) {
          if (this._attributeInspectorTools !== null) {
            formValid = this._attributeInspectorTools.formValid();
          }
        }
        return (editUtils.isObjectEmpty(rowsWithGDBRequiredFieldErrors) &&
          rowsWithSmartErrors.length === 0 && formValid);

      },
      _toggleEditGeoSwitch: function (disable) {
        if (this._editGeomSwitch === undefined || this._editGeomSwitch === null) {
          return;
        }
        if (disable === false) {
          dojo.style(this._editGeomSwitch.domNode.parentNode, "display", "block");
          this._turnEditGeometryToggleOff();

        }
        else {
          dojo.style(this._editGeomSwitch.domNode.parentNode, "display", "none");
          this._turnEditGeometryToggleOff();

        }

      },
      _recordLoadeAttInspector: function () {
        if (this.editDescription.style.display === "block") {
          if (this.updateFeatures.length > 1) {
            dojo.style(this.editDescription, "padding-top", "20px");
          } else {
            dojo.style(this.editDescription, "padding-top", "0");
          }
        } else {
          if (this.updateFeatures.length > 1) {
            dojo.style(query(".attributeInspectorDiv")[0], "padding-top", "20px");
          } else {
            dojo.style(query(".attributeInspectorDiv")[0], "padding-top", "8px");
          }

        }
      },
      _attributeInspectorChangeRecord: function (evt) {
        this._turnEditGeometryToggleOff();
        if (this._isDirty && this.currentFeature) {
          // do not show templatePicker after saving
          if (this.config.editor.displayPromptOnSave && this.config.editor.displayPromptOnSave === true) {
            this._promptToResolvePendingEdit(false, evt, false);
          }
        } else {
          this._postFeatureSave(evt);
        }
        this._recordLoadeAttInspector();
      },
      _addWarning: function () {
        if (query(".attwarning").length === 0) {
          var txt = domConstruct.create("div", { 'class': 'attwarning' });
          txt.innerHTML = this.nls.attachmentSaveDeleteWarning;
          if (this.attrInspector._attachmentEditor !== undefined &&
             this.attrInspector._attachmentEditor !== null) {
            this.attrInspector._attachmentEditor.domNode.appendChild(txt);
          }

        }
      },
      _createAttributeInspector: function (layerInfos) {

        if (this.attrInspector) {
          this.attrInspector.destroy();
          this.attrInspector = null;
        }
        this.attrInspector = new AttributeInspector({
          layerInfos: layerInfos
        }, html.create("div", {
          style: {
            width: "100%",
            height: "100%"
          }
        }));
        this.attrInspector.placeAt(this.attributeInspectorNode);
        this.attrInspector.startup();
        domConstruct.place(this.attrInspector.navMessage, this.attrInspector.nextFeatureButton.domNode, "before");

        this.editSwitchDiv = domConstruct.create("div");
        this.editSwitchDiv.appendChild(domConstruct.create("div", { "class": "spacer" }));
        // edit geometry toggle button
        this._editGeomSwitch = new CheckBox({
          id: "editGeometrySwitch",
          value: this.nls.editGeometry
        }, null);

        this.editSwitchDiv.appendChild(this._editGeomSwitch.domNode);

        domConstruct.place(lang.replace(
         "<label for='editGeometrySwitch'>{replace}</label></br></br>",
         { replace: this.nls.editGeometry }), this._editGeomSwitch.domNode, "after");

        domConstruct.place(this.editSwitchDiv, this.attrInspector.deleteBtn.domNode, "before");

        this.own(on(this._editGeomSwitch, 'Change', lang.hitch(this, this._editGeometry)));


        //add close/cancel/switch to template button
        var cancelButton = domConstruct.create("div", {
          innerHTML: this.nls.back,
          "class": "cancelButton jimu-btn"
        }, this.attrInspector.deleteBtn.domNode, "after");

        // save button
        var saveButton = domConstruct.create("div", {
          innerHTML: this.nls.save,
          "class": "saveButton jimu-btn jimu-state-disabled"
        }, cancelButton, "after");

        //add another process indicator
        //domConstruct.create("div", {
        //  "class": "processing-indicator"
        //}, saveButton, "before");
        if (query(".jimu-widget-smartEditor .deleteButton").length < 1) {
          this._deleteButton = domConstruct.create("div", {
            innerHTML: this.nls.deleteText,
            "class": "deleteButton jimu-btn jimu-btn-vacation"
          }, saveButton, "after");
          // query(".jimu-widget-smartEditor .topButtonsRowDiv")[0], "first");

          on(this._deleteButton, "click", lang.hitch(this, function () {
            //if (this.currentFeature) {
            if (this.map.infoWindow.isShowing) {
              this.map.infoWindow.hide();
            }

            if (this.config.editor.displayPromptOnDelete) {
              this._promptToDelete();

            } else {
              this._deleteFeature();
            }
            //}
          }));
        }

        //wire up the button events
        this.own(on(cancelButton, "click", lang.hitch(this, function () {
          if (this.map.infoWindow.isShowing) {
            this.map.infoWindow.hide();
          }

          if (this.config.editor.displayPromptOnSave && this._isDirty) {
            this._promptToResolvePendingEdit(true, null, true);
          } else {
            this._cancelEditingFeature(true);
            //this._activateTemplateToolbar();
          }


        })));

        this.own(on(saveButton, "click", lang.hitch(this, function () {
          if (!this._isDirty) {
            this._resetEditingVariables();
            return;
          }

          if (this.map.infoWindow.isShowing) {
            this.map.infoWindow.hide();
          }
          this._saveEdit(this.currentFeature);
        })));

        // edit geometry checkbox event

        // attribute inspector events
        this.own(on(this.attrInspector, "attribute-change", lang.hitch(this, function (evt) {
          if (this.currentFeature) {
            this.currentFeature.attributes[evt.fieldName] = evt.fieldValue;
            this._isDirty = true;

            this._enableAttrInspectorSaveButton(this._validateAttributes());
          }
        })));
        this.own(on(this.attrInspector, "next", lang.hitch(this, function (evt) {

          this._attributeInspectorChangeRecord(evt);
          this._addWarning();
        })));
        if (this._attachmentUploader && this._attachmentUploader !== null) {
          this._attachmentUploader.destroy();
          this._attachmentUploader = null;

        }
        if (layerInfos.length === 1) {
          if (layerInfos[0].featureLayer.hasOwnProperty('originalLayerId')) {
            var result = this._getLayerInfoByID(layerInfos[0].featureLayer.originalLayerId);
            if (result.featureLayer.hasAttachments === true) {
              this.attachNode = domConstruct.create("div");
              domConstruct.place(this.attachNode, this.attrInspector.attributeTable, "after");
              this._attachmentUploader = new AttachmentUploader({ 'class': 'atiAttachmentEditor' },
                this.attachNode);
              this._attachmentUploader.startup();
            }
          }
        }
      },
      _toggleDeleteButton: function (show) {
        if (show === true) {
          this._deleteButton.style.display = "block";
        } else {
          this._deleteButton.style.display = "none";
        }
      },
      _activateTemplateToolbar: function () {

        if (this.templatePicker) {
          var selectedTemplate = this.templatePicker.getSelected();
          if (selectedTemplate && selectedTemplate !== null) {

            switch (selectedTemplate.template.drawingTool) {
              case "esriFeatureEditToolNone":
                switch (selectedTemplate.featureLayer.geometryType) {
                  case "esriGeometryPoint":
                    this.drawToolbar.activate(Draw.POINT);
                    break;
                  case "esriGeometryPolyline":

                    this.drawToolbar.activate(Draw.POLYLINE);
                    break;
                  case "esriGeometryPolygon":
                    this.drawToolbar.activate(Draw.POLYGON);
                    break;
                }
                break;
              case "esriFeatureEditToolPoint":
                this.drawToolbar.activate(Draw.POINT);
                break;
              case "esriFeatureEditToolLine":
                this.drawToolbar.activate(Draw.POLYLINE);
                break;
              case "esriFeatureEditToolAutoCompletePolygon":
              case "esriFeatureEditToolPolygon":
                this.drawToolbar.activate(Draw.POLYGON);
                break;
              case "esriFeatureEditToolCircle":
                this.drawToolbar.activate(Draw.CIRCLE);
                break;
              case "esriFeatureEditToolEllipse":
                this.drawToolbar.activate(Draw.ELLIPSE);
                break;
              case "esriFeatureEditToolRectangle":
                this.drawToolbar.activate(Draw.RECTANGLE);
                break;
              case "esriFeatureEditToolFreehand":
                switch (selectedTemplate.featureLayer.geometryType) {
                  case "esriGeometryPoint":
                    this.drawToolbar.activate(Draw.POINT);
                    break;
                  case "esriGeometryPolyline":
                    this.drawToolbar.activate(Draw.FREEHAND_POLYLINE);
                    break;
                  case "esriGeometryPolygon":
                    this.drawToolbar.activate(Draw.FREEHAND_POLYGON);
                    break;
                }
                break;
            }
            //if (this._lastDrawnShape && this._lastDrawnShape !== null) {
            //  this.drawToolbar._points = this._lastDrawnShape;
            //  this.drawToolbar._redrawGraphic();
            //}
          }

          else if (this.drawToolbar) {

            this.drawToolbar.deactivate();
            // this._lastDrawnShape = null;
          }
        }
        else if (this.drawToolbar) {

          this.drawToolbar.deactivate();
          //this._lastDrawnShape = null;
        }
      },
      _templatePickerNeedsToBeCreated: function () {
        //if (this.templatePicker === undefined || this.templatePicker === null) {
        //  return true;
        //}
        return true;
        //var recreate = array.some(layers, function (layer) {
        //  var layerMatches = array.some(this.templatePicker.featureLayers, function (tpLayer) {
        //    return tpLayer.id === layer.id;
        //  });
        //  if (layerMatches === false) {
        //    return true;
        //  }
        //  return false;
        //}, this);
        //return recreate;
      },
      _layerChangeOutside: function () {
        if (this._attrInspIsCurrentlyDisplayed && this._attrInspIsCurrentlyDisplayed === true) {
          if (this.attrInspector) {
            if (this.attrInspector._numFeatures === 0) {
              this._showTemplate(true);

            }
          }
        }
      },
      _createEditor: function () {
        var selectedTemplate = null;

        if (this.config.editor === undefined || this.config.editor === null) {
          return;
        }
        var layers = this._getEditableLayers(this.config.editor.configInfos, false);
        this._layerChangeOutside();
        if (layers.length < 1) {
          this._creationDisabledOnAll = true;
        }
        else if (this._templatePickerNeedsToBeCreated()) {
          if (this._attrInspIsCurrentlyDisplayed && this._attrInspIsCurrentlyDisplayed === true) {
            this._recreateOnNextShow = true;
            return;
          }
          if (this.templatePicker &&
            this.templatePicker !== null) {
            selectedTemplate = this.templatePicker.getSelected();
            if (selectedTemplate === null) {
              if (this.drawToolbar) {
                this.drawToolbar.deactivate();
              }
            }
            this._select_change_event.remove();
            this.templatePicker.destroy();
            this._resetEditingVariables();
            if (this.drawToolbar) {
              this.drawToolbar.deactivate();
            }
          }
          else {

            this._createPresetTable(layers, this.config.editor.configInfos);

          }
          //create template picker
          this.templatePickerNode = domConstruct.create("div",
           { 'class': "eeTemplatePicker" }
           );
          //if (this.state === "active") {
          //  this.widgetActiveIndicator = domConstruct.create("div",
          //   { 'class': "widgetActive" }
          //   );
          //}
          //else {
          //  this.widgetActiveIndicator = domConstruct.create("div",
          //  { 'class': "widgetNotActive" }
          //  );
          //}
          this.templatePickerDiv.appendChild(this.templatePickerNode);
          this.templatePicker = new TemplatePicker({
            featureLayers: layers,
            'class': 'esriTemplatePicker',
            grouping: true,
            maxLabelLength: "25",
            showTooltip: false
          }, this.templatePickerNode);
          this.templatePicker.startup();

          //this.templatePicker.domNode.appendChild(this.widgetActiveIndicator);
          //this.templatePickerNode.appendChild(this.templatePicker.domNode);
          this._addFilterEditor(layers);
          // wire up events

          if (selectedTemplate !== null && this.templatePicker) {
            var keysArr = Object.getOwnPropertyNames(this.templatePicker._itemWidgets);
            var templateItems = [];
            array.forEach(this.templatePicker._flItems, function (flItems) {
              array.forEach(flItems, function (flItem) {
                templateItems.push(flItem);
              });
            });
            if (templateItems.length === keysArr.length) {
              var itemFnd = array.some(templateItems, function (item, index) {
                if (selectedTemplate.featureLayer.id === item.layer.id &&
                  item.template.name === selectedTemplate.template.name &&
                  item.template.drawingTool === selectedTemplate.template.drawingTool &&
                  item.template.description === selectedTemplate.template.description &&
                  item.type === selectedTemplate.type) {
                  var dom = dojo.byId(keysArr[index]);
                  on.emit(dom, "click", {
                    bubbles: true,
                    cancelable: true
                  });
                  this._activateTemplateToolbar();
                  return true;
                }
              }, this);

              if (itemFnd === false) {
                if (this.drawToolbar) {
                  this.drawToolbar.deactivate();
                }
              }
            }
            else {
              if (this.drawToolbar) {
                this.drawToolbar.deactivate();
              }
            }
          }
          else {
            if (this.drawToolbar) {
              this.drawToolbar.deactivate();
            }
          }
          this._select_change_event = on(this.templatePicker, "selection-change",
            lang.hitch(this, this._activateTemplateToolbar));
          this.own(this._select_change_event);
        }
        if (layers.length < 1) {
          this._creationDisabledOnAll = true;
        }
        else {
          this._creationDisabledOnAll = false;
        }
        if (this._creationDisabledOnAll) {
          if (this.drawToolbar) {
            this.drawToolbar.deactivate();
          }
          if (this.templatePicker) {
            dojo.style(this.templatePicker.domNode, "display", "none");
          }
          if (this._filterEditor) {
            dojo.style(this._filterEditor.domNode, "display", "none");
          }
        } else {
          if (this.templatePicker) {
            dojo.style(this.templatePicker.domNode, "display", "block");
          }
          if (this._filterEditor) {
            dojo.style(this._filterEditor.domNode, "display", "block");
          }
        }
      },
      isGuid: function (value) {
        if (value[0] === "{") {
          value = value.substring(1, value.length - 1);
        }
        var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
        return regexGuid.test(value);
      },
      validateGUID: function (value, constraints) {
        constraints = constraints;
        return this.isGuid(value);
      },
      _createPresetTable: function (layers, layerInfos) {
        // set preset values table
        var editLayerInfos = layerInfos;//this._getEditableLayersInfos(layerInfos)
        if (layers.length > 0 && this._hasPresetValueFields(editLayerInfos)) {
          this._initPresetFieldsTable();
          this._fillPresetValueTable(editLayerInfos);
          query(".presetFieldsTableDiv")[0].style.display = "block";
        } else {
          query(".presetFieldsTableDiv")[0].style.display = "none";
        }
      },
      _createPresetFieldContentNode: function (fieldInfo) {
        var nodes = [];
        var node;

        if (fieldInfo.domain) {
          // domain.type = codedValue
          if (fieldInfo.domain.type === "codedValue") {
            var domainValues = fieldInfo.domain.codedValues;

            var options = [];
            array.forEach(domainValues, function (dv) {
              options.push({ name: dv.name, id: dv.code });
            });

            node = new FilteringSelect({
              "class": "ee-inputField",
              name: fieldInfo.fieldName,
              store: new Memory({ data: options }),
              searchAttr: "name"
            }, domConstruct.create("div"));

          } else { //domain.type = range
            var cons = null;
            switch (fieldInfo.type) {
              case "esriFieldTypeSmallInteger":
              case "esriFieldTypeInteger":
                cons = {
                  min: fieldInfo.domain.minValue,
                  max: fieldInfo.domain.maxValue,
                  places: 0
                };
                break;

              case "esriFieldTypeSingle":
              case "esriFieldTypeDouble":
                cons = {
                  min: fieldInfo.domain.minValue,
                  max: fieldInfo.domain.maxValue
                };
                break;

            }
            node = new NumberSpinner({
              "class": "ee-inputField",
              name: fieldInfo.fieldName,
              smallDelta: 1,
              constraints: cons
            }, domConstruct.create("div"));

          }

          nodes.push(node);

        } else {
          switch (fieldInfo.type) {
            case "esriFieldTypeGUID":
              node = new ValidationTextBox({
                "class": "ee-inputField",
                name: fieldInfo.fieldName
              }, domConstruct.create("div"));
              node.validator = lang.hitch(this, this.validateGUID);
              nodes.push(node);
              break;
            case "esriFieldTypeDate":
              node = new DateTextBox({
                "class": "ee-inputField",

                name: fieldInfo.fieldName
              }, domConstruct.create("div"));
              //value: new Date(),
              nodes.push(node);

              if (fieldInfo.format) {
                if (fieldInfo.format.time && fieldInfo.format.time === true) {
                  var timeNode = new TimeTextBox({
                    "class": "ee-inputField",
                    "style": "margin-top:2px;"

                  }, domConstruct.create("div"));
                  nodes.push(timeNode);
                  //value: new Date()
                }
              }

              break;
            case "esriFieldTypeString":
              var maxlength = null;
              if (fieldInfo.length &&
                     Number(fieldInfo.length) &&
                     Number(fieldInfo.length) > 0) {
                maxlength = fieldInfo.length;
              }
              if (fieldInfo.hasOwnProperty("stringFieldOption")) {
                if (fieldInfo.stringFieldOption === "richtext") {
                  var params = {
                    'class': 'ee-inputField ee-inputFieldRichText',
                    trim: true,
                    maxLength: maxlength
                  };
                  params['class'] += ' atiRichTextField';
                  params.height = '100%';
                  params.width = '100%';
                  params.name = fieldInfo.fieldName;
                  params.plugins = ['bold', 'italic', 'underline', 'foreColor', 'hiliteColor', '|', 'justifyLeft',
                    'justifyCenter', 'justifyRight', 'justifyFull', '|', 'insertOrderedList', 'insertUnorderedList',
                    'indent', 'outdent', '|', 'createLink'];
                  node = new Editor(params, domConstruct.create("div"));
                  node.startup();
                }
                else if (fieldInfo.stringFieldOption === "textarea") {
                  node = new SimpleTextarea({
                    "class": "ee-inputField ee-inputFieldTextArea",
                    name: fieldInfo.fieldName,
                    maxlength: maxlength
                  }, domConstruct.create("div"));
                }
                else {
                  node = new TextBox({
                    "class": "ee-inputField",
                    name: fieldInfo.fieldName,
                    maxlength: maxlength
                  }, domConstruct.create("div"));
                }
              }
              else {
                node = new TextBox({
                  "class": "ee-inputField",
                  name: fieldInfo.fieldName,
                  maxlength: maxlength
                }, domConstruct.create("div"));

              }
              nodes.push(node);
              break;
              // todo: check for more types
            case "esriFieldTypeSmallInteger":
            case "esriFieldTypeInteger":
              node = new NumberTextBox({
                "class": "ee-inputField",
                name: fieldInfo.fieldName,
                constraints: { places: 0 }
              }, domConstruct.create("div"));

              nodes.push(node);

              break;
            case "esriFieldTypeSingle":
            case "esriFieldTypeDouble":
              node = new NumberTextBox({
                "class": "ee-inputField",
                name: fieldInfo.fieldName
              }, domConstruct.create("div"));

              nodes.push(node);

              break;
            default:
              node = new TextBox({
                "class": "ee-unsupportField",
                name: fieldInfo.fieldName,
                value: "N/A",
                readOnly: true
              }, domConstruct.create("div"));
              nodes.push(node);
              break;
          }
        }
        array.forEach(nodes, function (node) {
          this.own(on(node, 'change', lang.hitch(this, this._presetChange)));
        }, this);
        return nodes;
      },
      _presetChange: function () {
        this._toggleUsePresetValues(true);
      },
      _deleteFeature: function () {
        if (!this.currentFeature) { return; }

        this._resetEditingVariables();

        var layer = this.currentFeature.getLayer();
        if (layer.url === null) {
          layer.clear();
          this._showTemplate(true);

        } else {
          var processIndicators = query(".processing-indicator");
          var processIndicatorsPanel = query(".processing-indicator-panel");
          var saveBtn = query(".saveButton")[0];
          array.forEach(processIndicators, function (processIndicator) {
            if (!domClass.contains(processIndicator, "busy")) {
              domClass.add(processIndicator, "busy");
            }
          });
          array.forEach(processIndicatorsPanel, function (processIndicator) {
            if (!domClass.contains(processIndicator, "busy")) {
              domClass.add(processIndicator, "busy");
            }
          });
          if (!domClass.contains(saveBtn, "hide")) {
            domClass.add(saveBtn, "hide");
          }

          layer.applyEdits(null, null, [this.currentFeature],
            lang.hitch(this, function (adds, updates, deletes) {
              adds = adds;
              updates = updates;
              if (deletes && deletes.length > 0 && deletes[0].hasOwnProperty("error")) {
                Message({
                  message: deletes[0].error.toString()
                });

              }
              else {
                this.updateFeatures.splice(this.updateFeatures.indexOf(this.currentFeature), 1);

                if (this.updateFeatures && this.updateFeatures.length > 0) {
                  this.attrInspector.refresh();
                  this.attrInspector.first();
                } else {
                  this._showTemplate(true);
                }
              }
              array.forEach(processIndicators, function (processIndicator) {
                if (domClass.contains(processIndicator, "busy")) {
                  domClass.remove(processIndicator, "busy");
                }
              });
              array.forEach(processIndicatorsPanel, function (processIndicator) {
                if (domClass.contains(processIndicator, "busy")) {
                  domClass.remove(processIndicator, "busy");
                }
              });
              if (domClass.contains(saveBtn, "hide")) {
                domClass.remove(saveBtn, "hide");
              }
            }), lang.hitch(this, function (err) {
              Message({
                message: err.message.toString() + "\n" + err.details
              });
              array.forEach(processIndicators, function (processIndicator) {
                if (domClass.contains(processIndicator, "busy")) {
                  domClass.remove(processIndicator, "busy");
                }
              });
              array.forEach(processIndicatorsPanel, function (processIndicator) {
                if (domClass.contains(processIndicator, "busy")) {
                  domClass.remove(processIndicator, "busy");
                }
              });
              if (domClass.contains(saveBtn, "hide")) {
                domClass.remove(saveBtn, "hide");
              }
            }));
        }
      },

      _editGeometry: function () {
        if (this._ignoreEditGeometryToggle) { return; }

        var sw = registry.byId("editGeometrySwitch");

        if (sw && sw.checked) {
          this.map.setInfoWindowOnClick(false);

          if (this.map.infoWindow.isShowing) {
            this.map.infoWindow.hide();
          }

          if (this._editingEnabled === false) {
            this._editingEnabled = true;
            // store the original geometry for later use
            this.currentFeature.origGeom = this.currentFeature.geometry.toJson();
            this._activateEditToolbar(this.currentFeature);
          } else {
            this.editToolbar.deactivate();
            this._editingEnabled = false;
          }
        } else {
          this.map.setInfoWindowOnClick(true);
          this.editToolbar.deactivate();
          this._editingEnabled = false;
        }
      },

      _enableAttrInspectorSaveButton: function (enable) {
        var saveBtn = query(".saveButton")[0];
        if (!saveBtn) { return; }

        if (enable) {
          if (domClass.contains(saveBtn, "jimu-state-disabled")) {
            domClass.remove(saveBtn, "jimu-state-disabled");
          }
        } else {
          if (!domClass.contains(saveBtn, "jimu-state-disabled")) {
            domClass.add(saveBtn, "jimu-state-disabled");
          }
        }
      },

      _getLayerInfoByID: function (id) {

        if (id.indexOf("_lfl") > 0) {
          id = id.replace("_lfl", "");
        }
        var result = null;
        this.config.editor.configInfos.some(function (configInfo) {
          return configInfo.featureLayer.id === id ? ((result = configInfo), true) : false;
        });
        return result;

      },
      _changeFieldToMostRestrictive: function (existingField, newField) {

        if (newField.length && Number(newField.length) && Number(newField.length) > 0) {
          if (existingField.length && Number(existingField.length)) {
            if (newField.length < existingField.length) {
              existingField.length = newField.length;
            }
          }
          else {
            existingField.length = newField.length;
          }
        }
        if (existingField.type === newField.type) {
          switch (newField.type) {
            case "esriFieldTypeString":
              if (existingField.hasOwnProperty("stringFieldOption") && newField.hasOwnProperty("stringFieldOption")) {
                if (existingField.stringFieldOption === "richtext" && newField.stringFieldOption !== "richtext") {
                  existingField.stringFieldOption = newField.stringFieldOption;
                }
                else if (existingField.stringFieldOption === "textarea" && newField.stringFieldOption === "textbox") {
                  existingField.stringFieldOption = newField.stringFieldOption;
                }
              }
              break;
          }
        }
        //stubbed out code to change preset to most restrictive value
        //var lbl = null;
        //if (existingField.type !== newField.type) {
        //  switch (newField.type) {
        //    case "esriFieldTypeString":
        //      if (newField.type === "esriFieldTypeString") {
        //      }
        //      else if (newField.type === "esriFieldTypeString") {
        //      }
        //      else if (newField.type === "esriFieldTypeSmallInteger") {
        //      }
        //      else if (newField.type === "esriFieldTypeInteger") {
        //      }
        //      else if (newField.type === "esriFieldTypeSingle") {
        //      }
        //      else if (newField.type === "esriFieldTypeDouble") {
        //      }
        //      else if (newField.type === "esriFieldTypeGUID") {
        //      }
        //      else if (newField.type === "esriFieldTypeDate") {
        //      }
        //    case "esriFieldTypeSmallInteger":
        //      break;
        //    case "esriFieldTypeInteger":
        //      break;
        //    case "esriFieldTypeSingle":
        //      break;
        //    case "esriFieldTypeDouble":
        //      if (newField.type === "esriFieldTypeString") {
        //      }
        //      else if (newField.type === "esriFieldTypeString") {
        //      }
        //      else if (newField.type === "esriFieldTypeSmallInteger") {
        //        lbl = existingField.label;
        //        existingField = lang.clone(newField);
        //        existingField.label = lbl;
        //      }
        //      else if (newField.type === "esriFieldTypeInteger") {
        //        lbl = existingField.label;
        //        existingField = lang.clone(newField);
        //        existingField.label = lbl;
        //      }
        //      else if (newField.type === "esriFieldTypeSingle") {
        //        lbl = existingField.label;
        //        existingField = lang.clone(newField);
        //        existingField.label = lbl;
        //      }
        //      else if (newField.type === "esriFieldTypeDouble") {
        //      }
        //      else if (newField.type === "esriFieldTypeGUID") {
        //      }
        //      else if (newField.type === "esriFieldTypeDate") {
        //      }
        //      break;
        //    case "esriFieldTypeGUID":
        //      break;
        //    case "esriFieldTypeDate":
        //      break;
        //  }
        //}
        return existingField;
      },
      _fillPresetValueTable: function (editLayerInfos) {
        this._presetFieldInfos = [];

        array.forEach(editLayerInfos, function (layerInfo) {
          // ignore preset values for layer with update features only
          if (!layerInfo.allowUpdateOnly) {
            array.forEach(layerInfo.fieldInfos, function (fieldInfo) {
              if (fieldInfo.canPresetValue) {
                var fieldExists = false;
                // concat aliases if needed
                var idx = fieldInfo.label.indexOf("<a ");
                var fieldLabel = idx < 0 ?
                  fieldInfo.label : fieldInfo.label.substring(0, idx);
                if (fieldLabel === "") {
                  fieldLabel = fieldInfo.fieldName;
                }
                for (var i = 0; i < this._presetFieldInfos.length; i++) {
                  if (this._presetFieldInfos[i].fieldName === fieldInfo.fieldName) {
                    // found the same field name
                    fieldExists = true;
                    // concat fieldAlias if needed
                    if (!editUtils.checkIfFieldAliasAlreadyExists(
                      this._presetFieldInfos[i].label, fieldLabel)) {
                      this._presetFieldInfos[i].label = lang.replace("{alias},{anotherAlias}",
                      {
                        alias: this._presetFieldInfos[i].label,
                        anotherAlias: fieldLabel
                      });
                      break;
                    }
                    this._presetFieldInfos[i] = this._changeFieldToMostRestrictive(this._presetFieldInfos[i],
                      fieldInfo);
                  } //
                }

                // or add to the collection if new
                if (!fieldExists) {
                  var newField = lang.clone(fieldInfo);
                  newField.label = fieldLabel;
                  this._presetFieldInfos.push(newField);

                }
              }
            }, this);
          }
        }, this);
        var presetValueTable = query("#eePresetValueBody")[0];
        // fill the table
        array.forEach(this._presetFieldInfos, lang.hitch(this, function (presetFieldInfo) {
          if (presetFieldInfo.type !== "esriFieldTypeGeometry" &&
            presetFieldInfo.type !== "esriFieldTypeOID" &&
            presetFieldInfo.type !== "esriFieldTypeBlob" &&
            presetFieldInfo.type !== "esriFieldTypeGlobalID" &&
            presetFieldInfo.type !== "esriFieldTypeRaster" &&
            presetFieldInfo.type !== "esriFieldTypeXML") {

            var row = domConstruct.create("tr");
            var label = domConstruct.create("td", { "class": "ee-atiLabel" });
            label.innerHTML = lang.replace('{fieldAlias}',
              {
                fieldAlias: presetFieldInfo.label
              });

            domConstruct.place(label, row);

            var valueColumnNode = domConstruct.create("td",
              { "class": "preset-value-editable" }, row);

            var presetValueNodes = this._createPresetFieldContentNode(presetFieldInfo);
            var dateWidget = null;
            var timeWidget = null;
            array.forEach(presetValueNodes, function (presetValueNode) {
              if (presetValueNode.declaredClass === "dijit.form.DateTextBox") {
                dateWidget = presetValueNode;
              }
              if (presetValueNode.declaredClass === "dijit.form.TimeTextBox") {
                timeWidget = presetValueNode;
              }
              domConstruct.place(presetValueNode.domNode, valueColumnNode, "last");
            }, this);
            if (dateWidget !== null) {
              this.own(on(label, 'click', lang.hitch(this, this._dateClick(dateWidget, timeWidget))));
            }
            presetValueTable.appendChild(row);
          }
        }));
      },

      _dateClick: function (dateWidget, timeWidget) {
        return function () {
          if (dateWidget !== undefined && dateWidget !== null) {
            dateWidget.set('value', new Date());
          }
          if (timeWidget !== undefined && timeWidget !== null) {
            timeWidget.set('value', new Date());
          }
        };

      },
      _getEditableLayers: function (layerInfos, allLayers) {
        var layers = [];
        array.forEach(layerInfos, function (layerInfo) {
          if (!layerInfo.allowUpdateOnly || allLayers) { //
            var layerObject = this.map.getLayer(layerInfo.featureLayer.id);
            if (layerObject &&
               layerObject.visible &&
               layerObject.isVisibleAtScale(this.map.getScale()) &&
               layerObject.isEditable &&
               layerObject.isEditable()) {
              layers.push(layerObject);
            }
          }
        }, this);

        return layers;
      },
      _getEditableLayersInfos: function (layerInfos, allLayers) {
        var layers = [];
        array.forEach(layerInfos, function (layerInfo) {
          if (!layerInfo.allowUpdateOnly || allLayers) { //
            var layerObject = this.map.getLayer(layerInfo.featureLayer.id);
            if (layerObject &&
               layerObject.visible &&
               layerObject.isVisibleAtScale(this.map.getScale()) &&
               layerObject.isEditable &&
               layerObject.isEditable()) {
              layers.push(layerInfo);
            }
          }
        }, this);

        return layers;
      },
      _getLayerInfoForLocalLayer: function (localLayer) {

        var result = this._getLayerInfoByID(localLayer.originalLayerId);
        var layerInfo;

        if (result !== null) {//(layerObject.type === "Feature Layer" && layerObject.url) {
          // get the fieldInfos
          layerInfo = {};
          for (var k in result) {
            if (result.hasOwnProperty(k) && k !== 'featureLayer' && k !== 'layerInfo') {
              layerInfo[k] = lang.clone(result[k]);
            }
          }

          layerInfo.featureLayer = localLayer;

        }
        return layerInfo;
      },
      _getSelectionSymbol: function (geometryType, highlight) {
        if (!geometryType || geometryType === "") { return null; }

        var selectionSymbol;
        switch (geometryType) {
          case "esriGeometryPoint":
            if (highlight === true) {
              selectionSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,
                                20,
                                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([0, 230, 169, 1]), 2),
                                new Color([0, 230, 169, 0.65]));
            } else {
              selectionSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,
                                20,
                                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([92, 92, 92, 1]), 2),
                                 new Color([255, 255, 0, 0.65]));
            }
            break;
          case "esriGeometryPolyline":
            if (highlight === true) {
              selectionSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([0, 255, 255, 0.65]), 2);
            } else {
              selectionSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([0, 230, 169, 0.65]), 2);
            }
            break;
          case "esriGeometryPolygon":
            var line;
            if (highlight === true) {
              selectionSymbol = new SimpleFillSymbol().setColor(new Color([0, 230, 169, 0.65]));
              line = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([192, 192, 192, 1]), 2);
            } else { // yellow with black outline
              selectionSymbol = new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.65]));
              line = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([192, 192, 192, 1]), 2);
            }
            selectionSymbol.setOutline(line);
            break;
        }
        return selectionSymbol;
      },
      _hasPresetValueFields: function (layerInfos) {
        return layerInfos.some(function (layerInfo) {
          if (layerInfo.allowUpdateOnly === false) {
            if (layerInfo.fieldInfos) {
              return layerInfo.fieldInfos.some(function (fi) {
                return fi.canPresetValue === true;
              });
            }
            else {
              return false;
            }
          }
          else {
            return false;
          }
        }, this);

      },

      _initPresetFieldsTable: function () {
        var presetValueTableNode = domConstruct.create("div", { "class": "ee-presetValueTableDiv templatePicker" },
          this.presetFieldsTableNode);

        var bodyDiv = domConstruct.create("div", { "class": "bodyDiv" }, presetValueTableNode);
        var bodyTable = domConstruct.create("table",
          { "class": "ee-presetValueBodyTable" }, bodyDiv);

        domConstruct.create("tbody", { "class": "ee-presetValueBody", "id": "eePresetValueBody" },
          bodyTable, "first");
      },

      _setPresetValueValue: function (fieldName, value) {
        var presetValueTable = query("#eePresetValueBody")[0];
        if (presetValueTable) {
          var inputElements = query(".preset-value-editable .ee-inputField");
          array.forEach(inputElements, lang.hitch(this, function (ele) {

            if (!domClass.contains(ele, "dijitTimeTextBox")) {
              var elem = dijit.byNode(ele);
              if (elem !== undefined && elem !== null) {
                if (elem.get("name") === fieldName) {
                  elem.set("value", value);
                }

              }
              //else {
              //  var element = query("input[type='hidden']", ele);
              //  if (!element || element.length === 0) {
              //    element = query("input", ele);
              //  }
              //  if (element[0].name === fieldName) {
              //    element[0].value = value;
              //  }
              //}
            }
          }));
        }
      },
      _modifyAttributesWithPresetValues: function (attributes, newTempLayerInfos) {
        var presetValueTable = query("#eePresetValueBody")[0];
        var presetFieldInfos = array.filter(newTempLayerInfos.fieldInfos, function (fieldInfo) {
          return (fieldInfo.canPresetValue === true);

        });
        var presetFields = array.map(presetFieldInfos, function (presetFieldInfo) {
          return presetFieldInfo.fieldName;
        });
        if (presetValueTable) {
          var inputElements = query(".preset-value-editable .ee-inputField");
          array.forEach(inputElements, lang.hitch(this, function (ele) {

            var elem = dijit.byNode(ele);
            var dateVal = null;
            if (elem.declaredClass !== "dijit.form.TimeTextBox") {
              var valToSet = elem.get("value");
              if (valToSet !== undefined && valToSet !== null && valToSet !== "") {

                if (elem.declaredClass === "dijit.form.DateTextBox") {
                  var timeElement = query(".dijitTimeTextBox", ele.parentNode)[0];
                  // retrieve the value
                  dateVal = new Date(valToSet);
                  if (dateVal.toString() !== "Invalid Date") {
                    if (timeElement !== undefined && timeElement !== null) {
                      var timVal = new Date(dijit.byNode(timeElement).get("value"));
                      if (timVal.toString() !== "Invalid Date") {
                        dateVal.setHours(timVal.getHours());
                        dateVal.setMinutes(timVal.getMinutes());
                        dateVal.setSeconds(timVal.getSeconds());
                        valToSet = dateVal.getTime();
                      }
                    } else {
                      valToSet = dateVal.getTime();
                    }
                  }
                }
                // set the attribute value
                if (valToSet !== undefined && valToSet !== null && valToSet !== "") {
                  for (var attribute in attributes) {
                    if (attributes.hasOwnProperty(attribute) &&
                      attribute === elem.get("name") &&
                      presetFields.indexOf(elem.get("name")) >= 0) {
                      attributes[attribute] = valToSet;
                      break;
                    }
                  }
                }

              }
            }
          }));
        }
      },

      // to add (*) to the label of required fields
      // also add field type and domain to use in the preset values
      processConfigForRuntime: function (configInfo) {

        if (!configInfo) {
          return;
        }
        configInfo.fieldInfos = array.filter(configInfo.fieldInfos, function (fieldInfo) {
          if (fieldInfo.type === "esriFieldTypeBlob" ||
           fieldInfo.type === "esriFieldTypeGlobalID" ||
           fieldInfo.type === "esriFieldTypeRaster" ||
           fieldInfo.type === "esriFieldTypeXML") {//fieldInfo.type === "esriFieldTypeGeometry" || fieldInfo.type === "esriFieldTypeOID" ||
            return false;
          }
          if (fieldInfo.nullable === false && fieldInfo.editable === true) {
            if (fieldInfo.label.indexOf('<a class="asteriskIndicator">') < 0) {
              fieldInfo.label = fieldInfo.label +
                '<a class="asteriskIndicator"> *</a>';
            }
          }
          if (fieldInfo.isEditable === true) {
            return true;
          }
          else {
            return fieldInfo.visible;
          }
        });
      },

      _newAttrInspectorNeeded: function () {
        var yes = false;

        if (!this.attrInspector || this.attrInspector.layerInfos.length > 1) {
          yes = true;
        } else { //this.attrInspector.layerInfos.length == 1

          var lflId = this.attrInspector.layerInfos[0].featureLayer.id;
          if (lflId.indexOf("_lfl") > 0) { // attrInspector associated with a local feature
            yes = lflId.indexOf(this.templatePicker.getSelected().featureLayer.id) < 0;
          } else {

            yes = true;
          }
        }

        if (yes && this.attrInspector) {
          this.attrInspector.destroy();
          this.attrInspector = null;
        }
        else {
          if (this._attachmentUploader && this._attachmentUploader !== null) {
            this._attachmentUploader.clear();
          }
        }
        return yes;
      },

      _onMapClick: function (evt) {
        if (this._byPass && this._byPass === true) {
          this._byPass = false;
          return;
        }
        var hasTemplate = false;
        if (this.templatePicker) {
          hasTemplate = this.templatePicker.getSelected() ? true : false;
        }
        if (!this._attrInspIsCurrentlyDisplayed &&
          evt.graphic &&
          hasTemplate === false) {
          this._processOnMapClick(evt);
        }
      },
      _attachmentsComplete: function (featureLayer, oid, deferred) {
        return function (results) {
          var errorMsg = "";
          array.forEach(results, function (result) {
            if (result) {
              if (result.state === "rejected") {
                if (result.error && esriLang.isDefined(result.error.code)) {
                  if (result.error.code === 400) {
                    // 400 is returned for unsupported attachment file types
                    errorMsg = errorMsg +
                      esriBundle.widgets.attachmentEditor.NLS_fileNotSupported + "<br/>";
                  } else {
                    errorMsg = errorMsg + result.error.message ||
                      (result.error.details &&
                      result.error.details.length &&
                      result.error.details[0]) + "<br/>";
                  }

                }
              }
            }
          }, this);
          if (errorMsg !== "") {
            var dialog = new Popup({
              titleLabel: this.nls.attachmentLoadingError,
              width: 400,
              maxHeight: 200,
              autoHeight: true,
              content: errorMsg,
              buttons: [{
                label: this.nls.back,
                classNames: ['jimu-btn'],
                onClick: lang.hitch(this, function () {
                  dialog.close();
                })
              }],
              onClose: lang.hitch(this, function () {

              })
            });
          }
          return this._completePost(featureLayer, oid, deferred);
        };

      },
      _completePost: function (featureLayer, oid, deferred) {
        this._createAttributeInspector([this.currentLayerInfo]);
        var query = new Query();
        query.objectIds = [oid];
        featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
        this._showTemplate(false);
        deferred.resolve("success");
      },
      // posts the currentFeature's changes
      _postChanges: function (feature) {
        var deferred = new Deferred();
        var ruleInfo;
        var k = null;
        if (feature) {
          if (this._smartAttributes !== undefined && this._smartAttributes !== null) {
            for (k in feature.attributes) {
              if (feature.attributes.hasOwnProperty(k) === true) {
                ruleInfo = this._smartAttributes.validateField(k);
                if (ruleInfo[1] === 'Hide' && ruleInfo[3] !== true) {
                  delete feature.attributes[k];
                }
              }
            }
          }
          for (k in feature.attributes) {
            if (feature.attributes.hasOwnProperty(k) === true) {
              if (feature.attributes[k] === "") {
                feature.attributes[k] = null;
              }
            }
          }
          feature.attributes = this._attributeInspectorTools._checkFeatureData(feature.attributes);
          var featureLayer = null;
          var postDef = null;
          if (feature.getLayer().originalLayerId) {
            // added feature
            featureLayer = this.map.getLayer(feature.getLayer().originalLayerId);
            if (featureLayer) {
              // modify some attributes before calling applyEdits
              delete feature.attributes[featureLayer.objectIdField];
              feature.symbol = null;

              postDef = featureLayer.applyEdits([feature], null, null);
              this.addDeferred(postDef, feature, featureLayer, deferred);
            } // if featureLayer not null
          } else {
            // update existing feature
            // only get the updated attributes
            var featureForUpdate = null;
            if (this.geometryChanged !== undefined &&
              this.geometryChanged !== null &&
              this.geometryChanged === true) {
              featureForUpdate = new Graphic(feature.geometry, null, null);
              //featureForUpdate.geometry = feature.geometry;
            }
            else {
              featureForUpdate = new Graphic(null, null, null);
            }
            featureLayer = feature.getLayer();
            feature.attributes = this._attributeInspectorTools._checkFeatureData(feature.attributes);
            feature.preEditAttrs = this._attributeInspectorTools._checkFeatureData(feature.preEditAttrs);
            var newAttrs = editUtils.filterOnlyUpdatedAttributes(
              feature.attributes, feature.preEditAttrs, featureLayer);

            if (newAttrs && !editUtils.isObjectEmpty(newAttrs)) {
              // there are changes in attributes
              featureForUpdate.attributes = newAttrs;
            } else {
              featureForUpdate.attributes = []; // ?
            }
            feature.symbol = null;
            postDef = feature.getLayer().applyEdits(null, [featureForUpdate], null);
            this.addDeferred(postDef, feature, featureLayer, deferred);
          }
        } else {
          deferred.resolve();
        }
        return deferred.promise;
      },
      addDeferred: function (postDef, feature, featureLayer, deferred) {
        postDef.then(lang.hitch(this, function (added, updated) {
          // sometimes a successfully update returns an empty array
          if (updated && updated.length > 0 && updated[0].hasOwnProperty("error")) {
            Message({
              message: updated[0].error.toString()
            });
            deferred.resolve("failed");
          }
          else if (updated && updated.length > 0) {
            feature.preEditAttrs = JSON.parse(JSON.stringify(feature.attributes));
            featureLayer.refresh();

            deferred.resolve("success");
          }
          else if (added && added.length > 0 && added[0].hasOwnProperty("error")) {

            Message({
              message: added[0].error.toString()
            });
            deferred.resolve("failed");
          }
          else if (added && added.length > 0) {
            feature.preEditAttrs = JSON.parse(JSON.stringify(feature.attributes));
            var defs = null;
            if (this._attachmentUploader) {
              defs = this._attachmentUploader.postAttachments(featureLayer, added[0].objectId);
            }
            if (defs === undefined || defs === null || defs.length === 0) {
              this._completePost(featureLayer, added[0].objectId, deferred);
            }
            else {
              all(defs).then(lang.hitch(this,
                this._attachmentsComplete(featureLayer, added[0].objectId, deferred)));
            }
          }
        }), lang.hitch(this, function (err) {
          Message({
            message: err.message.toString() + "\n" + err.details
          });
          deferred.resolve("failed");
        }));
      },

      _processOnMapClick: function (evt) {
        // viewing/editing existing features
        // The logic of adding new feature to local layer is handled
        // in the draw end event of the draw tool

        this.map.infoWindow.hide();
        // recreate the attr inspector if needed
        this._createAttributeInspector(this.config.editor.configInfos);

        var layers = this.map.getLayersVisibleAtScale().filter(lang.hitch(this, function (lyr) {
          if (lyr.type && lyr.type === "Feature Layer" && lyr.url) {
            return array.some(this.config.editor.configInfos, function (configInfo) {
              if (configInfo.layerId === lyr.id &&
                configInfo.configFeatureLayer.layerAllowsUpdate === true) {
                return true;
              }
              else {
                return false;
              }
            });
          }
          else {
            return false;
          }
        }));

        var updateFeatures = [];
        var deferreds = [];
        this.currentFeature = null;
        this.geometryChanged = false;
        this.currentLayerInfo = null;
        array.forEach(layers, lang.hitch(this, function (layer) {
          // set selection symbol
          layer.setSelectionSymbol(this._getSelectionSymbol(layer.geometryType, false));
          var selectQuery = new Query();
          selectQuery.geometry = editUtils.pointToExtent(this.map, evt.mapPoint, 20);
          var deferred = layer.selectFeatures(selectQuery,
            FeatureLayer.SELECTION_NEW,
            lang.hitch(this, function (features) {
              var OIDsToRemove = [];
              var validFeatures = [];
              array.forEach(features, function (feature) {
                var featureValid = true;
                feature.allowDelete = true;
                //if (layer.hasOwnProperty("ownershipBasedAccessControlForFeatures") &&
                //  layer.ownershipBasedAccessControlForFeatures) {
                //  if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowOthersToUpdate")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowOthersToUpdate === false && this._user) {
                //      if (feature.attributes[layer.editFieldsInfo.creatorField] !== this._user) {
                //        OIDsToRemove.push(feature.attributes[layer.objectIdField]);
                //        featureValid = false;
                //      }
                //    }
                //  }
                //  if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowOthersToUpdate") &&
                //    layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowAnonymousToUpdate")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowOthersToUpdate === false &&
                //      layer.ownershipBasedAccessControlForFeatures.allowAnonymousToUpdate === true &&
                //      this._user === null) {
                //      if (feature.attributes[layer.editFieldsInfo.creatorField] !== null &&
                //         feature.attributes[layer.editFieldsInfo.creatorField] !== "") {
                //        OIDsToRemove.push(feature.attributes[layer.objectIdField]);
                //        featureValid = false;
                //      }
                //    }
                //  }
                //  else if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowAnonymousToUpdate")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowAnonymousToUpdate === false &&
                //      this._user === null) {
                //      OIDsToRemove.push(feature.attributes[layer.objectIdField]);
                //      featureValid = false;
                //    }
                //  }
                //  if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowOthersToDelete")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowOthersToDelete === false &&
                //      this._user) {
                //      if (feature.attributes[layer.editFieldsInfo.creatorField] !== this._user) {
                //        feature.allowDelete = false;
                //      }
                //    }
                //  }
                //  if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowOthersToDelete") &&
                //  layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowAnonymousToDelete")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowOthersToDelete === false &&
                //      layer.ownershipBasedAccessControlForFeatures.allowAnonymousToDelete === true &&
                //      this._user === null) {
                //      if (feature.attributes[layer.editFieldsInfo.creatorField] !== null &&
                //          feature.attributes[layer.editFieldsInfo.creatorField] !== "") {
                //        OIDsToRemove.push(feature.attributes[layer.objectIdField]);
                //        featureValid = false;
                //      }
                //    }
                //  }
                //  else if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowAnonymousToDelete")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowAnonymousToDelete === false &&
                //      this._user === null) {
                //      feature.allowDelete = false;
                //    }
                //  }
                //}

                //The below is the preferred way, but this fails on public services and the user is logged in

                if (!layer.getEditCapabilities({ feature: feature }).canUpdate) {
                  //feature.allowDelete = false;
                  OIDsToRemove.push(feature.attributes[layer.objectIdField]);
                  featureValid = false;
                }
                else if (!layer.getEditCapabilities({ feature: feature }).canDelete) {
                  feature.allowDelete = false;
                }
                if (featureValid === true) {
                  feature.preEditAttrs = JSON.parse(JSON.stringify(feature.attributes));
                  validFeatures.push(feature);
                }
              }, this);
              if (OIDsToRemove.length > 0) {
                var subQuery = new Query();
                subQuery.objectIds = OIDsToRemove;
                var subDef = layer.selectFeatures(subQuery, FeatureLayer.SELECTION_SUBTRACT,
                  lang.hitch(this, function (features) {
                    console.log(features.length);
                  }));
                deferreds.push(subDef);
              }
              updateFeatures = updateFeatures.concat(validFeatures);

            }));
          deferreds.push(deferred);
        }));
        if (deferreds.length === 0) {
          this._byPass = true;
          this.map.popupManager._showPopup(evt);
          this._byPass = false;
        }
        else {
          all(deferreds).then(lang.hitch(this, function () {
            this.updateFeatures = updateFeatures;
            if (this.updateFeatures.length > 0) {
              this._showTemplate(false);
            }
            else {
              this._byPass = true;
              this.map.popupManager._showPopup(evt);
              this._byPass = false;
            }
          }));
        }

      },
      _attachLayerHandler: function () {

        if (this.layerHandle) {
          this.layerHandle.remove();
        }
        this.layerHandle = on(this.currentFeature._layer, 'selection-clear',
          lang.hitch(this, this._layerChangeOutside));
        this.own(this.layerHandle);
      },
      _postFeatureSave: function (evt) {
        if (this.updateFeatures && this.updateFeatures.length > 1) {
          array.forEach(this.updateFeatures, lang.hitch(this, function (feature) {
            feature.setSymbol(this._getSelectionSymbol(feature.getLayer().geometryType, false));
          }));
        }
        if (evt && evt.feature) {
          this.geometryChanged = false;
          this.currentFeature = evt.feature;
          this._attachLayerHandler();
          this.currentLayerInfo = this._getLayerInfoByID(this.currentFeature._layer.id);
          this.currentLayerInfo.isCache = false;
          this._createSmartAttributes();
          this._createAttributeInspectorTools();
          this._attributeInspectorTools.triggerFormValidation();
          this._validateAttributes();
          this._enableAttrInspectorSaveButton(false);
          if (this.currentFeature.hasOwnProperty("allowDelete")) {
            this._toggleDeleteButton(this.currentFeature.allowDelete && this.currentLayerInfo.allowDelete);
          }
          else {
            this._toggleDeleteButton(this.currentLayerInfo.allowDelete);
          }
          this._toggleEditGeoSwitch(this.currentLayerInfo.disableGeometryUpdate ||
                             !this.currentLayerInfo.configFeatureLayer.layerAllowsUpdate);
          //|| this.currentLayerInfo.featureLayer.hasZ || this.currentLayerInfo.featureLayer.hasM
          this.currentFeature.setSymbol(
            this._getSelectionSymbol(evt.feature.getLayer().geometryType, true));
          if (this.currentLayerInfo.editDescription && this.currentLayerInfo.editDescription !== null) {
            this.editDescription.innerHTML = this.currentLayerInfo.editDescription;
            this.editDescription.style.display = "block";
          }
          else {
            this.editDescription.style.display = "none";
          }
        }

      },

      _promptToDelete: function () {

        var dialog = new Popup({
          titleLabel: this.nls.deletePromptTitle,
          width: 400,
          maxHeight: 200,
          autoHeight: true,
          content: this.nls.deletePrompt,
          buttons: [{
            label: this.nls.yes,
            classNames: ['jimu-btn'],
            onClick: lang.hitch(this, function () {
              this._deleteFeature();
              dialog.close();

            })
          }, {
            label: this.nls.no,
            classNames: ['jimu-btn'],

            onClick: lang.hitch(this, function () {

              dialog.close();

            })
          }

          ],
          onClose: lang.hitch(this, function () {

          })
        });
      },
      _promptToResolvePendingEdit: function (switchToTemplate, evt, showClose) {
        var disable = !this._validateAttributes();
        var buttons = [{
          label: this.nls.yes,
          classNames: ['jimu-btn'],
          disable: disable,
          onClick: lang.hitch(this, function () {
            this._saveEdit(this.currentFeature, switchToTemplate).then(function () {
            });
            this._postFeatureSave(evt);
            this._activateTemplateToolbar();
            dialog.close();

          })
        }, {
          label: this.nls.no,
          classNames: ['jimu-btn'],

          onClick: lang.hitch(this, function () {
            this._cancelEditingFeature(switchToTemplate);
            this._postFeatureSave(evt);
            this._activateTemplateToolbar();
            dialog.close();

          })
        }];
        if (showClose && showClose === true) {
          buttons.push({
            label: this.nls.back,
            classNames: ['jimu-btn'],
            onClick: lang.hitch(this, function () {
              dialog.close();
            })
          });
        }

        var dialog = new Popup({
          titleLabel: this.nls.savePromptTitle,
          width: 400,
          maxHeight: 200,
          autoHeight: true,
          content: this.nls.savePrompt,
          buttons: buttons,
          onClose: lang.hitch(this, function () {

          })
        });

      },

      _removeLocalLayers: function () {
        if (this.cacheLayer && this.cacheLayer !== null) {
          this.cacheLayer.clearSelection();
          this.cacheLayer.clear();
          this.map.removeLayer(this.cacheLayer);
          this.cacheLayer = null;
        }
        this.updateFeatures = [];
        //var mymap = this.map;
        //if (mymap) {
        //  var filteredID = mymap.graphicsLayerIds.filter(function (e) {
        //    return e.lastIndexOf("_lfl") > 0;
        //  });
        //  var mappedArr = array.map(filteredID, function (e) {
        //    return mymap.getLayer(e);
        //  });
        //  array.forEach(mappedArr, function (e) {
        //    mymap.removeLayer(e);
        //  });

        //  this.updateFeatures = [];
        //}
      },

      _removeSpacesInLayerTemplates: function (layer) {
        if (!layer) { return; }

        var filteredFields = array.filter(layer.fields, lang.hitch(this, function (field) {
          return field.nullable === false && field.editable === true;
        }));
        array.forEach(filteredFields, lang.hitch(this, function (f) {
          // trim of space in the field value
          array.forEach(layer.templates, function (t) {
            if (t.prototype.attributes[f.name] === " ") {
              t.prototype.attributes[f.name] = t.prototype.attributes[f.name].trim();
            }
          });
        }));
      },

      _resetEditingVariables: function () {
        this._isDirty = false;
        this._editingEnabled = false;
        if (this.editToolbar) {
          this.editToolbar.deactivate();
        }
        //this._turnEditGeometryToggleOff();
      },

      // perform validation then post the changes or formatting the UI if errors
      // no confirm dialog involved
      _saveEdit: function (feature, switchToTemplate) {
        var deferred = new Deferred();
        // disable the save button even if the saving is done
        this._enableAttrInspectorSaveButton(false);
        this._turnEditGeometryToggleOff();
        if (this._validateAttributes()) {
          var processIndicators = query(".processing-indicator");
          var processIndicatorsPanel = query(".processing-indicator-panel");
          var saveBtn = query(".saveButton")[0];
          array.forEach(processIndicators, function (processIndicator) {
            if (!domClass.contains(processIndicator, "busy")) {
              domClass.add(processIndicator, "busy");
            }
          });
          array.forEach(processIndicatorsPanel, function (processIndicator) {
            if (!domClass.contains(processIndicator, "busy")) {
              domClass.add(processIndicator, "busy");
            }
          });
          if (!domClass.contains(saveBtn, "hide")) {
            domClass.add(saveBtn, "hide");
          }
          // call applyEdit
          this._postChanges(feature).then(lang.hitch(this, function (e) {
            if (e === "failed") {
              deferred.resolve("failed");
            }
            else {
              // if currently only one selected feature
              if (this.config.editor.removeOnSave && this.updateFeatures.length === 1) {
                switchToTemplate = true;
              }
              if (switchToTemplate && switchToTemplate === true) {
                this._showTemplate(true);
              } else {
                this._resetEditingVariables();
                this.map.setInfoWindowOnClick(true);
                if (this.config.editor.removeOnSave === true) {
                  var layer = feature.getLayer();
                  // perform a new query
                  var query = new Query();
                  query.objectIds = [feature.attributes[layer.objectIdField]];
                  layer.selectFeatures(query, FeatureLayer.SELECTION_SUBTRACT,
                    lang.hitch(this, function () {
                      this.updateFeatures.splice(this.updateFeatures.indexOf(feature), 1);
                      this.attrInspector.next();
                    }));
                } else {
                  // reselect the feature
                  if (this.currentFeature.hasOwnProperty("allowDelete")) {
                    this._toggleDeleteButton(this.currentFeature.allowDelete &&
                      this.currentLayerInfo.allowDelete);
                  }
                  else {
                    this._toggleDeleteButton(this.currentLayerInfo.allowDelete &&
                      this.currentLayerInfo.configFeatureLayer.layerAllowsDelete);
                  }
                  this._toggleEditGeoSwitch(this.currentLayerInfo.disableGeometryUpdate ||
                    !this.currentLayerInfo.configFeatureLayer.layerAllowsUpdate);
                  //|| this.currentLayerInfo.featureLayer.hasZ || this.currentLayerInfo.featureLayer.hasM

                  feature.setSymbol(this._getSelectionSymbol(
                    feature.getLayer().geometryType, true));
                }
              }
              deferred.resolve("success");
            }
            array.forEach(processIndicators, function (processIndicator) {
              if (domClass.contains(processIndicator, "busy")) {
                domClass.remove(processIndicator, "busy");
              }
            });
            array.forEach(processIndicatorsPanel, function (processIndicator) {
              if (domClass.contains(processIndicator, "busy")) {
                domClass.remove(processIndicator, "busy");
              }
            });
            if (domClass.contains(saveBtn, "hide")) {
              domClass.remove(saveBtn, "hide");
            }
          }), lang.hitch(this, function () {
            array.forEach(processIndicators, function (processIndicator) {
              if (domClass.contains(processIndicator, "busy")) {
                domClass.remove(processIndicator, "busy");
              }
            });
            array.forEach(processIndicatorsPanel, function (processIndicator) {
              if (domClass.contains(processIndicator, "busy")) {
                domClass.remove(processIndicator, "busy");
              }
            });
            if (domClass.contains(saveBtn, "hide")) {
              domClass.remove(saveBtn, "hide");
            }
            //deferred.resolve("failed");
          }));
        }
        //else
        //{
        //  this._formatErrorFields(errorObj);

        //  deferred.resolve("failed");
        //}
        return deferred.promise;
      },

      _showTemplate: function (showTemplate) {
        this._attrInspIsCurrentlyDisplayed = !showTemplate;
        if (showTemplate) {
          this._mapClickHandler(true);
          this._showTemplatePicker();

          // esriBundle.widgets.attachmentEditor.NLS_attachments = this._orignls;
        } else {
          //esriBundle.widgets.attachmentEditor.NLS_attachments = this._orignls + " " + this.nls.attachmentSaveDeleteWarning;
          this._mapClickHandler(false);
          //show attribute inspector
          query(".jimu-widget-smartEditor .templatePickerMainDiv")[0].style.display = "none";
          query(".jimu-widget-smartEditor .attributeInspectorMainDiv")[0].style.display = "block";

          if (this.attrInspector) {

            if (!this.currentFeature) {
              this.attrInspector.first();
            }
            this._createSmartAttributes();
            this._createAttributeInspectorTools();
            this.attrInspector.refresh();
            this._attributeInspectorTools.triggerFormValidation();
            //this._sytleFields(this.attrInspector);
            if (this.currentFeature.getLayer().originalLayerId) {
              this._enableAttrInspectorSaveButton(this._validateAttributes());
            } else {
              this._enableAttrInspectorSaveButton(false);
            }
            if (this.currentLayerInfo.editDescription && this.currentLayerInfo.editDescription !== null) {
              this.editDescription.innerHTML = this.currentLayerInfo.editDescription;
              this.editDescription.style.display = "block";
            }
            else {
              this.editDescription.style.display = "none";
            }
            if (this.currentLayerInfo.isCache && this.currentLayerInfo.isCache === true) {
              this._toggleEditGeoSwitch(false);
            }
            else {
              this._toggleEditGeoSwitch(this.currentLayerInfo.disableGeometryUpdate ||
                    !this.currentLayerInfo.configFeatureLayer.layerAllowsUpdate);
              //|| this.currentLayerInfo.featureLayer.hasZ || this.currentLayerInfo.featureLayer.hasM

            }
            this._addWarning();
          }
          this._recordLoadeAttInspector();
        }


      },
      _createAttributeInspectorTools: function () {
        if (this.currentFeature === undefined || this.currentFeature === null) {
          return;
        }
        var attTable = query("td.atiLabel", this.attrInspector.domNode);
        if (attTable === undefined || attTable === null) {
          return;
        }
        var attributeInspectorToolsParams = {
          _attrInspector: this.attrInspector,
          _feature: this.currentFeature,
          _fieldInfo: this.currentLayerInfo.fieldInfos
        };
        this._attributeInspectorTools = new attributeInspectorTools(attributeInspectorToolsParams);

      },
      _createSmartAttributes: function () {
        if (this.currentFeature === undefined || this.currentFeature === null) {
          return;
        }
        var attTable = query("td.atiLabel", this.attrInspector.domNode);
        if (attTable === undefined || attTable === null) {
          return;
        }
        var fieldValidation = null;
        if (this.currentLayerInfo !== undefined && this.currentLayerInfo !== null) {
          if (this.currentLayerInfo.fieldValidations !== undefined &&
            this.currentLayerInfo.fieldValidations !== null) {
            fieldValidation = this.currentLayerInfo.fieldValidations;
          }
        }
        if (fieldValidation === null) {
          return;
        }

        var smartAttParams = {
          _attrInspector: this.attrInspector,
          _fieldValidation: fieldValidation,
          _feature: this.currentFeature,
          _fieldInfo: this.currentLayerInfo.fieldInfos
        };
        this._smartAttributes = new smartAttributes(smartAttParams);

      },
      _showTemplatePicker: function () {

        // hide the attr inspector and show the main template picker div
        query(".jimu-widget-smartEditor .attributeInspectorMainDiv")[0].style.display = "none";
        query(".jimu-widget-smartEditor .templatePickerMainDiv")[0].style.display = "block";

        if (this.templatePicker) {
          if (this.config.editor.hasOwnProperty("keepTemplateSelected")) {
            if (this.config.editor.keepTemplateSelected !== true) {
              this.templatePicker.clearSelection();
            }
          } else {
            this.templatePicker.clearSelection();
          }
          if (this.templatePicker) {
            this.templatePicker.update();
          }
        }
        this._resetEditingVariables();

        var layersRefresh = [];
        if (this.updateFeatures) {
          array.forEach(this.updateFeatures, lang.hitch(this, function (feature) {
            var layer = feature.getLayer();
            if (layersRefresh && layersRefresh.indexOf(layer.id) === -1) {
              layersRefresh.push(layer.id);
              layer.clearSelection();
              layer.refresh();
            }

          }));
        }
        this.currentFeature = null;
        this.geometryChanged = false;
        this.currentLayerInfo = null;
        this._removeLocalLayers();
        if (this._recreateOnNextShow === true) {
          this._recreateOnNextShow = false;
          this._createEditor();
        }
        if (this._creationDisabledOnAll) {
          if (this.templatePicker) {
            dojo.style(this.templatePicker.domNode, "display", "none");
          }

        } else {
          if (this.templatePicker) {
            dojo.style(this.templatePicker.domNode, "display", "block");
          }
        }

        this._activateTemplateToolbar();
        //this.templatePicker.update();
      },

      _setPresetValue: function () {
        var sw = registry.byId("savePresetValueSwitch");
        this._usePresetValues = sw.checked;
      },
      _toggleUsePresetValues: function (checked) {
        var sw = registry.byId("savePresetValueSwitch");
        sw.set('checked', checked === null ? !sw.checked : checked);
        this._usePresetValues = sw.checked;
      },
      _turnEditGeometryToggleOff: function () {

        if (this._editGeomSwitch && this._editGeomSwitch.checked) {
          if (this.editToolbar) {
            this.editToolbar.deactivate();
          }
          this._editingEnabled = false;
          this._ignoreEditGeometryToggle = true;
          this._editGeomSwitch.set("checked", false);
          this.map.setInfoWindowOnClick(true);
          setTimeout(lang.hitch(this, function () {
            this._ignoreEditGeometryToggle = false;
          }), 2);
        }
      },

      // todo: modify to feature as input parameter?
      _validateRequiredFields: function () {
        var errorObj = {};

        if (!this.currentFeature) { return errorObj; }

        var layer = this.currentFeature.getLayer();

        var filteredFields = array.filter(layer.fields, lang.hitch(this, function (field) {
          return field.nullable === false && field.editable === true;
        }));

        array.forEach(filteredFields, lang.hitch(this, function (f) {
          if (this.currentFeature.attributes[f.name] === "undefined") {
            errorObj[f.alias] = "undefined";
          }
          else if (this.currentFeature.attributes[f.name] === null) {
            errorObj[f.alias] = "null";
          }
          else {
            switch (f.type) {
              case "esriFieldTypeString":
                if (this.currentFeature.attributes[f.name] === "" ||
                    (this.currentFeature.attributes[f.name] &&
                    this.currentFeature.attributes[f.name].trim() === "")) {
                  errorObj[f.alias] = "Empty string";
                }
                break;
              default:
                break;
            }
          }
        }));
        return errorObj;
      },

      _worksAfterClose: function () {
        // restore the default string of mouse tooltip
        esriBundle.toolbars.draw.start = this._defaultStartStr;
        esriBundle.toolbars.draw.addPoint = this._defaultAddPointStr;

        // show lable layer.
        //var labelLayer = this.map.getLayer("labels");
        //if (labelLayer) {
        //  labelLayer.show();
        //}
      },

      _workBeforeCreate: function () {

        // change string of mouse tooltip
        var additionStr = "<br/>" + "(" + this.nls.pressStr + "<b>" +
          this.nls.ctrlStr + "</b> " + this.nls.snapStr + ")";
        this._defaultStartStr = esriBundle.toolbars.draw.start;
        this._defaultAddPointStr = esriBundle.toolbars.draw.addPoint;
        esriBundle.toolbars.draw.start =
          esriBundle.toolbars.draw.start + additionStr;
        esriBundle.toolbars.draw.addPoint =
          esriBundle.toolbars.draw.addPoint + additionStr;

        // hide label layer.
        //var labelLayer = this.map.getLayer("labels");
        //if (labelLayer) {
        //  labelLayer.hide();
        //}

      },

      _getDefaultFieldInfos: function (layerObject) {
        // summary:
        //  filter webmap fieldInfos.
        // description:
        //   return null if fieldInfos has not been configured in webmap.
        //layerObject = this.map.getLayer(layerInfo.featureLayer.id);
        var fieldInfos = editUtils.getFieldInfosFromWebmap(layerObject.id, this._jimuLayerInfos);//
        if (fieldInfos === undefined || fieldInfos === null) {
          fieldInfos = editUtils.getFieldInfosLayer(layerObject.id, this._jimuLayerInfos);
        }
        if (fieldInfos) {
          fieldInfos = array.filter(fieldInfos, function (fieldInfo) {
            return fieldInfo.visible || fieldInfo.isEditable;
          });
        }
        return fieldInfos;
      },

      _getDefaultLayerInfos: function () {
        var defaultLayerInfos = [];
        var fieldInfos;
        for (var i = this.map.graphicsLayerIds.length - 1; i >= 0 ; i--) {
          var layerObject = this.map.getLayer(this.map.graphicsLayerIds[i]);
          if (layerObject.type === "Feature Layer" && layerObject.url) {
            var layerInfo = {
              featureLayer: {}
            };
            layerInfo.featureLayer.id = layerObject.id;
            layerInfo.disableGeometryUpdate = false;
            layerInfo.allowUpdateOnly = false; //
            fieldInfos = this._getDefaultFieldInfos(layerObject);
            if (fieldInfos && fieldInfos.length > 0) {
              layerInfo.fieldInfos = fieldInfos;
            }
            defaultLayerInfos.push(layerInfo);
          }
        }
        return defaultLayerInfos;
      },

      _converConfiguredLayerInfos: function (layerInfos) {
        array.forEach(layerInfos, function (layerInfo) {
          // convert layerInfos to compatible with old version
          var layerObject;
          if (!layerInfo.featureLayer.id && layerInfo.featureLayer.url) {
            layerObject = this.getLayerObjectFromMapByUrl(this.map, layerInfo.featureLayer.url);
            if (layerObject) {
              layerInfo.featureLayer.id = layerObject.id;

            }
          }
          else {
            layerObject = this.map.getLayer(layerInfo.featureLayer.id);

          }
          var layID = layerInfo.featureLayer.id;
          if (layerInfo.featureLayer.hasOwnProperty("originalLayerId")) {
            layID = layerInfo.featureLayer.originalLayerId;
          }
          if (layerObject) {
            // convert fieldInfos
            var newFieldInfos = [];
            var webmapFieldInfos =
              editUtils.getFieldInfosFromWebmap(layID, this._jimuLayerInfos);
            if (webmapFieldInfos === undefined || webmapFieldInfos === null) {
              webmapFieldInfos = editUtils.getFieldInfosLayer(layID, this._jimuLayerInfos);
            }
            array.forEach(webmapFieldInfos, function (webmapFieldInfo) {
              if (webmapFieldInfo.fieldName !== layerObject.globalIdField &&
                  webmapFieldInfo.fieldName !== layerObject.objectIdField &&
                  webmapFieldInfo.type !== "esriFieldTypeGeometry" &&
                  webmapFieldInfo.type !== "esriFieldTypeOID" &&
                  webmapFieldInfo.type !== "esriFieldTypeBlob" &&
                  webmapFieldInfo.type !== "esriFieldTypeGlobalID" &&
                  webmapFieldInfo.type !== "esriFieldTypeRaster" &&
                    webmapFieldInfo.type !== "esriFieldTypeXML") {
                //var found = array.some(layerInfo.fieldInfos, function (fieldInfo) {
                //  return (webmapFieldInfo.fieldName === fieldInfo.fieldName);
                //});
                //if (found === true) {
                var webmapFieldInfoNew = this.getFieldInfoFromWebmapFieldInfos(webmapFieldInfo, layerInfo.fieldInfos);

                if (webmapFieldInfoNew.visible === true) {
                  newFieldInfos.push(webmapFieldInfoNew);
                }

              }

            }, this);

            if (newFieldInfos.length !== 0) {
              layerInfo.fieldInfos = newFieldInfos;
            }
            //layerInfo = this._modifyFieldInfosForEE(layerInfo);
            //layerInfo.fieldInfo = this._processFieldInfos(layerInfo.fieldInfo);
          }
        }, this);
        return layerInfos;

      },
      getLayerObjectFromMapByUrl: function (map, layerUrl) {
        var resultLayerObject = null;
        for (var i = 0; i < map.graphicsLayerIds.length; i++) {
          var layerObject = map.getLayer(map.graphicsLayerIds[i]);
          if (layerObject.url.toLowerCase() === layerUrl.toLowerCase()) {
            resultLayerObject = layerObject;
            break;
          }
        }
        return resultLayerObject;
      },

      getFieldInfoFromWebmapFieldInfos: function (webmapFieldInfo, fieldInfos) {
        var foundInfo = {};
        var foundInfos = array.filter(fieldInfos, function (fieldInfo) {
          return (webmapFieldInfo.fieldName === fieldInfo.fieldName);
        });
        if (foundInfos) {
          if (foundInfos.length >= 1) {
            foundInfo = foundInfos[0];
          } else {
            foundInfo = webmapFieldInfo;
          }

        }
        foundInfo.label = foundInfo.label === undefined ?
                webmapFieldInfo.label : foundInfo.label;

        foundInfo.visible = foundInfo.visible === undefined ?
         webmapFieldInfo.visible : foundInfo.visible;

        foundInfo.isEditableSettingInWebmap = webmapFieldInfo.isEditable === undefined ?
          true : webmapFieldInfo.isEditable;

        foundInfo.isEditable = foundInfo.isEditable === undefined ?
          webmapFieldInfo.isEditable : foundInfo.isEditable;

        foundInfo.canPresetValue = foundInfo.canPresetValue === undefined ?
          false : foundInfo.canPresetValue;

        foundInfo.format = webmapFieldInfo.format === undefined ?
          null : webmapFieldInfo.format;

        for (var k in webmapFieldInfo) {
          if (webmapFieldInfo.hasOwnProperty(k)) {
            if (foundInfo.hasOwnProperty(k) === false) {
              foundInfo[k] = webmapFieldInfo[k];
            }
          }
        }
        return foundInfo;
      },
      _processConfig: function () {
        this.config.editor.configInfos = array.filter(this.config.editor.configInfos, function (configInfo) {
          if (configInfo._editFlag && configInfo._editFlag === true) {
            return true;
          } else {
            return false;
          }
        });
        array.forEach(this.config.editor.configInfos, function (configInfo) {

          var layerObject = configInfo.layerInfo.layerObject;
          if (layerObject &&
             layerObject.isEditable &&
             layerObject.isEditable()) {
            if (configInfo.allowUpdateOnly === false) {
              this.own(on(layerObject, "visibility-change, scale-visibility-change", lang.hitch(this, function () {
                //console.log("layer change" + state);
                this._createEditor();
              }
              )));
            }
            this._enableAttrInspectorSaveButton(this._validateAttributes());
            //this._enableAttrInspectorSaveButton(true);
            //this._isDirty = true;
            // modify templates with space in string fields
            this._removeSpacesInLayerTemplates(layerObject);
            this.processConfigForRuntime(configInfo);
            configInfo.configFeatureLayer = configInfo.featureLayer;
            configInfo.featureLayer = layerObject;
            configInfo.showDeleteButton = false;
          }
        }, this);
      },
      onClose: function () {
        this._worksAfterClose();

        //if (this.config.editor.clearSelectionOnClose) {
        //  if (this._isDirty) {
        //    this._promptToResolvePendingEdit(true).then(lang.hitch(this, function () {
        //      // set this variable for controlling the onMapClick (#494)
        //      this.map.setInfoWindowOnClick(true);
        //      this._attrInspIsCurrentlyDisplayed = true;
        //      this.templatePicker.clearSelection();
        //    }))

        //  } else {
        //    this._cancelEditingFeature(true);

        //    // set this variable for controlling the onMapClick
        //    this.map.setInfoWindowOnClick(true);
        //    this._attrInspIsCurrentlyDisplayed = true;
        //    this.templatePicker.clearSelection();
        //  }
        //} else
        //{
        this._mapClickHandler(false);
        //}

        // close method will call onDeActive automaticlly
        // so do not need to call onDeActive();
      },


      _update: function () {
        //if (this.templatePicker) {
        //comments out, this results in teh scroll bar disappearing, unsure why


        //var widgetBox = html.getMarginBox(this.domNode);
        //var height = widgetBox.h;
        //var width = widgetBox.w;


        //var cols = Math.floor(width / 60);
        //this.templatePicker.attr('columns', cols);
        //this.templatePicker.update(true);


        // }
      },

      resize: function () {
        this._update();
      },
      onNormalize: function () {
        setTimeout(lang.hitch(this, this._update), 100);
      },

      onMinimize: function () {
        console.log("min");
      },

      onMaximize: function () {
        setTimeout(lang.hitch(this, this._update), 100);
      }

    });
  });