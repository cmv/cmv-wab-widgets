define(
   ({

    chartSettingLabel: "הגדרות תרשים",  //shown as a label in config UI dialog box.
    addNewLabel: "הוסף חדש", //shown as a button text to add layers.
    generalSettingLabel: "הגדרות כלליות", //shown as a button text to general settings button.

    layerChooser: {
      title: "בחר שכבה לתרשים", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "בחר שכבה", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "רמז: אם אתה מגדיר תרשימים מרובים, סוג הגיאומטריה של השכבות חייב להיות זהה", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "בחר טבלה מקושרת לשכבה", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "רמז: רק טבלאות עם שדות מספריים מוצגות", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "בחר שכבה שיש לה שכבת נקודות מקושרת.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "בחר טבלה/שכבה מקושרת חוקית לשכבה.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "לשכבה שנבחרה אין טבלה/שכבה מקושרת.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "אישור", //shown as a button text.
      cancelButton: "בטל" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "כותרת מקטע", // shown as a label in config UI dialog box.
      sectionTitleHintText: "רמז: מוצג בכותרת הקטע", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "כותרת תרשים", // shown as a label in config UI dialog box.
      chartTitleHintText: "רמז: מוצג במרכז על גבי התרשים", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "תיאור", // shown as a label in cofig UI.
      chartDescriptionHintText: "רמז: מוצג מתחת לתרשים", // shown as a hint text in config UI dialog box.
      chartType: "סוג תרשים", // shown as a label which shows type of chart.
      barChart: "תרשים עמודות", // shown as a label for bar chart radio button.
      pieChart: "תרשים עוגה", // shown as a label for pie chart radio button.
      dataSeriesField: "שדה סדרת נתונים", // shown as a label for selecting data series set.
      labelField: "שדה תווית", // shown as a label for selecting label field set.
      chartColor: "צבע תרשים", // shown as a label which shows color for chart.
      singleColor: "צבע אחד", // shown as a label for single color radio button.
      colorByTheme: "צבע לפי ערכת נושא", // shown as a label for color by theme radio button.
      colorByFieldValue: "צבע לפי ערך שדה", // shown as a label for color by field value radio button.
      xAxisTitle: "כותרת ציר X", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "רמז: כותרת ציר X", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "כותרת ציר Y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "רמז: כותרת ציר Y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "תווית", // shown as a header in table.
      fieldColorColor: "צבע", // shown as a header in table.
      defaultFieldSelectLabel: "בחר", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "לא ניתן למצוא ערכים עבור השדה שנבחר", // shown as an error in alert box.
      errMsgSectionTitle: "הזן את כותרת הקטע", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "בחר ערך שדה", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "הגדרה", // shown as a label of tab in config UI
      layoutTabTitle: "פריסת עמוד" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "הגדרות כלליות", // shown as a label of general setting legend.
      locationSymbolLabel: "סמל מיקום גרפי", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "רמז: משמש להצגת סמל עבור כתובת ומיקום לחיצה", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "מרווח רענון", // shown as a label of refresh interval.
      refreshIntervalHintText: "רמז: משמש לרענון תרשימים בהתבסס על מרווח זה. ציין ערך בין 1 ל-1440 דקות.", // shown as an error for refresh interval.
      errMsgRefreshInterval: "ציין את מרווח הרענון בין 0 ל-1440 דקות",  // shown as an error message.
      symbolPickerPreviewText: "תצוגה מקדימה:"
    }
  })
);
