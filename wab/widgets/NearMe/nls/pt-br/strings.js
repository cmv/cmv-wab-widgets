/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Pesquisar um endereço ou localizar no mapa", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Pesquisar camadas que não estão configuradas corretamente", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Mostrar resultados dentro de ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Especifique uma distância maior que 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Os resultados não puderam ser localizados", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Clique para adicionar ponto", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Nenhum resultado encontrado ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Anexos", //Shown as label on attachments header
    unableToFetchResults: "Não foi possível buscar resultados das camadas:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informações", //Shown as title for information tab
    directionTabTitle: "Direção", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Falha ao gerar rota.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Serviço de geometria não disponível.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Pop-ups não estão configurados, os resultados não podem ser exibidos." //Shown as a message when popups for all the layers are disabled
  })
);