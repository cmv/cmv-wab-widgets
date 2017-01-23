define({
  "layersPage": {
    "title": "Valige objektide loomiseks mall",
    "generalSettings": "Üldseaded",
    "layerSettings": "Kihi seaded",
    "editDescription": "Sisestage redigeerimispaneelil kuvatav tekst",
    "editDescriptionTip": "See tekst kuvatakse mallivalija kohal. Kui te ei soovi teksti kuvada, jätke tühjaks.",
    "promptOnSave": "Viip salvestamata muudatuste salvestamiseks, kui vorm suletakse või valitakse järgmine kirje.",
    "promptOnSaveTip": "Kui kasutaja klõpsab sulgemisnuppu või liigub järgmisele redigeeritavale kirjele ja praegusel objektil on salvestamata muudatusi, kuvatakse see viip.",
    "promptOnDelete": "Kirje kustutamisel nõutakse kinnitust.",
    "promptOnDeleteTip": "Kui kasutaja klõpsab toimingu kinnitamiseks kustutamisnuppu, kuvatakse see viip.",
    "removeOnSave": "Salvestamisel eemaldatakse objekt valikust.",
    "removeOnSaveTip": "Valik objekti eemaldamiseks valitud komplektist, kui kirjet salvestatakse. Kui see on ainus valitud kirje, lülitub paneel tagasi mallilehele.",
    "useFilterEditor": "Kasuta objekti malli filtrit",
    "useFilterEditorTip": "Valik filtrimalli valija kasutamiseks, mille abil saab vaadata ühe kihi malle või otsida malle nime järgi.",
    "listenToGroupFilter": "Grupeerimise filtri vidina filtriväärtuste rakendamine eelseatud väljadele",
    "listenToGroupFilterTip": "Kui filter on rakendatud rühmafiltri vidinas, rakendage väärtus vastavale väljale eelseatud väärtuste loendis.",
    "keepTemplateActive": "Valitud malli hoidmine aktiivsena",
    "keepTemplateActiveTip": "Kui mall oli eelnevalt valitud, valige see mallivalija kuvamise korral uuesti.",
    "layerSettingsTable": {
      "allowDelete": "Luba kustutamine",
      "allowDeleteTip": "Valik, mis lubab kasutajal objekti kustutada. Kui kiht ei toeta kustutamist, on see valik keelatud.",
      "edit": "Muudetav",
      "editTip": "Valik kihi kaasamiseks vidinasse",
      "label": "Kiht",
      "labelTip": "Kihi nimi kaardil määratletud kujul",
      "update": "Keela geomeetria muutmine",
      "updateTip": "Valik geomeetria teisaldamise keelamiseks pärast selle paigutamist või olemasolevale objektile",
      "allowUpdateOnly": "Ainult uuenda",
      "allowUpdateOnlyTip": "Valik ainult olemasolevate objektide muutmiseks. Seda kontrollitakse vaikimisi ja see on välja lülitatud, kui kiht ei toeta uute objektide loomist.",
      "fields": "Väljad",
      "fieldsTip": "Saate muuta redigeeritavaid välju ja määratleda nutikad atribuudid",
      "description": "Kirjeldus",
      "descriptionTip": "Võimalus sisestada atribuudilehe ülaosas kuvatav tekst."
    },
    "editFieldError": "Mittemuudetavate kihtide korral ei saa välju muuta ja nutikad atribuudid pole saadaval",
    "noConfigedLayersError": "Smart Editor nõuab mitut muudetavat kihti"
  },
  "editDescriptionPage": {
    "title": "Määratle kihi <b>${layername}</b> atribuutide ülevaate tekst "
  },
  "fieldsPage": {
    "title": "Konfigureeri kihi <b>${layername}</b> väljad",
    "description": "Kasutage veergu Eelseatud, et lubada kasutajal sisestada väärtus enne uue objekti loomist. Kasutage kihi nutikate atribuutide aktiveerimiseks toimingute redigeerimise nuppu. Nutikad atribuudid võivad nõuda muudel väljadel olevate väärtustel põhineva välja olemassolu või nende peitmist või keelamist.",
    "fieldsNotes": "* on nõutav väli. Kui tühistate selle välja puhul märkeruudu Kuva valiku ja redigeerimismall ei täida seda välja väärtusega, ei saa te uut kirjet salvestada.",
    "fieldsSettingsTable": {
      "display": "Kuva",
      "displayTip": "Määrake, kas väli on nähtav või mitte",
      "edit": "Muudetav",
      "editTip": "Kontrollige, kas väli on atribuudi vormil olemas",
      "fieldName": "Nimi",
      "fieldNameTip": "Välja nimi, mis on andmebaasis määratletud",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Välja nimi, mis on kaardil määratletud",
      "canPresetValue": "Eelseatud",
      "canPresetValueTip": "Valik välja kuvamiseks eelseatud väljade loendis ja selleks, et lubada kasutajal määrata väärtuse enne muutmist",
      "actions": "Toimingud",
      "actionsTip": "Saate muuta väljade järjestust või seadistada nutikad atribuudid"
    },
    "smartAttSupport": "Nõutavad andmebaasi väljad ei toeta nutikaid atribuute"
  },
  "actionPage": {
    "title": "Konfigureerige välja <b>${fieldname}</b> nutikate atribuutide toimingud",
    "description": "Need toimingud on alati välja lülitatud, välja arvatud juhul, kui määratlete kriteeriumid, mille korral need sisse lülituvad. Toiminguid töödeldakse ettenähtud järjestuses ja iga välja kohta lülitatakse sisse ainult üks toiming. Kriteeriumide määratlemiseks kasutage nuppu Kriteeriumide muutmine.",
    "actionsSettingsTable": {
      "rule": "Tegevus",
      "ruleTip": "Kriteeriumidele vastavuse korral tehtav toiming",
      "expression": "Väljend",
      "expressionTip": "Määratletud kriteeriumide alusel saadav avaldis SQL-vormingus",
      "actions": "Kriteeriumid",
      "actionsTip": "Saate muuta reegli järjestust ja määratleda selle sisselülitumise kriteeriumid"
    },
    "actions": {
      "hide": "Peida",
      "required": "Nõutav",
      "disabled": "Keelatud"
    }
  },
  "filterPage": {
    "submitHidden": "Kas edastada selle välja kohta atribuudi andmed isegi siis, kui see on peidetud?",
    "title": "Konfigureerige toimingu ${action} reegli avaldis",
    "filterBuilder": "Saate määrata väljale toimingu, kui kirje vastab ${any_or_all} järgmistele avaldistele",
    "noFilterTip": "Määratlege alljärgnevate tööriistade abil avaldus, mille korral toiming on aktiivne."
  }
});