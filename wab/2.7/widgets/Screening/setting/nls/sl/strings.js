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
    "feetUnit": "Čevlji/Kvadratni čevlji",
    "milesUnit": "Milje/Akri",
    "metersUnit": "Metri/Kvadratni metri",
    "kilometersUnit": "Kilometri/Kvadratni kilometri",
    "hectaresUnit": "Kilometri/Hektarji"
  },
  "analysisTab": {
    "analysisTabLabel": "Analiza",
    "selectAnalysisLayerLabel": "Izberite sloje analize",
    "addLayerLabel": "Dodaj sloje",
    "noValidLayersForAnalysis": "V izbrani spletni karti ni najdenih veljavnih slojev.",
    "noValidFieldsForAnalysis": "V izbrani spletni karti ni najdenih veljavnih slojev. Odstranite izbrani sloj.",
    "addLayersHintText": "Namig: Izberite sloje in polja za analizo in prikaz v poročilu",
    "addLayerNameTitle": "Ime sloja",
    "addFieldsLabel": "Dodaj polje",
    "addFieldsPopupTitle": "Izberi polja",
    "addFieldsNameTitle": "Imena polj",
    "aoiToolsLegendLabel": "Orodja interesnih območij (AOI)",
    "aoiToolsDescriptionLabel": "Omogočite orodja za ustvarjanje interesnega območja in določite njihove napise",
    "placenameLabel": "Ime mesta",
    "drawToolsLabel": "Orodja za risanje",
    "uploadShapeFileLabel": "Naloži shapefile",
    "coordinatesLabel": "Koordinate",
    "coordinatesDrpDwnHintText": "Namig: Izberite enoto za prikaz vnesenih traverz",
    "coordinatesBearingDrpDwnHintText": "Namig: Izberite smerni kot za prikaz vnesenih traverz",
    "allowShapefilesUploadLabel": "Naloži shapefile za analizo",
    "allowShapefilesUploadLabelHintText": "Namig: Prikaži »Naloži shapefile za analizo« v zavihku Poročilo",
    "allowVisibleLayerAnalysisLabel": "Ne analiziraj ali poročaj o rezultatih za sloje, ki niso vidni",
    "allowVisibleLayerAnalysisHintText": "Namig: Sloji, ki so bili izklopljeni ali niso vidni zaradi nastavitev vidljivosti merila, ne bodo analizirani ali vključeni v natisnjenih ali prenesenih rezultatih.",
    "areaUnitsLabel": "Pokaži rezultate analize v",
    "maxFeatureForAnalysisLabel": "Največ geoobjektov za analizo",
    "maxFeatureForAnalysisHintText": "Namig: Nastavite največje število geoobjektov za analizo",
    "searchToleranceLabelText": "Toleranca iskanja",
    "searchToleranceHint": "Namig: Odstopanje v iskanju se uporablja samo za analiziranje točkovnih in linijskih vnosov",
    "placenameButtonText": "Ime mesta",
    "drawToolsButtonText": "Riši",
    "shapefileButtonText": "Shapefile",
    "coordinatesButtonText": "Koordinate",
    "invalidLayerErrorMsg": "Konfiguriraj polja za"
  },
  "downloadTab": {
    "downloadLegend": "Prenesi nastavitve",
    "reportLegend": "Nastavitve poročila",
    "downloadTabLabel": "Prenesi",
    "syncEnableOptionLabel": "Geoobjektni sloji",
    "syncEnableOptionHint": "Namig: Uporablja se za prenos geoobjektnih informacij za geoobjekte, ki sekajo interesno območje v prikazanih formatih.",
    "syncEnableOptionNote": "Opomba: Sinhronizacija geoobjektnih storitev je obvezna za možnosti geopodatkovne baze.",
    "extractDataTaskOptionLabel": "Opravilo geoprocesne storitve ekstrakcije podatkov",
    "extractDataTaskOptionHint": "Namig: Uporabite Opravilo geoprocesne storitve ekstrakcije geoobjektov, ki sekajo interesno območje, v formatu shapefile ali File Geodatabase.",
    "cannotDownloadOptionLabel": "Onemogoči prenos",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Ime sloja",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "File Geodatabase",
      "allowDownloadLabel": "Dovoli prenos"
    },
    "setButtonLabel": "Nastavi",
    "GPTaskLabel": "Določite url za geoprocesno storitev",
    "printGPServiceLabel": "Natisni URL storitve",
    "setGPTaskTitle": "Določi zahtevan URL geoprocesne storitve",
    "logoLabel": "Logotip",
    "logoChooserHint": "Namig: Kliknite ikono slike za zamenjavo slike",
    "footnoteLabel": "Sprotna opomba",
    "columnTitleColorPickerLabel": "Barva za naslove stolpcev",
    "reportTitleLabel": "Naslov poročila",
    "errorMessages": {
      "invalidGPTaskURL": "Neveljavna geoprocesna storitev. Izberite geoprocesno storitev, ki vsebuje Opravilo ekstrakcije podatkov.",
      "noExtractDataTaskURL": "Izberite katerokoli geoprocesno storitev, ki vsebuje Opravilo ekstrakcije podatkov."
    }
  },
  "generalTab": {
    "generalTabLabel": "Splošno",
    "tabLabelsLegend": "Napisi plošče",
    "tabLabelsHint": "Namig: Določi napise",
    "AOITabLabel": "Plošča interesnega območja",
    "ReportTabLabel": "Plošča poročila",
    "bufferSettingsLegend": "Nastavitve obrisa",
    "defaultBufferDistanceLabel": "Privzeta razdalja obrisa",
    "defaultBufferUnitsLabel": "Enote obrisa",
    "generalBufferSymbologyHint": "Namig: Nastavi simbologijo za prikaz obrisov okrog določenih interesnih območjih",
    "aoiGraphicsSymbologyLegend": "Simbologija grafike AOI",
    "aoiGraphicsSymbologyHint": "Namig: Nastavi simbologijo med določanjem točkovnih, linijskih in poligonskih interesnih območjih",
    "pointSymbologyLabel": "Točka",
    "previewLabel": "Predogled",
    "lineSymbologyLabel": "Linija",
    "polygonSymbologyLabel": "Poligon",
    "aoiBufferSymbologyLabel": "Simbologija obrisa",
    "pointSymbolChooserPopupTitle": "Simbol naslova ali lokacije",
    "polygonSymbolChooserPopupTitle": "Izberite simbol za osvetljevanje poligona",
    "lineSymbolChooserPopupTitle": "Izberite simbol za osvetljevanje linije",
    "aoiSymbolChooserPopupTitle": "Nastavite simbol obrisa",
    "aoiTabText": "Interesno območje",
    "reportTabText": "Poročilo",
    "invalidSymbolValue": "Neveljavna vrednost simbola."
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Nastavitve vira iskanja",
    "searchSourceSettingTitle": "Nastavitve vira iskanja",
    "searchSourceSettingTitleHintText": "Dodaj in konfiguriraj geokodirne storitve geoobjektnih slojev kot virov iskanja. Ti viri določajo, kaj je mogoče iskati znotraj iskalnega polja",
    "addSearchSourceLabel": "Dodajte vir iskanja",
    "featureLayerLabel": "Geoobjektni sloj",
    "geocoderLabel": "Geokodirnik",
    "generalSettingLabel": "Splošna nastavitev",
    "allPlaceholderLabel": "Besedilo označbe mesta za iskanje vsega:",
    "allPlaceholderHintText": "Namig: Vnesite besedilo, ki bo prikazano kot označba mesta med iskanjem po vseh slojih in geokodirniku",
    "generalSettingCheckboxLabel": "Pokaži pojavno okno za najdeni geoobjekt ali lokacijo",
    "countryCode": "Šifre države ali regije",
    "countryCodeEg": "npr. ",
    "countryCodeHint": "Če to vrednost pustite prazno, bo iskanje potekalo po vseh državah in regijah",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Išči samo v trenutnem obsegu karte",
    "zoomScale": "Približaj merilo",
    "locatorUrl": "URL geokodirnika",
    "locatorName": "Ime geokodirnika",
    "locatorExample": "Primer",
    "locatorWarning": "Ta različica geokodirnih storitev ni podprta. Pripomoček podpira različico geokodirne storitve 10.0 in novejšo.",
    "locatorTips": "Priporočila niso na voljo, ker geokodirna storitev ne podpira predlagane zmožnosti.",
    "layerSource": "Vir sloja",
    "setLayerSource": "Nastavi vir sloja",
    "setGeocoderURL": "Nastavi URL geokodirnika",
    "searchLayerTips": "Priporočila niso na voljo, ker geoobjektna storitev ne podpira zmožnosti številčenja strani.",
    "placeholder": "Besedilo označbe mesta",
    "searchFields": "Iskalna polja",
    "displayField": "Prikaži polje",
    "exactMatch": "Natančno ujemanje",
    "maxSuggestions": "Največ predlogov",
    "maxResults": "Največ rezultatov",
    "enableLocalSearch": "Omogoči lokalno iskanje",
    "minScale": "Najmanjše merilo",
    "minScaleHint": "Ko je merilo karte večje od tega merila, bo uporabljeno lokalno iskanje",
    "radius": "Polmer",
    "radiusHint": "Določa polmer območja okrog trenutnega središča karte, ki je uporabljeno za povečanje števila kandidatov za geokodiranje, tako da so najprej prikazani kandidati, ki so najbližji lokaciji",
    "setSearchFields": "Nastavi iskalna polja",
    "set": "Nastavi",
    "invalidUrlTip": "URL ${URL} ni veljaven ali dostopen.",
    "invalidSearchSources": "Neveljavne nastavitve vira iskanja"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Izpolnite obvezna polja",
    "bufferDistanceFieldsErrorMsg": "Vnesite veljavne vrednosti",
    "invalidSearchToleranceErrorMsg": "Vnesite veljavno vrednost odstopanja pri iskanju",
    "atLeastOneCheckboxCheckedErrorMsg": "Neveljavna konfiguracija: zahtevano je vsaj eno orodje AOI.",
    "noLayerAvailableErrorMsg": "Sloji niso na voljo",
    "layerNotSupportedErrorMsg": "Ni podprto ",
    "noFieldSelected": "Uporabite dejanje urejanja za izbiro polja za analizo",
    "duplicateFieldsLabels": "Podvoji napis »${labelText}«, dodan za : »${itemNames}«",
    "noLayerSelected": "Izberite vsaj en sloj za analizo",
    "errorInSelectingLayer": "Operacije izbire sloja ni mogoče dokončati. Poskusite znova.",
    "errorInMaxFeatureCount": "Vnesite največje veljavno število geoobjektov za analizo."
  }
});