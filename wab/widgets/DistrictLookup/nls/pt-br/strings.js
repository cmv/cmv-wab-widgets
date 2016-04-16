/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Pesquisar um endereço ou localizar no mapa", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Clique para adicionar ponto", // Tooltip for location address button
    informationTabTitle: "Informações", // Shown as label on information tab
    directionTabTitle: "Direções", // Shown as label on direction tab
    invalidPolygonLayerMsg: "A camada de polígono não está configurada corretamente", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "A camada de Ponto Relacionado não está configurada corretamente", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Nenhum polígono localizado para este endereço ou local", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Não foi possível localizar o ponto associado com o polígono", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Anexos", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Falha ao gerar rota.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Pop-ups não estão configurados, os resultados não podem ser exibidos." //Shown as a message when popups for all the layers are disabled

  })
);