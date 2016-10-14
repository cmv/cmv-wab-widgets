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
define({
  "units": {
    "miles": {
      "displayText": "Meilen",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilometer",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Fuß",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Meter",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Sucheinstellungen",
    "defaultBufferDistanceLabel": "Standardpufferabstand festlegen",
    "maxBufferDistanceLabel": "Maximalen Pufferabstand festlegen",
    "bufferDistanceUnitLabel": "Pufferabstandseinheiten",
    "defaultBufferHintLabel": "Hinweis: Standardwert für den Pufferschieberegler festlegen",
    "maxBufferHintLabel": "Hinweis: Maximalwert für den Pufferschieberegler festlegen",
    "bufferUnitLabel": "Hinweis: Definiert die Einheit für die Erstellung des Puffers",
    "selectGraphicLocationSymbol": "Symbol für Adresse oder Position",
    "graphicLocationSymbolHintText": "Hinweis: Symbol für gesuchte Adresse oder aktivierte Position",
    "fontColorLabel": "Schriftfarbe für Suchergebnisse auswählen",
    "fontColorHintText": "Hinweis: Schriftfarbe für Suchergebnisse",
    "zoomToSelectedFeature": "Auf das ausgewählte Feature zoomen",
    "zoomToSelectedFeatureHintText": "Hinweis: Es wird auf das ausgewählte Feature statt auf den Puffer gezoomt.",
    "intersectSearchLocation": "Sich schneidende(s) Polygon(e) zurückgeben",
    "intersectSearchLocationHintText": "Hinweis: Es werden  Polygone zurückgegeben, die die gesuchte Position enthalten, anstatt Polygone innerhalb des Puffers.",
    "bufferVisibilityLabel": "Puffersichtbarkeit festlegen",
    "bufferVisibilityHintText": "Hinweis: Der Puffer wird auf der Karte angezeigt.",
    "bufferColorLabel": "Puffersymbol festlegen",
    "bufferColorHintText": "Hinweis: Wählen Sie die Farbe und die Transparenz des Puffers aus.",
    "searchLayerResultLabel": "Nur ausgewählte Layer-Ergebnisse darstellen",
    "searchLayerResultHint": "Hinweis: Nur der ausgewählte Layer in den Suchergebnissen wird auf der Karte dargestellt."
  },
  "layerSelector": {
    "selectLayerLabel": "Such-Layer(s) auswählen",
    "layerSelectionHint": "Hinweis: Verwenden Sie die Schaltfläche \"Festlegen\", um Layer auszuwählen.",
    "addLayerButton": "Festlegen"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Wegbeschreibungseinstellungen",
    "routeServiceUrl": "Routing-Service",
    "buttonSet": "Festlegen",
    "routeServiceUrlHintText": "Hinweis: Klicken Sie auf \"Festlegen\", um einen Routing-Service zu durchsuchen und auszuwählen.",
    "directionLengthUnit": "Längeneinheiten für Wegbeschreibung",
    "unitsForRouteHintText": "Hinweis: Wird zum Anzeigen von Einheiten für die Route verwendet",
    "selectRouteSymbol": "Symbol zum Anzeigen der Route auswählen",
    "routeSymbolHintText": "Hinweis: Wird zum Anzeigen des Liniensymbols der Route verwendet",
    "routingDisabledMsg": "Um Wegbeschreibungen zu aktivieren, müssen Sie sicherstellen, dass Routen im ArcGIS Online-Element aktiviert sind."
  },
  "networkServiceChooser": {
    "arcgislabel": "Aus ArcGIS Online hinzufügen",
    "serviceURLabel": "Service-URL hinzufügen",
    "routeURL": "Routen-URL",
    "validateRouteURL": "Überprüfen",
    "exampleText": "Beispiel",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Geben Sie einen gültigen Routen-Service an.",
    "rateLimitExceeded": "Datenübertragungsrate überschritten. Versuchen Sie es später erneut.",
    "errorInvokingService": "Falscher Benutzername oder falsches Kennwort."
  },
  "errorStrings": {
    "bufferErrorString": "Geben Sie einen gültigen numerischen Wert ein.",
    "selectLayerErrorString": "Wählen Sie den/die zu durchsuchenden Layer aus.",
    "invalidDefaultValue": "Der Standardpufferabstand darf nicht leer sein. Geben Sie den Pufferabstand an.",
    "invalidMaximumValue": "Der maximale Pufferabstand darf nicht leer sein. Geben Sie den Pufferabstand an.",
    "defaultValueLessThanMax": "Geben Sie den Standardpufferabstand innerhalb der maximalen Grenzwerte an.",
    "defaultBufferValueGreaterThanZero": "Geben Sie für den Standardpufferabstand einen Wert größer als 0 an.",
    "maximumBufferValueGreaterThanZero": "Geben Sie für den maximalen Pufferabstand einen Wert größer als 0 an."
  },
  "symbolPickerPreviewText": "Vorschau:"
});