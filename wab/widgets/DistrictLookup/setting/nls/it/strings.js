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
      miles: "Miglia", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Chilometri", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Piedi", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Metri" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Impostazione di ricerca", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Imposta", // shown as a button text to set layers
      selectLayersLabel: "Seleziona layer",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Suggerimento: utilizzato per selezionare il layer poligono e il layer punto correlato.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Seleziona simbolo per evidenziare poligono", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Simbolo indirizzo o posizione", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Suggerimento: simbolo per l\'indirizzo ricercato o la posizione selezionata", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Suggerimento: utilizzato per visualizzare il simbolo per il poligono selezionato" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "OK", // shown as a button text for layerSelector configuration panel
      cancelButton: "Annulla", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Seleziona layer poligono", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Suggerimento: utilizzato per selezionare layer poligono.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Selezionare layer punto correlato al layer poligono", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Suggerimento: utilizzato per selezionare layer punto correlato a layer poligono", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Selezionare un layer poligono con un layer punto correlato.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Selezionare un layer poligono con un layer punto correlato.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Selezionare layer punto correlato al layer poligono." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Impostazioni direzione", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Servizio itinerario", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Servizio Modalità di viaggio", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Imposta", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Suggerimento: fare clic su ‘Imposta’ per individuare e selezionare un servizio itinerario di analisi di rete", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unità di lunghezza direzione", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Suggerimento: utilizzato per visualizzare unità per percorso segnalate", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Seleziona simbolo per visualizzare percorso", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Suggerimento: utilizzato per visualizzare simbolo linea del percorso", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Suggerimento: fare clic su ‘Imposta’ per individuare e selezionare un servizio Modalità di viaggio", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Specificare un servizio Modalità di viaggio valido", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Per abilitare le direzioni accertarsi che gli itinerari siano abilitati nell\'elemento di ArcGIS Online." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Aggiungi da ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Aggiungi URL del servizio", // shown as a label in route service configuration panel to add service url
      routeURL: "URL itinerario", // shown as a label in route service configuration panel
      validateRouteURL: "Convalida", // shown as a button text in route service configuration panel to validate url
      exampleText: "Esempio", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "OK", // shown as a button text for route service configuration panel
      cancelButton: "Annulla", // shown as a button text for route service configuration panel
      nextButton: "Avanti", // shown as a button text for route service configuration panel
      backButton: "Indietro", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Specificare un servizio Itinerari valido." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Anteprima:"
  })
);