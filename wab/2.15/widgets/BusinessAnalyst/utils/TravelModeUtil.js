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
    "jimu/portalUtils",
    "dojo/_base/array",
    "dojo/Deferred",
    "dojo/when"
],
function (esriRequest, portalUtils, array, Deferred, when) {

    var _initDfd = null;

    return {

        getTravelMode: function(travelModeLookup, simplificationTolerance) {
            return when(this._getTravelModes(), function(result) {

                var returnVal = "";

                array.forEach(result.results, function(result) {
                    if (result.paramName === "supportedTravelModes") {
                        array.forEach(result.value.features, function(travelMode) {
                            if (travelMode.attributes && travelMode.attributes.Name === travelModeLookup)
                                returnVal = travelMode.attributes.TravelMode;
                        });
                    }
                });
                if (!returnVal)
                    return returnVal;

                simplificationTolerance = Number(simplificationTolerance);
                
                if (!simplificationTolerance || simplificationTolerance <= 10)
                    return returnVal;

                var returnValObj = JSON.parse(returnVal);
                returnValObj.simplificationTolerance = simplificationTolerance;
                return JSON.stringify(returnValObj);
            });
        },

        _getTravelModes: function () {
            if (!_initDfd) {
                _initDfd = new Deferred();

                var portal = portalUtils.getPortal(portalUrl);
                portal.loadSelfInfo().then(function (portalSelf) {
                    var routingUtilitiesUrl = portalSelf.helperServices.routingUtilities.url;

                    esriRequest({
                        url: routingUtilitiesUrl + "/GetTravelModes/execute",
                        content: {
                            appID: "webappbuilder",
                            f: "json",
                            langCode: "en-us"
                        },
                        handleAs: "json"
                    }).then(function(results) {
                        _initDfd.resolve(results);
                    });
                    
                });
            }

            return _initDfd;
        }
    };
});
