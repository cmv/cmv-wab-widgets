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
  "dojo/_base/declare",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetBase",

  "esri/dijit/geoenrichment/_WizardPage",

  "dojo/text!./ErrorPage.html"

],
function (declare, _TemplatedMixin, _WidgetBase, _WizardPage, template) {
  return declare([_WidgetBase, _TemplatedMixin, _WizardPage], {

    templateString: template,

    postCreate: function () {
      this.inherited(arguments);
      var errors = this.displayErrors;

      if (errors.gePrivilege) {
        //using innerHTML since nls string contains an <a> tag
        this.noPermissionsErrorDiv.innerHTML = this.nls.noPermissions;
      } else {
        this.noPermissionsErrorDiv.parentNode.removeChild(this.noPermissionsErrorDiv);
      }

      if (errors.geServiceNotConfigured || errors.dirRoutingServiceNotConfigured) {
        var msg;
        if (errors.geServiceNotConfigured) {
          if (errors.dirRoutingServiceNotConfigured) {
            msg = this.nls.geAndDirRoutingServicesNotConfigured;
          } else {
            msg = this.nls.geServiceNotConfigured;
          }
        } else {
          msg = this.nls.dirRoutingServiceNotConfigured;
        }
        //using innerHTML since nls string contains <a> tags
        this.servicesErrorDiv.innerHTML = msg;
      } else {
        this.servicesErrorDiv.parentNode.removeChild(this.servicesErrorDiv);
      }
    },

    startup: function () {
      this.inherited(arguments);

      if (this._started) {
        return;
      }
    }
  });
});
