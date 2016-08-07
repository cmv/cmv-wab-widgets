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
    "kilometers": "Quilómetros",
    "feet": "Pés",
    "meters": "Metros"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Configurações da Pesquisa",
    "buttonSet": "Definir",
    "selectLayersLabel": "Seleccionar Camada",
    "selectLayersHintText": "Sugestão: Use a camada de polígono seleccionada e a sua camada de ponto associada.",
    "selectPrecinctSymbolLabel": "Seleccionar símbolo para realçar polígono",
    "selectGraphicLocationSymbol": "Símbolo de endereço ou localização",
    "graphicLocationSymbolHintText": "Sugestão: Símbolo para endereço pesquisado ou localização clicada",
    "precinctSymbolHintText": "Sugestão: Usado para exbir símbolo para polígono seleccionado",
    "selectColorForPoint": "Selecionar cor para destacar ponto",
    "selectColorForPointHintText": "Dica: Utilizado para exibir cor de destaque para ponto selecionado"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Seleccionar camada de polígono",
    "selectPolygonLayerHintText": "Sugestão: Usado para seleccionar camada de polígono.",
    "selectRelatedPointLayerLabel": "Seleccionar camada de ponto relacionado para camada de polígono",
    "selectRelatedPointLayerHintText": "Sugestão:  Usado para seleccionar camada de ponto relacionada para camada de polígono",
    "polygonLayerNotHavingRelatedLayer": "Por favor seleccione uma camada de polígono que tenha uma camada de ponto relacionada.",
    "errorInSelectingPolygonLayer": "Por favor seleccione uma camada de polígono que tenha uma camada de ponto relacionada.",
    "errorInSelectingRelatedLayer": "Por favor seleccione uma camada de ponto relacionada para camada de polígono."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Definições de Direção",
    "routeServiceUrl": "Serviço de roteamento",
    "buttonSet": "Definir",
    "routeServiceUrlHintText": "Sugestão: Clique 'Definir' para navegar e seleccionar um serviço de roteamento de análise de rede",
    "directionLengthUnit": "Unidades de comprimento de direcção",
    "unitsForRouteHintText": "Sugestão: Usado para exibir unidades reportadas para rota",
    "selectRouteSymbol": "Seleccionar símbolo para exibir rota",
    "routeSymbolHintText": "Sugestão: Usado para exibir símbolo linha da rota",
    "routingDisabledMsg": "Para permitir direcções certifique-se que o roteamento está activo no item ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Adicionar de ArcGIS Online",
    "serviceURLabel": "Adicionar URL de Serviço",
    "routeURL": "URL de rota",
    "validateRouteURL": "Validar",
    "exampleText": "Exemplo",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Por favor especifique o serviço de Roteamento válido.",
    "rateLimitExceeded": "Limite de classificação ultrapassado. Por favor tente mais tarde.",
    "errorInvokingService": "Nome de utilizador ou palavra-passe incorreto."
  },
  "symbolPickerPreviewText": "Visualizar:"
});