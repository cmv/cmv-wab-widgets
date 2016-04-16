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
        displayText: "Mil",
        acronym: "mi"
      },
      kilometers: {
        displayText: "Kilometre",
        acronym: "km"
      },
      feet: {
        displayText: "Fit",
        acronym: "ft"
      },
      meters: {
        displayText: "Metre",
        acronym: "m"
      }
    },
    searchSetting: {
      searchSettingTabTitle: "Arama Ayarları", // shown as a label in config UI dialog box for search setting
      defaultBufferDistanceLabel: "Varsayılan tampon mesafesi değerini ayarla", // shown as a label in config UI dialog box for selecting default buffer distance
      maxBufferDistanceLabel: "Detay bulmak için maksimum tampon mesafesi değerini ayarla", // shown as a label in config UI dialog box for selecting maximum buffer distance value
      bufferDistanceUnitLabel: "Tampon mesafesi birimleri", // shown as a label(options) of select(dropdown) in config UI dialog box
      defaultBufferHintLabel: "İpucu: Tamponun varsayılan değerini ayarlamak için kullanın", // shown as a label in config UI dialog box to set default value for a buffer
      maxBufferHintLabel: "İpucu: Tamponun maksimum değerini ayarlamak için kullanın", // shown as a label in config UI dialog box to set maximum value for a buffer
      bufferUnitLabel: "İpucu: Tampon oluşturma birimi tanımlayın", // shown as a label in config UI dialog box to set unit of buffer
      selectGraphicLocationSymbol: "Adres veya konum simgesi", // shown as label in config UI dialog box for graphic symbol in search setting
      graphicLocationSymbolHintText: "İpucu: Aranan adres veya tıklanan konum simgesi", // shown as hint label in config UI dialog box for selecting graphic symbol
      fontColorLabel: "Arama sonuçları için yazı tipi rengini belirle", //Show as label in config UI to set the font color in widget panel.
      fontColorHintText: "İpucu: Arama sonuçlarının yazı tipi rengi" //Show as label in config UI to set the font color in widget panel.
    },
    layerSelector: {
      selectLayerLabel: "Arama katmanlarını seç", // shown as a label in config UI dialog box for selecting layer on map
      layerSelectionHint: "İpucu: Katman seçmek için ayarla düğmesini kullanın", // shown as a label in config UI dialog box to select multiple layers
      addLayerButton: "Ayarla", //Shown as a button text to add the layer for search
      okButton: "Tamam", // shown as a button text for layer selector popup
      cancelButton: "İptal" // shown as a button text for layer selector popup
    },
    routeSetting: {
      routeSettingTabTitle: "Yol Tarifi Ayarları", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Rota Oluşturma Servisi", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Seyahat Modu Servisi", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Ayarla", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "İpucu: Bir rota oluşturma servisini inceleyerek seçmek için ‘Ayarla’ düğmesine tıklayın", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Yol tarifi uzunluk birimi", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "İpucu: Rota birimini görüntülemek için kullanılır", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Rotayı görüntülemek için simge seç", // shown as label in config UI dialog box for selecting symbol for routing
      routeSymbolHintText: "İpucu: Rotanın çizgi simgesini görüntülemek için kullanılır", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "İpucu: Bir Seyahat Modu Servisini inceleyerek seçmek için ‘Ayarla’ düğmesine tıklayın", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Geçerli bir Seyahat Modu servisi belirtin. ", // shown as an error label in alert box when invalid travel mode service url is configured
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
    errorStrings: {
      bufferErrorString: "Geçerli sayısal değer girin.", // shown as an error label in text box for buffer
      selectLayerErrorString: "Aranacak katmanları seçin.", // shown as an error label in alert box for selecting layer from map to search
      invalidDefaultValue: "Varsayılan tampon mesafesi boş olamaz. Tampon mesafesini belirtin", // shown as an error label in alert box for blank or empty text box
      invalidMaximumValue: "Maksimum tampon mesafesi boş olamaz. Tampon mesafesini belirtin", // shown as an error label in alert box for blank or empty text box
      defaultValueLessThanMax: "Varsayılan tampon mesafesini maksimum sınır dahilinde belirtin", // shown as an error label in alert box when default value is greater than maximum value of slider
      defaultBufferValueGreaterThanZero: "0\'dan büyük varsayılan tampon mesafesi belirtin", // shown as an error label in alert box when we configure default value of slider is zero
      maximumBufferValueGreaterThanZero: "0\'dan büyük maksimum tampon mesafesi belirtin" // shown as an error label in alert box when we configure maximum value of slider is zero
    },
    symbolPickerPreviewText: "Önizleme:"
  })
);