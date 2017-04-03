define({
  "layersPage": {
    "title": "Pilih template untuk membuat fitur",
    "generalSettings": "Pengaturan Umum",
    "layerSettings": "Pengaturan Layer",
    "editDescription": "Sediakan teks tampilan untuk panel edit",
    "editDescriptionTip": "Tekos ini ditampilkan di atas pengambil Template, biarkon kosong untuk yang tanpa teks.",
    "promptOnSave": "Jendela prompt menyimpan edit yang belum disimpan ketika form ditutup atau diganti ke catatan berikutnya.",
    "promptOnSaveTip": "Tampilkan jendela prompt saat pengguna mengeklik Tutup atau bernavigasi ke record selanjutnya yang dapat diedit ketika fitur saat ini memiliki edit yang belum disimpan.",
    "promptOnDelete": "Membutuhkan konfirmasi saat menghapus suatu catatan.",
    "promptOnDeleteTip": "Tampilkan jendela prompt saat pengguna mengeklik Hapus untuk mengonfirmasi tindakan.",
    "removeOnSave": "Menghapus fitur dari pilihan saat menyimpan.",
    "removeOnSaveTip": "Opsi untuk menghapus fitur dari rangkaian pilihan saat catatan disimpan. Jika hanya ini catatan yang dipilih, panel akan kembali ke halaman template.",
    "useFilterEditor": "Gunakan filter template fitur",
    "useFilterEditorTip": "Opsi untuk menggunakan pengambil Template Filter yang menyediakan kemampuan untuk melihat satu template layer atau mencari template menurut nama.",
    "listenToGroupFilter": "Terapkan nilai filter dari widget Filter Grup ke kolom Prasetel",
    "listenToGroupFilterTip": "Ketika suatu filter diterapkan di widget Filter Grup, terapkan nilai ke kolom yang cocok di daftar nilai Prasetel.",
    "keepTemplateActive": "Biarkan template yang dipilih tetap aktif",
    "keepTemplateActiveTip": "Ketika pemilih template ditampilkan, jika suatu template telah dipilih sebelumnya, pilih ulang template tersebut.",
    "layerSettingsTable": {
      "allowDelete": "Izinkan Hapus",
      "allowDeleteTip": "Opsi untuk mengizinkan pengguna menghapus suatu fitur; dinonaktifkan jika layer tidak mendukung penghapusan",
      "edit": "Dapat Diedit",
      "editTip": "Opsi untuk menyertakan layer di widget",
      "label": "Layer",
      "labelTip": "Nama layer seperti ditentukan pada peta",
      "update": "Nonaktifkan Pengeditan Geometri",
      "updateTip": "Opsi untuk menonaktifkan kemampuan untuk memindahkan geometri setelah ditempatkan atau memindahkan geometri pada fitur yang sudah ada",
      "allowUpdateOnly": "Hanya Pembaruan",
      "allowUpdateOnlyTip": "Opsi untuk mengizinkan hanya modifikasi fitur yang sudah ada, dicentang sebagai default dan dinonaktifkan jika layer tidak mendukung pembentukan fitur baru",
      "fields": "Kolom",
      "fieldsTip": "Modifikasi kolom untuk diedit dan menentukan Atribut Cerdas",
      "description": "Deskripsi",
      "descriptionTip": "Opsi untuk memasukkan teks yang akan ditampilkan di bagian atas halaman atribut."
    },
    "editFieldError": "Modifikasi kolom dan atribut Cerdas tidak tersedia untuk layer yang tidak dapat diedit",
    "noConfigedLayersError": "Editor Cerdas memerlukan satu layer yang dapat diedit atau lebih"
  },
  "editDescriptionPage": {
    "title": "Tentukan overview atribut untuk <b>${layername}</b> "
  },
  "fieldsPage": {
    "title": "Konfigurasikan kolom untuk <b>${layername}</b>",
    "description": "Gunakan kolom Preset untuk memungkinkan pengguna memasukkan nilai sebelum membuat fitur baru. Gunakan tombol edit Actions (Tindakan) untuk mengaktifkan Smart Attributes (Atribut Cerdas) pada layer. Smart Attributes (Atribut Cerdas) dapat meminta, menyembunyikan, atau menonaktifkan kolom berdasarkan nilai di kolom lain.",
    "fieldsNotes": "* adalah kolom yang wajib diisi. Jika Anda tidak mencentang Display (Perlihatkan) untuk kolom ini, dan template edit tidak mengisi nilai kolom, Anda tidak akan dapat menyimpan catatan baru.",
    "fieldsSettingsTable": {
      "display": "Tampilkan",
      "displayTip": "Tentukan apakah kolom tidak terlihat",
      "edit": "Dapat Diedit",
      "editTip": "Periksa apakah ada kolom pada formulir atribut",
      "fieldName": "Nama",
      "fieldNameTip": "Nama kolom yang ditetapkan di database",
      "fieldAlias": "Alias",
      "fieldAliasTip": "Nama kolom yang ditetapkan di peta",
      "canPresetValue": "Pengaturan awal",
      "canPresetValueTip": "Opsi untuk memperlihatkan kolom dalam daftar kolom Pengaturan awal dan memungkinkan pengguna untuk mengatur nilai sebelum pengeditan",
      "actions": "Tindakan",
      "actionsTip": "Ubah urutan kolom atau atur Smart Attributes (Atribut Cerdas)"
    },
    "smartAttSupport": "Smart Attributes tidak didukung pada kolom database yang diwajibkan"
  },
  "actionPage": {
    "title": "Konfigurasikan tindakan Smart Attributes (Atribut Cerdas) untuk <b>${fieldname}</b>",
    "description": "Tindakan selalu tidak aktif, kecuali Anda menentukan kriteria pemicunya. Tindakan diproses sesuai urutan dan hanya satu tindakan yang akan dipicu per kolom. Gunakan tombol Criteria Edit (Edit Kriteria) untuk menentukan kriteria.",
    "actionsSettingsTable": {
      "rule": "Tindakan",
      "ruleTip": "Tindakan diambil saat kriteria terpenuhi",
      "expression": "Ekspresi",
      "expressionTip": "Hasil ekspresi dalam format SQL dari kriteria yang ditentukan",
      "actions": "Kriteria",
      "actionsTip": "Ubah urutan aturan dan tentukan kriteria saat dipicu"
    },
    "actions": {
      "hide": "Sembunyikan",
      "required": "Diperlukan",
      "disabled": "Nonaktifkan"
    }
  },
  "filterPage": {
    "submitHidden": "Serahkan data atribut untuk kolom ini bahkan saat disembunyikan?",
    "title": "Konfigurasikan ekspresi untuk aturan ${action}",
    "filterBuilder": "Atur tindakan pada kolom saat catatan cocok dengan ${any_or_all} ekspresi berikut",
    "noFilterTip": "Dengan menggunakan alat di bawah, tentukan pernyataan untuk saat tindakan aktif."
  }
});