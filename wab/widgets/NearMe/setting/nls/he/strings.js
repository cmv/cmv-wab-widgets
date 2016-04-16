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
        displayText: "מיילים",
        acronym: "מיילים"
      },
      kilometers: {
        displayText: "קילומטרים",
        acronym: "ק\"מ"
      },
      feet: {
        displayText: "רגל",
        acronym: "רגל"
      },
      meters: {
        displayText: "מטרים",
        acronym: "מ\'"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "הגדרות חיפוש", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "הגדר ערך ברירת מחדל של מרחק חיץ", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "הגדר ערך מקסימום של מרחק חיץ לחיפוש ישויות", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "יחידות מרחק חיץ", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "רמז: משמש להגדרת ערך ברירת מחדל של אזור חיץ", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "רמז: משמש להגדרת ערך מקסימלי של אזור חיץ", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "רמז: הגדר יחידה ליצירת אזור חיץ", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "סמל כתובת או מיקום", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "רמז: סמל עבור כתובת שחיפשת או מיקום שלחצת עליו", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "בחר צבע גופן עבור תוצאות החיפוש", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "רמז: צבע גופן של תוצאות החיפוש" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "בחר שכבות חיפוש", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "רמז: השתמש בלחצן ההגדרה לבחירת שכבות", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "הגדר", //Shown as a button text to add the layer for search
      okButton: "אישור", // shown as a button text for layer selector popup
      cancelButton: "בטל" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "הגדרות כיוון", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "שירות מסלול", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "שירות מצב נסיעה", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "הגדר", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "רמז: לחץ על \'הגדר\' כדי לנתב לשירות מסלול ולבחור אותו", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "יחידות אורך של כיוון", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "רמז: משמש להצגת יחידות עבור מסלול", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "בחר סמל להצגת מסלול", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "רמז: משמש להצגת סמל קווי של המסלול", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "רמז: לחץ על \'הגדר\' כדי לנתב לשירות מצב נסיעה ולבחור אותו", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "ציין שירות מצב נסיעה חוקי ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "כדי לאפשר הוראות נסיעה, ודא שניתוב מסלולים מאופשר בפריט ה- ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
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
    errorStrings: {
      bufferErrorString: "הזן ערך מספרי חוקי.", // shown as an error label in text box for buffer
      selectLayerErrorString: "בחר שכבה/ות לחיפוש.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "מרחק החיץ המוגדר כברירת מחדל לא יכול להיות ריק. ציין את מרחק החיץ", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "מרחק החיץ המקסימלי לא יכול להיות ריק. ציין את מרחק החיץ", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "ציין את מרחק החיץ המוגדר כברירת מחדל בטווח האפשרי עד לגבול המקסימלי", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "ציין את מרחק החיץ המוגדר כברירת מחדל כשהוא גדול מ-0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "ציין את מרחק החיץ המקסימלי כשהוא גדול מ-0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "תצוגה מקדימה:"
  })
);