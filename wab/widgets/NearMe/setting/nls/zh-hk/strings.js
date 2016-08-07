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
      "displayText": "英里",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "公里",
      "acronym": "km"
    },
    "feet": {
      "displayText": "英呎",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "公尺",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "搜尋設定",
    "defaultBufferDistanceLabel": "設定預設緩衝區距離",
    "maxBufferDistanceLabel": "設定最大緩衝區距離",
    "bufferDistanceUnitLabel": "緩衝區距離單位",
    "defaultBufferHintLabel": "提示: 設定緩衝區滑桿的預設值",
    "maxBufferHintLabel": "提示: 設定緩衝區滑桿的最大值",
    "bufferUnitLabel": "提示: 定義用於建立緩衝區的單位",
    "selectGraphicLocationSymbol": "地址或位置符號",
    "graphicLocationSymbolHintText": "提示: 搜尋的地址或按一下的位置所適用的符號",
    "fontColorLabel": "選擇搜尋結果的字型顏色",
    "fontColorHintText": "提示: 搜尋結果的字型顏色",
    "zoomToSelectedFeature": "縮放至所選圖徵",
    "zoomToSelectedFeatureHintText": "提示: 縮放至所選圖徵而非緩衝區",
    "intersectSearchLocation": "傳回相交的多邊形",
    "intersectSearchLocationHintText": "提示: 傳回包含搜尋之位置的多邊形，而非緩衝區內的多邊形",
    "bufferVisibilityLabel": "設定緩衝區能見度",
    "bufferVisibilityHintText": "提示: 緩衝區將顯示在地圖上",
    "bufferColorLabel": "設定緩衝區符號",
    "bufferColorHintText": "提示: 選擇緩衝區的顏色和透明度",
    "searchLayerResultLabel": "僅繪製所選圖層結果",
    "searchLayerResultHint": "提示: 只會在地圖上繪製搜尋結果中的所選圖層"
  },
  "layerSelector": {
    "selectLayerLabel": "選擇搜尋圖層",
    "layerSelectionHint": "提示: 使用設定按鈕以選擇圖層",
    "addLayerButton": "設定"
  },
  "routeSetting": {
    "routeSettingTabTitle": "方向設定",
    "routeServiceUrl": "路線規劃服務",
    "buttonSet": "設定",
    "routeServiceUrlHintText": "提示: 按一下「設定」以瀏覽和選擇路線規劃服務",
    "directionLengthUnit": "方向長度單位",
    "unitsForRouteHintText": "提示: 用來顯示路線的單位",
    "selectRouteSymbol": "選擇要顯示路線的符號",
    "routeSymbolHintText": "提示: 用來顯示路線的線條符號",
    "routingDisabledMsg": "若要啟用方向，請確定在 ArcGIS Online 項目中啟用路線規劃。"
  },
  "networkServiceChooser": {
    "arcgislabel": "從 ArcGIS Online 新增",
    "serviceURLabel": "新增服務 URL",
    "routeURL": "路徑 URL",
    "validateRouteURL": "驗證",
    "exampleText": "範例",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "請指定有效的路線服務。",
    "rateLimitExceeded": "已超過比率限制。請稍後再試。",
    "errorInvokingService": "使用者名稱或密碼不正確。"
  },
  "errorStrings": {
    "bufferErrorString": "請輸入有效的數值。",
    "selectLayerErrorString": "請選擇要搜尋的圖層。",
    "invalidDefaultValue": "緩衝區預設距離不可空白。請指定緩衝區距離",
    "invalidMaximumValue": "緩衝區最大距離不可空白。請指定緩衝區距離",
    "defaultValueLessThanMax": "請指定位於上限內的緩衝區預設距離",
    "defaultBufferValueGreaterThanZero": "請指定大於 0 的緩衝區預設距離",
    "maximumBufferValueGreaterThanZero": "請指定大於 0 的緩衝區最大距離"
  },
  "symbolPickerPreviewText": "預覽:"
});