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
      "displayText": "mérföld",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "kilométer",
      "acronym": "km"
    },
    "feet": {
      "displayText": "láb",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "méter",
      "acronym": "m"
    }
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Keresési forrás beállításai",
    "searchSourceSettingTitle": "Keresési forrás beállításai",
    "searchSourceSettingTitleHintText": "Geokódoló szolgáltatások vagy vektoros rétegek hozzáadása és konfigurálása keresési forrásként. Ezek a megadott források határozzák meg, mi kereshető a keresőmezőben",
    "addSearchSourceLabel": "Keresési forrás hozzáadása",
    "featureLayerLabel": "Vektoros réteg",
    "geocoderLabel": "Geokódoló",
    "nameTitle": "Név",
    "generalSettingLabel": "Általános beállítások",
    "allPlaceholderLabel": "Helyőrző szöveg az összes kereséséhez:",
    "allPlaceholderHintText": "Tipp: Adja meg az összes réteg és geokódoló keresésekor helyőrzőként megjelenítendő szöveget",
    "generalSettingCheckboxLabel": "Felugró ablak megjelenítése a megtalált vektoros elemhez vagy helyhez",
    "countryCode": "Ország- vagy régiókód(ok)",
    "countryCodeEg": "pl. ",
    "countryCodeHint": "Ha üresen hagyja ezt az értéket, a keresés minden országra és régióra ki fog terjedni",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Csak az aktuális térképkiterjedésen belül keressen",
    "zoomScale": "Zoom-méretarány",
    "locatorUrl": "Geokódoló URL-címe",
    "locatorName": "Geokódoló neve",
    "locatorExample": "Példa",
    "locatorWarning": "A geokódoló szolgáltatás ezen verziója nem támogatott. A widget csak a 10.0 és újabb verziójú geokódoló szolgáltatást támogatja.",
    "locatorTips": "Nem érhetők el a javaslatok, mert a geokódoló szolgáltatás nem támogatja ezt a funkciót.",
    "layerSource": "Rétegforrás",
    "setLayerSource": "Rétegforrás beállítása",
    "setGeocoderURL": "Geokódoló URL-címének beállítása",
    "searchLayerTips": "Nem érhetők el a javaslatok, mert a vektoros adatszolgáltatás nem támogatja az oldalszámozást.",
    "placeholder": "Helyőrző szöveg",
    "searchFields": "Mezők keresése",
    "displayField": "Megjelenítési mező",
    "exactMatch": "Pontos találat",
    "maxSuggestions": "Javaslatok maximális száma",
    "maxResults": "Találatok maximális száma",
    "enableLocalSearch": "Helyi keresés engedélyezése",
    "minScale": "Min. méretarány",
    "minScaleHint": "Ha a térkép méretaránya nagyobb, mint ez a méretarány, akkor a helyi keresés lesz aktív",
    "radius": "Sugár",
    "radiusHint": "A térkép aktuális középpontja körül annak a területnek a sugarát határozza meg, amelyen belül megnő a geokódoló jelöltjeinek prioritása, hogy az adott helyhez legközelebb lévő jelöltek elsőbbséget élvezzenek",
    "meters": "Méter",
    "setSearchFields": "Keresőmezők beállítása",
    "set": "Beállítás",
    "fieldName": "Név",
    "invalidUrlTip": "A(z) ${URL} URL-cím érvénytelen vagy nem érhető el."
  },
  "searchSetting": {
    "searchSettingTabTitle": "Keresési beállítások",
    "defaultBufferDistanceLabel": "Alapértelmezett buffertávolság beállítása",
    "maxResultCountLabel": "Találatok számának korlátozása",
    "maxResultCountHintLabel": "Tipp: Állítsa be a megjelenő találatok maximális számát. Az „1” érték esetén egyetlen találatként a legközelebbi vektoros elem fog megjelenni",
    "maxBufferDistanceLabel": "Maximum buffertávolság beállítása",
    "bufferDistanceUnitLabel": "Buffertávolság mértékegysége",
    "defaultBufferHintLabel": "Tipp: Állítsa be a buffer csúszkájának alapértelmezett értékét",
    "maxBufferHintLabel": "Tipp: Állítsa be a buffer csúszkájának maximális értékét",
    "bufferUnitLabel": "Tipp: Adja meg a buffer létrehozásának mértékegységét",
    "selectGraphicLocationSymbol": "Cím vagy hely szimbóluma",
    "graphicLocationSymbolHintText": "Tipp: A keresett cím vagy a kattintással kiválasztott hely szimbóluma",
    "addressLocationPolygonHintText": "Tipp: A keresett polygonréteg szimbóluma",
    "popupTitleForPolygon": "Polygon kiválasztása a kiválasztott cím helyéhez",
    "popupTitleForPolyline": "Vonal kiválasztása a cím helyéhez",
    "addressLocationPolylineHintText": "Tipp: A keresett polyline réteg szimbóluma",
    "fontColorLabel": "Betűszín kiválasztása a keresési eredményekhez",
    "fontColorHintText": "Tipp: A keresési eredmények betűszíne",
    "zoomToSelectedFeature": "Nagyítás a kiválasztott vektoros elemre",
    "zoomToSelectedFeatureHintText": "Tipp: Nagyítás a kiválasztott vektoros elemre a buffer helyett",
    "intersectSearchLocation": "Metsző polygon(ok) visszaadása",
    "intersectSearchLocationHintText": "Tipp: A keresett helyet tartalmazó poligon(ok) visszaadása a bufferben lévő poligonok helyett",
    "enableProximitySearch": "Közelségi keresés engedélyezése",
    "enableProximitySearchHintText": "Tipp: Lehetővé teszi a kiválasztott találat közelében lévő helyek keresését",
    "bufferVisibilityLabel": "Buffer láthatóságának beállítása",
    "bufferVisibilityHintText": "Tipp: A buffer megjelenik a térképen",
    "bufferColorLabel": "Buffer szimbólumának beállítása",
    "bufferColorHintText": "Tipp: A buffer színének és átlátszóságának beállítása",
    "searchLayerResultLabel": "Csak a kijelölt rétegtalálatok rajzolása",
    "searchLayerResultHint": "Tipp: Csak a keresési találatokban kiválasztott réteg jelenik meg a térképen",
    "showToolToSelectLabel": "Hely beállítása gomb",
    "showToolToSelectHintText": "Tipp: A helynek a térképen történő beállítására gombot biztosít – a térképre kattintás helyett",
    "geoDesicParamLabel": "Geodéziai buffer használata",
    "geoDesicParamHintText": "Tipp: Geodéziai buffer használata euklideszi (síkbeli) buffer helyett"
  },
  "layerSelector": {
    "selectLayerLabel": "Keresési réteg(ek) kiválasztása",
    "layerSelectionHint": "Tipp: Használja a Beállítás gombot a réteg(ek) kiválasztásához",
    "addLayerButton": "Beállítás"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Útvonalterv beállításai",
    "routeServiceUrl": "Útvonal-tervezési szolgáltatás",
    "buttonSet": "Beállítás",
    "routeServiceUrlHintText": "Tipp: Kattintson a „Beállítás” lehetőségre egy útvonal-megállapítási szolgáltatás kiválasztásához",
    "directionLengthUnit": "Útvonalterv hosszmértékegysége",
    "unitsForRouteHintText": "Tipp: Az útvonalhoz használt mértékegységek megjelenítésére szolgálnak",
    "selectRouteSymbol": "Útvonal megjelenítéséhez használt szimbólum kiválasztása",
    "routeSymbolHintText": "Tipp: Az útvonal vonalszimbólumának megjelenítésére szolgál",
    "routingDisabledMsg": "Az útvonalterv engedélyezéséhez engedélyezze az elemhez az útvonal-megállapítást az alkalmazásbeállításokban."
  },
  "symbologySetting": {
    "symbologySettingTabTitle": "Szimbólumrendszer beállításai",
    "addSymbologyBtnLabel": "Új szimbólumok hozzáadása",
    "layerNameTitle": "Réteg neve",
    "fieldTitle": "Mező",
    "valuesTitle": "Értékek",
    "symbolTitle": "Szimbólum",
    "actionsTitle": "Műveletek",
    "invalidConfigMsg": "Ismétlődő mező: ${fieldName}; a következő rétegben: ${layerName}"
  },
  "filterSetting": {
    "filterSettingTabTitle": "Szűrőbeállítások",
    "addTaskTip": "Adjon hozzá egy vagy több szűrőt a kiválasztott keresési réteg(ek)hez, és konfigurálja a paramétereiket.",
    "enableMapFilter": "Előre beállított rétegszűrő eltávolítása a térképről.",
    "newFilter": "Új szűrő",
    "filterExpression": "Szűrőkifejezés",
    "layerDefaultSymbolTip": "A réteg alapértelmezett szimbólumának használata",
    "uploadImage": "Kép feltöltése",
    "selectLayerTip": "Válasszon ki egy réteget.",
    "setTitleTip": "Állítsa be a címet.",
    "noTasksTip": "Nincsenek beállítva szűrők. Kattintson a(z) „${newFilter}” gombra új szűrő hozzáadásához.",
    "collapseFiltersTip": "Szűrőkifejezések bezárása (ha vannak) a widget megnyitásakor",
    "groupFiltersTip": "Szűrők csoportosítása réteg szerint",
    "infoTab": "Információ",
    "expressionsTab": "Kifejezések",
    "optionsTab": "Beállítások",
    "autoApplyWhenWidgetOpen": "Szűrő alkalmazása a widget megnyitásakor"
  },
  "networkServiceChooser": {
    "arcgislabel": "Hozzáadás az ArcGIS Online-ból",
    "serviceURLabel": "Szolgáltatás URL-címének hozzáadása",
    "routeURL": "Útvonal URL-címe",
    "validateRouteURL": "Érvényesítés",
    "exampleText": "Példa",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Adjon meg érvényes útvonalszolgáltatást.",
    "rateLimitExceeded": "Túllépte a szolgáltatási határértéket. Próbálja újra később.",
    "errorInvokingService": "Hibás felhasználónév vagy jelszó."
  },
  "errorStrings": {
    "bufferErrorString": "Adjon meg érvényes numerikus értéket.",
    "selectLayerErrorString": "Válasszon réteg(ek)et a kereséshez.",
    "invalidDefaultValue": "Az alapértelmezett buffertávolság nem lehet üres. Adja meg a buffertávolságot",
    "invalidMaximumValue": "A maximális buffertávolság nem lehet üres. Adja meg a buffertávolságot",
    "defaultValueLessThanMax": "Az alapértelmezett buffertávolságot a maximális határértéken belül adja meg",
    "defaultBufferValueGreaterThanOne": "Az alapértelmezett buffertávolság nem lehet 0-nál kisebb",
    "maximumBufferValueGreaterThanOne": "Adjon meg 0-nál nagyobb maximális buffertávolságot",
    "invalidMaximumResultCountValue": "Adjon meg érvényes értéket a találatok maximális számához",
    "invalidSearchSources": "A keresési forrás beállításai érvénytelenek"
  },
  "symbolPickerPreviewText": "Előnézet:"
});