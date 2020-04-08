/*
 | Copyright 2017 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define({
  "searchSourceSetting": {
    "title": "Налаштування пошуку та буфера",
    "mainHint": "Ви можете активувати пошук тексту адресатів, а також об'єкти, оцифровування геометрії та буферизацію."
  },
  "addressSourceSetting": {
    "title": "Шари адреси",
    "mainHint": "Ви можете вказати, який шар(-и) напису адресату доступні."
  },
  "notificationSetting": {
    "title": "Опції повідомлення",
    "mainHint": "Ви можете визначити, які типи повідомлення доступні."
  },
  "groupingLabels": {
    "addressSources": "Шари, які застосовуються до шарів вибраних адресатів",
    "averyStickersDetails": "Стікери Avery(r)",
    "csvDetails": "Файл значень, розділених комою (CSV)",
    "drawingTools": "Інструмент малювання для визначення області",
    "featureLayerDetails": "Векторний шар",
    "geocoderDetails": "Геокодер",
    "labelFormats": "Доступні формати напису",
    "printingOptions": "Опій для надрукованих сторінок напису",
    "searchSources": "Джерела пошуку",
    "stickerFormatDetails": "Параметри сторінки напису"
  },
  "hints": {
    "alignmentAids": "Позначки додаються до сторінки напису, щоб допомогти вам вирівняти сторінку відносно принтеру",
    "csvNameList": "Розділений комами список назв полів, чутливий до регістру",
    "horizontalGap": "Проміжок між двома написами у рядку",
    "insetToLabel": "Проміжок між боковою стороною напису та початком тексту",
    "labelFormatDescription": "Порядок представлення стилю напису у списку опцій формату віджету",
    "labelFormatDescriptionHint": "Підказка інструменту для доповнення опису у списку опцій формату",
    "labelHeight": "Висота кожного напису на сторінці",
    "labelWidth": "Ширина кожного напису на сторінці",
    "localSearchRadius": "Визначає радіус області навколо поточного центру карти, який використовується для підняття рангу кандидатів геокодування, щоб кандидати, розташовані найближче до місця розташування, виводилися першими",
    "rasterResolution": "100 пікселів на дюйм приблизно відповідає роздільній здатності екрану. Чим вище роздільна здатність, тим більше пам’яті потрібно для роботи браузера. Браузери відрізняються за своєю здатністю ефективно виконувати задачі, які потребують великих об’ємів пам’яті.",
    "selectionListOfOptionsToDisplay": "Відмічені елементи відображаються як опції у віджеті; змініть порядок необхідним чином",
    "verticalGap": "Проміжок між двома написами у стовпці"
  },
  "propertyLabels": {
    "bufferDefaultDistance": "Буферна відстань за замовчуванням",
    "bufferUnits": "Одиниці буфера для використання у віджеті",
    "countryRegionCodes": "Коди країни або регіону",
    "description": "Опис",
    "descriptionHint": "Підказка для опису",
    "displayField": "Поле відображення",
    "drawingToolsFreehandPolygon": "довільний полігон",
    "drawingToolsLine": "лінія",
    "drawingToolsPoint": "точка",
    "drawingToolsPolygon": "полігон",
    "drawingToolsPolyline": "полілінія",
    "enableLocalSearch": "Активувати локальний пошук",
    "exactMatch": "Точний збіг",
    "fontSizeAlignmentNote": "Розмір шрифту для примітки про межі друкованого поля",
    "gridDarkness": "Темність сітки",
    "gridlineLeftInset": "Ліва вставка лінії сітки",
    "gridlineMajorTickMarksGap": "Основні мітки кожні",
    "gridlineMinorTickMarksGap": "Допоміжні мітки кожні",
    "gridlineRightInset": "Права вставка лінії сітки",
    "labelBorderDarkness": "Темність границі напису",
    "labelBottomEdge": "Нижній край написів на сторінці",
    "labelFontSize": "Розмір шрифту",
    "labelHeight": "Висота напису",
    "labelHorizontalGap": "Горизонтальний проміжок",
    "labelInitialInset": "Вставити в текст напису",
    "labelLeftEdge": "Лівий край написів на сторінці",
    "labelMaxLineCount": "Максимальна кількість ліній у написі",
    "labelPageHeight": "Висота сторінки",
    "labelPageWidth": "Ширина сторінки",
    "labelRightEdge": "Правий край написів на сторінці",
    "labelsInAColumn": "Кількість написів у стовпці",
    "labelsInARow": "Кількість написів у рядку",
    "labelTopEdge": "Верхній край написів на сторінці",
    "labelVerticalGap": "Вертикальний проміжок",
    "labelWidth": "Ширина напису",
    "limitSearchToMapExtent": "Шукати тільки у поточному екстенті карти",
    "maximumResults": "Максимальна кількість результатів",
    "maximumSuggestions": "Максимальна кількість рекомендацій",
    "minimumScale": "Мінімальний масштаб",
    "name": "Назва",
    "percentBlack": "% чорний",
    "pixels": "пікселі",
    "pixelsPerInch": "пікселів на дюйм",
    "placeholderText": "Текст заповнювача",
    "placeholderTextForAllSources": "Текст заповнювача для пошуку всіх джерел",
    "radius": "Радіус",
    "rasterResolution": "Роздільна здатність растру",
    "searchFields": "Поля пошуку",
    "showAlignmentAids": "Показати засоби вирівнювання на сторінці",
    "showGridTickMarks": "Показати мітки сітки",
    "showLabelOutlines": "Показати контури написів",
    "showPopupForFoundItem": "Показати спливаюче вікно для знайденого об'єкту або місця розташування",
    "tool": "Інструменти",
    "units": "Одиниці",
    "url": "URL",
    "urlToGeometryService": "URL сервісу геометрії",
    "useRelatedRecords": "Використовувати його пов’язані записи",
    "useSecondarySearchLayer": "Використовувати вторинний шар вибору",
    "useSelectionDrawTools": "Використовувати інструменти малювання вибору",
    "useVectorFonts": "Використовувати векторні шрифти (тільки латинські шрифти)",
    "addCSVHeader": "Додати назву стовпця (тільки для CSV)",
    "zoomScale": "Шкала масштабування"
  },
  "buttons": {
    "addAddressSource": "Додати шар, який містить написи адреси у його спливаюче вікно",
    "addLabelFormat": "Додати формат напису",
    "addSearchSource": "Додати джерело пошуку",
    "set": "Задати"
  },
  "placeholders": {
    "averyExample": "Наприклад, напис Avery(r) ${averyPartNumber}",
    "countryRegionCodes": "наприклад, США, КИТАЙ",
    "descriptionCSV": "Значення, розділені комою (CSV)",
    "descriptionPDF": "Напис PDF ${heightLabelIn} x ${widthLabelIn} дюймів; ${labelsPerPage} на сторінку"
  },
  "tooltips": {
    "getWebmapFeatureLayer": "Отримати векторний шар з веб-карти",
    "openCountryCodes": "Клацніть для отримання додаткової інформації про коди",
    "openFieldSelector": "Клацніть, щоб відкрити селектор поля",
    "setAndValidateURL": "Задати та перевірити URL"
  },
  "problems": {
    "noAddresseeLayers": "Вкажіть щонайменше один шар адресату",
    "noBufferUnitsForDrawingTools": "Налаштуйте щонайменше одну одиницю буфера для інструментів малювання",
    "noBufferUnitsForSearchSource": "Налаштуйте щонайменше одну одиницю буфера для джерела пошуку \"${sourceName}»",
    "noGeometryServiceURL": "Налаштуйте URL для сервісу геометрії",
    "noNotificationLabelFormats": "Вкажіть щонайменше один формат напису повідомлення",
    "noSearchSourceFields": "Налаштуйте одне або декілька полів поля пошуку для джерела пошуку \"${sourceName}\"",
    "noSearchSourceURL": "Налаштуйте URL для джерела пошуку \"${sourceName}\"",
    "noSearchSourcesConfigured": "Налаштуйте щонайменше одне джерело пошуку"
  },
  "querySourceSetting": {
    "sourceSetting": "Налаштування джерела пошуку",
    "instruction": "Додати та налаштувати сервіси геокодування або шари об’єкту як джерела пошуку. Ці зазначені джерела визначають, що доступно для пошуку в полі пошуку.",
    "add": "Додати джерело пошуку",
    "addGeocoder": "Додати геокодер",
    "geocoder": "Геокодер",
    "setLayerSource": "Задати джерело шару",
    "setGeocoderURL": "Задати URL геодекодера",
    "searchableLayer": "Векторний шар",
    "name": "Назва",
    "countryCode": "Код(-и) країни або регіону",
    "countryCodeEg": "наприклад ",
    "countryCodeHint": "Якщо залишити це поле пустим, буде виконано пошук всіх країн та регіонів",
    "generalSetting": "Загальні налаштування",
    "allPlaceholder": "Текст заповнювача для пошуку всіх: ",
    "showInfoWindowOnSelect": "Показати спливаюче вікно для знайденого об'єкту або місця розташування",
    "showInfoWindowOnSelect2": "Показати спливаюче вікно, коли знайдено об'єкт або місце розташування.",
    "searchInCurrentMapExtent": "Шукати тільки у поточному екстенті карти",
    "zoomScale": "Шкала масштабування",
    "locatorUrl": "URL геодекодера",
    "locatorName": "Назва геодекодера",
    "locatorExample": "Приклад",
    "locatorWarning": "Ця версія сервісу геокодування не підтримується. Віджет підтримує сервіс геокодування версії 10.1 та вище.",
    "locatorTips": "Рекомендації недоступні, оскільки сервіс геокодування не підтримує функцію рекомендування.",
    "layerSource": "Джерело шару",
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
    "fieldSearchable": "Доступно для пошуку",
    "fieldName": "Назва",
    "fieldAlias": "Псевдонім",
    "ok": "OK",
    "cancel": "Скасувати",
    "invalidUrlTip": "URL ${URL} недійсний або недоступний.",
    "locateResults": "Знайти результати",
    "panTo": "Перемістити до",
    "zoomToScale": "Масштабувати до шкали",
    "locatorError": "Локатор має підтримувати визначення місця розташування одиночної лінії."
  }
});