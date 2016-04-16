/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Meklēt adresi vai atrast kartē", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Noklikšķiniet, lai pievienotu punktu", // Tooltip for location address button
    informationTabTitle: "Informācija", // Shown as label on information tab
    directionTabTitle: "Virzieni", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Laukuma slānis nav pareizi konfigurēts", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Saistītais punktu slānis nav pareizi konfigurēts", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Šai adresei vai izvietojumam nav atrasts neviens laukums", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Nevarēja atrast ar laukumu saistīto punktu", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Piesaistes", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Neizdevās ģenerēt maršrutu.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Uznirstošie logi nav konfigurēti; rezultātus nevar parādīt." //Shown as a message when popups for all the layers are disabled

  })
);