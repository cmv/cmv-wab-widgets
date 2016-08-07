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
      "displayText": "Fod",
      "acronym": "fod"
    },
    "meters": {
      "displayText": "Meter",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Søgeindstillinger",
    "defaultBufferDistanceLabel": "Angiv standardbufferafstand",
    "maxBufferDistanceLabel": "Angiv maksimal bufferafstand",
    "bufferDistanceUnitLabel": "Bufferafstandsenheder",
    "defaultBufferHintLabel": "Tip: Angiv standardværdi for bufferskyder",
    "maxBufferHintLabel": "Tip: Angiv maksimal værdi for bufferskyder",
    "bufferUnitLabel": "Tip: Definér enhed for oprettelse af en buffer",
    "selectGraphicLocationSymbol": "Adresse- eller positionssymbol",
    "graphicLocationSymbolHintText": "Tip: Symbol for søgt adresse eller klikket position",
    "fontColorLabel": "Vælg skrifttypefarve for søgeresultater",
    "fontColorHintText": "Tip: Skrifttypefarve for søgeresultater",
    "zoomToSelectedFeature": "Zoom til det valgte objekt",
    "zoomToSelectedFeatureHintText": "Tip: Zoom til det valgte objekt i stedet for til bufferen",
    "intersectSearchLocation": "Returnér polygon(er), der gennemskærer hinanden",
    "intersectSearchLocationHintText": "Tip: Returnér polygon(er), der indeholder den søgte position frem for polygoner inden for bufferen",
    "bufferVisibilityLabel": "Indstil buffersynlighed",
    "bufferVisibilityHintText": "Tip: Bufferen vil blive vist på kortet",
    "bufferColorLabel": "Indstil buffersymbol",
    "bufferColorHintText": "Tip: Vælg bufferens farve og gennemsigtighed",
    "searchLayerResultLabel": "Tegn kun resultater fra valgte lag",
    "searchLayerResultHint": "Tip: Kun de valgte lag i søgeresultaterne vil blive tegnet på kortet"
  },
  "layerSelector": {
    "selectLayerLabel": "Vælg søgelag",
    "layerSelectionHint": "Tip: Brug indstillingsknappen til at vælge lag(ene)",
    "addLayerButton": "Indstil"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Indstillinger for kørselsvejledninger",
    "routeServiceUrl": "Rutetjeneste",
    "buttonSet": "Indstil",
    "routeServiceUrlHintText": "Tip: Klik på Indstil for at gå til og vælge en rutetjeneste",
    "directionLengthUnit": "Længdeenheder for kørselsvejledning",
    "unitsForRouteHintText": "Tip: Bruges til at vise enheder for ruten",
    "selectRouteSymbol": "Vælg symbol for visning af rute",
    "routeSymbolHintText": "Tip: Brug visningslinjesymbolet for ruten",
    "routingDisabledMsg": "For at aktivere kørselsvejledninger skal du sørge for, at ruteplanlægning er aktiveret i ArcGIS Online-elementet."
  },
  "networkServiceChooser": {
    "arcgislabel": "Tilføj fra ArcGIS Online",
    "serviceURLabel": "Tilføj tjeneste-URL",
    "routeURL": "Rute-URL",
    "validateRouteURL": "Bekræft",
    "exampleText": "Eksempel",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Angiv en gyldig rutetjeneste.",
    "rateLimitExceeded": "Begrænsning overskredet. Prøv igen senere.",
    "errorInvokingService": "Brugernavn eller adgangskode er forkert."
  },
  "errorStrings": {
    "bufferErrorString": "Angiv en gyldig numerisk værdi.",
    "selectLayerErrorString": "Vælg de lag, der skal søges i.",
    "invalidDefaultValue": "Standardbufferafstand kan ikke være tom. Angiv bufferafstanden",
    "invalidMaximumValue": "Maksimumbufferafstand kan ikke være tom. Angiv bufferafstanden",
    "defaultValueLessThanMax": "Angiv standardbufferafstand inden for maksimumgrænsen",
    "defaultBufferValueGreaterThanZero": "Angiv en standardbufferafstand, der er større end 0",
    "maximumBufferValueGreaterThanZero": "Angiv en maksimumbufferafstand, der er større end 0"
  },
  "symbolPickerPreviewText": "Forhåndsvisning:"
});