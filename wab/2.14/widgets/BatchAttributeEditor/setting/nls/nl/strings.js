define({
  "page1": {
    "selectToolHeader": "Kies een methode om records te selecteren voor batchupdate.",
    "selectToolDesc": "De widget ondersteunt 3 methodes om een geselecteerde reeks van records te maken om deze te actualiseren. U kunt slechts één methode kiezen. Als u meer dan één van deze methodes nodig hebt, maak dan een nieuwe instantie van de widget.",
    "selectByShape": "Selecteren op oppervlakte",
    "shapeTypeSelector": "Klik op de tools die u wilt toestaan",
    "shapeType": {
      "point": "Punt",
      "line": "Lijn",
      "polyline": "Polylijn",
      "freehandPolyline": "Polylijn in vrije stijl",
      "extent": "Extent",
      "polygon": "Vlak",
      "freehandPolygon": "Vlak in vrije stijl"
    },
    "freehandPolygon": "Veelhoek in vrije stijl",
    "selectBySpatQuery": "Selecteren op object",
    "selectByAttQuery": "Selecteren op object & gerelateerde objecten",
    "selectByQuery": "Selecteren op query",
    "toolNotSelected": "Selecteer een selectiemethode",
    "noDrawToolSelected": "Kies ten minste één tekentool"
  },
  "page2": {
    "layersToolHeader": "Selecteer de te actualiseren lagen en de selectiehulpmiddelenopties, indien van toepassing.",
    "layersToolDesc": "De selectiemethode die u koos op pagina één zal gebruikt worden om een reeks hieronder opgelijste lagen te selecteren en actualiseren.  Indien u meer dan één laag aanvinkt, zullen alleen de gemeenschappelijke bewerkbare velden beschikbaar zijn voor actualisering. Afhankelijk van uw keuze van het selectiehulpmiddel zullen er extra opties vereist zijn.",
    "layerTable": {
      "colUpdate": "Actualiseren",
      "colLabel": "Kaartlaag",
      "colSelectByLayer": "Selecteren volgens laag",
      "colSelectByField": "Queryveld",
      "colhighlightSymbol": "Symbool markeren"
    },
    "toggleLayers": "Zichtbaarheid lagen wisselen bij openen en sluiten",
    "noEditableLayers": "Geen bewerkbare lagen",
    "noLayersSelected": "Selecteer één of meer lagen alvorens door te gaan."
  },
  "page3": {
    "commonFieldsHeader": "Selecteer de velden voor batchupdate.",
    "commonFieldsDesc": "Alleen de gemeenschappelijke bewerkbare velden zullen hieronder getoond worden.  Selecteer de velden die u wenst te actualiseren.  Als hetzelfde veld van verschillende lagen een verschillend domein heeft, zal er slechts één domein getoond en gebruikt worden.",
    "noCommonFields": "Geen gemeenschappelijke velden",
    "fieldTable": {
      "colEdit": "Bewerkbaar",
      "colName": "Naam",
      "colAlias": "Alias",
      "colAction": "Acties"
    }
  },
  "tabs": {
    "selection": "Selectietype bepalen",
    "layers": "La(a)g(en) bepalen voor actualisering",
    "fields": "Veld(en) bepalen voor actualisering"
  },
  "errorOnOk": "Vul alle parameters in alvorens config op te slaan",
  "next": "Volgende",
  "back": "Vorige",
  "save": "Symbool opslaan",
  "cancel": "Annuleren",
  "ok": "OK",
  "symbolPopup": "Symbolenkiezer",
  "editHeaderText": "Tekst om weer te geven aan de bovenkant van de widget",
  "widgetIntroSelectByArea": "Gebruik een van de tools hieronder om een selectie van objecten te maken om bij te werken. Als de rij is <font class='maxRecordInIntro'>gemarkeerd</font>, dan is het maximum aantal gegevens overschreden.",
  "widgetIntroSelectByFeature": "Gebruik de tool hieronder om een object te kiezen uit de <font class='layerInIntro'>${0}</font>-laag. Dit object wordt gebruikt om alle overeenkomende objecten te selecteren en bij te werken. Als de rij is <font class='maxRecordInIntro'>gemarkeerd</font>, dan is het maximum aantal gegevens overschreden.",
  "widgetIntroSelectByFeatureQuery": "Gebruik de tool hieronder om een object te kiezen uit <font class='layerInIntro'>${0}</font>. Het <font class='layerInIntro'>${1}</font>-attribuut van dit object wordt gebruikt om de lagen eronder te queryen en de resulterende objecten te updaten. Als de rij is <font class='maxRecordInIntro'>gemarkeerd</font>, dan is het maximum aantal gegevens overschreden.",
  "widgetIntroSelectByQuery": "Voer een waarde in om een geselecteerde set te creëren. Als de rij is <font class='maxRecordInIntro'>gemarkeerd</font>, dan is het maximum aantal gegevens overschreden."
});