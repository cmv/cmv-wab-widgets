define({
  "configText": "Määritä suodatinryhmäsi alla",
  "labels": {
    "groupName": "Suodatinjoukon nimi:",
    "groupNameTip": "Sen suodattimen nimi, josta käyttäjä valitsee.",
    "groupDesc": "Kuvaus:",
    "groupDescTip": "Suodatinjoukon kuvaus.",
    "groupOperator": "Esiasetettu operaattori:",
    "groupOperatorTip": "Asetus määrittää etukäteen suodattimen operaattorin. Jos esiasetettua operaattoria ei valita, suodatin käyttää Yhtä suuri kuin -operaattoria.",
    "groupDefault": "Esiasetettu arvo:",
    "groupDefaultTip": "Asetus valitsee arvon olemassa olevasta karttatasosta.",
    "sameLayerAppend": "Kun karttataso luetellaan useammin kuin kerran, käytä seuraavaa operaattoria kenttien välillä:",
    "sameLayerConjunc": "Liitä seuraavan avulla:"
  },
  "buttons": {
    "addNewGroup": "Lisää uusi ryhmä",
    "addNewGroupTip": "Lisää uusi suodatinjoukko.",
    "addLayer": "Lisää karttataso",
    "addLayerTip": "Lisää karttataso suodatinjoukkoon."
  },
  "inputs": {
    "groupName": "Anna ryhmällesi nimi",
    "groupDesc": "Ryhmäsi kuvaus",
    "groupDefault": "Anna ennalta määritetty arvo",
    "simpleMode": "Aloita yksinkertaisessa näkymässä",
    "simpleModeTip": "Asetus yksinkertaistaa määritettyä pienoisohjelman liittymää. Kun valintaruutu valitaan, liittymästä poistetaan operaattorien avattava luettelo ja ehtojen lisäyspainikkeet.",
    "webmapAppendMode": "Liitä suodatin olemassa olevaan web-kartan suodattimeen seuraavan avulla: ",
    "webmapAppendModeTip": "Asetus liittää suodatinjoukon olemassa olevaan web-kartan suodattimeen. Tuettuja operaattoreita ovat OR ja AND.",
    "persistOnClose": "Säilyy pienoisohjelman sulkemisen jälkeen",
    "optionsMode": "Piilota pienoisohjelman asetukset",
    "optionsModeTip": "Asetus tuo näkyviin pienoisohjelman lisäasetukset. Jos valintaruutu valitaan, liittymästä poistetaan määritettyjen suodattimien tallennus ja lataus sekä suodattimen säilyttäminen pienoisohjelman sulkemisen jälkeen.",
    "optionOR": "TAI",
    "optionAND": "JA",
    "optionEQUAL": "YHTÄ SUURI KUIN",
    "optionNOTEQUAL": "EI YHTÄ SUURI KUIN",
    "optionGREATERTHAN": "SUUREMPI KUIN",
    "optionGREATERTHANEQUAL": "SUUREMPI TAI YHTÄ SUURI KUIN",
    "optionLESSTHAN": "PIENEMPI KUIN",
    "optionLESSTHANEQUAL": "PIENEMPI TAI YHTÄ SUURI KUIN",
    "optionSTART": "ALKAA MERKILLÄ",
    "optionEND": "PÄÄTTYY MERKKIIN",
    "optionLIKE": "SISÄLTÄÄ",
    "optionNOTLIKE": "EI SISÄLLÄ",
    "optionONORBEFORE": "ON TIETTYNÄ PÄIVÄNÄ TAI SITÄ ENNEN",
    "optionONORAFTER": "ON TIETTYNÄ PÄIVÄNÄ TAI SEN JÄLKEEN",
    "optionNONE": "EI MITÄÄN"
  },
  "tables": {
    "layer": "Karttatasot",
    "layerTip": "Karttatason nimi karttaan määritetyssä muodossa.",
    "field": "Kentät",
    "fieldTip": "Kenttä, jonka perusteella karttataso suodatetaan.",
    "value": "Käytä arvoa",
    "valueTip": "Asetus ottaa käyttöön karttatason arvojen avattavan luettelon. Jos mikään karttataso ei käytä tätä parametria, käyttäjä näkee vain tekstiruudun.",
    "zoom": "Tarkennus",
    "zoomTip": "Asetus zoomaa kohteiden laajuuteen suodattimen käytön jälkeen. Valittavissa on vain yksi zoomattava karttataso.",
    "action": "Poista",
    "actionTip": "Poista karttataso suodatinjoukosta."
  },
  "popup": {
    "label": "Valitse arvo"
  },
  "errors": {
    "noGroups": "Tarvitset vähintään yhden ryhmän.",
    "noGroupName": "Vähintään yhden ryhmän nimi puuttuu.",
    "noDuplicates": "Vähintään yhden ryhmän nimi on kaksoiskappale.",
    "noRows": "Tarvitset taulukkoon vähintään yhden rivin.",
    "noLayers": "Kartassasi ei ole karttatasoja."
  },
  "picker": {
    "description": "Käytä tätä lomaketta esiasetetun arvon hakemiseen tälle ryhmälle.",
    "layer": "Valitse karttataso",
    "layerTip": "Karttatason nimi web-karttaan määritetyssä muodossa.",
    "field": "Valitse kenttä",
    "fieldTip": "Kenttä, josta esiasetettu arvo määritetään.",
    "value": "Valitse arvo",
    "valueTip": "Arvo, jota käytetään pienoisohjelman oletuksena."
  }
});