define(
   ({

    chartSettingLabel: "Настройки диаграммы",  //shown as a label in config UI dialog box.
    addNewLabel: "Добавить новое", //shown as a button text to add layers.
    generalSettingLabel: "Общие настройки", //shown as a button text to general settings button.

    layerChooser: {
      title: "Выберите слой для диаграммы", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Выбрать слой", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Подсказка: Если настроено несколько диаграмм, то слои должно быть одинакового типа геометрии", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Выберите таблицу, связанную со слоем", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Подсказка: Отображаются только таблицы с числовыми полями", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Выберите слой, у которого есть связанный точечный слой.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Выберите для слоя допустимый связанный слой/таблицу.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Выберите слой, у которого нет связанного слоя/таблицы.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Отменить" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Название раздела", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Подсказка: Отображается в заголовке названия раздела", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Заголовок диаграммы", // shown as a label in config UI dialog box.
      chartTitleHintText: "Подсказка: Отображение центрируется наверху диаграммы", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Описание", // shown as a label in cofig UI.
      chartDescriptionHintText: "Подсказка: Отображение центрируется внизу диаграммы", // shown as a hint text in config UI dialog box.
      chartType: "Тип диаграммы", // shown as a label which shows type of chart.
      barChart: "Столбчатая диаграмма", // shown as a label for bar chart radio button.
      pieChart: "Круговая диаграмма", // shown as a label for pie chart radio button.
      dataSeriesField: "Поле серий данных", // shown as a label for selecting data series set.
      labelField: "Поле подписи", // shown as a label for selecting label field set.
      chartColor: "Цвет диаграммы", // shown as a label which shows color for chart.
      singleColor: "Один цвет", // shown as a label for single color radio button.
      colorByTheme: "Цвет по теме", // shown as a label for color by theme radio button.
      colorByFieldValue: "Цвет по значению поля", // shown as a label for color by field value radio button.
      xAxisTitle: "Заголовок по оси X", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Подсказка: Заголовок по оси X", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Заголовок по оси Y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Подсказка: Заголовок по оси Y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Подпись", // shown as a header in table.
      fieldColorColor: "Цвет", // shown as a header in table.
      defaultFieldSelectLabel: "Выбрать", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Невозможно найти значения для выбранного поля", // shown as an error in alert box.
      errMsgSectionTitle: "Введите заголовок раздела", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Выберите значение поля", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Параметр", // shown as a label of tab in config UI
      layoutTabTitle: "Компоновка" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Общие параметры", // shown as a label of general setting legend.
      locationSymbolLabel: "Графический символ местоположения", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Подсказка: Используется для отображения символа адресов и местоположений, на которых щелкнули", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Интервал обновления", // shown as a label of refresh interval.
      refreshIntervalHintText: "Подсказка: Используется для обновления диаграмм на основании этого интервала. Укажите значение от 1 до 1440 минут", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Укажите интервал обновления от 0 до 1440 минут.",  // shown as an error message.
      symbolPickerPreviewText: "Просмотр:"
    }
  })
);
