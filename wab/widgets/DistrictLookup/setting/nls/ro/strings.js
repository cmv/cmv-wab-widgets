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
      miles: "Mile", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometri", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Ft", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Metri" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Setări căutare", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Setare", // shown as a button text to set layers
      selectLayersLabel: "Selectare strat tematic",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Sugestie: Utilizat pentru a selecta un strat tematic de poligoane şi stratul tematic de puncte corelat cu acesta.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Selectare simbol pentru evidenţierea poligonului", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Simbol adresă sau locaţie", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Sugestie: Simbol pentru adresa căutată sau locaţia apăsată", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Sugestie: Utilizat pentru afişarea simbolului pentru poligonul selectat" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Anulare", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Selectarea stratului tematic de poligoane", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Sugestie: Utilizat pentru selectarea stratului tematic de poligoane.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Selectare strat tematic de puncte corelat cu stratul tematic de poligoane", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Sugestie: Utilizat pentru a selecta un strat tematic de puncte corelat ce stratul tematic de poligoane", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Vă rugăm să selectaţi un strat tematic de poligoane care are un strat tematic de puncte corelat.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Vă rugăm să selectaţi un strat tematic de poligoane care are un strat tematic de puncte corelat.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Vă rugăm să selectaţi un strat tematic de puncte corelat cu stratul tematic de poligoane." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Setări indicaţii de direcţie", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Serviciu de rute", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Serviciu mod de deplasare", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Setare", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Sugestie: Apăsaţi „Setare” pentru a răsfoi un serviciu de rute de analiză de reţea", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unităţi de lungime pentru indicaţiile de direcţie", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Sugestie: Utilizaţi pentru afişarea unităţilor raportate pentru rută", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Selectare simbol pentru afişarea rutei", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Sugestie: Utilizat pentru afişarea simbolului liniei rutei", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Sugestie: Apăsaţi „Setare” pentru a răsfoi şi selecta un Serviciu mod de deplasare", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Vă rugăm să specificaţi un serviciu mod de deplasare valid", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Pentru a activa indicaţiile de direcţie asiguraţi-vă că rutele sunt activate în elementul ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Adăugare din ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Adăugare URL serviciu", // shown as a label in route service configuration panel to add service url
      routeURL: "URL rută", // shown as a label in route service configuration panel
      validateRouteURL: "Validare", // shown as a button text in route service configuration panel to validate url
      exampleText: "Exemplu", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Anulare", // shown as a button text for route service configuration panel
      nextButton: "Următorul", // shown as a button text for route service configuration panel
      backButton: "Înapoi", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Vă rugăm să specificaţi un serviciu de rute valid." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Previzualizare:"
  })
);