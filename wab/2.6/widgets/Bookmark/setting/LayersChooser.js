///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2017 Esri. All Rights Reserved.
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
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/Evented',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/on'
  //'dojo/query'
],
  function (declare, lang, html, array,
    Evented, _WidgetBase, _TemplatedMixin,
    on/*, query*/) {

    var clazz = declare([_WidgetBase, _TemplatedMixin, Evented], {
      baseClass: 'layers-chooser-container set-btn',
      templateString: '<div></div>',
      nls: null,
      menuBox: {
        w: 75,
        h: 120
      },
      layerItems: [],
      enable: true,

      postCreate: function () {
        this.labelNode = html.create('div', {
          'class': 'label',
          innerHTML: this.nls.set
        }, this.domNode);
        this.inherited(arguments);
      },

      startup: function () {
        this.setLayers(this.layers);
        //outter btn click
        this.own(on(this.labelNode, 'click', lang.hitch(this, function (evt) {
          this.onBtnClick(evt);
        })));

        if (this.enable) {
          this.enableMeun();
        } else {
          this.disableMeun();
        }

        this.inherited(arguments);
      },

      destroy: function () {
        this.inherited(arguments);
        this.layerItems = null;
      },

      getLayers: function () {
        var layers = {};//must be a object(not a array)
        array.forEach(this.layerItems, function (item) {
          var id = html.getAttr(item, "data-id");//item.innerHTML;
          var visible = html.hasClass(item, "selected");

          layers[id] = {
            visible: visible
          };
        }, this);

        return layers;
      },
      setLayers: function (layers) {
        this.layers = layers;

        this.layerItems = [];
        this._initMeun();
      },

      _initMeun: function () {
        if (this.meun) {
          html.empty(this.meun);
        }

        this.meun = html.create('div', {
          'class': 'meun-box hide'
        }, this.domNode);

        //TODO todo targ
        html.create('div', {
          innerHTML: "For test==> Preview in the main map",
          style: "background-color: #24B5CC"
        }, this.meun);

        for (var layerId in this.layers) {
          this._createItem(layerId, this.layers[layerId]);
        }
      },

      _createItem: function (layerId, layer) {
        var item = html.create('div', {
          'class': 'layer',
          innerHTML: layerId,
          "data-id": layerId
        }, this.meun);

        if (true === layer.visible) {
          this._selectItem(item, { noEvent: true });
        } else {
          this._unSelectedItem(item, { noEvent: true });
        }

        this.own(on(item, 'click', lang.hitch(this, this._toggleSelectItme, item)));

        this.layerItems.push(item);
      },
      _toggleSelectItme: function (item) {
        if (html.hasClass(item, "selected")) {
          this._unSelectedItem(item);
        } else {
          this._selectItem(item);
        }
      },
      _selectItem: function (item, option) {
        html.addClass(item, "selected");
        if (!(option && true === option.noEvent)) {
          this.emit("change", this.getLayers());
        }
      },
      _unSelectedItem: function (item, option) {
        html.removeClass(item, "selected");
        if (!(option && true === option.noEvent)) {
          this.emit("change", this.getLayers());
        }
      },

      onBtnClick: function (evt) {
        evt.stopPropagation();
        evt.preventDefault();

        if (html.hasClass(this.meun, "hide")) {
          if (false === this.enable) {
            return;
          }
          this._setMenuPosition();
          this._showMenu();
        } else {
          this._closeMenu();
        }
      },

      enableMeun: function () {
        this.enable = true;
        html.addClass(this.labelNode, "enable");
      },
      disableMeun: function () {
        this.enable = false;
        html.removeClass(this.labelNode, "enable");
      },

      //speed menu
      _setMenuPosition: function () {
        var sPosition = html.position(this.domNode);
        if (sPosition.y - this.menuBox.h - 2 < 0) {
          html.setStyle(this.meun, {
            top: '27px',
            bottom: 'auto'
          });
        }

        var layoutBox = html.getMarginBox(this.domNode);
        if (window.isRTL) {
          if (sPosition.x - this.menuBox.w < 0) {
            html.setStyle(this.meun, {
              left: 0
            });
          }
        } else {
          if (sPosition.x + this.menuBox.w > layoutBox.w) {
            html.setStyle(this.meun, {
              right: 0
            });
          }
        }
      },
      _showMenu: function () {
        html.removeClass(this.meun, "hide");
        this.emit("open");
      },
      _closeMenu: function () {
        html.addClass(this.meun, "hide");
        this.emit("close");
      }
    });
    return clazz;
  });