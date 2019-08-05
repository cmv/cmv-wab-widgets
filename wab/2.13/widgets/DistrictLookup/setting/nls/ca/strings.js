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
    "miles": "Milles",
    "kilometers": "Quilòmetres",
    "feet": "Peus",
    "meters": "Metres"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Configuració de cerca",
    "buttonSet": "Defineix",
    "selectLayersLabel": "Seleccioneu la capa",
    "selectLayersHintText": "Suggeriment: s'utilitza per seleccionar la capa del polígon i la seva capa de punts relacionada.",
    "selectPrecinctSymbolLabel": "Seleccioneu el símbol per ressaltar el polígon",
    "selectGraphicLocationSymbol": "Símbol d'adreça o ubicació",
    "graphicLocationSymbolHintText": "Suggeriment: símbol de l'adreça que s'ha cercat o la ubicació on s'ha fet clic",
    "precinctSymbolHintText": "Suggeriment: s'utilitza per mostrar el símbol del polígon seleccionat",
    "selectColorForPoint": "Trieu el color per marcar el punt",
    "selectColorForPointHintText": "Suggeriment: s'utilitza per mostrar el color de marcatge del punt seleccionat"
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
    "invalidUrlTip": "L'adreça URL ${URL} no és vàlida o no s'hi pot accedir.",
    "invalidSearchSources": "Configuració de l'origen de la cerca no vàlida"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Seleccioneu la capa de polígon",
    "selectPolygonLayerHintText": "Suggeriment: s'utilitza per seleccionar la capa de polígon.",
    "selectRelatedPointLayerLabel": "Seleccioneu la capa de punts relacionada amb la capa de polígon",
    "selectRelatedPointLayerHintText": "Suggeriment: s'utilitza per seleccionar la capa de punts relacionada amb la capa de polígon",
    "polygonLayerNotHavingRelatedLayer": "Seleccioneu una capa de polígon que tingui una capa de punts relacionada.",
    "errorInSelectingPolygonLayer": "Seleccioneu una capa de polígon que tingui una capa de punts relacionada.",
    "errorInSelectingRelatedLayer": "Seleccioneu una capa de punts relacionada amb la capa de polígon."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Configuració d'indicacions",
    "routeServiceUrl": "Servei d'assignació de rutes",
    "buttonSet": "Defineix",
    "routeServiceUrlHintText": "Suggeriment: feu clic a \"Defineix\" per examinar i seleccionar un servei d'assignació de rutes per a l'anàlisi de xarxa",
    "directionLengthUnit": "Unitats de longitud d'indicació",
    "unitsForRouteHintText": "Suggeriment: s'utilitza per visualitzar les unitats indicades per a la ruta",
    "selectRouteSymbol": "Seleccioneu el símbol per visualitzar la ruta",
    "routeSymbolHintText": "Suggeriment: s'utilitza per visualitzar el símbol de línia de la ruta",
    "routingDisabledMsg": "Per habilitar les indicacions, assegureu-vos que l'assignació de rutes estigui habilitada a l'element de l'ArcGIS Online.",
    "enableDirectionLabel": "Habilita les indicacions",
    "enableDirectionText": "Suggeriment: activeu aquesta opció per habilitar les indicacions al widget"
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
  "symbolPickerPreviewText": "Visualització prèvia:",
  "showToolToSelectLabel": "Botó Defineix la ubicació",
  "showToolToSelectHintText": "Suggeriment: proporciona un botó per definir la ubicació al mapa en lloc de definir sempre la ubicació quan es fa clic al mapa"
});