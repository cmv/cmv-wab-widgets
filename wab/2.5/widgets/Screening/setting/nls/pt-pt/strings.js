///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
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
    "standardUnit": "Unidade Padrão",
    "metricUnit": "Unidade Métrica"
  },
  "analysisTab": {
    "analysisTabLabel": "Análise",
    "selectAnalysisLayerLabel": "Selecionar camadas de análise",
    "addLayerLabel": "Adicionar Camadas",
    "noValidLayersForAnalysis": "Não foram encontradas quaisquer camadas válidas no mapa web selecionado.",
    "noValidFieldsForAnalysis": "Não foram encontrados quaisquer campos válidos no mapa web selecionado. Por favor, remova a camada selecionada.",
    "addLayersHintText": "Dica: Camadas e campos selecionados para analisar e exibir em relatório",
    "addLayerNameTitle": "Nome da Camada",
    "addFieldsLabel": "Adicionar Campo",
    "addFieldsPopupTitle": "Selecionar Campos",
    "addFieldsNameTitle": "Nomes dos Campos",
    "aoiToolsLegendLabel": "Ferramentas AOI",
    "aoiToolsDescriptionLabel": "Permite que as ferramentas criem áreas de interesse e especifiquem os respetivos rótulos.",
    "placenameLabel": "Nome de local",
    "drawToolsLabel": "Ferramentas de Desenho",
    "uploadShapeFileLabel": "Carregar uma Shapefile",
    "coordinatesLabel": "Coordenadas",
    "coordinatesDrpDwnHintText": "Dica: Selecionar unidade para exibir travessias introduzidas",
    "coordinatesBearingDrpDwnHintText": "Dica: Selecionar suporte para exibir travessias introduzidas",
    "allowShapefilesUploadLabel": "Permitir o carregamento de shapefiles para análise",
    "areaUnitsLabel": "Exibir áreas/comprimentos em",
    "allowShapefilesUploadLabelHintText": "Dica: Exibir ‘Carregar shapefile em Análise’ no Separador Relatório",
    "maxFeatureForAnalysisLabel": "Máximo de elementos para análise",
    "maxFeatureForAnalysisHintText": "Dica: Definir o número máximo de elementos para análise",
    "searchToleranceLabelText": "Tolerância da pesquisa (pés)",
    "searchToleranceHint": "Dica: A tolerância de pesquisa apenas é utilizada ao analisar entradas de pontos e de linhas."
  },
  "downloadTab": {
    "downloadLegend": "Definições de Transferência",
    "reportLegend": "Definições de Relatório",
    "downloadTabLabel": "Descarregar",
    "syncEnableOptionLabel": "Camadas de Elementos",
    "syncEnableOptionHint": "Dica: Utilizado para transferir informações de elementos sobre elementos que intersectam a área de interesse nos formatos indicados.",
    "syncEnableOptionNote": "Nota: São necessários serviços de elementos com sincronização ativada para a opção File Geodatabase.",
    "extractDataTaskOptionLabel": "Serviço de geoprocessamento Tarefa Extrair Dados",
    "extractDataTaskOptionHint": "Dica: Utilize um serviço de geoprocessamento Tarefa Extrair Dados publicado para transferir elementos que interceptem a área de interesse nos formatos File Geodatabase ou Shapefile.",
    "cannotDownloadOptionLabel": "Desativar Transferência",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Nome da camada",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "Geodatabase de Ficheiros",
      "allowDownloadLabel": "Permitir Transferência"
    },
    "setButtonLabel": "Definir",
    "GPTaskLabel": "Especificar url para serviço de geoprocessamento",
    "printGPServiceLabel": "Imprimir URL de Serviço",
    "setGPTaskTitle": "Especificar URL do Serviço de Geoprocessamento necessário",
    "logoLabel": "Logo",
    "logoChooserHint": "Dica: Clicar no ícone da imagem para alterar a imagem",
    "footnoteLabel": "Nota de Rodapé",
    "columnTitleColorPickerLabel": "Cor para títulos de colunas",
    "reportTitleLabel": "Título do Relatório",
    "errorMessages": {
      "invalidGPTaskURL": "Serviço de geoprocessamento inválido. Por favor, selecione um serviço de geoprocessamento que contenha a Tarefa Extrair Dados.",
      "noExtractDataTaskURL": "Por favor, selecione qualquer serviço de geoprocessamento que contenha a Tarefa Extrair Dados."
    }
  },
  "generalTab": {
    "generalTabLabel": "Geral",
    "tabLabelsLegend": "Rótulos de Painéis",
    "tabLabelsHint": "Dica: Especificar Rótulos",
    "AOITabLabel": "Painel Área de Interesse",
    "ReportTabLabel": "Painel de Relatório",
    "bufferSettingsLegend": "Definições de Buffer",
    "defaultBufferDistanceLabel": "Distância Predefinida do Buffer",
    "defaultBufferUnitsLabel": "Unidades de Buffer",
    "generalBufferSymbologyHint": "Dica: Defina a simbologia a utilizar para a exibição de buffers em torno de áreas de interesse definidas",
    "aoiGraphicsSymbologyLegend": "Simbologia AOI Graphics",
    "aoiGraphicsSymbologyHint": "Dica: Defina a simbologia a utilizar ao definir áreas de interesse de pontos, linhas e polígonos.",
    "pointSymbologyLabel": "Ponto",
    "previewLabel": "Pré-visualizar",
    "lineSymbologyLabel": "Linha",
    "polygonSymbologyLabel": "Polígono",
    "aoiBufferSymbologyLabel": "Simbologia do Buffer",
    "pointSymbolChooserPopupTitle": "Símbolo de endereço ou localização",
    "polygonSymbolChooserPopupTitle": "Seleccionar símbolo para realçar polígono",
    "lineSymbolChooserPopupTitle": "Selecionar símbolo para destacar linha",
    "aoiSymbolChooserPopupTitle": "Defina o símbolo do buffer"
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Definições de Fonte de Pesquisa",
    "searchSourceSettingTitle": "Definições de Fonte de Pesquisa",
    "searchSourceSettingTitleHintText": "Adicione e configure serviços de geocodificação ou camadas de elementos como fontes de pesquisa. Estas fontes determinam aquilo que é possível pesquisar na caixa de pesquisa.",
    "addSearchSourceLabel": "Adicionar Fonte de Pesquisa",
    "featureLayerLabel": "Camada de Elementos",
    "geocoderLabel": "Geocodificador",
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
    "locatorUrl": "URL do Geocodificador",
    "locatorName": "Nome do Geocodificador",
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
    "setSearchFields": "Definir Campos de Pesquisa",
    "set": "Definir",
    "invalidUrlTip": "O URL ${URL} é inválido ou inacessível.",
    "invalidSearchSources": "Definições inválidas de origem de pesquisa."
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Por favor, preencha os campos obrigatórios",
    "bufferDistanceFieldsErrorMsg": "Por favor, introduza valores válidos",
    "invalidSearchToleranceErrorMsg": "Por favor, introduza um valor válido para a tolerância de pesquisa",
    "atLeastOneCheckboxCheckedErrorMsg": "Configuração inválida",
    "noLayerAvailableErrorMsg": "Nenhuma camada disponível",
    "layerNotSupportedErrorMsg": "Não Suportado ",
    "noFieldSelected": "Por favor, utilize a ação editar para selecionar campos para análise.",
    "duplicateFieldsLabels": "Duplicar rótulo \"${labelText}\" adicionado para: \"${itemNames}\"",
    "noLayerSelected": "Por favor, selecione pelo menos uma camada para análise",
    "errorInSelectingLayer": "Não é possível concluir a operação de seleção de camada Por favor, tente novamente.",
    "errorInMaxFeatureCount": "Por favor, introduza uma contagem máxima de valores válida para análise."
  }
});