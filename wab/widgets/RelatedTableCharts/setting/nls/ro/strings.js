define(
   ({

    chartSettingLabel: "Setări diagramă",  //shown as a label in config UI dialog box.
    addNewLabel: "Adăugare nou", //shown as a button text to add layers.
    generalSettingLabel: "Setări generale", //shown as a button text to general settings button.

    layerChooser: {
      title: "Selectare strat tematic pentru diagramă", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Selectare strat tematic", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Sugestie: Dacă realizaţi configurarea mai multor diagrame, atunci straturile tematice trebuie să fie de acelaşi tip de geometrie", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Selectare tabel corelat stratului tematic", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Sugestie: Numai tabelele cu câmpuri numerice sunt afişate", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Vă rugăm să selectaţi un strat tematic care are un strat tematic de puncte corelat.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Vă rugăm să selectaţi un tabel/strat tematic corelat stratului tematic.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Stratul tematic selectat nu are niciun tabel/strat tematic corelat.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Anulare" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Titlu secţiune", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Sugestie: Afişat în titlul antetului secţiunii", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Titlu diagramă", // shown as a label in config UI dialog box.
      chartTitleHintText: "Sugestie: Afişat centrat deasupra diagramei", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Descriere", // shown as a label in cofig UI.
      chartDescriptionHintText: "Sugestie: Afişat sub diagramă", // shown as a hint text in config UI dialog box.
      chartType: "Tip diagramă", // shown as a label which shows type of chart.
      barChart: "Diagramă cu bare", // shown as a label for bar chart radio button.
      pieChart: "Diagramă radială", // shown as a label for pie chart radio button.
      dataSeriesField: "Câmp şiruri de date", // shown as a label for selecting data series set.
      labelField: "Câmp etichetă", // shown as a label for selecting label field set.
      chartColor: "Culoare diagramă", // shown as a label which shows color for chart.
      singleColor: "O singură culoare", // shown as a label for single color radio button.
      colorByTheme: "Culoare în funcţie de temă", // shown as a label for color by theme radio button.
      colorByFieldValue: "Culoare în funcţie de valoarea câmpului", // shown as a label for color by field value radio button.
      xAxisTitle: "Titlu axa X", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Sugestie: Titlu axa X", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Titlu axa Y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Sugestie: Titlu axa Y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Etichetă", // shown as a header in table.
      fieldColorColor: "Culoare", // shown as a header in table.
      defaultFieldSelectLabel: "Selectare", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Nu s-au putut găsi valori pentru câmpul selectat", // shown as an error in alert box.
      errMsgSectionTitle: "Vă rugăm să introduceţi un titlu de secţiune", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Vă rugăm să selectaţi valoarea câmpului", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Configurare", // shown as a label of tab in config UI
      layoutTabTitle: "Configuraţie" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Setări generale", // shown as a label of general setting legend.
      locationSymbolLabel: "Simbol grafic locaţie", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Sugestie: Utilizat pentru afişarea simbolului pentru adresă şi locaţia apăsării", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Interval de reîmprospătare", // shown as a label of refresh interval.
      refreshIntervalHintText: "Sugestie: Utilizat pentru reîmprospătarea diagramelor pe baza acestui interval. Specificaţi o valoare între 1 şi 1440 minute", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Vă rugăm să specificaţi intervalul de reîmprospătare de la 0 la 1440 minute",  // shown as an error message.
      symbolPickerPreviewText: "Previzualizare:"
    }
  })
);
