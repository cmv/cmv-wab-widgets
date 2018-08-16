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
  "setBtnLabel": "Defineix",
  "selectLabel": "Selecciona",
  "selectLayerLabel": "Seleccioneu capes de parcel·les",
  "selectLayerHintText": "Suggeriment: utilitzeu el botó Defineix per seleccionar el polígon de parcel·la i la capa de línies relacionada",
  "layerSelector": {
    "selectedLayerNotHavingRelatedLayer": "La capa de polígons seleccionada no té una capa relacionada vàlida."
  },
  "parcelLineLayer": {
    "selectLayerLabel": "Seleccioneu la capa de línies relacionada",
    "layerSettingTabLabel": "Capes de parcel·les",
    "advancedSettingTabLabel": "Configuració avançada",
    "selectLayerHintText": "Suggeriment: utilitzeu aquesta opció per emmagatzemar valors COGO a la capa de línies de parcel·les",
    "selectFieldLegendLabel": "Seleccioneu camps per emmagatzemar valors COGO en una capa de línies de parcel·les",
    "bearingFieldLabel": "Rumb",
    "chordLengthFieldLabel": "Longitud de corda",
    "distanceFieldLabel": "Distància",
    "sequenceIdFieldLabel": "ID de seqüència",
    "radiusFieldLabel": "Radi",
    "foreignKeyFieldLabel": "Clau externa",
    "arcLengthFieldLabel": "Longitud d'arc",
    "lineTypeFieldLabel": "Tipus de línia",
    "parcelPointSymbolLabel": "Símbol de punt de parcel·la",
    "parcelPointSymbolHintText": "Suggeriment: s'utilitza per visualitzar el símbol de punt per a l'origen de la línia.",
    "startOrRotationSymbolLabel": "Símbol del punt d'inici i rotació",
    "startOrRotationSymbolHintText": "Suggeriment: s'utilitza per mostrar el símbol del punt d'inici i rotació.",
    "symbolPickerPreviewText": "Visualització prèvia",
    "selectLineLayerLabel": "Seleccioneu la capa de línies"
  },
  "parcelPolygonLayer": {
    "selectPolygonLayerLabel": "Seleccioneu la capa de polígon",
    "selectPolygonLayerHintText": "Suggeriment: feu servir la capa de polígons de parcel·les seleccionada",
    "selectFieldLegendLabel": "Seleccioneu els camps per emmagatzemar atributs de polígons de parcel·les",
    "parcelNameLabel": "Nom de la parcel·la",
    "rotationLabel": "Rotació",
    "planNameLabel": "Nom del pla",
    "scalingLabel": "Escalat",
    "documentTypeLabel": "Tipus de document",
    "miscloseRatioLabel": "Relació amb mala convergència",
    "statedAreaLabel": "Àrea assenyalada",
    "miscloseDistanceLabel": "Distància amb mala convergència",
    "selectPolygonLayerLabelPopUp": "Seleccioneu una capa de polígon"
  },
  "lineTypesTable": {
    "lineTypeLabel": "Tipus de línia",
    "valueLabel": "Valor",
    "symbolLabel": "Símbol",
    "connectionLineLabel": "Línia de connexió",
    "boundaryLineLabel": "Línia de límit"
  },
  "closureSetting": {
    "snappingLayerLabel": "Capes d'alineació",
    "snappingBtnLabel": "Defineix",
    "snappingLayerHintText": "Suggeriment: seleccioneu les capes amb les quals s'alinearan les línies de parcel·les.",
    "miscloseDistanceLabel": "Distància amb mala convergència",
    "miscloseDistanceHintText": "Suggeriment: especifiqueu la distància amb mala convergència i les seves unitats.",
    "miscloseRatioLabel": "Relació amb mala convergència",
    "miscloseRatioHintText": "Suggeriment: especifiqueu el radi amb mala convergència.",
    "snappingToleranceLabel": "Tolerància d'alineació",
    "pixelLabel": "Píxels",
    "snappingToleranceHintText": "Suggeriment: especifiqueu la tolerància d'alineació.",
    "selectLayerLabel": "Seleccioneu la capa"
  },
  "errorMsg": {
    "bearingFieldErrMsg": "Camp de rumb no vàlid",
    "chordLengthErrMsg": "ChordLength no vàlid",
    "distanceFieldErrMsg": "Distància no vàlida",
    "sequenceIdFieldErrMsg": "sequenceId no vàlid",
    "radiusFieldErrMsg": "Radi no vàlid",
    "foreignKeyFieldErrMsg": "Clau externa no vàlida",
    "arcLengthFieldErrMsg": "Longitud d'arc no vàlida",
    "lineTypeFieldErrMsg": "Tipus de línia no vàlid",
    "parcelNameFieldErrMsg": "Camp de nom de parcel·la no vàlid",
    "planNameFieldErrMsg": "Camp de nom de pla no vàlid",
    "scaleFieldErrMsg": "Camp d'escala no vàlid",
    "documentTypeFieldErrMsg": "Camp de tipus de document no vàlid",
    "miscloseRatioFieldErrMsg": "Camp de relació amb mala convergència no vàlid",
    "statedAreaFieldErrMsg": "Camp d'àrea assenyalada no vàlid",
    "miscloseDistanceFieldErrMsg": "Camp de distància amb mala convergència no vàlid",
    "globalIdFieldErrMsg": "La capa de polígons seleccionada no té cap camp \"esriFieldTypeGlobalID\" vàlid.",
    "invalidPolylineLayer": "Seleccioneu una capa de polilínies de parcel·les vàlida",
    "invalidPolygonLayer": "Seleccioneu una capa de polígons de parcel·les vàlida",
    "invalidMiscloseDistance": "Introduïu una distància de mala convergència vàlida",
    "invalidSnappingTolerance": "Introduïu una tolerància d'alineació vàlida",
    "invalidMiscloseRatio": "Introduïu una relació de mala convergència vàlida",
    "selectDistinctLineTypes": "Seleccioneu un valor diferent en cada tipus de línia",
    "invalidConnectionLineType": "Valor de línia de connexió no vàlid",
    "invalidBoundaryLineType": "Valor de línia de límit no vàlid",
    "selectDistinctPolylineFields": "Seleccioneu un camp diferent per a cada valor COGO.",
    "selectDistinctPolygonFields": "Seleccioneu un camp diferent per a cada atribut de polígon de parcel·la."
  }
});