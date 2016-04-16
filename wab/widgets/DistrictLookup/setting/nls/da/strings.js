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
      miles: "Miles", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometer", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Fod", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Meter" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Søgeindstillinger", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Indstil", // shown as a button text to set layers
      selectLayersLabel: "Vælg lag",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Tip: Bruges til at vælge polygonlaget og dets tilknyttede punktlag.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Vælg symbol for at fremhæve polygon", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Adresse- eller positionssymbol", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Tip: Symbol for søgt adresse eller klikket position", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Tip: Bruges til at vise symbol for den valgte polygon" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "&quot;.prvs&quot; er en ugyldig fil til en enkeltbrugerautorisation.", // shown as a button text for layerSelector configuration panel
      cancelButton: "Annuller", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Vælg polygonlag", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Tip: Bruges til at vælge polygonlag.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Vælg det punktlag, der er knyttet til polygonlaget", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Tip: Bruges til at vælge det punktlag, der er knyttet til polygonlaget", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Vælg et polygonlag med et tilknyttet punktlag.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Vælg et polygonlag med et tilknyttet punktlag.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Vælg det punktlag, der er knyttet til polygonlaget." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Indstillinger for kørselsvejledning", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Rutetjeneste", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Rejsetjeneste", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Indstil", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Tip: Klik på ‘Indstil’ for at gå til og vælge en netværksanalysetjeneste for ruter", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Længdeenheder for kørselsvejledning", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Tip: Bruges til at vise rapporterede enheder for ruten", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Vælg symbol for visning af rute", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Tip: Brug visningslinjesymbolet for ruten", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Tip: Klik på ‘Indstil’ for at gå til og vælge en rejsetjeneste", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Angiv en gyldig rejsetjeneste.", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "For at aktivere kørselsvejledninger skal du sørge for, at ruteplanlægning er aktiveret i ArcGIS Online-elementet." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Tilføj fra ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Tilføj tjeneste-URL", // shown as a label in route service configuration panel to add service url
      routeURL: "Rute-URL", // shown as a label in route service configuration panel
      validateRouteURL: "Bekræft", // shown as a button text in route service configuration panel to validate url
      exampleText: "Eksempel", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "&quot;.prvs&quot; er en ugyldig fil til en enkeltbrugerautorisation.", // shown as a button text for route service configuration panel
      cancelButton: "Annuller", // shown as a button text for route service configuration panel
      nextButton: "Næste", // shown as a button text for route service configuration panel
      backButton: "Tilbage", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Angiv en gyldig rutetjeneste." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Forhåndsvisning:"
  })
);