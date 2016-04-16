/*global define*/
///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define(
   ({
    units: { // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit) and acronym in feature list
      miles: {
        displayText: "Miles",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilomètres",
        acronym: "km"
      },
      feet: {
        displayText: "Pieds",
        acronym: "pi"
      },
      meters: {
        displayText: "Mètres",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Paramètres de recherche", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Définir la valeur par défaut de distance de la zone tampon", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Définir la valeur maximale de distance de la zone tampon pour la recherche d’entités", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Unités de distance de la zone tampon", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Astuce : à utiliser pour définir la valeur par défaut d’une zone tampon", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Astuce : à utiliser pour définir la valeur maximale d’une zone tampon", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Astuce : définissez l’unité pour créer la zone tampon", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Symbole d’adresse ou d’emplacement", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Astuce : symbole d’une adresse recherchée ou d’un emplacement sélectionné", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Sélectionner la couleur de police pour les résultats de la recherche", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Astuce : couleur de police des résultats de la recherche" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Sélectionner des couches de recherche", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Astuce : utilisez le bouton Définir pour sélectionner les couches", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Définir", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Annuler" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Paramètres de direction", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Service de calcul d\'itinéraire", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Service de mode de déplacement", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Définir", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Astuce : cliquez sur ‘Définir’ pour rechercher et sélectionner un service de calcul d’itinéraire", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unités de longueur de la direction", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Astuce : utilisé pour afficher les unités de l’itinéraire", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Sélectionner le symbole pour afficher l’itinéraire", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Astuce : utilisé pour afficher le symbole linéaire de l’itinéraire", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Astuce : cliquez sur ‘Définir’ pour rechercher et sélectionner un service de mode de déplacement", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Spécifiez un service de mode de déplacement valide ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Pour activer les directions, assurez-vous que le calcul d’itinéraire est activé dans l’élément ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Ajouter depuis ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Ajouter une URL de service", // shown as a label in route service configuration panel to add service url
      routeURL: "URL de l’itinéraire", // shown as a label in route service configuration panel
      validateRouteURL: "Valider", // shown as a button text in route service configuration panel to validate url
      exampleText: "Exemple", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Annuler", // shown as a button text for route service configuration panel
      nextButton: "Suivant", // shown as a button text for route service configuration panel
      backButton: "Précédent", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Spécifiez un service d’itinéraire valide." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Saisissez une valeur numérique valide.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Sélectionnez les couches à rechercher.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "La distance de la zone tampon par défaut ne peut pas être vide. Veuillez spécifier la distance de la zone tampon.", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "La distance de la zone tampon maximale ne peut pas être vide. Veuillez spécifier la distance de la zone tampon.", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Spécifiez la distance de la zone tampon par défaut au sein de la limite maximale", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Spécifiez une distance de la zone tampon par défaut supérieure à 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Spécifiez une distance de la zone tampon maximale supérieure à 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Aperçu :"
  })
);