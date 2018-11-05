/*
 | Copyright 2017 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define({
  "searchSourceSetting": {
    "title": "Configuració de cerca i de l'àrea d'influència",
    "mainHint": "Podeu habilitar les cerques de text d'adreces i entitats, la digitalització de geometria i la creació d'àrees d'influència."
  },
  "addressSourceSetting": {
    "title": "Capes d'adreça",
    "mainHint": "Podeu especificar quines capes d'etiquetes de destinatari estan disponibles."
  },
  "notificationSetting": {
    "title": "Opcions de notificació",
    "mainHint": "Podeu especificar quins tipus de notificació estan disponibles."
  },
  "groupingLabels": {
    "addressSources": "Capa que s'utilitzarà per seleccionar capes de destinatari",
    "averyStickersDetails": "Adhesius Avery(r)",
    "csvDetails": "Fitxer de valors separats per comes (CSV)",
    "drawingTools": "Eines de dibuix per especificar l'àrea",
    "featureLayerDetails": "Capa d'entitats",
    "geocoderDetails": "Geocodificador",
    "labelFormats": "Formats d'etiqueta disponibles",
    "printingOptions": "Opcions de pàgines d'etiquetes impreses",
    "searchSources": "Orígens de la cerca",
    "stickerFormatDetails": "Paràmetres de pàgines d'etiquetes"
  },
  "hints": {
    "alignmentAids": "Les marques s'afegeixen a la pàgina d'etiquetes per ajudar-vos a alinear la pàgina amb la impressora",
    "csvNameList": "Llista separada per comes de noms de camps que diferencien entre majúscules i minúscules",
    "horizontalGap": "Espai entre dues etiquetes en una fila",
    "insetToLabel": "Espai entre el costat de l'etiqueta i l'inici del text",
    "labelFormatDescription": "Presentació de l'estil d'etiqueta a la llista d'opcions de format dels widgets",
    "labelFormatDescriptionHint": "Informació sobre eines que complementa la descripció de la llista d'opcions de format",
    "labelHeight": "Altura de cada etiqueta a la pàgina",
    "labelWidth": "Amplada de cada etiqueta a la pàgina",
    "localSearchRadius": "Permet especificar el radi d'una àrea al voltant del centre del mapa actual que s'utilitzarà per millorar la classificació dels candidats de geocodificació per tal que es retornin primer aquells més propers a la ubicació",
    "rasterResolution": "100 píxels per polzada aproximadament coincideix amb la resolució de pantalla. Com més alta sigui la resolució, més memòria del navegador es necessitarà. Els navegadors tenen diferents maneres de gestionar correctament les necessitats de memòria grans.",
    "selectionListOfOptionsToDisplay": "Els elements activats es mostren com opcions al widget; canvieu l'ordre com desitgeu",
    "verticalGap": "Espai entre dues etiquetes d'una columna"
  },
  "propertyLabels": {
    "bufferDefaultDistance": "Distància d'àrea d'influència per defecte",
    "bufferUnits": "Unitats d'àrea d'influència que es proporcionaran al widget",
    "countryRegionCodes": "Codis de país o regió",
    "description": "Descripció",
    "descriptionHint": "Suggeriment de descripció",
    "displayField": "Camp que es mostra",
    "drawingToolsFreehandPolygon": "polígon a mà alçada",
    "drawingToolsLine": "línia",
    "drawingToolsPoint": "punt",
    "drawingToolsPolygon": "polígon",
    "drawingToolsPolyline": "polilínia",
    "enableLocalSearch": "Habilita la cerca local",
    "exactMatch": "Coincidència exacta",
    "fontSizeAlignmentNote": "Cos de lletra de la nota sobre els marges d'impressió",
    "gridDarkness": "Foscor de la quadrícula",
    "gridlineLeftInset": "Cartel·la de línies de quadrícula esquerra",
    "gridlineMajorTickMarksGap": "Marques de graduació principal cada",
    "gridlineMinorTickMarksGap": "Marques de graduació secundària cada",
    "gridlineRightInset": "Cartel·la de línies de quadrícula dreta",
    "labelBorderDarkness": "Foscor de la vora de l'etiqueta",
    "labelBottomEdge": "Vora inferior de les etiquetes de la pàgina",
    "labelFontSize": "Cos de lletra",
    "labelHeight": "Altura de l'etiqueta",
    "labelHorizontalGap": "Separació horitzontal",
    "labelInitialInset": "Cartel·la per etiquetar text",
    "labelLeftEdge": "Vora esquerra de les etiquetes de la pàgina",
    "labelMaxLineCount": "Nombre màxim de línies de l'etiqueta",
    "labelPageHeight": "Altura de la pàgina",
    "labelPageWidth": "Amplada de la pàgina",
    "labelRightEdge": "Vora dreta de les etiquetes de la pàgina",
    "labelsInAColumn": "Nombre d'etiquetes en una columna",
    "labelsInARow": "Nombre d'etiquetes en una fila",
    "labelTopEdge": "Vora superior de les etiquetes de la pàgina",
    "labelVerticalGap": "Separació vertical",
    "labelWidth": "Amplada de l'etiqueta",
    "limitSearchToMapExtent": "Cerca només a l'extensió de mapa actual",
    "maximumResults": "Màxim de resultats",
    "maximumSuggestions": "Màxim de suggeriments",
    "minimumScale": "Escala mínima",
    "name": "Nom",
    "percentBlack": "% de negre",
    "pixels": "píxels",
    "pixelsPerInch": "píxels per polzada",
    "placeholderText": "Text del marcador de posició",
    "placeholderTextForAllSources": "Text del marcador de posició per cercar tots els orígens",
    "radius": "Radi",
    "rasterResolution": "Resolució de ràster",
    "searchFields": "Camps de cerca",
    "showAlignmentAids": "Mostra les ajudes d'alineació a la pàgina",
    "showGridTickMarks": "Mostra les marques de graduació de la quadrícula",
    "showLabelOutlines": "Mostra els contorns de les etiquetes",
    "showPopupForFoundItem": "Mostra la finestra emergent de l'entitat o la ubicació trobada",
    "tool": "Eines",
    "units": "Unitats",
    "url": "URL",
    "urlToGeometryService": "URL al servei de geometria",
    "useRelatedRecords": "Utilitza els registres relacionats",
    "useSecondarySearchLayer": "Utilitza la capa de selecció secundària",
    "useSelectionDrawTools": "Utilitza les eines de dibuix de la selecció",
    "useVectorFonts": "Utilitza tipus de lletra vectorial (només tipus de lletra llatina)",
    "zoomScale": "Escala de zoom"
  },
  "buttons": {
    "addAddressSource": "Afegeix una capa que contingui etiquetes d'adreça a la finestra emergent",
    "addLabelFormat": "Afegeix un format d'etiqueta",
    "addSearchSource": "Afegeix un origen de cerca",
    "set": "Defineix"
  },
  "placeholders": {
    "averyExample": "per exemple, etiqueta d'Avery(r) ${averyPartNumber}",
    "countryRegionCodes": "per exemple, USA,CHN",
    "descriptionCSV": "Valors separats per comes",
    "descriptionPDF": "Etiqueta PDF ${heightLabelIn} × ${widthLabelIn} polzades; ${labelsPerPage} per pàgina"
  },
  "tooltips": {
    "getWebmapFeatureLayer": "Obtén la capa d'entitats del mapa web",
    "openCountryCodes": "Feu clic per obtenir més informació sobre els codis",
    "openFieldSelector": "Feu clic per obrir un selector de camps",
    "setAndValidateURL": "Defineix i valida la URL"
  },
  "problems": {
    "noAddresseeLayers": "Especifiqueu com a mínim una capa de destinatari",
    "noBufferUnitsForDrawingTools": "Configureu com a mínim una unitat d'àrea d'influència per a les eines de dibuix",
    "noBufferUnitsForSearchSource": "Configureu com a mínim una unitat d'àrea d'influència per a l'origen de cerca \"${sourceName}\"",
    "noGeometryServiceURL": "Configureu la URL al servei de geometria",
    "noNotificationLabelFormats": "Especifiqueu com a mínim un format d'etiqueta de notificació",
    "noSearchSourceFields": "Configureu un o diversos camps de cerca per a l'origen de cerca \"${sourceName}\"",
    "noSearchSourceURL": "Configureu la URL de l'origen de cerca \"${sourceName}\""
  },
  "querySourceSetting": {
    "sourceSetting": "Configuració de l'origen de la cerca",
    "instruction": "Afegiu i configureu serveis de geocodificació o capes d'entitats com a orígens de cerca. Aquests orígens especificats determinen què es pot cercar al quadre de cerca.",
    "add": "Afegeix un origen de cerca",
    "addGeocoder": "Afegeix un geocodificador",
    "geocoder": "Geocodificador",
    "setLayerSource": "Defineix l'origen de la capa",
    "setGeocoderURL": "Defineix la URL del geocodificador",
    "searchableLayer": "Capa d'entitats",
    "name": "Nom",
    "countryCode": "Codis de país o regió",
    "countryCodeEg": "per exemple, ",
    "countryCodeHint": "Si aquest valor es deixa en blanc, la cerca es farà en tots els països i regions",
    "generalSetting": "Configuració general",
    "allPlaceholder": "Text del marcador de posició per cercar-ho tot: ",
    "showInfoWindowOnSelect": "Mostra la finestra emergent de l'entitat o la ubicació trobada",
    "showInfoWindowOnSelect2": "Mostra la finestra emergent quan es trobi l'entitat o la ubicació.",
    "searchInCurrentMapExtent": "Cerca només a l'extensió de mapa actual",
    "zoomScale": "Escala de zoom",
    "locatorUrl": "URL del geocodificador",
    "locatorName": "Nom del geocodificador",
    "locatorExample": "Exemple",
    "locatorWarning": "Aquesta versió del servei de geocodificació no s'admet. El widget admet el servei de geocodificació 10.1 i versions posteriors.",
    "locatorTips": "Els suggeriments no estan disponibles perquè el servei de geocodificació no admet la funció de suggeriments.",
    "layerSource": "Origen de la capa",
    "searchLayerTips": "Els suggeriments no estan disponibles perquè el servei d'entitats no admet la funció de paginació.",
    "placeholder": "Text del marcador de posició",
    "searchFields": "Camps de cerca",
    "displayField": "Camp que es mostra",
    "exactMatch": "Coincidència exacta",
    "maxSuggestions": "Màxim de suggeriments",
    "maxResults": "Màxim de resultats",
    "enableLocalSearch": "Habilita la cerca local",
    "minScale": "Escala mínima",
    "minScaleHint": "Si l'escala del mapa és més gran que aquesta escala, s'aplicarà la cerca local",
    "radius": "Radi",
    "radiusHint": "Permet especificar el radi d'una àrea al voltant del centre del mapa actual que s'utilitzarà per millorar la classificació dels candidats de geocodificació per tal que es retornin primer aquells més propers a la ubicació",
    "meters": "Metres",
    "setSearchFields": "Defineix els camps de cerca",
    "set": "Defineix",
    "fieldSearchable": "permet la cerca",
    "fieldName": "Nom",
    "fieldAlias": "Àlies",
    "ok": "D'acord",
    "cancel": "Cancel·la",
    "invalidUrlTip": "L'adreça URL ${URL} no és vàlida o no s'hi pot accedir."
  }
});