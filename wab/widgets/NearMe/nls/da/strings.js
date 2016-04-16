/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Søg efter en adresse eller position på kortet", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Søgelag er ikke konfigureret korrekt", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Vis resultater inden for ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Angiv en afstand, der er større end 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Resultat(er) kunne ikke findes", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Klik for at tilføje et punkt", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Ingen resultater ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Vedhæftninger", //Shown as label on attachments header
    unableToFetchResults: "Kan ikke hente resultater fra lag(ene):", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Oplysninger", //Shown as title for information tab
    directionTabTitle: "Vejledning", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Kunne ikke generere rute.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Geometritjeneste er ikke tilgængelig.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Pop-ups er ikke konfigureret, resultater kan ikke vises." //Shown as a message when popups for all the layers are disabled
  })
);