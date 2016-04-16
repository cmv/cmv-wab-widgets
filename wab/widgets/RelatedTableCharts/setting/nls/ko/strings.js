define(
   ({

    chartSettingLabel: "차트 설정",  //shown as a label in config UI dialog box.
    addNewLabel: "새로 추가", //shown as a button text to add layers.
    generalSettingLabel: "일반 설정", //shown as a button text to general settings button.

    layerChooser: {
      title: "차트를 만들 레이어 선택", //shown as title on layer chooser popup.
      selectPolygonLayerLabel: "레이어 선택", //shown as a label in config UI dialog box for layer chooser.
      selectPolygonLayerHintText: "힌트: 여러 차트를 구성하는 경우에는 레이어의 지오메트리 유형이 같아야 함", // shown as a hint text in config UI dialog box for selecting layer from map.
      selectRelatedTableLayerLabel: "레이어와 관련된 테이블 선택", //shown as a label in config UI dialog box for layer chooser.
      selectRelatedTableLayerHintText: "힌트: 숫자 필드가 있는 테이블만 보임", // shown as a hint text in config UI dialog box for selecting table related to layer.
      errorInSelectingPolygonLayer: "릴레이트 포인트 레이어가 있는 레이어를 선택하세요.", // shown as an error label in alert box for selecting layer from map.
      errorInSelectingRelatedLayer: "올바른 릴레이트 테이블/레이어를 선택하세요.", // shown as an error in alert box if error in selecting related table layer.
      polygonLayerNotHavingRelationships: "선택한 레이어에는 릴레이트 테이블/레이어가 없습니다.", // shown as an error in alert box if Selected layer don't have any related table/layer.
      okButton: "확인", //shown as a button text.
      cancelButton: "취소" //shown as a button text.
    },
    ChartSetting: {
      sectionTitle: "섹션 제목", // shown as a label in config UI dialog box.
      sectionTitleHintText: "힌트: 섹션 헤더 제목에 보임", // shown as a hint text in config UI dialog box for section title.
      chartTitle: "차트 제목", // shown as a label in config UI dialog box.
      chartTitleHintText: "힌트: 차트 맨 위 중앙에 보임", // shown as a hint text in config UI dialog box for section title.
      chartDescription: "설명", // shown as a label in cofig UI.
      chartDescriptionHintText: "힌트: 차트 아래에 보임", // shown as a hint text in config UI dialog box.
      chartType: "차트 유형", // shown as a label which shows type of chart.
      barChart: "막대형 차트", // shown as a label for bar chart radio button.
      pieChart: "원형 차트", // shown as a label for pie chart radio button.
      dataSeriesField: "데이터 시리즈 필드", // shown as a label for selecting data series set.
      labelField: "레이블 필드", // shown as a label for selecting label field set.
      chartColor: "차트 색상", // shown as a label which shows color for chart.
      singleColor: "단일 색상", // shown as a label for single color radio button.
      colorByTheme: "테마별 색상", // shown as a label for color by theme radio button.
      colorByFieldValue: "필드 값별 색상", // shown as a label for color by field value radio button.
      xAxisTitle: "X축 제목", // shown as a label to enter title in bottom left corner.
      xAxisHintText: "힌트: X축 제목", // shown as a hint text which shows position of label in config UI dialog box.
      yAxisTitle: "Y축 제목", // shown as a label to enter title in bottom left corner.
      yAxisHintText: "힌트: Y축 제목", // shown as a hint text which shows position of label in config UI dialog box.
      fieldColorLabel: "레이블", // shown as a header in table.
      fieldColorColor: "색상", // shown as a header in table.
      defaultFieldSelectLabel: "선택", // shown as a label in config UI dialog box.
      errMsgFieldValuesNotFound: "선택한 필드의 값을 찾을 수 없음", // shown as an error in alert box.
      errMsgSectionTitle: "섹션 제목을 입력하세요.", // shown as an error in alert box if section title is empty.
      errMsgFieldByValue: "필드 값을 선택하세요.", // shown as an error in alert box if color by field value is empty.
      settingTabTitle: "설정", // shown as a label of tab in config UI
      layoutTabTitle: "레이아웃" // shown as a label of tab in config UI
    },
    GeneralSetting: {
      legendGeneralSettingText: "일반 설정", // shown as a label of general setting legend.
      locationSymbolLabel: "그래픽 위치 심볼", // shown as a label for selecting graphic location symbol.
      locationSymbolHintText: "힌트: 주소와 클릭 위치의 심볼을 나타내는 데 사용됨", // shown as a hint text for selecting graphic location symbol.
      refreshIntervalLabel: "새로 고침 간격", // shown as a label of refresh interval.
      refreshIntervalHintText: "힌트: 차트를 새로 고침하는 간격으로 사용됩니다. 1~1440분 사이의 값을 지정하세요.", // shown as an error for refresh interval.
      errMsgRefreshInterval: "1~1440분 사이의 새로 고침 간격을 지정하세요.",  // shown as an error message.
      symbolPickerPreviewText: "미리 보기:"
    }
  })
);
