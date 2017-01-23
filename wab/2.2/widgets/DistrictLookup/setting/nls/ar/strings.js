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
    "miles": "أميال",
    "kilometers": "كيلومترات",
    "feet": "قدم",
    "meters": "أمتار"
  },
  "layerSetting": {
    "layerSettingTabTitle": "إعدادات البحث",
    "buttonSet": "تعيين",
    "selectLayersLabel": "حدد الطبقة",
    "selectLayersHintText": "تلميح: تُستخدم لتحديد طبقة المضلع وطبقته النقطية.",
    "selectPrecinctSymbolLabel": "حدد رمزًا لتمييز المضلع",
    "selectGraphicLocationSymbol": "رمز العنوان أو الموقع",
    "graphicLocationSymbolHintText": "تلميح: رمز العنوان الذي تم البحث عنه أو الموقع الذي تم النقر عليه",
    "precinctSymbolHintText": "تلميح: يُستخدم لعرض رمز المضلع المحدد",
    "selectColorForPoint": "حدد اللون لتمييز النقطة",
    "selectColorForPointHintText": "تلميح: يُستخدَم لعرض لون التمييز للنقطة المحددة"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "حدد طبقة مضلع",
    "selectPolygonLayerHintText": "تلميح: تُستخدم لتحديد طبقة مضلع.",
    "selectRelatedPointLayerLabel": "حدد طبقة نقطية متصلة بطبقة المضلع",
    "selectRelatedPointLayerHintText": "تلميح: تُستخدم لتحديد طبقة نقطية متصلة بطبقة المضلع",
    "polygonLayerNotHavingRelatedLayer": "يرجى تحديد طبقة مضلع ذات طبقة نقطية ذات صلة.",
    "errorInSelectingPolygonLayer": "يرجى تحديد طبقة مضلع ذات طبقة نقطية ذات صلة.",
    "errorInSelectingRelatedLayer": "يرجى تحديد طبقة نقطية متصلة بطبقة مضلع."
  },
  "routeSetting": {
    "routeSettingTabTitle": "إعدادات الاتجاهات",
    "routeServiceUrl": "خدمة التوجيه",
    "buttonSet": "تعيين",
    "routeServiceUrlHintText": "تلميح: انقر على 'تعيين' لاستعراض خدمة توجيه تحليل الشبكة وتحديدها",
    "directionLengthUnit": "وحدات طول الاتجاه",
    "unitsForRouteHintText": "تلميح: تُستخدم لعرض وحدات المسار التي تم الإبلاغ عنها",
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
  "symbolPickerPreviewText": "معاينة:"
});