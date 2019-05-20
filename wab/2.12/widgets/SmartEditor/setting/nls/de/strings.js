define({
  "layersPage": {
    "allLayers": "Alle Layer",
    "title": "Vorlage zur Feature-Erstellung auswählen",
    "generalSettings": "Allgemeine Einstellungen",
    "layerSettings": "Layer-Einstellungen",
    "smartActionsTabTitle": "Intelligente Aktionen",
    "attributeActionsTabTitle": "Attributaktionen",
    "presetValueText": "Voreingestellte Werte definieren",
    "geocoderSettingsText": "Geocoder-Einstellungen",
    "editDescription": "Anzeigetext für den Bearbeitungsbereich bereitstellen",
    "editDescriptionTip": "Dieser Text wird über der Vorlagenauswahl angezeigt; lassen Sie ihn leer.",
    "promptOnSave": "Zum Speichern nicht gespeicherter Änderungen auffordern, wenn das Formular geschlossen oder zum nächsten Datensatz gewechselt wird",
    "promptOnSaveTip": "Es wird eine Eingabeaufforderung angezeigt, wenn der Benutzer auf \"Schließen\" klickt oder zum nächsten editierbaren Datensatz navigiert, wenn das aktuelle Feature nicht gespeicherte Änderungen enthält.",
    "promptOnDelete": "Beim Löschen eines Datensatzes eine Bestätigung anfordern",
    "promptOnDeleteTip": "Wenn der Benutzer auf \"Löschen\" klickt, wird eine Eingabeaufforderung angezeigt, um die Aktion zu bestätigen.",
    "removeOnSave": "Das Feature beim Speichern aus der Auswahl entfernen",
    "removeOnSaveTip": "Option zum Entfernen des Features aus dem Auswahlsatz, wenn der Datensatz gespeichert wird.  Wenn dies der einzige ausgewählte Datensatz ist, wechselt der Bereich zurück zur Vorlagenseite.",
    "useFilterEditor": "Feature-Vorlagenfilter verwenden",
    "useFilterEditorTip": "Option zum Verwenden der Filtervorlagenauswahl, die es ermöglicht, die Vorlage eines Layers anzuzeigen oder Vorlagen nach Name zu suchen.",
    "displayShapeSelector": "Darstellungsoptionen anzeigen",
    "createNewFeaturesFromExisting": "Erstellen von neuen Features aus vorhandenen Features zulassen",
    "createNewFeaturesFromExistingTip": "Option, mit der das Kopieren von vorhandenen Features zugelassen wird, um neue Features zu erstellen",
    "copiedFeaturesOverrideDefaults": "Werte von kopierten Features setzen Standardwerte außer Kraft",
    "copiedFeaturesOverrideDefaultsTip": "Werte aus den kopierten Features setzen nur für die übereinstimmenden Felder die standardmäßigen Vorlagenwerte außer Kraft",
    "displayShapeSelectorTip": "Option zum Anzeigen einer Liste von Darstellungsoptionen für die ausgewählte Vorlage.",
    "displayPresetTop": "Liste der voreingestellten Werte im Vordergrund anzeigen",
    "displayPresetTopTip": "Option zum Anzeigen der Liste der voreingestellten Werte über der Vorlagenauswahl.",
    "listenToGroupFilter": "Filterwerte aus dem Widget \"Gruppenfilter\" auf voreingestellte Felder anwenden",
    "listenToGroupFilterTip": "Wenn ein Filter im Widget \"Gruppenfilter\" angewendet wird, wird der Wert auf ein übereinstimmendes Feld in der Liste der voreingestellten Werte angewendet.",
    "keepTemplateActive": "Ausgewählte Vorlage aktiviert lassen",
    "keepTemplateActiveTip": "Wenn die Vorlagenauswahl angezeigt wird, wird die zuvor ausgewählte Vorlage erneut ausgewählt.",
    "geometryEditDefault": "Geometriebearbeitung standardmäßig aktivieren",
    "autoSaveEdits": "Neues Feature automatisch speichern",
    "enableAttributeUpdates": "Schaltfläche zum Aktualisieren von Attributaktionen bei aktiver Geometriebearbeitung anzeigen",
    "enableAutomaticAttributeUpdates": "Attributaktion nach Geometrieaktualisierung automatisch aufrufen",
    "enableLockingMapNavigation": "Sperren der Kartennavigation aktivieren",
    "enableMovingSelectedFeatureToGPS": "Verschieben von ausgewähltem Punkt-Feature zur GPS-Position aktivieren",
    "enableMovingSelectedFeatureToXY": "Verschieben von ausgewähltem Punkt-Feature zur XY-Position aktivieren",
    "featureTemplateLegendLabel": "Einstellungen für Feature-Vorlage und Filterwert",
    "saveSettingsLegendLabel": "Einstellungen speichern",
    "geometrySettingsLegendLabel": "Geometrieeinstellungen",
    "buttonPositionsLabel": "Position der Schaltflächen \"Speichern\", \"Löschen\", \"Zurück\" und \"Auswahl aufheben\"",
    "belowEditLabel": "Unter Bearbeitungsformular",
    "aboveEditLabel": "Über Bearbeitungsformular",
    "layerSettingsTable": {
      "allowDelete": "Löschen zulassen",
      "allowDeleteTip": "Löschen zulassen: Option, die Benutzern das Löschen eines Features ermöglicht. Sie wird deaktiviert, wenn der Layer die Löschfunktion nicht unterstützt.",
      "edit": "Editierbar",
      "editTip": "Editierbar: Option zum Einbeziehen des Layers in das Widget",
      "label": "Layer",
      "labelTip": "Layer: Name des Layers gemäß der Definition in der Karte",
      "update": "Geometriebearbeitung deaktivieren",
      "updateTip": "Geometriebearbeitung deaktivieren: Option, mit der das Verschieben der Geometrie nach dem Platzieren sowie das Verschieben in einem vorhandenen Feature deaktiviert wird",
      "allowUpdateOnly": "Nur Update",
      "allowUpdateOnlyTip": "Nur Aktualisieren: Option, um lediglich die Änderung der vorhandenen Features zuzulassen. Sie ist standardmäßig aktiviert, wird jedoch deaktiviert, wenn der Layer die Erstellung neuer Features nicht zulässt.",
      "fieldsTip": "Die zu bearbeitenden Felder ändern und intelligente Attribute definieren",
      "actionsTip": "Aktionen: Option zum Bearbeiten von Feldern oder Zugreifen auf zugehörige Layer/Tabellen",
      "description": "Beschreibung",
      "descriptionTip": "Beschreibung: Option zum Eingeben von Text, der im oberen Bereich der Attributseite angezeigt werden soll.",
      "relationTip": "Zugehörige Layer und Tabellen anzeigen"
    },
    "editFieldError": "Feldänderungen und intelligente Attribute sind für nicht editierbare Layer nicht verfügbar.",
    "noConfigedLayersError": "Smart Editor erfordert mindestens einen editierbaren Layer",
    "toleranceErrorMsg": "Ungültiger Wert für standardmäßige Überschneidungstoleranz"
  },
  "editDescriptionPage": {
    "title": "Übersichtstext für <b>${layername}</b> definieren "
  },
  "fieldsPage": {
    "title": "Felder für <b>${layername}</b> konfigurieren",
    "copyActionTip": "Attributaktionen",
    "editActionTip": "Intelligente Aktionen",
    "description": "Verwenden Sie die Schaltfläche \"Bearbeiten\" für \"Aktionen\", um intelligente Attribute für einen Layer zu aktivieren. Mit intelligenten Attributen können Felder basierend auf den Werten anderer Felder ausgeblendet, angefordert oder deaktiviert werden. Verwenden Sie die Schaltfläche \"Kopieren\" für \"Aktionen\", um die Feldwertquelle nach Kreuzung, Adresse, Koordinaten und Voreinstellung zu aktivieren und zu definieren.",
    "fieldsNotes": "* Erforderliches Feld. Wenn \"Anzeigen\" für dieses Feld deaktiviert wird und die Bearbeitungsvorlage diesen Feldwert nicht füllt, können Sie keinen neuen Datensatz speichern.",
    "smartAttachmentText": "Die Aktion \"Intelligente Anlagen\" konfigurieren",
    "smartAttachmentPopupTitle": "Intelligente Anlagen für <b>${layername}</b> konfigurieren",
    "fieldsSettingsTable": {
      "display": "Anzeigen",
      "displayTip": "Anzeigen: Die Sichtbarkeit des Feldes festlegen",
      "edit": "Editierbar",
      "editTip": "Editierbar: Aktivieren, wenn das Feld im Attributformular vorhanden sein soll",
      "fieldName": "Name",
      "fieldNameTip": "Name: Name des in der Datenbank definierten Feldes",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Alias: Name des in der Karte definierten Feldes",
      "canPresetValue": "Voreinstellung",
      "canPresetValueTip": "Voreingestellt: Option, mit der das Feld in der Liste der voreingestellten Felder angezeigt wird und die es dem Benutzer ermöglicht, den Wert vor der Bearbeitung festzulegen",
      "actions": "Aktionen",
      "actionsTip": "Aktionen: Die Reihenfolge der Felder ändern oder intelligente Attribute einrichten"
    },
    "smartAttSupport": "Intelligente Attribute werden für erforderliche Datenbankfelder nicht unterstützt."
  },
  "actionPage": {
    "title": "Attributaktionen für <b>${fieldname}</b> konfigurieren",
    "smartActionTitle": "Aktionen für intelligente Attribute für <b>${fieldname}</b> konfigurieren",
    "description": "Die Aktionen sind immer deaktiviert, es sei denn, Sie legen die Kriterien für deren Auslösung fest.  Die Aktionen werden der Reihenfolge nach verarbeitet und pro Feld wird nur eine Aktion ausgelöst.  Verwenden Sie zum Festlegen der Kriterien die Schaltfläche \"Kriterien bearbeiten\".",
    "copyAttributesNote": "Das Deaktivieren einer Aktion mit Gruppenname gleicht der unabhängigen Bearbeitung einer Aktion: Dadurch wird die Aktion für dieses Feld aus der entsprechenden Gruppe entfernt.",
    "actionsSettingsTable": {
      "rule": "Aktion",
      "ruleTip": "Aktion: Aktion, die bei Erfüllung der Kriterien durchgeführt wird",
      "expression": "Ausdruck",
      "expressionTip": "Ausdruck: Der aus den definierten Kriterien resultierende Ausdruck im SQL-Format",
      "groupName": "Gruppenname",
      "groupNameTip": "Gruppenname: Zeigt den Namen der Gruppe an, über die der Ausdruck angewendet wird",
      "actions": "Kriterien",
      "actionsTip": "Kriterien: Die Reihenfolge der Regel ändern und die Kriterien für deren Auslösung definieren"
    },
    "copyAction": {
      "description": "Feldwertquellen werden je nach Aktivierung der Reihenfolge nach verarbeitet, bis ein gültiges Kriterium ausgelöst wird oder die Liste abgeschlossen ist. Verwenden Sie zum Festlegen der Kriterien die Schaltfläche \"Kriterien bearbeiten\".",
      "intersection": "Kreuzung",
      "coordinates": "Koordinaten",
      "address": "Adresse",
      "preset": "Voreinstellung",
      "actionText": "Aktionen",
      "criteriaText": "Kriterien",
      "enableText": "Aktiviert"
    },
    "actions": {
      "hide": "Ausblenden",
      "required": "Erforderlich",
      "disabled": "Deaktiviert"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Warnung: Durch die unabhängige Bearbeitung wird die ausgewählte Attributaktion, die mit diesem Feld verknüpft ist, aus der Gruppe entfernt.",
      "editGroupHint": "Warnung: Durch die unabhängige Bearbeitung wird die ausgewählte intelligente Aktion, die mit diesem Feld verknüpft ist, aus der Gruppe entfernt.",
      "popupTitle": "Bearbeitungsoption auswählen",
      "editAttributeGroup": "Die ausgewählte Attributaktion wird über die Gruppe definiert. Wählen Sie zum Bearbeiten der Attributaktion eine der folgenden Optionen aus:",
      "expression": "Der Ausdruck der ausgewählten intelligenten Aktion wird über die Gruppe definiert. Wählen Sie zum Bearbeiten des Ausdrucks der intelligenten Aktion eine der folgenden Optionen aus:",
      "editGroupButton": "Gruppe bearbeiten",
      "editIndependentlyButton": "Unabhängig bearbeiten"
    }
  },
  "filterPage": {
    "submitHidden": "Attributdaten für dieses Feld auch dann senden, wenn es ausgeblendet ist?",
    "title": "Ausdruck für die ${action}-Regel konfigurieren",
    "filterBuilder": "Aktion für das Feld festlegen, wenn der Datensatz mit ${any_or_all} der folgenden Ausdrücke übereinstimmt",
    "noFilterTip": "Definieren Sie mit den folgenden Werkzeugen die Anweisung für den Zeitraum, in dem die Aktion aktiv ist."
  },
  "geocoderPage": {
    "setGeocoderURL": "Geocoder-URL festlegen",
    "hintMsg": "Hinweis: Sie ändern den Geokodierungsservice. Stellen Sie sicher, dass alle von Ihnen konfigurierten Geocoder-Feldzuordnungen aktualisiert sind.",
    "invalidUrlTip": "Die URL ${URL} ist ungültig oder es kann nicht darauf zugegriffen werden."
  },
  "addressPage": {
    "popupTitle": "Adresse",
    "checkboxLabel": "Wert aus Geocoder abrufen",
    "selectFieldTitle": "Attribut",
    "geocoderHint": "Wechseln Sie zum Ändern des Geocoders unter 'Allgemeine Einstellungen' zur Schaltfläche 'Geocoder-Einstellungen'.",
    "prevConfigruedFieldChangedMsg": "Zuvor konfiguriertes Attribut wurde in den aktuellen Geocoder-Einstellungen nicht gefunden. Attribut wurde auf den Standardwert zurückgesetzt."
  },
  "coordinatesPage": {
    "popupTitle": "Koordinaten",
    "checkboxLabel": "Koordinaten abrufen",
    "coordinatesSelectTitle": "Koordinatensystem",
    "coordinatesAttributeTitle": "Attribut",
    "mapSpatialReference": "Raumbezug der Karte",
    "latlong": "Breitengrad/Längengrad",
    "allGroupsCreatedMsg": "Alle möglichen Gruppen werden bereits erstellt"
  },
  "presetPage": {
    "popupTitle": "Voreinstellung",
    "checkboxLabel": "Feld wird voreingestellt",
    "presetValueLabel": "Der aktuell voreingestellte Wert ist:",
    "changePresetValueHint": "Wechseln Sie zum Ändern dieses voreingestellten Wertes unter 'Allgemeine Einstellungen' zur Schaltfläche 'Voreingestellte Werte definieren'."
  },
  "intersectionPage": {
    "groupNameLabel": "Name",
    "dataTypeLabel": "Datentyp",
    "ignoreLayerRankingCheckboxLabel": "Layer-Rang ignorieren und das nächstgelegene Feature in allen definierten Layern suchen",
    "intersectingLayersLabel": "Layer zum Extrahieren eines Wertes",
    "layerAndFieldsApplyLabel": "Layer und Feld(er) zum Anwenden des extrahierten Wertes",
    "checkboxLabel": "Wert aus dem Feld \"Kreuzung\" des Layers abrufen",
    "layerText": "Layer",
    "fieldText": "Felder",
    "actionsText": "Aktionen",
    "toleranceSettingText": "Toleranzeinstellungen",
    "addLayerLinkText": "Einen Layer hinzufügen",
    "useDefaultToleranceText": "Standardtoleranz verwenden",
    "toleranceValueText": "Toleranzwert",
    "toleranceUnitText": "Toleranzeinheit",
    "useLayerName": "- Layer-Name verwenden -",
    "noLayersMessage": "In den Layern der Karte wurde kein Feld gefunden, das mit dem ausgewählten Datentyp übereinstimmt."
  },
  "presetAll": {
    "popupTitle": "Die standardmäßig voreingestellten Werte definieren",
    "deleteTitle": "Voreingestellten Wert löschen",
    "hintMsg": "Hier sind alle eindeutigen Namen voreingestellter Felder aufgeführt. Wenn ein voreingestelltes Feld entfernt wird, wird das entsprechende Feld als Voreinstellung in allen Layern/Tabellen deaktiviert."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Standardmäßige Überschneidungstoleranz"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "Neue hinzufügen",
    "definedActions": "Definierte Aktionen",
    "priorityPopupTitle": "Priorität für Intelligente Aktionen festlegen",
    "priorityPopupColumnTitle": "Intelligente Aktionen",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Gruppenname",
    "layerForExpressionLabel": "Layer für Ausdruck",
    "layerForExpressionNote": "Hinweis: Die Felder des ausgewählten Layers werden zum Definieren der Kriterien verwendet.",
    "expressionText": "Ausdruck",
    "editExpressionLabel": "Ausdruck bearbeiten",
    "layerAndFieldsApplyLabel": "Layer und Felder, auf die die entsprechende Operation angewendet werden soll",
    "submitAttributeText": "Attributdaten für ausgewählte ausgeblendete Felder senden?",
    "priorityColumnText": "Priorität",
    "requiredGroupNameMsg": "Dieser Wert muss angegeben werden",
    "uniqueGroupNameMsg": "Geben Sie einen eindeutigen Gruppennamen ein. Eine Gruppe mit diesem Namen ist bereits vorhanden.",
    "deleteGroupPopupTitle": "Gruppe für intelligente Aktionen löschen",
    "deleteGroupPopupMsg": "Durch das Löschen der Gruppe wird der Ausdruck aus allen verknüpften Feldern der Aktion entfernt.",
    "invalidExpression": "Ausdruck darf nicht leer sein",
    "warningMsgOnLayerChange": "Der definierte Ausdruck und die Felder, auf die er angewendet wird, werden gelöscht.",
    "smartActionsTable": {
      "name": "Name",
      "expression": "Ausdruck",
      "definedFor": "Definiert für"
    }
  },
  "attributeActionsPage": {
    "name": "Name",
    "type": "Typ",
    "deleteGroupPopupTitle": "Attributaktions-Gruppe",
    "deleteGroupPopupMsg": "Durch das Löschen der Gruppe wird die Attributaktion aus allen verknüpften Feldern entfernt.",
    "alreadyAppliedActionMsg": "Die Aktion ${action} wurde bereits auf dieses Feld angewendet."
  },
  "chooseFromLayer": {
    "fieldLabel": "Feld",
    "valueLabel": "Wert",
    "selectValueLabel": "Wert auswählen"
  },
  "presetPopup": {
    "presetValueLAbel": "Voreingestellter Wert"
  },
  "dataType": {
    "esriFieldTypeString": "Zeichenfolge",
    "esriFieldTypeInteger": "Zahl",
    "esriFieldTypeDate": "Datum",
    "esriFieldTypeGUID": "GUID"
  }
});