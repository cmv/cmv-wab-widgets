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
  'jimu/BaseWidgetSetting',
  'jimu/utils',
  'dojo/dom-attr',
  'dojo/dom-construct',
  'dojo/dom-style',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./ChartLayout.html',
  'dojox/charting/Chart',
  'dojox/charting/plot2d/Pie',
  'dojox/charting/action2d/Tooltip',
  'dojox/charting/action2d/Highlight',
  'dojox/charting/action2d/MoveSlice',
  'dojox/charting/plot2d/Spider',
  'dojox/charting/widget/SelectableLegend',
  'dojox/charting/action2d/Magnify',
  'dojo/_base/array',
  'dojox/charting/Theme',
  'dojo/Evented',
  'dojox/charting/plot2d/Bars',
  'dojox/charting/axis2d/Default',
  'dojox/charting/plot2d/Lines'
], function (
  BaseWidgetSetting,
  jimuUtils,
  domAttr,
  domConstruct,
  domStyle,
  declare,
  lang,
  _WidgetsInTemplateMixin,
  template,
  Chart,
  Pie,
  Tooltip,
  Highlight,
  MoveSlice,
  Spider,
  SelectableLegend,
  Magnify,
  array,
  Theme,
  Evented
) {
  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin, Evented], {
    baseClass: 'jimu-widget-RelatedTableCharts-layout',
    templateString: template,

    postCreate: function () {
      this.inherited(arguments);
    },

    startup: function () {
      this._createChartLayout();
    },

    /**
     * create chart layout
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _createChartLayout: function () {
      this._setNodeValue(this.layoutHeaderTitle, this.config.chartConfig.chartTitle, true);
      this._setNodeValue(this.chartDescription, this.config.chartConfig.description, false);
      this._initChart();
    },

    /**
     * Resize the chart after specified duration timeout
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    resizeChart: function (duration) {
      if (this.chart) {
        setTimeout(lang.hitch(this, function () {
          //in case of pie chart recreate the chart
          if (this.config.chartConfig.chartType !== "PieChart") {
            this.chart.resize();
          } else {
            this._initChart();
          }
          this.onChartResize();
        }), duration);
      }
    },

    /**
     * Set node value with configured fields
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _setNodeValue: function (node, configuredValue, isSetTitle) {
      var fieldValue = configuredValue;
      if (!this.config.isPreview) {
        fieldValue = this._getFieldValues(configuredValue, this.config.selectedFeature.attributes);
      }
      if (fieldValue) {
        //get valid html input string
        fieldValue = jimuUtils.sanitizeHTML(fieldValue);
        domAttr.set(node, "innerHTML", fieldValue);
        if (isSetTitle) {
          domAttr.set(node, "title", fieldValue);
        }
      } else {
        //hide node if respective configured attribute value is null
        domStyle.set(node, "display", "none");
      }
    },

    /**
     * initialize chart based on the configuration
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _initChart: function () {
      switch (this.config.chartConfig.chartType) {
        case "BarChart":
          this._createBarChart();
          break;
        case "PieChart":
          this._createPieChart();
          break;
        case "PolarChart":
          this._createPolarChart();
          break;
        case "LineChart":
          this._createLineChart();
          break;
        default:
          domAttr.set(this.chartContainer, "innerHTML", this.nls.errMsgNoFeaturesFound);
      }
    },

    /**
     * calculates the height of the bar chart containers based on number of bars
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _getBarChartContainerHeight: function () {
      var chartHeight = 30;
      if (this.config.chartData.chartSeries.length > 0) {
        chartHeight = this.config.chartData.chartSeries.length * 30;
      }
      if (this.config.isPreview) {
        if (chartHeight <= 150) {
          chartHeight += 150;
        }
      } else {
        if (chartHeight <= 150) {
          chartHeight += 100;
        }
      }
      chartHeight = chartHeight + "px";
      return chartHeight;
    },

    /**
     * create bar chart as per the settings
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _createBarChart: function () {
      var chart, yAxis = {},
        xAxis = {},
        chartHeight = 40,
        fontFamily, fontSize,
        fontColor, chartSeriesProps = {};
      domConstruct.empty(this.chartContainer);
      chartHeight = this._getBarChartContainerHeight();
      chart = new Chart(domConstruct.create("div", {
        "style": "overflow:hidden; width:100%; height:" + chartHeight
      }, this.chartContainer));
      // Add the only/default plot
      chart.addPlot("default", {
        type: "Bars",
        gap: 4,
        minBarSize: 10,
        maxBarSize: 15
      });
      fontFamily = domStyle.get(this.chartDescription, "fontFamily");
      fontSize = domStyle.get(this.chartDescription, "fontSize");
      fontColor = domStyle.get(this.chartDescription, "color");
      //set yAxis data
      yAxis = {
        labels: this.config.chartData.chartLabels,
        maxLabelCharCount: 35,
        trailingSymbol: "...",
        natural: true,
        majorTickStep: 1,
        minorTicks: false,
        fixUpper: true,
        includeZero: false,
        vertical: true,
        titleFontColor: fontColor,
        titleFont: "normal normal normal " + fontSize + ' ' + fontFamily,
        font: "normal normal normal 9px" + ' ' + fontFamily
      };
      if (window.isRTL) {
        yAxis.leftBottom = false;
        chart.setDir("rtl");
      }
      xAxis = {
        fixLower: "major",
        fixUpper: "major",
        minorTicks: false,
        includeZero: true,
        titleFontColor: fontColor,
        titleFont: "normal normal normal " + fontSize + ' ' + fontFamily,
        font: "normal normal normal 9px" + ' ' + fontFamily
      };
      //set chart options based on if it is for preview or not
      if (this.config.isPreview) {
        xAxis.titleGap = 5;
        yAxis.majorTick = {
          length: 0
        };
        xAxis.majorTick = {
          length: 0
        };
        yAxis.majorLabels = false;
        xAxis.majorLabels = false;
        yAxis.minorLabels = false;
        xAxis.minorLabels = false;
        yAxis.title = this.config.chartConfig.labelYAxis;
        xAxis.title = this.config.chartConfig.labelXAxis;
        chartSeriesProps.stroke = {
          width: 0
        };
      } else {
        new Tooltip(chart, "default");
        yAxis.title = this._getFieldValues(this.config.chartConfig.labelYAxis,
          this.config.selectedFeature.attributes);
        xAxis.title = this._getFieldValues(this.config.chartConfig.labelXAxis,
          this.config.selectedFeature.attributes);
        chartSeriesProps.stroke = {
          width: 1
        };
      }
      xAxis.titleOrientation = "away";
      //add chart axis
      chart.addAxis("y", yAxis);
      chart.addAxis("x", xAxis);
      //If theme is selected, apply the same on chart
      if (this.config.chartData.selectedTheme) {
        chart.setTheme(this.config.chartData.selectedTheme);
      }
      //set chart series Properties
      //If the fill color is specified then apply it
      if (this.config.chartData.fill) {
        chartSeriesProps.fill = this.config.chartData.fill;
      }
      //add chart series
      array.forEach(this.config.chartData.chartSeries, function (eachSeries, index) {
        eachSeries.x = index + 1;
        eachSeries.y = eachSeries.y;
        chart.addSeries(index + 1, [eachSeries], chartSeriesProps, {
          plot: "default"
        });
      }, this);
      //set chart animations and highlights
      new Highlight(chart, "default");
      //Render the chart
      chart.render();
      this.chart = chart;
      this.onChartCreated();
    },

    /**
     * This function is used to create line chart as per the configuration settings.
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _createLineChart: function () {
      var chartHeight, chart, yAxis, fontFamily, fontSize, fontColor, xAxis, chartSeriesProps,
        chartMarkerLen, chartMarkerArray;
      // Set marker style
      chartSeriesProps = {};
      chartSeriesProps.marker = Theme.defaultMarkers.CIRCLE;
      chartSeriesProps.markerStroke = {
        width: 1
      };
      // Empty chart height container
      domConstruct.empty(this.chartContainer);
      // Set chart height
      if (this.config.isPreview) {
        chartHeight = "300px";
      } else {
        chartHeight = "270px";
      }
      // Create new chart object
      chart = new Chart(domConstruct.create("div", {
        "style": "overflow:hidden; width:100%; height:" + chartHeight
      }, this.chartContainer));
      // Fetch font related information
      fontFamily = domStyle.get(this.chartDescription, "fontFamily");
      fontSize = domStyle.get(this.chartDescription, "fontSize");
      fontColor = domStyle.get(this.chartDescription, "color");
      // Set yAxis data
      yAxis = {
        maxLabelCharCount: 30,
        trailingSymbol: "...",
        natural: true,
        vertical: true,
        titleGap: 0,
        titleFontColor: fontColor,
        titleFont: "normal normal normal " + fontSize + ' ' + fontFamily,
        max: this._calculateMajorTickStep(true, true),
        majorLabels: true,
        minorTicks: true,
        minorLabels: true,
        microTicks: false,
        fixLower: "major",
        fixUpper: "major",
        majorTickStep: this._calculateMajorTickStep(true, false)
      };
      this._setLineChartYaxisMin(yAxis);
      if (!(this.config.isPreview)) {
        yAxis.font = "normal normal bold 9px" + ' ' + fontFamily;
      }
      // Reverse the direction of chart in RTL language
      if (window.isRTL) {
        yAxis.leftBottom = false;
        chart.setDir("rtl");
      }
      // Set xAxis data
      xAxis = {
        labels: this.config.chartData.chartLabels[0],
        maxLabelCharCount: 35,
        trailingSymbol: "...",
        titleGap: 0,
        titleFontColor: fontColor,
        titleFont: "normal normal normal " + fontSize + ' ' + fontFamily,
        font: "normal normal bold " +
          this._calculateXAxisLabelFontSize(this.config.chartData.chartLabels[0].length) +
          "px" + ' ' + fontFamily,
        titleOrientation: "away",
        rotation: -90,
        minorLabels: true,
        majorLabels: true,
        minorTicks: true,
        microTicks: false,
        max: this.config.chartData.chartLabels[0].length + 0.5,
        min: 0.5
      };
      // Set chart options based on if it is for preview or not
      if (this.config.isPreview) {
        yAxis.minorLabels = false;
        yAxis.majorLabels = true;
        yAxis.title = this.config.chartConfig.labelYAxis;
        xAxis.minorLabels = true;
        xAxis.majorLabels = true;
        xAxis.title = this.config.chartConfig.labelXAxis;
        xAxis.max = 11;
        chartSeriesProps.stroke = {
          width: 1
        };
      } else {
        yAxis.title = this._getFieldValues(this.config.chartConfig.labelYAxis,
          this.config.selectedFeature.attributes);
        xAxis.title = this._getFieldValues(this.config.chartConfig.labelXAxis,
          this.config.selectedFeature.attributes);
        chartSeriesProps.stroke = {
          width: 1
        };
      }
      // Add the only/default plot
      chart.addPlot("default", {
        type: "Lines",
        markers: true,
        styleFunc: lang.hitch(this, function (item) {
          var fieldValueColor;
          if (this.config.chartConfig.chartColor &&
            this.config.chartConfig.chartColor.colorType === "ColorByFieldValue") {
            fieldValueColor = this.config.chartConfig.chartColor.colorInfo.layerFieldValues[item];
            if (fieldValueColor) {
              return {
                fill: fieldValueColor
              };
            }
            return {
              fill: "#000000"
            };
          }
          if (this.config.isPreview) {
            return {
              fill: "#0000ff"
            };
          } else {
            return {
              fill: "#000000"
            };
          }
        })
      });
      // Add yAxis
      chart.addAxis("y", yAxis);
      // Add xAxis
      chart.addAxis("x", xAxis);
      // If theme is selected, apply the same on chart
      if (this.config.chartData.selectedTheme) {
        chart.setTheme(this.config.chartData.selectedTheme);
      }
      // Single color option of line
      if (this.config.chartData.fill) {
        chartSeriesProps.stroke.color = this.config.chartData.fill;
      }
      // add markerStyle
      chartMarkerArray = Object.keys(Theme.defaultMarkers);
      // swap CROSS marker with TRIANGLE marker
      if (chartMarkerArray[3] && chartMarkerArray[5]) {
        this.swap(chartMarkerArray, 3, 5);
      }
      // swap X marker with TRIANGLE_INVERTED marker
      if (chartMarkerArray[4] && chartMarkerArray[6]) {
        this.swap(chartMarkerArray, 4, 6);
      }
      chartMarkerLen = chartMarkerArray.length;
      // Add the chart series data
      array.forEach(this.config.chartData.chartSeries, lang.hitch(this, function (chartSeriesObj, index) {
        var seriesName, chartMarkerIndex;
        if (chartSeriesObj[0] && chartSeriesObj[0].seriesName) {
          seriesName = chartSeriesObj[0].seriesName;
        } else {
          seriesName = this.nls.ChartSetting.layoutSeriesLabel + " " + index;
        }
        if ((this.config.chartConfig.chartColor &&
            this.config.chartConfig.chartColor.colorType === "ColorByFieldValue") ||
          (this.config.isPreview)) {
          chartSeriesProps.stroke.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
        // add markerStyle to single color
        if (this.config.chartData.fill) {
          if (index < chartMarkerLen) {
            chartSeriesProps.marker = Theme.defaultMarkers[chartMarkerArray[index]];
          } else {
            chartMarkerIndex = index % chartMarkerLen;
            chartSeriesProps.marker = Theme.defaultMarkers[chartMarkerArray[chartMarkerIndex]];
          }
        }
        chart.addSeries(seriesName, chartSeriesObj, lang.clone(chartSeriesProps));
      }));
      // Set chart animation & highlights
      new Tooltip(chart, "default");
      new Highlight(chart, "default");
      new Magnify(chart, "default");
      // Render the chart!
      chart.render();
      this.chart = chart;
      // create & display chart legend
      domStyle.set(this.legendContainer, "display", "block");
      // hide the legend when there is only one series
      if (this.config.chartData.chartSeries.length > 1) {
        this._createChartLegend(chart, true);
      }
      this.onChartCreated();
    },

    /**
     * This function is used to swap chart marker symbol
     * @param {array} input: chart marker array
     * @param {number} index_A: index of marker 1
     * @param {number} index_B: index of marker 2
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    swap: function (input, index_A, index_B) {
      var temp = input[index_A];
      input[index_A] = input[index_B];
      input[index_B] = temp;
    },

    /**
     * This function is used to calculate XAxis Label FontSize depending upon xAxis label length
     * @param {number} xAxisLabelLength: length of X axis label
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _calculateXAxisLabelFontSize: function (xAxisLabelLength) {
      switch (true) {
        case (xAxisLabelLength < 20):
          return 9;
        case (xAxisLabelLength >= 20):
          return 9;
        default:
          return 9;
      }
    },

    /**
     * This function is used to calculate major tick step depending upon the highest value in the
     * chart data series
     * @param {boolean} isYaxis: Flag to check Y Axis
     * @param {boolean} returnHighestValue: Flag to return highest value
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _calculateMajorTickStep: function (isYaxis, returnHighestValue) {
      var xyAxisValueArr, highestValue;
      xyAxisValueArr = [];
      if (isYaxis) {
        this.config.chartData.chartSeries.forEach(lang.hitch(this, function (chartSeriesObj) {
          chartSeriesObj.forEach(lang.hitch(this, function (chartSeriesValue) {
            if (returnHighestValue) {
              xyAxisValueArr.push(chartSeriesValue.y);
            } else {
              xyAxisValueArr.push(Math.abs(chartSeriesValue.y));
            }
          }));
        }));
      }
      if (xyAxisValueArr.length > 0) {
        highestValue = Math.max.apply(null, xyAxisValueArr);
        if (returnHighestValue) {
          return highestValue + 1;
        }
        highestValue = highestValue / 20;
        highestValue = Math.round(highestValue) ? Math.round(highestValue) : highestValue;
      } else {
        highestValue = null;
      }
      return Math.abs(highestValue);
    },

    /**
     * create pie chart as per the settings
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _createPieChart: function () {
      var chart, chartNodeDiv, plotObject = {};
      domConstruct.empty(this.chartContainer);
      chartNodeDiv = domConstruct.create("div", {
        "style": "width:100%; height:100%; overflow:auto"
      }, this.chartContainer);
      chart = new Chart(chartNodeDiv);
      plotObject = {
        type: Pie,
        labels: true,
        ticks: true,
        fixed: true,
        precision: 0,
        labelWiring: "#ccc",
        labelStyle: "columns",
        htmlLabels: true,
        startAngle: -10,
        maxLabelCharCount: 20,
        trailingSymbol: "..."
      };
      //if label field is not selected then don't show the labels
      if (this.config.chartConfig.labelField === "esriCTEmptyOption") {
        plotObject.labels = false;
      }
      //set chart plot
      chart.addPlot("default", plotObject);
      //if chart is not for preview then set tooltips
      if (!this.config.isPreview) {
        new Tooltip(chart, "default");
      }
      //If the fill color is specified then apply the it
      if (this.config.chartData.fill) {
        chart.addSeries(this.config.chartConfig.dataSeriesField,
          this.config.chartData.chartSeries, {
            fill: this.config.chartData.fill
          }, {
            plot: "default"
          });
      } else {
        chart.addSeries(this.config.dataSeriesField, this.config.chartData.chartSeries, {
          plot: "default"
        });
      }
      //If theme is selected, apply the same on chart
      if (this.config.chartData.selectedTheme) {
        chart.setTheme(this.config.chartData.selectedTheme);
      }
      //set chart animations and highlights
      new MoveSlice(chart, "default");
      new Highlight(chart, "default");
      //Render the chart
      chart.render();
      this.chart = chart;
      this.onChartCreated();
    },

    /**
     * create polar chart as per the settings
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _createPolarChart: function () {
      var chartNodeDiv, chart, key, fontFamily, seriesFillAlphaValue = 0.2,
        dataObj, i, showLegend = false;
      if (this.chart) {
        this.chart.destroy();
      }
      domConstruct.empty(this.chartContainer);
      domStyle.set(this.chartContainer, "direction", "inherit");
      chartNodeDiv = domConstruct.create("div", {
        "style": "width:100%; height:100%; overflow:hidden"
      }, this.chartContainer);
      fontFamily = domStyle.get(this.chartDescription, "fontFamily");
      chart = new Chart(chartNodeDiv);
      //set polygon opacity for polar chart if 'polygonFill' is set to true in config
      if (!this.config.chartConfig.showPolygonFill) {
        seriesFillAlphaValue = 0;
      }
      chart.addPlot("default", {
        type: Spider,
        labelOffset: -10,
        divisions: 5,
        seriesFillAlpha: seriesFillAlphaValue,
        markerSize: 3,
        precision: 0,
        spiderType: "polygon",
        axisFont: "normal normal normal 9px/25px" + ' ' + fontFamily
      });
      //If theme is selected, apply the same on chart
      if (this.config.chartData.selectedTheme) {
        chart.setTheme(this.config.chartData.selectedTheme);
      } else if (this.config.chartConfig.chartColor.colorInfo && this.config.chartConfig
        .chartColor.colorInfo.layerField) {
        showLegend = true;
      }
      //add series to chart
      for (i = 0; i < this.config.chartData.chartSeries.length; i++) {
        dataObj = this.config.chartData.chartSeries[i];
        for (key in dataObj) {
          if (dataObj.hasOwnProperty(key)) {
            if (this.config.chartData.fill) {
              //set chart series Properties
              //If the fill color is specified then apply it
              chart.addSeries(key, dataObj[key], {
                fill: this.config.chartData.fill
              });
            } else if (dataObj[key].fill) {
              chart.addSeries(key, dataObj[key], {
                fill: dataObj[key].fill,
                legend: dataObj[key].legendLabel
              });
            } else {
              chart.addSeries(key, dataObj[key]);
            }
          }
        }
      }
      //if chart is not for preview then set tooltips
      if (!this.config.isPreview) {
        new Tooltip(chart, "default");
      }
      new Highlight(chart, "default");
      new Magnify(chart, "default", {
        duration: 800,
        scale: 1.5
      });
      chart.render();
      this.chart = chart;
      //if chart is not for preview and coloy by field value option is configured then only show
      //legend panel for polar graph
      if (!this.config.isPreview && showLegend) {
        domStyle.set(this.legendContainer, "display", "block");
        this._createChartLegend(chart, true);
      }
      this.onChartCreated();
    },

    /**
     * create legend for chart
     *  @param {object} chart: chart
     *  @param {boolean} displayHorizontal: Flag to display horizontal
     *  @memberOf widgets/RelatedTableCharts/charLayout
     */
    _createChartLegend: function (chart, displayHorizontal) {
      setTimeout(lang.hitch(this, function () {
        if (this.legend) {
          //destroy old legend instance
          this.legend.destroy();
          this.legend = null;
        }
        domConstruct.empty(this.legendNode);
        this.legend = new SelectableLegend({
          chart: chart,
          horizontal: displayHorizontal
        }, domConstruct.create("div", {}, this.legendNode));
        this.emit("setFocusNodes");
      }), 1500);
    },

    /**
     * callback which confirms the creation of particular chart
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    onChartCreated: function () {
    },

    onChartResize: function () {
    },

    /**
     * fetch field values from the feature attributes
     * @memberOf widgets/RelatedTableCharts/charLayout
     */
    _getFieldValues: function (inputString, attributes) {
      var inputSubFieldsArr, outputString = '',
        inputFieldsArr, i, j;
      inputString = inputString.replace(/(\n|\r|\r\n)/g, '<br>');
      inputFieldsArr = inputString.split('{');
      for (i = 0; i < inputFieldsArr.length; i++) {
        if (i === 0) {
          outputString += inputFieldsArr[i];
        } else {
          if (inputFieldsArr[i].indexOf('}') !== -1) {
            inputSubFieldsArr = inputFieldsArr[i].split("}");
            for (j = 0; j < inputSubFieldsArr.length; j++) {
              if (j === 0) {
                if (attributes[inputSubFieldsArr[j]] || attributes[inputSubFieldsArr[j]] === 0) {
                  outputString += attributes[inputSubFieldsArr[j]];
                }
              } else if (j === 1) {
                outputString += inputSubFieldsArr[j];
              } else {
                outputString += "}" + inputSubFieldsArr[j];
              }
            }
          } else {
            outputString += "{";
          }
        }
      }
      return outputString;
    },

    /**
     * This function used to set y-axis min to zero
     * if all y-axis values are positive
     * else set min to one number greater than y-axis min value
     */
    _setLineChartYaxisMin: function (yAxisPropertiesObj) {
      var yAxisPositiveValueArr, yAxisAllValueArr, minimumValue;
      yAxisPositiveValueArr = [];
      yAxisAllValueArr = [];
      array.forEach(this.config.chartData.chartSeries, lang.hitch(this, function (chartSeriesObj) {
        array.forEach(chartSeriesObj, lang.hitch(this, function (chartSeriesValue) {
          if (chartSeriesValue.y >= 0) {
            yAxisPositiveValueArr.push(chartSeriesValue.y);
          }
          yAxisAllValueArr.push(chartSeriesValue.y);
        }));
      }));
      // if all y-axis values are positive then set y-axis min to 0
      // else set min to one number greater than y-axis min value
      if (yAxisPositiveValueArr.length === yAxisAllValueArr.length) {
        yAxisPropertiesObj.min = 0;
      } else {
        minimumValue = Math.min.apply(null, yAxisAllValueArr);
        yAxisPropertiesObj.min = minimumValue - 1;
      }
    }
  });
});