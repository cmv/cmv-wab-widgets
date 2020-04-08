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
  root: ({
    units: { // labels shown in config UI for "Show analysis results in" dropdwn options
      areaSquareFeetUnit: "Square Feet",
      areaAcresUnit: "Acres",
      areaSquareMetersUnit: "Square Meters",
      areaSquareKilometersUnit: "Square Kilometers",
      areaHectaresUnit: "Hectares",
      areaSquareMilesUnit: "Square Miles",
      lengthFeetUnit: "Feet",
      lengthMilesUnit: "Miles",
      lengthMetersUnit: "Meters",
      lengthKilometersUnit: "Kilometers"
    },
    analysisTab: {
      analysisTabLabel: "Analysis", // shown as label in config UI for first tab.
      selectAnalysisLayerLabel: "Analysis Layers", // shown as main label in config UI for Add Layer section.
      addLayerLabel: "Add Layers", // shown as label in config UI for button add layer for Add Layer section.
      noValidLayersForAnalysis: "No valid layers found in the selected web map.", // shown as label in config UI if no valid layers found in the selected webmap.
      noValidFieldsForAnalysis: "No valid fields found in the selected web map. Please remove the selected layer.", // shown as label in config UI if no valid fields found in the selected webmap.
      allowGroupingLabel: "Group features by field with same value",
      groupingHintDescription: "Hint: By default, all features with the same value for the selected fields will be grouped to appear as a single entry in the report. Disable grouping by like attributes to display an entry for each feature instead.",
      addLayersHintText: "Hint: Choose the layers and fields to include in the analysis and report", // shown as hint text in config UI for Add layers section.
      addLayerNameTitle: "Layer Name", // shown as title in config UI for add layer Name in Add Layer section.
      addFieldsLabel: "Add Field", // shown as label in config UI for button add field for Add Fields section.
      addFieldsPopupTitle: "Select Fields", // shown as title in config UI for add Fields Popup title in Add Fields section.
      addFieldsNameTitle: "Field Names", // shown as title in config UI for add Fields Name in Add Fields section.
      aoiToolsLegendLabel: "Area of Interest Tools", // shown as legend for fieldset in config UI for AOI Tools.
      aoiToolsDescriptionLabel: "Choose and label the tools available for creating the area of interest.", // shown as label in config UI for AOI tools description label in AOI Tools
      placenameLabel: "Place Name", // shown as label in config UI for placename in AOI Tools section
      drawToolsLabel: "Choose drawing tools", // shown as label in config UI for drawTools in AOI Tools section
      uploadShapeFileLabel: "Upload a shapefile", // shown as label in config UI for uploadShapeFile in AOI Tools section
      coordinatesLabel: "Coordinates", // shown as label in config UI for coordinates in AOI Tools section
      coordinatesDrpDwnHintText: "Hint: Choose unit to display entered traverses", // Shown as hint text in config UI for coordinates DropDown hint text.
      coordinatesBearingDrpDwnHintText: "Hint: Choose bearing to display entered traverses", // Shown as hint text in config UI for coordinates DropDown hint text.
      allowShapefilesUploadLabel: "Allow users to upload shapefiles to include in the analysis", // shown as main label in config UI for allow uploading shapefiles section.
      allowShapefilesUploadLabelHintText: "Hint: Add an option to the Report tab where users can upload their own data as a shapefile for inclusion in the analysis report", // Shown as hint text in config UI for area units DropDown hint text.
      allowVisibleLayerAnalysisLabel: "Do not analyze or report results for layers that are not visible", // shown as main label in config UI for allow invisble layer analysis option section.
      allowVisibleLayerAnalysisHintText: "Hint: Layers that have been turned off or are not visible due to scale visibility settings will not be analyzed or included in printed or downloaded results.", // Shown as hint text in config UI for allow invisble layer analysis option section.
      areaUnitsLabel: "Units for analysis results(Area)", // shown as main label in config UI for area units dropdown section.
      lengthUnitsLabel: "Units for analysis results(Length)", // shown as main label in config UI for area units dropdown section.
      maxFeatureForAnalysisLabel: "Maximum number of features to analyze", // Shown as the label for max features for analysis
      maxFeatureForAnalysisHintText: "Hint: Set the maximum number of features that will be included in the analysis", // Shown as the hint text for max features for analysis
      searchToleranceLabelText: "Search tolerance", // Shown as label in config UI for search tolerance
      searchToleranceHint: "Hint: The search tolerance is used when analyzing point and line inputs", // Shown as the hint text for search tolerance
      placenameButtonText: "Place name",
      drawToolsButtonText: "Draw",
      shapefileButtonText: "Shapefile",
      coordinatesButtonText: "Coordinates",
      invalidLayerErrorMsg: "Please configure the fields for",
      drawToolSelectableLayersLabel: "Choose selectable layers",
      drawToolSelectableLayersHint: "Hint: Choose the layers that contain the features that can be selected using the Select draw tool",
      drawToolsSettingsFieldsetLabel: "Drawing Tools",
      drawToolPointLabel: "Point",
      drawToolPolylineLabel: "Polyline",
      drawToolExtentLabel: "Extent",
      drawToolPolygonLabel: "Polygon",
      drawToolCircleLabel: "Circle",
      selectDrawToolsText: "Choose the drawing tools available for creating the area of interest",
      selectingDrawToolErrorMessage: "Choose at least one drawing tool or selection layer to use the Draw Tools option for AOI Tools."
    },
    downloadTab: {
      downloadLegend: "Download Settings", // Shown as fieldset legend for download settings
      reportLegend: "Report Settings", // Shown as fieldset legend for report settings
      downloadTabLabel: "Download", // Shown as the label of the tab
      syncEnableOptionLabel: "Feature layers", // Shown as the label for sync enable download option
      syncEnableOptionHint: "Hint: Choose the layers which can be downloaded and specify the formats in which each layer is available. Downloaded datasets will include those features that intersect the area of interest.", // Shown as the hint text for sync enable download option
      syncEnableOptionNote: "Note: File geodatabase and shapefile downloads require sync-enabled feature layers. The shapefile format is only supported with ArcGIS Online hosted feature layers.", // Shown as the special note in the hint text for sync enable download option
      extractDataTaskOptionLabel: "Extract Data Task geoprocessing service", // Shown as the label for extract data task download option
      extractDataTaskOptionHint: "Hint: Use a published Extract Data Task geoprocessing service to download features that intersect the area of interest in file geodatabase or shapefile formats.", // Shown as the hint for extract data task download option
      cannotDownloadOptionLabel: "Disable download", // Shown as the label for disabling download option in widget
      syncEnableTableHeaderTitle: {
        layerNameLabel: "Layer name", // Shown as the table header for layer name
        csvFileFormatLabel: "CSV", // Shown as the table header for CSV file format
        fileGDBFormatLabel: "File Geodatabase", // Shown as the table header for File Geodatabase file format
        ShapefileFormatLabel: "Shapefile", // Shown as the table header for Shapefile file format
        allowDownloadLabel: "Allow Download" // Shown as the table header for allowing download option checkboxes for the respective layers
      },
      setButtonLabel: "Set", // Shown as the Set button label for selecting gp service for both Extract data task and Print task service
      GPTaskLabel: "Specify url to geoprocessing service", // Shown as the label for selecting print task gp service
      printGPServiceLabel: "Print service URL", // Shown as the label to specify print service url
      setGPTaskTitle: "Specify required Geoprocessing Service URL", // Shown as the title of the popup for selecting geoprocessing url
      logoLabel: "Logo", // Shown as the label for selecting logo
      logoChooserHint: "Hint: Click the image icon to change the logo shown in top left corner of the report", // Shown as the hint for logo chooser
      footnoteLabel: "Footnote", // Shown as the label for footnote textarea
      columnTitleColorPickerLabel: "Report column title color", // Shown as the label for table header color picker
      reportTitleLabel: "Report title", // Shown as the label for report title
      displaySummaryLabel: "Display Summary",
      hideZeroValueRowLabel: "Hide rows with 0 value for all analysis fields",
      hideNullValueRowLabel: "Hide rows with no data value (null or empty) for all analysis fields",
      errorMessages: {
        invalidGPTaskURL: "Invalid geoprocessing service. Please select a geoprocessing service containing an Extract Data Task.", // Shown as the error message on selecting invalid geoprocessing service
        noExtractDataTaskURL: "Please select a geoprocessing service containing an Extract Data Task.", // Shown as the error message when no geoprocessing service is selected on setting the configuration
        duplicateCustomOption: "Duplicate entry for  \${duplicateValueSizeName}\ exists.", // Shown as the error message when duplicate entry for layout option found
        invalidLayoutWidth: "Invalid width entered for \${customLayoutOptionValue}\.", // Shown as the error message when invalid width entry for layout option found
        invalidLayoutHeight: "Invalid height entered for \${customLayoutOptionValue}\.", // Shown as the error message when invalid height entry for layout option found
        invalidLayoutPageUnits: "Invalid page unit selected for \${customLayoutOptionValue}\.", // Shown as the error message when invalid page unit is selected for layout option
        failtofetchbuddyTaskDimension: "Error while fetching buddy task dimension information. Please try again.", // shown as error message on failure of fetching buddy task dimension
        failtofetchbuddyTaskName: "Error while fetching buddy task name. Please try again.", //shown as the error message on failure of fetching buddy task name.
        failtofetchChoiceList: "Error while fetching choice list from print service. Please try again.", // Shown as the error message on failure of fetching choice list from print service
        invalidWidth: "Invalid width.", // shown as error message when invalid width entered in width validation textbox
        invalidHeight: "Invalid height." // shown as error message when invalid height entered in height validation textbox
      },
      addCustomLayoutTitle: "Add custom layout", // shown as the label for add custom layout
      customLayoutOptionHint: "Hint: Add layout from your print service to the list of print options.", // shown as the hint for add custom layout
      reportDefaultOptionLabel: "Default layout", // shown as the label for default option label
      pageSizeUnits: {
        millimeters: "Millimeters",
        points: "Points"
      },
      noDataTextRepresentation: "No data value",
      naTextRepresentation: "Not applicable value",
      noDataDefaultText: "No Data",
      notApplicableDefaultText: "N/A"
    },
    generalTab: {
      generalTabLabel: "General", // shown as label in config UI for third tab
      tabLabelsLegend: "Panel Labels", // shown as label in config UI for Tab Labels Fieldset legend
      tabLabelsHint: "Hint: Specify Labels", // shown as hint in config UI for Tab Labels Fieldset
      AOITabLabel: "Area of interest panel", // shown as label in config UI for Tab Labels Fieldset AOI Tab Option
      ReportTabLabel: "Report panel", // shown as label in config UI for Tab Labels Fieldset Report Tab Option
      bufferSettingsLegend: "Buffer Settings", // shown as label in config UI for Buffer Settings Fieldset legend
      defaultBufferDistanceLabel: "Default buffer distance", // shown as label in config UI for Buffer Settings Fieldset Default Buffer Distance Option
      defaultBufferUnitsLabel: "Buffer units", // shown as label in config UI for Buffer Settings Fieldset Default Buffer Units Option
      generalBufferSymbologyHint: "Hint: Symbology to be used to indicate the buffer area around the defined areaa of interest", // shown as hint in config UI for Buffer Settings Fieldset for Buffer Symbology Option
      aoiGraphicsSymbologyLegend: "Area of Interest Symbology", // shown as label in config UI for AOI Graphics Symbology Fieldset legend
      aoiGraphicsSymbologyHint: "Hint: Symbology used to indicate point, line, and polygon areas of interest", // shown as hint in config UI for AOI Graphics Symbology Fieldset
      pointSymbologyLabel: "Point", // shown as label in config UI for AOI Graphics Symbology Fieldset point Symbology
      previewLabel: "Preview", // shown as label in config UI for AOI Graphics Symbology Fieldset preview
      lineSymbologyLabel: "Line", // shown as label in config UI for AOI Graphics Symbology Fieldset line Symbology
      polygonSymbologyLabel: "Polygon", // shown as label in config UI for AOI Graphics Symbology Fieldset polygon Symbology
      aoiBufferSymbologyLabel: "Buffer symbology", // shown as label in config UI for AOI Graphics Symbology Fieldset AOI Symbology
      pointSymbolChooserPopupTitle: "Address or point location symbol", // shown as title in config UI for Symbol chooser popup for point symbology
      polygonSymbolChooserPopupTitle: "Polygon symbol", // shown as title in config UI for Symbol chooser popup for polygon symbology
      lineSymbolChooserPopupTitle: "Line symbol", // shown as title in config UI for Symbol chooser popup for line symbology
      aoiSymbolChooserPopupTitle: "Buffer symbol", // shown as title in config UI for Symbol chooser popup for aoi symbology
      aoiTabText: "AOI",
      reportTabText: "Report",
      invalidSymbolValue: "Invalid symbol value."
    },
    searchSourceSetting: {
      searchSourceSettingTabTitle: "Search Source Settings", // shown as a label in config UI dialog box for search source setting
      searchSourceSettingTitle: "Search Source Settings", // shown as a label in config UI dialog box for search source setting
      searchSourceSettingTitleHintText: "Add and configure geocode services or feature layers as search sources. These specified sources determine what is searchable within the search box", // shown as a hint text in config UI dialog box for search source setting
      addSearchSourceLabel: "Add Search Source", // Shown as a label in config UI for button
      featureLayerLabel: "Feature Layer", // Shown as a label in config UI for dropDown menu
      geocoderLabel: "Geocoder", // Shown as a label in config UI for dropDown menu
      generalSettingLabel: "General Setting", // Shown as a label in config UI
      allPlaceholderLabel: "Placeholder text for searching all:", // Shown as a label in config UI
      allPlaceholderHintText: "Hint: Enter text to be shown as placeholder while searching all layers and geocoder", // shown as a hint text in config UI
      generalSettingCheckboxLabel: "Show pop-up for the found feature or location", // Shown as a label of checkbox
      countryCode: "Country or Region Code(s)", // Shown as a label in config UI
      countryCodeEg: "e.g. ", // Shown as a placeholder in config UI
      countryCodeHint: "Leaving this value blank will search all countries and regions", // Shown as a hint text in config UI for country code textbox
      questionMark: "?", //Shown as a question mark in config UI for help
      searchInCurrentMapExtent: "Only search in current map extent", // Shown as a label in config UI for checkbox
      locatorUrl: "Geocoder URL", // Shown as a label in config UI for layer chooser
      locatorName: "Geocoder Name", // Shown as a label in config UI
      locatorExample: "Example", // Shown as a label in config UI
      locatorWarning: "This version of geocoding service is not supported. The widget supports geocoding service 10.0 and above.",
      locatorTips: "Suggestions are not available because the geocoding service doesn't support suggest capability.",
      layerSource: "Layer Source", // Shown as a label in config UI
      setLayerSource: "Set Layer Source", // Shown as a popup title while selecting layers
      setGeocoderURL: "Set Geocoder URL", // Shown as a popup title while selecting geocoder URL
      searchLayerTips: "Suggestions are not available because the feature service doesn't support pagination capability.", // Show as msg if suggestions would not be available
      placeholder: "Placeholder Text", // Shown as a placeholder in config UI
      searchFields: "Search Fields", // Shown as a label in config UI
      displayField: "Display Field", // Shown as a label in config UI
      exactMatch: "Exact Match", // Shown as a label in config UI for checkbox
      maxSuggestions: "Maximum Suggestions", // Shown as a label in config UI
      maxResults: "Maximum Results", // Shown as a label in config UI
      enableLocalSearch: "Enable local search", // Shown as a label in config UI for checkbox
      minScale: "Min Scale", // Shown as a label in config UI
      minScaleHint: "When the map scale is larger than this scale, local search will be applied",
      radius: "Radius", // Shown as a label in config UI
      radiusHint: "Specifies the radius of an area around current map center that is used to boost the rank of geocoding candidates so that candidates closest to the location are returned first", // Shown as a hint for radius
      setSearchFields: "Set Search Fields", // Shown as a title for selecting search fields
      set: "Set", // Shown as a label in config UI for button
      invalidUrlTip: "The URL ${URL} is invalid or inaccessible.", // Shown as error message if URL is invalid
      invalidSearchSources: "Invalid search source settings" // Show as error msg if search source settings are invalid
    },
    errorMsg: {
      textboxFieldsEmptyErrorMsg: "Please complete the required fields", // Shown as error message if textbox fields are empty.
      bufferDistanceFieldsErrorMsg: "Please enter valid values", // Shown as error message if number textbox fields has invalid values.
      invalidSearchToleranceErrorMsg: "Please enter a valid value for search tolerance", // Shown as error message if search tolerance textbox has invalid values.
      atLeastOneCheckboxCheckedErrorMsg: "Invalid configuration: At least one Area of Interest tool is required.", // Shown as error message if no checkbox field checked in AOI Tools section.
      noLayerAvailableErrorMsg: "No layers available", // Shown as error message if no valid layer available.
      layerNotSupportedErrorMsg: "Not Supported ", // Shown as error message if layer type is not supported.
      noFieldSelected: "Please use the edit action to select fields for analysis.", // Shown as error message if no field selected for add layers section
      duplicateFieldsLabels: "Duplicate label \"${labelText}\" added for : \"${itemNames}\"", // Shown as error message if duplicate labels selected for layers/ fields in add layers section
      noLayerSelected: "Please select at least one layer for analysis.", // Shown as error message if no layer selected for add layers section
      errorInSelectingLayer: "Unable to select layer. Please try again.", // Shown as error message when error in selecting layer in dropdown
      errorInMaxFeatureCount: "Please enter valid maximum feature count for analysis." // Shown as an error message if max count is less then 1 or invalid
    }
  }),
  "ar": 1,
  "bs": 1,
  "ca": 1,
  "cs": 1,
  "da": 1,
  "de": 1,
  "el": 1,
  "es": 1,
  "et": 1,
  "fi": 1,
  "fr": 1,
  "he": 1,
  "hr": 1,
  "hu": 1,
  "it": 1,
  "id": 1,
  "ja": 1,
  "ko": 1,
  "lt": 1,
  "lv": 1,
  "nb": 1,
  "nl": 1,
  "pl": 1,
  "pt-br": 1,
  "pt-pt": 1,
  "ro": 1,
  "ru": 1,
  "sl": 1,
  "sr": 1,
  "sv": 1,
  "th": 1,
  "tr": 1,
  "uk": 1,
  "vi": 1,
  "zh-cn": 1,
  "zh-hk": 1,
  "zh-tw": 1
});