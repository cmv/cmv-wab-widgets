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
  'dojo/_base/lang',
  'dojo/dom-class',
  'dojo/on',
  'dojo/dom-attr',
  'dojo/query',
  'dojo/keys',
  'dojo/Deferred',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidgetSetting',
  'jimu/dijit/Message',
  'esri/dijit/util/busyIndicator',
  '../js/PrivilegeUtil',
  'dojo/_base/array',
  'dijit/form/ValidationTextBox'
], function (
  declare,
  lang,
  domClass,
  on,
  domAttr,
  query,
  keys,
  Deferred,
  _WidgetsInTemplateMixin,
  BaseWidgetSetting,
  jimuMessage,
  BusyIndicator,
  PrivilegeUtil,
  dojoArray
) {
  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-visibility-setting',
    hasError: false,

    postMixInProperties: function () {
      this.inherited(arguments);
      lang.mixin(this.nls, window.jimuNls.common);
      lang.mixin(this.nls, window.jimuNls.units);
    },

    postCreate: function () {
      //Add options for distance and height drop downs
      var options = [],
        option, dropDownOptions;
      dropDownOptions = ['meters', 'kilometers', 'miles',
        'feet', 'yards', 'nauticalMiles'
      ];
      dojoArray.forEach(dropDownOptions, lang.hitch(this, function (type) {
        option = {
          value: type,
          label: this.nls.units[type]
        };
        options.push(option);
      }));
      this.observerHeightUnit.addOption(options);
      this.observableDistanceUnit.addOption(lang.clone(options));
      this.observerHeightUnit.set('value', 'meters');
      this.observableDistanceUnit.set('value', 'kilometers');
    },

    startup: function () {
      this.inherited(arguments);
      this.own(on(this.urlTextBox, "keypress", lang.hitch(this, this.urlChanged)));
      this.own(on(this.setButton, "click", lang.hitch(this, this.setButtonClicked)));
      this.setConfig(this.config);
      this.busyIndicator = BusyIndicator.create({
        target: this.domNode.parentNode,
        backgroundOpacity: 0
      });
      this._startValidationProcess();
    },

    urlChanged: function (evt) {
      this._diasableOk();
      domClass.remove(this.setButton, "jimu-state-disabled");
      if (evt.charOrCode === keys.ENTER) {
        this._startValidationProcess();
      }
    },

    setButtonClicked: function () {
      this._startValidationProcess();
    },

    setConfig: function (config) {
      var portalURL = this.appConfig.portalUrl;
      if (config.portalUrl) {
        portalURL = config.portalUrl;
      }
      this.urlTextBox.set('value', portalURL, false);
      //set unit values as per prev configuration
      if (config.hasOwnProperty("defaultObserverHeightUnit")) {
        this.observerHeightUnit.set("value", config.defaultObserverHeightUnit);
      }
      if (config.hasOwnProperty("defaultObservableDistanceUnit")) {
        this.observableDistanceUnit.set("value", config.defaultObservableDistanceUnit);
      }
      if (config.hasOwnProperty("defaultAngleUnits")) {
        this.angleUnits.setValue(config.defaultAngleUnits);
      }
    },

    getConfig: function () {
      if (this.hasError) {
        return false;
      }
      return {
        "portalUrl": this.urlTextBox.get('value'),
        "defaultObserverHeightUnit": this.observerHeightUnit.get('value'),
        "defaultObservableDistanceUnit": this.observableDistanceUnit.get('value'),
        "defaultAngleUnits": this.angleUnits.getValue()
      };
    },

    validateUrl: function (portalURL) {
      var def = new Deferred();
      this.privilegeUtil = PrivilegeUtil.getInstance(portalURL);
      this.privilegeUtil.loadPrivileges(portalURL).then(
        lang.hitch(this, function () {
          def.resolve(this._validatePrivileges());
        }),
        lang.hitch(this, function () {
          this._showError();
          def.reject();
        }));
      return def.promise;
    },

    _configurePortalURL: function (url) {
      var def = new Deferred();
      if (url) {
        this.validateUrl(url).then(lang.hitch(this, function (status) {
          if (status) {
            def.resolve();
          } else {
            def.reject();
          }
        }), lang.hitch(this, function () {
          def.reject();
        }));
      }
      return def.promise;
    },

    _startValidationProcess: function () {
      if (this.urlTextBox.isValid()) {
        this.busyIndicator.show();
        var portalURL = this.urlTextBox.get('value');
        this._configurePortalURL(portalURL).then(lang.hitch(this, function () {
          domClass.add(this.setButton, "jimu-state-disabled");
          domClass.add(this.errorNode, "hide-section");
          this._enableOk();
          this.busyIndicator.hide();
        }), lang.hitch(this, function () {
          this.busyIndicator.hide();
          this._showError(this.nls.portalURLError);
        }));
      } else {
        this.busyIndicator.hide();
        this._showError(this.nls.portalURLError);
      }
    },

    _validatePrivileges: function () {
      return (this.privilegeUtil._canPerformElevationAnalysis()) ? true : false;
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
      domAttr.set(this.errorNode, "innerHTML", error);
      domClass.remove(this.errorNode, "hide-section");
      this._diasableOk();
    },

    _enableOk: function () {
      var s = query(".button-container")[0];
      if (s && s.children && s.children.length > 3) {
        domClass.remove(s.children[0], "jimu-state-disabled");
        this.hasError = false;
      }
    },

    _diasableOk: function () {
      var s = query(".button-container")[0];
      if (s && s.children && s.children.length > 3) {
        domClass.add(s.children[0], "jimu-state-disabled");
        this.hasError = true;
      }
    }
  });
});