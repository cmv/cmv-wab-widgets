define(
   ({

    chartSettingLabel: "Diagramindstillinger",  //shown as a label in config UI dialog box.
    addNewLabel: "Tilføj nyt", //shown as a button text to add layers.
    generalSettingLabel: "Generelle indstillinger", //shown as a button text to general settings button.

    layerChooser: {
      title: "Vælg lag, der skal oprettes diagram over", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Vælg lag", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Tip: Hvis du konfigurerer flere diagrammer, skal lagene være af samme geometritype", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Vælg den tabel, der er knyttet til laget", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Tip: Kun tabeller med numeriske felter vises", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Vælg et lag med et tilknyttet punktlag.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Vælg en gyldig tilknyttet tabel/lag til laget.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Det valgte lag har ikke nogen tilknyttede tabeller/lag.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "&quot;.prvs&quot; er en ugyldig fil til en enkeltbrugerautorisation.", //shown as a button text.
      cancelButton: "Annuller" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Sektionstitel", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Tip: Vises i sektionsheader-titlen", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Diagramtitel", // shown as a label in config UI dialog box.
      chartTitleHintText: "Tip: Vises centreret øverst i diagrammet", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Beskrivelse", // shown as a label in cofig UI.
      chartDescriptionHintText: "Tip: Vises under diagrammet", // shown as a hint text in config UI dialog box.
      chartType: "Diagramtype", // shown as a label which shows type of chart.
      barChart: "Søjlediagram", // shown as a label for bar chart radio button.
      pieChart: "Cirkeldiagram", // shown as a label for pie chart radio button.
      dataSeriesField: "Dataseriefelt", // shown as a label for selecting data series set.
      labelField: "Etiketfelt", // shown as a label for selecting label field set.
      chartColor: "Diagramfarve", // shown as a label which shows color for chart.
      singleColor: "Enkelt farve", // shown as a label for single color radio button.
      colorByTheme: "Farve efter tema", // shown as a label for color by theme radio button.
      colorByFieldValue: "Farve efter feltværdi", // shown as a label for color by field value radio button.
      xAxisTitle: "X-aksetitel", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Tip: X-aksetitel", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y-aksetitel", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Tip: Y-aksetitel", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Mærke", // shown as a header in table.
      fieldColorColor: "Farve", // shown as a header in table.
      defaultFieldSelectLabel: "Vælg", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Kan ikke finde værdier for det valgte felt", // shown as an error in alert box.
      errMsgSectionTitle: "Angiv sektionstitlen", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Vælg feltværdi", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Indstilling", // shown as a label of tab in config UI
      layoutTabTitle: "Layout" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Generelle indstillinger", // shown as a label of general setting legend.
      locationSymbolLabel: "Grafisk positionssymbol", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Tip: Bruges til at vise symbol for adressen og position, der er klikket på", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Opdateringsinterval", // shown as a label of refresh interval.
      refreshIntervalHintText: "Tip: Bruges til at opdatere diagrammer baseret på dette interval. Angiv en værdi mellem 1 og 1440 minutter", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Angiv opdateringsinterval mellem 0 og 1440 minutter",  // shown as an error message.
      symbolPickerPreviewText: "Forhåndsvisning:"
    }
  })
);
