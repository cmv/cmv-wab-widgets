/*global define*/
define(
   ({
    _widgetLabel: "În apropierea mea", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Căutaţi o adresă sau localizaţi pe hartă", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Căutaţi straturi tematice care nu sunt configurate corespunzător", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Afişare rezultate pe o rază de ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Vă rugăm să specificaţi o distanţă mai mare de 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Nu au fost găsite rezultate", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Apăsaţi pentru a adăuga punct", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Nu a fost găsit niciun rezultat ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Ataşări", //Shown as label on attachments header
    unableToFetchResults: "Nu s-au putut prelua rezultate din straturile tematice:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informaţii", //Shown as title for information tab
    directionTabTitle: "Indicaţie", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Generarea rutei a eşuat.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Serviciul de geometrie nu este disponibil.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Nu sunt configurate ferestre pop-up, rezultatele nu pot fi afişate." //Shown as a message when popups for all the layers are disabled
  })
);