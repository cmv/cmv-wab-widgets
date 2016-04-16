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
      miles: "Mijl", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometer", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Voet", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Meter" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Zoekinstellingen", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Instellen", // shown as a button text to set layers
      selectLayersLabel: "Kaartlaag selecteren",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Tip: gebruikt voor het selecteren van polygoonlaag en de bijbehorende puntlaag.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Selecteer symbool om polygoon te arceren", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Adres of locatiesymbool", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Tip: symbool voor gezocht adres of aangeklikte locatie", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Tip: gebruikt voor de weergave van het symbool voor de geselecteerde polygoon" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Annuleren", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Polygoonlaag selecteren", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Tip: gebruikt voor het selecteren van polygoonlaag.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Selecteer puntlaag gerelateerd aan polygoonlaag", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Tip: gebruikt voor het selecteren van puntlaag gerelateerd aan polygoonlaag", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Selecteer een polygoonlaag met een bijbehorende puntlaag.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Selecteer een polygoonlaag met een bijbehorende puntlaag.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Selecteer puntlaag gerelateerd aan polygoonlaag." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Instellingen routebeschrijving", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Routingservice", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Service manier van reizen", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Instellen", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Tip: Klik op \'Instellen\' om te bladeren en selecteer een netwerkanalyse routingservice", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Lengte-eenheden richting", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Tip: gebruikt voor de weergave van gerapporteerde eenheden voor route", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Selecteer symbool om de route weer te geven", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Tip: gebruikt voor de weergave van lijnsymbool van de route", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Tip: Klik op \'Instellen\' om te bladeren en selecteer een manier van reizen", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Geef een geldige service voor de manier van reizen op.", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Zorg er om routebeschrijving in te schakelen voor dat de routing is ingeschakeld in het ArcGIS Online item." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Toevoegen vanuit ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Service-URL toevoegen", // shown as a label in route service configuration panel to add service url
      routeURL: "Route-URL", // shown as a label in route service configuration panel
      validateRouteURL: "Valideren", // shown as a button text in route service configuration panel to validate url
      exampleText: "Voorbeeld", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Annuleren", // shown as a button text for route service configuration panel
      nextButton: "Volgende", // shown as a button text for route service configuration panel
      backButton: "Terug", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Geef een geldige routeservice op." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Voorbeeld:"
  })
);