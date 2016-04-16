///////////////////////////////////////////////////////////////////////////
// Copyright 2014 Esri. All Rights Reserved.
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
    'dojo/query',
    'dojo/dom-construct',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/LayerInfos/LayerInfos',
    'dijit/form/Select',
    'dijit/form/ValidationTextBox',
    'dijit/form/CheckBox',
    'jimu/dijit/Popup',
    'jimu/dijit/SimpleTable',
    'jimu/utils',
    'esri/request',
    'esri/symbols/jsonUtils',
    'dijit/popup',
    'dojo/_base/lang',
    'dojo/DeferredList',
    'dojo/on',
    'dojox/gfx',
    'dojo/dom-style',
    'dojo/_base/html',
    'dojo/_base/array',
    './MySymbolPicker',
    'jimu/dijit/Message'
],
  function (
    query,
    domConstruct,
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    LayerInfos,
    Select,
    ValidationTextBox,
    CheckBox,
    Popup,
    Table,
    utils,
    esriRequest,
    jsonUtils,
    dijitPopup,
    lang,
    DeferredList,
    on,
    gfx,
    domStyle,
    html,
    array,
    SymbolPicker,
    Message
    ) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-InfoSummary-setting',
      _layerInfos: null,
      mpi: null,
      layer_options: [],
      refreshLayers: [],
      displayPanelIcon: false,

      postCreate: function () {
        this.inherited(arguments);
        this.setupLayerTable();
        this.setupRefreshInterval();
        this._getAllLayers();
        this.own(on(this.btnAddLayer, 'click', lang.hitch(this, this._addLayerRow)));
        this.own(on(this.panelIconOptions, 'change', lang.hitch(this, function () {
          var previewContainer;
          if (this.panelIconOptions.checked) {
            this.displayPanelIcon = true;
            previewContainer = query('.mainPanelPreviewContainerOff', this.mainPanelPreviewContainer.domNode)[0];
            html.removeClass(previewContainer, "mainPanelPreviewContainerOff");
            html.addClass(previewContainer, "mainPanelPreviewContainerOn");
          } else {
            this.displayPanelIcon = false;
            previewContainer = query('.mainPanelPreviewContainerOn', this.mainPanelPreviewContainer.domNode)[0];
            html.removeClass(previewContainer, "mainPanelPreviewContainerOn");
            html.addClass(previewContainer, "mainPanelPreviewContainerOff");
          }
        })));
      },

      startup: function () {
        this.inherited(arguments);
        this.refreshLayers = [];
      },

      setupRefreshInterval: function () {
        this.refreshInterval.invalidMessage = this.nls.invalidInterval;
        this.refreshInterval.missingMessage = this.nls.missingRefreshValue;
      },

      setupLayerTable: function () {
        var fields = [{
          name: "layer",
          title: this.nls.layerName,
          "class": "label",
          type: "empty",
          width: "100px"
        }, {
          name: "label",
          title: this.nls.layerLabel,
          "class": "label",
          type: "empty",
          width: "80px"
        }, {
          name: "upload",
          title: this.nls.iconColumnText,
          "class": "actions",
          type: "actions",
          actions: ["edit"],
          width: "20px"
        }, {
          name: "image",
          title: "",
          width: "20px",
          type: "empty",
          hidden: false,
          "class": "imageTest"
        }, {
          name: "refresh",
          title: this.nls.layerRefresh,
          type: "empty",
          width: "40px"
        }, {
          name: "actions",
          title: this.nls.actions,
          "class": "actions actions2",
          type: "actions",
          actions: ["up", "down", "delete"],
          width: "45px"
        }];

        this.displayLayerTable = new Table({
          fields: fields,
          selectable: false,
          autoHeight: true
        });

        this.displayLayerTable.placeAt(this.layerTable);
        this.displayLayerTable.startup();
        this.own(on(this.displayLayerTable, 'actions-edit', lang.hitch(this, this._pickSymbol)));
      },

      _getAllLayers: function () {
        if (this.map.itemId) {
          LayerInfos.getInstance(this.map, this.map.itemInfo)
            .then(lang.hitch(this, function (operLayerInfos) {
              this.opLayers = operLayerInfos;
              this._setLayers();
              this.setConfig(this.config);
            }));
        }
      },

      _getInfoTemplate: function (originOpLayer) {
        var infoTemplate;
        if (originOpLayer) {
          if (originOpLayer.parentLayerInfo) {
            if (originOpLayer.parentLayerInfo.controlPopupInfo) {
              var infoTemplates = originOpLayer.parentLayerInfo.controlPopupInfo.infoTemplates;
              if (infoTemplates) {
                var url = originOpLayer.url;
                if (!url && originOpLayer.layerObject) {
                  url = originOpLayer.layerObject.url;
                }
                if (url) {
                  var subLayerId = url.split("/").pop();
                  if (subLayerId) {
                    if (infoTemplates.indexOf) {
                      if (infoTemplates.indexOf(subLayerId) > -1) {
                        infoTemplate = infoTemplates[subLayerId].infoTemplate;
                      }
                    } else if (infoTemplates.hasOwnProperty(subLayerId)) {
                      infoTemplate = infoTemplates[subLayerId].infoTemplate;
                    }
                  }
                }
              }
            }
          }
        }
        return infoTemplate;
      },

      _setLayers: function () {
        var options = [];
        for (var i = 0; i < this.opLayers._layerInfos.length; i++) {
          var supportsDL = true;
          var OpLyr = this.opLayers._layerInfos[i];
          var originOpLayer;

          if (OpLyr.originOperLayer) {
            originOpLayer = OpLyr.originOperLayer;
          }

          if (OpLyr.newSubLayers.length > 0) {
            var hasNested = this.checkNestedGroups(OpLyr.newSubLayers);
            if (!hasNested) {
              this._recurseOpLayers(OpLyr.newSubLayers, options);
            } else {
              new Message({
                message: this.nls.layer_type_not_supported + OpLyr.title
              });
            }
          } else if (OpLyr.featureCollection) {
            if (OpLyr.layers.length > 1) {
              this._recurseOpLayers(OpLyr.layers, options);
            }
          } else if (originOpLayer) {
            if (originOpLayer.featureCollection) {
              if (originOpLayer.featureCollection.layers.length > 1) {
                this._recurseOpLayers(originOpLayer.featureCollection.layers, options);
              } else {
                options.unshift({
                  label: OpLyr.title,
                  value: OpLyr.title,
                  url: undefined,
                  imageData: OpLyr.imageData,
                  id: OpLyr.id,
                  geometryType: originOpLayer.featureCollection.layers[0].layerObject.geometryType,
                  type: OpLyr.type,
                  renderer: originOpLayer.featureCollection.layers[0].layerObject.renderer,
                  itemId: originOpLayer.itemId,
                  infoTemplate: originOpLayer ? this._getInfoTemplate(originOpLayer) : undefined,
                  lyrType: "Feature Collection",
                  panelImageData: OpLyr.panelImageData
                });
              }
            } else {
              if (typeof (OpLyr.layerObject.geometryType) === 'undefined') {
                this.setGeometryType(OpLyr.layerObject);
              }

              if (OpLyr && OpLyr.resourceInfo) {
                supportsDL = OpLyr.resourceInfo.supportsDynamicLayers;
              }

              options.unshift({
                label: OpLyr.title,
                value: OpLyr.title,
                url: OpLyr.layerObject.url,
                imageData: OpLyr.imageData,
                id: OpLyr.id,
                type: OpLyr.type,
                renderer: OpLyr.layerObject.renderer,
                geometryType: OpLyr.layerObject.geometryType,
                infoTemplate: originOpLayer ? this._getInfoTemplate(originOpLayer) : undefined,
                lyrType: "Map Service Layer",
                panelImageData: OpLyr.panelImageData,
                supportsDynamic: supportsDL
              });
            }
          } else {
            if (typeof (OpLyr.layerObject.geometryType) === 'undefined') {
              this.setGeometryType(OpLyr.layerObject);
            }

            if (OpLyr && OpLyr.resourceInfo) {
              supportsDL = OpLyr.resourceInfo.supportsDynamicLayers;
            }

            options.unshift({
              label: OpLyr.title,
              value: OpLyr.title,
              url: OpLyr.layerObject.url,
              imageData: OpLyr.imageData,
              id: OpLyr.id,
              type: OpLyr.type,
              renderer: OpLyr.layerObject.renderer,
              geometryType: OpLyr.layerObject.geometryType,
              lyrType: "",
              infoTemplate: originOpLayer ? this._getInfoTemplate(originOpLayer) : undefined,
              panelImageData: OpLyr.panelImageData,
              supportsDynamic: supportsDL
            });
          }
        }
        this.layer_options = lang.clone(options);
      },

      checkNestedGroups: function (group) {
        for (var i = 0; i < group.length; i++) {
          if (group[i].newSubLayers && group[i].newSubLayers.length > 0) {
            return true;
          }
        }
        return false;
      },

      setConfig: function (config) {
        this.config = config;

        if (this.config.mainPanelText) {
          this.mainPanelText.set('value', this.config.mainPanelText);
        }
        if (this.config.mainPanelIcon) {
          this.panelMainIcon.innerHTML = this.config.mainPanelIcon;
        }

        if (this.config.refreshInterval) {
          this.refreshInterval.set('value', this.config.refreshInterval);
        }

        if (this.config.loadStaticData) {
          this.chkStatic.set('value', this.config.loadStaticData);
        }

        if (this.config.displayPanelIcon) {
          this.panelIconOptions.set('checked', this.config.displayPanelIcon);
        }

        this.displayLayerTable.clear();
        this.isInitalLoad = true;
        this.layerLoadCount = 0;
        for (var i = 0; i < this.config.layerInfos.length; i++) {
          var lyrInfo = this.config.layerInfos[i];
          this._populateLayerRow(lyrInfo);
          this.layerLoadCount += 1;
        }
      },

      _addLayerRow: function () {
        this.isInitalLoad = false;
        var result = this.displayLayerTable.addRow({});
        if (result.success && result.tr) {
          var tr = result.tr;
          this._addLayersOption(tr);
          this._addLabelOption(tr);
          this._addRefreshOption(tr);
          this._addDefaultSymbol(tr);
        }
      },

      _populateLayerRow: function (lyrInfo) {
        var result = this.displayLayerTable.addRow({});
        if (result.success && result.tr) {
          var tr = result.tr;
          this._addLayersOption(tr);
          this._addLabelOption(tr);
          this._addRefreshOption(tr);
          tr.selectLayers.set("value", lyrInfo.layer);
          tr.labelText.set("value", lyrInfo.label);
          tr.refreshBox.set("checked", lyrInfo.refresh);
          tr.imageData = lyrInfo.panelImageData;

          domConstruct.create("div", {
            'class': "imageDataGFX",
            innerHTML: [lyrInfo.imageData],
            title: this.nls.iconColumnText
          }, tr.cells[3]);

          var cLo = this._getLayerOptionByValue(lyrInfo.layer);
          cLo.filter = lyrInfo.filter;
          cLo.imageData = lyrInfo.imageData;
          cLo.symbolData = lyrInfo.symbolData;
        }
      },

      _addLayersOption: function (tr) {
        var lyrOptions = lang.clone(this.layer_options);
        var td = query('.simple-table-cell', tr)[0];
        if (td) {
          html.setStyle(td, "verticalAlign", "middle");
          var tabLayers = new Select({
            style: {
              width: "100%",
              height: "28px"
            },
            options: lyrOptions
          });
          tabLayers.placeAt(td);
          tabLayers.startup();
          tr.selectLayers = tabLayers;
          this.own(on(tabLayers, 'change', lang.hitch(this, function () {
            this._updateRefresh(tr);

            if (!this.isInitalLoad) {
              this._addDefaultSymbol(tr);
            }

            this.layerLoadCount -= 1;
            if (this.layerLoadCount === 1) {
              this.isInitalLoad = false;
            }
          })));
        }
      },

      _addLabelOption: function (tr) {
        var td = query('.simple-table-cell', tr)[1];
        html.setStyle(td, "verticalAlign", "middle");
        var labelTextBox = new ValidationTextBox({
          style: {
            width: "100%",
            height: "28px"
          }
        });
        labelTextBox.placeAt(td);
        labelTextBox.startup();
        tr.labelText = labelTextBox;
      },

      _addRefreshOption: function (tr) {
        var td = query('.simple-table-cell', tr)[4];
        html.setStyle(td, "verticalAlign", "middle");
        this.currentTR = tr;
        var refreshCheckBox = new CheckBox({
          onChange: lang.hitch(this, function (v) {
            var value = this.currentTR.selectLayers.value;

            var rO;
            if (v) {
              //var lyrInfo = this._getLayerOptionByValue(value);
              this.refreshLayers.push(value);
              rO = query('.refreshOff', this.refreshOptions.domNode)[0];
              if (rO) {
                html.removeClass(rO, 'refreshOff');
                html.addClass(rO, 'refreshOn');
              }
              if (!this.refreshInterval.isValid()) {
                this._disableOk();
              }
            } else {
              var i = this.refreshLayers.indexOf(value);
              if (i > -1) {
                this.refreshLayers.splice(i, 1);
                if (this.refreshLayers.length === 0) {
                  rO = query('.refreshOn', this.refreshOptions.domNode)[0];
                  if (rO) {
                    html.removeClass(rO, 'refreshOn');
                    html.addClass(rO, 'refreshOff');
                  }
                  this._enableOk();
                }
              }
            }
          })
        });

        this._updateRefresh(tr, refreshCheckBox);

        refreshCheckBox.placeAt(td);
        refreshCheckBox.startup();
        tr.refreshBox = refreshCheckBox;
      },

      _updateRefresh: function (tr, refreshCheckBox) {
        var lInfo = this._getLayerOptionByValue(tr.selectLayers.value);

        if (!refreshCheckBox) {
          refreshCheckBox = tr.refreshBox;
        }

        if (lInfo.lyrType === 'Feature Collection') {
          refreshCheckBox.set('disabled', false);
          refreshCheckBox.set('title', this.nls.enableRefresh);
        } else {
          refreshCheckBox.set('disabled', true);
          refreshCheckBox.set('title', this.nls.disableRefresh);
        }
      },

      _updateOK: function () {
        if (this.refreshInterval.isValid()) {
          this._enableOk();
        } else {
          this._disableOk();
        }
      },

      _disableOk: function () {
        var s = query(".button-container")[0];
        var s2 = s.children[2];
        var s3 = s.children[3];
        domStyle.set(s2, "display", "none");
        domStyle.set(s3, "display", "inline-block");
      },

      _enableOk: function () {
        var s = query(".button-container")[0];
        var s2 = s.children[2];
        var s3 = s.children[3];
        domStyle.set(s2, "display", "inline-block");
        domStyle.set(s3, "display", "none");
      },

      _addDefaultSymbol: function (tr) {
        var td = query('.simple-table-cell', tr)[0];
        this.curRow = tr;
        if (td) {
          var lo = this._getLayerOptionByValue(td.children[0].textContent);
          var selectLayersValue = tr.selectLayers.value;

          var hasSymbolData = false;
          var sd;
          if (typeof (this.curRow.symbolData) !== 'undefined') {
            sd = this.curRow.symbolData;
            hasSymbolData = sd.userDefinedSymbol && (sd.layerId === selectLayersValue);
          }
          if (!hasSymbolData || typeof (lo.symbolData) === 'undefined') {
            var options = {
              nls: this.nls,
              callerRow: tr,
              layerInfo: lo,
              value: selectLayersValue,
              symbolInfo: hasSymbolData ? this.curRow.symbolData : lo.symbolData,
              map: this.map,
              ac: this.appConfig
            };
            var sourceDijit = new SymbolPicker(options);
            sourceDijit._setSymbol();

            this.curRow.cells[3].innerHTML = "<div></div>";
            this.curRow.symbolData = sourceDijit.symbolInfo;

            this._createImageDataDiv(this.curRow.symbolData.icon, 28, 28, true);
            this.curRow.imageData = this._createImageDataDiv(this.curRow.symbolData.icon, 45, 45, false).innerHTML;

            this.curRow = null;
            sourceDijit.destroy();
            sourceDijit = null;
          } else {
            this.curRow.cells[3].innerHTML = "<div></div>";
            this.curRow.symbolData = lo.symbolData;

            this._createImageDataDiv(this.curRow.symbolData.icon, 28, 28, true);
            this.curRow.imageData = this._createImageDataDiv(this.curRow.symbolData.icon, 45, 45, false).innerHTML;
          }
        }
      },

      _getLayerOptionByValue: function (value) {
        for (var i = 0; i < this.layer_options.length; i++) {
          var lo = this.layer_options[i];
          if (lo.value === value) {
            return lo;
          }
        }
      },

      _recurseOpLayers: function (pNode, pOptions) {
        var nodeGrp = pNode;
        array.forEach(nodeGrp, lang.hitch(this, function (Node) {
          var infoTemplate;
          if (Node.newSubLayers.length > 0) {
            this._recurseOpLayers(Node.newSubLayers, pOptions);
          } else if (Node.featureCollection) {
            if (Node.layers.length > 1) {
              this._recurseOpLayers(Node.layers, pOptions);
            }
          } else {
            if (typeof (Node.layerObject) !== 'undefined') {
              if (typeof (Node.layerObject.geometryType) === 'undefined') {
                this.setGeometryType(Node.layerObject);
              }
            }
            var OpLyr2;
            if (Node.hasOwnProperty("parentLayerInfo")) {
              if (Node.parentLayerInfo.hasOwnProperty("originOperLayer")) {
                OpLyr2 = Node.parentLayerInfo.originOperLayer;
                infoTemplate = this._getInfoTemplate(OpLyr2);
              }
            }

            if (Node.originOperLayer) {
              infoTemplate = this._getInfoTemplate(Node.originOperLayer);
            }

            var u;
            var subLayerId;
            if (Node.layerObject) {
              if (Node.layerObject.url) {
                u = Node.layerObject.url;
                subLayerId = parseInt(u.substr(u.lastIndexOf('/') + 1), 10);
              }
            }

            var supportsDL = true;
            if(OpLyr2 && OpLyr2.resourceInfo){
              supportsDL = OpLyr2.resourceInfo.supportsDynamicLayers;
            }

            pOptions.push({
              label: Node.title,
              value: Node.title,
              url: u,
              imageData: Node.imageData,
              id: Node.id,
              parentLayerID: OpLyr2 ? OpLyr2.id : undefined,
              type: Node.type,
              itemId: OpLyr2 ? OpLyr2.itemId : undefined,
              renderer: Node.layerObject.renderer,
              geometryType: Node.layerObject.geometryType,
              subLayerId: subLayerId,
              infoTemplate: infoTemplate,
              lyrType: OpLyr2 ? OpLyr2.type : undefined,
              supportsDynamic: supportsDL
            });
          }
        }));
      },

      _pickSymbol: function (tr) {
        var selectLayersValue = tr.selectLayers.value;
        var lo = this._getLayerOptionByValue(selectLayersValue);
        this.curRow = tr;

        var options = {
          nls: this.nls,
          callerRow: tr,
          layerInfo: lo,
          value: selectLayersValue,
          symbolInfo: typeof (this.curRow.symbolData) !== 'undefined' ? this.curRow.symbolData : lo.symbolData,
          map: this.map,
          ac: this.appConfig
        };
        var sourceDijit = new SymbolPicker(options);

        var popup = new Popup({
          width: 330,
          autoHeight: true,
          content: sourceDijit,
          titleLabel: this.nls.sympolPopupTitle
        });

        this.own(on(sourceDijit, 'ok', lang.hitch(this, function (data) {
          this.curRow.cells[3].innerHTML = "<div></div>";
          this.curRow.symbolData = data;

          this._createImageDataDiv(data.icon, 28, 28, true);
          this.curRow.imageData = this._createImageDataDiv(data.icon, 45, 45, false).innerHTML;

          this.curRow = null;
          sourceDijit.destroy();
          sourceDijit = null;
          popup.close();
        })));

        this.own(on(sourceDijit, 'cancel', lang.hitch(this, function () {
          this.curRow = null;
          sourceDijit.destroy();
          sourceDijit = null;
          popup.close();
        })));
      },

      _createImageDataDiv: function (sym, w, h, add) {
        var a;
        if (typeof (sym) === "string") {
          if (add) {
            a = domConstruct.create("div", { 'class': "imageDataGFX", 'innerHTML': sym }, this.curRow.cells[3]);
          } else {
            a = domConstruct.create("div", { 'class': "imageDataGFX", 'innerHTML': sym });
          }
        } else {
          var symbol = jsonUtils.fromJson(sym);
          if (!symbol) {
            symbol = sym;
          }

          if (symbol) {
            var height = w;
            var width = h;
            if (symbol.height && symbol.width) {
              var ar;
              if (symbol.height > symbol.width) {
                ar = symbol.width / symbol.height;
                width = w * ar;
              } else if (symbol.width === symbol.height || symbol.width > symbol.height) {
                width = w - 10;
                ar = symbol.width / symbol.height;
                height = (ar > 0) ? h - 10 * ar : h - 10;
              }
            }
            if (typeof (symbol.setWidth) !== 'undefined') {
              if (typeof (symbol.setHeight) !== 'undefined') {
                symbol.setWidth(width);
                symbol.setHeight(height);
              } else {
                symbol.setWidth(2);
              }
            } else if (typeof (symbol.size) !== 'undefined') {
              if (symbol.size > 20) {
                symbol.setSize(20);
              }
            }

            if (add) {
              a = domConstruct.create("div", { 'class': "imageDataGFX" }, this.curRow.cells[3]);
            } else {
              a = domConstruct.create("div", { 'class': "imageDataGFX" });
            }
            var mySurface = gfx.createSurface(a, width, height);
            var descriptors = jsonUtils.getShapeDescriptors(symbol);
            var shape = mySurface.createShape(descriptors.defaultShape)
                          .setFill(descriptors.fill)
                          .setStroke(descriptors.stroke);
            shape.applyTransform({ dx: width / 2, dy: height / 2 });
          } else if (typeof (sym.url) !== 'undefined') {
            a = domConstruct.create("div", { 'class': "imageDataGFX" }, this.curRow.cells[3]);
            domStyle.set(a, "background-image", "url(" + sym.url + ")");
            domStyle.set(a, "background-repeat", "no-repeat");
          }
        }
        return a;
      },

      setGeometryType: function (OpLayer) {
        var queries = [];
        if (typeof (OpLayer.url) !== 'undefined') {
          if (OpLayer.url.indexOf("MapServer")) {
            queries.push(esriRequest({ "url": OpLayer.url + "?f=json" }));
          }
        }

        if (queries.length > 0) {
          var queryList = new DeferredList(queries);
          queryList.then(lang.hitch(this, function (queryResults) {
            if (queryResults) {
              if (queryResults.length > 0) {
                var resultInfo = queryResults[0][1];
                var lIdx;
                for (var i = 0; i < this.layer_options.length; i++) {
                  if (this.layer_options[i].value === resultInfo.name) {
                    lIdx = i;
                    break;
                  }
                }

                this.layer_options[lIdx].geometryType = resultInfo.geometryType;
                if (typeof (resultInfo.drawingInfo) !== 'undefined') {
                  this.layer_options[lIdx].renderer = resultInfo.drawingInfo.renderer;
                  this.layer_options[lIdx].drawingInfo = resultInfo.drawingInfo;

                  //Also need the OID field and fields
                  this.layer_options[lIdx].fields = resultInfo.fields;

                  var f;
                  for (var ii = 0; ii < resultInfo.fields.length; ii++) {
                    f = resultInfo.fields[ii];
                    if (f.type === "esriFieldTypeOID") {
                      break;
                    }
                  }
                  this.layer_options[lIdx].oidFieldName = f;
                }
              }
            }
          }));
        }
      },

      uploadImage: function () {
        var reader = new FileReader();
        reader.onload = lang.hitch(this, function () {
          this.panelMainIcon.innerHTML = "<div></div>";
          this.mpi = reader.result;
          domConstruct.create("div", {
            innerHTML: ['<img class="innerMainPanelIcon" src="', reader.result,
                        '" title="', this.nls.mainPanelIcon, '"/>'].join('')
          }, this.panelMainIcon);
        });

        this.fileInput.onchange = lang.hitch(this, function () {
          var f = this.fileInput.files[0];
          reader.readAsDataURL(f);
        });

        this.fileInput.click();
      },

      getConfig: function () {
        dijitPopup.close();

        var rows = this.displayLayerTable.getRows();
        var table = [];
        var lInfo;
        array.forEach(rows, lang.hitch(this, function (tr) {
          var selectLayersValue = tr.selectLayers.value;

          var labelTextValue = utils.sanitizeHTML(tr.labelText.value);
          var refreshBox = tr.refreshBox;
          var lo = this._getLayerOptionByValue(selectLayersValue);
          var symbolData = tr.symbolData ? tr.symbolData : lo.symbolData;

          lInfo = {
            layer: selectLayersValue,
            label: labelTextValue !== "" ? labelTextValue : selectLayersValue,
            refresh: refreshBox.checked,
            url: lo.url,
            type: lo.type,
            id: lo.id,
            symbolData: symbolData,
            geometryType: lo.geometryType,
            itemId: lo.itemId,
            parentLayerID: lo.parentLayerID,
            renderer: lo.renderer,
            drawingInfo: lo.drawingInfo,
            fields: lo.fields,
            oidFieldName: lo.oidFieldName,
            subLayerId: lo.subLayerId,
            infoTemplate: lo.infoTemplate
          };

          if (tr.imageData) {
            lInfo.panelImageData = tr.imageData;
          }

          var td = query('.imageDataGFX', tr)[0];
          lInfo.imageData = typeof (td) !== 'undefined' ? td.innerHTML : "<div></div>";
          table.push(lInfo);
        }));

        this.config.layerInfos = table;
        this.config.mainPanelText = utils.sanitizeHTML(this.mainPanelText.value);
        this.config.mainPanelIcon = this.panelMainIcon.innerHTML;
        this.config.refreshInterval = utils.sanitizeHTML(this.refreshInterval.value);
        this.config.refreshEnabled = this.refreshLayers.length > 0 ? true : false;
        this.config.displayPanelIcon = this.displayPanelIcon;

        return this.config;
      },

      destroy: function () {
        dijitPopup.close();
        this.inherited(arguments);
      }
    });
  });
