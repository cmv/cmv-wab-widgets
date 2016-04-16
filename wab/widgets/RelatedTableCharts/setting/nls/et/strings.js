define(
   ({

    chartSettingLabel: "Diagrammi seaded",  //shown as a label in config UI dialog box.
    addNewLabel: "Lisa uus", //shown as a button text to add layers.
    generalSettingLabel: "Üldseaded", //shown as a button text to general settings button.

    layerChooser: {
      title: "Vali diagrammi jaoks kiht", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Vali kiht", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Vihje: mitme diagrammi konfigureerimisel peab kihtidel olema sama geomeetria tüüp", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Vali kihiga seotud tabel", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Vihje: kuvatakse ainult numbriväljadega tabelid", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Valige kiht, millega on seotud punktikiht.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Valige kihi jaoks sobiv seotud tabel/kiht.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Valitud kihil pole ühtki seotud tabelit/kihti.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Tühista" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Jaotise pealkiri", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Vihje: kuvatakse jaotise päise pealkirjas", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Diagrammi pealkiri", // shown as a label in config UI dialog box.
      chartTitleHintText: "Vihje: kuvatakse diagrammi peal keskel", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Kirjeldus", // shown as a label in cofig UI.
      chartDescriptionHintText: "Vihje: kuvatakse diagrammi all", // shown as a hint text in config UI dialog box.
      chartType: "Diagrammi tüüp", // shown as a label which shows type of chart.
      barChart: "Lintdiagramm", // shown as a label for bar chart radio button.
      pieChart: "Sektordiagramm", // shown as a label for pie chart radio button.
      dataSeriesField: "Andmeseeria väli", // shown as a label for selecting data series set.
      labelField: "Märgise väli", // shown as a label for selecting label field set.
      chartColor: "Diagrammi värv", // shown as a label which shows color for chart.
      singleColor: "Üks värv", // shown as a label for single color radio button.
      colorByTheme: "Värv teema järgi", // shown as a label for color by theme radio button.
      colorByFieldValue: "Värv välja väärtuse järgi", // shown as a label for color by field value radio button.
      xAxisTitle: "X-telje pealkiri", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Vihje: X-telje pealkiri", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y-telje pealkiri", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Vihje: Y-telje pealkiri", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Märgis", // shown as a header in table.
      fieldColorColor: "Värv", // shown as a header in table.
      defaultFieldSelectLabel: "Vali", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Ei leia valitud välja väärtusi", // shown as an error in alert box.
      errMsgSectionTitle: "Sisestage jaotise pealkiri", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Valige välja väärtus", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Seade", // shown as a label of tab in config UI
      layoutTabTitle: "Paigutus" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Üldseaded", // shown as a label of general setting legend.
      locationSymbolLabel: "Graafiline asukohasümbol", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Vihje: kasutatakse aadressi ja klõpsamiskoha sümboli kuvamiseks", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Värskendamise intervall", // shown as a label of refresh interval.
      refreshIntervalHintText: "Vihje: kasutatakse diagrammide värskendamiseks selle intervalli alusel. Määrake väärtus vahemikus 1 kuni 1440 minutit", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Määrake värskendamise intervall vahemikus 0 kuni 1440 minutit",  // shown as an error message.
      symbolPickerPreviewText: "Eelvaade:"
    }
  })
);
