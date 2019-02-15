define({
  "layersPage": {
    "allLayers": "Totes les capes",
    "title": "Seleccioneu una plantilla per crear entitats",
    "generalSettings": "Configuració general",
    "layerSettings": "Configuració de capa",
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
    "buttonPositionsLabel": "Posició dels botons Desa, Suprimeix, Enrere i Esborra la selecció",
    "belowEditLabel": "A sota d'Edita el formulari",
    "aboveEditLabel": "A sobre d'Edita el formulari",
    "layerSettingsTable": {
      "allowDelete": "Permet la supressió",
      "allowDeleteTip": "Opció que permet que l'usuari suprimeixi una entitat; està deshabilitada si la capa no admet supressions.",
      "edit": "Editable",
      "editTip": "Opció per incloure la capa al widget",
      "label": "Capa",
      "labelTip": "Nom de la capa definit al mapa",
      "update": "Deshabilita l'edició de geometria",
      "updateTip": "Opció per deshabilitar la funció per moure la geometria un cop inserida o per moure-la a una entitat existent",
      "allowUpdateOnly": "Només actualitzar",
      "allowUpdateOnlyTip": "Opció per permetre únicament la modificació d'entitats existents. Està activada per defecte i es desactiva si la capa no admet la creació d'entitats noves.",
      "fieldsTip": "Modifica els camps que s'han d'editar i defineix els atributs intel·ligents",
      "actionsTip": "Opció per editar els camps o accedir a capes o taules relacionades",
      "description": "Descripció",
      "descriptionTip": "Opció que permet introduir text perquè es mostri a la part superior de la pàgina d'atributs.",
      "relationTip": "Visualitza capes i taules relacionades"
    },
    "editFieldError": "Les modificacions de camps i els atributs intel·ligents no estan disponibles per a les capes que no es poden editar",
    "noConfigedLayersError": "L'Editor intel·ligent necessita una o més capes editables"
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
      "displayTip": "Determina si el camp no és visible",
      "edit": "Editable",
      "editTip": "Activa aquesta opció si el camp està present al formulari d'atributs",
      "fieldName": "Nom",
      "fieldNameTip": "Nom del camp definit a la base de dades",
      "fieldAlias": "Àlies",
      "fieldAliasTip": "Nom del camp definit al mapa",
      "canPresetValue": "Predefineix",
      "canPresetValueTip": "Opció per mostrar el camp a la llista de camps predefinits i permetre que l'usuari defineixi el valor abans de l'edició",
      "actions": "Accions",
      "actionsTip": "Canvieu l'ordre dels camps o configureu els atributs intel·ligents"
    },
    "smartAttSupport": "Els atributs intel·ligents no s'admeten als camps de base de dades obligatoris"
  },
  "actionPage": {
    "title": "Configura les accions d'atributs de <b>${fieldname}</b>",
    "smartActionTitle": "Configura les accions d'atributs intel·ligents de <b>${fieldname}</b>",
    "description": "Les accions estan sempre desactivades llevat que s'especifiquin els criteris que faran que s'activin. Les accions es processen en ordre i només s'activarà una acció per camp. Utilitzeu el botó d'edició de criteris per definir-los.",
    "actionsSettingsTable": {
      "rule": "Acció",
      "ruleTip": "Acció que es realitza quan es compleixen els criteris",
      "expression": "Expressió",
      "expressionTip": "Expressió que resulta del criteri definit en format SQL",
      "actions": "Criteris",
      "actionsTip": "Canvia l'ordre de la regla i defineix els criteris que s'aplicaran quan s'activi"
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
    "selectFieldTitle": "Atribut:",
    "geocoderHint": "Per canviar el geocodificador, aneu al botó \"Configuració del geocodificador\" a la configuració general"
  },
  "coordinatesPage": {
    "popupTitle": "Coordenades",
    "checkboxLabel": "Obteniu les coordenades",
    "coordinatesSelectTitle": "Sistema de coordenades:",
    "coordinatesAttributeTitle": "Atribut:",
    "mapSpatialReference": "Referència espacial del mapa",
    "latlong": "Latitud/longitud"
  },
  "presetPage": {
    "popupTitle": "Predefineix",
    "checkboxLabel": "El camp estarà predefinit",
    "presetValueLabel": "El valor predefinit actual és:",
    "changePresetValueHint": "Per canviar el valor predefinit, aneu al botó \"Defineix els valors predefinits\" a la configuració general"
  },
  "intersectionPage": {
    "checkboxLabel": "Obteniu el valor del camp de la capa d'intersecció",
    "layerText": "Capes",
    "fieldText": "Camps",
    "actionsText": "Accions",
    "addLayerLinkText": "Afegeix una capa"
  },
  "presetAll": {
    "popupTitle": "Defineix els valors predefinits per defecte",
    "deleteTitle": "Suprimeix el valor predefinit",
    "hintMsg": "Els noms de tots els camps predefinits únics s'enumeren aquí. L'eliminació del camp predefinit deshabilitarà el camp respectiu com a valor predefinit de totes les capes o taules."
  }
});