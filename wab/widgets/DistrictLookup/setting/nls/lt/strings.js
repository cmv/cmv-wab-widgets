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
      miles: "Mylios", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      kilometers: "Kilometrai", // label shown in config UI dialog box(options for dropdown) and also shown as label for slider text(slider unit)
      feet: "Pėdos", // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
      meters: "Metrai" // label shown in config UI dialog box(options for dropdown)and also shown as label for slider text(slider unit)
    },
    layerSetting: {
      layerSettingTabTitle: "Paieškos nuostatos", // shown as a label in config UI dialog box for layer setting
      buttonSet: "Grupė", // shown as a button text to set layers
      selectLayersLabel: "Pasirinkite sluoksnį",  // shown as a label in config UI dialog box for selecting polygon and its related layer from map
      selectLayersHintText: "Pastaba: naudojama plotų sluoksniui ir jo susijusių taškų sluoksniui pasirinkti.", // shown as a hint text in config UI dialog box for selecting polygon and its related layer from map
      selectPrecinctSymbolLabel: "Pasirinkti poligono paryškinimo simbolį", // shown as hint label in config UI dialog box for selecting precinct symbol
      selectGraphicLocationSymbol: "Adreso arba vietos simbolis", // shown as label in config UI dialog box for graphic symbol in routing
      graphicLocationSymbolHintText: "Patarimas: ieškoto adreso arba spustelėtos vietos simbolis", // shown as hint label in config UI dialog box for selecting graphic symbol
      precinctSymbolHintText: "Patarimas: naudojama pasirinkto poligono simboliui rodyti" // shown as hint label in config UI dialog box for selecting graphic symbol for precinct
    },
    layerSelector: {
      okButton: "Gerai", // shown as a button text for layerSelector configuration panel
      cancelButton: "Atšaukti", // shown as a button text for layerSelector configuration panel
      selectPolygonLayerLabel: "Pasirinkti poligono sluoksnį", // shown as a label in config UI dialog box for selecting polygon (precinct) layer on map
      selectPolygonLayerHintText: "Patarimas: naudojama poligono sluoksniui pasirinkti.", // shown as hint label in config UI dialog box for selecting polygon (precinct) layer on map
      selectRelatedPointLayerLabel: "Pasirinkti su poligono sluoksniu susijusį taškų sluoksnį", // shown as a label in config UI dialog box for selecting polling place layer on map
      selectRelatedPointLayerHintText: "Pastaba: naudojama su poligono sluoksniu susijusiam taškų sluoksniui pasirinkti", // shown as hint label in config UI dialog box for selecting polling place layer on map
      polygonLayerNotHavingRelatedLayer: "Pasirinkite poligono sluoksnį, kuriame yra susijusių taškų sluoksnis.", //// shown as an error in alert box if selected precinct layers in not having valid related layers
      errorInSelectingPolygonLayer: "Pasirinkite poligono sluoksnį, kuriame yra susijusių taškų sluoksnis.", // shown as an error label in alert box for selecting precinct layer from map
      errorInSelectingRelatedLayer: "Pasirinkite su poligono sluoksniu susijusį taškų sluoksnį" // shown as an error label in alert box for selecting polling place layer from map
    },
    routeSetting: {
      routeSettingTabTitle: "Krypties nustatymai", // shown as a label in config UI dialog box for route setting
      routeServiceUrl: "Maršruto paslauga", // shown as a label in config UI dialog box for setting the route url
      travelModeServiceUrl: "Kelionės režimo paslauga", // shown as a label in config UI dialog box for setting the travelmode url
      buttonSet: "Grupė", // shown as a button text for route setting to set route url in config UI dialog box
      routeServiceUrlHintText: "Patarimas: spustelėkite „Nustatyti“, jei norite naršyti ir pasirinkti tinklo analizės maršruto paslaugą", // shown as a hint label in config UI dialog box to select a route url
      directionLengthUnit: "Krypties ilgio vienetai", // shown as a label(options) of select(dropdown) in config UI dialog box in routing section
      unitsForRouteHintText: "Patarimas: naudojama maršruto nurodytiems vienetams rodyti", // shown as hint label in config UI dialog box to display routing unit
      selectRouteSymbol: "Pasirinkti maršruto rodymo simbolį", // shown as label in config UI dialog box for selcting symbol for routing
      routeSymbolHintText: "Patarimas: naudojamas maršruto linijos simboliui rodyti", //shown as hint to select route symbol
      travelModeServiceUrlHintText: "Patarimas: spustelėkite „Nustatyti“, jei norite naršyti ir pasirinkti kelionės režimo paslaugą", // shown as a hint label in config UI dialog box to select a travelMode service url
      invalidTravelmodeServiceUrl: "Nurodykite galiojančią kelionės režimo paslaugą", // shown as an error label in alert box when invalid travel mode service url is configured
      routingDisabledMsg: "Jei norite įjungti nuorodas, įsitikinkite, kad maršrutas įjungtas ArcGIS Online elemente." // shown as message in routeSettings tab when routing is disabled in webmap
    },
    networkServiceChooser: {
      arcgislabel: "Pridėti iš ArcGIS Online", // shown as a label in route service configuration panel to select route url from portal
      serviceURLabel: "Pridėti paslaugos URL", // shown as a label in route service configuration panel to add service url
      routeURL: "Maršruto URL", // shown as a label in route service configuration panel
      validateRouteURL: "Tikrinti", // shown as a button text in route service configuration panel to validate url
      exampleText: "Pavyzdys", // shown as a label in route service configuration panel to consider example of route services
      hintRouteURL1: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/", // shown as a label hint in route service configuration panel
      hintRouteURL2: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // shown as a label hint in route service configuration panel
      okButton: "Gerai", // shown as a button text for route service configuration panel
      cancelButton: "Atšaukti", // shown as a button text for route service configuration panel
      nextButton: "Kitas", // shown as a button text for route service configuration panel
      backButton: "Atgal", // shown as a button text for route service configuration panel
      invalidRouteServiceURL: "Nurodykite galiojančią maršruto paslaugą." // Shown as an error in alert box invalid route service url is configured.
    },
    symbolPickerPreviewText: "Peržiūra:"
  })
);