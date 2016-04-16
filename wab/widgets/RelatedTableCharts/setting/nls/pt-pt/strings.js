define(
   ({

    chartSettingLabel: "Definições de gráfico",  //shown as a label in config UI dialog box.
    addNewLabel: "Adicionar novo", //shown as a button text to add layers.
    generalSettingLabel: "Configurações gerais", //shown as a button text to general settings button.

    layerChooser: {
      title: "Seleccionar camada para gráfico", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Seleccionar Camada", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Sugestão: Se configurando múltiplos gráficos, então camadas devem ser do mesmo tipo geométrico", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Seleccionar tabela relacionada a camada", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Sugestão: Apenas tabelas com campos numéricos são exibidos", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Por favor seleccione uma camada que tem uma camada de ponto relacionado.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Por favor seleccione uma tabela/camada relacionada válida para camada.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Seleccionar camada que não tenha qualuqer tabela/camada relacionada", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Cancelar" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Título da secção", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Sugestão: Exibido no título do cabeçalho da secção", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Título de gráfico", // shown as a label in config UI dialog box.
      chartTitleHintText: "Sugestão:Exibido centrado no topo do gráfico", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Descrição", // shown as a label in cofig UI.
      chartDescriptionHintText: "Sugestão:Exibido debaixo do gráfico", // shown as a hint text in config UI dialog box.
      chartType: "Tipo de gráfico", // shown as a label which shows type of chart.
      barChart: "Gráfico de barras", // shown as a label for bar chart radio button.
      pieChart: "Gráfico circular", // shown as a label for pie chart radio button.
      dataSeriesField: "Campo de série de dados", // shown as a label for selecting data series set.
      labelField: "Campo de rótulo", // shown as a label for selecting label field set.
      chartColor: "Cor de gráfico", // shown as a label which shows color for chart.
      singleColor: "Cor única", // shown as a label for single color radio button.
      colorByTheme: "Cor por tema", // shown as a label for color by theme radio button.
      colorByFieldValue: "Cor por campo de valor", // shown as a label for color by field value radio button.
      xAxisTitle: "Título eixo-x", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Sugestão: Título eixo-x", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Título eixo-y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Sugestão: Título eixo-y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Rótulo", // shown as a header in table.
      fieldColorColor: "Cor", // shown as a header in table.
      defaultFieldSelectLabel: "Seleccionar", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Incapaz de descobrir valores para o campo seleccionado", // shown as an error in alert box.
      errMsgSectionTitle: "Por favor introduza o título de secção", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Por favor seleccione valor de campo", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Definição", // shown as a label of tab in config UI
      layoutTabTitle: "Layout" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Configurações Gerais", // shown as a label of general setting legend.
      locationSymbolLabel: "Símbolo de gráfico de localização", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Sugestão: Usado para exibir símbolo para endereço e clique localização", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Intervalo de actualização", // shown as a label of refresh interval.
      refreshIntervalHintText: "Sugestão: Usado para actualizar gráficos baseado neste intervalo. Especifique um valor entre 1 até 1440 minutos", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Por favor especifique o intervalo de actualização entre 0 e 1440 minutos",  // shown as an error message.
      symbolPickerPreviewText: "Visualizar:"
    }
  })
);
