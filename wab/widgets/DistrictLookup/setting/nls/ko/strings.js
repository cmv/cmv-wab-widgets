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
    units: {
      miles: "Miles", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometers", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Feet", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Meters" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "검색 설정", // shown as a label in config UI dialog box for layer setting
      buttonSet: "설정", // shown as a button text to set layers
      selectLayersLabel: "레이어 선택",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "힌트: 폴리곤 레이어와 관련 포인트 레이어를 선택하는 데 사용됩니다.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "폴리곤을 강조 표시할 심볼 선택", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "주소 또는 위치 심볼", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "힌트: 검색한 주소 또는 클릭한 위치의 심볼", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "힌트: 선택한 폴리곤의 심볼을 나타내는 데 사용됨" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "확인", // shown as a button text for layerSelector configuration panel
      cancelButton: "취소", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "폴리곤 레이어 선택", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "힌트: 폴리곤 레이어를 선택하는 데 사용됩니다.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "폴리곤 레이어와 관련된 포인트 레이어 선택", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "힌트: 폴리곤 레이어와 관련된 포인트 레이어를 선택하는 데 사용됨", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "관련된 포인트 레이어가 있는 폴리곤 레이어를 선택하세요.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "관련된 포인트 레이어가 있는 폴리곤 레이어를 선택하세요.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "폴리곤 레이어와 관련된 포인트 레이어를 선택하세요." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "길찾기 설정", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "경로 서비스", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "이동 모드 서비스", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "설정", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "힌트: 네트워크 분석 길찾기 서비스를 찾아 선택하려면 \'설정\'을 클릭하세요.", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "길찾기 길이 단위", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "힌트: 경로에 보고된 단위를 나타내는 데 사용됨", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "경로를 나타낼 심볼 선택", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "힌트: 경로에 대한 라인 심볼을 나타내는 데 사용됨", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "힌트: 이동 모드 서비스를 찾아 선택하려면 \'설정\'을 클릭하세요.", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "올바른 이동 모드 서비스를 지정하세요.", // shown as an error label in alert box when invalid travel mode service url is configured
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
    symbolPickerPreviewText: "미리 보기:"
  })
);