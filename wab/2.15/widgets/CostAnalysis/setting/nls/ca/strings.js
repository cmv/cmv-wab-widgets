///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
  "configText": "Defineix el text de configuració:",
  "generalSettings": {
    "tabTitle": "Configuració general",
    "measurementUnitLabel": "Unitat de cost",
    "currencyLabel": "Símbol de cost",
    "roundCostLabel": "Arrodoneix el cost",
    "projectOutputSettings": "Configuració de sortida del projecte",
    "typeOfProjectAreaLabel": "Tipus d'àrea de projecte",
    "bufferDistanceLabel": "Distància d'àrea d'influència",
    "csvReportExportLabel": "Permet a l'usuari exportar l'informe del projecte",
    "editReportSettingsBtnTooltip": "Edita la configuració d'informe",
    "roundCostValues": {
      "twoDecimalPoint": "Dues comes decimals",
      "nearestWholeNumber": "Nombre enter més proper",
      "nearestTen": "Desena més propera",
      "nearestHundred": "Centenar més proper",
      "nearestThousand": "Miler més proper",
      "nearestTenThousands": "Desena de miler més propera"
    },
    "reportSettings": {
      "reportSettingsPopupTitle": "Configuració d'informe",
      "reportNameLabel": "Nom de l'informe (opcional):",
      "checkboxLabel": "Mostra",
      "layerTitle": "Títol",
      "columnLabel": "Etiqueta",
      "duplicateMsg": "Etiqueta duplicada"
    },
    "projectAreaType": {
      "outline": "Contorn",
      "buffer": "Àrea d'influència"
    },
    "errorMessages": {
      "currency": "Unitat de moneda no vàlida",
      "bufferDistance": "Distància de l'àrea d'influència no vàlida",
      "outOfRangebufferDistance": "El valor ha de ser major que 0 i menor o igual que 100"
    }
  },
  "projectSettings": {
    "tabTitle": "Configuració del projecte",
    "costingGeometrySectionTitle": "Defineix la geografia per a la valoració de costos (opcional)",
    "costingGeometrySectionNote": "Nota: la configuració d'aquesta capa permetrà que l'usuari defineixi les equacions de costos de les plantilles d'entitats en funció de la geografia.",
    "projectTableSectionTitle": "Capacitat de desar o carregar la configuració del projecte (opcional)",
    "projectTableSectionNote": "Nota: la configuració de totes les taules i capes permetrà que l'usuari desi o carregui el projecte per utilitzar-lo posteriorment.",
    "costingGeometryLayerLabel": "Capa de geometria de valoració de costos",
    "fieldLabelGeography": "Camp per etiquetar geografia",
    "projectAssetsTableLabel": "Taula d'actius del projecte",
    "projectMultiplierTableLabel": "Taula de costos addicionals del multiplicador del projecte",
    "projectLayerLabel": "Capa del projecte",
    "configureFieldsLabel": "Configura els camps",
    "fieldDescriptionHeaderTitle": "Descripció del camp",
    "layerFieldsHeaderTitle": "Camp de capa",
    "selectLabel": "Selecciona",
    "errorMessages": {
      "duplicateLayerSelection": "${layerName} ja s'ha seleccionat",
      "invalidConfiguration": "Seleccioneu ${fieldsString}"
    },
    "costingGeometryHelp": "<p>Es mostraran les capes de polígon amb les condicions següents: <br/> <li>\tLa capa ha de tenir la funció \"Consulta\"</li><li>\tLa capa ha de tenir un camp GlobalID</li></p>",
    "fieldToLabelGeographyHelp": "<p>Els camps de cadena i numèrics de la \"Capa de geometria de valoració de costos\" seleccionada es mostraran a la llista desplegable \"Camp per etiquetar geografia\".</p>",
    "projectAssetsTableHelp": "<p>Es mostraran les taules amb les condicions següents: <br/> <li>La taula ha de tenir funcions d'edició, com ara \"Crea\", \"Suprimeix\" i \"Actualitza\"</li>    <li>La taula ha de tenir sis camps amb el nom i el tipus de dades exactes:</li><ul><li>\tAssetGUID (camp de tipus GUID)</li><li>\tCostEquation (camp de tipus cadena)</li><li>\tEscenari (camp de tipus cadena)</li><li>\tTemplateName (camp de tipus cadena)</li><li>    GeographyGUID (camp de tipus GUID)</li><li>\tProjectGUID (camp de tipus GUID)</li></ul> </p>",
    "projectMultiplierTableHelp": "<p>Es mostraran les taules amb les condicions següents: <br/> <li>La taula ha de tenir les funcions d'edició \"Crea\", \"Suprimeix\" i \"Actualitza\"</li>    <li>La taula ha de tenir cinc camps amb el nom i el tipus de dades exactes:</li><ul><li>\tDescripció (camp de tipus cadena)</li><li>\tTipus (camp de tipus cadena)</li><li>\tValor (camp de tipus valor flotant o doble)</li><li>\tCostindex (camp de tipus enter)</li><li>   \tProjectGUID (camp de tipus GUID)</li></ul> </p>",
    "projectLayerHelp": "<p>Es mostraran les capes de polígon amb les condicions següents: <br/> <li>La capa ha de tenir funcions d'edició, com ara \"Crea, \"Suprimeix\" i \"Actualitza\"</li>    <li>La capa ha de tenir cinc camps amb el nom i el tipus de dades exactes:</li><ul><li>ProjectName (camp de tipus cadena)</li><li>Descripció (camp de tipus cadena)</li><li>Totalassetcost (camp de tipus valor flotant o doble)</li><li>Grossprojectcost (camp de tipus valor flotant o doble)</li><li>GlobalID (camp de tipus GlobalID)</li></ul> </p>",
    "pointLayerCentroidLabel": "Centroide de la capa de punts",
    "selectRelatedPointLayerDefaultOption": "Selecciona",
    "pointLayerHintText": "<p>Es mostraran les capes de punts amb les condicions següents: <br/> <li>\tLa capa ha de tenir el camp \"Projectid\" (tipus de GUID)</li><li>\tLa capa ha de tenir funcions d'edició, com ara \"Crea\", \"Suprimeix\" i \"Actualitza\"</li><p/>"
  },
  "layerSettings": {
    "tabTitle": "Configuració de capa",
    "layerNameHeaderTitle": "Nom de la capa",
    "layerNameHeaderTooltip": "Llista de capes del mapa",
    "EditableLayerHeaderTitle": "Editable",
    "EditableLayerHeaderTooltip": "Inclou la capa i les seves plantilles al widget de valoració de costos",
    "SelectableLayerHeaderTitle": "Seleccionable",
    "SelectableLayerHeaderTooltip": "La geometria de l'entitat es pot utilitzar per generar un element de cost nou",
    "fieldPickerHeaderTitle": "ID de projecte (opcional)",
    "fieldPickerHeaderTooltip": "Camp opcional (de tipus cadena) per emmagatzemar l'ID de projecte a",
    "selectLabel": "Selecciona",
    "noAssetLayersAvailable": "No s'ha trobat cap capa d'actius al mapa web seleccionat",
    "disableEditableCheckboxTooltip": "Aquesta capa no té cap funció d'edició",
    "missingCapabilitiesMsg": "A aquesta capa li falten les funcions següents:",
    "missingGlobalIdMsg": "Aquesta capa no té el camp GlobalId",
    "create": "Crea",
    "update": "Actualitza",
    "deleteColumnLabel": "Suprimeix",
    "attributeSettingHeaderTitle": "Configuració d'atributs",
    "addFieldLabelTitle": "Afegeix atributs",
    "layerAttributesHeaderTitle": "Atributs de capa",
    "projectLayerAttributesHeaderTitle": "Atributs de capa del projecte",
    "attributeSettingsPopupTitle": "Configuració d'atributs de capa"
  },
  "costingInfo": {
    "tabTitle": "Informació de valoració de costos",
    "proposedMainsLabel": "Xarxes de subministrament proposades",
    "addCostingTemplateLabel": "Afegeix una plantilla de valoració de costos",
    "manageScenariosTitle": "Administra els escenaris",
    "featureTemplateTitle": "Plantilla d'entitats",
    "costEquationTitle": "Equació de costos",
    "geographyTitle": "Geografia",
    "scenarioTitle": "Escenari",
    "actionTitle": "Accions",
    "scenarioNameLabel": "Nom de l'escenari",
    "addBtnLabel": "Afegeix",
    "srNoLabel": "Núm.",
    "deleteLabel": "Suprimeix",
    "duplicateScenarioName": "Nom d'escenari duplicat",
    "hintText": "<div>Suggeriment: utilitzeu les paraules clau següents</div><ul><li><b>{TOTALCOUNT}</b>: utilitza el nombre total de l'actiu del mateix tipus en una geografia</li><li><b>{MEASURE}</b>: utilitza la longitud de l'actiu de línia i l'àrea de l'actiu de polígon</li><li><b>{TOTALMEASURE}</b>: utilitza la longitud total de l'actiu de línia i l'àrea total de l'actiu de polígon del mateix tipus en una geografia</li></ul>Podeu utilitzar funcions com ara:<ul><li>Math.abs(-100)</li><li>Math.floor({TOTALMEASURE})</li></ul>Editeu l'equació de costos segons sigui necessari per al vostre projecte.",
    "noneValue": "Cap",
    "requiredCostEquation": "Equació de costos no vàlida per a ${layerName}: ${templateName}",
    "duplicateTemplateMessage": "Existeix una entrada de plantilla duplicada per a ${layerName}: ${templateName}",
    "defaultEquationRequired": "Es necessita l'equació per defecte per a ${layerName}: ${templateName}",
    "validCostEquationMessage": "Introduïu una equació de costos vàlida",
    "costEquationHelpText": "Editeu l'equació de costos segons les necessitats del vostre projecte",
    "scenarioHelpText": "Seleccioneu l'escenari segons les necessitats del vostre projecte",
    "copyRowTitle": "Copia la fila",
    "noTemplateAvailable": "Afegiu com a mínim una plantilla per a ${layerName}",
    "manageScenarioLabel": "Administra l'escenari",
    "noLayerMessage": "Introduïu com a mínim una capa a ${tabName}",
    "noEditableLayersAvailable": "Les capes s'han de marcar com a editables a la pestanya de configuració de capes",
    "updateProjectCostCheckboxLabel": "Actualitza les equacions del projecte",
    "updateProjectCostEquationHint": "Suggeriment: això permetrà a l'usuari actualitzar les equacions de costos d'actius que ja s'han afegit a projectes existents amb les noves equacions que es defineixen a continuació en funció de la plantilla d'entitats, la geografia i l'escenari. Si no es troba la combinació, es definirà en l'equació de costos per defecte (és a dir, el valor de la geografia i l'escenari serà \"Cap\"). En el cas d'una plantilla d'entitats suprimida, el cost es definirà en 0."
  },
  "statisticsSettings": {
    "tabTitle": "Configuració addicional",
    "addStatisticsLabel": "Afegeix estadístiques",
    "fieldNameTitle": "Camp",
    "statisticsTitle": "Etiqueta",
    "addNewStatisticsText": "Afegeix estadístiques noves",
    "deleteStatisticsText": "Suprimeix estadístiques",
    "moveStatisticsUpText": "Mou les estadístiques cap amunt",
    "moveStatisticsDownText": "Mou les estadístiques cap avall",
    "selectDeselectAllTitle": "Selecciona-ho tot"
  },
  "projectCostSettings": {
    "addProjectCostLabel": "Afegeix un cost del projecte addicional",
    "additionalCostValueColumnHeader": "Valor",
    "invalidProjectCostMessage": "Entrada de cost del projecte no vàlida",
    "additionalCostLabelColumnHeader": "Etiqueta",
    "additionalCostTypeColumnHeader": "Tipus"
  },
  "statisticsType": {
    "countLabel": "Recompte",
    "averageLabel": "Mitjana",
    "maxLabel": "Màxim",
    "minLabel": "Mínim",
    "summationLabel": "Suma",
    "areaLabel": "Àrea",
    "lengthLabel": "Longitud"
  }
});