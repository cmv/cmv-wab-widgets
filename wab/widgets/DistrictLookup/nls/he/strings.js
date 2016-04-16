/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "חפש כתובת או אתר כתובת על גבי המפה", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "לחץ להוספת נקודה", // Tooltip for location address button
    informationTabTitle: "מידע", // Shown as label on information tab
    directionTabTitle: "הוראות נסיעה", // Shown as label on direction tab
    invalidPolygonLayerMsg: "שכבת הפוליגונים לא נקבעה בצורה תקינה", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "שכבת הנקודות המקושרת לא נקבעה בצורה תקינה", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "לא נמצא פוליגון עבור כתובת או מיקום אלה", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "לא ניתן למצוא את הנקודה המשויכת לפוליגון", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "קבצים מקושרים", //Shown as label on attachments header
    failedToGenerateRouteMsg: "יצירת המסלול נכשלה.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "חלונות קופצים לא מוגדרים, לא ניתן להציג תוצאות." //Shown as a message when popups for all the layers are disabled

  })
);