/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Zoek een adres of zoek op kaart", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Klik om punt toe te voegen", // Tooltip for location address button
    informationTabTitle: "Informatie", // Shown as label on information tab
    directionTabTitle: "Routebeschrijving", // Shown as label on direction tab
    invalidPolygonLayerMsg: "De polygoonlaag is niet correct geconfigureerd", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "De bijbehorende puntlaag is niet correct geconfigureerd.", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Geen polygoon gevonden voor dit adres of locatie", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Het punt geassocieerd met de polygoon kon niet worden gevonden", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Bijlagen", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Kan de route niet genereren", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Popups zijn niet geconfigureerd, resultaten kunnen niet worden weergegeven." //Shown as a message when popups for all the layers are disabled

  })
);