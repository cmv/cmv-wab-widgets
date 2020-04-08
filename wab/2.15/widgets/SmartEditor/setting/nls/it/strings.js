define({
  "layersPage": {
    "allLayers": "Tutti i layer",
    "title": "Selezionare un modello per creare le feature",
    "generalSettings": "Impostazioni generali",
    "layerSettings": "Impostazioni layer",
    "smartActionsTabTitle": "Azioni smart",
    "attributeActionsTabTitle": "Azioni attributo",
    "geocoderSettingsText": "Impostazioni geocoder",
    "editDescription": "Fornire testo da visualizzare per il riquadro di modifica",
    "editDescriptionTip": "Questo testo viene visualizzato sopra il selettore dei modelli, lasciare vuoto in assenza di testo.",
    "promptOnSave": "Richiedere di salvare modifiche non salvate quando il modulo viene chiuso o passato al record successivo.",
    "promptOnSaveTip": "Visualizzare un prompt quando l'utente fa clic su Chiudi o passare al successivo record modificabile quando la feature corrente contiene modifiche non salvate.",
    "promptOnDelete": "Richiedere la conferma durante la cancellazione di un record.",
    "promptOnDeleteTip": "Visualizza un prompt quando l'utente fa clic su Cancella per confermare l'azione.",
    "removeOnSave": "Rimuove la feature dalla selezione al salvataggio.",
    "removeOnSaveTip": "Opzione per rimuovere la feature dalla selezione impostata quando il record viene salvato. Se è il solo record selezionato, il pannello viene riportato alla pagina del modello.",
    "useFilterEditor": "Utilizza filtro modello di feature",
    "useFilterEditorTip": "Opzione per utilizzare il selettore Filtra Template, che consente di visualizzare il template di un layer o di cercare template in base al nome.",
    "displayShapeSelector": "Mostra opzioni del disegno",
    "createNewFeaturesFromExisting": "Consenti all'utente di creare nuove feature da feature esistenti",
    "createNewFeaturesFromExistingTip": "Opzione per consentire all'utente di copiare la feature esistente per creare nuove feature",
    "copiedFeaturesOverrideDefaults": "I valori delle feature copiate sostituiscono i valori predefiniti",
    "copiedFeaturesOverrideDefaultsTip": "I valori delle feature copiate sostituiscono i valori predefiniti del modello solo per i campi corrispondenti",
    "displayShapeSelectorTip": "Opzione per mostrare un elenco di opzioni valide per il disegno per il modello selezionato.",
    "displayPresetTop": "Mostra in alto l'elenco dei valori preimpostati",
    "displayPresetTopTip": "Opzione per mostrare l’elenco dei valori preimpostati nella selezione di modelli.",
    "listenToGroupFilter": "Applica valori ai filtri dal widget Filtro gruppo ai campi preimpostati",
    "listenToGroupFilterTip": "Quando un filtro viene applicato nel widget Filtro gruppo, applicare il valore a un campo corrispondente nell'elenco dei valori preimpostati.",
    "keepTemplateActive": "Mantieni attivo il modello selezionato",
    "keepTemplateActiveTip": "Quando viene visualizzato il selettore dei modelli, se un modello è stato selezionato in precedenza, selezionarlo nuovamente.",
    "geometryEditDefault": "Abilita la modifica della geometria per impostazione predefinita",
    "autoSaveEdits": "Salva automaticamente nuove feature",
    "enableAttributeUpdates": "Mostra il pulsante di aggiornamento delle azioni attributo quando la modifica della geometria è attiva",
    "enableAutomaticAttributeUpdates": "Richiamare automaticamente Azioni attributo dopo l'aggiornamento della geometria",
    "enableLockingMapNavigation": "Abilita blocco di navigazione della mappa",
    "enableMovingSelectedFeatureToGPS": "Abilita lo spostamento della feature puntuale selezionata sulla posizione GPS",
    "enableMovingSelectedFeatureToXY": "Abilita lo spostamento della feature puntuale selezionata nella posizione XY",
    "featureTemplateLegendLabel": "Impostazioni di Modello feature e Filtra valore",
    "saveSettingsLegendLabel": "Salva Impostazioni",
    "geometrySettingsLegendLabel": "Impostazioni geometria",
    "buttonPositionsLabel": "Posizione dei pulsanti Salva, Elimina, Indietro e Cancella",
    "belowEditLabel": "Sotto il modulo di modifica",
    "aboveEditLabel": "Sopra il modulo di modifica",
    "switchToMultilineInput": "Passare a input multilineari quando viene superata la lunghezza del campo",
    "layerSettingsTable": {
      "allowDelete": "Consenti cancellazione",
      "allowDeleteTip": "Consenti cancellazione: opzione per consentire all'utente di cancellare una feature; disabilitata se il layer non supporta la cancellazione",
      "edit": "Modificabile",
      "editTip": "Modificabile: opzione per includere il layer nel widget",
      "label": "Layer",
      "labelTip": "Layer: nome del layer come definito nella mappa",
      "update": "Disabilita modifica geometria",
      "updateTip": "Disabilita modifica geometria: opzione per disabilitare la possibilità di spostare la geometria dopo che è stata posizionata o spostare la geometria su una feature esistente",
      "allowUpdateOnly": "Solo aggiornamento",
      "allowUpdateOnlyTip": "Solo aggiornamento: opzione per consentire solo la modifica delle feature esistenti, selezionata per impostazione predefinita e disabilitata se il layer non supporta la creazione di nuove feature",
      "fieldsTip": "Modificare i campi da modificare e definire attributi Smart",
      "actionsTip": "Azioni: opzione per modificare i campi o accedere ai layer/tabelle correlati",
      "description": "Descrizione",
      "descriptionTip": "Descrizione: opzione per immettere testo da visualizzare sopra la pagina dell'attributo.",
      "relationTip": "Visualizza layer e tabelle correlati"
    },
    "editFieldError": "Modifiche campo e attributi Smart non sono disponibili per layer non modificabili",
    "noConfigedLayersError": "Smart Editor richiede uno o più layer modificabili",
    "toleranceErrorMsg": "Valore di tolleranza intersezione predefinita non valida",
    "pixelsToleranecErrorMsg": "Valore di tolleranza pixel predefinita non valida",
    "invalidMaxCharacterErrorMsg": "Valore non valido nel passare all'input multilineare"
  },
  "editDescriptionPage": {
    "title": "Definire il testo panoramica attributo per <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Configurare i campi per <b>${layername}</b>",
    "copyActionTip": "Azioni attributo",
    "editActionTip": "Azioni smart",
    "description": "Usare il pulsante di modifica delle azioni per attivare gli attributi Smart in un layer. Gli attributi Smart possono richiedere, nascondere o disabilitare un campo in base ai valori di altri campi. Usare il pulsante di copia delle azioni per attivare e definire l’origine del valore del campo per intersezione, indirizzo, coordinate o valore preimpostato.",
    "fieldsNotes": "* è un campo obbligatorio. Se si deseleziona Visualizza per questo campo, e il modello di modifica non compila il valore del campo, non sarà possibile salvare un nuovo record.",
    "smartAttachmentText": "Configurare l’azione degli allegati Smart",
    "smartAttachmentPopupTitle": "Configura allegati Smart per <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Visualizza",
      "displayTip": "Visualizza: determinare se il campo è non visibile",
      "edit": "Modificabile",
      "editTip": "Modificabile: verificare se il campo è presente nel modulo attributo",
      "fieldName": "Nome",
      "fieldNameTip": "Nome: nome del campo definito nel database",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Alias: nome del campo definito nella mappa",
      "canPresetValue": "Preimpostato",
      "canPresetValueTip": "Preimpostato: opzione per visualizzare il campo nell'elenco dei campi preimpostati e consentire all'utente di impostare il valore prima della modifica",
      "actions": "Azioni",
      "actionsTip": "Azioni: modificare l'ordine dei campi o impostare attributi smart"
    },
    "smartAttSupport": "Gli attributi Smart non sono supportati su campi di database obbligatori"
  },
  "actionPage": {
    "title": "Configura le azioni attributo per <b>${fieldname}</b>",
    "smartActionTitle": "Configurare le azioni attributo Smart per <b>${fieldname}</b>",
    "description": "Le azioni sono sempre disattivate a meno che non venga specificato il criterio in base al quale vengono attivate. Le azioni vengono elaborate in ordine e verrà attivata una sola azione per campo. Utilizzare il pulsante Modifica criterio per definire il criterio.",
    "copyAttributesNote": "La disattivazione di qualsiasi azione con un nome gruppo sarà uguale alla modifica dell'azione in modo indipendente e rimuoverà l'azione per questo campo dal rispettivo gruppo.",
    "searchPlaceHolder": "Cercare",
    "expandAllLabel": "Espandi tutti i layer",
    "domainListTitle": "Campi del dominio",
    "actionsSettingsTable": {
      "rule": "Azione",
      "ruleTip": "Azione: azione eseguita quando il criterio è soddisfatto",
      "expression": "Espressione",
      "expressionTip": "Espressione: l'espressione risultante in formato SQL dei criteri definiti",
      "groupName": "Nome gruppo",
      "groupNameTip": "Nome gruppo: visualizza il nome gruppo da cui si applica l'espressione",
      "actions": "Criteri",
      "actionsTip": "Criteri: modificare l'ordine della regola e definire i criteri quando viene attivata"
    },
    "copyAction": {
      "description": "L'origine del valore del campo viene elaborata in ordine se attivata finché non si attiva un criterio valido o non viene completato l’elenco. Utilizzare il pulsante di modifica dei criteri per definire i criteri.",
      "intersection": "Intersezione",
      "coordinates": "Coordinate",
      "address": "Indirizzo",
      "preset": "Preimpostato",
      "actionText": "Azioni",
      "criteriaText": "Criteri",
      "enableText": "Abilitata"
    },
    "actions": {
      "hide": "Nascondi",
      "required": "Richiesto",
      "disabled": "Disabilitato"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Avviso: la modifica in modo indipendente rimuoverà l'azione attributo associata per questo campo dal gruppo",
      "editGroupHint": "Avviso: la modifica in modo indipendente rimuoverà l'azione smart associata per questo campo dal gruppo",
      "popupTitle": "Scegli opzioni di modifica",
      "editAttributeGroup": "L'azione attributo selezionata è definita dal gruppo. Scegliere una delle seguenti opzioni per modificare l'azione attributo:",
      "expression": "L'espressione dell'azione smart selezionata è definita dal gruppo. Scegliere una delle seguenti opzioni per modificare l'espressione azione smart:",
      "editGroupButton": "Modifica gruppo",
      "editIndependentlyButton": "Modificare in maniera indipendente"
    }
  },
  "filterPage": {
    "submitHidden": "Inviare dati attributo per i campi anche quando sono nascosti",
    "title": "Configura espressione per la regola ${action}",
    "filterBuilder": "Impostare azione su campo quando il record corrisponde a ${any_or_all} delle seguenti espressioni",
    "noFilterTip": "Utilizzando gli strumenti sottostanti, definire l'istruzione per quando l'azione è attiva."
  },
  "geocoderPage": {
    "setGeocoderURL": "Imposta URL geocodificatore",
    "hintMsg": "Nota: si sta modificando il servizio di geocodifica, assicurarsi di aggiornare il mapping dei campi del geocoder che sono stati configurati.",
    "invalidUrlTip": "URL ${URL} non valida o non accessibile."
  },
  "addressPage": {
    "popupTitle": "Indirizzo",
    "checkboxLabel": "Ottieni valore dal Geocoder",
    "selectFieldTitle": "Attributo",
    "geocoderHint": "Per modificare la configurazione del Geocoder, usare il pulsante “Impostazioni Geocoder” nelle impostazioni generali",
    "prevConfigruedFieldChangedMsg": "L'attributo previamente configurato non è stato trovato nelle impostazioni correnti del geocoder. L'attributo è stato ripristinato al valore predefinito."
  },
  "coordinatesPage": {
    "popupTitle": "Coordinate",
    "checkboxLabel": "Ottieni coordinate",
    "coordinatesSelectTitle": "Sistema di coordinate",
    "coordinatesAttributeTitle": "Attributo",
    "mapSpatialReference": "Riferimento spaziale della mappa",
    "latlong": "Latitudine/Longitudine",
    "allGroupsCreatedMsg": "Tutti i gruppi possibili sono già stati creati"
  },
  "presetPage": {
    "popupTitle": "Preimpostato",
    "checkboxLabel": "Il campo sarà impostato con un valore preimpostato",
    "showOnlyDomainFields": "Mostrare solo i campi di dominio",
    "hideInPresetDisplay": "Nascondere la visualizzazione del valore preimpostato",
    "presetValueLabel": "Il valore preimpostato attuale è:",
    "changePresetValueHint": "Per modificare il valore preimpostato, fare clic sul pulsante “Definisci valori preimpostati” nelle impostazioni generali"
  },
  "intersectionPage": {
    "groupNameLabel": "Nome gruppo",
    "dataTypeLabel": "Tipo di dati",
    "ignoreLayerRankingCheckboxLabel": "Ignora classifica layer e trova la feature più vicina in tutti i layer definiti",
    "intersectingLayersLabel": "Layer per estrarre un valore",
    "layerAndFieldsApplyLabel": "Layer e campi per applicare il valore estratto",
    "checkboxLabel": "Ottieni valore dal campo di intersezione del layer",
    "layerText": "Layer",
    "fieldText": "Campi",
    "actionsText": "Azioni",
    "toleranceSettingText": "Impostazioni di tolleranza",
    "addLayerLinkText": "Aggiungi un layer",
    "useDefaultToleranceText": "Usa tolleranza predefinita",
    "toleranceValueText": "Valore di tolleranza",
    "toleranceUnitText": "Unità tolleranza",
    "pixelsUnitText": "Pixel",
    "useLayerName": "- Usa nome layer -",
    "noLayersMessage": "Nessun campo trovato nei layer della mappa che corrisponda al tipo di dati selezionato."
  },
  "presetAll": {
    "popupTitle": "Definisci valori preimpostati predefiniti",
    "deleteTitle": "Cancella valore preimpostato",
    "hintMsg": "Tutti i nomi di campo univoci preimpostati sono elencati qui. La rimozione di un campo preimpostato disabiliterà il campo rispettivo come preimpostazione da tutti i layer/tabelle."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Tolleranza di intersezione predefinita per tutte le feature.",
    "pixelsToleranceTitle": "Tolleranza di intersezione predefinita (valore pixel) da applicare solo per feature puntuali."
  },
  "smartActionsPage": {
    "smartActionLabel": "Configurare Smart Action",
    "addNewSmartActionLinkText": "Aggiungi nuova",
    "definedActions": "Azioni definite",
    "priorityPopupTitle": "Imposta priorità azioni smart",
    "priorityPopupColumnTitle": "Azioni smart",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Nome gruppo",
    "layerForExpressionLabel": "Layer per espressione",
    "layerForExpressionNote": "Nota: i campi del layer selezionato verranno utilizzati per definire criteri",
    "expressionText": "Espressione",
    "editExpressionLabel": "Modifica espressione",
    "layerAndFieldsApplyLabel": "Layer e campi da applicare su",
    "submitAttributeText": "Inviare dati attributo per i campi anche quando sono nascosti",
    "priorityColumnText": "Priorità",
    "requiredGroupNameMsg": "Valore obbligatorio.",
    "uniqueGroupNameMsg": "Immettere nome di gruppo univoco. Esiste già un gruppo con questo nome.",
    "deleteGroupPopupTitle": "Elimina gruppo azione smart",
    "deleteGroupPopupMsg": "L'eliminazione del gruppo comporterà la rimozione dell'espressione da tutte le azioni dei campi associate.",
    "invalidExpression": "L'espressione non può essere vuota",
    "warningMsgOnLayerChange": "L'espressione definita e i campi a cui è applicata verranno cancellati.",
    "smartActionsTable": {
      "name": "Nome",
      "expression": "Espressione",
      "definedFor": "Definito per"
    }
  },
  "attributeActionsPage": {
    "name": "Nome",
    "type": "Tipo",
    "deleteGroupPopupTitle": "Elimina gruppo azione attributo",
    "deleteGroupPopupMsg": "L'eliminazione del gruppo comporterà la rimozione dell'azione attributo da tutti i campi associati.",
    "alreadyAppliedActionMsg": "Azione ${action} già applicata a questo campo."
  },
  "chooseFromLayer": {
    "fieldLabel": "Campo",
    "valueLabel": "Valore",
    "selectValueLabel": "Seleziona valore"
  },
  "presetPopup": {
    "presetValueLAbel": "Valore preimpostato"
  },
  "dataType": {
    "esriFieldTypeString": "Stringa",
    "esriFieldTypeInteger": "Numero",
    "esriFieldTypeDate": "Data",
    "esriFieldTypeGUID": "GUID"
  },
  "relativeDates": {
    "dateTypeLabel": "Tipo di data",
    "valueLabel": "Valore",
    "fixed": "Fisso",
    "current": "Corrente",
    "past": "Passato",
    "future": "Futuro",
    "popupTitle": "Seleziona valore",
    "hintForFixedDateType": "Suggerimento: la data e l'ora specificata verranno utilizzate come valore predefinito preimpostato",
    "hintForCurrentDateType": "Suggerimento: la data e l'ora attuali verranno utilizzate come valore predefinito preimpostato",
    "hintForPastDateType": "Suggerimento: il valore specificato verrà sottratto dalla data e l'ora correnti per il valore predefinito della preimpostazione.",
    "hintForFutureDateType": "Suggerimento: il valore specificato verrà aggiunto alla data e l'ora correnti per il valore predefinito della preimpostazione.",
    "noDateDefinedTooltip": "Non è stata definita nessuna data",
    "relativeDateWarning": "È necessario specificare un valore per la data o per l'ora per poter salvare il valore preimpostato predefinito."
  },
  "relativeDomains": {
    "fieldSetTitle": "Elenco",
    "valueText": "Valore",
    "defaultText": "Predefinito",
    "selectedDomainFieldsHint": "Campi di dominio selezionati: ${domainFields}",
    "selectDefaultDomainMsg": "Selezionare un dominio valore predefinito o assicurarsi che la casella di controllo del dominio valore predefinito sia spuntata"
  }
});