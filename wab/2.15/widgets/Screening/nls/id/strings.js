///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define({
  "_widgetLabel": "Penyaringan",
  "geometryServicesNotFound": "Service geometri tidak tersedia.",
  "unableToDrawBuffer": "Tidak dapat menggambar buffer. Harap coba lagi.",
  "invalidConfiguration": "Konfigurasi tidak valid.",
  "clearAOIButtonLabel": "Mulai Ulang",
  "noGraphicsShapefile": "Shapefile yang diunggah tidak berisi grafis.",
  "zoomToLocationTooltipText": "Zoom ke lokasi",
  "noGraphicsToZoomMessage": "Tidak ada grafik yang ditemukan untuk memperbesar.",
  "placenameWidget": {
    "placenameLabel": "Cari lokasi"
  },
  "drawToolWidget": {
    "useDrawToolForAOILabel": "Pilih mode gambar",
    "toggleSelectability": "Klik untuk beralih selektabilitas",
    "chooseLayerTitle": "Pilih layer yang dapat dipilih",
    "selectAllLayersText": "Pilih Semua",
    "layerSelectionWarningTooltip": "Setidaknya satu layer harus dipilih untuk membuat AOI",
    "selectToolLabel": "Pilih alat"
  },
  "shapefileWidget": {
    "shapefileLabel": "Unggah shapefile zip",
    "uploadShapefileButtonText": "Unggah",
    "unableToUploadShapefileMessage": "Tidak dapat mengunggah shapefile."
  },
  "coordinatesWidget": {
    "selectStartPointFromSearchText": "Tentukan titik awal",
    "addButtonTitle": "Tambah",
    "deleteButtonTitle": "Hapus",
    "mapTooltipForStartPoint": "Klik pada peta untuk menentukan titik awal",
    "mapTooltipForUpdateStartPoint": "Klik pada peta untuk memperbarui titik awal",
    "locateText": "Temukan",
    "locateByMapClickText": "Pilih koordinat awal",
    "enterBearingAndDistanceLabel": "Masukkan poros dan jarak dari titik awal",
    "bearingTitle": "Poros",
    "distanceTitle": "Jarak",
    "planSettingTooltip": "Pengaturan Rencana",
    "invalidLatLongMessage": "Harap masukkan nilai yang valid."
  },
  "bufferDistanceAndUnit": {
    "bufferInputTitle": "Jarak buffer (opsional)",
    "bufferInputLabel": "Tampilkan hasil dalam",
    "bufferDistanceLabel": "Jarak buffer",
    "bufferUnitLabel": "Unit buffer"
  },
  "traverseSettings": {
    "bearingLabel": "Poros",
    "lengthLabel": "Panjang",
    "addButtonTitle": "Tambah",
    "deleteButtonTitle": "Hapus",
    "deleteBearingAndLengthLabel": "Hapus poros dan baris panjang",
    "addButtonLabel": "Hapus poros dan panjang"
  },
  "planSettings": {
    "expandGridTooltipText": "Perluas grid",
    "collapseGridTooltipText": "Ciutkan grid",
    "directionUnitLabelText": "Unit Arah",
    "distanceUnitLabelText": "Unit Jarak dan Panjang",
    "planSettingsComingSoonText": "Segera Datang"
  },
  "newTraverse": {
    "invalidBearingMessage": "Poros Tidak Valid.",
    "invalidLengthMessage": "Panjang Tidak Valid.",
    "negativeLengthMessage": "Panjang Negatif"
  },
  "reportsTab": {
    "aoiAreaText": "Area AOI",
    "downloadButtonTooltip": "Unduh",
    "printButtonTooltip": "Cetak",
    "uploadShapefileForAnalysisText": "Unggah shapefile untuk disertakan dalam analisis",
    "uploadShapefileForButtonText": "Telusuri",
    "downloadLabelText": "Pilih Format :",
    "downloadBtnText": "Unduh",
    "noDetailsAvailableText": "Tidak ada hasil yang ditemukan",
    "featureCountText": "Jumlah",
    "featureAreaText": "Area",
    "featureLengthText": "Panjang",
    "attributeChooserTooltip": "Pilih atribut untuk ditampilkan",
    "csv": "CSV",
    "filegdb": "File Geodatabase",
    "shapefile": "Shapefile",
    "noFeaturesFound": "Tidak ada hasil yang ditemukan untuk format file yang dipilih",
    "selectReportFieldTitle": "Pilih kolom",
    "noFieldsSelected": "Tidak ada kolom yang dipilih",
    "intersectingFeatureExceedsMsgOnCompletion": "Penghitungan jumlah maksimum catatan telah tercapai untuk satu atau beberapa layer.",
    "unableToAnalyzeText": "Tidak dapat menganalisis, jumlah catatan maksimum telah tercapai.",
    "errorInPrintingReport": "Tidak dapat mencetak laporan. Harap periksa apakah pengaturan laporan valid.",
    "aoiInformationTitle": "Informasi Area Pilihan (AOI)",
    "summaryReportTitle": "Ringkasan",
    "notApplicableText": "T/A",
    "downloadReportConfirmTitle": "Konfirmasi pengunduhan",
    "downloadReportConfirmMessage": "Anda yakin ingin mengunduh?",
    "noDataText": "Tidak Ada Data",
    "createReplicaFailedMessage": "Operasi unduhan gagal untuk layer berikut: <br/> ${layerNames}",
    "extractDataTaskFailedMessage": "Operasi mengunduh gagal.",
    "printLayoutLabelText": "Tata Letak",
    "printBtnText": "Cetak",
    "printDialogHint": "Catatan: Judul laporan dan komentar dapat diedit dalam pratinjau laporan.",
    "unableToDownloadFileGDBText": "Geodatabase file tidak dapat diunduh untuk AOI yang berisi lokasi titik atau garis",
    "unableToDownloadShapefileText": "Shapefile tidak dapat diunduh untuk AOI yang berisi lokasi titik atau garis",
    "analysisAreaUnitLabelText": "Tampilkan hasil luas dalam :",
    "analysisLengthUnitLabelText": "Tampilkan hasil panjang dalam :",
    "analysisUnitButtonTooltip": "Pilih unit untuk analisis",
    "analysisCloseBtnText": "Tutup",
    "areaSquareFeetUnit": "Kaki Persegi",
    "areaAcresUnit": "Acre",
    "areaSquareMetersUnit": "Meter Persegi",
    "areaSquareKilometersUnit": "Kilometer Persegi",
    "areaHectaresUnit": "Hektare",
    "areaSquareMilesUnit": "Mil Persegi",
    "lengthFeetUnit": "Kaki",
    "lengthMilesUnit": "Mil",
    "lengthMetersUnit": "Meter",
    "lengthKilometersUnit": "Kilometer",
    "hectaresAbbr": "hektar",
    "squareMilesAbbr": "Mil Persegi",
    "layerNotVisibleText": "Tidak dapat menganalisis. Layer dimatikan atau di luar rentang visibilitas skala.",
    "refreshBtnTooltip": "Muat ulang laporan",
    "featureCSVAreaText": "Area Berpotongan",
    "featureCSVLengthText": "Panjang Berpotongan",
    "errorInFetchingPrintTask": "Kesalahan saat mengambil informasi tugas cetak. Silakan coba lagi.",
    "selectAllLabel": "Pilih Semua",
    "errorInLoadingProjectionModule": "Kesalahan saat memuat dependensi modul proyeksi. Harap coba mengunduh file kembali.",
    "expandCollapseIconLabel": "Fitur berpotongan",
    "intersectedFeatureLabel": "Detail fitur berpotongan",
    "valueAriaLabel": "Nilai",
    "countAriaLabel": "Jumlah"
  }
});