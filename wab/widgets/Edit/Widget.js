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
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/i18n!esri/nls/jsapi',
    'dojo/on',
    'dojo/json',
    'dojo/Deferred',
    'dojo/aspect',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidget',
    'jimu/MapManager',
    'jimu/LayerInfos/LayerInfos',
    'jimu/dijit/LoadingShelter',
    'jimu/utils',
    'jimu/portalUrlUtils',
    'esri/dijit/editing/Editor',
    'esri/dijit/Popup',
    "esri/dijit/editing/TemplatePicker",
    "esri/geometry/Extent",
    "esri/geometry/Point",
    "esri/renderers/jsonUtils",
    "dijit/form/Button",
    "./utils",
    './FilterEditor'
  ],
  function(declare, lang, array, html, esriBundle, on, Json, Deferred, aspect,
    _WidgetsInTemplateMixin, BaseWidget, MapManager, LayerInfos, LoadingShelter,
    jimuUtils, portalUrlUtils, Editor, Popup, TemplatePicker,
    Extent, Point, rendererJsonUtils, Button, editUtils, FilterEditor) {
    return declare([BaseWidget, _WidgetsInTemplateMixin], {
      name: 'Edit',
      baseClass: 'jimu-widget-edit',
      editor: null,
      _defaultStartStr: "",
      _defaultAddPointStr: "",
      resetInfoWindow: {},
      _mapInfoStorage: null,
      _jimuLayerInfos: null,
      editPopup: null,
      _configEditor: null,
      _layerObjectsParaForTempaltePicker: null,
      _createOverDef: null,
      _releaseEventAfterActiveArray: null,
      _canCreateLayersAreAllInvisibleFlag: null,
      _layerInfoParamArrayUseForRervertRenderre: null,

      startup: function() {
        this.inherited(arguments);
        this.editPopup = new Popup(null, html.create("div",
                                                    {"class":"jimu-widget-edit-infoWindow"},
                                                    null,
                                                    this.map.root));
        this.loading = new LoadingShelter({
          hidden: true
        });
        this.loading.placeAt(this.domNode);
      },

      _init: function() {
        this._mapInfoStorage = {
          resetInfoWindow: null,
          snappingTolerance: null
        };
        this._editorMapClickHandlers = [];
        this._layerObjectsParaForTempaltePicker = [];
        this._configEditor = lang.clone(this.config.editor);
        this._releaseEventAfterActiveArray = [];
        this._canCreateLayersAreAllInvisibleFlag = false;
        this._layerInfoParamArrayUseForRervertRenderre = [];
        this._createOverDef = new Deferred();
      },

      onOpen: function() {
        this._init();
        LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function(operLayerInfos) {
            this._jimuLayerInfos = operLayerInfos;

            var timeoutValue;
            if(this.appConfig.theme.name === "BoxTheme") {
              timeoutValue = 1050;
              this.loading.show();
            } else {
              timeoutValue = 1;
            }
            setTimeout(lang.hitch(this, function() {
              if(!this.loading.hidden) {
                this.loading.hide();
              }
              this.widgetManager.activateWidget(this);
              this._createEditor();
            }), timeoutValue);
          }));
      },

      /*******************************
       * Methods for control popup
       *******************************/
      onActive: function(){
        this.disableWebMapPopup();
        this._bindEventAfterActive();
      },

      onDeActive: function(){
        this.enableWebMapPopup();
        this._releaseEventAfterActive();
      },

      disableWebMapPopup: function() {
        var mapManager = MapManager.getInstance();
        mapManager.disableWebMapPopup();
        // hide map's infoWindow
        this.map.infoWindow.hide();
        // instead of map's infowindow by editPopup
        this.map.setInfoWindow(this.editPopup);
        this._enableMapClickHandler();

        // instead of Mapmanager.resetInfoWindow by self resetInfoWindow
        if (this._mapInfoStorage.resetInfoWindow === null) {
          this._mapInfoStorage.resetInfoWindow = mapManager.resetInfoWindow;
          this.own(on(this.map.infoWindow, "show", lang.hitch(this, function() {
            if (window.appInfo.isRunInMobile) {
              this.map.infoWindow.maximize();
            }
          })));
        }
        mapManager.resetInfoWindow = lang.hitch(this, function() {});

        // backup map snappingTolerance and reset it.
        if(this.map.snappingManager && this._configEditor.snappingTolerance !== undefined) {
          this._mapInfoStorage.snappingTolerance = this.map.snappingManager.tolerance;
          // default value is 15 pixels, compatible with old version app.
          this.map.snappingManager.tolerance = this._configEditor.snappingTolerance;
        }
      },

      enableWebMapPopup: function() {
        var mapManager = MapManager.getInstance();
        var mapInfoWindow = mapManager.getMapInfoWindow();
        // revert restInfoWindow when close widget.
        if (this._mapInfoStorage.resetInfoWindow) {
          this.map.setInfoWindow(mapInfoWindow.bigScreen);
          mapManager.isMobileInfoWindow = false;

          mapManager.resetInfoWindow =
            lang.hitch(mapManager, this._mapInfoStorage.resetInfoWindow);
          this._mapInfoStorage.resetInfoWindow = null;
          mapManager.resetInfoWindow();
          this._disableMapClickHandler();
          // hide popup and delete selection
          this.editPopup.hide();
          this.editor._clearSelection();
          // recall enableWebMap
          mapManager.enableWebMapPopup();
        }
        // revert map snappingTolerance.
        if(this.map.snappingManager && this._mapInfoStorage.snappingTolerance !== null) {
          this.map.snappingManager.tolerance = this._mapInfoStorage.snappingTolerance;
        }
      },

      _enableMapClickHandler: function() {
        if (this.editor) {
          this._editorMapClickHandlers.push(this.editor._mapClickHandler);
          this.editor._enableMapClickHandler();
          this._editorMapClickHandlers.push(this.editor._mapClickHandler);
        }
      },

      _disableMapClickHandler: function() {
        if (this.editor) {
          this.editor._disableMapClickHandler();
          array.forEach(this._editorMapClickHandlers, function(editorMapClickHandler) {
            if(editorMapClickHandler && editorMapClickHandler.remove) {
              editorMapClickHandler.remove();
            }
          }, this);
          this._editorMapClickHandlers = [];
        }
      },


      /***************************************
       * Methods for prepare to create Editor.
       ***************************************/
      _getDefaultFieldInfos: function(layerId) {
        // summary:
        //  filter webmap fieldInfos.
        // description:
        //   return null if fieldInfos has not been configured in webmap.
        var fieldInfos = editUtils.getFieldInfosFromWebmap(layerId, this._jimuLayerInfos);
        if(fieldInfos) {
          fieldInfos = array.filter(fieldInfos, function(fieldInfo) {
            return fieldInfo.visible || fieldInfo.isEditable;
          });
        }
        return fieldInfos;
      },

      _getDefaultLayerInfos: function() {
        var defaultLayerInfos = [];
        var fieldInfos;
        for(var i = this.map.graphicsLayerIds.length - 1; i >= 0 ; i--) {
          var layerObject = this.map.getLayer(this.map.graphicsLayerIds[i]);
          if (layerObject.type === "Feature Layer" && layerObject.url) {
            var layerInfo = {
              featureLayer: {}
            };
            layerInfo.featureLayer.id = layerObject.id;
            layerInfo.disableGeometryUpdate = false;
            fieldInfos = this._getDefaultFieldInfos(layerObject.id);
            //If nothing is specified all fields, except the ObjectId and GlobalId are displayed.
            if(fieldInfos && fieldInfos.length > 0) {
              layerInfo.fieldInfos = fieldInfos;
            }
            defaultLayerInfos.push(layerInfo);
          }
        }
        return defaultLayerInfos;
      },

      _converConfiguredLayerInfos: function(layerInfos) {
        array.forEach(layerInfos, function(layerInfo) {
          // convert layerInfos to compatible with old version
          if(!layerInfo.featureLayer.id && layerInfo.featureLayer.url) {
            var layerObject = getLayerObjectFromMapByUrl(this.map, layerInfo.featureLayer.url);
            if(layerObject) {
              layerInfo.featureLayer.id = layerObject.id;
            }
          }

          // convert fieldInfos
          var newFieldInfos = [];
          var webmapFieldInfos =
            editUtils.getFieldInfosFromWebmap(layerInfo.featureLayer.id, this._jimuLayerInfos);
          array.forEach(layerInfo.fieldInfos, function(fieldInfo) {
            // compitible with old version of config,
            // to decide which file will display in inspector.
            var webmapFieldInfo = getFieldInfoFromWebmapFieldInfos(webmapFieldInfos, fieldInfo);
            if(fieldInfo.visible === undefined) {
              // compatible with old version fieldInfo that does not defined
              // the visible attribute.
              if(webmapFieldInfo) {
                if( webmapFieldInfo.isEditable ||
                    webmapFieldInfo.isEditableSettingInWebmap ||
                    webmapFieldInfo.visible) {
                  newFieldInfos.push(webmapFieldInfo);
                }
              } else {
                newFieldInfos.push(fieldInfo);
              }
            } else {
              // the fieldInfo has defined the visble attribute(since online4.1).
              if(fieldInfo.visible || fieldInfo.isEditable) {
                //push to newFieldInfos
                if(webmapFieldInfo) {
                  newFieldInfos.push(webmapFieldInfo);
                } else {
                  newFieldInfos.push(fieldInfo);
                }
              }
            }
          }, this);

          if(newFieldInfos.length !== 0) {
            layerInfo.fieldInfos = newFieldInfos;
          }
        }, this);
        return layerInfos;

        function getFieldInfoFromWebmapFieldInfos(webmapFieldInfos, fieldInfo) {
          var resultFieldInfo = null;
          if(webmapFieldInfos) {
            for(var i = 0; i < webmapFieldInfos.length; i++) {
              if(fieldInfo.fieldName === webmapFieldInfos[i].fieldName) {
                webmapFieldInfos[i].label = fieldInfo.label;
                webmapFieldInfos[i].isEditableSettingInWebmap = webmapFieldInfos[i].isEditable;
                webmapFieldInfos[i].isEditable = fieldInfo.isEditable;
                resultFieldInfo = webmapFieldInfos[i];
                // resultFieldInfo.label = fieldInfo.label;
                // resultFieldInfo.isEditableSettingInWebmap = webmapFieldInfos[i].isEditable;
                // resultFieldInfo.isEditable = fieldInfo.isEditable;
                break;
              }
            }
          }
          return resultFieldInfo;
        }

        function getLayerObjectFromMapByUrl(map, layerUrl) {
          var resultLayerObject = null;
          for(var i = 0; i < map.graphicsLayerIds.length; i++) {
            var layerObject = map.getLayer(map.graphicsLayerIds[i]);
            if(layerObject &&
               layerObject.url &&
               (portalUrlUtils.removeProtocol(layerObject.url.toLowerCase()) ===
                portalUrlUtils.removeProtocol(layerUrl.toLowerCase()))) {
              resultLayerObject = layerObject;
              break;
            }
          }
          return resultLayerObject;
        }
      },

      _getLayerInfosParam: function() {
        // var retDef = new Deferred();
        // var defs = [];
        var layerInfos;
        var resultLayerInfosParam = [];
        if(!this._configEditor.layerInfos) {
          // configured in setting page and no layers checked.
          layerInfos = [];
        } else if(this._configEditor.layerInfos.length > 0)  {
          // configured and has been checked.
          layerInfos = this._converConfiguredLayerInfos(this._configEditor.layerInfos);
        } else {
          // has not been configured.
          layerInfos = this._getDefaultLayerInfos();
        }

        //according to conditions to filter
        array.forEach(layerInfos, function(layerInfo) {
          var layerObject = this.map.getLayer(layerInfo.featureLayer.id);
          if(layerObject &&
             layerObject.visible &&
             layerObject.isEditable &&
             layerObject.isEditable()) {
            layerInfo.featureLayer = layerObject;
            resultLayerInfosParam.push(layerInfo);
          }

          // update this._canCreateLayersAreAllInvisibleFlag
          if(!this._canCreateLayersAreAllInvisibleFlag &&
             layerObject &&
             layerObject.isEditable &&
             layerObject.isEditable() &&
             layerObject.getEditCapabilities &&
             layerObject.getEditCapabilities() &&
             !layerObject.visible) {
            this._canCreateLayersAreAllInvisibleFlag = true;
          }
        }, this);
        return resultLayerInfosParam;
      },

      _getTemplatePicker: function(layerInfos) {
        this._layerObjectsParaForTempaltePicker = [];

        array.forEach(layerInfos, function(layerInfo) {
          if(layerInfo.featureLayer &&
            layerInfo.featureLayer.getEditCapabilities &&
            layerInfo.featureLayer.getEditCapabilities().canCreate) {
            this._layerObjectsParaForTempaltePicker.push(layerInfo.featureLayer);
          }
        }, this);

        // change string of templatePicker is empty
        this._defaultTempaltePickerEmpeyStr =
            esriBundle.widgets.templatePicker.creationDisabled;
        if(this._canCreateLayersAreAllInvisibleFlag) {
          esriBundle.widgets.templatePicker.creationDisabled =
            this.nls.noCanCreateLayerAreCurrentlyVisible;
        }

        var bottomStyle = this._configEditor.toolbarVisible ? "" : "bottom: 0px";
        var topStyle = this._configEditor.useFilterEdit ? "top: 115px" : "top: 18px";
        var templatePicker = new TemplatePicker({
          featureLayers: this._layerObjectsParaForTempaltePicker,
          grouping: true,
          rows: "auto",
          columns: "auto",
          style: bottomStyle + ";" + topStyle
        }, html.create("div", {}, this.domNode));
        templatePicker.startup();
        return templatePicker;
      },

      _getSettingsParam: function() {
        var settings = {
          map: this.map,
          createOptions: {
            polygonDrawTools: [
              Editor.CREATE_TOOL_ARROW,
              Editor.CREATE_TOOL_AUTOCOMPLETE,
              Editor.CREATE_TOOL_CIRCLE,
              Editor.CREATE_TOOL_ELLIPSE,
              Editor.CREATE_TOOL_RECTANGLE,
              Editor.CREATE_TOOL_TRIANGLE,
              Editor.CREATE_TOOL_POLYGON,
              Editor.CREATE_TOOL_FREEHAND_POLYGON
            ],
            polylineDrawTools: [
              Editor.CREATE_TOOL_POLYLINE,
              Editor.CREATE_TOOL_FREEHAND_POLYLINE
            ]
          }
        };
        for (var attr in this._configEditor) {
          settings[attr] = this._configEditor[attr];
        }
        settings.layerInfos = this._getLayerInfosParam();
        settings.templatePicker = this._getTemplatePicker(settings.layerInfos);
        // set popup tolerance
        if(this._configEditor.popupTolerance !== undefined) {
          settings.singleSelectionTolerance = this._configEditor.popupTolerance;
        }

        return settings;
      },

      _createEditor: function() {
        var params = {
          settings: this._getSettingsParam()
        };
        this._worksBeforeCreate(params.settings);
        this.editor = new Editor(params, html.create("div", {}, this.domNode));
        this.editor.startup();
        this._worksAfterCreate(params.settings);
      },

      /***************************************
      * Methods for extra works
      ****************************************/
      _addButtonToInspector: function() {
        var closeButton = new Button({
          label: this.nls.close,
          "class": " atiButton closeButton"
        }, html.create("div"));

        html.place(closeButton.domNode,
                   this.editor.attributeInspector.deleteBtn.domNode,
                   "after");
        this.own(on(closeButton, 'click', lang.hitch(this, function() {
          this.editPopup.hide();
        })));
      },

      _addFilterEditor: function(settings) {
        if (this._configEditor.useFilterEdit) {
          this._filterEditor = new FilterEditor({
            _settings: settings,
            _editWidget: this
          }, html.create("div", {}, this.domNode));
        }
      },

      _worksBeforeCreate: function(settings) {
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
        var labelLayer = this.map.getLayer("labels");
        if(labelLayer) {
          labelLayer.hide();
        }

        // change layer name
        array.forEach(settings.layerInfos, function(layerInfo) {
          var jimuLayerInfo =
            this._jimuLayerInfos.getLayerInfoByTopLayerId(layerInfo.featureLayer.id);
          if(jimuLayerInfo) {
            layerInfo.featureLayer.name = jimuLayerInfo.title;
          }
        }, this);

        // change render to service render if renderer has been changed.
        this._changeToServiceRenderer(settings);
      },

      _worksAfterCreate: function(settings) {
        // add close button to atiInspector
        this._addButtonToInspector();
        // resize editPopup
        this.editPopup.resize(500, 251);
        // update templatePicker for responsive.
        this.editor.templatePicker.update(true);
        // // reset default selectionSymbol that change by Editor dijit.
        // array.forEach(this.editor.settings.layerInfos, function(layerInfo) {
        //   layerInfo.featureLayer.setSelectionSymbol();
        // }, this);

        // add FilterEditor
        this._addFilterEditor(settings);

        this._createOverDef.resolve();

        // bind events after create.
        this._bindEventsAfterCreate();

      },

      _worksAfterClose: function() {
        esriBundle.toolbars.draw.start = this._defaultStartStr;
        esriBundle.toolbars.draw.addPoint = this._defaultAddPointStr;
        esriBundle.widgets.templatePicker.creationDisabled =
          this._defaultTempaltePickerEmpeyStr;

        // show lable layer.
        var labelLayer = this.map.getLayer("labels");
        if(labelLayer) {
          labelLayer.show();
        }

        // destory filterEditor.
        if(this._filterEditor) {
          this._filterEditor.destroy();
        }

        // revert renderer to layer renderer.
        this._revertToLayerRenderer();
      },

      _bindEventsAfterCreate: function() {
        /*
        this.own(on(this.editor.editToolbar,
              'graphic-move-start',
              lang.hitch(this, this._onGraphicMoveStart)));
        */

        this.own(on(this.editor.editToolbar,
              'graphic-move-stop',
              lang.hitch(this, this._onGraphicMoveStop)));
      },

      _bindEventAfterActive: function() {
        var handle = aspect.before(this.map,
              'onClick',
              lang.hitch(this, this._beforeMapClick));
        this._releaseEventAfterActiveArray.push(handle);
      },

      _releaseEventAfterActive: function() {
        array.forEach(this._releaseEventAfterActiveArray, function(handle) {
          handle.remove();
        }, this);
        this._releaseEventAfterActiveArray = [];
      },

      _changeToServiceRenderer: function(settings) {
        array.forEach(settings.layerInfos, function(layerInfo) {
          if(!layerInfo.featureLayer._json) {
            return;
          }
          var layerRenderer = layerInfo.featureLayer.renderer;
          var layerRendererJson = layerRenderer.toJson();
          var serviceDefJson = Json.parse(layerInfo.featureLayer._json);
          var serviceRendererJson = serviceDefJson.drawingInfo.renderer;
          if(!jimuUtils.isEqual(layerRendererJson, serviceRendererJson)) {
            layerInfo._layerRenderer = layerRenderer;
            this._layerInfoParamArrayUseForRervertRenderre.push(layerInfo);
            layerInfo.featureLayer.setRenderer(rendererJsonUtils.fromJson(serviceRendererJson));
            layerInfo.featureLayer.redraw();
          }
        }, this);
      },

      _revertToLayerRenderer: function() {
        array.forEach(this._layerInfoParamArrayUseForRervertRenderre, function(layerInfo) {
          if(layerInfo._layerRenderer) {
            layerInfo.featureLayer.setRenderer(layerInfo._layerRenderer);
            layerInfo.featureLayer.redraw();
          }
        }, this);
        this._layerInfoParamArrayUseForRervertRenderre = [];
      },

      /*****************************
       * Methods for control graphic
       ****************************/
      _updateSelectedFeature: function(selectedFeature) {
        if(selectedFeature) {
          selectedFeature.getLayer().applyEdits(null, [selectedFeature]);
          this.editor._clearSelection();
        }
      },

      _autoApplyEditWhenGeometryIsModified: function(/*graphicMoveStopEvent*/) {
        var editToolbarCurrentState = this.editor.editToolbar.getCurrentState();
        var selectedFeature = editToolbarCurrentState && editToolbarCurrentState.graphic;

        //if( this._configEditor.autoApplyEditWhenGeometryIsMoved &&
        //   graphicMoveStopEvent &&
        //   graphicMoveStopEvent.target &&
        //   graphicMoveStopEvent.target._modified) {

        if(this._configEditor.autoApplyEditWhenGeometryIsMoved) {
          if(this._checkStickyMoveTolerance()) {
            this._updateSelectedFeature(selectedFeature);
          } else {
            // not sure the geometry has been changed or not except for 'point'
            if(editToolbarCurrentState.isModified && selectedFeature.geometry.type !== "point") {
              this._updateSelectedFeature(selectedFeature);
            }
          }
        }
      },

      _checkStickyMoveTolerance: function() {
        var isOut = true;
        var editToolbarCurrentState = this.editor.editToolbar.getCurrentState();
        var selectedFeature = editToolbarCurrentState && editToolbarCurrentState.graphic;
        if(selectedFeature) {
          if(!this._isOutStickyMoveToleranceCheckedByMoveTrack(selectedFeature)) {
            this._revertGraphicPosition(selectedFeature);
            isOut = false;
          }

          // delete position record after checked sticky move.
          delete selectedFeature._moveTrack;
          delete selectedFeature._originalGeometryAtMoveStart;
        }
        return isOut;
      },

      _isOutStickyMoveToleranceCheckedByOriginalGeometry: function(selectedFeature) {
        var referencePoint;
        var movedReferencePoint;
        var mapWidth;
        var tolerancePerPixel;
        var toleranceMapUnit;
        var toleranceExtent;
        var isOut = true;
        // init referencePoint and movedReferencePoint
        if(selectedFeature.geometry.type === 'point') {
          referencePoint = selectedFeature._originalGeometryAtMoveStart;
          movedReferencePoint = selectedFeature.geometry;
        } else {
          if(selectedFeature.geometry.getExtent &&
              selectedFeature._originalGeometryAtMoveStart.getExtent) {
            referencePoint = selectedFeature._originalGeometryAtMoveStart.getExtent().getCenter();
            movedReferencePoint = selectedFeature.geometry.getExtent().getCenter();
          }
        }

        if(this._configEditor.stickyMoveTolerance &&
            referencePoint &&
            movedReferencePoint) {
          mapWidth = this.map.extent.getWidth();
          tolerancePerPixel = mapWidth / this.map.width;
          toleranceMapUnit = this._configEditor.stickyMoveTolerance * tolerancePerPixel;
          toleranceExtent = new Extent(0,
                                       0,
                                       toleranceMapUnit,
                                       toleranceMapUnit,
                                       selectedFeature.spatialReference);
          toleranceExtent = toleranceExtent.centerAt(referencePoint);
          if(toleranceExtent.contains(movedReferencePoint)) {
            isOut = false;
          }
        }
        return isOut;
      },

      _isOutStickyMoveToleranceCheckedByMoveTrack: function(selectedFeature) {
        var isOut = true;
        var mapWidth;
        var tolerancePerPixel;
        var toleranceMapUnit;
        var toleranceExtent;
        var moveTrack = selectedFeature._moveTrack;
        var movedReferencePoint;

        if(moveTrack) {
          movedReferencePoint = new Point(moveTrack.x,
                                          moveTrack.y,
                                          selectedFeature.spatialReference);
        }

        if(this._configEditor.stickyMoveTolerance &&
            movedReferencePoint) {
          mapWidth = this.map.extent.getWidth();
          tolerancePerPixel = mapWidth / this.map.width;
          toleranceMapUnit = this._configEditor.stickyMoveTolerance * tolerancePerPixel;
          toleranceExtent = new Extent(-toleranceMapUnit / 2,
                                       -toleranceMapUnit / 2,
                                       toleranceMapUnit,
                                       toleranceMapUnit,
                                       selectedFeature.spatialReference);
          if(toleranceExtent.contains(movedReferencePoint)) {
            isOut = false;
          }
        }
        return isOut;
      },

      _revertGraphicPosition: function(selectedFeature) {

        // according to original geometry to revert .
        /*
        if(selectedFeature._originalGeometryAtMoveStart) {
          selectedFeature.geometry = selectedFeature._originalGeometryAtMoveStart;
          delete selectedFeature._originalGeometryAtMoveStart;
        }
        */

        var moveTrack = selectedFeature._moveTrack;
        // according to move track to revert .
        if(moveTrack) {
          switch (selectedFeature.geometry.type) {
          case 'point':
            selectedFeature.geometry.x -= moveTrack.x;
            selectedFeature.geometry.y += moveTrack.y;
            break;
          case 'polygon':
            array.forEach(selectedFeature.geometry.rings, function(ring) {
              array.forEach(ring, function(point) {
                point[0] -= moveTrack.x;
                point[1] += moveTrack.y;
              });
            });
            break;
          case 'polyline':
            array.forEach(selectedFeature.geometry.paths, function(path) {
              array.forEach(path, function(point) {
                point[0] -= moveTrack.x;
                point[1] += moveTrack.y;
              });
            });
            break;
          case 'multiPoint':
            array.forEach(selectedFeature.geometry.points, function(point) {
              point[0] -= moveTrack.x;
              point[1] += moveTrack.y;
            });
            break;
          default:
            return;
          }

          //hide editing assistance geometry when !autoApplyEditWhenGeometryIsMoved.
          if(!this._configEditor.autoApplyEditWhenGeometryIsMoved) {
            array.forEach(this.editor.editToolbar._getAffectedTools("MOVE"), function(tool) {
              tool.suspend();
            }, this);
          }

          if(selectedFeature.geometry.type === "point") {
            this.editor._clearSelection();
          }

          selectedFeature.draw();
        }
      },

      _recordsSelectedFeatureInfoWhenMoveStart: function(moveStartEvent) {
        var selectedFeature = moveStartEvent && moveStartEvent.graphic;
        if (selectedFeature && selectedFeature.geometry) {
          selectedFeature._originalGeometryAtMoveStart = lang.clone(selectedFeature.geometry);
        }
      },

      _recordsSelectedFeatureInfoWhenMoveStop: function(moveStopEvetn) {
        var selectedFeature = moveStopEvetn && moveStopEvetn.graphic;
        var transform = moveStopEvetn && moveStopEvetn.transform;
        var mapWidth = this.map.extent.getWidth();
        var lengthPerPixel = mapWidth / this.map.width;

        if (selectedFeature && transform) {
          if(!selectedFeature._moveTrack) {
            // the first move at graphic edit period.
            selectedFeature._moveTrack = {x: 0, y: 0};
          }
          selectedFeature._moveTrack.x += transform.dx * lengthPerPixel;
          selectedFeature._moveTrack.y += transform.dy * lengthPerPixel;
        }
      },

      /*************************
       * Response events
       ************************/
      _update: function() {
        if(this.editor){
          this.editor.templatePicker.update(true);
        }
      },

      resize: function() {
        this._update();
      },

      onClose: function() {
        if (this.editor) {
          this.editor.destroy();
        }
        this.editor = null;
        // close method will call onDeActive automaticlly
        // so do not need to call onDeActive();
        this._worksAfterClose();
      },

      onNormalize: function(){
        setTimeout(lang.hitch(this, this._update), 100);
      },

      onMinimize: function(){
      },

      onMaximize: function(){
        setTimeout(lang.hitch(this, this._update), 100);
      },

      reClickMap: function(clickEvt) {
        this._createOverDef.then(lang.hitch(this, function() {
          this.map.onClick(clickEvt);
        }));
      },

      _onGraphicMoveStart: function(evt) {
        this._recordsSelectedFeatureInfoWhenMoveStart(evt);
      },

      _onGraphicMoveStop: function(evt) {
        this._recordsSelectedFeatureInfoWhenMoveStop(evt);
        this._autoApplyEditWhenGeometryIsModified(evt);
      },

      _onGraphicChangeStop: function(evt) {
        this._autoApplyEditWhenGeometryIsModified(evt);
      },

      _beforeMapClick: function() {
        if(!this._configEditor.autoApplyEditWhenGeometryIsMoved) {
          this._checkStickyMoveTolerance();
        }
      }

    });
  });
