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
      "displayText": "Míle",
      "acronym": "míle"
    },
    "kilometers": {
      "displayText": "Kilometry",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Stopy",
      "acronym": "stop"
    },
    "meters": {
      "displayText": "Metry",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Prohledat nastavení",
    "defaultBufferDistanceLabel": "Nastavte výchozí šířku obalové zóny",
    "maxBufferDistanceLabel": "Nastavte maximální šířku obalové zóny",
    "bufferDistanceUnitLabel": "Jednotky šířky obalové zóny.",
    "defaultBufferHintLabel": "Rada: Umožňuje nastavit výchozí hodnotu posuvníku šířky obalové zóny.",
    "maxBufferHintLabel": "Rada: Umožňuje nastavit maximální hodnotu posuvníku šířky obalové zóny.",
    "bufferUnitLabel": "Rada: Definujte jednotku pro vytvoření obalové zóny.",
    "selectGraphicLocationSymbol": "Symbol adresy nebo umístění",
    "graphicLocationSymbolHintText": "Rada: Symbol vyhledávané adresy nebo umístění určeného kliknutím.",
    "fontColorLabel": "Vyberte barvu písma pro výsledky vyhledávání.",
    "fontColorHintText": "Rada: Barva písma výsledků vyhledávání.",
    "zoomToSelectedFeature": "Přiblížit zobrazení na vybraný prvek",
    "zoomToSelectedFeatureHintText": "Rada: Umožňuje přiblížit na zvolený prvek namísto obalové zóny.",
    "intersectSearchLocation": "Vrátit protínající se polygony",
    "intersectSearchLocationHintText": "Rada: Slouží k vrácení polygonů, které obsahují vyhledávané umístění, namísto polygonů v obalové zóně.",
    "bufferVisibilityLabel": "Nastavit viditelnost obalové zóny",
    "bufferVisibilityHintText": "Rada: Obalová zóna se zobrazí na mapě.",
    "bufferColorLabel": "Nastavit symbol obalové zóny",
    "bufferColorHintText": "Rada: Vyberte barvu a průhlednost obalové zóny.",
    "searchLayerResultLabel": "Vykreslovat pouze výsledky vybrané vrstvy",
    "searchLayerResultHint": "Rada: V mapě se vykreslí pouze vrstva vybraná ve výsledcích vyhledávání."
  },
  "layerSelector": {
    "selectLayerLabel": "Vyberte vrstvy pro vyhledávání",
    "layerSelectionHint": "Rada: Použijte tlačítko výběru ke zvolení vrstev.",
    "addLayerButton": "Nastavit"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Nastavení trasování",
    "routeServiceUrl": "Služba trasování",
    "buttonSet": "Nastavit",
    "routeServiceUrlHintText": "Rada: Klikněte na tlačítko Nastavit a zvolte službu trasování.",
    "directionLengthUnit": "Jednotky délky směru",
    "unitsForRouteHintText": "Rada: Slouží k zobrazení jednotek trasy.",
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
  "errorStrings": {
    "bufferErrorString": "Zadejte platnou číselnou hodnotu.",
    "selectLayerErrorString": "Vyberte vrstvy pro vyhledávání.",
    "invalidDefaultValue": "Výchozí šířka obalové zóny nemůže být prázdná. Zadejte šířku obalové zóny.",
    "invalidMaximumValue": "Maximální šířka obalové zóny nemůže být prázdná. Zadejte šířku obalové zóny.",
    "defaultValueLessThanMax": "Zadejte výchozí šířku obalové zóny v rámci maximálního omezení.",
    "defaultBufferValueGreaterThanZero": "Zadejte výchozí šířku obalové zóny větší než 0.",
    "maximumBufferValueGreaterThanZero": "Zadejte maximální šířku obalové zóny větší než 0."
  },
  "symbolPickerPreviewText": "Náhled:"
});