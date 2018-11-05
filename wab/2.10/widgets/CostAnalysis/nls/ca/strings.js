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
  "_widgetLabel": "Anàlisi de costos",
  "unableToFetchInfoErrMessage": "No es poden recuperar els detalls del servei de geometria o de la capa configurada",
  "invalidCostingGeometryLayer": "No es pot obtenir \"esriFieldTypeGlobalID\" a la capa de geometria de valoració de costos.",
  "projectLayerNotFound": "No es troba la capa de projecte que s'ha configurat al mapa.",
  "costingGeometryLayerNotFound": "No es troba la capa de geometria de valoració de costos que s'ha configurat al mapa.",
  "projectMultiplierTableNotFound": "No es troba la taula de costos addicionals del multiplicador del projecte que s'ha configurat al mapa.",
  "projectAssetTableNotFound": "No es troba la taula d'actius del projecte que s'ha configurat al mapa.",
  "createLoadProject": {
    "createProjectPaneTitle": "Crea un projecte",
    "loadProjectPaneTitle": "Carrega el projecte",
    "projectNamePlaceHolder": "Nom del projecte",
    "projectDescPlaceHolder": "Descripció del projecte",
    "selectProject": "Seleccioneu el projecte",
    "viewInMapLabel": "Visualitza-ho al mapa",
    "loadLabel": "Carrega",
    "createLabel": "Crea",
    "deleteProjectConfirmationMsg": "Segur que voleu suprimir el projecte?",
    "noAssetsToViewOnMap": "El projecte seleccionat no té cap actiu per visualitzar al mapa.",
    "projectDeletedMsg": "El projecte s'ha suprimit correctament.",
    "errorInCreatingProject": "Error en crear el projecte.",
    "errorProjectNotFound": "No s'ha trobat el projecte.",
    "errorInLoadingProject": "Comproveu que el projecte seleccionat sigui vàlid.",
    "errorProjectNotSelected": "Seleccioneu un projecte de la llista desplegable",
    "errorDuplicateProjectName": "El nom del projecte ja existeix."
  },
  "statisticsSettings": {
    "tabTitle": "Configuració d'estadístiques",
    "addStatisticsLabel": "Afegeix estadístiques",
    "addNewStatisticsText": "Afegeix estadístiques noves",
    "deleteStatisticsText": "Suprimeix estadístiques",
    "moveStatisticsUpText": "Mou les estadístiques cap amunt",
    "moveStatisticsDownText": "Mou les estadístiques cap avall",
    "layerNameTitle": "Capa",
    "statisticsTypeTitle": "Tipus",
    "fieldNameTitle": "Camp",
    "statisticsTitle": "Etiqueta",
    "actionLabelTitle": "Accions",
    "selectDeselectAllTitle": "Selecciona-ho tot"
  },
  "statisticsType": {
    "countLabel": "Recompte",
    "averageLabel": "Mitjana",
    "maxLabel": "Màxim",
    "minLabel": "Mínim",
    "summationLabel": "Suma",
    "areaLabel": "Àrea",
    "lengthLabel": "Longitud"
  },
  "costingInfo": {
    "noEditableLayersAvailable": "Les capes s'han de marcar com a editables a la pestanya de configuració de capes"
  },
  "workBench": {
    "refresh": "Actualitza",
    "noAssetAddedMsg": "No s'ha afegit cap actiu",
    "units": "unitat(s)",
    "assetDetailsTitle": "Detalls dels elements d'actius",
    "costEquationTitle": "Equació de costos",
    "newCostEquationTitle": "Equació nova",
    "defaultCostEquationTitle": "Equació per defecte",
    "geographyTitle": "Geografia",
    "scenarioTitle": "Escenari",
    "costingInfoHintText": "<div>Suggeriment: utilitzeu les paraules clau següents</div><ul><li><b>{TOTALCOUNT}</b>: utilitza el nombre total de l'actiu del mateix tipus en una geografia</li> <li><b>{MEASURE}</b>: utilitza la longitud de l'actiu de línia i l'àrea de l'actiu de polígon</li><li><b>{TOTALMEASURE}</b>: utilitza la longitud total de l'actiu de línia i l'àrea total de l'actiu de polígon del mateix tipus en una geografia</li></ul> Podeu utilitzar funcions com ara:<ul><li>Math.abs(-100)</li><li>Math.floor({TOTALMEASURE})</li></ul>Editeu l'equació de costos segons sigui necessari per al vostre projecte.",
    "zoomToAsset": "Aplica el zoom a l'actiu",
    "deleteAsset": "Suprimeix l'actiu",
    "closeDialog": "Tanca el diàleg",
    "objectIdColTitle": "ID d'objecte",
    "costColTitle": "Cost",
    "errorInvalidCostEquation": "Equació de costos no vàlida.",
    "errorInSavingAssetDetails": "No es poden desar els detalls dels actius.",
    "featureModeText": "Mode d'entitat",
    "sketchToolTitle": "Esbós",
    "selectToolTitle": "Selecciona"
  },
  "assetDetails": {
    "inGeography": " a ${geography} ",
    "withScenario": " amb ${scenario}",
    "totalCostTitle": "Cost total",
    "additionalCostLabel": "Descripció",
    "additionalCostValue": "Valor",
    "additionalCostNetValue": "Valor net"
  },
  "projectOverview": {
    "assetItemsTitle": "Elements d'actius",
    "assetStatisticsTitle": "Estadístiques d'actius",
    "projectSummaryTitle": "Resum del projecte",
    "projectName": "Nom del projecte: ${name}",
    "totalCostLabel": "Cost total del projecte (*):",
    "grossCostLabel": "Cost brut del projecte (*):",
    "roundingLabel": "* Arrodoniment a \"${selectedRoundingOption}\"",
    "unableToSaveProjectBoundary": "No es pot desar el límit del projecte a la capa del projecte.",
    "unableToSaveProjectCost": "No es poden desar els costos a la capa del projecte.",
    "roundCostValues": {
      "twoDecimalPoint": "Dues comes decimals",
      "nearestWholeNumber": "Nombre enter més proper",
      "nearestTen": "Desena més propera",
      "nearestHundred": "Centenar més proper",
      "nearestThousand": "Miler més proper",
      "nearestTenThousands": "Desena de miler més propera"
    }
  },
  "projectAttribute": {
    "projectAttributeText": "Atribut del projecte",
    "projectAttributeTitle": "Edita els atributs del projecte"
  },
  "costEscalation": {
    "costEscalationLabel": "Afegeix un cost addicional",
    "valueHeader": "Valor",
    "addCostEscalationText": "Afegeix un cost addicional",
    "deleteCostEscalationText": "Suprimeix el cost addicional seleccionat",
    "moveCostEscalationUpText": "Mou el cost addicional seleccionat cap amunt",
    "moveCostEscalationDownText": "Mou el cost addicional seleccionat cap avall",
    "invalidEntry": "Una o diverses entrades no són vàlides.",
    "errorInSavingCostEscalation": "No es poden desar els detalls de costos addicionals."
  },
  "scenarioSelection": {
    "popupTitle": "Seleccioneu un escenari per a l'actiu",
    "regionLabel": "Geografia",
    "scenarioLabel": "Escenari",
    "noneText": "Cap",
    "copyFeatureMsg": "Voleu copiar les entitats seleccionades?"
  },
  "detailStatistics": {
    "detailStatisticsLabel": "Estadístiques dels detalls",
    "noDetailStatisticAvailable": "No s'han afegit estadístiques d'actius"
  },
  "copyFeatures": {
    "title": "Copia les entitats",
    "createFeatures": "Crea les entitats",
    "createSingleFeature": "Crea 1 entitat de geometria múltiple",
    "noFeaturesSelectedMessage": "No s'ha seleccionat cap entitat",
    "selectFeatureToCopyMessage": "Seleccioneu les entitats que voleu copiar."
  }
});