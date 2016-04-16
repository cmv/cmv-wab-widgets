define(
   ({

    chartSettingLabel: "圖表設定",  //shown as a label in config UI dialog box.
    addNewLabel: "新增", //shown as a button text to add layers.
    generalSettingLabel: "一般設定", //shown as a button text to general settings button.

    layerChooser: {
      title: "選擇要製作圖表的圖層", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "選擇圖層", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "提示: 如果配置多個圖表，則圖層必須屬於相同的幾何類型", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "選擇圖層的相關表格", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "提示: 只會顯示含數欄位的表格", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "請選擇具有相關點圖層的圖層。", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "請選擇要製作圖層之有效的相關表格/圖層。", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "選擇的圖層沒有任何相關的表格/圖層。", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "確定", //shown as a button text.
      cancelButton: "取消" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "章節標題", // shown as a label in config UI dialog box.
      sectionTitleHintText: "提示: 在區段標頭標題中顯示", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "圖表標題", // shown as a label in config UI dialog box.
      chartTitleHintText: "提示:顯示於圖表上方中央", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "說明", // shown as a label in cofig UI.
      chartDescriptionHintText: "提示:顯示於圖表下方", // shown as a hint text in config UI dialog box.
      chartType: "圖表類型", // shown as a label which shows type of chart.
      barChart: "長條圖", // shown as a label for bar chart radio button.
      pieChart: "圓餅圖", // shown as a label for pie chart radio button.
      dataSeriesField: "資料數列欄位", // shown as a label for selecting data series set.
      labelField: "標籤欄位", // shown as a label for selecting label field set.
      chartColor: "圖表顏色", // shown as a label which shows color for chart.
      singleColor: "單一顏色", // shown as a label for single color radio button.
      colorByTheme: "按主題分類的顏色", // shown as a label for color by theme radio button.
      colorByFieldValue: "按欄位值分類的顏色", // shown as a label for color by field value radio button.
      xAxisTitle: "X 軸標題", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "提示: X 軸標題", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y 軸標題", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "提示: Y 軸標題", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "標籤", // shown as a header in table.
      fieldColorColor: "顏色", // shown as a header in table.
      defaultFieldSelectLabel: "選擇", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "找不到所選欄位的值", // shown as an error in alert box.
      errMsgSectionTitle: "請輸入區段標題", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "請選擇欄位值", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "設定", // shown as a label of tab in config UI
      layoutTabTitle: "版面配置" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "一般設定", // shown as a label of general setting legend.
      locationSymbolLabel: "圖形地址符號", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "提示: 用來顯示地址和按一下位置的符號", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "重新整理間隔", // shown as a label of refresh interval.
      refreshIntervalHintText: "提示: 用來根據此間隔重新整理圖表。指定 1 到 1440 分鐘之間的值", // shown as an error for refresh interval.
      errMsgRefreshInterval: "請指定 0 到 1440 分鐘之間的重新整理間隔",  // shown as an error message.
      symbolPickerPreviewText: "預覽:"
    }
  })
);
