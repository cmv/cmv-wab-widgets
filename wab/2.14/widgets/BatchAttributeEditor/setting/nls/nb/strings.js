define({
  "page1": {
    "selectToolHeader": "Velg en metode for å velge poster til satsvis oppdatering.",
    "selectToolDesc": "Dette miniprogrammet støtter tre ulike metoder for å generere et utvalg med poster som skal oppdateres. Du kan bare velge én av metodene. Hvis du har behov for å bruke flere av disse metodene, oppretter du en ny forekomst av miniprogrammet.",
    "selectByShape": "Velg etter område",
    "shapeTypeSelector": "Klikk på verktøyene du vil tillate",
    "shapeType": {
      "point": "Punkt",
      "line": "Linje",
      "polyline": "Polylinje",
      "freehandPolyline": "Frihåndspolylinje",
      "extent": "Utstrekning",
      "polygon": "Polygon",
      "freehandPolygon": "Frihåndspolygon"
    },
    "freehandPolygon": "Frihåndspolygon",
    "selectBySpatQuery": "Velg etter geoobjekt",
    "selectByAttQuery": "Velg etter geoobjekt og relaterte geoobjekter",
    "selectByQuery": "Velg etter spørring",
    "toolNotSelected": "Velg en utvalgsmetode",
    "noDrawToolSelected": "Velg minst ett tegneverktøy"
  },
  "page2": {
    "layersToolHeader": "Velg lagene som skal oppdateres og eventuelle alternativer for utvalgsverktøyene.",
    "layersToolDesc": "Utvalgsmetoden du velger på den første siden, brukes til å velge og oppdatere et sett med lag som er oppført nedenfor. Hvis du merker av for flere lag, er det bare de redigerbare fellesfeltene som blir oppdatert.  Det kan hende du må angi flere alternativer, avhengig av hvilket utvalgsverktøy du velger.",
    "layerTable": {
      "colUpdate": "Oppdatere",
      "colLabel": "Lag",
      "colSelectByLayer": "Velg etter lag",
      "colSelectByField": "Spørringsfelt",
      "colhighlightSymbol": "Uthevingssymbol"
    },
    "toggleLayers": "Veksle lagsynlighet ved åpning og lukking",
    "noEditableLayers": "Ingen redigerbare lag",
    "noLayersSelected": "Velg et eller flere lag før du fortsetter."
  },
  "page3": {
    "commonFieldsHeader": "Velg feltet for satsvis oppdatering.",
    "commonFieldsDesc": "Det er bare de redigerbare fellesfeltene som vises nedenfor. Velg feltene du vil oppdatere. Hvis samme felt fra ulike lag har forskjellig domene, er det kun ett domene som vises og brukes.",
    "noCommonFields": "Ingen fellesfelt",
    "fieldTable": {
      "colEdit": "Redigerbar",
      "colName": "Navn",
      "colAlias": "Alias",
      "colAction": "Handlinger"
    }
  },
  "tabs": {
    "selection": "Definer utvalgstype",
    "layers": "Definer laget/lagene som skal oppdateres",
    "fields": "Definer feltet/feltene som skal oppdateres"
  },
  "errorOnOk": "Fyll inn alle parametere før du lagrer konfigurasjonen",
  "next": "Neste",
  "back": "Tilbake",
  "save": "Lagre-symbol",
  "cancel": "Avbryt",
  "ok": "OK",
  "symbolPopup": "Symbolvelger",
  "editHeaderText": "Tekst som skal vises øverst i miniprogrammet",
  "widgetIntroSelectByArea": "Bruk et av verktøyene nedenfor til å opprette et utvalgt sett med geoobjekter som skal oppdateres. Hvis raden er <font class='maxRecordInIntro'>uthevet</font>, er maksimum antall poster overskredet.",
  "widgetIntroSelectByFeature": "Bruk verktøyet nedenfor til å velge et geoobjekt fra <font class='layerInIntro'>${0}</font>-laget.  Dette geoobjektet brukes til å velge og oppdatere alle kryssende geoobjekter. Hvis raden er <font class='maxRecordInIntro'>uthevet</font>, er maksimum antall poster overskredet.",
  "widgetIntroSelectByFeatureQuery": "Bruk verktøyet nedenfor til å velge et geoobjekt fra <font class='layerInIntro'>${0}</font>-laget.   Geoobjektets <font class='layerInIntro'>${1}</font>-attributt brukes til å spørre lagene nedenfor og oppdatere de resulterende geoobjektene. Hvis raden er <font class='maxRecordInIntro'>uthevet</font>, er maksimum antall poster overskredet.",
  "widgetIntroSelectByQuery": "Skriv inn en verdi for å opprette et utvalg. Hvis raden er <font class='maxRecordInIntro'>uthevet</font>, er maksimum antall poster overskredet."
});