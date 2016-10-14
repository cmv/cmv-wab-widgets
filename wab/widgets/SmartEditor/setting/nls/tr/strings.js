define({
  "layersPage": {
    "title": "Detay oluşturmak için şablon seç",
    "generalSettings": "Genel Ayarlar",
    "layerSettings": "Katman Ayarları",
    "editDescription": "Düzenleme paneli için ekran metni girin",
    "editDescriptionTip": "Bu metin, Şablon seçicinin üzerinde görüntülenir, boş bırakmak için metin girmeyin.",
    "promptOnSave": "Form kapalıyken veya bir sonraki kayda geçildiğinde kaydedilmemiş düzenlemeleri kaydetmek için uyar.",
    "promptOnSaveTip": "Kullanıcı kapat öğesine tıkladığında veya geçerli detayda kaydedilmemiş düzeltmeler varken bir sonraki düzenlenebilir kayda geçtiğinde bir bildirim görüntülensin.",
    "promptOnDelete": "Kayıt silinirken onaylama zorunlu olsun.",
    "promptOnDeleteTip": "Kullanıcı eylemi onaylamak için sil öğesine tıkladığında bir bildirim görüntülensin.",
    "removeOnSave": "Kaydedilirken detay seçimden kaldırılsın.",
    "removeOnSaveTip": "Kayıt kaydedildiğinde detayın seçim kümesinden kaldırılması seçeneği. Bu, seçilen tek kayıt ise panel yeniden şablon sayfasına döndürülür.",
    "useFilterEditor": "Detay şablonu filtresini kullan",
    "useFilterEditorTip": "Bir katmanın şablonlarını görüntüleme veya şablonları ada göre arama özelliğini sağlayan Filtre Şablonu seçiciyi kullanma seçeneği.",
    "listenToGroupFilter": "Grup Filtresi aracından alınan filtre değerlerini Ön Ayarlı alanlara uygulama",
    "listenToGroupFilterTip": "Grup Filtresi aracında bir filtre uygulandığında, değeri Ön Ayarlı değer listesindeki eşleşen bir alana uygulayın.",
    "keepTemplateActive": "Seçilen şablonu etkin tutma",
    "keepTemplateActiveTip": "Şablon seçici gösterildiğinde, daha önceden seçilmiş bir şablon varsa, bunu yeniden seçin.",
    "layerSettingsTable": {
      "allowDelete": "Silmeye İzin Ver",
      "allowDeleteTip": "Kullanıcının bir detayı silmesine izin veren seçenektir; katman silmeyi desteklemiyorsa devre dışı bırakılır",
      "edit": "Düzenlenebilir",
      "editTip": "Katmanın araca eklenmesi seçeneğidir",
      "label": "Katman",
      "labelTip": "Haritada tanımlandığı biçimiyle katman adıdır",
      "update": "Geometri Düzenlemeyi Devre Dışı Bırak",
      "updateTip": "Yerleştirildikten sonra geometriyi taşıma veya geometriyi mevcut bir detaya taşıma özelliğini devre dışı bırakma seçeneğidir",
      "allowUpdateOnly": "Yalnızca Güncelle",
      "allowUpdateOnlyTip": "Yalnızca mevcut detayların değiştirilmesine izin verme seçeneğidir, varsayılan olarak işaretlidir ve katman yeni detay oluşturmayı desteklemiyorsa devre dışı bırakılır",
      "fields": "Alanlar",
      "fieldsTip": "Düzenlenecek alanları değiştirin ve Akıllı Öznitelikleri tanımlayın",
      "description": "Açıklama",
      "descriptionTip": "Öznitelik sayfasının en üstünde görüntülemek üzere metin girme seçeneği."
    },
    "editFieldError": "Alan değişiklikleri ve Akıllı öznitelikler düzenlenemeyen katmanlarda kullanılamaz",
    "noConfigedLayersError": "Akıllı Düzenleyici için bir veya birkaç düzenlenebilir katman gerekir"
  },
  "editDescriptionPage": {
    "title": "<b>${layername}</b> için öznitelik genel görünüm metnini tanımlayın "
  },
  "fieldsPage": {
    "title": "<b>${layername}</b> için alanları yapılandırın",
    "description": "Ön Ayar sütununu kullanarak yeni bir detay oluşturmadan önce kullanıcının bir değer girmesine izin verin. Eylemler düzenleme düğmesini kullanarak bir katmandaki Akıllı Öznitelikleri etkinleştirin. Akıllı Öznitelikler, diğer alanlardaki değerlere bağlı olarak bir alanı gerekli kılabilir, gizleyebilir veya devre dışı bırakabilir.",
    "fieldsNotes": "* gerekli bir alandır. Bu alan için Görüntüle seçeneğinin işaretini kaldırırsanız ve düzenleme şablonu söz konusu alanı doldurmazsa, yeni bir kaydı kaydedemezsiniz.",
    "fieldsSettingsTable": {
      "display": "Görünüm",
      "displayTip": "Alanın görünür olup olmadığını belirleyin",
      "edit": "Düzenlenebilir",
      "editTip": "Alan öznitelik formunda mevcutsa işaretleyin",
      "fieldName": "Adı",
      "fieldNameTip": "Veri tabanında tanımlanan alanın adı",
      "fieldAlias": "Takma Ad",
      "fieldAliasTip": "Haritada tanımlanan alanın adı",
      "canPresetValue": "Önayar",
      "canPresetValueTip": "Alanı ön ayarlı alan listesinde gösterme ve kullanıcıya düzenleme öncesinde değeri ayarlama izni verme seçeneği",
      "actions": "İşlemler",
      "actionsTip": "Alan sıralamasını değiştirin veya Akıllı Öznitelikleri ayarlayın"
    },
    "smartAttSupport": "Akıllı Öznitelikler gerekli veri tabanı alanlarında desteklenmiyor"
  },
  "actionPage": {
    "title": "<b>${fieldname}</b> için Akıllı Öznitelik eylemlerini yapılandırın",
    "description": "Tetiklenme ölçütleri belirtilene kadar eylemler her zaman için kapalıdır. Eylemler sırayla işlenir ve her alan için yalnızca bir eylem tetiklenir. Ölçütleri tanımlamak için Ölçüt Düzenle düğmesini kullanın.",
    "actionsSettingsTable": {
      "rule": "İşlem",
      "ruleTip": "Ölçüt karşılandığında gerçekleştirilecek eylem",
      "expression": "İfade",
      "expressionTip": "Tanımlı ölçütlerden gelen SQL biçimindeki sonuç ifadesi",
      "actions": "Kriterler",
      "actionsTip": "Kural sırasını değiştirin ve tetiklenme ölçütlerini tanımlayın"
    },
    "actions": {
      "hide": "Gizle",
      "required": "Gerekli",
      "disabled": "Pasifleştir"
    }
  },
  "filterPage": {
    "submitHidden": "Gizli olduğunda bile bu alan için öznitelik verileri gönderilsin mi?",
    "title": "${action} kuralı için ifade yapılandırma",
    "filterBuilder": "Kayıt aşağıdaki deyimlerin ${any_or_all} tanesiyle eşleştiğinde alan üzerinde eylemi gerçekleştir",
    "noFilterTip": "Aşağıdaki araçları kullanarak eylemin etkin olduğu deyimi tanımlayın."
  }
});