///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
// jscs:disable validateIndentation
define([
  "dojo/_base/declare",
  "dojo/Evented",
  "dojo/on",
  "dojo/string",
  "dojo/dom-attr",
  "dojo/dom-style",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/dom-construct",
  "esri/graphic",
  "jimu/dijit/Message",
  "dijit/_WidgetBase",
  "./presetUtils",
  'dojo/query',
  "esri/tasks/RelationshipQuery",
  "dojo/dom-geometry",
  "dojo/dom-class"
], function (
  declare,
  Evented,
  on,
  String,
  domAttr,
  domStyle,
  lang,
  array,
  domConstruct,
  Graphic,
  Message,
  _WidgetBase,
  presetUtils,
  query,
  RelationshipQuery,
  domGeom,
  domClass
) {
  return declare([_WidgetBase, Evented], {
    newRelatedFeature: {},
    _validRelations: [],
    isSaveEnable: false,
    postCreate: function () {
      this._validRelations = [];
    },

    startup: function () {
      this._createTable();
    },

    /**
    * The function will create table for valid relationships
    */
    _createTable: function () {
      var contentWrapper;
      contentWrapper = domConstruct.create("div", {
        "class": "relatedTablesContainer"
      }, this.domNode);
      array.forEach(this.relationshipInfo, lang.hitch(this, function (relationship) {
        if (relationship.featureLayer && relationship.hasOwnProperty('relationshipId')) {
          this._createRelatedTableItem(relationship, contentWrapper);
        }
      }));
      //Check if atleast one related ite is added and accordingly pass the flag value
      //We need to do this to add/remove the border of first content i.e AI container
      if (query(".relatedTableTitleContainer", this.domNode).length > 0) {
        this.emit("addRelatedItemContent", true);
      } else {
        this.emit("addRelatedItemContent", false);
      }
    },

    /**
    * The function will create individual item
    */
    _createRelatedTableItem: function (relationship, contentWrapper) {
      var titleContainer, tableTitle, createNewFeature, tableInfo, currentFeature,
        relationShipInfo = {};
      tableInfo = this.layerInfosObj.getLayerOrTableInfoById(relationship.featureLayer.id);
      titleContainer = domConstruct.create("div", {
        "class": "relatedTableTitleContainer"
      }, contentWrapper);
      domAttr.set(titleContainer, "layerId", tableInfo.id);
      domAttr.set(titleContainer, "relationshipId", relationship.relationshipId);
      domAttr.set(titleContainer, "parentFeatureOID",
        this.parentFeature.attributes[this.parentFeature._layer.objectIdField]);
      // click handler for title container
      on(titleContainer, "click", lang.hitch(this, function (evt) {
        // get the related records count and proceed only when count is greater than 0
        var relatedCount;
        relatedCount = domAttr.get(evt.currentTarget, "relatedRecordCount");
        //by default relatedCount attr is not set so it will be null
        //in case of opening related feature using featureAction relatedCount will be null
        if (relatedCount === null || (relatedCount && parseInt(relatedCount, 10) !== 0)) {
          this.emit("titleClicked",
            tableInfo.id, relationship.relationshipId, false,
            this.parentFeatureIndexInAI, this.parentFeature.attributes[this.parentFeature._layer.objectIdField],
            this.newRelatedFeature[relationship.relationshipId].foreignKeyField);
        }
      }));

      tableTitle = domConstruct.create("div", {
        "class": "relatedTableTitle esriCTEllipsis",
        "innerHTML": tableInfo.title,
        "title": tableInfo.title
      }, titleContainer);
      // Create container to display the loading indicator until record count is fetched & displayed
      domConstruct.create("div", { "class": "esriCTLoadingIcon hidden" }, titleContainer);
      // Create container to display the count of related table records
      domConstruct.create("div", { "class": "esriCTRelatedTableRecordsCount" }, titleContainer);
      relationShipInfo = this._checkRelationShip(tableInfo, relationship.relationshipId);
      //Create new feature only for valid relationship
      if (relationShipInfo.isValidRelation) {
        this._createNewGraphics(relationship.relationshipId, tableInfo.id,
          relationShipInfo.primaryKeyField, relationShipInfo.foreignKeyField);
        //Create new array for relations
        //This will be used while updating the related record count
        this._validRelations.push(relationship);
      } else {
        domConstruct.destroy(titleContainer);
      }
      //Show create new feature button if layer has create capabilities and it is of type table
      if (this._canAddFeatures(relationship, tableInfo) && tableInfo.layerObject.type === "Table") {
        //create add new feature button based on layer/table config and capabilities
        createNewFeature = domConstruct.create("div", {
          "class": "relatedTableIcons itemTitleCreateNew",
          "title": this.nls.addNewFeature
        }, titleContainer);
        domAttr.set(createNewFeature, "tableId", tableInfo.id);
        //click handler for creating new feature
        on(createNewFeature, "click", lang.hitch(this, function (evt) {
          evt.stopPropagation();
          currentFeature = this.newRelatedFeature[relationship.relationshipId];
          if (this.isSaveEnable) {
            Message({
              message: this.nls.pendingFeatureSaveMsg
            });
            return;
          }
          if (this.parentFeature.attributes[currentFeature.primaryKeyField] === undefined ||
            this.parentFeature.attributes[currentFeature.primaryKeyField] === null) {
            //Fetch field alias or field name from the field for showing the warning message
            var fieldInfo = presetUtils.getFieldInfoByFieldName(this.parentFieldInfos,
              currentFeature.primaryKeyField);
            var fieldAlias = fieldInfo.label || currentFeature.primaryKeyField;
            var errorMsg = String.substitute(this.nls.invalidRelationShipMsg,
              { parentKeyField: fieldAlias });
            Message({
              message: errorMsg
            });
            return;
          }
          //CT - Update the related feature instance with parent features foreign and primary key attribute
          //This will make sure the newly created related feature has valid key field
          this.newRelatedFeature[relationship.relationshipId].attributes[
            this.newRelatedFeature[relationship.relationshipId].foreignKeyField] =
            this.parentFeature.attributes[
            this.newRelatedFeature[relationship.relationshipId].primaryKeyField];
          this.emit("addRelatedRecord",
            this.newRelatedFeature[relationship.relationshipId], titleContainer,
            tableInfo.id, this.parentFeatureIndexInAI,
            this.newRelatedFeature[relationship.relationshipId].foreignKeyField);
        }));
      }
      if (relationShipInfo.isValidRelation) {
        // Fetch & Display related records count in accordian panel
        this.getRelatedRecordsCount(relationship.relationshipId, tableInfo.id);
      }
    },

    /**
    * Check if new feature creation is enable in particular table
    */
    _canAddFeatures: function (tableConfig, tableInfo) {
      var editingCapabilities;
      //get capabilities of table/layer
      editingCapabilities = tableInfo.layerObject.getEditCapabilities();
      if (!tableConfig.allowUpdateOnly && tableConfig._editFlag && editingCapabilities.canCreate) {
        return true;
      } else {
        return false;
      }
    },

    _checkRelationShip: function (tableInfo, relationshipId) {
      var parentLayerRelation, relatedLayerRelation,
        primaryKeyField, foreignKeyField, isValidRelation = true;
      //get parent and related layers relations
      parentLayerRelation = this._getRelationShipById(this.parentFeature._layer, relationshipId);
      relatedLayerRelation = this._getRelationShipById(tableInfo.layerObject, relationshipId);
      // add valid relationship value in related table/layer
      if (parentLayerRelation && parentLayerRelation.keyField &&
        relatedLayerRelation && relatedLayerRelation.keyField) {
        primaryKeyField = parentLayerRelation.keyField;
        foreignKeyField = relatedLayerRelation.keyField;
      } else {
        isValidRelation = false;
      }
      return {
        "isValidRelation": isValidRelation,
        "foreignKeyField": foreignKeyField,
        "primaryKeyField": primaryKeyField
      };
    },

    /**
    * Create new graphics for respective table/layer
    */
    _createNewGraphics: function (relationshipId, tableId, primaryKeyField, foreignKeyField) {
      var tableInfo, newGraphic, featureAttributes = {}, isValidRelation = true;
      tableInfo = this.layerInfosObj.getLayerOrTableInfoById(tableId);
      //check for valid template
      if (tableInfo.layerObject.templates.length > 0) {
        featureAttributes = tableInfo.layerObject.templates[0].prototype.attributes;
      } else if (tableInfo.layerObject.types.length > 0) {
        featureAttributes = tableInfo.layerObject.types[0].templates[0].prototype.attributes;
      }
      newGraphic = new Graphic(null, null, lang.clone(featureAttributes));

      if (newGraphic.attributes.hasOwnProperty(foreignKeyField)) {
        newGraphic.attributes[foreignKeyField] = this.parentFeature.attributes[primaryKeyField];
      }
      this.newRelatedFeature[relationshipId] = newGraphic;
      this.newRelatedFeature[relationshipId].primaryKeyField = primaryKeyField;
      this.newRelatedFeature[relationshipId].foreignKeyField = foreignKeyField;
      this.newRelatedFeature[relationshipId].featureLayer = tableInfo;
      return isValidRelation;
    },

    /**
    * Get relationship of layer or table
    */
    _getRelationShipById: function (layer, relationshipId) {
      var relation;
      array.some(layer.relationships, lang.hitch(this, function (relationship) {
        //Return relationship
        if (relationship.id === relationshipId) {
          relation = relationship;
          return true;
        }
      }));
      return relation;
    },

    updateFeatureInstance: function (updatedAttributes) {
      if (this.parentFeature) {
        this.parentFeature.attributes = lang.clone(updatedAttributes);
      }
    },

    /**
     * This function is used to display the related record count in its container.
     */
    displayRelatedRecordCount: function (relatedRecordCount, relationshipid) {
      var countNode, countParent, relatedTableTitleNode, newWidth,
        createNewIcons, loadingIconNode;
      //get nodes by querying
      countParent = query("[relationshipid = " + relationshipid + "]", this.domNode);
      createNewIcons = query(".relatedTableIcons.itemTitleCreateNew", this.domNode);
      // loading icon node
      loadingIconNode = query(".esriCTLoadingIcon", countParent[0])[0];
      // hide loading indicator
      domClass.add(loadingIconNode, "hidden");
      // count node
      countNode = query(".esriCTRelatedTableRecordsCount", countParent[0])[0];
      // show count node
      domClass.remove(countNode, "hidden");
      relatedTableTitleNode = query(".relatedTableTitle", countParent[0])[0];
      //set count in the node
      domAttr.set(countNode, "innerHTML", "(" + relatedRecordCount + ")");
      domAttr.set(countParent[0], "relatedRecordCount", relatedRecordCount);
      // Once count is added, width of table title is dynamically calculated.
      newWidth = domGeom.position(countNode).w;
      // Initially, in tab theme, the container of the widget is in collapse mode.
      // So the width of the count node is rendered as "auto". Ideally, which should be in "px".
      // Due to this, title width is calculated incorrectly and new record icon is shited downwards.
      // Hence, in this case, depending upon the length of a number in the relatedRecordCount,
      // its new width is hardcoded. For e.g; if relatedRecordCount is "33", than its length is 2,
      // and according to this length, new width will be 22. Same rule applies for other dijit count.
      if (newWidth === "auto" || newWidth === undefined || newWidth === "" || newWidth === 0) {
        // 8 is the width of round () brackets
        // 7 is considered as a default width for a single dijit
        // relatedRecordCount.toString().length is the number of dijit present in the relatedRecordCount count
        newWidth = 8 + (7 * relatedRecordCount.toString().length);
      }
      if (createNewIcons.length > 0) {
        // This additional width(35) consists the width of add new record button's width
        newWidth = newWidth + 35;
      } else {
        // In all the displayed records, if add new record button is not displayed,
        // then display the count to the extreme right.
        newWidth = newWidth + 10;
      }
      domStyle.set(relatedTableTitleNode, "width", "calc(100% - " + newWidth + "px)");
      // Default cursor will be displayed if record count is 0
      if (relatedRecordCount === 0) {
        domClass.add(countParent[0], "esriCTRelatedTableTitleDefaultCursor");
      } else {
        domClass.remove(countParent[0], "esriCTRelatedTableTitleDefaultCursor");
      }
    },

    /**
     * This function is used to update the related record count, whenever a record is added/deleted
     */
    updateRelatedRecordsCount: function () {
      array.forEach(this._validRelations, lang.hitch(this, function (relationship) {
        this.getRelatedRecordsCount(
          relationship.relationshipId,
          relationship.featureLayer.id
        );
      }));
    },

    /**
     * This function is used to show loading indicator until record count is fetched & displayed
     */
    _showLoadingIndicator: function (relationshipid) {
      var countNode, countParent, relatedTableTitleNode, newWidth,
        createNewIcons, loadingIconNode;
      //get nodes by querying
      countParent = query("[relationshipid = " + relationshipid + "]", this.domNode);
      createNewIcons = query(".relatedTableIcons.itemTitleCreateNew", this.domNode);
      // loading icon node
      loadingIconNode = query(".esriCTLoadingIcon", countParent[0])[0];
      // fetch count node
      countNode = query(".esriCTRelatedTableRecordsCount", countParent[0])[0];
      // title node
      relatedTableTitleNode = query(".relatedTableTitle", countParent[0])[0];
      // display loading indicator
      domClass.remove(loadingIconNode, "hidden");
      // hide count
      domClass.add(countNode, "hidden");
      // defaut width of loading indicator container is 20
      newWidth = 20;
      if (createNewIcons.length > 0) {
        // This additional width(35) consists the width of add new record button's width
        newWidth = newWidth + 35;
      } else {
        // In all the displayed records, if add new record button is not displayed,
        // then display the count to the extreme right.
        newWidth = newWidth + 10;
      }
      domStyle.set(relatedTableTitleNode, "width", "calc(100% - " + newWidth + "px)");
    },

    /**
     * This function is used to query the related table and fetch its record count
     */
    getRelatedRecordsCount: function (relationshipId, relatedLayersId) {
      var relatedQuery, objectId, relatedLayer, relatedObjectId, layerObject, parentOID;
      // Feature layer object
      layerObject = this.parentFeature._layer;
      // Object id of the feature clicked
      parentOID = this.parentFeature.attributes[this.parentFeature._layer.objectIdField];
      // RelationshipQuery object
      relatedQuery = new RelationshipQuery();
      objectId = parentOID;
      // Related layer object
      relatedLayer = this.layerInfosObj.getLayerOrTableInfoById(relatedLayersId).layerObject;
      // Field name of object id in related layer
      relatedObjectId = relatedLayer.objectIdField;
      relatedQuery.returnGeometry = false;
      relatedQuery.outSpatialReference = this.mapSpatialReference;
      // The ID of the relationship to be queried.
      // Records in tables/layers corresponding to the related table/layer of the relationship are queried.
      relatedQuery.relationshipId = relationshipId;
      // The object IDs of the layer/table to be queried. Records related to these object IDs will be queried.
      relatedQuery.objectIds = [objectId];
      // The list of fields from the related table/layer to be included in the returned feature set. 
      // In this case we only include object id that needs to be returned
      relatedQuery.outFields = [relatedObjectId];
      // Start loading indicator in accordian panel
      this._showLoadingIndicator(relationshipId);
      // The result of this operation are feature sets grouped by source layer/table object IDs.
      layerObject.queryRelatedFeatures(relatedQuery,
        lang.hitch(this, function (relatedRecords) {
          var features;
          features = relatedRecords[objectId] && relatedRecords[objectId].features;
          if (features) {
            this.displayRelatedRecordCount(features.length, relationshipId);
          } else {
            this.displayRelatedRecordCount(0, relationshipId);
          }
        }), lang.hitch(this, function () {
          this.displayRelatedRecordCount(0, relationshipId);
        })
      );
    }
  });
});