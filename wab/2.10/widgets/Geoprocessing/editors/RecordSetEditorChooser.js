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

define(['dojo/_base/declare',
  'dojo/_base/html',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/text!./RecordSetEditorChooser.html',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  '../BaseEditor',
  './simpleEditors',
  'dojo/i18n!../nls/strings',
  'dijit/form/RadioButton'
],
function(declare, html, lang, on, template, _TemplatedMixin, _WidgetsInTemplateMixin,
  BaseEditor, simpleEditors, gpNls) {
  return declare([BaseEditor, _TemplatedMixin, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-gp-editor-base jimu-gp-editor-rsec',
    templateString: template,
    editorName: 'RecordSetEditorChooser',

    postMixInProperties: function(){
      this.inherited(arguments);
      lang.mixin(this.nls, gpNls);
    },

    postCreate: function(){
      this.inherited(arguments);
      this.value = {};

      if(this.param.recordSetMode){
        html.setAttr(this[this.param.recordSetMode + 'Mode'], 'checked', true);
        on.emit(this[this.param.recordSetMode + 'Mode'], 'click', {
          cancelable: true,
          bubble: true
        });
      }

      this.editor = new simpleEditors.SimpleJsonEditor({
        value: this.param.defaultValue,
        nls: this.nls
      });
      this.editor.placeAt(this.jsonEditorDiv);
    },

    getValue: function(){
      if (this.value.recordSetMode === 'json') {
        this.value.defaultValue = this.editor.getValue();
      }
      return this.value;
    },

    _onJSONModeSelect: function(){
      this.value.recordSetMode = 'json';
      html.setStyle(this.defaultJSONDiv, 'display', 'block');
    },

    _onTableModeSelect: function(){
      this.value.recordSetMode = 'table';
      html.setStyle(this.defaultJSONDiv, 'display', 'none');
    }
  });
});
