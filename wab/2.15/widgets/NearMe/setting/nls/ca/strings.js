/*global define*/
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
    "miles": {
      "displayText": "Milles",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Quilòmetres",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Peus",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Metres",
      "acronym": "m"
    }
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Configuració de l'origen de la cerca",
    "searchSourceSettingTitle": "Configuració de l'origen de la cerca",
    "searchSourceSettingTitleHintText": "Afegiu i configureu serveis de geocodificació o capes d'entitats com a orígens de cerca. Aquests orígens especificats determinen què es pot cercar al quadre de cerca.",
    "addSearchSourceLabel": "Afegeix un origen de cerca",
    "featureLayerLabel": "Capa d'entitats",
    "geocoderLabel": "Geocodificador",
    "nameTitle": "Nom",
    "generalSettingLabel": "Configuració general",
    "allPlaceholderLabel": "Text del marcador de posició per cercar-ho tot:",
    "allPlaceholderHintText": "Suggeriment: introduïu el text que es mostrarà com a marcador de posició mentre cerqueu totes les capes i el geocodificador",
    "generalSettingCheckboxLabel": "Mostra la finestra emergent de l'entitat o la ubicació trobada",
    "countryCode": "Codis de país o regió",
    "countryCodeEg": "per exemple, ",
    "countryCodeHint": "Si aquest valor es deixa en blanc, la cerca es farà en tots els països i regions",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Cerca només a l'extensió de mapa actual",
    "zoomScale": "Escala de zoom",
    "locatorUrl": "URL del geocodificador",
    "locatorName": "Nom del geocodificador",
    "locatorExample": "Exemple",
    "locatorWarning": "Aquesta versió del servei de geocodificació no s'admet. El widget admet el servei de geocodificació 10.0 i versions posteriors.",
    "locatorTips": "Els suggeriments no estan disponibles perquè el servei de geocodificació no admet la funció de suggeriments.",
    "layerSource": "Origen de la capa",
    "setLayerSource": "Defineix l'origen de la capa",
    "setGeocoderURL": "Defineix la URL del geocodificador",
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
    "fieldName": "Nom",
    "invalidUrlTip": "L'adreça URL ${URL} no és vàlida o no s'hi pot accedir."
  },
  "searchSetting": {
    "searchSettingTabTitle": "Configuració de cerca",
    "defaultBufferDistanceLabel": "Defineix la distància d'àrea d'influència per defecte",
    "maxResultCountLabel": "Nombre límit de resultats",
    "maxResultCountHintLabel": "Suggeriment: definiu el nombre màxim de resultats visibles. El valor 1 retornarà l'entitat més propera.",
    "maxBufferDistanceLabel": "Defineix la distància d'àrea d'influència màxima",
    "bufferDistanceUnitLabel": "Unitats de distància d'àrea d'influència",
    "defaultBufferHintLabel": "Suggeriment: definiu el valor per defecte del control lliscant d'àrea d'influència",
    "maxBufferHintLabel": "Suggeriment: definiu el valor màxim del control lliscant d'àrea d'influència",
    "bufferUnitLabel": "Suggeriment: definiu la unitat per crear l'àrea d'influència",
    "selectGraphicLocationSymbol": "Símbol d'adreça o ubicació",
    "graphicLocationSymbolHintText": "Suggeriment: símbol de l'adreça que s'ha cercat o la ubicació on s'ha fet clic",
    "addressLocationPolygonHintText": "Suggeriment: símbol de la capa de polígon que s'ha configurat per utilitzar a la cerca de proximitat.",
    "popupTitleForPolygon": "Seleccioneu el polígon de la ubicació de l'adreça seleccionada",
    "popupTitleForPolyline": "Seleccioneu la línia de la ubicació de l'adreça",
    "addressLocationPolylineHintText": "Suggeriment: símbol de la capa de polilínia que s'ha configurat per utilitzar a la cerca de proximitat.",
    "fontColorLabel": "Seleccioneu el color de font dels resultats de la cerca",
    "fontColorHintText": "Suggeriment: color de font dels resultats de la cerca",
    "highlightColorLabel": "Defineix el color de selecció",
    "highlightColorHintText": "Suggeriment: color de selecció",
    "zoomToSelectedFeature": "Aplica el zoom a l'entitat seleccionada",
    "zoomToSelectedFeatureHintText": "Suggeriment: apliqueu el zoom a l'entitat seleccionada en lloc d'aplicar-lo a l'àrea d'influència",
    "intersectSearchLocation": "Retorna els polígons que s'intersequen",
    "intersectSearchLocationHintText": "Suggeriment: retorneu els polígons que continguin la ubicació que s'hagi cercat en lloc dels polígons de dins de l'àrea d'influència",
    "enableProximitySearch": "Habilita la cerca per proximitat",
    "enableProximitySearchHintText": "Suggeriment: habiliteu la funció per cercar ubicacions properes a un resultat seleccionat",
    "bufferVisibilityLabel": "Defineix la visibilitat de l'àrea d'influència",
    "bufferVisibilityHintText": "Suggeriment: l'àrea d'influència es mostrarà al mapa",
    "bufferColorLabel": "Defineix el símbol d'àrea d'influència",
    "bufferColorHintText": "Suggeriment: seleccioneu el color i la transparència de l'àrea d'influència",
    "searchLayerResultLabel": "Dibuixa només els resultats de la capa seleccionada",
    "searchLayerResultHint": "Suggeriment: només la capa seleccionada dels resultats de la cerca es dibuixarà al mapa",
    "showToolToSelectLabel": "Botó Defineix la ubicació",
    "showToolToSelectHintText": "Suggeriment: proporciona un botó per definir la ubicació al mapa en lloc de definir sempre la ubicació quan es fa clic al mapa",
    "geoDesicParamLabel": "Utilitzeu l'àrea d'influència geodèsica",
    "geoDesicParamHintText": "Suggeriment: utilitzeu una àrea d'influència geodèsica en lloc d'una àrea d'influència euclidiana (planar)",
    "showImageGalleryLabel": "Mostra la galeria d'imatges",
    "showImageGalleryHint": "Suggeriment: mostreu la galeria d'imatges a la subfinestra del widget si la casella de selecció està activada. Altrament, amagueu-la.",
    "showResultCountOfLayerLabel": "Mostra el recompte de resultats de la cerca de cada capa",
    "showResultCountOfLayerHint": "Suggeriment: mostreu el nombre de resultats de la cerca després del nom de cada capa",
    "editDescription": "Text introductori",
    "editDescriptionTip": "Text que es mostra al widget sobre el quadre de cerca.",
    "noResultsFound": "Missatge quan no es troba cap resultat",
    "noResultFoundHint": "Suggeriment: definiu el missatge que es mostrarà quan no es trobin resultats a l'àrea de cerca",
    "noFeatureFoundText": "No s'ha trobat cap resultat ",
    "searchHeaderText": "Cerca una adreça o localitza-la al mapa",
    "setCurrentLocationLabel": "Botó Defineix la ubicació actual",
    "setCurrentLocationHintText": "Suggeriment: proporcioneu un botó per utilitzar la ubicació actual de l'usuari",
    "bufferDistanceSliderLabel": "Control lliscant de distància d'àrea d'influència",
    "bufferDistanceTextboxLabel": "Quadre de text d'àrea d'influència",
    "bufferDistanceSliderandTextboxLabel": "Quadre de text i control lliscant de distància d'àrea d'influència",
    "bufferItemOptionLegend": "Opcions d'entrada d'àrea d'influència"
  },
  "layerSelector": {
    "selectLayerLabel": "Seleccioneu les capes de cerca",
    "layerSelectionHint": "Suggeriment: utilitzeu el botó de definició per seleccionar capes",
    "addLayerButton": "Defineix"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Configuració d'indicacions",
    "routeServiceUrl": "Servei d'assignació de rutes",
    "buttonSet": "Defineix",
    "routeServiceUrlHintText": "Suggeriment: feu clic a \"Defineix\" per examinar i seleccionar un servei d'assignació de rutes",
    "directionLengthUnit": "Unitats de longitud d'indicació",
    "unitsForRouteHintText": "Suggeriment: s'utilitza per visualitzar les unitats de la ruta",
    "selectRouteSymbol": "Seleccioneu el símbol per visualitzar la ruta",
    "routeSymbolHintText": "Suggeriment: s'utilitza per visualitzar el símbol de línia de la ruta",
    "routingDisabledMsg": "Per habilitar les indicacions, assegureu-vos que l'assignació de rutes estigui habilitada a l'element a la configuració de l'aplicació.",
    "enableDirectionLabel": "Habilita les indicacions",
    "enableDirectionText": "Suggeriment: activeu aquesta opció per habilitar les indicacions al widget"
  },
  "symbologySetting": {
    "symbologySettingTabTitle": "Configuració de simbologia",
    "addSymbologyBtnLabel": "Afegeix símbols nous",
    "layerNameTitle": "Nom de la capa",
    "fieldTitle": "Camp",
    "valuesTitle": "Valors",
    "symbolTitle": "Símbol",
    "actionsTitle": "Accions",
    "invalidConfigMsg": "Camp duplicat: ${fieldName} per a la capa ${layerName}"
  },
  "filterSetting": {
    "filterSettingTabTitle": "Configuració del filtre",
    "addTaskTip": "Afegiu un o més filtres a les capes de cerca seleccionades i configureu els paràmetres de cadascun.",
    "enableMapFilter": "Elimineu el filtre de la capa predefinida del mapa.",
    "newFilter": "Filtre nou",
    "filterExpression": "Expressió de filtre",
    "layerDefaultSymbolTip": "Utilitza el símbol per defecte de la capa",
    "uploadImage": "Puja una imatge",
    "selectLayerTip": "Seleccioneu una capa.",
    "setTitleTip": "Definiu un títol.",
    "noTasksTip": "No hi ha cap filtre configurat. Feu clic a \"${newFilter}\" per afegir-ne un de nou.",
    "collapseFiltersTip": "Redueix les expressions de filtre (si n'hi ha) quan s'obri el widget",
    "groupFiltersTip": "Agrupa els filtres per capa",
    "infoTab": "Informació",
    "expressionsTab": "Expressions",
    "optionsTab": "Opcions",
    "autoApplyWhenWidgetOpen": "Aplica aquest filtre quan s'obri el widget",
    "expandFiltersOnLoad": "Expandeix els filtres en carregar el widget"
  },
  "networkServiceChooser": {
    "arcgislabel": "Afegeix des de l'ArcGIS Online",
    "serviceURLabel": "Afegeix una URL de servei",
    "routeURL": "URL de la ruta",
    "validateRouteURL": "Valida",
    "exampleText": "Exemple",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Especifiqueu un servei de rutes vàlid.",
    "rateLimitExceeded": "S'ha superat el límit de velocitat. Torneu a intentar-ho més tard.",
    "errorInvokingService": "El nom d'usuari o la contrasenya són incorrectes."
  },
  "errorStrings": {
    "bufferErrorString": "Introduïu un valor numèric vàlid.",
    "selectLayerErrorString": "Seleccioneu les capes que s 'han de cercar.",
    "invalidDefaultValue": "La distància d'àrea d'influència per defecte no pot estar en blanc. Especifiqueu la distància d'àrea d'influència.",
    "invalidMaximumValue": "La distància d'àrea d'influència màxima no pot estar en blanc. Especifiqueu la distància d'àrea d'influència.",
    "defaultValueLessThanMax": "Especifiqueu la distància d'àrea d'influència per defecte dins del límit màxim",
    "defaultBufferValueGreaterThanOne": "La distància d'àrea d'influència per defecte no pot ser menor que 0",
    "maximumBufferValueGreaterThanOne": "Especifiqueu una distància d'àrea d'influència màxima més gran que 0",
    "invalidMaximumResultCountValue": "Especifiqueu un valor vàlid per al recompte de resultats màxim",
    "invalidSearchSources": "Configuració de l'origen de la cerca no vàlida"
  },
  "symbolPickerPreviewText": "Visualització prèvia:"
});