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
    "miles": "Milhas",
    "kilometers": "Quilômetros",
    "feet": "Pés",
    "meters": "Metros"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Configurações da Pesquisa",
    "buttonSet": "Configurar",
    "selectLayersLabel": "Selecionar camada",
    "selectLayersHintText": "Sugestão: Utilizado para selecionar camada de polígono e sua camada de ponto relacionada.",
    "selectPrecinctSymbolLabel": "Selecionar símbolo para destacar polígono",
    "selectGraphicLocationSymbol": "Símbolo de local ou endereço",
    "graphicLocationSymbolHintText": "Sugestão: Símbolo para endereço pesquisado ou local clicado",
    "precinctSymbolHintText": "Sugestão: Utilizado para exibir símbolo do polígono selecionado",
    "selectColorForPoint": "Selecionar cor para destacar ponto",
    "selectColorForPointHintText": "Sugestão: Utilizado para exibir cor de destaque para ponto selecionado"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Selecionar camada de polígono",
    "selectPolygonLayerHintText": "Sugestão: Uitilizado para selecionar camada de polígono.",
    "selectRelatedPointLayerLabel": "Selecionar camada de ponto relacionada à camada de polígono",
    "selectRelatedPointLayerHintText": "Sugestão:  Utilizado para selecionar camada de ponto relacionada à camada de polígono",
    "polygonLayerNotHavingRelatedLayer": "Selecione uma camada de polígono que tenha uma camada de ponto relacionada.",
    "errorInSelectingPolygonLayer": "Selecione uma camada de polígono que tenha uma camada de ponto relacionada.",
    "errorInSelectingRelatedLayer": "Selecione a camada de ponto relacionada à camada de polígono."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Configurações de Direções",
    "routeServiceUrl": "Serviço de rota",
    "buttonSet": "Configurar",
    "routeServiceUrlHintText": "Sugestão: Clique em ‘Configurar’ para procurar e selecionar um serviço de rota da análise de rede",
    "directionLengthUnit": "Unidades do comprimento de direção",
    "unitsForRouteHintText": "Sugestão: Utilizado para exibir unidades reportadas para rota",
    "selectRouteSymbol": "Selecionar símbolo para exibir rota",
    "routeSymbolHintText": "Sugestão: Utilizado para exibir símbolo de linha da rota",
    "routingDisabledMsg": "Para habilitar direções, garanta que a rota esteja habilitada no item do ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Adicionar do ArcGIS Online",
    "serviceURLabel": "Adicionar URL de Serviço",
    "routeURL": "URL da Rota",
    "validateRouteURL": "Validar",
    "exampleText": "Exemplo",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Especifique um serviço de Rota válido.",
    "rateLimitExceeded": "Limite de taxa excedido. Tente novamente mais tarde.",
    "errorInvokingService": "O nome de usuário ou senha está incorreta."
  },
  "symbolPickerPreviewText": "Visualizar:"
});