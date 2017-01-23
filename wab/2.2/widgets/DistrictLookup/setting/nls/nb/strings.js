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
    "miles": "Miles",
    "kilometers": "Kilometer",
    "feet": "Fot",
    "meters": "Meter"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Søkeinnstillinger",
    "buttonSet": "Angi",
    "selectLayersLabel": "Velg lag",
    "selectLayersHintText": "Hint: Brukes til å velge polygonlag og tilknyttet punktlag.",
    "selectPrecinctSymbolLabel": "Velg symbol for å utheve polygon",
    "selectGraphicLocationSymbol": "Adresse- eller lokasjonssymbol",
    "graphicLocationSymbolHintText": "Hint: Symbol for adresse det er søkt etter, eller lokasjon det er klikket på.",
    "precinctSymbolHintText": "Hint: Brukes til å vise enheter for valgt polygon",
    "selectColorForPoint": "Velg farge for utheving av punkt",
    "selectColorForPointHintText": "Hint: Brukes til å vise uthevingsfarge for valgt punkt"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Velg polygonlag",
    "selectPolygonLayerHintText": "Hint: Brukes til å velge polygonlag.",
    "selectRelatedPointLayerLabel": "Velg punktlag knyttet til polygonlag",
    "selectRelatedPointLayerHintText": "Hint: Brukes til å velge punktlaget som er tilknyttet polygonlaget",
    "polygonLayerNotHavingRelatedLayer": "Velg et polygonlag som har et tilknyttet punktlag.",
    "errorInSelectingPolygonLayer": "Velg et polygonlag som har et tilknyttet punktlag.",
    "errorInSelectingRelatedLayer": "Velg punktlag knyttet til polygonlag."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Innstillinger for veibeskrivelser",
    "routeServiceUrl": "Rutetjeneste",
    "buttonSet": "Angi",
    "routeServiceUrlHintText": "Hint: Klikk på Angi for å bla gjennom og velge en rutetjeneste for nettverksanalyse",
    "directionLengthUnit": "Lengdeenheter for rutebeskrivelse",
    "unitsForRouteHintText": "Hint: Brukes til å vise rapporterte enheter for rute",
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
  "symbolPickerPreviewText": "Forhåndsvisning:"
});