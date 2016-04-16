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
      miles: "Meilen", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometer", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Fuß", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Meter" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Sucheinstellungen", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Festlegen", // shown as a button text to set layers
      selectLayersLabel: "Layer auswählen",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Hinweis: Wird verwendet, um Polygon-Layer und den zugehörigen Punkt-Layer auszuwählen.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Symbol zum Hervorheben des Polygons auswählen", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Symbol für Adresse oder Position", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Hinweis: Symbol für gesuchte Adresse oder aktivierte Position", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Hinweis: Wird verwendet, um ein Symbol für das ausgewählte Polygon anzuzeigen" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Abbrechen", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Polygon-Layer auswählen", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Hinweis: Wird verwendet, um Polygon-Layer auszuwählen.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Mit Polygon-Layer in Beziehung stehenden Punkt-Layer auswählen", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Hinweis: Wird verwendet, um einen mit dem Polygon-Layer in Beziehung stehenden Punkt-Layer auszuwählen", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Wählen Sie einen Polygon-Layer aus, der einen zugehörigen Punkt-Layer aufweist.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Wählen Sie einen Polygon-Layer aus, der einen zugehörigen Punkt-Layer aufweist.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Wählen Sie einen Punkt-Layer aus, der mit einem Polygon-Layer in Beziehung steht." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Wegbeschreibungseinstellungen", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Routing-Service", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Reisemodus-Service", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Festlegen", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Hinweis: Klicken Sie auf \"Festlegen\", um einen Routing-Service für Netzwerkanalysen zu durchsuchen und auszuwählen", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Längeneinheiten für Wegbeschreibung", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Hinweis: Wird zum Anzeigen erfasster Einheiten für die Route verwendet", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Symbol zum Anzeigen der Route auswählen", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Hinweis: Wird zum Anzeigen des Liniensymbols der Route verwendet", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Hinweis: Klicken Sie auf \"Festlegen\", und wählen Sie einen Reisemodus-Service aus", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Geben Sie einen gültigen Reisemodus-Service an", // shown as an error label in alert box when invalid travel mode service url is configured
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
    symbolPickerPreviewText: "Vorschau:"
  })
);