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
    "standardUnit": "मानक इकाई",
    "metricUnit": "मापीय इकाई"
  },
  "analysisTab": {
    "analysisTabLabel": "विश्लेषण",
    "selectAnalysisLayerLabel": "विश्लेषण लेयरों को चुनें",
    "addLayerLabel": "लेयर्स जोड़ें",
    "noValidLayersForAnalysis": "चयनित वेब मानचित्र में कोई वैध लेयर नहीं मिली।",
    "noValidFieldsForAnalysis": "चयनित वेब मानचित्र में कोई वैध क्षेत्र नहीं मिला। कृपया चयनित लेयर को हटा दें।",
    "addLayersHintText": "संकेत: रिपोर्ट में विश्लेषण और प्रदर्शन करने के लिए लेयरों और क्षेत्रों का चयन करें",
    "addLayerNameTitle": "लेयर का नाम",
    "addFieldsLabel": "क्षेत्र जोडें",
    "addFieldsPopupTitle": "फील्ड्स का चयन करें",
    "addFieldsNameTitle": "फील्ड के नाम",
    "aoiToolsLegendLabel": "AOI उपकरण",
    "aoiToolsDescriptionLabel": "रुचि के क्षेत्रों को बनाने और उनके लेबल स्पष्ट करने के लिए उपकरण सक्षम करें",
    "placenameLabel": "स्थल का नाम",
    "drawToolsLabel": "उपकरण बनाएं",
    "uploadShapeFileLabel": "आकार के फ़ाइल को अपलोड करें",
    "coordinatesLabel": "संयोजन",
    "coordinatesDrpDwnHintText": "संकेत: दर्ज किए गए पारगमन को प्रदर्शित करने के लिए इकाई चुनें",
    "coordinatesBearingDrpDwnHintText": "संकेत: दर्ज किए गए पारगमन को प्रदर्शित करने के लिए वहन को चुनें",
    "allowShapefilesUploadLabel": "आकृतियों को विश्लेषण के लिए अपलोड करने की अनुमति दें",
    "areaUnitsLabel": "क्षेत्रों/ लंबाई को दिखाएं",
    "allowShapefilesUploadLabelHintText": "संकेत: रिपोर्ट टैब में 'आकर फ़ाइल में विश्लेषण के लिए अपलोड करें' प्रदर्शित करें",
    "maxFeatureForAnalysisLabel": "विश्लेषण के लिए अधिकतम विशेषताएं",
    "maxFeatureForAnalysisHintText": "संकेत: विश्लेषण के लिए सुविधाओं की अधिकतम संख्या निर्धारित करें",
    "searchToleranceLabelText": "धैर्य खोजें (पैर)",
    "searchToleranceHint": "संकेत : खोज धैर्य केवल बिंदु और रेखाओं के इनपुट का विश्लेषण करते समय उपयोग किया जाता है"
  },
  "downloadTab": {
    "downloadLegend": "डाउनलोड सेटिंग्स",
    "reportLegend": "रिपोर्ट सेटिंग्स",
    "downloadTabLabel": "डाउनलोड करें",
    "syncEnableOptionLabel": "फ़ीचर लेयर",
    "syncEnableOptionHint": "संकेत: विशेषों स्वरूपों में रुचि के क्षेत्र को अन्तर्निहित सुविधाओं के लिए विशेष जानकारी डाउनलोड करने के लिए उपयोग किया जाता है।",
    "syncEnableOptionNote": "धयान दें: फ़ाइल जियोडेटाबेस विकल्प के लिए समन्वय सक्षम सुविधा सेवाओं की आवश्यकता है।",
    "extractDataTaskOptionLabel": "डेटा टास्क जियोप्रोसेसिंग सेवा को निकालें",
    "extractDataTaskOptionHint": "संकेत: फ़ीचर्स डाउनलोड करने के लिए एक प्रकाशित निकाले गए डेटा टास्क जियोप्रोसेसिंग सर्विस का उपयोग करें, जो कि फ़ाइल जीओडेटाबेस या आकार फ़ाइल स्वरूपों में रुचि के क्षेत्र को एक दूसरे को परस्पर काटते हैं।",
    "cannotDownloadOptionLabel": "डाउनलोड को अक्षम करें",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "लेयर का नाम",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "फ़ाइल Geodatabase",
      "allowDownloadLabel": "डाउनलोड होने दें"
    },
    "setButtonLabel": "सेट करें",
    "GPTaskLabel": "जियोप्रोसेसिंग सर्विस के लिए url स्पष्ट करें",
    "printGPServiceLabel": "प्रिंट सर्विस URL",
    "setGPTaskTitle": "आवश्यक जियोप्रोसेसिंग सर्विस के लिए URL स्पष्ट करें",
    "logoLabel": "लोगो",
    "logoChooserHint": "संकेत: चित्र बदलने के लिए इमेज आइकन पर क्लिक करें",
    "footnoteLabel": "फ़ुटनोट",
    "columnTitleColorPickerLabel": "स्तंभ शीर्षकों के लिए रंग",
    "reportTitleLabel": "शीर्षक प्रतिवेदन",
    "errorMessages": {
      "invalidGPTaskURL": "अवैध जियोप्रोसेसिंग सर्विस। कृपया डेटा कार्य को निकालनेवाली जियोप्रोसेसिंग सेवा चुनें।",
      "noExtractDataTaskURL": "कृपया डेटा कार्य को निकलनेवाली कोई भी जियोप्रोसेसिंग सेवा चुनें।"
    }
  },
  "generalTab": {
    "generalTabLabel": "सामान्य",
    "tabLabelsLegend": "सूची सूचक पत्र",
    "tabLabelsHint": "संकेत: सूचक पत्र स्पष्ट करें",
    "AOITabLabel": "रुचि क्षेत्र का सूचक पत्र",
    "ReportTabLabel": "प्रतिवेदन सूचक पत्र",
    "bufferSettingsLegend": "बफर सेटिंग्स",
    "defaultBufferDistanceLabel": "न्यूनतम प्रतिरोधक प्रणाली",
    "defaultBufferUnitsLabel": "प्रतिरोधक इकाई",
    "generalBufferSymbologyHint": "संकेत: परिभाषित क्षेत्र के आसपास के प्रतिरोधक रुचि क्षेत्र को प्रदर्शित करने के लिए प्रतीक ज्ञान का इस्तेमाल करें",
    "aoiGraphicsSymbologyLegend": "AOI ग्राफ़िक प्रतीक ज्ञान",
    "aoiGraphicsSymbologyHint": "संकेत: रुचि के अनुरूप बिंदु, रेखा और बहुभुज क्षेत्रों को परिभाषित करते समय उपयोग करने के लिए प्रतीक ज्ञान का इस्तेमाल करें",
    "pointSymbologyLabel": "बिन्दु",
    "previewLabel": "पूर्वावलोकन करें",
    "lineSymbologyLabel": "रेखा",
    "polygonSymbologyLabel": "बहुभुज",
    "aoiBufferSymbologyLabel": "प्रतिरोधक प्रतीक ज्ञान",
    "pointSymbolChooserPopupTitle": "पता या स्थान का चिन्ह",
    "polygonSymbolChooserPopupTitle": "बहुभुज को हाइलाइट करने के लिए चिन्ह का चयन करें",
    "lineSymbolChooserPopupTitle": "रेखाओं को उभारने के चिन्हों को चुनें",
    "aoiSymbolChooserPopupTitle": "बफर का प्रतीक निर्धारित करें"
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "स्रोत सेटिंग खोजें",
    "searchSourceSettingTitle": "स्रोत सेटिंग खोजें",
    "searchSourceSettingTitleHintText": "Geocode सेवाओं या फीचर लेयरों को खोज स्रोतों के रूप में जोड़ें और कॉन्फ़िगर करें। ये निर्दिष्ट स्रोत निर्धारित करते हैं कि खोज बॉक्स के भीतर क्या खोज योग्य है",
    "addSearchSourceLabel": "खोज स्रोत जोड़ें",
    "featureLayerLabel": "फ़ीचर लेयर",
    "geocoderLabel": "Geocoding",
    "generalSettingLabel": "सामान्य सेटिंग",
    "allPlaceholderLabel": "सभी खोज के लिए प्लेसहोल्डर पाठ:",
    "allPlaceholderHintText": "सुझाव: सभी लेयरों और Geocoder की खोज करते समय प्लेसहोल्डर के रूप में दिखाए जाने के लिए टेक्स्ट दर्ज किया जा सकता है",
    "generalSettingCheckboxLabel": "पाई गई फीचर या स्थान के लिए पॉप-अप दिखाएं",
    "countryCode": "देश या क्षेत्र कोड",
    "countryCodeEg": "जैसे ",
    "countryCodeHint": "इस मान को खाली छोड़ने से सभी देशों और क्षेत्रों की खोज होगी",
    "questionMark": "?",
    "searchInCurrentMapExtent": "केवल वर्तमान मानचित्र सीमा में खोज करता है",
    "zoomScale": "स्केल को ज़ूम करें",
    "locatorUrl": "जियोकोडर URL",
    "locatorName": "जियोकोडर का नाम",
    "locatorExample": "उदाहरण",
    "locatorWarning": "Geocoding सेवा का यह संस्करण समर्थित नहीं है। विजेट Geocoding सेवा 10.0 और ऊपर को समर्थन करता है।",
    "locatorTips": "सुझाव उपलब्ध नहीं हैं क्योंकि Geocoding सेवा सुझाव क्षमता का का समर्थन नहीं करता है।",
    "layerSource": "लेयर स्रोत",
    "setLayerSource": "लेयर स्रोत को सेट करें",
    "setGeocoderURL": "Geocoder का URL सेट करें",
    "searchLayerTips": "सुझाव उपलब्ध नहीं हैं क्योंकि सुविधा सेवा पृष्ठ अंकन क्षमता का समर्थन नहीं करती है।",
    "placeholder": "प्लेसहोल्डर टेक्स्ट",
    "searchFields": "फ़ील्ड खोजें",
    "displayField": "प्रदर्शन फील्ड",
    "exactMatch": "सटीक मिलान",
    "maxSuggestions": "अधिकतम सुझाव",
    "maxResults": "अधिकतम परिणाम",
    "enableLocalSearch": "स्थानीय खोज को सक्षम करें",
    "minScale": "न्यूनतम स्केल",
    "minScaleHint": "जब मानचित्र स्केल इस स्केल से बड़ा होता है, तो स्थानीय खोज को लागू किया जाएगा",
    "radius": "त्रिज्या",
    "radiusHint": "मौजूदा मानचित्र केंद्र के चारों ओर एक क्षेत्रफल की त्रिज्या निर्दिष्ट करें जिसे Geocoding उम्मीदवारों के रैंक को बढ़ावा देने के लिए प्रयोग किया जाता है ताकि स्थान के निकटतम उम्मीदवार पहले प्राप्त हों",
    "setSearchFields": "खोज फ़ील्ड को सेट करें",
    "set": "सेट करें",
    "invalidUrlTip": "URL ${URL} अवैध या दुर्गम है।",
    "invalidSearchSources": "अवैध खोज स्रोत सेटिंग्स"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "कृपया आवश्यक क्षेत्रों को भरें",
    "bufferDistanceFieldsErrorMsg": "कृपया वैध मूल्य दर्ज करें",
    "invalidSearchToleranceErrorMsg": "कृपया खोज के धैर्य के लिए वैध मूल्य दर्ज करें",
    "atLeastOneCheckboxCheckedErrorMsg": "अमान्य कॉन्फ़िगरेशन",
    "noLayerAvailableErrorMsg": "कोई भी लेयरें उपलब्ध नहीं हैं",
    "layerNotSupportedErrorMsg": "समर्थित नहीं ",
    "noFieldSelected": "कृपया विश्लेषण के लिए क्षेत्र का चुनाव करने के लिए संपादन प्रक्रिया का इस्तेमाल करें।",
    "duplicateFieldsLabels": "नक़ल सूचक पत्र \"${labelText}\" इसलिए जोड़ा गया है : \"${itemNames}\"",
    "noLayerSelected": "कृपया विश्लेषण के लिए कम से कम एक लेयर का चुनाव करें",
    "errorInSelectingLayer": "लेयर चुनने कार्यवाही को पूरा करने में असमर्थ। कृपया दोबारा कोशिश करें।",
    "errorInMaxFeatureCount": "कृपया विश्लेषण के लिए वैध अधिकतम विशेषताएं दर्ज करें।"
  }
});