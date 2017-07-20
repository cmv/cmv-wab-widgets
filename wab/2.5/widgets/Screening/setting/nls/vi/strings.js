///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define({
  "units": {
    "standardUnit": "Đơn vị tiêu chuẩn",
    "metricUnit": "Đơn vị mét"
  },
  "analysisTab": {
    "analysisTabLabel": "Phân tích",
    "selectAnalysisLayerLabel": "Chọn lớp phân tích",
    "addLayerLabel": "Thêm Lớp",
    "noValidLayersForAnalysis": "Không tìm thấy lớp hợp lệ cho bản đồ web đã chọn.",
    "noValidFieldsForAnalysis": "Không tìm thấy các trường hợp lệ cho bản đồ web đã chọn. Vui lòng xóa lớp đã chọn.",
    "addLayersHintText": "Gợi ý: Chọn các lớp và trường để phân tích và hiển thị trong bản đồ",
    "addLayerNameTitle": "Tên lớp",
    "addFieldsLabel": "Thêm Trường",
    "addFieldsPopupTitle": "Chọn Trường",
    "addFieldsNameTitle": "Tên Trường",
    "aoiToolsLegendLabel": "Công cụ AOI",
    "aoiToolsDescriptionLabel": "Bật công cụ để tạo phạm vi quan tâm và nêu rõ nhãn của chúng",
    "placenameLabel": "Tên địa điểm",
    "drawToolsLabel": "Công cụ Vẽ",
    "uploadShapeFileLabel": "Tải lên Shapefile",
    "coordinatesLabel": "Các tòa độ",
    "coordinatesDrpDwnHintText": "Gợi ý: Chọn đơn vị để hiển thị các đường đi qua đã nhập",
    "coordinatesBearingDrpDwnHintText": "Gợi ý: Chọn hướng để hiển thị các đường đi qua đã nhập",
    "allowShapefilesUploadLabel": "Cho phép tải lên các tệp tin hình dạng để phân tích",
    "areaUnitsLabel": "Hiển thị khu vực/độ dài trong",
    "allowShapefilesUploadLabelHintText": "Gợi ý: Hiển thị \"Tải lên các tệp tin hình dạng trong Phân tích\" trong Tab Báo cáo",
    "maxFeatureForAnalysisLabel": "Đối tượng tối đa để phân tích",
    "maxFeatureForAnalysisHintText": "Gợi ý: Thiết lập số đối tượng tối đa để phân tích",
    "searchToleranceLabelText": "Sai số tìm kiếm (feet)",
    "searchToleranceHint": "Gợi ý: Sai số tìm kiếm chỉ được sử dụng khi phân tích thông tin điểm và đường thẳng"
  },
  "downloadTab": {
    "downloadLegend": "Thiết lập tải về",
    "reportLegend": "Thiết lập báo cáo",
    "downloadTabLabel": "Tải xuống",
    "syncEnableOptionLabel": "Lớp đối tượng",
    "syncEnableOptionHint": "Gợi ý: Được sử dụng để tải về thông tin đối tượng cho các đối tượng giao cắt với phạm vi quan tâm ở định dạng được chỉ định",
    "syncEnableOptionNote": "Lưu ý: Phải có dịch vụ bật đồng bộ đối tượng cho tùy chọn File Geodatabase.",
    "extractDataTaskOptionLabel": "Dịch vụ xử lý địa lý Thao tác trích dữ liệu",
    "extractDataTaskOptionHint": "Gợi ý: Sử dụng dịch vụ xử lý địa lý Thao tác trích dữ liệu để tải về đối tượng giao với phạm vi quan tâm ở định dạng File Geodatabase hoặc Shapefile.",
    "cannotDownloadOptionLabel": "Tắt tải về",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Tên lớp",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "File Geodatabase",
      "allowDownloadLabel": "Cho phép tải về"
    },
    "setButtonLabel": "Thiết lập",
    "GPTaskLabel": "Xác định url cho dịch vụ xử lý địa lý",
    "printGPServiceLabel": "URL Dịch vụ In",
    "setGPTaskTitle": "Nêu rõ URL dịch vụ xử lý địa lý yêu cầu",
    "logoLabel": "Logo",
    "logoChooserHint": "Gợi ý: Nhấp vào biểu tượng hình ảnh để thay đổi hình ảnh",
    "footnoteLabel": "Ghi chú chân trang",
    "columnTitleColorPickerLabel": "Màu cho tiêu đề cột",
    "reportTitleLabel": "Tiêu đề báo cáo",
    "errorMessages": {
      "invalidGPTaskURL": "Dịch vụ xử lý địa lý không hợp lệ. Vui lòng chọn dịch vụ xử lý địa lý có Thao tác trích dữ liệu.",
      "noExtractDataTaskURL": "Vui lòng chọn bấ tkỳ dịch vụ xử lý địa lý nào có Thao tác trích dự liệu."
    }
  },
  "generalTab": {
    "generalTabLabel": "Tổng quan",
    "tabLabelsLegend": "Nhãn bảng điều khiển",
    "tabLabelsHint": "Gợi ý: Xác định nhãn",
    "AOITabLabel": "Phạm vi bảng điều khiển quan tâm",
    "ReportTabLabel": "Bảng điều khiển báo cáo",
    "bufferSettingsLegend": "Cài đặt Vùng đệm",
    "defaultBufferDistanceLabel": "Khoảng cách vùng đệm mặc định",
    "defaultBufferUnitsLabel": "Đơn vị vùng đệm",
    "generalBufferSymbologyHint": "Gợi ý: Thiết lập ký hiệu sẽ được sử dụng để hiển thị vùng đệm xung quanh phạm vi quan tâm được xác định",
    "aoiGraphicsSymbologyLegend": "Biểu tượng đồ họa AOI",
    "aoiGraphicsSymbologyHint": "Gợi ý: Thiết lập ký hiệu sẽ được sử dụng trong khi xác định phạm vi quan tâm điểm, đường thẳng và vùng",
    "pointSymbologyLabel": "Điểm",
    "previewLabel": "Xem trước",
    "lineSymbologyLabel": "Đường",
    "polygonSymbologyLabel": "Đa giác",
    "aoiBufferSymbologyLabel": "Ký hiệu vùng đệm",
    "pointSymbolChooserPopupTitle": "Ký hiệu địa chỉ hoặc vị trí",
    "polygonSymbolChooserPopupTitle": "Chọn ký hiệu để làm nổi bật đa giác",
    "lineSymbolChooserPopupTitle": "Chọn ký hiệu để làm nổi bật đường thẳng",
    "aoiSymbolChooserPopupTitle": "Đặt ký hiệu vùng đệm"
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Thiết lập Nguồn Tìm kiếm",
    "searchSourceSettingTitle": "Thiết lập Nguồn Tìm kiếm",
    "searchSourceSettingTitleHintText": "Thêm và cấu hình dịch vụ mã hóa địa lý hoặc lớp đối tượng làm nguồn tìm kiếm. Các nguồn đặc thù này xác định yếu tố nào có thể tìm kiếm được trong hộp tìm kiếm",
    "addSearchSourceLabel": "Thêm Nguồn Tìm kiếm",
    "featureLayerLabel": "Lớp đối tượng",
    "geocoderLabel": "Trình mã hóa địa lý",
    "generalSettingLabel": "Thiết lập Tổng quan",
    "allPlaceholderLabel": "Văn bản gợi ý để tìm kiếm tất cả:",
    "allPlaceholderHintText": "Mẹo: Nhập nội dung cần hiển thị làm văn bản gợi ý khi tìm kiếm tất cả các lớp và trình mã hóa địa lý",
    "generalSettingCheckboxLabel": "Hiển thị cửa sổ pop-up cho vị trí hoặc đối tượng được tìm thấy",
    "countryCode": "Mã Quốc gia hoặc Khu vực",
    "countryCodeEg": "ví dụ ",
    "countryCodeHint": "Để trống giá trị này sẽ tìm kiếm tất cả các quốc gia và khu vực",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Chỉ tìm kiếm trong kích thước bản đồ hiện tại",
    "zoomScale": "Tỷ lệ Thu phóng",
    "locatorUrl": "URL Bộ mã địa lý",
    "locatorName": "Tên Bộ mã địa lý",
    "locatorExample": "Ví dụ",
    "locatorWarning": "Phiên bản dịch vụ mã hóa địa lý này không được hỗ trợ. Tiện ích này hỗ trợ dịch vụ mã hóa địa lý 10.0 trở lên.",
    "locatorTips": "Các gợi ý không khả dụng do dịch vụ mã hóa địa lý không hỗ trợ khả năng gợi ý.",
    "layerSource": "Nguồn Lớp",
    "setLayerSource": "Thiết lập Nguồn Lớp",
    "setGeocoderURL": "Thiết lập URL Trình mã hóa địa lý",
    "searchLayerTips": "Các gợi ý không khả dụng do dịch vụ mã hóa địa lý không hỗ trợ khả năng phân trang.",
    "placeholder": "Văn bản trình giữ chỗ",
    "searchFields": "Trường Tìm kiếm",
    "displayField": "Hiển thị Trường",
    "exactMatch": "Kết quả khớp Chính xác",
    "maxSuggestions": "Đề xuất Tối đa",
    "maxResults": "Kết quả Tối đa",
    "enableLocalSearch": "Bật tính năng tìm kiếm nội bộ",
    "minScale": "Tỷ lệ Tối thiểu",
    "minScaleHint": "Khi tỷ lệ bản đồ lớn hơn tỷ lệ này, tìm kiếm cục bộ sẽ được áp dụng",
    "radius": "Bán kính",
    "radiusHint": "Xác định bán kính của một khu vực xung quanh trung tâm bản đồ hiện tại sẽ làm tăng thứ hạng của các đối tượng mã hóa địa lý, giúp các đối tượng ở gần nhất với vị trí được trả về đầu tiên",
    "setSearchFields": "Thiết lập Trường Tìm kiếm",
    "set": "Thiết lập",
    "invalidUrlTip": "URL ${URL} không hợp lệ hoặc không thể truy cập được.",
    "invalidSearchSources": "Thiết lập nguồn tìm kiếm không hợp lệ"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Vui lòng điền vào các trường yêu cầu",
    "bufferDistanceFieldsErrorMsg": "Vui lòng điền vào giá trị hợp lệ",
    "invalidSearchToleranceErrorMsg": "Vui lòng điền vào giá trị hợp lệ cho từng sai số tìm kiếm",
    "atLeastOneCheckboxCheckedErrorMsg": "Cấu hình không hợp lệ",
    "noLayerAvailableErrorMsg": "Không có lớp nào khả dụng",
    "layerNotSupportedErrorMsg": "Không được hỗ trợ ",
    "noFieldSelected": "Vui lòng sử dụng thao tác hiệu chỉnh để chọn các trường để phân tích.",
    "duplicateFieldsLabels": "Nhãn giống nhau \"${labelText}\" được thêm cho: \"${itemNames}\"",
    "noLayerSelected": "Vui lòng chọn ít nhất một lớp để phân tích",
    "errorInSelectingLayer": "Không thể hoàn tất hoạt động chọn lớp. Vui lòng thử lại.",
    "errorInMaxFeatureCount": "Vui lòng nhập số đếm đối tượng tối đa hợp lệ để phân tích."
  }
});