///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
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
    "standardUnit": "标准单位",
    "metricUnit": "公制单位"
  },
  "analysisTab": {
    "analysisTabLabel": "分析",
    "selectAnalysisLayerLabel": "选择分析图层",
    "addLayerLabel": "添加图层",
    "noValidLayersForAnalysis": "所选 webmap 中未找到有效的图层。",
    "noValidFieldsForAnalysis": "所选 webmap 中未找到有效的值。请移除所选图层。",
    "addLayersHintText": "提示：选择用于在报表中分析和显示的字段",
    "addLayerNameTitle": "图层名称",
    "addFieldsLabel": "添加字段",
    "addFieldsPopupTitle": "选择字段",
    "addFieldsNameTitle": "字段名称",
    "aoiToolsLegendLabel": "AOI 工具",
    "aoiToolsDescriptionLabel": "启用工具以创建感兴趣区域并指定其标注",
    "placenameLabel": "地名",
    "drawToolsLabel": "绘图工具",
    "uploadShapeFileLabel": "上传 Shapefile",
    "coordinatesLabel": "坐标",
    "coordinatesDrpDwnHintText": "提示：选择单位以显示输入的导线",
    "coordinatesBearingDrpDwnHintText": "提示：选择方位角以显示输入的导线",
    "allowShapefilesUploadLabel": "允许上传 shapefile 以进行分析",
    "areaUnitsLabel": "显示面积/长度，单位为",
    "allowShapefilesUploadLabelHintText": "提示：在报告选项卡中显示“在分析中上传 shapefile”",
    "maxFeatureForAnalysisLabel": "分析的最大要素数",
    "maxFeatureForAnalysisHintText": "提示：设置用于分析的最大要素数",
    "searchToleranceLabelText": "搜索容差(英尺)",
    "searchToleranceHint": "提示：搜索容差仅在分析点和线输入时使用",
    "placenameButtonText": "地名",
    "drawToolsButtonText": "绘制",
    "shapefileButtonText": "Shapefile",
    "coordinatesButtonText": "坐标"
  },
  "downloadTab": {
    "downloadLegend": "下载设置",
    "reportLegend": "报表设置",
    "downloadTabLabel": "下载",
    "syncEnableOptionLabel": "要素图层",
    "syncEnableOptionHint": "提示：用于以指示格式下载与感兴趣区域相交要素的要素信息。",
    "syncEnableOptionNote": "注意：文件地理数据库选项需要启用了同步的要素服务。",
    "extractDataTaskOptionLabel": "提取数据任务地理处理服务",
    "extractDataTaskOptionHint": "提示：使用发布的提取数据任务地理处理服务以文件地理库或 Shapefile 格式下载与感兴趣区域相交的要素。",
    "cannotDownloadOptionLabel": "禁用下载",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "图层名称",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "文件地理数据库",
      "allowDownloadLabel": "允许下载"
    },
    "setButtonLabel": "设置",
    "GPTaskLabel": "指定地理处理服务的 URL",
    "printGPServiceLabel": "打印服务 URL",
    "setGPTaskTitle": "指定所需地理处理服务 URL",
    "logoLabel": "徽标",
    "logoChooserHint": "提示：单击图像图标可更改图像",
    "footnoteLabel": "脚注",
    "columnTitleColorPickerLabel": "列标题的颜色",
    "reportTitleLabel": "报表标题",
    "errorMessages": {
      "invalidGPTaskURL": "地理处理服务无效。请选择包含提取数据任务的地理处理服务。",
      "noExtractDataTaskURL": "请选择任意包含提取数据任务的地理处理服务。"
    }
  },
  "generalTab": {
    "generalTabLabel": "常规",
    "tabLabelsLegend": "面板标注",
    "tabLabelsHint": "提示：指定标注",
    "AOITabLabel": "感兴趣区域面板",
    "ReportTabLabel": "报表面板",
    "bufferSettingsLegend": "缓冲区设置",
    "defaultBufferDistanceLabel": "默认缓冲区距离",
    "defaultBufferUnitsLabel": "缓冲区单位",
    "generalBufferSymbologyHint": "提示：设置用于显示定义感兴趣区域周围缓冲区的符号系统",
    "aoiGraphicsSymbologyLegend": "感兴趣区域图形符号系统",
    "aoiGraphicsSymbologyHint": "提示：设置定义点、线和感兴趣面区域期间使用的符号系统",
    "pointSymbologyLabel": "点",
    "previewLabel": "预览",
    "lineSymbologyLabel": "线",
    "polygonSymbologyLabel": "面",
    "aoiBufferSymbologyLabel": "缓冲区符号系统",
    "pointSymbolChooserPopupTitle": "地址或位置符号",
    "polygonSymbolChooserPopupTitle": "选择用于高亮显示面的符号",
    "lineSymbolChooserPopupTitle": "选择高亮显示线的符号",
    "aoiSymbolChooserPopupTitle": "设置缓冲符号",
    "aoiTabText": "AOI",
    "reportTabText": "报告"
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "搜索源设置",
    "searchSourceSettingTitle": "搜索源设置",
    "searchSourceSettingTitleHintText": "添加并将地理编码服务或要素图层配置为搜索源。这些指定的源决定了搜索框中的可搜索内容",
    "addSearchSourceLabel": "添加搜索源",
    "featureLayerLabel": "要素图层",
    "geocoderLabel": "地理编码器",
    "generalSettingLabel": "常规设置",
    "allPlaceholderLabel": "用于搜索全部内容的占位符文本：",
    "allPlaceholderHintText": "提示：搜索所有图层和 geocoder 时请输入要显示为占位符的文本",
    "generalSettingCheckboxLabel": "显示已找到要素或位置的弹出窗口",
    "countryCode": "国家或区域代码",
    "countryCodeEg": "例如 ",
    "countryCodeHint": "将此值留空可搜索所有国家和地区",
    "questionMark": "?",
    "searchInCurrentMapExtent": "仅在当前地图范围内搜索",
    "zoomScale": "缩放比例",
    "locatorUrl": "地理编码器 URL",
    "locatorName": "地理编码器名称",
    "locatorExample": "示例",
    "locatorWarning": "不支持此版本的地理编码服务。该微件支持 10.0 及更高版本的地理编码服务。",
    "locatorTips": "由于地理编码服务不支持建议功能，因此建议不可用。",
    "layerSource": "图层源",
    "setLayerSource": "设置图层源",
    "setGeocoderURL": "设置地理编码器 URL",
    "searchLayerTips": "由于要素服务不支持分页功能，因此建议不可用。",
    "placeholder": "占位符文本",
    "searchFields": "搜索字段",
    "displayField": "显示字段",
    "exactMatch": "完全匹配",
    "maxSuggestions": "最大建议数",
    "maxResults": "最大结果数",
    "enableLocalSearch": "启用本地搜索",
    "minScale": "最小比例",
    "minScaleHint": "如果地图比例大于此比例，将使用本地搜索",
    "radius": "半径",
    "radiusHint": "指定以当前地图中心为中心的区域半径，用于提升地理编码候选项的等级，以便先返回距离位置最近的候选项",
    "setSearchFields": "设置搜索字段",
    "set": "设置",
    "invalidUrlTip": "URL ${URL} 无效或不可访问。",
    "invalidSearchSources": "搜索源设置无效"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "请填写必填字段",
    "bufferDistanceFieldsErrorMsg": "请输入有效值",
    "invalidSearchToleranceErrorMsg": "请为搜索容差输入有效值",
    "atLeastOneCheckboxCheckedErrorMsg": "配置无效",
    "noLayerAvailableErrorMsg": "无可用图层",
    "layerNotSupportedErrorMsg": "不支持 ",
    "noFieldSelected": "请使用编辑操作选择用于分析的字段。",
    "duplicateFieldsLabels": "对“${itemNames}”添加了重复的标注“${labelText}”",
    "noLayerSelected": "请至少选择一个图层进行分析",
    "errorInSelectingLayer": "无法完成选择图层的操作。请重试。",
    "errorInMaxFeatureCount": "请输入用于分析的有效最大要素数。"
  }
});