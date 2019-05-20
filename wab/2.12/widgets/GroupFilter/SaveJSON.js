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
define([
  'dojo/Evented',
  'dojo/_base/declare',
  'dojo/Deferred',
  'dojo/_base/html',
  'dojo/has',
  'jimu/utils'
],
function (Evented, declare, Deferred, html, has, jimuUtils) {
return declare([Evented], {
  declaredClass : 'saveJSON',
  config : null,

  constructor: function(/*Object*/args) {
    declare.safeMixin(this, args);
  },

  _getDownloadUrl: function(text) {
    if (window.Blob && window.URL && window.URL.createObjectURL) {
      var jsonData = new Blob([text], { type: 'text/json' });
      return URL.createObjectURL(jsonData);
    } else {
      return 'data:attachment/json;charset=utf-8,' + encodeURIComponent(text);
    }
  },

  exportsJson: function(filename, json) {
    var jsonText = JSON.stringify(json);
    var def = new Deferred();
    try {
      if (has('ie') && has('ie') < 10) {
        // has module unable identify ie11 and Edge
        var oWin = window.top.open("about:blank", "_blank");
        oWin.document.write('sep=,\r\n' + jsonText);
        oWin.document.close();
        oWin.document.execCommand('SaveAs', true, filename);
        oWin.close();
        this.savePrompt();
      }else if (has("ie") === 10 || this._isIE11() || this._isEdge()) {
        var jsonData = new Blob([jsonText], { type: 'text/json' });
        navigator.msSaveBlob(jsonData, filename);
        this.savePrompt();
      } else {
        var link = html.create("a", {
          href: this._getDownloadUrl(jsonText),
          target: '_blank',
          download: filename
        }, document.body);
        if (has('safari')) {
          // # First create an event
          var click_ev = document.createEvent("MouseEvents");
          // # initialize the event
          click_ev.initEvent("click", true /* bubble */ , true /* cancelable */ );
          // # trigger the evevnt/
          link.dispatchEvent(click_ev);
          this.savePrompt();
        } else {
          link.click();
          this.savePrompt();
        }

        html.destroy(link);
      }
      def.resolve();
    } catch(e) {
      def.reject(e);
    }
    return def;
  },

  _isIE11: function() {
    return jimuUtils.has('ie') === 11;
  },

  _isEdge: function() {
    return jimuUtils.has('edge');
  },

  savePrompt: function() {
    this.emit("complete", {});
  }

});
});