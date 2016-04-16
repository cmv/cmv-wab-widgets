/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Zoek een adres of zoek op kaart", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Zoeklagen zijn niet correct geconfigureerd", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Resultaten weergeven binnen ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Geef een afstand groter dan 0 op", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Resulta(a)t(en) kon(den) niet worden gevonden", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Klik om punt toe te voegen", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Geen resultaten gevonden ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Bijlagen", //Shown as label on attachments header
    unableToFetchResults: "Kan geen resultaten ophalen van la(a)g(en):", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informatie", //Shown as title for information tab
    directionTabTitle: "Routebeschrijving", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Kan de route niet genereren", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Geometrie-service niet beschikbaar.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Popups zijn niet geconfigureerd, resultaten kunnen niet worden weergegeven." //Shown as a message when popups for all the layers are disabled
  })
);