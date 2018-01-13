define([], function() {
  var mo = {
    checkDSIsVaild: function(dataSource, map, appConfig) {
      var isValid = true;
      if (!dataSource) {
        isValid = false;
      } else if (dataSource.dataSourceType === 'DATA_SOURCE_FROM_FRAMEWORK') {
        if (appConfig && appConfig.dataSource && appConfig.dataSource.dataSources) {
          var dataSources = appConfig.dataSource.dataSources;
          var ds = dataSources[dataSource.frameWorkDsId];
          if (!ds) {
            isValid = false;
          }
        } else {
          isValid = false;
        }

      } else if (dataSource.dataSourceType === 'DATA_SOURCE_FEATURE_LAYER_FROM_MAP') {
        var layerId = dataSource.layerId;
        if (layerId && map) {
          var layer = map.getLayer(layerId);
          if (!layer) {
            isValid = false;
          }
        } else {
          isValid = false;
        }
      }
      return isValid;
    }
  };

  return mo;
});