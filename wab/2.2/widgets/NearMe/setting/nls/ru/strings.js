/*global define*/
///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 Esri. All Rights Reserved.
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
      "displayText": "Мили",
      "acronym": "М"
    },
    "kilometers": {
      "displayText": "Километры",
      "acronym": "км"
    },
    "feet": {
      "displayText": "Футы",
      "acronym": "футы"
    },
    "meters": {
      "displayText": "Метры",
      "acronym": "м"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Параметры поиска",
    "defaultBufferDistanceLabel": "Задать буферное расстояние по умолчанию",
    "maxBufferDistanceLabel": "Задать максимальное буферное расстояние",
    "bufferDistanceUnitLabel": "Единицы буферного расстояния",
    "defaultBufferHintLabel": "Подсказка: Задайте значение по умолчанию для бегунка буфера",
    "maxBufferHintLabel": "Подсказка: Задайте максимальное значение для бегунка буфера",
    "bufferUnitLabel": "Подсказка: Укажите единицы измерения при создании буфера",
    "selectGraphicLocationSymbol": "Символ адреса или местоположения",
    "graphicLocationSymbolHintText": "Подсказка: Символ для найденных адресов или местоположений, по которым щелкнули",
    "fontColorLabel": "Выбрать цвет шрифта для результатов поиска",
    "fontColorHintText": "Подсказка: Цвет шрифта результатов поиска",
    "zoomToSelectedFeature": "Приблизиться к выбранному объекту",
    "zoomToSelectedFeatureHintText": "Подсказка: Приблизиться к выбранному объекту вместо использования буфера",
    "intersectSearchLocation": "Вернуть пересекающиеся полигоны",
    "intersectSearchLocationHintText": "Подсказка: Возвращает полигоны, содержащие местоположение поиска, вместо полигонов в пределах буфера",
    "bufferVisibilityLabel": "Задать видимость буфера",
    "bufferVisibilityHintText": "Подсказка: Буфер будет отображаться на карте",
    "bufferColorLabel": "Задать символ буфера",
    "bufferColorHintText": "Подсказка: Выберите цвет и прозрачность буфера",
    "searchLayerResultLabel": "Отображать результаты только выбранного слоя",
    "searchLayerResultHint": "Подсказка: На карте будут отображаться результаты поиска только для выбранного слоя"
  },
  "layerSelector": {
    "selectLayerLabel": "Выбрать слои поиска",
    "layerSelectionHint": "Подсказка: Для выбора слоев используйте кнопку Установить",
    "addLayerButton": "Установить"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Параметры путевых листов",
    "routeServiceUrl": "Сервис маршрутов",
    "buttonSet": "Установить",
    "routeServiceUrlHintText": "Подсказка: Щелкните Задать™, чтобы перейти к выбору сервиса маршрутизации",
    "directionLengthUnit": "Единицы длины маршрутов",
    "unitsForRouteHintText": "Подсказка: Используется для отображения единиц измерения маршрутов",
    "selectRouteSymbol": "Выбрать символ отображения маршрута",
    "routeSymbolHintText": "Подсказка: Используется для отображения линейного символа маршрута",
    "routingDisabledMsg": "Для включения возможности построения путевых листов убедитесь, что построение маршрутов включено в элементе ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Добавить с ArcGIS Online",
    "serviceURLabel": "Добавить URL-адрес сервиса",
    "routeURL": "URL маршрута",
    "validateRouteURL": "Проверить",
    "exampleText": "Пример",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Укажите допустимый сервис маршрутов",
    "rateLimitExceeded": "Достигнут лимит скорости. Попробуйте позже.",
    "errorInvokingService": "Неверное имя пользователя или пароль."
  },
  "errorStrings": {
    "bufferErrorString": "Введите допустимое числовое значение.",
    "selectLayerErrorString": "Выберите слои для поиска.",
    "invalidDefaultValue": "Буферное расстояние по умолчанию не может быть пустым. Укажите буферное расстояние.",
    "invalidMaximumValue": "Максимальное буферное расстояние не может быть пустым. Укажите буферное расстояние",
    "defaultValueLessThanMax": "Укажите буферное расстояние по умолчанию в пределах максимально возможного",
    "defaultBufferValueGreaterThanZero": "Укажите буферное расстояние по умолчанию больше 0",
    "maximumBufferValueGreaterThanZero": "Укажите максимальное буферное расстояние больше 0"
  },
  "symbolPickerPreviewText": "Просмотр:"
});