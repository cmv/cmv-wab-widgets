/*global define*/
define(
   ({
    _widgetLabel: "Ở gần Tôi", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Tìm kiếm địa chỉ hoặc định vị trên bản đồ", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Lớp tìm kiếm không được cấu hình phù hợp", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Hiện kết quả trong ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Vui lòng xác định khoảng cách lớn hơn 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Không tìm thấy (các) kết quả", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Bấm để thêm điểm", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Không tìm thấy kết quả ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Tệp đính kèm", //Shown as label on attachments header
    unableToFetchResults: "Không thể nạp kết quả từ (các) lớp:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Thông tin", //Shown as title for information tab
    directionTabTitle: "Hướng", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Tạo tuyến đường thất bại.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Dịch vụ hình học không khả dụng.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Cửa sổ pop-up không được cấu hình, không thể hiển thị kết quả." //Shown as a message when popups for all the layers are disabled
  })
);