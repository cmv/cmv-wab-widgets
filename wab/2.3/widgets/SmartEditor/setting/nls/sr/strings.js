define({
  "layersPage": {
    "title": "Izaberite šablon da biste kreirali geoobjekte",
    "generalSettings": "Opšte postavke",
    "layerSettings": "Postavke sloja",
    "editDescription": "Obezbedi tekst prikaza za panel za uređivanje",
    "editDescriptionTip": "Ovaj tekst je prikazan iznad birača šablona, ostavite prazno ukoliko ne želite tekst.",
    "promptOnSave": "Postavi upit za čuvanje nesačuvanih izmena kada se obrazac zatvori ili prebaci na sledeći zapis.",
    "promptOnSaveTip": "Prikaži upit kada korisnik klikne na „zatvori“ ili ode na sledeći zapis koji može da se izmene, kada trenutni geoobjekat ima nesačuvane izmene.",
    "promptOnDelete": "Zahtevaj potvrdu prilikom brisanja zapisa.",
    "promptOnDeleteTip": "Prikaži upit kada korisnik klikne na brisanje da bi potvrdio radnju.",
    "removeOnSave": "Ukloni geoobjekat iz izbora prilikom čuvanja.",
    "removeOnSaveTip": "Opcija za uklanjanje geoobjekta iz skupa izbora kada je zapis sačuvan. Ako je to jedini izabran zapis, panel se prebacuje nazad na stranicu šablona.",
    "useFilterEditor": "Koristi filter šablona geoobjekta",
    "useFilterEditorTip": "Opcija za korišćenje birača šablona filtera koji obezbeđuje mogućnost da se pregledaju šabloni jednog sloja ili traže šabloni po imenu.",
    "listenToGroupFilter": "Primeni vrednosti filtera iz vidžeta Grupni filter na unapred podešena polja",
    "listenToGroupFilterTip": "Kada primenite filter u vidžetu Grupni filter, primenite vrednost na odgovarajuće polje u listi sa Unapred podešenom vrednosti.",
    "keepTemplateActive": "Održi izabrani šablon aktivnim",
    "keepTemplateActiveTip": "Kada je prikazan birač šablona, ponovo izaberite šablon ako je bio prethodno izabran.",
    "layerSettingsTable": {
      "allowDelete": "Dozvoli brisanje",
      "allowDeleteTip": "Opcija da se korisniku dozvoli da obriše geoobjekat; onemogućena je ako sloj ne podržava brisanje",
      "edit": "Može da se izmeni",
      "editTip": "Opcija da se sloj uključi u vidžet",
      "label": "Sloj",
      "labelTip": "Ime sloja kako je definisano na mapi",
      "update": "Onemogući izmene geometrije",
      "updateTip": "Opcija za onemogućavanje mogućnosti pomeranja geometrije kada je jednom postavljena ili pomeranja geometrije na postojećem geoobjektu",
      "allowUpdateOnly": "Samo ažuriraj",
      "allowUpdateOnlyTip": "Opcija da se dozvoli izmena postojećih geoobjekata, automatski potvrđena i onemogućena ako sloj ne podržava kreiranje novih geoobjekata",
      "fields": "Polja",
      "fieldsTip": "Izmeni polja koja treba izmeniti i definiši pametne atribute",
      "description": "Opis",
      "descriptionTip": "Opcija za unos teksta koji želite da prikažete na vrhu stranice atributa."
    },
    "editFieldError": "Izmene polja i pametni atributi nisu dostupni slojevima koji ne mogu da se izmene",
    "noConfigedLayersError": "Smart Editor zahteva jedan ili više izmenjivih slojeva"
  },
  "editDescriptionPage": {
    "title": "Definišite tekst za pregled atributa za <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurišite polja za <b>${layername}</b>",
    "description": "Koristite kolonu za Početnu vrednost da dozvolite korisniku da unese vrednost pre kreiranja novog geoobjekta. Koristite dugme za menjanje radnje za aktiviranje pametnih atributa na sloju. Pametni atributi mogu da zahtevaju, sakriju ili onemoguće polje na osnovu vrednosti u drugim poljima.",
    "fieldsNotes": "* je obavezno polje. Ukoliko poništite izbor „Prikaz“ za ovo polje i šablon za menjanje ne popuni to vrednost polja, nećete moći da sačuvate novi zapis.",
    "fieldsSettingsTable": {
      "display": "Prikaz",
      "displayTip": "Utvrdi da li polje nije vidljivo",
      "edit": "Može da se izmeni",
      "editTip": "Proveri da li je polje prisutno u obrascu atributa",
      "fieldName": "Naziv",
      "fieldNameTip": "Ime polja definisano u bazi podataka",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Ime polja definisano u mapi",
      "canPresetValue": "Predefinisano podešavanje",
      "canPresetValueTip": "Opcija za prikazivanje polja u listi unapred podešenih polja i za omogućavanje korisniku da podesi vrednost pre menjanja",
      "actions": "Radnje",
      "actionsTip": "Promeni redosled polja ili postavi pametne atribute"
    },
    "smartAttSupport": "Pametni atributi nisu podržani u obaveznim poljima baze podataka"
  },
  "actionPage": {
    "title": "Konfigurišite radnje pametnih atributa za <b>${fieldname}</b>",
    "description": "Radnje su uvek isključene, osim ukoliko navedete kriterijum po kom će se aktivirati. Radnje se izvršavaju redom i samo jedna radnja će biti aktivirana po polju. Koristite dugme za izmenu kriterijuma da biste definisali kriterijum.",
    "actionsSettingsTable": {
      "rule": "Radnja",
      "ruleTip": "Radnja izvršena kada je kriterijum zadovoljen",
      "expression": "Izraz",
      "expressionTip": "Rezultujući izraz u SQL formatu od definisanog kriterijuma",
      "actions": "Kriterijum",
      "actionsTip": "Promeni redosled pravila i definiši kriterijum kada je aktivirano"
    },
    "actions": {
      "hide": "Sakrij",
      "required": "Obavezno",
      "disabled": "Onemogućeno"
    }
  },
  "filterPage": {
    "submitHidden": "Želite li da prosledite podatke o atributima za ovo polje čak i kada je sakriveno?",
    "title": "Konfiguriši izraz za ${action} pravilo",
    "filterBuilder": "Podesi radnju na polju kada se zapis poklapa ${any_or_all} od sledećih izraza",
    "noFilterTip": "Pomoću alata ispod, definišite izjavu za slučaj kada je radnja aktivna."
  }
});