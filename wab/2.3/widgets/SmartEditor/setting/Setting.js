///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
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
    './ChooseImage',
    'jimu/dijit/EditorTextColor',
    'jimu/dijit/EditorBackgroundColor'
],
  function (
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
      _configInfos: null,
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
        this._configInfos = null;
        delete this._configInfos;
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
          var scrubText = (node.innerText === undefined || node.innerText === "") ?
            "" : node.innerText.replace(/(\r\n|\n|\r)/gm, "");
          switch (scrubText) {
            case this.nls.layersPage.layerSettingsTable.edit:
              node.title = this.nls.layersPage.layerSettingsTable.editTip;
              node.alt = this.nls.layersPage.layerSettingsTable.editTip;
              break;
            case this.nls.layersPage.layerSettingsTable.label:
              node.title = this.nls.layersPage.layerSettingsTable.labelTip;
              node.alt = this.nls.layersPage.layerSettingsTable.labelTip;
              break;
            case this.nls.layersPage.layerSettingsTable.allowUpdateOnly:
              node.title = this.nls.layersPage.layerSettingsTable.allowUpdateOnlyTip;
              node.alt = this.nls.layersPage.layerSettingsTable.allowUpdateOnlyTip;
              break;
            case this.nls.layersPage.layerSettingsTable.allowDelete:
              node.title = this.nls.layersPage.layerSettingsTable.allowDeleteTip;
              node.alt = this.nls.layersPage.layerSettingsTable.allowDeleteTip;
              break;
            case this.nls.layersPage.layerSettingsTable.update:
              node.title = this.nls.layersPage.layerSettingsTable.updateTip;
              node.alt = this.nls.layersPage.layerSettingsTable.updateTip;
              break;
            case this.nls.layersPage.layerSettingsTable.description:
              node.title = this.nls.layersPage.layerSettingsTable.descriptionTip;
              node.alt = this.nls.layersPage.layerSettingsTable.descriptionTip;
              break;
            case this.nls.layersPage.layerSettingsTable.fields:
              node.title = this.nls.layersPage.layerSettingsTable.fieldsTip;
              node.alt = this.nls.layersPage.layerSettingsTable.fieldsTip;
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
        if (this.config.editor.hasOwnProperty("listenToGF")) {
          this.listenToGF.set('checked', this.config.editor.listenToGF);
        }
        else {
          this.listenToGF.set('checked', false);
        }
        if (this.config.editor.hasOwnProperty("keepTemplateSelected")) {
          this.keepTemplateSelected.set('checked', this.config.editor.keepTemplateSelected);
        }
        else {
          this.keepTemplateSelected.set('checked', false);
        }
        //this.clearSelectionOnClose.set('checked', false);
      },

      setConfig: function () {
        this._configInfos = editUtils.getConfigInfos(this._jimuLayerInfos,
          this.config.editor.layerInfos, true, false);
        if (this.config.editor.layerInfos) {
          if (this.config.editor.layerInfos.length === 0) {
            array.forEach(this._configInfos, function (configInfo) {
              configInfo._editFlag = true;
            });
          }
        }
        this._setLayersTable();
      },
      _setLayersTable: function () {
        var nl = null;
        array.forEach(this._configInfos, function (configInfo) {

          var addRowResult = this._layersTable.addRow({
            label: configInfo.layerInfo.title,
            edit: configInfo._editFlag,
            allowUpdateOnly: configInfo.allowUpdateOnly,
            allowUpdateOnlyHidden: configInfo.allowUpdateOnly === null ?
              false : configInfo.allowUpdateOnly,
            allowDelete: configInfo.allowDelete,
            allowDeleteHidden: configInfo.allowDelete === null ?
              false : configInfo.allowDelete,
            disableGeometryUpdate: configInfo.disableGeometryUpdate,
            disableGeometryUpdateHidden: configInfo.disableGeometryUpdate === null ?
              false : configInfo.disableGeometryUpdate
          });
          addRowResult.tr._configInfo = configInfo;
          if (configInfo.featureLayer.layerAllowsDelete === false) {
            nl = query(".allowDelete", addRowResult.tr);
            nl.forEach(function (node) {

              var widget = registry.getEnclosingWidget(node.childNodes[0]);

              widget.setStatus(false);
            });
          }
          if (configInfo.featureLayer.layerAllowsCreate === false) {
            nl = query(".allowUpdateOnly", addRowResult.tr);
            nl.forEach(function (node) {

              var widget = registry.getEnclosingWidget(node.childNodes[0]);

              widget.setStatus(false);
            });
          }
          if (configInfo.featureLayer.layerAllowsUpdate === false) {
            nl = query(".allowUpdateOnly", addRowResult.tr);
            nl.forEach(function (node) {

              var widget = registry.getEnclosingWidget(node.childNodes[0]);

              widget.setStatus(false);
            });

          }
          if (configInfo.featureLayer.layerAllowGeometryUpdates === false) {
            nl = query(".disableGeometryUpdate", addRowResult.tr);
            nl.forEach(function (node) {

              var widget = registry.getEnclosingWidget(node.childNodes[0]);

              widget.setStatus(false);
            });
          }

        }, this);
      },

      _onDescriptionClick: function (tr) {
        var rowData = this._layersTable.getRowData(tr);
        if (rowData && rowData.edit) {
          this._editDescriptions = new EditDescription({
            nls: this.nls,
            _configInfo: tr._configInfo,
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
            _configInfo: tr._configInfo,
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
              'bold', 'italic', 'underline',
              utils.getEditorTextColor("smartEditor"), utils.getEditorBackgroundColor("smartEditor"),
              '|', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
              '|', 'insertOrderedList', 'insertUnorderedList', 'indent', 'outdent'
            ],
            extraPlugins: [
              '|', 'createLink', 'unlink', 'pastefromword', '|', 'undo', 'redo',
              '|', 'toolbarlinebreak',//'chooseImage', 'uploadImage',
              {
                name: "dijit._editor.plugins.FontChoice",
                command: "fontName",
                custom: "Arial;Comic Sans MS;Courier New;Garamond;Tahoma;Times New Roman;Verdana".split(";")
              }, 'fontSize', 'formatBlock'
            ],
            style: "font-family:Verdana;"
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

        this.config.editor.listenToGF =
          this.listenToGF.checked === undefined ?
          false : this.listenToGF.checked;

        this.config.editor.keepTemplateSelected =
          this.keepTemplateSelected.checked === undefined ?
          false : this.keepTemplateSelected.checked;
      },

      getConfig: function () {

        this._resetSettingsConfig();
        this.config.editor.editDescription = this._getText();
        // get layerInfos config
        var checkedLayerInfos = [];
        var layersTableData = this._layersTable.getData();
        array.forEach(this._configInfos, function (configInfo, index) {
          if (configInfo.hasOwnProperty("featureLayer")) {
            if (configInfo.featureLayer.hasOwnProperty("layerAllowsCreate")) {
              delete configInfo.featureLayer.layerAllowsCreate;
            }
            if (configInfo.featureLayer.hasOwnProperty("layerAllowsUpdate")) {
              delete configInfo.featureLayer.layerAllowsUpdate;
            }
            if (configInfo.featureLayer.hasOwnProperty("layerAllowsDelete")) {
              delete configInfo.featureLayer.layerAllowsDelete;
            }
            if (configInfo.featureLayer.hasOwnProperty("layerAllowGeometryUpdates")) {
              delete configInfo.featureLayer.layerAllowGeometryUpdates;
            }
          }
          configInfo._editFlag = layersTableData[index].edit;
          configInfo.allowUpdateOnly = (layersTableData[index].allowUpdateOnly === null ?
            layersTableData[index].allowUpdateOnlyHidden : layersTableData[index].allowUpdateOnly);
          configInfo.allowDelete = (layersTableData[index].allowDelete === null ?
            layersTableData[index].allowDeleteHidden : layersTableData[index].allowDelete);
          configInfo.disableGeometryUpdate = (layersTableData[index].disableGeometryUpdate === null ?
            layersTableData[index].disableGeometryUpdateHidden :
            layersTableData[index].disableGeometryUpdate);
          configInfo.fieldInfos = this._resetFieldInfos(configInfo.fieldInfos);
          if (configInfo.hasOwnProperty("fieldValidations")) {
            for (var k in configInfo.fieldValidations) {
              if (configInfo.fieldValidations.hasOwnProperty(k)) {
                array.forEach(configInfo.fieldValidations[k], function (fieldValidation) {
                  if (fieldValidation.hasOwnProperty("expression")) {
                    delete fieldValidation.expression;
                  }
                });

              }
            }
          }
          if (configInfo.layerInfo) {
            delete configInfo.layerInfo;
          }
          if (configInfo._editFlag) {
            delete configInfo._editFlag;
            checkedLayerInfos.push(configInfo);
          }
        }, this);
        if (checkedLayerInfos.length === 0) {
          new Message({
            message: this.nls.layersPage.noConfigedLayersError
          });
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