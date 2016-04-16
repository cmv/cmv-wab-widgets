/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Αναζήτηση διεύθυνσης ή εντοπισμός σε χάρτη", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Κάντε κλικ για προσθήκη σημείου", // Tooltip for location address button
    informationTabTitle: "Πληροφορίες", // Shown as label on information tab
    directionTabTitle: "Οδηγίες", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Το πολυγωνικό θεματικό επίπεδο δεν έχει διαμορφωθεί σωστά", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Το θεματικό επίπεδο σχετικού σημείου δεν έχει διαμορφωθεί σωστά", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Δεν βρέθηκε πολύγωνο για αυτήν τη διεύθυνση ή τοποθεσία", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Δεν ήταν δυνατή η εύρεση του σημείου που σχετίζεται με το πολύγωνο", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Συνημμένα", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Απέτυχε η δημιουργία διαδρομής.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Τα αναδυόμενα πλαίσια δεν έχουν διαμορφωθεί και δεν είναι δυνατή η εμφάνιση των αποτελεσμάτων." //Shown as a message when popups for all the layers are disabled

  })
);