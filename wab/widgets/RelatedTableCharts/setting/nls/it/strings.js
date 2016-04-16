define(
   ({

    chartSettingLabel: "Impostazioni grafico",  //shown as a label in config UI dialog box.
    addNewLabel: "Aggiungi nuovo", //shown as a button text to add layers.
    generalSettingLabel: "Impostazioni generali", //shown as a button text to general settings button.

    layerChooser: {
      title: "Selezionare layer da rappresentare", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Seleziona layer", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Suggerimento: se si configurano più grafici, il tipo di geometria dei layer deve essere identica", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Seleziona tabella correlata a layer", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Suggerimento: vengono visualizzate solo le tabelle con campi numerici", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Selezionare un layer con un layer punto correlato.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Selezionare una tabella/layer correlato valido nel layer.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Il layer selezionato non dispone di tabella/layer correlato.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Annulla" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Titolo sezione", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Suggerimento: visualizzato nel titolo intestazione sezione", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Titolo grafico", // shown as a label in config UI dialog box.
      chartTitleHintText: "Suggerimento: visualizzato al centro nella parte superiore del grafico", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Descrizione", // shown as a label in cofig UI.
      chartDescriptionHintText: "Suggerimento: visualizzato sotto il grafico", // shown as a hint text in config UI dialog box.
      chartType: "Tipo di grafico", // shown as a label which shows type of chart.
      barChart: "Grafico a barre", // shown as a label for bar chart radio button.
      pieChart: "Grafico a torta", // shown as a label for pie chart radio button.
      dataSeriesField: "Campo serie di dati", // shown as a label for selecting data series set.
      labelField: "Campo etichetta", // shown as a label for selecting label field set.
      chartColor: "Colore grafico", // shown as a label which shows color for chart.
      singleColor: "Colore singolo", // shown as a label for single color radio button.
      colorByTheme: "Colore in base a tema", // shown as a label for color by theme radio button.
      colorByFieldValue: "Colore in base a valore campo", // shown as a label for color by field value radio button.
      xAxisTitle: "Titolo asse X", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Suggerimento: titolo asse X", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Titolo asse Y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Suggerimento: titolo asse Y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Etichetta", // shown as a header in table.
      fieldColorColor: "Colore", // shown as a header in table.
      defaultFieldSelectLabel: "Seleziona", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Impossibile trovare i valori per il campo selezionato", // shown as an error in alert box.
      errMsgSectionTitle: "Immettere i titolo di sezione", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Selezionare un valore campo", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Impostazione", // shown as a label of tab in config UI
      layoutTabTitle: "Layout" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Impostazioni generali", // shown as a label of general setting legend.
      locationSymbolLabel: "Simbolo posizione grafica", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Suggerimento: utilizzato per visualizzare simbolo per posizione indirizzo e selezione", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Intervallo di aggiornamento", // shown as a label of refresh interval.
      refreshIntervalHintText: "Suggerimento: utilizzato per aggiornare i grafici basati su questo intervallo. Specificare un valore compreso tra 1 e 1440 minuti", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Specificare l\'intervallo di aggiornamento compreso tra 0 e 1440 minuti",  // shown as an error message.
      symbolPickerPreviewText: "Anteprima:"
    }
  })
);
