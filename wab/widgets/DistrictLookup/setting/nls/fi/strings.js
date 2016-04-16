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
    units: {
      miles: "Mailia", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometriä", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Jalkaa", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Metriä" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Hakuasetukset", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Aseta", // shown as a button text to set layers
      selectLayersLabel: "Valitse karttataso",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Vihje: käytetään aluekarttatason ja siihen liittyvän pistekarttatason valintaan.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Korosta alue valitsemalla symboli", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Osoitteen tai sijainnin symboli", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Vihje: haetun osoitteen tai napsautetun sijainnin symboli", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Vihje: käytetään valitun alueen symbolin esittämiseen" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Peruuta", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Valitse aluekarttataso", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Vihje: käytetään aluekarttatason valintaan.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Valitse aluekarttatasoon liittyvä pistekarttataso", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Vihje: käytetään aluekarttatasoon liittyvän pistekarttatason valintaan", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Valitse aluekarttataso, jossa on siihen liittyvä pistekarttataso.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Valitse aluekarttataso, jossa on siihen liittyvä pistekarttataso.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Valitse aluekarttatasoon liittyvä pistekarttataso." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Ajo-ohjeiden asetukset", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Reitityspalvelu", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Matkustustapapalvelu", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Aseta", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Vihje: selaa ja valitse verkostoanalyysin reitityspalvelu napsauttamalla Määritä", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Ajo-ohjeiden pituusyksiköt", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Vihje: käytetään reitin raportoitujen yksiköiden näyttämiseen", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Valitse reitin näyttämiseen käytettävä symboli", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Vihje: käytetään viivasymbolin näyttämiseen reitissä", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Vihje: selaa ja valitse matkustustapapalvelu napsauttamalla Määritä", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Määritä kelvollinen matkustustapapalvelu", // shown as an error label in alert box when invalid travel mode service url is configured
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
    symbolPickerPreviewText: "Esikatselu:"
  })
);