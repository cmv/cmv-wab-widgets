/*global define*/
define(
   ({
    _widgetLabel: "Autour de moi", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Rechercher une adresse ou localiser sur la carte", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Les couches de recherche ne sont pas correctement configurées", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Afficher les résultats au sein de ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Spécifiez une distance supérieure à 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Résultats introuvables", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Cliquez pour ajouter un point", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Aucun résultat trouvé ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Pièces jointes", //Shown as label on attachments header
    unableToFetchResults: "Impossible de récupérer les résultats à partir des couches :", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Informations", //Shown as title for information tab
    directionTabTitle: "Itinéraire", //Shown as title for direction tab
    failedToGenerateRouteMsg: "La génération de l’itinéraire a échoué.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Service de géométrie non disponible.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Les fenêtres contextuelles ne sont pas configurées, les résultats ne peuvent pas être affichés." //Shown as a message when popups for all the layers are disabled
  })
);