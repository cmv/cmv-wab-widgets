define(
   ({

    chartSettingLabel: "Paramètres de diagramme",  //shown as a label in config UI dialog box.
    addNewLabel: "Ajouter une action", //shown as a button text to add layers.
    generalSettingLabel: "paramètres généraux", //shown as a button text to general settings button.

    layerChooser: {
      title: "Sélectionner une couche à afficher sous forme de diagramme", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Sélectionner une couche", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Astuce : si vous configurez plusieurs diagrammes, les couches doivent être du même type de géométrie", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Sélectionner une table associée à une couche", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Astuce : seules les tables contenant des champs numériques sont affichées", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Sélectionnez une couche possédant une couche de points associée.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Sélectionnez une table/couche associée valide pour la couche.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "La couche sélectionnée ne possède pas de table/couche associée.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Annuler" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Titre de la section", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Astuce : affiché dans le titre de l’en-tête de la section", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Titre du diagramme", // shown as a label in config UI dialog box.
      chartTitleHintText: "Astuce : affiché de façon centrée en haut du diagramme", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Description", // shown as a label in cofig UI.
      chartDescriptionHintText: "Astuce : affiché sous le diagramme", // shown as a hint text in config UI dialog box.
      chartType: "Type de diagramme", // shown as a label which shows type of chart.
      barChart: "Diagramme à barres", // shown as a label for bar chart radio button.
      pieChart: "Diagramme circulaire", // shown as a label for pie chart radio button.
      dataSeriesField: "Champ de série de données", // shown as a label for selecting data series set.
      labelField: "Champ d’étiquette", // shown as a label for selecting label field set.
      chartColor: "Couleur du diagramme", // shown as a label which shows color for chart.
      singleColor: "Uni", // shown as a label for single color radio button.
      colorByTheme: "Couleur par thème", // shown as a label for color by theme radio button.
      colorByFieldValue: "Couleur par valeur de champ", // shown as a label for color by field value radio button.
      xAxisTitle: "Titre de l’axe des x", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Astuce : titre de l’axe des x", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Titre de l’axe des y", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Astuce : titre de l’axe des y", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Etiqueter", // shown as a header in table.
      fieldColorColor: "Couleur", // shown as a header in table.
      defaultFieldSelectLabel: "Sélectionner", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Impossible de trouver des valeurs pour le champ sélectionné", // shown as an error in alert box.
      errMsgSectionTitle: "Saisissez le titre de la section", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Sélectionnez une valeur de champ", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Paramètre", // shown as a label of tab in config UI
      layoutTabTitle: "Mise en page" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Paramètres généraux", // shown as a label of general setting legend.
      locationSymbolLabel: "Symbole d’emplacement graphique", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Astuce : utilisé pour afficher le symbole d’adresse et d’emplacement sélectionné", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Intervalle d\'actualisation", // shown as a label of refresh interval.
      refreshIntervalHintText: "Astuce : utilisé pour actualiser les diagrammes en fonction de cet intervalle. Spécifiez une valeur entre 1 et 1 440 minutes", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Spécifiez l’intervalle d’actualisation entre 0 et 1 440 minutes",  // shown as an error message.
      symbolPickerPreviewText: "Aperçu :"
    }
  })
);
