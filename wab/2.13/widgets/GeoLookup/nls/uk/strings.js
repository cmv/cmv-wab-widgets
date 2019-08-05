define({
  "_widgetLabel": "Геопошук",
  "description": "Перейдіть до або перетягніть <a href='./widgets/GeoLookup/data/sample.csv' tooltip='Download an example sheet' target='_blank'> електронну таблицю </a> сюди для візуалізації та приєднайте дані карти до неї.",
  "selectCSV": "Виберіть CSV",
  "loadingCSV": "Виконується завантаження CSV",
  "savingCSV": "Експорт CSV",
  "clearResults": "Очистити",
  "downloadResults": "Завантажити",
  "plotOnly": "Тільки точки на графіку",
  "plottingRows": "Виконується побудування рядків",
  "projectionChoice": "CSV в",
  "projectionLat": "Шир./довг.",
  "projectionMap": "Проекція карти",
  "messages": "Повідомлення",
  "error": {
    "fetchingCSV": "Помилка під час вибірки елементів зі сховища CSV: ${0}",
    "fileIssue": "Не вдалося обробити файл.",
    "notCSVFile": "На цей час підтримуються тільки файли з роздільниками-комами (.csv).",
    "invalidCoord": "Поля місця розташування недійсні. Перевірте файл CSV.",
    "tooManyRecords": "Вибачте, на цей час дозволяється не більше ${0} записів.",
    "CSVNoRecords": "Файл не містить записів.",
    "CSVEmptyFile": "У файлі відсутній зміст."
  },
  "results": {
    "csvLoaded": "${0} записів було завантажено з файлу CSV",
    "recordsPlotted": "${0}/${1} записів було розташовано на карті",
    "recordsEnriched": "${0}/${1} оброблено, ${2} збагачено проти ${3}",
    "recordsError": "${0} записів мали помилки",
    "recordsErrorList": "У рядку ${0} є проблема",
    "label": "Результати CSV"
  }
});