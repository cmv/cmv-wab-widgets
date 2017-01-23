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
    "kilometers": "千米",
    "feet": "英尺",
    "meters": "米"
  },
  "layerSetting": {
    "layerSettingTabTitle": "搜索设置",
    "buttonSet": "设置",
    "selectLayersLabel": "选择图层",
    "selectLayersHintText": "提示: 用于选择面图层及其相关点图层。",
    "selectPrecinctSymbolLabel": "选择用于高亮显示面的符号",
    "selectGraphicLocationSymbol": "地址或位置符号",
    "graphicLocationSymbolHintText": "提示: 所搜索地址或所单击位置的符号",
    "precinctSymbolHintText": "提示: 用于显示所选面的符号",
    "selectColorForPoint": "选择用于高亮显示点的颜色",
    "selectColorForPointHintText": "提示: 用于显示所选点的高亮颜色"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "选择面图层",
    "selectPolygonLayerHintText": "提示: 用于选择面图层。",
    "selectRelatedPointLayerLabel": "选择与面图层相关的点图层",
    "selectRelatedPointLayerHintText": "提示: 用于选择与面图层相关的点图层",
    "polygonLayerNotHavingRelatedLayer": "请选择具有相关点图层的面图层。",
    "errorInSelectingPolygonLayer": "请选择具有相关点图层的面图层。",
    "errorInSelectingRelatedLayer": "请选择与面图层相关的点图层。"
  },
  "routeSetting": {
    "routeSettingTabTitle": "方向设置",
    "routeServiceUrl": "路径服务",
    "buttonSet": "设置",
    "routeServiceUrlHintText": "提示: 单击“设置”以浏览和选择网络分析路径服务",
    "directionLengthUnit": "方向长度单位",
    "unitsForRouteHintText": "提示: 用于显示报告的路径单位",
    "selectRouteSymbol": "选择用于显示路径的符号",
    "routeSymbolHintText": "提示: 用于显示路径的线符号",
    "routingDisabledMsg": "要启用方向，请确保已在 ArcGIS Online 项目中启用路径。"
  },
  "networkServiceChooser": {
    "arcgislabel": "从 ArcGIS Online 添加",
    "serviceURLabel": "添加服务 URL",
    "routeURL": "路径 URL",
    "validateRouteURL": "验证",
    "exampleText": "示例",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "请指定有效的路径服务。",
    "rateLimitExceeded": "超过速率限制。请稍后再试。",
    "errorInvokingService": "用户名或密码错误。"
  },
  "symbolPickerPreviewText": "预览:"
});