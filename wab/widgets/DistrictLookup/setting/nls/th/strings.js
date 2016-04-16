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
      miles: "ไมล์", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "กิโลเมตร", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "ฟุต", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "เมตร" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "ค้นหาการตั้งค่า", // shown as a label in config UI dialog box for layer setting
      buttonSet: "ตั้ง", // shown as a button text to set layers
      selectLayersLabel: "เลือกชั้นข้อมูล",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "คำแนะนำ : ใช้เพื่อเลือกพื้นที่ที่มีความเกี่ยวข้องกับข้อมูลจุด", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "เลือกสัญลักษณ์เพื่อไฮไลท์พื้นที่", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "สัญลักษณ์ที่อยู่หรือตำแหน่ง", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "คำแนะนำ : สัญลักษณ์เพื่อค้นหาที่อยู่หรือคลิกตำแหน่ง", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "คำแนะนำ : ใช้เพื่อแสดงผลสัญลักษณ์ในการเลือกพื้นที่" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "ตกลง", // shown as a button text for layerSelector configuration panel
      cancelButton: "ยกเลิก", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "เลือกชั้นข้อมูลพื้นที่", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "คำแนะนำ : ใช้เพื่อเลือกชั้นข้อมูลพื้นที่", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "เลือกชั้นข้อมูลจุด ที่เกี่ยวข้องกับข้อมูลพื้นที่", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "คำแนะนำ : เลือกข้อมูลจุด ที่เกี่ยวข้องกับข้อมูลพื้นที่", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "กรุณาเลือกชั้นข้อมูลพื้นที่ ที่เกี่ยวข้องกับข้อมูลจุด", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "กรุณาเลือกชั้นข้อมูลพื้นที่ ที่เกี่ยวข้องกับข้อมูลจุด", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "เลือกข้อมูลจุด ที่เกี่ยวข้องกับข้อมูลพื้นที่" // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "การตั้งค่าทิศทาง", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "บริการการกำหนดเส้นทาง", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "บริการโหมดการเดินทาง", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "ตั้ง", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "คำแนะนำ : คลิก “เซต” เพื่อเบราวซ์และเลือกโครงข่ายในการวิเคราะห์บริการการกำหนดเส้นทาง", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "หน่วยความยาวของทิศทาง", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "คำแนะนำ : ใช้เพื่อแสดงผล หน่วยรายงานของเส้นทาง", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "เลือกสัญลักษณ์เพื่อแสดงเส้นทาง", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "คำแนะนำ : ใช้เพื่อแสดงผลสัญลักษณ์ข้อมูลเส้นสำหรับเส้นทาง", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "คำแนะนำ : คลิก “เซต” เพื่อเบราวซ์และเลือกการบริการโหมดการเดินทาง", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "ระบุค่าที่ถูกต้องของการบริการโหมดเส้นทาง", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "เพื่อเปิดการแสดงเส้นทาง ให้แน่ใจว่า ได้ตั้งค่า เส้นทาง ให้กับ ArcGIS Online เรียบร้อยแล้ว" // shown as message in routeSettings tab when routing is disabled in webmap
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
      invalidRouteServiceURL: "ระบุค่าที่ถูกต้องสำหรับการบริการเส้นทาง" // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "ดูตัวอย่าง:"
  })
);