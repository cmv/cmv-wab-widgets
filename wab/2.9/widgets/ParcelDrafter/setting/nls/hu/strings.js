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
  "setBtnLabel": "Beállítás",
  "selectLabel": "Kiválasztás",
  "selectLayerLabel": "Válasszon parcellarétegeket",
  "selectLayerHintText": "Tipp: A Beállítás gomb segítségével kiválaszthatja a parcella polygonját és a kapcsolt vonalréteget",
  "layerSelector": {
    "selectedLayerNotHavingRelatedLayer": "A kiválasztott polygonrétegnek nincs érvényes kapcsolt rétege."
  },
  "parcelLineLayer": {
    "selectLayerLabel": "Kapcsolt vonalréteg kiválasztása",
    "layerSettingTabLabel": "Parcellarétegek",
    "advancedSettingTabLabel": "Haladó beállítások",
    "selectLayerHintText": "Tipp: COGO értékek tárolására használható a parcella vonalrétegében",
    "selectFieldLegendLabel": "Válasszon mezőket a COGO értékek tárolásához a parcella vonalrétegében",
    "bearingFieldLabel": "Irányszög",
    "chordLengthFieldLabel": "Húrhossz",
    "distanceFieldLabel": "Távolság",
    "sequenceIdFieldLabel": "Sorozatazonosító",
    "radiusFieldLabel": "Sugár",
    "foreignKeyFieldLabel": "Idegen kulcs",
    "arcLengthFieldLabel": "Ívhossz",
    "lineTypeFieldLabel": "Vonaltípus",
    "parcelPointSymbolLabel": "Parcella pontszimbóluma",
    "parcelPointSymbolHintText": "Tipp: A vonal kiindulópontját jelző szimbólum megjelenítésére szolgál.",
    "startOrRotationSymbolLabel": "Pontszimbólum indítása és elforgatása",
    "startOrRotationSymbolHintText": "Tipp: Pontszimbólumok indításának és elforgatásának megjelenítésére szolgál.",
    "symbolPickerPreviewText": "Előnézet",
    "selectLineLayerLabel": "Vonalréteg kiválasztása"
  },
  "parcelPolygonLayer": {
    "selectPolygonLayerLabel": "Polygonréteg kiválasztása",
    "selectPolygonLayerHintText": "Tipp: A parcella polygonrétegének kiválasztására használható",
    "selectFieldLegendLabel": "Válasszon mezőket a parcella polygonattribútumainak tárolásához",
    "parcelNameLabel": "Parcella neve",
    "rotationLabel": "Forgatás",
    "planNameLabel": "Terv neve",
    "scalingLabel": "Skálázás",
    "documentTypeLabel": "Dokumentumtípus",
    "miscloseRatioLabel": "Eltérési arány",
    "statedAreaLabel": "Rögzített terület",
    "miscloseDistanceLabel": "Eltérés távolsága",
    "selectPolygonLayerLabelPopUp": "Válasszon polygonréteget"
  },
  "lineTypesTable": {
    "lineTypeLabel": "Vonaltípus",
    "valueLabel": "Érték",
    "symbolLabel": "Szimbólum",
    "connectionLineLabel": "Összekötő vonal",
    "boundaryLineLabel": "Határvonal"
  },
  "closureSetting": {
    "snappingLayerLabel": "Hozzáillesztő rétegek",
    "snappingBtnLabel": "Beállítás",
    "snappingLayerHintText": "Tipp: Válassza ki azokat a rétegeket, amelyekhez a parcella vonalai hozzáilleszkednek.",
    "miscloseDistanceLabel": "Eltérés távolsága",
    "miscloseDistanceHintText": "Tipp: Adja meg az eltérés távolságát és mértékegységeit.",
    "miscloseRatioLabel": "Eltérési arány",
    "miscloseRatioHintText": "Tipp: Adja meg az eltérési arányt.",
    "snappingToleranceLabel": "Hozzáillesztési tolerancia",
    "pixelLabel": "Pixel",
    "snappingToleranceHintText": "Tipp: Adja meg a hozzáillesztési toleranciát.",
    "selectLayerLabel": "Réteg kiválasztása"
  },
  "errorMsg": {
    "bearingFieldErrMsg": "Érvénytelen irányszög mező",
    "chordLengthErrMsg": "Érvénytelen húrhossz",
    "distanceFieldErrMsg": "Érvénytelen távolság",
    "sequenceIdFieldErrMsg": "Érvénytelen sorozatazonosító",
    "radiusFieldErrMsg": "Érvénytelen sugár",
    "foreignKeyFieldErrMsg": "Érvénytelen idegen kulcs",
    "arcLengthFieldErrMsg": "Érvénytelen ívhossz",
    "lineTypeFieldErrMsg": "Érvénytelen vonaltípus",
    "parcelNameFieldErrMsg": "Érvénytelen parcellanév mező",
    "planNameFieldErrMsg": "Érvénytelen tervnév mező",
    "scaleFieldErrMsg": "Érvénytelen méretarány mező",
    "documentTypeFieldErrMsg": "Érvénytelen dokumentumtípus mező",
    "miscloseRatioFieldErrMsg": "Érvénytelen eltérési arány mező",
    "statedAreaFieldErrMsg": "Érvénytelen rögzített terület mező",
    "miscloseDistanceFieldErrMsg": "Érvénytelen eltérési távolság mező",
    "globalIdFieldErrMsg": "A kiválasztott polygonréteg nem rendelkezik érvényes „esriFieldTypeGlobalID” mezővel.",
    "invalidPolylineLayer": "Válasszon érvényes polyline réteget a parcellához",
    "invalidPolygonLayer": "Válasszon érvényes polygonréteget a parcellához",
    "invalidMiscloseDistance": "Adjon meg érvényes eltérési távolságot",
    "invalidSnappingTolerance": "Adjon meg érvényes hozzáillesztési toleranciát",
    "invalidMiscloseRatio": "Adjon meg érvényes eltérési arányt",
    "selectDistinctLineTypes": "Válasszon egyedi értéket minden vonaltípushoz",
    "invalidConnectionLineType": "Az összekötő vonal értéke érvénytelen",
    "invalidBoundaryLineType": "A határvonal értéke érvénytelen",
    "selectDistinctPolylineFields": "Válasszon egyedi mezőt minden COGO értékhez.",
    "selectDistinctPolygonFields": "Válasszon egyedi mezőt minden parcellapolygon-attribútumhoz."
  }
});