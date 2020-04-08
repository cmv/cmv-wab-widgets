define({
  root: ({
    _widgetLabel: "Threat Analysis", // Label of widget

    "threatAnalysisMainPageTitle": "Based on JCAT Counterterrorism Guide", // Shown as title for new Threat Analysis panel
    "jcatURL": "https://www.dni.gov/nctc/jcat/references.html", //URL to JCAT reference guide
    "inputLocation": "Input Location", //Shown as label for input location dropdown
    //input location dropdown
    "interactive": "Interactive", //Shown as label for interactive in location dropdown
    "fromCoord": "Fixed Coordinate", //Shown as label for from coordinate in location dropdown
    "existingFeature": "From Existing Features", //Shown as label for existing features in location dropdown

    "threatAnalysisCoordInputLabel": "Threat Location", // Shown as label for Threat coordinate input box
    "enterCoords": "Enter Coordinates", // Shown as placeholder text in coord input box
    "threatAddPointToolTip": "Add Threat Location", // Show as tooltip help on the draw point icon
    "threatDrawPointToolTip": "Click to add threat location", // Shown as tooltip help on the cursor when using the draw point tool
    "threatType": "Threat Type", // Shown as title for threat type input
    "threatPlaceholder": "Start typing to search for a threat", // Shown as prompt text in threat input field
    "mandatoryLabel": "Mandatory Evacuation Distance", // Shown as label for mandatory evacuation distance
    "safeLabel": "Safe Evacuation Distance", // Shown as label for safe evacuation distance,
    "zoneTypeLabel": "Zone Type", // Label for popup template to display either mandatory or safe evac labels
    "feetLabel": "Feet", // Feet label for popup template
    "metersLabel": "Meters", // Meters label for popup template
    "unitsLabel": "Units", // Units label for popup template
    "threatGraphicLayer": "Threat-Graphic",

    // Settings Panel
    "settingsTitle": "Settings", // Shown as Title for Settings page and label on settings buttons
    "mandatoryButtonLabel": "Configure Mandatory Evacuation Distance Settings", // Shown as tooltip for Spill Location Settings dropdown
    "safeButtonLabel": "Configure Shelter In Place Settings", // Shown as tooltip for Initial Isolation Zone Settings dropdown
    "style": "Style", // Shown as Title for Style dropdown
    "colorPicker": "colorPicker", // read as aria lable for color picker
    "lineStyles": {
      "esriSLSDash": "Dash",
      "esriSLSDashDot": "Dash Dot",
      "esriSLSDashDotDot": "Dash Dot Dot",
      "esriSLSDot": "Dot",
      "esriSLSLongDash": "Long Dash",
      "esriSLSLongDashDot": "Long Dash Dot",
      "esriSLSNull": "Null",
      "esriSLSShortDash": "Short Dash",
      "esriSLSShortDashDot": "Short Dash Dot",
      "esriSLSShortDashDotDot": "Short Dash Dot Dot",
      "esriSLSShortDot": "Short Dot",
      "esriSLSSolid": "Solid"
    },

    "fillStyles": {
      "esriSFSBackwardDiagonal": "Backward",
      "esriSFSCross": "Cross",
      "esriSFSDiagonalCross": "Diagonal",
      "esriSFSForwardDiagonal": "Forward",
      "esriSFSHorizontal": "Horizontal",
      "esriSFSNull": "Null",
      "esriSFSSolid": "Solid",
      "esriSFSVertical": "Vertical"
    },

    //results Panel
    "resultsTitle": "Results", // Shown as Title for Grid Settings page and label on settings buttons
    "publishTABtn": "Publish", // Shown as label on publish ERG button
    "layerName": "Published Layer Name", // Shown as label for layer name box
    "invalidLayerName": "Layer name must only contain alpha-numeric characters and underscores", //Shown as validation error on published layer name
    "missingLayerName": "You must enter a name for the layer", //Shown as validation error on empty published layer name
    "missingLayerNameMessage": "You must enter a valid layer name before you can publish", //shown as error message for invalid layer name

    //publishing error messages
    "publishingFailedLayerExists": "Publishing Failed: You already have a feature service named {0}. Please choose another layer name.", //Shown as error for layer name already used when publishing {0} will be replaced with the layer name in the code so do not remove
    "checkService": "Check Service: {0}", //{0} will be replaced in the code so do not remove
    "createService": "Create Service: {0}", //{0} will be replaced in the code so do not remove
    "unableToCreate": "Unable to create: {0}", //{0} will be replaced in the code so do not remove
    "addToDefinition": "Add to definition: {0}", //{0} will be replaced in the code so do not remove
    "successfullyPublished": "Successfully published web layer{0}Manage the web layer", //{0} will be replaced in the code so do not remove
    "successfullyAppended": "Successfully appended new features to web layer{0}Manage the web layer", //{0} will be replaced in the code so do not remove
    "userRole": "Unable to create service because user does not have permissions", //displayed as warning when publishing service
    "retrieveExistingLayerError": "Unable to retrieve {0}. Please publish using another layer name", //displayed as an error when retrieving the layer from Portal
    "publishToNewLayer": "Publish results to a new feature layer", //Checkbox label to add layer to web map

    //threat types - labels from the ThreatTypes.json
    "pipeBombLabel": "Pipe Bomb",
    "suicideBombLabel": "Suicide Bomb",
    "briefcaseLabel": "Briefcase",
    "carLabel": "Car",
    "suvVanLabel": "SUV/VAN",
    "smallDeliveryTruckLabel": "Small Delivery Truck",
    "containerWaterTruckLabel": "Container/Water Truck",
    "semiTrailerLabel": "Semi-Trailer",

    //common
    "transparencyLabel": "Transparency", // Shown as label on transparency sliders
    "outline": "Outline", // Shown as label for outline color picker
    "fill": "Fill (Color only applies when style set to solid)", // Shown as label for outline color picker
    "createBtn": "Create Zones", // Shown as label on create button
    "clearBtn": "Clear", // Shown as label on clear button
    "invalidNumberMessage": "The value entered is not valid", //Shown as validation error on invalid entries
    "invalidRangeMessage": "Value must be greater than 0", //Shown as validation error on invalid entries
    "parseCoordinatesError": "Unable to parse coordinates. Please check your input.", //Shown as error message for unknown coordinates
    "manualCoordinateInputInfo": "Manually input coordinates and click <b>Enter</b> to zoom to it",
    "pipeBombLabel": "Pipe Bomb",
    "suicideBombLabel": "Suicide Bomb",
    "briefcaseLabel": "Briefcase",
    "carLabel": "Car",
    "suvVanLabel": "SUV/VAN",
    "smallDeliveryTruckLabel": "Small Delivery Truck",
    "containerWaterTruckLabel": "Container/Water Truck",
    "semiTrailerLabel": "Semi-Trailer",
    "selectDrawModeLabel": "Select Draw Mode",
    "selectFeatureLabel": "Select Feature From This Layer"
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