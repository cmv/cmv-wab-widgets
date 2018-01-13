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
      "displayText": "Čevlji",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Metri",
      "acronym": "m"
    }
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Nastavitve vira iskanja",
    "searchSourceSettingTitle": "Nastavitve vira iskanja",
    "searchSourceSettingTitleHintText": "Dodaj in konfiguriraj geokodirne storitve ali geoobjektne sloje kot vire iskanja. Ti viri določajo, kaj je mogoče iskati znotraj iskalnega polja",
    "addSearchSourceLabel": "Dodajte vir iskanja",
    "featureLayerLabel": "Geoobjektni sloj",
    "geocoderLabel": "Geokodirnik",
    "nameTitle": "Ime",
    "generalSettingLabel": "Splošna nastavitev",
    "allPlaceholderLabel": "Besedilo označbe mesta za iskanje vsega:",
    "allPlaceholderHintText": "Namig: Vnesite besedilo, ki bo prikazano kot označba mesta med iskanjem po vseh slojih in geokodirniku",
    "generalSettingCheckboxLabel": "Pokaži pojavno okno za najdeni geoobjekt ali lokacijo",
    "countryCode": "Šifre države ali regije",
    "countryCodeEg": "npr. ",
    "countryCodeHint": "Če to vrednost pustite prazno, bo iskanje potekalo po vseh državah in regijah",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Išči samo v trenutnem obsegu karte",
    "zoomScale": "Približaj merilo",
    "locatorUrl": "URL geokodirnika",
    "locatorName": "Ime geokodirnika",
    "locatorExample": "Primer",
    "locatorWarning": "Ta različica geokodirnih storitev ni podprta. Pripomoček podpira različico geokodirne storitve 10.0 in novejšo.",
    "locatorTips": "Predlogi niso na voljo, ker geokodirna storitev ne podpira predlagane zmožnosti.",
    "layerSource": "Vir sloja",
    "setLayerSource": "Nastavi vir sloja",
    "setGeocoderURL": "Nastavi URL geokodirnika",
    "searchLayerTips": "Predlogi niso na voljo, ker geoobjektna storitev ne podpira možnosti številčenja strani.",
    "placeholder": "Besedilo označbe mesta",
    "searchFields": "Iskalna polja",
    "displayField": "Prikaži polje",
    "exactMatch": "Natančno ujemanje",
    "maxSuggestions": "Največ predlogov",
    "maxResults": "Največ rezultatov",
    "enableLocalSearch": "Omogoči lokalno iskanje",
    "minScale": "Najmanjše merilo",
    "minScaleHint": "Ko je merilo karte večje od tega merila, bo uporabljeno lokalno iskanje",
    "radius": "Polmer",
    "radiusHint": "Določa polmer območja okrog trenutnega središča karte, ki je uporabljeno za povečanje števila kandidatov za geokodiranje. Tako so najprej prikazani kandidati, ki so najbližje lokaciji",
    "meters": "Metri",
    "setSearchFields": "Nastavi iskalna polja",
    "set": "Nastavi",
    "fieldName": "Ime",
    "invalidUrlTip": "URL ${URL} ni veljaven ali dostopen."
  },
  "searchSetting": {
    "searchSettingTabTitle": "Nastavitve iskanja",
    "defaultBufferDistanceLabel": "Nastavi privzeto razdaljo obrisa",
    "maxResultCountLabel": "Omejitev števila rezultatov",
    "maxResultCountHintLabel": "Namig: Nastavite največje število vidnih rezultatov. Vrednost 1 bo vrnila najbližji geoobjekt",
    "maxBufferDistanceLabel": "Nastavi največjo razdaljo obrisa",
    "bufferDistanceUnitLabel": "Enote razdalje obrisa",
    "defaultBufferHintLabel": "Namig: Nastavite privzeto vrednost drsnika obrisa",
    "maxBufferHintLabel": "Namig: Nastavite največjo vrednost drsnika obrisa",
    "bufferUnitLabel": "Namig: Določite enoto za ustvarjanje obrisa",
    "selectGraphicLocationSymbol": "Simbol naslova ali lokacije",
    "graphicLocationSymbolHintText": "Namig: Simbol za iskane naslove ali lokacije klika",
    "addressLocationPolygonHintText": "Namig: Simbol za iskane poligonske sloje",
    "popupTitleForPolygon": "Izberite poligon za izbrano lokacijo naslova",
    "popupTitleForPolyline": "Izberite linijo za lokacijo naslova",
    "addressLocationPolylineHintText": "Namig: Simbol za iskani polilinijski sloj",
    "fontColorLabel": "Izberite barvo pisave za iskalne rezultate",
    "fontColorHintText": "Namig: Barva pisave iskalnih rezultatov",
    "zoomToSelectedFeature": "Približaj izbranemu geoobjektu",
    "zoomToSelectedFeatureHintText": "Namig: Približaj izbranemu geoobjektu namesto obrisu",
    "intersectSearchLocation": "Prikaži poligone, ki se sekajo",
    "intersectSearchLocationHintText": "Namig: Prikaže poligone na iskanih lokacijah namesto poligonov znotraj obrisa",
    "enableProximitySearch": "Omogoči iskanje bližine",
    "enableProximitySearchHintText": "Namig: Omogočite zmožnost iskanja lokacij v bližini izbranega rezultata",
    "bufferVisibilityLabel": "Nastavi vidnost obrisa",
    "bufferVisibilityHintText": "Namig: Obris bo prikazan na karti",
    "bufferColorLabel": "Nastavite simbol obrisa",
    "bufferColorHintText": "Namig: Izberite barvo in prosojnost obrisa",
    "searchLayerResultLabel": "Nariši samo izbrane rezultate slojev",
    "searchLayerResultHint": "Namig: Na karti se bodo izrisali samo izbrani sloji iz iskalnih rezultatov",
    "showToolToSelectLabel": "Nastavite gumb lokacije",
    "showToolToSelectHintText": "Namig: Ponudi gumb za nastavitev lokacije na karti v izogib vsakokratnem klikanju in nastavljanju lokacije na karti",
    "geoDesicParamLabel": "Uporabi geodetski obris",
    "geoDesicParamHintText": "Namig: Uporabi geodetski obris namesto evklidskega obrisa (planarni)"
  },
  "layerSelector": {
    "selectLayerLabel": "Izberi iskane sloje",
    "layerSelectionHint": "Namig: Uporabi gumb Nastavi za izbiro slojev",
    "addLayerButton": "Nastavi"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Nastavitve navodil za pot",
    "routeServiceUrl": "Storitev usmerjanja",
    "buttonSet": "Nastavi",
    "routeServiceUrlHintText": "Namig: Kliknite »Nastavi« za brskanje in izberite storitev usmerjanja",
    "directionLengthUnit": "Enote dolžine v navodilih za pot",
    "unitsForRouteHintText": "Namig: Uporablja se za prikaz enot za pot",
    "selectRouteSymbol": "Izberite simbol za prikaz poti",
    "routeSymbolHintText": "Namig: Uporablja se za prikaz simbola linije poti",
    "routingDisabledMsg": "Da omogočite navodila za pot, se v nastavitvah aplikacije prepričajte, da je usmerjanje omogočeno."
  },
  "symbologySetting": {
    "symbologySettingTabTitle": "Nastavitve simbologije",
    "addSymbologyBtnLabel": "Dodaj nove simbole",
    "layerNameTitle": "Ime sloja",
    "fieldTitle": "Polje",
    "valuesTitle": "Vrednosti",
    "symbolTitle": "Simbol",
    "actionsTitle": "Dejanja",
    "invalidConfigMsg": "Podvoji polje : ${fieldName} za sloj : ${layerName}"
  },
  "filterSetting": {
    "filterSettingTabTitle": "Nastavitve filtra",
    "addTaskTip": "Izbranim iskalnim slojem dodajte enega ali več filtrov in za vsakega konfigurirajte parametre.",
    "enableMapFilter": "Odstranite prednastavljeni filter sloja s karte.",
    "newFilter": "Nov filter",
    "filterExpression": "Izraz fitra",
    "layerDefaultSymbolTip": "Uporabi privzeti simbol sloja",
    "uploadImage": "Naloži sliko",
    "selectLayerTip": "Izberite sloj.",
    "setTitleTip": "Nastavite naslov.",
    "noTasksTip": "Filtri niso konfigurirani. Kliknite »${newFilter}« za dodajanje novega.",
    "collapseFiltersTip": "Strni izraze filtra (če obstajajo), ko je pripomoček odprt"
  },
  "networkServiceChooser": {
    "arcgislabel": "Dodaj iz ArcGIS Online",
    "serviceURLabel": "Dodaj URL storitve",
    "routeURL": "URL poti",
    "validateRouteURL": "Potrdi",
    "exampleText": "Primer",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Določite veljavno storitev usmerjanja.",
    "rateLimitExceeded": "Zgornja meja omejitve presežena. Poskusite znova pozneje.",
    "errorInvokingService": "Uporabniško ime ali geslo ni pravilno."
  },
  "errorStrings": {
    "bufferErrorString": "Vnesite veljavno številsko vrednost.",
    "selectLayerErrorString": "Izberite sloje za iskanje.",
    "invalidDefaultValue": "Privzeta razdalja obrisa ne sme biti prazna. Navedite razdaljo obrisa.",
    "invalidMaximumValue": "Največja razdalja obrisa ne sme biti prazna. Navedite razdaljo obrisa.",
    "defaultValueLessThanMax": "Navedite privzeto razdaljo obrisa znotraj največje omejitve",
    "defaultBufferValueGreaterThanOne": "Privzeta razdalja obrisa ne sme biti manj kot 0",
    "maximumBufferValueGreaterThanOne": "Navedite največjo razdaljo obrisa, večjo od 0",
    "invalidMaximumResultCountValue": "Navedite veljavno vrednost za največje število rezultatov",
    "invalidSearchSources": "Neveljavne nastavitve iskanja vira"
  },
  "symbolPickerPreviewText": "Predogled:"
});