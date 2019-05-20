define({
  "layersPage": {
    "allLayers": "Semua Layer",
    "title": "Pilih template untuk membuat fitur",
    "generalSettings": "Pengaturan Umum",
    "layerSettings": "Pengaturan Layer",
    "smartActionsTabTitle": "Tindakan Cerdas",
    "attributeActionsTabTitle": "Tindakan Atribut",
    "presetValueText": "Tentukan Nilai Prasetel",
    "geocoderSettingsText": "Pengaturan Geocoder",
    "editDescription": "Sediakan teks tampilan untuk panel edit",
    "editDescriptionTip": "Tekos ini ditampilkan di atas pengambil Template, biarkon kosong untuk yang tanpa teks.",
    "promptOnSave": "Jendela prompt menyimpan edit yang belum disimpan ketika form ditutup atau diganti ke catatan berikutnya.",
    "promptOnSaveTip": "Tampilkan jendela prompt saat pengguna mengeklik Tutup atau bernavigasi ke record selanjutnya yang dapat diedit ketika fitur saat ini memiliki edit yang belum disimpan.",
    "promptOnDelete": "Membutuhkan konfirmasi saat menghapus suatu catatan.",
    "promptOnDeleteTip": "Tampilkan jendela prompt saat pengguna mengklik hapus untuk mengonfirmasi tindakan.",
    "removeOnSave": "Menghapus fitur dari pilihan saat menyimpan.",
    "removeOnSaveTip": "Opsi untuk menghapus fitur dari rangkaian pilihan saat catatan disimpan. Jika hanya ini catatan yang dipilih, panel akan kembali ke halaman template.",
    "useFilterEditor": "Gunakan filter template fitur",
    "useFilterEditorTip": "Opsi untuk menggunakan pengambil Template Filter yang menyediakan kemampuan untuk melihat satu template layer atau mencari template menurut nama.",
    "displayShapeSelector": "Tampilkan opsi menggambar",
    "createNewFeaturesFromExisting": "Izinkan pengguna untuk membuat fitur baru dari fitur yang ada",
    "createNewFeaturesFromExistingTip": "Opsi untuk mengizinkan pengguna menyalin fitur yang ada untuk membuat fitur-fitur baru",
    "copiedFeaturesOverrideDefaults": "Nilai fitur yang disalin menimpa default",
    "copiedFeaturesOverrideDefaultsTip": "Nilai dari fitur-fitur yang disalin akan menimpa nilai template default hanya untuk kolom yang cocok",
    "displayShapeSelectorTip": "Opsi untuk menampilkan daftar opsi menggambar yang valid untuk template terpilih.",
    "displayPresetTop": "Tampilkan daftar nilai prasetel di bagian atas",
    "displayPresetTopTip": "Opsi untuk menampilkan daftar nilai prasetel di atas pemilih template.",
    "listenToGroupFilter": "Terapkan nilai filter dari widget Filter Grup ke kolom Prasetel",
    "listenToGroupFilterTip": "Ketika suatu filter diterapkan di widget Filter Grup, terapkan nilai ke kolom yang cocok di daftar nilai Prasetel.",
    "keepTemplateActive": "Biarkan template yang dipilih tetap aktif",
    "keepTemplateActiveTip": "Ketika pemilih template ditampilkan, jika suatu template telah dipilih sebelumnya, pilih ulang template tersebut.",
    "geometryEditDefault": "Aktifkan edit geometri secara default",
    "autoSaveEdits": "Simpan fitur baru secara otomatis",
    "enableAttributeUpdates": "Tampilkan tombol pembaruan Tindakan Atribut ketika edit geometri aktif",
    "enableAutomaticAttributeUpdates": "Panggil secara otomatis Tindakan Atribut setelah pembaruan geometri",
    "enableLockingMapNavigation": "Aktifkan penguncian navigasi peta",
    "enableMovingSelectedFeatureToGPS": "Aktifkan pemindahan fitur titik yang dipilih ke lokasi GPS",
    "enableMovingSelectedFeatureToXY": "Aktifkan pemindahan fitur titik yang dipilih ke lokasi XY",
    "featureTemplateLegendLabel": "Template Fitur dan Pengaturan nilai Filter",
    "saveSettingsLegendLabel": "Simpan Pengaturan",
    "geometrySettingsLegendLabel": "Pengaturan Geometri",
    "buttonPositionsLabel": "Posisi tombol Simpan, Hapus, Kembali, dan Bersihkan Pilihan",
    "belowEditLabel": "Di bawah Edit Formulir",
    "aboveEditLabel": "Di atas Edit Formulir",
    "layerSettingsTable": {
      "allowDelete": "Izinkan Hapus",
      "allowDeleteTip": "Izinkan Penghapusan - Opsi untuk mengizinkan pengguna menghapus satu fitur; nonaktifkan jika layer tidak mendukung penghapusan",
      "edit": "Dapat Diedit",
      "editTip": "Dapat Diedit - Opsi untuk menyertakan layer dalam widget",
      "label": "Layer",
      "labelTip": "Layer - Nama layer sesuai yang ditentukan di peta",
      "update": "Nonaktifkan Pengeditan Geometri",
      "updateTip": "Nonaktifkan Pengeditan Geometri - Opsi untuk menonaktifkan kemampuan memindahkan geometri setelah ditempatkan atau memindahkan geometri pada fitur yang ada",
      "allowUpdateOnly": "Hanya Pembaruan",
      "allowUpdateOnlyTip": "Hanya Pembaruan - Opsi untuk mengizinkan hanya modifikasi fitur-fitur yang ada diperiksa secara default dan dinonaktifkan jika layer tidak mendukung pembuatan fitur-fitur baru",
      "fieldsTip": "Modifikasi kolom untuk diedit dan menentukan Atribut Cerdas",
      "actionsTip": "Tindakan - Opsi untuk mengedit kolom atau mengakses layer/tabel terkait",
      "description": "Deskripsi",
      "descriptionTip": "Deskripsi - Opsi untuk memasukkan teks yang akan ditampilkan di bagian atas halaman atribut.",
      "relationTip": "Lihat layer dan tabel terkait"
    },
    "editFieldError": "Modifikasi kolom dan atribut Cerdas tidak tersedia untuk layer yang tidak dapat diedit",
    "noConfigedLayersError": "Editor Cerdas memerlukan satu layer yang dapat diedit atau lebih",
    "toleranceErrorMsg": "Nilai Toleransi Perpotongan Default Tidak Valid"
  },
  "editDescriptionPage": {
    "title": "Tentukan overview atribut untuk <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurasikan kolom untuk <b>${layername}</b>",
    "copyActionTip": "Tindakan Atribut",
    "editActionTip": "Tindakan Cerdas",
    "description": "Gunakan tombol edit Tindakan untuk mengaktifkan Smart Attributes (Atribut Cerdas) pada layer. Smart Attributes (Atribut Cerdas) dapat memerlukan, menyembunyikan, atau menonaktifkan kolom berdasarkan nilai di kolom lain. Gunakan tombol salin Tindakan untuk mengaktifkan dan menentukan sumber nilai kolom menurut simpangan, alamat, koordinat, dan prasetel.",
    "fieldsNotes": "* adalah kolom yang wajib diisi. Jika Anda tidak mencentang Display (Perlihatkan) untuk kolom ini, dan template edit tidak mengisi nilai kolom, Anda tidak akan dapat menyimpan catatan baru.",
    "smartAttachmentText": "Konfigurasikan tindakan Lampiran cerdas",
    "smartAttachmentPopupTitle": "Konfigurasikan lampiran cerdas untuk <b>${layername}</b>",
    "fieldsSettingsTable": {
      "display": "Tampilkan",
      "displayTip": "Tampilan - Tentukan apakah kolom tidak terlihat",
      "edit": "Dapat Diedit",
      "editTip": "Dapat Diedit - Periksa apakah kolom ada pada formulir atribut",
      "fieldName": "Nama",
      "fieldNameTip": "Nama - Nama kolom yang ditetapkan di database",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Alias - Nama kolom yang ditetapkan di peta",
      "canPresetValue": "Pengaturan awal",
      "canPresetValueTip": "Prasetel - Opsi untuk menampilkan kolom dalam daftar kolom prasetel dan memungkinkan pengguna untuk menetapkan nilai sebelum pengeditan",
      "actions": "Tindakan",
      "actionsTip": "Tindakan - Ubah urutan kolom atau atur Atribut Cerdas"
    },
    "smartAttSupport": "Smart Attributes tidak didukung pada kolom database yang diwajibkan"
  },
  "actionPage": {
    "title": "Konfigurasikan Tindakan Atribut untuk <b>${fieldname}</b>",
    "smartActionTitle": "Konfigurasikan Tindakan Atribut Cerdas untuk <b>${fieldname}</b>",
    "description": "Tindakan selalu tidak aktif, kecuali Anda menentukan kriteria pemicunya. Tindakan diproses sesuai urutan dan hanya satu tindakan yang akan dipicu per kolom. Gunakan tombol Criteria Edit (Edit Kriteria) untuk menentukan kriteria.",
    "copyAttributesNote": "Menonaktifkan tindakan apa pun menggunakan nama grup akan sama dengan mengedit tindakan itu secara independen, dan ini akan menghapus tindakan untuk kolom ini dari grup masing-masing.",
    "actionsSettingsTable": {
      "rule": "Tindakan",
      "ruleTip": "Tindakan - Tindakan dilakukan jika kriteria terpenuhi",
      "expression": "Ekspresi",
      "expressionTip": "Ekspresi - Ekspresi yang dihasilkan dalam format SQL dari kriteria yang ditentukan",
      "groupName": "Nama Grup",
      "groupNameTip": "Nama Grup - Menampilkan nama grup dari tempat ekspresi diberlakukan",
      "actions": "Kriteria",
      "actionsTip": "Kriteria - Ubah urutan peraturan dan tentukan kriteria saat dipicu"
    },
    "copyAction": {
      "description": "Sumber nilai kolom diproses secara berurutan jika diaktifkan hingga kriteria valid terpicu atau daftar dilengkapi. Gunakan tombol Edit Kriteria untuk menentukan kriteria.",
      "intersection": "Perpotongan",
      "coordinates": "Koordinat",
      "address": "Alamat",
      "preset": "Pengaturan awal",
      "actionText": "Tindakan",
      "criteriaText": "Kriteria",
      "enableText": "Diaktifkan"
    },
    "actions": {
      "hide": "Sembunyikan",
      "required": "Diperlukan",
      "disabled": "Nonaktifkan"
    },
    "editOptionsPopup": {
      "editAttributeGroupHint": "Peringatan: Mengedit secara independen akan menghapus tindakan atribut pilihan terkait dengan kolom ini dari grup",
      "editGroupHint": "Peringatan: Mengedit secara independen akan menghapus tindakan cerdas pilihan terkait dengan kolom ini dari grup",
      "popupTitle": "Pilih opsi pengeditan",
      "editAttributeGroup": "Tindakan atribut pilihan ditentukan dari grup. Pilih satu dari opsi berikut untuk mengedit tindakan atribut:",
      "expression": "Ekspresi tindakan cerdas pilihan ditentukan dari grup. Pilih satu dari opsi berikut untuk mengedit ekspresi tindakan cerdas:",
      "editGroupButton": "Edit Grup",
      "editIndependentlyButton": "Edit Secara Independen"
    }
  },
  "filterPage": {
    "submitHidden": "Serahkan data atribut untuk kolom ini bahkan saat disembunyikan?",
    "title": "Konfigurasikan ekspresi untuk aturan ${action}",
    "filterBuilder": "Atur tindakan pada kolom saat catatan cocok dengan ${any_or_all} ekspresi berikut",
    "noFilterTip": "Dengan menggunakan alat di bawah, tentukan pernyataan untuk saat tindakan aktif."
  },
  "geocoderPage": {
    "setGeocoderURL": "Atur URL Geocoder",
    "hintMsg": "Catatan: Anda mengubah layanan geocoder, harap pastikan untuk memperbarui setiap pemetaan kolom geocoder yang telah Anda konfigurasikan.",
    "invalidUrlTip": "URL ${URL} tidak valid atau tidak dapat diakses."
  },
  "addressPage": {
    "popupTitle": "Alamat",
    "checkboxLabel": "Dapatkan nilai dari Geocoder",
    "selectFieldTitle": "Atribut",
    "geocoderHint": "Untuk mengubah geocoder cari tombol 'Pengaturan Geocoder' di pengaturan umum",
    "prevConfigruedFieldChangedMsg": "Atribut yang dikonfigurasikan sebelumnya tidak ditemukan dalam pengaturan geocoder saat ini. Atribut telah diatur ulang ke default."
  },
  "coordinatesPage": {
    "popupTitle": "Koordinat",
    "checkboxLabel": "Dapatkan koordinat",
    "coordinatesSelectTitle": "Sistem Koordinat",
    "coordinatesAttributeTitle": "Atribut",
    "mapSpatialReference": "Referensi Spasial Peta",
    "latlong": "Garis Lintang/Garis Bujur",
    "allGroupsCreatedMsg": "Semua grup yang memungkinkan telah dibuat"
  },
  "presetPage": {
    "popupTitle": "Pengaturan awal",
    "checkboxLabel": "Kolom akan berupa prasetel",
    "presetValueLabel": "Nilai prasetel saat ini:",
    "changePresetValueHint": "Untuk mengubah nilai prasetel cari tombol 'Define Preset Values' (Tentukan Nilai Prasetel) di pengaturan umum"
  },
  "intersectionPage": {
    "groupNameLabel": "Nama",
    "dataTypeLabel": "Jenis Data",
    "ignoreLayerRankingCheckboxLabel": "Abaikan peringkat layer dan temukan fitur terdekat lintas semua layer yang ditentukan",
    "intersectingLayersLabel": "Layer untuk mengekstrak nilai",
    "layerAndFieldsApplyLabel": "Layer dan kolom untuk menerapkan nilai yang diekstrak",
    "checkboxLabel": "Dapatkan nilai dari kolom layer simpangan",
    "layerText": "Layer",
    "fieldText": "Kolom",
    "actionsText": "Tindakan",
    "toleranceSettingText": "Pengaturan Toleransi",
    "addLayerLinkText": "Tambah Layer",
    "useDefaultToleranceText": "Gunakan Toleransi Default",
    "toleranceValueText": "Nilai Toleransi",
    "toleranceUnitText": "Unit Toleransi",
    "useLayerName": "- Gunakan Nama Layer -",
    "noLayersMessage": "Tidak ditemukan kolom di layer peta mana pun yang cocok dengan jenis data yang dipilih."
  },
  "presetAll": {
    "popupTitle": "Tentukan nilai prasetel default",
    "deleteTitle": "Hapus nilai prasetel",
    "hintMsg": "Semua nama kolom prasetel unik tercantum di sini. Menghapus kolom prasetel akan menonaktifkan kolom terkait sebagai prasetel dari semua layer/tabel."
  },
  "intersectionTolerance": {
    "intersectionTitle": "Toleransi Perpotongan Default"
  },
  "smartActionsPage": {
    "addNewSmartActionLinkText": "Tambah Baru",
    "definedActions": "Tindakan yang Ditentukan",
    "priorityPopupTitle": "Atur prioritas Tindakan Cerdas",
    "priorityPopupColumnTitle": "Tindakan Cerdas",
    "priorityOneText": "1",
    "priorityTwoText": "2",
    "priorityThreeText": "3",
    "groupNameLabel": "Nama Grup",
    "layerForExpressionLabel": "Layer untuk Ekspresi",
    "layerForExpressionNote": "Catatan: Kolom layer yang dipilih akan digunakan untuk menentukan kriteria",
    "expressionText": "Ekspresi",
    "editExpressionLabel": "Edit Ekspresi",
    "layerAndFieldsApplyLabel": "Layer dan kolom untuk diterapkan",
    "submitAttributeText": "Kirimkan data atribut untuk kolom tersembunyi pilihan?",
    "priorityColumnText": "Prioritas",
    "requiredGroupNameMsg": "Nilai ini diperlukan",
    "uniqueGroupNameMsg": "Masukkan nama grup unik, grup dengan nama ini sudah ada.",
    "deleteGroupPopupTitle": "Hapus Grup Tindakan Cerdas",
    "deleteGroupPopupMsg": "Menghapus grup ini akan menjadikan dihapusnya ekspresi dari semua Tindakan Kolom terkait.",
    "invalidExpression": "Ekspresi tidak boleh kosong",
    "warningMsgOnLayerChange": "Ekspresi dan kolom ditentukan yang mana diterapkan akan dihapus.",
    "smartActionsTable": {
      "name": "Nama",
      "expression": "Ekspresi",
      "definedFor": "Ditentukan untuk"
    }
  },
  "attributeActionsPage": {
    "name": "Nama",
    "type": "Jenis",
    "deleteGroupPopupTitle": "Hapus Grup Tindakan Atribut",
    "deleteGroupPopupMsg": "Menghapus grup ini akan menjadikan dihapusnya tindakan atribut dari semua Kolom terkait.",
    "alreadyAppliedActionMsg": "Tindakan ${action} sudah diberlakukan di kolom ini."
  },
  "chooseFromLayer": {
    "fieldLabel": "Kolom",
    "valueLabel": "Nilai",
    "selectValueLabel": "Pilih Nilai"
  },
  "presetPopup": {
    "presetValueLAbel": "Nilai Prasetel"
  },
  "dataType": {
    "esriFieldTypeString": "String",
    "esriFieldTypeInteger": "Nomor",
    "esriFieldTypeDate": "Tanggal",
    "esriFieldTypeGUID": "GUID"
  }
});