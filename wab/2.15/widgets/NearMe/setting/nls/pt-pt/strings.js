/*global define*/
///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Definições de Fonte de Pesquisa",
    "searchSourceSettingTitle": "Definições de Fonte de Pesquisa",
    "searchSourceSettingTitleHintText": "Adicione e configure serviços de geocodificação ou camadas de elementos como fontes de pesquisa. Estas fontes determinam aquilo que é possível pesquisar na caixa de pesquisa.",
    "addSearchSourceLabel": "Adicionar Fonte de Pesquisa",
    "featureLayerLabel": "Camada de Elementos",
    "geocoderLabel": "Geocodificador",
    "nameTitle": "Nome",
    "generalSettingLabel": "Configuração Geral",
    "allPlaceholderLabel": "Texto de placeholder para pesquisar todos:",
    "allPlaceholderHintText": "Dica: Introduzir o texto a exibir como espaço reservado ao pesquisar todas as camadas e o geocodificador",
    "generalSettingCheckboxLabel": "Exibir janela pop-up para o elemento ou local encontrado.",
    "countryCode": "Código(s) de País ou Região",
    "countryCodeEg": "e.g ",
    "countryCodeHint": "Ao deixar este valor em branco irá pesquisar em todos os países e regiões",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Procurar apenas na extensão de mapa actual.",
    "zoomScale": "Escala de Zoom",
    "locatorUrl": "Geocoder URL",
    "locatorName": "Nome do Geocoder",
    "locatorExample": "Exemplo",
    "locatorWarning": "Esta versão do serviço de geocodificação não é suportada. O widget suporta serviço de geocodificação 10.0 e posterior.",
    "locatorTips": "Sugestões não estão disponíveis porque o serviço de geocodificação não suporta a capacidade sugerida.",
    "layerSource": "Camada Fonte",
    "setLayerSource": "Definir Fonte de Camada",
    "setGeocoderURL": "Definir URL Geocodificador",
    "searchLayerTips": "Sugestões não estão disponíveis porque o serviço de elemento não suporta capacidades de paginação.",
    "placeholder": "Local de introdução de texto",
    "searchFields": "Campos de Pesquisa",
    "displayField": "Exibir Campo",
    "exactMatch": "Correspondência Exacta",
    "maxSuggestions": "Sugestões Máximas",
    "maxResults": "Resultados Máximos",
    "enableLocalSearch": "Ativar pesquisa local",
    "minScale": "Escala Mínima",
    "minScaleHint": "Quando a escala do mapa é superior a esta escala, será aplicada a pesquisa local",
    "radius": "Raio",
    "radiusHint": "Especifica o raio de uma área em torno do atual centro do mapa, que é utilizada para impulsionar a classificação de candidatos a geocodificação para que os candidatos que se encontram mais perto do local sejam apresentados nas primeiras posições.",
    "meters": "Metros",
    "setSearchFields": "Definir Campos de Pesquisa",
    "set": "Definir",
    "fieldName": "Nome",
    "invalidUrlTip": "O URL ${URL} é inválido ou inacessível."
  },
  "searchSetting": {
    "searchSettingTabTitle": "Configurações da Pesquisa",
    "defaultBufferDistanceLabel": "Definir distância predefinida do buffer",
    "maxResultCountLabel": "Limitar o número de resultados",
    "maxResultCountHintLabel": "Dica: Defina o número máximo de resultados visíveis. O valor 1 irá apresentar o elemento mais próximo.",
    "maxBufferDistanceLabel": "Definir distância máxima do buffer",
    "bufferDistanceUnitLabel": "Unidades de distancia buffer",
    "defaultBufferHintLabel": "Dica: Defina valor predefinido para o controlo deslizante de buffer",
    "maxBufferHintLabel": "Dica: Definir valor máximo para o controlo deslizante de buffer",
    "bufferUnitLabel": "Sugestão: Definir unidade para criação de buffer",
    "selectGraphicLocationSymbol": "Símbolo de endereço ou localização",
    "graphicLocationSymbolHintText": "Sugestão: Símbolo para endereço pesquisado ou localização clicada",
    "addressLocationPolygonHintText": "Dica: símbolo de camada de polígonos configurada a ser utilizada em pesquisas de proximidade.",
    "popupTitleForPolygon": "Selecionar polígono para localização de endereço selecionada",
    "popupTitleForPolyline": "Selecionar linha para localização de endereço",
    "addressLocationPolylineHintText": "Dica: símbolo de camada de polilinha configurada a ser utilizada em pesquisas de proximidade.",
    "fontColorLabel": "Seleccionar cor de fonte para resultados de pesquisa",
    "fontColorHintText": "Sugestão: Cor de fonte para resultados de pesquisa",
    "highlightColorLabel": "Definir cor de seleção",
    "highlightColorHintText": "Dica: cor de seleção",
    "zoomToSelectedFeature": "Aplique zoom ao elemento selecionado.",
    "zoomToSelectedFeatureHintText": "Dica: Aplicar zoom ao elemento selecionado ao invés de aplicar ao buffer",
    "intersectSearchLocation": "Apresente polígono(s) em interceção",
    "intersectSearchLocationHintText": "Dica: Apresentar polígono(s) que contêm a localização pesquisada ao invés de polígonos no interior do buffer",
    "enableProximitySearch": "Ativar pesquisa de proximidade",
    "enableProximitySearchHintText": "Pista: Ativa a funcionalidade de pesquisar locais nas proximidades de um resultado selecionado",
    "bufferVisibilityLabel": "Defina a visibilidade do buffer",
    "bufferVisibilityHintText": "Dica: O buffer será exibido no mapa.",
    "bufferColorLabel": "Defina o símbolo do buffer",
    "bufferColorHintText": "Dica: Selecione cor e transparência do buffer",
    "searchLayerResultLabel": "Apenas representar resultados de camadas selecionadas",
    "searchLayerResultHint": "Dica: Apenas a camada selecionada nos resultados de pesquisa será representada no mapa",
    "showToolToSelectLabel": "Botão Definir Localização",
    "showToolToSelectHintText": "Dica: Introduz um botão para definir a localização no mapa, ao invés de definir a localização sempre que se clica no mapa.",
    "geoDesicParamLabel": "Utilizar buffer geodésico",
    "geoDesicParamHintText": "Dica: Utilize um buffer geodésico ao invés de um buffer euclideano (planar)",
    "showImageGalleryLabel": "Mostrar galeria de imagens",
    "showImageGalleryHint": "Sugestão: exibir a galeria de imagens no painel do widget se a caixa de verificação estiver assinalada, caso contrário será ocultada",
    "showResultCountOfLayerLabel": "Exibir contagem dos resultados da pesquisa para cada camada",
    "showResultCountOfLayerHint": "Dica: exibir o número de resultados da pesquisa depois do nome de cada camada",
    "editDescription": "Texto introdutório",
    "editDescriptionTip": "Texto exibido no widget por cima da caixa de pesquisa.",
    "noResultsFound": "Mensagem quando não são encontrados quaisquer resultados",
    "noResultFoundHint": "Dica: defina a mensagem a exibir quando não são encontrados quaisquer resultados na área de pesquisa",
    "noFeatureFoundText": "Nenhum resultado encontrado ",
    "searchHeaderText": "Pesquisar um endereço ou localizar no mapa",
    "setCurrentLocationLabel": "Botão Definir localização atual",
    "setCurrentLocationHintText": "Dica: disponibilize um botão para utilizar a localização atual do utilizador",
    "bufferDistanceSliderLabel": "Controlo Deslizante de Distância do Buffer",
    "bufferDistanceTextboxLabel": "Caixa de Texto do Buffer",
    "bufferDistanceSliderandTextboxLabel": "Controlo Deslizante de Distância e Caixa de Texto do Buffer",
    "bufferItemOptionLegend": "Opções de Entrada do Buffer"
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
    "routingDisabledMsg": "Para ativar direcções certifique-se de que o roteamento está ativo no item nas definições da aplicação.",
    "enableDirectionLabel": "Ativar Direções",
    "enableDirectionText": "Dica: selecione para ativar direções no widget"
  },
  "symbologySetting": {
    "symbologySettingTabTitle": "Definições de Simbologia",
    "addSymbologyBtnLabel": "Adicionar Novos Símbolos",
    "layerNameTitle": "Nome da Camada",
    "fieldTitle": "Campo",
    "valuesTitle": "Valores",
    "symbolTitle": "Símbolo",
    "actionsTitle": "Ações",
    "invalidConfigMsg": "Duplicar campo: ${fieldName} para a camada : ${layerName}"
  },
  "filterSetting": {
    "filterSettingTabTitle": "Definições de Filtro",
    "addTaskTip": "Adicione um ou mais filtros à(s) camada(s) de pesquisa selecionadas e configure parâmetros para cada um.",
    "enableMapFilter": "Remova a camada de filtro predefinida do mapa",
    "newFilter": "Novo filtro",
    "filterExpression": "Filtrar expressão",
    "layerDefaultSymbolTip": "Utilizar o símbolo predefinido da camada",
    "uploadImage": "Carregar uma imagem",
    "selectLayerTip": "Por favor, selecione uma camada.",
    "setTitleTip": "Por favor, defina o título.",
    "noTasksTip": "Não se encontram configurados quaisquer filtros. Clique em \"${newFilter}\" para adicionar um novo.",
    "collapseFiltersTip": "Recolher as expressões de filtro (caso existam) quando o widget é aberto",
    "groupFiltersTip": "Agrupar filtros por camada",
    "infoTab": "Informação",
    "expressionsTab": "Expressões",
    "optionsTab": "Opções",
    "autoApplyWhenWidgetOpen": "Aplicar este filtro quando o widget é aberto.",
    "expandFiltersOnLoad": "Expandir filtros ao carregar widget"
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
    "defaultBufferValueGreaterThanOne": "A distância predefinida para o buffer não pode ser menor do que 0",
    "maximumBufferValueGreaterThanOne": "Por favor especifique a distancia buffer máxima maior do que 0",
    "invalidMaximumResultCountValue": "Por favor, especifique um valor válido para a contagem máxima de resultados",
    "invalidSearchSources": "Definições inválidas de origem de pesquisa."
  },
  "symbolPickerPreviewText": "Visualizar:"
});