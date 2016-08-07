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
      "displayText": "Quilômetros",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Pés",
      "acronym": "pés"
    },
    "meters": {
      "displayText": "Metros",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Configurações da Pesquisa",
    "defaultBufferDistanceLabel": "Configurar distância de buffer padrão",
    "maxBufferDistanceLabel": "Configurar distância máxima de buffer",
    "bufferDistanceUnitLabel": "Unidades de distância do buffer",
    "defaultBufferHintLabel": "Sugestão: Configurar valor padrão para controle deslizante de buffer",
    "maxBufferHintLabel": "Sugestão: Configurar valor máximo para controle deslizante de buffer",
    "bufferUnitLabel": "Sugestão: Defina a unidade para criar buffer",
    "selectGraphicLocationSymbol": "Símbolo de local ou endereço",
    "graphicLocationSymbolHintText": "Sugestão: Símbolo para endereço pesquisado ou local clicado",
    "fontColorLabel": "Selecionar cor da fonte para resultados da pesquisa",
    "fontColorHintText": "Sugestão: Cor da fonte de resultados da pesquisa",
    "zoomToSelectedFeature": "Zoom para feição selecionada",
    "zoomToSelectedFeatureHintText": "Sugestão: Ampliar na feição selecionada, ao invés do buffer",
    "intersectSearchLocation": "Retornar polígonos de intersecção",
    "intersectSearchLocationHintText": "Sugestão: Retorne polígonos contendo o local pesquisado, ao invés de polígonos dentro do buffer",
    "bufferVisibilityLabel": "Configurar visibilidade do buffer",
    "bufferVisibilityHintText": "Sugestão: O buffer será exibido no mapa",
    "bufferColorLabel": "Configurar símbolo do buffer",
    "bufferColorHintText": "Sugestão: Selecione cor e transparência do buffer",
    "searchLayerResultLabel": "Desenhar somente resultados da camada selecionada",
    "searchLayerResultHint": "Sugestão: Somente a camada selecionada nos resultados da pesquisa desenhará no mapa"
  },
  "layerSelector": {
    "selectLayerLabel": "Selecionar camadas de pesquisa",
    "layerSelectionHint": "Sugestão: Utilize o botão configurar para selecionar camadas",
    "addLayerButton": "Configurar"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Configurações de Direções",
    "routeServiceUrl": "Serviço de Rota",
    "buttonSet": "Configurar",
    "routeServiceUrlHintText": "Sugestão: Clique em â€˜Setâ€™ para procurar e selecionar um serviço de rota",
    "directionLengthUnit": "Unidades do comprimento de direção",
    "unitsForRouteHintText": "Sugestão: Utilizado para exibir unidades para rota",
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
  "errorStrings": {
    "bufferErrorString": "Inisra um valor numérico válido.",
    "selectLayerErrorString": "Selecione as camadas para pesquisar.",
    "invalidDefaultValue": "A distância de buffer padrão não pode estar em branco. Especifique a distância de buffer",
    "invalidMaximumValue": "A distância de buffer máxima não pode estar em branco. Especifique a distância de buffer",
    "defaultValueLessThanMax": "Especifique a distância de buffer padrão dentro do limite máximo",
    "defaultBufferValueGreaterThanZero": "Especifique a distância de buffer padrão maior que 0",
    "maximumBufferValueGreaterThanZero": "Especifique a distância de buffer máxima maior que 0"
  },
  "symbolPickerPreviewText": "Visualizar:"
});