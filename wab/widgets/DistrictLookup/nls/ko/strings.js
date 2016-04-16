/*global define*/
define(
   ({
    _widgetLabel: "디스트릭트룩업", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "맵 상의 주소 또는 위치를 검색함", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "포인트를 추가하려면 클릭", // Tooltip for location address button
    informationTabTitle: "정보", // Shown as label on information tab
    directionTabTitle: "길찾기", // Shown as label on direction tab
    invalidPolygonLayerMsg: "폴리곤 레이어가 제대로 구성되지 않음", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "릴레이트 포인트 레이어가 제대로 구성되지 않음", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "이 주소나 위치에 대한 폴리곤이 없음", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "폴리곤과 연관된 포인트를 찾을 수 없음", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "첨부 파일", //Shown as label on attachments header
    failedToGenerateRouteMsg: "경로를 생성하지 못했습니다.", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "팝업이 구성되어 있지 않아 결과를 볼 수 없습니다." //Shown as a message when popups for all the layers are disabled

  })
);