///////////////////////////////////////////////////////////////////////////
// Copyright © 2017 Esri. All Rights Reserved.
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
  "configText": "Konfigurációs szöveg beállítása:",
  "generalSettings": {
    "tabTitle": "Általános beállítások",
    "measurementUnitLabel": "Mértékegység",
    "currencyLabel": "Méretszimbólum",
    "roundCostLabel": "Költség kerekítése",
    "projectOutputSettings": "Projekt kimeneti beállításai",
    "typeOfProjectAreaLabel": "Projektterület típusa",
    "bufferDistanceLabel": "Buffertávolság",
    "roundCostValues": {
      "twoDecimalPoint": "Két tizedesjegy",
      "nearestWholeNumber": "Legközelebbi egész szám",
      "nearestTen": "Legközelebbi tízes",
      "nearestHundred": "Legközelebbi százas",
      "nearestThousand": "Legközelebbi ezres",
      "nearestTenThousands": "Legközelebbi tízezres"
    },
    "projectAreaType": {
      "outline": "Kontúr",
      "buffer": "Buffer"
    },
    "errorMessages": {
      "currency": "Érvénytelen pénznem",
      "bufferDistance": "Érvénytelen buffertávolság",
      "outOfRangebufferDistance": "Az értéknek 0-nál nagyobbnak és 100-nál kisebbnek vagy azzal egyenlőnek kell lennie"
    }
  },
  "projectSettings": {
    "tabTitle": "Projektbeállítások",
    "costingGeometrySectionTitle": "Földrajzi terület meghatározása a költségszámításhoz (opcionális)",
    "costingGeometrySectionNote": "Megjegyzés: Ennek a rétegnek a konfigurálása lehetővé teszi a felhasználó számára, hogy a földrajzi helyzet alapján költségképleteket állítson be a vektoros elemek sablonjaihoz.",
    "projectTableSectionTitle": "Lehetőség a projektbeállítások mentésére/betöltésére (opcionális)",
    "projectTableSectionNote": "Megjegyzés: Az összes táblázat és réteg konfigurálása lehetővé teszi a felhasználó számára, hogy a projektet későbbi felhasználás céljából mentse és betöltse.",
    "costingGeometryLayerLabel": "Költségszámítási geometriaréteg",
    "fieldLabelGeography": "Földrajzi terület feliratmezője",
    "projectAssetsTableLabel": "Projekteszközök táblázata",
    "projectMultiplierTableLabel": "Projektszorzó kiegészítő költségek táblázata",
    "projectLayerLabel": "Projektréteg",
    "configureFieldsLabel": "Mezők konfigurálása",
    "fieldDescriptionHeaderTitle": "Mezőleírás",
    "layerFieldsHeaderTitle": "Rétegmező",
    "selectLabel": "Kiválasztás",
    "errorMessages": {
      "duplicateLayerSelection": "A(z) ${layerName} már ki van választva",
      "invalidConfiguration": "Válassza ki a(z) ${fieldsString} értékét"
    },
    "costingGeometryHelp": "<p>A következő feltételekkel jelennek meg a polygonrétegek: <br/> <li>\tA rétegnek támogatnia kell a lekérdezést</li><li>\tA rétegnek rendelkeznie kell GlobalID mezővel</li></p>",
    "fieldToLabelGeographyHelp": "<p>A kiválasztott Költségszámítási geometriaréteg szöveges és numerikus mezői a Földrajzi terület feliratmezője lenyíló menüben jelennek meg.</p>",
    "projectAssetsTableHelp": "<p>A következő feltételeknek megfelelő táblázatok jelennek meg: <br/> <li>A táblázatnak támogatnia kell a szerkesztési műveleteket, nevezetesen a Létrehozás, Törlés és Frissítés műveletet</li>    <li>A táblázatnak hat, pontos névvel és adattípussal rendelkező mezőt kell tartalmaznia:</li><ul><li>\tEszköz GUID (GUID típusú mező)</li><li>\tKöltségképlet (szöveges mező)</li><li>\tForgatókönyv (szöveges mező)</li><li>\tSablonnév (szöveges mező)</li><li>    Földrajzi terület GUID (GUID típusú mező)</li><li>\tProjekt GUID (GUID típusú mező)</li></ul> </p>",
    "projectMultiplierTableHelp": "<p>A következő feltételeknek megfelelő táblázatok jelennek meg: <br/> <li>A táblázatnak támogatnia kell a szerkesztési műveleteket, nevezetesen a Létrehozás, Törlés és Frissítés műveletet</li>    <li>A táblázatnak öt, pontos névvel és adattípussal rendelkező mezőt kell tartalmaznia:</li><ul><li>\tLeírás (szöveges mező)</li><li>\tTípus (szöveges mező)</li><li>\tÉrték (float/double típusú mező)</li><li>\tKöltségindex (egész szám típusú mező)</li><li>   \tProjekt GUID (GUID típusú mező)</li></ul> </p>",
    "projectLayerHelp": "<p>A következő feltételeknek megfelelő polygonrétegek jelennek meg: <br/> <li>A rétegnek támogatnia kell a szerkesztési műveleteket, nevezetesen a Létrehozás, Törlés és Frissítés műveletet</li>    <li>A rétegnek öt, pontos névvel és adattípussal rendelkező mezőt kell tartalmaznia:</li><ul><li>Projektnév (szöveges mező)</li><li>Leírás (szöveges mező)</li><li>Teljes eszközköltség (fload/double típusú mező)</li><li>Bruttó projektköltség (float/double típusú mező)</li><li>Globális azonosító (GlobalID típusú mező)</li></ul> </p>"
  },
  "layerSettings": {
    "tabTitle": "Rétegbeállítások",
    "layerNameHeaderTitle": "Réteg neve",
    "layerNameHeaderTooltip": "Rétegek listája a térképen",
    "EditableLayerHeaderTitle": "Szerkeszthető",
    "EditableLayerHeaderTooltip": "A költségszámítási widget tartalmazza a réteget és sablonjait",
    "SelectableLayerHeaderTitle": "Kiválasztható",
    "SelectableLayerHeaderTooltip": "A vektoros elemből származó geometria felhasználható új költségelem létrehozásához",
    "fieldPickerHeaderTitle": "Projektazonosító (opcionális)",
    "fieldPickerHeaderTooltip": "Opcionális mező (szöveges típusú) a projektazonosító tárolásához",
    "selectLabel": "Kiválasztás",
    "noAssetLayersAvailable": "Nem található eszközréteg a kiválasztott webtérképen",
    "disableEditableCheckboxTooltip": "Ez a réteg nem támogatja a szerkesztési műveleteket",
    "missingCapabilitiesMsg": "Ennél a rétegnél hiányoznak a következő funkciók:",
    "missingGlobalIdMsg": "Ebben a rétegben nincs GlobalID mező",
    "create": "Létrehozás",
    "update": "Frissítés",
    "delete": "Törlés"
  },
  "costingInfo": {
    "tabTitle": "Költségszámítási információ",
    "proposedMainsLabel": "Javasolt fővezeték",
    "addCostingTemplateLabel": "Költségszámítási sablon hozzáadása",
    "manageScenariosTitle": "Forgatókönyvek kezelése",
    "featureTemplateTitle": "Vektoroselem-sablon",
    "costEquationTitle": "Költségképlet",
    "geographyTitle": "Földrajzi terület",
    "scenarioTitle": "Forgatókönyv",
    "actionTitle": "Műveletek",
    "scenarioNameLabel": "Forgatókönyv neve",
    "addBtnLabel": "Hozzáadás",
    "srNoLabel": "Szám",
    "deleteLabel": "Törlés",
    "duplicateScenarioName": "Ismétlődő forgatókönyvnév",
    "hintText": "<div>Tipp: Használja a következő kulcsszavakat</div><ul><li><b>{TOTALCOUNT}</b>: Azonos típusú eszközök teljes számának használata egy földrajzi területen</li> <li><b>{MEASURE}</b>: A vonal típusú eszköz hosszának és a polygon típusú eszköz területének használata</li><li><b>{TOTALMEASURE}</b>: Az azonos kategóriájú vonal típusú eszközök teljes hosszának és a polygon típusú eszközök teljes területének használata egy földrajzi területen</li></ul> Különféle funkciókat használhat, például:<ul><li>Math.abs(-100)</li><li>Math.floor({TOTALMEASURE})</li></ul>Szerkessze a költségképletet a projekt igényei szerint.",
    "noneValue": "Nincs",
    "requiredCostEquation": "Érvénytelen költségképlet a(z) ${layerName} réteghez: ${templateName}",
    "duplicateTemplateMessage": "Ismétlődő sablonbejegyzés a(z) ${layerName} réteghez: ${templateName}",
    "defaultEquationRequired": "Alapértelmezett képlet szükséges a(z) ${layerName} réteghez: ${templateName}",
    "validCostEquationMessage": "Adjon meg érvényes költségképletet",
    "costEquationHelpText": "Szerkessze a költségképletet a projekt igényei szerint",
    "scenarioHelpText": "Válasszon forgatókönyvet a projekt igényei szerint",
    "copyRowTitle": "Sor másolása",
    "noTemplateAvailable": "Adjon hozzá legalább egy sablont a(z) ${layerName} réteghez",
    "manageScenarioLabel": "Forgatókönyv kezelése",
    "noLayerMessage": "Adjon meg legalább egy réteget a(z) ${tabName} táblázatban",
    "noEditableLayersAvailable": "A réteg(ek)et szerkeszthetőként kell beállítani a rétegbeállítások fülön"
  },
  "statisticsSettings": {
    "tabTitle": "Statisztikai beállítások",
    "addStatisticsLabel": "Statisztika hozzáadása",
    "fieldNameTitle": "Mező",
    "statisticsTitle": "Felirat",
    "addNewStatisticsText": "Új statisztika hozzáadása",
    "deleteStatisticsText": "Statisztika törlése",
    "moveStatisticsUpText": "Statisztika mozgatása feljebb",
    "moveStatisticsDownText": "Statisztika mozgatása lejjebb",
    "selectDeselectAllTitle": "Összes kiválasztása"
  },
  "statisticsType": {
    "countLabel": "Szám",
    "averageLabel": "Átlag",
    "maxLabel": "Maximum",
    "minLabel": "Minimum",
    "summationLabel": "Összegzés",
    "areaLabel": "Terület",
    "lengthLabel": "Hossz"
  }
});