/*global define*/
define(
   ({
    _widgetLabel: "Nära mig", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Sök efter en adress eller leta upp en plats på kartan", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Söklagren har inte konfigurerats korrekt", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Visa resultat inom ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Ange ett avstånd som är större än noll", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Det gick inte att hitta resultaten", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Klicka om du vill lägga till en punkt", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Inga resultat hittades ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Bilagor", //Shown as label on attachments header
    unableToFetchResults: "Det gick inte att hämta resultat från lagret/lagren:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Information", //Shown as title for information tab
    directionTabTitle: "Vägbeskrivning", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Det gick inte att skapa rutten.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Geometritjänsten är inte tillgänglig.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Popupfönster har inte konfigurerats. Resultaten kan inte visas." //Shown as a message when popups for all the layers are disabled
  })
);