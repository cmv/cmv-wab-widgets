define({
  "layersPage": {
    "allLayers": "Todas as Camadas",
    "title": "Selecione um modelo para criar feições",
    "generalSettings": "Configurações Gerais",
    "layerSettings": "Configurações da Camada",
    "smartActionsTabTitle": "Ações Inteligentes",
    "attributeActionsTabTitle": "Ações do Atributo",
    "presetValueText": "Definir Valores Pré-Definidos",
    "geocoderSettingsText": "Configurações do Geocodificador",
    "editDescription": "Fornecer texto de visualização para o painel de editção",
    "editDescriptionTip": "Este texto é exibido sobre o seletor de Modelos, mantenha em branco para nenhum texto.",
    "promptOnSave": "Solicite para salvar edições não salvas quando o formulário estiver fechado ou alternado para o próximo registro.",
    "promptOnSaveTip": "Exibe um lembrete quando o usuário clica em fechar ou navega para o próximo registro editável quando a feição atual tiver edições não salvas.",
    "promptOnDelete": "Exige confirmação ao excluir um registro.",
    "promptOnDeleteTip": "Exibe um lembrete quando o usuário clica em excluir para confirmar a ação.",
    "removeOnSave": "Remove a feição da seleção ao salvar.",
    "removeOnSaveTip": "Opção para remover a feição do conjunto de seleção quando o registro for salvo.  Se ele for o único registro selecionado, o painel é trocado de volta para a página do modelo.",
    "useFilterEditor": "Utilizar filtro do modelo de feição",
    "useFilterEditorTip": "Opção para utilizar o seletor do Modelo de Filtro que fornece o recurso de visualizar o modelo de uma camada ou procurar modelos pelo nome.",
    "displayShapeSelector": "Mostrar opções de desenho",
    "createNewFeaturesFromExisting": "Permitir ao usuário criar novas feições a partir de feições existentes",
    "createNewFeaturesFromExistingTip": "Opção para permitir ao usuário copiar a feição existente para criar novas feições",
    "copiedFeaturesOverrideDefaults": "Valores de feições copiadas substituem os padrões",
    "copiedFeaturesOverrideDefaultsTip": "Os valores das feições copiadas substituirão os valores de modelo padrão somente para os campos correspondentes",
    "displayShapeSelectorTip": "Opção para mostrar uma lista de opções de desenho válidas para o modelo selecionado.",
    "displayPresetTop": "Exibir lista de valores pré-definidos no topo",
    "displayPresetTopTip": "Opção para mostrar a lista de valores pré-definidos acima do seletor de modelos.",
    "listenToGroupFilter": "Aplica valores de filtro a partir do widget Filtrar Grupo para os campos Preset",
    "listenToGroupFilterTip": "Quando um filtro for aplicado no widget Filtrar Grupo, aplique o valor para um campo correspondente na lista de valor do Preset.",
    "keepTemplateActive": "Mantenha o modelo selecionado ativo",
    "keepTemplateActiveTip": "Quando o seletor de modelo for exibido, se um modelo foi selecionado anteriormente, selecione-o novamente.",
    "geometryEditDefault": "Habilitar edição de geometria por padrão",
    "autoSaveEdits": "Salva a nova feição automaticamente",
    "enableAttributeUpdates": "Botão de atualização de Mostrar Ações do Atributo quando a geometria de edição está ativa",
    "enableAutomaticAttributeUpdates": "Solicitar automaticamente a ação do atributo após a atualização de geometria",
    "enableLockingMapNavigation": "Habilitar o bloqueio da navegação de mapas",
    "enableMovingSelectedFeatureToGPS": "Habilitar o movimento da feição de ponto selecionada para a localização do GPS",
    "enableMovingSelectedFeatureToXY": "Habilitar o movimento da feição de ponto selecionada para a localização XY",
    "featureTemplateLegendLabel": "Configurações de Valor do Modelo de Feição e Filtro",
    "saveSettingsLegendLabel": "Salvar Configurações",
    "geometrySettingsLegendLabel": "Configurações de Geometria",
    "buttonPositionsLabel": "Botões Posição de Salvar, Excluir, Voltar e Limpar",
    "belowEditLabel": "Abaixo de Editar Formulário",
    "aboveEditLabel": "Acima de Editar Formulário",
    "layerSettingsTable": {
      "allowDelete": "Permitir Exclusão",
      "allowDeleteTip": "Permitir Excluir - Opção para permitir que o usuário exclua uma feição; desativado se a camada não suportar exclusão",
      "edit": "Editável",
      "editTip": "Editável - Opção para incluir a camada no widget",
      "label": "Camada",
      "labelTip": "Camada - Nome da camada como definido no mapa",
      "update": "Desabilitar Edição de Geometria",
      "updateTip": "Desabilitar Edição de Geometria - Opção para desativar a habilidade de mover a geometria uma vez posicionada ou mover a geometria em uma feição existente",
      "allowUpdateOnly": "Atualizar Somente",
      "allowUpdateOnlyTip": "Somente Atualizar - Opção para permitir somente a modificação de feições existentes, verificada por padrão e desativada se a camada não suportar a criação de novas feições",
      "fieldsTip": "Modificar os campos a serem editados e definir Atributos Inteligentes",
      "actionsTip": "Ações - Opção para editar campos ou acessar camadas/tabelas relacionadas",
      "description": "Descrição",
      "descriptionTip": "Descrição - Opção para inserir texto para exibir na parte superior da página de atributos.",
      "relationTip": "Visualizar tabelas e camadas relacionadas"
    },
    "editFieldError": "As modificações de campo e atributos Inteligentes não estão disponíveis para camadas que não são editáveis",
    "noConfigedLayersError": "O Editor Inteligente exige um ou mais camadas editáveis",
    "toleranceErrorMsg": "Valor de Tolerância de Intersecção Padrão inválido"
  },
  "editDescriptionPage": {
    "title": "Defina o texto de visão geral dos atributos para <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Configure campos para <b>${layername}</b>",
    "copyActionTip": "Ações do Atributo",
    "editActionTip": "Ações Inteligentes",
    "description": "Utilize o botão de edição de Ações para ativar Atributos Inteligentes em uma camada. Os Atributos Inteligentes podem exigir, ocultar ou desativar um campo com base em valores em outros campos. Utilize o botão de cópia de Ações para ativar e definir a fonte do valor de campo por intersecção, endereço, coordenadas e pré-definição.",
    "fieldsNotes": "* é um campo exigido.  Se você desmarcar Exibir para este campo e a edição do modelo não preencher este valor de campo, você não poderá salvar um novo registro.",
    "smartAttachmentText": "Configurar a ação Anexos inteligentes",
    "smartAttachmentPopupTitle": "Configurar anexos inteligentes para <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Exibir",
      "displayTip": "Exibir - Determina se o campo não é visível",
      "edit": "Editável",
      "editTip": "Editável - Verifique se o campo está presente no formulário de atributo",
      "fieldName": "Nome",
      "fieldNameTip": "Nome - Nome do campo definido no banco de dados",
      "fieldAlias": "Nome Alternativo",
      "fieldAliasTip": "Nome Alternativo - Nome do campo definido no mapa",
      "canPresetValue": "Ajustar",
      "canPresetValueTip": "Pré-Configurado - Opção para mostrar o campo na lista do campo pré-configurado e permitir ao usuário configurar o valor antes da edição",
      "actions": "Ações",
      "actionsTip": "Ações - Altera a ordem dos campos ou configura os Atributos Inteligentes"
    },
    "smartAttSupport": "Atributos Inteligentes não são suportados em campos do banco de dados exigidos"
  },
  "actionPage": {
    "title": "Configurar as Ações do Atributo para <b>${fieldname}</b>",
    "smartActionTitle": "Configurar Ações do Atributo Inteligente para <b>${fieldname}</b>",
    "description": "As ações estão sempre desativadas a menos que você especifique os critérios nos quais elas serão ativadas.  As ações são processadas em ordem e somente uma ação será ativada por campo.  Utilize o botão Editar Critérios para definir os critérios.",
    "copyAttributesNote": "A desativação de qualquer ação que tenha nome de grupo será o mesmo que editar esta ação de forma independente e removerá a ação deste campo do respectivo grupo.",
    "actionsSettingsTable": {
      "rule": "Ação",
      "ruleTip": "Ação - Ação executada quando o critério é satisfatório",
      "expression": "Expressão",
      "expressionTip": "Expressão - A expressão resultante em formato SQL a partir dos critérios definidos",
      "groupName": "Nome do Grupo",
      "groupNameTip": "Nome do Grupo - Exibe o nome do grupo do qual a expressão é aplicada",
      "actions": "Critérios",
      "actionsTip": "Critérios - Altera a ordem da regra e define os critérios quando ela for ativada"
    },
    "copyAction": {
      "description": "A fonte do valor de campo é processada para que se ativada até que um critério válido seja ativado ou a lista seja completada. Utilize o botão Editar Critérios para definir os critérios.",
      "intersection": "Intersecção",
      "coordinates": "Coordenadas",
      "address": "Endereço",
      "preset": "Ajustar",
      "actionText": "Ações",
      "criteriaText": "Critérios",
      "enableText": "Habilitado"
    },
    "actions": {
      "hide": "Ocultar",
      "required": "Exigido",
      "disabled": "Desabilitado"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Aviso: Editar independentemente removerá a ação de atributo selecionada associada a este campo do grupo",
      "editGroupHint": "Aviso: Editar independentemente removerá a ação inteligente selecionada associada a este campo do grupo",
      "popupTitle": "Escolher opção de edição",
      "editAttributeGroup": "A ação de atributo selecionada é definida no grupo. Escolha uma das seguintes opções para editar a ação do atributo:",
      "expression": "A expressão da ação inteligente selecionada é definida no grupo. Escolha uma das seguintes opções para editar a expressão de ação inteligente:",
      "editGroupButton": "Editar Grupo",
      "editIndependentlyButton": "Editar Independentemente"
    }
  },
  "filterPage": {
    "submitHidden": "Enviar dados de atributos para este campo até quando estiver oculto?",
    "title": "Configure a expressão para a regra ${action}",
    "filterBuilder": "Configure a ação no campo quando o registro corresponder ${any_or_all} das seguintes expressões",
    "noFilterTip": "Utilizando as ferramentas abaixo, defina a declaração para quando a ação estiver ativa."
  },
  "geocoderPage": {
    "setGeocoderURL": "Configurar URL do Geocodificador",
    "hintMsg": "Nota: Você está alterando o serviço do geocodificador, certifique-se de atualizar todos os mapeamentos de campo do geocodificador que você configurou.",
    "invalidUrlTip": "A URL ${URL} é inválida ou inacessível."
  },
  "addressPage": {
    "popupTitle": "Endereço",
    "checkboxLabel": "Obter valor do Geocodificador",
    "selectFieldTitle": "Atributo",
    "geocoderHint": "Para alterar o geocodificador, vá até o botão 'Configurações do Geocodificador' em configurações gerais",
    "prevConfigruedFieldChangedMsg": "O atributo configurado anteriormente não é encontrado nas configurações atuais do geocodificador. O atributo foi redefinido para o padrão."
  },
  "coordinatesPage": {
    "popupTitle": "Coordenadas",
    "checkboxLabel": "Obter coordenadas",
    "coordinatesSelectTitle": "Sistema de Coordenadas",
    "coordinatesAttributeTitle": "Atributo",
    "mapSpatialReference": "Referência Espacial do Mapa",
    "latlong": "Latitude/Longitude",
    "allGroupsCreatedMsg": "Todos os grupos possíveis já estão criados"
  },
  "presetPage": {
    "popupTitle": "Ajustar",
    "checkboxLabel": "Os campos serão pré-configurados",
    "presetValueLabel": "O valor pré-definido é:",
    "changePresetValueHint": "Para alterar este valor pré-definido, vá até o botão \"Definir valores pré-definidos\" em configurações gerais"
  },
  "intersectionPage": {
    "groupNameLabel": "Nome",
    "dataTypeLabel": "Tipo de Dados",
    "ignoreLayerRankingCheckboxLabel": "Ignore a classificação de camadas e encontre a feição mais próxima em todas as camadas definidas",
    "intersectingLayersLabel": "Camadas para extrair um valor",
    "layerAndFieldsApplyLabel": "Camadas e campos para aplicar o valor extraído",
    "checkboxLabel": "Obter valor de campo a partir da camada de intersecção",
    "layerText": "Camadas",
    "fieldText": "Campos",
    "actionsText": "Ações",
    "toleranceSettingText": "Configurações de Tolerância",
    "addLayerLinkText": "Adicionar uma Camada",
    "useDefaultToleranceText": "Utilizar Tolerância Padrão",
    "toleranceValueText": "Valor de Tolerância",
    "toleranceUnitText": "Unidade de Tolerância",
    "useLayerName": "- Utilizar Nome da Camada -",
    "noLayersMessage": "Nenhum campo encontrado em qualquer camada de mapa que corresponda ao tipo de dados selecionado."
  },
  "presetAll": {
    "popupTitle": "Definir os valores pré-definidos padrão",
    "deleteTitle": "Excluir valor pré-definido",
    "hintMsg": "Todos os nomes de campo pré-configurados exclusivos estão listados aqui. A remoção do campo pré-configurado desativará o respectivo campo como pré-configurado de todas as camadas/tabelas."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Tolerância de Intersecção Padrão"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "Adicionar Novo",
    "definedActions": "Ações Definidas",
    "priorityPopupTitle": "Definir Prioridade de Ações Inteligentes",
    "priorityPopupColumnTitle": "Ações Inteligentes",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Nome do Grupo",
    "layerForExpressionLabel": "Camada para Expressão",
    "layerForExpressionNote": "Nota: Os campos da camada selecionada serão utilizados para definir critérios",
    "expressionText": "Expressão",
    "editExpressionLabel": "Editar Expressão",
    "layerAndFieldsApplyLabel": "Camadas e campos para aplicar em",
    "submitAttributeText": "Enviar dados de atributos para os campos ocultos selecionados?",
    "priorityColumnText": "Prioridade",
    "requiredGroupNameMsg": "Este valor é exigido",
    "uniqueGroupNameMsg": "Digite um nome de grupo único, o grupo com este nome já existe.",
    "deleteGroupPopupTitle": "Excluir Grupo de Ação Inteligente",
    "deleteGroupPopupMsg": "A exclusão do grupo resultará na remoção da expressão de todas as Ações de Campos associados.",
    "invalidExpression": "Expressão não pode ficar em branco",
    "warningMsgOnLayerChange": "A expressão definida e os campos nos quais ela é aplicada serão apagados.",
    "smartActionsTable": {
      "name": "Nome",
      "expression": "Expressão",
      "definedFor": "Definido Para"
    }
  },
  "attributeActionsPage": {
    "name": "Nome",
    "type": "Tipo",
    "deleteGroupPopupTitle": "Excluir Grupo de Ação do Atributo",
    "deleteGroupPopupMsg": "A exclusão do grupo resultará na remoção da ação do atributo de todos os campos associados.",
    "alreadyAppliedActionMsg": "${action} ação já aplicada neste campo."
  },
  "chooseFromLayer": {
    "fieldLabel": "Campo",
    "valueLabel": "Valor",
    "selectValueLabel": "Selecionar Valor"
  },
  "presetPopup": {
    "presetValueLAbel": "Valor Pré-Configurado"
  },
  "dataType": {
    "esriFieldTypeString": "Texto",
    "esriFieldTypeInteger": "Número",
    "esriFieldTypeDate": "Data",
    "esriFieldTypeGUID": "GUID"
  }
});