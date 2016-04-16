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
    units: {
      miles: "Miles", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilomètres", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Pieds", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Mètres" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Paramètres de recherche", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Définir", // shown as a button text to set layers
      selectLayersLabel: "Sélectionner une couche",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Astuce : utilisé pour sélectionner la couche de polygones et la couche de points associée.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Sélectionner le symbole pour mettre le polygone en surbrillance", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Symbole d’adresse ou d’emplacement", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Astuce : symbole d’une adresse recherchée ou d’un emplacement sélectionné", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Astuce : utilisé pour afficher le symbole du polygone sélectionné" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Annuler", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Sélectionner la couche de polygones", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Astuce : utilisé pour sélectionner la couche de polygones.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Sélectionner la couche de points associée à la couche de polygones", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Astuce : utilisé pour sélectionner la couche de points associée à la couche de polygones", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Sélectionnez une couche de polygones possédant une couche de points associée.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Sélectionnez une couche de polygones possédant une couche de points associée.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Sélectionnez la couche de points associée à la couche de polygones." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Paramètres de direction", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Service de calcul d\'itinéraire", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Service de mode de déplacement", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Définir", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Astuce : cliquez sur ‘Définir’ pour rechercher et sélectionner un service de calcul d’itinéraire d’analyse du réseau", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unités de longueur de la direction", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Astuce : utilisé pour afficher les unités signalées pour l’itinéraire", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Sélectionner le symbole pour afficher l’itinéraire", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Astuce : utilisé pour afficher le symbole linéaire de l’itinéraire", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Astuce : cliquez sur ‘Définir’ pour rechercher et sélectionner un service de mode de déplacement", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Spécifiez un service de mode de déplacement valide", // shown as an error label in alert box when invalid travel mode service url is configured
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
    symbolPickerPreviewText: "Aperçu :"
  })
);