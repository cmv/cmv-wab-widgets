///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 Esri. All Rights Reserved.
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
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Button',
    'dijit/form/TextBox',
    'dijit/form/ComboBox',
    'dijit/form/Select',
    'dijit/form/DateTextBox',
    'dijit/form/TimeTextBox',
    'dijit/registry',
    'dojo/dom',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/on',
    'dojo/aspect',
    'dojo/dom-construct',
    'dojo/_base/array',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/query',
    'dojo/promise/all',
    'dojo/string',
    'dojo/store/Memory',
    'dojo/dom-attr',
    'dojo/dnd/Moveable',
    'dojo/when',
    "dojox/html/entities",
    'jimu/BaseWidget',
    'jimu/MapManager',
    'jimu/dijit/SimpleTable',
    'jimu/dijit/LoadingIndicator',
    'jimu/dijit/Filter',
    'jimu/dijit/Popup',
     'esri/dijit/Popup',
    'jimu/utils',
    'esri',
    'esri/graphic',
    'esri/InfoTemplate',
    'esri/layers/FeatureLayer',
    'esri/tasks/FeatureSet',
    'esri/dijit/AttributeInspector',
    'esri/tasks/query',
    'esri/symbols/jsonUtils',
    'esri/toolbars/draw',
    'esri/geometry/geometryEngine',
    'esri/geometry/scaleUtils',
    'esri/geometry/Polygon',
    'dojox/timing',
     'jimu/dijit/Message',
    './customDrawBox',
    './layerSyncDetails'
],
function (dojo,
  declare,
          _WidgetsInTemplateMixin,
          Button,
          TextBox,
          ComboBox,
          Select,
          DateTextBox,
          TimeTextBox,
          registry,
          dom,
          lang,
          html,
          on,
          aspect,
          domConstruct,
          array,
          domStyle,
          domClass,
          query,
          all,
          string,
          Memory,
          domAttr,
          Moveable,
          when,
          entities,
          BaseWidget,
          MapManager,
          SimpleTable,
          LoadingIndicator,
          Filter,
          Popup,
          jimuPopup,
          utils,
          esri,
          Graphic,
          InfoTemplate,
          FeatureLayer,
          FeatureSet,
          AttributeInspector,
          EsriQuery,
          symbolJsonUtils,
          draw,
          geometryEngine,
          scaleUtils,
          Polygon,
          Timer,
          Message,
          DrawBox,
          layerSyncDetails
          ) {
  return declare([BaseWidget, _WidgetsInTemplateMixin], {
    baseClass: 'solutions-widget-batcheditor',
    layersTable: null,
    updateLayers: null,
    helperLayer: null,
    helperEditFieldInfo: null,
    attrInspector: null,
    toolType: "Area",
    drawBox: null,
    selectByLayer: null,
    searchTextBox: null,
    mouseClickPos: null,
    selectQuery: null,
    timer: null,
    syncLayers: null,
    expressionLayers: null,
    drawnGrph: null,
    clickList: null,
    editPopup: null,
    startup: function () {
      this.inherited(arguments);

    },
    postCreate: function () {
      this.inherited(arguments);
      this.nls = lang.mixin(this.nls, window.jimuNls.common);

      if (this.config.updateLayers.length > 0) {
        this.editPopup = new jimuPopup(null, html.create("div",
                                                  { "class": "jimu-widget-edit-infoWindow" },
                                                  null,
                                                  this.map.root));
        this.expressionLayers = [];
        this.clickList = [];
        this._configureWidget();
        this._initSelectLayer();
        this.createLayerTable();
        this.loadLayerTable();
        this._addHelperLayer();
        this._createAttributeInspector();
        this._createQueryParams();
        this._setTheme();
        this.timer = new Timer.Timer(20000);
        this.own(aspect.after(this.timer, "onTick", lang.hitch(this, this._timerComplete), this));
      }

    },
    _initSelectLayer: function () {
      if (this.toolType === "Feature" || this.toolType === "FeatureQuery") {

        array.some(this.map.itemInfo.itemData.operationalLayers, function (layer) {
          if (layer.layerObject !== null && layer.layerObject !== undefined) {
            if (layer.layerObject.type === 'Feature Layer' && layer.url) {
              if (this.config.selectByLayer.name === layer.name || this.config.selectByLayer.name === layer.title) {
                this.selectByLayer = layer;
                if (this.config.selectByLayer.selectionSymbol) {
                  var highlightSymbol = symbolJsonUtils.fromJson(this.config.selectByLayer.selectionSymbol);
                  if (highlightSymbol !== null) {

                    layer.layerObject.setSelectionSymbol(highlightSymbol);

                  }
                }
                return true;
              }
            }
          }
          return false;
        }, this);
        if (this.selectByLayer === null) {
          Message({
            message: string.substitute(this.nls.errors.layerNotFound, {
              0: this.config.selectByLayer.name,
              1: this.config.selectByLayer.id
            })
          });
        }
      }
    },

    /*jshint unused:true */
    _setTheme: function () {
      if (this.appConfig.theme.name === "BoxTheme" ||
          this.appConfig.theme.name === "DartTheme" ||
          this.appConfig.theme.name === "LaunchpadTheme") {
        utils.loadStyleLink('dartOverrideCSS', this.folderUrl + "/css/dartTheme.css", null);
      }
    },
    _configureWidget: function () {
      draw.addPoint = this.nls.drawBox.addPointToolTip;
      draw.addShape = this.nls.drawBox.addShapeToolTip;
      draw.freehand = this.nls.drawBox.freehandToolTip;
      draw.start = this.nls.drawBox.startToolTip;
      esri.bundle.toolbars.draw.addPoint = this.nls.drawBox.addPointToolTip;
      esri.bundle.toolbars.draw.addShape = this.nls.drawBox.addShapeToolTip;
      esri.bundle.toolbars.draw.freehand = this.nls.drawBox.freehandToolTip;
      esri.bundle.toolbars.draw.start = this.nls.drawBox.startToolTip;
      this.existingText = {};
      this.existingText.addPoint = draw.addPoint;
      this.existingText.addShape = draw.addShape;
      this.existingText.freehand = draw.freehand;
      this.existingText.start = draw.start;
      var types = null;
      if (this.config.selectByShape === true) {
        this.toolType = "Area";
        this.widgetIntro.innerHTML = this.nls.widgetIntroSelectByArea;
        types = ['polygon', 'point'];
      } else if (this.config.selectByFeature === true) {
        this.toolType = "Feature";

        this.widgetIntro.innerHTML = string.substitute(this.nls.widgetIntroSelectByFeature, {
          0: this.config.selectByLayer.name
        });
        types = ['point'];
      } else if (this.config.selectByFeatureQuery === true) {
        this.toolType = "FeatureQuery";
        this.widgetIntro.innerHTML = string.substitute(this.nls.widgetIntroSelectByFeatureQuery, {
          0: this.config.selectByLayer.name,
          1: this.config.selectByLayer.queryField
        });

        types = ['point'];
      } else if (this.config.selectByQuery === true) {
        this.toolType = "Query";
        this.widgetIntro.innerHTML = this.nls.widgetIntroSelectByQuery;
      } else {
        this.toolType = "Area";
        this.widgetIntro.innerHTML = this.nls.widgetIntroSelectByArea;
        types = ['polygon', 'point'];
      }

      if (types) {
        this.drawBox = new DrawBox({
          types: types,
          showClear: false
        });
        this.drawBox.placeAt(this.selectionTool);
        this.drawBox.startup();
        this.drawBox.setMap(this.map);

        this.own(on(this.drawBox, 'DrawEnd', lang.hitch(this, this._onDrawEnd)));

      } else {

        this.searchTextBox = new TextBox({
          name: "queryText",
          value: ""/* no or empty value! */,
          placeHolder: this.nls.queryInput
        });
        this.searchTextBox.startup();
        this.searchTextBox.placeAt(this.selectionTool);

        var btnSearch = domConstruct.create("div", {
          innerHTML: this.nls.search
        });
        domConstruct.place(btnSearch, this.selectionTool, 'after');
        html.addClass(btnSearch, 'jimu-btn widget-draw-control');
        on(btnSearch, "click", lang.hitch(this, this._btnSearchClick));
      }

    },
    _btnSearchClick: function () {
      //  this._togglePanelLoadingIcon();
      this.loading.show();

      this._hideInfoWindow();
      this.mouseClickPos = this.map.extent.getCenter();
      this._selectInShape(null, this.searchTextBox.get("value"));
    },
    _findField: function (fields, name) {
      return array.filter(fields, function (field) {
        return field.name === name;
      });
    },
    _selectInShape: function (shape, searchValue) {
      this._clearResults(true);
      var defs = {};
      var rowData;
      var q = new EsriQuery();
      if (shape !== null) {
        if (shape.type === "point" || shape.type === "polyline") {
          var mapUnit = scaleUtils.getUnitValueForSR(this.map.spatialReference);
          q.geometry = geometryEngine.buffer(shape, 10, mapUnit);
        } else {
          if (shape.type === "extent") {
            q.geometry = Polygon.fromExtent(shape);
          }
          else {
            q.geometry = shape;
          }
        }
      }
      var fields;
      var selectedLayers = [];
      array.forEach(this.layersTable.getRows(), function (row) {

        rowData = this.layersTable.getRowData(row);
        if (rowData.isSelectable === true) {
          selectedLayers.push(entities.decode(rowData.label));
        }
      }, this);
      q.spatialRelationship = EsriQuery.SPATIAL_REL_INTERSECTS;
      array.forEach(this.updateLayers, function (layer) {
        if (selectedLayers.indexOf(layer.title) >= 0 || selectedLayers.indexOf(layer.layerObject.name) >= 0) {
          if (searchValue) {
            fields = this._findField(layer.layerObject.fields, layer.queryField);
            if (fields) {
              if (fields.length > 0) {
                if (fields[0].type === "esriFieldTypeString") {
                  q.where = layer.queryField.toString() + " = '" + searchValue.toString() + "'";
                } else {
                  q.where = layer.queryField.toString() + " = " + searchValue.toString() + "";
                }
              } else {
                console.log("field not found in layer");
              }
            } else {
              console.log("field not found in layer");
            }
          }
          var def = layer.layerObject.selectFeatures(q, FeatureLayer.SELECTION_NEW);
          defs[layer.id] = def;
        }
      }, this);
      if (this.isEmptyObject(defs)) {
        this.loading.hide();
      } else {
        all(defs).then(lang.hitch(this, this._layerQueriesComplete));

      }

    },
    isEmptyObject: function (obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          return false;
        }
      }
      return true;
    },
    _selectSearchLayer: function (shape) {
      var q = new EsriQuery();
      if (shape.type === "point" || shape.type === "polyline") {
        var mapUnit = scaleUtils.getUnitValueForSR(this.map.spatialReference);
        q.geometry = geometryEngine.buffer(shape, 10, mapUnit);
      } else {
        q.geometry = shape;
      }
      if (this.toolType === "FeatureQuery") {
        q.outFields = [this.config.selectByLayer.queryField];
      }
      q.spatialRelationship = EsriQuery.SPATIAL_REL_INTERSECTS;
      this.selectByLayer.layerObject.selectFeatures(q, FeatureLayer.SELECTION_NEW)
        .then(lang.hitch(this, this._searchByLayerComplete));
    },
    _searchByLayerComplete: function (results) {
      if (results.length > 0) {
        if (this.toolType === "FeatureQuery") {
          var searchValue = results[0].attributes[this.config.selectByLayer.queryField];
          if (searchValue === null) {
            new Message({
              message: string.substitute(this.nls.errors.queryNullID, {
                0: this.selectByLayer.title
              })
            });
            this._hideInfoWindow();
            this.loading.hide();
          } else {
            this._selectInShape(null, searchValue);
          }
        } else {
          this._selectInShape(results[0].geometry);
        }
      } else {
        this._hideInfoWindow();
        this.loading.hide();
        // this._togglePanelLoadingIcon();
      }
    },
    _clearRowHighlight: function (clearResultMessage) {

      var labelCell;
      var countCell;
      var syncCell;
      array.forEach(this.layersTable.getRows(), function (row) {

        labelCell = query('.label', row).shift();
        countCell = query('.numSelected', row).shift();
        syncCell = query('.syncStatus', row).shift();
        html.removeClass(labelCell, 'maxRecordCount');
        html.removeClass(countCell, 'maxRecordCount');
        html.removeClass(syncCell, 'syncComplete');
        html.removeClass(syncCell, 'syncProcessing');
        html.removeClass(syncCell, 'syncSkipped');
      }, this);
      if (clearResultMessage === true) {
        this.resultsMessage.innerHTML = "";
      }
    },
    _layerQueriesComplete: function (results) {
      var features = [];
      var rowData;

      var layerRes;
      var layer;
      var editData;
      var labelCell;
      var countCell;
      array.forEach(this.layersTable.getRows(), function (row) {

        rowData = this.layersTable.getRowData(row);
        if (results.hasOwnProperty(rowData.ID)) {
          layerRes = results[rowData.ID];
          layer = this.map.getLayer(rowData.ID);
          features = features.concat(layerRes);
          editData = {
            numSelected: layerRes.length.toString()
          };

          this.layersTable.editRow(row, editData);
          labelCell = query('.label', row).shift();
          countCell = query('.numSelected', row).shift();

          if (layerRes.length > 0) {
            if (layerRes.length >= layer.maxRecordCount) {

              html.addClass(labelCell, 'maxRecordCount');
              html.addClass(countCell, 'maxRecordCount');
            } else {
              html.removeClass(labelCell, 'maxRecordCount');
              html.removeClass(countCell, 'maxRecordCount');
            }
          } else {
            html.removeClass(labelCell, 'maxRecordCount');
            html.removeClass(countCell, 'maxRecordCount');
          }

          if (layerRes.length > 0) {
            this.clickList.push(on(layer, 'click', lang.hitch(this, function () {

              this.map.infoWindow.show(this.mouseClickPos, this.map.getInfoWindowAnchor(this.mouseClickPos));
            })));
          }

        }
      }, this);
      this._updateSelectionCount(features.length);

      if (features.length > 0) {
        this._summarizeFeatureFields(features);
        this._createAttributeInspector();
        this._createQueryParams();

        this.helperLayer.selectFeatures(this.selectQuery, FeatureLayer.SELECTION_NEW,
          lang.hitch(this, this._helperLayerSelectCallback),
          lang.hitch(this, this._errorCallback)
        );

      } else {
        this._hideInfoWindow();
        this.loading.hide();
        //this._togglePanelLoadingIcon();
      }
    },
    // Event handler for when a drawing is finished.
    // returns: nothing
    _onDrawEnd: function (graphic) {
      this.loading.show();
      //this._togglePanelLoadingIcon();
      this.drawnGrph = graphic;

      this._hideInfoWindow();

      if (graphic.geometryType === "esriGeomtryTypePoint") {
        this.mouseClickPos = graphic;
      } else {
        if (graphic.geometry.type === "extent") {
          this.mouseClickPos = graphic.geometry.getCenter();
        } else if (graphic.geometry.type === "polygon") {
          this.mouseClickPos = graphic.geometry.getCentroid();
        } else if (graphic.geometry.type === "polyline") {
          this.mouseClickPos = graphic.geometry.getExtent().getCenter();
        } else {
          this.mouseClickPos = graphic.geometry;
        }
      }

      if (this.toolType === "Area") {
        this._selectInShape(graphic.geometry);
      } else if (this.toolType === "Feature") {
        this._selectSearchLayer(graphic.geometry);
      } else if (this.toolType === "FeatureQuery") {
        this._selectSearchLayer(graphic.geometry);
      }

    },
    _errorCallback: function () {
      this.loading.hide();
      // this._togglePanelLoadingIcon();
    },
    // Callback function for 'Helper Layer' selection.
    // returns: nothing
    _helperLayerSelectCallback: function (features) {
      if (features.length > 0) {
        this._bindEvents();
        this.map.infoWindow.setTitle(this.label);
        this.map.infoWindow.setContent(this.attrInspector.domNode);

        this.map.infoWindow.show(this.mouseClickPos, this.map.getInfoWindowAnchor(this.mouseClickPos));
      } else {
        this._hideInfoWindow();
      }
      this.loading.hide();

      //this._togglePanelLoadingIcon();
    },

    // Clear the graphics from the widget.
    // returns: nothing
    _clearGraphics: function () {
      if (this.drawBox) {
        if (this.drawBox.drawLayer) {
          this.drawBox.drawLayer.clear();
        }
      }
      array.forEach(this.updateLayers, function (layer) {
        if (layer.layerObject !== null) {
          layer.layerObject.clearSelection();
        }
      });
      this._hideInfoWindow();
    },
    _togglePanelLoadingIcon: function () {

      if (html.hasClass(this.loadingImage, 'hide')) {
        html.removeClass(this.loadingImage, 'hide');
      } else {
        html.addClass(this.loadingImage, 'hide');
      }
    },
    _createQueryParams: function () {
      this.selectQuery = new EsriQuery();
      //this.selectQuery.where = '1=1';
      this.selectQuery.objectIds = [1];
      //this.selectQuery.outFields = ["*"];
    },

    loadLayerTable: function () {
      this.updateLayers = [];

      var label = '';
      var tableValid = false;
      var symbol = null;
      array.forEach(this.map.itemInfo.itemData.operationalLayers, function (layer) {
        if (layer.layerObject !== null && layer.layerObject !== undefined) {
          if (layer.layerObject.type === 'Feature Layer' && layer.url && layer.layerObject.isEditable() === true) {

            var filteredArr = array.filter(this.config.updateLayers, function (layerInfo) {
              return entities.decode(layerInfo.name) === layer.title;
            });
            if (filteredArr.length > 0) {
              if (filteredArr[0].selectionSymbol) {
                var highlightSymbol = symbolJsonUtils.fromJson(filteredArr[0].selectionSymbol);
                layer.layerObject.setSelectionSymbol(highlightSymbol);
              }
              layer.queryField = filteredArr[0].queryField;
              this.updateLayers.push(layer);
              label = layer.title;
              this.layersTable.addRow({
                isSelectable: true,
                label: label,
                ID: layer.layerObject.id,
                numSelected: "0",
                selectionSymbol: symbol
              });
              tableValid = true;
            }
          }
        }
      }, this);

      if (!tableValid) {
        domStyle.set(this.tableLayerInfosError, 'display', '');
      } else {
        domStyle.set(this.tableLayerInfosError, 'display', 'none');
      }
    },
    createLayerTable: function () {
      var layerTableFields = [{
        name: 'isSelectable',
        title: "",
        type: 'checkbox',
        'class': 'isSelectable'
      }, {
        name: 'actions',
        title: '<img src="' + this.folderUrl + 'css/images/filter.png" width=16 height=16>',
        type: 'actions',
        actions: ['edit'],
        'class': 'isSelectable'
      }, {
        name: 'numSelected',
        title: this.nls.layerTable.numSelected,
        type: 'text',
        'class': 'selectioncount'
      }, {
        name: 'label',
        title: this.nls.layerTable.colLabel,
        type: 'text',
        'class': 'label'
      }, {
        name: 'syncStatus',
        type: 'text',
        title: this.nls.layerTable.colSyncStatus,
        'class': 'syncStatus'
      }, {
        name: 'ID',
        type: 'text',
        hidden: true
      }];
      var args = {
        fields: layerTableFields,
        selectable: false
      };
      domConstruct.empty(this.tableLayerInfos);
      this.layersTable = new SimpleTable(args);
      this.layersTable.placeAt(this.tableLayerInfos);
      this.layersTable.startup();
      var nl = query("th.simple-table-field", this.layersTable.domNode);
      nl.forEach(function (node) {
        if (node.innerHTML.indexOf("<img") >= 0) {
          node.title = this.nls.filterPopup;
        }
        //TODO - Added count to NLS for 4.3
        //else if (node.title === this.nls.layerTable.numSelected)
        //{
        //  node.title = "count";
        //}
      }, this);
      this.own(on(this.layersTable, 'actions-edit', lang.hitch(this, function (tr) {
        this._showFilter(tr);
      })));
    },
    disableWebMapPopup: function () {
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
        this.own(on(this.map.infoWindow, "show", lang.hitch(this, function () {
          if (window.appInfo.isRunInMobile) {
            this.map.infoWindow.maximize();
          }
        })));
      }
      mapManager.resetInfoWindow = lang.hitch(this, function () { });
    },
    enableWebMapPopup: function () {
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
        // recall enableWebMap
        mapManager.enableWebMapPopup();
      }
    },
    _enableMapClickHandler: function () {
    },
    _disableMapClickHandler: function () {
    },
    // Add the helper layer for use in Attribute Inspector.
    // returns: nothing
    _addHelperLayer: function () {
      this.helperLayer = this._createHelperLayer();
      //this.map.addLayer(this.helperLayer);
    },
    // Create helper layer for Attribute Inspector.
    // returns: helper layer (FeatureLayer)
    _createHelperLayer: function () {
      if (this.updateLayers.length === 0) {
        return;
      }

      var firstUpdateLayer = this.updateLayers[0];
      var jsonFS = {
        'geometryType': "esriGeometryPoint",
        'features': [{
          'attributes': this._generateHelperLayerAttributes(firstUpdateLayer)
        }]
      };

      var fs = new FeatureSet(jsonFS);
      var layerDefinition = {
        'name': "",
        'fields': this._generateHelperLayerFields(firstUpdateLayer),
        'objectIdField': this._generateHelperObjIdField(firstUpdateLayer)
      };
      //layerDefinition.fields[1].type = layerDefinition.fields[1].typeOrigin;

      var featureCollection = {
        layerDefinition: layerDefinition,
        featureSet: fs
      };

      var fL = new FeatureLayer(featureCollection, {
        outFields: ['*'],
        infoTemplate: null
      });
      fL.setEditable(true);

      this.helperEditFieldInfo = this._generateHelperLayerFieldsInfos(firstUpdateLayer, layerDefinition.fields);
      return fL;
    },
    _processLayerFields: function (fields) {
      //Function required to add the Range details to a range domain so the layer can be cloned

      array.forEach(fields, function (field) {
        if (field.type !== "esriFieldTypeOID") {
          field.nullable = true;
        }

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
    // Generate the attributes for the helper layer.
    // returns: {'field1': 'value1'...}
    _generateHelperLayerAttributes: function (layer) {
      var result = {};

      var fieldNames = array.map(this.config.commonFields, function (fieldInfo) {
        return fieldInfo.name;
      });
      array.forEach(layer.layerObject.fields, function (field) {
        var val = null;
        if (field.type === 'esriFieldTypeOID' || (field.name === layer.layerObject.objectIdField)) {
          result[field.name] = 1;
        } else if (fieldNames.indexOf(field.name) > -1) {
          result[field.name] = val;
        }
      }, this);

      return result;
    },
    // Generate the fields for the helper layer.
    // returns: [field1, field2,...]
    _generateHelperLayerFields: function (layer) {
      var fields = [];

      var fieldNames = array.map(this.config.commonFields, function (fieldInfo) {
        return fieldInfo.name;
      });
      var newFields = lang.clone(layer.layerObject.fields);
      array.forEach(newFields, function (field) {
        if (field.type === 'esriFieldTypeOID' || (field.name === layer.layerObject.objectIdField)) {
          field.typeOrigin = field.type;
          field.type = "esriFieldTypeOID";
          fields.push(field);
        } else if (fieldNames.indexOf(field.name) > -1) {

          field.typeOrigin = field.type;
          field.type = "esriFieldTypeString";
          fields.push(field);
        }
      }, this);
      this._processLayerFields(fields);
      return fields;
    },
    _generateHelperObjIdField: function (layer) {
      var objField = null;
      array.forEach(layer.layerObject.fields, function (field) {
        if ((field.name === layer.layerObject.objectIdField)) {
          objField = field.name;
        }
      }, this);

      return objField;
    },
    // Generate the field Infos used in the Attribute Inspector
    // returns fieldInfos
    _generateHelperLayerFieldsInfos: function (layer, fields) {
      var fieldInfos = [];
      this.baeFields = {};
      var fieldNames = array.map(fields, function (field) {
        return field.name;
      });
      var fieldTypes = array.map(fields, function (field) {
        return field.typeOrigin;
      });
      array.forEach(layer.layerObject.infoTemplate.info.fieldInfos, function (field) {
        if (fieldNames.indexOf(field.fieldName) > -1) {
          if (field.fieldName.toUpperCase() === 'OBJECTID' || (field.fieldName === layer.layerObject.objectIdField)) {
            field.isEditable = false;
            field.visible = false;
            field.typeOrigin = fieldTypes[fieldNames.indexOf(field.fieldName)];
          } else {
            this.baeFields[field.fieldName] = field.label;
            field.isEditable = true;
            field.visible = true;
            field.typeOrigin = fieldTypes[fieldNames.indexOf(field.fieldName)];
            fieldInfos.push(field);
          }
        }
      }, this);
      return fieldInfos;
    },
    _bindEvents: function () {
      this._attTable = query("td.atiLabel", this.attrInspector.domNode);
      if (this._attTable === undefined || this._attTable === null) {
        return;
      }

      if (this._attTable.length > 0) {
        array.forEach(this._attTable, function (row) {
          var rowInfo = this._getRowInfo(row);
          var evtData = {};
          if (rowInfo[2].declaredClass === 'dijit.form.FilteringSelect') {
            for (var k in this.baeFields) {
              if (this.baeFields.hasOwnProperty(k)) {
                if (this.baeFields[k] === rowInfo[3]) {
                  evtData.fieldName = k;
                  break;
                }
              }
            }
            dojo.connect(rowInfo[2], 'onChange', lang.hitch(this, this.fieldChanged(evtData)));
          }

        }, this);
      }

    },
    fieldChanged: function (evtData) {
      return function (evt) {
        if (evt === "") {
          evtData.fieldValue = "";
          evtData.dataType = "string";
          this._attrInspectorAttrChange(evtData);

        }
      };
    },
    // Create the attribute inspector
    _createAttributeInspector: function () {
      this._changeList = {};
      var attrInspector;
      this.currentLayerInfos = [{
        'featureLayer': this.helperLayer,
        'isEditable': true,
        'showDeleteButton': false,
        'fieldInfos': this.helperEditFieldInfo
      }];
      try {
        attrInspector = new AttributeInspector({
          layerInfos: this.currentLayerInfos,
          _hideNavButtons: true
        }, domConstruct.create('div'));
      } catch (err) {
        alert(err.message);
      }
      var saveButton = domConstruct.create('div', {
        'id': 'attrInspectorSaveBtn',
        'class': 'jimu-btn jimu-state-disabled',
        innerHTML: this.nls.editorPopupSaveBtn
      });

      var loadingIcon = domConstruct.create('div', {
        'id': 'popupLoadingIcon',
        'class': 'loading hide'
      });

      domConstruct.place(saveButton, attrInspector.deleteBtn.domNode, 'after');

      domConstruct.place(loadingIcon, attrInspector.deleteBtn.domNode, 'after');

      this.own(on(saveButton, 'click', lang.hitch(this, this._attrInspectorOnSave)));

      attrInspector.on('attribute-change', lang.hitch(this, this._attrInspectorAttrChange));

      this.attrInspector = attrInspector;
      this.attrInspector.startup();


      var nodes = this.attrInspector.domNode.childNodes[3];
      var tableNode = nodes.childNodes;
      var stateStore;
      this.editPopup.resize(500, 251);
      setTimeout(lang.hitch(this, function () {
        if (tableNode.length > 0) {
          var rows = tableNode[0].rows;
          if (rows.length > 0) {
            array.forEach(rows, lang.hitch(this, function (row, i) {
              var textCell = row.cells[0];
              var inputCell = row.cells[1];

              var inputDijit = registry.byNode(inputCell.childNodes[0]);
              var currentFeatureValue = this._currentFeatureValues[textCell.innerText];
              if (typeof (inputDijit.store) !== 'undefined') {
                //do nothing, it's a domain, use it. still need to add a null catch
                domAttr.set(inputDijit, "placeHolder", this.nls.existingValue);
                //inputDijit.placeHolder = this.nls.existingValue;

                stateStore = inputDijit.store;
                var newItem = {};
                newItem._0 = stateStore._arrayOfAllItems.length;
                newItem._RI = true;
                newItem._S = stateStore._arrayOfAllItems[stateStore._arrayOfAllItems.length - 1]._S;
                newItem.id = [];
                newItem.name = [];
                newItem.id[0] = this.nls.noValue;
                newItem.name[0] = this.nls.noValue;
                stateStore._arrayOfAllItems.push(newItem);
                if (currentFeatureValue.values.length === 1) {
                  if (currentFeatureValue.values[0] !== null) {
                    array.some(stateStore._arrayOfAllItems, function (item) {
                      if (item.id[0].toString() === currentFeatureValue.values[0].toString()) {
                        inputDijit.set("value", stateStore.getIdentity(item));
                        return true;
                      }
                    });
                    /* jshint ignore:start */
                    //when(stateStore.query(function (object) {
                    //  return object.id === currentFeatureValue.values[0];
                    //}),
                    //function (results) {
                    //  inputDijit.set("value", stateStore.getIdentity(results[0]));
                    //});

                    //when(stateStore.query(function (item, index, items) {
                    //  return index === 0;
                    //}),
                    //function (results) {
                    //  inputDijit.set("value", stateStore.getIdentity(results[0]));
                    //});
                    /* jshint ignore:end */
                  }
                }

              }
              else {

                var defaultVal = '';
                var dataType = "String";
                var dataStruct = [];

                switch (currentFeatureValue.type) {
                  case "esriFieldTypeInteger":
                    dataType = "Number";
                    break;
                  case "esriFieldTypeSmallInteger":
                    dataType = "Number";
                    break;
                  case "esriFieldTypeDouble":
                    dataType = "Float";
                    break;
                  case "esriFieldTypeSingle":
                    dataType = "Float";
                    break;
                  case "esriFieldTypeString":
                    dataType = "String";
                    break;
                  case "esriFieldTypeDate":
                    if (currentFeatureValue.format &&
                      currentFeatureValue.format !== null) {
                      if (currentFeatureValue.format.dateFormat &&
                      currentFeatureValue.format.dateFormat !== null) {

                        if (currentFeatureValue.format.dateFormat ===
                          "shortDateShortTime" ||
                          currentFeatureValue.format.dateFormat ===
                          "shortDateLongTime" ||
                          currentFeatureValue.format.dateFormat ===
                          "shortDateShortTime24" ||
                          currentFeatureValue.format.dateFormat ===
                          "shortDateLEShortTime" ||
                          currentFeatureValue.format.dateFormat ===
                          "shortDateLEShortTime24") {
                          dataType = "DateTime";
                        }
                        else {
                          dataType = "Date";
                        }
                      }
                      else {
                        dataType = "Date";
                      }
                    }
                    else {
                      dataType = "Date";
                    }

                    break;
                  case "esriFieldTypeGeometry":
                    break;
                  case "esriFieldTypeOID":
                    break;
                  case "esriFieldTypeBlob":
                    break;
                  case "esriFieldTypeGlobalID":
                    dataType = "String";
                    break;
                  case "esriFieldTypeRaster":
                    break;
                  case "esriFieldTypeGUID":
                    dataType = "String";
                    break;
                  case "esriFieldTypeXML":
                    break;

                }

                array.forEach(currentFeatureValue.values, lang.hitch(this, function (value) {
                  if (value !== null && value !== "null") {
                    if (dataType === "Date" || dataType === "DateTime") {
                      var d = new Date(value * 1);
                      dataStruct.push({ name: d.toLocaleString(), id: d.toLocaleString() });
                    } else {
                      dataStruct.push({ name: value, id: value });
                    }
                  }

                }));

                dataStruct.push({ name: this.nls.noValue, id: this.nls.noValue });
                if (dataType === "Date" || dataType === "DateTime") {
                  dataStruct.push({ name: this.nls.newDate, id: this.nls.newDate });
                }

                stateStore = new Memory({
                  data: dataStruct
                });

                //defaultVal = inputDijit.get('value');

                var comboBox = new ComboBox({
                  name: "cbbox" + i,
                  'class': 'bae-attCombo',
                  value: defaultVal,
                  store: stateStore,
                  searchAttr: "name",
                  placeHolder: this.nls.existingValue//this.nls.valueChooser
                }, inputCell);
                comboBox.startup();
                inputDijit = comboBox;
                if (currentFeatureValue.values.length === 1) {
                  if (currentFeatureValue.values[0] !== null) {
                    /* jshint ignore:start */

                    when(stateStore.query(function (item, index, items) {
                      return index === 0;
                    }),
                    function (results) {
                      inputDijit.set("value", stateStore.getIdentity(results[0]));
                    });
                    /* jshint ignore:end */
                  }
                }

                on(comboBox, 'change', lang.hitch(this, function (evt) {
                  if (evt === this.nls.newDate) {
                    this._createDatePicker({ 'row': row, 'evt': evt, 'textCell': textCell, 'dataType': dataType });
                  } else {
                    this._destroyDatePicker({ 'row': row });
                    var valid = true;
                    if (dataType === "Number") {
                      if (evt !== this.nls.existingValue && evt !== this.nls.noValue) {
                        if (isNaN(Number(evt))) {
                          valid = false;
                          domClass.add(comboBox.domNode, ["dijitTextBoxError", "dijitComboBoxError",
                            "dijitError", "dijitValidationTextBoxError"]);
                        } else if (Number(evt) % 1 !== 0) {
                          valid = false;
                          domClass.add(comboBox.domNode, ["dijitTextBoxError", "dijitComboBoxError",
                            "dijitError", "dijitValidationTextBoxError"]);
                        } else {
                          domClass.remove(comboBox.domNode, ["dijitTextBoxError", "dijitComboBoxError",
                            "dijitError", "dijitValidationTextBoxError"]);
                        }
                      } else {
                        domClass.remove(comboBox.domNode, ["dijitTextBoxError", "dijitComboBoxError",
                         "dijitError", "dijitValidationTextBoxError"]);
                      }
                    }
                    else if (dataType === "Float") {
                      if (evt !== this.nls.existingValue && evt !== this.nls.noValue) {
                        if (isNaN(Number(evt))) {
                          valid = false;
                          domClass.add(comboBox.domNode, ["dijitTextBoxError", "dijitComboBoxError",
                            "dijitError", "dijitValidationTextBoxError"]);
                        } else {
                          domClass.remove(comboBox.domNode, ["dijitTextBoxError", "dijitComboBoxError",
                            "dijitError", "dijitValidationTextBoxError"]);
                        }
                      } else {
                        domClass.remove(comboBox.domNode, ["dijitTextBoxError", "dijitComboBoxError",
                         "dijitError", "dijitValidationTextBoxError"]);
                      }
                    }
                    else if (dataType === "Date" || dataType === "DateTime") {
                      if (evt !== this.nls.existingValue && evt !== this.nls.noValue && evt !== "") {
                        var dtValue = new Date(evt);
                        if (dtValue !== "Invalid Date") {
                          evt = dtValue.setDate(dtValue.getDate());
                        }
                        if (dtValue === "Invalid Date" || isNaN(dtValue) === true) {
                          valid = false;
                          domClass.add(comboBox.domNode, ["dijitTextBoxError", "dijitComboBoxError",
                            "dijitError", "dijitValidationTextBoxError"]);
                        } else {
                          domClass.remove(comboBox.domNode, ["dijitTextBoxError", "dijitComboBoxError",
                            "dijitError", "dijitValidationTextBoxError"]);
                        }
                      } else {
                        domClass.remove(comboBox.domNode, ["dijitTextBoxError", "dijitComboBoxError",
                          "dijitError", "dijitValidationTextBoxError"]);
                      }
                    }
                    this._getComboBoxVal({ 'valid': valid, 'evt': evt, 'textCell': textCell, 'dataType': dataType });
                  }
                }));

              }



            }));
          }
        }
      }, 1000));

    },
    _getRowInfo: function (row) {
      var valueCell = row.parentNode.childNodes[1].childNodes[0];
      var valueCell2 = null;
      if (row.parentNode.childNodes[1].childNodes.length > 1) {
        valueCell2 = row.parentNode.childNodes[1].childNodes[1];
      }
      var label = row.childNodes[0].data;
      var parent = row.parentNode;
      var widget = registry.getEnclosingWidget(valueCell);

      return [valueCell, parent, widget, label, valueCell2];
    },

    //_getKeepExistingValueAttrs: function () {
    //  return;
    //  this._attTable = query("td.atiLabel", this.attrInspector.domNode);
    //  if (this._attTable === undefined || this._attTable === null) {
    //    return;
    //  }

    //  if (this._attTable.length > 0) {
    //    array.forEach(this._attTable, lang.hitch(this, function (row) {

    //      var rowInfo = this._getRowInfo(row[0]);

    //      var valueCell = rowInfo[0];
    //      var valueCell2 = rowInfo[4];
    //      var parent = rowInfo[1];
    //      var widget = rowInfo[2];
    //      if (widget === undefined || widget === null) {
    //        console.log(row[0]);
    //      }
    //      //var inputDijit = registry.byNode(inputCell.childNodes[0]);
    //      //domAttr.get(inputDijit, "placeHolder", this.nls.existingValue);

    //    }));
    //  }

    //},
    _createDatePicker: function (pParams) {
      var saveBtn = dom.byId('attrInspectorSaveBtn');
      html.addClass(saveBtn, 'jimu-state-disabled');
      var dateHolderNode = domConstruct.create("div", {
        'class': 'newDateCell'
      });
      domConstruct.place(dateHolderNode, pParams.row);
      var d = new Date();
      var defaultDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
      var txtDate = new DateTextBox({
        value: defaultDate,
        placeHolder: defaultDate
      }).placeAt(dateHolderNode);
      txtDate.startup();
      on(txtDate, 'change', lang.hitch(this, function (evt) {
        html.removeClass(saveBtn, 'jimu-state-disabled');
        if (evt === "") {
          evt = defaultDate;
        }
        if (pParams.dataType === "DateTime") {
          this._createTimePicker(pParams);
        }

        this._getComboBoxVal({ 'valid': true, 'evt': evt, 'textCell': pParams.textCell, 'dataType': pParams.dataType });
      }));
    },

    _createTimePicker: function (pParams) {
      var dateHolderNode = domConstruct.create("div", {
        'class': 'newDateCell'
      });
      var d = new Date();
      var defaultTime = d.toLocaleTimeString();
      domConstruct.place(dateHolderNode, pParams.row);
      var timeNode = new TimeTextBox({
        "class": "ee-inputField",
        value: defaultTime,
        placeHolder: defaultTime
      }).placeAt(dateHolderNode);
      timeNode.startup();
      on(timeNode, 'change', lang.hitch(this, function (evt) {
        if (evt === "") {
          evt = defaultTime;
        }
        this._getComboBoxVal({ 'valid': true, 'evt': evt, 'textCell': pParams.textCell, 'dataType': "Time" });
      }));
    },

    _destroyDatePicker: function (pParams) {
      var dateNodes = query(".newDateCell", pParams.row);
      if (dateNodes.length > 0) {
        array.forEach(dateNodes, function (dateNode) {
          domConstruct.empty(dateNode);
          domConstruct.destroy(dateNode);
        });
      }
    },

    _getComboBoxVal: function (pParams) {
      var saveBtn = dom.byId('attrInspectorSaveBtn');
      if (pParams.valid) {
        var dataStruct = {};
        dataStruct.fieldValue = pParams.evt;
        dataStruct.dataType = pParams.dataType;
        array.forEach(this.currentLayerInfos[0].fieldInfos, lang.hitch(this, function (fieldInfo) {
          if (fieldInfo.label === pParams.textCell.innerHTML ||
            (fieldInfo.label === pParams.textCell.innerText)) {
            dataStruct.fieldName = fieldInfo.fieldName;
          }


        }));
        //array.forEach(this.updateLayers, lang.hitch(this, function (layer) {
        //  array.forEach(layer.layerObject.getSelectedFeatures(), lang.hitch(this, function (feature) {
        //    array.forEach(this.currentLayerInfos.fieldInfos, lang.hitch(this, function (fieldInfo) {
        //      if (fieldInfo.fieldName === pParams.textCell.innerHTML) {
        //        dataStruct.fieldName = field.fieldName;
        //      }
        //    }));
        //  }));
        //}));

        this._attrInspectorAttrChange(dataStruct);
        html.removeClass(saveBtn, 'jimu-state-disabled');
      } else {
        html.addClass(saveBtn, 'jimu-state-disabled');
      }
    },

    // Event handler for when an attribute is changed in the attribute
    // inspector.
    // returns: nothing
    _attrInspectorAttrChange: function (evt) {
      this._changeList[evt.fieldName] = evt.fieldValue;
      var saveBtn = dom.byId('attrInspectorSaveBtn');

      //hacky way to check if fields arent validated.
      if (this.attrInspector.domNode.innerHTML.indexOf('Error') < 0) {
        html.removeClass(saveBtn, 'jimu-state-disabled');
      } else {
        html.addClass(saveBtn, 'jimu-state-disabled');
      }
      array.forEach(this.updateLayers, function (layer) {
        array.forEach(layer.layerObject.getSelectedFeatures(), function (feature) {
          if (evt.fieldValue !== this.nls.editorPopupMultipleValues) {
            if (typeof (evt.dataType) !== 'undefined') {
              if (evt.dataType === "Time") {
                var curVal = new Date(feature.attributes[evt.fieldName]);
                var newVal = new Date(curVal.setHours((evt.fieldValue).getHours()));
                newVal = new Date(newVal.setMinutes((evt.fieldValue).getMinutes()));
                newVal = new Date(newVal.setSeconds((evt.fieldValue).getSeconds()));
                feature.attributes[evt.fieldName] = newVal;
              } else {
                feature.attributes[evt.fieldName] = evt.fieldValue;
              }
            } else {
              feature.attributes[evt.fieldName] = evt.fieldValue;
            }
          }
        }, this);
        var clearSel = on(layer.layerObject, "selection-clear", lang.hitch(this, function () {

          layer.layerObject.refresh();
          clearSel.remove();
        }));

      }, this);

      for (var k in this._changeList) {
        if (this._changeList.hasOwnProperty(k)) {
          if (this._changeList[k] !== "") {
            return;
          }
        }
      }
      html.addClass(saveBtn, 'jimu-state-disabled');
    },

    _xrange: function (b0, b1, quantum) {

      if (!quantum) {
        quantum = 1;
      }
      if (!b1) {
        b1 = b0;
        b0 = 0;
      }
      var out = [];
      for (var i = b0,
          idx = 0; i < b1; i += quantum, idx++) {
        out[idx] = i;
      }
      return out;
    },
    _chunks: function (l, n) {
      var newn = parseInt(1.0 * l.length / n + 0.5, 10);
      var retArr = [];
      for (var i in this._xrange(0, n - 1)) {
        retArr.push(l.slice(i * newn, i * newn + newn));

      }
      retArr.push(l.slice(n * newn - newn));
      return retArr;
    },
    // Event handler for when the Save button is clicked in the attribute inspector.
    // returns: nothing
    _attrInspectorOnSave: function (evt) {
      //this._getKeepExistingValueAttrs();
      if (html.hasClass(evt.target, 'jimu-state-disabled')) {
        return;
      }
      if (this.attrInspector.domNode.innerHTML.indexOf('Error') < 0) {
        html.removeClass(evt.target, 'jimu-state-disabled');
      } else {
        html.addClass(evt.target, 'jimu-state-disabled');
      }
      if (domClass.contains(evt.target, 'jimu-state-disabled')) {
        new Message({
          message: this.nls.errors.inputValueError
        });
        html.removeClass(evt.target, 'jimu-state-disabled');
        return;
      }
      this.loading.show();
      // this._togglePanelLoadingIcon();

      //disable the save button
      html.addClass(evt.target, 'jimu-state-disabled');
      this.map.infoWindow.hide();
      this.map.infoWindow.highlight = false;
      var syncDet;
      this.syncLayers = [];

      var rowData;

      var selectedLayers = [];
      array.forEach(this.layersTable.getRows(), function (row) {

        rowData = this.layersTable.getRowData(row);
        if (rowData.isSelectable === true) {
          selectedLayers.push(entities.decode(rowData.label));
        } else {
          this.layersTable.editRow(row, {
            'syncStatus': this.nls.featuresSkipped
          });
          var cell = query('.syncStatus', row).shift();

          html.removeClass(cell, 'syncProcessing');
          html.removeClass(cell, 'syncComplete');
          html.addClass(cell, 'syncSkipped');
        }
      }, this);

      var validUpdate = false;
      array.forEach(this.updateLayers, function (layer) {
        if (selectedLayers.indexOf(layer.title) >= 0 || selectedLayers.indexOf(layer.layerObject.name) >= 0) {
          var selectFeat = layer.layerObject.getSelectedFeatures();
          if (selectFeat) {
            if (selectFeat.length > 0) {

              array.forEach(selectFeat, lang.hitch(this, function (feat) {
                for (var k in feat.attributes) {
                  if (feat.attributes.hasOwnProperty(k)) {
                    if (this.baeFields.hasOwnProperty(k)) {
                      if (feat.attributes[k] === this.nls.existingValue) {
                        delete feat.attributes[k];
                      }
                      else if (this._changeList.hasOwnProperty(k) === false) {
                        delete feat.attributes[k];
                      }
                      else if (this._changeList[k] === "") {
                        delete feat.attributes[k];
                      }
                      else if (feat.attributes[k] === "") {
                        delete feat.attributes[k];
                      }
                      else if (feat.attributes[k] === null) {
                        delete feat.attributes[k];
                      } else if (feat.attributes[k] === this.nls.noValue) {
                        feat.attributes[k] = null;
                      } else {
                        //do nothing
                      }
                    } else if (layer.layerObject.objectIdField !== k) {
                      delete feat.attributes[k];
                    }

                  }
                }
              }));

              validUpdate = true;
              array.some(this.layersTable.getRows(), function (row) {
                rowData = this.layersTable.getRowData(row);

                if (rowData.ID === layer.id) {
                  this.layersTable.editRow(row, {
                    'syncStatus': 0 + " / " + selectFeat.length
                  });
                  var cell = query('.syncStatus', row).shift();
                  html.removeClass(cell, 'syncComplete');
                  html.removeClass(cell, 'syncSkipped');
                  html.addClass(cell, 'syncProcessing');
                  return true;
                }

              }, this);

              var idx;
              var max_chunk = 300;
              var chunks;
              var bins;
              if (selectFeat.length > max_chunk) {

                bins = parseInt(selectFeat.length / max_chunk, 10);
                if (selectFeat.length % max_chunk > 0) {
                  bins += 1;
                }
                chunks = this._chunks(selectFeat, bins);
                idx = 0;
                syncDet = new layerSyncDetails({
                  "layerID": layer.id,
                  "numberOfRequest": bins,
                  "totalRecordsToSync": selectFeat.length

                });
                on(syncDet, "complete", lang.hitch(this, this._syncComplete));
                on(syncDet, "requestComplete", lang.hitch(this, this._requestComplete));
                this.syncLayers.push(syncDet);

                this.applyCallback(chunks, idx, layer, syncDet);

              } else {
                chunks = [selectFeat];
                idx = 0;
                syncDet = new layerSyncDetails({
                  "layerID": layer.id,
                  "numberOfRequest": 1,
                  "totalRecordsToSync": selectFeat.length

                });
                on(syncDet, "complete", lang.hitch(this, this._syncComplete));
                on(syncDet, "requestComplete", lang.hitch(this, this._requestComplete));

                this.syncLayers.push(syncDet);
                this.applyCallback(chunks, idx, layer, syncDet);

              }
            }
          }
        }
      }, this);

      if (validUpdate === false) {
        this.loading.hide();
        new Message({
          message: this.nls.errors.noSelectedLayers
        });
      }

    },
    applyCallback: function (chunks, idx, layer, syncDet) {
      var def;
      if (idx === 0) {
        array.forEach(chunks[idx], function (feat) {
          delete feat.geometry;
        });
        def = layer.layerObject.applyEdits(null, chunks[idx], null,
          lang.hitch(this, this.applyCallback(chunks, idx + 1, layer, syncDet)),
          lang.hitch(this, this.applyErrorback(chunks[idx], layer))
        );
        syncDet.addDeferred(def);
      } else {
        /*return function(added, updated, removed) {*/
        return function (added, updated, removed) {
          if (chunks.length > idx) {
            def = layer.layerObject.applyEdits(null, chunks[idx], null,
              lang.hitch(this, this.applyCallback(chunks, idx + 1, layer, syncDet)),
              lang.hitch(this, this.applyErrorback(chunks, idx + 1, layer))
            );
            syncDet.addDeferred(def);
          }
          return {
            'added': added,
            'updated': updated,
            'removed': removed
          };
        };
      }
    },
    applyErrorback: function (chunk, layer) {

      return function (err) {
        err.layer = layer;
        err.chunk = chunk;
        return err;
      };

    },
    _syncComplete: function () {
      var stillProc = array.some(this.syncLayers, function (syncDet) {
        if (syncDet.isComplete() === false) {

          return true;
        }
      });
      if (stillProc === false) {
        var total = 0;
        var totalComplete = 0;
        var errors = 0;
        array.forEach(this.syncLayers, lang.hitch(this, function (syncDet) {
          total = total + syncDet.totalRecordsToSync;
          errors = errors + syncDet.recordsErrors;
          totalComplete = totalComplete + syncDet.recordsSynced - syncDet.recordsErrors;
          array.forEach(this.updateLayers, lang.hitch(this, function (updLyr) {
            if (typeof (updLyr.id) !== 'undefined') {
              if (updLyr.id === syncDet.layerID) {
                updLyr.layerObject.refresh();
              }
            }
          }));
        }));
        this._updateUpdatedFeaturesCount(totalComplete, total, errors);
        this._clearResults(false);

        //this._togglePanelLoadingIcon();
        this.loading.hide();
      }

    },
    _requestComplete: function (args) {
      var rowData;
      array.some(this.layersTable.getRows(), function (row) {
        rowData = this.layersTable.getRowData(row);

        if (rowData.ID === args.layerID) {
          this.layersTable.editRow(row, {
            'syncStatus': args.countSoFar + " / " + args.totalToSync
          });
          var cell = query('.syncStatus', row).shift();
          if (args.countSoFar === args.totalToSync) {
            html.removeClass(cell, 'syncProcessing');
            html.addClass(cell, 'syncComplete');
            html.removeClass(cell, 'syncSkipped');
          } else {
            html.removeClass(cell, 'syncComplete');
            html.addClass(cell, 'syncProcessing');
            html.removeClass(cell, 'syncSkipped');
          }
          return true;
        }
      }, this);

      //console.log(args.layerID + ": " + args.countSoFar + " / " + args.totalToSync);
    },
    _hideInfoWindow: function () {
      if (this.map.infoWindow.isShowing) {
        this.map.infoWindow.hide();
        this.map.infoWindow.highlight = false;
        this.map.graphics.clear();
      }
    },
    // Summarizes selected features' fields. If a field has more than one
    // value then helper layer gets a blank string in that field otherwise,
    // keep the same valued.
    // returns: nothing
    _summarizeFeatureFields: function (features) {
      var fields = this.helperEditFieldInfo;
      this._currentFeatureValues = [];
      array.forEach(fields, function (field) {
        if (field.visible) {
          var fieldName = field.fieldName;
          var different = false;
          var attValList = [];
          var first = features[0].attributes[fieldName];
          var fieldAlias = field.label;

          this._currentFeatureValues[fieldAlias] = [];
          this._currentFeatureValues[fieldAlias].type = field.typeOrigin;
          if (field.format) {
            this._currentFeatureValues[fieldAlias].format = field.format;
          }
          different = array.filter(features, function (feature) {
            return (feature.attributes[fieldName] !== first);
          }).length > 0;

          array.forEach(features, function (feature) {
            if (feature.attributes[fieldName] !== null) {
              attValList.push(feature.attributes[fieldName]);
            }
          });
          attValList.sort();
          var holder;
          var filteredArr = [];
          array.forEach(attValList, lang.hitch(this, function (item) {
            if (holder !== item) {
              holder = item;
              filteredArr.push(item);
            }
          }));

          if (different) {
            if (fieldName !== this.helperLayer.objectIdField) {
              //this.helperLayer.graphics[0].attributes[fieldName] = this.nls.editorPopupMultipleValues;
              this.helperLayer.graphics[0].attributes[fieldName] = "";

              this._currentFeatureValues[fieldAlias].values = filteredArr;

            } else {
              this.helperLayer.graphics[0].attributes[fieldName] = "";
              this._currentFeatureValues[fieldAlias].values = [first];
            }
          } else {
            this._currentFeatureValues[fieldAlias].values = [first];
            this.helperLayer.graphics[0].attributes[fieldName] = "";
          }
        }
      }, this);
    },
    _clearResultsEvent: function () {
      this._clearResults(true);
    },
    _clearResults: function (clearResultMessage) {
      if (clearResultMessage === null) {
        clearResultMessage = true;
      }
      array.forEach(this.updateLayers, function (layer) {
        layer.layerObject.clearSelection();
      }, this);
      array.forEach(this.clickList, function (evt) {
        evt.remove();
      });
      this.clickList = [];

      if (this.layersTable) {
        array.forEach(this.layersTable.getRows(), function (row) {

          this.layersTable.editRow(row, {
            'numSelected': "0"
          });

        }, this);
        array.forEach(this.layersTable.getRows(), function (row) {

          this.layersTable.editRow(row, {
            'syncStatus': ""
          });

        }, this);
        this._clearRowHighlight(clearResultMessage);
      }
      this._hideInfoWindow();
    },
    _updateUpdatedFeaturesCount: function (count, total, errors) {
      this.resultsMessage.innerHTML = string.substitute(this.nls.featuresUpdated, {
        0: count,
        1: total
      });
      if (errors) {
        if (errors > 0) {
          this.resultsMessage.innerHTML = this.resultsMessage.innerHTML +
            '<br/> <font color="red">' + this.nls.error + ": " + errors + "<font>";
        }
      }
      this.timer.stop();
      this.timer.start();
    },
    _updateSelectionCount: function (count) {
      this.resultsMessage.innerHTML = string.substitute(this.nls.featuresSelected, {
        0: count
      });
      this.timer.stop();
      this.timer.start();
    },
    _timerComplete: function () {
      if (this.resultsMessage !== null && this.resultsMessage !== undefined) {
        this.resultsMessage.innerHTML = "";
      }
      this.timer.stop();
    },

    _showFilter: function (pTR) {

      var rowData = this.layersTable.getRowData(pTR);
      var url;
      var definition;
      var workLayer;
      var defaultDef = '';
      var expression;
      array.forEach(this.updateLayers, lang.hitch(this, function (layer) {
        if (layer.id === rowData.ID) {
          workLayer = layer;
          definition = layer.resourceInfo;
          url = layer.url;
          if (workLayer.layerObject.getDefinitionExpression()) {
            defaultDef = workLayer.layerObject.getDefinitionExpression();
          }
        }
      }));
      if (this.expressionLayers.length > 0) {
        var exprExist = false;
        array.forEach(this.expressionLayers, lang.hitch(this, function (expLyr) {
          if (expLyr.id === rowData.ID) {
            expression = expLyr;
            exprExist = true;
          }
        }));
        if (exprExist === false) {
          this.expressionLayers.push({
            'id': rowData.ID,
            'expr': '',
            'defaultExp': workLayer.layerObject.getDefinitionExpression()
          });
          expression = this.expressionLayers[this.expressionLayers.length - 1];
        }
      } else {
        this.expressionLayers.push({
          'id': rowData.ID,
          'expr': '',
          'defaultExp': workLayer.layerObject.getDefinitionExpression()
        });
        expression = this.expressionLayers[0];
      }

      var filter = new Filter({
        noFilterTip: this.nls.noFilterTip,
        style: "width:100%;margin-top:22px;"
      });
      var filterPopup = new Popup({
        titleLabel: this.nls.filterPopup,
        width: 680,
        height: 485,
        content: filter,
        buttons: [{
          label: this.nls.ok,
          onClick: lang.hitch(this, function () {
            var partsObj = filter.toJson();
            if (partsObj && partsObj.expr) {
              if (partsObj.expr === '1=1') {
                if (expression.defaultExp) {
                  workLayer.layerObject.setDefinitionExpression(expression.defaultExp + ' AND (' + partsObj.expr + ')');
                } else {
                  workLayer.layerObject.setDefinitionExpression(partsObj.expr);
                }
              } else {
                if (expression.defaultExp) {
                  workLayer.layerObject.setDefinitionExpression(expression.defaultExp + ' AND (' + partsObj.expr + ')');
                } else {
                  workLayer.layerObject.setDefinitionExpression(partsObj.expr);
                }
              }
              var regEvent = on(workLayer.layerObject, "update-end", lang.hitch(this, function () {
                if (workLayer.layerObject.getSelectedFeatures().length > 0) {
                  this._clearResults(true);
                  lang.hitch(this, this._onDrawEnd(this.drawnGrph));
                  regEvent.remove();
                }
              }));
              expression.expr = partsObj;

              var labelCell = query('.label', pTR)[1];
              if (expression.expr.expr !== '1=1') {
                domClass.add(labelCell, 'filtered');
              } else {
                domClass.remove(labelCell, 'filtered');
              }

              filterPopup.close();
              filterPopup = null;
            } else {
              new Message({
                message: this.nls.setFilterTip
              });
            }
          })
        }, {
          label: this.nls.cancel,
          classNames: ['jimu-btn-vacation']
        }]
      });
      //var filterObj = workLayer.layerObject.getDefinitionExpression();
      if (expression.expr !== '') {
        filter.buildByFilterObj(url, expression.expr, definition);
      } else {
        filter.buildByExpr(url, null, definition);
      }

    },

    onOpen: function () {
      this._mapInfoStorage = {
        resetInfoWindow: null
      };
      this.disableWebMapPopup();
      if (this.dnd === undefined || this.dnd === null) {
        var handle = query(".title", this.map.infoWindow.domNode)[0];
        this.dnd = new Moveable(this.map.infoWindow.domNode, {
          handle: handle
        });
        // when the infoWindow is moved, hide the arrow:
        on(this.dnd, 'FirstMove', function () {
          // hide pointer and outerpointer (used depending on where the pointer is shown)
          var arrowNode = query(".outerPointer", this.map.infoWindow.domNode)[0];
          domClass.add(arrowNode, "hidden");

          arrowNode = query(".pointer", this.map.infoWindow.domNode)[0];
          domClass.add(arrowNode, "hidden");
        }.bind(this));
      } else {
        this.dnd.skip = false;
      }
      /*
       esri.bundle.toolbars.draw.addPoint = this.nls.drawBox.addPointToolTip;
       esri.bundle.toolbars.draw.addShape  = this.nls.drawBox.addShapeToolTip;
       esri.bundle.toolbars.draw.freehand  = this.nls.drawBox.freehandToolTip;
       esri.bundle.toolbars.draw.start  = this.nls.drawBox.startToolTip;
       */
      draw.addPoint = this.nls.drawBox.addPointToolTip;
      draw.addShape = this.nls.drawBox.addShapeToolTip;
      draw.freehand = this.nls.drawBox.freehandToolTip;
      draw.start = this.nls.drawBox.startToolTip;
      if (this.config.toggleLayersOnOpen === true) {
        array.forEach(this.updateLayers, function (layer) {
          layer.layerObject.setVisibility(true);
        });
      }
    },
    onClose: function () {
      if (this.dnd !== undefined && this.dnd !== null) {
        var arrowNode = query(".outerPointer", this.map.infoWindow.domNode)[0];
        domClass.remove(arrowNode, "hidden");

        arrowNode = query(".pointer", this.map.infoWindow.domNode)[0];
        domClass.remove(arrowNode, "hidden");
        this.dnd.destroy();
        this.dnd = null;

      }
      /*
       esri.bundle.toolbars.draw.addPoint =   this.existingText.addPoint;
       esri.bundle.toolbars.draw.addShape = this.existingText.addShape;
       esri.bundle.toolbars.draw.freehand = this.existingText.freehand;
       esri.bundle.toolbars.draw.start = this.existingText.start;
       */
      this._clearResults(true);
      if (typeof (this.existingText) !== 'undefined') {
        draw.addPoint = this.existingText.addPoint;
        draw.addShape = this.existingText.addShape;
        draw.freehand = this.existingText.freehand;
        draw.start = this.existingText.start;
      }
      this.enableWebMapPopup();
      if (this.config.toggleLayersOnOpen === true) {
        array.forEach(this.updateLayers, function (layer) {
          layer.layerObject.setVisibility(false);
        });
      }
      array.forEach(this.updateLayers, lang.hitch(this, function (layer) {
        array.forEach(this.expressionLayers, lang.hitch(this, function (expLyr) {
          if (expLyr.id === layer.id) {
            if (layer.layerObject.getDefinitionExpression() !== expLyr.defaultExp) {
              layer.layerObject.setDefinitionExpression(expLyr.defaultExp);
            }
          }
        }));
      }));
      this.expressionLayers = [];
      if (this.layersTable) {
        array.forEach(this.layersTable.getRows(), lang.hitch(this, function (row) {
          var labelCell = query('.label', row).shift();
          domClass.remove(labelCell, 'filtered');
        }));
      }

    },

    onDeActive: function () {
      this.enableWebMapPopup();
    },

    onActive: function () {
      this.disableWebMapPopup();
    },

    destroy: function () {
      array.forEach(this.clickList, function (evt) {
        evt.remove();
      });
      this._clearGraphics();

      if (this.drawBox) {
        this.drawBox.destroy();
      }
      if (this.attrInspector) {
        this.attrInspector.destroy();
      }
      this.clickList = null;
      this.layersTable = null;
      this.updateLayers = null;
      this.helperLayer = null;
      this.helperEditFieldInfo = null;
      this.attrInspector = null;
      this.toolType = null;
      this.selectByLayer = null;
      this.searchTextBox = null;
      this.mouseClickPos = null;
      this.selectQuery = null;
      this.expressionLayers = null;
      this.drawnGrph = null;
      this.timer = null;

      this.inherited(arguments);
    }
  });
});
