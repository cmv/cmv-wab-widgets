// Deprectated: uses old dojo components, which are very slow when 10000+ elements are present in the list.
define([
    "dojo/_base/declare",
    "dojo/store/Memory",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dijit/form/FilteringSelect",
    "dijit/form/_ComboBoxMenu",

    "../../dijit/tooltips/TooltipUtil",
    "dojo/i18n!../../../nls/strings",

    "xstyle/css!./css/FilteringSelect.css"
], function (
    declare,
    Memory,
    query,
    domClass,
    domStyle,
    domGeom,
    FilteringSelect,
    _ComboBoxMenu,

    ToolTipUtil,
    nls
) {
    var NONE_ID = "None";

    // Item Store virtually adds the None item to the memory store.
    var MyStore = declare(Memory, {

        filtered: false,
        noneItem: null,

        get: function (id) {
            return id == NONE_ID ? this.noneItem : this.inherited(arguments);
        },

        query: function (query, options) {
            var results = this.inherited(arguments);
            this.filtered = results.length != this.data.length;
            return results;
        }
    });

    // Item Menu adds the trim with ellipses ability to menu items.
    var MyMenu = declare(_ComboBoxMenu, {

        baseClass: "dijitComboBoxMenu",

        idProperty: "value",

        postCreate: function () {
            this.inherited(arguments);
            ToolTipUtil.autoTooltip(this.domNode);
        },

        _createMenuItem: function () {
            var item = this.inherited(arguments);
            item.className += " TrimWithEllipses";
            return item;
        },

        selectItem: function (value) {
            if (!this.items)
                return;

            var index = -1;
            for (var i = 0; i < this.items.length; i++)
                if (this.items[i][this.idProperty] == value) {
                    index = i;
                    break;
                }
            if (index < 0)
                return;

            var nodes = this.containerNode.children;
            for (i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.style.display != "none" && node.getAttribute("item") == index) {
                    this.selectLastNode(); // At first scroll down
                    this.set("selected", node, true); // Then scroll up to the selected node
                    break;
                }
            }
        }
    });

    // We inherit from FilteringSelect.
    // Maybe it will be better to use OnDemandSelect instead.
    var MyFilteringSelect = declare(FilteringSelect, {
        forceWidth: false,
        autoWidth: false,
        selectOnClick: true,

        idProperty: "value",
        labelProperty: "label",
        placeHolder: null,

        dropDownClass: MyMenu,

        options: null,
        _assignedStore: null,

        _isCreated: false,

        postMixInProperties: function () {
            this.searchAttr = this.labelAttr = this.labelProperty;
            var noneItem = {};
            noneItem[this.idProperty] = NONE_ID;
            noneItem[this.labelAttr] = this.placeHolder || nls.None;
            this.set("store", new MyStore({ idProperty: this.idProperty, noneItem: noneItem }));
            this.inherited(arguments);
        },

        _startSearch: function () {
            this.inherited(arguments);
            this.dropDown.idProperty = this.idProperty;
            this.dropDown.labelProperty = this.labelProperty;
        },

        postCreate: function () {
            this.inherited(arguments);
            ToolTipUtil.autoTooltip(this.domNode);

            if (this.options || this._assignedStore)
                this.setItems(this.options || this._assignedStore.data);

            domClass.add(this.domNode, "esriMapsAnalystXFilteringSelect");
            this._isCreated = true;
        },

        _onFocus: function () {
            this._updateTrimWithEllipses(true);
            this.inherited(arguments);
        },

        _onBlur: function () {
            this.inherited(arguments);
            this._updateTrimWithEllipses(false);
        },

        _updateTrimWithEllipses: function (focused) {
            var node = query(".dijitInputInner", this.domNode)[0];
            if (node)
                domClass[focused ? "remove" : "add"](node, "TrimWithEllipses");
        },

        _setStoreAttr: function (value) {
            if (value instanceof MyStore) {
                this.store = value;
                this.inherited(arguments);
            }
            else {
                this._assignedStore = value;
                this._isCreated && this.setItems(this._assignedStore.data);
            }
        },

        _setOptionsAttr: function (value) {
            this.options = value;
            this._isCreated && this.setItems(this.options);
        },

        setItems: function (items, selectedItemId) {
            this.store.setData(items);

            // Update drop down
            this.closeDropDown();
            this.dropDown && this.dropDown.clearResultList();

            var oldValue = this.get("value");
            selectedItemId = selectedItemId || NONE_ID
            this.set("value", selectedItemId);
            if (selectedItemId == oldValue)
                this.emit("Change");

            this._updateTrimWithEllipses(this.get("focused"));
        },

        _openResultList: function (results, query, options) {
            var width = domGeom.getContentBox(this.domNode).w;
            domStyle.set(this.dropDown.domNode, "width", width + "px");
            this.inherited(arguments);
            if (!this.store.filtered)
                this.dropDown.selectItem && this.dropDown.selectItem(this.get("value"));
        },

        // override
        _setBlurValue: function () {
            var newvalue = this.get('displayedValue');
            if (typeof this.item == "undefined") {
                this.item = null;
                this.set('displayedValue', newvalue);
            }
            if (this.value != this._lastValueReported)
                this._handleOnChange(this.value, true);
            this._refreshState();
            // Remove aria-activedescendant since it may not be removed if they select with arrows then blur with mouse
            this.focusNode.removeAttribute("aria-activedescendant");
        },

        getSelectedItem: function () {
            var self = this;
            return this.store.data.filter(function (item) { return item[self.idProperty] == self.get("value"); })[0];
        }
    });

    MyFilteringSelect.NONE_ID = NONE_ID;

    return MyFilteringSelect;
});