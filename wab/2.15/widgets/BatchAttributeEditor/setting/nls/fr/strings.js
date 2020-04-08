define({
  "page1": {
    "selectToolHeader": "Choisissez une méthode de sélection des enregistrements à mettre à jour par lots.",
    "selectToolDesc": "Le widget accepte 3 méthodes pour générer un ensemble sélectionné d'enregistrements à mettre à jour. Vous ne pouvez choisir qu'une méthode. Si vous devez en choisir plusieurs, créez une nouvelle instance du widget.",
    "selectByShape": "Sélectionner par zone",
    "shapeTypeSelector": "Cliquez sur les outils à autoriser",
    "shapeType": {
      "point": "Point",
      "line": "Ligne",
      "polyline": "Polyligne",
      "freehandPolyline": "Polyligne à main levée",
      "extent": "Etendue",
      "polygon": "Surface",
      "freehandPolygon": "Polygone à main levée"
    },
    "freehandPolygon": "Polygone à main levée",
    "selectBySpatQuery": "Sélectionner par entité",
    "selectByAttQuery": "Sélectionner par entité et entités associées",
    "selectByQuery": "Sélectionner par requête",
    "toolNotSelected": "Choisissez une méthode de sélection",
    "noDrawToolSelected": "Sélectionnez au moins un outil de dessin"
  },
  "page2": {
    "layersToolHeader": "Sélectionnez les couches à mettre à jour et les options des outils de sélection, le cas échéant.",
    "layersToolDesc": "La méthode de sélection que vous avez choisie sur la page sera utilisée pour sélectionner et mettre à jour le jeu de couches répertorié ci-dessous.  Si vous sélectionnez plusieurs couches, seuls les champs modifiables communs peuvent être mis à jour.  Selon l'outil de sélection choisi, des options supplémentaires peuvent être requises.",
    "layerTable": {
      "colUpdate": "Mise à jour",
      "colLabel": "Couche",
      "colSelectByLayer": "Sélectionner par couche",
      "colSelectByField": "Champ de requête",
      "colhighlightSymbol": "Symbole de surbrillance :"
    },
    "toggleLayers": "Activer/désactiver la visibilité des couches lors de l’ouverture et de la fermeture",
    "noEditableLayers": "Aucune couche modifiable",
    "noLayersSelected": "Sélectionnez une ou plusieurs couches avant de continuer."
  },
  "page3": {
    "commonFieldsHeader": "Sélectionnez les champs à mettre à jour par lots.",
    "commonFieldsDesc": "Seuls les champs modifiables communs sont présentés ci-dessous.  Sélectionnez les champs que vous souhaitez mettre à jour.  Si le même champ issu de différentes couches possède un domaine différent, un seul domaine est affiché et utilisé.",
    "noCommonFields": "Aucun champ commun",
    "fieldTable": {
      "colEdit": "Modifiable",
      "colName": "Nom",
      "colAlias": "Alias",
      "colAction": "Actions"
    }
  },
  "tabs": {
    "selection": "Définir le type de sélection",
    "layers": "Définir les couches à mettre à jour",
    "fields": "Définir les champs à mettre à jour"
  },
  "errorOnOk": "Renseignez tous les paramètres avant d'enregistrer la configuration",
  "next": "Suivant",
  "back": "Retour",
  "save": "Enregistrer le symbole",
  "cancel": "Annuler",
  "ok": "OK",
  "symbolPopup": "Sélecteur de symboles",
  "editHeaderText": "Texte à afficher en haut du widget",
  "widgetIntroSelectByArea": "Utilisez un des outils ci-dessous pour créer un ensemble de sélection d’entités à mettre à jour. Si la ligne est <font class='maxRecordInIntro'>mise en surbrillance</font>, le nombre maximal d’enregistrements autorisés a été dépassé.",
  "widgetIntroSelectByFeature": "Utilisez l’outil ci-dessous pour sélectionner une entité sur la couche <font class='layerInIntro'>${0}</font> . Cette entité sera utilisée pour sélectionner et mettre à jour toutes les entités d’intersection. Si la ligne est <font class='maxRecordInIntro'>mise en surbrillance</font>, le nombre maximal d’enregistrements autorisés a été dépassé.",
  "widgetIntroSelectByFeatureQuery": "Utilisez l’outil ci-dessous pour sélectionner une entité sur <font class='layerInIntro'>${0}</font> . L’attribut <font class='layerInIntro'>${1}</font> de cette entité sera utilisé pour interroger les couches ci-dessous et mettre à jour les entités obtenues. Si la ligne est <font class='maxRecordInIntro'>mise en surbrillance</font>, le nombre maximal d’enregistrements autorisés a été dépassé.",
  "widgetIntroSelectByQuery": "Saisissez une valeur pour créer un jeu de sélection. Si la ligne est <font class='maxRecordInIntro'>mise en surbrillance</font>, le nombre maximal d’enregistrements autorisés a été dépassé."
});