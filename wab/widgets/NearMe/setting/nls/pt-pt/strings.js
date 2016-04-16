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
        displayText: "Quilómetros",
        acronym: "km"
      },
      feet: {
        displayText: "Pés",
        acronym: "ft"
      },
      meters: {
        displayText: "Metros",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Configurações da Pesquisa", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Definir valor distancia de buffer por omissão", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Definir valor máximo de buffer para descobrir elementos", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Unidades de distancia buffer", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Sugestão: Usado para definir o valor por omissão para buffer", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Sugestão: Usado para definir o valor máximo para buffer", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Sugestão: Definir unidade para criação de buffer", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Símbolo de endereço ou localização", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Sugestão: Símbolo para endereço pesquisado ou localização clicada", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Seleccionar cor de fonte para resultados de pesquisa", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Sugestão: Cor de fonte para resultados de pesquisa" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Camada(s) de pesquisa seleccionada", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Sugestão: Ise o botão de definição para camada(s) seleccionadas", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Definir", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Cancelar" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Definições de direcção", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Serviço de Roteamento", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Serviço de Modo de Viagem", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Definir", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Sugestão: Clique \'Definir\' para navegar e seleccionar um serviço de roteamento", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unidades de comprimento de direcção", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Sugestão: Usado para exibir unidade para roteamento", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Seleccionar símbolo para exibir rota", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Sugestão: Usado para exibir símbolo linha da rota", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Sugestão: Clique \'Definir\' para navegar e seleccionar um Serviço de Modo de Viagem", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Por favor especifique um serviço de Modo de Viagem válido ", // shown as an error label in alert box when invalid travel mode service url is configured
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
    errorStrings: {
      bufferErrorString: "Por favor especifique um valor numérico válido.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Por favor seleccione camada(s) para pesquisar.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "A distancia buffer por omissão não pode estar em branco. Por favor especifique a distancia buffer", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Distancia máxima buffer não pode estar em branco. Por favor especifique a distancia buffer", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Por favor especifique a distancia buffer por omissão dentro do limite máximo", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Por favor especifique a distancia buffer por omissão maior do que 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Por favor especifique a distancia buffer máxima maior do que 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Visualizar:"
  })
);