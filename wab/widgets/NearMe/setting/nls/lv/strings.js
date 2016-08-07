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
      "displayText": "Jūdzes",
      "acronym": "jūdzes"
    },
    "kilometers": {
      "displayText": "Kilometri",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Pēdas",
      "acronym": "pēdas"
    },
    "meters": {
      "displayText": "Metri",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Meklēšanas iestatījumi",
    "defaultBufferDistanceLabel": "Iestatīt noklusējuma buferzonas attālumu",
    "maxBufferDistanceLabel": "Iestatīt maksimālo buferzonas attālumu",
    "bufferDistanceUnitLabel": "Buferzonas attāluma vienības",
    "defaultBufferHintLabel": "Padoms. Iestatiet buferzonas slīdņa noklusējuma vērtību",
    "maxBufferHintLabel": "Padoms. Iestatiet buferzonas slīdņa maksimālo vērtību",
    "bufferUnitLabel": "Padoms. Definējiet vienību buferzonas izveidei",
    "selectGraphicLocationSymbol": "Adreses vai izvietojuma simbols",
    "graphicLocationSymbolHintText": "Padoms. Meklētas adreses vai noklikšķināta izvietojuma simbols",
    "fontColorLabel": "Izvēlēties meklēšanas rezultātu fonta krāsu",
    "fontColorHintText": "Padoms. Meklēšanas rezultātu fonta krāsa",
    "zoomToSelectedFeature": "Mērogmainīt līdz atlasītajam elementam",
    "zoomToSelectedFeatureHintText": "Padoms. Buferzonas vietā mērogmainiet līdz atlasītajam elementam",
    "intersectSearchLocation": "Atgriezt šķērsojošo(-s) laukumu(-s)",
    "intersectSearchLocationHintText": "Padoms. Atgrieziet laukumu(-s), kuros ietverts meklētais izvietojums, nevis laukumus ar buferzonu",
    "bufferVisibilityLabel": "Iestatīt buferzonas redzamību",
    "bufferVisibilityHintText": "Padoms. Buferzona tiks parādīta kartē",
    "bufferColorLabel": "Iestatīt buferzonas simbolu",
    "bufferColorHintText": "Padoms. Atlasiet krāsu un buferzonas caurspīdīgumu",
    "searchLayerResultLabel": "Zīmēt tikai atlasītā slāņa rezultātus",
    "searchLayerResultHint": "Padoms. Kartē tiks zīmēts tikai atlasītais slānis meklēšanas rezultātos"
  },
  "layerSelector": {
    "selectLayerLabel": "Atlasīt meklēšanas slāni(ņus)",
    "layerSelectionHint": "Padoms. Lai izvēlētos slāni(ņus), izmantojiet iestatīšanas pogu",
    "addLayerButton": "Kopa"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Virzienu iestatījumi",
    "routeServiceUrl": "Maršruta pakalpojums",
    "buttonSet": "Kopa",
    "routeServiceUrlHintText": "Padoms. Noklikšķiniet uz â€˜Iestatītâ€™, lai pārlūkotu un atlasītu maršrutēšanas pakalpojumu",
    "directionLengthUnit": "Virziena garuma vienības",
    "unitsForRouteHintText": "Padoms. Izmanto maršruta vienību rādīšanai",
    "selectRouteSymbol": "Izvēlēties maršruta rādīšanas simbolu",
    "routeSymbolHintText": "Padoms. Izmanto, lai parādītu maršruta līnijas simbolu",
    "routingDisabledMsg": "Lai aktivizētu virzienus, ArcGIS Online elementā ir jābūt aktivizētai maršrutēšanai."
  },
  "networkServiceChooser": {
    "arcgislabel": "Pievienot no ArcGIS Online",
    "serviceURLabel": "Pievienot pakalpojuma vietrādi URL",
    "routeURL": "Maršruta URL",
    "validateRouteURL": "Validēt",
    "exampleText": "Piemērs",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Norādiet derīgu maršruta pakalpojumu.",
    "rateLimitExceeded": "Pārsniegts ātruma ierobežojums. Lūduz, vēlāk mēģiniet vēlreiz.",
    "errorInvokingService": "Nepareizs lietotājvārds vai parole."
  },
  "errorStrings": {
    "bufferErrorString": "Ievadiet skaitlisku vērtību.",
    "selectLayerErrorString": "Izvēlieties slāni(ņus), kur meklēt.",
    "invalidDefaultValue": "Noklusējuma buferzonas attālums nedrīkst būt tukšs. Norādiet buferzonas attālumu",
    "invalidMaximumValue": "Maksimālais buferzonas attālums nedrīkst būt tukšs. Norādiet buferzonas attālumu",
    "defaultValueLessThanMax": "Norādiet noklusējuma buferzonas attālumu, nepārsniedzot maksimālo ierobežojumu",
    "defaultBufferValueGreaterThanZero": "Norādiet noklusējuma buferzonas attālumu, kas ir lielāks par 0",
    "maximumBufferValueGreaterThanZero": "Norādiet maksimālo buferzonas attālumu, kas ir lielāks par 0"
  },
  "symbolPickerPreviewText": "Priekšskatījums:"
});