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
              if(dijits[i].config.mode === 'feature'){
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
      }];
    }

    VersionManager.prototype = new BaseVersionManager();
    VersionManager.prototype.constructor = VersionManager;
    return VersionManager;
  });