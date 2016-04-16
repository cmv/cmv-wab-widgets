/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Ieškoti adreso arba rasti žemėlapyje", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Spustelkite taškui pridėti", // Tooltip for location address button
    informationTabTitle: "Informacija", // Shown as label on information tab
    directionTabTitle: "Maršrutai", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Poligonų sluoksnis netinkamai sukonfigūruotas", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Susijęs taškų sluoksnis netinkamai sukonfigūruotas", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Šiam adresui arba vietai nerasta jokių poligonų", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Nepavyko rasti su šiuo poligonu susieto taško", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Priedai", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Nepavyko sugeneruoti maršruto.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Nesukonfigūruoti iškylantys langai, rezultatų pateikti negalima." //Shown as a message when popups for all the layers are disabled

  })
);