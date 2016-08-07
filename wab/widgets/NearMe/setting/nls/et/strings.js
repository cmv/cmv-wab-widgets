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
      "displayText": "Miili",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilomeetrit",
      "acronym": "m"
    },
    "feet": {
      "displayText": "Jalga",
      "acronym": "jl"
    },
    "meters": {
      "displayText": "Meetrit",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Otsingu seaded",
    "defaultBufferDistanceLabel": "Määra puhvri vaikeulatus",
    "maxBufferDistanceLabel": "Määra puhvri maksimumulatus",
    "bufferDistanceUnitLabel": "Puhvri ulatuse ühikud",
    "defaultBufferHintLabel": "Vihje: määrake puhvri liuguri vaikeväärtus",
    "maxBufferHintLabel": "Vihje: määrake puhvri liuguri maksimumväärtus",
    "bufferUnitLabel": "Vihje: määratlege puhvri loomise ühik",
    "selectGraphicLocationSymbol": "Aadressi või asukoha sümbol",
    "graphicLocationSymbolHintText": "Vihje: otsitud aadressi või klõpsatud asukoha sümbol",
    "fontColorLabel": "Vali otsingutulemuste fondi värv",
    "fontColorHintText": "Vihje: otsingutulemuste fondi värv",
    "zoomToSelectedFeature": "Suumi valitud objektile",
    "zoomToSelectedFeatureHintText": "Vihje: suumige puhvri asemel valitud objektile",
    "intersectSearchLocation": "Tagasta lõikuvad polügoonid",
    "intersectSearchLocationHintText": "Vihje: puhvris asuvate polügoonide asemel tagastatakse otsitud asukohta sisaldavad polügoonid",
    "bufferVisibilityLabel": "Määra puhvri nähtavus",
    "bufferVisibilityHintText": "Vihje: puhver kuvatakse kaardil",
    "bufferColorLabel": "Määra puhvri sümbol",
    "bufferColorHintText": "Vihje: valige puhvri värv ja läbipaistvus",
    "searchLayerResultLabel": "Joonista ainult valitud kihi tulemused",
    "searchLayerResultHint": "Vihje: kaardile joonistatakse ainult otsingutulemustes valitud kiht"
  },
  "layerSelector": {
    "selectLayerLabel": "Vali otsingukiht (-kihid)",
    "layerSelectionHint": "Vihje: kasutage kihi (kihtide) valimiseks nuppu Määra",
    "addLayerButton": "Määra"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Teejuhiste seaded",
    "routeServiceUrl": "Marsruutimisteenus",
    "buttonSet": "Määra",
    "routeServiceUrlHintText": "Vihje: klõpsake teekonnajuhiste teenuse sirvimiseks ja valimiseks käsku â€˜Määraâ€™.",
    "directionLengthUnit": "Teejuhise pikkusühikud",
    "unitsForRouteHintText": "Vihje: kasutatakse marsruudi ühikute kuvamiseks",
    "selectRouteSymbol": "Vali marsruudi kuvamiseks sümbol",
    "routeSymbolHintText": "Vihje: kasutatakse marsruudi joonsümboli kuvamiseks",
    "routingDisabledMsg": "Enne teejuhiste lubamist veenduge, et marsruutimine on ArcGIS Online'i üksuses lubatud."
  },
  "networkServiceChooser": {
    "arcgislabel": "Lisa ArcGIS Online’ist",
    "serviceURLabel": "Lisa teenuse URL",
    "routeURL": "Marsruudi URL",
    "validateRouteURL": "Valideeri",
    "exampleText": "Näide",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Määrake sobiv marsruuditeenus.",
    "rateLimitExceeded": "Liikluse piirmäär on ületatud. Proovige hiljem uuesti.",
    "errorInvokingService": "Kasutajanimi või parool on vale."
  },
  "errorStrings": {
    "bufferErrorString": "Sisestage sobiv numbriline väärtus.",
    "selectLayerErrorString": "Valige otsingukiht (-kihid).",
    "invalidDefaultValue": "Puhvri vaikeulatuse väli ei tohi olla tühi. Määrake puhvri ulatus",
    "invalidMaximumValue": "Puhvri maksimumulatuse väli ei tohi olla tühi. Määrake puhvri ulatus",
    "defaultValueLessThanMax": "Määrake puhvri vaikeulatus limiidi piires",
    "defaultBufferValueGreaterThanZero": "Määrake puhvri vaikeulatus, mis on suurem kui 0",
    "maximumBufferValueGreaterThanZero": "Määrake puhvri maksimumulatus, mis on suurem kui 0"
  },
  "symbolPickerPreviewText": "Eelvaade:"
});