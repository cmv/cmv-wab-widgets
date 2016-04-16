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
        displayText: "Mylios",
        acronym: "myl."
      },
      kilometers: {
        displayText: "Kilometrai",
        acronym: "km"
      },
      feet: {
        displayText: "Pėdos",
        acronym: "pėdos"
      },
      meters: {
        displayText: "Metrai",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Paieškos nuostatos", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Nustatyti numatytąją buferio atstumo reikšmę", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Nustatyti maksimalią elementų paieškos buferio atstumo reikšmę", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Buferio atstumo vienetai", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Patarimas: naudokite numatytąjai buferio reikšmei nustatyti", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Patarimas: naudokite maksimaliai buferio reikšmei nustatyti", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Patarimas: nustatykite buferio kūrimo vienetą", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Adreso arba vietos simbolis", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Patarimas: ieškoto adreso arba spustelėtos vietos simbolis", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Pasirinkti paieškos rezultatų šrifto spalvą", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Patarimas: paieškos rezultatų šrifto spalva" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Pasirinkti paieškos sluoksnį (-ius)", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Patarimas: sluoksniui (-iams) pasirinkti naudokite nustatymo mygtuką", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Grupė", //Shown as a button text to add the layer for search
      okButton: "Gerai", // shown as a button text for layer selector popup
      cancelButton: "Atšaukti" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Krypties nustatymai", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Maršruto paslauga", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Kelionės režimo paslauga", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Grupė", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Patarimas: spustelėkite „Nustatyti“, jei norite naršyti ir pasirinkti maršruto paslaugą", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Krypties ilgio vienetai", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Patarimas: naudojama maršruto vienetams rodyti", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Pasirinkti maršruto rodymo simbolį", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Patarimas: naudojamas maršruto linijos simboliui rodyti", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Patarimas: spustelėkite „Nustatyti“, jei norite naršyti ir pasirinkti kelionės režimo paslaugą", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Nurodykite galiojančią kelionės režimo paslaugą ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Jei norite įjungti nuorodas, įsitikinkite, kad maršrutas įjungtas ArcGIS Online elemente." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Pridėti iš ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Pridėti paslaugos URL", // shown as a label in route service configuration panel to add service url
      routeURL: "Maršruto URL", // shown as a label in route service configuration panel
      validateRouteURL: "Tikrinti", // shown as a button text in route service configuration panel to validate url
      exampleText: "Pavyzdys", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "Gerai", // shown as a button text for route service configuration panel
      cancelButton: "Atšaukti", // shown as a button text for route service configuration panel
      nextButton: "Kitas", // shown as a button text for route service configuration panel
      backButton: "Atgal", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Nurodykite galiojančią maršruto paslaugą." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Įveskite leistiną skaitinę reikšmę.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Pasirinkite ieškos sluoksnį (-ius)", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Numatytasis buferio atstumas negali būti tuščias. Nurodykite buferio atstumą", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Maksimalus buferio atstumas negali būti tuščias. Nurodykite buferio atstumą", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Nurodykite numatytąjį buferio atstumą maksimaliose ribose", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Nurodykite numatytąjį buferio atstumą didesnį už 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Nurodykite maksimalų buferio atstumą didesnį už 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Peržiūra:"
  })
);