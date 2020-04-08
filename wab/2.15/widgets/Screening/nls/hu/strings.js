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
  "_widgetLabel": "Rétegellenőrzés",
  "geometryServicesNotFound": "A geometriai adatszolgáltatás nem érhető el.",
  "unableToDrawBuffer": "A buffer kirajzolása nem sikerült. Próbálkozzon újra.",
  "invalidConfiguration": "Érvénytelen konfiguráció.",
  "clearAOIButtonLabel": "Újrakezdés",
  "noGraphicsShapefile": "A feltöltött shapefile nem tartalmaz grafikát.",
  "zoomToLocationTooltipText": "Zoomolás a helyre",
  "noGraphicsToZoomMessage": "A nagyításhoz nem található grafika.",
  "placenameWidget": {
    "placenameLabel": "Hely keresése"
  },
  "drawToolWidget": {
    "useDrawToolForAOILabel": "Rajzolási mód kiválasztása",
    "toggleSelectability": "Kijelölhetőség be/kikapcsolása",
    "chooseLayerTitle": "Válasszon kijelölhető rétegeket",
    "selectAllLayersText": "Összes kiválasztása",
    "layerSelectionWarningTooltip": "Legalább egy réteget ki kell választani a vizsgálati terület létrehozásához",
    "selectToolLabel": "Eszköz választása"
  },
  "shapefileWidget": {
    "shapefileLabel": "Tömörített shapefile feltöltése",
    "uploadShapefileButtonText": "Feltöltés",
    "unableToUploadShapefileMessage": "A shapefile feltöltése nem sikerült."
  },
  "coordinatesWidget": {
    "selectStartPointFromSearchText": "Kiindulási pont meghatározása",
    "addButtonTitle": "Hozzáadás",
    "deleteButtonTitle": "Eltávolítás",
    "mapTooltipForStartPoint": "A kiindulási pont meghatározásához kattintson a térképre",
    "mapTooltipForUpdateStartPoint": "A kiindulási pont frissítéséhez kattintson a térképre",
    "locateText": "Megkeresés",
    "locateByMapClickText": "Kezdeti koordináták kiválasztása",
    "enterBearingAndDistanceLabel": "Adja meg az irányszöget és a távolságot a kiindulási ponttól",
    "bearingTitle": "Irányszög",
    "distanceTitle": "Távolság",
    "planSettingTooltip": "Tervbeállítások",
    "invalidLatLongMessage": "Adjon meg érvényes értékeket."
  },
  "bufferDistanceAndUnit": {
    "bufferInputTitle": "Buffertávolság (opcionális)",
    "bufferInputLabel": "Eredmények megjelenítése ezen belül:",
    "bufferDistanceLabel": "Buffertávolság",
    "bufferUnitLabel": "Bufferegység"
  },
  "traverseSettings": {
    "bearingLabel": "Irányszög",
    "lengthLabel": "Hossz",
    "addButtonTitle": "Hozzáadás",
    "deleteButtonTitle": "Eltávolítás",
    "deleteBearingAndLengthLabel": "Irányszög és hossz sor eltávolítása",
    "addButtonLabel": "Irányszög és hossz hozzáadása"
  },
  "planSettings": {
    "expandGridTooltipText": "Rács kibontása",
    "collapseGridTooltipText": "Rács bezárása",
    "directionUnitLabelText": "Útvonalak mértékegysége",
    "distanceUnitLabelText": "Távolság- és hosszmértékegységek",
    "planSettingsComingSoonText": "Hamarosan"
  },
  "newTraverse": {
    "invalidBearingMessage": "Érvénytelen irányszög.",
    "invalidLengthMessage": "Érvénytelen hossz.",
    "negativeLengthMessage": "Negatív hossz"
  },
  "reportsTab": {
    "aoiAreaText": "Vizsgálati terület nagysága",
    "downloadButtonTooltip": "Letöltés",
    "printButtonTooltip": "Nyomtatás",
    "uploadShapefileForAnalysisText": "Elemzésre szánt shapefile feltöltése",
    "uploadShapefileForButtonText": "Tallózás",
    "downloadLabelText": "Formátum kiválasztása:",
    "downloadBtnText": "Letöltés",
    "noDetailsAvailableText": "Nincs találat",
    "featureCountText": "Szám",
    "featureAreaText": "Terület",
    "featureLengthText": "Hossz",
    "attributeChooserTooltip": "Válassza ki a megjelenítendő attribútumokat",
    "csv": "CSV",
    "filegdb": "Fájl-geoadatbázis",
    "shapefile": "Shapefile",
    "noFeaturesFound": "Nincs találat a kiválasztott fájlformátumhoz",
    "selectReportFieldTitle": "Mezők kiválasztása",
    "noFieldsSelected": "Nincsenek kijelölt mezők",
    "intersectingFeatureExceedsMsgOnCompletion": "Egy vagy több rétegen el lett érve a maximális rekordszám.",
    "unableToAnalyzeText": "Az elemzés nem sikerült, elérte a maximális rekordszámot.",
    "errorInPrintingReport": "Nem sikerült kinyomtatni a jelentést. Ellenőrizze, hogy a jelentés beállításai érvényesek-e.",
    "aoiInformationTitle": "Vizsgálati területre vonatkozó információ",
    "summaryReportTitle": "Összefoglalás",
    "notApplicableText": "–",
    "downloadReportConfirmTitle": "Letöltés megerősítése",
    "downloadReportConfirmMessage": "Biztosan letölti?",
    "noDataText": "Nincs adat",
    "createReplicaFailedMessage": "A letöltési művelet sikertelen a következő réteg(ek) esetén: <br/> ${layerNames}",
    "extractDataTaskFailedMessage": "A letöltési művelet sikertelen.",
    "printLayoutLabelText": "Elrendezés",
    "printBtnText": "Nyomtatás",
    "printDialogHint": "Megjegyzés: A jelentés címe és megjegyzései szerkeszthetők a jelentés előnézetében.",
    "unableToDownloadFileGDBText": "Fájl-geoadatbázis nem tölthető le AOI pont vagy vonal típusú helyeket tartalmazó vizsgálati területekhez",
    "unableToDownloadShapefileText": "A shapefile nem tölthető le pont vagy vonal típusú helyeket tartalmazó vizsgálati területekhez",
    "analysisAreaUnitLabelText": "Területi eredmények megjelenítése a következőben:",
    "analysisLengthUnitLabelText": "Hosszeredmények megjelenítése a következőben:",
    "analysisUnitButtonTooltip": "Válasszon mértékegységeket az elemzéshez",
    "analysisCloseBtnText": "Bezárás",
    "areaSquareFeetUnit": "Négyzetláb",
    "areaAcresUnit": "Acre",
    "areaSquareMetersUnit": "Négyzetméter",
    "areaSquareKilometersUnit": "Négyzetkilométer",
    "areaHectaresUnit": "Hektár",
    "areaSquareMilesUnit": "Négyzetmérföld",
    "lengthFeetUnit": "Láb",
    "lengthMilesUnit": "Mérföld",
    "lengthMetersUnit": "Méter",
    "lengthKilometersUnit": "Kilométer",
    "hectaresAbbr": "hektár",
    "squareMilesAbbr": "Négyzetmérföld",
    "layerNotVisibleText": "Nem lehet elemezni. A réteg ki van kapcsolva, vagy a méretarány szerinti láthatósági tartományon kívül van.",
    "refreshBtnTooltip": "Jelentés frissítése",
    "featureCSVAreaText": "Metsző terület",
    "featureCSVLengthText": "Metsző hossz",
    "errorInFetchingPrintTask": "Hiba történt a nyomtatási feladat információinak lekérésekor. Próbálja meg újra.",
    "selectAllLabel": "Összes kijelölése",
    "errorInLoadingProjectionModule": "Hiba történt a vetületmodul függőségeinek betöltése közben… Próbálkozzon a fájl újbóli letöltésével.",
    "expandCollapseIconLabel": "Metszett vektoros elemek",
    "intersectedFeatureLabel": "Metszett vektoroselem-adatok",
    "valueAriaLabel": "Érték",
    "countAriaLabel": "Darabszám"
  }
});