define(
   ({

    chartSettingLabel: "Diagraminnstillinger",  //shown as a label in config UI dialog box.
    addNewLabel: "Legg til ny", //shown as a button text to add layers.
    generalSettingLabel: "Generelle innstillinger", //shown as a button text to general settings button.

    layerChooser: {
      title: "Velg laget du vil lage diagram av", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Velg lag", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Hint: Hvis du konfigurerer flere diagrammer, må lagene ha samme geomertritype", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Velg tabell knyttet til lag", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Hint: Bare tabeller med numeriske felt vises", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Velg et lag som har et tilknyttet punktlag.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Velg en gyldig tilknyttet tabell/gyldig lag som det skal opprettes lag for.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Det valgte laget har ikke tilknyttet tabell/lag.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Avbryt" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Seksjonstittel", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Hint: Vises i overskriften for seksjonen", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Diagramtittel", // shown as a label in config UI dialog box.
      chartTitleHintText: "Hint: Vises i midten øverst på diagrammet", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Beskrivelse", // shown as a label in cofig UI.
      chartDescriptionHintText: "Hint: Vises under diagrammet", // shown as a hint text in config UI dialog box.
      chartType: "Diagramtype", // shown as a label which shows type of chart.
      barChart: "Stolpediagram", // shown as a label for bar chart radio button.
      pieChart: "Sektordiagram", // shown as a label for pie chart radio button.
      dataSeriesField: "Dataseriefelt", // shown as a label for selecting data series set.
      labelField: "Påskriftfelt", // shown as a label for selecting label field set.
      chartColor: "Diagramfarge", // shown as a label which shows color for chart.
      singleColor: "En farge", // shown as a label for single color radio button.
      colorByTheme: "Farge etter tema", // shown as a label for color by theme radio button.
      colorByFieldValue: "Farge etter feltverdi", // shown as a label for color by field value radio button.
      xAxisTitle: "Tittel på X-akse", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Hint: Tittelen på X-aksen", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Tittel på Y-akse", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Hint: Tittelen på Y-aksen", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Etikett", // shown as a header in table.
      fieldColorColor: "Farge", // shown as a header in table.
      defaultFieldSelectLabel: "Velg", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Finner ingen verdier for feltet som er valgt", // shown as an error in alert box.
      errMsgSectionTitle: "Skriv inn seksjonstittelen", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Velg en feltverdi", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Innstilling", // shown as a label of tab in config UI
      layoutTabTitle: "Oppsett" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Generelle innstillinger", // shown as a label of general setting legend.
      locationSymbolLabel: "Grafisk symbol for lokasjon", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Hint: Brukes til å vise symbol for adresse og klikket lokasjon", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Oppdateringsintervall", // shown as a label of refresh interval.
      refreshIntervalHintText: "Hint: Brukes til å oppdatere diagrammer basert på dette intervallet. Angi en verdi mellom 1 tog 1440 minutter.", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Angi et oppdateringsintervall på mellom 0 og 1440 minutter",  // shown as an error message.
      symbolPickerPreviewText: "Forhåndsvisning:"
    }
  })
);
