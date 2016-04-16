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
      miles: "Milhas", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Quilómetros", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Pés", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Metros" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Configurações da Pesquisa", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Definir", // shown as a button text to set layers
      selectLayersLabel: "Seleccionar Camada",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Sugestão: Use a camada de polígono seleccionada e a sua camada de ponto associada.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Seleccionar símbolo para realçar polígono", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Símbolo de endereço ou localização", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Sugestão: Símbolo para endereço pesquisado ou localização clicada", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Sugestão: Usado para exbir símbolo para polígono seleccionado" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Cancelar", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Seleccionar camada de polígono", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Sugestão: Usado para seleccionar camada de polígono.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Seleccionar camada de ponto relacionado para camada de polígono", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Sugestão:  Usado para seleccionar camada de ponto relacionada para camada de polígono", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Por favor seleccione uma camada de polígono que tenha uma camada de ponto relacionada.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Por favor seleccione uma camada de polígono que tenha uma camada de ponto relacionada.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Por favor seleccione uma camada de ponto relacionada para camada de polígono." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Definições de Direcção", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Serviço de roteamento", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Serviço de Modo de Viagem", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Definir", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Sugestão: Clique \'Definir\' para navegar e seleccionar um serviço de roteamento de análise de rede", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unidades de comprimento de direcção", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Sugestão: Usado para exibir unidades reportadas para rota", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Seleccionar símbolo para exibir rota", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Sugestão: Usado para exibir símbolo linha da rota", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Sugestão: Clique \'Definir\' para navegar e seleccionar um serviço de Modo de Viagem", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Por favor especifique um serviço de Modo de Viagem válido", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Para permitir direcções certifique-se que o roteamento está activo no item ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Adicionar de ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Adicionar URL de Serviço", // shown as a label in route service configuration panel to add service url
      routeURL: "URL de rota", // shown as a label in route service configuration panel
      validateRouteURL: "Validar", // shown as a button text in route service configuration panel to validate url
      exampleText: "Exemplo", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Cancelar", // shown as a button text for route service configuration panel
      nextButton: "Seguinte", // shown as a button text for route service configuration panel
      backButton: "Retroceder", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Por favor especifique o serviço de Roteamento válido." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Visualizar:"
  })
);