define({
  "page1": {
    "selectToolHeader": "Valitse menetelmä, jolla joukkopäivitettävät tietueet valitaan.",
    "selectToolDesc": "Tämä pienoisohjelma tukee kolmea eri menetelmää, joilla päivitettävien tietueiden joukko voidaan luoda. Voit valita vain yhden menetelmistä. Jos tarvitset useamman kuin yhden näistä kolmesta menetelmästä, luo pienoisohjelmasta uusi ilmentymä.",
    "selectByShape": "Valitse alueen mukaan",
    "shapeTypeSelector": "Napsauta työkaluja, jotka haluat sallia",
    "shapeType": {
      "point": "Piste",
      "line": "Viiva",
      "polyline": "Taiteviiva",
      "freehandPolyline": "Vapaakädenpiirto, viiva",
      "extent": "Laajuus",
      "polygon": "Aluekohde",
      "freehandPolygon": "Vapaankäden alue"
    },
    "freehandPolygon": "Vapaankäden alue",
    "selectBySpatQuery": "Valitse kohteen mukaan",
    "selectByAttQuery": "Valitse kohteen ja liittyvien kohteiden mukaan",
    "selectByQuery": "Valitse kyselyn mukaan",
    "toolNotSelected": "Valitse valintamenetelmä",
    "noDrawToolSelected": "Valitse vähintään yksi piirtotyökalu"
  },
  "page2": {
    "layersToolHeader": "Valitse päivitettävät karttatasot ja mahdolliset valintatyökalut.",
    "layersToolDesc": "Ensimmäisellä sivulla valitsemaasi valintamenetelmää käytetään alla lueteltujen karttatasojen valitsemiseen ja päivittämiseen. Jos valitset useita karttatasoja, vain yleiset muokattavat kentät voidaan päivittää. Valitsemasi valintatyökalun mukaan joudut ehkä valitsemaan lisäasetuksia.",
    "layerTable": {
      "colUpdate": "Päivitä",
      "colLabel": "Karttataso",
      "colSelectByLayer": "Valitse karttatason mukaan",
      "colSelectByField": "Kyselykenttä",
      "colhighlightSymbol": "Korostussymboli"
    },
    "toggleLayers": "Vaihda karttatasojen näkyvyyttä avattaessa ja suljettaessa",
    "noEditableLayers": "Ei muokattavia karttatasoja",
    "noLayersSelected": "Valitse vähintään yksi karttataso ennen jatkamista."
  },
  "page3": {
    "commonFieldsHeader": "Valitse joukkopäivitettävät kentät.",
    "commonFieldsDesc": "Alla näkyvät vain yleiset muokattavat kentät. Valitse päivitettävät kentät. Jos eri karttatasojen samalla kentällä on eri domain, näytetään ja käytetään vain yhtä domainia.",
    "noCommonFields": "Ei yleisiä kenttiä",
    "fieldTable": {
      "colEdit": "Muokattavissa",
      "colName": "Nimi",
      "colAlias": "Alias",
      "colAction": "Toimet"
    }
  },
  "tabs": {
    "selection": "Määritä valintatyyppi",
    "layers": "Määritä päivitettävät karttatasot",
    "fields": "Määritä päivitettävät kentät"
  },
  "errorOnOk": "Anna kaikki parametrit ennen kokoonpanon tallentamista",
  "next": "Seuraava",
  "back": "Takaisin",
  "save": "Tallenna symboli",
  "cancel": "Peruuta",
  "ok": "OK",
  "symbolPopup": "Symbolin valitsin",
  "editHeaderText": "Pienoisohjelman yläreunassa näytettävä teksti",
  "widgetIntroSelectByArea": "Käytä jotakin alla olevista työkaluista päivitettävän, valitun kohdejoukon luontia varten. Jos rivi on <font class='maxRecordInIntro'>korostettu</font>, tietueiden enimmäismäärä on ylittynyt.",
  "widgetIntroSelectByFeature": "Käytä alla olevaa työkalua kohteen valitsemiseen <font class='layerInIntro'>${0}</font> karttatasosta. Tätä kohdetta käytetään kaikkien leikkaavien kohteiden valitsemiseen ja päivittämiseen. Jos rivi on <font class='maxRecordInIntro'>korostettu</font>, tietueiden enimmäismäärä on ylittynyt.",
  "widgetIntroSelectByFeatureQuery": "Käytä alla olevaa työkalua kohteen valitsemiseen kohteesta <font class='layerInIntro'>${0}</font>. Tämän kohteen <font class='layerInIntro'>${1}</font> ominaisuustietoa käytetään alla olevien karttatasojen kyselyyn ja tuloksena syntyvien kohteiden päivittämiseen. Jos rivi on <font class='maxRecordInIntro'>korostettu</font>, tietueiden enimmäismäärä on ylittynyt.",
  "widgetIntroSelectByQuery": "Luo valintajoukko antamalla arvo. Jos rivi on <font class='maxRecordInIntro'>korostettu</font>, tietueiden enimmäismäärä on ylittynyt."
});