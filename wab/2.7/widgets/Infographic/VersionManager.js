define(['jimu/shared/BaseVersionManager'],
  function(BaseVersionManager) {

    function VersionManager() {
      this.versions = [{
        version: '1.0',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '1.1',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '1.2',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '1.3',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '1.4',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.0Beta',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.0',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.0.1',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.1',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.2',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.3',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.4',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.5',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.6',
        upgrader: function(oldConfig) {
          var newConfig = oldConfig;
          var dijits = newConfig.dijits;
          var sortOrder;
          for (var i = 0; i < dijits.length; i++) {
            if (dijits[i].type === 'chart') {
              //sortOrder
              sortOrder = dijits[i].config.sortOrder;
              dijits[i].config.sortOrder = {
                isLabelAxis: true,
                isAsc: sortOrder ? sortOrder === 'asc' : true
              };
              if (dijits[i].config.mode === 'feature') {
                dijits[i].config.sortOrder.field = dijits[i].config.labelField;
              }
              //maxLabel
              dijits[i].config.maxLabels = undefined;
              //nullValue
              if (dijits[i].config.mode === 'feature' || dijits[i].mode === 'count') {
                dijits[i].config.nullValue = undefined;
              } else {
                dijits[i].config.nullValue = true;
              }
              //dateConfig
              dijits[i].config.dateConfig = undefined;
              //useLayerSymbology
              dijits[i].config.useLayerSymbology = undefined;
            }
          }
          return newConfig;
        }
      }, {
        version: '2.7',
        upgrader: function(oldConfig) {
          var newConfig = oldConfig;
          var dijits = newConfig.dijits;
          var chartConfig;
          for (var i = 0; i < dijits.length; i++) {
            if (dijits[i].type === 'chart') {
              chartConfig = dijits[i].config;
              break;
            }
          }
          if (!chartConfig || !chartConfig.mode) {
            return newConfig;
          }
          var mode = chartConfig.mode;
          var type = chartConfig.type;

          var valueFields = chartConfig.valueFields;
          /* color and useLayerSymbology upgrade to seriesStyle */
          var colors = chartConfig.colors;
          if (!colors) {
            colors = ['#5d9cd3', '#eb7b3a', '#a5a5a5', '#febf29', '#4673c2', '#72ad4c'];
          }
          var seriesStyle = {};
          //useLayerSymbology
          if (typeof chartConfig.useLayerSymbology !== 'undefined') {
            if (type === 'line') {
              delete chartConfig.useLayerSymbology;
            }
          }
          if (typeof chartConfig.useLayerSymbology !== 'undefined') {
            seriesStyle.useLayerSymbology = chartConfig.useLayerSymbology;
          }

          var notAddedFields = [];
          if (valueFields && valueFields.length > 0) {
            notAddedFields = valueFields;
          }

          var colorAsArray = false;
          if (type === 'column' || type === 'bar' || type === 'line') {
            if (type === 'line' && mode === 'field') {
              notAddedFields = ['line~field'];
            } else {
              if (mode === 'count') {
                notAddedFields = ['count~count'];
              }
            }
          } else if (type === 'pie') {
            if (mode !== 'field') {
              colorAsArray = true;
              notAddedFields = ['pie~not-field'];
            }
          }

          var newStyles = notAddedFields.map(function(item, i) {
            return createSeriesStyle(item, i, colorAsArray, colors);
          }.bind(this));
          seriesStyle.styles = {};
          if (newStyles) {
            seriesStyle.styles = newStyles;
          }
          chartConfig.seriesStyle = seriesStyle;

          if (typeof chartConfig.colors !== 'undefined') {
            delete chartConfig.colors;
          }

          function createSeriesStyle(valueField, index, colorAsArray, colors) {
            var style = {
              name: valueField,
              style: {
                color: getRandomColor(colors, index)
              }
            };

            if (colorAsArray) {
              style.style.color = colors;
            }
            return style;
          }

          function getRandomColor(colors, i) {
            var length = colors.length;
            i = i % length;
            return colors[i];
          }

          /* disable show legend for count and field mode(expect pie)*/
          if (type !== 'pie') {
            if (mode === 'count' || mode === 'field') {
              chartConfig.showLegend = false;
            }
          }
          /* force dateConfig.isNeedFilled is false for pie chart */
          if (type === 'pie') {
            if (chartConfig.dateConfig) {
              chartConfig.dateConfig.isNeedFilled = false;
            }
          }
          return newConfig;
        }
      }];
    }

    VersionManager.prototype = new BaseVersionManager();
    VersionManager.prototype.constructor = VersionManager;
    return VersionManager;
  });