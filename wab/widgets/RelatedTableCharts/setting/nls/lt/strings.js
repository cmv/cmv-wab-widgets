define(
   ({

    chartSettingLabel: "Diagramos nustatymai",  //shown as a label in config UI dialog box.
    addNewLabel: "Pridėti naują", //shown as a button text to add layers.
    generalSettingLabel: "Bendrieji parametrai", //shown as a button text to general settings button.

    layerChooser: {
      title: "Pasirinkite diagramos sluoksnį", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Pasirinkite sluoksnį", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Patarimas: jei konfigūruojate kelias diagramas, sluoksniai turi būti to paties geometrijos tipo", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Pasirinkti su sluoksniu susijusią lentelę", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Patarimas: rodomos tik lentelės su skaitiniais laukais", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Pasirinkite sluoksnį, kuriame yra susijusių taškų sluoksnis.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Pasirinkite tinkamą lentelę / sluoksnį, susijusį su sluoksniu.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Pasirinktas sluoksnis neturi susijusių lentelių / sluoksnių.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "Gerai", //shown as a button text.
      cancelButton: "Atšaukti" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Skilties pavadinimas", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Patarimas: rodoma skilties antraštės pavadinime", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Diagramos pavadinimas", // shown as a label in config UI dialog box.
      chartTitleHintText: "Patarimas: rodomas centre diagramos viršuje", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Aprašymas", // shown as a label in cofig UI.
      chartDescriptionHintText: "Patarimas: rodomas po diagrama", // shown as a hint text in config UI dialog box.
      chartType: "Diagramos tipas", // shown as a label which shows type of chart.
      barChart: "Stulpelinė diagrama", // shown as a label for bar chart radio button.
      pieChart: "Skritulinė diagrama", // shown as a label for pie chart radio button.
      dataSeriesField: "Duomenų serijos laukas", // shown as a label for selecting data series set.
      labelField: "Žymės laukas", // shown as a label for selecting label field set.
      chartColor: "Diagramos spalva", // shown as a label which shows color for chart.
      singleColor: "Viena spalva", // shown as a label for single color radio button.
      colorByTheme: "Spalva pagal temą", // shown as a label for color by theme radio button.
      colorByFieldValue: "Spalvos pagal laukų reikšmę", // shown as a label for color by field value radio button.
      xAxisTitle: "X ašies pavadinimas", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Patarimas: X ašies pavadinimas", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y ašies pavadinimas", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Patarimas: Y ašies pavadinimas", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Žymė", // shown as a header in table.
      fieldColorColor: "Spalva", // shown as a header in table.
      defaultFieldSelectLabel: "Pasirinkite", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Nepavyko rasti pasirinkto lauko reikšmių", // shown as an error in alert box.
      errMsgSectionTitle: "Įveskite skilties pavadinimą", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Pasirinkite lauko reikšmę", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Nustatymas", // shown as a label of tab in config UI
      layoutTabTitle: "Maketas" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Bendrieji parametrai", // shown as a label of general setting legend.
      locationSymbolLabel: "Grafinis vietos simbolis", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Patarimas: naudojama adreso ir paspaudimo vietos simboliui rodyti", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Atnaujinimo intervalas", // shown as a label of refresh interval.
      refreshIntervalHintText: "Patarimas: naudojama diagramoms atnaujinti, atsižvelgiant į šį intervalą. Nurodykite reikšmę nuo 1 iki 1440 minučių", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Nurodykite atnaujinimo intervalą nuo 0 iki 1440 minučių",  // shown as an error message.
      symbolPickerPreviewText: "Peržiūra:"
    }
  })
);
