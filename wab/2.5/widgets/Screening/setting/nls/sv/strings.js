///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define({
  "units": {
    "standardUnit": "Standardenhet",
    "metricUnit": "Metrisk enhet"
  },
  "analysisTab": {
    "analysisTabLabel": "Analys",
    "selectAnalysisLayerLabel": "Välj analyslager",
    "addLayerLabel": "Lägg till lager",
    "noValidLayersForAnalysis": "Inga giltiga lager hittades i den valda webbkartan.",
    "noValidFieldsForAnalysis": "Inga giltiga fält hittades i den valda webbkartan. Ta bort det valda lagret.",
    "addLayersHintText": "Tips: Välj de lager och fält som ska analyseras och visas i rapporten",
    "addLayerNameTitle": "Lagernamn",
    "addFieldsLabel": "Lägg till fält",
    "addFieldsPopupTitle": "Välj fält",
    "addFieldsNameTitle": "Fältnamn",
    "aoiToolsLegendLabel": "AOI-verktyg",
    "aoiToolsDescriptionLabel": "Aktivera verktyg för att skapa intresseområden och ange deras etiketter",
    "placenameLabel": "Platsnamn",
    "drawToolsLabel": "Ritverktyg",
    "uploadShapeFileLabel": "Överför en shapefil",
    "coordinatesLabel": "Koordinater",
    "coordinatesDrpDwnHintText": "Tips: Välj enhet för att visa påbörjade polygontåg",
    "coordinatesBearingDrpDwnHintText": "Tips: Välj bäring för att visa påbörjade polygontåg",
    "allowShapefilesUploadLabel": "Tillåt överföring av shapefiler för analys",
    "areaUnitsLabel": "Visa områden/längder i",
    "allowShapefilesUploadLabelHintText": "Tips: Visa \"Överför shapefil i analys\" på fliken Rapport",
    "maxFeatureForAnalysisLabel": "Maximalt antal geoobjekt för analys",
    "maxFeatureForAnalysisHintText": "Tips: Ange maximalt antal geoobjekt för analys",
    "searchToleranceLabelText": "Söktolerans (fot)",
    "searchToleranceHint": "Tips: Söktoleransen används bara när du analyserar punkt- och linjeinmatningar"
  },
  "downloadTab": {
    "downloadLegend": "Hämtningsinställningar",
    "reportLegend": "Rapportinställningar",
    "downloadTabLabel": "Hämta",
    "syncEnableOptionLabel": "geoobjektslager",
    "syncEnableOptionHint": "Tips: Används för att hämta geoobjektinformation för geoobjekt som korsar det intressanta området i de angivna formaten.",
    "syncEnableOptionNote": "Obs: Synkroniseringsaktiverade geoobjekttjänster krävs för filgeodatabasalternativet.",
    "extractDataTaskOptionLabel": "Geobearbetningstjänsten Extrahera datauppgift",
    "extractDataTaskOptionHint": "Tips: Använd en publicerad geobearbetningstjänst för Extrahera datauppgift för att hämta geoobjekt som korsar det intressanta området i filgeodatabas- eller shapefilsformat.",
    "cannotDownloadOptionLabel": "Inaktivera hämtning",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Lagernamn",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "Filbaserad geodatabas",
      "allowDownloadLabel": "Tillåt hämtning"
    },
    "setButtonLabel": "Ange",
    "GPTaskLabel": "Ange webbadress till geobearbetningstjänst",
    "printGPServiceLabel": "Webbadress till utskriftstjänst",
    "setGPTaskTitle": "Ange obligatorisk webbadress till geobearbetningstjänst",
    "logoLabel": "Logotyp",
    "logoChooserHint": "Tips: Klicka på bildikonen för att byta bilden",
    "footnoteLabel": "Fotnot",
    "columnTitleColorPickerLabel": "Färg för kolumnrubriker",
    "reportTitleLabel": "Rapportnamn",
    "errorMessages": {
      "invalidGPTaskURL": "Ogiltig geobearbetningstjänst. Välj en geobearbetningstjänst som innehåller Extrahera datauppgift.",
      "noExtractDataTaskURL": "Välj valfri geobearbetningstjänst som innehåller Extrahera datauppgift."
    }
  },
  "generalTab": {
    "generalTabLabel": "Allmänt",
    "tabLabelsLegend": "Paneletiketter",
    "tabLabelsHint": "Tips: Ange etiketter",
    "AOITabLabel": "Panel för intressant område",
    "ReportTabLabel": "Rapportpanel",
    "bufferSettingsLegend": "Buffertinställningar",
    "defaultBufferDistanceLabel": "Standardbuffertavstånd",
    "defaultBufferUnitsLabel": "Buffertenheter",
    "generalBufferSymbologyHint": "Tips: Ange den symbologi som ska användas för visning av buffertar runt definierade intresseområden",
    "aoiGraphicsSymbologyLegend": "Symbologi för AOI-grafik",
    "aoiGraphicsSymbologyHint": "Tips: Ange den symbologi som ska användas vid definition av punkt-, linje- och polygonintresseområden",
    "pointSymbologyLabel": "Punkt",
    "previewLabel": "Förhandsgranska",
    "lineSymbologyLabel": "Linje",
    "polygonSymbologyLabel": "Polygon",
    "aoiBufferSymbologyLabel": "Buffertsymbologi",
    "pointSymbolChooserPopupTitle": "Adress- eller platssymbol",
    "polygonSymbolChooserPopupTitle": "Välj symbol för att markera polygon",
    "lineSymbolChooserPopupTitle": "Välj symbol för att markera linje",
    "aoiSymbolChooserPopupTitle": "Ange buffertsymbol"
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Sök källinställningar",
    "searchSourceSettingTitle": "Sök källinställningar",
    "searchSourceSettingTitleHintText": "Lägg till och konfigurera geokodningstjänster eller geoobjektslager som sökkällor. Dessa angivna källor avgör vad som går att söka i sökrutan",
    "addSearchSourceLabel": "Lägg till sökkälla",
    "featureLayerLabel": "geoobjektslager",
    "geocoderLabel": "Geokodare",
    "generalSettingLabel": "Allmän inställning",
    "allPlaceholderLabel": "Platshållartext för sökning i alla:",
    "allPlaceholderHintText": "Tips: Ange text som ska visas som platshållare när du söker i alla lager och geokodare",
    "generalSettingCheckboxLabel": "Visa popup för det hittade geoobjekt eller den hittade platsen",
    "countryCode": "Lands- eller regionkoder",
    "countryCodeEg": "till exempel ",
    "countryCodeHint": "Om du lämnar det här värdet tomt sker sökningen i alla länder och regioner",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Sök bara i den aktuella kartutbredningen",
    "zoomScale": "Zoomningsskala",
    "locatorUrl": "Geokodarens URL",
    "locatorName": "Geokodarens namn",
    "locatorExample": "Exempel",
    "locatorWarning": "Den här versionen av geokodningstjänsten stöds inte. Widgeten har stöd för geokodningstjänsten 10.0 och högre.",
    "locatorTips": "Förslag finns inte tillgängliga eftersom geokodningstjänsten inte har stöd för förslagsfunktionen.",
    "layerSource": "Lagerkälla",
    "setLayerSource": "Ange lagerkälla",
    "setGeocoderURL": "Ange URL till geokodare",
    "searchLayerTips": "Förslag finns inte tillgängliga eftersom geoobjektstjänsten inte har stöd för pagineringsfunktionen.",
    "placeholder": "Platshållartext",
    "searchFields": "Sökfält",
    "displayField": "Visa fält",
    "exactMatch": "Exakt matchning",
    "maxSuggestions": "Maximalt antal förslag",
    "maxResults": "Maximala resultat",
    "enableLocalSearch": "Aktivera lokal sökning",
    "minScale": "Minimiskala",
    "minScaleHint": "När kartans skala är större än denna skala används lokal sökning",
    "radius": "Radie",
    "radiusHint": "Anger radien för ett område kring den aktuella kartans mitt som ska användas för att höja rangordningen för geokodningskandidater så att de kandidater som är närmast platsen returneras först",
    "setSearchFields": "Ange sökfält",
    "set": "Ange",
    "invalidUrlTip": "URL:en ${URL} är ogiltig eller går inte att öppna.",
    "invalidSearchSources": "Ogiltiga sökkällinställningar"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Fyll i de obligatoriska fälten",
    "bufferDistanceFieldsErrorMsg": "Ange giltiga värden",
    "invalidSearchToleranceErrorMsg": "Ange ett giltigt värde för söktoleransen",
    "atLeastOneCheckboxCheckedErrorMsg": "Ogiltig konfiguration",
    "noLayerAvailableErrorMsg": "Det finns inga lager tillgängliga",
    "layerNotSupportedErrorMsg": "Stöds inte ",
    "noFieldSelected": "Använd redigeringsåtgärden för att välja fält för analysen.",
    "duplicateFieldsLabels": "Dubblettetiketten \"${labelText}\" tillagd för: \"${itemNames}\"",
    "noLayerSelected": "Välj minst ett lager för analys",
    "errorInSelectingLayer": "Det gick inte att slutföra valet av lager. Försök igen.",
    "errorInMaxFeatureCount": "Ange maximalt antal geoobjekt för analysen."
  }
});