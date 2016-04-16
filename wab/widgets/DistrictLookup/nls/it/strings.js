/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Cercare un indirizzo o individuarlo sulla mappa", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Fare clic per aggiungere un punto", // Tooltip for location address button
    informationTabTitle: "Informazioni", // Shown as label on information tab
    directionTabTitle: "Indicazioni stradali", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Layer poligono non configurato correttamente", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Layer punto correlato non configurato correttamente", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Nessun poligono trovato per questo indirizzo o posizione", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Impossibile trovare il punto associato al poligono", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Allegati", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Impossibile generare il percorso.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "I popup non sono configurati e i risultati non possono essere visualizzati." //Shown as a message when popups for all the layers are disabled

  })
);