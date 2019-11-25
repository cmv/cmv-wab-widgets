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
  'dojo/_base/array',
  'dojo/Deferred',
  'dojo/promise/all',
  'jimu/portalUtils',
  'jimu/portalUrlUtils',
  'jimu/Role',
  'esri/request',
  'esri/kernel',
  'esri/lang',
  './PortalAnalysis'
], function(declare, lang, array, Deferred, all, portalUtils, portalUrlUtils, Role, esriRequest, esriNs,
esriLang, PortalAnalysis) {
  var instance = null;

  var clazz = declare([], {
    userRole: null,
    userPortalUrl: null,
    portalAnalysis: null,
    portalSelf: null,
    portalUrl: null,
    licenseDef: null,
    licenseLevel: null,
    federatedServers: null,

    constructor: function(portalUrl){
      this.portalUrl = portalUrl;
    },

    _clearLoadedInfo: function(){
      this.userRole = null;
      this.userPortalUrl = null;
      this.portalAnalysis = null;
      this.portalSelf = null;
      this.portalUrl = null;
    },

    loadPrivileges: function(portalUrl){
      if(portalUrl && this.portalUrl !== portalUrl){
        this._clearLoadedInfo();
        this.portalUrl = portalUrl;
      }

      if(this._privilegeLoaded()){
        var def = new Deferred();
        def.resolve(true);
        return def;
      }

      var portal = portalUtils.getPortal(this.portalUrl);
      var dfd = new Deferred(), signInDef;
      if(portal.haveSignIn()){
        signInDef = this._loadUserInfo(portal);
      }else{
        signInDef = this._signIn(portal);
      }
      signInDef.then(lang.hitch(this, function(status) {
        if (status && this.isPortal()) {
          this.checkAnalysisLicense().then(function() {
            dfd.resolve(status);
          });
        } else {
          dfd.resolve(status);
        }
      }));
      return dfd;
    },

    _signIn: function(portal){
      return portal.loadSelfInfo().then(lang.hitch(this, function(info){
        var portalHost = portalUtils.getPortal(info.portalHostname);
        if(portalHost === null){
          return false;
        }else{
          return portalHost.signIn().then(lang.hitch(this, function(credential){
            return this._loadUserInfo(portalHost, credential);
          }), function() {
            return false;
          });
        }
      }), function() {
        return false;
      });
    },

    _registerOrgCredential: function(credential, orgPortalUrl){
      orgPortalUrl = portalUrlUtils.getStandardPortalUrl(orgPortalUrl);
      var c = lang.clone(credential.toJson());
      var restUrl = orgPortalUrl + '/sharing/rest';
      c.server = restUrl;
      c.resources = [restUrl];
      esriNs.id.registerToken(c);
    },

    _loadUserInfo: function(portal, credential){
      var selfInfoDef = portal.loadSelfInfo();
      var helpmapDef = portal.getHelpMap();
      return all([selfInfoDef, helpmapDef]).then(lang.hitch(this, function(defArray){
        var selfInfo = defArray[0], helpmapInfo = defArray[1] && defArray[1].helpMap;
        var helpmap = {};
        if (helpmapInfo) {
          if (helpmapInfo.v && helpmapInfo.m) {
            helpmap.helpMap = helpmapInfo;
          } else {
            helpmap.helpMap = {
              v: '1.0',
              m: helpmapInfo
            };
          }
        }
        if(selfInfo.urlKey){
          this.userPortalUrl = selfInfo.urlKey + '.' + selfInfo.customBaseUrl;
        }else{
          this.userPortalUrl = this.portalUrl;
        }
        if(selfInfo && selfInfo.user) {
          this.userRole = new Role({
            id: (selfInfo.user.roleId) ? selfInfo.user.roleId : selfInfo.user.role,
            role: selfInfo.user.role
          });
          if(selfInfo.user.privileges) {
            this.userRole.setPrivileges(selfInfo.user.privileges);
          }
          this.portalSelf = lang.mixin(selfInfo, helpmap);
          if(credential){
            this._registerOrgCredential(credential, this.userPortalUrl);
          }
          this.portalAnalysis = new PortalAnalysis(this.userRole,
              this.portalSelf);
          return true;
        }else{
          return false;
        }
      }), function() {
        return false;
      });
    },

    _privilegeLoaded: function(){
      return this.portalSelf !== null;
    },

    getUser: function(){
      if(this._privilegeLoaded()){
        return this.portalSelf.user;
      }else{
        return null;
      }
    },

    isAdmin: function(){
      if(this._privilegeLoaded()){
        return this.userRole.isAdmin();
      }else{
        return false;
      }
    },

    getUserPortal: function(){
      if(this._privilegeLoaded()){
        return this.userPortalUrl;
      }else{
        return null;
      }
    },

    isPortal: function(){
      return this.portalSelf !== null && this.portalSelf.isPortal === true;
    },

    //check to show analysis UX
    canPerformAnalysis: function(){
      return this.portalAnalysis !== null && this.portalAnalysis.canPerformAnalysis();
    },

    canPerformSpatialAnalytics: function() {
      return this.portalAnalysis !== null && this.portalAnalysis.canPerformSpatialAnalytics();
    },

    canPerformGeoAnalytics: function() {
      return this.portalAnalysis !== null && this.portalAnalysis.canPerformGeoAnalytics();
    },

    canPerformRasterAnalysis: function () {
      return this.portalAnalysis !== null && this.portalAnalysis.canPerformRasterAnalysis();
    },

    canPerformGeoEnrichment: function() {
      return this.portalAnalysis !== null && this.portalAnalysis._canPerformGeoEnrichment();
    },

    hasPrivileges: function(privileges){
      var other = privileges, shouldCheckLicense = false;
      if (lang.isArray(privileges) && privileges.indexOf('svradvanced') >= 0) {
        shouldCheckLicense = true;
        other = array.filter(privileges, function(item) {
          return item !== 'svradvanced';
        });
      }
      if (shouldCheckLicense && this.isPortal()) {
        return this.isAdvanceLicense() && this.portalAnalysis !== null && this.portalAnalysis.hasPrivileges(other);
      }
      return this.portalAnalysis !== null && this.portalAnalysis.hasPrivileges(other);
    },

    isAdvanceLicense: function() {
      return this.licenseLevel === 'svradvanced';
    },

    getFederatedServers: function() {
      var dfd = new Deferred(),
        isPortal = this.isPortal();
      if (isPortal && this.userRole && !this.federatedServers) {
        var restBaseUrl = portalUrlUtils.getSharingUrl(this.portalUrl);
        var serversUrl = restBaseUrl + '/portals/' + this.portalSelf.id + '/servers';
        esriRequest({url: serversUrl, content: {f: 'json'}}).then(lang.hitch(this, function (servers) {
          this.federatedServers = servers.servers;
          dfd.resolve(this.federatedServers);
        }), lang.hitch(this, function (error) {
          console.log('cannot load federated servers', error);
          this.federatedServers = [];
          dfd.resolve([]);
        }));
      } else {
        dfd.resolve(this.federatedServers);
      }
      return dfd;
    },

    getLicense: function(servers) {
      //console.log(servers);
      var dfd = new Deferred(), hostingserverArr, hostingServer;
      if(servers.length === 0) {
        dfd.resolve(null);
        return dfd;
      }
      hostingserverArr = array.filter(servers, function(server) {
        return server.serverRole === 'HOSTING_SERVER';
      } , this);

      if(hostingserverArr.length > 0) {
        hostingServer = hostingserverArr[0];
      }
      var restBaseUrl = portalUrlUtils.getSharingUrl(this.portalUrl);
      esriRequest({
        url: restBaseUrl + '/portals/' + this.portalSelf.id + '/servers/' + hostingServer.id,
        content: {f: 'json'}
      }).then(lang.hitch(this, function(serverInfo) {
        //console.log(serverInfo);
        var licenseInfo = lang.mixin({}, serverInfo);
        var defaultLicenseLevel =
          !esriLang.isDefined(serverInfo.edition) && !esriLang.isDefined(serverInfo.level) ? 'svradvanced' : null;
        this.licenseLevel = licenseInfo.edition ? licenseInfo.edition.name : defaultLicenseLevel;
        dfd.resolve({licenseInfo: licenseInfo,
          licenseLevel: this.licenseLevel
        });
      }), lang.hitch(this, function (error) {
        console.log('cannot load hostingServer info', error);
        dfd.resolve({});
      }));
      return dfd;
    },

    /**
     * Copied from arcgisonline/map/dijit/toc/analysis.js
     */
    checkAnalysisLicense: function() {
      var def = new Deferred();
      if(this.licenseDef) {
        if(this.licenseDef.isResolved()) {
          def.resolve(this.licenseLevel === 'svradvanced');
        } else {
          this.licenseDef.then(lang.hitch(this, function() {
            def.resolve(this.licenseLevel === 'svradvanced');
          }));
        }
      } else {
        this.licenseDef = this.getFederatedServers().then(lang.hitch(this, function(servers) {
          return this.getLicense(servers);
        }));
        this.licenseDef.then(lang.hitch(this, function() {
          return def.resolve(this.licenseLevel === 'svradvanced');
        }));
      }
      return def;
    }
  });

  clazz.getInstance = function(portalUrl) {
    if(instance === null) {
      instance = new clazz(portalUrl);
    }
    return instance;
  };

  return clazz;
});
