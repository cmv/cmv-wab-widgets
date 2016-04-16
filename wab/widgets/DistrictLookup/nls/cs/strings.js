/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Vyhledejte adresu nebo umístění na mapě.", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Kliknutím přidáte bod.", // Tooltip for location address button
    informationTabTitle: "Informace", // Shown as label on information tab
    directionTabTitle: "Navigace", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Polygonová vrstva není správně nakonfigurována.", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Vrstva souvisejících bodů není správně nakonfigurována.", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Pro tuto adresu nebo umístění nebyl nalezen žádný polygon.", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Nelze najít bod přiřazený k tomuto polygonu.", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Přílohy", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Nepodařilo se vygenerovat trasu.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Vyskakovací okna nejsou nakonfigurována, výsledky nelze zobrazit." //Shown as a message when popups for all the layers are disabled

  })
);