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
      "displayText": "Mil",
      "acronym": "mi"
    },
    "kilometers": {
      "displayText": "Kilometre",
      "acronym": "km"
    },
    "feet": {
      "displayText": "Fit",
      "acronym": "ft"
    },
    "meters": {
      "displayText": "Metre",
      "acronym": "m"
    }
  },
  "searchSetting": {
    "searchSettingTabTitle": "Arama Ayarları",
    "defaultBufferDistanceLabel": "Varsayılan tampon mesafesini ayarla",
    "maxBufferDistanceLabel": "Maksimum tampon mesafesini ayarla",
    "bufferDistanceUnitLabel": "Tampon mesafesi birimleri",
    "defaultBufferHintLabel": "İpucu: Tampon kaydırıcısı için varsayılan değeri ayarlayın",
    "maxBufferHintLabel": "İpucu: Tampon kaydırıcısı için maksimum değeri ayarlayın",
    "bufferUnitLabel": "İpucu: Tampon oluşturma birimi tanımlayın",
    "selectGraphicLocationSymbol": "Adres veya konum simgesi",
    "graphicLocationSymbolHintText": "İpucu: Aranan adres veya tıklanan konum simgesi",
    "fontColorLabel": "Arama sonuçları için yazı tipi rengini belirle",
    "fontColorHintText": "İpucu: Arama sonuçlarının yazı tipi rengi",
    "zoomToSelectedFeature": "Seçili detaya yakınlaştır",
    "zoomToSelectedFeatureHintText": "İpucu: Tampon yerine seçili detaya yakınlaştırın",
    "intersectSearchLocation": "Kesişen alanları döndür",
    "intersectSearchLocationHintText": "İpucu: Tampon içindeki alanlar yerine aranan konumu içeren alanları döndürün",
    "bufferVisibilityLabel": "Tampon görünürlüğünü ayarlayın",
    "bufferVisibilityHintText": "İpucu: Tampon haritada görüntülenecek",
    "bufferColorLabel": "Tampon sembolünü ayarlayın",
    "bufferColorHintText": "İpucu: Tamponun rengini ve saydamlığını belirleyin",
    "searchLayerResultLabel": "Yalnızca seçili katman sonuçlarını çiz",
    "searchLayerResultHint": "İpucu: Haritada yalnızca atama sonuçlarında seçilen katman çizilir"
  },
  "layerSelector": {
    "selectLayerLabel": "Arama katmanlarını seç",
    "layerSelectionHint": "İpucu: Katman seçmek için ayarla düğmesini kullanın",
    "addLayerButton": "Ayarla"
  },
  "routeSetting": {
    "routeSettingTabTitle": "Doğrultu Ayarları",
    "routeServiceUrl": "Rota Oluşturma Servisi",
    "buttonSet": "Ayarla",
    "routeServiceUrlHintText": "İpucu: Bir rota oluşturma servisini inceleyerek seçmek için â€˜Ayarlaâ€™ düğmesine tıklayın",
    "directionLengthUnit": "Yol tarifi uzunluk birimi",
    "unitsForRouteHintText": "İpucu: Rota birimini görüntülemek için kullanılır",
    "selectRouteSymbol": "Rotayı görüntülemek için simge seç",
    "routeSymbolHintText": "İpucu: Rotanın çizgi simgesini görüntülemek için kullanılır",
    "routingDisabledMsg": "Yol tarifi özelliğini etkinleştirmek için ArcGIS Online öğesinde rota oluşturmanın etkinleştirildiğinden emin olun."
  },
  "networkServiceChooser": {
    "arcgislabel": "ArcGIS Online'dan Ekle",
    "serviceURLabel": "Servis URL'si ekle",
    "routeURL": "Rotalama URL'si",
    "validateRouteURL": "Doğrula",
    "exampleText": "Örnek",
    "hintRouteURL1": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/",
    "hintRouteURL2": "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
    "invalidRouteServiceURL": "Geçerli bir Rota servisi belirtin.",
    "rateLimitExceeded": "Hız sınırı aşıldı. Daha sonra tekrar deneyin.",
    "errorInvokingService": "Kullanıcı adı ya da parola hatalı."
  },
  "errorStrings": {
    "bufferErrorString": "Geçerli sayısal değer girin.",
    "selectLayerErrorString": "Aranacak katmanları seçin.",
    "invalidDefaultValue": "Varsayılan tampon mesafesi boş olamaz. Tampon mesafesini belirtin",
    "invalidMaximumValue": "Maksimum tampon mesafesi boş olamaz. Tampon mesafesini belirtin",
    "defaultValueLessThanMax": "Varsayılan tampon mesafesini maksimum sınır dahilinde belirtin",
    "defaultBufferValueGreaterThanZero": "0'dan büyük varsayılan tampon mesafesi belirtin",
    "maximumBufferValueGreaterThanZero": "0'dan büyük maksimum tampon mesafesi belirtin"
  },
  "symbolPickerPreviewText": "Önizleme:"
});