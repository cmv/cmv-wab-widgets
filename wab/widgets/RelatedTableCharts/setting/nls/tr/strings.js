define(
   ({

    chartSettingLabel: "Grafik ayarları",  //shown as a label in config UI dialog box.
    addNewLabel: "Yeni ekle", //shown as a button text to add layers.
    generalSettingLabel: "Genel ayarlar", //shown as a button text to general settings button.

    layerChooser: {
      title: "Grafiği oluşturulacak katmanı seç", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "Katman seç", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "İpucu: Birden çok grafik yapılandırılırken, katmanlar aynı geometri türünde olmalıdır", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "Katmanla ilişkili tabloyu seç", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "İpucu: Yalnızca sayısal alana sahip tablolar görüntülenir", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "İlişkili nokta katmanına sahip bir katman seçin.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "Katman için geçerli ilişkiye sahip bir tablo/katman seçin.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "Seçilen katmanın ilişkili tablosu/katmanı yok.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "Tamam", //shown as a button text.
      cancelButton: "İptal" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "Bölüm başlığı", // shown as a label in config UI dialog box.
      sectionTitleHintText: "İpucu: Bölüm başlığı üstbilgisinde görüntülenir", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "Grafik başlığı", // shown as a label in config UI dialog box.
      chartTitleHintText: "İpucu: Grafiğin en üstünde ortalanmış olarak görüntülenir", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "Açıklama", // shown as a label in cofig UI.
      chartDescriptionHintText: "İpucu: Grafiğin altında görüntülenir", // shown as a hint text in config UI dialog box.
      chartType: "Grafik türü", // shown as a label which shows type of chart.
      barChart: "Çubuk grafik", // shown as a label for bar chart radio button.
      pieChart: "Pasta grafik", // shown as a label for pie chart radio button.
      dataSeriesField: "Veri serisi alanı", // shown as a label for selecting data series set.
      labelField: "Etiket alanı", // shown as a label for selecting label field set.
      chartColor: "Grafik rengi", // shown as a label which shows color for chart.
      singleColor: "Tek renk", // shown as a label for single color radio button.
      colorByTheme: "Temaya göre renk", // shown as a label for color by theme radio button.
      colorByFieldValue: "Alan değerine göre renk", // shown as a label for color by field value radio button.
      xAxisTitle: "X ekseni başlığı", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "İpucu: X ekseni başlığı", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y ekseni başlığı", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "İpucu: Y ekseni başlığı", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "Etiket", // shown as a header in table.
      fieldColorColor: "Renk", // shown as a header in table.
      defaultFieldSelectLabel: "Seç", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "Seçilen alan için değer bulunamıyor", // shown as an error in alert box.
      errMsgSectionTitle: "Bölüm başlığını girin", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "Alan değerini seçin", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "Ayarlar", // shown as a label of tab in config UI
      layoutTabTitle: "Düzen" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "Genel Ayarlar", // shown as a label of general setting legend.
      locationSymbolLabel: "Grafik konumu simgesi", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "İpucu: Adres ve tıklanan konum simgesini görüntülemek için kullanılır", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "Yenileme aralığı", // shown as a label of refresh interval.
      refreshIntervalHintText: "İpucu: Bu aralığa göre grafikleri yenilemek için kullanılır. 1 - 1440 dakika arasında bir değer belirtin", // shown as an error for refresh interval.
      errMsgRefreshInterval: "0 - 1440 dakika arasında bir yenileme aralığı değeri belirtin",  // shown as an error message.
      symbolPickerPreviewText: "Önizleme:"
    }
  })
);
