define({
  "layersPage": {
    "allLayers": "Összes réteg",
    "title": "Válasszon sablont a vektoros elemek létrehozásához",
    "generalSettings": "Általános beállítások",
    "layerSettings": "Rétegbeállítások",
    "smartActionsTabTitle": "Intelligens műveletek",
    "attributeActionsTabTitle": "Attribútumműveletek",
    "geocoderSettingsText": "Geokódoló beállításai",
    "editDescription": "Adja meg a szerkesztőpanelen megjelenítendő szöveget",
    "editDescriptionTip": "Ez a szöveg a Sablonválasztó felett jelenik meg. Ha nem kíván szöveget megjeleníteni, hagyja üresen.",
    "promptOnSave": "Rákérdezés a nem mentett változtatások mentésére az űrlap bezárásakor vagy a következő rekordra való átváltáskor.",
    "promptOnSaveTip": "Kérdés megjelenítése, ha a felhasználó a Bezárás elemre kattint vagy a következő szerkeszthető rekordra lép, miközben a jelenlegi vektoros elemen nem mentett változtatások vannak.",
    "promptOnDelete": "Megerősítés kérése a rekordok törlésekor.",
    "promptOnDeleteTip": "A művelet megerősítésére vonatkozó kérdés megjelenítése, ha a felhasználó a Törlés elemre kattint.",
    "removeOnSave": "Mentés esetén a vektoros elem eltávolítása a kiválasztásból.",
    "removeOnSaveTip": "Ezzel az opcióval beállítható, hogy a vektoros elem kiválasztása megszűnjön a rekord mentésekor. Ha az adott rekord az egyetlen kiválasztott rekord, akkor a panel a sablon oldalára vált vissza.",
    "useFilterEditor": "Vektoros elem sablonszűrőjének használata",
    "useFilterEditorTip": "Ezzel a lehetőséggel a sablonválasztó szűrő használata állítható be, amellyel megtekinthetők egy réteg sablonjai, vagy név szerint kereshetők a sablonok.",
    "displayShapeSelector": "Rajzolási beállítások mutatása",
    "createNewFeaturesFromExisting": "Új vektoros elemek meglévő vektoros elemekből történő létrehozásának engedélyezése a felhasználó számára",
    "createNewFeaturesFromExistingTip": "Ezzel a beállítással engedélyezhető a felhasználónak, hogy meglévő vektoros elemet másoljon új vektoros elemek létrehozásához",
    "copiedFeaturesOverrideDefaults": "A másolt vektoros elemek értéke felülírja az alapértelmezett értékeket",
    "copiedFeaturesOverrideDefaultsTip": "A másolt vektoros elemekből származó értékek csak az egyező mező(k) esetében írják felül az alapértelmezett értékeket",
    "displayShapeSelectorTip": "Ezzel a lehetőséggel a kiválasztott sablon érvényes rajzolási beállításainak listája jeleníthető meg.",
    "displayPresetTop": "Előre beállított értékek listájának megjelenítése felül",
    "displayPresetTopTip": "Ezzel a lehetőséggel az előre beállított értékek listája jeleníthető meg a sablonválasztó felett.",
    "listenToGroupFilter": "A Csoportszűrő widgetből származó szűrőértékek alkalmazása az Előre beállított értékek mezőiben",
    "listenToGroupFilterTip": "Amikor egy szűrőt alkalmaznak a Group Filter widgetben, az adott érték alkalmazása egy megfelelő mezőre az Előre beállított értékek listában.",
    "keepTemplateActive": "A kiválasztott sablon maradjon aktív",
    "keepTemplateActiveTip": "A korábban kiválasztott sablon újbóli kiválasztása a sablonválasztó megjelenítésekor.",
    "geometryEditDefault": "Geometria szerkesztésének engedélyezése alapértelmezés szerint",
    "autoSaveEdits": "Automatikusan menti az új vektoros elemet",
    "enableAttributeUpdates": "Attribútumműveletek frissítése gomb megjelenítése, amikor a geometria szerkesztése aktív",
    "enableAutomaticAttributeUpdates": "Automatikusan lehívja az attribútumműveleteket a geometria frissítése után",
    "enableLockingMapNavigation": "Térképnavigáció zárolásának engedélyezése",
    "enableMovingSelectedFeatureToGPS": "A kijelölt ponttípusú vektoros elem GPS helyszínre való áthelyezésének engedélyezése",
    "enableMovingSelectedFeatureToXY": "A kijelölt ponttípusú vektoros elem XY helyszínre való áthelyezésének engedélyezése",
    "featureTemplateLegendLabel": "Vektoroselem-sablon és szűrőérték-beállítások",
    "saveSettingsLegendLabel": "Beállítások mentése",
    "geometrySettingsLegendLabel": "Geometriabeállítások",
    "buttonPositionsLabel": "A Mentés, Törlés, Vissza és a Törlése gombok helye",
    "belowEditLabel": "Szerkesztés űrlap alatt",
    "aboveEditLabel": "Szerkesztés űrlap felett",
    "switchToMultilineInput": "Váltson többsoros bevitelre, ha a mező hosszúsága meghaladja a következőt:",
    "layerSettingsTable": {
      "allowDelete": "Törlés engedélyezése",
      "allowDeleteTip": "Törlés engedélyezése – Ezzel a beállítással engedélyezhető a felhasználónak a vektoros elemek törlése; le van tiltva, ha a réteg nem támogatja a törlést",
      "edit": "Szerkeszthető",
      "editTip": "Szerkeszthető – Ezzel a beállítással a réteg felvehető a widgetbe",
      "label": "Réteg",
      "labelTip": "Réteg – A réteg neve a térképen meghatározott formában",
      "update": "Geometria szerkesztésének tiltása",
      "updateTip": "Geometria szerkesztésének tiltása – Ezzel a beállítással letiltható a geometria mozgatása, miután elhelyezték, illetve a geometria mozgatása egy meglévő vektoros elemre",
      "allowUpdateOnly": "Csak frissítés",
      "allowUpdateOnlyTip": "Csak frissítés – Ezzel a beállítással megadható, hogy csak a létező vektoros elemek módosítása legyen engedélyezett; alapértelmezés szerint be van jelölve, és ha a réteg nem támogatja az új vektoros elemek létrehozását, akkor le van tiltva",
      "fieldsTip": "A szerkeszteni kívánt mezők módosítása, és okos attribútumok megadása",
      "actionsTip": "Műveletek – Lehetőség a mezők szerkesztésére vagy a kapcsolt rétegek/táblák elérésére",
      "description": "Leírás",
      "descriptionTip": "Leírás – Ezzel a beállítással az attribútumok oldalának tetején megjelenő szöveget adhat meg.",
      "relationTip": "Kapcsolt rétegek és táblák megtekintése"
    },
    "editFieldError": "A mezők módosításai és az okos attribútumok nem érhetők el a nem szerkeszthető rétegek számára",
    "noConfigedLayersError": "Az Okos szerkesztő egy vagy több szerkeszthető réteget igényel",
    "toleranceErrorMsg": "Érvénytelen alapértelmezett metszéspont-tolerancia érték",
    "pixelsToleranecErrorMsg": "Érvénytelen alapértelmezett képpont-tolerancia érték",
    "invalidMaxCharacterErrorMsg": "Érvénytelen érték a többsoros bevitelre váltáskor"
  },
  "editDescriptionPage": {
    "title": "Adja meg az attribútum-áttekintési szöveget a(z) <b>${layername}</b> réteghez "
  },
  "fieldsPage": {
    "title": "Konfigurálja a mezőket a(z) <b>${layername}</b> réteghez",
    "copyActionTip": "Attribútumműveletek",
    "editActionTip": "Intelligens műveletek",
    "description": "A Műveletek szerkesztése gombbal aktiválhatja az okos attribútumokat a rétegekben. Az okos attribútumok más mezők értékei alapján képesek megkövetelni, elrejteni, illetve letiltani adott mezőket. A Műveletek másolása gombbal aktiválhatja és határozhatja meg a mezőérték forrását kereszteződés, cím, koordináták és előre beállított érték szerint.",
    "fieldsNotes": "* = kötelezően kitöltendő mező. Ha ehhez a mezőhöz kikapcsolja a Megjelenítés beállítást, és a szerkesztési sablon nem tölti ki a mező értékét, akkor nem lesz lehetősége új rekordot menteni.",
    "smartAttachmentText": "Az okos csatolmányok művelet konfigurálása",
    "smartAttachmentPopupTitle": "<b>${layername}</b> okos csatolmányainak konfigurálása",
    "fieldsSettingsTable": {
      "display": "Megjelenítés",
      "displayTip": "Megjelenítés – Határozza meg, hogy látható-e a mező",
      "edit": "Szerkeszthető",
      "editTip": "Szerkeszthető – Jelölje be, ha a mező szerepel az attribútumok űrlapján",
      "fieldName": "Név",
      "fieldNameTip": "Név – A mező adatbázisban meghatározott neve",
      "fieldAlias": "Aliasnév",
      "fieldAliasTip": "Aliasnév –A mező térképen meghatározott neve",
      "canPresetValue": "Előre beállított",
      "canPresetValueTip": "Előre beállított – Ezzel a beállítással a mező megjeleníthető az előre beállított mezők listájában, és a felhasználó számára engedélyezhető, hogy a szerkesztés előtt beállítsa az értékét",
      "actions": "Műveletek",
      "actionsTip": "Műveletek – A mezők sorrendjének módosítása, vagy okos attribútumok beállítása"
    },
    "smartAttSupport": "A kötelező adatbázismezőknél nem támogatott az okos attribútumok használata"
  },
  "actionPage": {
    "title": "<b>${fieldname}</b> attribútumműveleteinek konfigurálása",
    "smartActionTitle": "<b>${fieldname}</b> okos attribútumműveleteinek konfigurálása",
    "description": "A műveletek mindig ki vannak kapcsolva, ha nem ad meg olyan kritériumokat, amelyek alapján aktiválódnak. A műveletek végrehajtása sorrendben történik, és mezőnként csak egy művelet aktiválódik. A kritériumok szerkesztéséhez használja a Kritériumok szerkesztése gombot.",
    "copyAttributesNote": "A csoportnévvel rendelkező művelet letiltása ugyanolyan hatással van, mint az adott művelet független módosítása, és eltávolítja az adott csoportból a mezőre vonatkozó műveletet.",
    "searchPlaceHolder": "Keresés",
    "expandAllLabel": "Összes réteg kibontása",
    "domainListTitle": "Tartománymezők",
    "actionsSettingsTable": {
      "rule": "Művelet",
      "ruleTip": "Művelet – A feltételek teljesülése esetén végrehajtandó művelet",
      "expression": "Kifejezés",
      "expressionTip": "Kifejezés – A megadott kritérium alapján létrejövő kifejezés SQL formátumban",
      "groupName": "Csoport neve",
      "groupNameTip": "Csoport neve – Azt a csoportnevet jeleníti meg, amelyből a kifejezés alkalmazása történik",
      "actions": "Kritériumok",
      "actionsTip": "Feltételek – A szabály sorrendjének módosítása és az aktiválás feltételeinek megadása"
    },
    "copyAction": {
      "description": "A mezőértékforrások feldolgozása sorrendben történik aktiválás esetén, amíg érvényes nem lesz egy feltétel vagy amíg be nem fejeződik a lista Használja a Feltételek szerkesztése gombot a feltételek meghatározásához.",
      "intersection": "Kereszteződés",
      "coordinates": "Koordináták",
      "address": "Cím",
      "preset": "Előre beállított",
      "actionText": "Műveletek",
      "criteriaText": "Kritériumok",
      "enableText": "Engedélyezve"
    },
    "actions": {
      "hide": "Elrejtés",
      "required": "Kötelező",
      "disabled": "Letiltva"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Figyelem: a Független szerkesztés művelet eltávolítja a kiválasztott, a mezőhöz társított attribútumműveletet a csoportból",
      "editGroupHint": "Figyelem: a Független szerkesztés művelet eltávolítja a kiválasztott, a mezőhöz társított intelligens műveletet a csoportból",
      "popupTitle": "Szerkesztési lehetőség választása",
      "editAttributeGroup": "A kiválasztott attribútumművelet a csoportból van meghatározva. Válassza ki az alábbi, az attribútumművelet szerkesztésére szolgáló lehetőségek valamelyikét:",
      "expression": "A kiválasztott intelligens művelet kifejezése a csoportból van meghatározva. Válassza ki az alábbi, az intelligensművelet-kifejezés szerkesztésére szolgáló lehetőségek valamelyikét:",
      "editGroupButton": "Csoport szerkesztése",
      "editIndependentlyButton": "Önálló szerkesztés"
    }
  },
  "filterPage": {
    "submitHidden": "Akkor is alkalmazzon attribútumadatokat a mezőkhöz, ha rejtve vannak?",
    "title": "Kifejezés konfigurálása a(z) ${action} szabályhoz",
    "filterBuilder": "Művelet beállítása a mezőhöz, ha a rekord a következők közül ${any_or_all} kifejezésnek megfelel",
    "noFilterTip": "Az alábbi eszközök segítségével határozza meg az utasítást arra az esetre, ha a művelet aktív."
  },
  "geocoderPage": {
    "setGeocoderURL": "Geokódoló URL-címének beállítása",
    "hintMsg": "Megjegyzés: Mivel megváltoztatja a geokódoló szolgáltatást, módosítsa megfelelően a konfigurált geokódoló mezők leképezéseit is.",
    "invalidUrlTip": "A(z) ${URL} URL-cím érvénytelen vagy nem érhető el."
  },
  "addressPage": {
    "popupTitle": "Cím",
    "checkboxLabel": "Érték beolvasása a a geokódolóból",
    "selectFieldTitle": "Attribútum",
    "geocoderHint": "A geokódoló megváltoztatásához használja az általános beállítások között található „Geokódoló beállításai” gombot",
    "prevConfigruedFieldChangedMsg": "Az előzőleg konfigurált attribútum nem található az aktuális geokódoló-beállítások között. Megtörtént az attribútum visszaállítása az alapértelmezett értékre."
  },
  "coordinatesPage": {
    "popupTitle": "Koordináták",
    "checkboxLabel": "Koordináták beolvasása",
    "coordinatesSelectTitle": "Koordináta-rendszer",
    "coordinatesAttributeTitle": "Attribútum",
    "mapSpatialReference": "Térkép koordináta-rendszere",
    "latlong": "Hosszúság/szélesség",
    "allGroupsCreatedMsg": "Már valamennyi lehetséges csoportot létrehozták"
  },
  "presetPage": {
    "popupTitle": "Előre beállított",
    "checkboxLabel": "A mező előre beállított értékű lesz",
    "showOnlyDomainFields": "Csak tartománymezők megjelenítése",
    "hideInPresetDisplay": "Elrejtés az előre beállított érték kijelzőn",
    "presetValueLabel": "Az aktuális előre beállított érték:",
    "changePresetValueHint": "Az előre beállított érték megváltoztatásához használja az általános beállítások között található „Előre beállított érték meghatározása” gombot"
  },
  "intersectionPage": {
    "groupNameLabel": "Csoport neve",
    "dataTypeLabel": "Adattípus",
    "ignoreLayerRankingCheckboxLabel": "Réteg rangsorolásának figyelmen kívül hagyása és a legközelebbi vektoros elem keresése valamennyi meghatározott rétegben",
    "intersectingLayersLabel": "Érték kinyerésére szolgáló réteg(ek)",
    "layerAndFieldsApplyLabel": "A kinyert érték alkalmazására szolgáló réteg(ek) és mező(k)",
    "checkboxLabel": "Érték beolvasása a metszéspont rétegének mezőjéből",
    "layerText": "Rétegek",
    "fieldText": "Mezők",
    "actionsText": "Műveletek",
    "toleranceSettingText": "Toleranciabeállítások",
    "addLayerLinkText": "Réteg hozzáadása",
    "useDefaultToleranceText": "Alapértelmezett tolerancia használata",
    "toleranceValueText": "Toleranciaérték",
    "toleranceUnitText": "Tolerancia egysége",
    "pixelsUnitText": "Pixelek",
    "useLayerName": "– Rétegnév használata –",
    "noLayersMessage": "Nem található olyan mező a térkép rétegeiben, amely egyezne a kiválasztott adattípussal."
  },
  "presetAll": {
    "popupTitle": "Határozza meg az alapértelmezett előre beállított értékeket",
    "deleteTitle": "Előre beállított érték törlése",
    "hintMsg": "Itt szerepel az összes előre beállított egyedi mezőnév. Előre beállított mező eltávolítása esetén a rendszer letiltja a mező előre beállított értékét minden rétegben/táblában."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Alapértelmezett metszéspont-tolerancia valamennyi vektoros elemre vonatkozóan",
    "pixelsToleranceTitle": "A csak a pontszerű térképobjektumokra alkalmazandó alapértelmezett metszéspont-tolerancia (pixelérték)."
  },
  "smartActionsPage": {
    "smartActionLabel": "Intelligens művelet konfigurálása",
    "addNewSmartActionLinkText": "Új hozzáadása",
    "definedActions": "Meghatározott műveletek",
    "priorityPopupTitle": "Intelligens műveletek prioritásának beállítása",
    "priorityPopupColumnTitle": "Intelligens műveletek",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Csoport neve",
    "layerForExpressionLabel": "Kifejezendő réteg",
    "layerForExpressionNote": "Megjegyzés: A rendszer a kiválasztott réteg mezőit használja a feltételek meghatározásához",
    "expressionText": "Kifejezés",
    "editExpressionLabel": "Kifejezés szerkesztése",
    "layerAndFieldsApplyLabel": "Használandó rétegek és mezők",
    "submitAttributeText": "Akkor is alkalmazzon attribútumadatokat a mezőkhöz, ha rejtve vannak?",
    "priorityColumnText": "Prioritás",
    "requiredGroupNameMsg": "Ezt az értéket kötelező megadni",
    "uniqueGroupNameMsg": "Egyedi csoportnevet adjon meg: már létezik csoport ilyen névvel.",
    "deleteGroupPopupTitle": "Intelligensművelet-csoport törlése",
    "deleteGroupPopupMsg": "A csoport törlése a kifejezés eltávolítását eredményezi valamennyi társított mező műveletéből.",
    "invalidExpression": "A kifejezés nem lehet üres",
    "warningMsgOnLayerChange": "A meghatározott kifejezést és kifejezéshez használt mezőket a rendszer törölni fogja.",
    "smartActionsTable": {
      "name": "Név",
      "expression": "Kifejezés",
      "definedFor": "Meghatározás célja"
    }
  },
  "attributeActionsPage": {
    "name": "Név",
    "type": "Típus",
    "deleteGroupPopupTitle": "Attribútumművelet-csoport törlése",
    "deleteGroupPopupMsg": "A csoport törlése az attribútumművelet eltávolítását eredményezi valamennyi társított mező műveletéből.",
    "alreadyAppliedActionMsg": "A(z) ${action} műveltet már alkalmazták erre a mezőre."
  },
  "chooseFromLayer": {
    "fieldLabel": "Mező",
    "valueLabel": "Érték",
    "selectValueLabel": "Érték kiválasztása"
  },
  "presetPopup": {
    "presetValueLAbel": "Előre beállított érték"
  },
  "dataType": {
    "esriFieldTypeString": "Karakterlánc",
    "esriFieldTypeInteger": "Szám",
    "esriFieldTypeDate": "Dátum",
    "esriFieldTypeGUID": "GUID"
  },
  "relativeDates": {
    "dateTypeLabel": "Dátumtípus",
    "valueLabel": "Érték",
    "fixed": "Rögzített",
    "current": "Jelenlegi",
    "past": "Elmúlt",
    "future": "Jövőbeli",
    "popupTitle": "Érték kiválasztása",
    "hintForFixedDateType": "Tipp: A rendszer előre beállított alapértelmezett értékként kezeli a megadott dátumot és időt",
    "hintForCurrentDateType": "Tipp: A rendszer előre beállított alapértelmezett értékként kezeli az aktuális dátumot és időt",
    "hintForPastDateType": "Tipp: Az előre beállított alapértelmezett érték meghatározásához a rendszer levonja a megadott értéket az aktuális dátumból és időből.",
    "hintForFutureDateType": "Tipp: Az előre beállított alapértelmezett érték meghatározásához a rendszer hozzáadja a megadott értéket az aktuális dátumhoz és időhöz.",
    "noDateDefinedTooltip": "Nincs meghatározva dátum",
    "relativeDateWarning": "Dátum vagy időértéket kell meghatározni ahhoz, hogy menteni lehessen az alapértelmezett előre beállított értéket."
  },
  "relativeDomains": {
    "fieldSetTitle": "Lista",
    "valueText": "Érték",
    "defaultText": "Alapértelmezett",
    "selectedDomainFieldsHint": "Kiválasztott tartoménymező(k): ${domainFields}",
    "selectDefaultDomainMsg": "Válasszon egy alapértelmezett értéktartományt, vagy győződjön meg arról, hogy a kiválasztott alapértelmezett tartományhoz tartozó jelölőnégyzet be van jelölve"
  }
});