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
      miles: "Mil", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometre", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Fit", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Metre" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Arama Ayarları", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Ayarla", // shown as a button text to set layers
      selectLayersLabel: "Katman seç",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "İpucu: Alan katmanını ve onunla ilişkili nokta katmanını seçmek için kullanılır.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Alanı vurgulamak için simge seç", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Adres veya konum simgesi", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "İpucu: Aranan adres veya tıklanan konum simgesi", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "İpucu: Seçilen alanın simgesini görüntülemek için kullanılır" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "Tamam", // shown as a button text for layerSelector configuration panel
      cancelButton: "İptal", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Alan katmanını seç", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "İpucu: Alan katmanını seçmek için kullanılır", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Alan katmanı ile ilişkili nokta katmanını seçin", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "İpucu: Alan katmanı ile ilişkili nokta katmanını seçmek için kullanılır", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "İlişkili nokta katmanına sahip bir alan katmanı seçin.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "İlişkili nokta katmanına sahip bir alan katmanı seçin.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Alan katmanı ile ilişkili nokta katmanını seçin." // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Yol Tarifi Ayarları", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Rota oluşturma servisi", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Seyahat Modu servisi", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Ayarla", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "İpucu: Bir ağ analizi rota oluşturma servisini inceleyerek seçmek için ‘Ayarla’ düğmesine tıklayın", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Yol tarifi uzunluk birimi", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "İpucu: Bildirilen rota birimini görüntülemek için kullanılır", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Rotayı görüntülemek için simge seç", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "İpucu: Rotanın çizgi simgesini görüntülemek için kullanılır", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "İpucu: Bir Seyahat Modu servisini inceleyerek seçmek için ‘Ayarla’ düğmesine tıklayın", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Geçerli bir Seyahat Modu servisi belirtin.", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Yol tarifi özelliğini etkinleştirmek için ArcGIS Online öğesinde rota oluşturmanın etkinleştirildiğinden emin olun." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "ArcGIS Online\'dan Ekle", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Servis URL\'si ekle", // shown as a label in route service configuration panel to add service url
      routeURL: "Rotalama URL\'si", // shown as a label in route service configuration panel
      validateRouteURL: "Doğrula", // shown as a button text in route service configuration panel to validate url
      exampleText: "Örnek", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "Tamam", // shown as a button text for route service configuration panel
      cancelButton: "İptal", // shown as a button text for route service configuration panel
      nextButton: "Sonraki", // shown as a button text for route service configuration panel
      backButton: "Geri", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Geçerli bir Rota servisi belirtin." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Önizleme:"
  })
);