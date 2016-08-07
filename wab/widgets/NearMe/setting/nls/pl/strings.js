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
      "displayText": "Mile",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilometry",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Stopy",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Metry",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Ustawienia wyszukiwania",
    "defaultBufferDistanceLabel": "Ustaw domyślną odległość buforowania",
    "maxBufferDistanceLabel": "Ustaw maksymalną odległość buforowania",
    "bufferDistanceUnitLabel": "Jednostki odległości buforowania",
    "defaultBufferHintLabel": "Wskazówka: ustaw wartość domyślną dla suwaka bufora",
    "maxBufferHintLabel": "Wskazówka: ustaw wartość maksymalną dla suwaka bufora",
    "bufferUnitLabel": "Wskazówka: zdefiniuj jednostkę na potrzeby tworzenia bufora",
    "selectGraphicLocationSymbol": "Adres lub symbol lokalizacji",
    "graphicLocationSymbolHintText": "Wskazówka: symbol wyszukiwanego adresu lub kliknięta lokalizacja",
    "fontColorLabel": "Wybierz kolor czcionki dla wyników wyszukiwania",
    "fontColorHintText": "Wskazówka: kolor czcionki dla wyników wyszukiwania",
    "zoomToSelectedFeature": "Powiększ do wybranego obiektu",
    "zoomToSelectedFeatureHintText": "Wskazówka: powiększ do wybranego obiektu zamiast do bufora",
    "intersectSearchLocation": "Zwróć przecinające się poligony",
    "intersectSearchLocationHintText": "Wskazówka: zwraca poligony zawierające szukaną lokalizację, a nie poligony w zasięgu bufora",
    "bufferVisibilityLabel": "Ustaw widoczność bufora",
    "bufferVisibilityHintText": "Wskazówka: bufor zostanie wyświetlony na mapie",
    "bufferColorLabel": "Ustaw symbol bufora",
    "bufferColorHintText": "Wskazówka: wybierz kolor i przezroczystość bufora",
    "searchLayerResultLabel": "Wyświetl tylko wybraną warstwę wyników",
    "searchLayerResultHint": "Wskazówka: na mapie zostanie wyświetlona tylko warstwa wybrana w wynikach wyszukiwania"
  },
  "layerSelector": {
    "selectLayerLabel": "Wybierz warstwy wyszukiwania",
    "layerSelectionHint": "Wskazówka: użyj przycisku ustawiania, aby wybrać warstwy",
    "addLayerButton": "Ustaw"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Ustawienia wskazówek dojazdu",
    "routeServiceUrl": "Usługa wyznaczania trasy",
    "buttonSet": "Ustaw",
    "routeServiceUrlHintText": "Wskazówka: kliknij przycisk Ustaw, aby wybrać usługę wyznaczania trasy",
    "directionLengthUnit": "Jednostki długości używane wskazówek dojazdu",
    "unitsForRouteHintText": "Wskazówka: służy do wyświetlania jednostek używanych dla wyznaczonej trasy",
    "selectRouteSymbol": "Wybierz symbol, aby wyświetlić trasę",
    "routeSymbolHintText": "Wskazówka: służy do wyświetlania symbolu liniowego trasy",
    "routingDisabledMsg": "Aby włączyć wskazówki dojazdu, włącz trasowanie (routing) w elemencie usługi ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Dodaj z usługi ArcGIS Online",
    "serviceURLabel": "Dodaj adres URL usługi",
    "routeURL": "Adres URL trasy",
    "validateRouteURL": "Sprawdź poprawność",
    "exampleText": "Przykład",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Podaj prawidłową usługę wyznaczania tras.",
    "rateLimitExceeded": "Przekroczono limit szybkości. Spróbuj ponownie później.",
    "errorInvokingService": "Nazwa użytkownika lub hasło jest nieprawidłowe."
  },
  "errorStrings": {
    "bufferErrorString": "Wpisz prawidłową wartość numeryczną.",
    "selectLayerErrorString": "Wybierz warstwy do wyszukiwania.",
    "invalidDefaultValue": "Domyślna odległość buforowania nie może być pusta. Podaj odległość buforowania",
    "invalidMaximumValue": "Maksymalna odległość buforowania nie może być pusta. Podaj odległość buforowania",
    "defaultValueLessThanMax": "Podaj domyślną odległość buforowania w ramach limitu",
    "defaultBufferValueGreaterThanZero": "Określ domyślną odległość buforowania większą niż 0",
    "maximumBufferValueGreaterThanZero": "Określ maksymalną odległość buforowania większą niż 0"
  },
  "symbolPickerPreviewText": "Zobacz podgląd:"
});