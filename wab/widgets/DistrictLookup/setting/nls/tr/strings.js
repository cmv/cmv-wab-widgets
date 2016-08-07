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
    "miles": "Mil",
    "kilometers": "Kilometre",
    "feet": "Fit",
    "meters": "Metre"
  },
  "layerSetting": {
    "layerSettingTabTitle": "Arama Ayarları",
    "buttonSet": "Ayarla",
    "selectLayersLabel": "Katman seç",
    "selectLayersHintText": "İpucu: Alan katmanını ve onunla ilişkili nokta katmanını seçmek için kullanılır.",
    "selectPrecinctSymbolLabel": "Alanı vurgulamak için simge seç",
    "selectGraphicLocationSymbol": "Adres veya konum simgesi",
    "graphicLocationSymbolHintText": "İpucu: Aranan adres veya tıklanan konum simgesi",
    "precinctSymbolHintText": "İpucu: Seçilen alanın simgesini görüntülemek için kullanılır",
    "selectColorForPoint": "Noktayı vurgulamak için renk seç",
    "selectColorForPointHintText": "İpucu: Seçilen noktanın vurgulama rengini görüntülemek için kullanılır"
  },
  "layerSelector": {
    "selectPolygonLayerLabel": "Alan katmanını seç",
    "selectPolygonLayerHintText": "İpucu: Alan katmanını seçmek için kullanılır",
    "selectRelatedPointLayerLabel": "Alan katmanı ile ilişkili nokta katmanını seçin",
    "selectRelatedPointLayerHintText": "İpucu: Alan katmanı ile ilişkili nokta katmanını seçmek için kullanılır",
    "polygonLayerNotHavingRelatedLayer": "İlişkili nokta katmanına sahip bir alan katmanı seçin.",
    "errorInSelectingPolygonLayer": "İlişkili nokta katmanına sahip bir alan katmanı seçin.",
    "errorInSelectingRelatedLayer": "Alan katmanı ile ilişkili nokta katmanını seçin."
  },
  "routeSetting": {
    "routeSettingTabTitle": "Doğrultu Ayarları",
    "routeServiceUrl": "Rota oluşturma servisi",
    "buttonSet": "Ayarla",
    "routeServiceUrlHintText": "İpucu: Bir ağ analizi rota oluşturma servisini inceleyerek seçmek için ‘Ayarla’ düğmesine tıklayın",
    "directionLengthUnit": "Yol tarifi uzunluk birimi",
    "unitsForRouteHintText": "İpucu: Bildirilen rota birimini görüntülemek için kullanılır",
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
  "symbolPickerPreviewText": "Önizleme:"
});