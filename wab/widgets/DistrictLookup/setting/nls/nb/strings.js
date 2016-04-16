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
      feet: "Fot", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Meter" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Søkeinnstillinger", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Angi", // shown as a button text to set layers
      selectLayersLabel: "Velg lag",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Hint: Brukes til å velge polygonlag og tilknyttet punktlag.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Velg symbol for å utheve polygon", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Adresse- eller lokasjonssymbol", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Hint: Symbol for adresse det er søkt etter, eller lokasjon det er klikket på.", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Hint: Brukes til å vise enheter for valgt polygon" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Avbryt", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Velg polygonlag", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Hint: Brukes til å velge polygonlag.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Velg punktlag knyttet til polygonlag", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Hint: Brukes til å velge punktlaget som er tilknyttet polygonlaget", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Velg et polygonlag som har et tilknyttet punktlag.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Velg et polygonlag som har et tilknyttet punktlag.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Velg punktlag knyttet til polygonlag." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Innstillinger for rutebeskrivelse", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Rutetjeneste", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Reisemåtetjeneste", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Angi", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Hint: Klikk på Angi for å bla gjennom og velge en rutetjeneste for nettverksanalyse", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Lengdeenheter for rutebeskrivelse", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Hint: Brukes til å vise rapporterte enheter for rute", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Velg symbol for rutevisning", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Hint: Brukes til å vise linjesymbol for ruten", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Hint: Klikk på Angi for å bla gjennom og velge en reisemåtetjeneste", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Angi en gyldig reisemåtetjeneste", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Kontroller at ruteberegning er aktivert i ArcGIS Online-elementet hvis du vil aktivere rutebeskrivelser." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Legg til fra ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Legg til tjeneste-URL", // shown as a label in route service configuration panel to add service url
      routeURL: "Rute-URL", // shown as a label in route service configuration panel
      validateRouteURL: "Valider", // shown as a button text in route service configuration panel to validate url
      exampleText: "Eksempel", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Avbryt", // shown as a button text for route service configuration panel
      nextButton: "Neste", // shown as a button text for route service configuration panel
      backButton: "Tilbake", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Angi en gyldig rutetjeneste" // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Forhåndsvisning:"
  })
);