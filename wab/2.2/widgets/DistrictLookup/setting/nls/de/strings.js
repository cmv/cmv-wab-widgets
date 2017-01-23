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
    "miles": "Meilen",
    "kilometers": "Kilometer",
    "feet": "Fuß",
    "meters": "Meter"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Sucheinstellungen",
    "buttonSet": "Festlegen",
    "selectLayersLabel": "Layer auswählen",
    "selectLayersHintText": "Hinweis: Wird verwendet, um Polygon-Layer und den zugehörigen Punkt-Layer auszuwählen.",
    "selectPrecinctSymbolLabel": "Symbol zum Hervorheben des Polygons auswählen",
    "selectGraphicLocationSymbol": "Symbol für Adresse oder Position",
    "graphicLocationSymbolHintText": "Hinweis: Symbol für gesuchte Adresse oder aktivierte Position",
    "precinctSymbolHintText": "Hinweis: Wird verwendet, um ein Symbol für das ausgewählte Polygon anzuzeigen",
    "selectColorForPoint": "Farbe zum Hervorheben des Punktes auswählen",
    "selectColorForPointHintText": "Hinweis: Wird zum Anzeigen der Hervorhebungsfarbe für den ausgewählten Punkt verwendet."
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Polygon-Layer auswählen",
    "selectPolygonLayerHintText": "Hinweis: Wird verwendet, um Polygon-Layer auszuwählen.",
    "selectRelatedPointLayerLabel": "Mit Polygon-Layer in Beziehung stehenden Punkt-Layer auswählen",
    "selectRelatedPointLayerHintText": "Hinweis: Wird verwendet, um einen mit dem Polygon-Layer in Beziehung stehenden Punkt-Layer auszuwählen.",
    "polygonLayerNotHavingRelatedLayer": "Wählen Sie einen Polygon-Layer aus, der einen zugehörigen Punkt-Layer aufweist.",
    "errorInSelectingPolygonLayer": "Wählen Sie einen Polygon-Layer aus, der einen zugehörigen Punkt-Layer aufweist.",
    "errorInSelectingRelatedLayer": "Wählen Sie einen Punkt-Layer aus, der mit einem Polygon-Layer in Beziehung steht."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Wegbeschreibungseinstellungen",
    "routeServiceUrl": "Routing-Service",
    "buttonSet": "Festlegen",
    "routeServiceUrlHintText": "Hinweis: Klicken Sie auf \"Festlegen\", um einen Routing-Service für Netzwerkanalysen zu durchsuchen und auszuwählen",
    "directionLengthUnit": "Längeneinheiten für Wegbeschreibung",
    "unitsForRouteHintText": "Hinweis: Wird zum Anzeigen erfasster Einheiten für die Route verwendet.",
    "selectRouteSymbol": "Symbol zum Anzeigen der Route auswählen",
    "routeSymbolHintText": "Hinweis: Wird zum Anzeigen des Liniensymbols der Route verwendet.",
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
  "symbolPickerPreviewText": "Vorschau:"
});