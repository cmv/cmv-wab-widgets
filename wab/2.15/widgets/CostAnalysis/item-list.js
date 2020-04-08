///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'dojo/Evented',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./item-list.html',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/dom-attr',
  'dojo/dom-class',
  'dojo/dom-style',
  'dojo/on',
  'dojo/query',
  'dojo/dom-construct',
  'dojo/keys',
  "dojo/_base/event"
], function (
  declare,
  BaseWidget,
  Evented,
  _WidgetsInTemplateMixin,
  template,
  array,
  lang,
  domAttr,
  domClass,
  domStyle,
  on,
  query,
  domConstruct,
  keys,
  Event
) {
  return declare([BaseWidget, Evented, _WidgetsInTemplateMixin], {
    templateString: template,
    baseClass: 'jimu-widget-cost-analysis-item-list',

    //Properties
    highlighterColor: "#000",
    currentActivePanel: null, //Current open panel
    postCreate: function () {
      this.inherited(arguments);
      //Initialize array's and object
    },

    startup: function () {
      this.inherited(arguments);
      if (this.itemList && this.itemList.length > 0) {
        setTimeout(lang.hitch(this, function () {
          this._loadItemList();
          this._handleTabIndexesOfItems();
        }), 0);
      }
    },

    /**
     * This function is used to handle tab index of panel dom
     */
    _handleTabIndexesOfItems: function () {
      this.emit("OnOpenCreatePanel");
      this.emit("OnCloseLoadPanel");
      this.emit("OnCloseUpdateCostEquationPanel");
    },

    /**
    * Create item list based on the data
    * @memberOf widgets/CostAnalysis/item-list
    */
    _loadItemList: function () {
      array.forEach(this.itemList, lang.hitch(this, function (item) {
        this.addItem(item);
      }));
    },

    /**
    * The function will add new item to item list as per the data
    * @memberOf widgets/CostAnalysis/item-list
    */
    addItem: function (item) {
      var itemHighlighter, itemTitle, itemContent, itemTitleContainer,
        itemContainer;
      item.content = item.content || "";
      itemContainer = domConstruct.create("div", {}, null);
      itemTitleContainer = domConstruct.create("div", {
        "class": "esriCTItemTitleContainer",
        "tabindex": "0",
        "aria-label": item.title,
        "role": "button"
      }, itemContainer);
      domClass.add(itemTitleContainer, "esriCTProjectOveriew");
      //Item highlighter
      itemHighlighter = domConstruct.create("div", {
        "class": "esriCTItemHighlighter"
      }, itemTitleContainer);
      //create esriCTItemTitle
      itemTitle = domConstruct.create("div", {
        "class": "esriCTItemTitle esriCTEllipsis",
        "innerHTML": item.title,
        "title": item.title,
        "paneName": item.paneName
      }, itemTitleContainer);
      if (item.hasOwnProperty('updateCostEquationWidget')) {
        domAttr.set(itemTitle, 'updateCostEquationWidget', true);
      }
      if (item.hasOwnProperty('loadProjectTab')) {
        domAttr.set(itemTitle, 'loadProjectTab', true);
      }
      if (item.hasOwnProperty('createProjectTab')) {
        domAttr.set(itemTitle, 'createProjectTab', true);
      }
      //create node for adding item content
      itemContent = domConstruct.create("div", {
        "class": "esriCTItemContent"
      }, itemContainer);
      //add content based on content type ("string" or "object")
      if (typeof (item.content) === "string") {
        domAttr.set(itemContent, "innerHTML", item.content);
      } else {
        domConstruct.place(item.content, itemContent);
      }
      this.itemListContainer.appendChild(itemContainer);
      this.own(on(itemTitleContainer, "click", lang.hitch(this, function (evt) {
        this._itemTitleContainerClicked(evt);
      })));
      this.own(on(itemTitleContainer, "keydown", lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this._itemTitleContainerClicked(evt);
        }
      })));
      // If item needs to be opened on load check for isOpen property
      if (item.isOpen) {
        setTimeout(lang.hitch(this, function () {
          itemTitleContainer.click();
        }), 100);
      }
    },

    /**
    * To handle click of item title container
    * @memberOf widgets/CostAnalysis/item-list
    */
    _itemTitleContainerClicked: function (evt) {
      this._togglePanel(evt.currentTarget.parentElement);
      var isLoadProjectTabClicked = evt.currentTarget.children.length ?
        domAttr.get(evt.currentTarget.children[1], 'loadProjectTab') : null;
      if (isLoadProjectTabClicked) {
        this.emit("resetLoadProjectNameDropdown");
        if (evt.currentTarget.children.length &&
          domClass.contains(evt.currentTarget.children[1], "esriCTItemTitleActive")) {
          domAttr.set(evt.currentTarget, "aria-expanded", "true");
          this.emit("OnCloseCreatePanel");
          this.emit("OnOpenLoadPanel");
        }
        else {
          domAttr.set(evt.currentTarget, "aria-expanded", "false");
          this.emit("OnCloseLoadPanel");
        }
      }
      var isUpdateCostEquationTabClicked = evt.currentTarget.children.length ?
        domAttr.get(evt.currentTarget.children[1], 'updateCostEquationWidget') : null;
      if (isUpdateCostEquationTabClicked) {
        this.emit("refreshUpdateCostEquationWidget");
        if (evt.currentTarget.children.length &&
          domClass.contains(evt.currentTarget.children[1], "esriCTItemTitleActive")) {
          this.emit("OnCloseCreatePanel");
          this.emit("OnCloseLoadPanel");
          domAttr.set(evt.currentTarget, "aria-expanded", "true");
        }
        else {
          domAttr.set(evt.currentTarget, "aria-expanded", "false");
        }
      }
      var isCreateProjectTabClicked = evt.currentTarget.children.length ?
        domAttr.get(evt.currentTarget.children[1], 'createProjectTab') : null;
      if (isCreateProjectTabClicked) {
        if (evt.currentTarget.children.length &&
          domClass.contains(evt.currentTarget.children[1], "esriCTItemTitleActive")) {
          this.emit("OnOpenCreatePanel");
          this.emit("OnCloseLoadPanel");
          domAttr.set(evt.currentTarget, "aria-expanded", "true");
        }
        else {
          this.emit("OnCloseCreatePanel");
          domAttr.set(evt.currentTarget, "aria-expanded", "false");
        }
      }
    },

    /**
    * Create item list based on the data passed
    * @memberOf widgets/CostAnalysis/item-list
    */
    _togglePanel: function (node, isManual) {
      var title, panel, bufferHeight = 0, itemHighlighter;
      if (!isManual) {
        bufferHeight = 30;
      }
      title = query(".esriCTItemTitle", node)[0];
      panel = query(".esriCTItemContent", node)[0];
      itemHighlighter = query(".esriCTItemHighlighter", node)[0];
      domClass.toggle(title, "esriCTItemTitleActive");
      domClass.toggle(panel, "esriCTItemContentActive");
      if (domClass.contains(panel, "esriCTItemContentActive")) {
        panel.style.height = panel.scrollHeight + bufferHeight + "px";
        if (this.currentActivePanel && !this.openMultiple) {
          this._togglePanel(this.currentActivePanel, true);
        }
        this.currentActivePanel = node;
        domStyle.set(itemHighlighter, "backgroundColor", this.highlighterColor);
      } else {
        panel.style.height = 0;
        domStyle.set(itemHighlighter, "backgroundColor", "transparent");
        if (domAttr.get(this.currentActivePanel, "index") === domAttr.get(node, "index")) {
          this.currentActivePanel = null;
        }
      }
    }
  });
});