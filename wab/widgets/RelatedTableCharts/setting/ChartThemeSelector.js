/*global dojo, dojox*/
///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
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
    "jimu/BaseWidgetSetting",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./ChartThemeSelector.html',
    'dojo/_base/lang',
    'dojox/charting/Chart2D',
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dojo/_base/array'
  ],
  function (declare, BaseWidgetSetting, _WidgetsInTemplateMixin,
    ThemeSelectorTemplate, lang, Chart2D, on, domStyle, domAttr, domConstruct,
    array) {

    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-RelatedTableCharts-setting',
      templateString: ThemeSelectorTemplate,
      //objet to maintain the selected theme
      selectedTheme: null,
      //predefined themes to be shown in the dropdown
      themes: [ {
        "themeName": "Adobebricks",
        "className": "dojox/charting/themes/Adobebricks"
      }, {
        "themeName": "Algae",
        "className": "dojox/charting/themes/Algae"
      }, {
        "themeName": "Bahamation",
        "className": "dojox/charting/themes/Bahamation"
      }, {
        "themeName": "BlueDusk",
        "className": "dojox/charting/themes/BlueDusk"
      }, {
        "themeName": "CubanShirts",
        "className": "dojox/charting/themes/CubanShirts"
      }, {
        "themeName": "Desert",
        "className": "dojox/charting/themes/Desert"
      }, {
        "themeName": "Distinctive",
        "className": "dojox/charting/themes/Distinctive"
      }, {
        "themeName": "Dollar",
        "className": "dojox/charting/themes/Dollar"
      }, {
        "themeName": "Grasshopper",
        "className": "dojox/charting/themes/Grasshopper"
      }, {
        "themeName": "Grasslands",
        "className": "dojox/charting/themes/Grasslands"
      }, {
        "themeName": "GreySkies",
        "className": "dojox/charting/themes/GreySkies"
      }, {
        "themeName": "Harmony",
        "className": "dojox/charting/themes/Harmony"
      }, {
        "themeName": "IndigoNation",
        "className": "dojox/charting/themes/IndigoNation"
      }, {
        "themeName": "Ireland",
        "className": "dojox/charting/themes/Ireland"
      }, {
        "themeName": "MiamiNice",
        "className": "dojox/charting/themes/MiamiNice"
      }, {
        "themeName": "Minty",
        "className": "dojox/charting/themes/Minty"
      }, {
        "themeName": "PurpleRain",
        "className": "dojox/charting/themes/PurpleRain"
      }, {
        "themeName": "RoyalPurples",
        "className": "dojox/charting/themes/RoyalPurples"
      }, {
        "themeName": "SageToLime",
        "className": "dojox/charting/themes/SageToLime"
      }, {
        "themeName": "Tufte",
        "className": "dojox/charting/themes/Tufte"
      }, {
        "themeName": "WatersEdge",
        "className": "dojox/charting/themes/WatersEdge"
      }, {
        "themeName": "Wetland",
        "className": "dojox/charting/themes/Wetland"
      }, {
        "themeName": "PlotKit.blue",
        "className": "dojox/charting/themes/PlotKit/blue"
      }, {
        "themeName": "PlotKit.cyan",
        "className": "dojox/charting/themes/PlotKit/cyan"
      }, {
        "themeName": "PlotKit.green",
        "className": "dojox/charting/themes/PlotKit/green"
      }, {
        "themeName": "PlotKit.orange",
        "className": "dojox/charting/themes/PlotKit/orange"
      }, {
        "themeName": "PlotKit.purple",
        "className": "dojox/charting/themes/PlotKit/purple"
      }, {
        "themeName": "PlotKit.red",
        "className": "dojox/charting/themes/PlotKit/red"
      }],

      postCreate: function () {
        //chaeck if thems array is defined and have atleast one theme
        if (this.themes && this.themes.length > 0) {
          //by default show first theme from the theme array
          this.selectedTheme = lang.clone(this.themes[0]);
          //create theme list to be shown in selector
          this._createThemeList();
        }
      },

      destroy: function () {
        this.inherited(arguments);
      },

      /**
      * Function which will be invoked on clicking dropdown node
      * and Show/Hide the dropdown list
      * @memberOf widgets/RelatedTableCharts/settings/ChartThemeSelector.js
      **/
      _onDropDownClick: function () {
        if (domStyle.get(this.themeChooseNode, 'display') === 'none') {
          this.showChooseNode();
        } else {
          this.hideChooseNode();
        }
      },

      /**
      * Function to show dropdown list
      * @memberOf widgets/RelatedTableCharts/settings/ChartThemeSelector.js
      **/
      showChooseNode: function () {
        domStyle.set(this.themeChooseNode, 'display', '');
      },

      /**
      * Function to hide dropdown list
      * @memberOf widgets/RelatedTableCharts/settings/ChartThemeSelector.js
      **/
      hideChooseNode: function () {
        domStyle.set(this.themeChooseNode, 'display', 'none');
      },

      /**
      * Function to create list of themes
      * @memberOf widgets/RelatedTableCharts/settings/ChartThemeSelector.js
      **/
      _createThemeList: function () {
        var requireTheme = [];
        //create require class array to load themes
        array.forEach(this.themes, function (theme) {
          requireTheme.push(theme.className);
        });
        //load all the themes
        require(requireTheme, lang.hitch(this, function () {
          array.forEach(this.themes, lang.hitch(this, function (
            theme) {
            var row, rowChart, rowLabel, chart;
            row = domConstruct.create("div", {
              "class": "esriCTThemeItem",
              "title": theme.themeName
            }, this.themeList);
            //set the attributes for each row, which will be used to set the selected theme object
            domAttr.set(row, "ThemeName", theme.themeName);
            domAttr.set(row, "ThemeClass", theme.className);
            //handle row click event and show the selected theme
            on(row, "click", lang.hitch(this, function () {
              var selectedTheme = {
                "themeName": domAttr.get(row,
                  "ThemeName"),
                "className": domAttr.get(row,
                  "ThemeClass")
              };
              this.selectTheme(selectedTheme);
            }));

            rowChart = dojo.create("div", {
              "class": "esriCTThemeChart"
            }, row);
            rowLabel = dojo.create("div", {
              "class": "esriCTThemeName"
            }, row);
            chart = domConstruct.create("div", {},
              rowChart);
            domConstruct.create("div", {
              className: "title",
              innerHTML: theme.themeName
            }, rowLabel);
            this._createChart(theme.themeName, chart);
          }));
          //by default show first theme from the theme array as selected
          this.selectTheme(this.selectedTheme);
        }));

      },

      /**
      * Function to create chart using theme name
      * @memberOf widgets/RelatedTableCharts/settings/ChartThemeSelector.js
      **/
      _createChart: function (theme, chartContiner) {
        var chartDiv, chart;
        chartDiv = domConstruct.create("div", {
          className: "chart"
        }, chartContiner);
        //create chart object
        chart = new Chart2D(chartDiv);
        //set the selected theme
        chart.setTheme(dojo.getObject("dojox.charting.themes." + theme));
        chart.addPlot("default", {
          type: "Pie",
          radius: 11,
          labels: false,
          radGrad: dojox.gfx.renderer === "vml" ? "fan" : "native"
        });
        //add static series to show chart
        chart.addSeries("Series A", [0.35, 0.25, 0.42, 0.53, 0.69]);
        chart.render();
      },

      /**
      * Function to show the selected theme and generate the event
      * @memberOf widgets/RelatedTableCharts/settings/ChartThemeSelector.js
      **/
      selectTheme: function (theme) {
        //empty selectedThemeContainer
        domConstruct.empty(this.selectedThemeChart);
        //set newly selected theme
        this.selectedTheme = {
          "themeName": theme.themeName,
          "className": theme.className
        };
        //show selected theme in selectedThemeContainer
        this._createChart(theme.themeName, this.selectedThemeChart);
        domAttr.set(this.selectedThemeName, "innerHTML", theme.themeName);
        //call this method to close drop list
        this.hideChooseNode();
        //generate event
        this.onThemeSelect(this.selectedTheme);
      },

      /**
      * Event which will be generated on selecting any theme
      * @param {object} selectedTheme : object containing selected themeName and className
      * @memberOf widgets/RelatedTableCharts/settings/FieldSelector.js
      **/
      onThemeSelect: function (selectedTheme) { /*jshint unused: false*/ }
    });
  });