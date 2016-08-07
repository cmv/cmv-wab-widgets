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
      "displayText": "Mylios",
      "acronym": "myl."
    },
    "kilometers": {
      "displayText": "Kilometrai",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Pėdos",
      "acronym": "pėdos"
    },
    "meters": {
      "displayText": "Metrai",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Paieškos nuostatos",
    "defaultBufferDistanceLabel": "Nustatyti numatytąją buferio atstumo reikšmę",
    "maxBufferDistanceLabel": "Nustatyti maksimalią buferio atstumo reikšmę",
    "bufferDistanceUnitLabel": "Buferio atstumo vienetai",
    "defaultBufferHintLabel": "Užuomina: nustatykite buferio slankiklio numatytąją reikšmę",
    "maxBufferHintLabel": "Užuomina: nustatykite buferio slankiklio maksimalią reikšmę",
    "bufferUnitLabel": "Patarimas: nustatykite buferio kūrimo vienetą",
    "selectGraphicLocationSymbol": "Adreso arba vietos simbolis",
    "graphicLocationSymbolHintText": "Patarimas: ieškoto adreso arba spustelėtos vietos simbolis",
    "fontColorLabel": "Pasirinkti paieškos rezultatų šrifto spalvą",
    "fontColorHintText": "Patarimas: paieškos rezultatų šrifto spalva",
    "zoomToSelectedFeature": "Priartinti pasirinktą elementą",
    "zoomToSelectedFeatureHintText": "Užuomina: priartinkite prie pasirinkto elemento, o ne buferio",
    "intersectSearchLocation": "Grąžinti susikertančius plotus",
    "intersectSearchLocationHintText": "Užuomina: grąžina plotus, kuriuose yra ieškoma vieta, o ne plotus, esančius buferyje",
    "bufferVisibilityLabel": "Nustayti buferio matomumą",
    "bufferVisibilityHintText": "Užuomina: buferis bus rodomas žemėlapyje",
    "bufferColorLabel": "Nustatyti buferio simbolį",
    "bufferColorHintText": "Užuomina: pasirinkite buferio spalvą ir skaidrumą",
    "searchLayerResultLabel": "Nubrėžti tik pasirinkto sluoksnio rezultatus",
    "searchLayerResultHint": "Užuomina: žemėlapyje bus vaizduojami tik pasirinkto sluoksnio paieškos rezultatai"
  },
  "layerSelector": {
    "selectLayerLabel": "Pasirinkti paieškos sluoksnį (-ius)",
    "layerSelectionHint": "Patarimas: sluoksniui (-iams) pasirinkti naudokite nustatymo mygtuką",
    "addLayerButton": "Grupė"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Krypčių nustatymai",
    "routeServiceUrl": "Maršruto paslauga",
    "buttonSet": "Grupė",
    "routeServiceUrlHintText": "Užuomina: norėdami rasti ir pasirinkti maršrutų paslaugą, spustelėkite Nustatyti",
    "directionLengthUnit": "Krypties ilgio vienetai",
    "unitsForRouteHintText": "Patarimas: naudojama maršruto vienetams rodyti",
    "selectRouteSymbol": "Pasirinkti maršruto rodymo simbolį",
    "routeSymbolHintText": "Patarimas: naudojamas maršruto linijos simboliui rodyti",
    "routingDisabledMsg": "Jei norite įjungti nuorodas, įsitikinkite, kad maršrutas įjungtas ArcGIS Online elemente."
  },
  "networkServiceChooser": {
    "arcgislabel": "Pridėti iš ArcGIS Online",
    "serviceURLabel": "Pridėti paslaugos URL",
    "routeURL": "Maršruto URL",
    "validateRouteURL": "Tikrinti",
    "exampleText": "Pavyzdys",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Nurodykite galiojančią maršruto paslaugą.",
    "rateLimitExceeded": "Viršytas apribojimo limitas. Pabandykite dar kartą vėliau.",
    "errorInvokingService": "Vartotojo vardas arba slaptažodis neteisingas."
  },
  "errorStrings": {
    "bufferErrorString": "Įveskite leistiną skaitinę reikšmę.",
    "selectLayerErrorString": "Pasirinkite ieškos sluoksnį (-ius)",
    "invalidDefaultValue": "Numatytasis buferio atstumas negali būti tuščias. Nurodykite buferio atstumą",
    "invalidMaximumValue": "Maksimalus buferio atstumas negali būti tuščias. Nurodykite buferio atstumą",
    "defaultValueLessThanMax": "Nurodykite numatytąjį buferio atstumą maksimaliose ribose",
    "defaultBufferValueGreaterThanZero": "Nurodykite numatytąjį buferio atstumą didesnį už 0",
    "maximumBufferValueGreaterThanZero": "Nurodykite maksimalų buferio atstumą didesnį už 0"
  },
  "symbolPickerPreviewText": "Peržiūra:"
});