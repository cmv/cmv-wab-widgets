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
      "displayText": "Miglia",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Chilometri",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Piedi",
      "acronym": "piedi"
    },
    "meters": {
      "displayText": "Metri",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Impostazione di ricerca",
    "defaultBufferDistanceLabel": "Imposta distanza di buffer predefinita",
    "maxBufferDistanceLabel": "Imposta distanza di buffer massima",
    "bufferDistanceUnitLabel": "Unità distanza di buffer",
    "defaultBufferHintLabel": "Suggerimento: impostare il valore predefinito per il cursore buffer",
    "maxBufferHintLabel": "Suggerimento: impostare il valore massimo per il cursore buffer",
    "bufferUnitLabel": "Suggerimento: definire unità di creazione buffer",
    "selectGraphicLocationSymbol": "Simbolo indirizzo o posizione",
    "graphicLocationSymbolHintText": "Suggerimento: simbolo per l'indirizzo ricercato o la posizione selezionata",
    "fontColorLabel": "Seleziona colore font per risultati della ricerca",
    "fontColorHintText": "Suggerimento: colore font dei risultati della ricerca",
    "zoomToSelectedFeature": "Zoom alla feature selezionata",
    "zoomToSelectedFeatureHintText": "Suggerimento: esegue lo zoom alla feature selezionata anziché al buffer",
    "intersectSearchLocation": "Restituisci poligono o poligoni di intersezione",
    "intersectSearchLocationHintText": "Suggerimento: restituisce il poligono o i poligoni contenenti la posizione ricercata anziché i poligoni all'interno del buffer",
    "bufferVisibilityLabel": "Imposta visibilità buffer",
    "bufferVisibilityHintText": "Suggerimento: il buffer verrà visualizzato sulla mappa",
    "bufferColorLabel": "Imposta simbolo buffer",
    "bufferColorHintText": "Suggerimento: selezionare colore e trasparenza del buffer",
    "searchLayerResultLabel": "Disegna solo risultati del layer selezionato",
    "searchLayerResultHint": "Suggerimento: solo il layer selezionato nei risultati della ricerca verrà disegnato sulla mappa"
  },
  "layerSelector": {
    "selectLayerLabel": "Seleziona layer di ricerca",
    "layerSelectionHint": "Suggerimento: utilizzare il pulsante di impostazione per selezionare layer",
    "addLayerButton": "Imposta"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Impostazioni direzioni",
    "routeServiceUrl": "Servizio itinerario",
    "buttonSet": "Imposta",
    "routeServiceUrlHintText": "Suggerimento: fare clic su â€˜Impostaâ€™ per individuare e selezionare un servizio itinerario",
    "directionLengthUnit": "Unità di lunghezza direzione",
    "unitsForRouteHintText": "Suggerimento: utilizzato per visualizzare unità per percorso",
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
  "errorStrings": {
    "bufferErrorString": "Immettere valore numerico valido.",
    "selectLayerErrorString": "Selezionare i layer da cercare.",
    "invalidDefaultValue": "La distanza di buffer predefinita non può essere vuota. Specificare la distanza di buffer",
    "invalidMaximumValue": "La distanza di buffer massima non può essere vuota. Specificare la distanza di buffer",
    "defaultValueLessThanMax": "Specificare la distanza di buffer predefinita all'interno del limite massimo",
    "defaultBufferValueGreaterThanZero": "Specificare la distanza di buffer predefinita maggiore di 0",
    "maximumBufferValueGreaterThanZero": "Specificare la distanza di buffer massima maggiore di 0"
  },
  "symbolPickerPreviewText": "Anteprima:"
});