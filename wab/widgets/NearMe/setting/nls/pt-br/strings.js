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
        displayText: "Milhas",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Quilômetros",
        acronym: "km"
      },
      feet: {
        displayText: "Pés",
        acronym: "pés"
      },
      meters: {
        displayText: "Metros",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Configurações da Pesquisa", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Configurar valor de distância do buffer padrão", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Configurar valor de distância do buffer máximo para localizar feições", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Unidades de distância do buffer", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Sugestão: Utilize para configurar o valor padrão de um buffer", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Sugestão: Utilize para configurar o valor máximo de um buffer", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Sugestão: Defina a unidade para criar buffer", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Símbolo de local ou endereço", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Sugestão: Símbolo para endereço pesquisado ou local clicado", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Selecionar cor da fonte para resultados da pesquisa", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Sugestão: Cor da fonte de resultados da pesquisa" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Selecionar camadas de pesquisa", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Sugestão: Utilize o botão configurar para selecionar camadas", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Configurar", //Shown as a button text to add the layer for search
      okButton: "Ok", // shown as a button text for layer selector popup
      cancelButton: "Cancelar" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Configurações de Direção", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Serviço de Rota", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Serviço do Modo de Viagem", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Configurar", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Sugestão: Clique em ‘Configurar’ para procurar e selecionar um serviço de rota", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unidades do comprimento de direção", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Sugestão: Utilizado para exibir unidades para rota", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Selecionar símbolo para exibir rota", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Sugestão: Utilizado para exibir símbolo de linha da rota", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Sugestão: Clique em ‘Configurar’ para procurar e selecionar um Serviço do Modo de Viagem", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Especifique um serviço do Modo de Viagem válido ", // shown as an error label in alert box when invalid travel mode service url is configured
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
    errorStrings: {
      bufferErrorString: "Inisra um valor numérico válido.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Selecione as camadas para pesquisar.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "A distância de buffer padrão não pode estar em branco. Especifique a distância de buffer", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "A distância de buffer máxima não pode estar em branco. Especifique a distância de buffer", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Especifique a distância de buffer padrão dentro do limite máximo", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Especifique a distância de buffer padrão maior que 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Especifique a distância de buffer máxima maior que 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Visualizar:"
  })
);