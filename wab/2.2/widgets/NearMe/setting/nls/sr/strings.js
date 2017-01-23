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
    "searchSettingTabTitle": "Postavke pretrage",
    "defaultBufferDistanceLabel": "Postavi podrazumevano rastojanje zone bliskosti",
    "maxBufferDistanceLabel": "Postavi maksimalno rastojanje zone bliskosti",
    "bufferDistanceUnitLabel": "Jedinice rastojanja zone bliskosti",
    "defaultBufferHintLabel": "Napomena: postavite podrazumevanu vrednost za klizač zone bliskosti",
    "maxBufferHintLabel": "Napomena: postavite maksimalnu vrednost za klizač zone bliskosti",
    "bufferUnitLabel": "Napomena: definišite jedinicu za kreiranje zone bliskosti",
    "selectGraphicLocationSymbol": "Simbol adresa ili lokacije",
    "graphicLocationSymbolHintText": "Napomena: Simbol za traženu adresu ili lokaciju na koju je kliknuto",
    "fontColorLabel": "Izaberite boju fonta za rezultate pretrage",
    "fontColorHintText": "Napomena: boja fonta za rezultate pretrage",
    "zoomToSelectedFeature": "Zumiraj do izabranog geooobjekta",
    "zoomToSelectedFeatureHintText": "Napomena: zumirajte do izabranog geoobjekta umesto zone bliskosti",
    "intersectSearchLocation": "Vrati poligon(e) koji se seku",
    "intersectSearchLocationHintText": "Napomena: vratite poligon(e) koji sadrži(e) traženu lokaciju, pre poligona u okviru zone bliskosti",
    "bufferVisibilityLabel": "Podesi vidljivost zone bliskosti",
    "bufferVisibilityHintText": "Napomena: zona bliskosti će biti prikazana na mapi",
    "bufferColorLabel": "Podesi simbol zone bliskosti",
    "bufferColorHintText": "Napomena: izaberite boju i prozirnost zone bliskosti",
    "searchLayerResultLabel": "Nacrtaj samo rezultate izabranog sloja",
    "searchLayerResultHint": "Napomena: samo izabrani sloj u rezultatima pretrage će se iscrtati na mapi"
  },
  "layerSelector": {
    "selectLayerLabel": "Izaberite sloj(eve) pretrage",
    "layerSelectionHint": "Napomena: koristite dugme postavke da biste izabrali sloj(eve)",
    "addLayerButton": "Postavi"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Postavke smernica",
    "routeServiceUrl": "Servis za rutiranje",
    "buttonSet": "Postavi",
    "routeServiceUrlHintText": "Napomena: kliknite na â€˜Postaviâ€™ da biste potražili i izabrali servis za rutiranje",
    "directionLengthUnit": "Jedinice dužine pravca",
    "unitsForRouteHintText": "Napomena: koristi se za prikazivanje jedinica za rutiranje",
    "selectRouteSymbol": "Izaberite simbol za prikaz rute",
    "routeSymbolHintText": "Napomena: koristi se za prikaz simbola linije rute",
    "routingDisabledMsg": "Da biste omogućili uputstva za navigaciju postarajte se da je rutiranje omogućeno u stavci ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Dodaj iz ArcGIS Online",
    "serviceURLabel": "Dodaj URL adresu servisa",
    "routeURL": "URL adresa rutiranja",
    "validateRouteURL": "Proveri valjanost",
    "exampleText": "Primer",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Navedite važeći servis za rutiranje.",
    "rateLimitExceeded": "Prekoračeno je ograničenje stope. Pokušajte ponovo kasnije.",
    "errorInvokingService": "Korisničko ime ili lozinka su nevažeći."
  },
  "errorStrings": {
    "bufferErrorString": "Unesite važeću numeričku vrednost.",
    "selectLayerErrorString": "Izaberite sloj(eve) za pretragu.",
    "invalidDefaultValue": "Podrazumevano rastojanje zone bliskosti ne može da bude prazno. Navedite rastojanje zone bliskosti",
    "invalidMaximumValue": "Maksimalno rstojanje zone bliskosti ne može da bude prazno. Navedite rastojanje zone bliskosti",
    "defaultValueLessThanMax": "Navedite podrazumevano rastojanje zone bliskosti unutar maksimalnog ograničenja",
    "defaultBufferValueGreaterThanZero": "Navedite podrazumevano rastojanje zone bliskosti veće od 0",
    "maximumBufferValueGreaterThanZero": "Navedite maksimalno rastojanje zone bliskosti veće od 0"
  },
  "symbolPickerPreviewText": "Pregledaj:"
});