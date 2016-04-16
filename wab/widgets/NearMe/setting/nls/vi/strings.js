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
define(
   ({
    units: { // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit) and acronym in feature list
      miles: {
        displayText: "Dặm",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilômét",
        acronym: "km"
      },
      feet: {
        displayText: "Bộ",
        acronym: "ft"
      },
      meters: {
        displayText: "Mét",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Thiết lập Tìm kiếm", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Thiết lập giá trị khoảng cách đệm mặc định", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Thiết lập giá trị khoảng cách đệm tối đa để tìm đối tượng", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Đơn vị khoảng cách đệm", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Mẹo: Sử dụng để thiết lập giá trị mặc định cho bộ đệm", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Mẹo: Sử dụng để thiết lập giá trị tối đa cho bộ đệm", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Mẹo: Xác định đơn vị để tạo bộ đệm", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Ký hiệu địa chỉ hoặc vị trí", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Mẹo: Ký hiệu dành cho địa chỉ được tìm kiếm hoặc vị trí được bấm", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Chọn màu phông chữ cho kết quả tìm kiếm", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Mẹo: Màu phông chữ của kết quả tìm kiếm" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Chọn (các) lớp tìm kiếm", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Mẹo: Sử dụng nút thiết lập để chọn (nhiều) lớp", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Thiết lập", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Hủy" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Thiết lập Hướng", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Dịch vụ Định tuyến", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Dịch vụ Hình thức Di chuyển", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Thiết lập", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Mẹo: Bấm vào ‘Thiết lập’ để duyệt và chọn dịch vụ định tuyến", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Đơn vị độ dài thông tin hướng", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Mẹo: Được sử dụng để hiển thị các đơn vị cho tuyến đường", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Chọn ký hiệu để hiển thị tuyến đường", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Mẹo: Được sử dụng để hiển thị ký hiệu đường của tuyến đường", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Mẹo: Bấm vào ‘Thiết lập’ để duyệt và chọn Dịch vụ Hình thức Di chuyển", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Vui lòng xác định dịch vụ Hình thức Di chuyển hợp lệ ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Để bật hướng, hãy bảo đảm rằng định tuyến được bật trong mục ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Thêm từ ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Thêm URL Dịch vụ", // shown as a label in route service configuration panel to add service url
      routeURL: "URL tuyến đường", // shown as a label in route service configuration panel
      validateRouteURL: "Xác minh", // shown as a button text in route service configuration panel to validate url
      exampleText: "Ví dụ", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Hủy", // shown as a button text for route service configuration panel
      nextButton: "Tiếp theo", // shown as a button text for route service configuration panel
      backButton: "Quay lại", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Vui lòng xác định dịch vụ Định tuyến hợp lệ." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Vui lòng nhập giá trị số hợp lệ.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Vui lòng chọn (các) lớp để tìm kiếm.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Khoảng cách đệm mặc định không được để trống. Vui lòng xác định khoảng cách đệm", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Khoảng cách đệm tối đa không được để trống. Vui lòng xác định khoảng cách đệm", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Vui lòng xác định khoảng cách đệm mặc định trong giới hạn tối đa", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Vui lòng xác định khoảng cách đệm mặc định lớn hơn 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Vui lòng xác định khoảng cách đệm tối đa lớn hơn 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Xem trước:"
  })
);