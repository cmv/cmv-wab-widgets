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
  root: ({
    units: {
      miles: "Miles", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometers", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Feet", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Meters" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Search Settings", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Set", // shown as a button text to set layers
      selectLayersLabel: "Select layer",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Hint: Used to select polygon layer and its related point layer.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Select symbol to highlight polygon", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Address or location symbol", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Hint: Symbol for searched address or clicked location", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Hint: Used to display symbol for selected polygon", // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
      selectColorForPoint: "Select color to highlight point",
      selectColorForPointHintText: "Hint: Used to display highlight color for selected point"
    },
    layerSelector: {
      selectPolygonLayerLabel: "Select polygon layer", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Hint: Used to select polygon layer.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Select point layer related to polygon layer", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Hint:  Used to select point layer related to polygon layer", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Please select a polygon layer which has a related point layer.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Please select a polygon layer which has a related point layer.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Please select point layer related to polygon layer." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Directions Settings", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Routing service", // shown as a label in config UI dialog box for setting the route url
      buttonSet: "Set", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Hint: Click ‘Set’ to browse and select a network analysis routing service", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Direction length units", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Hint: Used to display reported units for route", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Select symbol to display route", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Hint: Used to display line symbol of the route", //shown as hint to select route symbol
      routingDisabledMsg: "To enable directions ensure that routing is enabled in the ArcGIS Online item." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Add from ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Add Service URL", // shown as a label in route service configuration panel to add service url
      routeURL: "Route URL", // shown as a label in route service configuration panel
      validateRouteURL: "Validate", // shown as a button text in route service configuration panel to validate url
      exampleText: "Example", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      invalidRouteServiceURL: "Please specify a valid Route service.", // Shown as an error in alert box invalid route service url is configured.
      rateLimitExceeded: "Rate limit exceeded. Please try again later.", // Shown as an error in alert box if rate limit is exceeded.
      errorInvokingService: "Username or password is incorrect." // Shown as an error in alert box if error found while generating token for service.
    },
    symbolPickerPreviewText: "Preview:"
  }),
  "ar": 1,
  "cs": 1,
  "da": 1,
  "de": 1,
  "el": 1,
  "es": 1,
  "et": 1,
  "fi": 1,
  "fr": 1,
  "he": 1,
  "hr": 1,
  "it": 1,
  "ja": 1,
  "ko": 1,
  "lt": 1,
  "lv": 1,
  "nb": 1,
  "nl": 1,
  "pl": 1,
  "pt-br": 1,
  "pt-pt": 1,
  "ro": 1,
  "ru": 1,
  "sr": 1,
  "sv": 1,
  "th": 1,
  "tr": 1,
  "vi": 1,
  "zh-cn": 1,
  "zh-hk": 1,
  "zh-tw": 1
});
