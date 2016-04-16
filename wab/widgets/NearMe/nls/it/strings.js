/*global define*/
define(
   ({
    _widgetLabel: "Nelle vicinanze", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Cercare un indirizzo o individuarlo sulla mappa", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Layer di ricerca non configurati correttamente", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Mostra risultati all\'interno di ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Specificare una distanza maggiore di 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Impossibile trovare risultato(i)", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Fare clic per aggiungere un punto", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Nessun risultato trovato ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Allegati", //Shown as label on attachments header
    unableToFetchResults: "Impossibile recuperare risultati da layer:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informazioni", //Shown as title for information tab
    directionTabTitle: "Direzione", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Impossibile generare il percorso.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Servizio geometria non disponibile.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "I popup non sono configurati e i risultati non possono essere visualizzati." //Shown as a message when popups for all the layers are disabled
  })
);