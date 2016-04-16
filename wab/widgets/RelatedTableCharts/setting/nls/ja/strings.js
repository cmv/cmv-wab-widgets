define(
   ({

    chartSettingLabel: "チャート設定",  //shown as a label in config UI dialog box.
    addNewLabel: "新規追加", //shown as a button text to add layers.
    generalSettingLabel: "一般設定", //shown as a button text to general settings button.

    layerChooser: {
      title: "チャートを作成するレイヤーの選択", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "レイヤーの選択", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "ヒント: 複数のチャートを構成する場合、各レイヤーのジオメトリ タイプが同じである必要があります", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "レイヤーに関連するテーブルの選択", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "ヒント: 数値フィールドを含んでいるテーブルのみが表示されます", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "関連するポイント レイヤーがあるレイヤーを選択してください。", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "レイヤーに関連する有効なテーブル/レイヤーを選択してください。", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "選択したレイヤーには、関連するテーブル/レイヤーがありません。", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "OK", //shown as a button text.
      cancelButton: "キャンセル" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "セクション タイトル", // shown as a label in config UI dialog box.
      sectionTitleHintText: "ヒント: セクションのヘッダー タイトルに表示されます", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "チャートのタイトル", // shown as a label in config UI dialog box.
      chartTitleHintText: "ヒント: チャートの上部の中央に表示されます", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "説明", // shown as a label in cofig UI.
      chartDescriptionHintText: "ヒント: チャートの下に表示されます", // shown as a hint text in config UI dialog box.
      chartType: "チャート タイプ", // shown as a label which shows type of chart.
      barChart: "バー チャート", // shown as a label for bar chart radio button.
      pieChart: "パイ チャート", // shown as a label for pie chart radio button.
      dataSeriesField: "データ シリーズ フィールド", // shown as a label for selecting data series set.
      labelField: "ラベル フィールド", // shown as a label for selecting label field set.
      chartColor: "チャートの色", // shown as a label which shows color for chart.
      singleColor: "単一色", // shown as a label for single color radio button.
      colorByTheme: "テーマ別の色", // shown as a label for color by theme radio button.
      colorByFieldValue: "フィールド値別の色", // shown as a label for color by field value radio button.
      xAxisTitle: "X 軸のタイトル", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "ヒント: X 軸のタイトル", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y 軸のタイトル", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "ヒント: Y 軸のタイトル", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "ラベル", // shown as a header in table.
      fieldColorColor: "色", // shown as a header in table.
      defaultFieldSelectLabel: "選択", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "選択したフィールドの値を検索できません", // shown as an error in alert box.
      errMsgSectionTitle: "セクション タイトルを入力してください", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "フィールド値を選択してください", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "設定", // shown as a label of tab in config UI
      layoutTabTitle: "レイアウト" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "一般設定", // shown as a label of general setting legend.
      locationSymbolLabel: "グラフィックス位置シンボル", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "ヒント: 住所のシンボルの表示および位置のクリックに使用されます", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "更新間隔", // shown as a label of refresh interval.
      refreshIntervalHintText: "ヒント: この間隔に基づいてチャートが更新されます。1 ～ 1440 分の範囲内の値を指定します。", // shown as an error for refresh interval.
      errMsgRefreshInterval: "0 ～ 1440 分の範囲内の更新間隔を指定してください",  // shown as an error message.
      symbolPickerPreviewText: "プレビュー:"
    }
  })
);
