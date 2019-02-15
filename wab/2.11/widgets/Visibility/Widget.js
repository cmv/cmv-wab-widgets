///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
    'dojo/dom-construct',
    'dojo/_base/lang',
    'dojo/dom-attr',
    'jimu/BaseWidget',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/dijit/Message',
    'jimu/utils',
    './js/VisibilityControl',
    './js/PrivilegeUtil'
  ],
  function (
    dojoDeclare,
    domConstruct,
    lang,
    domAttr,
    jimuBaseWidget,
    dijitWidgetsInTemplateMixin,
    jimuMessage,
    utils,
    VisibilityControl,
    PrivilegeUtil
  ) {
    var clazz = dojoDeclare([jimuBaseWidget, dijitWidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-visiblity',
      privilegeUtil: null,
      _visibilityControl: null,

      startup: function () {
        this.inherited(arguments);
        if (this.config.portalUrl) {
          this.privilegeUtil = PrivilegeUtil.getInstance(this.config.portalUrl);
          this.privilegeUtil.loadPrivileges().then(lang.hitch(this, this._validatePrivileges),
            lang.hitch(this, this._showError));
        } else {
          this._showError(this.nls.portalURLError);
        }

      },

      _validatePrivileges: function (status) {
        if (!status || !this.privilegeUtil._canPerformElevationAnalysis()) {
          this._showError();
        } else {
          this._createVisibilityControl();
        }
      },

      _showError: function (error) {
        if (!error) {
          error = this.nls.privilegeError;
          if (!this.privilegeUtil._isServiceAvailable) {
            error = this.nls.noServiceError;
          }
        }
        new jimuMessage({
          message: error
        });
        domAttr.set(this.visibilityContainer, "innerHTML", error);
      },

      _createVisibilityControl: function () {
        var portalUrl = this.privilegeUtil.getUserPortal();
        //create visibility control only if not created and have valid portal URL
        if (!this._visibilityControl && portalUrl) {
          this._visibilityControl = new VisibilityControl({
            nls: this.nls,
            appConfig: this.appConfig,
            portalUrl: portalUrl,
            pointSymbol: {
              'color': [255, 0, 0, 64],
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
            viewshedService: this.config.taskUrl,
            map: this.map
          }, domConstruct.create("div")).placeAt(this.visibilityContainer);
          this._visibilityControl.startup();
          this._setTheme();
        }
      },

      _isURL: function (s) {
        var regexp =
          /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);
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
        //Check if Dart Theme
        if (this.appConfig.theme.name === "DartTheme") {
          //Load appropriate CSS for dart theme
          utils.loadStyleLink('dartOverrideCSS', this.folderUrl + "css/dartTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/dartTheme.css", 'css');
        }
        //Check if DashBoard Theme
        if (this.appConfig.theme.name === "DashboardTheme") {
          //Load appropriate CSS for dashboard theme
          utils.loadStyleLink('dashboardOverrideCSS', this.folderUrl +
            "css/dashboardTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/dashboardTheme.css", 'css');
        }
        //Check if Launchpad Theme
        if (this.appConfig.theme.name === "LaunchpadTheme") {
          //Load appropriate CSS for dashboard theme
          utils.loadStyleLink('launchpadOverrideCSS', this.folderUrl +
            "css/launchpadTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/launchpadTheme.css", 'css');
        }
        //Check if Box Theme
        if (this.appConfig.theme.name === "BoxTheme") {
          //Load appropriate CSS for dashboard theme
          utils.loadStyleLink('boxOverrideCSS', this.folderUrl +
            "css/boxTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/boxTheme.css", 'css');
        }
      }

    });
    return clazz;
  });