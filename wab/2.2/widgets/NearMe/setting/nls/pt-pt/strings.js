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
      "displayText": "Milhas",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Quilómetros",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Pés",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Metros",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Configurações da Pesquisa",
    "defaultBufferDistanceLabel": "Definir distância predefinida do buffer",
    "maxBufferDistanceLabel": "Definir distância máxima do buffer",
    "bufferDistanceUnitLabel": "Unidades de distancia buffer",
    "defaultBufferHintLabel": "Dica: Defina valor predefinido para o controlo deslizante de buffer",
    "maxBufferHintLabel": "Dica: Definir valor máximo para o controlo deslizante de buffer",
    "bufferUnitLabel": "Sugestão: Definir unidade para criação de buffer",
    "selectGraphicLocationSymbol": "Símbolo de endereço ou localização",
    "graphicLocationSymbolHintText": "Sugestão: Símbolo para endereço pesquisado ou localização clicada",
    "fontColorLabel": "Seleccionar cor de fonte para resultados de pesquisa",
    "fontColorHintText": "Sugestão: Cor de fonte para resultados de pesquisa",
    "zoomToSelectedFeature": "Aplique zoom ao elemento selecionado.",
    "zoomToSelectedFeatureHintText": "Dica: Aplicar zoom ao elemento selecionado ao invés de aplicar ao buffer",
    "intersectSearchLocation": "Apresente polígono(s) em interceção",
    "intersectSearchLocationHintText": "Dica: Apresentar polígono(s) que contêm a localização pesquisada ao invés de polígonos no interior do buffer",
    "bufferVisibilityLabel": "Defina a visibilidade do buffer",
    "bufferVisibilityHintText": "Dica: O buffer será exibido no mapa.",
    "bufferColorLabel": "Defina o símbolo do buffer",
    "bufferColorHintText": "Dica: Selecione cor e transparência do buffer",
    "searchLayerResultLabel": "Apenas representar resultados de camadas selecionadas",
    "searchLayerResultHint": "Dica: Apenas a camada selecionada nos resultados de pesquisa será representada no mapa"
  },
  "layerSelector": {
    "selectLayerLabel": "Camada(s) de pesquisa seleccionada",
    "layerSelectionHint": "Sugestão: Ise o botão de definição para camada(s) seleccionadas",
    "addLayerButton": "Definir"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Definições de Direção",
    "routeServiceUrl": "Serviço de Roteamento",
    "buttonSet": "Definir",
    "routeServiceUrlHintText": "Dica: Clique em â€˜Setâ€™ para navegar e selecione um serviço de rotas",
    "directionLengthUnit": "Unidades de comprimento de direcção",
    "unitsForRouteHintText": "Sugestão: Usado para exibir unidade para roteamento",
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
  "errorStrings": {
    "bufferErrorString": "Por favor especifique um valor numérico válido.",
    "selectLayerErrorString": "Por favor seleccione camada(s) para pesquisar.",
    "invalidDefaultValue": "A distancia buffer por omissão não pode estar em branco. Por favor especifique a distancia buffer",
    "invalidMaximumValue": "Distancia máxima buffer não pode estar em branco. Por favor especifique a distancia buffer",
    "defaultValueLessThanMax": "Por favor especifique a distancia buffer por omissão dentro do limite máximo",
    "defaultBufferValueGreaterThanZero": "Por favor especifique a distancia buffer por omissão maior do que 0",
    "maximumBufferValueGreaterThanZero": "Por favor especifique a distancia buffer máxima maior do que 0"
  },
  "symbolPickerPreviewText": "Visualizar:"
});