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
  "setBtnLabel": "Задати",
  "selectLabel": "Вибрати",
  "selectLayerLabel": "Вибрати шари ділянки",
  "selectLayerHintText": "Підказка: використовуйте кнопку налаштування для вибору полігону ділянки та його пов’язаного лінійного шару",
  "layerSelector": {
    "selectedLayerNotHavingRelatedLayer": "Вибраний полігональний шар не має дійсного пов’язаного шару."
  },
  "parcelLineLayer": {
    "selectLayerLabel": "Виберіть пов’язаний лінійний шар",
    "layerSettingTabLabel": "Шари ділянок",
    "advancedSettingTabLabel": "Розширені налаштування",
    "selectLayerHintText": "Підказка: використовується для зберігання значень COGO у лінійному шарі ділянки",
    "selectFieldLegendLabel": "Виберіть поля для зберігання значень COGO у лінійному шарі ділянки",
    "bearingFieldLabel": "Дирекційний кут",
    "chordLengthFieldLabel": "Довжина хорди",
    "distanceFieldLabel": "Відстань",
    "sequenceIdFieldLabel": "Ідентифікатор послідовності",
    "radiusFieldLabel": "Радіус",
    "foreignKeyFieldLabel": "Зовнішній ключ",
    "arcLengthFieldLabel": "Довжина дуги",
    "lineTypeFieldLabel": "Тип лінії",
    "parcelPointSymbolLabel": "Точковий символ ділянки",
    "parcelPointSymbolHintText": "Підказка: використовується для відображення точкового символу для джерела лінії.",
    "startOrRotationSymbolLabel": "Точковий символ початку та обертання",
    "startOrRotationSymbolHintText": "Підказка: використовується для відображення точкового символу початку та обертання.",
    "symbolPickerPreviewText": "Попередній перегляд",
    "selectLineLayerLabel": "Виберіть лінійний шар"
  },
  "parcelPolygonLayer": {
    "selectPolygonLayerLabel": "Виберіть полігональний шар",
    "selectPolygonLayerHintText": "Підказка: використовується для вибору полігонального шару ділянки",
    "selectFieldLegendLabel": "Виберіть поля для зберігання полігональних атрибутів ділянки",
    "parcelNameLabel": "Назва ділянки",
    "rotationLabel": "Обертання",
    "planNameLabel": "Назва плану",
    "scalingLabel": "Масштабування",
    "documentTypeLabel": "Тип документу",
    "miscloseRatioLabel": "Коефіцієнт нев’язки",
    "statedAreaLabel": "Вказана площа",
    "miscloseDistanceLabel": "Відстань нев’язки",
    "selectPolygonLayerLabelPopUp": "Виберіть полігональний шар"
  },
  "lineTypesTable": {
    "lineTypeLabel": "Тип лінії",
    "valueLabel": "Значення",
    "symbolLabel": "Символ",
    "connectionLineLabel": "Лінія сполучення",
    "boundaryLineLabel": "Лінія кордону"
  },
  "closureSetting": {
    "snappingLayerLabel": "Шари замикання",
    "snappingBtnLabel": "Задати",
    "snappingLayerHintText": "Підказка: виберіть шари, на які будуть замикатися лінії ділянки.",
    "miscloseDistanceLabel": "Відстань нев’язки",
    "miscloseDistanceHintText": "Підказка: задається відстань нев’язки та її одиниці.",
    "miscloseRatioLabel": "Коефіцієнт нев’язки",
    "miscloseRatioHintText": "Підказка: задається коефіцієнт нев’язки.",
    "snappingToleranceLabel": "Допуск замикання",
    "pixelLabel": "Пікселі",
    "snappingToleranceHintText": "Підказка: задається допуск замикання.",
    "selectLayerLabel": "Виберіть шар"
  },
  "errorMsg": {
    "bearingFieldErrMsg": "Недійсне поле дирекційного кута",
    "chordLengthErrMsg": "Недійсна довжина хорди",
    "distanceFieldErrMsg": "Недійсна відстань",
    "sequenceIdFieldErrMsg": "Недійсний ідентифікатор послідовності",
    "radiusFieldErrMsg": "Недійсний радіус",
    "foreignKeyFieldErrMsg": "Недійсний зовнішній ключ",
    "arcLengthFieldErrMsg": "Недійсна довжина дуги",
    "lineTypeFieldErrMsg": "Недійсний тип лінії",
    "parcelNameFieldErrMsg": "Недійсне поле назви ділянки",
    "planNameFieldErrMsg": "Недійсне поле назви плану",
    "scaleFieldErrMsg": "Недійсне поле масштабу",
    "documentTypeFieldErrMsg": "Недійсне поле типу документу",
    "miscloseRatioFieldErrMsg": "Недійсне поле коефіцієнта нев’язки",
    "statedAreaFieldErrMsg": "Недійсне поле вказаної площі",
    "miscloseDistanceFieldErrMsg": "Недійсне поле відстані нев’язки",
    "globalIdFieldErrMsg": "Вибраний полігональний шар не має дійсного поля «esriFieldTypeGlobalID».",
    "invalidPolylineLayer": "Виберіть дійсний полілінійний шар ділянки",
    "invalidPolygonLayer": "Виберіть дійсний полігональний шар ділянки",
    "invalidMiscloseDistance": "Введіть дійсну відстань нев’язки",
    "invalidSnappingTolerance": "Введіть дійсний допуск замикання",
    "invalidMiscloseRatio": "Введіть дійсний коефіцієнт нев’язки",
    "selectDistinctLineTypes": "Введіть різне значення для кожного типу лінії",
    "invalidConnectionLineType": "Недійсне значення лінії сполучення",
    "invalidBoundaryLineType": "Недійсне значення лінії кордону",
    "selectDistinctPolylineFields": "Виберіть різне поле для кожного значення COGO.",
    "selectDistinctPolygonFields": "Виберіть різне поле для кожного полігонального атрибуту ділянки."
  }
});