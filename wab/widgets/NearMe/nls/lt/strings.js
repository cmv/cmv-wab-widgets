/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Ieškoti adreso arba rasti žemėlapyje", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Netinkamai sukonfigūruota sluoksnių paieška", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Rezultatus pateikti ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Nurodykite atstumą, didesnį nei 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Rezultatų nerasta", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Spustelėkite, kad įtrauktumėte tašką", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Nieko nerasta ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Priedai", //Shown as label on attachments header
    unableToFetchResults: "Nepavyko rasti rezultatų sluoksnyje (-iuose):", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informacija", //Shown as title for information tab
    directionTabTitle: "Kryptis", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Nepavyko sugeneruoti maršruto.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Geometrijos paslauga negalima.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Nesukonfigūruoti iškylantys langai, rezultatų pateikti negalima." //Shown as a message when popups for all the layers are disabled
  })
);