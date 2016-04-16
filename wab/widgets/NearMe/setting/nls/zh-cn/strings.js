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
        displayText: "千米",
        acronym: "km"
      },
      feet: {
        displayText: "英尺",
        acronym: "ft"
      },
      meters: {
        displayText: "米",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "搜索设置", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "设置默认缓冲距离值", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "设置最大缓冲距离值以查找要素", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "缓冲距离单位", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "提示: 用于设置默认缓冲值", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "提示: 用于设置最大缓冲值", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "提示: 为创建缓冲定义单位", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "地址或位置符号", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "提示: 所搜索地址或所单击位置的符号", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "选择搜索结果的字体颜色", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "提示: 搜索结果的字体颜色" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "选择搜索图层", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "提示: 使用设置按钮选择图层", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "设置", //Shown as a button text to add the layer for search
      okButton: "确定", // shown as a button text for layer selector popup
      cancelButton: "取消" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "方向设置", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "路径服务", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "出行模式服务", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "设置", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "提示: 单击“设置”以浏览和选择路径服务", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "方向长度单位", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "提示: 用于显示路径单位", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "选择用于显示路径的符号", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "提示: 用于显示路径的线符号", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "提示: 单击“设置”以浏览和选择出行模式服务", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "请指定有效的出行模式服务 ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "要启用方向，请确保已在 ArcGIS Online 项目中启用路径。" // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "从 ArcGIS Online 添加", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "添加服务 URL", // shown as a label in route service configuration panel to add service url
      routeURL: "路径 URL", // shown as a label in route service configuration panel
      validateRouteURL: "验证", // shown as a button text in route service configuration panel to validate url
      exampleText: "示例", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "确定", // shown as a button text for route service configuration panel
      cancelButton: "取消", // shown as a button text for route service configuration panel
      nextButton: "前进", // shown as a button text for route service configuration panel
      backButton: "上一步", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "请指定有效的路径服务。" // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "请输入有效的数值。", // shown as an error label in text box for buffer
      selectLayerErrorString: "请选择要搜索的图层。", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "默认缓冲距离不能为空。请指定缓冲距离", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "最大缓冲距离不能为空。请指定缓冲距离", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "请在最大限制范围内指定默认缓冲距离", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "请指定大于 0 的默认缓冲距离", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "请指定大于 0 的最大缓冲距离" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "预览:"
  })
);