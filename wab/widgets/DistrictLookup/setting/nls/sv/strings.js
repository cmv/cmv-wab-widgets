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
    units: {
      miles: "Mile", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometer", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Fot", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Meter" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Sökinställningar", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Ange", // shown as a button text to set layers
      selectLayersLabel: "Välj lager",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Tips: Används för att markera polygonlager och tillhörande punktlager.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Välj symbol för att markera polygon", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Adress- eller platssymbol", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Tips: Symbol för adresser som användarna sökt efter eller platser som de klickat på", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Tips: Används för att visa symbolen för en markerad polygon" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Appar", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Välj polygonlager", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Tips: Används för att markera polygonlager.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Markera punktlager som är kopplade till polygonlager", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Tips: Används för att markera punktlager som är kopplade till polygonlager", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Välj ett polygonlager som har ett tillhörande punktlager.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Välj ett polygonlager som har ett tillhörande punktlager.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Markera punktlager som är kopplade till polygonlager." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Riktningsinställningar", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Ruttjänst", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Färdlägestjänst", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Ange", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Tips: Klicka på Ange för att leta efter och markera en ruttjänst för nätverksanalys", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Längdenheter för riktning", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Tips: Används för att visa rapporterade enheter för rutter", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Välj symbol för visning av rutten", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Tips: Visade tidigare en linjesymbol för rutten", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Tips: Klicka på Ange för att leta efter och välja en färdlägestjänst", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Ange en giltig färdlägestjänst", // shown as an error label in alert box when invalid travel mode service url is configured
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
    symbolPickerPreviewText: "Förhandsgranska:"
  })
);