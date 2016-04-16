/*global define*/
define(
   ({
    _widgetLabel: "Recherche de secteur", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Rechercher une adresse ou localiser sur la carte", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Cliquez pour ajouter un point", // Tooltip for location address button
    informationTabTitle: "Informations", // Shown as label on information tab
    directionTabTitle: "Calcul d\'itinéraires", // Shown as label on direction tab
    invalidPolygonLayerMsg: "La couche de polygones n’est pas correctement configurée", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "La couche de points associée n’est pas correctement configurée", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Aucun polygone trouvé pour cette adresse ou cet emplacement", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Impossible de trouver le point associé au polygone", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Pièces jointes", //Shown as label on attachments header
    failedToGenerateRouteMsg: "La génération de l’itinéraire a échoué.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Les fenêtres contextuelles ne sont pas configurées, les résultats ne peuvent pas être affichés." //Shown as a message when popups for all the layers are disabled

  })
);