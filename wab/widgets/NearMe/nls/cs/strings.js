/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Vyhledejte adresu nebo umístění na mapě.", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Vyhledávání vrstev není správně nakonfigurováno.", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Zobrazit výsledky uvnitř obalové zóny ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Zadejte vzdálenost větší než 0.", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Výsledky nelze nalézt.", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Kliknutím přidáte bod.", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Nebyly nalezeny žádné výsledky. ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Přílohy", //Shown as label on attachments header
    unableToFetchResults: "Nelze získat výsledky z vrstev:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informace", //Shown as title for information tab
    directionTabTitle: "Směr", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Nepodařilo se vygenerovat trasu.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Služba geometrie není k dispozici.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Vyskakovací okna nejsou nakonfigurována, výsledky nelze zobrazit." //Shown as a message when popups for all the layers are disabled
  })
);