define({
  "page1": {
    "selectToolHeader": "Alegeţi o metodă pentru a alege înregistrările pentru actualizarea în masă.",
    "selectToolDesc": "Widgetul acceptă 3 metode pentru generarea unui set selectat de înregistrări care vor fi actualizate. Puteţi alege doar una dintre metode. Dacă aveţi nevoie de mai multe dintre aceste metode, creaţi o nouă instanţă a widgetului.",
    "selectByShape": "Selectare după zonă",
    "shapeTypeSelector": "Faceți clic pe instrumentele permise",
    "shapeType": {
      "point": "Punct",
      "line": "Linie",
      "polyline": "Linie poligonală",
      "freehandPolyline": "Linie poligonală trasată manual",
      "extent": "Extindere",
      "polygon": "Poligon",
      "freehandPolygon": "Poligon trasat manual"
    },
    "freehandPolygon": "Poligon trasat manual",
    "selectBySpatQuery": "Selectare după obiect spaţial",
    "selectByAttQuery": "Selectare după obiect spaţial şi Obiecte spaţiale corelate",
    "selectByQuery": "Selectare după interogare",
    "toolNotSelected": "Alegeţi o metodă de selecţie",
    "noDrawToolSelected": "Adăugați cel puțin un instrument de trasare"
  },
  "page2": {
    "layersToolHeader": "Selectaţi straturile tematice care vor fi actualizate şi opţiunile instrumentelor de selecţie, dacă există.",
    "layersToolDesc": "Metoda de selecţie aleasă pe pagina unu va fi utilizată pentru a selecta şi actualiza un set de straturi tematice enumerate mai jos.  Dacă bifaţi mai multe straturi tematice, doar câmpurile editabile comune vor fi disponibile pentru actualizare.  În funcţie de alegerea instrumentului de selecţie, vor fi necesare opţiuni suplimentare.",
    "layerTable": {
      "colUpdate": "Actualizare",
      "colLabel": "Strat tematic",
      "colSelectByLayer": "Selectare după strat tematic",
      "colSelectByField": "Câmp interogare",
      "colhighlightSymbol": "Evidenţiere simbol"
    },
    "toggleLayers": "Comutare vizibilitate straturi tematice la deschidere și închidere",
    "noEditableLayers": "Niciun strat tematic editabil",
    "noLayersSelected": "Selectaţi unul sau mai multe straturi tematice înainte de a continua."
  },
  "page3": {
    "commonFieldsHeader": "Selectaţi câmpurile care vor fi actualizate în masă.",
    "commonFieldsDesc": "Doar câmpurile comune editabile vor fi afişate mai jos.  Selectaţi câmpurile pe care doriţi să le actualizaţi.  Dacă acelaşi câmp din straturi tematice diferite are un domeniu diferit, doar un domeniu va fi afişat şi utilizat.",
    "noCommonFields": "Niciun câmp comun",
    "fieldTable": {
      "colEdit": "Editabil",
      "colName": "Nume",
      "colAlias": "Pseudonim",
      "colAction": "Acţiuni"
    }
  },
  "tabs": {
    "selection": "Definire tip selecţie",
    "layers": "Definire straturi tematice care vor fi actualizate",
    "fields": "Definire câmpuri care vor fi actualizate"
  },
  "errorOnOk": "Completaţi toţi parametrii înainte de a salva configuraţia",
  "next": "Înainte",
  "back": "Înapoi",
  "save": "Salvare simbol",
  "cancel": "Anulare",
  "ok": "OK",
  "symbolPopup": "Selector simbol",
  "editHeaderText": "Text care va fi afișat în partea de sus a widgetului",
  "widgetIntroSelectByArea": "Utilizați unul dintre instrumentele de mai jos pentru a crea un set selectat de obiecte spațiale de actualizat. Dacă rândul este <font class='maxRecordInIntro'>evidențiat</font>, a fost depășit numărul maxim de înregistrări.",
  "widgetIntroSelectByFeature": "Utilizați instrumentul de mai jos pentru a selecta un obiect spațial din stratul tematic <font class='layerInIntro'>${0}</font>. Acest obiect spațial va fi utilizat pentru a selecta și actualiza toate obiectele spațiale cu care se intersectează. Dacă rândul este <font class='maxRecordInIntro'>evidențiat</font>, a fost depășit numărul maxim de înregistrări.",
  "widgetIntroSelectByFeatureQuery": "Utilizați instrumentul de mai jos pentru a selecta un obiect spațial din <font class='layerInIntro'>${0}</font>. Atributul <font class='layerInIntro'>${1}</font> al acestui obiect spațial va fi utilizat pentru a interoga straturile tematice de mai jos și pentru a actualiza obiectele spațiale care rezultă. Dacă rândul este <font class='maxRecordInIntro'>evidențiat</font>, a fost depășit numărul maxim de înregistrări.",
  "widgetIntroSelectByQuery": "Introduceți o valoare pentru a crea un set de selecție. Dacă rândul este <font class='maxRecordInIntro'>evidențiat</font>, a fost depășit numărul maxim de înregistrări."
});