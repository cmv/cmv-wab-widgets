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
    "miles": "Μίλια",
    "kilometers": "Χιλιόμετρα",
    "feet": "Πόδια",
    "meters": "Μέτρα"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Ρυθμίσεις αναζήτησης",
    "buttonSet": "Ορισμός",
    "selectLayersLabel": "Επιλογή θεματικού επιπέδου",
    "selectLayersHintText": "Υπόδειξη: Χρησιμοποιείται για την επιλογή του πολυγωνικού θεματικού επιπέδου και του σχετικού με αυτό σημειακού θεματικού επιπέδου.",
    "selectPrecinctSymbolLabel": "Επιλογή συμβόλου για επισήμανση πολυγώνου",
    "selectGraphicLocationSymbol": "Σύμβολο διεύθυνσης ή τοποθεσίας",
    "graphicLocationSymbolHintText": "Υπόδειξη: Σύμβολο διεύθυνσης που αναζητήθηκε ή τοποθεσίας που επιλέχθηκε",
    "precinctSymbolHintText": "Υπόδειξη: Χρησιμοποιείται για την εμφάνιση του συμβόλου για το επιλεγμένο πολύγωνο",
    "selectColorForPoint": "Επιλέξτε χρώμα για να επισημάνετε ένα σημείο",
    "selectColorForPointHintText": "Υπόδειξη: Χρησιμοποιείται για την εμφάνιση του χρώματος επισήμανσης του επιλεγμένου σημείου"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Επιλογή πολυγωνικού θεματικού επιπέδου",
    "selectPolygonLayerHintText": "Υπόδειξη: Χρησιμοποιείται για την επιλογή πολυγωνικού θεματικού επιπέδου.",
    "selectRelatedPointLayerLabel": "Επιλογή σημειακού θεματικού επιπέδου σχετικού με το πολυγωνικό θεματικό επίπεδο",
    "selectRelatedPointLayerHintText": "Υπόδειξη: Χρησιμοποιείται για την επιλογή του σημειακού θεματικού επιπέδου που σχετίζεται με το πολυγωνικό θεματικό επίπεδο",
    "polygonLayerNotHavingRelatedLayer": "Επιλέξτε ένα πολυγωνικό θεματικό επίπεδο που να διαθέτει σημειακό θεματικό επίπεδο.",
    "errorInSelectingPolygonLayer": "Επιλέξτε ένα πολυγωνικό θεματικό επίπεδο που να διαθέτει σημειακό θεματικό επίπεδο.",
    "errorInSelectingRelatedLayer": "Επιλέξτε το σημειακό θεματικό επίπεδο που σχετίζεται με το πολυγωνικό θεματικό επίπεδο."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Ρυθμίσεις κατεύθυνσης",
    "routeServiceUrl": "Υπηρεσία δρομολόγησης",
    "buttonSet": "Ορισμός",
    "routeServiceUrlHintText": "Υπόδειξη: Κάντε κλικ στην επιλογή \"Ορισμός\" για αναζήτηση και επιλογή ενός network analysis routing service",
    "directionLengthUnit": "Μονάδες μήκους κατεύθυνσης",
    "unitsForRouteHintText": "Υπόδειξη: Χρησιμοποιείται για την εμφάνιση αναφερόμενων μονάδων για το δρομολόγιο",
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
  "symbolPickerPreviewText": "Προεπισκόπηση:"
});