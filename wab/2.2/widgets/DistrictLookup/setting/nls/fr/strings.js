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
define({
  "units": {
    "miles": "Miles",
    "kilometers": "Kilomètres",
    "feet": "Pieds",
    "meters": "Mètres"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Paramètres de recherche",
    "buttonSet": "Définir",
    "selectLayersLabel": "Sélectionner une couche",
    "selectLayersHintText": "Astuce : utilisé pour sélectionner la couche de polygones et la couche de points associée.",
    "selectPrecinctSymbolLabel": "Sélectionner le symbole pour mettre le polygone en surbrillance",
    "selectGraphicLocationSymbol": "Symbole d’adresse ou d’emplacement",
    "graphicLocationSymbolHintText": "Astuce : symbole d’une adresse recherchée ou d’un emplacement sélectionné",
    "precinctSymbolHintText": "Astuce : utilisé pour afficher le symbole du polygone sélectionné",
    "selectColorForPoint": "Sélectionner une couleur pour mettre en surbrillance le point",
    "selectColorForPointHintText": "Astuce : permet d'afficher la couleur de surbrillance du point sélectionné"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Sélectionner la couche de polygones",
    "selectPolygonLayerHintText": "Astuce : utilisé pour sélectionner la couche de polygones.",
    "selectRelatedPointLayerLabel": "Sélectionner la couche de points associée à la couche de polygones",
    "selectRelatedPointLayerHintText": "Astuce : utilisé pour sélectionner la couche de points associée à la couche de polygones",
    "polygonLayerNotHavingRelatedLayer": "Sélectionnez une couche de polygones possédant une couche de points associée.",
    "errorInSelectingPolygonLayer": "Sélectionnez une couche de polygones possédant une couche de points associée.",
    "errorInSelectingRelatedLayer": "Sélectionnez la couche de points associée à la couche de polygones."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Attributs de direction",
    "routeServiceUrl": "Service de calcul d'itinéraire",
    "buttonSet": "Définir",
    "routeServiceUrlHintText": "Astuce : cliquez sur ‘Définir’ pour rechercher et sélectionner un service de calcul d’itinéraire d’analyse du réseau",
    "directionLengthUnit": "Unités de longueur de la direction",
    "unitsForRouteHintText": "Astuce : utilisé pour afficher les unités signalées pour l’itinéraire",
    "selectRouteSymbol": "Sélectionner le symbole pour afficher l’itinéraire",
    "routeSymbolHintText": "Astuce : utilisé pour afficher le symbole linéaire de l’itinéraire",
    "routingDisabledMsg": "Pour activer les directions, assurez-vous que le calcul d’itinéraire est activé dans l’élément ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Ajouter depuis ArcGIS Online",
    "serviceURLabel": "Ajouter une URL de service",
    "routeURL": "URL de l’itinéraire",
    "validateRouteURL": "Valider",
    "exampleText": "Exemple",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Spécifiez un service d’itinéraire valide.",
    "rateLimitExceeded": "Limite de débit atteinte. Réessayez ultérieurement.",
    "errorInvokingService": "Le nom d'utilisateur ou le mot de passe est incorrect."
  },
  "symbolPickerPreviewText": "Aperçu :"
});