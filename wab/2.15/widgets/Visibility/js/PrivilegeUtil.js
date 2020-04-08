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
    'jimu/portalUtils',
    'jimu/portalUrlUtils',
    'jimu/Role',
    'esri/lang'
  ],
  function (
    declare,
    lang,
    portalUtils,
    portalUrlUtils,
    Role,
    esriLang
  ) {
    var instance = null;

    var clazz = declare([], {
      userRole: null,
      userPortalUrl: null,
      portalAnalysis: null,
      portalSelf: null,
      portalUrl: null,
      _isServiceAvailable: false,

      constructor: function (portalUrl) {
        this.portalUrl = portalUrl;
      },

      _clearLoadedInfo: function () {
        this.userRole = null;
        this.userPortalUrl = null;
        this.portalSelf = null;
        this.portalUrl = null;
      },

      loadPrivileges: function (portalURL) {
        var portal;
        this.userRole = null;
        this.userPortalUrl = null;
        this.portalSelf = null;
        this._isServiceAvailable = false;
        if (portalURL) {
          this.portalUrl = portalURL;
        }
        portal = portalUtils.getPortal(this.portalUrl);
        if (portal.haveSignIn()) {
          return this._loadUserInfo(portal);
        } else {
          return this._signIn(portal);
        }
      },

      getPortalUrl: function (url) {
        if (url) {
          return portalUrlUtils.getStandardPortalUrl(url);
        } else if (this.portalUrl) {
          return portalUrlUtils.getStandardPortalUrl(this.portalUrl);
        } else {
          return portalUrlUtils.getStandardPortalUrl(this.appConfig.portalUrl);
        }
      },

      _privilegeLoaded: function () {
        return this.portalSelf !== null;
      },

      getUserPortal: function () {
        if (this._privilegeLoaded()) {
          return this.getPortalUrl(this.userPortalUrl);
        } else {
          return null;
        }
      },

      _signIn: function (portal) {
        return portal.loadSelfInfo().then(lang.hitch(this, function (info) {
          var portalHost = portalUtils.getPortal(info.portalHostname);
          if (portalHost === null) {
            return false;
          } else {
            return portalHost.signIn().then(lang.hitch(this, function (credential) {
              return this._loadUserInfo(portalHost, credential);
            }), function () {
              return false;
            });
          }
        }), function () {
          return false;
        });
      },

      _loadUserInfo: function (portal) {
        return portal.loadSelfInfo().then(lang.hitch(this, function (res) {
          if (res.urlKey) {
            this.userPortalUrl = res.urlKey + '.' + res.customBaseUrl;
          } else {
            this.userPortalUrl = this.portalUrl;
          }
          if (res && res.user) {
            this.userRole = new Role({
              id: (res.user.roleId) ? res.user.roleId : res.user.role,
              role: res.user.role
            });
            if (res.user.privileges) {
              this.userRole.setPrivileges(res.user.privileges);
            }
            this.portalSelf = res;
            return true;
          } else {
            return false;
          }
        }), function () {
          return false;
        });
      },

      _canPerformElevationAnalysis: function () {
        if (this.portalSelf) {
          this._isServiceAvailable = esriLang.isDefined(this.portalSelf.helperServices.elevation);
        }
        return this.canPerformAnalysis() && this._isServiceAvailable;
      },

      canPerformAnalysis: function () {
        var privCheck = false;
        if (this.userRole && (this.userRole.isAdmin() || this.userRole.isPublisher())) {
          privCheck = true;
        } else if (this.userRole && this.userRole.isCustom()) {
          privCheck = this.userRole.canCreateItem() &&
            this.userRole.canPublishFeatures() &&
            this.userRole.canUseSpatialAnalysis();
        }

        //check if helperservices are configured if running in portal.
        //In online new trial orgs, analysis server is not configured until
        //a feature service is created, hive is allocated, while job submission after
        //createservice call its set
        // Portal this is necessary condition for enabling analysis
        if (this.portalSelf && this.portalSelf.isPortal) {
          privCheck = privCheck &&
            esriLang.isDefined(this.portalSelf.helperServices.analysis) &&
            esriLang.isDefined(this.portalSelf.helperServices.analysis.url);
        }
        return privCheck;
      }
    });

    clazz.getInstance = function (portalUrl) {
      if (instance === null) {
        instance = new clazz(portalUrl);
      }
      return instance;
    };

    return clazz;
  });