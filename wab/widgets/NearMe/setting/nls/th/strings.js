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
        displayText: "ไมล์",
        acronym: "ไมล์"
      },
      kilometers: {
        displayText: "กิโลเมตร",
        acronym: "กม."
      },
      feet: {
        displayText: "ฟุต",
        acronym: "ft"
      },
      meters: {
        displayText: "เมตร",
        acronym: "ม."
      }
    },
    searchSetting: {
      searchSettingTabTitle: "ค้นหาการตั้งค่า", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "ตั้งค่าเริ่มต้นของระยะบัฟเฟอร์", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "ตั้งค่ามากสุดของระยะบัฟเฟอร์สำหรับค้นหาข้อมูล", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "หน่วยของระยะบัฟเฟอร์", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "คำแนะนำ : ใช้การตั้งค่าเริ่มต้นสำหรับบัฟเฟอร์", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "คำแนะนำ : ใช้ค่าสูงสุดสำหรับบัฟเฟอร์", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "คำแนะนำ : ระบุหน่วยในการสร้างบัฟเฟอร์", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "สัญลักษณ์ของที่อยู่หรือตำแหน่ง", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "คำแนะนำ : สัญลักษณ์เพื่อการค้นหาที่อยู่หรือคลิกที่ตำแหน่ง", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "เลือกสีข้อความสำหรับผลลัพท์การค้นหา", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "คำแนะนำ : สีข้อความของผลลัพท์การค้นหา" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "เลือก การค้นหาชั้นข้อมูล", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "คำแนะนำ : ใช้ชุดปุ่มการทำงานเพื่อเลือกชั้นข้อมูล", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "ตั้ง", //Shown as a button text to add the layer for search
      okButton: "ตกลง", // shown as a button text for layer selector popup
      cancelButton: "ยกเลิก" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "การตั้งค่าทิศทาง", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "การบริการเส้นทาง", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "การบริการโหมดการเดินทาง", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "ตั้ง", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "คำแนะนำ : คลิก “เซต” เพื่อเบราวซ์และเลือกการบริการเส้นทาง", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "หน่วยความยาวของทิศทาง", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "คำแนะนำ : ใช้เพื่อแสดงผลหน่วยของเส้นทาง", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "เลือกสัญลักษณ์เพื่อแสดงผลเส้นทาง", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "คำแนะนำ : ใช้เพื่อแสดงสัญลักษณ์เส้นให้กับข้อมูลเส้นทาง", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "คำแนะนำ : คลิก “เซต” เพื่อเบราวซ์และเลือกการบริการโหมดการเดินทาง", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "ระบุค่าที่ถูกต้องให้กับบริการโหมดการเดินทาง ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "เพื่อเปิดการแสดงทิศทาง ให้เปิดการแสดงบน ArcGIS Online" // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "เพิ่มจาก ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "เพิ่ม Service URL", // shown as a label in route service configuration panel to add service url
      routeURL: "เส้นทาง URL", // shown as a label in route service configuration panel
      validateRouteURL: "การตรวจสอบ", // shown as a button text in route service configuration panel to validate url
      exampleText: "ตัวอย่าง", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "ตกลง", // shown as a button text for route service configuration panel
      cancelButton: "ยกเลิก", // shown as a button text for route service configuration panel
      nextButton: "ถัดไป", // shown as a button text for route service configuration panel
      backButton: "กลับ", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "ระบุค่าที่ถูกต้องให้กับบริการเส้นทาง" // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "ระบุค่าตัวเลขที่ถูกต้อง", // shown as an error label in text box for buffer
      selectLayerErrorString: "เลือกชั้นข้อมูลเพื่อค้นหา", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "ค่าเริ่มต้นระยะการบัฟเฟอร์ไม่สามารถเว้นว่างได้ กรุณาระบุค่าระยะบัฟเฟอร์", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "ค่าสูงสุดของระยะบัฟเฟอร์ไม่สามารถเว้นว่างได้ กรุณาระบุค่าระยะบัฟเฟอร์", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "กรุณาระบุค่าเริ่มต้นบัฟเฟอร์ในระยะที่กำหนดไว้", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "กรุณาระบุค่าเริ่มต้นของบัฟเฟอร์ด้วยระยะที่มากกว่า 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "กรุณาระบุค่าบัฟเฟอร์สูงสุดด้วยระยะที่มากกว่า 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "ดูตัวอย่าง:"
  })
);