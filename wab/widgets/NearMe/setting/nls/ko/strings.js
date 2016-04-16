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
        displayText: "Miles",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilometers",
        acronym: "km"
      },
      feet: {
        displayText: "Feet",
        acronym: "ft"
      },
      meters: {
        displayText: "Meters",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "검색 설정", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "기본 버퍼 거리 값 설정", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "피처 찾기를 위해 최대 버퍼 거리 값 설정", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "버퍼 거리 단위", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "힌트: 버퍼의 기본 값을 설정하는 데 사용", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "힌트: 버퍼의 최대 값을 설정하는 데 사용", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "힌트: 버퍼 생성을 위한 단위 정의", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "주소 또는 위치 심볼", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "힌트: 검색한 주소 또는 클릭한 위치의 심볼", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "검색 결과의 글꼴 색상 선택", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "힌트: 검색 결과의 글꼴 색상" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "검색 레이어 선택", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "힌트: 설정 버튼을 사용하여 레이어 선택", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "설정", //Shown as a button text to add the layer for search
      okButton: "확인", // shown as a button text for layer selector popup
      cancelButton: "취소" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "길찾기 설정", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "경로 서비스", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "이동 모드 서비스", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "설정", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "힌트: 경로 서비스를 찾아 선택하려면 \'설정\'을 클릭하세요.", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "길찾기 길이 단위", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "힌트: 경로의 단위를 나타내는 데 사용됨", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "경로를 나타낼 심볼 선택", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "힌트: 경로에 대한 라인 심볼을 나타내는 데 사용됨", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "힌트: 이동 모드 서비스를 찾아 선택하려면 \'설정\'을 클릭하세요.", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "올바른 이동 모드 서비스를 지정하세요. ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "길찾기를 활성화하려면 ArcGIS Online 항목에서 경로 서비스가 활성화되어 있어야 합니다." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "ArcGIS Online에서 추가", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "서비스 URL 추가", // shown as a label in route service configuration panel to add service url
      routeURL: "경로 URL", // shown as a label in route service configuration panel
      validateRouteURL: "유효성 검사", // shown as a button text in route service configuration panel to validate url
      exampleText: "예시", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "확인", // shown as a button text for route service configuration panel
      cancelButton: "취소", // shown as a button text for route service configuration panel
      nextButton: "다음", // shown as a button text for route service configuration panel
      backButton: "뒤로", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "올바른 경로 서비스를 지정하세요." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "올바른 숫자 값을 입력하세요.", // shown as an error label in text box for buffer
      selectLayerErrorString: "검색할 레이어를 선택하세요.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "기본 버퍼 거리는 비워 둘 수 없습니다. 버퍼 거리를 지정하세요.", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "최대 버퍼 거리는 비워 둘 수 없습니다. 버퍼 거리를 지정하세요.", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "기본 버퍼 거리를 최대 한도 내로 지정하세요.", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "기본 버퍼 거리를 0보다 크게 지정하세요.", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "최대 버퍼 거리를 0보다 크게 지정하세요." // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "미리 보기:"
  })
);