/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "ابحث عن عنوان أو حدد موقعه على الخريطة", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "انقر لإضافة نقطة", // Tooltip for location address button
    informationTabTitle: "معلومات", // Shown as label on information tab
    directionTabTitle: "الاتجاهات", // Shown as label on direction tab
    invalidPolygonLayerMsg: "لم يتم تكوين طبقة المضلع بشكل صحيح", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "لم يتم تكوين الطبقة النقطية ذات الصلة بشكل صحيح", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "لم يتم العثور على أي مضلعات لهذا العنوان أو الموقع", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "يتعذر العثور على النقطة المرتبطة بالمضلع", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "المرفقات", //Shown as label on attachments header
    failedToGenerateRouteMsg: "فشل إنشاء المسار.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "لم يتم تكوين العناصر المنبثقة، ويتعذر عرض النتائج." //Shown as a message when popups for all the layers are disabled

  })
);