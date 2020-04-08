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
    "esri/request",
    "jimu/portalUtils"
], function (
    esriRequest,
    portalUtils
) {

    var DEFAULT_GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

    return {
        reverseGeocode: function(pointOrPolygon) {

            // Get geocoder URL
            var portal = portalUtils.getPortal(portalUrl);
            return portal.loadSelfInfo().then(function(portalSelf){
                // For ArcGIS Online, use world geocoder. For portal, use first configured geocoder if specified, else use default ArcGIS online geocoder
                var geocoderUrl = portalSelf && portalSelf.isPortal && portalSelf.helperServices && portalSelf.helperServices.geocode && portalSelf.helperServices.geocode.length > 0 ? portalSelf.helperServices.geocode[0].url : DEFAULT_GEOCODE_URL;

                return esriRequest({
                    url: geocoderUrl + "/reverseGeocode",
                    content: {
                        appID: "webappbuilder",
                        f: "json",
                        langCode: "en-us",
                        location: JSON.stringify({x: pointOrPolygon.x, y: pointOrPolygon.y}),
                        distance: 250
                    },
                    handleAs: "json"
                });
            });
        }
    };
});
