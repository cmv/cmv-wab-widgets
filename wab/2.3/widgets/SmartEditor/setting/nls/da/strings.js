define({
  "layersPage": {
    "title": "Vælg en skabelon til at oprette objekter med",
    "generalSettings": "Generelle indstillinger",
    "layerSettings": "Lagindstillinger",
    "editDescription": "Angiv visningstekst for redigeringspanelet",
    "editDescriptionTip": "Denne tekst vises oven over skabelonvælgeren. Du kan lade feltet være tomt, hvis du ikke ønsker nogen tekst.",
    "promptOnSave": "Prompt om at gemme ikke-gemte redigeringer, når formularen lukkes eller skifter til den næste post.",
    "promptOnSaveTip": "Viser en prompt, når brugeren klikker på luk eller navigerer til den næste redigérbare post, når det aktuelle objekt har ikke-gemte redigeringer.",
    "promptOnDelete": "Bed om bekræftelse, når der skal slettes en post.",
    "promptOnDeleteTip": "Viser en prompt, når brugeren klikker på slet for at bekræfte handlingen.",
    "removeOnSave": "Fjern objekt fra markeringen efter lagring.",
    "removeOnSaveTip": "Indstilling, der fjerner objektet fra den angivne markering, når posten gemmes. Hvis det er den eneste valgte post, skifter panelet tilbage til skabelonsiden.",
    "useFilterEditor": "Brug objektskabelonfilter",
    "useFilterEditorTip": "Indstilling, der bruger filterskabelonvælgeren, som giver mulighed for at få vist enkeltlagsskabeloner eller søge efter skabeloner efter navn.",
    "listenToGroupFilter": "Anvend filterværdier fra Gruppefiltrerings-widget'en til de forudindstillede felter",
    "listenToGroupFilterTip": "Når der anvendes et filter i Gruppefiltrerings-widget'en, skal værdien anvendes til et tilsvarende felt på listen Foruddefineret værdi.",
    "keepTemplateActive": "Bevar den valgte skabelon som aktiv",
    "keepTemplateActiveTip": "Hvis der tidligere har været valgt en skabelon, når skabelonvælgeren vises, skal du vælge skabelonen igen.",
    "layerSettingsTable": {
      "allowDelete": "Tillad sletning",
      "allowDeleteTip": "Indstilling, der gør det muligt for brugeren at slette et objekt. Indstillingen deaktiveres, hvis laget ikke understøtter sletning",
      "edit": "Redigérbar",
      "editTip": "Indstilling, der omfatter laget i widget'en",
      "label": "Lag",
      "labelTip": "Navnet på laget, som det er defineret i kortet",
      "update": "Deaktivér geometriredigering",
      "updateTip": "Indstilling, der deaktiverer muligheden for at flytte geometrien, når den først er placeret, eller at flytte geometrien for et eksisterende objekt",
      "allowUpdateOnly": "Opdatér kun",
      "allowUpdateOnlyTip": "Indstilling, der kun tillader redigering af eksisterende objekter. Indstillingen er aktiveret som standard, og den deaktiveres, hvis laget ikke understøtter oprettelse af nye objekter",
      "fields": "Felter",
      "fieldsTip": "Redigér de felter, der skal redigeres, og definér smarte attributter",
      "description": "Beskrivelse",
      "descriptionTip": "Indstilling til indtastning af tekst, der skal vises øverst på attributsiden."
    },
    "editFieldError": "Feltredigeringer og smarte attributter er ikke tilgængelige for lag, der ikke er redigérbare",
    "noConfigedLayersError": "Smart-redigering kræver et eller flere redigérbare lag"
  },
  "editDescriptionPage": {
    "title": "Definér attributoversigtsteksten for <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurér felter for <b>${layername}</b>",
    "description": "Brug kolonnen for forudindstilling til at gøre det muligt for brugeren at angive en værdi, før der oprettes et nyt objekt. Brug handlingsredigeringsknappen til at aktivere smarte attributter for laget. Smarte attributter kan gøre et felt påkrævet eller skjule eller deaktivere feltet ud fra værdierne i andre felter.",
    "fieldsNotes": "* er et påkrævet felt. Hvis du fjerner markeringen af Vis for dette felt, og redigeringsskabelonen ikke udfylder den pågældende feltværdi, vil du ikke kunne gemme en ny post.",
    "fieldsSettingsTable": {
      "display": "Visning",
      "displayTip": "Bestem, om feltet skal være synlig eller ej",
      "edit": "Redigérbar",
      "editTip": "Markér, hvis feltet findes i attributform",
      "fieldName": "Navn",
      "fieldNameTip": "Navnet på feltet, som det er defineret i databasen",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Navnet på feltet, som det er defineret i kortet",
      "canPresetValue": "Forudindstillet",
      "canPresetValueTip": "Indstilling, der viser feltet i listen med forudindstillede felter og gør det muligt for brugeren at angive værdien før redigering",
      "actions": "Handlinger",
      "actionsTip": "Redigér felternes rækkefølge, eller definér smarte attributter"
    },
    "smartAttSupport": "Smarte attributter understøttes ikke for de påkrævede databasefelter"
  },
  "actionPage": {
    "title": "Konfigurér smarte attributhandlinger for <b>${fieldname}</b>",
    "description": "Handlingerne er altid deaktiverede, medmindre du angiver de kriterier, som skal udløse handlingerne. Handlingerne behandles i rækkefølge, og der udløses kun én handling pr. felt. Brug kriterieredigeringsknappen til at definere kriterierne.",
    "actionsSettingsTable": {
      "rule": "Handling",
      "ruleTip": "Handlingen udføres, når kriterierne er opfyldt",
      "expression": "Udtryk",
      "expressionTip": "Det resulterende udtryk i SQL-format ud fra de definerede kriterier",
      "actions": "Kriterier",
      "actionsTip": "Redigér rækkefølgen for reglerne, og definér kriterierne for, hvornår handlingen skal udløses"
    },
    "actions": {
      "hide": "Skjul",
      "required": "Krævet",
      "disabled": "Deaktiveret"
    }
  },
  "filterPage": {
    "submitHidden": "Send attributdata for dette felt, også når det er skjult?",
    "title": "Konfigurér udtryk for reglen ${action}",
    "filterBuilder": "Angiv handlingen for feltet, når posten svarer til ${any_or_all} af følgende udtryk",
    "noFilterTip": "Definér erklæringen for, hvornår handlingen er aktiv, ved hjælp af værktøjerne nedenfor."
  }
});