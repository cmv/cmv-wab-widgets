define({
  "layersPage": {
    "title": "Izvēlēties šablonu, lai veidotu elementus",
    "generalSettings": "Vispārīgie iestatījumi",
    "layerSettings": "Slāņu iestatījumi",
    "editDescription": "Nodrošiniet rediģēšanas panelim paredzēto tekstu",
    "editDescriptionTip": "Šis teksts tiek parādīts virs šablonu atlasītāja; ja teksta nav, atstājiet tukšu.",
    "promptOnSave": "Veikt  nesaglabātos labojumu saglabāšanu, ja veidlapa tiek tiek aizvērta vai notiek pārslēgšanās uz nākamo ierakstu.",
    "promptOnSaveTip": "Parādiet uznirstošo logu, ja lietotājs noklikšķina tuvumā vai pārvietojas uz nākamo labojamo ierakstu, bet pašreizējā elementā ir nesaglabāti labojumi.",
    "promptOnDelete": "Pieprasiet apstiprinājumu, ja tiek dzēsts ieraksts.",
    "promptOnDeleteTip": "Parādiet uznirstošo logu, ja lietotājs noklikšķina, lai dzēstu vai apstiprinātu darbību.",
    "removeOnSave": "Saglabāšanas laikā noņemt elementu no izvēles.",
    "removeOnSaveTip": "Opcija noņemt elementu no iestatītās izvēles, kad tiek saglabāts ieraksts. Ja tas ir vienīgais izvēlētais ieraksts, panelis tiek pārslēgts atpakaļ uz šablona lapu.",
    "useFilterEditor": "Izmantot elementu šablona filtru",
    "useFilterEditorTip": "Opcija izmantot atlasītāju Filtrēt šablonu, kas sniedz iespēju skatīt vienu slāņu šablonus vai meklēt šablonus pēc nosaukuma.",
    "listenToGroupFilter": "Lietot grupu filtra logrīka filtra vērtības iepriekšnoteiktajiem laukiem",
    "listenToGroupFilterTip": "Kad grupu filtra logrīkā tiek lietots filtrs, lietot vērtību atbilstošā iepriekšnoteikto vērtību saraksta laukā.",
    "keepTemplateActive": "Uzturēt atlasīto veidni aktīvā statusā",
    "keepTemplateActiveTip": "Kad tiek parādīts veidņu atlasītājs, atkārtoti atlasīt veidni, ja tā ir bijusi atlasīta iepriekš.",
    "layerSettingsTable": {
      "allowDelete": "Atļaut dzēšanu",
      "allowDeleteTip": "Opcija atļaut lietotājam izdzēst elementu; ja slānī dzēšana nav atbalstīta, opcija tiek atspējota",
      "edit": "Rediģējams",
      "editTip": "Opcija iekļaut slāni logrīkā",
      "label": "Slānis",
      "labelTip": "Slāņa nosaukums, kā tas ir definēts kartē",
      "update": "Atspējot ģeometrijas rediģēšanu",
      "updateTip": "Opcija atspējot iespēju pārvietot ģeometriju pēc izvietošanas vai pārvietot ģeometriju esošā elementā",
      "allowUpdateOnly": "Tikai atjaunināt",
      "allowUpdateOnlyTip": "Opcija atļaut tikai esošo elementu modificēšanu, kas atzīmēti pēc noklusējuma un atspējoti, ja slānī netiek atbalstīta jaunu elementu izveide",
      "fields": "Lauki",
      "fieldsTip": "Modificēt rediģējamos laukus un definēt viedos atribūtus",
      "description": "Apraksts",
      "descriptionTip": "Opcija ievadīt tekstu, ko parādīt atribūtu lapas augšdaļā."
    },
    "editFieldError": "Lauku modificēšanas iespējas un viedie atribūti nav pieejami tiem slāņiem, kas nav rediģējami",
    "noConfigedLayersError": "Programmai Smart Editor ir nepieciešams viens vai vairāki rediģējami slāņi"
  },
  "editDescriptionPage": {
    "title": "Definēt atribūtu pārskata tekstu slānim <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurēt slāņa <b>${layername}</b> laukus",
    "description": "Izmantojiet iepriekšējās iestatīšanas kolonnu, lai ļautu lietotājiem ievadīt vērtību pirms jauna elementa izveides. Izmantojiet darbību rediģēšanas pogu, lai slānī aktivizētu viedos atribūtus. Ar viedajiem atribūtiem var pieprasīt, paslēpt vai atspējot lauku, ņemot vērā citos laukos esošās vērtības.",
    "fieldsNotes": "Ar zvaigznīti * tiek atzīmēti obligāti aizpildāmie lauki. Ja noņemsit šī lauka izvēli Parādīt, bet rediģēšanas šablonā netiks ievadīta šī lauka vērtība, jūs nevarēsit saglabāt jaunu ierakstu.",
    "fieldsSettingsTable": {
      "display": "Parādīt",
      "displayTip": "Noteikt, vai lauks nav redzams",
      "edit": "Rediģējams",
      "editTip": "Pārbaudīt, vai lauks ir pieejams atribūtu veidlapā",
      "fieldName": "Nosaukums",
      "fieldNameTip": "Datu bāzē definētais lauka nosaukums",
      "fieldAlias": "Aizstājvārds",
      "fieldAliasTip": "Kartē definētais lauka nosaukums",
      "canPresetValue": "Iepriekš iestatīts",
      "canPresetValueTip": "Opcija rādīt lauku iepriekš iestatīto lauku sarakstā un ļaut lietotājam iestatīt vērtību pirms rediģēšanas",
      "actions": "Darbības",
      "actionsTip": "Mainīt lauku secību vai iestatīt viedos atribūtus"
    },
    "smartAttSupport": "Viedie atribūti nav iestatīti nepieciešamajos datu bāzes laukos"
  },
  "actionPage": {
    "title": "Konfigurēt viedo atribūtu darbības laukam <b>${fieldname}</b>",
    "description": "Darbības vienmēr ir izslēgtas, ja vien jūs nenorādāt kritērijus, kas šīs darbības aktivizē. Darbības tiek apstrādātas secīgi, un katrā laukā tiks aktivizēta tikai viena darbība. Lai definētu kritērijus, izmantojiet kritēriju rediģēšanas pogu.",
    "actionsSettingsTable": {
      "rule": "Darbība",
      "ruleTip": "Darbība, kas tiek veikta, ja ir nodrošināta atbilstība kritērijiem",
      "expression": "Izteiksme",
      "expressionTip": "Rezultātā iegūtā izteiksme SQL formātā no definētajiem kritērijiem",
      "actions": "Kritēriji",
      "actionsTip": "Mainiet noteikuma secību un definējiet kritērijus, kad tā tiek aktivizēta"
    },
    "actions": {
      "hide": "Paslēpt",
      "required": "Nepieciešams",
      "disabled": "Atspējots"
    }
  },
  "filterPage": {
    "submitHidden": "Vai iesniegt šī lauka atribūta datus pat tad, ja tas ir paslēpts?",
    "title": "Konfigurēt ${action} noteikuma izteiksmi",
    "filterBuilder": "Laukā iestatīt darbību, ja ieraksts atbilst ${any_or_all} no tālāk esošajām izteiksmēm",
    "noFilterTip": "Izmantojot tālāk norādītos rīkus, definējiet pieprasījumu par to, kad darbība ir aktīva."
  }
});