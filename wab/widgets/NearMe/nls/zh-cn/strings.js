/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "在地图上搜索地址或定位", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "未正确配置搜索图层", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "在 ${BufferDistance} ${BufferUnit} 内显示结果", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "请指定大于 0 的距离", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "无法找到结果", //display error message if buffer gets failed to generate
    selectLocationToolTip: "单击以添加点", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "未找到任何结果 ", //Shown as message if no features available in current buffer area
    attachmentHeader: "附件", //Shown as label on attachments header
    unableToFetchResults: "无法从图层获取结果:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "信息", //Shown as title for information tab
    directionTabTitle: "方向", //Shown as title for direction tab
    failedToGenerateRouteMsg: "无法生成路径。", //Shown as a message when fail to generate route
    geometryServicesNotFound: "几何服务不可用。", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "未配置弹出窗口，无法显示结果。" //Shown as a message when popups for all the layers are disabled
  })
);