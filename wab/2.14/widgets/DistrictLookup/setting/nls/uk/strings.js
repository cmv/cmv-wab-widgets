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
    "miles": "Милі",
    "kilometers": "Кілометри",
    "feet": "Фути",
    "meters": "Метри"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Налаштування пошуку",
    "buttonSet": "Задати",
    "selectLayersLabel": "Вибрати шар",
    "selectLayersHintText": "Підказка: використовується для вибору полігонального шару та пов’язаного з ним точкового шару.",
    "selectPrecinctSymbolLabel": "Вибрати символ для виділення полігону",
    "selectGraphicLocationSymbol": "Символ адреси або місця розташування",
    "graphicLocationSymbolHintText": "Підказка: символ для адреси, яка шукається, або вибраного місця розташування",
    "precinctSymbolHintText": "Підказка: використовується для відображення символу для вибраного полігону",
    "selectColorForPoint": "Вибрати колір для виділення точки",
    "selectColorForPointHintText": "Підказка: використовується відображення кольору виділення для вибраної точки"
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
    "invalidUrlTip": "URL ${URL} недійсний або недоступний.",
    "invalidSearchSources": "Недійсні налаштування джерела пошуку"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Вибрати полігональний шар",
    "selectPolygonLayerHintText": "Підказка: використовується для вибору полігонального шару.",
    "selectRelatedPointLayerLabel": "Вибрати точковий шар, пов’язаний з полігональним шаром",
    "selectRelatedPointLayerHintText": "Підказка: використовується для вибору точкового шару, пов’язаного з полігональним шаром",
    "polygonLayerNotHavingRelatedLayer": "Виберіть полігональний шар, який має пов’язаний точковий шар.",
    "errorInSelectingPolygonLayer": "Виберіть полігональний шар, який має пов’язаний точковий шар.",
    "errorInSelectingRelatedLayer": "Вибрати точковий шар, пов’язаний з полігональним шаром."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Налаштування напрямків",
    "routeServiceUrl": "Сервіс побудування маршрутів",
    "buttonSet": "Задати",
    "routeServiceUrlHintText": "Підказка: натисніть «Задати» для пошуку та вибору сервісу побудування маршрутів з мережевим аналізом",
    "directionLengthUnit": "Одиниці довжини напрямку",
    "unitsForRouteHintText": "Підказка: використовується для відображення вказаних одиниць для маршруту",
    "selectRouteSymbol": "Вибрати символ для відображення маршруту",
    "routeSymbolHintText": "Підказка: використовується для відображення символу лінії маршруту",
    "routingDisabledMsg": "Для активації напрямків перевірте, що побудування маршруту активовано в елементі ArcGIS Online.",
    "enableDirectionLabel": "Активувати напрямки",
    "enableDirectionText": "Підказка: встановіть прапорець, щоб активувати напрямки в віджеті"
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
  "symbolPickerPreviewText": "Попередній перегляд:",
  "showToolToSelectLabel": "Кнопка «Задати місце розташування»",
  "showToolToSelectHintText": "Підказка: забезпечує кнопку для задання місця розташування на карті замість того, щоб завжди задавати місце розташування при виборі карти"
});