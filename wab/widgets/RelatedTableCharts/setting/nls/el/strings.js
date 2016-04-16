define(
   ({

    chartSettingLabel: "Ρυθμίσεις γραφημάτων",  //shown as a label in config UI dialog box.
    addNewLabel: "Προσθήκη νέου", //shown as a button text to add layers.
    generalSettingLabel: "Γενικές ρυθμίσεις", //shown as a button text to general settings button.

    layerChooser: {
      title: "Επιλογή θεματικού επιπέδου για γράφημα", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Επιλογή θεματικού επιπέδου", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Υπόδειξη: Σε περίπτωση διαμόρφωσης πολλών γραφημάτων, τα θεματικά επίπεδα πρέπει να έχουν τον ίδιο γεωμετρικό τύπο", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Επιλογή πίνακα σχετικού με το θεματικό επίπεδο", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Υπόδειξη: Εμφανίζονται μόνο πίνακες με αριθμητικά πεδία", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Επιλέξτε ένα θεματικό επίπεδο που να διαθέτει σημειακό θεματικό επίπεδο.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Επιλέξτε έναν έγκυρο πίνακα/θεματικό επίπεδο που σχετίζεται με το θεματικό επίπεδο.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Το επιλεγμένο θεματικό επίπεδο δεν διαθέτει σχετικούς πίνακες/θεματικά επίπεδα.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "ΟΚ", //shown as a button text.
      cancelButton: "Άκυρο" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Τίτλος ενότητας", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Υπόδειξη: Εμφανίζεται στον τίτλο κεφαλίδας ενότητας", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Τίτλος γραφήματος", // shown as a label in config UI dialog box.
      chartTitleHintText: "Υπόδειξη: Εμφανίζεται στο κέντρο επάνω από το γράφημα", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Περιγραφή", // shown as a label in cofig UI.
      chartDescriptionHintText: "Υπόδειξη: Εμφανίζεται κάτω από το γράφημα", // shown as a hint text in config UI dialog box.
      chartType: "Τύπος γραφήματος", // shown as a label which shows type of chart.
      barChart: "Γράφημα ράβδων", // shown as a label for bar chart radio button.
      pieChart: "Γράφημα πίτας", // shown as a label for pie chart radio button.
      dataSeriesField: "Πεδίο σειράς δεδομένων", // shown as a label for selecting data series set.
      labelField: "Πεδίο ετικέτας", // shown as a label for selecting label field set.
      chartColor: "Χρώμα γραφήματος", // shown as a label which shows color for chart.
      singleColor: "Ένα μόνο χρώμα", // shown as a label for single color radio button.
      colorByTheme: "Χρώμα ανά θέμα", // shown as a label for color by theme radio button.
      colorByFieldValue: "Χρώμα ανά τιμή πεδίου", // shown as a label for color by field value radio button.
      xAxisTitle: "Τίτλος άξονα Χ", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Υπόδειξη: Τίτλος άξονα Χ", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Τίτλος άξονα Υ", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Υπόδειξη: Τίτλος άξονα Υ", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Ετικέτα", // shown as a header in table.
      fieldColorColor: "Χρώμα", // shown as a header in table.
      defaultFieldSelectLabel: "Επιλογή", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Δεν ήταν δυνατή η εύρεση τιμών για το επιλεγμένο πεδίο", // shown as an error in alert box.
      errMsgSectionTitle: "Εισαγάγετε τον τίτλο της ενότητας", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Επιλέξτε τιμή πεδίου", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Ρύθμιση", // shown as a label of tab in config UI
      layoutTabTitle: "Διάταξη" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Γενικές ρυθμίσεις", // shown as a label of general setting legend.
      locationSymbolLabel: "Γραφικό σύμβολο τοποθεσίας", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Υπόδειξη: Χρησιμοποιείται για την εμφάνιση του συμβόλου διεύθυνσης και επιλεγμένης τοποθεσίας", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Διάστημα ανανέωσης", // shown as a label of refresh interval.
      refreshIntervalHintText: "Υπόδειξη: Χρησιμοποιείται για την ανανέωση γραφημάτων βάσει αυτού του διαστήματος. Καθορίστε μια τιμή μεταξύ 1 και 1440 λεπτών", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Καθορίστε το διάστημα ανανέωσης μεταξύ 0 και 1440 λεπτών",  // shown as an error message.
      symbolPickerPreviewText: "Προεπισκόπηση:"
    }
  })
);
