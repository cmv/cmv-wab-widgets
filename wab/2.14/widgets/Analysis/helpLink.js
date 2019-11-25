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

define(['dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/dom-attr'
  ], function(declare, _WidgetBase, _TemplatedMixin, domAttr){
  return declare([_WidgetBase, _TemplatedMixin], {
    baseClass: 'jimu-widget-analysis-helpLink',
    templateString: '<a href="#" tabindex="-1">' +
      '<img esriHelpTopic="toolDescription" data-dojo-attach-point="helpIcon"/>' +
    '</a>',

    postCreate: function() {
      this.inherited(arguments);
      domAttr.set(this.helpIcon, 'class', this.iconClassName);
      domAttr.set(this.helpIcon, 'src', this.folderUrl + 'images/helpIcon.png');
      domAttr.set(this.helpIcon, 'title', this.toolLabel);
    }
  });
});
