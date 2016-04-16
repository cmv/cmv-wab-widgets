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
        displayText: "Miles",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilometer",
        acronym: "km"
      },
      feet: {
        displayText: "Fot",
        acronym: "ft"
      },
      meters: {
        displayText: "Meter",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Søkeinnstillinger", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Angi standard bufferavstand", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Angi maksimum bufferavstand for å finne geoobjekter", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Enheter for bufferavstand", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Hint: Brukes til å angi standardverdien for en buffer", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Hint: Brukes til å angi maksimumsverdien for en buffer", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Hint: Angi enhet for oppretting av buffer", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Adresse- eller lokasjonssymbol", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Hint: Symbol for adresse det er søkt etter, eller lokasjon det er klikket på.", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Velg skriftfarge for søkeresultater", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Hint: Skriftfarge for søkeresultater" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Velg et eller flere søkelag", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Hint: Bruk Angi-knappen til å velge et eller flere lag", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Angi", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Avbryt" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Innstillinger for rutebeskrivelse", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Rutetjeneste", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Reisemåtetjeneste", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Angi", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Hint: Klikk på Angi for å bla gjennom og velge en rutetjeneste", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Lengdeenheter for rutebeskrivelse", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Hint: Brukes til å vise enheter for rute", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Velg symbol for rutevisning", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Hint: Brukes til å vise linjesymbol for ruten", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Hint: Klikk på Angi for å bla gjennom og velge en reisemåtetjeneste", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Angi en reisemåtetjeneste ", // shown as an error label in alert box when invalid travel mode service url is configured
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
    errorStrings: {
      bufferErrorString: "Angi en gyldig numerisk verdi.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Velg laget eller lagene det skal søkes i.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Standard bufferavstand kan ikke være tom. Angi bufferavstanden.", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Maksimum bufferavstand kan ikke være tom. Angi bufferavstanden.", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Angi standard bufferavstand med maksimumsgrensen", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Du må angi en standard bufferavstand som er høyere enn 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Du må angi en maksimum bufferavstand som er høyere enn 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Forhåndsvisning:"
  })
);