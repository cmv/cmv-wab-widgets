///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
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
    'dojo/_base/lang',
    'dojo/_base/html',
    "dojo/query",
    'dijit/_WidgetBase'
  ],
  function(declare, lang, html, query, _WidgetBase) {

    return declare([_WidgetBase], {
      baseClass: 'jimu-tile-container',

      constructor: function() {
        this.items = [];
        this.hmargin = 15;
        this.vmargin = 15;
        this.itemSize = {
          width: -1,
          height: -1
        };
      },

      startup: function() {
        this.inherited(arguments);
        this.containerDom = this.domNode;

        html.create('div', {
          'src': this.img
        }, this.box);

        this.items.forEach(lang.hitch(this, function(item) {
          this._placeItem(item);
        }));
        this.resize();
      },

      _placeItem: function(item) {
        if (item.domNode) {
          html.place(item.domNode, this.containerDom);
        }
      },

      addItem: function(item) {
        this.items.push(item);
        this._placeItem(item);
        this.resize();
      },

      addItems: function(items) {
        this.items = this.items.concat(items);
        this.items.forEach(lang.hitch(this, function(item) {
          this._placeItem(item);
        }));
        this.resize();
      },

      removeItem: function(itemLabel) {
        var i;
        for (i = 0; i < this.items.length; i++) {
          if (this.items[i].label === itemLabel) {
            if (this.items[i].domNode) {
              this.items[i].destroy();
            } else {
              html.destroy(this.items[i]);
            }
            this.items.splice(i, 1);
            this.resize();
            return;
          }
        }
      },

      empty: function() {
        var i;
        for (i = 0; i < this.items.length; i++) {
          if (this.items[i].domNode) {
            this.items[i].destroy();
          } else {
            html.destroy(this.items[i]);
          }
        }
        this.items = [];
      },

      resize: function() {
        var parentNode = this.containerDom.parentElement || this.containerDom.parentNode;
        var parentSize = html.getMarginBox(parentNode);
        //var itemSize = this.getItemSize();
        //this.setContainerWidth(parentSize, itemSize);
        // this.items.forEach(lang.hitch(this, function(item) {
        //   this.setItemPosition(item, itemSize);
        // }));
        var dartThemeRuler = 280 - 1;
        var foldableThemeRuler = 330;
        var container = this.containerDom;

        if (parentSize.w >= dartThemeRuler && parentSize.w < foldableThemeRuler - 1) {
          this._setNodeWidths(container, 130);
        } else if (Math.abs(parentSize.w - foldableThemeRuler) <= 1) {
          this._setNodeWidths(container, 104);
        } else {
          var box = html.getMarginBox(container);
          var width = box.w - 20;
          var column = parseInt(width / 104, 10);
          if (column > 0) {
            var margin = width % 104;
            var addWidth = parseInt(margin / column, 10);
            this._setNodeWidths(container, 104 + addWidth);
          }
        }

        this.setContainerHeight(parentSize, parentNode);
      },
      _setNodeWidths: function (container, width) {
        query('.jimu-img-node', container).forEach(function (node) {
          html.setStyle(node, 'width', width + 'px');
        });
      },

      getItemSize: function() {
        var size = {};
        size.width = this.itemSize.width;
        size.height = this.itemSize.height;
        return size;
      },

      setContainerWidth: function(parentSize, itemSize) {
        var scrollerWidth = 20;//TODO

        var colsNum = Math.floor((parentSize.w) / (itemSize.width + 2 * this.hmargin));
        var totalWidth = (itemSize.width + 2 * this.hmargin) * colsNum + scrollerWidth;
        html.setStyle(this.containerDom, {
          width: totalWidth + "px",
          margin: "0px auto"//move to center
        });
      },
      setContainerHeight: function(parentSize, parentNode) {
        var headerH = this._getDomHeight(".header", parentNode);
        var errorH = this._getDomHeight(".error", parentNode);
        var footerH = this._getDomHeight(".footer", parentNode);
        var usedH = headerH + errorH + footerH;

        html.setStyle(this.containerDom, {
          height: parentSize.h - usedH + "px"
        });
      },

      setItemPosition: function(item, itemSize) {
        var itemStyle = {
          position: 'relative',
          margin: this.vmargin + "px " + this.hmargin + "px"
        };
        if (itemSize.width >= 0) {
          itemStyle.width = itemSize.width + 'px';
        }
        if (itemSize.height >= 0) {
          itemStyle.height = itemSize.height + 'px';
        }
        html.setStyle(item.domNode, itemStyle);
        html.addClass(item.domNode, "jimu-float-leading");
      },

      _getDomHeight: function(className, sope) {
        var h = 0;
        var dom = query(className, sope)[0];
        if (dom) {
          var domSize = html.getMarginBox(dom);
          if (domSize && domSize.h) {
            h = domSize.h;
          }
        }
        return h;
      }
    });
  });