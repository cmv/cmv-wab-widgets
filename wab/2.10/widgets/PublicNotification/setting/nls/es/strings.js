/*
 | Copyright 2017 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define({
  "searchSourceSetting": {
    "title": "Configuración de búsqueda y zona de influencia",
    "mainHint": "Puede habilitar las búsquedas textuales de direcciones y entidades, la digitalización de geometría y las zonas de influencia."
  },
  "addressSourceSetting": {
    "title": "Capas de direcciones",
    "mainHint": "Puede especificar qué capas de etiquetas destinatarias están disponibles."
  },
  "notificationSetting": {
    "title": "Opciones de notificación",
    "mainHint": "Puede especificar qué tipos de notificación están disponibles."
  },
  "groupingLabels": {
    "addressSources": "La capa que se debe usar para seleccionar las capas destinatarias",
    "averyStickersDetails": "Adhesivos Avery(r)",
    "csvDetails": "Archivo de valores separados por comas (CSV)",
    "drawingTools": "Herramientas de dibujo para especificar el área",
    "featureLayerDetails": "Capa de entidades",
    "geocoderDetails": "Geocodificador",
    "labelFormats": "Formatos de etiqueta disponibles",
    "printingOptions": "Opciones para páginas de etiquetas impresas",
    "searchSources": "Buscar fuentes",
    "stickerFormatDetails": "Parámetros de página de etiquetas"
  },
  "hints": {
    "alignmentAids": "Las marcas agregadas a la página de etiquetas que le ayudarán a alinear la página con su impresora",
    "csvNameList": "Una lista separada por comas de nombres de campo que distingue entre mayúsculas y minúsculas",
    "horizontalGap": "Espacio entre dos etiquetas de una fila",
    "insetToLabel": "Espacio entre el lateral de la etiqueta y el inicio del texto",
    "labelFormatDescription": "La forma en que se presenta el estilo de la etiqueta en la lista de opciones de formato del widget",
    "labelFormatDescriptionHint": "Información sobre herramientas para completar la descripción en la lista de opciones de formato",
    "labelHeight": "Altura de cada una de las etiquetas de la página",
    "labelWidth": "Ancho de cada una de las etiquetas de la página",
    "localSearchRadius": "Especifica el radio de un área alrededor del centro del mapa actual que se utilizará para mejorar la clasificación de los candidatos de geocodificación a fin de que se devuelvan primero aquellos más cercanos a la ubicación",
    "rasterResolution": "100 píxeles por pulgada se ajustan aproximadamente a la resolución de pantalla. Cuanto mayor sea la resolución, más memoria de navegador se necesita. Los navegadores difieren en su capacidad para manejar sin problemas grandes demandas de memoria.",
    "selectionListOfOptionsToDisplay": "Los elementos activados se muestran como opciones en el widget; puede cambiar orden como desee",
    "verticalGap": "Espacio entre dos etiquetas en una columna"
  },
  "propertyLabels": {
    "bufferDefaultDistance": "Distancia de zona de influencia predeterminada",
    "bufferUnits": "Las unidades de zona de influencia que se proporcionarán en el widget",
    "countryRegionCodes": "Códigos de país o región",
    "description": "Descripción",
    "descriptionHint": "Sugerencia de descripción",
    "displayField": "Mostrar campo",
    "drawingToolsFreehandPolygon": "polígono a mano alzada",
    "drawingToolsLine": "línea",
    "drawingToolsPoint": "punto",
    "drawingToolsPolygon": "polígono",
    "drawingToolsPolyline": "polilínea",
    "enableLocalSearch": "Habilitar búsqueda local",
    "exactMatch": "Coincidencia exacta",
    "fontSizeAlignmentNote": "Tamaño de fuente para la nota sobre los márgenes de impresión",
    "gridDarkness": "Oscuridad de cuadrícula",
    "gridlineLeftInset": "Línea de cuadrícula izquierda insertada",
    "gridlineMajorTickMarksGap": "Marcas principales cada",
    "gridlineMinorTickMarksGap": "Marcas secundarias cada",
    "gridlineRightInset": "Línea de cuadrícula derecha insertada",
    "labelBorderDarkness": "Oscuridad de borde de etiqueta",
    "labelBottomEdge": "Borde inferior de etiquetas en la página",
    "labelFontSize": "Tamaño de fuente",
    "labelHeight": "Altura de etiqueta",
    "labelHorizontalGap": "Hueco horizontal",
    "labelInitialInset": "Inserto en texto de etiqueta",
    "labelLeftEdge": "Borde izquierdo de etiquetas en la página",
    "labelMaxLineCount": "Número máximo de líneas en la etiqueta",
    "labelPageHeight": "Altura de página",
    "labelPageWidth": "Ancho de página",
    "labelRightEdge": "Borde derecho de etiquetas en la página",
    "labelsInAColumn": "Número de etiquetas en una columna",
    "labelsInARow": "Número de etiquetas en una fila",
    "labelTopEdge": "Borde superior de etiquetas en la página",
    "labelVerticalGap": "Hueco vertical",
    "labelWidth": "Ancho de etiqueta",
    "limitSearchToMapExtent": "Buscar solo en la extensión de mapa actual",
    "maximumResults": "Resultados máximos",
    "maximumSuggestions": "Máximo de sugerencias",
    "minimumScale": "Escala mínima",
    "name": "Nombre",
    "percentBlack": "% negro",
    "pixels": "píxeles",
    "pixelsPerInch": "píxeles por pulgada",
    "placeholderText": "Texto del marcador de posición",
    "placeholderTextForAllSources": "Texto del marcador de posición para buscar todas las fuentes",
    "radius": "Radio",
    "rasterResolution": "Resolución del ráster",
    "searchFields": "Campos de búsqueda",
    "showAlignmentAids": "Mostrar ayudas de alineación en la página",
    "showGridTickMarks": "Mostrar marcas de cuadrícula",
    "showLabelOutlines": "Mostrar contornos de etiquetas",
    "showPopupForFoundItem": "Mostrar ventana emergente de la entidad o la ubicación encontrada",
    "tool": "Herramientas",
    "units": "Unidades",
    "url": "Dirección URL",
    "urlToGeometryService": "URL a servicio de geometría",
    "useRelatedRecords": "Usar sus registros relacionados",
    "useSecondarySearchLayer": "Usar capa de selección secundaria",
    "useSelectionDrawTools": "Usar herramientas de dibujo de selección",
    "useVectorFonts": "Usar fuentes vectoriales (solo fuentes latinas)",
    "zoomScale": "Escala de zoom"
  },
  "buttons": {
    "addAddressSource": "Agregar capa que contenga las etiquetas de direcciones en su elemento emergente",
    "addLabelFormat": "Agregar formato de etiqueta",
    "addSearchSource": "Agregar fuente de búsqueda",
    "set": "Establecer"
  },
  "placeholders": {
    "averyExample": "p. ej., Etiqueta Avery(r) ${averyPartNumber}",
    "countryRegionCodes": "p. ej., USA, CHN",
    "descriptionCSV": "Valores separados por comas",
    "descriptionPDF": "Etiqueta en PDF ${heightLabelIn} x ${widthLabelIn} pulgadas; ${labelsPerPage} por página"
  },
  "tooltips": {
    "getWebmapFeatureLayer": "Obtener capa de entidades del mapa web",
    "openCountryCodes": "Haga clic para obtener más información sobre códigos",
    "openFieldSelector": "Haga clic para abrir un selector de campo",
    "setAndValidateURL": "Establecer y validar la URL"
  },
  "problems": {
    "noAddresseeLayers": "Especificar al menos una capa destinataria",
    "noBufferUnitsForDrawingTools": "Configurar al menos una unidad de zona de influencia para las herramientas de dibujo",
    "noBufferUnitsForSearchSource": "Configurar al menos una unidad de zona de influencia para el origen de búsqueda \"${sourceName}\"",
    "noGeometryServiceURL": "Configurar la URL para el servicio de geometría",
    "noNotificationLabelFormats": "Especificar al menos un formato de etiqueta de notificación",
    "noSearchSourceFields": "Configurar uno o varios campos de búsqueda para el origen de búsqueda \"${sourceName}\"",
    "noSearchSourceURL": "Configurar la URL para el origen de búsqueda \"${sourceName}\""
  },
  "querySourceSetting": {
    "sourceSetting": "Configuración de origen de búsqueda",
    "instruction": "Agrega y configura servicios de geocodificación o capas de entidades como fuentes de búsqueda. Estas fuentes especificadas determinan qué se puede buscar en el cuadro de búsqueda.",
    "add": "Agregar origen de búsqueda",
    "addGeocoder": "Agregar geocodificador",
    "geocoder": "Geocodificador",
    "setLayerSource": "Definir origen de capa",
    "setGeocoderURL": "Definir dirección URL de geocodificador",
    "searchableLayer": "Capa de entidades",
    "name": "Nombre",
    "countryCode": "Código(s) de país o región",
    "countryCodeEg": "p. ej., ",
    "countryCodeHint": "Si se deja este valor en blanco, se buscará en todos los países y regiones",
    "generalSetting": "Configuración general",
    "allPlaceholder": "Texto del marcador de posición para buscar en todo: ",
    "showInfoWindowOnSelect": "Mostrar ventana emergente de la entidad o la ubicación encontrada",
    "showInfoWindowOnSelect2": "Mostrar ventana emergente cuando se encuentre la entidad o ubicación.",
    "searchInCurrentMapExtent": "Buscar solo en la extensión de mapa actual",
    "zoomScale": "Escala de zoom",
    "locatorUrl": "Dirección URL del geocodificador",
    "locatorName": "Nombre del geocodificador",
    "locatorExample": "Ejemplo",
    "locatorWarning": "No se admite esta versión del servicio de geocodificación. El widget admite servicios de geocodificación 10.1 y superiores.",
    "locatorTips": "No hay sugerencias disponibles porque el servicio de geocodificación no admite la opción de sugerencias.",
    "layerSource": "Origen de capa",
    "searchLayerTips": "No hay sugerencias disponibles porque el servicio de entidades no admite la opción de paginación.",
    "placeholder": "Texto del marcador de posición",
    "searchFields": "Campos de búsqueda",
    "displayField": "Mostrar campo",
    "exactMatch": "Coincidencia exacta",
    "maxSuggestions": "Máximo de sugerencias",
    "maxResults": "Resultados máximos",
    "enableLocalSearch": "Habilitar búsqueda local",
    "minScale": "Escala mínima",
    "minScaleHint": "Si la escala del mapa es mayor que esta escala, se aplicará la búsqueda local",
    "radius": "Radio",
    "radiusHint": "Permite especificar el radio de un área alrededor del centro del mapa actual que se utilizará para mejorar la clasificación de los candidatos de geocodificación a fin de que se devuelvan primero aquellos más cercanos a la ubicación",
    "meters": "Metros",
    "setSearchFields": "Definir campos de búsqueda",
    "set": "Definir",
    "fieldSearchable": "permite búsqueda",
    "fieldName": "Nombre",
    "fieldAlias": "Alias",
    "ok": "Aceptar",
    "cancel": "Cancelar",
    "invalidUrlTip": "No se puede acceder a la dirección URL ${URL} o bien no es válida."
  }
});