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
    units: {
      miles: "Dặm", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilômét", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Bộ", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Mét" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Thiết lập Tìm kiếm", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Thiết lập", // shown as a button text to set layers
      selectLayersLabel: "Chọn lớp",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Mẹo: Được sử dụng để chọn lớp đa giác và lớp điểm liên quan của lớp đa giác đó.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Chọn ký hiệu để làm nổi bật đa giác", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Ký hiệu địa chỉ hoặc vị trí", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Mẹo: Ký hiệu dành cho địa chỉ được tìm kiếm hoặc vị trí được bấm", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Mẹo: Được sử dụng để hiển thị ký hiệu cho đa giác được chọn" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Hủy", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Chọn lớp đa giác", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Mẹo: Được sử dụng để chọn lớp đa giác.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Chọn lớp điểm liên quan đến lớp đa giác", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Mẹo: Được sử dụng để chọn lớp điểm liên quan đến lớp đa giác", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Vui lòng chọn lớp đa giác có lớp điểm liên quan.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Vui lòng chọn lớp đa giác có lớp điểm liên quan.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Vui lòng chọn lớp điểm liên quan đến lớp đa giác." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Thiết lập Hướng", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Dịch vụ định tuyến", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Dịch vụ Hình thức Di chuyển", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Thiết lập", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Mẹo: Bấm vào ‘Thiết lập’ để duyệt và chọn dịch vụ định tuyến phân tích mạng", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Đơn vị độ dài thông tin hướng", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Mẹo: Được sử dụng để hiển thị các đơn vị được báo cáo cho tuyến đường", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Chọn ký hiệu để hiển thị tuyến đường", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Mẹo: Được sử dụng để hiển thị ký hiệu đường của tuyến đường", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Mẹo: Bấm vào ‘Thiết lập’ để duyệt và chọn dịch vụ Hình thức Di chuyển", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Vui lòng xác định dịch vụ Hình thức Di chuyển hợp lệ", // shown as an error label in alert box when invalid travel mode service url is configured
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
    symbolPickerPreviewText: "Xem trước:"
  })
);