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
    units: {
      miles: "Мили", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Километры", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Футы", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Метры" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Параметры поиска", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Установить", // shown as a button text to set layers
      selectLayersLabel: "Выбрать слой",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Подсказка: Используется для выборки полигонального слоя и связанного с ним точечного слоя.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Выбрать символ для выделения полигона", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Символ адреса или местоположения", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Подсказка: Символ для найденных адресов или местоположений, по которым щелкнули", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Подсказка: Используется для отображения символа выбранных полигонов" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Отменить", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Выбрать полигональный слой", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Подсказка: Используется для выбора полигонального слоя.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Выбрать точечный слой, связанный с полигональным слоем", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Подсказка: Используется для выборки точечного слоя, связанного с полигональным слоем", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Выбрать полигональный слой, у которого есть связанный точечный слой.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Выбрать полигональный слой, у которого есть связанный точечный слой.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Выберите точечный слой, связанный с полигональным слоем." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Настройки маршрутов", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Сервис маршрутизации", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Сервис режима передвижения", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Установить", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Подсказка: Щелкните \"Установить\", чтобы перейти к выбору сервиса маршрутов сетевого анализа", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Единицы длины маршрутов", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Подсказка: Используется для отображения единиц измерения маршрутов", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Выбрать символ отображения маршрута", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Подсказка: Используется для отображения линейного символа маршрута", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Подсказка: Щелкните \"Установить\", чтобы перейти к выбору сервиса режима передвижения", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Укажите допустимый сервис режима передвижения", // shown as an error label in alert box when invalid travel mode service url is configured
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
      nextButton: "Далее", // shown as a button text for route service configuration panel
      backButton: "Назад", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Укажите допустимый сервис маршрутов" // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Просмотр:"
  })
);