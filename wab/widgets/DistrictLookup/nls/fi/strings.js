/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Hae osoitetta tai etsi kartalta", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Lisää piste napsauttamalla", // Tooltip for location address button
    informationTabTitle: "Tiedot", // Shown as label on information tab
    directionTabTitle: "Reitti", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Aluekarttatasoa ei ole määritetty oikein", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Liittyvää pistekarttatasoa ei ole määritetty oikein", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Tälle osoitteelle tai sijainnille ei löydy aluetta", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Alueeseen liitettyä pistettä ei löytynyt", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Liitteet", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Reitin luonti epäonnistui.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Ponnahdusikkunoita ei ole määritetty eikä tuloksia voida näyttää." //Shown as a message when popups for all the layers are disabled

  })
);