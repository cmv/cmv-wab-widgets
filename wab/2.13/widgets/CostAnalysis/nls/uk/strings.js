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
  "_widgetLabel": "Аналіз вартості",
  "unableToFetchInfoErrMessage": "Неможливо виконати вибірку детальної інформації сервісу геометрії/налаштованого шару",
  "invalidCostingGeometryLayer": "Неможливо отримати параметр «esriFieldTypeGlobalID» при оцінці вартості шару геометрії.",
  "projectLayerNotFound": "Неможливо знайти налаштований проектний шар на карті.",
  "costingGeometryLayerNotFound": "Неможливо знайти налаштований шар оцінки вартості геометрії на карті.",
  "projectMultiplierTableNotFound": "Неможливо знайти налаштовану таблицю проектної додаткової вартості з множником на карті.",
  "projectAssetTableNotFound": "Неможливо знайти налаштовану таблицю проектних активів на карті.",
  "createLoadProject": {
    "createProjectPaneTitle": "Створити проект",
    "loadProjectPaneTitle": "Завантажити проект",
    "projectNamePlaceHolder": "Назва проекту",
    "projectDescPlaceHolder": "Опис проекту",
    "selectProject": "Вибрати проект",
    "viewInMapLabel": "Переглянути на карті",
    "loadLabel": "Завантажити",
    "createLabel": "Створити",
    "deleteProjectConfirmationMsg": "Бажаєте видалити проект?",
    "noAssetsToViewOnMap": "Вибраний проект не має активів для перегляду на карті.",
    "projectDeletedMsg": "Проект успішно видалено.",
    "errorInCreatingProject": "Помилка при створенні проекту.",
    "errorProjectNotFound": "Проект не знайдено.",
    "errorInLoadingProject": "Перевірте, чи вибрано дійсний проект.",
    "errorProjectNotSelected": "Вибрати таблицю з розкривного списку",
    "errorDuplicateProjectName": "Назва проекту вже існує.",
    "errorFetchingPointLabel": "Помилка під час вибірки точки напису. Спробуйте знову",
    "errorAddingPointLabel": "Помилка під час додавання точки напису. Спробуйте знову"
  },
  "statisticsSettings": {
    "tabTitle": "Налаштування статистики",
    "addStatisticsLabel": "Додати статистику",
    "addNewStatisticsText": "Додати нову статистику",
    "deleteStatisticsText": "Видалити статистику",
    "moveStatisticsUpText": "Перемістити статистику вгору",
    "moveStatisticsDownText": "Перемістити статистику вниз",
    "layerNameTitle": "Шар",
    "statisticsTypeTitle": "Тип",
    "fieldNameTitle": "Поле",
    "statisticsTitle": "Напис",
    "actionLabelTitle": "Дії",
    "selectDeselectAllTitle": "Вибрати всі"
  },
  "statisticsType": {
    "countLabel": "Лічильник",
    "averageLabel": "Середнє",
    "maxLabel": "Максимум",
    "minLabel": "Мінімум",
    "summationLabel": "Підсумовування",
    "areaLabel": "Площа",
    "lengthLabel": "Довжина"
  },
  "costingInfo": {
    "noEditableLayersAvailable": "Шар(-и) необхідно відмітити як редагований у вкладці налаштувань шару"
  },
  "workBench": {
    "refresh": "Оновити",
    "noAssetAddedMsg": "Активи не додано",
    "units": "одиниця(-і)",
    "assetDetailsTitle": "Детальна інформація про елемент активу",
    "costEquationTitle": "Рівняння вартості",
    "newCostEquationTitle": "Нове рівняння",
    "defaultCostEquationTitle": "Рівняння за замовчуванням",
    "geographyTitle": "Географія",
    "scenarioTitle": "Сценарій",
    "costingInfoHintText": "<div>Підказка: Використовуйте наступні ключові слова</div><ul><li><b>{TOTALCOUNT}</b>: Використовує загальну кількість одного типу активу в географії</li> <li><b>{MEASURE}</b>: Використовує довжину для лінійного активу та площу для полігонального активу</li><li><b>{TOTALMEASURE}</b>: Використовує загальну довжину для лінійного активу та загальну площу для полігонального активу одного типу в географії</li></ul> Можна використовувати такі функції як:<ul><li>Math.abs(-100)</li><li>Math.floor({TOTALMEASURE})</li></ul>Відредагуйте рівняння вартості відповідно до потреб проекту.",
    "zoomToAsset": "Масштабувати до активу",
    "deleteAsset": "Видалити актив",
    "closeDialog": "Закрити діалог",
    "objectIdColTitle": "Ідентифікатор об'єкту",
    "costColTitle": "Вартість",
    "errorInvalidCostEquation": "Недійсне рівняння вартості.",
    "errorInSavingAssetDetails": "Неможливо зберегти детальну інформацію про актив.",
    "featureModeText": "Режим об'єкту",
    "sketchToolTitle": "Скетч",
    "selectToolTitle": "Вибрати"
  },
  "assetDetails": {
    "inGeography": " в ${geography} ",
    "withScenario": " з ${scenario}",
    "totalCostTitle": "Загальна вартість",
    "additionalCostLabel": "Опис",
    "additionalCostValue": "Значення",
    "additionalCostNetValue": "Чисте значення"
  },
  "projectOverview": {
    "assetItemsTitle": "Елементи активів",
    "assetStatisticsTitle": "Статистика активів",
    "projectSummaryTitle": "Коротка інформація про проект",
    "projectName": "Назва проекту: ${name}",
    "totalCostLabel": "Загальна вартість проекту (*):",
    "grossCostLabel": "Валова вартість проекту (*):",
    "roundingLabel": "* Округлення до '${selectedRoundingOption}'",
    "unableToSaveProjectBoundary": "Неможливо зберегти проектний кордон у проектному шарі.",
    "unableToSaveProjectCost": "Неможливо зберегти вартість у проектному шарі.",
    "roundCostValues": {
      "twoDecimalPoint": "Дві десяткові коми",
      "nearestWholeNumber": "Найближче ціле значення",
      "nearestTen": "Найближчий десяток",
      "nearestHundred": "Найближча сотня",
      "nearestThousand": "Найближча тисяча",
      "nearestTenThousands": "Найближчі десять тисяч"
    }
  },
  "projectAttribute": {
    "projectAttributeText": "Атрибут проекту",
    "projectAttributeTitle": "Редагувати атрибути проекту"
  },
  "costEscalation": {
    "costEscalationLabel": "Додати додаткову вартість",
    "valueHeader": "Значення",
    "addCostEscalationText": "Додати додаткову вартість",
    "deleteCostEscalationText": "Видалити вибрану додаткову вартість",
    "moveCostEscalationUpText": "Перемістити вибрану додаткову вартість вгору",
    "moveCostEscalationDownText": "Перемістити вибрану додаткову вартість вниз",
    "invalidEntry": "Один або більше записів недійсний.",
    "errorInSavingCostEscalation": "Неможливо зберегти детальну інформацію про додаткову вартість."
  },
  "scenarioSelection": {
    "popupTitle": "Вибрати сценарій для активу",
    "regionLabel": "Географія",
    "scenarioLabel": "Сценарій",
    "noneText": "Немає",
    "copyFeatureMsg": "Бажаєте копіювати вибрані об’єкти?"
  },
  "detailStatistics": {
    "detailStatisticsLabel": "Детальна статистика",
    "noDetailStatisticAvailable": "Статистику активів не додано"
  },
  "copyFeatures": {
    "title": "Копіювати об'єкти",
    "createFeatures": "Створити об'єкти",
    "createSingleFeature": "Створити 1 мультигеометричний об'єкт",
    "noFeaturesSelectedMessage": "Об'єкти не вибрано",
    "selectFeatureToCopyMessage": "Виберіть об'єкти для копіювання."
  },
  "updateCostEquationPanel": {
    "updateProjectCostTabLabel": "Оновити рівняння проекту",
    "updateProjectCostSelectProjectTitle": "Вибрати всі проекти",
    "updateButtonTextForm": "Оновлення",
    "updateProjectCostSuccess": "Рівняння вартості вибраних проектів оновлено",
    "updateProjectCostError": "Не вдалося оновити рівняння вартості вибраних проектів",
    "updateProjectNoProject": "Проектів не знайдено"
  }
});