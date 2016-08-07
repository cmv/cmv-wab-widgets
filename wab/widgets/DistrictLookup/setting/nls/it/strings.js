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
    "miles": "Miglia",
    "kilometers": "Chilometri",
    "feet": "Piedi",
    "meters": "Metri"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Impostazione di ricerca",
    "buttonSet": "Imposta",
    "selectLayersLabel": "Seleziona layer",
    "selectLayersHintText": "Suggerimento: utilizzato per selezionare il layer poligono e il layer punto correlato.",
    "selectPrecinctSymbolLabel": "Seleziona simbolo per evidenziare poligono",
    "selectGraphicLocationSymbol": "Simbolo indirizzo o posizione",
    "graphicLocationSymbolHintText": "Suggerimento: simbolo per l'indirizzo ricercato o la posizione selezionata",
    "precinctSymbolHintText": "Suggerimento: utilizzato per visualizzare il simbolo per il poligono selezionato",
    "selectColorForPoint": "Seleziona colore per evidenziare punto",
    "selectColorForPointHintText": "Suggerimento: utilizzato per visualizzare il colore evidenziazione per il punto selezionato"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Seleziona layer poligono",
    "selectPolygonLayerHintText": "Suggerimento: utilizzato per selezionare layer poligono.",
    "selectRelatedPointLayerLabel": "Selezionare layer punto correlato al layer poligono",
    "selectRelatedPointLayerHintText": "Suggerimento: utilizzato per selezionare layer punto correlato a layer poligono",
    "polygonLayerNotHavingRelatedLayer": "Selezionare un layer poligono con un layer punto correlato.",
    "errorInSelectingPolygonLayer": "Selezionare un layer poligono con un layer punto correlato.",
    "errorInSelectingRelatedLayer": "Selezionare layer punto correlato al layer poligono."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Impostazioni direzioni",
    "routeServiceUrl": "Servizio itinerario",
    "buttonSet": "Imposta",
    "routeServiceUrlHintText": "Suggerimento: fare clic su ‘Imposta’ per individuare e selezionare un servizio itinerario di analisi di rete",
    "directionLengthUnit": "Unità di lunghezza direzione",
    "unitsForRouteHintText": "Suggerimento: utilizzato per visualizzare unità per percorso segnalate",
    "selectRouteSymbol": "Seleziona simbolo per visualizzare percorso",
    "routeSymbolHintText": "Suggerimento: utilizzato per visualizzare simbolo linea del percorso",
    "routingDisabledMsg": "Per abilitare le direzioni accertarsi che gli itinerari siano abilitati nell'elemento di ArcGIS Online."
  },
  "networkServiceChooser": {
    "arcgislabel": "Aggiungi da ArcGIS Online",
    "serviceURLabel": "Aggiungi URL del servizio",
    "routeURL": "URL itinerario",
    "validateRouteURL": "Convalida",
    "exampleText": "Esempio",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Specificare un servizio Itinerari valido.",
    "rateLimitExceeded": "Superato limite velocità. Riprovare più tardi.",
    "errorInvokingService": "Nome utente o password errati."
  },
  "symbolPickerPreviewText": "Anteprima:"
});