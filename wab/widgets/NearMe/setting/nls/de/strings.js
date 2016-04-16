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
        displayText: "Meilen",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilometer",
        acronym: "km"
      },
      feet: {
        displayText: "Fuß",
        acronym: "ft"
      },
      meters: {
        displayText: "Meter",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Sucheinstellungen", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Wert für Standardpufferabstand festlegen", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Maximalen Pufferabstandswert zum Suchen von Features festlegen", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Pufferabstandseinheiten", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Hinweis: Wird zum Festlegen des Standardwertes für einen Puffer verwendet", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Hinweis: Wird zum Festlegen eines Maximalwertes für einen Puffer verwendet", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Hinweis: Definiert die Einheit für die Erstellung des Puffers", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Symbol für Adresse oder Position", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Hinweis: Symbol für gesuchte Adresse oder aktivierte Position", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Schriftfarbe für Suchergebnisse auswählen", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Hinweis: Schriftfarbe für Suchergebnisse" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Such-Layer(s) auswählen", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Hinweis: Verwenden Sie die Schaltfläche \"Festlegen\", um Layer auszuwählen", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Festlegen", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Abbrechen" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Wegbeschreibungseinstellungen", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Routing-Service", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Reisemodus-Service", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Festlegen", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Hinweis: Klicken Sie auf \"Festlegen\", um einen Routing-Service zu durchsuchen und auszuwählen", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Längeneinheiten für Wegbeschreibung", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Hinweis: Wird zum Anzeigen von Einheiten für die Route verwendet", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Symbol zum Anzeigen der Route auswählen", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Hinweis: Wird zum Anzeigen des Liniensymbols der Route verwendet", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Hinweis: Klicken Sie auf \"Festlegen\", um einen Reisemodus-Service zu durchsuchen und auszuwählen", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Geben Sie einen gültigen Reisemodus-Service an ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Um Wegbeschreibungen zu aktivieren, müssen Sie sicherstellen, dass Routen im ArcGIS Online-Element aktiviert sind." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Aus ArcGIS Online hinzufügen", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Service-URL hinzufügen", // shown as a label in route service configuration panel to add service url
      routeURL: "Routen-URL", // shown as a label in route service configuration panel
      validateRouteURL: "Überprüfen", // shown as a button text in route service configuration panel to validate url
      exampleText: "Beispiel", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Abbrechen", // shown as a button text for route service configuration panel
      nextButton: "Weiter", // shown as a button text for route service configuration panel
      backButton: "Zurück", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Geben Sie einen gültigen Routen-Service an." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Geben Sie einen gültigen numerischen Wert ein.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Wählen Sie den/die zu durchsuchenden Layer aus.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Der Standardpufferabstand darf nicht leer sein. Geben Sie den Pufferabstand an", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Der maximale Pufferabstand darf nicht leer sein. Geben Sie den Pufferabstand an", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Geben Sie den Standardpufferabstand innerhalb der maximalen Grenzwerte an", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Geben Sie für den Standardpufferabstand einen Wert größer als 0 an", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Geben Sie für den maximalen Pufferabstand einen Wert größer als 0 an" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Vorschau:"
  })
);