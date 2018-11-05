///////////////////////////////////////////////////////////////////////////
// Copyright © 2017 Esri. All Rights Reserved.
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
  "_widgetLabel": "Költségelemzés",
  "unableToFetchInfoErrMessage": "Nem sikerült lekérni a geometriai adatszolgáltatás/konfigurált réteg részleteit",
  "invalidCostingGeometryLayer": "Nem sikerült beolvasni az „esriFieldTypeGlobalID” értékét a költségszámítási geometriarétegben.",
  "projectLayerNotFound": "Nem sikerült megtalálni a konfigurált projektréteget a térképen.",
  "costingGeometryLayerNotFound": "Nem sikerült megtalálni a konfigurált költségszámítási geometriaréteget a térképen.",
  "projectMultiplierTableNotFound": "Nem sikerült megtalálni a projektszorzó kiegészítő költségek táblázatát a térképen.",
  "projectAssetTableNotFound": "Nem sikerült megtalálni a konfigurált projekteszköz-táblázatot a térképen.",
  "createLoadProject": {
    "createProjectPaneTitle": "Projekt létrehozása",
    "loadProjectPaneTitle": "Projekt betöltése",
    "projectNamePlaceHolder": "Projektnév",
    "projectDescPlaceHolder": "Projektleírás",
    "selectProject": "Projekt kiválasztása",
    "viewInMapLabel": "Megtekintés a térképen",
    "loadLabel": "Betöltés",
    "createLabel": "Létrehozás",
    "deleteProjectConfirmationMsg": "Biztosan törli a projektet?",
    "noAssetsToViewOnMap": "A kiválasztott projektnek nincsenek a térképen megjeleníthető eszközei.",
    "projectDeletedMsg": "A projekt sikeresen törölve.",
    "errorInCreatingProject": "Hiba történt a projekt létrehozásakor.",
    "errorProjectNotFound": "A projekt nem található.",
    "errorInLoadingProject": "Ellenőrizze, hogy érvényes projekt van-e kiválasztva.",
    "errorProjectNotSelected": "Válasszon ki egy projektet a lenyíló listából",
    "errorDuplicateProjectName": "A projektnév már létezik."
  },
  "statisticsSettings": {
    "tabTitle": "Statisztikai beállítások",
    "addStatisticsLabel": "Statisztika hozzáadása",
    "addNewStatisticsText": "Új statisztika hozzáadása",
    "deleteStatisticsText": "Statisztika törlése",
    "moveStatisticsUpText": "Statisztika mozgatása feljebb",
    "moveStatisticsDownText": "Statisztika mozgatása lejjebb",
    "layerNameTitle": "Réteg",
    "statisticsTypeTitle": "Típus",
    "fieldNameTitle": "Mező",
    "statisticsTitle": "Felirat",
    "actionLabelTitle": "Műveletek",
    "selectDeselectAllTitle": "Összes kiválasztása"
  },
  "statisticsType": {
    "countLabel": "Szám",
    "averageLabel": "Átlag",
    "maxLabel": "Maximum",
    "minLabel": "Minimum",
    "summationLabel": "Összegzés",
    "areaLabel": "Terület",
    "lengthLabel": "Hossz"
  },
  "costingInfo": {
    "noEditableLayersAvailable": "A réteg(ek)et szerkeszthetőként kell beállítani a rétegbeállítások fülön"
  },
  "workBench": {
    "refresh": "Frissítés",
    "noAssetAddedMsg": "Nincsenek eszközök hozzáadva",
    "units": "mértékegységek",
    "assetDetailsTitle": "Eszközelem részletei",
    "costEquationTitle": "Költségképlet",
    "newCostEquationTitle": "Új képlet",
    "defaultCostEquationTitle": "Alapértelmezett képlet",
    "geographyTitle": "Földrajzi terület",
    "scenarioTitle": "Forgatókönyv",
    "costingInfoHintText": "<div>Tipp: Használja a következő kulcsszavakat</div><ul><li><b>{TOTALCOUNT}</b>: Azonos típusú eszközök teljes számának használata egy földrajzi területen</li> <li><b>{MEASURE}</b>: A vonal típusú eszköz hosszának és a polygon típusú eszköz területének használata</li><li><b>{TOTALMEASURE}</b>: Az azonos kategóriájú vonal típusú eszközök teljes hosszának és a polygon típusú eszközök teljes területének használata egy földrajzi területen</li></ul> Különféle funkciókat használhat, például:<ul><li>Math.abs(-100)</li><li>Math.floor({TOTALMEASURE})</li></ul>Szerkessze a költségképletet a projekt igényei szerint.",
    "zoomToAsset": "Zoomolás az eszközre",
    "deleteAsset": "Eszköz törlése",
    "closeDialog": "Párbeszédpanel bezárása",
    "objectIdColTitle": "Objektumazonosító",
    "costColTitle": "Költség",
    "errorInvalidCostEquation": "Érvénytelen költségképlet.",
    "errorInSavingAssetDetails": "Az eszközadatok mentése nem sikerült.",
    "featureModeText": "Vektoros elem mód",
    "sketchToolTitle": "Vázlat",
    "selectToolTitle": "Kiválasztás"
  },
  "assetDetails": {
    "inGeography": " ebben: ${geography} ",
    "withScenario": " ezzel: ${scenario}",
    "totalCostTitle": "Összköltség",
    "additionalCostLabel": "Leírás",
    "additionalCostValue": "Érték",
    "additionalCostNetValue": "Nettó érték"
  },
  "projectOverview": {
    "assetItemsTitle": "Eszközelemek",
    "assetStatisticsTitle": "Eszközstatisztika",
    "projectSummaryTitle": "Projekt összefoglalása",
    "projectName": "Projektnév: ${name}",
    "totalCostLabel": "A projekt összköltsége (*):",
    "grossCostLabel": "A projekt bruttó költsége (*):",
    "roundingLabel": "* Kerekítés erre: „${selectedRoundingOption}”",
    "unableToSaveProjectBoundary": "Nem sikerült menteni a projekthatárt a projektrétegben.",
    "unableToSaveProjectCost": "Nem sikerült menteni a költségeket a projektrétegben.",
    "roundCostValues": {
      "twoDecimalPoint": "Két tizedesjegy",
      "nearestWholeNumber": "Legközelebbi egész szám",
      "nearestTen": "Legközelebbi tízes",
      "nearestHundred": "Legközelebbi százas",
      "nearestThousand": "Legközelebbi ezres",
      "nearestTenThousands": "Legközelebbi tízezres"
    }
  },
  "projectAttribute": {
    "projectAttributeText": "Projektattribútum",
    "projectAttributeTitle": "Projektattribútumok szerkesztése"
  },
  "costEscalation": {
    "costEscalationLabel": "További költség hozzáadása",
    "valueHeader": "Érték",
    "addCostEscalationText": "További költség hozzáadása",
    "deleteCostEscalationText": "Kiválasztott további költségek törlése",
    "moveCostEscalationUpText": "Kiválasztott további költségek mozgatása fel",
    "moveCostEscalationDownText": "Kiválasztott további költségek mozgatása le",
    "invalidEntry": "Egy vagy több bejegyzés érvénytelen.",
    "errorInSavingCostEscalation": "A kiegészítő költségadatok mentése nem sikerült."
  },
  "scenarioSelection": {
    "popupTitle": "Válasszon forgatókönyvet az eszközhöz",
    "regionLabel": "Földrajzi terület",
    "scenarioLabel": "Forgatókönyv",
    "noneText": "Nincs",
    "copyFeatureMsg": "Másolja a kiválasztott vektoros elemeket?"
  },
  "detailStatistics": {
    "detailStatisticsLabel": "Részletes statisztika",
    "noDetailStatisticAvailable": "Nincs hozzáadva eszközstatisztika"
  },
  "copyFeatures": {
    "title": "Vektoros elemek másolása",
    "createFeatures": "Vektoros elemek létrehozása",
    "createSingleFeature": "1 többgeometriájú vektoros elem létrehozása",
    "noFeaturesSelectedMessage": "Nincsenek vektoros elemek kijelölve",
    "selectFeatureToCopyMessage": "Válassza ki a másolni kívánt vektoros elemet."
  }
});