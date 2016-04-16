/*global define*/
define(
   ({
    _widgetLabel: "W pobliżu", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Wyszukaj adres lub zlokalizuj na mapie", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Warstwa wyszukiwania nie została poprawnie skonfigurowana.", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Pokaż wyniki w odległości ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Określ odległość większą niż 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Nie można znaleźć wyników", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Kliknij, aby dodać punkt", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Nie znaleziono wyników ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Załączniki", //Shown as label on attachments header
    unableToFetchResults: "Nie można pobrać wyników z warstw:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informacje", //Shown as title for information tab
    directionTabTitle: "Instrukcja", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Nie udało się wygenerować trasy.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Usługa geometrii jest niedostępna.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Nie skonfigurowano okien podręcznych, nie można wyświetlić wyników." //Shown as a message when popups for all the layers are disabled
  })
);