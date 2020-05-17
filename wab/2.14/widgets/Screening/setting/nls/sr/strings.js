///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
    "areaSquareFeetUnit": "Kvadratne stope",
    "areaAcresUnit": "Acres",
    "areaSquareMetersUnit": "Kvadratni metri",
    "areaSquareKilometersUnit": "Kvadratni kilometri",
    "areaHectaresUnit": "Hektari",
    "lengthFeetUnit": "Stope",
    "lengthMilesUnit": "Milje",
    "lengthMetersUnit": "Metri",
    "lengthKilometersUnit": "Kilometri"
  },
  "analysisTab": {
    "analysisTabLabel": "Analiza",
    "selectAnalysisLayerLabel": "Slojevi analize",
    "addLayerLabel": "Dodaj slojeve",
    "noValidLayersForAnalysis": "Nema pronađenih važećih slojeva u izabranoj veb mapi.",
    "noValidFieldsForAnalysis": "Nema pronađenih važećih polja u izabranoj veb mapi. Uklonite izabrani sloj.",
    "allowGroupingLabel": "Grupiši geoobjekte prema poljima sa istom vrednošću",
    "groupingHintDescription": "Savet: podrazumevano, svi geoobjekti sa istom vrednošću za izabrana polja, biće grupisani tako da se prikažu kao pojedinačni unos u izveštaju. Onemogući grupisanje prema sličnim atributima da bi se umesto toga prikazao unos za svaki geoobjekat.",
    "addLayersHintText": "Savet: odaberite slojeve i polja koje želite da uključite u analizu i izveštaj",
    "addLayerNameTitle": "Ime sloja",
    "addFieldsLabel": "Dodaj polje",
    "addFieldsPopupTitle": "Izaberi polja",
    "addFieldsNameTitle": "Imena polja",
    "aoiToolsLegendLabel": "Alatke za oblast interesovanja",
    "aoiToolsDescriptionLabel": "Odaberite i označite alatke koje su dostupne za kreiranje oblasti interesovanja.",
    "placenameLabel": "Ime mesta",
    "drawToolsLabel": "Izaberi alate za crtanje",
    "uploadShapeFileLabel": "Otpremi shapefile",
    "coordinatesLabel": "Koordinate",
    "coordinatesDrpDwnHintText": "Savet: odaberite jedinicu za prikaz unetih poligonskih vlakova",
    "coordinatesBearingDrpDwnHintText": "Savet: odaberite direkcioni ugao za prikazivanje unetih poligonskih vlakova",
    "allowShapefilesUploadLabel": "Omogućite korisnicima da otpremaju shapefile datoteke za uključivanje u analizu",
    "allowShapefilesUploadLabelHintText": "Savet: dodajte opciju u karticu Izveštaj gde korisnici mogu da otpreme svoje podatke kao shapefile datoteku za uključivanje u izveštaj o analizi",
    "allowVisibleLayerAnalysisLabel": "Ne analiziraj ili ne prijavljuj rezultate za slojeve koji nisu vidljivi",
    "allowVisibleLayerAnalysisHintText": "Savet: slojevi koji su isključeni ili nisu vidljivi zbog postavki skale vidljivosti neće biti analizirani ili uključeni u štampane ili preuzete rezultate.",
    "areaUnitsLabel": "Jedinice za rezultate analize(Oblast)",
    "lengthUnitsLabel": "Jedinice za rezultate analize(Dužina)",
    "maxFeatureForAnalysisLabel": "Maksimalni broj geoobjekata za analiziranje",
    "maxFeatureForAnalysisHintText": "Savet: podesite maksimalan broj geoobjekata koji će biti uključeni u analizu",
    "searchToleranceLabelText": "Tolerancija pretrage",
    "searchToleranceHint": "Savet: tolerancija pretrage se koristi za analiziranje unesenih tačaka i linija",
    "placenameButtonText": "Ime mesta",
    "drawToolsButtonText": "Nacrtaj",
    "shapefileButtonText": "Shapefile datoteka",
    "coordinatesButtonText": "Koordinate",
    "invalidLayerErrorMsg": "Konfiguriši polja za",
    "drawToolSelectableLayersLabel": "Odaberite selektivne slojeve",
    "drawToolSelectableLayersHint": "Savet: odaberite slojeve koji sadrže geoobjekte koji mogu da se izaberu pomoću Izaberi alatku za crtanje",
    "drawToolsSettingsFieldsetLabel": "Alatke za crtanje",
    "drawToolPointLabel": "Tačka",
    "drawToolPolylineLabel": "Poligon",
    "drawToolExtentLabel": "Obuhvat",
    "drawToolPolygonLabel": "Polilinija",
    "drawToolCircleLabel": "Krug",
    "selectDrawToolsText": "Odaberite alatke za crtanje koje su dostupne za kreiranje oblasti interesovanja",
    "selectingDrawToolErrorMessage": "Odaberite barem jednu alatku za crtanje ili sloj selekcije da biste koristili opciju Alatke za crtanje za AOI alatke."
  },
  "downloadTab": {
    "downloadLegend": "Postavke preuzimanja",
    "reportLegend": "Postavke izveštaja",
    "downloadTabLabel": "Preuzmi",
    "syncEnableOptionLabel": "Slojevi geoobjekata",
    "syncEnableOptionHint": "Savet: odaberite slojeve koji mogu da se preuzmu i navedite formate u kojima je dostupan svaki sloj. Preuzeti skupovi podataka će sadržati one geoobjekte koji presecaju oblast interesovanja.",
    "syncEnableOptionNote": "Napomena: preuzimanja datoteke geobaze podataka i shapefile datoteke zahtevaju slojeve geoobjekata sa omogućenom sinhronizacijom. Format shapefile je podržan samo sa ArcGIS Online hostovanim slojevima geoobjekata.",
    "extractDataTaskOptionLabel": "Zadatak ekstrahovanja podataka servisa geoprocesiranja",
    "extractDataTaskOptionHint": "Savet: koristite objavljeni zadatak ekstrahovanja podataka servisa geoprocesiranja kako biste preuzeli geoobjekte koji presecaju oblasti interesovanja u formatima datoteke geobaze podataka i shapefile.",
    "cannotDownloadOptionLabel": "Onemogući preuzimanje",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Ime sloja",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "Fajl geobaza",
      "ShapefileFormatLabel": "Shapefile datoteka",
      "allowDownloadLabel": "Omogući preuzimanje"
    },
    "setButtonLabel": "Postavi",
    "GPTaskLabel": "Navedite URL za servis geoprocesiranja",
    "printGPServiceLabel": "Štampaj URL adresu servisa",
    "setGPTaskTitle": "Navedite obaveznu URL adresu servisa geoprocesiranja",
    "logoLabel": "Logotip",
    "logoChooserHint": "Savet: kliknite na ikonu snimka da biste promenili logotip koji je prikazan u gornjem levom uglu izveštaja",
    "footnoteLabel": "Fusnota",
    "columnTitleColorPickerLabel": "Boja naslova kolone izveštaja",
    "reportTitleLabel": "Naslov izveštaja",
    "displaySummaryLabel": "Prikaži rezime",
    "errorMessages": {
      "invalidGPTaskURL": "Nevažeći servis geoprocesiranja. Odaberite servis geoprocesiranja koji sadrži zadatak ekstrahovanja podataka.",
      "noExtractDataTaskURL": "Odaberite servis geoprocesiranja koji sadrži zadatak ekstrahovanja podataka.",
      "duplicateCustomOption": "Postoji duplirani unos za ${duplicateValueSizeName}.",
      "invalidLayoutWidth": "Uneta je nevažeća širina za ${customLayoutOptionValue}.",
      "invalidLayoutHeight": "Uneta je nevažeća visina za ${customLayoutOptionValue}.",
      "invalidLayoutPageUnits": "Izabrana je nevažeća jedinica stranice za ${customLayoutOptionValue}.",
      "failtofetchbuddyTaskDimension": "Greška prilikom dobavljanja informacija o dimenziji prijateljskog zadatka. Pokušajte ponovo.",
      "failtofetchbuddyTaskName": "Greška prilikom dobavljanja imena prijateljskog zadatka. Pokušajte ponovo.",
      "failtofetchChoiceList": "Greška prilikom dobavljanja liste izbora od usluge štampanja. Pokušajte ponovo.",
      "invalidWidth": "Nevažeća širina.",
      "invalidHeight": "Nevažeća visina."
    },
    "addCustomLayoutTitle": "Dodaj prilagođeni raspored",
    "customLayoutOptionHint": "Savet: Dodajte prilagođeni raspored iz usluge štampanja u listu opcija za štampanje.",
    "reportDefaultOptionLabel": "Podrazumevani raspored",
    "pageSizeUnits": {
      "millimeters": "Milimetri",
      "points": "Tačke"
    },
    "noDataTextRepresentation": "Nema vrednosti podataka",
    "naTextRepresentation": "Vrednost nije primenljiva",
    "noDataDefaultText": "Nema podataka",
    "notApplicableDefaultText": "Nije dostupno"
  },
  "generalTab": {
    "generalTabLabel": "Opšte",
    "tabLabelsLegend": "Oznake tabli",
    "tabLabelsHint": "Savet: navedite oznake",
    "AOITabLabel": "Tabla oblasti interesovanja",
    "ReportTabLabel": "Tabla izveštaja",
    "bufferSettingsLegend": "Postavke zone bliskosti",
    "defaultBufferDistanceLabel": "Podrazumevano rastojanje zone bliskosti",
    "defaultBufferUnitsLabel": "Jedinice zone bliskosti",
    "generalBufferSymbologyHint": "Napomena: simbologija koja će se koristiti za označavanje oblasti zone bliskosti oko definisane oblasti interesovanja",
    "aoiGraphicsSymbologyLegend": "Simbologija za oblast interesovanja",
    "aoiGraphicsSymbologyHint": "Napomena: simbologija koja se koristi za označavanje tačaka, linija i poligona oblasti interesovanja",
    "pointSymbologyLabel": "Tačka",
    "previewLabel": "Prikaži",
    "lineSymbologyLabel": "Linija",
    "polygonSymbologyLabel": "Poligon",
    "aoiBufferSymbologyLabel": "Simbologija zone bliskosti",
    "pointSymbolChooserPopupTitle": "Simbol adrese ili lokacije tačke",
    "polygonSymbolChooserPopupTitle": "Simbol poligona",
    "lineSymbolChooserPopupTitle": "Simbol linije",
    "aoiSymbolChooserPopupTitle": "Simbol zone bliskosti",
    "aoiTabText": "AOI",
    "reportTabText": "Prijava",
    "invalidSymbolValue": "Nevažeća vrednost simbola."
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Pretraži postavke izvora",
    "searchSourceSettingTitle": "Pretraži postavke izvora",
    "searchSourceSettingTitleHintText": "Dodajte i konfigurišite servise za geokodiranje ili slojeve geoobjekata kao izvora pretrage. Ovi navedeni izvori određuju šta može da se pretražuje unutar trake za pretragu.",
    "addSearchSourceLabel": "Dodaj izvor pretrage",
    "featureLayerLabel": "Sloj geoobjekata",
    "geocoderLabel": "Geokoder",
    "generalSettingLabel": "Opšte postavke",
    "allPlaceholderLabel": "Tekst čuvara mesta za pretragu svega:",
    "allPlaceholderHintText": "Savet: Unesite tekst koji će se prikazati kao čuvar mesta tokom pretrage svih slojeva i geokodera",
    "generalSettingCheckboxLabel": "Prikaži iskačući prozor za pronađeni geoobjekat ili lokaciju",
    "countryCode": "Kôd(ovi) zemlje ili regiona",
    "countryCodeEg": "npr. ",
    "countryCodeHint": "Ako ova vrednost ostane prazna, pretražuju se sve zemlje i regioni",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Pretraži samo u trenutnom obuhvatu mape",
    "locatorUrl": "URL adresa geokodera",
    "locatorName": "Ime geokodera",
    "locatorExample": "Primer",
    "locatorWarning": "Ova verzija servisa geokôdiranja nije podržana. Vidžet podržava samo servis geokôdiranja 10.0 i novije.",
    "locatorTips": "Predlozi nisu dostupni jer servis geokodiranja ne podržava predloženu mogućnost.",
    "layerSource": "Izvor sloja",
    "setLayerSource": "Postavi izvor sloja",
    "setGeocoderURL": "Postavi URL adresu geokôdera",
    "searchLayerTips": "Predlozi nisu dostupni jer servis geoobjekata ne podržava mogućnost paginacije.",
    "placeholder": "Tekst čuvara mesta",
    "searchFields": "Polja za pretragu",
    "displayField": "Prikaži polje",
    "exactMatch": "Potpuno podudaranje",
    "maxSuggestions": "Maksimalno predloga",
    "maxResults": "Maksimalno rezultata",
    "enableLocalSearch": "Omogući lokalnu pretragu",
    "minScale": "Min. razmera",
    "minScaleHint": "Kada je razmera mape veća od ove razmere, primenjuje se lokalna pretraga",
    "radius": "Poluprečnik",
    "radiusHint": "Definiše poluprečnik oblasti oko trenutnog centra mape koja se koristi za poboljšavanje rangiranja kandidata za geokodiranje kako bi se prvo vraćali kandidati najbliži lokaciji",
    "setSearchFields": "Postavi polja pretrage",
    "set": "Postavi",
    "invalidUrlTip": "URL adresa ${URL} nije validna ili nije dostupna.",
    "invalidSearchSources": "Nevažeće postavke za pretragu izvora"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Popunite obavezna polja",
    "bufferDistanceFieldsErrorMsg": "Unesite validne vrednosti",
    "invalidSearchToleranceErrorMsg": "Unesite validne vrednosti za toleranciju pretrage",
    "atLeastOneCheckboxCheckedErrorMsg": "Nevažeća konfiguracija: obavezna je najmanje jedna alatka za oblast interesovanja.",
    "noLayerAvailableErrorMsg": "Nema dostupnih slojeva",
    "layerNotSupportedErrorMsg": "Nije podržano ",
    "noFieldSelected": "Koristite radnju uređivanja za odabir polja za analizu.",
    "duplicateFieldsLabels": "Duplirate oznaku \"${labelText}\" dodatu za: \"${itemNames}\"",
    "noLayerSelected": "Odaberite najmanje jedan sloj za analizu.",
    "errorInSelectingLayer": "Selektovanje sloja nije moguće. Pokušajte ponovo.",
    "errorInMaxFeatureCount": "Unesite važeći maksimalni broj geoobjekata za analizu."
  }
});