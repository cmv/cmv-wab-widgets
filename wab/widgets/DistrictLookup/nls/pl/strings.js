/*global define*/
define(
   ({
    _widgetLabel: "Wyszukiwanie w okolicy", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Wyszukaj adres lub zlokalizuj na mapie", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Kliknij, aby dodać punkt", // Tooltip for location address button
    informationTabTitle: "Informacje", // Shown as label on information tab
    directionTabTitle: "Wskazówki dojazdu", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Warstwa poligonowa nie została poprawnie skonfigurowana.", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Powiązana warstwa punktowa nie została poprawnie skonfigurowana.", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Nie znaleziono poligonu dla tego adresu lub lokalizacji", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Nie można znaleźć punktu powiązanego z poligonem", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Załączniki", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Nie udało się wygenerować trasy.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Nie skonfigurowano okien podręcznych, nie można wyświetlić wyników." //Shown as a message when popups for all the layers are disabled

  })
);