/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Søg efter en adresse eller position på kortet", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Klik for at tilføje et punkt", // Tooltip for location address button
    informationTabTitle: "Oplysninger", // Shown as label on information tab
    directionTabTitle: "Kørselsvejledninger", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Polygonlag er ikke konfigureret korrekt", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Tilknyttet punktlag er ikke konfigureret korrekt", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Ingen polygon fundet for denne adresse eller position", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Kunne ikke finde det punkt, der er knyttet til polygonen", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Vedhæftninger", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Kunne ikke generere rute.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Pop-ups er ikke konfigureret, resultater kan ikke vises." //Shown as a message when popups for all the layers are disabled

  })
);