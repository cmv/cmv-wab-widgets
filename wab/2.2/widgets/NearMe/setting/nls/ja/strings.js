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
      "displayText": "マイル",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "キロメートル",
      "acronym": "km"
    },
    "feet": {
      "displayText": "フィート",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "メートル",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "検索設定",
    "defaultBufferDistanceLabel": "デフォルトのバッファー距離の設定",
    "maxBufferDistanceLabel": "最大バッファー距離の設定",
    "bufferDistanceUnitLabel": "バッファーの距離単位",
    "defaultBufferHintLabel": "ヒント: バッファー スライダーのデフォルト値を設定します",
    "maxBufferHintLabel": "ヒント: バッファー スライダーの最大値を設定します",
    "bufferUnitLabel": "ヒント: バッファーを作成するための単位を定義します",
    "selectGraphicLocationSymbol": "住所または位置のシンボル",
    "graphicLocationSymbolHintText": "ヒント: 検索した住所またはクリックした位置のシンボル",
    "fontColorLabel": "検索結果のフォントの色の選択",
    "fontColorHintText": "ヒント: 検索結果のフォントの色",
    "zoomToSelectedFeature": "選択フィーチャにズーム",
    "zoomToSelectedFeatureHintText": "ヒント: バッファーではなく選択フィーチャにズームします",
    "intersectSearchLocation": "交差するポリゴンを返す",
    "intersectSearchLocationHintText": "ヒント: バッファー内のポリゴンではなく、検索された位置を含むポリゴンを返します",
    "bufferVisibilityLabel": "バッファーの表示設定",
    "bufferVisibilityHintText": "ヒント: バッファーがマップに表示されます",
    "bufferColorLabel": "バッファー シンボルの設定",
    "bufferColorHintText": "ヒント: バッファーの色と透過表示を選択します",
    "searchLayerResultLabel": "選択したレイヤーの結果のみを描画",
    "searchLayerResultHint": "ヒント: 検索結果内で選択したレイヤーのみがマップに描画されます"
  },
  "layerSelector": {
    "selectLayerLabel": "検索レイヤーの選択",
    "layerSelectionHint": "ヒント: 設定ボタンを使用してレイヤーを選択します",
    "addLayerButton": "設定"
  },
  "routeSetting": {
    "routeSettingTabTitle": "ルート案内設定",
    "routeServiceUrl": "ルート サービス",
    "buttonSet": "設定",
    "routeServiceUrlHintText": "ヒント: [設定] をクリックし、ルート サービスを参照して選択します",
    "directionLengthUnit": "ルート案内の長さの単位",
    "unitsForRouteHintText": "ヒント: ルートの単位の表示に使用されます",
    "selectRouteSymbol": "ルートを表示するシンボルの選択",
    "routeSymbolHintText": "ヒント: ルートのライン シンボルの表示に使用されます",
    "routingDisabledMsg": "ルート案内を有効にするには、必ず ArcGIS Online アイテムでルート検索を有効にします。"
  },
  "networkServiceChooser": {
    "arcgislabel": "ArcGIS Online から追加",
    "serviceURLabel": "サービス URL の追加",
    "routeURL": "ルート URL",
    "validateRouteURL": "整合チェック",
    "exampleText": "例",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "有効なルート サービスを指定してください。",
    "rateLimitExceeded": "評価制限を超えました。後でもう一度やり直してください。",
    "errorInvokingService": "ユーザー名またはパスワードが正しくありません。"
  },
  "errorStrings": {
    "bufferErrorString": "有効な数値を入力してください。",
    "selectLayerErrorString": "検索するレイヤーを選択してください。",
    "invalidDefaultValue": "デフォルトのバッファー距離を空にすることはできません。バッファー距離を指定してください。",
    "invalidMaximumValue": "最大バッファー距離を空にすることはできません。バッファー距離を指定してください。",
    "defaultValueLessThanMax": "最大制限内のデフォルトのバッファー距離を指定してください",
    "defaultBufferValueGreaterThanZero": "0 より大きいデフォルトのバッファー距離を指定してください",
    "maximumBufferValueGreaterThanZero": "0 より大きい最大バッファー距離を指定してください"
  },
  "symbolPickerPreviewText": "プレビュー:"
});