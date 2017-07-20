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
    "standardUnit": "Standardeinheit",
    "metricUnit": "Metrische Einheit"
  },
  "analysisTab": {
    "analysisTabLabel": "Analyse",
    "selectAnalysisLayerLabel": "Analyse-Layer auswählen",
    "addLayerLabel": "Layer hinzufügen",
    "noValidLayersForAnalysis": "Keine gültigen Layer in der ausgewählten Webkarte gefunden.",
    "noValidFieldsForAnalysis": "Keine gültigen Felder in der ausgewählten Webkarte gefunden. Entfernen Sie den ausgewählten Layer.",
    "addLayersHintText": "Hinweis: Wählen Sie Layer und Felder zur Analyse und Anzeige in Berichten aus.",
    "addLayerNameTitle": "Layer-Name",
    "addFieldsLabel": "Feld hinzufügen",
    "addFieldsPopupTitle": "Felder auswählen",
    "addFieldsNameTitle": "Feldnamen",
    "aoiToolsLegendLabel": "Werkzeuge für Interessenbereich",
    "aoiToolsDescriptionLabel": "Aktivieren Sie Werkzeuge, um Interessenbereiche zu erstellen und deren Beschriftung festzulegen.",
    "placenameLabel": "Ortsname",
    "drawToolsLabel": "Zeichenwerkzeuge",
    "uploadShapeFileLabel": "Ein Shapefile hochladen",
    "coordinatesLabel": "Koordinaten",
    "coordinatesDrpDwnHintText": "Hinweis: Wählen Sie die Einheit aus, um die eingegebenen Polygonzüge anzuzeigen.",
    "coordinatesBearingDrpDwnHintText": "Hinweis: Wählen Sie die Peilung aus, um die eingegebenen Polygonzüge anzuzeigen.",
    "allowShapefilesUploadLabel": "Hochladen von Shapefile in die Analyse zulassen",
    "areaUnitsLabel": "Flächen/Längen anzeigen",
    "allowShapefilesUploadLabelHintText": "Hinweis: Zeigen Sie in der Registerkarte \"Bericht\" die Option \"Shapefile in Analyse hochladen\" an.",
    "maxFeatureForAnalysisLabel": "Höchstanzahl für Analyse",
    "maxFeatureForAnalysisHintText": "Hinweis: Legen Sie die Höchstanzahl der Features für die Analyse fest.",
    "searchToleranceLabelText": "Suchtoleranz (Fuß)",
    "searchToleranceHint": "Hinweis: Die Suchtoleranz wird nur beim Analysieren von Punkt- und Linieneingaben verwendet."
  },
  "downloadTab": {
    "downloadLegend": "Downloadeinstellungen",
    "reportLegend": "Berichtseinstellungen",
    "downloadTabLabel": "Herunterladen",
    "syncEnableOptionLabel": "Feature-Layer",
    "syncEnableOptionHint": "Hinweis: Wird verwendet, um Feature-Informationen für Features herunterzuladen, die sich im Interessenbereich in den angegebenen Formaten schneiden.",
    "syncEnableOptionNote": "Hinweis: Für die Option \"File-Geodatabase\" sind Feature-Services erforderlich, bei denen die Synchronsierung aktiviert ist.",
    "extractDataTaskOptionLabel": "Task \"Daten extrahieren\" des Geoverarbeitungsservice",
    "extractDataTaskOptionHint": "Hinweis: Verwenden Sie einen veröffentlichten Geoverarbeitungsservice mit dem Task \"Daten extrahieren\", um Features in File-Geodatabase- oder Shapefile-Formaten herunterzuladen, die sich im Interessenbereich schneiden.",
    "cannotDownloadOptionLabel": "Download deaktivieren",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Layer-Name",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "File-Geodatabase",
      "allowDownloadLabel": "Download zulassen"
    },
    "setButtonLabel": "Festlegen",
    "GPTaskLabel": "URL für Geoverarbeitungsservice angeben",
    "printGPServiceLabel": "URL des Druckservice",
    "setGPTaskTitle": "Erforderliche URL des Geoverarbeitungsservice angeben",
    "logoLabel": "Logo",
    "logoChooserHint": "Hinweis: Klicken Sie auf das Symbol des Bilds, um das Bild zu ändern.",
    "footnoteLabel": "Fußnote",
    "columnTitleColorPickerLabel": "Farbe für Spaltentitel",
    "reportTitleLabel": "Berichtstitel",
    "errorMessages": {
      "invalidGPTaskURL": "Ungültiger Geoverarbeitungsservice. Wählen Sie einen Geoverarbeitungsservice aus, der den Task \"Daten extrahieren\" beinhaltet.",
      "noExtractDataTaskURL": "Wählen Sie einen Geoverarbeitungsservice aus, der den Task \"Daten extrahieren\" beinhaltet."
    }
  },
  "generalTab": {
    "generalTabLabel": "Allgemein",
    "tabLabelsLegend": "Bereichsbeschriftungen",
    "tabLabelsHint": "Hinweis: Geben Sie Beschriftungen an.",
    "AOITabLabel": "Fenster \"Interessenbereich\"",
    "ReportTabLabel": "Bereich \"Bericht\"",
    "bufferSettingsLegend": "Puffereinstellungen",
    "defaultBufferDistanceLabel": "Standardpufferabstand",
    "defaultBufferUnitsLabel": "Puffereinheiten",
    "generalBufferSymbologyHint": "Hinweis: Legen Sie die Symbolisierung fest, die zur Anzeige von Puffern um Interessenbereiche herum verwendet werden soll.",
    "aoiGraphicsSymbologyLegend": "Symbolisierung für Grafiken von Interessenbereichen",
    "aoiGraphicsSymbologyHint": "Hinweis: Legen Sie die Symbolisierung fest, die beim Definieren von Interessenbereichen mit Punkten, Linien und Polygonen verwendet werden soll.",
    "pointSymbologyLabel": "Punkt",
    "previewLabel": "Vorschau",
    "lineSymbologyLabel": "Linie",
    "polygonSymbologyLabel": "Polygon",
    "aoiBufferSymbologyLabel": "Puffer-Symbolisierung",
    "pointSymbolChooserPopupTitle": "Symbol für Adresse oder Position",
    "polygonSymbolChooserPopupTitle": "Symbol zum Hervorheben des Polygons auswählen",
    "lineSymbolChooserPopupTitle": "Symbol zum Hervorheben der Linie auswählen",
    "aoiSymbolChooserPopupTitle": "Puffersymbol festlegen"
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Einstellungen der Suchquellen",
    "searchSourceSettingTitle": "Einstellungen der Suchquellen",
    "searchSourceSettingTitleHintText": "Fügen Sie Geokodierungsservices oder Feature-Layer als Suchquellen hinzu, und konfigurieren Sie diese. Anhand dieser angegebenen Quellen wird bestimmt, welche Elemente im Suchfeld durchsucht werden können.",
    "addSearchSourceLabel": "Suchquelle hinzufügen",
    "featureLayerLabel": "Feature-Layer",
    "geocoderLabel": "Geocoder",
    "generalSettingLabel": "Allgemeine Einstellung",
    "allPlaceholderLabel": "Platzhaltertext, um alle zu durchsuchen:",
    "allPlaceholderHintText": "Hinweis: Geben Sie den Platzhaltertext zum Durchsuchen aller Layer und Geocoder ein.",
    "generalSettingCheckboxLabel": "Pop-up für das gefundene Feature oder die gefundene Position anzeigen",
    "countryCode": "Länder- oder Regionscode(s)",
    "countryCodeEg": "z. B. ",
    "countryCodeHint": "Wenn dieser Wert leer gelassen wird, werden alle Länder und Regionen durchsucht.",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Nur in der aktuellen Kartenausdehnung suchen",
    "zoomScale": "Zoom-Maßstab",
    "locatorUrl": "Geocoder-URL",
    "locatorName": "Geocoder-Name",
    "locatorExample": "Beispiel",
    "locatorWarning": "Diese Version des Geokodierungsservice wird nicht unterstützt. Das Widget unterstützt Geokodierungsservices der Version 10.0 und höher.",
    "locatorTips": "Es sind keine Vorschläge verfügbar, da der Geokodierungsservice die Vorschlagsfunktion nicht unterstützt.",
    "layerSource": "Layer-Quelle",
    "setLayerSource": "Layer-Quelle festlegen",
    "setGeocoderURL": "Geocoder-URL festlegen",
    "searchLayerTips": "Es sind keine Vorschläge verfügbar, da der Feature-Service die Paginierungsfunktion nicht unterstützt.",
    "placeholder": "Platzhaltertext",
    "searchFields": "Suchfelder",
    "displayField": "Anzeigefeld",
    "exactMatch": "Exakte Übereinstimmung",
    "maxSuggestions": "Maximale Anzahl von Vorschlägen",
    "maxResults": "Maximale Anzahl von Ergebnissen",
    "enableLocalSearch": "Lokale Suche aktivieren",
    "minScale": "Min. Maßstab",
    "minScaleHint": "Wenn der Kartenmaßstab größer ist als dieser Maßstab, wird die lokale Suche angewendet.",
    "radius": "Radius",
    "radiusHint": "Ermöglicht die Festlegung des Radius einer Fläche um den aktuellen Kartenmittelpunkt, der dazu dient, die Rangfolge von Geokodierungskandidaten zu optimieren. Die Kandidaten, die der Position am nächsten liegen, werden auf diese Weise zuerst ausgegeben.",
    "setSearchFields": "Suchfelder festlegen",
    "set": "Festlegen",
    "invalidUrlTip": "Die URL ${URL} ist ungültig oder es kann nicht darauf zugegriffen werden.",
    "invalidSearchSources": "Ungültige Einstellungen der Suchquelle"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Füllen Sie die erforderlichen Felder aus.",
    "bufferDistanceFieldsErrorMsg": "Geben Sie gültige Wert ein.",
    "invalidSearchToleranceErrorMsg": "Geben Sie einen gültigen Wert für die Suchtoleranz ein.",
    "atLeastOneCheckboxCheckedErrorMsg": "Ungültige Konfiguration",
    "noLayerAvailableErrorMsg": "Keine Layer verfügbar",
    "layerNotSupportedErrorMsg": "Wird nicht unterstützt ",
    "noFieldSelected": "Verwenden Sie die Aktion \"Bearbeiten\", um Felder für die Analyse auszuwählen.",
    "duplicateFieldsLabels": "Doppelte Bezeichnung \"${labelText}\" für: \"${itemNames}\" hinzugefügt",
    "noLayerSelected": "Wählen Sie mindestens einen Layer für die Analyse aus.",
    "errorInSelectingLayer": "Der Operation zur Auswahl des Layers kann nicht abgeschlossen werden. Versuchen Sie es erneut.",
    "errorInMaxFeatureCount": "Geben Sie einen gültigen Wert für die Höchstzahl der Features zur Analyse ein."
  }
});