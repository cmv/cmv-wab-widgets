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
        displayText: "英里",
        acronym: "mi"
      },
      kilometers: {
        displayText: "公里",
        acronym: "km"
      },
      feet: {
        displayText: "英呎",
        acronym: "ft"
      },
      meters: {
        displayText: "公尺",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "搜尋設定", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "設定緩衝區距離預設值", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "設定用於尋找圖徵的緩衝區距離值上限", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "緩衝區距離單位", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "提示: 用來設定緩衝區的預設值", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "提示: 用來設定緩衝區的最大值", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "提示: 定義用於建立緩衝區的單位", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "地址或位置符號", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "提示: 搜尋的地址或按一下的位置所適用的符號", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "選擇搜尋結果的字型顏色", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "提示: 搜尋結果的字型顏色" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "選擇搜尋圖層", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "提示: 使用設定按鈕以選擇圖層", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "設定", //Shown as a button text to add the layer for search
      okButton: "確定", // shown as a button text for layer selector popup
      cancelButton: "取消" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "方向設定", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "路線規劃服務", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "行進模式服務", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "設定", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "提示: 按一下「設定」以瀏覽和選擇路線規劃服務", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "方向長度單位", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "提示: 用來顯示路線的單位", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "選擇要顯示路線的符號", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "提示: 用來顯示路線的線條符號", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "提示: 按一下「設定」以瀏覽和選擇行進模式服務", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "請指定有效的行進模式服務 ", // shown as an error label in alert box when invalid travel mode service url is configured
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
    errorStrings: {
      bufferErrorString: "請輸入有效的數值。", // shown as an error label in text box for buffer
      selectLayerErrorString: "請選擇要搜尋的圖層。", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "緩衝區預設距離不可空白。請指定緩衝區距離", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "緩衝區最大距離不可空白。請指定緩衝區距離", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "請指定位於上限內的緩衝區預設距離", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "請指定大於 0 的緩衝區預設距離", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "請指定大於 0 的緩衝區最大距離" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "預覽:"
  })
);