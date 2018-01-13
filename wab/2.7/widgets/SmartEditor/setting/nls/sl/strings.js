define({
  "layersPage": {
    "title": "Izberite predlogo za ustvarjanje geoobjektov",
    "generalSettings": "Splošne nastavitve",
    "layerSettings": "Nastavitve sloja",
    "editDescription": "Navedi besedilo za prikaz za ploščo za urejanje",
    "editDescriptionTip": "To besedilo je prikazano nad izbirnikom predlog. Če ne želite prikaza, polje pustite prazno.",
    "promptOnSave": "Poziv k shranjevanju neshranjenih urejanj ob zapiranju obrazca ali preklapljanja na naslednji zapis.",
    "promptOnSaveTip": "Prikaži poziv, ko uporabnik klikne zapri ali se premakne na naslednji uredljiv zapis, trenutni geoobjekt pa ima neshranjeno urejanje.",
    "promptOnDelete": "Pri brisanju zapisa zahtevaj potrditev.",
    "promptOnDeleteTip": "Prikaži poziv za potrditev dejanja, ko uporabnik klikne izbriši.",
    "removeOnSave": "Pri shranjevanju odstrani geoobjekt iz izbire.",
    "removeOnSaveTip": "Možnost, da odstranite geoobjekt iz nabora izbire, ko je zapis shranjen. Če obstaja samo izbrani zapis, se bo plošča preklopila nazaj na stran predlog.",
    "useFilterEditor": "Uporabite filter za predloge geoobjektov",
    "useFilterEditorTip": "Možnost uporabe filtra izbirnika predlog, ki ponuja možnost ogleda predlog enega sloja ali iskanje predlog po imenu.",
    "displayShapeSelector": "Pokaži možnosti risanja",
    "displayShapeSelectorTip": "Možnost, ki pokaže seznam veljavnih možnosti risanja za izbrano predlogo.",
    "displayPresetTop": "Prikaži prednastavljen seznam vrednosti na vrhu",
    "displayPresetTopTip": "Možnost, ki pokaže seznam prednastavljenih vrednosti nad izbirnikom predloge.",
    "listenToGroupFilter": "Uporabi v prednastavljenih poljih filtrirane vrednosti iz pripomočka skupinskega filtra",
    "listenToGroupFilterTip": "Ko je filter uporabljen v pripomočku skupinskega filtra, uporabite vrednost na ustreznem polju na seznamu prednastavljenih vrednosti.",
    "keepTemplateActive": "Naj izbrana predloga ostane aktivna",
    "keepTemplateActiveTip": "Ko je prikazan izbirnik predloge, ponovno izberite predlogo.",
    "geometryEditDefault": "Omogočite urejanje geometrije kot privzeto.",
    "autoSaveEdits": "Samodejno shrani urejeno",
    "layerSettingsTable": {
      "allowDelete": "Dovoli brisanje",
      "allowDeleteTip": "Možnost, ki dovoljuje uporabnikom brisanje geoobjektov: je onemogočena, če sloj ne podpira brisanja",
      "edit": "Za urejanje",
      "editTip": "Možnost, da se v pripomoček vključi sloj",
      "label": "Sloj",
      "labelTip": "Ime sloja, kot je določeno na karti",
      "update": "Onemogoči urejanje geometrije",
      "updateTip": "Možnost, da se onemogoči sposobnost premikanja že postavljene geometrije ali premikanje geometrije na obstoječem geoobjektu",
      "allowUpdateOnly": "Samo posodobitev",
      "allowUpdateOnlyTip": "Možnost, ki dovoljuje samo privzete spremembe na obstoječih geoobjektov: onemogočene, če sloj ne podpira ustvarjanja novih geoobjektov",
      "fields": "Polja",
      "fieldsTip": "Spremenite polja, da jih bo mogoče urejati, in določite pametne atribute",
      "description": "Opis",
      "descriptionTip": "Možnost vnosa besedila za prikaz na vrhu strani z atributi."
    },
    "editFieldError": "Spremembe polja in pametni atributi niso na voljo za sloje, ki niso za urejanje.",
    "noConfigedLayersError": "Pametni urejevalnik zahteva enega ali več slojev za urejanje"
  },
  "editDescriptionPage": {
    "title": "Določite besedilo pregleda atributov za <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurirajte polja za <b>${layername}</b>",
    "description": "Uporabite prednastavljeni stolpec, da uporabniku dovolite vnos vrednosti, preden ustvari nov geoobjekt. Uporabite gumb Urejanje dejanj, da aktivirate pametne atribute na sloju. Pametni atributi lahko zahtevajo, skrijejo ali onemogočijo polje glede na vrednosti v drugih poljih.",
    "fieldsNotes": "* je obvezno polje. Če odkljukate Prikaži za to polje, se vrednost tega polja v predlogi za urejanje ne izpolni. Novega zapisa tako ne boste mogli shraniti.",
    "fieldsSettingsTable": {
      "display": "Prikaz",
      "displayTip": "Določite, če polje ni vidno",
      "edit": "Za urejanje",
      "editTip": "Preverite, ali je polje prisotno v obrazcu z atributi",
      "fieldName": "Ime",
      "fieldNameTip": "Ime polja, kot je določeno v zbirki podatkov",
      "fieldAlias": "Vzdevek",
      "fieldAliasTip": "Ime polja, kot je določeno na karti",
      "canPresetValue": "Prednastavi",
      "canPresetValueTip": "Možnost, da prikažete polje na seznamu predhodno nastavljenih polj in dovolite uporabnikom, da pred urejanjem nastavijo vrednost.",
      "actions": "Dejanja",
      "actionsTip": "Spremenite vrsti red polj ali nastavite pametne atribute"
    },
    "smartAttSupport": "Pametni atributi niso podprti v zahtevanih poljih zbirke podatkov"
  },
  "actionPage": {
    "title": "Konfigurirajte dejanja pametnih atributov za <b>${fieldname}</b>",
    "description": "Dejanja so vedno izklopljena, razen če navedete kriterije, ki jih bodo sprožila. Dejanja se obdelujejo po vrstnem redu in za vsako polje bo sproženo eno dejanje. Uporabite gumb Urejanje kriterijev, da jih določite.",
    "actionsSettingsTable": {
      "rule": "Dejanje",
      "ruleTip": "Izvedeno dejanje, ko je kriterij izpolnjen",
      "expression": "Izraz",
      "expressionTip": "Nastali izraz v obliki zapisa SQL iz določenih kriterijev.",
      "actions": "Kriterij",
      "actionsTip": "Spremeni vrstni red pravil in določi sprožitvene kriterije"
    },
    "actions": {
      "hide": "Skrij",
      "required": "Zahtevano",
      "disabled": "Onemogočeno"
    }
  },
  "filterPage": {
    "submitHidden": "Pošljem podatke o atributih za to polje tudi ko je skrito?",
    "title": "Konfiguriraj izraz za pravilo ${action}",
    "filterBuilder": "Nastavi dejanje za polje, ko se zapisi ujemajo z ${any_or_all} naslednjimi izrazi",
    "noFilterTip": "Uporabite spodnja orodja, določite izjave, kdaj je dejanje aktivno."
  }
});