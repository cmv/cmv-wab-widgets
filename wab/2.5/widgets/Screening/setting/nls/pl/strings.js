///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
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
    "standardUnit": "Jednostka standardowa",
    "metricUnit": "Jednostka metryczna"
  },
  "analysisTab": {
    "analysisTabLabel": "Analiza",
    "selectAnalysisLayerLabel": "Wybierz warstwy analizy",
    "addLayerLabel": "Dodaj warstwy",
    "noValidLayersForAnalysis": "Nie znaleziono prawidłowych warstw na wybranej mapie internetowej.",
    "noValidFieldsForAnalysis": "Nie znaleziono prawidłowych pól na wybranej mapie internetowej. Usuń wybraną warstwę.",
    "addLayersHintText": "Wskazówka: Wybierz warstwy i pola do przeanalizowania i wyświetlenia w raporcie",
    "addLayerNameTitle": "Nazwa warstwy tematycznej",
    "addFieldsLabel": "Dodaj pole",
    "addFieldsPopupTitle": "Wybierz pola",
    "addFieldsNameTitle": "Nazwy pola",
    "aoiToolsLegendLabel": "Narzędzia obszarów zainteresowania",
    "aoiToolsDescriptionLabel": "Aktywuj narzędzia do tworzenia obszarów zainteresowania i zdefiniuj ich etykiety",
    "placenameLabel": "Nazwa miejsca",
    "drawToolsLabel": "Narzędzia do rysowania",
    "uploadShapeFileLabel": "Prześlij plik shape",
    "coordinatesLabel": "Współrzędne",
    "coordinatesDrpDwnHintText": "Wskazówka: Wybierz jednostkę wyświetlania wprowadzonych ciągów poligonowych",
    "coordinatesBearingDrpDwnHintText": "Wskazówka: Wybierz kąt kierunkowy wyświetlania wprowadzonych ciągów poligonowych",
    "allowShapefilesUploadLabel": "Zezwalaj na przesyłanie plików shape do analizy",
    "areaUnitsLabel": "Pokaż powierzchnie/długości w",
    "allowShapefilesUploadLabelHintText": "Wskazówka: Wyświetl opcję 'Przekaż plik shape do analizy' na karcie Raport",
    "maxFeatureForAnalysisLabel": "Maks. liczba obiektów do analizy",
    "maxFeatureForAnalysisHintText": "Wskazówka: Skonfiguruj maksymalną liczbę obiektów do analizy",
    "searchToleranceLabelText": "Tolerancja wyszukiwania (stopy)",
    "searchToleranceHint": "Wskazówka: Tolerancja wyszukiwania jest używana tylko podczas analizowania danych wejściowych punktów i linii"
  },
  "downloadTab": {
    "downloadLegend": "Ustawienia pobierania",
    "reportLegend": "Ustawienia raportu",
    "downloadTabLabel": "Pobierz",
    "syncEnableOptionLabel": "Warstwy obiektów",
    "syncEnableOptionHint": "Wskazówka: Służy do pobierania informacji o obiektach przecinających obszar zainteresowania we wskazanych formatach.",
    "syncEnableOptionNote": "Uwaga: Opcja Geobaza plikowa wymaga usług obiektowych z włączoną synchronizacją.",
    "extractDataTaskOptionLabel": "Usługa geoprzetwarzania zadania Wydziel dane",
    "extractDataTaskOptionHint": "Wskazówka: Opublikowana usługa geoprzetwarzania zadania Wydziel dane umożliwia pobieranie obiektów przecinających obszar zainteresowania w formatach Geobaza plikowa i Plik shape.",
    "cannotDownloadOptionLabel": "Wyłącz pobieranie",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Nazwa warstwy",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "Geobaza plikowa",
      "allowDownloadLabel": "Zezwalaj na pobieranie"
    },
    "setButtonLabel": "Ustaw",
    "GPTaskLabel": "Podaj adres URL usługi geoprzetwarzania",
    "printGPServiceLabel": "Adres URL usługi drukowania",
    "setGPTaskTitle": "Podaj wymagany adres URL usługi geoprzetwarzania",
    "logoLabel": "Logo",
    "logoChooserHint": "Wskazówka: Kliknij ikonę obrazu, aby zmienić obraz",
    "footnoteLabel": "Przypis dolny",
    "columnTitleColorPickerLabel": "Kolor tytułów kolumn",
    "reportTitleLabel": "Tytuł raportu",
    "errorMessages": {
      "invalidGPTaskURL": "Nieprawidłowa usługa geoprzetwarzania. Wybierz usługę geoprzetwarzania zawierającą zadanie Wydziel dane.",
      "noExtractDataTaskURL": "Wybierz dowolną usługę geoprzetwarzania zawierającą zadanie Wydziel dane."
    }
  },
  "generalTab": {
    "generalTabLabel": "Ogólne",
    "tabLabelsLegend": "Etykiety paneli",
    "tabLabelsHint": "Wskazówka: Zdefiniuj etykiety",
    "AOITabLabel": "Panel obszaru zainteresowania",
    "ReportTabLabel": "Panel raportu",
    "bufferSettingsLegend": "Ustawienia bufora",
    "defaultBufferDistanceLabel": "Domyślna odległość buforowania",
    "defaultBufferUnitsLabel": "Jednostki buforowania",
    "generalBufferSymbologyHint": "Wskazówka: Skonfiguruj symbolizację wyświetlania buforów wokół zdefiniowanych obszarów zainteresowania",
    "aoiGraphicsSymbologyLegend": "Symbolizacja grafiki obszarów zainteresowania",
    "aoiGraphicsSymbologyHint": "Wskazówka: Skonfiguruj symbolizację na potrzeby definiowania obszarów zainteresowania punktów, linii i poligonów",
    "pointSymbologyLabel": "Punkt",
    "previewLabel": "Zobacz podgląd",
    "lineSymbologyLabel": "Linia",
    "polygonSymbologyLabel": "Poligon",
    "aoiBufferSymbologyLabel": "Symbolizacja buforowania",
    "pointSymbolChooserPopupTitle": "Adres lub symbol lokalizacji",
    "polygonSymbolChooserPopupTitle": "Wybierz symbol, aby wyróżnić poligon",
    "lineSymbolChooserPopupTitle": "Wybierz symbol, aby wyróżnić linię",
    "aoiSymbolChooserPopupTitle": "Ustaw symbol bufora"
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Ustawienia źródła wyszukiwania",
    "searchSourceSettingTitle": "Ustawienia źródła wyszukiwania",
    "searchSourceSettingTitleHintText": "Dodaj i skonfiguruj usługi geokodowania lub warstwy obiektów jako źródła wyszukiwania. Źródła te określają, co można wyszukiwać w oknie wyszukiwania.",
    "addSearchSourceLabel": "Dodaj źródło wyszukiwania",
    "featureLayerLabel": "Warstwa obiektów",
    "geocoderLabel": "Geokoder",
    "generalSettingLabel": "Ustawienia ogólne",
    "allPlaceholderLabel": "Tekst zastępczy dla wyszukiwania wszystkich:",
    "allPlaceholderHintText": "Wskazówka: wprowadź tekst zastępczy wyświetlany podczas przeszukiwania wszystkich warstw i geokodera",
    "generalSettingCheckboxLabel": "Wyświetl odrębne okno ze znalezionym elementem: obiektem lub miejscem",
    "countryCode": "Kod kraju lub regionu",
    "countryCodeEg": "np. ",
    "countryCodeHint": "Pozostawienie pustego pola uruchomi wyszukiwanie we wszystkich krajach i regionach",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Wyszukaj tylko w bieżącym zasięgu mapy",
    "zoomScale": "Skala powiększenia",
    "locatorUrl": "Adres URL geokodera",
    "locatorName": "Nazwa geokodera",
    "locatorExample": "Przykład",
    "locatorWarning": "Ta wersja usługi geokodowania nie jest obsługiwana. Widżet obsługuje usługę geokodowania w wersji 10.0 i nowszych.",
    "locatorTips": "Sugestie są niedostępne ponieważ usługa geokodowania nie obsługuje funkcji sugestii.",
    "layerSource": "Źródło warstwy",
    "setLayerSource": "Skonfiguruj źródło warstwy",
    "setGeocoderURL": "Skonfiguruj adres URL geokodera",
    "searchLayerTips": "Sugestie są niedostępne ponieważ usługa obiektowa nie obsługuje funkcji paginacji.",
    "placeholder": "Tekst zastępczy",
    "searchFields": "Pola wyszukiwania",
    "displayField": "Pole wyświetlania",
    "exactMatch": "Dokładne dopasowanie",
    "maxSuggestions": "Maksymalna liczba sugestii",
    "maxResults": "Wyniki maksymalne",
    "enableLocalSearch": "Włącz wyszukiwanie lokalne",
    "minScale": "Skala min.",
    "minScaleHint": "Kiedy skala mapy będzie większa niż ta skala, zostanie zastosowane wyszukiwanie lokalne",
    "radius": "Promień",
    "radiusHint": "Określa promień obszaru wokół bieżącego centrum mapy używanego do przyspieszenia oceny propozycji geokodowania, aby propozycje znajdujące się najbliżej lokalizacji były zwracane jako pierwsze",
    "setSearchFields": "Skonfiguruj pola wyszukiwania",
    "set": "Ustaw",
    "invalidUrlTip": "Adres URL ${URL} jest nieprawidłowy lub nieosiągalny.",
    "invalidSearchSources": "Nieprawidłowe ustawienia źródła wyszukiwania"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Wypełnij wymagane pola",
    "bufferDistanceFieldsErrorMsg": "Wprowadź wymagane wartości",
    "invalidSearchToleranceErrorMsg": "Wprowadź prawidłową wartość tolerancji wyszukiwania",
    "atLeastOneCheckboxCheckedErrorMsg": "Nieprawidłowa konfiguracja",
    "noLayerAvailableErrorMsg": "Brak dostępnych warstw tematycznych",
    "layerNotSupportedErrorMsg": "Nieobsługiwane ",
    "noFieldSelected": "Wybierz pola do analizy przy użyciu działania edycji.",
    "duplicateFieldsLabels": "Zduplikowana etykieta \"${labelText}\" dodana dla: \"${itemNames}\"",
    "noLayerSelected": "Wybierz co najmniej jedną warstwę do analizy",
    "errorInSelectingLayer": "Nie można ukończyć operacji wybierania warstwy. Spróbuj ponownie.",
    "errorInMaxFeatureCount": "Wybierz prawidłową maksymalną liczbę obiektów do analizy."
  }
});