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
  "_widgetLabel": "Screening",
  "geometryServicesNotFound": "Serviciul de geometrie nu este disponibil.",
  "unableToDrawBuffer": "Nu s-a putut delimita zona tampon. Vă rugăm să încercaţi din nou.",
  "invalidConfiguration": "Configuraţie nevalidă.",
  "clearAOIButtonLabel": "Pornire de la început",
  "noGraphicsShapefile": "Fişierul shapefile încărcat nu conţine grafice.",
  "zoomToLocationTooltipText": "Zoom la locaţie",
  "noGraphicsToZoomMessage": "Grafică negăsită pentru mărire.",
  "placenameWidget": {
    "placenameLabel": "Căutare locaţie"
  },
  "drawToolWidget": {
    "useDrawToolForAOILabel": "Selectaţi modul de trasare",
    "toggleSelectability": "Faceţi clic pentru a comuta posibilitatea de selectare",
    "chooseLayerTitle": "Alegeți straturile tematice selectabile",
    "selectAllLayersText": "Selectare toate",
    "layerSelectionWarningTooltip": "Trebuie selectat cel puţin un strat tematic pentru crearea AOI",
    "selectToolLabel": "Selectare instrument"
  },
  "shapefileWidget": {
    "shapefileLabel": "Încărcare fişier shapefile arhivat",
    "uploadShapefileButtonText": "Încărcare",
    "unableToUploadShapefileMessage": "Imposibil de încărcat un fișier shapefile."
  },
  "coordinatesWidget": {
    "selectStartPointFromSearchText": "Definiţi un punct de început",
    "addButtonTitle": "Adăugare",
    "deleteButtonTitle": "Eliminare",
    "mapTooltipForStartPoint": "Faceţi clic pe hartă pentru a defini un punct de început",
    "mapTooltipForUpdateStartPoint": "Faceţi clic pe hartă pentru a actualiza punctul de început",
    "locateText": "Localizare",
    "locateByMapClickText": "Selectaţi coordonatele iniţiale",
    "enterBearingAndDistanceLabel": "Introduceţi azimutul şi distanţa de la punctul de început",
    "bearingTitle": "Azimut",
    "distanceTitle": "Distanţă",
    "planSettingTooltip": "Setări plan",
    "invalidLatLongMessage": "Introduceţi valori valide."
  },
  "bufferDistanceAndUnit": {
    "bufferInputTitle": "Distanţă buffer (opţional)",
    "bufferInputLabel": "Afişare rezultate din",
    "bufferDistanceLabel": "Distanță buffer",
    "bufferUnitLabel": "Unitate buffer"
  },
  "traverseSettings": {
    "bearingLabel": "Azimut",
    "lengthLabel": "Lungime",
    "addButtonTitle": "Adăugare",
    "deleteButtonTitle": "Eliminare",
    "deleteBearingAndLengthLabel": "Eliminare rând pentru relevment și lungime",
    "addButtonLabel": "Adăugare relevment și lungime"
  },
  "planSettings": {
    "expandGridTooltipText": "Extindere grilă",
    "collapseGridTooltipText": "Restrângere grilă",
    "directionUnitLabelText": "Unitate direcţii",
    "distanceUnitLabelText": "Unităţi distanţă şi lungime",
    "planSettingsComingSoonText": "În curând"
  },
  "newTraverse": {
    "invalidBearingMessage": "Azimut nevalid.",
    "invalidLengthMessage": "Lungime nevalidă.",
    "negativeLengthMessage": "Lungime negativă"
  },
  "reportsTab": {
    "aoiAreaText": "Suprafaţă AOI",
    "downloadButtonTooltip": "Descărcare",
    "printButtonTooltip": "Imprimare",
    "uploadShapefileForAnalysisText": "Încărcați un fișier shapefile pentru a fi inclus în analiză",
    "uploadShapefileForButtonText": "Răsfoire",
    "downloadLabelText": "Selectare format:",
    "downloadBtnText": "Descărcare",
    "noDetailsAvailableText": "Nu a fost găsit niciun rezultat",
    "featureCountText": "Cont",
    "featureAreaText": "Suprafaţă",
    "featureLengthText": "Lungime",
    "attributeChooserTooltip": "Alegeţi atributele de afişat",
    "csv": "CSV",
    "filegdb": "FGDB",
    "shapefile": "Shapefile",
    "noFeaturesFound": "Nu a fost găsit niciun rezultat pentru formatul de fişier selectat",
    "selectReportFieldTitle": "Selectare câmpuri",
    "noFieldsSelected": "Niciun câmp selectat",
    "intersectingFeatureExceedsMsgOnCompletion": "Numărul maxim de înregistrări a fost atins pentru unul sau mai multe straturi tematice.",
    "unableToAnalyzeText": "Imposibil de analizat, a fost atins numărul maxim de înregistrări.",
    "errorInPrintingReport": "Imposibil de imprimat raportul. Verificaţi dacă setările pentru raport sunt valide.",
    "aoiInformationTitle": "Informaţii despre Zona de interes (AOI)",
    "summaryReportTitle": "Rezumat",
    "notApplicableText": "N/A",
    "downloadReportConfirmTitle": "Confirmare descărcare",
    "downloadReportConfirmMessage": "Sigur doriţi să descărcaţi?",
    "noDataText": "Nicio dată",
    "createReplicaFailedMessage": "Operaţia de descărcare a eşuat pentru următoarele straturi tematice: <br/> ${layerNames}",
    "extractDataTaskFailedMessage": "Operaţia de descărcare a eşuat.",
    "printLayoutLabelText": "Configuraţie",
    "printBtnText": "Imprimare",
    "printDialogHint": "Notă: Titlul raportului şi comentariile pot fi editate în examinarea raportului.",
    "unableToDownloadFileGDBText": "Baza de date geografice cu fișiere nu poate fi descărcată pentru AOI ce conține locații cu puncte sau linii",
    "unableToDownloadShapefileText": "Fişierul shapefile nu poate fi descărcat pentru AOI ce conţine locaţii cu puncte sau linii",
    "analysisAreaUnitLabelText": "Afișare rezultate privind zona în:",
    "analysisLengthUnitLabelText": "Afișare rezultate privind lungimea în:",
    "analysisUnitButtonTooltip": "Alegeţi unităţile pentru analiză",
    "analysisCloseBtnText": "Închidere",
    "areaSquareFeetUnit": "Ft pătrați",
    "areaAcresUnit": "Acri",
    "areaSquareMetersUnit": "Metri pătrați",
    "areaSquareKilometersUnit": "Kilometri pătrați",
    "areaHectaresUnit": "Hectare",
    "areaSquareMilesUnit": "Mile pătrate",
    "lengthFeetUnit": "Picioare",
    "lengthMilesUnit": "Mile",
    "lengthMetersUnit": "Metri",
    "lengthKilometersUnit": "Kilometri",
    "hectaresAbbr": "hectare",
    "squareMilesAbbr": "Mile pătrate",
    "layerNotVisibleText": "Imposibil de analizat. Stratul tematic este dezactivat sau se află în afara intervalului de vizibilitate al scalei.",
    "refreshBtnTooltip": "Reîmprospătare raport",
    "featureCSVAreaText": "Zonă de intersectare",
    "featureCSVLengthText": "Lungime de intersectare",
    "errorInFetchingPrintTask": "Eroare la preluarea informațiilor despre sarcina de imprimare. Încercați din nou.",
    "selectAllLabel": "Selectare toate",
    "errorInLoadingProjectionModule": "Eroare la încărcare dependențe modul proiectare. Încercați să descărcați din nou fișierul.",
    "expandCollapseIconLabel": "Obiecte spațiale intersectate",
    "intersectedFeatureLabel": "Detalii obiecte spațiale care se intersectează",
    "valueAriaLabel": "Valoare",
    "countAriaLabel": "Număr"
  }
});