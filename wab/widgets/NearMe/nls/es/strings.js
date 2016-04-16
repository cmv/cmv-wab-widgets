/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Buscar una dirección o localizar en el mapa", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Las capas de búsqueda no están configuradas correctamente", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Mostrar resultados dentro de ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Especifica una distancia mayor que 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "No se encontraron resultados", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Haz clic para agregar un punto", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Ningún resultado encontrado ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Adjuntos", //Shown as label on attachments header
    unableToFetchResults: "No se pueden recuperar resultados de las capas:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Información", //Shown as title for information tab
    directionTabTitle: "Dirección", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Error al generar la ruta.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Servicio de geometría no disponible.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "No se han configurado ventanas emergentes, no se pueden mostrar los resultados." //Shown as a message when popups for all the layers are disabled
  })
);