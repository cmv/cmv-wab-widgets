define([
  "dojo/_base/declare",
  "jimu/BaseWidgetSetting",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/_base/lang",
  "dojo/dom-class",
  "dojo/on",
  "dojo/text!./layerChooserPopup.html",
  "jimu/dijit/LayerChooserFromMap",
  "jimu/dijit/Popup"
], function (
  declare,
  BaseWidgetSetting,
  _WidgetsInTemplateMixin,
  lang,
  domClass,
  on,
  LayerChooseTemplate,
  LayerChooserFromMap,
  Popup
) {
  // to create a widget, derive it from BaseWidget.
  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-nearme-setting',
    templateString: LayerChooseTemplate,
    _layerChooserFromMap: null, //to store layer chooser widget instance
    popup: null, //to store popup instance for layer chooser
    searchLayers: [], //to store selected  search layers
    startup: function () {
      this.inherited(arguments);
    },
    postCreate: function () {
      //create popup for layer selector
      this._createLayerSelectorPopup();
      // initialize layer chooser
      this._initLayerSelector();
      //provide handler when cancel button is clicked
      on(this.cancelButton, "click", lang.hitch(this, function () {
        this.onCancelClick();
      }));
      on(this.okButton, "click", lang.hitch(this, function () {
        if (!domClass.contains(this.okButton, "jimu-state-disabled")) {
          this._getSelectedSearchLayers();
          this.onOkClick();
        }
      }));
    },

    /**
    * initialize layer chooser widget to display the search layers
    * @memberOf widgets/NearMe/setting/layerChooserPopup
    **/
    _initLayerSelector: function () {
      var args = {
        multiple: true,
        createMapResponse: this.map.webMapResponse,
        showLayerTypes: ['FeatureLayer'],
        filter: LayerChooserFromMap.createQueryableLayerFilter()
      };
      this._layerChooserFromMap = new LayerChooserFromMap(args);
      this._layerChooserFromMap.placeAt(this.layerSelectorNode);
      this._layerChooserFromMap.startup();
      this._layerChooserFromMap._onTreeClick = lang.hitch(this, function () {
        if (this._layerChooserFromMap.getSelectedItems().length) {
          //enable 'OK' button if any layer is selected
          domClass.remove(this.okButton, "jimu-state-disabled");
        } else {
          //disable 'OK' button if no layer is selected
          domClass.add(this.okButton, "jimu-state-disabled");
        }
      });
    },

    /**
    * create popup to display layer chooser
    * @memberOf widgets/NearMe/setting/layerChooserPopup
    **/
    _createLayerSelectorPopup: function () {
      this.popup = new Popup({
        titleLabel: this.nls.layerSelector.selectLayerLabel,
        width: 640,
        height: 200,
        content: this.layerSelectorContainer
      });
    },

    /**
    * This function get selected layer and create map server URL
    * @memberOf widgets/NearMe/setting/layerChooserPopup
    **/
    _getSelectedSearchLayers: function () {
      var i, selectedLayerItems, baseURL, layerItem;
      this.searchLayers = [];
      //get selected items from chooser
      selectedLayerItems = this._layerChooserFromMap.getSelectedItems();
      //Show error if no layers selected
      if (selectedLayerItems.length > 0) {
        for (i = 0; i < selectedLayerItems.length; i++) {
          layerItem = {
            "url": selectedLayerItems[i].layerInfo.layerObject.url,
            "geometryType": selectedLayerItems[i].layerInfo.layerObject.geometryType
          };
          if (selectedLayerItems[i].layerId) {
            layerItem.layerId = selectedLayerItems[i].layerId;
          } else {
            layerItem.layerId = layerItem.url.substr(layerItem.url.lastIndexOf(
                '/') + 1, layerItem.url
              .length);
          }
          //create map server URL
          baseURL = layerItem.url.substr(0, layerItem.url.lastIndexOf(
            '/') + 1);
          layerItem.baseURL = baseURL;
          this.searchLayers.push(layerItem);
        }
      }
    },
    onOkClick: function (evt) {
      return evt;
    },
    onCancelClick: function (evt) {
      return evt;
    }
  });
});