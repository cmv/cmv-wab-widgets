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
    "title": "Настройки поиска и буфера",
    "mainHint": "Можно включить текстовый поиск адресов или объектов, оцифровку геометрии и построение буферов."
  },
  "addressSourceSetting": {
    "title": "Слои адресов",
    "mainHint": "Можно указать, какие слои адресов будут доступны."
  },
  "notificationSetting": {
    "title": "Опции уведомлений",
    "mainHint": "Можно указать, какие типы уведомлений будут доступны."
  },
  "groupingLabels": {
    "addressSources": "Слой, используемый для выбора слоев адресатов",
    "averyStickersDetails": "Каждые(r) стикеров",
    "csvDetails": "Файл значений, разделенных запятыми (CSV)",
    "drawingTools": "Инструменты рисования для указания области",
    "featureLayerDetails": "Векторный слой",
    "geocoderDetails": "Геокодер",
    "labelFormats": "Доступные форматы подписей",
    "printingOptions": "Опции печатных станиц подписей",
    "searchSources": "Источники поиска",
    "stickerFormatDetails": "Параметры страниц подписей"
  },
  "hints": {
    "alignmentAids": "На страницу подписей добавлены метки, чтобы помочь выровнять страницу по принтеру",
    "csvNameList": "Разделенный запятыми список чувствительных к регистру имен полей",
    "horizontalGap": "Пробел между двумя подписями в строке",
    "insetToLabel": "Пробел между границей подписи и началом текста",
    "labelFormatDescription": "Как стиль подписей представлен в списке опций формата виджета",
    "labelFormatDescriptionHint": "Подсказка для дополнительного описания в списке опций формата",
    "labelHeight": "Высота каждой подписи на странице",
    "labelWidth": "Ширина каждой подписи на странице",
    "localSearchRadius": "Укажите радиус области вокруг текущего центра карты, которая будет использоваться для повышения ранга кандидатов геокодирования так, чтобы первыми возвращались кандидаты, расположенные ближе всего",
    "rasterResolution": "100 пикселов на дюйм примерно соответствует разрешению экрана. Чем выше разрешение, тем больше памяти требуется браузеру. Браузеры различаются по возможностям корректного управления запросами большого объема памяти.",
    "selectionListOfOptionsToDisplay": "Отмеченные элементы отображены как опции в виджете. Измените порядок по желанию",
    "verticalGap": "Пробел между двумя подписями в столбце"
  },
  "propertyLabels": {
    "bufferDefaultDistance": "Буферное расстояние по умолчанию",
    "bufferUnits": "Единицы измерения буфера, предоставляемые в виджете",
    "countryRegionCodes": "Коды стран или регионов",
    "description": "Описание",
    "descriptionHint": "Подсказка описания",
    "displayField": "Поле отображения",
    "drawingToolsFreehandPolygon": "произвольный полигон",
    "drawingToolsLine": "линия",
    "drawingToolsPoint": "точка",
    "drawingToolsPolygon": "полигон",
    "drawingToolsPolyline": "полилиния",
    "enableLocalSearch": "Включить локальный поиск",
    "exactMatch": "Точное совпадение",
    "fontSizeAlignmentNote": "Размер шрифта для заметок о полях принтера",
    "gridDarkness": "Темный фон сетки",
    "gridlineLeftInset": "Вставка левой линии сетки",
    "gridlineMajorTickMarksGap": "Основные метки обозначают каждые",
    "gridlineMinorTickMarksGap": "Дополнительные метки обозначают каждые",
    "gridlineRightInset": "Вставка правой линии сетки",
    "labelBorderDarkness": "Темный фон границы подписи",
    "labelBottomEdge": "Нижний край подписей на странице",
    "labelFontSize": "Размер шрифта",
    "labelHeight": "Высота подписи",
    "labelHorizontalGap": "Пробел по горизонтали",
    "labelInitialInset": "Вставка в текст подписи",
    "labelLeftEdge": "Левый край подписей на странице",
    "labelMaxLineCount": "Максимальное число строк в подписи",
    "labelPageHeight": "Высота страницы",
    "labelPageWidth": "Ширина страницы",
    "labelRightEdge": "Правый край подписей на странице",
    "labelsInAColumn": "Число подписей в столбце",
    "labelsInARow": "Число подписей в строке",
    "labelTopEdge": "Верхний край подписей на странице",
    "labelVerticalGap": "Пробел по вертикали",
    "labelWidth": "Ширина надписи",
    "limitSearchToMapExtent": "Искать только в пределах текущего экстента карты",
    "maximumResults": "Максимум результатов",
    "maximumSuggestions": "Максимум предложений",
    "minimumScale": "Минимальный масштаб",
    "name": "Название",
    "percentBlack": "% черный",
    "pixels": "пикселы",
    "pixelsPerInch": "пикселов на дюйм",
    "placeholderText": "Замещающий текст",
    "placeholderTextForAllSources": "Замещающий текст для поиска всех ресурсов",
    "radius": "Радиус",
    "rasterResolution": "Разрешение растра",
    "searchFields": "Поля для поиска",
    "showAlignmentAids": "Показать помощники выравнивания на странице",
    "showGridTickMarks": "Показать метки делений сетки",
    "showLabelOutlines": "Показать контуры подписи",
    "showPopupForFoundItem": "Показать всплывающее окно для найденного объекта или местоположения",
    "tool": "Инструменты",
    "units": "Ед. измерения",
    "url": "URL-адрес",
    "urlToGeometryService": "URL-адрес сервиса геометрии",
    "useRelatedRecords": "Использовать связанные записи",
    "useSecondarySearchLayer": "Использовать вторичный слой выборки",
    "useSelectionDrawTools": "Использовать инструменты рисования выборки",
    "useVectorFonts": "Использовать векторные шрифты (только латинский шрифт)",
    "zoomScale": "Масштаб"
  },
  "buttons": {
    "addAddressSource": "Добавить слой, содержащий во всплывающем окне подписи адреса",
    "addLabelFormat": "Добавить формат подписи",
    "addSearchSource": "Добавить источник поиска",
    "set": "Задать"
  },
  "placeholders": {
    "averyExample": "например, Каждая(r) подпись ${averyPartNumber}",
    "countryRegionCodes": "например, USA,CHN",
    "descriptionCSV": "Значения, разделенные запятыми",
    "descriptionPDF": "Подпись PDF  ${heightLabelIn} x ${widthLabelIn} дюймов; ${labelsPerPage} на страницу"
  },
  "tooltips": {
    "getWebmapFeatureLayer": "Получить векторный слой из веб-карты",
    "openCountryCodes": "Щелкнуть, чтобы получить больше информации о кодах",
    "openFieldSelector": "Щелкнуть, чтобы открыть выбор поля",
    "setAndValidateURL": "Задать и проверить URL"
  },
  "problems": {
    "noAddresseeLayers": "Укажите хотя бы один адресный слой",
    "noBufferUnitsForDrawingTools": "Настройте хотя бы одни единицы измерения буфера для инструментов рисования",
    "noBufferUnitsForSearchSource": "Настройте хотя бы одни единицы измерения буфера для источника поиска \"${sourceName}\"",
    "noGeometryServiceURL": "Настройте URL-адрес для сервиса геометрии",
    "noNotificationLabelFormats": "Укажите хотя бы один формат подписи уведомления",
    "noSearchSourceFields": "Настройте одно или несколько полей поиска для источника поиска \"${sourceName}\"",
    "noSearchSourceURL": "Настройте URL-адрес для  источника поиска\"${sourceName}\""
  },
  "querySourceSetting": {
    "sourceSetting": "Параметры источника поиска",
    "instruction": "Добавить и настроить сервисы геокодирования или векторные слои в качестве источников для поиска. Эти указанные источники определяют, что будет доступно для поиска в соответствующем диалоговом окне.",
    "add": "Добавить источник поиска",
    "addGeocoder": "Добавить геокодер",
    "geocoder": "Геокодер",
    "setLayerSource": "Установить источник слоя",
    "setGeocoderURL": "Задать URL сервиса геокодирования",
    "searchableLayer": "Векторным слоем",
    "name": "Название",
    "countryCode": "Коды стран или регионов",
    "countryCodeEg": "например ",
    "countryCodeHint": "Не заполняйте, чтобы искать по всем странам и регионам",
    "generalSetting": "Общие настройки",
    "allPlaceholder": "Замещающий текст для поиска всего: ",
    "showInfoWindowOnSelect": "Показать всплывающее окно для найденного объекта или местоположения",
    "showInfoWindowOnSelect2": "Показать всплывающее окно, если найден объект или местоположение.",
    "searchInCurrentMapExtent": "Искать только в пределах текущего экстента карты",
    "zoomScale": "Масштаб",
    "locatorUrl": "URL-адрес геокодера",
    "locatorName": "Имя геокодера",
    "locatorExample": "Пример",
    "locatorWarning": "Эта версия сервиса геокодирования не поддерживается. Виджет поддерживает сервис геокодирования версии 10.1 и более новые.",
    "locatorTips": "Нет предположений, так как сервис геокодирования не поддерживает возможность предположений.",
    "layerSource": "Исходный слой",
    "searchLayerTips": "Нет предположений, так как сервис пространственных объектов не поддерживает возможность пагинации.",
    "placeholder": "Замещающий текст",
    "searchFields": "Поля для поиска",
    "displayField": "Поле отображения",
    "exactMatch": "Точное совпадение",
    "maxSuggestions": "Максимум предложений",
    "maxResults": "Максимум результатов",
    "enableLocalSearch": "Включить локальный поиск",
    "minScale": "Мин. масштаб",
    "minScaleHint": "Когда масштаб карты крупнее данного масштаба, применяется локальный поиск",
    "radius": "Радиус",
    "radiusHint": "Укажите радиус области вокруг текущего центра карты. Он будет использоваться для повышения ранга кандидатов геокодирования так, чтобы первыми возвращались кандидаты, расположенные ближе всего",
    "meters": "Метры",
    "setSearchFields": "Установить поля для поиска",
    "set": "Установить",
    "fieldSearchable": "доступность для поиска",
    "fieldName": "Название",
    "fieldAlias": "Псевдоним",
    "ok": "OK",
    "cancel": "Отмена",
    "invalidUrlTip": "URL ${URL} является недопустимым или недостижимым."
  }
});