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
/*global define */
define([
  "dojo/_base/declare",
  "dojo/text!./othersSetting.html",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin"
], function (
  declare,
  othersSetting,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin
) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: othersSetting,
    ImageChooser: null,

    startup: function () {
      this.inherited(arguments);
    },

    postCreate: function () {
      this._createOthersPanel();
    },

    /**
    * This function used to call _createOthersDataPanel which sets the other panel values
    * @memberOf widgets/isolation-trace/settings/othersSetting
    */
    _createOthersPanel: function () {
      this._createOthersDataPanel();
    },

    /**
    * This function returns the highlighter image details for configuration.
    * @memberOf widgets/isolation-trace/settings/othersSetting
    */
    getOthersForm: function () {
      var othersParam;
      othersParam = {
        "displayTextForRunButton": ((this.displayTextforRun && this
            .displayTextforRun.value) ? this.displayTextforRun.value :
          ""),
        "autoZoomAfterTrace": this.autoZoomAfterTrace.getValue()
      };
      return othersParam;
    },

    /**
    * This function is called to display others task details.
    * @memberOf widgets/isolation-trace/settings/othersSetting
    */
    _createOthersDataPanel: function () {
      this.displayTextforRun.set("value", this.displayTextForRunButton);
      if (this.autoZoomAfterTraceCheckedState) {
        //this.autoZoomAfterTrace.checked = this.autoZoomAfterTraceCheckedState;
        //domClass.add(this.autoZoomAfterTrace.checkNode, "checked");
        this.autoZoomAfterTrace.setValue(true);
      } else {
        this.autoZoomAfterTrace.setValue(false);
        //this.autoZoomAfterTrace.checked = this.autoZoomAfterTraceCheckedState;
        //domClass.remove(this.autoZoomAfterTrace.checkNode, "checked");
      }
    }
  });
});