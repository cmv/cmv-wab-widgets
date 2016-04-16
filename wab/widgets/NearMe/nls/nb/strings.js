/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Søk etter en adresse eller finn på kartet", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Søkelagene er ikke konfigurert riktig", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Vis resultater innenfor ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Angi en avstand som er større enn 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Kan ikke finne resultat(er)", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Klikk for å legge til punkt", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Finner ingen resultater ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Vedlegg", //Shown as label on attachments header
    unableToFetchResults: "Kan ikke hente resultater fra lag:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informasjon", //Shown as title for information tab
    directionTabTitle: "Veibeskrivelse", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Kan ikke generere rute.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Geometritjenesten er ikke tilgjengelig.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Popuper er ikke konfigurert. Kan ikke vise resultater." //Shown as a message when popups for all the layers are disabled
  })
);