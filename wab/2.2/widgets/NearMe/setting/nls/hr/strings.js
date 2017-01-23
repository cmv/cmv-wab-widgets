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
      "displayText": "Milje",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilometri",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Stope",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Metri",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Postavke pretraživanja",
    "defaultBufferDistanceLabel": "Postavite zadanu udaljenost pojasa",
    "maxBufferDistanceLabel": "Postavi maksimalnu udaljenost pojasa",
    "bufferDistanceUnitLabel": "Jedinice veličine pojasa",
    "defaultBufferHintLabel": "Podsjetnik: postavite zadanu vrijednost za klizač pojasa",
    "maxBufferHintLabel": "Podsjetnik: postavite maksimalnu vrijednost za klizač pojasa",
    "bufferUnitLabel": "Podsjetnik: definirajte jedinicu za stvaranje pojasa",
    "selectGraphicLocationSymbol": "Simbol adrese ili lokacije",
    "graphicLocationSymbolHintText": "Podsjetnik: simbol za pretraženu adresu ili odabranu lokaciju",
    "fontColorLabel": "Odaberite boju fonta za rezultate pretraživanja",
    "fontColorHintText": "Podsjetnik: boja fonta za rezultate pretraživanja",
    "zoomToSelectedFeature": "Uvećaj odabrani geoobjekt",
    "zoomToSelectedFeatureHintText": "Podsjetnik: uvećaj odabrani geoobjekt umjesto pojasa",
    "intersectSearchLocation": "Vrati poligon(e) koji se sijeku",
    "intersectSearchLocationHintText": "Podsjetnik: vratite poligon(e) koji sadrže tražene lokacije umjesto poligone unutar pojasa",
    "bufferVisibilityLabel": "Postavi vidljivost pojasa",
    "bufferVisibilityHintText": "Podsjetnik: pojas će se prikazati na karti",
    "bufferColorLabel": "Postavi simbol pojasa",
    "bufferColorHintText": "Podsjetnik: odaberite boju i prozirnost pojasa",
    "searchLayerResultLabel": "Nacrtaj samo rezultate odabranog sloja",
    "searchLayerResultHint": "Podsjetnik: samo će se odabrani sloj u rezultatima pretraživanja nacrtati na karti"
  },
  "layerSelector": {
    "selectLayerLabel": "Odaberite sloj(eve) koji se mogu pretraživati",
    "layerSelectionHint": "Podsjetnik: upotrijebite gumb za postavljanje sloja(eva) za odabir",
    "addLayerButton": "Postavi"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Postavke uputa za vožnju",
    "routeServiceUrl": "Usluga rutiranja",
    "buttonSet": "Postavi",
    "routeServiceUrlHintText": "Podsjetnik: kliknite na â€˜Postaviâ€™ kako biste pregledavali i odabrali uslugu rutiranja",
    "directionLengthUnit": "Jedinice udaljenosti u uputama za vožnju",
    "unitsForRouteHintText": "Posjetnik: upotrebljava se za prikaz jedinica rute",
    "selectRouteSymbol": "Odaberi simbol za prikaz rute",
    "routeSymbolHintText": "Podsjetnik: upotrebljava se za prikaz linije rute",
    "routingDisabledMsg": "Da biste omogućili upute za vožnju, provjerite je li rutiranje omogućeno u ArcGIS Onlineu."
  },
  "networkServiceChooser": {
    "arcgislabel": "Dodaj iz ArcGIS Online",
    "serviceURLabel": "Dodaj URL usluge",
    "routeURL": "URL rute",
    "validateRouteURL": "Provjera",
    "exampleText": "Primjer",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Odredite važeću uslugu rutiranja.",
    "rateLimitExceeded": "Premašeno ograničenje ocjenjivanja. Pokušajte ponovno kasnije.",
    "errorInvokingService": "Korisničko ime ili lozinka nije ispravna."
  },
  "errorStrings": {
    "bufferErrorString": "Unesite valjanu brojčanu vrijednost.",
    "selectLayerErrorString": "Odaberite sloj(eve) za pretraživanje.",
    "invalidDefaultValue": "Zadana veličina pojasa ne može biti prazna. Odredite veličinu pojasa",
    "invalidMaximumValue": "Maksimalna veličina pojasa ne može biti prazna. Odredite veličinu pojasa",
    "defaultValueLessThanMax": "Odredite zadanu veličinu pojasa unutar maksimalnog ograničenja",
    "defaultBufferValueGreaterThanZero": "Odredite zadanu veličinu pojasa veću od 0",
    "maximumBufferValueGreaterThanZero": "Odredite maksimalnu veličinu pojasa veću od 0"
  },
  "symbolPickerPreviewText": "Pretpregled:"
});