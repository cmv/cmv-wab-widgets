/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Meklēt adresi vai atrast kartē", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Meklēšanas slāņi nav pareizi konfigurēti", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Rādīt rezultātus šeit: ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Norādiet attālumu, kas ir lielāks par 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Rezultātu(s) nevarēja atrast", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Noklikšķiniet, lai pievienotu punktu", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Rezultāti nav atrasti ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Piesaistes", //Shown as label on attachments header
    unableToFetchResults: "Nevarēja ienest rezultātus no slāņa(iem):", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informācija", //Shown as title for information tab
    directionTabTitle: "Virziens", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Neizdevās ģenerēt maršrutu.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Ģeometrijas pakalpojums nav pieejams.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Uznirstošie logi nav konfigurēti; rezultātus nevar parādīt." //Shown as a message when popups for all the layers are disabled
  })
);