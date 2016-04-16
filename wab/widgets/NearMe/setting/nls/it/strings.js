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
        displayText: "Miglia",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Chilometri",
        acronym: "km"
      },
      feet: {
        displayText: "Piedi",
        acronym: "piedi"
      },
      meters: {
        displayText: "Metri",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Impostazione di ricerca", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Imposta valore distanza di buffer predefinita", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Imposta valore distanza di buffer massima per la ricerca di feature", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Unità distanza di buffer", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "Suggerimento: utilizzare per impostare il valore predefinito per un buffer", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "Suggerimento: utilizzare per impostare il valore massimo per un buffer", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "Suggerimento: definire unità di creazione buffer", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Simbolo indirizzo o posizione", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "Suggerimento: simbolo per l\'indirizzo ricercato o la posizione selezionata", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Seleziona colore font per risultati della ricerca", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "Suggerimento: colore font dei risultati della ricerca" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Seleziona layer di ricerca", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "Suggerimento: utilizzare il pulsante di impostazione per selezionare layer", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Imposta", //Shown as a button text to add the layer for search
      okButton: "OK", // shown as a button text for layer selector popup
      cancelButton: "Annulla" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Impostazioni direzione", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Servizio itinerario", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Servizio Modalità di viaggio", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Imposta", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Suggerimento: fare clic su ‘Imposta’ per individuare e selezionare un servizio itinerario", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Unità di lunghezza direzione", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Suggerimento: utilizzato per visualizzare unità per percorso", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Seleziona simbolo per visualizzare percorso", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "Suggerimento: utilizzato per visualizzare simbolo linea del percorso", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Suggerimento: fare clic su ‘Imposta’ per individuare e selezionare un servizio Modalità di viaggio", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Specificare un servizio Modalità di viaggio valido ", // shown as an error label in alert box when invalid travel mode service url is configured
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
    errorStrings: {
      bufferErrorString: "Immettere valore numerico valido.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Selezionare i layer da cercare.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "La distanza di buffer predefinita non può essere vuota. Specificare la distanza di buffer", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "La distanza di buffer massima non può essere vuota. Specificare la distanza di buffer", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Specificare la distanza di buffer predefinita all\'interno del limite massimo", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "Specificare la distanza di buffer predefinita maggiore di 0", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "Specificare la distanza di buffer massima maggiore di 0" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Anteprima:"
  })
);