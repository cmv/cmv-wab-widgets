define({
  "layersPage": {
    "title": "Selecione um modelo para criar feições",
    "generalSettings": "Configurações Gerais",
    "layerSettings": "Configurações da Camada",
    "editDescription": "Fornecer texto de visualização para o painel de editção",
    "editDescriptionTip": "Este texto é exibido sobre o seletor de Modelos, mantenha em branco para nenhum texto.",
    "promptOnSave": "Solicite para salvar edições não salvas quando o formulário estiver fechado ou alternado para o próximo registro.",
    "promptOnSaveTip": "Exibe um lembrete quando o usuário clica em fechar ou navega para o próximo registro editável quando a feição atual tiver edições não salvas.",
    "promptOnDelete": "Exige confirmação ao excluir um registro.",
    "promptOnDeleteTip": "Exibe um lembrete quando o usuário clica em excluir para confirmar a ação.",
    "removeOnSave": "Remove a feição da seleção ao salvar.",
    "removeOnSaveTip": "Opção para remover a feição do conjunto de seleção quando o registro for salvo.  Se ele for o único registro selecionado, o painel é trocado de volta para a página do modelo.",
    "useFilterEditor": "Utilizar filtro do modelo de feição",
    "useFilterEditorTip": "Opção para utilizar o seletor do Modelo de Filtro que fornece a habilidade para visualizar uns modelos de camadas ou pesquisar modelos por nome.",
    "listenToGroupFilter": "Aplica valores de filtro a partir do widget Filtrar Grupo para os campos Preset",
    "listenToGroupFilterTip": "Quando um filtro for aplicado no widget Filtrar Grupo, aplique o valor para um campo correspondente na lista de valor do Preset.",
    "keepTemplateActive": "Mantenha o modelo selecionado ativo",
    "keepTemplateActiveTip": "Quando o seletor de modelo for exibido, se um modelo foi selecionado anteriormente, selecione-o novamente.",
    "layerSettingsTable": {
      "allowDelete": "Permitir Exclusão",
      "allowDeleteTip": "Opção para permitir que o usuário exclua uma feição; desabilitado se a camada não suportar exclusão",
      "edit": "Editável",
      "editTip": "Opção para incluir a camada no widget",
      "label": "Camada",
      "labelTip": "Nome da camada como definido no mapa",
      "update": "Desabilitar Edição de Geometria",
      "updateTip": "Opção para desabilitar o recurso de mover a geometria uma vez posicionada ou mover a geometria em uma feição existente",
      "allowUpdateOnly": "Atualizar Somente",
      "allowUpdateOnlyTip": "Opção para permitir somente a modificação de feições existentes, marcado por padrão e desabilitado se a camada não suportar a criação de novas feições",
      "fields": "Campos",
      "fieldsTip": "Modificar os campos a serem editados e definir Atributos Inteligentes",
      "description": "Descrição",
      "descriptionTip": "Opção para inserir texto para exibir na parte superior da página de atributos."
    },
    "editFieldError": "As modificações de campo e atributos Inteligentes não estão disponíveis para camadas que não são editáveis",
    "noConfigedLayersError": "O Editor Inteligente exige um ou mais camadas editáveis"
  },
  "editDescriptionPage": {
    "title": "Defina o texto de visão geral dos atributos para <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Configure campos para <b>${layername}</b>",
    "description": "Utilize a coluna Pré-Configurado para permitir que o usuário insira um valor antes de criar uma nova feição. Utilize o botão editar Ações para ativar Atributos Inteligentes em uma camada. Os Atributos Inteligentes podem exigir, ocultar ou desativar um campo baseado em valores em outros campos.",
    "fieldsNotes": "* é um campo exigido.  Se você desmarcar Exibir para este campo e a edição do modelo não preencher este valor de campo, você não poderá salvar um novo registro.",
    "fieldsSettingsTable": {
      "display": "Exibir",
      "displayTip": "Determinar se o campo não é visível",
      "edit": "Editável",
      "editTip": "Verifique se o campo está presente no formulário de atributo",
      "fieldName": "Nome",
      "fieldNameTip": "Nome do campo definido no banco de dados",
      "fieldAlias": "Nome Alternativo",
      "fieldAliasTip": "Nome do campo definido no mapa",
      "canPresetValue": "Ajustar",
      "canPresetValueTip": "Opção para mostrar o campo na lista do campo pré-configurado e permitir ao usuário configurar o valor antes da edição",
      "actions": "Ações",
      "actionsTip": "Alterar a ordem dos campos ou configurar os Atributos Inteligentes"
    },
    "smartAttSupport": "Atributos Inteligentes não são suportados em campos do banco de dados exigidos"
  },
  "actionPage": {
    "title": "Configure as ações do Atributo Inteligente para <b>${fieldname}</b>",
    "description": "As ações estão sempre desativadas a menos que você especifique os critérios nos quais elas serão ativadas.  As ações são processadas em ordem e somente uma ação será ativada por campo.  Utilize o botão Editar Critérios para definir os critérios.",
    "actionsSettingsTable": {
      "rule": "Ação",
      "ruleTip": "A ação executada quando os critérios forem atendidos",
      "expression": "Expressão",
      "expressionTip": "A expressão resultante no formato SQL a partir dos critérios definidos",
      "actions": "Critérios",
      "actionsTip": "Altere a ordem da regra e defina os critérios quando ela for ativada"
    },
    "actions": {
      "hide": "Ocultar",
      "required": "Exigido",
      "disabled": "Desabilitado"
    }
  },
  "filterPage": {
    "submitHidden": "Enviar dados de atributos para este campo até quando estiver oculto?",
    "title": "Configure a expressão para a regra ${action}",
    "filterBuilder": "Configure a ação no campo quando o registro corresponder ${any_or_all} das seguintes expressões",
    "noFilterTip": "Utilizando as ferramentas abaixo, defina a declaração para quando a ação estiver ativa."
  }
});