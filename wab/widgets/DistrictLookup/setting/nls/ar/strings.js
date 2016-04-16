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
      miles: "أميال", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "كيلومترات", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "قدم", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "أمتار" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "إعدادات البحث", // shown as a label in config UI dialog box for layer setting
      buttonSet: "تعيين", // shown as a button text to set layers
      selectLayersLabel: "حدد الطبقة",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "تلميح: تُستخدم لتحديد طبقة المضلع وطبقته النقطية.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "حدد رمزًا لتمييز المضلع", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "رمز العنوان أو الموقع", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "تلميح: رمز العنوان الذي تم البحث عنه أو الموقع الذي تم النقر عليه", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "تلميح: يُستخدم لعرض رمز المضلع المحدد" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "موافق", // shown as a button text for layerSelector configuration panel
      cancelButton: "إلغاء الأمر", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "حدد طبقة مضلع", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "تلميح: تُستخدم لتحديد طبقة مضلع.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "حدد طبقة نقطية متصلة بطبقة المضلع", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "تلميح: تُستخدم لتحديد طبقة نقطية متصلة بطبقة المضلع", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "يرجى تحديد طبقة مضلع ذات طبقة نقطية ذات صلة.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "يرجى تحديد طبقة مضلع ذات طبقة نقطية ذات صلة.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "يرجى تحديد طبقة نقطية متصلة بطبقة مضلع." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "إعدادات الاتجاه", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "خدمة التوجيه", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "خدمة وضع السفر", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "تعيين", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "تلميح: انقر على \'تعيين\' لاستعراض خدمة توجيه تحليل الشبكة وتحديدها", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "وحدات طول الاتجاه", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "تلميح: تُستخدم لعرض وحدات المسار التي تم الإبلاغ عنها", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "حدد رمزًا لعرض المسار", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "تلميح: يُستخدم لعرض الرموز الخطية للمسار", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "تلميح: انقر على \'تعيين\' لاستعراض خدمة وضع السفر وتحديدها", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "يرجى تحديد خدمة وضع سفر صحيحة", // shown as an error label in alert box when invalid travel mode service url is configured
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
    symbolPickerPreviewText: "معاينة:"
  })
);