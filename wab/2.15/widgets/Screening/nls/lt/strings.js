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
  "_widgetLabel": "Tikrinimas",
  "geometryServicesNotFound": "Geometrijos paslauga negalima.",
  "unableToDrawBuffer": "Buferio sukurti nepavyko. Bandykite dar kartą.",
  "invalidConfiguration": "Neleidžiama konfigūracija.",
  "clearAOIButtonLabel": "Iš naujo",
  "noGraphicsShapefile": "Įkeltame Shape faile nėra grafikos.",
  "zoomToLocationTooltipText": "Pritraukti vietą",
  "noGraphicsToZoomMessage": "Nerasta grafinių elementų, skirtų pritraukti.",
  "placenameWidget": {
    "placenameLabel": "Ieškoti vietos"
  },
  "drawToolWidget": {
    "useDrawToolForAOILabel": "Pasirinkti piešimo režimą",
    "toggleSelectability": "Paspauskite norėdami perjungti galimybę žymėti",
    "chooseLayerTitle": "Pasirinkite pasirenkamus sluoksnius",
    "selectAllLayersText": "Žymėti viską",
    "layerSelectionWarningTooltip": "Reikia pasirinkti bent vieną sluoksnį, skirtą kurti AOI",
    "selectToolLabel": "Pasirinkti įrankį"
  },
  "shapefileWidget": {
    "shapefileLabel": "Įkelti zip formato Shape failą",
    "uploadShapefileButtonText": "Įkelti",
    "unableToUploadShapefileMessage": "Negalima įkelti Shape failo."
  },
  "coordinatesWidget": {
    "selectStartPointFromSearchText": "Apibrėžkite pradinį tašką",
    "addButtonTitle": "Pridėti",
    "deleteButtonTitle": "Panaikinti",
    "mapTooltipForStartPoint": "Paspauskite žemėlapį, kad nustatytumėte pradinį tašką",
    "mapTooltipForUpdateStartPoint": "Paspauskite žemėlapį, kad atnaujintumėte pradinį tašką",
    "locateText": "Rasti",
    "locateByMapClickText": "Pasirinkite pradines koordinates",
    "enterBearingAndDistanceLabel": "Įveskite kryptį ir atstumą nuo pradinio taško",
    "bearingTitle": "Kryptis",
    "distanceTitle": "Atstumas",
    "planSettingTooltip": "Plano parametrai",
    "invalidLatLongMessage": "Įveskite leistinas reikšmes."
  },
  "bufferDistanceAndUnit": {
    "bufferInputTitle": "Buferio atstumas (neprivaloma)",
    "bufferInputLabel": "Rodyti rezultatus",
    "bufferDistanceLabel": "Buferio atstumas",
    "bufferUnitLabel": "Buferio vienetas"
  },
  "traverseSettings": {
    "bearingLabel": "Kryptis",
    "lengthLabel": "Ilgis",
    "addButtonTitle": "Pridėti",
    "deleteButtonTitle": "Panaikinti",
    "deleteBearingAndLengthLabel": "Pašalinti azimuto ir ilgio eilutę",
    "addButtonLabel": "Pridėti azimutą ir ilgį"
  },
  "planSettings": {
    "expandGridTooltipText": "Išplėsti tinklelį",
    "collapseGridTooltipText": "Sutraukti tinklelį",
    "directionUnitLabelText": "Krypčių vienetas",
    "distanceUnitLabelText": "Atstumas ir ilgio vienetai",
    "planSettingsComingSoonText": "Jau greitai"
  },
  "newTraverse": {
    "invalidBearingMessage": "Neleistina kryptis.",
    "invalidLengthMessage": "Neleistinas ilgis.",
    "negativeLengthMessage": "Neigiamas ilgis"
  },
  "reportsTab": {
    "aoiAreaText": "AOI sritis",
    "downloadButtonTooltip": "Atsisiųsti",
    "printButtonTooltip": "Spausdinti",
    "uploadShapefileForAnalysisText": "Įkelti Shape failą, kad jis būtų įtrauktas į analizę",
    "uploadShapefileForButtonText": "Parinkti",
    "downloadLabelText": "Pasirinkti formatą:",
    "downloadBtnText": "Atsisiųsti",
    "noDetailsAvailableText": "Nieko nerasta",
    "featureCountText": "Skaičius",
    "featureAreaText": "Plotas",
    "featureLengthText": "Ilgis",
    "attributeChooserTooltip": "Pasirinkite rodytinus atributus",
    "csv": "CSV",
    "filegdb": "Failinė geoduomenų bazė",
    "shapefile": "Shape failas",
    "noFeaturesFound": "Nerasta pasirinkto failo formato rezultato",
    "selectReportFieldTitle": "Pasirinkti laukus",
    "noFieldsSelected": "Nėra pasirinktų laukų",
    "intersectingFeatureExceedsMsgOnCompletion": "Viename arba keliuose sluoksniuose pasiektas maksimalus įrašų skaičius.",
    "unableToAnalyzeText": "Negalima analizuoti, pasiektas maksimalus įrašų skaičius.",
    "errorInPrintingReport": "Nepavyksta atspausdinti ataskaitos. Patikrinkite, ar leistini ataskaitos parametrai.",
    "aoiInformationTitle": "Dominančio ploto (AOI) informacija",
    "summaryReportTitle": "Suvestinė",
    "notApplicableText": "Netaikoma",
    "downloadReportConfirmTitle": "Patvirtinti atsisiuntimą",
    "downloadReportConfirmMessage": "Ar jūs įsitikinę, kad norite atsisiųsti?",
    "noDataText": "Nėra duomenų",
    "createReplicaFailedMessage": "Nepavyko šių sluoksnių atsisiuntimo operacija: <br/> ${layerNames}",
    "extractDataTaskFailedMessage": "Atsisiuntimo operacija nepavyko.",
    "printLayoutLabelText": "Maketas",
    "printBtnText": "Spausdinti",
    "printDialogHint": "Pastaba: ataskaitos pavadinimą ir komentarus galima reaguoti ataskaitos peržiūroje.",
    "unableToDownloadFileGDBText": "Negalima atsisiųsti AOI, kuriame yra taško arba linijos padėtys, failinės geoduomenų bazės",
    "unableToDownloadShapefileText": "Negalima atsisiųsti AOI, kuriame yra taško arba linijos padėtys, Shape failo",
    "analysisAreaUnitLabelText": "Rodyti teritorijos rezultatus šiais vienetais:",
    "analysisLengthUnitLabelText": "Rodyti ilgio rezultatus šiais vienetais:",
    "analysisUnitButtonTooltip": "Pasirinkti analizės vienetus",
    "analysisCloseBtnText": "Užverti",
    "areaSquareFeetUnit": "Kvadratinės pėdos",
    "areaAcresUnit": "Akrai",
    "areaSquareMetersUnit": "Kvadratiniai metrai",
    "areaSquareKilometersUnit": "Kvadratiniai kilometrai",
    "areaHectaresUnit": "Hektarai",
    "areaSquareMilesUnit": "Kvadratinės mylios",
    "lengthFeetUnit": "Pėdos",
    "lengthMilesUnit": "Mylios",
    "lengthMetersUnit": "Metrai",
    "lengthKilometersUnit": "Kilometrai",
    "hectaresAbbr": "hektarai",
    "squareMilesAbbr": "Kvadratinės mylios",
    "layerNotVisibleText": "Negalima analizuoti. Sluoksnis išjungtas arba už mastelio matomumo intervalo.",
    "refreshBtnTooltip": "Atnaujinti ataskaitą",
    "featureCSVAreaText": "Susikertantis plotas",
    "featureCSVLengthText": "Susikertantis ilgis",
    "errorInFetchingPrintTask": "Gaunant spausdinimo užduoties informaciją įvyko klaida. Bandykite dar kartą.",
    "selectAllLabel": "Žymėti viską",
    "errorInLoadingProjectionModule": "Įkeliant projekcijos modulio priklausančius elementus įvyko klaida. Bandykite atsisiųsti failą dar kartą.",
    "expandCollapseIconLabel": "Susikertantys elementai",
    "intersectedFeatureLabel": "Susikertančio elemento išsami informacija",
    "valueAriaLabel": "Reikšmė",
    "countAriaLabel": "Skaičius"
  }
});