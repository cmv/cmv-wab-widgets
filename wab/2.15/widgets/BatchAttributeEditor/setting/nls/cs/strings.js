define({
  "page1": {
    "selectToolHeader": "Zvolte metodu výběru záznamů k dávkové aktualizaci.",
    "selectToolDesc": "Widget podporuje 3 metody generování vybrané sady záznamů k aktualizaci. Můžete zvolit pouze jeden z nich. Potřebujete-li více než jednu metodu, vytvořte novou instanci widgetu.",
    "selectByShape": "Výběr podle oblasti",
    "shapeTypeSelector": "Klikněte na nástroje, které chcete povolit",
    "shapeType": {
      "point": "Bod",
      "line": "Linie",
      "polyline": "Polylinie",
      "freehandPolyline": "Polylinie od ruky",
      "extent": "Rozsah",
      "polygon": "Polygon",
      "freehandPolygon": "Polygon od ruky"
    },
    "freehandPolygon": "Polygon od ruky",
    "selectBySpatQuery": "Výběr podle prvku",
    "selectByAttQuery": "Výběr podle prvku a příslušejících prvků",
    "selectByQuery": "Výběr podle dotazu",
    "toolNotSelected": "Vyberte způsob výběru.",
    "noDrawToolSelected": "Zvolte alespoň jeden nástroj kreslení"
  },
  "page2": {
    "layersToolHeader": "Vyberte vrstvy, které chcete aktualizovat a nastavte volby nástroje výběru.",
    "layersToolDesc": "Způsob výběru, který zvolíte na první straně, se použije k výběru a aktualizaci níže zobrazené sady vrstev.  Pokud označíte více než jednu vrstvu, bude možné aktualizovat pouze pole, která jsou editovatelná u všech vrstev.  V závislosti na zvoleném nástroji výběru mohou být vyžadovány další možnosti.",
    "layerTable": {
      "colUpdate": "Aktualizovat",
      "colLabel": "Vrstva",
      "colSelectByLayer": "Výběr podle vrstvy",
      "colSelectByField": "Pole dotazu",
      "colhighlightSymbol": "Symbol zvýraznění"
    },
    "toggleLayers": "Při otevření a zavření přepnout viditelnost vrstev",
    "noEditableLayers": "Žádné editovatelné vrstvy",
    "noLayersSelected": "Nejprve vyberte jednu nebo více vrstev."
  },
  "page3": {
    "commonFieldsHeader": "Vyberte pole, která chcete použít k dávkové aktualizaci.",
    "commonFieldsDesc": "Níže se zobrazí pouze pole, která jsou editovatelná u všech vrstev.  Vyberte pole, která chcete aktualizovat.  Pokud má jedno pole z různých vrstev odlišnou doménu, použije a zobrazí se pouze jedna doména.",
    "noCommonFields": "Žádná společná pole",
    "fieldTable": {
      "colEdit": "Editovatelné",
      "colName": "Název",
      "colAlias": "Alternativní jméno",
      "colAction": "Akce"
    }
  },
  "tabs": {
    "selection": "Definujte typ výběru",
    "layers": "Definujte vrstvy k aktualizaci",
    "fields": "Definujte pole k aktualizaci"
  },
  "errorOnOk": "Než konfiguraci uložíte, vyplňte všechny parametry.",
  "next": "Další",
  "back": "Zpět",
  "save": "Uložit symbol",
  "cancel": "Storno",
  "ok": "OK",
  "symbolPopup": "Výběr symbolů",
  "editHeaderText": "Text k zobrazení nahoře ve widgetu",
  "widgetIntroSelectByArea": "Pomocí jednoho z níže uvedených nástrojů vytvořte vybranou sadu prvků, které chcete aktualizovat.  Pokud je řádek <font class='maxRecordInIntro'>zvýrazněný</font>, byl překročen maximální počet záznamů.",
  "widgetIntroSelectByFeature": "Pomocí níže uvedeného nástroje vyberte prvek z vrstvy <font class='layerInIntro'>${0}</font>.  Tento prvek se použije k výběru a aktualizování všech protínajících prvků.  Pokud je řádek <font class='maxRecordInIntro'>zvýrazněný</font>, byl překročen maximální počet záznamů.",
  "widgetIntroSelectByFeatureQuery": "Pomocí níže uvedeného nástroje vyberte prvek z vrstvy <font class='layerInIntro'>${0}</font>.  Atribut <font class='layerInIntro'>${1}</font> tohoto prvku se použije k dotázání níže uvedených vrstev a aktualizaci výsledných prvků.  Pokud je řádek <font class='maxRecordInIntro'>zvýrazněný</font>, byl překročen maximální počet záznamů.",
  "widgetIntroSelectByQuery": "Zadejte hodnotu, podle které chcete vytvořit sadu výběru.  Pokud je řádek <font class='maxRecordInIntro'>zvýrazněný</font>, byl překročen maximální počet záznamů."
});