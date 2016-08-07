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
      "displayText": "מיילים",
      "acronym": "מיילים"
    },
    "kilometers": {
      "displayText": "קילומטרים",
      "acronym": "ק\"מ"
    },
    "feet": {
      "displayText": "רגל",
      "acronym": "רגל"
    },
    "meters": {
      "displayText": "מטרים",
      "acronym": "מ'"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "הגדרות חיפוש",
    "defaultBufferDistanceLabel": "הגדר ברירת מחדל של מרחק חיץ",
    "maxBufferDistanceLabel": "הגדר מרחק חיץ מקסימלי",
    "bufferDistanceUnitLabel": "יחידות מרחק חיץ",
    "defaultBufferHintLabel": "רמז: הגדר ערך ברירת מחדל עבור מחוון החיץ",
    "maxBufferHintLabel": "רמז: הגדר ערך מקסימום עבור מחוון החיץ",
    "bufferUnitLabel": "רמז: הגדר יחידה ליצירת אזור חיץ",
    "selectGraphicLocationSymbol": "סמל כתובת או מיקום",
    "graphicLocationSymbolHintText": "רמז: סמל עבור כתובת שחיפשת או מיקום שלחצת עליו",
    "fontColorLabel": "בחר צבע גופן עבור תוצאות החיפוש",
    "fontColorHintText": "רמז: צבע גופן של תוצאות החיפוש",
    "zoomToSelectedFeature": "התמקד לישות שנבחרה",
    "zoomToSelectedFeatureHintText": "רמז: התמקד לישות שנבחרה במקום לחיץ",
    "intersectSearchLocation": "החזר פוליגונים מצטלבים",
    "intersectSearchLocationHintText": "רמז: החזר פוליגונים שמכילים את המיקום שבו נערך החיפוש במקום פוליגונים בתוך החיץ",
    "bufferVisibilityLabel": "הגדר ניראות של חיץ",
    "bufferVisibilityHintText": "רמז: החיץ יוצג על המפה",
    "bufferColorLabel": "הגדר סמל חיץ",
    "bufferColorHintText": "רמז: בחר צבע ושקיפות עבור החיץ",
    "searchLayerResultLabel": "צייר רק את תוצאות השכבה שנבחרה",
    "searchLayerResultHint": "רמז: רק השכבה שנבחרה בתוצאות החיפוש תצויר על המפה"
  },
  "layerSelector": {
    "selectLayerLabel": "בחר שכבות חיפוש",
    "layerSelectionHint": "רמז: השתמש בלחצן ההגדרה לבחירת שכבות",
    "addLayerButton": "הגדר"
  },
  "routeSetting": {
    "routeSettingTabTitle": "הגדרות הוראות נסיעה",
    "routeServiceUrl": "שירות מסלול",
    "buttonSet": "הגדר",
    "routeServiceUrlHintText": "רמז: לחץ על 'הגדר' כדי לנווט לשירות מסלול ולבחור אותו",
    "directionLengthUnit": "יחידות אורך של כיוון",
    "unitsForRouteHintText": "רמז: משמש להצגת יחידות עבור מסלול",
    "selectRouteSymbol": "בחר סמל להצגת מסלול",
    "routeSymbolHintText": "רמז: משמש להצגת סמל קווי של המסלול",
    "routingDisabledMsg": "כדי לאפשר הוראות נסיעה, ודא שניתוב מסלולים מאופשר בפריט ה- ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "הוסף מ-ArcGIS Online",
    "serviceURLabel": "הוסף כתובת URL של שירות",
    "routeURL": "URL של המסלול",
    "validateRouteURL": "אמת",
    "exampleText": "דוגמה",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "ציין שירות מסלול חוקי.",
    "rateLimitExceeded": "עברת את מגבלת השיעור. נסה שוב מאוחר יותר.",
    "errorInvokingService": "שם משתמש או סיסמה שגויים."
  },
  "errorStrings": {
    "bufferErrorString": "הזן ערך מספרי חוקי.",
    "selectLayerErrorString": "בחר שכבה/ות לחיפוש.",
    "invalidDefaultValue": "מרחק החיץ המוגדר כברירת מחדל לא יכול להיות ריק. ציין את מרחק החיץ",
    "invalidMaximumValue": "מרחק החיץ המקסימלי לא יכול להיות ריק. ציין את מרחק החיץ",
    "defaultValueLessThanMax": "ציין את מרחק החיץ המוגדר כברירת מחדל בטווח האפשרי עד לגבול המקסימלי",
    "defaultBufferValueGreaterThanZero": "ציין את מרחק החיץ המוגדר כברירת מחדל כשהוא גדול מ-0",
    "maximumBufferValueGreaterThanZero": "ציין את מרחק החיץ המקסימלי כשהוא גדול מ-0"
  },
  "symbolPickerPreviewText": "תצוגה מקדימה:"
});