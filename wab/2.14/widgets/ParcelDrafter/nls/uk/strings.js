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
  "_widgetLabel": "Розробник ділянки",
  "newTraverseButtonLabel": "Почати новий теодолітний хід",
  "invalidConfigMsg": "Недійсна конфігурація",
  "geometryServiceURLNotFoundMSG": "Неможливо отримати URL сервісу геометрії",
  "editTraverseButtonLabel": "Редагувати теодолітний хід",
  "mapTooltipForStartNewTraverse": "Виберіть точку на карті або введіть нижче, щоб розпочати",
  "mapTooltipForEditNewTraverse": "Виберіть ділянку для редагування",
  "mapTooltipForUpdateStartPoint": "Клацніть, щоб оновити початкову точку",
  "mapTooltipForScreenDigitization": "Клацніть, щоб додати точку ділянки",
  "mapTooltipForUpdatingRotaionPoint": "Клацніть, щоб оновити точку обертання",
  "mapTooltipForRotate": "Перетягніть для обертання",
  "mapTooltipForScale": "Перетягніть для масштабування",
  "backButtonTooltip": "Назад",
  "newTraverseTitle": "Новий теодолітний хід",
  "editTraverseTitle": "Редагувати теодолітний хід",
  "clearingDataConfirmationMessage": "Зміни не будуть збережені, продовжити?",
  "unableToFetchParcelMessage": "Неможливо виконати вибірку ділянки.",
  "unableToFetchParcelLinesMessage": "Неможливо виконати вибірку ліній ділянки.",
  "planSettings": {
    "planSettingsTitle": "Налаштування",
    "directionOrAngleTypeLabel": "Напрямок або тип кута",
    "directionOrAngleUnitsLabel": "Напрямок або одиниці кута",
    "distanceAndLengthUnitsLabel": "Одиниці відстані та довжини",
    "areaUnitsLabel": "Одиниці площі",
    "circularCurveParameters": "Параметри дуги кола",
    "northAzimuth": "Північний азимут",
    "southAzimuth": "Південний азимут",
    "quadrantBearing": "Дирекційний кут квадранта",
    "radiusAndChordLength": "Довжина радіусу та хорди",
    "radiusAndArcLength": "Довжина радіусу та дуги",
    "expandGridTooltipText": "Розгорнути сітку",
    "collapseGridTooltipText": "Згорнути сітку",
    "zoomToLocationTooltipText": "Масштабувати до місця розташування",
    "onScreenDigitizationTooltipText": "Оцифрувати",
    "updateRotationPointTooltipText": "Оновити точку обертання"
  },
  "traverseSettings": {
    "bearingLabel": "Дирекційний кут",
    "lengthLabel": "Довжина",
    "radiusLabel": "Радіус",
    "noMiscloseCalculated": "Нев’язку не розраховано",
    "traverseMiscloseBearing": "Дирекційний кут нев’язки",
    "traverseAccuracy": "Точність",
    "accuracyHigh": "Висока",
    "traverseDistance": "Відстань нев’язки",
    "traverseMiscloseRatio": "Коефіцієнт нев’язки",
    "traverseStatedArea": "Вказана площа",
    "traverseCalculatedArea": "Розрахована площа",
    "addButtonTitle": "Додати",
    "deleteButtonTitle": "Вилучити"
  },
  "parcelTools": {
    "rotationToolLabel": "Кут",
    "scaleToolLabel": "Масштаб"
  },
  "newTraverse": {
    "invalidBearingMessage": "Недійсний дирекційний кут.",
    "invalidLengthMessage": "Недійсна довжина.",
    "invalidRadiusMessage": "Недійсний радіус.",
    "negativeLengthMessage": "Дійсно тільки для дуг",
    "enterValidValuesMessage": "Введіть дійсні значення.",
    "enterValidParcelInfoMessage": "Введіть дійсну інформацію про ділянку для збереження.",
    "unableToDrawLineMessage": "Неможливо намалювати лінію.",
    "invalidEndPointMessage": "Недійсна кінцева точка, неможливо намалювати лінію.",
    "lineTypeLabel": "Тип лінії"
  },
  "planInfo": {
    "requiredText": "(потрібно)",
    "optionalText": "(необов’язково)",
    "parcelNamePlaceholderText": "Назва ділянки",
    "parcelDocumentTypeText": "Тип документу",
    "planNamePlaceholderText": "Назва плану",
    "cancelButtonLabel": "Скасувати",
    "saveButtonLabel": "Зберегти",
    "saveNonClosedParcelConfirmationMessage": "Введену ділянку не закрито, бажаєте продовжити та зберегти тільки лінії ділянки?",
    "unableToCreatePolygonParcel": "Неможливо створити полігон ділянки.",
    "unableToSavePolygonParcel": "Неможливо зберегти полігон ділянки.",
    "unableToSaveParcelLines": "Неможливо зберегти лінії ділянки.",
    "unableToUpdateParcelLines": "Неможливо оновити лінії ділянки.",
    "parcelSavedSuccessMessage": "Ділянку успішно збережено.",
    "parcelDeletedSuccessMessage": "Ділянку успішно видалено.",
    "parcelDeleteErrorMessage": "Помилка при визначенні ділянки.",
    "enterValidParcelNameMessage": "Введіть дійсну назву ділянки.",
    "enterValidPlanNameMessage": "Введіть дійсну назву плану.",
    "enterValidDocumentTypeMessage": "Недійсний тип документу.",
    "enterValidStatedAreaNameMessage": "Введіть дійсну вказану площу."
  },
  "xyInput": {
    "explanation": "Введіть координати у тій самій просторовій прив’язці, що й у шарі"
  }
});