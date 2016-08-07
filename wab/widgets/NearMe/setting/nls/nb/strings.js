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
      "displayText": "Miles",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilometer",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Fot",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Meter",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Søkeinnstillinger",
    "defaultBufferDistanceLabel": "Angi standard bufferavstand",
    "maxBufferDistanceLabel": "Angi maksimal bufferavstand",
    "bufferDistanceUnitLabel": "Enheter for bufferavstand",
    "defaultBufferHintLabel": "Hint: Angi standardverdi for bufferglidebryteren",
    "maxBufferHintLabel": "Hint: Angi maksimumsverdi for bufferglidebryteren",
    "bufferUnitLabel": "Hint: Angi enhet for oppretting av buffer",
    "selectGraphicLocationSymbol": "Adresse- eller lokasjonssymbol",
    "graphicLocationSymbolHintText": "Hint: Symbol for adresse det er søkt etter, eller lokasjon det er klikket på.",
    "fontColorLabel": "Velg skriftfarge for søkeresultater",
    "fontColorHintText": "Hint: Skriftfarge for søkeresultater",
    "zoomToSelectedFeature": "Zoom til det valgte geoobjektet",
    "zoomToSelectedFeatureHintText": "Hint: Zoom til det valgte geoobjektet i stedet for bufferen",
    "intersectSearchLocation": "Returner kryssende polygon(er)",
    "intersectSearchLocationHintText": "Hint: Returner  polygon(er) som inneholder lokasjonen det er søkt etter, i stedet for polygoner i bufferen",
    "bufferVisibilityLabel": "Angi buffersynlighet",
    "bufferVisibilityHintText": "Hint: Bufferen vises i kartet",
    "bufferColorLabel": "Angi buffersymbol",
    "bufferColorHintText": "Hint: Velg farge og gjennomsiktighet for buffer",
    "searchLayerResultLabel": "Tegn kun resultater for valgt lag",
    "searchLayerResultHint": "Hint: Kun laget som er valgt i søkeresultatene tegnes på kartet"
  },
  "layerSelector": {
    "selectLayerLabel": "Velg et eller flere søkelag",
    "layerSelectionHint": "Hint: Bruk Angi-knappen til å velge et eller flere lag",
    "addLayerButton": "Angi"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Innstillinger for veibeskrivelser",
    "routeServiceUrl": "Rutetjeneste",
    "buttonSet": "Angi",
    "routeServiceUrlHintText": "Hint: Klikk på Angi for å bla gjennom og velge en rutetjeneste",
    "directionLengthUnit": "Lengdeenheter for rutebeskrivelse",
    "unitsForRouteHintText": "Hint: Brukes til å vise enheter for rute",
    "selectRouteSymbol": "Velg symbol for rutevisning",
    "routeSymbolHintText": "Hint: Brukes til å vise linjesymbol for ruten",
    "routingDisabledMsg": "Kontroller at ruteberegning er aktivert i ArcGIS Online-elementet hvis du vil aktivere rutebeskrivelser."
  },
  "networkServiceChooser": {
    "arcgislabel": "Legg til fra ArcGIS Online",
    "serviceURLabel": "Legg til tjeneste-URL",
    "routeURL": "Rute-URL",
    "validateRouteURL": "Valider",
    "exampleText": "Eksempel",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Angi en gyldig rutetjeneste",
    "rateLimitExceeded": "Hastighetsbegrensningen er overskredet. Prøv på nytt senere.",
    "errorInvokingService": "Brukernavnet eller passordet er feil."
  },
  "errorStrings": {
    "bufferErrorString": "Angi en gyldig numerisk verdi.",
    "selectLayerErrorString": "Velg laget eller lagene det skal søkes i.",
    "invalidDefaultValue": "Standard bufferavstand kan ikke være tom. Angi bufferavstanden.",
    "invalidMaximumValue": "Maksimum bufferavstand kan ikke være tom. Angi bufferavstanden.",
    "defaultValueLessThanMax": "Angi standard bufferavstand med maksimumsgrensen",
    "defaultBufferValueGreaterThanZero": "Du må angi en standard bufferavstand som er høyere enn 0",
    "maximumBufferValueGreaterThanZero": "Du må angi en maksimum bufferavstand som er høyere enn 0"
  },
  "symbolPickerPreviewText": "Forhåndsvisning:"
});