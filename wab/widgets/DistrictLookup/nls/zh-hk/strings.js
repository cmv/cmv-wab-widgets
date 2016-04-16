/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "搜尋地圖上的地址或位置", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "按一下以新增點", // Tooltip for location address button
    informationTabTitle: "資訊", // Shown as label on information tab
    directionTabTitle: "方向", // Shown as label on direction tab
    invalidPolygonLayerMsg: "多邊形圖層未正確配置", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "相關點圖層未正確配置", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "找不到此地址或位置的多邊形", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "找不到多邊形的相關點", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "附件(A)", //Shown as label on attachments header
    failedToGenerateRouteMsg: "無法產生路線。", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "未配置快顯視窗，無法顯示結果。" //Shown as a message when popups for all the layers are disabled

  })
);