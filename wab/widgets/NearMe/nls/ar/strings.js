/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "ابحث عن عنوان أو حدد موقعه على الخريطة", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "لم يتم تكوين طبقات البحث بشكل صحيح", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "عرض النتائج ضمن ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "يرجى تحديد مسافة تزيد عن 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "يتعذر العثور على النتائج", //display error message if buffer gets failed to generate
    selectLocationToolTip: "انقر لإضافة نقطة", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "لم يتم العثور على أية نتائج ", //Shown as message if no features available in current buffer area
    attachmentHeader: "المرفقات", //Shown as label on attachments header
    unableToFetchResults: "يتعذر جلب النتائج من الطبقات:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "معلومات", //Shown as title for information tab
    directionTabTitle: "اتجاه", //Shown as title for direction tab
    failedToGenerateRouteMsg: "فشل إنشاء المسار.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "خدمة الشكل الهندسي غير متاحة.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "لم يتم تكوين العناصر المنبثقة، ويتعذر عرض النتائج." //Shown as a message when popups for all the layers are disabled
  })
);