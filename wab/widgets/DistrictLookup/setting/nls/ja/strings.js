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
    "miles": "マイル",
    "kilometers": "キロメートル",
    "feet": "フィート",
    "meters": "メートル"
  },
  "layerSetting": {
    "layerSettingTabTitle": "検索設定",
    "buttonSet": "設定",
    "selectLayersLabel": "レイヤーの選択",
    "selectLayersHintText": "ヒント: ポリゴン レイヤーおよびそれに関連するポイント レイヤーの選択に使用されます。",
    "selectPrecinctSymbolLabel": "シンボルを選択してポリゴンをハイライト表示します",
    "selectGraphicLocationSymbol": "住所または位置のシンボル",
    "graphicLocationSymbolHintText": "ヒント: 検索した住所またはクリックした位置のシンボル",
    "precinctSymbolHintText": "ヒント: 選択したポリゴンのシンボルの表示に使用されます",
    "selectColorForPoint": "ポイントをハイライト表示する色を選択",
    "selectColorForPointHintText": "ヒント: 選択したポイントのハイライト色の表示に使用されます"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "ポリゴン レイヤーの選択",
    "selectPolygonLayerHintText": "ヒント: ポリゴン レイヤーの選択に使用されます。",
    "selectRelatedPointLayerLabel": "ポリゴン レイヤーに関連するポイント レイヤーの選択",
    "selectRelatedPointLayerHintText": "ヒント: ポリゴン レイヤーに関連するポイント レイヤーの選択に使用されます",
    "polygonLayerNotHavingRelatedLayer": "関連するポイント レイヤーがあるポリゴン レイヤーを選択してください。",
    "errorInSelectingPolygonLayer": "関連するポイント レイヤーがあるポリゴン レイヤーを選択してください。",
    "errorInSelectingRelatedLayer": "ポリゴン レイヤーに関連するポイント レイヤーを選択してください。"
  },
  "routeSetting": {
    "routeSettingTabTitle": "ルート案内設定",
    "routeServiceUrl": "ルート サービス",
    "buttonSet": "設定",
    "routeServiceUrlHintText": "ヒント: [設定] をクリックし、ネットワーク解析ルート サービスを参照して選択します",
    "directionLengthUnit": "ルート案内の長さの単位",
    "unitsForRouteHintText": "ヒント: レポートされるルートの単位の表示に使用されます",
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
  "symbolPickerPreviewText": "プレビュー:"
});