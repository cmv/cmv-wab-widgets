define({
  "layersPage": {
    "allLayers": "Vsi sloji",
    "title": "Izberite predlogo za ustvarjanje geoobjektov",
    "generalSettings": "Splošne nastavitve",
    "layerSettings": "Nastavitve sloja",
    "smartActionsTabTitle": "Pametna dejanja",
    "attributeActionsTabTitle": "Dejanja atributov",
    "presetValueText": "Določi prednastavljene vrednosti",
    "geocoderSettingsText": "Nastavitve geokodirnika",
    "editDescription": "Navedi prikazano besedilo za ploščo urejanja",
    "editDescriptionTip": "To besedilo je prikazano nad izbirnikom predlog. Če ne želite prikaza, polje pustite prazno.",
    "promptOnSave": "Poziv k shranjevanju neshranjenih urejanj ob zapiranju obrazca ali preklapljanja na naslednji zapis.",
    "promptOnSaveTip": "Prikaži poziv, ko uporabnik klikne zapri ali se premakne na naslednji uredljiv zapis, trenutni geoobjekt pa ima neshranjeno urejanje.",
    "promptOnDelete": "Pri brisanju zapisa zahtevaj potrditev.",
    "promptOnDeleteTip": "Prikaži poziv za potrditev dejanja, ko uporabnik klikne izbriši.",
    "removeOnSave": "Pri shranjevanju odstrani geoobjekt iz izbire.",
    "removeOnSaveTip": "Možnost, da odstranite geoobjekt iz nabora izbire, ko je zapis shranjen. Če obstaja samo izbrani zapis, se bo plošča preklopila nazaj na stran predlog.",
    "useFilterEditor": "Uporabite filter predlog geoobjektov",
    "useFilterEditorTip": "Možnost uporabe filtra izbirnika predlog, ki ponuja možnost ogleda predloge enega sloja ali iskanje predlog po imenu.",
    "displayShapeSelector": "Pokaži možnosti risanja",
    "createNewFeaturesFromExisting": "Dovoli uporabniku, da ustvari nove geoobjekte iz obstoječih geoobjektov.",
    "createNewFeaturesFromExistingTip": "Možnost, ki uporabniku dovoljuje, da kopira obstoječi geoobjekt, da ustvari nove geoobjekte.",
    "copiedFeaturesOverrideDefaults": "Kopirani geoobjekti preglasijo privzete.",
    "copiedFeaturesOverrideDefaultsTip": "Vrednosti kopiranih geoobjektov bodo preglasile privzete vrednosti predlog samo za polja, ki se ujemajo.",
    "displayShapeSelectorTip": "Možnost, ki pokaže seznam veljavnih možnosti risanja za izbrano predlogo.",
    "displayPresetTop": "Prikaži na vrhu seznam prednastavljenih vrednosti",
    "displayPresetTopTip": "Možnost, ki pokaže seznam prednastavljenih vrednosti nad izbirnikom predloge.",
    "listenToGroupFilter": "V prednastavljenih poljih uporabi filtrirane vrednosti iz pripomočka skupinskega filtra",
    "listenToGroupFilterTip": "Ko je filter uporabljen v pripomočku skupinskega filtra, uporabite vrednost na ustreznem polju na seznamu prednastavljenih vrednosti.",
    "keepTemplateActive": "Ohrani izbrano predlogo aktivno",
    "keepTemplateActiveTip": "Ko je prikazan izbirnik predloge in če je bila predloga že izbrana, jo ponovno izberite.",
    "geometryEditDefault": "Privzeto omogočite urejanje geometrije.",
    "autoSaveEdits": "Samodejno shrani nov geoobjekt",
    "enableAttributeUpdates": "Prikaži gumb za posodobitev Dejanj atributov, ko je aktivno urejanje geometrije",
    "enableAutomaticAttributeUpdates": "Samodejno pokliči dejanje atributov po posodobitvi geometrije",
    "enableLockingMapNavigation": "Omogoči zaklepanje navigacije po karti",
    "enableMovingSelectedFeatureToGPS": "Omogoči premik izbranega točkovnega geoobjekta na lokacijo GPS",
    "enableMovingSelectedFeatureToXY": "Omogoči premik izbranega točkovnega geoobjekta na lokacijo XY",
    "featureTemplateLegendLabel": "Nastavitve predloge geoobjekta in vrednosti filtra",
    "saveSettingsLegendLabel": "Shrani nastavitve",
    "geometrySettingsLegendLabel": "Nastavitve geometrije",
    "buttonPositionsLabel": "Položaj gumbov Shrani, Izbriši, Nazaj in Počisti izbiro",
    "belowEditLabel": "Pod obrazcem za urejanje",
    "aboveEditLabel": "Nad obrazcem za urejanje",
    "layerSettingsTable": {
      "allowDelete": "Brisanje",
      "allowDeleteTip": "Dovoli brisanje – privzeta je možnost, ki uporabnikom dovoljuje brisanje geoobjektov. V primeru, da sloj ne podpira brisanja, je onemogočena.",
      "edit": "Uredljiv",
      "editTip": "Uredljivo – možnost, da se v pripomoček vključi sloj.",
      "label": "Sloj",
      "labelTip": "Sloj – ime sloja, kot je določeno na karti.",
      "update": "Onemogoči urejanje",
      "updateTip": "Onemogoči urejanje geometrije– možnost, da se onemogoči sposobnost premikanja že postavljene geometrije ali premikanje geometrije na obstoječem geoobjektu",
      "allowUpdateOnly": "Posodobi",
      "allowUpdateOnlyTip": "Samo posodobi – privzeta je možnost, ki dovoljuje spremembe le na obstoječih geoobjektih. V primeru, da sloj ne podpira ustvarjanja novih geoobjektov, je onemogočena.",
      "fieldsTip": "Spremenite polja, da jih bo mogoče urejati, in določite pametne atribute",
      "actionsTip": "Dejanja – možnost za urejanje polj ali dostopanje do relacijskih slojev/tabel",
      "description": "Opis",
      "descriptionTip": "Opis – možnost vnosa besedila za prikaz na vrhu strani z atributi.",
      "relationTip": "Ogled relacijskih slojev in tabel"
    },
    "editFieldError": "Spremembe polja in pametni atributi niso na voljo za neuredljive sloje.",
    "noConfigedLayersError": "Pametni urejevalnik zahteva enega ali več uredljivih slojev",
    "toleranceErrorMsg": "Neveljavna tolerančna vrednost privzetega preseka"
  },
  "editDescriptionPage": {
    "title": "Določite besedilo pregleda atributov za <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurirajte polja za <b>${layername}</b>",
    "copyActionTip": "Dejanja atributov",
    "editActionTip": "Pametna dejanja",
    "description": "Uporabite gumb Urejanje dejanj, da aktivirate pametne atribute na sloju. Pametni atributi lahko zahtevajo, skrijejo ali onemogočijo polje glede na vrednost v drugih poljih. Uporabite gumb Kopiranje dejanj, da aktivirate in določite vir vrednosti polja po preseku, polju, koordinatah in prednastavitvi.",
    "fieldsNotes": "* je obvezno polje. Če odkljukate Prikaži za to polje, se vrednost tega polja v predlogi za urejanje ne izpolni. Novega zapisa tako ne boste mogli shraniti.",
    "smartAttachmentText": "Konfiguriraj dejanje pametnih prilog",
    "smartAttachmentPopupTitle": "Konfigurirajte pametne priloge za <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Prikaz",
      "displayTip": "Prikaz – določite, če polje ni vidno.",
      "edit": "Uredljiv",
      "editTip": "Uredljivo – preverite, ali je polje prisotno v obrazcu z atributi.",
      "fieldName": "Ime",
      "fieldNameTip": "Ime – ime polja, kot je določeno v zbirki podatkov",
      "fieldAlias": "Vzdevek",
      "fieldAliasTip": "Vzdevek – ime polja, kot je določeno na karti",
      "canPresetValue": "Prednastavi",
      "canPresetValueTip": "Prednastavitev – možnost, da prikažete polje na seznamu predhodno nastavljenih polj in dovolite uporabnikom, da pred urejanjem nastavijo vrednost.",
      "actions": "Dejanja",
      "actionsTip": "Dejanja – spremenite vrsti red polj ali nastavite pametne atribute."
    },
    "smartAttSupport": "Pametni atributi niso podprti v zahtevanih poljih zbirke podatkov"
  },
  "actionPage": {
    "title": "Konfigurirajte dejanja atributov za <b>${fieldname}</b>",
    "smartActionTitle": "Konfigurirajte dejanja pametnih atributov za <b>${fieldname}</b>",
    "description": "Dejanja so vedno izklopljena, razen če navedete kriterije, ki jih bodo sprožila. Dejanja se obdelujejo po vrstnem redu in za vsako polje bo sproženo eno dejanje. Uporabite gumb Urejanje kriterijev, da jih določite.",
    "copyAttributesNote": "Onemogočenje katerega koli dejanja z imenom skupine bo enako kot neodvisno urejanje tega dejanja. Prav tako bo odstranjeno dejanje za to polje iz zadevne skupine.",
    "actionsSettingsTable": {
      "rule": "Dejanje",
      "ruleTip": "Dejanje – izvedeno dejanje, ko je kriterij izpolnjen",
      "expression": "Izraz",
      "expressionTip": "Izraz – nastali izraz v obliki zapisa SQL iz določenih kriterijev",
      "groupName": "Ime skupine",
      "groupNameTip": "Ime skupine – prikaže ime skupine, iz katere se uporablja izraz.",
      "actions": "Kriterij",
      "actionsTip": "Kriterij – spremeni vrstni red pravil in določi sprožitvene kriterije"
    },
    "copyAction": {
      "description": "Vir vrednosti polja je obdelan, če bi bil aktiviran, dokler veljavni kriteriji ne bi bili sproženi ali obdelan celoten seznam. Uporabite gumb Urejanje kriterijev, da določite kriterije.",
      "intersection": "Presek",
      "coordinates": "Koordinate",
      "address": "Naslov",
      "preset": "Prednastavljeno",
      "actionText": "Dejanja",
      "criteriaText": "Kriterij",
      "enableText": "Omogočeno"
    },
    "actions": {
      "hide": "Skrij",
      "required": "Zahtevano",
      "disabled": "Onemogočeno"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Opozorilo – neodvisno urejanje odstrani dejanje izbranega atributa, povezanega za to polje iz te skupine.",
      "editGroupHint": "Opozorilo – neodvisno urejanje odstrani dejanje izbranega pametnega dejanja, povezanega za to polje iz te skupine.",
      "popupTitle": "Izberi možnost urejanja",
      "editAttributeGroup": "Izbrano dejanje atributa ni določeno iz skupine. Izberite eno izmed naslednjih možnosti za urejanje dejanja atributa:",
      "expression": "Izraz izbranega pametnega dejanja je opredeljeno iz skupine. Izberite eno izmed naslednjih možnosti za urejanje izraza pametnega dejanja:",
      "editGroupButton": "Uredi skupino",
      "editIndependentlyButton": "Uredi neodvisno"
    }
  },
  "filterPage": {
    "submitHidden": "Pošljem podatke o atributih za to polje tudi ko je skrito?",
    "title": "Konfiguriraj izraz za pravilo ${action}",
    "filterBuilder": "Nastavi dejanje za polje, ko se zapisi ujemajo z ${any_or_all} naslednjimi izrazi",
    "noFilterTip": "Uporabite spodnja orodja, določite izjave, kdaj je dejanje aktivno."
  },
  "geocoderPage": {
    "setGeocoderURL": "Nastavi URL geokodirnika",
    "hintMsg": "Opomba: Spreminjate storitev geokodirnika, zagotovite, da boste posodobili katere koli preslikave polja geokodirnika, ki ste jih konfigurirali.",
    "invalidUrlTip": "URL ${URL} je neveljaven ali nedostopen."
  },
  "addressPage": {
    "popupTitle": "Naslov",
    "checkboxLabel": "Pridobi vrednosti iz geokodirnika",
    "selectFieldTitle": "Atribut",
    "geocoderHint": "Za spremembo geokodirnika pojdite na gumb »Nastavitve geokodirnika« v splošnih nastavitvah",
    "prevConfigruedFieldChangedMsg": "Predhodno konfiguriran atribut ni najden v trenutnih nastavitvah geokodirnika. Atribut je bil ponastavljen na privzeto."
  },
  "coordinatesPage": {
    "popupTitle": "Koordinate",
    "checkboxLabel": "Pridobi koordinate",
    "coordinatesSelectTitle": "Koordinatni sistem",
    "coordinatesAttributeTitle": "Atribut",
    "mapSpatialReference": "Določi koordinatni sistem",
    "latlong": "Geografska širina/geografska dolžina",
    "allGroupsCreatedMsg": "Vse možne skupine so že ustvarjene."
  },
  "presetPage": {
    "popupTitle": "Prednastavljeno",
    "checkboxLabel": "Polje bo prednastavljeno",
    "presetValueLabel": "Trenutna prednastavljena vrednost je:",
    "changePresetValueHint": "Če želite spremeniti to prednastavljeno vrednost, pojdite na gumb »Določi prednastavljene vrednosti« v splošnih nastavitvah"
  },
  "intersectionPage": {
    "groupNameLabel": "Ime",
    "dataTypeLabel": "Tip podatkov",
    "ignoreLayerRankingCheckboxLabel": "Prezri razvrstitev sloja in poišči najbližji geoobjekt v vseh določenih slojih",
    "intersectingLayersLabel": "Sloji za razširitev vrednosti",
    "layerAndFieldsApplyLabel": "sloji in polja za uporabo razširjene vrednosti",
    "checkboxLabel": "Pridobi vrednosti iz polja presečnega sloja",
    "layerText": "Sloji",
    "fieldText": "Polja",
    "actionsText": "Dejanja",
    "toleranceSettingText": "Nastavitve tolerance",
    "addLayerLinkText": "Dodaj sloj",
    "useDefaultToleranceText": "Uporabi privzeto toleranco",
    "toleranceValueText": "Vrednost tolerance",
    "toleranceUnitText": "Enota tolerance",
    "useLayerName": "- Uporabi ime sloja -",
    "noLayersMessage": "Nobeno polje ni najdeno na nobenem sloju karte, ki se ujema z izbranim tipom podatkov."
  },
  "presetAll": {
    "popupTitle": "Določi privzete prednastavljene vrednosti",
    "deleteTitle": "Izbriši prednastavljeno vrednost",
    "hintMsg": "Vsa enolična prednastavljena imena polj so navedena tukaj. Odstranitev prednastavljenega polja bo onemogočila zadevno polje, kot je bilo prednastavljeno iz vseh slojev/tabel."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Privzeta toleranca preseka"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "Dodaj novo",
    "definedActions": "Določena dejanja",
    "priorityPopupTitle": "Določi prioriteto pametnih dejanj",
    "priorityPopupColumnTitle": "Pametna dejanja",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Ime skupine",
    "layerForExpressionLabel": "Sloj za izraz",
    "layerForExpressionNote": "Opomba: polja izbranih slojev bodo uporabljena za določitev kriterijev.",
    "expressionText": "Izraz",
    "editExpressionLabel": "Uredi izraz",
    "layerAndFieldsApplyLabel": "Sloji in polja za uporabo",
    "submitAttributeText": "Želite poslati atributne podatke za izbrana skrita polja?",
    "priorityColumnText": "Prioritetno",
    "requiredGroupNameMsg": "Ta vrednost je obvezna.",
    "uniqueGroupNameMsg": "Vnesite enolično ime skupine. Skupina s tem imenom že obstaja.",
    "deleteGroupPopupTitle": "Izbriši skupino pametnega dejanja",
    "deleteGroupPopupMsg": "Brisanje skupine bo povzročilo odstranitev izraza iz vseh povezanih polj dejanja.",
    "invalidExpression": "Polje z izrazom ne sme biti prazno.",
    "warningMsgOnLayerChange": "Določen izraz in polja, v katerih se uporablja, bodo počiščena.",
    "smartActionsTable": {
      "name": "Ime",
      "expression": "Izraz",
      "definedFor": "Določeno za"
    }
  },
  "attributeActionsPage": {
    "name": "Ime",
    "type": "Vrsta",
    "deleteGroupPopupTitle": "Izbriši skupino dejanja atributa",
    "deleteGroupPopupMsg": "Brisanje skupine bo povzročilo odstranitev dejanja atributa iz vseh povezanih polj.",
    "alreadyAppliedActionMsg": "Dejanje ${action} je že uporabljeno v tem polju."
  },
  "chooseFromLayer": {
    "fieldLabel": "Polje",
    "valueLabel": "Vrednost",
    "selectValueLabel": "Izberi vrednost"
  },
  "presetPopup": {
    "presetValueLAbel": "Prednastavljena vrednost"
  },
  "dataType": {
    "esriFieldTypeString": "Besedilo",
    "esriFieldTypeInteger": "Število",
    "esriFieldTypeDate": "Datum",
    "esriFieldTypeGUID": "GUID"
  }
});