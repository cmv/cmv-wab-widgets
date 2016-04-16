/*global define*/
define(
   ({
    _widgetLabel: "Distriktsökning", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Sök efter en adress eller leta upp en plats på kartan", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Klicka om du vill lägga till en punkt", // Tooltip for location address button
    informationTabTitle: "Information", // Shown as label on information tab
    directionTabTitle: "Vägbeskrivning", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Polygonlagret har inte konfigurerats korrekt", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Det tillhörande polygonlagret har inte konfigurerats korrekt", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Ingen polygon hittades för den här adressen eller platsen", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Det gick inte att hitta den punkt som är kopplad till polygonen", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Bilagor", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Det gick inte att skapa rutten.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Popupfönster har inte konfigurerats. Resultaten kan inte visas." //Shown as a message when popups for all the layers are disabled

  })
);