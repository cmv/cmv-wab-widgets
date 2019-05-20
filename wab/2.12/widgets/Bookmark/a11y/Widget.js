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
  //'dojo/_base/lang',
  //'dojo/on',
  "dojo/query",
  'dojo/_base/array',
  'dojo/_base/html',
  'jimu/utils',
  '../ItemNode'
],
  function (/*lang, on, */query, array, html, jimuUtils, ItemNode) {
    var mo = {};

    mo.a11y_initFocusNodes = function () {
      var nodes = this._getFocusableNodes();

      if (nodes && nodes.length) {
        this._508_FIRST_FOCUS_NODE = nodes[0];
        jimuUtils.initFirstFocusNode(this.domNode, this._508_FIRST_FOCUS_NODE);

        if (nodes.length > 0) {
          jimuUtils.initLastFocusNode(this.domNode, nodes[nodes.length - 1]);
        }
      }
    };

    mo.a11y_focusAfterDelete = function (tarBookmark) {
      if (tarBookmark && tarBookmark.itemNode && tarBookmark.itemNode.domNode) {
        ItemNode.focusItem(tarBookmark);
      } else {
        this._508_FIRST_FOCUS_NODE.focus();
      }
    };

    mo._getFocusableNodes = function () {
      var nodes = query('[tabindex $=\"0\"]', this.domNode);
      nodes = array.filter(nodes, function (node) {
        return !html.hasClass(node, "dijitInputInner") &&
          (html.hasClass(node, "delete-btn") || html.getStyle(node, "display") !== "none");
      }, this);

      return nodes;
    };

    return mo;
  });