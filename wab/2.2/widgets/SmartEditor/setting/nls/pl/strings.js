define({
  "layersPage": {
    "title": "Wybierz szablon, aby utworzyć obiekty",
    "generalSettings": "Ustawienia ogólne",
    "layerSettings": "Ustawienia warstwy",
    "editDescription": "Podaj tekst wyświetlany dla panelu edycji",
    "editDescriptionTip": "Ten tekst jest wyświetlany powyżej okna wyboru szablonu; aby nie wyświetlać tekstu, pozostaw pole puste.",
    "promptOnSave": "Przypominaj o zapisaniu niezapisanych zmian, gdy formularz jest zamykany lub podczas przechodzenia do następnego rekordu.",
    "promptOnSaveTip": "Wyświetla przypomnienie, gdy użytkownik klika przycisk zamykania lub przechodzi do następnego edytowalnego rekordu, a bieżący obiekt ma niezapisane zmiany.",
    "promptOnDelete": "Wymagaj potwierdzenia podczas usuwania rekordu.",
    "promptOnDeleteTip": "Wyświetla przypomnienie, gdy użytkownik kliknie przycisk usuwania, aby potwierdzić czynność.",
    "removeOnSave": "Usuń obiekt z wyboru podczas zapisywania.",
    "removeOnSaveTip": "Opcja usunięcia obiektu z wybranego zestawu podczas zapisywania rekordu. Jeśli jest to jedyny wybrany rekord, panel jest przełączany z powrotem do strony szablonu.",
    "useFilterEditor": "Użyj szablonu filtrów obiektu",
    "useFilterEditorTip": "Opcja użycia okna wyboru szablonu filtrów, która umożliwia wyświetlenie szablonów jednej warstwy lub wyszukiwanie szablonów według nazwy.",
    "listenToGroupFilter": "Stosowanie wartości filtru z widżetu Filtr grupy do pól Ustawienie wstępne",
    "listenToGroupFilterTip": "Podczas stosowania filtru w widżecie Filtr grupy zastosuj wartość do zgodnego pola na liście wartości Ustawienie wstępne.",
    "keepTemplateActive": "Utrzymywanie aktywności wybranego szablonu",
    "keepTemplateActiveTip": "Po wyświetleniu okna wyboru szablonu, jeśli szablon był wcześniej wybrany, wybierz go ponownie.",
    "layerSettingsTable": {
      "allowDelete": "Zezwalaj na usuwanie",
      "allowDeleteTip": "Opcja umożliwiająca użytkownikowi usuwanie obiektów; wyłączona, jeśli warstwa nie obsługuje usuwania",
      "edit": "Edytowalne",
      "editTip": "Opcja włączenia warstwy w widżecie",
      "label": "Warstwa",
      "labelTip": "Nazwa warstwy zdefiniowana w mapie",
      "update": "Wyłącz edycję geometrii",
      "updateTip": "Pozwala wyłączyć możliwość przeniesienia geometrii po jej umieszczeniu lub przeniesienia geometrii na istniejący obiekt",
      "allowUpdateOnly": "Tylko aktualizacja",
      "allowUpdateOnlyTip": "Opcja umożliwiająca tylko modyfikację istniejących obiektów; domyślnie zaznaczona, a wyłączona, gdy warstwa nie obsługuje tworzenia nowych obiektów",
      "fields": "Pola",
      "fieldsTip": "Modyfikuj pola, które mają być edytowane i definiuj inteligentne atrybuty",
      "description": "Opis",
      "descriptionTip": "Opcja wprowadzania tekstu do wyświetlenia u góry strony atrybutów."
    },
    "editFieldError": "Modyfikacje pól i inteligentne atrybuty nie są dostępne w przypadku warstw, które nie są modyfikowalne",
    "noConfigedLayersError": "Inteligentny edytor wymaga co najmniej jednej edytowalnej warstwy"
  },
  "editDescriptionPage": {
    "title": "Zdefiniuj tekst opisu atrybutów dla warstwy <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Skonfiguruj pola dla warstwy <b>${layername}</b>",
    "description": "Użyj kolumny Ustawienie wstępne, aby umożliwić użytkownikowi wprowadzenie wartości przed utworzeniem nowego obiektu. Użyj przycisku edycji Działania, aby aktywować w warstwie inteligentne atrybuty. Inteligentne atrybuty mogą powodować, że pole będzie wymagane, ukryte lub wyłączone, zależnie od wartości w innych polach.",
    "fieldsNotes": "* pole wymagane. Jeśli usuniesz zaznaczenie opcji Wyświetlaj dla tego pola, a szablon edycji nie wpisze wartości w tym polu, nie będzie można zapisać nowego rekordu.",
    "fieldsSettingsTable": {
      "display": "Wyświetl",
      "displayTip": "Decyduje, czy pole jest widoczne",
      "edit": "Edytowalne",
      "editTip": "Zaznacz, jeśli pole jest obecne w formie atrybutu",
      "fieldName": "Nazwa",
      "fieldNameTip": "Nazwa pola zdefiniowanego w bazie danych",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Nazwa pola zdefiniowanego w mapie",
      "canPresetValue": "Ustawienie wstępne",
      "canPresetValueTip": "Opcja wyświetlania pola na liście wstępnie ustawionych pól; umożliwia ustawienie wartości przez użytkownika przed edycją",
      "actions": "Działania",
      "actionsTip": "Pozwala zmienić kolejność pól lub skonfigurować inteligentne atrybuty"
    },
    "smartAttSupport": "Inteligentne atrybuty nie są obsługiwane w przypadku wymaganych pól bazy danych"
  },
  "actionPage": {
    "title": "Skonfiguruj działania inteligentnych atrybutów dla pola <b>${fieldname}</b>",
    "description": "Działania są zawsze wyłączone, o ile nie zostaną podane kryteria ich wyzwolenia. Działania są przetwarzane w kolejności i tylko jedno działanie może zostać wyzwolone dla jednego pola. Użyj przycisku Edytuj kryteria, aby zdefiniować kryteria.",
    "actionsSettingsTable": {
      "rule": "Działanie",
      "ruleTip": "Działanie wykonywane, gdy kryteria zostaną spełnione",
      "expression": "Wyrażenie",
      "expressionTip": "Wynikowe wyrażenie w języku SQL utworzone na podstawie zdefiniowanych kryteriów",
      "actions": "Kryteria",
      "actionsTip": "Zmienia kolejność reguły i definiuje kryteria w momencie wyzwolenia"
    },
    "actions": {
      "hide": "Ukryj",
      "required": "Wymagane",
      "disabled": "Wyłączone"
    }
  },
  "filterPage": {
    "submitHidden": "Czy przesłać dane atrybutu dla tego pola nawet wtedy, gdy jest ukryte?",
    "title": "Skonfiguruj wyrażenie dla reguły ${action}",
    "filterBuilder": "Ustaw działanie dla pola, gdy rekord jest zgodny z ${any_or_all} z następujących wyrażeń",
    "noFilterTip": "Przy użyciu poniższych narzędzi zdefiniuj instrukcję dla momentu, gdy działanie jest aktywne."
  }
});