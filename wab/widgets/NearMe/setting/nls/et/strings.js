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
        displayText: "Miili",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilomeetrit",
        acronym: "m"
      },
      feet: {
        displayText: "Jalga",
        acronym: "jl"
      },
      meters: {
        displayText: "Meetrit",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Otsingu seaded", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Määra puhvri ulatuse vaikeväärtus", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Määra puhvri ulatuse maksimumväärtus objektide otsimiseks", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Puhvri ulatuse ühikud", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Vihje: kasutage puhvri vaikeväärtuse määramiseks", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Vihje: kasutage puhvri maksimumväärtuse määramiseks", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Vihje: määratlege puhvri loomise ühik", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Aadressi või asukoha sümbol", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Vihje: otsitud aadressi või klõpsatud asukoha sümbol", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Vali otsingutulemuste fondi värv", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Vihje: otsingutulemuste fondi värv" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Vali otsingukiht (-kihid)", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Vihje: kasutage kihi (kihtide) valimiseks nuppu Määra", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Määra", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Tühista" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Teejuhiste seaded", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Marsruutimisteenus", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Sõidurežiimi teenus", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Määra", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Vihje: marsruutimisteenuse sirvimiseks ja valimiseks klõpsake nuppu ‘Määra’", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Teejuhise pikkusühikud", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Vihje: kasutatakse marsruudi ühikute kuvamiseks", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Vali marsruudi kuvamiseks sümbol", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Vihje: kasutatakse marsruudi joonsümboli kuvamiseks", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Vihje: sõidurežiimi teenuse sirvimiseks ja valimiseks klõpsake nuppu ‘Määra’", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Määrake sobiv sõidurežiimi teenus ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Enne teejuhiste lubamist veenduge, et marsruutimine on ArcGIS Online\'i üksuses lubatud." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Lisa ArcGIS Online’ist", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Lisa teenuse URL", // shown as a label in route service configuration panel to add service url
      routeURL: "Marsruudi URL", // shown as a label in route service configuration panel
      validateRouteURL: "Valideeri", // shown as a button text in route service configuration panel to validate url
      exampleText: "Näide", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Tühista", // shown as a button text for route service configuration panel
      nextButton: "Edasi", // shown as a button text for route service configuration panel
      backButton: "Tagasi", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Määrake sobiv marsruuditeenus." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Sisestage sobiv numbriline väärtus.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Valige otsingukiht (-kihid).", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Puhvri vaikeulatuse väli ei tohi olla tühi. Määrake puhvri ulatus", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Puhvri maksimumulatuse väli ei tohi olla tühi. Määrake puhvri ulatus", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Määrake puhvri vaikeulatus limiidi piires", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Määrake puhvri vaikeulatus, mis on suurem kui 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Määrake puhvri maksimumulatus, mis on suurem kui 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Eelvaade:"
  })
);