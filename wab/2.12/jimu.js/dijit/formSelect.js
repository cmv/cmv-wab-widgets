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
  'dojo/_base/declare',
  'dojo/_base/html',
  'dojo/dom-construct',
  'dijit/form/Select'
], function (declare, html, domConstruct, Select) {
  return declare([Select], {
    //Use 'caption' element to provide an accessible name for a data table.
    //Use 'aria-label' attribute to provide an accessible name for a data table (NOTE: inconsistent browser/AT support).
    //Use 'aria-labelledby' attribute to provide an accessible name for a data table (NOTE: inconsistent browser/AT support).
    postCreate: function () {
      this.inherited(arguments);
      var a11yLabel = this['aria-labelledby'] || this['aria-label'];
      if(a11yLabel){
        var captionStr = '<caption class="screen-readers-only-no-position">' + a11yLabel + '</caption>';
        var captionNode = html.toDom(captionStr);
        domConstruct.place(captionNode, this.domNode, 'first');
      }

    }
  });
});