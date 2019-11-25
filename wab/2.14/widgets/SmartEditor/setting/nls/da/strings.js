define({
  "layersPage": {
    "allLayers": "Alle lag",
    "title": "Vælg en skabelon til at oprette objekter med",
    "generalSettings": "Generelle indstillinger",
    "layerSettings": "Lagindstillinger",
    "smartActionsTabTitle": "Smarte handlinger",
    "attributeActionsTabTitle": "Attributhandlinger",
    "geocoderSettingsText": "Indstillinger for geokodningstjeneste",
    "editDescription": "Angiv visningstekst for redigeringspanelet",
    "editDescriptionTip": "Denne tekst vises oven over skabelonvælgeren. Du kan lade feltet være tomt, hvis du ikke ønsker nogen tekst.",
    "promptOnSave": "Prompt om at gemme ikke-gemte redigeringer, når formularen lukkes eller skifter til den næste post.",
    "promptOnSaveTip": "Viser en prompt, når brugeren klikker på luk eller navigerer til den næste redigérbare post, når det aktuelle objekt har ikke-gemte redigeringer.",
    "promptOnDelete": "Bed om bekræftelse, når der skal slettes en post.",
    "promptOnDeleteTip": "Vis en prompt, når brugeren klikker på slet for at bekræfte handlingen.",
    "removeOnSave": "Fjern objekt fra markeringen efter lagring.",
    "removeOnSaveTip": "Indstilling, der fjerner objektet fra den angivne markering, når posten gemmes. Hvis det er den eneste valgte post, skifter panelet tilbage til skabelonsiden.",
    "useFilterEditor": "Brug objektskabelonfilter",
    "useFilterEditorTip": "Indstilling, der bruger filterskabelonvælgeren, som giver mulighed for at få vist en skabelon for et enkelt lag eller søge efter skabeloner efter navn.",
    "displayShapeSelector": "Vis tegnefunktioner",
    "createNewFeaturesFromExisting": "Gør det muligt for brugeren at oprette et nyt/nye objekt(er) ud fra et eksisterende objekt(er)",
    "createNewFeaturesFromExistingTip": "En indstilling, der gør det muligt for brugeren at kopiere et eksisterende objekt med henblik på at oprette nye objekter",
    "copiedFeaturesOverrideDefaults": "Kopierede objektværdier tilsidesætter standardværdierne",
    "copiedFeaturesOverrideDefaultsTip": "Værdier fra kopierede objekter vil kun tilsidesætte standard-skabelonværdier for det/de matchede felt(er)",
    "displayShapeSelectorTip": "Indstilling, der viser en liste med gyldige tegnefunktioner for den valgte skabelon.",
    "displayPresetTop": "Vis en liste med forudindstillede værdier øverst",
    "displayPresetTopTip": "Indstilling, der viser listen med forudindstillede værdier oven over skabelonvælgeren.",
    "listenToGroupFilter": "Anvend filterværdier fra Gruppefiltrerings-widget'en til de forudindstillede felter",
    "listenToGroupFilterTip": "Når der anvendes et filter i Gruppefiltrerings-widget'en, skal værdien anvendes til et tilsvarende felt på listen Foruddefineret værdi.",
    "keepTemplateActive": "Bevar den valgte skabelon som aktiv",
    "keepTemplateActiveTip": "Hvis der tidligere har været valgt en skabelon, når skabelonvælgeren vises, skal du vælge skabelonen igen.",
    "geometryEditDefault": "Aktivér geometri-redigering som standard",
    "autoSaveEdits": "Gemmer automatisk nyt objekt",
    "enableAttributeUpdates": "Vis opdateringsknappen Attributhandlinger, når redigering af geometri er aktiv",
    "enableAutomaticAttributeUpdates": "Kalder automatisk attributhandling efter opdatering af geometri",
    "enableLockingMapNavigation": "Aktivér låsning af kortnavigation",
    "enableMovingSelectedFeatureToGPS": "Aktivér flytning af valgt punktobjekt til GPS-placering",
    "enableMovingSelectedFeatureToXY": "Aktivér flytning af valgt punktobjekt til XY-placering",
    "featureTemplateLegendLabel": "Indstillinger for objektskabelon og filterværdier",
    "saveSettingsLegendLabel": "Gem indstillinger",
    "geometrySettingsLegendLabel": "Geometri-indstillinger",
    "buttonPositionsLabel": "Placering af knapperne Gem, Slet, Tilbage og Ryd",
    "belowEditLabel": "Under redigeringsformular",
    "aboveEditLabel": "Over redigeringsformular",
    "switchToMultilineInput": "Skift til input med flere linjer, når feltets længde overskrider",
    "layerSettingsTable": {
      "allowDelete": "Tillad sletning",
      "allowDeleteTip": "Tillad sletning – Indstilling, der gør det muligt for brugeren at slette et objekt. Indstillingen deaktiveres, hvis laget ikke understøtter sletning",
      "edit": "Redigérbar",
      "editTip": "Redigérbar – Indstilling, der omfatter laget i widget'en",
      "label": "Lag",
      "labelTip": "Lag – Navnet på laget, som det er defineret i kortet",
      "update": "Deaktivér geometriredigering",
      "updateTip": "Deaktivér geometriredigering – Indstilling, der deaktiverer muligheden for at flytte geometrien, når den først er placeret, eller at flytte geometrien for et eksisterende objekt",
      "allowUpdateOnly": "Opdatér kun",
      "allowUpdateOnlyTip": "Opdatér kun – Indstilling, der kun tillader redigering af eksisterende objekter. Indstillingen er aktiveret som standard, og den deaktiveres, hvis laget ikke understøtter oprettelse af nye objekter",
      "fieldsTip": "Redigér de felter, der skal redigeres, og definér smarte attributter",
      "actionsTip": "Handlinger – Indstilling til redigering af felter eller adgang til tilknyttede lag/tabeller",
      "description": "Beskrivelse",
      "descriptionTip": "Beskrivelse – Indstilling til indtastning af tekst, der skal vises øverst på attributsiden",
      "relationTip": "Få vist tilknyttede lag og tabeller"
    },
    "editFieldError": "Feltredigeringer og smarte attributter er ikke tilgængelige for lag, der ikke er redigérbare",
    "noConfigedLayersError": "Smart-redigering kræver et eller flere redigérbare lag",
    "toleranceErrorMsg": "Ugyldig toleranceværdi for standardgennemskæring",
    "invalidMaxCharacterErrorMsg": "Ugyldig værdi i skift til input med flere linjer"
  },
  "editDescriptionPage": {
    "title": "Definér attributoversigtsteksten for <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurér felter for <b>${layername}</b>",
    "copyActionTip": "Attributhandlinger",
    "editActionTip": "Smarte handlinger",
    "description": "Brug knappen til redigering af handlinger til at aktivere smarte attributter for et lag. Smarte attributter kan gøre et felt påkrævet eller skjule eller deaktivere feltet ud fra værdierne i andre felter. Brug knappen til kopiering af handlinger til at aktivere og definere kilden til feltværdien efter gennemskæring, adresse, koordinater og forudindstilling.",
    "fieldsNotes": "* er et påkrævet felt. Hvis du fjerner markeringen af Vis for dette felt, og redigeringsskabelonen ikke udfylder den pågældende feltværdi, vil du ikke kunne gemme en ny post.",
    "smartAttachmentText": "Konfigurér handlingen smarte vedhæftninger",
    "smartAttachmentPopupTitle": "Konfigurér smarte vedhæftninger for <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Visning",
      "displayTip": "Vis – Bestem, om feltet skal være synlig eller ej",
      "edit": "Redigérbar",
      "editTip": "Redigérbar – Markér, hvis feltet findes i attributform",
      "fieldName": "Navn",
      "fieldNameTip": "Navn – Navnet på feltet, som det er defineret i databasen",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Alias – Navnet på feltet, som det er defineret i kortet",
      "canPresetValue": "Forudindstillet",
      "canPresetValueTip": "Forudindstilling – Indstilling, der viser feltet i listen med forudindstillede felter og gør det muligt for brugeren at angive værdien før redigering",
      "actions": "Handlinger",
      "actionsTip": "Handlinger – Redigér felternes rækkefølge, eller definér smarte attributter"
    },
    "smartAttSupport": "Smarte attributter understøttes ikke for de påkrævede databasefelter"
  },
  "actionPage": {
    "title": "Konfigurér attributhandlingerne for <b>${fieldname}</b>",
    "smartActionTitle": "Konfigurér smarte attributhandlinger for <b>${fieldname}</b>",
    "description": "Handlingerne er altid deaktiverede, medmindre du angiver de kriterier, som skal udløse handlingerne. Handlingerne behandles i rækkefølge, og der udløses kun én handling pr. felt. Brug kriterieredigeringsknappen til at definere kriterierne.",
    "copyAttributesNote": "Deaktivering af enhver handling, der har et gruppenavn, vil være det samme som at redigere den pågældende handling uafhængigt, og det vil fjerne handlingen for dette felt fra den pågældende gruppe.",
    "searchPlaceHolder": "Søg",
    "expandAllLabel": "Vis alle lag",
    "actionsSettingsTable": {
      "rule": "Handling",
      "ruleTip": "Handling – Handlingen udføres, når kriterierne er opfyldt",
      "expression": "Udtryk",
      "expressionTip": "Udtryk – Det resulterende udtryk i SQL-format ud fra de definerede kriterier",
      "groupName": "Gruppenavn",
      "groupNameTip": "Gruppenavn – Viser gruppenavnet, hvorfra udtrykket anvendes",
      "actions": "Kriterier",
      "actionsTip": "Kriterier – Redigér rækkefølgen for reglerne, og definér kriterierne for, hvornår de udløses"
    },
    "copyAction": {
      "description": "Kilder til feltværdier behandles i rækkefølge, hvis dette er aktiveret, indtil et gyldigt kriterium udløses, eller listen er afsluttet. Brug knappen til redigering af kriterier til at definere kriterierne.",
      "intersection": "Vejkryds",
      "coordinates": "Koordinater",
      "address": "Adresse",
      "preset": "Forudindstillet",
      "actionText": "Handlinger",
      "criteriaText": "Kriterier",
      "enableText": "Aktiveret"
    },
    "actions": {
      "hide": "Skjul",
      "required": "Krævet",
      "disabled": "Deaktiveret"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Advarsel: Uafhængig redigering vil fjerne den valgte attributhandling, der er knyttet til dette felt fra gruppen",
      "editGroupHint": "Advarsel: Uafhængig redigering vil fjerne den valgte smarte handling, der er knyttet til dette felt, fra gruppen",
      "popupTitle": "Vælg redigeringsindstilling",
      "editAttributeGroup": "Den valgte attributhandling er defineret fra gruppen. Vælg en af følgende indstillinger for at redigere attributhandlinger:",
      "expression": "Det valgte udtryk for den valgte smarte handling er defineret fra gruppen. Vælg en af følgende indstillinger for at redigere det smarte handlingsudtryk:",
      "editGroupButton": "Redigér gruppe",
      "editIndependentlyButton": "Redigér uafhængigt"
    }
  },
  "filterPage": {
    "submitHidden": "Send attributdata for dette felt, også når det er skjult?",
    "title": "Konfigurér udtryk for reglen ${action}",
    "filterBuilder": "Angiv handlingen for feltet, når posten svarer til ${any_or_all} af følgende udtryk",
    "noFilterTip": "Definér erklæringen for, hvornår handlingen er aktiv, ved hjælp af værktøjerne nedenfor."
  },
  "geocoderPage": {
    "setGeocoderURL": "Angiv geokodnings-URL",
    "hintMsg": "Bemærk: Du er ved at ændre geokodningstjenesten. Husk at opdatere eventuelle felt-mappings, som du har konfigureret.",
    "invalidUrlTip": "URL’en ${URL} er ugyldig eller utilgængelig."
  },
  "addressPage": {
    "popupTitle": "Adresse",
    "checkboxLabel": "hent værdi fra geokodningstjenesten",
    "selectFieldTitle": "Attribut",
    "geocoderHint": "Hvis du vil ændre geokodningstjeneste, skal du gå til knappen for indstillinger for geokodningstjeneste under de generelle indstillinger",
    "prevConfigruedFieldChangedMsg": "Den tidligere konfigurerede attribut findes ikke i de aktuelle geokodningsindstillinger. Attributten er blevet nulstillet til standardindstillingen."
  },
  "coordinatesPage": {
    "popupTitle": "Koordinater",
    "checkboxLabel": "Hent koordinater",
    "coordinatesSelectTitle": "Koordinatsystem",
    "coordinatesAttributeTitle": "Attribut",
    "mapSpatialReference": "Kort-spatial reference",
    "latlong": "Breddegrad/længdegrad",
    "allGroupsCreatedMsg": "Alle mulige grupper er allerede oprettet"
  },
  "presetPage": {
    "popupTitle": "Forudindstillet",
    "checkboxLabel": "Feltet er forudindstillet",
    "showOnlyDomainFields": "Vis kun domænefelter",
    "hideInPresetDisplay": "Skjul i visningen af forudindstillet standardværdi",
    "presetValueLabel": "Den nuværende forudindstillede værdi er:",
    "changePresetValueHint": "Hvis du vil ændre denne forudindstillede værdi, skal du gå til knappen ’Definér forudindstillede værdier’ under de generelle indstillinger"
  },
  "intersectionPage": {
    "groupNameLabel": "Gruppenavn",
    "dataTypeLabel": "Datatype",
    "ignoreLayerRankingCheckboxLabel": "Ignorér rangordning af lag, og find det nærmeste objekt på tværs af alle definerede lag",
    "intersectingLayersLabel": "Lag for at udtrække en værdi",
    "layerAndFieldsApplyLabel": "Lag og felt(er) for at anvende den udtrukne værdi",
    "checkboxLabel": "Hent værdi fra gennemskæringslagets felt",
    "layerText": "Lag",
    "fieldText": "Felter",
    "actionsText": "Handlinger",
    "toleranceSettingText": "Toleranceindstillinger",
    "addLayerLinkText": "Tilføj et lag",
    "useDefaultToleranceText": "Brug standardtolerance",
    "toleranceValueText": "Toleranceværdi",
    "toleranceUnitText": "Toleranceenhed",
    "useLayerName": "- Brug lagnavn -",
    "noLayersMessage": "Intet felt fundet i noget lag i kortet, der matcher den valgte datatype."
  },
  "presetAll": {
    "popupTitle": "Definer de forudindstillede standardværdier",
    "deleteTitle": "Slet den forudindstillede værdi",
    "hintMsg": "Navnet på alle unikke forudindstillede felter er angivet her. Fjernelse af et forudindstillet felt vil deaktivere det pågældende felt som forudindstillet fra alle lag/tabeller."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Standard-gennemskæringstolerance"
  },
  "smartActionsPage": {
    "smartActionLabel": "Konfigurér smart handling",
    "addNewSmartActionLinkText": "Tilføj ny",
    "definedActions": "Definerede handlinger",
    "priorityPopupTitle": "Indstil prioritet for smarte handlinger",
    "priorityPopupColumnTitle": "Smarte handlinger",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Gruppenavn",
    "layerForExpressionLabel": "Lag for udtryk",
    "layerForExpressionNote": "Bemærk: Det valgte lags felter vil blive anvendt til at definere kriterier",
    "expressionText": "Udtryk",
    "editExpressionLabel": "Redigér udtryk",
    "layerAndFieldsApplyLabel": "Lag og felter, der anvendes til",
    "submitAttributeText": "Send attributdata for det/de valgte skjulte felt(er)?",
    "priorityColumnText": "Prioritet",
    "requiredGroupNameMsg": "Denne værdi er obligatorisk",
    "uniqueGroupNameMsg": "Indtast entydigt gruppenavn, gruppen med dette navn findes allerede.",
    "deleteGroupPopupTitle": "Slet gruppe med smarte handlinger",
    "deleteGroupPopupMsg": "Sletning af gruppen vil resultere i, at udtrykket fjernes fra alle tilknyttede felthandlinger.",
    "invalidExpression": "Udtrykket kan ikke være tomt",
    "warningMsgOnLayerChange": "Det definerede udtryk og de felter, som udtrykket anvendes til, vil blive ryddet.",
    "smartActionsTable": {
      "name": "Navn",
      "expression": "Udtryk",
      "definedFor": "Defineret for"
    }
  },
  "attributeActionsPage": {
    "name": "Navn",
    "type": "Type",
    "deleteGroupPopupTitle": "Slet gruppe med attributhandlinger",
    "deleteGroupPopupMsg": "Sletning af gruppen vil resultere i, at attributhandlingen fjernes fra alle tilknyttede felter.",
    "alreadyAppliedActionMsg": "Handlingen ${action} anvendes allerede til dette felt."
  },
  "chooseFromLayer": {
    "fieldLabel": "Felt",
    "valueLabel": "Værdi",
    "selectValueLabel": "Vælg værdi"
  },
  "presetPopup": {
    "presetValueLAbel": "Foruddefineret værdi"
  },
  "dataType": {
    "esriFieldTypeString": "Streng",
    "esriFieldTypeInteger": "Nummer",
    "esriFieldTypeDate": "Dato",
    "esriFieldTypeGUID": "GUID"
  },
  "relativeDates": {
    "dateTypeLabel": "Datotype",
    "valueLabel": "Værdi",
    "fixed": "Fast",
    "current": "Aktuelt",
    "past": "Tidligere",
    "future": "Fremtidig",
    "popupTitle": "Vælg værdi",
    "hintForFixedDateType": "Tip: Den angivne dato og det angivne klokkeslæt bruges som forudindstillet standardværdi",
    "hintForCurrentDateType": "Tip: Den aktuelle dato og det aktuelle klokkeslæt bruges som forudindstillet standardværdi",
    "hintForPastDateType": "Tip: Den angivne værdi trækkes fra den aktuelle dato og det aktuelle klokkeslæt for at give standardværdien for forudindstilling.",
    "hintForFutureDateType": "Tip: Den angivne værdi lægges til den aktuelle dato og det aktuelle klokkeslæt for at give standardværdien for forudindstilling.",
    "noDateDefinedTooltip": "Ingen dato er defineret"
  },
  "relativeDomains": {
    "fieldSetTitle": "Liste",
    "valueText": "Værdi",
    "defaultText": "Standard",
    "selectDefaultDomainMsg": "Vælg venligst et standardværdi-domæne eller kontroller, at afkrydsningsfeltet for det valgte standarddomæne er afkrydset"
  }
});