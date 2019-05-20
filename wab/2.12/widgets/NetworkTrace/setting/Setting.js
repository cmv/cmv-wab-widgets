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
/*global define */
define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidgetSetting',
  'dojox/validate/regexp',
  "esri/request",
  "dojo/_base/lang",
  "dojo/dom-construct",
  "dojo/dom-class",
  "dojo/on",
  'dojo/string',
  "jimu/dijit/GpSource",
  'jimu/dijit/TabContainer3',
  "jimu/dijit/Popup",
  "dojo/_base/array",
  "jimu/dijit/Message",
  "jimu/dijit/LoadingIndicator",
  "dijit/registry",
  "./othersSetting",
  "./summarySetting",
  "./inputOutputSettings",
  "./projectSetting"
], function (
  declare,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin,
  BaseWidgetSetting,
  regexp,
  esriRequest,
  lang,
  domConstruct,
  domClass,
  on,
  dojoString,
  GpSource,
  TabContainer3,
  Popup,
  array,
  Message,
  LoadingIndicator,
  registry,
  OthersSetting,
  SummarySetting,
  InputOutputSettings,
  ProjectSetting
) {
  return declare([BaseWidgetSetting, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-NetworkTrace-setting',
    url: null,
    config: {},
    gpServiceTasks: null,
    inputParametersArray: [],
    outputParametersArray: [],
    validConfig: false,
    inputDataTypes: {
      "flags": "Flag",
      "barriers": "Barrier",
      "skip_locations": "Skip"
    },
    tab: null,

    startup: function () {
      this.inherited(arguments);
    },

    postMixInProperties: function () {
      //mixin default nls with widget nls
      this.nls.common = {};
      lang.mixin(this.nls.common, window.jimuNls.common);
    },

    postCreate: function () {
      this.tab = null;
      // validating the fetching the request data
      setTimeout(lang.hitch(this, function () {
        if (this.config && this.config.geoprocessing && this.config
          .geoprocessing.url) {
          this.txtURL.set('value', this.config.geoprocessing.url);
          this._resetConfigParams();
          this._validateGPServiceURL();
        }
      }), 200);
      this._initLoading();
    },

    /**
     * Create project setting
     */
    _createProjectSettings: function () {
      this._projectSettingInstance = new ProjectSetting({
        map: this.map,
        nls: this.nls,
        config: this.config.projectSettings,
        outputParametersArray: this.outputParametersArray
      });
      //Enable/Disable layer selectors for out params based on projectsettings
      this.own(on(this._projectSettingInstance, "settingsChanged",
        lang.hitch(this, function (projectSettings) {
          this._inputOutputSettings.onProjectSettingsChanged(projectSettings);
        })));
      this._projectSettingInstance.placeAt(this.ProjectSettingsDiv);
      this._projectSettingInstance.startup();
    },

    /**
     * This function the initializes jimu tab for setting and layout
     **/
    _initTabs: function () {
      var projectSettingTab, inputOutputTab, summaryTab, generalSettingsTab, tabs;
      projectSettingTab = {
        title: this.nls.projectSetting.title,
        content: this.projectSettingTabNode
      };
      inputOutputTab = {
        title: this.nls.inputOutputTab.title,
        content: this.inputOutputTabNode
      };
      summaryTab = {
        title: this.nls.summaryTab.title,
        content: this.summaryTabNode
      };
      generalSettingsTab = {
        title: this.nls.generalSettings.title,
        content: this.generalSettingsTabNode
      };
      tabs = [projectSettingTab, inputOutputTab, summaryTab, generalSettingsTab];
      this.tab = new TabContainer3({
        "tabs": tabs
      });
      // Handle tabChanged event and set the scroll position to top
      this.own(on(this.tab, "tabChanged", lang.hitch(this, function () {
        this.tab.containerNode.scrollTop = 0;
      })));
      this.tab.placeAt(this.tabDiv);
    },

    /**
     * function  enables or disables set button on textbox input.
     * @memberOf widgets/isolation-trace/settings/settings.js
     */
    _resetConfigParams: function () {
      var gpURL = this.txtURL.get('value');
      // if input value is null or empty then disable all the config options.
      if (gpURL === null || gpURL === "") {
        domConstruct.empty(this.othersData);
        domClass.add(this.mainContainer, "esriCTHidden");
      }
      //reset tab to project settings once config is reset
      if (this.tab) {
        this.tab.selectTab(this.nls.projectSetting.title);
      }
    },

    /**
     * Set task URL button click handler.
     * @memberOf widgets/isolation-trace/settings/settings.js
     */
    _onChooseTaskClicked: function () {
      var args = {
          portalUrl: this.appConfig.portalUrl
        },
        gpSource = new GpSource(args),
        popup = new Popup({
          titleLabel: this.nls.setTaskPopupTitle,
          width: 830,
          height: 560,
          content: gpSource
        });

      this.own(on(gpSource, 'ok', lang.hitch(this, function (tasks) {
        if (tasks.length === 0) {
          popup.close();
          return;
        }
        this.config = {};
        this.txtURL.set('value', tasks[0].url);
        this._resetConfigParams();
        this._validateGPServiceURL();
        popup.close();
      })));
      this.own(on(gpSource, 'cancel', lang.hitch(this, function () {
        popup.close();
      })));
    },

    /**
     * This function will execute when user clicked on the "Set Task."
     * @memberOf widgets/isolation-trace/settings/settings.js
     */
    _validateGPServiceURL: function () {
      this.gpServiceTasks = [];
      var requestArgs, gpTaskParameters = [];
      this.loading.show();

      if (this.map && this.map.itemInfo && this.map.itemInfo.itemData &&
        this.map.itemInfo.itemData.operationalLayers && (this.map.itemInfo
          .itemData.operationalLayers.length > 0)) {
        // if the task URL is valid
        this.url = this.txtURL.value;
        requestArgs = {
          url: this.url,
          content: {
            f: "json"
          },
          handleAs: "json",
          callbackParamName: "callback",
          timeout: 20000
        };
        esriRequest(requestArgs).then(lang.hitch(this, function (
          response) {
          // if response returned from the queried request
          if (response.hasOwnProperty("name")) {
            // if name value exist in response object
            if (response.name !== null) {
              gpTaskParameters = response.parameters;
              // if gpTaskParameters array is not null
              if (gpTaskParameters) {
                this._validateGpTaskResponseParameters(
                  gpTaskParameters);
              }
            }
          } else {
            this._refreshConfigContainer();
            this.loading.hide();
          }
        }), lang.hitch(this, function () {
          this._errorMessage(this.nls.validationErrorMessage.UnableToLoadGeoprocessError);
          this._refreshConfigContainer();
          this.loading.hide();
        }));
      } else {
        this.loading.hide();
        this._errorMessage(this.nls.validationErrorMessage.webMapError);
      }
    },

    /**
     * This function Validates the gp task response parameters
     * @param{object} gpTaskParameters gp service response object
     * @memberOf widgets/isolation-trace/settings/settings.js
     */
    _validateGpTaskResponseParameters: function (gpTaskParameters) {
      var i, recordSetValCheckFlag = true,
        inputParametersArr = [],
        inputGPParamFlag = true,
        errMsg;
      // loop for checking gptask type is GPFeatureRecordSetLayer or not
      for (i = 0; i < gpTaskParameters.length; i++) {
        // if gp task is not GPFeatureRecordSetLayer then flag to false
        //if (gpTaskParameters[i].dataType !==
        //  "GPFeatureRecordSetLayer") {
        //  recordSetValCheckFlag = false;
        //}
        // if gp task parameter type is of input type
        if (gpTaskParameters[i].direction ===
          "esriGPParameterDirectionInput" &&
          gpTaskParameters[i].dataType ===
          "GPFeatureRecordSetLayer") {
          inputParametersArr.push(gpTaskParameters[i]);
        }
      }
      // if number of input parameters is less than 1 or greater than 3 then set flag to false
      if (inputParametersArr.length < 1 || inputParametersArr.length >
        3) {
        inputGPParamFlag = false;
      }
      // if all the gp task is having type "GPFeatureRecordSetLayer"
      if (recordSetValCheckFlag && inputGPParamFlag) {
        this.validConfig = true;
        this._showTaskDetails(gpTaskParameters);
        this.loading.hide();
      } else {
        this._refreshConfigContainer();
        this.loading.hide();
        // if the gp task does not having type "GPFeatureRecordSetLayer"
        if (!recordSetValCheckFlag) {
          errMsg = this.nls.GPFeatureRecordSetLayerERR;
        } else if (!inputGPParamFlag) {
          // if number of input parameters is less than 1 or greater than 3 then show error message
          errMsg = this.nls.invalidInputParameters;
        } else if (!recordSetValCheckFlag && !inputGPParamFlag) {
          // if the gp task does not having type "GPFeatureRecordSetLayer"
          //neither input parameters is less than 0 and greater than 3 then
          errMsg = this.nls.inValidGPService;
        }
        this.txtURL.set('value', "");
        this.url = "";
        this._errorMessage(errMsg);
      }
    },

    /**
     * This function used for refresh the task container every time new request executed
     * @memberOf widgets/isolation-trace/settings/settings.js
     */
    _refreshConfigContainer: function () {
      domConstruct.empty(this.othersData);
      domClass.add(this.mainContainer, "esriCTHidden");
    },

    /**
     * This function used for loading indicator
     * @memberOf widgets/isolation-trace/settings/settings.js
     */
    _initLoading: function () {
      this.loading = new LoadingIndicator({
        hidden: true
      });
      this.loading.placeAt(this.domNode);
      this.loading.startup();
    },

    /**
     * This function destroy widget if created
     * @param{object} div
     * @memberOf widgets/isolation-trace/settings/settings.js
     */
    _destroyWidget: function (div) {
      var widgets = registry.findWidgets(div);
      domConstruct.empty(div);
      // Looping for each widget and destroying the widget
      array.forEach(widgets, function (w) {
        w.destroyRecursive(true);
      });
    },

    /**
     * This function is called to show task details.
     * @param{array} gpTaskParameters
     * @memberOf widgets/isolation-trace/settings/settings.js
     */
    _showTaskDetails: function (gpTaskParameters) {
      var i;
      domClass.remove(this.mainContainer, "esriCTHidden");

      // if geo-processing input/output parameters exist
      if (gpTaskParameters) {
        this.inputParametersArray = [];
        this.outputParametersArray = [];
        this.outputStrings = [];
        // loop for creating input and output parameters array
        for (i = 0; i < gpTaskParameters.length; i++) {
          if (gpTaskParameters[i].direction ===
            "esriGPParameterDirectionInput" &&
            gpTaskParameters[i].dataType ===
            "GPFeatureRecordSetLayer") {
            this.inputParametersArray.push(gpTaskParameters[i]);
          } else if (gpTaskParameters[i].direction ===
            "esriGPParameterDirectionOutput" &&
            gpTaskParameters[i].dataType ===
            "GPFeatureRecordSetLayer") {
            this.outputParametersArray.push(gpTaskParameters[i]);
          } else if (gpTaskParameters[i].direction ===
            "esriGPParameterDirectionOutput" &&
            gpTaskParameters[i].dataType ===
            "GPString") {
            this.outputStrings.push(gpTaskParameters[i]);
          }
        }
      }
      if (!this.tab) {
        this._initTabs();
        this._createProjectSettings();
      } else {
        this._projectSettingInstance.outputParametersArray = this.outputParametersArray;
        this._projectSettingInstance.populateOutParams();
      }
      // if output parameter array is not null
      if (this.outputParametersArray && this.outputParametersArray.length >
        0) {
        this._sortOutputParam();
      }

      // output parameters array is greater than zero
      if (this.inputParametersArray && this.inputParametersArray.length >
        0) {
        // creates the input task parameters panel
        this._createInputTaskParameters();
      }
      // output parameters array is greater than zero
      if (this.outputParametersArray && this.outputParametersArray.length >
        0) {
        // creates the output task parameters panel
        this._createOutputTaskParameters();
      }
      // creates the Others task parameters panel
      this._createOthersTaskParameters();

      //Create InputOutput settings
      var inputOutputSettingsParams = {
        "map": this.map,
        "nls": this.nls,
        "config": this.config,
        "inputConfig": this.inputSettingArray,
        "inputDataTypes": this.inputDataTypes,
        "outputConfig": this.outputSetingArray,
        "projectSettings": this.config.projectSettings
      };
      domConstruct.empty(this.inputOutputSettingsNode);
      this._inputOutputSettings = new InputOutputSettings(inputOutputSettingsParams,
        domConstruct.create("div", {}, this.inputOutputSettingsNode));

      // output parameters array is greater than zero
      if (this.outputParametersArray && this.outputParametersArray.length > 0) {
        // creates summary tab
        this._createSummaryTextSetting();
      }
    },

    /**
     * This function is used to create summary expression UI
     * @memberOf widgets/NetworkTrace/settings/settings
     **/
    _createSummaryTextSetting: function () {
      this._displaySummaryExpressionBuilder();
      this._getInputPanelData();
    },

    /**
     * This function is used to display summary expression page
     * @memberOf widgets/NetworkTrace/settings/settings
     **/
    _displaySummaryExpressionBuilder: function () {
      var summarySettingInstance, param;
      domConstruct.empty(this.summaryTextData);
      param = {
        "nls": this.nls,
        "config": this.config,
        "inputParametersArray": this.inputParametersArray,
        "outputParametersArray": this.outputParametersArray,
        "_inputOutputSettings": this._inputOutputSettings
      };
      this._summarySettingObjArr = [];
      summarySettingInstance = new SummarySetting(param, domConstruct
        .create("div", {}, this.summaryTextData));
      this._summarySettingObjArr.push(summarySettingInstance);
    },

    /**
     * This function is used to fetch data for input panel
     * @memberOf widgets/NetworkTrace/settings/settings
     **/
    _getInputPanelData: function () {
      if (this._summarySettingObjArr) {
        array.forEach(this._summarySettingObjArr, lang.hitch(this,
          function (widgetNode) {
            if (widgetNode) {
              widgetNode.displayInputOutputParameters();
            }
          }));
      }
    },

    /**
     * This function is called Sort the output parameters in polygon,
     * polyline and point type sequence respectively
     * @memberOf widgets/isolation-trace/settings/settings.js
     */
    _sortOutputParam: function () {
      var i, j;
      this.tempOutputParameters = [];
      if (this.config && this.config.geoprocessing && this.config.geoprocessing
        .outputs && this.config.geoprocessing.outputs.length > 0) {
        for (i = 0; i < this.outputParametersArray.length; i++) {
          for (j = 0; j < this.config.geoprocessing.outputs.length; j++) {
            if (this.outputParametersArray[i].name === this.config.geoprocessing
              .outputs[j].paramName) {
              this.tempOutputParameters.push(this.config.geoprocessing
                .outputs[j]);
            }
          }
        }
        this.config.geoprocessing.outputs = [];
        this.config.geoprocessing.outputs = this.tempOutputParameters;
      }
    },

    /**
     * This function creates input task parameters panel and data container
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _createInputTaskParameters: function () {
      var j, inputConfig;
      this.inputSettingArray = [];
      // if input parameters array length is greater than zero
      if (this.inputParametersArray.length >= 0) {
        // loop for populating input data in input fields and also creating additional input fields dynamically
        for (j = 0; j < this.inputParametersArray.length; j++) {
          // if input parameterType is required field then reflect Required as a true otherwise false
          if (this.inputParametersArray[j].parameterType ===
            "esriGPParameterTypeRequired") {
            this.inputParametersArray[j].isInputRequired = "True";
          } else {
            this.inputParametersArray[j].isInputRequired = "False";
          }
          inputConfig = null;
          // if config object is not null
          if (this.config && this.config.geoprocessing && this.config
            .geoprocessing.inputs[j]) {
            inputConfig = this.config.geoprocessing.inputs[j];
          }
          //if not prev input config then add only flag, barriers and skip input types
          if (!inputConfig && this.inputParametersArray[j].name) {
            inputConfig = {
              "paramName": this.inputParametersArray[j].name,
              "displayName": this.inputParametersArray[j].displayName,
              "toolTip": this.inputParametersArray[j].description,
              "type": this.inputDataTypes[this.inputParametersArray[j].name.toLowerCase()]
            };
          }
          if (inputConfig) {
            this.inputSettingArray.push(inputConfig);
          }
        }
      }
    },

    /**
     * This function creates output task panel and data container
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _createOutputTaskParameters: function () {
      this.outputSetingArray = [];
      // if output parameters array length is greater than zero
      if (this.outputParametersArray.length >= 0) {
        this.outputSettingArray = [];
        // loop for populating output data in output fields and also creating additional output fields dynamically
        array.forEach(this.outputParametersArray, lang.hitch(this,
          function (outputParameters, k) {
            var outputConfig = null;
            // if input parameterType is required field then reflect Required as a true otherwise false
            if (outputParameters.parameterType ===
              "esriGPParameterTypeRequired") {
              outputParameters.isOutputRequired = "True";
            } else {
              outputParameters.isOutputRequired = "False";
            }
            // if config object is not null
            if (this.config && this.config.geoprocessing && this.config
              .geoprocessing.outputs[k]) {
              outputConfig = this.config.geoprocessing.outputs[k];
            }
            if (!outputConfig) {
              outputConfig = {
                "visibility": true,
                "paramName": outputParameters.name,
                "type": "Result",
                "panelText": outputParameters.displayName,
                "toolTip": outputParameters.description,
                "displayName": outputParameters.displayName,
                "displayText": this.nls.inputOutputTab.enterDisplayText,
                "MinScale": 0,
                "MaxScale": 0,
                "exportToCSV": false,
                "saveToLayer": ""
              };
            }
            if (outputConfig && !outputConfig.hasOwnProperty("displayName")) {
              outputConfig.displayName = outputParameters.displayName;
            }
            //add skipable info from bypassDetails
            if (outputConfig && outputConfig.bypassDetails) {
              outputConfig.skipable = outputConfig.bypassDetails.skipable;
            } else {
              outputConfig.skipable = false;
            }
            //add visibility for backward compatiblity
            if (outputConfig && !outputConfig.hasOwnProperty('visibility')) {
              outputConfig.visibility = true;
            }
            outputConfig.data = outputParameters;
            this.outputSetingArray.push(outputConfig);
          }));
      }
    },

    /**
     * This function creates output task parameters panel and data container
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _createOthersTaskParameters: function () {
      var othersSettingInstance, param, displayTextForRunButton,
        autoZoomAfterTraceCheckedState;
      this.othersSettingObj = [];
      domConstruct.empty(this.othersData);
      displayTextForRunButton = null;
      if (this.config && this.config.displayTextForRunButton) {
        displayTextForRunButton = this.config.displayTextForRunButton;
      } else {
        displayTextForRunButton = this.nls.generalSettings.displayTextforButtonDefaultValue;
      }
      autoZoomAfterTraceCheckedState = false;
      if (this.config && this.config.autoZoomAfterTrace) {
        autoZoomAfterTraceCheckedState = this.config.autoZoomAfterTrace;
      }
      param = {
        "nls": this.nls,
        "folderUrl": this.folderUrl,
        "displayTextForRunButton": displayTextForRunButton,
        "autoZoomAfterTraceCheckedState": autoZoomAfterTraceCheckedState
      };
      othersSettingInstance = new OthersSetting(param, domConstruct.create(
        "div", {}, this.othersData));
      this.othersSettingObj.push(othersSettingInstance);
    },

    /**
     * This function creates skippables fields
     * @return {object} returns the url validator object
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _urlValidator: function (value) {
      var strReg, regexValue, regexValueForTest, regexValueForService,
        finalValue;
      // Checking for regex expression for url validation
      strReg = '^' + regexp.url({
        allowNamed: true,
        allLocal: false
      });
      // Checking for regex value
      regexValue = new RegExp(strReg, 'g');
      regexValueForTest = regexValue.test(value);
      regexValueForService = /\/rest\/services/gi;
      finalValue = regexValueForService.test(value);
      return regexValueForTest && finalValue;
    },

    /**
     * This function creates the Input Parameters in config
     * @return {object} returns the config ouject
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _getInputConfigParameters: function () {
      this.config.geoprocessing.inputs = [];
      this.config.geoprocessing.inputs.length = 0;
      // if input param object created
      if (this._inputOutputSettings) {
        this.config.geoprocessing.inputs = this._inputOutputSettings.getInputSettings();
      }
    },

    _getSummaryExpressionConfigParameters: function () {
      if (this._summarySettingObjArr) {
        array.forEach(this._summarySettingObjArr, lang.hitch(this,
          function (widgetNode) {
            if (widgetNode) {
              this.config.summaryExpression = widgetNode.getSummaryExpressionConfigData();
            }
          }));
      }
    },

    /**
     * This function creates the output Parameters in config file
     * return {object} returns the config object
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _getOutputConfigParameters: function () {
      var i, j, k, l;
      this.polygonOutputParameters = [];
      this.polylineOutputParameters = [];
      this.pointOutputParameters = [];
      if (this.config && this.config.geoprocessing && this.config.geoprocessing
        .outputs) {
        this.config.geoprocessing.outputs = [];

        // if input param object created
        if (this._inputOutputSettings) {
          this.config.geoprocessing.outputs = this._inputOutputSettings.getOutputSettings();
        }
        // if config object is not null and output parameter length is greater than zero
        if (this.config && this.config.geoprocessing && this.config.geoprocessing
          .outputs && this.config.geoprocessing.outputs.length > 0) {
          // loop for traverse output array and pushing all the output object in three different array's by there geometry
          for (i = 0; i < this.config.geoprocessing.outputs.length; i++) {
            // the output array parameter same as config output parameter
            if (this.outputParametersArray[i].parameter === this.config
              .geoprocessing.outputs[i].param) {
              // if the output type is esriGeometryPolygon or esriGeometryPolyline or esriGeometryPoint
              if (this.outputParametersArray[i].defaultValue.geometryType ===
                "esriGeometryPolygon") {
                this.polygonOutputParameters.push(this.config.geoprocessing
                  .outputs[i]);
              } else if (this.outputParametersArray[i].defaultValue.geometryType ===
                "esriGeometryPolyline") {
                this.polylineOutputParameters.push(this.config.geoprocessing
                  .outputs[i]);
              } else if (this.outputParametersArray[i].defaultValue.geometryType ===
                "esriGeometryPoint") {
                this.pointOutputParameters.push(this.config.geoprocessing
                  .outputs[i]);
              }
            }
          }

          this.config.geoprocessing.outputs = [];
          this.tempPolygonOutputParameters = [];
          // if polygon type parameter array is not null
          if (this.polygonOutputParameters && this.polygonOutputParameters
            .length > 0) {

            for (j = 0; j < this.polygonOutputParameters.length; j++) {
              this.config.geoprocessing.outputs.push(this.polygonOutputParameters[
                j]);
            }
          }
          // if polyline type parameter array is not null
          if (this.polylineOutputParameters && this.polylineOutputParameters
            .length > 0) {
            for (k = 0; k < this.polylineOutputParameters.length; k++) {
              this.config.geoprocessing.outputs.push(this.polylineOutputParameters[
                k]);
            }
          }
          // if point type parameter array is not null
          if (this.pointOutputParameters && this.pointOutputParameters
            .length > 0) {
            for (l = 0; l < this.pointOutputParameters.length; l++) {
              this.config.geoprocessing.outputs.push(this.pointOutputParameters[
                l]);
            }
          }
        }
      }
    },

    /**
     * This function creates the other  parameters in config file
     * @return {object} returns highlighter details object
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _getOtherConfigParameters: function () {
      var othersParam;
      // if Others setting Obj is created
      if (this.othersSettingObj) {
        array.forEach(this.othersSettingObj, lang.hitch(this,
          function (widgetNode) {
            //if widget obj found for Others config details for highlighter image
            if (widgetNode) {
              othersParam = widgetNode.getOthersForm();
              this.config.displayTextForRunButton = othersParam.displayTextForRunButton;
              //delete othersParam.displayTextforRunButton;
              this.config.autoZoomAfterTrace = othersParam.autoZoomAfterTrace;
            }
          }));
      }
    },

    /**
     * This function gets and create config data in config file.
     * @return {object} Object of config
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    getConfig: function () {
      var inputArray = [],
        outputArray = [],
        geoprocessingObject = {},
        validateProjectSettings = false,
        validateInputTask = false,
        validateOthersTask = false,
        validateSummaryExpression = false;
      // Setting geoprocessing object
      geoprocessingObject = {
        "url": "",
        "inputs": inputArray,
        "outputs": outputArray
      };
      // if the requested gp task is valid then only
      if (this.validConfig) {
        // Setting config object
        validateProjectSettings = this._validateProjectSettings();
        validateInputTask = this._validateInputTaskParameters();
        validateSummaryExpression = this._validateSummaryExpressionParameter();
        validateOthersTask = this._validateOthersTaskParameters();
        // validating the configuration inputs
        if (!this.url || this.url === "") {
          this._errorMessage(this.nls.inValidGPService);
        } else if (validateProjectSettings.returnFlag) {
          this._errorMessage(validateProjectSettings.returnErr);
          validateInputTask = false;
          this.tab.selectTab(this.nls.projectSetting.title);
        } else if (validateInputTask.returnFlag) {
          this._errorMessage(validateInputTask.returnErr);
          validateInputTask = false;
          this.tab.selectTab(this.nls.inputOutputTab.title);
        } else if (validateSummaryExpression.returnFlag) {
          this._errorMessage(validateSummaryExpression.returnErr);
          validateInputTask = false;
          this.tab.selectTab(this.nls.summaryTab.title);
        } else if (validateOthersTask.returnFlag) {
          this._errorMessage(validateOthersTask.returnErr);
          validateInputTask = false;
          this.tab.selectTab(this.nls.generalSettings.title);
        }
        if (validateInputTask) {
          // Setting config object
          this.config = {
            "geoprocessing": geoprocessingObject
          };
          // setting url in config object
          this.config.geoprocessing.url = this.url;
          //get projectsettings
          if (this._projectSettingInstance) {
            this.config.projectSettings = this._projectSettingInstance.getProjectSettings();
          }
          // Get config for input parameters
          this._getInputConfigParameters();
          // Get config for Output parameters
          this._getOutputConfigParameters();
          // Get config for others parameter
          this._getOtherConfigParameters();
          // Get config for summary expression builder
          this._getSummaryExpressionConfigParameters();
        } else {
          return false;
        }
      } else {
        this._errorMessage(this.nls.inValidGPService);
        return false;
      }
      return this.config;
    },

    _validateSummaryExpressionParameter: function () {
      var returnObj = {
        returnErr: "",
        returnFlag: false
      };
      if (this._summarySettingObjArr) {
        array.forEach(this._summarySettingObjArr, lang.hitch(this,
          function (widgetNode) {
            if (widgetNode) {
              returnObj = widgetNode.validateExpressionOnOkClick();
            }
          }));
      }
      return returnObj;
    },

    /**
     * This function validates the Other parameters
     * @param {return} flag value for validation
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _validateOthersTaskParameters: function () {
      var returnObj = {
          returnErr: "",
          returnFlag: false
        },
        othersParam;
      // if Others setting Obj is created
      if (this.othersSettingObj) {
        array.forEach(this.othersSettingObj, lang.hitch(this,
          function (otherData) {
            //if widget obj found for Others config details for highlighter image
            if (otherData) {
              othersParam = otherData.getOthersForm();
              //otherData.imageChooser.imageData;
              if (othersParam && othersParam.displayTextForRunButton !== null) {
                if (othersParam.displayTextForRunButton === "" ||
                  othersParam.displayTextForRunButton === null ||
                  othersParam.displayTextForRunButton.trim() ===
                  "") {
                  returnObj.returnErr = this.nls.validationErrorMessage
                    .displayTextForButtonError;
                  returnObj.returnFlag = true;
                }
              }
            }
          }));
      }
      return returnObj;
    },

    /**
     * This function validates the project settings
     * @param {return} flag value for validation
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _validateProjectSettings: function () {
      var projectSettings, validInputs = 0,
        errorMessage, returnObj;
      returnObj = {
        returnErr: "",
        returnFlag: false
      };
      // show error with the required project seetings which is not configured
      if (this._projectSettingInstance) {
        projectSettings = this._projectSettingInstance.getProjectSettings();
        //check for point layer
        if (projectSettings.pointLayerId) {
          validInputs++;
        } else {
          errorMessage = dojoString.substitute(
            this.nls.validationErrorMessage.invalidProjectSettings, {
              "projectSetting": this.nls.projectSetting.projectPointLayer
            });
        }
        //chec for output param name
        if (projectSettings.outputParamName) {
          validInputs++;
        } else {
          errorMessage = dojoString.substitute(
            this.nls.validationErrorMessage.invalidProjectSettings, {
              "projectSetting": this.nls.projectSetting.outputParameterName
            });
        }
        //check for polygon layer
        if (projectSettings.polygonLayerId) {
          validInputs++;
        } else {
          errorMessage = dojoString.substitute(
            this.nls.validationErrorMessage.invalidProjectSettings, {
              "projectSetting": this.nls.projectSetting.projectPolygonLayer
            });
        }
        // if any of the projet setings have value then all must have values
        if (validInputs > 0 && validInputs !== 3) {
          returnObj.returnErr = errorMessage;
          returnObj.returnFlag = true;
        }
      }
      return returnObj;
    },

    /**
     * This function validates the input parameters
     * @param {return} flag value for validation
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _validateInputTaskParameters: function () {
      var returnObj = {
          returnErr: "",
          returnFlag: false
        },
        flagVal = 0,
        inputTypeData, barrierVal = 0,
        skipVal = 0;
      // if input parameters is created in Dom
      if (this._inputOutputSettings) {
        flagVal = 0;
        barrierVal = 0;
        skipVal = 0;
        // loop for parsing all the input parameters for valid set of data
        array.forEach(this._inputOutputSettings.getInputSettings(), lang.hitch(this,
          function (inputConfig) {
            if (inputConfig && inputConfig.type) {
              inputTypeData = inputConfig.type;
              // if input type is flag then count the number of flag type input
              if (inputTypeData === this.inputDataTypes.flags) {
                flagVal++;
              } else if (inputTypeData === this.inputDataTypes.barriers) {
                // if input type is flag then count the number of Barrier type input
                barrierVal++;
              } else if (inputTypeData === this.inputDataTypes.skip_locations) {
                // if input type is flag then count the number of Skip type input
                skipVal++;
              }
            }
          }));
      }
      // if flag type input is greater than 1 and less than 1
      if (flagVal > 1) {
        returnObj.returnErr = this.nls.validationErrorMessage.inputTypeFlagGreaterThanError;
        returnObj.returnFlag = true;
      } else if (flagVal < 1) {
        returnObj.returnErr = this.nls.validationErrorMessage.inputTypeFlagLessThanError;
        returnObj.returnFlag = true;
      } else if (barrierVal > 1) {
        // if barrier type input is greater than 1
        returnObj.returnErr = this.nls.validationErrorMessage.inputTypeBarrierErr;
        returnObj.returnFlag = true;
      } else if (skipVal > 1) {
        // if skip type input is greater than 1
        returnObj.returnErr = this.nls.validationErrorMessage.inputTypeSkipErr;
        returnObj.returnFlag = true;
      }
      return returnObj;
    },

    /**
     * This function validates the Summary text of output parameters
     * @param {return} flag value for validation
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _validateSummaryText: function (summaryTextVal, skippableChecked) {
      var summaryString, i, j, summaryArray = [],
        validArray = [],
        validFlag = false,
        firstPlace, secondPlace, countString, skipCountString;
      countString = "Count";
      skipCountString = "SkipCount";
      summaryTextVal = summaryTextVal.trim();
      firstPlace = summaryTextVal.indexOf("{");
      secondPlace = summaryTextVal.indexOf("}");
      // summary text found with the braces
      if (firstPlace !== -1 && secondPlace !== -1) {
        summaryString = summaryTextVal.split("{");
      } else {
        summaryString = summaryTextVal;
      }
      // if spited array is not null
      if (summaryString && summaryString.length > 0) {
        // loop for spliting the array by "}" string
        for (i = 0; i < summaryString.length; i++) {
          // if value in array is not null
          if (summaryString[i] !== "" && (summaryString[i].indexOf(
              "}") !== -1)) {
            summaryArray[i] = summaryString[i].split("}");
            validArray.push(summaryArray[i][0].toUpperCase());
          }
        }
        // loop for traversing array and checking if summary text contains count and skip count string in defined manner
        for (j = 0; j < validArray.length; j++) {
          if (skippableChecked) {
            // if array index having  "Count" or "SkipCount" string
            if ((validArray[j] === countString.toUpperCase() ||
                validArray[j] === skipCountString.toUpperCase())) {
              //if () {
              validFlag = false;
            } else {
              validFlag = true;
              break;
            }
          } else {
            // if array index having  "Count" string
            if (validArray[j] === countString.toUpperCase()) {
              validFlag = false;
            } else {
              validFlag = true;
              break;
            }
          }
        }
      } else {
        validFlag = true;
      }
      return validFlag;
    },

    /**
     * This function validates the Display text of output parameters
     * @param {return} flag value for validation
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _validateDisplayText: function (displayTextVal, validDisplayTextArr) {
      var displayString, i, j, k, validArray = [],
        validFlag = false,
        firstPlace, secondPlace, displayArray = [],
        tempValidDisplayTextArr;
      displayTextVal = displayTextVal.trim();
      firstPlace = displayTextVal.indexOf("{");
      secondPlace = displayTextVal.indexOf("}");
      // display text found with the braces
      if (firstPlace !== -1 && secondPlace !== -1) {
        displayString = displayTextVal.split("{");
      } else {
        displayString = displayTextVal;
      }
      // if spited array is not null
      if (displayString && displayString.length > 0) {
        // loop for spliting the array by "}" string
        for (i = 0; i < displayString.length; i++) {
          // if value in array is not null
          if (displayString[i] !== "" && (displayString[i].indexOf(
              "}") !== -1)) {
            displayArray[i] = displayString[i].split("}");
            validArray.push(displayArray[i][0].toUpperCase());
          }
        }
        tempValidDisplayTextArr = [];
        // loop for traversing array and changing all elements in array to uppercase
        for (k = 0; k < validDisplayTextArr.length; k++) {
          tempValidDisplayTextArr[k] = validDisplayTextArr[k].toUpperCase();
        }
        validFlag = false;
        // loop for traversing array and checking if display text contains valid data or not
        for (j = 0; j < validArray.length; j++) {
          // if array index having valid string
          if (tempValidDisplayTextArr.indexOf(validArray[j]) === -1) {
            validFlag = true;
            break;
          }
        }
      } else {
        validFlag = true;
      }
      return validFlag;
    },

    /**
     * This function display error message in jimu alert box.
     * @param {string} err gives the error message
     * @memberOf widgets/isolation-trace/settings/settings
     **/
    _errorMessage: function (err) {
      var errorMessage = new Message({
        message: err
      });
      errorMessage.message = err;
    }
  });
});