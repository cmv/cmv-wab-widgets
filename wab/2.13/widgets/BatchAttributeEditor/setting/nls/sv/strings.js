define({
  "page1": {
    "selectToolHeader": "Välj en metod för att markera poster som ska uppdateras i grupp.",
    "selectToolDesc": "Denna widget stöder tre metoder som kan användas för att generera ett urval poster som ska uppdateras. Du kan bara välja en av metoderna. Om du vill använda fler än en av metoderna, måste du skapa en ny instans av widgeten.",
    "selectByShape": "Markera efter område",
    "shapeTypeSelector": "Klicka på de verktyg du vill tillåta",
    "shapeType": {
      "point": "Punkt",
      "line": "Linje",
      "polyline": "Polylinje",
      "freehandPolyline": "Frihandspolylinje",
      "extent": "Utbredning",
      "polygon": "Polygon",
      "freehandPolygon": "Frihandspolygon"
    },
    "freehandPolygon": "Frihandspolygon",
    "selectBySpatQuery": "Markera efter geoobjekt",
    "selectByAttQuery": "Markera efter geoobjekt och relaterade geoobjekt",
    "selectByQuery": "Markera efter fråga",
    "toolNotSelected": "Markera en urvalsmetod",
    "noDrawToolSelected": "Välj minst ett ritverktyg"
  },
  "page2": {
    "layersToolHeader": "Markera de lager som ska uppdateras och välj eventuella urvalsverktyg.",
    "layersToolDesc": "Urvalsmetoden du valde på sidan ett används för att markera och uppdatera den uppsättning lager som visas nedan. Om du markerar fler än ett lager kommer bara de gemensamt redigerbara fälten att vara tillgängliga för uppdatering. Beroende på vilket urvalsverktyg du väljer kan det krävas fler alternativ.",
    "layerTable": {
      "colUpdate": "Uppdatera",
      "colLabel": "Lager",
      "colSelectByLayer": "Välj enligt lager",
      "colSelectByField": "Frågefält",
      "colhighlightSymbol": "Markeringssymbol"
    },
    "toggleLayers": "Slå på/av lagersynlighet vid öppning och stängning",
    "noEditableLayers": "Inga redigerbara lager",
    "noLayersSelected": "Markera ett eller flera lager innan du fortsätter."
  },
  "page3": {
    "commonFieldsHeader": "Markera fälten som ska uppdateras i grupp.",
    "commonFieldsDesc": "Bara de gemensamt redigerbara fälten visas nedan. Markera de fält som du vill uppdatera. Om samma fält från olika lager har olika domän, visas och används bara en domän.",
    "noCommonFields": "Inga gemensamma fält",
    "fieldTable": {
      "colEdit": "Redigerbar",
      "colName": "Namn",
      "colAlias": "Alias",
      "colAction": "Åtgärder"
    }
  },
  "tabs": {
    "selection": "Definiera markeringstyp",
    "layers": "Definiera lager som ska uppdateras",
    "fields": "Definiera fält som ska uppdateras"
  },
  "errorOnOk": "Fyll i alla parametrar innan du sparar konfigurationen",
  "next": "Nästa",
  "back": "Bakom",
  "save": "Spara symbol",
  "cancel": "Avbryt",
  "ok": "OK",
  "symbolPopup": "Symbolväljaren",
  "editHeaderText": "Text som ska visas längst upp i widgeten",
  "widgetIntroSelectByArea": "Använd något av verktygen nedan för att skapa en markerad uppsättning geoobjekt som ska uppdateras. Om raden är <font class='maxRecordInIntro'>markerad</font> har det maximala antalet poster uppnåtts.",
  "widgetIntroSelectByFeature": "Använd verktyget nedan för att välja ett geoobjekt från <font class='layerInIntro'>${0}</font> lagret. Den här funktionen används för att markera och uppdatera alla korsande geoobjekt. Om raden är <font class='maxRecordInIntro'>markerad</font> har det maximala antalet poster uppnåtts.",
  "widgetIntroSelectByFeatureQuery": "Använd verktyget nedan för att välja ett geoobjekt från <font class='layerInIntro'>${0}</font>. Det här geoobjektets <font class='layerInIntro'>${1}</font> attribut används för att söka i lagren nedan och uppdatera de resulterande geoobjekten. Om raden är <font class='maxRecordInIntro'>markerad</font> har det maximala antalet poster uppnåtts.",
  "widgetIntroSelectByQuery": "Ange ett värde för att skapa en markeringsuppsättning. Om raden är <font class='maxRecordInIntro'>markerad</font> har det maximala antalet poster uppnåtts."
});