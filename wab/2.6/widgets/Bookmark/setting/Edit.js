define(
  ["dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/html',
    "dojo/on",
    "dijit/_WidgetsInTemplateMixin",
    "jimu/BaseWidgetSetting",
    'esri/geometry/Extent',
    'jimu/dijit/ImageChooser',
    './ExtentAndLayersChooser',
    "./LayersChooser",
    'jimu/utils',
    "../utils",
    "dojo/text!./Edit.html",
    'jimu/dijit/CheckBox'
  ],
  function(
    declare,
    lang,
    html,
    on,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    Extent,
    ImageChooser,
    ExtentChooser,
    LayersChooser,
    jimuUtils,
    utils,
    template,
    CheckBox
    ){
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: "jimu-Bookmark-Edit",
      ImageChooser: null,
      templateString: template,
      extent:  {},
      portalUrl: null,
      itemId: null,
      isInWebmap: false,
      mapOptions: null,
      layerOptions: null,//layers visible

      postCreate: function(){
        this.inherited(arguments);
        this.imageChooser = new ImageChooser({
          cropImage: true,
          defaultSelfSrc: this.folderUrl + "images/thumbnail_default.png",
          showSelfImg: true,
          format: [ImageChooser.GIF, ImageChooser.JPEG, ImageChooser.PNG],
          goldenWidth: 100,
          goldenHeight: 60
        });

        this._initOptins();

        this.own(on(this.displayName, 'change', lang.hitch(this, '_onNameChange')));
        this.own(on(this.displayName, "keyUp", lang.hitch(this, '_onNameChange')));
        html.addClass(this.imageChooser.domNode, 'img-chooser');
        html.place(this.imageChooser.domNode, this.imageChooserBase, 'replace');
      },

      startup: function(){
        if(this.displayName &&
          this.displayName.focusNode && this.displayName.focusNode.focus){
          this.displayName.focusNode.focus();//auto focus
        }

        this.inherited(arguments);
      },

      _initOptins: function () {
        this.saveExtent = new CheckBox({
          label: this.nls.saveExtent,
          checked: true
        }, this.saveExtent);
        this.saveLayers = new CheckBox({
          label: this.nls.savelayers,
          checked: false
        }, this.saveLayers);

        this.own(on(this.saveLayers, 'change', lang.hitch(this, '_changeSetBtnStyle')));
        //set btn
        this.layersChooser = new LayersChooser({
          nls: this.nls,
          layers: this._getLayers(),
          enable: this.saveLayers.getValue()
        });
        this.layersChooser.placeAt(this.setBtn);
        this.layersChooser.startup();
        this.own(on(this.layersChooser, 'change', lang.hitch(this, '_setLayers')));
      },

      _changeSetBtnStyle: function () {
        var isSaveLayerSelected = this.saveLayers.getValue();
        if (isSaveLayerSelected) {
          this.layersChooser.enableMeun();
        } else {
          this.layersChooser.disableMeun();
        }
      },
      //restore LayersChooser layers
      setLayersChooserLayers: function(layerOptions){
        this.layerOptions = layerOptions;
        this.layersChooser.setLayers(this.layerOptions);
      },

      _setLayers: function (layerOptions) {
        this.layerOptions = layerOptions;
        //TODO ==> this.extentChooser.SET_LAYERS
        utils.layerInfosRestoreState(layerOptions);
      },
      _getLayers: function () {
        //TODO ==> this.extentChooser.GET_LAYERS
        return utils.getlayerInfos();
      },

      setConfig: function(bookmark){
        var args = {
          portalUrl : this.portalUrl,
          itemId: this.itemId
        };

        if (bookmark.displayName){
          this.displayName.set('value', bookmark.displayName);
        }

        if (bookmark.thumbnail){
          var thumbnailValue = jimuUtils.processUrlInWidgetConfig(bookmark.thumbnail, this.folderUrl);
          this.imageChooser.setDefaultSelfSrc(thumbnailValue);
        }
        if (bookmark.extent){
          args.initExtent = new Extent(bookmark.extent);
        }
        if(this.mapOptions && this.mapOptions.lods){
          args.lods = this.mapOptions.lods;
        }
        if(bookmark.isInWebmap){
          this.isInWebmap = true;
        }

        this.extentChooser = new ExtentChooser(args, this.extentChooserNode);
        this.own(on(this.extentChooser, 'extentChange', lang.hitch(this, this._onExtentChange)));

        //add from 5.3
        if ("undefined" === typeof bookmark.isSaveExtent) {
          bookmark.isSaveExtent = true;
        }
        utils.setCheckboxWithoutEvent(this.saveExtent, bookmark.isSaveExtent);

        if ("undefined" === typeof bookmark.isSaveLayers) {
          bookmark.isSaveLayers = false;
        }
        utils.setCheckboxWithoutEvent(this.saveLayers, bookmark.isSaveLayers);
        this._changeSetBtnStyle();

        if (bookmark.layerOptions) {
          this.setLayersChooserLayers(bookmark.layerOptions);
        }
      },

      getConfig: function(){
        var bookmark = {
          displayName: this.displayName.get("value"),
          name: this.displayName.get("value"),
          extent: this.extentChooser.getExtent(),
          thumbnail: this.imageChooser.imageData,
          isInWebmap: this.isInWebmap,
          //add from 5.3
          isSaveExtent: this.saveExtent.getValue(),
          isSaveLayers: this.saveLayers.getValue(),
          layerOptions: this.layerOptions
        };
        return bookmark;
      },

      _onNameChange: function(){
        this._checkRequiredField();
      },

      _onExtentChange: function(extent){
        this.currentExtent = extent;
      },

      _checkRequiredField: function(){
        if (!this.displayName.get('value')){
          if (this.popup){
            this.popup.disableButton(0);
          }
        }else{
          if (this.popup){
            this.popup.enableButton(0);
          }
        }
      }
    });
  });