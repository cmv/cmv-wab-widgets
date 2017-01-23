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
    "miles": "英里",
    "kilometers": "公里",
    "feet": "英呎",
    "meters": "公尺"
  },
  "layerSetting": {
    "layerSettingTabTitle": "搜尋設定",
    "buttonSet": "設定",
    "selectLayersLabel": "選擇圖層",
    "selectLayersHintText": "提示: 用來選擇多邊形圖層及其相關點圖層。",
    "selectPrecinctSymbolLabel": "選擇符號以突顯多邊形",
    "selectGraphicLocationSymbol": "地址或位置符號",
    "graphicLocationSymbolHintText": "提示: 搜尋的地址或按一下的位置所適用的符號",
    "precinctSymbolHintText": "提示: 用來顯示所選多邊形的符號",
    "selectColorForPoint": "選擇顏色以突顯點",
    "selectColorForPointHintText": "提示: 用來顯示所選點的強調顏色"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "選擇多邊形圖層",
    "selectPolygonLayerHintText": "提示: 用來選擇多邊形圖層。",
    "selectRelatedPointLayerLabel": "選擇多邊形圖層相關的點圖層",
    "selectRelatedPointLayerHintText": "提示: 用來選擇多邊形圖層相關的點圖層",
    "polygonLayerNotHavingRelatedLayer": "請選擇具有相關點圖層的多邊形圖層。",
    "errorInSelectingPolygonLayer": "請選擇具有相關點圖層的多邊形圖層。",
    "errorInSelectingRelatedLayer": "請選擇多邊形圖層相關的點圖層。"
  },
  "routeSetting": {
    "routeSettingTabTitle": "方向設定",
    "routeServiceUrl": "路線規劃服務",
    "buttonSet": "設定",
    "routeServiceUrlHintText": "提示: 按一下「設定」以瀏覽和選擇網路分析路線規劃服務",
    "directionLengthUnit": "方向長度單位",
    "unitsForRouteHintText": "提示: 用來顯示路線的報告單位",
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
  "symbolPickerPreviewText": "預覽:"
});