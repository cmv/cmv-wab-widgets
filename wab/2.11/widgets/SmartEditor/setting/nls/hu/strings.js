define({
  "layersPage": {
    "allLayers": "Összes réteg",
    "title": "Válasszon sablont a vektoros elemek létrehozásához",
    "generalSettings": "Általános beállítások",
    "layerSettings": "Rétegbeállítások",
    "presetValueText": "Előre beállított értékek meghatározása",
    "geocoderSettingsText": "Geokódoló beállításai",
    "editDescription": "Adja meg a szerkesztőpanel megjelenítendő szövegét",
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
    "enableAutomaticAttributeUpdates": "Automatikusan lehívja az attribútumműveletet a geometria frissítése után",
    "enableLockingMapNavigation": "Térképnavigáció zárolásának engedélyezése",
    "enableMovingSelectedFeatureToGPS": "A kijelölt ponttípusú vektoros elem GPS helyszínre való áthelyezésének engedélyezése",
    "enableMovingSelectedFeatureToXY": "A kijelölt ponttípusú vektoros elem XY helyszínre való áthelyezésének engedélyezése",
    "featureTemplateLegendLabel": "Vektoroselem-sablon és szűrőérték-beállítások",
    "saveSettingsLegendLabel": "Beállítások mentése",
    "geometrySettingsLegendLabel": "Geometriabeállítások",
    "buttonPositionsLabel": "A Mentés, Törlés, Vissza és a Kijelölés Törlése gombok helye",
    "belowEditLabel": "Szerkesztés űrlap alatt",
    "aboveEditLabel": "Szerkesztés űrlap felett",
    "layerSettingsTable": {
      "allowDelete": "Törlés engedélyezése",
      "allowDeleteTip": "Ezzel a beállítással engedélyezhető a felhasználónak a vektoros elemek törlése; le van tiltva, ha a réteg nem támogatja a törlést",
      "edit": "Szerkeszthető",
      "editTip": "Ezzel a beállítással a réteg felvehető a widgetbe",
      "label": "Réteg",
      "labelTip": "A réteg neve a térképen meghatározott formában",
      "update": "Geometria szerkesztésének tiltása",
      "updateTip": "Ezzel a beállítással letiltható a geometria mozgatása, miután elhelyezték, illetve a geometria mozgatása egy meglévő vektoros elemre",
      "allowUpdateOnly": "Csak frissítés",
      "allowUpdateOnlyTip": "Ezzel a beállítással megadható, hogy csak a létező vektoros elemek módosítása legyen engedélyezett; alapértelmezés szerint be van jelölve, és ha a réteg nem támogatja az új vektoros elemek létrehozását, akkor le van tiltva",
      "fieldsTip": "A szerkeszteni kívánt mezők módosítása, és okos attribútumok megadása",
      "actionsTip": "Lehetőség a mezők szerkesztésére vagy a kapcsolt rétegek/táblák elérésére",
      "description": "Leírás",
      "descriptionTip": "Ezzel a beállítással az attribútumok oldalának tetején megjelenő szöveget adhat meg.",
      "relationTip": "Kapcsolt rétegek és táblák megtekintése"
    },
    "editFieldError": "A mezők módosításai és az okos attribútumok nem érhetők el a nem szerkeszthető rétegek számára",
    "noConfigedLayersError": "Az Okos szerkesztő egy vagy több szerkeszthető réteget igényel"
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
      "displayTip": "Határozza meg, hogy látható-e a mező",
      "edit": "Szerkeszthető",
      "editTip": "Jelölje be, ha a mező szerepel az attribútumok űrlapján",
      "fieldName": "Név",
      "fieldNameTip": "A mező adatbázisban meghatározott neve",
      "fieldAlias": "Aliasnév",
      "fieldAliasTip": "A mező térképen meghatározott neve",
      "canPresetValue": "Előre beállított",
      "canPresetValueTip": "Ezzel a beállítással a mező megjeleníthető az előre beállított mezők listájában, és a felhasználó számára engedélyezhető, hogy a szerkesztés előtt beállítsa az értékét",
      "actions": "Műveletek",
      "actionsTip": "A mezők sorrendjének módosítása, vagy okos attribútumok beállítása"
    },
    "smartAttSupport": "A kötelező adatbázismezőknél nem támogatott az okos attribútumok használata"
  },
  "actionPage": {
    "title": "<b>${fieldname}</b> attribútumműveleteinek konfigurálása",
    "smartActionTitle": "<b>${fieldname}</b> okos attribútumműveleteinek konfigurálása",
    "description": "A műveletek mindig ki vannak kapcsolva, ha nem ad meg olyan kritériumokat, amelyek alapján aktiválódnak. A műveletek végrehajtása sorrendben történik, és mezőnként csak egy művelet aktiválódik. A kritériumok szerkesztéséhez használja a Kritériumok szerkesztése gombot.",
    "actionsSettingsTable": {
      "rule": "Művelet",
      "ruleTip": "A feltételek teljesülése esetén végrehajtandó művelet",
      "expression": "Kifejezés",
      "expressionTip": "A megadott kritérium alapján létrejövő kifejezés SQL formátumban",
      "actions": "Kritériumok",
      "actionsTip": "A szabály sorrendjének módosítása és az aktiválás kritériumának megadása"
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
    }
  },
  "filterPage": {
    "submitHidden": "Akkor is alkalmazzon attribútumadatokat ehhez a mezőhöz, ha rejtve van?",
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
    "selectFieldTitle": "Attribútum:",
    "geocoderHint": "A geokódoló megváltoztatásához használja az általános beállítások között található „Geokódoló beállításai” gombot"
  },
  "coordinatesPage": {
    "popupTitle": "Koordináták",
    "checkboxLabel": "Koordináták beolvasása",
    "coordinatesSelectTitle": "Koordináta-rendszer:",
    "coordinatesAttributeTitle": "Attribútum:",
    "mapSpatialReference": "Térkép koordináta-rendszere",
    "latlong": "Hosszúság/szélesség"
  },
  "presetPage": {
    "popupTitle": "Előre beállított",
    "checkboxLabel": "A mező előre beállított értékű lesz",
    "presetValueLabel": "Az aktuális előre beállított érték:",
    "changePresetValueHint": "Az előre beállított érték megváltoztatásához használja az általános beállítások között található „Előre beállított érték meghatározása” gombot"
  },
  "intersectionPage": {
    "checkboxLabel": "Érték beolvasása a metszéspont rétegének mezőjéből",
    "layerText": "Rétegek",
    "fieldText": "Mezők",
    "actionsText": "Műveletek",
    "addLayerLinkText": "Réteg hozzáadása"
  },
  "presetAll": {
    "popupTitle": "Határozza meg az alapértelmezett előre beállított értékeket",
    "deleteTitle": "Előre beállított érték törlése",
    "hintMsg": "Itt szerepel az összes előre beállított mező neve. Az előre beállított mező eltávolítása letiltja a mező előre beállított értékét minden rétegben/táblában."
  }
});