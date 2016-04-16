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
      miles: "מיילים", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "קילומטרים", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "רגל", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "מטרים" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "הגדרות חיפוש", // shown as a label in config UI dialog box for layer setting
      buttonSet: "הגדר", // shown as a button text to set layers
      selectLayersLabel: "בחר שכבה",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "רמז: משמש לבחירת שכבת פוליגונים ושכבת הנקודות המקושרת אליה.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "בחר סמל להדגשת פוליגון", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "סמל כתובת או מיקום", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "רמז: סמל עבור כתובת שחיפשת או מיקום שלחצת עליו", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "רמז: משמש להצגת סמל עבור פוליגון שנבחר" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "אישור", // shown as a button text for layerSelector configuration panel
      cancelButton: "בטל", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "בחר שכבת פוליגונים", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "רמז: משמש לבחירת שכבת פוליגונים.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "בחר שכבת נקודות מקושרת לשכבת הפוליגונים", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "רמז: משמש לבחירת שכבת נקודות מקושרת לשכבת הפוליגונים", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "בחר שכבת פוליגונים שיש לה שכבת נקודות מקושרת.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "בחר שכבת פוליגונים שיש לה שכבת נקודות מקושרת.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "בחר שכבת נקודות מקושרת לשכבת הפוליגונים." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "הגדרות כיוון", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "שירות מסלול", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "שירות מצב נסיעה", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "הגדר", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "רמז: לחץ על \'הגדר\' כדי לנתב לשירות מסלול של ניתוח רשת ולבחור אותו", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "יחידות אורך של כיוון", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "רמז: משמש להצגת יחידות מדווחות עבור מסלול", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "בחר סמל להצגת מסלול", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "רמז: משמש להצגת סמל קווי של המסלול", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "רמז: לחץ על \'הגדר\' כדי לנתב לשירות מצב נסיעה ולבחור אותו", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "ציין שירות מצב נסיעה חוקי", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "כדי לאפשר הוראות נסיעה, ודא שניתוב מאופשר בפריט ה- ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "הוסף מ-ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "הוסף כתובת URL של שירות", // shown as a label in route service configuration panel to add service url
      routeURL: "URL של המסלול", // shown as a label in route service configuration panel
      validateRouteURL: "אמת", // shown as a button text in route service configuration panel to validate url
      exampleText: "דוגמה", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "אישור", // shown as a button text for route service configuration panel
      cancelButton: "בטל", // shown as a button text for route service configuration panel
      nextButton: "הבא", // shown as a button text for route service configuration panel
      backButton: "קודם", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "ציין שירות מסלול חוקי." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "תצוגה מקדימה:"
  })
);