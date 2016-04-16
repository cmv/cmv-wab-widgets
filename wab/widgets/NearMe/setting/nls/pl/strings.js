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
        displayText: "Mile",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilometry",
        acronym: "km"
      },
      feet: {
        displayText: "Stopy",
        acronym: "ft"
      },
      meters: {
        displayText: "Metry",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Ustawienia wyszukiwania", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Ustaw domyślną wartość odległości buforowania", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Ustaw maksymalną wartość odległości buforowania na potrzeby znajdowania obiektów", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Jednostki odległości buforowania", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Wskazówka: użyj, aby ustawić wartość domyślną dla bufora", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Wskazówka: użyj, aby ustawić wartość maksymalną dla bufora", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Wskazówka: zdefiniuj jednostkę na potrzeby tworzenia bufora", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Adres lub symbol lokalizacji", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Wskazówka: symbol wyszukiwanego adresu lub kliknięta lokalizacja", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Wybierz kolor czcionki dla wyników wyszukiwania", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Wskazówka: kolor czcionki dla wyników wyszukiwania" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Wybierz warstwy wyszukiwania", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Wskazówka: użyj przycisku ustawiania, aby wybrać warstwy", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Ustaw", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Anuluj" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Ustawienia wskazówek dojazdu", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Usługa wyznaczania trasy", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Usługa trybu podróżowania", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Ustaw", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Wskazówka: kliknij przycisk Set (Ustaw), aby wybrać usługę wyznaczania trasy", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Jednostki długości używane wskazówek dojazdu", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Wskazówka: służy do wyświetlania jednostek używanych dla wyznaczonej trasy", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Wybierz symbol, aby wyświetlić trasę", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Wskazówka: służy do wyświetlania symbolu liniowego trasy", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Wskazówka: kliknij przycisk Set (Ustaw), aby wybrać usługę trybu podróżowania", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Podaj prawidłową usługę wyznaczania tras ", // shown as an error label in alert box when invalid travel mode service url is configured
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
    errorStrings: {
      bufferErrorString: "Wpisz prawidłową wartość numeryczną.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Wybierz warstwy do wyszukiwania.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Domyślna odległość buforowania nie może być pusta. Podaj odległość buforowania", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Maksymalna odległość buforowania nie może być pusta. Podaj odległość buforowania", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Podaj domyślną odległość buforowania w ramach limitu", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Określ domyślną odległość buforowania większą niż 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Określ maksymalną odległość buforowania większą niż 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Zobacz podgląd:"
  })
);