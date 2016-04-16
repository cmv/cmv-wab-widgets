/*global define*/
define(
   ({
    _widgetLabel: "ค้นหาเขต", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "ค้นหาที่อยู่ หรือกำหนดตำแหน่งบนแผนที่", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "คลิกเพื่อเพิ่มจุด", // Tooltip for location address button
    informationTabTitle: "ข้อมูล", // Shown as label on information tab
    directionTabTitle: "ทิศทาง", // Shown as label on direction tab
    invalidPolygonLayerMsg: "พื้นที่ไม่ได้ถูกกำหนดค่าอย่างถูกต้อง", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "ข้อมูลจุดไม่ได้ถูกกำหนดค่าอย่างถูกต้อง", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "ไม่พบพื้นที่ สำหรับที่อยู่หรือตำแหน่งนี้", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "ไม่สามารถพบข้อมูลจุด ที่มีส่วนเกี่ยวข้อกับข้อมูลพื้นที่", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "แนบ", //Shown as label on attachments header
    failedToGenerateRouteMsg: "การสร้างถนนล้มเหลว", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "ป็อปอัพไม่ได้ถูกตั้งค่า จึงไม่อาจแสดงผลลัพท์ได้" //Shown as a message when popups for all the layers are disabled

  })
);