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
      "displayText": "Mijl",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilometer",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Voet",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Meter",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Zoekinstellingen",
    "defaultBufferDistanceLabel": "Stel de standaard bufferafstand in",
    "maxBufferDistanceLabel": "Stel de maximale bufferafstand in",
    "bufferDistanceUnitLabel": "Bufferafstandseenheden",
    "defaultBufferHintLabel": "Tip: stel de standaardwaarde voor de bufferschuif in",
    "maxBufferHintLabel": "Tip: stel de maximale waarde voor de bufferschuif in",
    "bufferUnitLabel": "Tip: eenheid definiëren voor het creëren van een buffer",
    "selectGraphicLocationSymbol": "Adres of locatiesymbool",
    "graphicLocationSymbolHintText": "Tip: symbool voor gezocht adres of aangeklikte locatie",
    "fontColorLabel": "Selecteer fontkleur voor zoekresultaten",
    "fontColorHintText": "Tip: fontkleur van zoekresultaten",
    "zoomToSelectedFeature": "Zoomen naar het geselecteerde object",
    "zoomToSelectedFeatureHintText": "Tip: zoomen naar het geselecteerde object in plaats van de buffer",
    "intersectSearchLocation": "Kruisende polygo(o)n(en) retourneren",
    "intersectSearchLocationHintText": "Tip: Retourneer polygo(o)n(en) die de gezochte locatie bevatten in plaats van polygonen binnen de buffer",
    "bufferVisibilityLabel": "Stel de zichtbaarheid van de buffer in",
    "bufferVisibilityHintText": "Tip: De buffer wordt weergegeven op de kaart",
    "bufferColorLabel": "Stel het symbool van de buffer in",
    "bufferColorHintText": "Tip: Selecteer de kleur en transparantie van de buffer",
    "searchLayerResultLabel": "Teken alleen geselecteerde laagresultaten",
    "searchLayerResultHint": "Tip: Alleen de geselecteerde laag in de zoekresultaten wordt op de kaart getekend"
  },
  "layerSelector": {
    "selectLayerLabel": "Zoekla(a)g(en) selecteren",
    "layerSelectionHint": "Tip: gebruik de instelknop om la(a)g(en) te selecteren",
    "addLayerButton": "Instellen"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Instellingen routebeschrijving",
    "routeServiceUrl": "Routingservice",
    "buttonSet": "Instellen",
    "routeServiceUrlHintText": "Tip: Klik op â€˜Setâ€™ om te bladeren en selecteer een routingservice",
    "directionLengthUnit": "Lengte-eenheden richting",
    "unitsForRouteHintText": "Tip: gebruikt voor de weergave van eenheden voor route",
    "selectRouteSymbol": "Selecteer symbool om de route weer te geven",
    "routeSymbolHintText": "Tip: gebruikt voor de weergave van lijnsymbool van de route",
    "routingDisabledMsg": "Zorg er om richtingen in te schakelen voor dat de routing is ingeschakeld in het ArcGIS Online item."
  },
  "networkServiceChooser": {
    "arcgislabel": "Toevoegen vanuit ArcGIS Online",
    "serviceURLabel": "Service-URL toevoegen",
    "routeURL": "Route-URL",
    "validateRouteURL": "Valideren",
    "exampleText": "Voorbeeld",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Geef een geldige routeservice op.",
    "rateLimitExceeded": "Tarieflimiet overschreden. Probeer het later nogmaals.",
    "errorInvokingService": "Gebruikersnaam of wachtwoord is onjuist."
  },
  "errorStrings": {
    "bufferErrorString": "Voer een geldige numerieke waarde in.",
    "selectLayerErrorString": "Selecteer la(a)g(en) om te zoeken.",
    "invalidDefaultValue": "Standaard bufferafstand mag niet leeg zijn. Geef de bufferafstand op",
    "invalidMaximumValue": "Maximale bufferafstand mag niet leeg zijn. Geef de bufferafstand op",
    "defaultValueLessThanMax": "Geef de standaardbufferafstand op binnen de bovengrens",
    "defaultBufferValueGreaterThanZero": "Geef de standaardbufferafstand groter dan 0 op",
    "maximumBufferValueGreaterThanZero": "Geef de maximale bufferafstand groter dan 0 op"
  },
  "symbolPickerPreviewText": "Voorbeeld:"
});