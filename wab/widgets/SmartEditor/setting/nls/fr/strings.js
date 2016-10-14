define({
  "layersPage": {
    "title": "Sélectionnez un modèle pour créer des entités",
    "generalSettings": "Paramètres généraux",
    "layerSettings": "Paramètres de la couche",
    "editDescription": "Fournir le texte à afficher pour la fenêtre de mise à jour",
    "editDescriptionTip": "Ce texte apparaît au-dessus du sélecteur de modèles. Vous pouvez également n'indiquer aucun texte.",
    "promptOnSave": "Demandez à enregistrer les modifications non enregistrées lors de la fermeture du formulaire ou de l'accès au prochain enregistrement.",
    "promptOnSaveTip": "Affichez une invite lorsque l'utilisateur clique sur Fermer ou accède au prochain enregistrement modifiable alors que l'entité actuelle comporte des modifications non enregistrées.",
    "promptOnDelete": "Demandez confirmation lors de la suppression d'un enregistrement.",
    "promptOnDeleteTip": "Affichez une invite lorsque l'utilisateur clique sur Supprimer afin de confirmer l'action.",
    "removeOnSave": "Supprimez l'entité de la sélection lors de l'enregistrement.",
    "removeOnSaveTip": "Option permettant de supprimer l'entité du jeu de sélection lors de la sauvegarde de l'enregistrement. S'il s'agit du seul enregistrement sélectionné, la fenêtre revient sur la page du modèle.",
    "useFilterEditor": "Utiliser le filtre des modèles d'entités",
    "useFilterEditorTip": "Option permettant d'utiliser le sélecteur des modèles de filtre visant à afficher un modèle de couche ou à rechercher des modèles en fonction de leur nom.",
    "listenToGroupFilter": "Appliquer des valeurs de filtre du widget Filtrer les groupes aux champs prédéfinis",
    "listenToGroupFilterTip": "Lorsqu'un filtre est appliqué dans le widget Filtrer les groupes, appliquez la valeur à un champ d'appariement dans la liste des valeurs prédéfinies.",
    "keepTemplateActive": "Conserver le modèle sélectionné actif",
    "keepTemplateActiveTip": "Lorsque le sélecteur de modèles est affiché, si un modèle a été précédemment sélectionné, resélectionnez-le.",
    "layerSettingsTable": {
      "allowDelete": "Autoriser la suppression",
      "allowDeleteTip": "Option qui permet à l'utilisateur de supprimer une entité. Désactivée si la couche ne prend pas en charge la suppression",
      "edit": "Modifiable",
      "editTip": "Option permettant d'inclure la couche dans le widget",
      "label": "Couche",
      "labelTip": "Nom de la couche selon la définition de la carte",
      "update": "Désactiver la mise à jour de la géométrie",
      "updateTip": "Option permettant de désactiver la possibilité de déplacement de la géométrie une fois positionnée ou de déplacement de la géométrie sur une entité existante.",
      "allowUpdateOnly": "Mettre à jour uniquement",
      "allowUpdateOnlyTip": "Option autorisant uniquement la modification des entités existantes. Sélectionnée par défaut et désélectionnée si la couche ne prend pas en charge la création de nouvelles entités.",
      "fields": "Champs",
      "fieldsTip": "Modifier les champs à mettre à jour et définir les attributs intelligents",
      "description": "Description",
      "descriptionTip": "Option permettant de saisir le texte à afficher au-dessus de la page des attributs."
    },
    "editFieldError": "Les modifications de champ et les attributs intelligents ne sont pas disponibles dans les couches non modifiables",
    "noConfigedLayersError": "Le widget Editeur intelligent requiert une ou plusieurs couches modifiables"
  },
  "editDescriptionPage": {
    "title": "Définir le texte de vue d'ensemble des attributs de <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Configurer les champs de <b>${layername}</b>",
    "description": "Utilisez la colonne Prédéfini pour autoriser l'utilisateur à saisir une valeur avant de créer une nouvelle entité. Utilisez le bouton de mise à jour des actions pour activer les attributs intelligents sur une couche. Les attributs intelligents peuvent requérir, masquer ou désactiver un champ en fonction des valeurs présentes dans d'autres champs.",
    "fieldsNotes": "* est un champ obligatoire. Si vous désactivez Affichage pour ce champ, et que le modèle de mise à jour ne renseigne pas cette valeur de champ, vous ne pourrez pas enregistrer de nouvel enregistrement.",
    "fieldsSettingsTable": {
      "display": "Affichage",
      "displayTip": "Déterminer si le champ n'est pas visible",
      "edit": "Modifiable",
      "editTip": "Activer si le champ est présent dans le formulaire d'attribut",
      "fieldName": "Nom",
      "fieldNameTip": "Nom du champ défini dans la base de données",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Nom du champ défini dans la carte",
      "canPresetValue": "Prédéfini",
      "canPresetValueTip": "Option permettant d'afficher le champ dans la liste des champs prédéfinis et d'autoriser l'utilisateur à définir la valeur avant la mise à jour",
      "actions": "Actions",
      "actionsTip": "Modifier l'ordre des champs ou configurer les attributs intelligents"
    },
    "smartAttSupport": "Les attributs intelligents ne sont pas pris en charge dans les champs de base de données requis"
  },
  "actionPage": {
    "title": "Configurer les actions des attributs intelligents de <b>${fieldname}</b>",
    "description": "Les actions sont toujours désactivées sauf si vous spécifiez leurs critères de déclenchement. Les actions sont traitées par ordre et une seule action est déclenchée par champ. Utilisez le bouton de mise à jour des critères pour définir ces derniers.",
    "actionsSettingsTable": {
      "rule": "Opération",
      "ruleTip": "Action effectuée une fois le critère rempli",
      "expression": "Expression",
      "expressionTip": "L'expression obtenue au format SQL à partir des critères définis",
      "actions": "Critère",
      "actionsTip": "Modifier l'ordre de la règle et définir les critères lors de son déclenchement"
    },
    "actions": {
      "hide": "Masquer",
      "required": "Obligatoire",
      "disabled": "Désactivé"
    }
  },
  "filterPage": {
    "submitHidden": "Soumettre les données attributaires de ce champ même s'il est masqué ?",
    "title": "Configurer l'expression de la règle ${action}",
    "filterBuilder": "Définir l'action sur le champ lorsque l'enregistrement correspond à ${any_or_all} des expressions suivantes",
    "noFilterTip": "A l'aide des outils ci-dessous, définissez l'instruction indiquant la période d'activité de l'action."
  }
});