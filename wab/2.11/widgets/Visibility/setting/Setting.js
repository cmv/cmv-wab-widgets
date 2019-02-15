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
    'dojo/_base/lang',
    'dojo/dom-class',
    'dojo/on',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dojo/query',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/Message',
    '../js/PrivilegeUtil',
    'dijit/form/ValidationTextBox'
  ],
  function (declare, lang, domClass, on, domAttr, domStyle, query, _WidgetsInTemplateMixin, BaseWidgetSetting, jimuMessage, PrivilegeUtil) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-visibility-setting',

      postMixInProperties: function () {
        this.inherited(arguments);
        lang.mixin(this.nls, window.jimuNls.common);
        lang.mixin(this.nls, window.jimuNls.units);
      },

      startup: function () {
        this.inherited(arguments);
        this.own(on(this.urlTextBox, "keyup", lang.hitch(this, this.urlChanged)));
        this.setConfig(this.config);
      },

      urlChanged: function () {
        if (!this.urlTextBox.isValid()) {
          this._showError(this.nls.portalURLError);
        }
        this._diasableOk();
        domClass.remove(this.setButton, "jimu-state-disabled");
      },

      _configurePortalURL: function () {
        var portalURL = this.urlTextBox.get('value');
        if (!domClass.contains(this.setButton, "jimu-state-disabled")) {
          if (portalURL) {
            this.validateUrl(portalURL);
          }
        }
      },

      setConfig: function (config) {
        var portalURL = this.appConfig.portalUrl;
        if (config.portalUrl) {
          portalURL = config.portalUrl;
        }
        this.urlTextBox.set('value', portalURL, false);
        this.validateUrl(portalURL);
      },

      getConfig: function () {
        return {
          "portalUrl": this.urlTextBox.get('value')
        };
      },

      validateUrl: function (portalURL) {
        this.privilegeUtil = PrivilegeUtil.getInstance(portalURL);
        this.privilegeUtil.loadPrivileges(portalURL).then(
          lang.hitch(this, this._validatePrivileges),
          lang.hitch(this, this._showError));
      },

      _validatePrivileges: function (status) {
        if (!status || !this.privilegeUtil._canPerformElevationAnalysis()) {
          this._showError();
        } else {
          domClass.add(this.setButton, "jimu-state-disabled");
          domStyle.set(this.errorNode, "display", "none");
          this._enableOk();
          return true;
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
        domStyle.set(this.errorNode, "display", "block");
        domAttr.set(this.errorNode, "innerHTML", error);
        this._diasableOk();
      },

      _enableOk: function () {
        var s = query(".button-container")[0];
        if (s && s.children && s.children.length > 3) {
          domStyle.set(s.children[0], "display", "inline-block");
        }

      },

      _diasableOk: function () {
        var s = query(".button-container")[0];
        if (s && s.children && s.children.length > 3) {
          domStyle.set(s.children[0], "display", "none");
        }
      }
    });
  });