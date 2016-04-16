/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Bir adresi arayın veya haritada bulun", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Nokta eklemek için tıklayın", // Tooltip for location address button
    informationTabTitle: "Bilgi", // Shown as label on information tab
    directionTabTitle: "Yol Tarifi", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Alan katmanı düzgün yapılandırılmamış", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "İlgili Nokta katmanı düzgün yapılandırılmamış", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Bu adres veya konum için alan bulunamadı", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Alanla ilişkili nokta bulunamadı", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Eklentiler", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Rota oluşturulamadı.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Açılır pencereler yapılandırılmamış, sonuçlar görüntülenemiyor." //Shown as a message when popups for all the layers are disabled

  })
);