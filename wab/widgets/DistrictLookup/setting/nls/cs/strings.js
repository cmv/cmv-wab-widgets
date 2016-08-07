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
    "miles": "Míle",
    "kilometers": "Kilometry",
    "feet": "Stopy",
    "meters": "Metry"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Prohledat nastavení",
    "buttonSet": "Nastavit",
    "selectLayersLabel": "Vybrat vrstvu",
    "selectLayersHintText": "Rada: Slouží k výběru polygonové vrstvy a přidružené bodové vrstvy.",
    "selectPrecinctSymbolLabel": "Vyberte symbol pro zvýraznění polygonu.",
    "selectGraphicLocationSymbol": "Symbol adresy nebo umístění",
    "graphicLocationSymbolHintText": "Rada: Symbol vyhledávané adresy nebo umístění určeného kliknutím.",
    "precinctSymbolHintText": "Rada: Slouží k zobrazení symbolu pro zvolený polygon.",
    "selectColorForPoint": "Vyberte barvu pro zvýraznění bodu",
    "selectColorForPointHintText": "Rada: Slouží k zobrazení barvy zvýraznění zvoleného bodu."
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Vyberte polygonovou vrstvu",
    "selectPolygonLayerHintText": "Rada: Slouží k výběru polygonové vrstvy.",
    "selectRelatedPointLayerLabel": "Vyberte bodovou vrstvu přidruženou k polygonové vrstvě.",
    "selectRelatedPointLayerHintText": "Rada: Slouží k výběru bodové vrstvy přidružené k polygonové vrstvě.",
    "polygonLayerNotHavingRelatedLayer": "Vyberte polygonovou vrstvu, která má přidruženou bodovou vrstvu.",
    "errorInSelectingPolygonLayer": "Vyberte polygonovou vrstvu, která má přidruženou bodovou vrstvu.",
    "errorInSelectingRelatedLayer": "Vyberte bodovou vrstvu přidruženou k polygonové vrstvě."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Nastavení trasování",
    "routeServiceUrl": "Služba trasování",
    "buttonSet": "Nastavit",
    "routeServiceUrlHintText": "Rada: Klikněte na tlačítko Nastavit a zvolte službu trasování síťové analýzy.",
    "directionLengthUnit": "Jednotky délky směru",
    "unitsForRouteHintText": "Rada: Slouží k zobrazení hlášených jednotek trasy.",
    "selectRouteSymbol": "Vyberte symbol k zobrazení trasy.",
    "routeSymbolHintText": "Rada: Slouží k zobrazení liniového symbolu trasy.",
    "routingDisabledMsg": "Aby bylo možné používat navigaci, ujistěte se, že je v položce ArcGIS Online povoleno trasování."
  },
  "networkServiceChooser": {
    "arcgislabel": "Přidat z ArcGIS Online",
    "serviceURLabel": "Přidat URL služby",
    "routeURL": "URL trasy",
    "validateRouteURL": "Ověřit",
    "exampleText": "Příklad",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Zadejte platnou službu způsobu trasování.",
    "rateLimitExceeded": "Byl překročen limit přenosové rychlosti. Zkuste to prosím znovu.",
    "errorInvokingService": "Uživatelské jméno nebo heslo je nesprávné."
  },
  "symbolPickerPreviewText": "Náhled:"
});