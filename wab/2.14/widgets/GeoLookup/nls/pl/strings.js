define({
  "_widgetLabel": "Geowyszukiwanie",
  "description": "Wybierz lub przeciągnij <a href='./widgets/GeoLookup/data/sample.csv' tooltip='Pobierz arkusz przykładowy' target='_blank'> arkusz kalkulacyjny</a> tutaj, aby go zwizualizować, a następnie dodaj do niego dane mapy.",
  "selectCSV": "Wybierz plik CSV",
  "loadingCSV": "Wczytywanie pliku CSV",
  "savingCSV": "Eksportuj plik CSV",
  "clearResults": "Wyczyść",
  "downloadResults": "Pobierz",
  "plotOnly": "Tylko umieść punkty",
  "plottingRows": "Umieszczanie rzędów",
  "projectionChoice": "CSV in",
  "projectionLat": "Szer./dł. geog.",
  "projectionMap": "Odwzorowanie mapy",
  "messages": "Komunikaty",
  "error": {
    "fetchingCSV": "Błąd podczas pobierania elementów z magazynu CSV: ${0}",
    "fileIssue": "Przetworzenie pliku nie powiodło się.",
    "notCSVFile": "Aktualnie obsługiwane są tylko pliki z danymi rozdzielanymi przecinkami (.csv).",
    "invalidCoord": "Pola lokalizacji są nieprawidłowe. Sprawdź plik CSV.",
    "tooManyRecords": "Niestety nie można użyć większej liczby rekordów niż ${0}.",
    "CSVNoRecords": "Plik nie zawiera żadnych rekordów.",
    "CSVEmptyFile": "Plik nie ma zawartości."
  },
  "results": {
    "csvLoaded": "Liczba rekordów wczytana z pliku CSV: ${0}",
    "recordsPlotted": "Liczba rekordów zlokalizowana na mapie: ${0}/${1}",
    "recordsEnriched": "Przetworzono: ${0}/${1}, ${2} wzbogacono względem ${3}",
    "recordsError": "Liczba rekordów z błędami: ${0}",
    "recordsErrorList": "Wystąpił problem w rzędzie ${0}",
    "label": "Wyniki CSV"
  }
});