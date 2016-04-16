define(
   ({

    chartSettingLabel: "إعدادات الدردشة",  //shown as a label in config UI dialog box.
    addNewLabel: "إضافة جديد", //shown as a button text to add layers.
    generalSettingLabel: "الإعدادات العامة", //shown as a button text to general settings button.

    layerChooser: {
      title: "حدد طبقة لتخطيطها", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "حدد الطبقة", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "تلميح: إذا قمت بتكوين مخططات متعددة، يجب أن تكون الطبقات بنفس نوع الشكل الهندسي", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "حدد جدولاً متصلا بطبقة", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "تلميح: يتم عرض الجداول ذات الحقول الرقمية فقط", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "يرجى تحديد مضلع بطبقة نقطية ذات صلة.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "يرجى تحديد طبقة/جدول صحيح ذو/ذات صلة بالطبقة.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "الطبقة المحددة لا تحتوي على أي طبقة/جدول ذات/ذي صلة.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "موافق", //shown as a button text.
      cancelButton: "إلغاء الأمر" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "عنوان المقطع", // shown as a label in config UI dialog box.
      sectionTitleHintText: "تلميح: يُعرَض في عنوان رأس صفحة القسم", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "عنوان المخطط", // shown as a label in config UI dialog box.
      chartTitleHintText: "تلميح: يُعرض في وسط قمة المخطط", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "الوصف", // shown as a label in cofig UI.
      chartDescriptionHintText: "تلميح: يُعرض أدنى المخطط", // shown as a hint text in config UI dialog box.
      chartType: "نوع المخطط", // shown as a label which shows type of chart.
      barChart: "المخطط الشريطي", // shown as a label for bar chart radio button.
      pieChart: "المخطط الدائري", // shown as a label for pie chart radio button.
      dataSeriesField: "حقل سلسلة البيانات", // shown as a label for selecting data series set.
      labelField: "حقل التسمية", // shown as a label for selecting label field set.
      chartColor: "لون المخطط", // shown as a label which shows color for chart.
      singleColor: "لون واحد", // shown as a label for single color radio button.
      colorByTheme: "اللون بواسطة النّسُق", // shown as a label for color by theme radio button.
      colorByFieldValue: "اللون بواسطة قيمة الحقل", // shown as a label for color by field value radio button.
      xAxisTitle: "عنوان محور X", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "تلميح: عنوان محور X", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "عنوان محور Y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "تلميح: عنوان محور Y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "التسمية", // shown as a header in table.
      fieldColorColor: "لون", // shown as a header in table.
      defaultFieldSelectLabel: "تحديد", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "يتعذر العثور على قيم الحقل المحدد", // shown as an error in alert box.
      errMsgSectionTitle: "يرجى إدخال عنوان القسم", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "يرجى تحديد قيمة الحقل", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "إعداد", // shown as a label of tab in config UI
      layoutTabTitle: "تخطيط" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "إعدادات عامة", // shown as a label of general setting legend.
      locationSymbolLabel: "رمز الموقع البياني", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "تلميح: يُستخدم لعرض رمز العنوان والموقع الذي تم النقر عليه", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "تحديث الفاصل", // shown as a label of refresh interval.
      refreshIntervalHintText: "تلميح: يُستخدم لتحديث المخططات بناءً على هذا الفاصل. حدد قيمة بين 1 و1440 دقيقة", // shown as an error for refresh interval.
      errMsgRefreshInterval: "يرجى تحديد فاصل التحديث بين 0 و1440 دقيقة",  // shown as an error message.
      symbolPickerPreviewText: "معاينة:"
    }
  })
);
