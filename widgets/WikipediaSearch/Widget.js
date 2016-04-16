define([
        'dojo/_base/declare',
        'dojo/Deferred',
        'dojo/_base/lang',
        "dojo/_base/Color",
        "dojo/html",

        'jimu/BaseWidget',

        'dijit/_WidgetsInTemplateMixin',
        'dijit/focus',

        'esri/request',
        'esri/layers/GraphicsLayer',
        'esri/graphic',
        'esri/geometry/Point',
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/InfoTemplate",
        "esri/graphicsUtils",


        'dijit/form/TextBox',
        'dojox/form/BusyButton'
    ],
    function(
        declare, Deferred, lang, Color, html,
        BaseWidget,
        _WidgetsInTemplateMixin, focusUtil,
        esriRequest, GraphicsLayer, Graphic, Point, SimpleMarkerSymbol, SimpleLineSymbol, InfoTemplate, graphicsUtils) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget, _WidgetsInTemplateMixin], {
            // DemoWidget code goes here

            //please note that this property is be set by the framework when widget is loaded.
            //templateString: template,

            baseClass: 'wikipedia-widget',

            name: 'Wikipedia',

            postCreate: function() {
                this.inherited(arguments);
            },

            startup: function() {
                this.inherited(arguments);
            },



            searchButtonOnClick: function( /*evt*/ ) {
                this.clearGraphicsLayer();
                this.wikipediaSearch(this.queryText.get("value")).then(lang.hitch(this, function(searchResults) {
                    // get coords
                    this.getCoordsForArray(searchResults[1]).then(lang.hitch(this, function(locationResults) {
                        this.mapLocations(locationResults.query.pages);
                        this.searchButton.cancel();
                        this.zoomToCurrentGraphics();
                    }));
                }));
            },

            searchOnKeyUpHandler: function(evt) {
                if (evt.keyCode === 13) {
                    this.searchButton.makeBusy();
                    this.searchButtonOnClick();
                }
            },

            wikipediaSearch: function(searchQuery) {
                var req = {
                    url: 'https://en.wikipedia.org/w/api.php',
                    content: {
                        "action": "opensearch",
                        "search": searchQuery,
                        "limit": "20",
                        "namespace": "0",
                        "format": "json"
                    }
                };
                return esriRequest(req);
                // return deferred;
            },

            getCoordsForArray: function(namesArr) {
                var req = {
                    url: 'https://en.wikipedia.org/w/api.php',
                    content: {
                        "action": "query",
                        "prop": "coordinates",
                        "titles": namesArr.join("|"),
                        "colimit": "10",
                        "coprop": "type|name|dim|country|region|globe",
                        "format": "json"
                    }
                };
                return esriRequest(req);
            },

            mapLocations: function(locations) {
                var atLeastOneLocationPoint = false;
                for (var prop in locations) {
                    if (locations[prop].hasOwnProperty('coordinates')) {
                        atLeastOneLocationPoint = true;
                        var pt = new Point(locations[prop].coordinates[0].lon, locations[prop].coordinates[0].lat);
                        this.addGraphic(pt, locations[prop].title);
                    }
                }
                if (atLeastOneLocationPoint) {
                    this.setResultText(this.getGraphicsLayer().graphics.length + " point(s) found");
                } else {
                    this.setResultText("No locations found.");
                }
            },

            setResultText: function(resultText) {
                html.set(this.resultsArea, resultText);
            },

            addGraphic: function(geom, title) {
                var gl = this.getGraphicsLayer();
                var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 20,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0]), 1),
                    new Color([0, 255, 0, 0.25]));
                gl.add(new Graphic(geom, symbol, {
                    name: title
                }, new InfoTemplate("Attributes", "${*}")));
            },

            getGraphicsLayer: function() {
                if (!this.locationsLayer) {
                    this.locationsLayer = new GraphicsLayer();
                    this.map.addLayer(this.locationsLayer);
                }
                return this.locationsLayer;
            },

            clearGraphicsLayer: function() {
                this.getGraphicsLayer().clear();
            },

            zoomToCurrentGraphics: function() {
                var extent = graphicsUtils.graphicsExtent(this.getGraphicsLayer().graphics);
                if(extent) {
                this.map.setExtent(extent, true);
                } else {
                    this.map.centerAndZoom(this.getGraphicsLayer().graphics[0].geometry, 5);
                }
            },

            resetWidget: function() {
                this.clearGraphicsLayer();
                this.queryText.set("value", "");
                this.setResultText("");
            },


            //onOpen: function(){
            //  focusUtil.focus(this.queryText);
            //},

            //onClose: function() {
            //    this.resetWidget();
            //}

            // onMinimize: function(){
            //   console.log('onMinimize');
            // },

            // onMaximize: function(){
            //   console.log('onMaximize');
            // },

            // onSignIn: function(credential){
            //   /* jshint unused:false*/
            //   console.log('onSignIn');
            // },

            // onSignOut: function(){
            //   console.log('onSignOut');
            // }
        });
    });