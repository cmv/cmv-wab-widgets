///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
  "_widgetLabel": "Selecció",
  "geometryServicesNotFound": "Servei de geometria no disponible.",
  "unableToDrawBuffer": "No es pot dibuixar l'àrea d'influència. Torneu a intentar-ho.",
  "invalidConfiguration": "Configuració no vàlida.",
  "clearAOIButtonLabel": "Comença de nou",
  "noGraphicsShapefile": "El fitxer shapefile pujat no conté gràfics.",
  "zoomToLocationTooltipText": "Aplica el zoom a la ubicació",
  "noGraphicsToZoomMessage": "No s'han trobat gràfics que es puguin ampliar.",
  "placenameWidget": {
    "placenameLabel": "Cerca una ubicació"
  },
  "drawToolWidget": {
    "useDrawToolForAOILabel": "Selecciona el mode de dibuix",
    "toggleSelectability": "Feu clic per alternar la capacitat de selecció",
    "chooseLayerTitle": "Trieu les capes seleccionables",
    "selectAllLayersText": "Selecciona-ho tot",
    "layerSelectionWarningTooltip": "S'ha de seleccionar almenys una capa per crear una AOI"
  },
  "shapefileWidget": {
    "shapefileLabel": "Puja un fitxer shapefile comprimit",
    "uploadShapefileButtonText": "Puja",
    "unableToUploadShapefileMessage": "No es pot pujar el fitxer shapefile."
  },
  "coordinatesWidget": {
    "selectStartPointFromSearchText": "Defineix un punt d'inici",
    "addButtonTitle": "Afegeix",
    "deleteButtonTitle": "Elimina",
    "mapTooltipForStartPoint": "Feu clic al mapa per definir un punt d'inici",
    "mapTooltipForUpdateStartPoint": "Feu clic al mapa per actualitzar el punt d'inici",
    "locateText": "Localitza",
    "locateByMapClickText": "Seleccioneu les coordenades inicials",
    "enterBearingAndDistanceLabel": "Introduïu el rumb i la distància des del punt d'inici",
    "bearingTitle": "Rumb",
    "distanceTitle": "Distància",
    "planSettingTooltip": "Configuració del pla",
    "invalidLatLongMessage": "Introduïu valors vàlids."
  },
  "bufferDistanceAndUnit": {
    "bufferInputTitle": "Distància d'àrea d'influència (opcional)",
    "bufferInputLabel": "Mostra el resultats de"
  },
  "traverseSettings": {
    "bearingLabel": "Rumb",
    "lengthLabel": "Longitud",
    "addButtonTitle": "Afegeix",
    "deleteButtonTitle": "Elimina"
  },
  "planSettings": {
    "expandGridTooltipText": "Expandeix la quadrícula",
    "collapseGridTooltipText": "Redueix la quadrícula",
    "directionUnitLabelText": "Unitat de les indicacions",
    "distanceUnitLabelText": "Unitats de distància i longitud",
    "planSettingsComingSoonText": "Properament"
  },
  "newTraverse": {
    "invalidBearingMessage": "Rumb no vàlid.",
    "invalidLengthMessage": "Longitud no vàlida.",
    "negativeLengthMessage": "Longitud negativa"
  },
  "reportsTab": {
    "aoiAreaText": "Àrea AOI",
    "downloadButtonTooltip": "Baixa",
    "printButtonTooltip": "Imprimeix",
    "uploadShapefileForAnalysisText": "Puja el fitxer shapefile per incloure'l a l'anàlisi",
    "uploadShapefileForButtonText": "Navega",
    "downloadLabelText": "Seleccioneu el format:",
    "downloadBtnText": "Baixa",
    "noDetailsAvailableText": "No s'ha trobat cap resultat",
    "featureCountText": "Recompte",
    "featureAreaText": "Àrea",
    "featureLengthText": "Longitud",
    "attributeChooserTooltip": "Trieu els atributs que vulgueu visualitzar",
    "csv": "CSV",
    "filegdb": "Geobase de dades de fitxers",
    "shapefile": "Shapefile",
    "noFeaturesFound": "No s'han trobat resultats per al format de fitxer seleccionat",
    "selectReportFieldTitle": "Seleccioneu els camps",
    "noFieldsSelected": "No s'ha seleccionat cap camp",
    "intersectingFeatureExceedsMsgOnCompletion": "S'ha assolit el nombre màxim de registres per a una o diverses capes.",
    "unableToAnalyzeText": "No es pot analitzar perquè s'ha assolit el nombre màxim de registres.",
    "errorInPrintingReport": "No es pot imprimir l'informe. Comproveu si la configuració d'informe és vàlida.",
    "aoiInformationTitle": "Informació de l'àrea d'interès (AOI)",
    "summaryReportTitle": "Resum",
    "notApplicableText": "N/A",
    "downloadReportConfirmTitle": "Confirma la baixada",
    "downloadReportConfirmMessage": "Segur que ho voleu baixar?",
    "noDataText": "Sense dades",
    "createReplicaFailedMessage": "L'operació de baixada ha fallat per a les capes següents: <br/> ${layerNames}",
    "extractDataTaskFailedMessage": "Error en l'operació de baixada.",
    "printLayoutLabelText": "Disseny",
    "printBtnText": "Imprimeix",
    "printDialogHint": "Nota: el títol i els comentaris de l'informe es poden editar a la visualització prèvia de l'informe.",
    "unableToDownloadFileGDBText": "La geobase de dades de fitxers no es pot baixar per a AOI que contenen ubicacions de punts o de línies",
    "unableToDownloadShapefileText": "El fitxer shapefile no es pot baixar per a AOI que contenen ubicacions de punts o de línies",
    "analysisUnitLabelText": "Mostra els resultats en:",
    "analysisUnitButtonTooltip": "Trieu les unitats per a l'anàlisi",
    "analysisCloseBtnText": "Tanca",
    "feetUnit": "Peus o peus quadrats",
    "milesUnit": "Milles o acres",
    "metersUnit": "Metres o metres quadrats",
    "kilometersUnit": "Quilòmetres o quilòmetres quadrats",
    "hectaresUnit": "Quilòmetres o hectàrees",
    "hectaresAbbr": "hectàrees",
    "layerNotVisibleText": "No es pot actualitzar perquè la capa està desactivada o es troba fora de l'interval de visibilitat de l'escala.",
    "refreshBtnTooltip": "Actualitza l'informe",
    "featureCSVAreaText": "Àrea d'intersecció",
    "featureCSVLengthText": "Longitud d'intersecció",
    "errorInFetchingPrintTask": "Error en recuperar la informació de la tasca d'impressió. Torneu-ho a provar.",
    "selectAllLabel": "Selecciona-ho tot"
  }
});