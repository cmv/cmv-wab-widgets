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
      kilometers: "Quilômetros", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Pés", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Metros" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Configurações da Pesquisa", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Configurar", // shown as a button text to set layers
      selectLayersLabel: "Selecionar camada",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Sugestão: Utilizado para selecionar camada de polígono e sua camada de ponto relacionada.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Selecionar símbolo para destacar polígono", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Símbolo de local ou endereço", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Sugestão: Símbolo para endereço pesquisado ou local clicado", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Sugestão: Utilizado para exibir símbolo do polígono selecionado" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "Ok", // shown as a button text for layerSelector configuration panel
      cancelButton: "Cancelar", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Selecionar camada de polígono", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Sugestão: Uitilizado para selecionar camada de polígono.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Selecionar camada de ponto relacionada à camada de polígono", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Sugestão:  Utilizado para selecionar camada de ponto relacionada à camada de polígono", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Selecione uma camada de polígono que tenha uma camada de ponto relacionada.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Selecione uma camada de polígono que tenha uma camada de ponto relacionada.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Selecione a camada de ponto relacionada à camada de polígono." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Configurações de Direção", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Serviço de rota", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Serviço do Modo de Viagem", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Configurar", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Sugestão: Clique em ‘Configurar’ para procurar e selecionar um serviço de rota da análise de rede", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unidades do comprimento de direção", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Sugestão: Utilizado para exibir unidades reportadas para rota", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Selecionar símbolo para exibir rota", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Sugestão: Utilizado para exibir símbolo de linha da rota", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Sugestão: Clique em ‘Configurar’ para procurar e selecionar um serviço do Modo de Viagem", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Especifique um serviço do Modo de Viagem válido", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Para habilitar direções, garanta que a rota esteja habilitada no item do ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Adicionar do ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Adicionar URL de Serviço", // shown as a label in route service configuration panel to add service url
      routeURL: "URL da Rota", // shown as a label in route service configuration panel
      validateRouteURL: "Validar", // shown as a button text in route service configuration panel to validate url
      exampleText: "Exemplo", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "Ok", // shown as a button text for route service configuration panel
      cancelButton: "Cancelar", // shown as a button text for route service configuration panel
      nextButton: "Avançar", // shown as a button text for route service configuration panel
      backButton: "Voltar", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Especifique um serviço de Rota válido." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Visualizar:"
  })
);