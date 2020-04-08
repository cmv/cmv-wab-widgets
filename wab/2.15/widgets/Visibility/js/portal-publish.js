///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

/*global define*/
define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/dijit/CheckBox',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/text!../templates/portal-publish.html',
  'dojo/dom-construct',
  'dojo/on',
  'dojo/dom-class',
  'jimu/utils',
  'esri/IdentityManager',
  'esri/arcgis/Portal',
  "dojo/Evented",
  './portal-utils',
  'jimu/LayerInfos/LayerInfos',
  'esri/layers/FeatureLayer',
  'esri/graphic',
  'esri/dijit/util/busyIndicator',
  'jimu/utils',
  'dojo/keys',
  'dijit/focus',
  'dojo/query',
  'dojo/topic',
  'dijit/form/ValidationTextBox',
  'jimu/dijit/formSelect'
], function (
  dojoDeclare,
  dijitWidgetBase,
  dijitWidgetsInTemplate,
  Checkbox,
  array,
  lang,
  pistemplate,
  domConstruct,
  on,
  domClass,
  utils,
  esriId,
  esriPortal,
  Evented,
  portalutils,
  jimuLayerInfos,
  FeatureLayer,
  Graphic,
  busyIndicator,
  jimuUtils,
  keys,
  focusUtils,
  query,
  topic

) {
return dojoDeclare([dijitWidgetBase, dijitWidgetsInTemplate, Evented], {
    templateString: pistemplate,
    baseClass: 'jimu-widget-visibility-publish',
    publishNewLayer: null,
    busyIndicator: null,
    fieldsObj: null,

    postCreate: function () {
      if (!String.prototype.format) {
        String.prototype.format = function () {
          var args = arguments;
          return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
          });
        };
      }
      //fields name with fields data type
      this.fieldsObj = {
        RegionType: {
          value: "",
          dataType: "esriFieldTypeInteger"
        },
        CenterPoint: {
          value: this.centerPoint,
          dataType: "esriFieldTypeString"
        },
        ObservationHeight: {
          value: this.observerHeight,
          dataType: "esriFieldTypeDouble"
        },
        HeightUnit: {
          value: this.observerHeightDD,
          dataType: "esriFieldTypeString"
        },
        MinObservationDistance: {
          value: this.minObsRange,
          dataType: "esriFieldTypeDouble"
        },
        MaxObservationDistance: {
          value: this.maxObsRange,
          dataType: "esriFieldTypeDouble"
        },
        DistanceUnit: {
          value: this.distanceUnitDD,
          dataType: "esriFieldTypeString"
        },
        FOVStartAngle: {
          value: this.fovStartAngle,
          dataType: "esriFieldTypeDouble"
        },
        FOVEndAngle: {
          value: this.fovEndAngle,
          dataType: "esriFieldTypeDouble"
        },
        AngleUnits: {
          value: this.angleUnits,
          dataType: "esriFieldTypeString"
        }
      };

      //fields name
      this.fields = {
        RegionType: "",
        CenterPoint: this.centerPoint,
        ObservationHeight: this.observerHeight,
        HeightUnit: this.observerHeightDD,
        MinObservationDistance: this.minObsRange,
        MaxObservationDistance: this.maxObsRange,
        DistanceUnit: this.distanceUnitDD,
        FOVStartAngle: this.fovStartAngle,
        FOVEndAngle: this.fovEndAngle,
        AngleUnits: this.angleUnits
      };

      // //Publish new layer check box
      this.publishNewLayer = new Checkbox({
        "checked": false,
        "label": this.nls.publishToNewLayer
      }, domConstruct.create("div", {}, this.checkBoxParentContainer));
      // Checkbox listener
      this.own(on(this.publishNewLayer, 'change', lang.hitch(this, this._onCheckboxClicked)));

      // populate the publish list
      this._populateSelectList(this.featureLayerList, this._layerList,
        true);

      if (!this.config.hasOwnProperty("operationalLayer") || this.config.hasOwnProperty("operationalLayer") &&
        this.config.operationalLayer.hasOwnProperty("name") && this.config.operationalLayer.name === '') {
        // Hide the checkbox and drop-down list
        domClass.add(this.featureLayerList.domNode, 'esriCTHidden');
        // Set the checkbox to true since user is publishing to a new layer
        this.publishNewLayer.setValue(true);
        // Show the textbox
        domClass.remove(this.addLayerNameArea.domNode, 'esriCTHidden');
      } else {
        domClass.remove(this.featureLayerList.domNode, 'esriCTHidden');
        // Set the checkbox to true since user is publishing to a new layer
        this.publishNewLayer.setValue(false);
        // Show the textbox
        domClass.add(this.addLayerNameArea.domNode, 'esriCTHidden');
      }

      this.own(on(this.resultsPanelBackButton, "click", lang.hitch(this, function () {
        this.emit("displayMainPageOnBack");
      })));

      this.own(on(this.resultsPanelBackButton, "keydown", lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          this.emit("displayMainPageOnBack");
        }
      })));

      //Handle click event of publish  to portal button
      this.own(on(this.publishButton, 'click', lang.hitch(this, function () {
        if (this.publishNewLayer.checked && !this.addLayerNameArea.isValid()) {
          // Invalid entry
          this.publishMessage.innerHTML = this.nls.missingLayerNameMessage;
          return;
        }
        var layerName = (this.publishNewLayer.checked) ? this.addLayerNameArea.value :
          this.featureLayerList.get("value");
        // Reset to emtpy message
        this.publishMessage.innerHTML = '';
        // Init save to portal
        this._initSaveToPortal(layerName);
      })));

      this.own(on(this.publishButton, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          if (this.publishNewLayer.checked && !this.addLayerNameArea.isValid()) {
            // Invalid entry
            this.publishMessage.innerHTML = this.nls.missingLayerNameMessage;
            this._setFirstLastFocusNodes();
            return;
          }
          var layerName = (this.publishNewLayer.checked) ? this.addLayerNameArea.value :
            this.featureLayerList.get("value");
          // Reset to emtpy message
          this.publishMessage.innerHTML = '';
          // Init save to portal
          this._initSaveToPortal(layerName);
        }
      })));
    },

    startup: function () {
      this.busyIndicator = busyIndicator.create({
        target: this.parentNode.parentNode.parentNode.parentNode,
        backgroundOpacity: 0
      });
    },

    /**
     * If checkbox is checked, clear textbox and allow user to
     * input a new layer name.
     */
    _onCheckboxClicked: function () {
      if (this.publishNewLayer.checked) {
        domClass.add(this.featureLayerList.domNode, 'esriCTHidden');
        domClass.remove(this.addLayerNameArea.domNode, 'esriCTHidden');
        this.addLayerNameArea.reset();
        this.addLayerNameArea.focus();
      } else {
        domClass.add(this.addLayerNameArea.domNode, 'esriCTHidden');
        domClass.remove(this.featureLayerList.domNode, 'esriCTHidden');
      }
      this._addLayerToMap = this.publishNewLayer.checked;
    },

    /**
     * Populates the drop down list of operational layers
     * from the webmap
     */
    _populateSelectList: function (selectNode, layerList, onlyPolygon) {
      // If true, only get the polygon feature layers
      var newList = [];
      if (onlyPolygon) {
        newList = array.filter(layerList, function (layer) {
          return layer.geometryType === "esriGeometryPolygon";
        }, this);
      }
      // re-init layerList
      layerList = (newList.length > 0) ? newList : layerList;

      array.forEach(layerList, lang.hitch(this, function (layer) {
        selectNode.addOption({
          value: layer.name,
          label: utils.sanitizeHTML(layer.name),
          selected: false,
          id: layer.id
        });
      }));

      if (this.config.hasOwnProperty("operationalLayer") && this.config.operationalLayer.hasOwnProperty("name") &&
        this.config.operationalLayer.name !== '') {
        selectNode.setValue(this.config.operationalLayer.name);
      } else {
        selectNode.setValue("");
      }
    },

    /**
     * Handle publish ERG to portal
     **/
    _initSaveToPortal: function (layerName) {
      esriId.registerOAuthInfos();
      var featureServiceName = layerName;
      esriId.getCredential(this.appConfig.portalUrl +
        "/sharing", {
          oAuthPopupConfirmation: false
        }).then(lang.hitch(this, function () {
        //sign in
        var portal = new esriPortal.Portal(this.appConfig.portalUrl);
        portal.signIn().then(lang.hitch(this, function (portalUser) {
          //Get the token
          var token = portalUser.credential.token;
          var orgId = portalUser.orgId;
          var userName = portalUser.username;
          //check the user is not just a publisher
          if (portalUser.role === "org_user") {
            this.publishMessage.innerHTML = this.nls.createService.format(this.nls.userRole);
            this._setFirstLastFocusNodes();
            return;
          }
          var checkServiceNameUrl = this.appConfig.portalUrl +
            "sharing/rest/portals/" + orgId + "/isServiceNameAvailable";
          var createServiceUrl = this.appConfig.portalUrl +
            "sharing/content/users/" + userName + "/createService";
          portalutils.isNameAvailable(checkServiceNameUrl, token,
            featureServiceName).then(lang.hitch(this, function (response0) {
            if (response0.available) {
              //set the widget to busy
              this.busyIndicator.show();
              //create the service
              portalutils.createFeatureService(createServiceUrl, token,
                portalutils.getFeatureServiceParams(featureServiceName,
                  this.map)).then(lang.hitch(this, function (response1) {
                if (response1.success) {
                  var addToDefinitionUrl = response1.serviceurl.replace(
                    new RegExp('rest', 'g'), "rest/admin") + "/addToDefinition";
                  portalutils.addDefinitionToService(addToDefinitionUrl, token,
                    portalutils.getLayerParams(featureServiceName, this.map,
                      this._renderer, this.nls)).then(lang.hitch(this,
                    function (response2) {
                      if (response2.success) {
                        //Push features to new layer
                        var newFeatureLayer =
                          new FeatureLayer(response1.serviceurl + "/0?token=" + token, {
                            id: featureServiceName,
                            outFields: ["*"]
                          });
                        newFeatureLayer._wabProperties = {
                          itemLayerInfo: {
                            portalUrl: this.appConfig.portalUrl,
                            itemId: response1.itemId
                          }
                        };
                        // Add layer to map
                        this.map.addLayer(newFeatureLayer);

                        // must ensure the layer is loaded before we can access
                        // it to turn on the labels if required
                        var featureLayerInfo;
                        if (newFeatureLayer.loaded) {
                          featureLayerInfo =
                            jimuLayerInfos.getInstanceSync().getLayerInfoById(featureServiceName);
                          featureLayerInfo.enablePopup();
                        } else {
                          newFeatureLayer.on("load", lang.hitch(this, function () {
                            featureLayerInfo =
                              jimuLayerInfos.getInstanceSync().getLayerInfoById(featureServiceName);
                            featureLayerInfo.enablePopup();
                          }));
                        }

                        var newGraphics = [];
                        array.forEach(this.graphics, function (g) {
                          if (g.attributes !== undefined && g.attributes.hasOwnProperty("type")) {
                            var layerFields = lang.clone(this.fields);
                            layerFields.RegionType = g.attributes.type;
                            newGraphics.push(new Graphic(g.geometry, null, layerFields));
                          }
                        }, this);
                        newFeatureLayer.applyEdits(newGraphics, null, null).then(
                          lang.hitch(this, function () {
                            this._reset();
                          })).otherwise(lang.hitch(this, function () {
                          this._reset();
                        }));
                        this.busyIndicator.hide();
                        var newURL = '<br /><a role="link" tabindex=0 aria-label="' +
                          this.nls.successfullyPublished + '" href="' +
                          this.appConfig.portalUrl + "home/item.html?id=" +
                          response1.itemId + '" target="_blank">';
                        this.publishMessage.innerHTML =
                          this.nls.successfullyPublished.format(newURL) + '</a>';
                        this._setFirstLastFocusNodes();
                      }
                    }), lang.hitch(this, function (err2) {
                    this.busyIndicator.hide();
                    this.publishMessage.innerHTML =
                      this.nls.addToDefinition.format(err2.message);
                    this._setFirstLastFocusNodes();
                  }));
                } else {
                  this.busyIndicator.hide();
                  this.publishMessage.innerHTML =
                    this.nls.unableToCreate.format(featureServiceName);
                  this._setFirstLastFocusNodes();
                }
              }), lang.hitch(this, function (err1) {
                this.busyIndicator.hide();
                this.publishMessage.innerHTML =
                  this.nls.createService.format(err1.message);
                this._setFirstLastFocusNodes();
              }));
            } else {
              // Existing layer. Get layer and populate.
              portal.queryItems({
                q: "name:" + layerName + " AND owner:" + userName
              }).then(lang.hitch(this, function (items) {
                if (items.results.length > 0) {
                  var selectedLayers = array.map(items.results, function (item) {
                    if (item.name === layerName) {
                      return item;
                    }
                  }, this);
                  //Push features to new layer
                  var newFeatureLayer =
                    new FeatureLayer(selectedLayers[0].url + "/0?token=" + token, {
                      id: layerName,
                      outFields: ["*"]
                    });
                  newFeatureLayer._wabProperties = {
                    itemLayerInfo: {
                      portalUrl: this.appConfig.portalUrl,
                      itemId: selectedLayers[0].id
                    }
                  };
                  newFeatureLayer.on("load", lang.hitch(this, function (layer) {
                    var newGraphics = [];
                    array.forEach(this.graphics, function (g) {
                      if (g.attributes !== undefined && g.attributes.hasOwnProperty("type")) {
                        var attributes = this._matchLayerFields(g.attributes.type, layer.layer._fields);
                        if (Object.keys(attributes).length > 0) {
                          newGraphics.push(new Graphic(g.geometry, null, attributes));
                        } else {
                          newGraphics.push(new Graphic(g.geometry, null, {}));
                        }
                      }
                    }, this);
                    newFeatureLayer.applyEdits(newGraphics, null, null).then(
                      lang.hitch(this, function () {
                        this._reset();
                      })).otherwise(lang.hitch(this, function () {
                      this._reset();
                    }));
                    //Refesh the feature layer
                    topic.publish("moveMap", false);
                    var newURL = '<br /><a href="' + this.appConfig.portalUrl +
                      "home/item.html?id=" + selectedLayers[0].id + '" target="_blank">';
                    this.publishMessage.innerHTML =
                      this.nls.successfullyPublished.format(newURL) + '</a>';
                    this._setFirstLastFocusNodes();
                  }));
                }
              }), lang.hitch(this, function () {
                this.publishMessage.innerHTML = this.nls.addToDefinition.format(layerName);
              }));
              this._setFirstLastFocusNodes();
            }
          }), lang.hitch(this, function (err0) {
            this.busyIndicator.hide();
            this.publishMessage.innerHTML = this.nls.checkService.format(err0.message);
            this._setFirstLastFocusNodes();
          }));
        }), lang.hitch(this, function (err) {
          this.publishMessage.innerHTML = err.message;
          this._setFirstLastFocusNodes();
        }));
      }));
      esriId.destroyCredentials();
    },


    _reset: function () {
      this.graphicsLayer.clear();
      this.graphics = [];
      //refresh graphic layer to make sure any labels are removed
      this.graphicsLayer.refresh();
    },

    /** this function is used to set first and last node
     * in result publish panel
     **/
    _setFirstLastFocusNodes: function () {
      jimuUtils.initFirstFocusNode(this.parentNode, this.resultsPanelBackButton);
      focusUtils.focus(this.resultsPanelBackButton);
      jimuUtils.initLastFocusNode(this.parentNode, this.publishButton);
      var linkText = query("a", this.publishMessage)[0];
      if (this.publishMessage.innerHTML !== "" && linkText) {
        jimuUtils.initLastFocusNode(this.parentNode, this.publishMessage);
        focusUtils.focus(linkText);
      } else if (this.publishMessage.innerHTML === "") {
        focusUtils.focus(this.resultsPanelBackButton);
      }
    },

    /** this function is used to match selected layer fields with
     * default fields
     **/
    _matchLayerFields: function (geometryType, newLayerFields) {
      var setAttributeObj = {};
      var fields = Object.keys(this.fieldsObj);
      array.forEach(newLayerFields, lang.hitch(this, function (field) {
        array.forEach(fields, lang.hitch(this, function (matchField) {
          if (field.name.toLowerCase() === matchField.toLowerCase()) {
            if (field.type === this.fieldsObj[matchField].dataType || field.type === "esriFieldTypeString") {
              var value = this.fieldsObj[matchField].value;
              var regionType = geometryType;
              if (field.type === "esriFieldTypeString" && field.length < 50 &&
                typeof (this.fieldsObj[matchField].value) === "string") {
                value = this.fieldsObj[matchField].value.substr(0, field.length);
              }
              if (matchField === "RegionType") {
                setAttributeObj[field.name] = regionType;
              } else {
                setAttributeObj[field.name] = value;
              }
            }
          }
        }));
      }));
      return setAttributeObj;
    }
  });
});