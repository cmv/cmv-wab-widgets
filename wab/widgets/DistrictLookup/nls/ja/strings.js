/*global define*/
define(
   ({
    _widgetLabel: "DistrictLookup", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "住所を検索するか、マップ上で位置を特定します", // Shown as a label in widget panel for search an address.
    mouseOverTooltip: "クリックしてポイントを追加します", // Tooltip for location address button
    informationTabTitle: "情報", // Shown as label on information tab
    directionTabTitle: "ルート案内", // Shown as label on direction tab
    invalidPolygonLayerMsg: "ポリゴン レイヤーが適切に構成されていません", // Shown as a message when the configured polygon layer is invalid or no layer is configured
    invalidRelatedPointLayerMsg: "関連するポイント レイヤーが適切に構成されていません", // Shown as a message when the configured related point layer is invalid or no layer is configured
    noPrecinctFoundMsg: "この住所または位置ではポリゴンが見つかりませんでした", // Shown as a message when precinct not found at the selected/searched location
    noPollingPlaceFoundMsg: "ポリゴンに関連付けられているポイントが見つかりませんでした", // Shown as a message when polling place not found for the selected/searched location
    attachmentHeader: "添付ファイル", //Shown as label on attachments header
    failedToGenerateRouteMsg: "ルートを生成できませんでした。", //Shown as a message when fail to generate route
    allPopupsDisabledMsg: "ポップアップが構成されていないため、結果を表示できません。" //Shown as a message when popups for all the layers are disabled

  })
);