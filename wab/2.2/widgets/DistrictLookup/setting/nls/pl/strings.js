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
    "miles": "Mile",
    "kilometers": "Kilometry",
    "feet": "Stopy",
    "meters": "Metry"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Ustawienia wyszukiwania",
    "buttonSet": "Ustaw",
    "selectLayersLabel": "Zaznacz warstwę",
    "selectLayersHintText": "Wskazówka: służy do wybierania warstwy poligonowej i powiązanej z nią warstwy punktowej.",
    "selectPrecinctSymbolLabel": "Wybierz symbol, aby wyróżnić poligon",
    "selectGraphicLocationSymbol": "Adres lub symbol lokalizacji",
    "graphicLocationSymbolHintText": "Wskazówka: symbol wyszukiwanego adresu lub kliknięta lokalizacja",
    "precinctSymbolHintText": "Wskazówka: służy do wyświetlania symbolu dla wybranego poligonu",
    "selectColorForPoint": "Wybierz kolor w celu wyróżnienia punktu",
    "selectColorForPointHintText": "Wskazówka: służy do wyświetlania koloru wyróżnienia dla wybranego punktu"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Wybierz warstwę poligonową",
    "selectPolygonLayerHintText": "Wskazówka: służy do wyboru warstwy poligonowej.",
    "selectRelatedPointLayerLabel": "Wybierz warstwę punktową powiązaną z warstwą poligonową",
    "selectRelatedPointLayerHintText": "Wskazówka: służy do wyboru warstwy punktowej powiązanej z warstwą poligonową",
    "polygonLayerNotHavingRelatedLayer": "Wybierz warstwę poligonową, która ma powiązaną warstwę punktową.",
    "errorInSelectingPolygonLayer": "Wybierz warstwę poligonową, która ma powiązaną warstwę punktową.",
    "errorInSelectingRelatedLayer": "Wybierz warstwę punktową powiązaną z warstwą poligonową"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Ustawienia wskazówek dojazdu",
    "routeServiceUrl": "Usługa wyznaczania trasy",
    "buttonSet": "Ustaw",
    "routeServiceUrlHintText": "Wskazówka: kliknij przycisk Set (Ustaw), aby wybrać usługę wyznaczania trasy dla usługi sieciowej",
    "directionLengthUnit": "Jednostki długości używane wskazówek dojazdu",
    "unitsForRouteHintText": "Wskazówka: służy do wyświetlania raportowanych jednostek używanych dla trasy",
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
  "symbolPickerPreviewText": "Zobacz podgląd:"
});