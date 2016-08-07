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
    "miles": "Dặm",
    "kilometers": "Kilômét",
    "feet": "Bộ",
    "meters": "Mét"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Thiết lập Tìm kiếm",
    "buttonSet": "Thiết lập",
    "selectLayersLabel": "Chọn lớp",
    "selectLayersHintText": "Mẹo: Được sử dụng để chọn lớp đa giác và lớp điểm liên quan của lớp đa giác đó.",
    "selectPrecinctSymbolLabel": "Chọn ký hiệu để làm nổi bật đa giác",
    "selectGraphicLocationSymbol": "Ký hiệu địa chỉ hoặc vị trí",
    "graphicLocationSymbolHintText": "Mẹo: Ký hiệu dành cho địa chỉ được tìm kiếm hoặc vị trí được bấm",
    "precinctSymbolHintText": "Mẹo: Được sử dụng để hiển thị ký hiệu cho đa giác được chọn",
    "selectColorForPoint": "Chọn màu để đánh dấu điểm",
    "selectColorForPointHintText": "Mẹo: Được sử dụng để hiển thị màu đánh dấu cho điểm được chọn"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Chọn lớp đa giác",
    "selectPolygonLayerHintText": "Mẹo: Được sử dụng để chọn lớp đa giác.",
    "selectRelatedPointLayerLabel": "Chọn lớp điểm liên quan đến lớp đa giác",
    "selectRelatedPointLayerHintText": "Mẹo: Được sử dụng để chọn lớp điểm liên quan đến lớp đa giác",
    "polygonLayerNotHavingRelatedLayer": "Vui lòng chọn lớp đa giác có lớp điểm liên quan.",
    "errorInSelectingPolygonLayer": "Vui lòng chọn lớp đa giác có lớp điểm liên quan.",
    "errorInSelectingRelatedLayer": "Vui lòng chọn lớp điểm liên quan đến lớp đa giác."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Cài đặt Chỉ đường",
    "routeServiceUrl": "Dịch vụ định tuyến",
    "buttonSet": "Thiết lập",
    "routeServiceUrlHintText": "Mẹo: Bấm vào ‘Thiết lập’ để duyệt và chọn dịch vụ định tuyến phân tích mạng",
    "directionLengthUnit": "Đơn vị độ dài thông tin hướng",
    "unitsForRouteHintText": "Mẹo: Được sử dụng để hiển thị các đơn vị được báo cáo cho tuyến đường",
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
  "symbolPickerPreviewText": "Xem trước:"
});