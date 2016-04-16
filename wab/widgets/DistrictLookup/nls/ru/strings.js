/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Поиск адресов или поиск на карте", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "Щелкните, чтобы добавить точку", // Tooltip for location address button
    informationTabTitle: "Информация", // Shown as label on information tab
    directionTabTitle: "Маршруты", // Shown as label on direction tab
    invalidPolygonLayerMsg: "Полигональный слой не настроен правильно", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "Связанный точечный слой не настроен правильно", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "Для этого адреса или местоположения полигон не найден", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "Невозможно найти точку, связанную с этим полигоном", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "Вложения", //Shown as label on attachments header
    failedToGenerateRouteMsg: "Не удалось построить маршрут.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "Всплывающие окна не настроены, результат невозможно отобразить." //Shown as a message when popups for all the layers are disabled

  })
);