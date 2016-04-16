define(
   ({

    chartSettingLabel: "Ustawienia diagramu",  //shown as a label in config UI dialog box.
    addNewLabel: "Dodaj nowy", //shown as a button text to add layers.
    generalSettingLabel: "Ustawienia ogólne", //shown as a button text to general settings button.

    layerChooser: {
      title: "Wybierz warstwę do utworzenia diagramu", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Zaznacz warstwę", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Wskazówka: w przypadku konfigurowania wielu diagramów warstwy muszą mieć ten sam typ geometrii", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Wybierz tabelę powiązaną z warstwą", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Wskazówka: tylko tabele z polami liczbowymi są wyświetlane", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Wybierz warstwę, która ma powiązaną warstwę punktową.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Wybierz prawidłową tabelę/warstwę powiązaną z warstwą.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Wybrana warstwa nie ma żadnej powiązanej tabeli/warstwy.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Anuluj" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Tytuł sekcji", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Wskazówka: wyświetlane w tytule nagłówka sekcji", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Tytuł diagramu", // shown as a label in config UI dialog box.
      chartTitleHintText: "Wskazówka: wyświetlane na środku u góry diagramu", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Opis", // shown as a label in cofig UI.
      chartDescriptionHintText: "Wskazówka: wyświetlane poniżej diagramu", // shown as a hint text in config UI dialog box.
      chartType: "Typ diagramu", // shown as a label which shows type of chart.
      barChart: "Diagram słupkowy grupowy", // shown as a label for bar chart radio button.
      pieChart: "Diagram kołowy", // shown as a label for pie chart radio button.
      dataSeriesField: "Pole serii danych", // shown as a label for selecting data series set.
      labelField: "Pole etykiety", // shown as a label for selecting label field set.
      chartColor: "Kolor diagramu", // shown as a label which shows color for chart.
      singleColor: "Jeden kolor", // shown as a label for single color radio button.
      colorByTheme: "Kolor wg motywu", // shown as a label for color by theme radio button.
      colorByFieldValue: "Kolor wg wartości pola", // shown as a label for color by field value radio button.
      xAxisTitle: "Tytuł osi X", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Wskazówka: tytuł osi X", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Tytuł osi Y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Wskazówka: tytuł osi Y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Etykieta", // shown as a header in table.
      fieldColorColor: "Kolor", // shown as a header in table.
      defaultFieldSelectLabel: "Zaznacz", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Nie można znaleźć wartości dla wybranego pola", // shown as an error in alert box.
      errMsgSectionTitle: "Podaj tytuł sekcji", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Wybierz wartość pola", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Ustawienie", // shown as a label of tab in config UI
      layoutTabTitle: "Kompozycja" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Ustawienia ogólne", // shown as a label of general setting legend.
      locationSymbolLabel: "Graficzny symbol lokalizacji", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Wskazówka: służy do wyświetlania symbolu dla adresu i lokalizacji kliknięcia", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Interwał odświeżania", // shown as a label of refresh interval.
      refreshIntervalHintText: "Wskazówka: służy do odświeżania diagramów zgodnie z tym interwałem. Określ wartość z zakresu od 1 do 1440 minut", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Podaj interwał odświeżania z zakresu od 0 do 1440 minut",  // shown as an error message.
      symbolPickerPreviewText: "Zobacz podgląd:"
    }
  })
);
