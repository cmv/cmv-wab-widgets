define({
  "configText": "Definer filtergruppene nedenfor",
  "labels": {
    "groupName": "Navn på filtersett:",
    "groupNameTip": "Navn på filteret som brukeren velger fra.",
    "groupDesc": "Beskrivelse:",
    "groupDescTip": "Beskrivelse av filtersettet.",
    "groupOperator": "Forhåndsinnstilt operator:",
    "groupOperatorTip": "Alternativ for å forhåndsdefinere operatoren i filteret. Hvis Forhåndsinnstilt operator ikke er valgt, bruker filteret Lik operator.",
    "groupDefault": "Forhåndsinnstilt verdi:",
    "groupDefaultTip": "Alternativ for å velge en verdi fra et eksisterende lag.",
    "sameLayerAppend": "Når et lag er oppgitt mer enn én gang, bruker du følgende operator mellom feltene:",
    "sameLayerConjunc": "Legg til ved hjelp av:"
  },
  "buttons": {
    "addNewGroup": "Legg til ny gruppe",
    "addNewGroupTip": "Legg til et nytt filtersett.",
    "addLayer": "Legg til lag",
    "addLayerTip": "Legg til et lag i filtersettet."
  },
  "inputs": {
    "groupName": "Gi gruppen et navn",
    "groupDesc": "Beskrivelse for gruppen",
    "groupDefault": "Angi en forhåndsinnstilt verdi",
    "simpleMode": "Start i enkel visning",
    "simpleModeTip": "Alternativ for å forenkle det konfigurerte widgetgrensesnittet. Når avmerkingsboksen er merket av, fjernes rullegardinlisten for operatorer og knappene for å legge til kriterier fra grensesnittet.",
    "webmapAppendMode": "Legg til filter i eksisterende webkartfilter ved hjelp av ",
    "webmapAppendModeTip": "Alternativ for å legge til filtersettet i et eksisterende webkartfilter. Operatorer som støttes, er ELLER og OG.",
    "persistOnClose": "Behold etter at miniprogrammet er lukket",
    "optionsMode": "Skjul alternative for miniprogram",
    "optionsModeTip": "Alternativ for å vise flere widgetinnstillinger. Hvis avmerkingsboksen er merket av, fjernes muligheten til å lagre og laste definerte filtre og beholde filteret når widgeten er lukket fra grensesnittet.",
    "optionOR": "ELLER",
    "optionAND": "OG",
    "optionEQUAL": "LIK",
    "optionNOTEQUAL": "IKKE LIK",
    "optionGREATERTHAN": "STØRRE ENN",
    "optionGREATERTHANEQUAL": "STØRRE ENN ELLER LIK",
    "optionLESSTHAN": "MINDRE ENN",
    "optionLESSTHANEQUAL": "MINDRE ENN ELLER LIK",
    "optionSTART": "BEGYNNER MED",
    "optionEND": "SLUTTER MED",
    "optionLIKE": "INNEHOLDER",
    "optionNOTLIKE": "INNEHOLDER IKKE",
    "optionONORBEFORE": "ER PÅ ELLER FØR",
    "optionONORAFTER": "ER PÅ ELLER ETTER",
    "optionNONE": "INGEN"
  },
  "tables": {
    "layer": "Lag",
    "layerTip": "Navn på laget slik det er definert i kartet.",
    "field": "Felter",
    "fieldTip": "Felt som laget filtreres på.",
    "value": "Bruk verdi",
    "valueTip": "Alternativ for å bruke rullegardinlisteverdier fra laget. Hvis det ikke er et lag som bruker denne parameteren, vises en enkel tekstboks for brukeren.",
    "zoom": "Zoom",
    "zoomTip": "Alternativ for å zoome til utstrekningen av geoobjektene når filteret brukes. Du kan bare velge ett lag du kan zoome til.",
    "action": "Slett",
    "actionTip": "Fjern lag fra filtersettet."
  },
  "popup": {
    "label": "Velg en verdi"
  },
  "errors": {
    "noGroups": "Du må ha minst én gruppe.",
    "noGroupName": "Et eller flere gruppenavn mangler.",
    "noDuplicates": "Et eller flere gruppenavn er like.",
    "noRows": "Du må ha minst én rad i tabellen.",
    "noLayers": "Du har ingen lag i kartet."
  },
  "picker": {
    "description": "Bruk dette skjemaet til å finne en forhåndsinnstilt verdi for denne gruppen.",
    "layer": "Velg et lag",
    "layerTip": "Navn på laget slik det er definert i webkartet.",
    "field": "Velg et felt",
    "fieldTip": "Felt som den forhåndsinnstilte verdien angis fra.",
    "value": "Velg en verdi",
    "valueTip": "Verdi som vil være standardverdien for widgeten."
  }
});