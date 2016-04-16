/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Bir adresi arayın veya haritada bulun", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Arama katmanları düzgün yapılandırılmamış", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Şu menzildeki sonuçları göster: ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "0\'dan büyük bir mesafe belirtin", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Sonuç bulunamadı", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Nokta eklemek için tıklayın", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Sonuç bulunamadı ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Eklentiler", //Shown as label on attachments header
    unableToFetchResults: "Şu katmanlardan sonuçlar getirilemiyor:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Bilgi", //Shown as title for information tab
    directionTabTitle: "Yön", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Rota oluşturulamadı.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Geometri Servisi kullanılamıyor.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Açılır pencereler yapılandırılmamış, sonuçlar görüntülenemiyor." //Shown as a message when popups for all the layers are disabled
  })
);