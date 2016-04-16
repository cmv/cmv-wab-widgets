/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Αναζήτηση διεύθυνσης ή εντοπισμός σε χάρτη", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Τα θεματικά επίπεδα αναζήτησης δεν έχουν διαμορφωθεί σωστά", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Εμφάνιση αποτελεσμάτων εντός ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Καθορίστε απόσταση με τιμή μεγαλύτερη του 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Δεν ήταν δυνατή η εύρεση των αποτελεσμάτων", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Κάντε κλικ για προσθήκη σημείου", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Δεν βρέθηκαν αποτελέσματα ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Συνημμένα", //Shown as label on attachments header
    unableToFetchResults: "Δεν είναι δυνατή η λήψη αποτελεσμάτων από το(α) θεματικό(ά) επίπεδο(α):", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Πληροφορίες", //Shown as title for information tab
    directionTabTitle: "Κατεύθυνση", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Απέτυχε η δημιουργία διαδρομής.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Το Geometry service δεν είναι διαθέσιμο.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Τα αναδυόμενα πλαίσια δεν έχουν διαμορφωθεί και δεν είναι δυνατή η εμφάνιση των αποτελεσμάτων." //Shown as a message when popups for all the layers are disabled
  })
);