define({
  "layersPage": {
    "allLayers": "Toutes les couches",
    "title": "Sélectionnez un modèle pour créer des entités",
    "generalSettings": "Paramètres généraux",
    "layerSettings": "Paramètres de la couche",
    "smartActionsTabTitle": "Actions intelligentes",
    "attributeActionsTabTitle": "Actions des attributs",
    "presetValueText": "Définir des valeurs prédéfinies",
    "geocoderSettingsText": "Paramètres du géocodeur",
    "editDescription": "Fournir le texte à afficher pour la fenêtre de mise à jour",
    "editDescriptionTip": "Ce texte apparaît au-dessus du sélecteur de modèles. Vous pouvez également n'indiquer aucun texte.",
    "promptOnSave": "Demandez à enregistrer les modifications non enregistrées lors de la fermeture du formulaire ou de l'accès au prochain enregistrement.",
    "promptOnSaveTip": "Affichez une invite lorsque l'utilisateur clique sur Fermer ou accède au prochain enregistrement modifiable alors que l'entité actuelle comporte des modifications non enregistrées.",
    "promptOnDelete": "Demandez confirmation lors de la suppression d'un enregistrement.",
    "promptOnDeleteTip": "Afficher une invite lorsque l’utilisateur clique sur Supprimer pour confirmer l’action.",
    "removeOnSave": "Supprimez l'entité de la sélection lors de l'enregistrement.",
    "removeOnSaveTip": "Option permettant de supprimer l'entité du jeu de sélection lors de la sauvegarde de l'enregistrement. S'il s'agit du seul enregistrement sélectionné, la fenêtre revient sur la page du modèle.",
    "useFilterEditor": "Utiliser le filtre des modèles d'entités",
    "useFilterEditorTip": "Option permettant d’utiliser le sélecteur Filtrer les modèles visant à afficher un modèle de couche ou à rechercher des modèles en fonction de leur nom.",
    "displayShapeSelector": "Afficher les options de dessin",
    "createNewFeaturesFromExisting": "Autoriser les utilisateurs à créer de nouvelles entités à partir d’entités existantes",
    "createNewFeaturesFromExistingTip": "Option permettant à l’utilisateur de copier une entité existante pour créer de nouvelles entités",
    "copiedFeaturesOverrideDefaults": "Les valeurs des entités copiées remplacent les valeurs par défaut",
    "copiedFeaturesOverrideDefaultsTip": "Les valeurs des entités copiées remplacent les valeurs du modèle par défaut uniquement pour les champs appariés",
    "displayShapeSelectorTip": "Option permettant d’afficher une liste des options de dessin valides pour le modèle sélectionné.",
    "displayPresetTop": "Afficher la liste de valeurs prédéfinies au-dessus",
    "displayPresetTopTip": "Option permettant d’afficher la liste de valeurs prédéfinies au-dessus du sélecteur de modèles.",
    "listenToGroupFilter": "Appliquer des valeurs de filtre du widget Filtrer les groupes aux champs prédéfinis",
    "listenToGroupFilterTip": "Lorsqu'un filtre est appliqué dans le widget Filtrer les groupes, appliquez la valeur à un champ d'appariement dans la liste des valeurs prédéfinies.",
    "keepTemplateActive": "Conserver le modèle sélectionné actif",
    "keepTemplateActiveTip": "Lorsque le sélecteur de modèles est affiché, si un modèle a été précédemment sélectionné, resélectionnez-le.",
    "geometryEditDefault": "Autoriser la modification de géométrie par défaut",
    "autoSaveEdits": "Enregistre automatiquement la nouvelle entité.",
    "enableAttributeUpdates": "Afficher le bouton de mise à jour Actions des attributs lorsque le mode de mise à jour de la géométrie est actif",
    "enableAutomaticAttributeUpdates": "Appeler automatiquement une action d’attribut après une mise à jour de la géométrie",
    "enableLockingMapNavigation": "Activer le verrouillage de la navigation sur la carte",
    "enableMovingSelectedFeatureToGPS": "Activer le déplacement de l’entité ponctuelle sélectionnée vers l’emplacement GPS",
    "enableMovingSelectedFeatureToXY": "Activer le déplacement de l’entité ponctuelle sélectionnée vers l’emplacement XY",
    "featureTemplateLegendLabel": "Paramètres des valeurs de modèle d’entités et de filtre",
    "saveSettingsLegendLabel": "Enregistrer les paramètres",
    "geometrySettingsLegendLabel": "Paramètres de géométrie",
    "buttonPositionsLabel": "Position des boutons Enregistrer, Supprimer, Précédent et Effacer",
    "belowEditLabel": "Au-dessous du formulaire de modification",
    "aboveEditLabel": "Au-dessus du formulaire de modification",
    "layerSettingsTable": {
      "allowDelete": "Autoriser la suppression",
      "allowDeleteTip": "Autoriser la suppression : option qui permet à l’utilisateur de supprimer une entité. Désactivée si la couche ne prend pas en charge la suppression",
      "edit": "Modifiable",
      "editTip": "Modifiable : option qui permet d’inclure la couche dans le widget",
      "label": "Couche",
      "labelTip": "Couche : nom de la couche selon la définition de la carte",
      "update": "Désactiver la mise à jour de la géométrie",
      "updateTip": "Désactiver la mise à jour de la géométrie : option qui permet de désactiver la possibilité de déplacement de la géométrie une fois positionnée ou de déplacement de la géométrie sur une entité existante.",
      "allowUpdateOnly": "Mettre à jour uniquement",
      "allowUpdateOnlyTip": "Mettre à jour uniquement : option qui autorise uniquement la modification des entités existantes. Sélectionnée par défaut et désélectionnée si la couche ne prend pas en charge la création de nouvelles entités.",
      "fieldsTip": "Modifier les champs à mettre à jour et définir les attributs intelligents",
      "actionsTip": "Actions : option qui permet de mettre à jour des champs ou d’accéder aux couches/tables associées",
      "description": "Description",
      "descriptionTip": "Description : option qui permet de saisir le texte à afficher au-dessus de la page des attributs.",
      "relationTip": "Afficher les couches et tables associées"
    },
    "editFieldError": "Les modifications de champ et les attributs intelligents ne sont pas disponibles dans les couches non modifiables",
    "noConfigedLayersError": "Le widget Editeur intelligent requiert une ou plusieurs couches modifiables",
    "toleranceErrorMsg": "Valeur de tolérance d’intersection par défaut non valide"
  },
  "editDescriptionPage": {
    "title": "Définir le texte de vue d'ensemble des attributs de <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Configurer les champs de <b>${layername}</b>",
    "copyActionTip": "Actions des attributs",
    "editActionTip": "Actions intelligentes",
    "description": "Utilisez le bouton de mise à jour Actions pour activer les attributs intelligents sur une couche. Les attributs intelligents peuvent exiger, masquer ou désactiver un champ en fonction des valeurs d’autres champs. Utilisez le bouton de copie Actions pour activer et définir la source des valeurs de champs par intersection, adresse, coordonnées et valeur prédéfinie.",
    "fieldsNotes": "* est un champ obligatoire. Si vous désactivez Affichage pour ce champ, et que le modèle de mise à jour ne renseigne pas cette valeur de champ, vous ne pourrez pas enregistrer de nouvel enregistrement.",
    "smartAttachmentText": "Configurer l’action des pièces jointes intelligentes",
    "smartAttachmentPopupTitle": "Configurer les pièces jointes intelligentes de <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Affichage",
      "displayTip": "Afficher : déterminer si le champ n’est pas visible",
      "edit": "Modifiable",
      "editTip": "Modifiable : activer si le champ est présent dans le formulaire d’attribut",
      "fieldName": "Nom",
      "fieldNameTip": "Nom : nom du champ défini dans la base de données",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Alias : nom du champ défini dans la carte",
      "canPresetValue": "Prédéfini",
      "canPresetValueTip": "Valeur prédéfinie : option qui permet d’afficher le champ dans la liste des champs prédéfinis et qui autorise l’utilisateur à définir la valeur avant la mise à jour",
      "actions": "Actions",
      "actionsTip": "Actions : modifier l’ordre des champs ou configurer les attributs intelligents"
    },
    "smartAttSupport": "Les attributs intelligents ne sont pas pris en charge dans les champs de base de données requis"
  },
  "actionPage": {
    "title": "Configurer les actions des attributs de <b>${fieldname}</b>",
    "smartActionTitle": "Configurer les actions des attributs intelligents pour <b>${fieldname}</b>",
    "description": "Les actions sont toujours désactivées sauf si vous spécifiez leurs critères de déclenchement. Les actions sont traitées par ordre et une seule action est déclenchée par champ. Utilisez le bouton de mise à jour des critères pour définir ces derniers.",
    "copyAttributesNote": "La désactivation d’une action portant un nom de groupe revient à mettre à jour cette action de façon indépendante. L’action de ce champ est en outre supprimée du groupe correspondant.",
    "actionsSettingsTable": {
      "rule": "Opération",
      "ruleTip": "Action : action effectuée une fois le critère rempli",
      "expression": "Expression",
      "expressionTip": "Expression : l’expression obtenue au format SQL à partir des critères définis",
      "groupName": "Nom du groupe",
      "groupNameTip": "Nom du groupe : affiche le nom du groupe à partir duquel l’expression est appliquée",
      "actions": "Critère",
      "actionsTip": "Critères : modifier l’ordre de la règle et définir les critères lors de son déclenchement"
    },
    "copyAction": {
      "description": "Les sources des valeurs de champs sont traitées dans l’ordre si elles sont activées, jusqu’au déclenchement d’un critère valide ou jusqu’à la fin de la liste. Utiliser le bouton de mise à jour des critères pour définir le critère.",
      "intersection": "Intersection",
      "coordinates": "Coordonnées",
      "address": "Adresse",
      "preset": "Prédéfini",
      "actionText": "Actions",
      "criteriaText": "Critère",
      "enableText": "Activé"
    },
    "actions": {
      "hide": "Masquer",
      "required": "Obligatoire",
      "disabled": "Désactivé"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Avertissement : une mise à jour indépendante supprime du groupe l’action attributaire sélectionnée qui est associée à ce champ",
      "editGroupHint": "Avertissement : une mise à jour indépendante supprime du groupe l’action intelligente sélectionnée qui est associée à ce champ",
      "popupTitle": "Sélectionner l’option de mise à jour",
      "editAttributeGroup": "L’action attributaire sélectionnée est définie à partir du groupe. Pour mettre à jour l’action attributaire, sélectionnez l’une des options suivantes :",
      "expression": "L’expression de l’action intelligente sélectionnée est définie à partir du groupe. Pour mettre à jour l’expression de l’action intelligente, sélectionnez l’une des options suivantes :",
      "editGroupButton": "Mettre à jour le groupe",
      "editIndependentlyButton": "Mettre à jour indépendamment"
    }
  },
  "filterPage": {
    "submitHidden": "Soumettre les données attributaires de ce champ même s'il est masqué ?",
    "title": "Configurer l'expression de la règle ${action}",
    "filterBuilder": "Définir l'action sur le champ lorsque l'enregistrement correspond à ${any_or_all} des expressions suivantes",
    "noFilterTip": "A l'aide des outils ci-dessous, définissez l'instruction indiquant la période d'activité de l'action."
  },
  "geocoderPage": {
    "setGeocoderURL": "Définir l'URL du géocodeur",
    "hintMsg": "Remarque : vous modifiez le service de géocodeur. Veillez à mettre à jour les appariements de champs du géocodeur que vous avez configurés.",
    "invalidUrlTip": "L’URL ${URL} est incorrecte ou inaccessible."
  },
  "addressPage": {
    "popupTitle": "Adresse",
    "checkboxLabel": "Obtenir la valeur du géocodeur",
    "selectFieldTitle": "Attribut",
    "geocoderHint": "Pour modifier le géocodeur, utiliser le bouton 'Paramètres du géocodeur' dans les paramètres généraux",
    "prevConfigruedFieldChangedMsg": "L’attribut déjà configuré est introuvable dans les paramètres du géocodeur actuel. Les paramètres par défaut de l’attribut ont été rétablis."
  },
  "coordinatesPage": {
    "popupTitle": "Coordonnées",
    "checkboxLabel": "Obtenir les coordonnées",
    "coordinatesSelectTitle": "Système de coordonnées",
    "coordinatesAttributeTitle": "Attribut",
    "mapSpatialReference": "Référence spatiale de la carte",
    "latlong": "Latitude/Longitude",
    "allGroupsCreatedMsg": "Tous les groupes possibles sont déjà créés"
  },
  "presetPage": {
    "popupTitle": "Prédéfini",
    "checkboxLabel": "Le champ sera prédéfini",
    "presetValueLabel": "La valeur prédéfinie actuelle est :",
    "changePresetValueHint": "Pour modifier cette valeur prédéfinie, utiliser le bouton 'Définir des valeurs prédéfinies' dans les paramètres généraux"
  },
  "intersectionPage": {
    "groupNameLabel": "Nom",
    "dataTypeLabel": "Type de données",
    "ignoreLayerRankingCheckboxLabel": "Ignorer le classement des couches et trouver l’entité la plus proche parmi toutes les couches définies",
    "intersectingLayersLabel": "Couches dans lesquelles extraire une valeur",
    "layerAndFieldsApplyLabel": "Couches et champs auxquels appliquer la valeur extraite",
    "checkboxLabel": "Obtenir la valeur du champ de la couche d’intersection",
    "layerText": "Couches",
    "fieldText": "Champs",
    "actionsText": "Actions",
    "toleranceSettingText": "Paramètres de tolérance",
    "addLayerLinkText": "Ajouter une couche",
    "useDefaultToleranceText": "Utiliser la tolérance par défaut",
    "toleranceValueText": "Valeur de tolérance",
    "toleranceUnitText": "Unité de tolérance",
    "useLayerName": "- Utiliser le nom de la couche -",
    "noLayersMessage": "Aucun champ trouvé dans les couches de la carte ne correspond au type de données sélectionné."
  },
  "presetAll": {
    "popupTitle": "Définir les valeurs prédéfinies par défaut",
    "deleteTitle": "Supprimer la valeur prédéfinie.",
    "hintMsg": "Les noms uniques de tous les champs prédéfinis sont répertoriés ici. Si vous supprimez un champ prédéfini, le champ respectif est désactivé comme prédéfini pour toutes les couches/tables."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Tolérance d’intersection par défaut"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "Nouveau",
    "definedActions": "Actions définies",
    "priorityPopupTitle": "Définir la priorité des actions intelligentes",
    "priorityPopupColumnTitle": "Actions intelligentes",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Nom du groupe",
    "layerForExpressionLabel": "Couche pour l’expression",
    "layerForExpressionNote": "Remarque : les champs de la couche sélectionnée serviront à définir les critères",
    "expressionText": "Expression",
    "editExpressionLabel": "Mettre à jour l'expression",
    "layerAndFieldsApplyLabel": "Couches et champs d’application",
    "submitAttributeText": "Envoyer les données attributaires pour les champs masqués sélectionnés ?",
    "priorityColumnText": "Priorité",
    "requiredGroupNameMsg": "Cette valeur est requise",
    "uniqueGroupNameMsg": "Saisissez un nom de groupe unique. Un groupe de ce nom existe déjà.",
    "deleteGroupPopupTitle": "Supprimer le groupe des actions intelligentes",
    "deleteGroupPopupMsg": "La suppression du groupe entraîne la suppression de l’expression d’action de tous les champs associés.",
    "invalidExpression": "L’expression doit être renseignée",
    "warningMsgOnLayerChange": "L’expression définie et les champs auxquels elle est appliquée vont être effacés.",
    "smartActionsTable": {
      "name": "Nom",
      "expression": "Expression",
      "definedFor": "Définie pour"
    }
  },
  "attributeActionsPage": {
    "name": "Nom",
    "type": "Type",
    "deleteGroupPopupTitle": "Supprimer le groupe des actions attributaires",
    "deleteGroupPopupMsg": "La suppression du groupe entraîne la suppression de l’action attributaire de tous les champs associés.",
    "alreadyAppliedActionMsg": "L’action ${action} est déjà appliquée à ce champ."
  },
  "chooseFromLayer": {
    "fieldLabel": "Terrain",
    "valueLabel": "Valeur",
    "selectValueLabel": "Sélectionner une valeur"
  },
  "presetPopup": {
    "presetValueLAbel": "Valeur prédéfinie"
  },
  "dataType": {
    "esriFieldTypeString": "Chaîne",
    "esriFieldTypeInteger": "Nombre",
    "esriFieldTypeDate": "Date",
    "esriFieldTypeGUID": "GUID"
  }
});