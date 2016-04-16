define(
   ({

    chartSettingLabel: "Diagraminställningar",  //shown as a label in config UI dialog box.
    addNewLabel: "Lägg till ny", //shown as a button text to add layers.
    generalSettingLabel: "Allmänna inställningar", //shown as a button text to general settings button.

    layerChooser: {
      title: "Välj vilka lager som ska användas i diagrammet", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Välj lager", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Tips: Om du konfigurerar flera diagram, måste lagren vara av samma geometrityp", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Välj en tabell med en relation till lagret", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Tips: Endast tabeller med numeriska fält visas", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Välj ett lager som har ett tillhörande punktlager.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Välj en giltig relaterad tabell eller ett giltigt relaterat lager som ska användas i lagret.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Det markerade lagret har inte någon relaterad tabell eller något relaterat lager.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Appar" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Avsnittets rubrik", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Tips: Visas i avsnittsrubriken", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Diagramtitel", // shown as a label in config UI dialog box.
      chartTitleHintText: "Tips: Visas centrerad ovanför diagrammet", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Beskrivning", // shown as a label in cofig UI.
      chartDescriptionHintText: "Tips: Visas under tabellen", // shown as a hint text in config UI dialog box.
      chartType: "Diagramtyp", // shown as a label which shows type of chart.
      barChart: "Liggande stapeldiagram", // shown as a label for bar chart radio button.
      pieChart: "Cirkeldiagram", // shown as a label for pie chart radio button.
      dataSeriesField: "Fält för dataserie", // shown as a label for selecting data series set.
      labelField: "Etikettfält", // shown as a label for selecting label field set.
      chartColor: "Diagramfärg", // shown as a label which shows color for chart.
      singleColor: "En färg", // shown as a label for single color radio button.
      colorByTheme: "Färg enligt tema", // shown as a label for color by theme radio button.
      colorByFieldValue: "Färg enligt fältvärde", // shown as a label for color by field value radio button.
      xAxisTitle: "Titel för X-axel", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Tips: Titel för X-axel", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Titel för Y-axel", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Tips: Titel för Y-axel", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Etikett", // shown as a header in table.
      fieldColorColor: "Färg", // shown as a header in table.
      defaultFieldSelectLabel: "Välj", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Det gick inte att hitta några värden för det valda fältet", // shown as an error in alert box.
      errMsgSectionTitle: "Ange avsnittstiteln", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Ange fältvärdet", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Inställning", // shown as a label of tab in config UI
      layoutTabTitle: "Layout" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Allmänna inställningar", // shown as a label of general setting legend.
      locationSymbolLabel: "Grafisk platssymbol", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Tips: Används för att visa symbolen för adress och plats som någon klickat på", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Uppdateringsintervall", // shown as a label of refresh interval.
      refreshIntervalHintText: "Tips: Används för att uppdatera diagram baserat på detta intervall. Ange ett värde mellan 1 och 1 440 minuter", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Ange ett värde för uppdateringsfrekvensen mellan 0 och 1 440 minuter",  // shown as an error message.
      symbolPickerPreviewText: "Förhandsgranska:"
    }
  })
);
