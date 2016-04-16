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
      miles: "マイル", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "キロメートル", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "フィート", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "メートル" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "検索設定", // shown as a label in config UI dialog box for layer setting
      buttonSet: "設定", // shown as a button text to set layers
      selectLayersLabel: "レイヤーの選択",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "ヒント: ポリゴン レイヤーおよびそれに関連するポイント レイヤーの選択に使用されます。", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "シンボルを選択してポリゴンをハイライト表示します", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "住所または位置のシンボル", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "ヒント: 検索した住所またはクリックした位置のシンボル", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "ヒント: 選択したポリゴンのシンボルの表示に使用されます" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "キャンセル", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "ポリゴン レイヤーの選択", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "ヒント: ポリゴン レイヤーの選択に使用されます。", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "ポリゴン レイヤーに関連するポイント レイヤーの選択", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "ヒント: ポリゴン レイヤーに関連するポイント レイヤーの選択に使用されます", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "関連するポイント レイヤーがあるポリゴン レイヤーを選択してください。", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "関連するポイント レイヤーがあるポリゴン レイヤーを選択してください。", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "ポリゴン レイヤーに関連するポイント レイヤーを選択してください。" // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "ルート案内設定", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "ルート サービス", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "移動モード サービス", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "設定", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "ヒント: [設定] をクリックし、ネットワーク解析ルート サービスを参照して選択します", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "ルート案内の長さの単位", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "ヒント: レポートされるルートの単位の表示に使用されます", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "ルートを表示するシンボルの選択", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "ヒント: ルートのライン シンボルの表示に使用されます", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "ヒント: [設定] をクリックし、移動モード サービスを参照して選択します", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "有効な移動モード サービスを指定してください", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "ルート案内を有効にするには、必ず ArcGIS Online アイテムでルート検索を有効にします。" // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "ArcGIS Online から追加", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "サービス URL の追加", // shown as a label in route service configuration panel to add service url
      routeURL: "ルート URL", // shown as a label in route service configuration panel
      validateRouteURL: "整合チェック", // shown as a button text in route service configuration panel to validate url
      exampleText: "例", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "キャンセル", // shown as a button text for route service configuration panel
      nextButton: "次へ", // shown as a button text for route service configuration panel
      backButton: "戻る", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "有効なルート サービスを指定してください。" // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "プレビュー:"
  })
);