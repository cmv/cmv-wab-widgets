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
define({
  "units": {
    "miles": {
      "displayText": "Miles",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilometers",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Feet",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Meters",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "검색 설정",
    "defaultBufferDistanceLabel": "기본 버퍼 거리 설정",
    "maxBufferDistanceLabel": "최대 버퍼 거리 설정",
    "bufferDistanceUnitLabel": "버퍼 거리 단위",
    "defaultBufferHintLabel": "힌트: 버퍼 슬라이더에 대한 기본값 설정",
    "maxBufferHintLabel": "힌트: 버퍼 슬라이더에 대한 최대값 설정",
    "bufferUnitLabel": "힌트: 버퍼 생성을 위한 단위 정의",
    "selectGraphicLocationSymbol": "주소 또는 위치 심볼",
    "graphicLocationSymbolHintText": "힌트: 검색한 주소 또는 클릭한 위치의 심볼",
    "fontColorLabel": "검색 결과의 글꼴 색상 선택",
    "fontColorHintText": "힌트: 검색 결과의 글꼴 색상",
    "zoomToSelectedFeature": "선택한 피처로 확대/축소",
    "zoomToSelectedFeatureHintText": "힌트: 버퍼 대신 선택한 피처로 확대/축소",
    "intersectSearchLocation": "교차 폴리곤 반환",
    "intersectSearchLocationHintText": "힌트: 버퍼 내 폴리곤이 아닌 검색된 위치를 포함하는 폴리곤 반환",
    "bufferVisibilityLabel": "버퍼 가시성 설정",
    "bufferVisibilityHintText": "힌트: 버퍼가 맵에 표시됨",
    "bufferColorLabel": "버퍼 심볼 설정",
    "bufferColorHintText": "힌트: 버퍼의 색상 및 투명도 선택",
    "searchLayerResultLabel": "선택한 레이어 결과만 그리기",
    "searchLayerResultHint": "힌트: 검색 결과에서 선택한 레이어만 맵에 그려짐"
  },
  "layerSelector": {
    "selectLayerLabel": "검색 레이어 선택",
    "layerSelectionHint": "힌트: 설정 버튼을 사용하여 레이어 선택",
    "addLayerButton": "설정"
  },
  "routeSetting": {
    "routeSettingTabTitle": "길찾기 설정",
    "routeServiceUrl": "경로 서비스",
    "buttonSet": "설정",
    "routeServiceUrlHintText": "힌트: 경로 지정 서비스를 검색하고 선택하려면 â€˜Setâ€™ 클릭",
    "directionLengthUnit": "길찾기 길이 단위",
    "unitsForRouteHintText": "힌트: 경로의 단위를 나타내는 데 사용됨",
    "selectRouteSymbol": "경로를 나타낼 심볼 선택",
    "routeSymbolHintText": "힌트: 경로에 대한 라인 심볼을 나타내는 데 사용됨",
    "routingDisabledMsg": "길찾기를 활성화하려면 ArcGIS Online 항목에서 경로 서비스가 활성화되어 있어야 합니다."
  },
  "networkServiceChooser": {
    "arcgislabel": "ArcGIS Online에서 추가",
    "serviceURLabel": "서비스 URL 추가",
    "routeURL": "경로 URL",
    "validateRouteURL": "유효성 검사",
    "exampleText": "예시",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "올바른 경로 서비스를 지정하세요.",
    "rateLimitExceeded": "속도 제한이 초과되었습니다. 나중에 다시 시도하세요.",
    "errorInvokingService": "사용자 이름 또는 비밀번호가 올바르지 않습니다."
  },
  "errorStrings": {
    "bufferErrorString": "올바른 숫자 값을 입력하세요.",
    "selectLayerErrorString": "검색할 레이어를 선택하세요.",
    "invalidDefaultValue": "기본 버퍼 거리는 비워 둘 수 없습니다. 버퍼 거리를 지정하세요.",
    "invalidMaximumValue": "최대 버퍼 거리는 비워 둘 수 없습니다. 버퍼 거리를 지정하세요.",
    "defaultValueLessThanMax": "기본 버퍼 거리를 최대 한도 내로 지정하세요.",
    "defaultBufferValueGreaterThanZero": "기본 버퍼 거리를 0보다 크게 지정하세요.",
    "maximumBufferValueGreaterThanZero": "최대 버퍼 거리를 0보다 크게 지정하세요."
  },
  "symbolPickerPreviewText": "미리 보기:"
});