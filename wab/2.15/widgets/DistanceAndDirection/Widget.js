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

define([
  'dojo/_base/declare',
  'dojo/_base/array',
  'dojo/aspect',
  'dojo/query',
  'dojo/topic',
  'dojo/dom-attr',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/registry',
  'jimu/BaseWidget',
  'jimu/dijit/TabContainer3',
  'jimu/utils',
  './views/TabLine',
  './views/TabCircle',
  './views/TabEllipse',
  './views/TabRange',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/dom-class',
  'dojo/keys',
  'jimu/dijit/CheckBox',
  'dojo/dom-construct',
  'jimu/LayerStructure',
  'esri/IdentityManager',
  'esri/arcgis/Portal',
  './js/portal-utils',
  'jimu/LayerInfos/LayerInfos',
  'esri/dijit/util/busyIndicator',
  'esri/graphic',
  'esri/layers/FeatureLayer',
  'esri/renderers/SimpleRenderer',
  'dijit/focus',
  './js/jquery.easy-autocomplete'
], function (
  dojoDeclare,
  dojoArray,
  dojoAspect,
  dojoQuery,
  dojoTopic,
  domAttr,
  dijitWidgetsInTemplate,
  dijitRegistry,
  jimuBaseWidget,
  JimuTabContainer3,
  jimuUtils,
  TabLine,
  TabCircle,
  TabEllipse,
  TabRange,
  lang,
  on,
  domClass,
  keys,
  Checkbox,
  dojoConstruct,
  LayerStructure,
  esriId,
  esriPortal,
  portalutils,
  jimuLayerInfos,
  busyIndicator,
  Graphic,
  FeatureLayer,
  SimpleRenderer,
  focusUtils
) {
  'use strict';
  var clz = dojoDeclare([jimuBaseWidget, dijitWidgetsInTemplate], {
    baseClass: 'jimu-widget-DistanceAndDirection',
    _lastOpenPanel: "mainPage", //Flag to hold last open panel, default will be main page
    _currentOpenPanel: "mainPage", //Flag to hold last open panel, default will be main page
    _lineLayerList: [],
    _polygonLayerList: [],
    _renderer: null, // renderer to be used on the DD Feature Service
    _addLayerToMap: true, // flag to add layer to map
    _typeOfInput: null,
    _graphicsAdded: [],
    _curretfieldTypeObj: {},

    postMixInProperties: function () {
      //mixin default nls with widget nls
      this.nls.common = {};
      lang.mixin(this.nls.common, window.jimuNls.common);
    },

    _reset: function () {
      if (this.config.feedback.lineSymbol.showTab) {
        this.lineTab.clearGraphics();
      }
      if (this.config.feedback.circleSymbol.showTab) {
        this.circleTab.clearGraphics();
      }
      if (this.config.feedback.ellipseSymbol.showTab) {
        this.ellipseTab.clearGraphics();
      }
      if (this.config.feedback.rangeRingSymbol.showTab) {
        this.rangeTab.clearGraphics();
      }
      //enable map navigation if disabled due to a tool being in use
      this.map.enableMapNavigation();
      this._graphicsAdded = [];
      this._curretfieldTypeObj = {};
    },

    /**
     *
     **/
    postCreate: function () {
      if (!this.config.hasOwnProperty("operationalLineLayer")) {
        this.config.operationalLineLayer = {
          name: ""
        };
      }
      if (!this.config.hasOwnProperty("operationalPolygonLayer")) {
        this.config.operationalPolygonLayer = {
          name: ""
        };
      }
      //modify String's prototype so we can format a string using .format requried for IE
      if (!String.prototype.format) {
        String.prototype.format = function () {
          var args = arguments;
          return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
          });
        };
      }
      dojoDeclare.safeMixin(this.nls, window.jimuNls);
      if (!this.config.feedback) {
        this.config.feedback = {};
      }

      if (this.config.feedback.lineSymbol.showTab) {
        this.lineTab = new TabLine({
            "attr-name": "line",
            map: this.map,
            appConfig: this.appConfig,
            lineSymbol: this.config.feedback.lineSymbol || {
              type: 'esriSLS',
              style: 'esriSLSSolid',
              color: [255, 50, 50, 255],
              width: 1.25
            },
            pointSymbol: this.config.feedback.pointSymbol || {
              'color': [255, 255, 255, 64],
              'size': 12,
              'type': 'esriSMS',
              'style': 'esriSMSCircle',
              'outline': {
                'color': [0, 0, 0, 255],
                'width': 1,
                'type': 'esriSLS',
                'style': 'esriSLSSolid'
              }
            },
            labelSymbol: this.config.feedback.labelSymbol || {
              'type': 'esriTS',
              'color': [0, 0, 0, 255],
              'verticalAlignment': 'middle',
              'horizontalAlignment': 'center',
              'xoffset': 0,
              'yoffset': 0,
              'kerning': true,
              'font': {
                'family': 'arial',
                'size': 12,
                'style': 'normal',
                'weight': 'normal',
                'decoration': 'none'
              }
            },
            nls: this.nls,
            domNodeObj: this.domNode
          },
          this.lineTabNode
        );
      }

      if (this.config.feedback.circleSymbol.showTab) {
        this.circleTab = new TabCircle({
            "attr-name": "circle",
            map: this.map,
            appConfig: this.appConfig,
            circleSymbol: this.config.feedback.circleSymbol || {
              type: 'esriSFS',
              style: 'esriSFSNull',
              color: [255, 0, 0, 0],
              outline: {
                color: [255, 50, 50, 255],
                width: 1.25,
                type: 'esriSLS',
                style: 'esriSLSSolid'
              }
            },
            pointSymbol: this.config.feedback.pointSymbol || {
              'color': [255, 255, 255, 64],
              'size': 12,
              'type': 'esriSMS',
              'style': 'esriSMSCircle',
              'outline': {
                'color': [0, 0, 0, 255],
                'width': 1,
                'type': 'esriSLS',
                'style': 'esriSLSSolid'
              }
            },
            labelSymbol: this.config.feedback.labelSymbol || {
              'type': 'esriTS',
              'color': [0, 0, 0, 255],
              'verticalAlignment': 'middle',
              'horizontalAlignment': 'center',
              'xoffset': 0,
              'yoffset': 0,
              'kerning': true,
              'font': {
                'family': 'arial',
                'size': 12,
                'style': 'normal',
                'weight': 'normal',
                'decoration': 'none'
              }
            },
            nls: this.nls,
            domNodeObj: this.domNode
          },
          this.circleTabNode
        );
      }

      if (this.config.feedback.ellipseSymbol.showTab) {
        this.ellipseTab = new TabEllipse({
            "attr-name": "ellipse",
            map: this.map,
            appConfig: this.appConfig,
            ellipseSymbol: this.config.feedback.ellipseSymbol || {
              type: 'esriSFS',
              style: 'esriSFSNull',
              color: [255, 0, 0, 125],
              outline: {
                color: [255, 50, 50, 255],
                width: 1.25,
                type: 'esriSLS',
                style: 'esriSLSSolid'
              }
            },
            pointSymbol: this.config.feedback.pointSymbol || {
              'color': [255, 255, 255, 64],
              'size': 12,
              'type': 'esriSMS',
              'style': 'esriSMSCircle',
              'outline': {
                'color': [0, 0, 0, 255],
                'width': 1,
                'type': 'esriSLS',
                'style': 'esriSLSSolid'
              }
            },
            labelSymbol: this.config.feedback.labelSymbol || {
              'type': 'esriTS',
              'color': [0, 0, 0, 255],
              'verticalAlignment': 'middle',
              'horizontalAlignment': 'center',
              'xoffset': 0,
              'yoffset': 0,
              'kerning': true,
              'font': {
                'family': 'arial',
                'size': 12,
                'style': 'normal',
                'weight': 'normal',
                'decoration': 'none'
              }
            },
            nls: this.nls,
            domNodeObj: this.domNode
          },
          this.ellipseTabNode
        );
      }

      if (this.config.feedback.rangeRingSymbol.showTab) {
        this.rangeTab = new TabRange({
          "attr-name": "range",
          map: this.map,
          appConfig: this.appConfig,
          pointSymbol: this.config.feedback.pointSymbol || {
            'color': [255, 255, 255, 64],
            'size': 12,
            'type': 'esriSMS',
            'style': 'esriSMSCircle',
            'outline': {
              'color': [0, 0, 0, 255],
              'width': 1,
              'type': 'esriSLS',
              'style': 'esriSLSSolid'
            }
          },
          circleSymbol: {
            type: 'esriSFS',
            style: 'esriSFSNull',
            color: [255, 0, 0, 0],
            outline: {
              color: [255, 50, 50, 255],
              width: 1.25,
              type: 'esriSLS',
              style: 'esriSLSSolid'
            }
          },
          lineSymbol: this.config.feedback.rangeRingSymbol || {
            type: 'esriSLS',
            style: 'esriSLSSolid',
            color: [255, 50, 50, 255],
            width: 1.25
          },
          labelSymbol: this.config.feedback.labelSymbol || {
            'type': 'esriTS',
            'color': [0, 0, 255, 255],
            'verticalAlignment': 'middle',
            'horizontalAlignment': 'center',
            'xoffset': 0,
            'yoffset': 0,
            'kerning': true,
            'font': {
              'family': 'arial',
              'size': 6,
              'style': 'normal',
              'weight': 'normal',
              'decoration': 'none'
            }
          },
          nls: this.nls,
          domNodeObj: this.domNode
        }, this.RangeTabContainer);
      }

      var tabs = [];

      if (this.config.feedback.lineSymbol.showTab) {
        tabs.push({
          title: this.nls.tabLineTitle,
          content: this.lineTab
        });
      }

      if (this.config.feedback.circleSymbol.showTab) {
        tabs.push({
          title: this.nls.tabCircleTitle,
          content: this.circleTab
        });
      }
      if (this.config.feedback.ellipseSymbol.showTab) {
        tabs.push({
          title: this.nls.tabEllipseTitle,
          content: this.ellipseTab
        });
      }
      if (this.config.feedback.rangeRingSymbol.showTab) {
        tabs.push({
          title: this.nls.tabRingsTitle,
          content: this.rangeTab
        });
      }

      this.tab = new JimuTabContainer3({
        tabs: tabs
      }, this.DDTabContainer);

      var tabContainer1 = dijitRegistry.byId('DDTabContainer');

      dojoAspect.after(tabContainer1, "selectTab", lang.hitch(this, function () {
        dojoTopic.publish('TAB_SWITCHED');
        this._setAccessibility();
      }));

      this.setTabTitle(tabContainer1.domNode);
      if (this.config.feedback.lineSymbol.showTab) {
        this.own(this.lineTab.on("show-publish",
          lang.hitch(this, function (lineFLGraphics) {
            this._graphicsAdded = lineFLGraphics._graphicsVal;
            this._typeOfInput = "line";
            //update _curretfieldTypeObj to hold field and thier types for Line
            this._curretfieldTypeObj = {
              Distance: "esriFieldTypeDouble",
              Unit: "esriFieldTypeString",
              Angle: "esriFieldTypeDouble",
              StartPoint: "esriFieldTypeString",
              EndPoint: "esriFieldTypeString",
              AngleUnit: "esriFieldTypeString"
            };
            // populate the publish list
            this._populateSelectList(this.featureLayerList, this._lineLayerList,
              this.config.operationalLineLayer.name);

            this._showPanel('publishPage');
          })));
      }
      if (this.config.feedback.circleSymbol.showTab) {
        this.own(this.circleTab.on("show-publish",
          lang.hitch(this, function (circleGraphic) {
            this._graphicsAdded = circleGraphic._graphicsVal;
            this._typeOfInput = "circle";
            //update _curretfieldTypeObj to hold field and thier types for Circle
            this._curretfieldTypeObj = {
              CenterPoint: "esriFieldTypeString",
              RadiusDistance: "esriFieldTypeDouble",
              RadiusUnit: "esriFieldTypeString"
            };
            // populate the publish list
            this._populateSelectList(this.featureLayerList, this._polygonLayerList,
              this.config.operationalPolygonLayer.name);
            this._showPanel('publishPage');
          })));
      }
      if (this.config.feedback.ellipseSymbol.showTab) {
        this.own(this.ellipseTab.on("show-publish",
          lang.hitch(this, function (ellipseGraphic) {
            this._graphicsAdded = ellipseGraphic._graphicsVal;
            this._typeOfInput = "ellipse";
            //update _curretfieldTypeObj to hold field and thier types for Ellipse
            this._curretfieldTypeObj = {
              CenterPoint: "esriFieldTypeString",
              MajorAxis: "esriFieldTypeDouble",
              MinorAxis: "esriFieldTypeDouble",
              Unit: "esriFieldTypeString",
              Orientation: "esriFieldTypeDouble",
              OrientationUnit: "esriFieldTypeString"
            };
            // populate the publish list
            this._populateSelectList(this.featureLayerList, this._polygonLayerList,
              this.config.operationalPolygonLayer.name);
            this._showPanel('publishPage');
          })));
      }
      if (this.config.feedback.rangeRingSymbol.showTab) {
        this.own(this.rangeTab.on("show-publish",
          lang.hitch(this, function (rangeGraphic) {
            this._graphicsAdded = rangeGraphic._graphicsVal;
            this._typeOfInput = "ring";
            //update _curretfieldTypeObj to hold field and thier types for Ring
            this._curretfieldTypeObj = {
              CenterPoint: "esriFieldTypeString",
              Rings: "esriFieldTypeDouble",
              Radials: "esriFieldTypeDouble",
              RadiusDistance: "esriFieldTypeDouble",
              RadiusUnit: "esriFieldTypeString"
            };
            // populate the publish list
            this._populateSelectList(this.featureLayerList, this._lineLayerList,
              this.config.operationalLineLayer.name);
            this._showPanel('publishPage');
          })));
      }
      //Publish new layer checkbox
      this.publishNewLayer = new Checkbox({
        "checked": false,
        "label": this.nls.publishToNewLayer
      }, dojoConstruct.create("div", {}, this.checkBoxParentContainer));

      //Retrieve all line layers from webmap
      this._lineLayerList = this._getAllMapLayers("esriGeometryPolyline");

      //Retrieve all polygon layers from webmap
      this._polygonLayerList = this._getAllMapLayers("esriGeometryPolygon");

      this.addDDNameArea.invalidMessage = this.nls.invalidLayerName;
      this.addDDNameArea.missingMessage = this.nls.missingDDLayerName;
    },

    startup: function () {
      this.busyIndicator = busyIndicator.create({
        target: this.domNode.parentNode.parentNode.parentNode,
        backgroundOpacity: 0
      });
      this._setTheme();
      this._handleClickEvents();
      setTimeout(lang.hitch(this, function () {
        this.getParent().domNode.scrollTop = 0;
        this._setAccessibility();
      }), 100);
    },

    setTabTitle: function (parentNode) {
      var nl = dojoQuery(".tab-item-div", parentNode);
      dojoArray.forEach(nl, function (node) {
        domAttr.set(node, "title", node.innerHTML);
      });
    },

    onClose: function () {
      dojoTopic.publish("DD-WIDGET-CLOSED");
    },

    /**
     * Handle different theme styles
     **/
    //source:
    //https://stackoverflow.com/questions/9979415/dynamically-load-and-unload-stylesheets
    _removeStyleFile: function (filename, filetype) {
      //determine element type to create nodelist from
      var targetelement = null;
      if (filetype === "js") {
        targetelement = "script";
      } else if (filetype === "css") {
        targetelement = "link";
      } else {
        targetelement = "none";
      }
      //determine corresponding attribute to test for
      var targetattr = null;
      if (filetype === "js") {
        targetattr = "src";
      } else if (filetype === "css") {
        targetattr = "href";
      } else {
        targetattr = "none";
      }
      var allsuspects = document.getElementsByTagName(targetelement);
      //search backwards within nodelist for matching elements to remove
      for (var i = allsuspects.length; i >= 0; i--) {
        if (allsuspects[i] &&
          allsuspects[i].getAttribute(targetattr) !== null &&
          allsuspects[i].getAttribute(targetattr).indexOf(filename) !== -1) {
          //remove element by calling parentNode.removeChild()
          allsuspects[i].parentNode.removeChild(allsuspects[i]);
        }
      }
    },

    _setTheme: function () {
      //Check if DartTheme
      if (this.appConfig.theme.name === "DartTheme") {
        //Load appropriate CSS for dart theme
        jimuUtils.loadStyleLink('dartOverrideCSS', this.folderUrl + "css/dartTheme.css", null);
      } else {
        this._removeStyleFile(this.folderUrl + "css/dartTheme.css", 'css');
      }

      //Check if DashBoardTheme
      if (this.appConfig.theme.name === "DashboardTheme" && this.appConfig.theme.styles[0] === "default") {
        //Load appropriate CSS for dashboard theme
        jimuUtils.loadStyleLink('darkDashboardOverrideCSS', this.folderUrl + "css/dashboardTheme.css", null);
      } else {
        this._removeStyleFile(this.folderUrl + "css/dashboardTheme.css", 'css');
      }

      //Check if LaunchpadTheme
      if (this.appConfig.theme.name === "LaunchpadTheme") {
        //Load appropriate CSS for dashboard theme
        jimuUtils.loadStyleLink('launchpadOverrideCSS', this.folderUrl + "css/launchpadTheme.css", null);
      } else {
        this._removeStyleFile(this.folderUrl + "css/launchpadTheme.css", 'css');
      }
    },

    /**
     * This function is used to set the accessibility.
     */
    _setAccessibility: function () {
      this._setFocus();
    },

    /**
     * This function is used to set the first & last focus node. Also, it is used to focus on the first element.
     */
    _setFocus: function () {
      this._setFirstFocusNode();
      this._setLastFocusNode();
      this._focusFirstNodeOfWidgetOrTab();
      if (this._currentOpenPanel === "publishPage") {
        this._publishPageAccessible();
      }
    },

    _publishPageAccessible: function () {
      jimuUtils.initFirstFocusNode(this.domNode, this.publishPanelBackButton);
      focusUtils.focus(this.publishPanelBackButton);
      if (this.publishMessage.innerHTML === "") {
        jimuUtils.initLastFocusNode(this.domNode, this.ddPublishButton);
      } else {
        jimuUtils.initLastFocusNode(this.domNode, this.publishMessage);
      }
    },

    /**
     * This function is used to set the first focus node
     */
    _setFirstFocusNode: function () {
      var tabSelectedTitle = this.tab.getSelectedTitle();
      switch (tabSelectedTitle) {
        case this.nls.tabLineTitle:
          this._setSelectedTabAsFirstFocusNode(tabSelectedTitle);
          break;
        case this.nls.tabCircleTitle:
          this._setSelectedTabAsFirstFocusNode(tabSelectedTitle);
          break;
        case this.nls.tabEllipseTitle:
          this._setSelectedTabAsFirstFocusNode(tabSelectedTitle);
          break;
        case this.nls.tabRingsTitle:
          this._setSelectedTabAsFirstFocusNode(tabSelectedTitle);
          break;
      }
    },

    /**
     * This function is used to set the last focus node
     */
    _setLastFocusNode: function () {
      var tabSelectedTitle = this.tab.getSelectedTitle();
      switch (tabSelectedTitle) {
        case this.nls.tabLineTitle:
          this.lineTab.setLastFocusNode();
          break;
        case this.nls.tabCircleTitle:
          this.circleTab.setLastFocusNode();
          break;
        case this.nls.tabEllipseTitle:
          this.ellipseTab.setLastFocusNode();
          break;
        case this.nls.tabRingsTitle:
          this.rangeTab.setLastFocusNode();
          break;
      }
    },

    /**
     * This function is used to set the focus on the first node
     */
    _focusFirstNodeOfWidgetOrTab: function () {
      var tabSelectedTitle = this.tab.getSelectedTitle();
      switch (tabSelectedTitle) {
        case this.nls.tabLineTitle:
          this.lineTab.focusFirstNodeOfSelectedTab();
          break;
        case this.nls.tabCircleTitle:
          this.circleTab.focusFirstNodeOfSelectedTab();
          break;
        case this.nls.tabEllipseTitle:
          this.ellipseTab.focusFirstNodeOfSelectedTab();
          break;
        case this.nls.tabRingsTitle:
          this.rangeTab.focusFirstNodeOfSelectedTab();
          break;
      }
    },

    /**
     * This function is used to set selected tab as a first focus node
     */
    _setSelectedTabAsFirstFocusNode: function (tabSelectedTitle) {
      if (this.tab && this.tab.controlNode) {
        var tabsArr = dojoQuery('.tab-item-td', this.tab.controlNode);
        dojoArray.forEach(tabsArr, lang.hitch(this, function (tab) {
          if (tab && tab.children && tab.children[0]) {
            if (tab.children[0].innerHTML === tabSelectedTitle) {
              jimuUtils.initFirstFocusNode(this.domNode, tab);
            }
          }
        }));
      }
    },

    _handleClickEvents: function () {
      /**
       * Publish panel
       **/
      //Handle click event of panel back button
      this.own(on(this.publishPanelBackButton, "click", lang.hitch(this,
        this._publishPanelBackButtonClicked)));

      //code for accessibility
      this.own(on(this.publishPanelBackButton, "keydown",
        lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._publishPanelBackButtonClicked();
          }
        })));

      //Handle click event of publish GRG to portal button
      this.own(on(this.ddPublishButton, 'click', lang.hitch(this,
        this._ddPublishButtonClicked)));

      //code for accessibility
      this.own(on(this.ddPublishButton, "keydown",
        lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._ddPublishButtonClicked();
          }
        })));

      // Checkbox listener
      this.own(on(this.publishNewLayer, 'click', lang.hitch(this, this._onCheckboxClicked)));
      this.own(on(this.publishNewLayer, 'change', lang.hitch(this, this._onCheckboxClicked)));
      // keydown for accessibility
      this.own(on(this.publishNewLayer, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          this._onCheckboxClicked();
        }
      })));
    },

    /**
     * If checkbox is checked, clear textbox and allow user to
     * input a new layer name.
     */
    _onCheckboxClicked: function () {
      if (this.publishNewLayer.checked) {
        domClass.add(this.featureLayerList.domNode, 'DDHidden');
        domClass.remove(this.addDDNameArea.domNode, 'DDHidden');
        this.addDDNameArea.reset();
        this.addDDNameArea.focus();
      } else {
        domClass.add(this.addDDNameArea.domNode, 'DDHidden');
        domClass.remove(this.featureLayerList.domNode, 'DDHidden');
      }
      this._addLayerToMap = this.publishNewLayer.checked;
    },

    /**
     * This function is called on click of Publish Button
     */
    _ddPublishButtonClicked: function () {
      if (this.publishNewLayer.checked && !this.addDDNameArea.isValid()) {
        // Invalid entry
        this.publishMessage.innerHTML = this.nls.missingLayerNameMessage;
        return;
      }
      var layerName = (this.publishNewLayer.checked) ? this.addDDNameArea.value :
        this.featureLayerList.get("value");
      // Reset to emtpy message
      this.publishMessage.innerHTML = '';
      // Init save to portal
      this._initSaveToPortal(layerName);
    },

    /**
     * Function checks for a valid DD layer name
     * @param {string} layerName
     */
    _isValidDDLayerName: function (layerName) {
      var isValid = false;
      var restrictedList = this.restrictedCharlist + " ";
      var restrictedChars = this._findRestrictedChars(layerName, restrictedList);
      if (restrictedChars && restrictedChars.length > 0) {
        isValid = false;
      } else if (!this._isLayerNameValid(layerName)) {
        isValid = false;
      } else {
        if (layerName && layerName.length > 0) {
          isValid = true;
        }
      }
      return isValid;
    },

    /**
     * Checks a string against a list of
     * invalid characters
     * @param {string} string
     * @param {list} restrictedList
     */
    _findRestrictedChars: function (string, restrictedList) {
      var foundChars = "",
        i;
      if (string && restrictedList) {
        for (i = 0; i < restrictedList.length; i++) {
          // get a restricted character
          var rc = restrictedList.charAt(i);
          // search field for it...
          if (string.indexOf(rc) !== -1) {
            if (rc === " ") {
              rc = "spaces";
            }
            if (foundChars.length === 0) {
              foundChars = rc;
            } else {
              foundChars += " " + rc;
            }
          }
        }
      }
      return foundChars;
    },

    /**
     * Checks for invalid characters in a string
     * Source: https://stackoverflow.com/questions/11100821/javascript-regex-for-validating-filenames
     * @param {string} string
     */
    _isLayerNameValid: function (fname) {
      var rg1 = /^[^\\/:\*\?"<>\|()]+$/; // forbidden characters \ / : * ? " < > |
      var rg2 = /^\./; // cannot start with dot (.)
      var rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
      return rg1.test(fname) && !rg2.test(fname) && !rg3.test(fname);
      // var regex = /^[0-9a-zA-Z ... ]+$/;
      // return string && !!regex.test(string);
    },

    /**
     * This function is used to create attributes for current fields of Line/ring/circle/ellipse
     * It will filters all those internal attributes created previously.
     * for e.g. GeoLength/LineAngle in case of TabLine
     * @param {Object} allAttributes
     */
    getAttributesToSave: function (allAttributes) {
      var finalAttributes = {};
      var fields = Object.keys(this._curretfieldTypeObj);
      dojoArray.forEach(fields, lang.hitch(this, function (matchField) {
        finalAttributes[matchField] = allAttributes[matchField];
      }));
      return finalAttributes;
    },

    /**
     * Handle publish ERG to portal
     **/
    _initSaveToPortal: function (layerName) {
      esriId.registerOAuthInfos();
      var featureServiceName = layerName;
      esriId.getCredential(this.appConfig.portalUrl +
        "/sharing", {
          oAuthPopupConfirmation: false
        }).then(lang.hitch(this, function () {
        //sign in
        var portal = new esriPortal.Portal(this.appConfig.portalUrl);
        portal.signIn().then(lang.hitch(this, function (portalUser) {
          //Get the token
          var token = portalUser.credential.token;
          var orgId = portalUser.orgId;
          var userName = portalUser.username;
          //check the user is not just a publisher
          if (portalUser.role === "org_user") {
            this.publishMessage.innerHTML = this.nls.createService.format(this.nls.userRole);
            this._setFocus();
            return;
          }
          var checkServiceNameUrl = this.appConfig.portalUrl +
            "sharing/rest/portals/" + orgId + "/isServiceNameAvailable";
          var createServiceUrl = this.appConfig.portalUrl +
            "sharing/content/users/" + userName + "/createService";
          portalutils.isNameAvailable(checkServiceNameUrl, token,
            featureServiceName).then(lang.hitch(this, function (response0) {
            if (response0.available) {
              //set the widget to busy
              this.busyIndicator.show();
              //create the service
              portalutils.createFeatureService(createServiceUrl, token,
                portalutils.getFeatureServiceParams(featureServiceName,
                  this.map)).then(lang.hitch(this, function (response1) {
                if (response1.success) {
                  var addToDefinitionUrl = response1.serviceurl.replace(
                    new RegExp('rest', 'g'), "rest/admin") + "/addToDefinition";
                  portalutils.addDefinitionToService(addToDefinitionUrl, token,
                    portalutils.getLayerParams(featureServiceName, this.map,
                      this.getRenderer(), this.getGeometryTypeAndFields())).then(lang.hitch(this, //
                    function (response2) {
                      if (response2.success) {
                        //Push features to new layer
                        var newFeatureLayer =
                          new FeatureLayer(response1.serviceurl + "/0?token=" + token, {
                            id: featureServiceName,
                            outFields: ["*"]
                          });
                        newFeatureLayer._wabProperties = {
                          itemLayerInfo: {
                            portalUrl: this.appConfig.portalUrl,
                            itemId: response1.itemId
                          }
                        };
                        // Add layer to map
                        this.map.addLayer(newFeatureLayer);

                        // must ensure the layer is loaded before we can access
                        // it to turn on the labels if required
                        var featureLayerInfo;
                        if (newFeatureLayer.loaded) {
                          featureLayerInfo =
                            jimuLayerInfos.getInstanceSync().getLayerInfoById(featureServiceName);
                          featureLayerInfo.enablePopup();
                        } else {
                          newFeatureLayer.on("load", lang.hitch(this, function () {
                            featureLayerInfo =
                              jimuLayerInfos.getInstanceSync().getLayerInfoById(featureServiceName);
                            featureLayerInfo.enablePopup();
                          }));
                        }

                        var newGraphics = [];
                        dojoArray.forEach(this._graphicsAdded, function (g) {
                          if (g.attributes !== undefined &&
                            !g.attributes.hasOwnProperty("isDirectionalGraphic")) {
                            //store all the attributes in case when creating new layer
                            //only filter those internal attributes created previously.
                            //for e.g. GeoLength/LineAngle in case of TabLine
                            var layerAttr = this.getAttributesToSave(g.attributes);
                            newGraphics.push(new Graphic(g.geometry, null, layerAttr));
                          }
                        }, this);

                        newFeatureLayer.applyEdits(newGraphics, null, null).then(
                          lang.hitch(this, function () {
                            this._reset();
                          })).otherwise(lang.hitch(this, function () {
                          this._reset();
                        }));
                        this.busyIndicator.hide();
                        var newURL = '<br /><a role="link" tabindex=0 aria-label="' +
                          this.nls.successfullyPublished + '" href="' +
                          this.appConfig.portalUrl + "home/item.html?id=" +
                          response1.itemId + '" target="_blank">';
                        this.publishMessage.innerHTML =
                          this.nls.successfullyPublished.format(newURL) + '</a>';
                        this._setFocus();
                      }
                    }), lang.hitch(this, function (err2) {
                    this.busyIndicator.hide();
                    this.publishMessage.innerHTML =
                      this.nls.addToDefinition.format(err2.message);
                    this._setFocus();
                  }));
                } else {
                  this.busyIndicator.hide();
                  this.publishMessage.innerHTML =
                    this.nls.unableToCreate.format(featureServiceName);
                  this._setFocus();
                }
              }), lang.hitch(this, function (err1) {
                this.busyIndicator.hide();
                this.publishMessage.innerHTML =
                  this.nls.createService.format(err1.message);
                this._setFocus();
              }));
            } else {
              // Existing layer. Get layer and populate.
              portal.queryItems({
                q: "name:" + layerName + " AND owner:" + userName
              }).then(lang.hitch(this, function (items) {
                if (items.results.length > 0) {
                  var selectedLayers = dojoArray.map(items.results, function (item) {
                    if (item.name.toLowerCase() === layerName.toLowerCase()) {
                      return item;
                    }
                  }, this);
                  //Push features to new layer
                  var newFeatureLayer =
                    new FeatureLayer(selectedLayers[0].url + "/0?token=" + token, {
                      id: layerName,
                      outFields: ["*"]
                    });
                  newFeatureLayer._wabProperties = {
                    itemLayerInfo: {
                      portalUrl: this.appConfig.portalUrl,
                      itemId: selectedLayers[0].id
                    }
                  };

                  newFeatureLayer.on("load", lang.hitch(this, function (layer) {
                    var newGraphics = [];
                    dojoArray.forEach(this._graphicsAdded, function (g) {
                      if (g.attributes !== undefined &&
                        !g.attributes.hasOwnProperty("isDirectionalGraphic")) {
                        var attributes = this._matchLayerFields(g.attributes, layer.layer._fields);
                        if (Object.keys(attributes).length > 0) {
                          newGraphics.push(new Graphic(g.geometry, null, attributes));
                        } else {
                          newGraphics.push(new Graphic(g.geometry, null, {}));
                        }
                      }
                    }, this);
                    newFeatureLayer.applyEdits(newGraphics, null, null).then(
                      lang.hitch(this, function () {
                        this._reset();
                      })).otherwise(lang.hitch(this, function () {
                      this._reset();
                    }));
                    //Refesh the feature layer
                    dojoTopic.publish("moveMap", false);
                    var newURL = '<br /><a href="' + this.appConfig.portalUrl +
                      "home/item.html?id=" + selectedLayers[0].id + '" target="_blank">';
                    this.publishMessage.innerHTML =
                      this.nls.successfullyPublished.format(newURL) + '</a>';
                    this._setFocus();
                  }));
                }
              }), lang.hitch(this, function () {
                this.publishMessage.innerHTML = this.nls.addToDefinition.format(layerName);
              }));
              this._setFocus();
            }
          }), lang.hitch(this, function (err0) {
            this.busyIndicator.hide();
            this.publishMessage.innerHTML = this.nls.checkService.format(err0.message);
            this._setFocus();
          }));
        }), lang.hitch(this, function (err) {
          this.publishMessage.innerHTML = err.message;
          this._setFocus();
        }));
      }));
      esriId.destroyCredentials();
    },

    getRenderer: function () {

      var uvrJson = {
        "type": "simple"
      };

      switch (this._typeOfInput) {

        case "line":
          uvrJson.symbol = this.lineTab.lineSymbol;
          break;

        case "circle":
          uvrJson.symbol = this.circleTab.circleSymbol;
          break;

        case "ellipse":
          uvrJson.symbol = this.ellipseTab.ellipseSymbol;
          break;

        case "ring":
          uvrJson.symbol = this.rangeTab.lineSymbol;
          break;

        default:
          break;
      }

      // create a renderer for the DD layer to override default symbology
      return new SimpleRenderer(uvrJson);

    },

    getGeometryTypeAndFields: function () {
      var geoObj = {};
      switch (this._typeOfInput) {
        case "line":
          geoObj.type = "esriGeometryPolyline";
          geoObj.fields = [{
            "name": "OBJECTID",
            "type": "esriFieldTypeOID",
            "actualType": "int",
            "alias": "OBJECTID",
            "sqlType": "sqlTypeOther",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "StartPoint ",
            "alias": this.nls.startPointLabel,
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }, {
            "name": "EndPoint",
            "alias": this.nls.endPointLabel,
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }, {
            "name": "Distance",
            "alias": this.nls.distanceLabel,
            "type": "esriFieldTypeDouble",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "Unit",
            "alias": this.nls.unitLabel,
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }, {
            "name": "Angle",
            "alias": this.nls.angleLabel,
            "type": "esriFieldTypeDouble",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "AngleUnit",
            "alias": this.nls.angleUnitLabel,
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }];
          return geoObj;

        case "circle":
          geoObj.type = "esriGeometryPolygon";
          geoObj.fields = [{
            "name": "OBJECTID",
            "type": "esriFieldTypeOID",
            "actualType": "int",
            "alias": "OBJECTID",
            "sqlType": "sqlTypeOther",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "CenterPoint",
            "alias": this.nls.centerPointLabel,
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }, {
            "name": "RadiusDistance",
            "alias": this.nls.radiusDistance,
            "type": "esriFieldTypeDouble",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "RadiusUnit",
            "alias": this.nls.radiusUnit,
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }];
          return geoObj;

        case "ellipse":

          geoObj.type = "esriGeometryPolygon";
          geoObj.fields = [{
            "name": "OBJECTID",
            "type": "esriFieldTypeOID",
            "actualType": "int",
            "alias": "OBJECTID",
            "sqlType": "sqlTypeOther",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "CenterPoint",
            "alias": this.nls.centerPointLabel,
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }, {
            "name": "MajorAxis",
            "alias": this.nls.ellipseMajorAxis,
            "type": "esriFieldTypeDouble",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "MinorAxis",
            "alias": this.nls.ellipseMinorAxis,
            "type": "esriFieldTypeDouble",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "Unit",
            "alias": this.nls.unitLabel,
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }, {
            "name": "Orientation",
            "alias": this.nls.orientationLabel,
            "type": "esriFieldTypeDouble",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "OrientationUnit",
            "alias": this.nls.orientationUnit,
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }];
          return geoObj;

        case "ring":
          geoObj.type = "esriGeometryPolyline";
          geoObj.fields = [{
            "name": "OBJECTID",
            "type": "esriFieldTypeOID",
            "actualType": "int",
            "alias": "OBJECTID",
            "sqlType": "sqlTypeOther",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "CenterPoint",
            "alias": this.nls.centerPointLabel,
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }, {
            "name": "Rings",
            "alias": this.nls.rings,
            "type": "esriFieldTypeDouble",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "Radials",
            "alias": this.nls.radials,
            "type": "esriFieldTypeDouble",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "RadiusDistance",
            "alias": this.nls.radiusDistance,
            "type": "esriFieldTypeDouble",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
          }, {
            "name": "RadiusUnit",
            "alias": "RadiusUnit",
            "type": "esriFieldTypeString",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": 50,
            "actualType": "nvarchar",
            "sqlType": "sqlTypeNVarchar"
          }];
          return geoObj;
        default:
          break;
      }
    },

    /**
     * This function is called on click publish panel back buuton
     */
    _publishPanelBackButtonClicked: function () {
      // //remove any messages
      this.publishMessage.innerHTML = '';
      // //clear layer name
      this.addDDNameArea.setValue('');
      // //Reset layer name
      this.addDDNameArea.reset();
      this._showPanel(this._lastOpenPanel);
    },

    /**
     * Displays selected panel
     * @param {string} panel name
     * @memberOf widgets/GRG/Widget
     **/
    _showPanel: function (currentPanel) {
      var prevNode, currentNode;
      //check if previous panel exist and hide it
      if (this._currentOpenPanel) {
        prevNode = this._getNodeByName(this._currentOpenPanel);
        domClass.add(prevNode, "DDHidden");
      }
      //get current panel to be displayed and show it
      currentNode = this._getNodeByName(currentPanel);
      domClass.remove(currentNode, "DDHidden");
      //set the current panel and previous panel
      this._lastOpenPanel = this._currentOpenPanel;
      this._currentOpenPanel = currentPanel;
      this._setAccessibility();
    },

    /**
     * Get panel node from panel name
     * @param {string} panel name
     * @memberOf widgets/GRG/Widget
     **/
    _getNodeByName: function (panelName) {
      var node;
      switch (panelName) {
        case "mainPage":
          node = this.mainPageNode;
          break;
        case "publishPage":
          node = this.publishPageNode;
          break;
      }
      return node;
    },
    /**
     * This gets all the operational layers and places it in a custom data object.
     */
    _getAllMapLayers: function (geometryType) {
      var layerList = [];
      var layerStructure = LayerStructure.getInstance();
      //get all layers.
      layerStructure.traversal(function (layerNode) {
        //check to see if type exist and if it's not any tiles
        if (typeof (layerNode._layerInfo.layerObject.type) !== 'undefined') {
          if ((layerNode._layerInfo.layerObject.type).indexOf("tile") === -1) {
            if (layerNode._layerInfo.layerObject.geometryType === geometryType) {
              layerList.push(layerNode._layerInfo.layerObject);
            }
          }
        }
      });
      return layerList;
    },

    /**
     * This function is used to match selected layer fields with
     * default fields for selected type (line/circle etc.)
     **/
    _matchLayerFields: function (graphicAttributes, newLayerFields) {
      var setAttributeObj = {};
      var fields = Object.keys(this._curretfieldTypeObj);
      dojoArray.forEach(newLayerFields, lang.hitch(this, function (field) {
        dojoArray.forEach(fields, lang.hitch(this, function (matchField) {
          if (field.name.toLowerCase() === matchField.toLowerCase()) {
            if (field.type === this._curretfieldTypeObj[matchField] || field.type === "esriFieldTypeString") {
              var value = graphicAttributes[matchField];
              //if storing values in string field make sure to truncate the string
              if (value !== undefined && value !== null &&
                field.type === "esriFieldTypeString" && field.length <= 50) {
                value = value.toString().substr(0, field.length);
              }
              setAttributeObj[field.name] = value;
            }
          }
        }));
      }));
      return setAttributeObj;
    },

    _populateSelectList: function (selectNode, layerList, selectedOptionName) {
      selectNode.options = [];
      dojoArray.forEach(layerList, lang.hitch(this, function (layer) {
        selectNode.addOption({
          value: layer.name,
          id: layer.id,
          label: jimuUtils.sanitizeHTML(layer.name),
          selected: false
        });
      }));

      if (selectedOptionName !== '') {
        selectNode.setValue(selectedOptionName);
      }
      var selectedTab = this.tab.getSelectedTitle();
      this.publishNewLayer.setValue(false);

      if (((selectedTab === this.nls.tabLineTitle || selectedTab === this.nls.tabRingsTitle) &&
          this.config.operationalLineLayer.name === '')) {
        this.publishNewLayer.setValue(true);
      }
      if (((selectedTab === this.nls.tabCircleTitle || selectedTab === this.nls.tabEllipseTitle) &&
          this.config.operationalPolygonLayer.name === '')) {
        this.publishNewLayer.setValue(true);
      }
    }
  });
  return clz;
});