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
      miles: "Miili", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilomeetrit", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Jalga", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Meetrit" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Otsingu seaded", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Määra", // shown as a button text to set layers
      selectLayersLabel: "Vali kiht",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Vihje: kasutatakse polügoonikihi ja sellega seotud punktikihi valimiseks.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Vali polügooni esiletõstmiseks sümbol", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Aadressi või asukoha sümbol", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Vihje: otsitud aadressi või klõpsatud asukoha sümbol", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Vihje: kasutatakse valitud polügooni sümboli kuvamiseks" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Tühista", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Vali polügoonikiht", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Vihje: kasutatakse polügoonikihi valimiseks.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Vali polügoonikihiga seotud punktikiht", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Vihje: kasutatakse polügoonikihiga seotud punktikihi valimiseks", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Valige polügoonikiht, millega on seotud punktikiht.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Valige polügoonikiht, millega on seotud punktikiht.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Valige polügoonikihiga seotud punktikiht." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Teejuhiste seaded", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Marsruutimisteenus", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Sõidurežiimi teenus", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Määra", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Vihje: võrguanalüüsi marsruutimisteenuse sirvimiseks ja valimiseks klõpsake nuppu ‘Määra’", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Teejuhise pikkusühikud", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Vihje: kasutatakse marsruudi ühikute kuvamiseks", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Vali marsruudi kuvamiseks sümbol", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Vihje: kasutatakse marsruudi joonsümboli kuvamiseks", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Vihje: sõidurežiimi teenuse sirvimiseks ja valimiseks klõpsake nuppu ‘Määra’", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Määrake sobiv sõidurežiimi teenus", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Enne teejuhiste lubamist veenduge, et marsruutimine on ArcGIS Online\'i üksuses lubatud." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Lisa ArcGIS Online’ist", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Lisa teenuse URL", // shown as a label in route service configuration panel to add service url
      routeURL: "Marsruudi URL", // shown as a label in route service configuration panel
      validateRouteURL: "Valideeri", // shown as a button text in route service configuration panel to validate url
      exampleText: "Näide", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Tühista", // shown as a button text for route service configuration panel
      nextButton: "Edasi", // shown as a button text for route service configuration panel
      backButton: "Tagasi", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Määrake sobiv marsruuditeenus." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Eelvaade:"
  })
);