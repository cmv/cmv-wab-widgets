define({
  "layersPage": {
    "allLayers": "Alla lager",
    "title": "Välj en mall för att skapa geoobjekt",
    "generalSettings": "Allmänna inställningar",
    "layerSettings": "Lagerinställningar",
    "smartActionsTabTitle": "Smarta åtgärder",
    "attributeActionsTabTitle": "Attributåtgärder",
    "presetValueText": "Definiera förinställda värden",
    "geocoderSettingsText": "Inställningar för geokodning",
    "editDescription": "Ange visningstext för redigeringspanelen",
    "editDescriptionTip": "Den här texten visas ovanför mallväljaren. Lämna tomt om ingen text ska visas.",
    "promptOnSave": "Uppmana användaren att spara osparade ändringar när formuläret stängs eller vid övergång till nästa post.",
    "promptOnSaveTip": "Visa en uppmaning när användaren klickar på Stäng eller navigerar till nästa redigerbara post, om det finns ändringar som inte har sparats i det aktuella geoobjektet.",
    "promptOnDelete": "Begär bekräftelse innan en post tas bort.",
    "promptOnDeleteTip": "Visa en uppmaning om att bekräfta åtgärden när användaren klickat på Ta bort.",
    "removeOnSave": "Ta bort geoobjektet ur urvalet när posten sparas.",
    "removeOnSaveTip": "Alternativ för att ta bort geoobjektet ur urvalsuppsättningen när posten sparas. Om det är den enda valda posten återgår panelen till mallsidan.",
    "useFilterEditor": "Använd mallfilter för geoobjekt",
    "useFilterEditorTip": "Alternativ för att använda filtermallväljaren som ger möjlighet att visa ett lagers mall eller söka efter mallar utifrån namn.",
    "displayShapeSelector": "Visa ritalternativ",
    "createNewFeaturesFromExisting": "Tillåt att användaren skapar nya geoobjekt av befintliga geoobjekt",
    "createNewFeaturesFromExistingTip": "Alternativ för att låta användaren kopiera befintliga geoobjekt för att skapa nya geoobjekt",
    "copiedFeaturesOverrideDefaults": "Kopierade geoobjektvärden åsidosätter standardvärden",
    "copiedFeaturesOverrideDefaultsTip": "Värden från de kopierade geoobjekten åsidosätter bara standardmallvärden för de matchade fälten",
    "displayShapeSelectorTip": "Alternativ för att visa en lista med giltiga ritalternativ för den valda mallen.",
    "displayPresetTop": "Visa lista med förinställda värden överst",
    "displayPresetTopTip": "Alternativ för att visa listan med förinställda värden över mallväljaren.",
    "listenToGroupFilter": "Tillämpa filtreringsvärden från gruppfiltreringswidgeten på förinställda fält",
    "listenToGroupFilterTip": "När ett filter används i gruppfiltreringswidgeten tillämpas värdet på ett matchande fält i listan över förinställda värden.",
    "keepTemplateActive": "Låt den markerade mallen vara aktiv",
    "keepTemplateActiveTip": "Om en mall har valts tidigare när mallväljlaren visas, väljer du den.",
    "geometryEditDefault": "Aktivera geometriredigering som standard",
    "autoSaveEdits": "Sparar nya geoobjekt automatiskt",
    "enableAttributeUpdates": "Visa uppdateringsknappen Attributåtgärder när redigera geometri är aktivt",
    "enableAutomaticAttributeUpdates": "Anropa attributåtgärden automatiskt efter uppdatering av geometrin",
    "enableLockingMapNavigation": "Aktivera låsning av kartnavigering",
    "enableMovingSelectedFeatureToGPS": "Aktivera flytt av valda punktgeoobjekt till GPS-position",
    "enableMovingSelectedFeatureToXY": "Aktivera flytt av valda punktgeoobjekt till XY-position",
    "featureTemplateLegendLabel": "Inställningar av geoobjektmall och filtervärde",
    "saveSettingsLegendLabel": "Spara inställningarna",
    "geometrySettingsLegendLabel": "Geometriinställningar",
    "buttonPositionsLabel": "Placering av knapparna Spara, Ta bort, Bakåt och Rensa markering",
    "belowEditLabel": "Under redigeringsformulär",
    "aboveEditLabel": "Ovanför redigeringsformulär",
    "layerSettingsTable": {
      "allowDelete": "Tillåt borttagning",
      "allowDeleteTip": "Tillåt borttagning – alternativ för att låta användaren ta bort ett geoobjekt; inaktiverat om lagret inte medger borttagning",
      "edit": "Redigerbar",
      "editTip": "Redigerbart – alternativ för att ta med lagret i widgeten",
      "label": "Lager",
      "labelTip": "Lager – lagrets namn som det anges i widgeten",
      "update": "Inaktivera geometriredigering",
      "updateTip": "Inaktivera geometriredigering – alternativ för att inaktivera möjligheten att flytta geometrin när den placerats eller att flytta geometrin till ett befintligt geoobjekt",
      "allowUpdateOnly": "Endast uppdatering",
      "allowUpdateOnlyTip": "Endast uppdatering – alternativ för att endast tillåta ändring av befintliga geoobjekt, markerat som standard och inaktiverat om det inte går att skapa nya geoobjekt i lagret",
      "fieldsTip": "Modifiera fälten som ska redigeras och definiera smarta attribut",
      "actionsTip": "Åtgärder – alternativ för att redigera fält eller få åtkomst till relaterade lager/tabeller",
      "description": "Beskrivning",
      "descriptionTip": "Beskrivning – alternativ för att ange text som ska visas överst på attributsidan.",
      "relationTip": "Visa relaterade lager och tabeller"
    },
    "editFieldError": "Fältmodifieringar och smarta attribut är inte tillgängliga för lager som inte kan redigeras",
    "noConfigedLayersError": "Smart redigerare kräver ett eller flera redigerbara lager",
    "toleranceErrorMsg": "Ogiltigt värde för Tolerans för standardkorsning"
  },
  "editDescriptionPage": {
    "title": "Definiera attributöversiktstext för <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurera fält för <b>${layername}</b>",
    "copyActionTip": "Attributåtgärder",
    "editActionTip": "Smarta åtgärder",
    "description": "Använd redigeringsknappen Åtgärder för att aktivera smarta attribut på ett lager. De smarta attributen kan kräva, dölja eller inaktivera ett fält baserat på värdena i andra fält. Använd knappen Kopiera åtgärder för att aktivera och definiera fältvärdets källa utifrån korsning, adress, koordinater och förinställning.",
    "fieldsNotes": "* är ett obligatoriskt fält. Om du avmarkerar Visa för detta fält, och redigeringsmallen inte fyller i fältvärdet, kan du inte spara en ny post.",
    "smartAttachmentText": "Konfigurera åtgärd för smarta bilagor",
    "smartAttachmentPopupTitle": "Konfigurera smarta bilagor för <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Visa",
      "displayTip": "Visa – ange om fältet inte är synligt",
      "edit": "Redigerbar",
      "editTip": "Redigerbart – markera om fältet finns i attributformuläret",
      "fieldName": "Namn",
      "fieldNameTip": "Namn – fältets namn som det anges i databasen",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Alias – fältets namn som det anges på kartan",
      "canPresetValue": "Förinställning",
      "canPresetValueTip": "Förinställt – alternativ för att visa fältet i den förinställda fältlistan och låta användaren ange värdet före redigering",
      "actions": "Åtgärder",
      "actionsTip": "Åtgärder – ändra fältens ordning eller gör inställningar för smarta attribut"
    },
    "smartAttSupport": "Smarta attribut kan inte användas för obligatoriska databasfält"
  },
  "actionPage": {
    "title": "Konfigurera attributåtgärder för <b>${fieldname}</b>",
    "smartActionTitle": "Konfigurera smarta attributåtgärder för <b>${fieldname}</b>",
    "description": "Åtgärderna är alltid inaktiva om du inte anger villkor som utlöser dem. Åtgärderna bearbetas i ordningsföljd och endast en åtgärd kan utlösas per fält. Ange villkor med knappen för villkorsredigering.",
    "copyAttributesNote": "Om du inaktiverar en åtgärd som har ett gruppnamn är det samma sak som att redigera åtgärden fristående, och åtgärden för det här fältet kommer att tas bort från respektive grupp.",
    "actionsSettingsTable": {
      "rule": "Åtgärd",
      "ruleTip": "Åtgärd – åtgärden utförs när villkoren är uppfyllda",
      "expression": "Uttryck",
      "expressionTip": "Uttryck – resultatuttrycket i SQL-format från angivna villkor",
      "groupName": "Gruppnamn",
      "groupNameTip": "Gruppnamn – visar gruppnamnet som uttrycket har tillämpats från",
      "actions": "Villkor",
      "actionsTip": "Villkor – ändra ordningen i regeln och ange villkor för när den ska utlösas"
    },
    "copyAction": {
      "description": "Fältvärdets källa bearbetas i turordning om det är aktiverat tills dess att ett giltigt villkor utlöses eller listan är slutförd. Ange villkor med knappen för villkorsredigering.",
      "intersection": "Korsning",
      "coordinates": "Koordinater",
      "address": "Adress",
      "preset": "Förinställning",
      "actionText": "Åtgärder",
      "criteriaText": "Villkor",
      "enableText": "Aktiverad"
    },
    "actions": {
      "hide": "Dölj",
      "required": "Nödvändig",
      "disabled": "Inaktiverad"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Varning: Redigera fristående kommer att ta bort den valda attributåtgärden med koppling till det här fältet från gruppen",
      "editGroupHint": "Varning: Redigera fristående kommer att ta bort den valda smarta åtgärden med koppling till det här fältet från gruppen",
      "popupTitle": "Välj redigeringsalternativ",
      "editAttributeGroup": "Den valda attributåtgärden anges från gruppen. Välj ett av följande alternativ för att redigera attributåtgärd:",
      "expression": "Uttrycket för vald smart åtgärd anges från gruppen. Välj ett av följande alternativ för att redigera uttryck för smart åtgärd:",
      "editGroupButton": "Redigera grupp",
      "editIndependentlyButton": "Redigera fristående"
    }
  },
  "filterPage": {
    "submitHidden": "Skicka attributdata för detta fält även om det är dolt?",
    "title": "Konfigurera uttryck för regeln ${action}",
    "filterBuilder": "Ange åtgärd för fältet när posten matchar ${any_or_all} av följande uttryck",
    "noFilterTip": "Använd verktygen nedan för att definiera påståendet för när åtgärden är aktiv."
  },
  "geocoderPage": {
    "setGeocoderURL": "Ange URL till geokodare",
    "hintMsg": "Obs! Du ändrar nu geokodningstjänsten, så se även till att du uppdaterar eventuella fältkarteringar för geokodning som du har konfigurerat.",
    "invalidUrlTip": "URL:en ${URL} är ogiltig eller går inte att öppna."
  },
  "addressPage": {
    "popupTitle": "Adress",
    "checkboxLabel": "Hämta värdet från geokodningstjänsten",
    "selectFieldTitle": "Attribut",
    "geocoderHint": "Du kan ändra geokodningstjänsten med knappen Inställningar för geokodning i de allmänna inställningarna",
    "prevConfigruedFieldChangedMsg": "Tidigare konfigurerat attribut har inte hittats i de aktuella geokodarinställningarna. Attributet har återställts till standard."
  },
  "coordinatesPage": {
    "popupTitle": "Koordinater",
    "checkboxLabel": "Hämta koordinater",
    "coordinatesSelectTitle": "Koordinatsystem",
    "coordinatesAttributeTitle": "Attribut",
    "mapSpatialReference": "Kartans geografiska referens",
    "latlong": "Latitud/longitud",
    "allGroupsCreatedMsg": "Alla möjliga grupper har redan skapats"
  },
  "presetPage": {
    "popupTitle": "Förinställning",
    "checkboxLabel": "Fältet är förinställt",
    "presetValueLabel": "Det aktuella förinställda värdet är:",
    "changePresetValueHint": "Det förinställda värdet kan ändras med knappen Definiera förinställda värden i de allmänna inställningarna"
  },
  "intersectionPage": {
    "groupNameLabel": "Namn",
    "dataTypeLabel": "Datatyp",
    "ignoreLayerRankingCheckboxLabel": "Ignorera rangordning av lager och hitta det närmaste geoobjektet bland alla definierade lager",
    "intersectingLayersLabel": "Lager för att extrahera ett värde",
    "layerAndFieldsApplyLabel": "Lager och fält för att använda extraherat värde",
    "checkboxLabel": "Hämta värde från korsningslagrets fält",
    "layerText": "Lager",
    "fieldText": "Fält",
    "actionsText": "Åtgärder",
    "toleranceSettingText": "Toleransinställningar",
    "addLayerLinkText": "Lägg till ett lager",
    "useDefaultToleranceText": "Använd standardtolerans",
    "toleranceValueText": "Toleransvärde",
    "toleranceUnitText": "Toleransenhet",
    "useLayerName": "– Använd lagernamn –",
    "noLayersMessage": "Inget fält har hittats i något lager av kartan som matchar den valda datatypen."
  },
  "presetAll": {
    "popupTitle": "Definiera de förinställda standardvärdena",
    "deleteTitle": "Ta bort förinställt värde",
    "hintMsg": "Alla unika förinställda fältnamn visas här. Om förinställda fält tas bort så inaktiveras respektive förinställda fält i alla lager/tabeller."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Tolerans för standardkorsning"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "Lägg till ny",
    "definedActions": "Definierade åtgärder",
    "priorityPopupTitle": "Ange prioritet för smarta åtgärder",
    "priorityPopupColumnTitle": "Smarta åtgärder",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Gruppnamn",
    "layerForExpressionLabel": "Lager för uttryck",
    "layerForExpressionNote": "Observera: Det valda lagrets fält kommer att användas för att definiera villkor",
    "expressionText": "Uttryck",
    "editExpressionLabel": "Redigera uttryck",
    "layerAndFieldsApplyLabel": "Lager och fält för användning",
    "submitAttributeText": "Skicka attributdata för valt dolt fält?",
    "priorityColumnText": "Prioritet",
    "requiredGroupNameMsg": "Detta värde är obligatoriskt",
    "uniqueGroupNameMsg": "Ange unikt gruppnamn, en grupp med det här namnet finns redan.",
    "deleteGroupPopupTitle": "Ta bort grupp för smarta åtgärder",
    "deleteGroupPopupMsg": "Om gruppen tas bort kommer uttrycket att tas bort från alla kopplade fältåtgärder.",
    "invalidExpression": "Uttrycket får inte vara tomt",
    "warningMsgOnLayerChange": "Det definierade uttrycket och fälten som det används på kommer att rensas.",
    "smartActionsTable": {
      "name": "Namn",
      "expression": "Uttryck",
      "definedFor": "Definierat för"
    }
  },
  "attributeActionsPage": {
    "name": "Namn",
    "type": "Typ",
    "deleteGroupPopupTitle": "Ta bort grupp för attributåtgärder",
    "deleteGroupPopupMsg": "Om gruppen tas bort kommer attributåtgärden att tas bort från alla kopplade fält.",
    "alreadyAppliedActionMsg": "Åtgärden ${action} har redan använts på det här fältet."
  },
  "chooseFromLayer": {
    "fieldLabel": "Fält",
    "valueLabel": "Värde",
    "selectValueLabel": "Välj värde"
  },
  "presetPopup": {
    "presetValueLAbel": "Förinställt värde"
  },
  "dataType": {
    "esriFieldTypeString": "Sträng",
    "esriFieldTypeInteger": "Nummer",
    "esriFieldTypeDate": "Datum",
    "esriFieldTypeGUID": "GUID"
  }
});