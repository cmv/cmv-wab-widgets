/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Søk etter en adresse eller finn på kartet", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Klikk for å legge til punkt", // Tooltip for location address button
    informationTabTitle: "Informasjon", // Shown as label on information tab
    directionTabTitle: "Veibeskrivelser", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Polygonlaget er ikke konfigurert riktig", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Tilknyttet polygonlag er ikke konfigurert riktig", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Finner ikke polygon for adressen eller lokasjonen", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Finner ikke punktet som er knyttet til polygonen", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Vedlegg", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Kan ikke generere rute.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Popuper er ikke konfigurert. Kan ikke vise resultater." //Shown as a message when popups for all the layers are disabled

  })
);