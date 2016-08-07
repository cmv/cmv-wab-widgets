/*global define*/
///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 Esri. All Rights Reserved.
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
    "miles": {
      "displayText": "Dặm",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilômét",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Bộ",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Mét",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Thiết lập Tìm kiếm",
    "defaultBufferDistanceLabel": "Đặt khoảng cách vùng đệm mặc định",
    "maxBufferDistanceLabel": "Đặt khoảng cách vùng đệm tối đa",
    "bufferDistanceUnitLabel": "Đơn vị khoảng cách đệm",
    "defaultBufferHintLabel": "Mẹo: Đặt giá trị mặc định cho thanh trượt vùng đệm",
    "maxBufferHintLabel": "Mẹo: Đặt giá trị tối đa cho thanh trượt vùng đệm",
    "bufferUnitLabel": "Mẹo: Xác định đơn vị để tạo bộ đệm",
    "selectGraphicLocationSymbol": "Ký hiệu địa chỉ hoặc vị trí",
    "graphicLocationSymbolHintText": "Mẹo: Ký hiệu dành cho địa chỉ được tìm kiếm hoặc vị trí được bấm",
    "fontColorLabel": "Chọn màu phông chữ cho kết quả tìm kiếm",
    "fontColorHintText": "Mẹo: Màu phông chữ của kết quả tìm kiếm",
    "zoomToSelectedFeature": "Phóng tới đối tượng được chọn",
    "zoomToSelectedFeatureHintText": "Mẹo: Phóng tới đối tượng được chọn thay vì vùng đệm",
    "intersectSearchLocation": "Trả về (các) đa giác giao nhau",
    "intersectSearchLocationHintText": "Mẹo: Trả về (các) đa giác chứa vị trí được tìm kiếm chứ không phải các đa giác trong vùng đệm",
    "bufferVisibilityLabel": "Đặt khả năng hiển thị vùng đệm",
    "bufferVisibilityHintText": "Mẹo: Vùng đệm sẽ được hiển thị trên bản đồ",
    "bufferColorLabel": "Đặt ký hiệu vùng đệm",
    "bufferColorHintText": "Mẹo: Chọn màu và độ trong suốt của vùng đệm",
    "searchLayerResultLabel": "Chỉ vẽ kết quả của lớp được chọn",
    "searchLayerResultHint": "Mẹo: Chỉ lớp được chọn trong kết quả tìm kiếm sẽ vẽ trên bản đồ"
  },
  "layerSelector": {
    "selectLayerLabel": "Chọn (các) lớp tìm kiếm",
    "layerSelectionHint": "Mẹo: Sử dụng nút thiết lập để chọn (nhiều) lớp",
    "addLayerButton": "Thiết lập"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Cài đặt Chỉ đường",
    "routeServiceUrl": "Dịch vụ Định tuyến",
    "buttonSet": "Thiết lập",
    "routeServiceUrlHintText": "Mẹo: Nhấp vào â€˜Đặtâ€™ để duyệt và chọn dịch vụ định tuyến",
    "directionLengthUnit": "Đơn vị độ dài thông tin hướng",
    "unitsForRouteHintText": "Mẹo: Được sử dụng để hiển thị các đơn vị cho tuyến đường",
    "selectRouteSymbol": "Chọn ký hiệu để hiển thị tuyến đường",
    "routeSymbolHintText": "Mẹo: Được sử dụng để hiển thị ký hiệu đường của tuyến đường",
    "routingDisabledMsg": "Để bật hướng, hãy bảo đảm rằng định tuyến được bật trong mục ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Thêm từ ArcGIS Online",
    "serviceURLabel": "Thêm URL Dịch vụ",
    "routeURL": "URL tuyến đường",
    "validateRouteURL": "Xác minh",
    "exampleText": "Ví dụ",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Vui lòng xác định dịch vụ Định tuyến hợp lệ.",
    "rateLimitExceeded": "Đã vượt quá giới hạn tần suất. Vui lòng thử lại sau.",
    "errorInvokingService": "Tên đăng nhập hoặc mật khẩu không chính xác."
  },
  "errorStrings": {
    "bufferErrorString": "Vui lòng nhập giá trị số hợp lệ.",
    "selectLayerErrorString": "Vui lòng chọn (các) lớp để tìm kiếm.",
    "invalidDefaultValue": "Khoảng cách đệm mặc định không được để trống. Vui lòng xác định khoảng cách đệm",
    "invalidMaximumValue": "Khoảng cách đệm tối đa không được để trống. Vui lòng xác định khoảng cách đệm",
    "defaultValueLessThanMax": "Vui lòng xác định khoảng cách đệm mặc định trong giới hạn tối đa",
    "defaultBufferValueGreaterThanZero": "Vui lòng xác định khoảng cách đệm mặc định lớn hơn 0",
    "maximumBufferValueGreaterThanZero": "Vui lòng xác định khoảng cách đệm tối đa lớn hơn 0"
  },
  "symbolPickerPreviewText": "Xem trước:"
});