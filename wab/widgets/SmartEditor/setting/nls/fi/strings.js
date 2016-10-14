define({
  "layersPage": {
    "title": "Luo kohteita valitsemalla malli",
    "generalSettings": "Yleiset asetukset",
    "layerSettings": "Karttatason asetukset",
    "editDescription": "Järjestä näyttöteksti muokkauspaneelia varten",
    "editDescriptionTip": "Tämä teksti näytetään mallin valitsimen yläpuolella. Jätä tyhjäksi, jos et halua siihen tulevan tekstiä.",
    "promptOnSave": "Kehote tallentamattomien muokkausten tallentamiseksi, kun lomake on suljettu tai vaihdettu seuraavaksi tietueeksi.",
    "promptOnSaveTip": "Näytä kehote, kun käyttäjä napsauttaa sulkemistoimintoa tai siirtyy seuraavaan muokattavissa olevaan tietueeseen, kun nykyisessä kohteessa on tallentamattomia muokkauksia.",
    "promptOnDelete": "Vaadi vahvistus tietuetta poistettaessa.",
    "promptOnDeleteTip": "Näytä kehote, kun käyttäjä vahvistaa toiminnon napsauttamalla poistotoimintoa.",
    "removeOnSave": "Poista kohde valinnasta tallennettaessa.",
    "removeOnSaveTip": "Toiminto, joka poistaa kohteen valintajoukosta, kun tietue tallennetaan. Jos se on ainoa valittu tietue, paneeli vaihdetaan takaisin mallisivulle.",
    "useFilterEditor": "Käytä kohdemallien suodatinta",
    "useFilterEditorTip": "Toiminto, joka käyttää suodatinmallin valitsinta, joka antaa mahdollisuuden katsella yhtä karttatasomallia tai hakea malleja nimen mukaan.",
    "listenToGroupFilter": "Käytä ryhmäsuodattimen pienoisohjelman suodatinarvoja esiasetetuissa kentissä",
    "listenToGroupFilterTip": "Kun suodatinta käytetään ryhmäsuodattimen pienoisohjelmassa, käytä arvoa vastaavassa kentässä esiasetettujen arvojen luettelossa.",
    "keepTemplateActive": "Pidä valittu mallipohja aktiivisena",
    "keepTemplateActiveTip": "Kun mallipohjan valitsin on näkyvissä, poista aiemmin valitun mallinpohjan valinta.",
    "layerSettingsTable": {
      "allowDelete": "Salli poisto",
      "allowDeleteTip": "Toiminto, joka sallii käyttäjän poistaa kohteen. Se on pois käytöstä, jos karttataso ei mahdollista poistamista",
      "edit": "Muokattavissa",
      "editTip": "Toiminto, joka sisällyttä karttatason pienoisohjelmaan",
      "label": "Karttataso",
      "labelTip": "Karttatason nimi karttaan määritetyssä muodossa",
      "update": "Poista geometrian muokkaus käytöstä",
      "updateTip": "Toiminto, joka estää geometrian siirtämisen sen asettamisen jälkeen tai geometrian siirtämisen olemassa olevaan kohteeseen",
      "allowUpdateOnly": "Vain päivitys",
      "allowUpdateOnlyTip": "Toiminto, joka sallii vain olemassa olevien kohteiden muokkauksen. Se on valittuna oletusarvoisesti ja poistetaan käytöstä, jos karttataso ei mahdollista uusien kohteiden luomista",
      "fields": "Kentät",
      "fieldsTip": "Muokkaa muokattavia kenttiä ja määritä älykkäät ominaisuudet",
      "description": "Kuvaus",
      "descriptionTip": "Asetus näyttää kirjoitetun tekstin ominaisuussivun yläosassa."
    },
    "editFieldError": "Kentän muokkaukset ja älykkäät ominaisuudet eivät ole käytettävissä karttatasoissa, joita ei voi muokata",
    "noConfigedLayersError": "Älykäs muokkausohjelma edellyttää vähintään yhtä muokattavaa karttatasoa"
  },
  "editDescriptionPage": {
    "title": "Määritä ominaisuuden yleiskatsausteksti karttatasolle <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Määritä kentät karttatasolle <b>${layername}</b>",
    "description": "Käytä Esiasetus-saraketta, kun haluat sallia käyttäjän syöttävän arvon ennen uuden kohteen luomista. Käytä Toiminnot-muokkauspainiketta, kun haluat aktivoida älykkäät ominaisuudet karttatasossa. Älykkäät ominaisuudet voivat edellyttää, piilottaa tai poistaa käytöstä kentän muiden kenttien arvojen perusteella.",
    "fieldsNotes": "* on pakollinen kenttä. Jos poistat Näytä-valinnan tämän kentän kohdalta ja muokkausmalli ei luo tätä kentän arvoa, et pysty tallentamaan uutta tietuetta.",
    "fieldsSettingsTable": {
      "display": "Näytä",
      "displayTip": "Määritä, näkyykö kenttä",
      "edit": "Muokattavissa",
      "editTip": "Valitse tämä, jos kenttä on ominaisuustietomuodossa",
      "fieldName": "Nimi",
      "fieldNameTip": "Tietokantaan määritetty kentän nimi",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Karttaan määritetty kentän nimi",
      "canPresetValue": "Esiasetus",
      "canPresetValueTip": "Toiminto, joka näyttää kentän esiasetuskenttien luettelossa ja sallii käyttäjän määrittää arvo ennen muokkausta",
      "actions": "Toiminnot",
      "actionsTip": "Muuta kenttien järjestystä tai aseta älykkäät ominaisuudet käyttöön"
    },
    "smartAttSupport": "Älykkäät ominaisuudet -toimintoa ei tueta pakollisissa tietokannan kentissä"
  },
  "actionPage": {
    "title": "Määritä Älykkäät ominaisuudet -toiminnot kentälle <b>${fieldname}</b>",
    "description": "Toiminnot ovat aina pois käytöstä, ellet määritä ehtoja, joiden perusteella ne käynnistetään. Toiminnot käsitellään järjestyksessä, ja kenttää kohti käynnistetään vain yksi toiminto. Voit määrittää ehdot ehtojen muokkauspainikkeella.",
    "actionsSettingsTable": {
      "rule": "Toiminto",
      "ruleTip": "Toiminto suoritetaan, kun ehdot täyttyvät",
      "expression": "Lauseke",
      "expressionTip": "SQL-muodossa oleva määritettyjen ehtojen perusteella syntyvä lauseke",
      "actions": "Hakuperusteet",
      "actionsTip": "Muuta säännön järjestystä ja määritä ehdot, kun se käynnistetään."
    },
    "actions": {
      "hide": "Piilota",
      "required": "Pakollinen",
      "disabled": "Poissa käytöstä"
    }
  },
  "filterPage": {
    "submitHidden": "Lähetetäänkö tälle kentälle ominaisuustiedot myös, kun se on piilotettu?",
    "title": "Määritä lauseke säännölle ${action}",
    "filterBuilder": "Aseta kentälle tehtävä toiminto, kun tietue vastaa ${any_or_all} seuraavaa lauseketta",
    "noFilterTip": "Määritä alla olevien työkalujen avulla lauseke sitä tilannetta varten, kun toiminto on aktiivinen."
  }
});