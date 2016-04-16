/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "搜尋地圖上的地址或位置", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "搜尋圖層未正確配置", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "顯示 ${BufferDistance} ${BufferUnit} 中的結果", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "請指定大於 0 的距離", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "找不到結果", //display error message if buffer gets failed to generate
    selectLocationToolTip: "按一下以新增點", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "找不到任何結果 ", //Shown as message if no features available in current buffer area
    attachmentHeader: "附件", //Shown as label on attachments header
    unableToFetchResults: "無法從圖層擷取結果:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "資訊", //Shown as title for information tab
    directionTabTitle: "方向", //Shown as title for direction tab
    failedToGenerateRouteMsg: "無法產生路線。", //Shown as a message when fail to generate route
    geometryServicesNotFound: "幾何服務不可用。", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "未配置快顯視窗，無法顯示結果。" //Shown as a message when popups for all the layers are disabled
  })
);