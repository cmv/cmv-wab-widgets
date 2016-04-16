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
        displayText: "Mijl",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilometer",
        acronym: "km"
      },
      feet: {
        displayText: "Voet",
        acronym: "ft"
      },
      meters: {
        displayText: "Meter",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Zoekinstellingen", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Stel de standaard bufferafstandswaarde in", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Stel de maximale bufferafstandswaarde in om objecten te vinden", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Bufferafstandseenheden", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Tip: Gebruiken voor het instellen van de standaardwaarde voor een buffer", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Tip: Gebruiken voor het instellen van de maximumwaarde voor een buffer", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Tip: eenheid definiëren voor het creëren van een buffer", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Adres of locatiesymbool", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Tip: symbool voor gezocht adres of aangeklikte locatie", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Selecteer fontkleur voor zoekresultaten", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Tip: fontkleur van zoekresultaten" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Zoekla(a)g(en) selecteren", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Tip: gebruik de instelknop om la(a)g(en) te selecteren", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Instellen", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Annuleren" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Instellingen richting", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Routingservice", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Service manier van reizen", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Instellen", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Tip: Klik op \'Instellen\' om te bladeren en selecteer een routingservice", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Lengte-eenheden richting", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Tip: gebruikt voor de weergave van eenheden voor route", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Selecteer symbool om de route weer te geven", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Tip: gebruikt voor de weergave van lijnsymbool van de route", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Tip: klik op \'Instellen\' om te bladeren en selecteer een manier van reizen", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Geef een geldige service voor de manier van reizen op. ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Zorg er om richtingen in te schakelen voor dat de routing is ingeschakeld in het ArcGIS Online item." // shown as message in routeSettings tab when routing is disabled in webmap
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
    errorStrings: {
      bufferErrorString: "Voer een geldige numerieke waarde in.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Selecteer la(a)g(en) om te zoeken.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Standaard bufferafstand mag niet leeg zijn. Geef de bufferafstand op", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Maximale bufferafstand mag niet leeg zijn. Geef de bufferafstand op", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Geef de standaardbufferafstand op binnen de bovengrens", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Geef de standaardbufferafstand groter dan 0 op", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Geef de maximale bufferafstand groter dan 0 op" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Voorbeeld:"
  })
);