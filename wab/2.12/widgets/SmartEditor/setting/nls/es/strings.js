define({
  "layersPage": {
    "allLayers": "Todas las capas",
    "title": "Seleccionar una plantilla para crear entidades",
    "generalSettings": "Configuración general",
    "layerSettings": "Configuraciones de la capa",
    "smartActionsTabTitle": "Acciones inteligentes",
    "attributeActionsTabTitle": "Acciones de atributos",
    "presetValueText": "Definir valores predefinidos",
    "geocoderSettingsText": "Ajustes de geocodificador",
    "editDescription": "Proporcione texto de visualización para el panel de edición",
    "editDescriptionTip": "Este texto se muestra sobre el selector de plantillas. Déjelo en blanco si no desea usar ningún texto.",
    "promptOnSave": "Solicitud para guardar las ediciones no guardadas cuando se cierra el formulario o se cambia al siguiente registro.",
    "promptOnSaveTip": "Muestra una solicitud cuando el usuario hace clic en Cerrar o va al siguiente registro editable si la entidad actual tiene ediciones sin guardar.",
    "promptOnDelete": "Requerir confirmación al eliminar un registro",
    "promptOnDeleteTip": "Muestra una solicitud cuando el usuario hace clic en Eliminar para confirmar la acción.",
    "removeOnSave": "Eliminar entidad de la selección al guardar",
    "removeOnSaveTip": "Opción para eliminar la entidad del conjunto de selección al guardar el registro. Si es el único registro seleccionado, el panel vuelve a cambiar a la página de plantilla.",
    "useFilterEditor": "Usar filtro de plantilla de entidad",
    "useFilterEditorTip": "Opción para usar el selector de plantillas de filtro que permite ver la plantilla de una capa o buscar plantillas por nombre.",
    "displayShapeSelector": "Mostrar opciones de dibujo",
    "createNewFeaturesFromExisting": "Permitir al usuario crear entidades nuevas a partir de entidades existentes",
    "createNewFeaturesFromExistingTip": "Opción que permite al usuario copiar la entidad existente para crear entidades nuevas",
    "copiedFeaturesOverrideDefaults": "Los valores de las entidades copiadas invalidan los valores predeterminados",
    "copiedFeaturesOverrideDefaultsTip": "Los valores de las entidades copiadas invalidarán los valores predeterminados de la plantilla únicamente para los campos que coincidan.",
    "displayShapeSelectorTip": "Una opción para mostrar una lista de opciones de dibujo válidas para la plantilla seleccionada.",
    "displayPresetTop": "Visualizar lista de valores predefinidos encima",
    "displayPresetTopTip": "Una opción para mostrar la lista de valores predefinidos por encima del selector de plantillas.",
    "listenToGroupFilter": "Aplicar valores de filtro del widget Filtro de grupo a los campos predefinidos",
    "listenToGroupFilterTip": "Cuando se aplica un filtro en el widget Filtro de grupo, aplica el valor a un campo coincidente de la lista de valores predefinidos.",
    "keepTemplateActive": "Mantener plantilla seleccionada activa",
    "keepTemplateActiveTip": "Cuando se muestra el selector de plantillas, si se seleccionó una plantilla previamente, vuelve a seleccionarla.",
    "geometryEditDefault": "Habilitar edición de geometría de forma predeterminada",
    "autoSaveEdits": "Guardar la nueva entidad automáticamente",
    "enableAttributeUpdates": "Mostrar el botón de actualización de Acciones de atributo si Editar geometría está activo",
    "enableAutomaticAttributeUpdates": "Llamar automáticamente a Acción de atributo tras actualizar la geometría",
    "enableLockingMapNavigation": "Habilitar el bloqueo de la navegación en el mapa",
    "enableMovingSelectedFeatureToGPS": "Habilitar el movimiento de la entidad de punto seleccionada a una ubicación GPS",
    "enableMovingSelectedFeatureToXY": "Habilitar el movimiento de la entidad de punto seleccionada a una ubicación XY",
    "featureTemplateLegendLabel": "Ajustes de plantillas de entidad y valores de filtro",
    "saveSettingsLegendLabel": "Guardar configuración",
    "geometrySettingsLegendLabel": "Ajustes de geometría",
    "buttonPositionsLabel": "Posición de los botones Guardar, Eliminar, Atrás y Borrar selección",
    "belowEditLabel": "Por debajo del formulario de edición",
    "aboveEditLabel": "Por encima del formulario de edición",
    "layerSettingsTable": {
      "allowDelete": "Permitir eliminación",
      "allowDeleteTip": "Permitir eliminación - Opción que permite al usuario eliminar una entidad; estará deshabilitada si la capa no admite eliminaciones",
      "edit": "Editable",
      "editTip": "Editable - Opción que permite incluir la capa en el widget",
      "label": "Capa",
      "labelTip": "Capa - Nombre de la capa tal y como está definido en el mapa.",
      "update": "Deshabilitar edición de geometría",
      "updateTip": "Deshabilitar edición de geometría - Opción que permite deshabilitar la capacidad de mover la geometría una vez insertada o de mover la geometría a una entidad ya existente",
      "allowUpdateOnly": "Sólo actualizar",
      "allowUpdateOnlyTip": "Solo actualizar - Opción que permite únicamente la modificación de entidades ya existentes; está activada de manera predeterminada y se deshabilitará si la capa no admite la creación de nuevas entidades",
      "fieldsTip": "Modifique los campos que se van a editar y defina atributos inteligentes",
      "actionsTip": "Acciones - Opción que permite editar campos o acceder a capas/tablas relacionadas",
      "description": "Descripción",
      "descriptionTip": "Descripción - Opción que permite introducir texto para que se muestre en la parte superior de la página de atributos.",
      "relationTip": "Ver capas y tablas relacionadas"
    },
    "editFieldError": "Las modificaciones de campos y los atributos inteligentes no están disponibles para las capas que no son editables",
    "noConfigedLayersError": "El Editor inteligente requiere una o varias capas editables",
    "toleranceErrorMsg": "Valor de tolerancia de intersección predeterminada no válido"
  },
  "editDescriptionPage": {
    "title": "Definir texto de descripción general de atributo para <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Configurar campos para <b>${layername}</b>",
    "copyActionTip": "Acciones de atributos",
    "editActionTip": "Acciones inteligentes",
    "description": "Use el botón de edición de acciones para activar los atributos inteligentes en una capa. Los atributos inteligentes pueden requerir, ocultar o deshabilitar un campo en función de los valores de otros campos. Use el botón de copia de acciones para activar y definir fuentes de valores de campos por intersección, dirección, coordenadas y valor predefinido.",
    "fieldsNotes": "* es un campo obligatorio. Si desactiva Vista para este campo y la plantilla de edición no rellena ese valor de campo, no podrá guardar un nuevo registro.",
    "smartAttachmentText": "Configurar la acción de adjuntos inteligentes",
    "smartAttachmentPopupTitle": "Configurar adjuntos inteligentes para <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Vista",
      "displayTip": "Mostrar - Determina si el campo no está visible",
      "edit": "Editable",
      "editTip": "Editable - Active esta opción si el campo está presente en el formulario de atributos",
      "fieldName": "Nombre",
      "fieldNameTip": "Nombre - Nombre del campo definido en la base de datos",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Alias - Nombre del campo definido en el mapa",
      "canPresetValue": "Predefinido",
      "canPresetValueTip": "Predefinido - Opción que permite mostrar el campo en la lista de campos predefinidos y permite al usuario definir el valor antes de editar",
      "actions": "Acciones",
      "actionsTip": "Acciones - Cambie el orden de los campos o configure atributos inteligentes"
    },
    "smartAttSupport": "Los atributos inteligentes no se admiten en los campos de base de datos obligatorios"
  },
  "actionPage": {
    "title": "Configurar las acciones de atributos para <b>${fieldname}</b>",
    "smartActionTitle": "Configurar las acciones de atributos inteligentes para <b>${fieldname}</b>",
    "description": "Las acciones están siempre desactivadas a menos que se especifiquen los criterios que harán que se activen. Las acciones se procesan en orden y solo se activará una acción por campo. Use el botón de edición de criterios para definir los criterios.",
    "copyAttributesNote": "Deshabilitar cualquier acción que tenga nombre de grupo equivale a editar esa acción independientemente; además, la acción de este campo se eliminará de su respectivo grupo.",
    "actionsSettingsTable": {
      "rule": "Acción",
      "ruleTip": "Acción - Acción realizada cuando se cumplen los criterios",
      "expression": "Expresión",
      "expressionTip": "Expresión - Expresión resultante del criterio definido en formato SQL",
      "groupName": "Nombre de grupo",
      "groupNameTip": "Nombre de grupo - Muestra el nombre de grupo desde el que se aplica la expresión",
      "actions": "Criterios",
      "actionsTip": "Criterio - Cambie el orden de la regla y defina los criterios cuando se active"
    },
    "copyAction": {
      "description": "Si se activa, los orígenes de valores de campo se procesan en orden hasta que se dispara un criterio válido o hasta que se completa la lista. Use el botón de edición de criterios para definir los criterios.",
      "intersection": "Intersección",
      "coordinates": "Coordenadas",
      "address": "Dirección",
      "preset": "Predefinido",
      "actionText": "Acciones",
      "criteriaText": "Criterios",
      "enableText": "Habilitado"
    },
    "actions": {
      "hide": "Ocultar",
      "required": "Obligatorio",
      "disabled": "Deshabilitado"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Advertencia: Editar de forma independiente eliminará del grupo la acción de atributos seleccionada asociada a este campo",
      "editGroupHint": "Advertencia: Editar de forma independiente eliminará del grupo la acción inteligente seleccionada asociada a este campo",
      "popupTitle": "Elegir opción de edición",
      "editAttributeGroup": "La acción de atributos seleccionada se define desde el grupo. Elija una de las siguientes opciones para editar la acción de atributos:",
      "expression": "La expresión de la acción inteligente seleccionada se define desde el grupo. Elija una de las siguientes opciones para editar la expresión de acción inteligente:",
      "editGroupButton": "Editar grupo",
      "editIndependentlyButton": "Editar de forma independiente"
    }
  },
  "filterPage": {
    "submitHidden": "¿Enviar datos de atributos para este campo aunque esté oculto?",
    "title": "Configurar expresión para la regla ${action}",
    "filterBuilder": "Definir acción en el campo cuando el registro coincida con ${any_or_all} de las expresiones siguientes",
    "noFilterTip": "Con las herramientas siguientes, defina la declaración para los casos en los que la acción esté activa."
  },
  "geocoderPage": {
    "setGeocoderURL": "Establecer dirección URL de geocodificador",
    "hintMsg": "Nota: Está cambiando el servicio de geocodificador. Asegúrese de actualizar las asignaciones de campos de geocodificador que tenga configuradas.",
    "invalidUrlTip": "No se puede acceder a la dirección URL ${URL} o bien no es válida."
  },
  "addressPage": {
    "popupTitle": "Dirección",
    "checkboxLabel": "Obtener valor del geocodificador",
    "selectFieldTitle": "Atributos",
    "geocoderHint": "para cambiar el geocodificador, vaya al botón 'Ajustes de geocodificador' en los ajustes generales",
    "prevConfigruedFieldChangedMsg": "No se encontró el atributo configurado anteriormente en la configuración del geocodificador actual. El atributo se ha restablecido al valor predeterminado."
  },
  "coordinatesPage": {
    "popupTitle": "Coordenadas",
    "checkboxLabel": "Obtener coordenadas",
    "coordinatesSelectTitle": "Sistema de coordenadas",
    "coordinatesAttributeTitle": "Atributo",
    "mapSpatialReference": "Asignar referencia espacial",
    "latlong": "Latitud/longitud",
    "allGroupsCreatedMsg": "Ya se han creado todos los grupos posibles"
  },
  "presetPage": {
    "popupTitle": "Predefinido",
    "checkboxLabel": "El campo se predefinirá",
    "presetValueLabel": "El valor predefinido actual es:",
    "changePresetValueHint": "Para cambiar este valor predefinido, vaya al botón 'Definir valores predefinidos' en los ajustes generales"
  },
  "intersectionPage": {
    "groupNameLabel": "Nombre",
    "dataTypeLabel": "Tipo de datos",
    "ignoreLayerRankingCheckboxLabel": "Ignorar la clasificación de capas y buscar la entidad más cercana en todas las capas definidas",
    "intersectingLayersLabel": "Capas de las que extraer un valor",
    "layerAndFieldsApplyLabel": "Capas y campos a los que aplicar el valor extraído",
    "checkboxLabel": "Obtener valor del campo de la capa de intersección",
    "layerText": "Capas",
    "fieldText": "Campos",
    "actionsText": "Acciones",
    "toleranceSettingText": "Configuración de tolerancia",
    "addLayerLinkText": "Agregar una capa",
    "useDefaultToleranceText": "Usar tolerancia predeterminada",
    "toleranceValueText": "Valor de tolerancia",
    "toleranceUnitText": "Unidad de tolerancia",
    "useLayerName": "- Usar nombre de capa -",
    "noLayersMessage": "No se encontró en ninguna capa del mapa ningún campo que coincida con el tipo de datos seleccionado."
  },
  "presetAll": {
    "popupTitle": "Definir los valores predefinidos predeterminados",
    "deleteTitle": "Eliminar valor predefinido",
    "hintMsg": "Aquí se enumeran todos los nombres de campos predefinidos únicos. Al eliminar un campo predefinido, se desactiva el campo correspondiente como predefinido de todas las capas/tablas."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Tolerancia de intersección predeterminada"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "Añadir nuevo",
    "definedActions": "Acciones definidas",
    "priorityPopupTitle": "Establecer prioridad de Acciones inteligentes",
    "priorityPopupColumnTitle": "Acciones inteligentes",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Nombre de grupo",
    "layerForExpressionLabel": "Capa para expresión",
    "layerForExpressionNote": "Nota: Los campos de las capas seleccionadas se utilizarán para definir criterios",
    "expressionText": "Expresión",
    "editExpressionLabel": "Editar expresión",
    "layerAndFieldsApplyLabel": "Capa y campos en los que aplicar",
    "submitAttributeText": "¿Desea enviar los datos de atributos de los campos ocultos seleccionados?",
    "priorityColumnText": "Prioridad",
    "requiredGroupNameMsg": "Este valor es obligatorio",
    "uniqueGroupNameMsg": "Introduzca un nombre de grupo único; ya existe un grupo con este nombre.",
    "deleteGroupPopupTitle": "Eliminar grupo de Acciones inteligentes",
    "deleteGroupPopupMsg": "Al eliminar el grupo se eliminará la expresión de la acción de todos los campos asociados.",
    "invalidExpression": "La expresión no puede estar en blanco",
    "warningMsgOnLayerChange": "Se borrarán la expresión definida y los campos a los que se aplica.",
    "smartActionsTable": {
      "name": "Nombre",
      "expression": "Expresión",
      "definedFor": "Definida para"
    }
  },
  "attributeActionsPage": {
    "name": "Nombre",
    "type": "Tipo",
    "deleteGroupPopupTitle": "Eliminar grupo de acciones de atributos",
    "deleteGroupPopupMsg": "Al eliminar el grupo se eliminará la acción de atributos de todos los campos asociados.",
    "alreadyAppliedActionMsg": "Ya se ha aplicado la acción ${action} en este campo."
  },
  "chooseFromLayer": {
    "fieldLabel": "Campo",
    "valueLabel": "Valor",
    "selectValueLabel": "Seleccione un valor"
  },
  "presetPopup": {
    "presetValueLAbel": "Valor predefinido"
  },
  "dataType": {
    "esriFieldTypeString": "Cadena",
    "esriFieldTypeInteger": "Número",
    "esriFieldTypeDate": "Fecha",
    "esriFieldTypeGUID": "GUID"
  }
});