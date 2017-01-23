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
      "displayText": "Mailia",
      "acronym": "mailia"
    },
    "kilometers": {
      "displayText": "Kilometriä",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Jalkaa",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Metriä",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Hakuasetukset",
    "defaultBufferDistanceLabel": "Määritä puskurin oletusetäisyys",
    "maxBufferDistanceLabel": "Määritä puskurin enimmäisetäisyys",
    "bufferDistanceUnitLabel": "Puskurin etäisyysyksiköt",
    "defaultBufferHintLabel": "Vihje: määritä oletusarvo puskurin liukusäätimelle",
    "maxBufferHintLabel": "Vihje: määritä enimmäisarvo puskurin liukusäätimelle",
    "bufferUnitLabel": "Vihje: määrittää puskurin luonnin yksikön",
    "selectGraphicLocationSymbol": "Osoitteen tai sijainnin symboli",
    "graphicLocationSymbolHintText": "Vihje: haetun osoitteen tai napsautetun sijainnin symboli",
    "fontColorLabel": "Valitse hakutulosten fontin väri",
    "fontColorHintText": "Vihje: hakutulosten fontin väri",
    "zoomToSelectedFeature": "Tarkenna valittuun kohteeseen",
    "zoomToSelectedFeatureHintText": "Vihje: zoomaa valittuun kohteeseen puskurin sijaan",
    "intersectSearchLocation": "Palauta leikkaavat aluekohteet",
    "intersectSearchLocationHintText": "Vihje: palauta aluekohteet, jotka sisältävät haetun sijainnin puskurissa olevien aluekohteiden sijaan",
    "bufferVisibilityLabel": "Määritä puskurin näkyvyys",
    "bufferVisibilityHintText": "Vihje: puskuri näytetään kartalla",
    "bufferColorLabel": "Määritä puskurin symboli",
    "bufferColorHintText": "Vihje: valitse puskurin väri ja läpinäkyvyys",
    "searchLayerResultLabel": "Piirrä vain valitut karttatason tulokset",
    "searchLayerResultHint": "Vihje: kartalle piirretään vain valittu hakutulosten karttataso"
  },
  "layerSelector": {
    "selectLayerLabel": "Valitse hakukarttataso(t)",
    "layerSelectionHint": "Vihje: käytä Määritä-painiketta karttatasojen valintaan",
    "addLayerButton": "Aseta"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Suuntien asetukset",
    "routeServiceUrl": "Reitityspalvelu",
    "buttonSet": "Aseta",
    "routeServiceUrlHintText": "Vihje: selaa valitsemalla â€˜Asetaâ€™ ja valitse reitityspalvelu",
    "directionLengthUnit": "Ajo-ohjeiden pituusyksiköt",
    "unitsForRouteHintText": "Vihje: käytetään reitin yksiköiden näyttämiseen",
    "selectRouteSymbol": "Valitse reitin näyttämiseen käytettävä symboli",
    "routeSymbolHintText": "Vihje: käytetään viivasymbolin näyttämiseen reitissä",
    "routingDisabledMsg": "Jos haluat ottaa ajo-ohjeet käyttöön, varmista, että reititys on käytössä ArcGIS Online -kohteessa."
  },
  "networkServiceChooser": {
    "arcgislabel": "Lisää ArcGIS Online -palvelusta",
    "serviceURLabel": "Lisää palvelun URL-osoite",
    "routeURL": "Reitin URL-osoite",
    "validateRouteURL": "Vahvista",
    "exampleText": "Esimerkki",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Määritä kelvollinen reittipalvelu.",
    "rateLimitExceeded": "Nopeusrajoitus ylittyi. Yritä myöhemmin uudelleen.",
    "errorInvokingService": "Käyttäjänimi tai salasana on virheellinen."
  },
  "errorStrings": {
    "bufferErrorString": "Anna kelvollinen numeroarvo.",
    "selectLayerErrorString": "Valitse haettavat karttatasot.",
    "invalidDefaultValue": "Puskurin oletusetäisyys ei voi olla tyhjä. Määritä puskurin etäisyys",
    "invalidMaximumValue": "Puskurin enimmäisetäisyys ei voi olla tyhjä. Määritä puskurin etäisyys",
    "defaultValueLessThanMax": "Määritä puskurin oletusetäisyys enimmäismäärän rajoissa",
    "defaultBufferValueGreaterThanZero": "Määritä nollaa suurempi puskurin oletusetäisyys",
    "maximumBufferValueGreaterThanZero": "Määritä nollaa suurempi puskurin enimmäisetäisyys"
  },
  "symbolPickerPreviewText": "Esikatselu:"
});