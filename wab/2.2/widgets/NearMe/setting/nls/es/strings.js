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
      "displayText": "Millas",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilómetros",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Pies",
      "acronym": "pie"
    },
    "meters": {
      "displayText": "Metros",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Configuración de búsqueda",
    "defaultBufferDistanceLabel": "Definir distancia de zona de influencia predeterminada",
    "maxBufferDistanceLabel": "Definir distancia de zona de influencia máxima",
    "bufferDistanceUnitLabel": "Unidades de distancia del área de influencia",
    "defaultBufferHintLabel": "Sugerencia: defina el valor predeterminado para el control deslizante de zona de influencia",
    "maxBufferHintLabel": "Sugerencia: defina el valor máximo para el control deslizante de zona de influencia",
    "bufferUnitLabel": "Sugerencia: define una unidad para crear la zona de influencia",
    "selectGraphicLocationSymbol": "Símbolo de dirección o ubicación",
    "graphicLocationSymbolHintText": "Sugerencia: símbolo para la dirección buscada o para la ubicación en la que se ha hecho clic",
    "fontColorLabel": "Seleccionar color de fuente para resultados de búsqueda",
    "fontColorHintText": "Sugerencia: color de fuente de los resultados de la búsqueda",
    "zoomToSelectedFeature": "Aplicar zoom a la entidad seleccionada",
    "zoomToSelectedFeatureHintText": "Sugerencia: aplique el zoom a la entidad seleccionada en lugar de la zona de influencia",
    "intersectSearchLocation": "Devolver polígonos que se intersecan",
    "intersectSearchLocationHintText": "Sugerencia: devuelva los polígonos que contienen la ubicación buscada en lugar de los polígonos contenidos en la zona de influencia",
    "bufferVisibilityLabel": "Definir visibilidad de zona de influencia",
    "bufferVisibilityHintText": "Sugerencia: la zona de influencia se mostrará en el mapa",
    "bufferColorLabel": "Definir símbolo de zona de influencia",
    "bufferColorHintText": "Sugerencia: seleccione el color y la transparencia de la zona de influencia",
    "searchLayerResultLabel": "Dibujar solo resultados de la capa seleccionada",
    "searchLayerResultHint": "Sugerencia: solo la capa seleccionada en los resultados de búsqueda se dibujará en el mapa"
  },
  "layerSelector": {
    "selectLayerLabel": "Seleccionar capas de búsqueda",
    "layerSelectionHint": "Sugerencia: usa el botón de definir para seleccionar capas",
    "addLayerButton": "Definir"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Configuraciones de indicaciones",
    "routeServiceUrl": "Servicio de generación de rutas",
    "buttonSet": "Definir",
    "routeServiceUrlHintText": "Sugerencia: haga clic en \"Definir\" para examinar y seleccionar un servicio de generación de rutas",
    "directionLengthUnit": "Unidades de longitud de dirección",
    "unitsForRouteHintText": "Sugerencia: se utiliza para visualizar las unidades para la ruta",
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
  "errorStrings": {
    "bufferErrorString": "Introduce un valor numérico válido.",
    "selectLayerErrorString": "Selecciona las capas para buscar.",
    "invalidDefaultValue": "La distancia de zona de influencia predeterminada no puede estar en blanco. Especifica la distancia de zona de influencia.",
    "invalidMaximumValue": "La distancia de zona de influencia máxima no puede estar en blanco. Especifica la distancia de zona de influencia.",
    "defaultValueLessThanMax": "Especifica la distancia de zona de influencia predeterminada dentro del límite máximo",
    "defaultBufferValueGreaterThanZero": "Especifica una distancia de zona de influencia predeterminada mayor que 0",
    "maximumBufferValueGreaterThanZero": "Especifica una distancia de zona de influencia máxima mayor que 0"
  },
  "symbolPickerPreviewText": "Vista previa:"
});