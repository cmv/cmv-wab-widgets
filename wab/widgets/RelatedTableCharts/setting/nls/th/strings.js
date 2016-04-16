define(
   ({

    chartSettingLabel: "การตั้งค่าแผนภูมิ",  //shown as a label in config UI dialog box.
    addNewLabel: "เพิ่มข้อมูลใหม่", //shown as a button text to add layers.
    generalSettingLabel: "การคั้งค่าทั่วไป", //shown as a button text to general settings button.

    layerChooser: {
      title: "เลือกชั้นข้อมูลเพื่อสร้างแผนภูมิ", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "เลือกชั้นข้อมูล", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "คำแนะนำ : หากตั้งค่าแผนภูมิมากกว่า 1 ชั้นข้อมูลจะต้องเป็นประเภทเดียวกัน", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "เลือกตารางที่สัมพันธ์กับชั้นข้อมูล", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "คำแนะนำ : เฉพาะตารางที่เป็นตัวเลขเท่านั้นจะถูกแสดงผล", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "กรุณาเลือกชั้นข้อมูลที่สัมพันธ์กับจุด", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "กรุณาเลือกค่าที่ถูกต้องสัมพันธ์กับตาราง / ชั้นข้อมูล", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "เลือกข้อมูลที่ไม่มีความสัมพันธ์กับตาราง / ชั้นข้อมูล", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "ตกลง", //shown as a button text.
      cancelButton: "ยกเลิก" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "ชื่อเซสชั่น", // shown as a label in config UI dialog box.
      sectionTitleHintText: "คำแนะนำ : แสดงผลในส่วนของชื่อ", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "ชื่อแผนภูมิ", // shown as a label in config UI dialog box.
      chartTitleHintText: "คำแนะนำ : แสดงผลส่วนบนสุด ตรงกลางของแผนภูมิ", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "คำอธิบาย", // shown as a label in cofig UI.
      chartDescriptionHintText: "คำแนะนำ : แสดงผลตามแผนภูมิด้านล่าง", // shown as a hint text in config UI dialog box.
      chartType: "ประเภทแผนภูมิ", // shown as a label which shows type of chart.
      barChart: "แผนภูมิแท่ง", // shown as a label for bar chart radio button.
      pieChart: "แผนภูมิทรงกลม", // shown as a label for pie chart radio button.
      dataSeriesField: "ฟิลด์ชุดข้อมูล", // shown as a label for selecting data series set.
      labelField: "ฟิลด์ป้ายชื่อ", // shown as a label for selecting label field set.
      chartColor: "สีแผนภูมิ", // shown as a label which shows color for chart.
      singleColor: "สีเดียว", // shown as a label for single color radio button.
      colorByTheme: "ธีมสี", // shown as a label for color by theme radio button.
      colorByFieldValue: "สีโดยค่าของฟิลด์", // shown as a label for color by field value radio button.
      xAxisTitle: "ชื่อแกน X", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "คำแนะนำ : ชื่อแกน X", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "ชื่อแกน Y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "คำแนะนำ : ชื่อแกน Y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "ป้ายชื่อ", // shown as a header in table.
      fieldColorColor: "สี", // shown as a header in table.
      defaultFieldSelectLabel: "เลือก", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "ไม่สามรถค้นหาเพื่อเลือกฟิลด์ได้", // shown as an error in alert box.
      errMsgSectionTitle: "กรุณากรอกชื่อส่วนย่อย", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "กรุณาเลือกค่าในฟิลด์", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "การตั้งค่า", // shown as a label of tab in config UI
      layoutTabTitle: "หน้ากระดาษ" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "ตั้งค่าทั่วไป", // shown as a label of general setting legend.
      locationSymbolLabel: "สัญลักษณ์ตำแหน่งกราฟิก", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "คำแนะนำ : ใช้เพื่อแสดงผลสัญลักษณ์สำหรับที่อยู่และการคลิกตำแหน่ง", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "รีเฟรชอันตรภาคชั้น", // shown as a label of refresh interval.
      refreshIntervalHintText: "คำแนะนำ : ใช้เพื่อรีเฟรชแผนภูมิที่ช่วงห่างเท่ากัน ระบุค่าระหว่าง 1 – 1440 นาที", // shown as an error for refresh interval.
      errMsgRefreshInterval: "กรุณาระบุค่าเพื่อรีเฟรชช่วงห่าง ระหว่าง 0 – 1440 นาที",  // shown as an error message.
      symbolPickerPreviewText: "ดูตัวอย่าง:"
    }
  })
);
