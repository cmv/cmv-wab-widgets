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
define({
  "units": {
    "miles": {
      "displayText": "Μίλια",
      "acronym": "μίλ."
    },
    "kilometers": {
      "displayText": "Χιλιόμετρα",
      "acronym": "χλμ."
    },
    "feet": {
      "displayText": "Πόδια",
      "acronym": "πόδ."
    },
    "meters": {
      "displayText": "Μέτρα",
      "acronym": "μ."
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Ρυθμίσεις αναζήτησης",
    "defaultBufferDistanceLabel": "Ορίστε την προκαθορισμένη απόσταση ζώνης",
    "maxBufferDistanceLabel": "Ορίστε τη μέγιστη απόσταση ζώνης",
    "bufferDistanceUnitLabel": "Μονάδες ακτίνας ζώνης",
    "defaultBufferHintLabel": "Υπόδειξη: Ορίστε την προκαθορισμένη τιμή για την μπάρα ρύθμισης ζώνης",
    "maxBufferHintLabel": "Υπόδειξη: Ορίστε τη μέγιστη τιμή για την μπάρα ρύθμισης ζώνης",
    "bufferUnitLabel": "Υπόδειξη: Καθορίστε μονάδα για τη δημιουργία ζώνης",
    "selectGraphicLocationSymbol": "Σύμβολο διεύθυνσης ή τοποθεσίας",
    "graphicLocationSymbolHintText": "Υπόδειξη: Σύμβολο διεύθυνσης που αναζητήθηκε ή τοποθεσίας που επιλέχθηκε",
    "fontColorLabel": "Επιλογή χρώματος γραμματοσειράς για αποτελέσματα αναζήτησης",
    "fontColorHintText": "Υπόδειξη: Χρώμα γραμματοσειράς των αποτελεσμάτων αναζήτησης",
    "zoomToSelectedFeature": "Εστίαση στο επιλεγμένο στοιχείο",
    "zoomToSelectedFeatureHintText": "Υπόδειξη: Εστιάστε στο επιλεγμένο στοιχείο αντί της ζώνης",
    "intersectSearchLocation": "Επιστροφή τεμνόμενων πολυγώνων",
    "intersectSearchLocationHintText": "Υπόδειξη: Επιστρέφει τα πολύγωνα που περιέχουν την τοποθεσία που αναζητήθηκε αντί για τα πολύγωνα εντός της ζώνης",
    "bufferVisibilityLabel": "Ορισμός ορατότητας ζώνης",
    "bufferVisibilityHintText": "Υπόδειξη: Η ζώνη θα εμφανίζεται στο χάρτη",
    "bufferColorLabel": "Ορισμός συμβόλου ζώνης",
    "bufferColorHintText": "Υπόδειξη: Επιλέξτε χρώμα και διαφάνεια για τη ζώνη",
    "searchLayerResultLabel": "Σχεδίαση μόνο των αποτελεσμάτων του επιλεγμένου θεματικού πεδίου",
    "searchLayerResultHint": "Υπόδειξη: Θα σχεδιαστεί στο χάρτη μόνο το επιλεγμένο επίπεδο στα αποτελέσματα αναζήτησης"
  },
  "layerSelector": {
    "selectLayerLabel": "Επιλογή θεματικού(ών) επιπέδου(ων) αναζήτησης",
    "layerSelectionHint": "Υπόδειξη: Χρησιμοποιήστε το κουμπί \"Ορισμός\" για να επιλέξετε θεματικό(ά) επίπεδο(α)",
    "addLayerButton": "Ορισμός"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Ρυθμίσεις κατεύθυνσης",
    "routeServiceUrl": "Υπηρεσία δρομολόγησης",
    "buttonSet": "Ορισμός",
    "routeServiceUrlHintText": "Υπόδειξη: Πατήστε \"Ορισμός\" για αναζήτηση και επιλογή μιας υπηρεσίας δρομολόγησης",
    "directionLengthUnit": "Μονάδες μήκους κατεύθυνσης",
    "unitsForRouteHintText": "Υπόδειξη: Χρησιμοποιείται για την εμφάνιση μονάδων για το δρομολόγιο",
    "selectRouteSymbol": "Επιλογή συμβόλου για εμφάνιση δρομολογίου",
    "routeSymbolHintText": "Υπόδειξη: Χρησιμοποιείται για την εμφάνιση του συμβόλου γραμμής της διαδρομής",
    "routingDisabledMsg": "Για να ενεργοποιήσετε τις κατευθύνσεις, βεβαιωθείτε ότι η δρομολόγηση είναι ενεργοποιημένη στο ArcGIS Online αντικείμενο."
  },
  "networkServiceChooser": {
    "arcgislabel": "Προσθήκη από το ArcGIS Online",
    "serviceURLabel": "Προσθήκη URL υπηρεσίας",
    "routeURL": "URL δρομολόγησης",
    "validateRouteURL": "Επικύρωση",
    "exampleText": "Παράδειγμα",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Καθορίστε ένα έγκυρο Route service.",
    "rateLimitExceeded": "Έγινε υπέρβαση του ορίου ρυθμού μετάδοσης. Προσπαθήστε ξανά αργότερα.",
    "errorInvokingService": "Εσφαλμένο όνομα χρήστη ή κωδικός πρόσβασης."
  },
  "errorStrings": {
    "bufferErrorString": "Εισαγάγετε μια έγκυρη αριθμητική τιμή.",
    "selectLayerErrorString": "Επιλέξτε θεματικό(ά) επίπεδο(α) προς αναζήτηση.",
    "invalidDefaultValue": "Η προεπιλεγμένη ακτίνα ζώνης δεν μπορεί να είναι κενή. Καθορίστε την ακτίνα ζώνης",
    "invalidMaximumValue": "Η μέγιστη προεπιλεγμένη ακτίνα ζώνης δεν μπορεί να είναι κενή. Καθορίστε την ακτίνα ζώνης",
    "defaultValueLessThanMax": "Καθορίστε την προεπιλεγμένη ακτίνα ζώνης εντός του ανώτατου ορίου",
    "defaultBufferValueGreaterThanZero": "Καθορίστε την προεπιλεγμένη ακτίνα ζώνης με τιμή μεγαλύτερη του 0",
    "maximumBufferValueGreaterThanZero": "Καθορίστε τη μέγιστη ακτίνα ζώνης με τιμή μεγαλύτερη του 0"
  },
  "symbolPickerPreviewText": "Προεπισκόπηση:"
});