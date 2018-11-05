///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
  "_widgetLabel": "Parcellaszerkesztő",
  "newTraverseButtonLabel": "Új sokszögelés indítása",
  "invalidConfigMsg": "Érvénytelen konfiguráció",
  "geometryServiceURLNotFoundMSG": "Nem sikerült meghatározni a geometriai adatszolgáltatás URL-címét",
  "editTraverseButtonLabel": "Sokszögelés szerkesztése",
  "mapTooltipForStartNewTraverse": "A kezdéshez jelöljön ki egy pontot a térképen vagy lent írja be az értéket",
  "mapTooltipForEditNewTraverse": "Jelöljön ki egy szerkeszteni kívánt parcellát",
  "mapTooltipForUpdateStartPoint": "Kattintson a kezdőpont frissítéséhez",
  "mapTooltipForScreenDigitization": "Kattintson egy parcellapont hozzáadásához",
  "mapTooltipForUpdatingRotaionPoint": "Kattintson az elforgatási pont frissítéséhez",
  "mapTooltipForRotate": "Húzza a forgatáshoz",
  "mapTooltipForScale": "Húzza a méretezéshez",
  "backButtonTooltip": "Vissza",
  "newTraverseTitle": "Új sokszögelés",
  "editTraverseTitle": "Sokszögelés szerkesztése",
  "clearingDataConfirmationMessage": "A változtatások elvesznek. Biztosan folytatja?",
  "unableToFetchParcelMessage": "Nem sikerült beolvasni a parcellát.",
  "unableToFetchParcelLinesMessage": "Nem sikerült beolvasni a parcellavonalakat.",
  "planSettings": {
    "planSettingsTitle": "Beállítások",
    "directionOrAngleTypeLabel": "Irány- vagy szögtípus",
    "directionOrAngleUnitsLabel": "Irány- vagy szögegységek",
    "distanceAndLengthUnitsLabel": "Távolság- és hosszmértékegységek",
    "areaUnitsLabel": "Terület mértékegységek",
    "circularCurveParameters": "Köríves görbék paraméterei",
    "northAzimuth": "Északi azimut",
    "southAzimuth": "Dél azimut",
    "quadrantBearing": "Irányszög kvadránsok szerint",
    "radiusAndChordLength": "Sugár- és húrhossz",
    "radiusAndArcLength": "Sugár- és ívhossz",
    "expandGridTooltipText": "Rács kibontása",
    "collapseGridTooltipText": "Rács bezárása",
    "zoomToLocationTooltipText": "Zoomolás a helyre",
    "onScreenDigitizationTooltipText": "Digitalizálás",
    "updateRotationPointTooltipText": "Elforgatási pont frissítése"
  },
  "traverseSettings": {
    "bearingLabel": "Irányszög",
    "lengthLabel": "Hossz",
    "radiusLabel": "Sugár",
    "noMiscloseCalculated": "Az eltérés nincs kiszámítva",
    "traverseMiscloseBearing": "Eltérési irányszög",
    "traverseAccuracy": "Pontosság",
    "accuracyHigh": "Magas",
    "traverseDistance": "Eltérés távolsága",
    "traverseMiscloseRatio": "Eltérési arány",
    "traverseStatedArea": "Rögzített terület",
    "traverseCalculatedArea": "Számított terület",
    "addButtonTitle": "Hozzáadás",
    "deleteButtonTitle": "Eltávolítás"
  },
  "parcelTools": {
    "rotationToolLabel": "Szög",
    "scaleToolLabel": "Méretarány"
  },
  "newTraverse": {
    "invalidBearingMessage": "Érvénytelen irányszög.",
    "invalidLengthMessage": "Érvénytelen hossz.",
    "invalidRadiusMessage": "Érvénytelen sugár.",
    "negativeLengthMessage": "Csak görbékre érvényes",
    "enterValidValuesMessage": "Adjon meg érvényes értékeket.",
    "enterValidParcelInfoMessage": "Adjon meg érvényes parcellaadatokat a mentéshez.",
    "unableToDrawLineMessage": "Nem sikerült a vonal megrajzolása.",
    "invalidEndPointMessage": "Érvénytelen végpont, a vonal nem rajzolható meg."
  },
  "planInfo": {
    "requiredText": "(kötelező)",
    "optionalText": "(opcionális)",
    "parcelNamePlaceholderText": "Parcella neve",
    "parcelDocumentTypeText": "Dokumentumtípus",
    "planNamePlaceholderText": "Terv neve",
    "cancelButtonLabel": "Mégse",
    "saveButtonLabel": "Mentés",
    "saveNonClosedParcelConfirmationMessage": "A megadott parcella nincs lezárva. Ennek ellenére folytatja úgy, hogy csak a parcellavonalakat menti?",
    "unableToCreatePolygonParcel": "Nem sikerült létrehozni a parcella polygonját.",
    "unableToSavePolygonParcel": "Nem sikerült menteni a parcella polygonját.",
    "unableToSaveParcelLines": "Nem sikerült menteni a parcella vonalait.",
    "unableToUpdateParcelLines": "Nem sikerült frissíteni a parcella vonalait.",
    "parcelSavedSuccessMessage": "Parcella sikeresen mentve.",
    "parcelDeletedSuccessMessage": "Telek sikeresen törölve.",
    "parcelDeleteErrorMessage": "Hiba történt a telek törlésekor.",
    "enterValidParcelNameMessage": "Adjon meg érvényes nevet a parcellához.",
    "enterValidPlanNameMessage": "Adjon meg érvényes nevet a tervhez.",
    "enterValidDocumentTypeMessage": "Érvénytelen dokumentumtípus.",
    "enterValidStatedAreaNameMessage": "Adjon meg érvényes rögzített területet."
  },
  "xyInput": {
    "explanation": "A parcellák rétegének koordináta-rendszerében"
  }
});