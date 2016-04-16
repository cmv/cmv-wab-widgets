/*global define*/
define(
   ({
    _widgetLabel: "내 주변", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "맵 상의 주소 또는 위치를 검색함", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "검색 레이어가 제대로 구성되지 않음", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "${BufferDistance} ${BufferUnit} 내의 결과 보기", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "거리를 0보다 크게 지정하세요.", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "결과를 찾을 수 없음", //display error message if buffer gets failed to generate
    selectLocationToolTip: "포인트를 추가하려면 클릭", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "결과를 찾을 수 없음 ", //Shown as message if no features available in current buffer area
    attachmentHeader: "첨부 파일", //Shown as label on attachments header
    unableToFetchResults: "다음 레이어에서 결과를 가져올 수 없음:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "정보", //Shown as title for information tab
    directionTabTitle: "길찾기", //Shown as title for direction tab
    failedToGenerateRouteMsg: "경로를 생성하지 못했습니다.", //Shown as a message when fail to generate route
    geometryServicesNotFound: "지오메트리 서비스를 사용할 수 없습니다.", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "팝업이 구성되어 있지 않아 결과를 볼 수 없습니다." //Shown as a message when popups for all the layers are disabled
  })
);