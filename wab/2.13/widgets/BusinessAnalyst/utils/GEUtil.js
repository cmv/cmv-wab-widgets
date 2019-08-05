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
define(["dojo/_base/array",
    "esri/request",
    "esri/dijit/geoenrichment/utils/FileUtil",
    "jimu/portalUtils"
],
    function (array, esriRequest, FileUtil, portalUtils) {

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
                            useData: JSON.stringify({ "sourceCountry": params.sourceCountry }),
                            studyAreasOptions: JSON.stringify(params.studyAreasOptions),
                            dataCollections: JSON.stringify(["GlobalIntersect"]),
                            returnGeometry: true,
                            outSR: JSON.stringify({ "wkid": 102100 }),
                            studyAreas: JSON.stringify([{ "geometry": params.geometry }]),
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
                    useData: JSON.stringify({ "sourceCountry": params.sourceCountry }),
                    studyAreas: JSON.stringify(params.studyAreas),
                    reportFields: JSON.stringify({ "locationname": params.locationName, "latitude": params.lat, "longitude": params.long, "subtitle": "Prepared by Esri", "areadesc2": params.areadesc2 }) // TODO:
                }

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
                        return FileUtil.saveAs(result, params.reportDownloadName);
                    }).otherwise(function (error) {
                        // TODO: Handle error
                        alert("Error: " + error)
                    });

                });

            },

            hasGEPrivilege: function() {
                var portal = portalUtils.getPortal(portalUrl);
                return portal.loadSelfInfo().then(function (portalSelf) {
                    var gePrivilege = false,
                        networkAnalysisPrivilege = false,
                        privileges = portalSelf && portalSelf.user && portalSelf.user.privileges;

                    array.forEach(privileges, function(privilege) {
                        if (privilege == "premium:user:geoenrichment") 
                            gePrivilege = true;
                        else if (privilege == "premium:user:networkanalysis")
                            networkAnalysisPrivilege = true;
                    });

                    return gePrivilege && networkAnalysisPrivilege;
                });
            }

        }
    });
