define(
   ({

    chartSettingLabel: "图表设置",  //shown as a label in config UI dialog box.
    addNewLabel: "新增", //shown as a button text to add layers.
    generalSettingLabel: "常规设置", //shown as a button text to general settings button.

    layerChooser: {
      title: "选择要制表的图层", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "选择图层", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "提示: 如果配置多个图表，则图层必须为相同的几何类型", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "选择图层的相关表", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "提示: 仅显示含数值字段的表", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "请选择具有相关点图层的图层。", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "请选择图层的有效相关表/图层。", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "所选图层不具有任何相关表/图层。", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "确定", //shown as a button text.
      cancelButton: "取消" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "章节标题", // shown as a label in config UI dialog box.
      sectionTitleHintText: "提示: 显示在章节页眉标题中", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "图表标题", // shown as a label in config UI dialog box.
      chartTitleHintText: "提示: 居中显示在图表顶部", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "说明", // shown as a label in cofig UI.
      chartDescriptionHintText: "提示: 显示在图表下方", // shown as a hint text in config UI dialog box.
      chartType: "图表类型", // shown as a label which shows type of chart.
      barChart: "条形图", // shown as a label for bar chart radio button.
      pieChart: "饼图", // shown as a label for pie chart radio button.
      dataSeriesField: "数据系列字段", // shown as a label for selecting data series set.
      labelField: "标注字段", // shown as a label for selecting label field set.
      chartColor: "图表颜色", // shown as a label which shows color for chart.
      singleColor: "单色", // shown as a label for single color radio button.
      colorByTheme: "按主题分类的颜色", // shown as a label for color by theme radio button.
      colorByFieldValue: "按字段值分类的颜色", // shown as a label for color by field value radio button.
      xAxisTitle: "X 轴标题", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "提示: X 轴标题", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y 轴标题", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "提示: Y 轴标题", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "标注", // shown as a header in table.
      fieldColorColor: "颜色", // shown as a header in table.
      defaultFieldSelectLabel: "选择", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "无法找到所选字段的值", // shown as an error in alert box.
      errMsgSectionTitle: "请输入章节标题", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "请选择字段值", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "设置", // shown as a label of tab in config UI
      layoutTabTitle: "布局" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "常规设置", // shown as a label of general setting legend.
      locationSymbolLabel: "图形位置符号", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "提示: 用于显示地址符号和单击位置", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "刷新间隔", // shown as a label of refresh interval.
      refreshIntervalHintText: "提示: 用于根据此间隔刷新图表。请在 1 到 1440 分钟的区间内指定一个值", // shown as an error for refresh interval.
      errMsgRefreshInterval: "请在 0 到 1440 分钟的区间内指定刷新间隔",  // shown as an error message.
      symbolPickerPreviewText: "预览:"
    }
  })
);
