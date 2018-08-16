/*
 | Copyright 2017 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define({
  "searchSourceSetting": {
    "title": "Keresési és bufferbeállítások",
    "mainHint": "Engedélyezheti a címek és vektoros elemek szöveges keresését, a geometria digitalizálását és a bufferelést."
  },
  "addressSourceSetting": {
    "title": "Címrétegek",
    "mainHint": "Megadhatja, hogy mely címzett címkerétegei legyenek elérhetők."
  },
  "notificationSetting": {
    "title": "Értesítési beállítások",
    "mainHint": "Megadhatja, milyen típusú értesítések legyenek elérhetők."
  },
  "groupingLabels": {
    "addressSources": "A címzettrétegek kiválasztására szolgáló réteg",
    "averyStickersDetails": "Avery(r) feliratok",
    "csvDetails": "Vesszővel tagolt értékeket tartalmazó (CSV) fájl",
    "drawingTools": "Rajzeszközök a terület megadásához",
    "featureLayerDetails": "Vektoros réteg",
    "geocoderDetails": "Geokódoló",
    "labelFormats": "Elérhető feliratformátumok",
    "printingOptions": "Nyomtatott feliratoldalak beállításai",
    "searchSources": "Keresési források",
    "stickerFormatDetails": "Feliratoldal paraméterei"
  },
  "hints": {
    "alignmentAids": "A feliratoldalra jelek kerültek, amelyek segítenek az oldal nyomtatási elrendezéshez való igazításában",
    "csvNameList": "Kis- és nagybetűket megkülönböztető mezőnevek vesszővel tagolt listája",
    "horizontalGap": "Szóköz két felirat között egy sorban",
    "insetToLabel": "Szóköz a felirat oldala és a szöveg kezdete között",
    "labelFormatDescription": "A feliratstílus widgetformátumban történő megjelenítésének beállítási listája",
    "labelFormatDescriptionHint": "Eszköztipp a leírás kiegészítéséhez a formátumbeállítások listájában",
    "labelHeight": "Az egyes feliratok magassága az oldalon",
    "labelWidth": "Az egyes feliratok szélessége az oldalon",
    "localSearchRadius": "A térkép aktuális középpontja körül annak a területnek a sugarát határozza meg, amelyen belül megnő a geokódoló jelöltjeinek prioritása, hogy az adott helyhez legközelebb lévő jelöltek elsőbbséget élvezzenek",
    "rasterResolution": "A 100 pixel/hüvelyk közel azonos a képernyő felbontásával. Minél nagyobb a felbontás, annál több memóriára van szüksége a böngészőnek. A nagy memóriaigényű feladatok kezelése terén a böngészők képességei eltérőek.",
    "selectionListOfOptionsToDisplay": "A bejelölt elemek beállításokként jelennek meg a widgetben; a sorrendjüket igény szerint módosíthatja",
    "verticalGap": "Szóköz két felirat között egy oszlopban"
  },
  "propertyLabels": {
    "bufferDefaultDistance": "Alapértelmezett buffertávolság",
    "bufferUnits": "A widgetben megjelenítendő bufferegységek",
    "countryRegionCodes": "Ország- vagy régiókódok",
    "description": "Leírás",
    "descriptionHint": "Tipp a leíráshoz",
    "displayField": "Megjelenítési mező",
    "drawingToolsFreehandPolygon": "szabadkézi sokszög",
    "drawingToolsLine": "vonal",
    "drawingToolsPoint": "pont",
    "drawingToolsPolygon": "Polygon",
    "drawingToolsPolyline": "Polyline",
    "enableLocalSearch": "Helyi keresés engedélyezése",
    "exactMatch": "Pontos találat",
    "fontSizeAlignmentNote": "A nyomtatási margókról szóló megjegyzés betűmérete",
    "gridDarkness": "Rács sötétsége",
    "gridlineLeftInset": "Rácsvonal bal oldali behúzása",
    "gridlineMajorTickMarksGap": "Nagy osztásjelek sűrűsége",
    "gridlineMinorTickMarksGap": "Kis osztásjelek sűrűsége",
    "gridlineRightInset": "Rácsvonal jobb oldali behúzása",
    "labelBorderDarkness": "Feliratszegély sötétsége",
    "labelBottomEdge": "Feliratok alsó szegélye az oldalon",
    "labelFontSize": "Betűméret",
    "labelHeight": "Feliratmagasság",
    "labelHorizontalGap": "Vízszintes hézag",
    "labelInitialInset": "Behúzás feliratszöveghez",
    "labelLeftEdge": "Feliratok bal szegélye az oldalon",
    "labelMaxLineCount": "Felirat sorainak maximális száma",
    "labelPageHeight": "Oldalmagasság",
    "labelPageWidth": "Oldalszélesség",
    "labelRightEdge": "Feliratok jobb szegélye az oldalon",
    "labelsInAColumn": "Feliratok száma egy oszlopban",
    "labelsInARow": "Feliratok száma egy sorban",
    "labelTopEdge": "Feliratok felső szegélye az oldalon",
    "labelVerticalGap": "Függőleges hézag",
    "labelWidth": "Felirat szélessége",
    "limitSearchToMapExtent": "Csak az aktuális térképkiterjedésen belül keressen",
    "maximumResults": "Találatok maximális száma",
    "maximumSuggestions": "Javaslatok maximális száma",
    "minimumScale": "Minimum méretarány",
    "name": "Név",
    "percentBlack": "% fekete",
    "pixels": "pixel",
    "pixelsPerInch": "pixel/hüvelyk",
    "placeholderText": "Helyőrző szöveg",
    "placeholderTextForAllSources": "Helyőrző szöveg az összes forrás kereséséhez",
    "radius": "Sugár",
    "rasterResolution": "Raszteres felbontás",
    "searchFields": "Mezők keresése",
    "showAlignmentAids": "Igazítási segédeszközök megjelenítése az oldalon",
    "showGridTickMarks": "Rács osztásjeleinek megjelenítése",
    "showLabelOutlines": "Feliratkontúrok megjelenítése",
    "showPopupForFoundItem": "Felugró ablak megjelenítése a megtalált vektoros elemhez vagy helyhez",
    "tool": "Eszközök",
    "units": "Mértékegységek",
    "url": "URL",
    "urlToGeometryService": "URL a geometriai adatszolgáltatáshoz",
    "useRelatedRecords": "Kapcsolt rekordok használata",
    "useSecondarySearchLayer": "Másodlagos kijelölési réteg használata",
    "useSelectionDrawTools": "Kijelölési rajzeszközök használata",
    "useVectorFonts": "Vektoros betűtípus használata (csak latin betűk esetén)",
    "zoomScale": "Zoom-méretarány"
  },
  "buttons": {
    "addAddressSource": "Réteg hozzáadása, amely címfeliratokat tartalmaz a felugró ablakban",
    "addLabelFormat": "Feliratformátum hozzáadása",
    "addSearchSource": "Keresési forrás hozzáadása",
    "set": "Beállítás"
  },
  "placeholders": {
    "averyExample": "pl., Avery(r) felirat ${averyPartNumber}",
    "countryRegionCodes": "pl., USA,CHN",
    "descriptionCSV": "Vesszővel tagolt értékek",
    "descriptionPDF": "PDF felirat ${heightLabelIn} x ${widthLabelIn} hüvelyk; ${labelsPerPage} oldalanként"
  },
  "tooltips": {
    "getWebmapFeatureLayer": "Vektoros réteg beolvasása a webtérképről",
    "openCountryCodes": "Kattintson kódokkal kapcsolatos további információkért",
    "openFieldSelector": "Kattintson egy mezőválasztó megnyitásához",
    "setAndValidateURL": "URL beállítása és érvényesítése"
  },
  "problems": {
    "noAddresseeLayers": "Adjon meg legalább egy címzettréteget",
    "noBufferUnitsForDrawingTools": "Konfiguráljon legalább egy pufferegységet a rajzeszközökhöz",
    "noBufferUnitsForSearchSource": "Konfiguráljon legalább egy pufferegységet a(z) \"${sourceName}” keresési forráshoz",
    "noGeometryServiceURL": "Konfigurálja a geometriai adatszolgáltatás URL-címét",
    "noNotificationLabelFormats": "Adjon meg legalább egy értesítésifelirat-formátumot",
    "noSearchSourceFields": "Konfiguráljon egy vagy több keresőmezőt a(z) \"${sourceName}” keresési forráshoz",
    "noSearchSourceURL": "Konfigurálja a(z) \"${sourceName}” keresési forrás URL-címét"
  }
});