///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
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
    "standardUnit": "Unidad estándar",
    "metricUnit": "Unidad métrica"
  },
  "analysisTab": {
    "analysisTabLabel": "Análisis",
    "selectAnalysisLayerLabel": "Seleccionar capas de análisis",
    "addLayerLabel": "Agregar capas",
    "noValidLayersForAnalysis": "No se han encontrado capas válidas en el mapa web seleccionado.",
    "noValidFieldsForAnalysis": "No se han encontrado campos válidos en el mapa web seleccionado. Elimine la capa seleccionada.",
    "addLayersHintText": "Sugerencia: seleccione las capas y los campos que desea analizar y mostrar en el informe",
    "addLayerNameTitle": "Nombre de capa",
    "addFieldsLabel": "Agregar campo",
    "addFieldsPopupTitle": "Selecciona campos",
    "addFieldsNameTitle": "Nombres de campo",
    "aoiToolsLegendLabel": "Herramientas AOI",
    "aoiToolsDescriptionLabel": "Habilite las herramientas para crear áreas de interés y especifique sus etiquetas",
    "placenameLabel": "Nombre de lugar",
    "drawToolsLabel": "Herramientas de dibujo",
    "uploadShapeFileLabel": "Cargar un shapefile",
    "coordinatesLabel": "Coordenadas",
    "coordinatesDrpDwnHintText": "Sugerencia: seleccione una unidad para visualizar los trazados poligonales introducidos",
    "coordinatesBearingDrpDwnHintText": "Sugerencia: seleccione un rumbo para visualizar los trazados poligonales introducidos",
    "allowShapefilesUploadLabel": "Permitir carga de shapefiles en el análisis",
    "areaUnitsLabel": "Mostrar áreas/longitudes en",
    "allowShapefilesUploadLabelHintText": "Sugerencia: muestre \"Cargar shapefile en el análisis\" en la pestaña Informe",
    "maxFeatureForAnalysisLabel": "Número máximo de entidades para el análisis",
    "maxFeatureForAnalysisHintText": "Sugerencia: defina el número máximo de entidades para el análisis",
    "searchToleranceLabelText": "Tolerancia de búsqueda (pies)",
    "searchToleranceHint": "Sugerencia: la tolerancia de búsqueda solo se usa cuando se analizan entradas de punto y de línea"
  },
  "downloadTab": {
    "downloadLegend": "Configuración de descarga",
    "reportLegend": "Ajustes de informe",
    "downloadTabLabel": "Descargar",
    "syncEnableOptionLabel": "Capas de entidades",
    "syncEnableOptionHint": "Sugerencia: se usa para descargar información de entidades para las entidades que se intersecan con el área de interés en los formatos indicados.",
    "syncEnableOptionNote": "Nota: los servicios de entidades con la sincronización habilitada son necesarios para la opción Geodatabase de archivos.",
    "extractDataTaskOptionLabel": "Servicio de geoprocesamiento Tarea de extracción de datos",
    "extractDataTaskOptionHint": "Sugerencia: use un servicio de geoprocesamiento Tarea de extracción de datos publicado para descargar las entidades que se intersecan con el área de interés en los formatos Geodatabase de archivos o Shapefile.",
    "cannotDownloadOptionLabel": "Deshabilitar descarga",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Nombre de capa",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "Geodatabase de archivos",
      "allowDownloadLabel": "Permitir descarga"
    },
    "setButtonLabel": "Establecer",
    "GPTaskLabel": "Especificar la dirección URL del servicio de geoprocesamiento",
    "printGPServiceLabel": "Dirección URL del servicio de impresión",
    "setGPTaskTitle": "Especificar la dirección URL del servicio de geoprocesamiento requerido",
    "logoLabel": "Logo",
    "logoChooserHint": "Sugerencia: haga clic en el icono de la imagen para cambiar la imagen",
    "footnoteLabel": "Nota a pie de página",
    "columnTitleColorPickerLabel": "Color para los títulos de las columnas",
    "reportTitleLabel": "Título del informe",
    "errorMessages": {
      "invalidGPTaskURL": "Servicio de geoprocesamiento no válido. Seleccione un servicio de geoprocesamiento que contenga Tarea de extracción de datos.",
      "noExtractDataTaskURL": "Seleccione cualquier servicio de geoprocesamiento que contenga Tarea de extracción de datos."
    }
  },
  "generalTab": {
    "generalTabLabel": "General",
    "tabLabelsLegend": "Etiquetas del panel",
    "tabLabelsHint": "Sugerencia: especifique las etiquetas",
    "AOITabLabel": "Panel Área de interés",
    "ReportTabLabel": "Panel Informe",
    "bufferSettingsLegend": "Configuración de la zona de influencia",
    "defaultBufferDistanceLabel": "Distancia de zona de influencia predeterminada",
    "defaultBufferUnitsLabel": "Unidades de zona de influencia",
    "generalBufferSymbologyHint": "Sugerencia: defina la simbología que se debe usar para visualizar las zonas de influencia alrededor de las áreas de interés definidas",
    "aoiGraphicsSymbologyLegend": "Simbología de gráficos de AOI",
    "aoiGraphicsSymbologyHint": "Sugerencia: configure la simbología que se debe usar al definir áreas de interés de punto, de línea y poligonales",
    "pointSymbologyLabel": "Punto",
    "previewLabel": "Previsualización",
    "lineSymbologyLabel": "Línea",
    "polygonSymbologyLabel": "Polígono",
    "aoiBufferSymbologyLabel": "Simbología de zona de influencia",
    "pointSymbolChooserPopupTitle": "Símbolo de dirección o ubicación",
    "polygonSymbolChooserPopupTitle": "Seleccionar símbolo para resaltar polígono",
    "lineSymbolChooserPopupTitle": "Seleccionar símbolo para resaltar línea",
    "aoiSymbolChooserPopupTitle": "Definir símbolo de zona de influencia"
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Configuración de fuente de búsqueda",
    "searchSourceSettingTitle": "Configuración de fuente de búsqueda",
    "searchSourceSettingTitleHintText": "Agrega y configura servicios de geocodificación o capas de entidades como fuentes de búsqueda. Estas fuentes especificadas determinan qué se puede buscar en el cuadro de búsqueda",
    "addSearchSourceLabel": "Agregar origen de búsqueda",
    "featureLayerLabel": "Capa de entidades",
    "geocoderLabel": "Geocodificador",
    "generalSettingLabel": "Configuración general",
    "allPlaceholderLabel": "Texto del marcador de posición para buscar en todo:",
    "allPlaceholderHintText": "Sugerencia: escriba el texto que se va a mostrar como marcador de posición mientras busca todas las capas y el geocodificador",
    "generalSettingCheckboxLabel": "Mostrar ventana emergente de la entidad o la ubicación encontrada",
    "countryCode": "Código(s) de país o región",
    "countryCodeEg": "p. ej., ",
    "countryCodeHint": "Si se deja este valor en blanco, se buscará en todos los países y regiones",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Buscar solo en la extensión de mapa actual",
    "zoomScale": "Aplicar zoom a escala",
    "locatorUrl": "Dirección URL del geocodificador",
    "locatorName": "Nombre del geocodificador",
    "locatorExample": "Ejemplo",
    "locatorWarning": "No se admite esta versión del servicio de geocodificación. El widget admite servicios de geocodificación 10.0 y superiores.",
    "locatorTips": "No hay sugerencias disponibles porque el servicio de geocodificación no admite la opción de sugerencias.",
    "layerSource": "Origen de capa",
    "setLayerSource": "Establecer origen de capa",
    "setGeocoderURL": "Establecer dirección URL de geocodificador",
    "searchLayerTips": "No hay sugerencias disponibles porque el servicio de entidades no admite la opción de paginación.",
    "placeholder": "Texto del marcador de posición",
    "searchFields": "Campos de búsqueda",
    "displayField": "Mostrar campo",
    "exactMatch": "Coincidencia exacta",
    "maxSuggestions": "Máximo de sugerencias",
    "maxResults": "Resultados máximos",
    "enableLocalSearch": "Habilitar búsqueda local",
    "minScale": "Escala Mínima",
    "minScaleHint": "Si la escala del mapa es mayor que esta escala, se aplicará la búsqueda local",
    "radius": "Radio",
    "radiusHint": "Permite especificar el radio de un área alrededor del centro del mapa actual que se utilizará para mejorar la clasificación de los candidatos de geocodificación a fin de que se devuelvan primero aquellos más cercanos a la ubicación",
    "setSearchFields": "Establecer campos de búsqueda",
    "set": "Establecer",
    "invalidUrlTip": "No se puede acceder a la dirección URL ${URL} o bien no es válida.",
    "invalidSearchSources": "Configuración de fuente de búsqueda no válida"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Rellene los campos obligatorios",
    "bufferDistanceFieldsErrorMsg": "Introduzca valores válidos",
    "invalidSearchToleranceErrorMsg": "Introduzca un valor válido para la tolerancia de búsqueda",
    "atLeastOneCheckboxCheckedErrorMsg": "Configuración no válida",
    "noLayerAvailableErrorMsg": "No hay capas disponibles",
    "layerNotSupportedErrorMsg": "No compatible ",
    "noFieldSelected": "Use la acción de editar para seleccionar los campos para el análisis.",
    "duplicateFieldsLabels": "Se ha agregado una etiqueta duplicada \"${labelText}\" para: \"${itemNames}\"",
    "noLayerSelected": "Seleccione al menos una capa para el análisis",
    "errorInSelectingLayer": "No se puede completar la operación de selección de la capa. Vuelva a intentarlo.",
    "errorInMaxFeatureCount": "Introduzca el número máximo de entidades válido para el análisis."
  }
});