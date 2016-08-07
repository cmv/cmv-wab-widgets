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
    "miles": {
      "displayText": "Miles",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilomètres",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Pieds",
      "acronym": "pi"
    },
    "meters": {
      "displayText": "Mètres",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Paramètres de recherche",
    "defaultBufferDistanceLabel": "Définir la distance par défaut de la zone tampon",
    "maxBufferDistanceLabel": "Définir la distance maximum de la zone tampon",
    "bufferDistanceUnitLabel": "Unités de distance de la zone tampon",
    "defaultBufferHintLabel": "Astuce : définissez la valeur par défaut du curseur de la zone tampon",
    "maxBufferHintLabel": "Astuce : définissez la valeur maximum du curseur de la zone tampon",
    "bufferUnitLabel": "Astuce : définissez l’unité pour créer la zone tampon",
    "selectGraphicLocationSymbol": "Symbole d’adresse ou d’emplacement",
    "graphicLocationSymbolHintText": "Astuce : symbole d’une adresse recherchée ou d’un emplacement sélectionné",
    "fontColorLabel": "Sélectionner la couleur de police pour les résultats de la recherche",
    "fontColorHintText": "Astuce : couleur de police des résultats de la recherche",
    "zoomToSelectedFeature": "Zoom sur l'entité sélectionnée",
    "zoomToSelectedFeatureHintText": "Astuce : zoomez sur l'entité sélectionnée au lieu de la zone tampon",
    "intersectSearchLocation": "Revenir aux polygones d'intersection",
    "intersectSearchLocationHintText": "Astuce : renvoyez les polygones contenant l'emplacement recherché au lieu des polygones au sein de la zone tampon",
    "bufferVisibilityLabel": "Définir la visibilité de la zone tampon",
    "bufferVisibilityHintText": "Astuce : la zone tampon s'affichera sur la carte",
    "bufferColorLabel": "Définir le symbole de la zone tampon",
    "bufferColorHintText": "Astuce : sélectionnez la couleur et la transparence de la zone tampon",
    "searchLayerResultLabel": "Dessiner uniquement les résultats de la couche sélectionnée",
    "searchLayerResultHint": "Astuce : seule la couche sélectionnée dans les résultats de recherche s'affichera sur la carte."
  },
  "layerSelector": {
    "selectLayerLabel": "Sélectionner des couches de recherche",
    "layerSelectionHint": "Astuce : utilisez le bouton Définir pour sélectionner les couches",
    "addLayerButton": "Définir"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Attributs de direction",
    "routeServiceUrl": "Service de calcul d'itinéraire",
    "buttonSet": "Définir",
    "routeServiceUrlHintText": "Astuce : cliquez sur Définir pour rechercher et sélectionner un service de calcul d'itinéraire",
    "directionLengthUnit": "Unités de longueur de la direction",
    "unitsForRouteHintText": "Astuce : utilisé pour afficher les unités de l’itinéraire",
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
  "errorStrings": {
    "bufferErrorString": "Saisissez une valeur numérique valide.",
    "selectLayerErrorString": "Sélectionnez les couches à rechercher.",
    "invalidDefaultValue": "La distance de la zone tampon par défaut ne peut pas être vide. Veuillez spécifier la distance de la zone tampon.",
    "invalidMaximumValue": "La distance de la zone tampon maximale ne peut pas être vide. Veuillez spécifier la distance de la zone tampon.",
    "defaultValueLessThanMax": "Spécifiez la distance de la zone tampon par défaut au sein de la limite maximale",
    "defaultBufferValueGreaterThanZero": "Spécifiez une distance de la zone tampon par défaut supérieure à 0",
    "maximumBufferValueGreaterThanZero": "Spécifiez une distance de la zone tampon maximale supérieure à 0"
  },
  "symbolPickerPreviewText": "Aperçu :"
});