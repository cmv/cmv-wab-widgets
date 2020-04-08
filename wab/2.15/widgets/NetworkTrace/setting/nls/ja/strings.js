define({
  "taskUrl": "タスク URL",
  "setTask": "設定",
  "setTaskPopupTitle": "タスクの設定",
  "validate": "設定",
  "inValidGPService": "有効なジオプロセシング サービスを入力してください。",
  "noOutputParameterWithGeometryType": "選択したジオプロセシング サービスは、指定したジオメトリ タイプの出力パラメーターを少なくとも 1 つ持つ必要があります。 別のジオプロセシング サービスを選択してください。",
  "invalidOutputGeometry": "選択したジオプロセシング サービスの出力ジオメトリ タイプは、プロジェクト設定と互換性がありません。 ジオプロセシング サービスの結果を保存できません。",
  "GPFeatureRecordSetLayerERR": "'GPFeatureRecordSetLayer' タイプの入力のみを使用するジオプロセシング サービスを入力してください。",
  "invalidInputParameters": "入力パラメーターの数は 1 未満または 4 以上です。 有効なジオプロセシング サービスを入力してください。",
  "projectSetting": {
    "title": "プロジェクトの設定",
    "note": "注意: プロジェクトの設定はオプションです。構成すると、ユーザーがネットワーク停止エリアと入力パラメーターを使用してプロジェクトを目的の Web マップ レイヤーに格納できます。 ユーザーは [入力/出力] タブの [出力] グループから他の出力パラメーターを格納できます。",
    "projectPolygonLayer": "プロジェクト ポリゴン レイヤー",
    "outputParameterName": "出力パラメーター名",
    "projectPointLayer": "プロジェクト ポイント レイヤー",
    "selectLabel": "選択",
    "polygonLayerHelp": "<p>次の条件を満たすポリゴン レイヤーが表示されます:<br/><ul><li>レイヤーは編集機能 (つまり、作成、削除、更新) を持つ必要があります</li><li>レイヤーは、次の名前およびデータ タイプの 2 つのフィールドを持つ必要があります:</li><ul><li>name (文字列タイプ フィールド)</li><li>globalid (GlobalID タイプ フィールド)</li></ul></ul><p/>",
    "outputParameterHelp": "<p>タスク URL からの出力ポリゴン レイヤーが表示されます<p/>",
    "pointLayerHelp": "<p>次の条件を満たすポイント レイヤーが表示されます:<br/><ul><li>レイヤーは編集機能 (つまり、作成、削除、更新) を持つ必要があります</li><li>レイヤーは、次の名前およびデータ タイプの 2 つのフィールドを持つ必要があります:</li><ul><li>inputtype (文字列タイプ フィールド)</li><li>projectid (GUID タイプ フィールド)</li></ul></ul><p/>"
  },
  "inputOutputTab": {
    "flag": "フラグ",
    "barrier": "バリア",
    "skip": "スキップ",
    "title": "入力/出力",
    "inputSettingsLabel": "入力設定",
    "outputSettingsLabel": "出力設定",
    "inputLabel": "ラベル",
    "inputTooltip": "ツールチップ",
    "symbol": "シンボル",
    "typeText": "種類",
    "outputParametersText": "出力パラメータ",
    "saveToLayerText": "レイヤーに保存 (オプション)",
    "skipText": "スキップ可能",
    "visibilityText": "可視",
    "exportToCsvText": "CSV にエクスポート",
    "exportToCsvDisplayText": "CSV",
    "settitngstext": "設定",
    "addFieldTitle": "フィールドの追加",
    "enterDisplayText": "表示テキストの入力",
    "setScale": "縮尺の設定",
    "outputDisplay": "表示テキスト",
    "saveToLayerHelp": "<p>次の条件を満たすレイヤーが表示されます:<br/><ul><li>レイヤーは編集機能 (つまり、作成、削除、更新) を持つ必要があります</li><li>レイヤーは、次の名前およびデータ タイプの 2 つのフィールドを持つ必要があります:</li><ul><li>parametername (文字列タイプ フィールド)</li><li>projectid (Guid タイプ フィールド)</li></ul></ul><p/>"
  },
  "summaryTab": {
    "title": "一般設定",
    "summaryFieldsetText": "サマリー設定",
    "inputOutput": "入力/出力",
    "field": "フィールド",
    "operator": "演算子",
    "inputOperatorCountOption": "数",
    "outputOperatorCountOption": "数",
    "outputOperatorSkipCountOption": "スキップ数",
    "fieldOperatorSumOption": "合計",
    "fieldOperatorMinOption": "最小",
    "fieldOperatorMaxOption": "最大",
    "fieldOperatorMeanOption": "中央値",
    "expressionAddButtonText": "追加",
    "expressionVerifyButtonText": "確認",
    "summaryEditorText": "サマリー テキスト",
    "autoZoomAfterTrace": "その他のオプション",
    "zoomText": "トレース後に自動ズーム",
    "summarSettingTooltipText": "入力数/出力数の追加"
  },
  "validationErrorMessage": {
    "webMapError": "Web マップに利用できるレイヤーがありません。 有効な Web マップを選択してください。",
    "inputTypeFlagGreaterThanError": "フラグ タイプの入力は複数使用できません。",
    "inputTypeFlagLessThanError": "フラグ タイプの入力が少なくとも 1 つ必要です。",
    "inputTypeBarrierErr": "バリア タイプの入力は複数使用できません。",
    "inputTypeSkipErr": "スキップ タイプの入力は複数使用できません。",
    "displayTextForButtonError": "[実行] ボタンの表示テキストは空白にできません。",
    "UnableToLoadGeoprocessError": "ジオプロセシング サービスを読み込めません。",
    "invalidSummaryExpression": "無効な式です。",
    "validSummaryExpression": "成功です。",
    "invalidProjectSettings": "無効なプロジェクト設定です。<br/> '${projectSetting}' で有効な値を選択してください。"
  },
  "hintText": {
    "labelTextHint": "ヒント: 出力パラメーターの結果パネルの表示ラベルを提供します。",
    "displayTextHint": "ヒント: これは、この出力パラメーターの詳細パネル内に表示されます。",
    "inputTextHint": "ヒント: 入力、出力、フィールド名を選択して、上の条件式を作成します。",
    "expressionHint": "ヒント: アイテムを選択し、[追加] をクリックして条件式を作成します。"
  }
});