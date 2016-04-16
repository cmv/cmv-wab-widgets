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
        displayText: "Fod",
        acronym: "fod"
      },
      meters: {
        displayText: "Meter",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Søgeindstillinger", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Angiv værdi for standardbufferafstand", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Angiv værdi for maksimal bufferafstand for søgning efter objekter", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Bufferafstandsenheder", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Tip: Bruges til at angive standardværdi for en buffer", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Tip: Bruges til at angive maksimumværdi for en buffer", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Tip: Definér enhed for oprettelse af en buffer", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Adresse- eller positionssymbol", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Tip: Symbol for søgt adresse eller klikket position", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Vælg skrifttypefarve for søgeresultater", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Tip: Skrifttypefarve for søgeresultater" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Vælg søgelag", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Tip: Brug indstillingsknappen til at vælge lag(ene)", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Indstil", //Shown as a button text to add the layer for search
      okButton: "&quot;.prvs&quot; er en ugyldig fil til en enkeltbrugerautorisation.", // shown as a button text for layer selector popup
      cancelButton: "Annuller" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Indstillinger for kørselsvejledning", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Rutetjeneste", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Rejsetjeneste", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Indstil", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Tip: Klik på ‘Indstil’ for at gå til og vælge en rutetjeneste", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Længdeenheder for kørselsvejledning", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Tip: Bruges til at vise enheder for ruten", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Vælg symbol for visning af rute", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Tip: Brug visningslinjesymbolet for ruten", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Tip: Klik på ‘Indstil’ for at gå til og vælge en rejsetjeneste", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Angiv en gyldig rejsetjeneste. ", // shown as an error label in alert box when invalid travel mode service url is configured
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
    errorStrings: {
      bufferErrorString: "Angiv en gyldig numerisk værdi.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Vælg de lag, der skal søges i.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Standardbufferafstand kan ikke være tom. Angiv bufferafstanden", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Maksimumbufferafstand kan ikke være tom. Angiv bufferafstanden", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Angiv standardbufferafstand inden for maksimumgrænsen", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Angiv en standardbufferafstand, der er større end 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Angiv en maksimumbufferafstand, der er større end 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Forhåndsvisning:"
  })
);