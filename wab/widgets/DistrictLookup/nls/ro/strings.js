/*global define*/
define(
   ({
    _widgetLabel: "Căutare district", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Căutaţi o adresă sau localizaţi pe hartă", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Apăsaţi pentru a adăuga punct", // Tooltip for location address button
    informationTabTitle: "Informaţii", // Shown as label on information tab
    directionTabTitle: "Indicaţii de deplasare", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Stratul tematic de poligoane nu este configurat corect.", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Stratul tematic de puncte corelat nu este configurat corect.", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Nu a fost găsit niciun poligon pentru această adresă sau locaţie", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Nu s-a putut găsi punctul asociat acestui poligon", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Ataşări", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Generarea rutei a eşuat.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Nu sunt configurate ferestre pop-up, rezultatele nu pot fi afişate." //Shown as a message when popups for all the layers are disabled

  })
);