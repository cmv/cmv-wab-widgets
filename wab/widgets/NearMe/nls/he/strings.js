/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "חפש כתובת או אתר כתובת על גבי המפה", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "שכבות החיפוש לא נקבעו בצורה תקינה", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "הצג תוצאות בתחום של ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "ציין מרחק גדול מ-0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "לא ניתן למצוא תוצאות", //display error message if buffer gets failed to generate
    selectLocationToolTip: "לחץ להוספת נקודה", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "לא נמצאו תוצאות ", //Shown as message if no features available in current buffer area
    attachmentHeader: "קבצים מקושרים", //Shown as label on attachments header
    unableToFetchResults: "לא ניתן להשיג תוצאות משכבות:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "מידע", //Shown as title for information tab
    directionTabTitle: "כיוון", //Shown as title for direction tab
    failedToGenerateRouteMsg: "יצירת המסלול נכשלה.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "שירות הגיאומטריה לא זמין.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "חלונות קופצים לא מוגדרים, לא ניתן להציג תוצאות." //Shown as a message when popups for all the layers are disabled
  })
);