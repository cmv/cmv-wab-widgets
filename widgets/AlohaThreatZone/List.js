/*global define, document */
define(['dojo/_base/declare',
    'dijit/_WidgetBase',
    'dojo/_base/lang',
    'dojox/gfx',
    'dojo/on',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/_base/array',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/Evented',
    'esri/symbols/jsonUtils',
    'jimu/dijit/CheckBox'
  ],
  function(declare,
    _WidgetBase,
    lang,
    gfx,
    on,
    domConstruct,
    domAttr,
    array,
    dom,
    domClass,
    domStyle,
    Evented,
    jsonUtils,
    CheckBox
  ) {
    return declare([_WidgetBase, Evented], {

      'class': 'widgets-aloha-list',
      _itemCSS: "aloha-list-item",
      _itemSelectedCSS: "aloha-list-item selected",
      _itemAltCSS: "aloha-list-item alt",
      nls: null,

      startup: function() {
        this.items = [];
        this.selectedIndex = -1;
        this._selectedNode = null;
        this._listContainer = domConstruct.create("div");
        domClass.add(this._listContainer, "aloha-list-container");
        this.own(on(this._listContainer, "click", lang.hitch(this, this._onClick)));
        domConstruct.place(this._listContainer, this.domNode);
      },

      add: function(alohaResult) {
        if (arguments.length === 0) {
          return;
        }
        var label;
        this.items.push(alohaResult);
        var div = domConstruct.create("div");
        domAttr.set(div, "id", this.id.toLowerCase() + alohaResult.id);
        if(alohaResult.alt){
          domClass.add(div, this._itemAltCSS);
        }else{
          domClass.add(div, this._itemCSS);
        }
        var ctrlsDiv = domConstruct.create("div");
        domAttr.set(ctrlsDiv, "id", this.id.toLowerCase() + alohaResult.id);
        domClass.add(ctrlsDiv, "ctrlsDiv");

        var visCB = new CheckBox({"label":this.nls.visible, "checked": true});
        visCB.startup();
        visCB.onChange = lang.hitch(this, function(){
          this._onVisibilityClick(visCB.checked, this.id.toLowerCase() + alohaResult.id);
        });
        domStyle.set(visCB.domNode, 'float', 'left');
        domConstruct.place(visCB.domNode, ctrlsDiv);
        domConstruct.place(ctrlsDiv, div);

        var rTitle = domConstruct.create("strong");
        domAttr.set(rTitle, "id", this.id.toLowerCase() + alohaResult.id);
        domClass.add(rTitle, "label");
        rTitle.textContent = rTitle.innerText = alohaResult.title.join(" - ").split("\r").join("");
        domConstruct.place(rTitle, div);
        var uv, uvDiv, iconDiv;
        if (alohaResult && alohaResult.UIs){
          for(var u = 0; u < alohaResult.UIs.length; u++){
            uv = alohaResult.UIs[u];
            uvDiv = domConstruct.create('div');
            domAttr.set(uvDiv, "id", this.id.toLowerCase() + alohaResult.id);
            domClass.add(uvDiv, "uvDiv");
            iconDiv = domConstruct.create("div");
            domAttr.set(iconDiv, "id", this.id.toLowerCase() + alohaResult.id);
            domClass.add(iconDiv, "iconDiv");
            domConstruct.place(iconDiv, uvDiv);
            if(document.all && !document.addEventListener){
              //do nothing because it is IE8
              //And I can not produce swatches in IE8
            }else{
              var mySurface = gfx.createSurface(iconDiv, 40, 40);
              var descriptors = jsonUtils.getShapeDescriptors(uv.symbol);
              if(descriptors.defaultShape){
                var shape = mySurface.createShape(descriptors.defaultShape).setFill(descriptors.fill).setStroke(descriptors.stroke);
                shape.applyTransform({ dx: 20, dy: 20 });
              }
            }
            label = domConstruct.create('p');
            domAttr.set(label, "id", this.id.toLowerCase() + alohaResult.id);
            domClass.add(label, "uvLabel");
            label.textContent = label.innerText = uv.description;
            domConstruct.place(label, uvDiv);
            domConstruct.place(uvDiv, div);
          }
        }

        if (alohaResult && alohaResult.text){
          var txt;
          for(var t = 0; t < alohaResult.text.length; t++){
            txt = alohaResult.text[t];
            label = domConstruct.create('p');
            domAttr.set(label, "id", this.id.toLowerCase() + alohaResult.id);
            domClass.add(label, "modeltext");
            label.textContent = label.innerText = txt;
            domConstruct.place(label, div);
          }
        }

        domConstruct.place(div, this._listContainer);
      },

      remove: function(index) {
        var item = this.items[index];
        domConstruct.destroy(this.id.toLowerCase() + item.id + "");
        this.items.splice(index, 1);
        if (this.items.length === 0) {
          this._init();
        }
      },

      _init: function() {
        this.selectedIndex = -1;
        this._selectedNode = null;
      },

      clear: function() {
        this.items.length = 0;
        this._listContainer.innerHTML = "";
        this._init();
      },

      _onClick: function(evt) {
        if (evt.target.id === "" && evt.target.parentNode.id === "") {
          return;
        }
        var id = evt.target.id.toLowerCase();
        if (!id) {
          id = evt.target.parentNode.id;
        }
        var item = this._getItemById(id);
        if (!item) {
          return;
        }
        domClass.replace(id, this._itemSelectedCSS, ((item.alt) ? this._itemAltCSS:this._itemCSS));
        if (this._selectedNode) {
          var item_selected = this._getItemById(this._selectedNode);
          domClass.replace(this._selectedNode, ((item_selected.alt)? this._itemAltCSS:this._itemCSS), this._itemSelectedCSS);
        }
        this._selectedNode = id;
        this.emit('click', this.selectedIndex, item);
      },

      _onVisibilityClick: function(checked, id) {
        var item = this._getItemById(id);
        if (!item) {
          return;
        }

        this._selectedNode = id;
        this.emit('footprintVisibilityChange', checked, item);
      },

      _onOpacityChange: function(opacity, id) {
        var item = this._getItemById(id);
        if (!item) {
          return;
        }
        this._selectedNode = id;
        this.emit('opacityChange', opacity, item);
      },

      _getItemById: function(id) {
        id = id.replace(this.id.toLowerCase(),"");
        var len = this.items.length;
        var item;
        for (var i = 0; i < len; i++) {
          item = this.items[i];
          if (item.id === id) {
            this.selectedIndex = i;
            return item;
          }
        }
        return null;
      },

      setSelectedItem: function(id) {
        var item = this._getItemById(id);
        if (!item) {
          return;
        }
        domClass.replace(id, this._itemSelectedCSS, ((item.alt) ? this._itemAltCSS:this._itemCSS));
        if (this._selectedNode) {
          var item_selected = this._getItemById(this._selectedNode);
          domClass.replace(this._selectedNode, ((item_selected.alt)? this._itemAltCSS:this._itemCSS), this._itemSelectedCSS);
        }
        this._selectedNode = id;
      }
    });
  });
