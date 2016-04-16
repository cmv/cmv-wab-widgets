/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Hae osoitetta tai etsi kartalta", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Hakukarttatasoja ei ole määritetty oikein", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Näytä tulokset etäisyydeltä ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Määritä nollaa suurempi etäisyys", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Tuloksia ei löytynyt", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Lisää piste napsauttamalla", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Tuloksia ei löytynyt ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Liitteet", //Shown as label on attachments header
    unableToFetchResults: "Tuloksia ei voi noutaa seuraavilta karttatasoilta:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Tiedot", //Shown as title for information tab
    directionTabTitle: "Suunta", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Reitin luonti epäonnistui.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Geometriapalvelu ei ole käytettävissä.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Ponnahdusikkunoita ei ole määritetty eikä tuloksia voida näyttää." //Shown as a message when popups for all the layers are disabled
  })
);