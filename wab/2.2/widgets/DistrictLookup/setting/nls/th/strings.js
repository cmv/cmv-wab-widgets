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
    "miles": "ไมล์",
    "kilometers": "กิโลเมตร",
    "feet": "ฟุต",
    "meters": "เมตร"
  },
  "layerSetting": {
    "layerSettingTabTitle": "ค้นหาการตั้งค่า",
    "buttonSet": "ตั้ง",
    "selectLayersLabel": "เลือกชั้นข้อมูล",
    "selectLayersHintText": "คำแนะนำ : ใช้เพื่อเลือกพื้นที่ที่มีความเกี่ยวข้องกับข้อมูลจุด",
    "selectPrecinctSymbolLabel": "เลือกสัญลักษณ์เพื่อไฮไลท์พื้นที่",
    "selectGraphicLocationSymbol": "สัญลักษณ์ที่อยู่หรือตำแหน่ง",
    "graphicLocationSymbolHintText": "คำแนะนำ : สัญลักษณ์เพื่อค้นหาที่อยู่หรือคลิกตำแหน่ง",
    "precinctSymbolHintText": "คำแนะนำ : ใช้เพื่อแสดงผลสัญลักษณ์ในการเลือกพื้นที่",
    "selectColorForPoint": "เลือกสีที่จะเน้นจุด",
    "selectColorForPointHintText": "คำแนะนำ: ใช้เพื่อแสดงสีไฮไลท์สำหรับจุดที่เลือก"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "เลือกชั้นข้อมูลพื้นที่",
    "selectPolygonLayerHintText": "คำแนะนำ : ใช้เพื่อเลือกชั้นข้อมูลพื้นที่",
    "selectRelatedPointLayerLabel": "เลือกชั้นข้อมูลจุด ที่เกี่ยวข้องกับข้อมูลพื้นที่",
    "selectRelatedPointLayerHintText": "คำแนะนำ : เลือกข้อมูลจุด ที่เกี่ยวข้องกับข้อมูลพื้นที่",
    "polygonLayerNotHavingRelatedLayer": "กรุณาเลือกชั้นข้อมูลพื้นที่ ที่เกี่ยวข้องกับข้อมูลจุด",
    "errorInSelectingPolygonLayer": "กรุณาเลือกชั้นข้อมูลพื้นที่ ที่เกี่ยวข้องกับข้อมูลจุด",
    "errorInSelectingRelatedLayer": "เลือกข้อมูลจุด ที่เกี่ยวข้องกับข้อมูลพื้นที่"
  },
  "routeSetting": {
    "routeSettingTabTitle": "การตั้งค่าทิศทาง",
    "routeServiceUrl": "บริการการกำหนดเส้นทาง",
    "buttonSet": "ตั้ง",
    "routeServiceUrlHintText": "คำแนะนำ : คลิก “เซต” เพื่อเบราวซ์และเลือกโครงข่ายในการวิเคราะห์บริการการกำหนดเส้นทาง",
    "directionLengthUnit": "หน่วยความยาวของทิศทาง",
    "unitsForRouteHintText": "คำแนะนำ : ใช้เพื่อแสดงผล หน่วยรายงานของเส้นทาง",
    "selectRouteSymbol": "เลือกสัญลักษณ์เพื่อแสดงเส้นทาง",
    "routeSymbolHintText": "คำแนะนำ : ใช้เพื่อแสดงผลสัญลักษณ์ข้อมูลเส้นสำหรับเส้นทาง",
    "routingDisabledMsg": "เพื่อเปิดการแสดงเส้นทาง ให้แน่ใจว่า ได้ตั้งค่า เส้นทาง ให้กับ ArcGIS Online เรียบร้อยแล้ว"
  },
  "networkServiceChooser": {
    "arcgislabel": "เพิ่มจาก ArcGIS Online",
    "serviceURLabel": "เพิ่ม Service URL",
    "routeURL": "เส้นทาง URL",
    "validateRouteURL": "การตรวจสอบ",
    "exampleText": "ตัวอย่าง",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "ระบุค่าที่ถูกต้องสำหรับการบริการเส้นทาง",
    "rateLimitExceeded": "เกินขีดจำกัดทีทำได้ กรุณาลองใหม่อีกครั้ง",
    "errorInvokingService": "ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง"
  },
  "symbolPickerPreviewText": "ดูตัวอย่าง:"
});