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
        displayText: "Jūdzes",
        acronym: "jūdzes"
      },
      kilometers: {
        displayText: "Kilometri",
        acronym: "km"
      },
      feet: {
        displayText: "Pēdas",
        acronym: "pēdas"
      },
      meters: {
        displayText: "Metri",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Meklēšanas iestatījumi", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Iestatīt noklusējuma buferzonas attāluma vērtību", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Iestatīt maksimālo buferzonas attāluma vērtību elementu meklēšanai", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Buferzonas attāluma vienības", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Padoms. Izmantojiet, lai iestatītu buferzonas noklusējuma vērtību", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Padoms. Izmantojiet, lai iestatītu buferzonas maksimālo vērtību", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Padoms. Definējiet vienību buferzonas izveidei", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Adreses vai izvietojuma simbols", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Padoms. Meklētas adreses vai noklikšķināta izvietojuma simbols", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Izvēlēties meklēšanas rezultātu fonta krāsu", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Padoms. Meklēšanas rezultātu fonta krāsa" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Atlasīt meklēšanas slāni(ņus)", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Padoms. Lai izvēlētos slāni(ņus), izmantojiet iestatīšanas pogu", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Kopa", //Shown as a button text to add the layer for search
      okButton: "Labi", // shown as a button text for layer selector popup
      cancelButton: "Atcelt" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Virziena iestatījumi", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Maršruta pakalpojums", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Ceļošanas režīma pakalpojums", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Kopa", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Padoms. Lai pārlūkotu un izvēlētos maršruta pakalpojumu, noklikšķiniet uz Iestatīt", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Virziena garuma vienības", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Padoms. Izmanto maršruta vienību rādīšanai", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Izvēlēties maršruta rādīšanas simbolu", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Padoms. Izmanto, lai parādītu maršruta līnijas simbolu", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Padoms. Lai pārlūkotu un izvēlētos ceļojuma režīma pakalpojumu, noklikšķiniet uz Iestatīt", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Norādiet derīgu ceļošanas režīma pakalpojumu ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Lai aktivizētu virzienus, ArcGIS Online elementā ir jābūt aktivizētai maršrutēšanai." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Pievienot no ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Pievienot pakalpojuma vietrādi URL", // shown as a label in route service configuration panel to add service url
      routeURL: "Maršruta URL", // shown as a label in route service configuration panel
      validateRouteURL: "Validēt", // shown as a button text in route service configuration panel to validate url
      exampleText: "Piemērs", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "Labi", // shown as a button text for route service configuration panel
      cancelButton: "Atcelt", // shown as a button text for route service configuration panel
      nextButton: "Tālāk", // shown as a button text for route service configuration panel
      backButton: "Atpakaļ", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Norādiet derīgu maršruta pakalpojumu." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Ievadiet skaitlisku vērtību.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Izvēlieties slāni(ņus), kur meklēt.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Noklusējuma buferzonas attālums nedrīkst būt tukšs. Norādiet buferzonas attālumu", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Maksimālais buferzonas attālums nedrīkst būt tukšs. Norādiet buferzonas attālumu", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Norādiet noklusējuma buferzonas attālumu, nepārsniedzot maksimālo ierobežojumu", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Norādiet noklusējuma buferzonas attālumu, kas ir lielāks par 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Norādiet maksimālo buferzonas attālumu, kas ir lielāks par 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Priekšskatījums:"
  })
);