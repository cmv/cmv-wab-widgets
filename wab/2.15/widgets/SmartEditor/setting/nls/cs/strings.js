define({
  "layersPage": {
    "allLayers": "Všechny vrstvy",
    "title": "Zvolte šablonu, podle které chcete vytvářet prvky.",
    "generalSettings": "Obecná nastavení",
    "layerSettings": "Nastavení vrstvy",
    "smartActionsTabTitle": "Chytré akce",
    "attributeActionsTabTitle": "Akce atributů",
    "geocoderSettingsText": "Nastavení služby Geocoder",
    "editDescription": "Zadejte text, který se má zobrazit v panelu úprav",
    "editDescriptionTip": "Tento text se zobrazí nad nástrojem pro volbu šablon. Pokud nechcete použít žádný text, ponechte pole prázdné.",
    "promptOnSave": "Vyzvat k uložení neuložených úprav, při uzavření formuláře nebo přepnutí na další záznam.",
    "promptOnSaveTip": "Zobrazí výzvu, když uživatel kliknutím obsah uzavře nebo přejde k dalšímu editovatelnému záznamu, pokud aktuální prvek obsahuje neuložené změny.",
    "promptOnDelete": "Při odstranění záznamu vyžadovat potvrzení.",
    "promptOnDeleteTip": "Zobrazí výzvu k potvrzení akce, pokud se uživatel kliknutím pokusí o odstranění.",
    "removeOnSave": "Při uložení prvek odebrat z výběru.",
    "removeOnSaveTip": "Možnost odstranit prvek ze sady výběru po uložení záznamu. Pokud jde o jediný vybraný záznam, panel se přepne zpět na stránku šablony.",
    "useFilterEditor": "Použít filtr šablon prvků",
    "useFilterEditorTip": "Možnost použít nástroj pro volbu šablon filtru, která umožňuje zobrazit šablonu jedné vrstvy nebo vyhledávat šablony podle názvu.",
    "displayShapeSelector": "Zobrazit možnosti kreslení",
    "createNewFeaturesFromExisting": "Umožní uživateli vytvořit nové prvky z existujících prvků",
    "createNewFeaturesFromExistingTip": "Možnost povolení uživateli kopírovat existující prvek za účelem vytvoření nových prvků",
    "copiedFeaturesOverrideDefaults": "Hodnoty kopírovaných prvků přepíší výchozí hodnoty",
    "copiedFeaturesOverrideDefaultsTip": "Hodnoty z kopírovaných prvků přepíší hodnoty výchozí šablony pouze u spárovaných polí",
    "displayShapeSelectorTip": "Možnost zobrazení seznamu platných možností kreslení pro zvolenou šablonu.",
    "displayPresetTop": "Zobrazit nahoře seznam přednastavených hodnot",
    "displayPresetTopTip": "Možnost zobrazit seznam přednastavených hodnot na nástroji pro volbu šablon",
    "listenToGroupFilter": "Použít hodnoty filtrů z widgetu Skupinový filtr na přednastavená pole",
    "listenToGroupFilterTip": "Po aplikaci filtru na widget Skupinový filtr aplikuje hodnotu na odpovídající pole v seznamu přednastavených polí.",
    "keepTemplateActive": "Ponechat vybranou šablonu aktivní",
    "keepTemplateActiveTip": "Když je zobrazen nástroj pro volbu šablon a šablona byla dříve vybrána, vybere se znovu.",
    "geometryEditDefault": "Standardně povolit úpravy geometrie",
    "autoSaveEdits": "Automaticky uložit nový prvek",
    "enableAttributeUpdates": "Zobrazit tlačítko aktualizace Akcí atributů, pokud je aktivní volba editace geometrie",
    "enableAutomaticAttributeUpdates": "Automaticky vyvolat akci atributu po aktualizaci geometrie",
    "enableLockingMapNavigation": "Povolit uzamknutí mapové navigace",
    "enableMovingSelectedFeatureToGPS": "Povolit přesun vybraného bodového prvku na umístění GPS",
    "enableMovingSelectedFeatureToXY": "Povolit přesun vybraného bodového prvku na umístění XY",
    "featureTemplateLegendLabel": "Nastavení šablony prvku a hodnoty filtru",
    "saveSettingsLegendLabel": "Uložit nastavení",
    "geometrySettingsLegendLabel": "Nastavení geometrie",
    "buttonPositionsLabel": "Pozice tlačítek Uložit, Odstranit, Zpět a Zrušit",
    "belowEditLabel": "Pod editačním formulářem",
    "aboveEditLabel": "Nad editačním formulářem",
    "switchToMultilineInput": "Pokud je délka pole větší, přejděte do režimu víceřádkového vstupu",
    "layerSettingsTable": {
      "allowDelete": "Povolit odstranění",
      "allowDeleteTip": "Povolit odstranění – Umožňuje uživatelům odstranit prvek; tato možnost je zakázána, pokud vrstva nepodporuje odstraňování",
      "edit": "Editovatelná",
      "editTip": "Editovatelné – Možnost zahrnout vrstvu ve widgetu",
      "label": "Vrstva",
      "labelTip": "Vrstva – Název vrstvy dle definice v mapě",
      "update": "Zakázat editaci geometrie",
      "updateTip": "Zakázat editaci geometrie – Možnost zakázat přesouvání geometrie po jejím umístění nebo přesouvání geometrie na existující prvek",
      "allowUpdateOnly": "Pouze aktualizace",
      "allowUpdateOnlyTip": "Pouze aktualizace – Možnost povolit pouze úpravy existujících prvků. Ve výchozím nastavení je tato možnost povolena. Je zakázána, pokud vrstva nepodporuje vytváření nových prvků",
      "fieldsTip": "Umožňuje upravit pole, která budou editována, a definovat chytré atributy.",
      "actionsTip": "Akce – Možnost editovat pole nebo přejít na související vrstvy/tabulky",
      "description": "Popis",
      "descriptionTip": "Popis – Možnost zadat text, který se zobrazí v horní části stránky atributů.",
      "relationTip": "Zobrazit související vrstvy/tabulky"
    },
    "editFieldError": "Úprava polí a chytré atributy nejsou k dispozici u vrstev, které nejsou editovatelné.",
    "noConfigedLayersError": "Chytrá editace vyžaduje jednu či více editovatelných vrstev.",
    "toleranceErrorMsg": "Neplatná výchozí hodnota tolerance průsečíku",
    "pixelsToleranecErrorMsg": "Neplatná výchozí hodnota tolerance pixelů",
    "invalidMaxCharacterErrorMsg": "Neplatná hodnota pro přechod do víceřádkového vstupu"
  },
  "editDescriptionPage": {
    "title": "Definujte text přehledu atributů pro vrstvu <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurujte pole pro vrstvu <b>${layername}</b>",
    "copyActionTip": "Akce atributů",
    "editActionTip": "Chytré akce",
    "description": "Pro aktivaci Chytrých atributů vrstvy použijte tlačítko Upravit akce. Chytré atributy umí vyžadovat, skrýt či zakázat pole na základě hodnot v dalších polích. Použijte tlačítko Kopírovat akce, pokud si přejete aktivovat a definovat zdroj hodnoty pole pomocí průsečíků, adresy, souřadnic a předvolby.",
    "fieldsNotes": "Pole označené hvězdičkou (*) je povinné pole. Zobrazení tohoto pole a editace šablony nevyplní hodnotu tohoto pole, nebudete moci uložit nový záznam.",
    "smartAttachmentText": "Konfigurovat akci chytrých příloh",
    "smartAttachmentPopupTitle": "Konfigurovat chytré přílohy pro <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Zobrazení",
      "displayTip": "Zobrazení – Určuje, zda je pole viditelné",
      "edit": "Editovatelné",
      "editTip": "Editovatelné – Označte, pokud se pole nachází ve formuláři atributů",
      "fieldName": "Název",
      "fieldNameTip": "Název – Název pole definovaný v databázi",
      "fieldAlias": "Alternativní jméno",
      "fieldAliasTip": "Alternativní název – Název pole definovaný v mapě",
      "canPresetValue": "Přednastavené",
      "canPresetValueTip": "Přednastavené – Možnost zobrazit pole v seznamu přednastavených polí a umožnit uživatelům nastavit hodnotu před zahájením editace",
      "actions": "Akce",
      "actionsTip": "Akce – Umožňuje měnit pořadí polí nebo nastavovat chytré atributy"
    },
    "smartAttSupport": "Chytré atributy nejsou podporovány u povinných polí databáze."
  },
  "actionPage": {
    "title": "Konfigurovat Akce atributů pro <b>${fieldname}</b>",
    "smartActionTitle": "Konfigurujte akce chytrých atributů pro pole <b>${fieldname}</b>",
    "description": "Tyto akce jsou vždy vypnuty, nezadáte-li kritéria, která je spustí. Tyto akce jsou zpracovány v pořadí a spustí se pouze jedna akce na pole. Kritéria definujete pomocí tlačítka Kritéria.",
    "copyAttributesNote": "Pokud zakážete jakoukoli akci pro toto pole pod názvem skupiny, bude to mít stejný efekt, jakoby tato akce byla upravena samostatně, a odstraní se tak z této skupiny.",
    "searchPlaceHolder": "Vyhledávání",
    "expandAllLabel": "Rozbalit všechny vrstvy",
    "domainListTitle": "Pole domény",
    "actionsSettingsTable": {
      "rule": "Akce",
      "ruleTip": "Akce – Akce provedená po splnění kritéria",
      "expression": "Výraz",
      "expressionTip": "Výraz – Výsledný výraz ve formátu SQL z definovaného kritéria",
      "groupName": "Název skupiny",
      "groupNameTip": "Název skupiny – Zobrazí název skupiny, z níž je výraz použit",
      "actions": "Kritéria",
      "actionsTip": "Kritéria – Změňte pořadí pravidla a definujte kritéria po jeho spuštění"
    },
    "copyAction": {
      "description": "Zdroje hodnot polí se zpracovávají v daném pořadí, pokud je aktivováno, dokud nedojde k spuštění platného kritéria nebo není dokončen seznam. Pokud si přejete definovat kritéria, použijte tlačítko Úprava kritérií.",
      "intersection": "Průsečík",
      "coordinates": "Souřadnice",
      "address": "Adresa",
      "preset": "Přednastavené",
      "actionText": "Akce",
      "criteriaText": "Kritéria",
      "enableText": "Povoleno"
    },
    "actions": {
      "hide": "Skrýt",
      "required": "Požadováno",
      "disabled": "Nepovoleno"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Varování: Samostatná editace odebere ze skupiny vybranou akci atributu související s tímto polem",
      "editGroupHint": "Varování: Samostatná editace odebere ze skupiny vybranou chytrou akci související s tímto polem",
      "popupTitle": "Vybrat editační možnost",
      "editAttributeGroup": "Vybraná akce atributu je definována ze skupiny. Pokud chcete editovat akci atributu, vyberte jednu z následujících možností:",
      "expression": "Výraz vybrané chytré akce je definován ze skupiny. Pokud chcete editovat výraz chytré akce, vyberte jednu z následujících možností:",
      "editGroupButton": "Upravit skupinu",
      "editIndependentlyButton": "Upravit nezávisle"
    }
  },
  "filterPage": {
    "submitHidden": "Odeslat atributová data pro pole i pokud jsou skrytá",
    "title": "Konfigurace výrazu pro pravidlo ${action}",
    "filterBuilder": "Nastavte akci u pole, pokud se záznam shoduje s ${any_or_all} z následujících výrazů",
    "noFilterTip": "Pomocí níže umístěných nástrojů definujte podmínku pro situaci, kdy je akce aktivní."
  },
  "geocoderPage": {
    "setGeocoderURL": "Nastavit adresu URL geokodéru",
    "hintMsg": "Poznámka: Provádíte změnu služby geokódování. Ujistěte se prosím, že jste aktualizovali všechna namapovaná pole geokodéru, která jste nakonfigurovali.",
    "invalidUrlTip": "Adresa URL ${URL} je neplatná nebo nepřístupná."
  },
  "addressPage": {
    "popupTitle": "Adresa",
    "checkboxLabel": "Získat hodnotu ze služby Geocoder",
    "selectFieldTitle": "Atribut",
    "geocoderHint": "Pokud si přejete provést změnu služby geocoder, přejděte do všeobecných nastavení a použijte tlačítko ‚Nastavení služby geocoder‘",
    "prevConfigruedFieldChangedMsg": "Dříve nakonfigurovaný atribut nebude možné nalézt v současném nastavení služby Geocoder. Atribut byl obnoven na výchozí hodnotu."
  },
  "coordinatesPage": {
    "popupTitle": "Souřadnice",
    "checkboxLabel": "Získat souřadnice",
    "coordinatesSelectTitle": "Souřadnicový systém",
    "coordinatesAttributeTitle": "Atribut",
    "mapSpatialReference": "Souřadnicový systém mapy",
    "latlong": "zeměpisné šířky/délky",
    "allGroupsCreatedMsg": "Všechny možné skupiny jsou již vytvořeny"
  },
  "presetPage": {
    "popupTitle": "Přednastavené",
    "checkboxLabel": "Pole bude nastaveno jako předvolba",
    "showOnlyDomainFields": "Zobrazit pouze pole domény",
    "hideInPresetDisplay": "Skrýt v zobrazení přednastavené hodnoty",
    "presetValueLabel": "Aktuální hodnota předvolby je:",
    "changePresetValueHint": "Pokud si přejete tuto hodnotu předvolby změnit, přejděte do všeobecných nastavení a použijte tlačítko ‚Definovat hodnoty předvoleb‘"
  },
  "intersectionPage": {
    "groupNameLabel": "Název skupiny",
    "dataTypeLabel": "Typ dat",
    "ignoreLayerRankingCheckboxLabel": "Ignorujte pořadí vrstev a najděte nejbližší prvek napříč všemi definovanými vrstvami",
    "intersectingLayersLabel": "Vrstva/vrstvy pro extrakci hodnoty",
    "layerAndFieldsApplyLabel": "Vrstva/vrstvy a pole pro použití extrahované hodnoty",
    "checkboxLabel": "Získat hodnotu z pole vrstvy křížení",
    "layerText": "Vrstvy",
    "fieldText": "Pole",
    "actionsText": "Akce",
    "toleranceSettingText": "Nastavení tolerance",
    "addLayerLinkText": "Přidat vrstvu",
    "useDefaultToleranceText": "Použít výchozí toleranci",
    "toleranceValueText": "Hodnota tolerance",
    "toleranceUnitText": "Jednotka tolerance",
    "pixelsUnitText": "Pixely",
    "useLayerName": "– Použít název vrstvy –",
    "noLayersMessage": "Ve vrstvách mapy nebylo nalezeno žádné pole odpovídající vybranému datovému typu."
  },
  "presetAll": {
    "popupTitle": "Definovat výchozí hodnoty předvoleb",
    "deleteTitle": "Odstranit hodnotu předvolby",
    "hintMsg": "Zde jsou uvedeny všechny názvy přednastavených polí. Po odstranění přednastaveného pole nebude dané pole přednastavené v žádné vrstvě/tabulce."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Výchozí hodnota tolerance průsečíku pro všechny prvky.",
    "pixelsToleranceTitle": "Výchozí tolerance průsečíků (hodnota v pixelech), která se použije pouze u bodových prvků."
  },
  "smartActionsPage": {
    "smartActionLabel": "Nastavit chytrou akci",
    "addNewSmartActionLinkText": "Přidat nové",
    "definedActions": "Definované akce",
    "priorityPopupTitle": "Nastavit prioritu chytrých akcí",
    "priorityPopupColumnTitle": "Chytré akce",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Název skupiny",
    "layerForExpressionLabel": "Vrstva pro výraz",
    "layerForExpressionNote": "Poznámka: Pole vybrané vrstvy budou použita pro definování kritérií",
    "expressionText": "Výraz",
    "editExpressionLabel": "Upravit výraz",
    "layerAndFieldsApplyLabel": "Vrstvy a pole, na něž má být výraz aplikován",
    "submitAttributeText": "Odeslat atributová data pro pole i pokud jsou skrytá",
    "priorityColumnText": "Prioritní",
    "requiredGroupNameMsg": "Tato hodnota je povinná",
    "uniqueGroupNameMsg": "Zadejte jedinečný název skupiny, skupina s tímto názvem již existuje.",
    "deleteGroupPopupTitle": "Odstranit skupinu chytrých akcí",
    "deleteGroupPopupMsg": "Odstranění skupiny bude mít za následek odebrání výrazu ze všech přiřazených akcí polí.",
    "invalidExpression": "Výraz musí být vyplněn",
    "warningMsgOnLayerChange": "Definovaný výraz a pole, na něž bude aplikován, budou vymazány.",
    "smartActionsTable": {
      "name": "Jméno",
      "expression": "Výraz",
      "definedFor": "Definováno pro"
    }
  },
  "attributeActionsPage": {
    "name": "Jméno",
    "type": "Typ",
    "deleteGroupPopupTitle": "Odstranit skupinu akcí atributů",
    "deleteGroupPopupMsg": "Odstranění skupiny bude mít za následek odebrání akce atributů ze všech souvisejících polí.",
    "alreadyAppliedActionMsg": "Akce ${action} již byla na toto pole aplikována."
  },
  "chooseFromLayer": {
    "fieldLabel": "Pole",
    "valueLabel": "Hodnota",
    "selectValueLabel": "Vybrat hodnotu"
  },
  "presetPopup": {
    "presetValueLAbel": "Přednastavená hodnota"
  },
  "dataType": {
    "esriFieldTypeString": "Řetězec",
    "esriFieldTypeInteger": "Číslo",
    "esriFieldTypeDate": "Datum",
    "esriFieldTypeGUID": "GUID"
  },
  "relativeDates": {
    "dateTypeLabel": "Typ data",
    "valueLabel": "Hodnota",
    "fixed": "Fixní",
    "current": "Aktuální",
    "past": "Minulé",
    "future": "Budoucí",
    "popupTitle": "Vybrat hodnotu",
    "hintForFixedDateType": "Nápověda: Nastavené Datum a čas bude použito jako přednastavená výchozí hodnota",
    "hintForCurrentDateType": "Nápověda: Nastavené Datum a čas bude použito jako přednastavená výchozí hodnota",
    "hintForPastDateType": "Nápověda: Zadaná hodnota bude odečtena od aktuálního data a času, a bude tak určena výchozí hodnota pro přednastavení.",
    "hintForFutureDateType": "Nápověda: Zadaná hodnota bude přidána od aktuálního data a času, a bude tak určena výchozí hodnota pro přednastavení.",
    "noDateDefinedTooltip": "Není určeno žádné datum",
    "relativeDateWarning": "Aby bylo možné uložit výchozí přednastavenou hodnotu, musí být zadána hodnota pro datum nebo čas."
  },
  "relativeDomains": {
    "fieldSetTitle": "Seznam",
    "valueText": "Hodnota",
    "defaultText": "Výchozí",
    "selectedDomainFieldsHint": "Vybraná pole domény: ${domainFields}",
    "selectDefaultDomainMsg": "Vyberte doménu s výchozí hodnotou nebo se ujistěte, že je zaškrtnuto políčko u vybrané výchozí domény."
  }
});