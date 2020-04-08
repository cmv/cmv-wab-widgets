define({
  "page1": {
    "selectToolHeader": "일괄로 업데이트하려는레코드를 선택하기 위한 방법을 선택합니다.",
    "selectToolDesc": "위젯은 업데이트하기 위해 선택된 레코드 집합을 생성하는 세 가지 방법을 지원합니다. 방법은 하나만 선택할 수 있습니다. 방법이 여러 개 필요하면 새 위젯 인스턴스를 생성하세요.",
    "selectByShape": "영역별 선택",
    "shapeTypeSelector": "허용할 도구 클릭",
    "shapeType": {
      "point": "포인트",
      "line": "라인",
      "polyline": "폴리라인",
      "freehandPolyline": "자유곡선 폴리라인",
      "extent": "범위",
      "polygon": "폴리곤",
      "freehandPolygon": "자유곡선 폴리곤"
    },
    "freehandPolygon": "자유곡선 폴리곤",
    "selectBySpatQuery": "피처별 선택",
    "selectByAttQuery": "피처 및 릴레이트된 피처별 선택",
    "selectByQuery": "쿼리별 선택",
    "toolNotSelected": "선택 방법을 선택합니다.",
    "noDrawToolSelected": "그리기 도구를 하나 이상 선택하세요."
  },
  "page2": {
    "layersToolHeader": "가능한 경우 업데이트할 레이어와 선택 도구 옵션을 선택합니다.",
    "layersToolDesc": "1페이지에서 선택한 선택 방법이 아래 나열된 레이어 집합을 선택하고 업데이트하는 데 사용됩니다. 레이어를 여러 개 선택했으면 편집 가능한 공용 필드만 업데이트에 사용할 수 있습니다. 선택 도구의 선택에 따라 추가 옵션이 필요할 수 있습니다.",
    "layerTable": {
      "colUpdate": "업데이트",
      "colLabel": "레이어",
      "colSelectByLayer": "레이어별 선택",
      "colSelectByField": "쿼리 필드",
      "colhighlightSymbol": "강조 심볼"
    },
    "toggleLayers": "열고 닫을 때 레이어 가시성 전환",
    "noEditableLayers": "편집 가능한 레이어 없음",
    "noLayersSelected": "계속하려면 레이어를 하나 이상 선택합니다."
  },
  "page3": {
    "commonFieldsHeader": "일괄처리 업데이트할 필드를 선택합니다.",
    "commonFieldsDesc": "편집 가능한 공용 필드만 아래에 보이게 됩니다. 업데이트하려는 필드를 선택하세요. 다른 레이어의 동일한 필드에 다른 도메인이 있으면 한 도메인만 보이고 사용됩니다.",
    "noCommonFields": "공용 필드 없음",
    "fieldTable": {
      "colEdit": "편집 가능",
      "colName": "이름",
      "colAlias": "별칭",
      "colAction": "작업"
    }
  },
  "tabs": {
    "selection": "선택 유형 정의",
    "layers": "업데이트할 레이어 정의",
    "fields": "업데이트할 필드 정의"
  },
  "errorOnOk": "구성을 저장하기 전에 모든 매개변수를 입력하세요.",
  "next": "다음",
  "back": "뒤로",
  "save": "심볼 저장",
  "cancel": "취소",
  "ok": "확인",
  "symbolPopup": "심볼 선택기",
  "editHeaderText": "위젯 상단에 표시할 텍스트",
  "widgetIntroSelectByArea": "아래 도구 중 하나를 사용하여 업데이트할 선택 피처를 생성합니다.  행이 <font class='maxRecordInIntro'>강조된</font> 경우 최대 레코드 수를 초과한 것입니다.",
  "widgetIntroSelectByFeature": "아래의 도구를 사용하여 <font class='layerInIntro'>${0}</font> 레이어에서 피처를 선택합니다.  이 피처는 모든 교차 피처를 선택하고 업데이트하는 데 사용됩니다.  행이 <font class='maxRecordInIntro'>강조된</font> 경우 최대 레코드 수를 초과한 것입니다.",
  "widgetIntroSelectByFeatureQuery": "아래의 도구를 사용하여 <font class='layerInIntro'>${0}</font>에서 피처를 선택합니다.  이 피처의 <font class='layerInIntro'>${1}</font> 속성은 아래의 레이어를 쿼리하고 결과 피처를 업데이트하는 데 사용됩니다.  행이 <font class='maxRecordInIntro'>강조된</font> 경우 최대 레코드 수를 초과한 것입니다.",
  "widgetIntroSelectByQuery": "선택 집합을 생성하려면 값을 입력합니다.  행이 <font class='maxRecordInIntro'>강조된</font> 경우 최대 레코드 수를 초과한 것입니다."
});