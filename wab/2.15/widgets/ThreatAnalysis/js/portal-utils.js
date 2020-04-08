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

define([
  'esri/request',
  'dojo/json',
  'dojo/topic',
  'dojo/_base/lang',
  'dojo/_base/array',
  'esri/arcgis/Portal',
  'esri/IdentityManager',
  'esri/layers/FeatureLayer',
  'jimu/LayerInfos/LayerInfos'
], function (
  esriRequest,
  JSON,
  topic,
  lang,
  array,
  esriPortal,
  esriId,
  FeatureLayer,
  jimuLayerInfos
) {
  var portalUtil = {};

  portalUtil.saveToPortal = function (layerName, map, appConfig,
    renderer, publishMessage, nls, graphics) {
    esriId.registerOAuthInfos();
    esriId.getCredential(appConfig.portalUrl +
      "/sharing", {
        oAuthPopupConfirmation: false
      }).then(lang.hitch(this, function () {
      //sign in
      var portal = new esriPortal.Portal(appConfig.portalUrl);
      portal.signIn().then(lang.hitch(this, function (portalUser) {
        //Get the token
        var token = portalUser.credential.token;
        var orgId = portalUser.orgId;
        var userName = portalUser.username;
        //check the user is not just a publisher
        if (portalUser.role === "org_user") {
          publishMessage.innerHTML = nls.createService.format(nls.userRole);
          topic.publish("setLastFocusNode", false);
          return;
        }
        var checkServiceNameUrl = appConfig.portalUrl +
          "sharing/rest/portals/" + orgId + "/isServiceNameAvailable";
        var createServiceUrl = appConfig.portalUrl +
          "sharing/content/users/" + userName + "/createService";
        this.isNameAvailable(checkServiceNameUrl, token,
          layerName).then(lang.hitch(this, function (response0) {
          if (response0.available) {
            //set the widget to busy
            topic.publish("setBusyIndicator", true);
            //create the service
            this.createFeatureService(createServiceUrl, token,
              this.getFeatureServiceParams(layerName,
                map)).then(lang.hitch(this, function (response1) {
              if (response1.success) {
                var addToDefinitionUrl = response1.serviceurl.replace(
                  new RegExp('rest', 'g'), "rest/admin") + "/addToDefinition";
                this.addDefinitionToService(addToDefinitionUrl, token,
                  this.getLayerParams(layerName, map,
                    renderer, nls)).then(lang.hitch(this,
                  function (response2) {
                    if (response2.success) {
                      //Push features to new layer
                      var newFeatureLayer =
                        new FeatureLayer(response1.serviceurl + "/0?token=" + token, {
                          id: layerName,
                          outFields: ["*"]
                        });
                      newFeatureLayer._wabProperties = {
                        itemLayerInfo: {
                          portalUrl: appConfig.portalUrl,
                          itemId: response1.itemId
                        }
                      };
                      // Add layer to map
                      map.addLayer(newFeatureLayer);

                      // must ensure the layer is loaded before we can access
                      // it to turn on the labels if required
                      var featureLayerInfo;
                      if (newFeatureLayer.loaded) {
                        featureLayerInfo =
                          jimuLayerInfos.getInstanceSync().getLayerInfoById(layerName);
                        featureLayerInfo.enablePopup();
                      } else {
                        newFeatureLayer.on("load", lang.hitch(this, function () {
                          featureLayerInfo =
                            jimuLayerInfos.getInstanceSync().getLayerInfoById(layerName);
                          featureLayerInfo.enablePopup();
                        }));
                      }

                      newFeatureLayer.applyEdits(graphics, null, null).then(
                        lang.hitch(this, function () {
                          topic.publish("clear");
                        })).otherwise(lang.hitch(this, function () {
                        topic.publish("clear");
                      }));
                      topic.publish("setBusyIndicator", false);
                      var newURL = '<br /><a role="link" tabindex="0" aria-label="' +
                        nls.successfullyPublished + '" href="' + appConfig.portalUrl +
                        "home/item.html?id=" + response1.itemId + '" target="_blank">';
                      publishMessage.innerHTML =
                        nls.successfullyPublished.format(newURL) + '</a>';
                      topic.publish("setLastFocusNode", true);
                    }
                  }), lang.hitch(this, function (err2) {
                  topic.publish("setBusyIndicator", false);
                  publishMessage.innerHTML =
                    nls.addToDefinition.format(err2.message);
                  topic.publish("setLastFocusNode", false);
                }));
              } else {
                topic.publish("setBusyIndicator", false);
                publishMessage.innerHTML =
                  nls.unableToCreate.format(layerName);
                topic.publish("setLastFocusNode", false);
              }
            }), lang.hitch(this, function (err1) {
              topic.publish("setBusyIndicator", false);
              publishMessage.innerHTML =
                nls.createService.format(err1.message);
              topic.publish("setLastFocusNode", false);
            }));
          } else {
            // Existing layer. Get layer and populate.
            portal.queryItems({
              q: "name:" + layerName + " AND owner:" + userName
            }).then(lang.hitch(this, function (items) {
              if (items.results.length > 0) {
                var selectedLayers = array.map(items.results, function (item) {
                  if (item.name === layerName) {
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
                    portalUrl: appConfig.portalUrl,
                    itemId: selectedLayers[0].id
                  }
                };

                newFeatureLayer.applyEdits(graphics, null, null).then(
                  lang.hitch(this, function () {
                    topic.publish("clear");
                  })).otherwise(lang.hitch(this, function () {
                  topic.publish("clear");
                }));

                topic.publish("setBusyIndicator", false);
                var newURL = '<br /><a role="link" tabindex="0" aria-label="' +
                  nls.successfullyAppended + '" href="' + appConfig.portalUrl +
                  "home/item.html?id=" + selectedLayers[0].id + '" target="_blank">';
                publishMessage.innerHTML =
                  nls.successfullyAppended.format(newURL) + '</a>';
                topic.publish("setLastFocusNode", true);
              }
            }), lang.hitch(this, function () {
              topic.publish("setBusyIndicator", false);
              publishMessage.innerHTML = nls.retrieveExistingLayerError.format(layerName);
              topic.publish("setLastFocusNode", false);
            }));
          }
        }), lang.hitch(this, function (err0) {
          topic.publish("setBusyIndicator", false);
          publishMessage.innerHTML = nls.checkService.format(err0.message);
          topic.publish("setLastFocusNode", false);
        }));
      }), lang.hitch(this, function (err) {
        publishMessage.innerHTML = err.message;
        topic.publish("setLastFocusNode", false);
      }));
    }));
    esriId.destroyCredentials();
  };

  portalUtil.getFeatureServiceParams = function (featureServiceName, map) {
    return {
      "name": featureServiceName,
      "serviceDescription": "",
      "hasStaticData": false,
      "maxRecordCount": 1000,
      "supportedQueryFormats": "JSON",
      "capabilities": "Create,Delete,Query,Update,Editing",
      "tags": "ThreatAnalysis",
      "description": "",
      "copyrightText": "",
      "spatialReference": {
        "wkid": 102100
      },
      "initialExtent": {
        "xmin": map.extent.xmin,
        "ymin": map.extent.ymin,
        "xmax": map.extent.xmax,
        "ymax": map.extent.ymax,
        "spatialReference": {
          "wkid": 102100
        }
      },
      "allowGeometryUpdates": true,
      "units": "esriMeters",
      "xssPreventionInfo": {
        "xssPreventionEnabled": true,
        "xssPreventionRule": "InputOnly",
        "xssInputRule": "rejectInvalid"
      }
    };
  };

  portalUtil.getLayerParams = function (layerName, map, renderer, nls) {
    return {
      "layers": [{
        "adminLayerInfo": {
          "geometryField": {
            "name": "Shape"
          },
          "xssTrustedFields": ""
        },
        "id": 0,
        "name": layerName,
        "type": "Feature Layer",
        "displayField": "",
        "description": "",
        "tags": "ThreatAnalysis",
        "copyrightText": "",
        "defaultVisibility": true,
        "ownershipBasedAccessControlForFeatures": {
          "allowOthersToQuery": false,
          "allowOthersToDelete": false,
          "allowOthersToUpdate": false
        },
        "relationships": [],
        "isDataVersioned": false,
        "supportsCalculate": true,
        "supportsAttachmentsByUploadId": true,
        "supportsRollbackOnFailureParameter": true,
        "supportsStatistics": true,
        "supportsAdvancedQueries": true,
        "supportsValidateSql": true,
        "supportsCoordinatesQuantization": true,
        "supportsApplyEditsWithGlobalIds": true,
        "advancedQueryCapabilities": {
          "supportsPagination": true,
          "supportsQueryWithDistance": true,
          "supportsReturningQueryExtent": true,
          "supportsStatistics": true,
          "supportsOrderBy": true,
          "supportsDistinct": true,
          "supportsQueryWithResultType": true,
          "supportsSqlExpression": true,
          "supportsReturningGeometryCentroid": true
        },
        "useStandardizedQueries": false,
        "geometryType": "esriGeometryPolygon",
        "minScale": 0,
        "maxScale": 0,
        "extent": map.extent,
        "drawingInfo": {
          "renderer": renderer.toJson(),
          "transparency": 0
        },
        "allowGeometryUpdates": true,
        "hasAttachments": false,
        "htmlPopupType": "esriServerHTMLPopupTypeNone",
        "hasM": false,
        "hasZ": false,
        "objectIdField": "OBJECTID",
        "globalIdField": "",
        "typeIdField": "",
        "fields": [{
            "name": "OBJECTID",
            "type": "esriFieldTypeOID",
            "actualType": "int",
            "alias": "OBJECTID",
            "sqlType": "sqlTypeOther",
            "nullable": false,
            "editable": false,
            "domain": null,
            "defaultValue": null
          },
          {
            "name": "zone_type",
            "type": "esriFieldTypeString",
            "alias": nls.zoneTypeLabel,
            "actualType": "nvarchar",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "sqlType": "sqlTypeNVarchar",
            "length": 256
          },
          {
            "name": "threat_type",
            "type": "esriFieldTypeString",
            "alias": nls.threatType,
            "actualType": "nvarchar",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "sqlType": "sqlTypeNVarchar",
            "length": 256
          },
          {
            "name": "mandatory_dist",
            "type": "esriFieldTypeDouble",
            "alias": nls.mandatoryLabel,
            "actualType": "float",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "sqlType": "sqlTypeFloat"
          },
          {
            "name": "safe_dist",
            "type": "esriFieldTypeDouble",
            "alias": nls.safeLabel,
            "actualType": "float",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "sqlType": "sqlTypeFloat"
          },
          {
            "name": "units",
            "type": "esriFieldTypeString",
            "alias": nls.unitsLabel,
            "actualType": "nvarchar",
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "sqlType": "sqlTypeNVarchar",
            "length": 256
          }
        ],
        "indexes": [],
        "types": [],
        "templates": [{
          "name": "New Feature",
          "description": "",
          "drawingTool": "esriFeatureEditToolPolygon",
          "prototype": {
            "attributes": {
              "type": ""
            }
          }
        }],
        "supportedQueryFormats": "JSON",
        "hasStaticData": false,
        "maxRecordCount": 10000,
        "standardMaxRecordCount": 4000,
        "tileMaxRecordCount": 4000,
        "maxRecordCountFactor": 1,
        "exceedsLimitFactor": 1,
        "capabilities": "Query,Editing,Create,Update,Delete"
      }]
    };
  };

  portalUtil.isNameAvailable = function (serviceName, token, featureServiceName) {
    //Check for the layer name
    var def = esriRequest({
      url: serviceName,
      content: {
        name: featureServiceName,
        type: "Feature Service",
        token: token,
        f: "json"
      },
      handleAs: "json",
      callbackParamName: "callback"
    }, {
      usePost: true
    });
    return def;
  };

  portalUtil.createFeatureService = function (serviceUrl, token, createParams) {
    //create the service
    var def = esriRequest({
      url: serviceUrl,
      content: {
        f: "json",
        token: token,
        typeKeywords: "ArcGIS Server,Data,Feature Access,Feature Service,Service,Hosted Service",
        createParameters: JSON.stringify(createParams),
        outputType: "featureService"
      },
      handleAs: "json",
      callbackParamName: "callback"
    }, {
      usePost: true
    });
    return def;
  };

  portalUtil.addDefinitionToService = function (serviceUrl, token, defParams) {
    var def = esriRequest({
      url: serviceUrl,
      content: {
        token: token,
        addToDefinition: JSON.stringify(defParams),
        f: "json"
      },
      handleAs: "json",
      callbackParamName: "callback"
    }, {
      usePost: true
    });
    return def;
  };

  return portalUtil;
});