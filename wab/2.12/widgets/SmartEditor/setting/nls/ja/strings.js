define({
  "layersPage": {
    "allLayers": "すべてのレイヤー",
    "title": "作成するフィーチャのテンプレートを選択",
    "generalSettings": "一般設定",
    "layerSettings": "レイヤー設定",
    "smartActionsTabTitle": "スマート アクション",
    "attributeActionsTabTitle": "属性アクション",
    "presetValueText": "プリセット値の定義",
    "geocoderSettingsText": "ジオコーダーの設定",
    "editDescription": "編集パネル用の表示テキストを入力",
    "editDescriptionTip": "このテキストは、[テンプレート] ピッカーの上に表示されます。テキストがない場合は、空白のままにしてください。",
    "promptOnSave": "フォームが閉じられたか、次のレコードに切り替えられた場合に、保存されていない編集内容を保存するよう促す",
    "promptOnSaveTip": "保存されていない編集内容が現在のフィーチャにある場合、ユーザーが [閉じる] をクリックするか、次の編集可能レコードに移動したときに、プロンプトを表示します。",
    "promptOnDelete": "レコードを削除する場合に確認を要求",
    "promptOnDeleteTip": "ユーザーが [削除] をクリックしたときに、操作の確認を求めるプロンプトを表示します。",
    "removeOnSave": "保存時に、選択セットからフィーチャを削除",
    "removeOnSaveTip": "レコードを保存するときにフィーチャを選択セットから削除するオプション。そのレコードが、選択されている唯一のレコードである場合、パネルはテンプレート ページに切り替わります。",
    "useFilterEditor": "フィーチャ テンプレート フィルターの使用",
    "useFilterEditorTip": "1 つのレイヤー テンプレートを表示したり、テンプレートを名前で検索するための機能を提供する [フィルター テンプレート] ピッカーを使用するオプション。",
    "displayShapeSelector": "描画オプションの表示",
    "createNewFeaturesFromExisting": "ユーザーが既存のフィーチャから新しいフィーチャを作成できるようにします",
    "createNewFeaturesFromExistingTip": "ユーザーが既存のフィーチャをコピーして新しいフィーチャを作成できるようにするオプション",
    "copiedFeaturesOverrideDefaults": "コピーされたフィーチャの値はデフォルトをオーバーライドします",
    "copiedFeaturesOverrideDefaultsTip": "コピーされたフィーチャの値によって、一致したフィールドのデフォルトのテンプレート値のみがオーバーライドされます",
    "displayShapeSelectorTip": "選択したテンプレートに関する有効な描画オプションのリストを表示するためのオプション。",
    "displayPresetTop": "設定済みの値のリストを上部に表示",
    "displayPresetTopTip": "設定済みの値のリストをテンプレート ピッカーの上に表示するためのオプション。",
    "listenToGroupFilter": "グループ フィルター ウィジェットのフィルター値を設定済みのフィールドに適用",
    "listenToGroupFilterTip": "グループ フィルター ウィジェットでフィルターが適用される場合は、設定済みの値のリスト内で一致するフィールドにその値を適用します。",
    "keepTemplateActive": "選択したテンプレートをアクティブのままにする",
    "keepTemplateActiveTip": "テンプレート ピッカーが表示されたときに、テンプレートが前回選択されている場合は、そのテンプレートを再選択します。",
    "geometryEditDefault": "デフォルトでジオメトリの編集を有効化",
    "autoSaveEdits": "自動的に新しいフィーチャを保存",
    "enableAttributeUpdates": "[ジオメトリの編集] がアクティブな場合に、属性アクションの更新ボタンを表示",
    "enableAutomaticAttributeUpdates": "ジオメトリの更新後に、自動的に属性アクションを呼び出す",
    "enableLockingMapNavigation": "マップ ナビゲーションのロックの有効化",
    "enableMovingSelectedFeatureToGPS": "選択したポイント フィーチャの GPS 位置への移動を有効化",
    "enableMovingSelectedFeatureToXY": "選択したポイント フィーチャの XY 位置への移動を有効化",
    "featureTemplateLegendLabel": "フィーチャ テンプレートおよびフィルター値の設定",
    "saveSettingsLegendLabel": "設定の保存",
    "geometrySettingsLegendLabel": "ジオメトリ設定",
    "buttonPositionsLabel": "[保存]、[削除]、[戻る]、および [選択の解除] ボタンの位置",
    "belowEditLabel": "編集フォームの下",
    "aboveEditLabel": "編集フォームの上",
    "layerSettingsTable": {
      "allowDelete": "削除の許可",
      "allowDeleteTip": "削除の許可 - ユーザーがフィーチャを削除することを許可するオプション。レイヤーが削除をサポートしていない場合は無効化されます。",
      "edit": "編集可能",
      "editTip": "編集可能 - レイヤーをウィジェットに含めるオプション",
      "label": "レイヤー",
      "labelTip": "レイヤー - マップで定義されているレイヤーの名前",
      "update": "ジオメトリの編集の無効化",
      "updateTip": "ジオメトリ編集の無効化 - 配置済みのジオメトリを移動したり、既存のフィーチャ上のジオメトリを移動するための機能を無効にするオプション",
      "allowUpdateOnly": "Update のみ",
      "allowUpdateOnlyTip": "更新のみ - 既存のフィーチャの変更のみを許可するオプション。デフォルトでオンになっており、レイヤーがフィーチャの新規作成をサポートしていない場合は無効化されます。",
      "fieldsTip": "編集対象のフィールドを変更し、スマート属性を定義します",
      "actionsTip": "アクション - フィールドを編集するか、関連レイヤー/テーブルにアクセスするオプション",
      "description": "説明",
      "descriptionTip": "説明 - 属性ページの上部に表示するテキストを入力するオプション。",
      "relationTip": "関連レイヤーとテーブルを表示します。"
    },
    "editFieldError": "フィールドの変更およびスマート属性は、編集不可のレイヤーでは使用できません",
    "noConfigedLayersError": "スマート エディターでは、編集可能なレイヤーが 1 つ以上必要です。",
    "toleranceErrorMsg": "無効なデフォルトの交差許容値"
  },
  "editDescriptionPage": {
    "title": "<b>${layername}</b> の属性概要テキストの定義 "
  },
  "fieldsPage": {
    "title": "<b>${layername}</b> のフィールドの構成",
    "copyActionTip": "属性アクション",
    "editActionTip": "スマート アクション",
    "description": "[アクション] 編集ボタンを使用して、レイヤー上のスマート属性を有効にします。スマート属性は、他のフィールドの値に基づいて、フィールドを要求したり、非表示にしたり、無効化することができます。[アクション] コピー ボタンを使用して、交点、アドレス、座標、プリセットによってフィールド値のソースを有効化して定義します。",
    "fieldsNotes": "* は必須フィールドです。このフィールドの [表示] をオフにし、フィールドの値が編集テンプレートから読み込まれていない場合、新しいレコードを保存できません。",
    "smartAttachmentText": "スマート アタッチメント アクションの構成",
    "smartAttachmentPopupTitle": "<b>${layername}</b> のスマート アタッチメントの構成",
    "fieldsSettingsTable": {
      "display": "表示",
      "displayTip": "表示 - フィールドが非表示かどうかを決定します",
      "edit": "編集可能",
      "editTip": "編集可能 - フィールドが属性フォーム内に存在する場合、オンにします",
      "fieldName": "名前",
      "fieldNameTip": "名前 - データベースで定義されたフィールド名",
      "fieldAlias": "エイリアス",
      "fieldAliasTip": "エイリアス - マップで定義されたフィールド名",
      "canPresetValue": "プリセット",
      "canPresetValueTip": "プリセット - フィールドをプリセット フィールド リストに表示し、ユーザーが値を編集する前に設定することを許可するオプション",
      "actions": "アクション",
      "actionsTip": "アクション - フィールドの順序を変更し、スマート属性を設定します"
    },
    "smartAttSupport": "スマート属性は、必須データベース フィールドではサポートされていません"
  },
  "actionPage": {
    "title": "<b>${fieldname}</b> の属性アクションの構成",
    "smartActionTitle": "<b>${fieldname}</b> のスマート属性のアクションの構成",
    "description": "アクションを始動する条件を指定しない限り、アクションは常にオフになります。アクションは順番に処理され、1 つのフィールドにつき 1 つのアクションのみが始動します。条件を定義するには、[条件編集] ボタンを使用します。",
    "copyAttributesNote": "グループ名を持つアクションを無効化することと、そのアクションを個別に編集することは同じです。このフィールドのアクションがそれぞれのグループから削除されます。",
    "actionsSettingsTable": {
      "rule": "アクション",
      "ruleTip": "アクション - 条件が満たされた場合に実行されるアクション",
      "expression": "条件式",
      "expressionTip": "条件式 - 定義した条件から SQL 形式で生成される条件式",
      "groupName": "グループ名",
      "groupNameTip": "グループ名 - 条件式を適用するグループ名を表示します",
      "actions": "基準",
      "actionsTip": "条件 - ルールの順序を変更し、ルールが始動する場合の条件を定義します"
    },
    "copyAction": {
      "description": "アクティブになっている場合、フィールド値のソースは、有効な条件を始動するかリストが完了するまで、順番に処理されます。条件を定義するには、[条件編集] ボタンを使用します。",
      "intersection": "交点",
      "coordinates": "座標",
      "address": "住所",
      "preset": "プリセット",
      "actionText": "アクション",
      "criteriaText": "基準",
      "enableText": "有効"
    },
    "actions": {
      "hide": "非表示",
      "required": "必須",
      "disabled": "無効"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "警告: 個別編集は、このフィールドに関連する選択した属性アクションをグループから削除します",
      "editGroupHint": "警告: 個別編集は、このフィールドに関連する選択したスマート アクションをグループから削除します",
      "popupTitle": "編集オプションの選択",
      "editAttributeGroup": "選択した属性アクションはグループから定義されます。 属性アクションを編集するには、次のいずれかのオプションを選択します。",
      "expression": "選択したスマート アクションの条件式はグループから定義されます。 スマート アクションの条件式を編集するには、次のいずれかのオプションを選択します。",
      "editGroupButton": "グループの編集",
      "editIndependentlyButton": "個別編集"
    }
  },
  "filterPage": {
    "submitHidden": "このフィールドの属性データを、非表示の場合でも送信しますか?",
    "title": "${action} ルールの条件式の構成",
    "filterBuilder": "レコードが次の条件式の ${any_or_all} に一致する場合のフィールドに対するアクションを設定します",
    "noFilterTip": "下のツールを使用して、アクションが有効になった場合のステートメントを定義します。"
  },
  "geocoderPage": {
    "setGeocoderURL": "ジオコーダーの URL の設定",
    "hintMsg": "注意: ジオコーダー サービスを変更することになるので、これまでに構成したジオコーダー フィールド マッピングを必ず更新してください。",
    "invalidUrlTip": "URL ${URL} は無効であるか、アクセスできません。"
  },
  "addressPage": {
    "popupTitle": "住所",
    "checkboxLabel": "ジオコーダーから値を取得",
    "selectFieldTitle": "属性",
    "geocoderHint": "ジオコーダーを変更するには、一般設定の [ジオコーダーの設定] ボタンに移動します。",
    "prevConfigruedFieldChangedMsg": "以前に構成した属性が現在のジオコーダー設定に見つかりません。 属性がデフォルトにリセットされました。"
  },
  "coordinatesPage": {
    "popupTitle": "座標",
    "checkboxLabel": "座標の取得",
    "coordinatesSelectTitle": "座標",
    "coordinatesAttributeTitle": "属性",
    "mapSpatialReference": "マップの空間参照",
    "latlong": "緯度/経度",
    "allGroupsCreatedMsg": "可能なすべてのグループがすでに作成されています"
  },
  "presetPage": {
    "popupTitle": "プリセット",
    "checkboxLabel": "フィールドはプリセットされます。",
    "presetValueLabel": "現在のプリセット値:",
    "changePresetValueHint": "このプリセット値を変更するには、一般設定の [プリセット値の定義] ボタンに移動します。"
  },
  "intersectionPage": {
    "groupNameLabel": "名前",
    "dataTypeLabel": "データ タイプ",
    "ignoreLayerRankingCheckboxLabel": "レイヤーのランキングを無視して、すべての定義済みレイヤーから最近隣フィーチャを検索します",
    "intersectingLayersLabel": "値を抽出するレイヤー",
    "layerAndFieldsApplyLabel": "抽出値を適用するレイヤーとフィールド",
    "checkboxLabel": "交差レイヤーのフィールドから値を取得",
    "layerText": "レイヤー",
    "fieldText": "フィールド",
    "actionsText": "操作",
    "toleranceSettingText": "許容値設定",
    "addLayerLinkText": "レイヤーの追加",
    "useDefaultToleranceText": "デフォルトの許容値を使用",
    "toleranceValueText": "許容値",
    "toleranceUnitText": "許容値の単位",
    "useLayerName": "- レイヤー名を使用 -",
    "noLayersMessage": "選択したデータ タイプと一致するフィールドがマップのレイヤーに見つかりません。"
  },
  "presetAll": {
    "popupTitle": "デフォルトのプリセット値を定義します。",
    "deleteTitle": "プリセット値を削除します。",
    "hintMsg": "ここには、すべての一意のプリセット値フィールドの名前が表示されます。プリセット フィールドを削除すると、すべてのレイヤー/テーブルから、プリセットとして使用される各フィールドは無効になります。"
  },
  "intersectionTolerance": {
    "intersectionTitle": "デフォルトの交差許容値"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "新規追加",
    "definedActions": "定義されたアクション",
    "priorityPopupTitle": "スマート アクションの優先度の設定",
    "priorityPopupColumnTitle": "スマート アクション",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "グループ名",
    "layerForExpressionLabel": "条件式のレイヤー",
    "layerForExpressionNote": "注意: 選択したレイヤーのフィールドは条件の定義に使用されます",
    "expressionText": "条件式",
    "editExpressionLabel": "条件式の編集",
    "layerAndFieldsApplyLabel": "適用されるレイヤーとフィールド",
    "submitAttributeText": "選択した非表示フィールドの属性データを送信しますか？",
    "priorityColumnText": "優先度",
    "requiredGroupNameMsg": "この値は必要です",
    "uniqueGroupNameMsg": "一意のグループ名を入力します。この名前のグループはすでに存在します。",
    "deleteGroupPopupTitle": "スマート アクション グループの削除",
    "deleteGroupPopupMsg": "グループを削除すると、関連するすべてのフィールド アクションから条件式が削除されます。",
    "invalidExpression": "条件式は空白にできません",
    "warningMsgOnLayerChange": "定義した条件式と条件式が適用されるフィールドがクリアされます。",
    "smartActionsTable": {
      "name": "名前",
      "expression": "条件式",
      "definedFor": "定義対象"
    }
  },
  "attributeActionsPage": {
    "name": "名前",
    "type": "種類",
    "deleteGroupPopupTitle": "属性アクション グループの削除",
    "deleteGroupPopupMsg": "グループを削除すると、関連するすべてのフィールドから属性アクションが削除されます。",
    "alreadyAppliedActionMsg": "${action} アクションはこのフィールドにすでに適用されています。"
  },
  "chooseFromLayer": {
    "fieldLabel": "フィールド",
    "valueLabel": "値",
    "selectValueLabel": "値の選択"
  },
  "presetPopup": {
    "presetValueLAbel": "設定済みの値"
  },
  "dataType": {
    "esriFieldTypeString": "文字列",
    "esriFieldTypeInteger": "数値",
    "esriFieldTypeDate": "日時",
    "esriFieldTypeGUID": "GUID"
  }
});