define({
  "layersPage": {
    "title": "Velg mal for å opprette geoobjekter",
    "generalSettings": "Generelle innstillinger",
    "layerSettings": "Laginnstillinger",
    "editDescription": "Angi visningstekst for redigeringspanelet",
    "editDescriptionTip": "Teksten vises over malvelgeren. La stå tomt om du ikke ønsker tekst.",
    "promptOnSave": "Spør om endringer skal lagres når skjemaet lukkes eller går til neste post.",
    "promptOnSaveTip": "Vis en melding når brukeren klikker på Lukk eller navigerer til neste redigerbare post hvis det er ulagrede endringer for gjeldende geoobjekt.",
    "promptOnDelete": "Be om bekreftelse ved sletting av post.",
    "promptOnDeleteTip": "Vis en melding som ber brukeren bekrefte slettingen.",
    "removeOnSave": "Fjern geoobjekt fra utvalg ved lagring.",
    "removeOnSaveTip": "Alternativ for å fjerne geoobjektet fra utvalget som er angitt når posten lagres. Hvis posten er den eneste valgte posten, går panelet tilbake til å vise malsiden.",
    "useFilterEditor": "Bruk geoobjektmal-filter",
    "useFilterEditorTip": "Alternativ for bruk av filtermalvelgeren som gjør det mulig å vise malene for ett lag eller søke etter maler basert på navn.",
    "listenToGroupFilter": "Bruk filterverdier fra widgeten Grupper filter i Forhåndsinnstilte felt",
    "listenToGroupFilterTip": "Når et filter brukes i widgeten Grupper filter, bruker du verdien i et tilsvarende felt i listen Forhåndsinnstilte verdier.",
    "keepTemplateActive": "Hold valgt mal aktiv",
    "keepTemplateActiveTip": "Hvis en mal tidligere ble valgt når malvelgeren vises, velger du den på nytt.",
    "layerSettingsTable": {
      "allowDelete": "Tillat sletting",
      "allowDeleteTip": "Alternativ som tillater at brukeren sletter et geoobjekt. Deaktivert dersom laget ikke støtter sletting.",
      "edit": "Redigerbar",
      "editTip": "Alternativ for å inkludere laget i miniprogrammet",
      "label": "Lag",
      "labelTip": "Navn på laget slik det er definert i kartet",
      "update": "Deaktiver redigering for geometri",
      "updateTip": "Alternativ som deaktiverer muligheten til å flytte geometrien etter at den er plassert  eller flytte geometrien på et eksisterende geoobjekt",
      "allowUpdateOnly": "Kun oppdatering",
      "allowUpdateOnlyTip": "Alternativ som kun tillater endring av eksisterende geoobjekter. Standardinnstillingen er at alternativet er valgt. Alternativet er deaktivert hvis laget ikke støtter oppretting av nye geoobjekter.",
      "fields": "Felter",
      "fieldsTip": "Endre feltene som skal redigeres og definer Smart-attributter",
      "description": "Beskrivelse",
      "descriptionTip": "Alternativ for å skrive inn tekst som skal vises øverst på siden med attributter."
    },
    "editFieldError": "Det er ikke mulig å endre felt og smarte attributter i lag som ikke er redigerbare",
    "noConfigedLayersError": "Smart redigering krever ett eller flere redigerbare lag"
  },
  "editDescriptionPage": {
    "title": "Angi tekst for attributtoversikt for <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurer felter for <b>${layername}</b>",
    "description": "Bruk Forhåndsdefinert-kolonnen til å gi brukerne tilgang til å angi en verdi før opprettelsen av et nytt geoobjekt. Bruk knappen for redigering av handlinger til å aktivere smarte attributter i et lag. Smarte attributter kan kreve, skjule eller deaktivere et felt basert på verdier i andre felt.",
    "fieldsNotes": "* obligatorisk felt. Hvis du fjerner merket for Vis for dette feltet, og redigeringsmalen ikke fyller inn denne feltverdien, kan du ikke lagre en ny post.",
    "fieldsSettingsTable": {
      "display": "Vis",
      "displayTip": "Angi om feltet ikke er synlig",
      "edit": "Redigerbar",
      "editTip": "Merk av for dette hvis feltet finnes i attributtskjemaet",
      "fieldName": "Navn",
      "fieldNameTip": "Navnet på feltet definert i databasen",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Navnet på feltet definert i kartet",
      "canPresetValue": "Forhåndsinnstilt",
      "canPresetValueTip": "Alternativ for å vise feltet i listen over forhåndsinnstilte felt og tillate at brukeren angir verdien før redigering",
      "actions": "Handlinger",
      "actionsTip": "Endre rekkefølgen på feltene, eller konfigurer smarte attributter"
    },
    "smartAttSupport": "Smarte attributter støttes ikke i obligatoriske databasefelt"
  },
  "actionPage": {
    "title": "Konfigurer handlinger for smarte attributter for <b>${fieldname}</b>",
    "description": "Disse handlingene er alltid deaktivert med mindre du angir vilkårene som skal utløse dem. Handlingene behandles i rekkefølge, og det utløses kun én handling per felt. Bruk knappen for redigering av vilkår til å definere vilkårene.",
    "actionsSettingsTable": {
      "rule": "Handling",
      "ruleTip": "Handling som utføres når vikårene oppfylles",
      "expression": "Uttrykk",
      "expressionTip": "Resulterende uttrykk i SQL-format fra de definerte vilkårene",
      "actions": "Vilkår",
      "actionsTip": "Endre rekkefølgen for regelen og definer vilkårene for når den utløses"
    },
    "actions": {
      "hide": "Skjul",
      "required": "Påkrevd",
      "disabled": "Deaktivert"
    }
  },
  "filterPage": {
    "submitHidden": "Sende inn attributtdata for dette feltet selv om det er skjult?",
    "title": "Konfigurer uttrykk for regelen ${action}",
    "filterBuilder": "Angi handling for feltet når posten samsvarer med ${any_or_all} av følgende uttrykk",
    "noFilterTip": "Bruk verktøyene nedenfor til å definere uttrykket for når handlingen er aktiv."
  }
});