/*global define*/
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
    "miles": {
      "displayText": "Милі",
      "acronym": "милі"
    },
    "kilometers": {
      "displayText": "Кілометри",
      "acronym": "км"
    },
    "feet": {
      "displayText": "Фути",
      "acronym": "фути"
    },
    "meters": {
      "displayText": "Метри",
      "acronym": "м"
    }
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Налаштування джерела пошуку",
    "searchSourceSettingTitle": "Налаштування джерела пошуку",
    "searchSourceSettingTitleHintText": "Додати та налаштувати сервіси геокодування або шари об’єкту як джерела пошуку. Ці визначені джерела визначають, що доступно для пошуку в полі пошуку",
    "addSearchSourceLabel": "Додати джерело пошуку",
    "featureLayerLabel": "Векторний шар",
    "geocoderLabel": "Геокодер",
    "nameTitle": "Назва",
    "generalSettingLabel": "Загальні налаштування",
    "allPlaceholderLabel": "Текст заповнювача для пошуку всіх:",
    "allPlaceholderHintText": "Підказка: введіть текст, який повинен відображатися як текст заповнювача під час пошуку всіх шарів та геодекодера",
    "generalSettingCheckboxLabel": "Показати спливаюче вікно для знайденого об'єкту або місця розташування",
    "countryCode": "Код(-и) країни або регіону",
    "countryCodeEg": "наприклад ",
    "countryCodeHint": "Якщо залишити це поле пустим, буде виконано пошук всіх країн та регіонів",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Шукати тільки у поточному екстенті карти",
    "zoomScale": "Шкала масштабування",
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
    "meters": "Метри",
    "setSearchFields": "Задати поля пошуку",
    "set": "Задати",
    "fieldName": "Назва",
    "invalidUrlTip": "URL ${URL} недійсний або недоступний."
  },
  "searchSetting": {
    "searchSettingTabTitle": "Налаштування пошуку",
    "defaultBufferDistanceLabel": "Задати буферну відстань за замовчуванням",
    "maxResultCountLabel": "Обмежити кількість результатів",
    "maxResultCountHintLabel": "Підказка: задайте максимальну кількість видимих результатів. Для значення 1 буде виведено найближчий об'єкт",
    "maxBufferDistanceLabel": "Задати максимальну буферну відстань",
    "bufferDistanceUnitLabel": "Одиниці буферної відстані",
    "defaultBufferHintLabel": "Підказка: задайте значення за замовчуванням для бігунка буфера",
    "maxBufferHintLabel": "Підказка: задайте максимальне значення для бігунка буфера",
    "bufferUnitLabel": "Підказка: визначте одиницю для створення буфера",
    "selectGraphicLocationSymbol": "Символ адреси або місця розташування",
    "graphicLocationSymbolHintText": "Підказка: символ для адреси, яка шукається, або вибраного місця розташування",
    "addressLocationPolygonHintText": "Підказка: символ шару полігонів настроєний для використання в пошуку наближених.",
    "popupTitleForPolygon": "Вибрати полігон для вибраного місця розташування адреси",
    "popupTitleForPolyline": "Вибрати лінію для місця розташування адреси",
    "addressLocationPolylineHintText": "Підказка: символ шару поліліній настроєний для використання в пошуку наближених.",
    "fontColorLabel": "Вибрати колір шрифту для результатів пошуку",
    "fontColorHintText": "Підказка: колір шрифту результатів пошуку",
    "highlightColorLabel": "Задати колір вибору",
    "highlightColorHintText": "Підказка: колір вибору",
    "zoomToSelectedFeature": "Масштабувати до вибраного об'єкту",
    "zoomToSelectedFeatureHintText": "Підказка: масштабування до вибраного об'єкту замість буфера",
    "intersectSearchLocation": "Виведення полігону(-ів), який перетинається",
    "intersectSearchLocationHintText": "Підказка: виведення полігону(-ів), які містять місце розташування, яке шукається, замість полігонів в межах буфера",
    "enableProximitySearch": "Активувати пошук наближених",
    "enableProximitySearchHintText": "Підказка: активуйте можливість пошуку місць розташування поруч з вибраним результатом",
    "bufferVisibilityLabel": "Задати видимість буфера",
    "bufferVisibilityHintText": "Підказка: буфер відображатиметься на карті",
    "bufferColorLabel": "Задати символ буфера",
    "bufferColorHintText": "Підказка: виберіть колір та прозорість буфера",
    "searchLayerResultLabel": "Відображати результати тільки вибраного шару",
    "searchLayerResultHint": "Підказка: на карті будуть відображатися результати пошуку тільки для вибраного шару",
    "showToolToSelectLabel": "Кнопка «Задати місце розташування»",
    "showToolToSelectHintText": "Підказка: забезпечує кнопку для задання місця розташування на карті замість того, щоб завжди задавати місце розташування при виборі карти",
    "geoDesicParamLabel": "Використовувати геодезичний буфер",
    "geoDesicParamHintText": "Підказка: використання геодезичного буфера замість евклідового буфера (планарного)",
    "showImageGalleryLabel": "Показати галерею зображень",
    "showImageGalleryHint": "Підказка: якщо прапорець установлений, показуватиметься галерея зображень на панелі віджету, в іншому випадку вона буде прихована",
    "showResultCountOfLayerLabel": "Показати кількість результатів пошуку для кожного шару",
    "showResultCountOfLayerHint": "Підказка: показувати кількість результатів пошуку після імені кожного шару",
    "editDescription": "Вступний текст",
    "editDescriptionTip": "Текст, відображуваний у віджеті над полем пошуку.",
    "noResultsFound": "Повідомлення, відображуване, коли результатів не знайдено.",
    "noResultFoundHint": "Підказка: задайте повідомлення, відображуване, коли в області пошуку не знайдено результатів",
    "noFeatureFoundText": "Результати не знайдено ",
    "searchHeaderText": "Пошук адреси або розташувати на карті",
    "setCurrentLocationLabel": "Кнопка «Задати поточне місце розташування»",
    "setCurrentLocationHintText": "Підказка: надайте кнопку для використання поточного місця розташування користувача",
    "bufferDistanceSliderLabel": "Слайдер буферної відстані",
    "bufferDistanceTextboxLabel": "Текстовий блок буфера",
    "bufferDistanceSliderandTextboxLabel": "Слайдер і текстовий блок буферної відстані",
    "bufferItemOptionLegend": "Опції вводу буферу"
  },
  "layerSelector": {
    "selectLayerLabel": "Вибрати шар(-и) для пошуку",
    "layerSelectionHint": "Підказка: скористайтесь кнопкою налаштування для вибору шару(-ів)",
    "addLayerButton": "Задати"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Налаштування напрямків",
    "routeServiceUrl": "Сервіс побудови маршрутів",
    "buttonSet": "Задати",
    "routeServiceUrlHintText": "Підказка: натисніть «Задати» для пошуку та вибору сервісу побудови маршрутів",
    "directionLengthUnit": "Одиниці довжини напрямку",
    "unitsForRouteHintText": "Підказка: використовується для відображення одиниць для маршруту",
    "selectRouteSymbol": "Вибрати символ для відображення маршруту",
    "routeSymbolHintText": "Підказка: використовується для відображення символу лінії маршруту",
    "routingDisabledMsg": "Для активації напрямків перевірте, що побудову маршруту активовано в елементі у налаштуваннях додатку.",
    "enableDirectionLabel": "Активувати напрямки",
    "enableDirectionText": "Підказка: встановіть прапорець, щоб активувати напрямки в віджеті"
  },
  "symbologySetting": {
    "symbologySettingTabTitle": "Налаштування умовних позначень",
    "addSymbologyBtnLabel": "Додати нові символи",
    "layerNameTitle": "Назва шару",
    "fieldTitle": "Поле",
    "valuesTitle": "Значення",
    "symbolTitle": "Символ",
    "actionsTitle": "Дії",
    "invalidConfigMsg": "Повторюване поле: ${fieldName} для шару: ${layerName}"
  },
  "filterSetting": {
    "filterSettingTabTitle": "Налаштування фільтру",
    "addTaskTip": "Додати один або декілька фільтрів до вибраного шару(-ів) для пошуку та налаштувати параметри для кожного з них.",
    "enableMapFilter": "Вилучити заданий фільтр шару з карти.",
    "newFilter": "Новий фільтр",
    "filterExpression": "Вираз фільтру",
    "layerDefaultSymbolTip": "Використовувати символ шару за замовчуванням",
    "uploadImage": "Передати зображення",
    "selectLayerTip": "Виберіть шар.",
    "setTitleTip": "Задайте заголовок.",
    "noTasksTip": "Фільтри не налаштовано. Натисніть \"${newFilter}\", щоб додати новий.",
    "collapseFiltersTip": "Згорнути вирази фільтру (за наявності) при відкритті віджету",
    "groupFiltersTip": "Згрупувати фільтри за шаром",
    "infoTab": "Інформація",
    "expressionsTab": "Вирази",
    "optionsTab": "Опції",
    "autoApplyWhenWidgetOpen": "Застосувати цей фільтр при відкритті віджету",
    "expandFiltersOnLoad": "Розгорнути фільтри при завантаженні віджета"
  },
  "networkServiceChooser": {
    "arcgislabel": "Додати з ArcGIS Online",
    "serviceURLabel": "Додати URL сервісу",
    "routeURL": "URL маршруту",
    "validateRouteURL": "Перевірити",
    "exampleText": "Приклад",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Вкажіть дійсний маршрутний сервіс.",
    "rateLimitExceeded": "Перевищено обмеження швидкості. Спробуйте знову пізніше.",
    "errorInvokingService": "Неправильне ім’я користувача або пароль."
  },
  "errorStrings": {
    "bufferErrorString": "Введіть дійсне числове значення.",
    "selectLayerErrorString": "Виберіть шар(-и) для пошуку.",
    "invalidDefaultValue": "Буферна відстань за замовчуванням не може бути порожньою. Вкажіть буферну відстань",
    "invalidMaximumValue": "Максимальна буферна відстань не може бути порожньою. Вкажіть буферну відстань",
    "defaultValueLessThanMax": "Вкажіть буферну відстань за замовчуванням з максимальним обмеженням",
    "defaultBufferValueGreaterThanOne": "Буферна відстань за замовчуванням не може бути менше, ніж 0",
    "maximumBufferValueGreaterThanOne": "Вкажіть максимальну буферну відстань більше, ніж 0",
    "invalidMaximumResultCountValue": "Вкажіть дійсне значення для максимальної кількості результатів",
    "invalidSearchSources": "Недійсні налаштування джерела пошуку"
  },
  "symbolPickerPreviewText": "Попередній перегляд:"
});