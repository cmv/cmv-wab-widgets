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
  "units": {
    "areaSquareFeetUnit": "Квадратні фути",
    "areaAcresUnit": "Акри",
    "areaSquareMetersUnit": "Квадратні метри",
    "areaSquareKilometersUnit": "Квадратні кілометри",
    "areaHectaresUnit": "Гектари",
    "areaSquareMilesUnit": "Квадратні милі",
    "lengthFeetUnit": "Фути",
    "lengthMilesUnit": "Милі",
    "lengthMetersUnit": "Метри",
    "lengthKilometersUnit": "Кілометри"
  },
  "analysisTab": {
    "analysisTabLabel": "Аналіз",
    "selectAnalysisLayerLabel": "Шари аналізу",
    "addLayerLabel": "Додати шари",
    "noValidLayersForAnalysis": "Не знайдено припустимі шари у вибраній веб-карті.",
    "noValidFieldsForAnalysis": "Не знайдено припустимі поля у вибраній веб-карті. Вилучіть вибраний шар.",
    "allowGroupingLabel": "Групувати об'єкти за полями з однаковими значеннями",
    "groupingHintDescription": "Підказка: За замовчуванням усі об’єкти з однаковими значеннями в обраних полях будуть згруповані і представлені у звіті як одинарний запис. Відключити групування за подібними атрибутами, щоб записи для кожного об’єкту відображалися окремо.",
    "addLayersHintText": "Підказка: виберіть шари та поля для включення в аналіз та звіт",
    "addLayerNameTitle": "Назва шару",
    "addFieldsLabel": "Додати поле",
    "addFieldsPopupTitle": "Вибрати поля",
    "addFieldsNameTitle": "Назви полів",
    "aoiToolsLegendLabel": "Інструменти області інтересу",
    "aoiToolsDescriptionLabel": "Виберіть та підпишіть інструменти, доступні для створення області інтересу.",
    "placenameLabel": "Назва місця",
    "drawToolsLabel": "Виберіть інструменти малювання",
    "uploadShapeFileLabel": "Передати шейп-файл",
    "coordinatesLabel": "Координати",
    "coordinatesDrpDwnHintText": "Підказка: виберіть одиниці вимірювання для відображення введених теодолітних ходів",
    "coordinatesBearingDrpDwnHintText": "Підказка: виберіть дирекційний кут для відображення введених теодолітних ходів",
    "allowShapefilesUploadLabel": "Дозволити користувачам передавати шейп-файли для включення в аналіз",
    "allowShapefilesUploadLabelHintText": "Підказка: додайте опцію до вкладки «Звіт», де користувачі зможуть передавати власні дані у вигляді шейп-файлу для включення в аналітичний звіт",
    "allowVisibleLayerAnalysisLabel": "Не виконуйте аналіз та не складайте звіт для шарів, які невидимі",
    "allowVisibleLayerAnalysisHintText": "Підказка: шари, які були вимкнені або не видимі через налаштування видимості масштабу, не будуть аналізуватися або включатися у друковані чи завантажені результати.",
    "areaUnitsLabel": "Одиниці результатів аналізу(площа)",
    "lengthUnitsLabel": "Одиниці результатів аналізу(довжина)",
    "maxFeatureForAnalysisLabel": "Максимальне число об'єктів для аналізу",
    "maxFeatureForAnalysisHintText": "Підказка: задайте максимальне число об'єктів, які будуть включені в аналіз",
    "searchToleranceLabelText": "Допуск пошуку",
    "searchToleranceHint": "Підказка: допуск пошуку використовується при аналізі вхідних значень точок та ліній",
    "placenameButtonText": "Назва місця",
    "drawToolsButtonText": "Намалювати",
    "shapefileButtonText": "Шейп-файл",
    "coordinatesButtonText": "Координати",
    "invalidLayerErrorMsg": "Налаштуйте поля для",
    "drawToolSelectableLayersLabel": "Виберіть шари, доступні для вибору",
    "drawToolSelectableLayersHint": "Підказка: виберіть шари, що містять об'єкти, які можна вибирати, використовуючи «Вибрати інструмент малювання»",
    "drawToolsSettingsFieldsetLabel": "Інструменти малювання",
    "drawToolPointLabel": "Точка",
    "drawToolPolylineLabel": "Полілінія",
    "drawToolExtentLabel": "Екстент",
    "drawToolPolygonLabel": "Полігон",
    "drawToolCircleLabel": "Коло",
    "selectDrawToolsText": "Виберіть інструменти відображення, доступні для створення області інтересу",
    "selectingDrawToolErrorMessage": "Виберіть щонайменше один інструмент відображення або шар вибору для використання опції «Інструменти відображення» для інструментів ОІ."
  },
  "downloadTab": {
    "downloadLegend": "Завантажити налаштування",
    "reportLegend": "Налаштування звіту",
    "downloadTabLabel": "Завантажити",
    "syncEnableOptionLabel": "Векторні шари",
    "syncEnableOptionHint": "Підказка: виберіть шари, котрі можна завантажити, та вкажіть формати, в яких доступний кожний шар. Завантажені набори даних включатимуть об'єкти, котрі перетинають область інтересу.",
    "syncEnableOptionNote": "Примітка: завантаження файлової бази геоданих та шейп-файлів потребує векторних шарів з можливістю синхронізації. Формат шейп-файлу підтримується тільки векторними шарами ArcGIS Online.",
    "extractDataTaskOptionLabel": "Сервіс геообробки «Задача витягання даних»",
    "extractDataTaskOptionHint": "Підказка: використовуйте опублікований сервіс геообробки «Задача витягання даних» для завантаження об'єктів, які перетинають область інтересу у форматах файлової бази геоданих або шейп-файлу.",
    "cannotDownloadOptionLabel": "Деактивувати завантаження",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Назва шару",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "Файлова база геоданих",
      "ShapefileFormatLabel": "Шейп-файл",
      "allowDownloadLabel": "Дозволити завантаження"
    },
    "setButtonLabel": "Задати",
    "GPTaskLabel": "Задати URL для сервісу геообробки",
    "printGPServiceLabel": "URL сервісу друку",
    "setGPTaskTitle": "Задати потрібний URL сервісу геообробки",
    "logoLabel": "Логотип",
    "logoChooserHint": "Підказка: клацніть значок зображення для зміни логотипу, показаного в верхньому лівому куту звіту",
    "footnoteLabel": "Виноска",
    "columnTitleColorPickerLabel": "Колір заголовку стовпця звіту",
    "reportTitleLabel": "Заголовок звіту",
    "displaySummaryLabel": "Показати сумарну статистику",
    "hideZeroValueRowLabel": "Приховати рядки зі значенням 0 для всіх полів аналізу",
    "hideNullValueRowLabel": "Приховати рядки без значень даних (нульові або порожні) для всіх полів аналізу",
    "errorMessages": {
      "invalidGPTaskURL": "Недійсний сервіс геообробки. Виберіть сервіс геообробки, який містить задачу витягання даних.",
      "noExtractDataTaskURL": "Виберіть сервіс геообробки, який містить задачу витягання даних.",
      "duplicateCustomOption": "Повторюваний запис для  ${duplicateValueSizeName} існує.",
      "invalidLayoutWidth": "Введено недійсну ширину для ${customLayoutOptionValue}.",
      "invalidLayoutHeight": "Введено недійсну висоту для ${customLayoutOptionValue}.",
      "invalidLayoutPageUnits": "Вибрано недійсні одиниці сторінки для ${customLayoutOptionValue}.",
      "failtofetchbuddyTaskDimension": "Помилка під час вибірки інформації про розмір задачі партнера. Спробуйте знову.",
      "failtofetchbuddyTaskName": "Помилка під час вибірки назви про задачу партнера. Спробуйте знову.",
      "failtofetchChoiceList": "Помилка під час вибірки списку вибору з сервісу друку. Спробуйте знову.",
      "invalidWidth": "Неприпустима ширина.",
      "invalidHeight": "Неприпустима висота."
    },
    "addCustomLayoutTitle": "Додати власне компонування",
    "customLayoutOptionHint": "Підказка: додайте компонування з вашого сервісу друку до списку опцій друку.",
    "reportDefaultOptionLabel": "Компонування за замовчуванням",
    "pageSizeUnits": {
      "millimeters": "Міліметри",
      "points": "Точки"
    },
    "noDataTextRepresentation": "Немає значення даних",
    "naTextRepresentation": "Незастосовне значення",
    "noDataDefaultText": "Немає даних",
    "notApplicableDefaultText": "Немає даних"
  },
  "generalTab": {
    "generalTabLabel": "Загальний",
    "tabLabelsLegend": "Написи панелі",
    "tabLabelsHint": "Підказка: вкажіть написи",
    "AOITabLabel": "Панель області інтересу",
    "ReportTabLabel": "Панель звіту",
    "bufferSettingsLegend": "Налаштування буфера",
    "defaultBufferDistanceLabel": "Буферна відстань за замовчуванням",
    "defaultBufferUnitsLabel": "Одиниці буфера",
    "generalBufferSymbologyHint": "Підказка: умовні позначення, котрі використовуватимуться для позначення буферної області навколо визначеної області інтересу",
    "aoiGraphicsSymbologyLegend": "Умовні позначення області інтересу",
    "aoiGraphicsSymbologyHint": "Підказка: умовні позначення, використовувані для позначення області інтересу точок, ліній та полігонів",
    "pointSymbologyLabel": "Точка",
    "previewLabel": "Попередній перегляд",
    "lineSymbologyLabel": "Лінія",
    "polygonSymbologyLabel": "Полігон",
    "aoiBufferSymbologyLabel": "Умовні позначення буфера",
    "pointSymbolChooserPopupTitle": "Символ адреси або точкового місця розташування",
    "polygonSymbolChooserPopupTitle": "Символ полігону",
    "lineSymbolChooserPopupTitle": "Символ лінії",
    "aoiSymbolChooserPopupTitle": "Символ буферу",
    "aoiTabText": "Область інтересу",
    "reportTabText": "Звіт",
    "invalidSymbolValue": "Недійсне значення символу."
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Налаштування джерела пошуку",
    "searchSourceSettingTitle": "Налаштування джерела пошуку",
    "searchSourceSettingTitleHintText": "Додати та налаштувати сервіси геокодування або шари об’єкту як джерела пошуку. Ці визначені джерела визначають, що доступно для пошуку в полі пошуку",
    "addSearchSourceLabel": "Додати джерело пошуку",
    "featureLayerLabel": "Векторний шар",
    "geocoderLabel": "Геокодер",
    "generalSettingLabel": "Загальні налаштування",
    "allPlaceholderLabel": "Текст заповнювача для пошуку всіх:",
    "allPlaceholderHintText": "Підказка: введіть текст, який повинен відображатися як текст заповнювача під час пошуку всіх шарів та геодекодера",
    "generalSettingCheckboxLabel": "Показати спливаюче вікно для знайденого об'єкту або місця розташування",
    "countryCode": "Код(-и) країни або регіону",
    "countryCodeEg": "наприклад ",
    "countryCodeHint": "Якщо залишити це поле пустим, буде виконано пошук всіх країн та регіонів",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Шукати тільки у поточному екстенті карти",
    "locatorUrl": "URL геодекодера",
    "locatorName": "Назва геодекодера",
    "locatorExample": "Приклад",
    "locatorWarning": "Ця версія сервісу геокодування не підтримується. Віджет підтримує сервіс геокодування версії 10.0 та вище.",
    "locatorTips": "Рекомендації недоступні, оскільки сервіс геокодування не підтримує функцію рекомендування.",
    "layerSource": "Джерело шару",
    "setLayerSource": "Задати джерело шару",
    "setGeocoderURL": "Задати URL геодекодера",
    "searchLayerTips": "Рекомендації недоступні, оскільки сервіс об'єктів не підтримує функцію розподілення на сторінки.",
    "placeholder": "Текст заповнювача",
    "searchFields": "Поля пошуку",
    "displayField": "Поле відображення",
    "exactMatch": "Точний збіг",
    "maxSuggestions": "Максимальна кількість рекомендацій",
    "maxResults": "Максимальна кількість результатів",
    "enableLocalSearch": "Активувати локальний пошук",
    "minScale": "Мін. масштаб",
    "minScaleHint": "Якщо масштаб карти більше, ніж цей масштаб, буде застосовуватися локальний пошук",
    "radius": "Радіус",
    "radiusHint": "Визначає радіус області навколо поточного центру карти, який використовується для підняття рангу кандидатів геокодування, щоб кандидати, розташовані найближче до місця розташування, виводилися першими",
    "setSearchFields": "Задати поля пошуку",
    "set": "Задати",
    "invalidUrlTip": "URL ${URL} недійсний або недоступний.",
    "invalidSearchSources": "Недійсні налаштування джерела пошуку"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Заповніть необхідні поля",
    "bufferDistanceFieldsErrorMsg": "Введіть дійсні значення",
    "invalidSearchToleranceErrorMsg": "Введіть дійсне значення для допуску пошуку",
    "atLeastOneCheckboxCheckedErrorMsg": "Недійсна конфігурація: потрібен щонайменше один інструмент області інтересу.",
    "noLayerAvailableErrorMsg": "Шари недоступні",
    "layerNotSupportedErrorMsg": "Не підтримується ",
    "noFieldSelected": "Використовуйте дію редагування для вибору полів для аналізу.",
    "duplicateFieldsLabels": "Повторюваний напис \"${labelText}\" додано для: \"${itemNames}\"",
    "noLayerSelected": "Виберіть щонайменше один шар для аналізу.",
    "errorInSelectingLayer": "Не вдалося вибрати шар. Спробуйте знову.",
    "errorInMaxFeatureCount": "Введіть дійсну максимальну кількість об'єктів для аналізу."
  }
});