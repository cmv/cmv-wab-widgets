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
      miles: "Jūdzes", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometri", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Pēdas", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Metri" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Meklēšanas iestatījumi", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Kopa", // shown as a button text to set layers
      selectLayersLabel: "Izvēlēties slāni",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Padoms. Izmanto, lai izvēlētos laukuma slāni un ar to saistīto punktu slāni.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Izvēlieties laukuma izcelšanas simbolu", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Adreses vai izvietojuma simbols", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Padoms. Meklētas adreses vai noklikšķināta izvietojuma simbols", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Padoms. Izmanto, lai parādītu izvēlētā laukuma simbolu" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "Labi", // shown as a button text for layerSelector configuration panel
      cancelButton: "Atcelt", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Izvēlēties laukuma slāni", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Padoms. Izmanto, lai izvēlētos laukuma slāni.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Izvēlieties ar laukuma slāni saistīto punktu slāni", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Padoms. Izmantot, lai izvēlētos ar laukuma slāni saistīto punktu slāni", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Izvēlieties laukuma slāni, kam ir saistīts punktu slānis.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Izvēlieties laukuma slāni, kam ir saistīts punktu slānis.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Izvēlieties ar laukuma slāni saistītu punktu slāni." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Virziena iestatījumi", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Maršruta pakalpojums", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Ceļošanas režīma pakalpojums", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Iestatīt", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Padoms. Noklikšķiniet uz Iestatīt, lai pārlūkotu un izvēlētostīkla analīzes maršruta pakalpojumu", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Virziena garuma vienības", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Padoms. Izmanto norādīto maršruta vienību rādīšanai", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Izvēlēties maršruta rādīšanas simbolu", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Padoms. Izmanto, lai parādītu maršruta līnijas simbolu", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Padoms. Noklikšķiniet uz Iestatīt, lai pārlūkotu un izvēlētos ceļojuma režīma pakalpojumu", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Norādiet derīgu ceļošanas režīma pakalpojumu", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Lai aktivizētu virzienus, ArcGIS Online elementā ir jābūt aktivizētai maršrutēšanai." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Pievienot no ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Pievienot pakalpojuma vietrādi URL", // shown as a label in route service configuration panel to add service url
      routeURL: "Maršruta URL", // shown as a label in route service configuration panel
      validateRouteURL: "Validācija", // shown as a button text in route service configuration panel to validate url
      exampleText: "Piemērs", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "Labi", // shown as a button text for route service configuration panel
      cancelButton: "Atcelt", // shown as a button text for route service configuration panel
      nextButton: "Tālāk", // shown as a button text for route service configuration panel
      backButton: "Atpakaļ", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Norādiet derīgu maršruta pakalpojumu." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Priekšskatījums:"
  })
);