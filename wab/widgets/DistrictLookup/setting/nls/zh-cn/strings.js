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
      kilometers: "千米", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "英尺", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "米" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "搜索设置", // shown as a label in config UI dialog box for layer setting
      buttonSet: "设置", // shown as a button text to set layers
      selectLayersLabel: "选择图层",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "提示: 用于选择面图层及其相关点图层。", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "选择用于高亮显示面的符号", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "地址或位置符号", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "提示: 所搜索地址或所单击位置的符号", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "提示: 用于显示所选面的符号" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "确定", // shown as a button text for layerSelector configuration panel
      cancelButton: "取消", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "选择面图层", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "提示: 用于选择面图层。", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "选择与面图层相关的点图层", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "提示: 用于选择与面图层相关的点图层", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "请选择具有相关点图层的面图层。", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "请选择具有相关点图层的面图层。", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "请选择与面图层相关的点图层。" // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "方向设置", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "路径服务", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "出行模式服务", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "设置", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "提示: 单击“设置”以浏览和选择网络分析路径服务", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "方向长度单位", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "提示: 用于显示报告的路径单位", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "选择用于显示路径的符号", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "提示: 用于显示路径的线符号", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "提示: 单击“设置”以浏览和选择出行模式服务", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "请指定有效的出行模式服务", // shown as an error label in alert box when invalid travel mode service url is configured
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
    symbolPickerPreviewText: "预览:"
  })
);