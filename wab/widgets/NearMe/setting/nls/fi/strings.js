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
        displayText: "Mailia",
        acronym: "mailia"
      },
      kilometers: {
        displayText: "Kilometriä",
        acronym: "km"
      },
      feet: {
        displayText: "Jalkaa",
        acronym: "ft"
      },
      meters: {
        displayText: "Metriä",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Hakuasetukset", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Määritä puskurin oletusetäisyyden arvo", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Määritä puskurin enimmäisetäisyyden arvo kohteiden etsintää varten", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Puskurin etäisyysyksiköt", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Vihje: käytetään puskurin oletusarvon määrittämiseen", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Vihje: käytetään puskurin enimmäisarvon määrittämiseen", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Vihje: määrittää puskurin luonnin yksikön", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Osoitteen tai sijainnin symboli", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Vihje: haetun osoitteen tai napsautetun sijainnin symboli", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Valitse hakutulosten fontin väri", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Vihje: hakutulosten fontin väri" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Valitse hakukarttataso(t)", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Vihje: käytä Määritä-painiketta karttatasojen valintaan", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Aseta", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Peruuta" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Ajo-ohjeiden asetukset", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Reitityspalvelu", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Matkustustapapalvelu", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Aseta", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Vihje: selaa ja valitse reitityspalvelu napsauttamalla Määritä", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Ajo-ohjeiden pituusyksiköt", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Vihje: käytetään reitin yksiköiden näyttämiseen", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Valitse reitin näyttämiseen käytettävä symboli", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Vihje: käytetään viivasymbolin näyttämiseen reitissä", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Vihje: selaa ja valitse matkustustapapalvelu napsauttamalla Määritä", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Määritä kelvollinen matkustustapapalvelu ", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Jos haluat ottaa ajo-ohjeet käyttöön, varmista, että reititys on käytössä ArcGIS Online -kohteessa." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Lisää ArcGIS Online -palvelusta", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Lisää palvelun URL-osoite", // shown as a label in route service configuration panel to add service url
      routeURL: "Reitin URL-osoite", // shown as a label in route service configuration panel
      validateRouteURL: "Vahvista", // shown as a button text in route service configuration panel to validate url
      exampleText: "Esimerkki", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Peruuta", // shown as a button text for route service configuration panel
      nextButton: "Seuraava", // shown as a button text for route service configuration panel
      backButton: "Takaisin", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Määritä kelvollinen reittipalvelu." // Shown as an error in alert box invalid route service url is configured.
    },
    errorStrings: {
      bufferErrorString: "Anna kelvollinen numeroarvo.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Valitse haettavat karttatasot.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Puskurin oletusetäisyys ei voi olla tyhjä. Määritä puskurin etäisyys", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Puskurin enimmäisetäisyys ei voi olla tyhjä. Määritä puskurin etäisyys", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Määritä puskurin oletusetäisyys enimmäismäärän rajoissa", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Määritä nollaa suurempi puskurin oletusetäisyys", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Määritä nollaa suurempi puskurin enimmäisetäisyys" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Esikatselu:"
  })
);