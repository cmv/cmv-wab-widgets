/*global define*/
///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 Esri. All Rights Reserved.
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
define({
  "units": {
    "miles": "Miili",
    "kilometers": "Kilomeetrit",
    "feet": "Jalga",
    "meters": "Meetrit"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Otsingu seaded",
    "buttonSet": "Määra",
    "selectLayersLabel": "Vali kiht",
    "selectLayersHintText": "Vihje: kasutatakse polügoonikihi ja sellega seotud punktikihi valimiseks.",
    "selectPrecinctSymbolLabel": "Vali polügooni esiletõstmiseks sümbol",
    "selectGraphicLocationSymbol": "Aadressi või asukoha sümbol",
    "graphicLocationSymbolHintText": "Vihje: otsitud aadressi või klõpsatud asukoha sümbol",
    "precinctSymbolHintText": "Vihje: kasutatakse valitud polügooni sümboli kuvamiseks",
    "selectColorForPoint": "Vali värv punktobjekti esiletõstmiseks",
    "selectColorForPointHintText": "Vihje: kasutatakse valitud punktobjekti esiletõstmise värvi kuvamiseks"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Vali polügoonikiht",
    "selectPolygonLayerHintText": "Vihje: kasutatakse polügoonikihi valimiseks.",
    "selectRelatedPointLayerLabel": "Vali polügoonikihiga seotud punktikiht",
    "selectRelatedPointLayerHintText": "Vihje: kasutatakse polügoonikihiga seotud punktikihi valimiseks",
    "polygonLayerNotHavingRelatedLayer": "Valige polügoonikiht, millega on seotud punktikiht.",
    "errorInSelectingPolygonLayer": "Valige polügoonikiht, millega on seotud punktikiht.",
    "errorInSelectingRelatedLayer": "Valige polügoonikihiga seotud punktikiht."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Teejuhiste seaded",
    "routeServiceUrl": "Marsruutimisteenus",
    "buttonSet": "Määra",
    "routeServiceUrlHintText": "Vihje: võrguanalüüsi marsruutimisteenuse sirvimiseks ja valimiseks klõpsake nuppu ‘Määra’",
    "directionLengthUnit": "Teejuhise pikkusühikud",
    "unitsForRouteHintText": "Vihje: kasutatakse marsruudi ühikute kuvamiseks",
    "selectRouteSymbol": "Vali marsruudi kuvamiseks sümbol",
    "routeSymbolHintText": "Vihje: kasutatakse marsruudi joonsümboli kuvamiseks",
    "routingDisabledMsg": "Enne teejuhiste lubamist veenduge, et marsruutimine on ArcGIS Online'i üksuses lubatud."
  },
  "networkServiceChooser": {
    "arcgislabel": "Lisa ArcGIS Online’ist",
    "serviceURLabel": "Lisa teenuse URL",
    "routeURL": "Marsruudi URL",
    "validateRouteURL": "Valideeri",
    "exampleText": "Näide",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Määrake sobiv marsruuditeenus.",
    "rateLimitExceeded": "Liikluse piirmäär on ületatud. Proovige hiljem uuesti.",
    "errorInvokingService": "Kasutajanimi või parool on vale."
  },
  "symbolPickerPreviewText": "Eelvaade:"
});