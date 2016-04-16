/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Buscar una dirección o localizar en el mapa", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Haz clic para agregar un punto", // Tooltip for location address button
    informationTabTitle: "Información", // Shown as label on information tab
    directionTabTitle: "Indicaciones", // Shown as label on direction tab
    invalidPolygonLayerMsg: "La capa del polígono no está configurada correctamente", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "La capa del punto relacionado no está configurada correctamente", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "No se encontró ningún polígono para esta dirección o ubicación", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "No se pudo encontrar el punto asociado con el polígono.", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Adjuntos", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Error al generar la ruta.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "No se han configurado ventanas emergentes, no se pueden mostrar los resultados." //Shown as a message when popups for all the layers are disabled

  })
);