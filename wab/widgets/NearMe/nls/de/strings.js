/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Eine Adresse suchen oder auf der Karte verorten", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Such-Layer sind nicht ordnungsgemäß konfiguriert", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Ergebnisse in ${BufferDistance} ${BufferUnit} anzeigen", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Geben Sie eine Entfernung größer als null (0) an", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Ergebnis(se) kann/konnten nicht gefunden werden", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Klicken, um einen Punkt hinzuzufügen", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Keine Ergebnisse gefunden ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Anlagen", //Shown as label on attachments header
    unableToFetchResults: "Ergebnisse können nicht aus dem/den Layer(n) abgerufen werden:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informationen", //Shown as title for information tab
    directionTabTitle: "Wegbeschreibung", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Route konnte nicht erstellt werden.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Geometrieservice ist nicht verfügbar.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Pop-ups sind nicht konfiguriert, Ergebnisse können nicht angezeigt werden." //Shown as a message when popups for all the layers are disabled
  })
);