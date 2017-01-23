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
    "miles": {
      "displayText": "Mile",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilometer",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Fot",
      "acronym": "fot"
    },
    "meters": {
      "displayText": "Meter",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Sökinställningar",
    "defaultBufferDistanceLabel": "Ange ett standardvärde för buffertavstånd",
    "maxBufferDistanceLabel": "Ange maximalt buffertavstånd",
    "bufferDistanceUnitLabel": "Enheter för buffertavstånd",
    "defaultBufferHintLabel": "Tips: Ange standardvärde för buffertreglaget",
    "maxBufferHintLabel": "Tips: Ange maxvärde för buffertreglaget",
    "bufferUnitLabel": "Tips: Ange vilken enhet som ska användas när man skapar buffertar",
    "selectGraphicLocationSymbol": "Adress- eller platssymbol",
    "graphicLocationSymbolHintText": "Tips: Symbol för adresser som användarna sökt efter eller platser som de klickat på",
    "fontColorLabel": "Välj teckensnittsfärg i sökresultaten",
    "fontColorHintText": "Tips: Teckensnittsfärg i sökresultaten",
    "zoomToSelectedFeature": "Zooma till det valda geoobjektet",
    "zoomToSelectedFeatureHintText": "Tips: Zooma till det valda geoobjektet i stället för till bufferten",
    "intersectSearchLocation": "Returnera korsande polygoner",
    "intersectSearchLocationHintText": "Tips: Returnera polygoner som innehåller den eftersökta platsen snarare än polygoner i bufferten",
    "bufferVisibilityLabel": "Ange buffertens synlighet",
    "bufferVisibilityHintText": "Tips: Bufferten kommer att visas på kartan",
    "bufferColorLabel": "Ange buffertsymbol",
    "bufferColorHintText": "Tips: Välj färg och transparens för bufferten",
    "searchLayerResultLabel": "Rita bara resultat i det valda lagret",
    "searchLayerResultHint": "Tips: Bara det valda lagret i sökresultaten ritas upp på kartan"
  },
  "layerSelector": {
    "selectLayerLabel": "Välj söklager",
    "layerSelectionHint": "Tips: Ange knappen Ange för att välja lager",
    "addLayerButton": "Ange"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Riktningsinställningar",
    "routeServiceUrl": "Ruttjänst",
    "buttonSet": "Ange",
    "routeServiceUrlHintText": "Tips: Klicka på â€˜Angeâ€™ för att leta efter och välja en ruttjänst",
    "directionLengthUnit": "Längdenheter för riktning",
    "unitsForRouteHintText": "Tips: Används för att visa enheter för rutter",
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
  "errorStrings": {
    "bufferErrorString": "Ange ett giltigt numeriskt värde.",
    "selectLayerErrorString": "Välj vilka lager du vill söka i.",
    "invalidDefaultValue": "Standardvärdet för buffertavstånd måste vara ifyllt. Ange buffertavståndet",
    "invalidMaximumValue": "Maxvärdet för buffertavstånd måste vara ifyllt. Ange buffertavståndet",
    "defaultValueLessThanMax": "Ange standardvärdet för buffertavstånd, och tänk på att det inte får överskrida maxgränsen",
    "defaultBufferValueGreaterThanZero": "Ange ett standardvärde för buffertavståndet som är större än noll",
    "maximumBufferValueGreaterThanZero": "Ange ett maxvärde för buffertavståndet som är större än noll"
  },
  "symbolPickerPreviewText": "Förhandsgranska:"
});