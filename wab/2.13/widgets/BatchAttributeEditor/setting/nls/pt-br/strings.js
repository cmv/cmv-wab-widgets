define({
  "page1": {
    "selectToolHeader": "Escolha um método para selecionar registros para atualização em lote.",
    "selectToolDesc": "O widget suporta 3 métodos para gerar um conjunto de registros selecionado para atualizar. Você pode escolher somente um dos métodos. Se você exigir mais de um destes métodos, crie uma nova instância do widget.",
    "selectByShape": "Selecionar por Área",
    "shapeTypeSelector": "Clique na ferramentas que deseja permitir",
    "shapeType": {
      "point": "Ponto",
      "line": "Linha",
      "polyline": "Polilinha",
      "freehandPolyline": "Polilinha À Mão Livre",
      "extent": "Extensão",
      "polygon": "Polígono",
      "freehandPolygon": "Polígono À Mão Livre"
    },
    "freehandPolygon": "Polígono À Mão Livre",
    "selectBySpatQuery": "Selecionar por Feição",
    "selectByAttQuery": "Selecionar por Feição & Feições Relacionadas",
    "selectByQuery": "Selecionar por Consulta",
    "toolNotSelected": "Selecione um método de seleção",
    "noDrawToolSelected": "Escolha pelo menos uma ferramenta de desenho"
  },
  "page2": {
    "layersToolHeader": "Selecione as camadas para atualizar e as opções das ferramentas de seleção, se tiver.",
    "layersToolDesc": "O método de seleção que você escolheu na página será utilizado para selecionar e atualizar um conjunto de camadas listadas abaixo.  Se você marcar mais de uma camada, somente os campos editáveis comuns estarão disponíveis para atualizar.  Dependendo da sua escolha na ferramenta de seleção, opções adicionais serão exigidas.",
    "layerTable": {
      "colUpdate": "Atualizar",
      "colLabel": "Camada",
      "colSelectByLayer": "Selecionar por Camada",
      "colSelectByField": "Campo de Consulta",
      "colhighlightSymbol": "Símbolo de Destaque"
    },
    "toggleLayers": "Alternar visibilidade das camadas ao abrir e fechar",
    "noEditableLayers": "Nenhuma Camada Editável",
    "noLayersSelected": "Selecione uma ou mais camadas antes de continuar."
  },
  "page3": {
    "commonFieldsHeader": "Selecione os campos para atualização em lote.",
    "commonFieldsDesc": "Somente os campos editáveis comuns serão mostrados abaixo.  Selecione os campos que você deseja atualizar.  Se o mesmo campo de diferentes camadas tiver um domínio diferente, somente um domínio será mostrado e utilizado.",
    "noCommonFields": "Nenhum Campo em Comum",
    "fieldTable": {
      "colEdit": "Editável",
      "colName": "Nome",
      "colAlias": "Nome Alternativo",
      "colAction": "Ações"
    }
  },
  "tabs": {
    "selection": "Definir Tipo de Seleção",
    "layers": "Definir Camada para Atualizar",
    "fields": "Definir Campos para Atualizar"
  },
  "errorOnOk": "Preencha todos os parâmetros antes de salvar a configuração",
  "next": "Avançcar",
  "back": "Voltar",
  "save": "Salvar Símbolo",
  "cancel": "Cancelar",
  "ok": "Ok",
  "symbolPopup": "Seletor de Símbolo",
  "editHeaderText": "Texto para exibir na parte superior do widget",
  "widgetIntroSelectByArea": "Utilize uma das ferramentas abaixo para criar um conjunto de feições selecionado para atualizar. Se a linha estiver <font class='maxRecordInIntro'>destacada</font>, o número máximo de registros foi excedido.",
  "widgetIntroSelectByFeature": "Utilize a ferramenta abaixo para selecionar uma feição da camada <font class='layerInIntro'>${0}</font>. Esta feição será utilizada para selecionar e atualizar todas as feições da intersecção. Se a linha estiver <font class='maxRecordInIntro'>destacada</font>, o número máximo de registros foi excedido.",
  "widgetIntroSelectByFeatureQuery": "Utilize a ferramenta abaixo para selecionar uma feição da camada  <font class='layerInIntro'>${0}</font> . Este atributo <font class='layerInIntro'>${1}</font> da feição será utilizado para consultar as camadas abaixo e atualizar as feições resultantes. Se a linha estiver <font class='maxRecordInIntro'>destacada</font>, o número máximo de registros foi excedido.",
  "widgetIntroSelectByQuery": "Insira um valor para criar um conjunto de seleção. Se a linha estiver <font class='maxRecordInIntro'>destacada</font>, o número máximo de registros foi excedido."
});