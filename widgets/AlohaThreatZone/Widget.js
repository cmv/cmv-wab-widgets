///////////////////////////////////////////////////////////////////////////
// Robert Scheitlin WAB Aloha Threat Zone Widget
///////////////////////////////////////////////////////////////////////////
/*global define, FileReader, setInterval, clearInterval, window, ActiveXObject, document, navigator*/

define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/ProgressBar',
  'jimu/dijit/TabContainer',
  'jimu/utils',
  'dojo/on',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/aspect',
  'dojo/dom-style',
  'dojo/_base/array',
  'esri/geometry/Point',
  'esri/SpatialReference',
  'esri/geometry/webMercatorUtils',
  'esri/layers/GraphicsLayer',
  'esri/renderers/UniqueValueRenderer',
  'esri/graphic',
  'esri/geometry/Polygon',
  'esri/geometry/Polyline',
  'esri/graphicsUtils',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/config',
  'esri/Color',
  'esri/symbols/jsonUtils',
  'esri/geometry/Circle',
  'esri/units',
  'jimu/dijit/Message',
  'jimu/utils',
  'jimu/tokenUtils',
  'dojo/sniff',
  './base64',
  './List',
  'jimu/dijit/DrawBox',
  'jimu/dijit/LoadingShelter',
  'jimu/dijit/_Transparency'
  ],
  function (
    declare,
    BaseWidget,
    _WidgetsInTemplateMixin,
    ProgressBar,
    TabContainer,
    jimuUtils,
    on,
    lang,
    html,
    aspect,
    domStyle,
    array,
    Point,
    SpatialReference,
    webMercatorUtils,
    GraphicsLayer,
    UniqueValueRenderer,
    Graphic,
    Polygon,
    Polyline,
    graphicsUtils,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    esriConfig,
    Color,
    jsonUtils,
    Circle,
    Units,
    Message,
    utils,
    tokenUtils,
    has,
    base64
  ) {
    /*global testLoad*/
    var fileAPIJsStatus = 'unload'; // unload, loading, loaded

    function _loadFileAPIJs(prePath, cb) {
      prePath = prePath || "";
      var loaded = 0,
        completeCb = function() {
          loaded++;
          if (loaded === tests.length) {
            cb();
          }
        },
        tests = [{
          test: window.File && window.FileReader && window.FileList && window.Blob ||
            !utils.file.isEnabledFlash(),
          failure: [
            prePath + "libs/polyfills/fileAPI/FileAPI.js"
          ],
          callback: function() {
            completeCb();
          }
        }];

      for (var i = 0; i < tests.length; i++) {
        testLoad(tests[i]);
      }
    }
    var aWidget = declare([BaseWidget, _WidgetsInTemplateMixin], {
      baseClass: 'widget-aloha',
      name: 'AlohaThreatZone',
      progressBar: null,
      tabContainer: null,
      list: null,
      selTab: null,
      uniqueValueInfos: [],
      pasFileData: null,
      renderer: null,
      fCnt: 1,

      postCreate: function () {
        this.inherited(arguments);
        this._initial();
        if (!utils.file.supportHTML5() && !has('safari') && utils.file.isEnabledFlash()) {
          if (fileAPIJsStatus === 'unload') {
            var prePath = tokenUtils.isInBuilderWindow() ? 'stemapp/' : "";
            window.FileAPI = {
              debug: false,
              flash: true,
              staticPath: prePath + 'libs/polyfills/fileAPI/',
              flashUrl: prePath + 'libs/polyfills/fileAPI/FileAPI.flash.swf',
              flashImageUrl: prePath + 'libs/polyfills/fileAPI/FileAPI.flash.image.swf'
            };

            _loadFileAPIJs(prePath, lang.hitch(this, function() {
              //html.setStyle(this.mask, 'zIndex', 1); // prevent mask hide file input
              fileAPIJsStatus = 'loaded';
            }));
            fileAPIJsStatus = 'loading';
          } else {
            //html.setStyle(this.mask, 'zIndex', 1); // prevent mask hide file input
          }
        }
        this.own(on(this.domNode, 'mousedown', lang.hitch(this, function (event) {
          event.stopPropagation();
          if (event.altKey) {
            var msgStr = this.nls.widgetverstr + ': ' + this.manifest.version;
            msgStr += '\n' + this.nls.wabversionmsg + ': ' + this.manifest.wabVersion;
            msgStr += '\n' + this.manifest.description;
            new Message({
              titleLabel: this.nls.widgetversion,
              message: msgStr
            });
          }
        })));
      },

      _initial: function() {
        this._initTabContainer();
        this._initProgressBar();
        this._initDrawBox();
        this._initGL();
      },

      startup: function () {
        this.inherited(arguments);
        this.own(on(this.fileInput, "change", lang.hitch(this, function (evt) {
          var maxSize = has('ie') < 9 ? 23552 : 1048576; //ie8:21k others:1M
          //console.info(evt);
          this.readFile(evt, 'pas', maxSize,
            lang.hitch(this, function (err, fileName, fileData) {
            /*jshint unused: false*/
            if (err) {
              console.info(err);
              var message = this.nls[err.errCode];
              if (err.errCode === 'exceed') {
                message = message.replace('1024', maxSize / 1024);
              }
              new Message({'message': message});
            } else {
              //console.info(fileData);
              if(fileData.indexOf('base64') > -1){
                fileData = base64.decode(fileData.replace('data:pas;base64,',''));
              }
              this.pasFileData = fileData;
            }
          }));
        })));
        this.list.nls = this.nls;
        this.own(on(this.layerAlpha, "change", lang.hitch(this, this._footprintOpacityChange)));
      },

      readFile: function(fileEvt, filter, maxSize, cb) {
        if (this.supportHTML5()) {
          var file = fileEvt.target.files[0];
          if (!file) {
            return;
          }
          // Only process pas files.
          if (file.type && !file.type.match(filter)) {
            // cb("Invalid file type.");
            cb({
              errCode: "invalidType"
            });
            return;
          }

          if (file.size >= maxSize) {
            // cb("File size cannot exceed  " + Math.floor(maxSize / 1024) + "KB.");
            cb({
              errCode: "exceed"
            });
            return;
          }

          var reader = new FileReader();
          // Closure to capture the file information.
          reader.onload = function(e) {
            cb(null, file.name, e.target.result);
          };
          // Read in the image file as a data URL.
          reader.readAsText(file);
        } else if (this.supportFileAPI()) {
          var files = window.FileAPI.getFiles(fileEvt);
          // Only process pas files.
          if (files[0].type && !files[0].type.match(filter)) {
            // cb("Invalid file type.");
            cb({
              errCode: "invalidType"
            });
            return;
          }

          if (files[0].size >= maxSize) {
            // cb("File size cannot exceed  " + Math.floor(maxSize / 1048576) + "M.");
            cb({
              errCode: "exceed"
            });
            return;
          }
          window.FileAPI.debug = true;
          window.FileAPI.readAsText(files[0], "utf-8", function(evt) {
            //console.info(evt);
            if (evt && evt.result) {
              cb(null, files[0].name, evt.result);
            } else {
              cb({
                errCode: "readError"
              });
            }
          });
        }
      },

      supportHTML5: function() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          return true;
        } else {
          return false;
        }
      },

      supportFileAPI: function() {
        if (has('safari') && has('safari') < 6) {
          return false;
        }
        if (window.FileAPI && window.FileAPI.readAsDataURL) {
          return true;
        }
        return false;
      },

      isEnabledFlash: function(){
        var swf = null;
        if (document.all) {
          try{
            swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
          }catch(e) {
            swf = null;
          }
        } else {
          if (navigator.plugins && navigator.plugins.length > 0) {
            swf = navigator.plugins["Shockwave Flash"];
          }
        }
        return !!swf;
      },

      onOpen: function () {
        if (this.graphicsLayer) {
          this.graphicsLayer.show();
        }
      },

      onClose: function () {
        if (this.graphicsLayer) {
          this.graphicsLayer.hide();
        }
      },

      _selectResultItem: function (index, item) {
        if (item.extent) {
          this.map.setExtent(item.extent.expand(this.config.zoompercent), true);
        }
      },

      _footprintVisChange: function (visible, item) {
        array.map(this.graphicsLayer.graphics, lang.hitch(this, function(gra){
          if(gra.name == item.id){
            if(visible){
              gra.show();
            }else{
              gra.hide();
            }
          }
        }));
      },

      _initGL: function () {
        this.graphicsLayer = new GraphicsLayer();
        this.graphicsLayer.name = "Aloha_Threat_Zones";
        var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
        defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
        this.renderer = new UniqueValueRenderer(defaultSymbol, "description", "type", null, ",");
        this.graphicsLayer.setRenderer(this.renderer);
        this.map.addLayer(this.graphicsLayer);
      },

      _initProgressBar: function () {
        this.progressBar = new ProgressBar({
          indeterminate: true
        }, this.progressbar);
        html.setStyle(this.progressBar.domNode, 'display', 'none');
      },

      _initDrawBox: function () {
        aspect.before(this.drawBox, "_activate", lang.hitch(this, function () {
          this.publishData({
            message: "Deactivate_DrawTool"
          });
        }));
        on(this.drawBox, "icon-selected", lang.hitch(this, function(){
          if(!this.pasFileData){
            this.drawBox.deactivate();
            new Message({
              type: 'error',
              titleLabel: this.nls.errormsgtitle,
              message: '<img src="widgets/AlohaThreatZone/images/error.png" style="margin-right:8px;" />' + this.nls.errormsg
            });
            return;
          }
        }));
        this.drawBox.setMap(this.map);
        this.drawBox.setPointSymbol(jsonUtils.fromJson(this.config.simplemarkersymbol));
        this.own(on(this.drawBox, 'DrawEnd', lang.hitch(this, function (graphic) {
          graphic.name = "remove_me";
          this.parsePas(this.pasFileData, graphic);
        })));
        this.own(on(this.btnClear1, "click", lang.hitch(this, this.clear, true)));
        this.own(on(this.btnClear2, "click", lang.hitch(this, this.clear, true)));
        html.setStyle(this.btnClear1, 'display', 'none');
        html.setStyle(this.btnClear2, 'display', 'none');
      },

      _initTabContainer: function () {
        var tabs = [];
        tabs.push({
          title: this.nls.input,
          content: this.tabNode1
        });
        tabs.push({
          title: this.nls.results,
          content: this.tabNode2
        });
        this.tabContainer = new TabContainer({
          tabs: tabs,
          selected: this.selTab
        }, this.tabAloha);

        this.tabContainer.startup();
        this.own(on(this.tabContainer, "tabChanged", lang.hitch(this, function (title) {
          if (title !== this.nls.results) {
            this.selTab = title;
          }
        })));
        jimuUtils.setVerticalCenter(this.tabContainer.domNode);
      },

      clear: function () {
        this.fCnt = 1;
        this.list.clear();
        this.graphicsLayer.clear();
        html.setStyle(this.btnClear1, 'display', 'none');
        html.setStyle(this.btnClear2, 'display', 'none');
        this.divResultMessage.textContent = this.divResultMessage.innerText = this.nls.noFootprints;
        this.drawBox.clear();
        domStyle.set(this.layerOpacityDiv, "display", "none");
      },

      parsePas: function (data, graphic) {
        this.tabContainer.selectTab(this.nls.results);
        html.setStyle(this.progressBar.domNode, 'display', 'block');
        html.setStyle(this.divOptions, 'display', 'none');

        var lines = data.split("\n");

        var modelOutput = {
          id: "id_" + this.fCnt,
          point: null,
          footprints: [],
          confidences: [],
          text: [],
          UIs: [],
          title: [],
          windInformation: "",
          windSpeed: null,
          windSpeedUnits: "",
          windDirection: null,
          extent: null,
          labels: [],
          currentalpha: 1,
          currentvisibility: true,
          alt: (this.fCnt % 2 === 0)
        };
        modelOutput.point = webMercatorUtils.webMercatorToGeographic(graphic.geometry);

        var fp = null;
        array.forEach(lines, lang.hitch(this, function (line) {
          //if Title text - save
          if (line.indexOf("T ") === 0) {
            modelOutput.title.push(line.substr(2));
          }
          //if text - save
          if (line.indexOf("t ") === 0) {
            modelOutput.text.push(line.substr(2));
          }
          //if footprint
          else if (line.indexOf("FOOTPRINT ") === 0) {
            fp = {
              text: line.substr(10),
              measure: null,
              type: null,
              points: [],
              circles: [],
              x: 0,
              y: 0
            };
            fp.measure = this.getMeasureFromTitle(fp.text);
            fp.type = "FOOTPRINT";
            modelOutput.footprints.push(fp);
          }
          //if confidence line
          else if (line.indexOf("CONFIDENCE LINES ") === 0) {
            fp = {
              text: line.substr(17),
              measure: null,
              type: null,
              points: [],
              circles: [],
              x: 0,
              y: 0
            };
            fp.measure = this.getMeasureFromTitle(fp.text);
            fp.type = "CONFIDENCE";
            modelOutput.confidences.push(fp);
          }
          //if points
          else if (line.indexOf("M ") === 0 || line.indexOf("L ") === 0) {
            var words = line.split(' ');
            //Check for a circle situation
            if (words[0] == "M" && Number(words[1]) > 0 && Number(words[2]) === 0) {
              fp.circles.push(Number(words[1]));
            } else {
              var p = new Point(
                Number(words[1]),
                Number(words[2]),
                new SpatialReference(102100));
              fp.points.push(p);
            }
          }
        }));

        modelOutput.footprints.sort();
        modelOutput.confidences.sort();

        getWeatherInformation(modelOutput);

        function getWeatherInformation(modelOutput) {
          modelOutput.windInformation = "Unknown";
          array.forEach(modelOutput.text, lang.hitch(this, function (txt) {
            //if wind found
            if (txt.indexOf("Wind:") > -1) {
              //get wind info
              modelOutput.windInformation = txt.substr(7);

              //split into words
              var words = modelOutput.windInformation.split(' ');

              //get wind speed
              modelOutput.windSpeed = Number(words[0]);

              //get units
              modelOutput.windSpeedUnits = words[1];

              //parse numeric wind direction
              try {
                modelOutput.windDirection = Number(words[3].substr(0, words[3].length - 1));
              }
              //else textual wind direction
              catch (err) {
                var direction = words[3];
                modelOutput.windDirection = 0;

                if (lang.trim(direction).toLowerCase() == "n") {
                  modelOutput.windDirection = 0;
                } else if (lang.trim(direction).toLowerCase() == "nne") {
                  modelOutput.windDirection = 22.5;
                } else if (lang.trim(direction).toLowerCase() == "ne") {
                  modelOutput.windDirection = 45;
                } else if (lang.trim(direction).toLowerCase() == "ene") {
                  modelOutput.windDirection = 67.5;
                } else if (lang.trim(direction).toLowerCase() == "e") {
                  modelOutput.windDirection = 90;
                } else if (lang.trim(direction).toLowerCase() == "ese") {
                  modelOutput.windDirection = 112.5;
                } else if (lang.trim(direction).toLowerCase() == "se") {
                  modelOutput.windDirection = 135;
                } else if (lang.trim(direction).toLowerCase() == "sse") {
                  modelOutput.windDirection = 157.5;
                } else if (lang.trim(direction).toLowerCase() == "s") {
                  modelOutput.windDirection = 180;
                } else if (lang.trim(direction).toLowerCase() == "ssw") {
                  modelOutput.windDirection = 202.5;
                } else if (lang.trim(direction).toLowerCase() == "sw") {
                  modelOutput.windDirection = 225;
                } else if (lang.trim(direction).toLowerCase() == "wsw") {
                  modelOutput.windDirection = 247.5;
                } else if (lang.trim(direction).toLowerCase() == "w") {
                  modelOutput.windDirection = 270.0;
                } else if (lang.trim(direction).toLowerCase() == "wnw") {
                  modelOutput.windDirection = 292.5;
                } else if (lang.trim(direction).toLowerCase() == "nw") {
                  modelOutput.windDirection = 315;
                } else if (lang.trim(direction).toLowerCase() == "nnw") {
                  modelOutput.windDirection = 337.5;
                }
              }
            }
          }));
        }

        this.createPlotGraphics(modelOutput);
        this.drawBox.clear();
        this.graphicsLayer.add(graphic);
        modelOutput.labels.push(this.nls.alohatooltip);
        modelOutput.labels.push(this.nls.layeropacity);
        modelOutput.labels.push(this.nls.visible);
        modelOutput.currentvisibility = true;
        modelOutput.currentalpha = 1;
        html.setStyle(this.btnClear1, 'display', 'block');
        html.setStyle(this.btnClear2, 'display', 'block');
        this.list.add(modelOutput);
        this.divResultMessage.textContent = this.divResultMessage.innerText = this.nls.totalFootprints + this.list.items.length;
        domStyle.set(this.layerOpacityDiv, "display", "");
        if (modelOutput.extent) {
          this.map.setExtent(modelOutput.extent.expand(this.config.zoompercent), true).then( lang.hitch(this, function(){
            //Now pulse the point of origin and then remove it.
            this._pulseAndRemove(graphic);
          }));
        }
        html.setStyle(this.progressBar.domNode, 'display', 'none');
        html.setStyle(this.divOptions, 'display', 'block');
        this.fCnt++;
      },

      modelToWorld: function(point, modelOutput){
        var feet2degrees = 1.0 / (1852.0 * 60.0);
        var pnt = new Point(
            modelOutput.point.x + point.x * feet2degrees / Math.cos(modelOutput.point.y * Math.PI / 180.0),
            modelOutput.point.y + point.y * feet2degrees, new SpatialReference(4326));
        return webMercatorUtils.geographicToWebMercator(pnt);
      },

      getMeasureFromTitle: function (title) {
        var measure = 0,
          measureString;
        if (title.toLowerCase().indexOf("ppm") > -1) {
          measureString = title.substr(6, title.toLowerCase().indexOf("ppm") - 6);
          measure = Number(measureString);
        } else if (title.toLowerCase().indexOf("milligram") > -1) {
          measureString = title.substr(6, title.toLowerCase().indexOf("milligram") - 6);
          measure = Number(measureString);
        } else if (title.toLowerCase().indexOf("gram") > -1) {
          measureString = title.substr(6, title.toLowerCase().indexOf("gram") - 6);
          measure = Number(measureString);
        }
        return measure;
      },

      createPlotGraphics: function (modelOutput) {
        var threatExtent;
        threatExtent = this.generateGraphic(modelOutput, modelOutput.footprints, "FootPrint");
        var confExt = this.generateGraphic(modelOutput, modelOutput.confidences, "Confidence");
        if (confExt) {
          threatExtent = threatExtent.union(confExt);
        }
        modelOutput.extent = threatExtent;
      },

      generateGraphic: function (modelOutput, plots, plotName) {
        var threatExtent, uVal;
        for (var p = 0; p < plots.length; p++) {
          var f = plots[p];
          var graphic = new Graphic();
          var polygon = new Polygon(this.map.spatialReference);
          var polyline = new Polyline(this.map.spatialReference);
          var points = [];
          var attrs = {};

          var uValue = f.text.substring(6, f.text.indexOf("]"));
          attrs.description = uValue;
          attrs.type = plotName;

          var color16 = new Color([0, 0, 0, 0.6]);
          var color2 = new Color([0, 0, 0, 1]);
          var color28 = new Color([0, 0, 0, 0.8]);
          if (String(f.text).toLowerCase().indexOf("red") != -1) {
            color16 = new Color([255, 0, 0, 0.6]);
            color2 = new Color([255, 0, 0, 1]);
            color28 = new Color([255, 0, 0, 0.8]);
          } else if (String(f.text).toLowerCase().indexOf("yellow") != -1) {
            color16 = new Color([255, 255, 0, 0.6]);
            color2 = new Color([0, 0, 0, 1]);
            color28 = new Color([0, 0, 0, 0.8]);
          } else if (String(f.text).toLowerCase().indexOf("orange") != -1) {
            color16 = new Color([255, 128, 0, 0.6]);
            color2 = new Color([255, 128, 0, 1]);
            color28 = new Color([255, 128, 0, 0.8]);
          } else if (String(f.text).toLowerCase().indexOf("light orange") != -1) {
            color16 = new Color([255, 193, 13, 0.6]);
            color2 = new Color([255, 193, 13, 1]);
            color28 = new Color([255, 193, 13, 0.8]);
          }
          if (plotName == "FootPrint") {
            uVal = {
              value: uValue + ",FootPrint",
              symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, color28, 2), color16),
              description: uValue + " - Threat Zone Footprint"
            };
            this.renderer.addValue(uVal);
            modelOutput.UIs.push(uVal);
          } else {
            uVal = {
              value: uValue + ",Confidence",
              symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, color2, 2),
              description: uValue + " - Confidence Line"
            };
            this.renderer.addValue(uVal);
            modelOutput.UIs.push(uVal);
          }

          for (var pnts = 0; pnts < f.points.length; pnts++) {
            var pnt = f.points[pnts];
            points.push(this.modelToWorld(pnt, modelOutput));
          }

          for (var c = 0; c < f.circles.length; c++) {
            var radius = f.circles[c];
            var circleGeometry = new Circle({
              center: modelOutput.point,
              radius: radius,
              radiusUnit: Units.METER
            });
            points = circleGeometry.rings[0];
          }

          if (plotName == "FootPrint") {
            polygon.addRing(points);
          } else {
            polyline.addPath(points);
          }

          if (points.length > 0) {
            //console.info(attrs);
            graphic.setAttributes(attrs);
            if (plotName == "FootPrint") {
              graphic.geometry = polygon;
            } else {
              graphic.geometry = polyline;
            }
            graphic.name = modelOutput.id;

            if (threatExtent) {
              threatExtent = threatExtent.union(graphicsUtils.graphicsExtent([graphic]));
            } else {
              threatExtent = graphicsUtils.graphicsExtent([graphic]);
            }
            this.graphicsLayer.add(graphic);
          }
        }
        return threatExtent;
      },

      _pulseAndRemove: function(gra) {
        var pulseCnt = 0;
        var myInterval = setInterval(lang.hitch(this, function(){
          if(pulseCnt <= 6){
            if(gra.visible){
              gra.hide();
            }else{
              gra.show();
            }
          }else{
            clearInterval(myInterval);
            this.graphicsLayer.remove(gra);
          }
          pulseCnt++;
        }), 500);
      },

      _footprintOpacityChange: function(alpha) {
        this.graphicsLayer.setOpacity(alpha);
      }
    });
    return aWidget;
  });
