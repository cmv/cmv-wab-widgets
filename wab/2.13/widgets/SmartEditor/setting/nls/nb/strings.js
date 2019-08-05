define({
  "layersPage": {
    "allLayers": "Alle lag",
    "title": "Velg mal for å opprette geoobjekter",
    "generalSettings": "Generelle innstillinger",
    "layerSettings": "Laginnstillinger",
    "smartActionsTabTitle": "Smarte handlinger",
    "attributeActionsTabTitle": "Attributthandlinger",
    "presetValueText": "Definer forhåndsinnstilte verdier",
    "geocoderSettingsText": "Innstillinger for geookoding",
    "editDescription": "Angi visningstekst for redigeringspanelet",
    "editDescriptionTip": "Teksten vises over malvelgeren. La stå tomt om du ikke ønsker tekst.",
    "promptOnSave": "Spør om endringer skal lagres når skjemaet lukkes eller går til neste post.",
    "promptOnSaveTip": "Vis en melding når brukeren klikker på Lukk eller navigerer til neste redigerbare post hvis det er ulagrede endringer for gjeldende geoobjekt.",
    "promptOnDelete": "Be om bekreftelse ved sletting av post.",
    "promptOnDeleteTip": "Vis en melding som ber brukeren bekrefte handlingen når bruker klikker slett.",
    "removeOnSave": "Fjern geoobjekt fra utvalg ved lagring.",
    "removeOnSaveTip": "Alternativ for å fjerne geoobjektet fra utvalget som er angitt når posten lagres. Hvis posten er den eneste valgte posten, går panelet tilbake til å vise malsiden.",
    "useFilterEditor": "Bruk geoobjektmal-filter",
    "useFilterEditorTip": "Alternativ for bruk av filtermalvelgeren som gjør det mulig å vise malen for ett lag eller søke etter maler basert på navn.",
    "displayShapeSelector": "Vis tegnealternativer",
    "createNewFeaturesFromExisting": "Tillat brukeren å opprette nye geoobjekter fra eksisterende geoobjekter",
    "createNewFeaturesFromExistingTip": "Alternativ for å tillate brukeren å kopiere eksisterende geoobjekt for å opprette nye geoobjekter",
    "copiedFeaturesOverrideDefaults": "Verdier fra kopierte geoobjekter overstyrer standardverdiene",
    "copiedFeaturesOverrideDefaultsTip": "Verdier fra de kopierte geoobjektene vil overstyre malens standardverdier bare for matchende felt",
    "displayShapeSelectorTip": "Alternativ for å vise en liste over gyldige tegnealternativer for den valgte malen.",
    "displayPresetTop": "Vis forhåndsinnstilt verdiliste øverst",
    "displayPresetTopTip": "Mulighet til å vise den forhåndsinnstilte verdilisten over malvelgeren.",
    "listenToGroupFilter": "Bruk filterverdier fra widgeten Grupper filter i Forhåndsinnstilte felt",
    "listenToGroupFilterTip": "Når et filter brukes i widgeten Grupper filter, bruker du verdien i et tilsvarende felt i listen Forhåndsinnstilte verdier.",
    "keepTemplateActive": "Hold valgt mal aktiv",
    "keepTemplateActiveTip": "Hvis en mal tidligere ble valgt når malvelgeren vises, velger du den på nytt.",
    "geometryEditDefault": "Aktiver geometriredigering som standard",
    "autoSaveEdits": "Lagrer nytt geoobjekt automatisk",
    "enableAttributeUpdates": "Vis oppdateringsknappen for attributthandlinger når redigering av geomertri er aktivert.",
    "enableAutomaticAttributeUpdates": "Iverksett automatisk attributthandling etter geometrioppdatering",
    "enableLockingMapNavigation": "Aktiver låsing av kartnavigering",
    "enableMovingSelectedFeatureToGPS": "Aktiver flytting av valgt punktgeoobjekt til GPS-posisjon",
    "enableMovingSelectedFeatureToXY": "Aktiver flytting av valgt punktgeoobjekt til XY-posisjon",
    "featureTemplateLegendLabel": "Innstillinger for geoobjektmal og filterverdier",
    "saveSettingsLegendLabel": "Lagre innstillinger",
    "geometrySettingsLegendLabel": "Geometriinnstillinger",
    "buttonPositionsLabel": "Plassering av knappene Lagre, Slett, Tilbake og Tøm",
    "belowEditLabel": "Under redigeringsskjema",
    "aboveEditLabel": "Over redigeringsskjema",
    "layerSettingsTable": {
      "allowDelete": "Tillat sletting",
      "allowDeleteTip": "Tillat sletting – Alternativ som tillater at brukeren sletter et geoobjekt; deaktivert dersom laget ikke støtter sletting",
      "edit": "Redigerbar",
      "editTip": "Redigerbart – Alternativ for å inkludere laget i miniprogrammet",
      "label": "Lag",
      "labelTip": "Lag – Navn på laget slik det er definert i kartet",
      "update": "Deaktiver redigering for geometri",
      "updateTip": "Deaktiver redigering av geometri – Alternativ som deaktiverer muligheten til å flytte geometrien etter at den er plassert, eller flytte geometrien på et eksisterende geoobjekt",
      "allowUpdateOnly": "Kun oppdatering",
      "allowUpdateOnlyTip": "Kun oppdatering – Alternativ som kun tillater endring av eksisterende geoobjekter; avmerket som standard og deaktivert hvis laget ikke støtter oppretting av nye geoobjekter",
      "fieldsTip": "Endre feltene som skal redigeres og definer Smart-attributter",
      "actionsTip": "Handlinger – Alternativ for å redigere felt eller få tilgang til tilknyttede lag/tabeller",
      "description": "Beskrivelse",
      "descriptionTip": "Beskrivelse – Alternativ for å skrive inn tekst som skal vises øverst på siden med attributter.",
      "relationTip": "Vis relaterte lag og tabeller"
    },
    "editFieldError": "Det er ikke mulig å endre felt og smarte attributter i lag som ikke er redigerbare",
    "noConfigedLayersError": "Smart redigering krever ett eller flere redigerbare lag",
    "toleranceErrorMsg": "Ugyldig standardverdi for krysningstoleranse"
  },
  "editDescriptionPage": {
    "title": "Angi tekst for attributtoversikt for <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurer felter for <b>${layername}</b>",
    "copyActionTip": "Attributthandlinger",
    "editActionTip": "Smarte handlinger",
    "description": "Bruk knappen for redigering av handlinger til å aktivere smarte attributter i et lag. Smarte attributter kan kreve, skjule eller deaktivere et felt basert på verdier i andre felt. Bruk knappen for kopiering av handlinger til å aktivere og definere kilden til feltverdien etter krysning, adresse, koordinater og forhåndsinnstilling.",
    "fieldsNotes": "* obligatorisk felt. Hvis du fjerner merket for Vis for dette feltet, og redigeringsmalen ikke fyller inn denne feltverdien, kan du ikke lagre en ny post.",
    "smartAttachmentText": "Konfigurer handlingen smarte vedlegg",
    "smartAttachmentPopupTitle": "Konfigurer smarte vedlegg for <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Vis",
      "displayTip": "Vis – Angir om feltet  er synlig eller ikke",
      "edit": "Redigerbar",
      "editTip": "Redigerbart – Merk av hvis feltet finnes i attributtskjemaet",
      "fieldName": "Navn",
      "fieldNameTip": "Navn – Navnet på feltet som er angitt i databasen",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Alias – Navnet på feltet som er angitt i kartet",
      "canPresetValue": "Forhåndsinnstilt",
      "canPresetValueTip": "Forhåndsinnstilt – Alternativ for å vise feltet i listen over forhåndsinnstilte felt og tillate at brukeren angir verdien før redigering",
      "actions": "Handlinger",
      "actionsTip": "Handlinger – Endre rekkefølgen på feltene, eller konfigurer smarte attributter"
    },
    "smartAttSupport": "Smarte attributter støttes ikke i obligatoriske databasefelt"
  },
  "actionPage": {
    "title": "Konfigurer smarte handlinger for <b>${fieldname}</b>",
    "smartActionTitle": "Konfigurer handlinger for smarte attributter for <b>${fieldname}</b>",
    "description": "Disse handlingene er alltid deaktivert med mindre du angir vilkårene som skal utløse dem. Handlingene behandles i rekkefølge, og det utløses kun én handling per felt. Bruk knappen for redigering av vilkår til å definere vilkårene.",
    "copyAttributesNote": "Deaktivering av enhver handling med gruppenavn vil si det samme som å redigere den aktuelle handlingen uavhengig, og det vil fjerne handlingen for dette feltet fra den aktuelle gruppen.",
    "actionsSettingsTable": {
      "rule": "Handling",
      "ruleTip": "Handling – Handling som utføres når vilkårene er oppfylt",
      "expression": "Uttrykk",
      "expressionTip": "Uttrykk – Resulterende uttrykk i SQL-format fra de definerte kriteriene",
      "groupName": "Gruppenavn",
      "groupNameTip": "Gruppenavn – Viser navnet på gruppen som uttrykket brukes fra",
      "actions": "Vilkår",
      "actionsTip": "Kriterier – Endrer rekkefølgen for regelen og definerer kriteriene for når den utløses"
    },
    "copyAction": {
      "description": "Kilder til feltverdier behandles i rekkefølge, hvis det er aktivert, til et gyldig vilkår utløses eller listen er fullført. Bruk knappen for redigering av vilkår til å definere vilkårene.",
      "intersection": "Kryss",
      "coordinates": "Koordinater",
      "address": "Adresse",
      "preset": "Forhåndsinnstilt",
      "actionText": "Handlinger",
      "criteriaText": "Vilkår",
      "enableText": "Aktivert"
    },
    "actions": {
      "hide": "Skjul",
      "required": "Påkrevd",
      "disabled": "Deaktivert"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Advarsel: Uavhengig redigering vil fjerne fra gruppen den valgte attributthandlingen som er tilknyttet dette feltet",
      "editGroupHint": "Advarsel: Uavhengig redigering vil fjerne fra gruppen den valgte smarte handlingen som er tilknyttet dette feltet",
      "popupTitle": "Velg redigeringsalternativ",
      "editAttributeGroup": "Den valgte attributthandlingen er angitt fra gruppen. Velg ett av følgende alternativer for å redigere attributthandlingen:",
      "expression": "Den valgte smarte handlingens uttrykk er angitt fra gruppen. Velg ett av følgende alternativer for å redigere uttrykket til den smarte handlingen:",
      "editGroupButton": "Rediger gruppe",
      "editIndependentlyButton": "Rediger uavhengig"
    }
  },
  "filterPage": {
    "submitHidden": "Sende inn attributtdata for dette feltet selv om det er skjult?",
    "title": "Konfigurer uttrykk for regelen ${action}",
    "filterBuilder": "Angi handling for feltet når posten samsvarer med ${any_or_all} av følgende uttrykk",
    "noFilterTip": "Bruk verktøyene nedenfor til å definere uttrykket for når handlingen er aktiv."
  },
  "geocoderPage": {
    "setGeocoderURL": "Angi geokoder-URL",
    "hintMsg": "Merk: Du er i ferd med å endre geokodingstjenesten. Du må oppdatere eventuelle felttilordninger du har konfigurert.",
    "invalidUrlTip": "URL-en ${URL} er ugyldig eller ikke tilgjengelig."
  },
  "addressPage": {
    "popupTitle": "Adresse",
    "checkboxLabel": "Hent verdi fra geokodingsverktøyet",
    "selectFieldTitle": "Attributt",
    "geocoderHint": "Hvis du vil endre geokodingsverktøy, velger du Innstillinger for geokoding i de generelle innstillingene",
    "prevConfigruedFieldChangedMsg": "Finner ikke tidligere konfigurert attributt i gjeldende innstillinger for geokoding. Attributtet er tilbakestilt til standardverdien."
  },
  "coordinatesPage": {
    "popupTitle": "Koordinater",
    "checkboxLabel": "Hent koordinater",
    "coordinatesSelectTitle": "Koordinatsystem",
    "coordinatesAttributeTitle": "Attributt",
    "mapSpatialReference": "Kartets romlige referanse",
    "latlong": "Lengdegrad/breddegrad",
    "allGroupsCreatedMsg": "Alle mulige grupper er allerede opprettet"
  },
  "presetPage": {
    "popupTitle": "Forhåndsinnstilt",
    "checkboxLabel": "Feltet forhåndsinnstilles",
    "presetValueLabel": "Gjeldende forhåndsinnstilte verdi er:",
    "changePresetValueHint": "Hvis du vil endre den forhåndsinnstilte verdien, trykker du på knappen Definer forhåndsinnstilte verdier i de generelle innstillingene."
  },
  "intersectionPage": {
    "groupNameLabel": "Navn",
    "dataTypeLabel": "Datatype",
    "ignoreLayerRankingCheckboxLabel": "Ignorer lagenes rekkefølge og finn nærmeste geoobjekt fra alle definerte lag",
    "intersectingLayersLabel": "Lag som det skal ekstraheres en verdi fra",
    "layerAndFieldsApplyLabel": "Lag og felt som en ekstrahert verdi skal brukes på",
    "checkboxLabel": "Hent verdi fra felt i krysningslaget",
    "layerText": "Lag",
    "fieldText": "Felter",
    "actionsText": "Handlinger",
    "toleranceSettingText": "Toleranseinnstillinger",
    "addLayerLinkText": "Legg til et lag",
    "useDefaultToleranceText": "Bruk standard toleranse",
    "toleranceValueText": "Toleranseverdi",
    "toleranceUnitText": "Toleranseenhet",
    "useLayerName": "– Bruk lagnavn –",
    "noLayersMessage": "Finner ingen felt i noen lag i kartet som samsvarer med den valgte datatypen."
  },
  "presetAll": {
    "popupTitle": "Definer standard forhåndsinnstilte verdier",
    "deleteTitle": "Slett forhåndsinnstilt verdi",
    "hintMsg": "Navnet på alle de unike forhåndsinnstilte feltene er oppført her. Hvis du fjerner et forhåndsinnstilt felt, deaktiveres det aktuelle feltet i alle lag/tabeller."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Standard krysningtoleranse"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "Legg til ny",
    "definedActions": "Angitte handlinger",
    "priorityPopupTitle": "Angi prioritet for smarte handlinger",
    "priorityPopupColumnTitle": "Smarte handlinger",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Gruppenavn",
    "layerForExpressionLabel": "Lag for uttrykk",
    "layerForExpressionNote": "Merk: Det valgte lagets felter vil bli brukt til å angi kriterier",
    "expressionText": "Uttrykk",
    "editExpressionLabel": "Rediger uttrykk",
    "layerAndFieldsApplyLabel": "Lag og felter det skal brukes på",
    "submitAttributeText": "Sende inn attributtdata for det/de valgte skjulte feltet/feltene?",
    "priorityColumnText": "Prioritet",
    "requiredGroupNameMsg": "Denne verdien er obligatorisk",
    "uniqueGroupNameMsg": "Skriv inn et unikt gruppenavn; det finnes allerede en gruppe med dette navnet.",
    "deleteGroupPopupTitle": "Slett gruppe for smarte handlinger",
    "deleteGroupPopupMsg": "Sletting av gruppen medfører at uttrykket fjernes fra alle de tilknyttede felthandlngene.",
    "invalidExpression": "Uttrykket må fylles ut",
    "warningMsgOnLayerChange": "Det angitte uttrykket og feltene det brukes i, vil bli slettet.",
    "smartActionsTable": {
      "name": "Navn",
      "expression": "Uttrykk",
      "definedFor": "Angitt for"
    }
  },
  "attributeActionsPage": {
    "name": "Navn",
    "type": "Type",
    "deleteGroupPopupTitle": "Slett gruppe for attributthandlinger",
    "deleteGroupPopupMsg": "Sletting av gruppen medfører at attributthandlingen fjernes fra alle de tilknyttede feltene.",
    "alreadyAppliedActionMsg": "Handlingen ${action} er allerede utført på dette feltet."
  },
  "chooseFromLayer": {
    "fieldLabel": "Felt",
    "valueLabel": "Verdi",
    "selectValueLabel": "Velg verdi"
  },
  "presetPopup": {
    "presetValueLAbel": "Forhåndsinnstilt verdi"
  },
  "dataType": {
    "esriFieldTypeString": "Streng",
    "esriFieldTypeInteger": "Tall",
    "esriFieldTypeDate": "Dato",
    "esriFieldTypeGUID": "GUID"
  }
});