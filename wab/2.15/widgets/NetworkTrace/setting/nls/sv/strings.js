define({
  "taskUrl": "Åtgärds-URL",
  "setTask": "Ange",
  "setTaskPopupTitle": "Ange åtgärd",
  "validate": "Ange",
  "inValidGPService": "Ange en giltig geobearbetningstjänst.",
  "noOutputParameterWithGeometryType": "Den valda geobearbetningstjänsten måste ha minst en utdataparameter med en angiven geometrityp. Välj en annan geobearbetningstjänst.",
  "invalidOutputGeometry": "Utdatageometritypen för den valda geobearbetningstjänsten är inte kompatibel med projektinställningarna. Resultaten av geobearbetningstjänsten kan inte lagras.",
  "GPFeatureRecordSetLayerERR": "Ange en geobearbetningstjänst med indata av enbart typen GPFeatureRecordSetLayer.",
  "invalidInputParameters": "Antalet indataparametrar är antingen färre än 1 eller fler än 3. Ange en giltig geobearbetningstjänst.",
  "projectSetting": {
    "title": "Projektinställningar",
    "note": "Observera: Projektinställningar är valfria, när de är konfigurerade kan användaren lagra projektet i önskat webbkartlager med nätverksavbrottsområde och indataparametrar. Användare kan lagra andra utdataparametrar från gruppen Utdata på fliken Indata/utdata.",
    "projectPolygonLayer": "Projektpolygonlager",
    "outputParameterName": "Utdataparameternamn",
    "projectPointLayer": "Projektpunktlager",
    "selectLabel": "Välj",
    "polygonLayerHelp": "<p>Polygonlager med följande villkor visas:<br/><ul><li>Lagret måste ha redigeringsmöjlighet, nämligen Skapa, Ta bort och Uppdatera</li><li>Lagret måste ha två fält med exakt namn och datatyp:</li><ul><li>name(fält med typen Sträng)</li><li>globalid (fält med typen GlobalID)</li></ul></ul><p/>",
    "outputParameterHelp": "<p>Utdatapolygonlager från uppgiftens URL visas<p/>",
    "pointLayerHelp": "<p>Punktlager med följande villkor visas: <br/><ul><li>Lagret måste ha redigeringsmöjlighet, nämligen Skapa, Ta bort och Uppdatera</li><li>Lagret måste ha två fält med exakt namn och datatyp:</li><ul><li>inputtype (fält med typen Sträng)</li><li>projectid (fält med typen GUID)</li></ul></ul><p/>"
  },
  "inputOutputTab": {
    "flag": "Flagga",
    "barrier": "Hinder",
    "skip": "Hoppa över",
    "title": "Indata/utdata",
    "inputSettingsLabel": "Indatainställningar",
    "outputSettingsLabel": "Utdatainställningar",
    "inputLabel": "Etikett",
    "inputTooltip": "Tipsruta",
    "symbol": "Symbol",
    "typeText": "Typ",
    "outputParametersText": "Utdataparametrar",
    "saveToLayerText": "Spara till lager (valfritt)",
    "skipText": "Går att hoppa över",
    "visibilityText": "Synlig",
    "exportToCsvText": "Export to CSV",
    "exportToCsvDisplayText": "CSV",
    "settitngstext": "Inställningar",
    "addFieldTitle": "Lägg till fält",
    "enterDisplayText": "Ange visningstext",
    "setScale": "Ange skala",
    "outputDisplay": "Visningstext",
    "saveToLayerHelp": "<p>Lager med följande villkor visas:<br/><ul><li>Lagret måste ha redigeringsmöjlighet, nämligen Skapa, Ta bort och Uppdatera</li><li>Lagret måste ha två fält med namn och datatyp:</li><ul><li>parametername (fält med typen Sträng)</li><li>projectid (fält med typen Guid)</li></ul></ul><p/>"
  },
  "summaryTab": {
    "title": "Allmänna inställningar",
    "summaryFieldsetText": "Inställningar för Sammanfattning",
    "inputOutput": "Indata/utdata",
    "field": "Fält",
    "operator": "Operator",
    "inputOperatorCountOption": "Antal",
    "outputOperatorCountOption": "Antal",
    "outputOperatorSkipCountOption": "SkipCount",
    "fieldOperatorSumOption": "Summa",
    "fieldOperatorMinOption": "Min.",
    "fieldOperatorMaxOption": "Max",
    "fieldOperatorMeanOption": "Medelvärde",
    "expressionAddButtonText": "Lägg till",
    "expressionVerifyButtonText": "Verifiera",
    "summaryEditorText": "Sammanfattningstext",
    "autoZoomAfterTrace": "Ytterligare alternativ",
    "zoomText": "Autozooma efter spår",
    "summarSettingTooltipText": "Lägg till indata/utdataantal"
  },
  "validationErrorMessage": {
    "webMapError": "Det finns inga lager tillgängliga i webbkartan. Välj en giltig webbkarta.",
    "inputTypeFlagGreaterThanError": "Det får inte finnas fler än en indatapost av typen flagga.",
    "inputTypeFlagLessThanError": "Minst en indatapost av typen flagga krävs.",
    "inputTypeBarrierErr": "Det får inte finnas fler än en indatapost av typen barriär.",
    "inputTypeSkipErr": "Det får inte finnas fler än en indatapost av typen hoppa över.",
    "displayTextForButtonError": "Visningstext för knappen Kör får inte vara tom.",
    "UnableToLoadGeoprocessError": "Det gick inte att läsa in geobearbetningstjänsten.",
    "invalidSummaryExpression": "Ogiltigt uttryck.",
    "validSummaryExpression": "Det lyckades!",
    "invalidProjectSettings": "Ogiltiga projektinställningar.<br/> Välj ett giltigt värde i ${projectSetting}."
  },
  "hintText": {
    "labelTextHint": "Tips! Ange visningsetikett för utdataparameterns resultatpanel.",
    "displayTextHint": "Tips! Detta visas i detaljpanelen för den här utdataparametern.",
    "inputTextHint": "Tips! Bygg ditt uttryck genom att välja indata, utdata och fältnamn.",
    "expressionHint": "Tips! Välj objekt och klicka på lägg till för att bygga uttrycket."
  }
});