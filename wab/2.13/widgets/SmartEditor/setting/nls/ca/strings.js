define({
  "layersPage": {
    "allLayers": "Totes les capes",
    "title": "Seleccioneu una plantilla per crear entitats",
    "generalSettings": "Configuració general",
    "layerSettings": "Configuració de capa",
    "smartActionsTabTitle": "Accions intel·ligents",
    "attributeActionsTabTitle": "Accions d'atributs",
    "presetValueText": "Defineix els valors predefinits",
    "geocoderSettingsText": "Configuració del geocodificador",
    "editDescription": "Proporcioneu text de visualització per a la subfinestra d'edició",
    "editDescriptionTip": "Aquest text es mostra sobre el selector de plantilles. Deixeu-lo en blanc si no voleu utilitzar cap text.",
    "promptOnSave": "Sol·licitud per desar edicions no desades quan es tanca el formulari o es canvia al següent registre.",
    "promptOnSaveTip": "Visualitzeu una sol·licitud quan l'usuari faci clic a Tanca o navegui al següent registre editable si l'entitat actual té edicions sense desar.",
    "promptOnDelete": "Demana confirmació quan se suprimeixi un registre.",
    "promptOnDeleteTip": "Visualitzeu una sol·licitud quan l'usuari faci clic a Suprimeix per confirmar l'acció.",
    "removeOnSave": "Elimineu l'entitat de la selecció en desar.",
    "removeOnSaveTip": "Opció per eliminar l'entitat del conjunt de selecció en desar el registre. Si és l'únic registre seleccionat, la subfinestra torna a canviar a la pàgina de la plantilla.",
    "useFilterEditor": "Utilitza el filtre de plantilla d'entitat",
    "useFilterEditorTip": "Opció per utilitzar el selector de plantilles de filtre que permet veure la plantilla d'una capa o cercar plantilles pel nom.",
    "displayShapeSelector": "Mostra les opcions de dibuix",
    "createNewFeaturesFromExisting": "Permet que l'usuari creï noves entitats a partir d'entitats existents",
    "createNewFeaturesFromExistingTip": "Opció per permetre que l'usuari copiï una entitat existent per crear entitats noves",
    "copiedFeaturesOverrideDefaults": "Els valors de les entitats copiades invaliden els valors per defecte",
    "copiedFeaturesOverrideDefaultsTip": "Els valors de les entitats copiades invalidaran els valors de la plantilla per defecte només per als camps coincidents",
    "displayShapeSelectorTip": "Opció per mostrar una llista d'opcions de dibuix vàlides per a la plantilla seleccionada.",
    "displayPresetTop": "Mostra la llista de valors predefinits a sobre",
    "displayPresetTopTip": "Opció per mostrar la llista de valors predefinits sobre el selector de plantilles.",
    "listenToGroupFilter": "Aplica valors de filtre del widget Filtre de grup als camps predefinits",
    "listenToGroupFilterTip": "Quan s'apliqui un filtre al widget Filtre de grup, apliqueu el valor a un camp coincident de la llista de valors predefinits.",
    "keepTemplateActive": "Mantén activa la plantilla seleccionada",
    "keepTemplateActiveTip": "Quan es mostri el selector de plantilles, si hi ha una plantilla seleccionada anteriorment, torneu a seleccionar-la.",
    "geometryEditDefault": "Habilita l'edició de geometria per defecte",
    "autoSaveEdits": "Desa l'entitat nova automàticament",
    "enableAttributeUpdates": "Mostra el botó d'actualització d'accions d'atributs quan l'opció d'edició de la geometria estigui activa",
    "enableAutomaticAttributeUpdates": "Crida automàticament l'acció d'atribut després de l'actualització de la geometria",
    "enableLockingMapNavigation": "Habilita el bloqueig de la navegació pel mapa",
    "enableMovingSelectedFeatureToGPS": "Habilita el moviment de l'entitat de punt seleccionada a la ubicació GPS",
    "enableMovingSelectedFeatureToXY": "Habilita el moviment de l'entitat de punt seleccionada a la ubicació XY",
    "featureTemplateLegendLabel": "Configuració del valors de Plantilla d'entitats i Filtre",
    "saveSettingsLegendLabel": "Desa la configuració",
    "geometrySettingsLegendLabel": "Configuració de la geometria",
    "buttonPositionsLabel": "Posició dels botons Desa, Suprimeix, Enrere i Esborra",
    "belowEditLabel": "A sota d'Edita el formulari",
    "aboveEditLabel": "A sobre d'Edita el formulari",
    "layerSettingsTable": {
      "allowDelete": "Permet la supressió",
      "allowDeleteTip": "Permet la supressió: opció que permet que l'usuari suprimeixi una entitat; està deshabilitada si la capa no admet supressions",
      "edit": "Editable",
      "editTip": "Editable: opció per incloure la capa al widget",
      "label": "Capa",
      "labelTip": "Capa: nom de la capa tal com està definida al mapa",
      "update": "Deshabilita l'edició de geometria",
      "updateTip": "Deshabilita l'edició de geometria: opció per deshabilitar la funció per moure la geometria un cop inserida o per moure-la a una entitat existent",
      "allowUpdateOnly": "Només actualitzar",
      "allowUpdateOnlyTip": "Només actualitzar: opció per permetre únicament la modificació d'entitats existents; està activada per defecte i es desactiva si la capa no admet la creació d'entitats noves",
      "fieldsTip": "Modifica els camps que s'han d'editar i defineix els atributs intel·ligents",
      "actionsTip": "Accions: opció per editar els camps o accedir a capes o taules relacionades",
      "description": "Descripció",
      "descriptionTip": "Descripció: opció que permet introduir text perquè es mostri a la part superior de la pàgina d'atributs.",
      "relationTip": "Visualitza capes i taules relacionades"
    },
    "editFieldError": "Les modificacions de camps i els atributs intel·ligents no estan disponibles per a les capes que no es poden editar",
    "noConfigedLayersError": "L'Editor intel·ligent necessita una o més capes editables",
    "toleranceErrorMsg": "Valor de Tolerància d'intersecció per defecte no vàlid"
  },
  "editDescriptionPage": {
    "title": "Defineix el text de descripció general de l'atribut de <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Configura els camps de <b>${layername}</b>",
    "copyActionTip": "Accions d'atributs",
    "editActionTip": "Accions intel·ligents",
    "description": "Utilitzeu el botó d'edició d'accions per activar els atributs intel·ligents en una capa. Els atributs intel·ligents poden exigir, amagar o deshabilitar un camp en funció dels valors dels altres camps. Utilitzeu el botó de còpia d'accions per activar i definir l'origen del valor del camp per intersecció, adreça, coordenades i valor predefinit.",
    "fieldsNotes": "* És un camp obligatori. Si desactiveu la visualització d'aquest camp i la plantilla d'edició no emplena el valor d'aquest camp, no podreu desar un registre nou.",
    "smartAttachmentText": "Configura l'acció de fitxers adjunts intel·ligents",
    "smartAttachmentPopupTitle": "Configura els fitxers adjunts intel·ligents de <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Mostra",
      "displayTip": "Mostra: determina si el camp no és visible",
      "edit": "Editable",
      "editTip": "Editable: activa aquesta opció si el camp està present al formulari d'atributs",
      "fieldName": "Nom",
      "fieldNameTip": "Nom: nom del camp definit a la base de dades",
      "fieldAlias": "Àlies",
      "fieldAliasTip": "Àlies: nom del camp definit al mapa",
      "canPresetValue": "Predefineix",
      "canPresetValueTip": "Predefineix: opció per mostrar el camp a la llista de camps predefinits i permetre que l'usuari defineixi el valor abans de l'edició",
      "actions": "Accions",
      "actionsTip": "Accions: canvieu l'ordre dels camps o configureu els atributs intel·ligents"
    },
    "smartAttSupport": "Els atributs intel·ligents no s'admeten als camps de base de dades obligatoris"
  },
  "actionPage": {
    "title": "Configura les accions d'atributs de <b>${fieldname}</b>",
    "smartActionTitle": "Configura les accions d'atributs intel·ligents de <b>${fieldname}</b>",
    "description": "Les accions estan sempre desactivades llevat que s'especifiquin els criteris que faran que s'activin. Les accions es processen en ordre i només s'activarà una acció per camp. Utilitzeu el botó d'edició de criteris per definir-los.",
    "copyAttributesNote": "Deshabilitar qualsevol acció que tingui nom de grup serà el mateix que editar l'acció de manera independent; s'eliminarà l'acció del camp del grup respectiu.",
    "actionsSettingsTable": {
      "rule": "Acció",
      "ruleTip": "Acció: acció que es realitza quan es compleixen els criteris",
      "expression": "Expressió",
      "expressionTip": "Expressió: expressió que resulta del criteri definit en format SQL",
      "groupName": "Nom del grup",
      "groupNameTip": "Nom del grup: mostra el nom del grup des del qual s'ha aplicat l'expressió",
      "actions": "Criteris",
      "actionsTip": "Criteris: canvien l'ordre de la regla i defineixen els criteris que s'aplicaran quan s'activi"
    },
    "copyAction": {
      "description": "L'origen del valor del camp es processa en ordre si està activat fins que s'activa un criteri vàlid o es completa la llista. Utilitzeu el botó d'edició de criteri per definir el criteri.",
      "intersection": "Intersecció",
      "coordinates": "Coordenades",
      "address": "Adreça",
      "preset": "Predefineix",
      "actionText": "Accions",
      "criteriaText": "Criteri",
      "enableText": "Habilitat"
    },
    "actions": {
      "hide": "Amaga",
      "required": "Obligatori",
      "disabled": "Deshabilitat"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Avís: l'edició independent eliminarà del grup l'acció d'atribut seleccionada associada d'aquest camp",
      "editGroupHint": "Avís: l'edició independent eliminarà del grup l'acció intel·ligent seleccionada associada d'aquest camp",
      "popupTitle": "Trieu l'opció d'edició",
      "editAttributeGroup": "L'acció d'atribut seleccionada es defineix des del grup. Trieu una de les opcions següents per editar l'acció d'atribut:",
      "expression": "L'expressió de l'acció intel·ligent seleccionada es defineix des del grup. Trieu una de les opcions següents per editar l'expressió de l'acció intel·ligent:",
      "editGroupButton": "Edita el grup",
      "editIndependentlyButton": "Edita de manera independent"
    }
  },
  "filterPage": {
    "submitHidden": "Voleu enviar dades d'atributs per a aquest camp encara que estigui amagat?",
    "title": "Configura l'expressió de la regla ${action}",
    "filterBuilder": "Defineix l'acció al camp quan el registre coincideixi, de les expressions següents, amb ${any_or_all}",
    "noFilterTip": "Amb les eines següents, definiu la declaració per als casos en què l'acció estigui activa."
  },
  "geocoderPage": {
    "setGeocoderURL": "Defineix la URL del geocodificador",
    "hintMsg": "Nota: esteu canviant el servei de geocodificador. Assegureu-vos d'actualitzar les assignacions de camps del geocodificador que teniu configurades.",
    "invalidUrlTip": "L'adreça URL ${URL} no és vàlida o no s'hi pot accedir."
  },
  "addressPage": {
    "popupTitle": "Adreça",
    "checkboxLabel": "Obteniu el valor del geocodificador",
    "selectFieldTitle": "Atribut",
    "geocoderHint": "Per canviar el geocodificador, aneu al botó \"Configuració del geocodificador\" a la configuració general",
    "prevConfigruedFieldChangedMsg": "L'atribut configurat anteriorment no es troba a la configuració del geocodificador actual. L'atribut s'ha restablert al valor per defecte."
  },
  "coordinatesPage": {
    "popupTitle": "Coordenades",
    "checkboxLabel": "Obteniu les coordenades",
    "coordinatesSelectTitle": "Sistema de coordenades",
    "coordinatesAttributeTitle": "Atribut",
    "mapSpatialReference": "Referència espacial del mapa",
    "latlong": "Latitud/longitud",
    "allGroupsCreatedMsg": "Tots els grups possibles ja s'han creat"
  },
  "presetPage": {
    "popupTitle": "Predefineix",
    "checkboxLabel": "El camp estarà predefinit",
    "presetValueLabel": "El valor predefinit actual és:",
    "changePresetValueHint": "Per canviar el valor predefinit, aneu al botó \"Defineix els valors predefinits\" a la configuració general"
  },
  "intersectionPage": {
    "groupNameLabel": "Nom",
    "dataTypeLabel": "Tipus de dades",
    "ignoreLayerRankingCheckboxLabel": "Ignora la classificació de capes i troba l'entitat més propera entre totes les capes definides",
    "intersectingLayersLabel": "Capes de les quals s'extraurà un valor",
    "layerAndFieldsApplyLabel": "Capes i camps als quals s'aplicarà el valor extret",
    "checkboxLabel": "Obteniu el valor del camp de la capa d'intersecció",
    "layerText": "Capes",
    "fieldText": "Camps",
    "actionsText": "Accions",
    "toleranceSettingText": "Configuració de tolerància",
    "addLayerLinkText": "Afegeix una capa",
    "useDefaultToleranceText": "Utilitza la tolerància per defecte",
    "toleranceValueText": "Valor de tolerància",
    "toleranceUnitText": "Unitat de tolerància",
    "useLayerName": "- Utilitza el nom de la capa -",
    "noLayersMessage": "No s'ha trobat cap camp en cap capa del mapa que coincideixi amb el tipus de dades seleccionat."
  },
  "presetAll": {
    "popupTitle": "Defineix els valors predefinits per defecte",
    "deleteTitle": "Suprimeix el valor predefinit",
    "hintMsg": "Els noms de tots els camps predefinits únics s'enumeren aquí. L'eliminació del camp predefinit deshabilitarà el camp respectiu com a valor predefinit de totes les capes o taules."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Tolerància d'intersecció per defecte"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "Afegeix-ne una de nova",
    "definedActions": "Accions definides",
    "priorityPopupTitle": "Defineix la prioritat de les accions intel·ligents",
    "priorityPopupColumnTitle": "Accions intel·ligents",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Nom del grup",
    "layerForExpressionLabel": "Capa de l'expressió",
    "layerForExpressionNote": "Nota: els camps de la capa seleccionada s'utilitzaran per definir els criteris",
    "expressionText": "Expressió",
    "editExpressionLabel": "Edita l'expressió",
    "layerAndFieldsApplyLabel": "Capes i camps on s'aplicarà",
    "submitAttributeText": "Voleu enviar les dades d'atributs dels camps amagats seleccionats?",
    "priorityColumnText": "Prioritat",
    "requiredGroupNameMsg": "Aquest valor és obligatori",
    "uniqueGroupNameMsg": "Introduïu un nom de grup únic, ja existeix un grup amb aquest nom.",
    "deleteGroupPopupTitle": "Suprimeix el grup d'accions intel·ligents",
    "deleteGroupPopupMsg": "En suprimir el grup s'eliminarà l'expressió de l'acció de tots els camps associats.",
    "invalidExpression": "El camp Expressió no pot estar en blanc",
    "warningMsgOnLayerChange": "L'expressió definida i els camps on s'ha aplicat s'esborraran.",
    "smartActionsTable": {
      "name": "Nom",
      "expression": "Expressió",
      "definedFor": "Definit per a"
    }
  },
  "attributeActionsPage": {
    "name": "Nom",
    "type": "Tipus",
    "deleteGroupPopupTitle": "Suprimeix el grup d'accions d'atribut",
    "deleteGroupPopupMsg": "En suprimir el grup s'eliminarà l'acció d'atribut de tots els camps associats.",
    "alreadyAppliedActionMsg": "L'acció ${action} ja s'ha aplicat en aquest camp."
  },
  "chooseFromLayer": {
    "fieldLabel": "Camp",
    "valueLabel": "Valor",
    "selectValueLabel": "Seleccioneu un valor"
  },
  "presetPopup": {
    "presetValueLAbel": "Valor predefinit"
  },
  "dataType": {
    "esriFieldTypeString": "Cadena",
    "esriFieldTypeInteger": "Nombre",
    "esriFieldTypeDate": "Data",
    "esriFieldTypeGUID": "GUID"
  }
});