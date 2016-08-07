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
      "displayText": "千米",
      "acronym": "km"
    },
    "feet": {
      "displayText": "英尺",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "米",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "搜索设置",
    "defaultBufferDistanceLabel": "设置默认缓冲距离",
    "maxBufferDistanceLabel": "设置最大缓冲距离",
    "bufferDistanceUnitLabel": "缓冲距离单位",
    "defaultBufferHintLabel": "提示: 设置缓冲滑块的默认值",
    "maxBufferHintLabel": "提示: 设置缓冲滑块的最大值",
    "bufferUnitLabel": "提示: 为创建缓冲定义单位",
    "selectGraphicLocationSymbol": "地址或位置符号",
    "graphicLocationSymbolHintText": "提示: 所搜索地址或所单击位置的符号",
    "fontColorLabel": "选择搜索结果的字体颜色",
    "fontColorHintText": "提示: 搜索结果的字体颜色",
    "zoomToSelectedFeature": "缩放至所选要素",
    "zoomToSelectedFeatureHintText": "提示: 缩放至所选要素，而非缓冲",
    "intersectSearchLocation": "返回相交面",
    "intersectSearchLocationHintText": "提示: 返回包含搜索位置的面，而非缓冲内的面",
    "bufferVisibilityLabel": "设置缓冲可见性",
    "bufferVisibilityHintText": "提示: 缓冲将显示在地图上",
    "bufferColorLabel": "设置缓冲符号",
    "bufferColorHintText": "提示: 选择缓冲的颜色和透明度",
    "searchLayerResultLabel": "仅绘制所选图层结果",
    "searchLayerResultHint": "提示: 地图上将仅绘制搜索结果中的所选图层"
  },
  "layerSelector": {
    "selectLayerLabel": "选择搜索图层",
    "layerSelectionHint": "提示: 使用设置按钮选择图层",
    "addLayerButton": "设置"
  },
  "routeSetting": {
    "routeSettingTabTitle": "方向设置",
    "routeServiceUrl": "路径服务",
    "buttonSet": "设置",
    "routeServiceUrlHintText": "提示: 单击“设置”以浏览和选择路径服务",
    "directionLengthUnit": "方向长度单位",
    "unitsForRouteHintText": "提示: 用于显示路径单位",
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
  "errorStrings": {
    "bufferErrorString": "请输入有效的数值。",
    "selectLayerErrorString": "请选择要搜索的图层。",
    "invalidDefaultValue": "默认缓冲距离不能为空。请指定缓冲距离",
    "invalidMaximumValue": "最大缓冲距离不能为空。请指定缓冲距离",
    "defaultValueLessThanMax": "请在最大限制范围内指定默认缓冲距离",
    "defaultBufferValueGreaterThanZero": "请指定大于 0 的默认缓冲距离",
    "maximumBufferValueGreaterThanZero": "请指定大于 0 的最大缓冲距离"
  },
  "symbolPickerPreviewText": "预览:"
});