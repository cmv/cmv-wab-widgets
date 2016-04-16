define(
   ({

    chartSettingLabel: "Configurações do gráfico",  //shown as a label in config UI dialog box.
    addNewLabel: "Adicionar novo", //shown as a button text to add layers.
    generalSettingLabel: "Configurações gerais", //shown as a button text to general settings button.

    layerChooser: {
      title: "Selecionar camada para criar gráfico", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Selecionar camada", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Sugestão: Se configurar múltiplos gráficos, então as camadas terão que ser do mesmo tipo de geometria", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Selecionar tabela relacionada à camada", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Sugestão: Somente tabelas com campos numéricos são exibidas", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Selecione uma camada que tenha uma camada de ponto relacionada.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Selecione uma tabela/camada relacionada válida para camada.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "A camada selecionada não tem nenhuma tabela/camada relacionada.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "Ok", //shown as a button text.
      cancelButton: "Cancelar" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Título da seção", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Sugestão: Exibido no título de cabeçalho da seção", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Título do gráfico", // shown as a label in config UI dialog box.
      chartTitleHintText: "Sugestão: Exibido centralizado na parte superior do gráfico", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Descrição", // shown as a label in cofig UI.
      chartDescriptionHintText: "Sugestão: Exibido abaixo do gráfico", // shown as a hint text in config UI dialog box.
      chartType: "Tipo de gráfico", // shown as a label which shows type of chart.
      barChart: "Gráfico de barra", // shown as a label for bar chart radio button.
      pieChart: "Gráfico de pizza", // shown as a label for pie chart radio button.
      dataSeriesField: "Campo da série de dados", // shown as a label for selecting data series set.
      labelField: "Campo de rótulo", // shown as a label for selecting label field set.
      chartColor: "Cor do gráfico", // shown as a label which shows color for chart.
      singleColor: "Cor única", // shown as a label for single color radio button.
      colorByTheme: "Cor por tema", // shown as a label for color by theme radio button.
      colorByFieldValue: "Cor por valor de campo", // shown as a label for color by field value radio button.
      xAxisTitle: "Título do eixo X", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Sugestão: Título do eixo X", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Título do eixo Y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Sugestão: Título do eixo Y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Rótulo", // shown as a header in table.
      fieldColorColor: "Cor", // shown as a header in table.
      defaultFieldSelectLabel: "Selecionar", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Não foi possível localizar valores para o campo selecionado", // shown as an error in alert box.
      errMsgSectionTitle: "Insira o título da seção", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Selecione o valor de campo", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Configurações", // shown as a label of tab in config UI
      layoutTabTitle: "Layout" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Configurações Gerais", // shown as a label of general setting legend.
      locationSymbolLabel: "Símbolo de local do gráfico", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Sugestão: Utilizado para exibir símbolo de endereço e clicar no local", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Intervalo de atualização", // shown as a label of refresh interval.
      refreshIntervalHintText: "Sugestão: Utilizado para atualizar gráficos baseado neste intervalo. Especifique um valor entre 1 a 1440 minutos", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Especifique o intervalo de atualização entre 0 a 1440 minutos",  // shown as an error message.
      symbolPickerPreviewText: "Visualizar:"
    }
  })
);
