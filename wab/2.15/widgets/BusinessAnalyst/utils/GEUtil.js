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
    "dojo/_base/array",
    "dojo/when",
    "esri/request",
    "./GeocodeUtil",
    "esri/geometry/webMercatorUtils",
    "esri/dijit/geoenrichment/utils/FileUtil",
    "jimu/portalUtils"
],
function (array, when, esriRequest, GeocodeUtil, webMercatorUtils, FileUtil, portalUtils) {

    var DEFAULT_GE_URL = "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver";

    return {

        getAvailableCountries: function () {
            // Get GE URL
            var portal = portalUtils.getPortal(portalUrl);
            return portal.loadSelfInfo().then(function (portalSelf) {
                // Use GE Url if specified, else use default ArcGIS online GE url
                var geUrl = portalSelf && portalSelf.helperServices && portalSelf.helperServices.geoenrichment && portalSelf.helperServices.geoenrichment.url ? portalSelf.helperServices.geoenrichment.url : DEFAULT_GE_URL;

                return esriRequest({
                    url: geUrl + "/Geoenrichment/Countries",
                    content: {
                        appID: "webappbuilder",
                        f: "json",
                        langCode: "en-us"
                    },
                    handleAs: "json"
                });
            });
        },

        /* Params
        geometry: geometry of location to create a ring/drive time around
        studyAreasOptions: Study Areas Options
        */
        createRingOrDriveTimes: function (params) {

            // Get GE URL
            var portal = portalUtils.getPortal(portalUrl);
            return portal.loadSelfInfo().then(function (portalSelf) {
                // Use GE Url if specified, else use default ArcGIS online GE url
                var geUrl = portalSelf && portalSelf.helperServices && portalSelf.helperServices.geoenrichment && portalSelf.helperServices.geoenrichment.url ? portalSelf.helperServices.geoenrichment.url : DEFAULT_GE_URL;

                return esriRequest({
                    url: geUrl + "/Geoenrichment/Enrich",
                    content: {
                        appID: "webappbuilder",
                        f: "json",
                        langCode: "en-us",
                        useData: JSON.stringify({ sourceCountry: params.sourceCountry }),
                        studyAreasOptions: JSON.stringify(params.studyAreasOptions),
                        dataCollections: JSON.stringify(["GlobalIntersect"]),
                        returnGeometry: true,
                        outSR: JSON.stringify({ wkid: 102100 }),
                        studyAreas: JSON.stringify([{ geometry: params.geometry }]),
                        token: esri.id.credentials[0].token
                    },
                    handleAs: "json"
                });
            });

        },

        // Params:
        //   report: ID of report to be run, or {itemid: id, url: www.arcgis.com, token} if custom report 
        //   studyAreas: studyAreas to be passed in
        //   locationName: Location name of area report is being run on
        //   lat: Latitude of area report is being run on
        //   long: Longitude of area report is being run on
        //   sourceCountry: countryID of country where report is to be run
        createReport: function (params) {
            var sendParams = {
                appID: "webappbuilder",
                langCode: "en-us",
                report: typeof params.report === "string" ? params.report : JSON.stringify(params.report),
                format: "pdf",
                f: "bin",
                token: esri.id.credentials[0].token,
                useData: JSON.stringify({ sourceCountry: params.sourceCountry }),
                studyAreas: JSON.stringify(params.studyAreas),
                reportFields: JSON.stringify({ locationname: params.locationName, latitude: params.lat, longitude: params.long, subtitle: "Prepared by Esri", areadesc2: params.areadesc2 }) // TODO:
            };

            // Get GE URL
            var portal = portalUtils.getPortal(portalUrl);
            return portal.loadSelfInfo().then(function (portalSelf) {
                // Use GE Url if specified, else use default ArcGIS online GE url
                var geUrl = portalSelf && portalSelf.helperServices && portalSelf.helperServices.geoenrichment && portalSelf.helperServices.geoenrichment.url ? portalSelf.helperServices.geoenrichment.url : DEFAULT_GE_URL;

                return esriRequest({
                    url: geUrl + "/Geoenrichment/createReport",
                    content: sendParams,
                    handleAs: "blob"
                }).then(function (result) {
                    return FileUtil.saveAs(result, params.reportDownloadName + ".pdf"); // TODO: If we ever add excel support, we need to change this
                }).otherwise(function (error) {
                    // TODO: Handle error
                    alert("Error: " + error);
                });

            });

        },

        checkCapabilities: function (appConfig) {
            // Bypass check if GE Url is configured as a proxy URL in the appConfig
            
            var portal = portalUtils.getPortal(portalUrl);
            return portal.loadSelfInfo().then(function (portalSelf) {
                var gePrivilege = false,
                    networkAnalysisPrivilege = false,
                    privileges = portalSelf && portalSelf.user && portalSelf.user.privileges,

                    helperServices = portalSelf && portalSelf.helperServices,
                    geConfiguredUrl = helperServices.geoenrichment && helperServices.geoenrichment.url,
                    routingUtilitiesUrl = helperServices.routingUtilities && helperServices.routingUtilities.url;

                // Bypass check if GE Url is configured as a proxy URL in the appConfig
                var geUrl = geConfiguredUrl ? geConfiguredUrl : DEFAULT_GE_URL;
                if (
                    !window.isBuilder &&
                    !appConfig.mode &&
                    appConfig.appProxies &&
                    appConfig.appProxies.length > 0 &&
                    array.some(appConfig.appProxies, function (proxyItem) {
                        return geUrl.toLowerCase() === proxyItem.sourceUrl.toLowerCase();
                    })
                ) {
                    gePrivilege = true;
                    networkAnalysisPrivilege = true;
                } else {
                    array.forEach(privileges, function (privilege) {
                        if (privilege === "premium:user:geoenrichment") {
                            gePrivilege = true;
                        } else if (privilege === "premium:user:networkanalysis") {
                            networkAnalysisPrivilege = true;
                        }
                    });
                }

                return {
                    hasPrivilege: gePrivilege && networkAnalysisPrivilege,
                    geServiceConfigured: !!geConfiguredUrl,
                    dirRoutingServiceConfigured: !!routingUtilitiesUrl
                };
            });
        },

        getCountryForPolygon: function (polygonGeometry, config, currentlySelectedCountryID) {

            // Get GE URL
            var portal = portalUtils.getPortal(portalUrl);
            return portal.loadSelfInfo().then(function (portalSelf) {
                // Use GE Url if specified, else use default ArcGIS online GE url
                var geUrl = portalSelf && portalSelf.helperServices && portalSelf.helperServices.geoenrichment && portalSelf.helperServices.geoenrichment.url ? portalSelf.helperServices.geoenrichment.url : DEFAULT_GE_URL;

                return esriRequest({
                    url: geUrl + "/Geoenrichment/Enrich",
                    content: {
                        appID: "webappbuilder",
                        f: "json",
                        langCode: "en-us",
                        dataCollections: JSON.stringify(["GlobalIntersect"]),
                        outSR: JSON.stringify({ wkid: 102100 }),
                        studyAreas: JSON.stringify([{ geometry: polygonGeometry.toJson() }]),
                        token: esri.id.credentials[0].token
                    },
                    handleAs: "json"
                }).then(function (response) {
                    // If only 1 country, use that country
                    // If more than 1 country, do a reverse geocode with centroid of polygon to get country, if that results in no country
                    // then leave currently selected country (if it was in original list), else default to default app config country, else 1st country in original list

                    if (
                        response && response.results && response.results.length === 1 &&
                        response.results[0].value.FeatureSet[0].features.length === 1
                    ) {
                        return response.results[0].value.FeatureSet[0].features[0].attributes.sourceCountry;
                    }
                    else if (
                        response && response.results && response.results.length === 1 &&
                        response.results[0].value.FeatureSet[0].features.length > 1
                    ) {
                        // Reverse Geocode the centroid to get which country the polygon is in
                        var centroid = polygonGeometry.getCentroid();
                        var longLat = webMercatorUtils.xyToLngLat(centroid.x, centroid.y);

                        var handleInalidReverseGeocode = function(globalIntersectFeatures) {
                            var returnCountryId = "";

                            // If centroid is empty, use currently selected country, or defaultCountryID if in list of original global intersect results, else return first country
                            array.forEach(globalIntersectFeatures, function(feature) {
                                if (feature.attributes.sourceCountry == currentlySelectedCountryID)
                                    returnCountryId = currentlySelectedCountryID;
                            });

                            if (returnCountryId) {
                                return returnCountryId;
                            } else {
                                array.forEach(globalIntersectFeatures, function(feature) {
                                    if (feature.attributes.sourceCountry == config.defaultCountryID)
                                        returnCountryId = defaultCountryID;       
                                }); 
                            }

                            // If we don't have a match with the currently selected country OR the default country ID, then use the
                            // first result returned.  This is alphabetically returned from GE.
                            return returnCountryId ? returnCountryId : globalIntersectFeatures[0].attributes.sourceCountry
                        };

                        return when(GeocodeUtil.reverseGeocode({ x: longLat[0], y: longLat[1] })).then(function (result) {
                            if (result && result.address && result.address.CountryCode) {
                                return result.address.CountryCode;
                            }

                            return handleInalidReverseGeocode(response.results[0].value.FeatureSet[0].features);
                        }).otherwise(function() {
                            
                            // An error is returned if we can't geocode, or the centroid is not over a country
                            return handleInalidReverseGeocode(response.results[0].value.FeatureSet[0].features);
                        });
                    }
                    else {
                        // Return default country ID from config if no results are returned.  Allows for custom reports to still be
                        // used in international waters
                        return config.defaultCountryID;
                    }
                });
            });

        },

        // Returns the configured Proxy URL for Geoenrichment, only if configured, else false is returned
        getGEProxyUrl: function(appConfig) {
            var portal = portalUtils.getPortal(portalUrl);
            var proxyUrl = false;
            return portal.loadSelfInfo().then(function (portalSelf) {
                    geUrl = portalSelf && portalSelf.helperServices && portalSelf.helperServices.geoenrichment && portalSelf.helperServices.geoenrichment.url ? portalSelf.helperServices.geoenrichment.url : DEFAULT_GE_URL;

                    if (!window.isBuilder && !appConfig.mode &&
                        appConfig.appProxies && appConfig.appProxies.length > 0) {
                        array.forEach(appConfig.appProxies, function (proxyItem) {
                            if (geUrl.toLowerCase() === proxyItem.sourceUrl.toLowerCase()) {
                                proxyUrl = proxyItem.proxyUrl;
                            }
                        });
                    }

                return proxyUrl;
            });
        }

    };
});
