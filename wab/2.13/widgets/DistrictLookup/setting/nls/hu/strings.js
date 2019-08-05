/*global define*/
///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
    "miles": "Mérföld",
    "kilometers": "Kilométer",
    "feet": "Láb",
    "meters": "Méter"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Keresési beállítások",
    "buttonSet": "Beállítás",
    "selectLayersLabel": "Réteg kiválasztása",
    "selectLayersHintText": "Tipp: A polygonréteg és a hozzá kapcsolt pontréteg kiválasztására szolgál.",
    "selectPrecinctSymbolLabel": "Polygon kijelöléséhez használt szimbólum kiválasztása",
    "selectGraphicLocationSymbol": "Cím vagy hely szimbóluma",
    "graphicLocationSymbolHintText": "Tipp: A keresett cím vagy a kattintással kiválasztott hely szimbóluma",
    "precinctSymbolHintText": "Tipp: A kijelölt polygon szimbólumának megjelenítésére szolgál",
    "selectColorForPoint": "Pont kiemelési színének kiválasztása",
    "selectColorForPointHintText": "Tipp: A kiválasztott pont kiemeléséhez használt szín megjelenítésére szolgál"
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
    "locatorTips": "Nem állnak rendelkezésre a javaslatok, mert a geokódoló szolgáltatás nem támogatja ezt a funkciót.",
    "layerSource": "Rétegforrás",
    "setLayerSource": "Rétegforrás beállítása",
    "setGeocoderURL": "Geokódoló URL-címének beállítása",
    "searchLayerTips": "Nem állnak rendelkezésre a javaslatok, mert a vektoros adatszolgáltatás nem támogatja az oldalszámozást.",
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
    "invalidUrlTip": "A(z) ${URL} URL-cím érvénytelen vagy nem érhető el.",
    "invalidSearchSources": "A keresési forrás beállításai érvénytelenek"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Polygonréteg kiválasztása",
    "selectPolygonLayerHintText": "Tipp: Polygonréteg kiválasztására szolgál.",
    "selectRelatedPointLayerLabel": "Polygonréteghez kapcsolt pontréteg kiválasztása",
    "selectRelatedPointLayerHintText": "Tipp: Polygonréteghez kapcsolt pontréteg kiválasztására szolgál",
    "polygonLayerNotHavingRelatedLayer": "Olyan polygonréteget válasszon, amelyhez kapcsolt pontréteg tartozik.",
    "errorInSelectingPolygonLayer": "Olyan polygonréteget válasszon, amelyhez kapcsolt pontréteg tartozik.",
    "errorInSelectingRelatedLayer": "Polygonréteghez kapcsolt pontréteget válasszon ki."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Útvonalterv beállításai",
    "routeServiceUrl": "Útvonal-tervezési szolgáltatás",
    "buttonSet": "Beállítás",
    "routeServiceUrlHintText": "Tipp: Kattintson a „Beállítás” lehetőségre egy hálózatelemzésen alapuló útvonal-megállapítási szolgáltatás kiválasztásához",
    "directionLengthUnit": "Útvonalterv hosszmértékegysége",
    "unitsForRouteHintText": "Tipp: Az útvonalhoz használt mértékegységek megjelenítésére szolgál",
    "selectRouteSymbol": "Útvonal megjelenítéséhez használt szimbólum kiválasztása",
    "routeSymbolHintText": "Tipp: Az útvonal vonalszimbólumának megjelenítésére szolgál",
    "routingDisabledMsg": "Az útvonalterv engedélyezéséhez engedélyezze az útvonal-megállapítást az ArcGIS Online elemben.",
    "enableDirectionLabel": "Útvonalterv engedélyezése",
    "enableDirectionText": "Útmutatás: Jelölje be az útvonalterv engedélyezéséhez a widgetben."
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
  "symbolPickerPreviewText": "Előnézet:",
  "showToolToSelectLabel": "Hely beállítása gomb",
  "showToolToSelectHintText": "Tipp: A helynek a térképen történő beállítására gombot biztosít – a térképre kattintás helyett"
});