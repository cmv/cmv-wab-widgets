define(
   ({

    chartSettingLabel: "Kaavion asetukset",  //shown as a label in config UI dialog box.
    addNewLabel: "Lisää uusi", //shown as a button text to add layers.
    generalSettingLabel: "Yleiset asetukset", //shown as a button text to general settings button.

    layerChooser: {
      title: "Valitse kaavion lisättävä karttataso", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Valitse karttataso", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "Vihje: jos määrität useita kaavioita, karttatasojen on oltava samaa geometriatyyppiä", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Valitse karttatasoon liittyvä taulukko", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "Vihje: vain numerokenttiä sisältävä taulukot näytetään", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "Valitse karttataso, jossa on siihen liittyvä pistekarttataso.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Valitse kelvollinen karttatasoon liittyvä taulukko tai karttataso.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Valitussa karttatasossa ei ole yhtään liittyvää taulukkoa tai karttatasoa.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "Peruuta" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Osan otsikko", // shown as a label in config UI dialog box.
      sectionTitleHintText: "Vihje: näytetään osan ylätunnisteen otsikossa", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Kaavion otsikko", // shown as a label in config UI dialog box.
      chartTitleHintText: "Vihje: näytetään keskitettynä kaavion yläreunassa", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Kuvaus", // shown as a label in cofig UI.
      chartDescriptionHintText: "Vihje: näytetään kaavion alapuolella", // shown as a hint text in config UI dialog box.
      chartType: "Kaavion tyyppi", // shown as a label which shows type of chart.
      barChart: "Palkkikaavio", // shown as a label for bar chart radio button.
      pieChart: "Ympyräkaavio", // shown as a label for pie chart radio button.
      dataSeriesField: "Aineistosarjakenttä", // shown as a label for selecting data series set.
      labelField: "Tunnustekstikenttä", // shown as a label for selecting label field set.
      chartColor: "Kaavion väri", // shown as a label which shows color for chart.
      singleColor: "Yksittäinen väri", // shown as a label for single color radio button.
      colorByTheme: "Väritä teemoittain", // shown as a label for color by theme radio button.
      colorByFieldValue: "Väritä kentän arvon mukaan", // shown as a label for color by field value radio button.
      xAxisTitle: "X-akselin otsikko", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "Vihje: X-akselin otsikko", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y-akselin otsikko", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "Vihje: Y-akselin otsikko", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Tunnusteksti", // shown as a header in table.
      fieldColorColor: "Väri", // shown as a header in table.
      defaultFieldSelectLabel: "Valitse", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Valitun kentän arvoja ei löydy", // shown as an error in alert box.
      errMsgSectionTitle: "Anna osan otsikko", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Valitse kentän arvo", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Asetus", // shown as a label of tab in config UI
      layoutTabTitle: "Asettelu" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Yleiset asetukset", // shown as a label of general setting legend.
      locationSymbolLabel: "Graafinen sijainnin symboli", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "Vihje: käytetään osoitteen symbolin näyttämiseen ja sijainnin napsauttamiseen", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Päivitysväli", // shown as a label of refresh interval.
      refreshIntervalHintText: "Vihje: Käytetään kaavioiden päivittämiseen tämän aikavälin perusteella. Määritä arvo väliltä 1–1 440 minuuttia", // shown as an error for refresh interval.
      errMsgRefreshInterval: "Määritä päivitysväliksi 0–1 440 minuuttia",  // shown as an error message.
      symbolPickerPreviewText: "Esikatselu:"
    }
  })
);
