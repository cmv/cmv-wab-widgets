///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
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
    "standardUnit": "หน่วยมาตรฐาน",
    "metricUnit": "หน่วยเมตริก"
  },
  "analysisTab": {
    "analysisTabLabel": "การวิเคราะห์",
    "selectAnalysisLayerLabel": "เลือกชั้นข้อมูลเพื่อวิเคราะห์",
    "addLayerLabel": "เพิ่มชั้นข้อมูล",
    "noValidLayersForAnalysis": "ไม่พบชั้นข้อมูลที่ถูกต้องในแผนผังเว็บที่เลือก",
    "noValidFieldsForAnalysis": "ไม่พบฟิลด์ที่ถูกต้องในเว็บแผนที่ที่เลือก โปรดลบชั้นข้อมูลที่เลือก",
    "addLayersHintText": "คำแนะนำ: เลือกชั้นข้อมูล และฟิลด์เพื่อวิเคราะห์ และแสดงในรายงาน",
    "addLayerNameTitle": "ชื่อชั้นข้อมูล",
    "addFieldsLabel": "เพิ่มฟิลด์",
    "addFieldsPopupTitle": "เลือกฟิลด์",
    "addFieldsNameTitle": "ชื่อฟิลด์",
    "aoiToolsLegendLabel": "เครื่องมือ AOI",
    "aoiToolsDescriptionLabel": "เปิดใช้เครื่องมือเพื่อสร้างพื้นที่ที่สนใจ และระบุป้ายกำกับ",
    "placenameLabel": "ชื่อสถานที่",
    "drawToolsLabel": "เครื่องมือวาด",
    "uploadShapeFileLabel": "อัปโหลด Shapefile",
    "coordinatesLabel": "พิกัด",
    "coordinatesDrpDwnHintText": "คำแนะนำ: เลือกหน่วย เพื่อแสดงการระบุแนวเส้น",
    "coordinatesBearingDrpDwnHintText": "คำแนะนำ: เลือกแบริ่ง เพื่อแสดงการระบุแนวเส้น",
    "allowShapefilesUploadLabel": "อนุญาตให้อัปโหลด Shapefile เพื่อวิเคราะห์",
    "areaUnitsLabel": "แสดง พื้นที่ / ความยาว",
    "allowShapefilesUploadLabelHintText": "คำแนะนำ: แสดง 'อัปโหลด shapefile ในการวิเคราะห์' ในแท็บรายงาน",
    "maxFeatureForAnalysisLabel": "จำนวนฟีเจอร์สูงสุดสำหรับการวิเคราะห์",
    "maxFeatureForAnalysisHintText": "คำแนะนำ: กำหนดจำนวนฟีเจอร์สูงสุดสำหรับการวิเคราะห์",
    "searchToleranceLabelText": "ระยะในการค้นหา (ฟุต)",
    "searchToleranceHint": "คำแนะนำ: ระยะในการค้นหา จะใช้เฉพาะเมื่อทำการวิเคราะห์อินพุทแบบ จุด และเส้น",
    "placenameButtonText": "ชื่อสถานที่",
    "drawToolsButtonText": "วาด",
    "shapefileButtonText": "Shapefile",
    "coordinatesButtonText": "ค่าพิกัด"
  },
  "downloadTab": {
    "downloadLegend": "ดาวน์โหลดการตั้งค่า",
    "reportLegend": "การตั้งค่ารายงาน",
    "downloadTabLabel": "ดาวน์โหลด",
    "syncEnableOptionLabel": "ชั้นข้อมูลฟีเจอร์",
    "syncEnableOptionHint": "คำแนะนำ: ใช้เพื่อดาวน์โหลดข้อมูลฟีเจอร์ สำหรับฟีเจอร์ที่ตัดกับพื้นที่ที่สนใจในรูปแบบที่ระบุ",
    "syncEnableOptionNote": "หมายเหตุ: ต้องเปิดให้มีการซิงค์ ในฟีเจอร์เซอร์วิส สำหรับข้อมูล File Geodatabase",
    "extractDataTaskOptionLabel": "เซอร์วิสสำหรับประมวลผลทางภูมิศาสตร์สำหรับการแอคเทรคตัดข้อมูล",
    "extractDataTaskOptionHint": "คำแนะนำ: การเผยแพร่เซอร์วิสสำหรับประมวลผลทางภูมิศาสตร์สำหรับการแอคเทรคตัดข้อมูล เพื่อดาวน์โหลดฟีเจอร์ที่ทับตัดกันกับพื้นที่ที่สนใจ ในรูปแบบ File Geodatabase หรือ Shapefile",
    "cannotDownloadOptionLabel": "ปิดการดาวน์โหลด",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "ชื่อชั้นข้อมูล",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "ไฟล์ฐานข้อมูลภูมิศาสตร์",
      "allowDownloadLabel": "อนุญาตให้ดาวน์โหลด"
    },
    "setButtonLabel": "ตั้ง",
    "GPTaskLabel": "ระบุ URL เพื่อเซอร์วิสสำหรับประมวลผลทางภูมิศาสตร์",
    "printGPServiceLabel": "พิมพ์เซอร์วิส URL",
    "setGPTaskTitle": "ระบุ URL ของเซอร์วิสสำหรับประมวลผลทางภูมิศาสตร์ที่ต้องการ",
    "logoLabel": "โลโก้",
    "logoChooserHint": "คำแนะนำ: คลิกที่รูปไอคอนเพื่อเปลี่ยนภาพ",
    "footnoteLabel": "เชิงอรรถ",
    "columnTitleColorPickerLabel": "สีสำหรับชื่อคอลัมน์",
    "reportTitleLabel": "ชื่อรายงาน",
    "errorMessages": {
      "invalidGPTaskURL": "เซอร์วิสสำหรับประมวลผลข้อมูลทางภูมิศาสตร์ไม่ถูกต้อง โปรดเลือกเซอร์วิสสำหรับประมวลผลข้อมูลที่มี แอคเทรคดาต้าทาซ",
      "noExtractDataTaskURL": "โปรดเลือกเซอร์วิสประมวลผลข้อมูลใด ๆ ที่มีแอคเทรคดาต้าทาซ"
    }
  },
  "generalTab": {
    "generalTabLabel": "ทั่วไป",
    "tabLabelsLegend": "ป้ายกำกับแผงควบคุม",
    "tabLabelsHint": "คำแนะนำ: ระบุป้ายกำกับ",
    "AOITabLabel": "พื้นที่สนใจของแผงควบคุม",
    "ReportTabLabel": "แผงรายงาน",
    "bufferSettingsLegend": "การตั้งค่าบัฟเฟอร์",
    "defaultBufferDistanceLabel": "ระยะทางบัฟเฟอร์เริ่มต้น",
    "defaultBufferUnitsLabel": "หน่วยของการบัฟเฟอร์",
    "generalBufferSymbologyHint": "คำแนะนำ: กำหนดสัญลักษณ์ เพื่อใช้สำหรับแสดงบัฟเฟอร์รอบพื้นที่ที่กำหนด",
    "aoiGraphicsSymbologyLegend": "สัญลักษณ์กราฟิกของพื้นที่ที่สนใจ",
    "aoiGraphicsSymbologyHint": "คำแนะนำ: ตั้งสัญลักษณ์ที่จะใช้ในขณะที่กำหนดจุด เส้น และพื้นที่ที่สนใจ",
    "pointSymbologyLabel": "จุด",
    "previewLabel": "ภาพตัวอย่าง",
    "lineSymbologyLabel": "เส้น",
    "polygonSymbologyLabel": "พื้นที่",
    "aoiBufferSymbologyLabel": "สัญลักษณ์บัฟเฟอร์",
    "pointSymbolChooserPopupTitle": "สัญลักษณ์ของที่อยู่หรือตำแหน่ง",
    "polygonSymbolChooserPopupTitle": "เลือกสัญลักษณ์เพื่อไฮไลท์พื้นที่",
    "lineSymbolChooserPopupTitle": "เลือกสัญลักษณ์ เพื่อเน้นเส้น",
    "aoiSymbolChooserPopupTitle": "กำหนดสัญลักษณ์ของบัฟเฟอร์",
    "aoiTabText": "AOI",
    "reportTabText": "รายงาน"
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "ตั้งค่าการค้นหาแหล่งที่มา",
    "searchSourceSettingTitle": "ตั้งค่าการค้นหาแหล่งที่มา",
    "searchSourceSettingTitleHintText": "เพิ่ม และกำหนดค่าบริการค้นหาตำแหน่งจีโอโค้ดเซอร์วิส หรือชั้นข้อมูลเป็นข้อมูลในการค้นหา ข้อมูลที่ระบุนี้จะใช้ในการค้นหาภายในช่องค้นหา",
    "addSearchSourceLabel": "เพิ่มช่องค้นหาแหล่งที่มา",
    "featureLayerLabel": "ชั้นข้อมูลฟีเจอร์",
    "geocoderLabel": "Geocoder",
    "generalSettingLabel": "การตั้งค่าทั่วไป",
    "allPlaceholderLabel": "ใส่ข้อความสำหรับการค้นหาทั้งหมด",
    "allPlaceholderHintText": "คำแนะนำ: ป้อนข้อความที่จะแสดงคำเริ่มต้น ในขณะที่ทำการค้นหาชั้นข้อมูลทั้งหมด และจีโอโค้ด",
    "generalSettingCheckboxLabel": "แสดงป๊อปอัพสำหรับคุณลักษณะ หรือสถานที่",
    "countryCode": "ประเทศหรือรหัสภูมิภาค(s)",
    "countryCodeEg": "ตัวอย่าง ",
    "countryCodeHint": "ปล่อยให้เป็นค่าว่างจะค้นหาทุกประเทศและภูมิภาค",
    "questionMark": "?",
    "searchInCurrentMapExtent": "ค้นหาเฉพาะในขอบเขตแผนที่ปัจจุบัน",
    "zoomScale": "ขยายมาตราส่วน",
    "locatorUrl": "URL เครื่องระบุตำแหน่ง",
    "locatorName": "ชื่อเครื่องมือระบุตำแหน่ง",
    "locatorExample": "ตัวอย่าง",
    "locatorWarning": "รุ่นของบริการรหัสเชิงพื้นที่นี้ไม่ได้รับการสนับสนุน เครื่องมือสนับสนุนบริการรหัสเชิงพื้นที่ 10.0 และสูงกว่า",
    "locatorTips": "ข้อเสนอแนะจะไม่สามารถใช้ได้เนื่องจากบริการเชิงพื้นที่ ไม่สนับสนุนความสามารถในการแนะนำ",
    "layerSource": "ชั้นข้อมูลแหล่งที่มา",
    "setLayerSource": "ตั้งชั้นข้อมูลแหล่งที่มา",
    "setGeocoderURL": "ตั้งรหัสเชิงพื้นที่ URL",
    "searchLayerTips": "ข้อเสนอแนะจะไม่สามารถใช้ได้เนื่องจากบริการคุณลักษณะไม่สนับสนุนความสามารถในการแบ่งหน้า",
    "placeholder": "ตัวอักษรที่จองที่ไว้สำหรับคำที่ใช้งานจริง",
    "searchFields": "ค้นหาฟิลด์",
    "displayField": "ฟิลด์ที่แสดง",
    "exactMatch": "สอดคล้องอย่างยิ่ง",
    "maxSuggestions": "คำแนะนำมากสุด",
    "maxResults": "ผลลัพธ์สูงสุด",
    "enableLocalSearch": "เปิดใช้งานการค้นหาในโปรแกรม",
    "minScale": "มาตราส่วน",
    "minScaleHint": "เมื่อมาตราส่วนของแผนที่มากกว่ามาตราส่วนนี้ จะสามารถใช้งานการค้นหาในโปรแกรมได้",
    "radius": "รัศมี",
    "radiusHint": "ระบุรัศมีของบริเวณโดยรอบศูนย์กลางของแผนที่ปัจจุบัน เพื่อใช้ในการเพิ่มอันดับของผลลัพธ์จากตัวเลือกในการระบุพิกัดทางภูมิศาสตร์ โดยตัวเลือกที่อยู่ใกล้ที่สุดจะถูกส่งกลับมาก่อน",
    "setSearchFields": "ตั้งการค้นหาฟิลด์",
    "set": "ตั้ง",
    "invalidUrlTip": "URL ${URL} ไม่ถูกต้อง หรือไม่สามารถเข้าถึงได้",
    "invalidSearchSources": "การตั้งค่าแหล่งข้อมูลสำหรับค้นหาไม่ถูกต้อง"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "โปรดกรอกข้อมูลในช่องที่จำเป็น",
    "bufferDistanceFieldsErrorMsg": "โปรดป้อนค่าที่ถูกต้อง",
    "invalidSearchToleranceErrorMsg": "โปรดป้อนค่าที่ถูกต้องสำหรับความทนทานในการค้นหา",
    "atLeastOneCheckboxCheckedErrorMsg": "ข้อผิดพลาดร้ายแรง: การตั้งค่าที่ไม่ถูกต้อง",
    "noLayerAvailableErrorMsg": "ไม่มีชั้นข้อมูลที่ทำงานได้0",
    "layerNotSupportedErrorMsg": "ไม่สนับสนุน ",
    "noFieldSelected": "โปรดใช้การแก้ไขเพื่อเลือกเขตข้อมูลสำหรับการวิเคราะห์",
    "duplicateFieldsLabels": "เพิ่มป้ายกำกับ \"$ {labelText}\" ที่เพิ่มไว้สำหรับ: \"$ {itemNames}\"",
    "noLayerSelected": "โปรดเลือกอย่างน้อยหนึ่งชั้นสำหรับการวิเคราะห์",
    "errorInSelectingLayer": "ไม่สามารถดำเนินการเลือกเลเยอร์ได้ กรุณาลองอีกครั้ง.",
    "errorInMaxFeatureCount": "โปรดใส่จำนวนคุณสมบัติสูงสุดที่ถูกต้องสำหรับการวิเคราะห์"
  }
});