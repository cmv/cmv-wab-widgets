///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
  'dojo/_base/lang',
  'dojo/Evented',
  'jimu/BaseWidget',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dijit/TooltipDialog',
  'jimu/dijit/formSelect',
  'dojo/dom-construct',
  'dijit/popup',
  'jimu/dijit/Message',
  'jimu/CSVUtils',
  './extractDataTask',
  './createReplica',
  'dojo/dom-class',
  'jimu/utils',
  'dijit/focus',
  'dojo/keys',
  "dojo/_base/event"
], function (
  declare,
  lang,
  Evented,
  BaseWidget,
  html,
  array,
  on,
  TooltipDialog,
  Select,
  domConstruct,
  dijitPopup,
  Message,
  CSVUtils,
  ExtractDataTask,
  CreateReplica,
  domClass,
  jimuUtils,
  focusUtil,
  keys,
  Event
) {
  return declare([BaseWidget, Evented], {
    // Set base class for custom impactSummaryReport widget
    baseClass: 'jimu-widget-screening',

    _popup: null,
    //Object that holds all the options and their keys for plan settings
    downloadOptions: [],
    isTooltipDialogOpened: false,
    downLoadStatus: {},

    constructor: function (options) {
      this._popup = null;
      this.downloadOptions = [];
      this.isTooltipDialogOpened = false;
      this.downLoadStatus = {};
      lang.mixin(this, options);
    },

    startup: function () {
      this._popup = new TooltipDialog({
        "class": "esriCTDownloadSettingsDialog " + this.baseClass,
        "style": {
          "width": "300px"
        }
      });
      // add additional class for dart theme to match the dart theme in popup
      if (this.appConfig.theme.name === "DartTheme") {
        domClass.add(this._popup.domNode, "dart-panel");
      }
      this._popup.startup();
      // Hide tooltip dialog clicked anywhere in the body
      this.own(on(document.body, 'click', lang.hitch(this, function (
        event) {
        var target = event.target || event.srcElement;
        if (!this.isPartOfPopup(target)) {
          this.closePopup();
        }
      })));
      // Hide tooltip dialog on window resize
      this.own(on(window, 'resize', lang.hitch(this, function () {
        this.closePopup();
      })));
      this._createSettingsDialog();
    },

    /**
     * Check if configured file type has features to download
     * @memberOf Screening/download/download
     */
    checkFileForDownload: function () {
      var isCSVAvailable, isShapeFileAvailable, isFileGDBAvailable, downloadLayersArr;
      isCSVAvailable = isShapeFileAvailable = isFileGDBAvailable = false;
      if (this.config.downloadSettings.type === "extractDataTask") {
        isCSVAvailable = isShapeFileAvailable = isFileGDBAvailable = true;
      }
      // filter to check file for download to layers which are active on map
      downloadLayersArr = this._getFilteredDownloadLayers();
      array.forEach(downloadLayersArr, lang.hitch(this,
        function (currentLayer) {
          //Check if allowDownload is set to true and layer has
          //at least one intersecting feature
          if (currentLayer.allowDownload &&
            this.downloadFeatureDetailsObj[currentLayer.id] &&
            this.downloadFeatureDetailsObj[currentLayer.id].length > 0) {
            if (currentLayer.downloadingFileOption.indexOf("csv") >= 0) {
              isCSVAvailable = true;
            }
            if (currentLayer.downloadingFileOption.indexOf("shapefile") >= 0) {
              isShapeFileAvailable = true;
            }
            if (currentLayer.downloadingFileOption.indexOf("filegdb") >= 0) {
              isFileGDBAvailable = true;
            }
          }
        }));
      //Add calculated boolean values to object
      this.downLoadStatus = {
        isCSVAvailable: isCSVAvailable,
        isShapeFileAvailable: isShapeFileAvailable,
        isFileGDBAvailable: isFileGDBAvailable
      };
    },

    /**
     * Create tooltip dialog for download report options
     * @memberOf Screening/download/download
     */
    _createSettingsDialog: function () {
      var downloadSettingsContainer, downloadFormatLabel, downloadBtn;
      //Create container for  plan settings
      downloadSettingsContainer =
        domConstruct.create("div", {
          "class": "esriCTDownloadSettingsContainer"
        }, null);
      //Direction settings dropdown
      downloadFormatLabel =
        domConstruct.create("div", {
          "class": "esriCTEllipsis esriCTDownloadSettingLabel",
          innerHTML: this.nls.reportsTab.downloadLabelText
        }, downloadSettingsContainer);
      this.downloadFormatSelect = new Select({
        'aria-label': this.nls.reportsTab.downloadLabelText
      });
      this.own(on(this.downloadFormatSelect, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ESCAPE) {
          Event.stop(evt);
          this.closePopup();
          this.emit("setFocusOnDownloadReportButton");
        }
      })));
      // fetch download format options the options
      this._getOptionsFordownloadFormat();
      this.downloadFormatSelect.placeAt(downloadSettingsContainer);
      //Create button
      downloadBtn =
        domConstruct.create("button", {
          "innerHTML": this.nls.reportsTab.downloadBtnText,
          "class": "esriCTEllipsis jimu-btn esriCTDownloadSettingsBtn",
          'tabindex': 0,
          "aria-label": this.nls.reportsTab.downloadBtnText,
          "role": "button"
        },
          domConstruct.create("div", {
            "class": "esriCTDownloadSettingsBtnContainer"
          }, downloadSettingsContainer)
        );
      this.own(on(downloadBtn, "click", lang.hitch(this, function (evt) {
        Event.stop(evt);
        this.closePopup();
        this.emit("setFocusOnDownloadReportButton");
        //If app is running in android device,show confirm dialog for downloading the report
        if (this.isAndroidDevice) {
          this._startDownload();
        } else {
          this._chooseFileTypeToDownload();
        }
      })));
      this.own(on(downloadBtn, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this.closePopup();
          this.emit("setFocusOnDownloadReportButton");
          //If app is running in android device,show confirm dialog for downloading the report
          if (this.isAndroidDevice) {
            this._startDownload();
          } else {
            this._chooseFileTypeToDownload();
          }
        }
        if (evt.keyCode === keys.ESCAPE) {
          Event.stop(evt);
          this.closePopup();
          this.emit("setFocusOnDownloadReportButton");
        }
      })));
      this._popup.setContent(downloadSettingsContainer);
    },

    /**
     * Add options to passed dropdown
     * @memberOf Screening/download/download
     */
    _loadOptionsForDropDown: function (dropDown, downloadOptionsArray) {
      var options = [],
        option;
      //Add options for selected dropdown
      array.forEach(downloadOptionsArray,
        lang.hitch(this, function (type) {
          option = {
            value: type,
            label: this.nls.reportsTab[type]
          };
          options.push(option);
        }));
      dropDown.addOption(options);
    },

    /**
     * get options for passed dropdown
     * @memberOf Screening/download/download
     */
    _getOptionsFordownloadFormat: function () {
      var allLayersDownloadOptions;
      if (this.config.downloadSettings.type === "extractDataTask") {
        allLayersDownloadOptions = ["csv", "filegdb", "shapefile"];
      } else {
        var downloadLayersArr;
        downloadLayersArr = [];
        allLayersDownloadOptions = ["csv"];
        // filter to apply csv download for layers which are active on map
        downloadLayersArr = this._getFilteredDownloadLayers();
        array.forEach(downloadLayersArr,
          lang.hitch(this, function (layerItem) {
            var downloadOptionsArray;
            downloadOptionsArray = ["csv"];
            if (layerItem.allowDownload) {
              var layerCapabilities, layerVersion;
              layerCapabilities = this.filterLayerObj[layerItem.id].capabilities;
              layerVersion = this.filterLayerObj[layerItem.id].version;
              if (layerCapabilities.split("Sync").length > 1 && layerVersion >= 10.4) {
                if (downloadOptionsArray.indexOf("filegdb") === -1) {
                  downloadOptionsArray.push("filegdb");
                }
                if (allLayersDownloadOptions.indexOf("filegdb") === -1) {
                  allLayersDownloadOptions.push("filegdb");
                }
                // Check wether the layer is AGOL hosted or not
                var isHostedLayer = jimuUtils.isHostedService(layerItem.url);
                if (isHostedLayer) {
                  if (downloadOptionsArray.indexOf("shapefile") === -1) {
                    downloadOptionsArray.push("shapefile");
                  }
                  if (allLayersDownloadOptions.indexOf("shapefile") === -1) {
                    allLayersDownloadOptions.push("shapefile");
                  }
                }
              }
              layerItem.downloadingFileOption = downloadOptionsArray;
            }
          }));
      }
      this._loadOptionsForDropDown(this.downloadFormatSelect, allLayersDownloadOptions);
    },

    /**
     * open popup to allow parcel editing from map
     * @memberOf Screening/download/download
     */
    openPopup: function () {
      dijitPopup.open({
        popup: this._popup,
        x: this.position.pageX,
        y: this.position.pageY
      });
      this.isTooltipDialogOpened = true;
    },

    /**
     * get extent from the point geometry
     * Hide popup dialog
     * @memberOf Screening/download/download
     */
    closePopup: function () {
      if (this._popup) {
        dijitPopup.close(this._popup);
        this.isTooltipDialogOpened = false;
      }
    },

    /**
     * Check whether target node is part of the popup or not
     * @param{object} target : target node
     * @memberOf Screening/download/download
     */
    isPartOfPopup: function (target) {
      var node, isInternal;
      node = this._popup.domNode;
      isInternal = target === node || html.isDescendant(target,
        node);
      return isInternal;
    },

    /**
     *
     * Choose while file to be downloaded based on dropdown value
     * @memberOf Screening/download/download
     */
    _chooseFileTypeToDownload: function () {
      switch (this.downloadFormatSelect.get('value')) {
        case "csv":
          if (this.downLoadStatus.isCSVAvailable) {
            this._exportToCSV();
          } else {
            this.emit("showMessage", this.nls.reportsTab.noFeaturesFound);
          }
          break;
        case "filegdb":
          if (this.downLoadStatus.isFileGDBAvailable) {
            if (this.config.downloadSettings.type === "syncEnable") {
              this._exportFileUsingCreateReplica("filegdb");
            } else {
              if (this.config.downloadSettings.type === "extractDataTask" &&
                this.isPointOrLineAOI) {
                this.emit("showMessage", this.nls.reportsTab.unableToDownloadFileGDBText);
              } else {
                this._exportFileUsingExtractDataTask("filegdb");
              }
            }
          } else {
            this.emit("showMessage", this.nls.reportsTab.noFeaturesFound);
          }
          break;
        case "shapefile":
          if (this.downLoadStatus.isShapeFileAvailable) {
            if (this.config.downloadSettings.type === "syncEnable") {
              this._exportFileUsingCreateReplica("shapefile");
            } else {
              if (this.config.downloadSettings.type === "extractDataTask" &&
                this.isPointOrLineAOI) {
                this.emit("showMessage", this.nls.reportsTab.unableToDownloadShapefileText);
              } else {
                this._exportFileUsingExtractDataTask("shapefile");
              }
            }
          } else {
            this.emit("showMessage", this.nls.reportsTab.noFeaturesFound);
          }
          break;
        default:
          break;
      }
    },

    /**
     * Start the download process based on inputs
     * @memberOf Screening/download/download
     */
    _startDownload: function () {
      var popup = new Message({
        titleLabel: this.nls.reportsTab.downloadReportConfirmTitle,
        message: this.nls.reportsTab.downloadReportConfirmMessage,
        autoHeight: true,
        buttons: [{
          label: this.nls.common.yes,
          onClick: lang.hitch(this, function () {
            this._chooseFileTypeToDownload();
            popup.close();
          })
        }, {
          label: this.nls.common.no
        }]
      });
    },

    /**
     * Export the output to CSV
     * @memberOf Screening/download/download
     */
    _exportToCSV: function () {
      var layer, data, options = {},
        popupInfo, canDownload, downloadLayersArr = [];
      downloadLayersArr = this.config.downloadSettings.layers;
      //If new layer is added to analysis, then fetch them for CSV file download
      if (this.shapeFileLayerDetails) {
        downloadLayersArr = downloadLayersArr.concat(this.shapeFileLayerDetails);
      }
      // filter to apply csv download for layers which are active on map
      downloadLayersArr = this._getFilteredDownloadLayers();
      array.forEach(downloadLayersArr, lang.hitch(this,
        function (currentLayer) {
          options = {};
          canDownload = false;
          //If download type is extract data task, set canDownload flag to true
          if (this.config.downloadSettings.type === "extractDataTask") {
            canDownload = true;
          } else {
            canDownload = currentLayer.allowDownload;
          }
          //In case of shape file fetch layer info from layer object and proceed
          if (currentLayer.isShapeFile) {
            layer = currentLayer.layer;
            data = this._getLayerData(layer, this.downloadFeatureDetailsObj[currentLayer.id]);
          } else {
            layer = this.filterLayerObj[currentLayer.id];
            data = this._getLayerData(layer, this.downloadFeatureDetailsObj[currentLayer.id]);
          }
          data = dojo.mixin({}, data); // jshint ignore:line
          // function to remove analysis area / length (CSVMeasurementUnit)from data
          data = this._removeAnalysisUnitFromCSV(data);
          // function to add analysis (CSVMeasurementUnit)area / length to data
          this._addAnalysisDataToCSVData(data, currentLayer.id);
          popupInfo = this._getInfoTemplate(layer);
          if (data.graphicsArray.length > 0 && canDownload) {
            options.datas = data.graphicsArray;
            options.fromClient = false;
            options.withGeometry = layer.geometryType === 'esriGeometryPoint';
            options.outFields = data.outFields;
            options.formatNumber = false;
            options.formatDate = true;
            options.formatCodedValue = true;
            options.popupInfo = popupInfo;
            CSVUtils.exportCSVFromFeatureLayer(
              layer.name || "CSV_FILE",
              layer, options);
          }
        }));
    },

    /**
     * Function to get info from the info template of the layer
     * @memberOf Screening/download/download
     */
    _removeAnalysisUnitFromCSV: function (data) {
      var outFieldsArray;
      outFieldsArray = data.outFields;
      array.forEach(outFieldsArray, function (outFieldElement, index) {
        if (outFieldElement.name === "CSVMeasurementUnit") {
          outFieldsArray.splice(index, 1);
        }
      });
      return data;
    },

    /**
     * Function to get info from the info template of the layer
     * @memberOf Screening/download/download
     */
    _getInfoTemplate: function (layer) {
      var layerId, parentLayerId, layerInstance;
      if (layer.infoTemplate) {
        return layer.infoTemplate.info;
      } else {
        layerId = layer.id.split("_");
        if (layerId[layerId.length - 1] === layer.layerId.toString()) {
          layerId.pop();
          parentLayerId = layerId.join("_");
        }
        if (parentLayerId) {
          layerInstance = this.map.getLayer(parentLayerId);
        }
        if (layerInstance && layerInstance.infoTemplates &&
          layerInstance.infoTemplates.hasOwnProperty(layer.layerId)) {
          return layerInstance.infoTemplates[layer.layerId].infoTemplate.info;
        } else {
          return null;
        }
      }
    },

    /**
     * Fetch the layer data
     * @memberOf Screening/download/download
     */
    _getLayerData: function (layer, features) {
      var layerGraphics = [],
        pointLayerData;
      array.forEach(features, lang.hitch(this, function (graphic) {
        graphic.attributes.geometry = graphic.geometry;
        layerGraphics.push(graphic.attributes);
      }));
      //export geometry if shape type of layer is point
      if (layer.geometryType === 'esriGeometryPoint') {
        pointLayerData = this._formatPointLayerData(layerGraphics, layer);
        return {
          graphicsArray: pointLayerData.layerGraphics,
          outFields: pointLayerData._outFields
        };
      } else {
        return {
          graphicsArray: layerGraphics,
          outFields: layer.fields
        };
      }
    },

    /**
     * Format the point layer data to include x and y parameters
     * @memberOf Screening/download/download
     */
    _formatPointLayerData: function (layerGraphics, layer) {
      var data_set, _outFields, pointLayerData = {};
      data_set = lang.clone(layerGraphics);
      _outFields = layer.fields;
      array.forEach(data_set, function (d) {
        var geometry = d.geometry;
        if (geometry && geometry.type === 'point') {
          if ('x' in d) {
            d._x = geometry.x;
          } else {
            d.x = geometry.x;
          }

          if ('y' in d) {
            d._y = geometry.y;
          } else {
            d.y = geometry.y;
          }
        }

        delete d.geometry;
      });
      layerGraphics = data_set;
      _outFields = lang.clone(_outFields);
      var name = "";
      if (_outFields.indexOf('x') !== -1) {
        name = '_x';
      } else {
        name = 'x';
      }
      _outFields.push({
        'name': name,
        alias: name,
        format: {
          'digitSeparator': false,
          'places': 6
        },
        show: true,
        type: "esriFieldTypeDouble"
      });
      if (_outFields.indexOf('y') !== -1) {
        name = '_y';
      } else {
        name = 'y';
      }
      _outFields.push({
        'name': name,
        alias: name,
        format: {
          'digitSeparator': false,
          'places': 6
        },
        show: true,
        type: "esriFieldTypeDouble"
      });
      pointLayerData.layerGraphics = layerGraphics;
      pointLayerData._outFields = _outFields;
      return pointLayerData;
    },

    /**
     * export the file using extract data task
     * @memberOf Screening/download/download
     */
    _exportFileUsingExtractDataTask: function (fileFormat) {
      var extractDataTaskWidget;
      this.loadingIndicator.show();
      extractDataTaskWidget = new ExtractDataTask({
        map: this.map,
        aoi: this.aoi,
        fileFormat: fileFormat,
        url: this.config.downloadSettings.extractDataTaskURL
      });
      extractDataTaskWidget.startup();
      this.own(on(extractDataTaskWidget, "onGPTaskSuccess", lang.hitch(this, function (url) {
        this._downloadDataFile(url);
        this.loadingIndicator.hide();
      })));

      this.own(on(extractDataTaskWidget, "onGPTaskFailed", lang.hitch(this, function () {
        this.emit("showMessage", this.nls.reportsTab.extractDataTaskFailedMessage);
        this.loadingIndicator.hide();
      })));
    },

    /**
     * export the file using extract data task
     * @memberOf Screening/download/download
     */
    _exportFileUsingCreateReplica: function (fileFormat) {
      var createReplicaWidget;
      this.loadingIndicator.show();
      createReplicaWidget = new CreateReplica({
        map: this.map,
        config: this.config,
        aoi: this.aoi,
        fileFormat: fileFormat,
        filterLayerObj: this.filterLayerObj,
        nls: this.nls,
        downloadFeatureDetailsObj: this.downloadFeatureDetailsObj,
        loadingIndicator: this.loadingIndicator
      });
      this.own(on(createReplicaWidget, "onRequestSucceeded", lang.hitch(this, function (url) {
        this._downloadDataFile(url);
        this.loadingIndicator.hide();
      })));

      this.own(on(createReplicaWidget, "onRequestFailed", lang.hitch(this, function () {
        //Handle if gp task fails
        this.loadingIndicator.hide();
      })));

      this.own(on(createReplicaWidget, "createReplicaComplete",
        lang.hitch(this, function (errString) {
          if (errString) {
            this.emit("showMessage", errString);
          }
          this.loadingIndicator.hide();
        })));

      this.own(on(createReplicaWidget, "showErrMessage", lang.hitch(this, function (msg) {
        this.emit("showMessage", msg);
      })));
      createReplicaWidget.startup();
    },

    /**
     * download report format file
     * @param {url} outputFileUrl file url for download
     * @memberOf Screening/download/download
     */
    _downloadDataFile: function (outputFileUrl) {
      var iframe, timer, layerObj, parentLayerURL, layer, layerObjURL, parentLayerURLDetails;
      for (layer in this.filterLayerObj) {
        if (this.filterLayerObj.hasOwnProperty(layer)) {
          layerObj = this.filterLayerObj[layer];
          if (layerObj.credential && layerObj.credential.token) {
            parentLayerURL = outputFileUrl.split("replicafiles");
            layerObjURL = layerObj.url;
            parentLayerURLDetails = parentLayerURL[0].toLowerCase();
            parentLayerURLDetails = parentLayerURLDetails.replace(/(^\w+:|^)\/\//, '');
            if ((parentLayerURL.length > 0) &&
              (layerObjURL.toLowerCase().indexOf(parentLayerURLDetails.toLowerCase()) > -1)) {
              outputFileUrl = outputFileUrl + "?token=" + layerObj.credential.token;
              break;
            }
          }
        }
      }
      iframe = domConstruct.create('iframe', {
        "class": "esriCTHidden",
        "src": outputFileUrl
      }, this.iframeNode);
      //set timer to destroy the iframe once file is loaded
      //so as to avoid downloading again on window resize
      timer = setInterval(lang.hitch(this, function () {
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        // Check if loading is complete
        if (iframeDoc.readyState === 'complete' || iframeDoc.readyState === 'interactive') {
          domConstruct.destroy(iframe);
          clearInterval(timer);
          return;
        }
      }), 4000);
    },

    /**
     * To add area / length analysis data to CSV download
     * @param{CSVData} CSVData data sent for CSV download
     * @param{currentLayerId} current layer Id
     * @memberOf Screening/download/download
     */
    _addAnalysisDataToCSVData: function (CSVData, currentLayerId) {
      var graphicIndex, graphicsArrayLen, featureAnalysisInfo, graphicElement;
      graphicsArrayLen = CSVData.graphicsArray.length;
      if (graphicsArrayLen > 0) {
        for (graphicIndex = 0; graphicIndex < graphicsArrayLen; graphicIndex++) {
          graphicElement = CSVData.graphicsArray[graphicIndex];
          featureAnalysisInfo = this._getFeatureAnalysisData(currentLayerId, graphicIndex);
          if (featureAnalysisInfo) {
            graphicElement.CSVMeasurementUnit = featureAnalysisInfo.analysisResultValue;
          }
        }
        if (featureAnalysisInfo) {
          this._addGeometryUnitToFields(CSVData, featureAnalysisInfo);
        }
      }
    },

    /**
     * To add area / length analysis unit to csv fields data
     * @param{CSVData} CSVData data sent for CSV download
     * @param{Object} feature analysis data object which has analysis key and Unit
     * @memberOf Screening/download/download
     */
    _addGeometryUnitToFields: function (CSVData, featureAnalysisInfo) {
      var analysisField;
      analysisField = featureAnalysisInfo.analysisResultKey + "(" +
        featureAnalysisInfo.analysisUnit + ")";
      CSVData.outFields.push({
        alias: analysisField,
        name: "CSVMeasurementUnit",
        type: "esriFieldTypeDouble"
      });
    },

    /**
     * Based on config analysis unit get csv data length/area column unit name
     * @param{featureName} feature
     * @param{graphicIndex} index of feature element in CSV graphic array
     * @memberOf Screening/download/download
     */
    _getFeatureAnalysisData: function (featureName, graphicIndex) {
      var printDataEntity, printDataItem, analysisUnit, refUnitArrayName,
        csvAnalysisDataObj = {};
      analysisUnit = "";
      for (printDataEntity in this.printData) {
        printDataItem = this.printData[printDataEntity];
        if (printDataEntity.indexOf(featureName) !== -1) {
          if (printDataItem.geometryType !== "esriGeometryPoint") {
            if (printDataItem.geometryType === "esriGeometryPolyline") {
              analysisUnit = this._getAnalysisUnitForGeometry(this.lengthUnits, printDataItem.geometryType);
              refUnitArrayName = this.lengthUnits + "UnitInfo";
              // This code is not related to 508/accessibility. It added to solve issue related to download CSV file.
              refUnitArrayName = this._lowerCaseFirstLetter(refUnitArrayName);
              csvAnalysisDataObj.analysisResultValue = printDataItem[refUnitArrayName][graphicIndex];
              csvAnalysisDataObj.analysisResultKey = this._getAnalysisResultKey(printDataItem.geometryType);
              csvAnalysisDataObj.analysisUnit = analysisUnit;
              return csvAnalysisDataObj;
            } else if (printDataItem.geometryType === "esriGeometryPolygon") {
              analysisUnit = this._getAnalysisUnitForGeometry(this.areaUnits, printDataItem.geometryType);
              refUnitArrayName = this.areaUnits + "UnitInfo";
              // This code is not related to 508/accessibility It added to solve issue related to download CSV file.
              refUnitArrayName = this._lowerCaseFirstLetter(refUnitArrayName);
              csvAnalysisDataObj.analysisResultValue = printDataItem[refUnitArrayName][graphicIndex];
              csvAnalysisDataObj.analysisResultKey = this._getAnalysisResultKey(printDataItem.geometryType);
              csvAnalysisDataObj.analysisUnit = analysisUnit;
              return csvAnalysisDataObj;
            }
          }
        }
      }
    },

    /**
     * Based on config analysis unit get csv data length/area column unit name
     * @param{geometryType} geometry type for feature
     * @memberOf Screening/download/download
     */
    _getAnalysisResultKey: function (geometryType) {
      if (geometryType === "esriGeometryPolygon") {
        return this.nls.reportsTab.featureCSVAreaText;
      } else if (geometryType === "esriGeometryPolyline") {
        return this.nls.reportsTab.featureCSVLengthText;
      }
    },

    /**
     * Based on config analysis unit value return unit for CSV download Length and Area
     * @param{analysisUnit} config analysis unit
     * @param{geometryType} geometry type for feature
     * @memberOf Screening/download/download
     */
    _getAnalysisUnitForGeometry: function (analysisUnit, geometryType) {
      var analysisResultUnit;
      switch (analysisUnit) {
        case "Feet":
        case "SquareFeet":
          analysisResultUnit = (geometryType === "esriGeometryPolygon") ?
            this.nls.units.squareFeetAbbr : this.nls.units.feetAbbr;
          break;
        case "Miles":
        case "Acres":
          analysisResultUnit = (geometryType === "esriGeometryPolygon") ?
            this.nls.units.acresAbbr : this.nls.units.milesAbbr;
          break;
        case "Meters":
        case "SquareMeters":
          analysisResultUnit = (geometryType === "esriGeometryPolygon") ?
            this.nls.units.squareMetersAbbr : this.nls.units.metersAbbr;
          break;
        case "Kilometers":
        case "SquareKilometers":
          analysisResultUnit = (geometryType === "esriGeometryPolygon") ?
            this.nls.units.squareKilometerAbbr : this.nls.units.kilometersAbbr;
          break;
        case "Hectares":
          analysisResultUnit = (geometryType === "esriGeometryPolygon") ?
            this.nls.reportsTab.hectaresAbbr : this.nls.units.kilometersAbbr;
          break;
        case "SquareMiles":
          analysisResultUnit = (geometryType === "esriGeometryPolygon") ?
            this.nls.reportsTab.squareMilesAbbr : this.nls.units.milesAbbr;
          break;
      }
      return analysisResultUnit;
    },

    /**
     * Get config download layers which are active on map
     * @memberOf Screening/download/download
     */
    _getFilteredDownloadLayers: function () {
      var downloadLayersArr = [],
        filteredDownloadLayers = [];
      downloadLayersArr = this.config.downloadSettings.layers;
      // filter to apply download operation for layers which are active on map
      filteredDownloadLayers = downloadLayersArr.filter(lang.hitch(this, function (downloadLayer) {
        if (this.filterLayerObj.hasOwnProperty(downloadLayer.id)) {
          return true;
        }
        return false;
      }));
      return filteredDownloadLayers;
    },

    /**
     * This function is used to set the focus on format dropdown
     */
    setFocusOnFormatDropdown: function () {
      this._focusOutCurrentNode();
      focusUtil.focus(this.downloadFormatSelect);
    },

    /**
     * This function is used to convert the first character of a string to lowercase.
     * Note: This code is not related to 508/accessibility. It added to solve issue related to download CSV file.
     */
    _lowerCaseFirstLetter: function(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    },

    /**
     * This function is used to focus out the current node
     */
    _focusOutCurrentNode: function () {
      if (focusUtil.curNode) {
        focusUtil.curNode.blur();
      }
    }
  });
});