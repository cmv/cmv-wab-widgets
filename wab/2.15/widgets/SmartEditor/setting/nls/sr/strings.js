define({
  "layersPage": {
    "allLayers": "Svi slojevi",
    "title": "Izaberite šablon da biste kreirali geoobjekte",
    "generalSettings": "Opšte postavke",
    "layerSettings": "Postavke sloja",
    "smartActionsTabTitle": "Pametne radnje",
    "attributeActionsTabTitle": "Radnje atributa",
    "geocoderSettingsText": "Postavke geokodera",
    "editDescription": "Obezbedite tekst za prikaz za panel za uređivanje",
    "editDescriptionTip": "Ovaj tekst je prikazan iznad birača šablona, ostavite prazno ukoliko ne želite tekst.",
    "promptOnSave": "Postavi upit za čuvanje nesačuvanih izmena kada se obrazac zatvori ili prebaci na sledeći zapis.",
    "promptOnSaveTip": "Prikaži upit kada korisnik klikne na „zatvori“ ili ode na sledeći zapis koji može da se izmene, kada trenutni geoobjekat ima nesačuvane izmene.",
    "promptOnDelete": "Zahtevaj potvrdu prilikom brisanja zapisa.",
    "promptOnDeleteTip": "Prikaži upit kada korisnik klikne na brisanje da bi potvrdio radnju.",
    "removeOnSave": "Ukloni geoobjekat iz izbora prilikom čuvanja.",
    "removeOnSaveTip": "Opcija za uklanjanje geoobjekta iz skupa izbora kada je zapis sačuvan. Ako je to jedini izabran zapis, panel se prebacuje nazad na stranicu šablona.",
    "useFilterEditor": "Koristi filter šablona geoobjekta",
    "useFilterEditorTip": "Opcija za korišćenje birača za šablon filtera koji omogućava prikazivanje šablona za jedan sloj ili pretragu po nazivu.",
    "displayShapeSelector": "Prikaži opcije za crtanje",
    "createNewFeaturesFromExisting": "Omogući korisniku da kreira nove geoobjekte iz postojećih geoobjekata",
    "createNewFeaturesFromExistingTip": "Opcija za omogućavanje korisniku da kopira postojeći geoobjekat radi kreiranja novih geoobjekata",
    "copiedFeaturesOverrideDefaults": "Vrednosti kopiranih geoobjekata zamenjuju podrazumevane",
    "copiedFeaturesOverrideDefaultsTip": "Vrednosti iz kopiranih geoobjekata će zameniti vrednosti podrazumevanog šablona samo za polja koja se poklapaju",
    "displayShapeSelectorTip": "Opcija za prikaz liste važećih opcija za crtanje za izabrani šablon.",
    "displayPresetTop": "Prikaži listu unapred postavljenih vrednosti na vrhu",
    "displayPresetTopTip": "Opcija za prikaz liste unapred postavljenih vrednosti iznad birača šablona.",
    "listenToGroupFilter": "Primeni vrednosti filtera iz vidžeta Grupni filter na unapred podešena polja",
    "listenToGroupFilterTip": "Kada primenite filter u vidžetu Grupni filter, primenite vrednost na odgovarajuće polje u listi sa Unapred podešenom vrednosti.",
    "keepTemplateActive": "Održi izabrani šablon aktivnim",
    "keepTemplateActiveTip": "Kada je prikazan birač šablona, ponovo izaberite šablon ako je bio prethodno izabran.",
    "geometryEditDefault": "Podrazumevano omogući uređivanje geometrije",
    "autoSaveEdits": "Automatski čuva nove geoobjekte",
    "enableAttributeUpdates": "Prikaži dugme za ažuriranje radnji atributa kada je aktivno uređivanje geometrije",
    "enableAutomaticAttributeUpdates": "Automatski pokreni radnje atributa nakon ažuriranja geometrije",
    "enableLockingMapNavigation": "Omogući zaključavanje navigacije mape",
    "enableMovingSelectedFeatureToGPS": "Omogući pomeranje selektovanih tačkastih geoobjekata na GPS lokaciju",
    "enableMovingSelectedFeatureToXY": "Omogući pomeranje selektovanih tačkastih geoobjekata na XY lokaciju",
    "featureTemplateLegendLabel": "Postavke šablona geoobjekta i vrednosti filtera",
    "saveSettingsLegendLabel": "Sačuvaj postavke",
    "geometrySettingsLegendLabel": "Postavke geometrije",
    "buttonPositionsLabel": "Položaj dugmadi Sačuvaj, Izbriši, Nazad i Obriši",
    "belowEditLabel": "Ispod Uredi formu",
    "aboveEditLabel": "Iznad Uredi formu",
    "switchToMultilineInput": "Promenite na višelinijski unos kada se premaši dužina polja",
    "layerSettingsTable": {
      "allowDelete": "Dozvoli brisanje",
      "allowDeleteTip": "Omogući brisanje – Opcija da se korisniku dozvoli da obriše geoobjekat; onemogućena je ako sloj ne podržava brisanje",
      "edit": "Može da se izmeni",
      "editTip": "Može da se uređuje – Opcija da se sloj uključi u vidžet",
      "label": "Sloj",
      "labelTip": "Sloj – Ime sloja kako je definisano na mapi",
      "update": "Onemogući izmene geometrije",
      "updateTip": "Onemogući izmene geometrije – Opcija za onemogućavanje mogućnosti pomeranja geometrije kada je jednom postavljena ili pomeranja geometrije postojećeg geoobjekta",
      "allowUpdateOnly": "Samo ažuriraj",
      "allowUpdateOnlyTip": "Samo ažuriranje – Opcija da se dozvoli izmena postojećih geoobjekata, automatski potvrđena i onemogućena ako sloj ne podržava kreiranje novih geoobjekata",
      "fieldsTip": "Izmeni polja koja treba izmeniti i definiši pametne atribute",
      "actionsTip": "Radnje – Opcija za uređivanje polja ili pristup povezanim slojevima/tabelama",
      "description": "Opis",
      "descriptionTip": "Opis – Opcija za unos teksta koji želite da prikažete na vrhu stranice atributa.",
      "relationTip": "Prikaži povezane slojeve i tabele"
    },
    "editFieldError": "Izmene polja i pametni atributi nisu dostupni slojevima koji ne mogu da se izmene",
    "noConfigedLayersError": "Smart Editor zahteva jedan ili više izmenjivih slojeva",
    "toleranceErrorMsg": "Nevažeća podrazumevana vrednost tolerancije preseka",
    "pixelsToleranecErrorMsg": "Nevažeća podrazumevana vrednost tolerancije piksela",
    "invalidMaxCharacterErrorMsg": "Nevažeća vrednost u promeni na višelinijski unos"
  },
  "editDescriptionPage": {
    "title": "Definišite tekst za pregled atributa za <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurišite polja za <b>${layername}</b>",
    "copyActionTip": "Radnje atributa",
    "editActionTip": "Pametne radnje",
    "description": "Koristite dugme za menjanje radnje za aktiviranje pametnih atributa na sloju. Pametni atributi mogu da zahtevaju, sakriju ili onemoguće polje na osnovu vrednosti u drugim poljima. Upotrebite dugme za kopiranje radnje da aktivirate i definišete izvor vrednosti polja prema preseku, adresi, koordinatama i predefinisanom podešavanju.",
    "fieldsNotes": "* je obavezno polje. Ukoliko poništite izbor „Prikaz“ za ovo polje i šablon za menjanje ne popuni to vrednost polja, nećete moći da sačuvate novi zapis.",
    "smartAttachmentText": "Konfigurišite radnju pametnih priloga",
    "smartAttachmentPopupTitle": "Konfigurišite pametne priloge za <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Prikaz",
      "displayTip": "Prikaz – Utvrdi da li polje nije vidljivo",
      "edit": "Može da se izmeni",
      "editTip": "Može da se uređuje – Proveri da li je polje prisutno u obrascu atributa",
      "fieldName": "Naziv",
      "fieldNameTip": "Naziv – Ime polja definisano u bazi podataka",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Pseudonim – Ime polja definisano u mapi",
      "canPresetValue": "Predefinisano podešavanje",
      "canPresetValueTip": "Unapred podešeno – Opcija za prikazivanje polja u listi unapred podešenih polja i za omogućavanje korisniku da podesi vrednost pre menjanja",
      "actions": "Radnje",
      "actionsTip": "Radnje – Promeni redosled polja ili postavi pametne atribute"
    },
    "smartAttSupport": "Pametni atributi nisu podržani u obaveznim poljima baze podataka"
  },
  "actionPage": {
    "title": "Konfigurišite radnje atributa za <b>${fieldname}</b>",
    "smartActionTitle": "Konfigurišite radnje pametnih atributa za <b>${fieldname}</b>",
    "description": "Radnje su uvek isključene, osim ukoliko navedete kriterijum po kom će se aktivirati. Radnje se izvršavaju redom i samo jedna radnja će biti aktivirana po polju. Koristite dugme za izmenu kriterijuma da biste definisali kriterijum.",
    "copyAttributesNote": "Onemogućavanje bilo koje radnje koja ima naziv grupe će biti isto kao nezavisno uređivanje te radnje i to će ukloniti radnju za ovo polje iz odgovarajuće grupe.",
    "searchPlaceHolder": "Pretraži",
    "expandAllLabel": "Razvij sve slojeve",
    "domainListTitle": "Polja domena",
    "actionsSettingsTable": {
      "rule": "Radnja",
      "ruleTip": "Radnja – Radnja izvršena kada je kriterijum zadovoljen",
      "expression": "Izraz",
      "expressionTip": "Izraz – Rezultujući izraz u SQL formatu na osnovu definisanog kriterijuma",
      "groupName": "Ime grupe",
      "groupNameTip": "Ime grupe – Prikazuje ime grupe iz koje se primenjuje izraz",
      "actions": "Kriterijum",
      "actionsTip": "Kriterijum – Promeni redosled pravila i definiši kriterijum kada je aktivirano"
    },
    "copyAction": {
      "description": "Izvor vrednosti polja se obrađuje redom, ako je aktiviran, do aktiviranja važećeg kriterijuma ili završetka liste. Koristite dugme za izmenu kriterijuma da biste definisali kriterijum.",
      "intersection": "Raskrsnica",
      "coordinates": "Koordinate",
      "address": "Adresa",
      "preset": "Predefinisano podešavanje",
      "actionText": "Radnje",
      "criteriaText": "Kriterijum",
      "enableText": "Omogućeno"
    },
    "actions": {
      "hide": "Sakrij",
      "required": "Obavezno",
      "disabled": "Onemogućeno"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Upozorenje: Nezavisno uređivanje će ukloniti izabranu radnju atributa povezanu sa ovim poljem iz grupe",
      "editGroupHint": "Upozorenje: Nezavisno uređivanje će ukloniti izabranu pametnu radnju povezanu sa ovim poljem iz grupe",
      "popupTitle": "Odaberite opciju za uređivanje",
      "editAttributeGroup": "Izabrana radnja atributa se definiše iz grupe. Odaberite jednu od sledećih opcija da biste izmenili radnju atributa:",
      "expression": "Izraz izabrane pametne radnje se definiše iz grupe. Odaberite jednu od sledećih opcija da biste izmenili izraz pametne radnje:",
      "editGroupButton": "Izmeni grupu",
      "editIndependentlyButton": "Izmeni nezavisno"
    }
  },
  "filterPage": {
    "submitHidden": "Prosledite podatke o atributima za ova polja čak i kada su sakrivena",
    "title": "Konfiguriši izraz za ${action} pravilo",
    "filterBuilder": "Podesi radnju na polju kada se zapis poklapa ${any_or_all} od sledećih izraza",
    "noFilterTip": "Pomoću alata ispod, definišite izjavu za slučaj kada je radnja aktivna."
  },
  "geocoderPage": {
    "setGeocoderURL": "Postavi URL adresu geokôdera",
    "hintMsg": "Napomena: Menjate servis geokodera, proverite da li ste ažurirali sva mapiranja polja geokodera koja ste konfigurisali.",
    "invalidUrlTip": "URL adresa ${URL} nije validna ili nije dostupna."
  },
  "addressPage": {
    "popupTitle": "Adresa",
    "checkboxLabel": "Pribavi vrednost od geokodera",
    "selectFieldTitle": "Atribut",
    "geocoderHint": "Za promenu geokodera idite na dugme 'Postavke geokodera' u opštim postavkama",
    "prevConfigruedFieldChangedMsg": "Prethodno konfigurisani atribut nije pronađen u trenutnim postavkama geokodera. Atribut je resetovan na podrazumevanu vrednost."
  },
  "coordinatesPage": {
    "popupTitle": "Koordinate",
    "checkboxLabel": "Pribavi koordinate",
    "coordinatesSelectTitle": "Koordinatni sistem",
    "coordinatesAttributeTitle": "Atribut",
    "mapSpatialReference": "Prostorna referenca mape",
    "latlong": "Geografska širina/dužina",
    "allGroupsCreatedMsg": "Sve moguće grupe su već kreirane"
  },
  "presetPage": {
    "popupTitle": "Predefinisano podešavanje",
    "checkboxLabel": "Polje će biti unapred podešeno",
    "showOnlyDomainFields": "Prikaži samo polja domena",
    "hideInPresetDisplay": "Sakrij u prikazu unapred postavljenih vrednosti",
    "presetValueLabel": "Trenutna unapred podešena vrednost je:",
    "changePresetValueHint": "Da biste promenili ovu unapred podešenu vrednost idite na dugme 'Definiši unapred podešene vrednosti' u opštim postavkama"
  },
  "intersectionPage": {
    "groupNameLabel": "Ime grupe",
    "dataTypeLabel": "Tip podataka",
    "ignoreLayerRankingCheckboxLabel": "Zanemari rangiranje slojeva i pronađi najbliži geoobjekat među svim definisanim slojevima",
    "intersectingLayersLabel": "Sloj(evi) za ekstrahovanje vrednosti",
    "layerAndFieldsApplyLabel": "Sloj(evi) i polje/polja za primenu ekstrahovane vrednosti",
    "checkboxLabel": "Pribavi vrednost polja sloja preseka",
    "layerText": "Slojevi",
    "fieldText": "Polja",
    "actionsText": "Radnje",
    "toleranceSettingText": "Postavke tolerancije",
    "addLayerLinkText": "Dodaj sloj",
    "useDefaultToleranceText": "Koristi podrazumevanu toleranciju",
    "toleranceValueText": "Vrednost tolerancije",
    "toleranceUnitText": "Jedinica tolerancije",
    "pixelsUnitText": "Pikseli",
    "useLayerName": "- Koristi naziv sloja -",
    "noLayersMessage": "Nije pronađeno nijedno polje u slojevima mape koje odgovara izabranom tipu podataka."
  },
  "presetAll": {
    "popupTitle": "Definiši unapred podešene vrednosti",
    "deleteTitle": "Izbriši unapred podešenu vrednost",
    "hintMsg": "Jedinstveni ranije podešeni nazivi polja navedeni su ovde. Uklanjanje ranije podešenog polja isključiće odgovarajuće polje kao ranije podešeno iz svih slojeva/tabela."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Podrazumevana tolerancija preseka za sve funkcije.",
    "pixelsToleranceTitle": "Podrazumevana tolerancija preseka (vrednost piksela) koja će se primeniti samo za funkcije tačke."
  },
  "smartActionsPage": {
    "smartActionLabel": "Konfiguriši pametnu radnju",
    "addNewSmartActionLinkText": "Dodaj novi",
    "definedActions": "Definisane radnje",
    "priorityPopupTitle": "Podesi prioritet pametnih radnji",
    "priorityPopupColumnTitle": "Pametne radnje",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Ime grupe",
    "layerForExpressionLabel": "Sloj za izraz",
    "layerForExpressionNote": "Napomena: polja izabranog sloja će se koristiti za definisanje kriterijuma",
    "expressionText": "Izraz",
    "editExpressionLabel": "Izmeni izraz",
    "layerAndFieldsApplyLabel": "Slojevi i polja na koje treba primeniti",
    "submitAttributeText": "Prosledite podatke o atributima za ova polja čak i kada su sakrivena",
    "priorityColumnText": "Prioritet",
    "requiredGroupNameMsg": "Ova vrednost je obavezna",
    "uniqueGroupNameMsg": "Unesite jedinstveno ime grupe, grupa sa ovim imenom već postoji.",
    "deleteGroupPopupTitle": "Izbriši grupu pametne radnje",
    "deleteGroupPopupMsg": "Brisanje grupe će dovesti do uklanjanja izraza iz svih povezanih polja radnje.",
    "invalidExpression": "Izraz ne može da bude prazan",
    "warningMsgOnLayerChange": "Definisani izraz i polja na koja je primenjen će biti izbrisani.",
    "smartActionsTable": {
      "name": "Naziv",
      "expression": "Izraz",
      "definedFor": "Definisano za"
    }
  },
  "attributeActionsPage": {
    "name": "Naziv",
    "type": "Tip",
    "deleteGroupPopupTitle": "Izbriši grupu radnje atributa",
    "deleteGroupPopupMsg": "Brisanje grupe će dovesti do uklanjanja radnje atributa iz svih povezanih polja.",
    "alreadyAppliedActionMsg": "Radnja ${action} je već primenjena na ovo polje."
  },
  "chooseFromLayer": {
    "fieldLabel": "Polje",
    "valueLabel": "Vrednost",
    "selectValueLabel": "Selektovana vrednost"
  },
  "presetPopup": {
    "presetValueLAbel": "Unapred postavljena vrednost"
  },
  "dataType": {
    "esriFieldTypeString": "Niska",
    "esriFieldTypeInteger": "Broj",
    "esriFieldTypeDate": "Datum",
    "esriFieldTypeGUID": "GUID"
  },
  "relativeDates": {
    "dateTypeLabel": "Tip datuma",
    "valueLabel": "Vrednost",
    "fixed": "Nepromenljivo",
    "current": "Trenutno",
    "past": "Prošli",
    "future": "Budući",
    "popupTitle": "Selektovana vrednost",
    "hintForFixedDateType": "Savet: navedeni datum i vreme će biti korišćeni kao unapred podešena podrazumevana vrednost",
    "hintForCurrentDateType": "Savet: trenutni datum i vreme će biti korišćeni kao unapred podešena podrazumevana vrednost",
    "hintForPastDateType": "Savet: navedena vrednost će biti oduzeta od trenutnog datuma i vremena za unapred podešene podrazumevane vrednosti.",
    "hintForFutureDateType": "Savet: navedena vrednost će biti dodata trenutnom datumu i vremenu za unapred podešene podrazumevane vrednosti.",
    "noDateDefinedTooltip": "Nema definisanog datuma",
    "relativeDateWarning": "Vrednost za datum ili vreme mora da se navede da bi mogla da se sačuva podrazumevana ranije podešena vrednost."
  },
  "relativeDomains": {
    "fieldSetTitle": "Lista",
    "valueText": "Vrednost",
    "defaultText": "Podrazumevano",
    "selectedDomainFieldsHint": "Izaberite polje(a) domena: ${domainFields}",
    "selectDefaultDomainMsg": "Odaberite domen podrazumevane vrednosti ili proverite da li je potvrđen izbor u polju za potvrdu izabranog podrazumevanog domena"
  }
});