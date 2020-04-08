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
  "_widgetLabel": "Скринінг",
  "geometryServicesNotFound": "Сервіс геометрії недоступний.",
  "unableToDrawBuffer": "Неможливо намалювати буфер. Спробуйте знову.",
  "invalidConfiguration": "Недійсна конфігурація.",
  "clearAOIButtonLabel": "Розпочати заново",
  "noGraphicsShapefile": "Переданий шейп-файл не містить графіки.",
  "zoomToLocationTooltipText": "Масштабувати до місця розташування",
  "noGraphicsToZoomMessage": "Не знайдено графіки для збільшення масштабу.",
  "placenameWidget": {
    "placenameLabel": "Пошук місця розташування"
  },
  "drawToolWidget": {
    "useDrawToolForAOILabel": "Вибрати режим малювання",
    "toggleSelectability": "Клацніть для перемикання доступності для вибору",
    "chooseLayerTitle": "Виберіть шари, доступні для вибору",
    "selectAllLayersText": "Вибрати всі",
    "layerSelectionWarningTooltip": "Для створення області інтересу повинен бути вибраний щонайменше один шар",
    "selectToolLabel": "Вибрати інструмент"
  },
  "shapefileWidget": {
    "shapefileLabel": "Передати заархівований шейп-файл",
    "uploadShapefileButtonText": "Передати",
    "unableToUploadShapefileMessage": "Неможливо передати шейп-файл."
  },
  "coordinatesWidget": {
    "selectStartPointFromSearchText": "Визначити початкову точку",
    "addButtonTitle": "Додати",
    "deleteButtonTitle": "Вилучити",
    "mapTooltipForStartPoint": "Клацніть на карті, щоб визначити початкову точку",
    "mapTooltipForUpdateStartPoint": "Клацніть на карті, щоб оновити початкову точку",
    "locateText": "Знайти",
    "locateByMapClickText": "Вибрати початкові координати",
    "enterBearingAndDistanceLabel": "Ввести дирекційний кут та відстань від початкової точки",
    "bearingTitle": "Дирекційний кут",
    "distanceTitle": "Відстань",
    "planSettingTooltip": "Налаштування плану",
    "invalidLatLongMessage": "Введіть дійсні значення."
  },
  "bufferDistanceAndUnit": {
    "bufferInputTitle": "Буферна відстань (необов’язково)",
    "bufferInputLabel": "Показати результати в межах",
    "bufferDistanceLabel": "Буферна відстань",
    "bufferUnitLabel": "Одиниця буфера"
  },
  "traverseSettings": {
    "bearingLabel": "Дирекційний кут",
    "lengthLabel": "Довжина",
    "addButtonTitle": "Додати",
    "deleteButtonTitle": "Вилучити",
    "deleteBearingAndLengthLabel": "Видалити рядок дирекційного кута та довжини",
    "addButtonLabel": "Додати дирекційний кут та довжину"
  },
  "planSettings": {
    "expandGridTooltipText": "Розгорнути сітку",
    "collapseGridTooltipText": "Згорнути сітку",
    "directionUnitLabelText": "Одиниці напрямку",
    "distanceUnitLabelText": "Одиниці відстані та довжини",
    "planSettingsComingSoonText": "Скоро у продажу"
  },
  "newTraverse": {
    "invalidBearingMessage": "Недійсний дирекційний кут.",
    "invalidLengthMessage": "Недійсна довжина.",
    "negativeLengthMessage": "Негативна довжина"
  },
  "reportsTab": {
    "aoiAreaText": "Площа області інтересу",
    "downloadButtonTooltip": "Завантажити",
    "printButtonTooltip": "Друкувати",
    "uploadShapefileForAnalysisText": "Передати шейп-файл для включення в аналіз",
    "uploadShapefileForButtonText": "Переглянути",
    "downloadLabelText": "Вибрати формат:",
    "downloadBtnText": "Завантажити",
    "noDetailsAvailableText": "Результати не знайдено",
    "featureCountText": "Лічильник",
    "featureAreaText": "Область",
    "featureLengthText": "Довжина",
    "attributeChooserTooltip": "Вибрати атрибути для відображення",
    "csv": "CSV",
    "filegdb": "Файлова база геоданих",
    "shapefile": "Шейп-файл",
    "noFeaturesFound": "Результати не знайдено для вибраного формату файлу",
    "selectReportFieldTitle": "Вибрати поля",
    "noFieldsSelected": "Поля не вибрано",
    "intersectingFeatureExceedsMsgOnCompletion": "Було досягнуто максимальну кількість записів для одного або декількох шарів.",
    "unableToAnalyzeText": "Неможливо аналізувати, оскільки було досягнуто максимальну кількість записів.",
    "errorInPrintingReport": "Неможливо роздрукувати звіт. Перевірте правильність налаштувань звіту.",
    "aoiInformationTitle": "Інформація про область інтересу",
    "summaryReportTitle": "Коротка інформація",
    "notApplicableText": "Немає даних",
    "downloadReportConfirmTitle": "Підтвердіть завантаження",
    "downloadReportConfirmMessage": "Бажаєте завантажити?",
    "noDataText": "Немає даних",
    "createReplicaFailedMessage": "Не вдалося виконати операцію завантаження для наступних шарів : <br/> ${layerNames}",
    "extractDataTaskFailedMessage": "Не вдалося виконати операцію завантаження.",
    "printLayoutLabelText": "Компонування",
    "printBtnText": "Друкувати",
    "printDialogHint": "Примітка: заголовок звіту та коментарі можна редагувати у попередньому перегляді звіту.",
    "unableToDownloadFileGDBText": "Файлову базу геоданих неможливо завантажити для області інтересу, яка містить місця розташування точок або ліній",
    "unableToDownloadShapefileText": "Шейп-файл неможливо завантажити для області інтересу, яка містить місця розташування точок або ліній",
    "analysisAreaUnitLabelText": "Показати результати області в :",
    "analysisLengthUnitLabelText": "Показати результати довжини в :",
    "analysisUnitButtonTooltip": "Вибрати одиниці для аналізу",
    "analysisCloseBtnText": "Закрити",
    "areaSquareFeetUnit": "Квадратні фути",
    "areaAcresUnit": "Акри",
    "areaSquareMetersUnit": "Квадратні метри",
    "areaSquareKilometersUnit": "Квадратні кілометри",
    "areaHectaresUnit": "Гектари",
    "areaSquareMilesUnit": "Квадратні милі",
    "lengthFeetUnit": "Фути",
    "lengthMilesUnit": "Милі",
    "lengthMetersUnit": "Метри",
    "lengthKilometersUnit": "Кілометри",
    "hectaresAbbr": "гектари",
    "squareMilesAbbr": "Квадратні милі",
    "layerNotVisibleText": "Неможливо аналізувати. Шар вимкнено або він знаходиться поза діапазоном видимості масштабу.",
    "refreshBtnTooltip": "Оновити звіт",
    "featureCSVAreaText": "Область перетину",
    "featureCSVLengthText": "Довжина перетину",
    "errorInFetchingPrintTask": "Помилка під час вибірки інформації про задачу друку. Спробуйте знову.",
    "selectAllLabel": "Вибрати всі",
    "errorInLoadingProjectionModule": "Помилка під час завантаження залежностей модуля проекції. Спробуйте завантажити файл знову.",
    "expandCollapseIconLabel": "Об'єкти, що перетинаються",
    "intersectedFeatureLabel": "Відомості про об'єкт, що перетинається",
    "valueAriaLabel": "Значення",
    "countAriaLabel": "Кількість"
  }
});