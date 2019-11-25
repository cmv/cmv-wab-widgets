define({
  "page1": {
    "selectToolHeader": "Trieu un mètode per seleccionar els registres per a l'actualització per lots.",
    "selectToolDesc": "El widget admet 3 mètodes per generar un conjunt seleccionat de registres per actualitzar. Només podeu triar un d'aquests mètodes. Si en necessiteu més d'un, creeu una altra instància del widget.",
    "selectByShape": "Seleccioneu per àrea",
    "shapeTypeSelector": "Feu clic a les eines que voleu permetre",
    "shapeType": {
      "point": "Punt",
      "line": "Línia",
      "polyline": "Polilínia",
      "freehandPolyline": "Polilínia a mà alçada",
      "extent": "Extensió",
      "polygon": "Polígon",
      "freehandPolygon": "Polígon a mà alçada"
    },
    "freehandPolygon": "Polígon a mà alçada",
    "selectBySpatQuery": "Seleccioneu per entitat",
    "selectByAttQuery": "Seleccioneu per entitat i per entitats relacionades",
    "selectByQuery": "Seleccioneu per consulta",
    "toolNotSelected": "Trieu un mètode de selecció",
    "noDrawToolSelected": "Trieu una eina de dibuix com a mínim"
  },
  "page2": {
    "layersToolHeader": "Seleccioneu les capes que s'han d'actualitzar i les opcions de les eines de selecció, si n'hi ha.",
    "layersToolDesc": "El mètode de selecció que heu triat a la pàgina u s'utilitzarà per seleccionar i actualitzar el conjunt de capes que es mostra a continuació. Si activeu més d'una capa, només els camps editables comuns estaran disponibles per a l'actualització. Depenent de l'eina de selecció triada, poden ser necessàries altres opcions addicionals.",
    "layerTable": {
      "colUpdate": "Actualitza",
      "colLabel": "Capa",
      "colSelectByLayer": "Seleccioneu per capa",
      "colSelectByField": "Camp de consulta",
      "colhighlightSymbol": "Ressalta el símbol"
    },
    "toggleLayers": "Alterna la visibilitat de les capes en obrir i tancar",
    "noEditableLayers": "No hi ha cap capa editable",
    "noLayersSelected": "Seleccioneu una o diverses capes abans de continuar."
  },
  "page3": {
    "commonFieldsHeader": "Seleccioneu els camps que vulgueu actualitzar per lots.",
    "commonFieldsDesc": "Només els camps editables comuns es mostraran a continuació. Seleccioneu els camps que vulgueu actualitzar. Si el mateix camp de diferents capes té un domini diferent, només es mostrarà i s'utilitzarà un domini.",
    "noCommonFields": "No hi ha cap camp comú",
    "fieldTable": {
      "colEdit": "Editable",
      "colName": "Nom",
      "colAlias": "Àlies",
      "colAction": "Accions"
    }
  },
  "tabs": {
    "selection": "Defineix el tipus de selecció",
    "layers": "Defineix les capes que s'han d'actualitzar",
    "fields": "Defineix els camps que s'han d'actualitzar"
  },
  "errorOnOk": "Empleneu tots els paràmetres abans de desar la configuració",
  "next": "Següent",
  "back": "Enrere",
  "save": "Desa el símbol",
  "cancel": "Cancel·la",
  "ok": "D'acord",
  "symbolPopup": "Selector de símbols",
  "editHeaderText": "Text que es mostrarà a la part superior del widget",
  "widgetIntroSelectByArea": "Utilitzeu una de les eines següents per crear un conjunt d'entitats seleccionat per a l'actualització.  Si la fila està <font class='maxRecordInIntro'>ressaltada</font>, s'ha superat el nombre màxim de registres.",
  "widgetIntroSelectByFeature": "Utilitzeu l'eina següent per seleccionar una entitat de la capa <font class='layerInIntro'>${0}</font>.  Aquesta entitat s'utilitzarà per seleccionar i actualitzar totes les entitats que s'intersequin.  Si la fila està <font class='maxRecordInIntro'>ressaltada</font>, s'ha superat el nombre màxim de registres.",
  "widgetIntroSelectByFeatureQuery": "Utilitzeu l'eina següent per seleccionar una entitat de <font class='layerInIntro'>${0}</font>.  L'atribut <font class='layerInIntro'>${1}</font> d'aquesta entitat s'utilitzarà per consultar les capes següents i actualitzar les entitats resultants.  Si la fila està <font class='maxRecordInIntro'>ressaltada</font>, s'ha superat el nombre màxim de registres.",
  "widgetIntroSelectByQuery": "Introduïu un valor per crear un conjunt de selecció.  Si la fila està <font class='maxRecordInIntro'>ressaltada</font>, s'ha superat el nombre màxim de registres."
});