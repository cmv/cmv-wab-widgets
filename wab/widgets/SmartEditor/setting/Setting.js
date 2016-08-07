///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
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

define([
    'dojo',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    'jimu/LayerInfos/LayerInfos',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/query',
    'dijit/registry',
    'dojo/_base/array',
    "./EditFields",
    "./EditDescription",
    "../utils",
    'dijit/Editor',
    'dojo/dom-style',
    'dojo/sniff',
    'jimu/utils',
    'dojo/_base/html',
    'jimu/dijit/Message',
    'dijit/_editor/plugins/LinkDialog',
    'dijit/_editor/plugins/ViewSource',
    'dijit/_editor/plugins/FontChoice',
    'dojox/editor/plugins/Preview',
    'dijit/_editor/plugins/TextColor',
    'dojox/editor/plugins/ToolbarLineBreak',
    'dojox/editor/plugins/FindReplace',
    'dojox/editor/plugins/PasteFromWord',
    'dojox/editor/plugins/InsertAnchor',
    'dojox/editor/plugins/Blockquote',
    'dojox/editor/plugins/UploadImage',
    './ChooseImage'
],
  function (
    dojo,
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    Table,
    LayerInfos,
    lang,
    on,
    query,
    registry,
    array,
    EditFields,
    EditDescription,
    editUtils,
    Editor,
    domStyle,
    has,
    utils,
    html,
    Message
    ) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-smartEditor-setting',
      _jimuLayerInfos: null,
      _layersTable: null,
      _editableLayerInfos: null,
      _editFields: null,
      postCreate: function () {
        this.nls = lang.mixin(this.nls, window.jimuNls.common);

      },
      startup: function () {
        this.inherited(arguments);
        LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function (operLayerInfos) {
            this._jimuLayerInfos = operLayerInfos;
            this._init();
            this.setConfig();
            this._initEditor();
          }));

      },

      destroy: function () {
        this._jimuLayerInfos = null;
        delete this._jimuLayerInfos;
        this._layersTable = null;
        delete this._layersTable;
        this._editableLayerInfos = null;
        delete this._editableLayerInfos;
        this._editFields = null;
        delete this._editFields;
        this._editDescriptions = null;
        delete this._editDescriptions;
        this.inherited(arguments);
      },

      _init: function () {
        this._initSettings();
        this._initLayersTable();
      },

      _initLayersTable: function () {
        var fields = [{
          name: 'edit',
          title: this.nls.layersPage.layerSettingsTable.edit,
          type: 'checkbox',
          'class': 'editable'
        }, {
          name: 'label',
          title: this.nls.layersPage.layerSettingsTable.label,
          type: 'text',
          'class': 'layer'
        }, {
          name: 'allowUpdateOnly',
          title: this.nls.layersPage.layerSettingsTable.allowUpdateOnly,
          type: 'checkbox',
          'class': 'update'
        }, {
          name: 'allowDelete',
          title: this.nls.layersPage.layerSettingsTable.allowDelete,
          type: 'checkbox',
          'class': 'update'
        },
        {
          name: 'disableGeometryUpdate',
          title: this.nls.layersPage.layerSettingsTable.update,
          type: 'checkbox',
          'class': 'disable'
        },
        {
          name: 'specialType',
          type: "extension",
          title: this.nls.layersPage.layerSettingsTable.description,
          create: lang.hitch(this, this._createSpecialType),
          setValue: lang.hitch(this, this._setValue4SpecialType),
          getValue: lang.hitch(this, this._getValueOfSpecialType),
          'class': 'description'
        },
        {
          name: 'actions',
          title: this.nls.layersPage.layerSettingsTable.fields,
          type: 'actions',
          'class': 'actions',
          actions: ['edit']//'up','down',
        },
        {
          name: 'allowUpdateOnlyHidden',
          type: 'checkbox',
          hidden: true
        },
        {
          name: 'allowDeleteHidden',
          type: 'checkbox',
          hidden: true
        },
        {
          name: 'disableGeometryUpdateHidden',
          type: 'checkbox',
          hidden: true
        }];
        var args = {
          fields: fields,
          selectable: false
        };
        this._layersTable = new Table(args);
        this._layersTable.placeAt(this.tableLayerInfos);
        this._layersTable.startup();

        var nl = query("th.simple-table-field", this._layersTable.domNode);
        nl.forEach(function (node) {
          switch (node.innerText) {
            case this.nls.layersPage.layerSettingsTable.edit:
              node.title = this.nls.layersPage.layerSettingsTable.editTip;
              break;
            case this.nls.layersPage.layerSettingsTable.label:
              node.title = this.nls.layersPage.layerSettingsTable.labelTip;
              break;
            case this.nls.layersPage.layerSettingsTable.allowUpdateOnly:
              node.title = this.nls.layersPage.layerSettingsTable.allowUpdateOnlyTip;
              break;
            case this.nls.layersPage.layerSettingsTable.allowDelete:
              node.title = this.nls.layersPage.layerSettingsTable.allowDeleteTip;
              break;
            case this.nls.layersPage.layerSettingsTable.update:
              node.title = this.nls.layersPage.layerSettingsTable.updateTip;
              break;
            case this.nls.layersPage.layerSettingsTable.description:
              node.title = this.nls.layersPage.layerSettingsTable.descriptionTip;
              break;
            case this.nls.layersPage.layerSettingsTable.fields:
              node.title = this.nls.layersPage.layerSettingsTable.fieldsTip;
              break;

          }

        }, this);

        this.own(on(this._layersTable,
          'actions-edit',
          lang.hitch(this, this._onEditFieldInfoClick)));
      },
      _createSpecialType: function (td) {
        var img = html.create('a', { 'class': 'attDescrip' }, td);
        this.own(on(img, 'click', lang.hitch(this, function () {
          this._onDescriptionClick(td.parentNode);
        })));
      },

      _setValue4SpecialType: function () {
        //var select = query('select', td)[0];
        //select.value = value;
      },

      _getValueOfSpecialType: function () {
        //var select = query('select', td)[0];
        //return select.value;
      },
      _initSettings: function () {
        //this.showDeleteButton.set('checked', this.config.editor.showDeleteButton);
        this.useFilterEditor.set('checked', this.config.editor.useFilterEditor);
        this.displayPromptOnSave.set('checked', this.config.editor.displayPromptOnSave);
        this.displayPromptOnDelete.set('checked', this.config.editor.displayPromptOnDelete);
        this.removeOnSave.set('checked', this.config.editor.removeOnSave);
        //this.clearSelectionOnClose.set('checked', false);
      },

      setConfig: function () {
        // if (!config.editor.layerInfos) { //***************
        //   config.editor.layerInfos = [];
        // }
        this._editableLayerInfos = this._getEditableLayerInfos();
        this._setLayersTable(this._editableLayerInfos);

      },

      _getEditableLayerInfos: function () {
        // summary:
        //   get all editable layers from map.
        // description:
        //   layerInfo will honor configuration if that layer has configured.
        var editableLayerInfos = [];
        for (var i = this.map.graphicsLayerIds.length - 1; i >= 0; i--) {
          var layerObject = this.map.getLayer(this.map.graphicsLayerIds[i]);
          if (layerObject.type === "Feature Layer" &&
              layerObject.url &&
              layerObject.isEditable &&
              layerObject.isEditable()) {
            var layerInfo = this._getLayerInfoFromConfiguration(layerObject);
            if (!layerInfo) {
              layerInfo = this._getDefaultLayerInfo(layerObject);
            }
            editableLayerInfos.push(layerInfo);
          }
        }
        return editableLayerInfos;
      },

      _getLayerInfoFromConfiguration: function (layerObject) {
        var layerInfo = null;
        var layerInfos = this.config.editor.layerInfos;
        if (layerInfos && layerInfos.length > 0) {
          for (var i = 0; i < layerInfos.length; i++) {
            if (layerInfos[i].featureLayer &&
               layerInfos[i].featureLayer.id === layerObject.id) {
              layerInfo = layerInfos[i];
              break;
            }
          }

          if (layerInfo) {
            // update fieldInfos.
            layerInfo.fieldInfos = this._getSimpleFieldInfos(layerObject, layerInfo);
            // set _editFlag to true
            layerInfo._editFlag = true;

            layerInfo.mapLayer = [];

            layerInfo.mapLayer.resourceInfo =
              this._jimuLayerInfos.getLayerInfoById(layerObject.id).originOperLayer.resourceInfo;
            layerInfo.mapLayer.url =
              this._jimuLayerInfos.getLayerInfoById(layerObject.id).originOperLayer.url;

          }
        }
        return layerInfo;
      },

      _getDefaultLayerInfo: function (layerObject) {
        var allowsCreate = false;
        var allowsUpdate = false;
        var allowsDelete = false;
        var allowGeometryUpdates = false;
        try {
          var capabilities = layerObject.getEditCapabilities();
          if (capabilities.canCreate) {
            allowsCreate = true;
          }
          if (capabilities.canUpdate) {
            allowsUpdate = true;
          }
          if (capabilities.canDelete) {
            allowsDelete = true;
          }
        }
        catch (err) {
          if (layerObject.hasOwnProperty('capabilities')) {
            if (String(layerObject.capabilities).indexOf('Update') === -1 &&
              String(layerObject.capabilities).indexOf('Delete') === -1 &&
              String(layerObject.capabilities).indexOf('Create') === -1 &&
              String(layerObject.capabilities).indexOf('Editing') !== -1) {
              allowsUpdate = true;
              allowsDelete = true;
              allowsCreate = true;
            }
            else {
              if (String(layerObject.capabilities).indexOf('Update') !== -1) {
                allowsUpdate = true;
              }
              if (String(layerObject.capabilities).indexOf('Delete') !== -1) {
                allowsDelete = true;
              }
              if (String(layerObject.capabilities).indexOf('Create') !== -1) {
                allowsCreate = true;
              }
            }
          }

        }

        if (layerObject.hasOwnProperty('allowGeometryUpdates')) {
          allowGeometryUpdates = layerObject.allowGeometryUpdates;
        }
        var editable = true;
        if (this.config.editor.layerInfos &&
            this.config.editor.layerInfos.length > 0) {
          editable = array.some(this.config.editor.layerInfos, function (layerInfo) {
            return (layerInfo.featureLayer.id === layerObject.id);
          });
        }
        var origLayerInfo = this._jimuLayerInfos.getLayerInfoById(layerObject.id);
        var layerInfo = {
          'featureLayer': {
            'id': layerObject.id,
            'layerAllowsCreate': allowsCreate,
            'layerAllowsUpdate': allowsUpdate,
            'layerAllowsDelete': allowsDelete,
            'layerAllowGeometryUpdates': allowGeometryUpdates
          },
          'mapLayer': {
            'resourceInfo': origLayerInfo.originOperLayer.resourceInfo,
            'url': origLayerInfo.originOperLayer.url
          },
          'disableGeometryUpdate': !allowGeometryUpdates,
          'allowUpdateOnly': !allowsCreate,
          'allowDelete': false,
          'fieldInfos': this._getSimpleFieldInfos(layerObject),
          '_editFlag': editable
        };
        return layerInfo;
      },

      _setLayersTable: function (layerInfos) {
        var nl = null;
        array.forEach(layerInfos, function (layerInfo) {
          var _jimuLayerInfo = this._jimuLayerInfos.getLayerInfoById(layerInfo.featureLayer.id);
          var addRowResult = this._layersTable.addRow({
            label: _jimuLayerInfo.title,
            edit: layerInfo._editFlag,
            allowUpdateOnly: layerInfo.allowUpdateOnly,
            allowUpdateOnlyHidden: layerInfo.allowUpdateOnly === null ?
              false : layerInfo.allowUpdateOnly,
            allowDelete: layerInfo.allowDelete,
            allowDeleteHidden: layerInfo.allowDelete === null ?
              false : layerInfo.allowDelete,
            disableGeometryUpdate: layerInfo.disableGeometryUpdate,
            disableGeometryUpdateHidden: layerInfo.disableGeometryUpdate === null ?
              false : layerInfo.disableGeometryUpdate
          });
          addRowResult.tr._layerInfo = layerInfo;

          if (layerInfo.featureLayer.layerAllowsDelete === false) {
            nl = query(".allowDelete", addRowResult.tr);
            nl.forEach(function (node) {

              var widget = registry.getEnclosingWidget(node.childNodes[0]);

              widget.setStatus(false);
            });
          }
          if (layerInfo.featureLayer.layerAllowsCreate === false) {
            nl = query(".allowUpdateOnly", addRowResult.tr);
            nl.forEach(function (node) {

              var widget = registry.getEnclosingWidget(node.childNodes[0]);

              widget.setStatus(false);
            });
          }
          if (layerInfo.featureLayer.layerAllowsUpdate === false) {
            nl = query(".allowUpdateOnly", addRowResult.tr);
            nl.forEach(function (node) {

              var widget = registry.getEnclosingWidget(node.childNodes[0]);

              widget.setStatus(false);
            });
          }
          if (layerInfo.featureLayer.layerAllowGeometryUpdates === false) {
            nl = query(".disableGeometryUpdate", addRowResult.tr);
            nl.forEach(function (node) {

              var widget = registry.getEnclosingWidget(node.childNodes[0]);

              widget.setStatus(false);
            });
          }
        }, this);
      },

      // about fieldInfos methods.
      _getDefaultSimpleFieldInfos: function (layerObject) {
        var fieldInfos = [];
        var fldInfo = null;
        var webmapFieldInfos =
         editUtils.getFieldInfosFromWebmap(layerObject, this._jimuLayerInfos);

        array.forEach(layerObject.fields, function (field) {
          if (field.editable) {
            var filteredArr = dojo.filter(webmapFieldInfos, function (webmapFieldInfo) {
              return webmapFieldInfo.fieldName === field.name;
            });

            fldInfo = lang.clone(field);
            if (fldInfo.hasOwnProperty('alias')) {
              fldInfo.label = fldInfo.alias;
              delete fldInfo.alias;
            }
            if (fldInfo.hasOwnProperty('domain')) {

              delete fldInfo.domain;
            }
            if (fldInfo.hasOwnProperty('visible')) {

              delete fldInfo.visible;
            }
            if (fldInfo.hasOwnProperty('name')) {
              fldInfo.fieldName = fldInfo.name;
              delete fldInfo.name;
            }
            if (fldInfo.hasOwnProperty('editable')) {
              fldInfo.isEditable = fldInfo.editable;
              delete fldInfo.editable;
            }
            if (filteredArr.length === 1) {
              fieldInfos.push(lang.mixin(
                fldInfo,
                filteredArr[0])
                );
            }
            else {
              fieldInfos.push(fldInfo);
            }
          }
        });
        return fieldInfos;
      },

      _getWebmapSimpleFieldInfos: function (layerObject) {
        var webmapSimpleFieldInfos = [];
        var webmapFieldInfos =
          editUtils.getFieldInfosFromWebmap(layerObject, this._jimuLayerInfos);
        if (webmapFieldInfos) {
          array.forEach(webmapFieldInfos, function (webmapFieldInfo) {
            if (webmapFieldInfo.isEditable) {
              webmapSimpleFieldInfos.push({
                fieldName: webmapFieldInfo.fieldName,
                label: webmapFieldInfo.label,
                isEditable: webmapFieldInfo.isEditable
              });
            }
          });
          if (webmapSimpleFieldInfos.length === 0) {
            webmapSimpleFieldInfos = null;
          }
        } else {
          webmapSimpleFieldInfos = null;
        }
        return webmapSimpleFieldInfos;
      },
      _merge: function () {
        var obj = {},
            i = 0,
            il = arguments.length,
            key;
        for (; i < il; i++) {
          for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
              obj[key] = arguments[i][key];
            }
          }
        }
        return obj;
      },
      _getSimpleFieldInfos: function (layerObject, layerInfo) {
        var simpleFieldInfos = [];
        var baseSimpleFieldInfos = this._getDefaultSimpleFieldInfos(layerObject);

        if (layerInfo && layerInfo.fieldInfos) {
          // Edit widget had been configured
          // keep order of config fieldInfos and add new fieldInfos at end.
          array.forEach(baseSimpleFieldInfos, function (baseSimpleFieldInfo) {
            var found = array.some(layerInfo.fieldInfos, function (configuredFieldInfo) {
              if (configuredFieldInfo.fieldName === baseSimpleFieldInfo.fieldName) {
                simpleFieldInfos.push(this._merge(baseSimpleFieldInfo, configuredFieldInfo));
                return true;
              }
            }, this);
            if (found === false) {
              baseSimpleFieldInfo.canPresetValue = false;

              simpleFieldInfos.push(baseSimpleFieldInfo);
            }

          }, this);
        } else {
          simpleFieldInfos = baseSimpleFieldInfos;
        }
        return simpleFieldInfos;
      },
      _onDescriptionClick: function (tr) {
        var rowData = this._layersTable.getRowData(tr);
        if (rowData && rowData.edit) {
          this._editDescriptions = new EditDescription({
            nls: this.nls,
            _layerInfo: tr._layerInfo,
            _layerName: rowData.label
          });
          this._editDescriptions.popupEditDescription();
        }
      },
      _onEditFieldInfoClick: function (tr) {
        var rowData = this._layersTable.getRowData(tr);
        if (rowData && rowData.edit) {
          this._editFields = new EditFields({
            nls: this.nls,
            _layerInfo: tr._layerInfo,
            _layerName: rowData.label
          });
          this._editFields.popupEditPage();
        }
        else {
          new Message({
            message: this.nls.layersPage.editFieldError
          });
        }
      },

      _getText: function () {
        var editorText;
        editorText = this._editorObj.focusNode.innerHTML;
        return editorText;
      },
      _initEditor: function () {

        if (!this._editorObj) {
          this._initEditorPluginsCSS();
          this._editorObj = new Editor({
            plugins: [
              'bold', 'italic', 'underline', 'foreColor', 'hiliteColor',
              '|', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
              '|', 'insertOrderedList', 'insertUnorderedList', 'indent', 'outdent'
            ],
            extraPlugins: [
              '|', 'createLink', 'unlink', 'pastefromword', '|', 'undo', 'redo',
              '|', 'toolbarlinebreak',//'chooseImage', 'uploadImage',
              'fontName', 'fontSize', 'formatBlock'
            ]
          }, this.editorDescription);
          domStyle.set(this._editorObj.domNode, {
            "width": '100%',
            "height": '100%'
          });

          if (this.config.editor.editDescription === undefined || this.config.editor.editDescription === null) {
            this._editorObj.set("value", this.nls.layersPage.title);
          }
          else {
            this._editorObj.set("value", this.config.editor.editDescription);
          }
          this._editorObj.startup();
          if (has('ie') !== 8) {
            this._editorObj.resize({
              w: '100%',
              h: '100%'
            });
          } else {
            var box = html.getMarginBox(this.editorDescription);
            this._editorObj.resize({
              w: box.w,
              h: box.h
            });
          }
        }
      },
      /**
   * this function loads the editor tool plugins CSS
   * @memberOf widgets/RelatedTableCharts/setting/ChartSetting
   **/
      _initEditorPluginsCSS: function () {
        var head, tcCssHref, tcCss, epCssHref, epCss, pfCssHref, pfCss;
        head = document.getElementsByTagName('head')[0];
        tcCssHref = window.apiUrl + "dojox/editor/plugins/resources/css/TextColor.css";
        tcCss = query('link[href="' + tcCssHref + '"]', head)[0];
        if (!tcCss) {
          utils.loadStyleLink("editor_plugins_resources_TextColor", tcCssHref);
        }
        epCssHref = window.apiUrl + "dojox/editor/plugins/resources/editorPlugins.css";
        epCss = query('link[href="' + epCssHref + '"]', head)[0];
        if (!epCss) {
          utils.loadStyleLink("editor_plugins_resources_editorPlugins", epCssHref);
        }
        pfCssHref = window.apiUrl + "dojox/editor/plugins/resources/css/PasteFromWord.css";
        pfCss = query('link[href="' + pfCssHref + '"]', head)[0];
        if (!pfCss) {
          utils.loadStyleLink("editor_plugins_resources_PasteFromWord", pfCssHref);
        }
      },

      _resetSettingsConfig: function () {

        this.config.editor.displayPromptOnSave =
          this.displayPromptOnSave.checked === undefined ?
          false : this.displayPromptOnSave.checked;
        this.config.editor.displayPromptOnDelete =
          this.displayPromptOnDelete.checked === undefined ?
          false : this.displayPromptOnDelete.checked;
        this.config.editor.removeOnSave =
          this.removeOnSave.checked === undefined ?
          false : this.removeOnSave.checked;
        this.config.editor.useFilterEditor =
          this.useFilterEditor.checked === undefined ?
          false : this.useFilterEditor.checked;
      },

      getConfig: function () {

        this._resetSettingsConfig();
        this.config.editor.editDescription = this._getText();
        // get layerInfos config
        var checkedLayerInfos = [];
        var layersTableData = this._layersTable.getData();
        array.forEach(this._editableLayerInfos, function (layerInfo, index) {
          layerInfo._editFlag = layersTableData[index].edit;
          layerInfo.allowUpdateOnly = (layersTableData[index].allowUpdateOnly === null ?
            layersTableData[index].allowUpdateOnlyHidden : layersTableData[index].allowUpdateOnly);
          layerInfo.allowDelete = (layersTableData[index].allowDelete === null ?
            layersTableData[index].allowDeleteHidden : layersTableData[index].allowDelete);
          layerInfo.disableGeometryUpdate = (layersTableData[index].disableGeometryUpdate === null ?
            layersTableData[index].disableGeometryUpdateHidden :
            layersTableData[index].disableGeometryUpdate);
          if (layerInfo._editFlag) {
            delete layerInfo._editFlag;
            delete layerInfo.mapLayer;
            checkedLayerInfos.push(layerInfo);
          }

          layerInfo.fieldInfos = this._resetFieldInfos(layerInfo.fieldInfos);
        }, this);

        if (checkedLayerInfos.length === 0) {
          return false;
        } else {
          this.config.editor.layerInfos = checkedLayerInfos;
        }

        return this.config;
      },
      _resetFieldInfos: function (fieldInfos) {
        return array.map(fieldInfos, function (fieldInfo) {
          var fldInfo = {};
          fldInfo.fieldName = fieldInfo.fieldName === undefined ? '' : fieldInfo.fieldName;
          fldInfo.canPresetValue = fieldInfo.canPresetValue === undefined ? false : fieldInfo.canPresetValue;
          fldInfo.isEditable = fieldInfo.isEditable === undefined ? true : fieldInfo.isEditable;
          fldInfo.visible = fieldInfo.visible === undefined ? true : fieldInfo.visible;
          return fldInfo;
        });
      }
    });
  });