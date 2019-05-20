define({
  "layersPage": {
    "allLayers": "Kõik kihid",
    "title": "Valige objektide loomiseks mall",
    "generalSettings": "Üldseaded",
    "layerSettings": "Kihi seaded",
    "smartActionsTabTitle": "Nutikad toimingud",
    "attributeActionsTabTitle": "Atribuuditoimingud",
    "presetValueText": "Määratle eelseatud väärtused",
    "geocoderSettingsText": "Geokodeerija seaded",
    "editDescription": "Sisestage redigeerimispaneelil kuvatav tekst",
    "editDescriptionTip": "See tekst kuvatakse mallivalija kohal. Kui Te ei soovi teksti kuvada, jätke tühjaks.",
    "promptOnSave": "Viip salvestamata muudatuste salvestamiseks, kui vorm suletakse või valitakse järgmine kirje.",
    "promptOnSaveTip": "Kui kasutaja klõpsab sulgemisnuppu või liigub järgmisele redigeeritavale kirjele ja praegusel objektil on salvestamata muudatusi, kuvatakse see viip.",
    "promptOnDelete": "Kirje kustutamisel nõutakse kinnitust.",
    "promptOnDeleteTip": "Kui kasutaja klõpsab toimingu kinnitamiseks kustutamisnuppu, kuvatakse see viip.",
    "removeOnSave": "Salvestamisel eemaldatakse objekt valikust.",
    "removeOnSaveTip": "Valik objekti eemaldamiseks valitud komplektist, kui kirjet salvestatakse. Kui see on ainus valitud kirje, lülitub paneel tagasi mallilehele.",
    "useFilterEditor": "Kasuta objekti malli filtrit",
    "useFilterEditorTip": "Valik filtrimalli valija kasutamiseks, mille abil saab vaadata ühe kihi malle või otsida malle nime järgi.",
    "displayShapeSelector": "Näita joonistamisvalikuid",
    "createNewFeaturesFromExisting": "Luba kasutajal luua uus (uued) objekt(id) olemasoleva(te)st objekti(de)st",
    "createNewFeaturesFromExistingTip": "Valik lubab kasutajal kopeerida olemasoleva objekti, et luua uusi objekte",
    "copiedFeaturesOverrideDefaults": "Kopeeritud objektide väärtused alistavad vaikeväärtused",
    "copiedFeaturesOverrideDefaultsTip": "Kopeeritud objektide väärtused alistavad malli vaikeväärtused ainult vastendatud välja(de)l.",
    "displayShapeSelectorTip": "Valik sobivate joonistamisvalikute loendi kuvamiseks valitud malli jaoks.",
    "displayPresetTop": "Kuva eelseadistatud väärtuse loend alguses",
    "displayPresetTopTip": "Valik kuvada eelseadistatud väärtuse loend mallivalitsa peal.",
    "listenToGroupFilter": "Grupeerimise filtri vidina filtriväärtuste rakendamine eelseatud väljadele",
    "listenToGroupFilterTip": "Kui filter on rakendatud rühmafiltri vidinas, rakendage väärtus vastavale väljale eelseatud väärtuste loendis.",
    "keepTemplateActive": "Valitud malli hoidmine aktiivsena",
    "keepTemplateActiveTip": "Kui mall oli eelnevalt valitud, valige see mallivalija kuvamise korral uuesti.",
    "geometryEditDefault": "Luba vaikimisi geomeetriline redigeerimine",
    "autoSaveEdits": "Uus objekt salvestatakse automaatselt",
    "enableAttributeUpdates": "Kuva atribuuditoimingute värskendamise nupp, kui geomeetria muutmine on aktiivne",
    "enableAutomaticAttributeUpdates": "Kutsu atribuuditoiming pärast geomeetria värskendamist automaatselt",
    "enableLockingMapNavigation": "Luba kaardil navigeerimine lukustada",
    "enableMovingSelectedFeatureToGPS": "Luba valitud punktobjekti teisaldamine GPS-i asukohta",
    "enableMovingSelectedFeatureToXY": "Luba valitud punktobjekti teisaldamine XY-asukohta",
    "featureTemplateLegendLabel": "Objektimalli ja filtriväärtuse sätted",
    "saveSettingsLegendLabel": "Salvesta sätted",
    "geometrySettingsLegendLabel": "Geomeetria sätted",
    "buttonPositionsLabel": "Nuppude salvesta, kustuta, tagasi ja tühista valik paigutus",
    "belowEditLabel": "Muutmisvormi all",
    "aboveEditLabel": "Muutmisvormi kohal",
    "layerSettingsTable": {
      "allowDelete": "Luba kustutamine",
      "allowDeleteTip": "Luba kustutamine - valik, mis lubab kasutajal objekti kustutada; kui kiht ei toeta kustutamist, on see valik keelatud.",
      "edit": "Muudetav",
      "editTip": "Muudetav - valik kihi kaasamiseks vidinasse",
      "label": "Kiht",
      "labelTip": "Kiht - kihi nimi kaardil määratletud kujul",
      "update": "Keela geomeetria muutmine",
      "updateTip": "Keela geomeetria teisaldamine - valik geomeetria teisaldamise keelamiseks pärast selle paigutamist või olemasolevale objektile teisaldamist",
      "allowUpdateOnly": "Ainult uuenda",
      "allowUpdateOnlyTip": "Ainult uuendamine - valik ainult olemasolevate objektide muutmiseks. Seda kontrollitakse vaikimisi ja see on välja lülitatud, kui kiht ei toeta uute objektide loomist.",
      "fieldsTip": "Saate muuta redigeeritavaid välju ja määratleda nutikad atribuudid",
      "actionsTip": "Tegevused - valik väljade muutmiseks või seotud kihtidele/tabelitele juurdepääsuks",
      "description": "Kirjeldus",
      "descriptionTip": "Kirjeldus - võimalus sisestada atribuudilehe ülaosas kuvatav tekst.",
      "relationTip": "Kuva seotud kihid ja tabelid"
    },
    "editFieldError": "Mittemuudetavate kihtide korral ei saa välju muuta ja nutikad atribuudid pole saadaval",
    "noConfigedLayersError": "Smart Editor nõuab mitut muudetavat kihti",
    "toleranceErrorMsg": "Lõikumise tolerantsi kehtetu vaikeväärtus"
  },
  "editDescriptionPage": {
    "title": "Määratle kihi <b>${layername}</b> atribuutide ülevaate tekst "
  },
  "fieldsPage": {
    "title": "Konfigureeri kihi <b>${layername}</b> väljad",
    "copyActionTip": "Atribuuditoimingud",
    "editActionTip": "Nutikad toimingud",
    "description": "Kihil nutikate atribuutide aktiveerimiseks kasutage toimingute muutmise nuppu. Nutikad atribuudid oskavad teiste väljade väärtustest lähtuvalt välju nõuda, peita või keelata. Väljaväärtuse allika aktiveerimiseks ja määratlemiseks ristumiskoha (ristmiku), aadressi, koordinaatide ja eelseade alusel kasutage toimingute kopeerimise nuppu.",
    "fieldsNotes": "* on nõutav väli. Kui tühistate selle välja puhul märkeruudu Kuva valiku ja redigeerimismall ei täida seda välja väärtusega, ei saa te uut kirjet salvestada.",
    "smartAttachmentText": "Nutikate manuste konfigureerimise toiming",
    "smartAttachmentPopupTitle": "Konfigureeri kihi <b>${layername}</b> nutikad manused",
    "fieldsSettingsTable": {
      "display": "Kuva",
      "displayTip": "Kuvamine - määrake, kas väli on nähtav või mitte",
      "edit": "Muudetav",
      "editTip": "Muudetav - kontrollige, kas väli on atribuudi vormil olemas",
      "fieldName": "Nimi",
      "fieldNameTip": "Nimi - välja nimi, mis on andmebaasis määratletud",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Alias - välja nimi, mis on kaardil määratletud",
      "canPresetValue": "Eelseatud",
      "canPresetValueTip": "Eelseadmine - valik välja kuvamiseks eelseatud väljade loendis ja selleks, et lubada kasutajal määrata väärtuse enne muutmist",
      "actions": "Toimingud",
      "actionsTip": "Tegevused - saate muuta väljade järjestust või seadistada nutikad atribuudid"
    },
    "smartAttSupport": "Nõutavad andmebaasi väljad ei toeta nutikaid atribuute"
  },
  "actionPage": {
    "title": "Konfigureeri välja <b>${fieldname}</b> atribuuditoimingud",
    "smartActionTitle": "Konfigureerige välja <b>${fieldname}</b> nutikate atribuutide toimingud",
    "description": "Need toimingud on alati välja lülitatud, välja arvatud juhul, kui määratlete kriteeriumid, mille korral need sisse lülituvad. Toiminguid töödeldakse ettenähtud järjestuses ja iga välja kohta lülitatakse sisse ainult üks toiming. Kriteeriumide määratlemiseks kasutage nuppu kriteeriumide muutmine.",
    "copyAttributesNote": "Grupi nimega tegevuse deaktiveerimine on samaväärne kui selle tegevuse sõltumatu muutmine ja selle tagajärjel eemaldatakse selle välja tegevus vastavast grupist.",
    "actionsSettingsTable": {
      "rule": "Tegevus",
      "ruleTip": "Tegevus - kriteeriumidele vastavuse korral tehtav toiming",
      "expression": "Väljend",
      "expressionTip": "Avaldis - määratletud kriteeriumide alusel saadav avaldis SQL-vormingus",
      "groupName": "Grupi nimi",
      "groupNameTip": "Grupi nimi - näitab grupi nime, millest avaldist rakendatakse",
      "actions": "Kriteeriumid",
      "actionsTip": "Kriteerium - saate muuta reegli järjestust ja määratleda selle sisselülitumise kriteeriumid"
    },
    "copyAction": {
      "description": "Väljaväärtuse allikad töödeldakse järjest, kui need on aktiveeritud, kuni kehtivad kriteeriumid lülitatakse sisse või loend on lõpule viidud. Kriteeriumide määratlemiseks kasutage kriteeriumide muutmise nuppu.",
      "intersection": "Ristmik",
      "coordinates": "Koordinaadid",
      "address": "Aadress",
      "preset": "Eelseatud",
      "actionText": "Toimingud",
      "criteriaText": "Kriteeriumid",
      "enableText": "Lubatud"
    },
    "actions": {
      "hide": "Peida",
      "required": "Nõutav",
      "disabled": "Keelatud"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Hoiatus: sõltumatul muutmisel eemaldatakse valitud atribuudi tegevus, mis on seotud selle väljaga grupist.",
      "editGroupHint": "Hoiatus: sõltumatul muutmisel eemaldatakse valitud nutikas toiming, mis on seotud selle väljaga grupist.",
      "popupTitle": "Vali muutmise suvand",
      "editAttributeGroup": "Atribuudi valitud toiming on määratletud grupist. Atribuudi toimingu muutmiseks valige üks järgmistest suvanditest:",
      "expression": "Valitud nutika toimingu avaldis on määratletud grupist. Nutika toimingu muutmiseks valige üks järgmistest suvanditest:",
      "editGroupButton": "Muuda gruppi",
      "editIndependentlyButton": "Muuda sõltumatult"
    }
  },
  "filterPage": {
    "submitHidden": "Kas edastada selle välja kohta atribuudi andmed isegi siis, kui see on peidetud?",
    "title": "Konfigureerige toimingu ${action} reegli avaldis",
    "filterBuilder": "Saate määrata väljale toimingu, kui kirje vastab ${any_or_all} järgmistele avaldistele",
    "noFilterTip": "Määratlege alljärgnevate tööriistade abil avaldus, mille korral toiming on aktiivne."
  },
  "geocoderPage": {
    "setGeocoderURL": "Määra geokodeerija URL",
    "hintMsg": "Märkus. Muudate geokodeerija teenust. Värskendage kindlasti kõik konfigureeritud geokodeerija väljavastendused.",
    "invalidUrlTip": "URL ${URL} ei sobi või pole kättesaadav."
  },
  "addressPage": {
    "popupTitle": "Aadress",
    "checkboxLabel": "Too väärtus geokodeerijast",
    "selectFieldTitle": "Atribuut",
    "geocoderHint": "Geokodeerija vahetamiseks valige üldsätete all nupp geokodeerija sätted",
    "prevConfigruedFieldChangedMsg": "Eelnevalt konfigureeritud atribuuti ei leita geokodeerija praegustes seadetes. Atribuut on lähtestatud vaikeväärtusele."
  },
  "coordinatesPage": {
    "popupTitle": "Koordinaadid",
    "checkboxLabel": "Hangi koordinaadid",
    "coordinatesSelectTitle": "Koordinaatsüsteem",
    "coordinatesAttributeTitle": "Atribuut",
    "mapSpatialReference": "Kaardi koordinaatsüsteem",
    "latlong": "Laius/Pikkus",
    "allGroupsCreatedMsg": "Kõik võimalikud grupid on juba loodud"
  },
  "presetPage": {
    "popupTitle": "Eelseatud",
    "checkboxLabel": "Väli on eelseatud",
    "presetValueLabel": "Praegune eelseatud väärtus on:",
    "changePresetValueHint": "Selle eelseatud väärtuse muutmiseks valige üldsätete all nupp määratle eelseatud väärtused"
  },
  "intersectionPage": {
    "groupNameLabel": "Nimi",
    "dataTypeLabel": "Andmete tüüp",
    "ignoreLayerRankingCheckboxLabel": "Eirake kihi järjestust ja leidke lähim objekt kõigi määratletud kihtide hulgast",
    "intersectingLayersLabel": "Kiht (kihid) väärtuse eraldamiseks",
    "layerAndFieldsApplyLabel": "Kiht (kihid) ja väli (väljad) eraldatud väärtuse rakendamiseks",
    "checkboxLabel": "Too väärtus ristumiskoha kihi väljalt",
    "layerText": "Kihid",
    "fieldText": "Väljad",
    "actionsText": "Toimingud",
    "toleranceSettingText": "Tolerantsi seaded",
    "addLayerLinkText": "Lisa kiht",
    "useDefaultToleranceText": "Kasuta vaiketolerantsi",
    "toleranceValueText": "Tolerantsi väärtus",
    "toleranceUnitText": "Tolerantsi ühik",
    "useLayerName": "- Kasuta kihi nime -",
    "noLayersMessage": "Kaardi üheski kihis ei leita ühtegi välja, mis sobiks valitud andmetüübiga."
  },
  "presetAll": {
    "popupTitle": "Määratle eelseatud vaikeväärtused",
    "deleteTitle": "Kustuta eelseatud väärtus",
    "hintMsg": "Siin on ära toodud kõigi kordumatute eelseatud väljade nimed. Mõne eelseatud välja eemaldamine keelab vastava välja eelseadena kõigis kihtides või tabelites."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Lõike vaiketolerants"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "Lisa uus",
    "definedActions": "Määratletud toimingud",
    "priorityPopupTitle": "Seadke nutikate toimingute prioriteet",
    "priorityPopupColumnTitle": "Nutikad toimingud",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Grupi nimi",
    "layerForExpressionLabel": "Avaldise kiht",
    "layerForExpressionNote": "Märkus: kriteeriumide määratlemiseks kasutatakse valitud kihi välju",
    "expressionText": "Avaldis",
    "editExpressionLabel": "Muuda avaldist",
    "layerAndFieldsApplyLabel": "Rakendatavad kihid ja väljad",
    "submitAttributeText": "Kas esitada atribuudi andmed valitud peidetud välja(de)le?",
    "priorityColumnText": "Prioriteet",
    "requiredGroupNameMsg": "See väärtus on nõutav:",
    "uniqueGroupNameMsg": "Sisestage unikaalne grupi nimi, selle nimega grupp on juba olemas.",
    "deleteGroupPopupTitle": "Kustuta nutika toimingu grupp",
    "deleteGroupPopupMsg": "Grupi kustutamisel eemaldatakse avaldis seotud välja(de) toimingust.",
    "invalidExpression": "Avaldis ei tohi olla tühi.",
    "warningMsgOnLayerChange": "Määratletud avaldis ja väljad, millele seda rakendatakse, kustutatakse.",
    "smartActionsTable": {
      "name": "Nimi",
      "expression": "Avaldis",
      "definedFor": "Määratletud"
    }
  },
  "attributeActionsPage": {
    "name": "Nimi",
    "type": "Tüüp",
    "deleteGroupPopupTitle": "Kustuta atribuudi toimingu grupp",
    "deleteGroupPopupMsg": "Grupi kustutamisel eemaldatakse atribuudi toiming kõigilt seotud väljadelt.",
    "alreadyAppliedActionMsg": "${action} toimingut juba rakendati sellele väljale."
  },
  "chooseFromLayer": {
    "fieldLabel": "Välitöödele",
    "valueLabel": "Väärtus",
    "selectValueLabel": "Vali väärtus"
  },
  "presetPopup": {
    "presetValueLAbel": "Eelseatud väärtus"
  },
  "dataType": {
    "esriFieldTypeString": "Tekstistring",
    "esriFieldTypeInteger": "Number",
    "esriFieldTypeDate": "Kuupäev",
    "esriFieldTypeGUID": "GUID"
  }
});