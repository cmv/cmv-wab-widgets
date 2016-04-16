define(
   ({

    chartSettingLabel: "Thiết lập biểu đồ",  //shown as a label in config UI dialog box.
    addNewLabel: "Thêm mới", //shown as a button text to add layers.
    generalSettingLabel: "Thiết lập tổng quan", //shown as a button text to general settings button.

    layerChooser: {
      title: "Chọn lớp cho biểu đồ", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Chọn lớp", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Gợi ý: Nếu cấu hình nhiều biểu đồ thì các lớp phải thuộc cùng loại hình học", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Chọn bảng liên quan đến lớp", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Mẹo: Chỉ các bảng có trường số được hiển thị", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Vui lòng chọn lớp có lớp điểm liên quan.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Vui lòng chọn bảng/lớp liên quan đến lớp.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Lớp được chọn không có bất kỳ bảng/lớp liên quan nào.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Hủy" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Tiêu đề phần", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Mẹo: Được hiển thị trong phần tiêu đề đầu trang", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Tiêu đề biểu đồ", // shown as a label in config UI dialog box.
      chartTitleHintText: "Mẹo: Được hiển thị ở giữa trên cùng của biểu đồ", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Mô tả", // shown as a label in cofig UI.
      chartDescriptionHintText: "Mẹo:Được hiển thị bên dưới biểu đồ", // shown as a hint text in config UI dialog box.
      chartType: "Loại biểu đồ", // shown as a label which shows type of chart.
      barChart: "Biểu đồ thanh", // shown as a label for bar chart radio button.
      pieChart: "Biểu đồ hình tròn", // shown as a label for pie chart radio button.
      dataSeriesField: "Trường dãy dữ liệu", // shown as a label for selecting data series set.
      labelField: "Trường nhãn", // shown as a label for selecting label field set.
      chartColor: "Màu sắc biểu đồ", // shown as a label which shows color for chart.
      singleColor: "Một màu", // shown as a label for single color radio button.
      colorByTheme: "Màu sắc theo chủ đề", // shown as a label for color by theme radio button.
      colorByFieldValue: "Màu sắc theo giá trị trường", // shown as a label for color by field value radio button.
      xAxisTitle: "Tiêu đề trục X", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Mẹo: Tiêu đề trục X", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Tiêu đề trục Y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Mẹo: Tiêu đề trục Y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Nhãn", // shown as a header in table.
      fieldColorColor: "Màu sắc", // shown as a header in table.
      defaultFieldSelectLabel: "Chọn", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Không tìm thấy giá trị cho trường được chọn", // shown as an error in alert box.
      errMsgSectionTitle: "Vui lòng nhập tiêu đề phần", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Vui lòng chọn giá trị trường", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Thiết lập", // shown as a label of tab in config UI
      layoutTabTitle: "Bố cục" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Thiết lập Tổng quan", // shown as a label of general setting legend.
      locationSymbolLabel: "Ký hiệu vị trí đồ họa", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Mẹo: Được sử dụng để hiển thị ký hiệu dành cho địa chỉ và vị trí bấm", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Khoảng thời gian làm mới", // shown as a label of refresh interval.
      refreshIntervalHintText: "Mẹo: Được sử dụng để làm mới biểu đồ theo khoảng thời gian này. Xác định giá trị trong khoảng từ 1 đến 1440 phút", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Vui lòng xác định khoảng thời gian làm mới trong khoảng từ 0 đến 1440 phút",  // shown as an error message.
      symbolPickerPreviewText: "Xem trước:"
    }
  })
);
