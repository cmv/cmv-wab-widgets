define(
[
    "dojo",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    'dojo/dom-construct',
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./AttachmentUploader.html",
    'dojo/i18n!esri/nls/jsapi'

], function (
    dojo,
    declare,
    lang,
    on,
    domConstruct,
    _WidgetBase,
    _TemplatedMixin,
    widgetTemplate,
    esriBundle

) {
  return declare([_WidgetBase, _TemplatedMixin], {
    declaredClass: "jimu-widget-smartEditor-attachmentuploader",
    templateString: widgetTemplate,
    widgetsInTemplate: true,
    _inputCount: 0,
    _inputIndex: 1,
    constructor: function () {
      this.nls = lang.mixin(this.nls, esriBundle.widgets.attachmentEditor);
    },
    _fileSelected: function (source) {

      if (source.srcElement.value.length > 0) {
        dojo.style(source.srcElement.parentNode.childNodes[0], "display", "inline-block");


        this._addInput();
      }

    },
    clear: function () {
      if (this._attachmentList !== undefined && this._attachmentList !== null) {
        while (this._attachmentList.firstChild) {
          this._attachmentList.removeChild(this._attachmentList.firstChild);
        }
        this._addInput();
      }
    },
    _deleteAttachment: function (source) {
      source.srcElement.parentNode.parentNode.removeChild(source.srcElement.parentNode);

    },
    _reflect: function (promise) {
      return promise.then(function (v) { return { state: "fulfilled", value: v }; },
                          function (e) { return { state: "rejected", error: e }; });
    },
    _addInput: function () {
      for (var i = 0; i < this._attachmentList.childNodes.length; i++) {
        if (this._attachmentList.childNodes[i].childNodes[this._inputIndex].value) {
          if (this._attachmentList.childNodes[i].childNodes[this._inputIndex].value.length === 0) {
            return;
          }
        } else {
          return;
        }
      }
      var newDelete = domConstruct.create("div", {
        "id": 'delInput' + String(this._inputCount),
        "class": 'deleteAttachment'

      });
      newDelete.innerHTML = 'X';
      dojo.style(newDelete, "display", "none");
      this.own(on(newDelete, "click", lang.hitch(this, this._deleteAttachment)));
      var newForm = domConstruct.create("form", {
        "id": 'formInput' + String(this._inputCount)

      });

      var newInput = domConstruct.create("input", {
        "id": 'fileInput' + String(this._inputCount),
        "type": 'file',
        "class": 'attInput',
        "name": 'attachment'
      });
      newForm.appendChild(newDelete);
      newForm.appendChild(newInput);
      this._attachmentList.appendChild(newForm);

      this.own(on(newInput, "change", lang.hitch(this, this._fileSelected)));
      this._inputCount = this._inputCount + 1;

    },
    startup: function () {
      this._addInput();
    },

    destroy: function () {
      this.inherited(arguments);
    },
    postAttachments: function (featureLayer, oid) {

      if (!featureLayer) {
        return;
      }
      if (featureLayer.declaredClass !== "esri.layers.FeatureLayer" ||
        !featureLayer.getEditCapabilities) {

        return;
      }
      if (!featureLayer.addAttachment) {
        return;
      }

      var defs = [];
      for (var i = 0; i < this._attachmentList.childNodes.length; i++) {
        if (this._attachmentList.childNodes[i].childNodes[this._inputIndex].value.length > 0) {

          //if (defs === null) {
          //  defs = {}
          //}

          defs.push(featureLayer.addAttachment(oid, this._attachmentList.childNodes[i]));
        }
      }
      if (defs.length === 0) {
        return null;
      }
      return defs.map(this._reflect);
    }

  });
});
