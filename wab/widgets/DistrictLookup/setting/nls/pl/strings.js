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
      miles: "Mile", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometry", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Stopy", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Metry" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Ustawienia wyszukiwania", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Ustaw", // shown as a button text to set layers
      selectLayersLabel: "Zaznacz warstwę",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Wskazówka: służy do wybierania warstwy poligonowej i powiązanej z nią warstwy punktowej.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Wybierz symbol, aby wyróżnić poligon", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Adres lub symbol lokalizacji", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Wskazówka: symbol wyszukiwanego adresu lub kliknięta lokalizacja", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Wskazówka: służy do wyświetlania symbolu dla wybranego poligonu" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Anuluj", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Wybierz warstwę poligonową", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Wskazówka: służy do wyboru warstwy poligonowej.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Wybierz warstwę punktową powiązaną z warstwą poligonową", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Wskazówka: służy do wyboru warstwy punktowej powiązanej z warstwą poligonową", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Wybierz warstwę poligonową, która ma powiązaną warstwę punktową.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Wybierz warstwę poligonową, która ma powiązaną warstwę punktową.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Wybierz warstwę punktową powiązaną z warstwą poligonową" // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Ustawienia wskazówek dojazdu", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Usługa wyznaczania trasy", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Usługa trybu podróżowania", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Ustaw", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Wskazówka: kliknij przycisk Set (Ustaw), aby wybrać usługę wyznaczania trasy dla usługi sieciowej", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Jednostki długości używane wskazówek dojazdu", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Wskazówka: służy do wyświetlania raportowanych jednostek używanych dla trasy", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Wybierz symbol, aby wyświetlić trasę", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Wskazówka: służy do wyświetlania symbolu liniowego trasy", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Wskazówka: kliknij przycisk Set (Ustaw), aby wybrać usługę trybu podróży", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Podaj prawidłową usługę trybu podróżowania", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Aby włączyć wskazówki dojazdu, włącz trasowanie (routing) w elemencie usługi ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Dodaj z usługi ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Dodaj adres URL usługi", // shown as a label in route service configuration panel to add service url
      routeURL: "Adres URL trasy", // shown as a label in route service configuration panel
      validateRouteURL: "Sprawdź poprawność", // shown as a button text in route service configuration panel to validate url
      exampleText: "Przykład", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Anuluj", // shown as a button text for route service configuration panel
      nextButton: "Dalej", // shown as a button text for route service configuration panel
      backButton: "Powrót", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Podaj prawidłową usługę wyznaczania tras." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Zobacz podgląd:"
  })
);