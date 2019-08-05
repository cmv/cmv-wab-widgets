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
  'dojo/_base/lang'
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
  lang
) {
  'use strict';
  var clz = dojoDeclare([jimuBaseWidget, dijitWidgetsInTemplate], {
    baseClass: 'jimu-widget-DistanceAndDirection',

    /**
     *
     **/
    postCreate: function () {
      dojoDeclare.safeMixin(this.nls, window.jimuNls);
      if (!this.config.feedback) {
        this.config.feedback = {};
      }

      if (this.config.feedback.lineSymbol.showTab) {
        this.lineTab = new TabLine({
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
    },

    startup: function () {
      this._setTheme();
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
    }
  });
  return clz;
});