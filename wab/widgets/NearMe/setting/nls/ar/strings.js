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
        displayText: "أميال",
        acronym: "أميال"
      },
      kilometers: {
        displayText: "كيلومترات",
        acronym: "كيلومتر"
      },
      feet: {
        displayText: "قدم",
        acronym: "قدم"
      },
      meters: {
        displayText: "أمتار",
        acronym: "متر"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "إعدادات البحث", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "تعيين قيمة مسافة النطاق الافتراضية", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "تعيين أقصى مسافة النطاق القصوى للعثور على المعالم", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "وحدات مسافة النطاق", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "تلميح: استخدمه لتعيين قيمة افتراضية للنطاق", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "تلميح: استخدمه لتعيين أقصى قيمة للنطاق", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "تلميح: عرّف وحدة لإنشاء النطاق", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "رمز العنوان أو الموقع", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "تلميح: رمز العنوان الذي تم البحث عنه أو الموقع الذي تم النقر عليه", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "حدد لون خط نتائج البحث", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "تلميح: لون خط نتائج البحث" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "حدد طبقات البحث", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "تلميح: استخدمه لتعيين زر تحديد الطبقات", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "تعيين", //Shown as a button text to add the layer for search
      okButton: "موافق", // shown as a button text for layer selector popup
      cancelButton: "إلغاء الأمر" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "إعدادات الاتجاه", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "خدمة التوجيه", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "خدمة وضع السفر", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "تعيين", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "تلميح: انقر على \'تعيين\' لاستعراض خدمة التوجيه وتحديدها", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "وحدات طول الاتجاه", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "تلميح: تُستخدم لعرض وحدات المسار", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "حدد رمزًا لعرض المسار", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "تلميح: يُستخدم لعرض الرموز الخطية للمسار", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "تلميح: انقر على \'تعيين\' لاستعراض خدمة وضع السفر وتحديدها", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "يرجى تحديد خدمة وضع سفر صحيحة ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "لتمكين الاتجاهات، تأكد من تمكين التوجيه في عنصر ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "إضافة من ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "إضافة عنوان URL للخدمة", // shown as a label in route service configuration panel to add service url
      routeURL: "عنوان URL للمسار", // shown as a label in route service configuration panel
      validateRouteURL: "تدقيق", // shown as a button text in route service configuration panel to validate url
      exampleText: "مثال", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "موافق", // shown as a button text for route service configuration panel
      cancelButton: "إلغاء الأمر", // shown as a button text for route service configuration panel
      nextButton: "التالي", // shown as a button text for route service configuration panel
      backButton: "الخلف", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "يرجى تحديد خدمة وضع سفر صحيحة." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "يرجى إدخال قيمة رقمية صحيحة.", // shown as an error label in text box for buffer
      selectLayerErrorString: "يرجى تحديد طبقات للبحث عنها.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "لا يجوز أن تكون مسافة النطاق الافتراضية فارغة، يرجى تحديد مسافة النطاق.", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "لا يجوز أن تكون مسافة النطاق القصوى فارغة، يرجى تحديد مسافة النطاق.", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "يرجى تحديد مسافة النطاق الافتراضية ضمن أقصى حد", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "يرجى تحديد مسافة النطاق الافتراضية التي تزيد عن 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "يرجى تحديد مسافة النطاق القصوى التي تزيد عن 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "معاينة:"
  })
);