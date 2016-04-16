define(
   ({

    chartSettingLabel: "Nastavení grafu",  //shown as a label in config UI dialog box.
    addNewLabel: "Přidat nové", //shown as a button text to add layers.
    generalSettingLabel: "Obecná nastavení", //shown as a button text to general settings button.

    layerChooser: {
      title: "Vyberte vrstvu, kterou chcete vykreslit v grafu.", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Vybrat vrstvu", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Rada: Pokud konfigurujete několik grafů, vrstvy musí mít stejný typ geometrie.", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Vyberte tabulku přidruženou k vrstvě", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Rada: Zobrazí se pouze tabulky s číselnými hodnotami.", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Vyberte vrstvu, která má přidruženou bodovou vrstvu.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Vyberte platnou tabulku/vrstvu přidruženou k vrstvě.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Vybraná vrstva nemá žádnou přidruženou tabulku/vrstvu.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Storno" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Nadpis části", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Rada: Zobrazí se v názvu záhlaví části.", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Název grafu", // shown as a label in config UI dialog box.
      chartTitleHintText: "Rada: Zobrazí se vycentrován nad grafem.", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Popis", // shown as a label in cofig UI.
      chartDescriptionHintText: "Rada: Zobrazí se pod grafem.", // shown as a hint text in config UI dialog box.
      chartType: "Typ grafu", // shown as a label which shows type of chart.
      barChart: "Sloupcový graf", // shown as a label for bar chart radio button.
      pieChart: "Výsečový graf", // shown as a label for pie chart radio button.
      dataSeriesField: "Pole datových řad", // shown as a label for selecting data series set.
      labelField: "Pole popisků", // shown as a label for selecting label field set.
      chartColor: "Barva grafu", // shown as a label which shows color for chart.
      singleColor: "Jedna barva", // shown as a label for single color radio button.
      colorByTheme: "Barva podle tématu", // shown as a label for color by theme radio button.
      colorByFieldValue: "Barva podle hodnoty pole", // shown as a label for color by field value radio button.
      xAxisTitle: "Název osy X", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Rada: název osy X", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Název osy Y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Rada: název osy Y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Štítek", // shown as a header in table.
      fieldColorColor: "Barva", // shown as a header in table.
      defaultFieldSelectLabel: "Vybrat", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Nepodařilo se nalézt hodnoty pro zvolené pole.", // shown as an error in alert box.
      errMsgSectionTitle: "Zadejte název oddílu.", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Zvolte hodnotu pole.", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Nastavení", // shown as a label of tab in config UI
      layoutTabTitle: "Rozvržení" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Obecná nastavení", // shown as a label of general setting legend.
      locationSymbolLabel: "Symbol grafického umístění", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Rada: Slouží k zobrazení symbolu pro adresu a umístění určené kliknutím.", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Interval aktualizace", // shown as a label of refresh interval.
      refreshIntervalHintText: "Rada: Slouží k obnovení grafů podle tohoto intervalu. Zadejte hodnotu v rozmezí 1–1440 minut.", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Zadejte interval obnovení v rozmezí 0–1440 minut.",  // shown as an error message.
      symbolPickerPreviewText: "Náhled:"
    }
  })
);
