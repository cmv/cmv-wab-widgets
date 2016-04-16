/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "Поиск адресов или поиск на карте", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "Поиск слоев не настроен правильно", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "Показать результаты в пределах ${BufferDistance} ${BufferUnit}", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "Укажите расстояние больше 0", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "Невозможно найти результаты", //display error message if buffer gets failed to generate
    selectLocationToolTip: "Щелкните, чтобы добавить точку", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "Результаты не найдены ", //Shown as message if no features available in current buffer area
    attachmentHeader: "Вложения", //Shown as label on attachments header
    unableToFetchResults: "Невозможно получить результаты из слоев:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "Информация", //Shown as title for information tab
    directionTabTitle: "Направление", //Shown as title for direction tab
    failedToGenerateRouteMsg: "Не удалось построить маршрут.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "Сервис геометрии не доступен.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "Всплывающие окна не настроены, результат невозможно отобразить." //Shown as a message when popups for all the layers are disabled
  })
);