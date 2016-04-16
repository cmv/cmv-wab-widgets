/*global define*/
define(
   ({
    _widgetLabel: "Tra cứu Quận", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Tìm kiếm địa chỉ hoặc định vị trên bản đồ", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Bấm để thêm điểm", // Tooltip for location address button
    informationTabTitle: "Thông tin", // Shown as label on information tab
    directionTabTitle: "Chỉ đường", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Lớp đa giác không được cấu hình phù hợp", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Lớp Điểm Liên quan không được cấu hình phù hợp", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Không tìm thấy đa giác cho địa chỉ hoặc vị trí này", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Không tìm thấy điểm liên quan đến đa giác", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Tệp đính kèm", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Tạo tuyến đường thất bại.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Cửa sổ pop-up không được cấu hình, không thể hiển thị kết quả." //Shown as a message when popups for all the layers are disabled

  })
);