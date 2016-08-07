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
    "miles": "Millas",
    "kilometers": "Kilómetros",
    "feet": "Pies",
    "meters": "Metros"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Configuración de búsqueda",
    "buttonSet": "Definir",
    "selectLayersLabel": "Seleccionar capa",
    "selectLayersHintText": "Sugerencia: se utiliza para seleccionar la capa del polígono y su capa de puntos relacionada.",
    "selectPrecinctSymbolLabel": "Seleccionar símbolo para resaltar polígono",
    "selectGraphicLocationSymbol": "Símbolo de dirección o ubicación",
    "graphicLocationSymbolHintText": "Sugerencia: símbolo para la dirección buscada o para la ubicación en la que se ha hecho clic",
    "precinctSymbolHintText": "Sugerencia: se utiliza para visualizar el símbolo para el polígono seleccionado",
    "selectColorForPoint": "Seleccionar color para resaltar el punto",
    "selectColorForPointHintText": "Sugerencia: se utiliza para visualizar el color de resaltado para el punto seleccionado"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Seleccionar capa de polígono",
    "selectPolygonLayerHintText": "Sugerencia: se utiliza para seleccionar la capa del polígono.",
    "selectRelatedPointLayerLabel": "Seleccionar capa de puntos relacionada con capa de polígono",
    "selectRelatedPointLayerHintText": "Sugerencia: se utiliza para seleccionar la capa de puntos relacionada con la capa de polígono",
    "polygonLayerNotHavingRelatedLayer": "Selecciona una capa de polígono que tenga una capa de puntos relacionada.",
    "errorInSelectingPolygonLayer": "Selecciona una capa de polígono que tenga una capa de puntos relacionada.",
    "errorInSelectingRelatedLayer": "Selecciona una capa de puntos relacionada con la capa de polígono."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Configuraciones de indicaciones",
    "routeServiceUrl": "Servicio de generación de rutas",
    "buttonSet": "Definir",
    "routeServiceUrlHintText": "Sugerencia: haz clic en ‘Definir’ para examinar y seleccionar un servicio de generación de rutas para el análisis de red",
    "directionLengthUnit": "Unidades de longitud de dirección",
    "unitsForRouteHintText": "Sugerencia: se utiliza para visualizar las unidades indicadas para la ruta",
    "selectRouteSymbol": "Seleccionar símbolo para visualizar ruta",
    "routeSymbolHintText": "Sugerencia: se utiliza para visualizar el símbolo de línea de la ruta",
    "routingDisabledMsg": "Para habilitar las indicaciones, asegúrate de que la generación de rutas está habilitada en el elemento de ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Agregar desde ArcGIS Online",
    "serviceURLabel": "Agregar URL de servicio",
    "routeURL": "URL de ruta",
    "validateRouteURL": "Validar",
    "exampleText": "Ejemplo",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Especifica un servicio de rutas válido.",
    "rateLimitExceeded": "Se ha superado el límite de velocidad. Vuelva a intentarlo más tarde.",
    "errorInvokingService": "El nombre de usuario o la contraseña son incorrectos."
  },
  "symbolPickerPreviewText": "Vista previa:"
});