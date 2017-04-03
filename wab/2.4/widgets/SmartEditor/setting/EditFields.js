define(
  ["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/on',
    'dojo/query',
    "dojo/text!./EditFields.html",
     "./FieldValidation",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    "jimu/dijit/Popup",
    'esri/lang'
  ],
  function (
    declare,
    lang,
    array,
    on,
    query,
    template,
    FieldValidation,
    _TemplatedMixin,
    BaseWidgetSetting,
    Table,
    Popup,
    esriLang
    ) {
    return declare([BaseWidgetSetting, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-setting-fields",
      templateString: template,
      _configInfo: null,
      _fieldValid: null,
      _fieldValidations: null,
      __layerName: null,
      postCreate: function () {
        this.inherited(arguments);
        this._initFieldsTable();
        this._setFiedsTable(this._configInfo.fieldInfos);
        this._fieldValidations = this._configInfo.fieldValidations === undefined ?
          {} : lang.clone(this._configInfo.fieldValidations);
      },

      popupEditPage: function () {
        var fieldsPopup = new Popup({
          titleLabel: esriLang.substitute(
            { layername: this._layerName },
            this.nls.fieldsPage.title),
          width: 972,
          maxHeight: 700,
          autoHeight: true,
          content: this,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              if (this._validateTable()) {
                this._resetFieldInfos();
                this._configInfo.fieldValidations = this._fieldValidations;
                fieldsPopup.close();
              }
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {
              fieldsPopup.close();
            })
          }],
          onClose: lang.hitch(this, function () {
          })
        });
      },

      _initFieldsTable: function () {
        var fields2 = [
          {
            name: 'required',
            title: "",
            type: 'text',
            'class': 'required'
          },
          {
            name: 'visible',
            title: this.nls.fieldsPage.fieldsSettingsTable.display,
            type: 'checkbox',
            'class': 'visible'
          },
          {
            name: 'isEditable',
            title: this.nls.fieldsPage.fieldsSettingsTable.edit,
            type: 'checkbox',
            'class': 'editable'
          }, {
            name: 'canPresetValue',
            title: this.nls.fieldsPage.fieldsSettingsTable.canPresetValue,
            type: 'checkbox',
            'class': 'preset'
          }, {
            name: 'fieldName',
            title: this.nls.fieldsPage.fieldsSettingsTable.fieldName,
            type: 'text',
            'class': 'fieldName'
          }, {
            name: 'label',
            title: this.nls.fieldsPage.fieldsSettingsTable.fieldAlias,
            type: 'text',
            editable: false,
            'class': 'fieldLabel'
          }, {
            name: 'actions',
            title: this.nls.fieldsPage.fieldsSettingsTable.actions,
            type: 'actions',
            actions: ['up', 'down', 'edit'],
            'class': 'actions'
          }];

        var args2 = {
          fields: fields2,
          selectable: false,
          style: {
            'height': '300px',
            'maxHeight': '300px'
          }
        };
        this._fieldsTable = new Table(args2);
        this._fieldsTable.placeAt(this.fieldsTable);
        this._fieldsTable.startup();
        var nl = query("th.simple-table-field", this._fieldsTable.domNode);
        nl.forEach(function (node) {
          var scrubText = (node.innerText === undefined || node.innerText === "") ?
          "" : node.innerText.replace(/(\r\n|\n|\r)/gm, "");
          switch (scrubText) {
            case this.nls.fieldsPage.fieldsSettingsTable.display:
              node.title = this.nls.fieldsPage.fieldsSettingsTable.displayTip;
              break;
            case this.nls.fieldsPage.fieldsSettingsTable.edit:
              node.title = this.nls.fieldsPage.fieldsSettingsTable.editTip;
              break;
            case this.nls.fieldsPage.fieldsSettingsTable.fieldName:
              node.title = this.nls.fieldsPage.fieldsSettingsTable.fieldNameTip;
              break;
            case this.nls.fieldsPage.fieldsSettingsTable.fieldAlias:
              node.title = this.nls.fieldsPage.fieldsSettingsTable.fieldAliasTip;
              break;
            case this.nls.fieldsPage.fieldsSettingsTable.canPresetValue:
              node.title = this.nls.fieldsPage.fieldsSettingsTable.canPresetValueTip;
              break;
            case this.nls.fieldsPage.fieldsSettingsTable.actions:
              node.title = this.nls.fieldsPage.fieldsSettingsTable.actionsTip;
              break;


          }

        }, this);
        this.own(on(this._fieldsTable,
          'actions-edit',
          lang.hitch(this, this._onEditFieldInfoClick)));
      },
      _validateTable: function () {
        var rows = this._fieldsTable.getRows();

        if (rows.length === 0) { return false; }

        return array.some(rows, function (row) {
          var rowData = this._fieldsTable.getRowData(row);
          return rowData.isEditable;
        }, this);

      },
      _onEditFieldInfoClick: function (tr) {
        var rowData = this._fieldsTable.getRowData(tr);

        //below code disables smart action on GDB required fields

        //if (rowData && rowData.isEditable !== null) {
        ////move code below here if wish to disable smart actions on gDB fields
        //}
        //else {
        //'jimu/dijit/Message'Message
        //  new Message({
        //    message: this.nls.fieldsPage.smartAttSupport
        //  });
        //}
        var layerDefinition = {
          currentVersion: this._configInfo.layerInfo.originOperLayer.resourceInfo.currentVersion,
          fields: lang.clone(this._configInfo.layerInfo.layerObject.fields)
        };
        //below code removes the field from the smart action
        //layerDefinition.fields = array.filter(this._configInfo.mapLayer.resourceInfo.fields, function (field) {
        //  return (field.name !== rowData.fieldName);
        //});

        this._fieldValid = new FieldValidation({
          nls: this.nls,
          _layerDefinition: layerDefinition,
          _url: this._configInfo.layerInfo.layerObject.url,
          _fieldValidations: this._fieldValidations,
          _fieldName: rowData.fieldName,
          _fieldAlias: rowData.label

        });
        this._fieldValid.popupActionsPage();
      },
      _setFiedsTable: function (fieldInfos) {
        array.forEach(fieldInfos, function (fieldInfo) {
          if (fieldInfo.type !== "esriFieldTypeGeometry" &&
              fieldInfo.type !== "esriFieldTypeOID" &&
              fieldInfo.type !== "esriFieldTypeBlob" &&
              fieldInfo.type !== "esriFieldTypeGlobalID" &&
              fieldInfo.type !== "esriFieldTypeRaster" &&
              fieldInfo.type !== "esriFieldTypeXML") {
            var newRow = {
              fieldName: fieldInfo.fieldName,
              isEditable: fieldInfo.isEditable,
              canPresetValue: fieldInfo.canPresetValue,
              label: fieldInfo.label,
              visible: fieldInfo.visible
            };
            if (fieldInfo.hasOwnProperty('nullable') && fieldInfo.nullable === false) {
              newRow.required = "*";
            }
            else {
              newRow.required = "";
            }
            this._fieldsTable.addRow(newRow);
          }

          //var addRowResult =
          //if (fieldInfo.hasOwnProperty('nullable') && fieldInfo.nullable === false) {
          //  var nl = query(".editable", addRowResult.tr);
          //  nl.forEach(function (node) {

          //    var widget = registry.getEnclosingWidget(node.childNodes[0]);
          //    widget.setStatus(false);

          //  });
          //}
        }, this);
        setTimeout(lang.hitch(this, function () {
          array.forEach(this._fieldsTable.fields, function (field) {
            if (field.name === 'visible') {
              field.onChange = lang.hitch(this, this._onDisplayFieldChanged);
            } else if (field.name === 'isEditable') {
              field.onChange = lang.hitch(this, this._onIsEditableFieldChanged);
            }
          }, this);
        }), 300);
      },
      _onDisplayFieldChanged: function (tr) {
        var rowData = this._fieldsTable.getRowData(tr);
        var display = rowData.visible;
        if (!display && rowData.isEditable) {
          rowData.isEditable = false;
          this._fieldsTable.editRow(tr, rowData);
        }
      },

      _onIsEditableFieldChanged: function (tr) {
        var rowData = this._fieldsTable.getRowData(tr);
        var isEditable = rowData.isEditable;
        if (isEditable && !rowData.visible) {
          rowData.visible = true;
          this._fieldsTable.editRow(tr, rowData);
        }
      },
      _resetFieldInfos: function () {
        var newFieldInfos = [];
        var fieldsTableData = this._fieldsTable.getData();
        array.forEach(fieldsTableData, function (fieldData) {
          newFieldInfos.push({
            "fieldName": fieldData.fieldName,
            "label": fieldData.label,
            "canPresetValue": fieldData.canPresetValue,
            "isEditable": fieldData.isEditable === null ? true : fieldData.isEditable,
            "visible": fieldData.visible === null ? true : fieldData.visible
          });
        });

        this._configInfo.fieldInfos = newFieldInfos;
      }

    });
  });