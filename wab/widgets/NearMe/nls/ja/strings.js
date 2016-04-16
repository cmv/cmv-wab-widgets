/*global define*/
define(
   ({
    _widgetLabel: "NearMe", // widget label shown on the choose widget dialog and widget panel title
    searchHeaderText: "住所を検索するか、マップ上で位置を特定します", // Shown as a label in widget panel for search an address.
    invalidSearchLayerMsg: "検索レイヤーが適切に構成されていません", // Shown as a message when the configured search layer is invalid or no layer is configured
    bufferSliderText: "${BufferDistance} ${BufferUnit} の範囲内の結果を表示します", // Shown as a label for slider to display the result in buffer area.
    bufferSliderValueString: "0 より大きい距離を指定してください", // Shown as a error when Buffer slider is set to zero distance in alert box.
    unableToCreateBuffer: "結果が見つかりませんでした", //display error message if buffer gets failed to generate
    selectLocationToolTip: "クリックしてポイントを追加します", //Shown as tooltip when select location button is clicked
    noFeatureFoundText: "結果が見つかりませんでした ", //Shown as message if no features available in current buffer area
    attachmentHeader: "添付ファイル", //Shown as label on attachments header
    unableToFetchResults: "結果をレイヤーから取得できません:", //shown as message if any layer is failed to fetch the results
    informationTabTitle: "情報", //Shown as title for information tab
    directionTabTitle: "方向", //Shown as title for direction tab
    failedToGenerateRouteMsg: "ルートを生成できませんでした。", //Shown as a message when fail to generate route
    geometryServicesNotFound: "ジオメトリ サービスを利用できません。", //Shown as a message when fail to get geometry service
    allPopupsDisabledMsg: "ポップアップが構成されていないため、結果を表示できません。" //Shown as a message when popups for all the layers are disabled
  })
);