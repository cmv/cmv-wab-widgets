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
define(
   ({
    units: { // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit) and acronym in feature list
      miles: {
        displayText: "Mile",
        acronym: "mi."
      },
      kilometers: {
        displayText: "Kilometri",
        acronym: "km"
      },
      feet: {
        displayText: "Ft",
        acronym: "ft"
      },
      meters: {
        displayText: "Metri",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Setări căutare", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Setare valoare implicită distanţă buffer", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Setare valoare maximă distanţă buffer pentru căutarea obiectelor spaţiale", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Unităţi distanţă buffer", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Sugestie: Utilizaţi pentru a seta valoarea implicită pentru un buffer", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Sugestie: Utilizaţi pentru a seta valoarea maximă pentru un buffer", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Sugestie: Definiţi unităţile pentru crearea bufferului", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Simbol adresă sau locaţie", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Sugestie: Simbol pentru adresa căutată sau locaţia apăsată", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Selectare culoare font pentru rezultatele căutării", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Sugestie: Culoarea fontului pentru rezultatele căutării" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Selectare straturi tematice", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Sugestie: Utilizaţi butonul de setare pentru selectarea straturilor tematice", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Setare", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Anulare" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Setări indicaţii de direcţie", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Serviciu de rute", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Serviciu mod de deplasare", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Setare", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Sugestie: Apăsaţi „Setare” pentru a răsfoi şi selecta un serviciu de rute", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unităţi de lungime pentru indicaţiile de direcţie", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Sugestie: Utilizaţi pentru afişarea unităţilor pentru rută", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Selectare simbol pentru afişarea rutei", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Sugestie: Utilizat pentru afişarea simbolului liniei rutei", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Sugestie: Apăsaţi „Setare” pentru a răsfoi şi selecta un Serviciu mod de deplasare", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Vă rugăm să specificaţi un serviciu mod de deplasare valid ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Pentru a activa indicaţiile de direcţie asiguraţi-vă că rutele sunt activate în elementul ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Adăugare din ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Adăugare URL serviciu", // shown as a label in route service configuration panel to add service url
      routeURL: "URL rută", // shown as a label in route service configuration panel
      validateRouteURL: "Validare", // shown as a button text in route service configuration panel to validate url
      exampleText: "Exemplu", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Anulare", // shown as a button text for route service configuration panel
      nextButton: "Următorul", // shown as a button text for route service configuration panel
      backButton: "Înapoi", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Vă rugăm să specificaţi un serviciu de rute valid." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Vă rugăm să introduceţi o valoare numerică validă.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Vă rugăm să selectaţi straturile tematice pentru căutare.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Distanţă implicită buffer nu poate fi goală. Vă rugăm să specificaţi o distanţă buffer", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Distanţă maximă buffer nu poate fi goală. Vă rugăm să specificaţi o distanţă buffer", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Vă rugăm să specificaţi distanţa implicită buffer în cadrul limitei maxime", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Vă rugăm să specificaţi distanţa implicită buffer mai mare decât 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Vă rugăm să specificaţi distanţa maximă buffer mai mare decât 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Previzualizare:"
  })
);