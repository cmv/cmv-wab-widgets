define([
    'intern!tdd',
    'intern/chai!assert',
    'widgets/Query/utils',
    'jimu/MapManager',
    'testjimu/WidgetManager',
    'testjimu/globals'
  ],
  function(tdd, assert, queryUtils, MapManager, TestWidgetManager) {
    var widgetJson = {
      id: 'Query1',
      uri: 'widgets/Query/Widget',
      version: 2.1
    };

    queryUtils.getConfigWithValidDataSource = function(config){
      return config;
    };

    MapManager.getInstance = function(){
      return {
        enableWebMapPopup: function(){},
        disableWebMapPopup: function(){}
      };
    };

    var wm,map;

    var layerDefinition1 = {
      "currentVersion": 10.41,
      "id": 0,
      "name": "Cities",
      "type": "Feature Layer",
      "description": "",
      "geometryType": "esriGeometryPoint",
      "hasAttachments": false,
      "htmlPopupType": "esriServerHTMLPopupTypeAsHTMLText",
      "displayField": "CITY_NAME",
      "typeIdField": null,
      "fields": [{
        "name": "OBJECTID",
        "type": "esriFieldTypeOID",
        "alias": "OBJECTID",
        "domain": null
      }, {
        "name": "Shape",
        "type": "esriFieldTypeGeometry",
        "alias": "Shape",
        "domain": null
      }, {
        "name": "CITY_NAME",
        "type": "esriFieldTypeString",
        "alias": "CITY_NAME",
        "length": 30,
        "domain": null
      }, {
        "name": "POP",
        "type": "esriFieldTypeInteger",
        "alias": "POP",
        "domain": null
      }, {
        "name": "POP_RANK",
        "type": "esriFieldTypeInteger",
        "alias": "POP_RANK",
        "domain": null
      }, {
        "name": "POP_CLASS",
        "type": "esriFieldTypeString",
        "alias": "POP_CLASS",
        "length": 25,
        "domain": null
      }, {
        "name": "LABEL_FLAG",
        "type": "esriFieldTypeInteger",
        "alias": "LABEL_FLAG",
        "domain": null
      }],
      "indexes": [{
        "name": "FDO_OBJECTID",
        "fields": "OBJECTID",
        "isAscending": true,
        "isUnique": true,
        "description": ""
      }, {
        "name": "FDO_Shape",
        "fields": "Shape",
        "isAscending": true,
        "isUnique": false,
        "description": ""
      }],
      "relationships": []
    };

    tdd.suite("Query", function(){
      tdd.before(function(){
        wm = TestWidgetManager.getInstance();
        map = TestWidgetManager.getDefaultMap();
        wm.prepare('theme1', map);
      });

      // tdd.after(function(){
      //   ;
      // });

      // tdd.beforeEach(function(){
      //   wm.destroyWidget('Query1');
      // });

      tdd.afterEach(function(){
        wm.destroyWidget('Query1');
      });

      tdd.test('single task', function(){
        widgetJson.config = {
          "hideLayersAfterWidgetClosed": true,
          "queries": [{
            "url": "http://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0",
            "name": "SampleWorldCities - Cities",
            "icon": "",
            "filter": {
              "logicalOperator": "AND",
              "parts": [{
                "fieldObj": {
                  "name": "OBJECTID",
                  "label": "OBJECTID",
                  "shortType": "number",
                  "type": "esriFieldTypeOID"
                },
                "operator": "numberOperatorIs",
                "valueObj": {
                  "isValid": false,
                  "type": "value",
                  "value": null
                },
                "interactiveObj": {
                  "prompt": "OBJECTID is",
                  "hint": ""
                },
                "caseSensitive": false
              }],
              "expr": ""
            },
            "showSQL": true,
            "spatialFilter": {
              "currentMapExtent": null,
              "drawing": null,
              "useFeatures": null,
              "fullLayerExtent": null
            },
            "popupInfo": {
              "readFromWebMap": true
            },
            "orderByFields": [],
            "useLayerSymbol": true,
            "resultsSymbol": null,
            "enableExport": false,
            "singleResultLayer": true,
            "webMapLayerId": "SampleWorldCities_3008"
          }]
        };
        return wm.loadWidget(widgetJson).then(function(widget){
          wm.openWidget(widget);
          assert.strictEqual(widget.taskSettingContainer.style.display,
                            'block',
                            'should show TaskSetting with only one task');
        });
      });

      tdd.test('utils.getDefaultPopupInfo', function(){
        var expectedPopupInfo = {
          "title": "{CITY_NAME}",
          "fieldInfos": [{
            "fieldName": "OBJECTID",
            "label": "OBJECTID",
            "tooltip": "",
            "visible": false,
            "format": null,
            "stringFieldOption": "textbox"
          }, {
            "fieldName": "CITY_NAME",
            "label": "CITY_NAME",
            "tooltip": "",
            "visible": false,
            "format": null,
            "stringFieldOption": "textbox"
          }, {
            "fieldName": "POP",
            "label": "POP",
            "tooltip": "",
            "visible": false,
            "format": {
              "places": 0,
              "digitSeparator": true
            },
            "stringFieldOption": "textbox"
          }, {
            "fieldName": "POP_RANK",
            "label": "POP_RANK",
            "tooltip": "",
            "visible": false,
            "format": {
              "places": 0,
              "digitSeparator": true
            },
            "stringFieldOption": "textbox"
          }, {
            "fieldName": "POP_CLASS",
            "label": "POP_CLASS",
            "tooltip": "",
            "visible": false,
            "format": null,
            "stringFieldOption": "textbox"
          }, {
            "fieldName": "LABEL_FLAG",
            "label": "LABEL_FLAG",
            "tooltip": "",
            "visible": false,
            "format": {
              "places": 0,
              "digitSeparator": true
            },
            "stringFieldOption": "textbox"
          }],
          "description": null,
          "showAttachments": false,
          "mediaInfos": []
        };
        var actualPopupInfo = queryUtils.getDefaultPopupInfo(layerDefinition1, false, false);
        assert.deepEqual(actualPopupInfo, expectedPopupInfo);
      });

      tdd.test('utils.getQueryType', function(){
        var queryType = queryUtils.getQueryType(layerDefinition1);
        assert.strictEqual(queryType, 2);
      });
    });
  });