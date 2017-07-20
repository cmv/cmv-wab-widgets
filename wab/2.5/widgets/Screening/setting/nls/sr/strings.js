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
    "standardUnit": "Standardna jedinica",
    "metricUnit": "Metrička jedinica"
  },
  "analysisTab": {
    "analysisTabLabel": "Analiza",
    "selectAnalysisLayerLabel": "Izaberite slojeve analize",
    "addLayerLabel": "Dodaj slojeve",
    "noValidLayersForAnalysis": "Nema pronađenih važećih slojeva u izabranoj veb mapi.",
    "noValidFieldsForAnalysis": "Nema pronađenih važećih polja u izabranoj veb mapi. Uklonite izabrani sloj.",
    "addLayersHintText": "Savet: odaberite slojeve i polja za analizu i prikaz u izveštaju",
    "addLayerNameTitle": "Ime sloja",
    "addFieldsLabel": "Dodaj polje",
    "addFieldsPopupTitle": "Izaberi polja",
    "addFieldsNameTitle": "Imena polja",
    "aoiToolsLegendLabel": "AOI alatke",
    "aoiToolsDescriptionLabel": "Omogućite alatke za kreiranje oblasti interesovanja i navedite njihove oznake",
    "placenameLabel": "Naziv mesta",
    "drawToolsLabel": "Alatke za crtanje",
    "uploadShapeFileLabel": "Otpremi shapefile",
    "coordinatesLabel": "Koordinate",
    "coordinatesDrpDwnHintText": "Savet: odaberite jedinicu za prikaz unetih poligonskih vlaka",
    "coordinatesBearingDrpDwnHintText": "Savet: odaberite direkcioni ugao za prikazivanje unetih poligonskih vlaka",
    "allowShapefilesUploadLabel": "Omogućite otpremanje shapefile datoteka za analizu",
    "areaUnitsLabel": "Prikaži površine/dužine",
    "allowShapefilesUploadLabelHintText": "Savet: prikaži „otpremi shapefile datoteke za analizu“ u kartici Izveštaj",
    "maxFeatureForAnalysisLabel": "Maksimalno geoobjekata za analizu",
    "maxFeatureForAnalysisHintText": "Savet: postavite maksimalan broj geoobjekata za analizu",
    "searchToleranceLabelText": "Tolerancija pretrage (u stopama)",
    "searchToleranceHint": "Savet: tolerancija pretrage se koristi samo za analiziranje unesenih tačaka i linija"
  },
  "downloadTab": {
    "downloadLegend": "Postavke preuzimanja",
    "reportLegend": "Postavke izveštaja",
    "downloadTabLabel": "Preuzmi",
    "syncEnableOptionLabel": "Slojevi geoobjekata",
    "syncEnableOptionHint": "Savet: koristi se za preuzimanje informacija geoobjekata za geoobjekte koji presecaju oblast interesovanja u prikazanim formatima.",
    "syncEnableOptionNote": "Napomena: obavezna je omogućena sinhronizacija servisa geoobjekata za opciju Datoteka geobaze podataka.",
    "extractDataTaskOptionLabel": "Zadatak ekstrahovanja podataka servisa geoprocesiranja",
    "extractDataTaskOptionHint": "Savet: koristite objavljeni zadatak ekstrahovanja podataka servisa geoprocesiranja kako biste preuzeli geoobjekte koji presecaju oblasti interesovanja u formatima Datoteke geobaze podataka i Shapefile.",
    "cannotDownloadOptionLabel": "Onemogući preuzimanje",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Ime sloja",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "Fajl geobaza",
      "allowDownloadLabel": "Omogući preuzimanje"
    },
    "setButtonLabel": "Postavi",
    "GPTaskLabel": "Navedite URL za servis geoprocesiranja",
    "printGPServiceLabel": "Štampaj URL adresu servisa",
    "setGPTaskTitle": "Navedite obaveznu URL adresu servisa geoprocesiranja",
    "logoLabel": "Logotip",
    "logoChooserHint": "Savet: kliknite na ikonu sličice kako biste promenili sličicu",
    "footnoteLabel": "Fusnota",
    "columnTitleColorPickerLabel": "Boja za naslove kolona",
    "reportTitleLabel": "Naziv izveštaja",
    "errorMessages": {
      "invalidGPTaskURL": "Nevažeći servis geoprocesiranja. Odaberite servis geoprocesiranja koji sadrži zadatak ekstrahovanja podataka.",
      "noExtractDataTaskURL": "Odaberite bilo koji servis geoprocesiranja koji sadrži zadatak esktrahovanja podataka."
    }
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
    "generalBufferSymbologyHint": "Savet: postavite simbologiju za korišćenje u prikazu zona bliskosti oko definisanih oblasti interesovanja",
    "aoiGraphicsSymbologyLegend": "AOI simbologija grafike",
    "aoiGraphicsSymbologyHint": "Savet: postavite simbologiju koja će biti korišćena tokom definisanja tačaka, linija i poligona oblasti interesovanja",
    "pointSymbologyLabel": "Tačka",
    "previewLabel": "Prikaži",
    "lineSymbologyLabel": "Linija",
    "polygonSymbologyLabel": "Poligon",
    "aoiBufferSymbologyLabel": "Simbologija zone bliskosti",
    "pointSymbolChooserPopupTitle": "Simbol adresa ili lokacije",
    "polygonSymbolChooserPopupTitle": "Izaberite simbol za isticanje poligona",
    "lineSymbolChooserPopupTitle": "Izaberite simbol za isticanje linije",
    "aoiSymbolChooserPopupTitle": "Podesi simbol zone bliskosti"
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
    "zoomScale": "Skala zumiranja",
    "locatorUrl": "URL adresa geokodera",
    "locatorName": "Ime geokodera",
    "locatorExample": "Primer",
    "locatorWarning": "Ova verzija servisa geokôdiranja nije podržana. Vidžet podržava samo servis geokôdiranja 10.0 i novije.",
    "locatorTips": "Predlozi nisu dostupni jer servis geokôdiranja ne podržava predloženu mogućnost.",
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
    "atLeastOneCheckboxCheckedErrorMsg": "Nevažeća konfiguracija",
    "noLayerAvailableErrorMsg": "Nema dostupnih slojeva",
    "layerNotSupportedErrorMsg": "Nije podržano ",
    "noFieldSelected": "Koristite radnju uređivanja za odabir polja za analizu.",
    "duplicateFieldsLabels": "Duplirate oznaku \"${labelText}\" dodatu za: \"${itemNames}\"",
    "noLayerSelected": "Odaberite najmanje jedan sloj za analizu",
    "errorInSelectingLayer": "Završavanje operacije odabira slojeva nije moguće. Pokušajte ponovo.",
    "errorInMaxFeatureCount": "Unesite važeći maksimalni broj geoobjekata za analizu."
  }
});