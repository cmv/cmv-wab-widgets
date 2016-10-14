///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
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
    'dojo/_base/lang',
    //'jimu/portalUtils',
    //'jimu/portalUrlUtils',
    //'esri/urlUtils',
    'esri/request',
    //'dojo/_base/array',
    "dojo/promise/all",
    //"dojo/dom-attr",
    "jimu/shared/basePortalUrlUtils",
    'dojo/Deferred',
    'esri/lang',
    'jimu/portalUtils',
    'jimu/Role',
    "jimu/utils"
  ],
  function(lang, /*portalUtils, portalUrlUtils,esriUrlUtils, */esriRequest/*, array*/, all, /*domAttr,*/
           basePortalUrlUtils, Deferred, esriLang, portalUtils, Role, jimuUtils) {
    var su = {};

    su._isUserOwnTheApp = function(userObj) {
      if (userObj && userObj.username && userObj.username === window.appInfo.appOwner) {
        return true;
      } else {
        return false;
      }
    };

    su.getItemByUserAndItemId = function(item, itemUser, user, portalUrl) {
      var def = new Deferred();
      var url = basePortalUrlUtils.getStandardPortalUrl(portalUrl);
      url += '/sharing/rest/content/users/';
      //basePortalUrlUtils.getUserContentUrl(_portalUrl, _user, _folderId);
      url += (itemUser ?
        (itemUser.username ? itemUser.username : itemUser.email) : user.email);
      if ((esriLang.isDefined(item.folderId) && item.folderId !== '/') ||
        (esriLang.isDefined(item.ownerFolder) && item.ownerFolder !== '/')) {
        url += '/' + (item.folderId || item.ownerFolder);
      }
      url += '/items/' + item.id;
      var content = {
        f: 'json'
      };
      esriRequest({
        url: url,
        handleAs: 'json',
        content: content,
        callbackParamName: 'callback'
      }).then(lang.hitch(this, function(groupsResponse) {
        def.resolve(groupsResponse);
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.reject(err);
      }));
      return def;
    };

    su._getProfile = function(item, portalUrl) {
      var def = new Deferred();
      var url = basePortalUrlUtils.getUserUrl(portalUrl, item.owner);
      var content = {
        f: 'json'
      };
      esriRequest({
        url: url,
        handleAs: 'json',
        content: content,
        callbackParamName: 'callback'
      }).then(lang.hitch(this, function(groupsResponse) {
        def.resolve(groupsResponse);
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.reject(err);
      }));
      return def;
    };
    su._unshareItemById = function(args, itemId, portalUrl/*, itemFolderId*/) {
      var def = new Deferred();
      //var userStr = (this.itemUser ? (this.itemUser.username ? this.itemUser.username : this.itemUser.email) : this.user.email);
      //var contentItems = basePortalUrlUtils.getUserItemsUrl(this.portalUrl, userStr, itemFolderId);
      var url = basePortalUrlUtils.getStandardPortalUrl(portalUrl);
      url += '/sharing/rest/content/items/' + itemId + "/unshare";
      var content = {
        f: 'json'
      };
      content = lang.mixin(content, args);
      esriRequest({
        url: url,
        handleAs: 'json',
        content: content,
        callbackParamName: 'callback'
      }, {
        usePost: true
      }).then(lang.hitch(this, function(res) {
        def.resolve(res);
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.reject(err);
      }));
      return def;
    };
    su.canSharePublic = function(portalObj) {
      // always returns true if called before /self is retrieved or if canSharePublic is not defined in esriGeowConfig.self
      return (portalObj.selfUrl &&
      (portalObj.canSharePublic === true || portalObj.canSharePublic === false)) ? portalObj.canSharePublic : true;
    };
    su.unshareItemsByUser = function(username, request, portalUrl) {
      //var url = esriGeowConfig.restBaseUrl + 'content/users/' + username + '/unshareItems';
      //this.util.postJson(request, url, handler, errorHandler);
      var def = new Deferred();
      //var userStr = (this.itemUser ? (this.itemUser.username ? this.itemUser.username : this.itemUser.email) : this.user.email);
      //var contentItems = basePortalUrlUtils.getUserItemsUrl(this.portalUrl, userStr, itemFolderId);
      var url = basePortalUrlUtils.getStandardPortalUrl(portalUrl);
      url += '/sharing/rest/content/users/' + username + '/unshareItems';
      var content = {
        f: 'json'
      };
      content = lang.mixin(content, request);
      esriRequest({
        url: url,
        handleAs: 'json',
        content: content,
        callbackParamName: 'callback'
      }, {
        usePost: true
      }).then(lang.hitch(this, function(res) {
        def.resolve(res);
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.reject(err);
      }));
      return def;
    };
    su.unshareItems = function(itemUser, request, portalUrl) {
      //var user = this.util.getUser();
      //if (user == null) return;
      var def = new Deferred();
      var url = basePortalUrlUtils.getStandardPortalUrl(portalUrl);
      url += '/sharing/rest/content/users/' + (request.owner || itemUser.email) + '/unshareItems';
      var content = {
        f: 'json'
      };
      content = lang.mixin(content, request);
      esriRequest({
        url: url,
        handleAs: 'json',
        content: content,
        callbackParamName: 'callback'
      }, {
        usePost: true
      }).then(lang.hitch(this, function(res) {
        def.resolve(res);
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.reject(err);
      }));
      return def;
    };
    su.shareItemsByUser = function(username, request, portalUrl) {
      var def = new Deferred();
      var url = basePortalUrlUtils.getStandardPortalUrl(portalUrl);
      url += '/sharing/rest/content/users/' + username + '/shareItems';
      var content = {
        f: 'json'
      };
      content = lang.mixin(content, request);
      esriRequest({
        url: url,
        handleAs: 'json',
        content: content,
        callbackParamName: 'callback'
      }, {
        usePost: true
      }).then(lang.hitch(this, function(res) {
        def.resolve(res);
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.reject(err);
      }));
      return def;
    };
    su.shareItems = function(itemUser, request, portalUrl) {
      //var user = this.util.getUser();
      //if (user == null) return;
      var def = new Deferred();
      var url = basePortalUrlUtils.getStandardPortalUrl(portalUrl);
      url += '/sharing/rest/content/users/' + (request.owner || itemUser.email) + '/shareItems';
      var content = {
        f: 'json'
      };
      content = lang.mixin(content, request);
      esriRequest({
        url: url,
        handleAs: 'json',
        content: content,
        callbackParamName: 'callback'
      }, {
        usePost: true
      }).then(lang.hitch(this, function(res) {
        def.resolve(res);
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.reject(err);
      }));
      return def;
    };

    su.getItemsGroups = function(item, portalUrl) {
      var def = new Deferred();
      var url = basePortalUrlUtils.getStandardPortalUrl(portalUrl);
      url += '/sharing/rest/content/items/' + item.id + '/groups';
      var content = {
        f: 'json'
      };
      //content = lang.mixin(content, request);
      esriRequest({
        url: url,
        handleAs: 'json',
        content: content,
        callbackParamName: 'callback'
      }, {
        usePost: true
      }).then(lang.hitch(this, function(res) {
        def.resolve(res);
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.reject(err);
      }));
      return def;
    };
    /////////////////////////////////////////////////////////
    su.isSharedToPublic = function(shareInfo) {
      if (window.isXT) {
        return false;
      }

      if (shareInfo === null) {
        return true;//deployed
      } else if (typeof shareInfo !== "undefined" && typeof shareInfo.item !== "undefined" &&
        typeof shareInfo.item.access !== "undefined" && shareInfo.item.access === "public") {
        return true;
      } else {
        // default publicFlag is false
        return false;
      }
    };
    su.isShowSocialMediaLinks = function(shareInfo) {
      if (window.isXT) {
        return true;
      }

      if (shareInfo === null) {
        return true;//deployed apps
      } else if (typeof shareInfo !== "undefined" && typeof shareInfo.item !== "undefined" &&
        typeof shareInfo.item.access !== "undefined" && shareInfo.item.access === "private") {
        return false;
      } else {
        return true;
      }
    };

    su.getItemShareInfo = function(portalUrl) {
      var def = new Deferred();

      var appId = "";
      if (window.isXT) {
        return def.resolve(null);
      } else {
        var urlParams = jimuUtils.urlToObject(window.top.location.href).query || {};
        appId = urlParams.id || urlParams.appid;
      }
      if (typeof appId === "undefined" || appId === "") {
        return def.resolve(null);//deployed apps
      }

      var portal = portalUtils.getPortal(portalUrl);
      portal.getItemById(appId).then(lang.hitch(this, function(result) {
        var shareInfo = {};
        shareInfo.item = result;
        if (shareInfo.item && typeof shareInfo.item.sharing === "undefined" && shareInfo.item.access) {
          shareInfo.item.sharing = {
            access: shareInfo.item.access
          };
        }

        def.resolve(shareInfo);
      }), lang.hitch(this, function(err) {
        //can't get shareInfo, maybe credential is null.
        console.log(err);
        def.resolve(null);
      }));
      return def;
    };

    //TODO should be deprecated. _setUserRole:canShareOthersItemsToGroup()
    su.getShareInfo = function(portalUrl) {
      var portal = portalUtils.getPortal(portalUrl);

      var def = new Deferred();
      var appId = "";
      if (window.isXT) {
        return def.resolve(null);
      } else {
        var urlParams = jimuUtils.urlToObject(window.top.location.href).query || {};
        appId = urlParams.id || urlParams.appid;
      }

      if(typeof appId === "undefined" || appId === ""){
        return def.resolve(null);//deployed
      }

      all({
        getUser: portal.getUser(),
        loadSelfInfo: portal.loadSelfInfo(),
        getItem: portal.getItemById(appId)
      }).then(lang.hitch(this, function(results) {
        var shareInfo = {};

        shareInfo.item = results.getItem;
        if (shareInfo.item && shareInfo.item.ownerFolder &&
          shareInfo.item.ownerFolder.length && shareInfo.item.ownerFolder !== '/') {
          shareInfo.item.folderId = shareInfo.item.ownerFolder;
        }
        if (typeof shareInfo.item.sharing === "undefined" && shareInfo.item.access) {
          shareInfo.item.sharing = {
            access: shareInfo.item.access
          };
        }
        //oneItem.sharing = result.sharing;

        shareInfo.user = results.getUser;
        su._setUserRole(results.loadSelfInfo, shareInfo);

        shareInfo.currentUser = shareInfo.user;
        // admin?
        shareInfo.isAdmin = false;
        //if (this.currentUser && this.currentUser.accountId && this.currentUser.role && this.currentUser.role === "account_admin") {
        if (shareInfo.userRole && (shareInfo.userRole.isAdmin() ||
          (shareInfo.userRole.isCustom() && shareInfo.userRole.canUpdateOrgItems()))) {
          // in regards to sharing admin role and custom role with updateOrgItems is the same
          shareInfo.isAdmin = true;
          if (shareInfo.item.owner !== shareInfo.currentUser.name) {
            su._getProfile(shareInfo.item, portalUrl).then(lang.hitch(this, function(result) {
              shareInfo.itemUser = result;
              if (shareInfo.itemUser.orgId !== shareInfo.currentUser.orgId/*accountId*/) {
                // user is not the admin of the web map owner
                shareInfo.isAdmin = false;
              }

              def.resolve(shareInfo);
            }));
          } else {
            shareInfo.itemUser = shareInfo.currentUser;
            def.resolve(shareInfo);
          }

        } else if (shareInfo.currentUser) {
          shareInfo.itemUser = shareInfo.currentUser;
          def.resolve(shareInfo);
        } else {
          // user is not logged in
          def.resolve(shareInfo);
        }
      }), lang.hitch(this, function(err) {
        //can't get shareInfo, maybe credential is null.
        console.log(err);
        def.resolve(null);
      }));
      return def;
    };

    su._setUserRole = function(res, shareInfo) {
      if (res.urlKey) {
        shareInfo.userPortalUrl = res.urlKey + '.' + res.customBaseUrl;
      } else {
        shareInfo.userPortalUrl = this.portalUrl;
      }

      if (res && !res.code && !res.message) {
        shareInfo.organization = res;//"portals/self?" += "&token="
      }

      if (res && res.user) {
        shareInfo.userRole = new Role({
          id: (res.user.roleId) ? res.user.roleId : res.user.role,
          role: res.user.role
        });

        shareInfo._isCustomRole = shareInfo.userRole.isCustom();
        shareInfo._roleCanShareToGroup = shareInfo._isCustomRole && shareInfo.userRole.canShareItemToGroup();
        shareInfo._roleCanShareToOrg = shareInfo._isCustomRole && shareInfo.userRole.canShareItemToOrg();
        shareInfo._roleCanSharePublic = shareInfo._isCustomRole && shareInfo.userRole.canShareItemToPublic();
        shareInfo._roleCanShare = (shareInfo._roleCanShareToGroup ||
        shareInfo._roleCanShareToOrg || shareInfo._roleCanShareToPublic);
        shareInfo._roleCanUpdateItems = shareInfo._isCustomRole && shareInfo.userRole.canUpdateOrgItems();
        //TODO NO canShareOthersItemsToGroup
        shareInfo._roleCanShareOthersItemsToGroup = shareInfo._isCustomRole &&
          shareInfo.userRole.canShareOthersItemsToGroup();
        shareInfo._roleCanShareOthersItemsToOrg = shareInfo._isCustomRole &&
          shareInfo.userRole.canShareOthersItemsToOrg();
        shareInfo._roleCanShareOthersItemsToPublic = shareInfo._isCustomRole &&
          shareInfo.userRole.canShareOthersItemsToPublic();

        shareInfo._roleCanShareOthersItems = shareInfo._isCustomRole && (
            shareInfo.userRole.canShareOthersItemsToGroup() ||
            shareInfo.userRole.canShareOthersItemsToOrg() ||
            shareInfo._roleCanShareOthersItemsToPublic
          );

        //An org user can share public if one set of the
        shareInfo._orgUserCanSharePublicOrOverride = (shareInfo.organization && (
          (shareInfo.organization.canSharePublic === true &&
          (!shareInfo._isCustomRole || shareInfo._roleCanSharePublic || shareInfo._roleCanShareOthersItemsToPublic)) ||
          (shareInfo.userRole.isAdmin())
        ));

      } else {
        return false;
      }
    };
    su.getItemById = function(item, portalUrl) {
      //http://www.arcgis.com/sharing/rest/content/items/
      var def = new Deferred();
      var url = basePortalUrlUtils.getStandardPortalUrl(portalUrl);
      url += '/sharing/rest/content/items/' + item.id;
      //basePortalUrlUtils.getUserContentUrl(_portalUrl, _user, _folderId);
      var content = {
        f: 'json'
      };
      esriRequest({
        url: url,
        handleAs: 'json',
        content: content,
        callbackParamName: 'callback'
      }).then(lang.hitch(this, function(groupsResponse) {
        def.resolve(groupsResponse);
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.reject(err);
      }));
      return def;
    };

    return su;
  });