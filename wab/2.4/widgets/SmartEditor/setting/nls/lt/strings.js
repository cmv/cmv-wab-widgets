define({
  "layersPage": {
    "title": "Pasirinkite šabloną elementui kurti",
    "generalSettings": "Bendrieji parametrai",
    "layerSettings": "Sluoksnio parametrai",
    "editDescription": "Nurodykite redagavimo skydelio rodomą tekstą",
    "editDescriptionTip": "Šis tekstas rodomas virš šablono parinkiklio. Jei nereikia jokio teksto, palikite lauką tuščią.",
    "promptOnSave": "Priminti įrašyti neįrašytus pakeitimus, kai forma uždaroma arba pereinama prie kito įrašo.",
    "promptOnSaveTip": "Rodyti priminimą, kai vartotojas spusteli Uždaryti arba nori pereiti prie kito redaguojamo įrašo, kai elementas turi neįrašytų pakeitimų.",
    "promptOnDelete": "Reikalauti patvirtinimo prieš ištrinant įrašą.",
    "promptOnDeleteTip": "Rodyti priminimą, prašant patvirtinti veiksmą, kai vartototjas spusteli Ištrinti.",
    "removeOnSave": "Pašalinti elementą iš žymėjimo, kai paspaudžiama Įrašyti.",
    "removeOnSaveTip": "Parinktis pašalinti elementą iš žymėjimo, kai įrašas išsaugojamas.  Jei tai yra vienintelis pažymėtas įrašas, skydelis perjungiamas į šablono puslapį.",
    "useFilterEditor": "Naudoti elementų šablonų filtrą",
    "useFilterEditorTip": "Parinktis naudoti filtrų šablonų parinkiklį, kuris leidžia peržiūrėti sluoksnių šablonus ir ieškoti šablonų pagal pavadinimą.",
    "listenToGroupFilter": "Filtro reikšmių taikymas iš grupių filtro valdiklio norint iš anksto nustatyti laukus",
    "listenToGroupFilterTip": "Kai grupių filtro valdiklyje pritaikomas filtras, taikykite reikšmę atitinkamam iš anksto nustatytų reikšmių sąrašo laukui.",
    "keepTemplateActive": "Palikite pasirinktą šabloną aktyvų",
    "keepTemplateActiveTip": "Jei šablonas buvo pasirinktas anksčiau, iš naujo jį pasirinkite, kai bus rodomas šablonų parinkiklis.",
    "layerSettingsTable": {
      "allowDelete": "Leisti ištrinti",
      "allowDeleteTip": "Parinktis, leidžianti vartotojui ištrinti elementą; išjungiama, jei sluoksnio ištrinti negalima",
      "edit": "Redaguojama",
      "editTip": "Parinktis, leidžianti įtraukti sluoksnį į valdiklį",
      "label": "Sluoksnis",
      "labelTip": "Sluoksnio pavadinimas, kaip nurodyta žemėlapyje",
      "update": "Išjungti geometrijos redagavimą",
      "updateTip": "Parinktis, leidžianti išjungti galimybę perkelti geometriją, kai įkeliama, arba perkelti geometriją į esamą elementą",
      "allowUpdateOnly": "Tik naujinti",
      "allowUpdateOnlyTip": "Parinktis, leidžianti tik modifikuoti esamus elementus. Ji įjungiama pagal numatytuosius nustatymus ir išjungiama, jei sluoksnis nepalaiko naujų elementų kūrimo",
      "fields": "Laukai",
      "fieldsTip": "Modifikuoti redaguotinus laukus ir apibrėžti išmaniuosius atributus",
      "description": "Aprašymas",
      "descriptionTip": "Teksto, kuris turėtų būti rodomas atributų puslapio viršuje, įvedimo parinktis."
    },
    "editFieldError": "Neredaguotinuose sluoksniuose laukų modifikavimas ir išmanieji atributai negalimi",
    "noConfigedLayersError": "Išmanusis redaktorius reikalauja vieno ar kelių redaguojamų sluoksnių"
  },
  "editDescriptionPage": {
    "title": "Nurodyti <b>${layername}</b> atributų apžvalgos tekstą "
  },
  "fieldsPage": {
    "title": "Konfigūruoti <b>${layername}</b> laukus",
    "description": "Naudoti stulpelį Nustatyta iš anksto, leidžiantį vartotojams įvesti reikšmę prieš sukuriant naują elementą. Norėdami suaktyvinti išmaniuosius atributus sluoksnyje, naudokite veiksmų redagavimo mygtuką. Naudojant išmaniuosius atributus gali prireikti paslėpti arba išjungti laukus, pagrįstus reikšmėmis iš kitų laukų.",
    "fieldsNotes": "* tai yra privalomas laukas.  Jei šiam laukui nepažymėjote Rodyti, o redagavimo šablone nepateikiama to lauko reikšmė, jūs negalėsite įrašyti naujo įrašo.",
    "fieldsSettingsTable": {
      "display": "Rodyti",
      "displayTip": "Nurodyti, ar laukas yra matomas",
      "edit": "Redaguojama",
      "editTip": "Patikrinti, ar laukas yra atributų formoje",
      "fieldName": "Pavadinimas",
      "fieldNameTip": "Lauko pavadinimas, nurodytas duomenų bazėje",
      "fieldAlias": "Pseudonimas",
      "fieldAliasTip": "Lauko pavadinimas, nurodytas žemėlapyje",
      "canPresetValue": "Nustatyta iš anksto",
      "canPresetValueTip": "Parinktis, leidžianti parodyti lauką iš anksto nustatytame laukų sąraše ir leidžianti vartotojui nustatyti reikšmę prieš redaguojant",
      "actions": "Veiksmai",
      "actionsTip": "Keisti laukų tvarką ar nustatyti išmaniuosius artibutus"
    },
    "smartAttSupport": "Išmanieji atributai nėra palaikomi būtinuose duomenų bazės laukuose"
  },
  "actionPage": {
    "title": "Konfigūruoti <b>${fieldname}</b> išmaniųjų atributų veiksmus",
    "description": "Veiksmai visada išjungiami, nebent nurodote kriterijus, kurie juos suaktyvintų.  Veiksmai apdorojami tam tikra tvarka ir vienam laukui suaktyvinamas tik vienas veiksmas.  Norėdami nustatyti kriterijus, naudokite mygtuką Kriterijų redagavimas.",
    "actionsSettingsTable": {
      "rule": "Veiksmas",
      "ruleTip": "Veiksmas, atliekamas, kai atitinkami kriterijai",
      "expression": "Išraiška",
      "expressionTip": "Gauta sąlyga SQL formatu pagal nustatytus kriterijus",
      "actions": "Kriterijai",
      "actionsTip": "Keisti taisyklių tvarką ir nustatyti kriterijus, kai ji suaktyvinama"
    },
    "actions": {
      "hide": "Slėpti",
      "required": "Privalomas",
      "disabled": "Neleidžiama"
    }
  },
  "filterPage": {
    "submitHidden": "Pateikti šio lauko atributų duomenis, net jei jie paslėpti?",
    "title": "Konfigūruoti ${action} taisyklės sąlygą",
    "filterBuilder": "Nustatyti veiksmą laukui, kai įrašas atitinka ${any_or_all} iš šių sąlygų",
    "noFilterTip": "Naudodami toliau pateiktus įrankius, nustatykite patvirtinimą tam atvejui, kai veiksmas nėra aktyvus."
  }
});