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
      "displayText": "ไมล์",
      "acronym": "ไมล์"
    },
    "kilometers": {
      "displayText": "กิโลเมตร",
      "acronym": "กม."
    },
    "feet": {
      "displayText": "ฟุต",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "เมตร",
      "acronym": "ม."
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "ค้นหาการตั้งค่า",
    "defaultBufferDistanceLabel": "ตั้งระยะทางบัฟเฟอร์เริ่มต้น",
    "maxBufferDistanceLabel": "ตั้งระยะทางบัฟเฟอร์สูงสุด",
    "bufferDistanceUnitLabel": "หน่วยของระยะบัฟเฟอร์",
    "defaultBufferHintLabel": "คำแนะนำ: การตั้งค่าเริ่มต้น สำหรับแถบเลื่อนกำนหนดระยะบัฟเฟอร์",
    "maxBufferHintLabel": "คำแนะนำ: ตั้งค่าสูงสุด สำหรับแถบเลื่อนกำนหนดระยะบัฟเฟอร์",
    "bufferUnitLabel": "คำแนะนำ : ระบุหน่วยในการสร้างบัฟเฟอร์",
    "selectGraphicLocationSymbol": "สัญลักษณ์ของที่อยู่หรือตำแหน่ง",
    "graphicLocationSymbolHintText": "คำแนะนำ : สัญลักษณ์เพื่อการค้นหาที่อยู่หรือคลิกที่ตำแหน่ง",
    "fontColorLabel": "เลือกสีข้อความสำหรับผลลัพท์การค้นหา",
    "fontColorHintText": "คำแนะนำ : สีข้อความของผลลัพท์การค้นหา",
    "zoomToSelectedFeature": "ซูมไปที่เลือก",
    "zoomToSelectedFeatureHintText": "คำแนะนำ: ซูมไปยังสถานที่ที่เลือกแทนของบัฟเฟอร์",
    "intersectSearchLocation": "ให้ผลลัพธ์จากพื้นที่ที่ตัดกัน",
    "intersectSearchLocationHintText": "คำแนะนำ: ให้ผลลัพธ์เป็นพื้นที่ที่อยู่ในตำแหน่งที่เลือกแทนที่พื้นที่ในระยะบัฟเฟอร์",
    "bufferVisibilityLabel": "ตั้งค่าให้แสดงบัฟเฟอร์",
    "bufferVisibilityHintText": "คำแนะนำ: พื้นที่บัฟเฟอร์จะแสดงบนแผนที่",
    "bufferColorLabel": "กำหนดสัญลักษณ์ของบัฟเฟอร์",
    "bufferColorHintText": "คำแนะนำ: เลือกสีและความโปร่งใสของบัฟเฟอร์",
    "searchLayerResultLabel": "วาดเพียงผลการเลือกชั้นข้อมูล",
    "searchLayerResultHint": "คำแนะนำ: วาดเฉพาะชั้นข้อมูลที่เลือกได้บนแผนที่"
  },
  "layerSelector": {
    "selectLayerLabel": "เลือก การค้นหาชั้นข้อมูล",
    "layerSelectionHint": "คำแนะนำ : ใช้ชุดปุ่มการทำงานเพื่อเลือกชั้นข้อมูล",
    "addLayerButton": "ตั้ง"
  },
  "routeSetting": {
    "routeSettingTabTitle": "การตั้งค่าทิศทาง",
    "routeServiceUrl": "การบริการเส้นทาง",
    "buttonSet": "ตั้ง",
    "routeServiceUrlHintText": "คำแนะนำ: คลิก â€~Setâ€™ เพื่อเรียกดูและเลือกเซอร์วิสเส้นทาง",
    "directionLengthUnit": "หน่วยความยาวของทิศทาง",
    "unitsForRouteHintText": "คำแนะนำ : ใช้เพื่อแสดงผลหน่วยของเส้นทาง",
    "selectRouteSymbol": "เลือกสัญลักษณ์เพื่อแสดงผลเส้นทาง",
    "routeSymbolHintText": "คำแนะนำ : ใช้เพื่อแสดงสัญลักษณ์เส้นให้กับข้อมูลเส้นทาง",
    "routingDisabledMsg": "เพื่อเปิดการแสดงทิศทาง ให้เปิดการแสดงบน ArcGIS Online"
  },
  "networkServiceChooser": {
    "arcgislabel": "เพิ่มจาก ArcGIS Online",
    "serviceURLabel": "เพิ่ม Service URL",
    "routeURL": "เส้นทาง URL",
    "validateRouteURL": "การตรวจสอบ",
    "exampleText": "ตัวอย่าง",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "ระบุค่าที่ถูกต้องให้กับบริการเส้นทาง",
    "rateLimitExceeded": "เกินขีดจำกัดทีทำได้ กรุณาลองใหม่อีกครั้ง",
    "errorInvokingService": "ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง"
  },
  "errorStrings": {
    "bufferErrorString": "ระบุค่าตัวเลขที่ถูกต้อง",
    "selectLayerErrorString": "เลือกชั้นข้อมูลเพื่อค้นหา",
    "invalidDefaultValue": "ค่าเริ่มต้นระยะการบัฟเฟอร์ไม่สามารถเว้นว่างได้ กรุณาระบุค่าระยะบัฟเฟอร์",
    "invalidMaximumValue": "ค่าสูงสุดของระยะบัฟเฟอร์ไม่สามารถเว้นว่างได้ กรุณาระบุค่าระยะบัฟเฟอร์",
    "defaultValueLessThanMax": "กรุณาระบุค่าเริ่มต้นบัฟเฟอร์ในระยะที่กำหนดไว้",
    "defaultBufferValueGreaterThanZero": "กรุณาระบุค่าเริ่มต้นของบัฟเฟอร์ด้วยระยะที่มากกว่า 0",
    "maximumBufferValueGreaterThanZero": "กรุณาระบุค่าบัฟเฟอร์สูงสุดด้วยระยะที่มากกว่า 0"
  },
  "symbolPickerPreviewText": "ดูตัวอย่าง:"
});