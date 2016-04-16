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
        displayText: "Mile",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilometer",
        acronym: "km"
      },
      feet: {
        displayText: "Fot",
        acronym: "fot"
      },
      meters: {
        displayText: "Meter",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Sökinställningar", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Ange ett standardvärde för buffertavstånd", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Ange ett maxvärde för buffertavstånd vid sökning efter geoobjekt", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Enheter för buffertavstånd", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Tips: Används för att ange ett standardvärde för en buffert", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Tips: Används för att ange ett maxvärde för en buffert", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Tips: Ange vilken enhet som ska användas när man skapar buffertar", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Adress- eller platssymbol", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Tips: Symbol för adresser som användarna sökt efter eller platser som de klickat på", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Välj teckensnittsfärg i sökresultaten", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Tips: Teckensnittsfärg i sökresultaten" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Välj söklager", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Tips: Ange knappen Ange för att välja lager", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Ange", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Appar" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Riktningsinställningar", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Ruttjänst", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Färdlägestjänst", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Ange", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Tips: Klicka på Ange för att leta efter och välja en ruttjänst", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Längdenheter för riktning", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Tips: Används för att visa enheter för rutter", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Välj symbol för visning av rutten", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Tips: Visade tidigare en linjesymbol för rutten", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Tips: Klicka på Ange för att leta efter och markera en färdlägestjänst", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Ange en giltig färdlägestjänst ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Om du vill använda rutter och vägbeskrivningar måste du kontrollera att det har aktiverats i objektet ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Lägg till från ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Lägg till tjänst-URL", // shown as a label in route service configuration panel to add service url
      routeURL: "Rutt-URL", // shown as a label in route service configuration panel
      validateRouteURL: "Validera", // shown as a button text in route service configuration panel to validate url
      exampleText: "Exempel", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Appar", // shown as a button text for route service configuration panel
      nextButton: "Nästa", // shown as a button text for route service configuration panel
      backButton: "Bakom", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Ange en giltig ruttjänst." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Ange ett giltigt numeriskt värde.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Välj vilka lager du vill söka i.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Standardvärdet för buffertavstånd måste vara ifyllt. Ange buffertavståndet", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Maxvärdet för buffertavstånd måste vara ifyllt. Ange buffertavståndet", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Ange standardvärdet för buffertavstånd, och tänk på att det inte får överskrida maxgränsen", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Ange ett standardvärde för buffertavståndet som är större än noll", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Ange ett maxvärde för buffertavståndet som är större än noll" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Förhandsgranska:"
  })
);