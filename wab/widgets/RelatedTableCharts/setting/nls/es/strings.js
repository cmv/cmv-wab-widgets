define(
   ({

    chartSettingLabel: "Configuración de gráfico",  //shown as a label in config UI dialog box.
    addNewLabel: "Agregar nuevo", //shown as a button text to add layers.
    generalSettingLabel: "Configuración general", //shown as a button text to general settings button.

    layerChooser: {
      title: "Seleccionar capa para gráfico", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Seleccionar capa", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Sugerencia: si vas a configurar varios gráficos, las capas tienen que tener el mismo tipo de geometría", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Seleccionar tabla relacionada con capa", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Sugerencia: solo se muestran las tablas que tienen campos numéricos", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Selecciona una capa que tenga una capa de puntos relacionada.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Selecciona una tabla o capa válida relacionada con la capa.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "La capa seleccionada no tiene ninguna tabla o capa relacionada.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "Aceptar", //shown as a button text.
      cancelButton: "Cancelar" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Título de la sección", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Sugerencia: se muestra en el título del encabezado de la sección", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Título de gráfico", // shown as a label in config UI dialog box.
      chartTitleHintText: "Sugerencia: se muestra centrado en la parte superior del gráfico", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Descripción", // shown as a label in cofig UI.
      chartDescriptionHintText: "Sugerencia: se muestra debajo del gráfico", // shown as a hint text in config UI dialog box.
      chartType: "Tipo de gráfico", // shown as a label which shows type of chart.
      barChart: "Gráfico de barras", // shown as a label for bar chart radio button.
      pieChart: "Gráfico circular", // shown as a label for pie chart radio button.
      dataSeriesField: "Campo de serie de datos", // shown as a label for selecting data series set.
      labelField: "Campo de etiquetado", // shown as a label for selecting label field set.
      chartColor: "Color de gráfico", // shown as a label which shows color for chart.
      singleColor: "Color único", // shown as a label for single color radio button.
      colorByTheme: "Color por tema", // shown as a label for color by theme radio button.
      colorByFieldValue: "Color por valor de campo", // shown as a label for color by field value radio button.
      xAxisTitle: "Título de eje x", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Sugerencia: título del eje x", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Título de eje y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Sugerencia: título del eje y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Etiqueta", // shown as a header in table.
      fieldColorColor: "Color", // shown as a header in table.
      defaultFieldSelectLabel: "Seleccionar", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "No se pueden encontrar valores para el campo seleccionado", // shown as an error in alert box.
      errMsgSectionTitle: "Introduce el título de la sección", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Selecciona el valor del campo", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Configuración", // shown as a label of tab in config UI
      layoutTabTitle: "Diseño" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Configuración general", // shown as a label of general setting legend.
      locationSymbolLabel: "Símbolo de ubicación de gráfico", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Sugerencia: se utiliza para visualizar el símbolo para la dirección y ubicación en la que se hace clic", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Intervalo de actualización", // shown as a label of refresh interval.
      refreshIntervalHintText: "Sugerencia: se utiliza para actualizar los gráficos según este intervalo. Especifica un valor entre 1 y 1440 minutos", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Especifica el intervalo de actualización entre 0 y 1440 minutos.",  // shown as an error message.
      symbolPickerPreviewText: "Vista previa:"
    }
  })
);
