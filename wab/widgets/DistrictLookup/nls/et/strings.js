/*global define*/
define(
   ({
    _widgetLabel: "Piirkonna otsing", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Otsi aadressi või asukohta kaardil", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Klõpsa punkti lisamiseks", // Tooltip for location address button
    informationTabTitle: "Info", // Shown as label on information tab
    directionTabTitle: "Juhised", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Polügooni kiht on valesti konfigureeritud", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Seotud punktikiht on valesti konfigureeritud", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Selle aadressi või asukoha kohta ei leitud ühtki polügooni", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Selle polügooniga seostatud punkti ei leitud", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Manused", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Marsruudi genereerimine nurjus.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Hüpikaknad pole konfigureeritud, tulemusi ei saa kuvada." //Shown as a message when popups for all the layers are disabled

  })
);