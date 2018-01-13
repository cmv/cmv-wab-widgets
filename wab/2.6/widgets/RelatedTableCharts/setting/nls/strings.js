define({
  root: ({

    chartSettingLabel: "Chart settings",  //shown as a label in config UI dialog box.
    addNewLabel: "Add new", //shown as a button text to add layers.
    generalSettingLabel: "General settings", //shown as a button text to general settings button.

    layerChooser: {
      title: "Select layer to chart", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Select layer", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Hint: If configuring multiple charts, then layers have to be of the same geometry type", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Select table related to layer", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Hint: Only tables with numeric fields are displayed", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Please select a layer which has a related point layer.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Please select a valid related table/layer to  layer.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Selected layer don't have any related table/layer." // shown as an error in alert box if Selected layer don't have any related table/layer.
    },
    ChartSetting: {
      sectionTitle: "Section title", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Hint: Displayed in section header title", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Chart title", // shown as a label in config UI dialog box.
      chartTitleHintText: "Hint: Displayed centered on top of chart", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Description", // shown as a label in cofig UI.
      chartDescriptionHintText: "Hint: Displayed below chart", // shown as a hint text in config UI dialog box.
      chartType: "Chart type", // shown as a label which shows type of chart.
      barChart: "Bar chart", // shown as a label for bar chart radio button.
      pieChart: "Pie chart", // shown as a label for pie chart radio button.
      polarChart: "Polar chart", // shown as a label for polar chart radio button
      dataSeriesField: "Data series field", // shown as a label for selecting data series set.
      labelField: "Label field", // shown as a label for selecting label field set.
      chartColor: "Chart color", // shown as a label which shows color for chart.
      singleColor: "Single color", // shown as a label for single color radio button.
      colorByTheme: "Color by theme", // shown as a label for color by theme radio button.
      colorByFieldValue: "Color by field value", // shown as a label for color by field value radio button.
      xAxisTitle: "X-axis title", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Hint: X-axis title", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y-axis title", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Hint: Y-axis title", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Label", // shown as a header in table.
      fieldColorColor: "Color", // shown as a header in table.
      defaultFieldSelectLabel: "Select", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Unable to find values for the selected field", // shown as an error in alert box.
      errMsgSectionTitle: "Please enter the section title", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Please select field value", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Setting", // shown as a label of tab in config UI
      layoutTabTitle: "Layout", // shown as a label of tab in config UI
      polarChartSelectFieldsHintText: "Hint: Select fields to generate polar chart", // shown as hint text to select fields for polar graph.
      visibilityText: "Visibility", //show as header in polar graph field table
      fieldNameText: "Field Name", //show as header in polar graph field table
      aliasNameText: "Alias", //show as header in polar graph field table
      errMsgPolarFieldsRequired: "Please select three or more fields to generate polar chart", // shown as an error in alert box if less than 3 fields selected.
      polarChartPolygonFillLabel: "Fill polygon", // shown as label to set visibility of polygons in polar graph
      polarChartPolygonFillHintText: "Hint: Select checkbox to show polygon fill in polar graph", // shown as hint text to select the checkbox to show the filled polygons in polar graph
      ThemeSelector: { // Themes Labels
        themeAdobebricks: "Adobebricks",
        themeAlgae: "Algae",
        themeBahamation: "Bahamation",
        themeBlueDusk: "BlueDusk",
        themeCubanShirts: "CubanShirts",
        themeDesert: "Desert",
        themeDistinctive: "Distinctive",
        themeDollar: "Dollar",
        themeGrasshopper: "Grasshopper",
        themeGrasslands: "Grasslands",
        themeGreySkies: "GreySkies",
        themeHarmony: "Harmony",
        themeIndigoNation: "IndigoNation",
        themeIreland: "Ireland",
        themeMiamiNice: "MiamiNice",
        themeMinty: "Minty",
        themePurpleRain: "PurpleRain",
        themeRoyalPurples: "RoyalPurples",
        themeSageToLime: "SageToLime",
        themeTufte: "Tufte",
        themeWatersEdge: "WatersEdge",
        themeWetlandText: "Wetland",
        themePlotKitblue: "PlotKit.blue",
        themePlotKitcyan: "PlotKit.cyan",
        themePlotKitgreen: "PlotKit.green",
        themePlotKitorange: "PlotKit.orange",
        themePlotKitpurple: "PlotKit.purple",
        themePlotKitred: "PlotKit.red"
      }
    },
    GeneralSetting: {
      legendGeneralSettingText: "General Settings", // shown as a label of general setting legend.
      locationSymbolLabel: "Graphic location symbol", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Hint: Used to display symbol for address and click location", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Refresh interval", // shown as a label of refresh interval.
      refreshIntervalHintText: "Hint: Used to refresh charts based on this interval. Specify a value between 1 to 1440 minutes", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Please specify the refresh interval between 0 to 1440 minutes",  // shown as an error message.
      symbolPickerPreviewText: "Preview:"
    }
  }),
  "ar": 1,
  "bs": 1,
  "cs": 1,
  "da": 1,
  "de": 1,
  "el": 1,
  "es": 1,
  "et": 1,
  "fi": 1,
  "fr": 1,
  "he": 1,
  "hi": 1,
  "hr": 1,
  "it": 1,
  "id": 1,
  "ja": 1,
  "ko": 1,
  "lt": 1,
  "lv": 1,
  "nb": 1,
  "nl": 1,
  "pl": 1,
  "pt-br": 1,
  "pt-pt": 1,
  "ro": 1,
  "ru": 1,
  "sr": 1,
  "sv": 1,
  "th": 1,
  "tr": 1,
  "vi": 1,
  "zh-cn": 1,
  "zh-hk": 1,
  "zh-tw": 1
});
