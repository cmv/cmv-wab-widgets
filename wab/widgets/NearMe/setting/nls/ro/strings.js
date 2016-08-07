/*global define*/
///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 Esri. All Rights Reserved.
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
      "displayText": "Mile",
      "acronym": "mi."
    },
    "kilometers": {
      "displayText": "Kilometri",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Ft",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Metri",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Setări căutare",
    "defaultBufferDistanceLabel": "Setare distanţă buffer implicită",
    "maxBufferDistanceLabel": "Setare distanţă buffer maximă",
    "bufferDistanceUnitLabel": "Unităţi distanţă buffer",
    "defaultBufferHintLabel": "Sugestie: Setaţi valoarea implicită pentru glisorul de buffer",
    "maxBufferHintLabel": "Sugestie: Setaţi valoarea maximă pentru glisorul de buffer",
    "bufferUnitLabel": "Sugestie: Definiţi unităţile pentru crearea bufferului",
    "selectGraphicLocationSymbol": "Simbol adresă sau locaţie",
    "graphicLocationSymbolHintText": "Sugestie: Simbol pentru adresa căutată sau locaţia apăsată",
    "fontColorLabel": "Selectare culoare font pentru rezultatele căutării",
    "fontColorHintText": "Sugestie: Culoarea fontului pentru rezultatele căutării",
    "zoomToSelectedFeature": "Transfocaţi la obiectul spaţial selectat",
    "zoomToSelectedFeatureHintText": "Sugestie: Transfocaţi la obiectul spaţial selectat în locul bufferului",
    "intersectSearchLocation": "Se returnează poligoanele intersectate",
    "intersectSearchLocationHintText": "Sugestie: Returnaţi poligoanele care conţin locaţia căutată în locul poligoanelor din buffer",
    "bufferVisibilityLabel": "Setare vizibilitate buffer",
    "bufferVisibilityHintText": "Sugestie: Bufferul va fi afişat pe hartă",
    "bufferColorLabel": "Setaţi simbolul bufferului",
    "bufferColorHintText": "Sugestie: Selectaţi culoarea şi transparenţa bufferului",
    "searchLayerResultLabel": "Trasaţi numai rezultatele stratului tematic selectat",
    "searchLayerResultHint": "Sugestie: Pe hartă va fi trasat numai stratul tematic selectat din rezultatele de căutare"
  },
  "layerSelector": {
    "selectLayerLabel": "Selectare straturi tematice",
    "layerSelectionHint": "Sugestie: Utilizaţi butonul de setare pentru selectarea straturilor tematice",
    "addLayerButton": "Setare"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Setări indicaţii de deplasare",
    "routeServiceUrl": "Serviciu de rute",
    "buttonSet": "Setare",
    "routeServiceUrlHintText": "Sugestie: Faceţi clic pe â€˜Setareâ€™ pentru a răsfoi şi selecta un serviciu de rute",
    "directionLengthUnit": "Unităţi de lungime pentru indicaţiile de direcţie",
    "unitsForRouteHintText": "Sugestie: Utilizaţi pentru afişarea unităţilor pentru rută",
    "selectRouteSymbol": "Selectare simbol pentru afişarea rutei",
    "routeSymbolHintText": "Sugestie: Utilizat pentru afişarea simbolului liniei rutei",
    "routingDisabledMsg": "Pentru a activa indicaţiile de direcţie asiguraţi-vă că rutele sunt activate în elementul ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Adăugare din ArcGIS Online",
    "serviceURLabel": "Adăugare URL serviciu",
    "routeURL": "URL rută",
    "validateRouteURL": "Validare",
    "exampleText": "Exemplu",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Vă rugăm să specificaţi un serviciu de rute valid.",
    "rateLimitExceeded": "Limita de rată a fost depăşită. Încercaţi din nou mai târziu.",
    "errorInvokingService": "Nume de utilizator sau parolă incorectă."
  },
  "errorStrings": {
    "bufferErrorString": "Vă rugăm să introduceţi o valoare numerică validă.",
    "selectLayerErrorString": "Vă rugăm să selectaţi straturile tematice pentru căutare.",
    "invalidDefaultValue": "Distanţă implicită buffer nu poate fi goală. Vă rugăm să specificaţi o distanţă buffer",
    "invalidMaximumValue": "Distanţă maximă buffer nu poate fi goală. Vă rugăm să specificaţi o distanţă buffer",
    "defaultValueLessThanMax": "Vă rugăm să specificaţi distanţa implicită buffer în cadrul limitei maxime",
    "defaultBufferValueGreaterThanZero": "Vă rugăm să specificaţi distanţa implicită buffer mai mare decât 0",
    "maximumBufferValueGreaterThanZero": "Vă rugăm să specificaţi distanţa maximă buffer mai mare decât 0"
  },
  "symbolPickerPreviewText": "Previzualizare:"
});