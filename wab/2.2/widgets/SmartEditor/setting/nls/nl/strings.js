define({
  "layersPage": {
    "title": "Selecteer template voor het maken van objecten",
    "generalSettings": "Algemene instellingen",
    "layerSettings": "Laaginstellingen",
    "editDescription": "Geef displaytekst op voor paneel bewerken",
    "editDescriptionTip": "Deze tekst wordt weergegeven boven de Template picker, laat dit veld leeg voor geen tekst.",
    "promptOnSave": "Vraag om onopgeslagen bewerkingen op te slaan als het formulier wordt gesloten of bij overschakelen naar het volgende record.",
    "promptOnSaveTip": "Toont een vraag als de gebruiker klikt, afsluit of naar het volgende bewerkbare record gaat als het huidige object bewerkingen bevat die nog niet zijn opgeslagen.",
    "promptOnDelete": "Bevestiging is nodig voor het verwijderen van een record.",
    "promptOnDeleteTip": "Toont een vraag als de gebruiker op verwijderen klikt om de actie te bevestigen.",
    "removeOnSave": "Verwijder object van selectie bij opslaan.",
    "removeOnSaveTip": "Optie om het object te verwijderen uit de selectie ingesteld als de record wordt opgeslagen. Als dit het enige geselecteerde record is, schakelt het paneel terug naar de template-pagina.",
    "useFilterEditor": "Gebruik objecttemplatefilter",
    "useFilterEditorTip": "Optie om de picker Filter Template te gebruiken die de mogelijkheid biedt om een lagentemplate te bekijken of op naam te zoeken naar templates.",
    "listenToGroupFilter": "Filterwaarden van de widget Groepfilter op Vooraf ingestelde velden toepassen",
    "listenToGroupFilterTip": "Als er een filter wordt toegepast in de widget Groepfilter, pas de waarde dan toe op een overeenkomstig veld in de lijst met Vooraf ingestelde waarden.",
    "keepTemplateActive": "Houd geselecteerde template actief",
    "keepTemplateActiveTip": "Als de templatekeuze weergegeven wordt, en als een template voordien geselecteerd werd, selecteer het dan nogmaals.",
    "layerSettingsTable": {
      "allowDelete": "Verwijderen toestaan",
      "allowDeleteTip": "Optie om de gebruiker een object te laten verwijderen; uitgeschakeld als de laag verwijderen niet ondersteunt",
      "edit": "Bewerkbaar",
      "editTip": "Optie om de laag op te nemen in de widget",
      "label": "Kaartlaag",
      "labelTip": "Naam van de laag zoals gedefinieerd in de kaart",
      "update": "Geometrie bewerken uitschakelen",
      "updateTip": "Optie voor het uitschakelen van de mogelijkheid om de geometrie te verplaatsen of de geometrie van een bestaand object te verplaatsen",
      "allowUpdateOnly": "Alleen bijwerken",
      "allowUpdateOnlyTip": "Optie om alleen het wijzigen van bestaande objecten mogelijk te maken, standaard aangevinkt en uitgeschakeld als de laag het maken van nieuwe objecten niet ondersteund",
      "fields": "Velden",
      "fieldsTip": "Wijzig de velden om te bewerken en definieer Slimme attributen",
      "description": "Beschrijving",
      "descriptionTip": "Optie om tekst in te voeren die u wilt weergeven aan de bovenkant van de attribuutpagina."
    },
    "editFieldError": "Veldwijzigingen en slimme attributen zijn niet beschikbaar voor lagen die niet bewerkbaar zijn",
    "noConfigedLayersError": "Smart Editor vereist een of meerdere bewerkbare lagen"
  },
  "editDescriptionPage": {
    "title": "Definieer de attribuutoverzichttekst voor <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Configureer velden voor <b>${layernaam}</b>",
    "description": "Gebruik de kolom Preset om de gebruiker een waarde in te laten voeren voor het creëren van een nieuw object. Gebruik de knop Acties bewerken om Slimme attributen te activeren op een laag. De Slimme attributen kunnen een veld vereisen, verbergen of uitschakelen gebaseerd op waarden in andere velden.",
    "fieldsNotes": "* is een verplicht veld. Als u het selectievakje Voor dit veld tonen weghaalt en template bewerken vult de veldwaarde niet in, dan kunt u geen nieuw record opslaan.",
    "fieldsSettingsTable": {
      "display": "Weergeven",
      "displayTip": "Bepaal of het veld niet zichtbaar is",
      "edit": "Bewerkbaar",
      "editTip": "Controleer of het veld aanwezig is in het attribuutformulier",
      "fieldName": "Naam",
      "fieldNameTip": "Naam van het veld gedefinieerd in de database",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Naam van het veld gedefinieerd in de kaart",
      "canPresetValue": "Voorinstelling",
      "canPresetValueTip": "Optie om het veld weer te geven in de vooringestelde veldlijst en laat de gebruiker de waarde instellen voor bewerken",
      "actions": "Acties",
      "actionsTip": "Wijzig de volgorde van de velden of stel Slimme attributen in"
    },
    "smartAttSupport": "Slimme attributen worden niet ondersteund op de vereiste databasevelden"
  },
  "actionPage": {
    "title": "Configureer de acties Slimme attributen voor <b>${fieldname}</b>",
    "description": "De acties staan altijd uit, tenzij u de criteria opgeeft waarmee ze worden geactiveerd. De acties worden verwerkt op volgorde en slechts één actie wordt geactiveerd per veld. Gebruik de knop Criteria bewerken om de criteria vast te stellen.",
    "actionsSettingsTable": {
      "rule": "Actie",
      "ruleTip": "Actie uitgevoerd als aan de criteria is voldaan",
      "expression": "Expressie",
      "expressionTip": "De resulterende expressie in SQL-indeling van de gedefinieerde criteria",
      "actions": "Criteria",
      "actionsTip": "Wijzig de volgorde van de regels en definieer de criteria als ze geactiveerd worden"
    },
    "actions": {
      "hide": "Verbergen",
      "required": "Vereist",
      "disabled": "Uitgeschakeld"
    }
  },
  "filterPage": {
    "submitHidden": "Attribuutgegevens indienen voor dit veld ook indien verborgen?",
    "title": "Configureer uitdrukking voor de ${action} regel",
    "filterBuilder": "Actie instellen op veld als de record overeenkomt met ${any_or_all} de volgende expressies",
    "noFilterTip": "Definieer met de onderstaande tools de verklaring voor als de actie actief is."
  }
});