define(
   ({

    chartSettingLabel: "Diagrammeinstellungen",  //shown as a label in config UI dialog box.
    addNewLabel: "Neue hinzufügen", //shown as a button text to add layers.
    generalSettingLabel: "Allgemeine Einstellungen", //shown as a button text to general settings button.

    layerChooser: {
      title: "Layer zur Darstellung auswählen", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Layer auswählen", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Hinweis: Wenn Sie mehrere Diagramme darstellen, müssen die Layer denselben Geometrietyp aufweisen", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Mit Layer in Beziehung stehende Tabelle auswählen", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Hinweis: Nur Tabellen mit numerischen Feldern können angezeigt werden", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Wählen Sie einen Layer aus, der einen zugehörigen Punkt-Layer aufweist", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Wählen Sie eine(n) gültige(n) Tabelle/Layer aus, die/der mit dem Layer in Beziehung steht", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Der ausgewählte Layer weist keine(n) zugehörige(n) Tabelle/Layer auf.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Abbrechen" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Abschnittstitel", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Hinweis: Wird in der Überschrift (im Titel) des Abschnitts angezeigt", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Diagrammtitel", // shown as a label in config UI dialog box.
      chartTitleHintText: "Hinweis: Wird zentriert über dem Diagramm angezeigt", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Beschreibung", // shown as a label in cofig UI.
      chartDescriptionHintText: "Hinweis: Wird unter dem Diagramm angezeigt", // shown as a hint text in config UI dialog box.
      chartType: "Diagrammtyp", // shown as a label which shows type of chart.
      barChart: "Balkendiagramm", // shown as a label for bar chart radio button.
      pieChart: "Kreisdiagramm", // shown as a label for pie chart radio button.
      dataSeriesField: "Datenreihenfeld", // shown as a label for selecting data series set.
      labelField: "Beschriftungsfeld", // shown as a label for selecting label field set.
      chartColor: "Diagrammfarbe", // shown as a label which shows color for chart.
      singleColor: "Einzelfarbe", // shown as a label for single color radio button.
      colorByTheme: "Farbe nach Design", // shown as a label for color by theme radio button.
      colorByFieldValue: "Farbe nach Feldwert", // shown as a label for color by field value radio button.
      xAxisTitle: "Titel der X-Achse", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Hinweis: Titel der X-Achse", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Titel der Y-Achse", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Hinweis: Titel der Y-Achse", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Beschriftung", // shown as a header in table.
      fieldColorColor: "Farbe", // shown as a header in table.
      defaultFieldSelectLabel: "Auswählen", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Für das ausgewählte Feld konnten keine Werte gefunden werden", // shown as an error in alert box.
      errMsgSectionTitle: "Geben Sie den Abschnittstitel ein", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Wählen Sie den Feldwert aus", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Einstellung", // shown as a label of tab in config UI
      layoutTabTitle: "Layout" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Allgemeine Einstellungen", // shown as a label of general setting legend.
      locationSymbolLabel: "Symbol für grafische Position", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Hinweis: Wird zum Anzeigen eines Symbols für die Adresse und aktivierte Position verwendet", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Aktualisierungsintervall", // shown as a label of refresh interval.
      refreshIntervalHintText: "Hinweis: Wird zum Aktualisieren von Diagrammen basierend auf diesem Intervall verwendet. Geben Sie einen Wert zwischen 1 und 1440 Minuten ein", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Legen Sie das Aktualisierungsintervall auf einen Wert zwischen 0 und 1440 Minuten fest",  // shown as an error message.
      symbolPickerPreviewText: "Vorschau:"
    }
  })
);
