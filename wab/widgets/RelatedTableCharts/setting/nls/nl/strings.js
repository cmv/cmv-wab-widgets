define(
   ({

    chartSettingLabel: "Grafiekinstellingen",  //shown as a label in config UI dialog box.
    addNewLabel: "Nieuwe toevoegen", //shown as a button text to add layers.
    generalSettingLabel: "Algemene instellingen", //shown as a button text to general settings button.

    layerChooser: {
      title: "Lagen selecteren voor grafiek", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Kaartlaag selecteren", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Tip: Als u meerdere grafieken configureert, dan moeten de lagen van hetzelfde geometrietype zijn", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Selecteer tabel gerelateerd aan laag", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Tip: Alleen tabellen met numerieke velden worden weergegeven", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Selecteer een laag met een bijbehorende puntlaag.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Selecteer een geldige gerelateerde tabel/laag op laag.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Geselecteerde laag heeft geen gerelateerde tabel/laag.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Annuleren" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Sectietitel", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Tip: weergegeven in hoofdstuk koptekst", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Grafiektitel", // shown as a label in config UI dialog box.
      chartTitleHintText: "Tip: weergegeven gecentreerd aan bovenkant grafiek", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Beschrijving", // shown as a label in cofig UI.
      chartDescriptionHintText: "Tip: weergegeven onder grafiek", // shown as a hint text in config UI dialog box.
      chartType: "Grafiektype", // shown as a label which shows type of chart.
      barChart: "Staafdiagram", // shown as a label for bar chart radio button.
      pieChart: "Cirkeldiagram", // shown as a label for pie chart radio button.
      dataSeriesField: "Gegevensreeks veld", // shown as a label for selecting data series set.
      labelField: "Labelveld", // shown as a label for selecting label field set.
      chartColor: "Grafiekkleur", // shown as a label which shows color for chart.
      singleColor: "Eén kleur", // shown as a label for single color radio button.
      colorByTheme: "Kleur per thema", // shown as a label for color by theme radio button.
      colorByFieldValue: "Kleur per veldwaarde", // shown as a label for color by field value radio button.
      xAxisTitle: "X-astitel", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Tip: X-astitel", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y-astitel", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Tip: Y-astitel", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Label", // shown as a header in table.
      fieldColorColor: "Kleur", // shown as a header in table.
      defaultFieldSelectLabel: "Selecteren", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Kan geen waarden vinden voor het geselecteerde veld.", // shown as an error in alert box.
      errMsgSectionTitle: "Voer de hoofdstuktitel in.", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Selecteer de veldwaarde", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Instelling", // shown as a label of tab in config UI
      layoutTabTitle: "Lay-out" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Algemene instellingen", // shown as a label of general setting legend.
      locationSymbolLabel: "Grafisch locatiesymbool", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Tip: gebruikt voor de weergave van symbool voor adres en klik op locatie", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Interval voor vernieuwen", // shown as a label of refresh interval.
      refreshIntervalHintText: "Tip: gebruikt voor het vernieuwen van grafieken gebaseerd op deze interval. Geef een waarde op tussen 1 en 1440 minuten", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Geef de interval op voor vernieuwen tussen 0 tot 1440 minuten",  // shown as an error message.
      symbolPickerPreviewText: "Voorbeeld:"
    }
  })
);
