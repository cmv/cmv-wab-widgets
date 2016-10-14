define({
  "layersPage": {
    "title": "Välj en mall för att skapa geoobjekt",
    "generalSettings": "Allmänna inställningar",
    "layerSettings": "Lagerinställningar",
    "editDescription": "Ange visningstext för redigeringspanelen",
    "editDescriptionTip": "Den här texten visas ovanför mallväljaren. Lämna tomt om ingen text ska visas.",
    "promptOnSave": "Uppmana användaren att spara osparade ändringar när formuläret stängs eller vid övergång till nästa post.",
    "promptOnSaveTip": "Visa en uppmaning när användaren klickar på Stäng eller navigerar till nästa redigerbara post, om det finns ändringar som inte har sparats i det aktuella geoobjektet.",
    "promptOnDelete": "Begär bekräftelse innan en post tas bort.",
    "promptOnDeleteTip": "Visa en uppmaning om att bekräfta åtgärden när användaren klickat på Ta bort.",
    "removeOnSave": "Ta bort geoobjektet ur urvalet när posten sparas.",
    "removeOnSaveTip": "Alternativ för att ta bort geoobjektet ur urvalsuppsättningen när posten sparas. Om det är den enda valda posten återgår panelen till mallsidan.",
    "useFilterEditor": "Använd mallfilter för geoobjekt",
    "useFilterEditorTip": "Alternativ för att använda filtermallväljaren som ger möjlighet att visa ett lagers mallar eller söka efter mallar efter namn.",
    "listenToGroupFilter": "Tillämpa filtreringsvärden från gruppfiltreringswidgeten på förinställda fält",
    "listenToGroupFilterTip": "När ett filter används i gruppfiltreringswidgeten tillämpas värdet på ett matchande fält i listan över förinställda värden.",
    "keepTemplateActive": "Låt den markerade mallen vara aktiv",
    "keepTemplateActiveTip": "Om en mall har valts tidigare när mallväljlaren visas, väljer du den.",
    "layerSettingsTable": {
      "allowDelete": "Tillåt borttagning",
      "allowDeleteTip": "Alternativ för att låta användaren ta bort ett geoobjekt – inaktiverat om lagret inte medger borttagning",
      "edit": "Redigerbar",
      "editTip": "Alternativ för att ta med lagret i widgeten",
      "label": "Lager",
      "labelTip": "Lagrets namn som det anges på kartan",
      "update": "Inaktivera geometriredigering",
      "updateTip": "Alternativ för att inaktivera möjligheten att flytta geometrin när den placerats eller geometrin på ett befintligt geoobjekt",
      "allowUpdateOnly": "Endast uppdatering",
      "allowUpdateOnlyTip": "Alternativ för att endast tillåta ändring av befintliga geoobjekt – markerat som standard och inaktiverat om det inte går att skapa nya geoobjekt i lagret",
      "fields": "Fält",
      "fieldsTip": "Modifiera fälten som ska redigeras och definiera smarta attribut",
      "description": "Beskrivning",
      "descriptionTip": "Alternativ för att ange text som ska visas överst på attributsidan."
    },
    "editFieldError": "Fältmodifieringar och smarta attribut är inte tillgängliga för lager som inte kan redigeras",
    "noConfigedLayersError": "Smart redigerare kräver ett eller flera redigerbara lager"
  },
  "editDescriptionPage": {
    "title": "Definiera attributöversiktstext för <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurera fält för <b>${layername}</b>",
    "description": "Med kolumnen Förvalt kan du låta användaren ange ett värde innan ett nytt geoobjekt skapas. Med redigeringsknappen Åtgärder kan du aktivera smarta attribut för ett lager. Smarta attribut kan kräva, dölja eller inaktivera ett fält baserat på värden i andra fält.",
    "fieldsNotes": "* är ett obligatoriskt fält. Om du avmarkerar Visa för detta fält, och redigeringsmallen inte fyller i fältvärdet, kan du inte spara en ny post.",
    "fieldsSettingsTable": {
      "display": "Visa",
      "displayTip": "Ange om fältet inte är synligt",
      "edit": "Redigerbar",
      "editTip": "Markera om fältet finns i attributformuläret",
      "fieldName": "Namn",
      "fieldNameTip": "Fältets namn som det anges i geodatabasen",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Fältets namn som det anges på kartan",
      "canPresetValue": "Förinställning",
      "canPresetValueTip": "Alternativ för att visa fältet i den förinställda fältlistan och låta användaren ange värdet före redigering",
      "actions": "Åtgärder",
      "actionsTip": "Ändra fältens ordning eller gör inställningar för smarta attribut"
    },
    "smartAttSupport": "Smarta attribut kan inte användas för obligatoriska databasfält"
  },
  "actionPage": {
    "title": "Konfigurera smarta attributåtgärder för <b>${fieldname}</b>",
    "description": "Åtgärderna är alltid inaktiva om du inte anger villkor som utlöser dem. Åtgärderna bearbetas i ordningsföljd och endast en åtgärd kan utlösas per fält. Ange villkor med knappen för villkorsredigering.",
    "actionsSettingsTable": {
      "rule": "Åtgärd",
      "ruleTip": "Åtgärden utförs när villkoren är uppfyllda",
      "expression": "Uttryck",
      "expressionTip": "Resultatuttrycket i SQL-format från angivna villkor",
      "actions": "Villkor",
      "actionsTip": "Ändra ordningen i regeln och ange villkor för när den ska utlösas"
    },
    "actions": {
      "hide": "Dölj",
      "required": "Nödvändig",
      "disabled": "Inaktiverad"
    }
  },
  "filterPage": {
    "submitHidden": "Skicka attributdata för detta fält även om det är dolt?",
    "title": "Konfigurera uttryck för regeln ${action}",
    "filterBuilder": "Ange åtgärd för fältet när posten matchar ${any_or_all} av följande uttryck",
    "noFilterTip": "Använd verktygen nedan för att definiera påståendet för när åtgärden är aktiv."
  }
});