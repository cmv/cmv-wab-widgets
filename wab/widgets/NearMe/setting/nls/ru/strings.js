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
define(
   ({
    units: { // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit) and acronym in feature list
      miles: {
        displayText: "Мили",
        acronym: "М"
      },
      kilometers: {
        displayText: "Километры",
        acronym: "км"
      },
      feet: {
        displayText: "Футы",
        acronym: "футы"
      },
      meters: {
        displayText: "Метры",
        acronym: "м"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Параметры поиска", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Задать значение расстояния буфера по умолчанию", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Задать максимальное значение расстояния буфера для поиска объектов", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Единицы буферного расстояния", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Подсказка: Используется для установки значения по умолчанию для буфера", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Подсказка: Используется для установки максимального значения для буфера", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Подсказка: Укажите единицы измерения при создании буфера", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Символ адреса или местоположения", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Подсказка: Символ для найденных адресов или местоположений, по которым щелкнули", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Выбрать цвет шрифта для результатов поиска", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Подсказка: Цвет шрифта результатов поиска" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Выбрать слои поиска", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Подсказка: Для выбора слоев используйте кнопку Установить", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Установить", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Отменить" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Настройки маршрутов", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Сервис маршрутов", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Сервис режима передвижения", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Установить", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Подсказка: Щелкните \"Установить\", чтобы перейти к выбору сервиса маршрутов", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Единицы длины маршрутов", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Подсказка: Используется для отображения единиц измерения маршрутов", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Выбрать символ отображения маршрута", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Подсказка: Используется для отображения линейного символа маршрута", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Подсказка: Щелкните \"Установить\", чтобы перейти к выбору сервиса режима передвижения", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Укажите допустимый сервис режима передвижения ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Для включения возможности построения путевых листов убедитесь, что построение маршрутов включено в элементе ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Добавить с ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Добавить URL-адрес сервиса", // shown as a label in route service configuration panel to add service url
      routeURL: "URL маршрута", // shown as a label in route service configuration panel
      validateRouteURL: "Проверить", // shown as a button text in route service configuration panel to validate url
      exampleText: "Пример", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Отменить", // shown as a button text for route service configuration panel
      nextButton: "Следующий", // shown as a button text for route service configuration panel
      backButton: "Назад", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Укажите допустимый сервис маршрутов" // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Введите допустимое числовое значение.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Выберите слои для поиска.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Буферное расстояние по умолчанию не может быть пустым. Укажите буферное расстояние.", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Максимальное буферное расстояние не может быть пустым. Укажите буферное расстояние", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Укажите буферное расстояние по умолчанию в пределах максимально возможного", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Укажите буферное расстояние по умолчанию больше 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Укажите максимальное буферное расстояние больше 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Просмотр:"
  })
);