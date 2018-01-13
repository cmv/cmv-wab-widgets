///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
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
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./DownloadSettings.html',
  'dojo/_base/array',
  'dojo/dom-class',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/query',
  'dojo/dom-attr',
  'dojo/_base/html',
  'dojo/dom-construct',
  'dojo/string',
  "dojo/_base/Color",
  'jimu/BaseWidgetSetting',
  'jimu/dijit/CheckBox',
  'jimu/dijit/SimpleTable',
  'jimu/dijit/GpSource',
  'jimu/dijit/Popup',
  'jimu/dijit/Message',
  'jimu/dijit/ImageChooser',
  'jimu/portalUtils',
  "jimu/dijit/ColorPicker",
  'esri/request',
  'jimu/dijit/RadioBtn',
  'dijit/form/ValidationTextBox'
], function (
  declare,
  _WidgetsInTemplateMixin,
  template,
  arrayUtils,
  domClass,
  lang,
  on,
  dojoQuery,
  domAttr,
  html,
  domConstruct,
  string,
  Color,
  BaseWidgetSetting,
  CheckBox,
  SimpleTable,
  GpSource,
  Popup,
  Message,
  ImageChooser,
  portalUtils,
  ColorPicker,
  esriRequest
) {
  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

    templateString: template,
    baseClass: 'jimu-widget-screening-download-settings',

    map: null,
    loadingIndicator: null,
    downloadOptions: null,

    _layerIndex: 0,
    _layers: [],
    _extractDataTaskDownloadOptions: [],
    _extractDataTaskURL: "",
    _printTaskURL: "",
    _logo: "",
    _tableHeaderColor: null,

    /* Public methods list */
    // checkLayerForDownloadOptions
    // getLayers
    // deleteRow
    // rowUp
    // rowDown
    // getExtractDataTaskURL
    // getDownloadingFileOptions
    // getPrintReportGPServiceURL
    // getFootnoteForReport
    // getLogo

    postCreate: function () {
      var args, extractDataTaskGPSource, printReportGPSource, popup, helperServices;
      // Initialize sync enable downloadable options table
      this._initSyncEnableOptionTable();
      if (this._syncEnableOptionTable) {
        // Clear table rows, if any
        this._layers = [];
        this._syncEnableOptionTable.clear();
      }
      // To retain state of config UI, set downloadable file options
      if (this.downloadOptions && this.downloadOptions.layers) {
        this._layers = this.downloadOptions.layers;
        arrayUtils.forEach(this.downloadOptions.layers, lang.hitch(
          this,
          function (layer) {
            this._setFileOptionDataInTable(layer);
          }));
      }
      // Choose the last option selected to download data,
      // 'Sync-enable' option will be selected by default
      if (this.downloadOptions && this.downloadOptions.type) {
        this._chooseDownloadOption(this.downloadOptions.type, true);
      }
      // Attach download option radio button click event
      this._attachDownloadOptionEvent();
      // Set print report gp service url
      if (this.reportSettings && this.reportSettings.printTaskURL &&
        this.reportSettings.printTaskURL !== "") {
        this.printGPServiceTextBox.set("value", this.reportSettings.printTaskURL);
        this._printTaskURL = this.reportSettings.printTaskURL;
      } else {
        //get helper services form portal object and discover print task url form org info
        helperServices = portalUtils.getPortal(this.appConfig.portalUrl).helperServices;
        if (helperServices && helperServices.printTask.url) {
          this.printGPServiceTextBox.set("value", helperServices.printTask.url);
          this._printTaskURL = helperServices.printTask.url;
        }
      }
      // Set print report footnote
      if (this.reportSettings && this.reportSettings.footnote &&
        this.reportSettings.footnote !== "") {
        this.footnoteTextArea.value = this.reportSettings.footnote;
      }
      args = {
        portalUrl: this.appConfig.portalUrl
      };
      // Attach Extract data task set button event
      this.own(on(this.extractDataTaskSetButton, "click", lang.hitch(this, function () {
        extractDataTaskGPSource = new GpSource(args);
        popup = this._onSetButtonClick(extractDataTaskGPSource);
        this._attachExtractDataTaskGPSourceEvents(extractDataTaskGPSource, popup);
      })));
      // Attach Report GP Service set button event
      this.own(on(this.printGPServiceSetButton, "click", lang.hitch(this, function () {
        printReportGPSource = new GpSource(args);
        popup = this._onSetButtonClick(printReportGPSource);
        this._attachPrintReportGPSourceEvents(printReportGPSource, popup);
      })));
      // Initialize jimu dijit image chooser
      this._initImageChooser();
      // Initialize color picker for Table Header
      this._tableHeaderColor =
        this._createColorPicker(this.reportSettings.columnTitleColor,
          this.columnTitleColorPickerNode);
      // set report title to config value
      this.reportTitleTextBox.set('value', this.reportSettings.reportTitle);
    },

    /**
    * This function is to attach extract data task gp source events
    * @param{object} contains gp source
    * @param{node} contains popup
    * @memberOf Screening/setting/Download
    **/
    _attachExtractDataTaskGPSourceEvents: function (gpSource, popup) {
      this.own(on(gpSource, "ok", lang.hitch(this, function (tasks) {
        if (tasks && tasks.length > 0 && tasks[0].url) {
          this._requestExtractDataTaskURLInfo(tasks[0].url, popup);
        }
      })));
      this.own(on(gpSource, "cancel", lang.hitch(this, function () {
        popup.close();
      })));
    },

    /**
    * Function to get extract data task url
    * @memberOf Screening/setting/Download
    **/
    getExtractDataTaskURL: function () {
      return this._extractDataTaskURL ? this._extractDataTaskURL : "";
    },

    /**
    * This function is to attach print report gp source events
    * @param{object} contains gp source
    * @param{node} contains popup
    * @memberOf Screening/setting/Download
    **/
    _attachPrintReportGPSourceEvents: function (gpSource, popup) {
      this.own(on(gpSource, "ok", lang.hitch(this, function (tasks) {
        if (tasks && tasks.length > 0 && tasks[0].url) {
          this.printGPServiceTextBox.set("value", tasks[0].url);
          this._printTaskURL = tasks[0].url;
        } else {
          this.printGPServiceTextBox.set("value", "");
          this._printTaskURL = "";
        }
        popup.close();
      })));
      this.own(on(gpSource, "cancel", lang.hitch(this, function () {
        popup.close();
      })));
    },

    /**
    * This function is to initialize jimu simple table for sync enable download option
    * @memberOf Screening/setting/Download
    **/
    _initSyncEnableOptionTable: function () {
      var fields, args;
      // Set required fields needed to display in the table
      fields = [{
        "name": this.nls.downloadTab.syncEnableTableHeaderTitle.layerNameLabel,
        "title": this.nls.downloadTab.syncEnableTableHeaderTitle.layerNameLabel,
        "type": "empty",
        "width": "40%"
      }, {
        "name": this.nls.downloadTab.syncEnableTableHeaderTitle.csvFileFormatLabel,
        "title": this.nls.downloadTab.syncEnableTableHeaderTitle.csvFileFormatLabel,
        "class": "esriCTTableHeader",
        "type": "empty",
        "width": "15%"
      }, {
        "name": this.nls.downloadTab.syncEnableTableHeaderTitle.fileGDBFormatLabel,
        "title": this.nls.downloadTab.syncEnableTableHeaderTitle.fileGDBFormatLabel,
        "class": "esriCTTableHeader",
        "type": "empty",
        "width": "15%"
      }, {
        "name": this.nls.downloadTab.syncEnableTableHeaderTitle.allowDownloadLabel,
        "title": this.nls.downloadTab.syncEnableTableHeaderTitle.allowDownloadLabel,
        "class": "esriCTTableHeader",
        "type": "empty",
        "width": "15%"
      }];
      args = {
        fields: fields,
        selectable: false
      };
      // Initialize Sync enable option table
      this._syncEnableOptionTable = new SimpleTable(args);
      this._syncEnableOptionTable.placeAt(this.downloadOptionTable);
      this._syncEnableOptionTable.startup();
    },

    /**
    * This function will populate data in sync enable options table
    * @param{object} contains layer information
    * @memberOf Screening/setting/Download
    **/
    _setFileOptionDataInTable: function (layer) {
      var tuple, downloadingFileOptions;
      tuple = this._syncEnableOptionTable.addRow({});
      if (!tuple.success || !tuple.tr) {
        return;
      }
      // Add layer name
      this._addLayerTitle(tuple.tr, layer.layerName);
      // Show 'CSV' file option as downloadable
      this._addFileOption(tuple.tr, 1);
      downloadingFileOptions = layer.downloadingFileOption.join();
      if (downloadingFileOptions.split("filegdb").length > 1) {
        // Show 'FileGDB' file option as downloadable
        this._addFileOption(tuple.tr, 2);
      }
      // Add allow download option check box for the layer
      this._addAllowDownloadCheckbox(tuple.tr, layer);
    },

    /**
    * This function is to set downloadable file info in the table
    * @param{object} contains layer information
    * @param{integer} contains row index
    * @memberOf Screening/setting/Download
    **/
    checkLayerForDownloadOptions: function (layer, index) {
      var layerInformation, tuple;
      tuple = this._getTableRow(index);
      if (!tuple.success || !tuple.tr) {
        return;
      }
      layerInformation = {
        "url": layer.url,
        "layerName": layer.layerName,
        "id": layer.id,
        "allowDownload": true
      };
      this._addLayerTitle(tuple.tr, layer.layerName);
      // Show 'CSV' file option
      this._addFileOption(tuple.tr, 1);
      layerInformation.downloadingFileOption = [];
      layerInformation.downloadingFileOption.push("csv");
      // Show 'FileGDB' file option, if the layer has 'Sync' capability
      if (layer.capabilities.split("Sync").length > 1 && layer.layerVersion >= 10.4) {
        this._addFileOption(tuple.tr, 2);
        layerInformation.downloadingFileOption.push("filegdb");
      }
      // Add allow download option check box for the layer
      this._addAllowDownloadCheckbox(tuple.tr, layerInformation);
      this._setLayerDownloadInfo(layerInformation, index);
    },

    /**
    * This function is to get the particular row of the table
    * @param{integer} contains row index
    * @memberOf Screening/setting/Download
    **/
    _getTableRow: function (index) {
      var tuple;
      // Check if it is an existing row
      if ((index > -1) && this._syncEnableOptionTable.tbody.rows[
        index]) {
        tuple = {
          "tr": this._syncEnableOptionTable.tbody.rows[index],
          "success": true
        };
        this._removeFileOptions(tuple.tr);
      } else {
        tuple = this._syncEnableOptionTable.addRow({});
      }
      return tuple;
    },

    /**
    * This function is to set the layer information
    * @param{object} contains layer information
    * @param{integer} contains row index
    * @memberOf Screening/setting/Download
    **/
    _setLayerDownloadInfo: function (layerInformation, index) {
      // Check if existing row is modified or a new row is added
      if (index > -1) {
        this._layers.splice(index, 1, layerInformation);
      } else {
        this._layers.push(layerInformation);
      }
    },

    /**
    * This function is to set layer name in the table row
    * @param{object} contains table row
    * @param{string} contains layer name
    * @memberOf Screening/setting/Download
    **/
    _addLayerTitle: function (row, layerName) {
      var td;
      // Set layer label
      td = dojoQuery('.simple-table-cell', row)[0];
      if (td) {
        td.innerHTML = layerName;
      }
    },

    /**
    * This function is to remove all the file options, if any
    * @param{integer} contains row index
    * @memberOf Screening/setting/Download
    **/
    _removeFileOptions: function (row) {
      var cells, i;
      // Remove all available download file options, if any
      cells = dojoQuery('.simple-table-cell', row);
      for (i = 1; i < 4; i++) {
        domClass.remove(cells[i], "esriCTAvailableDownloadOption");
      }
    },

    /**
    * This function is to set downloadable file tick
    * @param{object} contains table row
    * @param{integer} contains row index
    * @memberOf Screening/setting/Download
    **/
    _addFileOption: function (row, index) {
      var td;
      // Show the file option available
      td = dojoQuery('.simple-table-cell', row)[index];
      if (td) {
        domClass.add(td, "esriCTAvailableDownloadOption");
      }
    },

    /**
    * This function is to set downloadable file tick
    * @param{object} contains table row
    * @param{integer} contains row index
    * @memberOf Screening/setting/Download
    **/
    _addAllowDownloadCheckbox: function (row, layerInformation) {
      var td, checkbox;
      td = dojoQuery('.simple-table-cell', row)[3];
      if (td) {
        // Empty the node for the allow download checkbox
        domConstruct.empty(td);
        // Initialize allow download checkbox
        checkbox = new CheckBox({
          "checked": layerInformation.allowDownload,
          "class": "esriCTAllowDownloadCheckbox"
        });
        checkbox.placeAt(td);
        // Add allow download checkbox change event
        this.own(on(checkbox, "change", lang.hitch(this, function () {
          layerInformation.allowDownload = domAttr.get(
            checkbox, "checked");
        })));
      }
    },

    /**
    * This function is to attach click events of radio buttons to show there respective contents
    * @memberOf Screening/setting/Download
    **/
    _attachDownloadOptionEvent: function () {
      var radioButtons, lastSelectedOption;
      lastSelectedOption = dojoQuery('input[type=radio]:checked', this.downloadOptionForm)[
        0].value;
      radioButtons = dojoQuery('input', this.downloadOptionForm);
      // Attach all radio buttons 'click' event
      arrayUtils.forEach(radioButtons, lang.hitch(this, function (
        option) {
        this.own(on(option, "click", lang.hitch(this, function (
          evt) {
          if (option.value !== lastSelectedOption) {
            this._chooseDownloadOption(evt.currentTarget
              .value, false);
            lastSelectedOption = evt.currentTarget.value;
          }
        })));
      }));
    },

    /**
    * This function is to set downloadable file tick
    * @param{string} contains file option, like
    * 'syncEnable', 'extractDataTask' or 'cannotDownload'
    * @param{boolean} contains true when function calls on load
    * @memberOf Screening/setting/Download
    **/
    _chooseDownloadOption: function (option, onLoad) {
      switch (option) {
        case "syncEnable":
          this.syncEnableRadioButton.set("checked", true);
          domClass.remove(this.downloadOptionTable, "esriCTHidden");
          domClass.add(this.extractDataTaskInputContainer, "esriCTHidden");
          // Reset extract data task url textbox
          if (onLoad) {
            this._resetExtractDataTaskOption(true);
          }
          break;
        case "extractDataTask":
          this.gpServiceRadioButton.set("checked", true);
          domClass.add(this.downloadOptionTable, "esriCTHidden");
          domClass.remove(this.extractDataTaskInputContainer, "esriCTHidden");
          // Set extract data task url textbox
          if (onLoad && this.downloadOptions && this.downloadOptions.extractDataTaskURL) {
            this._resetExtractDataTaskOption(false);
          }
          break;
        case "cannotDownload":
          this.cannotDownloadRadioButton.set("checked", true);
          domClass.add(this.downloadOptionTable, "esriCTHidden");
          domClass.add(this.extractDataTaskInputContainer, "esriCTHidden");
          // Reset extract data task url textbox
          if (onLoad) {
            this._resetExtractDataTaskOption(true);
          }
          break;
        default:
          break;
      }
    },

    /**
    * This function is to get downloadable layers array
    * @memberOf Screening/setting/Download
    **/
    getLayers: function () {
      return this._layers;
    },

    /**
    * This function is to delete table row
    * @param{integer} contains row index
    * @memberOf Screening/setting/Download
    **/
    deleteRow: function (rowIndex) {
      var tr = this._syncEnableOptionTable.tbody.rows[rowIndex];
      this._syncEnableOptionTable.deleteRow(tr);
      this._layers.splice(rowIndex, 1);
    },

    /**
    * This function is to move table row one position up
    * @param{integer} contains row index
    * @memberOf Screening/setting/Download
    **/
    rowUp: function (rowIndex) {
      var layerInfo, refLayerInfo;
      if (rowIndex > -1 && this._syncEnableOptionTable.tbody.rows[
        rowIndex + 1]) {
        // Swap table rows
        html.place(this._syncEnableOptionTable.tbody.rows[rowIndex],
          this._syncEnableOptionTable.tbody.rows[rowIndex + 1],
          'after');
        this._syncEnableOptionTable.updateUI();
        // Update layer info array
        layerInfo = this._layers[rowIndex];
        refLayerInfo = this._layers[rowIndex + 1];
        this._layers.splice(rowIndex, 2, refLayerInfo, layerInfo);
      }
    },

    /**
    * This function is to move table row one position down
    * @param{integer} contains row index
    * @memberOf Screening/setting/Download
    **/
    rowDown: function (rowIndex) {
      var layerInfo, refLayerInfo;
      if (rowIndex < this._syncEnableOptionTable.tbody.rows.length &&
        this._syncEnableOptionTable.tbody.rows[rowIndex - 1]) {
        // Swap table rows
        html.place(this._syncEnableOptionTable.tbody.rows[rowIndex],
          this._syncEnableOptionTable.tbody.rows[rowIndex - 1],
          'before');
        this._syncEnableOptionTable.updateUI();
        // Update layer info array
        layerInfo = this._layers[rowIndex];
        refLayerInfo = this._layers[rowIndex - 1];
        this._layers.splice((rowIndex - 1), 2, layerInfo,
          refLayerInfo);
      }
    },

    /**
    * This function is to attach set button click event functionality
    * @param{object} contains gp source
    * @memberOf Screening/setting/Download
    **/
    _onSetButtonClick: function (gpSource) {
      var popup;
      popup = new Popup({
        "titleLabel": this.nls.downloadTab.setGPTaskTitle,
        "width": 830,
        "height": 560,
        "content": gpSource
      });
      return popup;
    },

    /**
    * This function is to request info in json format from url
    * @param{string} contains extract data task url
    * @param{dom node} contains popup
    * @memberOf Screening/setting/Download
    **/
    _requestExtractDataTaskURLInfo: function (url, popup) {
      var isExtractDataTaskURLValid;
      isExtractDataTaskURLValid = false;
      this.loadingIndicator.show();
      esriRequest({ "url": url + "?f=pjson" }).then(
        lang.hitch(this, function (results) {
          isExtractDataTaskURLValid = this._validateExtractDataTask(results);
          if (!isExtractDataTaskURLValid) {
            this._showMessage(this.nls.downloadTab.errorMessages.invalidGPTaskURL);
            this.extractDataTaskTextBox.set("value", "");
            this._extractDataTaskURL = "";
          } else {
            this.extractDataTaskTextBox.set("value", url);
            this._extractDataTaskURL = url;
          }
          popup.close();
          this.loadingIndicator.hide();
        }), lang.hitch(this, function () { // on Error
          this._showMessage(this.nls.downloadTab.errorMessages.invalidGPTaskURL);
          this.extractDataTaskTextBox.set("value", "");
          this._extractDataTaskURL = "";
          this.loadingIndicator.hide();
          popup.close();
        }));
    },

    /**
    * This function is to attach set button click event functionality
    * @param{object} information of extract data task
    * @memberOf Screening/setting/Download
    **/
    _validateExtractDataTask: function (results) {
      var validAOIParam, validFeatureFormatParam, validOutputParam;
      validAOIParam = validFeatureFormatParam = validOutputParam = false;
      if (results && results.executionType === "esriExecutionTypeAsynchronous") {
        arrayUtils.forEach(results.parameters, lang.hitch(this, function (paramDetail) {
          switch (paramDetail.name) {
            case "Area_of_Interest":
              validAOIParam = this._checkAOIParam(paramDetail);
              break;
            case "Feature_Format":
              validFeatureFormatParam = this._checkFeatureFormatParam(paramDetail);
              break;
            case "Output_Zip_File":
              validOutputParam = this._checkOutputParam(paramDetail);
              break;
            default:
              break;
          }
        }));
        if (validAOIParam && validFeatureFormatParam && validOutputParam) {
          return true;
        }
      }
      return false;
    },

    /**
    * This function is to check required AOI param
    * @param{object} information of extract data task AOI param
    * @memberOf Screening/setting/Download
    **/
    _checkAOIParam: function (paramDetail) {
      if (paramDetail.dataType === "GPFeatureRecordSetLayer") {
        if (paramDetail.defaultValue &&
          paramDetail.defaultValue.geometryType !== "esriGeometryPolygon") {
          return false;
        }
        return true;
      }
      return false;
    },

    /**
    * This function is to check required feature format param
    * @param{object} information of extract data task feature format param
    * @memberOf Screening/setting/Download
    **/
    _checkFeatureFormatParam: function (paramDetail) {
      var fileOption, isAvail;
      isAvail = false;
      fileOption = {
        fileGDB: "File Geodatabase - GDB - .gdb",
        shapefile: "Shapefile - SHP - .shp"
      };
      this._extractDataTaskDownloadOptions = [];
      if (paramDetail.dataType === "GPString" && paramDetail.choiceList &&
        paramDetail.choiceList.length > 0) {
        this._extractDataTaskDownloadOptions.push("csv");
        if (paramDetail.choiceList.indexOf(fileOption.fileGDB) > -1) {
          this._extractDataTaskDownloadOptions.push("filegdb");
          isAvail = true;
        }
        if (paramDetail.choiceList.indexOf(fileOption.shapefile) > -1) {
          this._extractDataTaskDownloadOptions.push("shapefile");
          isAvail = true;
        }
        return isAvail;
      }
      return false;
    },

    /**
    * This function is to check required output zip file param
    * @param{object} information of extract data task output zip file param
    * @memberOf Screening/setting/Download
    **/
    _checkOutputParam: function (paramDetail) {
      if (paramDetail.dataType === "GPDataFile") {
        return true;
      }
      return false;
    },

    /**
    * Create and show alert message.
    * @param {string} contains message
    * @memberOf Screening/setting/Download
    **/
    _showMessage: function (msg) {
      var alertMessage = new Message({
        message: msg
      });
      alertMessage.message = msg;
    },

    /**
    * Function to get downloading options
    * @memberOf Screening/setting/Download
    **/
    getDownloadingFileOptions: function () {
      var type, options;
      options = [];
      type = dojoQuery('input[type=radio]:checked', this.downloadOptionForm)[0].value;
      if (type === "syncEnable") {
        options = this._getSyncEnableDownloadingOptions(this._layers);
      } else if (type === "extractDataTask") {
        options = this._extractDataTaskDownloadOptions;
      }
      return options;
    },

    /**
    * Function to get downloading options for sync-enable
    * @param {object} contains layers infos
    * @memberOf Screening/setting/Download
    **/
    _getSyncEnableDownloadingOptions: function (layers) {
      var downloadingOptions;
      downloadingOptions = [];
      arrayUtils.some(layers, lang.hitch(this, function (currentLayer) {
        //Check layer is available for download
        if (currentLayer.allowDownload) {
          //Loop through array of download options
          arrayUtils.some(currentLayer.downloadingFileOption, lang.hitch(this, function (option) {
            //Check if option is already added to array
            if (downloadingOptions.indexOf(option) === -1 && option !== "shapefile") {
              downloadingOptions.push(option);
              return;
            }
          }));
        }
      }));
      return downloadingOptions;
    },

    /**
    * Function to get print report gp service url
    * @memberOf Screening/setting/Download
    **/
    getPrintReportGPServiceURL: function () {
      return this._printTaskURL ? this._printTaskURL : "";
    },

    /**
    * Function to get report title text
    * @memberOf Screening/setting/Download
    **/
    getReportTitle: function () {
      return this.reportTitleTextBox.value;
    },

    /**
    * Function to get report table header color
    * @memberOf Screening/setting/Download
    **/
    getTableHeaderColor: function () {
      var tableHeaderSelectedColor = this._tableHeaderColor.color.toHex();
      return tableHeaderSelectedColor ? tableHeaderSelectedColor : "";
    },

    /**
    * Function to get footnote for report
    * @memberOf Screening/setting/Download
    **/
    getFootnoteForReport: function () {
      return this.footnoteTextArea.value ? this.footnoteTextArea.value : "";
    },

    /**
    * Function to get initialize image chooser for reports
    * @memberOf Screening/setting/Download
    **/
    _initImageChooser: function () {
      this.logoChooser = new ImageChooser({
        cropImage: false,
        showSelfImg: false,
        goldenWidth: 50,
        goldenHeight: 50,
        displayImg: this.imageChooserPreview,
        format: [ImageChooser.GIF, ImageChooser.PNG, ImageChooser.JPEG]
      });
      // Placing image chooser
      this.logoChooser.placeAt(this.logoChooserNode);
      this._createLogoPreview();
      domClass.add(this.logoChooser.domNode, "esriCTImageChooserContent");
    },

    /**
    * Function to set default logo in config
    * @param {object} contains image info
    * @memberOf Screening/setting/Download
    **/
    _createLogoPreview: function () {
      var baseURL, imageInfo, imageSrc;
      //by default
      imageSrc = this.folderUrl + "/images/default-logo.png";
      //logo is configured use it else show default logo
      if (this.reportSettings && this.reportSettings.logo) {
        imageInfo = this.reportSettings.logo;
        //if "${appPath}" string found in imageInfo
        if (imageInfo.indexOf("${appPath}") > -1) {
          baseURL = this.folderUrl.slice(0, this.folderUrl.lastIndexOf("widgets"));
          imageSrc = string.substitute(imageInfo, { appPath: baseURL });
        } else {
          imageSrc = imageInfo;
        }
      }
      domAttr.set(this.imageChooserPreview, 'src', imageSrc);
    },

    /**
    * Function to get logo information
    * @memberOf Screening/setting/Download
    **/
    getLogo: function () {
      // return imageData if available else return default image path
      if (this.logoChooser && this.logoChooser.imageData) {
        return this.logoChooser.getImageData();
      } else if (this.reportSettings && this.reportSettings.logo) {
        return this.reportSettings.logo;
      } else {
        return "${appPath}/widgets/Screening/images/default-logo.png";
      }
    },

    /**
    * Function to reset extract data task url textbox
    * @param {boolean} contains true or false
    * @memberOf Screening/setting/Download
    **/
    _resetExtractDataTaskOption: function (reset) {
      // If true then reset extract data task url textbox
      if (reset) {
        this.extractDataTaskTextBox.set("value", "");
        this._extractDataTaskURL = "";
        this._extractDataTaskDownloadOptions = [];
      } else {
        this.extractDataTaskTextBox.set("value", this.downloadOptions.extractDataTaskURL);
        this._extractDataTaskURL = this.downloadOptions.extractDataTaskURL;
        this._extractDataTaskDownloadOptions = this.downloadOptions.downloadingFileOptions;
      }
    },

    /**
    * This function creates color picker instance to select table header and name row color
    * @memberOf widgets/DistrictLookup/setting/setting
    **/
    _createColorPicker: function (defaultColor, node) {
      var tablePreviewText, trPreviewText, tdPreviewText, tdSymbolNode, colorPickerDivNode,
        colorPicker;
      tablePreviewText = domConstruct.create("table", {
        "cellspacing": "0",
        "cellpadding": "0"
      }, node);
      trPreviewText = domConstruct.create("tr", { "style": "height:30px" }, tablePreviewText);
      tdPreviewText = domConstruct.create("td", {}, trPreviewText);
      tdSymbolNode = domConstruct.create("td", {}, trPreviewText);
      //create content div for color picker node
      colorPickerDivNode = domConstruct.create("div", {
        "class": "esriCTColorChooserNode"
      }, tdSymbolNode);
      colorPicker = new ColorPicker(null, domConstruct.create("div", {},
        colorPickerDivNode));
      colorPicker.setColor(new Color(defaultColor));
      return colorPicker;
    }
  });
});