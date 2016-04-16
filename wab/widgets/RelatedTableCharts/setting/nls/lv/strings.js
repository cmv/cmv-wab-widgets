define(
   ({

    chartSettingLabel: "Diagrammas iestatījumi",  //shown as a label in config UI dialog box.
    addNewLabel: "Pievienot jaunu", //shown as a button text to add layers.
    generalSettingLabel: "Vispārīgi iestatījumi", //shown as a button text to general settings button.

    layerChooser: {
      title: "Izvēlieties diagrammā attēlojamo slāni", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Izvēlēties slāni", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Padoms. Ja tiek konfigurētas vairākas diagrammas, tad slāņiem jābūt viena ģeometrijas tipa slāņiem.", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Izvēlieties ar slāni saistīto tabulu", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Padoms. Tiek rādītas tikai tabulas ar skaitliskiem laukiem", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Izvēlieties slāni, kam ir saistīts punktu slānis.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Izvēlieties derīgu ar slāni saistīto tabulu/slāni.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Izvēlētajam slānim nav nevienas saistītas tabulas/slāņa.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "Labi", //shown as a button text.
      cancelButton: "Atcelt" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Sadaļas virsraksts", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Padoms. Rādīts sadaļas galvenes virsrakstā", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Diagrammas virsraksts", // shown as a label in config UI dialog box.
      chartTitleHintText: "Padoms. Rādīts diagrammas augšdaļas centrā", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Apraksts", // shown as a label in cofig UI.
      chartDescriptionHintText: "Padoms. Rādīts zem diagrammas", // shown as a hint text in config UI dialog box.
      chartType: "Digarammas tips", // shown as a label which shows type of chart.
      barChart: "Joslu diagramma", // shown as a label for bar chart radio button.
      pieChart: "Sektoru diagramma", // shown as a label for pie chart radio button.
      dataSeriesField: "Datu sērijas lauks", // shown as a label for selecting data series set.
      labelField: "Kartes teksta lauks", // shown as a label for selecting label field set.
      chartColor: "Diagrammas krāsa", // shown as a label which shows color for chart.
      singleColor: "Vienkrāsaina", // shown as a label for single color radio button.
      colorByTheme: "Tēmas krāsa", // shown as a label for color by theme radio button.
      colorByFieldValue: "Lauka vērtības krāsa", // shown as a label for color by field value radio button.
      xAxisTitle: "X ass virsraksts", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Padoms. X ass virsraksts", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y ass virsraksts", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Padoms. Y ass virsraksts", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Kartes teksts", // shown as a header in table.
      fieldColorColor: "Krāsa", // shown as a header in table.
      defaultFieldSelectLabel: "Izvēlēties", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Nevar atrast vērtības izvēlētajam laukam", // shown as an error in alert box.
      errMsgSectionTitle: "Ievadiet sadaļas virsrakstu", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Izvēlieties lauka vērtību", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Iestatījums", // shown as a label of tab in config UI
      layoutTabTitle: "Izkārtojums" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Vispārīgie iestatījumi", // shown as a label of general setting legend.
      locationSymbolLabel: "Grafiskais izvietojuma simbols", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Padoms. Izmanto, lai parādītu adresi un noklikšķinātu uz izvietojuma", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Atjaunošanas intervāls", // shown as a label of refresh interval.
      refreshIntervalHintText: "Padoms. Izmanto diagrammu atjaunošanai norādītajā intervālā. Norādiet vērtību no 1 līdz 1440 minūtēm", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Norādiet atjaunošanas intervālu no 0 līdz 1440 minūtēm",  // shown as an error message.
      symbolPickerPreviewText: "Priekšskatījums:"
    }
  })
);
