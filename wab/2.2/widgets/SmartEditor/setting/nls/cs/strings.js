define({
  "layersPage": {
    "title": "Zvolte šablonu, podle které chcete vytvářet prvky.",
    "generalSettings": "Obecná nastavení",
    "layerSettings": "Nastavení vrstvy",
    "editDescription": "Zadejte text zobrazení pro panel úprav.",
    "editDescriptionTip": "Tento text se zobrazí nad nástrojem pro volbu šablon. Pokud nechcete použít žádný text, ponechte pole prázdné.",
    "promptOnSave": "Vyzve k uložení neuložených úprav, pokud formulář zavřete nebo přepnete na další záznam.",
    "promptOnSaveTip": "Zobrazí výzvu, když uživatel kliknutím obsah uzavře nebo přejde k dalšímu editovatelnému záznamu, pokud aktuální prvek obsahuje neuložené změny.",
    "promptOnDelete": "Při odstranění záznamu bude vyžadováno potvrzení.",
    "promptOnDeleteTip": "Zobrazí výzvu k potvrzení akce, pokud se uživatel kliknutím pokusí o odstranění.",
    "removeOnSave": "Při uložení se prvek odebere z výběru.",
    "removeOnSaveTip": "Možnost odstranit prvek ze sady výběru po uložení záznamu. Pokud jde o jediný vybraný záznam, panel se přepne zpět na stránku šablony.",
    "useFilterEditor": "Použít filtr šablon prvků",
    "useFilterEditorTip": "Možnost použít nástroj pro volbu šablon filtru, která umožňuje zobrazit šablony jedné vrstvy nebo vyhledávat šablony podle názvu.",
    "listenToGroupFilter": "Použít hodnoty filtrů z widgetu Filtr skupin na přednastavená pole",
    "listenToGroupFilterTip": "Po aplikaci filtru na widget Filtr skupin aplikuje hodnotu na odpovídající pole v seznamu přednastavených polí.",
    "keepTemplateActive": "Ponechat vybranou šablonu aktivní",
    "keepTemplateActiveTip": "Když je zobrazen nástroj pro volbu šablon a šablona byla dříve vybrána, vybere se znovu.",
    "layerSettingsTable": {
      "allowDelete": "Povolit odstranění",
      "allowDeleteTip": "Umožňuje uživatelům odstranit prvek; tato možnost je zakázána, pokud vrstva nepodporuje odstraňování.",
      "edit": "Editovatelné",
      "editTip": "Možnost zahrnout vrstvu ve widgetu.",
      "label": "Vrstva",
      "labelTip": "Název vrstvy podle definice v mapě.",
      "update": "Zakázat editaci geometrie",
      "updateTip": "Možnost zakázat přesouvání geometrie po umístění nebo přesouvání geometrie na existující prvek.",
      "allowUpdateOnly": "Pouze aktualizace",
      "allowUpdateOnlyTip": "Možnost povolit pouze úpravy existujících prvků. Ve výchozím nastavení je tato možnost povolena. Je zakázána, pokud vrstva nepodporuje vytváření nových prvků.",
      "fields": "Pole",
      "fieldsTip": "Umožňuje upravit pole, která budou editována, a definovat chytré atributy.",
      "description": "Popis",
      "descriptionTip": "Možnost zadat text, který se zobrazí v horní části stránky atributů."
    },
    "editFieldError": "Úprava polí a chytré atributy nejsou k dispozici u vrstev, které nejsou editovatelné.",
    "noConfigedLayersError": "Smart Editor vyžaduje jednu či více editovatelných vrstev."
  },
  "editDescriptionPage": {
    "title": "Definujte text přehledu atributů pro vrstvu <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurujte pole pro vrstvu <b>${layername}</b>",
    "description": "Pomocí sloupce Přednastavené umožněte uživateli zadat hodnotu před vytvořením nového prvku. Pomocí tlačítka Akce aktivujte chytré atributy pro vrstvu. Chytré atributy mohou vyžadovat, skrýt nebo zakázat pole na základě hodnot v jiných polích.",
    "fieldsNotes": "Pole označené hvězdičkou (*) je povinné pole. Zobrazení tohoto pole a editace šablony nevyplní hodnotu tohoto pole, nebudete moci uložit nový záznam.",
    "fieldsSettingsTable": {
      "display": "Zobrazení",
      "displayTip": "Určuje, zda je pole viditelné.",
      "edit": "Editovatelné",
      "editTip": "Označte, pokud se pole nachází ve formuláři atributů.",
      "fieldName": "Název",
      "fieldNameTip": "Název pole definovaný v databázi",
      "fieldAlias": "Alternativní jméno",
      "fieldAliasTip": "Název pole definovaný v mapě",
      "canPresetValue": "Přednastavené",
      "canPresetValueTip": "Možnost zobrazit pole v seznamu přednastavených polí a umožnit uživatelům nastavit hodnotu před zahájením editace.",
      "actions": "Akce",
      "actionsTip": "Umožňuje měnit pořadí polí nebo nastavovat chytré atributy."
    },
    "smartAttSupport": "Chytré atributy nejsou podporovány u vyžadovaných polí databáze."
  },
  "actionPage": {
    "title": "Konfigurujte akce chytrých atributů pro pole <b>${fieldname}</b>",
    "description": "Tyto akce jsou vždy vypnuty, nezadáte-li kritéria, která je spustí. Tyto akce jsou zpracovány v pořadí a spustí se pouze jedna akce na pole. Kritéria definujete pomocí tlačítka Kritéria.",
    "actionsSettingsTable": {
      "rule": "Akce",
      "ruleTip": "Akce provedená po splnění kritéria",
      "expression": "Výraz",
      "expressionTip": "Výsledný výraz ve formátu SQL z definovaného kritéria",
      "actions": "Kritéria",
      "actionsTip": "Změňte pořadí pravidla a definujte kritéria po jeho spuštění"
    },
    "actions": {
      "hide": "Skrýt",
      "required": "Požadováno",
      "disabled": "Nepovoleno"
    }
  },
  "filterPage": {
    "submitHidden": "Odeslat atributová data pro toto pole i pokud je skryté?",
    "title": "Konfigurace výrazu pro pravidlo ${fiction}",
    "filterBuilder": "Nastavte akci u pole, pokud se záznam shoduje s ${any_or_all} z následujících výrazů",
    "noFilterTip": "Pomocí níže umístěných nástrojů definujte podmínku pro situaci, kdy je akce aktivní."
  }
});