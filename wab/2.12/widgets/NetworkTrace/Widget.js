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
/*global define,dijit */
define([
  "dojo/_base/declare",
  "jimu/BaseWidget",
  "dojo/on",
  "dojo/_base/lang",
  "dojo/window",
  "esri/graphic",
  "esri/geometry/Point",
  "esri/tasks/Geoprocessor",
  "dojo/_base/array",
  "esri/layers/GraphicsLayer",
  "esri/renderers/SimpleRenderer",
  "esri/toolbars/draw",
  "dojo/dom-class",
  "esri/tasks/FeatureSet",
  "dojo/dom-construct",
  "dojox/timing",
  "dojo/query",
  "dojo/promise/all",
  "dojo/Deferred",
  "esri/InfoTemplate",
  "dijit/registry",
  "dojo/date/locale",
  "dojo/dom-attr",
  "dojo/string",
  "jimu/PanelManager",
  "dojo/dom-style",
  "esri/symbols/jsonUtils",
  "jimu/dijit/Message",
  "jimu/dijit/CheckBox",
  "esri/dijit/AttributeInspector",
  "esri/geometry/geometryEngine",
  "esri/layers/FeatureLayer",
  "esri/request",
  "esri/tasks/query",
  "jimu/dijit/TabContainer",
  "dojo/dom",
  "dojo/has",
  'jimu/utils',
  'esri/urlUtils',
  'jimu/exportUtils',
  'jimu/CSVUtils',
  "dijit/form/Select",
  "dojo/dom-style",
  "dijit/form/ValidationTextBox",
  "jimu/dijit/Popup",
  "esri/tasks/QueryTask",
  'jimu/LayerInfos/LayerInfos',
  "esri/geometry/Polygon",
  'esri/graphicsUtils',
  'esri/lang',
  './highlightSymbolUtils',
  "dojo/sniff"
], function (
  declare,
  BaseWidget,
  on,
  lang,
  dojoWindowClass,
  Graphic,
  Point,
  Geoprocessor,
  array,
  GraphicsLayer,
  SimpleRenderer,
  Draw,
  domClass,
  FeatureSet,
  domConstruct,
  Timing,
  query,
  all,
  Deferred,
  InfoTemplate,
  registry,
  dateLocale,
  domAttr,
  string,
  PanelManager,
  style,
  symbolJsonUtils,
  JimuMessage,
  Checkbox,
  AttributeInspector,
  geometryEngine,
  FeatureLayer,
  esriRequest,
  Query,
  JimuTabContainer,
  dom,
  has,
  utils,
  urlUtils,
  exportUtils,
  CSVUtils,
  Select,
  domStyle,
  ValidationTextBox,
  Popup,
  QueryTask,
  LayerInfos,
  Polygon,
  graphicsUtils,
  esriLang,
  highlightSymbolUtils
) {
  return declare([BaseWidget], {
    baseClass: 'jimu-widget-NetworkTrace',

    viewPortSize: null,
    panelManager: null,
    wManager: null,
    flagBtnClicked: false,
    barrierBtnClicked: false,
    gp: null,
    gpInputDetails: null,
    toolbar: null,
    overExtent: null,
    resultsCnt: null,
    resultLayers: null,
    animatedLayer: null,
    computedPanelStyle: null,
    mainContainer: null,
    tooltipDialog: null,
    IsIE: null,
    IsSafari: null,
    IsOpera: null,
    errorLayerArray: [],
    savedFeatureObjectId: null,
    _flagID: null, // flag ObjId counter
    _barrierID: null, //block ObjId counter
    _inputFlag: null, //input Loc Label counter
    _inputBlock: null, //block Loc Label counter
    _flagCount: null, // input feature count
    _barrierCount: null, //block feature count
    _tabContainer: null, // to store object of tab container
    _outputResultCount: 0, // to track count of output service execution
    _outputResultArr: [], // to store output response
    _inputSkip: 0, // to track the incremental count of skip feature
    _skipLocationCount: 0, // to track skip count only for skip dialog
    _skippedLocations: {}, // to store skip graphics
    _skipAllLocationButtonClicked: false, // to track whether skip all location button is clicked
    _isSaveAndExportHidden: false,
    _exportToCSVLayerArray: [],
    _layerInfosObj: false,
    _projectLayerInfo: null,
    _projectAttributeGraphic: null,
    _isAttributeChanged: false,
    _loadProjectDropdown: null, // to store object of project dropdown
    _flagGraphicsLayer: null,
    _barrierGraphicsLayer: null,
    _skipLocationGraphicsLayer: null,
    _allProjectLoadedInputs: [],
    _loadProjectDropdownEvtHandle: null,
    _fetchedFeaturesDetails: null,
    _gpServiceOutputParameter: null,
    _loadProjectDetailsObj: {},
    _saveAsNewProject: false,
    _currentSelectedProjectGuid: null,
    _pointLayerFields: {},
    _polygonLayerFields: {},
    _isWidgetLoadedInProjectMode: false,
    _updateExistingProject: false,
    _gpServiceOutputParameterObj: {},
    // to store the top node of the widget, which will be used as a scope to the query operation
    _widgetTopNode: null,
    // to store the cloned copy of project polygon layer
    _clonedProjectPolygonLayerObject: null,
    // to store the feature that is displayed in attribute inspector created by cloned feature layer.
    // It also stores any modification done to the feature.
    _currentFeatureDetails: null,
    _aiConnects: [],
    _selection: [],
    _toolTips: [],
    _isRunButtonClicked: false,
    // this._originalTemplateAttributes - used to store the original cloned template info of the layer.
    // Any updation in the feature, updates the template info of the layer.
    // So, on second execution we receive the data of previous updated value, nor the original one.
    // Hence, for while creating a new project this variable is used which contains original template info data.
    _originalTemplateAttributes: null,
    _isWidgetStartup: null,
    _clickEventHandlerArr: [],
    _lastDefinitionExpression: null,

    /**
     *This is a startup function of a network trace widget.
     **/
    startup: function () {
      this.inherited(arguments);
      this._initializeData();
      this._isWidgetStartup = true;
      this._fetchLastDefinitionExpression();
      // * If you want to read the data that published before your widget loaded, you can call
      // *fetchData* method and get data in *onReceiveData* method.
      this.fetchData();
      if (this._validateConfigParams()) {
        this._getLayerInfos();
      }
    },

    postMixInProperties: function () {
      this.nls = lang.mixin(this.nls, window.jimuNls.common);
    },

    /**
     * This function is used to fetch the top node of the widget.
     * It is fetched so that it could be used as a scope to the dojo query operation
     */
    _fetchWidgetTopNode: function () {
      var widgetFrame, widgetPanelContent, widgetTopNode;
      if (this.domNode.parentNode) {
        widgetFrame = this.domNode.parentNode;
      }
      if (widgetFrame.parentNode) {
        widgetPanelContent = widgetFrame.parentNode;
      }
      if (widgetPanelContent.parentNode) {
        widgetTopNode = widgetPanelContent.parentNode;
      }
      if (widgetTopNode) {
        this._widgetTopNode = widgetTopNode;
      }
    },

    _loadWidget: function () {
      var widgetPanel;
      this._showLoadingIcon(true);
      this._fetchWidgetTopNode();
      this._addMobileStyles();
      this._displayMainScreen();
      this._createLoadProjectDetailsObj();
      this._addLoadProjectDropdown();
      this._initializingJimuTabContainer();
      this._getFieldAliasFromGPService();
      this.IsOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
      this.IsSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
      this.IsIE = !!document.documentMode || false;
      this._clickEventHandlerArr.push(this.own(on.pausable(this.map, "click",
        lang.hitch(this, this._mapClickHandler))));
      this.gp = new Geoprocessor(this.config.geoprocessing.url);
      on(this.gp, "error", lang.hitch(this, this._onSubmitJobError));
      on(this.gp, "job-complete", lang.hitch(this, this._onSubmitJobComplete));
      this.gp.setOutSpatialReference(this.map.spatialReference);
      this._setDisplayTextForRunButton();
      this._createResultPanels();
      this._createGraphic();
      this._createHighlightingGraphicLayer();
      this.viewPortSize = dojoWindowClass.getBox();
      this.panelManager = PanelManager.getInstance();
      this._enhanceTabThemeStyle();
      this._enhanceDartThemeStyle();
      this._setTheme();
      widgetPanel = this.domNode;
      if (widgetPanel) {
        this._reStyleWidgetContainer(widgetPanel);
        style.set(widgetPanel, {
          "z-index": 101,
          "width": "100%",
          "height": "100%"
        });
      }
    },

    /**
     * This function is used to change the padding from the widget container
     * which was added by the jimu widget.
     */
    _reStyleWidgetContainer: function (widgetPanel) {
      var widgetContainer = widgetPanel.parentNode;
      style.set(widgetContainer, {
        "padding": "5px"
      });
    },

    /**
     * This function is to initialize the data to its default value
     */
    _initializeData: function () {
      this.viewPortSize = null;
      this.panelManager = null;
      this.wManager = null;
      this.flagBtnClicked = false;
      this.barrierBtnClicked = false;
      this.gp = null;
      this.gpInputDetails = null;
      this.toolbar = null;
      this.overExtent = null;
      this.resultsCnt = null;
      this.resultLayers = null;
      this.animatedLayer = null;
      this.computedPanelStyle = null;
      this.mainContainer = null;
      this.tooltipDialog = null;
      this.IsIE = null;
      this.IsSafari = null;
      this.IsOpera = null;
      this.errorLayerArray = [];
      this.savedFeatureObjectId = null;
      this._flagID = null;
      this._barrierID = null;
      this._inputFlag = null;
      this._inputBlock = null;
      this._flagCount = null;
      this._barrierCount = null;
      this._tabContainer = null;
      this._outputResultCount = 0;
      this._outputResultArr = [];
      this._inputSkip = 0;
      this._skipLocationCount = 0;
      this._skippedLocations = {};
      this._skipAllLocationButtonClicked = false;
      this._exportToCSVLayerArray = [];
      this._projectLayerInfo = null;
      this._projectAttributeGraphic = null;
      this._isAttributeChanged = false;
      this._loadProjectDropdown = null;
      this._flagGraphicsLayer = null;
      this._barrierGraphicsLayer = null;
      this._skipLocationGraphicsLayer = null;
      this._allProjectLoadedInputs = [];
      this._loadProjectDropdownEvtHandle = null;
      this._fetchedFeaturesDetails = null;
      this._gpServiceOutputParameter = null;
      this._loadProjectDetailsObj = {};
      this._saveAsNewProject = false;
      this._currentSelectedProjectGuid = null;
      this._pointLayerFields = {};
      this._polygonLayerFields = {};
      this._isWidgetLoadedInProjectMode = false;
      this._updateExistingProject = false;
      this._gpServiceOutputParameterObj = {};
      this._widgetTopNode = null;
      this._clonedProjectPolygonLayerObject = null;
      this._currentFeatureDetails = null;
      this._aiConnects = [];
      this._selection = [];
      this._toolTips = [];
      this._isRunButtonClicked = false;
      this._originalTemplateAttributes = null;
      this._isWidgetStartup = null;
      this._clickEventHandlerArr = [];
      this._lastDefinitionExpression = null;
    },

    /**
     * This function will initialize jimu tab container.
     * @memberOf widgets/ServiceFeasibility/Widget
     **/
    _initializingJimuTabContainer: function () {
      this._tabContainer = new JimuTabContainer({
        "class": "esriCTTabContainer",
        tabs: [{
          title: this.nls.inputTabTitle,
          content: this.inputTabPanel,
          selected: true
        }, {
          title: this.nls.outputTabTitle,
          content: this.outputTab,
          selected: false
        }]
      }, this.tabContainerNetworkTrace);
      this._tabContainer.startup();
      if (this._tabContainer.controlNodes[0]) {
        domClass.add(this._tabContainer.controlNodes[0], "esriCTTabLineHeight");
      }
      if (this._tabContainer.controlNodes[1]) {
        domClass.add(this._tabContainer.controlNodes[1], "esriCTTabLineHeight");
      }
    },
    /*jshint unused:true */
    _setTheme: function () {

      var styleLink;
      if (this.appConfig.theme.name === "DartTheme") {
        utils.loadStyleLink('dartOverrideCSS', this.folderUrl + "/css/dartTheme.css", null);
      } else {
        styleLink = document.getElementById("dartOverrideCSS");
        if (styleLink) {
          styleLink.disabled = true;
        }
      }

    },
    destroy: function () {
      this._clearResults();
      this._removeAllGraphicLayers();
      this.inherited(arguments);
    },

    /**
     * Add back the graphic layers upon opening.
     */
    onOpen: function () {
      this._addGraphicLayersBackToMap();
    },

    /**
     * Clear the results and remove all graphic layers upon closing.
     */
    onClose: function () {
      this._clearResults();
    },

    resize: function () {
      var resetHeightObj;
      resetHeightObj = {};
      resetHeightObj.node = this.inputOutputTabParentContainer;
      resetHeightObj.considerSaveAndExport = true;
      resetHeightObj.considerLoadProject = true;
      this._resetHeight(resetHeightObj);
      resetHeightObj = {};
      resetHeightObj.node = this.inputLocDiv;
      resetHeightObj.considerSaveAndExport = true;
      this._resetHeight(resetHeightObj);
      resetHeightObj = {};
      resetHeightObj.node = this.barrierLocDiv;
      resetHeightObj.considerSaveAndExport = true;
      this._resetHeight(resetHeightObj);
      resetHeightObj = {};
      resetHeightObj.node = this.skipLocDiv;
      resetHeightObj.considerSaveAndExport = true;
      this._resetHeight(resetHeightObj);
      resetHeightObj = {};
      resetHeightObj.node = this.flagBarrierSkipLocationMainPageContainer;
      resetHeightObj.resetFlagBarrierSkipLocationMainPage = true;
      this._resetHeight(resetHeightObj);


      var featuresListParentContainers = query(".esriCTFeaturesListParentContainer", this._widgetTopNode);
      array.forEach(featuresListParentContainers, lang.hitch(this, function (featuresListParentContainer) {
        var resultMainDiv = featuresListParentContainer.parentNode;
        var skipAllLocationButton = query(".esriCTSkipAllLocationParentContainer", resultMainDiv);
        var resetHeightObj;
        resetHeightObj = {};
        resetHeightObj.node = featuresListParentContainer;
        resetHeightObj.considerSaveAndExport = false;
        resetHeightObj.considerLoadProject = false;
        resetHeightObj.considerSkipAll = true;
        resetHeightObj.skipAllButton = skipAllLocationButton;
        this._resetHeight(resetHeightObj);
      }));
    },

    /**
     * Adds all graphic layers back to the map if they already exist.  This allows
     * multiple instances of the network trace widget to be used in the same application.
     *
     * @private
     */
    _addGraphicLayersBackToMap: function () {
      for (var i in this.resultLayers) {
        this.map.addLayer(this.resultLayers[i]);
      }

      if (this.animatedLayer) {
        this.map.addLayer(this.animatedLayer);
      }

      for (var k in this.gpInputDetails) {
        this.map.addLayer(this.gpInputDetails[k]);
      }
    },

    /**
     * This function will set the display text for run button
     **/
    _setDisplayTextForRunButton: function () {
      if (this.config.displayTextForRunButton) {
        this.btnTrace.innerHTML = utils.sanitizeHTML(this.config.displayTextForRunButton);
      } else {
        this.btnTrace.innerHTML = this.nls.defaultValueForRunButton;
      }
    },

    /**
     *This function will validate the widget configuration parameters.
     **/
    _validateConfigParams: function () {
      var isConfigParam;
      //checking whether this.config has primary objects or not.
      if (this.config.hasOwnProperty("geoprocessing")) {
        //checking whether url, inputs and output are present or not.
        if (this.config.geoprocessing.hasOwnProperty("url") && this.config
          .geoprocessing.hasOwnProperty("inputs") && this.config.geoprocessing
          .hasOwnProperty("outputs")) {
          if (this.config.geoprocessing.inputs.length > 0 && this.config
            .geoprocessing.outputs.length > 0 && this.config.geoprocessing
            .url !== "") {
            isConfigParam = true;
          } else {
            this._errorMessage(this.nls.configError);
            isConfigParam = false;
          }
        } else {
          this._errorMessage(this.nls.configError);
          isConfigParam = false;
        }
      } else {
        this._errorMessage(this.nls.configError);
        isConfigParam = false;
      }
      return isConfigParam;
    },

    /**
     *This function will execute when user clicked on flag button.
     **/
    _onFlagButtonClick: function () {
      if (!domClass.contains(this.btnFlag, "traceControlDisabledDiv")) {
        if (!this.flagBtnClicked) {
          this.flagBtnClicked = true;
          domClass.remove(this.btnFlag, "flagbutton");
          domClass.add(this.btnFlag, "flagButtonselected");
          //Checking the toolbar whether it is initialized or not
          if (this.toolbar === null) {
            this.toolbar = new Draw(this.map);
            this.toolbar.activate(Draw.POINT);
          }
          //Checking whether barrier button was clicked or not.
          if (this.barrierBtnClicked) {
            this.barrierBtnClicked = false;
            domClass.remove(this.btnBarrier, "barrierButtonselected");
            domClass.add(this.btnBarrier, "barrierButton");
          }
          this.disableWebMapPopup();
        } else {
          this._disableFlagTool();
        }
      }
    },

    /**
     *This function will execute when user clicked on Barrier Button.
     **/
    _onBarrierButtonClick: function () {
      if (!domClass.contains(this.btnBarrier,
          "traceControlDisabledDiv")) {
        if (!this.barrierBtnClicked) {
          this.barrierBtnClicked = true;
          domClass.remove(this.btnBarrier, "barrierButton");
          domClass.add(this.btnBarrier, "barrierButtonselected");
          //Checking the toolbar whether it is initialized or not
          if (this.toolbar === null) {
            this.toolbar = new Draw(this.map);
            this.toolbar.activate(Draw.POINT);
          }
          //Checking whether flag button was clicked or not.
          if (this.flagBtnClicked) {
            this.flagBtnClicked = false;
            domClass.remove(this.btnFlag, "flagButtonselected");
            domClass.add(this.btnFlag, "flagbutton");
          }
          this.disableWebMapPopup();
        } else {
          this._disableBarrierTool();
        }
      }
    },

    /**
     *This function will enable loading icon
     *@param{boolean} isShowLoadingIcon: Boolean to check whether loading icon should display or not.
     **/
    _showLoadingIcon: function (isShowLoadingIcon) {
      var widgetPanel;
      widgetPanel = query(".jimu-widget-frame.jimu-container", this._widgetTopNode)[0];
      if (!widgetPanel) {
        widgetPanel = query(".jimu-container", this._widgetTopNode)[0];
      }
      if (isShowLoadingIcon) {
        domClass.remove(this.loadingIcon, "runIconidle");
        domClass.add(this.loadingIcon, "runIconProcessing");
        domClass.add(widgetPanel, "esriCTDisableScroll");
      } else {
        domClass.remove(this.loadingIcon, "runIconProcessing");
        domClass.add(this.loadingIcon, "runIconidle");
        domClass.remove(widgetPanel, "esriCTDisableScroll");
      }
    },

    /**
     *This function will execute when user clicked on the 'Run Trace' button.
     **/
    _onTraceButtonClick: function () {
      if (!domClass.contains(this.btnTrace, "jimu-state-disabled")) {
        this._showLoadingIcon(true);
        this._isRunButtonClicked = true;
        this._executeTracePreRequisites(true);
      }
    },

    /**
     * This function will download the csv file on client side.
     * @param{object}csvdata: object containing information regarding csv data.
     * @param{string}fileName: name of the csv file.
     **/
    _exportToCSVComplete: function (csvdata, fileName) {
      CSVUtils._download(fileName + '.csv', csvdata.csvdata);
    },

    /**
     * This function is used to replece double quotes in data.
     **/
    _replaceDoubleQuotesInString: function (str) {
      var result;
      result = str;
      if (str) {
        result = str.toString().replace(/\"/g, '""');
      }
      return result;
    },

    /**
     * This function is used to create CSV content data.
     **/
    _createCSVContent: function (results, title) {
      var deferred, csvNewLineChar, csvContent, atts, dataLine, i;
      deferred = new Deferred();
      atts = [];
      var key;
      csvNewLineChar = "\r\n";
      csvContent = title + "," + csvNewLineChar;
      if (results && results.features && results.features.length > 0) {
        for (key in results.features[0].attributes) {
          if (results.features[0].attributes.hasOwnProperty(
              key)) {
            for (i = 0; i < results.fields.length; i++) {
              if (results.fields[i].name === key) {
                atts.push(results.fields[i].alias);
              }
            }
          }
        }
        csvContent += atts.join(",") + csvNewLineChar;
        array.forEach(results.features, function (feature) {
          atts = [];
          var k;
          if (feature.attributes !== null) {
            for (k in feature.attributes) {
              if (feature.attributes.hasOwnProperty(k)) {
                atts.push("\"" +
                  this._replaceDoubleQuotesInString(feature.attributes[k]) +
                  "\"");
              }
            }
          }
          dataLine = atts.join(",");
          csvContent += dataLine + csvNewLineChar;
        }, this);
        csvContent += csvNewLineChar + csvNewLineChar;
      } else {
        array.forEach(results.fields, function (field) {
          atts.push(field.alias);
        }, this);
        csvContent += atts.join(",") + csvNewLineChar;
      }
      deferred.resolve({
        "csvdata": csvContent,
        "orgResults": results
      });
      return deferred;
    },

    _formatDate: function (value) {
      var inputDate, formattedDate;
      if (value !== "" && value !== null) {
        if (!isNaN(value) && Number(value) < 0) {
          inputDate = new Date(0);
          inputDate.setUTCSeconds(value / 1000);
        } else {
          inputDate = new Date(value);
        }
        formattedDate = dateLocale.format(inputDate, {
          datePattern: "yyyy-MM-dd",
          selector: "date"
        });
        return formattedDate;
      }
      value = "";
      return value;
    },

    /**
     * This function destroy widget if created
     * @param{object} div
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
     * This function will enable the web map popup.
     **/
    enableWebMapPopup: function () {
      if (this.map) {
        this.map.setInfoWindowOnClick(true);
      }
    },

    /**
     * This function will disable the web map popup.
     **/
    disableWebMapPopup: function () {
      if (this.map) {
        this.map.setInfoWindowOnClick(false);
      }
    },

    /**
     * This function will execute when user clicked on the map
     * @param{object} evt: object containing information regarding the map point.
     **/
    _mapClickHandler: function (evt) {
      var deferred;
      //if snapping manager is available use snapping otherwise used clicked mapPoint
      if (this.map && this.map.snappingManager) {
        //call the getSnappingPoint method to get snapped point, & in deferred callback check
        //if snapPoint is valid use it otherwise used clicked mapPoint
        deferred = this.map.snappingManager.getSnappingPoint(evt.screenPoint);
        deferred.then(lang.hitch(this, function (snappingPoint) {
          if (snappingPoint) {
            evt.mapPoint = snappingPoint;
          }
          this._onMapClick(evt.mapPoint);
        }));
      } else {
        this._onMapClick(evt.mapPoint);
      }
    },

    /**
     * Once the map clicked/snapped point is received,
     * This function will add the graphic to the input graphic layer.
     * @param {Object} mapPoint
     */
    _onMapClick: function (mapPoint) {
      var addType, objID;
      //This is will check whether Flag or Barrier has been selected or not, to place the pushpin on the map.
      if (this.flagBtnClicked || this.barrierBtnClicked) {
        //Checking whether flag button is clicked or not.
        if (this.flagBtnClicked) {
          addType = "Flag";
          domClass.remove(this.btnTrace, "jimu-state-disabled");
          this.btnTrace.disabled = false;
          this._flagID++;
          objID = this._flagID;
          this._addInputLocation(new Graphic(mapPoint, null, {
            "ObjID": objID
          }, null), addType);
        }
        //checking whether barrier button is clicked or not.
        if (this.barrierBtnClicked) {
          addType = "Barrier";
          this._barrierID++;
          objID = this._barrierID;
          this._addBarrierLocation(new Graphic(mapPoint, null, {
            "ObjID": objID
          }, null), addType);
        }
        //Looping thorugh the Input Layers to add the Graphic.
        array.some(this.gpInputDetails, function (layer) {
          //Checking the Layer type
          if (layer.type === addType) {
            layer.add(new Graphic(mapPoint, null, {
              "ObjID": objID
            }, null));
            return true;
          }
        });
      }
    },

    /**
     *This function will return the symbol as per the provided JSON.
     *@param{object} json: The JSON object from which symbol will be returned.
     *@return{object} symbol:Symbol can be simplefillsymbol, simplemarkersymbol, simplelinesymbol or picturemarkersymbol.
     **/
    _createGraphicFromJSON: function (json) {
      var symbol;
      symbol = symbolJsonUtils.fromJson(json);
      return symbol;
    },

    /**
     *This function will add the Input layers into the map.
     **/
    _createGraphic: function () {
      this.gpInputDetails = [];
      var inLayer, addSymbol, ren, barriersFlag;
      barriersFlag = query(".btnBarrierStyle", this.tracePanel)[0];
      //This will create the GraphicsLayer as per the GP Inputs.
      array.forEach(this.config.geoprocessing.inputs, function (input) {
        inLayer = new GraphicsLayer();
        inLayer.id = input.paramName + this.id;
        inLayer.type = input.type;
        inLayer.paramName = input.paramName;
        addSymbol = this._createGraphicFromJSON(input.symbol);
        ren = new SimpleRenderer(addSymbol);
        inLayer.setRenderer(ren);
        this.gpInputDetails.push(inLayer);
        //checking input type
        if (input.type === "Flag") {
          domClass.remove(this.btnFlag, "esriCTHidden");
          this._flagGraphicsLayer = inLayer;
          if (input.toolTip !== "" || input.toolTip !== null) {
            this.btnFlag.title = input.toolTip;
          }
          this.flagLabel.innerHTML = input.displayName;
        }
        if (input.type === "Barrier") {
          domClass.remove(this.btnBarrier, "esriCTHidden");
          this._barrierGraphicsLayer = inLayer;
          if (input.toolTip !== "" || input.toolTip !== null) {
            this.btnBarrier.title = input.toolTip;
          }
          this.barrierLabel.innerHTML = input.displayName;
        }
        if (input.type === "Skip") {
          this._skipLocationGraphicsLayer = inLayer;
        }
      }, this);
      this.map.addLayers(this.gpInputDetails);
    },

    /**
     *This Function will add the output layers to the map also initialize TitlePane into the Widget.
     **/
    _createResultPanels: function () {
      var sym, ren, layer;
      this.resultLayers = [];
      domConstruct.empty(this.resultLayersInformationContainer);
      array.forEach(this.config.geoprocessing.outputs, function (
        output) {
        sym = null;
        ren = null;
        layer = new GraphicsLayer();
        if (isNaN(output.MinScale) && isNaN(output.MaxScale)) {
          layer.minScale = Number(output.MinScale.replace(",", ""));
          layer.maxScale = Number(output.MaxScale.replace(",", ""));
        } else {
          layer.minScale = output.MinScale;
          layer.maxScale = output.MaxScale;
        }

        //To check whether output layer is visible or not.
        if (output.hasOwnProperty("visibility")) {
          if (output.visibility !== null) {
            if (output.visibility) {
              layer.setVisibility(true);
            } else {
              layer.setVisibility(false);
            }
          } else {
            layer.setVisibility(true);
          }
        }
        layer.id = output.paramName + this.id;
        //To check whether output contains symbol or not.
        if (output.symbol !== null) {
          sym = this._createGraphicFromJSON(output.symbol);
          ren = new SimpleRenderer(sym);
          layer.setRenderer(ren);
        }
        this.map.addLayer(layer);
        output.layer = layer;
        if (this.config.geoprocessing.outputs.length > 0) {
          this._createLayerResultPanel(output);
        }
        //To check whether output type is overview.
        if (output.type === "Result") {
          this.resultLayers.push(layer);
        }
      }, this);
    },

    _createLayerResultPanel: function (output) {
      var layerNameContainer, layerName, rightCaretIcon, resultContainer,
        resultContainerHeader, resultContainerBack, resultContainerLbl,
        resultContainerData, checkboxParentContainer, checkboxContainer, checkboxObj,
        layerClickableDiv, visbility = true;
      // layer name container - main node
      layerNameContainer = domConstruct.create("div", {
        "class": "esriCTLayerNameContainer",
        "LayerName": output.paramName
      });
      // checkbox parent container - node 1
      checkboxParentContainer = domConstruct.create("div", {
        "class": "esriCTCheckboxParentContainer"
      }, layerNameContainer);
      // checkbox container
      checkboxContainer = domConstruct.create("div", {
        "class": "esriCTCheckboxContainer"
      }, checkboxParentContainer);
      //check if visibility key availbel in config then use it
      if (output.hasOwnProperty('visibility')) {
        visbility = output.visibility;
      }
      // checkbox
      checkboxObj = new Checkbox({
        "checked": visbility
      }, checkboxContainer);
      this._updateLayerVisibilty(output.paramName, visbility);
      this.own(on(checkboxObj, "change", lang.hitch(this, function (checked) {
        this._updateLayerVisibilty(output.paramName, checked);
      })));
      layerClickableDiv = domConstruct.create("div", {}, layerNameContainer);
      // layer name - node 2
      layerName = domConstruct.create("div", {
        "class": "esriCTLayerName",
        "innerHTML": output.panelText,
        "title": output.toolTip
      }, layerClickableDiv);
      // Set attribute instead of ID to layer name
      var layerNameDetails;
      layerNameDetails = output.paramName + this.id;
      domAttr.set(layerName, "layernamedetails", layerNameDetails);
      // right icon - node 3
      rightCaretIcon = domConstruct.create("div", {
        "class": "esriCTRightCaretIcon"
      }, layerClickableDiv);
      this.resultsLayerNamesContainer.appendChild(layerNameContainer);
      resultContainer = domConstruct.create("div", {
        "class": "esriCTResultContainer esriCTHidden",
        "title": ""
      });
      // Set attribute instead of ID to result container
      var resultContainerAttributeValue;
      resultContainerAttributeValue = output.paramName + this.id;
      domAttr.set(resultContainer, "resultcontainer", resultContainerAttributeValue);
      resultContainerHeader = domConstruct.create("div", {
        "class": "esriCTResultContainerHeader",
        "resultType": output.paramName,
        "title": ""
      }, resultContainer);
      resultContainerBack = domConstruct.create("div", {
        "class": "esriCTResultContainerBack",
        "resultType": output.paramName,
        "innerHTML": "&lt;" + this.nls.backButtonValue,
        "title": ""
      }, resultContainerHeader);

      resultContainerLbl = domConstruct.create("div", {
        "class": "esriCTResultContainerLbl",
        "title": ""
      }, resultContainerHeader);
      // Set attribute instead of ID to result container label
      var resultContainerLabel;
      resultContainerLabel = output.paramName + this.id;
      domAttr.set(resultContainerLbl, "resultcontainerlabel", resultContainerLabel);
      resultContainerData = domConstruct.create("div", {
        "class": "esriCTFeaturesListParentContainer",
        "title": ""
      }, resultContainer);
      // Set attribute instead of ID to result container data
      var resultContainerDataAttributeValue;
      resultContainerDataAttributeValue = output.paramName + this.id;
      domAttr.set(resultContainerData, "resultcontainerdata", resultContainerDataAttributeValue);
      this.layerFeaturesContainer.appendChild(resultContainer);
      this._displayFeatureOnLayerClick(output.paramName, layerClickableDiv,
        resultContainerBack);
    },

    _updateLayerVisibilty: function (paramName, visibility) {
      var graphicsLayer = this.map.getLayer(paramName + this.id);
      if (graphicsLayer) {
        graphicsLayer.setVisibility(visibility);
      }
    },

    _displayFeatureOnLayerClick: function (paramName, layerClickableDiv, resultContainerBack) {
      var resultMainDiv, resultDataDiv;

      this._clickEventHandlerArr.push(this.own(on.pausable(layerClickableDiv, "click", lang.hitch(this, function () {
        resultDataDiv = this._getResultContainerDataObject(paramName);
        if (resultDataDiv.children.length !== 0) {
          resultMainDiv = this._getResultContainerObject(paramName);
          this._displayOutputFeatureList(resultMainDiv);
          domClass.add(this.saveAndExportParentContainer, "esriCTHidden");

          var featuresListParentContainer = query(".esriCTFeaturesListParentContainer", resultMainDiv);
          if (featuresListParentContainer && featuresListParentContainer.length > 0) {
            var skipAllLocationButton = query(".esriCTSkipAllLocationParentContainer", resultMainDiv);
            var resetHeightObj;
            resetHeightObj = {};
            resetHeightObj.node = featuresListParentContainer[0];
            resetHeightObj.considerSaveAndExport = false;
            resetHeightObj.considerLoadProject = false;
            resetHeightObj.considerSkipAll = true;
            resetHeightObj.skipAllButton = skipAllLocationButton;
            this._resetHeight(resetHeightObj);
          }
        }
      }))));

      this._clickEventHandlerArr.push(this.own(on.pausable(resultContainerBack, "click", lang.hitch(this, function () {
        this._clearSelectionOnBackBtnClk();
        resultMainDiv = this._getResultContainerObject(paramName);
        domClass.remove(this.saveAndExportParentContainer, "esriCTHidden");
        this._hideOutputFeatureList(resultMainDiv);
      }))));
    },

    /**
     *This function will execute when User clicked on 'Clear' button.
     **/
    _onClearButtonClick: function () {
      var currentGUID;
      this._showLoadingIcon(true);
      //get current selected projects GUID
      if (this._currentSelectedProjectGuid) {
        currentGUID = lang.clone(this._currentSelectedProjectGuid);
      }
      this._clearResults();
      //If widget is in project mode and current GUID in not NewProject
      //then firsst clear everytinh and again set the project dropdown with the current selected ID
      if (this._isWidgetLoadedInProjectMode && currentGUID && currentGUID !== "newproject") {
        setTimeout(lang.hitch(this, function () {
          this._reloadCurrentProjectOnClear = true;
          this._loadProjectDropdown.set("value", currentGUID);
          this._hideOutputPanel();
        }), 200);
      }
      this._showLoadingIcon(false);
    },

    /**
     *This function will Clear all the results and resets all buttons.
     **/
    _clearResults: function (projectId) {
      var resultMainDiv, i;
      this._hideFlagsOnMainScreen();
      this._hideBarriersOnMainScreen();
      this._hideSkipLocationsOnMainScreen();
      this._hideOutputPanel();
      this._hideAllOutputResultContainer();
      this._hideAttributeInspector();
      domClass.add(this.layerFeaturesContainer, "esriCTHidden");
      domClass.add(this.exportToCSVFormParentContainer, "esriCTHidden");
      domConstruct.empty(this.flagLocContent);
      domConstruct.empty(this.barrierLocContent);
      domConstruct.empty(this.skipLocationsListContainer);
      domConstruct.empty(this.resultLayersInformationContainer);
      resultMainDiv = query(".esriCTFeaturesListParentContainer", this._widgetTopNode);
      for (i = 0; i < resultMainDiv.length; i++) {
        domConstruct.empty(resultMainDiv[i]);
      }
      this._flagID = this._barrierID = 0;
      this._flagCount = this._barrierCount = this._skipLocationCount = 0;
      this._inputFlag = this._inputBlock = this._inputSkip = 0;
      this._resetInputs();
      this._resetResults();
      if (this.toolbar !== null) {
        this.toolbar.deactivate();
        this.toolbar = null;
      }
      //This will check the Flag Status and as per that change the state of the button
      if (this.flagBtnClicked) {
        this.flagBtnClicked = false;
        domClass.remove(this.btnFlag, "flagButtonselected");
        domClass.add(this.btnFlag, "flagbutton");
      }
      //This will check the Barrier Status and as per that change the state of the button
      if (this.barrierBtnClicked) {
        this.barrierBtnClicked = false;
        domClass.remove(this.btnBarrier, "barrierButtonselected");
        domClass.add(this.btnBarrier, "barrierButton");
      }
      if (this.btnFlag.className.indexOf("traceControlDisabledDiv") > -1) {
        domClass.remove(this.btnFlag, "traceControlDisabledDiv");
      }
      if (this.btnBarrier.className.indexOf("traceControlDisabledDiv") > -1) {
        domClass.remove(this.btnBarrier, "traceControlDisabledDiv");
      }
      this.btnFlag.disabled = false;
      this.btnBarrier.disabled = false;
      domClass.add(this.btnTrace, "jimu-state-disabled");
      this.btnTrace.disabled = true;
      if (!projectId) {
        this._loadProjectDropdown.set("value", "newproject");
      }
      this._skippedLocations = {};
      this._allProjectLoadedInputs = [];
      domClass.add(this.exportToCsvMainScreenButton, "jimu-state-disabled");
      this._disableProjectSaveButton();
      var skipAllLocationParentContainerArr =
        query(".esriCTSkipAllLocationParentContainer", this.layerFeaturesContainer);
      array.forEach(skipAllLocationParentContainerArr, lang.hitch(this, function (skipAllLocationParentContainer) {
        domConstruct.destroy(skipAllLocationParentContainer);
      }));
      if (this.map && this.map.infoWindow) {
        this.map.infoWindow.hide();
      }
      this._displayEntireMainScreen();
      this.animatedLayer.clear();
      this._isRunButtonClicked = false;
    },

    /**
     *This function removes all graphic layers from map.
     **/
    _removeAllGraphicLayers: function () {
      this._removeInputGraphics();
      this._removeResultGraphics();
    },

    /**
     *This function removes all results graphic layers from map.
     **/
    _removeResultGraphics: function () {
      array.forEach(this.resultLayers, lang.hitch(this, function (item) {
        this.map.removeLayer(item);
      }));
      if (this.animatedLayer) {
        this.map.removeLayer(this.animatedLayer);
      }
    },

    /**
     *This function removes all input graphic layers from map.
     **/
    _removeInputGraphics: function () {
      array.forEach(this.gpInputDetails, lang.hitch(this, function (
        item) {
        this.map.removeLayer(item);
      }));
    },

    /**
     *This function will start the asynchronous call as well as check and create the Parameter for the GP call.
     **/
    _GPExecute: function () {
      var params = {},
        featureset, noFlags;
      if (this.toolbar !== null) {
        this.toolbar.deactivate();
        this.toolbar = null;
      }
      domClass.add(this.btnTrace, "jimu-state-disabled");
      this.btnTrace.disabled = true;
      domClass.add(this.btnFlag, "traceControlDisabledDiv");
      domClass.add(this.btnBarrier, "traceControlDisabledDiv");
      this.btnFlag.disabled = true;
      this.btnBarrier.disabled = true;
      //This will reset the Flag Button
      if (this.flagBtnClicked) {
        this.flagBtnClicked = false;
        domClass.remove(this.btnFlag, "flagButtonselected");
        domClass.add(this.btnFlag, "flagbutton");
      }
      //This will reset the barrier button
      if (this.barrierBtnClicked) {
        this.barrierBtnClicked = false;
        domClass.remove(this.btnBarrier, "barrierButtonselected");
        domClass.add(this.btnBarrier, "barrierButton");
      }
      noFlags = false;
      array.forEach(this.gpInputDetails, function (layer) {
        featureset = new FeatureSet();
        featureset.features = layer.graphics;
        if (layer.type === "Flag") {
          if (layer.graphics === null) {
            noFlags = true;
          }
          if (layer.graphics.length === 0) {
            noFlags = true;
          }
        }
        if (layer.graphics.length > 0) {
          params[layer.paramName] = featureset;
        }
      });
      if (noFlags) {
        this._isRunButtonClicked = false;
        return false;
      }
      this.gp.submitJob(params);
    },

    /**
     *This function is a call back handler of GP Service submit job completion and this will initialize the GP get results data process.
     *@param{object} message: This is a object parameter which is coming from GP execution.
     **/
    _onSubmitJobComplete: function (message) {
      this._jobID = message.jobInfo.jobId;
      if (message.jobInfo.jobStatus === "esriJobFailed") {
        domClass.remove(this.btnFlag, "traceControlDisabledDiv");
        domClass.remove(this.btnBarrier, "traceControlDisabledDiv");
        this.btnFlag.disabled = false;
        this.btnBarrier.disabled = false;
        this._showLoadingIcon(false);
        this._errorMessage(this.nls.GPExecutionFailed);
        return;
      }
      try {
        this._resetResults();
        this._resetSubmitJobDetails();
        array.forEach(this.config.geoprocessing.outputs, function (
          output) {
          if (this._verifyParams(message, output.paramName)) {
            this._processGPResults(message, output.paramName);
          }
        }, this);

      } catch (ex) {
        this._clearResults();
        this._showLoadingIcon(false);
        this._errorMessage(ex.message);
      }
    },

    /**
     *This function will display the result panel with the results. This will execute when get result data is complete from GP.
     *@param{object} message: This is a object which is coming from GP execution.
     **/
    _onGetResultDataComplete: function (result) {
      var hasAnyInput = false;
      array.forEach(this.config.geoprocessing.outputs, lang.hitch(this,
        function (output) {
          if (result.paramName === output.paramName) {
            output.results = result.value;
            this._populateResultsToggle(output);
          }
        }));
      this.btnFlag.disabled = false;
      this.btnBarrier.disabled = false;
      this.btnTrace.disabled = false;
      //get all inputs graphics
      array.some(this.config.geoprocessing.inputs, function (input) {
        if (input && input.paramName &&
          this.map.getLayer(input.paramName + this.id) &&
          this.map.getLayer(input.paramName + this.id).graphics.length > 0) {
          hasAnyInput = true;
          return true;
        }
      }, this);
      //if has any inputs then only enable the run button
      if (hasAnyInput) {
        domClass.remove(this.btnTrace, "jimu-state-disabled");
      } else {
        domClass.add(this.btnTrace, "jimu-state-disabled");
      }
      domClass.remove(this.btnFlag, "traceControlDisabledDiv");
      domClass.remove(this.btnBarrier, "traceControlDisabledDiv");
    },

    /**
     *This function will verify the output parameter with the GP Results.
     *@param{object} message: object which is coming from the GP submit job.
     *@param{string} paramName: Parameter name from which the parameter should be match.
     *@return{boolean}: true or false.
     **/
    _verifyParams: function (message, paramName) {
      var key;
      if (message && message.jobInfo && message.jobInfo.results) {
        for (key in message.jobInfo.results) {
          if (message.jobInfo.results.hasOwnProperty(key)) {
            if (paramName === key) {
              return true;
            }
          }
        }
      }
      return false;
    },

    /**
     *This function will process the GP Results and set the map extent as per the results and display the layers on the map.
     *@param{object} message: object which is coming from the GP Submit Job.
     *@param{string} paramName: parameter name.
     */
    _processGPResults: function (message, paramName) {
      this.gp.getResultData(message.jobInfo.jobId, paramName).then(lang.hitch(this, function (result) {
        this._showGPResults(result);
      }));
    },

    /**
     *This is a GP error call back function which will alert the user regarding the error while executing the GP service.
     *@param object err: 'err' contains information regarding the error.
     **/
    _onSubmitJobError: function () {
      this._clearResults();
      this._showLoadingIcon(false);
    },

    /**
     *This function will add the results into the Title Pane with High Light and Skip buttons.
     *@param{object} selectedGPParam: object containing information regarding the output features.
     **/
    _populateResultsToggle: function (selectedGPParam) {
      var skipBtnTitle = "",
        zoomToText = "",
        objectIDValue, bypassBtnClass, objectIDKey, resultCount,
        process, skipedLocation, selectedGraphic, div, btnControlDiv,
        zoomToHyperLink, resultContainerDataDiv,
        layerName, countLabel, outputLayerObj;
      resultCount = {
        "Count": 0,
        "SkipCount": 0
      };
      resultContainerDataDiv = this._getResultContainerDataObject(selectedGPParam.paramName);
      if (this.config && this.config.geoprocessing && this.config.geoprocessing
        .inputs && this.config.geoprocessing.inputs.length > 0) {
        array.forEach(this.config.geoprocessing.inputs, function (
          input) {
          if (input.type === "Skip") {
            if (input.toolTip !== "" || input.toolTip !== null) {
              skipBtnTitle = input.toolTip;
            }
          }
        });
      }
      objectIDKey = selectedGPParam.bypassDetails.IDField || this._getResultItemObjectID(
        selectedGPParam);
      // only add skip all location button for skippable layer
      if (selectedGPParam.bypassDetails.skipable) {
        this._addSkipAllLocationButton(resultContainerDataDiv);
      }
      array.forEach(selectedGPParam.results.features, lang.hitch(this,
        function (resultItem) {
          var btnBypassDiv, skipLocationInfo;
          objectIDValue = resultItem.attributes[objectIDKey] ||
            "";
          process = true;
          zoomToText = "";
          skipedLocation = null;
          if (selectedGPParam.bypassDetails.skipable && this._skipLocationGraphicsLayer !==
            null) {
            if (skipedLocation === null) {
              skipedLocation = new Graphic(resultItem.geometry,
                null, resultItem.attributes, null);
              skipedLocation.GPParam = selectedGPParam.paramName;
            }
          }
          this._formatDateAttributes(selectedGPParam, resultItem);
          selectedGraphic = new Graphic(resultItem.geometry, null,
            resultItem.attributes, null);
          selectedGPParam.layer.add(selectedGraphic);
          div = domConstruct.create("div", {
            "class": "resultItem"
          }, resultContainerDataDiv);
          resultItem.controlDetails = {
            "skipGraphic": skipedLocation,
            "bypassDetails": selectedGPParam.bypassDetails,
            "selectionGraphic": selectedGraphic
          };
          btnControlDiv = domConstruct.create("div", {
            "class": "resultItemSubDiv"
          }, div);
          if (selectedGPParam.bypassDetails.skipable) {
            btnBypassDiv = null;
            bypassBtnClass = selectedGPParam.paramName +
              objectIDValue + "BtnByPass";
            resultItem.controlDetails.bypassBtnClass =
              bypassBtnClass;
            btnBypassDiv = domConstruct.create("div", {
              "class": "resultItemButtonSkipIcon resultItemButton",
              "title": skipBtnTitle
            }, btnControlDiv);
            //if this location is already skipped highlight it and
            //add skippedFeatureUniqueId attr in it, so it help while removing skipped locations
            skipLocationInfo = this._checkSkipLocationXY(skipedLocation);
            if (skipLocationInfo && skipLocationInfo.isFeatureSkipped) {
              domAttr.set(btnBypassDiv, "skippedFeatureUniqueId",
                skipLocationInfo.skippedFeatureUniqueId);
              domClass.add(btnBypassDiv, "alreadySkippedLocation");
            }
            domClass.add(btnBypassDiv, bypassBtnClass);
            if (process) {
              resultCount.Count = resultCount.Count + 1;
              resultItem.controlDetails.selectionGraphic.bypassed =
                false;
            } else {
              resultCount.SkipCount = resultCount.SkipCount + 1;
              resultItem.controlDetails.selectionGraphic.bypassed =
                true;
            }
            this._clickEventHandlerArr.push(this.own(on.pausable(btnBypassDiv, "click", lang.hitch(this, function () {
              //if this location is not already skipped then only process
              if (!domClass.contains(btnBypassDiv, "alreadySkippedLocation")) {
                domClass.add(btnBypassDiv, "alreadySkippedLocation");
                this._onSkipLocationIconClick(resultItem, true, btnBypassDiv);
              }
            }))));
          } else {
            resultItem.controlDetails.selectionGraphic.bypassed =
              false;
            resultCount.Count = resultCount.Count + 1;
          }
          zoomToText = this._getZoomToText(selectedGPParam, resultItem);
          if (zoomToText.trim() === "") {
            zoomToText = "null";
          } else {
            zoomToText = zoomToText.trim();
          }
          zoomToHyperLink = domConstruct.create("div", {
            "class": "resultItemLabel",
            "innerHTML": zoomToText
          }, btnControlDiv);
          this._clickEventHandlerArr.push(this.own(on.pausable(zoomToHyperLink, "click",
            lang.hitch(this, function (evt) {
              if (this.map && this.map.infoWindow) {
                this.map.infoWindow.hide();
              }
              this._zoomToBtn(resultItem, evt);
            }))));

          resultItem.controlDetails.selectionGraphic.resultItem =
            resultItem;
          this._setResultInfoTemplate(selectedGraphic,
            selectedGPParam, skipBtnTitle, resultItem);
        }));

      if (selectedGPParam.type === "Result") {
        layerName = this._getLayerNameObject(selectedGPParam);
        domAttr.set(layerName, "innerHTML", selectedGPParam.panelText +
          " (" + (resultCount.Count + resultCount.SkipCount) + ")");
        countLabel = this._getResultContainerLabelObject(selectedGPParam);
        domAttr.set(countLabel, "innerHTML", selectedGPParam.panelText +
          " (" + (resultCount.Count + resultCount.SkipCount) + ")");
      }
      outputLayerObj = {};
      outputLayerObj.outputLayer = selectedGPParam;
      outputLayerObj.outputLayerResultCount = resultCount;
      this._outputResultArr.push(outputLayerObj);
      this._outputResultCount++;

      if (this._outputResultCount === this.config.geoprocessing.outputs.length) {
        this._convertSummaryExpressionIntoValue();
      }

    },

    /**
     * This function is used convert expression into value
     * @memberOf widgets/NetworkTrace/widgets
     **/
    _convertSummaryExpressionIntoValue: function () {
      var summaryExpressionValueResultText;
      summaryExpressionValueResultText = null;
      summaryExpressionValueResultText = this.config.summaryExpression.summaryExpressionTrimmedValue;
      summaryExpressionValueResultText =
        this._convertExpressionRelatedToInputParameter(summaryExpressionValueResultText);
      summaryExpressionValueResultText =
        this._convertExpressionRelatedToOutputParameter(summaryExpressionValueResultText);
      if (summaryExpressionValueResultText && summaryExpressionValueResultText !== "") {
        this.resultLayersInformationContainer.innerHTML = summaryExpressionValueResultText;
        if (this.resultLayersInformationContainer.innerHTML !== null &&
          this.resultLayersInformationContainer.innerHTML !== undefined &&
          this.resultLayersInformationContainer.innerHTML !== "") {
          domClass.remove(this.resultLayersInformationContainer, "esriCTHidden");
        }
      }
    },

    /**
     * This function is used convert expression into value related to input parameter
     * @memberOf widgets/NetworkTrace/widgets
     **/
    _convertExpressionRelatedToInputParameter: function (summaryExpressionValueResultText) {
      var i, expressionArr, j, regExp, replaceValue;
      for (i = 0; i < this.config.summaryExpression.summaryExpressionValueArr.length; i++) {
        expressionArr = this.config.summaryExpression.summaryExpressionValueArr[i].trimmedValue.split(":");
        for (j = 0; j < this.gpInputDetails.length; j++) {
          if (expressionArr[0] === this.gpInputDetails[j].paramName) {
            regExp =
              new RegExp("{" + this.config.summaryExpression.summaryExpressionValueArr[i].trimmedValue + "}", 'g');
            replaceValue = this.gpInputDetails[j].graphics.length;
            summaryExpressionValueResultText = summaryExpressionValueResultText.replace(regExp, replaceValue);
          }
        }
      }
      return summaryExpressionValueResultText;
    },

    /**
     * This function is used convert expression into value related to output parameter
     * @memberOf widgets/NetworkTrace/widgets
     **/
    _convertExpressionRelatedToOutputParameter: function (summaryExpressionValueResultText) {
      var i, expressionArr, j, regExp, replaceValue;
      replaceValue = "";
      for (i = 0; i < this.config.summaryExpression.summaryExpressionValueArr.length; i++) {
        expressionArr = this.config.summaryExpression.summaryExpressionValueArr[i].trimmedValue.split(":");
        if (expressionArr.length === 2) {
          for (j = 0; j < this._outputResultArr.length; j++) {
            if (expressionArr[0] === this._outputResultArr[j].outputLayer.paramName) {
              regExp =
                new RegExp("{" + this.config.summaryExpression.summaryExpressionValueArr[i].trimmedValue + "}", 'g');
              if (expressionArr[1] === this.config.summaryExpression.summaryExpressionNLS.outputOperatorCountOption) {
                replaceValue = this._outputResultArr[j].outputLayerResultCount.Count;
              } else if (expressionArr[1] ===
                this.config.summaryExpression.summaryExpressionNLS.outputOperatorSkipCountOption) {
                replaceValue = this._outputResultArr[j].outputLayerResultCount.SkipCount;
              }
              summaryExpressionValueResultText = summaryExpressionValueResultText.replace(regExp, replaceValue);
            }
          }
        } else if (expressionArr.length === 3) {
          for (j = 0; j < this._outputResultArr.length; j++) {
            if (expressionArr[0] === this._outputResultArr[j].outputLayer.paramName) {
              regExp =
                new RegExp("{" + this.config.summaryExpression.summaryExpressionValueArr[i].trimmedValue + "}", 'g');
              if (expressionArr[2] === this.config.summaryExpression.summaryExpressionNLS.fieldOperatorSumOption) {
                if (this._outputResultArr[j].outputLayer.results.features) {
                  replaceValue =
                    this._getSumValueOfField(this._outputResultArr[j].outputLayer.results.features, expressionArr[1]);
                }
              }
              if (expressionArr[2] === this.config.summaryExpression.summaryExpressionNLS.fieldOperatorMinOption) {
                if (this._outputResultArr[j].outputLayer.results.features) {
                  replaceValue =
                    this._getMinValueOfField(this._outputResultArr[j].outputLayer.results.features, expressionArr[1]);
                }
              }
              if (expressionArr[2] === this.config.summaryExpression.summaryExpressionNLS.fieldOperatorMaxOption) {
                if (this._outputResultArr[j].outputLayer.results.features) {
                  replaceValue =
                    this._getMaxValueOfField(this._outputResultArr[j].outputLayer.results.features, expressionArr[1]);
                }
              }
              if (expressionArr[2] === this.config.summaryExpression.summaryExpressionNLS.fieldOperatorMeanOption) {
                if (this._outputResultArr[j].outputLayer.results.features) {
                  replaceValue =
                    this._getMeanValueOfField(this._outputResultArr[j].outputLayer.results.features, expressionArr[1]);
                }
              }
              summaryExpressionValueResultText = summaryExpressionValueResultText.replace(regExp, replaceValue);
            }
          }
        }
      }
      return summaryExpressionValueResultText;
    },

    /**
     * This function is used to get summation of field values
     * @memberOf widgets/NetworkTrace/widgets
     **/
    _getSumValueOfField: function (features, field) {
      var sumArr, i, total;
      sumArr = [];
      for (i = 0; i < features.length; i++) {
        if (features[i].attributes[field] !== null &&
          features[i].attributes[field] !== "" &&
          features[i].attributes[field] !== undefined) {
          sumArr.push(features[i].attributes[field]);
        }
      }
      if (sumArr.length > 0) {
        total = this._getSummationOfArr(sumArr);
        if (this._decimalPlaces(total) > 2) {
          total = total.toFixed(2);
        }
        return total;
      }
      return 0;
    },

    _decimalPlaces: function (num) {
      var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) {
        return 0;
      }
      // (match[1] ? match[1].length : 0) --> Number of digits right of decimal point.
      // (match[2] ? +match[2] : 0) --> Adjust for scientific notation.
      // To solve JSHint error(Operator - should be on a new line)
      // comments position is changed in above manner
      return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ?
        +match[2] : 0));
    },

    /**
     * This function is used to get summation of field values
     * @memberOf widgets/NetworkTrace/widgets
     **/
    _getSummationOfArr: function (sumArr) {
      var total = 0;
      for (var i in sumArr) {
        total += sumArr[i];
      }
      return total;
    },

    /**
     * This function is used to get minimum of field values
     * @memberOf widgets/NetworkTrace/widgets
     */
    _getMinValueOfField: function (features, field) {
      var minArr, i, minimumValue;
      minArr = [];
      for (i = 0; i < features.length; i++) {
        if (features[i].attributes[field] !== null &&
          features[i].attributes[field] !== "" &&
          features[i].attributes[field] !== undefined) {
          minArr.push(features[i].attributes[field]);
        }
      }
      if (minArr.length > 0) {
        minimumValue = Math.min.apply(Math, minArr);
        if (this._decimalPlaces(minimumValue) > 2) {
          minimumValue = minimumValue.toFixed(2);
        }
        return minimumValue;
      }
      return 0;
    },

    /**
     * This function is used to get maximum of field values
     * @memberOf widgets/NetworkTrace/widgets
     */
    _getMaxValueOfField: function (features, field) {
      var maxArr, i, maximumValue;
      maxArr = [];
      for (i = 0; i < features.length; i++) {
        if (features[i].attributes[field] !== null &&
          features[i].attributes[field] !== "" &&
          features[i].attributes[field] !== undefined) {
          maxArr.push(features[i].attributes[field]);
        }
      }
      if (maxArr.length > 0) {
        maximumValue = Math.max.apply(Math, maxArr);
        if (this._decimalPlaces(maximumValue) > 2) {
          maximumValue = maximumValue.toFixed(2);
        }
        return maximumValue;
      }
      return 0;
    },

    /**
     *  This function is used to get minimum of field values
     * @memberOf widgets/NetworkTrace/widgets
     */
    _getMeanValueOfField: function (features, field) {
      var meanArr, i, total, meanValue;
      meanArr = [];
      for (i = 0; i < features.length; i++) {
        if (features[i].attributes[field] !== null &&
          features[i].attributes[field] !== "" &&
          features[i].attributes[field] !== undefined) {
          meanArr.push(features[i].attributes[field]);
        }
      }
      if (meanArr.length > 0) {
        total = this._getSummationOfArr(meanArr);
        meanValue = total / meanArr.length;
        if (this._decimalPlaces(meanValue) > 2) {
          meanValue = meanValue.toFixed(2);
        }
        return meanValue;
      }
      return 0;
    },

    _formatDateAttributes: function (selectedGPParam, resultItem) {
      var i;
      if (selectedGPParam.results && selectedGPParam.results.fields) {
        for (i = 0; i < selectedGPParam.results.fields.length; i++) {
          if (selectedGPParam.results.fields[i].type ===
            "esriFieldTypeDate") {
            resultItem.attributes[selectedGPParam.results.fields[i]
              .name] = resultItem.attributes[selectedGPParam.results
              .fields[i].name] ? this._formatDate(resultItem.attributes[
              selectedGPParam.results.fields[i].name]) : "";
          }
        }

      }
    },

    /**
     * This function will return the objectId key from the param item attributes.
     */
    _getResultItemObjectID: function (item) {
      var key;
      for (key in item.results.fields) {
        if (item.results.fields.hasOwnProperty(key)) {
          if (item.results.fields[key].type === "esriFieldTypeOID") {
            return item.results.fields[key].name;
          }
        }
      }
    },

    _createGPServiceOutputParameterObj: function () {
      array.forEach(this._gpServiceOutputParameter, lang.hitch(this, function (gpServiceOutputParameter) {
        if (gpServiceOutputParameter.hasOwnProperty("name")) {
          this._gpServiceOutputParameterObj[gpServiceOutputParameter.name] = {};
          if (gpServiceOutputParameter.defaultValue && gpServiceOutputParameter.defaultValue.fields) {
            array.forEach(gpServiceOutputParameter.defaultValue.fields, lang.hitch(this, function (field) {
              this._gpServiceOutputParameterObj[gpServiceOutputParameter.name][field.name] = field.type;
            }));
          }
        }
      }));
    },

    _getFieldAliasFromGPService: function (gpExecution) {
      var url, GpServiceParameters = [],
        i, gpServiceOutputParameters = [],
        requestArgs;
      url = this.config.geoprocessing.url;
      requestArgs = {
        url: url,
        content: {
          f: "json"
        },
        handleAs: "json",
        callbackParamName: "callback",
        timeout: 20000
      };
      this._showLoadingIcon(true);
      esriRequest(requestArgs).then(lang.hitch(this, function (response) {
        GpServiceParameters = response.parameters;
        for (i = 0; i < GpServiceParameters.length; i++) {
          if (GpServiceParameters[i].direction === "esriGPParameterDirectionOutput") {
            gpServiceOutputParameters.push(GpServiceParameters[i]);
          }
        }
        this._gpServiceOutputParameter = gpServiceOutputParameters;
        this._createGPServiceOutputParameterObj();
        if (gpExecution) {
          this._GPExecute();
        } else {
          this._loadWidgetInProjectMode();
        }
      }), lang.hitch(this, function () {
        this._showLoadingIcon(false);
        //as per gitHUb ticket #84 - hide all controls and show error in widget panel
        domClass.add(this.mainParentContentContainer, "esriCTHidden");
        domClass.remove(this.errorNode, "esriCTHidden");
      }));
    },

    _resetInputOutputTabParentContainer: function () {
      var resetHeightObj;
      resetHeightObj = {};
      resetHeightObj.node = this.inputOutputTabParentContainer;
      resetHeightObj.considerSaveAndExport = true;
      resetHeightObj.considerLoadProject = true;
      this._resetHeight(resetHeightObj);
    },

    _getFieldNameColValue: function (attrKey, outputParameterFields) {
      var fieldNameColValue = attrKey;
      for (var j = 0; j < outputParameterFields.length; j++) {
        if (attrKey === outputParameterFields[j].name) {
          fieldNameColValue = (outputParameterFields[j].alias &&
              outputParameterFields[j].alias !== "") ?
            outputParameterFields[j].alias : outputParameterFields[
              j].name;
          return fieldNameColValue;
        }
      }
      return fieldNameColValue;
    },

    _setResultInfoTemplate: function (item, param, skipBtnTitle,
      resultItem) {
      var infoTemplateObj, headerText, infoContent, tableDiv,
        btnBypassDiv, attrRow, attrKey, attrValue, attrTable,
        attrTableBody, attrNameCol, i, outputParameterFields = [];
      infoTemplateObj = new InfoTemplate();
      headerText = param.panelText;
      infoTemplateObj.setTitle("&nbsp;");
      infoContent = domConstruct.create("div", {
        "class": "attrMainSection"
      });
      domConstruct.create("div", {
        "class": "attrHeader",
        "innerHTML": headerText
      }, infoContent);
      domConstruct.create("div", {
        "class": "attrSeparator"
      }, infoContent);
      tableDiv = domConstruct.create("div", null, infoContent);
      //create table: attrTable
      attrTable = domConstruct.create("table", {
        "class": "attrResultInfoTable"
      }, tableDiv);

      if (this._gpServiceOutputParameter) {
        for (i = 0; i < this._gpServiceOutputParameter.length; i++) {
          if (this._gpServiceOutputParameter[i].name === param.paramName) {
            outputParameterFields =
              this._gpServiceOutputParameter[i].defaultValue.fields;
          }
        }
      }

      attrTableBody = domConstruct.create("tbody", {}, attrTable);
      for (attrKey in item.attributes) {
        if (item.attributes.hasOwnProperty(attrKey)) {
          attrValue = item.attributes[attrKey];
          //Create attribute info table row
          attrRow = domConstruct.create("tr", {}, attrTableBody);
          attrNameCol = domConstruct.create("td", {
            "innerHTML": this._getFieldNameColValue(attrKey, outputParameterFields),
            "class": "attrName"
          }, attrRow);
          domConstruct.create("td", {
            "innerHTML": (attrValue !== undefined && attrValue !==
              null) ? attrValue : "",
            "class": "attrValue"
          }, attrRow);
        }
      }

      if (param.bypassDetails.skipable) {
        attrRow = domConstruct.create("tr", {}, attrTableBody);
        attrNameCol = domConstruct.create("td", {
          "class": "attrName",
          "colSpan": 2
        }, attrRow);
        btnBypassDiv = domConstruct.create("div", {
          "class": "resultItemButtonSkipIcon resultItemButton infoPopupSKipIcon",
          "title": skipBtnTitle
        }, attrNameCol);
        //if this location is already skipped highlight it and
        //add skippedFeatureUniqueId attr in it, so it help while removing skipped locations
        var skipLocationInfo = this._checkSkipLocationXY(resultItem.controlDetails.skipGraphic);
        if (skipLocationInfo && skipLocationInfo.isFeatureSkipped) {
          domAttr.set(btnBypassDiv, "skippedFeatureUniqueId",
            skipLocationInfo.skippedFeatureUniqueId);
          domClass.add(btnBypassDiv, "alreadySkippedLocation");
        }
        domClass.add(btnBypassDiv, resultItem.controlDetails.bypassBtnClass);
        this._clickEventHandlerArr.push(this.own(on.pausable(btnBypassDiv, "click", lang.hitch(this, function () {
          //if this location is not already skipped then only process
          if (!domClass.contains(btnBypassDiv, "alreadySkippedLocation")) {
            domClass.add(btnBypassDiv, "alreadySkippedLocation");
            this._onSkipLocationIconClick(resultItem, true, btnBypassDiv);
          }
        }))));
      }
      infoTemplateObj.setContent(infoContent);
      item.setInfoTemplate(infoTemplateObj);
    },

    /**
     *This function will zoom into the particular feature.
     *@param{object} resultItem:object containing information regarding feature which to be zoom.
     **/
    _zoomToBtn: function (resultItem, evt) {
      var graphics = resultItem.controlDetails.selectionGraphic;
      this._highlightSelection(graphics, graphics.getLayer(), evt.currentTarget.parentNode.parentNode);
    },

    /**
     * On itemDetails click in widget panel,
     * Highlight itemDetails in widget panel and features for that itemDetailsDiv on map
     */
    _highlightSelection: function (graphics, layer, node) {
      var prevSelectedNode, highlightGraphic;
      //If current node is already selected then deselect it and remove the highlight
      if (domClass.contains(node, "esriCTHighlightedGraphic")) {
        domClass.remove(node, "esriCTHighlightedGraphic");
        this.animatedLayer.clear();
        return;
      } else {
        this.map.setExtent(graphicsUtils.graphicsExtent([graphics]).expand(1.5));
      }
      //Remove highlights of previous selection
      prevSelectedNode = query(".esriCTHighlightedGraphic", this._widgetTopNode);
      if (prevSelectedNode && prevSelectedNode.length > 0) {
        domClass.remove(prevSelectedNode[0], "esriCTHighlightedGraphic");
      }
      //Clear the Graphics Layer before adding any new
      this.animatedLayer.clear();
      //Highlight the selected itemDetails in widget panel
      domClass.add(node, "esriCTHighlightedGraphic");
      highlightGraphic = highlightSymbolUtils.getHighLightSymbol(graphics, layer);
      this.animatedLayer.add(highlightGraphic);
    },

    /**
     *This function will create High Lighting Graphic Layer
     **/
    _createHighlightingGraphicLayer: function () {
      this.animatedLayer = new GraphicsLayer();
      this.map.addLayer(this.animatedLayer);
    },

    /**
     *This function will clear the result layers.
     **/
    _resetResults: function () {
      this.map.graphics.clear();
      //Looping through the output layers and then clearing the layer.
      array.forEach(this.config.geoprocessing.outputs, function (
        output) {
        //checking whether layer is null or not.
        if (output.layer) {
          output.layer.clear();
        }
      }, this);
    },

    /**
     *This function will clear the input layers.
     **/
    _resetInputs: function () {
      //Looping through the Input layers and then clearing the layer.
      array.forEach(this.gpInputDetails, function (input) {
        input.clear();
      }, this);
    },

    /**
     *This function will popup jimu popup with error message
     *param {string}err: string containing error message
     **/
    _errorMessage: function (err) {
      var errorMessage = new JimuMessage({
        message: err
      });
      errorMessage.message = err;
    },

    /**
     * This function will show and hide Input Locations List
     */
    _onInputLocTabClick: function () {
      this._displayFlagsList();
      this._clickEventHandlerArr.push(this.own(on.pausable(this.inputBackClick, "click", lang.hitch(this, function () {
        this._clearSelectionOnBackBtnClk();
        this._hideFlagsList(true);
      }))));
      var resetHeightObj;
      resetHeightObj = {};
      resetHeightObj.node = this.inputLocDiv;
      resetHeightObj.considerSaveAndExport = true;
      this._resetHeight(resetHeightObj); //reset
    },

    /**
     * This function will show and hide barrier locations List
     */
    _onBarrierLocTabClick: function () {
      this._displayBarrierList();
      this._clickEventHandlerArr.push(this.own(on.pausable(this.barrierBackClick, "click",
        lang.hitch(this, function () {
          this._clearSelectionOnBackBtnClk();
          this._hideBarrierList(true);
        }))));
      var resetHeightObj;
      resetHeightObj = {};
      resetHeightObj.node = this.barrierLocDiv;
      resetHeightObj.considerSaveAndExport = true;
      this._resetHeight(resetHeightObj); //reset
    },

    /**
     * This function will add feature to input location list
     * param{object} feature that will be added in input location list
     * param{string} information of layer type
     */
    _addInputLocation: function (graphic, type) {
      var inputFlagDiv, flagsLabelContainer, inputFlagCloseDiv;
      this._flagCount++;
      this._inputFlag++;
      this._hideFlagsList(true);
      this._hideAllOutputResultContainer();
      this._hideAttributeInspector();
      this._hideExportToCSVForm();
      this._hideSkipLocationList();
      this._hideBarrierList();
      domClass.add(this.layerFeaturesContainer, "esriCTHidden");
      this._displayFlagsOnMainScreen();
      domAttr.set(this.lblInputLoc, "innerHTML", this.nls.lblInputLocTab + " (" + this._flagCount + ")");
      domAttr.set(this.flagCountLabel, "innerHTML", this.nls.lblInputLocTab + " (" + this._flagCount + ")");
      inputFlagDiv = domConstruct.create("div", {
        "class": "esriCTFlagsBarriersSkipLocationsMainDiv"
      });
      domAttr.set(inputFlagDiv, "Graphic", JSON.stringify(graphic));
      domAttr.set(inputFlagDiv, "LayerType", type);
      flagsLabelContainer = domConstruct.create("div", {
        "class": "esriCTFlagsBarriersSkipLocationsLabelContainer",
        "innerHTML": this.nls.lblInputLocation + this._inputFlag
      }, inputFlagDiv);
      inputFlagCloseDiv = domConstruct.create("div", {
        "class": "esriCTInputFlagCloseDiv"
      }, inputFlagDiv);
      domConstruct.place(inputFlagDiv, this.flagLocContent);
      // delete input location tabs on click of close icon
      this._clickEventHandlerArr.push(this.own(on.pausable(inputFlagCloseDiv, "click", lang.hitch(this,
        function (evt) {
          //input location which wanted to be delete is selected then
          //remove its highlighting and clear graphics layer
          if (domClass.contains(evt.currentTarget.parentNode, "esriCTHighlightedGraphic")) {
            this.animatedLayer.clear();
          }
          this._onClickCloseRemoveGraphics(evt);
          this._flagCount--;
          domAttr.set(this.lblInputLoc, "innerHTML", this.nls
            .lblInputLocTab + " (" + this._flagCount + ")");
          domAttr.set(this.flagCountLabel, "innerHTML", this.nls
            .lblInputLocTab + " (" + this._flagCount + ")");
          // if flagLocContent children is 0 then go to input tab
          if (this.flagLocContent.children.length === 0) {
            domClass.add(this.btnTrace, "jimu-state-disabled");
            this.btnTrace.disabled = true;
            this._hideFlagsList(true);
            this._hideFlagsOnMainScreen();
          }
        }))));
      this._clickEventHandlerArr.push(this.own(on.pausable(flagsLabelContainer, "click",
        lang.hitch(this, function (evt) {
          if (this.map && this.map.infoWindow) {
            this.map.infoWindow.hide();
          }
          this._onClickHighlightLocations(evt);
        }))));
    },

    /**
     * This function will add feature in barrier list
     * param{object} feature that will be added in barrier list
     * param{string} information of layer type
     */
    _addBarrierLocation: function (graphic, type) {
      var blockDiv, blockLabelContainer, blockCloseDiv;
      this._barrierCount++;
      this._inputBlock++;
      this._hideBarrierList(true);
      this._hideAllOutputResultContainer();
      this._hideAttributeInspector();
      this._hideExportToCSVForm();
      this._hideSkipLocationList();
      this._hideFlagsList();
      domClass.add(this.layerFeaturesContainer, "esriCTHidden");
      this._displayBarriersOnMainScreen();
      domAttr.set(this.lblBlockLoc, "innerHTML", this.nls.lblBlockLocTab +
        " (" + this._barrierCount + ")");
      domAttr.set(this.barrierCountLabel, "innerHTML", this.nls.lblBlockLocTab +
        " (" + this._barrierCount + ")");
      blockDiv = domConstruct.create("div", {
        "class": "esriCTFlagsBarriersSkipLocationsMainDiv"
      });
      domAttr.set(blockDiv, "Graphic", JSON.stringify(graphic));
      domAttr.set(blockDiv, "LayerType", type);
      blockLabelContainer = domConstruct.create("div", {
        "class": "esriCTFlagsBarriersSkipLocationsLabelContainer",
        "innerHTML": this.nls.lblBlockLocation + this._inputBlock
      }, blockDiv);
      blockCloseDiv = domConstruct.create("div", {
        "class": "esriCTInputFlagCloseDiv"
      }, blockDiv);
      domConstruct.place(blockDiv, this.barrierLocContent);

      this._clickEventHandlerArr.push(this.own(on.pausable(blockCloseDiv, "click", lang.hitch(this, function (
        evt) {
        //Block location which wanted to be delete is selected then
        //remove its highlighting and clear graphics layer
        if (domClass.contains(evt.currentTarget.parentNode, "esriCTHighlightedGraphic")) {
          this.animatedLayer.clear();
        }
        this._onClickCloseRemoveGraphics(evt);
        this._barrierCount--;
        domAttr.set(this.lblBlockLoc, "innerHTML", this.nls.lblBlockLocTab +
          " (" + this._barrierCount + ")");
        domAttr.set(this.barrierCountLabel, "innerHTML", this
          .nls.lblBlockLocTab + " (" + this._barrierCount +
          ")");
        if (this.barrierLocContent.children.length === 0) {
          this._hideBarrierList(true);
          this._hideBarriersOnMainScreen();
        }
      }))));

      this._clickEventHandlerArr.push(this.own(on.pausable(blockLabelContainer, "click",
        lang.hitch(this, function (evt) {
          if (this.map && this.map.infoWindow) {
            this.map.infoWindow.hide();
          }
          this._onClickHighlightLocations(evt);
        }))));
    },

    /**
     * This function will remove selected feature from map
     * param{object} feature that needs to be removed
     */
    _onClickCloseRemoveGraphics: function (evt, layerTypeDetail) {
      var graphic, layerType;
      if (layerTypeDetail === "Skip") {
        var skippedFeatureUniqueId = domAttr.get(evt.currentTarget.parentNode, "skippedFeatureUniqueId");
        graphic = this._skippedLocations[skippedFeatureUniqueId];
        this._skipLocationGraphicsLayer.remove(graphic);
        domConstruct.destroy(evt.currentTarget.parentNode);
        this._updateSkipLocation();
        //remove already skipped class from output features
        query("[skippedFeatureUniqueId='" + skippedFeatureUniqueId + "']",
          this._widgetTopNode).removeClass("alreadySkippedLocation");
        delete this._skippedLocations[skippedFeatureUniqueId];
      } else {
        graphic = JSON.parse(domAttr.get(evt.currentTarget.parentNode,
          "Graphic"));
        layerType = domAttr.get(evt.currentTarget.parentNode,
          "LayerType");
        array.some(this.gpInputDetails, function (layer) {
          if (layer.type === layerType) {
            array.some(layer.graphics, function (graphics) {
              if (graphics.attributes.ObjID === graphic.attributes
                .ObjID) {
                layer.remove(graphics);
                return true;
              }
            });
          }
        });
        domConstruct.destroy(evt.currentTarget.parentNode);
      }
    },

    /**
     * This function will highlight selected feature on map
     * param{object} feature on map which needs to be highlighted
     */
    _onClickHighlightLocations: function (evt) {
      var graphic, locGeometry, layerType;
      layerType = domAttr.get(evt.currentTarget.parentNode, "LayerType");
      if (layerType === "Skip") {
        graphic = this._skippedLocations[domAttr.get(evt.currentTarget.parentNode, "skippedFeatureUniqueId")];
        this._highlightSelection(graphic, graphic.getLayer(), evt.currentTarget.parentNode);
        return;
      } else {
        graphic = JSON.parse(domAttr.get(evt.currentTarget.parentNode, "Graphic"));
        if (graphic) {
          array.some(this.gpInputDetails, lang.hitch(this, function (
            layer) {
            if (layer.type === layerType) {
              array.some(layer.graphics, lang.hitch(this,
                function (graphics) {
                  if (graphics.attributes.ObjID === graphic.attributes
                    .ObjID) {
                    locGeometry = graphics.geometry;
                    this._highlightSelection(graphics, graphics.getLayer(), evt.currentTarget.parentNode);
                    return true;
                  }
                }));
            }
          }));
        }
      }
    },

    /**
     * This function will handle the styling of tab theme's trace panel div for mobile view
     * @memberOf widgets/NetworkTrace/Widget
     */
    _enhanceTabThemeStyle: function () {
      var tracePanelDiv;
      tracePanelDiv = query(".jimu-widget-NetworkTrace .tracePanel", this._widgetTopNode)[0];
      if (tracePanelDiv) {
        if (this.appConfig.theme.name === "TabTheme") {
          domClass.add(tracePanelDiv, "esriCTTabThemePaddding");
        } else {
          domClass.remove(tracePanelDiv, "esriCTTabThemePaddding");
        }
      }
    },

    /**
     * This function will handle the styling of Dart theme on IE9
     * @memberOf widgets/NetworkTrace/Widget
     */
    _enhanceDartThemeStyle: function () {
      var mainDivContainer;
      if (this.appConfig.theme.name === "DartTheme") {
        this._setDartInlineStyle();
        if (has("ie") === 9) {
          mainDivContainer = query(".jimu-widget-frame.jimu-container", this._widgetTopNode)[0];
          domClass.add(mainDivContainer, "esriCTDartBackgroudColor");
        }
      }
    },

    /**
     * This function will fetch and process classes whose Background color to be override
     * @memberOf widgets/NetworkTrace/Widget
     */
    _setDartInlineStyle: function () {
      var i, classContainerObject = [];
      classContainerObject.push(query(".esriCTFlagBarrierSkipLocationMainPage", this._widgetTopNode));
      classContainerObject.push(query(".esriCTInputBarrierLoc", this._widgetTopNode));
      classContainerObject.push(query(".tracePanel", this._widgetTopNode));
      classContainerObject.push(query(".esriCTResultsLayerNamesContainer", this._widgetTopNode));
      classContainerObject.push(query(".esriCTResultContainer", this._widgetTopNode));
      classContainerObject.push(query(".esriCTLayerInformationContainer", this._widgetTopNode));
      // looping for setting grey Background color for dart theme
      for (i = 0; i < classContainerObject.length; i++) {
        this._setInlineStyle(classContainerObject[i]);
      }
    },

    /**
     * This function setting inline styling of Dart theme Background color
     * @memberOf widgets/NetworkTrace/Widget
     */
    _setInlineStyle: function (classNode) {
      var i;
      // setting inline font color styling for every node contains the specific class
      for (i = 0; i < classNode.length; i++) {
        domAttr.set(classNode[i], "style",
          "background-color: transparent !important; padding-right: 0px; padding-left: 0px;"
        );
      }
    },

    /**
     * This function override styling of Launchpad theme
     * @memberOf widgets/NetworkTrace/Widget
     */
    _enhanceLaunchpadThemeStyle: function () {
      var i, comboBoxButtonNodeArrowButton;
      if (this.appConfig.theme.name === "LaunchpadTheme") {
        // quering combobox button node
        comboBoxButtonNodeArrowButton =
          query(".claro .dijitComboBox>div.dijitArrowButton.dijitDownArrowButton",
            this._widgetTopNode);
        for (i = 0; i < comboBoxButtonNodeArrowButton.length; i++) {
          domAttr.set(comboBoxButtonNodeArrowButton[i], "style",
            "height: 30px !important");
        }
      }
    },

    /**
     * This function is used to add focus class on text box click for IE9
     * @param{object} Element node to which class needs to be added
     * @memberOf widgets/NetworkTrace/Widget
     */
    _addFocusClassOnTextBoxClick: function (textBoxNode) {
      var dijitTextBoxFocusedIE9div, dijitTextBoxFocuseddiv, j;
      domClass.add(textBoxNode, "dijitTextBoxIE9");
      // binding events for changing CSS on click of input Div
      // in dart theme and in case of  IE9
      this._clickEventHandlerArr.push(this.own(on.pausable(textBoxNode, "click", lang.hitch(this, function () {
        dijitTextBoxFocusedIE9div = query(".dijitTextBoxFocusedIE9", this._widgetTopNode);
        dijitTextBoxFocuseddiv = query(".dijitTextBoxFocused", this._widgetTopNode)[0];
        // loop for removing classes of focused node from all dijitTextBox
        for (j = 0; j < dijitTextBoxFocusedIE9div.length; j++) {
          domClass.remove(dijitTextBoxFocusedIE9div[j],
            "dijitTextBoxFocusedIE9");
        }
        domClass.add(dijitTextBoxFocuseddiv,
          "dijitTextBoxFocusedIE9");
      }))));
    },

    /**
     * This function is used to add focus class on date change for IE9
     * @param{object} Element node to which class needs to be added
     * @memberOf widgets/NetworkTrace/Widget
     */
    _addFocusClassOnDateChange: function (inputNode) {
      var dijitTextBoxFocusedIE9div, dijitTextBoxFocuseddiv, j;
      // binding events for changing CSS on change of input Div
      // in dart theme and in case of  IE9
      on(inputNode, "change", lang.hitch(this, function () {
        dijitTextBoxFocusedIE9div = query(".dijitTextBoxFocusedIE9", this._widgetTopNode);
        dijitTextBoxFocuseddiv = query(".dijitTextBoxFocused", this._widgetTopNode)[0];
        // loop for removing classes of focused node from all dijitTextBox
        for (j = 0; j < dijitTextBoxFocusedIE9div.length; j++) {
          domClass.remove(dijitTextBoxFocusedIE9div[j],
            "dijitTextBoxFocusedIE9");
        }
        domClass.add(dijitTextBoxFocuseddiv,
          "dijitTextBoxFocusedIE9");
      }));
    },

    /**
     * This function is used to add class on focus of dijit input for IE9
     * @param{object} Element node to which class needs to be added
     * @memberOf widgets/NetworkTrace/Widget
     */
    _addClassOnFocus: function (inputNode) {
      var dijitTextBoxFocusedIE9div, dijitTextBoxFocuseddiv, j;
      // binding events for changing CSS on focus of input Div
      // in dart theme and in case of  IE9
      on(inputNode, "focus", lang.hitch(this, function () {
        dijitTextBoxFocusedIE9div = query(".dijitTextBoxFocusedIE9", this._widgetTopNode);
        dijitTextBoxFocuseddiv = query(".dijitTextBoxFocused", this._widgetTopNode)[0];
        // loop for removing classes of focused node from all dijitTextBox
        for (j = 0; j < dijitTextBoxFocusedIE9div.length; j++) {
          domClass.remove(dijitTextBoxFocusedIE9div[j],
            "dijitTextBoxFocusedIE9");
        }
        domClass.add(dijitTextBoxFocuseddiv,
          "dijitTextBoxFocusedIE9");
      }));
    },

    /**
     * This function is used to remove all the skip locations on click of remove all button.
     */
    _onRemoveSkipAllButtonClick: function () {
      var skipLocations = query(".esriCTRemoveSkipLocationIcon", this.skipLocationsListContainer);
      if (skipLocations && skipLocations.length > 0) {
        array.forEach(skipLocations, lang.hitch(this, function (skipLocation) {
          skipLocation.click();
        }));
      }
    },

    /**
     * This function is used to check the xy location of the feature that needs to skip
     * with all the existing skipped feature. If xy value gets matched, than message is displayed
     * to the user that this location is already skipped.
     */
    _checkSkipLocationXY: function (skipGraphic) {
      var isFeatureSkipped, skippedFeatureUniqueId;
      isFeatureSkipped = false;
      for (var skippedFeature in this._skippedLocations) {
        if (this._skippedLocations.hasOwnProperty(skippedFeature)) {
          if (skipGraphic.geometry.x === this._skippedLocations[skippedFeature].geometry.x &&
            skipGraphic.geometry.y === this._skippedLocations[skippedFeature].geometry.y) {
            isFeatureSkipped = true;
            skippedFeatureUniqueId = skippedFeature;
            break;
          }
        }
      }
      return {
        "isFeatureSkipped": isFeatureSkipped,
        "skippedFeatureUniqueId": skippedFeatureUniqueId
      };
    },

    /**
     * This function is used to display the list of all the skip locations when clicked
     * on skip location entry in the input panel
     */
    _onSkipLocationTabClick: function () {
      this._displaySkipLocationList();
      this._clickEventHandlerArr.push(this.own(on.pausable(this.skipLocationBackClick, "click",
        lang.hitch(this, function () {
          this._clearSelectionOnBackBtnClk();
          this._hideSkipLocationList(true);
        }))));
      var resetHeightObj;
      resetHeightObj = {};
      resetHeightObj.node = this.skipLocDiv;
      resetHeightObj.considerSaveAndExport = true;
      this._resetHeight(resetHeightObj); //reset
    },

    /**
     * This function is used to add the entry of skip location in the list
     * whenever user skips it from the output panel.
     */
    _addSkipLocation: function (type, skippedFeatureUniqueId) {
      var skipLocationDiv, skipLocationsLabelContainer, skipLocationCloseDiv;
      this._displaySkipLocationsOnMainScreen();
      domAttr.set(this.lblSkipLoc, "innerHTML", this.nls.lblSkipLocTab +
        " (" + this._skipLocationCount + ")");
      domAttr.set(this.skipLocationCountLabel, "innerHTML", this.nls.lblSkipLocTab +
        " (" + this._skipLocationCount + ")");
      skipLocationDiv = domConstruct.create("div", {
        "class": "esriCTFlagsBarriersSkipLocationsMainDiv"
      });
      domAttr.set(skipLocationDiv, "LayerType", type);
      domAttr.set(skipLocationDiv, "skippedFeatureUniqueId", skippedFeatureUniqueId);
      skipLocationsLabelContainer = domConstruct.create("div", {
        "class": "esriCTFlagsBarriersSkipLocationsLabelContainer",
        "innerHTML": this.nls.lblSkipLocation + this._inputSkip
      }, skipLocationDiv);
      skipLocationCloseDiv = domConstruct.create("div", {
        "class": "esriCTRemoveSkipLocationIcon"
      }, skipLocationDiv);
      domConstruct.place(skipLocationDiv, this.skipLocationsListContainer);
      this._clickEventHandlerArr.push(this.own(on.pausable(skipLocationCloseDiv, "click",
        lang.hitch(this, function (evt) {
          //skip location which wanted to be delete is selected then
          //remove its highlighting and clear graphics layer
          if (domClass.contains(evt.currentTarget.parentNode, "esriCTHighlightedGraphic")) {
            this.animatedLayer.clear();
          }
          this._onClickCloseRemoveGraphics(evt, "Skip");
        }))));
      this._clickEventHandlerArr.push(this.own(on.pausable(skipLocationsLabelContainer, "click",
        lang.hitch(this, function (evt) {
          if (this.map && this.map.infoWindow) {
            this.map.infoWindow.hide();
          }
          this._onClickHighlightLocations(evt);
        }))));
    },

    /**
     * This function is used to update the parameter like skip count
     * whenever any skip location is deleted from the list
     */
    _updateSkipLocation: function () {
      this._skipLocationCount--;
      domAttr.set(this.lblSkipLoc, "innerHTML", this.nls.lblSkipLocTab +
        " (" + this._skipLocationCount + ")");
      domAttr.set(this.skipLocationCountLabel, "innerHTML",
        this.nls.lblBlockLocTab + " (" + this._skipLocationCount + ")");
      domAttr.set(this.skipLocationCountLabel, "innerHTML",
        this.nls.lblSkipLocTab + " (" + this._skipLocationCount + ")");
      if (this.skipLocationsListContainer.children.length === 0) {
        this._hideSkipLocationList(true);
        this._hideSkipLocationsOnMainScreen();
      }
    },

    /**
     * This function is used to add skip all the location button in the output panel
     * for all the skippable layers
     */
    _addSkipAllLocationButton: function (resultContainer) {
      var skipAllLocationParentContainer;
      skipAllLocationParentContainer = query(".esriCTSkipAllLocationParentContainer", resultContainer.parentNode);
      if (skipAllLocationParentContainer && skipAllLocationParentContainer.length > 0) {
        domConstruct.destroy(skipAllLocationParentContainer[0]);
      }
      skipAllLocationParentContainer = domConstruct.create("div", {
        "class": "esriCTSkipAllLocationParentContainer"
      });
      domConstruct.place(skipAllLocationParentContainer, resultContainer, "before");
      var skipAllButton = domConstruct.create("div", {
        "innerHTML": this.nls.skipAllLocationButtonLabel,
        "class": "jimu-btn esriCTSkipLocationButton"
      }, skipAllLocationParentContainer);
      this._clickEventHandlerArr.push(this.own(on.pausable(skipAllButton, "click", lang.hitch(this, function (evt) {
        this._skipAllLocationButtonClicked = true;
        var skipLocationsArr = query(".resultItemButtonSkipIcon", evt.currentTarget.parentNode.parentNode);
        array.forEach(skipLocationsArr, lang.hitch(this, function (skipLocation) {
          skipLocation.click();
        }));
        this._skipAllLocationButtonClicked = false;
        this._errorMessage(this.nls.allLocationSkippedMessage);
      }))));
    },

    /**
     * This function is used to fetch the parameters from url like flags, barriers & runTrace
     */

    _fetchUrlParameters: function () {
      var url, urlObject, isProjectFound, selectOption, loadDropdownOptions;
      url = document.location.href;
      urlObject = urlUtils.urlToObject(url);
      this._removeDuplicateParamEntries(urlObject);
      if (urlObject.query) {
        if (urlObject.query.hasOwnProperty("project")) {
          loadDropdownOptions = this._loadProjectDropdown.getOptions();
          array.some(loadDropdownOptions, lang.hitch(this, function (option) {
            if ((option.value === urlObject.query.project) || (option.label === urlObject.query.project)) {
              selectOption = option;
              isProjectFound = true;
              return;
            }
          }));
          if (isProjectFound) {
            this._loadProjectDropdown.set("value", selectOption.value);
          } else {
            this._errorMessage(this.nls.projectNotFoundErr);
          }
        } else {
          if (urlObject.query.hasOwnProperty("flags")) {
            this._placeUrlInputs(urlObject.query.flags, "flags");
          }
          if (urlObject.query.hasOwnProperty("barriers")) {
            this._placeUrlInputs(urlObject.query.barriers, "barriers");
          }
          this._runTrace(urlObject);
        }
      } else {
        this._showLoadingIcon(false);
      }
    },

    _removeDuplicateParamEntries: function (urlObject) {
      if (urlObject.query) {
        if (urlObject.query.hasOwnProperty("flags")) {
          if (Array.isArray(urlObject.query.flags) && urlObject.query.flags.length > 1) {
            delete urlObject.query.flags;
          }
        }
        if (urlObject.query.hasOwnProperty("barriers")) {
          if (Array.isArray(urlObject.query.barriers) && urlObject.query.barriers.length > 1) {
            delete urlObject.query.barriers;
          }
        }
        if (urlObject.query.hasOwnProperty("project")) {
          if (Array.isArray(urlObject.query.project) && urlObject.query.project.length > 1) {
            delete urlObject.query.project;
          }
        }
        if (urlObject.query.hasOwnProperty("runTrace")) {
          if (Array.isArray(urlObject.query.runTrace) && urlObject.query.runTrace.length > 1) {
            delete urlObject.query.runTrace;
          }
        }
      }
    },

    /**
     * This function is used add the parameters like flags and barriers on map once it is
     * fetched from the URL.
     */
    _placeUrlInputs: function (inputString, type) {
      var validArr;
      var placeInputsOnMap = false;
      var regexflags = /^\[(\[-?[0-9]*\.?[0-9]*,[0-9]*\.?[0-9]*\],?)*\]$/gi;
      var extractValidInputRegex = /(\[-?[0-9]*\.?[0-9]*,[0-9]*\.?[0-9]*\])/gi;
      //if input string is valid then place inputs on map
      //else try to fetch valid entries form the input string and then place only valid entries on map
      if (regexflags.test(inputString)) {
        placeInputsOnMap = true;
      } else {
        validArr = inputString.match(extractValidInputRegex);
        if (validArr) {
          inputString = "[" + validArr.toString() + "]";
          placeInputsOnMap = true;
        }
      }
      if (placeInputsOnMap) {
        var inputsArr = JSON.parse(inputString);
        this._addInputsOnMap(inputsArr, type);
      }
    },

    _addInputsOnMap: function (inputsArr, type) {
      if (type === "flags") {
        this._onFlagButtonClick();
      } else if (type === "barriers") {
        this._onBarrierButtonClick();
      }
      array.forEach(inputsArr, lang.hitch(this, function (input) {
        if (type === "skip_locations") {
          var skipObjDetails = {};
          skipObjDetails.controlDetails = {};
          skipObjDetails.controlDetails.selectionGraphic = {};
          skipObjDetails.controlDetails.selectionGraphic.infoTemplate = {};
          skipObjDetails.controlDetails.selectionGraphic.infoTemplate.content = "";
          skipObjDetails.controlDetails.selectionGraphic.bypassed = "";
          skipObjDetails.controlDetails.skipGraphic = input;
          this._onSkipLocationIconClick(skipObjDetails, false);
        } else {
          var mapPoint = new Point(input[0], input[1], this.map.spatialReference);
          this._onMapClick(mapPoint);
        }
      }));
      if (type === "flags") {
        this._onFlagButtonClick();
      } else if (type === "barriers") {
        this._onBarrierButtonClick();
      }
    },

    /**
     * This function is used to run the trace if runTrace parameter value is true
     */
    _runTrace: function (urlObject) {
      if (urlObject.query.hasOwnProperty("runTrace")) {
        if (urlObject.query.runTrace === "true") {
          this._onTraceButtonClick();
        }
      }
    },

    /**
     * This function is used to add the dropdown which contains the options
     * like new project & name of existing projects.
     */
    _addLoadProjectDropdown: function () {
      this._loadProjectDropdown = new Select({
        "class": "esriCTLoadProjectDropDown"
      });
      this._loadProjectDropdown.placeAt(this.loadProjectDropdownContainer);
      this._loadProjectDropdownEvtHandle =
        on.pausable(this._loadProjectDropdown, "change",
          lang.hitch(this, function (evt) {
            this._currentSelectedProjectGuid = evt;
            if (evt !== "newproject") {
              this._loadExistingProject(evt);
            } else {
              domClass.remove(this.editProjectAttributes, "esriCTEditProjectBtn");
              domClass.add(this.editProjectAttributes, "esriCTDisableEditProjectBtn");
              this._clearResults(true);
            }
          }));
      this._loadProjectDropdown.startup();
      this._addDefaultOptionInDropdown();
      this._loadProjectDropdown.set("value", "newproject");
    },

    _loadExistingProject: function (projectId) {
      this._showLoadingIcon(true);
      domClass.remove(this.editProjectAttributes, "esriCTDisableEditProjectBtn");
      domClass.add(this.editProjectAttributes, "esriCTEditProjectBtn");
      this._clearResults(true);
      this._loadProjectData(projectId);
    },

    _displaySaveAndExportButton: function () {
      var exportToCSV;
      array.some(this.config.geoprocessing.outputs, lang.hitch(this, function (outputParam) {
        if (outputParam.exportToCSV) {
          exportToCSV = true;
          this._exportToCSVLayerArray.push({
            "paramName": outputParam.paramName,
            "displayName": outputParam.panelText
          });
        }
      }));
      if (this._isWidgetLoadedInProjectMode) {
        domClass.remove(this.saveButtonContainer, "esriCTHidden");
      }
      if (exportToCSV) {
        domClass.remove(this.exportButtonContainer, "esriCTHidden");
      }
      if (this._isWidgetLoadedInProjectMode && (!exportToCSV)) {
        domClass.add(this.saveAndExportParentContainer, "esriCTTextCenter");
        domClass.add(this.saveButtonContainer, "esriCTSaveButtonCenterContainer");
      }
      if ((!this._isWidgetLoadedInProjectMode) && (exportToCSV)) {
        domClass.add(this.saveAndExportParentContainer, "esriCTTextCenter");
        domClass.add(this.exportButtonContainer, "esriCTExportButtonCenterContainer");
      }
      if ((!this._isWidgetLoadedInProjectMode) && (!exportToCSV)) {
        this._isSaveAndExportHidden = true;
      }
    },

    _resetHeight: function (resetHeightObj) {
      var node, considerSaveAndExport, considerLoadProject, considerSkipAll, skipAllButton,
        resetFlagBarrierSkipLocationMainPage, resetHeightOutputPanel;
      node = resetHeightObj.node;
      considerSaveAndExport = resetHeightObj.considerSaveAndExport;
      considerLoadProject = resetHeightObj.considerLoadProject;
      considerSkipAll = resetHeightObj.considerSkipAll;
      skipAllButton = resetHeightObj.skipAllButton;
      resetFlagBarrierSkipLocationMainPage = resetHeightObj.resetFlagBarrierSkipLocationMainPage;
      resetHeightOutputPanel = resetHeightObj.resetHeightOutputPanel;
      if (resetFlagBarrierSkipLocationMainPage) {
        var inputTabPanelHeight = domStyle.getComputedStyle(this.inputTabPanel).height;
        inputTabPanelHeight = parseFloat(inputTabPanelHeight);
        inputTabPanelHeight = inputTabPanelHeight - 135;
        domStyle.set(node, "height", inputTabPanelHeight + "px");
        return;
      }
      if (resetHeightOutputPanel) {
        var inputOutputTabParentContainerHeight = domStyle.getComputedStyle(this.inputOutputTabParentContainer).height;
        inputOutputTabParentContainerHeight = parseFloat(inputOutputTabParentContainerHeight);
        newHeight = inputOutputTabParentContainerHeight - 30;
        domStyle.set(node, "height", newHeight + "px");
        return;
      }

      var mainContainerHeight = domStyle.getComputedStyle(this.mainParentContentContainer).height;
      mainContainerHeight = parseFloat(mainContainerHeight);
      var newHeight = mainContainerHeight;
      if (considerSaveAndExport) {
        var saveAndExportButtonHeight = domStyle.getComputedStyle(this.saveAndExportParentContainer).height;
        saveAndExportButtonHeight = parseFloat(saveAndExportButtonHeight);
        newHeight = newHeight - saveAndExportButtonHeight;
      }
      if (considerLoadProject) {
        var loadProjectDropdownHeight = domStyle.getComputedStyle(this.loadProjectParentContainer).height;
        loadProjectDropdownHeight = parseFloat(loadProjectDropdownHeight);
        if (loadProjectDropdownHeight.toString() !== "NaN") {
          newHeight = newHeight - loadProjectDropdownHeight;
        }
      }
      if (considerSkipAll) {
        if (skipAllButton && skipAllButton.length > 0) {
          var skipAllButtonHeight = domStyle.getComputedStyle(skipAllButton[0]).height;
          skipAllButtonHeight = parseFloat(skipAllButtonHeight);
          newHeight = newHeight - skipAllButtonHeight;
        }
        newHeight = newHeight - 40;
      }
      domStyle.set(node, "height", newHeight + "px");
    },

    /**
     * This function is used to create a popup for saving new project
     */
    _createNewProjectPopup: function () {
      var createNewProjectPopup, saveAsPopupContainer, projectNameLabel,
        projectNameTextBox, projectNameTextBoxContainer;
      saveAsPopupContainer = domConstruct.create("div", {
        className: "esriCTSaveAsPopupContainer"
      });
      projectNameLabel = domConstruct.create("div", {
        innerHTML: this.nls.projectNameLabel,
        className: "esriCTProjectNameLabel"
      }, saveAsPopupContainer);
      projectNameTextBoxContainer = domConstruct.create("div", {
        className: "esriCTprojectNameTextBoxContainer"
      }, saveAsPopupContainer);
      projectNameTextBox = new ValidationTextBox({
        required: true,
        style: {
          "width": "100%"
        },
        trim: true
      });
      projectNameTextBox.placeAt(projectNameTextBoxContainer);
      projectNameTextBox.startup();
      createNewProjectPopup = new Popup({
        titleLabel: this.nls.saveProjectPopupTitle,
        width: 420,
        maxHeight: 200,
        autoHeight: true,
        content: saveAsPopupContainer,
        'class': this.baseClass,
        "buttons": [{
          label: this.nls.save,
          onClick: lang.hitch(this, function () {
            if (projectNameTextBox.value === "" ||
              projectNameTextBox.value === null ||
              projectNameTextBox.value === undefined) {
              this._setErrorMessage(projectNameTextBox, this.nls.enterProjectNameMessage);
            } else {
              this._showLoadingIcon(true);
              this._saveAsNewProject = true;
              this._checkExistingProjectNames(projectNameTextBox.value, projectNameTextBox, createNewProjectPopup);
            }
          })
        }, {
          label: this.nls.cancel,
          classNames: ['jimu-btn-vacation'],
          onClick: lang.hitch(this, function () {
            this._saveAsNewProject = false;
            createNewProjectPopup.close();
          })
        }],
        onClose: lang.hitch(this, function () {})
      });
    },

    _checkExistingProjectNames: function (projectName, projectNameTextBox, createNewProjectPopup,
      existingProjectAttributeChanged, existingProjectEdited) {
      var layer, queryTask, query;
      layer = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      if (layer) {
        queryTask = new QueryTask(layer.url);
        query = new Query();
        query.outFields = [this._polygonLayerFields.name];
        query.where = "1=1";
        query.returnGeometry = false;
        query.outSpatialReference = this.map.spatialReference;
        queryTask.execute(query).then(lang.hitch(this, function (result) {
          var projectNamesExists;
          projectNamesExists = false;
          array.some(result.features, lang.hitch(this, function (feature) {
            if (feature.attributes[this._polygonLayerFields.name] === projectName) {
              projectNamesExists = true;
              return;
            }
          }));
          if (projectNamesExists && (!existingProjectEdited)) {
            if (createNewProjectPopup) {
              this._setErrorMessage(projectNameTextBox, this.nls.projectNameExistsMessage);
            } else {
              this._errorMessage(this.nls.projectNameExistsMessage);
            }
            this._showLoadingIcon(false);
          } else {
            var projectNameLength = projectName.length;
            projectNameLength = parseInt(projectNameLength, 10);
            if (projectNameLength > this._polygonLayerFields.nameFieldLength) {
              if (createNewProjectPopup) {
                this._setErrorMessage(projectNameTextBox,
                  this.nls.projectLengthErrorMessage + " " + this._polygonLayerFields.nameFieldLength);
              } else {
                this._errorMessage(this.nls.projectLengthErrorMessage + " " + this._polygonLayerFields.nameFieldLength);
              }
              this._showLoadingIcon(false);
            } else {
              if (createNewProjectPopup) {
                createNewProjectPopup.close();
              }
              if (existingProjectAttributeChanged) {
                this._isAttributeChanged = true;
                this._updateExistingProjectAttributes();
              } else {
                this._saveOutagePolygon(projectName);
              }
            }
          }
        }), lang.hitch(this, function () {
          this._saveAsNewProject = false;
          if (createNewProjectPopup) {
            this._setErrorMessage(projectNameTextBox, this.nls.fetchingProjectNamesErrorMessage);
          } else {
            this._errorMessage(this.nls.fetchingProjectNamesErrorMessage);
          }
          this._showLoadingIcon(false);
        }));
      }
    },

    _setErrorMessage: function (projectNameTextBox, message) {
      projectNameTextBox.focus();
      projectNameTextBox.set("state", "Error");
      projectNameTextBox.set("message", message);
      projectNameTextBox.isValid();
    },

    //this function is used to add project name as attribute to the layer
    _saveOutagePolygon: function (projectName) { //save-1
      var layer, graphic, geometry, objectIdField, resultAreaLayer;
      geometry = null;
      resultAreaLayer = this.map.getLayer(this.config.projectSettings.outputParamName + this.id);
      layer = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      objectIdField = layer.objectIdField;
      var attr = {};
      attr[this._polygonLayerFields.name] = projectName;
      if (resultAreaLayer &&
        resultAreaLayer.graphics.length > 0 && resultAreaLayer.graphics[0].geometry) {
        geometry = resultAreaLayer.graphics[0].geometry;
      }
      var selectedProjectValue = this._loadProjectDropdown.getValue();
      if (selectedProjectValue === "newproject" || this._saveAsNewProject) {
        graphic = new Graphic(geometry, null, this._currentFeatureDetails.attributes, null);
      } else {
        graphic = new Graphic(geometry, null, attr, null);
      }
      layer.applyEdits([graphic], null, null, lang.hitch(this, function (results) {
        if (results && results[0] && results[0].success) {
          this._loadProjectDropdownEvtHandle.pause();
          this.addProjectDropdownOpt(results, projectName);
          setTimeout(lang.hitch(this, function () {
            this._loadProjectDropdownEvtHandle.resume();
            this._saveFlagsBarriersAndSkipLocations();
          }), 0);
        } else {
          this._saveAsNewProject = false;
          this._showLoadingIcon(false);
          this._errorMessage(this.nls.creatingNewProjectErrorMessage + " " + results[0].error.message);
        }
      }), lang.hitch(this, function () {
        this._saveAsNewProject = false;
        this._showLoadingIcon(false);
        this._errorMessage(this.nls.creatingNewProjectErrorMessage);
      }));
    },

    addProjectDropdownOpt: function (results, projectName) {
      var globalId = results[0].globalId;
      this._currentSelectedProjectGuid = globalId;
      this._loadProjectDropdown.addOption({
        "value": globalId,
        "label": projectName,
        "objectId": results[0].objectId
      });
    },

    _loadProject: function (resumeProjectDropDownChange, currentlySelectedProjectGuid) {
      var layer, queryTask, query, whereClause;
      layer = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      if (layer) {
        // Honored Map Defined Settings for Project Dropdown.
        // If a filter is set on the project polygon layer the dropdown should filter that feature out.
        whereClause = layer.getDefinitionExpression();
        if (whereClause === "" || whereClause === null || whereClause === undefined) {
          whereClause = "1=1";
        }
        queryTask = new QueryTask(layer.url);
        query = new Query();
        query.outFields = ["*"];
        query.where = whereClause;
        query.returnGeometry = false;
        query.outSpatialReference = this.map.spatialReference;
        queryTask.execute(query).then(lang.hitch(this, function (result) {
          array.forEach(result.features, lang.hitch(this, function (feature) {
            this._loadProjectDropdown.addOption({
              "value": feature.attributes[layer.globalIdField],
              "label": feature.attributes[this._polygonLayerFields.name],
              "objectId": feature.attributes[layer.objectIdField]
            });
          }));
          if (resumeProjectDropDownChange) {
            var currentSelectProjectOptions = this._loadProjectDropdown.getOptions(currentlySelectedProjectGuid);
            if (!currentSelectProjectOptions) {
              this._loadProjectDropdown.set("value", "newproject");
              domClass.remove(this.editProjectAttributes, "esriCTEditProjectBtn");
              domClass.add(this.editProjectAttributes, "esriCTDisableEditProjectBtn");
            } else {
              this._loadProjectDropdown.set("value", currentlySelectedProjectGuid);
            }
            setTimeout(lang.hitch(this, function () {
              this._loadProjectDropdownEvtHandle.resume();
              this._resumeAllClickEvents();
              if (!currentSelectProjectOptions) {
                this._clearResults();
                this._errorMessage(this.nls.filteredProjectLoadMessage);
              }
              this._loadProjectDropdown.set('disabled', false);
              this._showLoadingIcon(false);
            }), 0);
            return;
          }
          this._fetchUrlParameters();
        }), lang.hitch(this, function () {
          if (resumeProjectDropDownChange) {
            this._loadProjectDropdownEvtHandle.resume();
            this._resumeAllClickEvents();
            this._loadProjectDropdown.set('disabled', false);
          }
          this._showLoadingIcon(false);
          this._errorMessage(this.nls.projectNameFetchingErr);
        }));
      }
    },

    //this function is used to handle click event save button
    _onProjectSaveButtonClick: function () {
      if (!domClass.contains(this.projectSaveButton, "jimu-state-disabled")) {
        if (this._currentSelectedProjectGuid === "newproject") {
          this._showLoadingIcon(true);
          this._displayAttributeInspector();
          this._addGraphicToLocalLayer();
        } else {
          this._createEditProjectPopup();
        }
      }
    },

    /**
     * This function is used to check whether selected project is filtered by any other widget,
     * while editing its attributes. If yes, display error message, else continue with the execution.
     */
    _isProjectFiltered: function () {
      var layer, queryTask, query, whereClause;
      layer = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      if (layer) {
        whereClause = layer.getDefinitionExpression();
        if (whereClause === "" || whereClause === null || whereClause === undefined) {
          whereClause = "1=1";
        }
        queryTask = new QueryTask(layer.url);
        query = new Query();
        query.outFields = ["*"];
        query.where = whereClause;
        query.returnGeometry = false;
        query.outSpatialReference = this.map.spatialReference;
        queryTask.execute(query).then(lang.hitch(this, function (result) {
          var isProjectFiltered = true;
          var currentlySelectedProjectGuid = this._loadProjectDropdown.getValue();
          array.forEach(result.features, lang.hitch(this, function (feature) {
            if (currentlySelectedProjectGuid.toLowerCase() === feature.attributes[layer.globalIdField].toLowerCase()) {
              isProjectFiltered = false;
            }
          }));
          if (isProjectFiltered) {
            this._showLoadingIcon(false);
            this._errorMessage(this.nls.filteredProjectMessage);
          } else {
            this._displayAttributeInspector();
            this._loadAttributeInspector();
          }
        }), lang.hitch(this, function () {
          this._showLoadingIcon(false);
          this._errorMessage(this.nls.filteredProjectError);
        }));
      }
    },

    _editProjectAttributes: function () {
      this._showLoadingIcon(true);
      this._isProjectFiltered();
    },

    _isValidProjectAttributes: function () {
      var isValid = true;
      //get all the dijits and check if all have valid values
      //if any dijit have invalid values return false
      if (this._attributeInspector && this._attributeInspector._layerInfos &&
        this._attributeInspector._layerInfos[0].fieldInfos) {
        array.some(this._attributeInspector._layerInfos[0].fieldInfos, function (field) {
          if (field && field.dijit && field.dijit.isValid && !field.dijit.isValid()) {
            field.dijit.focus();
            isValid = false;
            return true;
          }
        }, this);
      }
      return isValid;

    },

    _onOkButtonClick: function () {
      var projectNameTextBox, projectName;
      if (this._currentSelectedProjectGuid === "newproject" || this._saveAsNewProject) {
        this._showLoadingIcon(true);
        projectNameTextBox = this._getProjectNameTextBox();
        projectName = projectNameTextBox.value;
        if (projectName === "" || projectName === null || projectName === undefined) {
          this._errorMessage(this.nls.enterProjectNameMessage);
          this._showLoadingIcon(false);
          return;
        }
        this._saveAsNewProject = true;
        this._checkExistingProjectNames(projectName, null, null);
      } else {
        this._showLoadingIcon(true);
        //if not valid project attributes then return
        if (!this._isValidProjectAttributes()) {
          this._showLoadingIcon(false);
          return;
        }
        projectNameTextBox = this._getProjectNameTextBox();
        projectName = projectNameTextBox.value;
        if (projectName === "" || projectName === null || projectName === undefined) {
          this._errorMessage(this.nls.enterProjectNameMessage);
          this._showLoadingIcon(false);
          return;
        }
        var selectedProjectValue = this._loadProjectDropdown.getValue();
        var selectedProjectOptions = this._loadProjectDropdown.getOptions(selectedProjectValue);
        var existingProjectEdited = false;
        if (projectName === selectedProjectOptions.label) {
          existingProjectEdited = true;
        }
        this._checkExistingProjectNames(projectName, null, null, true, existingProjectEdited);
      }
    },

    /**
     * This function is used to update existing project attributes like name etc...
     */
    _updateExistingProjectAttributes: function () {
      //else if attributes are updated then save it else only hide Attributeinspector
      if (this._isAttributeChanged) {
        this._showLoadingIcon(true);
        this._isAttributeChanged = false;
        this._updateProjectAttributes();
      } else {
        this._hideAttributeInspector();
      }
    },

    _hideAttributeInspector: function () {
      this._clearAttributeInspectorData();
      domClass.add(this.editAttributeContainer, "esriCTHidden");
      this._displayEntireMainScreen();
    },

    _clearAttributeInspectorData: function () {
      //clear previous selections of layer
      if (this._attributeInspector) {
        //as now prev attribute inspector could have multiple features of multiple layer
        //clear selections of all layers in layer infos
        if (this._attributeInspector.layerInfos) {
          array.forEach(this._attributeInspector.layerInfos, function (layerInfo) {
            var layer = layerInfo.featureLayer;
            layer.clearSelection();
            layer.refresh();
          });
        }
        this._attributeInspector.destroy();
      }
    },

    _loadAttributeInspector: function () {
      var fieldInfos, projectAttributesLayer, featureLayerQuery, attributeTable;
      fieldInfos = this._createFieldInfos();
      domConstruct.empty(this.attributeInspectorContainer);
      projectAttributesLayer = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      var attributeInspectorWidget = declare([AttributeInspector], {
        constructor: function () {
          this._aiConnects = [];
          this._selection = [];
          this._toolTips = [];
        }
      });
      this._attributeInspector = new attributeInspectorWidget({
        layerInfos: [{
          'featureLayer': projectAttributesLayer,
          'showAttachments': false,
          'isEditable': true,
          'fieldInfos': fieldInfos
        }]
      }, domConstruct.create("div"));
      this._attributeInspector.on("attribute-change", lang.hitch(this, function (evt) {
        this._isAttributeChanged = true;
        this._projectAttributeGraphic.attributes[evt.fieldName] = evt.fieldValue;
      }));
      this.attributeInspectorContainer.appendChild(this._attributeInspector.domNode);
      featureLayerQuery = new Query();
      var uniqueValue = Date.now();
      featureLayerQuery.where =
        projectAttributesLayer.globalIdField + "='" +
        this._loadProjectDropdown.getValue() + "'" +
        " AND " + uniqueValue + " = " + uniqueValue;
      featureLayerQuery.outFields = ["*"];
      projectAttributesLayer.selectFeatures(featureLayerQuery, FeatureLayer.SELECTION_NEW,
        lang.hitch(this, function (selectedFeature) {
          this._projectAttributeGraphic = selectedFeature[0];
          attributeTable = this._attributeInspector.attributeTable.childNodes[0];
          domAttr.set(attributeTable, "cellspacing", "5");
          domAttr.set(attributeTable, "cellpadding", "5");
          this._showLoadingIcon(false);
        }), lang.hitch(this, function () {
          this._showLoadingIcon(false);
          this._errorMessage(this.nls.projectAttributeLoadingErr);
        })
      );
    },

    _updateProjectAttributes: function () {
      var projectAttributesLayer = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      projectAttributesLayer.applyEdits(null, [this._projectAttributeGraphic], null,
        lang.hitch(this, function (adds, updates, deletes) { // jshint ignore:line
          if (updates && updates[0] && updates[0].success) {
            this._loadProjectDropdownEvtHandle.pause();
            var globalId = this._currentSelectedProjectGuid;
            var option = this._loadProjectDropdown.getOptions(globalId);
            var objectId = option.objectId;
            this._loadProjectDropdown.removeOption(option);
            this._loadProjectDropdown.addOption({
              "label": this._projectAttributeGraphic.attributes[this._polygonLayerFields.name],
              "value": globalId,
              "objectId": objectId
            });
            this._loadProjectDropdown.set("value", globalId);
            setTimeout(lang.hitch(this, function () {
              this._loadProjectDropdownEvtHandle.resume();
              this._hideAttributeInspector();
              this._showLoadingIcon(false);
              this._errorMessage(this.nls.attributeUpdatedMsg);
            }), 0);
          } else {
            this._showLoadingIcon(false);
            this._errorMessage(this.nls.projectAttributeUpdatingErr + " " + updates[0].error.message);
          }
        }), lang.hitch(this, function () {
          this._showLoadingIcon(false);
          this._errorMessage(this.nls.projectAttributeUpdatingErr);
        })
      );
    },

    _createFieldsDetailsObject: function () {
      var fieldDetailsObj = {};
      array.forEach(this._projectLayerInfo.layerObject.fields, lang.hitch(this, function (field) {
        fieldDetailsObj[field.name] = field.type;
      }));
      return fieldDetailsObj;
    },

    _createFieldInfos: function () {
      var fieldInfos, allFieldsInfo;
      //if popup is enabled and has valid  infoTemplate use it else get field infos form layer
      this._projectLayerInfo = this._layerInfosObj.getLayerInfoById(this.config.projectSettings.polygonLayerId);
      var fieldsDetailsObj = this._createFieldsDetailsObject();
      allFieldsInfo = this._getFieldInfosFromLayer(this._projectLayerInfo);
      if (this._projectLayerInfo.controlPopupInfo &&
        this._projectLayerInfo.controlPopupInfo.enablePopup &&
        this._projectLayerInfo.controlPopupInfo.infoTemplate) {
        allFieldsInfo = lang.clone(this._projectLayerInfo.controlPopupInfo.infoTemplate.info.fieldInfos);
      }
      fieldInfos = [];
      array.forEach(allFieldsInfo, lang.hitch(this, function (field) {
        //skip fields which are not visible
        if (field.visible &&
          fieldsDetailsObj[field.fieldName] &&
          fieldsDetailsObj[field.fieldName] !== "esriFieldTypeRaster" &&
          fieldsDetailsObj[field.fieldName] !== "esriFieldTypeBlob") {
          //Make required to projectName field
          if (field.fieldName === this._polygonLayerFields.name) {
            field.nullable = false;
          }
          fieldInfos.push(field);
        }
      }));
      return fieldInfos;
    },

    /**
     * Function to merge objects
     */
    mergeFirstToLast: function () {
      var obj = {},
        i = arguments.length - 1,
        il = 0,
        key;
      for (; i >= il; i--) {
        for (key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) {
            obj[key] = arguments[i][key];
          }
        }
      }
      return obj;
    },

    _getFieldInfosFromLayer: function (layerInfo) {
      var fieldInfos = [];
      if (layerInfo && layerInfo.layerObject) {
        array.forEach(layerInfo.layerObject.fields, function (field) {
          var fieldInfo = utils.getDefaultPortalFieldInfo(field);
          fieldInfo = this.mergeFirstToLast(fieldInfo, field);
          if (fieldInfo.format &&
            fieldInfo.format.dateFormat &&
            fieldInfo.format.dateFormat.toLowerCase() &&
            fieldInfo.format.dateFormat.toLowerCase().indexOf('time') >= 0) {
            fieldInfo.format.time = true;
          }
          fieldInfo.visible = true;
          //Make required to projectName field
          if (fieldInfo.fieldName === this._polygonLayerFields.name) {
            field.nullable = false;
          }
          fieldInfos.push(fieldInfo);
        }, this);
      }
      return fieldInfos;
    },

    _getLayerInfos: function () {
      LayerInfos.getInstance(this.map,
        this.map.webMapResponse.itemInfo).then(lang.hitch(this, function (layerInfosObj) {
        this._layerInfosObj = layerInfosObj;
        //If project settings are valid then onnly get fields for the layers
        if (this.config.projectSettings &&
          this.config.projectSettings.polygonLayerId &&
          this.config.projectSettings.pointLayerId) {
          this._getPointLayerFields();
          this._getPolygonLayerFields();
        }
        this._loadWidget();
      }));
    },

    _createLoadProjectDetailsObj: function () {
      this._loadProjectDetailsObj = {};
      array.forEach(this.config.geoprocessing.outputs, lang.hitch(this, function (output) {
        //if output param is result outParam and save to layer is not configured then
        //use the confiugred project polygon layer only to fetch the result
        if (this.config.projectSettings &&
          output.paramName === this.config.projectSettings.outputParamName &&
          !output.saveToLayer && this.config.projectSettings.polygonLayerId) {
          output.saveToLayer = this.config.projectSettings.polygonLayerId;
        }
        //if save to layer is configured and
        //configured layer available in map then only add to object
        if (output.saveToLayer && this.map.getLayer(output.saveToLayer)) {
          this._loadProjectDetailsObj[output.paramName] = {
            "layerID": output.saveToLayer,
            "guidfield": output.guidField,
            "parameternamefield": output.parameternameField
          };
        }
      }));
    },

    _loadProjectData: function (projectId) {
      this._queryOutagePolygon(projectId);
    },

    _loadOutagePolygon: function (graphic) {
      var outagePolygonLayer = this.map.getLayer(this.config.projectSettings.outputParamName + this.id);
      if (outagePolygonLayer) {
        outagePolygonLayer.add(graphic);
      }
    },

    _queryOutagePolygon: function (projectId) {
      var query, queryTask, polygonLayer;
      polygonLayer = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      queryTask = new QueryTask(polygonLayer.url);
      query = new Query();
      query.outFields = ["*"];
      query.where = polygonLayer.globalIdField + "='" + projectId + "'";
      query.returnGeometry = true;
      query.outSpatialReference = this.map.spatialReference;
      queryTask.execute(query).then(lang.hitch(this, function (result) {
        if (result && result.features.length > 0) {
          var graphic;
          graphic = new Graphic(result.features[0].geometry, null, result.features[0].attributes, null);
          this._loadOutagePolygon(graphic);
        }
        this._queryFlagsBarriersAndSkipLocation(projectId);
      }), lang.hitch(this, function () {
        this._showLoadingIcon(false);
        this._errorMessage(this.nls.fetchingOutagePolygonMessage);
      }));
    },

    _queryFlagsBarriersAndSkipLocation: function (projectId) {
      var query, pointLayer, queryTask;
      pointLayer = this.map.getLayer(this.config.projectSettings.pointLayerId);
      queryTask = new QueryTask(pointLayer.url);
      query = new Query();
      query.outFields = ["*"];
      query.where = "projectid='" + projectId + "'";
      query.returnGeometry = true;
      query.outSpatialReference = this.map.spatialReference;
      queryTask.execute(query).then(lang.hitch(this, function (result) {
        this._allProjectLoadedInputs = result.features;
        this._segregateInputs(result.features);
      }), lang.hitch(this, function () {
        this._showLoadingIcon(false);
        this._errorMessage(this.nls.loadingProjectDetailsErrorMessage);
      }));
    },

    _segregateInputs: function (result) {
      var flagsArr, barriersArr, skipLocationsArr;
      flagsArr = [];
      barriersArr = [];
      skipLocationsArr = [];
      if (result && result.length > 0 &&
        this._pointLayerFields && this._pointLayerFields.inputType) {
        array.forEach(result, lang.hitch(this, function (input) {
          switch (input.attributes[this._pointLayerFields.inputType]) {
            case "Flag":
              flagsArr.push([input.geometry.x, input.geometry.y]);
              break;
            case "Barrier":
              barriersArr.push([input.geometry.x, input.geometry.y]);
              break;
            case "Skip":
              skipLocationsArr.push(input);
              break;
          }
        }));
      }
      this._addInputsOnMap(flagsArr, "flags");
      this._addInputsOnMap(barriersArr, "barriers");
      this._addInputsOnMap(skipLocationsArr, "skip_locations");
      this._fetchFeatures();

    },

    _onSkipLocationIconClick: function (resultItem, manual, btnBypassDiv) {
      var skippedFeatureUniqueId, skipLocationInfo;
      if (this._skipLocationGraphicsLayer !== null) {
        //check if location is already skiped then show msg if required and
        //add skip skippedFeatureUniqueId to it, so that it will help while removing skipped locations
        skipLocationInfo = this._checkSkipLocationXY(resultItem.controlDetails.skipGraphic);
        if (skipLocationInfo.isFeatureSkipped) {
          if (btnBypassDiv) {
            domAttr.set(btnBypassDiv, "skippedFeatureUniqueId",
              skipLocationInfo.skippedFeatureUniqueId);
          }
          if (!this._skipAllLocationButtonClicked) {
            this._errorMessage(this.nls.locationAlreadySkippedMessage);
          }
        } else {
          this._skipLocationCount++;
          this._inputSkip++;
          skippedFeatureUniqueId = this._inputSkip;
          // set the unique identification to features that is skipped.
          // It is always incremental and gets set to 0 on clear.
          this._skippedLocations[skippedFeatureUniqueId] = resultItem.controlDetails.skipGraphic;
          this._addSkipLocation("Skip", skippedFeatureUniqueId);
          this._skipLocationGraphicsLayer.add(resultItem.controlDetails.skipGraphic);
          resultItem.controlDetails.selectionGraphic.bypassed = true;
          //while skipping locations add skippedFeatureUniqueId attr
          //so that it will help while removing skipped locations
          if (btnBypassDiv) {
            domAttr.set(btnBypassDiv, "skippedFeatureUniqueId", this._inputSkip);
          }
          if ((!this._skipAllLocationButtonClicked) && manual) {
            this._errorMessage(this.nls.locationSkippedMessage);
          }
        }
      }
    },

    _deleteExistingInputs: function () { //edit-2
      var pointLayer = this.map.getLayer(this.config.projectSettings.pointLayerId);
      pointLayer.applyEdits(null, null, this._allProjectLoadedInputs, lang.hitch(this, function () {
        this._saveFlagsBarriersAndSkipLocations();
      }), lang.hitch(this, function () {
        this._saveAsNewProject = false;
        this._updateExistingProject = false;
        this._showLoadingIcon(false);
        this._errorMessage(this.nls.deletingExistingPolygonErr);
      }));
    },
    _getPolygonLayerFields: function () {
      var polygonLayerInfo, polygonLayerFieldsCount = 0;
      this._polygonLayerFields = {
        "name": "",
        "projectId": ""
      };
      polygonLayerInfo =
        this._layerInfosObj.getLayerInfoById(this.config.projectSettings.polygonLayerId);
      //if polygon layer info and layerObject available then get the fields
      if (polygonLayerInfo && polygonLayerInfo.layerObject) {
        array.some(polygonLayerInfo.layerObject.fields, function (field) {
          var fieldName = field.name.toLowerCase();
          if (fieldName === "name") {
            this._polygonLayerFields.name = field.name;
            this._polygonLayerFields.nameFieldLength = field.length;
            polygonLayerFieldsCount++;
          }
          if (field.type === "esriFieldTypeGlobalID") {
            this._polygonLayerFields.projectId = field.name;
            polygonLayerFieldsCount++;
          }
          if (polygonLayerFieldsCount === 2) {
            return true;
          }
        }, this);
      }
    },

    _getPointLayerFields: function () {
      var pointLayerInfo, pointLayerFieldsCount = 0;
      this._pointLayerFields = {
        "inputType": "",
        "projectId": ""
      };
      pointLayerInfo =
        this._layerInfosObj.getLayerInfoById(this.config.projectSettings.pointLayerId);
      //if point layer info and layerObject available then get the fields
      if (pointLayerInfo && pointLayerInfo.layerObject) {
        array.some(pointLayerInfo.layerObject.fields, function (field) {
          var fieldName = field.name.toLowerCase();
          if (fieldName === "inputtype") {
            this._pointLayerFields.inputType = field.name;
            pointLayerFieldsCount++;
          }
          if (fieldName === "projectid") {
            this._pointLayerFields.projectId = field.name;
            pointLayerFieldsCount++;
          }
          if (pointLayerFieldsCount === 2) {
            return true;
          }
        }, this);
      }
    },

    _createInputLocations: function (graphics, type) {
      var inputArr = [];
      array.forEach(graphics, lang.hitch(this, function (flagGraphic) {
        var graphic, attributes = {};
        attributes[this._pointLayerFields.projectId] = this._currentSelectedProjectGuid;
        attributes[this._pointLayerFields.inputType] = type;
        graphic = new Graphic(flagGraphic.geometry, null, attributes, null);
        inputArr.push(graphic);
      }));
      return inputArr;
    },

    _saveFlagsBarriersAndSkipLocations: function () { //save-2 //edit-3
      var inputArr, flags, barriers, skipLocations;
      flags = [];
      barriers = [];
      skipLocations = [];
      inputArr = [];
      //Create input locations according the types and create array
      if (this._flagGraphicsLayer) {
        flags = this._createInputLocations(this._flagGraphicsLayer.graphics, "Flag");
      }
      if (this._barrierGraphicsLayer) {
        barriers = this._createInputLocations(this._barrierGraphicsLayer.graphics, "Barrier");
      }
      if (this._skipLocationGraphicsLayer) {
        skipLocations =
          this._createInputLocations(this._skipLocationGraphicsLayer.graphics, "Skip");
      }
      inputArr = inputArr.concat(flags, barriers, skipLocations);
      var pointLayer = this.map.getLayer(this.config.projectSettings.pointLayerId);
      var objectIdField = pointLayer.objectIdField;
      pointLayer.applyEdits(inputArr, null, null, lang.hitch(this, function (adds, updates, deletes) { // jshint ignore:line
        this._allProjectLoadedInputs = [];
        array.forEach(adds, lang.hitch(this, function (add) {
          if (add.success) {
            var attributes = {};
            attributes[objectIdField] = add.objectId;
            var graphic = new Graphic(null, null, attributes, null);
            this._allProjectLoadedInputs.push(graphic);
          }
        }));
        if (this._saveAsNewProject) {
          this._addProjectFeatures();
        } else {
          this._deleteExistingProjectFeatures();
        }
      }), lang.hitch(this, function () {
        this._saveAsNewProject = false;
        this._updateExistingProject = false;
        this._showLoadingIcon(false);
        this._errorMessage(this.nls.savingProjectDetailsErr);
      }));
    },

    _updateOutagePolygon: function () { //edit-1
      var geometry;
      geometry = null;
      var polygonLayer = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      var objectIdField = polygonLayer.objectIdField;
      var objectId = this._loadProjectDropdown.getOptions(this._currentSelectedProjectGuid).objectId;
      var attributes = {};
      attributes[objectIdField] = objectId;
      var outagePolygonLayer = this.map.getLayer(this.config.projectSettings.outputParamName + this.id);
      if (outagePolygonLayer.graphics.length > 0 && outagePolygonLayer.graphics[0].geometry) {
        geometry = outagePolygonLayer.graphics[0].geometry;
      }
      if (geometry !== null && geometry !== undefined && geometry !== "") {
        var graphic = new Graphic(geometry, null, attributes, null);
        polygonLayer.applyEdits(null, [graphic], null, lang.hitch(this, function (adds, updates, deletes) { // jshint ignore:line
          if (updates.length > 0 && updates[0].success) {
            this._deleteExistingInputs();
          } else {
            this._saveAsNewProject = false;
            this._updateExistingProject = false;
            this._showLoadingIcon(false);
            this._errorMessage(this.nls.updatingOutagePolygonErr);
          }
        }), lang.hitch(this, function () {
          this._saveAsNewProject = false;
          this._updateExistingProject = false;
          this._showLoadingIcon(false);
          this._errorMessage(this.nls.updatingOutagePolygonErr);
        }));
      } else {
        this._deleteExistingInputs();
      }
    },

    _deleteExistingProjectFeatures: function () { //edit-4
      var deleteFeatureArr, deferredObj = {};
      for (var paramName in this._loadProjectDetailsObj) {
        var deleteFeatures = true;
        //If paramName is same as result param and the layer is same as Polygon layer
        //then dont delete the features from here. Deleteing of project polygon handeled seperately
        if (this.config.projectSettings &&
          this.config.projectSettings.outputParamName &&
          this.config.projectSettings.polygonLayerId &&
          paramName === this.config.projectSettings.outputParamName &&
          this._loadProjectDetailsObj[paramName].layerID === this.config.projectSettings.polygonLayerId) {
          deleteFeatures = false;
        }
        if (deleteFeatures) {
          deleteFeatureArr = this._fetchedFeaturesDetails[paramName].features;
          if (deleteFeatureArr.length > 0) {
            deferredObj[paramName] = this._deleteFeaturesDeferred(paramName);
          }
        }
      }
      all(deferredObj).then(lang.hitch(this, function () {
        this._addProjectFeatures();
      }), lang.hitch(this, function () {
        this._saveAsNewProject = false;
        this._updateExistingProject = false;
        this._showLoadingIcon(false);
        this._errorMessage(this.nls.deletingExistingProjectFeaturesErr);
      }));
    },

    _deleteFeaturesDeferred: function (paramName) {
      var featureLayer, deleteFeatureArr, filteredDeleteFeatureArr, deferred, objectIdField;
      featureLayer = this.map.getLayer(this._loadProjectDetailsObj[paramName].layerID);
      deleteFeatureArr = this._fetchedFeaturesDetails[paramName].features;
      filteredDeleteFeatureArr = [];
      objectIdField = featureLayer.objectIdField;
      array.forEach(deleteFeatureArr, lang.hitch(this, function (deleteFeature) {
        var attr, graphic;
        attr = {};
        attr[objectIdField] = deleteFeature.attributes[objectIdField];
        graphic = new Graphic(null, null, attr, null);
        filteredDeleteFeatureArr.push(graphic);
      }));
      deferred = featureLayer.applyEdits(null, null, filteredDeleteFeatureArr);
      return deferred.promise;
    },

    _addProjectFeatures: function () { //save-3 //edit-5
      var deferredObj = {};
      for (var paramName in this._loadProjectDetailsObj) {
        var addFeatures = true;
        if (this.config.projectSettings &&
          this.config.projectSettings.outputParamName &&
          this.config.projectSettings.polygonLayerId &&
          paramName === this.config.projectSettings.outputParamName &&
          this._loadProjectDetailsObj[paramName].layerID === this.config.projectSettings.polygonLayerId) {
          addFeatures = false;
        }
        var graphicsLayer = this.map.getLayer(paramName + this.id);
        if (addFeatures && graphicsLayer) {
          if (graphicsLayer.graphics.length > 0) {
            deferredObj[paramName] = this._addFeaturesDeferred(paramName);
          }
        }
      }
      all(deferredObj).then(lang.hitch(this, function () {
        if (this._saveAsNewProject) {
          this._clearResults();
          this._loadProjectDropdown.set("value", this._currentSelectedProjectGuid);
        } else {
          if (this._updateExistingProject) {
            this._loadExistingProject(this._currentSelectedProjectGuid);
          } else {
            this._saveAsNewProject = false;
            this._updateExistingProject = false;
            this._showLoadingIcon(false);
          }
        }
      }), lang.hitch(this, function () {
        this._saveAsNewProject = false;
        this._updateExistingProject = false;
        this._showLoadingIcon(false);
        this._errorMessage(this.nls.addingProjectFeaturesErr);
      }));
    },

    _addFeaturesDeferred: function (paramName) {
      var selectedProjectGuid, graphicsArr, graphicsLayer, featureLayer, deferred, featureLayerFieldsObj;
      featureLayerFieldsObj = {};
      graphicsArr = [];
      selectedProjectGuid = this._currentSelectedProjectGuid;
      graphicsLayer = this.map.getLayer(paramName + this.id);
      featureLayer = this.map.getLayer(this._loadProjectDetailsObj[paramName].layerID);
      array.forEach(featureLayer.fields, lang.hitch(this, function (field) {
        featureLayerFieldsObj[field.name] = field.type;
      }));
      array.forEach(graphicsLayer.graphics, lang.hitch(this, function (graphic) {
        var attr = {};
        // Before saving the features, match following things
        // 1. Name of the feature attribute should be matched with the field name of its param & feature layer
        // 2. Datatype of the feature attribute should be matched with the data type of its param & feature layer
        // There were few cases, in which datatype of the attributes were not getting matched & hence entire feature
        // were not saved. By implementing this, only the attributes which gets exactly matched by its name & datatype
        // are saved. Rest are ignored.
        for (var attribute in graphic.attributes) {
          if (this._gpServiceOutputParameterObj[paramName][attribute] &&
            featureLayerFieldsObj[attribute] &&
            this._gpServiceOutputParameterObj[paramName][attribute] === featureLayerFieldsObj[attribute]) {
            attr[attribute] = graphic.attributes[attribute];
          }
        }
        //store project id and param naem in each features
        attr[this._loadProjectDetailsObj[paramName].guidfield] = selectedProjectGuid;
        attr[this._loadProjectDetailsObj[paramName].parameternamefield] = paramName;
        var graphicObj = new Graphic(graphic.geometry, null, attr, null);
        graphicsArr.push(graphicObj);
      }));
      deferred = featureLayer.applyEdits(graphicsArr, null, null);
      return deferred.promise;
    },

    _queryLayerDeferred: function (paramName) {
      var query, queryTask, selectedProjectGuid, featureLayer;
      selectedProjectGuid = this._currentSelectedProjectGuid;
      featureLayer = this.map.getLayer(this._loadProjectDetailsObj[paramName].layerID);
      queryTask = new QueryTask(featureLayer.url);
      query = new Query();
      query.outFields = ["*"];
      //if result param layer is same as poygon layer set the where clause using projectid field
      //else for all other params use the configured GUID
      if (this.config.projectSettings &&
        this.config.projectSettings.outputParamName &&
        this.config.projectSettings.polygonLayerId &&
        paramName === this.config.projectSettings.outputParamName &&
        this._loadProjectDetailsObj[paramName].layerID === this.config.projectSettings.polygonLayerId) {
        query.where = this._polygonLayerFields.projectId + "='" + selectedProjectGuid + "'";
      } else if (this._loadProjectDetailsObj[paramName].guidfield &&
        this._loadProjectDetailsObj[paramName].parameternamefield) {
        //create where clause using project id and parameter name,
        //as same layer can be used multiple times in outparams (after implementing #47)
        query.where = this._loadProjectDetailsObj[paramName].guidfield + "='" + selectedProjectGuid + "' and " +
          this._loadProjectDetailsObj[paramName].parameternamefield + "='" + paramName + "'";
      }
      // In backward compatibility mode, "parameternamefield" is undefined and hence where clause is not formed
      // and remains empty. Due to this, query fails and user receives error message and output panel is not
      // formed. In order to form output panel, for backward compatibility, where clause is formed which gives
      // zero results.
      if (query.where === "" || query.where === null || query.where === undefined) {
        query.where = "1!=1";
      }
      query.returnGeometry = true;
      query.outSpatialReference = this.map.spatialReference;
      var deferred = queryTask.execute(query);
      return deferred.promise;
    },

    _fetchFeatures: function () {
      this._executeTracePreRequisites(false);
      var deferredObj = {};
      for (var paramName in this._loadProjectDetailsObj) {
        deferredObj[paramName] = this._queryLayerDeferred(paramName);
      }
      all(deferredObj).then(lang.hitch(this, function (paramFeatures) {
        this._fetchedFeaturesDetails = paramFeatures;
        this._resetSubmitJobDetails();
        for (var paramName in paramFeatures) {
          var features = paramFeatures[paramName].features;
          //if showing result outparam and the feature is not having geometry then
          //set show 0 in result area
          if (paramName === this.config.projectSettings.outputParamName &&
            features && features.length > 0 && !features[0].geometry) {
            features = [];
          }
          this._createGPResultObj(paramName,
            features,
            paramFeatures[paramName].geometryType);
        }
        array.forEach(this.config.geoprocessing.outputs, lang.hitch(this, function (output, index) {
          //set zero features to all those unmapped outparams and
          //set the fetched features in config object for later use
          if (!paramFeatures.hasOwnProperty(output.paramName)) {
            this._createGPResultObj(output.paramName, [],
              "esriGeometryPoint");
            this.config.geoprocessing.outputs[index].results = [];
          } else {
            this.config.geoprocessing.outputs[index].results = paramFeatures[output.paramName];
          }
        }));
        this._zoomToProject();
        if (this._saveAsNewProject) {
          this._saveAsNewProject = false;
        } else {
          if (this._updateExistingProject) {
            this._updateExistingProject = false;
          }
        }
        this._showLoadingIcon(false);
      }), lang.hitch(this, function () {
        this._showLoadingIcon(false);
        this._errorMessage(this.nls.loadingProjectFeaturesErr);
      }));
    },

    _createGPResultObj: function (paramName, features, geometryType) {
      var result = {};
      result.paramName = paramName;
      result.value = {};
      result.value.features = features;
      result.value.geometryType = geometryType;
      this._showGPResults(result);
    },

    _executeTracePreRequisites: function (runGPExecution) {
      var resultMainDiv, i;
      this._outputResultArr = [];
      this._outputResultCount = 0;
      this.overviewFeature = null;
      this.savedFeatureObjectId = null;
      domConstruct.empty(this.resultLayersInformationContainer);
      resultMainDiv = query(".esriCTFeaturesListParentContainer", this._widgetTopNode);
      for (i = 0; i < resultMainDiv.length; i++) {
        domConstruct.empty(resultMainDiv[i]);
      }
      this.enableWebMapPopup();
      if (runGPExecution) {
        if (this._gpServiceOutputParameter) {
          this._GPExecute();
        } else {
          this._getFieldAliasFromGPService(true);
        }
      }
    },

    _resetSubmitJobDetails: function () {
      this.overExtent = null;
      this.resultsCnt = 0;
      this.outputStrings = {};
    },

    _showGPResults: function (result) {
      this._onGetResultDataComplete(result);
      this.resultsCnt++;
      if (this.resultsCnt === this.config.geoprocessing.outputs.length) {
        if (this.config.autoZoomAfterTrace) {
          this._zoomToProject();
        }
        domClass.remove(this.exportToCsvMainScreenButton, "jimu-state-disabled");
        this._showLoadingIcon(false);
        this._displayOutputPanel(true);
        // Only enable save button when clicks on run trace button,
        // Save button should not be enabled when existing project is loaded
        if (this._isRunButtonClicked) {
          this._isRunButtonClicked = false;
          this._enableProjectSaveButton();
        }
      }
    },

    _zoomToProject: function () {
      var graphics = [],
        filteredGraphicsArr;
      filteredGraphicsArr = [];
      //get all inputs graphics
      array.forEach(this.config.geoprocessing.inputs, function (input) {
        if (input && input.paramName && this.map.getLayer(input.paramName + this.id)) {
          graphics = graphics.concat(this.map.getLayer(input.paramName + this.id).graphics);
        }
      }, this);
      //get all output graphics
      array.forEach(this.config.geoprocessing.outputs, function (input) {
        if (input && input.paramName && this.map.getLayer(input.paramName + this.id)) {
          graphics = graphics.concat(this.map.getLayer(input.paramName + this.id).graphics);
        }
      }, this);
      //if have any graphics then set the combined extent so that all graphics are visbile
      if (graphics.length > 0) {
        //also consider only those graphics which have geometries
        array.forEach(graphics, lang.hitch(this, function (graphic) {
          if (graphic.geometry) {
            filteredGraphicsArr.push(graphic);
          }
        }));
        if (filteredGraphicsArr.length > 0) {
          this.map.setExtent(graphicsUtils.graphicsExtent(filteredGraphicsArr).expand(1.5));
        }
      }
    },

    _createEditProjectPopup: function () {
      var saveProjectPopupContainer, editExistingProjectPopup, loadProjectDropdownlabel, saveChangesMsg;
      loadProjectDropdownlabel = this._loadProjectDropdown.getOptions(this._currentSelectedProjectGuid).label;
      saveProjectPopupContainer = domConstruct.create("div", {
        className: "esriCTSaveProjectPopupContainer"
      });
      saveChangesMsg = domConstruct.create("div", {
        innerHTML: esriLang.substitute({
            loadProjectDropdownlabel: loadProjectDropdownlabel
          },
          this.nls.saveChangesMsg
        )
      }, saveProjectPopupContainer);
      editExistingProjectPopup = new Popup({
        titleLabel: this.nls.saveProjectPopupTitle,
        width: 500,
        maxHeight: 200,
        autoHeight: true,
        content: saveProjectPopupContainer,
        'class': this.baseClass,
        "buttons": [{
            label: this.nls.save,
            onClick: lang.hitch(this, function () {
              this._saveAsNewProject = false;
              this._updateExistingProject = true;
              this._showLoadingIcon(true);
              this._updateOutagePolygon();
              editExistingProjectPopup.close();
            })
          }, {
            label: this.nls.saveAsLabel,
            onClick: lang.hitch(this, function () {
              this._showLoadingIcon(true);
              this._saveAsNewProject = true;
              editExistingProjectPopup.close();
              this._displayAttributeInspector();
              this._addGraphicToLocalLayer();
            })
          },
          {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              this._saveAsNewProject = false;
              this._updateExistingProject = false;
              editExistingProjectPopup.close();
            })
          }
        ],
        onClose: lang.hitch(this, function () {})
      });
    },

    _onExportToCSVFormOkBtnClick: function () {
      if (!(domClass.contains(this.exportToCsvFileMainButton, "jimu-state-disabled"))) {
        var selectedForExport = [];
        this._showLoadingIcon(true);
        array.forEach(this._exportToCSVLayerArray, lang.hitch(this, function (exportToCSVObj) {
          var isChecked = exportToCSVObj.checkbox.getValue();
          if (isChecked) {
            selectedForExport.push(exportToCSVObj.paramName);
          }
        }));
        this._downloadCSV(selectedForExport);
      }
    },

    _onExportToCSVFormBackBtnClick: function () {
      this._hideExportToCSVForm();
      this.resize();
    },

    /**
     * This function is used to hide export to csv form.
     */
    _hideExportToCSVForm: function () {
      domClass.add(this.exportToCSVFormParentContainer, "esriCTHidden");
      this._displayMainScreen();
    },

    /**
     * This Function will display Runtrace panel when click on back button.
     */
    _onExportToLayerButtonClick: function () {
      if (!domClass.contains(this.exportToCsvMainScreenButton, "jimu-state-disabled")) {
        domClass.remove(this.exportToCsvFileMainButton, "jimu-state-disabled");
        this._clearSelectionOnBackBtnClk();
        this._hideEntireMainScreen();
        this._hideFlagsList(false);
        this._hideBarrierList(false);
        this._hideSkipLocationList(false);
        domClass.remove(this.exportToCSVFormParentContainer, "esriCTHidden");
        domConstruct.empty(this.exportToCSVFormContainer);
        this._displayExportToCSVParamList();
      }
    },

    _downloadCSV: function (selectedForExport) {
      array.forEach(selectedForExport, lang.hitch(this, function (paramName) {
        var defs;
        defs = [];
        array.forEach(this.config.geoprocessing.outputs, lang.hitch(this,
          function (output) {
            if (paramName === output.paramName && output.results) {
              defs.push(this._createCSVContent(output.results, output.paramName).promise);
            }
          }));
        all(defs).then(lang.hitch(this, function (results) {
          if (results.length !== 0) {
            var TempString;
            array.forEach(results, function (result) {
              TempString = (result.csvdata).split(",");
              lang.hitch(this, this._exportToCSVComplete(result, TempString[0], result.orgResults));
            }, this);
          }
        }), lang.hitch(this, function (error) {
          this._errorMessage(error);
        }));
      }));
      this._showLoadingIcon(false);
      this._errorMessage(this.nls.exportToCSVSuccess);
    },

    _displayExportToCSVParamList: function () {
      this._createExportToCSVRow(this.nls.exportSelectAllCheckBoxLabel, true);
      array.forEach(this._exportToCSVLayerArray, lang.hitch(this, function (exportToCSVObj) {
        this._createExportToCSVRow(exportToCSVObj);
      }));
    },

    _createExportToCSVRow: function (exportToCSVObj, isSelectAll) {
      var label, parentNode, canDownloadMultipleFiles, userAgentInfo;

      //get the user agent info to detect if browser is safari/firefox
      //in Safari & firefox browser is limiting to download only one file
      //so set canDownloadMultipleFiles to false
      userAgentInfo = utils.detectUserAgent();
      if (userAgentInfo.browser.firefox || userAgentInfo.browser.safari) {
        canDownloadMultipleFiles = false;
      } else {
        canDownloadMultipleFiles = true;
      }

      parentNode = domConstruct.create("div", {
        "class": "esriCTExportToCsvParentNode"
      }, this.exportToCSVFormContainer);
      if (isSelectAll) {
        domClass.add(parentNode, "esriCTExportToCsvSelectAll");
        label = exportToCSVObj;
        //In case when cannot download multiple files
        //hide the 'Select All' checkbox and disable to "Ok" button
        if (!canDownloadMultipleFiles) {
          domClass.add(parentNode, "esriCTHidden");
          domClass.add(this.exportToCsvFileMainButton, "jimu-state-disabled");
        }
      } else {
        label = exportToCSVObj.displayName;
      }

      var checkBoxParentNode = domConstruct.create("div", {
        "class": "esriCTCheckBoxParentNode"
      }, parentNode);
      //If multiple files can be downloaded all the checkboxes will be checked
      //else all the checkboxes will be unchecked
      var checkboxObj = new Checkbox({
        "checked": canDownloadMultipleFiles,
        "label": label
      }, checkBoxParentNode);
      if (!isSelectAll) {
        exportToCSVObj.checkbox = checkboxObj;
      } else {
        this._exportToCSVSelectAllCheckbox = checkboxObj;
      }

      this.own(on(checkboxObj, "change", lang.hitch(this, function (checked) {
        if (isSelectAll) {
          this._selectAllExportCheckBox(checked, true);
        } else {
          //on change if cannot download multiple files
          //then uncheck the prev selected and make only the current checkbox checked
          if (!canDownloadMultipleFiles) {
            this._selectAllExportCheckBox(false, true);
            if (checked) {
              checkboxObj.check(true);
            } else {
              checkboxObj.uncheck(true);
            }
          }
        }
        this._maintainSelectAllState();
      })));
    },

    _selectAllExportCheckBox: function (checked, notEvent) {
      array.forEach(this._exportToCSVLayerArray, lang.hitch(this, function (exportToCSVObj) {
        if (checked) {
          exportToCSVObj.checkbox.check(notEvent);
        } else {
          exportToCSVObj.checkbox.uncheck(notEvent);
        }
      }));
    },

    _maintainSelectAllState: function () {
      var enableParent, isCheckedParamAvailable;
      enableParent = true;
      isCheckedParamAvailable = false;
      array.forEach(this._exportToCSVLayerArray, lang.hitch(this, function (exportToCSVObj) {
        if (!exportToCSVObj.checkbox.getValue()) {
          enableParent = false;
        }
        if (exportToCSVObj.checkbox.getValue()) {
          isCheckedParamAvailable = true;
        }
      }));
      if (isCheckedParamAvailable) {
        domClass.remove(this.exportToCsvFileMainButton, "jimu-state-disabled");
      } else {
        domClass.add(this.exportToCsvFileMainButton, "jimu-state-disabled");
      }
      if (enableParent) {
        this._exportToCSVSelectAllCheckbox.check(true);
      } else {
        this._exportToCSVSelectAllCheckbox.uncheck(true);
      }
    },

    _displayFlagsOnMainScreen: function () {
      domClass.remove(this.inputOutputTabParentContainer, "esriCTHidden");
      domClass.remove(this.inputLocTab, "esriCTHidden");
    },

    _hideFlagsOnMainScreen: function () {
      domClass.add(this.inputLocTab, "esriCTHidden");
      this._disableProjectSaveButton();
    },

    _displayBarriersOnMainScreen: function () {
      domClass.remove(this.inputOutputTabParentContainer, "esriCTHidden");
      domClass.remove(this.barrierLocTab, "esriCTHidden");
    },

    _hideBarriersOnMainScreen: function () {
      domClass.add(this.barrierLocTab, "esriCTHidden");
      this._disableProjectSaveButton();
    },

    _displaySkipLocationsOnMainScreen: function () {
      domClass.remove(this.skipLocationTab, "esriCTHidden");
    },

    _hideSkipLocationsOnMainScreen: function () {
      domClass.add(this.skipLocationTab, "esriCTHidden");
      this._disableProjectSaveButton();
    },

    _displayFlagsList: function () {
      this._hideMainScreen();
      domClass.remove(this.inputLocDiv, "esriCTHidden");
    },

    _hideFlagsList: function (displayMainScreen) {
      domClass.add(this.inputLocDiv, "esriCTHidden");
      if (displayMainScreen) {
        this._displayMainScreen();
      }
    },

    _displayBarrierList: function () {
      this._hideMainScreen();
      domClass.remove(this.barrierLocDiv, "esriCTHidden");
    },

    _hideBarrierList: function (displayMainScreen) {
      domClass.add(this.barrierLocDiv, "esriCTHidden");
      if (displayMainScreen) {
        this._displayMainScreen();
      }
    },

    _displaySkipLocationList: function () {
      this._hideMainScreen();
      domClass.remove(this.skipLocDiv, "esriCTHidden");
    },

    _hideSkipLocationList: function (displayMainScreen) {
      domClass.add(this.skipLocDiv, "esriCTHidden");
      if (displayMainScreen) {
        this._displayMainScreen();
      }
    },

    _displayEntireMainScreen: function () {
      this._displayMainScreen();
      domClass.remove(this.saveAndExportParentContainer, "esriCTHidden");
    },

    _hideEntireMainScreen: function () {
      this._hideMainScreen();
      domClass.add(this.saveAndExportParentContainer, "esriCTHidden");
    },

    _displayMainScreen: function () {
      if (this._isWidgetLoadedInProjectMode) {
        domClass.remove(this.loadProjectParentContainer, "esriCTHidden");
      }
      domClass.remove(this.inputOutputTabParentContainer, "esriCTHidden");
      domClass.remove(this.saveAndExportParentContainer, "esriCTHidden");
    },

    _hideMainScreen: function () {
      domClass.add(this.loadProjectParentContainer, "esriCTHidden");
      domClass.add(this.inputOutputTabParentContainer, "esriCTHidden");
    },

    _displayOutputPanel: function () {
      if (!this._reloadCurrentProjectOnClear) {
        this._tabContainer.selectTab(this.nls.outputTabTitle);
      }
      this._reloadCurrentProjectOnClear = false;
      domClass.remove(this.outputTab, "esriCTHidden");
      domClass.remove(this.resultsLayerNamesContainer, "esriCTHidden");
      //if theme is tab theme than reset heigth of output tab
      if (this.appConfig.theme.name === "TabTheme") {
        var resetHeightObj;
        resetHeightObj = {};
        resetHeightObj.node = this.outputTab;
        resetHeightObj.resetHeightOutputPanel = true;
        this._resetHeight(resetHeightObj); //reset
      }
    },

    _hideOutputPanel: function () {
      this._tabContainer.selectTab(this.nls.inputTabTitle);
      domClass.add(this.outputTab, "esriCTHidden");
      domClass.add(this.resultsLayerNamesContainer, "esriCTHidden");
    },

    _displayOutputFeatureList: function (resultMainDiv) {
      this._hideMainScreen();
      domClass.remove(this.layerFeaturesContainer, "esriCTHidden");
      domClass.remove(resultMainDiv, "esriCTHidden");
    },

    _hideOutputFeatureList: function (resultMainDiv) {
      domClass.add(resultMainDiv, "esriCTHidden");
      domClass.add(this.layerFeaturesContainer, "esriCTHidden");
      this._displayMainScreen();
    },

    _disableProjectSaveButton: function () {
      if (domClass.contains(this.inputLocTab, "esriCTHidden") &&
        domClass.contains(this.barrierLocTab, "esriCTHidden") &&
        domClass.contains(this.skipLocationTab, "esriCTHidden")) {
        domClass.add(this.projectSaveButton, "jimu-state-disabled");
      }
    },

    _enableProjectSaveButton: function () {
      domClass.remove(this.projectSaveButton, "jimu-state-disabled");
    },

    _hideAllOutputResultContainer: function () {
      var resultContainerArr = query(".esriCTResultContainer", this.layerFeaturesContainer);
      array.forEach(resultContainerArr, lang.hitch(this, function (resultContainer) {
        domClass.add(resultContainer, "esriCTHidden");
      }));
    },

    onNormalize: function () {
      setTimeout(lang.hitch(this, function () {
        this._addMobileStyles();
      }), 10);
    },

    onMinimize: function () {
      setTimeout(lang.hitch(this, function () {
        this._removeMobileStyles();
      }), 10);
    },

    onMaximize: function () {
      setTimeout(lang.hitch(this, function () {
        this._removeMobileStyles();
      }), 10);
    },

    _addMobileStyles: function () {
      if (window.appInfo.isRunInMobile && this.windowState === "normal") {
        domClass.add(this.inputTabPanel, "esriCTInputParentMainContainerMobileMode");
        domClass.add(this.flagBarrierSkipLocationMainPageContainer,
          "esriCTFlagBarrierSkipLocationMainPageMobileMode");
        this._resetInputOutputTabParentContainer();
      }
    },

    _removeMobileStyles: function () {
      if (!window.appInfo.isRunInMobile) {
        domClass.remove(this.flagBarrierSkipLocationMainPageContainer,
          "esriCTFlagBarrierSkipLocationMainPageMobileMode");
      }
      domClass.remove(this.inputTabPanel, "esriCTInputParentMainContainerMobileMode");
      if (window.appInfo.isRunInMobile) {
        this._resetInputOutputTabParentContainer();
      }
    },

    /**
     * This function is used to get the container/div of layer name.
     */
    _getLayerNameObject: function (selectedGPParam) {
      var layerName = selectedGPParam.paramName + this.id;
      var layerNameDetailsDiv = query("div[layernamedetails='" + layerName + "']", this.resultsLayerNamesContainer);
      if (layerNameDetailsDiv && layerNameDetailsDiv.length > 0) {
        return layerNameDetailsDiv[0];
      }
      return null;
    },

    /**
     * This function is used to get the container/div of result container label.
     */
    _getResultContainerLabelObject: function (selectedGPParam) {
      var resultContainerLabel = selectedGPParam.paramName + this.id;
      var resultContainerDetailsDiv =
        query("div[resultcontainerlabel='" + resultContainerLabel + "']",
          this.layerFeaturesContainer);
      if (resultContainerDetailsDiv && resultContainerDetailsDiv.length > 0) {
        return resultContainerDetailsDiv[0];
      }
      return null;
    },

    /**
     * This function is used to get the container/div of result container data.
     */
    _getResultContainerDataObject: function (paramName) {
      var resultContainerDataAttributeValue = paramName + this.id;
      var resultContainerDataDiv =
        query("div[resultcontainerdata='" + resultContainerDataAttributeValue + "']",
          this.layerFeaturesContainer);
      if (resultContainerDataDiv && resultContainerDataDiv.length > 0) {
        return resultContainerDataDiv[0];
      }
      return null;
    },

    /**
     * This function is used to get the container/div of result container.
     */
    _getResultContainerObject: function (paramName) {
      var resultContainerAttributeValue = paramName + this.id;
      var resultContainerDiv =
        query("div[resultcontainer='" + resultContainerAttributeValue + "']",
          this.layerFeaturesContainer);
      if (resultContainerDiv && resultContainerDiv.length > 0) {
        return resultContainerDiv[0];
      }
      return null;
    },

    /**
     * This function is used to add graphics to local layer.
     */
    _addGraphicToLocalLayer: function () {
      var clonedProjectPolygonLayerInfo, polygonLayerObject, clonedProjectPolygonLayerLoadHandler,
        newAttributes, newGraphic, queryTask;
      // clears the attribute inspector
      this._clearAttributeInspectorData();
      // clears the local layer
      this._removeClonedProjectPolygonLayer();
      // This function fetches the project polygon layer from and clears the selection from it.
      this._clearProjectPolygonLayerFromMap();
      // polygonLayerId object
      polygonLayerObject = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      // clone the polygonLayerId layer and it on map
      this._clonedProjectPolygonLayerObject = this._cloneProjectPolygonLayer(polygonLayerObject);
      // attaching load event
      clonedProjectPolygonLayerLoadHandler =
        this.own(on(this._clonedProjectPolygonLayerObject, "load",
          lang.hitch(this, function () {
            // Remove handler
            if (clonedProjectPolygonLayerLoadHandler && clonedProjectPolygonLayerLoadHandler[0]) {
              clonedProjectPolygonLayerLoadHandler[0].remove();
            }
            clonedProjectPolygonLayerInfo =
              this._layerInfosObj.getLayerInfoById(this._clonedProjectPolygonLayerObject.originalLayerId);
            // need to add this property featureLayer, else it fails while creating attribute inspector
            clonedProjectPolygonLayerInfo.featureLayer = this._clonedProjectPolygonLayerObject;
            // create attribute inspector
            this._createAttributeInspector();
            // create local attributes
            // 1st try to fetch the attributes from the templates property, if its not
            // available try to fetch it from types property. If Yes, and types has multiple entries,
            // consider first entry for template. If No, pass null attributes
            if (clonedProjectPolygonLayerInfo.layerObject.hasOwnProperty("templates") &&
              clonedProjectPolygonLayerInfo.layerObject.templates.length > 0 &&
              clonedProjectPolygonLayerInfo.layerObject.templates[0].hasOwnProperty("prototype") &&
              clonedProjectPolygonLayerInfo.layerObject.templates[0].prototype.hasOwnProperty("attributes")) {
              newAttributes = clonedProjectPolygonLayerInfo.layerObject.templates[0].prototype.attributes;
            } else if (clonedProjectPolygonLayerInfo.layerObject.hasOwnProperty("types") &&
              clonedProjectPolygonLayerInfo.layerObject.types.length > 0 &&
              clonedProjectPolygonLayerInfo.layerObject.types[0].hasOwnProperty("templates") &&
              clonedProjectPolygonLayerInfo.layerObject.types[0].templates.length > 0 &&
              clonedProjectPolygonLayerInfo.layerObject.types[0].templates[0].hasOwnProperty("prototype") &&
              clonedProjectPolygonLayerInfo.layerObject.types[0].templates[0].prototype.hasOwnProperty("attributes")) {
              newAttributes = clonedProjectPolygonLayerInfo.layerObject.types[0].templates[0].prototype.attributes;
            } else {
              newAttributes = null;
            }
            // this._originalTemplateAttributes - used to store the original cloned template info of the layer.
            // Any updation in the feature, updates the template info of the layer.
            // So, on second execution we receive the data of previous updated value, nor the original one.
            // Hence, for while creating a new project this variable is used which contains original template info data.
            if (this._originalTemplateAttributes === null || this._originalTemplateAttributes === "" ||
              this._originalTemplateAttributes === undefined) {
              this._originalTemplateAttributes = lang.clone(newAttributes);
              // data needs to be published for supporting multiple instance of the widget.
              // original template attribute needs to be used while saving new project.
              // networkTraceOriginalTemplateAttributes contains this data which is published
              // and is listened by other instance of network trace when loaded and fills the
              // _originalTemplateAttributes variable
              this.publishData({
                networkTraceOriginalTemplateAttributes: this._originalTemplateAttributes
              });
            } else {
              newAttributes = lang.clone(this._originalTemplateAttributes);
            }
            // create local graphics
            newGraphic = new Graphic(null, null, newAttributes, null);
            // store original attrs for later use
            newGraphic.preEditAttrs = JSON.parse(JSON.stringify(newGraphic.attributes));
            // add graphics in local layer(cache layer)
            this._clonedProjectPolygonLayerObject.applyEdits([newGraphic], null, null,
              lang.hitch(this, function (results) {
                queryTask = new Query();
                queryTask.objectIds = [results[0].objectId];
                // select feature in cache layer
                this._clonedProjectPolygonLayerObject.selectFeatures(queryTask, FeatureLayer.SELECTION_NEW,
                  lang.hitch(this, function () {
                    this._currentFeatureDetails = newGraphic;
                    this._showLoadingIcon(false);
                  }), lang.hitch(this, function () {
                    this._saveAsNewProject = false;
                    this._showLoadingIcon(false);
                    this._errorMessage(this.nls.selectingFeatureInClonedLayerError);
                  }));
              }), lang.hitch(this, function () {
                this._saveAsNewProject = false;
                this._showLoadingIcon(false);
                this._errorMessage(this.nls.addingFeatureInClonedLayerError);
              }));
          }), lang.hitch(this, function () {
            this._saveAsNewProject = false;
            this._showLoadingIcon(false);
            this._errorMessage(this.nls.loadingClonedLayerErrorMessage);
          })));
    },

    /**
     * This function is used to clear the local layer
     */
    _removeClonedProjectPolygonLayer: function () {
      if (this._clonedProjectPolygonLayerObject && this._clonedProjectPolygonLayerObject !== null) {
        this._clonedProjectPolygonLayerObject.clearSelection();
        this._clonedProjectPolygonLayerObject.clear();
        this.map.removeLayer(this._clonedProjectPolygonLayerObject);
        this._clonedProjectPolygonLayerObject = null;
      }
    },

    /**
     * This function fetches the project polygon layer from and clears the selection from it.
     */
    _clearProjectPolygonLayerFromMap: function () {
      var polygonLayerObject = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      if (polygonLayerObject) {
        polygonLayerObject.clearSelection();
        polygonLayerObject.refresh();
      }
    },

    /**
     * This function is used to clone the project polygon layer
     * @param {*} layer instance of project polygon layer
     */
    _cloneProjectPolygonLayer: function (layer) {
      var cloneFeaturelayer, featureCollection, outFields;
      // get layer definition
      var existingLayerDefinition = utils.getFeatureLayerDefinition(layer);
      // mandate name field
      this._mandateNameField(existingLayerDefinition);
      // remove fields which are not needed
      this._filterFields(existingLayerDefinition);
      // set custom id
      existingLayerDefinition.id = "clonedProjectLayer" + this.id;
      // set custom name
      existingLayerDefinition.name = layer.name + this.id;
      featureCollection = {
        layerDefinition: existingLayerDefinition
      };
      outFields = layer.fields.map(function (fieldDetails) {
        return fieldDetails.name;
      });
      cloneFeaturelayer = new FeatureLayer(featureCollection, {
        outFields: outFields
      });
      cloneFeaturelayer.visible = true;
      cloneFeaturelayer.renderer = layer.renderer;
      cloneFeaturelayer.originalLayerId = layer.id;
      cloneFeaturelayer._wabProperties = {
        isTemporaryLayer: true
      };
      this.map.addLayer(cloneFeaturelayer);
      return cloneFeaturelayer;
    },

    /**
     * This function is required to add the Range details to a range domain so the layer can be cloned
     * @param {*} fields - layer fields
     */
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

    /**
     * This function is used to create object of attribute inspector widget
     * @param {*} layerInfos - layer infos
     */
    _createAttributeInspector: function () {
      // Working around for bug of AttributeInspector. Incorrect behavior with
      // multiple instances of AttributeInspector.
      var attributeInspectorWidget = declare([AttributeInspector], {
        constructor: function () {
          this._aiConnects = [];
          this._selection = [];
          this._toolTips = [];
        }
      });
      // create cloned attribute inspector widget
      this._attributeInspector = attributeInspectorWidget({
        featureLayer: this._clonedProjectPolygonLayerObject
      }, domConstruct.create("div", {
        "class": "esriCTAttributeInspectorWidgetContainer"
      }));
      this.own(on(this._attributeInspector, "attribute-change", lang.hitch(this, function (evt) {
        if (this._currentFeatureDetails) {
          // update changed attribute
          this._currentFeatureDetails.attributes[evt.fieldName] = evt.fieldValue;
        }
      })));
      this._attributeInspector.startup();
      this.attributeInspectorContainer.appendChild(this._attributeInspector.domNode);
    },

    /**
     * This function is used to display attribute inspector screen
     */
    _displayAttributeInspector: function () {
      this._hideEntireMainScreen();
      this._hideFlagsList(false);
      this._hideBarrierList(false);
      this._hideSkipLocationList(false);
      domClass.remove(this.editAttributeContainer, "esriCTHidden");
    },

    /**
     * This function is used to get project name textbox from attribute inspector
     */
    _getProjectNameTextBox: function () {
      var projectNameTextBoxElement, widgetId, projectNameTextBox, parentNode, projectNameLabel;
      if (this._attributeInspector && this._attributeInspector.domNode) {
        projectNameLabel = query("td[data-fieldname='" + this._polygonLayerFields.name + "']",
          this._attributeInspector.domNode);
        if (projectNameLabel && projectNameLabel[0] && projectNameLabel[0].parentNode) {
          parentNode = projectNameLabel[0].parentNode;
          if (parentNode.childNodes && parentNode.childNodes[1] &&
            parentNode.childNodes[1].childNodes && parentNode.childNodes[1].childNodes[0]) {
            projectNameTextBoxElement = parentNode.childNodes[1].childNodes[0];
            widgetId = domAttr.get(projectNameTextBoxElement, "widgetid");
            if (widgetId) {
              projectNameTextBox = dijit.byId(widgetId);
            }
          }
        }
      }
      return projectNameTextBox;
    },

    /**
     * This function is used to remove selection on back button click and clear graphic layer
     */
    _clearSelectionOnBackBtnClk: function () {
      var highlightedGrapic;
      this.animatedLayer.clear();
      highlightedGrapic = query(".esriCTHighlightedGraphic", this._widgetTopNode);
      // if any graphic is highlighted then remove highlight of that graphic
      if (highlightedGrapic && highlightedGrapic.length > 0) {
        domClass.remove(highlightedGrapic[0], "esriCTHighlightedGraphic");
      }
    },

    /**
     * This function is used to get zoom to text. All the words inside curly braces are converted to lowercase
     * and then replaced by attribute object which also contains all the keys in lowercase.
     */
    _getZoomToText: function (selectedGPParam, resultItem) {
      var clonedDisplayText = lang.clone(selectedGPParam.displayText);
      var clonedAttributes = lang.clone(resultItem.attributes);
      var clonedAttributesObj = {};
      for (var attr in clonedAttributes) {
        if (clonedAttributes.hasOwnProperty(attr)) {
          clonedAttributesObj[attr.toLowerCase()] = clonedAttributes[attr];
        }
      }
      var curlyBracesContentRegex = /({.*?})/ig;
      var curlyBracesContentArr = clonedDisplayText.match(curlyBracesContentRegex);
      array.forEach(curlyBracesContentArr, lang.hitch(this, function (content) {
        clonedDisplayText = clonedDisplayText.replace(content, content.toLowerCase());
      }));
      clonedDisplayText = lang.replace(clonedDisplayText, clonedAttributesObj);
      // if no parameter is found in string to replace, it adds undefined text to it.
      // hence, its changed to null
      clonedDisplayText = clonedDisplayText.replace(/undefined/gi, null);
      return clonedDisplayText;
    },

    /**
     * This function is used to receive data that might be already published by another instance of
     * network trace widget. This function gets called when this widget calls fetch data function on its load.
     * It checks whether any data containing networkTraceOriginalTemplateAttributes key has been published by
     * any network trace widget before. If Yes, it uses that data for further execution.
     */
    onReceiveData: function (name, widgetId, data, historyData) { // jshint ignore:line
      if (data.hasOwnProperty("networkTraceOriginalTemplateAttributes")) {
        this._originalTemplateAttributes = data.networkTraceOriginalTemplateAttributes;
      }
    },

    /**
     * This function is used to load widget in project or sketch mode
     */
    _loadWidgetInProjectMode: function () {
      this._showLoadingIcon(true);
      //if project settings are valid
      if (this.config.projectSettings &&
        this.config.projectSettings.polygonLayerId &&
        this.config.projectSettings.pointLayerId &&
        this.config.projectSettings.outputParamName) {
        //if configured project settings layers are availble in map load in 'Project mode'
        //else show error and load widget in 'Sketch mode'
        if (this._layerInfosObj.getLayerInfoById(this.config.projectSettings.polygonLayerId) &&
          this._layerInfosObj.getLayerInfoById(this.config.projectSettings.pointLayerId)) {
          domClass.remove(this.loadProjectParentContainer, "esriCTHidden");
          this._isWidgetLoadedInProjectMode = true;
          //Show/Hide save and export button based on the project/sketch mode
          this._displaySaveAndExportButton();
          this._resetInputOutputTabParentContainer();
          this._loadProject();
        } else {
          //Show/Hide save and export button based on the project/sketch mode
          this._displaySaveAndExportButton();
          this._resetInputOutputTabParentContainer();
          this._fetchUrlParameters();
          this._errorMessage(this.nls.projectLayersNotFound);
        }
      } else {
        //Show/Hide save and export button based on the project/sketch mode
        this._displaySaveAndExportButton();
        this._resetInputOutputTabParentContainer();
        this._fetchUrlParameters();
      }
      this._showLoadingIcon(false);
    },

    /**
     * This function is used to filter the fields of layer definition passed to the attribute inspector
     */
    _filterFields: function (existingLayerDefinition) {
      var fieldInfos = this._createFieldInfos();
      var filteredFieldsArr = [];
      array.forEach(fieldInfos, lang.hitch(this, function (fieldInfo) {
        array.forEach(existingLayerDefinition.fields, lang.hitch(this, function (field) {
          if (field.hasOwnProperty("name") && fieldInfo.hasOwnProperty("fieldName")) {
            if (field.name === fieldInfo.fieldName) {
              filteredFieldsArr.push(field);
            }
          }
        }));
      }));
      existingLayerDefinition.fields = filteredFieldsArr;
    },

    /**
     * This function is used to mandate the name field
     */
    _mandateNameField: function (existingLayerDefinition) {
      array.forEach(existingLayerDefinition.fields, lang.hitch(this, function (field, index) {
        if (field.name === this._polygonLayerFields.name) {
          existingLayerDefinition.fields[index].nullable = false;
        }
      }));
      return existingLayerDefinition;
    },

    /**
     * This function is used to disable all the input tools when multiple instance are available
     */
    onDeActive: function () {
      this._disableFlagTool();
      this._disableBarrierTool();
      this._disconnectAllAttributeInspectorEvents();
      this._loadProjectDropdown.set('disabled', true);
    },

    /**
     * This function is used to disable flag tool
     */
    _disableFlagTool: function () {
      this.enableWebMapPopup();
      this.flagBtnClicked = false;
      domClass.remove(this.btnFlag, "flagButtonselected");
      domClass.add(this.btnFlag, "flagbutton");
      //Checking the toolbar whether it is initialized or not
      if (this.toolbar !== null) {
        this.toolbar.deactivate();
        this.toolbar = null;
      }
    },

    /**
     * This function is used to disable barrier tool
     */
    _disableBarrierTool: function () {
      this.enableWebMapPopup();
      this.barrierBtnClicked = false;
      domClass.remove(this.btnBarrier, "barrierButtonselected");
      domClass.add(this.btnBarrier, "barrierButton");
      //Checking the toolbar whether it is initialized or not
      if (this.toolbar !== null) {
        this.toolbar.deactivate();
        this.toolbar = null;
      }
    },

    /**
     * This function is used to take object of existing attribute inspector which is created in this instance
     * of the widget. It fetches all the handles assigned to the layer and removes it. If not removed,
     * in case of multiple instances of this widget, any changes to attribute inspector causes change
     * to other instance attribute inspector of another widget.
     */
    _disconnectAllAttributeInspectorEvents: function () {
      if (this._attributeInspector && this._attributeInspector._aiConnects) {
        array.forEach(this._attributeInspector._aiConnects, lang.hitch(this, function (connect) {
          connect.remove();
        }));
      }
    },

    /**
     * This function is used to add default option in load project dropdown.
     */
    _addDefaultOptionInDropdown: function () {
      this._loadProjectDropdown.addOption({
        "value": "newproject",
        "label": this.nls.newProjectOptionText
      });
    },

    /**
     * This function is used to reset the widget, if any filter is applied on polygon layer
     * by any other widget, followed by activating this widget.
     */
    onActive: function () {
      this._showLoadingIcon(true);
      var layer = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      if (layer) {
        if (this._isWidgetStartup) {
          this._isWidgetStartup = false;
          var definitionExpression = layer.getDefinitionExpression();
          if (this._lastDefinitionExpression !== definitionExpression) {
            this._refreshProjectNames();
          } else {
            this._loadProjectDropdown.set('disabled', false);
            this._showLoadingIcon(false);
          }
        } else {
          this._refreshProjectNames();
        }
      } else {
        this._loadProjectDropdown.set('disabled', false);
        this._showLoadingIcon(false);
      }
    },

    /**
     * This function is used to pause all the clicks events
     */
    _pauseAllClickEvents: function () {
      array.forEach(this._clickEventHandlerArr, lang.hitch(this, function (eventObj) {
        if (eventObj.length > 0) {
          eventObj[0].pause();
        }
      }));
    },

    /**
     * This function is used to resume all the click events
     */
    _resumeAllClickEvents: function () {
      array.forEach(this._clickEventHandlerArr, lang.hitch(this, function (eventObj) {
        if (eventObj.length > 0) {
          eventObj[0].resume();
        }
      }));
    },

    /**
     * This function is used to get the definition expression applied to the layer
     */
    _fetchLastDefinitionExpression: function () {
      var layer = this.map.getLayer(this.config.projectSettings.polygonLayerId);
      if (layer) {
        this._lastDefinitionExpression = layer.getDefinitionExpression();
      }
    },

    /**
     * This function is used to refresh the project names in the project dropdown
     */
    _refreshProjectNames: function () {
      this._pauseAllClickEvents();
      var currentlySelectedProjectGuid = this._loadProjectDropdown.getValue();
      this._loadProjectDropdown.closeDropDown();
      this._loadProjectDropdown.set('disabled', true);
      this._loadProjectDropdownEvtHandle.pause();
      this._loadProjectDropdown.removeOption(this._loadProjectDropdown.getOptions());
      this._addDefaultOptionInDropdown();
      this._loadProject(true, currentlySelectedProjectGuid);
    }
  });
});