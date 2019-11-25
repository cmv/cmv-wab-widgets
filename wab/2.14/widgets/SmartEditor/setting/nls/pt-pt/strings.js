define({
  "layersPage": {
    "allLayers": "Todas as Camadas",
    "title": "Escolha um template para criar elementos",
    "generalSettings": "Configurações Gerais",
    "layerSettings": "Configurações de Camada",
    "smartActionsTabTitle": "Ações Inteligentes",
    "attributeActionsTabTitle": "Ações de Atributos",
    "geocoderSettingsText": "Definições de Geocodificador",
    "editDescription": "Fornecer texto de exibição para o painel editar",
    "editDescriptionTip": "Este texto é exibido acima do seletor Modelo, deixe em branco caso prefira que não haja texto.",
    "promptOnSave": "Solicitação para guardar edições por guardar quando o formulário é encerrado ou alterado para o registo seguinte.",
    "promptOnSaveTip": "Exibir uma solicitação quando o utilizador clica em encerrar ou navega para o registo editável seguinte, quando o elemento atual tem edições por guardar.",
    "promptOnDelete": "Requerer confirmação ao eliminar um registo.",
    "promptOnDeleteTip": "Exibir uma solicitação quando o utilizador clica em eliminar para confirmar a acção.",
    "removeOnSave": "Remover elemento de seleção ao guardar.",
    "removeOnSaveTip": "Opção para remover o elemento do conjunto de seleção quando o registo é guardado.  Casos e trate do único registo selecionado, o painel regressa à página do modelo.",
    "useFilterEditor": "Utilizar filtro de modelo de elemento",
    "useFilterEditorTip": "Opção para utilizar o seletor Modelo de Filtro, que oferece a possibilidade de visualizar o modelo de uma camada ou pesquisar modelos por nome.",
    "displayShapeSelector": "Exibir opções de desenho",
    "createNewFeaturesFromExisting": "Permitir ao utilizador criar novo(s) elemento(s) a partir de elemento(s) existente(s)",
    "createNewFeaturesFromExistingTip": "Opção para permitir ao utilizador copiar um elemento existente para criar novos elementos",
    "copiedFeaturesOverrideDefaults": "Os valores de elementos copiados substituem as predefinições",
    "copiedFeaturesOverrideDefaultsTip": "Os valores de elementos copiados substituirão os valores do modelo predefinido apenas para o(s) campo(s) que corresponda(m)",
    "displayShapeSelectorTip": "Opção para exibir uma lista de opções de desenho válidas para o modelo selecionado.",
    "displayPresetTop": "Exibir lista de valores predefinidos no topo",
    "displayPresetTopTip": "Opção para exibir a lista de valores predefinidos acima do seletor de modelos.",
    "listenToGroupFilter": "Aplicar valores de filtros do widget Agrupar Filtros para Predefinir campos",
    "listenToGroupFilterTip": "Quando um filtro é aplicado no widget Agrupar Filtros, aplique o valor a um campo correspondente na lista de valor Predefinido.",
    "keepTemplateActive": "Manter modelo selecionado ativo",
    "keepTemplateActiveTip": "Quando o seletor de modelos é exibido, caso um modelo tenha sido selecionado anteriormente, volte a selecioná-lo.",
    "geometryEditDefault": "Ativar edição de geometria por defeito",
    "autoSaveEdits": "Guarda novo elemento automaticamente",
    "enableAttributeUpdates": "Exibir botão de atualização Ações de Atributos quando editar geometria se encontra ativo",
    "enableAutomaticAttributeUpdates": "Chamar Ação de Atributos automaticamente após atualização da geometria",
    "enableLockingMapNavigation": "Ativar bloqueio de navegação no mapa",
    "enableMovingSelectedFeatureToGPS": "Ativar deslocamento de elemento de ponto selecionado para localização GPS",
    "enableMovingSelectedFeatureToXY": "Ativar deslocamento de elemento de ponto selecionado para localização XY",
    "featureTemplateLegendLabel": "Definições de Modelo de Elementos e de Valor de Filtro",
    "saveSettingsLegendLabel": "Guardar Definições",
    "geometrySettingsLegendLabel": "Definições de Geometria",
    "buttonPositionsLabel": "Posição dos botões Guardar, Eliminar, Regressar e Limpar",
    "belowEditLabel": "Abaixo do Formulário de Edição",
    "aboveEditLabel": "Acima do Formulário de Edição",
    "switchToMultilineInput": "Mudar para entrada multilinha quando o comprimento do campo exceder",
    "layerSettingsTable": {
      "allowDelete": "Permitir Eliminação",
      "allowDeleteTip": "Permitir Eliminação: opção que permite ao utilizador eliminar um elemento; é desativada caso a camada não suporte eliminação",
      "edit": "Editável",
      "editTip": "Editável: opção para incluir a camada no widget",
      "label": "Camada",
      "labelTip": "Camada: nome da camada tal como definido no mapa",
      "update": "Desativar Edição de Geometria",
      "updateTip": "Desativar Edição de Geometria: opção para desativar a capacidade de mover a geometria após colocada ou mover a geometria num elemento existente",
      "allowUpdateOnly": "Atualizar Apenas",
      "allowUpdateOnlyTip": "Apenas Atualização: opção que permite apenas a modificação de elementos existentes está selecionada por predefinição e desativada caso a camada não suporte a criação de novos elementos",
      "fieldsTip": "Modificar os campos para serem editados e definir Atributos Inteligentes",
      "actionsTip": "Ações: opção para editar campos ou aceder a camadas/tabelas relacionadas",
      "description": "Descrição",
      "descriptionTip": "Descrição: opção para introduzir texto a exibir na parte superior da página de atributos.",
      "relationTip": "Visualizar camadas e tabelas relacionadas"
    },
    "editFieldError": "Modificações de campos e atributos Inteligentes não se encontram disponíveis para camadas que não são editáveis",
    "noConfigedLayersError": "O Smart Editor requer uma ou mais camadas editáveis.",
    "toleranceErrorMsg": "Valor de tolerância de interseção predefinida inválido",
    "invalidMaxCharacterErrorMsg": "Valor inválido ao mudar para entrada multilinha"
  },
  "editDescriptionPage": {
    "title": "Defina o texto de vista geral de atributos para <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Configure campos para <b>${layername}</b>",
    "copyActionTip": "Ações de Atributos",
    "editActionTip": "Ações Inteligentes",
    "description": "Utilize o botão de edição Ações para ativar Atributos Inteligentes numa camada. Os Atributos Inteligentes podem requerer, ocultar ou desativar um campo com base em valores de outros campos. Utilize o botão de cópia Ações para ativar e definir origem de valor de campo por interseção, endereço, coordenadas e predefinição.",
    "fieldsNotes": "* é um campo exigido.  Caso desmarque Exibir para este campo, e o modelo de edição não preencha esse valor de campo, não lhe será possível  guardar um novo registo.",
    "smartAttachmentText": "Configurar a ação Anexos inteligentes",
    "smartAttachmentPopupTitle": "Configurar anexos inteligentes para <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Exibir",
      "displayTip": "Exibir: determinar se o campo não é visível",
      "edit": "Editável",
      "editTip": "Editável: marcar se o campo estiver presente no formulário de atributos",
      "fieldName": "Nome",
      "fieldNameTip": "Nome: nome do campo definido na base de dados",
      "fieldAlias": "Nome Alternativo",
      "fieldAliasTip": "Nome alternativo: nome do campo definido no mapa",
      "canPresetValue": "Pré-definido",
      "canPresetValueTip": "Predefinição: opção para exibir o campo na lista de campos predefinidos e permitir ao utilizador definir o valor antes de editar",
      "actions": "Acções",
      "actionsTip": "Ações: alterar a ordem dos campos ou configurar Atributos Inteligentes"
    },
    "smartAttSupport": "Os Atributos Inteligentes não são suportados nos campos obrigatórios da base de dados"
  },
  "actionPage": {
    "title": "Configurar as Acções de Atributos para <b>${fieldname}</b>",
    "smartActionTitle": "Configure as Ações de Atributos Inteligentes para <b>${fieldname}</b>",
    "description": "As ações estão sempre desativadas, a não ser que especifique os critérios através dos quais são desencadeadas.   As ações são processadas por ordem e apenas uma ação por campo será desencadeada.  Utilize o botão Edição de Critérios para definir os critérios.",
    "copyAttributesNote": "A desativação de qualquer ação com um nome de grupo terá o mesmo efeito que a edição dessa ação de forma independente e irá remover a ação para este campo do respetivo grupo.",
    "searchPlaceHolder": "Pesquisar",
    "expandAllLabel": "Expandir todas as camadas",
    "actionsSettingsTable": {
      "rule": "Ação",
      "ruleTip": "Ação: ação executada quando os critérios são correspondidos",
      "expression": "Expressão",
      "expressionTip": "Expressão: a expressão resultante em formato SQL dos critérios definidos",
      "groupName": "Nome do Grupo",
      "groupNameTip": "Nome do Grupo: exibe o nome do grupo a partir do qual a expressão é aplicada",
      "actions": "Critérios",
      "actionsTip": "Critério: altera a ordem da regra e define os critérios quando este é ativado"
    },
    "copyAction": {
      "description": "A fonte de dados dos valores de um campo é processada por ordem se estiver activa até que um critério válido seja despoletado ou a lista esteja completa.",
      "intersection": "Intersecção",
      "coordinates": "Coordenadas",
      "address": "Endereço",
      "preset": "Pré-definido",
      "actionText": "Ações",
      "criteriaText": "Critérios",
      "enableText": "Ativado"
    },
    "actions": {
      "hide": "Esconder",
      "required": "Exigido",
      "disabled": "Desativado"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Aviso: a edição independente irá remover do grupo a ação do atributo selecionada associada para este campo",
      "editGroupHint": "Aviso: a edição independente irá remover do grupo a ação inteligente selecionada associada para este campo",
      "popupTitle": "Escolher opção de edição",
      "editAttributeGroup": "A ação de atributo selecionada é definida a partir do grupo. Escolha uma das seguintes opções para editar a ação de atributo:",
      "expression": "A expressão da ação inteligente selecionada é definida a partir do grupo. Escolha uma das seguintes opções para editar a expressão da ação inteligente:",
      "editGroupButton": "Editar Grupo",
      "editIndependentlyButton": "Editar Independentemente"
    }
  },
  "filterPage": {
    "submitHidden": "Submeter dados de atributos para este campo, mesmo quando se encontra oculto?",
    "title": "Configurar expressão para a regra ${action}",
    "filterBuilder": "Definir ação para campo quando o registo corresponde a ${any_or_all} das expressões seguintes",
    "noFilterTip": "Utilizando as expressões apresentadas acima, defina a declaração apresentada quando a ação se encontra ativa."
  },
  "geocoderPage": {
    "setGeocoderURL": "Definir URL Geocodificador",
    "hintMsg": "Nota: Está a modificar o serviço de geocodificador, por favor, atualize quaisquer cartografias de campo de geocodificador que tenha configurado.",
    "invalidUrlTip": "O URL ${URL} é inválido ou inacessível."
  },
  "addressPage": {
    "popupTitle": "Endereço",
    "checkboxLabel": "Obter valor do Geocodificador",
    "selectFieldTitle": "Atributo",
    "geocoderHint": "Para mudar de geocodificador, utilize o botão 'Definições de Geocodificador' nas definições gerais",
    "prevConfigruedFieldChangedMsg": "O atributo configurado anteriormente não é encontrado nas definições de geocodificador atuais. As predefinições do atributo foram repostas."
  },
  "coordinatesPage": {
    "popupTitle": "Coordenadas",
    "checkboxLabel": "Obter coordenadas",
    "coordinatesSelectTitle": "Sistema de Coordenadas",
    "coordinatesAttributeTitle": "Atributo",
    "mapSpatialReference": "Referência Espacial do Mapa",
    "latlong": "Latitude/Longitude",
    "allGroupsCreatedMsg": "Já foram criados todos os grupos possíveis"
  },
  "presetPage": {
    "popupTitle": "Pré-definido",
    "checkboxLabel": "O campo será predefinido",
    "showOnlyDomainFields": "Exibir apenas campos de domínio",
    "hideInPresetDisplay": "Ocultar na apresentação dos valores predefinidos",
    "presetValueLabel": "O atual valor de predefinição é:",
    "changePresetValueHint": "Para alterar este valor de predefinição, utilize o botão 'Definir Valores de Predefinição' nas definições gerais"
  },
  "intersectionPage": {
    "groupNameLabel": "Nome do Grupo",
    "dataTypeLabel": "Tipo de Dados",
    "ignoreLayerRankingCheckboxLabel": "Ignorar classificação de camada e encontrar elemento mais próximo em todas as camadas definidas",
    "intersectingLayersLabel": "Camada(s) para extrair um valor",
    "layerAndFieldsApplyLabel": "Camada(s) e campo(s) para aplicar o valor extraído",
    "checkboxLabel": "Obter valor a prtir do campo da camada de interseção",
    "layerText": "Camadas",
    "fieldText": "Campos",
    "actionsText": "Ações",
    "toleranceSettingText": "Definições de Tolerância",
    "addLayerLinkText": "Adicionar uma Camada",
    "useDefaultToleranceText": "Utilizar Tolerância Predefinida",
    "toleranceValueText": "Valor de Tolerância",
    "toleranceUnitText": "Unidade de Tolerância",
    "useLayerName": "- Utilizar Nome da Camada -",
    "noLayersMessage": "Não foi encontrado qualquer campo em nenhuma camada do mapa que corresponda ao tipo de dados selecionado."
  },
  "presetAll": {
    "popupTitle": "Definir os valores de predefinição padrão",
    "deleteTitle": "Eliminar valor de predefinição",
    "hintMsg": "Todos os campos únicos de predefinição encontram-se listados aqui. A remoção de campo de predefinição irá desativar o respetivo campo enquanto campo predefinido de todas as camadas/tabelas."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Tolerância de Interseção Predefinida"
  },
  "smartActionsPage": {
    "smartActionLabel": "Configurar uma Ação Inteligente",
    "addNewSmartActionLinkText": "Adicionar Nova",
    "definedActions": "Ações Definidas",
    "priorityPopupTitle": "Definir prioridade de Ações Inteligentes",
    "priorityPopupColumnTitle": "Ações Inteligentes",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Nome do Grupo",
    "layerForExpressionLabel": "Camada para Expressão",
    "layerForExpressionNote": "Nota: os campos da camada selecionada serão utilizados para definir critérios",
    "expressionText": "Expressão",
    "editExpressionLabel": "Editar Expressão",
    "layerAndFieldsApplyLabel": "Camadas e campos aos quais aplicar",
    "submitAttributeText": "Enviar dados de atributo para o(s) campo(s) oculto(s) selecionado(s)?",
    "priorityColumnText": "Prioritário",
    "requiredGroupNameMsg": "Este valor é necessário",
    "uniqueGroupNameMsg": "Introduzir um nome de grupo único. Já existe um grupo com este nome.",
    "deleteGroupPopupTitle": "Eliminar Grupo de Ações Inteligentes",
    "deleteGroupPopupMsg": "A eliminação do grupo fará com que a expressão seja removida de todas as Ações de Campo(s) associadas.",
    "invalidExpression": "A expressão não pode estar vazia",
    "warningMsgOnLayerChange": "Os campos na qual a expressão definida está aplicada serão eliminados.",
    "smartActionsTable": {
      "name": "Nome",
      "expression": "Expressão",
      "definedFor": "Definido Para"
    }
  },
  "attributeActionsPage": {
    "name": "Nome",
    "type": "Tipo",
    "deleteGroupPopupTitle": "Eliminar Grupo de Ações de Atributos",
    "deleteGroupPopupMsg": "A eliminação do grupo fará com que a ação de atributo seja removida de todos os Campos associados.",
    "alreadyAppliedActionMsg": "A ação ${action} já está aplicada a este campo."
  },
  "chooseFromLayer": {
    "fieldLabel": "Campo",
    "valueLabel": "Valor",
    "selectValueLabel": "Selecionar Valor"
  },
  "presetPopup": {
    "presetValueLAbel": "Valor Predefinido"
  },
  "dataType": {
    "esriFieldTypeString": "Texto",
    "esriFieldTypeInteger": "Número",
    "esriFieldTypeDate": "Data",
    "esriFieldTypeGUID": "GUID"
  },
  "relativeDates": {
    "dateTypeLabel": "Tipo de Dados",
    "valueLabel": "Valor",
    "fixed": "Corrigido",
    "current": "Actual",
    "past": "Passados",
    "future": "Futuro",
    "popupTitle": "Selecionar Valor",
    "hintForFixedDateType": "Sugestão: a data e hora especificadas serão utilizadas como valor padrão predefinido",
    "hintForCurrentDateType": "Sugestão: a data e hora atuais serão utilizadas como valor padrão predefinido",
    "hintForPastDateType": "Sugestão: o valor especificado será subtraído à data e hora atuais para o valor padrão da definição.",
    "hintForFutureDateType": "Sugestão: o valor especificado será adicionado à data e hora atuais para o valor padrão da definição.",
    "noDateDefinedTooltip": "Nenhuma data definida"
  },
  "relativeDomains": {
    "fieldSetTitle": "Lista",
    "valueText": "Valor",
    "defaultText": "Padrão",
    "selectDefaultDomainMsg": "Selecione um domínio de valor padrão ou certifique-se de que a caixa de verificação do domínio padrão está assinalada"
  }
});