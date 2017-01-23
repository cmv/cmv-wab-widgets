define({
  "layersPage": {
    "title": "选择模板以创建要素",
    "generalSettings": "常规设置",
    "layerSettings": "图层设置",
    "editDescription": "为编辑面板提供显示文本",
    "editDescriptionTip": "此文本将显示在模板选取器上方，如果无文本请留空。",
    "promptOnSave": "关闭表单或切换到下一记录时，将提示保存未保存的编辑内容。",
    "promptOnSaveTip": "如果当前要素有未保存的编辑内容，当用户单击关闭或导航至下一可编辑记录时，将显示提示。",
    "promptOnDelete": "删除记录时需要确认。",
    "promptOnDeleteTip": "当用户单击删除以确认操作时，将显示提示。",
    "removeOnSave": "保存时从选择中移除要素。",
    "removeOnSaveTip": "保存记录时，可选择从选择集中移除要素。如果是唯一选定记录，面板将切换回模板页面。",
    "useFilterEditor": "使用要素模板过滤器",
    "useFilterEditorTip": "过滤模板选取器可用于查看一个图层模板或按名称搜索模板，可选择使用过滤模板选取器。",
    "listenToGroupFilter": "将群组过滤器中的过滤值应用到预设字段",
    "listenToGroupFilterTip": "在群组过滤器微件中应用过滤器后，在预设值列表中向匹配的字段应用值。",
    "keepTemplateActive": "保持所选模板处于活动状态",
    "keepTemplateActiveTip": "显示模板选取器后，如果之前选择了某一模板，则重新选择该模板。",
    "layerSettingsTable": {
      "allowDelete": "允许删除",
      "allowDeleteTip": "可选择允许用户删除要素；如果图层不支持删除，则将禁用",
      "edit": "可编辑",
      "editTip": "可选择在微件中包含图层",
      "label": "图层",
      "labelTip": "在地图中定义的图层的名称",
      "update": "禁用几何编辑",
      "updateTip": "在现有要素上放置或移动几何时，可选择禁用移动几何的功能",
      "allowUpdateOnly": "仅更新版",
      "allowUpdateOnlyTip": "可选择仅允许修改现有要素，默认选中该选项；如果图层不支持创建新要素，则禁用该选项",
      "fields": "字段",
      "fieldsTip": "修改要进行编辑的字段并定义智能属性",
      "description": "描述",
      "descriptionTip": "输入文本的选项，以显示在属性页面顶部。"
    },
    "editFieldError": "对于不可编辑的图层，字段修改和智能属性不可用",
    "noConfigedLayersError": "智能编辑器需要一个或多个可编辑图层"
  },
  "editDescriptionPage": {
    "title": "为 <b>${layername}</b> 定义属性概览文本 "
  },
  "fieldsPage": {
    "title": "为 <b>${layername}</b> 配置字段",
    "description": "使用预设列以允许用户在创建新要素之前输入值。使用操作编辑按钮以激活图层上的智能属性。智能属性可以根据其他字段的值来要求、隐藏或禁用字段。",
    "fieldsNotes": "* 是必选字段。如果取消选中显示该字段，并且编辑模板不填充该字段值，您将无法保存新记录。",
    "fieldsSettingsTable": {
      "display": "显示",
      "displayTip": "确定字段是否可见",
      "edit": "可编辑",
      "editTip": "如果字段显示在属性表单中，则选中该选项",
      "fieldName": "名称",
      "fieldNameTip": "在数据库中定义的字段的名称",
      "fieldAlias": "别名",
      "fieldAliasTip": "在地图中定义的字段的名称",
      "canPresetValue": "预设",
      "canPresetValueTip": "可选择在预设字段列表中显示字段，并且允许用户在编辑前对值进行设置",
      "actions": "操作",
      "actionsTip": "更改字段的顺序或设置智能属性"
    },
    "smartAttSupport": "必选数据库字段不支持智能属性"
  },
  "actionPage": {
    "title": "为 <b>${fieldname}</b> 配置智能属性操作",
    "description": "指定触发操作的条件之前，这些操作始终处于关闭状态。将按顺序处理操作，并且每个字段仅触发一个操作。可使用“条件编辑”按钮来定义条件。",
    "actionsSettingsTable": {
      "rule": "操作",
      "ruleTip": "如果满足条件，将执行操作",
      "expression": "表达式",
      "expressionTip": "从定义的条件生成 SQL 格式的表达式",
      "actions": "条件",
      "actionsTip": "触发后，可更改规则的顺序并定义条件"
    },
    "actions": {
      "hide": "隐藏",
      "required": "必填",
      "disabled": "已禁用"
    }
  },
  "filterPage": {
    "submitHidden": "即使隐藏，仍提交该字段的属性数据?",
    "title": "为 ${action} 规则配置表达式",
    "filterBuilder": "当记录与以下 ${any_or_all} 表达式相匹配时，设置字段的操作",
    "noFilterTip": "激活操作后，可使用以下工具来定义语句。"
  }
});