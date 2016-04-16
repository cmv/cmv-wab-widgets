define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dojo/dom-construct",
  "dojo/query",
  "dojo/_base/lang",
  "dijit/layout/ContentPane",
  "dojo/dom-attr",
  "dojo/dom-style",
  "dojo/dom-class",
  "dojo/on",
  "dojo/Deferred",
  "dojo/Evented",
  "dojo/promise/all",
  "jimu/dijit/Message",
  "jimu/dijit/TabContainer",
  "dojo/text!./item-list.html",
  "esri/Color",
  "esri/dijit/Directions",
  "esri/dijit/PopupTemplate",
  "esri/graphic",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",
  "esri/SpatialReference",
  "esri/geometry/geometryEngine",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/tasks/query",
  "esri/units",
  "dojo/_base/fx"
], function (
  declare,
  _WidgetBase,
  domConstruct,
  query,
  lang,
  ContentPane,
  domAttr,
  domStyle,
  domClass,
  on,
  Deferred,
  Evented,
  All,
  Message,
  TabContainer,
  itemListTemplate,
  Color,
  Directions,
  PopupTemplate,
  Graphic,
  Point,
  Polyline,
  Polygon,
  SpatialReference,
  GeometryEngine,
  FeatureLayer,
  GraphicsLayer,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleMarkerSymbol,
  Query,
  units,
  fx
) {
  // to create a widget, derive it from BaseWidget.
  return declare([_WidgetBase, Evented], {
    _itemListTemplate: itemListTemplate,
    _serviceArea: null, //object to store the search buffer area geometry
    _operationalLayers: null, //object to store configured search layers
    _selectedPoint: null, //object to store searched location
    _panels: {}, //object to store the panels
    _currentPanel: null, //object to store currently opened panel
    map: null, //to store map instance
    config: null, //to store widget configuration
    folderUrl: null, //to store widget path
    loading: null, //to store loading indicator instance
    nls: null, //to store nls strings
    parentDiv: null, //to store widget parent container
    outerContainer: null, //div to contain domNode of the widget
    _featureListContent: null, //div to store feature list panel
    _featureInfoPanel: null, //div to contain feature's popup content
    _directionInfoPanel: null, //div to contain direction widget
    _tabContainer: null, //tab container dijit
    _isNoFeature: null, //flag to identify if no feature found for all the layers
    _isSlide: true, //flag to check if animation is in progress
    _loadAttachmentTimer: null, //timer to load the attachments when info panel gets opened
    _failedLayers: [], //array to store the title of the layers, which is failed to fetch the features
    _routeCalculated: false, //flag to check whether direction data is calculated or not
    _selectedLayer: null, //to store selected layer
    _selectedItem: null, //to store selected layer div
    _selectedFeature: null, //to store selected feature
    _selectedFeatureItem: null, //to store selected feature div
    _featureGraphicsLayer: null, //to store graphic layer instance to highlight selected feature on map
    _directionsWidget: null, //to store direction widget instance
    postCreate: function () {
      this.domNode = domConstruct.create("div", {
        "class": "esriCTItemListMainContainer"
      }, this.outerContainer);
      //create panels to display data
      this._createPanels();
      //create feature layers
      this._loadFeatureLayers();
      //create graphics layer to add graphic to highlight selected feature
      this._featureGraphicsLayer = new GraphicsLayer();
      this.map.addLayer(this._featureGraphicsLayer);
    },

    /**
    * create panels to display results
    * @memberOf widgets/NearMe/item-list
    **/
    _createPanels: function () {
      var templateDiv;
      //create container for layer list
      this._panels.layerListPanel = domConstruct.create("div", {
        "class": "esriCTLayerList"
      }, this.domNode);
      //create container for feature list
      this._panels.featureListPanel = domConstruct.create("div", {
        "class": "esriCTFeatureList"
      }, this.domNode);
      templateDiv = domConstruct.toDom(this._itemListTemplate).childNodes[0];
      domClass.add(templateDiv, "esriCTPanelHeader");
      this._panels.featureListPanel.appendChild(templateDiv);
      this._featureListContent = domConstruct.create("div", {
        "class": "esriCTFeatureListContent"
      }, null);
      //set configured text color for feature list
      domStyle.set(this._featureListContent, "color", this.config.fontColor);
      this._panels.featureListPanel.appendChild(this._featureListContent);
      //attach click event on left to navigate to previous panel
      this._attachEventOnBackButton(this._panels.featureListPanel);
      this._panels.infoPanel = domConstruct.create("div", {
        "class": "esriCTDirectionInfoPanel"
      }, this.domNode);
      templateDiv = domConstruct.toDom(this._itemListTemplate).childNodes[0];
      domClass.add(templateDiv, "esriCTPanelHeader");
      this._panels.infoPanel.appendChild(templateDiv);
      this._attachEventOnBackButton(this._panels.infoPanel);
      //create container to display feature popup info
      this._featureInfoPanel = new ContentPane({
        "id": 'divFeatureInfoContent'
      }, null);
      this._featureInfoPanel.startup();
      //check if routing is enabled in webmap
      if (this.map.webMapResponse.itemInfo.itemData.applicationProperties &&
        this.map.webMapResponse.itemInfo.itemData.applicationProperties
        .viewing.routing.enabled) {
        //create tab container to display directions from searched location to selected feature
        this._directionInfoPanel = new ContentPane({
          "id": 'divDirectionInfoContent'
        }, null);
        this._directionInfoPanel.startup();
        //create tab container to display selected feature popup info and directions
        this._tabContainer = new TabContainer({
          tabs: [{
            title: this.nls.informationTabTitle,
            content: this._featureInfoPanel
          }, {
            title: this.nls.directionTabTitle,
            content: this._directionInfoPanel
          }]
        }, domConstruct.create("div", {
          "class": "esriCTTabContainer"
        }, this._panels.infoPanel));
        this._tabContainer.startup();
        on(this._tabContainer, "tabChanged", lang.hitch(this, function (selectedTab) {
          this.emit("tab-change", selectedTab);
          if (selectedTab === this.nls.directionTabTitle && !this._routeCalculated) {
            //get directions
            this._initializeDirectionWidget();
          }
          dijit.byId(this.parentDiv.id).resize();
        }));
      } else {
        //if routing is not enabled on webmap then, panel to display feature info will be created
        this._panels.infoPanel.appendChild(this._featureInfoPanel.domNode);
        domClass.add(this._featureInfoPanel.domNode, "esriCTFeatureInfo");
      }
      dijit.byId(this.parentDiv.id).resize();
    },

    /**
    * attach 'click' event on back button to navigate to previous panel
    * @param{object} panel
    * @memberOf widgets/NearMe/item-list
    **/
    _attachEventOnBackButton: function (panel) {
      var divBackButton;
      divBackButton = query(".esriCTBackButton", panel)[0];
      if (divBackButton) {
        on(divBackButton, "click", lang.hitch(this, function (event) {
          event.stopPropagation();
          if (this._isSlide) {
            this._isSlide = false;
            this._selectedItem = null;
            this._clearGrahics();
            //check if back button is clicked to navigate to feature list panel or layer list panel
            if (!this._isFeatureList) {
              this.loading.hide();
              this._clearContent(this._featureListContent);
              this._selectedLayer = null;
              this._isFeatureList = false;
              this._showPanel("layerListPanel", true);
            } else {
              this._isFeatureList = false;
              //clear directions if navigate to feature list
              this._clearDirections();
              this._showPanel("featureListPanel", true);
            }
          }
        }));
      }
    },

    /**
    * load configured layers as feature layers
    * @memberOf widgets/NearMe/item-list
    **/
    _loadFeatureLayers: function () {
      var featureLayer, i;
      this._operationalLayers = [];
      for (i = 0; i < this.config.searchLayers.length; i++) {
        //filter layers which has popup info
        if (this.config.searchLayers[i].popupInfo) {
          //initialize feature layer with the popup template configured in webmap
          featureLayer = new FeatureLayer(this.config.searchLayers[i].url, {
            infoTemplate: new PopupTemplate(this.config.searchLayers[i].popupInfo)
          });
          featureLayer.title = this.config.searchLayers[i].title;
          //set definition expression configured in webmap
          if (this.config.searchLayers[i].definitionExpression) {
            featureLayer.setDefinitionExpression(this.config.searchLayers[i].definitionExpression);
          }
          //set renderer configurd in webmap
          if (this.config.searchLayers[i].renderer) {
            featureLayer.setRenderer(this.config.searchLayers[i].renderer);
          }
          //set attachment visibility in layer as configured in webmap
          featureLayer.showAttachments = this.config.searchLayers[i].popupInfo.showAttachments;
          this._operationalLayers.push(featureLayer);
        }
      }
    },

    /**
    * Returns true if their are layers to be searched.
    * layers may be configured but not having popup enabled
    * will be not be considered for search
    * @memberOf widgets/NearMe/item-list
    **/
    hasValidLayers: function () {
      if (this._operationalLayers && this._operationalLayers.length > 0) {
        return true;
      }
      return false;
    },

    /**
    * clear content of the div
    * @param{object} div
    * @memberOf widgets/NearMe/item-list
    **/
    _clearContent: function (resultPanel) {
      if (resultPanel) {
        domConstruct.empty(resultPanel);
      }
    },

    /**
    * create layer list with the feature count for selected buffer area
    * @param{object} searchedLocation
    * @param{object} serviceArea
    * @memberOf widgets/NearMe/item-list
    **/
    displayLayerList: function (searchedLocation, serviceArea) {
      var i, featureDeferArr = [];
      this.loading.hide();
      this._isNoFeature = true;
      this._isSlide = true;
      this.clearResultPanel();
      this._setSeachedLocation(searchedLocation);
      this._setServiceArea(serviceArea);
      //clear failed layer list
      this._failedLayers = [];
      //check whether only one layer is available
      if (this._operationalLayers.length > 1) {
        this._currentPanel = this._panels.layerListPanel;
        domStyle.set(this._currentPanel, 'display', 'block');
        domStyle.set(this._currentPanel, 'left', '0px');
        //create layers list
        for (i = 0; i < this._operationalLayers.length; i++) {
          this._createItemTemplate(this._operationalLayers[i], featureDeferArr);
        }
      } else {
        this._onSingleLayerFound(featureDeferArr);
      }
      All(featureDeferArr).then(lang.hitch(this, function () {
        this._onFeatureCountComplete();
      }));
    },

    /**
    * display feature list panel if single layer is configured
    * @param{array} featureDeferArr
    * @memberOf widgets/NearMe/item-list
    **/
    _onSingleLayerFound: function (featureDeferArr) {
      var defer, divBackButton;
      defer = new Deferred();
      featureDeferArr.push(defer);
      divBackButton = query(".esriCTBackButton", this._panels.featureListPanel)[0];
      if (divBackButton) {
        domStyle.set(divBackButton, 'display', 'none');
      }
      this._currentPanel = this._panels.featureListPanel;
      domStyle.set(this._currentPanel, 'display', 'block');
      domStyle.set(this._currentPanel, 'left', '0px');
      this._displayFeatureList(this._operationalLayers[0], defer);
    },

    /**
    * create template for layer list
    * @param{object} operationalLayer
    * @param{array} featureDeferArr
    * @memberOf widgets/NearMe/item-list
    **/
    _createItemTemplate: function (operationalLayer, featureDeferArr) {
      var templateDiv;
      templateDiv = domConstruct.toDom(this._itemListTemplate).childNodes[0];
      domClass.add(templateDiv, "esriCTDisabled");
      //set configured text color for template
      domStyle.set(templateDiv, "color", this.config.fontColor);
      this._currentPanel.appendChild(templateDiv);
      //set layer title as a name field in template
      this._setItemName(templateDiv, operationalLayer.title);
      //query to display feature count
      this._queryForCountOnly(templateDiv, operationalLayer, featureDeferArr);
      //attach click event on left arrow
      this._attachClickEvent(templateDiv, operationalLayer, true);
    },

    /**
    * set itemName field in template
    * @param{object} template div
    * @param{string} value to be displayed
    * @memberOf widgets/NearMe/item-list
    **/
    _setItemName: function (templateDiv, value) {
      var divItemName = query(".esriCTItemName", templateDiv)[0];
      if (divItemName) {
        domAttr.set(divItemName, "innerHTML", value);
        domAttr.set(divItemName, "title", value);
      }
    },

    /**
    * attach click event on layer template div
    * @param{object} templateDiv
    * @param{string} item
    * @memberOf widgets/NearMe/item-list
    **/
    _attachClickEvent: function (templateDiv, item) {
      on(templateDiv, "click", lang.hitch(this, function (event) {
        if (!domClass.contains(templateDiv, "esriCTDisabled") && this._isSlide) {
          event.stopPropagation();
          this._isSlide = false;
          this._selectedItem = templateDiv;
          this._showPanel("featureListPanel");
          this._displayFeatureList(item, null);
        }
      }));
    },

    /**
    * display feature list
    * @param{object} item
    * @param{object} defer
    * @memberOf widgets/NearMe/item-list
    **/
    _displayFeatureList: function (item, defer) {
      this._clearContent(this._featureListContent);
      this._selectedLayer = item;
      this._setItemName(this._panels.featureListPanel, this._selectedLayer.title);
      this._queryForFeatureList(defer);
    },

    /**
    * create query parameters
    * @memberOf widgets/NearMe/item-list
    **/
    _getQueryParams: function () {
      var queryParams = new Query();
      queryParams.geometry = this._serviceArea || this.map.extent;
      queryParams.spatialRelationship = "esriSpatialRelIntersects";
      queryParams.outFields = ["*"];
      return queryParams;
    },

    /**
    * query layer to get number of features present in current buffer area
    * @param{object} template div
    * @param{object} opLayer
    * @param{array} featureDeferArr
    * @memberOf widgets/NearMe/item-list
    **/
    _queryForCountOnly: function (templateDiv, opLayer, featureDeferArr) {
      var defer, queryParams;
      queryParams = this._getQueryParams();
      defer = new Deferred();
      opLayer.queryCount(queryParams, lang.hitch(this, function (count) {
        this._setItemCount(templateDiv, count, true, false);
        defer.resolve();
      }), lang.hitch(this, function () {
        this._setItemCount(templateDiv, 0, true, true);
        this._failedLayers.push(opLayer.title);
        defer.resolve();
      }));
      featureDeferArr.push(defer);
    },

    /**
    * check if any of layer has feature in currently selected buffer area
    * @memberOf widgets/NearMe/item-list
    **/
    _onFeatureCountComplete: function () {
      //display message if no feature for current buffer area
      if (this._isNoFeature) {
        this.clearResultPanel();
        domStyle.set(this._panels.layerListPanel, 'display', 'block');
        domStyle.set(this._panels.layerListPanel, 'left', '0px');
        domConstruct.create("div", {
          "class": "esriCTNoFeatureFound",
          "innerHTML": this.nls.noFeatureFoundText
        }, this._panels.layerListPanel);
      }
      if (this._failedLayers.length) {
        var unableToFetchResultsMsg = this.nls.unableToFetchResults +
          "\n</t><ul><li>" + this._failedLayers.join("\n </li><li>") +
          "</li></ul>";
        this._showMessage(unableToFetchResultsMsg);
      }
      this.loading.hide();
      dijit.byId(this.parentDiv.id).resize();
    },

    /**
    * query feature layer to get features present in the current buffer area
    * @memberOf widgets/NearMe/item-list
    **/
    _queryForFeatureList: function (defer) {
      this.loading.show();
      var queryParams = this._getQueryParams();
      this._selectedLayer.queryFeatures(queryParams, lang.hitch(this, function (featureSet) {
        //check if any feature is found
        if (featureSet.features.length > 0) {
          this._isNoFeature = false;
          this._creatFeatureList(featureSet.features);
        }
        if (defer) {
          defer.resolve();
        }
      }), lang.hitch(this, function () {
        this.loading.hide();
        //add layer to the failed layer list if it fails to fetch the results
        this._failedLayers.push(this._selectedLayer.title);
        if (defer) {
          defer.resolve();
        }
      }));
    },

    /**
    * set count field layer/feature template div
    * @param{object} templateDiv
    * @param{int} value
    * @param{boolean} isFeatureCount
    * @param{boolean} isError
    * @memberOf widgets/NearMe/item-list
    **/
    _setItemCount: function (templateDiv, value, isFeatureCount, isError) {
      var divFeatureCount = query(".esriCTItemCount", templateDiv)[0];
      if (divFeatureCount) {
        domClass.remove(divFeatureCount, "esriCTLoadingIcon");
        //check if any error is occurred while fetching data from the layer
        if (isError) {
          //display "-" instead of feature count value
          domAttr.set(divFeatureCount, "innerHTML", "(-)");
        } else {
          //check whether feature count or distance from selected location has to be displayed in count field
          if (isFeatureCount) {
            //show feature count in selected buffer are
            domAttr.set(divFeatureCount, "innerHTML", "(" + value + ")");
            if (value) {
              this._isNoFeature = false;
              //do not enable node if respective layer has no feature
              domClass.remove(templateDiv, "esriCTDisabled");
            }
          } else {
            //show distance from selected location to the feature
            domAttr.set(divFeatureCount, "innerHTML", (value.toFixed(2) + " " +
           this.config.bufferDistanceUnit.acronym));
          }
        }
      }
    },

    /**
    * create feature list UI
    * @param{object} features
    * @memberOf widgets/NearMe/item-list
    **/
    _creatFeatureList: function (features) {
      var i, featureDiv;
      features = this._getSortedFeatureList(features);
      //create template for each feature
      for (i = 0; i < features.length; i++) {
        featureDiv = domConstruct.toDom(this._itemListTemplate).childNodes[0];
        domClass.add(featureDiv, "esriCTFeatureListItem");
        this._featureListContent.appendChild(featureDiv);
        this._setItemName(featureDiv, features[i].getTitle());
        this._setItemCount(featureDiv, features[i].distanceToLocation, false, false);
        this._attachEventOnFeatureDiv(featureDiv, features[i]);
      }
      dijit.byId(this.parentDiv.id).resize();
      this.loading.hide();
    },

    /**
    * sort feature list according to the distance from the selected location
    * @param{object} features
    * @memberOf widgets/NearMe/item-list
    **/
    _getSortedFeatureList: function (features) {
      var i;
      for (i = 0; i < features.length; i++) {
        features[i].distanceToLocation = GeometryEngine.distance(this._selectedPoint.geometry,
          features[i].geometry, this.config.bufferDistanceUnit.distanceUnit);
      }
      features.sort(function (featureA, featureB) {
        return featureA.distanceToLocation - featureB.distanceToLocation;
      });
      return features;
    },

    /**
    * attach 'click' event on right arrow to display next panel
    * @param{object} featureDiv
    * @param{object} selectedFeature
    * @memberOf widgets/NearMe/item-list
    **/
    _attachEventOnFeatureDiv: function (featureDiv, selectedFeature) {
      on(featureDiv, "click", lang.hitch(this, function () {
        //display layer title as header text
        this._setItemName(this._panels.infoPanel, this._selectedLayer.title);
        this._showPanel("infoPanel");
        //open information tab
        if (this._tabContainer) {
          this._tabContainer.selectTab(this.nls.informationTabTitle);
        }
        this._selectedFeatureItem = featureDiv;
        this._selectedFeature = selectedFeature;
        this._isFeatureList = true;
        this._clearDirections();
        this._highlightFeatureOnMap();
        //display popup info for selected feature
        this._displayFeatureInfo(selectedFeature);
        dijit.byId(this.parentDiv.id).resize();
      }));
    },

    /**
    * set popup info content in information container
    * @param{object} selectedFeature
    * @memberOf widgets/NearMe/item-list
    **/
    _displayFeatureInfo: function (selectedFeature) {
      if (this._loadAttachmentTimer) {
        clearTimeout(this._loadAttachmentTimer);
      }
      if (this._featureInfoPanel) {
        this._featureInfoPanel.set("content", selectedFeature.getContent());
        this._checkAttachments();
      }
    },

    /**
    * check whether attachments are available in layer and enabled in webmap
    * @memberOf widgets/NearMe/item-list
    **/
    _checkAttachments: function () {
      if (this._selectedLayer.hasAttachments && this._selectedLayer.showAttachments) {
        this.loading.show();
        var attachmentsDiv = query(".attachmentsSection", this._featureInfoPanel.domNode)[0];
        domConstruct.empty(attachmentsDiv);
        domClass.remove(attachmentsDiv, "hidden");
        this._loadAttachmentTimer = setTimeout(lang.hitch(this, function () {
          this._showAttachments(this._selectedFeature, attachmentsDiv, this._selectedLayer);
        }), 500);
      }
    },

    /**
    * query layer to get attachments
    * @param{object} graphic
    * @param{object} attachmentContainer
    * @param{object} layer
    * @memberOf widgets/NearMe/item-list
    **/
    _showAttachments: function (graphic, attachmentContainer, layer) {
      var objectID, fieldContent, imageDiv, imageContent, imagePath, i, imgLoaderDefer = [], defer;
      objectID = graphic.attributes[layer.objectIdField];
      domConstruct.empty(attachmentContainer);
      layer.queryAttachmentInfos(objectID, lang.hitch(this, function (infos) {
        //check if attachments found
        if (infos && infos.length > 0) {
          //Create attachment header text
          domConstruct.create("div", {
            "innerHTML": this.nls.attachmentHeader,
            "class": "esriCTAttachmentHeader"
          }, attachmentContainer);
          fieldContent = domConstruct.create("div", {
            "class": "esriCTThumbnailContainer"
          }, attachmentContainer);
          // display all attached images in thumbnails
          for (i = 0; i < infos.length; i++) {
            defer = new Deferred();
            //set default image path if attachment has no image URL
            imagePath = this.folderUrl + "images/no-attachment.png";
            if (infos[i].contentType.indexOf("image") > -1) {
              imagePath = infos[i].url;
            }
            imageContent = domConstruct.create("span", {
              "class": "esriCTAttachmentHolder col"
            }, fieldContent);
            domClass.add(imageContent, "esriCTImageLoader");
            imageDiv = domConstruct.create("img", {
              "alt": infos[i].url,
              "class": "esriCTAttachmentImg esriCTAutoHeight",
              "src": imagePath
            }, imageContent);
            this._attachEventOnImage(imageDiv, defer);
            imgLoaderDefer.push(defer);
          }
        }
        All(imgLoaderDefer).then(lang.hitch(this, this._onAllAttachmentLoad));
        dijit.byId(this.parentDiv.id).resize();
      }));
    },

    /**
    * attach event on attachment image
    * @param{object} imageDiv
    * @param{object} defer
    * @memberOf widgets/NearMe/item-list
    **/
    _attachEventOnImage: function (imageDiv, defer) {      // Hide loader Image after image loaded
      on(imageDiv, "load", lang.hitch(this, function (evt) {
        this._onImageLoad(evt);
        defer.resolve();
      }));
      // Show image in new tab on click of the image thumbnail
      on(imageDiv, "click", lang.hitch(this, this._displayImageAttachments));
      //hide loader if image fails to load
      on(imageDiv, "error", lang.hitch(this, function (evt) {
        this._onError(evt);
        defer.resolve();
      }));
    },

    /**
    * This function is used to show attachments in new window when user clicks on the attachment thumbnail
    * @param{object} defer
    * @memberOf widgets/NearMe/item-list
    **/
    _displayImageAttachments: function (evt) {
      window.open(evt.target.alt);
    },

    /**
    * This function is used to notify that image is loaded
    * Hide the image loader once the image is loaded, and set the image dimensions so that complete image will be shown in thumbnail.
    * @param{object} evt
    * @param{object} defer
    * @memberOf widgets/NearMe/item-list
    **/
    _onImageLoad: function (evt) {
      domClass.remove(evt.target.parentNode, "esriCTImageLoader");
      this._setImageDimensions(evt.target);
    },

    /**
    * This function is used to set the images dimensions so that the complete image will be shown in thumbnail
    * @param{object} imgModule
    * @memberOf widgets/NearMe/item-list
    **/
    _setImageDimensions: function (imgModule) {
      var aspectRatio, newWidth, newHeight, imgHeight, imgContainer = imgModule.parentElement;
      if (imgModule && imgModule.offsetHeight > 0) {
        //set original dimensions of image as it max dimensions.
        domAttr.set(imgModule, "originalHeight", imgModule.offsetHeight);
        domStyle.set(imgModule, "maxHeight", imgModule.offsetHeight + 'px');
        domStyle.set(imgModule, "maxWidth", imgModule.offsetWidth + 'px');

        imgHeight = parseFloat(domAttr.get(imgModule, "originalHeight"));
        if (imgContainer.offsetHeight < imgModule.offsetHeight || imgHeight >
          imgContainer.offsetHeight) {
          //change dimensions of image if it is larger/smaller than its parent container.
          //calculate aspect ratio of image.
          aspectRatio = imgModule.offsetWidth / imgModule.offsetHeight;
          //calculate new dimensions according to aspect ratio of image.
          newHeight = imgContainer.offsetHeight - 2;
          newWidth = Math.floor(newHeight * aspectRatio);
          domClass.remove(imgModule, "esriCTAutoHeight");
          //set new dimensions to image.
          domStyle.set(imgModule, "width", newWidth + 'px');
          domStyle.set(imgModule, "height", newHeight + 'px');
        }
      }
    },

    /**
    * hide image loader if image gets failed to load
    * @memberOf widgets/NearMe/item-list
    **/
    _onError: function (evt) {
      domClass.remove(evt.target.parentNode, "esriCTImageLoader");
    },

    /**
    * hide image loader when all attachment gets loaded
    * @memberOf widgets/NearMe/item-list
    **/
    _onAllAttachmentLoad: function () {
      this.loading.hide();
    },

    /**
    * set searched location
    * @memberOf widgets/NearMe/item-list
    **/
    _setSeachedLocation: function (location) {
      this._selectedPoint = location;
    },

    /**
    * set service area
    * @memberOf widgets/NearMe/item-list
    **/
    _setServiceArea: function (serviceArea) {
      this._serviceArea = serviceArea;
    },

    /**
    * clear results panels
    * @memberOf widgets/NearMe/item-list
    **/
    clearResultPanel: function () {
      this._isFeatureList = false;
      this._clearContent(this._panels.layerListPanel);
      domStyle.set(this._panels.featureListPanel, "display", "none");
      domStyle.set(this._panels.infoPanel, "display", "none");
      this._clearContent(this._featureListContent);
      this._clearDirections();
      this._clearGrahics();
    },

    /**
    * remove graphics layer from map
    * @memberOf widgets/NearMe/item-list
    **/
    removeGraphicsLayer: function () {
      if (this._featureGraphicsLayer) {
        this.map.removeLayer(this._featureGraphicsLayer);
        this._featureGraphicsLayer = null;
      }
    },

    /**
    * clear graphics from map
    * @memberOf widgets/NearMe/item-list
    **/
    _clearGrahics: function () {
      if (this._featureGraphicsLayer) {
        this._featureGraphicsLayer.clear();
      }
    },
    /**
    * Show selected panel
    * @param{string} name
    * @param{boolean} isLeft
    * @memberOf widgets/NearMe/item-list
    **/

    _showPanel: function (name, isLeft) {
      domStyle.set(this._panels[name], {
        display: 'block',
        left: '-100%'
      });
      if (isLeft) {
        this._slide(this._panels[name], -100, 0);
        this._slide(this._currentPanel, 0, 100);
      } else {
        this._slide(this._currentPanel, 0, -100);
        this._slide(this._panels[name], 100, 0);
      }
      this._currentPanelName = name;
      this._currentPanel = this._panels[name];
      dijit.byId(this.parentDiv.id).resize();
    },

    /**
    * animate panels
    * @param{object} dom
    * @param{int} startLeft
    * @param{int} endLeft
    * @memberOf widgets/NearMe/item-list
    **/
    _slide: function (dom, startLeft, endLeft) {
      domStyle.set(dom, 'display', 'block');
      domStyle.set(dom, 'left', startLeft + "%");
      fx.animateProperty({
        node: dom,
        properties: {
          left: {
            start: startLeft,
            end: endLeft,
            units: '%'
          }
        },
        duration: 300,
        onEnd: lang.hitch(this, function () {
          domStyle.set(dom, 'left', endLeft);
          if (endLeft === 0) {
            domStyle.set(dom, 'display', 'block');
          } else {
            domStyle.set(dom, 'display', 'none');
          }
          this._isSlide = true;
        })
      }).play();
    },

    /**
    * create and show alert message.
    * @param {string} msg
    * @memberOf widgets/NearMe/item-list
    **/
    _showMessage: function (msg) {
      var alertMessage = new Message({
        message: msg
      });
      alertMessage.message = msg;
    },

    /**
    * initialize direction dijit
    * @memberOf widgets/NearMe/item-list
    **/
    _initializeDirectionWidget: function () {
      var directionParams;
      //create direction widget instance if not created
      if (!this._directionsWidget) {
        if (dijit.byId("directionDijit")) {
          dijit.byId("directionDijit").destroy();
        }
        //configure direction parameters
        directionParams = {
          id: "directionDijit",
          map: this.map,
          directionsLengthUnits: units[this.config.directionLengthUnit.routeUnit],
          showTrafficOption: false,
          dragging: false,
          routeTaskUrl: this.config.routeService,
          routeSymbol: new SimpleLineSymbol(this.config.symbols.routeSymbol)
        };
        if (this.config.travelModeService && this.config.travelModeService !== "") {
          directionParams.travelModesServiceUrl = this.config.travelModeService;
        }
        this._directionsWidget = new Directions(directionParams, domConstruct.create(
          "div", {}, null));
        this._directionsWidget.startup();
        //on completing directions resize widget panel and zoom to the generated route
        on(this._directionsWidget, "directions-finish", lang.hitch(this, function () {
          this._directionsWidget.zoomToFullRoute();
          dijit.byId(this.parentDiv.id).resize();
          this.loading.hide();
        }));
        //place direction node into direction tab container
        this._directionInfoPanel.set('content', this._directionsWidget.domNode);
      }
      this._routeSelectedLocations();
    },

    /**
    * clear direction results from the map and direction container
    * @memberOf widgets/NearMe/item-list
    **/
    _clearDirections: function () {
      this._routeCalculated = false;
      if (this._directionsWidget) {
        this._directionsWidget.clearDirections();
      }
    },

    /**
    * generate route between searched location to selected feature
    * @memberOf widgets/NearMe/item-list
    **/
    _routeSelectedLocations: function () {
      var selectedLocations = [];
      //clear previous directions
      this._clearDirections();
      if (this._selectedPoint && this._selectedFeature) {
        //display loading indicator until direction gets calculated
        this.loading.show();
        selectedLocations.push(this._selectedPoint);
        selectedLocations.push(this._selectedFeature);
        // Calling update stops function for showing points on map and calculating direction.
        this._directionsWidget.updateStops(selectedLocations).then(lang.hitch(this, function () {
          this._directionsWidget.getDirections();
          //update _routeCalculated flag to 'true' if route gets calculated.
          this._routeCalculated = true;
        }), lang.hitch(this, function () {
          this.loading.hide();
          //display alert message if direction widget fails to generate route
          this._showMessage(this.nls.failedToGenerateRouteMsg);
        }));
      }
    },

    /**
    * highlight selected feature on map
    * @memberOf widgets/NearMe/item-list
    **/
    _highlightFeatureOnMap: function () {
      var graphics;
      this._clearGrahics();
      graphics = this._getHighLightSymbol(this._selectedFeature, this._selectedLayer);
      this._featureGraphicsLayer.add(graphics);
    },

    /**
    * Get symbol used for highlighting feature
    * @param{object} selected feature which needs to be highlighted
    * @param{object} details of selected layer
    */
    _getHighLightSymbol: function (graphic, layer) {
      // If feature geometry is of type point, add a cross-hair symbol
      // If feature geometry is of type polyline, highlight the line
      // If feature geometry is of type polygon, highlight the boundary of the polygon
      switch (graphic.geometry.type) {
        case "point":
          return this._getPointSymbol(graphic, layer);
        case "polyline":
          return this._getPolyLineSymbol(graphic, layer);
        case "polygon":
          return this._getPolygonSymbol(graphic);
      }
    },

    /**
    * This function is used to get symbol for point geometry
    * @param{object} selected feature which needs to be highlighted
    * @param{object} details of selected layer
    * @memberOf widgets/NearMe/item-list
    */
    _getPointSymbol: function (graphic, layer) {
      var symbol, isSymbolFound, graphics, point, graphicInfoValue,
          layerInfoValue, i;
      isSymbolFound = false;
      symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE,
          null, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([0, 255, 255, 1]), 3));
      symbol.setColor(null);
      symbol.size = 30; //set default Symbol size which will be used in case symbol not found.
      //check if layer is valid and have valid renderer object then only check for other symbol properties
      if (layer && layer.renderer) {
        if (layer.renderer.symbol) {
          isSymbolFound = true;
          symbol = this._updatePointSymbolProperties(symbol, layer.renderer
              .symbol);
        } else if (layer.renderer.infos && (layer.renderer.infos.length >
              0)) {
          for (i = 0; i < layer.renderer.infos.length; i++) {
            if (layer.typeIdField) {
              graphicInfoValue = graphic.attributes[layer.typeIdField];
            } else if (layer.renderer.attributeField) {
              graphicInfoValue = graphic.attributes[layer.renderer.attributeField];
            }
            layerInfoValue = layer.renderer.infos[i].value;
            // To get properties of symbol when infos contains other than class break renderer.
            if (graphicInfoValue !== undefined && graphicInfoValue !==
                null && graphicInfoValue !== "" && layerInfoValue !==
                undefined && layerInfoValue !== null && layerInfoValue !==
                "") {
              if (graphicInfoValue.toString() === layerInfoValue.toString()) {
                isSymbolFound = true;
                symbol = this._updatePointSymbolProperties(symbol,
                    layer.renderer.infos[i].symbol);
              }
            }
          }
          if (!isSymbolFound) {
            if (layer.renderer.defaultSymbol) {
              isSymbolFound = true;
              symbol = this._updatePointSymbolProperties(symbol,
                  layer.renderer.defaultSymbol);
            }
          }
        }
      }
      point = new Point(graphic.geometry.x, graphic.geometry.y, new SpatialReference({
        wkid: graphic.geometry.spatialReference.wkid
      }));
      graphics = new Graphic(point, symbol, graphic.attributes);
      return graphics;
    },

    /**
    * This function is used to get different data of symbol from infos properties of renderer object.
    * @param{object} symbol that needs to be assigned to selected/activated feature
    * @param{object} renderer layer Symbol
    * @memberOf widgets/NearMe/item-list
    */
    _updatePointSymbolProperties: function (symbol, layerSymbol) {
      var height, width, size;
      if (layerSymbol.hasOwnProperty("height") && layerSymbol.hasOwnProperty(
            "width")) {
        height = layerSymbol.height;
        width = layerSymbol.width;
        // To display cross hair properly around feature its size needs to be calculated
        size = (height > width) ? height : width;
        size = size + 10;
        symbol.size = size;
      }
      if (layerSymbol.hasOwnProperty("size")) {
        if (!size || size < layerSymbol.size) {
          symbol.size = layerSymbol.size + 10;
        }
      }
      if (layerSymbol.hasOwnProperty("xoffset")) {
        symbol.xoffset = layerSymbol.xoffset;
      }
      if (layerSymbol.hasOwnProperty("yoffset")) {
        symbol.yoffset = layerSymbol.yoffset;
      }
      return symbol;
    },

    /**
    * This function is used to get symbol for polyline geometry
    * @param{object} selected feature which needs to be highlighted
    * @param{object} details of selected layer
    * @memberOf widgets/NearMe/item-list
    */
    _getPolyLineSymbol: function (graphic, layer) {
      var symbol, graphics, polyline, symbolWidth, graphicInfoValue,
          layerInfoValue, i;
      symbolWidth = 5; // default line width
      //check if layer is valid and have valid renderer object then only check for other  symbol properties
      if (layer && layer.renderer) {
        if (layer.renderer.symbol && layer.renderer.symbol.hasOwnProperty(
              "width")) {
          symbolWidth = layer.renderer.symbol.width;
        } else if ((layer.renderer.infos) && (layer.renderer.infos.length > 0)) {
          for (i = 0; i < layer.renderer.infos.length; i++) {
            if (layer.typeIdField) {
              graphicInfoValue = graphic.attributes[layer.typeIdField];
            } else if (layer.renderer.attributeField) {
              graphicInfoValue = graphic.attributes[layer.renderer.attributeField];
            }
            layerInfoValue = layer.renderer.infos[i].value;
            // To get properties of symbol when infos contains other than class break renderer.
            if (graphicInfoValue !== undefined && graphicInfoValue !== null &&
                graphicInfoValue !== "" && layerInfoValue !== undefined &&
                layerInfoValue !== null && layerInfoValue !== "") {
              if (graphicInfoValue.toString() === layerInfoValue.toString() &&
                  layer.renderer.infos[i].symbol.hasOwnProperty("width")) {
                symbolWidth = layer.renderer.infos[i].symbol.width;
              }
            }
          }
        } else if (layer.renderer.defaultSymbol && layer.renderer.defaultSymbol
            .hasOwnProperty("width")) {
          symbolWidth = layer.renderer.defaultSymbol.width;
        }
      }
      symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([
          0, 255, 255, 1
        ]), symbolWidth);
      polyline = new Polyline(new SpatialReference({
        wkid: graphic.geometry.spatialReference.wkid
      }));
      if (graphic.geometry.paths && graphic.geometry.paths.length > 0) {
        polyline.addPath(graphic.geometry.paths[0]);
      }
      graphics = new Graphic(polyline, symbol, graphic.attributes);
      return graphics;
    },

    /**
    * This function is used to get symbol for polygon geometry
    * @param{object} selected feature which needs to be highlighted
    * @memberOf widgets/NearMe/item-list
    */
    _getPolygonSymbol: function (graphic) {
      var symbol, graphics, polygon;
      symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 255, 1]), 4),
          new Color([0, 0, 0, 0]));
      polygon = new Polygon(new SpatialReference({
        wkid: graphic.geometry.spatialReference.wkid
      }));
      if (graphic.geometry.rings) {
        polygon.rings = lang.clone(graphic.geometry.rings);
      }
      graphics = new Graphic(polygon, symbol, graphic.attributes);
      return graphics;
    }
  });
});