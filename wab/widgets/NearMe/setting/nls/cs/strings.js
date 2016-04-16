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
        displayText: "Míle",
        acronym: "míle"
      },
      kilometers: {
        displayText: "Kilometry",
        acronym: "km"
      },
      feet: {
        displayText: "Stopy",
        acronym: "stop"
      },
      meters: {
        displayText: "Metry",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Prohledat nastavení", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Nastavte výchozí hodnotu šířky obalové zóny", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Nastavte maximální hodnotu šířky obalové zóny pro vyhledávání prvků", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Jednotky šířky obalové zóny.", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Rada: Použijte k nastavení výchozí hodnoty obalové zóny.", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Rada: Použijte k nastavení maximální hodnoty obalové zóny.", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Rada: Definujte jednotku pro vytvoření obalové zóny.", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Symbol adresy nebo umístění", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Rada: Symbol vyhledávané adresy nebo umístění určeného kliknutím.", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Vyberte barvu písma pro výsledky vyhledávání.", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Rada: Barva písma výsledků vyhledávání." //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Vyberte vrstvy pro vyhledávání", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Rada: Použijte tlačítko výběru ke zvolení vrstev.", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Nastavit", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Storno" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Nastavení směru", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Služba trasování", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Služba způsobu přepravy", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Nastavit", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Rada: Klikněte na tlačítko Nastavit a zvolte službu trasování.", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Jednotky délky směru", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Rada: Slouží k zobrazení jednotek trasy.", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Vyberte symbol k zobrazení trasy.", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Rada: Slouží k zobrazení liniového symbolu trasy.", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Rada: Klikněte na tlačítko Nastavit a zvolte službu způsobu přepravy.", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Zadejte platnou službu způsobu přepravy. ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Aby bylo možné používat navigaci, ujistěte se, že je v položce ArcGIS Online povoleno trasování." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Přidat z ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Přidat URL služby", // shown as a label in route service configuration panel to add service url
      routeURL: "URL trasy", // shown as a label in route service configuration panel
      validateRouteURL: "Ověřit", // shown as a button text in route service configuration panel to validate url
      exampleText: "Příklad", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Storno", // shown as a button text for route service configuration panel
      nextButton: "Další", // shown as a button text for route service configuration panel
      backButton: "Zpět", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Zadejte platnou službu způsobu trasování." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Zadejte platnou číselnou hodnotu.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Vyberte vrstvy pro vyhledávání.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Výchozí šířka obalové zóny nemůže být prázdná. Zadejte šířku obalové zóny.", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Maximální šířka obalové zóny nemůže být prázdná. Zadejte šířku obalové zóny.", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Zadejte výchozí šířku obalové zóny v rámci maximálního omezení.", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Zadejte výchozí šířku obalové zóny větší než 0.", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Zadejte maximální šířku obalové zóny větší než 0." // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Náhled:"
  })
);