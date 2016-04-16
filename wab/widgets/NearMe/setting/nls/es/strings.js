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
        displayText: "Millas",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilómetros",
        acronym: "km"
      },
      feet: {
        displayText: "Pies",
        acronym: "pie"
      },
      meters: {
        displayText: "Metros",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Configuración de búsqueda", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Definir valor de distancia de zona de influencia predeterminado", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Define un valor de distancia de zona de influencia máximo para buscar entidades", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Unidades de distancia del área de influencia", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Sugerencia: utilízalo para definir el valor predeterminado para una zona de influencia", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Sugerencia: utilízalo para definir el valor máximo para una zona de influencia", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Sugerencia: define una unidad para crear la zona de influencia", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Símbolo de dirección o ubicación", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Sugerencia: símbolo para la dirección buscada o para la ubicación en la que se ha hecho clic", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Seleccionar color de fuente para resultados de búsqueda", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Sugerencia: color de fuente de los resultados de la búsqueda" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Seleccionar capas de búsqueda", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Sugerencia: usa el botón de definir para seleccionar capas", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Definir", //Shown as a button text to add the layer for search
      okButton: "Aceptar", // shown as a button text for layer selector popup
      cancelButton: "Cancelar" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Configuración de dirección", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Servicio de generación de rutas", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Servicio de modo de viaje", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Definir", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Sugerencia: haz clic en ‘Definir’ para examinar y seleccionar un servicio de generación de rutas", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unidades de longitud de dirección", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Sugerencia: se utiliza para visualizar las unidades para la ruta", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Seleccionar símbolo para visualizar ruta", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Sugerencia: se utiliza para visualizar el símbolo de línea de la ruta", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Sugerencia: haz clic en ‘Definir’ para examinar y seleccionar un servicio de modo de viaje", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Especifica un servicio de modo de viaje válido ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Para habilitar las indicaciones, asegúrate de que la generación de rutas está habilitada en el elemento de ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Agregar desde ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Agregar URL de servicio", // shown as a label in route service configuration panel to add service url
      routeURL: "URL de ruta", // shown as a label in route service configuration panel
      validateRouteURL: "Validar", // shown as a button text in route service configuration panel to validate url
      exampleText: "Ejemplo", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "Aceptar", // shown as a button text for route service configuration panel
      cancelButton: "Cancelar", // shown as a button text for route service configuration panel
      nextButton: "Siguiente", // shown as a button text for route service configuration panel
      backButton: "Atrás", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Especifica un servicio de rutas válido." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Introduce un valor numérico válido.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Selecciona las capas para buscar.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "La distancia de zona de influencia predeterminada no puede estar en blanco. Especifica la distancia de zona de influencia.", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "La distancia de zona de influencia máxima no puede estar en blanco. Especifica la distancia de zona de influencia.", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Especifica la distancia de zona de influencia predeterminada dentro del límite máximo", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Especifica una distancia de zona de influencia predeterminada mayor que 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Especifica una distancia de zona de influencia máxima mayor que 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Vista previa:"
  })
);