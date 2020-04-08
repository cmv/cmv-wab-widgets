define({
  root: ({
    _widgetLabel: "Visibility", // Label of widget

    "observerLocation": "Observer Location",
    "formatIconTooltip": "Format Input", // Shown as tooltip on the format input coordinate button
    "addPointToolTip": "Add Observer Location", // Show as tooltip help on the draw point icon
    "fieldOfView": "Field of View",
    "useMilsText": "Use mils for angles",
    "observerHeight": "Observer Height",
    "minObsDistance": "Min Observable Distance",
    "maxObsDistance": "Max Observable Distance",
    "taskURLError": "The widget configuration file contains a URL that is unreachable. Please check with your system administrator",
    "taskURLInvalid": "The geoprocessing task configured with this widget is not valid. Please check with your system administrator",
    "viewshedError": "An error occured while creating visibility. Please ensure your observer location falls within the extent of your elevation surface.</p>",
    "validationError": "<p>The visibility creation form has missing or invalid parameters, Please ensure:</p><ul><li>An observer location has been set.</li><li>The observer Field of View is not 0.</li><li>The observer height contains a valid value.</li><li>The min and max observable distances contain valid values.</li></ul>",
    "comfirmInputNotation": "Confirm Input Notation",
    "notationsMatch": "notations match your input please confirm which you would like to use:",
    "createBtn": "Create",
    "clearBtn": "Clear",
    "setCoordFormat": "Set Coordinate Format String", // Shown as label for set format string
    "prefixNumbers": "Add '+/-' prefix to positive and negative numbers", // Shown as text next to the add prefix check box
    "parseCoordinatesError": "Unable to parse coordinates. Please check your input.", //Shown as error message for unknown coordinates
    "cancelBtn": "Cancel", // Shown as label on cancel button
    "applyBtn": "Apply", // Shown as label on apply button
    "invalidMessage": "Please enter a numeric value.",
    "observerRangeMessage": "Invalid Observer Height",
    "minimumRangeMessage": "Invalid Minimum Observable Range",
    "maximumRangeMessage": "Maximum Observable Range must be greater than the Minimum Observable Range and cannot be more than ${limit} ${units}.",
    "portalURLError": "The URL to your ArcGIS Online organization or Portal for ArcGIS is not configured. Please check with your system administrator",
    "privilegeError": "Your user role cannot perform analysis. In order to perform analysis, the administrator of your organization needs to grant you certain <a href=\"http://doc.arcgis.com/en/arcgis-online/reference/roles.htm\" target=\"_blank\">privileges</a>.",
    "noServiceError": "Elevation analysis service not available. Please check your ArcGIS Online organization or Portal for ArcGIS configurations.",
    "pointToolTooltip": "Click to add observer location",
    "degreesLabel": "degrees",
    "milsLabel": "mils",
    // notation strings
    "DD": "DD", // Shown as DD label in coordinate type dropdown within format input settings
    "DDM": "DDM", // Shown as DDM label in coordinate type dropdown within format input settings
    "DMS": "DMS", // Shown as DMS label in coordinate type dropdown within format input settings
    "DDRev": "DDRev", // Shown as DDRev label in coordinate type dropdown within format input settings
    "DDMRev": "DDMRev", // Shown as DDMRev label in coordinate type dropdown within format input settings
    "DMSRev": "DMSRev", // Shown as DMSRev label in coordinate type dropdown within format input settings
    "USNG": "USNG", // Shown as USNG label in coordinate type dropdown within format input settings
    "MGRS": "MGRS", // Shown as MGRS label in coordinate type dropdown within format input settings
    "UTM_H": "UTM (H)", // Shown as UTM (H) label in coordinate type dropdown within format input settings
    "UTM": "UTM", // Shown as UTM label in coordinate type dropdown within format input settings
    "GARS": "GARS", // Shown as GARS label in coordinate type dropdown within format input settings
    "GEOREF": "GEOREF", // Shown as GEOREF label in coordinate type dropdown within format input settings
    "DDLatLongNotation": "Decimal Degrees - Latitude/Longitude", // Shown as Decimal Degrees - Latitude/Longitude label in confirm coordinate type dropdown
    "DDLongLatNotation": "Decimal Degrees  - Longitude/Latitude", // Shown as Decimal Degrees  - Longitude/Latitude label in confirm coordinate type dropdown
    "DDMLatLongNotation": "Degrees Decimal Minutes - Latitude/Longitude", // Shown as Degrees Decimal Minutes - Latitude/Longitude label in confirm coordinate type dropdown
    "DDMLongLatNotation": "Degrees Decimal Minutes - Longitude/Latitude", // Shown as Degrees Decimal Minutes - Longitude/Latitude label in confirm coordinate type dropdown
    "DMSLatLongNotation": "Degrees Minutes Seconds - Latitude/Longitude", // Shown as Degrees Minutes Seconds - Latitude/Longitude label in confirm coordinate type dropdown
    "DMSLongLatNotation": "Degrees Minutes Seconds - Longitude/Latitude", // Shown as Degrees Minutes Seconds - Longitude/Latitude label in confirm coordinate type dropdown
    "GARSNotation": "GARS", // Shown as GARS label in confirm coordinate type dropdown
    "GEOREFNotation": "GEOREF", // Shown as GEOREF label in confirm coordinate type dropdown
    "MGRSNotation": "MGRS", // Shown as MGRS label in confirm coordinate type dropdown
    "USNGNotation": "USNG", // Shown as USNG label in confirm coordinate type dropdown
    "UTMBandNotation": "UTM - Band Letter", // Shown as UTM - Band Letter label in confirm coordinate type dropdown
    "UTMHemNotation": "UTM - Hemisphere (N/S)", // Shown as UTM - Hemisphere (N/S)de label in confirm coordinate type dropdown
    
    "mainPageTitle": "Radial Line of Sight",

    //results Panel
    "resultsTitle": "Results", // Shown as Title for Grid Settings page and label on settings buttons
    "publishBtnLabel": "Publish", // Shown as label on publish button
    "layerName": "Published Layer Name", // Shown as label for layer name box
    "invalidLayerName": "Layer name must only contain alpha-numeric characters and underscores", //Shown as validation error on published layer name
    "missingLayerName": "Enter layer name", //Shown as validation error on empty published layer name
    "back": "Back",

    //publishing error messages
    "publishingFailedLayerExists": "Publishing Failed: You already have a feature service named {0}. Please choose another name.", //Shown as error for layer name already used when publishing {0} will be replaced with the layer name in the code so do not remove
    "checkService": "Check Service: {0}", //{0} will be replaced in the code so do not remove
    "createService": "Create Service: {0}", //{0} will be replaced in the code so do not remove
    "unableToCreate": "Unable to create: {0}", //{0} will be replaced in the code so do not remove
    "addToDefinition": "Add to definition: {0}", //{0} will be replaced in the code so do not remove
    "successfullyPublished": "Successfully published web layer{0}Manage the web layer", //{0} will be replaced in the code so do not remove
    "userRole": "Unable to create service because user does not have permissions", //displayed as warning when publishing service
    "publishToNewLayer": "Publish results to a new feature layer", //Checkbox label to add layer to web map
    "missingLayerNameMessage": "You must enter a valid layer name before you can publish", //shown as error message for invalid layer name
    "regionTypeLabel" : "Region Type",
    "centerPointLabel" : "Center Point",
    "observationHeightLabel" : "Observation Height",
    "heightUnitLabel" : "Height Unit",
    "minObservationDistanceLabel" : "MinObservation Distance",
    "maxObservationDistance" : "MaxObservation Distance",
    "distanceUnitLabel": "Distance Unit",
    "fovstartAngleLabel": "FOV Start Angle",
    'fovEndAngleLabel': "FOV End Angle",
    "andleUnitsLabel": "Angle Units"
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