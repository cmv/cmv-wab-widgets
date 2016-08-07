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
    "miles": "Miles",
    "kilometers": "Kilometers",
    "feet": "Feet",
    "meters": "Meters"
  },
  "layerSetting": {
    "layerSettingTabTitle": "검색 설정",
    "buttonSet": "설정",
    "selectLayersLabel": "레이어 선택",
    "selectLayersHintText": "힌트: 폴리곤 레이어와 관련 포인트 레이어를 선택하는 데 사용됩니다.",
    "selectPrecinctSymbolLabel": "폴리곤을 강조 표시할 심볼 선택",
    "selectGraphicLocationSymbol": "주소 또는 위치 심볼",
    "graphicLocationSymbolHintText": "힌트: 검색한 주소 또는 클릭한 위치의 심볼",
    "precinctSymbolHintText": "힌트: 선택한 폴리곤의 심볼을 나타내는 데 사용됨",
    "selectColorForPoint": "포인트를 강조 표시할 색 선택",
    "selectColorForPointHintText": "힌트: 선택한 포인트에 강조 표시색을 표시하는 데 사용됨"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "폴리곤 레이어 선택",
    "selectPolygonLayerHintText": "힌트: 폴리곤 레이어를 선택하는 데 사용됩니다.",
    "selectRelatedPointLayerLabel": "폴리곤 레이어와 관련된 포인트 레이어 선택",
    "selectRelatedPointLayerHintText": "힌트: 폴리곤 레이어와 관련된 포인트 레이어를 선택하는 데 사용됨",
    "polygonLayerNotHavingRelatedLayer": "관련된 포인트 레이어가 있는 폴리곤 레이어를 선택하세요.",
    "errorInSelectingPolygonLayer": "관련된 포인트 레이어가 있는 폴리곤 레이어를 선택하세요.",
    "errorInSelectingRelatedLayer": "폴리곤 레이어와 관련된 포인트 레이어를 선택하세요."
  },
  "routeSetting": {
    "routeSettingTabTitle": "길찾기 설정",
    "routeServiceUrl": "경로 서비스",
    "buttonSet": "설정",
    "routeServiceUrlHintText": "힌트: 네트워크 분석 길찾기 서비스를 찾아 선택하려면 '설정'을 클릭하세요.",
    "directionLengthUnit": "길찾기 길이 단위",
    "unitsForRouteHintText": "힌트: 경로에 보고된 단위를 나타내는 데 사용됨",
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
  "symbolPickerPreviewText": "미리보기:"
});