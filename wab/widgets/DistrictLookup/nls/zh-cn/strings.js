/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "在地图上搜索地址或定位", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "单击以添加点", // Tooltip for location address button
    informationTabTitle: "信息", // Shown as label on information tab
    directionTabTitle: "方向", // Shown as label on direction tab
    invalidPolygonLayerMsg: "未正确配置面图层", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "未正确配置相关点图层", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "未找到该地址或位置的面。", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "无法找到与面相关联的点", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "附件", //Shown as label on attachments header
    failedToGenerateRouteMsg: "无法生成路径。", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "未配置弹出窗口，无法显示结果。" //Shown as a message when popups for all the layers are disabled

  })
);