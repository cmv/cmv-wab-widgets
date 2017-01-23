define({
  "layersPage": {
    "title": "Odaberite predložak za izradu značajki",
    "generalSettings": "Opće postavke",
    "layerSettings": "Postavke sloja",
    "editDescription": "Navedite tekst za prikaz za ploču uređivanja",
    "editDescriptionTip": "Ovaj se tekst prikazuje iznad birača predložaka, ostavite prazno ako ne želite da bude teksta.",
    "promptOnSave": "Upit za spremanje nespremljenih uređivanja kad je obrazac zatvoren ili prebačen na sljedeći zapis.",
    "promptOnSaveTip": "Prikažite upit kad korisnik klikne za zatvaranje ili navigira do sljedećeg zapisa koji se može uređivati dok trenutačni geoobjekt ima nespremljena uređivanja.",
    "promptOnDelete": "Potrebna je potvrda prilikom brisanja zapisa.",
    "promptOnDeleteTip": "Prikažite upit kad korisnik klikne za brisanje za potvrdu radnje.",
    "removeOnSave": "Uklonite geoobjekt iz odabira za spremanje.",
    "removeOnSaveTip": "Opcija za uklanjanje geoobjekta iz skupa za odabir kad se zapis spremi.  Ako je to jedini odabrani zapis, ploča se prebacuje natrag na stranicu predloška.",
    "useFilterEditor": "Upotrijebi filtar predloška geoobjekta",
    "useFilterEditorTip": "Opcija za upotrebu birača predloška filtra koja pruža mogućnost prikaza predložaka jednog sloja ili pretraživanja predložaka po nazivu.",
    "listenToGroupFilter": "Primijenite vrijednosti filtra iz widgeta grupnog filtra u predefinirana polja",
    "listenToGroupFilterTip": "Kada se primijeni filtar u widgetu grupnog filtra, primijenite vrijednost u odgovarajuće polje u popisu s predefiniranim vrijednostima.",
    "keepTemplateActive": "Ostavite aktivnim odabrani predložak",
    "keepTemplateActiveTip": "Kada se prikaže birač predloška, a prethodno je odabran predložak, ponovno ga odaberite.",
    "layerSettingsTable": {
      "allowDelete": "Omogući brisanje",
      "allowDeleteTip": "Opcija za omogućavanje korisniku brisanje geoobjekta; onemogućeno ako sloj ne podržava brisanje",
      "edit": "Može se uređivati",
      "editTip": "Opcija za uključivanje sloja u widget",
      "label": "Sloj",
      "labelTip": "Naziv sloja kako je definirano na karti",
      "update": "Onemogući uređivanje geometrije",
      "updateTip": "Opcija za onemogućivanje mogućnosti pomicanja geometrije jednom kad se postavi ili pomicanja geometrije na postojeći geoobjekt",
      "allowUpdateOnly": "Ažuriraj samo",
      "allowUpdateOnlyTip": "Opcija za omogućivanje izmjena samo postojećih geoobjekata, omogućeno po zadanim postavkama i onemogućeno ako sloj ne podržava stvaranje novih geoobjekata",
      "fields": "Polja",
      "fieldsTip": "Izmijenite polja za uređivanje i definirajte pametne atribute",
      "description": "Opis",
      "descriptionTip": "Opcija za unos teksta da se prikazuje na vrhu stranice atributa."
    },
    "editFieldError": "Izmjena polja i pametni atributi nisu dostupni za slojeve koji se ne mogu uređivati",
    "noConfigedLayersError": "Za Pametni uređivač potreban je jedan ili više slojeva koji se mogu uređivati"
  },
  "editDescriptionPage": {
    "title": "Definirajte tekst pregleda atributa za <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurirajte polja za <b>${layername}</b>",
    "description": "Upotrijebite stupac za prethodno postavljanje kako biste omogućili korisnicima unošenje vrijednosti prije stvaranja novog geoobjekta. Upotrijebite gumb za uređivanje radnji da biste aktivirali pametne atribute na sloju. Pametni atributi mogu tražiti, skrivati ili onemogućiti polje na temelju vrijednosti u drugim poljima.",
    "fieldsNotes": "* je obavezno polje. Ako odznačite prikaz za ovo polje i predložak uređivanja ne ispuni vrijednost tog polja, nećete moći spremiti novi zapis.",
    "fieldsSettingsTable": {
      "display": "Prikaži",
      "displayTip": "Utvrdite je li polje nevidljivo",
      "edit": "Može se uređivati",
      "editTip": "Provjerite postoji li polje u obliku atributa",
      "fieldName": "Naziv",
      "fieldNameTip": "Naziv polja definirano je u bazi podataka",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Naziv polja definirano na karti",
      "canPresetValue": "Zadano",
      "canPresetValueTip": "Opcija za prikazivanje polja u popisu prethodno postavljenih polja i omogućivanje korisniku postavljanje vrijednosti prije uređivanja",
      "actions": "Radnje",
      "actionsTip": "Promijenite redoslijed polja ili postavite pametne atribute"
    },
    "smartAttSupport": "Pametni atributi nisu podržani u potrebnim poljima baze podataka"
  },
  "actionPage": {
    "title": "Konfigurirajte radnje pametnog atributa za <b>${fieldname}</b>",
    "description": "Radnje su uvijek isključene osim ako ne odredite kriterije po kojima će se aktivirati.  Radnje se obrađuju po redu i samo će se jedna radnja aktivirati po polju.  Upotrijebite gumb za uređivanje kriterija kako biste definirali kriterije.",
    "actionsSettingsTable": {
      "rule": "Radnja",
      "ruleTip": "Radnja izvršena kad su zadovoljeni kriteriji",
      "expression": "Izraz",
      "expressionTip": "Dobiveni izraz u SQL formatu od definiranih kriterija",
      "actions": "Kriteriji",
      "actionsTip": "Promijenite redoslijed pravila i definirajte kriterije kad će se aktivirati"
    },
    "actions": {
      "hide": "Sakrij",
      "required": "Potrebno",
      "disabled": "Onemogućeno"
    }
  },
  "filterPage": {
    "submitHidden": "Želite predati podatke o atributu za ovo polje čak i kad je skriveno?",
    "title": "Konfiguriraj izraz za pravilo ${action}",
    "filterBuilder": "Postavite radnju za polje kad zapis odgovara ${any_or_all} sljedećim izrazima",
    "noFilterTip": "Pomoću alata u nastavku definirajte izjavu za situaciju kad je radnja aktivna."
  }
});