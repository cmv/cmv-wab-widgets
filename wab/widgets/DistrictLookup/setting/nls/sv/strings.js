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
    "miles": "Mile",
    "kilometers": "Kilometer",
    "feet": "Fot",
    "meters": "Meter"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Sökinställningar",
    "buttonSet": "Ange",
    "selectLayersLabel": "Välj lager",
    "selectLayersHintText": "Tips: Används för att markera polygonlager och tillhörande punktlager.",
    "selectPrecinctSymbolLabel": "Välj symbol för att markera polygon",
    "selectGraphicLocationSymbol": "Adress- eller platssymbol",
    "graphicLocationSymbolHintText": "Tips: Symbol för adresser som användarna sökt efter eller platser som de klickat på",
    "precinctSymbolHintText": "Tips: Används för att visa symbolen för en markerad polygon",
    "selectColorForPoint": "Välj färg för att markera punkt",
    "selectColorForPointHintText": "Tips: Används för att visa markeringsfärg för en vald punkt"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Välj polygonlager",
    "selectPolygonLayerHintText": "Tips: Används för att markera polygonlager.",
    "selectRelatedPointLayerLabel": "Markera punktlager som är kopplade till polygonlager",
    "selectRelatedPointLayerHintText": "Tips: Används för att markera punktlager som är kopplade till polygonlager",
    "polygonLayerNotHavingRelatedLayer": "Välj ett polygonlager som har ett tillhörande punktlager.",
    "errorInSelectingPolygonLayer": "Välj ett polygonlager som har ett tillhörande punktlager.",
    "errorInSelectingRelatedLayer": "Markera punktlager som är kopplade till polygonlager."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Riktningsinställningar",
    "routeServiceUrl": "Ruttjänst",
    "buttonSet": "Ange",
    "routeServiceUrlHintText": "Tips: Klicka på Ange för att leta efter och markera en ruttjänst för nätverksanalys",
    "directionLengthUnit": "Längdenheter för riktning",
    "unitsForRouteHintText": "Tips: Används för att visa rapporterade enheter för rutter",
    "selectRouteSymbol": "Välj symbol för visning av rutten",
    "routeSymbolHintText": "Tips: Visade tidigare en linjesymbol för rutten",
    "routingDisabledMsg": "Om du vill använda rutter och vägbeskrivningar måste du kontrollera att det har aktiverats i objektet ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Lägg till från ArcGIS Online",
    "serviceURLabel": "Lägg till tjänst-URL",
    "routeURL": "Rutt-URL",
    "validateRouteURL": "Validera",
    "exampleText": "Exempel",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Ange en giltig ruttjänst.",
    "rateLimitExceeded": "Hastighetsbegränsningen överskreds. Försök igen senare.",
    "errorInvokingService": "Användarnamn eller lösenord är felaktigt."
  },
  "symbolPickerPreviewText": "Förhandsgranska:"
});