/*global define*/
define(
   ({
    _widgetLabel: "ใกล้", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "ค้นหาที่อยู่หรือตำแหน่งบนแผนที่", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "ค้นหาชั้นข้อมูลที่ไม่ได้กำหนดอย่างถูกต้อง", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "แสดงผลลัพท์ใน ${ระยะบัพเฟอร์} ${หน่วยบัฟเฟอร์}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "ระบุระยะทางที่มากกว่า 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "ไม่สามารถพบผลลัพท์ได้", //display error message if buffer gets failed to generate
    selectLocationToolTip: "คลิกเพื่อเพิ่มจุด", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "ไม่พบผลลัพธ์ ", //Shown as message if no features available in current buffer area
    attachmentHeader: "แนบ", //Shown as label on attachments header
    unableToFetchResults: "ไม่สามารถเรียกผลลัพท์จากชั้นข้อมูลได้", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "ข้อมูล", //Shown as title for information tab
    directionTabTitle: "ทิศทาง", //Shown as title for direction tab
    failedToGenerateRouteMsg: "การสร้างเส้นทางล้มเหลส", //Shown as a message when fail to generate route
    geometryServicesNotFound: "บริการด้าน Geometry ไม่สามารถใช้งานได้", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "ป๊อปอัพไม่ได้ถูกตั้งค่า จึงไม่อาจแสดงผลลัพท์ได้" //Shown as a message when popups for all the layers are disabled
  })
);