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

define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dojo/Evented',
  "dijit/_TemplatedMixin",
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/dom-construct',
  'jimu/dijit/CheckBox',
  'dojo/dom-class',
  'dojo/on',
  'dojo/text!./update-project-cost.html',
  "dojo/promise/all",
  "esri/tasks/QueryTask",
  "esri/tasks/query",
  'jimu/dijit/Message',
  'esri/graphic',
  'dojo/dom-attr',
  'dojo/keys',
  "dojo/_base/event"
], function (
  declare,
  _WidgetBase,
  Evented,
  _TemplatedMixin,
  lang,
  array,
  domConstruct,
  CheckBox,
  domClass,
  on,
  template,
  all,
  QueryTask,
  Query,
  Message,
  Graphic,
  domAttr,
  keys,
  Event
) {
  return declare([_WidgetBase, Evented, _TemplatedMixin], {

    templateString: template,

    // globals
    _updateCostProjectSelectAllCheckBox: null,
    _filteredProjectNameOptions: null,

    constructor: function (options) {
      if (options) {
        lang.mixin(this, options);
      }
    },

    postCreate: function () {
      this.inherited(arguments);
      this.own(on(this.updateCostEquationButton, "keydown", lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this._updateCostEquation();
        }
      })));
    },

    startup: function () {
      this.inherited(arguments);
      this.loadingIndicator.show();
      this._initializeData();
      this._filteredProjectNameOptions = array.filter(this.projectNameOptions, lang.hitch(this, function (item) {
        return item.label !== this.nls.createLoadProject.selectProject;
      }));
      if (this._filteredProjectNameOptions.length > 0) {
        this._displayProjectCostEquationList();
      } else {
        this._displayNoFeatureFoundScreen();
      }
      this.loadingIndicator.hide();
    },

    /**
     * This function is used to display no feature found message when no projects are available
     */
    _displayNoFeatureFoundScreen: function () {
      domClass.remove(this.noFeatureFoundScreen, 'esriCTHidden');
    },

    /**
     * This function is used to re-initialize global data
     */
    _initializeData: function () {
      this._updateCostProjectSelectAllCheckBox = null;
      this._filteredProjectNameOptions = null;
    },
    /**
     * This function is used to display the list of project to which user can select the projects
     * and update the cost equations.
     */
    _displayProjectCostEquationList: function () {
      domClass.remove(this.projectListChildContainer, 'esriCTHidden');
      domClass.remove(this.updateButtonParentContainer, 'esriCTHidden');
      this._updateCostProjectRow(this.nls.updateCostEquationPanel.updateProjectCostSelectProjectTitle, true);
      array.forEach(this._filteredProjectNameOptions, lang.hitch(this, function (projectNameOptionsObj) {
        this._updateCostProjectRow(projectNameOptionsObj);
      }));
      this.emit("updateProjectCostWidgetLoaded");
    },

    /**
     * This function is used to create each row to select the project having a checkbox
     */
    _updateCostProjectRow: function (projectNameOptionsObj, isSelectAll) {
      var label, parentNode;
      parentNode = domConstruct.create("div", {
        "class": "esriCTUpdateCostRowMainNode"
      }, this.projectListChildContainer);
      if (isSelectAll) {
        domClass.add(parentNode, "esriCTUpdateCostSelectAll");
        label = projectNameOptionsObj;
      } else {
        domClass.add(parentNode, "esriCTUpdateCostProjectRow");
        label = projectNameOptionsObj.label;
      }
      var checkBoxParentNode = domConstruct.create("div", {
        "class": "esriCTCheckBoxParentNode"
      }, parentNode);
      var checkboxObj = new CheckBox({
        "class": "esriCTProjectNameCheckBox",
        "checked": false,
        "label": label,
        "tabindex": "-1",
        "aria-label": label
      }, checkBoxParentNode);
      if (!isSelectAll) {
        projectNameOptionsObj.checkbox = checkboxObj;
      } else {
        this._updateCostProjectSelectAllCheckBox = checkboxObj;
      }
      this.own(on(checkboxObj, "change", lang.hitch(this, function (checked) {
        if (isSelectAll) {
          this._selectAllUpdateCostCheckBox(checked);
        } else {
          this._maintainSelectAllState();
        }
      })));
    },

    /**
     * This function is used to select/de-select all the projects depending upon the state of select all checkbox state.
     */
    _selectAllUpdateCostCheckBox: function (checked) {
      array.forEach(this._filteredProjectNameOptions, lang.hitch(this, function (projectNameOptionsObj) {
        projectNameOptionsObj.checkbox.setValue(checked);
        if (checked) {
          domAttr.set(this.updateCostEquationButton, "tabindex", "0");
          this.updateLastFocusNode(this.updateCostEquationButton, this.widgetDomNode);
        }
      }));
    },

    /**
     * This function is used to maintain select all checkbox state.
     */
    _maintainSelectAllState: function () {
      var enableParent, isCheckedParamAvailable;
      enableParent = true;
      isCheckedParamAvailable = false;
      array.forEach(this._filteredProjectNameOptions, lang.hitch(this, function (projectNameOptionsObj) {
        if (!projectNameOptionsObj.checkbox.getValue()) {
          enableParent = false;
        }
        if (projectNameOptionsObj.checkbox.getValue()) {
          isCheckedParamAvailable = true;
        }
      }));
      if (isCheckedParamAvailable) {
        domClass.remove(this.updateCostEquationButton, "jimu-state-disabled esriCTUpdateEquationBtnDisabled");
        domAttr.set(this.updateCostEquationButton, "tabindex", "0");
        this.updateLastFocusNode(this.updateCostEquationButton, this.widgetDomNode);
      } else {
        domClass.add(this.updateCostEquationButton, "jimu-state-disabled esriCTUpdateEquationBtnDisabled");
        domAttr.set(this.updateCostEquationButton, "tabindex", "-1");
        this.setTabindexOfUpdateProjectCost(true, this.widgetDomNode);
      }
      if (enableParent) {
        this._updateCostProjectSelectAllCheckBox.check(true);
        this.updateLastFocusNode(this.updateCostEquationButton, this.widgetDomNode);
      } else {
        this._updateCostProjectSelectAllCheckBox.uncheck(true);
        if (!isCheckedParamAvailable) {
          this.setTabindexOfUpdateProjectCost(true, this.widgetDomNode);
        }
      }
    },

    /**
     * This function is used to update cost equation on click of update button
     */
    _updateCostEquation: function () {
      this.loadingIndicator.show();
      // step 1 -> get select projects
      var projectGuidArr = this._getProjectGuid();
      // step 2 -> get asset table
      var assetTable = this.layerInfosObj.getTableInfoById(this.config.projectSettings.assetTable).layerObject;
      // step 3 -> get all the assets
      this._getAssets(projectGuidArr, assetTable);
    },

    /**
     * This function is used to get project guid that are checked
     */
    _getProjectGuid: function () {
      var projectGuidArr = [];
      array.forEach(this._filteredProjectNameOptions, lang.hitch(this, function (projectObj) {
        var isChecked = projectObj.checkbox.getValue();
        if (isChecked) {
          projectGuidArr.push(projectObj.globalIdValue);
        }
      }));
      return projectGuidArr;
    },

    /**
     * This function is used to get all the assets
     */
    _getAssets: function (projectGuidArr, assetTable) {
      var deferredObj = {};
      deferredObj.assetsDeferredList = this._getAssetsDeferred(projectGuidArr, assetTable);
      all(deferredObj).then(lang.hitch(this, function (deferredObjDetails) {
        var assetGuidArr, assetAttributeDetailsObj;
        assetGuidArr = [];
        assetAttributeDetailsObj = {};
        array.forEach(deferredObjDetails.assetsDeferredList.features, lang.hitch(this, function (assetDetailsObj) {
          if (assetDetailsObj.hasOwnProperty("attributes") &&
            assetDetailsObj.attributes.hasOwnProperty(this.config.assetTableFields.ASSETGUID)) {
            assetGuidArr.push(assetDetailsObj.attributes[this.config.assetTableFields.ASSETGUID]);
          }
          assetAttributeDetailsObj[assetDetailsObj.attributes[this.config.assetTableFields.ASSETGUID]] =
            assetDetailsObj.attributes;
        }));
        // step 4 -> get asset related layers
        this._getAssetLayers(assetGuidArr, assetAttributeDetailsObj);
      }), lang.hitch(this, function () {
        this.loadingIndicator.hide();
        this._showMessage(this.nls.updateCostEquationPanel.updateProjectCostError);
      }));
    },

    /**
     * This function is used to get the deferred object to get the assets
     */
    _getAssetsDeferred: function (projectGuidArr, layerObj) {
      var whereClause;
      whereClause = this.config.assetTableFields.PROJECTGUID +
        " IN " + "(" + "'" + projectGuidArr.join("','") + "'" + ")";
      var queryTask = new QueryTask(layerObj.url);
      var query = new Query();
      query.outFields = ['*'];
      query.where = whereClause;
      query.returnGeometry = false;
      query.outSpatialReference = this.map.spatialReference;
      var deferred = queryTask.execute(query);
      return deferred.promise;
    },

    /**
     * This function is used to get the layers belonging to the assets
     */
    _getAssetLayers: function (assetGuidArr, assetAttributeDetailsObj) {
      var deferredObj = {};
      array.forEach(this.config.layerSettings, lang.hitch(this, function (layerDetails) {
        var layerInfoDetails = this.layerInfosObj.getLayerInfoById(layerDetails.id);
        if (layerInfoDetails && layerInfoDetails.layerObject && layerInfoDetails.layerObject.globalIdField) {
          deferredObj[layerDetails.id] = this._getAssetLayerDeferred(layerDetails, assetGuidArr);
        }
      }));
      all(deferredObj).then(lang.hitch(this, function (projectAssetDetails) {
        // step 5 -> create project asset relationship
        var projectAssetRelation = this._createProjectAssetRelationship(projectAssetDetails);
        // step 6 -> create asset project relationship
        var assetProjectRelation = this._createAssetProjectRelationship(projectAssetRelation, assetGuidArr);
        // step 7 -> get geography name of the assets
        this._getAssetsGuidName(assetAttributeDetailsObj, assetProjectRelation);
      }), lang.hitch(this, function () {
        this.loadingIndicator.hide();
        this._showMessage(this.nls.updateCostEquationPanel.updateProjectCostError);
      }));
    },

    /**
     * This function is used to get the name of guid from the asset
     */
    _getAssetsGuidName: function (assetAttributeDetailsObj, assetProjectRelation) {
      var deferredObj = {};
      // get costing geometry layer
      var costingGeometryLayer = this.map.getLayer(this.config.projectSettings.costingGeometryLayer);
      for (var assetAttributeDetail in assetAttributeDetailsObj) {
        if (assetAttributeDetailsObj.hasOwnProperty(assetAttributeDetail)) {
          // get GUID
          var geographyGuid = assetAttributeDetailsObj[assetAttributeDetail]
            [this.config.assetTableFields.GEOGRAPHYGUID];
          if (geographyGuid !== '' && geographyGuid !== null && geographyGuid !== undefined) {
            deferredObj[assetAttributeDetail] = this._getAssetGuidDeferred(costingGeometryLayer, geographyGuid);
          }
        }
      }
      all(deferredObj).then(lang.hitch(this, function (deferredObjDetails) {
        // step 8 -> get asset & guid name relation
        var assetGuidNameRelation = this._getAssetGuidNameRelation(deferredObjDetails);
        // step 9 -> compare assets info with the configuration
        this._compareAssetsInfoWithConfiguration(assetProjectRelation, assetAttributeDetailsObj, assetGuidNameRelation);
      }), lang.hitch(this, function () {
        this.loadingIndicator.hide();
        this._showMessage(this.nls.updateCostEquationPanel.updateProjectCostError);
      }));
    },


    /**
     * This function is used to get the relation of asset & guid name relation
     */
    _getAssetGuidNameRelation: function (deferredObjDetails) {
      var assetGuidNameRelation = {};
      for (var deferredObjDetail in deferredObjDetails) {
        if (deferredObjDetails.hasOwnProperty(deferredObjDetail)) {
          assetGuidNameRelation[deferredObjDetail] =
            deferredObjDetails[deferredObjDetail].features[0].attributes[this.config.projectSettings.geographyField];
        }
      }
      return assetGuidNameRelation;
    },

    /**
     * This function is used to get the deferred object which returns the asset guid name
     */
    _getAssetGuidDeferred: function (layerObj, geographyGuid) {
      var whereClause;
      whereClause = layerObj.globalIdField + " = '" + geographyGuid + "'";
      var queryTask = new QueryTask(layerObj.url);
      var query = new Query();
      query.outFields = [this.config.projectSettings.geographyField];
      query.where = whereClause;
      query.returnGeometry = false;
      query.outSpatialReference = this.map.spatialReference;
      var deferred = queryTask.execute(query);
      return deferred.promise;
    },

    /**
     * This function is used to compare assets info with the assets info in the configuration
     */
    _compareAssetsInfoWithConfiguration: function (assetProjectRelation, assetDetails, assetGuidNameRelation) {
      var updateAssetGraphicArr = [];
      for (var asset in assetProjectRelation) {
        if (assetProjectRelation.hasOwnProperty(asset)) {
          // fetch layer id
          var layerId = assetProjectRelation[asset];
          // fetch the costing info of above layer id
          var costingInfoAssetsArr = this.config.costingInfoSettings[layerId];
          // asset array to which cost equation needs to be updated
          var updateAssetGraphic =
            this._getUpdateAssetGraphic(costingInfoAssetsArr, assetDetails, asset, assetGuidNameRelation);
          if (updateAssetGraphic) {
            updateAssetGraphicArr.push(updateAssetGraphic);
          }
        }
      }
      // step 10 -> update assets with new cost equation
      if (updateAssetGraphicArr.length > 0) {
        // step 11 -> update cost equation
        this._updateAssetCostingInfo(updateAssetGraphicArr);
      } else {
        this.loadingIndicator.hide();
        this._showMessage(this.nls.updateCostEquationPanel.updateProjectCostSuccess);
      }
    },

    /**
     * This function is used to create a graphic object of asset which is needed for updating the cost equation
     */
    _getUpdateAssetGraphic: function (costingInfoAssetsArr, assetDetails, asset, assetGuidNameRelation) {
      var updateAssetGraphic = null;
      array.forEach(costingInfoAssetsArr, lang.hitch(this, function (costingInfoAsset) {
        var costingInfoAssetScenario = costingInfoAsset.scenario;
        var costingInfoAssetTemplate = costingInfoAsset.featureTemplate;
        var costingInfoAssetGeography = costingInfoAsset.geography;
        var assetScenario = assetDetails[asset][this.config.assetTableFields.SCENARIO];
        var assetTemplate = assetDetails[asset][this.config.assetTableFields.TEMPLATENAME];
        var assetGeography;
        if (assetGuidNameRelation.hasOwnProperty(asset)) {
          assetGeography = assetGuidNameRelation[asset];
        } else {
          assetGeography = assetDetails[asset][this.config.assetTableFields.GEOGRAPHYGUID];
        }
        if (costingInfoAssetScenario === "" || costingInfoAssetScenario === null) {
          costingInfoAssetScenario = null;
        }
        if (costingInfoAssetGeography === "" || costingInfoAssetGeography === null) {
          costingInfoAssetGeography = null;
        }
        if (assetScenario === "" || assetScenario === null) {
          assetScenario = null;
        }
        if (assetGeography === "" || assetGeography === null) {
          assetGeography = null;
        }
        if (costingInfoAssetTemplate === assetTemplate &&
          costingInfoAssetGeography === assetGeography &&
          costingInfoAssetScenario === assetScenario) {
          var assetAttributes = {};
          assetAttributes[this.config.assetTableFields.OBJECTID] =
            assetDetails[asset][this.config.assetTableFields.OBJECTID];
          assetAttributes[this.config.assetTableFields.COSTEQUATION] = costingInfoAsset.costEquation;
          var assetGraphic = new Graphic(null, null, assetAttributes, null);
          updateAssetGraphic = assetGraphic;
        }
      }));
      return updateAssetGraphic;
    },

    /**
     * This function is used to update the cost equation of all the assets
     */
    _updateAssetCostingInfo: function (updateAssetGraphicArr) {
      var assetTable = this.layerInfosObj.getTableInfoById(this.config.projectSettings.assetTable).layerObject;
      assetTable.applyEdits(null, updateAssetGraphicArr, null, lang.hitch(this, function () {
        this.loadingIndicator.hide();
        this._showMessage(this.nls.updateCostEquationPanel.updateProjectCostSuccess);
      }), lang.hitch(this, function () {
        this.loadingIndicator.hide();
        this._showMessage(this.nls.updateCostEquationPanel.updateProjectCostError);
      }));
    },

    /**
     * This function is used to create relationship between asset and its project
     */
    _createAssetProjectRelationship: function (projectAssetRelation, assetGuidArr) {
      var assetProjectRelation = {};
      array.forEach(assetGuidArr, lang.hitch(this, function (assetGuid) {
        for (var project in projectAssetRelation) {
          if (projectAssetRelation.hasOwnProperty(project)) {
            if (projectAssetRelation[project].indexOf(assetGuid) > -1) {
              assetProjectRelation[assetGuid] = project;
            }
          }
        }
      }));
      return assetProjectRelation;
    },

    /**
     * This function is used to create the relationship between project and its assets
     */
    _createProjectAssetRelationship: function (projectAssetDetails) {
      var projectAssetRelation = {};
      for (var projectAssetDetail in projectAssetDetails) {
        if (projectAssetDetails.hasOwnProperty(projectAssetDetail)) {
          var projectAssetDetailsObj = projectAssetDetails[projectAssetDetail];
          var relatedAssetGuidArr = this._getRelatedAssetGuidArr(projectAssetDetailsObj);
          projectAssetRelation[projectAssetDetail] = relatedAssetGuidArr;
        }
      }
      return projectAssetRelation;
    },

    /**
     * This function is used to get the related asset guid array
     */
    _getRelatedAssetGuidArr: function (projectAssetDetailsObj) {
      var relatedAssetGuidArr = [];
      array.forEach(projectAssetDetailsObj.features, lang.hitch(this, function (feature) {
        if (feature.hasOwnProperty('attributes')) {
          relatedAssetGuidArr.push(feature.attributes[projectAssetDetailsObj.globalIdFieldName]);
        }
      }));
      return relatedAssetGuidArr;
    },

    /**
     * This function is used to get the deferred object to get the layer belonging to particular asset
     */
    _getAssetLayerDeferred: function (layerDetails, assetGuidArr) {
      var whereClause;
      whereClause = this.layerInfosObj.getLayerInfoById(layerDetails.id).layerObject.globalIdField +
        " IN " + "(" + "'" + assetGuidArr.join("','") + "'" + ")";
      var queryTask = new QueryTask(layerDetails.url);
      var query = new Query();
      query.outFields = ['*'];
      query.where = whereClause;
      query.returnGeometry = false;
      query.outSpatialReference = this.map.spatialReference;
      var deferred = queryTask.execute(query);
      return deferred.promise;
    },

    /**
     * This function is used to show the error/warning messages
     */
    _showMessage: function (msg) {
      var alertMessage = new Message({
        message: msg
      });
      alertMessage.message = msg;
    }
  });
});