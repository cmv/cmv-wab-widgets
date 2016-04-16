/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Pesquisar um endereço ou localização no mapa", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Clique para adicionar ponto", // Tooltip for location address button
    informationTabTitle: "Informação", // Shown as label on information tab
    directionTabTitle: "Direcções", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Camada polígono não está configurada correctamente", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Camada de Ponto relacionada não está configurada correctamente", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Não foi encontrado polígono para este endereço ou localização", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Não pode encontrar o ponto associado com o polígono", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Anexos", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Falha a gerar rota.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Popups não configuradas, resultados podem não ser exibidos." //Shown as a message when popups for all the layers are disabled

  })
);