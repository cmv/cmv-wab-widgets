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
  'jimu/BaseWidget',
  'jimu/utils',
  'dojo/Evented',
  'dijit/layout/ContentPane',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./project-attribute.html',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/dom-style',
  'dojo/on',
  'dojo/dom-construct',
  'dojo/dom-class',
  'esri/dijit/AttributeInspector',
  "esri/layers/FeatureLayer",
  "esri/tasks/query",
  'dojo/query',
  "dijit/registry",
  "dijit/focus",
  'dojo/keys',
  "dojo/_base/event",
  "dojo/dom-attr"
], function (
  declare,
  BaseWidget,
  jimuUtils,
  Evented,
  ContentPane,
  _WidgetsInTemplateMixin,
  template,
  lang,
  array,
  domStyle,
  on,
  domConstruct,
  domClass,
  AttributeInspector,
  FeatureLayer,
  Query,
  query,
  registry,
  focusUtils,
  keys,
  Event,
  domAttr
) {
  return declare([BaseWidget, Evented, _WidgetsInTemplateMixin], {
    templateString: template,
    baseClass: 'jimu-widget-cost-analysis-project-attribute',
    projectInfo: null, //current project details object (holds projectId, globalId etc)
    _projectLayerInfo: null, //project infrastructure layer info
    _updatedFeature: null, //current updated project feature
    _attributeInspector: null, //holds attribute inspectors object

    postCreate: function () {
      this.inherited(arguments);
      this.onProjectLoad(this.projectInfo);
    },

    startup: function () {
      this.inherited(arguments);
      //handle ok and cancel button click
      this.own(on(this.okButton, "click", lang.hitch(this, function () {
        this._onOkButtonClicked();
      })));
      this.own(on(this.okButton, "keydown", lang.hitch(this, function (evt) {
        //if has valid updated feature save it on layer
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this._onOkButtonClicked();
        }
      })));
      this.own(on(this.cancelButton, "click", lang.hitch(this, function () {
        this.emit("onCancelButtonClicked");
      })));
      this.own(on(this.cancelButton, "keydown", lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this.emit("onCancelButtonClicked");
        }
      })));
    },

    /**
     * This function is called ok button clicked
     */
    _onOkButtonClicked: function () {
      //if has valid updated feature save it on layer
      if (this._updatedFeature) {
        this._updatedFeature.getLayer().applyEdits(null, [this._updatedFeature], null,
          lang.hitch(this,
            function (adds, updates, deletes) { // jshint ignore : line
              //Emit the project update event
              if (updates[0].success) {
                this.emit("onProjectInfoUpdate", this._updatedFeature);
              }
            }));
      }
      this.emit("onOkButtonClicked");
    },

    /**
     * Once project is created/loaded call this method
     */
    onProjectLoad: function (projectInfo) {
      this.projectInfo = projectInfo;
      var projectLayerId = this.config.projectSettings.projectLayer;
      if (this.projectInfo.projectId && projectLayerId) {
        this._projectLayerInfo = this.layerInfosObj.getLayerInfoById(projectLayerId);
        this._loadAttributeInspector();
      }
    },

    /**
     * This function selects current projects feature
     * Also refresh attribute editor to allow editing of attributes
     */
    editProjectAttributes: function () {
      var query, uniqueVal, layersDefinitionExp = "";
      if (this._projectLayerInfo) {
        this.loadingIndicator.show();
        uniqueVal = Date.now();
        this._updatedFeature = null;
        //select current project feature from the layer
        query = new Query();
        //If applied filter is excluding current project
        //we can still load the current feature by removing existing definition exp and
        //apply exp to get current project, also dirty the query so that we always get new data
        layersDefinitionExp = this._projectLayerInfo.layerObject.getDefinitionExpression();
        if (layersDefinitionExp) {
          this._projectLayerInfo.layerObject.setDefinitionExpression("");
        }
        query.where = this._projectLayerInfo.layerObject.globalIdField + " = '" +
          this.projectInfo.projectId + "' AND " + uniqueVal + " = " + uniqueVal;
        this._projectLayerInfo.layerObject.selectFeatures(query, FeatureLayer.SELECTION_NEW,
          lang.hitch(this, function (results) {
            this._updatedFeature = results[0];
            //refresh attribute inspector
            if (this._attributeInspector) {
              this._attributeInspector.refresh();
              //sometimes attributes editor gets display none, so override style and show it
              domStyle.set(this._attributeInspector.attributeTable, "display", "");
              if (this._attributeInspector.attributeTable &&
                this._attributeInspector.attributeTable.childNodes &&
                this._attributeInspector.attributeTable.childNodes.length > 0) {
                var attributeTable = this._attributeInspector.attributeTable.childNodes[0];
                domAttr.set(attributeTable, "cellspacing", "1");
              }
            }
            this.loadingIndicator.hide();
            //once feature is loaded again set the existing definition exp back to layer
            if (layersDefinitionExp) {
              this._projectLayerInfo.layerObject.setDefinitionExpression(layersDefinitionExp);
            }
            this._add508SupportToATI();
          }));
      }
    },

    /**
     * Function to merge objects
     */
    mergeFirstToLast: function () {
      var obj = {}, i = arguments.length - 1, il = 0, key;
      for (; i >= il; i--) {
        for (key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) {
            obj[key] = arguments[i][key];
          }
        }
      }
      return obj;
    },

    /**
     * Returns field infos using all the fields from the layer.
     */
    _getFieldInfosFromLayer: function (layerInfo) {
      var fieldInfos = [];
      if (layerInfo && layerInfo.layerObject) {
        array.forEach(layerInfo.layerObject.fields, function (field) {
          var fieldInfo = jimuUtils.getDefaultPortalFieldInfo(field);
          fieldInfo = this.mergeFirstToLast(fieldInfo, field);
          if (fieldInfo.format &&
            fieldInfo.format.dateFormat &&
            fieldInfo.format.dateFormat.toLowerCase() &&
            fieldInfo.format.dateFormat.toLowerCase().indexOf('time') >= 0) {
            fieldInfo.format.time = true;
          }
          fieldInfo.visible = true;
          fieldInfos.push(fieldInfo);
        }, this);
      }
      return fieldInfos;
    },

    /**
     * Creates field infos for attribute inspector.
     * It skips fields which are not visible and disable some fields like
     * PROJECTNAME, TOTALASSETCOST, GROSSPROJECTCOST which are calculated by widget.
     */
    _createFieldInfos: function () {
      var fieldInfos, allFieldsInfo;
      //if popup is enabled and has valid  infoTemplate use it else get field infos form layer
      if (this._projectLayerInfo.controlPopupInfo &&
        this._projectLayerInfo.controlPopupInfo.enablePopup &&
        this._projectLayerInfo.controlPopupInfo.infoTemplate) {
        allFieldsInfo =
          lang.clone(this._projectLayerInfo.controlPopupInfo.infoTemplate.info.fieldInfos);
      } else {
        allFieldsInfo = this._getFieldInfosFromLayer(this._projectLayerInfo);
      }
      fieldInfos = [];
      array.forEach(allFieldsInfo, lang.hitch(this, function (field) {
        //skip fields which are not visible
        if (field.visible) {
          //disable projectName,totalCost and grossCost fields
          if (field.fieldName.toUpperCase() === "PROJECTNAME" ||
            field.fieldName.toUpperCase() === "TOTALASSETCOST" ||
            field.fieldName.toUpperCase() === "GROSSPROJECTCOST") {
            field.isEditable = false;
          }
          fieldInfos.push(field);
        }
      }));
      return fieldInfos;
    },

    /**
     * Function creates attribute inspector for project layer and show in widget panel.
     */
    _loadAttributeInspector: function () {
      var newContentPane, fieldInfos;
      if (this._projectLayerInfo) {
        //get filed infos
        fieldInfos = this._createFieldInfos();
        //empty previous content and create new content pane to hold new attribute inspector
        domConstruct.empty(this.projectAttributeNode);
        newContentPane = new ContentPane({ "style": { "padding": "0" } },
          domConstruct.create("div", {}, this.projectAttributeNode));
        //Initialize Attribute Inspector
        this._attributeInspector = new AttributeInspector({
          layerInfos: [{
            'featureLayer': this._projectLayerInfo.layerObject,
            'showAttachments': false,
            'isEditable': true,
            'fieldInfos': fieldInfos
          }]
        }, domConstruct.create("div"));
        this._attributeInspector.on("attribute-change", lang.hitch(this, function (evt) {
          //store the updates to apply when the ok button is clicked
          this._updatedFeature.attributes[evt.fieldName] = evt.fieldValue;
        }));
        //hide layer name
        domClass.add(this._attributeInspector.layerName, "esriCTHidden");
        //hide delete button container
        domClass.add(this._attributeInspector.editButtons, "esriCTHidden");
        //set attribute inspector in content pane
        newContentPane.setContent(this._attributeInspector.domNode);
      }
    },

    /**
     * This function is used to set aria labels to all dijits controls in attribute inspector
     */
    _add508SupportToATI: function () {
      var attTable, aINodes, firstNodeOfAI;
      if (this._attributeInspector && this._attributeInspector.domNode) {
        aINodes = registry.findWidgets(this._attributeInspector.domNode);
        array.forEach(aINodes, lang.hitch(this, function (node) {
          if(node.focusNode && !firstNodeOfAI) {
            firstNodeOfAI = node.focusNode;
            jimuUtils.initFirstFocusNode(this.widgetDomNode, node.focusNode);
            focusUtils.focus(node.focusNode);
          }
          if(node.hasOwnProperty("focusNode") && node.focusNode.disabled) {
            domAttr.set(node.focusNode, "disabled", false);
            domAttr.set(node.focusNode, "tabindex", 0);
            domAttr.set(node.focusNode, "readOnly", true);
            domAttr.set(node.focusNode, "aria-disabled", "true");
          }
        }));
        attTable = query("td.atiLabel", this._attributeInspector.domNode);
        if (attTable) {
          array.forEach(attTable, lang.hitch(this, function (row) {
            var timeDijit, timeDijitNode;
            var rowInfo = this._getAttrInspectorRowInfo(row);
            if (rowInfo) {
              rowInfo[0].set("aria-label", rowInfo[1]);
              //if row has time dijit it will has two childs
              //seperately add aria-lable for time dijit
              if (row.parentNode.childNodes[1].childNodes.length > 1) {
                timeDijitNode = row.parentNode.childNodes[1].childNodes[1];
                timeDijit = registry.getEnclosingWidget(timeDijitNode);
                timeDijit.set("aria-label", rowInfo[1]);
              }
            }
          }));
        }
      }
      jimuUtils.initLastFocusNode(this.widgetDomNode, this.cancelButton);
    },

    /**
     * This function is used to get attribute inspector rows info
     */
    _getAttrInspectorRowInfo: function (row) {
      try {
        if (row) {
          if (row.parentNode) {
            var valueCell = row.parentNode.childNodes[1].childNodes[0];
            var widget = registry.getEnclosingWidget(valueCell);
            var label = row.childNodes[0].data;
            return [widget, label, valueCell];
          }
        }
        return null;
      }
      catch (err) {
        console.log(err);
        return null;
      }
    }
  });
});