///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
  "configText": "Задати текст конфігурації:",
  "generalSettings": {
    "tabTitle": "Загальні налаштування",
    "measurementUnitLabel": "Одиниця вимірювання",
    "currencyLabel": "Символ вимірювання",
    "roundCostLabel": "Округлити вартість",
    "projectOutputSettings": "Налаштування результатів проекту",
    "typeOfProjectAreaLabel": "Тип проектної області",
    "bufferDistanceLabel": "Буферна відстань",
    "roundCostValues": {
      "twoDecimalPoint": "Дві десяткові коми",
      "nearestWholeNumber": "Найближче ціле значення",
      "nearestTen": "Найближчий десяток",
      "nearestHundred": "Найближча сотня",
      "nearestThousand": "Найближча тисяча",
      "nearestTenThousands": "Найближчі десять тисяч"
    },
    "projectAreaType": {
      "outline": "Контур",
      "buffer": "Буфер"
    },
    "errorMessages": {
      "currency": "Недійсна одиниця валюти",
      "bufferDistance": "Недійсна буферна відстань",
      "outOfRangebufferDistance": "Значення повинно бути більше 0 та менше або дорівнювати 100"
    }
  },
  "projectSettings": {
    "tabTitle": "Налаштування проекту",
    "costingGeometrySectionTitle": "Визначити географію для оцінки вартості (необов’язково)",
    "costingGeometrySectionNote": "Примітка: налаштування цього шару дозволить користувачу задати рівняння вартості шаблонів об’єктів на основі географії.",
    "projectTableSectionTitle": "Можливість зберегти/завантажити налаштування проекту (необов’язково)",
    "projectTableSectionNote": "Примітка: налаштування всіх таблиць та шарів дозволить користувачу зберігати/завантажувати проект для подальшого використання.",
    "costingGeometryLayerLabel": "Оцінка вартості шару геометрії",
    "fieldLabelGeography": "Поле для напису географії",
    "projectAssetsTableLabel": "Таблиця проектних активів",
    "projectMultiplierTableLabel": "Таблиця проектної додаткової вартості з множником",
    "projectLayerLabel": "Проектний шар",
    "configureFieldsLabel": "Налаштувати поля",
    "fieldDescriptionHeaderTitle": "Опис поля",
    "layerFieldsHeaderTitle": "Поле шару",
    "selectLabel": "Вибрати",
    "errorMessages": {
      "duplicateLayerSelection": "${layerName} вже вибрано",
      "invalidConfiguration": "Виберіть ${fieldsString}"
    },
    "costingGeometryHelp": "<p>Буде показано полігональний шар(-и) з наступними умовами: <br/> <li>\tШар повинен мати можливість формування запиту</li><li>\tШар повинен мати поле «Глобальний Ідентифікатор»</li></p>",
    "fieldToLabelGeographyHelp": "<p>Рядкові та числові поля вибраного шару оцінки вартості шару геометрії будуть відображатися у розкривному списку «Поле для напису географії».</p>",
    "projectAssetsTableHelp": "<p>Буде показано таблицю(-і) з наступними умовами: <br/> <li>Таблиця повинна мати можливості редагування, а саме «Створити», «Видалити» та «Оновити»</li>    <li>Таблиця повинна мати шість полів з точною назвою та типом даних:</li><ul><li>\tGUIDАктиву (поле типу GUID)</li><li>\tРівнянняВартості (поле рядкового типу)</li><li>\tСценарій (поле рядкового типу)</li><li>\tНазваШаблону (поле рядкового типу)</li><li>    GUIDГеографії (поле типу GUID)</li><li>\tGUIDПроекту (поле типу GUID)</li></ul> </p>",
    "projectMultiplierTableHelp": "<p>Буде показано таблицю(-і) з наступними умовами: <br/> <li>Таблиця повинна мати можливості редагування, а саме «Створити», «Видалити» та «Оновити»</li>    <li>Таблиця повинна мати п’ять полів з точною назвою та типом даних:</li><ul><li>\tОпис (поле рядкового типу)</li><li>\tТип (поле рядкового типу)</li><li>\tЗначення (поле плаваючого/подвійного типу)</li><li>\tІндексВартості (поле цілого числа)</li><li>   \tGUIDПроекту (поле типу GUID))</li></ul> </p>",
    "projectLayerHelp": "<p>Буде показано полігональний шар(-и) з наступними умовами: <br/> <li>Шар повинен мати можливості редагування, а саме «Створити», «Видалити» та «Оновити»</li>    <li>Шар повинен мати п’ять полів з точною назвою та типом даних:</li><ul><li>НазваПроекту (поле рядкового типу)</li><li>Опис (поле рядкового типу)</li><li>ЗагальнаВартістьАктиву (поле плаваючого/подвійного типу)</li><li>ВаловаВартістьПроекту (поле плаваючого/подвійного типу)</li><li>ГлобальнийІдентифікатор (поле типу ГлобальнийІдентифікатор)</li></ul> </p>",
    "pointLayerCentroidLabel": "Центроїд шару точок",
    "selectRelatedPointLayerDefaultOption": "Вибір",
    "pointLayerHintText": "<p>Буде показано шар(-и) точок з наступними умовами: <br/> <li>\tШар повинен мати поле Projectid (типу GUID)</li><li>\tШар повинен мати можливості редагування, а саме «Створити», «Видалити» та «Оновити»</li></p>"
  },
  "layerSettings": {
    "tabTitle": "Налаштування шару",
    "layerNameHeaderTitle": "Назва шару",
    "layerNameHeaderTooltip": "Список шарів у карті",
    "EditableLayerHeaderTitle": "Редагований",
    "EditableLayerHeaderTooltip": "Включити шар та його шаблони у віджет оцінки вартості",
    "SelectableLayerHeaderTitle": "Доступний для вибору",
    "SelectableLayerHeaderTooltip": "Геометрія з об'єкту може використовуватися для генерування нового елементу вартості",
    "fieldPickerHeaderTitle": "Ідентифікатор проекту (необов’язково)",
    "fieldPickerHeaderTooltip": "Необов’язкове поле (рядкового типу) для збереження ідентифікатора проекту в",
    "selectLabel": "Вибрати",
    "noAssetLayersAvailable": "Не знайдено шар активу у вибраній веб-карті",
    "disableEditableCheckboxTooltip": "Цей шар не має можливостей редагування",
    "missingCapabilitiesMsg": "У цьому шарі відсутні наступні можливості:",
    "missingGlobalIdMsg": "Цей шар не має поля «ГлобальнийІдентифікатор»",
    "create": "Створити",
    "update": "Оновити",
    "delete": "Видалити",
    "attributeSettingHeaderTitle": "Настройки атрибутів",
    "addFieldLabelTitle": "Додати атрибути",
    "layerAttributesHeaderTitle": "Атрибути шару",
    "projectLayerAttributesHeaderTitle": "Атрибути шару проекту",
    "attributeSettingsPopupTitle": "Настройки атрибутів шару"
  },
  "costingInfo": {
    "tabTitle": "Інформація про оцінку вартості",
    "proposedMainsLabel": "Запропоновані основні елементи",
    "addCostingTemplateLabel": "Додати шаблон оцінки вартості",
    "manageScenariosTitle": "Управління сценаріями",
    "featureTemplateTitle": "Шаблон об'єкту",
    "costEquationTitle": "Рівняння вартості",
    "geographyTitle": "Географія",
    "scenarioTitle": "Сценарій",
    "actionTitle": "Дії",
    "scenarioNameLabel": "Назва сценарію",
    "addBtnLabel": "Додати",
    "srNoLabel": "№",
    "deleteLabel": "Видалити",
    "duplicateScenarioName": "Назва повторюваного сценарію",
    "hintText": "<div>Підказка: Використовуйте наступні ключові слова</div><ul><li><b>{TOTALCOUNT}</b>: Використовує загальну кількість одного типу активу в географії</li> <li><b>{MEASURE}</b>: Використовує довжину для лінійного активу та площу для полігонального активу</li><li><b>{TOTALMEASURE}</b>: Використовує загальну довжину для лінійного активу та загальну площу для полігонального активу одного типу в географії</li></ul> Можна використовувати такі функції як:<ul><li>Math.abs(-100)</li><li>Math.floor({TOTALMEASURE})</li></ul>Відредагуйте рівняння вартості відповідно до потреб проекту.",
    "noneValue": "Немає",
    "requiredCostEquation": "Недійсне рівняння вартості для ${layerName} : ${templateName}",
    "duplicateTemplateMessage": "Повторюваний запис шаблону вже існує для ${layerName} : ${templateName}",
    "defaultEquationRequired": "Потрібне рівняння за замовчуванням для ${layerName} : ${templateName}",
    "validCostEquationMessage": "Введіть дійсне рівняння вартості",
    "costEquationHelpText": "Відредагуйте рівняння вартості відповідно до потреб проекту",
    "scenarioHelpText": "Виберіть сценарій відповідно до потреб проекту",
    "copyRowTitle": "Копіювати рядок",
    "noTemplateAvailable": "Додайте щонайменше один шаблон для ${layerName}",
    "manageScenarioLabel": "Управління сценарієм",
    "noLayerMessage": "Введіть щонайменше один шар в ${tabName}",
    "noEditableLayersAvailable": "Шар(-и) необхідно відмітити як редагований у вкладці налаштувань шару",
    "updateProjectCostCheckboxLabel": "Оновити рівняння проекту",
    "updateProjectCostEquationHint": "Підказка: це дозволить користувачу оновити рівняння вартості активів, вже доданих в існуючі проекти, з використанням нових рівнянь, визначених нижче на основі шаблону об'єкту, географії та сценарію. Якщо комбінацію не знайдено, буде задане рівняння вартості за замовчуванням, тобто для географії та сценарію буде задано «Немає». У разі видалення шаблону об'єкту, для вартості буде задано 0."
  },
  "statisticsSettings": {
    "tabTitle": "Додаткові настройки",
    "addStatisticsLabel": "Додати статистику",
    "fieldNameTitle": "Поле",
    "statisticsTitle": "Напис",
    "addNewStatisticsText": "Додати нову статистику",
    "deleteStatisticsText": "Видалити статистику",
    "moveStatisticsUpText": "Перемістити статистику вгору",
    "moveStatisticsDownText": "Перемістити статистику вниз",
    "selectDeselectAllTitle": "Вибрати всі"
  },
  "projectCostSettings": {
    "addProjectCostLabel": "Додати додаткову вартість проекту",
    "additionalCostValueColumnHeader": "Значення",
    "invalidProjectCostMessage": "Неприпустимий значення для вартості проекту",
    "additionalCostLabelColumnHeader": "Напис",
    "additionalCostTypeColumnHeader": "Тип"
  },
  "statisticsType": {
    "countLabel": "Лічильник",
    "averageLabel": "Середнє",
    "maxLabel": "Максимум",
    "minLabel": "Мінімум",
    "summationLabel": "Підсумовування",
    "areaLabel": "Площа",
    "lengthLabel": "Довжина"
  }
});