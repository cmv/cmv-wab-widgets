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
      miles: "英里", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "公里", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "英呎", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "公尺" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "搜尋設定", // shown as a label in config UI dialog box for layer setting
      buttonSet: "設定", // shown as a button text to set layers
      selectLayersLabel: "選擇圖層",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "提示: 用來選擇多邊形圖層及其相關點圖層。", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "選擇符號以突顯多邊形", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "地址或位置符號", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "提示: 搜尋的地址或按一下的位置所適用的符號", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "提示: 用來顯示所選多邊形的符號" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "確定", // shown as a button text for layerSelector configuration panel
      cancelButton: "取消", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "選擇多邊形圖層", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "提示: 用來選擇多邊形圖層。", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "選擇多邊形圖層相關的點圖層", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "提示: 用來選擇多邊形圖層相關的點圖層", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "請選擇具有相關點圖層的多邊形圖層。", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "請選擇具有相關點圖層的多邊形圖層。", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "請選擇多邊形圖層相關的點圖層。" // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "方向設定", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "路線規劃服務", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "行進模式服務", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "設定", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "提示: 按一下「設定」以瀏覽和選擇網路分析路線規劃服務", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "方向長度單位", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "提示: 用來顯示路線的報告單位", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "選擇要顯示路線的符號", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "提示: 用來顯示路線的線條符號", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "提示: 按一下「設定」以瀏覽和選擇行進模式服務", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "請指定有效的行進模式服務", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "若要啟用方向，請確定在 ArcGIS Online 項目中啟用路線規劃。" // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "從 ArcGIS Online 新增", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "新增服務 URL", // shown as a label in route service configuration panel to add service url
      routeURL: "路徑 URL", // shown as a label in route service configuration panel
      validateRouteURL: "驗證", // shown as a button text in route service configuration panel to validate url
      exampleText: "範例", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "確定", // shown as a button text for route service configuration panel
      cancelButton: "取消", // shown as a button text for route service configuration panel
      nextButton: "下一頁", // shown as a button text for route service configuration panel
      backButton: "返回", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "請指定有效的路線服務。" // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "預覽:"
  })
);