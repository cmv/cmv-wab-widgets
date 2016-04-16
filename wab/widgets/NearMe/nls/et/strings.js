/*global define*/
define(
   ({
    _widgetLabel: "Minu lähedal", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Otsi aadressi või asukohta kaardil", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Otsingukihid on valesti konfigureeritud", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Kuva tulemused ${BufferDistance} ${BufferUnit} ulatuses", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Määrake ulatus, mis on suurem kui 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Tulemusi ei saanud leida", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Klõpsa punkti lisamiseks", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Tulemusi ei leitud ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Manused", //Shown as label on attachments header
    unableToFetchResults: "Järgmistest kihtidest ei saa tulemusi tuua:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Info", //Shown as title for information tab
    directionTabTitle: "Suund", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Marsruudi genereerimine nurjus.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Geomeetriateenus pole saadaval.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Hüpikaknad pole konfigureeritud, tulemusi ei saa kuvada." //Shown as a message when popups for all the layers are disabled
  })
);