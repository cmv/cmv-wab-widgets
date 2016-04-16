/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Eine Adresse suchen oder auf der Karte verorten", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Klicken, um einen Punkt hinzuzufügen", // Tooltip for location address button
    informationTabTitle: "Informationen", // Shown as label on information tab
    directionTabTitle: "Wegbeschreibung", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Polygon-Layer ist nicht ordnungsgemäß konfiguriert", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Zugehöriger Punkt-Layer ist nicht ordnungsgemäß konfiguriert", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Für diese Adresse oder Position wurde kein Polygon gefunden", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Der mit dem Polygon verknüpfte Punkt konnte nicht gefunden werden", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Anlagen", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Route konnte nicht erstellt werden.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Pop-ups sind nicht konfiguriert, Ergebnisse können nicht angezeigt werden." //Shown as a message when popups for all the layers are disabled

  })
);