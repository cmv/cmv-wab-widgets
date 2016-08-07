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
      "displayText": "أميال",
      "acronym": "أميال"
    },
    "kilometers": {
      "displayText": "كيلومترات",
      "acronym": "كيلومتر"
    },
    "feet": {
      "displayText": "قدم",
      "acronym": "قدم"
    },
    "meters": {
      "displayText": "أمتار",
      "acronym": "متر"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "إعدادات البحث",
    "defaultBufferDistanceLabel": "قم بتعيين مسافة المخزن المؤقت الافتراضية",
    "maxBufferDistanceLabel": "قم بتعيين المسافة القصوى للمخزن المؤقت",
    "bufferDistanceUnitLabel": "وحدات مسافة النطاق",
    "defaultBufferHintLabel": "تلميح: قم بتعيين قيمة شريط تمرير المخزن المؤقت",
    "maxBufferHintLabel": "تلميح: قم بتعيين القيمة القصوى لشريط تمرير المخزن المؤقت",
    "bufferUnitLabel": "تلميح: عرّف وحدة لإنشاء النطاق",
    "selectGraphicLocationSymbol": "رمز العنوان أو الموقع",
    "graphicLocationSymbolHintText": "تلميح: رمز العنوان الذي تم البحث عنه أو الموقع الذي تم النقر عليه",
    "fontColorLabel": "حدد لون خط نتائج البحث",
    "fontColorHintText": "تلميح: لون خط نتائج البحث",
    "zoomToSelectedFeature": "قم بتكبير/تصغير المعلم المحدد",
    "zoomToSelectedFeatureHintText": "تلميح: قم بتكبير/تصغير المعلم المحدد بدلاً من المخزن المؤقت",
    "intersectSearchLocation": "إرجاع مضلعات متقاطعة",
    "intersectSearchLocationHintText": "تلميح: إرجاع مضلعات تحتوي على الموقع الذي يتم البحث عنه بدلاً من المضلعات التي تقع ضمن المخزن المؤقت",
    "bufferVisibilityLabel": "قم بتعيين رؤية المخزن المؤقت",
    "bufferVisibilityHintText": "تلميح: سيتم عرض المخزن المؤقت على الخريطة",
    "bufferColorLabel": "قم بتعيين رمز المخزن المؤقت",
    "bufferColorHintText": "تلميح: حدد لون وشفافية المخزن المؤقت",
    "searchLayerResultLabel": "اسم نتائج الطبقة المحدد فقط",
    "searchLayerResultHint": "تلميح: سيتم رسم الطبقة المحددة في نتائج البحث فقط على الخريطة"
  },
  "layerSelector": {
    "selectLayerLabel": "حدد طبقات البحث",
    "layerSelectionHint": "تلميح: استخدمه لتعيين زر تحديد الطبقات",
    "addLayerButton": "تعيين"
  },
  "routeSetting": {
    "routeSettingTabTitle": "إعدادات الاتجاهات",
    "routeServiceUrl": "خدمة التوجيه",
    "buttonSet": "تعيين",
    "routeServiceUrlHintText": "تلميح: انقر على â€˜تعيينâ€™ لاستعراض خدمة التوجيه وتحديدها",
    "directionLengthUnit": "وحدات طول الاتجاه",
    "unitsForRouteHintText": "تلميح: تُستخدم لعرض وحدات المسار",
    "selectRouteSymbol": "حدد رمزًا لعرض المسار",
    "routeSymbolHintText": "تلميح: يُستخدم لعرض الرموز الخطية للمسار",
    "routingDisabledMsg": "لتمكين الاتجاهات، تأكد من تمكين التوجيه في عنصر ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "إضافة من ArcGIS Online",
    "serviceURLabel": "إضافة عنوان URL للخدمة",
    "routeURL": "عنوان URL للمسار",
    "validateRouteURL": "تدقيق",
    "exampleText": "مثال",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "يرجى تحديد خدمة وضع سفر صحيحة.",
    "rateLimitExceeded": "تم تجاوز حد المُعدل. يرجى إعادة المحاولة لاحقًا.",
    "errorInvokingService": "اسم المستخدم أو كلمة المرور غير صحيحين."
  },
  "errorStrings": {
    "bufferErrorString": "يرجى إدخال قيمة رقمية صحيحة.",
    "selectLayerErrorString": "يرجى تحديد طبقات للبحث عنها.",
    "invalidDefaultValue": "لا يجوز أن تكون مسافة النطاق الافتراضية فارغة، يرجى تحديد مسافة النطاق.",
    "invalidMaximumValue": "لا يجوز أن تكون مسافة النطاق القصوى فارغة، يرجى تحديد مسافة النطاق.",
    "defaultValueLessThanMax": "يرجى تحديد مسافة النطاق الافتراضية ضمن أقصى حد",
    "defaultBufferValueGreaterThanZero": "يرجى تحديد مسافة النطاق الافتراضية التي تزيد عن 0",
    "maximumBufferValueGreaterThanZero": "يرجى تحديد مسافة النطاق القصوى التي تزيد عن 0"
  },
  "symbolPickerPreviewText": "معاينة:"
});